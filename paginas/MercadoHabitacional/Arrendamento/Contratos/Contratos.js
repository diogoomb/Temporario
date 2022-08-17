
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'


$('#tituloMapa').css('font-size','9pt')
var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Estatísticas de Rendas da Habitação ao nível local.';

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
    var titulo = 'Número de contratos'
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

///////////////////////////----------------------- DADOS RELATIVOS, CONCELHO--------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PREÇOS 2 SEMESTRE 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minContrato2Semestre17Conc = 0;
var maxContrato2Semestre17Conc = 0;


function estiloContrato2Semestre17Conc(feature, latlng) {
    if(feature.properties.Con_2Sem17< minContrato2Semestre17Conc || minContrato2Semestre17Conc ===0){
        minContrato2Semestre17Conc = feature.properties.Con_2Sem17
    }
    if(feature.properties.Con_2Sem17> maxContrato2Semestre17Conc){
        maxContrato2Semestre17Conc = feature.properties.Con_2Sem17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Con_2Sem17,0.6)
    });
}
function apagarContrato2Semestre17Conc(e){
    var layer = e.target;
    Contrato2Semestre17Conc.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato2Semestre17Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Novos contratos de arrendamento:  ' + '<b>' +feature.properties.Con_2Sem17 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato2Semestre17Conc,
    })
};

var Contrato2Semestre17Conc= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloContrato2Semestre17Conc,
    onEachFeature: onEachFeatureContrato2Semestre17Conc,
});

var legenda = function(maximo,medio,minimo, multiplicador) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'center'
    var symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = 'Número de contratos'
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




var slideContrato2Semestre17Conc = function(){
    var sliderContrato2Semestre17Conc = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato2Semestre17Conc, {
        start: [minContrato2Semestre17Conc, maxContrato2Semestre17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato2Semestre17Conc,
            'max': maxContrato2Semestre17Conc
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato2Semestre17Conc);
    inputNumberMax.setAttribute("value",maxContrato2Semestre17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato2Semestre17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato2Semestre17Conc.noUiSlider.set([null, this.value]);
    });

    sliderContrato2Semestre17Conc.noUiSlider.on('update',function(e){
        Contrato2Semestre17Conc.eachLayer(function(layer){
            if(layer.feature.properties.Con_2Sem17>=parseFloat(e[0])&& layer.feature.properties.Con_2Sem17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato2Semestre17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderContrato2Semestre17Conc.noUiSlider;
    $(slidersGeral).append(sliderContrato2Semestre17Conc);
}
contorno.addTo(map)
Contrato2Semestre17Conc.addTo(map);
$('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2017, por concelho.' + '</strong>');
legenda(maxContrato2Semestre17Conc, ((maxContrato2Semestre17Conc-minContrato2Semestre17Conc)/2).toFixed(0),minContrato2Semestre17Conc,0.6);
slideContrato2Semestre17Conc();

///////////////////////////-------------------- FIM PREÇOS 2 SEMESTRE 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PREÇOS 1 SEMESTRE 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minContrato1Semestre18Conc = 0;
var maxContrato1Semestre18Conc = 0;
function estiloContrato1Semestre18Conc(feature, latlng) {
    if(feature.properties.Con_1Sem18< minContrato1Semestre18Conc || minContrato1Semestre18Conc ===0){
        minContrato1Semestre18Conc = feature.properties.Con_1Sem18
    }
    if(feature.properties.Con_1Sem18> maxContrato1Semestre18Conc){
        maxContrato1Semestre18Conc = feature.properties.Con_1Sem18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Con_1Sem18,0.6)
    });
}
function apagarContrato1Semestre18Conc(e){
    var layer = e.target;
    Contrato1Semestre18Conc.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato1Semestre18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Novos contratos de arrendamento:  ' + '<b>' +feature.properties.Con_1Sem18 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato1Semestre18Conc,
    })
};

var Contrato1Semestre18Conc= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloContrato1Semestre18Conc,
    onEachFeature: onEachFeatureContrato1Semestre18Conc,
});

var slideContrato1Semestre18Conc = function(){
    var sliderContrato1Semestre18Conc = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato1Semestre18Conc, {
        start: [minContrato1Semestre18Conc, maxContrato1Semestre18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato1Semestre18Conc,
            'max': maxContrato1Semestre18Conc
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato1Semestre18Conc);
    inputNumberMax.setAttribute("value",maxContrato1Semestre18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato1Semestre18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato1Semestre18Conc.noUiSlider.set([null, this.value]);
    });

    sliderContrato1Semestre18Conc.noUiSlider.on('update',function(e){
        Contrato1Semestre18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Con_1Sem18>=parseFloat(e[0])&& layer.feature.properties.Con_1Sem18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato1Semestre18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderContrato1Semestre18Conc.noUiSlider;
    $(slidersGeral).append(sliderContrato1Semestre18Conc);
}
///////////////////////////-------------------- FIM PREÇOS 1 SEMESTRE 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PREÇOS 2 SEMESTRE 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minContrato2Semestre18Conc = 0;
var maxContrato2Semestre18Conc = 0;
function estiloContrato2Semestre18Conc(feature, latlng) {
    if(feature.properties.Con_2Sem18< minContrato2Semestre18Conc || minContrato2Semestre18Conc ===0){
        minContrato2Semestre18Conc = feature.properties.Con_2Sem18
    }
    if(feature.properties.Con_2Sem18> maxContrato2Semestre18Conc){
        maxContrato2Semestre18Conc = feature.properties.Con_2Sem18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Con_2Sem18,0.6)
    });
}
function apagarContrato2Semestre18Conc(e){
    var layer = e.target;
    Contrato2Semestre18Conc.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato2Semestre18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Novos contratos de arrendamento:  ' + '<b>' +feature.properties.Con_2Sem18 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato2Semestre18Conc,
    })
};

var Contrato2Semestre18Conc= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloContrato2Semestre18Conc,
    onEachFeature: onEachFeatureContrato2Semestre18Conc,
});

var slideContrato2Semestre18Conc = function(){
    var sliderContrato2Semestre18Conc = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato2Semestre18Conc, {
        start: [minContrato2Semestre18Conc, maxContrato2Semestre18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato2Semestre18Conc,
            'max': maxContrato2Semestre18Conc
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato2Semestre18Conc);
    inputNumberMax.setAttribute("value",maxContrato2Semestre18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato2Semestre18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato2Semestre18Conc.noUiSlider.set([null, this.value]);
    });

    sliderContrato2Semestre18Conc.noUiSlider.on('update',function(e){
        Contrato2Semestre18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Con_2Sem18>=parseFloat(e[0])&& layer.feature.properties.Con_2Sem18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato2Semestre18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderContrato2Semestre18Conc.noUiSlider;
    $(slidersGeral).append(sliderContrato2Semestre18Conc);
}
///////////////////////////-------------------- FIM PREÇOS 2 SEMESTRE 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PREÇOS 1 SEMESTRE 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minContrato1Semestre19Conc = 0;
var maxContrato1Semestre19Conc = 0;
function estiloContrato1Semestre19Conc(feature, latlng) {
    if(feature.properties.Con_1Sem19< minContrato1Semestre19Conc || minContrato1Semestre19Conc ===0){
        minContrato1Semestre19Conc = feature.properties.Con_1Sem19
    }
    if(feature.properties.Con_1Sem19> maxContrato1Semestre19Conc){
        maxContrato1Semestre19Conc = feature.properties.Con_1Sem19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Con_1Sem19,0.6)
    });
}
function apagarContrato1Semestre19Conc(e){
    var layer = e.target;
    Contrato1Semestre19Conc.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato1Semestre19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Novos contratos de arrendamento:  ' + '<b>' +feature.properties.Con_1Sem19 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato1Semestre19Conc,
    })
};

var Contrato1Semestre19Conc= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloContrato1Semestre19Conc,
    onEachFeature: onEachFeatureContrato1Semestre19Conc,
});

var slideContrato1Semestre19Conc = function(){
    var sliderContrato1Semestre19Conc = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato1Semestre19Conc, {
        start: [minContrato1Semestre19Conc, maxContrato1Semestre19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato1Semestre19Conc,
            'max': maxContrato1Semestre19Conc
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato1Semestre19Conc);
    inputNumberMax.setAttribute("value",maxContrato1Semestre19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato1Semestre19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato1Semestre19Conc.noUiSlider.set([null, this.value]);
    });

    sliderContrato1Semestre19Conc.noUiSlider.on('update',function(e){
        Contrato1Semestre19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Con_1Sem19>=parseFloat(e[0])&& layer.feature.properties.Con_1Sem19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato1Semestre19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderContrato1Semestre19Conc.noUiSlider;
    $(slidersGeral).append(sliderContrato1Semestre19Conc);
}
///////////////////////////-------------------- FIM PREÇOS 1 SEMESTRE 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PREÇOS 2 SEMESTRE 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minContrato2Semestre19Conc = 0;
var maxContrato2Semestre19Conc = 0;
function estiloContrato2Semestre19Conc(feature, latlng) {
    if(feature.properties.Con_2Sem19< minContrato2Semestre19Conc || minContrato2Semestre19Conc ===0){
        minContrato2Semestre19Conc = feature.properties.Con_2Sem19
    }
    if(feature.properties.Con_2Sem19> maxContrato2Semestre19Conc){
        maxContrato2Semestre19Conc = feature.properties.Con_2Sem19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Con_2Sem19,0.6)
    });
}
function apagarContrato2Semestre19Conc(e){
    var layer = e.target;
    Contrato2Semestre19Conc.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato2Semestre19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Novos contratos de arrendamento:  ' + '<b>' +feature.properties.Con_2Sem19 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato2Semestre19Conc,
    })
};

var Contrato2Semestre19Conc= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloContrato2Semestre19Conc,
    onEachFeature: onEachFeatureContrato2Semestre19Conc,
});

var slideContrato2Semestre19Conc = function(){
    var sliderContrato2Semestre19Conc = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato2Semestre19Conc, {
        start: [minContrato2Semestre19Conc, maxContrato2Semestre19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato2Semestre19Conc,
            'max': maxContrato2Semestre19Conc
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato2Semestre19Conc);
    inputNumberMax.setAttribute("value",maxContrato2Semestre19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato2Semestre19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato2Semestre19Conc.noUiSlider.set([null, this.value]);
    });

    sliderContrato2Semestre19Conc.noUiSlider.on('update',function(e){
        Contrato2Semestre19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Con_2Sem19>=parseFloat(e[0])&& layer.feature.properties.Con_2Sem19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato2Semestre19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderContrato2Semestre19Conc.noUiSlider;
    $(slidersGeral).append(sliderContrato2Semestre19Conc);
}
///////////////////////////-------------------- FIM PREÇOS 2 SEMESTRE 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PREÇOS 1 SEMESTRE 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minContrato1Semestre20Conc = 0;
var maxContrato1Semestre20Conc = 0;
function estiloContrato1Semestre20Conc(feature, latlng) {
    if(feature.properties.Con_1Sem20< minContrato1Semestre20Conc || minContrato1Semestre20Conc ===0){
        minContrato1Semestre20Conc = feature.properties.Con_1Sem20
    }
    if(feature.properties.Con_1Sem20> maxContrato1Semestre20Conc){
        maxContrato1Semestre20Conc = feature.properties.Con_1Sem20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Con_1Sem20,0.6)
    });
}
function apagarContrato1Semestre20Conc(e){
    var layer = e.target;
    Contrato1Semestre20Conc.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato1Semestre20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Novos contratos de arrendamento:  ' + '<b>' +feature.properties.Con_1Sem20 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato1Semestre20Conc,
    })
};

var Contrato1Semestre20Conc= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloContrato1Semestre20Conc,
    onEachFeature: onEachFeatureContrato1Semestre20Conc,
});

