// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('#tituloMapa').css('font-size','9pt')
$('.titulo').css("width","100%");
$('#temporal').css("display","inline-block");
$('.ine').html('<strong>Fonte: </strong>INE, Estatisticas de preços da habitação ao nível local.');
$('select').css('background-color',"#b1b1b140")
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

/////////////////////------- Dados 1 TRIMESTRE 2016 por Concelho -----////////////////////////

var minPreco1Trimestre16Conc = 0;
var maxPreco1Trimestre16Conc = 0;

function CorPerPrecosVendasConc(d) {
    return d == null ? '#808080' :
        d >= 2101 ? '#8c0303' :
        d >= 1836  ? '#de1f35' :
        d >= 1394 ? '#ff5e6e' :
        d >= 952   ? '#f5b3be' :
        d >= 511   ? '#F2C572' :
                ''  ;
}
var legendaPerPrecosVendasConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: €/m²' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 2101' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 1836 a 2101' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 1394 a 1836' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 952 a 1394' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 511 a 952' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
function EstiloPreco1Trimestre16Conc(feature) {
    if( feature.properties.F1Trim16 <= minPreco1Trimestre16Conc || minPreco1Trimestre16Conc === 0){
        minPreco1Trimestre16Conc = feature.properties.F1Trim16
    }
    if(feature.properties.F1Trim16 >= maxPreco1Trimestre16Conc ){
        maxPreco1Trimestre16Conc = feature.properties.F1Trim16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F1Trim16)
    };
}
function apagarPreco1Trimestre16Conc(e) {
    Preco1Trimestre16Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1Trimestre16Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim16.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1Trimestre16Conc,
    });
}
var Preco1Trimestre16Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco1Trimestre16Conc,
    onEachFeature: onEachFeaturePreco1Trimestre16Conc
});
let slidePreco1Trimestre16Conc = function(){
    var sliderPreco1Trimestre16Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1Trimestre16Conc, {
        start: [minPreco1Trimestre16Conc, maxPreco1Trimestre16Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1Trimestre16Conc,
            'max': maxPreco1Trimestre16Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1Trimestre16Conc);
    inputNumberMax.setAttribute("value",maxPreco1Trimestre16Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1Trimestre16Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1Trimestre16Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco1Trimestre16Conc.noUiSlider.on('update',function(e){
        Preco1Trimestre16Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim16.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim16.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1Trimestre16Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderPreco1Trimestre16Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco1Trimestre16Conc);
} 
Preco1Trimestre16Conc.addTo(map);
$('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2021, por concelho' + '</strong>');
legendaPerPrecosVendasConc();
slidePreco1Trimestre16Conc();
/////////////////////////////////// ---------Fim de Dados PREÇOS 1 TRIMESTRE 2016 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

/////////////////////--------------------------- Dados PREÇOS 2 TRIMESTRE 2016 POR CONCELHO-----////////////////////////

var minPreco2Trimestre16Conc = 0;
var maxPreco2Trimestre16Conc = 0;

function EstiloPreco2Trimestre16Conc(feature) {
    if( feature.properties.F2Trim16 <= minPreco2Trimestre16Conc || minPreco2Trimestre16Conc === 0){
        minPreco2Trimestre16Conc = feature.properties.F2Trim16
    }
    if(feature.properties.F2Trim16 >= maxPreco2Trimestre16Conc ){
        maxPreco2Trimestre16Conc = feature.properties.F2Trim16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F2Trim16)
    };
}
function apagarPreco2Trimestre16Conc(e) {
    Preco2Trimestre16Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2Trimestre16Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim16.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2Trimestre16Conc,
    });
}
var Preco2Trimestre16Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco2Trimestre16Conc,
    onEachFeature: onEachFeaturePreco2Trimestre16Conc
});
let slidePreco2Trimestre16Conc = function(){
    var sliderPreco2Trimestre16Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2Trimestre16Conc, {
        start: [minPreco2Trimestre16Conc, maxPreco2Trimestre16Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2Trimestre16Conc,
            'max': maxPreco2Trimestre16Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2Trimestre16Conc);
    inputNumberMax.setAttribute("value",maxPreco2Trimestre16Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2Trimestre16Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2Trimestre16Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco2Trimestre16Conc.noUiSlider.on('update',function(e){
        Preco2Trimestre16Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim16.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim16.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2Trimestre16Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderPreco2Trimestre16Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco2Trimestre16Conc);
}


/////////////////////////////////// Fim Dados PREÇOS 2 TRIMESTRE 2018 POR CONCELHO -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 3 Trimestre 2016 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco3Trimestre16Conc = 0;
var maxPreco3Trimestre16Conc = 0;

function EstiloPreco3Trimestre16Conc(feature) {
    if( feature.properties.F3Trim16 <= minPreco3Trimestre16Conc || minPreco3Trimestre16Conc === 0){
        minPreco3Trimestre16Conc = feature.properties.F3Trim16
    }
    if(feature.properties.F3Trim16 >= maxPreco3Trimestre16Conc ){
        maxPreco3Trimestre16Conc = feature.properties.F3Trim16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F3Trim16)
    };
}
function apagarPreco3Trimestre16Conc(e) {
    Preco3Trimestre16Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3Trimestre16Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim16.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3Trimestre16Conc,
    });
}
var Preco3Trimestre16Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco3Trimestre16Conc,
    onEachFeature: onEachFeaturePreco3Trimestre16Conc
});
let slidePreco3Trimestre16Conc = function(){
    var sliderPreco3Trimestre16Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3Trimestre16Conc, {
        start: [minPreco3Trimestre16Conc, maxPreco3Trimestre16Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3Trimestre16Conc,
            'max': maxPreco3Trimestre16Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3Trimestre16Conc);
    inputNumberMax.setAttribute("value",maxPreco3Trimestre16Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3Trimestre16Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3Trimestre16Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco3Trimestre16Conc.noUiSlider.on('update',function(e){
        Preco3Trimestre16Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim16.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim16.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3Trimestre16Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderPreco3Trimestre16Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco3Trimestre16Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 3 Trimestre 2016 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 4 Trimestre 2016 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco4Trimestre16Conc = 0;
var maxPreco4Trimestre16Conc = 0;

function EstiloPreco4Trimestre16Conc(feature) {
    if( feature.properties.F4Trim16 <= minPreco4Trimestre16Conc || minPreco4Trimestre16Conc === 0){
        minPreco4Trimestre16Conc = feature.properties.F4Trim16
    }
    if(feature.properties.F4Trim16 >= maxPreco4Trimestre16Conc ){
        maxPreco4Trimestre16Conc = feature.properties.F4Trim16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F4Trim16)
    };
}
function apagarPreco4Trimestre16Conc(e) {
    Preco4Trimestre16Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4Trimestre16Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim16.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4Trimestre16Conc,
    });
}
var Preco4Trimestre16Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco4Trimestre16Conc,
    onEachFeature: onEachFeaturePreco4Trimestre16Conc
});
let slidePreco4Trimestre16Conc = function(){
    var sliderPreco4Trimestre16Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4Trimestre16Conc, {
        start: [minPreco4Trimestre16Conc, maxPreco4Trimestre16Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4Trimestre16Conc,
            'max': maxPreco4Trimestre16Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4Trimestre16Conc);
    inputNumberMax.setAttribute("value",maxPreco4Trimestre16Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4Trimestre16Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4Trimestre16Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco4Trimestre16Conc.noUiSlider.on('update',function(e){
        Preco4Trimestre16Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim16.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim16.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4Trimestre16Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderPreco4Trimestre16Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco4Trimestre16Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 4 Trimestre 2016 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 1 Trimestre 2017 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco1Trimestre17Conc = 0;
var maxPreco1Trimestre17Conc = 0;

function EstiloPreco1Trimestre17Conc(feature) {
    if( feature.properties.F1Trim17 <= minPreco1Trimestre17Conc || minPreco1Trimestre17Conc === 0){
        minPreco1Trimestre17Conc = feature.properties.F1Trim17
    }
    if(feature.properties.F1Trim17 >= maxPreco1Trimestre17Conc ){
        maxPreco1Trimestre17Conc = feature.properties.F1Trim17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F1Trim17)
    };
}
function apagarPreco1Trimestre17Conc(e) {
    Preco1Trimestre17Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1Trimestre17Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim17.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1Trimestre17Conc,
    });
}
var Preco1Trimestre17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco1Trimestre17Conc,
    onEachFeature: onEachFeaturePreco1Trimestre17Conc
});
let slidePreco1Trimestre17Conc = function(){
    var sliderPreco1Trimestre17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1Trimestre17Conc, {
        start: [minPreco1Trimestre17Conc, maxPreco1Trimestre17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1Trimestre17Conc,
            'max': maxPreco1Trimestre17Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1Trimestre17Conc);
    inputNumberMax.setAttribute("value",maxPreco1Trimestre17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1Trimestre17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1Trimestre17Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco1Trimestre17Conc.noUiSlider.on('update',function(e){
        Preco1Trimestre17Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim17.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim17.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1Trimestre17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderPreco1Trimestre17Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco1Trimestre17Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 1 Trimestre 2017 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 2 Trimestre 2017 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco2Trimestre17Conc = 0;
var maxPreco2Trimestre17Conc = 0;

function EstiloPreco2Trimestre17Conc(feature) {
    if( feature.properties.F2Trim17 <= minPreco2Trimestre17Conc || minPreco2Trimestre17Conc === 0){
        minPreco2Trimestre17Conc = feature.properties.F2Trim17
    }
    if(feature.properties.F2Trim17 >= maxPreco2Trimestre17Conc ){
        maxPreco2Trimestre17Conc = feature.properties.F2Trim17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F2Trim17)
    };
}
function apagarPreco2Trimestre17Conc(e) {
    Preco2Trimestre17Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2Trimestre17Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim17.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2Trimestre17Conc,
    });
}
var Preco2Trimestre17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco2Trimestre17Conc,
    onEachFeature: onEachFeaturePreco2Trimestre17Conc
});
let slidePreco2Trimestre17Conc = function(){
    var sliderPreco2Trimestre17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2Trimestre17Conc, {
        start: [minPreco2Trimestre17Conc, maxPreco2Trimestre17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2Trimestre17Conc,
            'max': maxPreco2Trimestre17Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2Trimestre17Conc);
    inputNumberMax.setAttribute("value",maxPreco2Trimestre17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2Trimestre17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2Trimestre17Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco2Trimestre17Conc.noUiSlider.on('update',function(e){
        Preco2Trimestre17Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim17.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim17.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2Trimestre17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderPreco2Trimestre17Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco2Trimestre17Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 2 Trimestre 2017 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 3 Trimestre 2017 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco3Trimestre17Conc = 0;
var maxPreco3Trimestre17Conc = 0;

function EstiloPreco3Trimestre17Conc(feature) {
    if( feature.properties.F3Trim17 <= minPreco3Trimestre17Conc || minPreco3Trimestre17Conc === 0){
        minPreco3Trimestre17Conc = feature.properties.F3Trim17
    }
    if(feature.properties.F3Trim17 >= maxPreco3Trimestre17Conc ){
        maxPreco3Trimestre17Conc = feature.properties.F3Trim17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F3Trim17)
    };
}
function apagarPreco3Trimestre17Conc(e) {
    Preco3Trimestre17Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3Trimestre17Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim17.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3Trimestre17Conc,
    });
}
var Preco3Trimestre17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco3Trimestre17Conc,
    onEachFeature: onEachFeaturePreco3Trimestre17Conc
});
let slidePreco3Trimestre17Conc = function(){
    var sliderPreco3Trimestre17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3Trimestre17Conc, {
        start: [minPreco3Trimestre17Conc, maxPreco3Trimestre17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3Trimestre17Conc,
            'max': maxPreco3Trimestre17Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3Trimestre17Conc);
    inputNumberMax.setAttribute("value",maxPreco3Trimestre17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3Trimestre17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3Trimestre17Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco3Trimestre17Conc.noUiSlider.on('update',function(e){
        Preco3Trimestre17Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim17.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim17.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3Trimestre17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderPreco3Trimestre17Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco3Trimestre17Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 3 Trimestre 2017 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 4 Trimestre 2017 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco4Trimestre17Conc = 0;
var maxPreco4Trimestre17Conc = 0;

function EstiloPreco4Trimestre17Conc(feature) {
    if( feature.properties.F4Trim17 <= minPreco4Trimestre17Conc || minPreco4Trimestre17Conc === 0){
        minPreco4Trimestre17Conc = feature.properties.F4Trim17
    }
    if(feature.properties.F4Trim17 >= maxPreco4Trimestre17Conc ){
        maxPreco4Trimestre17Conc = feature.properties.F4Trim17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F4Trim17)
    };
}
function apagarPreco4Trimestre17Conc(e) {
    Preco4Trimestre17Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4Trimestre17Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim17.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4Trimestre17Conc,
    });
}
var Preco4Trimestre17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco4Trimestre17Conc,
    onEachFeature: onEachFeaturePreco4Trimestre17Conc
});
let slidePreco4Trimestre17Conc = function(){
    var sliderPreco4Trimestre17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4Trimestre17Conc, {
        start: [minPreco4Trimestre17Conc, maxPreco4Trimestre17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4Trimestre17Conc,
            'max': maxPreco4Trimestre17Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4Trimestre17Conc);
    inputNumberMax.setAttribute("value",maxPreco4Trimestre17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4Trimestre17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4Trimestre17Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco4Trimestre17Conc.noUiSlider.on('update',function(e){
        Preco4Trimestre17Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim17.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim17.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4Trimestre17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderPreco4Trimestre17Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco4Trimestre17Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 4 Trimestre 2017 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 1 Trimestre 2018 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco1Trimestre18Conc = 0;
var maxPreco1Trimestre18Conc = 0;

function EstiloPreco1Trimestre18Conc(feature) {
    if( feature.properties.F1Trim18 <= minPreco1Trimestre18Conc || minPreco1Trimestre18Conc === 0){
        minPreco1Trimestre18Conc = feature.properties.F1Trim18
    }
    if(feature.properties.F1Trim18 >= maxPreco1Trimestre18Conc ){
        maxPreco1Trimestre18Conc = feature.properties.F1Trim18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F1Trim18)
    };
}
function apagarPreco1Trimestre18Conc(e) {
    Preco1Trimestre18Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1Trimestre18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim18.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1Trimestre18Conc,
    });
}
var Preco1Trimestre18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco1Trimestre18Conc,
    onEachFeature: onEachFeaturePreco1Trimestre18Conc
});
let slidePreco1Trimestre18Conc = function(){
    var sliderPreco1Trimestre18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1Trimestre18Conc, {
        start: [minPreco1Trimestre18Conc, maxPreco1Trimestre18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1Trimestre18Conc,
            'max': maxPreco1Trimestre18Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1Trimestre18Conc);
    inputNumberMax.setAttribute("value",maxPreco1Trimestre18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1Trimestre18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1Trimestre18Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco1Trimestre18Conc.noUiSlider.on('update',function(e){
        Preco1Trimestre18Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim18.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim18.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1Trimestre18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderPreco1Trimestre18Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco1Trimestre18Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 1 Trimestre 2018 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 2 Trimestre 2018 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco2Trimestre18Conc = 0;
var maxPreco2Trimestre18Conc = 0;

function EstiloPreco2Trimestre18Conc(feature) {
    if( feature.properties.F2Trim18 <= minPreco2Trimestre18Conc || minPreco2Trimestre18Conc === 0){
        minPreco2Trimestre18Conc = feature.properties.F2Trim18
    }
    if(feature.properties.F2Trim18 >= maxPreco2Trimestre18Conc ){
        maxPreco2Trimestre18Conc = feature.properties.F2Trim18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F2Trim18)
    };
}
function apagarPreco2Trimestre18Conc(e) {
    Preco2Trimestre18Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2Trimestre18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim18.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2Trimestre18Conc,
    });
}
var Preco2Trimestre18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco2Trimestre18Conc,
    onEachFeature: onEachFeaturePreco2Trimestre18Conc
});
let slidePreco2Trimestre18Conc = function(){
    var sliderPreco2Trimestre18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2Trimestre18Conc, {
        start: [minPreco2Trimestre18Conc, maxPreco2Trimestre18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2Trimestre18Conc,
            'max': maxPreco2Trimestre18Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2Trimestre18Conc);
    inputNumberMax.setAttribute("value",maxPreco2Trimestre18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2Trimestre18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2Trimestre18Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco2Trimestre18Conc.noUiSlider.on('update',function(e){
        Preco2Trimestre18Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim18.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim18.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2Trimestre18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderPreco2Trimestre18Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco2Trimestre18Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 2 Trimestre 2018 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 3 Trimestre 2018 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco3Trimestre18Conc = 0;
var maxPreco3Trimestre18Conc = 0;

function EstiloPreco3Trimestre18Conc(feature) {
    if( feature.properties.F3Trim18 <= minPreco3Trimestre18Conc || minPreco3Trimestre18Conc === 0){
        minPreco3Trimestre18Conc = feature.properties.F3Trim18
    }
    if(feature.properties.F3Trim18 >= maxPreco3Trimestre18Conc ){
        maxPreco3Trimestre18Conc = feature.properties.F3Trim18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F3Trim18)
    };
}
function apagarPreco3Trimestre18Conc(e) {
    Preco3Trimestre18Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3Trimestre18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim18.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3Trimestre18Conc,
    });
}
var Preco3Trimestre18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco3Trimestre18Conc,
    onEachFeature: onEachFeaturePreco3Trimestre18Conc
});
let slidePreco3Trimestre18Conc = function(){
    var sliderPreco3Trimestre18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3Trimestre18Conc, {
        start: [minPreco3Trimestre18Conc, maxPreco3Trimestre18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3Trimestre18Conc,
            'max': maxPreco3Trimestre18Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3Trimestre18Conc);
    inputNumberMax.setAttribute("value",maxPreco3Trimestre18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3Trimestre18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3Trimestre18Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco3Trimestre18Conc.noUiSlider.on('update',function(e){
        Preco3Trimestre18Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim18.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim18.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3Trimestre18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderPreco3Trimestre18Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco3Trimestre18Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 3 Trimestre 2018 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 4 Trimestre 2018 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco4Trimestre18Conc = 0;
var maxPreco4Trimestre18Conc = 0;

function EstiloPreco4Trimestre18Conc(feature) {
    if( feature.properties.F4Trim18 <= minPreco4Trimestre18Conc || minPreco4Trimestre18Conc === 0){
        minPreco4Trimestre18Conc = feature.properties.F4Trim18
    }
    if(feature.properties.F4Trim18 >= maxPreco4Trimestre18Conc ){
        maxPreco4Trimestre18Conc = feature.properties.F4Trim18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F4Trim18)
    };
}
function apagarPreco4Trimestre18Conc(e) {
    Preco4Trimestre18Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4Trimestre18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim18.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4Trimestre18Conc,
    });
}
var Preco4Trimestre18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco4Trimestre18Conc,
    onEachFeature: onEachFeaturePreco4Trimestre18Conc
});
let slidePreco4Trimestre18Conc = function(){
    var sliderPreco4Trimestre18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4Trimestre18Conc, {
        start: [minPreco4Trimestre18Conc, maxPreco4Trimestre18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4Trimestre18Conc,
            'max': maxPreco4Trimestre18Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4Trimestre18Conc);
    inputNumberMax.setAttribute("value",maxPreco4Trimestre18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4Trimestre18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4Trimestre18Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco4Trimestre18Conc.noUiSlider.on('update',function(e){
        Preco4Trimestre18Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim18.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim18.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4Trimestre18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderPreco4Trimestre18Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco4Trimestre18Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 4 Trimestre 2018 Concelho -------------- \\\\\\


/////////////////////------------------- Dados PREÇOS 1 Trimestre 2019 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco1Trimestre19Conc = 0;
var maxPreco1Trimestre19Conc = 0;

function EstiloPreco1Trimestre19Conc(feature) {
    if( feature.properties.F1Trim19 <= minPreco1Trimestre19Conc || minPreco1Trimestre19Conc === 0){
        minPreco1Trimestre19Conc = feature.properties.F1Trim19
    }
    if(feature.properties.F1Trim19 >= maxPreco1Trimestre19Conc ){
        maxPreco1Trimestre19Conc = feature.properties.F1Trim19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F1Trim19)
    };
}
function apagarPreco1Trimestre19Conc(e) {
    Preco1Trimestre19Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1Trimestre19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim19.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1Trimestre19Conc,
    });
}
var Preco1Trimestre19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco1Trimestre19Conc,
    onEachFeature: onEachFeaturePreco1Trimestre19Conc
});
let slidePreco1Trimestre19Conc = function(){
    var sliderPreco1Trimestre19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1Trimestre19Conc, {
        start: [minPreco1Trimestre19Conc, maxPreco1Trimestre19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1Trimestre19Conc,
            'max': maxPreco1Trimestre19Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1Trimestre19Conc);
    inputNumberMax.setAttribute("value",maxPreco1Trimestre19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1Trimestre19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1Trimestre19Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco1Trimestre19Conc.noUiSlider.on('update',function(e){
        Preco1Trimestre19Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim19.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim19.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1Trimestre19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderPreco1Trimestre19Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco1Trimestre19Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 1 Trimestre 2019 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 2 Trimestre 2019 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco2Trimestre19Conc = 0;
var maxPreco2Trimestre19Conc = 0;

function EstiloPreco2Trimestre19Conc(feature) {
    if( feature.properties.F2Trim19 <= minPreco2Trimestre19Conc || minPreco2Trimestre19Conc === 0){
        minPreco2Trimestre19Conc = feature.properties.F2Trim19
    }
    if(feature.properties.F2Trim19 >= maxPreco2Trimestre19Conc ){
        maxPreco2Trimestre19Conc = feature.properties.F2Trim19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F2Trim19)
    };
}
function apagarPreco2Trimestre19Conc(e) {
    Preco2Trimestre19Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2Trimestre19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim19.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2Trimestre19Conc,
    });
}
var Preco2Trimestre19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco2Trimestre19Conc,
    onEachFeature: onEachFeaturePreco2Trimestre19Conc
});
let slidePreco2Trimestre19Conc = function(){
    var sliderPreco2Trimestre19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2Trimestre19Conc, {
        start: [minPreco2Trimestre19Conc, maxPreco2Trimestre19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2Trimestre19Conc,
            'max': maxPreco2Trimestre19Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2Trimestre19Conc);
    inputNumberMax.setAttribute("value",maxPreco2Trimestre19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2Trimestre19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2Trimestre19Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco2Trimestre19Conc.noUiSlider.on('update',function(e){
        Preco2Trimestre19Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim19.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim19.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2Trimestre19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderPreco2Trimestre19Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco2Trimestre19Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 2 Trimestre 2019 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 3 Trimestre 2019 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco3Trimestre19Conc = 0;
var maxPreco3Trimestre19Conc = 0;

function EstiloPreco3Trimestre19Conc(feature) {
    if( feature.properties.F3Trim19 <= minPreco3Trimestre19Conc || minPreco3Trimestre19Conc === 0){
        minPreco3Trimestre19Conc = feature.properties.F3Trim19
    }
    if(feature.properties.F3Trim19 >= maxPreco3Trimestre19Conc ){
        maxPreco3Trimestre19Conc = feature.properties.F3Trim19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F3Trim19)
    };
}
function apagarPreco3Trimestre19Conc(e) {
    Preco3Trimestre19Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3Trimestre19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim19.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3Trimestre19Conc,
    });
}
var Preco3Trimestre19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco3Trimestre19Conc,
    onEachFeature: onEachFeaturePreco3Trimestre19Conc
});
let slidePreco3Trimestre19Conc = function(){
    var sliderPreco3Trimestre19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3Trimestre19Conc, {
        start: [minPreco3Trimestre19Conc, maxPreco3Trimestre19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3Trimestre19Conc,
            'max': maxPreco3Trimestre19Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3Trimestre19Conc);
    inputNumberMax.setAttribute("value",maxPreco3Trimestre19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3Trimestre19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3Trimestre19Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco3Trimestre19Conc.noUiSlider.on('update',function(e){
        Preco3Trimestre19Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim19.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim19.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3Trimestre19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderPreco3Trimestre19Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco3Trimestre19Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 3 Trimestre 2019 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 4 Trimestre 2019 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco4Trimestre19Conc = 0;
var maxPreco4Trimestre19Conc = 0;

function EstiloPreco4Trimestre19Conc(feature) {
    if( feature.properties.F4Trim19 <= minPreco4Trimestre19Conc || minPreco4Trimestre19Conc === 0){
        minPreco4Trimestre19Conc = feature.properties.F4Trim19
    }
    if(feature.properties.F4Trim19 >= maxPreco4Trimestre19Conc ){
        maxPreco4Trimestre19Conc = feature.properties.F4Trim19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F4Trim19)
    };
}
function apagarPreco4Trimestre19Conc(e) {
    Preco4Trimestre19Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4Trimestre19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim19.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4Trimestre19Conc,
    });
}
var Preco4Trimestre19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco4Trimestre19Conc,
    onEachFeature: onEachFeaturePreco4Trimestre19Conc
});
let slidePreco4Trimestre19Conc = function(){
    var sliderPreco4Trimestre19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4Trimestre19Conc, {
        start: [minPreco4Trimestre19Conc, maxPreco4Trimestre19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4Trimestre19Conc,
            'max': maxPreco4Trimestre19Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4Trimestre19Conc);
    inputNumberMax.setAttribute("value",maxPreco4Trimestre19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4Trimestre19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4Trimestre19Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco4Trimestre19Conc.noUiSlider.on('update',function(e){
        Preco4Trimestre19Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim19.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim19.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4Trimestre19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderPreco4Trimestre19Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco4Trimestre19Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 4 Trimestre 2019 Concelho -------------- \\\\\\


/////////////////////------------------- Dados PREÇOS 1 Trimestre 2020 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco1Trimestre20Conc = 0;
var maxPreco1Trimestre20Conc = 0;

function EstiloPreco1Trimestre20Conc(feature) {
    if( feature.properties.F1Trim20 <= minPreco1Trimestre20Conc || minPreco1Trimestre20Conc === 0){
        minPreco1Trimestre20Conc = feature.properties.F1Trim20
    }
    if(feature.properties.F1Trim20 >= maxPreco1Trimestre20Conc ){
        maxPreco1Trimestre20Conc = feature.properties.F1Trim20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F1Trim20)
    };
}
function apagarPreco1Trimestre20Conc(e) {
    Preco1Trimestre20Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1Trimestre20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim20.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1Trimestre20Conc,
    });
}
var Preco1Trimestre20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco1Trimestre20Conc,
    onEachFeature: onEachFeaturePreco1Trimestre20Conc
});
let slidePreco1Trimestre20Conc = function(){
    var sliderPreco1Trimestre20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1Trimestre20Conc, {
        start: [minPreco1Trimestre20Conc, maxPreco1Trimestre20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1Trimestre20Conc,
            'max': maxPreco1Trimestre20Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1Trimestre20Conc);
    inputNumberMax.setAttribute("value",maxPreco1Trimestre20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1Trimestre20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1Trimestre20Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco1Trimestre20Conc.noUiSlider.on('update',function(e){
        Preco1Trimestre20Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim20.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim20.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1Trimestre20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderPreco1Trimestre20Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco1Trimestre20Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 1 Trimestre 2020 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 2 Trimestre 2020 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco2Trimestre20Conc = 0;
var maxPreco2Trimestre20Conc = 0;

function EstiloPreco2Trimestre20Conc(feature) {
    if( feature.properties.F2Trim20 <= minPreco2Trimestre20Conc || minPreco2Trimestre20Conc === 0){
        minPreco2Trimestre20Conc = feature.properties.F2Trim20
    }
    if(feature.properties.F2Trim20 >= maxPreco2Trimestre20Conc ){
        maxPreco2Trimestre20Conc = feature.properties.F2Trim20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F2Trim20)
    };
}
function apagarPreco2Trimestre20Conc(e) {
    Preco2Trimestre20Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2Trimestre20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim20.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2Trimestre20Conc,
    });
}
var Preco2Trimestre20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco2Trimestre20Conc,
    onEachFeature: onEachFeaturePreco2Trimestre20Conc
});
let slidePreco2Trimestre20Conc = function(){
    var sliderPreco2Trimestre20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2Trimestre20Conc, {
        start: [minPreco2Trimestre20Conc, maxPreco2Trimestre20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2Trimestre20Conc,
            'max': maxPreco2Trimestre20Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2Trimestre20Conc);
    inputNumberMax.setAttribute("value",maxPreco2Trimestre20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2Trimestre20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2Trimestre20Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco2Trimestre20Conc.noUiSlider.on('update',function(e){
        Preco2Trimestre20Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim20.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim20.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2Trimestre20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderPreco2Trimestre20Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco2Trimestre20Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 2 Trimestre 2020 Concelho -------------- \\\\\\
/////////////////////------------------- Dados PREÇOS 3 Trimestre 2020 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco3Trimestre20Conc = 0;
var maxPreco3Trimestre20Conc = 0;

function EstiloPreco3Trimestre20Conc(feature) {
    if( feature.properties.F3Trim20 <= minPreco3Trimestre20Conc || minPreco3Trimestre20Conc === 0){
        minPreco3Trimestre20Conc = feature.properties.F3Trim20
    }
    if(feature.properties.F3Trim20 >= maxPreco3Trimestre20Conc ){
        maxPreco3Trimestre20Conc = feature.properties.F3Trim20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F3Trim20)
    };
}
function apagarPreco3Trimestre20Conc(e) {
    Preco3Trimestre20Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3Trimestre20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim20.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3Trimestre20Conc,
    });
}
var Preco3Trimestre20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco3Trimestre20Conc,
    onEachFeature: onEachFeaturePreco3Trimestre20Conc
});
let slidePreco3Trimestre20Conc = function(){
    var sliderPreco3Trimestre20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3Trimestre20Conc, {
        start: [minPreco3Trimestre20Conc, maxPreco3Trimestre20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3Trimestre20Conc,
            'max': maxPreco3Trimestre20Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3Trimestre20Conc);
    inputNumberMax.setAttribute("value",maxPreco3Trimestre20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3Trimestre20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3Trimestre20Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco3Trimestre20Conc.noUiSlider.on('update',function(e){
        Preco3Trimestre20Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim20.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim20.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3Trimestre20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderPreco3Trimestre20Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco3Trimestre20Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 3 Trimestre 2020 Concelho -------------- \\\\\\


/////////////////////------------------- Dados PREÇOS 4 Trimestre 2020 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco4Trimestre20Conc = 0;
var maxPreco4Trimestre20Conc = 0;

function EstiloPreco4Trimestre20Conc(feature) {
    if( feature.properties.F4Trim20 <= minPreco4Trimestre20Conc || minPreco4Trimestre20Conc === 0){
        minPreco4Trimestre20Conc = feature.properties.F4Trim20
    }
    if(feature.properties.F4Trim20 >= maxPreco4Trimestre20Conc ){
        maxPreco4Trimestre20Conc = feature.properties.F4Trim20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F4Trim20)
    };
}
function apagarPreco4Trimestre20Conc(e) {
    Preco4Trimestre20Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4Trimestre20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim20.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4Trimestre20Conc,
    });
}
var Preco4Trimestre20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco4Trimestre20Conc,
    onEachFeature: onEachFeaturePreco4Trimestre20Conc
});
let slidePreco4Trimestre20Conc = function(){
    var sliderPreco4Trimestre20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4Trimestre20Conc, {
        start: [minPreco4Trimestre20Conc, maxPreco4Trimestre20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4Trimestre20Conc,
            'max': maxPreco4Trimestre20Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4Trimestre20Conc);
    inputNumberMax.setAttribute("value",maxPreco4Trimestre20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4Trimestre20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4Trimestre20Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco4Trimestre20Conc.noUiSlider.on('update',function(e){
        Preco4Trimestre20Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim20.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim20.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4Trimestre20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderPreco4Trimestre20Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco4Trimestre20Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 4 Trimestre 2020 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 1 Trimestre 2021 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco1Trimestre21Conc = 0;
var maxPreco1Trimestre21Conc = 0;

function EstiloPreco1Trimestre21Conc(feature) {
    if( feature.properties.F1Trim21 <= minPreco1Trimestre21Conc || minPreco1Trimestre21Conc === 0){
        minPreco1Trimestre21Conc = feature.properties.F1Trim21
    }
    if(feature.properties.F1Trim21 >= maxPreco1Trimestre21Conc ){
        maxPreco1Trimestre21Conc = feature.properties.F1Trim21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F1Trim21)
    };
}
function apagarPreco1Trimestre21Conc(e) {
    Preco1Trimestre21Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1Trimestre21Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim21.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1Trimestre21Conc,
    });
}
var Preco1Trimestre21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco1Trimestre21Conc,
    onEachFeature: onEachFeaturePreco1Trimestre21Conc
});
let slidePreco1Trimestre21Conc = function(){
    var sliderPreco1Trimestre21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1Trimestre21Conc, {
        start: [minPreco1Trimestre21Conc, maxPreco1Trimestre21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1Trimestre21Conc,
            'max': maxPreco1Trimestre21Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1Trimestre21Conc);
    inputNumberMax.setAttribute("value",maxPreco1Trimestre21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1Trimestre21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1Trimestre21Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco1Trimestre21Conc.noUiSlider.on('update',function(e){
        Preco1Trimestre21Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim21.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim21.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1Trimestre21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderPreco1Trimestre21Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco1Trimestre21Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 1 Trimestre 2021 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 2 Trimestre 2021 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco2Trimestre21Conc = 0;
var maxPreco2Trimestre21Conc = 0;

function EstiloPreco2Trimestre21Conc(feature) {
    if( feature.properties.F2Trim21 <= minPreco2Trimestre21Conc || minPreco2Trimestre21Conc === 0){
        minPreco2Trimestre21Conc = feature.properties.F2Trim21
    }
    if(feature.properties.F2Trim21 >= maxPreco2Trimestre21Conc ){
        maxPreco2Trimestre21Conc = feature.properties.F2Trim21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F2Trim21)
    };
}
function apagarPreco2Trimestre21Conc(e) {
    Preco2Trimestre21Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2Trimestre21Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim21.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2Trimestre21Conc,
    });
}
var Preco2Trimestre21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco2Trimestre21Conc,
    onEachFeature: onEachFeaturePreco2Trimestre21Conc
});
let slidePreco2Trimestre21Conc = function(){
    var sliderPreco2Trimestre21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2Trimestre21Conc, {
        start: [minPreco2Trimestre21Conc, maxPreco2Trimestre21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2Trimestre21Conc,
            'max': maxPreco2Trimestre21Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2Trimestre21Conc);
    inputNumberMax.setAttribute("value",maxPreco2Trimestre21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2Trimestre21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2Trimestre21Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco2Trimestre21Conc.noUiSlider.on('update',function(e){
        Preco2Trimestre21Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim21.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim21.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2Trimestre21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderPreco2Trimestre21Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco2Trimestre21Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 2 Trimestre 2021 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 3 Trimestre 2021 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco3Trimestre21Conc = 0;
var maxPreco3Trimestre21Conc = 0;

function EstiloPreco3Trimestre21Conc(feature) {
    if( feature.properties.F3Trim21 <= minPreco3Trimestre21Conc || minPreco3Trimestre21Conc === 0){
        minPreco3Trimestre21Conc = feature.properties.F3Trim21
    }
    if(feature.properties.F3Trim21 >= maxPreco3Trimestre21Conc ){
        maxPreco3Trimestre21Conc = feature.properties.F3Trim21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F3Trim21)
    };
}
function apagarPreco3Trimestre21Conc(e) {
    Preco3Trimestre21Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3Trimestre21Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim21.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3Trimestre21Conc,
    });
}
var Preco3Trimestre21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco3Trimestre21Conc,
    onEachFeature: onEachFeaturePreco3Trimestre21Conc
});
let slidePreco3Trimestre21Conc = function(){
    var sliderPreco3Trimestre21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3Trimestre21Conc, {
        start: [minPreco3Trimestre21Conc, maxPreco3Trimestre21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3Trimestre21Conc,
            'max': maxPreco3Trimestre21Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3Trimestre21Conc);
    inputNumberMax.setAttribute("value",maxPreco3Trimestre21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3Trimestre21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3Trimestre21Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco3Trimestre21Conc.noUiSlider.on('update',function(e){
        Preco3Trimestre21Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim21.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim21.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3Trimestre21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderPreco3Trimestre21Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco3Trimestre21Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 3 Trimestre 2021 Concelho -------------- \\\\\\

/////////////////////------------------- Dados PREÇOS 4 Trimestre 2021 POR CONCELHO-----//\\\\\\\\//////////////////////

var minPreco4Trimestre21Conc = 0;
var maxPreco4Trimestre21Conc = 0;

function EstiloPreco4Trimestre21Conc(feature) {
    if( feature.properties.F4Trim21 <= minPreco4Trimestre21Conc || minPreco4Trimestre21Conc === 0){
        minPreco4Trimestre21Conc = feature.properties.F4Trim21
    }
    if(feature.properties.F4Trim21 >= maxPreco4Trimestre21Conc ){
        maxPreco4Trimestre21Conc = feature.properties.F4Trim21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasConc(feature.properties.F4Trim21)
    };
}
function apagarPreco4Trimestre21Conc(e) {
    Preco4Trimestre21Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4Trimestre21Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim21.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4Trimestre21Conc,
    });
}
var Preco4Trimestre21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPreco4Trimestre21Conc,
    onEachFeature: onEachFeaturePreco4Trimestre21Conc
});
let slidePreco4Trimestre21Conc = function(){
    var sliderPreco4Trimestre21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 89){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4Trimestre21Conc, {
        start: [minPreco4Trimestre21Conc, maxPreco4Trimestre21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4Trimestre21Conc,
            'max': maxPreco4Trimestre21Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4Trimestre21Conc);
    inputNumberMax.setAttribute("value",maxPreco4Trimestre21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4Trimestre21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4Trimestre21Conc.noUiSlider.set([null, this.value]);
    });

    sliderPreco4Trimestre21Conc.noUiSlider.on('update',function(e){
        Preco4Trimestre21Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim21.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim21.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4Trimestre21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 89;
    sliderAtivo = sliderPreco4Trimestre21Conc.noUiSlider;
    $(slidersGeral).append(sliderPreco4Trimestre21Conc);
} 

/////////////////////////////////// Fim  Dados PREÇOS 4 Trimestre 2021 Concelho -------------- \\\\\\


/////////////////////////////------------------------ VARIAÇÕES -------------------------------\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação 2 Trimestre 2016 E 1 Trimestre 2016 POR CONCELHOS -------------------////

var minVar2Tri16_1Tri16Conc = 0;
var maxVar2Tri16_1Tri16Conc = 0;

function CorVar2Tri16_1Tri16Conc(d) {
    return d === null ? '#808080':
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -18  ? '#2288bf' :
                ''  ;
}

var legendaVar2Tri16_1Tri16Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2016 e o 1º trimestre de 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -17.45 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Tri16_1Tri16Conc(feature) {
    if(feature.properties.Var2T1T_16 <= minVar2Tri16_1Tri16Conc || minVar2Tri16_1Tri16Conc ===0){
        minVar2Tri16_1Tri16Conc = feature.properties.Var2T1T_16
    }
    if(feature.properties.Var2T1T_16 > maxVar2Tri16_1Tri16Conc){
        maxVar2Tri16_1Tri16Conc = feature.properties.Var2T1T_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri16_1Tri16Conc(feature.properties.Var2T1T_16)};
    }


function apagarVar2Tri16_1Tri16Conc(e) {
    Var2Tri16_1Tri16Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri16_1Tri16Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_16.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri16_1Tri16Conc,
    });
}
var Var2Tri16_1Tri16Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2Tri16_1Tri16Conc,
    onEachFeature: onEachFeatureVar2Tri16_1Tri16Conc
});

