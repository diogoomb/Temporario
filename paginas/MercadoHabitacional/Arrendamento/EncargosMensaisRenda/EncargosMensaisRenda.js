
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('#tituloMapa').css('font-size','9pt')
$('#temporal').css("padding-top","0px");
$('#painelLegenda').css("height","auto");
$('.ine').css('display',"inline-flex");
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
    var titulo = 'Número de alojamentos arrendados'
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

////////////////////////////////////----------- TOTAL EM 2001, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalArrendadosConc01 = 0;
var maxTotalArrendadosConc01 = 0;
function estiloTotalArrendadosConc01(feature, latlng) {
    if(feature.properties.Arr_Tot_01< minTotalArrendadosConc01 || minTotalArrendadosConc01 ===0){
        minTotalArrendadosConc01 = feature.properties.Arr_Tot_01
    }
    if(feature.properties.Arr_Tot_01> maxTotalArrendadosConc01){
        maxTotalArrendadosConc01 = feature.properties.Arr_Tot_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Arr_Tot_01,0.2)
    });
}
function apagarTotalArrendadosConc01(e){
    var layer = e.target;
    TotalArrendadosConc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalArrendadosConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados de residência habitual: ' + '<b>' +feature.properties.Arr_Tot_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalArrendadosConc01,
    })
};

var TotalArrendadosConc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalArrendadosConc01,
    onEachFeature: onEachFeatureTotalArrendadosConc01,
});

var legenda = function(maximo,medio,minimo, multiplicador) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'center'
    var symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Número de alojamentos arrendados'
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




var slideTotalArrendadosConc01 = function(){
    var sliderTotalArrendadosConc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalArrendadosConc01, {
        start: [minTotalArrendadosConc01, maxTotalArrendadosConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalArrendadosConc01,
            'max': maxTotalArrendadosConc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalArrendadosConc01);
    inputNumberMax.setAttribute("value",maxTotalArrendadosConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalArrendadosConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalArrendadosConc01.noUiSlider.set([null, this.value]);
    });

    sliderTotalArrendadosConc01.noUiSlider.on('update',function(e){
        TotalArrendadosConc01.eachLayer(function(layer){
            if(layer.feature.properties.Arr_Tot_01>=parseFloat(e[0])&& layer.feature.properties.Arr_Tot_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalArrendadosConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotalArrendadosConc01.noUiSlider;
    $(slidersGeral).append(sliderTotalArrendadosConc01);
}
contorno.addTo(map)
TotalArrendadosConc01.addTo(map);
$('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual, em 2001, por concelho.' + '</strong>');
legenda(maxTotalArrendadosConc01, ((maxTotalArrendadosConc01-minTotalArrendadosConc01)/2).toFixed(0),minTotalArrendadosConc01,0.2);
slideTotalArrendadosConc01();

///////////////////////////-------------------- FIM TOTAL arrendados 2001, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MENOS DE 100€, EM 2001, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minMenos100Conc01 = 0;
var maxMenos100Conc01 = 0;
function estiloMenos100Conc01(feature, latlng) {
    if(feature.properties.F0a99E_01< minMenos100Conc01 || minMenos100Conc01 ===0){
        minMenos100Conc01 = feature.properties.F0a99E_01
    }
    if(feature.properties.F0a99E_01> maxMenos100Conc01){
        maxMenos100Conc01 = feature.properties.F0a99E_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0a99E_01,0.2)
    });
}
function apagarMenos100Conc01(e){
    var layer = e.target;
    Menos100Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMenos100Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda inferior a 100€: ' + '<b>' +feature.properties.F0a99E_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMenos100Conc01,
    })
};

var Menos100Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloMenos100Conc01,
    onEachFeature: onEachFeatureMenos100Conc01,
});

var slideMenos100Conc01 = function(){
    var sliderMenos100Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMenos100Conc01, {
        start: [minMenos100Conc01, maxMenos100Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minMenos100Conc01,
            'max': maxMenos100Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMenos100Conc01);
    inputNumberMax.setAttribute("value",maxMenos100Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderMenos100Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMenos100Conc01.noUiSlider.set([null, this.value]);
    });

    sliderMenos100Conc01.noUiSlider.on('update',function(e){
        Menos100Conc01.eachLayer(function(layer){
            if(layer.feature.properties.F0a99E_01>=parseFloat(e[0])&& layer.feature.properties.F0a99E_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMenos100Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderMenos100Conc01.noUiSlider;
    $(slidersGeral).append(sliderMenos100Conc01);
}
///////////////////////////-------------------- FIM MENOS 100€ EM 2001, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- 100 A 199.99€ , EM 2001, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEntre100e199Conc01 = 0;
var maxEntre100e199Conc01 = 0;
function estiloEntre100e199Conc01(feature, latlng) {
    if(feature.properties.F100a199_01< minEntre100e199Conc01 || minEntre100e199Conc01 ===0){
        minEntre100e199Conc01 = feature.properties.F100a199_01
    }
    if(feature.properties.F100a199_01> maxEntre100e199Conc01){
        maxEntre100e199Conc01 = feature.properties.F100a199_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F100a199_01,0.2)
    });
}
function apagarEntre100e199Conc01(e){
    var layer = e.target;
    Entre100e199Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre100e199Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda entre 100 e 199.99€: ' + '<b>' +feature.properties.F100a199_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre100e199Conc01,
    })
};

var Entre100e199Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEntre100e199Conc01,
    onEachFeature: onEachFeatureEntre100e199Conc01,
});

var slideEntre100e199Conc01 = function(){
    var sliderEntre100e199Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre100e199Conc01, {
        start: [minEntre100e199Conc01, maxEntre100e199Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre100e199Conc01,
            'max': maxEntre100e199Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre100e199Conc01);
    inputNumberMax.setAttribute("value",maxEntre100e199Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre100e199Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre100e199Conc01.noUiSlider.set([null, this.value]);
    });

    sliderEntre100e199Conc01.noUiSlider.on('update',function(e){
        Entre100e199Conc01.eachLayer(function(layer){
            if(layer.feature.properties.F100a199_01>=parseFloat(e[0])&& layer.feature.properties.F100a199_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre100e199Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderEntre100e199Conc01.noUiSlider;
    $(slidersGeral).append(sliderEntre100e199Conc01);
}
///////////////////////////-------------------- FIM ENTRE 100 E 199€, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 200 E 399€, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEntre200e399Conc01 = 0;
var maxEntre200e399Conc01 = 0;
function estiloEntre200e399Conc01(feature, latlng) {
    if(feature.properties.F200a399_01< minEntre200e399Conc01 || minEntre200e399Conc01 ===0){
        minEntre200e399Conc01 = feature.properties.F200a399_01
    }
    if(feature.properties.F200a399_01> maxEntre200e399Conc01){
        maxEntre200e399Conc01 = feature.properties.F200a399_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F200a399_01,0.2)
    });
}
function apagarEntre200e399Conc01(e){
    var layer = e.target;
    Entre200e399Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre200e399Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda entre 200 e 399.99€: ' + '<b>' +feature.properties.F200a399_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre200e399Conc01,
    })
};

var Entre200e399Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEntre200e399Conc01,
    onEachFeature: onEachFeatureEntre200e399Conc01,
});

var slideEntre200e399Conc01 = function(){
    var sliderEntre200e399Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre200e399Conc01, {
        start: [minEntre200e399Conc01, maxEntre200e399Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre200e399Conc01,
            'max': maxEntre200e399Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre200e399Conc01);
    inputNumberMax.setAttribute("value",maxEntre200e399Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre200e399Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre200e399Conc01.noUiSlider.set([null, this.value]);
    });

    sliderEntre200e399Conc01.noUiSlider.on('update',function(e){
        Entre200e399Conc01.eachLayer(function(layer){
            if(layer.feature.properties.F200a399_01>=parseFloat(e[0])&& layer.feature.properties.F200a399_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre200e399Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderEntre200e399Conc01.noUiSlider;
    $(slidersGeral).append(sliderEntre200e399Conc01);
}
///////////////////////////-------------------- FIM 200 a 399, em 2001, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MAIS 400€ EM 2001, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minMais400Conc01 = 0;
var maxMais400Conc01 = 0;
function estiloMais400Conc01(feature, latlng) {
    if(feature.properties.F400Mais_01< minMais400Conc01 || minMais400Conc01 ===0){
        minMais400Conc01 = feature.properties.F400Mais_01
    }
    if(feature.properties.F400Mais_01> maxMais400Conc01){
        maxMais400Conc01 = feature.properties.F400Mais_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F400Mais_01,0.2)
    });
}
function apagarMais400Conc01(e){
    var layer = e.target;
    Mais400Conc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMais400Conc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda superior a 400€: ' + '<b>' +feature.properties.F400Mais_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMais400Conc01,
    })
};

var Mais400Conc01= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloMais400Conc01,
    onEachFeature: onEachFeatureMais400Conc01,
});

var slideMais400Conc01 = function(){
    var sliderMais400Conc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMais400Conc01, {
        start: [minMais400Conc01, maxMais400Conc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minMais400Conc01,
            'max': maxMais400Conc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMais400Conc01);
    inputNumberMax.setAttribute("value",maxMais400Conc01);

    inputNumberMin.addEventListener('change', function(){
        sliderMais400Conc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMais400Conc01.noUiSlider.set([null, this.value]);
    });

    sliderMais400Conc01.noUiSlider.on('update',function(e){
        Mais400Conc01.eachLayer(function(layer){
            if(layer.feature.properties.F400Mais_01>=parseFloat(e[0])&& layer.feature.properties.F400Mais_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMais400Conc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderMais400Conc01.noUiSlider;
    $(slidersGeral).append(sliderMais400Conc01);
}
///////////////////////////-------------------- FIM MAIS 400€, EM 2001, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////-----------TOTAL ALOJAMENTOS arrendados EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalArrendadosConc11 = 0;
var maxTotalArrendadosConc11 = 0;
function estiloTotalArrendadosConc11(feature, latlng) {
    if(feature.properties.Arr_Tot_11< minTotalArrendadosConc11 || minTotalArrendadosConc11 ===0){
        minTotalArrendadosConc11 = feature.properties.Arr_Tot_11
    }
    if(feature.properties.Arr_Tot_11> maxTotalArrendadosConc11){
        maxTotalArrendadosConc11 = feature.properties.Arr_Tot_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Arr_Tot_11,0.2)
    });
}
function apagarTotalArrendadosConc11(e){
    var layer = e.target;
    TotalArrendadosConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalArrendadosConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Total de alojamentos arrendados de residência habitual: ' + '<b>' +feature.properties.Arr_Tot_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalArrendadosConc11,
    })
};

var TotalArrendadosConc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalArrendadosConc11,
    onEachFeature: onEachFeatureTotalArrendadosConc11,
});

var slideTotalArrendadosConc11 = function(){
    var sliderTotalArrendadosConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalArrendadosConc11, {
        start: [minTotalArrendadosConc11, maxTotalArrendadosConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalArrendadosConc11,
            'max': maxTotalArrendadosConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalArrendadosConc11);
    inputNumberMax.setAttribute("value",maxTotalArrendadosConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalArrendadosConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalArrendadosConc11.noUiSlider.set([null, this.value]);
    });

    sliderTotalArrendadosConc11.noUiSlider.on('update',function(e){
        TotalArrendadosConc11.eachLayer(function(layer){
            if(layer.feature.properties.Arr_Tot_11>=parseFloat(e[0])&& layer.feature.properties.Arr_Tot_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalArrendadosConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderTotalArrendadosConc11.noUiSlider;
    $(slidersGeral).append(sliderTotalArrendadosConc11);
}
///////////////////////////-------------------- FIM TOTAL ARRENDAMENTO 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MENOS DE 100€ EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minMenos100Conc11 = 0;
var maxMenos100Conc11 = 0;
function estiloMenos100Conc11(feature, latlng) {
    if(feature.properties.F0a99E_11< minMenos100Conc11 || minMenos100Conc11 ===0){
        minMenos100Conc11 = feature.properties.F0a99E_11
    }
    if(feature.properties.F0a99E_11> maxMenos100Conc11){
        maxMenos100Conc11 = feature.properties.F0a99E_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0a99E_11,0.2)
    });
}
function apagarMenos100Conc11(e){
    var layer = e.target;
    Menos100Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMenos100Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda inferior a 100€: ' + '<b>' +feature.properties.F0a99E_11 + '</b>').openPopup()
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

    
    if (ifSlide2isActive != 7){
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
            if(layer.feature.properties.F0a99E_11>=parseFloat(e[0])&& layer.feature.properties.F0a99E_11 <= parseFloat(e[1])){
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
    ifSlide2isActive = 7;
    sliderAtivo = sliderMenos100Conc11.noUiSlider;
    $(slidersGeral).append(sliderMenos100Conc11);
}
///////////////////////////-------------------- FIM MENOS DE 100€ EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 100 E 199€ EM 2011, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEntre100e199Conc11 = 0;
var maxEntre100e199Conc11 = 0;
function estiloEntre100e199Conc11(feature, latlng) {
    if(feature.properties.F100a199_11< minEntre100e199Conc11 || minEntre100e199Conc11 ===0){
        minEntre100e199Conc11 = feature.properties.F100a199_11
    }
    if(feature.properties.F100a199_11> maxEntre100e199Conc11){
        maxEntre100e199Conc11 = feature.properties.F100a199_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F100a199_11,0.2)
    });
}
function apagarEntre100e199Conc11(e){
    var layer = e.target;
    Entre100e199Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre100e199Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda entre 100 e 199.99€: ' + '<b>' +feature.properties.F100a199_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre100e199Conc11,
    })
};

var Entre100e199Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEntre100e199Conc11,
    onEachFeature: onEachFeatureEntre100e199Conc11,
});

var slideEntre100e199Conc11 = function(){
    var sliderEntre100e199Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre100e199Conc11, {
        start: [minEntre100e199Conc11, maxEntre100e199Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre100e199Conc11,
            'max': maxEntre100e199Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre100e199Conc11);
    inputNumberMax.setAttribute("value",maxEntre100e199Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre100e199Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre100e199Conc11.noUiSlider.set([null, this.value]);
    });

    sliderEntre100e199Conc11.noUiSlider.on('update',function(e){
        Entre100e199Conc11.eachLayer(function(layer){
            if(layer.feature.properties.F100a199_11>=parseFloat(e[0])&& layer.feature.properties.F100a199_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre100e199Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderEntre100e199Conc11.noUiSlider;
    $(slidersGeral).append(sliderEntre100e199Conc11);
}
///////////////////////////-------------------- FIM ENTRE 100 E 199€, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 200 E 399€, EM 2011 POR CONCELHO ------------------------------\\\\\\\\\\\\\
var minEntre200e399Conc11 = 0;
var maxEntre200e399Conc11 = 0;
function estiloEntre200e399Conc11(feature, latlng) {
    if(feature.properties.F200a399_11< minEntre200e399Conc11 || minEntre200e399Conc11 ===0){
        minEntre200e399Conc11 = feature.properties.F200a399_11
    }
    if(feature.properties.F200a399_11> maxEntre200e399Conc11){
        maxEntre200e399Conc11 = feature.properties.F200a399_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F200a399_11,0.2)
    });
}
function apagarEntre200e399Conc11(e){
    var layer = e.target;
    Entre200e399Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre200e399Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda entre 200 e 399.99€: ' + '<b>' +feature.properties.F200a399_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre200e399Conc11,
    })
};

var Entre200e399Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEntre200e399Conc11,
    onEachFeature: onEachFeatureEntre200e399Conc11,
});

var slideEntre200e399Conc11 = function(){
    var sliderEntre200e399Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre200e399Conc11, {
        start: [minEntre200e399Conc11, maxEntre200e399Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre200e399Conc11,
            'max': maxEntre200e399Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre200e399Conc11);
    inputNumberMax.setAttribute("value",maxEntre200e399Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre200e399Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre200e399Conc11.noUiSlider.set([null, this.value]);
    });

    sliderEntre200e399Conc11.noUiSlider.on('update',function(e){
        Entre200e399Conc11.eachLayer(function(layer){
            if(layer.feature.properties.F200a399_11>=parseFloat(e[0])&& layer.feature.properties.F200a399_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre200e399Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderEntre200e399Conc11.noUiSlider;
    $(slidersGeral).append(sliderEntre200e399Conc11);
}
///////////////////////////-------------------- FIM  ENTRE 200 E 399€ EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE ENTRE 400 E 649.99€, EM 2011 POR CONCELHO ------------------------------\\\\\\\\\\\\\
var minEntre400e649Conc11 = 0;
var maxEntre400e649Conc11 = 0;
function estiloEntre400e649Conc11(feature, latlng) {
    if(feature.properties.F400a649_11< minEntre400e649Conc11 || minEntre400e649Conc11 ===0){
        minEntre400e649Conc11 = feature.properties.F400a649_11
    }
    if(feature.properties.F400a649_11> maxEntre400e649Conc11){
        maxEntre400e649Conc11 = feature.properties.F400a649_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F400a649_11,0.2)
    });
}
function apagarEntre400e649Conc11(e){
    var layer = e.target;
    Entre400e649Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre400e649Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda entre 400 e 649.99€: ' + '<b>' +feature.properties.F400a649_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre400e649Conc11,
    })
};

var Entre400e649Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEntre400e649Conc11,
    onEachFeature: onEachFeatureEntre400e649Conc11,
});

var slideEntre400e649Conc11 = function(){
    var sliderEntre400e649Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre400e649Conc11, {
        start: [minEntre400e649Conc11, maxEntre400e649Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre400e649Conc11,
            'max': maxEntre400e649Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre400e649Conc11);
    inputNumberMax.setAttribute("value",maxEntre400e649Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre400e649Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre400e649Conc11.noUiSlider.set([null, this.value]);
    });

    sliderEntre400e649Conc11.noUiSlider.on('update',function(e){
        Entre400e649Conc11.eachLayer(function(layer){
            if(layer.feature.properties.F400a649_11>=parseFloat(e[0])&& layer.feature.properties.F400a649_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre400e649Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderEntre400e649Conc11.noUiSlider;
    $(slidersGeral).append(sliderEntre400e649Conc11);
}
///////////////////////////-------------------- FIM  ENTRE 400 E 649.99 EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MAIS 650€, EM 2011 POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minMais650Conc11 = 0;
var maxMais650Conc11 = 0;
function estiloMais650Conc11(feature, latlng) {
    if(feature.properties.F650Mais_11< minMais650Conc11 || minMais650Conc11 ===0){
        minMais650Conc11 = feature.properties.F650Mais_11
    }
    if(feature.properties.F650Mais_11> maxMais650Conc11){
        maxMais650Conc11 = feature.properties.F650Mais_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F650Mais_11,0.2)
    });
}
function apagarMais650Conc11(e){
    var layer = e.target;
    Mais650Conc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMais650Conc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda superior a 650€: ' + '<b>' +feature.properties.F650Mais_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMais650Conc11,
    })
};

var Mais650Conc11= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloMais650Conc11,
    onEachFeature: onEachFeatureMais650Conc11,
});

