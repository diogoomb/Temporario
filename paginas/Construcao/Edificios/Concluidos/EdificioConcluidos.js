// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Estatísticas das obras concluídas';
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
//////////// PROPORÇÃO
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




///////////////////////////----------------------- DADOS ABSOLUTOS, CONCELHO --------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL EDIFICIOS CONCLUIDOS 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosConc14 = 99999;
var maxTotalEdificiosConc14 = 0;
function estiloTotalEdificiosConc14(feature, latlng) {
    if(feature.properties.Edi_T_Ob14< minTotalEdificiosConc14 || feature.properties.Edi_T_Ob14 ===0){
        minTotalEdificiosConc14 = feature.properties.Edi_T_Ob14
    }
    if(feature.properties.Edi_T_Ob14> maxTotalEdificiosConc14){
        maxTotalEdificiosConc14 = feature.properties.Edi_T_Ob14
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob14,1.8)
    });
}
function apagarTotalEdificiosConc14(e){
    var layer = e.target;
    TotalEdificiosConc14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc14(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Ob14 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc14,
    })
};

var TotalEdificiosConc14= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalEdificiosConc14,
    onEachFeature: onEachFeatureTotalEdificiosConc14,
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




var slideTotalEdificiosConc14 = function(){
    var sliderTotalEdificiosConc14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc14, {
        start: [minTotalEdificiosConc14, maxTotalEdificiosConc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc14,
            'max': maxTotalEdificiosConc14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc14);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc14);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc14.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc14.noUiSlider.on('update',function(e){
        TotalEdificiosConc14.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob14>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotalEdificiosConc14.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc14);
}
contorno.addTo(map)
TotalEdificiosConc14.addTo(map)
$('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos, em 2014, por concelho.' + '</strong>');
legenda(maxTotalEdificiosConc14, ((maxTotalEdificiosConc14-minTotalEdificiosConc14)/2).toFixed(0),minTotalEdificiosConc14,1.8);
slideTotalEdificiosConc14();

///////////////////////////-------------  FIM TOTAL EDIFICIOS CONCLUIDOS 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////----------- Total Edificios Construção Nova concluídos 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaConc14 = 99999;
var maxEdificiosConsNovaConc14 = 0;
function estiloEdificiosConsNovaConc14(feature, latlng) {
    if(feature.properties.Edi_T_Co14< minEdificiosConsNovaConc14 || feature.properties.Edi_T_Co14 ===0){
        minEdificiosConsNovaConc14 = feature.properties.Edi_T_Co14
    }
    if(feature.properties.Edi_T_Co14> maxEdificiosConsNovaConc14){
        maxEdificiosConsNovaConc14 = feature.properties.Edi_T_Co14
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co14,1.8)
    });
}
function apagarEdificiosConsNovaConc14(e){
    var layer = e.target;
    EdificiosConsNovaConc14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaConc14(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Co14 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaConc14,
    })
};

var EdificiosConsNovaConc14= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosConsNovaConc14,
    onEachFeature: onEachFeatureEdificiosConsNovaConc14,
});

var slideEdificiosConsNovaConc14 = function(){
    var sliderEdificiosConsNovaConc14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaConc14, {
        start: [minEdificiosConsNovaConc14, maxEdificiosConsNovaConc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaConc14,
            'max': maxEdificiosConsNovaConc14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaConc14);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaConc14);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaConc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaConc14.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaConc14.noUiSlider.on('update',function(e){
        EdificiosConsNovaConc14.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co14>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaConc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderEdificiosConsNovaConc14.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaConc14);
}

///////////////////////////-------------  FIM Total Edificios Construção Nova concluídos 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Total Edificios Ampliação concluídos 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacaoConc14 = 99999;
var maxEdificiosAmpliacaoConc14 = 0;
function estiloEdificiosAmpliacaoConc14(feature, latlng) {
    if(feature.properties.Edi_T_Am14< minEdificiosAmpliacaoConc14 || feature.properties.Edi_T_Am14 ===0){
        minEdificiosAmpliacaoConc14 = feature.properties.Edi_T_Am14
    }
    if(feature.properties.Edi_T_Am14> maxEdificiosAmpliacaoConc14){
        maxEdificiosAmpliacaoConc14 = feature.properties.Edi_T_Am14
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am14,1.8)
    });
}
function apagarEdificiosAmpliacaoConc14(e){
    var layer = e.target;
    EdificiosAmpliacaoConc14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacaoConc14(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Am14 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacaoConc14,
    })
};

var EdificiosAmpliacaoConc14= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacaoConc14,
    onEachFeature: onEachFeatureEdificiosAmpliacaoConc14,
});

var slideEdificiosAmpliacaoConc14 = function(){
    var sliderEdificiosAmpliacaoConc14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacaoConc14, {
        start: [minEdificiosAmpliacaoConc14, maxEdificiosAmpliacaoConc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacaoConc14,
            'max': maxEdificiosAmpliacaoConc14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacaoConc14);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacaoConc14);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc14.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacaoConc14.noUiSlider.on('update',function(e){
        EdificiosAmpliacaoConc14.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am14>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacaoConc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderEdificiosAmpliacaoConc14.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacaoConc14);
}

///////////////////////////-------------  FIM Total Edificios Ampliação concluídos 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL EDIFICIOS CONCLUIDOS 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosConc15 = 99999;
var maxTotalEdificiosConc15 = 0;
function estiloTotalEdificiosConc15(feature, latlng) {
    if(feature.properties.Edi_T_Ob15< minTotalEdificiosConc15 || feature.properties.Edi_T_Ob15 ===0){
        minTotalEdificiosConc15 = feature.properties.Edi_T_Ob15
    }
    if(feature.properties.Edi_T_Ob15> maxTotalEdificiosConc15){
        maxTotalEdificiosConc15 = feature.properties.Edi_T_Ob15
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob15,1.8)
    });
}
function apagarTotalEdificiosConc15(e){
    var layer = e.target;
    TotalEdificiosConc15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc15(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Ob15 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc15,
    })
};

var TotalEdificiosConc15= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalEdificiosConc15,
    onEachFeature: onEachFeatureTotalEdificiosConc15,
});

var slideTotalEdificiosConc15 = function(){
    var sliderTotalEdificiosConc15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc15, {
        start: [minTotalEdificiosConc15, maxTotalEdificiosConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc15,
            'max': maxTotalEdificiosConc15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc15);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc15.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc15.noUiSlider.on('update',function(e){
        TotalEdificiosConc15.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob15>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderTotalEdificiosConc15.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc15);
}

///////////////////////////-------------  FIM TOTAL EDIFICIOS CONCLUIDOS 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- Total Edificios Construção Nova concluídos 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaConc15 = 99999;
var maxEdificiosConsNovaConc15 = 0;
function estiloEdificiosConsNovaConc15(feature, latlng) {
    if(feature.properties.Edi_T_Co15< minEdificiosConsNovaConc15 || feature.properties.Edi_T_Co15 ===0){
        minEdificiosConsNovaConc15 = feature.properties.Edi_T_Co15
    }
    if(feature.properties.Edi_T_Co15> maxEdificiosConsNovaConc15){
        maxEdificiosConsNovaConc15 = feature.properties.Edi_T_Co15
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co15,1.8)
    });
}
function apagarEdificiosConsNovaConc15(e){
    var layer = e.target;
    EdificiosConsNovaConc15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaConc15(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Co15 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaConc15,
    })
};

var EdificiosConsNovaConc15= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosConsNovaConc15,
    onEachFeature: onEachFeatureEdificiosConsNovaConc15,
});

var slideEdificiosConsNovaConc15 = function(){
    var sliderEdificiosConsNovaConc15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaConc15, {
        start: [minEdificiosConsNovaConc15, maxEdificiosConsNovaConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaConc15,
            'max': maxEdificiosConsNovaConc15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaConc15);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaConc15.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaConc15.noUiSlider.on('update',function(e){
        EdificiosConsNovaConc15.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co15>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderEdificiosConsNovaConc15.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaConc15);
}

///////////////////////////-------------  FIM Total Edificios Construção Nova concluídos 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Total Edificios Ampliação concluídos 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacaoConc15 = 99999;
var maxEdificiosAmpliacaoConc15 = 0;
function estiloEdificiosAmpliacaoConc15(feature, latlng) {
    if(feature.properties.Edi_T_Am15< minEdificiosAmpliacaoConc15 || feature.properties.Edi_T_Am15 ===0){
        minEdificiosAmpliacaoConc15 = feature.properties.Edi_T_Am15
    }
    if(feature.properties.Edi_T_Am15> maxEdificiosAmpliacaoConc15){
        maxEdificiosAmpliacaoConc15 = feature.properties.Edi_T_Am15
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am15,1.8)
    });
}
function apagarEdificiosAmpliacaoConc15(e){
    var layer = e.target;
    EdificiosAmpliacaoConc15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacaoConc15(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Am15 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacaoConc15,
    })
};

var EdificiosAmpliacaoConc15= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacaoConc15,
    onEachFeature: onEachFeatureEdificiosAmpliacaoConc15,
});

var slideEdificiosAmpliacaoConc15 = function(){
    var sliderEdificiosAmpliacaoConc15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacaoConc15, {
        start: [minEdificiosAmpliacaoConc15, maxEdificiosAmpliacaoConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacaoConc15,
            'max': maxEdificiosAmpliacaoConc15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacaoConc15);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacaoConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc15.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacaoConc15.noUiSlider.on('update',function(e){
        EdificiosAmpliacaoConc15.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am15>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacaoConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderEdificiosAmpliacaoConc15.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacaoConc15);
}

///////////////////////////-------------  FIM Total Edificios Ampliação concluídos 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL EDIFICIOS CONCLUIDOS 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosConc16 = 99999;
var maxTotalEdificiosConc16 = 0;
function estiloTotalEdificiosConc16(feature, latlng) {
    if(feature.properties.Edi_T_Ob16< minTotalEdificiosConc16 || feature.properties.Edi_T_Ob16 ===0){
        minTotalEdificiosConc16 = feature.properties.Edi_T_Ob16
    }
    if(feature.properties.Edi_T_Ob16> maxTotalEdificiosConc16){
        maxTotalEdificiosConc16 = feature.properties.Edi_T_Ob16
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob16,1.8)
    });
}
function apagarTotalEdificiosConc16(e){
    var layer = e.target;
    TotalEdificiosConc16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc16(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Ob16 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc16,
    })
};

var TotalEdificiosConc16= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalEdificiosConc16,
    onEachFeature: onEachFeatureTotalEdificiosConc16,
});

var slideTotalEdificiosConc16 = function(){
    var sliderTotalEdificiosConc16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc16, {
        start: [minTotalEdificiosConc16, maxTotalEdificiosConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc16,
            'max': maxTotalEdificiosConc16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc16);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc16.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc16.noUiSlider.on('update',function(e){
        TotalEdificiosConc16.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob16>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderTotalEdificiosConc16.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc16);
}

///////////////////////////-------------  FIM TOTAL EDIFICIOS CONCLUIDOS 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- Total Edificios Construção Nova concluídos 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaConc16 = 99999;
var maxEdificiosConsNovaConc16 = 0;
function estiloEdificiosConsNovaConc16(feature, latlng) {
    if(feature.properties.Edi_T_Co16< minEdificiosConsNovaConc16 || feature.properties.Edi_T_Co16 ===0){
        minEdificiosConsNovaConc16 = feature.properties.Edi_T_Co16
    }
    if(feature.properties.Edi_T_Co16> maxEdificiosConsNovaConc16){
        maxEdificiosConsNovaConc16 = feature.properties.Edi_T_Co16
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co16,1.8)
    });
}
function apagarEdificiosConsNovaConc16(e){
    var layer = e.target;
    EdificiosConsNovaConc16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaConc16(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Co16 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaConc16,
    })
};

var EdificiosConsNovaConc16= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosConsNovaConc16,
    onEachFeature: onEachFeatureEdificiosConsNovaConc16,
});

var slideEdificiosConsNovaConc16 = function(){
    var sliderEdificiosConsNovaConc16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaConc16, {
        start: [minEdificiosConsNovaConc16, maxEdificiosConsNovaConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaConc16,
            'max': maxEdificiosConsNovaConc16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaConc16);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaConc16.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaConc16.noUiSlider.on('update',function(e){
        EdificiosConsNovaConc16.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co16>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderEdificiosConsNovaConc16.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaConc16);
}

///////////////////////////-------------  FIM Total Edificios Construção Nova concluídos 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Total Edificios Ampliação concluídos 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacaoConc16 = 99999;
var maxEdificiosAmpliacaoConc16 = 0;
function estiloEdificiosAmpliacaoConc16(feature, latlng) {
    if(feature.properties.Edi_T_Am16< minEdificiosAmpliacaoConc16 || feature.properties.Edi_T_Am16 ===0){
        minEdificiosAmpliacaoConc16 = feature.properties.Edi_T_Am16
    }
    if(feature.properties.Edi_T_Am16> maxEdificiosAmpliacaoConc16){
        maxEdificiosAmpliacaoConc16 = feature.properties.Edi_T_Am16
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am16,1.8)
    });
}
function apagarEdificiosAmpliacaoConc16(e){
    var layer = e.target;
    EdificiosAmpliacaoConc16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacaoConc16(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Am16 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacaoConc16,
    })
};

var EdificiosAmpliacaoConc16= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacaoConc16,
    onEachFeature: onEachFeatureEdificiosAmpliacaoConc16,
});

