// $('#mapDIV').css("height", "85%");
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

//////////////////////-------------------------Orientação\\\\\\\\\\\\\\\\\\
var Orientacao = L.control({position: "topleft"});
Orientacao.onAdd = function(map) {
    var div = L.DomUtil.create("div", "north");
    div.innerHTML = '<img src="../../../../imagens/norte.png" alt="Orientação" height="40px" width="23px">';
    return div;
}
Orientacao.addTo(map)

//////----- CIRCULOS
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


///////////////////////////----------------------- DADOS RELATIVOS, CONCELHO--------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////------- DENSIDADE ALOJAMENTOS CONCELHO em 2001-----////

var minPercDensidadeConc01 = 99999;
var maxPercDensidadeConc01 = 0;

function CorPercDensidadeConc(d) {
    return d == null ? '#808080' :
        d >= 500 ? '#8c0303' :
        d >= 250  ? '#de1f35' :
        d >= 100  ? '#ff5e6e' :
        d >= 50   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaPercDensidadeConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: Alojamentos / Área (km²)' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 500' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 250 a 500' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 100 a 250' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 50 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 28.6 a 50' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloPercDensidadeConc01(feature) {
    if( feature.properties.Dens01_EDI <= minPercDensidadeConc01){
        minPercDensidadeConc01 = feature.properties.Dens01_EDI
    }
    if(feature.properties.Dens01_EDI >= maxPercDensidadeConc01 ){
        maxPercDensidadeConc01 = feature.properties.Dens01_EDI
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPercDensidadeConc(feature.properties.Dens01_EDI)
    };
}
function apagarPercDensidadeConc01(e) {
    PercDensidadeConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercDensidadeConc01(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Densidade: ' + '<b>' + feature.properties.Dens01_EDI.toFixed(0)  + ' Alojamentos por km² ' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercDensidadeConc01,
    });
}
var PercDensidadeConc01= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercDensidadeConc01,
    onEachFeature: onEachFeaturePercDensidadeConc01
});
let slidePercDensidadeConc01 = function(){
    var sliderPercDensidadeConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercDensidadeConc01, {
        start: [minPercDensidadeConc01, maxPercDensidadeConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercDensidadeConc01,
            'max': maxPercDensidadeConc01
        },
        });
    inputNumberMin.setAttribute("value",minPercDensidadeConc01);
    inputNumberMax.setAttribute("value",maxPercDensidadeConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderPercDensidadeConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercDensidadeConc01.noUiSlider.set([null, this.value]);
    });

    sliderPercDensidadeConc01.noUiSlider.on('update',function(e){
        PercDensidadeConc01.eachLayer(function(layer){
            if(layer.feature.properties.Dens01_EDI.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Dens01_EDI.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercDensidadeConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderPercDensidadeConc01.noUiSlider;
    $(slidersGeral).append(sliderPercDensidadeConc01);
} 
PercDensidadeConc01.addTo(map);
slidePercDensidadeConc01();
$('#tituloMapa').html(' <strong>' + 'Densidade de alojamentos, em 2001, por concelho.' + '</strong>')
legendaPercDensidadeConc();

/////////////////////////////// Fim DENSIDADE ALOJAMENTOS CONCELHO em 2001  -------------- \\\\\\

////////////////////////////------- DENSIDADE ALOJAMENTOS CONCELHO em 2011-----////

var minPercDensidadeConc11 = 99999;
var maxPercDensidadeConc11 = 0;

function EstiloPercDensidadeConc11(feature) {
    if( feature.properties.Dens11_EDI <= minPercDensidadeConc11){
        minPercDensidadeConc11 = feature.properties.Dens11_EDI
    }
    if(feature.properties.Dens11_EDI >= maxPercDensidadeConc11 ){
        maxPercDensidadeConc11 = feature.properties.Dens11_EDI
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPercDensidadeConc(feature.properties.Dens11_EDI)
    };
}
function apagarPercDensidadeConc11(e) {
    PercDensidadeConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePercDensidadeConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Densidade: ' + '<b>' + feature.properties.Dens11_EDI.toFixed(0)  + ' Alojamentos por km² ' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPercDensidadeConc11,
    });
}
var PercDensidadeConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPercDensidadeConc11,
    onEachFeature: onEachFeaturePercDensidadeConc11
});
let slidePercDensidadeConc11 = function(){
    var sliderPercDensidadeConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPercDensidadeConc11, {
        start: [minPercDensidadeConc11, maxPercDensidadeConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercDensidadeConc11,
            'max': maxPercDensidadeConc11
        },
        });
    inputNumberMin.setAttribute("value",minPercDensidadeConc11);
    inputNumberMax.setAttribute("value",maxPercDensidadeConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercDensidadeConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercDensidadeConc11.noUiSlider.set([null, this.value]);
    });

    sliderPercDensidadeConc11.noUiSlider.on('update',function(e){
        PercDensidadeConc11.eachLayer(function(layer){
            if(layer.feature.properties.Dens11_EDI.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Dens11_EDI.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPercDensidadeConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderPercDensidadeConc11.noUiSlider;
    $(slidersGeral).append(sliderPercDensidadeConc11);
} 

/////////////////////////////// Fim DENSIDADE ALOJAMENTOS CONCELHO em 2011  -------------- \\\\\\


/////////////////////////////------------------------ VARIAÇÕES -------------------------------\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação DENSIDADE ALOJAMENTOS -------------------////

var minVarDensidadeConc = 99999;
var maxVarDensidadeConc = 0;

function CorVarDensidadeConc(d) {
    return d === null ? '#808080':
        d >= 20  ? '#8c0303' :
        d >= 15  ? '#de1f35' :
        d >= 12  ? '#ff5e6e' :
        d >= 8  ? '#f5b3be' :
                ''  ;
}

var legendaVarDensidadeConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da densidade de alojamentos, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  15 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  12 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  8.41 a 12' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVarDensidadeConc(feature) {
    if(feature.properties.Var_Dens <= minVarDensidadeConc){
        minVarDensidadeConc = feature.properties.Var_Dens
    }
    if(feature.properties.Var_Dens > maxVarDensidadeConc){
        maxVarDensidadeConc = feature.properties.Var_Dens 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarDensidadeConc(feature.properties.Var_Dens)};
    }


function apagarVarDensidadeConc(e) {
    VarDensidadeConc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarDensidadeConc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var_Dens.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarDensidadeConc,
    });
}
var VarDensidadeConc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVarDensidadeConc,
    onEachFeature: onEachFeatureVarDensidadeConc
});

