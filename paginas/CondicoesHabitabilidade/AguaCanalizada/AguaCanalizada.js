
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
    div.innerHTML = '<img src="../../../imagens/norte.png" alt="Orientação" height="40px" width="23px">';
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

/////////////////////------- Alojamentos sem água canalizada por Concelho em 1991-----////////////////////////

var minAguaCanalizadaConc91 = 0;
var maxAguaCanalizadaConc91 = 0;

function CorPerCanalizadaConc(d) {
    return d >= 23.28 ? '#bf0404 ' :
        d >= 19.44  ? '#c71d1c' :
        d >= 13.04 ? '#d44846' :
        d >= 6.63   ? '#e06f6c' :
        d >= 0.23   ? '#f1aaa6 ' :
                ''  ;
}
var legendaPerCanalizadaConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#bf0404 "></i>' + ' > 23.28' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#c71d1c"></i>' + ' 19.44 - 23.28' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d44846"></i>' + ' 13.04 - 19.44' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#e06f6c"></i>' + ' 6.63 - 13.04' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6 "></i>' + ' 0.23 - 6.63' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloAguaCanalizadaConc91(feature) {
    if( feature.properties.AgCan91 <= minAguaCanalizadaConc91 || minAguaCanalizadaConc91 === 0){
        minAguaCanalizadaConc91 = feature.properties.AgCan91
    }
    if(feature.properties.AgCan91 >= maxAguaCanalizadaConc91 ){
        maxAguaCanalizadaConc91 = feature.properties.AgCan91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCanalizadaConc(feature.properties.AgCan91)
    };
}
function apagarAguaCanalizadaConc91(e) {
    AguaCanalizadaConc91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAguaCanalizadaConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Alojamentos sem água canalizada: ' + '<b>' + feature.properties.AgCan91.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAguaCanalizadaConc91,
    });
}
var AguaCanalizadaConc91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloAguaCanalizadaConc91,
    onEachFeature: onEachFeatureAguaCanalizadaConc91
});
let slideAguaCanalizadaConc91 = function(){
    var sliderAguaCanalizadaConc91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAguaCanalizadaConc91, {
        start: [minAguaCanalizadaConc91, maxAguaCanalizadaConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minAguaCanalizadaConc91,
            'max': maxAguaCanalizadaConc91
        },
        });
    inputNumberMin.setAttribute("value",minAguaCanalizadaConc91);
    inputNumberMax.setAttribute("value",maxAguaCanalizadaConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderAguaCanalizadaConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAguaCanalizadaConc91.noUiSlider.set([null, this.value]);
    });

    sliderAguaCanalizadaConc91.noUiSlider.on('update',function(e){
        AguaCanalizadaConc91.eachLayer(function(layer){
            if(layer.feature.properties.AgCan91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.AgCan91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAguaCanalizadaConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderAguaCanalizadaConc91.noUiSlider;
    $(slidersGeral).append(sliderAguaCanalizadaConc91);
} 
AguaCanalizadaConc91.addTo(map);
legendaPerCanalizadaConc();
$('#tituloMapa').css('font-size','9pt')
$('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem existência de água canalizada, em 1991, por concelho.' + '</strong>');
slideAguaCanalizadaConc91();
/////////////////////////////////// ---------Fim de Alojamentos sem água canalizada EM 1991 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

/////////////////////--------------------------- Alojamentos sem água canalizada EM 2001 POR CONCELHO-----////////////////////////

var minAguaCanalizadaConc01 = 0;
var maxAguaCanalizadaConc01 = 0;

function EstiloAguaCanalizadaConc01(feature) {
    if( feature.properties.AgCan01 <= minAguaCanalizadaConc01 || minAguaCanalizadaConc01 === 0){
        minAguaCanalizadaConc01 = feature.properties.AgCan01
    }
    if(feature.properties.AgCan01 >= maxAguaCanalizadaConc01 ){
        maxAguaCanalizadaConc01 = feature.properties.AgCan01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCanalizadaConc(feature.properties.AgCan01)
    };
}
function apagarAguaCanalizadaConc01(e) {
    AguaCanalizadaConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAguaCanalizadaConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem água canalizada: ' + '<b>' + feature.properties.AgCan01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAguaCanalizadaConc01,
    });
}
var AguaCanalizadaConc01= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloAguaCanalizadaConc01,
    onEachFeature: onEachFeatureAguaCanalizadaConc01
});
let slideAguaCanalizadaConc01 = function(){
    var sliderAguaCanalizadaConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAguaCanalizadaConc01, {
        start: [minAguaCanalizadaConc01, maxAguaCanalizadaConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAguaCanalizadaConc01,
            'max': maxAguaCanalizadaConc01
        },
        });
    inputNumberMin.setAttribute("value",minAguaCanalizadaConc01);
    inputNumberMax.setAttribute("value",maxAguaCanalizadaConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderAguaCanalizadaConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAguaCanalizadaConc01.noUiSlider.set([null, this.value]);
    });

    sliderAguaCanalizadaConc01.noUiSlider.on('update',function(e){
        AguaCanalizadaConc01.eachLayer(function(layer){
            if(layer.feature.properties.AgCan01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.AgCan01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAguaCanalizadaConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderAguaCanalizadaConc01.noUiSlider;
    $(slidersGeral).append(sliderAguaCanalizadaConc01);
}


/////////////////////////////////// Fim Alojamentos sem água canalizada EM 2001 POR CONCELHO -------------- \\\\\\

/////////////////////------------------- Alojamentos sem água canalizada EM 2011 POR CONCELHO-----//\\\\\\\\//////////////////////

var minAguaCanalizadaConc11 = 0;
var maxAguaCanalizadaConc11 = 0;

function EstiloAguaCanalizadaConc11(feature) {
    if( feature.properties.AgCan11 <= minAguaCanalizadaConc11 || minAguaCanalizadaConc11 === 0){
        minAguaCanalizadaConc11 = feature.properties.AgCan11
    }
    if(feature.properties.AgCan11 >= maxAguaCanalizadaConc11 ){
        maxAguaCanalizadaConc11 = feature.properties.AgCan11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCanalizadaConc(feature.properties.AgCan11)
    };
}
function apagarAguaCanalizadaConc11(e) {
    AguaCanalizadaConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAguaCanalizadaConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem água canalizada: ' + '<b>' + feature.properties.AgCan11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAguaCanalizadaConc11,
    });
}
var AguaCanalizadaConc11= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloAguaCanalizadaConc11,
    onEachFeature: onEachFeatureAguaCanalizadaConc11
});
let slideAguaCanalizadaConc11 = function(){
    var sliderAguaCanalizadaConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAguaCanalizadaConc11, {
        start: [minAguaCanalizadaConc11, maxAguaCanalizadaConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAguaCanalizadaConc11,
            'max': maxAguaCanalizadaConc11
        },
        });
    inputNumberMin.setAttribute("value",minAguaCanalizadaConc11);
    inputNumberMax.setAttribute("value",maxAguaCanalizadaConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderAguaCanalizadaConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAguaCanalizadaConc11.noUiSlider.set([null, this.value]);
    });

    sliderAguaCanalizadaConc11.noUiSlider.on('update',function(e){
        AguaCanalizadaConc11.eachLayer(function(layer){
            if(layer.feature.properties.AgCan11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.AgCan11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAguaCanalizadaConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderAguaCanalizadaConc11.noUiSlider;
    $(slidersGeral).append(sliderAguaCanalizadaConc11);
} 

/////////////////////////////////// Fim Alojamentos sem água canalizada 2011 Concelho -------------- \\\\\\


/////////////////////////---------------------- DADOS RELATIVOS, FREGUESIAS -------------------\\\\\\\\\\\\\\\\\\


/////////////////////------------------- Alojamentos sem água canalizada EM 2001 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minAguaCanalizadaFreg01 = 0;
var maxAguaCanalizadaFreg01 = 0;

function CorPerCanalizadaFreg(d) {
    return d == 0.00 ? '#000000 ' :
        d >= 26.67 ? '#bf0404 ' :
        d >= 20.02  ? '#c71d1c' :
        d >= 13.37 ? '#d44846' :
        d >= 6.72   ? '#e06f6c' :
        d >= 0.07   ? '#f1aaa6 ' :
                ''  ;
}
var legendaPerCanalizadaFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#bf0404 "></i>' + ' > 26.67' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#c71d1c"></i>' + ' 20.02 - 26.67' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d44846"></i>' + ' 13.37 - 20.02' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#e06f6c"></i>' + ' 6.72 - 13.37' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6 "></i>' + ' 0.07 - 6.72' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000 "></i>' + ' 0' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloAguaCanalizadaFreg01(feature) {
    if( feature.properties.AgCan01 <= minAguaCanalizadaFreg01 || minAguaCanalizadaFreg01 === 0){
        minAguaCanalizadaFreg01 = feature.properties.AgCan01
    }
    if(feature.properties.AgCan01 >= maxAguaCanalizadaFreg01 ){
        maxAguaCanalizadaFreg01 = feature.properties.AgCan01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCanalizadaFreg(feature.properties.AgCan01)
    };
}
function apagarAguaCanalizadaFreg01(e) {
    AguaCanalizadaFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAguaCanalizadaFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos sem água canalizada: ' + '<b>' + feature.properties.AgCan01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAguaCanalizadaFreg01,
    });
}
var AguaCanalizadaFreg01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloAguaCanalizadaFreg01,
    onEachFeature: onEachFeatureAguaCanalizadaFreg01
});
let slideAguaCanalizadaFreg01 = function(){
    var sliderAguaCanalizadaFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAguaCanalizadaFreg01, {
        start: [minAguaCanalizadaFreg01, maxAguaCanalizadaFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minAguaCanalizadaFreg01,
            'max': maxAguaCanalizadaFreg01
        },
        });
    inputNumberMin.setAttribute("value",minAguaCanalizadaFreg01);
    inputNumberMax.setAttribute("value",maxAguaCanalizadaFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderAguaCanalizadaFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAguaCanalizadaFreg01.noUiSlider.set([null, this.value]);
    });

    sliderAguaCanalizadaFreg01.noUiSlider.on('update',function(e){
        AguaCanalizadaFreg01.eachLayer(function(layer){
            if(layer.feature.properties.AgCan01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.AgCan01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAguaCanalizadaFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderAguaCanalizadaFreg01.noUiSlider;
    $(slidersGeral).append(sliderAguaCanalizadaFreg01);
} 

 
//////////////////////--------- Fim Alojamentos sem água canalizada POR FREGUESIAS EM 2001 -------------- \\\\\\

/////////////////////-------------------Alojamentos sem água canalizada EM 2011 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minAguaCanalizadaFreg11 = 99;
var maxAguaCanalizadaFreg11 = 0;

function EstiloAguaCanalizadaFreg11(feature) {
    if( feature.properties.AgCan11 <= minAguaCanalizadaFreg11 || feature.properties.AgCan11 === 0){
        minAguaCanalizadaFreg11 = feature.properties.AgCan11
    }
    if(feature.properties.AgCan11 >= maxAguaCanalizadaFreg11 ){
        maxAguaCanalizadaFreg11 = feature.properties.AgCan11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCanalizadaFreg(feature.properties.AgCan11)
    };
}
function apagarAguaCanalizadaFreg11(e) {
    AguaCanalizadaFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureAguaCanalizadaFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos sem água canalizada: ' + '<b>' + feature.properties.AgCan11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarAguaCanalizadaFreg11,
    });
}
var AguaCanalizadaFreg11= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloAguaCanalizadaFreg11,
    onEachFeature: onEachFeatureAguaCanalizadaFreg11
});
let slideAguaCanalizadaFreg11 = function(){
    var sliderAguaCanalizadaFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderAguaCanalizadaFreg11, {
        start: [minAguaCanalizadaFreg11, maxAguaCanalizadaFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minAguaCanalizadaFreg11,
            'max': maxAguaCanalizadaFreg11
        },
        });
    inputNumberMin.setAttribute("value",minAguaCanalizadaFreg11);
    inputNumberMax.setAttribute("value",maxAguaCanalizadaFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderAguaCanalizadaFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderAguaCanalizadaFreg11.noUiSlider.set([null, this.value]);
    });

    sliderAguaCanalizadaFreg11.noUiSlider.on('update',function(e){
        AguaCanalizadaFreg11.eachLayer(function(layer){
            if(layer.feature.properties.AgCan11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.AgCan11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderAguaCanalizadaFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderAguaCanalizadaFreg11.noUiSlider;
    $(slidersGeral).append(sliderAguaCanalizadaFreg11);
} 

 
//////////////////////--------- Fim Alojamentos sem água canalizada POR FREGUESIAS EM 2011 -------------- \\\\\\

///////////////////////////--------------------------- VARIAÇÕES CONCELHOS ------------\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação Alojamentos sem água canalizada POR  CONCELHOS ENTRE 2001 E 1991 -------------------////

var minVarAguaCanalizadaConc01_91 = 0;
var maxVarAguaCanalizadaConc01_91 = -99;

function CorVarCanalizada01_91Conc(d) {
    return d == null ? '#000000' :
        d >= -70  ? '#a7da81 ' :
        d >= -80 ? '#82c065' :
        d >= -90   ? '#60a74b' :
        d >= -92.14   ? '#459436' :
                ''  ;
}
var legendaVarCanalizada01_91Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos familiares de residência habitual sem água canalizada, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#a7da81 "></i>' + '  > -70' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -80 a -70' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -90 a -80' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#459436"></i>' + ' -92.13 a -90' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAguaCanalizadaConc01_91(feature) {
    if(feature.properties.Var01_91 <= minVarAguaCanalizadaConc01_91){
        minVarAguaCanalizadaConc01_91 = feature.properties.Var01_91
    }
    if(feature.properties.Var01_91 > maxVarAguaCanalizadaConc01_91 && feature.properties.Var01_91 != null){
        maxVarAguaCanalizadaConc01_91 = feature.properties.Var01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarCanalizada01_91Conc(feature.properties.Var01_91)};
    }


function apagarVarAguaCanalizadaConc01_91(e) {
    VarAguaCanalizadaConc01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAguaCanalizadaConc01_91(feature, layer) {
    if(feature.properties.Var01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var01_91.toFixed(2) + '</b>' + '%').openPopup()
    }    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAguaCanalizadaConc01_91,
    });
}
var VarAguaCanalizadaConc01_91= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloVarAguaCanalizadaConc01_91,
    onEachFeature: onEachFeatureVarAguaCanalizadaConc01_91
});