var slideEdificiosAmpliacaoConc16 = function(){
    var sliderEdificiosAmpliacaoConc16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacaoConc16, {
        start: [minEdificiosAmpliacaoConc16, maxEdificiosAmpliacaoConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacaoConc16,
            'max': maxEdificiosAmpliacaoConc16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacaoConc16);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacaoConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc16.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacaoConc16.noUiSlider.on('update',function(e){
        EdificiosAmpliacaoConc16.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am16>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacaoConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderEdificiosAmpliacaoConc16.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacaoConc16);
}

///////////////////////////-------------  FIM Total Edificios Ampliação concluídos 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL EDIFICIOS CONCLUIDOS 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosConc17 = 99999;
var maxTotalEdificiosConc17 = 0;
function estiloTotalEdificiosConc17(feature, latlng) {
    if(feature.properties.Edi_T_Ob17< minTotalEdificiosConc17 || feature.properties.Edi_T_Ob17 ===0){
        minTotalEdificiosConc17 = feature.properties.Edi_T_Ob17
    }
    if(feature.properties.Edi_T_Ob17> maxTotalEdificiosConc17){
        maxTotalEdificiosConc17 = feature.properties.Edi_T_Ob17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob17,1.8)
    });
}
function apagarTotalEdificiosConc17(e){
    var layer = e.target;
    TotalEdificiosConc17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc17(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Ob17 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc17,
    })
};

var TotalEdificiosConc17= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalEdificiosConc17,
    onEachFeature: onEachFeatureTotalEdificiosConc17,
});

var slideTotalEdificiosConc17 = function(){
    var sliderTotalEdificiosConc17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc17, {
        start: [minTotalEdificiosConc17, maxTotalEdificiosConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc17,
            'max': maxTotalEdificiosConc17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc17);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc17.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc17.noUiSlider.on('update',function(e){
        TotalEdificiosConc17.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob17>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderTotalEdificiosConc17.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc17);
}

///////////////////////////-------------  FIM TOTAL EDIFICIOS CONCLUIDOS 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- Total Edificios Construção Nova concluídos 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaConc17 = 99999;
var maxEdificiosConsNovaConc17 = 0;
function estiloEdificiosConsNovaConc17(feature, latlng) {
    if(feature.properties.Edi_T_Co17< minEdificiosConsNovaConc17 || feature.properties.Edi_T_Co17 ===0){
        minEdificiosConsNovaConc17 = feature.properties.Edi_T_Co17
    }
    if(feature.properties.Edi_T_Co17> maxEdificiosConsNovaConc17){
        maxEdificiosConsNovaConc17 = feature.properties.Edi_T_Co17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co17,1.8)
    });
}
function apagarEdificiosConsNovaConc17(e){
    var layer = e.target;
    EdificiosConsNovaConc17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaConc17(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Co17 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaConc17,
    })
};

var EdificiosConsNovaConc17= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosConsNovaConc17,
    onEachFeature: onEachFeatureEdificiosConsNovaConc17,
});

var slideEdificiosConsNovaConc17 = function(){
    var sliderEdificiosConsNovaConc17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaConc17, {
        start: [minEdificiosConsNovaConc17, maxEdificiosConsNovaConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaConc17,
            'max': maxEdificiosConsNovaConc17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaConc17);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaConc17.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaConc17.noUiSlider.on('update',function(e){
        EdificiosConsNovaConc17.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co17>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderEdificiosConsNovaConc17.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaConc17);
}

///////////////////////////-------------  FIM Total Edificios Construção Nova concluídos 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Total Edificios Ampliação concluídos 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacaoConc17 = 99999;
var maxEdificiosAmpliacaoConc17 = 0;
function estiloEdificiosAmpliacaoConc17(feature, latlng) {
    if(feature.properties.Edi_T_Am17< minEdificiosAmpliacaoConc17 || feature.properties.Edi_T_Am17 ===0){
        minEdificiosAmpliacaoConc17 = feature.properties.Edi_T_Am17
    }
    if(feature.properties.Edi_T_Am17> maxEdificiosAmpliacaoConc17){
        maxEdificiosAmpliacaoConc17 = feature.properties.Edi_T_Am17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am17,1.8)
    });
}
function apagarEdificiosAmpliacaoConc17(e){
    var layer = e.target;
    EdificiosAmpliacaoConc17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacaoConc17(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Am17 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacaoConc17,
    })
};

var EdificiosAmpliacaoConc17= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacaoConc17,
    onEachFeature: onEachFeatureEdificiosAmpliacaoConc17,
});

var slideEdificiosAmpliacaoConc17 = function(){
    var sliderEdificiosAmpliacaoConc17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacaoConc17, {
        start: [minEdificiosAmpliacaoConc17, maxEdificiosAmpliacaoConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacaoConc17,
            'max': maxEdificiosAmpliacaoConc17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacaoConc17);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacaoConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc17.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacaoConc17.noUiSlider.on('update',function(e){
        EdificiosAmpliacaoConc17.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am17>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacaoConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderEdificiosAmpliacaoConc17.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacaoConc17);
}

///////////////////////////-------------  FIM Total Edificios Ampliação concluídos 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL EDIFICIOS CONCLUIDOS 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosConc18 = 99999;
var maxTotalEdificiosConc18 = 0;
function estiloTotalEdificiosConc18(feature, latlng) {
    if(feature.properties.Edi_T_Ob18< minTotalEdificiosConc18 || feature.properties.Edi_T_Ob18 ===0){
        minTotalEdificiosConc18 = feature.properties.Edi_T_Ob18
    }
    if(feature.properties.Edi_T_Ob18> maxTotalEdificiosConc18){
        maxTotalEdificiosConc18 = feature.properties.Edi_T_Ob18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob18,1.8)
    });
}
function apagarTotalEdificiosConc18(e){
    var layer = e.target;
    TotalEdificiosConc18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc18(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Ob18 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc18,
    })
};

var TotalEdificiosConc18= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalEdificiosConc18,
    onEachFeature: onEachFeatureTotalEdificiosConc18,
});

var slideTotalEdificiosConc18 = function(){
    var sliderTotalEdificiosConc18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc18, {
        start: [minTotalEdificiosConc18, maxTotalEdificiosConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc18,
            'max': maxTotalEdificiosConc18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc18);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc18.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc18.noUiSlider.on('update',function(e){
        TotalEdificiosConc18.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob18>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderTotalEdificiosConc18.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc18);
}

///////////////////////////-------------  FIM TOTAL EDIFICIOS CONCLUIDOS 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- Total Edificios Construção Nova concluídos 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaConc18 = 99999;
var maxEdificiosConsNovaConc18 = 0;
function estiloEdificiosConsNovaConc18(feature, latlng) {
    if(feature.properties.Edi_T_Co18< minEdificiosConsNovaConc18 || feature.properties.Edi_T_Co18 ===0){
        minEdificiosConsNovaConc18 = feature.properties.Edi_T_Co18
    }
    if(feature.properties.Edi_T_Co18> maxEdificiosConsNovaConc18){
        maxEdificiosConsNovaConc18 = feature.properties.Edi_T_Co18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co18,1.8)
    });
}
function apagarEdificiosConsNovaConc18(e){
    var layer = e.target;
    EdificiosConsNovaConc18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaConc18(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Co18 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaConc18,
    })
};

var EdificiosConsNovaConc18= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosConsNovaConc18,
    onEachFeature: onEachFeatureEdificiosConsNovaConc18,
});

var slideEdificiosConsNovaConc18 = function(){
    var sliderEdificiosConsNovaConc18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaConc18, {
        start: [minEdificiosConsNovaConc18, maxEdificiosConsNovaConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaConc18,
            'max': maxEdificiosConsNovaConc18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaConc18);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaConc18.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaConc18.noUiSlider.on('update',function(e){
        EdificiosConsNovaConc18.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co18>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderEdificiosConsNovaConc18.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaConc18);
}

///////////////////////////-------------  FIM Total Edificios Construção Nova concluídos 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Total Edificios Ampliação concluídos 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacaoConc18 = 99999;
var maxEdificiosAmpliacaoConc18 = 0;
function estiloEdificiosAmpliacaoConc18(feature, latlng) {
    if(feature.properties.Edi_T_Am18< minEdificiosAmpliacaoConc18 || feature.properties.Edi_T_Am18 ===0){
        minEdificiosAmpliacaoConc18 = feature.properties.Edi_T_Am18
    }
    if(feature.properties.Edi_T_Am18> maxEdificiosAmpliacaoConc18){
        maxEdificiosAmpliacaoConc18 = feature.properties.Edi_T_Am18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am18,1.8)
    });
}
function apagarEdificiosAmpliacaoConc18(e){
    var layer = e.target;
    EdificiosAmpliacaoConc18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacaoConc18(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Am18 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacaoConc18,
    })
};

var EdificiosAmpliacaoConc18= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacaoConc18,
    onEachFeature: onEachFeatureEdificiosAmpliacaoConc18,
});

var slideEdificiosAmpliacaoConc18 = function(){
    var sliderEdificiosAmpliacaoConc18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacaoConc18, {
        start: [minEdificiosAmpliacaoConc18, maxEdificiosAmpliacaoConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacaoConc18,
            'max': maxEdificiosAmpliacaoConc18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacaoConc18);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacaoConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc18.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacaoConc18.noUiSlider.on('update',function(e){
        EdificiosAmpliacaoConc18.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am18>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacaoConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderEdificiosAmpliacaoConc18.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacaoConc18);
}

///////////////////////////-------------  FIM Total Edificios Ampliação concluídos 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL EDIFICIOS CONCLUIDOS 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosConc19 = 99999;
var maxTotalEdificiosConc19 = 0;
function estiloTotalEdificiosConc19(feature, latlng) {
    if(feature.properties.Edi_T_Ob19< minTotalEdificiosConc19 || feature.properties.Edi_T_Ob19 ===0){
        minTotalEdificiosConc19 = feature.properties.Edi_T_Ob19
    }
    if(feature.properties.Edi_T_Ob19> maxTotalEdificiosConc19){
        maxTotalEdificiosConc19 = feature.properties.Edi_T_Ob19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob19,1.8)
    });
}
function apagarTotalEdificiosConc19(e){
    var layer = e.target;
    TotalEdificiosConc19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc19(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Ob19 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc19,
    })
};

var TotalEdificiosConc19= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalEdificiosConc19,
    onEachFeature: onEachFeatureTotalEdificiosConc19,
});

var slideTotalEdificiosConc19 = function(){
    var sliderTotalEdificiosConc19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc19, {
        start: [minTotalEdificiosConc19, maxTotalEdificiosConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc19,
            'max': maxTotalEdificiosConc19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc19);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc19.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc19.noUiSlider.on('update',function(e){
        TotalEdificiosConc19.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob19>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderTotalEdificiosConc19.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc19);
}

///////////////////////////-------------  FIM TOTAL EDIFICIOS CONCLUIDOS 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- Total Edificios Construção Nova concluídos 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaConc19 = 99999;
var maxEdificiosConsNovaConc19 = 0;
function estiloEdificiosConsNovaConc19(feature, latlng) {
    if(feature.properties.Edi_T_Co19< minEdificiosConsNovaConc19 || feature.properties.Edi_T_Co19 ===0){
        minEdificiosConsNovaConc19 = feature.properties.Edi_T_Co19
    }
    if(feature.properties.Edi_T_Co19> maxEdificiosConsNovaConc19){
        maxEdificiosConsNovaConc19 = feature.properties.Edi_T_Co19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co19,1.8)
    });
}
function apagarEdificiosConsNovaConc19(e){
    var layer = e.target;
    EdificiosConsNovaConc19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaConc19(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Co19 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaConc19,
    })
};

var EdificiosConsNovaConc19= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosConsNovaConc19,
    onEachFeature: onEachFeatureEdificiosConsNovaConc19,
});

var slideEdificiosConsNovaConc19 = function(){
    var sliderEdificiosConsNovaConc19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaConc19, {
        start: [minEdificiosConsNovaConc19, maxEdificiosConsNovaConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaConc19,
            'max': maxEdificiosConsNovaConc19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaConc19);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaConc19.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaConc19.noUiSlider.on('update',function(e){
        EdificiosConsNovaConc19.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co19>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderEdificiosConsNovaConc19.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaConc19);
}

///////////////////////////-------------  FIM Total Edificios Construção Nova concluídos 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Total Edificios Ampliação concluídos 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacaoConc19 = 99999;
var maxEdificiosAmpliacaoConc19 = 0;
function estiloEdificiosAmpliacaoConc19(feature, latlng) {
    if(feature.properties.Edi_T_Am19< minEdificiosAmpliacaoConc19 || feature.properties.Edi_T_Am19 ===0){
        minEdificiosAmpliacaoConc19 = feature.properties.Edi_T_Am19
    }
    if(feature.properties.Edi_T_Am19> maxEdificiosAmpliacaoConc19){
        maxEdificiosAmpliacaoConc19 = feature.properties.Edi_T_Am19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am19,1.8)
    });
}
function apagarEdificiosAmpliacaoConc19(e){
    var layer = e.target;
    EdificiosAmpliacaoConc19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacaoConc19(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Am19 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacaoConc19,
    })
};

var EdificiosAmpliacaoConc19= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacaoConc19,
    onEachFeature: onEachFeatureEdificiosAmpliacaoConc19,
});

