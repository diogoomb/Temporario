// $('#mapDIV').css("height", "88%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'


$('.ine').html('<strong>Fonte: </strong>INE, Recenseamento da população e habitação.');

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
var contornoFreg2001 = L.geoJSON(dadosRelativosFreguesias11,{
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

///////////////////////////----------------------- DADOS ABSOLUTOS, CONCELHO--------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Alojamentos PROPRIEDADES OCUPANTES 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalAlojResiHabiConc11 = 99999;
var maxTotalAlojResiHabiConc11 = 0;
function estiloTotalAlojResiHabiConc11(feature, latlng) {
    if(feature.properties.Enc_Tot11< minTotalAlojResiHabiConc11 || feature.properties.Enc_Tot11 ===0){
        minTotalAlojResiHabiConc11 = feature.properties.Enc_Tot11
    }
    if(feature.properties.Enc_Tot11> maxTotalAlojResiHabiConc11){
        maxTotalAlojResiHabiConc11 = feature.properties.Enc_Tot11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Tot11,0.2)
    });
}
function apagarTotalAlojResiHabiConc11(e){
    var layer = e.target;
    TotalAlojResiHabiConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalAlojResiHabiConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos familiares clássicos de residência habitual de propriedade dos ocupantes: ' + '<b>' +feature.properties.Enc_Tot11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalAlojResiHabiConc11,
    })
};

var TotalAlojResiHabiConc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalAlojResiHabiConc11,
    onEachFeature: onEachFeatureTotalAlojResiHabiConc11,
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




var slideTotalAlojResiHabiConc11 = function(){
    var sliderTotalAlojResiHabiConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalAlojResiHabiConc11, {
        start: [minTotalAlojResiHabiConc11, maxTotalAlojResiHabiConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAlojResiHabiConc11,
            'max': maxTotalAlojResiHabiConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAlojResiHabiConc11);
    inputNumberMax.setAttribute("value",maxTotalAlojResiHabiConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalAlojResiHabiConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalAlojResiHabiConc11.noUiSlider.set([null, this.value]);
    });

    sliderTotalAlojResiHabiConc11.noUiSlider.on('update',function(e){
        TotalAlojResiHabiConc11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Tot11>=parseFloat(e[0])&& layer.feature.properties.Enc_Tot11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalAlojResiHabiConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotalAlojResiHabiConc11.noUiSlider;
    $(slidersGeral).append(sliderTotalAlojResiHabiConc11);
}
contorno.addTo(map)
TotalAlojResiHabiConc11.addTo(map);
$('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes, em 2011, por concelho.' + '</strong>');
legenda(maxTotalAlojResiHabiConc11, ((maxTotalAlojResiHabiConc11-minTotalAlojResiHabiConc11)/2).toFixed(0),minTotalAlojResiHabiConc11,0.2);
slideTotalAlojResiHabiConc11();

///////////////////////////-------------------- FIM TOTAL Alojamentos PROPRIEDADES OCUPANTES 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- SEM ENCARGOS, EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minSemEncargosConc11= 99999;
var maxSemEncargosConc11 = 0;
function estiloSemEncargosConc11(feature, latlng) {
    if(feature.properties.Enc_Sem11< minSemEncargosConc11 || feature.properties.Enc_Sem11 ===0){
        minSemEncargosConc11 = feature.properties.Enc_Sem11
    }
    if(feature.properties.Enc_Sem11> maxSemEncargosConc11){
        maxSemEncargosConc11 = feature.properties.Enc_Sem11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Sem11,0.2)
    });
}
function apagarSemEncargosConc11(e){
    var layer = e.target;
    SemEncargosConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureSemEncargosConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem encargos mensais: ' + '<b>' +feature.properties.Enc_Sem11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarSemEncargosConc11,
    })
};

var SemEncargosConc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloSemEncargosConc11,
    onEachFeature: onEachFeatureSemEncargosConc11,
});

var slideSemEncargosConc11 = function(){
    var sliderSemEncargosConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderSemEncargosConc11, {
        start: [minSemEncargosConc11, maxSemEncargosConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minSemEncargosConc11,
            'max': maxSemEncargosConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minSemEncargosConc11);
    inputNumberMax.setAttribute("value",maxSemEncargosConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderSemEncargosConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSemEncargosConc11.noUiSlider.set([null, this.value]);
    });

    sliderSemEncargosConc11.noUiSlider.on('update',function(e){
        SemEncargosConc11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Sem11>=parseFloat(e[0])&& layer.feature.properties.Enc_Sem11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderSemEncargosConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderSemEncargosConc11.noUiSlider;
    $(slidersGeral).append(sliderSemEncargosConc11);
}
///////////////////////////-------------------- FIM SEM ENCARGOS, EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- COM ENCARGOS, EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minComEncargosConc11 = 99999;
var maxComEncargosConc11 = 0;
function estiloComEncargosConc11(feature, latlng) {
    if(feature.properties.Enc_Com11< minComEncargosConc11 || minComEncargosConc11 ===0){
        minComEncargosConc11 = feature.properties.Enc_Com11
    }
    if(feature.properties.Enc_Com11> maxComEncargosConc11){
        maxComEncargosConc11 = feature.properties.Enc_Com11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Com11,0.2)
    });
}
function apagarComEncargosConc11(e){
    var layer = e.target;
    ComEncargosConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureComEncargosConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com encargos mensais: ' + '<b>' +feature.properties.Enc_Com11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarComEncargosConc11,
    })
};

var ComEncargosConc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloComEncargosConc11,
    onEachFeature: onEachFeatureComEncargosConc11,
});

var slideComEncargosConc11 = function(){
    var sliderComEncargosConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderComEncargosConc11, {
        start: [minComEncargosConc11, maxComEncargosConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minComEncargosConc11,
            'max': maxComEncargosConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minComEncargosConc11);
    inputNumberMax.setAttribute("value",maxComEncargosConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderComEncargosConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderComEncargosConc11.noUiSlider.set([null, this.value]);
    });

    sliderComEncargosConc11.noUiSlider.on('update',function(e){
        ComEncargosConc11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Com11>=parseFloat(e[0])&& layer.feature.properties.Enc_Com11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderComEncargosConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderComEncargosConc11.noUiSlider;
    $(slidersGeral).append(sliderComEncargosConc11);
}
///////////////////////////-------------------- FIM COM ENCARGOS, EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MENOS 1OO€, EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minMenos100Conc11= 99999;
var maxMenos100Conc11 = 0;
function estiloMenos100Conc11(feature, latlng) {
    if(feature.properties.Enc_100E11< minMenos100Conc11 || minMenos100Conc11 ===0){
        minMenos100Conc11 = feature.properties.Enc_100E11
    }
    if(feature.properties.Enc_100E11> maxMenos100Conc11){
        maxMenos100Conc11 = feature.properties.Enc_100E11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_100E11,0.35)
    });
}
function apagarMenos100Conc11(e){
    var layer = e.target;
    Menos100Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMenos100Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais inferior a 100€: ' + '<b>' +feature.properties.Enc_100E11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMenos100Conc11,
    })
};

var Menos100Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloMenos100Conc11,
    onEachFeature: onEachFeatureMenos100Conc11,
});

var slideMenos100Conc11 = function(){
    var sliderMenos100Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMenos100Conc11, {
        start: [minMenos100Conc11, maxMenos100Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minMenos100Conc11,
            'max': maxMenos100Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMenos100Conc11);
    inputNumberMax.setAttribute("value",maxMenos100Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderMenos100Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMenos100Conc11.noUiSlider.set([null, this.value]);
    });

    sliderMenos100Conc11.noUiSlider.on('update',function(e){
        Menos100Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_100E11>=parseFloat(e[0])&& layer.feature.properties.Enc_100E11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMenos100Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderMenos100Conc11.noUiSlider;
    $(slidersGeral).append(sliderMenos100Conc11);
}
///////////////////////////-------------------- FIM MENOS 100€, EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 1OO€ E 200€, EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEnc100a200Conc11= 99999;
var maxEnc100a200Conc11 = 0;
function estiloEnc100a200Conc11(feature, latlng) {
    if(feature.properties.Enc_200E11< minEnc100a200Conc11 || minEnc100a200Conc11 ===0){
        minEnc100a200Conc11 = feature.properties.Enc_200E11
    }
    if(feature.properties.Enc_200E11> maxEnc100a200Conc11){
        maxEnc100a200Conc11 = feature.properties.Enc_200E11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_200E11,0.35)
    });
}
function apagarEnc100a200Conc11(e){
    var layer = e.target;
    Enc100a200Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc100a200Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 100€ e 199.99€: ' + '<b>' +feature.properties.Enc_200E11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc100a200Conc11,
    })
};

var Enc100a200Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEnc100a200Conc11,
    onEachFeature: onEachFeatureEnc100a200Conc11,
});

var slideEnc100a200Conc11 = function(){
    var sliderEnc100a200Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc100a200Conc11, {
        start: [minEnc100a200Conc11, maxEnc100a200Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc100a200Conc11,
            'max': maxEnc100a200Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc100a200Conc11);
    inputNumberMax.setAttribute("value",maxEnc100a200Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc100a200Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc100a200Conc11.noUiSlider.set([null, this.value]);
    });

    sliderEnc100a200Conc11.noUiSlider.on('update',function(e){
        Enc100a200Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_200E11>=parseFloat(e[0])&& layer.feature.properties.Enc_200E11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc100a200Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderEnc100a200Conc11.noUiSlider;
    $(slidersGeral).append(sliderEnc100a200Conc11);
}
///////////////////////////-------------------- FIM ENTRE 100€ 200€, EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 2OO€ E 300€, EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEnc200a300Conc11= 99999;
var maxEnc200a300Conc11 = 0;
function estiloEnc200a300Conc11(feature, latlng) {
    if(feature.properties.Enc_300E11< minEnc200a300Conc11 || minEnc200a300Conc11 ===0){
        minEnc200a300Conc11 = feature.properties.Enc_300E11
    }
    if(feature.properties.Enc_300E11> maxEnc200a300Conc11){
        maxEnc200a300Conc11 = feature.properties.Enc_300E11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_300E11,0.35)
    });
}
function apagarEnc200a300Conc11(e){
    var layer = e.target;
    Enc200a300Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc200a300Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 200€ e 299.99€: ' + '<b>' +feature.properties.Enc_300E11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc200a300Conc11,
    })
};

var Enc200a300Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEnc200a300Conc11,
    onEachFeature: onEachFeatureEnc200a300Conc11,
});

var slideEnc200a300Conc11 = function(){
    var sliderEnc200a300Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc200a300Conc11, {
        start: [minEnc200a300Conc11, maxEnc200a300Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc200a300Conc11,
            'max': maxEnc200a300Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc200a300Conc11);
    inputNumberMax.setAttribute("value",maxEnc200a300Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc200a300Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc200a300Conc11.noUiSlider.set([null, this.value]);
    });

    sliderEnc200a300Conc11.noUiSlider.on('update',function(e){
        Enc200a300Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_300E11>=parseFloat(e[0])&& layer.feature.properties.Enc_300E11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc200a300Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderEnc200a300Conc11.noUiSlider;
    $(slidersGeral).append(sliderEnc200a300Conc11);
}
///////////////////////////-------------------- FIM ENTRE 200€ 300€, EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 3OO€ E 400€, EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEnc300a400Conc11= 99999;
var maxEnc300a400Conc11 = 0;
function estiloEnc300a400Conc11(feature, latlng) {
    if(feature.properties.Enc_400E11< minEnc300a400Conc11 || minEnc300a400Conc11 ===0){
        minEnc300a400Conc11 = feature.properties.Enc_400E11
    }
    if(feature.properties.Enc_400E11> maxEnc300a400Conc11){
        maxEnc300a400Conc11 = feature.properties.Enc_400E11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_400E11,0.35)
    });
}
function apagarEnc300a400Conc11(e){
    var layer = e.target;
    Enc300a400Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc300a400Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 300€ e 399.99€: ' + '<b>' +feature.properties.Enc_400E11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc300a400Conc11,
    })
};

var Enc300a400Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEnc300a400Conc11,
    onEachFeature: onEachFeatureEnc300a400Conc11,
});

var slideEnc300a400Conc11 = function(){
    var sliderEnc300a400Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc300a400Conc11, {
        start: [minEnc300a400Conc11, maxEnc300a400Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc300a400Conc11,
            'max': maxEnc300a400Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc300a400Conc11);
    inputNumberMax.setAttribute("value",maxEnc300a400Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc300a400Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc300a400Conc11.noUiSlider.set([null, this.value]);
    });

    sliderEnc300a400Conc11.noUiSlider.on('update',function(e){
        Enc300a400Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_400E11>=parseFloat(e[0])&& layer.feature.properties.Enc_400E11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc300a400Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderEnc300a400Conc11.noUiSlider;
    $(slidersGeral).append(sliderEnc300a400Conc11);
}
///////////////////////////-------------------- FIM ENTRE 300€ 400€, EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 4OO€ E 650€, EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEnc400a650Conc11= 99999;
var maxEnc400a650Conc11 = 0;
function estiloEnc400a650Conc11(feature, latlng) {
    if(feature.properties.Enc_650E11< minEnc400a650Conc11 || minEnc400a650Conc11 ===0){
        minEnc400a650Conc11 = feature.properties.Enc_650E11
    }
    if(feature.properties.Enc_650E11> maxEnc400a650Conc11){
        maxEnc400a650Conc11 = feature.properties.Enc_650E11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_650E11,0.35)
    });
}
function apagarEnc400a650Conc11(e){
    var layer = e.target;
    Enc400a650Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc400a650Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 400€ e 649.99€: ' + '<b>' +feature.properties.Enc_650E11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc400a650Conc11,
    })
};

var Enc400a650Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEnc400a650Conc11,
    onEachFeature: onEachFeatureEnc400a650Conc11,
});

var slideEnc400a650Conc11 = function(){
    var sliderEnc400a650Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc400a650Conc11, {
        start: [minEnc400a650Conc11, maxEnc400a650Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc400a650Conc11,
            'max': maxEnc400a650Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc400a650Conc11);
    inputNumberMax.setAttribute("value",maxEnc400a650Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc400a650Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc400a650Conc11.noUiSlider.set([null, this.value]);
    });

    sliderEnc400a650Conc11.noUiSlider.on('update',function(e){
        Enc400a650Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_650E11>=parseFloat(e[0])&& layer.feature.properties.Enc_650E11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc400a650Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderEnc400a650Conc11.noUiSlider;
    $(slidersGeral).append(sliderEnc400a650Conc11);
}
///////////////////////////-------------------- FIM ENTRE 400€ 650€, EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MAIS 650€, EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEncMais650Conc11= 99999;
var maxEncMais650Conc11 = 0;
function estiloEncMais650Conc11(feature, latlng) {
    if(feature.properties.Enc_M65011< minEncMais650Conc11 || minEncMais650Conc11 ===0){
        minEncMais650Conc11 = feature.properties.Enc_M65011
    }
    if(feature.properties.Enc_M65011> maxEncMais650Conc11){
        maxEncMais650Conc11 = feature.properties.Enc_M65011
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_M65011,0.35)
    });
}
function apagarEncMais650Conc11(e){
    var layer = e.target;
    EncMais650Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEncMais650Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais superior a 650€: ' + '<b>' +feature.properties.Enc_M65011 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEncMais650Conc11,
    })
};

var EncMais650Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEncMais650Conc11,
    onEachFeature: onEachFeatureEncMais650Conc11,
});

var slideEncMais650Conc11 = function(){
    var sliderEncMais650Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEncMais650Conc11, {
        start: [minEncMais650Conc11, maxEncMais650Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEncMais650Conc11,
            'max': maxEncMais650Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEncMais650Conc11);
    inputNumberMax.setAttribute("value",maxEncMais650Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEncMais650Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEncMais650Conc11.noUiSlider.set([null, this.value]);
    });

    sliderEncMais650Conc11.noUiSlider.on('update',function(e){
        EncMais650Conc11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_M65011>=parseFloat(e[0])&& layer.feature.properties.Enc_M65011 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEncMais650Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderEncMais650Conc11.noUiSlider;
    $(slidersGeral).append(sliderEncMais650Conc11);
}
///////////////////////////-------------------- FIM MAIS 650€, EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Alojamentos PROPRIEDADES OCUPANTES 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalAlojResiHabiConc21= 99999;
var maxTotalAlojResiHabiConc21 = 0;
function estiloTotalAlojResiHabiConc21(feature, latlng) {
    if(feature.properties.Enc_Tot21< minTotalAlojResiHabiConc21 || feature.properties.Enc_Tot21 ===0){
        minTotalAlojResiHabiConc21 = feature.properties.Enc_Tot21
    }
    if(feature.properties.Enc_Tot21> maxTotalAlojResiHabiConc21){
        maxTotalAlojResiHabiConc21 = feature.properties.Enc_Tot21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Tot21,0.2)
    });
}
function apagarTotalAlojResiHabiConc21(e){
    var layer = e.target;
    TotalAlojResiHabiConc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalAlojResiHabiConc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos familiares clássicos de residência habitual de propriedade dos ocupantes: ' + '<b>' +feature.properties.Enc_Tot21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalAlojResiHabiConc21,
    })
};

var TotalAlojResiHabiConc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalAlojResiHabiConc21,
    onEachFeature: onEachFeatureTotalAlojResiHabiConc21,
});

var slideTotalAlojResiHabiConc21 = function(){
    var sliderTotalAlojResiHabiConc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalAlojResiHabiConc21, {
        start: [minTotalAlojResiHabiConc21, maxTotalAlojResiHabiConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAlojResiHabiConc21,
            'max': maxTotalAlojResiHabiConc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAlojResiHabiConc21);
    inputNumberMax.setAttribute("value",maxTotalAlojResiHabiConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalAlojResiHabiConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalAlojResiHabiConc21.noUiSlider.set([null, this.value]);
    });

    sliderTotalAlojResiHabiConc21.noUiSlider.on('update',function(e){
        TotalAlojResiHabiConc21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Tot21>=parseFloat(e[0])&& layer.feature.properties.Enc_Tot21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalAlojResiHabiConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderTotalAlojResiHabiConc21.noUiSlider;
    $(slidersGeral).append(sliderTotalAlojResiHabiConc21);
}

///////////////////////////-------------------- FIM TOTAL Alojamentos PROPRIEDADES OCUPANTES 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- SEM ENCARGOS, EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minSemEncargosConc21= 99999;
var maxSemEncargosConc21 = 0;
function estiloSemEncargosConc21(feature, latlng) {
    if(feature.properties.Enc_Sem21< minSemEncargosConc21 || minSemEncargosConc21 ===0){
        minSemEncargosConc21 = feature.properties.Enc_Sem21
    }
    if(feature.properties.Enc_Sem21> maxSemEncargosConc21){
        maxSemEncargosConc21 = feature.properties.Enc_Sem21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Sem21,0.2)
    });
}
function apagarSemEncargosConc21(e){
    var layer = e.target;
    SemEncargosConc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureSemEncargosConc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem encargos mensais: ' + '<b>' +feature.properties.Enc_Sem21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarSemEncargosConc21,
    })
};

var SemEncargosConc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloSemEncargosConc21,
    onEachFeature: onEachFeatureSemEncargosConc21,
});

var slideSemEncargosConc21 = function(){
    var sliderSemEncargosConc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderSemEncargosConc21, {
        start: [minSemEncargosConc21, maxSemEncargosConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minSemEncargosConc21,
            'max': maxSemEncargosConc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minSemEncargosConc21);
    inputNumberMax.setAttribute("value",maxSemEncargosConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderSemEncargosConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSemEncargosConc21.noUiSlider.set([null, this.value]);
    });

    sliderSemEncargosConc21.noUiSlider.on('update',function(e){
        SemEncargosConc21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Sem21>=parseFloat(e[0])&& layer.feature.properties.Enc_Sem21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderSemEncargosConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderSemEncargosConc21.noUiSlider;
    $(slidersGeral).append(sliderSemEncargosConc21);
}
///////////////////////////-------------------- FIM SEM ENCARGOS, EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- COM ENCARGOS, EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minComEncargosConc21 = 99999;
var maxComEncargosConc21 = 0;
function estiloComEncargosConc21(feature, latlng) {
    if(feature.properties.Enc_Com21< minComEncargosConc21 || minComEncargosConc21 ===0){
        minComEncargosConc21 = feature.properties.Enc_Com21
    }
    if(feature.properties.Enc_Com21> maxComEncargosConc21){
        maxComEncargosConc21 = feature.properties.Enc_Com21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Com21,0.2)
    });
}
function apagarComEncargosConc21(e){
    var layer = e.target;
    ComEncargosConc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureComEncargosConc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com encargos mensais: ' + '<b>' +feature.properties.Enc_Com21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarComEncargosConc21,
    })
};