let slideVarAguaCanalizadaConc01_91 = function(){
    var sliderVarAguaCanalizadaConc01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAguaCanalizadaConc01_91, {
        start: [minVarAguaCanalizadaConc01_91, maxVarAguaCanalizadaConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAguaCanalizadaConc01_91,
            'max': maxVarAguaCanalizadaConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarAguaCanalizadaConc01_91);
    inputNumberMax.setAttribute("value",maxVarAguaCanalizadaConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAguaCanalizadaConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAguaCanalizadaConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarAguaCanalizadaConc01_91.noUiSlider.on('update',function(e){
        VarAguaCanalizadaConc01_91.eachLayer(function(layer){
            if(layer.feature.properties.Var01_91 == null){
                return false
            }
            if(layer.feature.properties.Var01_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var01_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAguaCanalizadaConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderVarAguaCanalizadaConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVarAguaCanalizadaConc01_91);
} 

///////////////////////////// Fim da Variação Alojamentos sem água canalizada POR  CONCELHOS ENTRE 2001 E 1991 -------------- \\\\\

/////////////////////////////------- Variação Alojamentos sem água canalizada POR  CONCELHOS ENTRE 2011 E 2001 -------------------////

var minVarAguaCanalizadaConc11_01 = 0;
var maxVarAguaCanalizadaConc11_01 = -99;

function CorVarCanalizada11_01Conc(d) {
    return d == null ? '#000000' :
        d >= -40  ? '#a7da81 ' :
        d >= -50 ? '#82c065' :
        d >= -60   ? '#60a74b' :
        d >= -73.44   ? '#459436' :
                ''  ;
}
var legendaVarCanalizada11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos familiares de residência habitual sem água canalizada, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#a7da81 "></i>' + '  > -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -50 a -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -60 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#459436"></i>' + ' -73.43 a -60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAguaCanalizadaConc11_01(feature) {
    if(feature.properties.Var11_01 <= minVarAguaCanalizadaConc11_01){
        minVarAguaCanalizadaConc11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarAguaCanalizadaConc11_01 && feature.properties.Var11_01 != null){
        maxVarAguaCanalizadaConc11_01 = feature.properties.Var11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarCanalizada11_01Conc(feature.properties.Var11_01)};
    }


function apagarVarAguaCanalizadaConc11_01(e) {
    VarAguaCanalizadaConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAguaCanalizadaConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAguaCanalizadaConc11_01,
    });
}
var VarAguaCanalizadaConc11_01= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloVarAguaCanalizadaConc11_01,
    onEachFeature: onEachFeatureVarAguaCanalizadaConc11_01
});

let slideVarAguaCanalizadaConc11_01 = function(){
    var sliderVarAguaCanalizadaConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAguaCanalizadaConc11_01, {
        start: [minVarAguaCanalizadaConc11_01, maxVarAguaCanalizadaConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAguaCanalizadaConc11_01,
            'max': maxVarAguaCanalizadaConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarAguaCanalizadaConc11_01);
    inputNumberMax.setAttribute("value",maxVarAguaCanalizadaConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAguaCanalizadaConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAguaCanalizadaConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarAguaCanalizadaConc11_01.noUiSlider.on('update',function(e){
        VarAguaCanalizadaConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAguaCanalizadaConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderVarAguaCanalizadaConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarAguaCanalizadaConc11_01);
} 

///////////////////////////// Fim da Variação Alojamentos sem água canalizada POR  CONCELHOS ENTRE 2011 E 2001 -------------- \\\\\
/////////////////////////////-------------------- FIM VARIAÇÃO CONCELHOS------------------\\\\\\\\\\\\\\\\\
////////////////////////////------------------- VARIAÇÃO FREGUESIAS ---------------------\\\\\\\\\\\\\\



/////////////////////////////------- Variação Alojamentos sem água canalizada POR  FREGUESIAS ENTRE 2011 E 2001 -------------------////

var minVarAguaCanalizadaFreg11_01 = 0;
var maxVarAguaCanalizadaFreg11_01 = 0;

function CorVarCanalizada11_01Freg(d) {
    return d == null ? '#000000' :
        d >=  0  ? '#f1aaa6  ' :
        d >= -25  ? '#a7da81 ' :
        d >= -50 ? '#82c065' :
        d >= -75   ? '#60a74b' :
        d >= -100.01   ? '#459436' :
                ''  ;
}
var legendaVarCanalizada11_01Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos familiares de residência habitual sem água canalizada, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6 "></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a7da81"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -75 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#459436"></i>' + ' -100 a -75' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloVarAguaCanalizadaFreg11_01(feature) {
    if(feature.properties.Var11_01 <= minVarAguaCanalizadaFreg11_01 || minVarAguaCanalizadaFreg11_01 ===0){
        minVarAguaCanalizadaFreg11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarAguaCanalizadaFreg11_01){
        maxVarAguaCanalizadaFreg11_01 = feature.properties.Var11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarCanalizada11_01Freg(feature.properties.Var11_01)};
    }


function apagarVarAguaCanalizadaFreg11_01(e) {
    VarAguaCanalizadaFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarAguaCanalizadaFreg11_01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarAguaCanalizadaFreg11_01,
    });
}
var VarAguaCanalizadaFreg11_01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloVarAguaCanalizadaFreg11_01,
    onEachFeature: onEachFeatureVarAguaCanalizadaFreg11_01
});