var slideEdificiosAmpliacaoConc19 = function(){
    var sliderEdificiosAmpliacaoConc19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacaoConc19, {
        start: [minEdificiosAmpliacaoConc19, maxEdificiosAmpliacaoConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacaoConc19,
            'max': maxEdificiosAmpliacaoConc19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacaoConc19);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacaoConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc19.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacaoConc19.noUiSlider.on('update',function(e){
        EdificiosAmpliacaoConc19.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am19>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacaoConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderEdificiosAmpliacaoConc19.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacaoConc19);
}

///////////////////////////-------------  FIM Total Edificios Ampliação concluídos 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL EDIFICIOS CONCLUIDOS 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosConc20 = 99999;
var maxTotalEdificiosConc20 = 0;
function estiloTotalEdificiosConc20(feature, latlng) {
    if(feature.properties.Edi_T_Ob20< minTotalEdificiosConc20 || feature.properties.Edi_T_Ob20 ===0){
        minTotalEdificiosConc20 = feature.properties.Edi_T_Ob20
    }
    if(feature.properties.Edi_T_Ob20> maxTotalEdificiosConc20){
        maxTotalEdificiosConc20 = feature.properties.Edi_T_Ob20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob20,1.8)
    });
}
function apagarTotalEdificiosConc20(e){
    var layer = e.target;
    TotalEdificiosConc20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosConc20(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Ob20 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosConc20,
    })
};

var TotalEdificiosConc20= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloTotalEdificiosConc20,
    onEachFeature: onEachFeatureTotalEdificiosConc20,
});

var slideTotalEdificiosConc20 = function(){
    var sliderTotalEdificiosConc20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosConc20, {
        start: [minTotalEdificiosConc20, maxTotalEdificiosConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosConc20,
            'max': maxTotalEdificiosConc20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosConc20);
    inputNumberMax.setAttribute("value",maxTotalEdificiosConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosConc20.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosConc20.noUiSlider.on('update',function(e){
        TotalEdificiosConc20.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob20>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderTotalEdificiosConc20.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosConc20);
}

///////////////////////////-------------  FIM TOTAL EDIFICIOS CONCLUIDOS 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- Total Edificios Construção Nova concluídos 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaConc20 = 99999;
var maxEdificiosConsNovaConc20 = 0;
function estiloEdificiosConsNovaConc20(feature, latlng) {
    if(feature.properties.Edi_T_Co20< minEdificiosConsNovaConc20 || feature.properties.Edi_T_Co20 ===0){
        minEdificiosConsNovaConc20 = feature.properties.Edi_T_Co20
    }
    if(feature.properties.Edi_T_Co20> maxEdificiosConsNovaConc20){
        maxEdificiosConsNovaConc20 = feature.properties.Edi_T_Co20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co20,1.8)
    });
}
function apagarEdificiosConsNovaConc20(e){
    var layer = e.target;
    EdificiosConsNovaConc20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaConc20(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Co20 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaConc20,
    })
};

var EdificiosConsNovaConc20= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosConsNovaConc20,
    onEachFeature: onEachFeatureEdificiosConsNovaConc20,
});

var slideEdificiosConsNovaConc20 = function(){
    var sliderEdificiosConsNovaConc20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaConc20, {
        start: [minEdificiosConsNovaConc20, maxEdificiosConsNovaConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaConc20,
            'max': maxEdificiosConsNovaConc20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaConc20);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaConc20.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaConc20.noUiSlider.on('update',function(e){
        EdificiosConsNovaConc20.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co20>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderEdificiosConsNovaConc20.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaConc20);
}

///////////////////////////-------------  FIM Total Edificios Construção Nova concluídos 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- Total Edificios Ampliação concluídos 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacaoConc20 = 99999;
var maxEdificiosAmpliacaoConc20 = 0;
function estiloEdificiosAmpliacaoConc20(feature, latlng) {
    if(feature.properties.Edi_T_Am20< minEdificiosAmpliacaoConc20 || feature.properties.Edi_T_Am20 ===0){
        minEdificiosAmpliacaoConc20 = feature.properties.Edi_T_Am20
    }
    if(feature.properties.Edi_T_Am20> maxEdificiosAmpliacaoConc20){
        maxEdificiosAmpliacaoConc20 = feature.properties.Edi_T_Am20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am20,1.8)
    });
}
function apagarEdificiosAmpliacaoConc20(e){
    var layer = e.target;
    EdificiosAmpliacaoConc20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacaoConc20(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios concluídos: ' + '<b>' +feature.properties.Edi_T_Am20 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacaoConc20,
    })
};

var EdificiosAmpliacaoConc20= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacaoConc20,
    onEachFeature: onEachFeatureEdificiosAmpliacaoConc20,
});

