
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'SEF, Relatórios estatísticos anuais.';
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
//////////////------------ ADICIONAR ORIENTAÇÃO

var Orientacao = L.control({position: "topleft"});
Orientacao.onAdd = function(map) {
    var div = L.DomUtil.create("div", "north");
    div.innerHTML = '<img src="../../../imagens/norte.png" alt="norte" height="40px" width="23px">';
    return div;
}
Orientacao.addTo(map);
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
contorno.addTo(map);
///// ---- Fim layer Concelhos --- \\\\

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

/////Buscar os ID'S todos \\\\\

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

/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2008 ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira08 = 0;
var maxPopEstrangeira08 = 0;
function estiloTotalPopEstrangeira08(feature, latlng) {
    if(feature.properties.PE2008< minPopEstrangeira08 || minPopEstrangeira08 ===0){
        minPopEstrangeira08 = feature.properties.PE2008
    }
    if(feature.properties.PE2008> maxPopEstrangeira08){
        maxPopEstrangeira08 = feature.properties.PE2008
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2008,0.3)
    });
}
function apagarTotalPopEstrangeira08(e){
    var layer = e.target;
    TotalPopEstrangeira08.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira08(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2008 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira08,
    })
};

var TotalPopEstrangeira08= L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira08,
    onEachFeature: onEachFeatureTotalPopEstrangeira08,
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

var slideTotalPopEstrangeira08 = function(){
    var sliderTotalPopEstrangeira08 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira08, {
        start: [minPopEstrangeira08, maxPopEstrangeira08],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira08,
            'max': maxPopEstrangeira08
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira08);
    inputNumberMax.setAttribute("value",maxPopEstrangeira08);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira08.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira08.noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira08.noUiSlider.on('update',function(e){
        TotalPopEstrangeira08.eachLayer(function(layer){
            if(layer.feature.properties.PE2008>=parseFloat(e[0])&& layer.feature.properties.PE2008 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira08.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotalPopEstrangeira08.noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira08);
}
TotalPopEstrangeira08.addTo(map);
/////////////////////------  FIM DA POPULAÇÃO ESTRANGEIRA RESIDENTE 2008 ---------------\\\\\\\\\\\\\\\\\\\\\

legenda(maxPopEstrangeira08, (maxPopEstrangeira08-minPopEstrangeira08)/2,minPopEstrangeira08,0.3);
slideTotalPopEstrangeira08();


/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2009 ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira09 = 0;
var maxPopEstrangeira09 = 0;
function estiloTotalPopEstrangeira09(feature, latlng) {
    if(feature.properties.PE2009< minPopEstrangeira09 || minPopEstrangeira09 ===0){
        minPopEstrangeira09 = feature.properties.PE2009
    }
    if(feature.properties.PE2009> maxPopEstrangeira09){
        maxPopEstrangeira09 = feature.properties.PE2009
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2009,0.3)
    });
}
function apagarTotalPopEstrangeira09(e){
    var layer = e.target;
    TotalPopEstrangeira09.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira09(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2009 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira09,
    })
};

var TotalPopEstrangeira09= L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira09,
    onEachFeature: onEachFeatureTotalPopEstrangeira09,
});

var slideTotalPopEstrangeira09 = function(){
    var sliderTotalPopEstrangeira09 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira09, {
        start: [minPopEstrangeira09, maxPopEstrangeira09],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira09,
            'max': maxPopEstrangeira09
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira09);
    inputNumberMax.setAttribute("value",maxPopEstrangeira09);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira09.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira09.noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira09.noUiSlider.on('update',function(e){
        TotalPopEstrangeira09.eachLayer(function(layer){
            if(layer.feature.properties.PE2009>=parseFloat(e[0])&& layer.feature.properties.PE2009 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira09.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderTotalPopEstrangeira09.noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira09);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2009-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2010  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira10  = 0;
var maxPopEstrangeira10  = 0;
function estiloTotalPopEstrangeira10 (feature, latlng) {
    if(feature.properties.PE2010 < minPopEstrangeira10  || minPopEstrangeira10  ===0){
        minPopEstrangeira10  = feature.properties.PE2010 
    }
    if(feature.properties.PE2010 > maxPopEstrangeira10 ){
        maxPopEstrangeira10  = feature.properties.PE2010 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2010 ,0.3)
    });
}
function apagarTotalPopEstrangeira10 (e){
    var layer = e.target;
    TotalPopEstrangeira10 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira10 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2010  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira10 ,
    })
};

var TotalPopEstrangeira10 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira10 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira10 ,
});

var slideTotalPopEstrangeira10  = function(){
    var sliderTotalPopEstrangeira10  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira10 , {
        start: [minPopEstrangeira10 , maxPopEstrangeira10 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira10 ,
            'max': maxPopEstrangeira10 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira10 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira10 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira10 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira10 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira10 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira10 .eachLayer(function(layer){
            if(layer.feature.properties.PE2010 >=parseFloat(e[0])&& layer.feature.properties.PE2010  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira10 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderTotalPopEstrangeira10 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira10);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2010-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2011  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira11  = 0;
var maxPopEstrangeira11  = 0;
function estiloTotalPopEstrangeira11 (feature, latlng) {
    if(feature.properties.PE2011 < minPopEstrangeira11  || minPopEstrangeira11  ===0){
        minPopEstrangeira11  = feature.properties.PE2011 
    }
    if(feature.properties.PE2011 > maxPopEstrangeira11 ){
        maxPopEstrangeira11  = feature.properties.PE2011 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2011 ,0.3)
    });
}
function apagarTotalPopEstrangeira11 (e){
    var layer = e.target;
    TotalPopEstrangeira11 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira11 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2011  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira11 ,
    })
};

var TotalPopEstrangeira11 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira11 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira11 ,
});

var slideTotalPopEstrangeira11  = function(){
    var sliderTotalPopEstrangeira11  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira11 , {
        start: [minPopEstrangeira11 , maxPopEstrangeira11 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira11 ,
            'max': maxPopEstrangeira11 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira11 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira11 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira11 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira11 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira11 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira11 .eachLayer(function(layer){
            if(layer.feature.properties.PE2011 >=parseFloat(e[0])&& layer.feature.properties.PE2011  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira11 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderTotalPopEstrangeira11 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira11);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2011-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2012  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira12  = 0;
var maxPopEstrangeira12  = 0;
function estiloTotalPopEstrangeira12 (feature, latlng) {
    if(feature.properties.PE2012 < minPopEstrangeira12  || minPopEstrangeira12  ===0){
        minPopEstrangeira12  = feature.properties.PE2012 
    }
    if(feature.properties.PE2012 > maxPopEstrangeira12 ){
        maxPopEstrangeira12  = feature.properties.PE2012 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2012 ,0.3)
    });
}
function apagarTotalPopEstrangeira12 (e){
    var layer = e.target;
    TotalPopEstrangeira12 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira12 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2012  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira12 ,
    })
};

var TotalPopEstrangeira12 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira12 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira12 ,
});

