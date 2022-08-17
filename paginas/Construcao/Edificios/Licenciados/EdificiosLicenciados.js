// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'
$('#tituloMapa').css('font-size','9pt')
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


////////////////////////////////////----------- TOTAL Edifícios licenciados 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Ob14 + '</b>').openPopup()
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

var legenda = function( maximo,medio,minimo, multiplicador) {
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
$('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2014, por concelho.' + '</strong>')
legendaExcecao(maxTotalEdificiosConc14, ((maxTotalEdificiosConc14-minTotalEdificiosConc14)/2).toFixed(0),minTotalEdificiosConc14,1.8);
slideTotalEdificiosConc14();

///////////////////////////-------------  FIM TOTAL Edifícios licenciados 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Co14 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edificios AMPLIAÇÕES Licenciados 2014, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesConc14 = 99999;
var maxEdificiosAmpliacoesConc14 = 0;
function estiloEdificiosAmpliacoesConc14(feature, latlng) {
    if(feature.properties.Edi_T_Am14< minEdificiosAmpliacoesConc14 || feature.properties.Edi_T_Am14 ===0){
        minEdificiosAmpliacoesConc14 = feature.properties.Edi_T_Am14
    }
    if(feature.properties.Edi_T_Am14> maxEdificiosAmpliacoesConc14){
        maxEdificiosAmpliacoesConc14 = feature.properties.Edi_T_Am14
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am14,1.8)
    });
}
function apagarEdificiosAmpliacoesConc14(e){
    var layer = e.target;
    EdificiosAmpliacoesConc14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesConc14(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Am14 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesConc14,
    })
};

var EdificiosAmpliacoesConc14= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacoesConc14,
    onEachFeature: onEachFeatureEdificiosAmpliacoesConc14,
});

var slideEdificiosAmpliacoesConc14 = function(){
    var sliderEdificiosAmpliacoesConc14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesConc14, {
        start: [minEdificiosAmpliacoesConc14, maxEdificiosAmpliacoesConc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesConc14,
            'max': maxEdificiosAmpliacoesConc14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesConc14);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesConc14);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc14.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesConc14.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesConc14.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am14>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesConc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderEdificiosAmpliacoesConc14.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesConc14);
}

///////////////////////////-------------  FIM TOTAL Edificios AMPLIAÇÕES Licenciados 2014, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edifícios licenciados 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Ob15 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edifícios licenciados 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Co15 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edificios AMPLIAÇÕES Licenciados 2015, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesConc15 = 99999;
var maxEdificiosAmpliacoesConc15 = 0;
function estiloEdificiosAmpliacoesConc15(feature, latlng) {
    if(feature.properties.Edi_T_Am15< minEdificiosAmpliacoesConc15 || feature.properties.Edi_T_Am15 ===0){
        minEdificiosAmpliacoesConc15 = feature.properties.Edi_T_Am15
    }
    if(feature.properties.Edi_T_Am15> maxEdificiosAmpliacoesConc15){
        maxEdificiosAmpliacoesConc15 = feature.properties.Edi_T_Am15
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am15,1.8)
    });
}
function apagarEdificiosAmpliacoesConc15(e){
    var layer = e.target;
    EdificiosAmpliacoesConc15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesConc15(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Am15 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesConc15,
    })
};

var EdificiosAmpliacoesConc15= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacoesConc15,
    onEachFeature: onEachFeatureEdificiosAmpliacoesConc15,
});

var slideEdificiosAmpliacoesConc15 = function(){
    var sliderEdificiosAmpliacoesConc15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesConc15, {
        start: [minEdificiosAmpliacoesConc15, maxEdificiosAmpliacoesConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesConc15,
            'max': maxEdificiosAmpliacoesConc15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesConc15);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc15.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesConc15.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesConc15.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am15>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderEdificiosAmpliacoesConc15.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesConc15);
}

///////////////////////////-------------  FIM TOTAL Edificios AMPLIAÇÕES Licenciados 2015, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL Edifícios licenciados 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Ob16 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edifícios licenciados 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Co16 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edificios AMPLIAÇÕES Licenciados 2016, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesConc16 = 99999;
var maxEdificiosAmpliacoesConc16 = 0;
function estiloEdificiosAmpliacoesConc16(feature, latlng) {
    if(feature.properties.Edi_T_Am16< minEdificiosAmpliacoesConc16 || feature.properties.Edi_T_Am16 ===0){
        minEdificiosAmpliacoesConc16 = feature.properties.Edi_T_Am16
    }
    if(feature.properties.Edi_T_Am16> maxEdificiosAmpliacoesConc16){
        maxEdificiosAmpliacoesConc16 = feature.properties.Edi_T_Am16
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am16,1.8)
    });
}
function apagarEdificiosAmpliacoesConc16(e){
    var layer = e.target;
    EdificiosAmpliacoesConc16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesConc16(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Am16 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesConc16,
    })
};

var EdificiosAmpliacoesConc16= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacoesConc16,
    onEachFeature: onEachFeatureEdificiosAmpliacoesConc16,
});

var slideEdificiosAmpliacoesConc16 = function(){
    var sliderEdificiosAmpliacoesConc16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesConc16, {
        start: [minEdificiosAmpliacoesConc16, maxEdificiosAmpliacoesConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesConc16,
            'max': maxEdificiosAmpliacoesConc16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesConc16);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc16.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesConc16.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesConc16.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am16>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderEdificiosAmpliacoesConc16.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesConc16);
}

///////////////////////////-------------  FIM TOTAL Edificios AMPLIAÇÕES Licenciados 2016, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////////----------- TOTAL Edifícios licenciados 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Ob17 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edifícios licenciados 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Co17 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edificios AMPLIAÇÕES Licenciados 2017, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesConc17 = 99999;
var maxEdificiosAmpliacoesConc17 = 0;
function estiloEdificiosAmpliacoesConc17(feature, latlng) {
    if(feature.properties.Edi_T_Am17< minEdificiosAmpliacoesConc17 || feature.properties.Edi_T_Am17 ===0){
        minEdificiosAmpliacoesConc17 = feature.properties.Edi_T_Am17
    }
    if(feature.properties.Edi_T_Am17> maxEdificiosAmpliacoesConc17){
        maxEdificiosAmpliacoesConc17 = feature.properties.Edi_T_Am17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am17,1.8)
    });
}
function apagarEdificiosAmpliacoesConc17(e){
    var layer = e.target;
    EdificiosAmpliacoesConc17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesConc17(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Am17 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesConc17,
    })
};

var EdificiosAmpliacoesConc17= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacoesConc17,
    onEachFeature: onEachFeatureEdificiosAmpliacoesConc17,
});

var slideEdificiosAmpliacoesConc17 = function(){
    var sliderEdificiosAmpliacoesConc17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesConc17, {
        start: [minEdificiosAmpliacoesConc17, maxEdificiosAmpliacoesConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesConc17,
            'max': maxEdificiosAmpliacoesConc17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesConc17);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc17.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesConc17.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesConc17.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am17>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderEdificiosAmpliacoesConc17.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesConc17);
}

///////////////////////////-------------  FIM TOTAL Edificios AMPLIAÇÕES Licenciados 2017, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edifícios licenciados 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Ob18 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edifícios licenciados 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Co18 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edificios AMPLIAÇÕES Licenciados 2018, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesConc18 = 99999;
var maxEdificiosAmpliacoesConc18 = 0;
function estiloEdificiosAmpliacoesConc18(feature, latlng) {
    if(feature.properties.Edi_T_Am18< minEdificiosAmpliacoesConc18 || feature.properties.Edi_T_Am18 ===0){
        minEdificiosAmpliacoesConc18 = feature.properties.Edi_T_Am18
    }
    if(feature.properties.Edi_T_Am18> maxEdificiosAmpliacoesConc18){
        maxEdificiosAmpliacoesConc18 = feature.properties.Edi_T_Am18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am18,1.8)
    });
}
function apagarEdificiosAmpliacoesConc18(e){
    var layer = e.target;
    EdificiosAmpliacoesConc18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesConc18(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Am18 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesConc18,
    })
};

var EdificiosAmpliacoesConc18= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacoesConc18,
    onEachFeature: onEachFeatureEdificiosAmpliacoesConc18,
});

var slideEdificiosAmpliacoesConc18 = function(){
    var sliderEdificiosAmpliacoesConc18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesConc18, {
        start: [minEdificiosAmpliacoesConc18, maxEdificiosAmpliacoesConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesConc18,
            'max': maxEdificiosAmpliacoesConc18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesConc18);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc18.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesConc18.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesConc18.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am18>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderEdificiosAmpliacoesConc18.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesConc18);
}

///////////////////////////-------------  FIM TOTAL Edificios AMPLIAÇÕES Licenciados 2018, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edifícios licenciados 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Ob19 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edifícios licenciados 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Co19 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edificios AMPLIAÇÕES Licenciados 2019, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesConc19 = 99999;
var maxEdificiosAmpliacoesConc19 = 0;
function estiloEdificiosAmpliacoesConc19(feature, latlng) {
    if(feature.properties.Edi_T_Am19< minEdificiosAmpliacoesConc19 || feature.properties.Edi_T_Am19 ===0){
        minEdificiosAmpliacoesConc19 = feature.properties.Edi_T_Am19
    }
    if(feature.properties.Edi_T_Am19> maxEdificiosAmpliacoesConc19){
        maxEdificiosAmpliacoesConc19 = feature.properties.Edi_T_Am19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am19,1.8)
    });
}
function apagarEdificiosAmpliacoesConc19(e){
    var layer = e.target;
    EdificiosAmpliacoesConc19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesConc19(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Am19 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesConc19,
    })
};

var EdificiosAmpliacoesConc19= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacoesConc19,
    onEachFeature: onEachFeatureEdificiosAmpliacoesConc19,
});

var slideEdificiosAmpliacoesConc19 = function(){
    var sliderEdificiosAmpliacoesConc19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesConc19, {
        start: [minEdificiosAmpliacoesConc19, maxEdificiosAmpliacoesConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesConc19,
            'max': maxEdificiosAmpliacoesConc19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesConc19);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc19.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesConc19.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesConc19.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am19>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderEdificiosAmpliacoesConc19.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesConc19);
}

///////////////////////////-------------  FIM TOTAL Edificios AMPLIAÇÕES Licenciados 2019, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edifícios licenciados 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Ob20 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edifícios licenciados 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

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
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Co20 + '</b>').openPopup()
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

///////////////////////////-------------  FIM TOTAL Edificios CONSTRUÇÃO NOVA Licenciados 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- TOTAL Edificios AMPLIAÇÕES Licenciados 2020, POR CONCELHO ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesConc20 = 99999;
var maxEdificiosAmpliacoesConc20 = 0;
function estiloEdificiosAmpliacoesConc20(feature, latlng) {
    if(feature.properties.Edi_T_Am20< minEdificiosAmpliacoesConc20 || feature.properties.Edi_T_Am20 ===0){
        minEdificiosAmpliacoesConc20 = feature.properties.Edi_T_Am20
    }
    if(feature.properties.Edi_T_Am20> maxEdificiosAmpliacoesConc20){
        maxEdificiosAmpliacoesConc20 = feature.properties.Edi_T_Am20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am20,1.8)
    });
}
function apagarEdificiosAmpliacoesConc20(e){
    var layer = e.target;
    EdificiosAmpliacoesConc20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesConc20(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Edifícios licenciados: ' + '<b>' +feature.properties.Edi_T_Am20 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesConc20,
    })
};

var EdificiosAmpliacoesConc20= L.geoJSON(dadosAbsolutosConcelhos,{
    pointToLayer:estiloEdificiosAmpliacoesConc20,
    onEachFeature: onEachFeatureEdificiosAmpliacoesConc20,
});

var slideEdificiosAmpliacoesConc20 = function(){
    var sliderEdificiosAmpliacoesConc20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesConc20, {
        start: [minEdificiosAmpliacoesConc20, maxEdificiosAmpliacoesConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesConc20,
            'max': maxEdificiosAmpliacoesConc20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesConc20);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesConc20.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesConc20.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesConc20.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am20>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderEdificiosAmpliacoesConc20.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesConc20);
}

///////////////////////////-------------  FIM TOTAL Edificios AMPLIAÇÕES Licenciados 2020, POR CONCELHO -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////////////////--------------------- FIM DADOS ABSOLUTOS CONCELHOS

/////////////////////////////////-------------------------- DADOS RELATIVOS CONCELHOS 

/////////////////////////------- Percentagem Construção Nova Concelho em 2014-----////

var minPerConsNovaConc14 = 100;
var maxPerConsNovaConc14 = 0;