let slideVar2Tri16_1Tri16Conc = function(){
    var sliderVar2Tri16_1Tri16Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri16_1Tri16Conc, {
        start: [minVar2Tri16_1Tri16Conc, maxVar2Tri16_1Tri16Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri16_1Tri16Conc,
            'max': maxVar2Tri16_1Tri16Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri16_1Tri16Conc);
    inputNumberMax.setAttribute("value",maxVar2Tri16_1Tri16Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri16_1Tri16Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri16_1Tri16Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri16_1Tri16Conc.noUiSlider.on('update',function(e){
        Var2Tri16_1Tri16Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri16_1Tri16Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderVar2Tri16_1Tri16Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri16_1Tri16Conc);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2016 E 1 Trimestre 2016 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2016 E 2 Trimestre 2016 POR CONCELHOS -------------------////

var minVar3Tri16_2Tri16Conc = 0;
var maxVar3Tri16_2Tri16Conc = 0;

function CorVar3Tri16_2Tri16Conc(d) {
    return d === null ? '#808080':
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -1.5  ? '#9eaad7' :
        d >= -4  ? '#2288bf' :
                ''  ;
}

var legendaVar3Tri16_2Tri16Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2016 e o 2º trimestre de 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -1.5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -3.96 a -1.5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3Tri16_2Tri16Conc(feature) {
    if(feature.properties.Var3T2T_16 <= minVar3Tri16_2Tri16Conc || minVar3Tri16_2Tri16Conc ===0){
        minVar3Tri16_2Tri16Conc = feature.properties.Var3T2T_16
    }
    if(feature.properties.Var3T2T_16 > maxVar3Tri16_2Tri16Conc){
        maxVar3Tri16_2Tri16Conc = feature.properties.Var3T2T_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri16_2Tri16Conc(feature.properties.Var3T2T_16)};
    }


function apagarVar3Tri16_2Tri16Conc(e) {
    Var3Tri16_2Tri16Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri16_2Tri16Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_16.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri16_2Tri16Conc,
    });
}
var Var3Tri16_2Tri16Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar3Tri16_2Tri16Conc,
    onEachFeature: onEachFeatureVar3Tri16_2Tri16Conc
});

let slideVar3Tri16_2Tri16Conc = function(){
    var sliderVar3Tri16_2Tri16Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 93){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri16_2Tri16Conc, {
        start: [minVar3Tri16_2Tri16Conc, maxVar3Tri16_2Tri16Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri16_2Tri16Conc,
            'max': maxVar3Tri16_2Tri16Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri16_2Tri16Conc);
    inputNumberMax.setAttribute("value",maxVar3Tri16_2Tri16Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri16_2Tri16Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri16_2Tri16Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri16_2Tri16Conc.noUiSlider.on('update',function(e){
        Var3Tri16_2Tri16Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri16_2Tri16Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 93;
    sliderAtivo = sliderVar3Tri16_2Tri16Conc.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri16_2Tri16Conc);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2016 E 2 Trimestre 2016 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2016 E 3 Trimestre 2016 POR CONCELHOS -------------------////

var minVar4Tri16_3Tri16Conc = 0;
var maxVar4Tri16_3Tri16Conc = 0;

function CorVar4Tri16_3Tri16Conc(d) {
    return d === null ? '#808080':
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2  ? '#9eaad7' :
        d >= -5  ? '#2288bf' :
                ''  ;
}

var legendaVar4Tri16_3Tri16Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2016 e o 3º trimestre de 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -4.13 a -2' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4Tri16_3Tri16Conc(feature) {
    if(feature.properties.Var4T3T_16 <= minVar4Tri16_3Tri16Conc || minVar4Tri16_3Tri16Conc ===0){
        minVar4Tri16_3Tri16Conc = feature.properties.Var4T3T_16
    }
    if(feature.properties.Var4T3T_16 > maxVar4Tri16_3Tri16Conc){
        maxVar4Tri16_3Tri16Conc = feature.properties.Var4T3T_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri16_3Tri16Conc(feature.properties.Var4T3T_16)};
    }


function apagarVar4Tri16_3Tri16Conc(e) {
    Var4Tri16_3Tri16Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri16_3Tri16Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_16.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri16_3Tri16Conc,
    });
}
var Var4Tri16_3Tri16Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar4Tri16_3Tri16Conc,
    onEachFeature: onEachFeatureVar4Tri16_3Tri16Conc
});

let slideVar4Tri16_3Tri16Conc = function(){
    var sliderVar4Tri16_3Tri16Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri16_3Tri16Conc, {
        start: [minVar4Tri16_3Tri16Conc, maxVar4Tri16_3Tri16Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri16_3Tri16Conc,
            'max': maxVar4Tri16_3Tri16Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri16_3Tri16Conc);
    inputNumberMax.setAttribute("value",maxVar4Tri16_3Tri16Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri16_3Tri16Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri16_3Tri16Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri16_3Tri16Conc.noUiSlider.on('update',function(e){
        Var4Tri16_3Tri16Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri16_3Tri16Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderVar4Tri16_3Tri16Conc.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri16_3Tri16Conc);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2016 E 3 Trimestre 2016 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 1 Trimestre 2017 E 4 Trimestre 2016 POR CONCELHOS -------------------////

var minVar1Tri17_4Tri16Conc = 0;
var maxVar1Tri17_4Tri16Conc = 0;

function CorVar1Tri17_4Tri16Conc(d) {
    return d === null ? '#808080':
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2  ? '#9eaad7' :
        d >= -8.32  ? '#2288bf' :
                ''  ;
}

var legendaVar1Tri17_4Tri16Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 1º trimestre de 2017 e o 4º trimestre de 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -8.31 a -2' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Tri17_4Tri16Conc(feature) {
    if(feature.properties.Var1T4T_17 <= minVar1Tri17_4Tri16Conc || minVar1Tri17_4Tri16Conc ===0){
        minVar1Tri17_4Tri16Conc = feature.properties.Var1T4T_17
    }
    if(feature.properties.Var1T4T_17 > maxVar1Tri17_4Tri16Conc){
        maxVar1Tri17_4Tri16Conc = feature.properties.Var1T4T_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Tri17_4Tri16Conc(feature.properties.Var1T4T_17)};
    }


function apagarVar1Tri17_4Tri16Conc(e) {
    Var1Tri17_4Tri16Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Tri17_4Tri16Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1T4T_17.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Tri17_4Tri16Conc,
    });
}
var Var1Tri17_4Tri16Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar1Tri17_4Tri16Conc,
    onEachFeature: onEachFeatureVar1Tri17_4Tri16Conc
});

let slideVar1Tri17_4Tri16Conc = function(){
    var sliderVar1Tri17_4Tri16Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Tri17_4Tri16Conc, {
        start: [minVar1Tri17_4Tri16Conc, maxVar1Tri17_4Tri16Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Tri17_4Tri16Conc,
            'max': maxVar1Tri17_4Tri16Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar1Tri17_4Tri16Conc);
    inputNumberMax.setAttribute("value",maxVar1Tri17_4Tri16Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Tri17_4Tri16Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Tri17_4Tri16Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar1Tri17_4Tri16Conc.noUiSlider.on('update',function(e){
        Var1Tri17_4Tri16Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var1T4T_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1T4T_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Tri17_4Tri16Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderVar1Tri17_4Tri16Conc.noUiSlider;
    $(slidersGeral).append(sliderVar1Tri17_4Tri16Conc);
} 

///////////////////////////// Fim da Variação 1 Trimestre 2017 E 4 Trimestre 2016 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2 Trimestre 2017 E 1 Trimestre 2017 POR CONCELHOS -------------------////

var minVar2Tri17_1Tri17Conc = 0;
var maxVar2Tri17_1Tri17Conc = 0;


function CorVar2Tri17_1Tri17Conc(d) {
    return d === null ? '#808080':
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2  ? '#9eaad7' :
                ''  ;
}

var legendaVar2Tri17_1Tri17Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2017 e o 1º trimestre de 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -1.34 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Tri17_1Tri17Conc(feature) {
    if(feature.properties.Var2T1T_17 <= minVar2Tri17_1Tri17Conc || minVar2Tri17_1Tri17Conc ===0){
        minVar2Tri17_1Tri17Conc = feature.properties.Var2T1T_17
    }
    if(feature.properties.Var2T1T_17 > maxVar2Tri17_1Tri17Conc){
        maxVar2Tri17_1Tri17Conc = feature.properties.Var2T1T_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri17_1Tri17Conc(feature.properties.Var2T1T_17)};
    }


function apagarVar2Tri17_1Tri17Conc(e) {
    Var2Tri17_1Tri17Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri17_1Tri17Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_17.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri17_1Tri17Conc,
    });
}
var Var2Tri17_1Tri17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2Tri17_1Tri17Conc,
    onEachFeature: onEachFeatureVar2Tri17_1Tri17Conc
});

let slideVar2Tri17_1Tri17Conc = function(){
    var sliderVar2Tri17_1Tri17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri17_1Tri17Conc, {
        start: [minVar2Tri17_1Tri17Conc, maxVar2Tri17_1Tri17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri17_1Tri17Conc,
            'max': maxVar2Tri17_1Tri17Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri17_1Tri17Conc);
    inputNumberMax.setAttribute("value",maxVar2Tri17_1Tri17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri17_1Tri17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri17_1Tri17Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri17_1Tri17Conc.noUiSlider.on('update',function(e){
        Var2Tri17_1Tri17Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri17_1Tri17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderVar2Tri17_1Tri17Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri17_1Tri17Conc);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2017 E 1 Trimestre 2017 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2017 E 2 Trimestre 2017 POR CONCELHOS -------------------////

var minVar3Tri17_2Tri17Conc = 0;
var maxVar3Tri17_2Tri17Conc = 0;

function CorVar3Tri17_2Tri17Conc(d) {
    return d === null ? '#808080':
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -7.14  ? '#2288bf' :
                ''  ;
}

var legendaVar3Tri17_2Tri17Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2017 e o 2º trimestre de 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -7.13 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3Tri17_2Tri17Conc(feature) {
    if(feature.properties.Var3T2T_17 <= minVar3Tri17_2Tri17Conc || minVar3Tri17_2Tri17Conc ===0){
        minVar3Tri17_2Tri17Conc = feature.properties.Var3T2T_17
    }
    if(feature.properties.Var3T2T_17 > maxVar3Tri17_2Tri17Conc){
        maxVar3Tri17_2Tri17Conc = feature.properties.Var3T2T_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri17_2Tri17Conc(feature.properties.Var3T2T_17)};
    }


function apagarVar3Tri17_2Tri17Conc(e) {
    Var3Tri17_2Tri17Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri17_2Tri17Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_17.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri17_2Tri17Conc,
    });
}
var Var3Tri17_2Tri17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar3Tri17_2Tri17Conc,
    onEachFeature: onEachFeatureVar3Tri17_2Tri17Conc
});

let slideVar3Tri17_2Tri17Conc = function(){
    var sliderVar3Tri17_2Tri17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri17_2Tri17Conc, {
        start: [minVar3Tri17_2Tri17Conc, maxVar3Tri17_2Tri17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri17_2Tri17Conc,
            'max': maxVar3Tri17_2Tri17Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri17_2Tri17Conc);
    inputNumberMax.setAttribute("value",maxVar3Tri17_2Tri17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri17_2Tri17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri17_2Tri17Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri17_2Tri17Conc.noUiSlider.on('update',function(e){
        Var3Tri17_2Tri17Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri17_2Tri17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderVar3Tri17_2Tri17Conc.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri17_2Tri17Conc);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2017 E 2 Trimestre 2017 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2017 E 3 Trimestre 2017 POR CONCELHOS -------------------////

var minVar4Tri17_3Tri17Conc = 0;
var maxVar4Tri17_3Tri17Conc = 0;

function CorVar4Tri17_3Tri17Conc(d) {
    return d === null ? '#808080':
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -0.74  ? '#2288bf' :
                ''  ;
}

var legendaVar4Tri17_3Tri17Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2017 e o 3º trimestre de 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -0.73 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4Tri17_3Tri17Conc(feature) {
    if(feature.properties.Var4T3T_17 <= minVar4Tri17_3Tri17Conc || minVar4Tri17_3Tri17Conc ===0){
        minVar4Tri17_3Tri17Conc = feature.properties.Var4T3T_17
    }
    if(feature.properties.Var4T3T_17 > maxVar4Tri17_3Tri17Conc){
        maxVar4Tri17_3Tri17Conc = feature.properties.Var4T3T_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri17_3Tri17Conc(feature.properties.Var4T3T_17)};
    }


function apagarVar4Tri17_3Tri17Conc(e) {
    Var4Tri17_3Tri17Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri17_3Tri17Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_17.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri17_3Tri17Conc,
    });
}
var Var4Tri17_3Tri17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar4Tri17_3Tri17Conc,
    onEachFeature: onEachFeatureVar4Tri17_3Tri17Conc
});

let slideVar4Tri17_3Tri17Conc = function(){
    var sliderVar4Tri17_3Tri17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri17_3Tri17Conc, {
        start: [minVar4Tri17_3Tri17Conc, maxVar4Tri17_3Tri17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri17_3Tri17Conc,
            'max': maxVar4Tri17_3Tri17Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri17_3Tri17Conc);
    inputNumberMax.setAttribute("value",maxVar4Tri17_3Tri17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri17_3Tri17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri17_3Tri17Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri17_3Tri17Conc.noUiSlider.on('update',function(e){
        Var4Tri17_3Tri17Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri17_3Tri17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderVar4Tri17_3Tri17Conc.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri17_3Tri17Conc);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2017 E 3 Trimestre 2017 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 1 Trimestre 2018 E 4 Trimestre 2017 POR CONCELHOS -------------------////

var minVar1Tri18_4Tri17Conc = 0;
var maxVar1Tri18_4Tri17Conc = 0;

function CorVar1Tri18_4Tri17Conc(d) {
    return d === null ? '#808080':
        d >= 7.5  ? '#8c0303' :
        d >= 5  ? '#de1f35' :
        d >= 3  ? '#ff5e6e' :
        d >= 1.5  ? '#f5b3be' :
        d >= 0  ? '#9eaad7' :
                ''  ;
}

var legendaVar1Tri18_4Tri17Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 1º trimestre de 2018 e o 4º trimestre de 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 7.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  5 a 7.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  3 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  1.5 a 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  0.11 a 1.5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Tri18_4Tri17Conc(feature) {
    if(feature.properties.Var1T4T_18 <= minVar1Tri18_4Tri17Conc || minVar1Tri18_4Tri17Conc ===0){
        minVar1Tri18_4Tri17Conc = feature.properties.Var1T4T_18
    }
    if(feature.properties.Var1T4T_18 > maxVar1Tri18_4Tri17Conc){
        maxVar1Tri18_4Tri17Conc = feature.properties.Var1T4T_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Tri18_4Tri17Conc(feature.properties.Var1T4T_18)};
    }


function apagarVar1Tri18_4Tri17Conc(e) {
    Var1Tri18_4Tri17Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Tri18_4Tri17Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1T4T_18.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Tri18_4Tri17Conc,
    });
}
var Var1Tri18_4Tri17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar1Tri18_4Tri17Conc,
    onEachFeature: onEachFeatureVar1Tri18_4Tri17Conc
});

let slideVar1Tri18_4Tri17Conc = function(){
    var sliderVar1Tri18_4Tri17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Tri18_4Tri17Conc, {
        start: [minVar1Tri18_4Tri17Conc, maxVar1Tri18_4Tri17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Tri18_4Tri17Conc,
            'max': maxVar1Tri18_4Tri17Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar1Tri18_4Tri17Conc);
    inputNumberMax.setAttribute("value",maxVar1Tri18_4Tri17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Tri18_4Tri17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Tri18_4Tri17Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar1Tri18_4Tri17Conc.noUiSlider.on('update',function(e){
        Var1Tri18_4Tri17Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var1T4T_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1T4T_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Tri18_4Tri17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVar1Tri18_4Tri17Conc.noUiSlider;
    $(slidersGeral).append(sliderVar1Tri18_4Tri17Conc);
} 

///////////////////////////// Fim da Variação 1 Trimestre 2018 E 4 Trimestre 2017 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2 Trimestre 2018 E 1 Trimestre 2018 POR CONCELHOS -------------------////

var minVar2Tri18_1Tri18Conc = 0;
var maxVar2Tri18_1Tri18Conc = 0;

function CorVar2Tri18_1Tri18Conc(d) {
    return d === null ? '#808080':
        d >= 4.5  ? '#8c0303' :
        d >= 3  ? '#de1f35' :
        d >= 1.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -1.7  ? '#9eaad7' :
                ''  ;
}

var legendaVar2Tri18_1Tri18Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2018 e o 1º trimestre de 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 4.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  3 a 4.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  1.5 a 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 1.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -1.61 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Tri18_1Tri18Conc(feature) {
    if(feature.properties.Var2T1T_18 <= minVar2Tri18_1Tri18Conc || minVar2Tri18_1Tri18Conc ===0){
        minVar2Tri18_1Tri18Conc = feature.properties.Var2T1T_18
    }
    if(feature.properties.Var2T1T_18 > maxVar2Tri18_1Tri18Conc){
        maxVar2Tri18_1Tri18Conc = feature.properties.Var2T1T_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri18_1Tri18Conc(feature.properties.Var2T1T_18)};
    }


function apagarVar2Tri18_1Tri18Conc(e) {
    Var2Tri18_1Tri18Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri18_1Tri18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_18.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri18_1Tri18Conc,
    });
}
var Var2Tri18_1Tri18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2Tri18_1Tri18Conc,
    onEachFeature: onEachFeatureVar2Tri18_1Tri18Conc
});