var ComEncargosConc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloComEncargosConc21,
    onEachFeature: onEachFeatureComEncargosConc21,
});

var slideComEncargosConc21 = function(){
    var sliderComEncargosConc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderComEncargosConc21, {
        start: [minComEncargosConc21, maxComEncargosConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minComEncargosConc21,
            'max': maxComEncargosConc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minComEncargosConc21);
    inputNumberMax.setAttribute("value",maxComEncargosConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderComEncargosConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderComEncargosConc21.noUiSlider.set([null, this.value]);
    });

    sliderComEncargosConc21.noUiSlider.on('update',function(e){
        ComEncargosConc21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Com21>=parseFloat(e[0])&& layer.feature.properties.Enc_Com21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderComEncargosConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderComEncargosConc21.noUiSlider;
    $(slidersGeral).append(sliderComEncargosConc21);
}
///////////////////////////-------------------- FIM COM ENCARGOS, EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MENOS 1OO€, EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minMenos100Conc21 = 99999;
var maxMenos100Conc21 = 0;
function estiloMenos100Conc21(feature, latlng) {
    if(feature.properties.Enc_100E21< minMenos100Conc21 || minMenos100Conc21 ===0){
        minMenos100Conc21 = feature.properties.Enc_100E21
    }
    if(feature.properties.Enc_100E21> maxMenos100Conc21){
        maxMenos100Conc21 = feature.properties.Enc_100E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_100E21,0.35)
    });
}
function apagarMenos100Conc21(e){
    var layer = e.target;
    Menos100Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMenos100Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais inferior a 100€: ' + '<b>' +feature.properties.Enc_100E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMenos100Conc21,
    })
};

var Menos100Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloMenos100Conc21,
    onEachFeature: onEachFeatureMenos100Conc21,
});

var slideMenos100Conc21 = function(){
    var sliderMenos100Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMenos100Conc21, {
        start: [minMenos100Conc21, maxMenos100Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minMenos100Conc21,
            'max': maxMenos100Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMenos100Conc21);
    inputNumberMax.setAttribute("value",maxMenos100Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderMenos100Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMenos100Conc21.noUiSlider.set([null, this.value]);
    });

    sliderMenos100Conc21.noUiSlider.on('update',function(e){
        Menos100Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_100E21>=parseFloat(e[0])&& layer.feature.properties.Enc_100E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMenos100Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderMenos100Conc21.noUiSlider;
    $(slidersGeral).append(sliderMenos100Conc21);
}
///////////////////////////-------------------- FIM MENOS 100€, EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 1OO€ E 200€, EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEnc100a200Conc21 = 99999;
var maxEnc100a200Conc21 = 0;
function estiloEnc100a200Conc21(feature, latlng) {
    if(feature.properties.Enc_200E21< minEnc100a200Conc21 || minEnc100a200Conc21 ===0){
        minEnc100a200Conc21 = feature.properties.Enc_200E21
    }
    if(feature.properties.Enc_200E21> maxEnc100a200Conc21){
        maxEnc100a200Conc21 = feature.properties.Enc_200E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_200E21,0.35)
    });
}
function apagarEnc100a200Conc21(e){
    var layer = e.target;
    Enc100a200Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc100a200Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 100€ e 199.99€: ' + '<b>' +feature.properties.Enc_200E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc100a200Conc21,
    })
};

var Enc100a200Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEnc100a200Conc21,
    onEachFeature: onEachFeatureEnc100a200Conc21,
});

var slideEnc100a200Conc21 = function(){
    var sliderEnc100a200Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc100a200Conc21, {
        start: [minEnc100a200Conc21, maxEnc100a200Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc100a200Conc21,
            'max': maxEnc100a200Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc100a200Conc21);
    inputNumberMax.setAttribute("value",maxEnc100a200Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc100a200Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc100a200Conc21.noUiSlider.set([null, this.value]);
    });

    sliderEnc100a200Conc21.noUiSlider.on('update',function(e){
        Enc100a200Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_200E21>=parseFloat(e[0])&& layer.feature.properties.Enc_200E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc100a200Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderEnc100a200Conc21.noUiSlider;
    $(slidersGeral).append(sliderEnc100a200Conc21);
}
///////////////////////////-------------------- FIM ENTRE 100€ 200€, EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 2OO€ E 300€, EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEnc200a300Conc21 = 99999;
var maxEnc200a300Conc21 = 0;
function estiloEnc200a300Conc21(feature, latlng) {
    if(feature.properties.Enc_300E21< minEnc200a300Conc21 || minEnc200a300Conc21 ===0){
        minEnc200a300Conc21 = feature.properties.Enc_300E21
    }
    if(feature.properties.Enc_300E21> maxEnc200a300Conc21){
        maxEnc200a300Conc21 = feature.properties.Enc_300E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_300E21,0.35)
    });
}
function apagarEnc200a300Conc21(e){
    var layer = e.target;
    Enc200a300Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc200a300Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 200€ e 299.99€: ' + '<b>' +feature.properties.Enc_300E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc200a300Conc21,
    })
};

var Enc200a300Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEnc200a300Conc21,
    onEachFeature: onEachFeatureEnc200a300Conc21,
});

var slideEnc200a300Conc21 = function(){
    var sliderEnc200a300Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc200a300Conc21, {
        start: [minEnc200a300Conc21, maxEnc200a300Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc200a300Conc21,
            'max': maxEnc200a300Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc200a300Conc21);
    inputNumberMax.setAttribute("value",maxEnc200a300Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc200a300Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc200a300Conc21.noUiSlider.set([null, this.value]);
    });

    sliderEnc200a300Conc21.noUiSlider.on('update',function(e){
        Enc200a300Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_300E21>=parseFloat(e[0])&& layer.feature.properties.Enc_300E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc200a300Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderEnc200a300Conc21.noUiSlider;
    $(slidersGeral).append(sliderEnc200a300Conc21);
}
///////////////////////////-------------------- FIM ENTRE 200€ 300€, EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 3OO€ E 400€, EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEnc300a400Conc21 = 99999;
var maxEnc300a400Conc21 = 0;
function estiloEnc300a400Conc21(feature, latlng) {
    if(feature.properties.Enc_400E21< minEnc300a400Conc21 || minEnc300a400Conc21 ===0){
        minEnc300a400Conc21 = feature.properties.Enc_400E21
    }
    if(feature.properties.Enc_400E21> maxEnc300a400Conc21){
        maxEnc300a400Conc21 = feature.properties.Enc_400E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_400E21,0.35)
    });
}
function apagarEnc300a400Conc21(e){
    var layer = e.target;
    Enc300a400Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc300a400Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 300€ e 399.99€: ' + '<b>' +feature.properties.Enc_400E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc300a400Conc21,
    })
};

var Enc300a400Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEnc300a400Conc21,
    onEachFeature: onEachFeatureEnc300a400Conc21,
});

var slideEnc300a400Conc21 = function(){
    var sliderEnc300a400Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc300a400Conc21, {
        start: [minEnc300a400Conc21, maxEnc300a400Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc300a400Conc21,
            'max': maxEnc300a400Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc300a400Conc21);
    inputNumberMax.setAttribute("value",maxEnc300a400Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc300a400Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc300a400Conc21.noUiSlider.set([null, this.value]);
    });

    sliderEnc300a400Conc21.noUiSlider.on('update',function(e){
        Enc300a400Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_400E21>=parseFloat(e[0])&& layer.feature.properties.Enc_400E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc300a400Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderEnc300a400Conc21.noUiSlider;
    $(slidersGeral).append(sliderEnc300a400Conc21);
}
///////////////////////////-------------------- FIM ENTRE 300€ 400€, EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 4OO€ E 650€, EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEnc400a650Conc21 = 99999;
var maxEnc400a650Conc21 = 0;
function estiloEnc400a650Conc21(feature, latlng) {
    if(feature.properties.Enc_650E21< minEnc400a650Conc21 || minEnc400a650Conc21 ===0){
        minEnc400a650Conc21 = feature.properties.Enc_650E21
    }
    if(feature.properties.Enc_650E21> maxEnc400a650Conc21){
        maxEnc400a650Conc21 = feature.properties.Enc_650E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_650E21,0.35)
    });
}
function apagarEnc400a650Conc21(e){
    var layer = e.target;
    Enc400a650Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc400a650Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 400€ e 649.99€: ' + '<b>' +feature.properties.Enc_650E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc400a650Conc21,
    })
};

var Enc400a650Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEnc400a650Conc21,
    onEachFeature: onEachFeatureEnc400a650Conc21,
});

var slideEnc400a650Conc21 = function(){
    var sliderEnc400a650Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc400a650Conc21, {
        start: [minEnc400a650Conc21, maxEnc400a650Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc400a650Conc21,
            'max': maxEnc400a650Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc400a650Conc21);
    inputNumberMax.setAttribute("value",maxEnc400a650Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc400a650Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc400a650Conc21.noUiSlider.set([null, this.value]);
    });

    sliderEnc400a650Conc21.noUiSlider.on('update',function(e){
        Enc400a650Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_650E21>=parseFloat(e[0])&& layer.feature.properties.Enc_650E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc400a650Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderEnc400a650Conc21.noUiSlider;
    $(slidersGeral).append(sliderEnc400a650Conc21);
}
///////////////////////////-------------------- FIM ENTRE 400€ 650€, EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 650€ E 999€, EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEnc650a999Conc21 = 99999;
var maxEnc650a999Conc21 = 0;
function estiloEnc650a999Conc21(feature, latlng) {
    if(feature.properties.Enc_999E21< minEnc650a999Conc21 || minEnc650a999Conc21 ===0){
        minEnc650a999Conc21 = feature.properties.Enc_999E21
    }
    if(feature.properties.Enc_999E21> maxEnc650a999Conc21){
        maxEnc650a999Conc21 = feature.properties.Enc_999E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_999E21,0.35)
    });
}
function apagarEnc650a999Conc21(e){
    var layer = e.target;
    Enc650a999Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc650a999Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 650 e 999.99€: ' + '<b>' +feature.properties.Enc_999E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc650a999Conc21,
    })
};

var Enc650a999Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEnc650a999Conc21,
    onEachFeature: onEachFeatureEnc650a999Conc21,
});

var slideEnc650a999Conc21 = function(){
    var sliderEnc650a999Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc650a999Conc21, {
        start: [minEnc650a999Conc21, maxEnc650a999Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc650a999Conc21,
            'max': maxEnc650a999Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc650a999Conc21);
    inputNumberMax.setAttribute("value",maxEnc650a999Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc650a999Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc650a999Conc21.noUiSlider.set([null, this.value]);
    });

    sliderEnc650a999Conc21.noUiSlider.on('update',function(e){
        Enc650a999Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_999E21>=parseFloat(e[0])&& layer.feature.properties.Enc_999E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc650a999Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderEnc650a999Conc21.noUiSlider;
    $(slidersGeral).append(sliderEnc650a999Conc21);
}
///////////////////////////-------------------- FIM ENTRE 650 a 999€, EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MAIS 1000€, EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEncMais1000Conc21 = 99999;
var maxEncMais1000Conc21 = 0;
function estiloEncMais1000Conc21(feature, latlng) {
    if(feature.properties.Enc_100021< minEncMais1000Conc21 || minEncMais1000Conc21 ===0){
        minEncMais1000Conc21 = feature.properties.Enc_100021
    }
    if(feature.properties.Enc_100021> maxEncMais1000Conc21){
        maxEncMais1000Conc21 = feature.properties.Enc_100021
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_100021,0.35)
    });
}
function apagarEncMais1000Conc21(e){
    var layer = e.target;
    EncMais1000Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEncMais1000Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais superior a 1000€: ' + '<b>' +feature.properties.Enc_100021 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEncMais1000Conc21,
    })
};

var EncMais1000Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEncMais1000Conc21,
    onEachFeature: onEachFeatureEncMais1000Conc21,
});