var slideContrato1Semestre20Conc = function(){
    var sliderContrato1Semestre20Conc = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato1Semestre20Conc, {
        start: [minContrato1Semestre20Conc, maxContrato1Semestre20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato1Semestre20Conc,
            'max': maxContrato1Semestre20Conc
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato1Semestre20Conc);
    inputNumberMax.setAttribute("value",maxContrato1Semestre20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato1Semestre20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato1Semestre20Conc.noUiSlider.set([null, this.value]);
    });

    sliderContrato1Semestre20Conc.noUiSlider.on('update',function(e){
        Contrato1Semestre20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Con_1Sem20>=parseFloat(e[0])&& layer.feature.properties.Con_1Sem20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato1Semestre20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderContrato1Semestre20Conc.noUiSlider;
    $(slidersGeral).append(sliderContrato1Semestre20Conc);
}
///////////////////////////-------------------- FIM PREÇOS 1 SEMESTRE 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PREÇOS 2 SEMESTRE 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minContrato2Semestre20Conc = 0;
var maxContrato2Semestre20Conc = 0;
function estiloContrato2Semestre20Conc(feature, latlng) {
    if(feature.properties.Con_2Sem20< minContrato2Semestre20Conc || minContrato2Semestre20Conc ===0){
        minContrato2Semestre20Conc = feature.properties.Con_2Sem20
    }
    if(feature.properties.Con_2Sem20> maxContrato2Semestre20Conc){
        maxContrato2Semestre20Conc = feature.properties.Con_2Sem20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Con_2Sem20,0.6)
    });
}
function apagarContrato2Semestre20Conc(e){
    var layer = e.target;
    Contrato2Semestre20Conc.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato2Semestre20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Novos contratos de arrendamento:  ' + '<b>' +feature.properties.Con_2Sem20 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato2Semestre20Conc,
    })
};

var Contrato2Semestre20Conc= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloContrato2Semestre20Conc,
    onEachFeature: onEachFeatureContrato2Semestre20Conc,
});

var slideContrato2Semestre20Conc = function(){
    var sliderContrato2Semestre20Conc = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato2Semestre20Conc, {
        start: [minContrato2Semestre20Conc, maxContrato2Semestre20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato2Semestre20Conc,
            'max': maxContrato2Semestre20Conc
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato2Semestre20Conc);
    inputNumberMax.setAttribute("value",maxContrato2Semestre20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato2Semestre20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato2Semestre20Conc.noUiSlider.set([null, this.value]);
    });

    sliderContrato2Semestre20Conc.noUiSlider.on('update',function(e){
        Contrato2Semestre20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Con_2Sem20>=parseFloat(e[0])&& layer.feature.properties.Con_2Sem20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato2Semestre20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderContrato2Semestre20Conc.noUiSlider;
    $(slidersGeral).append(sliderContrato2Semestre20Conc);
}
///////////////////////////-------------------- FIM PREÇOS 2 SEMESTRE 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PREÇOS 1 SEMESTRE 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minContrato1Semestre21Conc = 0;
var maxContrato1Semestre21Conc = 0;
function estiloContrato1Semestre21Conc(feature, latlng) {
    if(feature.properties.Con_1Sem21< minContrato1Semestre21Conc || minContrato1Semestre21Conc ===0){
        minContrato1Semestre21Conc = feature.properties.Con_1Sem21
    }
    if(feature.properties.Con_1Sem21> maxContrato1Semestre21Conc){
        maxContrato1Semestre21Conc = feature.properties.Con_1Sem21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Con_1Sem21,0.6)
    });
}
function apagarContrato1Semestre21Conc(e){
    var layer = e.target;
    Contrato1Semestre21Conc.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato1Semestre21Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Novos contratos de arrendamento:  ' + '<b>' +feature.properties.Con_1Sem21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato1Semestre21Conc,
    })
};

var Contrato1Semestre21Conc= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloContrato1Semestre21Conc,
    onEachFeature: onEachFeatureContrato1Semestre21Conc,
});

var slideContrato1Semestre21Conc = function(){
    var sliderContrato1Semestre21Conc = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato1Semestre21Conc, {
        start: [minContrato1Semestre21Conc, maxContrato1Semestre21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato1Semestre21Conc,
            'max': maxContrato1Semestre21Conc
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato1Semestre21Conc);
    inputNumberMax.setAttribute("value",maxContrato1Semestre21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato1Semestre21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato1Semestre21Conc.noUiSlider.set([null, this.value]);
    });

    sliderContrato1Semestre21Conc.noUiSlider.on('update',function(e){
        Contrato1Semestre21Conc.eachLayer(function(layer){
            if(layer.feature.properties.Con_1Sem21>=parseFloat(e[0])&& layer.feature.properties.Con_1Sem21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato1Semestre21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderContrato1Semestre21Conc.noUiSlider;
    $(slidersGeral).append(sliderContrato1Semestre21Conc);
}
///////////////////////////-------------------- FIM PREÇOS 1 SEMESTRE 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PREÇOS 2 SEMESTRE 2021, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minContrato2Semestre21Conc = 0;
var maxContrato2Semestre21Conc = 0;
function estiloContrato2Semestre21Conc(feature, latlng) {
    if(feature.properties.Con_2Sem21< minContrato2Semestre21Conc || minContrato2Semestre21Conc ===0){
        minContrato2Semestre21Conc = feature.properties.Con_2Sem21
    }
    if(feature.properties.Con_2Sem21> maxContrato2Semestre21Conc){
        maxContrato2Semestre21Conc = feature.properties.Con_2Sem21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Con_2Sem21,0.6)
    });
}
function apagarContrato2Semestre21Conc(e){
    var layer = e.target;
    Contrato2Semestre21Conc.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato2Semestre21Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Novos contratos de arrendamento:  ' + '<b>' +feature.properties.Con_2Sem21 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato2Semestre21Conc,
    })
};

var Contrato2Semestre21Conc= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloContrato2Semestre21Conc,
    onEachFeature: onEachFeatureContrato2Semestre21Conc,
});

var slideContrato2Semestre21Conc = function(){
    var sliderContrato2Semestre21Conc = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato2Semestre21Conc, {
        start: [minContrato2Semestre21Conc, maxContrato2Semestre21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato2Semestre21Conc,
            'max': maxContrato2Semestre21Conc
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato2Semestre21Conc);
    inputNumberMax.setAttribute("value",maxContrato2Semestre21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato2Semestre21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato2Semestre21Conc.noUiSlider.set([null, this.value]);
    });

    sliderContrato2Semestre21Conc.noUiSlider.on('update',function(e){
        Contrato2Semestre21Conc.eachLayer(function(layer){
            if(layer.feature.properties.Con_2Sem21>=parseFloat(e[0])&& layer.feature.properties.Con_2Sem21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato2Semestre21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderContrato2Semestre21Conc.noUiSlider;
    $(slidersGeral).append(sliderContrato2Semestre21Conc);
}
///////////////////////////-------------------- FIM PREÇOS 2 SEMESTRE 2021, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////----------------- FREGUESIAS ---------\\\\\\\\\\\\\\\\\\\\\

/////////////////////------------------- DADOS PREÇOS 2 SEMESTRE 2017-----//\\\\\\\\//////////////////////

////////////////////////////////////----------- DADOS PREÇOS 2 SEMESTRE 2017, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minContrato2Semestre17Freg = 999;
var maxContrato2Semestre17Freg = 0;
function estiloContrato2Semestre17Freg(feature, latlng) {
    
    if( feature.properties.F_C2SEM_17 <= minContrato2Semestre17Freg && feature.properties.F_C2SEM_17 > null || minContrato2Semestre17Freg === 0){
        minContrato2Semestre17Freg = feature.properties.F_C2SEM_17
    }
    if(feature.properties.F_C2SEM_17> maxContrato2Semestre17Freg){
        maxContrato2Semestre17Freg = feature.properties.F_C2SEM_17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_C2SEM_17,0.8)
    });
}
function apagarContrato2Semestre17Freg(e){
    var layer = e.target;
    Contrato2Semestre17Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato2Semestre17Freg(feature, layer) {
    if(feature.properties.F_C2SEM_17 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + 'Sem dados disponíveis.' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + feature.properties.F_C2SEM_17 + '</b>').openPopup()
    }   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato2Semestre17Freg,
    })
};

var Contrato2Semestre17Freg= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloContrato2Semestre17Freg,
    onEachFeature: onEachFeatureContrato2Semestre17Freg,
});

var slideContrato2Semestre17Freg = function(){
    var sliderContrato2Semestre17Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato2Semestre17Freg, {
        start: [minContrato2Semestre17Freg, maxContrato2Semestre17Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato2Semestre17Freg,
            'max': maxContrato2Semestre17Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato2Semestre17Freg);
    inputNumberMax.setAttribute("value",maxContrato2Semestre17Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato2Semestre17Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato2Semestre17Freg.noUiSlider.set([null, this.value]);
    });

    sliderContrato2Semestre17Freg.noUiSlider.on('update',function(e){
        Contrato2Semestre17Freg.eachLayer(function(layer){
            if (layer.feature.properties.F_C2SEM_17 == null){
                return false
            }
            if(layer.feature.properties.F_C2SEM_17>=parseFloat(e[0])&& layer.feature.properties.F_C2SEM_17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato2Semestre17Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderContrato2Semestre17Freg.noUiSlider;
    $(slidersGeral).append(sliderContrato2Semestre17Freg);
}
///////////////////////////-------------------- FIM DADOS PREÇOS 2 SEMESTRE 2017, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS PREÇOS 1 SEMESTRE 2018, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minContrato1Semestre18Freg = 999;
var maxContrato1Semestre18Freg = 0;
function estiloContrato1Semestre18Freg(feature, latlng) {
    
    if( feature.properties.F_C1SEM_18 <= minContrato1Semestre18Freg && feature.properties.F_C1SEM_18 > null || minContrato1Semestre18Freg === 0){
        minContrato1Semestre18Freg = feature.properties.F_C1SEM_18
    }
    if(feature.properties.F_C1SEM_18> maxContrato1Semestre18Freg){
        maxContrato1Semestre18Freg = feature.properties.F_C1SEM_18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_C1SEM_18,0.8)
    });
}
function apagarContrato1Semestre18Freg(e){
    var layer = e.target;
    Contrato1Semestre18Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato1Semestre18Freg(feature, layer) {
    if(feature.properties.F_C1SEM_18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + 'Sem dados disponíveis.' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + feature.properties.F_C1SEM_18 + '</b>').openPopup()
    }   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato1Semestre18Freg,
    })
};

var Contrato1Semestre18Freg= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloContrato1Semestre18Freg,
    onEachFeature: onEachFeatureContrato1Semestre18Freg,
});

var slideContrato1Semestre18Freg = function(){
    var sliderContrato1Semestre18Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato1Semestre18Freg, {
        start: [minContrato1Semestre18Freg, maxContrato1Semestre18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato1Semestre18Freg,
            'max': maxContrato1Semestre18Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato1Semestre18Freg);
    inputNumberMax.setAttribute("value",maxContrato1Semestre18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato1Semestre18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato1Semestre18Freg.noUiSlider.set([null, this.value]);
    });

    sliderContrato1Semestre18Freg.noUiSlider.on('update',function(e){
        Contrato1Semestre18Freg.eachLayer(function(layer){
            if (layer.feature.properties.F_C1SEM_18 == null){
                return false
            }
            if(layer.feature.properties.F_C1SEM_18>=parseFloat(e[0])&& layer.feature.properties.F_C1SEM_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato1Semestre18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderContrato1Semestre18Freg.noUiSlider;
    $(slidersGeral).append(sliderContrato1Semestre18Freg);
}
///////////////////////////-------------------- FIM DADOS PREÇOS 1 SEMESTRE 2018, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS PREÇOS 2 SEMESTRE 2018, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minContrato2Semestre18Freg = 999;
var maxContrato2Semestre18Freg = 0;
function estiloContrato2Semestre18Freg(feature, latlng) {
    
    if( feature.properties.F_C2SEM_18 <= minContrato2Semestre18Freg && feature.properties.F_C2SEM_18 > null || minContrato2Semestre18Freg === 0){
        minContrato2Semestre18Freg = feature.properties.F_C2SEM_18
    }
    if(feature.properties.F_C2SEM_18> maxContrato2Semestre18Freg){
        maxContrato2Semestre18Freg = feature.properties.F_C2SEM_18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_C2SEM_18,0.8)
    });
}
function apagarContrato2Semestre18Freg(e){
    var layer = e.target;
    Contrato2Semestre18Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato2Semestre18Freg(feature, layer) {
    if(feature.properties.F_C2SEM_18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + 'Sem dados disponíveis.' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + feature.properties.F_C2SEM_18 + '</b>').openPopup()
    }   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato2Semestre18Freg,
    })
};

var Contrato2Semestre18Freg= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloContrato2Semestre18Freg,
    onEachFeature: onEachFeatureContrato2Semestre18Freg,
});