let slideVarDensidadeConc = function(){
    var sliderVarDensidadeConc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarDensidadeConc, {
        start: [minVarDensidadeConc, maxVarDensidadeConc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarDensidadeConc,
            'max': maxVarDensidadeConc
        },
        });
    inputNumberMin.setAttribute("value",minVarDensidadeConc);
    inputNumberMax.setAttribute("value",maxVarDensidadeConc);

    inputNumberMin.addEventListener('change', function(){
        sliderVarDensidadeConc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarDensidadeConc.noUiSlider.set([null, this.value]);
    });

    sliderVarDensidadeConc.noUiSlider.on('update',function(e){
        VarDensidadeConc.eachLayer(function(layer){
            if(layer.feature.properties.Var_Dens.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_Dens.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarDensidadeConc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderVarDensidadeConc.noUiSlider;
    $(slidersGeral).append(sliderVarDensidadeConc);
} 

///////////////////////////// Fim VARIAÇÃO DENSIDADE DE ALOJAMENTOS POR CONCELHOS -------------- \\\\\


//////////////////////////----------------------------- FIM VARIAÇÕES

/////////////////////////////--------------------- DADOS RELATIVOS FREGUESIA

////////////////////////////////////----------- DENSIDADE, EM 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\
var minPercDensidadeFreg01 = 99999;
var maxPercDensidadeFreg01 = 0;

function CorPercDensidadeFreg(d) {
    return d == null ? '#808080' :
        d >= 500 ? '#8c0303' :
        d >= 250  ? '#de1f35' :
        d >= 100  ? '#ff5e6e' :
        d >= 20   ? '#f5b3be' :
        d >= 0   ? '#F2C572' :
                ''  ;
}
var legendaPercDensidadeFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: Alojamentos / Área (km²)' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 500' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 250 a 500' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 100 a 250' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 20 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 2 a 20' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloPercDensidadeFreg01(feature) {
    if(feature.properties.Dens01_EDI< minPercDensidadeFreg01){
        minPercDensidadeFreg01 = feature.properties.Dens01_EDI
    }
    if(feature.properties.Dens01_EDI> maxPercDensidadeFreg01){
        maxPercDensidadeFreg01 = feature.properties.Dens01_EDI
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPercDensidadeFreg(feature.properties.Dens01_EDI)
    };
}
function apagarPercDensidadeFreg01(e){
    var layer = e.target;
    PercDensidadeFreg01.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePercDensidadeFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Densidade: ' + '<b>' + feature.properties.Dens01_EDI.toFixed(0)  + ' Alojamentos por km² ' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPercDensidadeFreg01,
    })
};

var PercDensidadeFreg01= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPercDensidadeFreg01,
    onEachFeature: onEachFeaturePercDensidadeFreg01,
});