var slideEncMais1000Conc21 = function(){
    var sliderEncMais1000Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEncMais1000Conc21, {
        start: [minEncMais1000Conc21, maxEncMais1000Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEncMais1000Conc21,
            'max': maxEncMais1000Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEncMais1000Conc21);
    inputNumberMax.setAttribute("value",maxEncMais1000Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEncMais1000Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEncMais1000Conc21.noUiSlider.set([null, this.value]);
    });

    sliderEncMais1000Conc21.noUiSlider.on('update',function(e){
        EncMais1000Conc21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_100021>=parseFloat(e[0])&& layer.feature.properties.Enc_100021 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEncMais1000Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderEncMais1000Conc21.noUiSlider;
    $(slidersGeral).append(sliderEncMais1000Conc21);
}
///////////////////////////-------------------- FIM MAIS 1000€, EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////////////////--------------------------- DADOS RELATIVOS ----------------\\\\\\\\\\\\\

////////////////////////////------- Percentagem RENDA BAIXA CONCELHO em 2011-----////

var minRendaBaixaCon11 = 99999;
var maxRendaBaixaCon11 = 0;

function EstiloRendaBaixaCon11(feature) {
    if( feature.properties.EncBaixo11 <= minRendaBaixaCon11 || minRendaBaixaCon11 === 0){
        minRendaBaixaCon11 = feature.properties.EncBaixo11
    }
    if(feature.properties.EncBaixo11 >= maxRendaBaixaCon11 ){
        maxRendaBaixaCon11 = feature.properties.EncBaixo11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorEncargoBaixoConc(feature.properties.EncBaixo11)
    };
}
function apagarRendaBaixaCon11(e) {
    RendaBaixaCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaBaixaCon11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal baixo: ' + '<b>' + feature.properties.EncBaixo11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaBaixaCon11,
    });
}
var RendaBaixaCon11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloRendaBaixaCon11,
    onEachFeature: onEachFeatureRendaBaixaCon11
});
let slideRendaBaixaCon11 = function(){
    var sliderRendaBaixaCon11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaBaixaCon11, {
        start: [minRendaBaixaCon11, maxRendaBaixaCon11],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaBaixaCon11,
            'max': maxRendaBaixaCon11
        },
        });
    inputNumberMin.setAttribute("value",minRendaBaixaCon11);
    inputNumberMax.setAttribute("value",maxRendaBaixaCon11);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaBaixaCon11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaBaixaCon11.noUiSlider.set([null, this.value]);
    });

    sliderRendaBaixaCon11.noUiSlider.on('update',function(e){
        RendaBaixaCon11.eachLayer(function(layer){
            if(layer.feature.properties.EncBaixo11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncBaixo11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaBaixaCon11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderRendaBaixaCon11.noUiSlider;
    $(slidersGeral).append(sliderRendaBaixaCon11);
} 

/////////////////////////////// Fim da RENDA BAIXA CONCELHO em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA MÉDIA CONCELHO em 2011-----////

var minRendaMediaCon11 = 99999;
var maxRendaMediaCon11 = 0;

function EstiloRendaMediaCon11(feature) {
    if( feature.properties.EncMedio11 <= minRendaMediaCon11 || minRendaMediaCon11 === 0){
        minRendaMediaCon11 = feature.properties.EncMedio11
    }
    if(feature.properties.EncMedio11 >= maxRendaMediaCon11 ){
        maxRendaMediaCon11 = feature.properties.EncMedio11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorEncargoMedioConc(feature.properties.EncMedio11)
    };
}
function apagarRendaMediaCon11(e) {
    RendaMediaCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaMediaCon11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal médio: ' + '<b>' + feature.properties.EncMedio11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaMediaCon11,
    });
}
var RendaMediaCon11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloRendaMediaCon11,
    onEachFeature: onEachFeatureRendaMediaCon11
});
let slideRendaMediaCon11 = function(){
    var sliderRendaMediaCon11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaMediaCon11, {
        start: [minRendaMediaCon11, maxRendaMediaCon11],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaMediaCon11,
            'max': maxRendaMediaCon11
        },
        });
    inputNumberMin.setAttribute("value",minRendaMediaCon11);
    inputNumberMax.setAttribute("value",maxRendaMediaCon11);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaMediaCon11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaMediaCon11.noUiSlider.set([null, this.value]);
    });

    sliderRendaMediaCon11.noUiSlider.on('update',function(e){
        RendaMediaCon11.eachLayer(function(layer){
            if(layer.feature.properties.EncMedio11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncMedio11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaMediaCon11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderRendaMediaCon11.noUiSlider;
    $(slidersGeral).append(sliderRendaMediaCon11);
} 

/////////////////////////////// Fim da RENDA MEDIA CONCELHO em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA ALTA CONCELHO em 2011-----////

var minRendaAltaCon11 = 99999;
var maxRendaAltaCon11 = 0;

function EstiloRendaAltaCon11(feature) {
    if( feature.properties.EncAlto11 <= minRendaAltaCon11 || minRendaAltaCon11 === 0){
        minRendaAltaCon11 = feature.properties.EncAlto11
    }
    if(feature.properties.EncAlto11 >= maxRendaAltaCon11 ){
        maxRendaAltaCon11 = feature.properties.EncAlto11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorEncargoAltoConc(feature.properties.EncAlto11)
    };
}
function apagarRendaAltaCon11(e) {
    RendaAltaCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaAltaCon11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal alto: ' + '<b>' + feature.properties.EncAlto11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaAltaCon11,
    });
}
var RendaAltaCon11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloRendaAltaCon11,
    onEachFeature: onEachFeatureRendaAltaCon11
});
let slideRendaAltaCon11 = function(){
    var sliderRendaAltaCon11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaAltaCon11, {
        start: [minRendaAltaCon11, maxRendaAltaCon11],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaAltaCon11,
            'max': maxRendaAltaCon11
        },
        });
    inputNumberMin.setAttribute("value",minRendaAltaCon11);
    inputNumberMax.setAttribute("value",maxRendaAltaCon11);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaAltaCon11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaAltaCon11.noUiSlider.set([null, this.value]);
    });

    sliderRendaAltaCon11.noUiSlider.on('update',function(e){
        RendaAltaCon11.eachLayer(function(layer){
            if(layer.feature.properties.EncAlto11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncAlto11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaAltaCon11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderRendaAltaCon11.noUiSlider;
    $(slidersGeral).append(sliderRendaAltaCon11);
} 

/////////////////////////////// Fim da RENDA ALTA CONCELHO em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem SEM ENCARGOS CONCELHO em 2011-----////

var minPropSemEncCon11 = 99999;
var maxPropSemEncCon11 = 0;

function CorSemEncargosConc(d) {
    return d == null ? '#808080' :
        d >= 72.15 ? '#8c0303' :
        d >= 66.34  ? '#de1f35' :
        d >= 56.67 ? '#ff5e6e' :
        d >= 46.99   ? '#f5b3be' :
        d >= 37.31   ? '#F2C572' :
                ''  ;
}
var legendaSemEncargosmConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 72.15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 66.34 a 72.15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 56.67 a 66.34' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 46.99 a 56.67' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 37.31 a 46.99' + '<br>'


    $(legendaA).append(symbolsContainer); 
}
function EstiloPropSemEncCon11(feature) {
    if( feature.properties.Prop_Sem11 <= minPropSemEncCon11 || minPropSemEncCon11 === 0){
        minPropSemEncCon11 = feature.properties.Prop_Sem11
    }
    if(feature.properties.Prop_Sem11 >= maxPropSemEncCon11 ){
        maxPropSemEncCon11 = feature.properties.Prop_Sem11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorSemEncargosConc(feature.properties.Prop_Sem11)
    };
}
function apagarPropSemEncCon11(e) {
    PropSemEncCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePropSemEncCon11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos sem encargos mensais: ' + '<b>' + feature.properties.Prop_Sem11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPropSemEncCon11,
    });
}
var PropSemEncCon11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPropSemEncCon11,
    onEachFeature: onEachFeaturePropSemEncCon11
});
let slidePropSemEncCon11 = function(){
    var sliderPropSemEncCon11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPropSemEncCon11, {
        start: [minPropSemEncCon11, maxPropSemEncCon11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPropSemEncCon11,
            'max': maxPropSemEncCon11
        },
        });
    inputNumberMin.setAttribute("value",minPropSemEncCon11);
    inputNumberMax.setAttribute("value",maxPropSemEncCon11);

    inputNumberMin.addEventListener('change', function(){
        sliderPropSemEncCon11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPropSemEncCon11.noUiSlider.set([null, this.value]);
    });

    sliderPropSemEncCon11.noUiSlider.on('update',function(e){
        PropSemEncCon11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Sem11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Sem11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPropSemEncCon11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderPropSemEncCon11.noUiSlider;
    $(slidersGeral).append(sliderPropSemEncCon11);
} 

/////////////////////////////// Fim da PROPROÇÃO SEM ENCARGOS CONCELHO em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem COM ENCARGOS CONCELHO em 2011-----////

var minPropComEncCon11 = 99999;
var maxPropComEncCon11 = 0;

function CorComEncargosConc(d) {
    return d == null ? '#808080' :
        d >= 58.75 ? '#8c0303' :
        d >= 52.84  ? '#de1f35' :
        d >= 42.99 ? '#ff5e6e' :
        d >= 33.13   ? '#f5b3be' :
        d >= 23.28   ? '#F2C572' :
                ''  ;
}
var legendaComEncargosmConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 58.75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 52.84 a 58.75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 42.99 a 52.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 33.13 a 42.99' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 23.28 a 33.13' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPropComEncCon11(feature) {
    if( feature.properties.Prop_Com11 <= minPropComEncCon11 || minPropComEncCon11 === 0){
        minPropComEncCon11 = feature.properties.Prop_Com11
    }
    if(feature.properties.Prop_Com11 >= maxPropComEncCon11 ){
        maxPropComEncCon11 = feature.properties.Prop_Com11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorComEncargosConc(feature.properties.Prop_Com11)
    };
}
function apagarPropComEncCon11(e) {
    PropComEncCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePropComEncCon11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com encargos mensais: ' + '<b>' + feature.properties.Prop_Com11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPropComEncCon11,
    });
}
var PropComEncCon11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPropComEncCon11,
    onEachFeature: onEachFeaturePropComEncCon11
});
let slidePropComEncCon11 = function(){
    var sliderPropComEncCon11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPropComEncCon11, {
        start: [minPropComEncCon11, maxPropComEncCon11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPropComEncCon11,
            'max': maxPropComEncCon11
        },
        });
    inputNumberMin.setAttribute("value",minPropComEncCon11);
    inputNumberMax.setAttribute("value",maxPropComEncCon11);

    inputNumberMin.addEventListener('change', function(){
        sliderPropComEncCon11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPropComEncCon11.noUiSlider.set([null, this.value]);
    });

    sliderPropComEncCon11.noUiSlider.on('update',function(e){
        PropComEncCon11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Com11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Com11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPropComEncCon11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPropComEncCon11.noUiSlider;
    $(slidersGeral).append(sliderPropComEncCon11);
} 

/////////////////////////////// Fim da PROPROÇÃO COM ENCARGOS CONCELHO em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA BAIXA CONCELHO em 2021-----////

var minRendaBaixaCon21 = 99999;
var maxRendaBaixaCon21 = 0;

function CorEncargoBaixoConc(d) {
    return d == null ? '#808080' :
        d >= 6.84 ? '#8c0303' :
        d >= 6.05  ? '#de1f35' :
        d >= 4.74 ? '#ff5e6e' :
        d >= 3.42   ? '#f5b3be' :
        d >= 2.1   ? '#F2C572' :
                ''  ;
}
var legendaEncargoBaixoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 6.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 6.05 a 6.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 4.74 a 6.05' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 3.42 a 4.74' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2.1 a 3.42' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloRendaBaixaCon21(feature) {
    if( feature.properties.EncBaixo21 <= minRendaBaixaCon21){
        minRendaBaixaCon21 = feature.properties.EncBaixo21
    }
    if(feature.properties.EncBaixo21 >= maxRendaBaixaCon21 ){
        maxRendaBaixaCon21 = feature.properties.EncBaixo21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorEncargoBaixoConc(feature.properties.EncBaixo21)
    };
}
function apagarRendaBaixaCon21(e) {
    RendaBaixaCon21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaBaixaCon21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal baixo: ' + '<b>' + feature.properties.EncBaixo21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaBaixaCon21,
    });
}
var RendaBaixaCon21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloRendaBaixaCon21,
    onEachFeature: onEachFeatureRendaBaixaCon21
});
let slideRendaBaixaCon21 = function(){
    var sliderRendaBaixaCon21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaBaixaCon21, {
        start: [minRendaBaixaCon21, maxRendaBaixaCon21],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaBaixaCon21,
            'max': maxRendaBaixaCon21
        },
        });
    inputNumberMin.setAttribute("value",minRendaBaixaCon21);
    inputNumberMax.setAttribute("value",maxRendaBaixaCon21);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaBaixaCon21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaBaixaCon21.noUiSlider.set([null, this.value]);
    });

    sliderRendaBaixaCon21.noUiSlider.on('update',function(e){
        RendaBaixaCon21.eachLayer(function(layer){
            if(layer.feature.properties.EncBaixo21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncBaixo21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaBaixaCon21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderRendaBaixaCon21.noUiSlider;
    $(slidersGeral).append(sliderRendaBaixaCon21);
} 

/////////////////////////////// Fim da RENDA BAIXA CONCELHO em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA MÉDIA CONCELHO em 2021-----////

var minRendaMediaCon21 = 99999;
var maxRendaMediaCon21 = 0;


function CorEncargoMedioConc(d) {
    return d == null ? '#808080' :
        d >= 90.68 ? '#8c0303' :
        d >= 87.61  ? '#de1f35' :
        d >= 82.5 ? '#ff5e6e' :
        d >= 77.38   ? '#f5b3be' :
        d >= 72.27   ? '#F2C572' :
                ''  ;
}
var legendaEncargoMedioConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 90.68' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 87.61 a 90.68' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 82.5 a 87.61' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 77.38 a 82.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 72.27 a 77.38' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloRendaMediaCon21(feature) {
    if( feature.properties.EncMedio21 <= minRendaMediaCon21 || minRendaMediaCon21 === 0){
        minRendaMediaCon21 = feature.properties.EncMedio21
    }
    if(feature.properties.EncMedio21 >= maxRendaMediaCon21 ){
        maxRendaMediaCon21 = feature.properties.EncMedio21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorEncargoMedioConc(feature.properties.EncMedio21)
    };
}
function apagarRendaMediaCon21(e) {
    RendaMediaCon21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaMediaCon21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal médio: ' + '<b>' + feature.properties.EncMedio21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaMediaCon21,
    });
}
var RendaMediaCon21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloRendaMediaCon21,
    onEachFeature: onEachFeatureRendaMediaCon21
});
let slideRendaMediaCon21 = function(){
    var sliderRendaMediaCon21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaMediaCon21, {
        start: [minRendaMediaCon21, maxRendaMediaCon21],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaMediaCon21,
            'max': maxRendaMediaCon21
        },
        });
    inputNumberMin.setAttribute("value",minRendaMediaCon21);
    inputNumberMax.setAttribute("value",maxRendaMediaCon21);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaMediaCon21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaMediaCon21.noUiSlider.set([null, this.value]);
    });

    sliderRendaMediaCon21.noUiSlider.on('update',function(e){
        RendaMediaCon21.eachLayer(function(layer){
            if(layer.feature.properties.EncMedio21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncMedio21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaMediaCon21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderRendaMediaCon21.noUiSlider;
    $(slidersGeral).append(sliderRendaMediaCon21);
} 

/////////////////////////////// Fim da RENDA MEDIA CONCELHO em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA ALTA CONCELHO em 2021-----////

var minRendaAltaCon21 = 99999;
var maxRendaAltaCon21 = 0;

function CorEncargoAltoConc(d) {
    return d == null ? '#808080' :
        d >= 19.91 ? '#8c0303' :
        d >= 17.33  ? '#de1f35' :
        d >= 13.03 ? '#ff5e6e' :
        d >= 8.73   ? '#f5b3be' :
        d >= 4.43   ? '#F2C572' :
                ''  ;
}
var legendaEncargoAltoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 19.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 17.33 a 19.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 13.03 a 17.33' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 8.73 a 13.03' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 4.43 a 8.73' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloRendaAltaCon21(feature) {
    if( feature.properties.EncAlto21 <= minRendaAltaCon21 || minRendaAltaCon21 === 0){
        minRendaAltaCon21 = feature.properties.EncAlto21
    }
    if(feature.properties.EncAlto21 >= maxRendaAltaCon21 ){
        maxRendaAltaCon21 = feature.properties.EncAlto21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorEncargoAltoConc(feature.properties.EncAlto21)
    };
}
function apagarRendaAltaCon21(e) {
    RendaAltaCon21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaAltaCon21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal alto: ' + '<b>' + feature.properties.EncAlto21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaAltaCon21,
    });
}
var RendaAltaCon21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloRendaAltaCon21,
    onEachFeature: onEachFeatureRendaAltaCon21
});
let slideRendaAltaCon21 = function(){
    var sliderRendaAltaCon21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaAltaCon21, {
        start: [minRendaAltaCon21, maxRendaAltaCon21],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaAltaCon21,
            'max': maxRendaAltaCon21
        },
        });
    inputNumberMin.setAttribute("value",minRendaAltaCon21);
    inputNumberMax.setAttribute("value",maxRendaAltaCon21);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaAltaCon21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaAltaCon21.noUiSlider.set([null, this.value]);
    });

    sliderRendaAltaCon21.noUiSlider.on('update',function(e){
        RendaAltaCon21.eachLayer(function(layer){
            if(layer.feature.properties.EncAlto21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncAlto21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaAltaCon21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderRendaAltaCon21.noUiSlider;
    $(slidersGeral).append(sliderRendaAltaCon21);
} 

/////////////////////////////// Fim da RENDA ALTA CONCELHO em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem SEM ENCARGOS CONCELHO em 2021-----////

var minPropSemEncCon21 = 99999;
var maxPropSemEncCon21 = 0;

function EstiloPropSemEncCon21(feature) {
    if( feature.properties.Prop_Sem21 <= minPropSemEncCon21 || minPropSemEncCon21 === 0){
        minPropSemEncCon21 = feature.properties.Prop_Sem21
    }
    if(feature.properties.Prop_Sem21 >= maxPropSemEncCon21 ){
        maxPropSemEncCon21 = feature.properties.Prop_Sem21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorSemEncargosConc(feature.properties.Prop_Sem21)
    };
}
function apagarPropSemEncCon21(e) {
    PropSemEncCon21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePropSemEncCon21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos sem encargos mensais: ' + '<b>' + feature.properties.Prop_Sem21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPropSemEncCon21,
    });
}
var PropSemEncCon21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPropSemEncCon21,
    onEachFeature: onEachFeaturePropSemEncCon21
});
let slidePropSemEncCon21 = function(){
    var sliderPropSemEncCon21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPropSemEncCon21, {
        start: [minPropSemEncCon21, maxPropSemEncCon21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPropSemEncCon21,
            'max': maxPropSemEncCon21
        },
        });
    inputNumberMin.setAttribute("value",minPropSemEncCon21);
    inputNumberMax.setAttribute("value",maxPropSemEncCon21);

    inputNumberMin.addEventListener('change', function(){
        sliderPropSemEncCon21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPropSemEncCon21.noUiSlider.set([null, this.value]);
    });

    sliderPropSemEncCon21.noUiSlider.on('update',function(e){
        PropSemEncCon21.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Sem21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Sem21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPropSemEncCon21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderPropSemEncCon21.noUiSlider;
    $(slidersGeral).append(sliderPropSemEncCon21);
} 

/////////////////////////////// Fim da PROPROÇÃO SEM ENCARGOS CONCELHO em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem COM ENCARGOS CONCELHO em 2021-----////

var minPropComEncCon21 = 99999;
var maxPropComEncCon21 = 0;

function EstiloPropComEncCon21(feature) {
    if( feature.properties.Prop_Com21 <= minPropComEncCon21 || minPropComEncCon21 === 0){
        minPropComEncCon21 = feature.properties.Prop_Com21
    }
    if(feature.properties.Prop_Com21 >= maxPropComEncCon21 ){
        maxPropComEncCon21 = feature.properties.Prop_Com21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorComEncargosConc(feature.properties.Prop_Com21)
    };
}
function apagarPropComEncCon21(e) {
    PropComEncCon21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePropComEncCon21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com encargos mensais: ' + '<b>' + feature.properties.Prop_Com21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPropComEncCon21,
    });
}
var PropComEncCon21= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPropComEncCon21,
    onEachFeature: onEachFeaturePropComEncCon21
});
let slidePropComEncCon21 = function(){
    var sliderPropComEncCon21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPropComEncCon21, {
        start: [minPropComEncCon21, maxPropComEncCon21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPropComEncCon21,
            'max': maxPropComEncCon21
        },
        });
    inputNumberMin.setAttribute("value",minPropComEncCon21);
    inputNumberMax.setAttribute("value",maxPropComEncCon21);

    inputNumberMin.addEventListener('change', function(){
        sliderPropComEncCon21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPropComEncCon21.noUiSlider.set([null, this.value]);
    });

    sliderPropComEncCon21.noUiSlider.on('update',function(e){
        PropComEncCon21.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Com21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Com21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPropComEncCon21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderPropComEncCon21.noUiSlider;
    $(slidersGeral).append(sliderPropComEncCon21);
} 

/////////////////////////////// Fim da PROPROÇÃO COM ENCARGOS CONCELHO em 2021 -------------- \\\\\\

/////////////////////--------------------------- FIM DADOS RELATIVOS -----------------\\\\\\\\\\\\\\\\

// /////////////////////////////------- Variação SEM ENCARGOS POR CONCELHOS -------------------////

var minVarSemEncConc = 99999;
var maxVarSemEncConc = 0;

function CorVarSemEncConc(d) {
    return d === null ? '#808080':
        d >= 25  ? '#8c0303' :
        d >= 15  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2  ? '#9eaad7' :
                ''  ;
}

var legendaVarSemEncConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes sem encargos mensais, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  15 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -1.59 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSemEncConc(feature) {
    if(feature.properties.VarSem21 <= minVarSemEncConc || minVarSemEncConc ===0){
        minVarSemEncConc = feature.properties.VarSem21
    }
    if(feature.properties.VarSem21 > maxVarSemEncConc){
        maxVarSemEncConc = feature.properties.VarSem21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSemEncConc(feature.properties.VarSem21)};
    }


function apagarVarSemEncConc(e) {
    VarSemEncConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarSemEncConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarSem21.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSemEncConc,
    });
}
var VarSemEncConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarSemEncConc,
    onEachFeature: onEachFeatureVarSemEncConc
});

let slideVarSemEncConc = function(){
    var sliderVarSemEncConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSemEncConc, {
        start: [minVarSemEncConc, maxVarSemEncConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSemEncConc,
            'max': maxVarSemEncConc
        },
        });
    inputNumberMin.setAttribute("value",minVarSemEncConc);
    inputNumberMax.setAttribute("value",maxVarSemEncConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSemEncConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSemEncConc.noUiSlider.set([null, this.value]);
    });

    sliderVarSemEncConc.noUiSlider.on('update',function(e){
        VarSemEncConc.eachLayer(function(layer){
            if(layer.feature.properties.VarSem21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarSem21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSemEncConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVarSemEncConc.noUiSlider;
    $(slidersGeral).append(sliderVarSemEncConc);
} 

///////////////////////////// Fim da SEM ENCARGOS, CONCELHOS -------------- \\\\\


// /////////////////////////////------- Variação Com ENCARGOS POR CONCELHOS -------------------////

var minVarComEncConc = 99999;
var maxVarComEncConc = 0;

function CorVarComEncConc(d) {
    return d === null ? '#808080':
        d >=  0  ? '#8c0303' :
        d >= -5  ? '#de1f35' :
        d >= -10  ? '#ff5e6e' :
        d >= -15  ? '#f5b3be' :
        d >= -21  ? '#9eaad7' :
                ''  ;
}

var legendaVarComEncConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com encargos mensais, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' -15 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -20.43 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarComEncConc(feature) {
    if(feature.properties.VarCom21 <= minVarComEncConc || minVarComEncConc ===0){
        minVarComEncConc = feature.properties.VarCom21
    }
    if(feature.properties.VarCom21 > maxVarComEncConc){
        maxVarComEncConc = feature.properties.VarCom21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarComEncConc(feature.properties.VarCom21)};
    }


function apagarVarComEncConc(e) {
    VarComEncConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarComEncConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCom21.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarComEncConc,
    });
}
var VarComEncConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarComEncConc,
    onEachFeature: onEachFeatureVarComEncConc
});

let slideVarComEncConc = function(){
    var sliderVarComEncConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarComEncConc, {
        start: [minVarComEncConc, maxVarComEncConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarComEncConc,
            'max': maxVarComEncConc
        },
        });
    inputNumberMin.setAttribute("value",minVarComEncConc);
    inputNumberMax.setAttribute("value",maxVarComEncConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarComEncConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarComEncConc.noUiSlider.set([null, this.value]);
    });

    sliderVarComEncConc.noUiSlider.on('update',function(e){
        VarComEncConc.eachLayer(function(layer){
            if(layer.feature.properties.VarCom21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarCom21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarComEncConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderVarComEncConc.noUiSlider;
    $(slidersGeral).append(sliderVarComEncConc);
} 

///////////////////////////// Fim da COM ENCARGOS, CONCELHOS -------------- \\\\\


// /////////////////////////////------- Variação MENOS DE 100€ POR CONCELHOS -------------------////

var minVarMenos100EncConc = 99999;
var maxVarMenos100EncConc = -99;

function CorVarMenos100Conc(d) {
    return d === null ? '#808080':
        d >= -20  ? '#8FC1B5' :
        d >= -25  ? '#9ebbd7' :
        d >= -35  ? '#2288bf' :
        d >= -45  ? '#155273' :
        d >= -52  ? '#0b2c40' :
                ''  ;
}

var legendaVarMenos100Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo inferior a 100€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8FC1B5"></i>' + ' -20 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -35 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -45 a -35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -51.85 a -45' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarMenos100EncConc(feature) {
    if(feature.properties.Var10021 <= minVarMenos100EncConc){
        minVarMenos100EncConc = feature.properties.Var10021
    }
    if(feature.properties.Var10021 > maxVarMenos100EncConc){
        maxVarMenos100EncConc = feature.properties.Var10021 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMenos100Conc(feature.properties.Var10021)};
    }


function apagarVarMenos100EncConc(e) {
    VarMenos100EncConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMenos100EncConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var10021.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMenos100EncConc,
    });
}
var VarMenos100EncConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarMenos100EncConc,
    onEachFeature: onEachFeatureVarMenos100EncConc
});

