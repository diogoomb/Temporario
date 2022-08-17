
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

///// --- Adicionar Layer dos Concelhos -----\\\\
function layerContorno() {
    return {
        weight: 1,
        opacity: 1,
        color: 'gray',
        dashArray: '1',
        fillOpacity: 0.2,
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
var contornoFreg2001 =L.geoJSON(dadosRelativosFreguesias1101,{
    style:layerContorno,
});
var contornoConcelhos1991 =L.geoJSON(dadosRelativosConcelhos91,{
    style:layerContorno,
});
contornoConcelhos1991.addTo(map);
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

/////////////////////------ Famílias TOTAIS, por concelho 1991---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamiliasConc91 = 0;
var maxTotalFamiliasConc91 = 0;
function estiloTotalFamiliasConc91(feature, latlng) {
    if(feature.properties.TotFam91< minTotalFamiliasConc91 || minTotalFamiliasConc91 ===0){
        minTotalFamiliasConc91 = feature.properties.TotFam91
    }
    if(feature.properties.TotFam91> maxTotalFamiliasConc91){
        maxTotalFamiliasConc91 = feature.properties.TotFam91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.TotFam91,0.15)
    });
}
function apagarTotalFamiliasConc91(e){
    var layer = e.target;
    TotalFamiliasConc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamiliasConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Famílias clássicas: ' + '<b>' +feature.properties.TotFam91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamiliasConc91,
    })
};

var TotalFamiliasConc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloTotalFamiliasConc91,
    onEachFeature: onEachFeatureTotalFamiliasConc91,
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