var slideMais650Conc11 = function(){
    var sliderMais650Conc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMais650Conc11, {
        start: [minMais650Conc11, maxMais650Conc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minMais650Conc11,
            'max': maxMais650Conc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMais650Conc11);
    inputNumberMax.setAttribute("value",maxMais650Conc11);

    inputNumberMin.addEventListener('change', function(){
        sliderMais650Conc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMais650Conc11.noUiSlider.set([null, this.value]);
    });

    sliderMais650Conc11.noUiSlider.on('update',function(e){
        Mais650Conc11.eachLayer(function(layer){
            if(layer.feature.properties.F650Mais_11>=parseFloat(e[0])&& layer.feature.properties.F650Mais_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMais650Conc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderMais650Conc11.noUiSlider;
    $(slidersGeral).append(sliderMais650Conc11);
}
///////////////////////////-------------------- FIM  MAIS 650€ EM 2011, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////-----------TOTAL ALOJAMENTOS arrendados EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalArrendadosConc21 = 0;
var maxTotalArrendadosConc21 = 0;
function estiloTotalArrendadosConc21(feature, latlng) {
    if(feature.properties.Arr_Tot_21< minTotalArrendadosConc21 || minTotalArrendadosConc21 ===0){
        minTotalArrendadosConc21 = feature.properties.Arr_Tot_21
    }
    if(feature.properties.Arr_Tot_21> maxTotalArrendadosConc21){
        maxTotalArrendadosConc21 = feature.properties.Arr_Tot_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Arr_Tot_21,0.2)
    });
}
function apagarTotalArrendadosConc21(e){
    var layer = e.target;
    TotalArrendadosConc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalArrendadosConc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Total de alojamentos arrendados de residência habitual: ' + '<b>' +feature.properties.Arr_Tot_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalArrendadosConc21,
    })
};

var TotalArrendadosConc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalArrendadosConc21,
    onEachFeature: onEachFeatureTotalArrendadosConc21,
});

var slideTotalArrendadosConc21 = function(){
    var sliderTotalArrendadosConc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalArrendadosConc21, {
        start: [minTotalArrendadosConc21, maxTotalArrendadosConc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalArrendadosConc21,
            'max': maxTotalArrendadosConc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalArrendadosConc21);
    inputNumberMax.setAttribute("value",maxTotalArrendadosConc21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalArrendadosConc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalArrendadosConc21.noUiSlider.set([null, this.value]);
    });

    sliderTotalArrendadosConc21.noUiSlider.on('update',function(e){
        TotalArrendadosConc21.eachLayer(function(layer){
            if(layer.feature.properties.Arr_Tot_21>=parseFloat(e[0])&& layer.feature.properties.Arr_Tot_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalArrendadosConc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderTotalArrendadosConc21.noUiSlider;
    $(slidersGeral).append(sliderTotalArrendadosConc21);
}
///////////////////////////-------------------- FIM TOTAL ARRENDAMENTO 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MENOS DE 100€ EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minMenos100Conc21 = 0;
var maxMenos100Conc21 = 0;
function estiloMenos100Conc21(feature, latlng) {
    if(feature.properties.F0a99E_21< minMenos100Conc21 || minMenos100Conc21 ===0){
        minMenos100Conc21 = feature.properties.F0a99E_21
    }
    if(feature.properties.F0a99E_21> maxMenos100Conc21){
        maxMenos100Conc21 = feature.properties.F0a99E_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0a99E_21,0.2)
    });
}
function apagarMenos100Conc21(e){
    var layer = e.target;
    Menos100Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMenos100Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda inferior a 100€: ' + '<b>' +feature.properties.F0a99E_21 + '</b>').openPopup()
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
            if(layer.feature.properties.F0a99E_21>=parseFloat(e[0])&& layer.feature.properties.F0a99E_21 <= parseFloat(e[1])){
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
///////////////////////////-------------------- FIM MENOS DE 100€ EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 100 E 199€ EM 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEntre100e199Conc21 = 0;
var maxEntre100e199Conc21 = 0;
function estiloEntre100e199Conc21(feature, latlng) {
    if(feature.properties.F100a199_21< minEntre100e199Conc21 || minEntre100e199Conc21 ===0){
        minEntre100e199Conc21 = feature.properties.F100a199_21
    }
    if(feature.properties.F100a199_21> maxEntre100e199Conc21){
        maxEntre100e199Conc21 = feature.properties.F100a199_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F100a199_21,0.2)
    });
}
function apagarEntre100e199Conc21(e){
    var layer = e.target;
    Entre100e199Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre100e199Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda entre 100 e 199.99€: ' + '<b>' +feature.properties.F100a199_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre100e199Conc21,
    })
};

var Entre100e199Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEntre100e199Conc21,
    onEachFeature: onEachFeatureEntre100e199Conc21,
});

var slideEntre100e199Conc21 = function(){
    var sliderEntre100e199Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre100e199Conc21, {
        start: [minEntre100e199Conc21, maxEntre100e199Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre100e199Conc21,
            'max': maxEntre100e199Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre100e199Conc21);
    inputNumberMax.setAttribute("value",maxEntre100e199Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre100e199Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre100e199Conc21.noUiSlider.set([null, this.value]);
    });

    sliderEntre100e199Conc21.noUiSlider.on('update',function(e){
        Entre100e199Conc21.eachLayer(function(layer){
            if(layer.feature.properties.F100a199_21>=parseFloat(e[0])&& layer.feature.properties.F100a199_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre100e199Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderEntre100e199Conc21.noUiSlider;
    $(slidersGeral).append(sliderEntre100e199Conc21);
}
///////////////////////////-------------------- FIM ENTRE 100 E 199€, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE 200 E 399€, EM 2021 POR CONCELHO ------------------------------\\\\\\\\\\\\\
var minEntre200e399Conc21 = 0;
var maxEntre200e399Conc21 = 0;
function estiloEntre200e399Conc21(feature, latlng) {
    if(feature.properties.F200a399_21< minEntre200e399Conc21 || minEntre200e399Conc21 ===0){
        minEntre200e399Conc21 = feature.properties.F200a399_21
    }
    if(feature.properties.F200a399_21> maxEntre200e399Conc21){
        maxEntre200e399Conc21 = feature.properties.F200a399_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F200a399_21,0.2)
    });
}
function apagarEntre200e399Conc21(e){
    var layer = e.target;
    Entre200e399Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre200e399Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda entre 200 e 399.99€: ' + '<b>' +feature.properties.F200a399_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre200e399Conc21,
    })
};

var Entre200e399Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEntre200e399Conc21,
    onEachFeature: onEachFeatureEntre200e399Conc21,
});

var slideEntre200e399Conc21 = function(){
    var sliderEntre200e399Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre200e399Conc21, {
        start: [minEntre200e399Conc21, maxEntre200e399Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre200e399Conc21,
            'max': maxEntre200e399Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre200e399Conc21);
    inputNumberMax.setAttribute("value",maxEntre200e399Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre200e399Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre200e399Conc21.noUiSlider.set([null, this.value]);
    });

    sliderEntre200e399Conc21.noUiSlider.on('update',function(e){
        Entre200e399Conc21.eachLayer(function(layer){
            if(layer.feature.properties.F200a399_21>=parseFloat(e[0])&& layer.feature.properties.F200a399_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre200e399Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderEntre200e399Conc21.noUiSlider;
    $(slidersGeral).append(sliderEntre200e399Conc21);
}
///////////////////////////-------------------- FIM  ENTRE 200 E 399€ EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- ENTRE ENTRE 400 E 649.99€, EM 2021 POR CONCELHO ------------------------------\\\\\\\\\\\\\
var minEntre400e649Conc21 = 0;
var maxEntre400e649Conc21 = 0;
function estiloEntre400e649Conc21(feature, latlng) {
    if(feature.properties.F400a649_21< minEntre400e649Conc21 || minEntre400e649Conc21 ===0){
        minEntre400e649Conc21 = feature.properties.F400a649_21
    }
    if(feature.properties.F400a649_21> maxEntre400e649Conc21){
        maxEntre400e649Conc21 = feature.properties.F400a649_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F400a649_21,0.2)
    });
}
function apagarEntre400e649Conc21(e){
    var layer = e.target;
    Entre400e649Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre400e649Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda entre 400 e 649.99€: ' + '<b>' +feature.properties.F400a649_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre400e649Conc21,
    })
};

var Entre400e649Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEntre400e649Conc21,
    onEachFeature: onEachFeatureEntre400e649Conc21,
});

var slideEntre400e649Conc21 = function(){
    var sliderEntre400e649Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre400e649Conc21, {
        start: [minEntre400e649Conc21, maxEntre400e649Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre400e649Conc21,
            'max': maxEntre400e649Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre400e649Conc21);
    inputNumberMax.setAttribute("value",maxEntre400e649Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre400e649Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre400e649Conc21.noUiSlider.set([null, this.value]);
    });

    sliderEntre400e649Conc21.noUiSlider.on('update',function(e){
        Entre400e649Conc21.eachLayer(function(layer){
            if(layer.feature.properties.F400a649_21>=parseFloat(e[0])&& layer.feature.properties.F400a649_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre400e649Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderEntre400e649Conc21.noUiSlider;
    $(slidersGeral).append(sliderEntre400e649Conc21);
}
///////////////////////////-------------------- FIM  ENTRE 400 E 649.99 EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- 650 - 999.99€, EM 2021 POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEntre650e999Conc21 = 0;
var maxEntre650e999Conc21 = 0;
function estiloEntre650e999Conc21(feature, latlng) {
    if(feature.properties.F650Mais_21< minEntre650e999Conc21 || minEntre650e999Conc21 ===0){
        minEntre650e999Conc21 = feature.properties.F650Mais_21
    }
    if(feature.properties.F650Mais_21> maxEntre650e999Conc21){
        maxEntre650e999Conc21 = feature.properties.F650Mais_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F650Mais_21,0.2)
    });
}
function apagarEntre650e999Conc21(e){
    var layer = e.target;
    Entre650e999Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre650e999Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda entre 650 e 999.99€: ' + '<b>' +feature.properties.F650Mais_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre650e999Conc21,
    })
};

var Entre650e999Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEntre650e999Conc21,
    onEachFeature: onEachFeatureEntre650e999Conc21,
});

var slideEntre650e999Conc21 = function(){
    var sliderEntre650e999Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre650e999Conc21, {
        start: [minEntre650e999Conc21, maxEntre650e999Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre650e999Conc21,
            'max': maxEntre650e999Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre650e999Conc21);
    inputNumberMax.setAttribute("value",maxEntre650e999Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre650e999Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre650e999Conc21.noUiSlider.set([null, this.value]);
    });

    sliderEntre650e999Conc21.noUiSlider.on('update',function(e){
        Entre650e999Conc21.eachLayer(function(layer){
            if(layer.feature.properties.F650Mais_21>=parseFloat(e[0])&& layer.feature.properties.F650Mais_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre650e999Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderEntre650e999Conc21.noUiSlider;
    $(slidersGeral).append(sliderEntre650e999Conc21);
}
///////////////////////////-------------------- FIM  ENTRE 650 E 999 EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- MAIS 1000€, EM 2021 POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minMais1000Conc21 = 0;
var maxMais1000Conc21 = 0;
function estiloMais1000Conc21(feature, latlng) {
    if(feature.properties.F1000M_21< minMais1000Conc21 || minMais1000Conc21 ===0){
        minMais1000Conc21 = feature.properties.F1000M_21
    }
    if(feature.properties.F1000M_21> maxMais1000Conc21){
        maxMais1000Conc21 = feature.properties.F1000M_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F1000M_21,0.2)
    });
}
function apagarMais1000Conc21(e){
    var layer = e.target;
    Mais1000Conc21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMais1000Conc21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos arrendados com valor de renda superior a 1000€: ' + '<b>' +feature.properties.F1000M_21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMais1000Conc21,
    })
};

var Mais1000Conc21= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloMais1000Conc21,
    onEachFeature: onEachFeatureMais1000Conc21,
});

var slideMais1000Conc21 = function(){
    var sliderMais1000Conc21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMais1000Conc21, {
        start: [minMais1000Conc21, maxMais1000Conc21],
        tooltips:true,
        connect: true,
        range: {
            'min': minMais1000Conc21,
            'max': maxMais1000Conc21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMais1000Conc21);
    inputNumberMax.setAttribute("value",maxMais1000Conc21);

    inputNumberMin.addEventListener('change', function(){
        sliderMais1000Conc21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMais1000Conc21.noUiSlider.set([null, this.value]);
    });

    sliderMais1000Conc21.noUiSlider.on('update',function(e){
        Mais1000Conc21.eachLayer(function(layer){
            if(layer.feature.properties.F1000M_21>=parseFloat(e[0])&& layer.feature.properties.F1000M_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMais1000Conc21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderMais1000Conc21.noUiSlider;
    $(slidersGeral).append(sliderMais1000Conc21);
}
///////////////////////////-------------------- FIM  MAIS 1000 EM 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////////////////////////////////////////////////----------------------------------
////////////////////////////////////----------- DADOS TOTAL 2001, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minTotalArrendadosFreg01 = 999;
var maxTotalArrendadosFreg01 = 0;
function estiloTotalArrendadosFreg01(feature, latlng) {
    
    if( feature.properties.Arr_Tot_01 <= minTotalArrendadosFreg01 && feature.properties.Arr_Tot_01 > null || minTotalArrendadosFreg01 === 0){
        minTotalArrendadosFreg01 = feature.properties.Arr_Tot_01
    }
    if(feature.properties.Arr_Tot_01> maxTotalArrendadosFreg01){
        maxTotalArrendadosFreg01 = feature.properties.Arr_Tot_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Arr_Tot_01,0.25)
    });
}
function apagarTotalArrendadosFreg01(e){
    var layer = e.target;
    TotalArrendadosFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalArrendadosFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados de residência habitual: ' + '<b>' + feature.properties.Arr_Tot_01 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalArrendadosFreg01,
    })
};

var TotalArrendadosFreg01= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloTotalArrendadosFreg01,
    onEachFeature: onEachFeatureTotalArrendadosFreg01,
});

var slideTotalArrendadosFreg01 = function(){
    var sliderTotalArrendadosFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalArrendadosFreg01, {
        start: [minTotalArrendadosFreg01, maxTotalArrendadosFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalArrendadosFreg01,
            'max': maxTotalArrendadosFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalArrendadosFreg01);
    inputNumberMax.setAttribute("value",maxTotalArrendadosFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalArrendadosFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalArrendadosFreg01.noUiSlider.set([null, this.value]);
    });

    sliderTotalArrendadosFreg01.noUiSlider.on('update',function(e){
        TotalArrendadosFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Arr_Tot_01>=parseFloat(e[0])&& layer.feature.properties.Arr_Tot_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalArrendadosFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderTotalArrendadosFreg01.noUiSlider;
    $(slidersGeral).append(sliderTotalArrendadosFreg01);
}
///////////////////////////-------------------- FIM TOTAL 2001, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS MENOS DE 100€ 2001, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minMenos100Freg01 = 999;
var maxMenos100Freg01 = 0;
function estiloMenos100Freg01(feature, latlng) {
    
    if( feature.properties.F0a99E_01 <= minMenos100Freg01 && feature.properties.F0a99E_01 > null || feature.properties.F0a99E_01 === 0){
        minMenos100Freg01 = feature.properties.F0a99E_01
    }
    if(feature.properties.F0a99E_01> maxMenos100Freg01){
        maxMenos100Freg01 = feature.properties.F0a99E_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0a99E_01,0.35)
    });
}
function apagarMenos100Freg01(e){
    var layer = e.target;
    Menos100Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMenos100Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda inferior a 100€: ' + '<b>' + feature.properties.F0a99E_01 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMenos100Freg01,
    })
};

var Menos100Freg01= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloMenos100Freg01,
    onEachFeature: onEachFeatureMenos100Freg01,
});

var slideMenos100Freg01 = function(){
    var sliderMenos100Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMenos100Freg01, {
        start: [minMenos100Freg01, maxMenos100Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minMenos100Freg01,
            'max': maxMenos100Freg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMenos100Freg01);
    inputNumberMax.setAttribute("value",maxMenos100Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderMenos100Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMenos100Freg01.noUiSlider.set([null, this.value]);
    });

    sliderMenos100Freg01.noUiSlider.on('update',function(e){
        Menos100Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F0a99E_01>=parseFloat(e[0])&& layer.feature.properties.F0a99E_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMenos100Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderMenos100Freg01.noUiSlider;
    $(slidersGeral).append(sliderMenos100Freg01);
}
///////////////////////////-------------------- FIM MENOS 100€ EM 2001, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS ENTRE 100 E 200€ 2001, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minEntre100e199Freg01 = 999;
var maxEntre100e199Freg01 = 0;
function estiloEntre100e199Freg01(feature, latlng) {
    
    if( feature.properties.F100a199_01 <= minEntre100e199Freg01 && feature.properties.F100a199_01 > null || feature.properties.F100a199_01 === 0){
        minEntre100e199Freg01 = feature.properties.F100a199_01
    }
    if(feature.properties.F100a199_01> maxEntre100e199Freg01){
        maxEntre100e199Freg01 = feature.properties.F100a199_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F100a199_01,0.35)
    });
}
function apagarEntre100e199Freg01(e){
    var layer = e.target;
    Entre100e199Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre100e199Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda entre 100 e 199.99€: ' + '<b>' + feature.properties.F100a199_01 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre100e199Freg01,
    })
};

var Entre100e199Freg01= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloEntre100e199Freg01,
    onEachFeature: onEachFeatureEntre100e199Freg01,
});

var slideEntre100e199Freg01 = function(){
    var sliderEntre100e199Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre100e199Freg01, {
        start: [minEntre100e199Freg01, maxEntre100e199Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre100e199Freg01,
            'max': maxEntre100e199Freg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre100e199Freg01);
    inputNumberMax.setAttribute("value",maxEntre100e199Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre100e199Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre100e199Freg01.noUiSlider.set([null, this.value]);
    });

    sliderEntre100e199Freg01.noUiSlider.on('update',function(e){
        Entre100e199Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F100a199_01>=parseFloat(e[0])&& layer.feature.properties.F100a199_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre100e199Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderEntre100e199Freg01.noUiSlider;
    $(slidersGeral).append(sliderEntre100e199Freg01);
}
///////////////////////////-------------------- FIM ENTRE 100 E 200 EM 2001, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS ENTRE 200 E 399€ 2001, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minEntre200e399Freg01 = 999;
var maxEntre200e399Freg01 = 0;
function estiloEntre200e399Freg01(feature, latlng) {
    
    if(feature.properties.F200a399_01 <= minEntre200e399Freg01 && feature.properties.F200a399_01 > null || feature.properties.F200a399_01 === 0){
        minEntre200e399Freg01 = feature.properties.F200a399_01
    }
    if(feature.properties.F200a399_01> maxEntre200e399Freg01){
        maxEntre200e399Freg01 = feature.properties.F200a399_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F200a399_01,0.35)
    });
}
function apagarEntre200e399Freg01(e){
    var layer = e.target;
    Entre200e399Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre200e399Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda entre 200 e 399.99€: ' + '<b>' + feature.properties.F200a399_01 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre200e399Freg01,
    })
};

var Entre200e399Freg01= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloEntre200e399Freg01,
    onEachFeature: onEachFeatureEntre200e399Freg01,
});