var slidePercDensidadeFreg01 = function(){
    var sliderPercDensidadeFreg01 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPercDensidadeFreg01, {
        start: [minPercDensidadeFreg01, maxPercDensidadeFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercDensidadeFreg01,
            'max': maxPercDensidadeFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPercDensidadeFreg01);
    inputNumberMax.setAttribute("value",maxPercDensidadeFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderPercDensidadeFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercDensidadeFreg01.noUiSlider.set([null, this.value]);
    });

    sliderPercDensidadeFreg01.noUiSlider.on('update',function(e){
        PercDensidadeFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Dens01_EDI>=parseFloat(e[0])&& layer.feature.properties.Dens01_EDI <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPercDensidadeFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderPercDensidadeFreg01.noUiSlider;
    $(slidersGeral).append(sliderPercDensidadeFreg01);
}
///////////////////////////-------------------- FIM DENSIDADE, EM 2001,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- DENSIDADE, EM 2011,Por Freguesia ------------------------------\\\\\\\\\\\\\
var minPercDensidadeFreg11 = 99999;
var maxPercDensidadeFreg11 = 0;
function estiloPercDensidadeFreg11(feature) {
    if(feature.properties.Dens11_EDI< minPercDensidadeFreg11 || minPercDensidadeFreg11 ===0){
        minPercDensidadeFreg11 = feature.properties.Dens11_EDI
    }
    if(feature.properties.Dens11_EDI> maxPercDensidadeFreg11){
        maxPercDensidadeFreg11 = feature.properties.Dens11_EDI
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPercDensidadeFreg(feature.properties.Dens11_EDI)
    };
}
function apagarPercDensidadeFreg11(e){
    var layer = e.target;
    PercDensidadeFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePercDensidadeFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Densidade: ' + '<b>' + feature.properties.Dens11_EDI.toFixed(0)  + ' Alojamentos por km² ' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPercDensidadeFreg11,
    })
};
var PercDensidadeFreg11= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPercDensidadeFreg11,
    onEachFeature: onEachFeaturePercDensidadeFreg11,
});