var slideTotalPopEstrangeira12  = function(){
    var sliderTotalPopEstrangeira12  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira12 , {
        start: [minPopEstrangeira12 , maxPopEstrangeira12 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira12 ,
            'max': maxPopEstrangeira12 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira12 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira12 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira12 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira12 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira12 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira12 .eachLayer(function(layer){
            if(layer.feature.properties.PE2012 >=parseFloat(e[0])&& layer.feature.properties.PE2012  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira12 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderTotalPopEstrangeira12 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira12);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2012-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2013  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira13  = 0;
var maxPopEstrangeira13  = 0;
function estiloTotalPopEstrangeira13 (feature, latlng) {
    if(feature.properties.PE2013 < minPopEstrangeira13  || minPopEstrangeira13  ===0){
        minPopEstrangeira13  = feature.properties.PE2013 
    }
    if(feature.properties.PE2013 > maxPopEstrangeira13 ){
        maxPopEstrangeira13  = feature.properties.PE2013 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2013 ,0.3)
    });
}
function apagarTotalPopEstrangeira13 (e){
    var layer = e.target;
    TotalPopEstrangeira13 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira13 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2013  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira13 ,
    })
};

var TotalPopEstrangeira13 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira13 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira13 ,
});

var slideTotalPopEstrangeira13  = function(){
    var sliderTotalPopEstrangeira13  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira13 , {
        start: [minPopEstrangeira13 , maxPopEstrangeira13 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira13 ,
            'max': maxPopEstrangeira13 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira13 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira13 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira13 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira13 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira13 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira13 .eachLayer(function(layer){
            if(layer.feature.properties.PE2013 >=parseFloat(e[0])&& layer.feature.properties.PE2013  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira13 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderTotalPopEstrangeira13 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira13);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2013-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2014  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira14  = 0;
var maxPopEstrangeira14  = 0;
function estiloTotalPopEstrangeira14 (feature, latlng) {
    if(feature.properties.PE2014 < minPopEstrangeira14  || minPopEstrangeira14  ===0){
        minPopEstrangeira14  = feature.properties.PE2014 
    }
    if(feature.properties.PE2014 > maxPopEstrangeira14 ){
        maxPopEstrangeira14  = feature.properties.PE2014 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2014 ,0.3)
    });
}
function apagarTotalPopEstrangeira14 (e){
    var layer = e.target;
    TotalPopEstrangeira14 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira14 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2014  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira14 ,
    })
};

var TotalPopEstrangeira14 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira14 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira14 ,
});

var slideTotalPopEstrangeira14  = function(){
    var sliderTotalPopEstrangeira14  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira14 , {
        start: [minPopEstrangeira14 , maxPopEstrangeira14 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira14 ,
            'max': maxPopEstrangeira14 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira14 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira14 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira14 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira14 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira14 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira14 .eachLayer(function(layer){
            if(layer.feature.properties.PE2014 >=parseFloat(e[0])&& layer.feature.properties.PE2014  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira14 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderTotalPopEstrangeira14 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira14);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2014-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2015  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira15  = 0;
var maxPopEstrangeira15  = 0;
function estiloTotalPopEstrangeira15 (feature, latlng) {
    if(feature.properties.PE2015 < minPopEstrangeira15  || minPopEstrangeira15  ===0){
        minPopEstrangeira15  = feature.properties.PE2015 
    }
    if(feature.properties.PE2015 > maxPopEstrangeira15 ){
        maxPopEstrangeira15  = feature.properties.PE2015 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2015 ,0.3)
    });
}
function apagarTotalPopEstrangeira15 (e){
    var layer = e.target;
    TotalPopEstrangeira15 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira15 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2015  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira15 ,
    })
};

var TotalPopEstrangeira15 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira15 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira15 ,
});

var slideTotalPopEstrangeira15  = function(){
    var sliderTotalPopEstrangeira15  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira15 , {
        start: [minPopEstrangeira15 , maxPopEstrangeira15 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira15 ,
            'max': maxPopEstrangeira15 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira15 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira15 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira15 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira15 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira15 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira15 .eachLayer(function(layer){
            if(layer.feature.properties.PE2015 >=parseFloat(e[0])&& layer.feature.properties.PE2015  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira15 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderTotalPopEstrangeira15 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira15);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2015-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2016  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira16  = 0;
var maxPopEstrangeira16  = 0;
function estiloTotalPopEstrangeira16 (feature, latlng) {
    if(feature.properties.PE2016 < minPopEstrangeira16  || minPopEstrangeira16  ===0){
        minPopEstrangeira16  = feature.properties.PE2016 
    }
    if(feature.properties.PE2016 > maxPopEstrangeira16 ){
        maxPopEstrangeira16  = feature.properties.PE2016 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2016 ,0.3)
    });
}
function apagarTotalPopEstrangeira16 (e){
    var layer = e.target;
    TotalPopEstrangeira16 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira16 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2016  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira16 ,
    })
};

var TotalPopEstrangeira16 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira16 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira16 ,
});

var slideTotalPopEstrangeira16  = function(){
    var sliderTotalPopEstrangeira16  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira16 , {
        start: [minPopEstrangeira16 , maxPopEstrangeira16 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira16 ,
            'max': maxPopEstrangeira16 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira16 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira16 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira16 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira16 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira16 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira16 .eachLayer(function(layer){
            if(layer.feature.properties.PE2016 >=parseFloat(e[0])&& layer.feature.properties.PE2016  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira16 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderTotalPopEstrangeira16 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira16);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2016-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2017  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira17  = 0;
var maxPopEstrangeira17  = 0;
function estiloTotalPopEstrangeira17 (feature, latlng) {
    if(feature.properties.PE2017 < minPopEstrangeira17  || minPopEstrangeira17  ===0){
        minPopEstrangeira17  = feature.properties.PE2017 
    }
    if(feature.properties.PE2017 > maxPopEstrangeira17 ){
        maxPopEstrangeira17  = feature.properties.PE2017 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2017 ,0.3)
    });
}
function apagarTotalPopEstrangeira17 (e){
    var layer = e.target;
    TotalPopEstrangeira17 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira17 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2017  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira17 ,
    })
};

var TotalPopEstrangeira17 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira17 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira17 ,
});