let slideVarAguaCanalizadaFreg11_01 = function(){
    var sliderVarAguaCanalizadaFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarAguaCanalizadaFreg11_01, {
        start: [minVarAguaCanalizadaFreg11_01, maxVarAguaCanalizadaFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarAguaCanalizadaFreg11_01,
            'max': maxVarAguaCanalizadaFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarAguaCanalizadaFreg11_01);
    inputNumberMax.setAttribute("value",maxVarAguaCanalizadaFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarAguaCanalizadaFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarAguaCanalizadaFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarAguaCanalizadaFreg11_01.noUiSlider.on('update',function(e){
        VarAguaCanalizadaFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarAguaCanalizadaFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderVarAguaCanalizadaFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarAguaCanalizadaFreg11_01);
} 

///////////////////////////// Fim da Variação Alojamentos sem água canalizada POR  FREGUESIAS ENTRE 2011 E 2001 -------------- \\\\\


var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'Calculos próprios; INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = AguaCanalizadaConc91;
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
    if (layer == AguaCanalizadaConc91 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem existência de água canalizada, em 1991, por concelho.' + '</strong>');
        legendaPerCanalizadaConc();
        slideAguaCanalizadaConc91();
        naoDuplicar = 1;
    }
    if (layer == AguaCanalizadaConc91 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem existência de água canalizada, em 1991, por concelho.' + '</strong>');
    }
    if (layer == AguaCanalizadaConc01 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem existência de água canalizada, em 2001, por concelho.' + '</strong>');
        legendaPerCanalizadaConc();
        slideAguaCanalizadaConc01();
        naoDuplicar = 2;
    }
    if (layer == AguaCanalizadaConc11 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem existência de água canalizada, em 2011, por concelho.' + '</strong>');
        legendaPerCanalizadaConc();
        slideAguaCanalizadaConc11();
        naoDuplicar = 3;
    }
    if (layer == AguaCanalizadaFreg01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem existência de água canalizada, em 2001, por freguesia.' + '</strong>');
        legendaPerCanalizadaFreg();
        slideAguaCanalizadaFreg01();
        naoDuplicar = 5;
    }
    if (layer == AguaCanalizadaFreg11 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem existência de água canalizada, em 2011, por freguesia.' + '</strong>');
        legendaPerCanalizadaFreg();
        slideAguaCanalizadaFreg11();
        naoDuplicar = 6;
    }
    if (layer == VarAguaCanalizadaConc01_91 && naoDuplicar != 7){
        legendaVarCanalizada01_91Conc();
        slideVarAguaCanalizadaConc01_91();
        naoDuplicar = 7;
    }
    if (layer == VarAguaCanalizadaConc11_01 && naoDuplicar != 8){
        legendaVarCanalizada11_01Conc();
        slideVarAguaCanalizadaConc11_01();
        naoDuplicar = 8;
    }
    if (layer == VarAguaCanalizadaFreg11_01 && naoDuplicar != 10){
        legendaVarCanalizada11_01Freg();
        slideVarAguaCanalizadaFreg11_01();
        naoDuplicar = 10;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}
function myFunction() {
    var anoSelecionado = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#percentagem').hasClass('active4')){
            if (anoSelecionado == "1991"){
                novaLayer(AguaCanalizadaConc91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(AguaCanalizadaConc01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(AguaCanalizadaConc11);
            };
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if(anoSelecionado == "2001"){
                novaLayer(VarAguaCanalizadaConc01_91)
            }
            if(anoSelecionado == "2011"){
                novaLayer(VarAguaCanalizadaConc11_01)
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#percentagem').hasClass('active5')){
            if (anoSelecionado == "2001"){
                novaLayer(AguaCanalizadaFreg01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(AguaCanalizadaFreg11);
            };
        }
        if ($('#taxaVariacao').hasClass('active5')){
            if(anoSelecionado == "2011"){
                novaLayer(VarAguaCanalizadaFreg11_01)
            }
        }
    }
}


let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Recenseamento da população e habitação.' );
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Recenseamento da população e habitação.' );
    }
}
$('#mySelect').change(function(){
    myFunction();
})
$('#opcaoSelect').change(function(){
    myFunction();
})
let primeirovalor = function(ano){
    $("#mySelect").val(ano);
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let reporAnos = function(){
    $('#mySelect').empty();
    if($('#concelho').hasClass('active2')){
        if($('#percentagem').hasClass('active4')){
            var ano = 1991;
            while (ano <= 2011){
                $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '</option>');
                ano += 10;
            }
            primeirovalor('1991');
        }
        if($('#taxaVariacao').hasClass('active4')){
            $('#mySelect').append("<option value='2001'>2001 - 1991</option>");
            $('#mySelect').append("<option value='2011'>2011 - 2001</option>");
            primeirovalor('2001');
        }
    }
    if($('#freguesias').hasClass('active2')){
        if($('#percentagem').hasClass('active5')){
            $('#mySelect').empty();
            var ano = 2001;
            while (ano <= 2011){
                $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '</option>');
                ano += 10;
            }
            primeirovalor('2001');
        }
        if($('#taxaVariacao').hasClass('active5')){
            $('#mySelect').empty();
            $('#mySelect').append("<option value='2011'>2011 - 2001</option>");
            primeirovalor('2011');
        }
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
    fonteTitulo('F');
});
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
        $('#percentagem').attr('class',"butao active4");
        $('#taxaVariacao').attr('class',"butao");
        mudarEscala();
    }
}