var slideContrato2Semestre18Freg = function(){
    var sliderContrato2Semestre18Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato2Semestre18Freg, {
        start: [minContrato2Semestre18Freg, maxContrato2Semestre18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato2Semestre18Freg,
            'max': maxContrato2Semestre18Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato2Semestre18Freg);
    inputNumberMax.setAttribute("value",maxContrato2Semestre18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato2Semestre18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato2Semestre18Freg.noUiSlider.set([null, this.value]);
    });

    sliderContrato2Semestre18Freg.noUiSlider.on('update',function(e){
        Contrato2Semestre18Freg.eachLayer(function(layer){
            if (layer.feature.properties.F_C2SEM_18 == null){
                return false
            }
            if(layer.feature.properties.F_C2SEM_18>=parseFloat(e[0])&& layer.feature.properties.F_C2SEM_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato2Semestre18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderContrato2Semestre18Freg.noUiSlider;
    $(slidersGeral).append(sliderContrato2Semestre18Freg);
}
///////////////////////////-------------------- FIM DADOS PREÇOS 2 SEMESTRE 2018, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS PREÇOS 1 SEMESTRE 2019, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minContrato1Semestre19Freg = 999;
var maxContrato1Semestre19Freg = 0;
function estiloContrato1Semestre19Freg(feature, latlng) {
    
    if( feature.properties.F_C1SEM_19 <= minContrato1Semestre19Freg && feature.properties.F_C1SEM_19 > null || minContrato1Semestre19Freg === 0){
        minContrato1Semestre19Freg = feature.properties.F_C1SEM_19
    }
    if(feature.properties.F_C1SEM_19> maxContrato1Semestre19Freg){
        maxContrato1Semestre19Freg = feature.properties.F_C1SEM_19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_C1SEM_19,0.8)
    });
}
function apagarContrato1Semestre19Freg(e){
    var layer = e.target;
    Contrato1Semestre19Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato1Semestre19Freg(feature, layer) {
    if(feature.properties.F_C1SEM_19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + 'Sem dados disponíveis.' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + feature.properties.F_C1SEM_19 + '</b>').openPopup()
    }   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato1Semestre19Freg,
    })
};

var Contrato1Semestre19Freg= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloContrato1Semestre19Freg,
    onEachFeature: onEachFeatureContrato1Semestre19Freg,
});

var slideContrato1Semestre19Freg = function(){
    var sliderContrato1Semestre19Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato1Semestre19Freg, {
        start: [minContrato1Semestre19Freg, maxContrato1Semestre19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato1Semestre19Freg,
            'max': maxContrato1Semestre19Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato1Semestre19Freg);
    inputNumberMax.setAttribute("value",maxContrato1Semestre19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato1Semestre19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato1Semestre19Freg.noUiSlider.set([null, this.value]);
    });

    sliderContrato1Semestre19Freg.noUiSlider.on('update',function(e){
        Contrato1Semestre19Freg.eachLayer(function(layer){
            if (layer.feature.properties.F_C1SEM_19 == null){
                return false
            }
            if(layer.feature.properties.F_C1SEM_19>=parseFloat(e[0])&& layer.feature.properties.F_C1SEM_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato1Semestre19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderContrato1Semestre19Freg.noUiSlider;
    $(slidersGeral).append(sliderContrato1Semestre19Freg);
}
///////////////////////////-------------------- FIM DADOS PREÇOS 1 SEMESTRE 2019, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS PREÇOS 2 SEMESTRE 2019, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minContrato2Semestre19Freg = 999;
var maxContrato2Semestre19Freg = 0;
function estiloContrato2Semestre19Freg(feature, latlng) {
    
    if( feature.properties.F_C2SEM_19 <= minContrato2Semestre19Freg && feature.properties.F_C2SEM_19 > null || minContrato2Semestre19Freg === 0){
        minContrato2Semestre19Freg = feature.properties.F_C2SEM_19
    }
    if(feature.properties.F_C2SEM_19> maxContrato2Semestre19Freg){
        maxContrato2Semestre19Freg = feature.properties.F_C2SEM_19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_C2SEM_19,0.8)
    });
}
function apagarContrato2Semestre19Freg(e){
    var layer = e.target;
    Contrato2Semestre19Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato2Semestre19Freg(feature, layer) {
    if(feature.properties.F_C2SEM_19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + 'Sem dados disponíveis.' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + feature.properties.F_C2SEM_19 + '</b>').openPopup()
    }   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato2Semestre19Freg,
    })
};

var Contrato2Semestre19Freg= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloContrato2Semestre19Freg,
    onEachFeature: onEachFeatureContrato2Semestre19Freg,
});

var slideContrato2Semestre19Freg = function(){
    var sliderContrato2Semestre19Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato2Semestre19Freg, {
        start: [minContrato2Semestre19Freg, maxContrato2Semestre19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato2Semestre19Freg,
            'max': maxContrato2Semestre19Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato2Semestre19Freg);
    inputNumberMax.setAttribute("value",maxContrato2Semestre19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato2Semestre19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato2Semestre19Freg.noUiSlider.set([null, this.value]);
    });

    sliderContrato2Semestre19Freg.noUiSlider.on('update',function(e){
        Contrato2Semestre19Freg.eachLayer(function(layer){
            if (layer.feature.properties.F_C2SEM_19 == null){
                return false
            }
            if(layer.feature.properties.F_C2SEM_19>=parseFloat(e[0])&& layer.feature.properties.F_C2SEM_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato2Semestre19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderContrato2Semestre19Freg.noUiSlider;
    $(slidersGeral).append(sliderContrato2Semestre19Freg);
}
///////////////////////////-------------------- FIM DADOS PREÇOS 2 SEMESTRE 2019, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS PREÇOS 1 SEMESTRE 2020, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minContrato1Semestre20Freg = 999;
var maxContrato1Semestre20Freg = 0;
function estiloContrato1Semestre20Freg(feature, latlng) {
    
    if( feature.properties.F_C1SEM_20 <= minContrato1Semestre20Freg && feature.properties.F_C1SEM_20 > null || minContrato1Semestre20Freg === 0){
        minContrato1Semestre20Freg = feature.properties.F_C1SEM_20
    }
    if(feature.properties.F_C1SEM_20> maxContrato1Semestre20Freg){
        maxContrato1Semestre20Freg = feature.properties.F_C1SEM_20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_C1SEM_20,0.8)
    });
}
function apagarContrato1Semestre20Freg(e){
    var layer = e.target;
    Contrato1Semestre20Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato1Semestre20Freg(feature, layer) {
    if(feature.properties.F_C1SEM_20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + 'Sem dados disponíveis.' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + feature.properties.F_C1SEM_20 + '</b>').openPopup()
    }   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato1Semestre20Freg,
    })
};

var Contrato1Semestre20Freg= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloContrato1Semestre20Freg,
    onEachFeature: onEachFeatureContrato1Semestre20Freg,
});

var slideContrato1Semestre20Freg = function(){
    var sliderContrato1Semestre20Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato1Semestre20Freg, {
        start: [minContrato1Semestre20Freg, maxContrato1Semestre20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato1Semestre20Freg,
            'max': maxContrato1Semestre20Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato1Semestre20Freg);
    inputNumberMax.setAttribute("value",maxContrato1Semestre20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato1Semestre20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato1Semestre20Freg.noUiSlider.set([null, this.value]);
    });

    sliderContrato1Semestre20Freg.noUiSlider.on('update',function(e){
        Contrato1Semestre20Freg.eachLayer(function(layer){
            if (layer.feature.properties.F_C1SEM_20 == null){
                return false
            }
            if(layer.feature.properties.F_C1SEM_20>=parseFloat(e[0])&& layer.feature.properties.F_C1SEM_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato1Semestre20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderContrato1Semestre20Freg.noUiSlider;
    $(slidersGeral).append(sliderContrato1Semestre20Freg);
}
///////////////////////////-------------------- FIM DADOS PREÇOS 1 SEMESTRE 2020, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS PREÇOS 2 SEMESTRE 2020, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minContrato2Semestre20Freg = 999;
var maxContrato2Semestre20Freg = 0;
function estiloContrato2Semestre20Freg(feature, latlng) {
    
    if( feature.properties.F_C2SEM_20 <= minContrato2Semestre20Freg && feature.properties.F_C2SEM_20 > null || minContrato2Semestre20Freg === 0){
        minContrato2Semestre20Freg = feature.properties.F_C2SEM_20
    }
    if(feature.properties.F_C2SEM_20> maxContrato2Semestre20Freg){
        maxContrato2Semestre20Freg = feature.properties.F_C2SEM_20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_C2SEM_20,0.8)
    });
}
function apagarContrato2Semestre20Freg(e){
    var layer = e.target;
    Contrato2Semestre20Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato2Semestre20Freg(feature, layer) {
    if(feature.properties.F_C2SEM_20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + 'Sem dados disponíveis.' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + feature.properties.F_C2SEM_20 + '</b>').openPopup()
    }   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato2Semestre20Freg,
    })
};

var Contrato2Semestre20Freg= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloContrato2Semestre20Freg,
    onEachFeature: onEachFeatureContrato2Semestre20Freg,
});

var slideContrato2Semestre20Freg = function(){
    var sliderContrato2Semestre20Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato2Semestre20Freg, {
        start: [minContrato2Semestre20Freg, maxContrato2Semestre20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato2Semestre20Freg,
            'max': maxContrato2Semestre20Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato2Semestre20Freg);
    inputNumberMax.setAttribute("value",maxContrato2Semestre20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato2Semestre20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato2Semestre20Freg.noUiSlider.set([null, this.value]);
    });

    sliderContrato2Semestre20Freg.noUiSlider.on('update',function(e){
        Contrato2Semestre20Freg.eachLayer(function(layer){
            if (layer.feature.properties.F_C2SEM_20 == null){
                return false
            }
            if(layer.feature.properties.F_C2SEM_20>=parseFloat(e[0])&& layer.feature.properties.F_C2SEM_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato2Semestre20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderContrato2Semestre20Freg.noUiSlider;
    $(slidersGeral).append(sliderContrato2Semestre20Freg);
}
///////////////////////////-------------------- FIM DADOS PREÇOS 2 SEMESTRE 2020, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS PREÇOS 1 SEMESTRE 2021, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minContrato1Semestre21Freg = 999;
var maxContrato1Semestre21Freg = 0;
function estiloContrato1Semestre21Freg(feature, latlng) {
    
    if( feature.properties.F_C1SEM_21 <= minContrato1Semestre21Freg && feature.properties.F_C1SEM_21 > null || minContrato1Semestre21Freg === 0){
        minContrato1Semestre21Freg = feature.properties.F_C1SEM_21
    }
    if(feature.properties.F_C1SEM_21> maxContrato1Semestre21Freg){
        maxContrato1Semestre21Freg = feature.properties.F_C1SEM_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_C1SEM_21,0.8)
    });
}
function apagarContrato1Semestre21Freg(e){
    var layer = e.target;
    Contrato1Semestre21Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato1Semestre21Freg(feature, layer) {
    if(feature.properties.F_C1SEM_21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + 'Sem dados disponíveis.' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + feature.properties.F_C1SEM_21 + '</b>').openPopup()
    }   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato1Semestre21Freg,
    })
};

var Contrato1Semestre21Freg= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloContrato1Semestre21Freg,
    onEachFeature: onEachFeatureContrato1Semestre21Freg,
});