let slideVarMenos100EncConc = function(){
    var sliderVarMenos100EncConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMenos100EncConc, {
        start: [minVarMenos100EncConc, maxVarMenos100EncConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMenos100EncConc,
            'max': maxVarMenos100EncConc
        },
        });
    inputNumberMin.setAttribute("value",minVarMenos100EncConc);
    inputNumberMax.setAttribute("value",maxVarMenos100EncConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMenos100EncConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMenos100EncConc.noUiSlider.set([null, this.value]);
    });

    sliderVarMenos100EncConc.noUiSlider.on('update',function(e){
        VarMenos100EncConc.eachLayer(function(layer){
            if(layer.feature.properties.Var10021.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var10021.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMenos100EncConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderVarMenos100EncConc.noUiSlider;
    $(slidersGeral).append(sliderVarMenos100EncConc);
} 

///////////////////////////// Fim da MENOS DE 100€, CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação ENTRE 100€ E 200€ POR CONCELHOS -------------------////

var minVar100e200Conc = 99999;
var maxVar100e200Conc = 0;

function CorVar100e200Conc(d) {
    return d === null ? '#808080':
        d >= 40  ? '#8c0303' :
        d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9eaad7' :
                ''  ;
}

var legendaVar100e200Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 100 e 199.99€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 40 ' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  20 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -14.06 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}   

function EstiloVar100e200Conc(feature) {
    if(feature.properties.Var20021 <= minVar100e200Conc || minVar100e200Conc ===0){
        minVar100e200Conc = feature.properties.Var20021
    }
    if(feature.properties.Var20021 > maxVar100e200Conc){
        maxVar100e200Conc = feature.properties.Var20021 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar100e200Conc(feature.properties.Var20021)};
    }


function apagarVar100e200Conc(e) {
    Var100e200Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar100e200Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var20021.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar100e200Conc,
    });
}
var Var100e200Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar100e200Conc,
    onEachFeature: onEachFeatureVar100e200Conc
});

let slideVar100e200Conc = function(){
    var sliderVar100e200Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar100e200Conc, {
        start: [minVar100e200Conc, maxVar100e200Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar100e200Conc,
            'max': maxVar100e200Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar100e200Conc);
    inputNumberMax.setAttribute("value",maxVar100e200Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar100e200Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar100e200Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar100e200Conc.noUiSlider.on('update',function(e){
        Var100e200Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var20021.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var20021.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar100e200Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderVar100e200Conc.noUiSlider;
    $(slidersGeral).append(sliderVar100e200Conc);
} 

///////////////////////////// Fim VARIAÇÃO 100€ E 200€, CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação ENTRE 200€ E 300€ POR CONCELHOS -------------------////

var minVar200e300Conc = 99999;
var maxVar200e300Conc = 0;

function CorVar200e300Conc(d) {
    return d === null ? '#808080':
        d >= 40  ? '#8c0303' :
        d >= 25  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
                ''  ;
}

var legendaVar200e300Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 200 e 299.99€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 40 ' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  25 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -4.13 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}   


function EstiloVar200e300Conc(feature) {
    if(feature.properties.Var30021 <= minVar200e300Conc || minVar200e300Conc ===0){
        minVar200e300Conc = feature.properties.Var30021
    }
    if(feature.properties.Var30021 > maxVar200e300Conc){
        maxVar200e300Conc = feature.properties.Var30021 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar200e300Conc(feature.properties.Var30021)};
    }


function apagarVar200e300Conc(e) {
    Var200e300Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar200e300Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var30021.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar200e300Conc,
    });
}
var Var200e300Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar200e300Conc,
    onEachFeature: onEachFeatureVar200e300Conc
});

let slideVar200e300Conc = function(){
    var sliderVar200e300Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar200e300Conc, {
        start: [minVar200e300Conc, maxVar200e300Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar200e300Conc,
            'max': maxVar200e300Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar200e300Conc);
    inputNumberMax.setAttribute("value",maxVar200e300Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar200e300Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar200e300Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar200e300Conc.noUiSlider.on('update',function(e){
        Var200e300Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var30021.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var30021.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar200e300Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderVar200e300Conc.noUiSlider;
    $(slidersGeral).append(sliderVar200e300Conc);
} 

///////////////////////////// Fim VARIAÇÃO 200€ E 300€, CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação ENTRE 300€ E 400€ POR CONCELHOS -------------------////

var minVar300e400Conc = 99999;
var maxVar300e400Conc = 0;

function CorVar300e400Conc(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -19  ? '#2288bf' :
                ''  ;
}

var legendaVar300e400Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 300 e 399.99€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10 ' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -18.57 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}   

function EstiloVar300e400Conc(feature) {
    if(feature.properties.Var40021 <= minVar300e400Conc || minVar300e400Conc ===0){
        minVar300e400Conc = feature.properties.Var40021
    }
    if(feature.properties.Var40021 > maxVar300e400Conc){
        maxVar300e400Conc = feature.properties.Var40021 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar300e400Conc(feature.properties.Var40021)};
    }


function apagarVar300e400Conc(e) {
    Var300e400Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar300e400Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var40021.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar300e400Conc,
    });
}
var Var300e400Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar300e400Conc,
    onEachFeature: onEachFeatureVar300e400Conc
});

let slideVar300e400Conc = function(){
    var sliderVar300e400Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar300e400Conc, {
        start: [minVar300e400Conc, maxVar300e400Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar300e400Conc,
            'max': maxVar300e400Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar300e400Conc);
    inputNumberMax.setAttribute("value",maxVar300e400Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar300e400Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar300e400Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar300e400Conc.noUiSlider.on('update',function(e){
        Var300e400Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var40021.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var40021.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar300e400Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderVar300e400Conc.noUiSlider;
    $(slidersGeral).append(sliderVar300e400Conc);
} 

///////////////////////////// Fim VARIAÇÃO 300€ E 400€, CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação ENTRE 400€ E 650€ POR CONCELHOS -------------------////

var minVar400e650Conc = 99999;
var maxVar400e650Conc = -99;

function CorVar400e650Conc(d) {
    return d === null ? '#808080':
        d >= -20  ? '#8FC1B5' :
        d >= -25  ? '#9ebbd7' :
        d >= -35  ? '#2288bf' :
        d >= -45  ? '#155273' :
        d >= -55  ? '#0b2c40' :
                ''  ;
}

var legendaVar400e650Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 400 e 649.99€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8FC1B5"></i>' + '  > -20 ' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -35 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -45 a -35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -54.27 a -45' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
} 

function EstiloVar400e650Conc(feature) {
    if(feature.properties.Var65021 <= minVar400e650Conc){
        minVar400e650Conc = feature.properties.Var65021
    }
    if(feature.properties.Var65021 > maxVar400e650Conc){
        maxVar400e650Conc = feature.properties.Var65021 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar400e650Conc(feature.properties.Var65021)};
    }


function apagarVar400e650Conc(e) {
    Var400e650Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar400e650Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var65021.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar400e650Conc,
    });
}
var Var400e650Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar400e650Conc,
    onEachFeature: onEachFeatureVar400e650Conc
});

let slideVar400e650Conc = function(){
    var sliderVar400e650Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar400e650Conc, {
        start: [minVar400e650Conc, maxVar400e650Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar400e650Conc,
            'max': maxVar400e650Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar400e650Conc);
    inputNumberMax.setAttribute("value",maxVar400e650Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar400e650Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar400e650Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar400e650Conc.noUiSlider.on('update',function(e){
        Var400e650Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var65021.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var65021.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar400e650Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderVar400e650Conc.noUiSlider;
    $(slidersGeral).append(sliderVar400e650Conc);
} 

///////////////////////////// Fim VARIAÇÃO 400€ E 650€, CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação MAIS 650€ POR CONCELHOS -------------------////

var minVarMais650Conc = 99999;
var maxVarMais650Conc = -99;

function CorVarMais650Conc(d) {
    return d === null ? '#808080':
        d >= -15  ? '#8FC1B5' :
        d >= -20  ? '#9ebbd7' :
        d >= -30  ? '#2288bf' :
        d >= -50  ? '#155273' :
        d >= -67  ? '#0b2c40' :
                ''  ;
}

var legendaVarMais650Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal superior a 650€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8FC1B5"></i>' + '  > -15 ' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -20 a -15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -30 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -50 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -65.88 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
} 

function EstiloVarMais650Conc(feature) {
    if(feature.properties.VarM65021 <= minVarMais650Conc){
        minVarMais650Conc = feature.properties.VarM65021
    }
    if(feature.properties.VarM65021 > maxVarMais650Conc){
        maxVarMais650Conc = feature.properties.VarM65021 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMais650Conc(feature.properties.VarM65021)};
    }


function apagarVarMais650Conc(e) {
    VarMais650Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMais650Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarM65021.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMais650Conc,
    });
}
var VarMais650Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarMais650Conc,
    onEachFeature: onEachFeatureVarMais650Conc
});

let slideVarMais650Conc = function(){
    var sliderVarMais650Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMais650Conc, {
        start: [minVarMais650Conc, maxVarMais650Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMais650Conc,
            'max': maxVarMais650Conc
        },
        });
    inputNumberMin.setAttribute("value",minVarMais650Conc);
    inputNumberMax.setAttribute("value",maxVarMais650Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMais650Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMais650Conc.noUiSlider.set([null, this.value]);
    });

    sliderVarMais650Conc.noUiSlider.on('update',function(e){
        VarMais650Conc.eachLayer(function(layer){
            if(layer.feature.properties.VarM65021.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarM65021.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMais650Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderVarMais650Conc.noUiSlider;
    $(slidersGeral).append(sliderVarMais650Conc);
} 

///////////////////////////// Fim VARIAÇÃO MAIS 650€, CONCELHOS -------------- \\\\\

//////////////////////////////////////////---------------------- FIM DADOS CONCELHOS --------------\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL Alojamentos PROPRIEDADES OCUPANTES 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalAlojResiHabiFreg11 = 99999;
var maxTotalAlojResiHabiFreg11 = 0;
function estiloTotalAlojResiHabiFreg11(feature, latlng) {
    if(feature.properties.Enc_Tot11< minTotalAlojResiHabiFreg11 || feature.properties.Enc_Tot11 ===0){
        minTotalAlojResiHabiFreg11 = feature.properties.Enc_Tot11
    }
    if(feature.properties.Enc_Tot11> maxTotalAlojResiHabiFreg11){
        maxTotalAlojResiHabiFreg11 = feature.properties.Enc_Tot11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Tot11,0.2)
    });
}
function apagarTotalAlojResiHabiFreg11(e){
    var layer = e.target;
    TotalAlojResiHabiFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalAlojResiHabiFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Alojamentos familiares clássicos de residência habitual de propriedade dos ocupantes: '  + '<b>'+ feature.properties.Enc_Tot11+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalAlojResiHabiFreg11,
    })
};

var TotalAlojResiHabiFreg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloTotalAlojResiHabiFreg11,
    onEachFeature: onEachFeatureTotalAlojResiHabiFreg11,
});

var slideTotalAlojResiHabiFreg11 = function(){
    var sliderTotalAlojResiHabiFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalAlojResiHabiFreg11, {
        start: [minTotalAlojResiHabiFreg11, maxTotalAlojResiHabiFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAlojResiHabiFreg11,
            'max': maxTotalAlojResiHabiFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAlojResiHabiFreg11);
    inputNumberMax.setAttribute("value",maxTotalAlojResiHabiFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalAlojResiHabiFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalAlojResiHabiFreg11.noUiSlider.set([null, this.value]);
    });

    sliderTotalAlojResiHabiFreg11.noUiSlider.on('update',function(e){
        TotalAlojResiHabiFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Tot11>=parseFloat(e[0])&& layer.feature.properties.Enc_Tot11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalAlojResiHabiFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderTotalAlojResiHabiFreg11.noUiSlider;
    $(slidersGeral).append(sliderTotalAlojResiHabiFreg11);
}


///////////////////////////-------------------- FIM TOTAL Alojamentos PROPRIEDADES OCUPANTES 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- SEM ENCARGOS, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minSemEncargosFreg11 = 99999;
var maxSemEncargosFreg11 = 0;
function estiloSemEncargosFreg11(feature, latlng) {
    if(feature.properties.Enc_Sem11< minSemEncargosFreg11 || minSemEncargosFreg11 ===0){
        minSemEncargosFreg11 = feature.properties.Enc_Sem11
    }
    if(feature.properties.Enc_Sem11> maxSemEncargosFreg11){
        maxSemEncargosFreg11 = feature.properties.Enc_Sem11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Sem11,0.2)
    });
}
function apagarSemEncargosFreg11(e){
    var layer = e.target;
    SemEncargosFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureSemEncargosFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem encargos mensais: ' + '<b>' +feature.properties.Enc_Sem11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarSemEncargosFreg11,
    })
};

var SemEncargosFreg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloSemEncargosFreg11,
    onEachFeature: onEachFeatureSemEncargosFreg11,
});

var slideSemEncargosFreg11 = function(){
    var sliderSemEncargosFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderSemEncargosFreg11, {
        start: [minSemEncargosFreg11, maxSemEncargosFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minSemEncargosFreg11,
            'max': maxSemEncargosFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minSemEncargosFreg11);
    inputNumberMax.setAttribute("value",maxSemEncargosFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderSemEncargosFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSemEncargosFreg11.noUiSlider.set([null, this.value]);
    });

    sliderSemEncargosFreg11.noUiSlider.on('update',function(e){
        SemEncargosFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Sem11>=parseFloat(e[0])&& layer.feature.properties.Enc_Sem11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderSemEncargosFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderSemEncargosFreg11.noUiSlider;
    $(slidersGeral).append(sliderSemEncargosFreg11);
}
///////////////////////////-------------------- FIM SEM ENCARGOS, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- COM ENCARGOS, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minComEncargosFreg11 = 99999;
var maxComEncargosFreg11 = 0;
function estiloComEncargosFreg11(feature, latlng) {
    if(feature.properties.Enc_Com11< minComEncargosFreg11 || minComEncargosFreg11 ===0){
        minComEncargosFreg11 = feature.properties.Enc_Com11
    }
    if(feature.properties.Enc_Com11> maxComEncargosFreg11){
        maxComEncargosFreg11 = feature.properties.Enc_Com11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Com11,0.2)
    });
}
function apagarComEncargosFreg11(e){
    var layer = e.target;
    ComEncargosFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureComEncargosFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com encargos mensais: ' + '<b>' +feature.properties.Enc_Com11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarComEncargosFreg11,
    })
};

var ComEncargosFreg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloComEncargosFreg11,
    onEachFeature: onEachFeatureComEncargosFreg11,
});

var slideComEncargosFreg11 = function(){
    var sliderComEncargosFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderComEncargosFreg11, {
        start: [minComEncargosFreg11, maxComEncargosFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minComEncargosFreg11,
            'max': maxComEncargosFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minComEncargosFreg11);
    inputNumberMax.setAttribute("value",maxComEncargosFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderComEncargosFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderComEncargosFreg11.noUiSlider.set([null, this.value]);
    });

    sliderComEncargosFreg11.noUiSlider.on('update',function(e){
        ComEncargosFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Com11>=parseFloat(e[0])&& layer.feature.properties.Enc_Com11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderComEncargosFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderComEncargosFreg11.noUiSlider;
    $(slidersGeral).append(sliderComEncargosFreg11);
}
///////////////////////////-------------------- FIM COM ENCARGOS, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MENOS 1OO€, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minMenos100Freg11 = 99999;
var maxMenos100Freg11 = 0;
function estiloMenos100Freg11(feature, latlng) {
    if(feature.properties.Enc_100E11< minMenos100Freg11 || minMenos100Freg11 ===0){
        minMenos100Freg11 = feature.properties.Enc_100E11
    }
    if(feature.properties.Enc_100E11> maxMenos100Freg11){
        maxMenos100Freg11 = feature.properties.Enc_100E11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_100E11,0.8)
    });
}
function apagarMenos100Freg11(e){
    var layer = e.target;
    Menos100Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMenos100Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais inferior a 100€: ' + '<b>' +feature.properties.Enc_100E11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMenos100Freg11,
    })
};

var Menos100Freg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloMenos100Freg11,
    onEachFeature: onEachFeatureMenos100Freg11,
});

var slideMenos100Freg11 = function(){
    var sliderMenos100Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMenos100Freg11, {
        start: [minMenos100Freg11, maxMenos100Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minMenos100Freg11,
            'max': maxMenos100Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMenos100Freg11);
    inputNumberMax.setAttribute("value",maxMenos100Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderMenos100Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMenos100Freg11.noUiSlider.set([null, this.value]);
    });

    sliderMenos100Freg11.noUiSlider.on('update',function(e){
        Menos100Freg11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_100E11>=parseFloat(e[0])&& layer.feature.properties.Enc_100E11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMenos100Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderMenos100Freg11.noUiSlider;
    $(slidersGeral).append(sliderMenos100Freg11);
}
///////////////////////////-------------------- FIM MENOS 100€, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 1OO€ E 200€, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEnc100a200Freg11 = 99999;
var maxEnc100a200Freg11 = 0;
function estiloEnc100a200Freg11(feature, latlng) {
    if(feature.properties.Enc_200E11< minEnc100a200Freg11 || minEnc100a200Freg11 ===0){
        minEnc100a200Freg11 = feature.properties.Enc_200E11
    }
    if(feature.properties.Enc_200E11> maxEnc100a200Freg11){
        maxEnc100a200Freg11 = feature.properties.Enc_200E11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_200E11,0.35)
    });
}
function apagarEnc100a200Freg11(e){
    var layer = e.target;
    Enc100a200Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc100a200Freg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 100€ e 199.99€: ' + '<b>' +feature.properties.Enc_200E11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc100a200Freg11,
    })
};

var Enc100a200Freg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloEnc100a200Freg11,
    onEachFeature: onEachFeatureEnc100a200Freg11,
});

var slideEnc100a200Freg11 = function(){
    var sliderEnc100a200Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc100a200Freg11, {
        start: [minEnc100a200Freg11, maxEnc100a200Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc100a200Freg11,
            'max': maxEnc100a200Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc100a200Freg11);
    inputNumberMax.setAttribute("value",maxEnc100a200Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc100a200Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc100a200Freg11.noUiSlider.set([null, this.value]);
    });

    sliderEnc100a200Freg11.noUiSlider.on('update',function(e){
        Enc100a200Freg11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_200E11>=parseFloat(e[0])&& layer.feature.properties.Enc_200E11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc100a200Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderEnc100a200Freg11.noUiSlider;
    $(slidersGeral).append(sliderEnc100a200Freg11);
}
///////////////////////////-------------------- FIM ENTRE 100€ 200€, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 2OO€ E 300€, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEnc200a300Freg11 = 99999;
var maxEnc200a300Freg11 = 0;
function estiloEnc200a300Freg11(feature, latlng) {
    if(feature.properties.Enc_300E11< minEnc200a300Freg11 || minEnc200a300Freg11 ===0){
        minEnc200a300Freg11 = feature.properties.Enc_300E11
    }
    if(feature.properties.Enc_300E11> maxEnc200a300Freg11){
        maxEnc200a300Freg11 = feature.properties.Enc_300E11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_300E11,0.35)
    });
}
function apagarEnc200a300Freg11(e){
    var layer = e.target;
    Enc200a300Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc200a300Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 200€ e 299.99€: ' + '<b>' +feature.properties.Enc_300E11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc200a300Freg11,
    })
};

var Enc200a300Freg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloEnc200a300Freg11,
    onEachFeature: onEachFeatureEnc200a300Freg11,
});

var slideEnc200a300Freg11 = function(){
    var sliderEnc200a300Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc200a300Freg11, {
        start: [minEnc200a300Freg11, maxEnc200a300Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc200a300Freg11,
            'max': maxEnc200a300Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc200a300Freg11);
    inputNumberMax.setAttribute("value",maxEnc200a300Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc200a300Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc200a300Freg11.noUiSlider.set([null, this.value]);
    });

    sliderEnc200a300Freg11.noUiSlider.on('update',function(e){
        Enc200a300Freg11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_300E11>=parseFloat(e[0])&& layer.feature.properties.Enc_300E11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc200a300Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderEnc200a300Freg11.noUiSlider;
    $(slidersGeral).append(sliderEnc200a300Freg11);
}
///////////////////////////-------------------- FIM ENTRE 200€ 300€, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 3OO€ E 400€, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEnc300a400Freg11 = 99999;
var maxEnc300a400Freg11 = 0;
function estiloEnc300a400Freg11(feature, latlng) {
    if(feature.properties.Enc_400E11< minEnc300a400Freg11 || minEnc300a400Freg11 ===0){
        minEnc300a400Freg11 = feature.properties.Enc_400E11
    }
    if(feature.properties.Enc_400E11> maxEnc300a400Freg11){
        maxEnc300a400Freg11 = feature.properties.Enc_400E11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_400E11,0.35)
    });
}
function apagarEnc300a400Freg11(e){
    var layer = e.target;
    Enc300a400Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc300a400Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 300€ e 399.99€: ' + '<b>' +feature.properties.Enc_400E11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc300a400Freg11,
    })
};