var slideEntre200e399Freg01 = function(){
    var sliderEntre200e399Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre200e399Freg01, {
        start: [minEntre200e399Freg01, maxEntre200e399Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre200e399Freg01,
            'max': maxEntre200e399Freg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre200e399Freg01);
    inputNumberMax.setAttribute("value",maxEntre200e399Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre200e399Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre200e399Freg01.noUiSlider.set([null, this.value]);
    });

    sliderEntre200e399Freg01.noUiSlider.on('update',function(e){
        Entre200e399Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F200a399_01>=parseFloat(e[0])&& layer.feature.properties.F200a399_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre200e399Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderEntre200e399Freg01.noUiSlider;
    $(slidersGeral).append(sliderEntre200e399Freg01);
}
///////////////////////////-------------------- FIM ENTRE 200  E 399 EM 2001, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS MAIS 400€ 2001, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minMais400Freg01 = 999;
var maxMais400Freg01 = 0;
function estiloMais400Freg01(feature, latlng) {
    
    if( feature.properties.F400Mais_01 <= minMais400Freg01 && feature.properties.F400Mais_01 > null || feature.properties.F400Mais_01 === 0){
        minMais400Freg01 = feature.properties.F400Mais_01
    }
    if(feature.properties.F400Mais_01> maxMais400Freg01){
        maxMais400Freg01 = feature.properties.F400Mais_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F400Mais_01,0.8)
    });
}
function apagarMais400Freg01(e){
    var layer = e.target;
    Mais400Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMais400Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda superior a 400€: ' + '<b>' + feature.properties.F400Mais_01 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMais400Freg01,
    })
};

var Mais400Freg01= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloMais400Freg01,
    onEachFeature: onEachFeatureMais400Freg01,
});

var slideMais400Freg01 = function(){
    var sliderMais400Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMais400Freg01, {
        start: [minMais400Freg01, maxMais400Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minMais400Freg01,
            'max': maxMais400Freg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMais400Freg01);
    inputNumberMax.setAttribute("value",maxMais400Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderMais400Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMais400Freg01.noUiSlider.set([null, this.value]);
    });

    sliderMais400Freg01.noUiSlider.on('update',function(e){
        Mais400Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F400Mais_01>=parseFloat(e[0])&& layer.feature.properties.F400Mais_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMais400Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderMais400Freg01.noUiSlider;
    $(slidersGeral).append(sliderMais400Freg01);
}
///////////////////////////-------------------- FIM MAIS 400€ EM 2001, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS TOTAL  2011, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minTotalArrendadosFreg11 = 999;
var maxTotalArrendadosFreg11 = 0;
function estiloTotalArrendadosFreg11(feature, latlng) {
    
    if(feature.properties.Arr_Tot_11 <= minTotalArrendadosFreg11 && feature.properties.Arr_Tot_11 > null || feature.properties.Arr_Tot_11 === 0){
        minTotalArrendadosFreg11 = feature.properties.Arr_Tot_11
    }
    if(feature.properties.Arr_Tot_11> maxTotalArrendadosFreg11){
        maxTotalArrendadosFreg11 = feature.properties.Arr_Tot_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Arr_Tot_11,0.25)
    });
}
function apagarTotalArrendadosFreg11(e){
    var layer = e.target;
    TotalArrendadosFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalArrendadosFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados de residência habitual: ' + '<b>' + feature.properties.Arr_Tot_11 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalArrendadosFreg11,
    })
};

var TotalArrendadosFreg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloTotalArrendadosFreg11,
    onEachFeature: onEachFeatureTotalArrendadosFreg11,
});

var slideTotalArrendadosFreg11 = function(){
    var sliderTotalArrendadosFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalArrendadosFreg11, {
        start: [minTotalArrendadosFreg11, maxTotalArrendadosFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalArrendadosFreg11,
            'max': maxTotalArrendadosFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalArrendadosFreg11);
    inputNumberMax.setAttribute("value",maxTotalArrendadosFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalArrendadosFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalArrendadosFreg11.noUiSlider.set([null, this.value]);
    });

    sliderTotalArrendadosFreg11.noUiSlider.on('update',function(e){
        TotalArrendadosFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Arr_Tot_11>=parseFloat(e[0])&& layer.feature.properties.Arr_Tot_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalArrendadosFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderTotalArrendadosFreg11.noUiSlider;
    $(slidersGeral).append(sliderTotalArrendadosFreg11);
}
///////////////////////////-------------------- FIM TOTAL EM 2011, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS MENOS 100€  2011, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minMenos100Freg11 = 999;
var maxMenos100Freg11 = 0;
function estiloMenos100Freg11(feature, latlng) {
    
    if(feature.properties.F0a99E_11 <= minMenos100Freg11 && feature.properties.F0a99E_11 > null || feature.properties.F0a99E_11 === 0){
        minMenos100Freg11 = feature.properties.F0a99E_11
    }
    if(feature.properties.F0a99E_11> maxMenos100Freg11){
        maxMenos100Freg11 = feature.properties.F0a99E_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0a99E_11,0.35)
    });
}
function apagarMenos100Freg11(e){
    var layer = e.target;
    Menos100Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMenos100Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda inferior a 100€: ' + '<b>' + feature.properties.F0a99E_11 + '</b>').openPopup()   
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

    
    if (ifSlide2isActive != 25){
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
            if(layer.feature.properties.F0a99E_11>=parseFloat(e[0])&& layer.feature.properties.F0a99E_11 <= parseFloat(e[1])){
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
    ifSlide2isActive = 25;
    sliderAtivo = sliderMenos100Freg11.noUiSlider;
    $(slidersGeral).append(sliderMenos100Freg11);
}
///////////////////////////-------------------- FIM MENOS 100€ EM 2011, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS ENTRE 100€ E 200€  2011, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minEntre100e199Freg11 = 999;
var maxEntre100e199Freg11 = 0;
function estiloEntre100e199Freg11(feature, latlng) {
    
    if(feature.properties.F100a199_11 <= minEntre100e199Freg11 && feature.properties.F100a199_11 > null || feature.properties.F100a199_11 === 0){
        minEntre100e199Freg11 = feature.properties.F100a199_11
    }
    if(feature.properties.F100a199_11> maxEntre100e199Freg11){
        maxEntre100e199Freg11 = feature.properties.F100a199_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F100a199_11,0.35)
    });
}
function apagarEntre100e199Freg11(e){
    var layer = e.target;
    Entre100e199Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre100e199Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda entre 100 e 199.99€: ' + '<b>' + feature.properties.F100a199_11 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre100e199Freg11,
    })
};

var Entre100e199Freg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloEntre100e199Freg11,
    onEachFeature: onEachFeatureEntre100e199Freg11,
});

var slideEntre100e199Freg11 = function(){
    var sliderEntre100e199Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre100e199Freg11, {
        start: [minEntre100e199Freg11, maxEntre100e199Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre100e199Freg11,
            'max': maxEntre100e199Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre100e199Freg11);
    inputNumberMax.setAttribute("value",maxEntre100e199Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre100e199Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre100e199Freg11.noUiSlider.set([null, this.value]);
    });

    sliderEntre100e199Freg11.noUiSlider.on('update',function(e){
        Entre100e199Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F100a199_11>=parseFloat(e[0])&& layer.feature.properties.F100a199_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre100e199Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderEntre100e199Freg11.noUiSlider;
    $(slidersGeral).append(sliderEntre100e199Freg11);
}
///////////////////////////-------------------- FIM ENTRE 100 E 200€ EM 2011, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS ENTRE 200 E 399€  2011, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minEntre200e399Freg11 = 999;
var maxEntre200e399Freg11 = 0;
function estiloEntre200e399Freg11(feature, latlng) {
    
    if(feature.properties.F200a399_11 <= minEntre200e399Freg11 && feature.properties.F200a399_11 > null || feature.properties.F200a399_11 === 0){
        minEntre200e399Freg11 = feature.properties.F200a399_11
    }
    if(feature.properties.F200a399_11> maxEntre200e399Freg11){
        maxEntre200e399Freg11 = feature.properties.F200a399_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F200a399_11,0.35)
    });
}
function apagarEntre200e399Freg11(e){
    var layer = e.target;
    Entre200e399Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre200e399Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda entre 200 e 399.99€: ' + '<b>' + feature.properties.F200a399_11 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre200e399Freg11,
    })
};

var Entre200e399Freg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloEntre200e399Freg11,
    onEachFeature: onEachFeatureEntre200e399Freg11,
});

var slideEntre200e399Freg11 = function(){
    var sliderEntre200e399Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre200e399Freg11, {
        start: [minEntre200e399Freg11, maxEntre200e399Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre200e399Freg11,
            'max': maxEntre200e399Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre200e399Freg11);
    inputNumberMax.setAttribute("value",maxEntre200e399Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre200e399Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre200e399Freg11.noUiSlider.set([null, this.value]);
    });

    sliderEntre200e399Freg11.noUiSlider.on('update',function(e){
        Entre200e399Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F200a399_11>=parseFloat(e[0])&& layer.feature.properties.F200a399_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre200e399Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderEntre200e399Freg11.noUiSlider;
    $(slidersGeral).append(sliderEntre200e399Freg11);
}
///////////////////////////-------------------- FIM ENTRE 200 E 399€ EM 2011, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS ENTRE 400 E 649€  2011, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minEntre400e649Freg11 = 999;
var maxEntre400e649Freg11 = 0;
function estiloEntre400e649Freg11(feature, latlng) {
    
    if(feature.properties.F400a649_11 <= minEntre400e649Freg11 && feature.properties.F400a649_11 > null || feature.properties.F400a649_11 === 0){
        minEntre400e649Freg11 = feature.properties.F400a649_11
    }
    if(feature.properties.F400a649_11> maxEntre400e649Freg11){
        maxEntre400e649Freg11 = feature.properties.F400a649_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F400a649_11,0.35)
    });
}
function apagarEntre400e649Freg11(e){
    var layer = e.target;
    Entre400e649Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre400e649Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda entre 400 e 649.99€: ' + '<b>' + feature.properties.F400a649_11 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre400e649Freg11,
    })
};

var Entre400e649Freg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloEntre400e649Freg11,
    onEachFeature: onEachFeatureEntre400e649Freg11,
});

var slideEntre400e649Freg11 = function(){
    var sliderEntre400e649Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre400e649Freg11, {
        start: [minEntre400e649Freg11, maxEntre400e649Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre400e649Freg11,
            'max': maxEntre400e649Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre400e649Freg11);
    inputNumberMax.setAttribute("value",maxEntre400e649Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre400e649Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre400e649Freg11.noUiSlider.set([null, this.value]);
    });

    sliderEntre400e649Freg11.noUiSlider.on('update',function(e){
        Entre400e649Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F400a649_11>=parseFloat(e[0])&& layer.feature.properties.F400a649_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre400e649Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderEntre400e649Freg11.noUiSlider;
    $(slidersGeral).append(sliderEntre400e649Freg11);
}
///////////////////////////-------------------- FIM ENTRE 400 E 649 EM 2011, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS MAIS 650€  2011, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minMais650Freg11 = 999;
var maxMais650Freg11 = 0;
function estiloMais650Freg11(feature, latlng) {
    
    if(feature.properties.F650Mais_11 <= minMais650Freg11 && feature.properties.F650Mais_11 > null || feature.properties.F650Mais_11 === 0){
        minMais650Freg11 = feature.properties.F650Mais_11
    }
    if(feature.properties.F650Mais_11> maxMais650Freg11){
        maxMais650Freg11 = feature.properties.F650Mais_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F650Mais_11,0.8)
    });
}
function apagarMais650Freg11(e){
    var layer = e.target;
    Mais650Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMais650Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda superior a 650€: ' + '<b>' + feature.properties.F650Mais_11 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMais650Freg11,
    })
};

var Mais650Freg11= L.geoJSON(dadosAbsolutosFreguesias11,{
    pointToLayer:estiloMais650Freg11,
    onEachFeature: onEachFeatureMais650Freg11,
});

var slideMais650Freg11 = function(){
    var sliderMais650Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMais650Freg11, {
        start: [minMais650Freg11, maxMais650Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minMais650Freg11,
            'max': maxMais650Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMais650Freg11);
    inputNumberMax.setAttribute("value",maxMais650Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderMais650Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMais650Freg11.noUiSlider.set([null, this.value]);
    });

    sliderMais650Freg11.noUiSlider.on('update',function(e){
        Mais650Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F650Mais_11>=parseFloat(e[0])&& layer.feature.properties.F650Mais_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMais650Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderMais650Freg11.noUiSlider;
    $(slidersGeral).append(sliderMais650Freg11);
}
///////////////////////////-------------------- FIM MAIS 650 EM 2011, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS TOTAL  2021, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minTotalArrendadosFreg21 = 999;
var maxTotalArrendadosFreg21 = 0;
function estiloTotalArrendadosFreg21(feature, latlng) {
    
    if( feature.properties.Arr_Tot_21 <= minTotalArrendadosFreg21 && feature.properties.Arr_Tot_21 > null || minTotalArrendadosFreg21 === 0){
        minTotalArrendadosFreg21 = feature.properties.Arr_Tot_21
    }
    if(feature.properties.Arr_Tot_21> maxTotalArrendadosFreg21){
        maxTotalArrendadosFreg21 = feature.properties.Arr_Tot_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Arr_Tot_21,0.25)
    });
}
function apagarTotalArrendadosFreg21(e){
    var layer = e.target;
    TotalArrendadosFreg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalArrendadosFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados de residência habitual: ' + '<b>' + feature.properties.Arr_Tot_21 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalArrendadosFreg21,
    })
};

var TotalArrendadosFreg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloTotalArrendadosFreg21,
    onEachFeature: onEachFeatureTotalArrendadosFreg21,
});

var slideTotalArrendadosFreg21 = function(){
    var sliderTotalArrendadosFreg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalArrendadosFreg21, {
        start: [minTotalArrendadosFreg21, maxTotalArrendadosFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalArrendadosFreg21,
            'max': maxTotalArrendadosFreg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalArrendadosFreg21);
    inputNumberMax.setAttribute("value",maxTotalArrendadosFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalArrendadosFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalArrendadosFreg21.noUiSlider.set([null, this.value]);
    });

    sliderTotalArrendadosFreg21.noUiSlider.on('update',function(e){
        TotalArrendadosFreg21.eachLayer(function(layer){
            if(layer.feature.properties.Arr_Tot_21>=parseFloat(e[0])&& layer.feature.properties.Arr_Tot_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalArrendadosFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderTotalArrendadosFreg21.noUiSlider;
    $(slidersGeral).append(sliderTotalArrendadosFreg21);
}
///////////////////////////-------------------- FIM TOTAL EM 2021, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS MENOS 100€  2021, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minMenos100Freg21 = 999;
var maxMenos100Freg21 = 0;
function estiloMenos100Freg21(feature, latlng) {
    
    if(feature.properties.F0a99E_21 <= minMenos100Freg21 && feature.properties.F0a99E_21 > null || feature.properties.F0a99E_21 === 0){
        minMenos100Freg21 = feature.properties.F0a99E_21
    }
    if(feature.properties.F0a99E_21> maxMenos100Freg21){
        maxMenos100Freg21 = feature.properties.F0a99E_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F0a99E_21,0.35)
    });
}
function apagarMenos100Freg21(e){
    var layer = e.target;
    Menos100Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMenos100Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda inferior a 100€: ' + '<b>' + feature.properties.F0a99E_21 + '</b>').openPopup()   
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

    
    if (ifSlide2isActive != 31){
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
            if(layer.feature.properties.F0a99E_21>=parseFloat(e[0])&& layer.feature.properties.F0a99E_21 <= parseFloat(e[1])){
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
    ifSlide2isActive = 31;
    sliderAtivo = sliderMenos100Freg21.noUiSlider;
    $(slidersGeral).append(sliderMenos100Freg21);
}
///////////////////////////-------------------- FIM MENOS 100€ EM 2021, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS ENTRE 100€ E 200€  2021, POR FREGUESIA --------------------------\\\\\\\\\\\\\

var minEntre100e199Freg21 = 999;
var maxEntre100e199Freg21 = 0;
function estiloEntre100e199Freg21(feature, latlng) {
    
    if(feature.properties.F100a199_21 <= minEntre100e199Freg21 && feature.properties.F100a199_21 > null || feature.properties.F100a199_21 === 0){
        minEntre100e199Freg21 = feature.properties.F100a199_21
    }
    if(feature.properties.F100a199_21> maxEntre100e199Freg21){
        maxEntre100e199Freg21 = feature.properties.F100a199_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F100a199_21,0.35)
    });
}
function apagarEntre100e199Freg21(e){
    var layer = e.target;
    Entre100e199Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre100e199Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda entre 100 a 199.99€: ' + '<b>' + feature.properties.F100a199_21 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre100e199Freg21,
    })
};

var Entre100e199Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEntre100e199Freg21,
    onEachFeature: onEachFeatureEntre100e199Freg21,
});

var slideEntre100e199Freg21 = function(){
    var sliderEntre100e199Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre100e199Freg21, {
        start: [minEntre100e199Freg21, maxEntre100e199Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre100e199Freg21,
            'max': maxEntre100e199Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre100e199Freg21);
    inputNumberMax.setAttribute("value",maxEntre100e199Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre100e199Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre100e199Freg21.noUiSlider.set([null, this.value]);
    });

    sliderEntre100e199Freg21.noUiSlider.on('update',function(e){
        Entre100e199Freg21.eachLayer(function(layer){
            if(layer.feature.properties.F100a199_21>=parseFloat(e[0])&& layer.feature.properties.F100a199_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre100e199Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderEntre100e199Freg21.noUiSlider;
    $(slidersGeral).append(sliderEntre100e199Freg21);
}
///////////////////////////-------------------- FIM ENTRE 100 E 200€ EM 2021, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS ENTRE 200€ E 399€  2021, POR FREGUESIA --------------------------\\\\\\\\\\\\\

var minEntre200e399Freg21 = 999;
var maxEntre200e399Freg21 = 0;
function estiloEntre200e399Freg21(feature, latlng) {
    
    if(feature.properties.F200a399_21 <= minEntre200e399Freg21 && feature.properties.F200a399_21 > null || feature.properties.F400a649_21 === 0){
        minEntre200e399Freg21 = feature.properties.F200a399_21
    }
    if(feature.properties.F200a399_21> maxEntre200e399Freg21){
        maxEntre200e399Freg21 = feature.properties.F200a399_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F200a399_21,0.35)
    });
}
function apagarEntre200e399Freg21(e){
    var layer = e.target;
    Entre200e399Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre200e399Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda entre 200 a 399.99€: ' + '<b>' + feature.properties.F200a399_21 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre200e399Freg21,
    })
};

var Entre200e399Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEntre200e399Freg21,
    onEachFeature: onEachFeatureEntre200e399Freg21,
});

var slideEntre200e399Freg21 = function(){
    var sliderEntre200e399Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre200e399Freg21, {
        start: [minEntre200e399Freg21, maxEntre200e399Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre200e399Freg21,
            'max': maxEntre200e399Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre200e399Freg21);
    inputNumberMax.setAttribute("value",maxEntre200e399Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre200e399Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre200e399Freg21.noUiSlider.set([null, this.value]);
    });

    sliderEntre200e399Freg21.noUiSlider.on('update',function(e){
        Entre200e399Freg21.eachLayer(function(layer){
            if(layer.feature.properties.F200a399_21>=parseFloat(e[0])&& layer.feature.properties.F200a399_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre200e399Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderEntre200e399Freg21.noUiSlider;
    $(slidersGeral).append(sliderEntre200e399Freg21);
}
///////////////////////////-------------------- FIM ENTRE 200 E 399€ EM 2021, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS ENTRE 400 E 649  2021, POR FREGUESIA --------------------------\\\\\\\\\\\\\

var minEntre400e649Freg21 = 999;
var maxEntre400e649Freg21 = 0;
function estiloEntre400e649Freg21(feature, latlng) {
    
    if(feature.properties.F400a649_21 <= minEntre400e649Freg21 && feature.properties.F400a649_21 > null || feature.properties.F400a649_21 === 0){
        minEntre400e649Freg21 = feature.properties.F400a649_21
    }
    if(feature.properties.F400a649_21> maxEntre400e649Freg21){
        maxEntre400e649Freg21 = feature.properties.F400a649_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F400a649_21,0.35)
    });
}
function apagarEntre400e649Freg21(e){
    var layer = e.target;
    Entre400e649Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre400e649Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda entre 400 a 649.99€: ' + '<b>' + feature.properties.F400a649_21 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre400e649Freg21,
    })
};

var Entre400e649Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEntre400e649Freg21,
    onEachFeature: onEachFeatureEntre400e649Freg21,
});