let slideVar2Tri18_1Tri18Conc = function(){
    var sliderVar2Tri18_1Tri18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri18_1Tri18Conc, {
        start: [minVar2Tri18_1Tri18Conc, maxVar2Tri18_1Tri18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri18_1Tri18Conc,
            'max': maxVar2Tri18_1Tri18Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri18_1Tri18Conc);
    inputNumberMax.setAttribute("value",maxVar2Tri18_1Tri18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri18_1Tri18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri18_1Tri18Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri18_1Tri18Conc.noUiSlider.on('update',function(e){
        Var2Tri18_1Tri18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri18_1Tri18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderVar2Tri18_1Tri18Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri18_1Tri18Conc);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2018 E 1 Trimestre 2018 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2018 E 2 Trimestre 2018 POR CONCELHOS -------------------////

var minVar3Tri18_2Tri18Conc = 99;
var maxVar3Tri18_2Tri18Conc = 0;

function CorVar3Tri18_2Tri18Conc(d) {
    return d === null ? '#808080':
        d >= 5  ? '#8c0303' :
        d >= 3  ? '#de1f35' :
        d >= 1.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
                ''  ;
}

var legendaVar3Tri18_2Tri18Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2018 e o 2º trimestre de 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  3 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  1.5 a 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 1.5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar3Tri18_2Tri18Conc(feature) {
    if(feature.properties.Var3T2T_18 <= minVar3Tri18_2Tri18Conc){
        minVar3Tri18_2Tri18Conc = feature.properties.Var3T2T_18
    }
    if(feature.properties.Var3T2T_18 > maxVar3Tri18_2Tri18Conc){
        maxVar3Tri18_2Tri18Conc = feature.properties.Var3T2T_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri18_2Tri18Conc(feature.properties.Var3T2T_18)};
    }


function apagarVar3Tri18_2Tri18Conc(e) {
    Var3Tri18_2Tri18Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri18_2Tri18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_18.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri18_2Tri18Conc,
    });
}
var Var3Tri18_2Tri18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar3Tri18_2Tri18Conc,
    onEachFeature: onEachFeatureVar3Tri18_2Tri18Conc
});

let slideVar3Tri18_2Tri18Conc = function(){
    var sliderVar3Tri18_2Tri18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri18_2Tri18Conc, {
        start: [minVar3Tri18_2Tri18Conc, maxVar3Tri18_2Tri18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri18_2Tri18Conc,
            'max': maxVar3Tri18_2Tri18Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri18_2Tri18Conc);
    inputNumberMax.setAttribute("value",maxVar3Tri18_2Tri18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri18_2Tri18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri18_2Tri18Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri18_2Tri18Conc.noUiSlider.on('update',function(e){
        Var3Tri18_2Tri18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri18_2Tri18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderVar3Tri18_2Tri18Conc.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri18_2Tri18Conc);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2018 E 2 Trimestre 2018 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2018 E 3 Trimestre 2018 POR CONCELHOS -------------------////

var minVar4Tri18_3Tri18Conc = 0;
var maxVar4Tri18_3Tri18Conc = 0;

function CorVar4Tri18_3Tri18Conc(d) {
    return d === null ? '#808080':
        d >= 6  ? '#8c0303' :
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -1.45  ? '#9eaad7' :
                ''  ;
}

var legendaVar4Tri18_3Tri18Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2018 e o 3º trimestre de 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  4 a 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -1.45 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4Tri18_3Tri18Conc(feature) {
    if(feature.properties.Var4T3T_18 <= minVar4Tri18_3Tri18Conc || minVar4Tri18_3Tri18Conc ===0){
        minVar4Tri18_3Tri18Conc = feature.properties.Var4T3T_18
    }
    if(feature.properties.Var4T3T_18 > maxVar4Tri18_3Tri18Conc){
        maxVar4Tri18_3Tri18Conc = feature.properties.Var4T3T_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri18_3Tri18Conc(feature.properties.Var4T3T_18)};
    }


function apagarVar4Tri18_3Tri18Conc(e) {
    Var4Tri18_3Tri18Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri18_3Tri18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_18.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri18_3Tri18Conc,
    });
}
var Var4Tri18_3Tri18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar4Tri18_3Tri18Conc,
    onEachFeature: onEachFeatureVar4Tri18_3Tri18Conc
});

let slideVar4Tri18_3Tri18Conc = function(){
    var sliderVar4Tri18_3Tri18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri18_3Tri18Conc, {
        start: [minVar4Tri18_3Tri18Conc, maxVar4Tri18_3Tri18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri18_3Tri18Conc,
            'max': maxVar4Tri18_3Tri18Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri18_3Tri18Conc);
    inputNumberMax.setAttribute("value",maxVar4Tri18_3Tri18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri18_3Tri18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri18_3Tri18Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri18_3Tri18Conc.noUiSlider.on('update',function(e){
        Var4Tri18_3Tri18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri18_3Tri18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderVar4Tri18_3Tri18Conc.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri18_3Tri18Conc);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2018 E 3 Trimestre 2018 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 1 Trimestre 2019 E 4 Trimestre 2018 POR CONCELHOS -------------------////

var minVar1Tri19_4Tri18Conc = 0;
var maxVar1Tri19_4Tri18Conc = 0;

function CorVar1Tri19_4Tri18Conc(d) {
    return d === null ? '#808080':
        d >= 6  ? '#8c0303' :
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -7  ? '#9eaad7' :
                ''  ;
}

var legendaVar1Tri19_4Tri18Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 1º trimestre de 2019 e o 4º trimestre de 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  4 a 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -6.94 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Tri19_4Tri18Conc(feature) {
    if(feature.properties.Var1T4T_19 <= minVar1Tri19_4Tri18Conc || minVar1Tri19_4Tri18Conc ===0){
        minVar1Tri19_4Tri18Conc = feature.properties.Var1T4T_19
    }
    if(feature.properties.Var1T4T_19 > maxVar1Tri19_4Tri18Conc){
        maxVar1Tri19_4Tri18Conc = feature.properties.Var1T4T_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Tri19_4Tri18Conc(feature.properties.Var1T4T_19)};
    }


function apagarVar1Tri19_4Tri18Conc(e) {
    Var1Tri19_4Tri18Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Tri19_4Tri18Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1T4T_19.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Tri19_4Tri18Conc,
    });
}
var Var1Tri19_4Tri18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar1Tri19_4Tri18Conc,
    onEachFeature: onEachFeatureVar1Tri19_4Tri18Conc
});

let slideVar1Tri19_4Tri18Conc = function(){
    var sliderVar1Tri19_4Tri18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Tri19_4Tri18Conc, {
        start: [minVar1Tri19_4Tri18Conc, maxVar1Tri19_4Tri18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Tri19_4Tri18Conc,
            'max': maxVar1Tri19_4Tri18Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar1Tri19_4Tri18Conc);
    inputNumberMax.setAttribute("value",maxVar1Tri19_4Tri18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Tri19_4Tri18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Tri19_4Tri18Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar1Tri19_4Tri18Conc.noUiSlider.on('update',function(e){
        Var1Tri19_4Tri18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var1T4T_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1T4T_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Tri19_4Tri18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderVar1Tri19_4Tri18Conc.noUiSlider;
    $(slidersGeral).append(sliderVar1Tri19_4Tri18Conc);
} 

///////////////////////////// Fim da Variação 1 Trimestre 2019 E 4 Trimestre 2018 POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação 2 Trimestre 2019 E 1 Trimestre 2019 POR CONCELHOS -------------------////

var minVar2Tri19_1Tri19Conc = 0;
var maxVar2Tri19_1Tri19Conc = 0;

function CorVar2Tri19_1Tri19Conc(d) {
    return d === null ? '#808080':
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -8  ? '#2288bf' :
                ''  ;
}

var legendaVar2Tri19_1Tri19Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2019 e o 1º trimestre de 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -7.95 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar2Tri19_1Tri19Conc(feature) {
    if(feature.properties.Var2T1T_19 <= minVar2Tri19_1Tri19Conc || minVar2Tri19_1Tri19Conc ===0){
        minVar2Tri19_1Tri19Conc = feature.properties.Var2T1T_19
    }
    if(feature.properties.Var2T1T_19 > maxVar2Tri19_1Tri19Conc){
        maxVar2Tri19_1Tri19Conc = feature.properties.Var2T1T_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri19_1Tri19Conc(feature.properties.Var2T1T_19)};
    }


function apagarVar2Tri19_1Tri19Conc(e) {
    Var2Tri19_1Tri19Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri19_1Tri19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_19.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri19_1Tri19Conc,
    });
}
var Var2Tri19_1Tri19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2Tri19_1Tri19Conc,
    onEachFeature: onEachFeatureVar2Tri19_1Tri19Conc
});

let slideVar2Tri19_1Tri19Conc = function(){
    var sliderVar2Tri19_1Tri19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri19_1Tri19Conc, {
        start: [minVar2Tri19_1Tri19Conc, maxVar2Tri19_1Tri19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri19_1Tri19Conc,
            'max': maxVar2Tri19_1Tri19Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri19_1Tri19Conc);
    inputNumberMax.setAttribute("value",maxVar2Tri19_1Tri19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri19_1Tri19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri19_1Tri19Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri19_1Tri19Conc.noUiSlider.on('update',function(e){
        Var2Tri19_1Tri19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri19_1Tri19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderVar2Tri19_1Tri19Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri19_1Tri19Conc);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2019 E 1 Trimestre 2019 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2019 E 2 Trimestre 2019 POR CONCELHOS -------------------////

var minVar3Tri19_2Tri19Conc = 0;
var maxVar3Tri19_2Tri19Conc = 0;


function CorVar3Tri19_2Tri19Conc(d) {
    return d === null ? '#808080':
        d >= 6  ? '#8c0303' :
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2  ? '#9eaad7' :
                ''  ;
}

var legendaVar3Tri19_2Tri19Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2019 e o 2º trimestre de 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  4 a 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -1.95 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar3Tri19_2Tri19Conc(feature) {
    if(feature.properties.Var3T2T_19 <= minVar3Tri19_2Tri19Conc || minVar3Tri19_2Tri19Conc ===0){
        minVar3Tri19_2Tri19Conc = feature.properties.Var3T2T_19
    }
    if(feature.properties.Var3T2T_19 > maxVar3Tri19_2Tri19Conc){
        maxVar3Tri19_2Tri19Conc = feature.properties.Var3T2T_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri19_2Tri19Conc(feature.properties.Var2T1T_19)};
    }


function apagarVar3Tri19_2Tri19Conc(e) {
    Var3Tri19_2Tri19Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri19_2Tri19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_19.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri19_2Tri19Conc,
    });
}
var Var3Tri19_2Tri19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar3Tri19_2Tri19Conc,
    onEachFeature: onEachFeatureVar3Tri19_2Tri19Conc
});

let slideVar3Tri19_2Tri19Conc = function(){
    var sliderVar3Tri19_2Tri19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri19_2Tri19Conc, {
        start: [minVar3Tri19_2Tri19Conc, maxVar3Tri19_2Tri19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri19_2Tri19Conc,
            'max': maxVar3Tri19_2Tri19Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri19_2Tri19Conc);
    inputNumberMax.setAttribute("value",maxVar3Tri19_2Tri19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri19_2Tri19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri19_2Tri19Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri19_2Tri19Conc.noUiSlider.on('update',function(e){
        Var3Tri19_2Tri19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri19_2Tri19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderVar3Tri19_2Tri19Conc.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri19_2Tri19Conc);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2019 E 2 Trimestre 2019 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2019 E 3 Trimestre 2019 POR CONCELHOS -------------------////

var minVar4Tri19_3Tri19Conc = 0;
var maxVar4Tri19_3Tri19Conc = 0;

function CorVar4Tri19_3Tri19Conc(d) {
    return d === null ? '#808080':
        d >= 6  ? '#8c0303' :
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2.7  ? '#9eaad7' :
                ''  ;
}

var legendaVar4Tri19_3Tri19Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2019 e o 3º trimestre de 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  4 a 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2.63 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4Tri19_3Tri19Conc(feature) {
    if(feature.properties.Var4T3T_19 <= minVar4Tri19_3Tri19Conc || minVar4Tri19_3Tri19Conc ===0){
        minVar4Tri19_3Tri19Conc = feature.properties.Var4T3T_19
    }
    if(feature.properties.Var4T3T_19 > maxVar4Tri19_3Tri19Conc){
        maxVar4Tri19_3Tri19Conc = feature.properties.Var4T3T_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri19_3Tri19Conc(feature.properties.Var4T3T_19)};
    }


function apagarVar4Tri19_3Tri19Conc(e) {
    Var4Tri19_3Tri19Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri19_3Tri19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_19.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri19_3Tri19Conc,
    });
}
var Var4Tri19_3Tri19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar4Tri19_3Tri19Conc,
    onEachFeature: onEachFeatureVar4Tri19_3Tri19Conc
});

let slideVar4Tri19_3Tri19Conc = function(){
    var sliderVar4Tri19_3Tri19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri19_3Tri19Conc, {
        start: [minVar4Tri19_3Tri19Conc, maxVar4Tri19_3Tri19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri19_3Tri19Conc,
            'max': maxVar4Tri19_3Tri19Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri19_3Tri19Conc);
    inputNumberMax.setAttribute("value",maxVar4Tri19_3Tri19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri19_3Tri19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri19_3Tri19Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri19_3Tri19Conc.noUiSlider.on('update',function(e){
        Var4Tri19_3Tri19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri19_3Tri19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderVar4Tri19_3Tri19Conc.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri19_3Tri19Conc);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2019 E 3 Trimestre 2019 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 1 Trimestre 2020 E 4 Trimestre 2019 POR CONCELHOS -------------------////

var minVar1Tri20_4Tri19Conc = 0;
var maxVar1Tri20_4Tri19Conc = 0;

function CorVar1Tri20_4Tri19Conc(d) {
    return d === null ? '#808080':
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2  ? '#9eaad7' :
        d >= -4  ? '#2288bf' :
                ''  ;
}

var legendaVar1Tri20_4Tri19Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 1º trimestre de 2020 e o 4º trimestre de 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -3.63 a -2' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar1Tri20_4Tri19Conc(feature) {
    if(feature.properties.Var1T4T_20 <= minVar1Tri20_4Tri19Conc || minVar1Tri20_4Tri19Conc ===0){
        minVar1Tri20_4Tri19Conc = feature.properties.Var1T4T_20
    }
    if(feature.properties.Var1T4T_20 > maxVar1Tri20_4Tri19Conc){
        maxVar1Tri20_4Tri19Conc = feature.properties.Var1T4T_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Tri20_4Tri19Conc(feature.properties.Var1T4T_20)};
    }


function apagarVar1Tri20_4Tri19Conc(e) {
    Var1Tri20_4Tri19Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Tri20_4Tri19Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1T4T_20.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Tri20_4Tri19Conc,
    });
}
var Var1Tri20_4Tri19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar1Tri20_4Tri19Conc,
    onEachFeature: onEachFeatureVar1Tri20_4Tri19Conc
});

let slideVar1Tri20_4Tri19Conc = function(){
    var sliderVar1Tri20_4Tri19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Tri20_4Tri19Conc, {
        start: [minVar1Tri20_4Tri19Conc, maxVar1Tri20_4Tri19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Tri20_4Tri19Conc,
            'max': maxVar1Tri20_4Tri19Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar1Tri20_4Tri19Conc);
    inputNumberMax.setAttribute("value",maxVar1Tri20_4Tri19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Tri20_4Tri19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Tri20_4Tri19Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar1Tri20_4Tri19Conc.noUiSlider.on('update',function(e){
        Var1Tri20_4Tri19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var1T4T_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1T4T_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Tri20_4Tri19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderVar1Tri20_4Tri19Conc.noUiSlider;
    $(slidersGeral).append(sliderVar1Tri20_4Tri19Conc);
} 

///////////////////////////// Fim da Variação 1 Trimestre 2020 E 4 Trimestre 2019 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2 Trimestre 2020 E 1 Trimestre 2020 POR CONCELHOS -------------------////

var minVar2Tri20_1Tri20Conc = 0;
var maxVar2Tri20_1Tri20Conc = 0;

function CorVar2Tri20_1Tri20Conc(d) {
    return d === null ? '#808080':
        d >= 5  ? '#8c0303' :
        d >= 3  ? '#de1f35' :
        d >= 1.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
                ''  ;
}

var legendaVar2Tri20_1Tri20Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2020 e o 1º trimestre de 2020, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  3 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  1.5 a 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 1.5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Tri20_1Tri20Conc(feature) {
    if(feature.properties.Var2T1T_20 <= minVar2Tri20_1Tri20Conc || minVar2Tri20_1Tri20Conc ===0){
        minVar2Tri20_1Tri20Conc = feature.properties.Var2T1T_20
    }
    if(feature.properties.Var2T1T_20 > maxVar2Tri20_1Tri20Conc){
        maxVar2Tri20_1Tri20Conc = feature.properties.Var2T1T_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri20_1Tri20Conc(feature.properties.Var2T1T_20)};
    }


function apagarVar2Tri20_1Tri20Conc(e) {
    Var2Tri20_1Tri20Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri20_1Tri20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_20.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri20_1Tri20Conc,
    });
}
var Var2Tri20_1Tri20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2Tri20_1Tri20Conc,
    onEachFeature: onEachFeatureVar2Tri20_1Tri20Conc
});

let slideVar2Tri20_1Tri20Conc = function(){
    var sliderVar2Tri20_1Tri20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri20_1Tri20Conc, {
        start: [minVar2Tri20_1Tri20Conc, maxVar2Tri20_1Tri20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri20_1Tri20Conc,
            'max': maxVar2Tri20_1Tri20Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri20_1Tri20Conc);
    inputNumberMax.setAttribute("value",maxVar2Tri20_1Tri20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri20_1Tri20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri20_1Tri20Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri20_1Tri20Conc.noUiSlider.on('update',function(e){
        Var2Tri20_1Tri20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri20_1Tri20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderVar2Tri20_1Tri20Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri20_1Tri20Conc);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2020 E 1 Trimestre 2020 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2020 E 2 Trimestre 2020 POR CONCELHOS -------------------////

var minVar3Tri20_2Tri20Conc = 0;
var maxVar3Tri20_2Tri20Conc = 0;

function CorVar3Tri20_2Tri20Conc(d) {
    return d === null ? '#808080':
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#ff5e6e' :
        d >= -1  ? '#9eaad7' :
                ''  ;
}

var legendaVar3Tri20_2Tri20Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2020 e o 2º trimestre de 2020, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -1 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar3Tri20_2Tri20Conc(feature) {
    if(feature.properties.Var3T2T_20 <= minVar3Tri20_2Tri20Conc || minVar3Tri20_2Tri20Conc ===0){
        minVar3Tri20_2Tri20Conc = feature.properties.Var3T2T_20
    }
    if(feature.properties.Var3T2T_20 > maxVar3Tri20_2Tri20Conc){
        maxVar3Tri20_2Tri20Conc = feature.properties.Var3T2T_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri20_2Tri20Conc(feature.properties.Var3T2T_20)};
    }


function apagarVar3Tri20_2Tri20Conc(e) {
    Var3Tri20_2Tri20Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri20_2Tri20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_20.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri20_2Tri20Conc,
    });
}
var Var3Tri20_2Tri20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar3Tri20_2Tri20Conc,
    onEachFeature: onEachFeatureVar3Tri20_2Tri20Conc
});

let slideVar3Tri20_2Tri20Conc = function(){
    var sliderVar3Tri20_2Tri20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri20_2Tri20Conc, {
        start: [minVar3Tri20_2Tri20Conc, maxVar3Tri20_2Tri20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri20_2Tri20Conc,
            'max': maxVar3Tri20_2Tri20Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri20_2Tri20Conc);
    inputNumberMax.setAttribute("value",maxVar3Tri20_2Tri20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri20_2Tri20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri20_2Tri20Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri20_2Tri20Conc.noUiSlider.on('update',function(e){
        Var3Tri20_2Tri20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri20_2Tri20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderVar3Tri20_2Tri20Conc.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri20_2Tri20Conc);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2020 E 2 Trimestre 2020 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2020 E 3 Trimestre 2020 POR CONCELHOS -------------------////

var minVar4Tri20_3Tri20Conc = 0;
var maxVar4Tri20_3Tri20Conc = 0;

function CorVar4Tri20_3Tri20Conc(d) {
    return d === null ? '#808080':
        d >= 5  ? '#de1f35' :
        d >= 3  ? '#ff5e6e' :
        d >= 0  ? '#ff5e6e' :
        d >= -5  ? '#9eaad7' :
        d >= -7  ? '#2288bf' :
                ''  ;
}

var legendaVar4Tri20_3Tri20Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2020 e o 3º trimestre de 2020, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  3 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -6.62 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar4Tri20_3Tri20Conc(feature) {
    if(feature.properties.Var4T3T_20 <= minVar4Tri20_3Tri20Conc || minVar4Tri20_3Tri20Conc ===0){
        minVar4Tri20_3Tri20Conc = feature.properties.Var4T3T_20
    }
    if(feature.properties.Var4T3T_20 > maxVar4Tri20_3Tri20Conc){
        maxVar4Tri20_3Tri20Conc = feature.properties.Var4T3T_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri20_3Tri20Conc(feature.properties.Var4T3T_20)};
    }


function apagarVar4Tri20_3Tri20Conc(e) {
    Var4Tri20_3Tri20Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri20_3Tri20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_20.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri20_3Tri20Conc,
    });
}
var Var4Tri20_3Tri20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar4Tri20_3Tri20Conc,
    onEachFeature: onEachFeatureVar4Tri20_3Tri20Conc
});

let slideVar4Tri20_3Tri20Conc = function(){
    var sliderVar4Tri20_3Tri20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri20_3Tri20Conc, {
        start: [minVar4Tri20_3Tri20Conc, maxVar4Tri20_3Tri20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri20_3Tri20Conc,
            'max': maxVar4Tri20_3Tri20Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri20_3Tri20Conc);
    inputNumberMax.setAttribute("value",maxVar4Tri20_3Tri20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri20_3Tri20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri20_3Tri20Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri20_3Tri20Conc.noUiSlider.on('update',function(e){
        Var4Tri20_3Tri20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri20_3Tri20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderVar4Tri20_3Tri20Conc.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri20_3Tri20Conc);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2020 E 3 Trimestre 2020 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 1 Trimestre 2021 E 4 Trimestre 2020 POR CONCELHOS -------------------////

var minVar1Tri21_4Tri20Conc = 0;
var maxVar1Tri21_4Tri20Conc = 0;

function CorVar1Tri21_4Tri20Conc(d) {
    return d === null ? '#808080':
        d >= 5  ? '#8c0303' :
        d >= 3  ? '#de1f35' :
        d >= 1.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
                ''  ;
}

var legendaVar1Tri21_4Tri20Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 1º trimestre de 2021 e o 4º trimestre de 2020, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  3 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  1.5 a 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0.74 a 1.5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Tri21_4Tri20Conc(feature) {
    if(feature.properties.Var1T4T_21 <= minVar1Tri21_4Tri20Conc || minVar1Tri21_4Tri20Conc ===0){
        minVar1Tri21_4Tri20Conc = feature.properties.Var1T4T_21
    }
    if(feature.properties.Var1T4T_21 > maxVar1Tri21_4Tri20Conc){
        maxVar1Tri21_4Tri20Conc = feature.properties.Var1T4T_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Tri21_4Tri20Conc(feature.properties.Var1T4T_21)};
    }


function apagarVar1Tri21_4Tri20Conc(e) {
    Var1Tri21_4Tri20Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Tri21_4Tri20Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1T4T_21.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Tri21_4Tri20Conc,
    });
}
var Var1Tri21_4Tri20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar1Tri21_4Tri20Conc,
    onEachFeature: onEachFeatureVar1Tri21_4Tri20Conc
});

let slideVar1Tri21_4Tri20Conc = function(){
    var sliderVar1Tri21_4Tri20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Tri21_4Tri20Conc, {
        start: [minVar1Tri21_4Tri20Conc, maxVar1Tri21_4Tri20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Tri21_4Tri20Conc,
            'max': maxVar1Tri21_4Tri20Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar1Tri21_4Tri20Conc);
    inputNumberMax.setAttribute("value",maxVar1Tri21_4Tri20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Tri21_4Tri20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Tri21_4Tri20Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar1Tri21_4Tri20Conc.noUiSlider.on('update',function(e){
        Var1Tri21_4Tri20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var1T4T_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1T4T_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Tri21_4Tri20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderVar1Tri21_4Tri20Conc.noUiSlider;
    $(slidersGeral).append(sliderVar1Tri21_4Tri20Conc);
} 

///////////////////////////// Fim da Variação 1 Trimestre 2021 E 4 Trimestre 2020 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2 Trimestre 2021 E 1 Trimestre 2021 POR CONCELHOS -------------------////

var minVar2Tri21_1Tri21Conc = 0;
var maxVar2Tri21_1Tri21Conc = 0;

function CorVar2Tri21_1Tri21Conc(d) {
    return d === null ? '#808080':
        d >= 3  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 1  ? '#f5b3be' :
        d >= 0   ? '#9eaad7' :
        d >= -6  ? '#2288bf' :
                ''  ;
}

var legendaVar2Tri21_1Tri21Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2021 e o 1º trimestre de 2021, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  1 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  0 a 1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -5.78 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar2Tri21_1Tri21Conc(feature) {
    if(feature.properties.Var2T1T_21 <= minVar2Tri21_1Tri21Conc || minVar2Tri21_1Tri21Conc ===0){
        minVar2Tri21_1Tri21Conc = feature.properties.Var2T1T_21
    }
    if(feature.properties.Var2T1T_21 > maxVar2Tri21_1Tri21Conc){
        maxVar2Tri21_1Tri21Conc = feature.properties.Var2T1T_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri21_1Tri21Conc(feature.properties.Var2T1T_21)};
    }


function apagarVar2Tri21_1Tri21Conc(e) {
    Var2Tri21_1Tri21Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri21_1Tri21Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_21.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri21_1Tri21Conc,
    });
}
var Var2Tri21_1Tri21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2Tri21_1Tri21Conc,
    onEachFeature: onEachFeatureVar2Tri21_1Tri21Conc
});

let slideVar2Tri21_1Tri21Conc = function(){
    var sliderVar2Tri21_1Tri21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri21_1Tri21Conc, {
        start: [minVar2Tri21_1Tri21Conc, maxVar2Tri21_1Tri21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri21_1Tri21Conc,
            'max': maxVar2Tri21_1Tri21Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri21_1Tri21Conc);
    inputNumberMax.setAttribute("value",maxVar2Tri21_1Tri21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri21_1Tri21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri21_1Tri21Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri21_1Tri21Conc.noUiSlider.on('update',function(e){
        Var2Tri21_1Tri21Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri21_1Tri21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderVar2Tri21_1Tri21Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri21_1Tri21Conc);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2021 E 1 Trimestre 2021 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2021 E 2 Trimestre 2021 POR CONCELHOS -------------------////

var minVar3Tri21_2Tri21Conc = 0;
var maxVar3Tri21_2Tri21Conc = 0;

function CorVar3Tri21_2Tri21Conc(d) {
    return d === null ? '#808080':
        d >= 9  ? '#8c0303' :
        d >= 5  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -5.72  ? '#9eaad7' :
                ''  ;
}

var legendaVar3Tri21_2Tri21Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2021 e o 2º trimestre de 2021, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 9' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  5 a 9' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5.71 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar3Tri21_2Tri21Conc(feature) {
    if(feature.properties.Var3T2T_21 <= minVar3Tri21_2Tri21Conc || minVar3Tri21_2Tri21Conc ===0){
        minVar3Tri21_2Tri21Conc = feature.properties.Var3T2T_21
    }
    if(feature.properties.Var3T2T_21 > maxVar3Tri21_2Tri21Conc){
        maxVar3Tri21_2Tri21Conc = feature.properties.Var3T2T_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri21_2Tri21Conc(feature.properties.Var3T2T_21)};
    }


function apagarVar3Tri21_2Tri21Conc(e) {
    Var3Tri21_2Tri21Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri21_2Tri21Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_21.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri21_2Tri21Conc,
    });
}
var Var3Tri21_2Tri21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar3Tri21_2Tri21Conc,
    onEachFeature: onEachFeatureVar3Tri21_2Tri21Conc
});