var Enc300a400Freg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloEnc300a400Freg11,
    onEachFeature: onEachFeatureEnc300a400Freg11,
});

var slideEnc300a400Freg11 = function(){
    var sliderEnc300a400Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc300a400Freg11, {
        start: [minEnc300a400Freg11, maxEnc300a400Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc300a400Freg11,
            'max': maxEnc300a400Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc300a400Freg11);
    inputNumberMax.setAttribute("value",maxEnc300a400Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc300a400Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc300a400Freg11.noUiSlider.set([null, this.value]);
    });

    sliderEnc300a400Freg11.noUiSlider.on('update',function(e){
        Enc300a400Freg11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_400E11>=parseFloat(e[0])&& layer.feature.properties.Enc_400E11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc300a400Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderEnc300a400Freg11.noUiSlider;
    $(slidersGeral).append(sliderEnc300a400Freg11);
}
///////////////////////////-------------------- FIM ENTRE 300€ 400€, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 4OO€ E 650€, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEnc400a650Freg11 = 99999;
var maxEnc400a650Freg11 = 0;
function estiloEnc400a650Freg11(feature, latlng) {
    if(feature.properties.Enc_650E11< minEnc400a650Freg11 || minEnc400a650Freg11 ===0){
        minEnc400a650Freg11 = feature.properties.Enc_650E11
    }
    if(feature.properties.Enc_650E11> maxEnc400a650Freg11){
        maxEnc400a650Freg11 = feature.properties.Enc_650E11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_650E11,0.35)
    });
}
function apagarEnc400a650Freg11(e){
    var layer = e.target;
    Enc400a650Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc400a650Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 400€ e 649.99€: ' + '<b>' +feature.properties.Enc_650E11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc400a650Freg11,
    })
};

var Enc400a650Freg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloEnc400a650Freg11,
    onEachFeature: onEachFeatureEnc400a650Freg11,
});

var slideEnc400a650Freg11 = function(){
    var sliderEnc400a650Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc400a650Freg11, {
        start: [minEnc400a650Freg11, maxEnc400a650Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc400a650Freg11,
            'max': maxEnc400a650Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc400a650Freg11);
    inputNumberMax.setAttribute("value",maxEnc400a650Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc400a650Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc400a650Freg11.noUiSlider.set([null, this.value]);
    });

    sliderEnc400a650Freg11.noUiSlider.on('update',function(e){
        Enc400a650Freg11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_650E11>=parseFloat(e[0])&& layer.feature.properties.Enc_650E11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc400a650Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderEnc400a650Freg11.noUiSlider;
    $(slidersGeral).append(sliderEnc400a650Freg11);
}
///////////////////////////-------------------- FIM ENTRE 400€ 650€, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MAIS 650€, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEncMais650Freg11 = 99999;
var maxEncMais650Freg11 = 0;
function estiloEncMais650Freg11(feature, latlng) {
    if(feature.properties.Enc_M65011< minEncMais650Freg11 || minEncMais650Freg11 ===0){
        minEncMais650Freg11 = feature.properties.Enc_M65011
    }
    if(feature.properties.Enc_M65011> maxEncMais650Freg11){
        maxEncMais650Freg11 = feature.properties.Enc_M65011
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_M65011,0.35)
    });
}
function apagarEncMais650Freg11(e){
    var layer = e.target;
    EncMais650Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEncMais650Freg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais superior a 650€: ' + '<b>' +feature.properties.Enc_M65011 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEncMais650Freg11,
    })
};

var EncMais650Freg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloEncMais650Freg11,
    onEachFeature: onEachFeatureEncMais650Freg11,
});

var slideEncMais650Freg11 = function(){
    var sliderEncMais650Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEncMais650Freg11, {
        start: [minEncMais650Freg11, maxEncMais650Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEncMais650Freg11,
            'max': maxEncMais650Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEncMais650Freg11);
    inputNumberMax.setAttribute("value",maxEncMais650Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEncMais650Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEncMais650Freg11.noUiSlider.set([null, this.value]);
    });

    sliderEncMais650Freg11.noUiSlider.on('update',function(e){
        EncMais650Freg11.eachLayer(function(layer){
            if(layer.feature.properties.Enc_M65011>=parseFloat(e[0])&& layer.feature.properties.Enc_M65011 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEncMais650Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderEncMais650Freg11.noUiSlider;
    $(slidersGeral).append(sliderEncMais650Freg11);
}
///////////////////////////-------------------- FIM MAIS 650€, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Alojamentos PROPRIEDADES OCUPANTES 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalAlojResiHabiFreg21 = 99999;
var maxTotalAlojResiHabiFreg21 = 0;
function estiloTotalAlojResiHabiFreg21(feature, latlng) {
    if(feature.properties.Enc_Tot21< minTotalAlojResiHabiFreg21 || feature.properties.Enc_Tot21 ===0){
        minTotalAlojResiHabiFreg21 = feature.properties.Enc_Tot21
    }
    if(feature.properties.Enc_Tot21> maxTotalAlojResiHabiFreg21){
        maxTotalAlojResiHabiFreg21 = feature.properties.Enc_Tot21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Tot21,0.2)
    });
}
function apagarTotalAlojResiHabiFreg21(e){
    var layer = e.target;
    TotalAlojResiHabiFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalAlojResiHabiFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos familiares clássicos de residência habitual de propriedade dos ocupantes: ' + '<b>' +feature.properties.Enc_Tot21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalAlojResiHabiFreg21,
    })
};

var TotalAlojResiHabiFreg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalAlojResiHabiFreg21,
    onEachFeature: onEachFeatureTotalAlojResiHabiFreg21,
});

var slideTotalAlojResiHabiFreg21 = function(){
    var sliderTotalAlojResiHabiFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalAlojResiHabiFreg21, {
        start: [minTotalAlojResiHabiFreg21, maxTotalAlojResiHabiFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalAlojResiHabiFreg21,
            'max': maxTotalAlojResiHabiFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalAlojResiHabiFreg21);
    inputNumberMax.setAttribute("value",maxTotalAlojResiHabiFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalAlojResiHabiFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalAlojResiHabiFreg21.noUiSlider.set([null, this.value]);
    });

    sliderTotalAlojResiHabiFreg21.noUiSlider.on('update',function(e){
        TotalAlojResiHabiFreg21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Tot21>=parseFloat(e[0])&& layer.feature.properties.Enc_Tot21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalAlojResiHabiFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderTotalAlojResiHabiFreg21.noUiSlider;
    $(slidersGeral).append(sliderTotalAlojResiHabiFreg21);
}

///////////////////////////-------------------- FIM TOTAL Alojamentos PROPRIEDADES OCUPANTES 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- SEM ENCARGOS, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minSemEncargosFreg21 = 99999;
var maxSemEncargosFreg21 = 0;
function estiloSemEncargosFreg21(feature, latlng) {
    if(feature.properties.Enc_Sem21< minSemEncargosFreg21 || minSemEncargosFreg21 ===0){
        minSemEncargosFreg21 = feature.properties.Enc_Sem21
    }
    if(feature.properties.Enc_Sem21> maxSemEncargosFreg21){
        maxSemEncargosFreg21 = feature.properties.Enc_Sem21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Sem21,0.2)
    });
}
function apagarSemEncargosFreg21(e){
    var layer = e.target;
    SemEncargosFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureSemEncargosFreg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem encargos mensais: ' + '<b>' +feature.properties.Enc_Sem21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarSemEncargosFreg21,
    })
};

var SemEncargosFreg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloSemEncargosFreg21,
    onEachFeature: onEachFeatureSemEncargosFreg21,
});

var slideSemEncargosFreg21 = function(){
    var sliderSemEncargosFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderSemEncargosFreg21, {
        start: [minSemEncargosFreg21, maxSemEncargosFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minSemEncargosFreg21,
            'max': maxSemEncargosFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minSemEncargosFreg21);
    inputNumberMax.setAttribute("value",maxSemEncargosFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderSemEncargosFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSemEncargosFreg21.noUiSlider.set([null, this.value]);
    });

    sliderSemEncargosFreg21.noUiSlider.on('update',function(e){
        SemEncargosFreg21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Sem21>=parseFloat(e[0])&& layer.feature.properties.Enc_Sem21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderSemEncargosFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderSemEncargosFreg21.noUiSlider;
    $(slidersGeral).append(sliderSemEncargosFreg21);
}
///////////////////////////-------------------- FIM SEM ENCARGOS, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- COM ENCARGOS, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minComEncargosFreg21 = 99999;
var maxComEncargosFreg21 = 0;
function estiloComEncargosFreg21(feature, latlng) {
    if(feature.properties.Enc_Com21< minComEncargosFreg21 || minComEncargosFreg21 ===0){
        minComEncargosFreg21 = feature.properties.Enc_Com21
    }
    if(feature.properties.Enc_Com21> maxComEncargosFreg21){
        maxComEncargosFreg21 = feature.properties.Enc_Com21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_Com21,0.2)
    });
}
function apagarComEncargosFreg21(e){
    var layer = e.target;
    ComEncargosFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureComEncargosFreg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com encargos mensais: ' + '<b>' +feature.properties.Enc_Com21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarComEncargosFreg21,
    })
};

var ComEncargosFreg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloComEncargosFreg21,
    onEachFeature: onEachFeatureComEncargosFreg21,
});

var slideComEncargosFreg21 = function(){
    var sliderComEncargosFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderComEncargosFreg21, {
        start: [minComEncargosFreg21, maxComEncargosFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minComEncargosFreg21,
            'max': maxComEncargosFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minComEncargosFreg21);
    inputNumberMax.setAttribute("value",maxComEncargosFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderComEncargosFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderComEncargosFreg21.noUiSlider.set([null, this.value]);
    });

    sliderComEncargosFreg21.noUiSlider.on('update',function(e){
        ComEncargosFreg21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_Com21>=parseFloat(e[0])&& layer.feature.properties.Enc_Com21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderComEncargosFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderComEncargosFreg21.noUiSlider;
    $(slidersGeral).append(sliderComEncargosFreg21);
}
///////////////////////////-------------------- FIM COM ENCARGOS, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MENOS 1OO€, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minMenos100Freg21 = 99999;
var maxMenos100Freg21 = 0;
function estiloMenos100Freg21(feature, latlng) {
    if(feature.properties.Enc_100E21< minMenos100Freg21 || minMenos100Freg21 ===0){
        minMenos100Freg21 = feature.properties.Enc_100E21
    }
    if(feature.properties.Enc_100E21> maxMenos100Freg21){
        maxMenos100Freg21 = feature.properties.Enc_100E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_100E21,0.8)
    });
}
function apagarMenos100Freg21(e){
    var layer = e.target;
    Menos100Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMenos100Freg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais inferior a 100€: ' + '<b>' +feature.properties.Enc_100E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMenos100Freg21,
    })
};

var Menos100Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloMenos100Freg21,
    onEachFeature: onEachFeatureMenos100Freg21,
});

var slideMenos100Freg21 = function(){
    var sliderMenos100Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMenos100Freg21, {
        start: [minMenos100Freg21, maxMenos100Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minMenos100Freg21,
            'max': maxMenos100Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMenos100Freg21);
    inputNumberMax.setAttribute("value",maxMenos100Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderMenos100Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMenos100Freg21.noUiSlider.set([null, this.value]);
    });

    sliderMenos100Freg21.noUiSlider.on('update',function(e){
        Menos100Freg21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_100E21>=parseFloat(e[0])&& layer.feature.properties.Enc_100E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMenos100Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderMenos100Freg21.noUiSlider;
    $(slidersGeral).append(sliderMenos100Freg21);
}
///////////////////////////-------------------- FIM MENOS 100€, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 1OO€ E 200€, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEnc100a200Freg21 = 99999;
var maxEnc100a200Freg21 = 0;
function estiloEnc100a200Freg21(feature, latlng) {
    if(feature.properties.Enc_200E21< minEnc100a200Freg21 || minEnc100a200Freg21 ===0){
        minEnc100a200Freg21 = feature.properties.Enc_200E21
    }
    if(feature.properties.Enc_200E21> maxEnc100a200Freg21){
        maxEnc100a200Freg21 = feature.properties.Enc_200E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_200E21,0.35)
    });
}
function apagarEnc100a200Freg21(e){
    var layer = e.target;
    Enc100a200Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc100a200Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 100€ e 199.99€: ' + '<b>' +feature.properties.Enc_200E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc100a200Freg21,
    })
};

var Enc100a200Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEnc100a200Freg21,
    onEachFeature: onEachFeatureEnc100a200Freg21,
});

var slideEnc100a200Freg21 = function(){
    var sliderEnc100a200Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc100a200Freg21, {
        start: [minEnc100a200Freg21, maxEnc100a200Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc100a200Freg21,
            'max': maxEnc100a200Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc100a200Freg21);
    inputNumberMax.setAttribute("value",maxEnc100a200Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc100a200Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc100a200Freg21.noUiSlider.set([null, this.value]);
    });

    sliderEnc100a200Freg21.noUiSlider.on('update',function(e){
        Enc100a200Freg21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_200E21>=parseFloat(e[0])&& layer.feature.properties.Enc_200E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc100a200Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderEnc100a200Freg21.noUiSlider;
    $(slidersGeral).append(sliderEnc100a200Freg21);
}
///////////////////////////-------------------- FIM ENTRE 100€ 200€, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 2OO€ E 300€, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEnc200a300Freg21 = 99999;
var maxEnc200a300Freg21 = 0;
function estiloEnc200a300Freg21(feature, latlng) {
    if(feature.properties.Enc_300E21< minEnc200a300Freg21 || minEnc200a300Freg21 ===0){
        minEnc200a300Freg21 = feature.properties.Enc_300E21
    }
    if(feature.properties.Enc_300E21> maxEnc200a300Freg21){
        maxEnc200a300Freg21 = feature.properties.Enc_300E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_300E21,0.35)
    });
}
function apagarEnc200a300Freg21(e){
    var layer = e.target;
    Enc200a300Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc200a300Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 200€ e 299.99€: ' + '<b>' +feature.properties.Enc_300E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc200a300Freg21,
    })
};

var Enc200a300Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEnc200a300Freg21,
    onEachFeature: onEachFeatureEnc200a300Freg21,
});

var slideEnc200a300Freg21 = function(){
    var sliderEnc200a300Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc200a300Freg21, {
        start: [minEnc200a300Freg21, maxEnc200a300Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc200a300Freg21,
            'max': maxEnc200a300Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc200a300Freg21);
    inputNumberMax.setAttribute("value",maxEnc200a300Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc200a300Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc200a300Freg21.noUiSlider.set([null, this.value]);
    });

    sliderEnc200a300Freg21.noUiSlider.on('update',function(e){
        Enc200a300Freg21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_300E21>=parseFloat(e[0])&& layer.feature.properties.Enc_300E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc200a300Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderEnc200a300Freg21.noUiSlider;
    $(slidersGeral).append(sliderEnc200a300Freg21);
}
///////////////////////////-------------------- FIM ENTRE 200€ 300€, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 3OO€ E 400€, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEnc300a400Freg21 = 99999;
var maxEnc300a400Freg21 = 0;
function estiloEnc300a400Freg21(feature, latlng) {
    if(feature.properties.Enc_400E21< minEnc300a400Freg21 || minEnc300a400Freg21 ===0){
        minEnc300a400Freg21 = feature.properties.Enc_400E21
    }
    if(feature.properties.Enc_400E21> maxEnc300a400Freg21){
        maxEnc300a400Freg21 = feature.properties.Enc_400E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_400E21,0.35)
    });
}
function apagarEnc300a400Freg21(e){
    var layer = e.target;
    Enc300a400Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc300a400Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 300€ e 399.99€: ' + '<b>' +feature.properties.Enc_400E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc300a400Freg21,
    })
};

var Enc300a400Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEnc300a400Freg21,
    onEachFeature: onEachFeatureEnc300a400Freg21,
});

var slideEnc300a400Freg21 = function(){
    var sliderEnc300a400Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc300a400Freg21, {
        start: [minEnc300a400Freg21, maxEnc300a400Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc300a400Freg21,
            'max': maxEnc300a400Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc300a400Freg21);
    inputNumberMax.setAttribute("value",maxEnc300a400Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc300a400Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc300a400Freg21.noUiSlider.set([null, this.value]);
    });

    sliderEnc300a400Freg21.noUiSlider.on('update',function(e){
        Enc300a400Freg21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_400E21>=parseFloat(e[0])&& layer.feature.properties.Enc_400E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc300a400Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderEnc300a400Freg21.noUiSlider;
    $(slidersGeral).append(sliderEnc300a400Freg21);
}
///////////////////////////-------------------- FIM ENTRE 300€ 400€, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 4OO€ E 650€, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEnc400a650Freg21 = 99999;
var maxEnc400a650Freg21 = 0;
function estiloEnc400a650Freg21(feature, latlng) {
    if(feature.properties.Enc_650E21< minEnc400a650Freg21 || minEnc400a650Freg21 ===0){
        minEnc400a650Freg21 = feature.properties.Enc_650E21
    }
    if(feature.properties.Enc_650E21> maxEnc400a650Freg21){
        maxEnc400a650Freg21 = feature.properties.Enc_650E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_650E21,0.35)
    });
}
function apagarEnc400a650Freg21(e){
    var layer = e.target;
    Enc400a650Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc400a650Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 400€ e 649.99€: ' + '<b>' +feature.properties.Enc_650E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc400a650Freg21,
    })
};

var Enc400a650Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEnc400a650Freg21,
    onEachFeature: onEachFeatureEnc400a650Freg21,
});

var slideEnc400a650Freg21 = function(){
    var sliderEnc400a650Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc400a650Freg21, {
        start: [minEnc400a650Freg21, maxEnc400a650Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc400a650Freg21,
            'max': maxEnc400a650Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc400a650Freg21);
    inputNumberMax.setAttribute("value",maxEnc400a650Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc400a650Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc400a650Freg21.noUiSlider.set([null, this.value]);
    });

    sliderEnc400a650Freg21.noUiSlider.on('update',function(e){
        Enc400a650Freg21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_650E21>=parseFloat(e[0])&& layer.feature.properties.Enc_650E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc400a650Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderEnc400a650Freg21.noUiSlider;
    $(slidersGeral).append(sliderEnc400a650Freg21);
}
///////////////////////////-------------------- FIM ENTRE 400€ 650€, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 650€ E 999€, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEnc650a999Freg21 = 99999;
var maxEnc650a999Freg21 = 0;
function estiloEnc650a999Freg21(feature, latlng) {
    if(feature.properties.Enc_999E21< minEnc650a999Freg21 || minEnc650a999Freg21 ===0){
        minEnc650a999Freg21 = feature.properties.Enc_999E21
    }
    if(feature.properties.Enc_999E21> maxEnc650a999Freg21){
        maxEnc650a999Freg21 = feature.properties.Enc_999E21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_999E21,0.6)
    });
}
function apagarEnc650a999Freg21(e){
    var layer = e.target;
    Enc650a999Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEnc650a999Freg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais entre 650 e 999.99€: ' + '<b>' +feature.properties.Enc_999E21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEnc650a999Freg21,
    })
};

var Enc650a999Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEnc650a999Freg21,
    onEachFeature: onEachFeatureEnc650a999Freg21,
});

var slideEnc650a999Freg21 = function(){
    var sliderEnc650a999Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEnc650a999Freg21, {
        start: [minEnc650a999Freg21, maxEnc650a999Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEnc650a999Freg21,
            'max': maxEnc650a999Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEnc650a999Freg21);
    inputNumberMax.setAttribute("value",maxEnc650a999Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEnc650a999Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEnc650a999Freg21.noUiSlider.set([null, this.value]);
    });

    sliderEnc650a999Freg21.noUiSlider.on('update',function(e){
        Enc650a999Freg21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_999E21>=parseFloat(e[0])&& layer.feature.properties.Enc_999E21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEnc650a999Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderEnc650a999Freg21.noUiSlider;
    $(slidersGeral).append(sliderEnc650a999Freg21);
}
///////////////////////////-------------------- FIM ENTRE 650 a 999€, EM 2021,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MAIS 1000€, EM 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEncMais1000Freg21 = 99999;
var maxEncMais1000Freg21 = 0;
function estiloEncMais1000Freg21(feature, latlng) {
    if(feature.properties.Enc_100021< minEncMais1000Freg21 || minEncMais1000Freg21 ===0){
        minEncMais1000Freg21 = feature.properties.Enc_100021
    }
    if(feature.properties.Enc_100021> maxEncMais1000Freg21){
        maxEncMais1000Freg21 = feature.properties.Enc_100021
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Enc_100021,0.7)
    });
}
function apagarEncMais1000Freg21(e){
    var layer = e.target;
    EncMais1000Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEncMais1000Freg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + '<b>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos com valor de encargos mensais superior a 1000€: ' + '<b>' +feature.properties.Enc_100021 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEncMais1000Freg21,
    })
};