var slidePercDensidadeFreg11 = function(){
    var sliderPercDensidadeFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPercDensidadeFreg11, {
        start: [minPercDensidadeFreg11, maxPercDensidadeFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minPercDensidadeFreg11,
            'max': maxPercDensidadeFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPercDensidadeFreg11);
    inputNumberMax.setAttribute("value",maxPercDensidadeFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderPercDensidadeFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPercDensidadeFreg11.noUiSlider.set([null, this.value]);
    });

    sliderPercDensidadeFreg11.noUiSlider.on('update',function(e){
        PercDensidadeFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Dens11_EDI>=parseFloat(e[0])&& layer.feature.properties.Dens11_EDI <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPercDensidadeFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderPercDensidadeFreg11.noUiSlider;
    $(slidersGeral).append(sliderPercDensidadeFreg11);
}
///////////////////////////-------------------- FIM DENSIDADE, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


///////////////////////--------------------------- VARIAÇÕES FREGUESIAS

/////////////////////////////------- Variação DENSIDADE POR FREGUESIA -------------------////

var minVarDensidadeFreg = 999;
var maxVarDensidadeFreg = 0;

function CorVarDensidadeFreg(d) {
    return d === null ? '#808080':
        d >= 20  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9eaad7' :
                ''  ;
}

var legendaVarDensidadeFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da densidade de alojamentos, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -13.66 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVarDensidadeFreg(feature) {
    if(feature.properties.Var_Dens <= minVarDensidadeFreg){
        minVarDensidadeFreg = feature.properties.Var_Dens
    }
    if(feature.properties.Var_Dens > maxVarDensidadeFreg){
        maxVarDensidadeFreg = feature.properties.Var_Dens 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarDensidadeFreg(feature.properties.Var_Dens)};
    }


function apagarVarDensidadeFreg(e) {
    VarDensidadeFreg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarDensidadeFreg(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + feature.properties.Var_Dens.toFixed(2) + '%' + '</b>').openPopup()  
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarDensidadeFreg,
    });
}
var VarDensidadeFreg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVarDensidadeFreg,
    onEachFeature: onEachFeatureVarDensidadeFreg
});