var slideEntre400e649Freg21 = function(){
    var sliderEntre400e649Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre400e649Freg21, {
        start: [minEntre400e649Freg21, maxEntre400e649Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre400e649Freg21,
            'max': maxEntre400e649Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre400e649Freg21);
    inputNumberMax.setAttribute("value",maxEntre400e649Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre400e649Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre400e649Freg21.noUiSlider.set([null, this.value]);
    });

    sliderEntre400e649Freg21.noUiSlider.on('update',function(e){
        Entre400e649Freg21.eachLayer(function(layer){
            if(layer.feature.properties.F400a649_21>=parseFloat(e[0])&& layer.feature.properties.F400a649_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre400e649Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderEntre400e649Freg21.noUiSlider;
    $(slidersGeral).append(sliderEntre400e649Freg21);
}
///////////////////////////-------------------- FIM ENTRE 400 E 649€ EM 2021, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS ENTRE 650 E 999  2021, POR FREGUESIA --------------------------\\\\\\\\\\\\\

var minEntre650e999Freg21 = 999;
var maxEntre650e999Freg21 = 0;
function estiloEntre650e999Freg21(feature, latlng) {
    if(feature.properties.F650A999_21 <= minEntre650e999Freg21 && feature.properties.F650A999_21 > null || feature.properties.F650A999_21 === 0){
        minEntre650e999Freg21 = feature.properties.F650A999_21
    }
    if(feature.properties.F650A999_21> maxEntre650e999Freg21){
        maxEntre650e999Freg21 = feature.properties.F650A999_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F650A999_21,0.35)
    });
}
function apagarEntre650e999Freg21(e){
    var layer = e.target;
    Entre650e999Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEntre650e999Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda entre 650 a 999.99€: ' + '<b>' + feature.properties.F650A999_21 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEntre650e999Freg21,
    })
};

var Entre650e999Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloEntre650e999Freg21,
    onEachFeature: onEachFeatureEntre650e999Freg21,
});