var EncMais1000Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEncMais1000Freg21,
    onEachFeature: onEachFeatureEncMais1000Freg21,
});

var slideEncMais1000Freg21 = function(){
    var sliderEncMais1000Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEncMais1000Freg21, {
        start: [minEncMais1000Freg21, maxEncMais1000Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEncMais1000Freg21,
            'max': maxEncMais1000Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEncMais1000Freg21);
    inputNumberMax.setAttribute("value",maxEncMais1000Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEncMais1000Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEncMais1000Freg21.noUiSlider.set([null, this.value]);
    });

    sliderEncMais1000Freg21.noUiSlider.on('update',function(e){
        EncMais1000Freg21.eachLayer(function(layer){
            if(layer.feature.properties.Enc_100021>=parseFloat(e[0])&& layer.feature.properties.Enc_100021 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEncMais1000Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderEncMais1000Freg21.noUiSlider;
    $(slidersGeral).append(sliderEncMais1000Freg21);
}
///////////////////////////-------------------- FIM MAIS 1000€, EM 2021, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////-------------------- FIM DADOS ABSOLUTOS, POR FREGUESIA

/////////////////////////////------------------------------ DADOS RELATIVOS, FREGUESIA

////////////////////////////------- Percentagem RENDA BAIXA FREGUESIA Em 2011-----////

var minRendaBaixaFreg11 = 99999;
var maxRendaBaixaFreg11 = 0;

function CorRendaBaixaFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 15 ? '#8c0303' :
        d >= 12.5  ? '#de1f35' :
        d >= 8.34 ? '#ff5e6e' :
        d >= 4.17   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaRendaBaixaFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 12.5 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 8.34 a 12.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 4.17 a 8.34' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0 a 4.17' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloRendaBaixaFreg11(feature) {
    if( feature.properties.EncBaixo11 <= minRendaBaixaFreg11){
        minRendaBaixaFreg11 = feature.properties.EncBaixo11
    }
    if(feature.properties.EncBaixo11 >= maxRendaBaixaFreg11 ){
        maxRendaBaixaFreg11 = feature.properties.EncBaixo11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorRendaBaixaFreg(feature.properties.EncBaixo11)
    };
}
function apagarRendaBaixaFreg11(e) {
    RendaBaixaFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaBaixaFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' +  '<b>' + feature.properties.Freguesia + '</b>' +'<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal baixo: ' + '<b>' + feature.properties.EncBaixo11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaBaixaFreg11,
    });
}
var RendaBaixaFreg11= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloRendaBaixaFreg11,
    onEachFeature: onEachFeatureRendaBaixaFreg11
});
let slideRendaBaixaFreg11 = function(){
    var sliderRendaBaixaFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaBaixaFreg11, {
        start: [minRendaBaixaFreg11, maxRendaBaixaFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaBaixaFreg11,
            'max': maxRendaBaixaFreg11
        },
        });
    inputNumberMin.setAttribute("value",minRendaBaixaFreg11);
    inputNumberMax.setAttribute("value",maxRendaBaixaFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaBaixaFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaBaixaFreg11.noUiSlider.set([null, this.value]);
    });

    sliderRendaBaixaFreg11.noUiSlider.on('update',function(e){
        RendaBaixaFreg11.eachLayer(function(layer){
            if(layer.feature.properties.EncBaixo11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncBaixo11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaBaixaFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderRendaBaixaFreg11.noUiSlider;
    $(slidersGeral).append(sliderRendaBaixaFreg11);
} 

/////////////////////////////// Fim da RENDA BAIXA FREGUESIA Em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA MÉDIA FREGUESIA Em 2011-----////

var minRendaMediaFreg11 = 99999;
var maxRendaMediaFreg11 = 0;

function CorRendaMediaFreg(d) {
    return d == 0.0 ? '#808080' :
        d >= 69.61 ? '#8c0303' :
        d >= 63.56  ? '#de1f35' :
        d >= 53.49 ? '#ff5e6e' :
        d >= 43.41   ? '#f5b3be' :
        d >= 33.33   ? '#F2C572' :
                ''  ;
}
var legendaRendaMediaFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 69.61' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 63.56 a 69.61' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 53.49 a 63.56' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 43.41 a 53.49' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 33.33 a 43.41' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}


function EstiloRendaMediaFreg11(feature) {
    if( feature.properties.EncMedio11 <= minRendaMediaFreg11){
        minRendaMediaFreg11 = feature.properties.EncMedio11
    }
    if(feature.properties.EncMedio11 >= maxRendaMediaFreg11 ){
        maxRendaMediaFreg11 = feature.properties.EncMedio11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorRendaMediaFreg(feature.properties.EncMedio11)
    };
}
function apagarRendaMediaFreg11(e) {
    RendaMediaFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaMediaFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' +  '<b>' + feature.properties.Freguesia + '</b>' +'<br>' +'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal médio: ' + '<b>' + feature.properties.EncMedio11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaMediaFreg11,
    });
}
var RendaMediaFreg11= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloRendaMediaFreg11,
    onEachFeature: onEachFeatureRendaMediaFreg11
});
let slideRendaMediaFreg11 = function(){
    var sliderRendaMediaFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaMediaFreg11, {
        start: [minRendaMediaFreg11, maxRendaMediaFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaMediaFreg11,
            'max': maxRendaMediaFreg11
        },
        });
    inputNumberMin.setAttribute("value",minRendaMediaFreg11);
    inputNumberMax.setAttribute("value",maxRendaMediaFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaMediaFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaMediaFreg11.noUiSlider.set([null, this.value]);
    });

    sliderRendaMediaFreg11.noUiSlider.on('update',function(e){
        RendaMediaFreg11.eachLayer(function(layer){
            if(layer.feature.properties.EncMedio11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncMedio11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaMediaFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderRendaMediaFreg11.noUiSlider;
    $(slidersGeral).append(sliderRendaMediaFreg11);
} 

/////////////////////////////// Fim da RENDA MEDIA FREGUESIA Em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA ALTA FREGUESIA Em 2011-----////

var minRendaAltaFreg11 = 999;
var maxRendaAltaFreg11 = 0;

function CorRendaAltaFreg(d) {
    return d == null ? '#808080' :
        d >= 52.69 ? '#8c0303' :
        d >= 43.91  ? '#de1f35' :
        d >= 29.27 ? '#ff5e6e' :
        d >= 14.64   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaRendaAltaFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 52.69' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 43.91 a 52.69' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 29.27 a 43.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 14.64 a 29.27' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0 a 14.64' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloRendaAltaFreg11(feature) {
    if(feature.properties.EncAlto11 <= minRendaAltaFreg11){
        minRendaAltaFreg11 = feature.properties.EncAlto11
    }
    if(feature.properties.EncAlto11 >= maxRendaAltaFreg11 ){
        maxRendaAltaFreg11 = feature.properties.EncAlto11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorRendaAltaFreg(feature.properties.EncAlto11)
    };
}
function apagarRendaAltaFreg11(e) {
    RendaAltaFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaAltaFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' +  '<b>' + feature.properties.Freguesia + '</b>' +'<br>' +'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal alto: ' + '<b>' + feature.properties.EncAlto11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaAltaFreg11,
    });
}
var RendaAltaFreg11= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloRendaAltaFreg11,
    onEachFeature: onEachFeatureRendaAltaFreg11
});
let slideRendaAltaFreg11 = function(){
    var sliderRendaAltaFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaAltaFreg11, {
        start: [minRendaAltaFreg11, maxRendaAltaFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaAltaFreg11,
            'max': maxRendaAltaFreg11
        },
        });
    inputNumberMin.setAttribute("value",minRendaAltaFreg11);
    inputNumberMax.setAttribute("value",maxRendaAltaFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaAltaFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaAltaFreg11.noUiSlider.set([null, this.value]);
    });

    sliderRendaAltaFreg11.noUiSlider.on('update',function(e){
        RendaAltaFreg11.eachLayer(function(layer){
            if(layer.feature.properties.EncAlto11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncAlto11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaAltaFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderRendaAltaFreg11.noUiSlider;
    $(slidersGeral).append(sliderRendaAltaFreg11);
} 

/////////////////////////////// Fim da RENDA ALTA FREGUESIA Em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem SEM ENCARGOS FREGUESIA Em 2011-----////

var minPropSemEncFreg11 = 99999;
var maxPropSemEncFreg11 = 0;

function CorSemEncargosFreg(d) {
    return d == null ? '#808080' :
        d >= 92.64 ? '#8c0303' :
        d >= 81.59  ? '#de1f35' :
        d >= 63.18 ? '#ff5e6e' :
        d >= 44.77   ? '#f5b3be' :
        d >= 26.36   ? '#F2C572' :
                ''  ;
}
var legendaSemEncargosmFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 92.64' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 81.59 a 92.64' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 63.18 a 81.59' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 44.77 a 63.18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 26.36 a 44.77' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPropSemEncFreg11(feature) {
    if( feature.properties.Prop_Sem11 <= minPropSemEncFreg11){
        minPropSemEncFreg11 = feature.properties.Prop_Sem11
    }
    if(feature.properties.Prop_Sem11 >= maxPropSemEncFreg11 ){
        maxPropSemEncFreg11 = feature.properties.Prop_Sem11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorSemEncargosFreg(feature.properties.Prop_Sem11)
    };
}
function apagarPropSemEncFreg11(e) {
    PropSemEncFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePropSemEncFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' +  '<b>' + feature.properties.Freguesia + '</b>' +'<br>' +'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos sem encargos mensais: ' + '<b>' + feature.properties.Prop_Sem11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPropSemEncFreg11,
    });
}
var PropSemEncFreg11= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloPropSemEncFreg11,
    onEachFeature: onEachFeaturePropSemEncFreg11
});
let slidePropSemEncFreg11 = function(){
    var sliderPropSemEncFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPropSemEncFreg11, {
        start: [minPropSemEncFreg11, maxPropSemEncFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPropSemEncFreg11,
            'max': maxPropSemEncFreg11
        },
        });
    inputNumberMin.setAttribute("value",minPropSemEncFreg11);
    inputNumberMax.setAttribute("value",maxPropSemEncFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPropSemEncFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPropSemEncFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPropSemEncFreg11.noUiSlider.on('update',function(e){
        PropSemEncFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Sem11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Sem11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPropSemEncFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderPropSemEncFreg11.noUiSlider;
    $(slidersGeral).append(sliderPropSemEncFreg11);
} 

/////////////////////////////// Fim da PROPROÇÃO SEM ENCARGOS FREGUESIA Em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem COM ENCARGOS FREGUESIA Em 2011-----////

var minPropComEncFreg11 = 99999;
var maxPropComEncFreg11 = 0;

function CorComEncargosFreg(d) {
    return d == null ? '#808080' :
        d >= 66.28 ? '#8c0303' :
        d >= 55.23  ? '#de1f35' :
        d >= 36.82 ? '#ff5e6e' :
        d >= 18.41   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaComEncargosFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 66.28' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 55.23 a 66.28' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 36.82 a 55.23' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 18.41 a 36.82' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 1.35 a 18.41' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPropComEncFreg11(feature) {
    if( feature.properties.Prop_Com11 <= minPropComEncFreg11){
        minPropComEncFreg11 = feature.properties.Prop_Com11
    }
    if(feature.properties.Prop_Com11 >= maxPropComEncFreg11 ){
        maxPropComEncFreg11 = feature.properties.Prop_Com11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorComEncargosFreg(feature.properties.Prop_Com11)
    };
}
function apagarPropComEncFreg11(e) {
    PropComEncFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePropComEncFreg11(feature, layer) {
    layer.bindPopup( 'Freguesia: ' +  '<b>' + feature.properties.Freguesia + '</b>' +'<br>' +'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com encargos mensais: ' + '<b>' + feature.properties.Prop_Com11  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPropComEncFreg11,
    });
}
var PropComEncFreg11= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloPropComEncFreg11,
    onEachFeature: onEachFeaturePropComEncFreg11
});
let slidePropComEncFreg11 = function(){
    var sliderPropComEncFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPropComEncFreg11, {
        start: [minPropComEncFreg11, maxPropComEncFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPropComEncFreg11,
            'max': maxPropComEncFreg11
        },
        });
    inputNumberMin.setAttribute("value",minPropComEncFreg11);
    inputNumberMax.setAttribute("value",maxPropComEncFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPropComEncFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPropComEncFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPropComEncFreg11.noUiSlider.on('update',function(e){
        PropComEncFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Com11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Com11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPropComEncFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderPropComEncFreg11.noUiSlider;
    $(slidersGeral).append(sliderPropComEncFreg11);
} 

/////////////////////////////// Fim da PROPROÇÃO COM ENCARGOS FREGUESIA Em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA BAIXA FREGUESIA Em 2021-----////

var minRendaBaixaFreg21 = 99999;
var maxRendaBaixaFreg21 = 0;

function EstiloRendaBaixaFreg21(feature) {
    if( feature.properties.EncBaixo21 <= minRendaBaixaFreg21){
        minRendaBaixaFreg21 = feature.properties.EncBaixo21
    }
    if(feature.properties.EncBaixo21 >= maxRendaBaixaFreg21 ){
        maxRendaBaixaFreg21 = feature.properties.EncBaixo21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorRendaBaixaFreg(feature.properties.EncBaixo21)
    };
}
function apagarRendaBaixaFreg21(e) {
    RendaBaixaFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaBaixaFreg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' +  '<b>' + feature.properties.Freguesia + '</b>' +'<br>' +'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal baixo: ' + '<b>' + feature.properties.EncBaixo21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaBaixaFreg21,
    });
}
var RendaBaixaFreg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloRendaBaixaFreg21,
    onEachFeature: onEachFeatureRendaBaixaFreg21
});
let slideRendaBaixaFreg21 = function(){
    var sliderRendaBaixaFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaBaixaFreg21, {
        start: [minRendaBaixaFreg21, maxRendaBaixaFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaBaixaFreg21,
            'max': maxRendaBaixaFreg21
        },
        });
    inputNumberMin.setAttribute("value",minRendaBaixaFreg21);
    inputNumberMax.setAttribute("value",maxRendaBaixaFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaBaixaFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaBaixaFreg21.noUiSlider.set([null, this.value]);
    });

    sliderRendaBaixaFreg21.noUiSlider.on('update',function(e){
        RendaBaixaFreg21.eachLayer(function(layer){
            if(layer.feature.properties.EncBaixo21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncBaixo21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaBaixaFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderRendaBaixaFreg21.noUiSlider;
    $(slidersGeral).append(sliderRendaBaixaFreg21);
} 

/////////////////////////////// Fim da RENDA BAIXA FREGUESIA Em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA MÉDIA FREGUESIA Em 2021-----////

var minRendaMediaFreg21 = 99999;
var maxRendaMediaFreg21 = 0;

function EstiloRendaMediaFreg21(feature) {
    if( feature.properties.EncMedio21 <= minRendaMediaFreg21){
        minRendaMediaFreg21 = feature.properties.EncMedio21
    }
    if(feature.properties.EncMedio21 >= maxRendaMediaFreg21 ){
        maxRendaMediaFreg21 = feature.properties.EncMedio21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorRendaMediaFreg(feature.properties.EncMedio21)
    };
}
function apagarRendaMediaFreg21(e) {
    RendaMediaFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaMediaFreg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' +  '<b>' + feature.properties.Freguesia + '</b>' +'<br>' +'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal médio: ' + '<b>' + feature.properties.EncMedio21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaMediaFreg21,
    });
}
var RendaMediaFreg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloRendaMediaFreg21,
    onEachFeature: onEachFeatureRendaMediaFreg21
});
let slideRendaMediaFreg21 = function(){
    var sliderRendaMediaFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaMediaFreg21, {
        start: [minRendaMediaFreg21, maxRendaMediaFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaMediaFreg21,
            'max': maxRendaMediaFreg21
        },
        });
    inputNumberMin.setAttribute("value",minRendaMediaFreg21);
    inputNumberMax.setAttribute("value",maxRendaMediaFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaMediaFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaMediaFreg21.noUiSlider.set([null, this.value]);
    });

    sliderRendaMediaFreg21.noUiSlider.on('update',function(e){
        RendaMediaFreg21.eachLayer(function(layer){
            if(layer.feature.properties.EncMedio21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncMedio21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaMediaFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderRendaMediaFreg21.noUiSlider;
    $(slidersGeral).append(sliderRendaMediaFreg21);
} 

/////////////////////////////// Fim da RENDA MEDIA FREGUESIA Em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA ALTA FREGUESIA Em 2021-----////

var minRendaAltaFreg21 = 99999;
var maxRendaAltaFreg21 = 0;

function EstiloRendaAltaFreg21(feature) {
    if( feature.properties.EncAlto21 <= minRendaAltaFreg21){
        minRendaAltaFreg21 = feature.properties.EncAlto21
    }
    if(feature.properties.EncAlto21 >= maxRendaAltaFreg21 ){
        maxRendaAltaFreg21 = feature.properties.EncAlto21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorRendaAltaFreg(feature.properties.EncAlto21)
    };
}
function apagarRendaAltaFreg21(e) {
    RendaAltaFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaAltaFreg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' +  '<b>' + feature.properties.Freguesia + '</b>' +'<br>' +'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com valor de encargo mensal alto: ' + '<b>' + feature.properties.EncAlto21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaAltaFreg21,
    });
}
var RendaAltaFreg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloRendaAltaFreg21,
    onEachFeature: onEachFeatureRendaAltaFreg21
});
let slideRendaAltaFreg21 = function(){
    var sliderRendaAltaFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaAltaFreg21, {
        start: [minRendaAltaFreg21, maxRendaAltaFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaAltaFreg21,
            'max': maxRendaAltaFreg21
        },
        });
    inputNumberMin.setAttribute("value",minRendaAltaFreg21);
    inputNumberMax.setAttribute("value",maxRendaAltaFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaAltaFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaAltaFreg21.noUiSlider.set([null, this.value]);
    });

    sliderRendaAltaFreg21.noUiSlider.on('update',function(e){
        RendaAltaFreg21.eachLayer(function(layer){
            if(layer.feature.properties.EncAlto21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.EncAlto21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaAltaFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderRendaAltaFreg21.noUiSlider;
    $(slidersGeral).append(sliderRendaAltaFreg21);
} 

/////////////////////////////// Fim da RENDA ALTA FREGUESIA Em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem SEM ENCARGOS FREGUESIA Em 2021-----////

var minPropSemEncFreg21 = 99999;
var maxPropSemEncFreg21 = 0;

function EstiloPropSemEncFreg21(feature) {
    if( feature.properties.Prop_Sem21 <= minPropSemEncFreg21 || minPropSemEncFreg21 === 0){
        minPropSemEncFreg21 = feature.properties.Prop_Sem21
    }
    if(feature.properties.Prop_Sem21 >= maxPropSemEncFreg21 ){
        maxPropSemEncFreg21 = feature.properties.Prop_Sem21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorSemEncargosFreg(feature.properties.Prop_Sem21)
    };
}
function apagarPropSemEncFreg21(e) {
    PropSemEncFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePropSemEncFreg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' +  '<b>' + feature.properties.Freguesia + '</b>' +'<br>' +'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos sem encargos mensais: ' + '<b>' + feature.properties.Prop_Sem21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPropSemEncFreg21,
    });
}
var PropSemEncFreg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPropSemEncFreg21,
    onEachFeature: onEachFeaturePropSemEncFreg21
});
let slidePropSemEncFreg21 = function(){
    var sliderPropSemEncFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPropSemEncFreg21, {
        start: [minPropSemEncFreg21, maxPropSemEncFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPropSemEncFreg21,
            'max': maxPropSemEncFreg21
        },
        });
    inputNumberMin.setAttribute("value",minPropSemEncFreg21);
    inputNumberMax.setAttribute("value",maxPropSemEncFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPropSemEncFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPropSemEncFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPropSemEncFreg21.noUiSlider.on('update',function(e){
        PropSemEncFreg21.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Sem21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Sem21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPropSemEncFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderPropSemEncFreg21.noUiSlider;
    $(slidersGeral).append(sliderPropSemEncFreg21);
} 

/////////////////////////////// Fim da PROPROÇÃO SEM ENCARGOS FREGUESIA Em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem COM ENCARGOS FREGUESIA Em 2021-----////

var minPropComEncFreg21 = 99999;
var maxPropComEncFreg21 = 0;

function EstiloPropComEncFreg21(feature) {
    if( feature.properties.Prop_Com21 <= minPropComEncFreg21 || minPropComEncFreg21 === 0){
        minPropComEncFreg21 = feature.properties.Prop_Com21
    }
    if(feature.properties.Prop_Com21 >= maxPropComEncFreg21 ){
        maxPropComEncFreg21 = feature.properties.Prop_Com21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorComEncargosFreg(feature.properties.Prop_Com21)
        ////////////TENTAR ALTERAR O MINIMO DE 0 PARA O SEUGNDO MAIS BAIXO
    };
}
function apagarPropComEncFreg21(e) {
    PropComEncFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePropComEncFreg21(feature, layer) {
    layer.bindPopup( 'Freguesia: ' +  '<b>' + feature.properties.Freguesia + '</b>' +'<br>' +'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos com encargos mensais: ' + '<b>' + feature.properties.Prop_Com21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPropComEncFreg21,
    });
}
var PropComEncFreg21= L.geoJSON(dadosRelativosFreguesias21, {
    style:EstiloPropComEncFreg21,
    onEachFeature: onEachFeaturePropComEncFreg21
});
let slidePropComEncFreg21 = function(){
    var sliderPropComEncFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 66){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPropComEncFreg21, {
        start: [minPropComEncFreg21, maxPropComEncFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPropComEncFreg21,
            'max': maxPropComEncFreg21
        },
        });
    inputNumberMin.setAttribute("value",minPropComEncFreg21);
    inputNumberMax.setAttribute("value",maxPropComEncFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPropComEncFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPropComEncFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPropComEncFreg21.noUiSlider.on('update',function(e){
        PropComEncFreg21.eachLayer(function(layer){
            if(layer.feature.properties.Prop_Com21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop_Com21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPropComEncFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 66;
    sliderAtivo = sliderPropComEncFreg21.noUiSlider;
    $(slidersGeral).append(sliderPropComEncFreg21);
} 

/////////////////////////////// Fim da PROPROÇÃO COM ENCARGOS FREGUESIA em 2021 -------------- \\\\\\





/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotalAlojResiHabiConc11;
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
    if (layer == TotalAlojResiHabiConc11 && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes, em 2011, por concelho.' + '</strong>');
        legenda(maxTotalAlojResiHabiConc11, ((maxTotalAlojResiHabiConc11-minTotalAlojResiHabiConc11)/2).toFixed(0),minTotalAlojResiHabiConc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalAlojResiHabiConc11();
        naoDuplicar = 1;
    }
    if (layer == TotalAlojResiHabiConc11 && naoDuplicar == 1){
        contorno.addTo(map);
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes, em 2011, por concelho.' + '</strong>');
    }
    if (layer == SemEncargosConc11 && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes sem encargos mensais, em 2011, por concelho.' + '</strong>');
        legenda(maxSemEncargosConc11, ((maxSemEncargosConc11-minSemEncargosConc11)/2).toFixed(0),minSemEncargosConc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideSemEncargosConc11();
        naoDuplicar = 2;
    }
    if (layer == ComEncargosConc11 && naoDuplicar != 3){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com encargos mensais, em 2011, por concelho.' + '</strong>');
        legenda(maxComEncargosConc11, ((maxComEncargosConc11-minComEncargosConc11)/2).toFixed(0),minComEncargosConc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideComEncargosConc11();
        naoDuplicar = 3;
    }
    if (layer == Menos100Conc11 && naoDuplicar != 4){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal inferior a 100€, em 2011, por concelho.' + '</strong>');
        legendaExcecao(maxMenos100Conc11, ((maxMenos100Conc11-minMenos100Conc11)/2).toFixed(0),minMenos100Conc11,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideMenos100Conc11();
        naoDuplicar = 4;
    }
    if (layer == Enc100a200Conc11 && naoDuplicar != 5){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 100 e 199.99€, em 2011, por concelho.' + '</strong>');
        legenda(maxEnc100a200Conc11, ((maxEnc100a200Conc11-minEnc100a200Conc11)/2).toFixed(0),minEnc100a200Conc11,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEnc100a200Conc11();
        naoDuplicar = 5;
    }
    if (layer == Enc200a300Conc11 && naoDuplicar != 6){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 200 e 299.99€, em 2011, por concelho.' + '</strong>');
        legenda(maxEnc200a300Conc11, ((maxEnc200a300Conc11-minEnc200a300Conc11)/2).toFixed(0),minEnc200a300Conc11,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEnc200a300Conc11();
        naoDuplicar = 6;
    }
    if (layer == Enc300a400Conc11 && naoDuplicar != 7){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 300 e 399.99€, em 2011, por concelho.' + '</strong>');
        legenda(maxEnc300a400Conc11, ((maxEnc300a400Conc11-minEnc300a400Conc11)/2).toFixed(0),minEnc300a400Conc11,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEnc300a400Conc11();
        naoDuplicar = 7;
    }
    if (layer == Enc400a650Conc11 && naoDuplicar != 8){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 400 e 649.99€, em 2011, por concelho.' + '</strong>');
        legenda(maxEnc400a650Conc11, ((maxEnc400a650Conc11-minEnc400a650Conc11)/2).toFixed(0),minEnc400a650Conc11,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEnc400a650Conc11();
        naoDuplicar = 8;
    }
    if (layer == EncMais650Conc11 && naoDuplicar != 9){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal superior a 650€, em 2011, por concelho.' + '</strong>');
        legenda(maxEncMais650Conc11, ((maxEncMais650Conc11-minEncMais650Conc11)/2).toFixed(0),minEncMais650Conc11,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEncMais650Conc11();
        naoDuplicar = 9;
    }
    if (layer == TotalAlojResiHabiConc21 && naoDuplicar != 10){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes, em 2021, por concelho.' + '</strong>');
        legenda(maxTotalAlojResiHabiConc21, ((maxTotalAlojResiHabiConc21-minTotalAlojResiHabiConc21)/2).toFixed(0),minTotalAlojResiHabiConc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalAlojResiHabiConc21();
        naoDuplicar = 10;
    }
    if (layer == SemEncargosConc21 && naoDuplicar != 11){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes sem encargos mensais, em 2021, por concelho.' + '</strong>');
        legenda(maxSemEncargosConc21, ((maxSemEncargosConc21-minSemEncargosConc21)/2).toFixed(0),minSemEncargosConc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideSemEncargosConc21();
        naoDuplicar = 11;
    }
    if (layer == ComEncargosConc21 && naoDuplicar != 12){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com encargos mensais, em 2021, por concelho.' + '</strong>');
        legenda(maxComEncargosConc21, ((maxComEncargosConc21-minComEncargosConc21)/2).toFixed(0),minComEncargosConc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideComEncargosConc21();
        naoDuplicar = 12;
    }
    if (layer == Menos100Conc21 && naoDuplicar != 13){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal inferior a 100€, em 2021, por concelho.' + '</strong>');
        legendaExcecao(maxMenos100Conc21, ((maxMenos100Conc21-minMenos100Conc21)/2).toFixed(0),minMenos100Conc21,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideMenos100Conc21();
        naoDuplicar = 13;
    }
    if (layer == Enc100a200Conc21 && naoDuplicar != 14){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 100 e 199.99€, em 2021, por concelho.' + '</strong>');
        legenda(maxEnc100a200Conc21, ((maxEnc100a200Conc21-minEnc100a200Conc21)/2).toFixed(0),minEnc100a200Conc21,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEnc100a200Conc21();
        naoDuplicar = 14;
    }
    if (layer == Enc200a300Conc21 && naoDuplicar != 15){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 200 e 299.99€, em 2021, por concelho.' + '</strong>');
        legenda(maxEnc200a300Conc21, ((maxEnc200a300Conc21-minEnc200a300Conc21)/2).toFixed(0),minEnc200a300Conc21,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEnc200a300Conc21();
        naoDuplicar = 15;
    }
    if (layer == Enc300a400Conc21 && naoDuplicar != 16){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 300 e 399.99€, em 2021, por concelho.' + '</strong>');
        legenda(maxEnc300a400Conc21, ((maxEnc300a400Conc21-minEnc300a400Conc21)/2).toFixed(0),minEnc300a400Conc21,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEnc300a400Conc21();
        naoDuplicar = 16;
    }
    if (layer == Enc400a650Conc21 && naoDuplicar != 17){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 400 e 649.99€, em 2021, por concelho.' + '</strong>');
        legenda(maxEnc400a650Conc21, ((maxEnc400a650Conc21-minEnc400a650Conc21)/2).toFixed(0),minEnc400a650Conc21,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEnc400a650Conc21();
        naoDuplicar = 17;
    }
    if (layer == Enc650a999Conc21 && naoDuplicar != 18){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 650 e 999.99€, em 2021, por concelho.' + '</strong>');
        legenda(maxEnc650a999Conc21, ((maxEnc650a999Conc21-minEnc650a999Conc21)/2).toFixed(0),minEnc650a999Conc21,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEnc650a999Conc21();
        naoDuplicar = 18;
    }
    if (layer == EncMais1000Conc21 && naoDuplicar != 19){
        $('#tituloMapa').html(' <strong>' + 'Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal superior a 1000€, em 2021, por concelho.' + '</strong>');
        legendaExcecao(maxEncMais1000Conc21, ((maxEncMais1000Conc21-minEncMais1000Conc21)/2).toFixed(0),minEncMais1000Conc21,0.35);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEncMais1000Conc21();
        naoDuplicar = 19;
    }
    if (layer == RendaBaixaCon11 && naoDuplicar != 20){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal baixo, em 2011, por concelho.' + '</strong>');
        legendaEncargoBaixoConc();
        slideRendaBaixaCon11();
        naoDuplicar = 20;
    }
    if (layer == RendaMediaCon11 && naoDuplicar != 21){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal médio, em 2011, por concelho.' + '</strong>');
        legendaEncargoMedioConc();
        slideRendaMediaCon11();
        naoDuplicar = 21;
    }
    if (layer == RendaAltaCon11 && naoDuplicar != 22){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal alto, em 2011, por concelho.' + '</strong>');
        legendaEncargoAltoConc();
        slideRendaAltaCon11();
        naoDuplicar = 22;
    }
    if (layer == PropSemEncCon11 && naoDuplicar != 23){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos sem encargo mensal, em 2011, por concelho.' + '</strong>');
        legendaSemEncargosmConc();
        slidePropSemEncCon11();
        naoDuplicar = 23;
    }
    if (layer == PropComEncCon11 && naoDuplicar != 24){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com encargo mensal, em 2011, por concelho.' + '</strong>');
        legendaComEncargosmConc();
        slidePropComEncCon11();
        naoDuplicar = 24;
    }
    if (layer == RendaBaixaCon21 && naoDuplicar != 25){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal baixo, em 2021, por concelho.' + '</strong>');
        legendaEncargoBaixoConc();
        slideRendaBaixaCon21();
        naoDuplicar = 25;
    }
    if (layer == RendaMediaCon21 && naoDuplicar != 26){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal médio, em 2021, por concelho.' + '</strong>');
        legendaEncargoMedioConc();
        slideRendaMediaCon21();
        naoDuplicar = 26;
    }
    if (layer == RendaAltaCon21 && naoDuplicar != 27){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal alto, em 2021, por concelho.' + '</strong>');
        legendaEncargoAltoConc();
        slideRendaAltaCon21();
        naoDuplicar = 27;
    }
    if (layer == PropSemEncCon21 && naoDuplicar != 28){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos sem encargo mensal, em 2021, por concelho.' + '</strong>');
        legendaSemEncargosmConc();
        slidePropSemEncCon21();
        naoDuplicar = 28;
    }
    if (layer == PropComEncCon21 && naoDuplicar != 29){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com encargo mensal, em 2021, por concelho.' + '</strong>');
        legendaComEncargosmConc();
        slidePropComEncCon21();
        naoDuplicar = 29;
    }
    if (layer == VarSemEncConc && naoDuplicar != 30){
        legendaVarSemEncConc();
        slideVarSemEncConc();
        naoDuplicar = 30;
    }
    if (layer == VarComEncConc && naoDuplicar != 31){
        legendaVarComEncConc();
        slideVarComEncConc();
        naoDuplicar = 31;
    }
    if (layer == VarMenos100EncConc && naoDuplicar != 32){
        legendaVarMenos100Conc();
        slideVarMenos100EncConc();
        naoDuplicar = 32;
    }
    if (layer == Var100e200Conc && naoDuplicar != 33){
        legendaVar100e200Conc();
        slideVar100e200Conc();
        naoDuplicar = 33;
    }
    if (layer == Var200e300Conc && naoDuplicar != 34){
        legendaVar200e300Conc();
        slideVar200e300Conc();
        naoDuplicar = 34;
    }
    if (layer == Var300e400Conc && naoDuplicar != 35){
        legendaVar300e400Conc();
        slideVar300e400Conc();
        naoDuplicar = 35;
    }
    if (layer == Var400e650Conc && naoDuplicar != 36){
        legendaVar400e650Conc();
        slideVar400e650Conc();
        naoDuplicar = 36;
    }
    if (layer == VarMais650Conc && naoDuplicar != 37){
        legendaVarMais650Conc();
        slideVarMais650Conc();
        naoDuplicar = 37;
    }
    if (layer == TotalAlojResiHabiFreg11 && naoDuplicar != 38){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes, em 2011, por freguesia.' + '</strong>');
        legenda(maxTotalAlojResiHabiFreg11, ((maxTotalAlojResiHabiFreg11-minTotalAlojResiHabiFreg11)/2).toFixed(0),minTotalAlojResiHabiFreg11,0.2);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideTotalAlojResiHabiFreg11();
        naoDuplicar = 38;
    }
    if (layer == SemEncargosFreg11 && naoDuplicar != 39){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes sem encargos mensais, em 2011, por freguesia.' + '</strong>');
        legenda(maxSemEncargosFreg11, ((maxSemEncargosFreg11-minSemEncargosFreg11)/2).toFixed(0),minSemEncargosFreg11,0.2);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideSemEncargosFreg11();
        naoDuplicar = 39;
    }
    if (layer == ComEncargosFreg11 && naoDuplicar != 40){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com encargos mensais, em 2011, por freguesia.' + '</strong>');
        legenda(maxComEncargosFreg11, ((maxComEncargosFreg11-minComEncargosFreg11)/2).toFixed(0),minComEncargosFreg11,0.2);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideComEncargosFreg11();
        naoDuplicar = 40;
    }
    if (layer == Menos100Freg11 && naoDuplicar != 41){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal inferior a 100€, em 2011, por freguesia.' + '</strong>');
        legendaExcecao(maxMenos100Freg11, ((maxMenos100Freg11-minMenos100Freg11)/2).toFixed(0),minMenos100Freg11,0.8);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideMenos100Freg11();
        naoDuplicar = 41;
    }
    if (layer == Enc100a200Freg11 && naoDuplicar != 42){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 100 a 199.99€, em 2011, por freguesia.' + '</strong>');
        legenda(maxEnc100a200Freg11, ((maxEnc100a200Freg11-minEnc100a200Freg11)/2).toFixed(0),minEnc100a200Freg11,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEnc100a200Freg11();
        naoDuplicar = 42;
    }
    if (layer == Enc200a300Freg11 && naoDuplicar != 43){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 200 a 299.99€, em 2011, por freguesia.' + '</strong>');
        legenda(maxEnc200a300Freg11, ((maxEnc200a300Freg11-minEnc200a300Freg11)/2).toFixed(0),minEnc200a300Freg11,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEnc200a300Freg11();
        naoDuplicar = 43;
    }
    if (layer == Enc300a400Freg11 && naoDuplicar != 44){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 300 a 399.99€, em 2011, por freguesia.' + '</strong>');
        legenda(maxEnc300a400Freg11, ((maxEnc300a400Freg11-minEnc300a400Freg11)/2).toFixed(0),minEnc300a400Freg11,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEnc300a400Freg11();
        naoDuplicar = 44;
    }
    if (layer == Enc400a650Freg11 && naoDuplicar != 45){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 400 a 649.99€, em 2011, por freguesia.' + '</strong>');
        legenda(maxEnc400a650Freg11, ((maxEnc400a650Freg11-minEnc400a650Freg11)/2).toFixed(0),minEnc400a650Freg11,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEnc400a650Freg11();
        naoDuplicar = 45;
    }
    if (layer == EncMais650Freg11 && naoDuplicar != 46){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal superior a 650€, em 2011, por freguesia.' + '</strong>');
        legenda(maxEncMais650Freg11, ((maxEncMais650Freg11-minEncMais650Freg11)/2).toFixed(0),minEncMais650Freg11,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEncMais650Freg11();
        naoDuplicar = 56;
    }
    if (layer == TotalAlojResiHabiFreg21 && naoDuplicar != 47){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes, em 2021, por freguesia.' + '</strong>');
        legenda(maxTotalAlojResiHabiFreg21, ((maxTotalAlojResiHabiFreg21-minTotalAlojResiHabiFreg21)/2).toFixed(0),minTotalAlojResiHabiFreg21,0.2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalAlojResiHabiFreg21();
        naoDuplicar = 47;
    }
    if (layer == SemEncargosFreg21 && naoDuplicar != 48){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes sem encargos mensais, em 2021, por freguesia.' + '</strong>');
        legenda(maxSemEncargosFreg21, ((maxSemEncargosFreg21-minSemEncargosFreg21)/2).toFixed(0),minSemEncargosFreg21,0.2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideSemEncargosFreg21();
        naoDuplicar = 48;
    }
    if (layer == ComEncargosFreg21 && naoDuplicar != 49){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com encargos mensais, em 2021, por freguesia.' + '</strong>');
        legenda(maxComEncargosFreg21, ((maxComEncargosFreg21-minComEncargosFreg21)/2).toFixed(0),minComEncargosFreg21,0.2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideComEncargosFreg21();
        naoDuplicar = 49;
    }
    if (layer == Menos100Freg21 && naoDuplicar != 50){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal inferior a 100€, em 2021, por freguesia.' + '</strong>');
        legendaExcecao(maxMenos100Freg21, ((maxMenos100Freg21-minMenos100Freg21)/2).toFixed(0),minMenos100Freg21,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideMenos100Freg21();
        naoDuplicar = 50;
    }
    if (layer == Enc100a200Freg21 && naoDuplicar != 51){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 100 a 199.99€, em 2021, por freguesia.' + '</strong>');
        legenda(maxEnc100a200Freg21, ((maxEnc100a200Freg21-minEnc100a200Freg21)/2).toFixed(0),minEnc100a200Freg21,0.35);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEnc100a200Freg21();
        naoDuplicar = 51;
    }
    if (layer == Enc200a300Freg21 && naoDuplicar != 52){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 200 a 299.99€, em 2021, por freguesia.' + '</strong>');
        legenda(maxEnc200a300Freg21, ((maxEnc200a300Freg21-minEnc200a300Freg21)/2).toFixed(0),minEnc200a300Freg21,0.35);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEnc200a300Freg21();
        naoDuplicar = 52;
    }
    if (layer == Enc300a400Freg21 && naoDuplicar != 53){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 300 a 399.99€, em 2021, por freguesia.' + '</strong>');
        legenda(maxEnc300a400Freg21, ((maxEnc300a400Freg21-minEnc300a400Freg21)/2).toFixed(0),minEnc300a400Freg21,0.35);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEnc300a400Freg21();
        naoDuplicar = 53;
    }
    if (layer == Enc400a650Freg21 && naoDuplicar != 54){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 400 a 649.99€, em 2021, por freguesia.' + '</strong>');
        legenda(maxEnc400a650Freg21, ((maxEnc400a650Freg21-minEnc400a650Freg21)/2).toFixed(0),minEnc400a650Freg21,0.35);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEnc400a650Freg21();
        naoDuplicar = 54;
    }
    if (layer == Enc650a999Freg21 && naoDuplicar != 55){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal entre 650 a 999.99€, em 2021, por freguesia.' + '</strong>');
        legenda(maxEnc650a999Freg21, ((maxEnc650a999Freg21-minEnc650a999Freg21)/2).toFixed(0),minEnc650a999Freg21,0.6);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEnc650a999Freg21();
        naoDuplicar = 55;
    }
    if (layer == EncMais1000Freg21 && naoDuplicar != 56){
        $('#tituloMapa').html(' <strong>' + 'Total de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes com valor de encargo mensal superior a 1000€, em 2021, por freguesia.' + '</strong>');
        legendaExcecao(maxEncMais1000Freg21, ((maxEncMais1000Freg21-minEncMais1000Freg21)/2).toFixed(0),minEncMais1000Freg21,0.7);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEncMais1000Freg21();
        naoDuplicar = 56;
    }
    if (layer == RendaBaixaFreg11 && naoDuplicar != 57){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal baixo, em 2011, por freguesia.' + '</strong>');
        legendaRendaBaixaFreg();
        slideRendaBaixaFreg11();
        naoDuplicar = 57;
    }
    if (layer == RendaMediaFreg11 && naoDuplicar != 58){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal médio, em 2011, por freguesia.' + '</strong>');
        legendaRendaMediaFreg();
        slideRendaMediaFreg11();
        naoDuplicar = 58;
    }
    if (layer == RendaAltaFreg11 && naoDuplicar != 59){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal alto, em 2011, por freguesia.' + '</strong>');
        legendaRendaAltaFreg();
        slideRendaAltaFreg11();
        naoDuplicar = 59;
    }
    if (layer == PropSemEncFreg11 && naoDuplicar != 60){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos sem encargo mensal, em 2011, por freguesia.' + '</strong>');
        legendaSemEncargosmFreg();
        slidePropSemEncFreg11();
        naoDuplicar = 60;
    }
    if (layer == PropComEncFreg11 && naoDuplicar != 61){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com encargo mensal, em 2011, por freguesia.' + '</strong>');
        legendaSemEncargosmFreg();
        slidePropComEncFreg11();
        naoDuplicar = 61;
    }
    if (layer == RendaBaixaFreg21 && naoDuplicar != 62){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal baixo, em 2021, por freguesia.' + '</strong>');
        legendaRendaBaixaFreg();
        slideRendaBaixaFreg21();
        naoDuplicar = 62;
    }
    if (layer == RendaMediaFreg21 && naoDuplicar != 63){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal médio, em 2021, por freguesia.' + '</strong>');
        legendaRendaMediaFreg();
        slideRendaMediaFreg21();
        naoDuplicar = 63;
    }
    if (layer == RendaAltaFreg21 && naoDuplicar != 64){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com valor de encargo mensal alto, em 2021, por freguesia.' + '</strong>');
        legendaRendaAltaFreg();
        slideRendaAltaFreg21();
        naoDuplicar = 64;
    }
    if (layer == PropSemEncFreg21 && naoDuplicar != 65){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos sem encargo mensal, em 2021, por freguesia.' + '</strong>');
        legendaSemEncargosmFreg();
        slidePropSemEncFreg21();
        naoDuplicar = 65;
    }
    if (layer == PropComEncFreg21 && naoDuplicar != 66){
        $('#tituloMapa').html(' <strong>' + 'Proporção de alojamentos com encargo mensal, em 2021, por freguesia.' + '</strong>');
        legendaSemEncargosmFreg();
        slidePropComEncFreg21();
        naoDuplicar = 66;
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
    var escalao = document.getElementById("opcaoSelect").value;
    aparecerValoresEncargos();
    if($('#encargoMensal').length){
        var encargo = document.getElementById("valoresEncargos").value;
    }
    if ($('#concelho').hasClass('active2')){
        if ($('#absoluto').hasClass('active4')){
            condicionantes();
            if (ano == "2011"){
                if (escalao == "Total"){
                    novaLayer(TotalAlojResiHabiConc11);
                    $('#notaRodape').remove();
                } 
                if (escalao == "Sem"){
                    novaLayer(SemEncargosConc11)
                    $('#notaRodape').remove();
                }
                if (escalao == "Com"){
                    if (encargo == "Total"){
                        novaLayer(ComEncargosConc11)
                        $('#notaRodape').remove();
                    }
                    if (encargo == "100"){
                        novaLayer(Menos100Conc11);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "200"){
                        novaLayer(Enc100a200Conc11);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "300"){
                        novaLayer(Enc200a300Conc11);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "400"){
                        novaLayer(Enc300a400Conc11);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "649"){
                        novaLayer(Enc400a650Conc11);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "650"){
                        novaLayer(EncMais650Conc11);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                }
            }
            if (ano == "2021"){
                if (escalao == "Total"){
                    novaLayer(TotalAlojResiHabiConc21);
                    $('#notaRodape').remove();
                } 
                if (escalao == "Sem"){
                    novaLayer(SemEncargosConc21);
                    $('#notaRodape').remove();
                }
                if (escalao == "Com"){
                    if (encargo == "Total"){
                        novaLayer(ComEncargosConc21)
                        $('#notaRodape').remove();
                    };
                    if (encargo == "100"){
                        novaLayer(Menos100Conc21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "200"){
                        novaLayer(Enc100a200Conc21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "300"){
                        novaLayer(Enc200a300Conc21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "400"){
                        novaLayer(Enc300a400Conc21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "649"){
                        novaLayer(Enc400a650Conc21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "650"){
                        novaLayer(Enc650a999Conc21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "999"){
                        novaLayer(EncMais1000Conc21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos.</strong>')
                    }
                }
            }
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if (ano == "2011"){
                if (escalao == "Sem"){
                    novaLayer(VarSemEncConc)
                }
                if (escalao == "Com"){
                    if (encargo == "Total"){
                        novaLayer(VarComEncConc);
                    }
                    if (encargo == "100"){
                        novaLayer(VarMenos100EncConc);
                    }
                    if (encargo == "200"){
                        novaLayer(Var100e200Conc);
                    }
                    if (encargo == "300"){
                        novaLayer(Var200e300Conc);
                    }
                    if (encargo == "400"){
                        novaLayer(Var300e400Conc);
                    }
                    if (encargo == "649"){
                        novaLayer(Var400e650Conc);
                    }
                    if (encargo == "650"){
                        novaLayer(VarMais650Conc);
                    }
                }
            }
        }
        if ($('#percentagem').hasClass('active4')){
            if (ano == "2011"){
                if (escalao == "Sem"){
                    novaLayer(PropSemEncCon11);
                }
                if (escalao == "Com" && encargo == "Total"){
                    novaLayer(PropComEncCon11);
                }
                if (escalao == "Com" && encargo == "Baixa"){
                    novaLayer(RendaBaixaCon11);
                }
                if (escalao == "Com" && encargo == "Media"){
                    novaLayer(RendaMediaCon11);
                }
                if (escalao == "Com" && encargo == "Alta"){
                    novaLayer(RendaAltaCon11);
                }
            }
            if (ano == "2021"){
                if (escalao == "Sem"){
                    novaLayer(PropSemEncCon21);
                }
                if (escalao == "Com" && encargo == "Total"){
                    novaLayer(PropComEncCon21);
                }
                if (escalao == "Com" && encargo == "Baixa"){
                    novaLayer(RendaBaixaCon21);
                }
                if (escalao == "Com" && encargo == "Media"){
                    novaLayer(RendaMediaCon21);
                }
                if (escalao == "Com" && encargo == "Alta"){
                    novaLayer(RendaAltaCon21);
                }
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#absoluto').hasClass('active5')){
            condicionantes();
            if (ano == "2011"){
                if (escalao == "Total"){
                    novaLayer(TotalAlojResiHabiFreg11);
                    $('#notaRodape').remove();
                } 
                if (escalao == "Sem"){
                    novaLayer(SemEncargosFreg11)
                    $('#notaRodape').remove();
                }
                if (escalao == "Com"){
                    if (encargo == "Total"){
                        novaLayer(ComEncargosFreg11)
                        $('#notaRodape').remove();
                    }
                    if (encargo == "100"){
                        novaLayer(Menos100Freg11)
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e não com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "200"){
                        novaLayer(Enc100a200Freg11)
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos, à exceção dos valores: Menos de 100€.</strong>')
                    }
                    if (encargo == "300"){
                        novaLayer(Enc200a300Freg11)
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos, à exceção dos valores: Menos de 100€.</strong>')
                    }
                    if (encargo == "400"){
                        novaLayer(Enc300a400Freg11)
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos, à exceção dos valores: Menos de 100€.</strong>')
                    }
                    if (encargo == "649"){
                        novaLayer(Enc400a650Freg11)
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos, à exceção dos valores: Menos de 100€.</strong>')
                    }
                    if (encargo == "650"){
                        novaLayer(EncMais650Freg11)
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos, à exceção dos valores: Menos de 100€.</strong>')
                    }
                }
            }
            if (ano == "2021"){
                if (escalao == "Total"){
                    novaLayer(TotalAlojResiHabiFreg21);
                    $('#notaRodape').remove();
                } 
                if (escalao == "Sem"){
                    novaLayer(SemEncargosFreg21);
                    $('#notaRodape').remove();
                }
                if (escalao == "Com"){
                    if (encargo == "Total"){
                        novaLayer(ComEncargosFreg21)
                        $('#notaRodape').remove();
                    };
                    if (encargo == "100"){
                        novaLayer(Menos100Freg21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e não com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "200"){
                        novaLayer(Enc100a200Freg21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos, à exceção dos valores: Menos de 100€, Entre 650 e 999.99€ e Mais de 1000€.</strong>')
                    }
                    if (encargo == "300"){
                        novaLayer(Enc200a300Freg21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos, à exceção dos valores: Menos de 100€, Entre 650 e 999.99€ e Mais de 1000€.</strong>')
                    }
                    if (encargo == "400"){
                        novaLayer(Enc300a400Freg21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos, à exceção dos valores: Menos de 100€, Entre 650 e 999.99€ e Mais de 1000€.</strong>')
                    }
                    if (encargo == "649"){
                        novaLayer(Enc400a650Freg21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e com os restantes valores de encargos, à exceção dos valores: Menos de 100€, Entre 650 e 999.99€ e Mais de 1000€.</strong>')
                    }
                    if (encargo == "650"){
                        novaLayer(Enc650a999Freg21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e não com os restantes valores de encargos.</strong>')
                    }
                    if (encargo == "999"){
                        novaLayer(EncMais1000Freg21);
                        notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong> devendo, apenas, comparar no intervalo de tempo e não com os restantes valores de encargos.</strong>')
                    }
                }
            }
        }
        if ($('#percentagem').hasClass('active5')){
            if (ano == "2011"){
                if (escalao == "Sem"){
                    novaLayer(PropSemEncFreg11);
                }
                if (escalao == "Com" && encargo == "Total"){
                    novaLayer(PropComEncFreg11);
                }
                if (escalao == "Com" && encargo == "Baixa"){
                    novaLayer(RendaBaixaFreg11);
                }
                if (escalao == "Com" && encargo == "Media"){
                    novaLayer(RendaMediaFreg11);
                }
                if (escalao == "Com" && encargo == "Alta"){
                    novaLayer(RendaAltaFreg11);
                }
            }
            if (ano == "2021"){
                if (escalao == "Sem"){
                    novaLayer(PropSemEncFreg21);
                }
                if (escalao == "Com" && encargo == "Total"){
                    novaLayer(PropComEncFreg21);
                }
                if (escalao == "Com" && encargo == "Baixa"){
                    novaLayer(RendaBaixaFreg21);
                }
                if (escalao == "Com" && encargo == "Media"){
                    novaLayer(RendaMediaFreg21);
                }
                if (escalao == "Com" && encargo == "Alta"){
                    novaLayer(RendaAltaFreg21);
                }
            }
        }
    }
}


let primeirovalor = function(ano,opcao){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(opcao);

}
function primeiroValorEncargos(ano,opcao,encargo){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(opcao);
    $("#encargoMensal").val(encargo);
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let reporAnos = function(){
    $('#mySelect').empty();
    if ($('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5') || $('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        $('#mySelect').append("<option value='2011'>2011</option>");
        $('#mySelect').append("<option value='2021'>2021</option>");
    }
    if ($('#taxaVariacao').hasClass('active4')){
        $('#mySelect').append("<option value='2011'>2021 - 2011</option>");
    }
}
let reporOpcoesIniciais = function(){
    $('#opcaoSelect').empty();
    if ($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5') || $('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        $('#opcaoSelect').append("<option value='Sem'>Sem encargos</option>");
        $('#opcaoSelect').append("<option value='Com'>Com encargos</option>");
        primeirovalor('2011','Sem');
    }
    if ($('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5')){
        $('#opcaoSelect').append("<option value='Total'>Total</option>");
        $('#opcaoSelect').append("<option value='Sem'>Sem encargos</option>");
        $('#opcaoSelect').append("<option value='Com'>Com encargos</option>");
        primeirovalor('2011','Total');
    }
}

let aparecerValoresEncargos = function(){
    var escalao = document.getElementById("opcaoSelect").value;
    var ano = document.getElementById("mySelect").value;
    if (escalao == "Sem" || escalao == "Total"){
        if($('#encargoMensal').length){
            $("#encargoMensal" ).remove();
        }
    }
    if ($('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        if (escalao == "Com" && $('#encargoMensal').length == 0){
            $('#variavel').after('<div id="encargoMensal" class ="titulo">Valor do encargo mensal:</div>');~
            $('#encargoMensal').append('<select id= "valoresEncargos"></select>');
            $('#valoresEncargos')
                .append('<option value="Total">Total</option>')
                .append('<option value="Baixa">Encargo baixo</option>')
                .append('<option value="Media">Encargo médio</option>')
                .append('<option value="Alta">Encargo alto</option>')
            var encargo = document.getElementById("valoresEncargos").value;  
            if (encargo == "Total"){
                if (ano == "2011"){
                    primeiroValorEncargos('2011','Com','Total')
                } 
                if (ano == "2021"){
                    primeiroValorEncargos('2021','Com','Total')
                }
            }
            $('#valoresEncargos').change(function(){
                tamanhoOutros();
            })
        }
    }
    if ($('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5') || $('#taxaVariacao').hasClass('active4')){
        if (escalao == "Com" && $('#encargoMensal').length == 0){
            $('#variavel').after('<div id="encargoMensal" class ="titulo">Valor do encargo mensal:</div>');~
            $('#encargoMensal').append('<select id= "valoresEncargos"></select>');
            $('#valoresEncargos')
                .append('<option value="Total">Total</option>')
                .append('<option value="100">Menos de 100€</option>')
                .append('<option value="200">Entre 100 e 199.99€</option>')
                .append('<option value="300">Entre 200 e 299.99€</option>')
                .append('<option value="400">Entre 300 e 399.99€</option>')
                .append('<option value="649">Entre 400 e 649.99€</option>')
                .append('<option value="650">Mais de 650€</option>');
                var encargo = document.getElementById("valoresEncargos").value;  
                if (encargo == "Total"){
                    if (ano == "2011"){
                        primeiroValorEncargos('2011','Com','Total')
                    } 
                    if (ano == "2021"){
                        primeiroValorEncargos('2021','Com','Total')
                    }
                }
                $('#valoresEncargos').change(function(){
                    tamanhoOutros();
           })
                    
        }
    }

    $('#encargoMensal').css("visibility","visible");
    $('#valoresEncargos').css("visibility","visible"); 
}

function condicionantes(){
    if($('#encargoMensal').length){
        var escalao = document.getElementById("valoresEncargos").value;
    }
    var ano = document.getElementById("mySelect").value;
    if (ano == "2021"){
        if ($("#valoresEncargos option[value='650']").length > 0){
            $("#valoresEncargos option[value='650']").html("Entre 650 e 999.99€");  
        }
        if ($("#valoresEncargos option[value='999']").length == 0){
            $('#valoresEncargos').append('<option value="999">Mais de 1000€</option>');   
        }
        if (escalao == "999" || escalao == "650"){
            $("#mySelect option[value='2011']").remove();
        }
        if (escalao != "650" && escalao != "999"){
            if ($("#mySelect option[value='2011']").length == 0){
                $("#mySelect option").eq(0).before($("<option></option>").val("2011").text("2011"));
            }
        }
    }
    if (ano == "2011"){
        if ($("#valoresEncargos option[value='999']").length > 0){
            $("#valoresEncargos option[value='999']").remove();
        }
        if ($("#valoresEncargos option[value='650']").length > 0){
            $("#valoresEncargos option[value='650']").html("Mais de 650€");  
        }
        if (escalao == "650"){
            $("#mySelect option[value='2021']").remove();
        }
        if (escalao != "650"){
            if ($("#mySelect option[value='2021']").length == 0){
                $('#mySelect').append('<option value="2021">2021</option>');   
            }
        }
    }
 }
let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Estatísticas de Rendas da Habitação ao nível local.' );
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Recenseamento da população e habitação.' );
    }
}
function mudarEscala(){
    reporAnos();
    reporOpcoesIniciais();
    tamanhoOutros();
    fonteTitulo('N');
}
$('#absoluto').click(function(){
    mudarEscala(); 

});
$('#percentagem').click(function(){
    $('#notaRodape').remove();
    mudarEscala();
    fonteTitulo('F');

});
$('#taxaVariacao').click(function(){
    $('#notaRodape').remove();
    mudarEscala();
    fonteTitulo('F');
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
function localizacaoVariacao(){
    $('#absoluto').attr('class',"butao active4");
    $("#taxaVariacao" ).show();
    $('#percentagem').attr('class',"butao");
    $('#taxaVariacao').attr('class',"butao");
    $('#absoluto').css('left',"0px");
    $('#percentagem').css('left',"0px");
    $('#taxaVariacao').css('left',"0px");
}
let variaveisMapaConcelho = function(){
    if ($('#absoluto').hasClass('active4')){
        return false
    }
    else{
        localizacaoVariacao();
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
        $("#taxaVariacao" ).hide();
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
    localizacaoVariacao();
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
    $('#tituloMapa').html('Número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes, segundo o escalão de encargos mensais, entre 2011 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EncargosCompraProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2011').html("2011")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Encargos == "Mais de 1000€"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Encargos+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2021.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Encargos+'</td>';
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
    $('#tituloMapa').html('Proporção do número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes, segundo o escalão de encargos mensais, entre 2011 e 2021, %.')
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EncargosCompraProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2011').html("2011")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Encargos == "Mais de 1000€"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Encargos+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                    dados += '<td class="borderbottom">'+value.Per21+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Encargos+'</td>';
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
    $('#tituloMapa').html('Variação do número de alojamentos familiares clássicos de residência habitual propriedade dos ocupantes, segundo o escalão de encargos mensais, entre 2011 e 2021, %.')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EncargosCompraProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2011').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Encargos == "Mais de 1000€"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Encargos+'</td>';
                    dados += '<td class="borderbottom">'+ ''+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Encargos+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.VAR2111+'</td>';
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
        if (ano == "2021"){
            i = 1
        }
        if (ano == "2011"){
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
    if ($('#freguesias').hasClass("active2") ||$('#concelho').hasClass("active2")){
        if(i === $('#mySelect').children('option').length - 1){
            return false
        }
    }
})
$("#encargoMensal").click(function(e){ 
    e.preventDefault(); 
     });
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