function CorPerConsNovaConc(d) {
    return d == null ? '#808080' :
        d >= 91.94 ? '#8c0303' :
        d >= 79.85  ? '#de1f35' :
        d >= 59.7  ? '#ff5e6e' :
        d >= 39.55   ? '#f5b3be' :
        d >= 19.40   ? '#F2C572' :
                ''  ;
}
var legendaPerConsNovaConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 91.94' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 79.85 a 91.94' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 59.7 a 79.85' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 39.55 a 59.7' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 19.40 a 39.55' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerConsNovaConc14(feature) {
    if(feature.properties.PerCons_14 <= minPerConsNovaConc14 || minPerConsNovaConc14 === 0){
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
        fillColor: CorPerConsNovaConc(feature.properties.PerCons_14)
    };
}
function apagarPerConsNovaConc14(e) {
    PerConsNovaConc14.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc14(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerCons_14  + '</b>' + '%').openPopup()
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

/////////////////////////////// Fim da Construção Nova Concelho em 2014 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliações Concelho em 2014-----////

var minPerAmpliacoesConc14 = 100;
var maxPerAmpliacoesConc14 = 0;


function CorPerAmpliacaoConc(d) {
    return d == null ? '#808080' :
        d >= 72.54 ? '#8c0303' :
        d >= 60.45  ? '#de1f35' :
        d >= 40.3  ? '#ff5e6e' :
        d >= 20.15   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaPerAmpliacaoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 72.54' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 60.45 a 72.54' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 40.3 a 60.45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 20.15 a 40.3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 0 a 20.15' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPerAmpliacoesConc14(feature) {
    if(feature.properties.PerAmpl_14 <= minPerAmpliacoesConc14){
        minPerAmpliacoesConc14 = feature.properties.PerAmpl_14
    }
    if(feature.properties.PerAmpl_14 >= maxPerAmpliacoesConc14 ){
        maxPerAmpliacoesConc14 = feature.properties.PerAmpl_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoConc(feature.properties.PerAmpl_14)
    };
}
function apagarPerAmpliacoesConc14(e) {
    PerAmpliacoesConc14.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacoesConc14(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerAmpl_14  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacoesConc14,
    });
}
var PerAmpliacoesConc14= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacoesConc14,
    onEachFeature: onEachFeaturePerAmpliacoesConc14
});
let slidePerAmpliacoesConc14 = function(){
    var sliderPerAmpliacoesConc14 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacoesConc14, {
        start: [minPerAmpliacoesConc14, maxPerAmpliacoesConc14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacoesConc14,
            'max': maxPerAmpliacoesConc14
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacoesConc14);
    inputNumberMax.setAttribute("value",maxPerAmpliacoesConc14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacoesConc14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacoesConc14.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacoesConc14.noUiSlider.on('update',function(e){
        PerAmpliacoesConc14.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_14.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_14.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacoesConc14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderPerAmpliacoesConc14.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacoesConc14);
} 

/////////////////////////////// Fim da PERCENTAGEM AMPLIAÇÕES CONCELHO em 2014 -------------- \\\\\\

//////////////////////////------- Percentagem Construção Nova Concelho em 2015-----////

var minPerConsNovaConc15 = 100;
var maxPerConsNovaConc15 = 0;

function EstiloPerConsNovaConc15(feature) {
    if(feature.properties.PerCons_15 <= minPerConsNovaConc15 || minPerConsNovaConc15 === 0){
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
        fillColor: CorPerConsNovaConc(feature.properties.PerCons_15)
    };
}
function apagarPerConsNovaConc15(e) {
    PerConsNovaConc15.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc15(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerCons_15  + '</b>' + '%').openPopup()
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

/////////////////////////////// Fim da Construção Nova Concelho em 2015 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliações Concelho em 2015-----////

var minPerAmpliacoesConc15 = 100;
var maxPerAmpliacoesConc15 = 0;

function EstiloPerAmpliacoesConc15(feature) {
    if(feature.properties.PerAmpl_15 <= minPerAmpliacoesConc15 ){
        minPerAmpliacoesConc15 = feature.properties.PerAmpl_15
    }
    if(feature.properties.PerAmpl_15 >= maxPerAmpliacoesConc15 ){
        maxPerAmpliacoesConc15 = feature.properties.PerAmpl_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoConc(feature.properties.PerAmpl_15)
    };
}
function apagarPerAmpliacoesConc15(e) {
    PerAmpliacoesConc15.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacoesConc15(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerAmpl_15  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacoesConc15,
    });
}
var PerAmpliacoesConc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacoesConc15,
    onEachFeature: onEachFeaturePerAmpliacoesConc15
});
let slidePerAmpliacoesConc15 = function(){
    var sliderPerAmpliacoesConc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacoesConc15, {
        start: [minPerAmpliacoesConc15, maxPerAmpliacoesConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacoesConc15,
            'max': maxPerAmpliacoesConc15
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacoesConc15);
    inputNumberMax.setAttribute("value",maxPerAmpliacoesConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacoesConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacoesConc15.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacoesConc15.noUiSlider.on('update',function(e){
        PerAmpliacoesConc15.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacoesConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderPerAmpliacoesConc15.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacoesConc15);
} 

/////////////////////////////// Fim da PERCENTAGEM AMPLIAÇÕES CONCELHO em 2015 -------------- \\\\\\


//////////////////////////------- Percentagem Construção Nova Concelho em 2016-----////

var minPerConsNovaConc16 = 100;
var maxPerConsNovaConc16 = 0;

function EstiloPerConsNovaConc16(feature) {
    if(feature.properties.PerCons_16 <= minPerConsNovaConc16 || minPerConsNovaConc16 === 0){
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
        fillColor: CorPerConsNovaConc(feature.properties.PerCons_16)
    };
}
function apagarPerConsNovaConc16(e) {
    PerConsNovaConc16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc16(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerCons_16  + '</b>' + '%').openPopup()
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

/////////////////////////////// Fim da Construção Nova Concelho em 2016 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliações Concelho em 2016-----////

var minPerAmpliacoesConc16 = 100;
var maxPerAmpliacoesConc16 = 0;

function EstiloPerAmpliacoesConc16(feature) {
    if(feature.properties.PerAmpl_16 <= minPerAmpliacoesConc16 ){
        minPerAmpliacoesConc16 = feature.properties.PerAmpl_16
    }
    if(feature.properties.PerAmpl_16 >= maxPerAmpliacoesConc16 ){
        maxPerAmpliacoesConc16 = feature.properties.PerAmpl_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoConc(feature.properties.PerAmpl_16)
    };
}
function apagarPerAmpliacoesConc16(e) {
    PerAmpliacoesConc16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacoesConc16(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerAmpl_16  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacoesConc16,
    });
}
var PerAmpliacoesConc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacoesConc16,
    onEachFeature: onEachFeaturePerAmpliacoesConc16
});
let slidePerAmpliacoesConc16 = function(){
    var sliderPerAmpliacoesConc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacoesConc16, {
        start: [minPerAmpliacoesConc16, maxPerAmpliacoesConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacoesConc16,
            'max': maxPerAmpliacoesConc16
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacoesConc16);
    inputNumberMax.setAttribute("value",maxPerAmpliacoesConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacoesConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacoesConc16.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacoesConc16.noUiSlider.on('update',function(e){
        PerAmpliacoesConc16.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacoesConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderPerAmpliacoesConc16.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacoesConc16);
} 

/////////////////////////////// Fim da PERCENTAGEM AMPLIAÇÕES CONCELHO em 2016 -------------- \\\\\\

//////////////////////////------- Percentagem Construção Nova Concelho em 2017-----////

var minPerConsNovaConc17 = 100;
var maxPerConsNovaConc17 = 0;

function EstiloPerConsNovaConc17(feature) {
    if(feature.properties.PerCons_17 <= minPerConsNovaConc17 || minPerConsNovaConc17 === 0){
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
        fillColor: CorPerConsNovaConc(feature.properties.PerCons_17)
    };
}
function apagarPerConsNovaConc17(e) {
    PerConsNovaConc17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc17(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerCons_17  + '</b>' + '%').openPopup()
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

/////////////////////////////// Fim da Construção Nova Concelho em 2017 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliações Concelho em 2017-----////

var minPerAmpliacoesConc17 = 100;
var maxPerAmpliacoesConc17 = 0;

function EstiloPerAmpliacoesConc17(feature) {
    if(feature.properties.PerAmpl_17 <= minPerAmpliacoesConc17 ){
        minPerAmpliacoesConc17 = feature.properties.PerAmpl_17
    }
    if(feature.properties.PerAmpl_17 >= maxPerAmpliacoesConc17 ){
        maxPerAmpliacoesConc17 = feature.properties.PerAmpl_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoConc(feature.properties.PerAmpl_17)
    };
}
function apagarPerAmpliacoesConc17(e) {
    PerAmpliacoesConc17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacoesConc17(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerAmpl_17  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacoesConc17,
    });
}
var PerAmpliacoesConc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacoesConc17,
    onEachFeature: onEachFeaturePerAmpliacoesConc17
});
let slidePerAmpliacoesConc17 = function(){
    var sliderPerAmpliacoesConc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacoesConc17, {
        start: [minPerAmpliacoesConc17, maxPerAmpliacoesConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacoesConc17,
            'max': maxPerAmpliacoesConc17
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacoesConc17);
    inputNumberMax.setAttribute("value",maxPerAmpliacoesConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacoesConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacoesConc17.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacoesConc17.noUiSlider.on('update',function(e){
        PerAmpliacoesConc17.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacoesConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderPerAmpliacoesConc17.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacoesConc17);
} 

/////////////////////////////// Fim da PERCENTAGEM AMPLIAÇÕES CONCELHO em 2017 -------------- \\\\\\

//////////////////////////------- Percentagem Construção Nova Concelho em 2018-----////

var minPerConsNovaConc18 = 100;
var maxPerConsNovaConc18 = 0;

function EstiloPerConsNovaConc18(feature) {
    if(feature.properties.PerCons_18 <= minPerConsNovaConc18 || minPerConsNovaConc18 === 0){
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
        fillColor: CorPerConsNovaConc(feature.properties.PerCons_18)
    };
}
function apagarPerConsNovaConc18(e) {
    PerConsNovaConc18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc18(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerCons_18  + '</b>' + '%').openPopup()
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

/////////////////////////////// Fim da Construção Nova Concelho em 2018 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliações Concelho em 2018-----////

var minPerAmpliacoesConc18 = 100;
var maxPerAmpliacoesConc18 = 0;

function EstiloPerAmpliacoesConc18(feature) {
    if(feature.properties.PerAmpl_18 <= minPerAmpliacoesConc18 ){
        minPerAmpliacoesConc18 = feature.properties.PerAmpl_18
    }
    if(feature.properties.PerAmpl_18 >= maxPerAmpliacoesConc18 ){
        maxPerAmpliacoesConc18 = feature.properties.PerAmpl_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoConc(feature.properties.PerAmpl_18)
    };
}
function apagarPerAmpliacoesConc18(e) {
    PerAmpliacoesConc18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacoesConc18(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerAmpl_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacoesConc18,
    });
}
var PerAmpliacoesConc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacoesConc18,
    onEachFeature: onEachFeaturePerAmpliacoesConc18
});
let slidePerAmpliacoesConc18 = function(){
    var sliderPerAmpliacoesConc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacoesConc18, {
        start: [minPerAmpliacoesConc18, maxPerAmpliacoesConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacoesConc18,
            'max': maxPerAmpliacoesConc18
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacoesConc18);
    inputNumberMax.setAttribute("value",maxPerAmpliacoesConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacoesConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacoesConc18.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacoesConc18.noUiSlider.on('update',function(e){
        PerAmpliacoesConc18.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacoesConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderPerAmpliacoesConc18.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacoesConc18);
} 

/////////////////////////////// Fim da PERCENTAGEM AMPLIAÇÕES CONCELHO em 2018 -------------- \\\\\\

//////////////////////////------- Percentagem Construção Nova Concelho em 2019-----////

var minPerConsNovaConc19 = 100;
var maxPerConsNovaConc19 = 0;

function EstiloPerConsNovaConc19(feature) {
    if(feature.properties.PerCons_19 <= minPerConsNovaConc19 || minPerConsNovaConc19 === 0){
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
        fillColor: CorPerConsNovaConc(feature.properties.PerCons_19)
    };
}
function apagarPerConsNovaConc19(e) {
    PerConsNovaConc19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc19(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerCons_19  + '</b>' + '%').openPopup()
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

/////////////////////////////// Fim da Construção Nova Concelho em 2019 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliações Concelho em 2019-----////

var minPerAmpliacoesConc19 = 100;
var maxPerAmpliacoesConc19 = 0;

function EstiloPerAmpliacoesConc19(feature) {
    if(feature.properties.PerAmpl_19 <= minPerAmpliacoesConc19 ){
        minPerAmpliacoesConc19 = feature.properties.PerAmpl_19
    }
    if(feature.properties.PerAmpl_19 >= maxPerAmpliacoesConc19 ){
        maxPerAmpliacoesConc19 = feature.properties.PerAmpl_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoConc(feature.properties.PerAmpl_19)
    };
}
function apagarPerAmpliacoesConc19(e) {
    PerAmpliacoesConc19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacoesConc19(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerAmpl_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacoesConc19,
    });
}
var PerAmpliacoesConc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacoesConc19,
    onEachFeature: onEachFeaturePerAmpliacoesConc19
});
let slidePerAmpliacoesConc19 = function(){
    var sliderPerAmpliacoesConc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacoesConc19, {
        start: [minPerAmpliacoesConc19, maxPerAmpliacoesConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacoesConc19,
            'max': maxPerAmpliacoesConc19
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacoesConc19);
    inputNumberMax.setAttribute("value",maxPerAmpliacoesConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacoesConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacoesConc19.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacoesConc19.noUiSlider.on('update',function(e){
        PerAmpliacoesConc19.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacoesConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderPerAmpliacoesConc19.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacoesConc19);
} 

/////////////////////////////// Fim da PERCENTAGEM AMPLIAÇÕES CONCELHO em 2019 -------------- \\\\\\

//////////////////////////------- Percentagem Construção Nova Concelho em 2020-----////

var minPerConsNovaConc20 = 100;
var maxPerConsNovaConc20 = 0;

function EstiloPerConsNovaConc20(feature) {
    if(feature.properties.PerCons_20 <= minPerConsNovaConc20 || minPerConsNovaConc20 === 0){
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
        fillColor: CorPerConsNovaConc(feature.properties.PerCons_20)
    };
}
function apagarPerConsNovaConc20(e) {
    PerConsNovaConc20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerConsNovaConc20(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerCons_20  + '</b>' + '%').openPopup()
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

/////////////////////////////// Fim da Construção Nova Concelho em 2020 -------------- \\\\\\

///////////////////////////------- Percentagem Ampliações Concelho em 2020-----////

var minPerAmpliacoesConc20 = 100;
var maxPerAmpliacoesConc20 = 0;

function EstiloPerAmpliacoesConc20(feature) {
    if(feature.properties.PerAmpl_20 <= minPerAmpliacoesConc20 ){
        minPerAmpliacoesConc20 = feature.properties.PerAmpl_20
    }
    if(feature.properties.PerAmpl_20 >= maxPerAmpliacoesConc20 ){
        maxPerAmpliacoesConc20 = feature.properties.PerAmpl_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoConc(feature.properties.PerAmpl_20)
    };
}
function apagarPerAmpliacoesConc20(e) {
    PerAmpliacoesConc20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerAmpliacoesConc20(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Proporção de edifícios licenciados: ' + '<b>' + feature.properties.PerAmpl_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerAmpliacoesConc20,
    });
}
var PerAmpliacoesConc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPerAmpliacoesConc20,
    onEachFeature: onEachFeaturePerAmpliacoesConc20
});
let slidePerAmpliacoesConc20 = function(){
    var sliderPerAmpliacoesConc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerAmpliacoesConc20, {
        start: [minPerAmpliacoesConc20, maxPerAmpliacoesConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmpliacoesConc20,
            'max': maxPerAmpliacoesConc20
        },
        });
    inputNumberMin.setAttribute("value",minPerAmpliacoesConc20);
    inputNumberMax.setAttribute("value",maxPerAmpliacoesConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmpliacoesConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmpliacoesConc20.noUiSlider.set([null, this.value]);
    });

    sliderPerAmpliacoesConc20.noUiSlider.on('update',function(e){
        PerAmpliacoesConc20.eachLayer(function(layer){
            if(layer.feature.properties.PerAmpl_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerAmpliacoesConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderPerAmpliacoesConc20.noUiSlider;
    $(slidersGeral).append(sliderPerAmpliacoesConc20);
} 

/////////////////////////////// Fim da PERCENTAGEM AMPLIAÇÕES CONCELHO em 2020 -------------- \\\\\\

/////////////////////------------------------------- FIM DADOS RELATIVOS CONCELHOS

///////////////////////////////////////// VARIAÇÕES CONCELHOS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação Total, em 2015, POR CONCELHOS -------------------////

var minVarTotalEdiConc15 = 0;
var maxVarTotalEdiConc15 = 0;

function CorVarTotalEdiConc15_14(d) {
    return d == null ? '#808080' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -56   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalEdiConc15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -55.41 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalEdiConc15(feature) {
    if(feature.properties.VarObra_15 <= minVarTotalEdiConc15 || minVarTotalEdiConc15 === 0){
        minVarTotalEdiConc15 = feature.properties.VarObra_15
    }
    if(feature.properties.VarObra_15 > maxVarTotalEdiConc15){
        maxVarTotalEdiConc15 = feature.properties.VarObra_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiConc15_14(feature.properties.VarObra_15)};
    }


function apagarVarTotalEdiConc15(e) {
    VarTotalEdiConc15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiConc15(feature, layer) {
    if (feature.properties.VarObra_15 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiConc15,
    });
}
var VarTotalEdiConc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalEdiConc15,
    onEachFeature: onEachFeatureVarTotalEdiConc15
});

let slideVarTotalEdiConc15 = function(){
    var sliderVarTotalEdiConc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiConc15, {
        start: [minVarTotalEdiConc15, maxVarTotalEdiConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiConc15,
            'max': maxVarTotalEdiConc15
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiConc15);
    inputNumberMax.setAttribute("value",maxVarTotalEdiConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiConc15.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiConc15.noUiSlider.on('update',function(e){
        VarTotalEdiConc15.eachLayer(function(layer){
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
        sliderVarTotalEdiConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderVarTotalEdiConc15.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiConc15);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2015 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2015, POR CONCELHOS -------------------////

var minVarConsNovaConc15 = 0;
var maxVarConsNovaConc15 = 0;

function CorVarTotalConsNovaConc15_14(d) {
    return d == null ? '#808080' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -38   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalConsNovaConc15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -37.14 a -25' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarConsNovaConc15(feature) {
    if(feature.properties.VarCons_15 <= minVarConsNovaConc15 || minVarConsNovaConc15 === 0){
        minVarConsNovaConc15 = feature.properties.VarCons_15
    }
    if(feature.properties.VarCons_15 > maxVarConsNovaConc15){
        maxVarConsNovaConc15 = feature.properties.VarCons_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaConc15_14(feature.properties.VarCons_15)};
    }


function apagarVarConsNovaConc15(e) {
    VarConsNovaConc15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaConc15(feature, layer) {
    if (feature.properties.VarCons_15 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaConc15,
    });
}
var VarConsNovaConc15= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConsNovaConc15,
    onEachFeature: onEachFeatureVarConsNovaConc15
});

let slideVarConsNovaConc15 = function(){
    var sliderVarConsNovaConc15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaConc15, {
        start: [minVarConsNovaConc15, maxVarConsNovaConc15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaConc15,
            'max': maxVarConsNovaConc15
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaConc15);
    inputNumberMax.setAttribute("value",maxVarConsNovaConc15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaConc15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaConc15.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaConc15.noUiSlider.on('update',function(e){
        VarConsNovaConc15.eachLayer(function(layer){
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
        sliderVarConsNovaConc15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderVarConsNovaConc15.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaConc15);
} 

///////////////////////////// Fim Variação Construção Nova, em 2015 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2015, POR CONCELHOS -------------------////

var minVarAmpliacoesConc15 = 0;
var maxVarAmpliacoesConc15 = 0;

function CorVarTotalAmpliacoesConc15_14(d) {
    return d == null ? '#808080' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalAmpliacoesConc15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesConc15(feature) {
    if(feature.properties.VarAmpl_15 <= minVarAmpliacoesConc15 || minVarAmpliacoesConc15 === 0){
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
        fillColor: CorVarTotalAmpliacoesConc15_14(feature.properties.VarAmpl_15)};
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

var minVarTotalEdiConc16 = 0;
var maxVarTotalEdiConc16 = 0;

function CorVarTotalEdiConc16_15(d) {
    return d == null ? '#808080' :
        d >= 60  ? '#de1f35' :
        d >= 30  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -55   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalEdiConc16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  30 a 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -53.66 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalEdiConc16(feature) {
    if(feature.properties.VarObra_16 <= minVarTotalEdiConc16 || minVarTotalEdiConc16 === 0){
        minVarTotalEdiConc16 = feature.properties.VarObra_16
    }
    if(feature.properties.VarObra_16 > maxVarTotalEdiConc16){
        maxVarTotalEdiConc16 = feature.properties.VarObra_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiConc16_15(feature.properties.VarObra_16)};
    }


function apagarVarTotalEdiConc16(e) {
    VarTotalEdiConc16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiConc16(feature, layer) {
    if (feature.properties.VarObra_16 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiConc16,
    });
}
var VarTotalEdiConc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalEdiConc16,
    onEachFeature: onEachFeatureVarTotalEdiConc16
});

let slideVarTotalEdiConc16 = function(){
    var sliderVarTotalEdiConc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 69){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiConc16, {
        start: [minVarTotalEdiConc16, maxVarTotalEdiConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiConc16,
            'max': maxVarTotalEdiConc16
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiConc16);
    inputNumberMax.setAttribute("value",maxVarTotalEdiConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiConc16.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiConc16.noUiSlider.on('update',function(e){
        VarTotalEdiConc16.eachLayer(function(layer){
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
        sliderVarTotalEdiConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 69;
    sliderAtivo = sliderVarTotalEdiConc16.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiConc16);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2016 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2016, POR CONCELHOS -------------------////

var minVarConsNovaConc16 = 0;
var maxVarConsNovaConc16 = 0;

function CorVarTotalConsNovaConc16_15(d) {
    return d == null ? '#808080' :
        d >= 60  ? '#de1f35' :
        d >= 30  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -51   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalConsNovaConc16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  30 a 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarConsNovaConc16(feature) {
    if(feature.properties.VarCons_16 <= minVarConsNovaConc16 || minVarConsNovaConc16 === 0){
        minVarConsNovaConc16 = feature.properties.VarCons_16
    }
    if(feature.properties.VarCons_16 > maxVarConsNovaConc16){
        maxVarConsNovaConc16 = feature.properties.VarCons_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaConc16_15(feature.properties.VarCons_16)};
    }


function apagarVarConsNovaConc16(e) {
    VarConsNovaConc16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaConc16(feature, layer) {
    if (feature.properties.VarCons_16 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaConc16,
    });
}
var VarConsNovaConc16= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConsNovaConc16,
    onEachFeature: onEachFeatureVarConsNovaConc16
});

let slideVarConsNovaConc16 = function(){
    var sliderVarConsNovaConc16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 70){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaConc16, {
        start: [minVarConsNovaConc16, maxVarConsNovaConc16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaConc16,
            'max': maxVarConsNovaConc16
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaConc16);
    inputNumberMax.setAttribute("value",maxVarConsNovaConc16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaConc16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaConc16.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaConc16.noUiSlider.on('update',function(e){
        VarConsNovaConc16.eachLayer(function(layer){
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
        sliderVarConsNovaConc16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 70;
    sliderAtivo = sliderVarConsNovaConc16.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaConc16);
} 

///////////////////////////// Fim Variação Construção Nova, em 2016 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2016, POR CONCELHOS -------------------////

var minVarAmpliacoesConc16 = 0;
var maxVarAmpliacoesConc16 = 0;

function CorVarTotalAmpliacoesConc16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#155273' :
                ''  ;
}

var legendaVarTotalAmpliacoesConc16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesConc16(feature) {
    if(feature.properties.VarAmpl_16 <= minVarAmpliacoesConc16 || minVarAmpliacoesConc16 === 0){
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
        fillColor: CorVarTotalAmpliacoesConc16_15(feature.properties.VarAmpl_16)};
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

var minVarTotalEdiConc17 = 0;
var maxVarTotalEdiConc17 = 0;


function CorVarTotalEdiConc17_16(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -17   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotalEdiConc17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -16.18 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalEdiConc17(feature) {
    if(feature.properties.VarObra_17 <= minVarTotalEdiConc17 || minVarTotalEdiConc17 === 0){
        minVarTotalEdiConc17 = feature.properties.VarObra_17
    }
    if(feature.properties.VarObra_17 > maxVarTotalEdiConc17){
        maxVarTotalEdiConc17 = feature.properties.VarObra_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiConc17_16(feature.properties.VarObra_17)};
    }


function apagarVarTotalEdiConc17(e) {
    VarTotalEdiConc17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiConc17(feature, layer) {
    if (feature.properties.VarObra_17 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiConc17,
    });
}
var VarTotalEdiConc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalEdiConc17,
    onEachFeature: onEachFeatureVarTotalEdiConc17
});

let slideVarTotalEdiConc17 = function(){
    var sliderVarTotalEdiConc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 74){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiConc17, {
        start: [minVarTotalEdiConc17, maxVarTotalEdiConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiConc17,
            'max': maxVarTotalEdiConc17
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiConc17);
    inputNumberMax.setAttribute("value",maxVarTotalEdiConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiConc17.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiConc17.noUiSlider.on('update',function(e){
        VarTotalEdiConc17.eachLayer(function(layer){
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
        sliderVarTotalEdiConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 74;
    sliderAtivo = sliderVarTotalEdiConc17.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiConc17);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2017 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2017, POR CONCELHOS -------------------////

var minVarConsNovaConc17 = 0;
var maxVarConsNovaConc17 = 0;

function CorVarTotalConsNovaConc17_16(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotalConsNovaConc17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -23.4 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarConsNovaConc17(feature) {
    if(feature.properties.VarCons_17 <= minVarConsNovaConc17 || minVarConsNovaConc17 === 0){
        minVarConsNovaConc17 = feature.properties.VarCons_17
    }
    if(feature.properties.VarCons_17 > maxVarConsNovaConc17){
        maxVarConsNovaConc17 = feature.properties.VarCons_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaConc17_16(feature.properties.VarCons_17)};
    }


function apagarVarConsNovaConc17(e) {
    VarConsNovaConc17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaConc17(feature, layer) {
    if (feature.properties.VarCons_17 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaConc17,
    });
}
var VarConsNovaConc17= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConsNovaConc17,
    onEachFeature: onEachFeatureVarConsNovaConc17
});

let slideVarConsNovaConc17 = function(){
    var sliderVarConsNovaConc17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 75){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaConc17, {
        start: [minVarConsNovaConc17, maxVarConsNovaConc17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaConc17,
            'max': maxVarConsNovaConc17
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaConc17);
    inputNumberMax.setAttribute("value",maxVarConsNovaConc17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaConc17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaConc17.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaConc17.noUiSlider.on('update',function(e){
        VarConsNovaConc17.eachLayer(function(layer){
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
        sliderVarConsNovaConc17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 75;
    sliderAtivo = sliderVarConsNovaConc17.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaConc17);
} 

///////////////////////////// Fim Variação Construção Nova, em 2017 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2017, POR CONCELHOS -------------------////

var minVarAmpliacoesConc17 = 0;
var maxVarAmpliacoesConc17 = 0;

function CorVarTotalAmpliacoesConc17_16(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -51   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalAmpliacoesConc17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarAmpliacoesConc17(feature) {
    if(feature.properties.VarAmpl_17 <= minVarAmpliacoesConc17 || minVarAmpliacoesConc17 === 0){
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
        fillColor: CorVarTotalAmpliacoesConc17_16(feature.properties.VarAmpl_17)};
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

var minVarTotalEdiConc18 = 0;
var maxVarTotalEdiConc18 = 0;

function CorVarTotalEdiConc18_17(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -22   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotalEdiConc18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -21.69 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalEdiConc18(feature) {
    if(feature.properties.VarObra_18 <= minVarTotalEdiConc18 || minVarTotalEdiConc18 === 0){
        minVarTotalEdiConc18 = feature.properties.VarObra_18
    }
    if(feature.properties.VarObra_18 > maxVarTotalEdiConc18){
        maxVarTotalEdiConc18 = feature.properties.VarObra_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiConc18_17(feature.properties.VarObra_18)};
    }


function apagarVarTotalEdiConc18(e) {
    VarTotalEdiConc18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiConc18(feature, layer) {
    if (feature.properties.VarObra_18 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiConc18,
    });
}
var VarTotalEdiConc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalEdiConc18,
    onEachFeature: onEachFeatureVarTotalEdiConc18
});

let slideVarTotalEdiConc18 = function(){
    var sliderVarTotalEdiConc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 79){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiConc18, {
        start: [minVarTotalEdiConc18, maxVarTotalEdiConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiConc18,
            'max': maxVarTotalEdiConc18
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiConc18);
    inputNumberMax.setAttribute("value",maxVarTotalEdiConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiConc18.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiConc18.noUiSlider.on('update',function(e){
        VarTotalEdiConc18.eachLayer(function(layer){
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
        sliderVarTotalEdiConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 79;
    sliderAtivo = sliderVarTotalEdiConc18.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiConc18);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2018 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2018, POR CONCELHOS -------------------////

var minVarConsNovaConc18 = 0;
var maxVarConsNovaConc18 = 0;

function CorVarTotalConsNovaConc18_17(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotalConsNovaConc18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -9.09 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarConsNovaConc18(feature) {
    if(feature.properties.VarCons_18 <= minVarConsNovaConc18 || minVarConsNovaConc18 === 0){
        minVarConsNovaConc18 = feature.properties.VarCons_18
    }
    if(feature.properties.VarCons_18 > maxVarConsNovaConc18){
        maxVarConsNovaConc18 = feature.properties.VarCons_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaConc18_17(feature.properties.VarCons_18)};
    }


function apagarVarConsNovaConc18(e) {
    VarConsNovaConc18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaConc18(feature, layer) {
    if (feature.properties.VarCons_18 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaConc18,
    });
}
var VarConsNovaConc18= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConsNovaConc18,
    onEachFeature: onEachFeatureVarConsNovaConc18
});

let slideVarConsNovaConc18 = function(){
    var sliderVarConsNovaConc18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 80){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaConc18, {
        start: [minVarConsNovaConc18, maxVarConsNovaConc18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaConc18,
            'max': maxVarConsNovaConc18
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaConc18);
    inputNumberMax.setAttribute("value",maxVarConsNovaConc18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaConc18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaConc18.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaConc18.noUiSlider.on('update',function(e){
        VarConsNovaConc18.eachLayer(function(layer){
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
        sliderVarConsNovaConc18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 80;
    sliderAtivo = sliderVarConsNovaConc18.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaConc18);
} 

///////////////////////////// Fim Variação Construção Nova, em 2018 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2018, POR CONCELHOS -------------------////

var minVarAmpliacoesConc18 = 0;
var maxVarAmpliacoesConc18 = 0;

function CorVarTotalAmpliacoesConc18_17(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 25  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalAmpliacoesConc18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  25 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarAmpliacoesConc18(feature) {
    if(feature.properties.VarAmpl_18 <= minVarAmpliacoesConc18 || minVarAmpliacoesConc18 === 0){
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
        fillColor: CorVarTotalAmpliacoesConc18_17(feature.properties.VarAmpl_18)};
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

var minVarTotalEdiConc19 = 0;
var maxVarTotalEdiConc19 = 0;

function CorVarTotalEdiConc19_18(d) {
    return d == null ? '#808080' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotalEdiConc19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -1.97 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalEdiConc19(feature) {
    if(feature.properties.VarObra_19 <= minVarTotalEdiConc19 || minVarTotalEdiConc19 === 0){
        minVarTotalEdiConc19 = feature.properties.VarObra_19
    }
    if(feature.properties.VarObra_19 > maxVarTotalEdiConc19){
        maxVarTotalEdiConc19 = feature.properties.VarObra_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiConc19_18(feature.properties.VarObra_19)};
    }


function apagarVarTotalEdiConc19(e) {
    VarTotalEdiConc19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiConc19(feature, layer) {
    if (feature.properties.VarObra_19 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiConc19,
    });
}
var VarTotalEdiConc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalEdiConc19,
    onEachFeature: onEachFeatureVarTotalEdiConc19
});

let slideVarTotalEdiConc19 = function(){
    var sliderVarTotalEdiConc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 84){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiConc19, {
        start: [minVarTotalEdiConc19, maxVarTotalEdiConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiConc19,
            'max': maxVarTotalEdiConc19
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiConc19);
    inputNumberMax.setAttribute("value",maxVarTotalEdiConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiConc19.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiConc19.noUiSlider.on('update',function(e){
        VarTotalEdiConc19.eachLayer(function(layer){
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
        sliderVarTotalEdiConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 84;
    sliderAtivo = sliderVarTotalEdiConc19.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiConc19);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2019 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2019, POR CONCELHOS -------------------////

var minVarConsNovaConc19 = 0;
var maxVarConsNovaConc19 = 0;

function CorVarTotalConsNovaConc19_18(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -8   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotalConsNovaConc19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -7.69 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarConsNovaConc19(feature) {
    if(feature.properties.VarCons_19 <= minVarConsNovaConc19 || minVarConsNovaConc19 === 0){
        minVarConsNovaConc19 = feature.properties.VarCons_19
    }
    if(feature.properties.VarCons_19 > maxVarConsNovaConc19){
        maxVarConsNovaConc19 = feature.properties.VarCons_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaConc19_18(feature.properties.VarCons_19)};
    }


function apagarVarConsNovaConc19(e) {
    VarConsNovaConc19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaConc19(feature, layer) {
    if (feature.properties.VarCons_19 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaConc19,
    });
}
var VarConsNovaConc19= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConsNovaConc19,
    onEachFeature: onEachFeatureVarConsNovaConc19
});

let slideVarConsNovaConc19 = function(){
    var sliderVarConsNovaConc19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 85){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaConc19, {
        start: [minVarConsNovaConc19, maxVarConsNovaConc19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaConc19,
            'max': maxVarConsNovaConc19
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaConc19);
    inputNumberMax.setAttribute("value",maxVarConsNovaConc19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaConc19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaConc19.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaConc19.noUiSlider.on('update',function(e){
        VarConsNovaConc19.eachLayer(function(layer){
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
        sliderVarConsNovaConc19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 85;
    sliderAtivo = sliderVarConsNovaConc19.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaConc19);
} 

///////////////////////////// Fim Variação Construção Nova, em 2019 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2019, POR CONCELHOS -------------------////

var minVarAmpliacoesConc19 = 0;
var maxVarAmpliacoesConc19 = 0;

function CorVarTotalAmpliacoesConc19_18(d) {
    return d == null ? '#808080' :
        d >= 75  ? '#8c0303' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -50   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalAmpliacoesConc19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -41.18 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesConc19(feature) {
    if(feature.properties.VarAmpl_19 <= minVarAmpliacoesConc19 || minVarAmpliacoesConc19 === 0){
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
        fillColor: CorVarTotalAmpliacoesConc19_18(feature.properties.VarAmpl_19)};
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

var minVarTotalEdiConc20 = 0;
var maxVarTotalEdiConc20 = 0;

function CorVarTotalEdiConc20_19(d) {
    return d == null ? '#808080' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -37   ? '#2288bf' :
                ''  ;
}

var legendaVarTotalEdiConc20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -36.58 a -25' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalEdiConc20(feature) {
    if(feature.properties.VarObra_20 <= minVarTotalEdiConc20 || minVarTotalEdiConc20 === 0){
        minVarTotalEdiConc20 = feature.properties.VarObra_20
    }
    if(feature.properties.VarObra_20 > maxVarTotalEdiConc20){
        maxVarTotalEdiConc20 = feature.properties.VarObra_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiConc20_19(feature.properties.VarObra_20)};
    }


function apagarVarTotalEdiConc20(e) {
    VarTotalEdiConc20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiConc20(feature, layer) {
    if (feature.properties.VarObra_20 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiConc20,
    });
}
var VarTotalEdiConc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarTotalEdiConc20,
    onEachFeature: onEachFeatureVarTotalEdiConc20
});

let slideVarTotalEdiConc20 = function(){
    var sliderVarTotalEdiConc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 89){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiConc20, {
        start: [minVarTotalEdiConc20, maxVarTotalEdiConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiConc20,
            'max': maxVarTotalEdiConc20
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiConc20);
    inputNumberMax.setAttribute("value",maxVarTotalEdiConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiConc20.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiConc20.noUiSlider.on('update',function(e){
        VarTotalEdiConc20.eachLayer(function(layer){
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
        sliderVarTotalEdiConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 89;
    sliderAtivo = sliderVarTotalEdiConc20.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiConc20);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2020 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2020, POR CONCELHOS -------------------////

var minVarConsNovaConc20 = 0;
var maxVarConsNovaConc20 = 0;

function CorVarTotalConsNovaConc20_19(d) {
    return d == null ? '#808080' :
        d >= 25  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15   ? '#9eaad7' :
                ''  ;
}

var legendaVarTotalConsNovaConc20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -14.04 a 0' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarConsNovaConc20(feature) {
    if(feature.properties.VarCons_20 <= minVarConsNovaConc20 || minVarConsNovaConc20 === 0){
        minVarConsNovaConc20 = feature.properties.VarCons_20
    }
    if(feature.properties.VarCons_20 > maxVarConsNovaConc20){
        maxVarConsNovaConc20 = feature.properties.VarCons_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaConc20_19(feature.properties.VarCons_20)};
    }


function apagarVarConsNovaConc20(e) {
    VarConsNovaConc20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaConc20(feature, layer) {
    if (feature.properties.VarCons_20 == null){
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaConc20,
    });
}
var VarConsNovaConc20= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarConsNovaConc20,
    onEachFeature: onEachFeatureVarConsNovaConc20
});

let slideVarConsNovaConc20 = function(){
    var sliderVarConsNovaConc20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 90){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaConc20, {
        start: [minVarConsNovaConc20, maxVarConsNovaConc20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaConc20,
            'max': maxVarConsNovaConc20
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaConc20);
    inputNumberMax.setAttribute("value",maxVarConsNovaConc20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaConc20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaConc20.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaConc20.noUiSlider.on('update',function(e){
        VarConsNovaConc20.eachLayer(function(layer){
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
        sliderVarConsNovaConc20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 90;
    sliderAtivo = sliderVarConsNovaConc20.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaConc20);
} 

///////////////////////////// Fim Variação Construção Nova, em 2020 , POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2020, POR CONCELHOS -------------------////

var minVarAmpliacoesConc20 = 0;
var maxVarAmpliacoesConc20 = 0;

function CorVarTotalAmpliacoesConc20_19(d) {
    return d == null ? '#808080' :
        d >= 50  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9ebbd7' :
        d >= -50  ? '#2288bf' :
        d >= -80   ? '#155273' :
                ''  ;
}

var legendaVarTotalAmpliacoesConc20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -76.19 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesConc20(feature) {
    if(feature.properties.VarAmpl_20 <= minVarAmpliacoesConc20 || minVarAmpliacoesConc20 === 0){
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
        fillColor: CorVarTotalAmpliacoesConc20_19(feature.properties.VarAmpl_20)};
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

///////////////////////////--------------------------- FREGUESIASS --------------\\\\\\\\\\\\\\\\\\\

////////////////////////////----------- TOTAL Edificios LICENCIAADOS 2014,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosFreg14 = 99999;
var maxTotalEdificiosFreg14 = 0;
function estiloTotalEdificiosFreg14(feature, latlng) {
    if(feature.properties.Edi_T_Ob14< minTotalEdificiosFreg14 || feature.properties.Edi_T_Ob14 ===0){
        minTotalEdificiosFreg14 = feature.properties.Edi_T_Ob14
    }
    if(feature.properties.Edi_T_Ob14> maxTotalEdificiosFreg14){
        maxTotalEdificiosFreg14 = feature.properties.Edi_T_Ob14
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob14,2)
    });
}
function apagarTotalEdificiosFreg14(e){
    var layer = e.target;
    TotalEdificiosFreg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg14(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Ob14+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg14,
    })
};

var TotalEdificiosFreg14= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalEdificiosFreg14,
    onEachFeature: onEachFeatureTotalEdificiosFreg14,
});

var slideTotalEdificiosFreg14 = function(){
    var sliderTotalEdificiosFreg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 94){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg14, {
        start: [minTotalEdificiosFreg14, maxTotalEdificiosFreg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg14,
            'max': maxTotalEdificiosFreg14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg14);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg14);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg14.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg14.noUiSlider.on('update',function(e){
        TotalEdificiosFreg14.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob14>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 94;
    sliderAtivo = sliderTotalEdificiosFreg14.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg14);
}
///////////////////////////---------- FIM TOTAL Edifícios licenciados EM 2014,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Construção Nova 2014,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaFreg14 = 99999;
var maxEdificiosConsNovaFreg14 = 0;
function estiloEdificiosConsNovaFreg14(feature, latlng) {
    if(feature.properties.Edi_T_Co14< minEdificiosConsNovaFreg14 || feature.properties.Edi_T_Co14 ===0){
        minEdificiosConsNovaFreg14 = feature.properties.Edi_T_Co14
    }
    if(feature.properties.Edi_T_Co14> maxEdificiosConsNovaFreg14){
        maxEdificiosConsNovaFreg14 = feature.properties.Edi_T_Co14
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co14,2)
    });
}
function apagarEdificiosConsNovaFreg14(e){
    var layer = e.target;
    EdificiosConsNovaFreg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaFreg14(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Co14+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaFreg14,
    })
};

var EdificiosConsNovaFreg14= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosConsNovaFreg14,
    onEachFeature: onEachFeatureEdificiosConsNovaFreg14,
});

var slideEdificiosConsNovaFreg14 = function(){
    var sliderEdificiosConsNovaFreg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 95){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaFreg14, {
        start: [minEdificiosConsNovaFreg14, maxEdificiosConsNovaFreg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaFreg14,
            'max': maxEdificiosConsNovaFreg14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaFreg14);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaFreg14);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg14.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaFreg14.noUiSlider.on('update',function(e){
        EdificiosConsNovaFreg14.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co14>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaFreg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 95;
    sliderAtivo = sliderEdificiosConsNovaFreg14.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaFreg14);
}
///////////////////////////---------- FIM Edifícios licenciados EM 2014,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Ampliacoes 2014,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesFreg14 = 99999;
var maxEdificiosAmpliacoesFreg14 = 0;
function estiloEdificiosAmpliacoesFreg14(feature, latlng) {
    if(feature.properties.Edi_T_Am14< minEdificiosAmpliacoesFreg14 || feature.properties.Edi_T_Am14 ===0){
        minEdificiosAmpliacoesFreg14 = feature.properties.Edi_T_Am14
    }
    if(feature.properties.Edi_T_Am14> maxEdificiosAmpliacoesFreg14){
        maxEdificiosAmpliacoesFreg14 = feature.properties.Edi_T_Am14
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am14,2)
    });
}
function apagarEdificiosAmpliacoesFreg14(e){
    var layer = e.target;
    EdificiosAmpliacoesFreg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesFreg14(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Am14+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesFreg14,
    })
};

var EdificiosAmpliacoesFreg14= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosAmpliacoesFreg14,
    onEachFeature: onEachFeatureEdificiosAmpliacoesFreg14,
});

var slideEdificiosAmpliacoesFreg14 = function(){
    var sliderEdificiosAmpliacoesFreg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 96){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesFreg14, {
        start: [minEdificiosAmpliacoesFreg14, maxEdificiosAmpliacoesFreg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesFreg14,
            'max': maxEdificiosAmpliacoesFreg14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesFreg14);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesFreg14);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg14.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesFreg14.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesFreg14.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am14>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesFreg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 96;
    sliderAtivo = sliderEdificiosAmpliacoesFreg14.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesFreg14);
}
///////////////////////////---------- FIM Edificios AMPLIAÇÕES Licenciados EM 2014,Por Freguesia -----------\\\\\\\\\


////////////////////////////----------- TOTAL Edificios LICENCIAADOS 2015,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosFreg15 = 99999;
var maxTotalEdificiosFreg15 = 0;
function estiloTotalEdificiosFreg15(feature, latlng) {
    if(feature.properties.Edi_T_Ob15< minTotalEdificiosFreg15 || feature.properties.Edi_T_Ob15 ===0){
        minTotalEdificiosFreg15 = feature.properties.Edi_T_Ob15
    }
    if(feature.properties.Edi_T_Ob15> maxTotalEdificiosFreg15){
        maxTotalEdificiosFreg15 = feature.properties.Edi_T_Ob15
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob15,2)
    });
}
function apagarTotalEdificiosFreg15(e){
    var layer = e.target;
    TotalEdificiosFreg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg15(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Ob15+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg15,
    })
};

var TotalEdificiosFreg15= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalEdificiosFreg15,
    onEachFeature: onEachFeatureTotalEdificiosFreg15,
});

var slideTotalEdificiosFreg15 = function(){
    var sliderTotalEdificiosFreg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 99){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg15, {
        start: [minTotalEdificiosFreg15, maxTotalEdificiosFreg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg15,
            'max': maxTotalEdificiosFreg15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg15);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg15);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg15.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg15.noUiSlider.on('update',function(e){
        TotalEdificiosFreg15.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob15>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 99;
    sliderAtivo = sliderTotalEdificiosFreg15.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg15);
}
///////////////////////////---------- FIM TOTAL Edifícios licenciados EM 2015,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Construção Nova 2015,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaFreg15 = 99999;
var maxEdificiosConsNovaFreg15 = 0;
function estiloEdificiosConsNovaFreg15(feature, latlng) {
    if(feature.properties.Edi_T_Co15< minEdificiosConsNovaFreg15 || feature.properties.Edi_T_Co15 ===0){
        minEdificiosConsNovaFreg15 = feature.properties.Edi_T_Co15
    }
    if(feature.properties.Edi_T_Co15> maxEdificiosConsNovaFreg15){
        maxEdificiosConsNovaFreg15 = feature.properties.Edi_T_Co15
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co15,2)
    });
}
function apagarEdificiosConsNovaFreg15(e){
    var layer = e.target;
    EdificiosConsNovaFreg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaFreg15(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Co15+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaFreg15,
    })
};

var EdificiosConsNovaFreg15= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosConsNovaFreg15,
    onEachFeature: onEachFeatureEdificiosConsNovaFreg15,
});

var slideEdificiosConsNovaFreg15 = function(){
    var sliderEdificiosConsNovaFreg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 100){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaFreg15, {
        start: [minEdificiosConsNovaFreg15, maxEdificiosConsNovaFreg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaFreg15,
            'max': maxEdificiosConsNovaFreg15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaFreg15);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaFreg15);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg15.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaFreg15.noUiSlider.on('update',function(e){
        EdificiosConsNovaFreg15.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co15>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaFreg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 100;
    sliderAtivo = sliderEdificiosConsNovaFreg15.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaFreg15);
}
///////////////////////////---------- FIM Edifícios licenciados EM 2015,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Ampliacoes 2015,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesFreg15 = 99999;
var maxEdificiosAmpliacoesFreg15 = 0;
function estiloEdificiosAmpliacoesFreg15(feature, latlng) {
    if(feature.properties.Edi_T_Am15< minEdificiosAmpliacoesFreg15 || feature.properties.Edi_T_Am15 ===0){
        minEdificiosAmpliacoesFreg15 = feature.properties.Edi_T_Am15
    }
    if(feature.properties.Edi_T_Am15> maxEdificiosAmpliacoesFreg15){
        maxEdificiosAmpliacoesFreg15 = feature.properties.Edi_T_Am15
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am15,2)
    });
}
function apagarEdificiosAmpliacoesFreg15(e){
    var layer = e.target;
    EdificiosAmpliacoesFreg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesFreg15(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Am15+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesFreg15,
    })
};

var EdificiosAmpliacoesFreg15= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosAmpliacoesFreg15,
    onEachFeature: onEachFeatureEdificiosAmpliacoesFreg15,
});

var slideEdificiosAmpliacoesFreg15 = function(){
    var sliderEdificiosAmpliacoesFreg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 101){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesFreg15, {
        start: [minEdificiosAmpliacoesFreg15, maxEdificiosAmpliacoesFreg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesFreg15,
            'max': maxEdificiosAmpliacoesFreg15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesFreg15);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesFreg15);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg15.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesFreg15.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesFreg15.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am15>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesFreg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 101;
    sliderAtivo = sliderEdificiosAmpliacoesFreg15.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesFreg15);
}
///////////////////////////---------- FIM Edificios AMPLIAÇÕES Licenciados EM 2015,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- TOTAL Edificios LICENCIAADOS 2016,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosFreg16 = 99999;
var maxTotalEdificiosFreg16 = 0;
function estiloTotalEdificiosFreg16(feature, latlng) {
    if(feature.properties.Edi_T_Ob16< minTotalEdificiosFreg16 || feature.properties.Edi_T_Ob16 ===0){
        minTotalEdificiosFreg16 = feature.properties.Edi_T_Ob16
    }
    if(feature.properties.Edi_T_Ob16> maxTotalEdificiosFreg16){
        maxTotalEdificiosFreg16 = feature.properties.Edi_T_Ob16
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob16,2)
    });
}
function apagarTotalEdificiosFreg16(e){
    var layer = e.target;
    TotalEdificiosFreg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg16(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Ob16+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg16,
    })
};

var TotalEdificiosFreg16= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalEdificiosFreg16,
    onEachFeature: onEachFeatureTotalEdificiosFreg16,
});

var slideTotalEdificiosFreg16 = function(){
    var sliderTotalEdificiosFreg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 104){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg16, {
        start: [minTotalEdificiosFreg16, maxTotalEdificiosFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg16,
            'max': maxTotalEdificiosFreg16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg16);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg16.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg16.noUiSlider.on('update',function(e){
        TotalEdificiosFreg16.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob16>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 104;
    sliderAtivo = sliderTotalEdificiosFreg16.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg16);
}
///////////////////////////---------- FIM TOTAL Edifícios licenciados EM 2016,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Construção Nova 2016,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaFreg16 = 99999;
var maxEdificiosConsNovaFreg16 = 0;
function estiloEdificiosConsNovaFreg16(feature, latlng) {
    if(feature.properties.Edi_T_Co16< minEdificiosConsNovaFreg16 || feature.properties.Edi_T_Co16 ===0){
        minEdificiosConsNovaFreg16 = feature.properties.Edi_T_Co16
    }
    if(feature.properties.Edi_T_Co16> maxEdificiosConsNovaFreg16){
        maxEdificiosConsNovaFreg16 = feature.properties.Edi_T_Co16
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co16,2)
    });
}
function apagarEdificiosConsNovaFreg16(e){
    var layer = e.target;
    EdificiosConsNovaFreg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaFreg16(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Co16+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaFreg16,
    })
};

var EdificiosConsNovaFreg16= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosConsNovaFreg16,
    onEachFeature: onEachFeatureEdificiosConsNovaFreg16,
});

var slideEdificiosConsNovaFreg16 = function(){
    var sliderEdificiosConsNovaFreg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 105){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaFreg16, {
        start: [minEdificiosConsNovaFreg16, maxEdificiosConsNovaFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaFreg16,
            'max': maxEdificiosConsNovaFreg16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaFreg16);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg16.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaFreg16.noUiSlider.on('update',function(e){
        EdificiosConsNovaFreg16.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co16>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 105;
    sliderAtivo = sliderEdificiosConsNovaFreg16.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaFreg16);
}
///////////////////////////---------- FIM Edifícios licenciados EM 2016,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Ampliacoes 2016,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesFreg16 = 99999;
var maxEdificiosAmpliacoesFreg16 = 0;
function estiloEdificiosAmpliacoesFreg16(feature, latlng) {
    if(feature.properties.Edi_T_Am16< minEdificiosAmpliacoesFreg16 || feature.properties.Edi_T_Am16 ===0){
        minEdificiosAmpliacoesFreg16 = feature.properties.Edi_T_Am16
    }
    if(feature.properties.Edi_T_Am16> maxEdificiosAmpliacoesFreg16){
        maxEdificiosAmpliacoesFreg16 = feature.properties.Edi_T_Am16
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am16,2)
    });
}
function apagarEdificiosAmpliacoesFreg16(e){
    var layer = e.target;
    EdificiosAmpliacoesFreg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesFreg16(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Am16+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesFreg16,
    })
};

var EdificiosAmpliacoesFreg16= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosAmpliacoesFreg16,
    onEachFeature: onEachFeatureEdificiosAmpliacoesFreg16,
});

var slideEdificiosAmpliacoesFreg16 = function(){
    var sliderEdificiosAmpliacoesFreg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 106){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesFreg16, {
        start: [minEdificiosAmpliacoesFreg16, maxEdificiosAmpliacoesFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesFreg16,
            'max': maxEdificiosAmpliacoesFreg16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesFreg16);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg16.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesFreg16.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesFreg16.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am16>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 106;
    sliderAtivo = sliderEdificiosAmpliacoesFreg16.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesFreg16);
}
///////////////////////////---------- FIM Edificios AMPLIAÇÕES Licenciados EM 2016,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- TOTAL Edificios LICENCIAADOS 2017,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosFreg17 = 99999;
var maxTotalEdificiosFreg17 = 0;
function estiloTotalEdificiosFreg17(feature, latlng) {
    if(feature.properties.Edi_T_Ob17< minTotalEdificiosFreg17 || feature.properties.Edi_T_Ob17 ===0){
        minTotalEdificiosFreg17 = feature.properties.Edi_T_Ob17
    }
    if(feature.properties.Edi_T_Ob17> maxTotalEdificiosFreg17){
        maxTotalEdificiosFreg17 = feature.properties.Edi_T_Ob17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob17,2)
    });
}
function apagarTotalEdificiosFreg17(e){
    var layer = e.target;
    TotalEdificiosFreg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg17(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Ob17+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg17,
    })
};

var TotalEdificiosFreg17= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalEdificiosFreg17,
    onEachFeature: onEachFeatureTotalEdificiosFreg17,
});

var slideTotalEdificiosFreg17 = function(){
    var sliderTotalEdificiosFreg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 109){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg17, {
        start: [minTotalEdificiosFreg17, maxTotalEdificiosFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg17,
            'max': maxTotalEdificiosFreg17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg17);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg17.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg17.noUiSlider.on('update',function(e){
        TotalEdificiosFreg17.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob17>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 109;
    sliderAtivo = sliderTotalEdificiosFreg17.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg17);
}
///////////////////////////---------- FIM TOTAL Edifícios licenciados EM 2017,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Construção Nova 2017,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaFreg17 = 99999;
var maxEdificiosConsNovaFreg17 = 0;
function estiloEdificiosConsNovaFreg17(feature, latlng) {
    if(feature.properties.Edi_T_Co17< minEdificiosConsNovaFreg17 || feature.properties.Edi_T_Co17 ===0){
        minEdificiosConsNovaFreg17 = feature.properties.Edi_T_Co17
    }
    if(feature.properties.Edi_T_Co17> maxEdificiosConsNovaFreg17){
        maxEdificiosConsNovaFreg17 = feature.properties.Edi_T_Co17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co17,2)
    });
}
function apagarEdificiosConsNovaFreg17(e){
    var layer = e.target;
    EdificiosConsNovaFreg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaFreg17(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Co17+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaFreg17,
    })
};

var EdificiosConsNovaFreg17= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosConsNovaFreg17,
    onEachFeature: onEachFeatureEdificiosConsNovaFreg17,
});

var slideEdificiosConsNovaFreg17 = function(){
    var sliderEdificiosConsNovaFreg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 110){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaFreg17, {
        start: [minEdificiosConsNovaFreg17, maxEdificiosConsNovaFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaFreg17,
            'max': maxEdificiosConsNovaFreg17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaFreg17);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg17.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaFreg17.noUiSlider.on('update',function(e){
        EdificiosConsNovaFreg17.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co17>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 110;
    sliderAtivo = sliderEdificiosConsNovaFreg17.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaFreg17);
}
///////////////////////////---------- FIM Edifícios licenciados EM 2017,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Ampliacoes 2017,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesFreg17 = 99999;
var maxEdificiosAmpliacoesFreg17 = 0;
function estiloEdificiosAmpliacoesFreg17(feature, latlng) {
    if(feature.properties.Edi_T_Am17< minEdificiosAmpliacoesFreg17 || feature.properties.Edi_T_Am17 ===0){
        minEdificiosAmpliacoesFreg17 = feature.properties.Edi_T_Am17
    }
    if(feature.properties.Edi_T_Am17> maxEdificiosAmpliacoesFreg17){
        maxEdificiosAmpliacoesFreg17 = feature.properties.Edi_T_Am17
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am17,2)
    });
}
function apagarEdificiosAmpliacoesFreg17(e){
    var layer = e.target;
    EdificiosAmpliacoesFreg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesFreg17(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Am17+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesFreg17,
    })
};

var EdificiosAmpliacoesFreg17= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosAmpliacoesFreg17,
    onEachFeature: onEachFeatureEdificiosAmpliacoesFreg17,
});

var slideEdificiosAmpliacoesFreg17 = function(){
    var sliderEdificiosAmpliacoesFreg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 111){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesFreg17, {
        start: [minEdificiosAmpliacoesFreg17, maxEdificiosAmpliacoesFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesFreg17,
            'max': maxEdificiosAmpliacoesFreg17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesFreg17);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg17.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesFreg17.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesFreg17.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am17>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 111;
    sliderAtivo = sliderEdificiosAmpliacoesFreg17.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesFreg17);
}
///////////////////////////---------- FIM Edificios AMPLIAÇÕES Licenciados EM 2017,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- TOTAL Edificios LICENCIAADOS 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosFreg18 = 99999;
var maxTotalEdificiosFreg18 = 0;
function estiloTotalEdificiosFreg18(feature, latlng) {
    if(feature.properties.Edi_T_Ob18< minTotalEdificiosFreg18 || feature.properties.Edi_T_Ob18 ===0){
        minTotalEdificiosFreg18 = feature.properties.Edi_T_Ob18
    }
    if(feature.properties.Edi_T_Ob18> maxTotalEdificiosFreg18){
        maxTotalEdificiosFreg18 = feature.properties.Edi_T_Ob18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob18,2)
    });
}
function apagarTotalEdificiosFreg18(e){
    var layer = e.target;
    TotalEdificiosFreg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg18(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Ob18+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg18,
    })
};

var TotalEdificiosFreg18= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalEdificiosFreg18,
    onEachFeature: onEachFeatureTotalEdificiosFreg18,
});

var slideTotalEdificiosFreg18 = function(){
    var sliderTotalEdificiosFreg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 114){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg18, {
        start: [minTotalEdificiosFreg18, maxTotalEdificiosFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg18,
            'max': maxTotalEdificiosFreg18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg18);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg18.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg18.noUiSlider.on('update',function(e){
        TotalEdificiosFreg18.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob18>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 114;
    sliderAtivo = sliderTotalEdificiosFreg18.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg18);
}
///////////////////////////---------- FIM TOTAL Edifícios licenciados EM 2018,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Construção Nova 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaFreg18 = 99999;
var maxEdificiosConsNovaFreg18 = 0;
function estiloEdificiosConsNovaFreg18(feature, latlng) {
    if(feature.properties.Edi_T_Co18< minEdificiosConsNovaFreg18 || feature.properties.Edi_T_Co18 ===0){
        minEdificiosConsNovaFreg18 = feature.properties.Edi_T_Co18
    }
    if(feature.properties.Edi_T_Co18> maxEdificiosConsNovaFreg18){
        maxEdificiosConsNovaFreg18 = feature.properties.Edi_T_Co18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co18,2)
    });
}
function apagarEdificiosConsNovaFreg18(e){
    var layer = e.target;
    EdificiosConsNovaFreg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaFreg18(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Co18+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaFreg18,
    })
};

var EdificiosConsNovaFreg18= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosConsNovaFreg18,
    onEachFeature: onEachFeatureEdificiosConsNovaFreg18,
});

var slideEdificiosConsNovaFreg18 = function(){
    var sliderEdificiosConsNovaFreg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 115){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaFreg18, {
        start: [minEdificiosConsNovaFreg18, maxEdificiosConsNovaFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaFreg18,
            'max': maxEdificiosConsNovaFreg18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaFreg18);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg18.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaFreg18.noUiSlider.on('update',function(e){
        EdificiosConsNovaFreg18.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co18>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 115;
    sliderAtivo = sliderEdificiosConsNovaFreg18.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaFreg18);
}
///////////////////////////---------- FIM Edifícios licenciados EM 2018,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Ampliacoes 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesFreg18 = 99999;
var maxEdificiosAmpliacoesFreg18 = 0;
function estiloEdificiosAmpliacoesFreg18(feature, latlng) {
    if(feature.properties.Edi_T_Am18< minEdificiosAmpliacoesFreg18 || feature.properties.Edi_T_Am18 ===0){
        minEdificiosAmpliacoesFreg18 = feature.properties.Edi_T_Am18
    }
    if(feature.properties.Edi_T_Am18> maxEdificiosAmpliacoesFreg18){
        maxEdificiosAmpliacoesFreg18 = feature.properties.Edi_T_Am18
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am18,2)
    });
}
function apagarEdificiosAmpliacoesFreg18(e){
    var layer = e.target;
    EdificiosAmpliacoesFreg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesFreg18(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Am18+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesFreg18,
    })
};

var EdificiosAmpliacoesFreg18= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosAmpliacoesFreg18,
    onEachFeature: onEachFeatureEdificiosAmpliacoesFreg18,
});

var slideEdificiosAmpliacoesFreg18 = function(){
    var sliderEdificiosAmpliacoesFreg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 116){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesFreg18, {
        start: [minEdificiosAmpliacoesFreg18, maxEdificiosAmpliacoesFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesFreg18,
            'max': maxEdificiosAmpliacoesFreg18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesFreg18);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg18.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesFreg18.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesFreg18.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am18>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 116;
    sliderAtivo = sliderEdificiosAmpliacoesFreg18.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesFreg18);
}
///////////////////////////---------- FIM Edificios AMPLIAÇÕES Licenciados EM 2018,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- TOTAL Edificios LICENCIAADOS 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosFreg19 = 99999;
var maxTotalEdificiosFreg19 = 0;
function estiloTotalEdificiosFreg19(feature, latlng) {
    if(feature.properties.Edi_T_Ob19< minTotalEdificiosFreg19 || feature.properties.Edi_T_Ob19 ===0){
        minTotalEdificiosFreg19 = feature.properties.Edi_T_Ob19
    }
    if(feature.properties.Edi_T_Ob19> maxTotalEdificiosFreg19){
        maxTotalEdificiosFreg19 = feature.properties.Edi_T_Ob19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob19,2)
    });
}
function apagarTotalEdificiosFreg19(e){
    var layer = e.target;
    TotalEdificiosFreg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg19(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Ob19+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg19,
    })
};

var TotalEdificiosFreg19= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalEdificiosFreg19,
    onEachFeature: onEachFeatureTotalEdificiosFreg19,
});

var slideTotalEdificiosFreg19 = function(){
    var sliderTotalEdificiosFreg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 119){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg19, {
        start: [minTotalEdificiosFreg19, maxTotalEdificiosFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg19,
            'max': maxTotalEdificiosFreg19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg19);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg19.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg19.noUiSlider.on('update',function(e){
        TotalEdificiosFreg19.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob19>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 119;
    sliderAtivo = sliderTotalEdificiosFreg19.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg19);
}
///////////////////////////---------- FIM TOTAL Edifícios licenciados EM 2019,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Construção Nova 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaFreg19 = 99999;
var maxEdificiosConsNovaFreg19 = 0;
function estiloEdificiosConsNovaFreg19(feature, latlng) {
    if(feature.properties.Edi_T_Co19< minEdificiosConsNovaFreg19 || feature.properties.Edi_T_Co19 ===0){
        minEdificiosConsNovaFreg19 = feature.properties.Edi_T_Co19
    }
    if(feature.properties.Edi_T_Co19> maxEdificiosConsNovaFreg19){
        maxEdificiosConsNovaFreg19 = feature.properties.Edi_T_Co19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co19,2)
    });
}
function apagarEdificiosConsNovaFreg19(e){
    var layer = e.target;
    EdificiosConsNovaFreg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaFreg19(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Co19+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaFreg19,
    })
};