let slideVarDensidadeFreg = function(){
    var sliderVarDensidadeFreg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarDensidadeFreg, {
        start: [minVarDensidadeFreg, maxVarDensidadeFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarDensidadeFreg,
            'max': maxVarDensidadeFreg
        },
        });
    inputNumberMin.setAttribute("value",minVarDensidadeFreg);
    inputNumberMax.setAttribute("value",maxVarDensidadeFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVarDensidadeFreg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarDensidadeFreg.noUiSlider.set([null, this.value]);
    });

    sliderVarDensidadeFreg.noUiSlider.on('update',function(e){
        VarDensidadeFreg.eachLayer(function(layer){
            if(layer.feature.properties.Var_Dens.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var_Dens.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarDensidadeFreg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderVarDensidadeFreg.noUiSlider;
    $(slidersGeral).append(sliderVarDensidadeFreg);
} 

///////////////////////////// Fim DENSIDADE POR FREGUESIA -------------- \\\\\



/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = PercDensidadeConc01;
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
    if (layer == PercDensidadeConc01 && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Densidade de alojamentos, em 2001, por concelho.' + '</strong>')
        legendaPercDensidadeConc();
        slidePercDensidadeConc01();
        naoDuplicar = 1;
    }
    if (layer == PercDensidadeConc01 && naoDuplicar == 1){
        $('#tituloMapa').html(' <strong>' + 'Densidade de alojamentos, em 2001, por concelho.' + '</strong>')
    }
    if (layer == PercDensidadeConc11 && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Densidade de alojamentos, em 2011, por concelho.' + '</strong>')
        legendaPercDensidadeConc();
        slidePercDensidadeConc11();
        naoDuplicar = 2;
    }
    if (layer == PercDensidadeFreg01 && naoDuplicar != 4){
        $('#tituloMapa').html(' <strong>' + 'Densidade de alojamentos, em 2001, por freguesia.' + '</strong>')
        legendaPercDensidadeFreg();
        slidePercDensidadeFreg01();
        naoDuplicar = 4;
    }
    if (layer == PercDensidadeFreg11 && naoDuplicar != 5){
        $('#tituloMapa').html(' <strong>' + 'Densidade de alojamentos, em 2011, por freguesia.' + '</strong>')
        legendaPercDensidadeFreg();
        slidePercDensidadeFreg11();
        naoDuplicar = 5;
    }
    if (layer == VarDensidadeConc && naoDuplicar != 3){
        legendaVarDensidadeConc();
        slideVarDensidadeConc();
        naoDuplicar = 3;
    }
    if (layer == VarDensidadeFreg && naoDuplicar != 6){
        legendaVarDensidadeFreg();
        slideVarDensidadeFreg();
        naoDuplicar = 6;
    }


    layer.addTo(map);
    layerAtiva = layer;  
}

function myFunction() {
    var ano = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#percentagem').hasClass('active4')){
            if (ano == "2001"){
                novaLayer(PercDensidadeConc01)
            }
            if (ano == "2011"){
                novaLayer(PercDensidadeConc11)
            }
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if (ano == "2001"){
                novaLayer(VarDensidadeConc)
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if ($('#percentagem').hasClass('active5')){
            if (ano == "2001"){
                novaLayer(PercDensidadeFreg01)
            }
            if (ano == "2011"){
                novaLayer(PercDensidadeFreg11)
            }
        }
        if ($('#taxaVariacao').hasClass('active5')){
            if (ano == "2001"){
                novaLayer(VarDensidadeFreg)
            }
        }
    }
}



let primeirovalor = function(ano){
    $("#mySelect").val(ano);
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let reporAnos = function(){
    if ($('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        $('select option:contains("2001")').text('2001');
        if ($("#mySelect option[value='2011']").length == 0){ 
            $('#mySelect')
            .append('<option value="2011">2011</option>')
        }
    }
    if ($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        $('select option:contains("2001")').text('2011 - 2001');
        $("#mySelect option[value='2011']").remove();
    }
    primeirovalor('2001');
}
let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Recenseamento da população e habitação.' );
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
$('#percentagem').click(function(){
    mudarEscala();
});
$('#taxaVariacao').click(function(){
    mudarEscala();
    fonteTitulo('F') ;

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
let variaveisMapaConcelho = function(){
    if ($('#percentagem').hasClass('active4')){
        return false
    }
    else{
        $('#percentagem').attr('class',"butao active4")
        $('#taxaVariacao').attr('class',"butao")
        mudarEscala();
    }

}

let variaveisMapaFreguesias = function(){
    if($('#percentagem').hasClass('active5')){
        return false;
    }
    else{
        $('#percentagem').attr('class',"butao active5")
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
    $('#encargoMensal').remove();
    $('#notaRodape').remove();
    $('#opcaoMapa').attr("class","btn");
    $('#opcaoTabela').attr("class","btn");

    $('#tabelaVariacao').attr("class","btn");
    $('#tabelaPercentagem').attr("class","btn");
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

    $('#percentagem').attr("class","butao active4");
    $('#taxaVariacao').attr("class","butao");

    $('#tabelaVariacao').attr("class","btn");
    $('#tabelaPercentagem').attr("class","btn");
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
    $('#tabelaPercentagem').attr("class","btn active1");
    DadosAbsolutos();
    $('#opcaoMapa').attr("class","btn");
    $('#tabela').css("visibility","visible");
    $('#opcoesTabela').css("visibility","visible")
    $('#opcoesTabela').css("padding-top","10px")
    $('#tituloMapa').css("visibility","visible");
    $('.ine').css("visibility","visible");
    $('#opcaoFonte').css("visibility","visible");

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
$('#tabelaPercentagem').click(function(){
    DadosAbsolutos();;   
});

function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
var DadosAbsolutos = function(){
    $('#tituloMapa').html('Densidade de alojamentos, entre 2001 e 2011, %.')
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/DensidadeAlojamentosProv.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $('#2001').html("2001")
        $.each(data, function(key, value){
            dados += '<tr>';
            if(containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                dados += '<td class="borderbottom bordertop">'+value.Densidade+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2001+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2011+'</td>';
            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                dados += '<td>'+value.Densidade+'</td>';
                dados += '<td>'+value.DADOS2001+'</td>';
                dados += '<td>'+value.DADOS2011+'</td>';
                dados += '<tr>';
            }
            dados += '<tr>';
        })
    $('#juntarValores').append(dados);   
    });
})}


$('#tabelaVariacao').click(function(){  
    $('#tituloMapa').html('Variação da densidade alojamentos, entre 2001 e 2011, %.')
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/DensidadeAlojamentosProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2001').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom">'+value.Densidade+'</td>';
                    dados += '<td class="borderbottom">'+ ''+'</td>';
                    dados += '<td class="borderbottom">'+value.VAR1101+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Densidade+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.VAR1101+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

let anosSelecionados = function() {
    let anos = document.getElementById("mySelect").value;

    if ($('#concelho').hasClass("active2") || $('#freguesias').hasClass("active2")){
            if (anos != "2011"){
                i = 1 ;
            }
            if (anos == "2001"){
                i = 0 ;
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