var slideContrato1Semestre21Freg = function(){
    var sliderContrato1Semestre21Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato1Semestre21Freg, {
        start: [minContrato1Semestre21Freg, maxContrato1Semestre21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato1Semestre21Freg,
            'max': maxContrato1Semestre21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato1Semestre21Freg);
    inputNumberMax.setAttribute("value",maxContrato1Semestre21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato1Semestre21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato1Semestre21Freg.noUiSlider.set([null, this.value]);
    });

    sliderContrato1Semestre21Freg.noUiSlider.on('update',function(e){
        Contrato1Semestre21Freg.eachLayer(function(layer){
            if (layer.feature.properties.F_C1SEM_21 == null){
                return false
            }
            if(layer.feature.properties.F_C1SEM_21>=parseFloat(e[0])&& layer.feature.properties.F_C1SEM_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato1Semestre21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderContrato1Semestre21Freg.noUiSlider;
    $(slidersGeral).append(sliderContrato1Semestre21Freg);
}
///////////////////////////-------------------- FIM DADOS PREÇOS 1 SEMESTRE 2021, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- DADOS PREÇOS 2 SEMESTRE 2021, POR FREGUESIA ------------------------------\\\\\\\\\\\\\

var minContrato2Semestre21Freg = 999;
var maxContrato2Semestre21Freg = 0;
function estiloContrato2Semestre21Freg(feature, latlng) {
    
    if( feature.properties.F_C2SEM_21 <= minContrato2Semestre21Freg && feature.properties.F_C2SEM_21 > null || minContrato2Semestre21Freg === 0){
        minContrato2Semestre21Freg = feature.properties.F_C2SEM_21
    }
    if(feature.properties.F_C2SEM_21> maxContrato2Semestre21Freg){
        maxContrato2Semestre21Freg = feature.properties.F_C2SEM_21
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F_C2SEM_21,0.8)
    });
}
function apagarContrato2Semestre21Freg(e){
    var layer = e.target;
    Contrato2Semestre21Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureContrato2Semestre21Freg(feature, layer) {
    if(feature.properties.F_C2SEM_21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + 'Sem dados disponíveis.' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Novos contratos de arrendamento: ' + '<b>' + feature.properties.F_C2SEM_21 + '</b>').openPopup()
    }   
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarContrato2Semestre21Freg,
    })
};

var Contrato2Semestre21Freg= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloContrato2Semestre21Freg,
    onEachFeature: onEachFeatureContrato2Semestre21Freg,
});

var slideContrato2Semestre21Freg = function(){
    var sliderContrato2Semestre21Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderContrato2Semestre21Freg, {
        start: [minContrato2Semestre21Freg, maxContrato2Semestre21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minContrato2Semestre21Freg,
            'max': maxContrato2Semestre21Freg
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minContrato2Semestre21Freg);
    inputNumberMax.setAttribute("value",maxContrato2Semestre21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderContrato2Semestre21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderContrato2Semestre21Freg.noUiSlider.set([null, this.value]);
    });

    sliderContrato2Semestre21Freg.noUiSlider.on('update',function(e){
        Contrato2Semestre21Freg.eachLayer(function(layer){
            if (layer.feature.properties.F_C2SEM_21 == null){
                return false
            }
            if(layer.feature.properties.F_C2SEM_21>=parseFloat(e[0])&& layer.feature.properties.F_C2SEM_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderContrato2Semestre21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderContrato2Semestre21Freg.noUiSlider;
    $(slidersGeral).append(sliderContrato2Semestre21Freg);
}
///////////////////////////-------------------- FIM DADOS PREÇOS 2 SEMESTRE 2021, POR FREGUESIA -----------\\\\\\\\\\\\\\\\\\\\\\\

// /////////////////////////////------------------------ VARIAÇÕES -------------------------------\\\\\\\\\\\\\\\\\

// /////////////////////////////------- Variação 1 SEMESTRE 2018 E 2 SEMESTRE 2017 POR CONCELHOS -------------------////

var minVar1Sem18_2sem17Conc = 0;
var maxVar1Sem18_2sem17Conc = 0;

function CorVar1Sem18_2sem17Conc(d) {
    return d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10  ? '#2288bf' :
        d >= -16.98   ? '#155273' :
                ''  ;
}

var legendaVar1Sem18_2sem17Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 1º semestre de 2018 e o 2º semestre de 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -16.97 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Sem18_2sem17Conc(feature) {
    if(feature.properties.Var1Sem18 <= minVar1Sem18_2sem17Conc){
        minVar1Sem18_2sem17Conc = feature.properties.Var1Sem18
    }
    if(feature.properties.Var1Sem18 > maxVar1Sem18_2sem17Conc){
        maxVar1Sem18_2sem17Conc = feature.properties.Var1Sem18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Sem18_2sem17Conc(feature.properties.Var1Sem18)};
    }


function apagarVar1Sem18_2sem17Conc(e) {
    Var1Sem18_2sem17Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Sem18_2sem17Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1Sem18.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Sem18_2sem17Conc,
    });
}
var Var1Sem18_2sem17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar1Sem18_2sem17Conc,
    onEachFeature: onEachFeatureVar1Sem18_2sem17Conc
});

let slideVar1Sem18_2sem17Conc = function(){
    var sliderVar1Sem18_2sem17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Sem18_2sem17Conc, {
        start: [minVar1Sem18_2sem17Conc, maxVar1Sem18_2sem17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Sem18_2sem17Conc,
            'max': maxVar1Sem18_2sem17Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar1Sem18_2sem17Conc);
    inputNumberMax.setAttribute("value",maxVar1Sem18_2sem17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Sem18_2sem17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Sem18_2sem17Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar1Sem18_2sem17Conc.noUiSlider.on('update',function(e){
        Var1Sem18_2sem17Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var1Sem18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1Sem18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Sem18_2sem17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderVar1Sem18_2sem17Conc.noUiSlider;
    $(slidersGeral).append(sliderVar1Sem18_2sem17Conc);
} 

///////////////////////////// Fim da Variação 1 SEMESTRE 2018 E 2 SEMESTRE 2017 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2 SEMESTRE 2018 E 1 SEMESTRE 2018 POR CONCELHOS -------------------////

var minVar2Sem18_1sem18Conc = 0;
var maxVar2Sem18_1sem18Conc = 0;

function CorVar2Sem18_1sem18Conc(d) {
    return d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >=  0 ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -11.55   ? '#2288bf' :
                ''  ;
}

var legendaVar2Sem18_1sem18Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 2º semestre de 2018 e o 1º semestre de 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -11.54 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Sem18_1sem18Conc(feature) {
    if(feature.properties.Var2Sem18 <= minVar2Sem18_1sem18Conc){
        minVar2Sem18_1sem18Conc = feature.properties.Var2Sem18
    }
    if(feature.properties.Var2Sem18 > maxVar2Sem18_1sem18Conc){
        maxVar2Sem18_1sem18Conc = feature.properties.Var2Sem18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Sem18_1sem18Conc(feature.properties.Var2Sem18)};
    }


function apagarVar2Sem18_1sem18Conc(e) {
    Var2Sem18_1sem18Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Sem18_1sem18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2Sem18.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Sem18_1sem18Conc,
    });
}
var Var2Sem18_1sem18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2Sem18_1sem18Conc,
    onEachFeature: onEachFeatureVar2Sem18_1sem18Conc
});

let slideVar2Sem18_1sem18Conc = function(){
    var sliderVar2Sem18_1sem18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Sem18_1sem18Conc, {
        start: [minVar2Sem18_1sem18Conc, maxVar2Sem18_1sem18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Sem18_1sem18Conc,
            'max': maxVar2Sem18_1sem18Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2Sem18_1sem18Conc);
    inputNumberMax.setAttribute("value",maxVar2Sem18_1sem18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Sem18_1sem18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Sem18_1sem18Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2Sem18_1sem18Conc.noUiSlider.on('update',function(e){
        Var2Sem18_1sem18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var2Sem18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2Sem18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Sem18_1sem18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderVar2Sem18_1sem18Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2Sem18_1sem18Conc);
} 

///////////////////////////// Fim da Variação 2 SEMESTRE 2018 E 1 SEMESTRE 2018 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 1 SEMESTRE 2019 E 2 SEMESTRE 2018 POR CONCELHOS -------------------////

var minVar1Sem19_2sem18Conc = 0;
var maxVar1Sem19_2sem18Conc = 0;

function CorVar1Sem19_2sem18Conc(d) {
    return d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9ebbd7' :
        d >= -10 ? '#2288bf' :
        d >= -15  ? '#155273' :
        d >= -19.58   ? '#0b2c40' :
                ''  ;
}

var legendaVar1Sem19_2sem18Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 1º semestre de 2019 e o 2º semestre de 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -15 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -19.57 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Sem19_2sem18Conc(feature) {
    if(feature.properties.Var1Sem19 <= minVar1Sem19_2sem18Conc){
        minVar1Sem19_2sem18Conc = feature.properties.Var1Sem19
    }
    if(feature.properties.Var1Sem19 > maxVar1Sem19_2sem18Conc){
        maxVar1Sem19_2sem18Conc = feature.properties.Var1Sem19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Sem19_2sem18Conc(feature.properties.Var1Sem19)};
    }


function apagarVar1Sem19_2sem18Conc(e) {
    Var1Sem19_2sem18Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Sem19_2sem18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1Sem19.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Sem19_2sem18Conc,
    });
}
var Var1Sem19_2sem18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar1Sem19_2sem18Conc,
    onEachFeature: onEachFeatureVar1Sem19_2sem18Conc
});

let slideVar1Sem19_2sem18Conc = function(){
    var sliderVar1Sem19_2sem18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Sem19_2sem18Conc, {
        start: [minVar1Sem19_2sem18Conc, maxVar1Sem19_2sem18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Sem19_2sem18Conc,
            'max': maxVar1Sem19_2sem18Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar1Sem19_2sem18Conc);
    inputNumberMax.setAttribute("value",maxVar1Sem19_2sem18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Sem19_2sem18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Sem19_2sem18Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar1Sem19_2sem18Conc.noUiSlider.on('update',function(e){
        Var1Sem19_2sem18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var1Sem19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1Sem19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Sem19_2sem18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderVar1Sem19_2sem18Conc.noUiSlider;
    $(slidersGeral).append(sliderVar1Sem19_2sem18Conc);
} 

///////////////////////////// Fim da Variação 1 SEMESTRE 2019 E 2 SEMESTRE 2018 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2 SEMESTRE 2019 E 1 SEMESTRE 2019 POR CONCELHOS -------------------////

var minVar2Sem19_1sem19Conc = 0;
var maxVar2Sem19_1sem19Conc = 0;

function CorVar2Sem19_1sem19Conc(d) {
    return d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >=  0 ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -8.18   ? '#2288bf' :
                ''  ;
}

var legendaVar2Sem19_1sem19Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 2º semestre de 2019 e o 1º semestre de 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -8.17 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Sem19_1sem19Conc(feature) {
    if(feature.properties.Var2Sem19 <= minVar2Sem19_1sem19Conc){
        minVar2Sem19_1sem19Conc = feature.properties.Var2Sem19
    }
    if(feature.properties.Var2Sem19 > maxVar2Sem19_1sem19Conc){
        maxVar2Sem19_1sem19Conc = feature.properties.Var2Sem19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Sem19_1sem19Conc(feature.properties.Var2Sem19)};
    }


function apagarVar2Sem19_1sem19Conc(e) {
    Var2Sem19_1sem19Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Sem19_1sem19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2Sem19.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Sem19_1sem19Conc,
    });
}
var Var2Sem19_1sem19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2Sem19_1sem19Conc,
    onEachFeature: onEachFeatureVar2Sem19_1sem19Conc
});

let slideVar2Sem19_1sem19Conc = function(){
    var sliderVar2Sem19_1sem19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Sem19_1sem19Conc, {
        start: [minVar2Sem19_1sem19Conc, maxVar2Sem19_1sem19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Sem19_1sem19Conc,
            'max': maxVar2Sem19_1sem19Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2Sem19_1sem19Conc);
    inputNumberMax.setAttribute("value",maxVar2Sem19_1sem19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Sem19_1sem19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Sem19_1sem19Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2Sem19_1sem19Conc.noUiSlider.on('update',function(e){
        Var2Sem19_1sem19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var2Sem19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2Sem19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Sem19_1sem19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderVar2Sem19_1sem19Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2Sem19_1sem19Conc);
} 

///////////////////////////// Fim da Variação 2 SEMESTRE 2019 E 1 SEMESTRE 2019 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 1 SEMESTRE 2020 E 2 SEMESTRE 2019 POR CONCELHOS -------------------////

var minVar1Sem20_2sem19Conc = 0;
var maxVar1Sem20_2sem19Conc = 0;

function CorVar1Sem20_2sem19Conc(d) {
    return d >= 15  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 5 ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5.45   ? '#9eaad7' :
                ''  ;
}

var legendaVar1Sem20_2sem19Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 1º semestre de 2020 e o 2º semestre de 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  10 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5.44 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Sem20_2sem19Conc(feature) {
    if(feature.properties.Var1Sem20 <= minVar1Sem20_2sem19Conc){
        minVar1Sem20_2sem19Conc = feature.properties.Var1Sem20
    }
    if(feature.properties.Var1Sem20 > maxVar1Sem20_2sem19Conc){
        maxVar1Sem20_2sem19Conc = feature.properties.Var1Sem20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Sem20_2sem19Conc(feature.properties.Var1Sem20)};
    }


function apagarVar1Sem20_2sem19Conc(e) {
    Var1Sem20_2sem19Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Sem20_2sem19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1Sem20.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Sem20_2sem19Conc,
    });
}
var Var1Sem20_2sem19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar1Sem20_2sem19Conc,
    onEachFeature: onEachFeatureVar1Sem20_2sem19Conc
});