var EdificiosConsNovaFreg19= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosConsNovaFreg19,
    onEachFeature: onEachFeatureEdificiosConsNovaFreg19,
});

var slideEdificiosConsNovaFreg19 = function(){
    var sliderEdificiosConsNovaFreg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 120){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaFreg19, {
        start: [minEdificiosConsNovaFreg19, maxEdificiosConsNovaFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaFreg19,
            'max': maxEdificiosConsNovaFreg19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaFreg19);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg19.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaFreg19.noUiSlider.on('update',function(e){
        EdificiosConsNovaFreg19.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co19>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 120;
    sliderAtivo = sliderEdificiosConsNovaFreg19.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaFreg19);
}
///////////////////////////---------- FIM Edifícios licenciados EM 2019,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Ampliacoes 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesFreg19 = 99999;
var maxEdificiosAmpliacoesFreg19 = 0;
function estiloEdificiosAmpliacoesFreg19(feature, latlng) {
    if(feature.properties.Edi_T_Am19< minEdificiosAmpliacoesFreg19 || feature.properties.Edi_T_Am19 ===0){
        minEdificiosAmpliacoesFreg19 = feature.properties.Edi_T_Am19
    }
    if(feature.properties.Edi_T_Am19> maxEdificiosAmpliacoesFreg19){
        maxEdificiosAmpliacoesFreg19 = feature.properties.Edi_T_Am19
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am19,2)
    });
}
function apagarEdificiosAmpliacoesFreg19(e){
    var layer = e.target;
    EdificiosAmpliacoesFreg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesFreg19(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Am19+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesFreg19,
    })
};