let slideVar3Tri21_2Tri21Conc = function(){
    var sliderVar3Tri21_2Tri21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri21_2Tri21Conc, {
        start: [minVar3Tri21_2Tri21Conc, maxVar3Tri21_2Tri21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri21_2Tri21Conc,
            'max': maxVar3Tri21_2Tri21Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri21_2Tri21Conc);
    inputNumberMax.setAttribute("value",maxVar3Tri21_2Tri21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri21_2Tri21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri21_2Tri21Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri21_2Tri21Conc.noUiSlider.on('update',function(e){
        Var3Tri21_2Tri21Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri21_2Tri21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderVar3Tri21_2Tri21Conc.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri21_2Tri21Conc);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2021 E 2 Trimestre 2021 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2021 E 3 Trimestre 2021 POR CONCELHOS -------------------////

var minVar4Tri21_3Tri21Conc = 0;
var maxVar4Tri21_3Tri21Conc = 0;

function CorVar4Tri21_3Tri21Conc(d) {
    return d === null ? '#808080':
        d >= 6  ? '#8c0303' :
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0   ? '#f5b3be' :
        d >= -7  ? '#9eaad7' :
                ''  ;
}

var legendaVar4Tri21_3Tri21Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2021 e o 3º trimestre de 2021, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  4 a 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -6.95 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4Tri21_3Tri21Conc(feature) {
    if(feature.properties.Var4T3T_21 <= minVar4Tri21_3Tri21Conc || minVar4Tri21_3Tri21Conc ===0){
        minVar4Tri21_3Tri21Conc = feature.properties.Var4T3T_21
    }
    if(feature.properties.Var4T3T_21 > maxVar4Tri21_3Tri21Conc){
        maxVar4Tri21_3Tri21Conc = feature.properties.Var4T3T_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri21_3Tri21Conc(feature.properties.Var4T3T_21)};
    }


function apagarVar4Tri21_3Tri21Conc(e) {
    Var4Tri21_3Tri21Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri21_3Tri21Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_21.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri21_3Tri21Conc,
    });
}
var Var4Tri21_3Tri21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar4Tri21_3Tri21Conc,
    onEachFeature: onEachFeatureVar4Tri21_3Tri21Conc
});