let variaveisMapaFreguesias = function(){
    if($('#absoluto').hasClass('active5')){
        return false;
    }
    else{
        $('#percentagem').attr('class',"butao active5");
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

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais active2")
    $('#freguesias').attr("class", "butaoEscala EscalasTerritoriais")
    $('#percentagem').attr("class","butao active4");
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
    $('#tabelaPercentagem').attr("class","btn active1");
    DadosAbsolutos();
    $('#opcaoMapa').attr("class","btn");
    $('#tabela').css("visibility","visible");
    $('#opcoesTabela').css("visibility","visible")
    $('#opcoesTabela').css("padding-top","10px")
    $('#tituloMapa').css("visibility","visible");
    $('.ine').css("visibility","visible");

    $('#absoluto').attr("class","butao");
    $('#percentagem').attr("class","butao");
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

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais");
    $('#freguesias').attr('class',"butaoEscala EscalasTerritoriais");
    $('.btn').css("top","10%");

});
$('#tabelaPercentagem').click(function(){
    DadosAbsolutos();   
});

function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
var DadosAbsolutos = function(){
    $('#tituloMapa').html('Proporção de alojamentos familiares de residência habitual sem existência de água canalizada, entre 1991 e 2011, %.');
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/AguaCanalizadaProv.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $('#1991').html("1991")
        $.each(data, function(key, value){
            dados += '<tr>';
            if(containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                dados += '<td class="borderbottom bordertop">'+value.Agua+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS1991+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2001+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2011+'</td>';
            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                dados += '<td>'+value.Agua+'</td>';
                dados += '<td>'+value.DADOS1991+'</td>';
                dados += '<td>'+value.DADOS2001+'</td>';
                dados += '<td>'+value.DADOS2011+'</td>';
                dados += '<tr>';
            }
            dados += '<tr>';
        })
    $('#juntarValores').append(dados);   
    });
})};

$('#tabelaVariacao').click(function(){  
    $('#tituloMapa').html('Variação da proporção de alojamentos familiares de residência habitual sem existência de água canalizada, entre 1991 e 2011, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/AguaCanalizadaProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+value.Agua+'</td>';
                    dados += '<td class="borderbottom bordertop">'+ ''+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR0191+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR1101+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Agua+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.VAR0191+'</td>';
                    dados += '<td>'+value.VAR1101+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});


let anosSelecionados = function() {
    let anoSelecionado = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2")){
        if (anoSelecionado != "2011"){
            i = 1
        }
        if (anoSelecionado == "2001"){
            i = 0;
        }
    }
    if ($('#concelho').hasClass("active2")){
        if (anoSelecionado != "2011"){
            i = 1
        }
        if (anoSelecionado == "1991"){
            i = 0;
        }
    }
    if ($('#taxaVariacao').hasClass('active4')){
        if (anoSelecionado != "2011"){
            i = 1 ;
        }
        if (anoSelecionado == "2001"){
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