let slideVar1Sem20_2sem19Conc = function(){
    var sliderVar1Sem20_2sem19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Sem20_2sem19Conc, {
        start: [minVar1Sem20_2sem19Conc, maxVar1Sem20_2sem19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Sem20_2sem19Conc,
            'max': maxVar1Sem20_2sem19Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar1Sem20_2sem19Conc);
    inputNumberMax.setAttribute("value",maxVar1Sem20_2sem19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Sem20_2sem19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Sem20_2sem19Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar1Sem20_2sem19Conc.noUiSlider.on('update',function(e){
        Var1Sem20_2sem19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var1Sem20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1Sem20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Sem20_2sem19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderVar1Sem20_2sem19Conc.noUiSlider;
    $(slidersGeral).append(sliderVar1Sem20_2sem19Conc);
} 

///////////////////////////// Fim da Variação 1 SEMESTRE 2020 E 2 SEMESTRE 2019 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2 SEMESTRE 2020 E 1 SEMESTRE 2020 POR CONCELHOS -------------------////

var minVar2Sem20_1sem20Conc = 0;
var maxVar2Sem20_1sem20Conc = 0;

function CorVar2Sem20_1sem20Conc(d) {
    return d >= 15  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 5 ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -4.36   ? '#9eaad7' :
                ''  ;
}

var legendaVar2Sem20_1sem20Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 2º semestre de 2020 e o 1º semestre de 2020, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  10 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -4.35 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Sem20_1sem20Conc(feature) {
    if(feature.properties.Var2Sem20 <= minVar2Sem20_1sem20Conc){
        minVar2Sem20_1sem20Conc = feature.properties.Var2Sem20
    }
    if(feature.properties.Var2Sem20 > maxVar2Sem20_1sem20Conc){
        maxVar2Sem20_1sem20Conc = feature.properties.Var2Sem20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Sem20_1sem20Conc(feature.properties.Var2Sem20)};
    }


function apagarVar2Sem20_1sem20Conc(e) {
    Var2Sem20_1sem20Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Sem20_1sem20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2Sem20.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Sem20_1sem20Conc,
    });
}
var Var2Sem20_1sem20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2Sem20_1sem20Conc,
    onEachFeature: onEachFeatureVar2Sem20_1sem20Conc
});

let slideVar2Sem20_1sem20Conc = function(){
    var sliderVar2Sem20_1sem20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Sem20_1sem20Conc, {
        start: [minVar2Sem20_1sem20Conc, maxVar2Sem20_1sem20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Sem20_1sem20Conc,
            'max': maxVar2Sem20_1sem20Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2Sem20_1sem20Conc);
    inputNumberMax.setAttribute("value",maxVar2Sem20_1sem20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Sem20_1sem20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Sem20_1sem20Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2Sem20_1sem20Conc.noUiSlider.on('update',function(e){
        Var2Sem20_1sem20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var2Sem20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2Sem20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Sem20_1sem20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderVar2Sem20_1sem20Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2Sem20_1sem20Conc);
} 

///////////////////////////// Fim da Variação 2 SEMESTRE 2020 E 1 SEMESTRE 2020 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 1 SEMESTRE 2021 E 2 SEMESTRE 2020 POR CONCELHOS -------------------////

var minVar1Sem21_2sem20Conc = 0;
var maxVar1Sem21_2sem20Conc = 0;

function CorVar1Sem21_2sem20Conc(d) {
    return d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10.46   ? '#2288bf' :
                ''  ;
}

var legendaVar1Sem21_2sem20Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 1º semestre de 2021 e o 2º semestre de 2020, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10.45 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Sem21_2sem20Conc(feature) {
    if(feature.properties.Var1Sem21 <= minVar1Sem21_2sem20Conc){
        minVar1Sem21_2sem20Conc = feature.properties.Var1Sem21
    }
    if(feature.properties.Var1Sem21 > maxVar1Sem21_2sem20Conc){
        maxVar1Sem21_2sem20Conc = feature.properties.Var1Sem21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Sem21_2sem20Conc(feature.properties.Var1Sem21)};
    }


function apagarVar1Sem21_2sem20Conc(e) {
    Var1Sem21_2sem20Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Sem21_2sem20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1Sem21.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Sem21_2sem20Conc,
    });
}
var Var1Sem21_2sem20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar1Sem21_2sem20Conc,
    onEachFeature: onEachFeatureVar1Sem21_2sem20Conc
});

let slideVar1Sem21_2sem20Conc = function(){
    var sliderVar1Sem21_2sem20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Sem21_2sem20Conc, {
        start: [minVar1Sem21_2sem20Conc, maxVar1Sem21_2sem20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Sem21_2sem20Conc,
            'max': maxVar1Sem21_2sem20Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar1Sem21_2sem20Conc);
    inputNumberMax.setAttribute("value",maxVar1Sem21_2sem20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Sem21_2sem20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Sem21_2sem20Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar1Sem21_2sem20Conc.noUiSlider.on('update',function(e){
        Var1Sem21_2sem20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var1Sem21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1Sem21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Sem21_2sem20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderVar1Sem21_2sem20Conc.noUiSlider;
    $(slidersGeral).append(sliderVar1Sem21_2sem20Conc);
} 

///////////////////////////// Fim da Variação  1 SEMESTRE 2021 E 2 SEMESTRE 2020 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2 SEMESTRE 2021 E 1 SEMESTRE 2021 POR CONCELHOS -------------------////

var minVar2Sem21_1sem21Conc = 0;
var maxVar2Sem21_1sem21Conc = 0;

function CorVar2Sem21_1sem21Conc(d) {
    return d >= 15  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 5 ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -3.54   ? '#9eaad7' :
                ''  ;
}

var legendaVar2Sem21_1sem21Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 2º semestre de 2021 e o 1º semestre de 2021, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  10 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -3.53 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Sem21_1sem21Conc(feature) {
    if(feature.properties.Var2Sem21 <= minVar2Sem21_1sem21Conc){
        minVar2Sem21_1sem21Conc = feature.properties.Var2Sem21
    }
    if(feature.properties.Var2Sem21 > maxVar2Sem21_1sem21Conc){
        maxVar2Sem21_1sem21Conc = feature.properties.Var2Sem21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Sem21_1sem21Conc(feature.properties.Var2Sem21)};
    }


function apagarVar2Sem21_1sem21Conc(e) {
    Var2Sem21_1sem21Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Sem21_1sem21Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2Sem21.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Sem21_1sem21Conc,
    });
}
var Var2Sem21_1sem21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2Sem21_1sem21Conc,
    onEachFeature: onEachFeatureVar2Sem21_1sem21Conc
});

let slideVar2Sem21_1sem21Conc = function(){
    var sliderVar2Sem21_1sem21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Sem21_1sem21Conc, {
        start: [minVar2Sem21_1sem21Conc, maxVar2Sem21_1sem21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Sem21_1sem21Conc,
            'max': maxVar2Sem21_1sem21Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2Sem21_1sem21Conc);
    inputNumberMax.setAttribute("value",maxVar2Sem21_1sem21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Sem21_1sem21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Sem21_1sem21Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2Sem21_1sem21Conc.noUiSlider.on('update',function(e){
        Var2Sem21_1sem21Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var2Sem21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2Sem21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Sem21_1sem21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderVar2Sem21_1sem21Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2Sem21_1sem21Conc);
} 

///////////////////////////// Fim da Variação 2 SEMESTRE 2021 E 1 SEMESTRE 2021 POR CONCELHOS -------------- \\\\\

//////////////////////////////////------------------------------ VARIAÇOES FREGUESIAS -------------\\\


/////////////////////////////------- Variação 1 SEMESTRE 2018 E 2 SEMESTRE 2017 POR FREGUESIA -------------------////

var minVar1Sem18_2sem17Freg = 999;
var maxVar1Sem18_2sem17Freg = 0;

function CorVar1Sem18_2sem17Freg(d) {
    return d === null ? '#808080':
        d >= 20  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 0 ? '#ff5e6e' :
        d >= -10  ? '#f5b3be' :
        d >= -22.87   ? '#9eaad7' :
                ''  ;
}

var legendaVar1Sem18_2sem17Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 1º semestre de 2018 e o 2º semestre de 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -22.86 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar1Sem18_2sem17Freg(feature) {
    if(feature.properties.Var1Sem18 <= minVar1Sem18_2sem17Freg){
        minVar1Sem18_2sem17Freg = feature.properties.Var1Sem18
    }
    if(feature.properties.Var1Sem18 > maxVar1Sem18_2sem17Freg){
        maxVar1Sem18_2sem17Freg = feature.properties.Var1Sem18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Sem18_2sem17Freg(feature.properties.Var1Sem18)};
    }


function apagarVar1Sem18_2sem17Freg(e) {
    Var1Sem18_2sem17Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Sem18_2sem17Freg(feature, layer) {
    if(feature.properties.Var1Sem18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem dados disponíveis' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var1Sem18.toFixed(2) + '%' + '</b>').openPopup()
    }  
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Sem18_2sem17Freg,
    });
}
var Var1Sem18_2sem17Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar1Sem18_2sem17Freg,
    onEachFeature: onEachFeatureVar1Sem18_2sem17Freg
});

let slideVar1Sem18_2sem17Freg = function(){
    var sliderVar1Sem18_2sem17Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Sem18_2sem17Freg, {
        start: [minVar1Sem18_2sem17Freg, maxVar1Sem18_2sem17Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Sem18_2sem17Freg,
            'max': maxVar1Sem18_2sem17Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar1Sem18_2sem17Freg);
    inputNumberMax.setAttribute("value",maxVar1Sem18_2sem17Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Sem18_2sem17Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Sem18_2sem17Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar1Sem18_2sem17Freg.noUiSlider.on('update',function(e){
        Var1Sem18_2sem17Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var1Sem18 == null){
                return false
            }
            if(layer.feature.properties.Var1Sem18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1Sem18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Sem18_2sem17Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderVar1Sem18_2sem17Freg.noUiSlider;
    $(slidersGeral).append(sliderVar1Sem18_2sem17Freg);
} 

///////////////////////////// Fim da Variação 1 SEMESTRE 2018 E 2 SEMESTRE 2017 POR FREGUESIA -------------- \\\\\


/////////////////////////////------- Variação 2 SEMESTRE 2018 E 1 SEMESTRE 2018 POR FREGUESIA -------------------////

var minVar2Sem18_1sem18Freg = 0;
var maxVar2Sem18_1sem18Freg = 0;

function CorVar2Sem18_1sem18Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#ff5e6e' :
        d >= 0 ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -24.2   ? '#2288bf' :
                ''  ;
}

var legendaVar2Sem18_1sem18Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 2º semestre de 2018 e o 1º semestre de 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -24.19 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Sem18_1sem18Freg(feature) {
    if(feature.properties.Var2Sem18 <= minVar2Sem18_1sem18Freg){
        minVar2Sem18_1sem18Freg = feature.properties.Var2Sem18
    }
    if(feature.properties.Var2Sem18 > maxVar2Sem18_1sem18Freg){
        maxVar2Sem18_1sem18Freg = feature.properties.Var2Sem18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Sem18_1sem18Freg(feature.properties.Var2Sem18)};
    }


function apagarVar2Sem18_1sem18Freg(e) {
    Var2Sem18_1sem18Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Sem18_1sem18Freg(feature, layer) {
    if(feature.properties.Var2Sem18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem dados disponíveis' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var2Sem18.toFixed(2) + '%' + '</b>').openPopup()
    }  
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Sem18_1sem18Freg,
    });
}
var Var2Sem18_1sem18Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2Sem18_1sem18Freg,
    onEachFeature: onEachFeatureVar2Sem18_1sem18Freg
});