var EdificiosAmpliacoesFreg19= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosAmpliacoesFreg19,
    onEachFeature: onEachFeatureEdificiosAmpliacoesFreg19,
});

var slideEdificiosAmpliacoesFreg19 = function(){
    var sliderEdificiosAmpliacoesFreg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 121){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesFreg19, {
        start: [minEdificiosAmpliacoesFreg19, maxEdificiosAmpliacoesFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesFreg19,
            'max': maxEdificiosAmpliacoesFreg19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesFreg19);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg19.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesFreg19.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesFreg19.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am19>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 121;
    sliderAtivo = sliderEdificiosAmpliacoesFreg19.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesFreg19);
}
///////////////////////////---------- FIM Edificios AMPLIAÇÕES Licenciados EM 2019,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- TOTAL Edificios LICENCIAADOS 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minTotalEdificiosFreg20 = 99999;
var maxTotalEdificiosFreg20 = 0;
function estiloTotalEdificiosFreg20(feature, latlng) {
    if(feature.properties.Edi_T_Ob20< minTotalEdificiosFreg20 || feature.properties.Edi_T_Ob20 ===0){
        minTotalEdificiosFreg20 = feature.properties.Edi_T_Ob20
    }
    if(feature.properties.Edi_T_Ob20> maxTotalEdificiosFreg20){
        maxTotalEdificiosFreg20 = feature.properties.Edi_T_Ob20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Ob20,2)
    });
}
function apagarTotalEdificiosFreg20(e){
    var layer = e.target;
    TotalEdificiosFreg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalEdificiosFreg20(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Ob20+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalEdificiosFreg20,
    })
};

var TotalEdificiosFreg20= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloTotalEdificiosFreg20,
    onEachFeature: onEachFeatureTotalEdificiosFreg20,
});

var slideTotalEdificiosFreg20 = function(){
    var sliderTotalEdificiosFreg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 124){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalEdificiosFreg20, {
        start: [minTotalEdificiosFreg20, maxTotalEdificiosFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalEdificiosFreg20,
            'max': maxTotalEdificiosFreg20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalEdificiosFreg20);
    inputNumberMax.setAttribute("value",maxTotalEdificiosFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalEdificiosFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalEdificiosFreg20.noUiSlider.set([null, this.value]);
    });

    sliderTotalEdificiosFreg20.noUiSlider.on('update',function(e){
        TotalEdificiosFreg20.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Ob20>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Ob20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalEdificiosFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 124;
    sliderAtivo = sliderTotalEdificiosFreg20.noUiSlider;
    $(slidersGeral).append(sliderTotalEdificiosFreg20);
}
///////////////////////////---------- FIM TOTAL Edifícios licenciados EM 2020,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Construção Nova 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosConsNovaFreg20 = 99999;
var maxEdificiosConsNovaFreg20 = 0;
function estiloEdificiosConsNovaFreg20(feature, latlng) {
    if(feature.properties.Edi_T_Co20< minEdificiosConsNovaFreg20 || feature.properties.Edi_T_Co20 ===0){
        minEdificiosConsNovaFreg20 = feature.properties.Edi_T_Co20
    }
    if(feature.properties.Edi_T_Co20> maxEdificiosConsNovaFreg20){
        maxEdificiosConsNovaFreg20 = feature.properties.Edi_T_Co20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Co20,2)
    });
}
function apagarEdificiosConsNovaFreg20(e){
    var layer = e.target;
    EdificiosConsNovaFreg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosConsNovaFreg20(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Co20+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosConsNovaFreg20,
    })
};

var EdificiosConsNovaFreg20= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosConsNovaFreg20,
    onEachFeature: onEachFeatureEdificiosConsNovaFreg20,
});