let slideVar4Tri21_3Tri21Conc = function(){
    var sliderVar4Tri21_3Tri21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 90){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri21_3Tri21Conc, {
        start: [minVar4Tri21_3Tri21Conc, maxVar4Tri21_3Tri21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri21_3Tri21Conc,
            'max': maxVar4Tri21_3Tri21Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri21_3Tri21Conc);
    inputNumberMax.setAttribute("value",maxVar4Tri21_3Tri21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri21_3Tri21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri21_3Tri21Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri21_3Tri21Conc.noUiSlider.on('update',function(e){
        Var4Tri21_3Tri21Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri21_3Tri21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 90;
    sliderAtivo = sliderVar4Tri21_3Tri21Conc.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri21_3Tri21Conc);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2021 E 3 Trimestre 2021 POR CONCELHOS -------------- \\\\\

///////////////////////////////////////----------------------- FIM CONCELHOS------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////------------------- 1 TRIMESTRE 2016 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco1TrimestreFreg16 = 999;
var maxPreco1TrimestreFreg16 = 0;

function CorPerPrecosVendasFreg(d) {
    return d == null ? '#808080' :
        d >= 2728 ? '#8c0303' :
        d >= 2295  ? '#de1f35' :
        d >= 1574 ? '#ff5e6e' :
        d >= 852   ? '#f5b3be' :
        d >= 131   ? '#F2C572' :
                ''  ;
}
var legendaPerPrecosVendasFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: €/m²' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 2728' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 2295 a 2728' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 1574 a 2295' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 852 a 1574' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 131 a 852' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'




    $(legendaA).append(symbolsContainer); 
}

function EstiloPreco1TrimestreFreg16(feature) {
    if((feature.properties.F1Trim16 <= minPreco1TrimestreFreg16 && feature.properties.F1Trim16 > null) || feature.properties.F1Trim16 === 0){
        minPreco1TrimestreFreg16 = feature.properties.F1Trim16
    }
    if(feature.properties.F1Trim16 >= maxPreco1TrimestreFreg16 ){
        maxPreco1TrimestreFreg16 = feature.properties.F1Trim16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F1Trim16)
    };
}
function apagarPreco1TrimestreFreg16(e) {
    Preco1TrimestreFreg16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1TrimestreFreg16(feature, layer) {
    if(feature.properties.F1Trim16 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim16.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1TrimestreFreg16,
    });
}
var Preco1TrimestreFreg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco1TrimestreFreg16,
    onEachFeature: onEachFeaturePreco1TrimestreFreg16
});
let slidePreco1TrimestreFreg16 = function(){
    var sliderPreco1TrimestreFreg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1TrimestreFreg16, {
        start: [minPreco1TrimestreFreg16, maxPreco1TrimestreFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1TrimestreFreg16,
            'max': maxPreco1TrimestreFreg16
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1TrimestreFreg16);
    inputNumberMax.setAttribute("value",maxPreco1TrimestreFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1TrimestreFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1TrimestreFreg16.noUiSlider.set([null, this.value]);
    });

    sliderPreco1TrimestreFreg16.noUiSlider.on('update',function(e){
        Preco1TrimestreFreg16.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim16 == null){
                return false
            }
            if(layer.feature.properties.F1Trim16.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim16.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1TrimestreFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderPreco1TrimestreFreg16.noUiSlider;
    $(slidersGeral).append(sliderPreco1TrimestreFreg16);
} 

 
//////////////////////--------- Fim 1 TRIMESTRE 2016   -------------- \\\\\\

/////////////////////------------------- 2 TRIMESTRE 2016 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco2TrimestreFreg16 = 998;
var maxPreco2TrimestreFreg16 = 0;

function EstiloPreco2TrimestreFreg16(feature) {
    if((feature.properties.F2Trim16 <= minPreco2TrimestreFreg16 && feature.properties.F2Trim16 > null) || feature.properties.F2Trim16 === 0){
        minPreco2TrimestreFreg16 = feature.properties.F2Trim16
    }
    if(feature.properties.F2Trim16 >= maxPreco2TrimestreFreg16 ){
        maxPreco2TrimestreFreg16 = feature.properties.F2Trim16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F2Trim16)
    };
}
function apagarPreco2TrimestreFreg16(e) {
    Preco2TrimestreFreg16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2TrimestreFreg16(feature, layer) {
    if(feature.properties.F2Trim16 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim16.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2TrimestreFreg16,
    });
}
var Preco2TrimestreFreg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco2TrimestreFreg16,
    onEachFeature: onEachFeaturePreco2TrimestreFreg16
});
let slidePreco2TrimestreFreg16 = function(){
    var sliderPreco2TrimestreFreg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2TrimestreFreg16, {
        start: [minPreco2TrimestreFreg16, maxPreco2TrimestreFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2TrimestreFreg16,
            'max': maxPreco2TrimestreFreg16
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2TrimestreFreg16);
    inputNumberMax.setAttribute("value",maxPreco2TrimestreFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2TrimestreFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2TrimestreFreg16.noUiSlider.set([null, this.value]);
    });

    sliderPreco2TrimestreFreg16.noUiSlider.on('update',function(e){
        Preco2TrimestreFreg16.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim16 == null){
                return false
            }
            if(layer.feature.properties.F2Trim16.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim16.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2TrimestreFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderPreco2TrimestreFreg16.noUiSlider;
    $(slidersGeral).append(sliderPreco2TrimestreFreg16);
} 

 
//////////////////////--------- Fim 2 TRIMESTRE 2016   -------------- \\\\\\

/////////////////////------------------- 3 TRIMESTRE 2016 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco3TrimestreFreg16 = 999;
var maxPreco3TrimestreFreg16 = 0;

function EstiloPreco3TrimestreFreg16(feature) {
    if((feature.properties.F3Trim16 <= minPreco3TrimestreFreg16 && feature.properties.F3Trim16 > null) || feature.properties.F3Trim16 === 0){
        minPreco3TrimestreFreg16 = feature.properties.F3Trim16
    }
    if(feature.properties.F3Trim16 >= maxPreco3TrimestreFreg16 ){
        maxPreco3TrimestreFreg16 = feature.properties.F3Trim16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F3Trim16)
    };
}
function apagarPreco3TrimestreFreg16(e) {
    Preco3TrimestreFreg16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3TrimestreFreg16(feature, layer) {
    if(feature.properties.F3Trim16 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim16.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3TrimestreFreg16,
    });
}
var Preco3TrimestreFreg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco3TrimestreFreg16,
    onEachFeature: onEachFeaturePreco3TrimestreFreg16
});
let slidePreco3TrimestreFreg16 = function(){
    var sliderPreco3TrimestreFreg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3TrimestreFreg16, {
        start: [minPreco3TrimestreFreg16, maxPreco3TrimestreFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3TrimestreFreg16,
            'max': maxPreco3TrimestreFreg16
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3TrimestreFreg16);
    inputNumberMax.setAttribute("value",maxPreco3TrimestreFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3TrimestreFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3TrimestreFreg16.noUiSlider.set([null, this.value]);
    });

    sliderPreco3TrimestreFreg16.noUiSlider.on('update',function(e){
        Preco3TrimestreFreg16.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim16 == null){
                return false
            }
            if(layer.feature.properties.F3Trim16.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim16.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3TrimestreFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderPreco3TrimestreFreg16.noUiSlider;
    $(slidersGeral).append(sliderPreco3TrimestreFreg16);
} 

 
//////////////////////--------- Fim 3 TRIMESTRE 2016  FREGUESIA  -------------- \\\\\\

/////////////////////------------------- 4 TRIMESTRE 2016 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco4TrimestreFreg16 = 999;
var maxPreco4TrimestreFreg16 = 0;

function EstiloPreco4TrimestreFreg16(feature) {
    if((feature.properties.F4Trim16 <= minPreco4TrimestreFreg16 && feature.properties.F4Trim16 > null) || feature.properties.F4Trim16 === 0){
        minPreco4TrimestreFreg16 = feature.properties.F4Trim16
    }
    if(feature.properties.F4Trim16 >= maxPreco4TrimestreFreg16 ){
        maxPreco4TrimestreFreg16 = feature.properties.F4Trim16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F4Trim16)
    };
}
function apagarPreco4TrimestreFreg16(e) {
    Preco4TrimestreFreg16.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4TrimestreFreg16(feature, layer) {
    if(feature.properties.F4Trim16 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim16.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4TrimestreFreg16,
    });
}
var Preco4TrimestreFreg16= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco4TrimestreFreg16,
    onEachFeature: onEachFeaturePreco4TrimestreFreg16
});
let slidePreco4TrimestreFreg16 = function(){
    var sliderPreco4TrimestreFreg16 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4TrimestreFreg16, {
        start: [minPreco4TrimestreFreg16, maxPreco4TrimestreFreg16],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4TrimestreFreg16,
            'max': maxPreco4TrimestreFreg16
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4TrimestreFreg16);
    inputNumberMax.setAttribute("value",maxPreco4TrimestreFreg16);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4TrimestreFreg16.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4TrimestreFreg16.noUiSlider.set([null, this.value]);
    });

    sliderPreco4TrimestreFreg16.noUiSlider.on('update',function(e){
        Preco4TrimestreFreg16.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim16 == null){
                return false
            }
            if(layer.feature.properties.F4Trim16.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim16.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4TrimestreFreg16.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderPreco4TrimestreFreg16.noUiSlider;
    $(slidersGeral).append(sliderPreco4TrimestreFreg16);
} 

 
//////////////////////------------------------ Fim 4 TRIMESTRE 2016 FREGUESIA   -------------- \\\\\\


/////////////////////------------------- 1 TRIMESTRE 2017 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco1TrimestreFreg17 = 999;
var maxPreco1TrimestreFreg17 = 0;

function EstiloPreco1TrimestreFreg17(feature) {
    if((feature.properties.F1Trim17 <= minPreco1TrimestreFreg17 && feature.properties.F1Trim17 > null) || feature.properties.F1Trim17 === 0){
        minPreco1TrimestreFreg17 = feature.properties.F1Trim17
    }
    if(feature.properties.F1Trim17 >= maxPreco1TrimestreFreg17 ){
        maxPreco1TrimestreFreg17 = feature.properties.F1Trim17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F1Trim17)
    };
}
function apagarPreco1TrimestreFreg17(e) {
    Preco1TrimestreFreg17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1TrimestreFreg17(feature, layer) {
    if(feature.properties.F1Trim17 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim17.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1TrimestreFreg17,
    });
}
var Preco1TrimestreFreg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco1TrimestreFreg17,
    onEachFeature: onEachFeaturePreco1TrimestreFreg17
});
let slidePreco1TrimestreFreg17 = function(){
    var sliderPreco1TrimestreFreg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1TrimestreFreg17, {
        start: [minPreco1TrimestreFreg17, maxPreco1TrimestreFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1TrimestreFreg17,
            'max': maxPreco1TrimestreFreg17
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1TrimestreFreg17);
    inputNumberMax.setAttribute("value",maxPreco1TrimestreFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1TrimestreFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1TrimestreFreg17.noUiSlider.set([null, this.value]);
    });

    sliderPreco1TrimestreFreg17.noUiSlider.on('update',function(e){
        Preco1TrimestreFreg17.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim17 == null){
                return false
            }
            if(layer.feature.properties.F1Trim17.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim17.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1TrimestreFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderPreco1TrimestreFreg17.noUiSlider;
    $(slidersGeral).append(sliderPreco1TrimestreFreg17);
} 

 
//////////////////////------------------------ Fim 1 TRIMESTRE 2017 FREGUESIA   -------------- \\\\\\

/////////////////////------------------- 2 TRIMESTRE 2017 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco2TrimestreFreg17 = 999;
var maxPreco2TrimestreFreg17 = 0;

function EstiloPreco2TrimestreFreg17(feature) {
    if((feature.properties.F2Trim17 <= minPreco2TrimestreFreg17 && feature.properties.F2Trim17 > null) || feature.properties.F2Trim17 === 0){
        minPreco2TrimestreFreg17 = feature.properties.F2Trim17
    }
    if(feature.properties.F2Trim17 >= maxPreco2TrimestreFreg17 ){
        maxPreco2TrimestreFreg17 = feature.properties.F2Trim17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F2Trim17)
    };
}
function apagarPreco2TrimestreFreg17(e) {
    Preco2TrimestreFreg17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2TrimestreFreg17(feature, layer) {
    if(feature.properties.F2Trim17 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim17.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2TrimestreFreg17,
    });
}
var Preco2TrimestreFreg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco2TrimestreFreg17,
    onEachFeature: onEachFeaturePreco2TrimestreFreg17
});
let slidePreco2TrimestreFreg17 = function(){
    var sliderPreco2TrimestreFreg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2TrimestreFreg17, {
        start: [minPreco2TrimestreFreg17, maxPreco2TrimestreFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2TrimestreFreg17,
            'max': maxPreco2TrimestreFreg17
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2TrimestreFreg17);
    inputNumberMax.setAttribute("value",maxPreco2TrimestreFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2TrimestreFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2TrimestreFreg17.noUiSlider.set([null, this.value]);
    });

    sliderPreco2TrimestreFreg17.noUiSlider.on('update',function(e){
        Preco2TrimestreFreg17.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim17 == null){
                return false
            }
            if(layer.feature.properties.F2Trim17.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim17.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2TrimestreFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderPreco2TrimestreFreg17.noUiSlider;
    $(slidersGeral).append(sliderPreco2TrimestreFreg17);
} 

 
//////////////////////------------------------ Fim 2 TRIMESTRE 2017 FREGUESIA   -------------- \\\\\\

/////////////////////------------------- 3 TRIMESTRE 2017 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco3TrimestreFreg17 = 999;
var maxPreco3TrimestreFreg17 = 0;

function EstiloPreco3TrimestreFreg17(feature) {
    if((feature.properties.F3Trim17 <= minPreco3TrimestreFreg17 && feature.properties.F3Trim17 > null) || feature.properties.F3Trim17 === 0){
        minPreco3TrimestreFreg17 = feature.properties.F3Trim17
    }
    if(feature.properties.F3Trim17 >= maxPreco3TrimestreFreg17 ){
        maxPreco3TrimestreFreg17 = feature.properties.F3Trim17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F3Trim17)
    };
}
function apagarPreco3TrimestreFreg17(e) {
    Preco3TrimestreFreg17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3TrimestreFreg17(feature, layer) {
    if(feature.properties.F3Trim17 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim17.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3TrimestreFreg17,
    });
}
var Preco3TrimestreFreg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco3TrimestreFreg17,
    onEachFeature: onEachFeaturePreco3TrimestreFreg17
});
let slidePreco3TrimestreFreg17 = function(){
    var sliderPreco3TrimestreFreg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3TrimestreFreg17, {
        start: [minPreco3TrimestreFreg17, maxPreco3TrimestreFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3TrimestreFreg17,
            'max': maxPreco3TrimestreFreg17
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3TrimestreFreg17);
    inputNumberMax.setAttribute("value",maxPreco3TrimestreFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3TrimestreFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3TrimestreFreg17.noUiSlider.set([null, this.value]);
    });

    sliderPreco3TrimestreFreg17.noUiSlider.on('update',function(e){
        Preco3TrimestreFreg17.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim17 == null){
                return false
            }
            if(layer.feature.properties.F3Trim17.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim17.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3TrimestreFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderPreco3TrimestreFreg17.noUiSlider;
    $(slidersGeral).append(sliderPreco3TrimestreFreg17);
} 

//////////////////////------------------------ Fim 3 TRIMESTRE 2017 FREGUESIA   -------------- \\\\\\


/////////////////////------------------- 4 TRIMESTRE 2017 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco4TrimestreFreg17 = 999;
var maxPreco4TrimestreFreg17 = 0;

function EstiloPreco4TrimestreFreg17(feature) {
    if((feature.properties.F4Trim17 <= minPreco4TrimestreFreg17 && feature.properties.F4Trim17 > null) || feature.properties.F4Trim17 === 0){
        minPreco4TrimestreFreg17 = feature.properties.F4Trim17
    }
    if(feature.properties.F4Trim17 >= maxPreco4TrimestreFreg17 ){
        maxPreco4TrimestreFreg17 = feature.properties.F4Trim17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F4Trim17)
    };
}
function apagarPreco4TrimestreFreg17(e) {
    Preco4TrimestreFreg17.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4TrimestreFreg17(feature, layer) {
    if(feature.properties.F4Trim17 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim17.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4TrimestreFreg17,
    });
}
var Preco4TrimestreFreg17= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco4TrimestreFreg17,
    onEachFeature: onEachFeaturePreco4TrimestreFreg17
});
let slidePreco4TrimestreFreg17 = function(){
    var sliderPreco4TrimestreFreg17 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4TrimestreFreg17, {
        start: [minPreco4TrimestreFreg17, maxPreco4TrimestreFreg17],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4TrimestreFreg17,
            'max': maxPreco4TrimestreFreg17
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4TrimestreFreg17);
    inputNumberMax.setAttribute("value",maxPreco4TrimestreFreg17);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4TrimestreFreg17.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4TrimestreFreg17.noUiSlider.set([null, this.value]);
    });

    sliderPreco4TrimestreFreg17.noUiSlider.on('update',function(e){
        Preco4TrimestreFreg17.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim17 == null){
                return false
            }
            if(layer.feature.properties.F4Trim17.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim17.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4TrimestreFreg17.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderPreco4TrimestreFreg17.noUiSlider;
    $(slidersGeral).append(sliderPreco4TrimestreFreg17);
} 

//////////////////////------------------------ Fim 4 TRIMESTRE 2017 FREGUESIA   -------------- \\\\\\

/////////////////////------------------- 1 TRIMESTRE 2018 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco1TrimestreFreg18 = 999;
var maxPreco1TrimestreFreg18 = 0;

function EstiloPreco1TrimestreFreg18(feature) {
    if((feature.properties.F1Trim18 <= minPreco1TrimestreFreg18 && feature.properties.F1Trim18 > null) || feature.properties.F1Trim18 === 0){
        minPreco1TrimestreFreg18 = feature.properties.F1Trim18
    }
    if(feature.properties.F1Trim18 >= maxPreco1TrimestreFreg18 ){
        maxPreco1TrimestreFreg18 = feature.properties.F1Trim18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F1Trim18)
    };
}
function apagarPreco1TrimestreFreg18(e) {
    Preco1TrimestreFreg18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1TrimestreFreg18(feature, layer) {
    if(feature.properties.F1Trim18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim18.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1TrimestreFreg18,
    });
}
var Preco1TrimestreFreg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco1TrimestreFreg18,
    onEachFeature: onEachFeaturePreco1TrimestreFreg18
});
let slidePreco1TrimestreFreg18 = function(){
    var sliderPreco1TrimestreFreg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1TrimestreFreg18, {
        start: [minPreco1TrimestreFreg18, maxPreco1TrimestreFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1TrimestreFreg18,
            'max': maxPreco1TrimestreFreg18
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1TrimestreFreg18);
    inputNumberMax.setAttribute("value",maxPreco1TrimestreFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1TrimestreFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1TrimestreFreg18.noUiSlider.set([null, this.value]);
    });

    sliderPreco1TrimestreFreg18.noUiSlider.on('update',function(e){
        Preco1TrimestreFreg18.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim18 == null){
                return false
            }
            if(layer.feature.properties.F1Trim18.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim18.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1TrimestreFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderPreco1TrimestreFreg18.noUiSlider;
    $(slidersGeral).append(sliderPreco1TrimestreFreg18);
} 

//////////////////////------------------------ Fim 1 TRIMESTRE 2018 FREGUESIA   -------------- \\\\\\
/////////////////////------------------- 2 TRIMESTRE 2018 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco2TrimestreFreg18 = 999;
var maxPreco2TrimestreFreg18 = 0;

function EstiloPreco2TrimestreFreg18(feature) {
    if((feature.properties.F2Trim18 <= minPreco2TrimestreFreg18 && feature.properties.F2Trim18 > null) || feature.properties.F2Trim18 === 0){
        minPreco2TrimestreFreg18 = feature.properties.F2Trim18
    }
    if(feature.properties.F2Trim18 >= maxPreco2TrimestreFreg18 ){
        maxPreco2TrimestreFreg18 = feature.properties.F2Trim18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F2Trim18)
    };
}
function apagarPreco2TrimestreFreg18(e) {
    Preco2TrimestreFreg18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2TrimestreFreg18(feature, layer) {
    if(feature.properties.F2Trim18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim18.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2TrimestreFreg18,
    });
}
var Preco2TrimestreFreg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco2TrimestreFreg18,
    onEachFeature: onEachFeaturePreco2TrimestreFreg18
});
let slidePreco2TrimestreFreg18 = function(){
    var sliderPreco2TrimestreFreg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2TrimestreFreg18, {
        start: [minPreco2TrimestreFreg18, maxPreco2TrimestreFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2TrimestreFreg18,
            'max': maxPreco2TrimestreFreg18
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2TrimestreFreg18);
    inputNumberMax.setAttribute("value",maxPreco2TrimestreFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2TrimestreFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2TrimestreFreg18.noUiSlider.set([null, this.value]);
    });

    sliderPreco2TrimestreFreg18.noUiSlider.on('update',function(e){
        Preco2TrimestreFreg18.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim18 == null){
                return false
            }
            if(layer.feature.properties.F2Trim18.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim18.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2TrimestreFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderPreco2TrimestreFreg18.noUiSlider;
    $(slidersGeral).append(sliderPreco2TrimestreFreg18);
} 

//////////////////////------------------------ Fim 2 TRIMESTRE 2018 FREGUESIA   -------------- \\\\\\


/////////////////////------------------- 3 TRIMESTRE 2018 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco3TrimestreFreg18 = 999;
var maxPreco3TrimestreFreg18 = 0;

function EstiloPreco3TrimestreFreg18(feature) {
    if((feature.properties.F3Trim18 <= minPreco3TrimestreFreg18 && feature.properties.F3Trim18 > null) || feature.properties.F3Trim18 === 0){
        minPreco3TrimestreFreg18 = feature.properties.F3Trim18
    }
    if(feature.properties.F3Trim18 >= maxPreco3TrimestreFreg18 ){
        maxPreco3TrimestreFreg18 = feature.properties.F3Trim18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F3Trim18)
    };
}
function apagarPreco3TrimestreFreg18(e) {
    Preco3TrimestreFreg18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3TrimestreFreg18(feature, layer) {
    if(feature.properties.F3Trim18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim18.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3TrimestreFreg18,
    });
}
var Preco3TrimestreFreg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco3TrimestreFreg18,
    onEachFeature: onEachFeaturePreco3TrimestreFreg18
});
let slidePreco3TrimestreFreg18 = function(){
    var sliderPreco3TrimestreFreg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3TrimestreFreg18, {
        start: [minPreco3TrimestreFreg18, maxPreco3TrimestreFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3TrimestreFreg18,
            'max': maxPreco3TrimestreFreg18
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3TrimestreFreg18);
    inputNumberMax.setAttribute("value",maxPreco3TrimestreFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3TrimestreFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3TrimestreFreg18.noUiSlider.set([null, this.value]);
    });

    sliderPreco3TrimestreFreg18.noUiSlider.on('update',function(e){
        Preco3TrimestreFreg18.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim18 == null){
                return false
            }
            if(layer.feature.properties.F3Trim18.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim18.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3TrimestreFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderPreco3TrimestreFreg18.noUiSlider;
    $(slidersGeral).append(sliderPreco3TrimestreFreg18);
} 

//////////////////////------------------------ Fim 3 TRIMESTRE 2018 FREGUESIA   -------------- \\\\\\

/////////////////////------------------- 4 TRIMESTRE 2018 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco4TrimestreFreg18 = 999;
var maxPreco4TrimestreFreg18 = 0;

function EstiloPreco4TrimestreFreg18(feature) {
    if((feature.properties.F4Trim18 <= minPreco4TrimestreFreg18 && feature.properties.F4Trim18 > null) || feature.properties.F4Trim18 === 0){
        minPreco4TrimestreFreg18 = feature.properties.F4Trim18
    }
    if(feature.properties.F4Trim18 >= maxPreco4TrimestreFreg18 ){
        maxPreco4TrimestreFreg18 = feature.properties.F4Trim18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F4Trim18)
    };
}
function apagarPreco4TrimestreFreg18(e) {
    Preco4TrimestreFreg18.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4TrimestreFreg18(feature, layer) {
    if(feature.properties.F4Trim18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim18.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4TrimestreFreg18,
    });
}
var Preco4TrimestreFreg18= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco4TrimestreFreg18,
    onEachFeature: onEachFeaturePreco4TrimestreFreg18
});
let slidePreco4TrimestreFreg18 = function(){
    var sliderPreco4TrimestreFreg18 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4TrimestreFreg18, {
        start: [minPreco4TrimestreFreg18, maxPreco4TrimestreFreg18],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4TrimestreFreg18,
            'max': maxPreco4TrimestreFreg18
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4TrimestreFreg18);
    inputNumberMax.setAttribute("value",maxPreco4TrimestreFreg18);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4TrimestreFreg18.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4TrimestreFreg18.noUiSlider.set([null, this.value]);
    });

    sliderPreco4TrimestreFreg18.noUiSlider.on('update',function(e){
        Preco4TrimestreFreg18.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim18 == null){
                return false
            }
            if(layer.feature.properties.F4Trim18.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim18.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4TrimestreFreg18.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderPreco4TrimestreFreg18.noUiSlider;
    $(slidersGeral).append(sliderPreco4TrimestreFreg18);
} 

//////////////////////------------------------ Fim 4 TRIMESTRE 2018 FREGUESIA   -------------- \\\\\\
/////////////////////------------------- 1 TRIMESTRE 2019 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco1TrimestreFreg19 = 999;
var maxPreco1TrimestreFreg19 = 0;

function EstiloPreco1TrimestreFreg19(feature) {
    if((feature.properties.F1Trim19 <= minPreco1TrimestreFreg19 && feature.properties.F1Trim19 > null) || feature.properties.F1Trim19 === 0){
        minPreco1TrimestreFreg19 = feature.properties.F1Trim19
    }
    if(feature.properties.F1Trim19 >= maxPreco1TrimestreFreg19 ){
        maxPreco1TrimestreFreg19 = feature.properties.F1Trim19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F1Trim19)
    };
}
function apagarPreco1TrimestreFreg19(e) {
    Preco1TrimestreFreg19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1TrimestreFreg19(feature, layer) {
    if(feature.properties.F1Trim19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim19.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1TrimestreFreg19,
    });
}
var Preco1TrimestreFreg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco1TrimestreFreg19,
    onEachFeature: onEachFeaturePreco1TrimestreFreg19
});
let slidePreco1TrimestreFreg19 = function(){
    var sliderPreco1TrimestreFreg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1TrimestreFreg19, {
        start: [minPreco1TrimestreFreg19, maxPreco1TrimestreFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1TrimestreFreg19,
            'max': maxPreco1TrimestreFreg19
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1TrimestreFreg19);
    inputNumberMax.setAttribute("value",maxPreco1TrimestreFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1TrimestreFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1TrimestreFreg19.noUiSlider.set([null, this.value]);
    });

    sliderPreco1TrimestreFreg19.noUiSlider.on('update',function(e){
        Preco1TrimestreFreg19.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim19 == null){
                return false
            }
            if(layer.feature.properties.F1Trim19.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim19.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1TrimestreFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderPreco1TrimestreFreg19.noUiSlider;
    $(slidersGeral).append(sliderPreco1TrimestreFreg19);
} 

//////////////////////------------------------ Fim 1 TRIMESTRE 2019 FREGUESIA   -------------- \\\\

/////////////////////------------------- 2 TRIMESTRE 2019 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco2TrimestreFreg19 = 999;
var maxPreco2TrimestreFreg19 = 0;

function EstiloPreco2TrimestreFreg19(feature) {
    if((feature.properties.F2Trim19 <= minPreco2TrimestreFreg19 && feature.properties.F2Trim19 > null) || feature.properties.F2Trim19 === 0){
        minPreco2TrimestreFreg19 = feature.properties.F2Trim19
    }
    if(feature.properties.F2Trim19 >= maxPreco2TrimestreFreg19 ){
        maxPreco2TrimestreFreg19 = feature.properties.F2Trim19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F2Trim19)
    };
}
function apagarPreco2TrimestreFreg19(e) {
    Preco2TrimestreFreg19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2TrimestreFreg19(feature, layer) {
    if(feature.properties.F2Trim19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim19.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2TrimestreFreg19,
    });
}
var Preco2TrimestreFreg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco2TrimestreFreg19,
    onEachFeature: onEachFeaturePreco2TrimestreFreg19
});
let slidePreco2TrimestreFreg19 = function(){
    var sliderPreco2TrimestreFreg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2TrimestreFreg19, {
        start: [minPreco2TrimestreFreg19, maxPreco2TrimestreFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2TrimestreFreg19,
            'max': maxPreco2TrimestreFreg19
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2TrimestreFreg19);
    inputNumberMax.setAttribute("value",maxPreco2TrimestreFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2TrimestreFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2TrimestreFreg19.noUiSlider.set([null, this.value]);
    });

    sliderPreco2TrimestreFreg19.noUiSlider.on('update',function(e){
        Preco2TrimestreFreg19.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim19 == null){
                return false
            }
            if(layer.feature.properties.F2Trim19.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim19.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2TrimestreFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderPreco2TrimestreFreg19.noUiSlider;
    $(slidersGeral).append(sliderPreco2TrimestreFreg19);
} 

//////////////////////------------------------ Fim 2 TRIMESTRE 2019 FREGUESIA   -------------- \\\\
////////////////////------------------- 3 TRIMESTRE 2019 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minPreco3TrimestreFreg19 = 999;
var maxPreco3TrimestreFreg19 = 0;

function EstiloPreco3TrimestreFreg19(feature) {
    if((feature.properties.F3Trim19 <= minPreco3TrimestreFreg19 && feature.properties.F3Trim19 > null) || feature.properties.F3Trim19 === 0){
        minPreco3TrimestreFreg19 = feature.properties.F3Trim19
    }
    if(feature.properties.F3Trim19 >= maxPreco3TrimestreFreg19 ){
        maxPreco3TrimestreFreg19 = feature.properties.F3Trim19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F3Trim19)
    };
}
function apagarPreco3TrimestreFreg19(e) {
    Preco3TrimestreFreg19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3TrimestreFreg19(feature, layer) {
    if(feature.properties.F3Trim19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim19.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3TrimestreFreg19,
    });
}
var Preco3TrimestreFreg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco3TrimestreFreg19,
    onEachFeature: onEachFeaturePreco3TrimestreFreg19
});
let slidePreco3TrimestreFreg19 = function(){
    var sliderPreco3TrimestreFreg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3TrimestreFreg19, {
        start: [minPreco3TrimestreFreg19, maxPreco3TrimestreFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3TrimestreFreg19,
            'max': maxPreco3TrimestreFreg19
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3TrimestreFreg19);
    inputNumberMax.setAttribute("value",maxPreco3TrimestreFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3TrimestreFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3TrimestreFreg19.noUiSlider.set([null, this.value]);
    });

    sliderPreco3TrimestreFreg19.noUiSlider.on('update',function(e){
        Preco3TrimestreFreg19.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim19 == null){
                return false
            }
            if(layer.feature.properties.F3Trim19.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim19.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3TrimestreFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderPreco3TrimestreFreg19.noUiSlider;
    $(slidersGeral).append(sliderPreco3TrimestreFreg19);
} 

//////////////////////------------------------ Fim 3 TRIMESTRE 2019 FREGUESIA   -------------- \\\\

///////////////////------------------- 4 TRIMESTRE 2019 POR FREGUESIA-----////////////////////////

var minPreco4TrimestreFreg19 = 999;
var maxPreco4TrimestreFreg19 = 0;

function EstiloPreco4TrimestreFreg19(feature) {
    if((feature.properties.F4Trim19 <= minPreco4TrimestreFreg19 && feature.properties.F4Trim19 > null) || feature.properties.F4Trim19 === 0){
        minPreco4TrimestreFreg19 = feature.properties.F4Trim19
    }
    if(feature.properties.F4Trim19 >= maxPreco4TrimestreFreg19 ){
        maxPreco4TrimestreFreg19 = feature.properties.F4Trim19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F4Trim19)
    };
}
function apagarPreco4TrimestreFreg19(e) {
    Preco4TrimestreFreg19.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4TrimestreFreg19(feature, layer) {
    if(feature.properties.F4Trim19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim19.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4TrimestreFreg19,
    });
}
var Preco4TrimestreFreg19= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco4TrimestreFreg19,
    onEachFeature: onEachFeaturePreco4TrimestreFreg19
});
let slidePreco4TrimestreFreg19 = function(){
    var sliderPreco4TrimestreFreg19 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4TrimestreFreg19, {
        start: [minPreco4TrimestreFreg19, maxPreco4TrimestreFreg19],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4TrimestreFreg19,
            'max': maxPreco4TrimestreFreg19
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4TrimestreFreg19);
    inputNumberMax.setAttribute("value",maxPreco4TrimestreFreg19);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4TrimestreFreg19.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4TrimestreFreg19.noUiSlider.set([null, this.value]);
    });

    sliderPreco4TrimestreFreg19.noUiSlider.on('update',function(e){
        Preco4TrimestreFreg19.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim19 == null){
                return false
            }
            if(layer.feature.properties.F4Trim19.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim19.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4TrimestreFreg19.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderPreco4TrimestreFreg19.noUiSlider;
    $(slidersGeral).append(sliderPreco4TrimestreFreg19);
} 

//////////////////////------------------------ Fim 4 TRIMESTRE 2019 FREGUESIA   -------------- \\\\

///////////////////------------------- 1 TRIMESTRE 2020 POR FREGUESIA-----////////////////////////

var minPreco1TrimestreFreg20 = 999;
var maxPreco1TrimestreFreg20 = 0;

function EstiloPreco1TrimestreFreg20(feature) {
    if((feature.properties.F1Trim20 <= minPreco1TrimestreFreg20 && feature.properties.F1Trim20 > null) || feature.properties.F1Trim20 === 0){
        minPreco1TrimestreFreg20 = feature.properties.F1Trim20
    }
    if(feature.properties.F1Trim20 >= maxPreco1TrimestreFreg20 ){
        maxPreco1TrimestreFreg20 = feature.properties.F1Trim20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F1Trim20)
    };
}
function apagarPreco1TrimestreFreg20(e) {
    Preco1TrimestreFreg20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1TrimestreFreg20(feature, layer) {
    if(feature.properties.F1Trim20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim20.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1TrimestreFreg20,
    });
}
var Preco1TrimestreFreg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco1TrimestreFreg20,
    onEachFeature: onEachFeaturePreco1TrimestreFreg20
});
let slidePreco1TrimestreFreg20 = function(){
    var sliderPreco1TrimestreFreg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1TrimestreFreg20, {
        start: [minPreco1TrimestreFreg20, maxPreco1TrimestreFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1TrimestreFreg20,
            'max': maxPreco1TrimestreFreg20
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1TrimestreFreg20);
    inputNumberMax.setAttribute("value",maxPreco1TrimestreFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1TrimestreFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1TrimestreFreg20.noUiSlider.set([null, this.value]);
    });

    sliderPreco1TrimestreFreg20.noUiSlider.on('update',function(e){
        Preco1TrimestreFreg20.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim20 == null){
                return false
            }
            if(layer.feature.properties.F1Trim20.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim20.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1TrimestreFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderPreco1TrimestreFreg20.noUiSlider;
    $(slidersGeral).append(sliderPreco1TrimestreFreg20);
} 

//////////////////////------------------------ Fim 1 TRIMESTRE 2020 FREGUESIA   -------------- \\\\

///////////////////------------------- 2 TRIMESTRE 2020 POR FREGUESIA-----////////////////////////

var minPreco2TrimestreFreg20 = 999;
var maxPreco2TrimestreFreg20 = 0;

function EstiloPreco2TrimestreFreg20(feature) {
    if((feature.properties.F2Trim20 <= minPreco2TrimestreFreg20 && feature.properties.F2Trim20 > null) || feature.properties.F2Trim20 === 0){
        minPreco2TrimestreFreg20 = feature.properties.F2Trim20
    }
    if(feature.properties.F2Trim20 >= maxPreco2TrimestreFreg20 ){
        maxPreco2TrimestreFreg20 = feature.properties.F2Trim20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F2Trim20)
    };
}
function apagarPreco2TrimestreFreg20(e) {
    Preco2TrimestreFreg20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2TrimestreFreg20(feature, layer) {
    if(feature.properties.F2Trim20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim20.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2TrimestreFreg20,
    });
}
var Preco2TrimestreFreg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco2TrimestreFreg20,
    onEachFeature: onEachFeaturePreco2TrimestreFreg20
});
let slidePreco2TrimestreFreg20 = function(){
    var sliderPreco2TrimestreFreg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2TrimestreFreg20, {
        start: [minPreco2TrimestreFreg20, maxPreco2TrimestreFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2TrimestreFreg20,
            'max': maxPreco2TrimestreFreg20
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2TrimestreFreg20);
    inputNumberMax.setAttribute("value",maxPreco2TrimestreFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2TrimestreFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2TrimestreFreg20.noUiSlider.set([null, this.value]);
    });

    sliderPreco2TrimestreFreg20.noUiSlider.on('update',function(e){
        Preco2TrimestreFreg20.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim20 == null){
                return false
            }
            if(layer.feature.properties.F2Trim20.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim20.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2TrimestreFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderPreco2TrimestreFreg20.noUiSlider;
    $(slidersGeral).append(sliderPreco2TrimestreFreg20);
} 

//////////////////////------------------------ Fim 2 TRIMESTRE 2020 FREGUESIA   -------------- \\\\

///////////////////------------------- 3 TRIMESTRE 2020 POR FREGUESIA-----////////////////////////

var minPreco3TrimestreFreg20 = 999;
var maxPreco3TrimestreFreg20 = 0;

function EstiloPreco3TrimestreFreg20(feature) {
    if((feature.properties.F3Trim20 <= minPreco3TrimestreFreg20 && feature.properties.F3Trim20 > null) || feature.properties.F3Trim20 === 0){
        minPreco3TrimestreFreg20 = feature.properties.F3Trim20
    }
    if(feature.properties.F3Trim20 >= maxPreco3TrimestreFreg20 ){
        maxPreco3TrimestreFreg20 = feature.properties.F3Trim20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F3Trim20)
    };
}
function apagarPreco3TrimestreFreg20(e) {
    Preco3TrimestreFreg20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3TrimestreFreg20(feature, layer) {
    if(feature.properties.F3Trim20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim20.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3TrimestreFreg20,
    });
}
var Preco3TrimestreFreg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco3TrimestreFreg20,
    onEachFeature: onEachFeaturePreco3TrimestreFreg20
});
let slidePreco3TrimestreFreg20 = function(){
    var sliderPreco3TrimestreFreg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3TrimestreFreg20, {
        start: [minPreco3TrimestreFreg20, maxPreco3TrimestreFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3TrimestreFreg20,
            'max': maxPreco3TrimestreFreg20
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3TrimestreFreg20);
    inputNumberMax.setAttribute("value",maxPreco3TrimestreFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3TrimestreFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3TrimestreFreg20.noUiSlider.set([null, this.value]);
    });

    sliderPreco3TrimestreFreg20.noUiSlider.on('update',function(e){
        Preco3TrimestreFreg20.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim20 == null){
                return false
            }
            if(layer.feature.properties.F3Trim20.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim20.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3TrimestreFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderPreco3TrimestreFreg20.noUiSlider;
    $(slidersGeral).append(sliderPreco3TrimestreFreg20);
} 

//////////////////////------------------------ Fim 3 TRIMESTRE 2020 FREGUESIA   -------------- \\\\

///////////////////------------------- 4 TRIMESTRE 2020 POR FREGUESIA-----////////////////////////

var minPreco4TrimestreFreg20 = 999;
var maxPreco4TrimestreFreg20 = 0;

function EstiloPreco4TrimestreFreg20(feature) {
    if((feature.properties.F4Trim20 <= minPreco4TrimestreFreg20 && feature.properties.F4Trim20 > null) || feature.properties.F4Trim20 === 0){
        minPreco4TrimestreFreg20 = feature.properties.F4Trim20
    }
    if(feature.properties.F4Trim20 >= maxPreco4TrimestreFreg20 ){
        maxPreco4TrimestreFreg20 = feature.properties.F4Trim20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F4Trim20)
    };
}
function apagarPreco4TrimestreFreg20(e) {
    Preco4TrimestreFreg20.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4TrimestreFreg20(feature, layer) {
    if(feature.properties.F4Trim20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim20.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4TrimestreFreg20,
    });
}
var Preco4TrimestreFreg20= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco4TrimestreFreg20,
    onEachFeature: onEachFeaturePreco4TrimestreFreg20
});
let slidePreco4TrimestreFreg20 = function(){
    var sliderPreco4TrimestreFreg20 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4TrimestreFreg20, {
        start: [minPreco4TrimestreFreg20, maxPreco4TrimestreFreg20],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4TrimestreFreg20,
            'max': maxPreco4TrimestreFreg20
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4TrimestreFreg20);
    inputNumberMax.setAttribute("value",maxPreco4TrimestreFreg20);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4TrimestreFreg20.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4TrimestreFreg20.noUiSlider.set([null, this.value]);
    });

    sliderPreco4TrimestreFreg20.noUiSlider.on('update',function(e){
        Preco4TrimestreFreg20.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim20 == null){
                return false
            }
            if(layer.feature.properties.F4Trim20.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim20.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4TrimestreFreg20.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderPreco4TrimestreFreg20.noUiSlider;
    $(slidersGeral).append(sliderPreco4TrimestreFreg20);
} 

//////////////////////------------------------ Fim 4 TRIMESTRE 2020 FREGUESIA   -------------- \\\\
///////////////////------------------- 1 TRIMESTRE 2021 POR FREGUESIA-----////////////////////////

var minPreco1TrimestreFreg21 = 999;
var maxPreco1TrimestreFreg21 = 0;

function EstiloPreco1TrimestreFreg21(feature) {
    if((feature.properties.F1Trim21 <= minPreco1TrimestreFreg21 && feature.properties.F1Trim21 > null) || feature.properties.F1Trim21 === 0){
        minPreco1TrimestreFreg21 = feature.properties.F1Trim21
    }
    if(feature.properties.F1Trim21 >= maxPreco1TrimestreFreg21 ){
        maxPreco1TrimestreFreg21 = feature.properties.F1Trim21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F1Trim21)
    };
}
function apagarPreco1TrimestreFreg21(e) {
    Preco1TrimestreFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco1TrimestreFreg21(feature, layer) {
    if(feature.properties.F1Trim21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F1Trim21.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco1TrimestreFreg21,
    });
}
var Preco1TrimestreFreg21= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco1TrimestreFreg21,
    onEachFeature: onEachFeaturePreco1TrimestreFreg21
});
let slidePreco1TrimestreFreg21 = function(){
    var sliderPreco1TrimestreFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 65){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco1TrimestreFreg21, {
        start: [minPreco1TrimestreFreg21, maxPreco1TrimestreFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco1TrimestreFreg21,
            'max': maxPreco1TrimestreFreg21
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco1TrimestreFreg21);
    inputNumberMax.setAttribute("value",maxPreco1TrimestreFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco1TrimestreFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco1TrimestreFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPreco1TrimestreFreg21.noUiSlider.on('update',function(e){
        Preco1TrimestreFreg21.eachLayer(function(layer){
            if(layer.feature.properties.F1Trim21 == null){
                return false
            }
            if(layer.feature.properties.F1Trim21.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F1Trim21.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco1TrimestreFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 65;
    sliderAtivo = sliderPreco1TrimestreFreg21.noUiSlider;
    $(slidersGeral).append(sliderPreco1TrimestreFreg21);
} 

//////////////////////------------------------ Fim 1 TRIMESTRE 2021 FREGUESIA   -------------- \\\\

///////////////////------------------- 2 TRIMESTRE 2021 POR FREGUESIA-----////////////////////////

var minPreco2TrimestreFreg21 = 999;
var maxPreco2TrimestreFreg21 = 0;

function EstiloPreco2TrimestreFreg21(feature) {
    if((feature.properties.F2Trim21 <= minPreco2TrimestreFreg21 && feature.properties.F2Trim21 > null) || feature.properties.F2Trim21 === 0){
        minPreco2TrimestreFreg21 = feature.properties.F2Trim21
    }
    if(feature.properties.F2Trim21 >= maxPreco2TrimestreFreg21 ){
        maxPreco2TrimestreFreg21 = feature.properties.F2Trim21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F2Trim21)
    };
}
function apagarPreco2TrimestreFreg21(e) {
    Preco2TrimestreFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco2TrimestreFreg21(feature, layer) {
    if(feature.properties.F2Trim21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F2Trim21.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco2TrimestreFreg21,
    });
}
var Preco2TrimestreFreg21= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco2TrimestreFreg21,
    onEachFeature: onEachFeaturePreco2TrimestreFreg21
});
let slidePreco2TrimestreFreg21 = function(){
    var sliderPreco2TrimestreFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 66){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco2TrimestreFreg21, {
        start: [minPreco2TrimestreFreg21, maxPreco2TrimestreFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco2TrimestreFreg21,
            'max': maxPreco2TrimestreFreg21
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco2TrimestreFreg21);
    inputNumberMax.setAttribute("value",maxPreco2TrimestreFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco2TrimestreFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco2TrimestreFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPreco2TrimestreFreg21.noUiSlider.on('update',function(e){
        Preco2TrimestreFreg21.eachLayer(function(layer){
            if(layer.feature.properties.F2Trim21 == null){
                return false
            }
            if(layer.feature.properties.F2Trim21.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F2Trim21.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco2TrimestreFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 66;
    sliderAtivo = sliderPreco2TrimestreFreg21.noUiSlider;
    $(slidersGeral).append(sliderPreco2TrimestreFreg21);
} 

//////////////////////------------------------ Fim 2 TRIMESTRE 2021 FREGUESIA   -------------- \\\\
///////////////////------------------- 3 TRIMESTRE 2021 POR FREGUESIA-----////////////////////////

var minPreco3TrimestreFreg21 = 999;
var maxPreco3TrimestreFreg21 = 0;

function EstiloPreco3TrimestreFreg21(feature) {
    if((feature.properties.F3Trim21 <= minPreco3TrimestreFreg21 && feature.properties.F3Trim21 > null) || feature.properties.F3Trim21 === 0){
        minPreco3TrimestreFreg21 = feature.properties.F3Trim21
    }
    if(feature.properties.F3Trim21 >= maxPreco3TrimestreFreg21 ){
        maxPreco3TrimestreFreg21 = feature.properties.F3Trim21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F3Trim21)
    };
}
function apagarPreco3TrimestreFreg21(e) {
    Preco3TrimestreFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco3TrimestreFreg21(feature, layer) {
    if(feature.properties.F3Trim21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F3Trim21.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco3TrimestreFreg21,
    });
}
var Preco3TrimestreFreg21= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco3TrimestreFreg21,
    onEachFeature: onEachFeaturePreco3TrimestreFreg21
});
let slidePreco3TrimestreFreg21 = function(){
    var sliderPreco3TrimestreFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 67){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco3TrimestreFreg21, {
        start: [minPreco3TrimestreFreg21, maxPreco3TrimestreFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco3TrimestreFreg21,
            'max': maxPreco3TrimestreFreg21
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco3TrimestreFreg21);
    inputNumberMax.setAttribute("value",maxPreco3TrimestreFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco3TrimestreFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco3TrimestreFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPreco3TrimestreFreg21.noUiSlider.on('update',function(e){
        Preco3TrimestreFreg21.eachLayer(function(layer){
            if(layer.feature.properties.F3Trim21 == null){
                return false
            }
            if(layer.feature.properties.F3Trim21.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F3Trim21.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco3TrimestreFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 67;
    sliderAtivo = sliderPreco3TrimestreFreg21.noUiSlider;
    $(slidersGeral).append(sliderPreco3TrimestreFreg21);
} 

//////////////////////------------------------ Fim 3 TRIMESTRE 2021 FREGUESIA   -------------- \\\\
///////////////////------------------- 4 TRIMESTRE 2021 POR FREGUESIA-----////////////////////////

var minPreco4TrimestreFreg21 = 999;
var maxPreco4TrimestreFreg21 = 0;

function EstiloPreco4TrimestreFreg21(feature) {
    if((feature.properties.F4Trim21 <= minPreco4TrimestreFreg21 && feature.properties.F4Trim21 > null) || feature.properties.F4Trim21 === 0){
        minPreco4TrimestreFreg21 = feature.properties.F4Trim21
    }
    if(feature.properties.F4Trim21 >= maxPreco4TrimestreFreg21 ){
        maxPreco4TrimestreFreg21 = feature.properties.F4Trim21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerPrecosVendasFreg(feature.properties.F4Trim21)
    };
}
function apagarPreco4TrimestreFreg21(e) {
    Preco4TrimestreFreg21.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePreco4TrimestreFreg21(feature, layer) {
    if(feature.properties.F4Trim21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Valor mediano das vendas por m<sup>2</sup>: ' + '<b>' + feature.properties.F4Trim21.toFixed(0)+ '€' + '</b>').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPreco4TrimestreFreg21,
    });
}
var Preco4TrimestreFreg21= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloPreco4TrimestreFreg21,
    onEachFeature: onEachFeaturePreco4TrimestreFreg21
});
let slidePreco4TrimestreFreg21 = function(){
    var sliderPreco4TrimestreFreg21 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 91){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPreco4TrimestreFreg21, {
        start: [minPreco4TrimestreFreg21, maxPreco4TrimestreFreg21],
        tooltips:true,
        connect: true,
        range: {
            'min': minPreco4TrimestreFreg21,
            'max': maxPreco4TrimestreFreg21
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minPreco4TrimestreFreg21);
    inputNumberMax.setAttribute("value",maxPreco4TrimestreFreg21);

    inputNumberMin.addEventListener('change', function(){
        sliderPreco4TrimestreFreg21.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPreco4TrimestreFreg21.noUiSlider.set([null, this.value]);
    });

    sliderPreco4TrimestreFreg21.noUiSlider.on('update',function(e){
        Preco4TrimestreFreg21.eachLayer(function(layer){
            if(layer.feature.properties.F4Trim21 == null){
                return false
            }
            if(layer.feature.properties.F4Trim21.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.F4Trim21.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPreco4TrimestreFreg21.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 91;
    sliderAtivo = sliderPreco4TrimestreFreg21.noUiSlider;
    $(slidersGeral).append(sliderPreco4TrimestreFreg21);
} 

//////////////////////------------------------ Fim 4 TRIMESTRE 2021 FREGUESIA   -------------- \\\\

/////////////////////////////-------------------------- FIM DADOS RELATIVOS FREGUESIA --------------\\\\\\\\\\\\\\

/////////////////////////////------- Variação 2 Trimestre 2016 E 1 Trimestre 2016 POR FREGUESIA -------------------////

var minVar2Tri16_1Tri16Freg = 99;
var maxVar2Tri16_1Tri16Freg = -99;

function CorVar2Tri16_1Tri16Freg(d) {
    return d === null ? '#808080':
        d >= 15  ? '#8c0303' :
        d >= 6  ? '#de1f35' :
        d >= 3  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -22  ? '#9eaad7' :
                ''  ;
}

var legendaVar2Tri16_1Tri16Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2016 e o 1º trimestre de 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  6 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  3 a 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 3' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -21.66 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Tri16_1Tri16Freg(feature) {
    if(feature.properties.Var2T1T_16 <= minVar2Tri16_1Tri16Freg){
        minVar2Tri16_1Tri16Freg = feature.properties.Var2T1T_16
    }
    if(feature.properties.Var2T1T_16 > maxVar2Tri16_1Tri16Freg){
        maxVar2Tri16_1Tri16Freg = feature.properties.Var2T1T_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri16_1Tri16Freg(feature.properties.Var2T1T_16)};
    }


function apagarVar2Tri16_1Tri16Freg(e) {
    Var2Tri16_1Tri16Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri16_1Tri16Freg(feature, layer) {
    if(feature.properties.Var2T1T_16 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri16_1Tri16Freg,
    });
}
var Var2Tri16_1Tri16Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2Tri16_1Tri16Freg,
    onEachFeature: onEachFeatureVar2Tri16_1Tri16Freg
});

let slideVar2Tri16_1Tri16Freg = function(){
    var sliderVar2Tri16_1Tri16Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 68){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri16_1Tri16Freg, {
        start: [minVar2Tri16_1Tri16Freg, maxVar2Tri16_1Tri16Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri16_1Tri16Freg,
            'max': maxVar2Tri16_1Tri16Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri16_1Tri16Freg);
    inputNumberMax.setAttribute("value",maxVar2Tri16_1Tri16Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri16_1Tri16Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri16_1Tri16Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri16_1Tri16Freg.noUiSlider.on('update',function(e){
        Var2Tri16_1Tri16Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_16 == null){
                return false
            }
            if(layer.feature.properties.Var2T1T_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri16_1Tri16Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 68;
    sliderAtivo = sliderVar2Tri16_1Tri16Freg.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri16_1Tri16Freg);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2016 E 1 Trimestre 2016 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2016 E 2 Trimestre 2016 POR FREGUESIA -------------------////

var minVar3Tri16_2Tri16Freg = 99;
var maxVar3Tri16_2Tri16Freg = -99;

function CorVar3Tri16_2Tri16Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -14  ? '#2288bf' :
                ''  ;
}

var legendaVar3Tri16_2Tri16Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2016 e o 1º trimestre de 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -13.07 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3Tri16_2Tri16Freg(feature) {
    if(feature.properties.Var3T2T_16 <= minVar3Tri16_2Tri16Freg){
        minVar3Tri16_2Tri16Freg = feature.properties.Var3T2T_16
    }
    if(feature.properties.Var3T2T_16 > maxVar3Tri16_2Tri16Freg){
        maxVar3Tri16_2Tri16Freg = feature.properties.Var3T2T_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri16_2Tri16Freg(feature.properties.Var3T2T_16)};
    }


function apagarVar3Tri16_2Tri16Freg(e) {
    Var3Tri16_2Tri16Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri16_2Tri16Freg(feature, layer) {
    if(feature.properties.Var3T2T_16 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri16_2Tri16Freg,
    });
}
var Var3Tri16_2Tri16Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar3Tri16_2Tri16Freg,
    onEachFeature: onEachFeatureVar3Tri16_2Tri16Freg
});

let slideVar3Tri16_2Tri16Freg = function(){
    var sliderVar3Tri16_2Tri16Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 69){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri16_2Tri16Freg, {
        start: [minVar3Tri16_2Tri16Freg, maxVar3Tri16_2Tri16Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri16_2Tri16Freg,
            'max': maxVar3Tri16_2Tri16Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri16_2Tri16Freg);
    inputNumberMax.setAttribute("value",maxVar3Tri16_2Tri16Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri16_2Tri16Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri16_2Tri16Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri16_2Tri16Freg.noUiSlider.on('update',function(e){
        Var3Tri16_2Tri16Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_16 == null){
                return false
            }
            if(layer.feature.properties.Var3T2T_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri16_2Tri16Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 69;
    sliderAtivo = sliderVar3Tri16_2Tri16Freg.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri16_2Tri16Freg);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2016 E 2 Trimestre 2016 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2016 E 3 Trimestre 2016 POR FREGUESIA -------------------////

var minVar4Tri16_3Tri16Freg = 99;
var maxVar4Tri16_3Tri16Freg = -90;

function CorVar4Tri16_3Tri16Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -20  ? '#2288bf' :
                ''  ;
}

var legendaVar4Tri16_3Tri16Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2016 e o 2º trimestre de 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -19.57 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4Tri16_3Tri16Freg(feature) {
    if(feature.properties.Var4T3T_16 <= minVar4Tri16_3Tri16Freg){
        minVar4Tri16_3Tri16Freg = feature.properties.Var4T3T_16
    }
    if(feature.properties.Var4T3T_16 > maxVar4Tri16_3Tri16Freg){
        maxVar4Tri16_3Tri16Freg = feature.properties.Var4T3T_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri16_3Tri16Freg(feature.properties.Var4T3T_16)};
    }


function apagarVar4Tri16_3Tri16Freg(e) {
    Var4Tri16_3Tri16Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri16_3Tri16Freg(feature, layer) {
    if(feature.properties.Var4T3T_16 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_16.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri16_3Tri16Freg,
    });
}
var Var4Tri16_3Tri16Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar4Tri16_3Tri16Freg,
    onEachFeature: onEachFeatureVar4Tri16_3Tri16Freg
});

let slideVar4Tri16_3Tri16Freg = function(){
    var sliderVar4Tri16_3Tri16Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 70){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri16_3Tri16Freg, {
        start: [minVar4Tri16_3Tri16Freg, maxVar4Tri16_3Tri16Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri16_3Tri16Freg,
            'max': maxVar4Tri16_3Tri16Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri16_3Tri16Freg);
    inputNumberMax.setAttribute("value",maxVar4Tri16_3Tri16Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri16_3Tri16Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri16_3Tri16Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri16_3Tri16Freg.noUiSlider.on('update',function(e){
        Var4Tri16_3Tri16Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_16 == null){
                return false
            }
            if(layer.feature.properties.Var4T3T_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri16_3Tri16Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 70;
    sliderAtivo = sliderVar4Tri16_3Tri16Freg.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri16_3Tri16Freg);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2016 E 3 Trimestre 2016 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 1 Trimestre 2017 E 4 Trimestre 2016 POR FREGUESIA -------------------////

var minVar1Tri17_4Tri16Freg = 0;
var maxVar1Tri17_4Tri16Freg = 0;

function CorVar4Tri16_3Tri16Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#8c0303' :
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -12  ? '#9eaad7' :
                ''  ;
}

var legendaVar1Tri17_4Tri16Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2016 e o 3º trimestre de 2016, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -11.03 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Tri17_4Tri16Freg(feature) {
    if(feature.properties.Var1T4T_17 <= minVar1Tri17_4Tri16Freg){
        minVar1Tri17_4Tri16Freg = feature.properties.Var1T4T_17
    }
    if(feature.properties.Var1T4T_17 > maxVar1Tri17_4Tri16Freg){
        maxVar1Tri17_4Tri16Freg = feature.properties.Var1T4T_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri16_3Tri16Freg(feature.properties.Var1T4T_17)};
    }


function apagarVar1Tri17_4Tri16Freg(e) {
    Var1Tri17_4Tri16Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Tri17_4Tri16Freg(feature, layer) {
    if(feature.properties.Var1T4T_17 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1T4T_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Tri17_4Tri16Freg,
    });
}
var Var1Tri17_4Tri16Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar1Tri17_4Tri16Freg,
    onEachFeature: onEachFeatureVar1Tri17_4Tri16Freg
});

let slideVar1Tri17_4Tri16Freg = function(){
    var sliderVar1Tri17_4Tri16Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 71){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Tri17_4Tri16Freg, {
        start: [minVar1Tri17_4Tri16Freg, maxVar1Tri17_4Tri16Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Tri17_4Tri16Freg,
            'max': maxVar1Tri17_4Tri16Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar1Tri17_4Tri16Freg);
    inputNumberMax.setAttribute("value",maxVar1Tri17_4Tri16Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Tri17_4Tri16Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Tri17_4Tri16Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar1Tri17_4Tri16Freg.noUiSlider.on('update',function(e){
        Var1Tri17_4Tri16Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var1T4T_17 == null){
                return false
            }
            if(layer.feature.properties.Var1T4T_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1T4T_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Tri17_4Tri16Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 71;
    sliderAtivo = sliderVar1Tri17_4Tri16Freg.noUiSlider;
    $(slidersGeral).append(sliderVar1Tri17_4Tri16Freg);
} 

///////////////////////////// Fim da Variação 1 Trimestre 2017 E 4 Trimestre 2016 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 2 Trimestre 2017 E 1 Trimestre 2017 POR FREGUESIA -------------------////

var minVar2Tri17_1Tri17Freg = 99;
var maxVar2Tri17_1Tri17Freg = -99;

function CorVar2Tri17_1Tri17Freg(d) {
    return d === null ? '#808080':
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -27  ? '#2288bf' :
                ''  ;
}

var legendaVar2Tri17_1Tri17Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2017 e o 1º trimestre de 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -26.59 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar2Tri17_1Tri17Freg(feature) {
    if(feature.properties.Var2T1T_17 <= minVar2Tri17_1Tri17Freg){
        minVar2Tri17_1Tri17Freg = feature.properties.Var2T1T_17
    }
    if(feature.properties.Var2T1T_17 > maxVar2Tri17_1Tri17Freg){
        maxVar2Tri17_1Tri17Freg = feature.properties.Var2T1T_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri17_1Tri17Freg(feature.properties.Var2T1T_17)};
    }


function apagarVar2Tri17_1Tri17Freg(e) {
    Var2Tri17_1Tri17Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri17_1Tri17Freg(feature, layer) {
    if(feature.properties.Var2T1T_17 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri17_1Tri17Freg,
    });
}
var Var2Tri17_1Tri17Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2Tri17_1Tri17Freg,
    onEachFeature: onEachFeatureVar2Tri17_1Tri17Freg
});

let slideVar2Tri17_1Tri17Freg = function(){
    var sliderVar2Tri17_1Tri17Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 72){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri17_1Tri17Freg, {
        start: [minVar2Tri17_1Tri17Freg, maxVar2Tri17_1Tri17Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri17_1Tri17Freg,
            'max': maxVar2Tri17_1Tri17Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri17_1Tri17Freg);
    inputNumberMax.setAttribute("value",maxVar2Tri17_1Tri17Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri17_1Tri17Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri17_1Tri17Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri17_1Tri17Freg.noUiSlider.on('update',function(e){
        Var2Tri17_1Tri17Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_17 == null){
                return false
            }
            if(layer.feature.properties.Var2T1T_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri17_1Tri17Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 72;
    sliderAtivo = sliderVar2Tri17_1Tri17Freg.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri17_1Tri17Freg);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2017 E 1 Trimestre 2017 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2017 E 2 Trimestre 2017 POR FREGUESIA -------------------////

var minVar3Tri17_2Tri17Freg = 99;
var maxVar3Tri17_2Tri17Freg = -99;

function CorVar3Tri17_2Tri17Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -18  ? '#2288bf' :
                ''  ;
}

var legendaVar3Tri17_2Tri17Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2017 e o 2º trimestre de 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -17.97 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3Tri17_2Tri17Freg(feature) {
    if(feature.properties.Var3T2T_17 <= minVar3Tri17_2Tri17Freg){
        minVar3Tri17_2Tri17Freg = feature.properties.Var3T2T_17
    }
    if(feature.properties.Var3T2T_17 > maxVar3Tri17_2Tri17Freg){
        maxVar3Tri17_2Tri17Freg = feature.properties.Var3T2T_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri17_2Tri17Freg(feature.properties.Var3T2T_17)};
    }


function apagarVar3Tri17_2Tri17Freg(e) {
    Var3Tri17_2Tri17Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri17_2Tri17Freg(feature, layer) {
    if(feature.properties.Var3T2T_17 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri17_2Tri17Freg,
    });
}
var Var3Tri17_2Tri17Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar3Tri17_2Tri17Freg,
    onEachFeature: onEachFeatureVar3Tri17_2Tri17Freg
});

let slideVar3Tri17_2Tri17Freg = function(){
    var sliderVar3Tri17_2Tri17Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 73){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri17_2Tri17Freg, {
        start: [minVar3Tri17_2Tri17Freg, maxVar3Tri17_2Tri17Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri17_2Tri17Freg,
            'max': maxVar3Tri17_2Tri17Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri17_2Tri17Freg);
    inputNumberMax.setAttribute("value",maxVar3Tri17_2Tri17Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri17_2Tri17Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri17_2Tri17Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri17_2Tri17Freg.noUiSlider.on('update',function(e){
        Var3Tri17_2Tri17Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_17 == null){
                return false
            }
            if(layer.feature.properties.Var3T2T_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri17_2Tri17Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 73;
    sliderAtivo = sliderVar3Tri17_2Tri17Freg.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri17_2Tri17Freg);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2017 E 2 Trimestre 2017 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2017 E 3 Trimestre 2017 POR FREGUESIA -------------------////

var minVar4Tri17_3Tri17Freg = 99;
var maxVar4Tri17_3Tri17Freg = -99;

function CorVar4Tri17_3Tri17Freg(d) {
    return d === null ? '#808080':
        d >= 20  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -19  ? '#9eaad7' :
                ''  ;
}
var legendaVar4Tri17_3Tri17Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2017 e o 3º trimestre de 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -18 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4Tri17_3Tri17Freg(feature) {
    if(feature.properties.Var4T3T_17 <= minVar4Tri17_3Tri17Freg){
        minVar4Tri17_3Tri17Freg = feature.properties.Var4T3T_17
    }
    if(feature.properties.Var4T3T_17 > maxVar4Tri17_3Tri17Freg){
        maxVar4Tri17_3Tri17Freg = feature.properties.Var4T3T_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri17_3Tri17Freg(feature.properties.Var4T3T_17)};
    }


function apagarVar4Tri17_3Tri17Freg(e) {
    Var4Tri17_3Tri17Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri17_3Tri17Freg(feature, layer) {
    if(feature.properties.Var4T3T_17 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_17.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri17_3Tri17Freg,
    });
}
var Var4Tri17_3Tri17Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar4Tri17_3Tri17Freg,
    onEachFeature: onEachFeatureVar4Tri17_3Tri17Freg
});

let slideVar4Tri17_3Tri17Freg = function(){
    var sliderVar4Tri17_3Tri17Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 74){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri17_3Tri17Freg, {
        start: [minVar4Tri17_3Tri17Freg, maxVar4Tri17_3Tri17Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri17_3Tri17Freg,
            'max': maxVar4Tri17_3Tri17Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri17_3Tri17Freg);
    inputNumberMax.setAttribute("value",maxVar4Tri17_3Tri17Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri17_3Tri17Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri17_3Tri17Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri17_3Tri17Freg.noUiSlider.on('update',function(e){
        Var4Tri17_3Tri17Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_17 == null){
                return false
            }
            if(layer.feature.properties.Var4T3T_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri17_3Tri17Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 74;
    sliderAtivo = sliderVar4Tri17_3Tri17Freg.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri17_3Tri17Freg);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2017 E 3 Trimestre 2017 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 1 Trimestre 2018 E 4 Trimestre 2017 POR FREGUESIA -------------------////

var minVar1Tri18_4Tri17Freg = 99;
var maxVar1Tri18_4Tri17Freg = -99;

function CorVar1Tri18_4Tri17Freg(d) {
    return d === null ? '#808080':
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -19  ? '#2288bf' :
                ''  ;
}
var legendaVar1Tri18_4Tri17Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 1º trimestre de 2018 e o 4º trimestre de 2017, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -18.6 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar1Tri18_4Tri17Freg(feature) {
    if(feature.properties.Var1T4T_18 <= minVar1Tri18_4Tri17Freg){
        minVar1Tri18_4Tri17Freg = feature.properties.Var1T4T_18
    }
    if(feature.properties.Var1T4T_18 > maxVar1Tri18_4Tri17Freg){
        maxVar1Tri18_4Tri17Freg = feature.properties.Var1T4T_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Tri18_4Tri17Freg(feature.properties.Var1T4T_18)};
    }


function apagarVar1Tri18_4Tri17Freg(e) {
    Var1Tri18_4Tri17Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Tri18_4Tri17Freg(feature, layer) {
    if(feature.properties.Var1T4T_18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1T4T_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Tri18_4Tri17Freg,
    });
}
var Var1Tri18_4Tri17Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar1Tri18_4Tri17Freg,
    onEachFeature: onEachFeatureVar1Tri18_4Tri17Freg
});

let slideVar1Tri18_4Tri17Freg = function(){
    var sliderVar1Tri18_4Tri17Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 75){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Tri18_4Tri17Freg, {
        start: [minVar1Tri18_4Tri17Freg, maxVar1Tri18_4Tri17Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Tri18_4Tri17Freg,
            'max': maxVar1Tri18_4Tri17Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar1Tri18_4Tri17Freg);
    inputNumberMax.setAttribute("value",maxVar1Tri18_4Tri17Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Tri18_4Tri17Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Tri18_4Tri17Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar1Tri18_4Tri17Freg.noUiSlider.on('update',function(e){
        Var1Tri18_4Tri17Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var1T4T_18 == null){
                return false
            }
            if(layer.feature.properties.Var1T4T_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1T4T_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Tri18_4Tri17Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 75;
    sliderAtivo = sliderVar1Tri18_4Tri17Freg.noUiSlider;
    $(slidersGeral).append(sliderVar1Tri18_4Tri17Freg);
} 

///////////////////////////// Fim da Variação 1 Trimestre 2018 E 4 Trimestre 2017 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 2 Trimestre 2018 E 1 Trimestre 2018 POR FREGUESIA -------------------////

var minVar2Tri18_1Tri18Freg = 99;
var maxVar2Tri18_1Tri18Freg = -99;

function CorVar2Tri18_1Tri18Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -30  ? '#2288bf' :
                ''  ;
}

var legendaVar2Tri18_1Tri18Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2018 e o 1º trimestre de 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -29.32 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Tri18_1Tri18Freg(feature) {
    if(feature.properties.Var2T1T_18 <= minVar2Tri18_1Tri18Freg){
        minVar2Tri18_1Tri18Freg = feature.properties.Var2T1T_18
    }
    if(feature.properties.Var2T1T_18 > maxVar2Tri18_1Tri18Freg){
        maxVar2Tri18_1Tri18Freg = feature.properties.Var2T1T_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri18_1Tri18Freg(feature.properties.Var2T1T_18)};
    }


function apagarVar2Tri18_1Tri18Freg(e) {
    Var2Tri18_1Tri18Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri18_1Tri18Freg(feature, layer) {
    if(feature.properties.Var2T1T_18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri18_1Tri18Freg,
    });
}
var Var2Tri18_1Tri18Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2Tri18_1Tri18Freg,
    onEachFeature: onEachFeatureVar2Tri18_1Tri18Freg
});

let slideVar2Tri18_1Tri18Freg = function(){
    var sliderVar2Tri18_1Tri18Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 76){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri18_1Tri18Freg, {
        start: [minVar2Tri18_1Tri18Freg, maxVar2Tri18_1Tri18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri18_1Tri18Freg,
            'max': maxVar2Tri18_1Tri18Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri18_1Tri18Freg);
    inputNumberMax.setAttribute("value",maxVar2Tri18_1Tri18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri18_1Tri18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri18_1Tri18Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri18_1Tri18Freg.noUiSlider.on('update',function(e){
        Var2Tri18_1Tri18Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_18 == null){
                return false
            }
            if(layer.feature.properties.Var2T1T_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri18_1Tri18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 76;
    sliderAtivo = sliderVar2Tri18_1Tri18Freg.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri18_1Tri18Freg);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2018 E 1 Trimestre 2018 POR FREGUESIAS -------------- \\\\\


/////////////////////////////------- Variação 3 Trimestre 2018 E 2 Trimestre 2018 POR FREGUESIA -------------------////

var minVar3Tri18_2Tri18Freg = 99;
var maxVar3Tri18_2Tri18Freg = -99;

function CorVar3Tri18_2Tri18Freg(d) {
    return d === null ? '#808080':
        d >= 15  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -23  ? '#2288bf' :
                ''  ;
}
var legendaVar3Tri18_2Tri18Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2018 e o 2º trimestre de 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -22.59 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3Tri18_2Tri18Freg(feature) {
    if(feature.properties.Var3T2T_18 <= minVar3Tri18_2Tri18Freg){
        minVar3Tri18_2Tri18Freg = feature.properties.Var3T2T_18
    }
    if(feature.properties.Var3T2T_18 > maxVar3Tri18_2Tri18Freg){
        maxVar3Tri18_2Tri18Freg = feature.properties.Var3T2T_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri18_2Tri18Freg(feature.properties.Var3T2T_18)};
    }


function apagarVar3Tri18_2Tri18Freg(e) {
    Var3Tri18_2Tri18Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri18_2Tri18Freg(feature, layer) {
    if(feature.properties.Var3T2T_18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri18_2Tri18Freg,
    });
}
var Var3Tri18_2Tri18Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar3Tri18_2Tri18Freg,
    onEachFeature: onEachFeatureVar3Tri18_2Tri18Freg
});

let slideVar3Tri18_2Tri18Freg = function(){
    var sliderVar3Tri18_2Tri18Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 94){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri18_2Tri18Freg, {
        start: [minVar3Tri18_2Tri18Freg, maxVar3Tri18_2Tri18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri18_2Tri18Freg,
            'max': maxVar3Tri18_2Tri18Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri18_2Tri18Freg);
    inputNumberMax.setAttribute("value",maxVar3Tri18_2Tri18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri18_2Tri18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri18_2Tri18Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri18_2Tri18Freg.noUiSlider.on('update',function(e){
        Var3Tri18_2Tri18Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_18 == null){
                return false
            }
            if(layer.feature.properties.Var3T2T_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri18_2Tri18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 94;
    sliderAtivo = sliderVar3Tri18_2Tri18Freg.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri18_2Tri18Freg);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2018 E 2 Trimestre 2018 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2018 E 3 Trimestre 2018 POR FREGUESIA -------------------////

var minVar4Tri18_3Tri18Freg = 99;
var maxVar4Tri18_3Tri18Freg = -99;

function CorVar4Tri18_3Tri18Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -33  ? '#2288bf' :
                ''  ;
}

var legendaVar4Tri18_3Tri18Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2018 e o 3º trimestre de 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -32.83 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar4Tri18_3Tri18Freg(feature) {
    if(feature.properties.Var4T3T_18 <= minVar4Tri18_3Tri18Freg){
        minVar4Tri18_3Tri18Freg = feature.properties.Var4T3T_18
    }
    if(feature.properties.Var4T3T_18 > maxVar4Tri18_3Tri18Freg){
        maxVar4Tri18_3Tri18Freg = feature.properties.Var4T3T_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri18_3Tri18Freg(feature.properties.Var4T3T_18)};
    }


function apagarVar4Tri18_3Tri18Freg(e) {
    Var4Tri18_3Tri18Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri18_3Tri18Freg(feature, layer) {
    if(feature.properties.Var4T3T_18 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_18.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri18_3Tri18Freg,
    });
}
var Var4Tri18_3Tri18Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar4Tri18_3Tri18Freg,
    onEachFeature: onEachFeatureVar4Tri18_3Tri18Freg
});

let slideVar4Tri18_3Tri18Freg = function(){
    var sliderVar4Tri18_3Tri18Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 77){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri18_3Tri18Freg, {
        start: [minVar4Tri18_3Tri18Freg, maxVar4Tri18_3Tri18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri18_3Tri18Freg,
            'max': maxVar4Tri18_3Tri18Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri18_3Tri18Freg);
    inputNumberMax.setAttribute("value",maxVar4Tri18_3Tri18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri18_3Tri18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri18_3Tri18Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri18_3Tri18Freg.noUiSlider.on('update',function(e){
        Var4Tri18_3Tri18Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_18 == null){
                return false
            }
            if(layer.feature.properties.Var4T3T_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri18_3Tri18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 77;
    sliderAtivo = sliderVar4Tri18_3Tri18Freg.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri18_3Tri18Freg);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2018 E 3 Trimestre 2018 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 1 Trimestre 2019 E 4 Trimestre 2018 POR FREGUESIA -------------------////

var minVar1Tri19_4Tri18Freg = 99;
var maxVar1Tri19_4Tri18Freg = -99;

function CorVar1Tri19_4Tri18Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#8c0303' :
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -27  ? '#9eaad7' :
                ''  ;
}

var legendaVar1Tri19_4Tri18Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 1º trimestre de 2019 e o 4º trimestre de 2018, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -26.32 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Tri19_4Tri18Freg(feature) {
    if(feature.properties.Var1T4T_19 <= minVar1Tri19_4Tri18Freg){
        minVar1Tri19_4Tri18Freg = feature.properties.Var1T4T_19
    }
    if(feature.properties.Var1T4T_19 > maxVar1Tri19_4Tri18Freg){
        maxVar1Tri19_4Tri18Freg = feature.properties.Var1T4T_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Tri19_4Tri18Freg(feature.properties.Var1T4T_19)};
    }


function apagarVar1Tri19_4Tri18Freg(e) {
    Var1Tri19_4Tri18Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Tri19_4Tri18Freg(feature, layer) {
    if(feature.properties.Var1T4T_19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1T4T_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Tri19_4Tri18Freg,
    });
}
var Var1Tri19_4Tri18Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar1Tri19_4Tri18Freg,
    onEachFeature: onEachFeatureVar1Tri19_4Tri18Freg
});

let slideVar1Tri19_4Tri18Freg = function(){
    var sliderVar1Tri19_4Tri18Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 78){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Tri19_4Tri18Freg, {
        start: [minVar1Tri19_4Tri18Freg, maxVar1Tri19_4Tri18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Tri19_4Tri18Freg,
            'max': maxVar1Tri19_4Tri18Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar1Tri19_4Tri18Freg);
    inputNumberMax.setAttribute("value",maxVar1Tri19_4Tri18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Tri19_4Tri18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Tri19_4Tri18Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar1Tri19_4Tri18Freg.noUiSlider.on('update',function(e){
        Var1Tri19_4Tri18Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var1T4T_19 == null){
                return false
            }
            if(layer.feature.properties.Var1T4T_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1T4T_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Tri19_4Tri18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 78;
    sliderAtivo = sliderVar1Tri19_4Tri18Freg.noUiSlider;
    $(slidersGeral).append(sliderVar1Tri19_4Tri18Freg);
} 

///////////////////////////// Fim da Variação 1 Trimestre 2019 E 4 Trimestre 2018 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 2 Trimestre 2019 E 1 Trimestre 2019 POR FREGUESIA -------------------////

var minVar2Tri19_1Tri19Freg = 99;
var maxVar2Tri19_1Tri19Freg = -99;

function CorVar2Tri19_1Tri19Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#8c0303' :
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -27  ? '#9eaad7' :
                ''  ;
}
var legendaVar2Tri19_1Tri19Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2019 e o 1º trimestre de 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25.71 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Tri19_1Tri19Freg(feature) {
    if(feature.properties.Var2T1T_19 <= minVar2Tri19_1Tri19Freg){
        minVar2Tri19_1Tri19Freg = feature.properties.Var2T1T_19
    }
    if(feature.properties.Var2T1T_19 > maxVar2Tri19_1Tri19Freg){
        maxVar2Tri19_1Tri19Freg = feature.properties.Var2T1T_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri19_1Tri19Freg(feature.properties.Var2T1T_19)};
    }


function apagarVar2Tri19_1Tri19Freg(e) {
    Var2Tri19_1Tri19Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri19_1Tri19Freg(feature, layer) {
    if(feature.properties.Var2T1T_19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri19_1Tri19Freg,
    });
}
var Var2Tri19_1Tri19Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2Tri19_1Tri19Freg,
    onEachFeature: onEachFeatureVar2Tri19_1Tri19Freg
});

let slideVar2Tri19_1Tri19Freg = function(){
    var sliderVar2Tri19_1Tri19Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 79){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri19_1Tri19Freg, {
        start: [minVar2Tri19_1Tri19Freg, maxVar2Tri19_1Tri19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri19_1Tri19Freg,
            'max': maxVar2Tri19_1Tri19Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri19_1Tri19Freg);
    inputNumberMax.setAttribute("value",maxVar2Tri19_1Tri19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri19_1Tri19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri19_1Tri19Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri19_1Tri19Freg.noUiSlider.on('update',function(e){
        Var2Tri19_1Tri19Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_19 == null){
                return false
            }
            if(layer.feature.properties.Var2T1T_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri19_1Tri19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 79;
    sliderAtivo = sliderVar2Tri19_1Tri19Freg.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri19_1Tri19Freg);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2019 E 1 Trimestre 2019 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2019 E 2 Trimestre 2019 POR FREGUESIA -------------------////

var minVar3Tri19_2Tri19Freg = 99;
var maxVar3Tri19_2Tri19Freg = -99;

function CorVar3Tri19_2Tri19Freg(d) {
    return d === null ? '#808080':
        d >= 15  ? '#8c0303' :
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -30  ? '#9eaad7' :
                ''  ;
}
var legendaVar3Tri19_2Tri19Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2019 e o 2º trimestre de 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  5 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -29.76 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3Tri19_2Tri19Freg(feature) {
    if(feature.properties.Var3T2T_19 <= minVar3Tri19_2Tri19Freg){
        minVar3Tri19_2Tri19Freg = feature.properties.Var3T2T_19
    }
    if(feature.properties.Var3T2T_19 > maxVar3Tri19_2Tri19Freg){
        maxVar3Tri19_2Tri19Freg = feature.properties.Var3T2T_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri19_2Tri19Freg(feature.properties.Var3T2T_19)};
    }


function apagarVar3Tri19_2Tri19Freg(e) {
    Var3Tri19_2Tri19Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri19_2Tri19Freg(feature, layer) {
    if(feature.properties.Var3T2T_19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri19_2Tri19Freg,
    });
}
var Var3Tri19_2Tri19Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar3Tri19_2Tri19Freg,
    onEachFeature: onEachFeatureVar3Tri19_2Tri19Freg
});

let slideVar3Tri19_2Tri19Freg = function(){
    var sliderVar3Tri19_2Tri19Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 80){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri19_2Tri19Freg, {
        start: [minVar3Tri19_2Tri19Freg, maxVar3Tri19_2Tri19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri19_2Tri19Freg,
            'max': maxVar3Tri19_2Tri19Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri19_2Tri19Freg);
    inputNumberMax.setAttribute("value",maxVar3Tri19_2Tri19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri19_2Tri19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri19_2Tri19Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri19_2Tri19Freg.noUiSlider.on('update',function(e){
        Var3Tri19_2Tri19Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_19 == null){
                return false
            }
            if(layer.feature.properties.Var3T2T_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri19_2Tri19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 80;
    sliderAtivo = sliderVar3Tri19_2Tri19Freg.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri19_2Tri19Freg);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2019 E 2 Trimestre 2019 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2019 E 3 Trimestre 2019 POR FREGUESIA -------------------////

var minVar4Tri19_3Tri19Freg = 99;
var maxVar4Tri19_3Tri19Freg = -99;

function CorVar4Tri19_3Tri19Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#8c0303' :
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
                ''  ;
}
var legendaVar4Tri19_3Tri19Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2019 e o 3º trimestre de 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -24.53 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4Tri19_3Tri19Freg(feature) {
    if(feature.properties.Var4T3T_19 <= minVar4Tri19_3Tri19Freg){
        minVar4Tri19_3Tri19Freg = feature.properties.Var4T3T_19
    }
    if(feature.properties.Var4T3T_19 > maxVar4Tri19_3Tri19Freg){
        maxVar4Tri19_3Tri19Freg = feature.properties.Var4T3T_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri19_3Tri19Freg(feature.properties.Var4T3T_19)};
    }


function apagarVar4Tri19_3Tri19Freg(e) {
    Var4Tri19_3Tri19Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri19_3Tri19Freg(feature, layer) {
    if(feature.properties.Var4T3T_19 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_19.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri19_3Tri19Freg,
    });
}
var Var4Tri19_3Tri19Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar4Tri19_3Tri19Freg,
    onEachFeature: onEachFeatureVar4Tri19_3Tri19Freg
});

let slideVar4Tri19_3Tri19Freg = function(){
    var sliderVar4Tri19_3Tri19Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 81){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri19_3Tri19Freg, {
        start: [minVar4Tri19_3Tri19Freg, maxVar4Tri19_3Tri19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri19_3Tri19Freg,
            'max': maxVar4Tri19_3Tri19Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri19_3Tri19Freg);
    inputNumberMax.setAttribute("value",maxVar4Tri19_3Tri19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri19_3Tri19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri19_3Tri19Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri19_3Tri19Freg.noUiSlider.on('update',function(e){
        Var4Tri19_3Tri19Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_19 == null){
                return false
            }
            if(layer.feature.properties.Var4T3T_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri19_3Tri19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 81;
    sliderAtivo = sliderVar4Tri19_3Tri19Freg.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri19_3Tri19Freg);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2019 E 3 Trimestre 2019 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 1 Trimestre 2020 E 4 Trimestre 2019 POR FREGUESIA -------------------////

var minVar1Tri20_4Tri19Freg = 99;
var maxVar1Tri20_4Tri19Freg = -99;

function CorVar1Tri20_4Tri19Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#8c0303' :
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -16  ? '#9eaad7' :
                ''  ;
}
var legendaVar1Tri20_4Tri19Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 1º trimestre de 2020 e o 4º trimestre de 2019, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15.2 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Tri20_4Tri19Freg(feature) {
    if(feature.properties.Var1T4T_20 <= minVar1Tri20_4Tri19Freg){
        minVar1Tri20_4Tri19Freg = feature.properties.Var1T4T_20
    }
    if(feature.properties.Var1T4T_20 > maxVar1Tri20_4Tri19Freg){
        maxVar1Tri20_4Tri19Freg = feature.properties.Var1T4T_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Tri20_4Tri19Freg(feature.properties.Var1T4T_20)};
    }


function apagarVar1Tri20_4Tri19Freg(e) {
    Var1Tri20_4Tri19Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Tri20_4Tri19Freg(feature, layer) {
    if(feature.properties.Var1T4T_20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1T4T_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Tri20_4Tri19Freg,
    });
}
var Var1Tri20_4Tri19Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar1Tri20_4Tri19Freg,
    onEachFeature: onEachFeatureVar1Tri20_4Tri19Freg
});

let slideVar1Tri20_4Tri19Freg = function(){
    var sliderVar1Tri20_4Tri19Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 82){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Tri20_4Tri19Freg, {
        start: [minVar1Tri20_4Tri19Freg, maxVar1Tri20_4Tri19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Tri20_4Tri19Freg,
            'max': maxVar1Tri20_4Tri19Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar1Tri20_4Tri19Freg);
    inputNumberMax.setAttribute("value",maxVar1Tri20_4Tri19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Tri20_4Tri19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Tri20_4Tri19Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar1Tri20_4Tri19Freg.noUiSlider.on('update',function(e){
        Var1Tri20_4Tri19Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var1T4T_20 == null){
                return false
            }
            if(layer.feature.properties.Var1T4T_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1T4T_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Tri20_4Tri19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 82;
    sliderAtivo = sliderVar1Tri20_4Tri19Freg.noUiSlider;
    $(slidersGeral).append(sliderVar1Tri20_4Tri19Freg);
} 

///////////////////////////// Fim da Variação 1 Trimestre 2020 E 4 Trimestre 2019 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 2 Trimestre 2020 E 1 Trimestre 2020 POR FREGUESIA -------------------////

var minVar2Tri20_1Tri20Freg = 99;
var maxVar2Tri20_1Tri20Freg = -99;

function CorVar2Tri20_1Tri20Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -31  ? '#2288bf' :
                ''  ;
}

var legendaVar2Tri20_1Tri20Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2020 e o 1º trimestre de 2020, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -30.7 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Tri20_1Tri20Freg(feature) {
    if(feature.properties.Var2T1T_20 <= minVar2Tri20_1Tri20Freg){
        minVar2Tri20_1Tri20Freg = feature.properties.Var2T1T_20
    }
    if(feature.properties.Var2T1T_20 > maxVar2Tri20_1Tri20Freg){
        maxVar2Tri20_1Tri20Freg = feature.properties.Var2T1T_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri20_1Tri20Freg(feature.properties.Var2T1T_20)};
    }


function apagarVar2Tri20_1Tri20Freg(e) {
    Var2Tri20_1Tri20Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri20_1Tri20Freg(feature, layer) {
    if(feature.properties.Var2T1T_20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri20_1Tri20Freg,
    });
}
var Var2Tri20_1Tri20Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2Tri20_1Tri20Freg,
    onEachFeature: onEachFeatureVar2Tri20_1Tri20Freg
});

let slideVar2Tri20_1Tri20Freg = function(){
    var sliderVar2Tri20_1Tri20Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 83){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri20_1Tri20Freg, {
        start: [minVar2Tri20_1Tri20Freg, maxVar2Tri20_1Tri20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri20_1Tri20Freg,
            'max': maxVar2Tri20_1Tri20Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri20_1Tri20Freg);
    inputNumberMax.setAttribute("value",maxVar2Tri20_1Tri20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri20_1Tri20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri20_1Tri20Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri20_1Tri20Freg.noUiSlider.on('update',function(e){
        Var2Tri20_1Tri20Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_20 == null){
                return false
            }
            if(layer.feature.properties.Var2T1T_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri20_1Tri20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 83;
    sliderAtivo = sliderVar2Tri20_1Tri20Freg.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri20_1Tri20Freg);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2020 E 1 Trimestre 2020 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2020 E 2 Trimestre 2020 POR FREGUESIA -------------------////

var minVar3Tri20_2Tri20Freg = 99;
var maxVar3Tri20_2Tri20Freg = -99;

function CorVar3Tri20_2Tri20Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 2.5  ? '#f5b3be' :
        d >= 0  ? '#9eaad7' :
        d >= -18  ? '#2288bf' :
                ''  ;
}
var legendaVar3Tri20_2Tri20Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2020 e o 2º trimestre de 2020, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -17.23 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3Tri20_2Tri20Freg(feature) {
    if(feature.properties.Var3T2T_20 <= minVar3Tri20_2Tri20Freg){
        minVar3Tri20_2Tri20Freg = feature.properties.Var3T2T_20
    }
    if(feature.properties.Var3T2T_20 > maxVar3Tri20_2Tri20Freg){
        maxVar3Tri20_2Tri20Freg = feature.properties.Var3T2T_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri20_2Tri20Freg(feature.properties.Var3T2T_20)};
    }


function apagarVar3Tri20_2Tri20Freg(e) {
    Var3Tri20_2Tri20Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri20_2Tri20Freg(feature, layer) {
    if(feature.properties.Var3T2T_20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri20_2Tri20Freg,
    });
}
var Var3Tri20_2Tri20Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar3Tri20_2Tri20Freg,
    onEachFeature: onEachFeatureVar3Tri20_2Tri20Freg
});

let slideVar3Tri20_2Tri20Freg = function(){
    var sliderVar3Tri20_2Tri20Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 84){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri20_2Tri20Freg, {
        start: [minVar3Tri20_2Tri20Freg, maxVar3Tri20_2Tri20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri20_2Tri20Freg,
            'max': maxVar3Tri20_2Tri20Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri20_2Tri20Freg);
    inputNumberMax.setAttribute("value",maxVar3Tri20_2Tri20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri20_2Tri20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri20_2Tri20Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri20_2Tri20Freg.noUiSlider.on('update',function(e){
        Var3Tri20_2Tri20Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_20 == null){
                return false
            }
            if(layer.feature.properties.Var3T2T_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri20_2Tri20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 84;
    sliderAtivo = sliderVar3Tri20_2Tri20Freg.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri20_2Tri20Freg);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2020 E 2 Trimestre 2020 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2020 E 3 Trimestre 2020 POR FREGUESIA -------------------////

var minVar4Tri20_3Tri20Freg = 99;
var maxVar4Tri20_3Tri20Freg = -99;

function CorVar4Tri20_3Tri20Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -27.01  ? '#2288bf' :
                ''  ;
}
var legendaVar4Tri20_3Tri20Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2020 e o 3º trimestre de 2020, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -27 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4Tri20_3Tri20Freg(feature) {
    if(feature.properties.Var4T3T_20 <= minVar4Tri20_3Tri20Freg){
        minVar4Tri20_3Tri20Freg = feature.properties.Var4T3T_20
    }
    if(feature.properties.Var4T3T_20 > maxVar4Tri20_3Tri20Freg){
        maxVar4Tri20_3Tri20Freg = feature.properties.Var4T3T_20 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri20_3Tri20Freg(feature.properties.Var4T3T_20)};
    }


function apagarVar4Tri20_3Tri20Freg(e) {
    Var4Tri20_3Tri20Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri20_3Tri20Freg(feature, layer) {
    if(feature.properties.Var4T3T_20 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_20.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri20_3Tri20Freg,
    });
}
var Var4Tri20_3Tri20Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar4Tri20_3Tri20Freg,
    onEachFeature: onEachFeatureVar4Tri20_3Tri20Freg
});

let slideVar4Tri20_3Tri20Freg = function(){
    var sliderVar4Tri20_3Tri20Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 85){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri20_3Tri20Freg, {
        start: [minVar4Tri20_3Tri20Freg, maxVar4Tri20_3Tri20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri20_3Tri20Freg,
            'max': maxVar4Tri20_3Tri20Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri20_3Tri20Freg);
    inputNumberMax.setAttribute("value",maxVar4Tri20_3Tri20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri20_3Tri20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri20_3Tri20Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri20_3Tri20Freg.noUiSlider.on('update',function(e){
        Var4Tri20_3Tri20Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_20 == null){
                return false
            }
            if(layer.feature.properties.Var4T3T_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri20_3Tri20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 85;
    sliderAtivo = sliderVar4Tri20_3Tri20Freg.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri20_3Tri20Freg);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2020 E 3 Trimestre 2020 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 1 Trimestre 2021 E 4 Trimestre 2020 POR FREGUESIA -------------------////

var minVar1Tri21_4Tri20Freg = 99;
var maxVar1Tri21_4Tri20Freg = -99;

function CorVar1Tri21_4Tri20Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -27.47  ? '#2288bf' :
                ''  ;
}
var legendaVar1Tri21_4Tri20Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 1º trimestre de 2021 e o 4º trimestre de 2020, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -27.46 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar1Tri21_4Tri20Freg(feature) {
    if(feature.properties.Var1T4T_21 <= minVar1Tri21_4Tri20Freg){
        minVar1Tri21_4Tri20Freg = feature.properties.Var1T4T_21
    }
    if(feature.properties.Var1T4T_21 > maxVar1Tri21_4Tri20Freg){
        maxVar1Tri21_4Tri20Freg = feature.properties.Var1T4T_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar1Tri21_4Tri20Freg(feature.properties.Var1T4T_21)};
    }


function apagarVar1Tri21_4Tri20Freg(e) {
    Var1Tri21_4Tri20Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar1Tri21_4Tri20Freg(feature, layer) {
    if(feature.properties.Var1T4T_21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var1T4T_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar1Tri21_4Tri20Freg,
    });
}
var Var1Tri21_4Tri20Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar1Tri21_4Tri20Freg,
    onEachFeature: onEachFeatureVar1Tri21_4Tri20Freg
});

let slideVar1Tri21_4Tri20Freg = function(){
    var sliderVar1Tri21_4Tri20Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 86){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar1Tri21_4Tri20Freg, {
        start: [minVar1Tri21_4Tri20Freg, maxVar1Tri21_4Tri20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar1Tri21_4Tri20Freg,
            'max': maxVar1Tri21_4Tri20Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar1Tri21_4Tri20Freg);
    inputNumberMax.setAttribute("value",maxVar1Tri21_4Tri20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar1Tri21_4Tri20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar1Tri21_4Tri20Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar1Tri21_4Tri20Freg.noUiSlider.on('update',function(e){
        Var1Tri21_4Tri20Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var1T4T_21 == null){
                return false
            }
            if(layer.feature.properties.Var1T4T_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var1T4T_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar1Tri21_4Tri20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 86;
    sliderAtivo = sliderVar1Tri21_4Tri20Freg.noUiSlider;
    $(slidersGeral).append(sliderVar1Tri21_4Tri20Freg);
} 

///////////////////////////// Fim da Variação 1 Trimestre 2021 E 4 Trimestre 2020 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 2 Trimestre 2021 E 1 Trimestre 2021 POR FREGUESIA -------------------////

var minVar2Tri21_1Tri21Freg = 99;
var maxVar2Tri21_1Tri21Freg = -99;

function CorVar2Tri21_1Tri21Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -16.92  ? '#2288bf' :
                ''  ;
}
var legendaVar2Tri21_1Tri21Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 2º trimestre de 2021 e o 1º trimestre de 2021, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -16.91 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2Tri21_1Tri21Freg(feature) {
    if(feature.properties.Var2T1T_21 <= minVar2Tri21_1Tri21Freg){
        minVar2Tri21_1Tri21Freg = feature.properties.Var2T1T_21
    }
    if(feature.properties.Var2T1T_21 > maxVar2Tri21_1Tri21Freg){
        maxVar2Tri21_1Tri21Freg = feature.properties.Var2T1T_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2Tri21_1Tri21Freg(feature.properties.Var2T1T_21)};
    }


function apagarVar2Tri21_1Tri21Freg(e) {
    Var2Tri21_1Tri21Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2Tri21_1Tri21Freg(feature, layer) {
    if(feature.properties.Var2T1T_21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var2T1T_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2Tri21_1Tri21Freg,
    });
}
var Var2Tri21_1Tri21Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar2Tri21_1Tri21Freg,
    onEachFeature: onEachFeatureVar2Tri21_1Tri21Freg
});

let slideVar2Tri21_1Tri21Freg = function(){
    var sliderVar2Tri21_1Tri21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 87){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2Tri21_1Tri21Freg, {
        start: [minVar2Tri21_1Tri21Freg, maxVar2Tri21_1Tri21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2Tri21_1Tri21Freg,
            'max': maxVar2Tri21_1Tri21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar2Tri21_1Tri21Freg);
    inputNumberMax.setAttribute("value",maxVar2Tri21_1Tri21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2Tri21_1Tri21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2Tri21_1Tri21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar2Tri21_1Tri21Freg.noUiSlider.on('update',function(e){
        Var2Tri21_1Tri21Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var2T1T_21 == null){
                return false
            }
            if(layer.feature.properties.Var2T1T_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var2T1T_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2Tri21_1Tri21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 87;
    sliderAtivo = sliderVar2Tri21_1Tri21Freg.noUiSlider;
    $(slidersGeral).append(sliderVar2Tri21_1Tri21Freg);
} 

///////////////////////////// Fim da Variação 2 Trimestre 2021 E 1 Trimestre 2021 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 3 Trimestre 2021 E 2 Trimestre 2021 POR FREGUESIA -------------------////

var minVar3Tri21_2Tri21Freg = 99;
var maxVar3Tri21_2Tri21Freg = -99;

function CorVar3Tri21_2Tri21Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -27.55  ? '#2288bf' :
                ''  ;
}
var legendaVar3Tri21_2Tri21Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 3º trimestre de 2021 e o 2º trimestre de 2021, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -27.54 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar3Tri21_2Tri21Freg(feature) {
    if(feature.properties.Var3T2T_21 <= minVar3Tri21_2Tri21Freg){
        minVar3Tri21_2Tri21Freg = feature.properties.Var3T2T_21
    }
    if(feature.properties.Var3T2T_21 > maxVar3Tri21_2Tri21Freg){
        maxVar3Tri21_2Tri21Freg = feature.properties.Var3T2T_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar3Tri21_2Tri21Freg(feature.properties.Var3T2T_21)};
    }


function apagarVar3Tri21_2Tri21Freg(e) {
    Var3Tri21_2Tri21Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar3Tri21_2Tri21Freg(feature, layer) {
    if(feature.properties.Var3T2T_21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var3T2T_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar3Tri21_2Tri21Freg,
    });
}
var Var3Tri21_2Tri21Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar3Tri21_2Tri21Freg,
    onEachFeature: onEachFeatureVar3Tri21_2Tri21Freg
});

let slideVar3Tri21_2Tri21Freg = function(){
    var sliderVar3Tri21_2Tri21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 88){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar3Tri21_2Tri21Freg, {
        start: [minVar3Tri21_2Tri21Freg, maxVar3Tri21_2Tri21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar3Tri21_2Tri21Freg,
            'max': maxVar3Tri21_2Tri21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar3Tri21_2Tri21Freg);
    inputNumberMax.setAttribute("value",maxVar3Tri21_2Tri21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar3Tri21_2Tri21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar3Tri21_2Tri21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar3Tri21_2Tri21Freg.noUiSlider.on('update',function(e){
        Var3Tri21_2Tri21Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var3T2T_21 == null){
                return false
            }
            if(layer.feature.properties.Var3T2T_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var3T2T_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar3Tri21_2Tri21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 88;
    sliderAtivo = sliderVar3Tri21_2Tri21Freg.noUiSlider;
    $(slidersGeral).append(sliderVar3Tri21_2Tri21Freg);
} 

///////////////////////////// Fim da Variação 3 Trimestre 2021 E 2 Trimestre 2021 POR FREGUESIAS -------------- \\\\\

/////////////////////////////------- Variação 4 Trimestre 2021 E 3 Trimestre 2021 POR FREGUESIA -------------------////

var minVar4Tri21_3Tri21Freg = 99;
var maxVar4Tri21_3Tri21Freg = -99;

function CorVar4Tri21_3Tri21Freg(d) {
    return d === null ? '#808080':
        d >= 10  ? '#8c0303' :
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -17  ? '#9eaad7' :
                ''  ;
}

var legendaVar4Tri21_3Tri21Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do valor mediano das vendas por m² de de alojamentos familiares, entre o 4º trimestre de 2021 e o 3º trimestre de 2021, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -16.61 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Sem informação disponível' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar4Tri21_3Tri21Freg(feature) {
    if(feature.properties.Var4T3T_21 <= minVar4Tri21_3Tri21Freg){
        minVar4Tri21_3Tri21Freg = feature.properties.Var4T3T_21
    }
    if(feature.properties.Var4T3T_21 > maxVar4Tri21_3Tri21Freg){
        maxVar4Tri21_3Tri21Freg = feature.properties.Var4T3T_21 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar4Tri21_3Tri21Freg(feature.properties.Var4T3T_21)};
    }


function apagarVar4Tri21_3Tri21Freg(e) {
    Var4Tri21_3Tri21Freg.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar4Tri21_3Tri21Freg(feature, layer) {
    if(feature.properties.Var4T3T_21 === null){
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Variação: ' + '<b>' + 'Sem informação disponível' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var4T3T_21.toFixed(2) + '</b>' + '%').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar4Tri21_3Tri21Freg,
    });
}
var Var4Tri21_3Tri21Freg= L.geoJSON(dadosRelativosFreguesias, {
    style:EstiloVar4Tri21_3Tri21Freg,
    onEachFeature: onEachFeatureVar4Tri21_3Tri21Freg
});

let slideVar4Tri21_3Tri21Freg = function(){
    var sliderVar4Tri21_3Tri21Freg = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 92){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar4Tri21_3Tri21Freg, {
        start: [minVar4Tri21_3Tri21Freg, maxVar4Tri21_3Tri21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar4Tri21_3Tri21Freg,
            'max': maxVar4Tri21_3Tri21Freg
        },
        });
    inputNumberMin.setAttribute("value",minVar4Tri21_3Tri21Freg);
    inputNumberMax.setAttribute("value",maxVar4Tri21_3Tri21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderVar4Tri21_3Tri21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar4Tri21_3Tri21Freg.noUiSlider.set([null, this.value]);
    });

    sliderVar4Tri21_3Tri21Freg.noUiSlider.on('update',function(e){
        Var4Tri21_3Tri21Freg.eachLayer(function(layer){
            if(layer.feature.properties.Var4T3T_21 == null){
                return false
            }
            if(layer.feature.properties.Var4T3T_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var4T3T_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar4Tri21_3Tri21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 92;
    sliderAtivo = sliderVar4Tri21_3Tri21Freg.noUiSlider;
    $(slidersGeral).append(sliderVar4Tri21_3Tri21Freg);
} 

///////////////////////////// Fim da Variação 4 Trimestre 2021 E 3 Trimestre 2021 POR FREGUESIAS -------------- \\\\\






/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = Preco1Trimestre16Conc;
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
    if (layer == Preco1Trimestre16Conc && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2016, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco1Trimestre16Conc();
        naoDuplicar = 1;
    }
    if (layer == Preco1Trimestre16Conc && naoDuplicar == 1){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2016, por concelho' + '</strong>');

    }
    if (layer == Preco2Trimestre16Conc && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2016, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco2Trimestre16Conc();
        naoDuplicar = 2;
    }
    if (layer == Preco3Trimestre16Conc && naoDuplicar != 3){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2016, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco3Trimestre16Conc();
        naoDuplicar = 3;
    }
    if (layer == Preco4Trimestre16Conc && naoDuplicar != 4){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2016, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco4Trimestre16Conc();
        naoDuplicar = 4;
    }
    if (layer == Preco1Trimestre17Conc && naoDuplicar != 5){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2017, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco1Trimestre17Conc();
        naoDuplicar = 5;
    }
    if (layer == Preco2Trimestre17Conc && naoDuplicar != 6){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2017, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco2Trimestre17Conc();
        naoDuplicar = 6;
    }
    if (layer == Preco3Trimestre17Conc && naoDuplicar != 7){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2017, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco3Trimestre17Conc();
        naoDuplicar = 7;
    }
    if (layer == Preco4Trimestre17Conc && naoDuplicar != 8){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2017, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco4Trimestre17Conc();
        naoDuplicar = 8;
    }
    if (layer == Preco1Trimestre18Conc && naoDuplicar != 9){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2018, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco1Trimestre18Conc();
        naoDuplicar = 9;
    }
    if (layer == Preco2Trimestre18Conc && naoDuplicar != 10){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2018, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco2Trimestre18Conc();
        naoDuplicar = 10;
    }
    if (layer == Preco3Trimestre18Conc && naoDuplicar != 11){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2018, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco3Trimestre18Conc();
        naoDuplicar = 11;
    }
    if (layer == Preco4Trimestre18Conc && naoDuplicar != 12){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2018, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco4Trimestre18Conc();
        naoDuplicar = 12;
    }
    if (layer == Preco1Trimestre19Conc && naoDuplicar != 13){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2019, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco1Trimestre19Conc();
        naoDuplicar = 13;
    }
    if (layer == Preco2Trimestre19Conc && naoDuplicar != 14){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2019, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco2Trimestre19Conc();
        naoDuplicar = 14;
    }
    if (layer == Preco3Trimestre19Conc && naoDuplicar != 15){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2019, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco3Trimestre19Conc();
        naoDuplicar = 15;
    }
    if (layer == Preco4Trimestre19Conc && naoDuplicar != 16){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2019, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco4Trimestre19Conc();
        naoDuplicar = 16;
    }
    if (layer == Preco1Trimestre20Conc && naoDuplicar != 17){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2020, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco1Trimestre20Conc();
        naoDuplicar = 17;
    }
    if (layer == Preco2Trimestre20Conc && naoDuplicar != 18){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2020, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco2Trimestre20Conc();
        naoDuplicar = 18;
    }
    if (layer == Preco3Trimestre20Conc && naoDuplicar != 19){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2020, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco3Trimestre20Conc();
        naoDuplicar = 19;
    }
    if (layer == Preco4Trimestre20Conc && naoDuplicar != 20){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2020, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco4Trimestre20Conc();
        naoDuplicar = 20;
    }
    if (layer == Preco1Trimestre21Conc && naoDuplicar != 21){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2021, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco1Trimestre21Conc();
        naoDuplicar = 21;
    }
    if (layer == Preco2Trimestre21Conc && naoDuplicar != 22){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2021, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco2Trimestre21Conc();
        naoDuplicar = 22;
    }
    if (layer == Preco3Trimestre21Conc && naoDuplicar != 23){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2021, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco3Trimestre21Conc();
        naoDuplicar = 23;
    }
    if (layer == Preco4Trimestre21Conc && naoDuplicar != 89){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2021, por concelho' + '</strong>');
        legendaPerPrecosVendasConc();
        slidePreco4Trimestre21Conc();
        naoDuplicar = 89;
    }
    if (layer == Preco1TrimestreFreg16 && naoDuplicar != 45){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2016, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco1TrimestreFreg16();
        naoDuplicar = 45;
    }
    if (layer == Preco2TrimestreFreg16 && naoDuplicar != 46){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2016, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco2TrimestreFreg16();
        naoDuplicar = 46;
    }
    if (layer == Preco3TrimestreFreg16 && naoDuplicar != 47){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2016, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco3TrimestreFreg16();
        naoDuplicar = 47;
    }
    if (layer == Preco4TrimestreFreg16 && naoDuplicar != 48){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2016, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco4TrimestreFreg16();
        naoDuplicar = 48;
    }
    if (layer == Preco1TrimestreFreg17 && naoDuplicar != 49){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2017, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco1TrimestreFreg17();
        naoDuplicar = 49;
    }
    if (layer == Preco2TrimestreFreg17 && naoDuplicar != 50){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2017, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco2TrimestreFreg17();
        naoDuplicar = 50;
    }
    if (layer == Preco3TrimestreFreg17 && naoDuplicar != 51){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2017, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco3TrimestreFreg17();
        naoDuplicar = 51;
    }
    if (layer == Preco4TrimestreFreg17 && naoDuplicar != 52){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2017, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco4TrimestreFreg17();
        naoDuplicar = 52;
    }
    if (layer == Preco1TrimestreFreg18 && naoDuplicar != 53){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2018, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco1TrimestreFreg18();
        naoDuplicar = 53;
    }
    if (layer == Preco2TrimestreFreg18 && naoDuplicar != 54){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2018, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco2TrimestreFreg18();
        naoDuplicar = 54;
    }
    if (layer == Preco3TrimestreFreg18 && naoDuplicar != 55){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2018, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco3TrimestreFreg18();
        naoDuplicar = 55;
    }
    if (layer == Preco4TrimestreFreg18 && naoDuplicar != 56){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2018, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco4TrimestreFreg18();
        naoDuplicar = 56;
    }
    if (layer == Preco1TrimestreFreg19 && naoDuplicar != 57){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2019, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco1TrimestreFreg19();
        naoDuplicar = 57;
    }
    if (layer == Preco2TrimestreFreg19 && naoDuplicar != 58){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2019, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco2TrimestreFreg19();
        naoDuplicar = 58;
    }
    if (layer == Preco3TrimestreFreg19 && naoDuplicar != 59){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2019, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco3TrimestreFreg19();
        naoDuplicar = 59;
    }
    if (layer == Preco4TrimestreFreg19 && naoDuplicar != 60){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2019, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco4TrimestreFreg19();
        naoDuplicar = 60;
    }
    if (layer == Preco1TrimestreFreg20 && naoDuplicar != 61){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2020, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco1TrimestreFreg20();
        naoDuplicar = 61;
    }
    if (layer == Preco2TrimestreFreg20 && naoDuplicar != 62){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2020, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco2TrimestreFreg20();
        naoDuplicar = 62;
    }
    if (layer == Preco3TrimestreFreg20 && naoDuplicar != 63){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2020, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco3TrimestreFreg20();
        naoDuplicar = 63;
    }
    if (layer == Preco4TrimestreFreg20 && naoDuplicar != 64){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2020, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco4TrimestreFreg20();
        naoDuplicar = 64;
    }
    if (layer == Preco1TrimestreFreg21 && naoDuplicar != 65){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 1º Trimestre de 2021, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco1TrimestreFreg21();
        naoDuplicar = 65;
    }
    if (layer == Preco2TrimestreFreg21 && naoDuplicar != 66){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 2º Trimestre de 2021, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco2TrimestreFreg21();
        naoDuplicar = 66;
    }
    if (layer == Preco3TrimestreFreg21 && naoDuplicar != 67){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 3º Trimestre de 2021, por freguesia' + '</strong>');
        legendaPerPrecosVendasFreg();
        slidePreco3TrimestreFreg21();
        naoDuplicar = 67;
    }
    if (layer == Preco4TrimestreFreg21 && naoDuplicar != 91){
        $('#tituloMapa').html(' <strong>' + 'Valor mediano das vendas por m² de alojamentos familiares, no 4º Trimestre de 2021, por freguesia' + '</strong>')
        legendaPerPrecosVendasFreg();
        slidePreco4TrimestreFreg21();
        naoDuplicar = 91;
    }
    if (layer == Var2Tri16_1Tri16Conc && naoDuplicar != 24){
        legendaVar2Tri16_1Tri16Conc();
        slideVar2Tri16_1Tri16Conc();
        naoDuplicar = 24;
    }
    if (layer == Var3Tri16_2Tri16Conc && naoDuplicar != 93){
        legendaVar3Tri16_2Tri16Conc();
        slideVar3Tri16_2Tri16Conc();
        naoDuplicar = 93;
    }
    if (layer == Var4Tri16_3Tri16Conc && naoDuplicar != 25){
        legendaVar4Tri16_3Tri16Conc();
        slideVar4Tri16_3Tri16Conc();
        naoDuplicar = 25;
    }
    if (layer == Var1Tri17_4Tri16Conc && naoDuplicar != 26){
        legendaVar1Tri17_4Tri16Conc();
        slideVar1Tri17_4Tri16Conc();
        naoDuplicar = 26;
    }
    if (layer == Var2Tri17_1Tri17Conc && naoDuplicar != 27){
        legendaVar2Tri17_1Tri17Conc();
        slideVar2Tri17_1Tri17Conc();
        naoDuplicar = 27;
    }
    if (layer == Var3Tri17_2Tri17Conc && naoDuplicar != 28){
        legendaVar3Tri17_2Tri17Conc();
        slideVar3Tri17_2Tri17Conc();
        naoDuplicar = 28;
    }
    if (layer == Var4Tri17_3Tri17Conc && naoDuplicar != 29){
        legendaVar4Tri17_3Tri17Conc();
        slideVar4Tri17_3Tri17Conc();
        naoDuplicar = 29;
    }
    if (layer == Var1Tri18_4Tri17Conc && naoDuplicar != 30){
        legendaVar1Tri18_4Tri17Conc();
        slideVar1Tri18_4Tri17Conc();
        naoDuplicar = 30;
    }
    if (layer == Var2Tri18_1Tri18Conc && naoDuplicar != 31){
        legendaVar2Tri18_1Tri18Conc();
        slideVar2Tri18_1Tri18Conc();
        naoDuplicar = 31;
    }
    if (layer == Var3Tri18_2Tri18Conc && naoDuplicar != 32){
        legendaVar3Tri18_2Tri18Conc();
        slideVar3Tri18_2Tri18Conc();
        naoDuplicar = 32;
    }
    if (layer == Var4Tri18_3Tri18Conc && naoDuplicar != 33){
        legendaVar4Tri18_3Tri18Conc();
        slideVar4Tri18_3Tri18Conc();
        naoDuplicar = 33;
    }
    if (layer == Var1Tri19_4Tri18Conc && naoDuplicar != 34){
        legendaVar1Tri19_4Tri18Conc();
        slideVar1Tri19_4Tri18Conc();
        naoDuplicar = 34;
    }
    if (layer == Var2Tri19_1Tri19Conc && naoDuplicar != 35){
        legendaVar2Tri19_1Tri19Conc();
        slideVar2Tri19_1Tri19Conc();
        naoDuplicar = 35;
    }
    if (layer == Var3Tri19_2Tri19Conc && naoDuplicar != 36){
        legendaVar3Tri19_2Tri19Conc();
        slideVar3Tri19_2Tri19Conc();
        naoDuplicar = 36;
    }
    if (layer == Var4Tri19_3Tri19Conc && naoDuplicar != 37){
        legendaVar4Tri19_3Tri19Conc();
        slideVar4Tri19_3Tri19Conc();
        naoDuplicar = 37;
    }
    if (layer == Var1Tri20_4Tri19Conc && naoDuplicar != 38){
        legendaVar1Tri20_4Tri19Conc();
        slideVar1Tri20_4Tri19Conc();
        naoDuplicar = 38;
    }
    if (layer == Var2Tri20_1Tri20Conc && naoDuplicar != 39){
        legendaVar2Tri20_1Tri20Conc();
        slideVar2Tri20_1Tri20Conc();
        naoDuplicar = 39;
    }
    if (layer == Var3Tri20_2Tri20Conc && naoDuplicar != 40){
        legendaVar3Tri20_2Tri20Conc();
        slideVar3Tri20_2Tri20Conc();
        naoDuplicar = 40;
    }
    if (layer == Var4Tri20_3Tri20Conc && naoDuplicar != 41){
        legendaVar4Tri20_3Tri20Conc();
        slideVar4Tri20_3Tri20Conc();
        naoDuplicar = 41;
    }
    if (layer == Var1Tri21_4Tri20Conc && naoDuplicar != 42){
        legendaVar1Tri21_4Tri20Conc();
        slideVar1Tri21_4Tri20Conc();
        naoDuplicar = 42;
    }
    if (layer == Var2Tri21_1Tri21Conc && naoDuplicar != 43){
        legendaVar2Tri21_1Tri21Conc();
        slideVar2Tri21_1Tri21Conc();
        naoDuplicar = 43;
    }
    if (layer == Var3Tri21_2Tri21Conc && naoDuplicar != 44){
        legendaVar3Tri21_2Tri21Conc();
        slideVar3Tri21_2Tri21Conc();
        naoDuplicar = 44;
    }
    if (layer == Var4Tri21_3Tri21Conc && naoDuplicar != 90){
        legendaVar4Tri21_3Tri21Conc();
        slideVar4Tri21_3Tri21Conc();
        naoDuplicar = 90;
    }
    if (layer == Var2Tri16_1Tri16Freg && naoDuplicar != 68){
        legendaVar2Tri16_1Tri16Freg();
        slideVar2Tri16_1Tri16Freg();
        naoDuplicar = 68;
    }
    if (layer == Var3Tri16_2Tri16Freg && naoDuplicar != 69){
        legendaVar3Tri16_2Tri16Freg();
        slideVar3Tri16_2Tri16Freg();
        naoDuplicar = 69;
    }
    if (layer == Var4Tri16_3Tri16Freg && naoDuplicar != 70){
        legendaVar4Tri16_3Tri16Freg();
        slideVar4Tri16_3Tri16Freg();
        naoDuplicar = 70;
    }
    if (layer == Var1Tri17_4Tri16Freg && naoDuplicar != 71){
        legendaVar1Tri17_4Tri16Freg();
        slideVar1Tri17_4Tri16Freg();
        naoDuplicar = 71;
    }
    if (layer == Var2Tri17_1Tri17Freg && naoDuplicar != 72){
        legendaVar2Tri17_1Tri17Freg();
        slideVar2Tri17_1Tri17Freg();
        naoDuplicar = 72;
    }
    if (layer == Var3Tri17_2Tri17Freg && naoDuplicar != 73){
        legendaVar3Tri17_2Tri17Freg();
        slideVar3Tri17_2Tri17Freg();
        naoDuplicar = 73;
    }
    if (layer == Var4Tri17_3Tri17Freg && naoDuplicar != 74){
        legendaVar4Tri17_3Tri17Freg();
        slideVar4Tri17_3Tri17Freg();
        naoDuplicar = 74;
    }
    if (layer == Var1Tri18_4Tri17Freg && naoDuplicar != 75){
        legendaVar1Tri18_4Tri17Freg();
        slideVar1Tri18_4Tri17Freg();
        naoDuplicar = 75;
    }
    if (layer == Var2Tri18_1Tri18Freg && naoDuplicar != 76){
        legendaVar2Tri18_1Tri18Freg();
        slideVar2Tri18_1Tri18Freg();
        naoDuplicar = 76;
    }
    if (layer == Var3Tri18_2Tri18Freg && naoDuplicar != 94){
        legendaVar3Tri18_2Tri18Freg();
        slideVar3Tri18_2Tri18Freg();
        naoDuplicar = 94;
    }
    if (layer == Var4Tri18_3Tri18Freg && naoDuplicar != 77){
        legendaVar4Tri18_3Tri18Freg();
        slideVar4Tri18_3Tri18Freg();
        naoDuplicar = 77;
    }
    if (layer == Var1Tri19_4Tri18Freg && naoDuplicar != 78){
        legendaVar1Tri19_4Tri18Freg();
        slideVar1Tri19_4Tri18Freg();
        naoDuplicar = 78;
    }
    if (layer == Var2Tri19_1Tri19Freg && naoDuplicar != 79){
        legendaVar2Tri19_1Tri19Freg();
        slideVar2Tri19_1Tri19Freg();
        naoDuplicar = 79;
    }
    if (layer == Var3Tri19_2Tri19Freg && naoDuplicar != 80){
        legendaVar3Tri19_2Tri19Freg();
        slideVar3Tri19_2Tri19Freg();
        naoDuplicar = 80;
    }
    if (layer == Var4Tri19_3Tri19Freg && naoDuplicar != 81){
        legendaVar4Tri19_3Tri19Freg();
        slideVar4Tri19_3Tri19Freg();
        naoDuplicar = 81;
    }
    if (layer == Var1Tri20_4Tri19Freg && naoDuplicar != 82){
        legendaVar1Tri20_4Tri19Freg();
        slideVar1Tri20_4Tri19Freg();
        naoDuplicar = 82;
    }
    if (layer == Var2Tri20_1Tri20Freg && naoDuplicar != 83){
        legendaVar2Tri20_1Tri20Freg();
        slideVar2Tri20_1Tri20Freg();
        naoDuplicar = 83;
    }
    if (layer == Var3Tri20_2Tri20Freg && naoDuplicar != 84){
        legendaVar3Tri20_2Tri20Freg();
        slideVar3Tri20_2Tri20Freg();
        naoDuplicar = 84;
    }
    if (layer == Var4Tri20_3Tri20Freg && naoDuplicar != 85){
        legendaVar4Tri20_3Tri20Freg();
        slideVar4Tri20_3Tri20Freg();
        naoDuplicar = 85;
    }
    if (layer == Var1Tri21_4Tri20Freg && naoDuplicar != 86){
        legendaVar1Tri21_4Tri20Freg();
        slideVar1Tri21_4Tri20Freg();
        naoDuplicar = 86;
    }
    if (layer == Var2Tri21_1Tri21Freg && naoDuplicar != 87){
        legendaVar2Tri21_1Tri21Freg();
        slideVar2Tri21_1Tri21Freg();
        naoDuplicar = 87;
    }
    if (layer == Var3Tri21_2Tri21Freg && naoDuplicar != 88){
        legendaVar3Tri21_2Tri21Freg();
        slideVar3Tri21_2Tri21Freg();
        naoDuplicar = 88;
    }
    if (layer == Var4Tri21_3Tri21Freg && naoDuplicar != 92){
        legendaVar4Tri21_3Tri21Freg();
        slideVar4Tri21_3Tri21Freg();
        naoDuplicar = 92;
    }
   
    layer.addTo(map);
    layerAtiva = layer;  
}

function myFunction() {
    var trimestre = document.getElementById("trimestres").value;
    var ano = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#percentagem').hasClass('active4')){
            if (ano == "2016" && trimestre == "1"){
                novaLayer(Preco1Trimestre16Conc)
            }
            if (ano == "2016" && trimestre == "2"){
                novaLayer(Preco2Trimestre16Conc)
            }
            if (ano == "2016" && trimestre == "3"){
                novaLayer(Preco3Trimestre16Conc)
            }
            if (ano == "2016" && trimestre == "4"){
                novaLayer(Preco4Trimestre16Conc)
            }
            if (ano == "2017" && trimestre == "1"){
                novaLayer(Preco1Trimestre17Conc)
            }
            if (ano == "2017" && trimestre == "2"){
                novaLayer(Preco2Trimestre17Conc)
            }
            if (ano == "2017" && trimestre == "3"){
                novaLayer(Preco3Trimestre17Conc)
            }
            if (ano == "2017" && trimestre == "4"){
                novaLayer(Preco4Trimestre17Conc)
            }
            if (ano == "2018" && trimestre == "1"){
                novaLayer(Preco1Trimestre18Conc)
            }
            if (ano == "2018" && trimestre == "2"){
                novaLayer(Preco2Trimestre18Conc)
            }
            if (ano == "2018" && trimestre == "3"){
                novaLayer(Preco3Trimestre18Conc)
            }
            if (ano == "2018" && trimestre == "4"){
                novaLayer(Preco4Trimestre18Conc)
            }
            if (ano == "2019" && trimestre == "1"){
                novaLayer(Preco1Trimestre19Conc)
            }
            if (ano == "2019" && trimestre == "2"){
                novaLayer(Preco2Trimestre19Conc)
            }
            if (ano == "2019" && trimestre == "3"){
                novaLayer(Preco3Trimestre19Conc)
            }
            if (ano == "2019" && trimestre == "4"){
                novaLayer(Preco4Trimestre19Conc)
            }
            if (ano == "2020" && trimestre == "1"){
                novaLayer(Preco1Trimestre20Conc)
            }
            if (ano == "2020" && trimestre == "2"){
                novaLayer(Preco2Trimestre20Conc)
            }
            if (ano == "2020" && trimestre == "3"){
                novaLayer(Preco3Trimestre20Conc)
            }
            if (ano == "2020" && trimestre == "4"){
                novaLayer(Preco4Trimestre20Conc)
            }
            if (ano == "2021" && trimestre == "1"){
                novaLayer(Preco1Trimestre21Conc)
            }
            if (ano == "2021" && trimestre == "2"){
                novaLayer(Preco2Trimestre21Conc)
            }
            if (ano == "2021" && trimestre == "3"){
                novaLayer(Preco3Trimestre21Conc)
            }
            if (ano == "2021" && trimestre == "4"){
                novaLayer(Preco4Trimestre21Conc)
            }
        }
        if ($('#taxaVariacao').hasClass('active4')){
            VariacaoCondicionantes();
            if (ano == "2016"){
                if (trimestre == "2"){
                    novaLayer(Var2Tri16_1Tri16Conc)
                }
                if (trimestre == "3"){
                    novaLayer(Var3Tri16_2Tri16Conc)
                }
                if (trimestre == "4"){
                    novaLayer(Var4Tri16_3Tri16Conc)
                }
            }
            if (ano == "2017"){
                if (trimestre == "1"){
                    novaLayer(Var1Tri17_4Tri16Conc)
                }
                if (trimestre == "2"){
                    novaLayer(Var2Tri17_1Tri17Conc)
                }
                if (trimestre == "3"){
                    novaLayer(Var3Tri17_2Tri17Conc)
                }
                if (trimestre == "4"){
                    novaLayer(Var4Tri17_3Tri17Conc)
                }
            }
            if (ano == "2018"){
                if (trimestre == "1"){
                    novaLayer(Var1Tri18_4Tri17Conc)
                }
                if (trimestre == "2"){
                    novaLayer(Var2Tri18_1Tri18Conc)
                }
                if (trimestre == "3"){
                    novaLayer(Var3Tri18_2Tri18Conc)
                }
                if (trimestre == "4"){
                    novaLayer(Var4Tri18_3Tri18Conc)
                }
            }
            if (ano == "2019"){
                if (trimestre == "1"){
                    novaLayer(Var1Tri19_4Tri18Conc)
                }
                if (trimestre == "2"){
                    novaLayer(Var2Tri19_1Tri19Conc)
                }
                if (trimestre == "3"){
                    novaLayer(Var3Tri19_2Tri19Conc)
                }
                if (trimestre == "4"){
                    novaLayer(Var4Tri19_3Tri19Conc)
                }
            }
            if (ano == "2020"){
                if (trimestre == "1"){
                    novaLayer(Var1Tri20_4Tri19Conc)
                }
                if (trimestre == "2"){
                    novaLayer(Var2Tri20_1Tri20Conc)
                }
                if (trimestre == "3"){
                    novaLayer(Var3Tri20_2Tri20Conc)
                }
                if (trimestre == "4"){
                    novaLayer(Var4Tri20_3Tri20Conc)
                }
            }
            if (ano == "2021"){
                if (trimestre == "1"){
                    novaLayer(Var1Tri21_4Tri20Conc)
                }
                if (trimestre == "2"){
                    novaLayer(Var2Tri21_1Tri21Conc)
                }
                if (trimestre == "3"){
                    novaLayer(Var3Tri21_2Tri21Conc)
                }
                if (trimestre == "4"){
                    novaLayer(Var4Tri21_3Tri21Conc)
                }
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#percentagem').hasClass('active5')){
            if (ano == "2016" && trimestre == "1"){
                novaLayer(Preco1TrimestreFreg16)
            }
            if (ano == "2016" && trimestre == "2"){
                novaLayer(Preco2TrimestreFreg16)
            }
            if (ano == "2016" && trimestre == "3"){
                novaLayer(Preco3TrimestreFreg16)
            }
            if (ano == "2016" && trimestre == "4"){
                novaLayer(Preco4TrimestreFreg16)
            }
            if (ano == "2017" && trimestre == "1"){
                novaLayer(Preco1TrimestreFreg17)
            }
            if (ano == "2017" && trimestre == "2"){
                novaLayer(Preco2TrimestreFreg17)
            }
            if (ano == "2017" && trimestre == "3"){
                novaLayer(Preco3TrimestreFreg17)
            }
            if (ano == "2017" && trimestre == "4"){
                novaLayer(Preco4TrimestreFreg17)
            }
            if (ano == "2018" && trimestre == "1"){
                novaLayer(Preco1TrimestreFreg18)
            }
            if (ano == "2018" && trimestre == "2"){
                novaLayer(Preco2TrimestreFreg18)
            }
            if (ano == "2018" && trimestre == "3"){
                novaLayer(Preco3TrimestreFreg18)
            }
            if (ano == "2018" && trimestre == "4"){
                novaLayer(Preco4TrimestreFreg18)
            }
            if (ano == "2019" && trimestre == "1"){
                novaLayer(Preco1TrimestreFreg19)
            }
            if (ano == "2019" && trimestre == "2"){
                novaLayer(Preco2TrimestreFreg19)
            }
            if (ano == "2019" && trimestre == "3"){
                novaLayer(Preco3TrimestreFreg19)
            }
            if (ano == "2019" && trimestre == "4"){
                novaLayer(Preco4TrimestreFreg19)
            }
            if (ano == "2020" && trimestre == "1"){
                novaLayer(Preco1TrimestreFreg20)
            }
            if (ano == "2020" && trimestre == "2"){
                novaLayer(Preco2TrimestreFreg20)
            }
            if (ano == "2020" && trimestre == "3"){
                novaLayer(Preco3TrimestreFreg20)
            }
            if (ano == "2020" && trimestre == "4"){
                novaLayer(Preco4TrimestreFreg20)
            }
            if (ano == "2021" && trimestre == "1"){
                novaLayer(Preco1TrimestreFreg21)
            }
            if (ano == "2021" && trimestre == "2"){
                novaLayer(Preco2TrimestreFreg21)
            }
            if (ano == "2021" && trimestre == "3"){
                novaLayer(Preco3TrimestreFreg21)
            }
            if (ano == "2021" && trimestre == "4"){
                novaLayer(Preco4TrimestreFreg21)
            }
        }
        if ($('#taxaVariacao').hasClass('active5')){
            VariacaoCondicionantes();
            if (ano == "2016" && trimestre == "2"){
                novaLayer(Var2Tri16_1Tri16Freg)
            }
            if (ano == "2016" && trimestre == "3"){
                novaLayer(Var3Tri16_2Tri16Freg)
            }
            if (ano == "2016" && trimestre == "4"){
                novaLayer(Var4Tri16_3Tri16Freg)
            }
            if (ano == "2017" && trimestre == "1"){
                novaLayer(Var1Tri17_4Tri16Freg)
            }
            if (ano == "2017" && trimestre == "2"){
                novaLayer(Var2Tri17_1Tri17Freg)
            }
            if (ano == "2017" && trimestre == "3"){
                novaLayer(Var3Tri17_2Tri17Freg)
            }
            if (ano == "2017" && trimestre == "4"){
                novaLayer(Var4Tri17_3Tri17Freg)
            }
            if (ano == "2018" && trimestre == "1"){
                novaLayer(Var1Tri18_4Tri17Freg)
            }
            if (ano == "2018" && trimestre == "2"){
                novaLayer(Var2Tri18_1Tri18Freg)
            }
            if (ano == "2018" && trimestre == "3"){
                novaLayer(Var3Tri18_2Tri18Freg)
            }
            if (ano == "2018" && trimestre == "4"){
                novaLayer(Var4Tri18_3Tri18Freg)
            }
            if (ano == "2019" && trimestre == "1"){
                novaLayer(Var1Tri19_4Tri18Freg)
            }
            if (ano == "2019" && trimestre == "2"){
                novaLayer(Var2Tri19_1Tri19Freg)
            }
            if (ano == "2019" && trimestre == "3"){
                novaLayer(Var3Tri19_2Tri19Freg)
            }
            if (ano == "2019" && trimestre == "4"){
                novaLayer(Var4Tri19_3Tri19Freg)
            }
            if (ano == "2020" && trimestre == "1"){
                novaLayer(Var1Tri20_4Tri19Freg);
            }
            if (ano == "2020" && trimestre == "2"){
                novaLayer(Var2Tri20_1Tri20Freg)
            }
            if (ano == "2020" && trimestre == "3"){
                novaLayer(Var3Tri20_2Tri20Freg)
            }
            if (ano == "2020" && trimestre == "4"){
                novaLayer(Var4Tri20_3Tri20Freg)
            }
            if (ano == "2021" && trimestre == "1"){
                novaLayer(Var1Tri21_4Tri20Freg);
            }
            if (ano == "2021" && trimestre == "2"){
                novaLayer(Var2Tri21_1Tri21Freg)
            }
            if (ano == "2021" && trimestre == "3"){
                novaLayer(Var3Tri21_2Tri21Freg)
            }
            if (ano == "2021" && trimestre == "4"){
                novaLayer(Var4Tri21_3Tri21Freg)
            }
        }
    }
}


let VariacaoCondicionantes = function(){
    var ano = document.getElementById("mySelect").value
    var trimestre = document.getElementById("trimestres").value;
    if ($('#taxaVariacao').hasClass('active5') || $('#taxaVariacao').hasClass('active4')){
        if (ano == "2016"){
            $("#trimestres option[value='1']").remove();

        }
        if (ano != "2016"){
            if ($("#trimestres option[value='1']").length == 0){
                $("#trimestres option").eq(0).before($("<option></option>").val("1").text("1º - 4º (ano anterior)"));
            }   
        }
        if (trimestre == "1"){
            $("#mySelect option[value='2016']").remove();
        }
        if (trimestre != "1"){
            if ($("#mySelect option[value='2016']").length == 0){
                $("#mySelect option").eq(0).before($("<option></option>").val("2016").text("2016"));
            }   
        }
    }
}

let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Estatísticas de preços da habitação ao nível local.' );
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Estatísticas de preços da habitação ao nível local.' );
    }
}
function mudarEscala(){
    reporAnos();
    tamanhoOutros();
    fonteTitulo('N');
}
let primeirovalor = function(trimestre, ano){
    $("#trimestres").val(trimestre);
    $("#mySelect").val(ano);
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let reporAnos = function(){
    if ($('#percentagem').hasClass('active5') || $('#percentagem').hasClass('active4')){
        if ($("#trimestres option[value='1']").length == 0){
            $("#trimestres option").eq(0).before($("<option></option>").val("1").text("1º"));
        }
        $("#trimestres option[value='1']").html("1º");
        $("#trimestres option[value='2']").html("2º");
        $("#trimestres option[value='3']").html("3º");
        $("#trimestres option[value='4']").html("4º");
        primeirovalor('1','2016');
    }
    if ($('#taxaVariacao').hasClass('active5') || $('#taxaVariacao').hasClass('active4')){
        $("#trimestres option[value='1']").html("1º - 4º (ano anterior)");
        $("#trimestres option[value='2']").html("2º - 1º");
        $("#trimestres option[value='3']").html("3º - 2º");
        $("#trimestres option[value='4']").html("4º - 3º");
        primeirovalor('2',"2016");
    }

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
$('#mySelect').change(function(){
    myFunction();
})
$('#trimestres').change(function(){
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
    $('#notaRodape').remove();
    $('#opcaoMapa').attr("class","btn");
    $('#opcaoTabela').attr("class","btn");

    $('#tabelaVariacao').attr("class","btn");
    $('#tabelaPercentagem').attr("class","btn");
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
    $('th').css('padding','5px 40px 10px 25px')
    $('#tituloMapa').css('font-size',"10pt")
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

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais ");
    $('#freguesias').attr('class',"butaoEscala EscalasTerritoriais ");
    $('.btn').css("top","10%");

});
$('#tabelaPercentagem').click(function(){
    DadosAbsolutos();   
});

function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
var DadosAbsolutos = function(){
    $('#tituloMapa').html('Valor mediano das rendas por m² de novos contratos de arrendamento de alojamentos, entre o 1º trimestre de 2016 e o 4º trimestre de 2021, €.');
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/PrecosVendaProv.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $('#1').html("1")
        $.each(data, function(key, value){
            dados += '<tr>';
            if(containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                dados += '<td class="borderbottom bordertop">'+value.Venda+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P1Tri2016+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Tri2016+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P3Tri2016+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P4Tri2016+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P1Tri2017+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Tri2017+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P3Tri2017+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P4Tri2017+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P1Tri2018+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Tri2018+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P3Tri2018+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P4Tri2018+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P1Tri2019+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Tri2019+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P3Tri2019+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P4Tri2019+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P1Tri2020+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Tri2020+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P3Tri2020+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P4Tri2020+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P1Tri2021+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P2Tri2021+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P3Tri2021+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.P4Tri2021+'</td>';
            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                dados += '<td>'+value.Venda+'</td>';
                dados += '<td>'+value.P1Tri2016+'</td>';
                dados += '<td>'+value.P2Tri2016+'</td>';
                dados += '<td>'+value.P3Tri2016+'</td>';
                dados += '<td>'+value.P4Tri2016+'</td>';
                dados += '<td>'+value.P1Tri2017+'</td>';
                dados += '<td>'+value.P2Tri2017+'</td>';
                dados += '<td>'+value.P3Tri2017+'</td>';
                dados += '<td>'+value.P4Tri2017+'</td>';
                dados += '<td>'+value.P1Tri2018+'</td>';
                dados += '<td>'+value.P2Tri2018+'</td>';
                dados += '<td>'+value.P3Tri2018+'</td>';
                dados += '<td>'+value.P4Tri2018+'</td>';
                dados += '<td>'+value.P1Tri2019+'</td>';
                dados += '<td>'+value.P2Tri2019+'</td>';
                dados += '<td>'+value.P3Tri2019+'</td>';
                dados += '<td>'+value.P4Tri2019+'</td>';
                dados += '<td>'+value.P1Tri2020+'</td>';
                dados += '<td>'+value.P2Tri2020+'</td>';
                dados += '<td>'+value.P3Tri2020+'</td>';
                dados += '<td>'+value.P4Tri2020+'</td>';
                dados += '<td>'+value.P1Tri2021+'</td>';
                dados += '<td>'+value.P2Tri2021+'</td>';
                dados += '<td>'+value.P3Tri2021+'</td>';
                dados += '<td>'+value.P4Tri2021+'</td>';
                dados += '<tr>';
            }
            dados += '<tr>';
        })
    $('#juntarValores').append(dados);   
    });
})};

$('#tabelaVariacao').click(function(){  
    $('#tituloMapa').html('Variação do valor mediano das rendas por m² de novos contratos de arrendamento de alojamentos, entre o 2º trimestre de 2016 e  o 4º trimestre de 2021, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/PrecosVendaProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+value.Venda+'</td>';
                    dados += '<td class="borderbottom bordertop">'+ ''+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var2T1T_16+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var3T2T_16+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var4T3T_16+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var1T4T_17+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var2T1T_17+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var3T2T_17+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var4T3T_17+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var1T4T_18+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var2T1T_18+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var3T2T_18+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var4T3T_18+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var1T4T_19+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var2T1T_19+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var3T2T_19+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var4T3T_19+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var1T4T_20+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var2T1T_20+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var3T2T_20+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var4T3T_20+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var1T4T_21+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var2T1T_21+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var3T2T_21+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Var4T3T_21+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Venda+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.Var2T1T_16+'</td>';
                    dados += '<td>'+value.Var3T2T_16+'</td>';
                    dados += '<td>'+value.Var4T3T_16+'</td>';
                    dados += '<td>'+value.Var1T4T_17+'</td>';
                    dados += '<td>'+value.Var2T1T_17+'</td>';
                    dados += '<td>'+value.Var3T2T_17+'</td>';
                    dados += '<td>'+value.Var4T3T_17+'</td>';
                    dados += '<td>'+value.Var1T4T_18+'</td>';
                    dados += '<td>'+value.Var2T1T_18+'</td>';
                    dados += '<td>'+value.Var3T2T_18+'</td>';
                    dados += '<td>'+value.Var4T3T_18+'</td>';
                    dados += '<td>'+value.Var1T4T_19+'</td>';
                    dados += '<td>'+value.Var2T1T_19+'</td>';
                    dados += '<td>'+value.Var3T2T_19+'</td>';
                    dados += '<td>'+value.Var4T3T_19+'</td>';
                    dados += '<td>'+value.Var1T4T_20+'</td>';
                    dados += '<td>'+value.Var2T1T_20+'</td>';
                    dados += '<td>'+value.Var3T2T_20+'</td>';
                    dados += '<td>'+value.Var4T3T_20+'</td>';
                    dados += '<td>'+value.Var1T4T_21+'</td>';
                    dados += '<td>'+value.Var2T1T_21+'</td>';
                    dados += '<td>'+value.Var3T2T_21+'</td>';
                    dados += '<td>'+value.Var4T3T_21+'</td>';

                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

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