let slideVar2Sem18_1sem18Freg = function(){
    var sliderVar2Sem18_1sem18Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Sem18_1sem18Freg, {
        start: [minVar2Sem18_1sem18Freg, maxVar2Sem18_1sem18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Sem18_1sem18Freg,
            'max': maxVar2Sem18_1sem18Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar2Sem18_1sem18Freg);
    inputNumberMax.setAttribute("value",maxVar2Sem18_1sem18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Sem18_1sem18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Sem18_1sem18Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar2Sem18_1sem18Freg.noUiSlider.on('update',function(e){
        Var2Sem18_1sem18Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var2Sem18 == null){
                return false
            }
            if(layer.feature.properties.Var2Sem18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2Sem18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Sem18_1sem18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderVar2Sem18_1sem18Freg.noUiSlider;
    $(slidersGeral).append(sliderVar2Sem18_1sem18Freg);
} 

///////////////////////////// Fim da Variação 2 SEMESTRE 2018 E 1 SEMESTRE 2018 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 1 SEMESTRE 2019 E 2 SEMESTRE 2018 POR FREGUESIA -------------------////

var minVar1Sem19_2sem18Freg = 0;
var maxVar1Sem19_2sem18Freg = 0;

function CorVar1Sem19_2sem18Freg(d) {
    return d === null ? '#808080':
        d >= 5  ? '#ff5e6e' : 
        d >=  0  ? '#f5b3be' :
        d >= -10 ? '#9eaad7' :
        d >= -20  ? '#2288bf' :
        d >= -36.18   ? '#155273' :
                ''  ;
}

var legendaVar1Sem19_2sem18Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 1º semestre de 2019 e o 2º semestre de 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -36.17 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Sem19_2sem18Freg(feature) {
    if(feature.properties.Var1Sem19 <= minVar1Sem19_2sem18Freg){
        minVar1Sem19_2sem18Freg = feature.properties.Var1Sem19
    }
    if(feature.properties.Var1Sem19 > maxVar1Sem19_2sem18Freg){
        maxVar1Sem19_2sem18Freg = feature.properties.Var1Sem19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Sem19_2sem18Freg(feature.properties.Var1Sem19)};
    }


function apagarVar1Sem19_2sem18Freg(e) {
    Var1Sem19_2sem18Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Sem19_2sem18Freg(feature, layer) {
    if(feature.properties.Var1Sem19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem dados disponíveis' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var1Sem19.toFixed(2) + '%' + '</b>').openPopup()
    }  
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Sem19_2sem18Freg,
    });
}
var Var1Sem19_2sem18Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar1Sem19_2sem18Freg,
    onEachFeature: onEachFeatureVar1Sem19_2sem18Freg
});

let slideVar1Sem19_2sem18Freg = function(){
    var sliderVar1Sem19_2sem18Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Sem19_2sem18Freg, {
        start: [minVar1Sem19_2sem18Freg, maxVar1Sem19_2sem18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Sem19_2sem18Freg,
            'max': maxVar1Sem19_2sem18Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar1Sem19_2sem18Freg);
    inputNumberMax.setAttribute("value",maxVar1Sem19_2sem18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Sem19_2sem18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Sem19_2sem18Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar1Sem19_2sem18Freg.noUiSlider.on('update',function(e){
        Var1Sem19_2sem18Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var1Sem19 == null){
                return false
            }
            if(layer.feature.properties.Var1Sem19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1Sem19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Sem19_2sem18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderVar1Sem19_2sem18Freg.noUiSlider;
    $(slidersGeral).append(sliderVar1Sem19_2sem18Freg);
} 

///////////////////////////// Fim da Variação 1 SEMESTRE 2019 E 2 SEMESTRE 2018 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 2 SEMESTRE 2019 E 1 SEMESTRE 2019 POR FREGUESIA -------------------////

var minVar2Sem19_1sem19Freg = 0;
var maxVar2Sem19_1sem19Freg = 0;

function CorVar2Sem19_1sem19Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' : 
        d >=  5  ? '#ff5e6e' :
        d >=  0 ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -24.08   ? '#2288bf' :
                ''  ;
}

var legendaVar2Sem19_1sem19Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 2º semestre de 2019 e o 1º semestre de 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -24.07 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Sem19_1sem19Freg(feature) {
    if(feature.properties.Var2Sem19 <= minVar2Sem19_1sem19Freg){
        minVar2Sem19_1sem19Freg = feature.properties.Var2Sem19
    }
    if(feature.properties.Var2Sem19 > maxVar2Sem19_1sem19Freg){
        maxVar2Sem19_1sem19Freg = feature.properties.Var2Sem19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Sem19_1sem19Freg(feature.properties.Var2Sem19)};
    }


function apagarVar2Sem19_1sem19Freg(e) {
    Var2Sem19_1sem19Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Sem19_1sem19Freg(feature, layer) {
    if(feature.properties.Var2Sem19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem dados disponíveis' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var2Sem19.toFixed(2) + '%' + '</b>').openPopup()
    }  
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Sem19_1sem19Freg,
    });
}
var Var2Sem19_1sem19Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2Sem19_1sem19Freg,
    onEachFeature: onEachFeatureVar2Sem19_1sem19Freg
});

let slideVar2Sem19_1sem19Freg = function(){
    var sliderVar2Sem19_1sem19Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Sem19_1sem19Freg, {
        start: [minVar2Sem19_1sem19Freg, maxVar2Sem19_1sem19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Sem19_1sem19Freg,
            'max': maxVar2Sem19_1sem19Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar2Sem19_1sem19Freg);
    inputNumberMax.setAttribute("value",maxVar2Sem19_1sem19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Sem19_1sem19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Sem19_1sem19Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar2Sem19_1sem19Freg.noUiSlider.on('update',function(e){
        Var2Sem19_1sem19Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var2Sem19 == null){
                return false
            }
            if(layer.feature.properties.Var2Sem19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2Sem19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Sem19_1sem19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVar2Sem19_1sem19Freg.noUiSlider;
    $(slidersGeral).append(sliderVar2Sem19_1sem19Freg);
} 

///////////////////////////// Fim da Variação 2 SEMESTRE 2019 E 1 SEMESTRE 2019 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 1 SEMESTRE 2020 E 2 SEMESTRE 2019 POR FREGUESIA -------------------////

var minVar1Sem20_2sem19Freg = 0;
var maxVar1Sem20_2sem19Freg = 0;

function CorVar1Sem20_2sem19Freg(d) {
    return d === null ? '#808080':
        d >= 20  ? '#de1f35' : 
        d >=  10  ? '#ff5e6e' :
        d >=  0 ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -28.9   ? '#2288bf' :
                ''  ;
}

var legendaVar1Sem20_2sem19Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 1º semestre de 2020 e o 2º semestre de 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -28.89 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Sem20_2sem19Freg(feature) {
    if(feature.properties.Var1Sem20 <= minVar1Sem20_2sem19Freg){
        minVar1Sem20_2sem19Freg = feature.properties.Var1Sem20
    }
    if(feature.properties.Var1Sem20 > maxVar1Sem20_2sem19Freg){
        maxVar1Sem20_2sem19Freg = feature.properties.Var1Sem20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Sem20_2sem19Freg(feature.properties.Var1Sem20)};
    }


function apagarVar1Sem20_2sem19Freg(e) {
    Var1Sem20_2sem19Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Sem20_2sem19Freg(feature, layer) {
    if(feature.properties.Var1Sem20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem dados disponíveis' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var1Sem20.toFixed(2) + '%' + '</b>').openPopup()
    }  
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Sem20_2sem19Freg,
    });
}
var Var1Sem20_2sem19Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar1Sem20_2sem19Freg,
    onEachFeature: onEachFeatureVar1Sem20_2sem19Freg
});

let slideVar1Sem20_2sem19Freg = function(){
    var sliderVar1Sem20_2sem19Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Sem20_2sem19Freg, {
        start: [minVar1Sem20_2sem19Freg, maxVar1Sem20_2sem19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Sem20_2sem19Freg,
            'max': maxVar1Sem20_2sem19Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar1Sem20_2sem19Freg);
    inputNumberMax.setAttribute("value",maxVar1Sem20_2sem19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Sem20_2sem19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Sem20_2sem19Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar1Sem20_2sem19Freg.noUiSlider.on('update',function(e){
        Var1Sem20_2sem19Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var1Sem20 == null){
                return false
            }
            if(layer.feature.properties.Var1Sem20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1Sem20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Sem20_2sem19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderVar1Sem20_2sem19Freg.noUiSlider;
    $(slidersGeral).append(sliderVar1Sem20_2sem19Freg);
} 

///////////////////////////// Fim da Variação 1 SEMESTRE 2020 E 2 SEMESTRE 2019 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 2 SEMESTRE 2020 E 1 SEMESTRE 2020 POR FREGUESIA -------------------////

var minVar2Sem20_1sem20Freg = 0;
var maxVar2Sem20_1sem20Freg = 0;

function CorVar2Sem20_1sem20Freg(d) {
    return d === null ? '#808080':
        d >= 20  ? '#de1f35' : 
        d >=  10  ? '#ff5e6e' :
        d >=  0 ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -25   ? '#2288bf' :
                ''  ;
}

var legendaVar2Sem20_1sem20Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 2º semestre de 2020 e o 1º semestre de 2020, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -24.39 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Sem20_1sem20Freg(feature) {
    if(feature.properties.Var2Sem20 <= minVar2Sem20_1sem20Freg){
        minVar2Sem20_1sem20Freg = feature.properties.Var2Sem20
    }
    if(feature.properties.Var2Sem20 > maxVar2Sem20_1sem20Freg){
        maxVar2Sem20_1sem20Freg = feature.properties.Var2Sem20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Sem20_1sem20Freg(feature.properties.Var2Sem20)};
    }


function apagarVar2Sem20_1sem20Freg(e) {
    Var2Sem20_1sem20Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Sem20_1sem20Freg(feature, layer) {
    if(feature.properties.Var2Sem20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem dados disponíveis' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var2Sem20.toFixed(2) + '%' + '</b>').openPopup()
    }  
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Sem20_1sem20Freg,
    });
}
var Var2Sem20_1sem20Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2Sem20_1sem20Freg,
    onEachFeature: onEachFeatureVar2Sem20_1sem20Freg
});

let slideVar2Sem20_1sem20Freg = function(){
    var sliderVar2Sem20_1sem20Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Sem20_1sem20Freg, {
        start: [minVar2Sem20_1sem20Freg, maxVar2Sem20_1sem20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Sem20_1sem20Freg,
            'max': maxVar2Sem20_1sem20Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar2Sem20_1sem20Freg);
    inputNumberMax.setAttribute("value",maxVar2Sem20_1sem20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Sem20_1sem20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Sem20_1sem20Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar2Sem20_1sem20Freg.noUiSlider.on('update',function(e){
        Var2Sem20_1sem20Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var2Sem20 == null){
                return false
            }
            if(layer.feature.properties.Var2Sem20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2Sem20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Sem20_1sem20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderVar2Sem20_1sem20Freg.noUiSlider;
    $(slidersGeral).append(sliderVar2Sem20_1sem20Freg);
} 

///////////////////////////// Fim da Variação 2 SEMESTRE 2020 E 1 SEMESTRE 2020 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 1 SEMESTRE 2021 E 2 SEMESTRE 2020 POR FREGUESIA -------------------////

var minVar1Sem21_2sem20Freg = 0;
var maxVar1Sem21_2sem20Freg = 0;

function CorVar1Sem21_2sem20Freg(d) {
    return d === null ? '#808080':
        d >= 20  ? '#de1f35' : 
        d >=  10  ? '#ff5e6e' :
        d >=  0 ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -24.4  ? '#2288bf' :
                ''  ;
}

var legendaVar1Sem21_2sem20Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 1º semestre de 2021 e o 2º semestre de 2020, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -24.39 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'


    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Sem21_2sem20Freg(feature) {
    if(feature.properties.Var1Sem21 <= minVar1Sem21_2sem20Freg){
        minVar1Sem21_2sem20Freg = feature.properties.Var1Sem21
    }
    if(feature.properties.Var1Sem21 > maxVar1Sem21_2sem20Freg){
        maxVar1Sem21_2sem20Freg = feature.properties.Var1Sem21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Sem20_1sem20Freg(feature.properties.Var1Sem21)};
    }


function apagarVar1Sem21_2sem20Freg(e) {
    Var1Sem21_2sem20Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Sem21_2sem20Freg(feature, layer) {
    if(feature.properties.Var1Sem21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem dados disponíveis' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var1Sem21.toFixed(2) + '%' + '</b>').openPopup()
    }  
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Sem21_2sem20Freg,
    });
}
var Var1Sem21_2sem20Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar1Sem21_2sem20Freg,
    onEachFeature: onEachFeatureVar1Sem21_2sem20Freg
});

let slideVar1Sem21_2sem20Freg = function(){
    var sliderVar1Sem21_2sem20Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Sem21_2sem20Freg, {
        start: [minVar1Sem21_2sem20Freg, maxVar1Sem21_2sem20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Sem21_2sem20Freg,
            'max': maxVar1Sem21_2sem20Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar1Sem21_2sem20Freg);
    inputNumberMax.setAttribute("value",maxVar1Sem21_2sem20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Sem21_2sem20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Sem21_2sem20Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar1Sem21_2sem20Freg.noUiSlider.on('update',function(e){
        Var1Sem21_2sem20Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var1Sem21 == null){
                return false
            }
            if(layer.feature.properties.Var1Sem21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1Sem21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Sem21_2sem20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderVar1Sem21_2sem20Freg.noUiSlider;
    $(slidersGeral).append(sliderVar1Sem21_2sem20Freg);
} 

///////////////////////////// Fim da Variação 1 SEMESTRE 2021 E 2 SEMESTRE 2020 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 2 SEMESTRE 2021 E 1 SEMESTRE 2021 POR FREGUESIA -------------------////

var minVar2Sem21_1sem21Freg = 0;
var maxVar2Sem21_1sem21Freg = 0;

function CorVar2Sem21_1sem21Freg(d) {
    return d === null ? '#808080':
        d >= 25  ? '#de1f35' : 
        d >=  10  ? '#ff5e6e' :
        d >=  0 ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -23  ? '#2288bf' :
                ''  ;
}

var legendaVar2Sem21_1sem21Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de novos contratos de arrendamento, entre o 2º semestre de 2021 e o 1º semestre de 2021, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -22.34 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Sem21_1sem21Freg(feature) {
    if(feature.properties.Var2Sem21 <= minVar2Sem21_1sem21Freg){
        minVar2Sem21_1sem21Freg = feature.properties.Var2Sem21
    }
    if(feature.properties.Var2Sem21 > maxVar2Sem21_1sem21Freg){
        maxVar2Sem21_1sem21Freg = feature.properties.Var2Sem21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Sem21_1sem21Freg(feature.properties.Var2Sem21)};
    }


function apagarVar2Sem21_1sem21Freg(e) {
    Var2Sem21_1sem21Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Sem21_1sem21Freg(feature, layer) {
    if(feature.properties.Var2Sem21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem dados disponíveis' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var2Sem21.toFixed(2) + '%' + '</b>').openPopup()
    }  
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Sem21_1sem21Freg,
    });
}
var Var2Sem21_1sem21Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2Sem21_1sem21Freg,
    onEachFeature: onEachFeatureVar2Sem21_1sem21Freg
});

let slideVar2Sem21_1sem21Freg = function(){
    var sliderVar2Sem21_1sem21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Sem21_1sem21Freg, {
        start: [minVar2Sem21_1sem21Freg, maxVar2Sem21_1sem21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Sem21_1sem21Freg,
            'max': maxVar2Sem21_1sem21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar2Sem21_1sem21Freg);
    inputNumberMax.setAttribute("value",maxVar2Sem21_1sem21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Sem21_1sem21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Sem21_1sem21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar2Sem21_1sem21Freg.noUiSlider.on('update',function(e){
        Var2Sem21_1sem21Freg.eachLayer(function(layer){
            if (layer.feature.properties.Var2Sem21 == null){
                return false
            }
            if(layer.feature.properties.Var2Sem21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2Sem21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Sem21_1sem21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderVar2Sem21_1sem21Freg.noUiSlider;
    $(slidersGeral).append(sliderVar2Sem21_1sem21Freg);
} 

// ///////////////////////////// Fim da Variação 2 SEMESTRE 2021 E 1 SEMESTRE 2021 POR FREGUESIAS -------------- \\\\\



/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = Contrato2Semestre17Conc;
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
    if (layer == Contrato2Semestre17Conc && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2017, por concelho.' + '</strong>');
        legenda(maxContrato2Semestre17Conc, ((maxContrato2Semestre17Conc-minContrato2Semestre17Conc)/2).toFixed(0),minContrato2Semestre17Conc,0.6);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideContrato2Semestre17Conc();
        naoDuplicar = 1;
    }
    if (layer == Contrato2Semestre17Conc && naoDuplicar == 1){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2017, por concelho.' + '</strong>');
        contorno.addTo(map);
    }
    if (layer == Contrato1Semestre18Conc && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 1º semestre de 2018, por concelho.' + '</strong>');
        legenda(maxContrato1Semestre18Conc, ((maxContrato1Semestre18Conc-minContrato1Semestre18Conc)/2).toFixed(0),minContrato1Semestre18Conc,0.6);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideContrato1Semestre18Conc();
        naoDuplicar = 2;
    }
    if (layer == Contrato2Semestre18Conc && naoDuplicar != 3){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2018, por concelho.' + '</strong>');
        legenda(maxContrato2Semestre18Conc, ((maxContrato2Semestre18Conc-minContrato2Semestre18Conc)/2).toFixed(0),minContrato2Semestre18Conc,0.6);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideContrato2Semestre18Conc();
        naoDuplicar = 3;
    }
    if (layer == Contrato1Semestre19Conc && naoDuplicar != 4){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 1º semestre de 2019, por concelho.' + '</strong>');
        legenda(maxContrato1Semestre19Conc, ((maxContrato1Semestre19Conc-minContrato1Semestre19Conc)/2).toFixed(0),minContrato1Semestre19Conc,0.6);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideContrato1Semestre19Conc();
        naoDuplicar = 4;
    }
    if (layer == Contrato2Semestre19Conc && naoDuplicar != 5){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2019, por concelho.' + '</strong>');
        legenda(maxContrato2Semestre19Conc, ((maxContrato2Semestre19Conc-minContrato2Semestre19Conc)/2).toFixed(0),minContrato2Semestre19Conc,0.6);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideContrato2Semestre19Conc();
        naoDuplicar = 5;
    }
    if (layer == Contrato1Semestre20Conc && naoDuplicar != 6){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 1º semestre de 2020, por concelho.' + '</strong>');
        legenda(maxContrato1Semestre20Conc, ((maxContrato1Semestre20Conc-minContrato1Semestre20Conc)/2).toFixed(0),minContrato1Semestre20Conc,0.6);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideContrato1Semestre20Conc();
        naoDuplicar = 6;
    }
    if (layer == Contrato2Semestre20Conc && naoDuplicar != 7){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2020, por concelho.' + '</strong>');
        legenda(maxContrato2Semestre20Conc, ((maxContrato2Semestre20Conc-minContrato2Semestre20Conc)/2).toFixed(0),minContrato2Semestre20Conc,0.6);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideContrato2Semestre20Conc();
        naoDuplicar = 7;
    }
    if (layer == Contrato1Semestre21Conc && naoDuplicar != 8){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 1º semestre de 2021, por concelho.' + '</strong>');
        legenda(maxContrato1Semestre21Conc, ((maxContrato1Semestre21Conc-minContrato1Semestre21Conc)/2).toFixed(0),minContrato1Semestre21Conc,0.6);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideContrato1Semestre21Conc();
        naoDuplicar = 8;
    }
    if (layer == Contrato2Semestre21Conc && naoDuplicar != 9){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2021, por concelho.' + '</strong>');
        legenda(maxContrato2Semestre21Conc, ((maxContrato2Semestre21Conc-minContrato2Semestre21Conc)/2).toFixed(0),minContrato2Semestre21Conc,0.6);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideContrato2Semestre21Conc();
        naoDuplicar = 9;
    }
    if (layer == Contrato2Semestre17Freg && naoDuplicar != 10){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2017, por freguesia.' + '</strong>');
        legenda(maxContrato2Semestre17Freg, ((maxContrato2Semestre17Freg-minContrato2Semestre17Freg)/2).toFixed(0),minContrato2Semestre17Freg,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideContrato2Semestre17Freg();
        naoDuplicar = 10;
    }
    if (layer == Contrato1Semestre18Freg && naoDuplicar != 11){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 1º semestre de 2018, por freguesia.' + '</strong>');
        legenda(maxContrato1Semestre18Freg, ((maxContrato1Semestre18Freg-minContrato1Semestre18Freg)/2).toFixed(0),minContrato1Semestre18Freg,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideContrato1Semestre18Freg();
        naoDuplicar = 11;
    }
    if (layer == Contrato2Semestre18Freg && naoDuplicar != 12){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2018, por freguesia.' + '</strong>');
        legenda(maxContrato2Semestre18Freg, ((maxContrato2Semestre18Freg-minContrato2Semestre18Freg)/2).toFixed(0),minContrato2Semestre18Freg,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideContrato2Semestre18Freg();
        naoDuplicar = 12;
    }
    if (layer == Contrato1Semestre19Freg && naoDuplicar != 13){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 1º semestre de 2019, por freguesia.' + '</strong>');
        legenda(maxContrato1Semestre19Freg, ((maxContrato1Semestre19Freg-minContrato1Semestre19Freg)/2).toFixed(0),minContrato1Semestre19Freg,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideContrato1Semestre19Freg();
        naoDuplicar = 13;
    }
    if (layer == Contrato2Semestre19Freg && naoDuplicar != 14){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2019, por freguesia.' + '</strong>');
        legenda(maxContrato2Semestre19Freg, ((maxContrato2Semestre19Freg-minContrato2Semestre19Freg)/2).toFixed(0),minContrato2Semestre19Freg,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideContrato2Semestre19Freg();
        naoDuplicar = 14;
    }
    if (layer == Contrato1Semestre20Freg && naoDuplicar != 15){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 1º semestre de 2020, por freguesia.' + '</strong>');
        legenda(maxContrato1Semestre20Freg, ((maxContrato1Semestre20Freg-minContrato1Semestre20Freg)/2).toFixed(0),minContrato1Semestre20Freg,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideContrato1Semestre20Freg();
        naoDuplicar = 15;
    }
    if (layer == Contrato2Semestre20Freg && naoDuplicar != 16){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2020, por freguesia.' + '</strong>');
        legenda(maxContrato2Semestre20Freg, ((maxContrato2Semestre20Freg-minContrato2Semestre20Freg)/2).toFixed(0),minContrato2Semestre20Freg,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideContrato2Semestre20Freg();
        naoDuplicar = 16;
    }
    if (layer == Contrato1Semestre21Freg && naoDuplicar != 17){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 1º semestre de 2021, por freguesia.' + '</strong>');
        legenda(maxContrato1Semestre21Freg, ((maxContrato1Semestre21Freg-minContrato1Semestre21Freg)/2).toFixed(0),minContrato1Semestre21Freg,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideContrato1Semestre21Freg();
        naoDuplicar = 17;
    }
    if (layer == Contrato2Semestre21Freg && naoDuplicar != 18){
        $('#tituloMapa').html(' <strong>' + 'Número de novos contratos de arrendamento, no 2º semestre de 2021, por freguesia.' + '</strong>');
        legenda(maxContrato2Semestre21Freg, ((maxContrato2Semestre21Freg-minContrato2Semestre21Freg)/2).toFixed(0),minContrato2Semestre21Freg,0.8);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideContrato2Semestre21Freg();
        naoDuplicar = 18;
    }
    if (layer == Var1Sem18_2sem17Conc && naoDuplicar != 19){
        legendaVar1Sem18_2sem17Conc();
        slideVar1Sem18_2sem17Conc();
        naoDuplicar = 19;
    }
    if (layer == Var2Sem18_1sem18Conc && naoDuplicar != 20){
        legendaVar2Sem18_1sem18Conc();
        slideVar2Sem18_1sem18Conc();
        naoDuplicar = 20;
    }
    if (layer == Var1Sem19_2sem18Conc && naoDuplicar != 21){
        legendaVar1Sem19_2sem18Conc();
        slideVar1Sem19_2sem18Conc();
        naoDuplicar = 21;
    }
    if (layer == Var2Sem19_1sem19Conc && naoDuplicar != 22){
        legendaVar2Sem19_1sem19Conc();
        slideVar2Sem19_1sem19Conc();
        naoDuplicar = 22;
    }
    if (layer == Var1Sem20_2sem19Conc && naoDuplicar != 23){
        legendaVar1Sem20_2sem19Conc();
        slideVar1Sem20_2sem19Conc();
        naoDuplicar = 23;
    }
    if (layer == Var2Sem20_1sem20Conc && naoDuplicar != 24){
        legendaVar2Sem20_1sem20Conc();
        slideVar2Sem20_1sem20Conc();
        naoDuplicar = 24;
    }
    if (layer == Var1Sem21_2sem20Conc && naoDuplicar != 25){
        legendaVar1Sem21_2sem20Conc();
        slideVar1Sem21_2sem20Conc();
        naoDuplicar = 25;
    }
    if (layer == Var2Sem21_1sem21Conc && naoDuplicar != 26){
        legendaVar2Sem21_1sem21Conc();
        slideVar2Sem21_1sem21Conc();
        naoDuplicar = 26;
    }
    if (layer == Var1Sem18_2sem17Freg && naoDuplicar != 27){
        legendaVar1Sem18_2sem17Freg();
        slideVar1Sem18_2sem17Freg();
        naoDuplicar = 27;
    }
    if (layer == Var2Sem18_1sem18Freg && naoDuplicar != 28){
        legendaVar2Sem18_1sem18Freg();
        slideVar2Sem18_1sem18Freg();
        naoDuplicar = 28;
    }
    if (layer == Var1Sem19_2sem18Freg && naoDuplicar != 29){
        legendaVar1Sem19_2sem18Freg();
        slideVar1Sem19_2sem18Freg();
        naoDuplicar = 29;
    }
    if (layer == Var2Sem19_1sem19Freg && naoDuplicar != 30){
        legendaVar2Sem19_1sem19Freg();
        slideVar2Sem19_1sem19Freg();
        naoDuplicar = 30;
    }
    if (layer == Var1Sem20_2sem19Freg && naoDuplicar != 31){
        legendaVar1Sem20_2sem19Freg();
        slideVar1Sem20_2sem19Freg();
        naoDuplicar = 31;
    }
    if (layer == Var2Sem20_1sem20Freg && naoDuplicar != 32){
        legendaVar2Sem20_1sem20Freg();
        slideVar2Sem20_1sem20Freg();
        naoDuplicar = 32;
    }
    if (layer == Var1Sem21_2sem20Freg && naoDuplicar != 33){
        legendaVar1Sem21_2sem20Freg();
        slideVar1Sem21_2sem20Freg();
        naoDuplicar = 33;
    }
    if (layer == Var2Sem21_1sem21Freg && naoDuplicar != 34){
        legendaVar2Sem21_1sem21Freg();
        slideVar2Sem21_1sem21Freg();
        naoDuplicar = 34;
    }
    
    layer.addTo(map);
    layerAtiva = layer;  
}
function myFunction() {
    var semestre = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#absoluto').hasClass('active4')){
            if (semestre == "2Sem17"){
                novaLayer(Contrato2Semestre17Conc)
            }
            if (semestre == "1Sem18"){
                novaLayer(Contrato1Semestre18Conc)
            }
            if (semestre == "2Sem18"){
                novaLayer(Contrato2Semestre18Conc)
            }
            if (semestre == "1Sem19"){
                novaLayer(Contrato1Semestre19Conc)
            }
            if (semestre == "2Sem19"){
                novaLayer(Contrato2Semestre19Conc)
            }
            if (semestre == "1Sem20"){
                novaLayer(Contrato1Semestre20Conc)
            }
            if (semestre == "2Sem20"){
                novaLayer(Contrato2Semestre20Conc)
            }
            if (semestre == "1Sem21"){
                novaLayer(Contrato1Semestre21Conc)
            }
            if (semestre == "2Sem21"){
                novaLayer(Contrato2Semestre21Conc)
            }
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if (semestre == "1Sem18"){
                novaLayer(Var1Sem18_2sem17Conc)
            }
            if (semestre == "2Sem18"){
                novaLayer(Var2Sem18_1sem18Conc)
            }
            if (semestre == "1Sem19"){
                novaLayer(Var1Sem19_2sem18Conc)
            }
            if (semestre == "2Sem19"){
                novaLayer(Var2Sem19_1sem19Conc)
            }
            if (semestre == "1Sem20"){
                novaLayer(Var1Sem20_2sem19Conc)
            }
            if (semestre == "2Sem20"){
                novaLayer(Var2Sem20_1sem20Conc)
            }
            if (semestre == "1Sem21"){
                novaLayer(Var1Sem21_2sem20Conc)
            }
            if (semestre == "2Sem21"){
                novaLayer(Var2Sem21_1sem21Conc)
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#absoluto').hasClass('active5')){
            notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, <strong>não devendo, assim, comparar com os círculos à escala do concelho.</strong>')
            if (semestre == "2Sem17"){
                novaLayer(Contrato2Semestre17Freg)
            }
            if (semestre == "1Sem18"){
                novaLayer(Contrato1Semestre18Freg)
            }
            if (semestre == "2Sem18"){
                novaLayer(Contrato2Semestre18Freg)
            }
            if (semestre == "1Sem19"){
                novaLayer(Contrato1Semestre19Freg)
            }
            if (semestre == "2Sem19"){
                novaLayer(Contrato2Semestre19Freg)
            }
            if (semestre == "1Sem20"){
                novaLayer(Contrato1Semestre20Freg)
            }
            if (semestre == "2Sem20"){
                novaLayer(Contrato2Semestre20Freg)
            }
            if (semestre == "1Sem21"){
                novaLayer(Contrato1Semestre21Freg)
            }
            if (semestre == "2Sem21"){
                novaLayer(Contrato2Semestre21Freg)
            }
        }
        if ($('#taxaVariacao').hasClass('active5')){
            $('#notaRodape').remove();
            if (semestre == "1Sem18"){
                novaLayer(Var1Sem18_2sem17Freg)
            }
            if (semestre == "2Sem18"){
                novaLayer(Var2Sem18_1sem18Freg)
            }
            if (semestre == "1Sem19"){
                novaLayer(Var1Sem19_2sem18Freg)
            }
            if (semestre == "2Sem19"){
                novaLayer(Var2Sem19_1sem19Freg)
            }
            if (semestre == "1Sem20"){
                novaLayer(Var1Sem20_2sem19Freg)
            }
            if (semestre == "2Sem20"){
                novaLayer(Var2Sem20_1sem20Freg)
            }
            if (semestre == "1Sem21"){
                novaLayer(Var1Sem21_2sem20Freg)
            }
            if (semestre == "2Sem21"){
                novaLayer(Var2Sem21_1sem21Freg)
            }
        }
    }
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
let primeirovalor = function(ano){
    $("#mySelect").val(ano);
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
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
    tamanhoOutros();
    fonteTitulo('N');
}
let reporAnos = function(){
    $('#mySelect').empty();
    if($('#absoluto').hasClass('active4') ||$('#absoluto').hasClass('active5')){
        $('#mySelect').append("<option value='2Sem17'>2º, 2017</option>");
        $('#mySelect').append("<option value='1Sem18'>1º, 2018</option>");
        $('#mySelect').append("<option value='2Sem18'>2º, 2018</option>");
        $('#mySelect').append("<option value='1Sem19'>1º, 2019</option>");
        $('#mySelect').append("<option value='2Sem19'>2º, 2019</option>");
        $('#mySelect').append("<option value='1Sem20'>1º, 2020</option>");
        $('#mySelect').append("<option value='2Sem20'>2º, 2020</option>");
        $('#mySelect').append("<option value='1Sem21'>1º, 2021</option>");
        $('#mySelect').append("<option value='2Sem21'>2º, 2021</option>");
        primeirovalor('2Sem17');
    }
    if($('#taxaVariacao').hasClass('active4') ||$('#taxaVariacao').hasClass('active5')){
        $('#mySelect').append("<option value='1Sem18'>1º, 2018 - 2º, 2017</option>");
        $('#mySelect').append("<option value='2Sem18'>2º, 2018 - 1º, 2018</option>");
        $('#mySelect').append("<option value='1Sem19'>1º, 2019 - 2º, 2018</option>");
        $('#mySelect').append("<option value='2Sem19'>2º, 2019 - 1º, 2019</option>");
        $('#mySelect').append("<option value='1Sem20'>1º, 2020 - 2º, 2019</option>");
        $('#mySelect').append("<option value='2Sem20'>2º, 2020 - 1º, 2020</option>");
        $('#mySelect').append("<option value='1Sem21'>1º, 2021 - 2º, 2020</option>");
        $('#mySelect').append("<option value='2Sem21'>2º, 2021 - 1º, 2021</option>");
        primeirovalor('1Sem18');
    }
}

$('#absoluto').click(function(){
    mudarEscala();
});
$('#taxaVariacao').click(function(){
    mudarEscala();
    fonteTitulo('F');
});
$('#mySelect').change(function(){
    myFunction();
})
$('#freguesias').click(function(){
    variaveisMapaFreguesias();
});
$('#concelho').click(function(){
    variaveisMapaConcelho();
});

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
    
    $('#tabelaDadosAbsolutos').attr("class","btn");
    $('#tabelaVariacao').attr("class","btn");

    $('#metaInformacao').css("visibility","visible");
    $('.btn').css("top","50%")
})

$('#opcaoMapa').click(function(){
    $('#tituloMapa').css('font-size',"9pt")
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
    $('#tituloMapa').css('font-size',"10pt")
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

    $('#absoluto').attr("class","butao");
    $('#taxaVariacao').attr("class","butao");
    $('#opcaoFonte').css("visibility","visible");
    
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
    DadosAbsolutos();   
});

function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
var DadosAbsolutos = function(){
    $('#tituloMapa').html('Número de novos contratos de arrendamento, entre o 2º semestre de 2017 e 2021, €.');
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/ContratosArrendamento.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $('#2').html("2")
        $('#2017').html("2017")
        $.each(data, function(key, value){
            dados += '<tr>';
            if(containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                dados += '<td class="borderbottom bordertop">'+value.Contratos+'</td>';
                dados += '<td class="borderbottom bordertop">'+ ''+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Semestre2017+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P1Semestre2018+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Semestre2018+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P1Semestre2019+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Semestre2019+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P1Semestre2020+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Semestre2020+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P1Semestre2021+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Semestre2021+'</td>';
            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                dados += '<td>'+value.Contratos+'</td>';
                dados += '<td>'+ ''+'</td>';
                dados += '<td>'+value.P2Semestre2017+'</td>';
                dados += '<td>'+value.P1Semestre2018+'</td>';
                dados += '<td>'+value.P2Semestre2018+'</td>';
                dados += '<td>'+value.P1Semestre2019+'</td>';
                dados += '<td>'+value.P2Semestre2019+'</td>';
                dados += '<td>'+value.P1Semestre2020+'</td>';
                dados += '<td>'+value.P2Semestre2020+'</td>';
                dados += '<td>'+value.P1Semestre2021+'</td>';
                dados += '<td>'+value.P2Semestre2021+'</td>';
                dados += '<tr>';
            }
            dados += '<tr>';
        })
    $('#juntarValores').append(dados);   
    });
})};

$('#tabelaVariacao').click(function(){  
    $('#tituloMapa').html('Variação do número de novos contratos de arrendamento, entre o 1º semestre de 2018 e o 2º semestre de 2017, por concelho, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/ContratosArrendamento.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2').html(" ")
            $('#2017').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+value.Contratos+'</td>';
                    dados += '<td class="borderbottom bordertop">'+ ''+'</td>';
                    dados += '<td class="borderbottom bordertop">'+ ''+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var1Sem18+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var2Sem18+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var1Sem19+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var2Sem19+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var1Sem20+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var2Sem20+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var1Sem21+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var2Sem21+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Contratos+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.Var1Sem18+'</td>';
                    dados += '<td>'+value.Var2Sem18+'</td>';
                    dados += '<td>'+value.Var1Sem19+'</td>';
                    dados += '<td>'+value.Var2Sem19+'</td>';
                    dados += '<td>'+value.Var1Sem20+'</td>';
                    dados += '<td>'+value.Var2Sem20+'</td>';
                    dados += '<td>'+value.Var1Sem21+'</td>';
                    dados += '<td>'+value.Var2Sem21+'</td>';

                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

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

let anosSelecionados = function() {
    let semestre = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2")){
        if (semestre != "2Sem21" || semestre != "2Sem17"){
            i = 1
        }
        if (semestre == "2Sem21"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (semestre == "2Sem17"){
            i = 0;
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (semestre != "2Sem21" || semestre != "2Sem17"){
            i = 1
        }
        if (semestre == "2Sem21"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (semestre == "2Sem17"){
            i = 0;
        }
    }
    if ($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        if (semestre != "2Sem21"){
            i = 1 ;
        }
        if (semestre == "2Sem21"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (semestre == "1Sem18"){
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
    event.target.style.width = `${tempSelectWidth +15}px`;
    tempSelect.remove();
});
     
alterarTamanho.dispatchEvent(new Event('change'));