var slideTotalPopEstrangeira17  = function(){
    var sliderTotalPopEstrangeira17  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira17 , {
        start: [minPopEstrangeira17 , maxPopEstrangeira17 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira17 ,
            'max': maxPopEstrangeira17 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira17 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira17 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira17 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira17 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira17 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira17 .eachLayer(function(layer){
            if(layer.feature.properties.PE2017 >=parseFloat(e[0])&& layer.feature.properties.PE2017  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira17 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderTotalPopEstrangeira17 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira17);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2017-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2018  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira18  = 0;
var maxPopEstrangeira18  = 0;
function estiloTotalPopEstrangeira18 (feature, latlng) {
    if(feature.properties.PE2018 < minPopEstrangeira18  || minPopEstrangeira18  ===0){
        minPopEstrangeira18  = feature.properties.PE2018 
    }
    if(feature.properties.PE2018 > maxPopEstrangeira18 ){
        maxPopEstrangeira18  = feature.properties.PE2018 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2018 ,0.3)
    });
}
function apagarTotalPopEstrangeira18 (e){
    var layer = e.target;
    TotalPopEstrangeira18 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira18 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2018  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira18 ,
    })
};

var TotalPopEstrangeira18 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira18 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira18 ,
});

var slideTotalPopEstrangeira18  = function(){
    var sliderTotalPopEstrangeira18  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira18 , {
        start: [minPopEstrangeira18 , maxPopEstrangeira18 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira18 ,
            'max': maxPopEstrangeira18 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira18 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira18 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira18 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira18 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira18 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira18 .eachLayer(function(layer){
            if(layer.feature.properties.PE2018 >=parseFloat(e[0])&& layer.feature.properties.PE2018  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira18 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderTotalPopEstrangeira18 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira18);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2018-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2019  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira19  = 0;
var maxPopEstrangeira19  = 0;
function estiloTotalPopEstrangeira19 (feature, latlng) {
    if(feature.properties.PE2019 < minPopEstrangeira19  || minPopEstrangeira19  ===0){
        minPopEstrangeira19  = feature.properties.PE2019 
    }
    if(feature.properties.PE2019 > maxPopEstrangeira19 ){
        maxPopEstrangeira19  = feature.properties.PE2019 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2019 ,0.3)
    });
}
function apagarTotalPopEstrangeira19 (e){
    var layer = e.target;
    TotalPopEstrangeira19 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira19 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2019  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira19 ,
    })
};

var TotalPopEstrangeira19 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira19 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira19 ,
});

var slideTotalPopEstrangeira19  = function(){
    var sliderTotalPopEstrangeira19  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira19 , {
        start: [minPopEstrangeira19 , maxPopEstrangeira19 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira19 ,
            'max': maxPopEstrangeira19 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira19 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira19 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira19 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira19 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira19 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira19 .eachLayer(function(layer){
            if(layer.feature.properties.PE2019 >=parseFloat(e[0])&& layer.feature.properties.PE2019  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira19 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderTotalPopEstrangeira19 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira19);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2019-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2020  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira20  = 0;
var maxPopEstrangeira20  = 0;
function estiloTotalPopEstrangeira20 (feature, latlng) {
    if(feature.properties.PE2020 < minPopEstrangeira20  || minPopEstrangeira20  ===0){
        minPopEstrangeira20  = feature.properties.PE2020 
    }
    if(feature.properties.PE2020 > maxPopEstrangeira20 ){
        maxPopEstrangeira20  = feature.properties.PE2020 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2020 ,0.3)
    });
}
function apagarTotalPopEstrangeira20 (e){
    var layer = e.target;
    TotalPopEstrangeira20 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira20 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2020  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira20 ,
    })
};

var TotalPopEstrangeira20 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira20 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira20 ,
});