var slideTotalFamiliasConc91 = function(){
    var sliderTotalFamiliasConc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamiliasConc91, {
        start: [minTotalFamiliasConc91, maxTotalFamiliasConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamiliasConc91,
            'max': maxTotalFamiliasConc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamiliasConc91);
    inputNumberMax.setAttribute("value",maxTotalFamiliasConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamiliasConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamiliasConc91.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamiliasConc91.noUiSlider.on('update',function(e){
        TotalFamiliasConc91.eachLayer(function(layer){
            if(layer.feature.properties.TotFam91>=parseFloat(e[0])&& layer.feature.properties.TotFam91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamiliasConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderTotalFamiliasConc91.noUiSlider;
    $(slidersGeral).append(sliderTotalFamiliasConc91);
}
TotalFamiliasConc91.addTo(map);
legenda(maxTotalFamiliasConc91, ((maxTotalFamiliasConc91-minTotalFamiliasConc91)/2).toFixed(0),minTotalFamiliasConc91,0.15);
slideTotalFamiliasConc91();

///////////////////////////-------------------- FIM FAMÍLIAS CLÁSSICAS CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS EM 2001, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamiliasConc01 = 0;
var maxTotalFamiliasConc01 = 0;
function estiloTotalFamiliasConc01(feature, latlng) {
    if(feature.properties.TotFam01< minTotalFamiliasConc01 || minTotalFamiliasConc01 ===0){
        minTotalFamiliasConc01 = feature.properties.TotFam01
    }
    if(feature.properties.TotFam01> maxTotalFamiliasConc01){
        maxTotalFamiliasConc01 = feature.properties.TotFam01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.TotFam01,0.15)
    });
}
function apagarTotalFamiliasConc01(e){
    var layer = e.target;
    TotalFamiliasConc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamiliasConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas: ' + '<b>' +feature.properties.TotFam01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamiliasConc01,
    })
};

var TotalFamiliasConc01= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamiliasConc01,
    onEachFeature: onEachFeatureTotalFamiliasConc01,
});

var slideTotalFamiliasConc01 = function(){
    var sliderTotalFamiliasConc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamiliasConc01, {
        start: [minTotalFamiliasConc01, maxTotalFamiliasConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamiliasConc01,
            'max': maxTotalFamiliasConc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamiliasConc01);
    inputNumberMax.setAttribute("value",maxTotalFamiliasConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamiliasConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamiliasConc01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamiliasConc01.noUiSlider.on('update',function(e){
        TotalFamiliasConc01.eachLayer(function(layer){
            if(layer.feature.properties.TotFam01>=parseFloat(e[0])&& layer.feature.properties.TotFam01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamiliasConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderTotalFamiliasConc01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamiliasConc01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS EM 2011, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamiliasConc11 = 0;
var maxTotalFamiliasConc11 = 0;
function estiloTotalFamiliasConc11(feature, latlng) {
    if(feature.properties.TotFam11< minTotalFamiliasConc11 || minTotalFamiliasConc11 ===0){
        minTotalFamiliasConc11 = feature.properties.TotFam11
    }
    if(feature.properties.TotFam11> maxTotalFamiliasConc11){
        maxTotalFamiliasConc11 = feature.properties.TotFam11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.TotFam11,0.15)
    });
}
function apagarTotalFamiliasConc11(e){
    var layer = e.target;
    TotalFamiliasConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamiliasConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássica: ' + '<b>' +feature.properties.TotFam11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamiliasConc11,
    })
};

var TotalFamiliasConc11= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamiliasConc11,
    onEachFeature: onEachFeatureTotalFamiliasConc11,
});

var slideTotalFamiliasConc11 = function(){
    var sliderTotalFamiliasConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamiliasConc11, {
        start: [minTotalFamiliasConc11, maxTotalFamiliasConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamiliasConc11,
            'max': maxTotalFamiliasConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamiliasConc11);
    inputNumberMax.setAttribute("value",maxTotalFamiliasConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamiliasConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamiliasConc11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamiliasConc11.noUiSlider.on('update',function(e){
        TotalFamiliasConc11.eachLayer(function(layer){
            if(layer.feature.properties.TotFam11>=parseFloat(e[0])&& layer.feature.properties.TotFam11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamiliasConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderTotalFamiliasConc11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamiliasConc11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////-------------------- FAMILIAS CLÁSSICAS COM 1 PESSOA -------------\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 1 PESSOA EM 1991, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias1PConc91 = 0;
var maxTotalFamilias1PConc91 = 0;
function estiloTotalFamilias1PConc91(feature, latlng) {
    if(feature.properties.Fam1P_91< minTotalFamilias1PConc91 || minTotalFamilias1PConc91 ===0){
        minTotalFamilias1PConc91 = feature.properties.Fam1P_91
    }
    if(feature.properties.Fam1P_91> maxTotalFamilias1PConc91){
        maxTotalFamilias1PConc91 = feature.properties.Fam1P_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam1P_91,0.15)
    });
}
function apagarTotalFamilias1PConc91(e){
    var layer = e.target;
    TotalFamilias1PConc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias1PConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Famílias clássicas com 1 pessoa: ' + '<b>' +feature.properties.Fam1P_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias1PConc91,
    })
};

var TotalFamilias1PConc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloTotalFamilias1PConc91,
    onEachFeature: onEachFeatureTotalFamilias1PConc91,
});

var slideTotalFamilias1PConc91 = function(){
    var sliderTotalFamilias1PConc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias1PConc91, {
        start: [minTotalFamilias1PConc91, maxTotalFamilias1PConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias1PConc91,
            'max': maxTotalFamilias1PConc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias1PConc91);
    inputNumberMax.setAttribute("value",maxTotalFamilias1PConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias1PConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias1PConc91.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias1PConc91.noUiSlider.on('update',function(e){
        TotalFamilias1PConc91.eachLayer(function(layer){
            if(layer.feature.properties.Fam1P_91>=parseFloat(e[0])&& layer.feature.properties.Fam1P_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias1PConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderTotalFamilias1PConc91.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias1PConc91);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 1 PESSOA CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////------ FAMILIAS CLÁSSICAS COM 1 PESSOA EM 2001, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias1PConc01 = 0;
var maxTotalFamilias1PConc01 = 0;
function estiloTotalFamilias1PConc01(feature, latlng) {
    if(feature.properties.Fam1P_01< minTotalFamilias1PConc01 || minTotalFamilias1PConc01 ===0){
        minTotalFamilias1PConc01 = feature.properties.Fam1P_01
    }
    if(feature.properties.Fam1P_01> maxTotalFamilias1PConc01){
        maxTotalFamilias1PConc01 = feature.properties.Fam1P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam1P_01,0.15)
    });
}
function apagarTotalFamilias1PConc01(e){
    var layer = e.target;
    TotalFamilias1PConc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias1PConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas com 1 pessoa: ' + '<b>' +feature.properties.Fam1P_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias1PConc01,
    })
};

var TotalFamilias1PConc01= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamilias1PConc01,
    onEachFeature: onEachFeatureTotalFamilias1PConc01,
});

var slideTotalFamilias1PConc01 = function(){
    var sliderTotalFamilias1PConc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias1PConc01, {
        start: [minTotalFamilias1PConc01, maxTotalFamilias1PConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias1PConc01,
            'max': maxTotalFamilias1PConc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias1PConc01);
    inputNumberMax.setAttribute("value",maxTotalFamilias1PConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias1PConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias1PConc01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias1PConc01.noUiSlider.on('update',function(e){
        TotalFamilias1PConc01.eachLayer(function(layer){
            if(layer.feature.properties.Fam1P_01>=parseFloat(e[0])&& layer.feature.properties.Fam1P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias1PConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderTotalFamilias1PConc01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias1PConc01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 1 PESSOA CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 1 PESSOA EM 2011, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias1PConc11 = 0;
var maxTotalFamilias1PConc11 = 0;
function estiloTotalFamilias1PConc11(feature, latlng) {
    if(feature.properties.Fam1P_11< minTotalFamilias1PConc11 || minTotalFamilias1PConc11 ===0){
        minTotalFamilias1PConc11 = feature.properties.Fam1P_11
    }
    if(feature.properties.Fam1P_11> maxTotalFamilias1PConc11){
        maxTotalFamilias1PConc11 = feature.properties.Fam1P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam1P_11,0.15)
    });
}
function apagarTotalFamilias1PConc11(e){
    var layer = e.target;
    TotalFamilias1PConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias1PConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas com 1 pessoa: ' + '<b>' +feature.properties.Fam1P_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias1PConc11,
    })
};

var TotalFamilias1PConc11= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamilias1PConc11,
    onEachFeature: onEachFeatureTotalFamilias1PConc11,
});

var slideTotalFamilias1PConc11 = function(){
    var sliderTotalFamilias1PConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias1PConc11, {
        start: [minTotalFamilias1PConc11, maxTotalFamilias1PConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias1PConc11,
            'max': maxTotalFamilias1PConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias1PConc11);
    inputNumberMax.setAttribute("value",maxTotalFamilias1PConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias1PConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias1PConc11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias1PConc11.noUiSlider.on('update',function(e){
        TotalFamilias1PConc11.eachLayer(function(layer){
            if(layer.feature.properties.Fam1P_11>=parseFloat(e[0])&& layer.feature.properties.Fam1P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias1PConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderTotalFamilias1PConc11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias1PConc11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 1 PESSOA CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 2 PESSOAS EM 1991, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias2PConc91 = 0;
var maxTotalFamilias2PConc91 = 0;
function estiloTotalFamilias2PConc91(feature, latlng) {
    if(feature.properties.Fam2P_91< minTotalFamilias2PConc91 || minTotalFamilias2PConc91 ===0){
        minTotalFamilias2PConc91 = feature.properties.Fam2P_91
    }
    if(feature.properties.Fam2P_91> maxTotalFamilias2PConc91){
        maxTotalFamilias2PConc91 = feature.properties.Fam2P_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam2P_91,0.15)
    });
}
function apagarTotalFamilias2PConc91(e){
    var layer = e.target;
    TotalFamilias2PConc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias2PConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Famílias clássicas com 2 pessoas: ' + '<b>' +feature.properties.Fam2P_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias2PConc91,
    })
};

var TotalFamilias2PConc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloTotalFamilias2PConc91,
    onEachFeature: onEachFeatureTotalFamilias2PConc91,
});

var slideTotalFamilias2PConc91 = function(){
    var sliderTotalFamilias2PConc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias2PConc91, {
        start: [minTotalFamilias2PConc91, maxTotalFamilias2PConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias2PConc91,
            'max': maxTotalFamilias2PConc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias2PConc91);
    inputNumberMax.setAttribute("value",maxTotalFamilias2PConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias2PConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias2PConc91.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias2PConc91.noUiSlider.on('update',function(e){
        TotalFamilias2PConc91.eachLayer(function(layer){
            if(layer.feature.properties.Fam2P_91>=parseFloat(e[0])&& layer.feature.properties.Fam2P_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias2PConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderTotalFamilias2PConc91.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias2PConc91);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 2 PESSOAS CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 2 PESSOAS EM 2001, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias2PConc01 = 0;
var maxTotalFamilias2PConc01 = 0;
function estiloTotalFamilias2PConc01(feature, latlng) {
    if(feature.properties.Fam2P_01< minTotalFamilias2PConc01 || minTotalFamilias2PConc01 ===0){
        minTotalFamilias2PConc01 = feature.properties.Fam2P_01
    }
    if(feature.properties.Fam2P_01> maxTotalFamilias2PConc01){
        maxTotalFamilias2PConc01 = feature.properties.Fam2P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam2P_01,0.15)
    });
}
function apagarTotalFamilias2PConc01(e){
    var layer = e.target;
    TotalFamilias2PConc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias2PConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas com 2 pessoas: ' + '<b>' +feature.properties.Fam2P_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias2PConc01,
    })
};

var TotalFamilias2PConc01= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamilias2PConc01,
    onEachFeature: onEachFeatureTotalFamilias2PConc01,
});

var slideTotalFamilias2PConc01 = function(){
    var sliderTotalFamilias2PConc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias2PConc01, {
        start: [minTotalFamilias2PConc01, maxTotalFamilias2PConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias2PConc01,
            'max': maxTotalFamilias2PConc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias2PConc01);
    inputNumberMax.setAttribute("value",maxTotalFamilias2PConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias2PConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias2PConc01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias2PConc01.noUiSlider.on('update',function(e){
        TotalFamilias2PConc01.eachLayer(function(layer){
            if(layer.feature.properties.Fam2P_01>=parseFloat(e[0])&& layer.feature.properties.Fam2P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias2PConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderTotalFamilias2PConc01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias2PConc01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 2 PESSOAs CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 2 PESSOAS EM 2011, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias2PConc11 = 0;
var maxTotalFamilias2PConc11 = 0;
function estiloTotalFamilias2PConc11(feature, latlng) {
    if(feature.properties.Fam2P_11< minTotalFamilias2PConc11 || minTotalFamilias2PConc11 ===0){
        minTotalFamilias2PConc11 = feature.properties.Fam2P_11
    }
    if(feature.properties.Fam2P_11> maxTotalFamilias2PConc11){
        maxTotalFamilias2PConc11 = feature.properties.Fam2P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam2P_11,0.15)
    });
}
function apagarTotalFamilias2PConc11(e){
    var layer = e.target;
    TotalFamilias2PConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias2PConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas com 2 pessoas: ' + '<b>' +feature.properties.Fam2P_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias2PConc11,
    })
};

var TotalFamilias2PConc11= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamilias2PConc11,
    onEachFeature: onEachFeatureTotalFamilias2PConc11,
});

var slideTotalFamilias2PConc11 = function(){
    var sliderTotalFamilias2PConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias2PConc11, {
        start: [minTotalFamilias2PConc11, maxTotalFamilias2PConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias2PConc11,
            'max': maxTotalFamilias2PConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias2PConc11);
    inputNumberMax.setAttribute("value",maxTotalFamilias2PConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias2PConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias2PConc11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias2PConc11.noUiSlider.on('update',function(e){
        TotalFamilias2PConc11.eachLayer(function(layer){
            if(layer.feature.properties.Fam2P_11>=parseFloat(e[0])&& layer.feature.properties.Fam2P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias2PConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderTotalFamilias2PConc11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias2PConc11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 2 PESSOAs CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 3 PESSOAS EM 1991, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias3PConc91 = 0;
var maxTotalFamilias3PConc91 = 0;
function estiloTotalFamilias3PConc91(feature, latlng) {
    if(feature.properties.Fam3P_91< minTotalFamilias3PConc91 || minTotalFamilias3PConc91 === 0){
        minTotalFamilias3PConc91 = feature.properties.Fam3P_91
    }
    if(feature.properties.Fam3P_91> maxTotalFamilias3PConc91){
        maxTotalFamilias3PConc91 = feature.properties.Fam3P_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam3P_91,0.15)
    });
}
function apagarTotalFamilias3PConc91(e){
    var layer = e.target;
    TotalFamilias3PConc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias3PConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Famílias clássicas com 3 pessoas: ' + '<b>' +feature.properties.Fam3P_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias3PConc91,
    })
};

var TotalFamilias3PConc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloTotalFamilias3PConc91,
    onEachFeature: onEachFeatureTotalFamilias3PConc91,
});

var slideTotalFamilias3PConc91 = function(){
    var sliderTotalFamilias3PConc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias3PConc91, {
        start: [minTotalFamilias3PConc91, maxTotalFamilias3PConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias3PConc91,
            'max': maxTotalFamilias3PConc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias3PConc91);
    inputNumberMax.setAttribute("value",maxTotalFamilias3PConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias3PConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias3PConc91.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias3PConc91.noUiSlider.on('update',function(e){
        TotalFamilias3PConc91.eachLayer(function(layer){
            if(layer.feature.properties.Fam3P_91>=parseFloat(e[0])&& layer.feature.properties.Fam3P_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias3PConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderTotalFamilias3PConc91.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias3PConc91);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 3 PESSOAS CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 3 PESSOAS EM 2001, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias3PConc01 = 0;
var maxTotalFamilias3PConc01 = 0;
function estiloTotalFamilias3PConc01(feature, latlng) {
    if(feature.properties.Fam3P_01< minTotalFamilias3PConc01 || minTotalFamilias3PConc01 ===0){
        minTotalFamilias3PConc01 = feature.properties.Fam3P_01
    }
    if(feature.properties.Fam3P_01> maxTotalFamilias3PConc01){
        maxTotalFamilias3PConc01 = feature.properties.Fam3P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam3P_01,0.15)
    });
}
function apagarTotalFamilias3PConc01(e){
    var layer = e.target;
    TotalFamilias3PConc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias3PConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas com 3 pessoas: ' + '<b>' +feature.properties.Fam3P_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias3PConc01,
    })
};

var TotalFamilias3PConc01= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamilias3PConc01,
    onEachFeature: onEachFeatureTotalFamilias3PConc01,
});

var slideTotalFamilias3PConc01 = function(){
    var sliderTotalFamilias3PConc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias3PConc01, {
        start: [minTotalFamilias3PConc01, maxTotalFamilias3PConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias3PConc01,
            'max': maxTotalFamilias3PConc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias3PConc01);
    inputNumberMax.setAttribute("value",maxTotalFamilias3PConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias3PConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias3PConc01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias3PConc01.noUiSlider.on('update',function(e){
        TotalFamilias3PConc01.eachLayer(function(layer){
            if(layer.feature.properties.Fam3P_01>=parseFloat(e[0])&& layer.feature.properties.Fam3P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias3PConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderTotalFamilias3PConc01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias3PConc01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 3 PESSOAs CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 3 PESSOAS EM 2011, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias3PConc11 = 0;
var maxTotalFamilias3PConc11 = 0;
function estiloTotalFamilias3PConc11(feature, latlng) {
    if(feature.properties.Fam3P_11< minTotalFamilias3PConc11 || minTotalFamilias3PConc11 ===0){
        minTotalFamilias3PConc11 = feature.properties.Fam3P_11
    }
    if(feature.properties.Fam3P_11> maxTotalFamilias3PConc11){
        maxTotalFamilias3PConc11 = feature.properties.Fam3P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam3P_11,0.15)
    });
}
function apagarTotalFamilias3PConc11(e){
    var layer = e.target;
    TotalFamilias3PConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias3PConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas com 3 pessoas: ' + '<b>' +feature.properties.Fam3P_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias3PConc11,
    })
};

var TotalFamilias3PConc11= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamilias3PConc11,
    onEachFeature: onEachFeatureTotalFamilias3PConc11,
});

var slideTotalFamilias3PConc11 = function(){
    var sliderTotalFamilias3PConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias3PConc11, {
        start: [minTotalFamilias3PConc11, maxTotalFamilias3PConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias3PConc11,
            'max': maxTotalFamilias3PConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias3PConc11);
    inputNumberMax.setAttribute("value",maxTotalFamilias3PConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias3PConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias3PConc11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias3PConc11.noUiSlider.on('update',function(e){
        TotalFamilias3PConc11.eachLayer(function(layer){
            if(layer.feature.properties.Fam3P_11>=parseFloat(e[0])&& layer.feature.properties.Fam3P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias3PConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderTotalFamilias3PConc11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias3PConc11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 3 PESSOAs CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 4 PESSOAS EM 1991, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias4PConc91 = 0;
var maxTotalFamilias4PConc91 = 0;
function estiloTotalFamilias4PConc91(feature, latlng) {
    if(feature.properties.Fam4P_91< minTotalFamilias4PConc91 || minTotalFamilias4PConc91 === 0){
        minTotalFamilias4PConc91 = feature.properties.Fam4P_91
    }
    if(feature.properties.Fam4P_91> maxTotalFamilias4PConc91){
        maxTotalFamilias4PConc91 = feature.properties.Fam4P_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam4P_91,0.15)
    });
}
function apagarTotalFamilias4PConc91(e){
    var layer = e.target;
    TotalFamilias4PConc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias4PConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas com 4 pessoas: ' + '<b>' +feature.properties.Fam4P_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias4PConc91,
    })
};

var TotalFamilias4PConc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloTotalFamilias4PConc91,
    onEachFeature: onEachFeatureTotalFamilias4PConc91,
});

var slideTotalFamilias4PConc91 = function(){
    var sliderTotalFamilias4PConc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias4PConc91, {
        start: [minTotalFamilias4PConc91, maxTotalFamilias4PConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias4PConc91,
            'max': maxTotalFamilias4PConc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias4PConc91);
    inputNumberMax.setAttribute("value",maxTotalFamilias4PConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias4PConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias4PConc91.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias4PConc91.noUiSlider.on('update',function(e){
        TotalFamilias4PConc91.eachLayer(function(layer){
            if(layer.feature.properties.Fam4P_91>=parseFloat(e[0])&& layer.feature.properties.Fam4P_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias4PConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderTotalFamilias4PConc91.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias4PConc91);
}
///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 4 PESSOAS CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 4 PESSOAS EM 2001, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias4PConc01 = 0;
var maxTotalFamilias4PConc01 = 0;
function estiloTotalFamilias4PConc01(feature, latlng) {
    if(feature.properties.Fam4P_01< minTotalFamilias4PConc01 || minTotalFamilias4PConc01 ===0){
        minTotalFamilias4PConc01 = feature.properties.Fam4P_01
    }
    if(feature.properties.Fam4P_01> maxTotalFamilias4PConc01){
        maxTotalFamilias4PConc01 = feature.properties.Fam4P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam4P_01,0.15)
    });
}
function apagarTotalFamilias4PConc01(e){
    var layer = e.target;
    TotalFamilias4PConc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias4PConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Famílias clássicas com 4 pessoas: ' + '<b>' +feature.properties.Fam4P_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias4PConc01,
    })
};

var TotalFamilias4PConc01= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamilias4PConc01,
    onEachFeature: onEachFeatureTotalFamilias4PConc01,
});

var slideTotalFamilias4PConc01 = function(){
    var sliderTotalFamilias4PConc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias4PConc01, {
        start: [minTotalFamilias4PConc01, maxTotalFamilias4PConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias4PConc01,
            'max': maxTotalFamilias4PConc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias4PConc01);
    inputNumberMax.setAttribute("value",maxTotalFamilias4PConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias4PConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias4PConc01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias4PConc01.noUiSlider.on('update',function(e){
        TotalFamilias4PConc01.eachLayer(function(layer){
            if(layer.feature.properties.Fam4P_01>=parseFloat(e[0])&& layer.feature.properties.Fam4P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias4PConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderTotalFamilias4PConc01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias4PConc01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 4 PESSOAs CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 4 PESSOAS EM 2011, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias4PConc11 = 0;
var maxTotalFamilias4PConc11 = 0;
function estiloTotalFamilias4PConc11(feature, latlng) {
    if(feature.properties.Fam4P_11< minTotalFamilias4PConc11 || minTotalFamilias4PConc11 ===0){
        minTotalFamilias4PConc11 = feature.properties.Fam4P_11
    }
    if(feature.properties.Fam4P_11> maxTotalFamilias4PConc11){
        maxTotalFamilias4PConc11 = feature.properties.Fam4P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam4P_11,0.15)
    });
}
function apagarTotalFamilias4PConc11(e){
    var layer = e.target;
    TotalFamilias4PConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias4PConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas com 4 pessoas: ' + '<b>' +feature.properties.Fam4P_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias4PConc11,
    })
};

var TotalFamilias4PConc11= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamilias4PConc11,
    onEachFeature: onEachFeatureTotalFamilias4PConc11,
});

var slideTotalFamilias4PConc11 = function(){
    var sliderTotalFamilias4PConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias4PConc11, {
        start: [minTotalFamilias4PConc11, maxTotalFamilias4PConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias4PConc11,
            'max': maxTotalFamilias4PConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias4PConc11);
    inputNumberMax.setAttribute("value",maxTotalFamilias4PConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias4PConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias4PConc11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias4PConc11.noUiSlider.on('update',function(e){
        TotalFamilias4PConc11.eachLayer(function(layer){
            if(layer.feature.properties.Fam4P_11>=parseFloat(e[0])&& layer.feature.properties.Fam4P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias4PConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderTotalFamilias4PConc11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias4PConc11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 4 PESSOAS CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 5 PESSOAS EM 1991, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias5PConc91 = 0;
var maxTotalFamilias5PConc91 = 0;
function estiloTotalFamilias5PConc91(feature, latlng) {
    if(feature.properties.Fam5P_91< minTotalFamilias5PConc91 || minTotalFamilias5PConc91 === 0){
        minTotalFamilias5PConc91 = feature.properties.Fam5P_91
    }
    if(feature.properties.Fam5P_91> maxTotalFamilias5PConc91){
        maxTotalFamilias5PConc91 = feature.properties.Fam5P_91
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam5P_91,0.15)
    });
}
function apagarTotalFamilias5PConc91(e){
    var layer = e.target;
    TotalFamilias5PConc91.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias5PConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Famílias clássicas com 5 pessoas: ' + '<b>' +feature.properties.Fam5P_91 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias5PConc91,
    })
};

var TotalFamilias5PConc91= L.geoJSON(dadosAbsolutosConcelhos91,{
    pointToLayer:estiloTotalFamilias5PConc91,
    onEachFeature: onEachFeatureTotalFamilias5PConc91,
});

var slideTotalFamilias5PConc91 = function(){
    var sliderTotalFamilias5PConc91 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias5PConc91, {
        start: [minTotalFamilias5PConc91, maxTotalFamilias5PConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias5PConc91,
            'max': maxTotalFamilias5PConc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias5PConc91);
    inputNumberMax.setAttribute("value",maxTotalFamilias5PConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias5PConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias5PConc91.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias5PConc91.noUiSlider.on('update',function(e){
        TotalFamilias5PConc91.eachLayer(function(layer){
            if(layer.feature.properties.Fam5P_91>=parseFloat(e[0])&& layer.feature.properties.Fam5P_91 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias5PConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderTotalFamilias5PConc91.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias5PConc91);
}
///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 5 PESSOAS CONCELHO 1991 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 5 PESSOAS EM 2001, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\
var minTotalFamilias5PConc01 = 0;
var maxTotalFamilias5PConc01 = 0;
function estiloTotalFamilias5PConc01(feature, latlng) {
    if(feature.properties.Fam5P_01< minTotalFamilias5PConc01 || minTotalFamilias5PConc01 ===0){
        minTotalFamilias5PConc01 = feature.properties.Fam5P_01
    }
    if(feature.properties.Fam5P_01> maxTotalFamilias5PConc01){
        maxTotalFamilias5PConc01 = feature.properties.Fam5P_01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam5P_01,0.15)
    });
}
function apagarTotalFamilias5PConc01(e){
    var layer = e.target;
    TotalFamilias5PConc01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias5PConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas com 5 pessoas: ' + '<b>' +feature.properties.Fam5P_01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias5PConc01,
    })
};

var TotalFamilias5PConc01= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamilias5PConc01,
    onEachFeature: onEachFeatureTotalFamilias5PConc01,
});

var slideTotalFamilias5PConc01 = function(){
    var sliderTotalFamilias5PConc01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias5PConc01, {
        start: [minTotalFamilias5PConc01, maxTotalFamilias5PConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias5PConc01,
            'max': maxTotalFamilias5PConc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias5PConc01);
    inputNumberMax.setAttribute("value",maxTotalFamilias5PConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias5PConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias5PConc01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias5PConc01.noUiSlider.on('update',function(e){
        TotalFamilias5PConc01.eachLayer(function(layer){
            if(layer.feature.properties.Fam5P_01>=parseFloat(e[0])&& layer.feature.properties.Fam5P_01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias5PConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderTotalFamilias5PConc01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias5PConc01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 5 PESSOAs CONCELHO 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMILIAS CLÁSSICAS COM 5 PESSOAS EM 2011, por concelho ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias5PConc11 = 0;
var maxTotalFamilias5PConc11 = 0;
function estiloTotalFamilias5PConc11(feature, latlng) {
    if(feature.properties.Fam5P_11< minTotalFamilias5PConc11 || minTotalFamilias5PConc11 ===0){
        minTotalFamilias5PConc11 = feature.properties.Fam5P_11
    }
    if(feature.properties.Fam5P_11> maxTotalFamilias5PConc11){
        maxTotalFamilias5PConc11 = feature.properties.Fam5P_11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Fam5P_11,0.15)
    });
}
function apagarTotalFamilias5PConc11(e){
    var layer = e.target;
    TotalFamilias5PConc11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias5PConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Famílias clássicas com 5 pessoas: ' + '<b>' +feature.properties.Fam5P_11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias5PConc11,
    })
};

var TotalFamilias5PConc11= L.geoJSON(dadosAbsolutosConcelhos1101,{
    pointToLayer:estiloTotalFamilias5PConc11,
    onEachFeature: onEachFeatureTotalFamilias5PConc11,
});

var slideTotalFamilias5PConc11 = function(){
    var sliderTotalFamilias5PConc11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias5PConc11, {
        start: [minTotalFamilias5PConc11, maxTotalFamilias5PConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias5PConc11,
            'max': maxTotalFamilias5PConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias5PConc11);
    inputNumberMax.setAttribute("value",maxTotalFamilias5PConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias5PConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias5PConc11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias5PConc11.noUiSlider.on('update',function(e){
        TotalFamilias5PConc11.eachLayer(function(layer){
            if(layer.feature.properties.Fam5P_11>=parseFloat(e[0])&& layer.feature.properties.Fam5P_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias5PConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderTotalFamilias5PConc11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias5PConc11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS 5 PESSOAS CONCELHO 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------------------ FIM DADOS ABSOLUTOS CONCELHOS ---------------------------\\\\\\\\\\\\\\\\\\\\\\
////////////////////////////////-------------------- VARIAÇÕES CONCELHOS-------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação TOTAL FAMILIAS CLÁSSICAS entre 2011 e 2001 -------------------////

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


var minVarTotFamiliasConc11_01 = 0;
var maxVarTotFamiliasConc11_01 = 0;

function CorVarTotFamiliasConc11_01(d) {
    return  d >= 20  ? '#8c0303' :
        d >= 10 ? '#de1f35' :
        d >= 5   ? '#ff5e6e' :
        d >= 0.13   ? '#f5b3be' :
                ''  ;
}

var legendaVarTotFamiliasConc11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de famílias, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0.13 a 5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotFamiliasConc11_01(feature) {
    if(feature.properties.VarTot1101 <= minVarTotFamiliasConc11_01 || minVarTotFamiliasConc11_01 ===0){
        minVarTotFamiliasConc11_01 = feature.properties.VarTot1101
    }
    if(feature.properties.VarTot1101 > maxVarTotFamiliasConc11_01){
        maxVarTotFamiliasConc11_01 = feature.properties.VarTot1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotFamiliasConc11_01(feature.properties.VarTot1101)};
    }


function apagarVarTotFamiliasConc11_01(e) {
    VarTotFamiliasConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotFamiliasConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot1101.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotFamiliasConc11_01,
    });
}
var VarTotFamiliasConc11_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVarTotFamiliasConc11_01,
    onEachFeature: onEachFeatureVarTotFamiliasConc11_01
});

let slideVarTotFamiliasConc11_01 = function(){
    var sliderVarTotFamiliasConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotFamiliasConc11_01, {
        start: [minVarTotFamiliasConc11_01, maxVarTotFamiliasConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotFamiliasConc11_01,
            'max': maxVarTotFamiliasConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarTotFamiliasConc11_01);
    inputNumberMax.setAttribute("value",maxVarTotFamiliasConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotFamiliasConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotFamiliasConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarTotFamiliasConc11_01.noUiSlider.on('update',function(e){
        VarTotFamiliasConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarTot1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotFamiliasConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderVarTotFamiliasConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarTotFamiliasConc11_01);
} 

///////////////////////////// Fim da Variação do TOTAL DE FAMÍLIAS CLÁSSICAS POR CONCELHOS ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação TOTAL FAMILIAS CLÁSSICAS entre 2001 e 1991 -------------------////

var minVarTotFamiliasConc01_91 = 0;
var maxVarTotFamiliasConc01_91 = 0;

function CorVarTotFamilias01_91Conc(d) {
    return  d == null ? '#a6a6a6' :
        d >= 25  ? '#de1f35' :
        d >= 10 ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -20.32   ? '#9eaad7' :
                ''  ;
}
var legendaVarTotFamiliasConc01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de famílias, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 10 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -20.22 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVarTotFamiliasConc01_91(feature) {
    if(feature.properties.VarTot0191 <= minVarTotFamiliasConc01_91 || minVarTotFamiliasConc01_91 ===0){
        minVarTotFamiliasConc01_91 = feature.properties.VarTot0191
    }
    if(feature.properties.VarTot0191 > maxVarTotFamiliasConc01_91){
        maxVarTotFamiliasConc01_91 = feature.properties.VarTot0191 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotFamilias01_91Conc(feature.properties.VarTot0191)};
    }


function apagarVarTotFamiliasConc01_91(e) {
    VarTotFamiliasConc01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotFamiliasConc01_91(feature, layer) {
    if(feature.properties.VarTot0191 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.VarTot0191.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotFamiliasConc01_91,
    });
}
var VarTotFamiliasConc01_91= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVarTotFamiliasConc01_91,
    onEachFeature: onEachFeatureVarTotFamiliasConc01_91
});

let slideVarTotFamiliasConc01_91 = function(){
    var sliderVarTotFamiliasConc01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotFamiliasConc01_91, {
        start: [minVarTotFamiliasConc01_91, maxVarTotFamiliasConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotFamiliasConc01_91,
            'max': maxVarTotFamiliasConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarTotFamiliasConc01_91);
    inputNumberMax.setAttribute("value",maxVarTotFamiliasConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotFamiliasConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotFamiliasConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarTotFamiliasConc01_91.noUiSlider.on('update',function(e){
        VarTotFamiliasConc01_91.eachLayer(function(layer){
            if (!layer.feature.properties.VarTot0191){
                return false
            }
            if(layer.feature.properties.VarTot0191.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot0191.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotFamiliasConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderVarTotFamiliasConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVarTotFamiliasConc01_91);
} 

//////////////////////--------- Fim da Variação do TOTAL DE FAMILIAS CLÁSSICAS POR CONCELHO ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação TOTAL FAMILIAS CLÁSSICAS 1 PESSOA entre 2011 e 2001 -------------------////

var minVar1PFamiliasConc11_01 = 0;
var maxVar1PFamiliasConc11_01 = 0;

function CorVar1PFamilias11_01Conc(d) {
    return  d >= 80  ? '#8c0303' :
        d >= 60 ? '#de1f35' :
        d >= 40   ? '#ff5e6e' :
        d >= 20.63   ? '#f5b3be' :
                ''  ;
}
var legendaVar1PFamilias11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 1 pessoa, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 80' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 60 a 80' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 40 a 60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 20.63 a 40' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1PFamiliasConc11_01(feature) {
    if(feature.properties.Var1P11_01 <= minVar1PFamiliasConc11_01 || minVar1PFamiliasConc11_01 ===0){
        minVar1PFamiliasConc11_01 = feature.properties.Var1P11_01
    }
    if(feature.properties.Var1P11_01 > maxVar1PFamiliasConc11_01){
        maxVar1PFamiliasConc11_01 = feature.properties.Var1P11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1PFamilias11_01Conc(feature.properties.Var1P11_01)};
    }


function apagarVar1PFamiliasConc11_01(e) {
    Var1PFamiliasConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1PFamiliasConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1P11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1PFamiliasConc11_01,
    });
}
var Var1PFamiliasConc11_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVar1PFamiliasConc11_01,
    onEachFeature: onEachFeatureVar1PFamiliasConc11_01
});

let slideVar1PFamiliasConc11_01 = function(){
    var sliderVar1PFamiliasConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1PFamiliasConc11_01, {
        start: [minVar1PFamiliasConc11_01, maxVar1PFamiliasConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1PFamiliasConc11_01,
            'max': maxVar1PFamiliasConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVar1PFamiliasConc11_01);
    inputNumberMax.setAttribute("value",maxVar1PFamiliasConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1PFamiliasConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1PFamiliasConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVar1PFamiliasConc11_01.noUiSlider.on('update',function(e){
        Var1PFamiliasConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var1P11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1P11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1PFamiliasConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderVar1PFamiliasConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVar1PFamiliasConc11_01);
} 

///////////////////////////// Fim da Variação DE FAMÍLIAS CLÁSSICAS 1 PESSOA POR CONCELHOS ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação FAMILIAS CLÁSSICAS 1 PESSOA entre 2001 e 1991 -------------------////

var minVar1PFamiliasConc01_91 = 999;
var maxVar1PFamiliasConc01_91 = -99;

function CorVar1PFamilias01_91Conc(d) {
    return  d == null ? '#a6a6a6' :
        d >= 75  ? '#8c0303' :
        d >= 50 ? '#de1f35' :
        d >= 25   ? '#ff5e6e' :
        d >= 8.48   ? '#f5b3be' :
                ''  ;
}
var legendaVar1PFamilias01_91Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 1 pessoa, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 8.48 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar1PFamiliasConc01_91(feature) {
    if(feature.properties.Var1P01_91 <= minVar1PFamiliasConc01_91 && feature.properties.Var1P01_91 > null){
        minVar1PFamiliasConc01_91 = feature.properties.Var1P01_91
    }
    if(feature.properties.Var1P01_91 > maxVar1PFamiliasConc01_91){
        maxVar1PFamiliasConc01_91 = feature.properties.Var1P01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1PFamilias01_91Conc(feature.properties.Var1P01_91)};
    }


function apagarVar1PFamiliasConc01_91(e) {
    Var1PFamiliasConc01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1PFamiliasConc01_91(feature, layer) {
    if(feature.properties.Var1P01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1P01_91.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1PFamiliasConc01_91,
    });
}
var Var1PFamiliasConc01_91= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVar1PFamiliasConc01_91,
    onEachFeature: onEachFeatureVar1PFamiliasConc01_91
});

let slideVar1PFamiliasConc01_91 = function(){
    var sliderVar1PFamiliasConc01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1PFamiliasConc01_91, {
        start: [minVar1PFamiliasConc01_91, maxVar1PFamiliasConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1PFamiliasConc01_91,
            'max': maxVar1PFamiliasConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVar1PFamiliasConc01_91);
    inputNumberMax.setAttribute("value",maxVar1PFamiliasConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1PFamiliasConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1PFamiliasConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVar1PFamiliasConc01_91.noUiSlider.on('update',function(e){
        Var1PFamiliasConc01_91.eachLayer(function(layer){
            if (!layer.feature.properties.Var1P01_91){
                return false
            }
            if(layer.feature.properties.Var1P01_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1P01_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1PFamiliasConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderVar1PFamiliasConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVar1PFamiliasConc01_91);
} 

//////////////////////--------- Fim da Variação DE FAMILIAS CLÁSSICAS 1 PESSOA POR CONCELHO ENTRE 2001 E 1991 -------------- \\\\\\

/////////////////////////////------- Variação FAMILIAS CLÁSSICAS 2 PESSOAS entre 2011 e 2001 -------------------////

var minVar2PFamiliasConc11_01 = 99;
var maxVar2PFamiliasConc11_01 = 0;

function CorVar2PFamilias11_01Conc(d) {
    return  d >= 40  ? '#8c0303' :
        d >= 30 ? '#de1f35' :
        d >= 20   ? '#ff5e6e' :
        d >= 13.75  ? '#f5b3be' :
                ''  ;
}
var legendaVar2PFamilias11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 2 pessoas, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 30 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 20 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 13.75 a 20' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2PFamiliasConc11_01(feature) {
    if(feature.properties.Var2P11_01 <= minVar2PFamiliasConc11_01 && feature.properties.Var2P11_01 > null){
        minVar2PFamiliasConc11_01 = feature.properties.Var2P11_01
    }
    if(feature.properties.Var2P11_01 > maxVar2PFamiliasConc11_01){
        maxVar2PFamiliasConc11_01 = feature.properties.Var2P11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2PFamilias11_01Conc(feature.properties.Var2P11_01)};
    }


function apagarVar2PFamiliasConc11_01(e) {
    Var2PFamiliasConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2PFamiliasConc11_01(feature, layer) {
    if(feature.properties.Var2P11_01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2P11_01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2PFamiliasConc11_01,
    });
}
var Var2PFamiliasConc11_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVar2PFamiliasConc11_01,
    onEachFeature: onEachFeatureVar2PFamiliasConc11_01
});

let slideVar2PFamiliasConc11_01 = function(){
    var sliderVar2PFamiliasConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2PFamiliasConc11_01, {
        start: [minVar2PFamiliasConc11_01, maxVar2PFamiliasConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2PFamiliasConc11_01,
            'max': maxVar2PFamiliasConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVar2PFamiliasConc11_01);
    inputNumberMax.setAttribute("value",maxVar2PFamiliasConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2PFamiliasConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2PFamiliasConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVar2PFamiliasConc11_01.noUiSlider.on('update',function(e){
        Var2PFamiliasConc11_01.eachLayer(function(layer){
            if (!layer.feature.properties.Var2P11_01){
                return false
            }
            if(layer.feature.properties.Var2P11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2P11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2PFamiliasConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderVar2PFamiliasConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVar2PFamiliasConc11_01);
} 

//////////////////////--------- Fim da Variação DE FAMILIAS CLÁSSICAS 2 PESSOAS POR CONCELHO ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação FAMILIAS CLÁSSICAS 2 PESSOAS entre 2001 e 1991 -------------------////

var minVar2PFamiliasConc01_91 = 99;
var maxVar2PFamiliasConc01_91 = 0;

function CorVar2PFamilias01_91Conc(d) {
    return  d == null ? '#a6a6a6' :
        d >= 75  ? '#8c0303' :
        d >= 50 ? '#de1f35' :
        d >= 25   ? '#ff5e6e' :
        d >= 1.92   ? '#f5b3be' :
                ''  ;
}
var legendaVar2PFamilias01_91Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 2 pessoas, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 1.92 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2PFamiliasConc01_91(feature) {
    if(feature.properties.Var2P01_91 <= minVar2PFamiliasConc01_91 && feature.properties.Var2P01_91 > null){
        minVar2PFamiliasConc01_91 = feature.properties.Var2P01_91
    }
    if(feature.properties.Var2P01_91 > maxVar2PFamiliasConc01_91){
        maxVar2PFamiliasConc01_91 = feature.properties.Var2P01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2PFamilias01_91Conc(feature.properties.Var2P01_91)};
    }


function apagarVar2PFamiliasConc01_91(e) {
    Var2PFamiliasConc01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2PFamiliasConc01_91(feature, layer) {
    if(feature.properties.Var2P01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2P01_91.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2PFamiliasConc01_91,
    });
}
var Var2PFamiliasConc01_91= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVar2PFamiliasConc01_91,
    onEachFeature: onEachFeatureVar2PFamiliasConc01_91
});

let slideVar2PFamiliasConc01_91 = function(){
    var sliderVar2PFamiliasConc01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2PFamiliasConc01_91, {
        start: [minVar2PFamiliasConc01_91, maxVar2PFamiliasConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2PFamiliasConc01_91,
            'max': maxVar2PFamiliasConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVar2PFamiliasConc01_91);
    inputNumberMax.setAttribute("value",maxVar2PFamiliasConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2PFamiliasConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2PFamiliasConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVar2PFamiliasConc01_91.noUiSlider.on('update',function(e){
        Var2PFamiliasConc01_91.eachLayer(function(layer){
            if (!layer.feature.properties.Var2P01_91){
                return false
            }
            if(layer.feature.properties.Var2P01_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2P01_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2PFamiliasConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderVar2PFamiliasConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVar2PFamiliasConc01_91);
} 

//////////////////////--------- Fim da Variação DE FAMILIAS CLÁSSICAS 2 PESSOAS POR CONCELHO ENTRE 2001 E 1991 -------------- \\\\\\

/////////////////////////////------- Variação FAMILIAS CLÁSSICAS 3 PESSOAS entre 2011 e 2001 -------------------////

var minVar3PFamiliasConc11_01 = 999;
var maxVar3PFamiliasConc11_01 = 0;

function CorVar3PFamilias11_01Conc(d) {
    return  d == null ? '#a6a6a6' :
        d >= 10  ? '#de1f35' :
        d >= 5 ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -10.55  ? '#9eaad7' :
                ''  ;
}
var legendaVar3PFamilias11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 3 pessoas, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10.55 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3PFamiliasConc11_01(feature) {
    if(feature.properties.Var3P11_01 <= minVar3PFamiliasConc11_01 && (feature.properties.Var3P11_01 > null || feature.properties.Var3P11_01 < null)){
        minVar3PFamiliasConc11_01 = feature.properties.Var3P11_01
    }
    if(feature.properties.Var3P11_01 > maxVar3PFamiliasConc11_01){
        maxVar3PFamiliasConc11_01 = feature.properties.Var3P11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3PFamilias11_01Conc(feature.properties.Var3P11_01)};
    }


function apagarVar3PFamiliasConc11_01(e) {
    Var3PFamiliasConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3PFamiliasConc11_01(feature, layer) {
    if(feature.properties.Var3P11_01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3P11_01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3PFamiliasConc11_01,
    });
}
var Var3PFamiliasConc11_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVar3PFamiliasConc11_01,
    onEachFeature: onEachFeatureVar3PFamiliasConc11_01
});

let slideVar3PFamiliasConc11_01 = function(){
    var sliderVar3PFamiliasConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3PFamiliasConc11_01, {
        start: [minVar3PFamiliasConc11_01, maxVar3PFamiliasConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3PFamiliasConc11_01,
            'max': maxVar3PFamiliasConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVar3PFamiliasConc11_01);
    inputNumberMax.setAttribute("value",maxVar3PFamiliasConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3PFamiliasConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3PFamiliasConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVar3PFamiliasConc11_01.noUiSlider.on('update',function(e){
        Var3PFamiliasConc11_01.eachLayer(function(layer){
            if (!layer.feature.properties.Var3P11_01){
                return false
            }
            if(layer.feature.properties.Var3P11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3P11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3PFamiliasConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderVar3PFamiliasConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVar3PFamiliasConc11_01);
} 

//////////////////////--------- Fim da Variação DE FAMILIAS CLÁSSICAS 3 PESSOAS POR CONCELHO ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação FAMILIAS CLÁSSICAS 3 PESSOAS entre 2001 e 1991 -------------------////

var minVar3PFamiliasConc01_91 = 999;
var maxVar3PFamiliasConc01_91 = -10;


function CorVar3PFamilias01_91Conc(d) {
    return  d == null ? '#a6a6a6' :
        d >= 50  ? '#de1f35' :
        d >= 25 ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -9.17   ? '#9eaad7' :
                ''  ;
}
var legendaVar3PFamilias01_91Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 3 pessoas, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -9.17 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3PFamiliasConc01_91(feature) {
    if(feature.properties.Var3P01_91 <= minVar3PFamiliasConc01_91 && (feature.properties.Var3P01_91 > null || feature.properties.Var3P01_91 < null)){
        minVar3PFamiliasConc01_91 = feature.properties.Var3P01_91
    }
    if(feature.properties.Var3P01_91 > maxVar3PFamiliasConc01_91){
        maxVar3PFamiliasConc01_91 = feature.properties.Var3P01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3PFamilias01_91Conc(feature.properties.Var3P01_91)};
    }


function apagarVar3PFamiliasConc01_91(e) {
    Var3PFamiliasConc01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3PFamiliasConc01_91(feature, layer) {
    if(feature.properties.Var3P01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3P01_91.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3PFamiliasConc01_91,
    });
}
var Var3PFamiliasConc01_91= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVar3PFamiliasConc01_91,
    onEachFeature: onEachFeatureVar3PFamiliasConc01_91
});

let slideVar3PFamiliasConc01_91 = function(){
    var sliderVar3PFamiliasConc01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3PFamiliasConc01_91, {
        start: [minVar3PFamiliasConc01_91, maxVar3PFamiliasConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3PFamiliasConc01_91,
            'max': maxVar3PFamiliasConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVar3PFamiliasConc01_91);
    inputNumberMax.setAttribute("value",maxVar3PFamiliasConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3PFamiliasConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3PFamiliasConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVar3PFamiliasConc01_91.noUiSlider.on('update',function(e){
        Var3PFamiliasConc01_91.eachLayer(function(layer){
            if (!layer.feature.properties.Var3P01_91){
                return false
            }
            if(layer.feature.properties.Var3P01_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3P01_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3PFamiliasConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderVar3PFamiliasConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVar3PFamiliasConc01_91);
} 

//////////////////////--------- Fim da Variação DE FAMILIAS CLÁSSICAS 3 PESSOAS POR CONCELHO ENTRE 2001 E 1991 -------------- \\\\\\

/////////////////////////////------- Variação FAMILIAS CLÁSSICAS 4 PESSOAS entre 2011 e 2001 -------------------////

var minVar4PFamiliasConc11_01 = 0;
var maxVar4PFamiliasConc11_01 = 0;

function CorVar4PFamilias11_01Conc(d) {
    return  d >= 0  ? '#f5b3be' :
        d >= -10 ? '#9ebbd7' :
        d >= -20   ? '#2288bf' :
        d >= -26.10  ? '#155273' :
                ''  ;
}
var legendaVar4PFamilias11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 4 pessoas, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' 25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' 0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -9.17 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4PFamiliasConc11_01(feature) {
    if(feature.properties.Var4P11_01 <= minVar4PFamiliasConc11_01 || minVar4PFamiliasConc11_01 ===0){
        minVar4PFamiliasConc11_01 = feature.properties.Var4P11_01
    }
    if(feature.properties.Var4P11_01 > maxVar4PFamiliasConc11_01){
        maxVar4PFamiliasConc11_01 = feature.properties.Var4P11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4PFamilias11_01Conc(feature.properties.Var4P11_01)};
    }


function apagarVar4PFamiliasConc11_01(e) {
    Var4PFamiliasConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4PFamiliasConc11_01(feature, layer) {
    if(feature.properties.Var4P11_01 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4P11_01.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4PFamiliasConc11_01,
    });
}
var Var4PFamiliasConc11_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVar4PFamiliasConc11_01,
    onEachFeature: onEachFeatureVar4PFamiliasConc11_01
});

let slideVar4PFamiliasConc11_01 = function(){
    var sliderVar4PFamiliasConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4PFamiliasConc11_01, {
        start: [minVar4PFamiliasConc11_01, maxVar4PFamiliasConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4PFamiliasConc11_01,
            'max': maxVar4PFamiliasConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVar4PFamiliasConc11_01);
    inputNumberMax.setAttribute("value",maxVar4PFamiliasConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4PFamiliasConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4PFamiliasConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVar4PFamiliasConc11_01.noUiSlider.on('update',function(e){
        Var4PFamiliasConc11_01.eachLayer(function(layer){
            if (!layer.feature.properties.Var4P11_01){
                return false
            }
            if(layer.feature.properties.Var4P11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4P11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4PFamiliasConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderVar4PFamiliasConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVar4PFamiliasConc11_01);
} 

//////////////////////--------- Fim da Variação DE FAMILIAS CLÁSSICAS 4 PESSOAS POR CONCELHO ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação FAMILIAS CLÁSSICAS 4 PESSOAS entre 2001 e 1991 -------------------////

var minVar4PFamiliasConc01_91 = 0;
var maxVar4PFamiliasConc01_91 = 0;

function CorVar4PFamilias01_91Conc(d) {
    return  d == null ? '#a6a6a6' :
        d >= 40  ? '#de1f35' :
        d >= 20 ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -26.38   ? '#9eaad7' :
                ''  ;
}
var legendaVar4PFamilias01_91Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 4 pessoas, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  20 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -26.38 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4PFamiliasConc01_91(feature) {
    if(feature.properties.Var4P01_91 <= minVar4PFamiliasConc01_91 || minVar4PFamiliasConc01_91 ===0){
        minVar4PFamiliasConc01_91 = feature.properties.Var4P01_91
    }
    if(feature.properties.Var4P01_91 > maxVar4PFamiliasConc01_91){
        maxVar4PFamiliasConc01_91 = feature.properties.Var4P01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4PFamilias01_91Conc(feature.properties.Var4P01_91)};
    }


function apagarVar4PFamiliasConc01_91(e) {
    Var4PFamiliasConc01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4PFamiliasConc01_91(feature, layer) {
    if(feature.properties.Var4P01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4P01_91.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4PFamiliasConc01_91,
    });
}
var Var4PFamiliasConc01_91= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVar4PFamiliasConc01_91,
    onEachFeature: onEachFeatureVar4PFamiliasConc01_91
});

let slideVar4PFamiliasConc01_91 = function(){
    var sliderVar4PFamiliasConc01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4PFamiliasConc01_91, {
        start: [minVar4PFamiliasConc01_91, maxVar4PFamiliasConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4PFamiliasConc01_91,
            'max': maxVar4PFamiliasConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVar4PFamiliasConc01_91);
    inputNumberMax.setAttribute("value",maxVar4PFamiliasConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4PFamiliasConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4PFamiliasConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVar4PFamiliasConc01_91.noUiSlider.on('update',function(e){
        Var4PFamiliasConc01_91.eachLayer(function(layer){
            if (!layer.feature.properties.Var4P01_91){
                return false
            }
            if(layer.feature.properties.Var4P01_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4P01_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4PFamiliasConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderVar4PFamiliasConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVar4PFamiliasConc01_91);
} 

//////////////////////--------- Fim da Variação DE FAMILIAS CLÁSSICAS 4 PESSOAS POR CONCELHO ENTRE 2001 E 1991 -------------- \\\\\\

/////////////////////////////------- Variação FAMILIAS CLÁSSICAS 5 PESSOAS entre 2011 e 2001 -------------------////

var minVar5PFamiliasConc11_01 = 0;
var maxVar5PFamiliasConc11_01 = -99;

function CorVar5PFamilias11_01Conc(d) {
    return  d == null ? '#a6a6a6' :
        d >= -10  ? '#9ebbd7' :
        d >= -20 ? '#2288bf' :
        d >= -30   ? '#155273' :
        d >= -42.84   ? '#0b2c40' :
                ''  ;
}
var legendaVar5PFamilias11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 5 pessoas, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + '  -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + '  -30 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -42.84 a -30' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar5PFamiliasConc11_01(feature) {
    if(feature.properties.Var5P11_01 <= minVar5PFamiliasConc11_01 || minVar5PFamiliasConc11_01 ===0){
        minVar5PFamiliasConc11_01 = feature.properties.Var5P11_01
    }
    if(feature.properties.Var5P11_01 > maxVar5PFamiliasConc11_01){
        maxVar5PFamiliasConc11_01 = feature.properties.Var5P11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar5PFamilias11_01Conc(feature.properties.Var5P11_01)};
    }


function apagarVar5PFamiliasConc11_01(e) {
    Var5PFamiliasConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar5PFamiliasConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var5P11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar5PFamiliasConc11_01,
    });
}
var Var5PFamiliasConc11_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVar5PFamiliasConc11_01,
    onEachFeature: onEachFeatureVar5PFamiliasConc11_01
});

let slideVar5PFamiliasConc11_01 = function(){
    var sliderVar5PFamiliasConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar5PFamiliasConc11_01, {
        start: [minVar5PFamiliasConc11_01, maxVar5PFamiliasConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar5PFamiliasConc11_01,
            'max': maxVar5PFamiliasConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVar5PFamiliasConc11_01);
    inputNumberMax.setAttribute("value",maxVar5PFamiliasConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVar5PFamiliasConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar5PFamiliasConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVar5PFamiliasConc11_01.noUiSlider.on('update',function(e){
        Var5PFamiliasConc11_01.eachLayer(function(layer){
            if (!layer.feature.properties.Var5P11_01){
                return false
            }
            if(layer.feature.properties.Var5P11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var5P11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar5PFamiliasConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderVar5PFamiliasConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVar5PFamiliasConc11_01);
} 

//////////////////////--------- Fim da Variação DE FAMILIAS CLÁSSICAS 5 PESSOAS POR CONCELHO ENTRE 2011 E 2001 -------------- \\\\\\

/////////////////////////////------- Variação FAMILIAS CLÁSSICAS 5 PESSOAS entre 2001 e 1991 -------------------////

var minVar5PFamiliasConc01_91 = 99;
var maxVar5PFamiliasConc01_91 = -99;

function CorVar5PFamilias01_91Conc(d) {
    return  d == null ? '#a6a6a6' :
        d >= -20  ? '#9ebbd7' :
        d >= -30 ? '#2288bf' :
        d >= -40   ? '#155273' :
        d >= -56.89   ? '#0b2c40' :
                ''  ;
}
var legendaVar5PFamilias01_91Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 5 pessoas, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + '  > -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -30 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -40 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -56.89 a -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a6a6a6"></i>' + ' sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar5PFamiliasConc01_91(feature) {
    if(feature.properties.Var5P01_91 <= minVar5PFamiliasConc01_91 && (feature.properties.Var5P01_91 > null || feature.properties.Var5P01_91 < null)){
        minVar5PFamiliasConc01_91 = feature.properties.Var5P01_91
    }
    if(feature.properties.Var5P01_91 > maxVar5PFamiliasConc01_91 && (feature.properties.Var5P01_91 > null || feature.properties.Var5P01_91 < null)){
        maxVar5PFamiliasConc01_91 = feature.properties.Var5P01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar5PFamilias01_91Conc(feature.properties.Var5P01_91)};
    }


function apagarVar5PFamiliasConc01_91(e) {
    Var5PFamiliasConc01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar5PFamiliasConc01_91(feature, layer) {
    if(feature.properties.Var5P01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var5P01_91.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar5PFamiliasConc01_91,
    });
}
var Var5PFamiliasConc01_91= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloVar5PFamiliasConc01_91,
    onEachFeature: onEachFeatureVar5PFamiliasConc01_91
});

let slideVar5PFamiliasConc01_91 = function(){
    var sliderVar5PFamiliasConc01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar5PFamiliasConc01_91, {
        start: [minVar5PFamiliasConc01_91, maxVar5PFamiliasConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar5PFamiliasConc01_91,
            'max': maxVar5PFamiliasConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVar5PFamiliasConc01_91);
    inputNumberMax.setAttribute("value",maxVar5PFamiliasConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVar5PFamiliasConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar5PFamiliasConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVar5PFamiliasConc01_91.noUiSlider.on('update',function(e){
        Var5PFamiliasConc01_91.eachLayer(function(layer){
            if (!layer.feature.properties.Var5P01_91){
                return false
            }
            if(layer.feature.properties.Var5P01_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var5P01_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar5PFamiliasConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVar5PFamiliasConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVar5PFamiliasConc01_91);
} 

//////////////////////--------- Fim da Variação DE FAMILIAS CLÁSSICAS 5 PESSOAS POR CONCELHO ENTRE 2001 E 1991 -------------- \\\\\\
//////////////////////------------------ FIM VARIAÇÕES POR CONHCELHO ----------------------\\\\\\\\\\\\\\\\\

////////////////////-------------- PERCENTAGEM CONCELHOS --------------------\\\\\\\\\\\\\\\\\\\\\\\\
//////------- Percentagem Total de Familias com 1 pessoa por Concelho em 1991-----////



var minPerFamiliaConc1P_91 = 0;
var maxPerFamiliaConc1P_91 = 0;

function CorPerFam1PConc(d) {
    return d >= 28.02 ? '#8c0303' :
        d >= 24.33  ? '#de1f35' :
        d >= 18.17 ? '#ff5e6e' :
        d >= 12.02   ? '#f5b3be' :
        d >= 5.86   ? '#F2C572' :
                ''  ;
}
var legendaPerFam1PConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 28.02' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 24.33 - 28.02' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 18.17 - 24.33' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 12.02 - 18.17' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 5.86 - 12.02' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloPerFamiliaConc1P_91(feature) {
    if( feature.properties.Per1P_91 <= minPerFamiliaConc1P_91 || minPerFamiliaConc1P_91 === 0){
        minPerFamiliaConc1P_91 = feature.properties.Per1P_91
    }
    if(feature.properties.Per1P_91 >= maxPerFamiliaConc1P_91 ){
        maxPerFamiliaConc1P_91 = feature.properties.Per1P_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam1PConc(feature.properties.Per1P_91)
    };
}
function apagarPerFamiliaConc1P_91(e) {
    PerFamiliaConc1P_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc1P_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per1P_91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc1P_91,
    });
}
var PerFamiliaConc1P_91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPerFamiliaConc1P_91,
    onEachFeature: onEachFeaturePerFamiliaConc1P_91
});
let slidePerFamiliaConc1P_91 = function(){
    var sliderPerFamiliaConc1P_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc1P_91, {
        start: [minPerFamiliaConc1P_91, maxPerFamiliaConc1P_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc1P_91,
            'max': maxPerFamiliaConc1P_91
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc1P_91);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc1P_91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc1P_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc1P_91.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc1P_91.noUiSlider.on('update',function(e){
        PerFamiliaConc1P_91.eachLayer(function(layer){
            if(layer.feature.properties.Per1P_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per1P_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc1P_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderPerFamiliaConc1P_91.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc1P_91);
} 

/////////////////////////////// Fim da Percentagem de Familias de 1 pessoa em 1991 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 1 pessoa por Concelho em 2001-----////

var minPerFamiliaConc1P_01 = 0;
var maxPerFamiliaConc1P_01 = 0;


function EstiloPerFamiliaConc1P_01(feature) {
    if( feature.properties.Per1P_01 <= minPerFamiliaConc1P_01 || minPerFamiliaConc1P_01 === 0){
        minPerFamiliaConc1P_01 = feature.properties.Per1P_01
    }
    if(feature.properties.Per1P_01 >= maxPerFamiliaConc1P_01 ){
        maxPerFamiliaConc1P_01 = feature.properties.Per1P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam1PConc(feature.properties.Per1P_01)
    };
}
function apagarPerFamiliaConc1P_01(e) {
    PerFamiliaConc1P_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc1P_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per1P_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc1P_01,
    });
}
var PerFamiliaConc1P_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloPerFamiliaConc1P_01,
    onEachFeature: onEachFeaturePerFamiliaConc1P_01
});
let slidePerFamiliaConc1P_01 = function(){
    var sliderPerFamiliaConc1P_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc1P_01, {
        start: [minPerFamiliaConc1P_01, maxPerFamiliaConc1P_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc1P_01,
            'max': maxPerFamiliaConc1P_01
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc1P_01);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc1P_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc1P_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc1P_01.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc1P_01.noUiSlider.on('update',function(e){
        PerFamiliaConc1P_01.eachLayer(function(layer){
            if(layer.feature.properties.Per1P_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per1P_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc1P_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderPerFamiliaConc1P_01.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc1P_01);
} 

/////////////////////////////// Fim da Percentagem de Familias de 1 pessoa em 2001 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 1 pessoa por Concelho em 2011-----////

var minPerFamiliaConc1P_11 = 0;
var maxPerFamiliaConc1P_11 = 0;



function EstiloPerFamiliaConc1P_11(feature) {
    if( feature.properties.Per1P_11 <= minPerFamiliaConc1P_11 || minPerFamiliaConc1P_11 === 0){
        minPerFamiliaConc1P_11 = feature.properties.Per1P_11
    }
    if(feature.properties.Per1P_11 >= maxPerFamiliaConc1P_11 ){
        maxPerFamiliaConc1P_11 = feature.properties.Per1P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam1PConc(feature.properties.Per1P_11)
    };
}
function apagarPerFamiliaConc1P_11(e) {
    PerFamiliaConc1P_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc1P_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per1P_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc1P_11,
    });
}
var PerFamiliaConc1P_11= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloPerFamiliaConc1P_11,
    onEachFeature: onEachFeaturePerFamiliaConc1P_11
});
let slidePerFamiliaConc1P_11 = function(){
    var sliderPerFamiliaConc1P_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc1P_11, {
        start: [minPerFamiliaConc1P_11, maxPerFamiliaConc1P_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc1P_11,
            'max': maxPerFamiliaConc1P_11
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc1P_11);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc1P_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc1P_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc1P_11.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc1P_11.noUiSlider.on('update',function(e){
        PerFamiliaConc1P_11.eachLayer(function(layer){
            if(layer.feature.properties.Per1P_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per1P_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc1P_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderPerFamiliaConc1P_11.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc1P_11);
} 

/////////////////////////////// Fim da Percentagem de Familias de 1 pessoa em 2011 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 2 pessoa por Concelho em 1991-----////

var minPerFamiliaConc2P_91 = 0;
var maxPerFamiliaConc2P_91 = 0;

function CorPerFam2PConc(d) {
    return d >= 31.55 ? '#8c0303' :
        d >= 28.85  ? '#de1f35' :
        d >= 24.34 ? '#ff5e6e' :
        d >= 19.84   ? '#f5b3be' :
        d >= 15.33   ? '#F2C572' :
                ''  ;
}
var legendaPerFam2PConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 31.55' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 28.85 - 31.55' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 24.34 - 28.85' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 19.84 - 24.34' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 15.33 - 19.84' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloPerFamiliaConc2P_91(feature) {
    if( feature.properties.Per2P_91 <= minPerFamiliaConc2P_91 || minPerFamiliaConc2P_91 === 0){
        minPerFamiliaConc2P_91 = feature.properties.Per2P_91
    }
    if(feature.properties.Per2P_91 >= maxPerFamiliaConc2P_91 ){
        maxPerFamiliaConc2P_91 = feature.properties.Per2P_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam2PConc(feature.properties.Per2P_91)
    };
}
function apagarPerFamiliaConc2P_91(e) {
    PerFamiliaConc2P_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc2P_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per2P_91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc2P_91,
    });
}
var PerFamiliaConc2P_91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPerFamiliaConc2P_91,
    onEachFeature: onEachFeaturePerFamiliaConc2P_91
});
let slidePerFamiliaConc2P_91 = function(){
    var sliderPerFamiliaConc2P_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc2P_91, {
        start: [minPerFamiliaConc2P_91, maxPerFamiliaConc2P_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc2P_91,
            'max': maxPerFamiliaConc2P_91
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc2P_91);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc2P_91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc2P_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc2P_91.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc2P_91.noUiSlider.on('update',function(e){
        PerFamiliaConc2P_91.eachLayer(function(layer){
            if(layer.feature.properties.Per2P_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per2P_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc2P_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderPerFamiliaConc2P_91.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc2P_91);
} 

/////////////////////////////// Fim da Percentagem de Familias de 2 pessoa em 1991 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 2 pessoa por Concelho em 2001-----////

var minPerFamiliaConc2P_01 = 0;
var maxPerFamiliaConc2P_01 = 0;



function EstiloPerFamiliaConc2P_01(feature) {
    if( feature.properties.Per2P_01 <= minPerFamiliaConc2P_01 || minPerFamiliaConc2P_01 === 0){
        minPerFamiliaConc2P_01 = feature.properties.Per2P_01
    }
    if(feature.properties.Per2P_01 >= maxPerFamiliaConc2P_01 ){
        maxPerFamiliaConc2P_01 = feature.properties.Per2P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam2PConc(feature.properties.Per2P_01)
    };
}
function apagarPerFamiliaConc2P_01(e) {
    PerFamiliaConc2P_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc2P_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per2P_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc2P_01,
    });
}
var PerFamiliaConc2P_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloPerFamiliaConc2P_01,
    onEachFeature: onEachFeaturePerFamiliaConc2P_01
});
let slidePerFamiliaConc2P_01 = function(){
    var sliderPerFamiliaConc2P_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc2P_01, {
        start: [minPerFamiliaConc2P_01, maxPerFamiliaConc2P_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc2P_01,
            'max': maxPerFamiliaConc2P_01
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc2P_01);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc2P_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc2P_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc2P_01.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc2P_01.noUiSlider.on('update',function(e){
        PerFamiliaConc2P_01.eachLayer(function(layer){
            if(layer.feature.properties.Per2P_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per2P_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc2P_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderPerFamiliaConc2P_01.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc2P_01);
} 

/////////////////////////////// Fim da Percentagem de Familias de 2 pessoa em 2001 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 2 pessoa por Concelho em 2011-----////

var minPerFamiliaConc2P_11 = 0;
var maxPerFamiliaConc2P_11 = 0;


function EstiloPerFamiliaConc2P_11(feature) {
    if( feature.properties.Per2P_11 <= minPerFamiliaConc2P_11 || minPerFamiliaConc2P_11 === 0){
        minPerFamiliaConc2P_11 = feature.properties.Per2P_11
    }
    if(feature.properties.Per2P_11 >= maxPerFamiliaConc2P_11 ){
        maxPerFamiliaConc2P_11 = feature.properties.Per2P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam2PConc(feature.properties.Per2P_11)
    };
}
function apagarPerFamiliaConc2P_11(e) {
    PerFamiliaConc2P_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc2P_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per2P_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc2P_11,
    });
}
var PerFamiliaConc2P_11= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloPerFamiliaConc2P_11,
    onEachFeature: onEachFeaturePerFamiliaConc2P_11
});
let slidePerFamiliaConc2P_11 = function(){
    var sliderPerFamiliaConc2P_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc2P_11, {
        start: [minPerFamiliaConc2P_11, maxPerFamiliaConc2P_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc2P_11,
            'max': maxPerFamiliaConc2P_11
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc2P_11);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc2P_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc2P_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc2P_11.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc2P_11.noUiSlider.on('update',function(e){
        PerFamiliaConc2P_11.eachLayer(function(layer){
            if(layer.feature.properties.Per2P_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per2P_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc2P_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderPerFamiliaConc2P_11.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc2P_11);
} 

/////////////////////////////// Fim da Percentagem de Familias de 2 pessoa em 2011 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 3 pessoa por Concelho em 1991-----////

var minPerFamiliaConc3P_91 = 0;
var maxPerFamiliaConc3P_91 = 0;

function CorPerFam3PConc(d) {
    return d >= 31 ? '#8c0303' :
        d >= 28.8  ? '#de1f35' :
        d >= 25.1  ? '#ff5e6e' :
        d >= 21.3   ? '#f5b3be' :
        d >= 17.56   ? '#F2CF8D' :
                ''  ;
}

var legendaPerFam3PConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 28.8 - 31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 25.1 - 28.8' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 21.3 - 25.1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2CF8D"></i>' + ' 17.56 - 21.3' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerFamiliaConc3P_91(feature) {
    if( feature.properties.Per3P_91 <= minPerFamiliaConc3P_91 || minPerFamiliaConc3P_91 === 0){
        minPerFamiliaConc3P_91 = feature.properties.Per3P_91
    }
    if(feature.properties.Per3P_91 >= maxPerFamiliaConc3P_91 ){
        maxPerFamiliaConc3P_91 = feature.properties.Per3P_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam3PConc(feature.properties.Per3P_91)
    };
}
function apagarPerFamiliaConc3P_91(e) {
    PerFamiliaConc3P_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc3P_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per3P_91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc3P_91,
    });
}
var PerFamiliaConc3P_91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPerFamiliaConc3P_91,
    onEachFeature: onEachFeaturePerFamiliaConc3P_91
});
let slidePerFamiliaConc3P_91 = function(){
    var sliderPerFamiliaConc3P_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc3P_91, {
        start: [minPerFamiliaConc3P_91, maxPerFamiliaConc3P_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc3P_91,
            'max': maxPerFamiliaConc3P_91
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc3P_91);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc3P_91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc3P_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc3P_91.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc3P_91.noUiSlider.on('update',function(e){
        PerFamiliaConc3P_91.eachLayer(function(layer){
            if(layer.feature.properties.Per3P_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per3P_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc3P_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderPerFamiliaConc3P_91.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc3P_91);
} 

/////////////////////////////// Fim da Percentagem de Familias de 3 pessoa em 1991 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 3 pessoa por Concelho em 2001-----////

var minPerFamiliaConc3P_01 = 0;
var maxPerFamiliaConc3P_01 = 0;



function EstiloPerFamiliaConc3P_01(feature) {
    if( feature.properties.Per3P_01 <= minPerFamiliaConc3P_01 || minPerFamiliaConc3P_01 === 0){
        minPerFamiliaConc3P_01 = feature.properties.Per3P_01
    }
    if(feature.properties.Per3P_01 >= maxPerFamiliaConc3P_01 ){
        maxPerFamiliaConc3P_01 = feature.properties.Per3P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam3PConc(feature.properties.Per3P_01)
    };
}
function apagarPerFamiliaConc3P_01(e) {
    PerFamiliaConc3P_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc3P_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per3P_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc3P_01,
    });
}
var PerFamiliaConc3P_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloPerFamiliaConc3P_01,
    onEachFeature: onEachFeaturePerFamiliaConc3P_01
});
let slidePerFamiliaConc3P_01 = function(){
    var sliderPerFamiliaConc3P_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc3P_01, {
        start: [minPerFamiliaConc3P_01, maxPerFamiliaConc3P_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc3P_01,
            'max': maxPerFamiliaConc3P_01
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc3P_01);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc3P_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc3P_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc3P_01.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc3P_01.noUiSlider.on('update',function(e){
        PerFamiliaConc3P_01.eachLayer(function(layer){
            if(layer.feature.properties.Per3P_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per3P_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc3P_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderPerFamiliaConc3P_01.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc3P_01);
} 

/////////////////////////////// Fim da Percentagem de Familias de 3 pessoa em 2001 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 3 pessoa por Concelho em 2011-----////

var minPerFamiliaConc3P_11 = 0;
var maxPerFamiliaConc3P_11 = 0;

function EstiloPerFamiliaConc3P_11(feature) {
    if( feature.properties.Per3P_11 <= minPerFamiliaConc3P_11 || minPerFamiliaConc3P_11 === 0){
        minPerFamiliaConc3P_11 = feature.properties.Per3P_11
    }
    if(feature.properties.Per3P_11 >= maxPerFamiliaConc3P_11 ){
        maxPerFamiliaConc3P_11 = feature.properties.Per3P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam3PConc(feature.properties.Per3P_11)
    };
}
function apagarPerFamiliaConc3P_11(e) {
    PerFamiliaConc3P_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc3P_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per3P_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc3P_11,
    });
}
var PerFamiliaConc3P_11= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloPerFamiliaConc3P_11,
    onEachFeature: onEachFeaturePerFamiliaConc3P_11
});
let slidePerFamiliaConc3P_11 = function(){
    var sliderPerFamiliaConc3P_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc3P_11, {
        start: [minPerFamiliaConc3P_11, maxPerFamiliaConc3P_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc3P_11,
            'max': maxPerFamiliaConc3P_11
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc3P_11);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc3P_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc3P_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc3P_11.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc3P_11.noUiSlider.on('update',function(e){
        PerFamiliaConc3P_11.eachLayer(function(layer){
            if(layer.feature.properties.Per3P_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per3P_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc3P_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderPerFamiliaConc3P_11.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc3P_11);
} 

/////////////////////////////// Fim da Percentagem de Familias de 3 pessoa em 2011 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 4 pessoa por Concelho em 1991-----////

var minPerFamiliaConc4P_91 = 0;
var maxPerFamiliaConc4P_91 = 0;

function CorPerFam4PConc(d) {
    return d >= 25.5 ? '#8c0303' :
        d >= 23.2  ? '#de1f35' :
        d >= 19.4  ? '#ff5e6e' :
        d >= 15.6   ? '#f5b3be' :
        d >= 11.77   ? '#F2CF8D' :
                ''  ;
}
var legendaPerFam4PConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 25.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 23.2 - 25.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 19.4 - 23.2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 15.6 - 19.4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2CF8D"></i>' + ' 11.77 - 15.6' + '<br>'


    $(legendaA).append(symbolsContainer); 
}
function EstiloPerFamiliaConc4P_91(feature) {
    if( feature.properties.Per4P_91 <= minPerFamiliaConc4P_91 || minPerFamiliaConc4P_91 === 0){
        minPerFamiliaConc4P_91 = feature.properties.Per4P_91
    }
    if(feature.properties.Per4P_91 >= maxPerFamiliaConc4P_91 ){
        maxPerFamiliaConc4P_91 = feature.properties.Per4P_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam4PConc(feature.properties.Per4P_91)
    };
}
function apagarPerFamiliaConc4P_91(e) {
    PerFamiliaConc4P_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc4P_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per4P_91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc4P_91,
    });
}
var PerFamiliaConc4P_91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPerFamiliaConc4P_91,
    onEachFeature: onEachFeaturePerFamiliaConc4P_91
});
let slidePerFamiliaConc4P_91 = function(){
    var sliderPerFamiliaConc4P_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc4P_91, {
        start: [minPerFamiliaConc4P_91, maxPerFamiliaConc4P_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc4P_91,
            'max': maxPerFamiliaConc4P_91
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc4P_91);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc4P_91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc4P_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc4P_91.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc4P_91.noUiSlider.on('update',function(e){
        PerFamiliaConc4P_91.eachLayer(function(layer){
            if(layer.feature.properties.Per4P_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per4P_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc4P_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderPerFamiliaConc4P_91.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc4P_91);
} 

/////////////////////////////// Fim da Percentagem de Familias de 4 pessoa em 1991 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 4 pessoa por Concelho em 2001-----////

var minPerFamiliaConc4P_01 = 0;
var maxPerFamiliaConc4P_01 = 0;

function EstiloPerFamiliaConc4P_01(feature) {
    if( feature.properties.Per4P_01 <= minPerFamiliaConc4P_01 || minPerFamiliaConc4P_01 === 0){
        minPerFamiliaConc4P_01 = feature.properties.Per4P_01
    }
    if(feature.properties.Per4P_01 >= maxPerFamiliaConc4P_01 ){
        maxPerFamiliaConc4P_01 = feature.properties.Per4P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam4PConc(feature.properties.Per4P_01)
    };
}
function apagarPerFamiliaConc4P_01(e) {
    PerFamiliaConc4P_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc4P_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per4P_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc4P_01,
    });
}
var PerFamiliaConc4P_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloPerFamiliaConc4P_01,
    onEachFeature: onEachFeaturePerFamiliaConc4P_01
});
let slidePerFamiliaConc4P_01 = function(){
    var sliderPerFamiliaConc4P_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc4P_01, {
        start: [minPerFamiliaConc4P_01, maxPerFamiliaConc4P_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc4P_01,
            'max': maxPerFamiliaConc4P_01
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc4P_01);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc4P_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc4P_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc4P_01.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc4P_01.noUiSlider.on('update',function(e){
        PerFamiliaConc4P_01.eachLayer(function(layer){
            if(layer.feature.properties.Per4P_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per4P_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc4P_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderPerFamiliaConc4P_01.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc4P_01);
} 

/////////////////////////////// Fim da Percentagem de Familias de 4 pessoas em 2001 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 4 pessoa por Concelho em 2011-----////

var minPerFamiliaConc4P_11 = 0;
var maxPerFamiliaConc4P_11 = 0;

function EstiloPerFamiliaConc4P_11(feature) {
    if( feature.properties.Per4P_11 <= minPerFamiliaConc4P_11 || minPerFamiliaConc4P_11 === 0){
        minPerFamiliaConc4P_11 = feature.properties.Per4P_11
    }
    if(feature.properties.Per4P_11 >= maxPerFamiliaConc4P_11 ){
        maxPerFamiliaConc4P_11 = feature.properties.Per4P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam4PConc(feature.properties.Per4P_11)
    };
}
function apagarPerFamiliaConc4P_11(e) {
    PerFamiliaConc4P_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc4P_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per4P_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc4P_11,
    });
}
var PerFamiliaConc4P_11= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloPerFamiliaConc4P_11,
    onEachFeature: onEachFeaturePerFamiliaConc4P_11
});
let slidePerFamiliaConc4P_11 = function(){
    var sliderPerFamiliaConc4P_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc4P_11, {
        start: [minPerFamiliaConc4P_11, maxPerFamiliaConc4P_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc4P_11,
            'max': maxPerFamiliaConc4P_11
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc4P_11);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc4P_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc4P_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc4P_11.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc4P_11.noUiSlider.on('update',function(e){
        PerFamiliaConc4P_11.eachLayer(function(layer){
            if(layer.feature.properties.Per4P_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per4P_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc4P_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderPerFamiliaConc4P_11.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc4P_11);
} 

/////////////////////////////// Fim da Percentagem de Familias de 4 pessoa em 2011 Concelho -------------- \\\\\\
//////------- Percentagem Total de Familias com 5 pessoa por Concelho em 1991-----////

var minPerFamiliaConc5P_91 = 0;
var maxPerFamiliaConc5P_91 = 0;

function CorPerFam5PConc(d) {
    return d >= 29.4 ? '#8c0303' :
        d >= 25.4  ? '#de1f35' :
        d >= 18.6  ? '#ff5e6e' :
        d >= 11.9   ? '#f5b3be' :
        d >= 5.13   ? '#F2CF8D' :
                ''  ;
}
var legendaPerFam5PConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 29.4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 25.4 - 29.4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 18.6 - 25.4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 11.9 - 18.6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2CF8D"></i>' + ' 5.13 - 11.9' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerFamiliaConc5P_91(feature) {
    if( feature.properties.Per5P_91 <= minPerFamiliaConc5P_91 || minPerFamiliaConc5P_91 === 0){
        minPerFamiliaConc5P_91 = feature.properties.Per5P_91
    }
    if(feature.properties.Per5P_91 >= maxPerFamiliaConc5P_91 ){
        maxPerFamiliaConc5P_91 = feature.properties.Per5P_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam5PConc(feature.properties.Per5P_91)
    };
}
function apagarPerFamiliaConc5P_91(e) {
    PerFamiliaConc5P_91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc5P_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per5P_91.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc5P_91,
    });
}
var PerFamiliaConc5P_91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloPerFamiliaConc5P_91,
    onEachFeature: onEachFeaturePerFamiliaConc5P_91
});
let slidePerFamiliaConc5P_91 = function(){
    var sliderPerFamiliaConc5P_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc5P_91, {
        start: [minPerFamiliaConc5P_91, maxPerFamiliaConc5P_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc5P_91,
            'max': maxPerFamiliaConc5P_91
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc5P_91);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc5P_91);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc5P_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc5P_91.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc5P_91.noUiSlider.on('update',function(e){
        PerFamiliaConc5P_91.eachLayer(function(layer){
            if(layer.feature.properties.Per5P_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per5P_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc5P_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderPerFamiliaConc5P_91.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc5P_91);
} 

/////////////////////////////// Fim da Percentagem de Familias de 5 pessoas em 1991 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 5 pessoa por Concelho em 2001-----////

var minPerFamiliaConc5P_01 = 0;
var maxPerFamiliaConc5P_01 = 0;

function EstiloPerFamiliaConc5P_01(feature) {
    if( feature.properties.Per5P_01 <= minPerFamiliaConc5P_01 || minPerFamiliaConc5P_01 === 0){
        minPerFamiliaConc5P_01 = feature.properties.Per5P_01
    }
    if(feature.properties.Per5P_01 >= maxPerFamiliaConc5P_01 ){
        maxPerFamiliaConc5P_01 = feature.properties.Per5P_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam5PConc(feature.properties.Per5P_01)
    };
}
function apagarPerFamiliaConc5P_01(e) {
    PerFamiliaConc5P_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc5P_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per5P_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc5P_01,
    });
}
var PerFamiliaConc5P_01= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloPerFamiliaConc5P_01,
    onEachFeature: onEachFeaturePerFamiliaConc5P_01
});
let slidePerFamiliaConc5P_01 = function(){
    var sliderPerFamiliaConc5P_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc5P_01, {
        start: [minPerFamiliaConc5P_01, maxPerFamiliaConc5P_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc5P_01,
            'max': maxPerFamiliaConc5P_01
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc5P_01);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc5P_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc5P_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc5P_01.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc5P_01.noUiSlider.on('update',function(e){
        PerFamiliaConc5P_01.eachLayer(function(layer){
            if(layer.feature.properties.Per5P_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per5P_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc5P_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderPerFamiliaConc5P_01.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc5P_01);
} 

/////////////////////////////// Fim da Percentagem de Familias de 5 pessoas em 2001 Concelho -------------- \\\\\\

//////------- Percentagem Total de Familias com 5 pessoa por Concelho em 2011-----////

var minPerFamiliaConc5P_11 = 0;
var maxPerFamiliaConc5P_11 = 0;

function EstiloPerFamiliaConc5P_11(feature) {
    if( feature.properties.Per5P_11 <= minPerFamiliaConc5P_11 || minPerFamiliaConc5P_11 === 0){
        minPerFamiliaConc5P_11 = feature.properties.Per5P_11
    }
    if(feature.properties.Per5P_11 >= maxPerFamiliaConc5P_11 ){
        maxPerFamiliaConc5P_11 = feature.properties.Per5P_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam5PConc(feature.properties.Per5P_11)
    };
}
function apagarPerFamiliaConc5P_11(e) {
    PerFamiliaConc5P_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaConc5P_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' + feature.properties.Per5P_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaConc5P_11,
    });
}
var PerFamiliaConc5P_11= L.geoJSON(dadosRelativosConcelhos1101, {
    style:EstiloPerFamiliaConc5P_11,
    onEachFeature: onEachFeaturePerFamiliaConc5P_11
});
let slidePerFamiliaConc5P_11 = function(){
    var sliderPerFamiliaConc5P_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaConc5P_11, {
        start: [minPerFamiliaConc5P_11, maxPerFamiliaConc5P_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaConc5P_11,
            'max': maxPerFamiliaConc5P_11
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaConc5P_11);
    inputNumberMax.setAttribute("value",maxPerFamiliaConc5P_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaConc5P_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaConc5P_11.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaConc5P_11.noUiSlider.on('update',function(e){
        PerFamiliaConc5P_11.eachLayer(function(layer){
            if(layer.feature.properties.Per5P_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per5P_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaConc5P_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderPerFamiliaConc5P_11.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaConc5P_11);
} 
/////////////////////////////// Fim da Percentagem de Familias de 5 pessoaS em 2011 Concelho -------------- \\\\\\

/////////////////////////////------------- FIM DADOS CONCELHOS -----------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////----------------------- DADOS ABSOLUTOS FREGUESIAS -----------------------------\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS EM 2001, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamiliasFreg01 = 0;
var maxTotalFamiliasFreg01 = 0;
function estiloTotalFamiliasFreg01(feature, latlng) {
    if(feature.properties.TotalFreg01< minTotalFamiliasFreg01 || minTotalFamiliasFreg01 ===0){
        minTotalFamiliasFreg01 = feature.properties.TotalFreg01
    }
    if(feature.properties.TotalFreg01> maxTotalFamiliasFreg01){
        maxTotalFamiliasFreg01 = feature.properties.TotalFreg01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.TotalFreg01,0.15)
    });
}
function apagarTotalFamiliasFreg01(e){
    var layer = e.target;
    TotalFamiliasFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamiliasFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas: ' + '<b>' + feature.properties.TotalFreg01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamiliasFreg01,
    })
};

var TotalFamiliasFreg01= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamiliasFreg01,
    onEachFeature: onEachFeatureTotalFamiliasFreg01,
});

var slideTotalFamiliasFreg01 = function(){
    var sliderTotalFamiliasFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamiliasFreg01, {
        start: [minTotalFamiliasFreg01, maxTotalFamiliasFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamiliasFreg01,
            'max': maxTotalFamiliasFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamiliasFreg01);
    inputNumberMax.setAttribute("value",maxTotalFamiliasFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamiliasFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamiliasFreg01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamiliasFreg01.noUiSlider.on('update',function(e){
        TotalFamiliasFreg01.eachLayer(function(layer){
            if(layer.feature.properties.TotalFreg01>=parseFloat(e[0])&& layer.feature.properties.TotalFreg01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamiliasFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderTotalFamiliasFreg01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamiliasFreg01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS EM 2011, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamiliasFreg11 = 0;
var maxTotalFamiliasFreg11 = 0;
function estiloTotalFamiliasFreg11(feature, latlng) {
    if(feature.properties.TotalFreg11< minTotalFamiliasFreg11 || minTotalFamiliasFreg11 ===0){
        minTotalFamiliasFreg11 = feature.properties.TotalFreg11
    }
    if(feature.properties.TotalFreg11> maxTotalFamiliasFreg11){
        maxTotalFamiliasFreg11 = feature.properties.TotalFreg11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.TotalFreg11,0.15)
    });
}
function apagarTotalFamiliasFreg11(e){
    var layer = e.target;
    TotalFamiliasFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamiliasFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas: ' + '<b>' + feature.properties.TotalFreg11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamiliasFreg11,
    })
};

var TotalFamiliasFreg11= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamiliasFreg11,
    onEachFeature: onEachFeatureTotalFamiliasFreg11,
});

var slideTotalFamiliasFreg11 = function(){
    var sliderTotalFamiliasFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamiliasFreg11, {
        start: [minTotalFamiliasFreg11, maxTotalFamiliasFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamiliasFreg11,
            'max': maxTotalFamiliasFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamiliasFreg11);
    inputNumberMax.setAttribute("value",maxTotalFamiliasFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamiliasFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamiliasFreg11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamiliasFreg11.noUiSlider.on('update',function(e){
        TotalFamiliasFreg11.eachLayer(function(layer){
            if(layer.feature.properties.TotalFreg11>=parseFloat(e[0])&& layer.feature.properties.TotalFreg11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamiliasFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderTotalFamiliasFreg11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamiliasFreg11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS EM 2001, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias1P_Freg01 = 0;
var maxTotalFamilias1P_Freg01 = 0;
function estiloTotalFamilias1P_Freg01(feature, latlng) {
    if(feature.properties.F1PFreg01< minTotalFamilias1P_Freg01 || minTotalFamilias1P_Freg01 ===0){
        minTotalFamilias1P_Freg01 = feature.properties.F1PFreg01
    }
    if(feature.properties.F1PFreg01> maxTotalFamilias1P_Freg01){
        maxTotalFamilias1P_Freg01 = feature.properties.F1PFreg01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F1PFreg01,0.3)
    });
}
function apagarTotalFamilias1P_Freg01(e){
    var layer = e.target;
    TotalFamilias1P_Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias1P_Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas com 1 pessoa: ' + '<b>' + feature.properties.F1PFreg01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias1P_Freg01,
    })
};

var TotalFamilias1P_Freg01= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamilias1P_Freg01,
    onEachFeature: onEachFeatureTotalFamilias1P_Freg01,
});

var slideTotalFamilias1P_Freg01 = function(){
    var sliderTotalFamilias1P_Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias1P_Freg01, {
        start: [minTotalFamilias1P_Freg01, maxTotalFamilias1P_Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias1P_Freg01,
            'max': maxTotalFamilias1P_Freg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias1P_Freg01);
    inputNumberMax.setAttribute("value",maxTotalFamilias1P_Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias1P_Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias1P_Freg01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias1P_Freg01.noUiSlider.on('update',function(e){
        TotalFamilias1P_Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F1PFreg01>=parseFloat(e[0])&& layer.feature.properties.F1PFreg01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias1P_Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderTotalFamilias1P_Freg01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias1P_Freg01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS COM 1 PESSOA FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS EM 2011, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias1P_Freg11 = 0;
var maxTotalFamilias1P_Freg11 = 0;
function estiloTotalFamilias1P_Freg11(feature, latlng) {
    if(feature.properties.F1PFreg11< minTotalFamilias1P_Freg11 || minTotalFamilias1P_Freg11 ===0){
        minTotalFamilias1P_Freg11 = feature.properties.F1PFreg11
    }
    if(feature.properties.F1PFreg11> maxTotalFamilias1P_Freg11){
        maxTotalFamilias1P_Freg11 = feature.properties.F1PFreg11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F1PFreg11,0.3)
    });
}
function apagarTotalFamilias1P_Freg11(e){
    var layer = e.target;
    TotalFamilias1P_Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias1P_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas com 1 pessoa: ' + '<b>' + feature.properties.F1PFreg11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias1P_Freg11,
    })
};

var TotalFamilias1P_Freg11= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamilias1P_Freg11,
    onEachFeature: onEachFeatureTotalFamilias1P_Freg11,
});

var slideTotalFamilias1P_Freg11 = function(){
    var sliderTotalFamilias1P_Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias1P_Freg11, {
        start: [minTotalFamilias1P_Freg11, maxTotalFamilias1P_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias1P_Freg11,
            'max': maxTotalFamilias1P_Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias1P_Freg11);
    inputNumberMax.setAttribute("value",maxTotalFamilias1P_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias1P_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias1P_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias1P_Freg11.noUiSlider.on('update',function(e){
        TotalFamilias1P_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F1PFreg11>=parseFloat(e[0])&& layer.feature.properties.F1PFreg11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias1P_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderTotalFamilias1P_Freg11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias1P_Freg11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS COM 1 PESSOA FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS COM 2 PESSOAS EM 2001, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias2P_Freg01 = 0;
var maxTotalFamilias2P_Freg01 = 0;
function estiloTotalFamilias2P_Freg01(feature, latlng) {
    if(feature.properties.F2PFreg01< minTotalFamilias2P_Freg01 || minTotalFamilias2P_Freg01 ===0){
        minTotalFamilias2P_Freg01 = feature.properties.F2PFreg01
    }
    if(feature.properties.F2PFreg01> maxTotalFamilias2P_Freg01){
        maxTotalFamilias2P_Freg01 = feature.properties.F2PFreg01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F2PFreg01,0.3)
    });
}
function apagarTotalFamilias2P_Freg01(e){
    var layer = e.target;
    TotalFamilias2P_Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias2P_Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas com 2 pessoas: ' + '<b>' + feature.properties.F2PFreg01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias2P_Freg01,
    })
};

var TotalFamilias2P_Freg01= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamilias2P_Freg01,
    onEachFeature: onEachFeatureTotalFamilias2P_Freg01,
});

var slideTotalFamilias2P_Freg01 = function(){
    var sliderTotalFamilias2P_Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias2P_Freg01, {
        start: [minTotalFamilias2P_Freg01, maxTotalFamilias2P_Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias2P_Freg01,
            'max': maxTotalFamilias2P_Freg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias2P_Freg01);
    inputNumberMax.setAttribute("value",maxTotalFamilias2P_Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias2P_Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias2P_Freg01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias2P_Freg01.noUiSlider.on('update',function(e){
        TotalFamilias2P_Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F2PFreg01>=parseFloat(e[0])&& layer.feature.properties.F2PFreg01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias2P_Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderTotalFamilias2P_Freg01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias2P_Freg01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS COM 2 PESSOA FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS COM 2 PESSOAS EM 2011, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias2P_Freg11 = 0;
var maxTotalFamilias2P_Freg11 = 0;
function estiloTotalFamilias2P_Freg11(feature, latlng) {
    if(feature.properties.F2PFreg11< minTotalFamilias2P_Freg11 || minTotalFamilias2P_Freg11 ===0){
        minTotalFamilias2P_Freg11 = feature.properties.F2PFreg11
    }
    if(feature.properties.F2PFreg11> maxTotalFamilias2P_Freg11){
        maxTotalFamilias2P_Freg11 = feature.properties.F2PFreg11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F2PFreg11,0.3)
    });
}
function apagarTotalFamilias2P_Freg11(e){
    var layer = e.target;
    TotalFamilias2P_Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias2P_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas com 2 pessoas: ' + '<b>' + feature.properties.F2PFreg11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias2P_Freg11,
    })
};

var TotalFamilias2P_Freg11= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamilias2P_Freg11,
    onEachFeature: onEachFeatureTotalFamilias2P_Freg11,
});

var slideTotalFamilias2P_Freg11 = function(){
    var sliderTotalFamilias2P_Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias2P_Freg11, {
        start: [minTotalFamilias2P_Freg11, maxTotalFamilias2P_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias2P_Freg11,
            'max': maxTotalFamilias2P_Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias2P_Freg11);
    inputNumberMax.setAttribute("value",maxTotalFamilias2P_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias2P_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias2P_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias2P_Freg11.noUiSlider.on('update',function(e){
        TotalFamilias2P_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F2PFreg11>=parseFloat(e[0])&& layer.feature.properties.F2PFreg11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias2P_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderTotalFamilias2P_Freg11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias2P_Freg11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS COM 2 PESSOA FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS COM 3 PESSOAS EM 2001, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias3P_Freg01 = 0;
var maxTotalFamilias3P_Freg01 = 0;
function estiloTotalFamilias3P_Freg01(feature, latlng) {
    if(feature.properties.F3PFreg01< minTotalFamilias3P_Freg01 || minTotalFamilias3P_Freg01 ===0){
        minTotalFamilias3P_Freg01 = feature.properties.F3PFreg01
    }
    if(feature.properties.F3PFreg01> maxTotalFamilias3P_Freg01){
        maxTotalFamilias3P_Freg01 = feature.properties.F3PFreg01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F3PFreg01,0.3)
    });
}
function apagarTotalFamilias3P_Freg01(e){
    var layer = e.target;
    TotalFamilias3P_Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias3P_Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas com 3 pessoas: ' + '<b>' + feature.properties.F3PFreg01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias3P_Freg01,
    })
};

var TotalFamilias3P_Freg01= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamilias3P_Freg01,
    onEachFeature: onEachFeatureTotalFamilias3P_Freg01,
});

var slideTotalFamilias3P_Freg01 = function(){
    var sliderTotalFamilias3P_Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias3P_Freg01, {
        start: [minTotalFamilias3P_Freg01, maxTotalFamilias3P_Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias3P_Freg01,
            'max': maxTotalFamilias3P_Freg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias3P_Freg01);
    inputNumberMax.setAttribute("value",maxTotalFamilias3P_Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias3P_Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias3P_Freg01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias3P_Freg01.noUiSlider.on('update',function(e){
        TotalFamilias3P_Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F3PFreg01>=parseFloat(e[0])&& layer.feature.properties.F3PFreg01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias3P_Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderTotalFamilias3P_Freg01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias3P_Freg01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS COM 3 PESSOAS FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS COM 3 PESSOAS EM 2011, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias3P_Freg11 = 0;
var maxTotalFamilias3P_Freg11 = 0;
function estiloTotalFamilias3P_Freg11(feature, latlng) {
    if(feature.properties.F3PFreg11< minTotalFamilias3P_Freg11 || minTotalFamilias3P_Freg11 ===0){
        minTotalFamilias3P_Freg11 = feature.properties.F3PFreg11
    }
    if(feature.properties.F3PFreg11> maxTotalFamilias3P_Freg11){
        maxTotalFamilias3P_Freg11 = feature.properties.F3PFreg11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F3PFreg11,0.3)
    });
}
function apagarTotalFamilias3P_Freg11(e){
    var layer = e.target;
    TotalFamilias3P_Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias3P_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas com 3 pessoas: ' + '<b>' + feature.properties.F3PFreg11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias3P_Freg11,
    })
};

var TotalFamilias3P_Freg11= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamilias3P_Freg11,
    onEachFeature: onEachFeatureTotalFamilias3P_Freg11,
});

var slideTotalFamilias3P_Freg11 = function(){
    var sliderTotalFamilias3P_Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias3P_Freg11, {
        start: [minTotalFamilias3P_Freg11, maxTotalFamilias3P_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias3P_Freg11,
            'max': maxTotalFamilias3P_Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias3P_Freg11);
    inputNumberMax.setAttribute("value",maxTotalFamilias3P_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias3P_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias3P_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias3P_Freg11.noUiSlider.on('update',function(e){
        TotalFamilias3P_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F3PFreg11>=parseFloat(e[0])&& layer.feature.properties.F3PFreg11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias3P_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderTotalFamilias3P_Freg11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias3P_Freg11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS COM 3 PESSOAS FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS COM 4 PESSOAS EM 2001, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias4P_Freg01 = 0;
var maxTotalFamilias4P_Freg01 = 0;
function estiloTotalFamilias4P_Freg01(feature, latlng) {
    if(feature.properties.F4PFreg01< minTotalFamilias4P_Freg01 || minTotalFamilias4P_Freg01 ===0){
        minTotalFamilias4P_Freg01 = feature.properties.F4PFreg01
    }
    if(feature.properties.F4PFreg01> maxTotalFamilias4P_Freg01){
        maxTotalFamilias4P_Freg01 = feature.properties.F4PFreg01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F4PFreg01,0.3)
    });
}
function apagarTotalFamilias4P_Freg01(e){
    var layer = e.target;
    TotalFamilias4P_Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias4P_Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas com 4 pessoas: ' + '<b>' + feature.properties.F4PFreg01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias4P_Freg01,
    })
};

var TotalFamilias4P_Freg01= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamilias4P_Freg01,
    onEachFeature: onEachFeatureTotalFamilias4P_Freg01,
});

var slideTotalFamilias4P_Freg01 = function(){
    var sliderTotalFamilias4P_Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias4P_Freg01, {
        start: [minTotalFamilias4P_Freg01, maxTotalFamilias4P_Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias4P_Freg01,
            'max': maxTotalFamilias4P_Freg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias4P_Freg01);
    inputNumberMax.setAttribute("value",maxTotalFamilias4P_Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias4P_Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias4P_Freg01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias4P_Freg01.noUiSlider.on('update',function(e){
        TotalFamilias4P_Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F4PFreg01>=parseFloat(e[0])&& layer.feature.properties.F4PFreg01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias4P_Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderTotalFamilias4P_Freg01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias4P_Freg01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS COM 4 PESSOAS FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS COM 4 PESSOAS EM 2011, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias4P_Freg11 = 0;
var maxTotalFamilias4P_Freg11 = 0;
function estiloTotalFamilias4P_Freg11(feature, latlng) {
    if(feature.properties.F4PFreg11< minTotalFamilias4P_Freg11 || minTotalFamilias4P_Freg11 ===0){
        minTotalFamilias4P_Freg11 = feature.properties.F4PFreg11
    }
    if(feature.properties.F4PFreg11> maxTotalFamilias4P_Freg11){
        maxTotalFamilias4P_Freg11 = feature.properties.F4PFreg11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F4PFreg11,0.3)
    });
}
function apagarTotalFamilias4P_Freg11(e){
    var layer = e.target;
    TotalFamilias4P_Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias4P_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas com 4 pessoas: ' + '<b>' + feature.properties.F4PFreg11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias4P_Freg11,
    })
};

var TotalFamilias4P_Freg11= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamilias4P_Freg11,
    onEachFeature: onEachFeatureTotalFamilias4P_Freg11,
});

var slideTotalFamilias4P_Freg11 = function(){
    var sliderTotalFamilias4P_Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias4P_Freg11, {
        start: [minTotalFamilias4P_Freg11, maxTotalFamilias4P_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias4P_Freg11,
            'max': maxTotalFamilias4P_Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias4P_Freg11);
    inputNumberMax.setAttribute("value",maxTotalFamilias4P_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias4P_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias4P_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias4P_Freg11.noUiSlider.on('update',function(e){
        TotalFamilias4P_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F4PFreg11>=parseFloat(e[0])&& layer.feature.properties.F4PFreg11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias4P_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderTotalFamilias4P_Freg11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias4P_Freg11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS COM 4 PESSOAS FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS COM 5 PESSOAS EM 2001, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias5P_Freg01 = 0;
var maxTotalFamilias5P_Freg01 = 0;
function estiloTotalFamilias5P_Freg01(feature, latlng) {
    if(feature.properties.F5PFreg01< minTotalFamilias5P_Freg01 || minTotalFamilias5P_Freg01 ===0){
        minTotalFamilias5P_Freg01 = feature.properties.F5PFreg01
    }
    if(feature.properties.F5PFreg01> maxTotalFamilias5P_Freg01){
        maxTotalFamilias5P_Freg01 = feature.properties.F5PFreg01
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F5PFreg01,0.3)
    });
}
function apagarTotalFamilias5P_Freg01(e){
    var layer = e.target;
    TotalFamilias5P_Freg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias5P_Freg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas com 5 pessoas: ' + '<b>' + feature.properties.F5PFreg01 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias5P_Freg01,
    })
};

var TotalFamilias5P_Freg01= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamilias5P_Freg01,
    onEachFeature: onEachFeatureTotalFamilias5P_Freg01,
});

var slideTotalFamilias5P_Freg01 = function(){
    var sliderTotalFamilias5P_Freg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias5P_Freg01, {
        start: [minTotalFamilias5P_Freg01, maxTotalFamilias5P_Freg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias5P_Freg01,
            'max': maxTotalFamilias5P_Freg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias5P_Freg01);
    inputNumberMax.setAttribute("value",maxTotalFamilias5P_Freg01);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias5P_Freg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias5P_Freg01.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias5P_Freg01.noUiSlider.on('update',function(e){
        TotalFamilias5P_Freg01.eachLayer(function(layer){
            if(layer.feature.properties.F5PFreg01>=parseFloat(e[0])&& layer.feature.properties.F5PFreg01 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias5P_Freg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderTotalFamilias5P_Freg01.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias5P_Freg01);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS COM 5 PESSOAS FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------ FAMÍLIAS CLÁSSICAS COM 5 PESSOAS EM 2011, por Freguesia ---------------\\\\\\\\\\\\\\\\\\\\\

var minTotalFamilias5P_Freg11 = 0;
var maxTotalFamilias5P_Freg11 = 0;
function estiloTotalFamilias5P_Freg11(feature, latlng) {
    if(feature.properties.F5PFreg11< minTotalFamilias5P_Freg11 || minTotalFamilias5P_Freg11 ===0){
        minTotalFamilias5P_Freg11 = feature.properties.F5PFreg11
    }
    if(feature.properties.F5PFreg11> maxTotalFamilias5P_Freg11){
        maxTotalFamilias5P_Freg11 = feature.properties.F5PFreg11
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.F5PFreg11,0.3)
    });
}
function apagarTotalFamilias5P_Freg11(e){
    var layer = e.target;
    TotalFamilias5P_Freg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureTotalFamilias5P_Freg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Famílias clássicas com 5 pessoas: ' + '<b>' + feature.properties.F5PFreg11 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarTotalFamilias5P_Freg11,
    })
};

var TotalFamilias5P_Freg11= L.geoJSON(dadosAbsolutosFreguesias1101,{
    pointToLayer:estiloTotalFamilias5P_Freg11,
    onEachFeature: onEachFeatureTotalFamilias5P_Freg11,
});

var slideTotalFamilias5P_Freg11 = function(){
    var sliderTotalFamilias5P_Freg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderTotalFamilias5P_Freg11, {
        start: [minTotalFamilias5P_Freg11, maxTotalFamilias5P_Freg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minTotalFamilias5P_Freg11,
            'max': maxTotalFamilias5P_Freg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minTotalFamilias5P_Freg11);
    inputNumberMax.setAttribute("value",maxTotalFamilias5P_Freg11);

    inputNumberMin.addEventListener('change', function(){
        sliderTotalFamilias5P_Freg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderTotalFamilias5P_Freg11.noUiSlider.set([null, this.value]);
    });

    sliderTotalFamilias5P_Freg11.noUiSlider.on('update',function(e){
        TotalFamilias5P_Freg11.eachLayer(function(layer){
            if(layer.feature.properties.F5PFreg11>=parseFloat(e[0])&& layer.feature.properties.F5PFreg11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderTotalFamilias5P_Freg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderTotalFamilias5P_Freg11.noUiSlider;
    $(slidersGeral).append(sliderTotalFamilias5P_Freg11);
}

///////////////////////////-------------------- FIM FAMILIAS CLÁSSICAS COM 5 PESSOAS FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////------------------------- FIM DADOS ABSOLUTOS FREGUESIAS ---------------------\\\\\\\\\\\\\\\\\\\\
//////////////////////----------------------------- VARIAÇÕES FREGUESIAS ---------------------\\\\\\\\\\\\\
/////////////////////////////------- Variação TOTAL FAMILIAS CLÁSSICAS FREGUESIAS entre 2011 e 2001 -------------------////

var minVarTotFamiliasFreg11_01 = 0;
var maxVarTotFamiliasFreg11_01 = 0;

function CorVarTotalFamiliasFreg(d) {
    return d >= 45 ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -25.21   ? '#9eaad7' :
                ''  ;
}
var legendaVarTotalFamiliasFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do total de famílias, entre 2011 e 2001, por freguesia.' + '</strong>');

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25.21 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarTotFamiliasFreg11_01(feature) {
    if(feature.properties.VarTot1101 <= minVarTotFamiliasFreg11_01 || minVarTotFamiliasFreg11_01 ===0){
        minVarTotFamiliasFreg11_01 = feature.properties.VarTot1101
    }
    if(feature.properties.VarTot1101 > maxVarTotFamiliasFreg11_01){
        maxVarTotFamiliasFreg11_01 = feature.properties.VarTot1101 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarTotalFamiliasFreg(feature.properties.VarTot1101)};
    }


function apagarVarTotFamiliasFreg11_01(e) {
    VarTotFamiliasFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarTotFamiliasFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.VarTot1101.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarTotFamiliasFreg11_01,
    });
}
var VarTotFamiliasFreg11_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloVarTotFamiliasFreg11_01,
    onEachFeature: onEachFeatureVarTotFamiliasFreg11_01
});

let slideVarTotFamiliasFreg11_01 = function(){
    var sliderVarTotFamiliasFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarTotFamiliasFreg11_01, {
        start: [minVarTotFamiliasFreg11_01, maxVarTotFamiliasFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarTotFamiliasFreg11_01,
            'max': maxVarTotFamiliasFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarTotFamiliasFreg11_01);
    inputNumberMax.setAttribute("value",maxVarTotFamiliasFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarTotFamiliasFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarTotFamiliasFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarTotFamiliasFreg11_01.noUiSlider.on('update',function(e){
        VarTotFamiliasFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.VarTot1101.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.VarTot1101.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarTotFamiliasFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderVarTotFamiliasFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarTotFamiliasFreg11_01);
} 

///////////////////////////// Fim da Variação do TOTAL DE FAMÍLIAS CLÁSSICAS POR FREGUESIAS ENTRE 2011 E 2001 -------------- \\\\\
/////////////////////////////------- Variação TOTAL FAMILIAS CLÁSSICAS 1PESSOA entre 2011 e 2001 -------------------////

var minVarFamilias1PFreg11_01 = 0;
var maxVarFamilias1PFreg11_01 = 0;

function CorVar1PFamiliasFreg(d) {
    return d >= 100 ? '#de1f35' :
        d >= 50  ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -25   ? '#9eaad7' :
        d >= -65.99   ? '#2288bf' :
                ''  ;
}
var legendaVar1PFamiliasFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 1 pessoa, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  30 a 45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  15 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -25.21 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarFamilias1PFreg11_01(feature) {
    if(feature.properties.Var1P11_01 <= minVarFamilias1PFreg11_01 || minVarFamilias1PFreg11_01 ===0){
        minVarFamilias1PFreg11_01 = feature.properties.Var1P11_01
    }
    if(feature.properties.Var1P11_01 > maxVarFamilias1PFreg11_01){
        maxVarFamilias1PFreg11_01 = feature.properties.Var1P11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1PFamiliasFreg(feature.properties.Var1P11_01)};
    }


function apagarVarFamilias1PFreg11_01(e) {
    VarFamilias1PFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarFamilias1PFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var1P11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarFamilias1PFreg11_01,
    });
}
var VarFamilias1PFreg11_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloVarFamilias1PFreg11_01,
    onEachFeature: onEachFeatureVarFamilias1PFreg11_01
});

let slideVarFamilias1PFreg11_01 = function(){
    var sliderVarFamilias1PFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarFamilias1PFreg11_01, {
        start: [minVarFamilias1PFreg11_01, maxVarFamilias1PFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarFamilias1PFreg11_01,
            'max': maxVarFamilias1PFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarFamilias1PFreg11_01);
    inputNumberMax.setAttribute("value",maxVarFamilias1PFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarFamilias1PFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarFamilias1PFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarFamilias1PFreg11_01.noUiSlider.on('update',function(e){
        VarFamilias1PFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var1P11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1P11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarFamilias1PFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderVarFamilias1PFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarFamilias1PFreg11_01);
} 

///////////////////////////// Fim da Variação do TOTAL DE FAMÍLIAS 1PESSOA POR FREGUESIAS ENTRE 2011 E 2001 -------------- \\\\\

/////////////////////////////------- Variação TOTAL FAMILIAS CLÁSSICAS 2 PESSOAS entre 2011 e 2001 -------------------////

var minVarFamilias2PFreg11_01 = 0;
var maxVarFamilias2PFreg11_01 = 0;

function CorVar2PFamiliasFreg(d) {
    return d >= 75 ? '#8c0303' :
        d >= 50  ? '#de1f35' :
        d >= 25   ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -35.71   ? '#9eaad7' :
                ''  ;
}
var legendaVar2PFamiliasFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 2 pessoas, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  50 a 75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -35.71 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarFamilias2PFreg11_01(feature) {
    if(feature.properties.Var2P11_01 <= minVarFamilias2PFreg11_01 || minVarFamilias2PFreg11_01 ===0){
        minVarFamilias2PFreg11_01 = feature.properties.Var2P11_01
    }
    if(feature.properties.Var2P11_01 > maxVarFamilias2PFreg11_01){
        maxVarFamilias2PFreg11_01 = feature.properties.Var2P11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2PFamiliasFreg(feature.properties.Var2P11_01)
    };
}


function apagarVarFamilias2PFreg11_01(e) {
    VarFamilias2PFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarFamilias2PFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var2P11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarFamilias2PFreg11_01,
    });
}
var VarFamilias2PFreg11_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloVarFamilias2PFreg11_01,
    onEachFeature: onEachFeatureVarFamilias2PFreg11_01
});

let slideVarFamilias2PFreg11_01 = function(){
    var sliderVarFamilias2PFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarFamilias2PFreg11_01, {
        start: [minVarFamilias2PFreg11_01, maxVarFamilias2PFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarFamilias2PFreg11_01,
            'max': maxVarFamilias2PFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarFamilias2PFreg11_01);
    inputNumberMax.setAttribute("value",maxVarFamilias2PFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarFamilias2PFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarFamilias2PFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarFamilias2PFreg11_01.noUiSlider.on('update',function(e){
        VarFamilias2PFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var2P11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2P11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarFamilias2PFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderVarFamilias2PFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarFamilias2PFreg11_01);
} 

///////////////////////////// Fim da Variação do TOTAL DE FAMÍLIAS 2 PESSOAS POR FREGUESIAS ENTRE 2011 E 2001 -------------- \\\\\

/////////////////////////////------- Variação TOTAL FAMILIAS CLÁSSICAS 3 PESSOAS entre 2011 e 2001 -------------------////

var minVarFamilias3PFreg11_01 = 0;
var maxVarFamilias3PFreg11_01 = 0;

function CorVar3PFamiliasFreg(d) {
    return d >= 50 ? '#de1f35' :
        d >= 25  ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -15   ? '#9eaad7' :
        d >= -43.33   ? '#2288bf' :
                ''  ;
}
var legendaVar3PFamiliasFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 3 pessoas, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  25 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -43.33 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarFamilias3PFreg11_01(feature) {
    if(feature.properties.Var3P11_01 <= minVarFamilias3PFreg11_01 || minVarFamilias3PFreg11_01 ===0){
        minVarFamilias3PFreg11_01 = feature.properties.Var3P11_01
    }
    if(feature.properties.Var3P11_01 > maxVarFamilias3PFreg11_01){
        maxVarFamilias3PFreg11_01 = feature.properties.Var3P11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3PFamiliasFreg(feature.properties.Var3P11_01)};
    }


function apagarVarFamilias3PFreg11_01(e) {
    VarFamilias3PFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarFamilias3PFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var3P11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarFamilias3PFreg11_01,
    });
}
var VarFamilias3PFreg11_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloVarFamilias3PFreg11_01,
    onEachFeature: onEachFeatureVarFamilias3PFreg11_01
});

let slideVarFamilias3PFreg11_01 = function(){
    var sliderVarFamilias3PFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarFamilias3PFreg11_01, {
        start: [minVarFamilias3PFreg11_01, maxVarFamilias3PFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarFamilias3PFreg11_01,
            'max': maxVarFamilias3PFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarFamilias3PFreg11_01);
    inputNumberMax.setAttribute("value",maxVarFamilias3PFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarFamilias3PFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarFamilias3PFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarFamilias3PFreg11_01.noUiSlider.on('update',function(e){
        VarFamilias3PFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var3P11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3P11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarFamilias3PFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderVarFamilias3PFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarFamilias3PFreg11_01);
} 

///////////////////////////// Fim da Variação do TOTAL DE FAMÍLIAS 3 PESSOAS POR FREGUESIAS ENTRE 2011 E 2001 -------------- \\\\\

/////////////////////////////------- Variação TOTAL FAMILIAS CLÁSSICAS 4 PESSOAS entre 2011 e 2001 -------------------////

var minVarFamilias4PFreg11_01 = 0;
var maxVarFamilias4PFreg11_01 = 0;

function CorVar4PFamiliasFreg(d) {
    return d >= 20 ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10   ? '#9eaad7' :
        d >= -20   ? '#2288bf' :
        d >= -56.82   ? '#155273' :
                ''  ;
}
var legendaVar4PFamiliasFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 4 pessoas, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -56.82 a -20' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarFamilias4PFreg11_01(feature) {
    if(feature.properties.Var4P11_01 <= minVarFamilias4PFreg11_01 || minVarFamilias4PFreg11_01 ===0){
        minVarFamilias4PFreg11_01 = feature.properties.Var4P11_01
    }
    if(feature.properties.Var4P11_01 > maxVarFamilias4PFreg11_01){
        maxVarFamilias4PFreg11_01 = feature.properties.Var4P11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4PFamiliasFreg(feature.properties.Var4P11_01)};
    }


function apagarVarFamilias4PFreg11_01(e) {
    VarFamilias4PFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarFamilias4PFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var4P11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarFamilias4PFreg11_01,
    });
}
var VarFamilias4PFreg11_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloVarFamilias4PFreg11_01,
    onEachFeature: onEachFeatureVarFamilias4PFreg11_01
});

let slideVarFamilias4PFreg11_01 = function(){
    var sliderVarFamilias4PFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarFamilias4PFreg11_01, {
        start: [minVarFamilias4PFreg11_01, maxVarFamilias4PFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarFamilias4PFreg11_01,
            'max': maxVarFamilias4PFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarFamilias4PFreg11_01);
    inputNumberMax.setAttribute("value",maxVarFamilias4PFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarFamilias4PFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarFamilias4PFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarFamilias4PFreg11_01.noUiSlider.on('update',function(e){
        VarFamilias4PFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var4P11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4P11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarFamilias4PFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderVarFamilias4PFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarFamilias4PFreg11_01);
} 

///////////////////////////// Fim da Variação do TOTAL DE FAMÍLIAS 4 PESSOAS POR FREGUESIAS ENTRE 2011 E 2001 -------------- \\\\\
/////////////////////////////------- Variação TOTAL FAMILIAS CLÁSSICAS 5 PESSOAS entre 2011 e 2001 -------------------////

var minVarFamilias5PFreg11_01 = 0;
var maxVarFamilias5PFreg11_01 = 0;

function CorVar5PFamiliasFreg(d) {
    return d >= 25 ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -20   ? '#9eaad7' :
        d >= -40   ? '#2288bf' :
        d >= -83.33   ? '#155273' :
                ''  ;
}
var legendaVar5PFamiliasFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do número de famílias com 5 pessoas, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -20 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -40 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -83.33 a -40' + '<br>'
    $(symbolsContainer).css("opacity","0.8");
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarFamilias5PFreg11_01(feature) {
    if(feature.properties.Var5P11_01 <= minVarFamilias5PFreg11_01 || minVarFamilias5PFreg11_01 ===0){
        minVarFamilias5PFreg11_01 = feature.properties.Var5P11_01
    }
    if(feature.properties.Var5P11_01 > maxVarFamilias5PFreg11_01){
        maxVarFamilias5PFreg11_01 = feature.properties.Var5P11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar5PFamiliasFreg(feature.properties.Var5P11_01)};
    }


function apagarVarFamilias5PFreg11_01(e) {
    VarFamilias5PFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarFamilias5PFreg11_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var5P11_01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarFamilias5PFreg11_01,
    });
}
var VarFamilias5PFreg11_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloVarFamilias5PFreg11_01,
    onEachFeature: onEachFeatureVarFamilias5PFreg11_01
});

let slideVarFamilias5PFreg11_01 = function(){
    var sliderVarFamilias5PFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarFamilias5PFreg11_01, {
        start: [minVarFamilias5PFreg11_01, maxVarFamilias5PFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarFamilias5PFreg11_01,
            'max': maxVarFamilias5PFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarFamilias5PFreg11_01);
    inputNumberMax.setAttribute("value",maxVarFamilias5PFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarFamilias5PFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarFamilias5PFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarFamilias5PFreg11_01.noUiSlider.on('update',function(e){
        VarFamilias5PFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var5P11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var5P11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarFamilias5PFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderVarFamilias5PFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarFamilias5PFreg11_01);
} 

///////////////////////////// Fim da Variação do TOTAL DE FAMÍLIAS 5 PESSOAS POR FREGUESIAS ENTRE 2011 E 2001 -------------- \\\\\
/////////////////////////-------------------------------- FIM VARIAÇÃO---------------------------\\\\\\\\\\\\\\\\\\
////////////////////////////////////////// PERCENTAGEM FREGUESIAS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
////////////////////////---------------- PERCENTAGEM FAMILIA 1 PESSOA FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\
var minPerFamiliaFreg1P_01 = 0;
var maxPerFamiliaFreg1P_01 = 0;

function CorPerFam1PFreg(d) {
    return d >= 42.45 ? '#8c0303' :
        d >= 35.81  ? '#de1f35' :
        d >= 24.76 ? '#ff5e6e' :
        d >= 13.7   ? '#f5b3be' :
        d >= 2.64   ? '#F2C572' :
                ''  ;
}
var legendaPerFam1PFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 42.45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 35.81 - 42.45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 24.76 - 35.81' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 13.7 - 24.76' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2.64 - 13.7' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerFamiliaFreg1P_01(feature) {
    if( feature.properties.Per1PFre01 <= minPerFamiliaFreg1P_01 || minPerFamiliaFreg1P_01 === 0){
        minPerFamiliaFreg1P_01 = feature.properties.Per1PFre01
    }
    if(feature.properties.Per1PFre01 >= maxPerFamiliaFreg1P_01 ){
        maxPerFamiliaFreg1P_01 = feature.properties.Per1PFre01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam1PFreg(feature.properties.Per1PFre01)
    };
}
function apagarPerFamiliaFreg1P_01(e) {
    PerFamiliaFreg1P_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaFreg1P_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per1PFre01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaFreg1P_01,
    });
}
var PerFamiliaFreg1P_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloPerFamiliaFreg1P_01,
    onEachFeature: onEachFeaturePerFamiliaFreg1P_01
});
let slidePerFamiliaFreg1P_01 = function(){
    var sliderPerFamiliaFreg1P_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaFreg1P_01, {
        start: [minPerFamiliaFreg1P_01, maxPerFamiliaFreg1P_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaFreg1P_01,
            'max': maxPerFamiliaFreg1P_01
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaFreg1P_01);
    inputNumberMax.setAttribute("value",maxPerFamiliaFreg1P_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaFreg1P_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaFreg1P_01.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaFreg1P_01.noUiSlider.on('update',function(e){
        PerFamiliaFreg1P_01.eachLayer(function(layer){
            if(layer.feature.properties.Per1PFre01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per1PFre01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaFreg1P_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderPerFamiliaFreg1P_01.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaFreg1P_01);
} 
//////////////////////////------------------------- FIM PERCENTAGEM FAMILIA 1 PESSOA FREGUESIA ------------\\\\\\\\\\\\\\\\

////////////////////////---------------- PERCENTAGEM FAMILIA 1 PESSOA FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\

var minPerFamiliaFreg1P_11 = 0;
var maxPerFamiliaFreg1P_11 = 0;

function EstiloPerFamiliaFreg1P_11(feature) {
    if( feature.properties.Per1PFre11 <= minPerFamiliaFreg1P_11 || minPerFamiliaFreg1P_11 === 0){
        minPerFamiliaFreg1P_11 = feature.properties.Per1PFre11
    }
    if(feature.properties.Per1PFre11 >= maxPerFamiliaFreg1P_11 ){
        maxPerFamiliaFreg1P_11 = feature.properties.Per1PFre11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam1PFreg(feature.properties.Per1PFre11)
    };
}
function apagarPerFamiliaFreg1P_11(e) {
    PerFamiliaFreg1P_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaFreg1P_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per1PFre11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaFreg1P_11,
    });
}
var PerFamiliaFreg1P_11= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloPerFamiliaFreg1P_11,
    onEachFeature: onEachFeaturePerFamiliaFreg1P_11
});
let slidePerFamiliaFreg1P_11 = function(){
    var sliderPerFamiliaFreg1P_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaFreg1P_11, {
        start: [minPerFamiliaFreg1P_11, maxPerFamiliaFreg1P_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaFreg1P_11,
            'max': maxPerFamiliaFreg1P_11
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaFreg1P_11);
    inputNumberMax.setAttribute("value",maxPerFamiliaFreg1P_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaFreg1P_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaFreg1P_11.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaFreg1P_11.noUiSlider.on('update',function(e){
        PerFamiliaFreg1P_11.eachLayer(function(layer){
            if(layer.feature.properties.Per1PFre11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per1PFre11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaFreg1P_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderPerFamiliaFreg1P_11.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaFreg1P_11);
} 
//////////////////////////------------------------- FIM PERCENTAGEM FAMILIA 1 PESSOA FREGUESIA 2011------------\\\\\\\\\\\\\\\\

////////////////////////---------------- PERCENTAGEM FAMILIA 2 PESSOAS FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\

var minPerFamiliaFreg2P_01 = 0;
var maxPerFamiliaFreg2P_01 = 0;

function CorPerFam2PFreg(d) {
    return d >= 34.72 ? '#8c0303' :
        d >= 30.84  ? '#de1f35' :
        d >= 24.39 ? '#ff5e6e' :
        d >= 17.93   ? '#f5b3be' :
        d >= 11.47   ? '#F2C572' :
                ''  ;
}
var legendaPerFam2PFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 34.72' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 30.84 - 34.72' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 24.39 - 30.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 17.93 - 24.39' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 11.47 - 17.93' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerFamiliaFreg2P_01(feature) {
    if( feature.properties.Per2PFre01 <= minPerFamiliaFreg2P_01 || minPerFamiliaFreg2P_01 === 0){
        minPerFamiliaFreg2P_01 = feature.properties.Per2PFre01
    }
    if(feature.properties.Per2PFre01 >= maxPerFamiliaFreg2P_01 ){
        maxPerFamiliaFreg2P_01 = feature.properties.Per2PFre01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam2PFreg(feature.properties.Per2PFre01)
    };
}
function apagarPerFamiliaFreg2P_01(e) {
    PerFamiliaFreg2P_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaFreg2P_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per2PFre01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaFreg2P_01,
    });
}
var PerFamiliaFreg2P_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloPerFamiliaFreg2P_01,
    onEachFeature: onEachFeaturePerFamiliaFreg2P_01
});
let slidePerFamiliaFreg2P_01 = function(){
    var sliderPerFamiliaFreg2P_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 66){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaFreg2P_01, {
        start: [minPerFamiliaFreg2P_01, maxPerFamiliaFreg2P_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaFreg2P_01,
            'max': maxPerFamiliaFreg2P_01
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaFreg2P_01);
    inputNumberMax.setAttribute("value",maxPerFamiliaFreg2P_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaFreg2P_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaFreg2P_01.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaFreg2P_01.noUiSlider.on('update',function(e){
        PerFamiliaFreg2P_01.eachLayer(function(layer){
            if(layer.feature.properties.Per2PFre01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per2PFre01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaFreg2P_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 66;
    sliderAtivo = sliderPerFamiliaFreg2P_01.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaFreg2P_01);
} 
//////////////////////////------------------------- FIM PERCENTAGEM FAMILIA 2 PESSOA FREGUESIA 2001------------\\\\\\\\\\\\\\\\

////////////////////////---------------- PERCENTAGEM FAMILIA 2 PESSOAS FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\

var minPerFamiliaFreg2P_11 = 0;
var maxPerFamiliaFreg2P_11 = 0;

function EstiloPerFamiliaFreg2P_11(feature) {
    if( feature.properties.Per2PFre11 <= minPerFamiliaFreg2P_11 || minPerFamiliaFreg2P_11 === 0){
        minPerFamiliaFreg2P_11 = feature.properties.Per2PFre11
    }
    if(feature.properties.Per2PFre11 >= maxPerFamiliaFreg2P_11 ){
        maxPerFamiliaFreg2P_11 = feature.properties.Per2PFre11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam2PFreg(feature.properties.Per2PFre11)
    };
}
function apagarPerFamiliaFreg2P_11(e) {
    PerFamiliaFreg2P_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaFreg2P_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per2PFre11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaFreg2P_11,
    });
}
var PerFamiliaFreg2P_11= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloPerFamiliaFreg2P_11,
    onEachFeature: onEachFeaturePerFamiliaFreg2P_11
});
let slidePerFamiliaFreg2P_11 = function(){
    var sliderPerFamiliaFreg2P_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 67){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaFreg2P_11, {
        start: [minPerFamiliaFreg2P_11, maxPerFamiliaFreg2P_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaFreg2P_11,
            'max': maxPerFamiliaFreg2P_11
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaFreg2P_11);
    inputNumberMax.setAttribute("value",maxPerFamiliaFreg2P_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaFreg2P_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaFreg2P_11.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaFreg2P_11.noUiSlider.on('update',function(e){
        PerFamiliaFreg2P_11.eachLayer(function(layer){
            if(layer.feature.properties.Per2PFre11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per2PFre11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaFreg2P_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 67;
    sliderAtivo = sliderPerFamiliaFreg2P_11.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaFreg2P_11);
} 
//////////////////////////------------------------- FIM PERCENTAGEM FAMILIA 2 PESSOA FREGUESIA 2011------------\\\\\\\\\\\\\\\\

////////////////////////---------------- PERCENTAGEM FAMILIA 3 PESSOAS FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\

var minPerFamiliaFreg3P_01 = 0;
var maxPerFamiliaFreg3P_01 = 0;

function CorPerFam3PFreg(d) {
    return d >= 35.22 ? '#8c0303' :
        d >= 30.84  ? '#de1f35' :
        d >= 23.52 ? '#ff5e6e' :
        d >= 16.21   ? '#f5b3be' :
        d >= 8.89   ? '#F2C572' :
                ''  ;
}
var legendaPerFam3PFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 35.22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 30.84 - 35.22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 23.52 - 30.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 16.21 - 23.52' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 8.89 - 16.21' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerFamiliaFreg3P_01(feature) {
    if( feature.properties.Per3PFre01 <= minPerFamiliaFreg3P_01 || minPerFamiliaFreg3P_01 === 0){
        minPerFamiliaFreg3P_01 = feature.properties.Per3PFre01
    }
    if(feature.properties.Per3PFre01 >= maxPerFamiliaFreg3P_01 ){
        maxPerFamiliaFreg3P_01 = feature.properties.Per3PFre01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam3PFreg(feature.properties.Per3PFre01)
    };
}
function apagarPerFamiliaFreg3P_01(e) {
    PerFamiliaFreg3P_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaFreg3P_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per3PFre01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaFreg3P_01,
    });
}
var PerFamiliaFreg3P_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloPerFamiliaFreg3P_01,
    onEachFeature: onEachFeaturePerFamiliaFreg3P_01
});
let slidePerFamiliaFreg3P_01 = function(){
    var sliderPerFamiliaFreg3P_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 68){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaFreg3P_01, {
        start: [minPerFamiliaFreg3P_01, maxPerFamiliaFreg3P_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaFreg3P_01,
            'max': maxPerFamiliaFreg3P_01
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaFreg3P_01);
    inputNumberMax.setAttribute("value",maxPerFamiliaFreg3P_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaFreg3P_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaFreg3P_01.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaFreg3P_01.noUiSlider.on('update',function(e){
        PerFamiliaFreg3P_01.eachLayer(function(layer){
            if(layer.feature.properties.Per3PFre01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per3PFre01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaFreg3P_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 68;
    sliderAtivo = sliderPerFamiliaFreg3P_01.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaFreg3P_01);
} 
//////////////////////////------------------------- FIM PERCENTAGEM FAMILIA 3 PESSOA FREGUESIA 2001------------\\\\\\\\\\\\\\\\

////////////////////////---------------- PERCENTAGEM FAMILIA 3 PESSOAS FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\

var minPerFamiliaFreg3P_11 = 0;
var maxPerFamiliaFreg3P_11 = 0;

function EstiloPerFamiliaFreg3P_11(feature) {
    if( feature.properties.Per3PFre11 <= minPerFamiliaFreg3P_11 || minPerFamiliaFreg3P_11 === 0){
        minPerFamiliaFreg3P_11 = feature.properties.Per3PFre11
    }
    if(feature.properties.Per3PFre11 >= maxPerFamiliaFreg3P_11 ){
        maxPerFamiliaFreg3P_11 = feature.properties.Per3PFre11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam3PFreg(feature.properties.Per3PFre11)
    };
}
function apagarPerFamiliaFreg3P_11(e) {
    PerFamiliaFreg3P_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaFreg3P_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per3PFre11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaFreg3P_11,
    });
}
var PerFamiliaFreg3P_11= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloPerFamiliaFreg3P_11,
    onEachFeature: onEachFeaturePerFamiliaFreg3P_11
});
let slidePerFamiliaFreg3P_11 = function(){
    var sliderPerFamiliaFreg3P_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 69){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaFreg3P_11, {
        start: [minPerFamiliaFreg3P_11, maxPerFamiliaFreg3P_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaFreg3P_11,
            'max': maxPerFamiliaFreg3P_11
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaFreg3P_11);
    inputNumberMax.setAttribute("value",maxPerFamiliaFreg3P_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaFreg3P_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaFreg3P_11.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaFreg3P_11.noUiSlider.on('update',function(e){
        PerFamiliaFreg3P_11.eachLayer(function(layer){
            if(layer.feature.properties.Per3PFre11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per3PFre11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaFreg3P_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 69;
    sliderAtivo = sliderPerFamiliaFreg3P_11.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaFreg3P_11);
} 
//////////////////////////------------------------- FIM PERCENTAGEM FAMILIA 3 PESSOAS FREGUESIA 2011------------\\\\\\\\\\\\\\\\

////////////////////////---------------- PERCENTAGEM FAMILIA 4 PESSOAS FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\

var minPerFamiliaFreg4P_01 = 0;
var maxPerFamiliaFreg4P_01 = 0;

function CorPerFam4PFreg(d) {
    return d >= 29.15 ? '#8c0303' :
        d >= 25.31  ? '#de1f35' :
        d >= 18.91 ? '#ff5e6e' :
        d >= 12.5   ? '#f5b3be' :
        d >= 6.1   ? '#F2C572' :
                ''  ;
}
var legendaPerFam4PFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 29.15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 25.31 - 29.15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 18.91 - 25.31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 12.5 - 18.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 6.1 - 12.5' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloPerFamiliaFreg4P_01(feature) {
    if( feature.properties.Per4PFre01 <= minPerFamiliaFreg4P_01 || minPerFamiliaFreg4P_01 === 0){
        minPerFamiliaFreg4P_01 = feature.properties.Per4PFre01
    }
    if(feature.properties.Per4PFre01 >= maxPerFamiliaFreg4P_01 ){
        maxPerFamiliaFreg4P_01 = feature.properties.Per4PFre01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam4PFreg(feature.properties.Per4PFre01)
    };
}
function apagarPerFamiliaFreg4P_01(e) {
    PerFamiliaFreg4P_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaFreg4P_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per4PFre01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaFreg4P_01,
    });
}
var PerFamiliaFreg4P_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloPerFamiliaFreg4P_01,
    onEachFeature: onEachFeaturePerFamiliaFreg4P_01
});
let slidePerFamiliaFreg4P_01 = function(){
    var sliderPerFamiliaFreg4P_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 70){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaFreg4P_01, {
        start: [minPerFamiliaFreg4P_01, maxPerFamiliaFreg4P_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaFreg4P_01,
            'max': maxPerFamiliaFreg4P_01
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaFreg4P_01);
    inputNumberMax.setAttribute("value",maxPerFamiliaFreg4P_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaFreg4P_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaFreg4P_01.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaFreg4P_01.noUiSlider.on('update',function(e){
        PerFamiliaFreg4P_01.eachLayer(function(layer){
            if(layer.feature.properties.Per4PFre01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per4PFre01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaFreg4P_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 70;
    sliderAtivo = sliderPerFamiliaFreg4P_01.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaFreg4P_01);
} 
//////////////////////////------------------------- FIM PERCENTAGEM FAMILIA 4 PESSOAS FREGUESIA 2001------------\\\\\\\\\\\\\\\\

////////////////////////---------------- PERCENTAGEM FAMILIA 4 PESSOAS FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\

var minPerFamiliaFreg4P_11 = 0;
var maxPerFamiliaFreg4P_11 = 0;

function EstiloPerFamiliaFreg4P_11(feature) {
    if( feature.properties.Per4PFre11 <= minPerFamiliaFreg4P_11 || minPerFamiliaFreg4P_11 === 0){
        minPerFamiliaFreg4P_11 = feature.properties.Per4PFre11
    }
    if(feature.properties.Per4PFre11 >= maxPerFamiliaFreg4P_11 ){
        maxPerFamiliaFreg4P_11 = feature.properties.Per4PFre11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam4PFreg(feature.properties.Per4PFre11)
    };
}
function apagarPerFamiliaFreg4P_11(e) {
    PerFamiliaFreg4P_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaFreg4P_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per4PFre11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaFreg4P_11,
    });
}
var PerFamiliaFreg4P_11= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloPerFamiliaFreg4P_11,
    onEachFeature: onEachFeaturePerFamiliaFreg4P_11
});
let slidePerFamiliaFreg4P_11 = function(){
    var sliderPerFamiliaFreg4P_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 71){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaFreg4P_11, {
        start: [minPerFamiliaFreg4P_11, maxPerFamiliaFreg4P_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaFreg4P_11,
            'max': maxPerFamiliaFreg4P_11
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaFreg4P_11);
    inputNumberMax.setAttribute("value",maxPerFamiliaFreg4P_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaFreg4P_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaFreg4P_11.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaFreg4P_11.noUiSlider.on('update',function(e){
        PerFamiliaFreg4P_11.eachLayer(function(layer){
            if(layer.feature.properties.Per4PFre11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per4PFre11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaFreg4P_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 71;
    sliderAtivo = sliderPerFamiliaFreg4P_11.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaFreg4P_11);
} 
//////////////////////////------------------------- FIM PERCENTAGEM FAMILIA 4 PESSOAS FREGUESIA 2011------------\\\\\\\\\\\\\\\\

////////////////////////---------------- PERCENTAGEM FAMILIA 5 PESSOAS FREGUESIA 2001 -----------\\\\\\\\\\\\\\\\\\\\\\

var minPerFamiliaFreg5P_01 = 0;
var maxPerFamiliaFreg5P_01 = 0;

function CorPerFam5PFreg(d) {
    return d >= 34.39 ? '#8c0303' :
        d >= 29.15  ? '#de1f35' :
        d >= 20.4 ? '#ff5e6e' :
        d >= 11.66   ? '#f5b3be' :
        d >= 2.91   ? '#F2C572' :
                ''  ;
}
var legendaPerFam5PFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 34.39' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 29.15 - 34.39' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 20.4 - 29.15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 11.66 - 20.4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2.91 - 11.66' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPerFamiliaFreg5P_01(feature) {
    if( feature.properties.Per5PFre01 <= minPerFamiliaFreg5P_01 || minPerFamiliaFreg5P_01 === 0){
        minPerFamiliaFreg5P_01 = feature.properties.Per5PFre01
    }
    if(feature.properties.Per5PFre01 >= maxPerFamiliaFreg5P_01 ){
        maxPerFamiliaFreg5P_01 = feature.properties.Per5PFre01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam5PFreg(feature.properties.Per5PFre01)
    };
}
function apagarPerFamiliaFreg5P_01(e) {
    PerFamiliaFreg5P_01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaFreg5P_01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per5PFre01.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaFreg5P_01,
    });
}
var PerFamiliaFreg5P_01= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloPerFamiliaFreg5P_01,
    onEachFeature: onEachFeaturePerFamiliaFreg5P_01
});
let slidePerFamiliaFreg5P_01 = function(){
    var sliderPerFamiliaFreg5P_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 72){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaFreg5P_01, {
        start: [minPerFamiliaFreg5P_01, maxPerFamiliaFreg5P_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaFreg5P_01,
            'max': maxPerFamiliaFreg5P_01
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaFreg5P_01);
    inputNumberMax.setAttribute("value",maxPerFamiliaFreg5P_01);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaFreg5P_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaFreg5P_01.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaFreg5P_01.noUiSlider.on('update',function(e){
        PerFamiliaFreg5P_01.eachLayer(function(layer){
            if(layer.feature.properties.Per5PFre01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per5PFre01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaFreg5P_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 72;
    sliderAtivo = sliderPerFamiliaFreg5P_01.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaFreg5P_01);
} 
//////////////////////////------------------------- FIM PERCENTAGEM FAMILIA 5 PESSOAS FREGUESIA 2001------------\\\\\\\\\\\\\\\\

////////////////////////---------------- PERCENTAGEM FAMILIA 5 PESSOAS FREGUESIA 2011 -----------\\\\\\\\\\\\\\\\\\\\\\

var minPerFamiliaFreg5P_11 = 0;
var maxPerFamiliaFreg5P_11 = 0;

function EstiloPerFamiliaFreg5P_11(feature) {
    if( feature.properties.Per5PFre11 <= minPerFamiliaFreg5P_11 || minPerFamiliaFreg5P_11 === 0){
        minPerFamiliaFreg5P_11 = feature.properties.Per5PFre11
    }
    if(feature.properties.Per5PFre11 >= maxPerFamiliaFreg5P_11 ){
        maxPerFamiliaFreg5P_11 = feature.properties.Per5PFre11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerFam5PFreg(feature.properties.Per5PFre11)
    };
}
function apagarPerFamiliaFreg5P_11(e) {
    PerFamiliaFreg5P_11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePerFamiliaFreg5P_11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Percentagem: ' + '<b>' + feature.properties.Per5PFre11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPerFamiliaFreg5P_11,
    });
}
var PerFamiliaFreg5P_11= L.geoJSON(dadosRelativosFreguesias1101, {
    style:EstiloPerFamiliaFreg5P_11,
    onEachFeature: onEachFeaturePerFamiliaFreg5P_11
});
let slidePerFamiliaFreg5P_11 = function(){
    var sliderPerFamiliaFreg5P_11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 73){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPerFamiliaFreg5P_11, {
        start: [minPerFamiliaFreg5P_11, maxPerFamiliaFreg5P_11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPerFamiliaFreg5P_11,
            'max': maxPerFamiliaFreg5P_11
        },
        });
    inputNumberMin.setAttribute("value",minPerFamiliaFreg5P_11);
    inputNumberMax.setAttribute("value",maxPerFamiliaFreg5P_11);

    inputNumberMin.addEventListener('change', function(){
        sliderPerFamiliaFreg5P_11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPerFamiliaFreg5P_11.noUiSlider.set([null, this.value]);
    });

    sliderPerFamiliaFreg5P_11.noUiSlider.on('update',function(e){
        PerFamiliaFreg5P_11.eachLayer(function(layer){
            if(layer.feature.properties.Per5PFre11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Per5PFre11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPerFamiliaFreg5P_11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 73;
    sliderAtivo = sliderPerFamiliaFreg5P_11.noUiSlider;
    $(slidersGeral).append(sliderPerFamiliaFreg5P_11);
} 
//////////////////////////------------------------- FIM PERCENTAGEM FAMILIA 5 PESSOAS FREGUESIA 2011------------\\\\\\\\\\\\\\\\

$('#tituloMapa').html('<strong>' + 'Total de famílias clássicas, em 1991, por concelho, Nº.' + '</strong>');
var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = TotalFamiliasConc91;
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
    if (layer == TotalFamiliasConc91 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Total de famílias clássicas, em 1991, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamiliasConc91,((maxTotalFamiliasConc91-minTotalFamiliasConc91)/2).toFixed(0),minTotalFamiliasConc91,0.15);
        contornoConcelhos1991.addTo(map)
        baseAtiva = contornoConcelhos1991;
        slideTotalFamiliasConc91();
        naoDuplicar = 1;
    }
    if (layer == TotalFamiliasConc91 && naoDuplicar == 1){
        contornoConcelhos1991.addTo(map);
        $('#tituloMapa').html('<strong>' + 'Total de famílias clássicas, em 1991, por concelho, Nº.' + '</strong>');

    } 
    if (layer == TotalFamiliasConc01 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Total de famílias clássicas, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamiliasConc01,((maxTotalFamiliasConc01-minTotalFamiliasConc01)/2).toFixed(0),minTotalFamiliasConc01,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamiliasConc01();  
        naoDuplicar = 2;
    }
    if (layer == TotalFamiliasConc11 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Total de famílias clássicas, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamiliasConc11,((maxTotalFamiliasConc11-minTotalFamiliasConc11)/2).toFixed(0),minTotalFamiliasConc11,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamiliasConc11();  
        naoDuplicar = 3;
    }
    if (layer == TotalFamilias1PConc91 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 1 pessoa, em 1991, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias1PConc91, ((maxTotalFamilias1PConc91-minTotalFamilias1PConc91)/2).toFixed(0),minTotalFamilias1PConc91,0.15);
        contornoConcelhos1991.addTo(map)
        baseAtiva = contornoConcelhos1991;
        slideTotalFamilias1PConc91();
        naoDuplicar = 4;
    }
    if (layer == TotalFamilias1PConc01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 1 pessoa, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias1PConc01, ((maxTotalFamilias1PConc01-minTotalFamilias1PConc01)/2).toFixed(0),minTotalFamilias1PConc01,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamilias1PConc01();
        naoDuplicar = 5;
    }
    if (layer == TotalFamilias1PConc11 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 1 pessoa, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias1PConc11, ((maxTotalFamilias1PConc11-minTotalFamilias1PConc11)/2).toFixed(0),minTotalFamilias1PConc11,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamilias1PConc11();
        naoDuplicar = 6;
    }
    if (layer == TotalFamilias2PConc91 && naoDuplicar != 7){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 2 pessoas, em 1991, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias2PConc91, ((maxTotalFamilias2PConc91-minTotalFamilias2PConc91)/2).toFixed(0),minTotalFamilias2PConc91,0.15);
        contornoConcelhos1991.addTo(map)
        baseAtiva = contornoConcelhos1991;
        slideTotalFamilias2PConc91();
        naoDuplicar = 7;
    }
    if (layer == TotalFamilias2PConc01 && naoDuplicar != 8){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 2 pessoas, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias2PConc01, ((maxTotalFamilias2PConc01-minTotalFamilias2PConc01)/2).toFixed(0),minTotalFamilias2PConc01,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamilias2PConc01();
        naoDuplicar = 8;
    }
    if (layer == TotalFamilias2PConc11 && naoDuplicar != 9){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 2 pessoas, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias2PConc11, ((maxTotalFamilias2PConc11-minTotalFamilias2PConc11)/2).toFixed(0),minTotalFamilias2PConc11,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamilias2PConc11();
        naoDuplicar = 9;
    }
    if (layer == TotalFamilias3PConc91 && naoDuplicar != 10){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 3 pessoas, em 1991, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias3PConc91, ((maxTotalFamilias3PConc91-minTotalFamilias3PConc91)/2).toFixed(0),minTotalFamilias3PConc91,0.15);
        contornoConcelhos1991.addTo(map)
        baseAtiva = contornoConcelhos1991;
        slideTotalFamilias3PConc91();
        naoDuplicar = 10;
    }
    if (layer == TotalFamilias3PConc01 && naoDuplicar != 11){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 3 pessoas, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias3PConc01, ((maxTotalFamilias3PConc01-minTotalFamilias3PConc01)/2).toFixed(0),minTotalFamilias3PConc01,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamilias3PConc01();
        naoDuplicar = 11;
    }
    if (layer == TotalFamilias3PConc11 && naoDuplicar != 12){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 3 pessoas, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias3PConc11, ((maxTotalFamilias3PConc11-minTotalFamilias3PConc11)/2).toFixed(0),minTotalFamilias3PConc11,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamilias3PConc11();
        naoDuplicar = 12;
    }
    if (layer == TotalFamilias4PConc91 && naoDuplicar != 13){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 4 pessoas, em 1991, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias4PConc91, ((maxTotalFamilias4PConc91-minTotalFamilias4PConc91)/2).toFixed(0),minTotalFamilias4PConc91,0.15);
        contornoConcelhos1991.addTo(map)
        baseAtiva = contornoConcelhos1991;
        slideTotalFamilias4PConc91();
        naoDuplicar = 13;
    }
    if (layer == TotalFamilias4PConc01 && naoDuplicar != 14){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 4 pessoas, em 2001, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias4PConc01, ((maxTotalFamilias4PConc01-minTotalFamilias4PConc01)/2).toFixed(0),minTotalFamilias4PConc01,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamilias4PConc01();
        naoDuplicar = 14;
    }
    if (layer == TotalFamilias4PConc11 && naoDuplicar != 15){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 4 pessoas, em 2011, por concelho, Nº.' + '</strong>');
        legenda(maxTotalFamilias4PConc11, ((maxTotalFamilias4PConc11-minTotalFamilias4PConc11)/2).toFixed(0),minTotalFamilias4PConc11,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamilias4PConc11();
        naoDuplicar = 15;
    }
    if (layer == TotalFamilias5PConc91 && naoDuplicar != 16){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 5 pessoas, em 1991, por concelho, Nº.' + '</strong>');
        legendaExcecao(maxTotalFamilias5PConc91, ((maxTotalFamilias5PConc91-minTotalFamilias5PConc91)/2).toFixed(0),minTotalFamilias5PConc91,0.15);
        contornoConcelhos1991.addTo(map)
        baseAtiva = contornoConcelhos1991;
        slideTotalFamilias5PConc91();
        naoDuplicar = 16;
    }
    if (layer == TotalFamilias5PConc01 && naoDuplicar != 17){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 5 pessoas, em 2001, por concelho, Nº.' + '</strong>');
        legendaExcecao(maxTotalFamilias5PConc01, ((maxTotalFamilias5PConc01-minTotalFamilias5PConc01)/2).toFixed(0),minTotalFamilias5PConc01,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamilias5PConc01();
        naoDuplicar = 17;
    }
    if (layer == TotalFamilias5PConc11 && naoDuplicar != 18){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 5 pessoas, em 2011, por concelho, Nº.' + '</strong>');
        legendaExcecao(maxTotalFamilias5PConc11, ((maxTotalFamilias5PConc11-minTotalFamilias5PConc11)/2).toFixed(0),minTotalFamilias5PConc11,0.15);
        contorno.addTo(map)
        baseAtiva = contorno;
        slideTotalFamilias5PConc11();
        naoDuplicar = 18;
    }
    if (layer == VarTotFamiliasConc11_01 && naoDuplicar != 19){
        legendaVarTotFamiliasConc11_01();
        slideVarTotFamiliasConc11_01();
        naoDuplicar = 19;
    }
    if (layer == VarTotFamiliasConc01_91 && naoDuplicar != 20){
        legendaVarTotFamiliasConc01_91();
        slideVarTotFamiliasConc01_91();
        naoDuplicar = 20;
    }
    if (layer == Var1PFamiliasConc11_01 && naoDuplicar != 21){
        legendaVar1PFamilias11_01Conc();
        slideVar1PFamiliasConc11_01();
        naoDuplicar = 21;
    }
    if (layer == Var1PFamiliasConc01_91 && naoDuplicar != 22){
        legendaVar1PFamilias01_91Conc();
        slideVar1PFamiliasConc01_91();
        naoDuplicar = 22;
    }
    if (layer == Var2PFamiliasConc11_01 && naoDuplicar != 23){
        legendaVar2PFamilias11_01Conc();
        slideVar2PFamiliasConc11_01();
        naoDuplicar = 23;
    }
    if (layer == Var2PFamiliasConc01_91 && naoDuplicar != 24){
        legendaVar2PFamilias01_91Conc();
        slideVar2PFamiliasConc01_91();
        naoDuplicar = 24;
    }
    if (layer == Var3PFamiliasConc11_01 && naoDuplicar != 25){
        legendaVar3PFamilias11_01Conc();
        slideVar3PFamiliasConc11_01();
        naoDuplicar = 25;
    }
    if (layer == Var3PFamiliasConc01_91 && naoDuplicar != 26){
        legendaVar3PFamilias01_91Conc();
        slideVar3PFamiliasConc01_91();
        naoDuplicar = 26;
    }
    if (layer == Var4PFamiliasConc11_01 && naoDuplicar != 27){
        legendaVar4PFamilias11_01Conc();
        slideVar4PFamiliasConc11_01();
        naoDuplicar = 27;
    }
    if (layer == Var4PFamiliasConc01_91 && naoDuplicar != 28){
        legendaVar4PFamilias01_91Conc();
        slideVar4PFamiliasConc01_91();
        naoDuplicar = 28;
    }
    if (layer == Var5PFamiliasConc11_01 && naoDuplicar != 29){
        legendaVar5PFamilias11_01Conc();
        slideVar5PFamiliasConc11_01();
        naoDuplicar = 29;
    }
    if (layer == Var5PFamiliasConc01_91 && naoDuplicar != 30){
        legendaVar5PFamilias01_91Conc();
        slideVar5PFamiliasConc01_91();
        naoDuplicar = 30;
    }
    if (layer == PerFamiliaConc1P_91 && naoDuplicar != 31){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 1 pessoa, em 1991, por concelho.' + '</strong>');
        legendaPerFam1PConc();
        slidePerFamiliaConc1P_91();
        naoDuplicar = 31;
    }
    if (layer == PerFamiliaConc1P_01 && naoDuplicar != 32){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 1 pessoa, em 2001, por concelho.' + '</strong>');
        legendaPerFam1PConc();
        slidePerFamiliaConc1P_01();
        naoDuplicar = 32;
    }
    if (layer == PerFamiliaConc1P_11 && naoDuplicar != 33){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 1 pessoa, em 2011, por concelho.' + '</strong>');
        legendaPerFam1PConc();
        slidePerFamiliaConc1P_11();
        naoDuplicar = 33;
    }
    if (layer == PerFamiliaConc2P_91 && naoDuplicar != 34){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 2 pessoas, em 1991, por concelho.' + '</strong>');
        legendaPerFam2PConc();
        slidePerFamiliaConc2P_91();
        naoDuplicar = 34;
    }
    if (layer == PerFamiliaConc2P_01 && naoDuplicar != 35){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 2 pessoas, em 2001, por concelho.' + '</strong>');
        legendaPerFam2PConc();
        slidePerFamiliaConc2P_01();
        naoDuplicar = 35;
    }
    if (layer == PerFamiliaConc2P_11 && naoDuplicar != 36){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 2 pessoas, em 2011, por concelho.' + '</strong>');
        legendaPerFam2PConc();
        slidePerFamiliaConc2P_11();
        naoDuplicar = 36;
    }
    if (layer == PerFamiliaConc3P_91 && naoDuplicar != 37){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 3 pessoas, em 1991, por concelho.' + '</strong>');
        legendaPerFam3PConc();
        slidePerFamiliaConc3P_91();
        naoDuplicar = 37;
    }
    if (layer == PerFamiliaConc3P_01 && naoDuplicar != 38){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 3 pessoas, em 2001, por concelho.' + '</strong>');
        legendaPerFam3PConc();
        slidePerFamiliaConc3P_01();
        naoDuplicar = 38;
    }
    if (layer == PerFamiliaConc3P_11 && naoDuplicar != 39){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 3 pessoas, em 2011, por concelho.' + '</strong>');
        legendaPerFam3PConc();
        slidePerFamiliaConc3P_11();
        naoDuplicar = 39;
    }
    if (layer == PerFamiliaConc4P_91 && naoDuplicar != 40){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 4 pessoas, em 1991, por concelho.' + '</strong>');
        legendaPerFam4PConc();
        slidePerFamiliaConc4P_91();
        naoDuplicar = 40;
    }
    if (layer == PerFamiliaConc4P_01 && naoDuplicar != 41){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 4 pessoas, em 2001, por concelho.' + '</strong>');
        legendaPerFam4PConc();
        slidePerFamiliaConc4P_01();
        naoDuplicar = 41;
    }
    if (layer == PerFamiliaConc4P_11 && naoDuplicar != 42){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 4 pessoas, em 2011, por concelho.' + '</strong>');
        legendaPerFam4PConc();
        slidePerFamiliaConc4P_11();
        naoDuplicar = 42;
    }
    if (layer == PerFamiliaConc5P_91 && naoDuplicar != 43){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 5 pessoas, em 1991, por concelho.' + '</strong>');
        legendaPerFam5PConc();
        slidePerFamiliaConc5P_91();
        naoDuplicar = 43;
    }
    if (layer == PerFamiliaConc5P_01 && naoDuplicar != 44){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 5 pessoas, em 2001, por concelho.' + '</strong>');
        legendaPerFam5PConc();
        slidePerFamiliaConc5P_01();
        naoDuplicar = 44;
    }
    if (layer == PerFamiliaConc5P_11 && naoDuplicar != 45){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 5 pessoas, em 2011, por concelho.' + '</strong>');
        legendaPerFam5PConc();
        slidePerFamiliaConc5P_11();
        naoDuplicar = 45;
    }
    if (layer == TotalFamiliasFreg01 && naoDuplicar != 46){
        $('#tituloMapa').html('<strong>' + 'Total de famílias clássicas, em 2001, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamiliasFreg01,((maxTotalFamiliasFreg01-minTotalFamiliasFreg01)/2).toFixed(0),minTotalFamiliasFreg01,0.15);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamiliasFreg01();  
        naoDuplicar = 46;
    }
    if (layer == TotalFamiliasFreg11 && naoDuplicar != 47){
        $('#tituloMapa').html('<strong>' + 'Total de famílias clássicas, em 2011, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamiliasFreg11,((maxTotalFamiliasFreg11-minTotalFamiliasFreg11)/2).toFixed(0),minTotalFamiliasFreg11,0.15);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamiliasFreg11();  
        naoDuplicar = 47;
    }
    if (layer == TotalFamilias1P_Freg01 && naoDuplicar != 48){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 1 pessoa, em 2001, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamilias1P_Freg01,((maxTotalFamilias1P_Freg01-minTotalFamilias1P_Freg01)/2).toFixed(0),minTotalFamilias1P_Freg01,0.3);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamilias1P_Freg01();  
        naoDuplicar = 48;
    }
    if (layer == TotalFamilias1P_Freg11 && naoDuplicar != 49){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 1 pessoa, em 2011, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamilias1P_Freg11,((maxTotalFamilias1P_Freg11-minTotalFamilias1P_Freg11)/2).toFixed(0),minTotalFamilias1P_Freg11,0.3);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamilias1P_Freg11();  
        naoDuplicar = 49;
    }
    if (layer == TotalFamilias2P_Freg01 && naoDuplicar != 50){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 2 pessoas, em 2001, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamilias2P_Freg01,((maxTotalFamilias2P_Freg01-minTotalFamilias2P_Freg01)/2).toFixed(0),minTotalFamilias2P_Freg01,0.3);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamilias2P_Freg01();  
        naoDuplicar = 50;
    }
    if (layer == TotalFamilias2P_Freg11 && naoDuplicar != 51){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 2 pessoas, em 2011, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamilias2P_Freg11,((maxTotalFamilias2P_Freg11-minTotalFamilias2P_Freg11)/2).toFixed(0),minTotalFamilias2P_Freg11,0.3);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamilias2P_Freg11();  
        naoDuplicar = 51;
    }
    if (layer == TotalFamilias3P_Freg01 && naoDuplicar != 52){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 3 pessoas, em 2001, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamilias3P_Freg01,((maxTotalFamilias3P_Freg01-minTotalFamilias3P_Freg01)/2).toFixed(0),minTotalFamilias3P_Freg01,0.3);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamilias3P_Freg01();  
        naoDuplicar = 52;
    }
    if (layer == TotalFamilias3P_Freg11 && naoDuplicar != 53){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 3 pessoas, em 2011, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamilias3P_Freg11,((maxTotalFamilias3P_Freg11-minTotalFamilias3P_Freg11)/2).toFixed(0),minTotalFamilias3P_Freg11,0.3);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamilias3P_Freg11();  
        naoDuplicar = 53;
    }
    if (layer == TotalFamilias4P_Freg01 && naoDuplicar != 54){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 4 pessoas, em 2001, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamilias4P_Freg01,((maxTotalFamilias4P_Freg01-minTotalFamilias4P_Freg01)/2).toFixed(0),minTotalFamilias4P_Freg01,0.3);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamilias4P_Freg01();  
        naoDuplicar = 54;
    }
    if (layer == TotalFamilias4P_Freg11 && naoDuplicar != 55){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 4 pessoas, em 2011, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamilias4P_Freg11,((maxTotalFamilias4P_Freg11-minTotalFamilias4P_Freg11)/2).toFixed(0),minTotalFamilias4P_Freg11,0.3);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamilias4P_Freg11();  
        naoDuplicar = 55;
    }
    if (layer == TotalFamilias5P_Freg01 && naoDuplicar != 56){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 5 pessoas, em 2001, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamilias5P_Freg01,((maxTotalFamilias5P_Freg01-minTotalFamilias5P_Freg01)/2).toFixed(0),minTotalFamilias5P_Freg01,0.3);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamilias5P_Freg01();  
        naoDuplicar = 56;
    }
    if (layer == TotalFamilias5P_Freg11 && naoDuplicar != 57){
        $('#tituloMapa').html('<strong>' + 'Número de famílias clássicas com 5 pessoas, em 2011, por freguesia, Nº.' + '</strong>');
        legenda(maxTotalFamilias5P_Freg11,((maxTotalFamilias5P_Freg11-minTotalFamilias5P_Freg11)/2).toFixed(0),minTotalFamilias5P_Freg11,0.3);
        contornoFreg2001.addTo(map)
        baseAtiva = contornoFreg2001;
        slideTotalFamilias5P_Freg11();  
        naoDuplicar = 57;
    }
    if (layer == VarTotFamiliasFreg11_01 && naoDuplicar != 58){
        legendaVarTotalFamiliasFreg();
        slideVarTotFamiliasFreg11_01();
        naoDuplicar = 58;
    }
    if (layer == VarFamilias1PFreg11_01 && naoDuplicar != 59){
        legendaVar1PFamiliasFreg();
        slideVarFamilias1PFreg11_01();
        naoDuplicar = 59;
    }
    if (layer == VarFamilias2PFreg11_01 && naoDuplicar != 60){
        legendaVar2PFamiliasFreg();
        slideVarFamilias2PFreg11_01();
        naoDuplicar = 60;
    }
    if (layer == VarFamilias3PFreg11_01 && naoDuplicar != 61){
        legendaVar3PFamiliasFreg();
        slideVarFamilias3PFreg11_01();
        naoDuplicar = 61;
    }
    if (layer == VarFamilias4PFreg11_01 && naoDuplicar != 62){
        legendaVar4PFamiliasFreg();
        slideVarFamilias4PFreg11_01();
        naoDuplicar = 62;
    }
    if (layer == VarFamilias5PFreg11_01 && naoDuplicar != 63){
        legendaVar5PFamiliasFreg();
        slideVarFamilias5PFreg11_01();
        naoDuplicar = 63;
    }
    if (layer == PerFamiliaFreg1P_01 && naoDuplicar != 64){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 1 pessoa, em 2001, por freguesia.' + '</strong>');
        legendaPerFam1PFreg();
        slidePerFamiliaFreg1P_01();
        naoDuplicar = 64;
    }
    if (layer == PerFamiliaFreg1P_11 && naoDuplicar != 65){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 1 pessoa, em 2011, por freguesia.' + '</strong>');
        legendaPerFam1PFreg();
        slidePerFamiliaFreg1P_11();
        naoDuplicar = 65;
    }
    if (layer == PerFamiliaFreg2P_01 && naoDuplicar != 66){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 2 pessoas, em 2001, por freguesia.' + '</strong>');
        legendaPerFam2PFreg();
        slidePerFamiliaFreg2P_01();
        naoDuplicar = 66;
    }
    if (layer == PerFamiliaFreg2P_11 && naoDuplicar != 67){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 2 pessoas, em 2011, por freguesia.' + '</strong>');
        legendaPerFam2PFreg();
        slidePerFamiliaFreg2P_11();
        naoDuplicar = 67;
    }
    if (layer == PerFamiliaFreg3P_01 && naoDuplicar != 68){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 3 pessoas, em 2001, por freguesia.' + '</strong>');
        legendaPerFam3PFreg();
        slidePerFamiliaFreg3P_01();
        naoDuplicar = 68;
    }
    if (layer == PerFamiliaFreg3P_11 && naoDuplicar != 69){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 3 pessoas, em 2011, por freguesia.' + '</strong>');
        legendaPerFam3PFreg();
        slidePerFamiliaFreg3P_11();
        naoDuplicar = 69;
    }
    if (layer == PerFamiliaFreg4P_01 && naoDuplicar != 70){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 4 pessoas, em 2001, por freguesia.' + '</strong>');
        legendaPerFam4PFreg();
        slidePerFamiliaFreg4P_01();
        naoDuplicar = 70;
    }
    if (layer == PerFamiliaFreg4P_11 && naoDuplicar != 71){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 4 pessoas, em 2011, por freguesia.' + '</strong>');
        legendaPerFam4PFreg();
        slidePerFamiliaFreg4P_11();
        naoDuplicar = 71;
    }
    if (layer == PerFamiliaFreg5P_01 && naoDuplicar != 72){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 5 pessoas, em 2001, por freguesia.' + '</strong>');
        legendaPerFam5PFreg();
        slidePerFamiliaFreg5P_01();
        naoDuplicar = 72;
    }
    if (layer == PerFamiliaFreg5P_11 && naoDuplicar != 73){
        $('#tituloMapa').html('<strong>' + 'Proporção de familías com 5 pessoas, em 2011, por freguesia.' + '</strong>');
        legendaPerFam5PFreg();
        slidePerFamiliaFreg5P_11();
        naoDuplicar = 73;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}

let notaRodape = function(texto){
    if ($('#notaRodape').length){
        // $('#notaRodape').html('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os dados absolutos à escala concelhia.');
        $('#notaRodape').html(texto);
    }
    else{
        $('#painel').append("<div id='notaRodape'></div>")
        // $('#notaRodape').html('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os dados absolutos à escala concelhia.');
        $('#notaRodape').html(texto);
    }
}

function myFunction() {
    var dimensao = document.getElementById("opcaoSelect").value;
    var anoSelecionado = document.getElementById("mySelect").value;
    if($('#absoluto').hasClass('active4')){
        $('#notaRodape').remove();
        if (anoSelecionado == "1991" && dimensao =="Total"){
            novaLayer(TotalFamiliasConc91);
        };
        if (anoSelecionado == "2001" && dimensao =="Total"){
            novaLayer(TotalFamiliasConc01);
        };
        if (anoSelecionado == "2011" && dimensao =="Total"){
            novaLayer(TotalFamiliasConc11);
        }; 
        if (anoSelecionado == "1991" && dimensao =="1P"){
            novaLayer(TotalFamilias1PConc91);
        }; 
        if (anoSelecionado == "2001" && dimensao =="1P"){
            novaLayer(TotalFamilias1PConc01);
        }; 
        if (anoSelecionado == "2011" && dimensao =="1P"){
            novaLayer(TotalFamilias1PConc11);
        }; 
        if (anoSelecionado == "1991" && dimensao =="2P"){
            novaLayer(TotalFamilias2PConc91);
        }; 
        if (anoSelecionado == "2001" && dimensao =="2P"){
            novaLayer(TotalFamilias2PConc01);
        }; 
        if (anoSelecionado == "2011" && dimensao =="2P"){
            novaLayer(TotalFamilias2PConc11);
        }; 
        if (anoSelecionado == "1991" && dimensao =="3P"){
            novaLayer(TotalFamilias3PConc91);
        }; 
        if (anoSelecionado == "2001" && dimensao =="3P"){
            novaLayer(TotalFamilias3PConc01);
        }; 
        if (anoSelecionado == "2011" && dimensao =="3P"){
            novaLayer(TotalFamilias3PConc11);
        }; 
        if (anoSelecionado == "1991" && dimensao =="4P"){
            novaLayer(TotalFamilias4PConc91);
        }; 
        if (anoSelecionado == "2001" && dimensao =="4P"){
            novaLayer(TotalFamilias4PConc01);
        }; 
        if (anoSelecionado == "2011" && dimensao =="4P"){
            novaLayer(TotalFamilias4PConc11);
        }; 
        if (anoSelecionado == "1991" && dimensao =="5P"){
            novaLayer(TotalFamilias5PConc91);
        }; 
        if (anoSelecionado == "2001" && dimensao =="5P"){
            novaLayer(TotalFamilias5PConc01);
        }; 
        if (anoSelecionado == "2011" && dimensao =="5P"){
            novaLayer(TotalFamilias5PConc11);
        }; 
    }
    if($('#taxaVariacao').hasClass('active4')){
        if (anoSelecionado == "1991" && dimensao =="Total"){
            novaLayer(VarTotFamiliasConc01_91);
        };
        if (anoSelecionado == "2001" && dimensao =="Total"){
            novaLayer(VarTotFamiliasConc11_01);
        };
        if (anoSelecionado == "1991" && dimensao =="1P"){
            novaLayer(Var1PFamiliasConc01_91);
        };
        if (anoSelecionado == "2001" && dimensao =="1P"){
            novaLayer(Var1PFamiliasConc11_01);
        };
        if (anoSelecionado == "1991" && dimensao =="2P"){
            novaLayer(Var2PFamiliasConc01_91);
        };
        if (anoSelecionado == "2001" && dimensao =="2P"){
            novaLayer(Var2PFamiliasConc11_01);
        };
        if (anoSelecionado == "1991" && dimensao =="3P"){
            novaLayer(Var3PFamiliasConc01_91);
        };
        if (anoSelecionado == "2001" && dimensao =="3P"){
            novaLayer(Var3PFamiliasConc11_01);
        };
        if (anoSelecionado == "1991" && dimensao =="4P"){
            novaLayer(Var4PFamiliasConc01_91);
        };
        if (anoSelecionado == "2001" && dimensao =="4P"){
            novaLayer(Var4PFamiliasConc11_01);
        };
        if (anoSelecionado == "1991" && dimensao =="5P"){
            novaLayer(Var5PFamiliasConc01_91);
        };
        if (anoSelecionado == "2001" && dimensao =="5P"){
            novaLayer(Var5PFamiliasConc11_01);
        };
    }
    if ($('#percentagem').hasClass('active4')){
        if (anoSelecionado == "1991" && dimensao =="1P"){
            novaLayer(PerFamiliaConc1P_91);
        };
        if (anoSelecionado == "2001" && dimensao =="1P"){
            novaLayer(PerFamiliaConc1P_01);
        };
        if (anoSelecionado == "2011" && dimensao =="1P"){
            novaLayer(PerFamiliaConc1P_11);
        };
        if (anoSelecionado == "1991" && dimensao =="2P"){
            novaLayer(PerFamiliaConc2P_91);
        };
        if (anoSelecionado == "2001" && dimensao =="2P"){
            novaLayer(PerFamiliaConc2P_01);
        };
        if (anoSelecionado == "2011" && dimensao =="2P"){
            novaLayer(PerFamiliaConc2P_11);
        };
        if (anoSelecionado == "1991" && dimensao =="3P"){
            novaLayer(PerFamiliaConc3P_91);
        };
        if (anoSelecionado == "2001" && dimensao =="3P"){
            novaLayer(PerFamiliaConc3P_01);
        };
        if (anoSelecionado == "2011" && dimensao =="3P"){
            novaLayer(PerFamiliaConc3P_11);
        };
        if (anoSelecionado == "1991" && dimensao =="4P"){
            novaLayer(PerFamiliaConc4P_91);
        };
        if (anoSelecionado == "2001" && dimensao =="4P"){
            novaLayer(PerFamiliaConc4P_01);
        };
        if (anoSelecionado == "2011" && dimensao =="4P"){
            novaLayer(PerFamiliaConc4P_11);
        };
        if (anoSelecionado == "1991" && dimensao =="5P"){
            novaLayer(PerFamiliaConc5P_91);
        };
        if (anoSelecionado == "2001" && dimensao =="5P"){
            novaLayer(PerFamiliaConc5P_01);
        };
        if (anoSelecionado == "2011" && dimensao =="5P"){
            novaLayer(PerFamiliaConc5P_11);
        };
    }
    if($('#absoluto').hasClass('active5')){
        if (dimensao == "Total"){
            if (anoSelecionado == "2001"){
                novaLayer(TotalFamiliasFreg01);
            }
            if (anoSelecionado == "2011"){
                novaLayer(TotalFamiliasFreg11);
            }
        }
        if (dimensao != "Total"){
            notaRodape('Devido aos valores reduzidos, optou-se por aumentar a proporção dos círculos de forma que seja possível uma melhor perceção, não devendo, assim, comparar com os <strong> dados absolutos à escala concelhia e os dados totais à escala da freguesia. </strong>')
        }
        if (anoSelecionado == "2001" && dimensao =="1P"){
            novaLayer(TotalFamilias1P_Freg01);
        };
        if (anoSelecionado == "2011" && dimensao =="1P"){
            novaLayer(TotalFamilias1P_Freg11);
        };
        if (anoSelecionado == "2001" && dimensao =="2P"){
            novaLayer(TotalFamilias2P_Freg01);
        };
        if (anoSelecionado == "2011" && dimensao =="2P"){
            novaLayer(TotalFamilias2P_Freg11);
        };
        if (anoSelecionado == "2001" && dimensao =="3P"){
            novaLayer(TotalFamilias3P_Freg01);
        };
        if (anoSelecionado == "2011" && dimensao =="3P"){
            novaLayer(TotalFamilias3P_Freg11);
        };
        if (anoSelecionado == "2001" && dimensao =="4P"){
            novaLayer(TotalFamilias4P_Freg01);
        };
        if (anoSelecionado == "2011" && dimensao =="4P"){
            novaLayer(TotalFamilias4P_Freg11);
        };
        if (anoSelecionado == "2001" && dimensao =="5P"){
            novaLayer(TotalFamilias5P_Freg01);
        };
        if (anoSelecionado == "2011" && dimensao =="5P"){
            novaLayer(TotalFamilias5P_Freg11);
        };
    }
    if($('#taxaVariacao').hasClass('active5')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2001" && dimensao =="Total"){
            novaLayer(VarTotFamiliasFreg11_01);
        };
        if (anoSelecionado == "2001" && dimensao =="1P"){
            novaLayer(VarFamilias1PFreg11_01);
        };
        if (anoSelecionado == "2001" && dimensao =="2P"){
            novaLayer(VarFamilias2PFreg11_01);
        };
        if (anoSelecionado == "2001" && dimensao =="3P"){
            novaLayer(VarFamilias3PFreg11_01);
        };
        if (anoSelecionado == "2001" && dimensao =="4P"){
            novaLayer(VarFamilias4PFreg11_01);
        };
        if (anoSelecionado == "2001" && dimensao =="5P"){
            novaLayer(VarFamilias5PFreg11_01);
        };
    }
    if($('#percentagem').hasClass('active5')){
        $('#notaRodape').remove();
        if (anoSelecionado == "2001" && dimensao =="1P"){
            novaLayer(PerFamiliaFreg1P_01);
        };
        if (anoSelecionado == "2011" && dimensao =="1P"){
            novaLayer(PerFamiliaFreg1P_11);
        };
        if (anoSelecionado == "2001" && dimensao =="2P"){
            novaLayer(PerFamiliaFreg2P_01);
        };
        if (anoSelecionado == "2011" && dimensao =="2P"){
            novaLayer(PerFamiliaFreg2P_11);
        };
        if (anoSelecionado == "2001" && dimensao =="3P"){
            novaLayer(PerFamiliaFreg3P_01);
        };
        if (anoSelecionado == "2011" && dimensao =="3P"){
            novaLayer(PerFamiliaFreg3P_11);
        };
        if (anoSelecionado == "2001" && dimensao =="4P"){
            novaLayer(PerFamiliaFreg4P_01);
        };
        if (anoSelecionado == "2011" && dimensao =="4P"){
            novaLayer(PerFamiliaFreg4P_11);
        };
        if (anoSelecionado == "2001" && dimensao =="5P"){
            novaLayer(PerFamiliaFreg5P_01);
        };
        if (anoSelecionado == "2011" && dimensao =="5P"){
            novaLayer(PerFamiliaFreg5P_11);
        };
    }
}

let primeirovalor = function(valor,ano){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(valor)
    
}
let TotalPercentagem = function(){
    if ($("#opcaoSelect option[value='Total']").length != 0){
        $("#opcaoSelect option[value='Total']").remove();
    }
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let TotalAbsoluto = function(){
    if ($("#opcaoSelect option[value='Total']").length == 0){
        $("#opcaoSelect option").eq(0).before($("<option></option>").val("Total").text("Total"));
    }
}

let reporAnos = function(){
    if($('#concelho').hasClass('active2')){
        $('#mySelect').empty();
        var ano = 1991;
        while (ano <= 2011){
            $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '</option>');
            ano += 10;
        }
        if($('#absoluto').hasClass('active4')){
            primeirovalor('Total',"1991");
        }
        if($('#percentagem').hasClass('active4')){
            primeirovalor('1P',"1991");
        }
    }
    if($('#freguesias').hasClass('active2')){
        $('#mySelect').empty();
        var ano = 2001;
        while (ano <= 2011){
            $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '</option>');
            ano += 10;
        }
        if($('#absoluto').hasClass('active5')){
            primeirovalor('Total',"2001");
        }
        if($('#percentagem').hasClass('active5')){
            primeirovalor('1P',"2001");
        }
    }
}
let reporAnosVariacao = function(){
    if($('#concelho').hasClass('active2')){
        $('#mySelect').empty();
        var ano = 2001;
        var anoAnterior = 1991;
        while (anoAnterior < 2011){
            $('#mySelect').append("<option value="+ '' + anoAnterior + '' + '>' + ano + '-' + anoAnterior + '</option>');
            ano += 10;
            anoAnterior += 10;
        }
        primeirovalor('Total',"1991");
    }
    if($('#freguesias').hasClass('active2')){
        $('#mySelect').empty();
        $('#mySelect').append("<option value='2001'>2011 - 2001</option>");
        primeirovalor('Total',"2001");
    }
}
function mudarEscala(){
    reporAnos();
    TotalAbsoluto();
    tamanhoOutros();
    fonteTitulo('N');
}
$('#absoluto').click(function(){
    mudarEscala();

});
$('#percentagem').click(function(){
    reporAnos();
    TotalPercentagem();
    tamanhoOutros();
    fonteTitulo('F');
});
$('#taxaVariacao').click(function(){
    reporAnosVariacao();
    TotalAbsoluto();
    tamanhoOutros();
    fonteTitulo('F');
});

let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + 'INE, Recenseamento da população e habitação');
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + 'Cálculos próprios; INE, Recenseamento da população e habitação');
    }
}


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
    if($('#absoluto').hasClass('active5')){
        return false;
    }
    else{
        $('#absoluto').attr('class',"butao active5")
        $('#percentagem').attr('class',"butao")
        $('#taxaVariacao').attr('class',"butao")
        mudarEscala();
    }
}

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

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais  active2")
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

function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
}

var DadosAbsolutosTipoAlojamento = function(){
    $('#tituloMapa').html('Número de famílias clássicas, segundo a dimensão, entre 1991 e 2021, Nº.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/FamiliasExistentesProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html("1991");
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Dimensao+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS1991.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Dimensao+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS1991.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom">'+value.DADOS2011.toLocaleString("fr")+'</td>';
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
    $('#tituloMapa').html('Variação do número de famílias clássicas, segundo a dimensão, entre 1991 e 2011, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/FamiliasExistentesProv.json", function(data){
            $('#juntarValores').empty();
            $('#1991').html(" ")
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Dimensao+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+ ' '+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR0191+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR1101+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Dimensao+'</td>';
                    dados += '<td>'+ ' '+'</td>';
                    dados += '<td>'+value.VAR0191+'</td>';
                    dados += '<td>'+value.VAR1101+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados); 
    });
    });
});

$('#tabelaPercentagem').click(function(){
    $('#1991').html("1991")
    $('#tituloMapa').html('Proporção do número de famílias clássicas, segundo a dimensão, entre 1991 e 2011, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/FamiliasExistentesProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Dimensao+'</td>';;
                    dados += '<td class="borderbottom">'+value.Per91+'</td>';
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class="negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Dimensao+'</td>';;
                    dados += '<td class="borderbottom">'+value.Per91+'</td>';
                    dados += '<td class="borderbottom">'+value.Per01+'</td>';
                    dados += '<td class="borderbottom">'+value.Per11+'</td>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

let anosSelecionados = function() {
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2")){
        if (anoSelecionado == "2011"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (anoSelecionado == "2001"){
            i = 0;
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado != "2011" || anoSelecionado != "1991"){
            i = 1
        }
        if (anoSelecionado == "2011"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (anoSelecionado == "1991"){
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