var slideEdificiosConsNovaFreg20 = function(){
    var sliderEdificiosConsNovaFreg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 125){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosConsNovaFreg20, {
        start: [minEdificiosConsNovaFreg20, maxEdificiosConsNovaFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosConsNovaFreg20,
            'max': maxEdificiosConsNovaFreg20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosConsNovaFreg20);
    inputNumberMax.setAttribute("value",maxEdificiosConsNovaFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosConsNovaFreg20.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosConsNovaFreg20.noUiSlider.on('update',function(e){
        EdificiosConsNovaFreg20.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Co20>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Co20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosConsNovaFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 125;
    sliderAtivo = sliderEdificiosConsNovaFreg20.noUiSlider;
    $(slidersGeral).append(sliderEdificiosConsNovaFreg20);
}
///////////////////////////---------- FIM Edifícios licenciados EM 2020,Por Freguesia -----------\\\\\\\\\

////////////////////////////----------- Edificios Licenciados Ampliacoes 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minEdificiosAmpliacoesFreg20 = 99999;
var maxEdificiosAmpliacoesFreg20 = 0;
function estiloEdificiosAmpliacoesFreg20(feature, latlng) {
    if(feature.properties.Edi_T_Am20< minEdificiosAmpliacoesFreg20 || feature.properties.Edi_T_Am20 ===0){
        minEdificiosAmpliacoesFreg20 = feature.properties.Edi_T_Am20
    }
    if(feature.properties.Edi_T_Am20> maxEdificiosAmpliacoesFreg20){
        maxEdificiosAmpliacoesFreg20 = feature.properties.Edi_T_Am20
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Edi_T_Am20,2)
    });
}
function apagarEdificiosAmpliacoesFreg20(e){
    var layer = e.target;
    EdificiosAmpliacoesFreg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureEdificiosAmpliacoesFreg20(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: '+ '<b>' + feature.properties.Concelho + '</b>' + ' <br> ' + 'Total de edifícios licenciados: '  + '<b>'+ feature.properties.Edi_T_Am20+ '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarEdificiosAmpliacoesFreg20,
    })
};

var EdificiosAmpliacoesFreg20= L.geoJSON(dadosAbsolutosFreguesias,{
    pointToLayer:estiloEdificiosAmpliacoesFreg20,
    onEachFeature: onEachFeatureEdificiosAmpliacoesFreg20,
});

var slideEdificiosAmpliacoesFreg20 = function(){
    var sliderEdificiosAmpliacoesFreg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 126){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderEdificiosAmpliacoesFreg20, {
        start: [minEdificiosAmpliacoesFreg20, maxEdificiosAmpliacoesFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minEdificiosAmpliacoesFreg20,
            'max': maxEdificiosAmpliacoesFreg20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minEdificiosAmpliacoesFreg20);
    inputNumberMax.setAttribute("value",maxEdificiosAmpliacoesFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderEdificiosAmpliacoesFreg20.noUiSlider.set([null, this.value]);
    });

    sliderEdificiosAmpliacoesFreg20.noUiSlider.on('update',function(e){
        EdificiosAmpliacoesFreg20.eachLayer(function(layer){
            if(layer.feature.properties.Edi_T_Am20>=parseFloat(e[0])&& layer.feature.properties.Edi_T_Am20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderEdificiosAmpliacoesFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 126;
    sliderAtivo = sliderEdificiosAmpliacoesFreg20.noUiSlider;
    $(slidersGeral).append(sliderEdificiosAmpliacoesFreg20);
}
///////////////////////////---------- FIM Edificios AMPLIAÇÕES Licenciados EM 2020,Por Freguesia -----------\\\\\\\\\


///////////////////////////////////////------------------- FIM DADOS ABSOLUTOS \\\\

////////////////////////////////////----------- PERCENTAGEM CONSTRUÇÃO NOVA, EM 2014 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerConsFreg14 = 0;
var maxPerConsFreg14 = 0;
function estiloPerConsFreg14(feature) {
    if(feature.properties.PerCons_14 < minPerConsFreg14 &&  feature.properties.PerCons_14 > null || feature.properties.PerCons_14 ===0){
        minPerConsFreg14 = feature.properties.PerCons_14
    }
    if(feature.properties.PerCons_14> maxPerConsFreg14 && feature.properties.PerCons_14 > null){
        maxPerConsFreg14 = feature.properties.PerCons_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerCons_14)
    };
}
function apagarPerConsFreg14(e){
    var layer = e.target;
    PerConsFreg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerConsFreg14(feature, layer) {
    if (feature.properties.PerCons_14 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerCons_14 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerConsFreg14,
    })
};

var PerConsFreg14= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerConsFreg14,
    onEachFeature: onEachFeaturePerConsFreg14,
});

var slidePerConsFreg14 = function(){
    var sliderPerConsFreg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 129){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerConsFreg14, {
        start: [minPerConsFreg14, maxPerConsFreg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsFreg14,
            'max': maxPerConsFreg14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerConsFreg14);
    inputNumberMax.setAttribute("value",maxPerConsFreg14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsFreg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsFreg14.noUiSlider.set([null, this.value]);
    });

    sliderPerConsFreg14.noUiSlider.on('update',function(e){
        PerConsFreg14.eachLayer(function(layer){
            if (layer.feature.properties.PerCons_14 == null){
                return false
            }
            if(layer.feature.properties.PerCons_14>=parseFloat(e[0])&& layer.feature.properties.PerCons_14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerConsFreg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 129;
    sliderAtivo = sliderPerConsFreg14.noUiSlider;
    $(slidersGeral).append(sliderPerConsFreg14);
}
///////////////////////////-------------------- Fim FREGUESIA CONSTRUÇÃO NOVA, EM 2014,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////-----------Percentagem Ampliações, EM 2014 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerAmplFreg14 = 99999;
var maxPerAmplFreg14 = 0;

function CorPerAmpliacaoFreg(d) {
    return d == null ? '#808080' :
        d >= 90 ? '#8c0303' :
        d >= 75  ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 25   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaPerAmpliacaoFreg = function() {
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
function estiloPerAmplFreg14(feature) {
    if(feature.properties.PerAmpl_14< minPerAmplFreg14 && feature.properties.PerAmpl_14 > null || feature.properties.PerAmpl_14 ===0){
        minPerAmplFreg14 = feature.properties.PerAmpl_14
    }
    if(feature.properties.PerAmpl_14> maxPerAmplFreg14 && feature.properties.PerAmpl_14 > null){
        maxPerAmplFreg14 = feature.properties.PerAmpl_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerAmpl_14)
    };
}
function apagarPerAmplFreg14(e){
    var layer = e.target;
    PerAmplFreg14.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerAmplFreg14(feature, layer) {
    if (feature.properties.PerAmpl_14 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerAmpl_14 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerAmplFreg14,
    })
};

var PerAmplFreg14= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerAmplFreg14,
    onEachFeature: onEachFeaturePerAmplFreg14,
});

var slidePerAmplFreg14 = function(){
    var sliderPerAmplFreg14 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 130){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerAmplFreg14, {
        start: [minPerAmplFreg14, maxPerAmplFreg14],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmplFreg14,
            'max': maxPerAmplFreg14
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerAmplFreg14);
    inputNumberMax.setAttribute("value",maxPerAmplFreg14);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmplFreg14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmplFreg14.noUiSlider.set([null, this.value]);
    });

    sliderPerAmplFreg14.noUiSlider.on('update',function(e){
        PerAmplFreg14.eachLayer(function(layer){
            if (layer.feature.properties.PerAmpl_14 == null){
                return false
            }
            if(layer.feature.properties.PerAmpl_14>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_14 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerAmplFreg14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 130;
    sliderAtivo = sliderPerAmplFreg14.noUiSlider;
    $(slidersGeral).append(sliderPerAmplFreg14);
}
///////////////////////////-------------------- Fim FREGUESIA AMPLIACOES, EM 2014,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////----------- PERCENTAGEM CONSTRUÇÃO NOVA, EM 2015 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerConsFreg15 = 99999;
var maxPerConsFreg15 = 0;
function estiloPerConsFreg15(feature) {
    if(feature.properties.PerCons_15< minPerConsFreg15 && feature.properties.PerCons_15 > null || feature.properties.PerCons_15 ===0){
        minPerConsFreg15 = feature.properties.PerCons_15
    }
    if(feature.properties.PerCons_15> maxPerConsFreg15 && feature.properties.PerCons_15 > null){
        maxPerConsFreg15 = feature.properties.PerCons_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerCons_15)
    };
}
function apagarPerConsFreg15(e){
    var layer = e.target;
    PerConsFreg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerConsFreg15(feature, layer) {
    if (feature.properties.PerCons_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerCons_15 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerConsFreg15,
    })
};

var PerConsFreg15= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerConsFreg15,
    onEachFeature: onEachFeaturePerConsFreg15,
});

var slidePerConsFreg15 = function(){
    var sliderPerConsFreg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 133){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerConsFreg15, {
        start: [minPerConsFreg15, maxPerConsFreg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsFreg15,
            'max': maxPerConsFreg15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerConsFreg15);
    inputNumberMax.setAttribute("value",maxPerConsFreg15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsFreg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsFreg15.noUiSlider.set([null, this.value]);
    });

    sliderPerConsFreg15.noUiSlider.on('update',function(e){
        PerConsFreg15.eachLayer(function(layer){
            if (layer.feature.properties.PerCons_15 == null){
                return false
            }
            if(layer.feature.properties.PerCons_15>=parseFloat(e[0])&& layer.feature.properties.PerCons_15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerConsFreg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 133;
    sliderAtivo = sliderPerConsFreg15.noUiSlider;
    $(slidersGeral).append(sliderPerConsFreg15);
}
///////////////////////////-------------------- Fim FREGUESIA CONSTRUÇÃO NOVA, EM 2015,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM AMPLIACOES, EM 2015 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerAmplFreg15 = 99999;
var maxPerAmplFreg15 = 0;
function estiloPerAmplFreg15(feature, latlng) {
    if(feature.properties.PerAmpl_15< minPerAmplFreg15 && feature.properties.PerAmpl_15 > null || feature.properties.PerAmpl_15 ===0){
        minPerAmplFreg15 = feature.properties.PerAmpl_15
    }
    if(feature.properties.PerAmpl_15> maxPerAmplFreg15 && feature.properties.PerAmpl_15 > null){
        maxPerAmplFreg15 = feature.properties.PerAmpl_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerAmpl_15)
    };
}
function apagarPerAmplFreg15(e){
    var layer = e.target;
    PerAmplFreg15.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerAmplFreg15(feature, layer) {
    if (feature.properties.PerAmpl_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerAmpl_15 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerAmplFreg15,
    })
};

var PerAmplFreg15= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerAmplFreg15,
    onEachFeature: onEachFeaturePerAmplFreg15,
});

var slidePerAmplFreg15 = function(){
    var sliderPerAmplFreg15 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 134){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerAmplFreg15, {
        start: [minPerAmplFreg15, maxPerAmplFreg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmplFreg15,
            'max': maxPerAmplFreg15
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerAmplFreg15);
    inputNumberMax.setAttribute("value",maxPerAmplFreg15);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmplFreg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmplFreg15.noUiSlider.set([null, this.value]);
    });

    sliderPerAmplFreg15.noUiSlider.on('update',function(e){
        PerAmplFreg15.eachLayer(function(layer){
            if (layer.feature.properties.PerAmpl_15 == null){
                return false
            }
            if(layer.feature.properties.PerAmpl_15>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_15 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerAmplFreg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 134;
    sliderAtivo = sliderPerAmplFreg15.noUiSlider;
    $(slidersGeral).append(sliderPerAmplFreg15);
}
///////////////////////////-------------------- FIM PERCENTAGEM AMPLIACOES, EM 2015,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM CONSTRUÇÃO NOVA, EM 2016 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerConsFreg16 = 99999;
var maxPerConsFreg16 = 0;
function estiloPerConsFreg16(feature) {
    if(feature.properties.PerCons_16< minPerConsFreg16  && feature.properties.PerCons_16 > null|| feature.properties.PerCons_16 ===0){
        minPerConsFreg16 = feature.properties.PerCons_16
    }
    if(feature.properties.PerCons_16> maxPerConsFreg16 && feature.properties.PerCons_16 > null){
        maxPerConsFreg16 = feature.properties.PerCons_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerCons_16)
    };
}
function apagarPerConsFreg16(e){
    var layer = e.target;
    PerConsFreg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerConsFreg16(feature, layer) {
    if (feature.properties.PerCons_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerCons_16 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerConsFreg16,
    })
};

var PerConsFreg16= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerConsFreg16,
    onEachFeature: onEachFeaturePerConsFreg16,
});

var slidePerConsFreg16 = function(){
    var sliderPerConsFreg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 137){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerConsFreg16, {
        start: [minPerConsFreg16, maxPerConsFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsFreg16,
            'max': maxPerConsFreg16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerConsFreg16);
    inputNumberMax.setAttribute("value",maxPerConsFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsFreg16.noUiSlider.set([null, this.value]);
    });

    sliderPerConsFreg16.noUiSlider.on('update',function(e){
        PerConsFreg16.eachLayer(function(layer){
            if (layer.feature.properties.PerCons_16 == null){
                return false
            }
            if(layer.feature.properties.PerCons_16>=parseFloat(e[0])&& layer.feature.properties.PerCons_16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerConsFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 137;
    sliderAtivo = sliderPerConsFreg16.noUiSlider;
    $(slidersGeral).append(sliderPerConsFreg16);
}
///////////////////////////-------------------- Fim FREGUESIA CONSTRUÇÃO NOVA, EM 2016,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM AMPLIACOES, EM 2016 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerAmplFreg16 = 99999;
var maxPerAmplFreg16 = 0;
function estiloPerAmplFreg16(feature) {
    if(feature.properties.PerAmpl_16< minPerAmplFreg16 && feature.properties.PerAmpl_16 > null || feature.properties.PerAmpl_16 ===0){
        minPerAmplFreg16 = feature.properties.PerAmpl_16
    }
    if(feature.properties.PerAmpl_16> maxPerAmplFreg16 && feature.properties.PerAmpl_16 > null){
        maxPerAmplFreg16 = feature.properties.PerAmpl_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerAmpl_16)
    };
}
function apagarPerAmplFreg16(e){
    var layer = e.target;
    PerAmplFreg16.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerAmplFreg16(feature, layer) {
    if (feature.properties.PerAmpl_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerAmpl_16 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerAmplFreg16,
    })
};

var PerAmplFreg16= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerAmplFreg16,
    onEachFeature: onEachFeaturePerAmplFreg16,
});

var slidePerAmplFreg16 = function(){
    var sliderPerAmplFreg16 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 138){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerAmplFreg16, {
        start: [minPerAmplFreg16, maxPerAmplFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmplFreg16,
            'max': maxPerAmplFreg16
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerAmplFreg16);
    inputNumberMax.setAttribute("value",maxPerAmplFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmplFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmplFreg16.noUiSlider.set([null, this.value]);
    });

    sliderPerAmplFreg16.noUiSlider.on('update',function(e){
        PerAmplFreg16.eachLayer(function(layer){
            if (layer.feature.properties.PerAmpl_16 == null){
                return false
            }
            if(layer.feature.properties.PerAmpl_16>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_16 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerAmplFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 138;
    sliderAtivo = sliderPerAmplFreg16.noUiSlider;
    $(slidersGeral).append(sliderPerAmplFreg16);
}
///////////////////////////-------------------- FIM PERCENTAGEM AMPLIACOES, EM 2016,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM CONSTRUÇÃO NOVA, EM 2017 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerConsFreg17 = 99999;
var maxPerConsFreg17 = 0;
function estiloPerConsFreg17(feature) {
    if(feature.properties.PerCons_17< minPerConsFreg17 && feature.properties.PerCons_17 > null || feature.properties.PerCons_17 ===0){
        minPerConsFreg17 = feature.properties.PerCons_17
    }
    if(feature.properties.PerCons_17> maxPerConsFreg17 && feature.properties.PerCons_17 > null){
        maxPerConsFreg17 = feature.properties.PerCons_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerCons_17)
    };
}
function apagarPerConsFreg17(e){
    var layer = e.target;
    PerConsFreg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerConsFreg17(feature, layer) {
    if (feature.properties.PerCons_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerCons_17 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerConsFreg17,
    })
};

var PerConsFreg17= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerConsFreg17,
    onEachFeature: onEachFeaturePerConsFreg17,
});

var slidePerConsFreg17 = function(){
    var sliderPerConsFreg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 141){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerConsFreg17, {
        start: [minPerConsFreg17, maxPerConsFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsFreg17,
            'max': maxPerConsFreg17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerConsFreg17);
    inputNumberMax.setAttribute("value",maxPerConsFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsFreg17.noUiSlider.set([null, this.value]);
    });

    sliderPerConsFreg17.noUiSlider.on('update',function(e){
        PerConsFreg17.eachLayer(function(layer){
            if (layer.feature.properties.PerCons_17 == null){
                return false
            }
            if(layer.feature.properties.PerCons_17>=parseFloat(e[0])&& layer.feature.properties.PerCons_17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerConsFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 141;
    sliderAtivo = sliderPerConsFreg17.noUiSlider;
    $(slidersGeral).append(sliderPerConsFreg17);
}
///////////////////////////-------------------- Fim FREGUESIA CONSTRUÇÃO NOVA, EM 2017,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM AMPLIACOES, EM 2017 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerAmplFreg17 = 99999;
var maxPerAmplFreg17 = 0;
function estiloPerAmplFreg17(feature) {
    if(feature.properties.PerAmpl_17< minPerAmplFreg17 && feature.properties.PerAmpl_17 > null || feature.properties.PerAmpl_17 ===0){
        minPerAmplFreg17 = feature.properties.PerAmpl_17
    }
    if(feature.properties.PerAmpl_17> maxPerAmplFreg17 && feature.properties.PerAmpl_17 > null){
        maxPerAmplFreg17 = feature.properties.PerAmpl_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerAmpl_17)
    };
}
function apagarPerAmplFreg17(e){
    var layer = e.target;
    PerAmplFreg17.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerAmplFreg17(feature, layer) {
    if (feature.properties.PerAmpl_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerAmpl_17 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerAmplFreg17,
    })
};

var PerAmplFreg17= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerAmplFreg17,
    onEachFeature: onEachFeaturePerAmplFreg17,
});

var slidePerAmplFreg17 = function(){
    var sliderPerAmplFreg17 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 142){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerAmplFreg17, {
        start: [minPerAmplFreg17, maxPerAmplFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmplFreg17,
            'max': maxPerAmplFreg17
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerAmplFreg17);
    inputNumberMax.setAttribute("value",maxPerAmplFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmplFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmplFreg17.noUiSlider.set([null, this.value]);
    });

    sliderPerAmplFreg17.noUiSlider.on('update',function(e){
        PerAmplFreg17.eachLayer(function(layer){
            if (layer.feature.properties.PerAmpl_17 == null){
                return false
            }
            if(layer.feature.properties.PerAmpl_17>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerAmplFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 142;
    sliderAtivo = sliderPerAmplFreg17.noUiSlider;
    $(slidersGeral).append(sliderPerAmplFreg17);
}
///////////////////////////-------------------- FIM PERCENTAGEM AMPLIACOES, EM 2017,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM CONSTRUÇÃO NOVA, EM 2018 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerConsFreg18 = 99999;
var maxPerConsFreg18 = 0;
function estiloPerConsFreg18(feature) {
    if(feature.properties.PerCons_18< minPerConsFreg18 && feature.properties.PerCons_18 > null || feature.properties.PerCons_18 ===0){
        minPerConsFreg18 = feature.properties.PerCons_18
    }
    if(feature.properties.PerCons_18> maxPerConsFreg18 && feature.properties.PerCons_18 > null){
        maxPerConsFreg18 = feature.properties.PerCons_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerCons_18)
    };
}
function apagarPerConsFreg18(e){
    var layer = e.target;
    PerConsFreg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerConsFreg18(feature, layer) {
    if (feature.properties.PerCons_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerCons_18 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerConsFreg18,
    })
};

var PerConsFreg18= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerConsFreg18,
    onEachFeature: onEachFeaturePerConsFreg18,
});

var slidePerConsFreg18 = function(){
    var sliderPerConsFreg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 145){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerConsFreg18, {
        start: [minPerConsFreg18, maxPerConsFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsFreg18,
            'max': maxPerConsFreg18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerConsFreg18);
    inputNumberMax.setAttribute("value",maxPerConsFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsFreg18.noUiSlider.set([null, this.value]);
    });

    sliderPerConsFreg18.noUiSlider.on('update',function(e){
        PerConsFreg18.eachLayer(function(layer){
            if (layer.feature.properties.PerCons_18 == null){
                return false
            }
            if(layer.feature.properties.PerCons_18>=parseFloat(e[0])&& layer.feature.properties.PerCons_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerConsFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 145;
    sliderAtivo = sliderPerConsFreg18.noUiSlider;
    $(slidersGeral).append(sliderPerConsFreg18);
}
///////////////////////////-------------------- Fim FREGUESIA CONSTRUÇÃO NOVA, EM 2018,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM AMPLIACOES, EM 2018 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerAmplFreg18 = 99999;
var maxPerAmplFreg18 = 0;
function estiloPerAmplFreg18(feature) {
    if(feature.properties.PerAmpl_18< minPerAmplFreg18  && feature.properties.PerAmpl_18 > null|| feature.properties.PerAmpl_18 ===0){
        minPerAmplFreg18 = feature.properties.PerAmpl_18
    }
    if(feature.properties.PerAmpl_18> maxPerAmplFreg18 && feature.properties.PerAmpl_18 > null){
        maxPerAmplFreg18 = feature.properties.PerAmpl_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerAmpl_18)
    };
}
function apagarPerAmplFreg18(e){
    var layer = e.target;
    PerAmplFreg18.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerAmplFreg18(feature, layer) {
    if (feature.properties.PerAmpl_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerAmpl_18 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerAmplFreg18,
    })
};

var PerAmplFreg18= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerAmplFreg18,
    onEachFeature: onEachFeaturePerAmplFreg18,
});

var slidePerAmplFreg18 = function(){
    var sliderPerAmplFreg18 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 146){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerAmplFreg18, {
        start: [minPerAmplFreg18, maxPerAmplFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmplFreg18,
            'max': maxPerAmplFreg18
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerAmplFreg18);
    inputNumberMax.setAttribute("value",maxPerAmplFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmplFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmplFreg18.noUiSlider.set([null, this.value]);
    });

    sliderPerAmplFreg18.noUiSlider.on('update',function(e){
        PerAmplFreg18.eachLayer(function(layer){
            if (layer.feature.properties.PerAmpl_18 == null){
                return false
            }
            if(layer.feature.properties.PerAmpl_18>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerAmplFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 146;
    sliderAtivo = sliderPerAmplFreg18.noUiSlider;
    $(slidersGeral).append(sliderPerAmplFreg18);
}
///////////////////////////-------------------- FIM PERCENTAGEM AMPLIACOES, EM 2018,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM CONSTRUÇÃO NOVA, EM 2019 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerConsFreg19 = 99999;
var maxPerConsFreg19 = 0;
function estiloPerConsFreg19(feature) {
    if(feature.properties.PerCons_19< minPerConsFreg19  && feature.properties.PerCons_19 > null|| feature.properties.PerCons_19 ===0){
        minPerConsFreg19 = feature.properties.PerCons_19
    }
    if(feature.properties.PerCons_19> maxPerConsFreg19 && feature.properties.PerCons_19 > null){
        maxPerConsFreg19 = feature.properties.PerCons_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerCons_19)
    };
}
function apagarPerConsFreg19(e){
    var layer = e.target;
    PerConsFreg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerConsFreg19(feature, layer) {
    if (feature.properties.PerCons_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerCons_19 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerConsFreg19,
    })
};

var PerConsFreg19= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerConsFreg19,
    onEachFeature: onEachFeaturePerConsFreg19,
});

var slidePerConsFreg19 = function(){
    var sliderPerConsFreg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 149){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerConsFreg19, {
        start: [minPerConsFreg19, maxPerConsFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsFreg19,
            'max': maxPerConsFreg19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerConsFreg19);
    inputNumberMax.setAttribute("value",maxPerConsFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsFreg19.noUiSlider.set([null, this.value]);
    });

    sliderPerConsFreg19.noUiSlider.on('update',function(e){
        PerConsFreg19.eachLayer(function(layer){
            if (layer.feature.properties.PerCons_19 == null){
                return false
            }
            if(layer.feature.properties.PerCons_19>=parseFloat(e[0])&& layer.feature.properties.PerCons_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerConsFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 149;
    sliderAtivo = sliderPerConsFreg19.noUiSlider;
    $(slidersGeral).append(sliderPerConsFreg19);
}
///////////////////////////-------------------- Fim FREGUESIA CONSTRUÇÃO NOVA, EM 2019,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM AMPLIACOES, EM 2019 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerAmplFreg19 = 99999;
var maxPerAmplFreg19 = 0;
function estiloPerAmplFreg19(feature) {
    if(feature.properties.PerAmpl_19< minPerAmplFreg19  && feature.properties.PerAmpl_19 > null|| feature.properties.PerAmpl_19 ===0){
        minPerAmplFreg19 = feature.properties.PerAmpl_19
    }
    if(feature.properties.PerAmpl_19> maxPerAmplFreg19 && feature.properties.PerAmpl_19 > null){
        maxPerAmplFreg19 = feature.properties.PerAmpl_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerAmpl_19)
    };
}
function apagarPerAmplFreg19(e){
    var layer = e.target;
    PerAmplFreg19.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerAmplFreg19(feature, layer) {
    if (feature.properties.PerAmpl_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerAmpl_19 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerAmplFreg19,
    })
};

var PerAmplFreg19= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerAmplFreg19,
    onEachFeature: onEachFeaturePerAmplFreg19,
});

var slidePerAmplFreg19 = function(){
    var sliderPerAmplFreg19 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 150){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerAmplFreg19, {
        start: [minPerAmplFreg19, maxPerAmplFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmplFreg19,
            'max': maxPerAmplFreg19
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerAmplFreg19);
    inputNumberMax.setAttribute("value",maxPerAmplFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmplFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmplFreg19.noUiSlider.set([null, this.value]);
    });

    sliderPerAmplFreg19.noUiSlider.on('update',function(e){
        PerAmplFreg19.eachLayer(function(layer){
            if (layer.feature.properties.PerAmpl_19 == null){
                return false
            }
            if(layer.feature.properties.PerAmpl_19>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerAmplFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 150;
    sliderAtivo = sliderPerAmplFreg19.noUiSlider;
    $(slidersGeral).append(sliderPerAmplFreg19);
}
///////////////////////////-------------------- FIM PERCENTAGEM AMPLIACOES, EM 2019,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM CONSTRUÇÃO NOVA, EM 2020 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerConsFreg20 = 99999;
var maxPerConsFreg20 = 0;
function estiloPerConsFreg20(feature) {
    if(feature.properties.PerCons_20< minPerConsFreg20  && feature.properties.PerCons_20 > null|| feature.properties.PerCons_20 ===0){
        minPerConsFreg20 = feature.properties.PerCons_20
    }
    if(feature.properties.PerCons_20> maxPerConsFreg20 && feature.properties.PerCons_20 > null){
        maxPerConsFreg20 = feature.properties.PerCons_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerCons_20)
    };
}
function apagarPerConsFreg20(e){
    var layer = e.target;
    PerConsFreg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerConsFreg20(feature, layer) {
    if (feature.properties.PerCons_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerCons_20 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerConsFreg20,
    })
};

var PerConsFreg20= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerConsFreg20,
    onEachFeature: onEachFeaturePerConsFreg20,
});

var slidePerConsFreg20 = function(){
    var sliderPerConsFreg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 153){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerConsFreg20, {
        start: [minPerConsFreg20, maxPerConsFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerConsFreg20,
            'max': maxPerConsFreg20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerConsFreg20);
    inputNumberMax.setAttribute("value",maxPerConsFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerConsFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerConsFreg20.noUiSlider.set([null, this.value]);
    });

    sliderPerConsFreg20.noUiSlider.on('update',function(e){
        PerConsFreg20.eachLayer(function(layer){
            if (layer.feature.properties.PerCons_20 == null){
                return false
            }
            if(layer.feature.properties.PerCons_20>=parseFloat(e[0])&& layer.feature.properties.PerCons_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerConsFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 153;
    sliderAtivo = sliderPerConsFreg20.noUiSlider;
    $(slidersGeral).append(sliderPerConsFreg20);
}
///////////////////////////-------------------- Fim FREGUESIA CONSTRUÇÃO NOVA, EM 2020,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM AMPLIACOES, EM 2020 ,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPerAmplFreg20 = 99999;
var maxPerAmplFreg20 = 0;
function estiloPerAmplFreg20(feature) {
    if(feature.properties.PerAmpl_20< minPerAmplFreg20  && feature.properties.PerAmpl_20 > null|| feature.properties.PerAmpl_20 ===0){
        minPerAmplFreg20 = feature.properties.PerAmpl_20
    }
    if(feature.properties.PerAmpl_20> maxPerAmplFreg20 && feature.properties.PerAmpl_20 > null){
        maxPerAmplFreg20 = feature.properties.PerAmpl_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerAmpliacaoFreg(feature.properties.PerAmpl_20)
    };
}
function apagarPerAmplFreg20(e){
    var layer = e.target;
    PerAmplFreg20.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePerAmplFreg20(feature, layer) {
    if (feature.properties.PerAmpl_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Proporção de edifícios licenciados: ' + '<b>' +feature.properties.PerAmpl_20 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPerAmplFreg20,
    })
};

var PerAmplFreg20= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPerAmplFreg20,
    onEachFeature: onEachFeaturePerAmplFreg20,
});

var slidePerAmplFreg20 = function(){
    var sliderPerAmplFreg20 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 154){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPerAmplFreg20, {
        start: [minPerAmplFreg20, maxPerAmplFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerAmplFreg20,
            'max': maxPerAmplFreg20
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPerAmplFreg20);
    inputNumberMax.setAttribute("value",maxPerAmplFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderPerAmplFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerAmplFreg20.noUiSlider.set([null, this.value]);
    });

    sliderPerAmplFreg20.noUiSlider.on('update',function(e){
        PerAmplFreg20.eachLayer(function(layer){
            if (layer.feature.properties.PerAmpl_20 == null){
                return false
            }
            if(layer.feature.properties.PerAmpl_20>=parseFloat(e[0])&& layer.feature.properties.PerAmpl_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPerAmplFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 154;
    sliderAtivo = sliderPerAmplFreg20.noUiSlider;
    $(slidersGeral).append(sliderPerAmplFreg20);
}
///////////////////////////-------------------- FIM PERCENTAGEM AMPLIACOES, EM 2020,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////------------------------ FIM DADOS RELATIVOS ---------------\\\\\\\\\\\\\\\\\\\

//////////////////////////---------------------- VARIAÇÕES POR FREGUESIA -------------------\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação Total, em 2015, POR FREGUESIAS -------------------////

var minVarTotalEdiFreg15 = 9999;
var maxVarTotalEdiFreg15 = 0;

function CorVarTotalEdiFreg15_14(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalEdiFreg15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2015 e 2014, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalEdiFreg15(feature) {
    if(feature.properties.VarObra_15 <= minVarTotalEdiFreg15){
        minVarTotalEdiFreg15 = feature.properties.VarObra_15
    }
    if(feature.properties.VarObra_15 > maxVarTotalEdiFreg15){
        maxVarTotalEdiFreg15 = feature.properties.VarObra_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiFreg15_14(feature.properties.VarObra_15)};
    }


function apagarVarTotalEdiFreg15(e) {
    VarTotalEdiFreg15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiFreg15(feature, layer) {
    if (feature.properties.VarObra_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiFreg15,
    });
}
var VarTotalEdiFreg15= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalEdiFreg15,
    onEachFeature: onEachFeatureVarTotalEdiFreg15
});

let slideVarTotalEdiFreg15 = function(){
    var sliderVarTotalEdiFreg15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 157){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiFreg15, {
        start: [minVarTotalEdiFreg15, maxVarTotalEdiFreg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiFreg15,
            'max': maxVarTotalEdiFreg15
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiFreg15);
    inputNumberMax.setAttribute("value",maxVarTotalEdiFreg15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiFreg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiFreg15.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiFreg15.noUiSlider.on('update',function(e){
        VarTotalEdiFreg15.eachLayer(function(layer){
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
        sliderVarTotalEdiFreg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 157;
    sliderAtivo = sliderVarTotalEdiFreg15.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiFreg15);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2015 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2015, POR FREGUESIAS -------------------////

var minVarConsNovaFreg15 = 9999;
var maxVarConsNovaFreg15 = 0;

function CorVarTotalConsNovaFreg15_14(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalConsNovaFreg15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2015 e 2014, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarConsNovaFreg15(feature) {
    if(feature.properties.VarCons_15 <= minVarConsNovaFreg15 ){
        minVarConsNovaFreg15 = feature.properties.VarCons_15
    }
    if(feature.properties.VarCons_15 > maxVarConsNovaFreg15){
        maxVarConsNovaFreg15 = feature.properties.VarCons_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaFreg15_14(feature.properties.VarCons_15)};
    }


function apagarVarConsNovaFreg15(e) {
    VarConsNovaFreg15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaFreg15(feature, layer) {
    if (feature.properties.VarCons_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaFreg15,
    });
}
var VarConsNovaFreg15= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarConsNovaFreg15,
    onEachFeature: onEachFeatureVarConsNovaFreg15
});

let slideVarConsNovaFreg15 = function(){
    var sliderVarConsNovaFreg15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 158){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaFreg15, {
        start: [minVarConsNovaFreg15, maxVarConsNovaFreg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaFreg15,
            'max': maxVarConsNovaFreg15
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaFreg15);
    inputNumberMax.setAttribute("value",maxVarConsNovaFreg15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaFreg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaFreg15.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaFreg15.noUiSlider.on('update',function(e){
        VarConsNovaFreg15.eachLayer(function(layer){
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
        sliderVarConsNovaFreg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 158;
    sliderAtivo = sliderVarConsNovaFreg15.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaFreg15);
} 

///////////////////////////// Fim Variação Construção Nova, em 2015 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2015, POR FREGUESIAS -------------------////

var minVarAmpliacoesFreg15 = 9999;
var maxVarAmpliacoesFreg15 = 0;

function CorVarTotalAmpliacoesFreg15_14(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalAmpliacoesFreg15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2015 e 2014, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesFreg15(feature) {
    if(feature.properties.VarAmpl_15 <= minVarAmpliacoesFreg15){
        minVarAmpliacoesFreg15 = feature.properties.VarAmpl_15
    }
    if(feature.properties.VarAmpl_15 > maxVarAmpliacoesFreg15 ){
        maxVarAmpliacoesFreg15 = feature.properties.VarAmpl_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalAmpliacoesFreg15_14(feature.properties.VarAmpl_15)};
    }


function apagarVarAmpliacoesFreg15(e) {
    VarAmpliacoesFreg15.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesFreg15(feature, layer) {
    if (feature.properties.VarAmpl_15 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_15.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesFreg15,
    });
}
var VarAmpliacoesFreg15= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarAmpliacoesFreg15,
    onEachFeature: onEachFeatureVarAmpliacoesFreg15
});

let slideVarAmpliacoesFreg15 = function(){
    var sliderVarAmpliacoesFreg15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 159){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesFreg15, {
        start: [minVarAmpliacoesFreg15, maxVarAmpliacoesFreg15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesFreg15,
            'max': maxVarAmpliacoesFreg15
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesFreg15);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesFreg15);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesFreg15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesFreg15.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesFreg15.noUiSlider.on('update',function(e){
        VarAmpliacoesFreg15.eachLayer(function(layer){
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
        sliderVarAmpliacoesFreg15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 159;
    sliderAtivo = sliderVarAmpliacoesFreg15.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesFreg15);
} 

///////////////////////////// Fim Variação Ampliações, em 2015 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2016, POR FREGUESIAS -------------------////

var minVarTotalEdiFreg16 = 9999;
var maxVarTotalEdiFreg16 = 0;

function CorVarTotalEdiFreg16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalEdiFreg16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2016 e 2015, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarTotalEdiFreg16(feature) {
    if(feature.properties.VarObra_16 <= minVarTotalEdiFreg16){
        minVarTotalEdiFreg16 = feature.properties.VarObra_16
    }
    if(feature.properties.VarObra_16 > maxVarTotalEdiFreg16){
        maxVarTotalEdiFreg16 = feature.properties.VarObra_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiFreg16_15(feature.properties.VarObra_16)};
    }


function apagarVarTotalEdiFreg16(e) {
    VarTotalEdiFreg16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiFreg16(feature, layer) {
    if (feature.properties.VarObra_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiFreg16,
    });
}
var VarTotalEdiFreg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalEdiFreg16,
    onEachFeature: onEachFeatureVarTotalEdiFreg16
});

let slideVarTotalEdiFreg16 = function(){
    var sliderVarTotalEdiFreg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 162){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiFreg16, {
        start: [minVarTotalEdiFreg16, maxVarTotalEdiFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiFreg16,
            'max': maxVarTotalEdiFreg16
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiFreg16);
    inputNumberMax.setAttribute("value",maxVarTotalEdiFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiFreg16.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiFreg16.noUiSlider.on('update',function(e){
        VarTotalEdiFreg16.eachLayer(function(layer){
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
        sliderVarTotalEdiFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 162;
    sliderAtivo = sliderVarTotalEdiFreg16.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiFreg16);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2016 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2016, POR FREGUESIAS -------------------////

var minVarConsNovaFreg16 = 9999;
var maxVarConsNovaFreg16 = 0;

function CorVarTotalConsNovaFreg16_15(d) {
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalConsNovaFreg16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2016 e 2015, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarConsNovaFreg16(feature) {
    if(feature.properties.VarCons_16 <= minVarConsNovaFreg16){
        minVarConsNovaFreg16 = feature.properties.VarCons_16
    }
    if(feature.properties.VarCons_16 > maxVarConsNovaFreg16){
        maxVarConsNovaFreg16 = feature.properties.VarCons_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaFreg16_15(feature.properties.VarCons_16)};
    }


function apagarVarConsNovaFreg16(e) {
    VarConsNovaFreg16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaFreg16(feature, layer) {
    if (feature.properties.VarCons_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaFreg16,
    });
}
var VarConsNovaFreg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarConsNovaFreg16,
    onEachFeature: onEachFeatureVarConsNovaFreg16
});

let slideVarConsNovaFreg16 = function(){
    var sliderVarConsNovaFreg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 163){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaFreg16, {
        start: [minVarConsNovaFreg16, maxVarConsNovaFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaFreg16,
            'max': maxVarConsNovaFreg16
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaFreg16);
    inputNumberMax.setAttribute("value",maxVarConsNovaFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaFreg16.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaFreg16.noUiSlider.on('update',function(e){
        VarConsNovaFreg16.eachLayer(function(layer){
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
        sliderVarConsNovaFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 163;
    sliderAtivo = sliderVarConsNovaFreg16.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaFreg16);
} 

///////////////////////////// Fim Variação Construção Nova, em 2016 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2016, POR FREGUESIAS -------------------////

var minVarAmpliacoesFreg16 = 9999;
var maxVarAmpliacoesFreg16 = 0;

function CorVarTotalAmpliacoesFreg16_15(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9eaad7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalAmpliacoesFreg16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2016 e 2015, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarAmpliacoesFreg16(feature) {
    if(feature.properties.VarAmpl_16 <= minVarAmpliacoesFreg16){
        minVarAmpliacoesFreg16 = feature.properties.VarAmpl_16
    }
    if(feature.properties.VarAmpl_16 > maxVarAmpliacoesFreg16){
        maxVarAmpliacoesFreg16 = feature.properties.VarAmpl_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalAmpliacoesFreg16_15(feature.properties.VarAmpl_16)};
    }


function apagarVarAmpliacoesFreg16(e) {
    VarAmpliacoesFreg16.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesFreg16(feature, layer) {
    if (feature.properties.VarAmpl_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesFreg16,
    });
}
var VarAmpliacoesFreg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarAmpliacoesFreg16,
    onEachFeature: onEachFeatureVarAmpliacoesFreg16
});

let slideVarAmpliacoesFreg16 = function(){
    var sliderVarAmpliacoesFreg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 164){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesFreg16, {
        start: [minVarAmpliacoesFreg16, maxVarAmpliacoesFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesFreg16,
            'max': maxVarAmpliacoesFreg16
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesFreg16);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesFreg16.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesFreg16.noUiSlider.on('update',function(e){
        VarAmpliacoesFreg16.eachLayer(function(layer){
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
        sliderVarAmpliacoesFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 164;
    sliderAtivo = sliderVarAmpliacoesFreg16.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesFreg16);
} 

///////////////////////////// Fim Variação Ampliações, em 2016 , POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação Total, em 2017, POR FREGUESIAS -------------------////

var minVarTotalEdiFreg17 = 9999;
var maxVarTotalEdiFreg17 = 0;

function CorVarTotalEdiFreg17_16(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalEdiFreg17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2017 e 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalEdiFreg17(feature) {
    if(feature.properties.VarObra_17 <= minVarTotalEdiFreg17){
        minVarTotalEdiFreg17 = feature.properties.VarObra_17
    }
    if(feature.properties.VarObra_17 > maxVarTotalEdiFreg17){
        maxVarTotalEdiFreg17 = feature.properties.VarObra_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiFreg17_16(feature.properties.VarObra_17)};
    }


function apagarVarTotalEdiFreg17(e) {
    VarTotalEdiFreg17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiFreg17(feature, layer) {
    if (feature.properties.VarObra_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiFreg17,
    });
}
var VarTotalEdiFreg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalEdiFreg17,
    onEachFeature: onEachFeatureVarTotalEdiFreg17
});

let slideVarTotalEdiFreg17 = function(){
    var sliderVarTotalEdiFreg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 167){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiFreg17, {
        start: [minVarTotalEdiFreg17, maxVarTotalEdiFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiFreg17,
            'max': maxVarTotalEdiFreg17
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiFreg17);
    inputNumberMax.setAttribute("value",maxVarTotalEdiFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiFreg17.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiFreg17.noUiSlider.on('update',function(e){
        VarTotalEdiFreg17.eachLayer(function(layer){
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
        sliderVarTotalEdiFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 167;
    sliderAtivo = sliderVarTotalEdiFreg17.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiFreg17);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2017 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2017, POR FREGUESIAS -------------------////

var minVarConsNovaFreg17 = 9999;
var maxVarConsNovaFreg17 = 0;

function CorVarTotalConsNovaFreg17_16(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalConsNovaFreg17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2017 e 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarConsNovaFreg17(feature) {
    if(feature.properties.VarCons_17 <= minVarConsNovaFreg17){
        minVarConsNovaFreg17 = feature.properties.VarCons_17
    }
    if(feature.properties.VarCons_17 > maxVarConsNovaFreg17){
        maxVarConsNovaFreg17 = feature.properties.VarCons_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaFreg17_16(feature.properties.VarCons_17)};
    }


function apagarVarConsNovaFreg17(e) {
    VarConsNovaFreg17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaFreg17(feature, layer) {
    if (feature.properties.VarCons_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaFreg17,
    });
}
var VarConsNovaFreg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarConsNovaFreg17,
    onEachFeature: onEachFeatureVarConsNovaFreg17
});

let slideVarConsNovaFreg17 = function(){
    var sliderVarConsNovaFreg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 168){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaFreg17, {
        start: [minVarConsNovaFreg17, maxVarConsNovaFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaFreg17,
            'max': maxVarConsNovaFreg17
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaFreg17);
    inputNumberMax.setAttribute("value",maxVarConsNovaFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaFreg17.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaFreg17.noUiSlider.on('update',function(e){
        VarConsNovaFreg17.eachLayer(function(layer){
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
        sliderVarConsNovaFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 168;
    sliderAtivo = sliderVarConsNovaFreg17.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaFreg17);
} 

///////////////////////////// Fim Variação Construção Nova, em 2017 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2017, POR FREGUESIAS -------------------////

var minVarAmpliacoesFreg17 = 9999;
var maxVarAmpliacoesFreg17 = 0;

function CorVarTotalAmpliacoesFreg17_16(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalAmpliacoesFreg17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2017 e 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesFreg17(feature) {
    if(feature.properties.VarAmpl_17 <= minVarAmpliacoesFreg17){
        minVarAmpliacoesFreg17 = feature.properties.VarAmpl_17
    }
    if(feature.properties.VarAmpl_17 > maxVarAmpliacoesFreg17){
        maxVarAmpliacoesFreg17 = feature.properties.VarAmpl_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalAmpliacoesFreg17_16(feature.properties.VarAmpl_17)};
    }


function apagarVarAmpliacoesFreg17(e) {
    VarAmpliacoesFreg17.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesFreg17(feature, layer) {
    if (feature.properties.VarAmpl_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesFreg17,
    });
}
var VarAmpliacoesFreg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarAmpliacoesFreg17,
    onEachFeature: onEachFeatureVarAmpliacoesFreg17
});

let slideVarAmpliacoesFreg17 = function(){
    var sliderVarAmpliacoesFreg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 169){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesFreg17, {
        start: [minVarAmpliacoesFreg17, maxVarAmpliacoesFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesFreg17,
            'max': maxVarAmpliacoesFreg17
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesFreg17);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesFreg17.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesFreg17.noUiSlider.on('update',function(e){
        VarAmpliacoesFreg17.eachLayer(function(layer){
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
        sliderVarAmpliacoesFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 169;
    sliderAtivo = sliderVarAmpliacoesFreg17.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesFreg17);
} 

///////////////////////////// Fim Variação Ampliações, em 2017 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2018, POR FREGUESIAS -------------------////

var minVarTotalEdiFreg18 = 9999;
var maxVarTotalEdiFreg18 = 0;

function CorVarTotalEdiFreg18_17(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalEdiFreg18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2018 e 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalEdiFreg18(feature) {
    if(feature.properties.VarObra_18 <= minVarTotalEdiFreg18){
        minVarTotalEdiFreg18 = feature.properties.VarObra_18
    }
    if(feature.properties.VarObra_18 > maxVarTotalEdiFreg18){
        maxVarTotalEdiFreg18 = feature.properties.VarObra_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiFreg18_17(feature.properties.VarObra_18)};
    }


function apagarVarTotalEdiFreg18(e) {
    VarTotalEdiFreg18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiFreg18(feature, layer) {
    if (feature.properties.VarObra_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiFreg18,
    });
}
var VarTotalEdiFreg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalEdiFreg18,
    onEachFeature: onEachFeatureVarTotalEdiFreg18
});

let slideVarTotalEdiFreg18 = function(){
    var sliderVarTotalEdiFreg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 172){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiFreg18, {
        start: [minVarTotalEdiFreg18, maxVarTotalEdiFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiFreg18,
            'max': maxVarTotalEdiFreg18
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiFreg18);
    inputNumberMax.setAttribute("value",maxVarTotalEdiFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiFreg18.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiFreg18.noUiSlider.on('update',function(e){
        VarTotalEdiFreg18.eachLayer(function(layer){
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
        sliderVarTotalEdiFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 172;
    sliderAtivo = sliderVarTotalEdiFreg18.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiFreg18);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2018 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2018, POR FREGUESIAS -------------------////

var minVarConsNovaFreg18 = 9999;
var maxVarConsNovaFreg18 = 0;

function CorVarTotalConsNovaFreg18_17(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalConsNovaFreg18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2018 e 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarConsNovaFreg18(feature) {
    if(feature.properties.VarCons_18 <= minVarConsNovaFreg18){
        minVarConsNovaFreg18 = feature.properties.VarCons_18
    }
    if(feature.properties.VarCons_18 > maxVarConsNovaFreg18){
        maxVarConsNovaFreg18 = feature.properties.VarCons_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaFreg18_17(feature.properties.VarCons_18)};
    }


function apagarVarConsNovaFreg18(e) {
    VarConsNovaFreg18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaFreg18(feature, layer) {
    if (feature.properties.VarCons_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaFreg18,
    });
}
var VarConsNovaFreg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarConsNovaFreg18,
    onEachFeature: onEachFeatureVarConsNovaFreg18
});

let slideVarConsNovaFreg18 = function(){
    var sliderVarConsNovaFreg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 173){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaFreg18, {
        start: [minVarConsNovaFreg18, maxVarConsNovaFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaFreg18,
            'max': maxVarConsNovaFreg18
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaFreg18);
    inputNumberMax.setAttribute("value",maxVarConsNovaFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaFreg18.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaFreg18.noUiSlider.on('update',function(e){
        VarConsNovaFreg18.eachLayer(function(layer){
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
        sliderVarConsNovaFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 173;
    sliderAtivo = sliderVarConsNovaFreg18.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaFreg18);
} 

///////////////////////////// Fim Variação Construção Nova, em 2018 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2018, POR FREGUESIAS -------------------////

var minVarAmpliacoesFreg18 = 9999;
var maxVarAmpliacoesFreg18 = 0;

function CorVarTotalAmpliacoesFreg18_17(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalAmpliacoesFreg18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2018 e 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesFreg18(feature) {
    if(feature.properties.VarAmpl_18 <= minVarAmpliacoesFreg18){
        minVarAmpliacoesFreg18 = feature.properties.VarAmpl_18
    }
    if(feature.properties.VarAmpl_18 > maxVarAmpliacoesFreg18){
        maxVarAmpliacoesFreg18 = feature.properties.VarAmpl_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalAmpliacoesFreg18_17(feature.properties.VarAmpl_18)};
    }


function apagarVarAmpliacoesFreg18(e) {
    VarAmpliacoesFreg18.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesFreg18(feature, layer) {
    if (feature.properties.VarAmpl_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesFreg18,
    });
}
var VarAmpliacoesFreg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarAmpliacoesFreg18,
    onEachFeature: onEachFeatureVarAmpliacoesFreg18
});

let slideVarAmpliacoesFreg18 = function(){
    var sliderVarAmpliacoesFreg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 174){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesFreg18, {
        start: [minVarAmpliacoesFreg18, maxVarAmpliacoesFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesFreg18,
            'max': maxVarAmpliacoesFreg18
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesFreg18);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesFreg18.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesFreg18.noUiSlider.on('update',function(e){
        VarAmpliacoesFreg18.eachLayer(function(layer){
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
        sliderVarAmpliacoesFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 174;
    sliderAtivo = sliderVarAmpliacoesFreg18.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesFreg18);
} 

///////////////////////////// Fim Variação Ampliações, em 2018 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2019, POR FREGUESIAS -------------------////

var minVarTotalEdiFreg19 = 9999;
var maxVarTotalEdiFreg19 = 0;

function CorVarTotalEdiFreg19_18(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalEdiFreg19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2019 e 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarTotalEdiFreg19(feature) {
    if(feature.properties.VarObra_19 <= minVarTotalEdiFreg19){
        minVarTotalEdiFreg19 = feature.properties.VarObra_19
    }
    if(feature.properties.VarObra_19 > maxVarTotalEdiFreg19){
        maxVarTotalEdiFreg19 = feature.properties.VarObra_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiFreg19_18(feature.properties.VarObra_19)};
    }


function apagarVarTotalEdiFreg19(e) {
    VarTotalEdiFreg19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiFreg19(feature, layer) {
    if (feature.properties.VarObra_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiFreg19,
    });
}
var VarTotalEdiFreg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalEdiFreg19,
    onEachFeature: onEachFeatureVarTotalEdiFreg19
});

let slideVarTotalEdiFreg19 = function(){
    var sliderVarTotalEdiFreg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 177){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiFreg19, {
        start: [minVarTotalEdiFreg19, maxVarTotalEdiFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiFreg19,
            'max': maxVarTotalEdiFreg19
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiFreg19);
    inputNumberMax.setAttribute("value",maxVarTotalEdiFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiFreg19.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiFreg19.noUiSlider.on('update',function(e){
        VarTotalEdiFreg19.eachLayer(function(layer){
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
        sliderVarTotalEdiFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 177;
    sliderAtivo = sliderVarTotalEdiFreg19.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiFreg19);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2019 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2019, POR FREGUESIAS -------------------////

var minVarConsNovaFreg19 = 9999;
var maxVarConsNovaFreg19 = 0;

function CorVarTotalConsNovaFreg19_18(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalConsNovaFreg19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2019 e 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarConsNovaFreg19(feature) {
    if(feature.properties.VarCons_19 <= minVarConsNovaFreg19){
        minVarConsNovaFreg19 = feature.properties.VarCons_19
    }
    if(feature.properties.VarCons_19 > maxVarConsNovaFreg19){
        maxVarConsNovaFreg19 = feature.properties.VarCons_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaFreg19_18(feature.properties.VarCons_19)};
    }


function apagarVarConsNovaFreg19(e) {
    VarConsNovaFreg19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaFreg19(feature, layer) {
    if (feature.properties.VarCons_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaFreg19,
    });
}
var VarConsNovaFreg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarConsNovaFreg19,
    onEachFeature: onEachFeatureVarConsNovaFreg19
});

let slideVarConsNovaFreg19 = function(){
    var sliderVarConsNovaFreg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 178){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaFreg19, {
        start: [minVarConsNovaFreg19, maxVarConsNovaFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaFreg19,
            'max': maxVarConsNovaFreg19
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaFreg19);
    inputNumberMax.setAttribute("value",maxVarConsNovaFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaFreg19.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaFreg19.noUiSlider.on('update',function(e){
        VarConsNovaFreg19.eachLayer(function(layer){
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
        sliderVarConsNovaFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 178;
    sliderAtivo = sliderVarConsNovaFreg19.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaFreg19);
} 

///////////////////////////// Fim Variação Construção Nova, em 2019 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2019, POR FREGUESIAS -------------------////

var minVarAmpliacoesFreg19 = 9999;
var maxVarAmpliacoesFreg19 = 0;

function CorVarTotalAmpliacoesFreg19_18(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalAmpliacoesFreg19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2019 e 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesFreg19(feature) {
    if(feature.properties.VarAmpl_19 <= minVarAmpliacoesFreg19 ){
        minVarAmpliacoesFreg19 = feature.properties.VarAmpl_19
    }
    if(feature.properties.VarAmpl_19 > maxVarAmpliacoesFreg19 ){
        maxVarAmpliacoesFreg19 = feature.properties.VarAmpl_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalAmpliacoesFreg19_18(feature.properties.VarAmpl_19)};
    }


function apagarVarAmpliacoesFreg19(e) {
    VarAmpliacoesFreg19.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesFreg19(feature, layer) {
    if (feature.properties.VarAmpl_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesFreg19,
    });
}
var VarAmpliacoesFreg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarAmpliacoesFreg19,
    onEachFeature: onEachFeatureVarAmpliacoesFreg19
});

let slideVarAmpliacoesFreg19 = function(){
    var sliderVarAmpliacoesFreg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 179){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesFreg19, {
        start: [minVarAmpliacoesFreg19, maxVarAmpliacoesFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesFreg19,
            'max': maxVarAmpliacoesFreg19
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesFreg19);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesFreg19.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesFreg19.noUiSlider.on('update',function(e){
        VarAmpliacoesFreg19.eachLayer(function(layer){
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
        sliderVarAmpliacoesFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 179;
    sliderAtivo = sliderVarAmpliacoesFreg19.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesFreg19);
} 

///////////////////////////// Fim Variação Ampliações, em 2019 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Total, em 2020, POR FREGUESIAS -------------------////

var minVarTotalEdiFreg20 = 9999;
var maxVarTotalEdiFreg20 = 0;

function CorVarTotalEdiFreg20_19(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#9ebbd7' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalEdiFreg20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados, entre 2020 e 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotalEdiFreg20(feature) {
    if(feature.properties.VarObra_20 <= minVarTotalEdiFreg20){
        minVarTotalEdiFreg20 = feature.properties.VarObra_20
    }
    if(feature.properties.VarObra_20 > maxVarTotalEdiFreg20){
        maxVarTotalEdiFreg20 = feature.properties.VarObra_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalEdiFreg20_19(feature.properties.VarObra_20)};
    }


function apagarVarTotalEdiFreg20(e) {
    VarTotalEdiFreg20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotalEdiFreg20(feature, layer) {
    if (feature.properties.VarObra_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarObra_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotalEdiFreg20,
    });
}
var VarTotalEdiFreg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarTotalEdiFreg20,
    onEachFeature: onEachFeatureVarTotalEdiFreg20
});

let slideVarTotalEdiFreg20 = function(){
    var sliderVarTotalEdiFreg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 182){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotalEdiFreg20, {
        start: [minVarTotalEdiFreg20, maxVarTotalEdiFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotalEdiFreg20,
            'max': maxVarTotalEdiFreg20
        },
        });
    inputNumberMin.setAttribute("value",minVarTotalEdiFreg20);
    inputNumberMax.setAttribute("value",maxVarTotalEdiFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotalEdiFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotalEdiFreg20.noUiSlider.set([null, this.value]);
    });

    sliderVarTotalEdiFreg20.noUiSlider.on('update',function(e){
        VarTotalEdiFreg20.eachLayer(function(layer){
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
        sliderVarTotalEdiFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 182;
    sliderAtivo = sliderVarTotalEdiFreg20.noUiSlider;
    $(slidersGeral).append(sliderVarTotalEdiFreg20);
} 

///////////////////////////// Fim VARIAÇÃO TOTAL, em 2020 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Construção Nova, em 2020, POR FREGUESIAS -------------------////

var minVarConsNovaFreg20 = 9999;
var maxVarConsNovaFreg20 = 0;

function CorVarTotalConsNovaFreg20_19(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalConsNovaFreg20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Construção nova, entre 2020 e 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarConsNovaFreg20(feature) {
    if(feature.properties.VarCons_20 <= minVarConsNovaFreg20 ){
        minVarConsNovaFreg20 = feature.properties.VarCons_20
    }
    if(feature.properties.VarCons_20 > maxVarConsNovaFreg20 ){
        maxVarConsNovaFreg20 = feature.properties.VarCons_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalConsNovaFreg20_19(feature.properties.VarCons_20)};
    }


function apagarVarConsNovaFreg20(e) {
    VarConsNovaFreg20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarConsNovaFreg20(feature, layer) {
    if (feature.properties.VarCons_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarCons_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarConsNovaFreg20,
    });
}
var VarConsNovaFreg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarConsNovaFreg20,
    onEachFeature: onEachFeatureVarConsNovaFreg20
});

let slideVarConsNovaFreg20 = function(){
    var sliderVarConsNovaFreg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 183){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarConsNovaFreg20, {
        start: [minVarConsNovaFreg20, maxVarConsNovaFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarConsNovaFreg20,
            'max': maxVarConsNovaFreg20
        },
        });
    inputNumberMin.setAttribute("value",minVarConsNovaFreg20);
    inputNumberMax.setAttribute("value",maxVarConsNovaFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarConsNovaFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarConsNovaFreg20.noUiSlider.set([null, this.value]);
    });

    sliderVarConsNovaFreg20.noUiSlider.on('update',function(e){
        VarConsNovaFreg20.eachLayer(function(layer){
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
        sliderVarConsNovaFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 183;
    sliderAtivo = sliderVarConsNovaFreg20.noUiSlider;
    $(slidersGeral).append(sliderVarConsNovaFreg20);
} 

///////////////////////////// Fim Variação Construção Nova, em 2020 , POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação Ampliações, em 2020, POR FREGUESIAS -------------------////

var minVarAmpliacoesFreg20 = 9999;
var maxVarAmpliacoesFreg20 = 0;

function CorVarTotalAmpliacoesFreg20_19(d){
    return d == null ? '#808080' :
        d >= 100  ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 0  ? '#f5b3be' :
        d >= -50  ? '#2288bf' :
        d >= -101   ? '#0b2c40' :
                ''  ;
}

var legendaVarTotalAmpliacoesFreg20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>") 
    $('#tituloMapa').html(' <strong>' + 'Variação do Total de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, entre 2020 e 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -100 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Não aplicável' + '<br>'

    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAmpliacoesFreg20(feature) {
    if(feature.properties.VarAmpl_20 <= minVarAmpliacoesFreg20){
        minVarAmpliacoesFreg20 = feature.properties.VarAmpl_20
    }
    if(feature.properties.VarAmpl_20 > maxVarAmpliacoesFreg20){
        maxVarAmpliacoesFreg20 = feature.properties.VarAmpl_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalAmpliacoesFreg20_19(feature.properties.VarAmpl_20)};
    }


function apagarVarAmpliacoesFreg20(e) {
    VarAmpliacoesFreg20.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAmpliacoesFreg20(feature, layer) {
    if (feature.properties.VarAmpl_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + 'Não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarAmpl_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAmpliacoesFreg20,
    });
}
var VarAmpliacoesFreg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarAmpliacoesFreg20,
    onEachFeature: onEachFeatureVarAmpliacoesFreg20
});

let slideVarAmpliacoesFreg20 = function(){
    var sliderVarAmpliacoesFreg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 184){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAmpliacoesFreg20, {
        start: [minVarAmpliacoesFreg20, maxVarAmpliacoesFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAmpliacoesFreg20,
            'max': maxVarAmpliacoesFreg20
        },
        });
    inputNumberMin.setAttribute("value",minVarAmpliacoesFreg20);
    inputNumberMax.setAttribute("value",maxVarAmpliacoesFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAmpliacoesFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAmpliacoesFreg20.noUiSlider.set([null, this.value]);
    });

    sliderVarAmpliacoesFreg20.noUiSlider.on('update',function(e){
        VarAmpliacoesFreg20.eachLayer(function(layer){
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
        sliderVarAmpliacoesFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 184;
    sliderAtivo = sliderVarAmpliacoesFreg20.noUiSlider;
    $(slidersGeral).append(sliderVarAmpliacoesFreg20);
} 

///////////////////////////// Fim Variação Ampliações, em 2020 , POR FREGUESIAS -------------- \\\\\



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
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2014, por concelho.' + '</strong>')
        legendaExcecao(maxTotalEdificiosConc14, ((maxTotalEdificiosConc14-minTotalEdificiosConc14)/2).toFixed(0),minTotalEdificiosConc14,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc14();
        naoDuplicar = 1;
    }
    if (layer == TotalEdificiosConc14 && naoDuplicar == 1){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2014, por concelho.' + '</strong>')
        contorno.addTo(map);
    }
    if (layer == EdificiosConsNovaConc14 && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2014, por concelho.' + '</strong>')
        legendaExcecao(maxEdificiosConsNovaConc14, ((maxEdificiosConsNovaConc14-minEdificiosConsNovaConc14)/2).toFixed(0),minEdificiosConsNovaConc14,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc14();
        naoDuplicar = 2;
    }
    if (layer == EdificiosAmpliacoesConc14 && naoDuplicar != 3){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2014, por concelho.' + '</strong>')
        legendaExcecao(maxEdificiosAmpliacoesConc14, ((maxEdificiosAmpliacoesConc14-minEdificiosAmpliacoesConc14)/2).toFixed(0),minEdificiosAmpliacoesConc14,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacoesConc14();
        naoDuplicar = 3;
    }
    if (layer == TotalEdificiosConc15 && naoDuplicar != 6){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2015, por concelho.' + '</strong>')
        legendaExcecao(maxTotalEdificiosConc15, ((maxTotalEdificiosConc15-minTotalEdificiosConc15)/2).toFixed(0),minTotalEdificiosConc15,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc15();
        naoDuplicar = 6;
    }
    if (layer == EdificiosConsNovaConc15 && naoDuplicar != 7){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2015, por concelho.' + '</strong>')
        legenda(maxEdificiosConsNovaConc15, ((maxEdificiosConsNovaConc15-minEdificiosConsNovaConc15)/2).toFixed(0),minEdificiosConsNovaConc15,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc15();
        naoDuplicar = 7;
    }
    if (layer == EdificiosAmpliacoesConc15 && naoDuplicar != 8){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2015, por concelho.' + '</strong>')
        legendaExcecao(maxEdificiosAmpliacoesConc15, ((maxEdificiosAmpliacoesConc15-minEdificiosAmpliacoesConc15)/2).toFixed(0),minEdificiosAmpliacoesConc15,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacoesConc15();
        naoDuplicar = 8;
    }
    if (layer == TotalEdificiosConc16 && naoDuplicar != 11){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2016, por concelho.' + '</strong>')
        legenda(maxTotalEdificiosConc16, ((maxTotalEdificiosConc16-minTotalEdificiosConc16)/2).toFixed(0),minTotalEdificiosConc16,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc16();
        naoDuplicar = 11;
    }
    if (layer == EdificiosConsNovaConc16 && naoDuplicar != 12){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2016, por concelho.' + '</strong>')
        legenda(maxEdificiosConsNovaConc16, ((maxEdificiosConsNovaConc16-minEdificiosConsNovaConc16)/2).toFixed(0),minEdificiosConsNovaConc16,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc16();
        naoDuplicar = 12;
    }
    if (layer == EdificiosAmpliacoesConc16 && naoDuplicar != 13){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2016, por concelho.' + '</strong>')
        legenda(maxEdificiosAmpliacoesConc16, ((maxEdificiosAmpliacoesConc16-minEdificiosAmpliacoesConc16)/2).toFixed(0),minEdificiosAmpliacoesConc16,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacoesConc16();
        naoDuplicar = 13;
    }
    if (layer == TotalEdificiosConc17 && naoDuplicar != 16){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2017, por concelho.' + '</strong>')
        legenda(maxTotalEdificiosConc17, ((maxTotalEdificiosConc17-minTotalEdificiosConc17)/2).toFixed(0),minTotalEdificiosConc17,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc17();
        naoDuplicar = 16;
    }
    if (layer == EdificiosConsNovaConc17 && naoDuplicar != 17){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2017, por concelho.' + '</strong>')
        legenda(maxEdificiosConsNovaConc17, ((maxEdificiosConsNovaConc17-minEdificiosConsNovaConc17)/2).toFixed(0),minEdificiosConsNovaConc17,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc17();
        naoDuplicar = 17;
    }
    if (layer == EdificiosAmpliacoesConc17 && naoDuplicar != 18){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2017, por concelho.' + '</strong>')
        legenda(maxEdificiosAmpliacoesConc17, ((maxEdificiosAmpliacoesConc17-minEdificiosAmpliacoesConc17)/2).toFixed(0),minEdificiosAmpliacoesConc17,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacoesConc17();
        naoDuplicar = 18;
    }
    if (layer == TotalEdificiosConc18 && naoDuplicar != 21){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2018, por concelho.' + '</strong>')
        legenda(maxTotalEdificiosConc18, ((maxTotalEdificiosConc18-minTotalEdificiosConc18)/2).toFixed(0),minTotalEdificiosConc18,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc18();
        naoDuplicar = 21;
    }
    if (layer == EdificiosConsNovaConc18 && naoDuplicar != 22){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2018, por concelho.' + '</strong>')
        legenda(maxEdificiosConsNovaConc18, ((maxEdificiosConsNovaConc18-minEdificiosConsNovaConc18)/2).toFixed(0),minEdificiosConsNovaConc18,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc18();
        naoDuplicar = 22;
    }
    if (layer == EdificiosAmpliacoesConc18 && naoDuplicar != 23){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2018, por concelho.' + '</strong>')
        legenda(maxEdificiosAmpliacoesConc18, ((maxEdificiosAmpliacoesConc18-minEdificiosAmpliacoesConc18)/2).toFixed(0),minEdificiosAmpliacoesConc18,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacoesConc18();
        naoDuplicar = 23;
    }

    if (layer == TotalEdificiosConc19 && naoDuplicar != 26){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2019, por concelho.' + '</strong>')
        legenda(maxTotalEdificiosConc19, ((maxTotalEdificiosConc19-minTotalEdificiosConc19)/2).toFixed(0),minTotalEdificiosConc19,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc19();
        naoDuplicar = 26;
    }
    if (layer == EdificiosConsNovaConc19 && naoDuplicar != 27){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2019, por concelho.' + '</strong>')
        legenda(maxEdificiosConsNovaConc19, ((maxEdificiosConsNovaConc19-minEdificiosConsNovaConc19)/2).toFixed(0),minEdificiosConsNovaConc19,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc19();
        naoDuplicar = 27;
    }
    if (layer == EdificiosAmpliacoesConc19 && naoDuplicar != 28){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2019, por concelho.' + '</strong>')
        legenda(maxEdificiosAmpliacoesConc19, ((maxEdificiosAmpliacoesConc19-minEdificiosAmpliacoesConc19)/2).toFixed(0),minEdificiosAmpliacoesConc19,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacoesConc19();
        naoDuplicar = 28;
    }
    if (layer == TotalEdificiosConc20 && naoDuplicar != 31){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2020, por concelho.' + '</strong>')
        legenda(maxTotalEdificiosConc20, ((maxTotalEdificiosConc20-minTotalEdificiosConc20)/2).toFixed(0),minTotalEdificiosConc20,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalEdificiosConc20();
        naoDuplicar = 31;
    }
    if (layer == EdificiosConsNovaConc20 && naoDuplicar != 32){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2020, por concelho.' + '</strong>')
        legenda(maxEdificiosConsNovaConc20, ((maxEdificiosConsNovaConc20-minEdificiosConsNovaConc20)/2).toFixed(0),minEdificiosConsNovaConc20,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosConsNovaConc20();
        naoDuplicar = 32;
    }
    if (layer == EdificiosAmpliacoesConc20 && naoDuplicar != 33){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2020, por concelho.' + '</strong>')
        legenda(maxEdificiosAmpliacoesConc20, ((maxEdificiosAmpliacoesConc20-minEdificiosAmpliacoesConc20)/2).toFixed(0),minEdificiosAmpliacoesConc20,1.8);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideEdificiosAmpliacoesConc20();
        naoDuplicar = 33;
    }
    if (layer == PerConsNovaConc14 && naoDuplicar != 36){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2014, por concelho.' + '</strong>');
        legendaPerConsNovaConc();
        slidePerConsNovaConc14();
        naoDuplicar = 36;
    }
    if (layer == PerAmpliacoesConc14 && naoDuplicar != 37){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2014, por concelho.' + '</strong>');
        legendaPerAmpliacaoConc();
        slidePerAmpliacoesConc14();
        naoDuplicar = 37;
    }
    if (layer == PerConsNovaConc15 && naoDuplicar != 40){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2015, por concelho.' + '</strong>')
        legendaPerConsNovaConc();
        slidePerConsNovaConc15();
        naoDuplicar = 40;
    }
    if (layer == PerAmpliacoesConc15 && naoDuplicar != 41){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2015, por concelho.' + '</strong>');
        legendaPerAmpliacaoConc();
        slidePerAmpliacoesConc15();
        naoDuplicar = 41;
    }
    if (layer == PerConsNovaConc16 && naoDuplicar != 44){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2016, por concelho.' + '</strong>')
        legendaPerConsNovaConc();
        slidePerConsNovaConc16();
        naoDuplicar = 44;
    }
    if (layer == PerAmpliacoesConc16 && naoDuplicar != 45){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2016, por concelho.' + '</strong>');
        legendaPerAmpliacaoConc();
        slidePerAmpliacoesConc16();
        naoDuplicar = 45;
    }
    if (layer == PerConsNovaConc17 && naoDuplicar != 48){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2017, por concelho.' + '</strong>')
        legendaPerConsNovaConc();
        slidePerConsNovaConc17();
        naoDuplicar = 48;
    }
    if (layer == PerAmpliacoesConc17 && naoDuplicar != 49){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2017, por concelho.' + '</strong>');
        legendaPerAmpliacaoConc();
        slidePerAmpliacoesConc17();
        naoDuplicar = 49;
    }
    if (layer == PerConsNovaConc18 && naoDuplicar != 52){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2018, por concelho.' + '</strong>')
        legendaPerConsNovaConc();
        slidePerConsNovaConc18();
        naoDuplicar = 52;
    }
    if (layer == PerAmpliacoesConc18 && naoDuplicar != 53){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2018, por concelho.' + '</strong>');
        legendaPerAmpliacaoConc();
        slidePerAmpliacoesConc18();
        naoDuplicar = 53;
    }
    if (layer == PerConsNovaConc19 && naoDuplicar != 56){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2019, por concelho.' + '</strong>')
        legendaPerConsNovaConc();
        slidePerConsNovaConc19();
        naoDuplicar = 56;
    }
    if (layer == PerAmpliacoesConc19 && naoDuplicar != 57){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2019, por concelho.' + '</strong>');
        legendaPerAmpliacaoConc();
        slidePerAmpliacoesConc19();
        naoDuplicar = 57;
    }
    if (layer == PerConsNovaConc20 && naoDuplicar != 60){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2020, por concelho.' + '</strong>')
        legendaPerConsNovaConc();
        slidePerConsNovaConc20();
        naoDuplicar = 60;
    }
    if (layer == PerAmpliacoesConc20 && naoDuplicar != 61){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2020, por concelho.' + '</strong>');
        legendaPerAmpliacaoConc();
        slidePerAmpliacoesConc20();
        naoDuplicar = 61;
    }
    if (layer == VarTotalEdiConc15 && naoDuplicar != 64){
        legendaVarTotalEdiConc15_14();
        slideVarTotalEdiConc15();
        naoDuplicar = 64;
    }
    if (layer == VarConsNovaConc15 && naoDuplicar != 65){
        legendaVarTotalConsNovaConc15_14();
        slideVarConsNovaConc15();
        naoDuplicar = 65;
    }
    if (layer == VarAmpliacoesConc15 && naoDuplicar != 66){
        legendaVarTotalAmpliacoesConc15_14();
        slideVarAmpliacoesConc15();
        naoDuplicar = 66;
    }
    if (layer == VarTotalEdiConc16 && naoDuplicar != 69){
        legendaVarTotalEdiConc16_15();
        slideVarTotalEdiConc16();
        naoDuplicar = 69;
    }
    if (layer == VarConsNovaConc16 && naoDuplicar != 70){
        legendaVarTotalConsNovaConc16_15();
        slideVarConsNovaConc16();
        naoDuplicar = 70;
    }
    if (layer == VarAmpliacoesConc16 && naoDuplicar != 71){
        legendaVarTotalAmpliacoesConc16_15();
        slideVarAmpliacoesConc16();
        naoDuplicar = 71;
    }
    if (layer == VarTotalEdiConc17 && naoDuplicar != 74){
        legendaVarTotalEdiConc17_16();
        slideVarTotalEdiConc17();
        naoDuplicar = 74;
    }
    if (layer == VarConsNovaConc17 && naoDuplicar != 75){
        legendaVarTotalConsNovaConc17_16();
        slideVarConsNovaConc17();
        naoDuplicar = 75;
    }
    if (layer == VarAmpliacoesConc17 && naoDuplicar != 76){
        legendaVarTotalAmpliacoesConc17_16();
        slideVarAmpliacoesConc17();
        naoDuplicar = 76;
    }
    if (layer == VarTotalEdiConc18 && naoDuplicar != 79){
        legendaVarTotalEdiConc18_17();
        slideVarTotalEdiConc18();
        naoDuplicar = 79;
    }
    if (layer == VarConsNovaConc18 && naoDuplicar != 80){
        legendaVarTotalConsNovaConc18_17();
        slideVarConsNovaConc18();
        naoDuplicar = 80;
    }
    if (layer == VarAmpliacoesConc18 && naoDuplicar != 81){
        legendaVarTotalAmpliacoesConc18_17();
        slideVarAmpliacoesConc18();
        naoDuplicar = 81;
    }
    if (layer == VarTotalEdiConc19 && naoDuplicar != 84){
        legendaVarTotalEdiConc19_18();
        slideVarTotalEdiConc19();
        naoDuplicar = 84;
    }
    if (layer == VarConsNovaConc19 && naoDuplicar != 85){
        legendaVarTotalConsNovaConc19_18();
        slideVarConsNovaConc19();
        naoDuplicar = 85;
    }
    if (layer == VarAmpliacoesConc19 && naoDuplicar != 86){
        legendaVarTotalAmpliacoesConc19_18();
        slideVarAmpliacoesConc19();
        naoDuplicar = 86;
    }
    if (layer == VarTotalEdiConc20 && naoDuplicar != 89){
        legendaVarTotalEdiConc20_19();
        slideVarTotalEdiConc20();
        naoDuplicar = 89;
    }
    if (layer == VarConsNovaConc20 && naoDuplicar != 90){
        legendaVarTotalConsNovaConc20_19();
        slideVarConsNovaConc20();
        naoDuplicar = 90;
    }
    if (layer == VarAmpliacoesConc20 && naoDuplicar != 91){
        legendaVarTotalAmpliacoesConc20_19();
        slideVarAmpliacoesConc20();
        naoDuplicar = 91;
    }
    if (layer == TotalEdificiosFreg14 && naoDuplicar != 94){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2014, por freguesia.' + '</strong>')
        legendaExcecao(maxTotalEdificiosFreg14, ((maxTotalEdificiosFreg14-minTotalEdificiosFreg14)/2).toFixed(0),minTotalEdificiosFreg14,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalEdificiosFreg14();
        naoDuplicar = 94;
    }
    if (layer == EdificiosConsNovaFreg14 && naoDuplicar != 95){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2014, por freguesia.' + '</strong>')
        legendaExcecao(maxEdificiosConsNovaFreg14, ((maxEdificiosConsNovaFreg14-minEdificiosConsNovaFreg14)/2).toFixed(0),minEdificiosConsNovaFreg14,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosConsNovaFreg14();
        naoDuplicar = 95;
    }
    if (layer == EdificiosAmpliacoesFreg14 && naoDuplicar != 96){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2014, por freguesia.' + '</strong>')
        legendaExcecao(maxEdificiosAmpliacoesFreg14, ((maxEdificiosAmpliacoesFreg14-minEdificiosAmpliacoesFreg14)/2).toFixed(0),minEdificiosAmpliacoesFreg14,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosAmpliacoesFreg14();
        naoDuplicar = 96;
    }
    if (layer == TotalEdificiosFreg15 && naoDuplicar != 99){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2015, por freguesia.' + '</strong>')
        legendaExcecao(maxTotalEdificiosFreg15, ((maxTotalEdificiosFreg15-minTotalEdificiosFreg15)/2).toFixed(0),minTotalEdificiosFreg15,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalEdificiosFreg15();
        naoDuplicar = 99;
    }
    if (layer == EdificiosConsNovaFreg15 && naoDuplicar != 100){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2015, por freguesia.' + '</strong>')
        legendaExcecao(maxEdificiosConsNovaFreg15, ((maxEdificiosConsNovaFreg15-minEdificiosConsNovaFreg15)/2).toFixed(0),minEdificiosConsNovaFreg15,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosConsNovaFreg15();
        naoDuplicar = 100;
    }
    if (layer == EdificiosAmpliacoesFreg15 && naoDuplicar != 101){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2015, por freguesia.' + '</strong>')
        legendaExcecao(maxEdificiosAmpliacoesFreg15, ((maxEdificiosAmpliacoesFreg15-minEdificiosAmpliacoesFreg15)/2).toFixed(0),minEdificiosAmpliacoesFreg15,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosAmpliacoesFreg15();
        naoDuplicar = 101;
    }
    if (layer == TotalEdificiosFreg16 && naoDuplicar != 104){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2016, por freguesia.' + '</strong>')
        legenda(maxTotalEdificiosFreg16, ((maxTotalEdificiosFreg16-minTotalEdificiosFreg16)/2).toFixed(0),minTotalEdificiosFreg16,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalEdificiosFreg16();
        naoDuplicar = 104;
    }
    if (layer == EdificiosConsNovaFreg16 && naoDuplicar != 105){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2016, por freguesia.' + '</strong>')
        legendaExcecao(maxEdificiosConsNovaFreg16, ((maxEdificiosConsNovaFreg16-minEdificiosConsNovaFreg16)/2).toFixed(0),minEdificiosConsNovaFreg16,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosConsNovaFreg16();
        naoDuplicar = 105;
    }
    if (layer == EdificiosAmpliacoesFreg16 && naoDuplicar != 106){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2016, por freguesia.' + '</strong>')
        legenda(maxEdificiosAmpliacoesFreg16, ((maxEdificiosAmpliacoesFreg16-minEdificiosAmpliacoesFreg16)/2).toFixed(0),minEdificiosAmpliacoesFreg16,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosAmpliacoesFreg16();
        naoDuplicar = 106;
    }
    if (layer == TotalEdificiosFreg17 && naoDuplicar != 109){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2017, por freguesia.' + '</strong>')
        legenda(maxTotalEdificiosFreg17, ((maxTotalEdificiosFreg17-minTotalEdificiosFreg17)/2).toFixed(0),minTotalEdificiosFreg17,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalEdificiosFreg17();
        naoDuplicar = 109;
    }
    if (layer == EdificiosConsNovaFreg17 && naoDuplicar != 110){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2017, por freguesia.' + '</strong>')
        legenda(maxEdificiosConsNovaFreg17, ((maxEdificiosConsNovaFreg17-minEdificiosConsNovaFreg17)/2).toFixed(0),minEdificiosConsNovaFreg17,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosConsNovaFreg17();
        naoDuplicar = 110;
    }
    if (layer == EdificiosAmpliacoesFreg17 && naoDuplicar != 111){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2017, por freguesia.' + '</strong>')
        legenda(maxEdificiosAmpliacoesFreg17, ((maxEdificiosAmpliacoesFreg17-minEdificiosAmpliacoesFreg17)/2).toFixed(0),minEdificiosAmpliacoesFreg17,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosAmpliacoesFreg17();
        naoDuplicar = 111;
    }
    if (layer == TotalEdificiosFreg18 && naoDuplicar != 114){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2018, por freguesia.' + '</strong>')
        legenda(maxTotalEdificiosFreg18, ((maxTotalEdificiosFreg18-minTotalEdificiosFreg18)/2).toFixed(0),minTotalEdificiosFreg18,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalEdificiosFreg18();
        naoDuplicar = 114;
    }
    if (layer == EdificiosConsNovaFreg18 && naoDuplicar != 115){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2018, por freguesia.' + '</strong>')
        legenda(maxEdificiosConsNovaFreg18, ((maxEdificiosConsNovaFreg18-minEdificiosConsNovaFreg18)/2).toFixed(0),minEdificiosConsNovaFreg18,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosConsNovaFreg18();
        naoDuplicar = 115;
    }
    if (layer == EdificiosAmpliacoesFreg18 && naoDuplicar != 116){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2018, por freguesia.' + '</strong>')
        legenda(maxEdificiosAmpliacoesFreg18, ((maxEdificiosAmpliacoesFreg18-minEdificiosAmpliacoesFreg18)/2).toFixed(0),minEdificiosAmpliacoesFreg18,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosAmpliacoesFreg18();
        naoDuplicar = 116;
    }
    if (layer == TotalEdificiosFreg19 && naoDuplicar != 119){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2019, por freguesia.' + '</strong>')
        legenda(maxTotalEdificiosFreg19, ((maxTotalEdificiosFreg19-minTotalEdificiosFreg19)/2).toFixed(0),minTotalEdificiosFreg19,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalEdificiosFreg19();
        naoDuplicar = 119;
    }
    if (layer == EdificiosConsNovaFreg19 && naoDuplicar != 120){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2019, por freguesia.' + '</strong>')
        legenda(maxEdificiosConsNovaFreg19, ((maxEdificiosConsNovaFreg19-minEdificiosConsNovaFreg19)/2).toFixed(0),minEdificiosConsNovaFreg19,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosConsNovaFreg19();
        naoDuplicar = 120;
    }
    if (layer == EdificiosAmpliacoesFreg19 && naoDuplicar != 121){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2019, por freguesia.' + '</strong>')
        legenda(maxEdificiosAmpliacoesFreg19, ((maxEdificiosAmpliacoesFreg19-minEdificiosAmpliacoesFreg19)/2).toFixed(0),minEdificiosAmpliacoesFreg19,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosAmpliacoesFreg19();
        naoDuplicar = 121;
    }
    if (layer == TotalEdificiosFreg20 && naoDuplicar != 124){
        $('#tituloMapa').html(' <strong>' + 'Total de edifícios licenciados, em 2020, por freguesia.' + '</strong>')
        legenda(maxTotalEdificiosFreg20, ((maxTotalEdificiosFreg20-minTotalEdificiosFreg20)/2).toFixed(0),minTotalEdificiosFreg20,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideTotalEdificiosFreg20();
        naoDuplicar = 124;
    }
    if (layer == EdificiosConsNovaFreg20 && naoDuplicar != 125){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Construção nova, em 2020, por freguesia.' + '</strong>')
        legenda(maxEdificiosConsNovaFreg20, ((maxEdificiosConsNovaFreg20-minEdificiosConsNovaFreg20)/2).toFixed(0),minEdificiosConsNovaFreg20,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosConsNovaFreg20();
        naoDuplicar = 125;
    }
    if (layer == EdificiosAmpliacoesFreg20 && naoDuplicar != 126){
        $('#tituloMapa').html(' <strong>' + 'Número de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2020, por freguesia.' + '</strong>')
        legenda(maxEdificiosAmpliacoesFreg20, ((maxEdificiosAmpliacoesFreg20-minEdificiosAmpliacoesFreg20)/2).toFixed(0),minEdificiosAmpliacoesFreg20,2);
        contornoFreg.addTo(map);
        baseAtiva = contornoFreg;
        slideEdificiosAmpliacoesFreg20();
        naoDuplicar = 126;
    }
    if (layer == PerConsFreg14 && naoDuplicar != 129){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2014, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerConsFreg14();
        naoDuplicar = 129;
    }
    if (layer == PerAmplFreg14 && naoDuplicar != 130){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2014, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerAmplFreg14();
        naoDuplicar = 130;
    }
    if (layer == PerConsFreg15 && naoDuplicar != 133){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2015, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerConsFreg15();
        naoDuplicar = 133;
    }
    if (layer == PerAmplFreg15 && naoDuplicar != 134){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2015, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerAmplFreg15();
        naoDuplicar = 134;
    }
    if (layer == PerConsFreg16 && naoDuplicar != 137){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2016, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerConsFreg16();
        naoDuplicar = 137;
    }
    if (layer == PerAmplFreg16 && naoDuplicar != 138){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2016, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerAmplFreg16();
        naoDuplicar = 138;
    }
    if (layer == PerConsFreg17 && naoDuplicar != 141){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2017, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerConsFreg17();
        naoDuplicar = 141;
    }
    if (layer == PerAmplFreg17 && naoDuplicar != 142){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2017, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerAmplFreg17();
        naoDuplicar = 142;
    }
    if (layer == PerConsFreg18 && naoDuplicar != 145){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2018, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerConsFreg18();
        naoDuplicar = 145;
    }
    if (layer == PerAmplFreg18 && naoDuplicar != 146){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2018, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerAmplFreg18();
        naoDuplicar = 146;
    }
    if (layer == PerConsFreg19 && naoDuplicar != 149){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2019, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerConsFreg19();
        naoDuplicar = 149;
    }
    if (layer == PerAmplFreg19 && naoDuplicar != 150){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2019, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerAmplFreg19();
        naoDuplicar = 150;
    }
    if (layer == PerConsFreg20 && naoDuplicar != 153){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Construção nova, em 2020, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerConsFreg20();
        naoDuplicar = 153;
    }
    if (layer == PerAmplFreg20 && naoDuplicar != 154){
        $('#tituloMapa').html(' <strong>' + 'Proporção de edifícios licenciados pelo tipo de obra: Ampliações, alterações e reconstruções, em 2020, por freguesia.' + '</strong>');
        legendaPerAmpliacaoFreg();
        slidePerAmplFreg20();
        naoDuplicar = 154;
    }
    if (layer == VarTotalEdiFreg15 && naoDuplicar != 157){
        legendaVarTotalEdiFreg15_14();
        slideVarTotalEdiFreg15();
        naoDuplicar = 157;
    }
    if (layer == VarConsNovaFreg15 && naoDuplicar != 158){
        legendaVarTotalConsNovaFreg15_14();
        slideVarConsNovaFreg15();
        naoDuplicar = 158;
    }
    if (layer == VarAmpliacoesFreg15 && naoDuplicar != 159){
        legendaVarTotalAmpliacoesFreg15_14();
        slideVarAmpliacoesFreg15();
        naoDuplicar = 159;
    }
    if (layer == VarTotalEdiFreg16 && naoDuplicar != 162){
        legendaVarTotalEdiFreg16_15();
        slideVarTotalEdiFreg16();
        naoDuplicar = 162;
    }
    if (layer == VarConsNovaFreg16 && naoDuplicar != 163){
        legendaVarTotalConsNovaFreg16_15();
        slideVarConsNovaFreg16();
        naoDuplicar = 163;
    }
    if (layer == VarAmpliacoesFreg16 && naoDuplicar != 164){
        legendaVarTotalAmpliacoesFreg16_15();
        slideVarAmpliacoesFreg16();
        naoDuplicar = 164;
    }
    if (layer == VarTotalEdiFreg17 && naoDuplicar != 167){
        legendaVarTotalEdiFreg17_16();
        slideVarTotalEdiFreg17();
        naoDuplicar = 167;
    }
    if (layer == VarConsNovaFreg17 && naoDuplicar != 168){
        legendaVarTotalConsNovaFreg17_16();
        slideVarConsNovaFreg17();
        naoDuplicar = 168;
    }
    if (layer == VarAmpliacoesFreg17 && naoDuplicar != 169){
        legendaVarTotalAmpliacoesFreg17_16();
        slideVarAmpliacoesFreg17();
        naoDuplicar = 169;
    }
    if (layer == VarTotalEdiFreg18 && naoDuplicar != 172){
        legendaVarTotalEdiFreg18_17();
        slideVarTotalEdiFreg18();
        naoDuplicar = 172;
    }
    if (layer == VarConsNovaFreg18 && naoDuplicar != 173){
        legendaVarTotalConsNovaFreg18_17();
        slideVarConsNovaFreg18();
        naoDuplicar = 173;
    }
    if (layer == VarAmpliacoesFreg18 && naoDuplicar != 174){
        legendaVarTotalAmpliacoesFreg18_17();
        slideVarAmpliacoesFreg18();
        naoDuplicar = 174;
    }
    if (layer == VarTotalEdiFreg19 && naoDuplicar != 177){
        legendaVarTotalEdiFreg19_18();
        slideVarTotalEdiFreg19();
        naoDuplicar = 177;
    }
    if (layer == VarConsNovaFreg19 && naoDuplicar != 178){
        legendaVarTotalConsNovaFreg20_19();
        slideVarConsNovaFreg19();
        naoDuplicar = 178;
    }
    if (layer == VarAmpliacoesFreg19 && naoDuplicar != 179){
        legendaVarTotalAmpliacoesFreg19_18();
        slideVarAmpliacoesFreg19();
        naoDuplicar = 179;
    }
    if (layer == VarTotalEdiFreg20 && naoDuplicar != 182){
        legendaVarTotalEdiFreg20_19();
        slideVarTotalEdiFreg20();
        naoDuplicar = 182;
    }
    if (layer == VarConsNovaFreg20 && naoDuplicar != 183){
        legendaVarTotalConsNovaFreg20_19();
        slideVarConsNovaFreg20();
        naoDuplicar = 183;
    }
    if (layer == VarAmpliacoesFreg20 && naoDuplicar != 184){
        legendaVarTotalAmpliacoesFreg20_19();
        slideVarAmpliacoesFreg20();
        naoDuplicar = 184;
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
                novaLayer(TotalEdificiosConc14)
            }
            if (ano == "2014" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc14)
                
            }
            if (ano == "2014" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesConc14)
                
            }    
            if (ano == "2015" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc15)
            }     
            if (ano == "2015" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc15)
                ;
            }
            if (ano == "2015" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesConc15);
                
            } 
            if (ano == "2016" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc16)
            }
            if (ano == "2016" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc16);
                
            }
            if (ano == "2016" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesConc16);
                
            } 
            if (ano == "2017" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc17)
            }
            if (ano == "2017" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc17);
                
            }
            if (ano == "2017" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesConc17);
                
            } 
            if (ano == "2018" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc18)
            }
            if (ano == "2018" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc18);
                
            }
            if (ano == "2018" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesConc18);
                
            } 
            if (ano == "2019" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc19)
            }
            if (ano == "2019" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc19);
                
            }
            if (ano == "2019" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesConc19);
                
            } 
            if (ano == "2020" && tipologia == "Total"){
                novaLayer(TotalEdificiosConc20)
            }
            if (ano == "2020" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaConc20);
                
            }
            if (ano == "2020" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesConc20);
                
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
                novaLayer(PerAmpliacoesConc14)
            }      
            if (ano == "2015" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc15)
            }
            if (ano == "2015" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacoesConc15)
            } 
            if (ano == "2016" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc16)
            }
            if (ano == "2016" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacoesConc16)
            } 
            if (ano == "2017" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc17)
            }
            if (ano == "2017" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacoesConc17)
            } 
            if (ano == "2018" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc18)
            }
            if (ano == "2018" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacoesConc18)
            } 
            if (ano == "2019" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc19)
            }
            if (ano == "2019" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacoesConc19)
            } 
            if (ano == "2020" && tipologia == "Construcao"){
                novaLayer(PerConsNovaConc20)
            }
            if (ano == "2020" && tipologia == "Ampliacao"){
                novaLayer(PerAmpliacoesConc20)
            } 
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if ($('#notaRodape').length){
                $('#notaRodape').remove();
            }
            if (ano == "2015" && tipologia == "Total"){
                novaLayer(VarTotalEdiConc15)
            }
            if (ano == "2015" && tipologia == "Construcao"){
                novaLayer(VarConsNovaConc15)
            }
            if (ano == "2015" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc15)
            }   
            if (ano == "2016" && tipologia == "Total"){
                novaLayer(VarTotalEdiConc16)
            }
            if (ano == "2016" && tipologia == "Construcao"){
                novaLayer(VarConsNovaConc16)
            }
            if (ano == "2016" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc16)
            } 
            if (ano == "2017" && tipologia == "Total"){
                novaLayer(VarTotalEdiConc17)
            }
            if (ano == "2017" && tipologia == "Construcao"){
                novaLayer(VarConsNovaConc17)
            }
            if (ano == "2017" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc17)
            } 
            if (ano == "2018" && tipologia == "Total"){
                novaLayer(VarTotalEdiConc18)
            }
            if (ano == "2018" && tipologia == "Construcao"){
                novaLayer(VarConsNovaConc18)
            }
            if (ano == "2018" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc18)
            } 
            if (ano == "2019" && tipologia == "Total"){
                novaLayer(VarTotalEdiConc19)
            }
            if (ano == "2019" && tipologia == "Construcao"){
                novaLayer(VarConsNovaConc19)
            }
            if (ano == "2019" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc19)
            } 
            if (ano == "2020" && tipologia == "Total"){
                novaLayer(VarTotalEdiConc20)
            }
            if (ano == "2020" && tipologia == "Construcao"){
                novaLayer(VarConsNovaConc20)
            }
            if (ano == "2020" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesConc20)
            }         
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if ($('#absoluto').hasClass('active5')){
            if (tipologia == "Total" || tipologia == "Construcao" || tipologia == "Ampliacao"){
                notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os dados' + '<b>' + ' à escala do concelho.'  + '</b>')
            }
            if (ano == "2014" && tipologia == "Total"){
                novaLayer(TotalEdificiosFreg14)
            }
            if (ano == "2014" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaFreg14)
            }
            if (ano == "2014" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesFreg14)
            }  
            if (ano == "2015" && tipologia == "Total"){
                novaLayer(TotalEdificiosFreg15)
            }     
            if (ano == "2015" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaFreg15)
            }
            if (ano == "2015" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesFreg15)
            } 
            if (ano == "2016" && tipologia == "Total"){
                novaLayer(TotalEdificiosFreg16);
            }
            if (ano == "2016" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaFreg16)
            }
            if (ano == "2016" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesFreg16)
            } 
            if (ano == "2017" && tipologia == "Total"){
                novaLayer(TotalEdificiosFreg17);
            }
            if (ano == "2017" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaFreg17)
            }
            if (ano == "2017" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesFreg17)
            } 
            if (ano == "2018" && tipologia == "Total"){
                novaLayer(TotalEdificiosFreg18);
            }
            if (ano == "2018" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaFreg18);
            }
            if (ano == "2018" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesFreg18);
            } 
            if (ano == "2019" && tipologia == "Total"){
                novaLayer(TotalEdificiosFreg19);
            }
            if (ano == "2019" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaFreg19)
            }
            if (ano == "2019" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesFreg19)
            } 
            if (ano == "2020" && tipologia == "Total"){
                novaLayer(TotalEdificiosFreg20);
            }
            if (ano == "2020" && tipologia == "Construcao"){
                novaLayer(EdificiosConsNovaFreg20)
            }
            if (ano == "2020" && tipologia == "Ampliacao"){
                novaLayer(EdificiosAmpliacoesFreg20)
            } 
        }
        if ($('#percentagem').hasClass('active5')){
            if ($('#notaRodape').length){
                $('#notaRodape').remove();
            }
            if (ano == "2014" && tipologia == "Construcao"){
                novaLayer(PerConsFreg14)
            }
            if (ano == "2014" && tipologia == "Ampliacao"){
                novaLayer(PerAmplFreg14)
            }         
            if (ano == "2015" && tipologia == "Construcao"){
                novaLayer(PerConsFreg15)
            }
            if (ano == "2015" && tipologia == "Ampliacao"){
                novaLayer(PerAmplFreg15)
            } 
            if (ano == "2016" && tipologia == "Construcao"){
                novaLayer(PerConsFreg16)
            }
            if (ano == "2016" && tipologia == "Ampliacao"){
                novaLayer(PerAmplFreg16)
            } 
            if (ano == "2017" && tipologia == "Construcao"){
                novaLayer(PerConsFreg17)
            }
            if (ano == "2017" && tipologia == "Ampliacao"){
                novaLayer(PerAmplFreg17)
            } 
            if (ano == "2018" && tipologia == "Construcao"){
                novaLayer(PerConsFreg18)
            }
            if (ano == "2018" && tipologia == "Ampliacao"){
                novaLayer(PerAmplFreg18)
            } 
            if (ano == "2019" && tipologia == "Construcao"){
                novaLayer(PerConsFreg19)
            }
            if (ano == "2019" && tipologia == "Ampliacao"){
                novaLayer(PerAmplFreg19)
            } 
            if (ano == "2020" && tipologia == "Construcao"){
                novaLayer(PerConsFreg20)
            }
            if (ano == "2020" && tipologia == "Ampliacao"){
                novaLayer(PerAmplFreg20)
            } 
        }
        if ($('#taxaVariacao').hasClass('active5')){
            if ($('#notaRodape').length){
                $('#notaRodape').remove();
            }
            if (ano == "2015" && tipologia == "Total"){
                novaLayer(VarTotalEdiFreg15)
            }
            if (ano == "2015" && tipologia == "Construcao"){
                novaLayer(VarConsNovaFreg15)
            }
            if (ano == "2015" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesFreg15)
            }     
            if (ano == "2016" && tipologia == "Total"){
                novaLayer(VarTotalEdiFreg16)
            }
            if (ano == "2016" && tipologia == "Construcao"){
                novaLayer(VarConsNovaFreg16)
            }
            if (ano == "2016" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesFreg16)
            } 
            if (ano == "2017" && tipologia == "Total"){
                novaLayer(VarTotalEdiFreg17)
            }
            if (ano == "2017" && tipologia == "Construcao"){
                novaLayer(VarConsNovaFreg17)
            }
            if (ano == "2017" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesFreg17)
            } 
            if (ano == "2018" && tipologia == "Total"){
                novaLayer(VarTotalEdiFreg18)
            }
            if (ano == "2018" && tipologia == "Construcao"){
                novaLayer(VarConsNovaFreg18)
            }
            if (ano == "2018" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesFreg18)
            } 
            if (ano == "2019" && tipologia == "Total"){
                novaLayer(VarTotalEdiFreg19)
            }
            if (ano == "2019" && tipologia == "Construcao"){
                novaLayer(VarConsNovaFreg19)
            }
            if (ano == "2019" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesFreg19)
            } 
            if (ano == "2020" && tipologia == "Total"){
                novaLayer(VarTotalEdiFreg20)
            }
            if (ano == "2020" && tipologia == "Construcao"){
                novaLayer(VarConsNovaFreg20)
            }
            if (ano == "2020" && tipologia == "Ampliacao"){
                novaLayer(VarAmpliacoesFreg20)
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
    $('#tituloMapa').html('Número de edifícios licenciados, segundo o tipo de obra, entre 2014 e 2020, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EdificiosLicenciadosProv.json", function(data){
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
    $('#tituloMapa').html('Proporção do número de edifícios licenciados, segundo o tipo de obra, entre 2014 e 2020, %.')
        $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EdificiosLicenciadosProv.json", function(data){
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
    $('#tituloMapa').html('Variação do número de edifícios licenciados, segundo o tipo de obra, entre 2014 e 2020, %.')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/EdificiosLicenciadosProv.json", function(data){
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