var slideTotalPopEstrangeira20  = function(){
    var sliderTotalPopEstrangeira20  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira20 , {
        start: [minPopEstrangeira20 , maxPopEstrangeira20 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira20 ,
            'max': maxPopEstrangeira20 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira20 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira20 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira20 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira20 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira20 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira20 .eachLayer(function(layer){
            if(layer.feature.properties.PE2020 >=parseFloat(e[0])&& layer.feature.properties.PE2020  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira20 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderTotalPopEstrangeira20 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira20);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2020-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ POPULAÇÃO ESTRANGEIRA RESIDENTE 2021  ---------------\\\\\\\\\\\\\\\\\\\\\
var minPopEstrangeira21  = 0;
var maxPopEstrangeira21  = 0;
function estiloTotalPopEstrangeira21 (feature, latlng) {
    if(feature.properties.PE2021 < minPopEstrangeira21  || minPopEstrangeira21  ===0){
        minPopEstrangeira21  = feature.properties.PE2021 
    }
    if(feature.properties.PE2021 > maxPopEstrangeira21 ){
        maxPopEstrangeira21  = feature.properties.PE2021 
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.PE2021 ,0.3)
    });
}
function apagarTotalPopEstrangeira21 (e){
    var layer = e.target;
    TotalPopEstrangeira21 .resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalPopEstrangeira21 (feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes Estrangeiros: ' + '<b>' +feature.properties.PE2021  + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalPopEstrangeira21 ,
    })
};

var TotalPopEstrangeira21 = L.geoJSON(populacaoEstrangeira,{
    pointToLayer:estiloTotalPopEstrangeira21 ,
    onEachFeature: onEachFeatureTotalPopEstrangeira21 ,
});

var slideTotalPopEstrangeira21  = function(){
    var sliderTotalPopEstrangeira21  = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalPopEstrangeira21 , {
        start: [minPopEstrangeira21 , maxPopEstrangeira21 ],
        tooltips:true,
        connect: true,
        range: {
            'min': minPopEstrangeira21 ,
            'max': maxPopEstrangeira21 
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPopEstrangeira21 );
    inputNumberMax.setAttribute("value",maxPopEstrangeira21 );

    inputNumberMin.addEventListener('change', function(){
        sliderTotalPopEstrangeira21 .noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalPopEstrangeira21 .noUiSlider.set([null, this.value]);
    });

    sliderTotalPopEstrangeira21 .noUiSlider.on('update',function(e){
        TotalPopEstrangeira21 .eachLayer(function(layer){
            if(layer.feature.properties.PE2021 >=parseFloat(e[0])&& layer.feature.properties.PE2021  <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalPopEstrangeira21 .noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderTotalPopEstrangeira21 .noUiSlider;
    $(slidersGeral).append(sliderTotalPopEstrangeira21);
}
/////////////////////////////////----------- FIM DA POPULAÇÃO ESTRANGEIRA EM 2021-------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////////////////--------------- VARIAÇÕES --------------------- \\\\\\\\\\\\\\\\\\\

////////////////////////////////-------  Variação ENTRE 2009 E 2008-----/////


function CorVar09_08(d) {
    return d >= 8 ? '#de1f35' :
        d >= 4  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -3.94   ? '#9eaad7' :
                ''  ;
}
var legendaVar09_08 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 8' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  4 a 8' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -3.94 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2009 e 2008, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}



var minVar09_08 = 0;
var maxVar09_08 = -999;

function EstiloVar09_08(feature) {
    if(feature.properties.Var09_08 <= minVar09_08 || minVar09_08 ===0){
        minVar09_08 = feature.properties.Var09_08
    }
    if(feature.properties.Var09_08 > maxVar09_08){
        maxVar09_08 = feature.properties.Var09_08
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar09_08(feature.properties.Var09_08)
    };
}


function apagarVar09_08(e) {
    Var09_08.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar09_08(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var09_08.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar09_08,
    });
}
var Var09_08= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar09_08,
    onEachFeature: onEachFeatureVar09_08
});

let slideVar09_08 = function(){
    var sliderVar09_08 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar09_08, {
        start: [minVar09_08, maxVar09_08],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar09_08,
            'max': maxVar09_08
        },
        });
    inputNumberMin.setAttribute("value",minVar09_08);
    inputNumberMax.setAttribute("value",maxVar09_08);

    inputNumberMin.addEventListener('change', function(){
        sliderVar09_08.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar09_08.noUiSlider.set([null, this.value]);
    });

    sliderVar09_08.noUiSlider.on('update',function(e){
        Var09_08.eachLayer(function(layer){
            if(layer.feature.properties.Var09_08>=parseFloat(e[0])&& layer.feature.properties.Var09_08 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar09_08.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderVar09_08.noUiSlider;
    $(slidersGeral).append(sliderVar09_08);
} 

////////////////////--------------- Fim da Variação 2009 E 2008 -------------- \\\\\\


////////////////////////////////-------  Variação ENTRE 2010 E 2009-----/////


var minVar10_09 = 0;
var maxVar10_09 = 0;

function CorVar10_09(d) {
    return d >= 10 ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -15.38   ? '#2288bf' :
                ''  ;
}
var legendaVar10_09 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -15.38 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2010 e 2009, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar10_09(feature) {
    if(feature.properties.Var10_09 <= minVar10_09 || minVar10_09 ===0){
        minVar10_09 = feature.properties.Var10_09
    }
    if(feature.properties.Var10_09 > maxVar10_09){
        maxVar10_09 = feature.properties.Var10_09
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar10_09(feature.properties.Var10_09)};
    }


function apagarVar10_09(e) {
    Var10_09.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar10_09(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var10_09.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar10_09,
    });
}
var Var10_09= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar10_09,
    onEachFeature: onEachFeatureVar10_09
});

let slideVar10_09 = function(){
    var sliderVar10_09 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar10_09, {
        start: [minVar10_09, maxVar10_09],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar10_09,
            'max': maxVar10_09
        },
        });
    inputNumberMin.setAttribute("value",minVar10_09);
    inputNumberMax.setAttribute("value",maxVar10_09);

    inputNumberMin.addEventListener('change', function(){
        sliderVar10_09.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar10_09.noUiSlider.set([null, this.value]);
    });

    sliderVar10_09.noUiSlider.on('update',function(e){
        Var10_09.eachLayer(function(layer){
            if(layer.feature.properties.Var10_09.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var10_09.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar10_09.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderVar10_09.noUiSlider;
    $(slidersGeral).append(sliderVar10_09);
} 

////////////////////--------------- Fim da Variação 2010 E 2009 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2011 E 2010-----/////


var minVar11_10 = 0;
var maxVar11_10 = 0;

function CorVar11_10(d) {
    return d >= 0  ? '#ff5e6e' :
        d >= -5  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -14.1   ? '#2288bf' :
                ''  ;
}
var legendaVar11_10 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -14.1 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2011 e 2010, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar11_10(feature) {
    if(feature.properties.Var11_10 <= minVar11_10 || minVar11_10 ===0){
        minVar11_10 = feature.properties.Var11_10
    }
    if(feature.properties.Var11_10 > maxVar11_10){
        maxVar11_10 = feature.properties.Var11_10
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar11_10(feature.properties.Var11_10)};
    }


function apagarVar11_10(e) {
    Var11_10.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar11_10(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_10.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar11_10,
    });
}
var Var11_10= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar11_10,
    onEachFeature: onEachFeatureVar11_10
});

let slideVar11_10 = function(){
    var sliderVar11_10 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar11_10, {
        start: [minVar11_10, maxVar11_10],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar11_10,
            'max': maxVar11_10
        },
        });
    inputNumberMin.setAttribute("value",minVar11_10);
    inputNumberMax.setAttribute("value",maxVar11_10);

    inputNumberMin.addEventListener('change', function(){
        sliderVar11_10.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar11_10.noUiSlider.set([null, this.value]);
    });

    sliderVar11_10.noUiSlider.on('update',function(e){
        Var11_10.eachLayer(function(layer){
            if(layer.feature.properties.Var11_10.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_10.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar11_10.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderVar11_10.noUiSlider;
    $(slidersGeral).append(sliderVar11_10);
} 

////////////////////--------------- Fim da Variação 2011 E 2010 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2012 E 2011-----/////


var minVar12_11 = 0;
var maxVar12_11 = 0;

function CorVar12_11(d) {
    return d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10  ? '#2288bf' :
        d >= -17.09   ? '#155273' :
                ''  ;
}
var legendaVar12_11 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -17.09 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2012 e 2011, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar12_11(feature) {
    if(feature.properties.Var12_11 <= minVar12_11 || minVar12_11 ===0){
        minVar12_11 = feature.properties.Var12_11
    }
    if(feature.properties.Var12_11 > maxVar12_11){
        maxVar12_11 = feature.properties.Var12_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar12_11(feature.properties.Var12_11)};
    }


function apagarVar12_11(e) {
    Var12_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar12_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var12_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar12_11,
    });
}
var Var12_11= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar12_11,
    onEachFeature: onEachFeatureVar12_11
});

let slideVar12_11 = function(){
    var sliderVar12_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar12_11, {
        start: [minVar12_11, maxVar12_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar12_11,
            'max': maxVar12_11
        },
        });
    inputNumberMin.setAttribute("value",minVar12_11);
    inputNumberMax.setAttribute("value",maxVar12_11);

    inputNumberMin.addEventListener('change', function(){
        sliderVar12_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar12_11.noUiSlider.set([null, this.value]);
    });

    sliderVar12_11.noUiSlider.on('update',function(e){
        Var12_11.eachLayer(function(layer){
            if(layer.feature.properties.Var12_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var12_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar12_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderVar12_11.noUiSlider;
    $(slidersGeral).append(sliderVar12_11);
} 

////////////////////--------------- Fim da Variação 2012 E 2011 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2013 E 2012-----/////
var minVar13_12 = 0;
var maxVar13_12 = 0;

function CorVar13_12(d) {
    return d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -13   ? '#2288bf' :
                ''  ;
}
var legendaVar13_12 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -13 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2013 e 2012, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar13_12(feature) {
    if(feature.properties.Var13_12 <= minVar13_12 || minVar13_12 ===0){
        minVar13_12 = feature.properties.Var13_12
    }
    if(feature.properties.Var13_12 > maxVar13_12){
        maxVar13_12 = feature.properties.Var13_12
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar13_12(feature.properties.Var13_12)};
    }


function apagarVar13_12(e) {
    Var13_12.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar13_12(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var13_12.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar13_12,
    });
}
var Var13_12= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar13_12,
    onEachFeature: onEachFeatureVar13_12
});

let slideVar13_12 = function(){
    var sliderVar13_12 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar13_12, {
        start: [minVar13_12, maxVar13_12],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar13_12,
            'max': maxVar13_12
        },
        });
    inputNumberMin.setAttribute("value",minVar13_12);
    inputNumberMax.setAttribute("value",maxVar13_12);

    inputNumberMin.addEventListener('change', function(){
        sliderVar13_12.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar13_12.noUiSlider.set([null, this.value]);
    });

    sliderVar13_12.noUiSlider.on('update',function(e){
        Var13_12.eachLayer(function(layer){
            if(layer.feature.properties.Var13_12.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var13_12.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar13_12.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderVar13_12.noUiSlider;
    $(slidersGeral).append(sliderVar13_12);
} 

////////////////////--------------- Fim da Variação 2013 E 2012 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2014 E 2013-----/////
var minVar14_13 = 0;
var maxVar14_13 = 0;

function CorVar14_13(d) {
    return d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10.63   ? '#2288bf' :
                ''  ;
}
var legendaVar14_13 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10.63 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2014 e 2013, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar14_13(feature) {
    if(feature.properties.Var14_13 <= minVar14_13 || minVar14_13 ===0){
        minVar14_13 = feature.properties.Var14_13
    }
    if(feature.properties.Var14_13 > maxVar14_13){
        maxVar14_13 = feature.properties.Var14_13
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar14_13(feature.properties.Var14_13)};
    }


function apagarVar14_13(e) {
    Var14_13.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar14_13(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var14_13.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar14_13,
    });
}
var Var14_13= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar14_13,
    onEachFeature: onEachFeatureVar14_13
});

let slideVar14_13 = function(){
    var sliderVar14_13 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar14_13, {
        start: [minVar14_13, maxVar14_13],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar14_13,
            'max': maxVar14_13
        },
        });
    inputNumberMin.setAttribute("value",minVar14_13);
    inputNumberMax.setAttribute("value",maxVar14_13);

    inputNumberMin.addEventListener('change', function(){
        sliderVar14_13.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar14_13.noUiSlider.set([null, this.value]);
    });

    sliderVar14_13.noUiSlider.on('update',function(e){
        Var14_13.eachLayer(function(layer){
            if(layer.feature.properties.Var14_13.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var14_13.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar14_13.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderVar14_13.noUiSlider;
    $(slidersGeral).append(sliderVar14_13);
} 

////////////////////--------------- Fim da Variação 2014 E 2013 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2015 E 2014-----/////
var minVar15_14 = 0;
var maxVar15_14 = 0;

function CorVar15_14(d) {
    return d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10  ? '#2288bf' :
        d >= -14.34   ? '#155273' :
                ''  ;
}
var legendaVar15_14 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -14.34 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2015 e 2014, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar15_14(feature) {
    if(feature.properties.Var15_14 <= minVar15_14 || minVar15_14 ===0){
        minVar15_14 = feature.properties.Var15_14
    }
    if(feature.properties.Var15_14 > maxVar15_14){
        maxVar15_14 = feature.properties.Var15_14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar15_14(feature.properties.Var15_14)};
    }


function apagarVar15_14(e) {
    Var15_14.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar15_14(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var15_14.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar15_14,
    });
}
var Var15_14= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar15_14,
    onEachFeature: onEachFeatureVar15_14
});

let slideVar15_14 = function(){
    var sliderVar15_14 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar15_14, {
        start: [minVar15_14, maxVar15_14],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar15_14,
            'max': maxVar15_14
        },
        });
    inputNumberMin.setAttribute("value",minVar15_14);
    inputNumberMax.setAttribute("value",maxVar15_14);

    inputNumberMin.addEventListener('change', function(){
        sliderVar15_14.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar15_14.noUiSlider.set([null, this.value]);
    });

    sliderVar15_14.noUiSlider.on('update',function(e){
        Var15_14.eachLayer(function(layer){
            if(layer.feature.properties.Var15_14.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var15_14.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar15_14.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderVar15_14.noUiSlider;
    $(slidersGeral).append(sliderVar15_14);
} 

////////////////////--------------- Fim da Variação 2015 E 2014 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2016 E 2015-----/////
var minVar16_15 = 0;
var maxVar16_15 = 0;

function CorVar16_15(d) {
    return d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -3.58   ? '#9eaad7' :
                ''  ;
}
var legendaVar16_15 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -3.58 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2016 e 2015, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar16_15(feature) {
    if(feature.properties.Var16_15 <= minVar16_15 || minVar16_15 ===0){
        minVar16_15 = feature.properties.Var16_15
    }
    if(feature.properties.Var16_15 > maxVar16_15){
        maxVar16_15 = feature.properties.Var16_15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar16_15(feature.properties.Var16_15)};
    }


function apagarVar16_15(e) {
    Var16_15.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar16_15(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var16_15.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar16_15,
    });
}
var Var16_15= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar16_15,
    onEachFeature: onEachFeatureVar16_15
});

let slideVar16_15 = function(){
    var sliderVar16_15 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar16_15, {
        start: [minVar16_15, maxVar16_15],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar16_15,
            'max': maxVar16_15
        },
        });
    inputNumberMin.setAttribute("value",minVar16_15);
    inputNumberMax.setAttribute("value",maxVar16_15);

    inputNumberMin.addEventListener('change', function(){
        sliderVar16_15.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar16_15.noUiSlider.set([null, this.value]);
    });

    sliderVar16_15.noUiSlider.on('update',function(e){
        Var16_15.eachLayer(function(layer){
            if(layer.feature.properties.Var16_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var16_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar16_15.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderVar16_15.noUiSlider;
    $(slidersGeral).append(sliderVar16_15);
} 

////////////////////--------------- Fim da Variação 2016 E 2015 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2017 E 2016-----/////
var minVar17_16 = 0;
var maxVar17_16 = 0;

function CorVar17_16(d) {
    return d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -3.03   ? '#9eaad7' :
                ''  ;
}
var legendaVar17_16 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -3.58 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2017 e 2016, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar17_16(feature) {
    if(feature.properties.Var17_16 <= minVar17_16 || minVar17_16 ===0){
        minVar17_16 = feature.properties.Var17_16
    }
    if(feature.properties.Var17_16 > maxVar17_16){
        maxVar17_16 = feature.properties.Var17_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar17_16(feature.properties.Var17_16)};
    }


function apagarVar17_16(e) {
    Var17_16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar17_16(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var17_16.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar17_16,
    });
}
var Var17_16= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar17_16,
    onEachFeature: onEachFeatureVar17_16
});

let slideVar17_16 = function(){
    var sliderVar17_16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar17_16, {
        start: [minVar17_16, maxVar17_16],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar17_16,
            'max': maxVar17_16
        },
        });
    inputNumberMin.setAttribute("value",minVar17_16);
    inputNumberMax.setAttribute("value",maxVar17_16);

    inputNumberMin.addEventListener('change', function(){
        sliderVar17_16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar17_16.noUiSlider.set([null, this.value]);
    });

    sliderVar17_16.noUiSlider.on('update',function(e){
        Var17_16.eachLayer(function(layer){
            if(layer.feature.properties.Var17_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var17_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar17_16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderVar17_16.noUiSlider;
    $(slidersGeral).append(sliderVar17_16);
} 
////////////////////--------------- Fim da Variação 2017 E 2016 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2018 E 2017-----/////
var minVar18_17 = 0;
var maxVar18_17 = 0;

function CorVar18_17(d) {
    return d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2.91   ? '#9eaad7' :
                ''  ;
}
var legendaVar18_17 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2.91 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2018 e 2017, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar18_17(feature) {
    if(feature.properties.Var18_17 <= minVar18_17 || minVar18_17 ===0){
        minVar18_17 = feature.properties.Var18_17
    }
    if(feature.properties.Var18_17 > maxVar18_17){
        maxVar18_17 = feature.properties.Var18_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar18_17(feature.properties.Var18_17)};
    }


function apagarVar18_17(e) {
    Var18_17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar18_17(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var18_17.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar18_17,
    });
}
var Var18_17= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar18_17,
    onEachFeature: onEachFeatureVar18_17
});

let slideVar18_17 = function(){
    var sliderVar18_17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar18_17, {
        start: [minVar18_17, maxVar18_17],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar18_17,
            'max': maxVar18_17
        },
        });
    inputNumberMin.setAttribute("value",minVar18_17);
    inputNumberMax.setAttribute("value",maxVar18_17);

    inputNumberMin.addEventListener('change', function(){
        sliderVar18_17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar18_17.noUiSlider.set([null, this.value]);
    });

    sliderVar18_17.noUiSlider.on('update',function(e){
        Var18_17.eachLayer(function(layer){
            if(layer.feature.properties.Var18_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var18_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar18_17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderVar18_17.noUiSlider;
    $(slidersGeral).append(sliderVar18_17);
} 

////////////////////--------------- Fim da Variação 2018 E 2017 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2019 E 2018-----/////
var minVar19_18 = 0;
var maxVar19_18 = 0;

function CorVar19_18(d) {
    return d >= 40  ? '#8c0303' :
        d >= 35  ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 19.63   ? '#f5b3be' :
                ''  ;
}
var legendaVar19_18 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 35 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 25 a 35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 19.63 a 25' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2019 e 2018, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar19_18(feature) {
    if(feature.properties.Var19_18 <= minVar19_18 || minVar19_18 ===0){
        minVar19_18 = feature.properties.Var19_18
    }
    if(feature.properties.Var19_18 > maxVar19_18){
        maxVar19_18 = feature.properties.Var19_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar19_18(feature.properties.Var19_18)};
    }


function apagarVar19_18(e) {
    Var19_18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar19_18(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var19_18.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar19_18,
    });
}
var Var19_18= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar19_18,
    onEachFeature: onEachFeatureVar19_18
});

let slideVar19_18 = function(){
    var sliderVar19_18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar19_18, {
        start: [minVar19_18, maxVar19_18],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar19_18,
            'max': maxVar19_18
        },
        });
    inputNumberMin.setAttribute("value",minVar19_18);
    inputNumberMax.setAttribute("value",maxVar19_18);

    inputNumberMin.addEventListener('change', function(){
        sliderVar19_18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar19_18.noUiSlider.set([null, this.value]);
    });

    sliderVar19_18.noUiSlider.on('update',function(e){
        Var19_18.eachLayer(function(layer){
            if(layer.feature.properties.Var19_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var19_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar19_18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderVar19_18.noUiSlider;
    $(slidersGeral).append(sliderVar19_18);
} 

////////////////////--------------- Fim da Variação 2019 E 2018 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2020 E 2019-----/////
var minVar20_19 = 0;
var maxVar20_19 = 0;

function CorVar20_19(d) {
    return d >= 30  ? '#8c0303' :
        d >= 20  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 1.63   ? '#f5b3be' :
                ''  ;
}
var legendaVar20_19 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 20 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 1.63 a 10' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2020 e 2019, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar20_19(feature) {
    if(feature.properties.Var20_19 <= minVar20_19 || minVar20_19 ===0){
        minVar20_19 = feature.properties.Var20_19
    }
    if(feature.properties.Var20_19 > maxVar20_19){
        maxVar20_19 = feature.properties.Var20_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar20_19(feature.properties.Var20_19)};
    }


function apagarVar20_19(e) {
    Var20_19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar20_19(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var20_19.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar20_19,
    });
}
var Var20_19= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar20_19,
    onEachFeature: onEachFeatureVar20_19
});

let slideVar20_19 = function(){
    var sliderVar20_19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar20_19, {
        start: [minVar20_19, maxVar20_19],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar20_19,
            'max': maxVar20_19
        },
        });
    inputNumberMin.setAttribute("value",minVar20_19);
    inputNumberMax.setAttribute("value",maxVar20_19);

    inputNumberMin.addEventListener('change', function(){
        sliderVar20_19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar20_19.noUiSlider.set([null, this.value]);
    });

    sliderVar20_19.noUiSlider.on('update',function(e){
        Var20_19.eachLayer(function(layer){
            if(layer.feature.properties.Var20_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var20_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar20_19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderVar20_19.noUiSlider;
    $(slidersGeral).append(sliderVar20_19);
} 

////////////////////--------------- Fim da Variação 2020 E 2019 -------------- \\\\\\

////////////////////////////////-------  Variação ENTRE 2020 E 2019-----/////
var minVar21_20 = 0;
var maxVar21_20 = 0;

function CorVar21_20(d) {
    return d >= 15  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0.8   ? '#f5b3be' :
                ''  ;
}
var legendaVar21_20 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 10 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0.8 a 5' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    $('#tituloMapa').html(' <strong>' + 'Variação do número de residentes estrangeiros, entre 2021 e 2020, por concelho.' + '</strong>')
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar21_20(feature) {
    if(feature.properties.Var21_20 <= minVar21_20 || minVar21_20 ===0){
        minVar21_20 = feature.properties.Var21_20
    }
    if(feature.properties.Var21_20 > maxVar21_20){
        maxVar21_20 = feature.properties.Var21_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar21_20(feature.properties.Var21_20)};
    }


function apagarVar21_20(e) {
    Var21_20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureVar21_20(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var21_20.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar21_20,
    });
}
var Var21_20= L.geoJSON(dadosRelativosConcelho, {
    style:EstiloVar21_20,
    onEachFeature: onEachFeatureVar21_20
});

let slideVar21_20 = function(){
    var sliderVar21_20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar21_20, {
        start: [minVar21_20, maxVar21_20],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar21_20,
            'max': maxVar21_20
        },
        });
    inputNumberMin.setAttribute("value",minVar21_20);
    inputNumberMax.setAttribute("value",maxVar21_20);

    inputNumberMin.addEventListener('change', function(){
        sliderVar21_20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar21_20.noUiSlider.set([null, this.value]);
    });

    sliderVar21_20.noUiSlider.on('update',function(e){
        Var21_20.eachLayer(function(layer){
            if(layer.feature.properties.Var21_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var21_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar21_20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderVar21_20.noUiSlider;
    $(slidersGeral).append(sliderVar21_20);
} 

$('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2008, por concelho.' + '</strong>');

////////////////////--------------- Fim da Variação 2020 E 2019 -------------- \\\\\\

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotalPopEstrangeira08;
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
    if (layer == TotalPopEstrangeira08 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2008, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira08, (maxPopEstrangeira08-minPopEstrangeira08)/2,minPopEstrangeira08,0.3);
        contorno.addTo(map)
        slideTotalPopEstrangeira08();
        baseAtiva = contorno;
        naoDuplicar = 1;
    }
    if (layer == TotalPopEstrangeira08 && naoDuplicar == 1){
        contorno.addTo(map);
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2008, por concelho.' + '</strong>');

    }
    if (layer == TotalPopEstrangeira09 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2009, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira09 ,((maxPopEstrangeira09 -minPopEstrangeira09)/2).toFixed(0),minPopEstrangeira09 ,0.3);
        contorno.addTo(map)
        baseAtiva = contorno
        slideTotalPopEstrangeira09();
        naoDuplicar = 2;
    } 
    if (layer == TotalPopEstrangeira10  && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2010, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira10 ,((maxPopEstrangeira10  -minPopEstrangeira10 )/2).toFixed(0),minPopEstrangeira10  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira10();
        naoDuplicar = 3;
    } 
    if (layer == TotalPopEstrangeira11  && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2011, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira11 ,((maxPopEstrangeira11  -minPopEstrangeira11 )/2).toFixed(0),minPopEstrangeira11  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira11();
        naoDuplicar = 4;
    } 
    if (layer == TotalPopEstrangeira12  && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2012, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira12 ,((maxPopEstrangeira12  -minPopEstrangeira12 )/2).toFixed(0),minPopEstrangeira12  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira12();
        naoDuplicar = 5;
    } 
    if (layer == TotalPopEstrangeira13  && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2013, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira13,((maxPopEstrangeira13  -minPopEstrangeira13 )/2).toFixed(0),minPopEstrangeira13  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira13();
        naoDuplicar = 6;
    } 
    if (layer == TotalPopEstrangeira14  && naoDuplicar != 7){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2014, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira14,((maxPopEstrangeira14  -minPopEstrangeira14 )/2).toFixed(0),minPopEstrangeira14  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira14();
        naoDuplicar = 7;
    } 
    if (layer == TotalPopEstrangeira15  && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2015, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira15,((maxPopEstrangeira15  -minPopEstrangeira15 )/2).toFixed(0),minPopEstrangeira15  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira15();
        naoDuplicar = 8;
    } 
    if (layer == TotalPopEstrangeira16  && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2016, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira16 ,((maxPopEstrangeira16  -minPopEstrangeira16 )/2).toFixed(0),minPopEstrangeira16  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira16();
        naoDuplicar = 9;
    } 
    if (layer == TotalPopEstrangeira17 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2017, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira17 ,((maxPopEstrangeira17  -minPopEstrangeira17 )/2).toFixed(0),minPopEstrangeira17  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira17();
        naoDuplicar = 10;
    } 
    if (layer == TotalPopEstrangeira18 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2018, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira18 ,((maxPopEstrangeira18  -minPopEstrangeira18 )/2).toFixed(0),minPopEstrangeira18  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira18();
        naoDuplicar = 11;
    } 
    if (layer == TotalPopEstrangeira19 && naoDuplicar!= 12){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2019, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira19 ,((maxPopEstrangeira19  -minPopEstrangeira19 )/2).toFixed(0),minPopEstrangeira19  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira19();
        naoDuplicar = 12;
    } 
    if (layer == TotalPopEstrangeira20 && naoDuplicar != 13){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2020, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira20 ,((maxPopEstrangeira20  -minPopEstrangeira20 )/2).toFixed(0),minPopEstrangeira20  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira20();
        naoDuplicar = 13;
    }
    if (layer == TotalPopEstrangeira21 && naoDuplicar != 26){
        $('#tituloMapa').html('<strong>' + 'Número de residentes estrangeiros, em 2021, por concelho.' + '</strong>');
        legenda(maxPopEstrangeira21 ,((maxPopEstrangeira21  -minPopEstrangeira21 )/2).toFixed(0),minPopEstrangeira21  ,0.3);
        contorno.addTo(map);
        baseAtiva = contorno;
        slideTotalPopEstrangeira21();
        naoDuplicar = 26;
    }  
    if (layer == Var09_08 && naoDuplicar != 14){
        legendaVar09_08();
        slideVar09_08();
        naoDuplicar = 14;
    }
    if (layer == Var10_09 && naoDuplicar != 15){
        legendaVar10_09();
        slideVar10_09();
        naoDuplicar = 15;
    }
    if (layer == Var11_10 && naoDuplicar != 16){
        legendaVar11_10();
        slideVar11_10();
        naoDuplicar = 16;
    }
    if (layer == Var12_11 && naoDuplicar != 17){
        legendaVar12_11();
        slideVar12_11();
        naoDuplicar = 17;
    }
    if (layer == Var13_12 && naoDuplicar != 18){
        legendaVar13_12();
        slideVar13_12();
        naoDuplicar = 18;
    }
    if (layer == Var14_13 && naoDuplicar != 19){
        legendaVar14_13();
        slideVar14_13();
        naoDuplicar = 19;
    }
    if (layer == Var15_14 && naoDuplicar != 20){
        legendaVar15_14();
        slideVar15_14();
        naoDuplicar = 20;
    }
    if (layer == Var16_15 && naoDuplicar != 21){
        legendaVar16_15();
        slideVar16_15();
        naoDuplicar = 21;
    }
    if (layer == Var17_16 && naoDuplicar != 22){
        legendaVar17_16();
        slideVar17_16();
        naoDuplicar = 22;
    }
    if (layer == Var18_17 && naoDuplicar != 23){
        legendaVar18_17();
        slideVar18_17();
        naoDuplicar = 23;
    }
    if (layer == Var19_18 && naoDuplicar != 24){
        legendaVar19_18();
        slideVar19_18();
        naoDuplicar = 24;
    }
    if (layer == Var20_19 && naoDuplicar != 25){
        legendaVar20_19();
        slideVar20_19();
        naoDuplicar = 25;
    }
    if (layer == Var21_20 && naoDuplicar != 27){
        legendaVar21_20();
        slideVar21_20();
        naoDuplicar = 27;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}

function myFunction() {
    var anoSelecionado = document.getElementById("mySelect").value;
    if($('#absoluto').hasClass('active4')){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + 'SEF, Relatórios estatísticos anuais.' );
        if (anoSelecionado == "2008"){
            novaLayer(TotalPopEstrangeira08);
        };
        if (anoSelecionado == "2009"){
            novaLayer(TotalPopEstrangeira09);
        };
        if (anoSelecionado == "2010"){
            novaLayer(TotalPopEstrangeira10);
        };
        if (anoSelecionado == "2011"){
            novaLayer(TotalPopEstrangeira11);
        };
        if (anoSelecionado == "2012"){
            novaLayer(TotalPopEstrangeira12);
        };
        if (anoSelecionado == "2013"){
            novaLayer(TotalPopEstrangeira13);
        };
        if (anoSelecionado == "2014"){
            novaLayer(TotalPopEstrangeira14);
        };
        if (anoSelecionado == "2015"){
            novaLayer(TotalPopEstrangeira15);
        };
        if (anoSelecionado == "2016"){
            novaLayer(TotalPopEstrangeira16);
        };
        if (anoSelecionado == "2017"){
            novaLayer(TotalPopEstrangeira17);
        };
        if (anoSelecionado == "2018"){
            novaLayer(TotalPopEstrangeira18);
        };
        if (anoSelecionado == "2019"){
            novaLayer(TotalPopEstrangeira19);
        };
        if (anoSelecionado == "2020"){
            novaLayer(TotalPopEstrangeira20);
        };
        if (anoSelecionado == "2021"){
            novaLayer(TotalPopEstrangeira21);
        };
    }
    if($('#taxaVariacao').hasClass('active4')){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + 'Cálculos próprios; SEF, Relatórios estatísticos anuais.' );
        if (anoSelecionado == "2008"){
            novaLayer(Var09_08);
        };
        if (anoSelecionado == "2009"){
            novaLayer(Var10_09);
        };
        if (anoSelecionado == "2010"){
            novaLayer(Var11_10);
        };
        if (anoSelecionado == "2011"){
            novaLayer(Var12_11);
        };
        if (anoSelecionado == "2012"){
            novaLayer(Var13_12);
        };
        if (anoSelecionado == "2013"){
            novaLayer(Var14_13);
        };
        if (anoSelecionado == "2014"){
            novaLayer(Var15_14);
        };
        if (anoSelecionado == "2015"){
            novaLayer(Var16_15);
        };
        if (anoSelecionado == "2016"){
            novaLayer(Var17_16);
        };
        if (anoSelecionado == "2017"){
            novaLayer(Var18_17);
        };
        if (anoSelecionado == "2018"){
            novaLayer(Var19_18);
        };
        if (anoSelecionado == "2019"){
            novaLayer(Var20_19);
        };
        if (anoSelecionado == "2020"){
            novaLayer(Var21_20);
        };
    }   
}

let primeirovalor = function(ano){
    $("#mySelect").val(ano);
    
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let reporAnos = function(){
    $('#mySelect').empty();
    var ano = 2008;
    while (ano <= 2021){
        $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '</option>');
        ano += 1;
    }
    primeirovalor('2008');
}
let reporAnosVariacao = function(){
    $('#mySelect').empty();
    var ano = 2009;
    var anoAnterior = 2008;
    while (anoAnterior < 2021){
        $('#mySelect').append("<option value="+ '' + anoAnterior + '' + '>' + ano + '-' + anoAnterior + '</option>');
        ano += 1;
        anoAnterior += 1;
    }
    primeirovalor('2008');
}

$('#mySelect').change(function(){
    myFunction();
})
$('#absoluto').click(function(){
    reporAnos();
    myFunction();
});

$('#taxaVariacao').click(function(){
    reporAnosVariacao();
    myFunction();
});


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
    $('#tituloMapa').html('Número de residentes estrangeiros, entre 2008 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/PopEstrangeiraProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2008').html("2008");
            $.each(data, function(key, value){
                dados += '<tr>';
                dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom">'+value.Estrangeiro+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2008.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2009.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2010.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2011.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2012.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2013.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2014.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2015.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2016.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2017.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2018.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2019.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2020.toLocaleString("fr")+'</td>';
                dados += '<td class="borderbottom">'+value.Dados2021.toLocaleString("fr")+'</td>';
                
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})};
$('#tabelaDadosAbsolutos').click(function(){
    DadosAbsolutosTipoAlojamento();;   
});

$('#tabelaVariacao').click(function(){
    $('#tituloMapa').html('Variação do número de residentes estrangeiros, entre 2008 e 2021, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/PopEstrangeiraProv.json", function(data){
            $('#juntarValores').empty();
            $('#2008').html(" ")
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom">'+value.Estrangeiro+'</td>';;
                dados += '<td class="borderbottom">'+ ' '+'</td>';
                dados += '<td class="borderbottom">'+value.VAR0908+'</td>';
                dados += '<td class="borderbottom">'+value.VAR1009+'</td>';
                dados += '<td class="borderbottom">'+value.VAR1110+'</td>';
                dados += '<td class="borderbottom">'+value.Var1211+'</td>';
                dados += '<td class="borderbottom">'+value.Var1312+'</td>';
                dados += '<td class="borderbottom">'+value.Var1413+'</td>';
                dados += '<td class="borderbottom">'+value.Var1514+'</td>';
                dados += '<td class="borderbottom">'+value.Var1615+'</td>';
                dados += '<td class="borderbottom">'+value.Var1716+'</td>';
                dados += '<td class="borderbottom">'+value.Var1817+'</td>';
                dados += '<td class="borderbottom">'+value.Var1918+'</td>';
                dados += '<td class="borderbottom">'+value.Var2019+'</td>';
                dados += '<td class="borderbottom">'+value.Var2120+'</td>';
                dados += '<tr>';
            })
        $('#juntarValores').append(dados); 
    });
    });
});

let anosSelecionados = function() {
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado == "2021"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (anoSelecionado == "2008"){
            i = 0;
        }
        if($('#taxaVariacao').hasClass('active4')){
            if (anoSelecionado == "2020"){
                i = $('#mySelect').children('option').length - 1 ;
            }
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
    reporAnos();
    novaLayer(TotalPopEstrangeira08);
})