var slideEdificiosAmpliacaoConc20 = function(){
    var sliderEdificiosAmpliacaoConc20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacaoConc20, {
        start: [minEdificiosAmpliacaoConc20, maxEdificiosAmpliacaoConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacaoConc20,
            'max': maxEdificiosAmpliacaoConc20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacaoConc20);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacaoConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacaoConc20.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacaoConc20.noUiSlider.on('update',function(e){
        EdificiosAmpliacaoConc20.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am20>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacaoConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderEdificiosAmpliacaoConc20.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacaoConc20);
}

///////////////////////////-------------  FIM Total Edificios Ampliação concluídos 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////////////////--------------------- FIM DADOS ABSOLUTOS CONCELHOS

/////////////////////////////////-------------------------- DADOS RELATIVOS CONCELHOS 

/////////////////////////------- Percentagem Construção CONCELHO em 2014-----////

var minPerConsNovaConc14 = 100;
var maxPerConsNovaConc14 = 0;



function EstiloPerConsNovaConc14(feature) {
    if(feature.properties.PerCons_14 <= minPerConsNovaConc14 ){
        minPerConsNovaConc14 = feature.properties.PerCons_14
    }
    if(feature.properties.PerCons_14 >= maxPerConsNovaConc14 ){
        maxPerConsNovaConc14 = feature.properties.PerCons_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerCons_14)
    };
}
function apagarPerConsNovaConc14(e) {
    PerConsNovaConc14.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc14(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerCons_14  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConsNovaConc14,
    });
}
var PerConsNovaConc14= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerConsNovaConc14,
    onEachFeature: onEachFeaturePerConsNovaConc14
});
let slidePerConsNovaConc14 = function(){
    var sliderPerConsNovaConc14 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConsNovaConc14, {
        start: [minPerConsNovaConc14, maxPerConsNovaConc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsNovaConc14,
            'max': maxPerConsNovaConc14
        },
        });
    inputNumberMin.setAttribute("value",minPerConsNovaConc14);
    inputNumberMax.setAttribute("value",maxPerConsNovaConc14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsNovaConc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsNovaConc14.noUiSlider.set([null, this.value]);
    });

    sliderPerConsNovaConc14.noUiSlider.on('update',function(e){
        PerConsNovaConc14.eachLayer(function(layer){
            if(layer.feature.properties.PerCons_14.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerCons_14.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConsNovaConc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderPerConsNovaConc14.noUiSlider;
    $(slidersGeral).append(sliderPerConsNovaConc14);
} 

/////////////////////////////// Fim Percentagem Construção NOVA CONCELHO em 2014 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliação CONCELHO em 2014-----////

var minPerAmpliacaoConc14 = 100;
var maxPerAmpliacaoConc14 = 0;


function CorPerAmpliacoesConc(d) {
    return d == null ? '#808080' :
        d >= 90 ? '#8c0303' :
        d >= 75  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 25   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaPercentagensConc = function() {
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


    $(legendaA).append(symbolsContainer); 
}


function EstiloPerAmpliacaoConc14(feature) {
    if(feature.properties.PerAmpl_14 <= minPerAmpliacaoConc14){
        minPerAmpliacaoConc14 = feature.properties.PerAmpl_14
    }
    if(feature.properties.PerAmpl_14 >= maxPerAmpliacaoConc14 ){
        maxPerAmpliacaoConc14 = feature.properties.PerAmpl_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerAmpl_14)
    };
}
function apagarPerAmpliacaoConc14(e) {
    PerAmpliacaoConc14.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacaoConc14(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerAmpl_14  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacaoConc14,
    });
}
var PerAmpliacaoConc14= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacaoConc14,
    onEachFeature: onEachFeaturePerAmpliacaoConc14
});
let slidePerAmpliacaoConc14 = function(){
    var sliderPerAmpliacaoConc14 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacaoConc14, {
        start: [minPerAmpliacaoConc14, maxPerAmpliacaoConc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacaoConc14,
            'max': maxPerAmpliacaoConc14
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacaoConc14);
    inputNumberMax.setAttribute("value",maxPerAmpliacaoConc14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacaoConc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacaoConc14.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacaoConc14.noUiSlider.on('update',function(e){
        PerAmpliacaoConc14.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_14.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_14.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacaoConc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderPerAmpliacaoConc14.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacaoConc14);
} 

/////////////////////////////// Fim Percentagem AMPLIAÇÃO CONCELHO em 2014 -------------- \\\\\\

//////////////////////////------- Percentagem Construção CONCELHO em 2015-----////

var minPerConsNovaConc15 = 100;
var maxPerConsNovaConc15 = 0;

function EstiloPerConsNovaConc15(feature) {
    if(feature.properties.PerCons_15 <= minPerConsNovaConc15 ){
        minPerConsNovaConc15 = feature.properties.PerCons_15
    }
    if(feature.properties.PerCons_15 >= maxPerConsNovaConc15 ){
        maxPerConsNovaConc15 = feature.properties.PerCons_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerCons_15)
    };
}
function apagarPerConsNovaConc15(e) {
    PerConsNovaConc15.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc15(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerCons_15  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConsNovaConc15,
    });
}
var PerConsNovaConc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerConsNovaConc15,
    onEachFeature: onEachFeaturePerConsNovaConc15
});
let slidePerConsNovaConc15 = function(){
    var sliderPerConsNovaConc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConsNovaConc15, {
        start: [minPerConsNovaConc15, maxPerConsNovaConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsNovaConc15,
            'max': maxPerConsNovaConc15
        },
        });
    inputNumberMin.setAttribute("value",minPerConsNovaConc15);
    inputNumberMax.setAttribute("value",maxPerConsNovaConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsNovaConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsNovaConc15.noUiSlider.set([null, this.value]);
    });

    sliderPerConsNovaConc15.noUiSlider.on('update',function(e){
        PerConsNovaConc15.eachLayer(function(layer){
            if(layer.feature.properties.PerCons_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerCons_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConsNovaConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderPerConsNovaConc15.noUiSlider;
    $(slidersGeral).append(sliderPerConsNovaConc15);
} 

/////////////////////////////// Fim Percentagem Construção NOVA CONCELHO em 2015 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliação CONCELHO em 2015-----////

var minPerAmpliacaoConc15 = 100;
var maxPerAmpliacaoConc15 = 0;

function EstiloPerAmpliacaoConc15(feature) {
    if(feature.properties.PerAmpl_15 <= minPerAmpliacaoConc15 ){
        minPerAmpliacaoConc15 = feature.properties.PerAmpl_15
    }
    if(feature.properties.PerAmpl_15 >= maxPerAmpliacaoConc15 ){
        maxPerAmpliacaoConc15 = feature.properties.PerAmpl_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerAmpl_15)
    };
}
function apagarPerAmpliacaoConc15(e) {
    PerAmpliacaoConc15.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacaoConc15(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerAmpl_15  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacaoConc15,
    });
}
var PerAmpliacaoConc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacaoConc15,
    onEachFeature: onEachFeaturePerAmpliacaoConc15
});
let slidePerAmpliacaoConc15 = function(){
    var sliderPerAmpliacaoConc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacaoConc15, {
        start: [minPerAmpliacaoConc15, maxPerAmpliacaoConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacaoConc15,
            'max': maxPerAmpliacaoConc15
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacaoConc15);
    inputNumberMax.setAttribute("value",maxPerAmpliacaoConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacaoConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacaoConc15.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacaoConc15.noUiSlider.on('update',function(e){
        PerAmpliacaoConc15.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacaoConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderPerAmpliacaoConc15.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacaoConc15);
} 

/////////////////////////////// Fim Percentagem AMPLIAÇÃO CONCELHO em 2015 -------------- \\\\\\

//////////////////////////------- Percentagem Construção CONCELHO em 2016-----////

var minPerConsNovaConc16 = 100;
var maxPerConsNovaConc16 = 0;

function EstiloPerConsNovaConc16(feature) {
    if(feature.properties.PerCons_16 <= minPerConsNovaConc16 ){
        minPerConsNovaConc16 = feature.properties.PerCons_16
    }
    if(feature.properties.PerCons_16 >= maxPerConsNovaConc16 ){
        maxPerConsNovaConc16 = feature.properties.PerCons_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerCons_16)
    };
}
function apagarPerConsNovaConc16(e) {
    PerConsNovaConc16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc16(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerCons_16  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConsNovaConc16,
    });
}
var PerConsNovaConc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerConsNovaConc16,
    onEachFeature: onEachFeaturePerConsNovaConc16
});
let slidePerConsNovaConc16 = function(){
    var sliderPerConsNovaConc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConsNovaConc16, {
        start: [minPerConsNovaConc16, maxPerConsNovaConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsNovaConc16,
            'max': maxPerConsNovaConc16
        },
        });
    inputNumberMin.setAttribute("value",minPerConsNovaConc16);
    inputNumberMax.setAttribute("value",maxPerConsNovaConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsNovaConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsNovaConc16.noUiSlider.set([null, this.value]);
    });

    sliderPerConsNovaConc16.noUiSlider.on('update',function(e){
        PerConsNovaConc16.eachLayer(function(layer){
            if(layer.feature.properties.PerCons_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerCons_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConsNovaConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderPerConsNovaConc16.noUiSlider;
    $(slidersGeral).append(sliderPerConsNovaConc16);
} 

/////////////////////////////// Fim Percentagem Construção NOVA CONCELHO em 2016 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliação CONCELHO em 2016-----////

var minPerAmpliacaoConc16 = 100;
var maxPerAmpliacaoConc16 = 0;

function EstiloPerAmpliacaoConc16(feature) {
    if(feature.properties.PerAmpl_16 <= minPerAmpliacaoConc16 ){
        minPerAmpliacaoConc16 = feature.properties.PerAmpl_16
    }
    if(feature.properties.PerAmpl_16 >= maxPerAmpliacaoConc16 ){
        maxPerAmpliacaoConc16 = feature.properties.PerAmpl_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerAmpl_16)
    };
}
function apagarPerAmpliacaoConc16(e) {
    PerAmpliacaoConc16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacaoConc16(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerAmpl_16  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacaoConc16,
    });
}
var PerAmpliacaoConc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacaoConc16,
    onEachFeature: onEachFeaturePerAmpliacaoConc16
});
let slidePerAmpliacaoConc16 = function(){
    var sliderPerAmpliacaoConc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacaoConc16, {
        start: [minPerAmpliacaoConc16, maxPerAmpliacaoConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacaoConc16,
            'max': maxPerAmpliacaoConc16
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacaoConc16);
    inputNumberMax.setAttribute("value",maxPerAmpliacaoConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacaoConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacaoConc16.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacaoConc16.noUiSlider.on('update',function(e){
        PerAmpliacaoConc16.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacaoConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderPerAmpliacaoConc16.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacaoConc16);
} 

/////////////////////////////// Fim Percentagem AMPLIAÇÃO CONCELHO em 2016 -------------- \\\\\\

//////////////////////////------- Percentagem Construção CONCELHO em 2017-----////

var minPerConsNovaConc17 = 100;
var maxPerConsNovaConc17 = 0;

function EstiloPerConsNovaConc17(feature) {
    if(feature.properties.PerCons_17 <= minPerConsNovaConc17 ){
        minPerConsNovaConc17 = feature.properties.PerCons_17
    }
    if(feature.properties.PerCons_17 >= maxPerConsNovaConc17 ){
        maxPerConsNovaConc17 = feature.properties.PerCons_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerCons_17)
    };
}
function apagarPerConsNovaConc17(e) {
    PerConsNovaConc17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc17(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerCons_17  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConsNovaConc17,
    });
}
var PerConsNovaConc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerConsNovaConc17,
    onEachFeature: onEachFeaturePerConsNovaConc17
});
let slidePerConsNovaConc17 = function(){
    var sliderPerConsNovaConc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConsNovaConc17, {
        start: [minPerConsNovaConc17, maxPerConsNovaConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsNovaConc17,
            'max': maxPerConsNovaConc17
        },
        });
    inputNumberMin.setAttribute("value",minPerConsNovaConc17);
    inputNumberMax.setAttribute("value",maxPerConsNovaConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsNovaConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsNovaConc17.noUiSlider.set([null, this.value]);
    });

    sliderPerConsNovaConc17.noUiSlider.on('update',function(e){
        PerConsNovaConc17.eachLayer(function(layer){
            if(layer.feature.properties.PerCons_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerCons_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConsNovaConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderPerConsNovaConc17.noUiSlider;
    $(slidersGeral).append(sliderPerConsNovaConc17);
} 

/////////////////////////////// Fim Percentagem Construção NOVA CONCELHO em 2017 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliação CONCELHO em 2017-----////

var minPerAmpliacaoConc17 = 100;
var maxPerAmpliacaoConc17 = 0;

function EstiloPerAmpliacaoConc17(feature) {
    if(feature.properties.PerAmpl_17 <= minPerAmpliacaoConc17 ){
        minPerAmpliacaoConc17 = feature.properties.PerAmpl_17
    }
    if(feature.properties.PerAmpl_17 >= maxPerAmpliacaoConc17 ){
        maxPerAmpliacaoConc17 = feature.properties.PerAmpl_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerAmpl_17)
    };
}
function apagarPerAmpliacaoConc17(e) {
    PerAmpliacaoConc17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacaoConc17(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerAmpl_17  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacaoConc17,
    });
}
var PerAmpliacaoConc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacaoConc17,
    onEachFeature: onEachFeaturePerAmpliacaoConc17
});
let slidePerAmpliacaoConc17 = function(){
    var sliderPerAmpliacaoConc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacaoConc17, {
        start: [minPerAmpliacaoConc17, maxPerAmpliacaoConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacaoConc17,
            'max': maxPerAmpliacaoConc17
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacaoConc17);
    inputNumberMax.setAttribute("value",maxPerAmpliacaoConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacaoConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacaoConc17.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacaoConc17.noUiSlider.on('update',function(e){
        PerAmpliacaoConc17.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacaoConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderPerAmpliacaoConc17.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacaoConc17);
} 

/////////////////////////////// Fim Percentagem AMPLIAÇÃO CONCELHO em 2017 -------------- \\\\\\

//////////////////////////------- Percentagem Construção CONCELHO em 2018-----////

var minPerConsNovaConc18 = 100;
var maxPerConsNovaConc18 = 0;

function EstiloPerConsNovaConc18(feature) {
    if(feature.properties.PerCons_18 <= minPerConsNovaConc18 ){
        minPerConsNovaConc18 = feature.properties.PerCons_18
    }
    if(feature.properties.PerCons_18 >= maxPerConsNovaConc18 ){
        maxPerConsNovaConc18 = feature.properties.PerCons_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerCons_18)
    };
}
function apagarPerConsNovaConc18(e) {
    PerConsNovaConc18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc18(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerCons_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConsNovaConc18,
    });
}
var PerConsNovaConc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerConsNovaConc18,
    onEachFeature: onEachFeaturePerConsNovaConc18
});
let slidePerConsNovaConc18 = function(){
    var sliderPerConsNovaConc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConsNovaConc18, {
        start: [minPerConsNovaConc18, maxPerConsNovaConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsNovaConc18,
            'max': maxPerConsNovaConc18
        },
        });
    inputNumberMin.setAttribute("value",minPerConsNovaConc18);
    inputNumberMax.setAttribute("value",maxPerConsNovaConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsNovaConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsNovaConc18.noUiSlider.set([null, this.value]);
    });

    sliderPerConsNovaConc18.noUiSlider.on('update',function(e){
        PerConsNovaConc18.eachLayer(function(layer){
            if(layer.feature.properties.PerCons_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerCons_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConsNovaConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderPerConsNovaConc18.noUiSlider;
    $(slidersGeral).append(sliderPerConsNovaConc18);
} 

/////////////////////////////// Fim Percentagem Construção NOVA CONCELHO em 2018 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliação CONCELHO em 2018-----////

var minPerAmpliacaoConc18 = 100;
var maxPerAmpliacaoConc18 = 0;

function EstiloPerAmpliacaoConc18(feature) {
    if(feature.properties.PerAmpl_18 <= minPerAmpliacaoConc18 ){
        minPerAmpliacaoConc18 = feature.properties.PerAmpl_18
    }
    if(feature.properties.PerAmpl_18 >= maxPerAmpliacaoConc18 ){
        maxPerAmpliacaoConc18 = feature.properties.PerAmpl_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerAmpl_18)
    };
}
function apagarPerAmpliacaoConc18(e) {
    PerAmpliacaoConc18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacaoConc18(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerAmpl_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacaoConc18,
    });
}
var PerAmpliacaoConc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacaoConc18,
    onEachFeature: onEachFeaturePerAmpliacaoConc18
});
let slidePerAmpliacaoConc18 = function(){
    var sliderPerAmpliacaoConc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacaoConc18, {
        start: [minPerAmpliacaoConc18, maxPerAmpliacaoConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacaoConc18,
            'max': maxPerAmpliacaoConc18
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacaoConc18);
    inputNumberMax.setAttribute("value",maxPerAmpliacaoConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacaoConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacaoConc18.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacaoConc18.noUiSlider.on('update',function(e){
        PerAmpliacaoConc18.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacaoConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderPerAmpliacaoConc18.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacaoConc18);
} 

/////////////////////////////// Fim Percentagem AMPLIAÇÃO CONCELHO em 2018 -------------- \\\\\\

//////////////////////////------- Percentagem Construção CONCELHO em 2019-----////

var minPerConsNovaConc19 = 100;
var maxPerConsNovaConc19 = 0;

function EstiloPerConsNovaConc19(feature) {
    if(feature.properties.PerCons_19 <= minPerConsNovaConc19 ){
        minPerConsNovaConc19 = feature.properties.PerCons_19
    }
    if(feature.properties.PerCons_19 >= maxPerConsNovaConc19 ){
        maxPerConsNovaConc19 = feature.properties.PerCons_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerCons_19)
    };
}
function apagarPerConsNovaConc19(e) {
    PerConsNovaConc19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc19(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerCons_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConsNovaConc19,
    });
}
var PerConsNovaConc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerConsNovaConc19,
    onEachFeature: onEachFeaturePerConsNovaConc19
});
let slidePerConsNovaConc19 = function(){
    var sliderPerConsNovaConc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConsNovaConc19, {
        start: [minPerConsNovaConc19, maxPerConsNovaConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsNovaConc19,
            'max': maxPerConsNovaConc19
        },
        });
    inputNumberMin.setAttribute("value",minPerConsNovaConc19);
    inputNumberMax.setAttribute("value",maxPerConsNovaConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsNovaConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsNovaConc19.noUiSlider.set([null, this.value]);
    });

    sliderPerConsNovaConc19.noUiSlider.on('update',function(e){
        PerConsNovaConc19.eachLayer(function(layer){
            if(layer.feature.properties.PerCons_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerCons_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConsNovaConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderPerConsNovaConc19.noUiSlider;
    $(slidersGeral).append(sliderPerConsNovaConc19);
} 

/////////////////////////////// Fim Percentagem Construção NOVA CONCELHO em 2019 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliação CONCELHO em 2019-----////

var minPerAmpliacaoConc19 = 100;
var maxPerAmpliacaoConc19 = 0;

function EstiloPerAmpliacaoConc19(feature) {
    if(feature.properties.PerAmpl_19 <= minPerAmpliacaoConc19 ){
        minPerAmpliacaoConc19 = feature.properties.PerAmpl_19
    }
    if(feature.properties.PerAmpl_19 >= maxPerAmpliacaoConc19 ){
        maxPerAmpliacaoConc19 = feature.properties.PerAmpl_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerAmpl_19)
    };
}
function apagarPerAmpliacaoConc19(e) {
    PerAmpliacaoConc19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacaoConc19(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerAmpl_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacaoConc19,
    });
}
var PerAmpliacaoConc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacaoConc19,
    onEachFeature: onEachFeaturePerAmpliacaoConc19
});
let slidePerAmpliacaoConc19 = function(){
    var sliderPerAmpliacaoConc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacaoConc19, {
        start: [minPerAmpliacaoConc19, maxPerAmpliacaoConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacaoConc19,
            'max': maxPerAmpliacaoConc19
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacaoConc19);
    inputNumberMax.setAttribute("value",maxPerAmpliacaoConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacaoConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacaoConc19.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacaoConc19.noUiSlider.on('update',function(e){
        PerAmpliacaoConc19.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacaoConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderPerAmpliacaoConc19.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacaoConc19);
} 

/////////////////////////////// Fim Percentagem AMPLIAÇÃO CONCELHO em 2019 -------------- \\\\\\

//////////////////////////------- Percentagem Construção CONCELHO em 2020-----////

var minPerConsNovaConc20 = 100;
var maxPerConsNovaConc20 = 0;

function EstiloPerConsNovaConc20(feature) {
    if(feature.properties.PerCons_20 <= minPerConsNovaConc20 ){
        minPerConsNovaConc20 = feature.properties.PerCons_20
    }
    if(feature.properties.PerCons_20 >= maxPerConsNovaConc20 ){
        maxPerConsNovaConc20 = feature.properties.PerCons_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerCons_20)
    };
}
function apagarPerConsNovaConc20(e) {
    PerConsNovaConc20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc20(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerCons_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerConsNovaConc20,
    });
}
var PerConsNovaConc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerConsNovaConc20,
    onEachFeature: onEachFeaturePerConsNovaConc20
});
let slidePerConsNovaConc20 = function(){
    var sliderPerConsNovaConc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerConsNovaConc20, {
        start: [minPerConsNovaConc20, maxPerConsNovaConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsNovaConc20,
            'max': maxPerConsNovaConc20
        },
        });
    inputNumberMin.setAttribute("value",minPerConsNovaConc20);
    inputNumberMax.setAttribute("value",maxPerConsNovaConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsNovaConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsNovaConc20.noUiSlider.set([null, this.value]);
    });

    sliderPerConsNovaConc20.noUiSlider.on('update',function(e){
        PerConsNovaConc20.eachLayer(function(layer){
            if(layer.feature.properties.PerCons_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerCons_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerConsNovaConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderPerConsNovaConc20.noUiSlider;
    $(slidersGeral).append(sliderPerConsNovaConc20);
} 

/////////////////////////////// Fim Percentagem Construção NOVA CONCELHO em 2020 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliação CONCELHO em 2020-----////

var minPerAmpliacaoConc20 = 100;
var maxPerAmpliacaoConc20 = 0;

function EstiloPerAmpliacaoConc20(feature) {
    if(feature.properties.PerAmpl_20 <= minPerAmpliacaoConc20 ){
        minPerAmpliacaoConc20 = feature.properties.PerAmpl_20
    }
    if(feature.properties.PerAmpl_20 >= maxPerAmpliacaoConc20 ){
        maxPerAmpliacaoConc20 = feature.properties.PerAmpl_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacoesConc(feature.properties.PerAmpl_20)
    };
}
function apagarPerAmpliacaoConc20(e) {
    PerAmpliacaoConc20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacaoConc20(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios concluídos: ' + '<b>' + feature.properties.PerAmpl_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacaoConc20,
    });
}
var PerAmpliacaoConc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacaoConc20,
    onEachFeature: onEachFeaturePerAmpliacaoConc20
});
let slidePerAmpliacaoConc20 = function(){
    var sliderPerAmpliacaoConc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacaoConc20, {
        start: [minPerAmpliacaoConc20, maxPerAmpliacaoConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacaoConc20,
            'max': maxPerAmpliacaoConc20
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacaoConc20);
    inputNumberMax.setAttribute("value",maxPerAmpliacaoConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacaoConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacaoConc20.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacaoConc20.noUiSlider.on('update',function(e){
        PerAmpliacaoConc20.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacaoConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderPerAmpliacaoConc20.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacaoConc20);
} 

/////////////////////////////// Fim Percentagem AMPLIAÇÃO CONCELHO em 2020 -------------- \\\\\\


/////////////////////------------------------------- FIM DADOS RELATIVOS CONCELHOS

///////////////////////////////////////// VARIAÇÕES CONCELHOS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação Total, em 2015, POR CONCELHOS -------------------////

var minVarTotalConc15 = 0;
var maxVarTotalConc15 = 0;

function CorVarTotalEdi15_14(d) {
    return d == null ? '#808080' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -50  ? '#2288bf' :
        d >= -75  ? '#155273' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalEdi15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -75 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -75' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalConc15(feature) {
    if(feature.properties.VarObra_15 <= minVarTotalConc15){
        minVarTotalConc15 = feature.properties.VarObra_15
    }
    if(feature.properties.VarObra_15 > maxVarTotalConc15){
        maxVarTotalConc15 = feature.properties.VarObra_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdi15_14(feature.properties.VarObra_15)};
    }


function apagarVarTotalConc15(e) {
    VarTotalConc15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc15(feature, layer) {
    if (feature.properties.VarObra_15 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_15.toFixed(2) + '</b>' + '%').openPopup()
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
            if (layer.feature.properties.VarObra_15 == null){
                return false
            }
            if(layer.feature.properties.VarObra_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarObra_15.toFixed(2) <= parseFloat(e[1])){
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

/////////////////////////////------- Variaçao Construção, em 2015, POR CONCELHOS -------------------////

var minVarConstrucaoConc15 = 0;
var maxVarConstrucaoConc15 = 0;


function CorVarConsNova15_14(d) {
    return d == null ? '#808080' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -50  ? '#2288bf' :
        d >= -75  ? '#155273' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarConsNova15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Construção nova, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -75 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -75' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarConstrucaoConc15(feature) {
    if(feature.properties.VarCons_15 <= minVarConstrucaoConc15){
        minVarConstrucaoConc15 = feature.properties.VarCons_15
    }
    if(feature.properties.VarCons_15 > maxVarConstrucaoConc15){
        maxVarConstrucaoConc15 = feature.properties.VarCons_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarConsNova15_14(feature.properties.VarCons_15)};
    }


function apagarVarConstrucaoConc15(e) {
    VarConstrucaoConc15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConstrucaoConc15(feature, layer) {
    if (feature.properties.VarCons_15 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConstrucaoConc15,
    });
}
var VarConstrucaoConc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConstrucaoConc15,
    onEachFeature: onEachFeatureVarConstrucaoConc15
});

let slideVarConstrucaoConc15 = function(){
    var sliderVarConstrucaoConc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConstrucaoConc15, {
        start: [minVarConstrucaoConc15, maxVarConstrucaoConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConstrucaoConc15,
            'max': maxVarConstrucaoConc15
        },
        });
    inputNumberMin.setAttribute("value",minVarConstrucaoConc15);
    inputNumberMax.setAttribute("value",maxVarConstrucaoConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConstrucaoConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConstrucaoConc15.noUiSlider.set([null, this.value]);
    });

    sliderVarConstrucaoConc15.noUiSlider.on('update',function(e){
        VarConstrucaoConc15.eachLayer(function(layer){
            if (layer.feature.properties.VarCons_15 == null){
                return false
            }
            if(layer.feature.properties.VarCons_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarCons_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarConstrucaoConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderVarConstrucaoConc15.noUiSlider;
    $(slidersGeral).append(sliderVarConstrucaoConc15);
} 

///////////////////////////// Fim Variaçao Construção, em 2015 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2015, POR CONCELHOS -------------------////

var minVarAmpliacoesConc15 = 0;
var maxVarAmpliacoesConc15 = 0;

function CorVarAmpliacoes15_14(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 25  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -100   ? '#155273' :
                ''  ;
}

var legendaVarAmpliacoes15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  25 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -85.71 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesConc15(feature) {
    if(feature.properties.VarAmpl_15 <= minVarAmpliacoesConc15){
        minVarAmpliacoesConc15 = feature.properties.VarAmpl_15
    }
    if(feature.properties.VarAmpl_15 > maxVarAmpliacoesConc15){
        maxVarAmpliacoesConc15 = feature.properties.VarAmpl_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAmpliacoes15_14(feature.properties.VarAmpl_15)};
    }


function apagarVarAmpliacoesConc15(e) {
    VarAmpliacoesConc15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesConc15(feature, layer) {
    if (feature.properties.VarAmpl_15 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesConc15,
    });
}
var VarAmpliacoesConc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarAmpliacoesConc15,
    onEachFeature: onEachFeatureVarAmpliacoesConc15
});

let slideVarAmpliacoesConc15 = function(){
    var sliderVarAmpliacoesConc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 66){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesConc15, {
        start: [minVarAmpliacoesConc15, maxVarAmpliacoesConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesConc15,
            'max': maxVarAmpliacoesConc15
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesConc15);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesConc15.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesConc15.noUiSlider.on('update',function(e){
        VarAmpliacoesConc15.eachLayer(function(layer){
            if (layer.feature.properties.VarAmpl_15 == null){
                return false
            }
            if(layer.feature.properties.VarAmpl_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAmpl_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAmpliacoesConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 66;
    sliderAtivo = sliderVarAmpliacoesConc15.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesConc15);
} 

///////////////////////////// Fim Variação Ampliações, em 2015 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2016, POR CONCELHOS -------------------////

var minVarTotalConc16 = 0;
var maxVarTotalConc16 = 0;

function CorVarTotalEdi16_15(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -51   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalEdi16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalConc16(feature) {
    if(feature.properties.VarObra_16 <= minVarTotalConc16){
        minVarTotalConc16 = feature.properties.VarObra_16
    }
    if(feature.properties.VarObra_16 > maxVarTotalConc16){
        maxVarTotalConc16 = feature.properties.VarObra_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdi16_15(feature.properties.VarObra_16)};
    }


function apagarVarTotalConc16(e) {
    VarTotalConc16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc16(feature, layer) {
    if (feature.properties.VarObra_16 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_16.toFixed(2) + '</b>' + '%').openPopup()
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
            if (layer.feature.properties.VarObra_16 == null){
                return false
            }
            if(layer.feature.properties.VarObra_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarObra_16.toFixed(2) <= parseFloat(e[1])){
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

/////////////////////////////------- Variaçao Construção, em 2016, POR CONCELHOS -------------------////

var minVarConstrucaoConc16 = 0;
var maxVarConstrucaoConc16 = 0;

function CorVarConsNova16_15(d) {
    return d == null ? '#808080' :
        d >= 30  ? '#8c0303' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -50  ? '#2288bf' :
        d >= -80   ? '#155273' :
                ''  ;
}

var legendaVarConsNova16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Construção nova, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -78.57 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarConstrucaoConc16(feature) {
    if(feature.properties.VarCons_16 <= minVarConstrucaoConc16 ){
        minVarConstrucaoConc16 = feature.properties.VarCons_16
    }
    if(feature.properties.VarCons_16 > maxVarConstrucaoConc16){
        maxVarConstrucaoConc16 = feature.properties.VarCons_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarConsNova16_15(feature.properties.VarCons_16)};
    }


function apagarVarConstrucaoConc16(e) {
    VarConstrucaoConc16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConstrucaoConc16(feature, layer) {
    if (feature.properties.VarCons_16 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConstrucaoConc16,
    });
}
var VarConstrucaoConc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConstrucaoConc16,
    onEachFeature: onEachFeatureVarConstrucaoConc16
});

let slideVarConstrucaoConc16 = function(){
    var sliderVarConstrucaoConc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 70){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConstrucaoConc16, {
        start: [minVarConstrucaoConc16, maxVarConstrucaoConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConstrucaoConc16,
            'max': maxVarConstrucaoConc16
        },
        });
    inputNumberMin.setAttribute("value",minVarConstrucaoConc16);
    inputNumberMax.setAttribute("value",maxVarConstrucaoConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConstrucaoConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConstrucaoConc16.noUiSlider.set([null, this.value]);
    });

    sliderVarConstrucaoConc16.noUiSlider.on('update',function(e){
        VarConstrucaoConc16.eachLayer(function(layer){
            if (layer.feature.properties.VarCons_16 == null){
                return false
            }
            if(layer.feature.properties.VarCons_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarCons_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarConstrucaoConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 70;
    sliderAtivo = sliderVarConstrucaoConc16.noUiSlider;
    $(slidersGeral).append(sliderVarConstrucaoConc16);
} 

///////////////////////////// Fim Variaçao Construção, em 2016 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2016, POR CONCELHOS -------------------////

var minVarAmpliacoesConc16 = 0;
var maxVarAmpliacoesConc16 = 0;

function CorVarAmpliacoes16_15(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#155273' :
                ''  ;
}

var legendaVarAmpliacoes16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -100 a -50' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesConc16(feature) {
    if(feature.properties.VarAmpl_16 <= minVarAmpliacoesConc16){
        minVarAmpliacoesConc16 = feature.properties.VarAmpl_16
    }
    if(feature.properties.VarAmpl_16 > maxVarAmpliacoesConc16){
        maxVarAmpliacoesConc16 = feature.properties.VarAmpl_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAmpliacoes16_15(feature.properties.VarAmpl_16)};
    }


function apagarVarAmpliacoesConc16(e) {
    VarAmpliacoesConc16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesConc16(feature, layer) {
    if (feature.properties.VarAmpl_16 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesConc16,
    });
}
var VarAmpliacoesConc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarAmpliacoesConc16,
    onEachFeature: onEachFeatureVarAmpliacoesConc16
});

let slideVarAmpliacoesConc16 = function(){
    var sliderVarAmpliacoesConc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 71){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesConc16, {
        start: [minVarAmpliacoesConc16, maxVarAmpliacoesConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesConc16,
            'max': maxVarAmpliacoesConc16
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesConc16);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesConc16.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesConc16.noUiSlider.on('update',function(e){
        VarAmpliacoesConc16.eachLayer(function(layer){
            if (layer.feature.properties.VarAmpl_16 == null){
                return false
            }
            if(layer.feature.properties.VarAmpl_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAmpl_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAmpliacoesConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 71;
    sliderAtivo = sliderVarAmpliacoesConc16.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesConc16);
} 

///////////////////////////// Fim Variação Ampliações, em 2016 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2017, POR CONCELHOS -------------------////

var minVarTotalConc17 = 0;
var maxVarTotalConc17 = 0;

function CorVarTotalEdi17_16(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 25  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -51   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalEdi17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  25 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -47.06 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalConc17(feature) {
    if(feature.properties.VarObra_17 <= minVarTotalConc17){
        minVarTotalConc17 = feature.properties.VarObra_17
    }
    if(feature.properties.VarObra_17 > maxVarTotalConc17){
        maxVarTotalConc17 = feature.properties.VarObra_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdi17_16(feature.properties.VarObra_17)};
    }


function apagarVarTotalConc17(e) {
    VarTotalConc17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc17(feature, layer) {
    if (feature.properties.VarObra_17 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_17.toFixed(2) + '</b>' + '%').openPopup()
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
            if (layer.feature.properties.VarObra_17 == null){
                return false
            }
            if(layer.feature.properties.VarObra_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarObra_17.toFixed(2) <= parseFloat(e[1])){
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

/////////////////////////////------- Variaçao Construção, em 2017, POR CONCELHOS -------------------////

var minVarConstrucaoConc17 = 0;
var maxVarConstrucaoConc17 = 0;

function CorVarConsNova17_16(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 25  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -55   ? '#2288bf' :
                ''  ;
}

var legendaVarConsNova17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Construção nova, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  25 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -53.85 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarConstrucaoConc17(feature) {
    if(feature.properties.VarCons_17 <= minVarConstrucaoConc17){
        minVarConstrucaoConc17 = feature.properties.VarCons_17
    }
    if(feature.properties.VarCons_17 > maxVarConstrucaoConc17){
        maxVarConstrucaoConc17 = feature.properties.VarCons_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarConsNova17_16(feature.properties.VarCons_17)};
    }


function apagarVarConstrucaoConc17(e) {
    VarConstrucaoConc17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConstrucaoConc17(feature, layer) {
    if (feature.properties.VarCons_17 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConstrucaoConc17,
    });
}
var VarConstrucaoConc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConstrucaoConc17,
    onEachFeature: onEachFeatureVarConstrucaoConc17
});

let slideVarConstrucaoConc17 = function(){
    var sliderVarConstrucaoConc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 75){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConstrucaoConc17, {
        start: [minVarConstrucaoConc17, maxVarConstrucaoConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConstrucaoConc17,
            'max': maxVarConstrucaoConc17
        },
        });
    inputNumberMin.setAttribute("value",minVarConstrucaoConc17);
    inputNumberMax.setAttribute("value",maxVarConstrucaoConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConstrucaoConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConstrucaoConc17.noUiSlider.set([null, this.value]);
    });

    sliderVarConstrucaoConc17.noUiSlider.on('update',function(e){
        VarConstrucaoConc17.eachLayer(function(layer){
            if (layer.feature.properties.VarCons_17 == null){
                return false
            }
            if(layer.feature.properties.VarCons_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarCons_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarConstrucaoConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 75;
    sliderAtivo = sliderVarConstrucaoConc17.noUiSlider;
    $(slidersGeral).append(sliderVarConstrucaoConc17);
} 

///////////////////////////// Fim Variaçao Construção, em 2017 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2017, POR CONCELHOS -------------------////

var minVarAmpliacoesConc17 = 0;
var maxVarAmpliacoesConc17 = 0;

function CorVarAmpliacoes17_16(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#155273' :
                ''  ;
}

var legendaVarAmpliacoes17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -100 a -50' + '<br>'


    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesConc17(feature) {
    if(feature.properties.VarAmpl_17 <= minVarAmpliacoesConc17){
        minVarAmpliacoesConc17 = feature.properties.VarAmpl_17
    }
    if(feature.properties.VarAmpl_17 > maxVarAmpliacoesConc17){
        maxVarAmpliacoesConc17 = feature.properties.VarAmpl_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAmpliacoes17_16(feature.properties.VarAmpl_17)};
    }


function apagarVarAmpliacoesConc17(e) {
    VarAmpliacoesConc17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesConc17(feature, layer) {
    if (feature.properties.VarAmpl_17 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesConc17,
    });
}
var VarAmpliacoesConc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarAmpliacoesConc17,
    onEachFeature: onEachFeatureVarAmpliacoesConc17
});

let slideVarAmpliacoesConc17 = function(){
    var sliderVarAmpliacoesConc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 76){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesConc17, {
        start: [minVarAmpliacoesConc17, maxVarAmpliacoesConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesConc17,
            'max': maxVarAmpliacoesConc17
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesConc17);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesConc17.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesConc17.noUiSlider.on('update',function(e){
        VarAmpliacoesConc17.eachLayer(function(layer){
            if (layer.feature.properties.VarAmpl_17 == null){
                return false
            }
            if(layer.feature.properties.VarAmpl_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAmpl_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAmpliacoesConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 76;
    sliderAtivo = sliderVarAmpliacoesConc17.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesConc17);
} 

///////////////////////////// Fim Variação Ampliações, em 2017 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2018, POR CONCELHOS -------------------////

var minVarTotalConc18 = 0;
var maxVarTotalConc18 = 0;


function CorVarTotalEdi18_17(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotalEdi18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -22.73 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarTotalConc18(feature) {
    if(feature.properties.VarObra_18 <= minVarTotalConc18){
        minVarTotalConc18 = feature.properties.VarObra_18
    }
    if(feature.properties.VarObra_18 > maxVarTotalConc18){
        maxVarTotalConc18 = feature.properties.VarObra_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdi18_17(feature.properties.VarObra_18)};
    }


function apagarVarTotalConc18(e) {
    VarTotalConc18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc18(feature, layer) {
    if (feature.properties.VarObra_18 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_18.toFixed(2) + '</b>' + '%').openPopup()
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
            if (layer.feature.properties.VarObra_18 == null){
                return false
            }
            if(layer.feature.properties.VarObra_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarObra_18.toFixed(2) <= parseFloat(e[1])){
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

/////////////////////////////------- Variaçao Construção, em 2018, POR CONCELHOS -------------------////

var minVarConstrucaoConc18 = 0;
var maxVarConstrucaoConc18 = 0;

function CorVarConsNova18_17(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -75   ? '#155273' :
                ''  ;
}

var legendaVarConsNova18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Construção nova, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -61.54 a -50' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarConstrucaoConc18(feature) {
    if(feature.properties.VarCons_18 <= minVarConstrucaoConc18){
        minVarConstrucaoConc18 = feature.properties.VarCons_18
    }
    if(feature.properties.VarCons_18 > maxVarConstrucaoConc18){
        maxVarConstrucaoConc18 = feature.properties.VarCons_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarConsNova18_17(feature.properties.VarCons_18)};
    }


function apagarVarConstrucaoConc18(e) {
    VarConstrucaoConc18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConstrucaoConc18(feature, layer) {
    if (feature.properties.VarCons_18 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConstrucaoConc18,
    });
}
var VarConstrucaoConc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConstrucaoConc18,
    onEachFeature: onEachFeatureVarConstrucaoConc18
});

let slideVarConstrucaoConc18 = function(){
    var sliderVarConstrucaoConc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 80){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConstrucaoConc18, {
        start: [minVarConstrucaoConc18, maxVarConstrucaoConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConstrucaoConc18,
            'max': maxVarConstrucaoConc18
        },
        });
    inputNumberMin.setAttribute("value",minVarConstrucaoConc18);
    inputNumberMax.setAttribute("value",maxVarConstrucaoConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConstrucaoConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConstrucaoConc18.noUiSlider.set([null, this.value]);
    });

    sliderVarConstrucaoConc18.noUiSlider.on('update',function(e){
        VarConstrucaoConc18.eachLayer(function(layer){
            if (layer.feature.properties.VarCons_18 == null){
                return false
            }
            if(layer.feature.properties.VarCons_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarCons_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarConstrucaoConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 80;
    sliderAtivo = sliderVarConstrucaoConc18.noUiSlider;
    $(slidersGeral).append(sliderVarConstrucaoConc18);
} 

///////////////////////////// Fim Variaçao Construção, em 2018 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2018, POR CONCELHOS -------------------////

var minVarAmpliacoesConc18 = 0;
var maxVarAmpliacoesConc18 = 0;

function CorVarAmpliacoes18_17(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 25  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#155273' :
                ''  ;
}

var legendaVarAmpliacoes18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  25 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesConc18(feature) {
    if(feature.properties.VarAmpl_18 <= minVarAmpliacoesConc18){
        minVarAmpliacoesConc18 = feature.properties.VarAmpl_18
    }
    if(feature.properties.VarAmpl_18 > maxVarAmpliacoesConc18){
        maxVarAmpliacoesConc18 = feature.properties.VarAmpl_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAmpliacoes18_17(feature.properties.VarAmpl_18)};
    }


function apagarVarAmpliacoesConc18(e) {
    VarAmpliacoesConc18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesConc18(feature, layer) {
    if (feature.properties.VarAmpl_18 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesConc18,
    });
}
var VarAmpliacoesConc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarAmpliacoesConc18,
    onEachFeature: onEachFeatureVarAmpliacoesConc18
});

let slideVarAmpliacoesConc18 = function(){
    var sliderVarAmpliacoesConc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 81){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesConc18, {
        start: [minVarAmpliacoesConc18, maxVarAmpliacoesConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesConc18,
            'max': maxVarAmpliacoesConc18
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesConc18);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesConc18.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesConc18.noUiSlider.on('update',function(e){
        VarAmpliacoesConc18.eachLayer(function(layer){
            if (layer.feature.properties.VarAmpl_18 == null){
                return false
            }
            if(layer.feature.properties.VarAmpl_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAmpl_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAmpliacoesConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 81;
    sliderAtivo = sliderVarAmpliacoesConc18.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesConc18);
} 

///////////////////////////// Fim Variação Ampliações, em 2018 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2019, POR CONCELHOS -------------------////

var minVarTotalConc19 = 0;
var maxVarTotalConc19 = 0;


function CorVarTotalEdi19_18(d) {
    return d == null ? '#808080' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -28   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalEdi19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -26.92 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalConc19(feature) {
    if(feature.properties.VarObra_19 <= minVarTotalConc19 || minVarTotalConc19 === 0){
        minVarTotalConc19 = feature.properties.VarObra_19
    }
    if(feature.properties.VarObra_19 > maxVarTotalConc19){
        maxVarTotalConc19 = feature.properties.VarObra_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdi19_18(feature.properties.VarObra_19)};
    }


function apagarVarTotalConc19(e) {
    VarTotalConc19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc19(feature, layer) {
    if (feature.properties.VarObra_19 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_19.toFixed(2) + '</b>' + '%').openPopup()
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
            if (layer.feature.properties.VarObra_19 == null){
                return false
            }
            if(layer.feature.properties.VarObra_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarObra_19.toFixed(2) <= parseFloat(e[1])){
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

/////////////////////////////------- Variaçao Construção, em 2019, POR CONCELHOS -------------------////

var minVarConstrucaoConc19 = 0;
var maxVarConstrucaoConc19 = 0;

function CorVarConsNova19_18(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25   ? '#9eaad7' :
                ''  ;
}

var legendaVarConsNova19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Construção nova, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -23.53 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarConstrucaoConc19(feature) {
    if(feature.properties.VarCons_19 <= minVarConstrucaoConc19){
        minVarConstrucaoConc19 = feature.properties.VarCons_19
    }
    if(feature.properties.VarCons_19 > maxVarConstrucaoConc19){
        maxVarConstrucaoConc19 = feature.properties.VarCons_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarConsNova19_18(feature.properties.VarCons_19)};
    }


function apagarVarConstrucaoConc19(e) {
    VarConstrucaoConc19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConstrucaoConc19(feature, layer) {
    if (feature.properties.VarCons_19 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConstrucaoConc19,
    });
}
var VarConstrucaoConc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConstrucaoConc19,
    onEachFeature: onEachFeatureVarConstrucaoConc19
});

let slideVarConstrucaoConc19 = function(){
    var sliderVarConstrucaoConc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 85){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConstrucaoConc19, {
        start: [minVarConstrucaoConc19, maxVarConstrucaoConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConstrucaoConc19,
            'max': maxVarConstrucaoConc19
        },
        });
    inputNumberMin.setAttribute("value",minVarConstrucaoConc19);
    inputNumberMax.setAttribute("value",maxVarConstrucaoConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConstrucaoConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConstrucaoConc19.noUiSlider.set([null, this.value]);
    });

    sliderVarConstrucaoConc19.noUiSlider.on('update',function(e){
        VarConstrucaoConc19.eachLayer(function(layer){
            if (layer.feature.properties.VarCons_19 == null){
                return false
            }
            if(layer.feature.properties.VarCons_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarCons_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarConstrucaoConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 85;
    sliderAtivo = sliderVarConstrucaoConc19.noUiSlider;
    $(slidersGeral).append(sliderVarConstrucaoConc19);
} 

///////////////////////////// Fim Variaçao Construção, em 2019 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2019, POR CONCELHOS -------------------////

var minVarAmpliacoesConc19 = 0;
var maxVarAmpliacoesConc19 = 0;


function CorVarAmpliacoes19_18(d) {
    return d == null ? '#808080' :
        d >= 50  ? '#8c0303' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#155273' :
                ''  ;
}

var legendaVarAmpliacoes19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarAmpliacoesConc19(feature) {
    if(feature.properties.VarAmpl_19 <= minVarAmpliacoesConc19){
        minVarAmpliacoesConc19 = feature.properties.VarAmpl_19
    }
    if(feature.properties.VarAmpl_19 > maxVarAmpliacoesConc19){
        maxVarAmpliacoesConc19 = feature.properties.VarAmpl_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAmpliacoes19_18(feature.properties.VarAmpl_19)};
    }


function apagarVarAmpliacoesConc19(e) {
    VarAmpliacoesConc19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesConc19(feature, layer) {
    if (feature.properties.VarAmpl_19 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesConc19,
    });
}
var VarAmpliacoesConc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarAmpliacoesConc19,
    onEachFeature: onEachFeatureVarAmpliacoesConc19
});

let slideVarAmpliacoesConc19 = function(){
    var sliderVarAmpliacoesConc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 86){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesConc19, {
        start: [minVarAmpliacoesConc19, maxVarAmpliacoesConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesConc19,
            'max': maxVarAmpliacoesConc19
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesConc19);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesConc19.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesConc19.noUiSlider.on('update',function(e){
        VarAmpliacoesConc19.eachLayer(function(layer){
            if (layer.feature.properties.VarAmpl_19 == null){
                return false
            }
            if(layer.feature.properties.VarAmpl_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAmpl_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAmpliacoesConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 86;
    sliderAtivo = sliderVarAmpliacoesConc19.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesConc19);
} 

///////////////////////////// Fim Variação Ampliações, em 2019 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2020, POR CONCELHOS -------------------////

var minVarTotalConc20 = 0;
var maxVarTotalConc20 = 0;

function CorVarTotalEdi20_19(d) {
    return d == null ? '#808080' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -75   ? '#155273' :
                ''  ;
}

var legendaVarTotalEdi20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -63.94 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarTotalConc20(feature) {
    if(feature.properties.VarObra_20 <= minVarTotalConc20 || minVarTotalConc20 === 0){
        minVarTotalConc20 = feature.properties.VarObra_20
    }
    if(feature.properties.VarObra_20 > maxVarTotalConc20){
        maxVarTotalConc20 = feature.properties.VarObra_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdi20_19(feature.properties.VarObra_20)};
    }


function apagarVarTotalConc20(e) {
    VarTotalConc20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalConc20(feature, layer) {
    if (feature.properties.VarObra_20 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_20.toFixed(2) + '</b>' + '%').openPopup()
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
            if (layer.feature.properties.VarObra_20 == null){
                return false
            }
            if(layer.feature.properties.VarObra_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarObra_20.toFixed(2) <= parseFloat(e[1])){
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

/////////////////////////////------- Variaçao Construção, em 2020, POR CONCELHOS -------------------////

var minVarConstrucaoConc20 = 0;
var maxVarConstrucaoConc20 = 0;

function CorVarConsNova20_19(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50   ? '#2288bf' :
                ''  ;
}

var legendaVarConsNova20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Construção nova, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -33.33 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarConstrucaoConc20(feature) {
    if(feature.properties.VarCons_20 <= minVarConstrucaoConc20){
        minVarConstrucaoConc20 = feature.properties.VarCons_20
    }
    if(feature.properties.VarCons_20 > maxVarConstrucaoConc20){
        maxVarConstrucaoConc20 = feature.properties.VarCons_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarConsNova20_19(feature.properties.VarCons_20)};
    }


function apagarVarConstrucaoConc20(e) {
    VarConstrucaoConc20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConstrucaoConc20(feature, layer) {
    if (feature.properties.VarCons_20 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConstrucaoConc20,
    });
}
var VarConstrucaoConc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConstrucaoConc20,
    onEachFeature: onEachFeatureVarConstrucaoConc20
});

let slideVarConstrucaoConc20 = function(){
    var sliderVarConstrucaoConc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 90){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConstrucaoConc20, {
        start: [minVarConstrucaoConc20, maxVarConstrucaoConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConstrucaoConc20,
            'max': maxVarConstrucaoConc20
        },
        });
    inputNumberMin.setAttribute("value",minVarConstrucaoConc20);
    inputNumberMax.setAttribute("value",maxVarConstrucaoConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConstrucaoConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConstrucaoConc20.noUiSlider.set([null, this.value]);
    });

    sliderVarConstrucaoConc20.noUiSlider.on('update',function(e){
        VarConstrucaoConc20.eachLayer(function(layer){
            if (layer.feature.properties.VarCons_20 == null){
                return false
            }
            if(layer.feature.properties.VarCons_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarCons_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarConstrucaoConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 90;
    sliderAtivo = sliderVarConstrucaoConc20.noUiSlider;
    $(slidersGeral).append(sliderVarConstrucaoConc20);
} 

///////////////////////////// Fim Variaçao Construção, em 2020 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2020, POR CONCELHOS -------------------////

var minVarAmpliacoesConc20 = 0;
var maxVarAmpliacoesConc20 = 0;

function CorVarAmpliacoes20_19(d) {
    return d == null ? '#808080' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarAmpliacoes20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesConc20(feature) {
    if(feature.properties.VarAmpl_20 <= minVarAmpliacoesConc20){
        minVarAmpliacoesConc20 = feature.properties.VarAmpl_20
    }
    if(feature.properties.VarAmpl_20 > maxVarAmpliacoesConc20){
        maxVarAmpliacoesConc20 = feature.properties.VarAmpl_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarAmpliacoes20_19(feature.properties.VarAmpl_20)};
    }


function apagarVarAmpliacoesConc20(e) {
    VarAmpliacoesConc20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesConc20(feature, layer) {
    if (feature.properties.VarAmpl_20 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesConc20,
    });
}
var VarAmpliacoesConc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarAmpliacoesConc20,
    onEachFeature: onEachFeatureVarAmpliacoesConc20
});

let slideVarAmpliacoesConc20 = function(){
    var sliderVarAmpliacoesConc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 91){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesConc20, {
        start: [minVarAmpliacoesConc20, maxVarAmpliacoesConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesConc20,
            'max': maxVarAmpliacoesConc20
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesConc20);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesConc20.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesConc20.noUiSlider.on('update',function(e){
        VarAmpliacoesConc20.eachLayer(function(layer){
            if (layer.feature.properties.VarAmpl_20 == null){
                return false
            }
            if(layer.feature.properties.VarAmpl_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarAmpl_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAmpliacoesConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 91;
    sliderAtivo = sliderVarAmpliacoesConc20.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesConc20);
} 

///////////////////////////// Fim Variação Ampliações, em 2020 , POR CONCELHOS -------------- \\\\\

//////////////////--------------- FIM CONCELHOS


/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotalEdificiosConc14;
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
    if (layer == TotalEdificiosConc14 && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos, em 2014, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc14, ((maxTotalEdificiosConc14-minTotalEdificiosConc14)/2).toFixed(0),minTotalEdificiosConc14,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc14();
        naoDuplicar = 1;
    }
    if (layer == TotalEdificiosConc14 && naoDuplicar == 1){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos, em 2014, por concelho.' + '</strong>');
        contorno.addTo(map);
    }
    if (layer == EdificiosConsNovaConc14 && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Construção nova, em 2014, por concelho.' + '</strong>');
        legendaExcecao(maxEdificiosConsNovaConc14, ((maxEdificiosConsNovaConc14-minEdificiosConsNovaConc14)/2).toFixed(0),minEdificiosConsNovaConc14,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc14();
        naoDuplicar = 2;
    }
    if (layer == EdificiosAmpliacaoConc14 && naoDuplicar != 3){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2014, por concelho.' + '</strong>');
        legendaExcecao(maxEdificiosAmpliacaoConc14, ((maxEdificiosAmpliacaoConc14-minEdificiosAmpliacaoConc14)/2).toFixed(0),minEdificiosAmpliacaoConc14,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacaoConc14();
        naoDuplicar = 3;
    }
    if (layer == TotalEdificiosConc15 && naoDuplicar != 6){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos, em 2015, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc15, ((maxTotalEdificiosConc15-minTotalEdificiosConc15)/2).toFixed(0),minTotalEdificiosConc15,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc15();
        naoDuplicar = 6;
    }
    if (layer == EdificiosConsNovaConc15 && naoDuplicar != 7){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Construção nova, em 2015, por concelho.' + '</strong>');
        legendaExcecao(maxEdificiosConsNovaConc15, ((maxEdificiosConsNovaConc15-minEdificiosConsNovaConc15)/2).toFixed(0),minEdificiosConsNovaConc15,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc15();
        naoDuplicar = 7;
    }
    if (layer == EdificiosAmpliacaoConc15 && naoDuplicar != 8){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2015, por concelho.' + '</strong>');
        legendaExcecao(maxEdificiosAmpliacaoConc15, ((maxEdificiosAmpliacaoConc15-minEdificiosAmpliacaoConc15)/2).toFixed(0),minEdificiosAmpliacaoConc15,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacaoConc15();
        naoDuplicar = 8;
    }
    if (layer == TotalEdificiosConc16 && naoDuplicar != 11){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos, em 2016, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc16, ((maxTotalEdificiosConc16-minTotalEdificiosConc16)/2).toFixed(0),minTotalEdificiosConc16,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc16();
        naoDuplicar = 11;
    }
    if (layer == EdificiosConsNovaConc16 && naoDuplicar != 12){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Construção nova, em 2016, por concelho.' + '</strong>');
        legenda(maxEdificiosConsNovaConc16, ((maxEdificiosConsNovaConc16-minEdificiosConsNovaConc16)/2).toFixed(0),minEdificiosConsNovaConc16,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc16();
        naoDuplicar = 12;
    }
    if (layer == EdificiosAmpliacaoConc16 && naoDuplicar != 13){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2016, por concelho.' + '</strong>');
        legendaExcecao(maxEdificiosAmpliacaoConc16, ((maxEdificiosAmpliacaoConc16-minEdificiosAmpliacaoConc16)/2).toFixed(0),minEdificiosAmpliacaoConc16,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacaoConc16();
        naoDuplicar = 13;
    }
    if (layer == TotalEdificiosConc17 && naoDuplicar != 16){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos, em 2017, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc17, ((maxTotalEdificiosConc17-minTotalEdificiosConc17)/2).toFixed(0),minTotalEdificiosConc17,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc17();
        naoDuplicar = 16;
    }
    if (layer == EdificiosConsNovaConc17 && naoDuplicar != 17){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Construção nova, em 2017, por concelho.' + '</strong>');
        legendaExcecao(maxEdificiosConsNovaConc17, ((maxEdificiosConsNovaConc17-minEdificiosConsNovaConc17)/2).toFixed(0),minEdificiosConsNovaConc17,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc17();
        naoDuplicar = 17;
    }
    if (layer == EdificiosAmpliacaoConc17 && naoDuplicar != 18){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2017, por concelho.' + '</strong>');
        legendaExcecao(maxEdificiosAmpliacaoConc17, ((maxEdificiosAmpliacaoConc17-minEdificiosAmpliacaoConc17)/2).toFixed(0),minEdificiosAmpliacaoConc17,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacaoConc17();
        naoDuplicar = 18;
    }
    if (layer == TotalEdificiosConc18 && naoDuplicar != 21){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos, em 2018, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc18, ((maxTotalEdificiosConc18-minTotalEdificiosConc18)/2).toFixed(0),minTotalEdificiosConc18,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc18();
        naoDuplicar = 21;
    }
    if (layer == EdificiosConsNovaConc18 && naoDuplicar != 22){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Construção nova, em 2018, por concelho.' + '</strong>');
        legenda(maxEdificiosConsNovaConc18, ((maxEdificiosConsNovaConc18-minEdificiosConsNovaConc18)/2).toFixed(0),minEdificiosConsNovaConc18,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc18();
        naoDuplicar = 22;
    }
    if (layer == EdificiosAmpliacaoConc18 && naoDuplicar != 23){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2018, por concelho.' + '</strong>');
        legenda(maxEdificiosAmpliacaoConc18, ((maxEdificiosAmpliacaoConc18-minEdificiosAmpliacaoConc18)/2).toFixed(0),minEdificiosAmpliacaoConc18,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacaoConc18();
        naoDuplicar = 23;
    }
    if (layer == TotalEdificiosConc19 && naoDuplicar != 26){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos, em 2019, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc19, ((maxTotalEdificiosConc19-minTotalEdificiosConc19)/2).toFixed(0),minTotalEdificiosConc19,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc19();
        naoDuplicar = 26;
    }
    if (layer == EdificiosConsNovaConc19 && naoDuplicar != 27){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Construção nova, em 2019, por concelho.' + '</strong>');
        legenda(maxEdificiosConsNovaConc19, ((maxEdificiosConsNovaConc19-minEdificiosConsNovaConc19)/2).toFixed(0),minEdificiosConsNovaConc19,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc19();
        naoDuplicar = 27;
    }
    if (layer == EdificiosAmpliacaoConc19 && naoDuplicar != 28){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2019, por concelho.' + '</strong>');
        legenda(maxEdificiosAmpliacaoConc19, ((maxEdificiosAmpliacaoConc19-minEdificiosAmpliacaoConc19)/2).toFixed(0),minEdificiosAmpliacaoConc19,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacaoConc19();
        naoDuplicar = 28;
    }
    if (layer == TotalEdificiosConc20 && naoDuplicar != 31){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos, em 2020, por concelho.' + '</strong>');
        legenda(maxTotalEdificiosConc20, ((maxTotalEdificiosConc20-minTotalEdificiosConc20)/2).toFixed(0),minTotalEdificiosConc20,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc20();
        naoDuplicar = 31;
    }
    if (layer == EdificiosConsNovaConc20 && naoDuplicar != 32){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Construção nova, em 2020, por concelho.' + '</strong>');
        legenda(maxEdificiosConsNovaConc20, ((maxEdificiosConsNovaConc20-minEdificiosConsNovaConc20)/2).toFixed(0),minEdificiosConsNovaConc20,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc20();
        naoDuplicar = 32;
    }
    if (layer == EdificiosAmpliacaoConc20 && naoDuplicar != 33){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2020, por concelho.' + '</strong>');
        legenda(maxEdificiosAmpliacaoConc20, ((maxEdificiosAmpliacaoConc20-minEdificiosAmpliacaoConc20)/2).toFixed(0),minEdificiosAmpliacaoConc20,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacaoConc20();
        naoDuplicar = 33;
    }
    if (layer == PerConsNovaConc14 && naoDuplicar != 36){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Construção nova em 2014.' + '</strong>');
        legendaPercentagensConc();
        slidePerConsNovaConc14();
        naoDuplicar = 36;
    }
    if (layer == PerAmpliacaoConc14 && naoDuplicar != 37){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2014.' + '</strong>');
        legendaPercentagensConc();
        slidePerAmpliacaoConc14();
        naoDuplicar = 37;
    }
    if (layer == PerConsNovaConc15 && naoDuplicar != 40){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Construção nova em 2015.' + '</strong>');
        legendaPercentagensConc();
        slidePerConsNovaConc15();
        naoDuplicar = 40;
    }
    if (layer == PerAmpliacaoConc15 && naoDuplicar != 41){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2015.' + '</strong>');
        legendaPercentagensConc();
        slidePerAmpliacaoConc15();
        naoDuplicar = 41;
    }
    if (layer == PerConsNovaConc16 && naoDuplicar != 44){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Construção nova em 2016.' + '</strong>');
        legendaPercentagensConc();
        slidePerConsNovaConc16();
        naoDuplicar = 44;
    }
    if (layer == PerAmpliacaoConc16 && naoDuplicar != 45){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2016.' + '</strong>');
        legendaPercentagensConc();
        slidePerAmpliacaoConc16();
        naoDuplicar = 45;
    }
    if (layer == PerConsNovaConc17 && naoDuplicar != 48){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Construção nova em 2017.' + '</strong>');
        legendaPercentagensConc();
        slidePerConsNovaConc17();
        naoDuplicar = 48;
    }
    if (layer == PerAmpliacaoConc17 && naoDuplicar != 49){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2017.' + '</strong>');
        legendaPercentagensConc();
        slidePerAmpliacaoConc17();
        naoDuplicar = 49;
    }
    if (layer == PerConsNovaConc18 && naoDuplicar != 52){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Construção nova em 2018.' + '</strong>');
        legendaPercentagensConc();
        slidePerConsNovaConc18();
        naoDuplicar = 52;
    }
    if (layer == PerAmpliacaoConc18 && naoDuplicar != 53){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2018.' + '</strong>');
        legendaPercentagensConc();
        slidePerAmpliacaoConc18();
        naoDuplicar = 53;
    }
    if (layer == PerConsNovaConc19 && naoDuplicar != 56){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Construção nova em 2019.' + '</strong>');
        legendaPercentagensConc();
        slidePerConsNovaConc19();
        naoDuplicar = 56;
    }
    if (layer == PerAmpliacaoConc19 && naoDuplicar != 57){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2019.' + '</strong>');
        legendaPercentagensConc();
        slidePerAmpliacaoConc19();
        naoDuplicar = 57;
    }
    if (layer == PerConsNovaConc20 && naoDuplicar != 60){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Construção nova em 2020.' + '</strong>');
        legendaPercentagensConc();
        slidePerConsNovaConc20();
        naoDuplicar = 60;
    }
    if (layer == PerAmpliacaoConc20 && naoDuplicar != 61){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios concluídos pelo tipo de obra: Ampliações, alterações e reconstruções, em 2020.' + '</strong>');
        legendaPercentagensConc();
        slidePerAmpliacaoConc20();
        naoDuplicar = 61;
    }
    if (layer == VarTotalConc15 && naoDuplicar != 64){
        legendaVarTotalEdi15_14();
        slideVarTotalConc15();
        naoDuplicar = 64;
    }
    if (layer == VarConstrucaoConc15 && naoDuplicar != 65){
        legendaVarConsNova15_14();
        slideVarConstrucaoConc15();
        naoDuplicar = 65;
    }
    if (layer == VarAmpliacoesConc15 && naoDuplicar != 66){
        legendaVarAmpliacoes15_14();
        slideVarAmpliacoesConc15();
        naoDuplicar = 66;
    }
    if (layer == VarTotalConc16 && naoDuplicar != 69){
        legendaVarTotalEdi16_15();
        slideVarTotalConc16();
        naoDuplicar = 69;
    }
    if (layer == VarConstrucaoConc16 && naoDuplicar != 70){
        legendaVarConsNova16_15();
        slideVarConstrucaoConc16();
        naoDuplicar = 70;
    }
    if (layer == VarAmpliacoesConc16 && naoDuplicar != 71){
        legendaVarAmpliacoes16_15();
        slideVarAmpliacoesConc16();
        naoDuplicar = 71;
    }
    if (layer == VarTotalConc17 && naoDuplicar != 74){
        legendaVarTotalEdi17_16();
        slideVarTotalConc17();
        naoDuplicar = 74;
    }
    if (layer == VarConstrucaoConc17 && naoDuplicar != 75){
        legendaVarConsNova17_16();
        slideVarConstrucaoConc17();
        naoDuplicar = 75;
    }
    if (layer == VarAmpliacoesConc17 && naoDuplicar != 76){
        legendaVarAmpliacoes17_16();
        slideVarAmpliacoesConc17();
        naoDuplicar = 76;
    }
    if (layer == VarTotalConc18 && naoDuplicar != 79){
        legendaVarTotalEdi18_17();
        slideVarTotalConc18();
        naoDuplicar = 79;
    }
    if (layer == VarConstrucaoConc18 && naoDuplicar != 80){
        legendaVarConsNova18_17();
        slideVarConstrucaoConc18();
        naoDuplicar = 80;
    }
    if (layer == VarAmpliacoesConc18 && naoDuplicar != 81){
        legendaVarAmpliacoes18_17();
        slideVarAmpliacoesConc18();
        naoDuplicar = 81;
    }
    if (layer == VarTotalConc19 && naoDuplicar != 84){
        legendaVarTotalEdi19_18();
        slideVarTotalConc19();
        naoDuplicar = 84;
    }
    if (layer == VarConstrucaoConc19 && naoDuplicar != 85){
        legendaVarConsNova19_18();
        slideVarConstrucaoConc19();
        naoDuplicar = 85;
    }
    if (layer == VarAmpliacoesConc19 && naoDuplicar != 86){
        legendaVarAmpliacoes19_18();
        slideVarAmpliacoesConc19();
        naoDuplicar = 86;
    }
    if (layer == VarTotalConc20 && naoDuplicar != 89){
        legendaVarTotalEdi20_19();
        slideVarTotalConc20();
        naoDuplicar = 89;
    }
    if (layer == VarConstrucaoConc20 && naoDuplicar != 90){
        legendaVarConsNova20_19();
        slideVarConstrucaoConc20();
        naoDuplicar = 90;
    }
    if (layer == VarAmpliacoesConc20 && naoDuplicar != 91){
        legendaVarAmpliacoes20_19();
        slideVarAmpliacoesConc20();
        naoDuplicar = 91;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}

function myFunction() {
    var ano = document.getElementById("mySelect").value;
    var tipologia = document.getElementById("opcaoSelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#absoluto').hasClass('active4')){
            if (ano == "2014" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc14)
            }
            if (ano == "2014" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc14)
            }
            if (ano == "2014" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacaoConc14)
            } 
            if (ano == "2015" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc15)
            }     
            if (ano == "2015" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc15)
            }
            if (ano == "2015" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacaoConc15);
            } 
            if (ano == "2016" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc16);
            }
            if (ano == "2016" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc16);
            }
            if (ano == "2016" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacaoConc16);
            } 
            if (ano == "2017" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc17);
            }
            if (ano == "2017" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc17);
            }
            if (ano == "2017" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacaoConc17);
            } 
            if (ano == "2018" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc18);
            }
            if (ano == "2018" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc18);
            }
            if (ano == "2018" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacaoConc18);
            } 
            if (ano == "2019" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc19);
            }
            if (ano == "2019" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc19);
            }
            if (ano == "2019" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacaoConc19);
            } 
            if (ano == "2020" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc20);
            }
            if (ano == "2020" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc20);
            }
            if (ano == "2020" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacaoConc20);
            } 
        }
    if ($('#percentagem').hasClass('active4')){
            if ($('#notaRodape').length){
                $('#notaRodape').remove();
            }
            if (ano == "2014" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc14)
            }
            if (ano == "2014" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacaoConc14)
            }      
            if (ano == "2015" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc15)
            }
            if (ano == "2015" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacaoConc15)
            } 
            if (ano == "2016" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc16)
            }
            if (ano == "2016" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacaoConc16)
            } 
            if (ano == "2017" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc17)
            }
            if (ano == "2017" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacaoConc17)
            } 
            if (ano == "2018" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc18)
            }
            if (ano == "2018" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacaoConc18)
            } 
            if (ano == "2019" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc19)
            }
            if (ano == "2019" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacaoConc19)
            } 
            if (ano == "2020" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc20)
            }
            if (ano == "2020" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacaoConc20)
            }  
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if ($('#notaRodape').length){
                $('#notaRodape').remove();
            }
            if (ano == "2015" && tipologia == "Total"){
                novaLayer(VarTotalConc15)
            }
            if (ano == "2015" && tipologia == "Construcao"){
                novaLayer(VarConstrucaoConc15)
            }
            if (ano == "2015" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc15)
            }     
            if (ano == "2016" && tipologia == "Total"){
                novaLayer(VarTotalConc16)
            }
            if (ano == "2016" && tipologia == "Construcao"){
                novaLayer(VarConstrucaoConc16)
            }
            if (ano == "2016" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc16)
            } 
            if (ano == "2017" && tipologia == "Total"){
                novaLayer(VarTotalConc17)
            }
            if (ano == "2017" && tipologia == "Construcao"){
                novaLayer(VarConstrucaoConc17)
            }
            if (ano == "2017" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc17)
            } 
            if (ano == "2018" && tipologia == "Total"){
                novaLayer(VarTotalConc18)
            }
            if (ano == "2018" && tipologia == "Construcao"){
                novaLayer(VarConstrucaoConc18)
            }
            if (ano == "2018" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc18)
            } 
            if (ano == "2019" && tipologia == "Total"){
                novaLayer(VarTotalConc19)
            }
            if (ano == "2019" && tipologia == "Construcao"){
                novaLayer(VarConstrucaoConc19)
            }
            if (ano == "2019" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc19)
            } 
            if (ano == "2020" && tipologia == "Total"){
                novaLayer(VarTotalConc20)
            }
            if (ano == "2020" && tipologia == "Construcao"){
                novaLayer(VarConstrucaoConc20)
            }
            if (ano == "2020" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc20)
            }           
        }
    }
}

let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Estatísticas das obras concluídas.' );
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Estatísticas das obras concluídas.' );
    }
}

let tipologiasAbsolutos = function(){
    if ($('#absoluto').hasClass('active4') || $('#taxaVariacao').hasClass('active4') ){
        if ($("#opcaoSelect option[value='Total']").length == 0){
            $("#opcaoSelect option").eq(0).before($("<option></option>").val("Total").text("Total"));
        }
    }
    if ($('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        $("#opcaoSelect option[value='Total']").remove();
    }
}
let reporAnos = function(){
    if ($('#absoluto').hasClass('active4') || $('#percentagem').hasClass('active4')){
        if ($("#mySelect option[value='2014']").length == 0){
            $("#mySelect option").eq(0).before($("<option></option>").val("2014").text("2014"));
        }
        $("#mySelect option[value='2015']").html("2015");
        $("#mySelect option[value='2016']").html("2016");
        $("#mySelect option[value='2017']").html("2017");
        $("#mySelect option[value='2018']").html("2018");
        $("#mySelect option[value='2019']").html("2019");
        $("#mySelect option[value='2020']").html("2020");
        if ($('#absoluto').hasClass('active4') || $('#absoluto').hasClass('active5')){
            primeirovalor('2014','Total');
        }
        if ($('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
            primeirovalor('2014','Construcao')
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
    reporAnos();
    tipologiasAbsolutos();
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

$('#concelho').click(function(){
    variaveisMapaConcelho();
});
$('#mySelect').change(function(){
    myFunction();
})
$('#opcaoSelect').change(function(){
    myFunction();
})
variaveisMapaConcelho = function(){
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
    $('#tituloMapa').html('Número de edifícios concluídos, segundo o tipo de obra, entre 2014 e 2020, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EdificiosConcluidosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2014').html("2014")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Freguesia)){
                    dados += '<td class="bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="bordertop negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="bordertop">'+value.Tipologia+'</td>';
                    dados += '<td class="bordertop">'+value.Dados2014.toLocaleString("fr")+'</td>';
                    dados += '<td class="bordertop">'+value.Dados2015.toLocaleString("fr")+'</td>';
                    dados += '<td class="bordertop">'+value.Dados2016.toLocaleString("fr")+'</td>';
                    dados += '<td class="bordertop">'+value.Dados2017.toLocaleString("fr")+'</td>';
                    dados += '<td class="bordertop">'+value.Dados2018.toLocaleString("fr")+'</td>';
                    dados += '<td class="bordertop">'+value.Dados2019.toLocaleString("fr")+'</td>';
                    dados += '<td class="bordertop">'+value.Dados2020.toLocaleString("fr")+'</td>';
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
    $('#tituloMapa').html('Proporção do número de edifícios concluídos, segundo o tipo de obra, entre 2014 e 2020, %.')
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EdificiosConcluidosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2014').html("2014")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Tipologia == "Ampliações, alterações e reconstruções"  || containsAnyLetter(value.Concelho)){
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
    $('#tituloMapa').html('Variação do número de edifícios concluídos, segundo o tipo de obra, entre 2014 e 2020, %.')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EdificiosConcluidosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2014').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(value.Tipologia == "Ampliações, alterações e reconstruções"  || containsAnyLetter(value.Concelho)){
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