var slideEntre650e999Freg21 = function(){
    var sliderEntre650e999Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEntre650e999Freg21, {
        start: [minEntre650e999Freg21, maxEntre650e999Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minEntre650e999Freg21,
            'max': maxEntre650e999Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEntre650e999Freg21);
    inputNumberMax.setAttribute("value",maxEntre650e999Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderEntre650e999Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEntre650e999Freg21.noUiSlider.set([null, this.value]);
    });

    sliderEntre650e999Freg21.noUiSlider.on('update',function(e){
        Entre650e999Freg21.eachLayer(function(layer){
            if(layer.feature.properties.F650A999_21>=parseFloat(e[0])&& layer.feature.properties.F650A999_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEntre650e999Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderEntre650e999Freg21.noUiSlider;
    $(slidersGeral).append(sliderEntre650e999Freg21);
}
///////////////////////////-------------------- FIM ENTRE 650 E 999€ EM 2021, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS MAIS 1000€ 2021, POR FREGUESIA --------------------------\\\\\\\\\\\\\

var minMais1000Freg21 = 999;
var maxMais1000Freg21 = 0;
function estiloMais1000Freg21(feature, latlng) {
    if(feature.properties.F1000M_21 <= minMais1000Freg21 && feature.properties.F1000M_21 > null || feature.properties.F1000M_21 === 0){
        minMais1000Freg21 = feature.properties.F1000M_21
    }
    if(feature.properties.F1000M_21> maxMais1000Freg21){
        maxMais1000Freg21 = feature.properties.F1000M_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F1000M_21,0.8)
    });
}
function apagarMais1000Freg21(e){
    var layer = e.target;
    Mais1000Freg21.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureMais1000Freg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos arrendados com valor de renda superior a 1000€: ' + '<b>' + feature.properties.F1000M_21 + '</b>').openPopup()   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarMais1000Freg21,
    })
};

var Mais1000Freg21= L.geoJSON(dadosAbsolutosFreguesias21,{
    pointToLayer:estiloMais1000Freg21,
    onEachFeature: onEachFeatureMais1000Freg21,
});

var slideMais1000Freg21 = function(){
    var sliderMais1000Freg21 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderMais1000Freg21, {
        start: [minMais1000Freg21, maxMais1000Freg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minMais1000Freg21,
            'max': maxMais1000Freg21
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minMais1000Freg21);
    inputNumberMax.setAttribute("value",maxMais1000Freg21);

    inputNumberMin.addEventListener('change', function(){
        sliderMais1000Freg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderMais1000Freg21.noUiSlider.set([null, this.value]);
    });

    sliderMais1000Freg21.noUiSlider.on('update',function(e){
        Mais1000Freg21.eachLayer(function(layer){
            if(layer.feature.properties.F1000M_21>=parseFloat(e[0])&& layer.feature.properties.F1000M_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderMais1000Freg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderMais1000Freg21.noUiSlider;
    $(slidersGeral).append(sliderMais1000Freg21);
}
///////////////////////////-------------------- FIM MAIS 1000€ EM 2021, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\
/////////////////////////////////////////--------------------------- DADOS RELATIVOS ----------------\\\\\\\\\\\\\

////////////////////////////------- Percentagem RENDA BAIXA CONCELHO em 2001-----////

var minRendaBaixaCon01 = 0;
var maxRendaBaixaCon01 = 0;

function CorPerRendaBaixaConc(d) {
    return d == null ? '#808080' :
        d >= 67.16 ? '#8c0303' :
        d >= 56.7  ? '#de1f35' :
        d >= 39.26 ? '#ff5e6e' :
        d >= 21.81   ? '#f5b3be' :
        d >= 4.37   ? '#F2C572' :
                ''  ;
}
var legendaPerRendaBaixaConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 67.16' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 56.7 a 67.16' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 39.26 a 56.7' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 21.81 a 39.26' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 4.37 a 21.81' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'



    $(legendaA).append(symbolsContainer); 
}


function EstiloRendaBaixaCon01(feature) {
    if( feature.properties.RenBaixa01 <= minRendaBaixaCon01 || minRendaBaixaCon01 === 0){
        minRendaBaixaCon01 = feature.properties.RenBaixa01
    }
    if(feature.properties.RenBaixa01 >= maxRendaBaixaCon01 ){
        maxRendaBaixaCon01 = feature.properties.RenBaixa01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaBaixaConc(feature.properties.RenBaixa01)
    };
}
function apagarRendaBaixaCon01(e) {
    RendaBaixaCon01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaBaixaCon01(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda baixa: ' + '<b>' + feature.properties.RenBaixa01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaBaixaCon01,
    });
}
var RendaBaixaCon01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloRendaBaixaCon01,
    onEachFeature: onEachFeatureRendaBaixaCon01
});
let slideRendaBaixaCon01 = function(){
    var sliderRendaBaixaCon01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaBaixaCon01, {
        start: [minRendaBaixaCon01, maxRendaBaixaCon01],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaBaixaCon01,
            'max': maxRendaBaixaCon01
        },
        });
    inputNumberMin.setAttribute("value",minRendaBaixaCon01);
    inputNumberMax.setAttribute("value",maxRendaBaixaCon01);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaBaixaCon01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaBaixaCon01.noUiSlider.set([null, this.value]);
    });

    sliderRendaBaixaCon01.noUiSlider.on('update',function(e){
        RendaBaixaCon01.eachLayer(function(layer){
            if(layer.feature.properties.RenBaixa01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenBaixa01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaBaixaCon01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderRendaBaixaCon01.noUiSlider;
    $(slidersGeral).append(sliderRendaBaixaCon01);
} 

/////////////////////////////// Fim da RENDA BAIXA CONCELHO em 2001 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA MÉDIA CONCELHO em 2001-----////

var minRendaMediaCon01 = 0;
var maxRendaMediaCon01 = 0;

function CorPerRendaMediaConc(d) {
    return d == null ? '#808080' :
        d >= 88.19 ? '#8c0303' :
        d >= 77.81  ? '#de1f35' :
        d >= 60.49  ? '#ff5e6e' :
        d >= 43.18   ? '#f5b3be' :
        d >= 25.86   ? '#F2C572' :
                ''  ;
}
var legendaPerRendaMediaConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 88.19' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 77.81 a 88.19' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 60.49 a 77.81' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 43.18 a 60.49' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 25.86 a 43.18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'



    $(legendaA).append(symbolsContainer); 
}


function EstiloRendaMediaCon01(feature) {
    if( feature.properties.RenMedia01 <= minRendaMediaCon01 || minRendaMediaCon01 === 0){
        minRendaMediaCon01 = feature.properties.RenMedia01
    }
    if(feature.properties.RenMedia01 >= maxRendaMediaCon01 ){
        maxRendaMediaCon01 = feature.properties.RenMedia01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaMediaConc(feature.properties.RenMedia01)
    };
}
function apagarRendaMediaCon01(e) {
    RendaMediaCon01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaMediaCon01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda média: ' + '<b>' + feature.properties.RenMedia01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaMediaCon01,
    });
}
var RendaMediaCon01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloRendaMediaCon01,
    onEachFeature: onEachFeatureRendaMediaCon01
});
let slideRendaMediaCon01 = function(){
    var sliderRendaMediaCon01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaMediaCon01, {
        start: [minRendaMediaCon01, maxRendaMediaCon01],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaMediaCon01,
            'max': maxRendaMediaCon01
        },
        });
    inputNumberMin.setAttribute("value",minRendaMediaCon01);
    inputNumberMax.setAttribute("value",maxRendaMediaCon01);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaMediaCon01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaMediaCon01.noUiSlider.set([null, this.value]);
    });

    sliderRendaMediaCon01.noUiSlider.on('update',function(e){
        RendaMediaCon01.eachLayer(function(layer){
            if(layer.feature.properties.RenMedia01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenMedia01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaMediaCon01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderRendaMediaCon01.noUiSlider;
    $(slidersGeral).append(sliderRendaMediaCon01);
} 

/////////////////////////////// Fim da RENDA MÉDIA CONCELHO em 2001 -------------- \\\\\\

///////////////////////////------- Percentagem RENDA BAIXA CONCELHO em 2011-----////

var minRendaBaixaCon11 = 0;
var maxRendaBaixaCon11 = 0;

function EstiloRendaBaixaCon11(feature) {
    if( feature.properties.RenBaixa11 <= minRendaBaixaCon11 || minRendaBaixaCon11 === 0){
        minRendaBaixaCon11 = feature.properties.RenBaixa11
    }
    if(feature.properties.RenBaixa11 >= maxRendaBaixaCon11 ){
        maxRendaBaixaCon11 = feature.properties.RenBaixa11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaBaixaConc(feature.properties.RenBaixa11)
    };
}
function apagarRendaBaixaCon11(e) {
    RendaBaixaCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaBaixaCon11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda baixa: ' + '<b>' + feature.properties.RenBaixa11  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 39){
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
            if(layer.feature.properties.RenBaixa11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenBaixa11.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 39;
    sliderAtivo = sliderRendaBaixaCon11.noUiSlider;
    $(slidersGeral).append(sliderRendaBaixaCon11);
} 

/////////////////////////////// Fim da RENDA BAIXA CONCELHO em 2111 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA MÉDIA CONCELHO em 2011-----////

var minRendaMediaCon11 = 0;
var maxRendaMediaCon11 = 0;

function EstiloRendaMediaCon11(feature) {
    if( feature.properties.RenMedia11 <= minRendaMediaCon11 || minRendaMediaCon11 === 0){
        minRendaMediaCon11 = feature.properties.RenMedia11
    }
    if(feature.properties.RenMedia11 >= maxRendaMediaCon11 ){
        maxRendaMediaCon11 = feature.properties.RenMedia11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaMediaConc(feature.properties.RenMedia11)
    };
}
function apagarRendaMediaCon11(e) {
    RendaMediaCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaMediaCon11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda média: ' + '<b>' + feature.properties.RenMedia11  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 40){
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
            if(layer.feature.properties.RenMedia11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenMedia11.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 40;
    sliderAtivo = sliderRendaMediaCon11.noUiSlider;
    $(slidersGeral).append(sliderRendaMediaCon11);
} 

/////////////////////////////// Fim da RENDA MÉDIA CONCELHO em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA ALTA  CONCELHO em 2011-----////

var minRendaAltaCon11 = 0;
var maxRendaAltaCon11 = 0;


function CorPerRendaAltaConc(d) {
    return d == null ? '#808080' :
        d >= 10.17 ? '#8c0303' :
        d >= 8.49  ? '#de1f35' :
        d >= 5.7  ? '#ff5e6e' :
        d >= 2.9   ? '#f5b3be' :
        d >= 0.1   ? '#F2C572' :
                ''  ;
}
var legendaPerRendaAltaConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 10.17' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 8.49 a 10.17' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 5.7 a 8.49' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 2.9 a 5.7' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.1 a 2.9' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'



    $(legendaA).append(symbolsContainer); 
}

function EstiloRendaAltaCon11(feature) {
    if( feature.properties.RenAlta11 <= minRendaAltaCon11 || minRendaAltaCon11 === 0){
        minRendaAltaCon11 = feature.properties.RenAlta11
    }
    if(feature.properties.RenAlta11 >= maxRendaAltaCon11 ){
        maxRendaAltaCon11 = feature.properties.RenAlta11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaAltaConc(feature.properties.RenAlta11)
    };
}
function apagarRendaAltaCon11(e) {
    RendaAltaCon11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaAltaCon11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda alta: ' + '<b>' + feature.properties.RenAlta11  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 41){
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
            if(layer.feature.properties.RenAlta11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenAlta11.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 41;
    sliderAtivo = sliderRendaAltaCon11.noUiSlider;
    $(slidersGeral).append(sliderRendaAltaCon11);
} 

/////////////////////////////// Fim da RENDA ALTA CONCELHO em 2011 -------------- \\\\\\

///////////////////////////------- Percentagem RENDA BAIXA CONCELHO em 2021-----////

var minRendaBaixaCon21 = 0;
var maxRendaBaixaCon21 = 0;

function EstiloRendaBaixaCon21(feature) {
    if( feature.properties.RenBaixa21 <= minRendaBaixaCon21 || minRendaBaixaCon21 === 0){
        minRendaBaixaCon21 = feature.properties.RenBaixa21
    }
    if(feature.properties.RenBaixa21 >= maxRendaBaixaCon21 ){
        maxRendaBaixaCon21 = feature.properties.RenBaixa21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaBaixaConc(feature.properties.RenBaixa21)
    };
}
function apagarRendaBaixaCon21(e) {
    RendaBaixaCon21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaBaixaCon21(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda baixa: ' + '<b>' + feature.properties.RenBaixa21  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 42){
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
            if(layer.feature.properties.RenBaixa21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenBaixa21.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 42;
    sliderAtivo = sliderRendaBaixaCon21.noUiSlider;
    $(slidersGeral).append(sliderRendaBaixaCon21);
} 

/////////////////////////////// Fim da RENDA BAIXA CONCELHO em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA MÉDIA CONCELHO em 2021-----////

var minRendaMediaCon21 = 0;
var maxRendaMediaCon21 = 0;

function EstiloRendaMediaCon21(feature) {
    if( feature.properties.RenMedia21 <= minRendaMediaCon21 || minRendaMediaCon21 === 0){
        minRendaMediaCon21 = feature.properties.RenMedia21
    }
    if(feature.properties.RenMedia21 >= maxRendaMediaCon21 ){
        maxRendaMediaCon21 = feature.properties.RenMedia21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaMediaConc(feature.properties.RenMedia21)
    };
}
function apagarRendaMediaCon21(e) {
    RendaMediaCon21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaMediaCon21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda média: ' + '<b>' + feature.properties.RenMedia21  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 43){
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
            if(layer.feature.properties.RenMedia21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenMedia21.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 43;
    sliderAtivo = sliderRendaMediaCon21.noUiSlider;
    $(slidersGeral).append(sliderRendaMediaCon21);
} 

/////////////////////////////// Fim da RENDA MÉDIA CONCELHO em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA ALTA  CONCELHO em 2021-----////

var minRendaAltaCon21 = 0;
var maxRendaAltaCon21 = 0;

function EstiloRendaAltaCon21(feature) {
    if( feature.properties.RenAlta21 <= minRendaAltaCon21 || minRendaAltaCon21 === 0){
        minRendaAltaCon21 = feature.properties.RenAlta21
    }
    if(feature.properties.RenAlta21 >= maxRendaAltaCon21 ){
        maxRendaAltaCon21 = feature.properties.RenAlta21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaAltaConc(feature.properties.RenAlta21)
    };
}
function apagarRendaAltaCon21(e) {
    RendaAltaCon21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaAltaCon21(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda alta: ' + '<b>' + feature.properties.RenAlta21  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 44){
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
            if(layer.feature.properties.RenAlta21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenAlta21.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 44;
    sliderAtivo = sliderRendaAltaCon21.noUiSlider;
    $(slidersGeral).append(sliderRendaAltaCon21);
} 

/////////////////////////////// Fim da RENDA ALTA CONCELHO em 2021 -------------- \\\\\\
///////////////////////////////////// FREGUESIAS PERCENTAGEM

////////////////////////////------- Percentagem RENDA BAIXA FREGUESIA em 2001-----////

var minRendaBaixaFreg01 = 99;
var maxRendaBaixaFreg01 = 0;

function CorPerRendaBaixaFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 90 ? '#8c0303' :
        d >= 75  ? '#de1f35' :
        d >= 50 ? '#ff5e6e' :
        d >= 25   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerRendaBaixaFreg = function() {
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
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' 0' + '<br>'




    $(legendaA).append(symbolsContainer); 
}

function EstiloRendaBaixaFreg01(feature) {
    if( feature.properties.RenBaixa01 <= minRendaBaixaFreg01){
        minRendaBaixaFreg01 = feature.properties.RenBaixa01
    }
    if(feature.properties.RenBaixa01 >= maxRendaBaixaFreg01 ){
        maxRendaBaixaFreg01 = feature.properties.RenBaixa01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaBaixaFreg(feature.properties.RenBaixa01)
    };
}
function apagarRendaBaixaFreg01(e) {
    RendaBaixaFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaBaixaFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda baixa: ' + '<b>' + feature.properties.RenBaixa01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaBaixaFreg01,
    });
}
var RendaBaixaFreg01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloRendaBaixaFreg01,
    onEachFeature: onEachFeatureRendaBaixaFreg01
});
let slideRendaBaixaFreg01 = function(){
    var sliderRendaBaixaFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaBaixaFreg01, {
        start: [minRendaBaixaFreg01, maxRendaBaixaFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaBaixaFreg01,
            'max': maxRendaBaixaFreg01
        },
        });
    inputNumberMin.setAttribute("value",minRendaBaixaFreg01);
    inputNumberMax.setAttribute("value",maxRendaBaixaFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaBaixaFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaBaixaFreg01.noUiSlider.set([null, this.value]);
    });

    sliderRendaBaixaFreg01.noUiSlider.on('update',function(e){
        RendaBaixaFreg01.eachLayer(function(layer){
            if(layer.feature.properties.RenBaixa01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenBaixa01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaBaixaFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderRendaBaixaFreg01.noUiSlider;
    $(slidersGeral).append(sliderRendaBaixaFreg01);
} 

/////////////////////////////// Fim da RENDA BAIXA FREGUESIA em 2001 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA MÉDIA FREGUESIA em 2001-----////

var minRendaMediaFreg01 = 99;
var maxRendaMediaFreg01 = 0;

function CorPerRendaMediaFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 90 ? '#8c0303' :
        d >= 75  ? '#de1f35' :
        d >= 50 ? '#ff5e6e' :
        d >= 25   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerRendaMediaFreg = function() {
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
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' 0' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloRendaMediaFreg01(feature) {
    if(feature.properties.RenMedia01 <= minRendaMediaFreg01){
        minRendaMediaFreg01 = feature.properties.RenMedia01
    }
    if(feature.properties.RenMedia01 >= maxRendaMediaFreg01 ){
        maxRendaMediaFreg01 = feature.properties.RenMedia01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaBaixaFreg(feature.properties.RenMedia01)
    };
}
function apagarRendaMediaFreg01(e) {
    RendaMediaFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaMediaFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda média: ' + '<b>' + feature.properties.RenMedia01  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarRendaMediaFreg01,
    });
}
var RendaMediaFreg01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloRendaMediaFreg01,
    onEachFeature: onEachFeatureRendaMediaFreg01
});

let slideRendaMediaFreg01 = function(){
    var sliderRendaMediaFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderRendaMediaFreg01, {
        start: [minRendaMediaFreg01, maxRendaMediaFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minRendaMediaFreg01,
            'max': maxRendaMediaFreg01
        },
        });
    inputNumberMin.setAttribute("value",minRendaMediaFreg01);
    inputNumberMax.setAttribute("value",maxRendaMediaFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderRendaMediaFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderRendaMediaFreg01.noUiSlider.set([null, this.value]);
    });

    sliderRendaMediaFreg01.noUiSlider.on('update',function(e){
        RendaMediaFreg01.eachLayer(function(layer){
            if(layer.feature.properties.RenMedia01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenMedia01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderRendaMediaFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderRendaMediaFreg01.noUiSlider;
    $(slidersGeral).append(sliderRendaMediaFreg01);
} 

/////////////////////////////// Fim da RENDA MÉDIA FREGUESIA em 2001 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA BAIXA FREGUESIA em 2011-----////

var minRendaBaixaFreg11 = 99;
var maxRendaBaixaFreg11 = 0;

function EstiloRendaBaixaFreg11(feature) {
    if( feature.properties.RenBaixa11 <= minRendaBaixaFreg11){
        minRendaBaixaFreg11 = feature.properties.RenBaixa11
    }
    if(feature.properties.RenBaixa11 >= maxRendaBaixaFreg11 ){
        maxRendaBaixaFreg11 = feature.properties.RenBaixa11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaBaixaFreg(feature.properties.RenBaixa11)
    };
}
function apagarRendaBaixaFreg11(e) {
    RendaBaixaFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaBaixaFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda baixa: ' + '<b>' + feature.properties.RenBaixa11  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 47){
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
            if(layer.feature.properties.RenBaixa11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenBaixa11.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 47;
    sliderAtivo = sliderRendaBaixaFreg11.noUiSlider;
    $(slidersGeral).append(sliderRendaBaixaFreg11);
} 

/////////////////////////////// Fim da RENDA BAIXA FREGUESIA em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA MÉDIA FREGUESIA em 2011-----////

var minRendaMediaFreg11 = 99;
var maxRendaMediaFreg11 = 0;

function EstiloRendaMediaFreg11(feature) {
    if( feature.properties.RenMedia11 <= minRendaMediaFreg11){
        minRendaMediaFreg11 = feature.properties.RenMedia11
    }
    if(feature.properties.RenMedia11 >= maxRendaMediaFreg11 ){
        maxRendaMediaFreg11 = feature.properties.RenMedia11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaBaixaFreg(feature.properties.RenMedia11)
    };
}
function apagarRendaMediaFreg11(e) {
    RendaMediaFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaMediaFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda média: ' + '<b>' + feature.properties.RenMedia11  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 48){
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
            if(layer.feature.properties.RenMedia11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenMedia11.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 48;
    sliderAtivo = sliderRendaMediaFreg11.noUiSlider;
    $(slidersGeral).append(sliderRendaMediaFreg11);
} 

/////////////////////////////// Fim da RENDA MÉDIA FREGUESIA em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA ALTA FREGUESIA em 2011-----////

var minRendaAltaFreg11 = 99;
var maxRendaAltaFreg11 = 0;

function CorPerRendaAltaFreg(d) {
    return d == 0.00 ? '#808080' :
        d >= 25.61 ? '#8c0303' :
        d >= 21.34  ? '#de1f35' :
        d >= 14.23 ? '#ff5e6e' :
        d >= 7.11   ? '#f5b3be' :
        d >= 0.01   ? '#F2C572' :
                ''  ;
}
var legendaPerRendaAltaFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 25.61' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 21.34 a 25.61' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 14.23 a 21.34' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 7.11 a 14.23' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0.01 a 7.11' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' 0' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloRendaAltaFreg11(feature) {
    if( feature.properties.RenAlta11 <= minRendaAltaFreg11){
        minRendaAltaFreg11 = feature.properties.RenAlta11
    }
    if(feature.properties.RenAlta11 >= maxRendaAltaFreg11 ){
        maxRendaAltaFreg11 = feature.properties.RenAlta11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaAltaFreg(feature.properties.RenAlta11)
    };
}
function apagarRendaAltaFreg11(e) {
    RendaAltaFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaAltaFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda média: ' + '<b>' + feature.properties.RenAlta11  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 49){
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
            if(layer.feature.properties.RenAlta11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenAlta11.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 49;
    sliderAtivo = sliderRendaAltaFreg11.noUiSlider;
    $(slidersGeral).append(sliderRendaAltaFreg11);
} 

/////////////////////////////// Fim da RENDA ALTA FREGUESIA em 2011 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA BAIXA FREGUESIA em 2021-----////

var minRendaBaixaFreg21 = 99;
var maxRendaBaixaFreg21 = 0;

function EstiloRendaBaixaFreg21(feature) {
    if( feature.properties.RenBaixa21 <= minRendaBaixaFreg21){
        minRendaBaixaFreg21 = feature.properties.RenBaixa21
    }
    if(feature.properties.RenBaixa21 >= maxRendaBaixaFreg21 ){
        maxRendaBaixaFreg21 = feature.properties.RenBaixa21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaBaixaFreg(feature.properties.RenBaixa21)
    };
}
function apagarRendaBaixaFreg21(e) {
    RendaBaixaFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaBaixaFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda baixa: ' + '<b>' + feature.properties.RenBaixa21  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 50){
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
            if(layer.feature.properties.RenBaixa21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenBaixa21.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 50;
    sliderAtivo = sliderRendaBaixaFreg21.noUiSlider;
    $(slidersGeral).append(sliderRendaBaixaFreg21);
} 

/////////////////////////////// Fim da RENDA BAIXA FREGUESIA em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA MÉDIA FREGUESIA em 2021-----////

var minRendaMediaFreg21 = 99;
var maxRendaMediaFreg21 = 0;

function EstiloRendaMediaFreg21(feature) {
    if( feature.properties.RenMedia21 <= minRendaMediaFreg21){
        minRendaMediaFreg21 = feature.properties.RenMedia21
    }
    if(feature.properties.RenMedia21 >= maxRendaMediaFreg21 ){
        maxRendaMediaFreg21 = feature.properties.RenMedia21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaBaixaFreg(feature.properties.RenMedia21)
    };
}
function apagarRendaMediaFreg21(e) {
    RendaMediaFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaMediaFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda média: ' + '<b>' + feature.properties.RenMedia21  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 51){
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
            if(layer.feature.properties.RenMedia21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenMedia21.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 51;
    sliderAtivo = sliderRendaMediaFreg21.noUiSlider;
    $(slidersGeral).append(sliderRendaMediaFreg21);
} 

/////////////////////////////// Fim da RENDA MÉDIA FREGUESIA em 2021 -------------- \\\\\\

////////////////////////////------- Percentagem RENDA ALTA FREGUESIA em 2021-----////

var minRendaAltaFreg21 = 99;
var maxRendaAltaFreg21 = 0;

function EstiloRendaAltaFreg21(feature) {
    if( feature.properties.RenAlta21 <= minRendaAltaFreg21){
        minRendaAltaFreg21 = feature.properties.RenAlta21
    }
    if(feature.properties.RenAlta21 >= maxRendaAltaFreg21 ){
        maxRendaAltaFreg21 = feature.properties.RenAlta21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerRendaAltaFreg(feature.properties.RenAlta21)
    };
}
function apagarRendaAltaFreg21(e) {
    RendaAltaFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureRendaAltaFreg21(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de alojamentos arrendados com renda média: ' + '<b>' + feature.properties.RenAlta21  + '</b>' + '%').openPopup()
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


    if (ifSlide2isActive != 52){
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
            if(layer.feature.properties.RenAlta21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.RenAlta21.toFixed(2) <= parseFloat(e[1])){
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
    ifSlide2isActive = 52;
    sliderAtivo = sliderRendaAltaFreg21.noUiSlider;
    $(slidersGeral).append(sliderRendaAltaFreg21);
} 

///////////////////////////// Fim da RENDA ALTA FREGUESIA em 2021 -------------- \\\\\\


// /////////////////////////////------------------------ VARIAÇÕES -------------------------------\\\\\\\\\\\\\\\\\

// /////////////////////////////------- Variação TOTAL ALOJAMENTOS arrendados 2011 E 2001 POR CONCELHOS -------------------////

var minVarTotArrendadosConc11_01 = 0;
var maxVarTotArrendadosConc11_01 = 0;

function CorVarArrendadosConc11_01(d) {
    return d === null ? '#808080':
        d >= 30  ? '#8c0303' :
        d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5.06   ? '#9eaad7' :
                ''  ;
}

var legendaVarArrendadosConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados de residência habitual, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  20 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5.05 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotArrendadosConc11_01(feature) {
    if(feature.properties.V_Tot11_01 <= minVarTotArrendadosConc11_01 || minVarTotArrendadosConc11_01 ===0){
        minVarTotArrendadosConc11_01 = feature.properties.V_Tot11_01
    }
    if(feature.properties.V_Tot11_01 > maxVarTotArrendadosConc11_01){
        maxVarTotArrendadosConc11_01 = feature.properties.V_Tot11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarArrendadosConc11_01(feature.properties.V_Tot11_01)};
    }


function apagarVarTotArrendadosConc11_01(e) {
    VarTotArrendadosConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotArrendadosConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_Tot11_01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotArrendadosConc11_01,
    });
}
var VarTotArrendadosConc11_01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotArrendadosConc11_01,
    onEachFeature: onEachFeatureVarTotArrendadosConc11_01
});

let slideVarTotArrendadosConc11_01 = function(){
    var sliderVarTotArrendadosConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotArrendadosConc11_01, {
        start: [minVarTotArrendadosConc11_01, maxVarTotArrendadosConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotArrendadosConc11_01,
            'max': maxVarTotArrendadosConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarTotArrendadosConc11_01);
    inputNumberMax.setAttribute("value",maxVarTotArrendadosConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotArrendadosConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotArrendadosConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarTotArrendadosConc11_01.noUiSlider.on('update',function(e){
        VarTotArrendadosConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.V_Tot11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_Tot11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotArrendadosConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderVarTotArrendadosConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarTotArrendadosConc11_01);
} 

///////////////////////////// Fim da Variação TOTAL ARRENDADOS 2011 E 2001 CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação TOTAL MENOS 100€ 2011 E 2001 POR CONCELHOS -------------------////

var minVarMenos100E11_01 = 0;
var maxVarMenos100E11_01 = -99;

function CorVarMenos100Conc11_01(d) {
    return d === null ? '#808080':
        d >= -20  ? '#9ebbd7' :
        d >= -30  ? '#2288bf' :
        d >= -40  ? '#155273' :
        d >= -51.33   ? '#0b2c40' :
                ''  ;
}

var legendaVarMenos100Conc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda inferior a 100€, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -30 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -40 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -51.32 a -40' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarMenos100E11_01(feature) {
    if(feature.properties.V_99_1101 <= minVarMenos100E11_01 || minVarMenos100E11_01 ===0){
        minVarMenos100E11_01 = feature.properties.V_99_1101
    }
    if(feature.properties.V_99_1101 > maxVarMenos100E11_01){
        maxVarMenos100E11_01 = feature.properties.V_99_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMenos100Conc11_01(feature.properties.V_99_1101)};
    }


function apagarVarMenos100E11_01(e) {
    VarMenos100E11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMenos100E11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_99_1101.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMenos100E11_01,
    });
}
var VarMenos100E11_01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarMenos100E11_01,
    onEachFeature: onEachFeatureVarMenos100E11_01
});

let slideVarMenos100E11_01 = function(){
    var sliderVarMenos100E11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMenos100E11_01, {
        start: [minVarMenos100E11_01, maxVarMenos100E11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMenos100E11_01,
            'max': maxVarMenos100E11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarMenos100E11_01);
    inputNumberMax.setAttribute("value",maxVarMenos100E11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMenos100E11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMenos100E11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarMenos100E11_01.noUiSlider.on('update',function(e){
        VarMenos100E11_01.eachLayer(function(layer){
            if(layer.feature.properties.V_99_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_99_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMenos100E11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderVarMenos100E11_01.noUiSlider;
    $(slidersGeral).append(sliderVarMenos100E11_01);
} 

///////////////////////////// Fim da Variação MENOS 100€ 2011 E 2001 CONCELHOS -------------- \\\\\


// /////////////////////////////------- Variação TOTAL 100 A 200€ 2011 E 2001 POR CONCELHOS -------------------////

var minVar100A199E11_01 = 0;
var maxVar100A199E11_01 = 0;

function CorVar200Conc11_01(d) {
    return d === null ? '#808080':
        d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -22.83   ? '#2288bf' :
                ''  ;
}

var legendaVar200Conc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda entre 100 e 199.99€, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -22.82 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar100A199E11_01(feature) {
    if(feature.properties.V_200_1101 <= minVar100A199E11_01 || minVar100A199E11_01 ===0){
        minVar100A199E11_01 = feature.properties.V_200_1101
    }
    if(feature.properties.V_200_1101 > maxVar100A199E11_01){
        maxVar100A199E11_01 = feature.properties.V_200_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar200Conc11_01(feature.properties.V_200_1101)};
    }


function apagarVar100A199E11_01(e) {
    Var100A199E11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar100A199E11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_200_1101.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar100A199E11_01,
    });
}
var Var100A199E11_01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar100A199E11_01,
    onEachFeature: onEachFeatureVar100A199E11_01
});

let slideVar100A199E11_01 = function(){
    var sliderVar100A199E11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar100A199E11_01, {
        start: [minVar100A199E11_01, maxVar100A199E11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar100A199E11_01,
            'max': maxVar100A199E11_01
        },
        });
    inputNumberMin.setAttribute("value",minVar100A199E11_01);
    inputNumberMax.setAttribute("value",maxVar100A199E11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar100A199E11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar100A199E11_01.noUiSlider.set([null, this.value]);
    });

    sliderVar100A199E11_01.noUiSlider.on('update',function(e){
        Var100A199E11_01.eachLayer(function(layer){
            if(layer.feature.properties.V_200_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_200_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar100A199E11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderVar100A199E11_01.noUiSlider;
    $(slidersGeral).append(sliderVar100A199E11_01);
} 

///////////////////////////// Fim da Variação  100€ A 200€ 2011 E 2001 CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação TOTAL 200 A 399 2011 E 2001 POR CONCELHOS -------------------////

var minVar200A399E11_01 = 0;
var maxVar200A399E11_01 = 0;

function CorVar400Conc11_01(d) {
    return d === null ? '#808080':
        d >= 100  ? '#8c0303' :
        d >= 80  ? '#de1f35' :
        d >= 60  ? '#ff5e6e' :
        d >= 44.08   ? '#f5b3be' :
                ''  ;
}

var legendaVar400Conc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda entre 200 e 399.99€, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  80 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  60 a 80' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  44.08 a 60' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar200A399E11_01(feature) {
    if(feature.properties.V_400_1101 <= minVar200A399E11_01 || minVar200A399E11_01 ===0){
        minVar200A399E11_01 = feature.properties.V_400_1101
    }
    if(feature.properties.V_400_1101 > maxVar200A399E11_01){
        maxVar200A399E11_01 = feature.properties.V_400_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar400Conc11_01(feature.properties.V_400_1101)};
    }


function apagarVar200A399E11_01(e) {
    Var200A399E11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar200A399E11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_400_1101.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar200A399E11_01,
    });
}
var Var200A399E11_01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar200A399E11_01,
    onEachFeature: onEachFeatureVar200A399E11_01
});

let slideVar200A399E11_01 = function(){
    var sliderVar200A399E11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar200A399E11_01, {
        start: [minVar200A399E11_01, maxVar200A399E11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar200A399E11_01,
            'max': maxVar200A399E11_01
        },
        });
    inputNumberMin.setAttribute("value",minVar200A399E11_01);
    inputNumberMax.setAttribute("value",maxVar200A399E11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar200A399E11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar200A399E11_01.noUiSlider.set([null, this.value]);
    });

    sliderVar200A399E11_01.noUiSlider.on('update',function(e){
        Var200A399E11_01.eachLayer(function(layer){
            if(layer.feature.properties.V_400_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_400_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar200A399E11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderVar200A399E11_01.noUiSlider;
    $(slidersGeral).append(sliderVar200A399E11_01);
} 

///////////////////////////// Fim da Variação  200 A 399 2011 E 2001 CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação TOTAL ALOJAMENTOS arrendados 2021 E 2011 POR CONCELHOS -------------------////

var minVarTotArrendadosConc21_11 = 0;
var maxVarTotArrendadosConc21_11 = 0;

function CorVararrendadosConc21_11(d) {
    return d === null ? '#808080':
        d >= 25  ? '#8c0303' :
        d >= 20  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 10  ? '#f5b3be' :
        d >= 4   ? '#F2C572' :
                ''  ;
}

var legendaVarArrendadosConc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados de residência habitual, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  20 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  10 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + '  4.17 a 10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotArrendadosConc21_11(feature) {
    if(feature.properties.V_Tot21_11 <= minVarTotArrendadosConc21_11 || minVarTotArrendadosConc21_11 ===0){
        minVarTotArrendadosConc21_11 = feature.properties.V_Tot21_11
    }
    if(feature.properties.V_Tot21_11 > maxVarTotArrendadosConc21_11){
        maxVarTotArrendadosConc21_11 = feature.properties.V_Tot21_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVararrendadosConc21_11(feature.properties.V_Tot21_11)};
    }


function apagarVarTotArrendadosConc21_11(e) {
    VarTotArrendadosConc21_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotArrendadosConc21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_Tot21_11.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotArrendadosConc21_11,
    });
}
var VarTotArrendadosConc21_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotArrendadosConc21_11,
    onEachFeature: onEachFeatureVarTotArrendadosConc21_11
});

let slideVarTotArrendadosConc21_11 = function(){
    var sliderVarTotArrendadosConc21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotArrendadosConc21_11, {
        start: [minVarTotArrendadosConc21_11, maxVarTotArrendadosConc21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotArrendadosConc21_11,
            'max': maxVarTotArrendadosConc21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarTotArrendadosConc21_11);
    inputNumberMax.setAttribute("value",maxVarTotArrendadosConc21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotArrendadosConc21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotArrendadosConc21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarTotArrendadosConc21_11.noUiSlider.on('update',function(e){
        VarTotArrendadosConc21_11.eachLayer(function(layer){
            if(layer.feature.properties.V_Tot21_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_Tot21_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotArrendadosConc21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderVarTotArrendadosConc21_11.noUiSlider;
    $(slidersGeral).append(sliderVarTotArrendadosConc21_11);
} 

///////////////////////////// Fim da Variação TOTAL ARRENDADOS 2021 E 2011 CONCELHOS -------------- \\\\\


// /////////////////////////////------- Variação TOTAL MENOS 100€ 2021 E 2011 POR CONCELHOS -------------------////

var minVarMenos100E21_11 = 0;
var maxVarMenos100E21_11 = -99;

function CorVarMenos100Conc21_11(d) {
    return d === null ? '#808080':
        d >= -30  ? '#9ebbd7' :
        d >= -40  ? '#2288bf' :
        d >= -50  ? '#155273' :
        d >= -63.05   ? '#0b2c40' :
                ''  ;
}

var legendaVarMenos100Conc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda inferior a 100€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '   > -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + '  -40 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + '  -50 a -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + '  -63.04 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarMenos100E21_11(feature) {
    if(feature.properties.V_99_2111 <= minVarMenos100E21_11){
        minVarMenos100E21_11 = feature.properties.V_99_2111
    }
    if(feature.properties.V_99_2111 > maxVarMenos100E21_11){
        maxVarMenos100E21_11 = feature.properties.V_99_2111 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMenos100Conc21_11(feature.properties.V_99_2111)};
    }


function apagarVarMenos100E21_11(e) {
    VarMenos100E21_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMenos100E21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_99_2111.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMenos100E21_11,
    });
}
var VarMenos100E21_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarMenos100E21_11,
    onEachFeature: onEachFeatureVarMenos100E21_11
});

let slideVarMenos100E21_11 = function(){
    var sliderVarMenos100E21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMenos100E21_11, {
        start: [minVarMenos100E21_11, maxVarMenos100E21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMenos100E21_11,
            'max': maxVarMenos100E21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarMenos100E21_11);
    inputNumberMax.setAttribute("value",maxVarMenos100E21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMenos100E21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMenos100E21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarMenos100E21_11.noUiSlider.on('update',function(e){
        VarMenos100E21_11.eachLayer(function(layer){
            if(layer.feature.properties.V_99_2111.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_99_2111.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMenos100E21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderVarMenos100E21_11.noUiSlider;
    $(slidersGeral).append(sliderVarMenos100E21_11);
} 

///////////////////////////// Fim da Variação MENOS 100€ 2021 E 2011 CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação TOTAL 100 A 200€ 2021 E 2011 POR CONCELHOS -------------------////

var minVar100A199E21_11 = 0;
var maxVar100A199E21_11 = 0;

function CorVar200Conc21_11(d) {
    return d === null ? '#808080':
        d >= 25  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9eaad7' :
        d >= -32   ? '#2288bf' :
                ''  ;
}

var legendaVar200Conc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda entre 100 e 199.99€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '   > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '   15 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '   0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + '  -31.09 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar100A199E21_11(feature) {
    if(feature.properties.V_200_2111 <= minVar100A199E21_11 || minVar100A199E21_11 ===0){
        minVar100A199E21_11 = feature.properties.V_200_2111
    }
    if(feature.properties.V_200_2111 > maxVar100A199E21_11){
        maxVar100A199E21_11 = feature.properties.V_200_2111 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar200Conc21_11(feature.properties.V_200_2111)};
    }


function apagarVar100A199E21_11(e) {
    Var100A199E21_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar100A199E21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_200_2111.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar100A199E21_11,
    });
}
var Var100A199E21_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar100A199E21_11,
    onEachFeature: onEachFeatureVar100A199E21_11
});

let slideVar100A199E21_11 = function(){
    var sliderVar100A199E21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar100A199E21_11, {
        start: [minVar100A199E21_11, maxVar100A199E21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar100A199E21_11,
            'max': maxVar100A199E21_11
        },
        });
    inputNumberMin.setAttribute("value",minVar100A199E21_11);
    inputNumberMax.setAttribute("value",maxVar100A199E21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVar100A199E21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar100A199E21_11.noUiSlider.set([null, this.value]);
    });

    sliderVar100A199E21_11.noUiSlider.on('update',function(e){
        Var100A199E21_11.eachLayer(function(layer){
            if(layer.feature.properties.V_200_2111.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_200_2111.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar100A199E21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderVar100A199E21_11.noUiSlider;
    $(slidersGeral).append(sliderVar100A199E21_11);
} 

///////////////////////////// Fim da Variação  100€ A 200€ 2021 E 2011 CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação TOTAL 200 A 399 2021 E 2011 POR CONCELHOS -------------------////

var minVar200A399E21_11 = 0;
var maxVar200A399E21_11 = 0;

function CorVar400Conc21_11(d) {
    return d === null ? '#808080':
        d >= 50  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -8.75   ? '#9eaad7' :
                ''  ;
}

var legendaVar400Conc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda entre 200 e 399.99€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '   > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '   30 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '   15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '   0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -8.71 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar200A399E21_11(feature) {
    if(feature.properties.V_400_2111 <= minVar200A399E21_11 || minVar200A399E21_11 ===0){
        minVar200A399E21_11 = feature.properties.V_400_2111
    }
    if(feature.properties.V_400_2111 > maxVar200A399E21_11){
        maxVar200A399E21_11 = feature.properties.V_400_2111 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar400Conc21_11(feature.properties.V_400_2111)};
    }


function apagarVar200A399E21_11(e) {
    Var200A399E21_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar200A399E21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_400_2111.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar200A399E21_11,
    });
}
var Var200A399E21_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar200A399E21_11,
    onEachFeature: onEachFeatureVar200A399E21_11
});

let slideVar200A399E21_11 = function(){
    var sliderVar200A399E21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar200A399E21_11, {
        start: [minVar200A399E21_11, maxVar200A399E21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar200A399E21_11,
            'max': maxVar200A399E21_11
        },
        });
    inputNumberMin.setAttribute("value",minVar200A399E21_11);
    inputNumberMax.setAttribute("value",maxVar200A399E21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVar200A399E21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar200A399E21_11.noUiSlider.set([null, this.value]);
    });

    sliderVar200A399E21_11.noUiSlider.on('update',function(e){
        Var200A399E21_11.eachLayer(function(layer){
            if(layer.feature.properties.V_400_2111.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_400_2111.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar200A399E21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderVar200A399E21_11.noUiSlider;
    $(slidersGeral).append(sliderVar200A399E21_11);
} 

///////////////////////////// Fim da Variação  200 A 399 2021 E 2011 CONCELHOS -------------- \\\\\

// /////////////////////////////------- Variação TOTAL 400 A 649 2021 E 2011 POR CONCELHOS -------------------////

var minVar400A649E21_11 = 0;
var maxVar400A649E21_11 = 0;

function CorVar649Conc21_11(d) {
    return d === null ? '#808080':
        d >= 100  ? '#8c0303' :
                ''  ;
}

var legendaVar649Conc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda entre 400 e 649.99€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar400A649E21_11(feature) {
    if(feature.properties.V_649_2111 <= minVar400A649E21_11 || minVar400A649E21_11 ===0){
        minVar400A649E21_11 = feature.properties.V_649_2111
    }
    if(feature.properties.V_649_2111 > maxVar400A649E21_11){
        maxVar400A649E21_11 = feature.properties.V_649_2111 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar649Conc21_11(feature.properties.V_649_2111)};
    }


function apagarVar400A649E21_11(e) {
    Var400A649E21_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar400A649E21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_649_2111.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar400A649E21_11,
    });
}
var Var400A649E21_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar400A649E21_11,
    onEachFeature: onEachFeatureVar400A649E21_11
});

let slideVar400A649E21_11 = function(){
    var sliderVar400A649E21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar400A649E21_11, {
        start: [minVar400A649E21_11, maxVar400A649E21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar400A649E21_11,
            'max': maxVar400A649E21_11
        },
        });
    inputNumberMin.setAttribute("value",minVar400A649E21_11);
    inputNumberMax.setAttribute("value",maxVar400A649E21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVar400A649E21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar400A649E21_11.noUiSlider.set([null, this.value]);
    });

    sliderVar400A649E21_11.noUiSlider.on('update',function(e){
        Var400A649E21_11.eachLayer(function(layer){
            if(layer.feature.properties.V_649_2111.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_649_2111.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar400A649E21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderVar400A649E21_11.noUiSlider;
    $(slidersGeral).append(sliderVar400A649E21_11);
} 

///////////////////////////// Fim da Variação  400 A 649 2021 E 2011 CONCELHOS -------------- \\\\\


// /////////////////////////////------- Variação MAIS 650 2021 E 2011 POR CONCELHOS -------------------////

var minVarMais650E21_11 = 0;
var maxVarMais650E21_11 = 0;

function CorVar650Conc21_11(d) {
    return d === null ? '#808080':
        d >= 100  ? '#8c0303' :
        d >= 0  ? '#de1f35' :
        d >= -30  ? '#9eaad7' :
        d >= -65   ? '#155273' :
                ''  ;
}

var legendaVar650Conc21_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda superior a 650€, entre 2021 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '   > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '   0 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -30 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + '  -64.71 a -30' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarMais650E21_11(feature) {
    if(feature.properties.V_650_2111 <= minVarMais650E21_11 || minVarMais650E21_11 ===0){
        minVarMais650E21_11 = feature.properties.V_650_2111
    }
    if(feature.properties.V_650_2111 > maxVarMais650E21_11){
        maxVarMais650E21_11 = feature.properties.V_650_2111 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar650Conc21_11(feature.properties.V_650_2111)};
    }


function apagarVarMais650E21_11(e) {
    VarMais650E21_11.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMais650E21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_650_2111.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMais650E21_11,
    });
}
var VarMais650E21_11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarMais650E21_11,
    onEachFeature: onEachFeatureVarMais650E21_11
});

let slideVarMais650E21_11 = function(){
    var sliderVarMais650E21_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMais650E21_11, {
        start: [minVarMais650E21_11, maxVarMais650E21_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMais650E21_11,
            'max': maxVarMais650E21_11
        },
        });
    inputNumberMin.setAttribute("value",minVarMais650E21_11);
    inputNumberMax.setAttribute("value",maxVarMais650E21_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMais650E21_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMais650E21_11.noUiSlider.set([null, this.value]);
    });

    sliderVarMais650E21_11.noUiSlider.on('update',function(e){
        VarMais650E21_11.eachLayer(function(layer){
            if(layer.feature.properties.V_650_2111.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_650_2111.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMais650E21_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderVarMais650E21_11.noUiSlider;
    $(slidersGeral).append(sliderVarMais650E21_11);
} 

///////////////////////////// Fim da Variação  MAIS 650 2021 E 2011 CONCELHOS -------------- \\\\\


// //////////////////////////////////------------------------------ VARIAÇOES FREGUESIAS -------------\\\


/////////////////////////////------- Variação TOTAL ARRENDADOS  ENTRE 2011 E 2001 POR FREGUESIA -------------------////

var minVarTotArrendadosFreg11_01 = 999;
var maxVarTotArrendadosFreg11_01 = 0;

function CorVarArrendadosFreg11_01(d) {
    return d === null ? '#808080':
        d >= 100  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -100.1   ? '#2288bf' :
                ''  ;
}

var legendaVarArrendadosFreg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados de residência habitual, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -100 a -50' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotArrendadosFreg11_01(feature) {
    if(feature.properties.V_Tot11_01 <= minVarTotArrendadosFreg11_01){
        minVarTotArrendadosFreg11_01 = feature.properties.V_Tot11_01
    }
    if(feature.properties.V_Tot11_01 > maxVarTotArrendadosFreg11_01){
        maxVarTotArrendadosFreg11_01 = feature.properties.V_Tot11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarArrendadosFreg11_01(feature.properties.V_Tot11_01)};
    }


function apagarVarTotArrendadosFreg11_01(e) {
    VarTotArrendadosFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotArrendadosFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.V_Tot11_01.toFixed(2) + '%' + '</b>').openPopup() 
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotArrendadosFreg11_01,
    });
}
var VarTotArrendadosFreg11_01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloVarTotArrendadosFreg11_01,
    onEachFeature: onEachFeatureVarTotArrendadosFreg11_01
});

let slideVarTotArrendadosFreg11_01 = function(){
    var sliderVarTotArrendadosFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotArrendadosFreg11_01, {
        start: [minVarTotArrendadosFreg11_01, maxVarTotArrendadosFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotArrendadosFreg11_01,
            'max': maxVarTotArrendadosFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarTotArrendadosFreg11_01);
    inputNumberMax.setAttribute("value",maxVarTotArrendadosFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotArrendadosFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotArrendadosFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarTotArrendadosFreg11_01.noUiSlider.on('update',function(e){
        VarTotArrendadosFreg11_01.eachLayer(function(layer){
            if (!layer.feature.properties.V_Tot11_01){
                return false
            }
            if(layer.feature.properties.V_Tot11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_Tot11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotArrendadosFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderVarTotArrendadosFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarTotArrendadosFreg11_01);
} 

///////////////////////////// Fim daTOTAL ARRENDADOS POR FREGUESIA  entre 2011 e 2001POR FREGUESIA -------------- \\\\\

/////////////////////////////------- Variação MENOS 100€  ENTRE 2011 E 2001 POR FREGUESIA -------------------////

var minVarMenos100Freg11_01 = 999;
var maxVarMenos100Freg11_01 = 0;

function CorVarMenos100Freg11_01(d) {
    return d === null ? '#808080':
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -50  ? '#2288bf' :
        d >= -100.1   ? '#155273' :
                ''  ;
}

var legendaVarMenos100Freg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda inferior a 100€, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarMenos100Freg11_01(feature) {
    if(feature.properties.V_100_1101 <= minVarMenos100Freg11_01 || minVarMenos100Freg11_01 ===0){
        minVarMenos100Freg11_01 = feature.properties.V_100_1101
    }
    if(feature.properties.V_100_1101 > maxVarMenos100Freg11_01){
        maxVarMenos100Freg11_01 = feature.properties.V_100_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarMenos100Freg11_01(feature.properties.V_100_1101)};
    }


function apagarVarMenos100Freg11_01(e) {
    VarMenos100Freg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarMenos100Freg11_01(feature, layer) {
    if(feature.properties.V_100_1101 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_100_1101.toFixed(2) + '</b>' + '%').openPopup()
    }    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarMenos100Freg11_01,
    });
}
var VarMenos100Freg11_01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloVarMenos100Freg11_01,
    onEachFeature: onEachFeatureVarMenos100Freg11_01
});

let slideVarMenos100Freg11_01 = function(){
    var sliderVarMenos100Freg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarMenos100Freg11_01, {
        start: [minVarMenos100Freg11_01, maxVarMenos100Freg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarMenos100Freg11_01,
            'max': maxVarMenos100Freg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarMenos100Freg11_01);
    inputNumberMax.setAttribute("value",maxVarMenos100Freg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarMenos100Freg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarMenos100Freg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarMenos100Freg11_01.noUiSlider.on('update',function(e){
        VarMenos100Freg11_01.eachLayer(function(layer){
            if(layer.feature.properties.V_100_1101 == null){
                return false
            }
            if(layer.feature.properties.V_100_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_100_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarMenos100Freg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderVarMenos100Freg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarMenos100Freg11_01);
} 

///////////////////////////// Fim MENOS 100€ POR FREGUESIA  entre 2011 e 2001POR FREGUESIA -------------- \\\\\

/////////////////////////////------- Variação ENTRE 100 E 200  ENTRE 2011 E 2001 POR FREGUESIA -------------------////

var minVar100E199Freg11_01 = 999;
var maxVar100E199Freg11_01 = 0;

function CorVar200Freg11_01(d) {
    return d === null ? '#808080':
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -50  ? '#2288bf' :
        d >= -100.1   ? '#155273' :
                ''  ;
}

var legendaVar200Freg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda entre 100 e 199.99€, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar100E199Freg11_01(feature) {
    if(feature.properties.V_200_1101 <= minVar100E199Freg11_01){
        minVar100E199Freg11_01 = feature.properties.V_200_1101
    }
    if(feature.properties.V_200_1101 > maxVar100E199Freg11_01){
        maxVar100E199Freg11_01 = feature.properties.V_200_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar200Freg11_01(feature.properties.V_200_1101)};
    }


function apagarVar100E199Freg11_01(e) {
    Var100E199Freg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar100E199Freg11_01(feature, layer) {
    if(feature.properties.V_200_1101 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_200_1101.toFixed(2) + '</b>' + '%').openPopup()
    }    
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar100E199Freg11_01,
    });
}
var Var100E199Freg11_01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloVar100E199Freg11_01,
    onEachFeature: onEachFeatureVar100E199Freg11_01
});

let slideVar100E199Freg11_01 = function(){
    var sliderVar100E199Freg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar100E199Freg11_01, {
        start: [minVar100E199Freg11_01, maxVar100E199Freg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar100E199Freg11_01,
            'max': maxVar100E199Freg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVar100E199Freg11_01);
    inputNumberMax.setAttribute("value",maxVar100E199Freg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar100E199Freg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar100E199Freg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVar100E199Freg11_01.noUiSlider.on('update',function(e){
        Var100E199Freg11_01.eachLayer(function(layer){
            if(layer.feature.properties.V_200_1101 == null){
                return false
            }
            if(layer.feature.properties.V_200_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_200_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar100E199Freg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderVar100E199Freg11_01.noUiSlider;
    $(slidersGeral).append(sliderVar100E199Freg11_01);
} 

///////////////////////////// Fim ENTRE 100 E 200 POR FREGUESIA  entre 2011 e 2001POR FREGUESIA -------------- \\\\\

/////////////////////////////------- Variação ENTRE 200 E 400  ENTRE 2011 E 2001 POR FREGUESIA -------------------////

var minVar200E399Freg11_01 = 999;
var maxVar200E399Freg11_01 = 0;

function CorVar400Freg11_01(d) {
    return d === null ? '#808080':
        d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >=  0  ? '#f5b3be' :
        d >= -33.34   ? '#9eaad7' :
                ''  ;
}

var legendaVar400Freg11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de alojamentos arrendados com valor de renda entre 200 e 399.99€, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -33.34 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar200E399Freg11_01(feature) {
    if(feature.properties.V_400_1101 <= minVar200E399Freg11_01 ){
        minVar200E399Freg11_01 = feature.properties.V_400_1101
    }
    if(feature.properties.V_400_1101 > maxVar200E399Freg11_01){
        maxVar200E399Freg11_01 = feature.properties.V_400_1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar400Freg11_01(feature.properties.V_400_1101)};
    }


function apagarVar200E399Freg11_01(e) {
    Var200E399Freg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar200E399Freg11_01(feature, layer) {
    if(feature.properties.V_400_1101 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.V_400_1101.toFixed(2) + '</b>' + '%').openPopup()
    }   
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar200E399Freg11_01,
    });
}
var Var200E399Freg11_01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloVar200E399Freg11_01,
    onEachFeature: onEachFeatureVar200E399Freg11_01
});

let slideVar200E399Freg11_01 = function(){
    var sliderVar200E399Freg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 66){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar200E399Freg11_01, {
        start: [minVar200E399Freg11_01, maxVar200E399Freg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar200E399Freg11_01,
            'max': maxVar200E399Freg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVar200E399Freg11_01);
    inputNumberMax.setAttribute("value",maxVar200E399Freg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar200E399Freg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar200E399Freg11_01.noUiSlider.set([null, this.value]);
    });
    sliderVar200E399Freg11_01.noUiSlider.on('update',function(e){
        Var200E399Freg11_01.eachLayer(function(layer){
            if(layer.feature.properties.V_400_1101 == null){
                return false
            }
            if(layer.feature.properties.V_400_1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.V_400_1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar200E399Freg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 66;
    sliderAtivo = sliderVar200E399Freg11_01.noUiSlider;
    $(slidersGeral).append(sliderVar200E399Freg11_01);
} 

///////////////////////////// Fim ENTRE 200 E 400 POR FREGUESIA  entre 2011 e 2001POR FREGUESIA -------------- \\\\\





/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotalArrendadosConc01;
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
    if (layer == TotalArrendadosConc01 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual, em 2001, por concelho.' + '</strong>');
        legenda(maxTotalArrendadosConc01, ((maxTotalArrendadosConc01-minTotalArrendadosConc01)/2).toFixed(0),minTotalArrendadosConc01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalArrendadosConc01();
        naoDuplicar = 1;
    }
    if (layer == TotalArrendadosConc01 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual, em 2001, por concelho.' + '</strong>');
    }
    if (layer == TotalArrendadosConc01 && naoDuplicar == 1){
        contorno.addTo(map);
    }
    if (layer == Menos100Conc01 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda inferior a 100€, em 2001, por concelho.' + '</strong>');
        legenda(maxMenos100Conc01, ((maxMenos100Conc01-minMenos100Conc01)/2).toFixed(0),minMenos100Conc01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideMenos100Conc01();
        naoDuplicar = 2;
    }
    if (layer == Entre100e199Conc01 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 100 e 199.99€, em 2001, por concelho.' + '</strong>');
        legenda(maxEntre100e199Conc01, ((maxEntre100e199Conc01-minEntre100e199Conc01)/2).toFixed(0),minEntre100e199Conc01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEntre100e199Conc01();
        naoDuplicar = 3;
    }
    if (layer == Entre200e399Conc01 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 200 e 399.99€, em 2001, por concelho.' + '</strong>');
        legenda(maxEntre200e399Conc01, ((maxEntre200e399Conc01-minEntre200e399Conc01)/2).toFixed(0),minEntre200e399Conc01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEntre200e399Conc01();
        naoDuplicar = 4;
    }
    if (layer == Mais400Conc01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda superior a 400€, em 2001, por concelho.' + '</strong>');
        legenda(maxMais400Conc01, ((maxMais400Conc01-minMais400Conc01)/2).toFixed(0),minMais400Conc01,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideMais400Conc01();
        naoDuplicar = 5;
    }
    if (layer == TotalArrendadosConc11 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual, em 2011, por concelho.' + '</strong>');
        legenda(maxTotalArrendadosConc11, ((maxTotalArrendadosConc11-minTotalArrendadosConc11)/2).toFixed(0),minTotalArrendadosConc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalArrendadosConc11();
        naoDuplicar = 6;
    }
    if (layer == TotalArrendadosConc11 && naoDuplicar == 6){
        contorno.addTo(map);
        baseAtiva = contorno;
    }
    if (layer == Menos100Conc11 && naoDuplicar != 7){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda inferior a 100€, em 2011, por concelho.' + '</strong>');
        legenda(maxMenos100Conc11, ((maxMenos100Conc11-minMenos100Conc11)/2).toFixed(0),minMenos100Conc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideMenos100Conc11();
        naoDuplicar = 7;
    }
    if (layer == Entre100e199Conc11 && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 100 e 199.99€, em 2011, por concelho.' + '</strong>');
        legenda(maxEntre100e199Conc11, ((maxEntre100e199Conc11-minEntre100e199Conc11)/2).toFixed(0),minEntre100e199Conc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEntre100e199Conc11();
        naoDuplicar = 8;
    }
    if (layer == Entre200e399Conc11 && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 200 e 399.99€, em 2011, por concelho.' + '</strong>');
        legenda(maxEntre200e399Conc11, ((maxEntre200e399Conc11-minEntre200e399Conc11)/2).toFixed(0),minEntre200e399Conc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEntre200e399Conc11();
        naoDuplicar = 9;
    }
    if (layer == Entre400e649Conc11 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 400 e 649.99€, em 2011, por concelho.' + '</strong>');
        legenda(maxEntre400e649Conc11, ((maxEntre400e649Conc11-minEntre400e649Conc11)/2).toFixed(0),minEntre400e649Conc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEntre400e649Conc11();
        naoDuplicar = 10;
    }
    if (layer == Mais650Conc11 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda superior a 650€, em 2011, por concelho.' + '</strong>');
        legenda(maxMais650Conc11, ((maxMais650Conc11-minMais650Conc11)/2).toFixed(0),minMais650Conc11,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideMais650Conc11();
        naoDuplicar = 11;
    }
    if (layer == TotalArrendadosConc21 && naoDuplicar != 12){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual, em 2021, por concelho.' + '</strong>');
        legenda(maxTotalArrendadosConc21, ((maxTotalArrendadosConc21-minTotalArrendadosConc21)/2).toFixed(0),minTotalArrendadosConc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalArrendadosConc21();
        naoDuplicar = 12;
    }
    if (layer == TotalArrendadosConc21 && naoDuplicar == 12){
        contorno.addTo(map);
        baseAtiva = contorno;
    }
    if (layer == Menos100Conc21 && naoDuplicar != 13){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda inferior a 100€, em 2021, por concelho.' + '</strong>');
        legenda(maxMenos100Conc21, ((maxMenos100Conc21-minMenos100Conc21)/2).toFixed(0),minMenos100Conc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideMenos100Conc21();
        naoDuplicar = 13;
    }
    if (layer == Entre100e199Conc21 && naoDuplicar != 14){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 100 e 199.99€, em 2021, por concelho.' + '</strong>');
        legenda(maxEntre100e199Conc21, ((maxEntre100e199Conc21-minEntre100e199Conc21)/2).toFixed(0),minEntre100e199Conc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEntre100e199Conc21();
        naoDuplicar = 14;
    }
    if (layer == Entre200e399Conc21 && naoDuplicar != 15){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 200 e 399.99€, em 2021, por concelho.' + '</strong>');
        legenda(maxEntre200e399Conc21, ((maxEntre200e399Conc21-minEntre200e399Conc21)/2).toFixed(0),minEntre200e399Conc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEntre200e399Conc21();
        naoDuplicar = 15;
    }
    if (layer == Entre400e649Conc21 && naoDuplicar != 16){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 400 e 649.99€, em 2021, por concelho.' + '</strong>');
        legenda(maxEntre400e649Conc21, ((maxEntre400e649Conc21-minEntre400e649Conc21)/2).toFixed(0),minEntre400e649Conc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEntre400e649Conc21();
        naoDuplicar = 16;
    }
    if (layer == Entre650e999Conc21 && naoDuplicar != 17){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 650 e 999.99€, em 2021, por concelho.' + '</strong>');
        legenda(maxEntre650e999Conc21,((maxEntre650e999Conc21-minEntre650e999Conc21)/2).toFixed(0),minEntre650e999Conc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEntre650e999Conc21();
        naoDuplicar = 17;
    }
    if (layer == Mais1000Conc21 && naoDuplicar != 18){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda superior a 1000€, em 2021, por concelho.' + '</strong>');
        legenda(maxMais1000Conc21, ((maxMais1000Conc21-minMais1000Conc21)/2).toFixed(0),minMais1000Conc21,0.2);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideMais1000Conc21();
        naoDuplicar = 18;
    }
    if (layer == TotalArrendadosFreg01 && naoDuplicar != 19){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual, em 2001, por freguesia.' + '</strong>');
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        legenda(maxTotalArrendadosFreg01, ((maxTotalArrendadosFreg01-minTotalArrendadosFreg01)/2).toFixed(0),minTotalArrendadosFreg01,0.25);
        slideTotalArrendadosFreg01();
        naoDuplicar = 19;
    }
    if (layer == TotalArrendadosFreg01 && naoDuplicar == 19){
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
    }
    if (layer == Menos100Freg01 && naoDuplicar != 20){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda inferior a 100€, em 2001, por freguesia.' + '</strong>');
        legenda(maxMenos100Freg01, ((maxMenos100Freg01-minMenos100Freg01)/2).toFixed(0),minMenos100Freg01,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideMenos100Freg01();
        naoDuplicar = 20;
    }
    if (layer == Entre100e199Freg01 && naoDuplicar != 21){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 100 e 199.99€, em 2001, por freguesia.' + '</strong>');
        legenda(maxEntre100e199Freg01, ((maxEntre100e199Freg01-minEntre100e199Freg01)/2).toFixed(0),minEntre100e199Freg01,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEntre100e199Freg01();
        naoDuplicar = 21;
    }
    if (layer == Entre200e399Freg01 && naoDuplicar != 22){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 200 e 399.99€, em 2001, por freguesia.' + '</strong>');
        legenda(maxEntre200e399Freg01, ((maxEntre200e399Freg01-minEntre200e399Freg01)/2).toFixed(0),minEntre200e399Freg01,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEntre200e399Freg01();
        naoDuplicar = 22;
    }
    if (layer == Mais400Freg01 && naoDuplicar != 23){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de superior a 400€, em 2001, por freguesia.' + '</strong>');
        legenda(maxMais400Freg01, ((maxMais400Freg01-minMais400Freg01)/2).toFixed(0),minMais400Freg01,0.8);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideMais400Freg01();
        naoDuplicar = 23;
    }
    if (layer == TotalArrendadosFreg11 && naoDuplicar != 24){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual, em 2011, por freguesia.' + '</strong>');
        legenda(maxTotalArrendadosFreg11, ((maxTotalArrendadosFreg11-minTotalArrendadosFreg11)/2).toFixed(0),minTotalArrendadosFreg11,0.25);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideTotalArrendadosFreg11();
        naoDuplicar = 24;
    }
    if (layer == Menos100Freg11 && naoDuplicar != 25){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda inferior a 100€, em 2011, por freguesia.' + '</strong>');
        legenda(maxMenos100Freg11, ((maxMenos100Freg11-minMenos100Freg11)/2).toFixed(0),minMenos100Freg11,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideMenos100Freg11();
        naoDuplicar = 25;
    }
    if (layer == Entre100e199Freg11 && naoDuplicar != 26){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 100 e 199.99€, em 2011, por freguesia.' + '</strong>');
        legenda(maxEntre100e199Freg11, ((maxEntre100e199Freg11-minEntre100e199Freg11)/2).toFixed(0),minEntre100e199Freg11,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEntre100e199Freg11();
        naoDuplicar = 26;
    }
    if (layer == Entre200e399Freg11 && naoDuplicar != 27){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 200 e 399.99€, em 2011, por freguesia.' + '</strong>');
        legenda(maxEntre200e399Freg11, ((maxEntre200e399Freg11-minEntre200e399Freg11)/2).toFixed(0),minEntre200e399Freg11,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEntre200e399Freg11();
        naoDuplicar = 27;
    }
    if (layer == Entre400e649Freg11 && naoDuplicar != 28){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 400 e 649.99€, em 2011, por freguesia.' + '</strong>');
        legenda(maxEntre400e649Freg11,((maxEntre400e649Freg11-minEntre400e649Freg11)/2).toFixed(0),minEntre400e649Freg11,0.35);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideEntre400e649Freg11();
        naoDuplicar = 28;
    }
    if (layer == Mais650Freg11 && naoDuplicar != 29){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda superior a 650€, em 2011, por freguesia.' + '</strong>');
        legenda(maxMais650Freg11,((maxMais650Freg11-minMais650Freg11)/2).toFixed(0),minMais650Freg11,0.8);
        contornoFreg2001.addTo(map);
        baseAtiva = contornoFreg2001;
        slideMais650Freg11();
        naoDuplicar = 29;
    }
    if (layer == TotalArrendadosFreg21 && naoDuplicar != 30){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual, em 2021, por freguesia.' + '</strong>');
        legenda(maxTotalArrendadosFreg21, ((maxTotalArrendadosFreg21-minTotalArrendadosFreg21)/2).toFixed(0),minTotalArrendadosFreg21,0.25);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalArrendadosFreg21();
        naoDuplicar = 30;
    }
    if (layer == Menos100Freg21 && naoDuplicar != 31){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda inferior a 100€, em 2021, por freguesia.' + '</strong>');
        legenda(maxMenos100Freg21, ((maxMenos100Freg21-minMenos100Freg21)/2).toFixed(0),minMenos100Freg21,0.35);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideMenos100Freg21();
        naoDuplicar = 31;
    }
    if (layer == Entre100e199Freg21 && naoDuplicar != 32){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 100 e 199.99€, em 2021, por freguesia.' + '</strong>');
        legenda(maxEntre100e199Freg21, ((maxEntre100e199Freg21-minEntre100e199Freg21)/2).toFixed(0),minEntre100e199Freg21,0.35);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEntre100e199Freg21();
        naoDuplicar = 32;
    }
    if (layer == Entre200e399Freg21 && naoDuplicar != 33){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 200 e 399.99€, em 2021, por freguesia.' + '</strong>');
        legenda(maxEntre200e399Freg21, ((maxEntre200e399Freg21-minEntre200e399Freg21)/2).toFixed(0),minEntre200e399Freg21,0.35);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEntre200e399Freg21();
        naoDuplicar = 33;
    }
    if (layer == Entre400e649Freg21 && naoDuplicar != 34){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 400 e 649.99€, em 2021, por freguesia.' + '</strong>');
        legenda(maxEntre400e649Freg21,((maxEntre400e649Freg21-minEntre400e649Freg21)/2).toFixed(0),minEntre400e649Freg21,0.35);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEntre400e649Freg21();
        naoDuplicar = 34;
    }
    if (layer == Entre650e999Freg21 && naoDuplicar != 35){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda entre 650 e 999.99€, em 2021, por freguesia.' + '</strong>');
        legenda(maxEntre650e999Freg21,((maxEntre650e999Freg21-minEntre650e999Freg21)/2).toFixed(0),minEntre650e999Freg21,0.35);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEntre650e999Freg21();
        naoDuplicar = 35;
    }
    if (layer == Mais1000Freg21 && naoDuplicar != 36){
        $('#tituloMapa').html('<strong>' + 'Número de alojamentos familiares clássicos arrendados de residência habitual com valor de renda superior a 1000€, em 2011, por freguesia.' + '</strong>');
        legenda(maxMais1000Freg21,((maxMais1000Freg21-minMais1000Freg21)/2).toFixed(0),minMais1000Freg21,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideMais1000Freg21();
        naoDuplicar = 36;
    }
    if (layer == RendaBaixaCon01 && naoDuplicar != 37){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda baixa, em 2001, por concelho.' + '</strong>');
        legendaPerRendaBaixaConc();
        slideRendaBaixaCon01();
        naoDuplicar = 37;
    }
    if (layer == RendaMediaCon01 && naoDuplicar != 38){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda média, em 2001, por concelho.' + '</strong>');
        legendaPerRendaMediaConc();
        slideRendaMediaCon01();
        naoDuplicar = 38;
    }
    if (layer == RendaBaixaCon11 && naoDuplicar != 39){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda baixa, em 2011, por concelho.' + '</strong>');
        legendaPerRendaBaixaConc();
        slideRendaBaixaCon11();
        naoDuplicar = 39;
    }
    if (layer == RendaMediaCon11 && naoDuplicar != 40){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda média, em 2011, por concelho.' + '</strong>');
        legendaPerRendaMediaConc();
        slideRendaMediaCon11();
        naoDuplicar = 40;
    }
    if (layer == RendaAltaCon11 && naoDuplicar != 41){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda alta, em 2011, por concelho.' + '</strong>');
        legendaPerRendaAltaConc();
        slideRendaAltaCon11();
        naoDuplicar = 41;
    }
    if (layer == RendaBaixaCon21 && naoDuplicar != 42){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda baixa, em 2021, por concelho.' + '</strong>');
        legendaPerRendaBaixaConc();
        slideRendaBaixaCon21();
        naoDuplicar = 42;
    }
    if (layer == RendaMediaCon21 && naoDuplicar != 43){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda média, em 2021, por concelho.' + '</strong>');
        legendaPerRendaMediaConc();
        slideRendaMediaCon21();
        naoDuplicar = 43;
    }
    if (layer == RendaAltaCon21 && naoDuplicar != 44){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda alta, em 2021, por concelho.' + '</strong>');
        legendaPerRendaAltaConc();
        slideRendaAltaCon21();
        naoDuplicar = 44;
    }
    if (layer == RendaBaixaFreg01 && naoDuplicar != 45){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda baixa, em 2001, por freguesia.' + '</strong>');
        legendaPerRendaBaixaFreg();
        slideRendaBaixaFreg01();
        naoDuplicar = 45;
    }
    if (layer == RendaMediaFreg01 && naoDuplicar != 46){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda média, em 2001, por freguesia.' + '</strong>');
        legendaPerRendaMediaFreg();
        slideRendaMediaFreg01();
        naoDuplicar = 46;
    }
    if (layer == RendaBaixaFreg11 && naoDuplicar != 47){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda baixa, em 2011, por freguesia.' + '</strong>');
        legendaPerRendaBaixaFreg();
        slideRendaBaixaFreg11();
        naoDuplicar = 47;
    }
    if (layer == RendaMediaFreg11 && naoDuplicar != 48){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda média, em 2011, por freguesia.' + '</strong>');
        legendaPerRendaMediaFreg();
        slideRendaMediaFreg11();
        naoDuplicar = 48;
    }
    if (layer == RendaAltaFreg11 && naoDuplicar != 49){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda alta, em 2011, por freguesia.' + '</strong>');
        legendaPerRendaAltaFreg();
        slideRendaAltaFreg11();
        naoDuplicar = 49;
    }
    if (layer == RendaBaixaFreg21 && naoDuplicar != 50){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda baixa, em 2021, por freguesia.' + '</strong>');
        legendaPerRendaBaixaFreg();
        slideRendaBaixaFreg21();
        naoDuplicar = 50;
    }
    if (layer == RendaMediaFreg21 && naoDuplicar != 51){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda média, em 2021, por freguesia.' + '</strong>');
        legendaPerRendaMediaFreg();
        slideRendaMediaFreg21();
        naoDuplicar = 51;
    }
    if (layer == RendaAltaFreg21 && naoDuplicar != 52){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares clássicos arrendados de residência habitual com renda alta, em 2021, por freguesia.' + '</strong>');
        legendaPerRendaAltaFreg();
        slideRendaAltaFreg21();
        naoDuplicar = 52;
    }
    if (layer == VarTotArrendadosConc11_01 && naoDuplicar != 53){
        legendaVarArrendadosConc11_01();        
        slideVarTotArrendadosConc11_01();
        naoDuplicar = 53;
    }
    if (layer == VarMenos100E11_01 && naoDuplicar != 54){
        legendaVarMenos100Conc11_01();        
        slideVarMenos100E11_01();
        naoDuplicar = 54;
    }
    if (layer == Var100A199E11_01 && naoDuplicar != 55){
        legendaVar200Conc11_01();        
        slideVar100A199E11_01();
        naoDuplicar = 55;
    }
    if (layer == Var200A399E11_01 && naoDuplicar != 56){
        legendaVar400Conc11_01();        
        slideVar200A399E11_01();
        naoDuplicar = 56;
    }
    if (layer == VarTotArrendadosConc21_11 && naoDuplicar != 57){
        legendaVarArrendadosConc21_11();        
        slideVarTotArrendadosConc21_11();
        naoDuplicar = 57;
    }
    if (layer == VarMenos100E21_11 && naoDuplicar != 58){
        legendaVarMenos100Conc21_11();        
        slideVarMenos100E21_11();
        naoDuplicar = 58;
    }
    if (layer == Var100A199E21_11 && naoDuplicar != 59){
        legendaVar200Conc21_11();        
        slideVar100A199E21_11();
        naoDuplicar = 59;
    }
    if (layer == Var200A399E21_11 && naoDuplicar != 60){
        legendaVar400Conc21_11();        
        slideVar200A399E21_11();
        naoDuplicar = 60;
    }
    if (layer == Var400A649E21_11 && naoDuplicar != 61){
        legendaVar649Conc21_11();        
        slideVar400A649E21_11();
        naoDuplicar = 61;
    }
    if (layer == VarMais650E21_11 && naoDuplicar != 62){
        legendaVar650Conc21_11();        
        slideVarMais650E21_11();
        naoDuplicar = 62;
    }
    if (layer == VarTotArrendadosFreg11_01 && naoDuplicar != 63){
        legendaVarArrendadosFreg11_01();        
        slideVarTotArrendadosFreg11_01();
        naoDuplicar = 63;
    }
    if (layer == VarMenos100Freg11_01 && naoDuplicar != 64){
        legendaVarMenos100Freg11_01();        
        slideVarMenos100Freg11_01();
        naoDuplicar = 64;
    }
    if (layer == Var100E199Freg11_01 && naoDuplicar != 65){
        legendaVar200Freg11_01();        
        slideVar100E199Freg11_01();
        naoDuplicar = 65;
    }
    if (layer == Var200E399Freg11_01 && naoDuplicar != 66){
        legendaVar400Freg11_01();        
        slideVar200E399Freg11_01();
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
    condicionantes();
    if ($('#concelho').hasClass('active2')){
        if ($('#absoluto').hasClass('active4')){
            if (ano == "2001"){
                if (escalao == "Total"){
                    novaLayer(TotalArrendadosConc01);
                } 
                if (escalao == "100"){
                    novaLayer(Menos100Conc01)
                }
                if (escalao == "200"){
                    novaLayer(Entre100e199Conc01)
                }
                if (escalao == "399"){
                    novaLayer(Entre200e399Conc01)
                }
                if (escalao == "400"){
                    novaLayer(Mais400Conc01)
                }
            }
            if (ano == "2011"){
                if (escalao == "Total"){
                    novaLayer(TotalArrendadosConc11);
                }
                if (escalao == "100"){
                    novaLayer(Menos100Conc11)
                }
                if (escalao == "200"){
                    novaLayer(Entre100e199Conc11)
                }
                if (escalao == "399"){
                    novaLayer(Entre200e399Conc11)
                }
                if (escalao == "400"){
                    novaLayer(Entre400e649Conc11)
                }
                if (escalao == "650"){
                    novaLayer(Mais650Conc11)
                }
            }
            if (ano == "2021"){
                if (escalao == "Total"){
                    novaLayer(TotalArrendadosConc21)
                }
                if (escalao == "100"){
                    novaLayer(Menos100Conc21)
                }
                if (escalao == "200"){
                    novaLayer(Entre100e199Conc21)
                }
                if (escalao == "399"){
                    novaLayer(Entre200e399Conc21)
                }
                if (escalao == "400"){
                    novaLayer(Entre400e649Conc21)
                }
                if (escalao == "650"){
                    novaLayer(Entre650e999Conc21)
                }
                if (escalao == "1000"){
                    novaLayer(Mais1000Conc21)
                }
            }
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if (ano == "2001"){
                if (escalao == "Total"){
                    novaLayer(VarTotArrendadosConc11_01)
                }
                if (escalao == "100"){
                    novaLayer(VarMenos100E11_01);
                }
                if (escalao == "200"){
                    novaLayer(Var100A199E11_01);
                }
                if (escalao == "399"){
                    novaLayer(Var200A399E11_01);
                }
            }
            if (ano == "2011"){
                if (escalao == "Total"){
                    novaLayer(VarTotArrendadosConc21_11)
                }
                if (escalao == "100"){
                    novaLayer(VarMenos100E21_11)
                }
                if (escalao == "200"){
                    novaLayer(Var100A199E21_11)
                }
                if (escalao == "399"){
                    novaLayer(Var200A399E21_11)
                }
                if (escalao == "400"){
                    novaLayer(Var400A649E21_11)
                }
                if (escalao == "650"){
                    novaLayer(VarMais650E21_11)
                }
            }
        }
        if ($('#percentagem').hasClass('active4')){
            if (escalao == "Baixa"){
                notaRodape('<strong>Considerou-se como renda baixa, o escalão do valor mensal de renda: menos de 100€ .</strong>')
            }
            if (escalao == "Media"){
                notaRodape('<strong>Considerou-se como renda média, os escalões do valor mensal de renda entre 100 e 649.99€ .</strong>')
            }
            if (escalao == "Alta"){
                notaRodape('<strong>Considerou-se como renda alta, os escalões do valor mensal de renda superior a 650€ .</strong>')
            }
            if (ano == "2001"){
                if (escalao == "Baixa"){
                    novaLayer(RendaBaixaCon01);
                }
                if (escalao == "Media"){
                    novaLayer(RendaMediaCon01);
                }
            }
            if (ano == "2011"){
                if (escalao == "Baixa"){
                    novaLayer(RendaBaixaCon11);
                }
                if (escalao == "Media"){
                    novaLayer(RendaMediaCon11);
                }
                if (escalao == "Alta"){
                    novaLayer(RendaAltaCon11);
                }
            }
            if (ano == "2021"){
                if (escalao == "Baixa"){
                    novaLayer(RendaBaixaCon21);
                }
                if (escalao == "Media"){
                    novaLayer(RendaMediaCon21);
                }
                if (escalao == "Alta"){
                    novaLayer(RendaAltaCon21);
                }
            }

        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#absoluto').hasClass('active5')){
            if (ano == "2001"){
                if (escalao == "Total"){
                    novaLayer(TotalArrendadosFreg01);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, apenas sendo possível comparar os dados totais dos vários anos.')
                } 
                if (escalao == "100"){
                    novaLayer(Menos100Freg01);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 400€.</strong>')
                }
                if (escalao == "200"){
                    novaLayer(Entre100e199Freg01);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 400€.</strong>')
                }
                if (escalao == "399"){
                    novaLayer(Entre200e399Freg01);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 400€.</strong>')
                }
                if (escalao == "400"){
                    novaLayer(Mais400Freg01);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os restantes dados.')
                }
            }
            if (ano == "2011"){
                if (escalao == "Total"){
                    novaLayer(TotalArrendadosFreg11);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, apenas sendo possível comparar os dados totais dos vários anos.')
                }
                if (escalao == "100"){
                    novaLayer(Menos100Freg11);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 650€.</strong>')
                }
                 if (escalao == "200"){
                    novaLayer(Entre100e199Freg11);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 650€.</strong>')
                }
                if (escalao == "399"){
                    novaLayer(Entre200e399Freg11);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 650€.</strong>')
                }
                if (escalao == "400"){
                    novaLayer(Entre400e649Freg11);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 650€.</strong>')
                }
                if (escalao == "650"){
                    novaLayer(Mais650Freg11);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os restantes dados.')
                }
            }
            if (ano == "2021"){
                if (escalao == "Total"){
                    novaLayer(TotalArrendadosFreg21);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, apenas sendo possível comparar os dados totais dos vários anos.')
                }
                if (escalao == "100"){
                    novaLayer(Menos100Freg21);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 1000€.</strong>')
                }
                if (escalao == "200"){
                    novaLayer(Entre100e199Freg21);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 1000€.</strong>')
                }
                if (escalao == "399"){
                    novaLayer(Entre200e399Freg21);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 1000€.</strong>')
                }
                if (escalao == "400"){
                    novaLayer(Entre400e649Freg21);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 1000€.</strong>')
                }
                if (escalao == "650"){
                    novaLayer(Entre650e999Freg21);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os dados absolutos à escala concelhia. Quanto à escala da freguesia, não é possível comparar com os dados totais e ao escalão de renda superior a 1000€.</strong>')
                }
                if (escalao == "1000"){
                    novaLayer(Mais1000Freg21);
                    notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção,  <strong>não devendo, assim, comparar com os restantes dados.')
                }
            }
        }
        if ($('#taxaVariacao').hasClass('active5')){
            if (ano == "2001"){
                if (escalao == "Total"){
                    novaLayer(VarTotArrendadosFreg11_01)
                }
                if (escalao == "100"){
                    novaLayer(VarMenos100Freg11_01);
                }
                if (escalao == "200"){
                    novaLayer(Var100E199Freg11_01);
                }
                if (escalao == "399"){
                    novaLayer(Var200E399Freg11_01);
                }
            }
        }
        if ($('#percentagem').hasClass('active5')){
            if (ano == "2001"){
                if (escalao == "Baixa"){
                    novaLayer(RendaBaixaFreg01);
                    notaRodape('<strong>Considerou-se como renda baixa, o escalão do valor mensal de renda: menos de 100€ .</strong>')
                }
                if (escalao == "Media"){
                    novaLayer(RendaMediaFreg01);
                    notaRodape('<strong>Considerou-se como renda média, os escalões do valor mensal de renda entre 100 e 649.99€ .</strong>')
                }
            }
            if (ano == "2011"){
                if (escalao == "Baixa"){
                    novaLayer(RendaBaixaFreg11);
                }
                if (escalao == "Media"){
                    novaLayer(RendaMediaFreg11);
                }
                if (escalao == "Alta"){
                    novaLayer(RendaAltaFreg11);
                }
            }
            if (ano == "2021"){
                if (escalao == "Baixa"){
                    novaLayer(RendaBaixaFreg21);
                }
                if (escalao == "Media"){
                    novaLayer(RendaMediaFreg21);
                }
                if (escalao == "Alta"){
                    novaLayer(RendaAltaFreg21);
                }
            }
        }
    }
}
function condicionantes(){
    var escalao = document.getElementById("opcaoSelect").value;
    var ano = document.getElementById("mySelect").value;
    if ($('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        if (ano == "2001"){
            $("#opcaoSelect option[value='Alta']").remove();
        }
        if (ano != "2001"){
            if ($("#opcaoSelect option[value='Alta']").length == 0){
                $('#opcaoSelect').append("<option value='Alta'>Renda Alta</option>");
            }
        }
        if (ano == "2011" || ano == "2021"){
            if (escalao == "Alta"){
                if ($("#mySelect option[value='2001']").length > 0){
                    $("#mySelect option[value='2001']").remove();
                }
            }
            if (escalao != "Alta"){
                if ($("#mySelect option[value='2001']").length == 0){
                    $("#mySelect option").eq(0).before($("<option></option>").val("2001").text("2001"));
                }
            }
        }
    }
    if ($('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5')){
        if (ano == "2001"){
            $("#opcaoSelect option[value='1000']").remove();
            $("#opcaoSelect option[value='650']").remove();
            $("#opcaoSelect option[value='400']").html("Mais de 400€");
            if (escalao == "400"){
                if ($("#mySelect option[value='2011']").length == 0){
                    $('#opcaoSelect').append("<option value='400'>Mais de 400€</option>");
                }
                $("#mySelect option[value='2021']").remove();
                $("#mySelect option[value='2011']").remove();
            }
            if (escalao != "400"){
                if ($("#mySelect option[value='2011']").length == 0 && $("#mySelect option[value='2021']").length == 0){
                    $('#mySelect').append("<option value='2011'>2011</option>");
                    $('#mySelect').append("<option value='2021'>2021</option>");
                }
            }

        }
        if (ano == "2011"){
            $("#opcaoSelect option[value='1000']").remove();
            $("#opcaoSelect option[value='400']").html("400 a 649.99€");
            $("#opcaoSelect option[value='650']").html("Mais de 650€");
            if ($("#opcaoSelect option[value='650']").length == 0){
                $('#opcaoSelect').append("<option value='650'>Mais de 650€</option>");
            }
            if (escalao == "400" || escalao == "650"){
                $("#mySelect option[value='2001']").remove();
                if (escalao == "650"){
                    $("#mySelect option[value='2021']").remove();
                }
            }
            if (escalao != "400" && escalao != "650"){
                if ($("#mySelect option[value='2001']").length == 0){
                    $("#mySelect option").eq(0).before($("<option></option>").val("2001").text("2001"));
                }
                if ($("#mySelect option[value='2021']").length == 0){
                    $('#mySelect').append("<option value='2021'>2021</option>");
                }
            }
        }
        if (ano == "2021"){
            $("#opcaoSelect option[value='400']").html("400 a 649.99€");
            $("#opcaoSelect option[value='650']").html("650 a 999.99€");
            if ($("#opcaoSelect option[value='1000']").length == 0){
                $('#opcaoSelect').append("<option value='1000'>Mais de 1000€</option>");
            }
            if (escalao == "650"|| escalao == "1000"){
                $("#mySelect option[value='2001']").remove();
                $("#mySelect option[value='2011']").remove();
            }
            if (escalao == "400"){
                if ($("#mySelect option[value='2011']").length == 0){
                    $("#mySelect option").eq(0).before($("<option></option>").val("2011").text("2011"));
                }
                $("#mySelect option[value='2001']").remove();
            }
            if (escalao != "650" && escalao != "1000" && escalao != "400"){
                if ($("#mySelect option[value='2001']").length == 0){
                    $("#mySelect option").eq(0).before($("<option></option>").val("2001").text("2001"));
                }
                if ($("#mySelect option[value='2011']").length == 0){
                    $("#mySelect option").eq(0).after($("<option></option>").val("2011").text("2011"));
                }
            }
        }
    }

    if ($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        if (ano == "2001"){
            $("#opcaoSelect option[value='400']").remove();
            $("#opcaoSelect option[value='650']").remove();
        }
        if (ano == "2011"){
            if ($("#opcaoSelect option[value='400']").length == 0){
                $('#opcaoSelect').append("<option value='400'>400 e 649.99€</option>");
            }
            if ($("#opcaoSelect option[value='650']").length == 0){
                $('#opcaoSelect').append("<option value='650'>Mais de 650€</option>");
            }
            if (escalao == "400" || escalao == "650"){
                $("#mySelect option[value='2001']").remove();
            }
            if (escalao != "400" && escalao != "650"){
                $("#mySelect option").eq(0).before($("<option></option>").val("2001").text("2011 - 2001"));
            }
        }
    }
}

function mudarEscala(){
    reporOpcoesPercentagem();
    tamanhoOutros();
    fonteTitulo('N');
}
let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Estatísticas de Rendas da Habitação ao nível local.' );
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Estatísticas de Rendas da Habitação ao nível local.' );
    }
}

let primeirovalor = function(ano,opcao){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(opcao);

}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let reporAnos = function(){
    $('#mySelect').empty();
    if ($('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5') || $('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        $('#mySelect').append("<option value='2001'>2001</option>");
        $('#mySelect').append("<option value='2011'>2011</option>");
        $('#mySelect').append("<option value='2021'>2021</option>");
    }
    if ($('#taxaVariacao').hasClass('active4')){
        $('#mySelect').append("<option value='2001'>2011 - 2001</option>");
        $('#mySelect').append("<option value='2011'>2021 - 2011</option>");
    }
    if ($('#taxaVariacao').hasClass('active5')){
        $('#mySelect').append("<option value='2001'>2011 - 2001</option>");
    }
}
let reporOpcoesPercentagem = function(){
    reporAnos();
    $('#opcaoSelect').empty();
    if ($('#taxaVariacao').hasClass('active5') || $('#taxaVariacao').hasClass('active4') || $('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5')){
        $('#opcaoSelect').append("<option value='Total'>Total</option>");
        $('#opcaoSelect').append("<option value='100'>Menos de 100€</option>");
        $('#opcaoSelect').append("<option value='200'>100 a 199.99€</option>");
        $('#opcaoSelect').append("<option value='399'>200 a 399.99€</option>");
        $('#opcaoSelect').append("<option value='400'>Mais de 400€</option>");
        primeirovalor('2001','Total');
    }
    if ($('#percentagem').hasClass('active5') || $('#percentagem').hasClass('active4')){
        $('#opcaoSelect').append("<option value='Baixa'>Renda Baixa</option>");
        $('#opcaoSelect').append("<option value='Media'>Renda Média</option>");
        $('#opcaoSelect').append("<option value='Alta'>Renda Alta</option>");
        primeirovalor('2001','Baixa');
    }
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
        $('#taxaVariacao').attr('class',"butao");
        $('#percentagem').attr('class',"butao");
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
    $('#tituloMapa').html('Número de alojamentos familiares clássicos arrendados de residência habitual, segundo o escalão do valor mensal de renda da habitação, entre 2001 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EncargoMensalProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Encargos == "Mais de 1000€"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Encargos+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2021.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Encargos+'</td>';
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
    $('#tituloMapa').html('Proporção do número de alojamentos familiares clássicos arrendados de residência habitual, segundo o escalão do valor mensal de renda da habitação, entre 2001 e 2021, %.')
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EncargoMensalProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html("2001")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Encargos == "Mais de 1000€"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Encargos+'</td>';
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                    dados += '<td class="borderbottom">'+value.Per21+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Encargos+'</td>';
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
    $('#tituloMapa').html('Variação do número de alojamentos familiares clássicos arrendados de residência habitual, segundo o escalão do valor mensal de renda da habitação, entre 2001 e 2021, %.')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EncargoMensalProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Encargos == "Mais de 1000€"  || containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Encargos+'</td>';
                    dados += '<td class="borderbottom">'+ ''+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR1101+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR2111+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Encargos+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.VAR1101+'</td>';
                    dados += '<td>'+value.VAR2111+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});
function avancarI(){
    let ano = document.getElementById("mySelect").value;
    if (ano == "2011"){
        if ($("#mySelect option[value='2001']").length == 0){
            i = 0
        }
        else{
            i = 1
        }
    }
    if (ano == "2021"){
        i = 2;
    }
    if (ano == "2001"){
        i = 0;
    }
}
let anosSelecionados = function() {
    let ano = document.getElementById("mySelect").value;
    var escalao = document.getElementById("opcaoSelect").value;
    if ($('#freguesias').hasClass("active2") || $('#concelho').hasClass("active2")){
        avancarI();
    }
    if ($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        if (ano == "2011"){
            i = 1;
        }
        if (ano == "2001"){
            i = 0;
        }
    }  
    if ($('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        if (escalao == "Alta"){
            if (ano == "2011"){
                i = 0;
            }
            if (ano == "2021"){
                i = 1;
            }
        }
        if (escalao != "Alta"){
            avancarI();
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
    event.target.style.width = `${tempSelectWidth +15}px`;
    tempSelect.remove();
});
     
alterarTamanho.dispatchEvent(new Event('change'));
