// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('.ine').css('display',"inline-block");
$('.ine').html('<strong>Fonte:</strong> Cálculos próprios.<strong>fonte dos dados:</strong> INE, Estatísticas de Rendas da Habitação ao nível local, Estatísticas do rendimento ao nível local.');
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




/////////////////////////////////-------------------------- DADOS RELATIVOS CONCELHOS 

/////////////////////////------- 1º Trimestre 80m2 2016-----////

var minT1_80m2016Conc = 100;
var maxT1_80m2016Conc = 0;

function CorTaxaEsforco80mConc(d) {
    return d == null ? '#808080' :
        d >= 37.50 ? '#8c0303' :
        d >= 31.41  ? '#de1f35' :
        d >= 25.32 ? '#ff5e6e' :
        d >= 19.22   ? '#f5b3be' :
        d >= 13.13   ? '#F2C572' :
                ''  ;
}
var legendaTaxaEsforco80mConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: Anos' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 37' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 31 a 37' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 25 a 31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 19 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 13 a 19' + '<br>'



    $(legendaA).append(symbolsContainer); 
}

function EstiloT1_80m2016Conc(feature) {
    if(feature.properties.F1Tri80_16 <= minT1_80m2016Conc || feature.properties.F1Tri80_16  === 0){
        minT1_80m2016Conc = feature.properties.F1Tri80_16
    }
    if(feature.properties.F1Tri80_16 >= maxT1_80m2016Conc ){
        maxT1_80m2016Conc = feature.properties.F1Tri80_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F1Tri80_16)
    };
}
function apagarT1_80m2016Conc(e) {
    T1_80m2016Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT1_80m2016Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri80_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_80_16MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT1_80m2016Conc,
    });
}
var T1_80m2016Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT1_80m2016Conc,
    onEachFeature: onEachFeatureT1_80m2016Conc
});
let slideT1_80m2016Conc = function(){
    var sliderT1_80m2016Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT1_80m2016Conc, {
        start: [minT1_80m2016Conc, maxT1_80m2016Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_80m2016Conc,
            'max': maxT1_80m2016Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(2),
            from: (v) => parseFloat(v).toFixed(2),
        }
        });
    inputNumberMin.setAttribute("value",minT1_80m2016Conc);
    inputNumberMax.setAttribute("value",maxT1_80m2016Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_80m2016Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_80m2016Conc.noUiSlider.set([null, this.value]);
    });

    sliderT1_80m2016Conc.noUiSlider.on('update',function(e){
        T1_80m2016Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Tri80_16.toFixed(5)>=parseFloat(e[0])&& layer.feature.properties.F1Tri80_16.toFixed(5) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT1_80m2016Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderT1_80m2016Conc.noUiSlider;
    $(slidersGeral).append(sliderT1_80m2016Conc);
} 
$('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 1º trimestre de 2016, por concelho.' + '</strong>');
legendaTaxaEsforco80mConc();
slideT1_80m2016Conc();
/////////////////////////////// Fim do 1º Trimeste 80m2 2016- -------------- \\\\\\

/////////////////////////------- 1º Trimestre 100m2 2016-----////

var minT1_100m2016Conc = 100;
var maxT1_100m2016Conc = 0;

function CorTaxaEsforco100mConc(d) {
    return d == null ? '#808080' :
        d >= 43.83 ? '#8c0303' :
        d >= 39.26  ? '#de1f35' :
        d >= 31.65 ? '#ff5e6e' :
        d >= 24.03   ? '#f5b3be' :
        d >= 16.41   ? '#F2C572' :
                ''  ;
}
var legendaTaxaEsforco100mConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: Anos' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 43' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 39 a 43' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 31 a 39' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 24 a 31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 16 a 24' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloT1_100m2016Conc(feature) {
    if(feature.properties.F1Tri100_16 <= minT1_100m2016Conc || minT1_100m2016Conc === 0){
        minT1_100m2016Conc = feature.properties.F1Tri100_16
    }
    if(feature.properties.F1Tri100_16 >= maxT1_100m2016Conc ){
        maxT1_100m2016Conc = feature.properties.F1Tri100_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F1Tri100_16)
    };
}
function apagarT1_100m2016Conc(e) {
    T1_100m2016Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT1_100m2016Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri100_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_100_16ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT1_100m2016Conc,
    });
}
var T1_100m2016Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT1_100m2016Conc,
    onEachFeature: onEachFeatureT1_100m2016Conc
});
let slideT1_100m2016Conc = function(){
    var sliderT1_100m2016Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT1_100m2016Conc, {
        start: [minT1_100m2016Conc, maxT1_100m2016Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_100m2016Conc,
            'max': maxT1_100m2016Conc
        },
        });
    inputNumberMin.setAttribute("value",minT1_100m2016Conc);
    inputNumberMax.setAttribute("value",maxT1_100m2016Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_100m2016Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_100m2016Conc.noUiSlider.set([null, this.value]);
    });

    sliderT1_100m2016Conc.noUiSlider.on('update',function(e){
        T1_100m2016Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Tri100_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F1Tri100_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT1_100m2016Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderT1_100m2016Conc.noUiSlider;
    $(slidersGeral).append(sliderT1_100m2016Conc);
} 

/////////////////////////////// Fim do 1º Trimeste 100m2 2016- -------------- \\\\\\

/////////////////////////------- 2º Trimestre 80m2 2016-----////

var minT2_80m2016Conc = 100;
var maxT2_80m2016Conc = 0;

function EstiloT2_80m2016Conc(feature) {
    if(feature.properties.F2Tri80_16 <= minT2_80m2016Conc || minT2_80m2016Conc === 0){
        minT2_80m2016Conc = feature.properties.F2Tri80_16
    }
    if(feature.properties.F2Tri80_16 >= maxT2_80m2016Conc ){
        maxT2_80m2016Conc = feature.properties.F2Tri80_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F2Tri80_16)
    };
}
function apagarT2_80m2016Conc(e) {
    T2_80m2016Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT2_80m2016Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri80_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_80_16MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT2_80m2016Conc,
    });
}
var T2_80m2016Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT2_80m2016Conc,
    onEachFeature: onEachFeatureT2_80m2016Conc
});
let slideT2_80m2016Conc = function(){
    var sliderT2_80m2016Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT2_80m2016Conc, {
        start: [minT2_80m2016Conc, maxT2_80m2016Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_80m2016Conc,
            'max': maxT2_80m2016Conc
        },
        });
    inputNumberMin.setAttribute("value",minT2_80m2016Conc);
    inputNumberMax.setAttribute("value",maxT2_80m2016Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_80m2016Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_80m2016Conc.noUiSlider.set([null, this.value]);
    });

    sliderT2_80m2016Conc.noUiSlider.on('update',function(e){
        T2_80m2016Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Tri80_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F2Tri80_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT2_80m2016Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderT2_80m2016Conc.noUiSlider;
    $(slidersGeral).append(sliderT2_80m2016Conc);
} 

/////////////////////////////// Fim do 2º Trimeste 80m2 2016- -------------- \\\\\\

/////////////////////////------- 2º Trimestre 100m2 2016-----////

var minT2_100m2016Conc = 100;
var maxT2_100m2016Conc = 0;

function EstiloT2_100m2016Conc(feature) {
    if(feature.properties.F2Tri100_16 <= minT2_100m2016Conc || minT2_100m2016Conc === 0){
        minT2_100m2016Conc = feature.properties.F2Tri100_16
    }
    if(feature.properties.F2Tri100_16 >= maxT2_100m2016Conc ){
        maxT2_100m2016Conc = feature.properties.F2Tri100_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F2Tri100_16)
    };
}
function apagarT2_100m2016Conc(e) {
    T2_100m2016Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT2_100m2016Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri100_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_100_16ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT2_100m2016Conc,
    });
}
var T2_100m2016Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT2_100m2016Conc,
    onEachFeature: onEachFeatureT2_100m2016Conc
});
let slideT2_100m2016Conc = function(){
    var sliderT2_100m2016Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT2_100m2016Conc, {
        start: [minT2_100m2016Conc, maxT2_100m2016Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_100m2016Conc,
            'max': maxT2_100m2016Conc
        },
        });
    inputNumberMin.setAttribute("value",minT2_100m2016Conc);
    inputNumberMax.setAttribute("value",maxT2_100m2016Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_100m2016Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_100m2016Conc.noUiSlider.set([null, this.value]);
    });

    sliderT2_100m2016Conc.noUiSlider.on('update',function(e){
        T2_100m2016Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Tri100_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F2Tri100_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT2_100m2016Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderT2_100m2016Conc.noUiSlider;
    $(slidersGeral).append(sliderT2_100m2016Conc);
} 

/////////////////////////////// Fim do 2º Trimeste 100m2 2016- -------------- \\\\\\

/////////////////////////------- 3º Trimestre 80m2 2016-----////

var minT3_80m2016Conc = 100;
var maxT3_80m2016Conc = 0;

function EstiloT3_80m2016Conc(feature) {
    if(feature.properties.F3Tri80_16 <= minT3_80m2016Conc || minT3_80m2016Conc === 0){
        minT3_80m2016Conc = feature.properties.F3Tri80_16
    }
    if(feature.properties.F3Tri80_16 >= maxT3_80m2016Conc ){
        maxT3_80m2016Conc = feature.properties.F3Tri80_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F3Tri80_16)
    };
}
function apagarT3_80m2016Conc(e) {
    T3_80m2016Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT3_80m2016Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri80_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_80_16MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT3_80m2016Conc,
    });
}
var T3_80m2016Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT3_80m2016Conc,
    onEachFeature: onEachFeatureT3_80m2016Conc
});
let slideT3_80m2016Conc = function(){
    var sliderT3_80m2016Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT3_80m2016Conc, {
        start: [minT3_80m2016Conc, maxT3_80m2016Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_80m2016Conc,
            'max': maxT3_80m2016Conc
        },
        });
    inputNumberMin.setAttribute("value",minT3_80m2016Conc);
    inputNumberMax.setAttribute("value",maxT3_80m2016Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_80m2016Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_80m2016Conc.noUiSlider.set([null, this.value]);
    });

    sliderT3_80m2016Conc.noUiSlider.on('update',function(e){
        T3_80m2016Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Tri80_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F3Tri80_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT3_80m2016Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderT3_80m2016Conc.noUiSlider;
    $(slidersGeral).append(sliderT3_80m2016Conc);
} 

/////////////////////////////// Fim do 3º Trimeste 80m2 2016- -------------- \\\\\\

/////////////////////////------- 3º Trimestre 100m2 2016-----////

var minT3_100m2016Conc = 100;
var maxT3_100m2016Conc = 0;

function EstiloT3_100m2016Conc(feature) {
    if(feature.properties.F3Tri100_16 <= minT3_100m2016Conc || minT3_100m2016Conc === 0){
        minT3_100m2016Conc = feature.properties.F3Tri100_16
    }
    if(feature.properties.F3Tri100_16 >= maxT3_100m2016Conc ){
        maxT3_100m2016Conc = feature.properties.F3Tri100_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F3Tri100_16)
    };
}
function apagarT3_100m2016Conc(e) {
    T3_100m2016Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT3_100m2016Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri100_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_100_16ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT3_100m2016Conc,
    });
}
var T3_100m2016Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT3_100m2016Conc,
    onEachFeature: onEachFeatureT3_100m2016Conc
});
let slideT3_100m2016Conc = function(){
    var sliderT3_100m2016Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT3_100m2016Conc, {
        start: [minT3_100m2016Conc, maxT3_100m2016Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_100m2016Conc,
            'max': maxT3_100m2016Conc
        },
        });
    inputNumberMin.setAttribute("value",minT3_100m2016Conc);
    inputNumberMax.setAttribute("value",maxT3_100m2016Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_100m2016Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_100m2016Conc.noUiSlider.set([null, this.value]);
    });

    sliderT3_100m2016Conc.noUiSlider.on('update',function(e){
        T3_100m2016Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Tri100_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F3Tri100_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT3_100m2016Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderT3_100m2016Conc.noUiSlider;
    $(slidersGeral).append(sliderT3_100m2016Conc);
} 

/////////////////////////////// Fim do 3º Trimeste 100m2 2016- -------------- \\\\\\


/////////////////////////------- 4º Trimestre 80m2 2016-----////

var minT4_80m2016Conc = 100;
var maxT4_80m2016Conc = 0;

function EstiloT4_80m2016Conc(feature) {
    if(feature.properties.F4Tri80_16 <= minT4_80m2016Conc || minT4_80m2016Conc === 0){
        minT4_80m2016Conc = feature.properties.F4Tri80_16
    }
    if(feature.properties.F4Tri80_16 >= maxT4_80m2016Conc ){
        maxT4_80m2016Conc = feature.properties.F4Tri80_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F4Tri80_16)
    };
}
function apagarT4_80m2016Conc(e) {
    T4_80m2016Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT4_80m2016Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri80_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_80_16MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT4_80m2016Conc,
    });
}
var T4_80m2016Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT4_80m2016Conc,
    onEachFeature: onEachFeatureT4_80m2016Conc
});
let slideT4_80m2016Conc = function(){
    var sliderT4_80m2016Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT4_80m2016Conc, {
        start: [minT4_80m2016Conc, maxT4_80m2016Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_80m2016Conc,
            'max': maxT4_80m2016Conc
        },
        });
    inputNumberMin.setAttribute("value",minT4_80m2016Conc);
    inputNumberMax.setAttribute("value",maxT4_80m2016Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_80m2016Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_80m2016Conc.noUiSlider.set([null, this.value]);
    });

    sliderT4_80m2016Conc.noUiSlider.on('update',function(e){
        T4_80m2016Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Tri80_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F4Tri80_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT4_80m2016Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderT4_80m2016Conc.noUiSlider;
    $(slidersGeral).append(sliderT4_80m2016Conc);
} 

/////////////////////////////// Fim do 4º Trimeste 80m2 2016- -------------- \\\\\\

/////////////////////////------- 4º Trimestre 100m2 2016-----////

var minT4_100m2016Conc = 100;
var maxT4_100m2016Conc = 0;

function EstiloT4_100m2016Conc(feature) {
    if(feature.properties.F4Tri100_16 <= minT4_100m2016Conc || minT4_100m2016Conc === 0){
        minT4_100m2016Conc = feature.properties.F4Tri100_16
    }
    if(feature.properties.F4Tri100_16 >= maxT4_100m2016Conc ){
        maxT4_100m2016Conc = feature.properties.F4Tri100_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F4Tri100_16)
    };
}
function apagarT4_100m2016Conc(e) {
    T4_100m2016Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT4_100m2016Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri100_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_100_16ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT4_100m2016Conc,
    });
}
var T4_100m2016Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT4_100m2016Conc,
    onEachFeature: onEachFeatureT4_100m2016Conc
});
let slideT4_100m2016Conc = function(){
    var sliderT4_100m2016Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT4_100m2016Conc, {
        start: [minT4_100m2016Conc, maxT4_100m2016Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_100m2016Conc,
            'max': maxT4_100m2016Conc
        },
        });
    inputNumberMin.setAttribute("value",minT4_100m2016Conc);
    inputNumberMax.setAttribute("value",maxT4_100m2016Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_100m2016Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_100m2016Conc.noUiSlider.set([null, this.value]);
    });

    sliderT4_100m2016Conc.noUiSlider.on('update',function(e){
        T4_100m2016Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Tri100_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F4Tri100_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT4_100m2016Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderT4_100m2016Conc.noUiSlider;
    $(slidersGeral).append(sliderT4_100m2016Conc);
} 

/////////////////////////////// Fim do 4º Trimeste 100m2 2016- -------------- \\\\\\

/////////////////////////------- 1º Trimestre 80m2 2017-----////

var minT1_80m2017Conc = 100;
var maxT1_80m2017Conc = 0;

function EstiloT1_80m2017Conc(feature) {
    if(feature.properties.F1Tri80_17 <= minT1_80m2017Conc || minT1_80m2017Conc === 0){
        minT1_80m2017Conc = feature.properties.F1Tri80_17
    }
    if(feature.properties.F1Tri80_17 >= maxT1_80m2017Conc ){
        maxT1_80m2017Conc = feature.properties.F1Tri80_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F1Tri80_17)
    };
}
function apagarT1_80m2017Conc(e) {
    T1_80m2017Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT1_80m2017Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri80_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_80_17MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT1_80m2017Conc,
    });
}
var T1_80m2017Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT1_80m2017Conc,
    onEachFeature: onEachFeatureT1_80m2017Conc
});
let slideT1_80m2017Conc = function(){
    var sliderT1_80m2017Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT1_80m2017Conc, {
        start: [minT1_80m2017Conc, maxT1_80m2017Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_80m2017Conc,
            'max': maxT1_80m2017Conc
        },
        });
    inputNumberMin.setAttribute("value",minT1_80m2017Conc);
    inputNumberMax.setAttribute("value",maxT1_80m2017Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_80m2017Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_80m2017Conc.noUiSlider.set([null, this.value]);
    });

    sliderT1_80m2017Conc.noUiSlider.on('update',function(e){
        T1_80m2017Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Tri80_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F1Tri80_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT1_80m2017Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderT1_80m2017Conc.noUiSlider;
    $(slidersGeral).append(sliderT1_80m2017Conc);
} 

/////////////////////////////// Fim do 1º Trimeste 80m2 2017- -------------- \\\\\\

/////////////////////////------- 1º Trimestre 100m2 2017-----////

var minT1_100m2017Conc = 100;
var maxT1_100m2017Conc = 0;

function EstiloT1_100m2017Conc(feature) {
    if(feature.properties.F1Tri100_17 <= minT1_100m2017Conc || minT1_100m2017Conc === 0){
        minT1_100m2017Conc = feature.properties.F1Tri100_17
    }
    if(feature.properties.F1Tri100_17 >= maxT1_100m2017Conc ){
        maxT1_100m2017Conc = feature.properties.F1Tri100_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F1Tri100_17)
    };
}
function apagarT1_100m2017Conc(e) {
    T1_100m2017Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT1_100m2017Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri100_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_100_17ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT1_100m2017Conc,
    });
}
var T1_100m2017Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT1_100m2017Conc,
    onEachFeature: onEachFeatureT1_100m2017Conc
});
let slideT1_100m2017Conc = function(){
    var sliderT1_100m2017Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT1_100m2017Conc, {
        start: [minT1_100m2017Conc, maxT1_100m2017Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_100m2017Conc,
            'max': maxT1_100m2017Conc
        },
        });
    inputNumberMin.setAttribute("value",minT1_100m2017Conc);
    inputNumberMax.setAttribute("value",maxT1_100m2017Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_100m2017Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_100m2017Conc.noUiSlider.set([null, this.value]);
    });

    sliderT1_100m2017Conc.noUiSlider.on('update',function(e){
        T1_100m2017Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Tri100_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F1Tri100_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT1_100m2017Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderT1_100m2017Conc.noUiSlider;
    $(slidersGeral).append(sliderT1_100m2017Conc);
} 

/////////////////////////////// Fim do 1º Trimeste 100m2 2017- -------------- \\\\\\

/////////////////////////------- 2º Trimestre 80m2 2017-----////

var minT2_80m2017Conc = 100;
var maxT2_80m2017Conc = 0;

function EstiloT2_80m2017Conc(feature) {
    if(feature.properties.F2Tri80_17 <= minT2_80m2017Conc || minT2_80m2017Conc === 0){
        minT2_80m2017Conc = feature.properties.F2Tri80_17
    }
    if(feature.properties.F2Tri80_17 >= maxT2_80m2017Conc ){
        maxT2_80m2017Conc = feature.properties.F2Tri80_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F2Tri80_17)
    };
}
function apagarT2_80m2017Conc(e) {
    T2_80m2017Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT2_80m2017Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri80_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_80_17MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT2_80m2017Conc,
    });
}
var T2_80m2017Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT2_80m2017Conc,
    onEachFeature: onEachFeatureT2_80m2017Conc
});
let slideT2_80m2017Conc = function(){
    var sliderT2_80m2017Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT2_80m2017Conc, {
        start: [minT2_80m2017Conc, maxT2_80m2017Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_80m2017Conc,
            'max': maxT2_80m2017Conc
        },
        });
    inputNumberMin.setAttribute("value",minT2_80m2017Conc);
    inputNumberMax.setAttribute("value",maxT2_80m2017Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_80m2017Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_80m2017Conc.noUiSlider.set([null, this.value]);
    });

    sliderT2_80m2017Conc.noUiSlider.on('update',function(e){
        T2_80m2017Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Tri80_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F2Tri80_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT2_80m2017Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderT2_80m2017Conc.noUiSlider;
    $(slidersGeral).append(sliderT2_80m2017Conc);
} 

/////////////////////////////// Fim do 2º Trimeste 80m2 2017- -------------- \\\\\\

/////////////////////////------- 2º Trimestre 100m2 2017-----////

var minT2_100m2017Conc = 100;
var maxT2_100m2017Conc = 0;

function EstiloT2_100m2017Conc(feature) {
    if(feature.properties.F2Tri100_17 <= minT2_100m2017Conc || minT2_100m2017Conc === 0){
        minT2_100m2017Conc = feature.properties.F2Tri100_17
    }
    if(feature.properties.F2Tri100_17 >= maxT2_100m2017Conc ){
        maxT2_100m2017Conc = feature.properties.F2Tri100_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F2Tri100_17)
    };
}
function apagarT2_100m2017Conc(e) {
    T2_100m2017Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT2_100m2017Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri100_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_100_17ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT2_100m2017Conc,
    });
}
var T2_100m2017Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT2_100m2017Conc,
    onEachFeature: onEachFeatureT2_100m2017Conc
});
let slideT2_100m2017Conc = function(){
    var sliderT2_100m2017Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT2_100m2017Conc, {
        start: [minT2_100m2017Conc, maxT2_100m2017Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_100m2017Conc,
            'max': maxT2_100m2017Conc
        },
        });
    inputNumberMin.setAttribute("value",minT2_100m2017Conc);
    inputNumberMax.setAttribute("value",maxT2_100m2017Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_100m2017Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_100m2017Conc.noUiSlider.set([null, this.value]);
    });

    sliderT2_100m2017Conc.noUiSlider.on('update',function(e){
        T2_100m2017Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Tri100_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F2Tri100_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT2_100m2017Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderT2_100m2017Conc.noUiSlider;
    $(slidersGeral).append(sliderT2_100m2017Conc);
} 

/////////////////////////////// Fim do 2º Trimeste 100m2 2017- -------------- \\\\\\

/////////////////////////------- 3º Trimestre 80m2 2017-----////

var minT3_80m2017Conc = 100;
var maxT3_80m2017Conc = 0;

function EstiloT3_80m2017Conc(feature) {
    if(feature.properties.F3Tri80_17 <= minT3_80m2017Conc || minT3_80m2017Conc === 0){
        minT3_80m2017Conc = feature.properties.F3Tri80_17
    }
    if(feature.properties.F3Tri80_17 >= maxT3_80m2017Conc ){
        maxT3_80m2017Conc = feature.properties.F3Tri80_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F3Tri80_17)
    };
}
function apagarT3_80m2017Conc(e) {
    T3_80m2017Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT3_80m2017Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri80_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_80_17MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT3_80m2017Conc,
    });
}
var T3_80m2017Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT3_80m2017Conc,
    onEachFeature: onEachFeatureT3_80m2017Conc
});
let slideT3_80m2017Conc = function(){
    var sliderT3_80m2017Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT3_80m2017Conc, {
        start: [minT3_80m2017Conc, maxT3_80m2017Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_80m2017Conc,
            'max': maxT3_80m2017Conc
        },
        });
    inputNumberMin.setAttribute("value",minT3_80m2017Conc);
    inputNumberMax.setAttribute("value",maxT3_80m2017Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_80m2017Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_80m2017Conc.noUiSlider.set([null, this.value]);
    });

    sliderT3_80m2017Conc.noUiSlider.on('update',function(e){
        T3_80m2017Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Tri80_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F3Tri80_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT3_80m2017Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderT3_80m2017Conc.noUiSlider;
    $(slidersGeral).append(sliderT3_80m2017Conc);
} 

/////////////////////////////// Fim do 3º Trimeste 80m2 2017- -------------- \\\\\\

/////////////////////////------- 3º Trimestre 100m2 2017-----////

var minT3_100m2017Conc = 100;
var maxT3_100m2017Conc = 0;

function EstiloT3_100m2017Conc(feature) {
    if(feature.properties.F3Tri100_17 <= minT3_100m2017Conc || minT3_100m2017Conc === 0){
        minT3_100m2017Conc = feature.properties.F3Tri100_17
    }
    if(feature.properties.F3Tri100_17 >= maxT3_100m2017Conc ){
        maxT3_100m2017Conc = feature.properties.F3Tri100_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F3Tri100_17)
    };
}
function apagarT3_100m2017Conc(e) {
    T3_100m2017Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT3_100m2017Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri100_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_100_17ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT3_100m2017Conc,
    });
}
var T3_100m2017Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT3_100m2017Conc,
    onEachFeature: onEachFeatureT3_100m2017Conc
});
let slideT3_100m2017Conc = function(){
    var sliderT3_100m2017Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT3_100m2017Conc, {
        start: [minT3_100m2017Conc, maxT3_100m2017Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_100m2017Conc,
            'max': maxT3_100m2017Conc
        },
        });
    inputNumberMin.setAttribute("value",minT3_100m2017Conc);
    inputNumberMax.setAttribute("value",maxT3_100m2017Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_100m2017Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_100m2017Conc.noUiSlider.set([null, this.value]);
    });

    sliderT3_100m2017Conc.noUiSlider.on('update',function(e){
        T3_100m2017Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Tri100_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F3Tri100_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT3_100m2017Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderT3_100m2017Conc.noUiSlider;
    $(slidersGeral).append(sliderT3_100m2017Conc);
} 

/////////////////////////////// Fim do 3º Trimeste 100m2 2017- -------------- \\\\\\


/////////////////////////------- 4º Trimestre 80m2 2017-----////

var minT4_80m2017Conc = 100;
var maxT4_80m2017Conc = 0;

function EstiloT4_80m2017Conc(feature) {
    if(feature.properties.F3Tri80_17 <= minT4_80m2017Conc || minT4_80m2017Conc === 0){
        minT4_80m2017Conc = feature.properties.F3Tri80_17
    }
    if(feature.properties.F3Tri80_17 >= maxT4_80m2017Conc ){
        maxT4_80m2017Conc = feature.properties.F3Tri80_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F3Tri80_17)
    };
}
function apagarT4_80m2017Conc(e) {
    T4_80m2017Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT4_80m2017Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri80_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_80_17MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT4_80m2017Conc,
    });
}
var T4_80m2017Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT4_80m2017Conc,
    onEachFeature: onEachFeatureT4_80m2017Conc
});
let slideT4_80m2017Conc = function(){
    var sliderT4_80m2017Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT4_80m2017Conc, {
        start: [minT4_80m2017Conc, maxT4_80m2017Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_80m2017Conc,
            'max': maxT4_80m2017Conc
        },
        });
    inputNumberMin.setAttribute("value",minT4_80m2017Conc);
    inputNumberMax.setAttribute("value",maxT4_80m2017Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_80m2017Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_80m2017Conc.noUiSlider.set([null, this.value]);
    });

    sliderT4_80m2017Conc.noUiSlider.on('update',function(e){
        T4_80m2017Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Tri80_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F3Tri80_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT4_80m2017Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderT4_80m2017Conc.noUiSlider;
    $(slidersGeral).append(sliderT4_80m2017Conc);
} 

/////////////////////////////// Fim do 4º Trimeste 80m2 2017- -------------- \\\\\\

/////////////////////////------- 4º Trimestre 100m2 2017-----////

var minT4_100m2017Conc = 100;
var maxT4_100m2017Conc = 0;

function EstiloT4_100m2017Conc(feature) {
    if(feature.properties.F4Tri100_17 <= minT4_100m2017Conc || minT4_100m2017Conc === 0){
        minT4_100m2017Conc = feature.properties.F4Tri100_17
    }
    if(feature.properties.F4Tri100_17 >= maxT4_100m2017Conc ){
        maxT4_100m2017Conc = feature.properties.F4Tri100_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F4Tri100_17)
    };
}
function apagarT4_100m2017Conc(e) {
    T4_100m2017Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT4_100m2017Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri100_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_100_17ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT4_100m2017Conc,
    });
}
var T4_100m2017Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT4_100m2017Conc,
    onEachFeature: onEachFeatureT4_100m2017Conc
});
let slideT4_100m2017Conc = function(){
    var sliderT4_100m2017Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT4_100m2017Conc, {
        start: [minT4_100m2017Conc, maxT4_100m2017Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_100m2017Conc,
            'max': maxT4_100m2017Conc
        },
        });
    inputNumberMin.setAttribute("value",minT4_100m2017Conc);
    inputNumberMax.setAttribute("value",maxT4_100m2017Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_100m2017Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_100m2017Conc.noUiSlider.set([null, this.value]);
    });

    sliderT4_100m2017Conc.noUiSlider.on('update',function(e){
        T4_100m2017Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Tri100_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F4Tri100_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT4_100m2017Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderT4_100m2017Conc.noUiSlider;
    $(slidersGeral).append(sliderT4_100m2017Conc);
} 

/////////////////////////////// Fim do 4º Trimeste 100m2 2017- -------------- \\\\\\

/////////////////////////------- 1º Trimestre 80m2 2018-----////

var minT1_80m2018Conc = 100;
var maxT1_80m2018Conc = 0;

function EstiloT1_80m2018Conc(feature) {
    if(feature.properties.F4Tri80_18 <= minT1_80m2018Conc || minT1_80m2018Conc === 0){
        minT1_80m2018Conc = feature.properties.F4Tri80_18
    }
    if(feature.properties.F4Tri80_18 >= maxT1_80m2018Conc ){
        maxT1_80m2018Conc = feature.properties.F4Tri80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F4Tri80_18)
    };
}
function apagarT1_80m2018Conc(e) {
    T1_80m2018Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT1_80m2018Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri80_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_80_18MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT1_80m2018Conc,
    });
}
var T1_80m2018Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT1_80m2018Conc,
    onEachFeature: onEachFeatureT1_80m2018Conc
});
let slideT1_80m2018Conc = function(){
    var sliderT1_80m2018Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT1_80m2018Conc, {
        start: [minT1_80m2018Conc, maxT1_80m2018Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_80m2018Conc,
            'max': maxT1_80m2018Conc
        },
        });
    inputNumberMin.setAttribute("value",minT1_80m2018Conc);
    inputNumberMax.setAttribute("value",maxT1_80m2018Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_80m2018Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_80m2018Conc.noUiSlider.set([null, this.value]);
    });

    sliderT1_80m2018Conc.noUiSlider.on('update',function(e){
        T1_80m2018Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Tri80_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F4Tri80_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT1_80m2018Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderT1_80m2018Conc.noUiSlider;
    $(slidersGeral).append(sliderT1_80m2018Conc);
} 

/////////////////////////////// Fim do 1º Trimeste 80m2 2018- -------------- \\\\\\

/////////////////////////------- 1º Trimestre 100m2 2018-----////

var minT1_100m2018Conc = 100;
var maxT1_100m2018Conc = 0;

function EstiloT1_100m2018Conc(feature) {
    if(feature.properties.F1Tri100_18 <= minT1_100m2018Conc || minT1_100m2018Conc === 0){
        minT1_100m2018Conc = feature.properties.F1Tri100_18
    }
    if(feature.properties.F1Tri100_18 >= maxT1_100m2018Conc ){
        maxT1_100m2018Conc = feature.properties.F1Tri100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F1Tri100_18)
    };
}
function apagarT1_100m2018Conc(e) {
    T1_100m2018Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT1_100m2018Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri100_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_100_18ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT1_100m2018Conc,
    });
}
var T1_100m2018Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT1_100m2018Conc,
    onEachFeature: onEachFeatureT1_100m2018Conc
});
let slideT1_100m2018Conc = function(){
    var sliderT1_100m2018Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT1_100m2018Conc, {
        start: [minT1_100m2018Conc, maxT1_100m2018Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_100m2018Conc,
            'max': maxT1_100m2018Conc
        },
        });
    inputNumberMin.setAttribute("value",minT1_100m2018Conc);
    inputNumberMax.setAttribute("value",maxT1_100m2018Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_100m2018Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_100m2018Conc.noUiSlider.set([null, this.value]);
    });

    sliderT1_100m2018Conc.noUiSlider.on('update',function(e){
        T1_100m2018Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Tri100_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F1Tri100_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT1_100m2018Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderT1_100m2018Conc.noUiSlider;
    $(slidersGeral).append(sliderT1_100m2018Conc);
} 

/////////////////////////////// Fim do 1º Trimeste 100m2 2018- -------------- \\\\\\

/////////////////////////------- 2º Trimestre 80m2 2018-----////

var minT2_80m2018Conc = 100;
var maxT2_80m2018Conc = 0;

function EstiloT2_80m2018Conc(feature) {
    if(feature.properties.F1Tri80_18 <= minT2_80m2018Conc || minT2_80m2018Conc === 0){
        minT2_80m2018Conc = feature.properties.F1Tri80_18
    }
    if(feature.properties.F1Tri80_18 >= maxT2_80m2018Conc ){
        maxT2_80m2018Conc = feature.properties.F1Tri80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F1Tri80_18)
    };
}
function apagarT2_80m2018Conc(e) {
    T2_80m2018Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT2_80m2018Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri80_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_80_18MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT2_80m2018Conc,
    });
}
var T2_80m2018Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT2_80m2018Conc,
    onEachFeature: onEachFeatureT2_80m2018Conc
});
let slideT2_80m2018Conc = function(){
    var sliderT2_80m2018Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT2_80m2018Conc, {
        start: [minT2_80m2018Conc, maxT2_80m2018Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_80m2018Conc,
            'max': maxT2_80m2018Conc
        },
        });
    inputNumberMin.setAttribute("value",minT2_80m2018Conc);
    inputNumberMax.setAttribute("value",maxT2_80m2018Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_80m2018Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_80m2018Conc.noUiSlider.set([null, this.value]);
    });

    sliderT2_80m2018Conc.noUiSlider.on('update',function(e){
        T2_80m2018Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Tri80_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F1Tri80_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT2_80m2018Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderT2_80m2018Conc.noUiSlider;
    $(slidersGeral).append(sliderT2_80m2018Conc);
} 

/////////////////////////////// Fim do 2º Trimeste 80m2 2018- -------------- \\\\\\

/////////////////////////------- 2º Trimestre 100m2 2018-----////

var minT2_100m2018Conc = 100;
var maxT2_100m2018Conc = 0;

function EstiloT2_100m2018Conc(feature) {
    if(feature.properties.F2Tri100_18 <= minT2_100m2018Conc || minT2_100m2018Conc === 0){
        minT2_100m2018Conc = feature.properties.F2Tri100_18
    }
    if(feature.properties.F2Tri100_18 >= maxT2_100m2018Conc ){
        maxT2_100m2018Conc = feature.properties.F2Tri100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F2Tri100_18)
    };
}
function apagarT2_100m2018Conc(e) {
    T2_100m2018Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT2_100m2018Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri100_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_100_18ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT2_100m2018Conc,
    });
}
var T2_100m2018Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT2_100m2018Conc,
    onEachFeature: onEachFeatureT2_100m2018Conc
});
let slideT2_100m2018Conc = function(){
    var sliderT2_100m2018Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT2_100m2018Conc, {
        start: [minT2_100m2018Conc, maxT2_100m2018Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_100m2018Conc,
            'max': maxT2_100m2018Conc
        },
        });
    inputNumberMin.setAttribute("value",minT2_100m2018Conc);
    inputNumberMax.setAttribute("value",maxT2_100m2018Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_100m2018Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_100m2018Conc.noUiSlider.set([null, this.value]);
    });

    sliderT2_100m2018Conc.noUiSlider.on('update',function(e){
        T2_100m2018Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Tri100_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F2Tri100_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT2_100m2018Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderT2_100m2018Conc.noUiSlider;
    $(slidersGeral).append(sliderT2_100m2018Conc);
} 

/////////////////////////////// Fim do 2º Trimeste 100m2 2018- -------------- \\\\\\

/////////////////////////------- 3º Trimestre 80m2 2018-----////

var minT3_80m2018Conc = 100;
var maxT3_80m2018Conc = 0;

function EstiloT3_80m2018Conc(feature) {
    if(feature.properties.F2Tri80_18 <= minT3_80m2018Conc || minT3_80m2018Conc === 0){
        minT3_80m2018Conc = feature.properties.F2Tri80_18
    }
    if(feature.properties.F2Tri80_18 >= maxT3_80m2018Conc ){
        maxT3_80m2018Conc = feature.properties.F2Tri80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F2Tri80_18)
    };
}
function apagarT3_80m2018Conc(e) {
    T3_80m2018Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT3_80m2018Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri80_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_80_18MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT3_80m2018Conc,
    });
}
var T3_80m2018Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT3_80m2018Conc,
    onEachFeature: onEachFeatureT3_80m2018Conc
});
let slideT3_80m2018Conc = function(){
    var sliderT3_80m2018Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT3_80m2018Conc, {
        start: [minT3_80m2018Conc, maxT3_80m2018Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_80m2018Conc,
            'max': maxT3_80m2018Conc
        },
        });
    inputNumberMin.setAttribute("value",minT3_80m2018Conc);
    inputNumberMax.setAttribute("value",maxT3_80m2018Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_80m2018Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_80m2018Conc.noUiSlider.set([null, this.value]);
    });

    sliderT3_80m2018Conc.noUiSlider.on('update',function(e){
        T3_80m2018Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Tri80_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F2Tri80_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT3_80m2018Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderT3_80m2018Conc.noUiSlider;
    $(slidersGeral).append(sliderT3_80m2018Conc);
} 

/////////////////////////////// Fim do 3º Trimeste 80m2 2018- -------------- \\\\\\

/////////////////////////------- 3º Trimestre 100m2 2018-----////

var minT3_100m2018Conc = 100;
var maxT3_100m2018Conc = 0;

function EstiloT3_100m2018Conc(feature) {
    if(feature.properties.F3Tri100_18 <= minT3_100m2018Conc || minT3_100m2018Conc === 0){
        minT3_100m2018Conc = feature.properties.F3Tri100_18
    }
    if(feature.properties.F3Tri100_18 >= maxT3_100m2018Conc ){
        maxT3_100m2018Conc = feature.properties.F3Tri100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F3Tri100_18)
    };
}
function apagarT3_100m2018Conc(e) {
    T3_100m2018Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT3_100m2018Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri100_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_100_18ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT3_100m2018Conc,
    });
}
var T3_100m2018Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT3_100m2018Conc,
    onEachFeature: onEachFeatureT3_100m2018Conc
});
let slideT3_100m2018Conc = function(){
    var sliderT3_100m2018Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT3_100m2018Conc, {
        start: [minT3_100m2018Conc, maxT3_100m2018Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_100m2018Conc,
            'max': maxT3_100m2018Conc
        },
        });
    inputNumberMin.setAttribute("value",minT3_100m2018Conc);
    inputNumberMax.setAttribute("value",maxT3_100m2018Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_100m2018Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_100m2018Conc.noUiSlider.set([null, this.value]);
    });

    sliderT3_100m2018Conc.noUiSlider.on('update',function(e){
        T3_100m2018Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Tri100_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F3Tri100_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT3_100m2018Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderT3_100m2018Conc.noUiSlider;
    $(slidersGeral).append(sliderT3_100m2018Conc);
} 

/////////////////////////////// Fim do 3º Trimeste 100m2 2018- -------------- \\\\\\


/////////////////////////------- 4º Trimestre 80m2 2018-----////

var minT4_80m2018Conc = 100;
var maxT4_80m2018Conc = 0;

function EstiloT4_80m2018Conc(feature) {
    if(feature.properties.F3Tri80_18 <= minT4_80m2018Conc || minT4_80m2018Conc === 0){
        minT4_80m2018Conc = feature.properties.F3Tri80_18
    }
    if(feature.properties.F3Tri80_18 >= maxT4_80m2018Conc ){
        maxT4_80m2018Conc = feature.properties.F3Tri80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F3Tri80_18)
    };
}
function apagarT4_80m2018Conc(e) {
    T4_80m2018Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT4_80m2018Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri80_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_80_18MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT4_80m2018Conc,
    });
}
var T4_80m2018Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT4_80m2018Conc,
    onEachFeature: onEachFeatureT4_80m2018Conc
});
let slideT4_80m2018Conc = function(){
    var sliderT4_80m2018Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT4_80m2018Conc, {
        start: [minT4_80m2018Conc, maxT4_80m2018Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_80m2018Conc,
            'max': maxT4_80m2018Conc
        },
        });
    inputNumberMin.setAttribute("value",minT4_80m2018Conc);
    inputNumberMax.setAttribute("value",maxT4_80m2018Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_80m2018Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_80m2018Conc.noUiSlider.set([null, this.value]);
    });

    sliderT4_80m2018Conc.noUiSlider.on('update',function(e){
        T4_80m2018Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Tri80_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F3Tri80_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT4_80m2018Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderT4_80m2018Conc.noUiSlider;
    $(slidersGeral).append(sliderT4_80m2018Conc);
} 

/////////////////////////////// Fim do 4º Trimeste 80m2 2018- -------------- \\\\\\

/////////////////////////------- 4º Trimestre 100m2 2018-----////

var minT4_100m2018Conc = 100;
var maxT4_100m2018Conc = 0;

function EstiloT4_100m2018Conc(feature) {
    if(feature.properties.F4Tri100_18 <= minT4_100m2018Conc || minT4_100m2018Conc === 0){
        minT4_100m2018Conc = feature.properties.F4Tri100_18
    }
    if(feature.properties.F4Tri100_18 >= maxT4_100m2018Conc ){
        maxT4_100m2018Conc = feature.properties.F4Tri100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F4Tri100_18)
    };
}
function apagarT4_100m2018Conc(e) {
    T4_100m2018Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT4_100m2018Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri100_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_100_18ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT4_100m2018Conc,
    });
}
var T4_100m2018Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT4_100m2018Conc,
    onEachFeature: onEachFeatureT4_100m2018Conc
});
let slideT4_100m2018Conc = function(){
    var sliderT4_100m2018Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT4_100m2018Conc, {
        start: [minT4_100m2018Conc, maxT4_100m2018Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_100m2018Conc,
            'max': maxT4_100m2018Conc
        },
        });
    inputNumberMin.setAttribute("value",minT4_100m2018Conc);
    inputNumberMax.setAttribute("value",maxT4_100m2018Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_100m2018Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_100m2018Conc.noUiSlider.set([null, this.value]);
    });

    sliderT4_100m2018Conc.noUiSlider.on('update',function(e){
        T4_100m2018Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Tri100_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F4Tri100_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT4_100m2018Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderT4_100m2018Conc.noUiSlider;
    $(slidersGeral).append(sliderT4_100m2018Conc);
} 

/////////////////////////////// Fim do 4º Trimeste 100m2 2018- -------------- \\\\\\


/////////////////////////------- 1º Trimestre 80m2 2019-----////

var minT1_80m2019Conc = 100;
var maxT1_80m2019Conc = 0;

function EstiloT1_80m2019Conc(feature) {
    if(feature.properties.F1Tri80_19 <= minT1_80m2019Conc || minT1_80m2019Conc === 0){
        minT1_80m2019Conc = feature.properties.F1Tri80_19
    }
    if(feature.properties.F1Tri80_19 >= maxT1_80m2019Conc ){
        maxT1_80m2019Conc = feature.properties.F1Tri80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F1Tri80_19)
    };
}
function apagarT1_80m2019Conc(e) {
    T1_80m2019Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT1_80m2019Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri80_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_80_19MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT1_80m2019Conc,
    });
}
var T1_80m2019Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT1_80m2019Conc,
    onEachFeature: onEachFeatureT1_80m2019Conc
});
let slideT1_80m2019Conc = function(){
    var sliderT1_80m2019Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT1_80m2019Conc, {
        start: [minT1_80m2019Conc, maxT1_80m2019Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_80m2019Conc,
            'max': maxT1_80m2019Conc
        },
        });
    inputNumberMin.setAttribute("value",minT1_80m2019Conc);
    inputNumberMax.setAttribute("value",maxT1_80m2019Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_80m2019Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_80m2019Conc.noUiSlider.set([null, this.value]);
    });

    sliderT1_80m2019Conc.noUiSlider.on('update',function(e){
        T1_80m2019Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Tri80_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F1Tri80_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT1_80m2019Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderT1_80m2019Conc.noUiSlider;
    $(slidersGeral).append(sliderT1_80m2019Conc);
} 

/////////////////////////////// Fim do 1º Trimeste 80m2 2019- -------------- \\\\\\

/////////////////////////------- 1º Trimestre 100m2 2019-----////

var minT1_100m2019Conc = 100;
var maxT1_100m2019Conc = 0;

function EstiloT1_100m2019Conc(feature) {
    if(feature.properties.F1Tri100_19 <= minT1_100m2019Conc || minT1_100m2019Conc === 0){
        minT1_100m2019Conc = feature.properties.F1Tri100_19
    }
    if(feature.properties.F1Tri100_19 >= maxT1_100m2019Conc ){
        maxT1_100m2019Conc = feature.properties.F1Tri100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F1Tri100_19)
    };
}
function apagarT1_100m2019Conc(e) {
    T1_100m2019Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT1_100m2019Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri100_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_100_19ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT1_100m2019Conc,
    });
}
var T1_100m2019Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT1_100m2019Conc,
    onEachFeature: onEachFeatureT1_100m2019Conc
});
let slideT1_100m2019Conc = function(){
    var sliderT1_100m2019Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT1_100m2019Conc, {
        start: [minT1_100m2019Conc, maxT1_100m2019Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_100m2019Conc,
            'max': maxT1_100m2019Conc
        },
        });
    inputNumberMin.setAttribute("value",minT1_100m2019Conc);
    inputNumberMax.setAttribute("value",maxT1_100m2019Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_100m2019Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_100m2019Conc.noUiSlider.set([null, this.value]);
    });

    sliderT1_100m2019Conc.noUiSlider.on('update',function(e){
        T1_100m2019Conc.eachLayer(function(layer){
            if(layer.feature.properties.F1Tri100_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F1Tri100_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT1_100m2019Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderT1_100m2019Conc.noUiSlider;
    $(slidersGeral).append(sliderT1_100m2019Conc);
} 

/////////////////////////////// Fim do 1º Trimeste 100m2 2019- -------------- \\\\\\

/////////////////////////------- 2º Trimestre 80m2 2019-----////

var minT2_80m2019Conc = 100;
var maxT2_80m2019Conc = 0;

function EstiloT2_80m2019Conc(feature) {
    if(feature.properties.F2Tri80_19 <= minT2_80m2019Conc || minT2_80m2019Conc === 0){
        minT2_80m2019Conc = feature.properties.F2Tri80_19
    }
    if(feature.properties.F2Tri80_19 >= maxT2_80m2019Conc ){
        maxT2_80m2019Conc = feature.properties.F2Tri80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F2Tri80_19)
    };
}
function apagarT2_80m2019Conc(e) {
    T2_80m2019Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT2_80m2019Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri80_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_80_19MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT2_80m2019Conc,
    });
}
var T2_80m2019Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT2_80m2019Conc,
    onEachFeature: onEachFeatureT2_80m2019Conc
});
let slideT2_80m2019Conc = function(){
    var sliderT2_80m2019Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT2_80m2019Conc, {
        start: [minT2_80m2019Conc, maxT2_80m2019Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_80m2019Conc,
            'max': maxT2_80m2019Conc
        },
        });
    inputNumberMin.setAttribute("value",minT2_80m2019Conc);
    inputNumberMax.setAttribute("value",maxT2_80m2019Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_80m2019Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_80m2019Conc.noUiSlider.set([null, this.value]);
    });

    sliderT2_80m2019Conc.noUiSlider.on('update',function(e){
        T2_80m2019Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Tri80_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F2Tri80_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT2_80m2019Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderT2_80m2019Conc.noUiSlider;
    $(slidersGeral).append(sliderT2_80m2019Conc);
} 

/////////////////////////////// Fim do 2º Trimeste 80m2 2019- -------------- \\\\\\

/////////////////////////------- 2º Trimestre 100m2 2019-----////

var minT2_100m2019Conc = 100;
var maxT2_100m2019Conc = 0;

function EstiloT2_100m2019Conc(feature) {
    if(feature.properties.F2Tri100_19 <= minT2_100m2019Conc || minT2_100m2019Conc === 0){
        minT2_100m2019Conc = feature.properties.F2Tri100_19
    }
    if(feature.properties.F2Tri100_19 >= maxT2_100m2019Conc ){
        maxT2_100m2019Conc = feature.properties.F2Tri100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F2Tri100_19)
    };
}
function apagarT2_100m2019Conc(e) {
    T2_100m2019Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT2_100m2019Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri100_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_100_19ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT2_100m2019Conc,
    });
}
var T2_100m2019Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT2_100m2019Conc,
    onEachFeature: onEachFeatureT2_100m2019Conc
});
let slideT2_100m2019Conc = function(){
    var sliderT2_100m2019Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT2_100m2019Conc, {
        start: [minT2_100m2019Conc, maxT2_100m2019Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_100m2019Conc,
            'max': maxT2_100m2019Conc
        },
        });
    inputNumberMin.setAttribute("value",minT2_100m2019Conc);
    inputNumberMax.setAttribute("value",maxT2_100m2019Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_100m2019Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_100m2019Conc.noUiSlider.set([null, this.value]);
    });

    sliderT2_100m2019Conc.noUiSlider.on('update',function(e){
        T2_100m2019Conc.eachLayer(function(layer){
            if(layer.feature.properties.F2Tri100_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F2Tri100_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT2_100m2019Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderT2_100m2019Conc.noUiSlider;
    $(slidersGeral).append(sliderT2_100m2019Conc);
} 

/////////////////////////////// Fim do 2º Trimeste 100m2 2019- -------------- \\\\\\

/////////////////////////------- 3º Trimestre 80m2 2019-----////

var minT3_80m2019Conc = 100;
var maxT3_80m2019Conc = 0;

function EstiloT3_80m2019Conc(feature) {
    if(feature.properties.F3Tri80_19 <= minT3_80m2019Conc || minT3_80m2019Conc === 0){
        minT3_80m2019Conc = feature.properties.F3Tri80_19
    }
    if(feature.properties.F3Tri80_19 >= maxT3_80m2019Conc ){
        maxT3_80m2019Conc = feature.properties.F3Tri80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F3Tri80_19)
    };
}
function apagarT3_80m2019Conc(e) {
    T3_80m2019Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT3_80m2019Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri80_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_80_19MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT3_80m2019Conc,
    });
}
var T3_80m2019Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT3_80m2019Conc,
    onEachFeature: onEachFeatureT3_80m2019Conc
});
let slideT3_80m2019Conc = function(){
    var sliderT3_80m2019Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT3_80m2019Conc, {
        start: [minT3_80m2019Conc, maxT3_80m2019Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_80m2019Conc,
            'max': maxT3_80m2019Conc
        },
        });
    inputNumberMin.setAttribute("value",minT3_80m2019Conc);
    inputNumberMax.setAttribute("value",maxT3_80m2019Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_80m2019Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_80m2019Conc.noUiSlider.set([null, this.value]);
    });

    sliderT3_80m2019Conc.noUiSlider.on('update',function(e){
        T3_80m2019Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Tri80_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F3Tri80_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT3_80m2019Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderT3_80m2019Conc.noUiSlider;
    $(slidersGeral).append(sliderT3_80m2019Conc);
} 

/////////////////////////////// Fim do 3º Trimeste 80m2 2019- -------------- \\\\\\

/////////////////////////------- 3º Trimestre 100m2 2019-----////

var minT3_100m2019Conc = 100;
var maxT3_100m2019Conc = 0;

function EstiloT3_100m2019Conc(feature) {
    if(feature.properties.F3Tri100_19 <= minT3_100m2019Conc || minT3_100m2019Conc === 0){
        minT3_100m2019Conc = feature.properties.F3Tri100_19
    }
    if(feature.properties.F3Tri100_19 >= maxT3_100m2019Conc ){
        maxT3_100m2019Conc = feature.properties.F3Tri100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F3Tri100_19)
    };
}
function apagarT3_100m2019Conc(e) {
    T3_100m2019Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT3_100m2019Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri100_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_100_19ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT3_100m2019Conc,
    });
}
var T3_100m2019Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT3_100m2019Conc,
    onEachFeature: onEachFeatureT3_100m2019Conc
});
let slideT3_100m2019Conc = function(){
    var sliderT3_100m2019Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT3_100m2019Conc, {
        start: [minT3_100m2019Conc, maxT3_100m2019Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_100m2019Conc,
            'max': maxT3_100m2019Conc
        },
        });
    inputNumberMin.setAttribute("value",minT3_100m2019Conc);
    inputNumberMax.setAttribute("value",maxT3_100m2019Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_100m2019Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_100m2019Conc.noUiSlider.set([null, this.value]);
    });

    sliderT3_100m2019Conc.noUiSlider.on('update',function(e){
        T3_100m2019Conc.eachLayer(function(layer){
            if(layer.feature.properties.F3Tri100_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F3Tri100_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT3_100m2019Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderT3_100m2019Conc.noUiSlider;
    $(slidersGeral).append(sliderT3_100m2019Conc);
} 

/////////////////////////////// Fim do 3º Trimeste 100m2 2019- -------------- \\\\\\


/////////////////////////------- 4º Trimestre 80m2 2019-----////

var minT4_80m2019Conc = 100;
var maxT4_80m2019Conc = 0;

function EstiloT4_80m2019Conc(feature) {
    if(feature.properties.F4Tri80_19 <= minT4_80m2019Conc || minT4_80m2019Conc === 0){
        minT4_80m2019Conc = feature.properties.F4Tri80_19
    }
    if(feature.properties.F4Tri80_19 >= maxT4_80m2019Conc ){
        maxT4_80m2019Conc = feature.properties.F4Tri80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.F4Tri80_19)
    };
}
function apagarT4_80m2019Conc(e) {
    T4_80m2019Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT4_80m2019Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri80_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_80_19MES + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT4_80m2019Conc,
    });
}
var T4_80m2019Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT4_80m2019Conc,
    onEachFeature: onEachFeatureT4_80m2019Conc
});
let slideT4_80m2019Conc = function(){
    var sliderT4_80m2019Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT4_80m2019Conc, {
        start: [minT4_80m2019Conc, maxT4_80m2019Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_80m2019Conc,
            'max': maxT4_80m2019Conc
        },
        });
    inputNumberMin.setAttribute("value",minT4_80m2019Conc);
    inputNumberMax.setAttribute("value",maxT4_80m2019Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_80m2019Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_80m2019Conc.noUiSlider.set([null, this.value]);
    });

    sliderT4_80m2019Conc.noUiSlider.on('update',function(e){
        T4_80m2019Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Tri80_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F4Tri80_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT4_80m2019Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderT4_80m2019Conc.noUiSlider;
    $(slidersGeral).append(sliderT4_80m2019Conc);
} 

/////////////////////////////// Fim do 4º Trimeste 80m2 2019- -------------- \\\\\\

/////////////////////////------- 4º Trimestre 100m2 2019-----////

var minT4_100m2019Conc = 100;
var maxT4_100m2019Conc = 0;

function EstiloT4_100m2019Conc(feature) {
    if(feature.properties.F4Tri100_19 <= minT4_100m2019Conc || minT4_100m2019Conc === 0){
        minT4_100m2019Conc = feature.properties.F4Tri100_19
    }
    if(feature.properties.F4Tri100_19 >= maxT4_100m2019Conc ){
        maxT4_100m2019Conc = feature.properties.F4Tri100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.F4Tri100_19)
    };
}
function apagarT4_100m2019Conc(e) {
    T4_100m2019Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureT4_100m2019Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri100_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_100_19ME + '</b>' +' meses.').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarT4_100m2019Conc,
    });
}
var T4_100m2019Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloT4_100m2019Conc,
    onEachFeature: onEachFeatureT4_100m2019Conc
});
let slideT4_100m2019Conc = function(){
    var sliderT4_100m2019Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderT4_100m2019Conc, {
        start: [minT4_100m2019Conc, maxT4_100m2019Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_100m2019Conc,
            'max': maxT4_100m2019Conc
        },
        });
    inputNumberMin.setAttribute("value",minT4_100m2019Conc);
    inputNumberMax.setAttribute("value",maxT4_100m2019Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_100m2019Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_100m2019Conc.noUiSlider.set([null, this.value]);
    });

    sliderT4_100m2019Conc.noUiSlider.on('update',function(e){
        T4_100m2019Conc.eachLayer(function(layer){
            if(layer.feature.properties.F4Tri100_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.F4Tri100_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderT4_100m2019Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderT4_100m2019Conc.noUiSlider;
    $(slidersGeral).append(sliderT4_100m2019Conc);
} 

/////////////////////////////// Fim do 4º Trimeste 100m2 2019- -------------- \\\\\\


///////////////////////--------------------- FREGUESIAS ----\\\\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////------- 1º Trimestre 80m2 2016-----////

var minT1_80m2016Freg = 100;
var maxT1_80m2016Freg = 0;

function CorTaxaEsforco80mFreg(d) {
    return d == null ? '#808080' :
        d >= 50.26 ? '#8c0303' :
        d >= 42.54  ? '#de1f35' :
        d >= 29.67 ? '#ff5e6e' :
        d >= 16.80   ? '#f5b3be' :
        d >= 3.93   ? '#F2C572' :
                ''  ;
}
var legendaTaxaEsforco80mFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: Anos' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 42 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 29 a 42' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 16 a 29' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 3 a 16' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function estiloT1_80m2016Freg(feature) {
    if(feature.properties.F1Tri80_16 <= minT1_80m2016Freg && feature.properties.F1Tri80_16 > null || feature.properties.F1Tri80_16 === 0){
        minT1_80m2016Freg = feature.properties.F1Tri80_16
    }
    if(feature.properties.F1Tri80_16 > maxT1_80m2016Freg ){
        maxT1_80m2016Freg = feature.properties.F1Tri80_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F1Tri80_16)
    };
}
function apagarT1_80m2016Freg(e){
    var layer = e.target;
    T1_80m2016Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT1_80m2016Freg(feature, layer) {
    if (feature.properties.F1_80_16MES == null && feature.properties.F1Tri80_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri80_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_80_16MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT1_80m2016Freg,
    })
};

var T1_80m2016Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT1_80m2016Freg,
    onEachFeature: onEachFeatureT1_80m2016Freg,
});

var slideT1_80m2016Freg = function(){
    var sliderT1_80m2016Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT1_80m2016Freg, {
        start: [minT1_80m2016Freg, maxT1_80m2016Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_80m2016Freg,
            'max': maxT1_80m2016Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT1_80m2016Freg);
    inputNumberMax.setAttribute("value",maxT1_80m2016Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_80m2016Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_80m2016Freg.noUiSlider.set([null, this.value]);
    });

    sliderT1_80m2016Freg.noUiSlider.on('update',function(e){
        T1_80m2016Freg.eachLayer(function(layer){
            if (layer.feature.properties.F1Tri80_16 == null){
                return false
            }
            if(layer.feature.properties.F1Tri80_16.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F1Tri80_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT1_80m2016Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderT1_80m2016Freg.noUiSlider;
    $(slidersGeral).append(sliderT1_80m2016Freg);
}
///////////////////////////-------------------- Fim 1º Trimestre 80m2 2016-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 1º Trimestre 100m2 2016-----////

var minT1_100m2016Freg = 100;
var maxT1_100m2016Freg = 0;

function CorTaxaEsforco100mFreg(d) {
    return d == null ? '#808080' :
        d >= 57.64 ? '#8c0303' :
        d >= 48.71   ? '#de1f35' :
        d >= 33.84 ? '#ff5e6e' :
        d >= 18.96   ? '#f5b3be' :
        d >= 4.08   ? '#F2C572' :
                ''  ;
}
var legendaTaxaEsforco100mFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: Anos' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 48 a 57' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 33 a 48' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 18 a 33' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 4 a 18' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function estiloT1_100m2016Freg(feature) {
    if(feature.properties.F1Tri100_16 <= minT1_100m2016Freg && feature.properties.F1Tri100_16 > null || feature.properties.F1Tri100_16 === 0){
        minT1_100m2016Freg = feature.properties.F1Tri100_16
    }
    if(feature.properties.F1Tri100_16 > maxT1_100m2016Freg ){
        maxT1_100m2016Freg = feature.properties.F1Tri100_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F1Tri100_16)
    };
}
function apagarT1_100m2016Freg(e){
    var layer = e.target;
    T1_100m2016Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT1_100m2016Freg(feature, layer) {
    if (feature.properties.F1_100_16ME == null && feature.properties.F1Tri100_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri100_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_100_16ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT1_100m2016Freg,
    })
};

var T1_100m2016Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT1_100m2016Freg,
    onEachFeature: onEachFeatureT1_100m2016Freg,
});

var slideT1_100m2016Freg = function(){
    var sliderT1_100m2016Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT1_100m2016Freg, {
        start: [minT1_100m2016Freg, maxT1_100m2016Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_100m2016Freg,
            'max': maxT1_100m2016Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT1_100m2016Freg);
    inputNumberMax.setAttribute("value",maxT1_100m2016Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_100m2016Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_100m2016Freg.noUiSlider.set([null, this.value]);
    });

    sliderT1_100m2016Freg.noUiSlider.on('update',function(e){
        T1_100m2016Freg.eachLayer(function(layer){
            if (layer.feature.properties.F1Tri100_16 == null){
                return false
            }
            if(layer.feature.properties.F1Tri100_16.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F1Tri100_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT1_100m2016Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderT1_100m2016Freg.noUiSlider;
    $(slidersGeral).append(sliderT1_100m2016Freg);
}
///////////////////////////-------------------- Fim 1º Trimestre 100m2 2016-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////////////------- 2º Trimestre 80m2 2016-----////

var minT2_80m2016Freg = 100;
var maxT2_80m2016Freg = 0;

function estiloT2_80m2016Freg(feature) {
    if(feature.properties.F2Tri80_16 <= minT2_80m2016Freg && feature.properties.F2Tri80_16 > null || feature.properties.F2Tri80_16 === 0){
        minT2_80m2016Freg = feature.properties.F2Tri80_16
    }
    if(feature.properties.F2Tri80_16 > maxT2_80m2016Freg ){
        maxT2_80m2016Freg = feature.properties.F2Tri80_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F2Tri80_16)
    };
}
function apagarT2_80m2016Freg(e){
    var layer = e.target;
    T2_80m2016Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT2_80m2016Freg(feature, layer) {
    if (feature.properties.F2_80_16MES == null && feature.properties.F2Tri80_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri80_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_80_16MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT2_80m2016Freg,
    })
};

var T2_80m2016Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT2_80m2016Freg,
    onEachFeature: onEachFeatureT2_80m2016Freg,
});

var slideT2_80m2016Freg = function(){
    var sliderT2_80m2016Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT2_80m2016Freg, {
        start: [minT2_80m2016Freg, maxT2_80m2016Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_80m2016Freg,
            'max': maxT2_80m2016Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT2_80m2016Freg);
    inputNumberMax.setAttribute("value",maxT2_80m2016Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_80m2016Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_80m2016Freg.noUiSlider.set([null, this.value]);
    });

    sliderT2_80m2016Freg.noUiSlider.on('update',function(e){
        T2_80m2016Freg.eachLayer(function(layer){
            if (layer.feature.properties.F2Tri80_16 == null){
                return false
            }
            if(layer.feature.properties.F2Tri80_16.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F2Tri80_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT2_80m2016Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderT2_80m2016Freg.noUiSlider;
    $(slidersGeral).append(sliderT2_80m2016Freg);
}
///////////////////////////-------------------- Fim 2º Trimestre 80m2 2016-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 2º Trimestre 100m2 2016-----////

var minT2_100m2016Freg = 100;
var maxT2_100m2016Freg = 0;

function estiloT2_100m2016Freg(feature) {
    if(feature.properties.F2Tri100_16 <= minT2_100m2016Freg && feature.properties.F2Tri100_16 > null || feature.properties.F2Tri100_16 === 0){
        minT2_100m2016Freg = feature.properties.F2Tri100_16
    }
    if(feature.properties.F2Tri100_16 > maxT2_100m2016Freg ){
        maxT2_100m2016Freg = feature.properties.F2Tri100_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F2Tri100_16)
    };
}
function apagarT2_100m2016Freg(e){
    var layer = e.target;
    T2_100m2016Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT2_100m2016Freg(feature, layer) {
    if (feature.properties.F2_100_16ME == null && feature.properties.F2Tri100_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri100_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_100_16ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT2_100m2016Freg,
    })
};

var T2_100m2016Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT2_100m2016Freg,
    onEachFeature: onEachFeatureT2_100m2016Freg,
});

var slideT2_100m2016Freg = function(){
    var sliderT2_100m2016Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT2_100m2016Freg, {
        start: [minT2_100m2016Freg, maxT2_100m2016Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_100m2016Freg,
            'max': maxT2_100m2016Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT2_100m2016Freg);
    inputNumberMax.setAttribute("value",maxT2_100m2016Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_100m2016Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_100m2016Freg.noUiSlider.set([null, this.value]);
    });

    sliderT2_100m2016Freg.noUiSlider.on('update',function(e){
        T2_100m2016Freg.eachLayer(function(layer){
            if (layer.feature.properties.F2Tri100_16 == null){
                return false
            }
            if(layer.feature.properties.F2Tri100_16.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F2Tri100_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT2_100m2016Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderT2_100m2016Freg.noUiSlider;
    $(slidersGeral).append(sliderT2_100m2016Freg);
}
///////////////////////////-------------------- Fim 2º Trimestre 100m2 2016-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////////////------- 3º Trimestre 80m2 2016-----////

var minT3_80m2016Freg = 100;
var maxT3_80m2016Freg = 0;

function estiloT3_80m2016Freg(feature) {
    if(feature.properties.F3Tri80_16 <= minT3_80m2016Freg && feature.properties.F3Tri80_16 > null || feature.properties.F3Tri80_16 === 0){
        minT3_80m2016Freg = feature.properties.F3Tri80_16
    }
    if(feature.properties.F3Tri80_16 > maxT3_80m2016Freg ){
        maxT3_80m2016Freg = feature.properties.F3Tri80_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F3Tri80_16)
    };
}
function apagarT3_80m2016Freg(e){
    var layer = e.target;
    T3_80m2016Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT3_80m2016Freg(feature, layer) {
    if (feature.properties.F3_80_16MES == null && feature.properties.F3Tri80_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri80_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_80_16MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT3_80m2016Freg,
    })
};

var T3_80m2016Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT3_80m2016Freg,
    onEachFeature: onEachFeatureT3_80m2016Freg,
});

var slideT3_80m2016Freg = function(){
    var sliderT3_80m2016Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT3_80m2016Freg, {
        start: [minT3_80m2016Freg, maxT3_80m2016Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_80m2016Freg,
            'max': maxT3_80m2016Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT3_80m2016Freg);
    inputNumberMax.setAttribute("value",maxT3_80m2016Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_80m2016Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_80m2016Freg.noUiSlider.set([null, this.value]);
    });

    sliderT3_80m2016Freg.noUiSlider.on('update',function(e){
        T3_80m2016Freg.eachLayer(function(layer){
            if (layer.feature.properties.F3Tri80_16 == null){
                return false
            }
            if(layer.feature.properties.F3Tri80_16.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F3Tri80_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT3_80m2016Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderT3_80m2016Freg.noUiSlider;
    $(slidersGeral).append(sliderT3_80m2016Freg);
}
///////////////////////////-------------------- Fim 3º Trimestre 80m2 2016-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 3º Trimestre 100m2 2016-----////

var minT3_100m2016Freg = 100;
var maxT3_100m2016Freg = 0;

function estiloT3_100m2016Freg(feature) {
    if(feature.properties.F3Tri100_16 <= minT3_100m2016Freg && feature.properties.F3Tri100_16 > null || feature.properties.F3Tri100_16 === 0){
        minT3_100m2016Freg = feature.properties.F3Tri100_16
    }
    if(feature.properties.F3Tri100_16 > maxT3_100m2016Freg ){
        maxT3_100m2016Freg = feature.properties.F3Tri100_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F3Tri100_16)
    };
}
function apagarT3_100m2016Freg(e){
    var layer = e.target;
    T3_100m2016Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT3_100m2016Freg(feature, layer) {
    if (feature.properties.F3_100_16ME == null && feature.properties.F3Tri100_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri100_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_100_16ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT3_100m2016Freg,
    })
};

var T3_100m2016Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT3_100m2016Freg,
    onEachFeature: onEachFeatureT3_100m2016Freg,
});

var slideT3_100m2016Freg = function(){
    var sliderT3_100m2016Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT3_100m2016Freg, {
        start: [minT3_100m2016Freg, maxT3_100m2016Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_100m2016Freg,
            'max': maxT3_100m2016Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT3_100m2016Freg);
    inputNumberMax.setAttribute("value",maxT3_100m2016Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_100m2016Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_100m2016Freg.noUiSlider.set([null, this.value]);
    });

    sliderT3_100m2016Freg.noUiSlider.on('update',function(e){
        T3_100m2016Freg.eachLayer(function(layer){
            if (layer.feature.properties.F3Tri100_16 == null){
                return false
            }
            if(layer.feature.properties.F3Tri100_16.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F3Tri100_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT3_100m2016Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderT3_100m2016Freg.noUiSlider;
    $(slidersGeral).append(sliderT3_100m2016Freg);
}
///////////////////////////-------------------- Fim 3º Trimestre 100m2 2016-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////////////------- 4º Trimestre 80m2 2016-----////

var minT4_80m2016Freg = 100;
var maxT4_80m2016Freg = 0;

function estiloT4_80m2016Freg(feature) {
    if(feature.properties.F4Tri80_16 <= minT4_80m2016Freg && feature.properties.F4Tri80_16 > null || feature.properties.F4Tri80_16 === 0){
        minT4_80m2016Freg = feature.properties.F4Tri80_16
    }
    if(feature.properties.F4Tri80_16 > maxT4_80m2016Freg ){
        maxT4_80m2016Freg = feature.properties.F4Tri80_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F4Tri80_16)
    };
}
function apagarT4_80m2016Freg(e){
    var layer = e.target;
    T4_80m2016Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT4_80m2016Freg(feature, layer) {
    if (feature.properties.F4_80_16MES == null && feature.properties.F4Tri80_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri80_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_80_16MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT4_80m2016Freg,
    })
};

var T4_80m2016Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT4_80m2016Freg,
    onEachFeature: onEachFeatureT4_80m2016Freg,
});

var slideT4_80m2016Freg = function(){
    var sliderT4_80m2016Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT4_80m2016Freg, {
        start: [minT4_80m2016Freg, maxT4_80m2016Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_80m2016Freg,
            'max': maxT4_80m2016Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT4_80m2016Freg);
    inputNumberMax.setAttribute("value",maxT4_80m2016Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_80m2016Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_80m2016Freg.noUiSlider.set([null, this.value]);
    });

    sliderT4_80m2016Freg.noUiSlider.on('update',function(e){
        T4_80m2016Freg.eachLayer(function(layer){
            if (layer.feature.properties.F4Tri80_16 == null){
                return false
            }
            if(layer.feature.properties.F4Tri80_16.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F4Tri80_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT4_80m2016Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderT4_80m2016Freg.noUiSlider;
    $(slidersGeral).append(sliderT4_80m2016Freg);
}
///////////////////////////-------------------- Fim 4º Trimestre 80m2 2016-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 4º Trimestre 100m2 2016-----////

var minT4_100m2016Freg = 100;
var maxT4_100m2016Freg = 0;

function estiloT4_100m2016Freg(feature) {
    if(feature.properties.F4Tri100_16 <= minT4_100m2016Freg && feature.properties.F4Tri100_16 > null || feature.properties.F4Tri100_16 === 0){
        minT4_100m2016Freg = feature.properties.F4Tri100_16
    }
    if(feature.properties.F4Tri100_16 > maxT4_100m2016Freg ){
        maxT4_100m2016Freg = feature.properties.F4Tri100_16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F4Tri100_16)
    };
}
function apagarT4_100m2016Freg(e){
    var layer = e.target;
    T4_100m2016Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT4_100m2016Freg(feature, layer) {
    if (feature.properties.F4_100_16ME == null && feature.properties.F4Tri100_16 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri100_16-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_100_16ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT4_100m2016Freg,
    })
};

var T4_100m2016Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT4_100m2016Freg,
    onEachFeature: onEachFeatureT4_100m2016Freg,
});

var slideT4_100m2016Freg = function(){
    var sliderT4_100m2016Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT4_100m2016Freg, {
        start: [minT4_100m2016Freg, maxT4_100m2016Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_100m2016Freg,
            'max': maxT4_100m2016Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT4_100m2016Freg);
    inputNumberMax.setAttribute("value",maxT4_100m2016Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_100m2016Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_100m2016Freg.noUiSlider.set([null, this.value]);
    });

    sliderT4_100m2016Freg.noUiSlider.on('update',function(e){
        T4_100m2016Freg.eachLayer(function(layer){
            if (layer.feature.properties.F4Tri100_16 == null){
                return false
            }
            if(layer.feature.properties.F4Tri100_16.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F4Tri100_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT4_100m2016Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderT4_100m2016Freg.noUiSlider;
    $(slidersGeral).append(sliderT4_100m2016Freg);
}
///////////////////////////-------------------- Fim 4º Trimestre 100m2 2016-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////---------------------------- 1º Trimestre 80m2 2017-----////

var minT1_80m2017Freg = 100;
var maxT1_80m2017Freg = 0;

function estiloT1_80m2017Freg(feature) {
    if(feature.properties.F1Tri80_17 <= minT1_80m2017Freg && feature.properties.F1Tri80_17 > null || feature.properties.F1Tri80_17 === 0){
        minT1_80m2017Freg = feature.properties.F1Tri80_17
    }
    if(feature.properties.F1Tri80_17 > maxT1_80m2017Freg ){
        maxT1_80m2017Freg = feature.properties.F1Tri80_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F1Tri80_17)
    };
}
function apagarT1_80m2017Freg(e){
    var layer = e.target;
    T1_80m2017Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT1_80m2017Freg(feature, layer) {
    if (feature.properties.F1_80_17MES == null && feature.properties.F1Tri80_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri80_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_80_17MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT1_80m2017Freg,
    })
};

var T1_80m2017Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT1_80m2017Freg,
    onEachFeature: onEachFeatureT1_80m2017Freg,
});

var slideT1_80m2017Freg = function(){
    var sliderT1_80m2017Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT1_80m2017Freg, {
        start: [minT1_80m2017Freg, maxT1_80m2017Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_80m2017Freg,
            'max': maxT1_80m2017Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT1_80m2017Freg);
    inputNumberMax.setAttribute("value",maxT1_80m2017Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_80m2017Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_80m2017Freg.noUiSlider.set([null, this.value]);
    });

    sliderT1_80m2017Freg.noUiSlider.on('update',function(e){
        T1_80m2017Freg.eachLayer(function(layer){
            if (layer.feature.properties.F1Tri80_17 == null){
                return false
            }
            if(layer.feature.properties.F1Tri80_17.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F1Tri80_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT1_80m2017Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderT1_80m2017Freg.noUiSlider;
    $(slidersGeral).append(sliderT1_80m2017Freg);
}
///////////////////////////-------------------- Fim 1º Trimestre 80m2 2017-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 1º Trimestre 100m2 2017-----////

var minT1_100m2017Freg = 100;
var maxT1_100m2017Freg = 0;

function estiloT1_100m2017Freg(feature) {
    if(feature.properties.F1Tri100_17 <= minT1_100m2017Freg && feature.properties.F1Tri100_17 > null || feature.properties.F1Tri100_17 === 0){
        minT1_100m2017Freg = feature.properties.F1Tri100_17
    }
    if(feature.properties.F1Tri100_17 > maxT1_100m2017Freg ){
        maxT1_100m2017Freg = feature.properties.F1Tri100_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F1Tri100_17)
    };
}
function apagarT1_100m2017Freg(e){
    var layer = e.target;
    T1_100m2017Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT1_100m2017Freg(feature, layer) {
    if (feature.properties.F1_100_17ME == null && feature.properties.F1Tri100_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri100_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_100_17ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT1_100m2017Freg,
    })
};

var T1_100m2017Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT1_100m2017Freg,
    onEachFeature: onEachFeatureT1_100m2017Freg,
});

var slideT1_100m2017Freg = function(){
    var sliderT1_100m2017Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 42){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT1_100m2017Freg, {
        start: [minT1_100m2017Freg, maxT1_100m2017Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_100m2017Freg,
            'max': maxT1_100m2017Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT1_100m2017Freg);
    inputNumberMax.setAttribute("value",maxT1_100m2017Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_100m2017Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_100m2017Freg.noUiSlider.set([null, this.value]);
    });

    sliderT1_100m2017Freg.noUiSlider.on('update',function(e){
        T1_100m2017Freg.eachLayer(function(layer){
            if (layer.feature.properties.F1Tri100_17 == null){
                return false
            }
            if(layer.feature.properties.F1Tri100_17.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F1Tri100_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT1_100m2017Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 42;
    sliderAtivo = sliderT1_100m2017Freg.noUiSlider;
    $(slidersGeral).append(sliderT1_100m2017Freg);
}
///////////////////////////-------------------- Fim 1º Trimestre 100m2 2017-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////////////------- 2º Trimestre 80m2 2017-----////

var minT2_80m2017Freg = 100;
var maxT2_80m2017Freg = 0;

function estiloT2_80m2017Freg(feature) {
    if(feature.properties.F2Tri80_17 <= minT2_80m2017Freg && feature.properties.F2Tri80_17 > null || feature.properties.F2Tri80_17 === 0){
        minT2_80m2017Freg = feature.properties.F2Tri80_17
    }
    if(feature.properties.F2Tri80_17 > maxT2_80m2017Freg ){
        maxT2_80m2017Freg = feature.properties.F2Tri80_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F2Tri80_17)
    };
}
function apagarT2_80m2017Freg(e){
    var layer = e.target;
    T2_80m2017Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT2_80m2017Freg(feature, layer) {
    if (feature.properties.F2_80_17MES == null && feature.properties.F2Tri80_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri80_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_80_17MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT2_80m2017Freg,
    })
};

var T2_80m2017Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT2_80m2017Freg,
    onEachFeature: onEachFeatureT2_80m2017Freg,
});

var slideT2_80m2017Freg = function(){
    var sliderT2_80m2017Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 43){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT2_80m2017Freg, {
        start: [minT2_80m2017Freg, maxT2_80m2017Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_80m2017Freg,
            'max': maxT2_80m2017Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT2_80m2017Freg);
    inputNumberMax.setAttribute("value",maxT2_80m2017Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_80m2017Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_80m2017Freg.noUiSlider.set([null, this.value]);
    });

    sliderT2_80m2017Freg.noUiSlider.on('update',function(e){
        T2_80m2017Freg.eachLayer(function(layer){
            if (layer.feature.properties.F2Tri80_17 == null){
                return false
            }
            if(layer.feature.properties.F2Tri80_17.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F2Tri80_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT2_80m2017Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 43;
    sliderAtivo = sliderT2_80m2017Freg.noUiSlider;
    $(slidersGeral).append(sliderT2_80m2017Freg);
}
///////////////////////////-------------------- Fim 2º Trimestre 80m2 2017-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 2º Trimestre 100m2 2017-----////

var minT2_100m2017Freg = 100;
var maxT2_100m2017Freg = 0;

function estiloT2_100m2017Freg(feature) {
    if(feature.properties.F2Tri100_17 <= minT2_100m2017Freg && feature.properties.F2Tri100_17 > null || feature.properties.F2Tri100_17 === 0){
        minT2_100m2017Freg = feature.properties.F2Tri100_17
    }
    if(feature.properties.F2Tri100_17 > maxT2_100m2017Freg ){
        maxT2_100m2017Freg = feature.properties.F2Tri100_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F2Tri100_17)
    };
}
function apagarT2_100m2017Freg(e){
    var layer = e.target;
    T2_100m2017Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT2_100m2017Freg(feature, layer) {
    if (feature.properties.F2_100_17ME == null && feature.properties.F2Tri100_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri100_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_100_17ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT2_100m2017Freg,
    })
};

var T2_100m2017Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT2_100m2017Freg,
    onEachFeature: onEachFeatureT2_100m2017Freg,
});

var slideT2_100m2017Freg = function(){
    var sliderT2_100m2017Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 44){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT2_100m2017Freg, {
        start: [minT2_100m2017Freg, maxT2_100m2017Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_100m2017Freg,
            'max': maxT2_100m2017Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT2_100m2017Freg);
    inputNumberMax.setAttribute("value",maxT2_100m2017Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_100m2017Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_100m2017Freg.noUiSlider.set([null, this.value]);
    });

    sliderT2_100m2017Freg.noUiSlider.on('update',function(e){
        T2_100m2017Freg.eachLayer(function(layer){
            if (layer.feature.properties.F2Tri100_17 == null){
                return false
            }
            if(layer.feature.properties.F2Tri100_17.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F2Tri100_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT2_100m2017Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 44;
    sliderAtivo = sliderT2_100m2017Freg.noUiSlider;
    $(slidersGeral).append(sliderT2_100m2017Freg);
}
///////////////////////////-------------------- Fim 2º Trimestre 100m2 2017-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////////////------- 3º Trimestre 80m2 2017-----////

var minT3_80m2017Freg = 100;
var maxT3_80m2017Freg = 0;

function estiloT3_80m2017Freg(feature) {
    if(feature.properties.F3Tri80_17 <= minT3_80m2017Freg && feature.properties.F3Tri80_17 > null || feature.properties.F3Tri80_17 === 0){
        minT3_80m2017Freg = feature.properties.F3Tri80_17
    }
    if(feature.properties.F3Tri80_17 > maxT3_80m2017Freg ){
        maxT3_80m2017Freg = feature.properties.F3Tri80_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F3Tri80_17)
    };
}
function apagarT3_80m2017Freg(e){
    var layer = e.target;
    T3_80m2017Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT3_80m2017Freg(feature, layer) {
    if (feature.properties.F3_80_17MES == null && feature.properties.F3Tri80_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri80_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_80_17MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT3_80m2017Freg,
    })
};

var T3_80m2017Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT3_80m2017Freg,
    onEachFeature: onEachFeatureT3_80m2017Freg,
});

var slideT3_80m2017Freg = function(){
    var sliderT3_80m2017Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 45){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT3_80m2017Freg, {
        start: [minT3_80m2017Freg, maxT3_80m2017Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_80m2017Freg,
            'max': maxT3_80m2017Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT3_80m2017Freg);
    inputNumberMax.setAttribute("value",maxT3_80m2017Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_80m2017Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_80m2017Freg.noUiSlider.set([null, this.value]);
    });

    sliderT3_80m2017Freg.noUiSlider.on('update',function(e){
        T3_80m2017Freg.eachLayer(function(layer){
            if (layer.feature.properties.F3Tri80_17 == null){
                return false
            }
            if(layer.feature.properties.F3Tri80_17.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F3Tri80_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT3_80m2017Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 45;
    sliderAtivo = sliderT3_80m2017Freg.noUiSlider;
    $(slidersGeral).append(sliderT3_80m2017Freg);
}
///////////////////////////-------------------- Fim 3º Trimestre 80m2 2017-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 3º Trimestre 100m2 2017-----////

var minT3_100m2017Freg = 100;
var maxT3_100m2017Freg = 0;

function estiloT3_100m2017Freg(feature) {
    if(feature.properties.F3Tri100_17 <= minT3_100m2017Freg && feature.properties.F3Tri100_17 > null || feature.properties.F3Tri100_17 === 0){
        minT3_100m2017Freg = feature.properties.F3Tri100_17
    }
    if(feature.properties.F3Tri100_17 > maxT3_100m2017Freg ){
        maxT3_100m2017Freg = feature.properties.F3Tri100_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F3Tri100_17)
    };
}
function apagarT3_100m2017Freg(e){
    var layer = e.target;
    T3_100m2017Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT3_100m2017Freg(feature, layer) {
    if (feature.properties.F3_100_17ME == null && feature.properties.F3Tri100_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri100_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_100_17ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT3_100m2017Freg,
    })
};

var T3_100m2017Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT3_100m2017Freg,
    onEachFeature: onEachFeatureT3_100m2017Freg,
});

var slideT3_100m2017Freg = function(){
    var sliderT3_100m2017Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 46){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT3_100m2017Freg, {
        start: [minT3_100m2017Freg, maxT3_100m2017Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_100m2017Freg,
            'max': maxT3_100m2017Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT3_100m2017Freg);
    inputNumberMax.setAttribute("value",maxT3_100m2017Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_100m2017Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_100m2017Freg.noUiSlider.set([null, this.value]);
    });

    sliderT3_100m2017Freg.noUiSlider.on('update',function(e){
        T3_100m2017Freg.eachLayer(function(layer){
            if (layer.feature.properties.F3Tri100_17 == null){
                return false
            }
            if(layer.feature.properties.F3Tri100_17.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F3Tri100_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT3_100m2017Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 46;
    sliderAtivo = sliderT3_100m2017Freg.noUiSlider;
    $(slidersGeral).append(sliderT3_100m2017Freg);
}
///////////////////////////-------------------- Fim 3º Trimestre 100m2 2017-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////////////------- 4º Trimestre 80m2 2017-----////

var minT4_80m2017Freg = 100;
var maxT4_80m2017Freg = 0;

function estiloT4_80m2017Freg(feature) {
    if(feature.properties.F4Tri80_17 <= minT4_80m2017Freg && feature.properties.F4Tri80_17 > null || feature.properties.F4Tri80_17 === 0){
        minT4_80m2017Freg = feature.properties.F4Tri80_17
    }
    if(feature.properties.F4Tri80_17 > maxT4_80m2017Freg ){
        maxT4_80m2017Freg = feature.properties.F4Tri80_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F4Tri80_17)
    };
}
function apagarT4_80m2017Freg(e){
    var layer = e.target;
    T4_80m2017Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT4_80m2017Freg(feature, layer) {
    if (feature.properties.F4_80_17MES == null && feature.properties.F4Tri80_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri80_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_80_17MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT4_80m2017Freg,
    })
};

var T4_80m2017Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT4_80m2017Freg,
    onEachFeature: onEachFeatureT4_80m2017Freg,
});

var slideT4_80m2017Freg = function(){
    var sliderT4_80m2017Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 47){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT4_80m2017Freg, {
        start: [minT4_80m2017Freg, maxT4_80m2017Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_80m2017Freg,
            'max': maxT4_80m2017Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT4_80m2017Freg);
    inputNumberMax.setAttribute("value",maxT4_80m2017Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_80m2017Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_80m2017Freg.noUiSlider.set([null, this.value]);
    });

    sliderT4_80m2017Freg.noUiSlider.on('update',function(e){
        T4_80m2017Freg.eachLayer(function(layer){
            if (layer.feature.properties.F4Tri80_17 == null){
                return false
            }
            if(layer.feature.properties.F4Tri80_17.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F4Tri80_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT4_80m2017Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 47;
    sliderAtivo = sliderT4_80m2017Freg.noUiSlider;
    $(slidersGeral).append(sliderT4_80m2017Freg);
}
///////////////////////////-------------------- Fim 4º Trimestre 80m2 2017-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 4º Trimestre 100m2 2017-----////

var minT4_100m2017Freg = 100;
var maxT4_100m2017Freg = 0;

function estiloT4_100m2017Freg(feature) {
    if(feature.properties.F4Tri100_17 <= minT4_100m2017Freg && feature.properties.F4Tri100_17 > null || feature.properties.F4Tri100_17 === 0){
        minT4_100m2017Freg = feature.properties.F4Tri100_17
    }
    if(feature.properties.F4Tri100_17 > maxT4_100m2017Freg ){
        maxT4_100m2017Freg = feature.properties.F4Tri100_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F4Tri100_17)
    };
}
function apagarT4_100m2017Freg(e){
    var layer = e.target;
    T4_100m2017Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT4_100m2017Freg(feature, layer) {
    if (feature.properties.F4_100_17ME == null && feature.properties.F4Tri100_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri100_17-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_100_17ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT4_100m2017Freg,
    })
};

var T4_100m2017Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT4_100m2017Freg,
    onEachFeature: onEachFeatureT4_100m2017Freg,
});

var slideT4_100m2017Freg = function(){
    var sliderT4_100m2017Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 48){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT4_100m2017Freg, {
        start: [minT4_100m2017Freg, maxT4_100m2017Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_100m2017Freg,
            'max': maxT4_100m2017Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT4_100m2017Freg);
    inputNumberMax.setAttribute("value",maxT4_100m2017Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_100m2017Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_100m2017Freg.noUiSlider.set([null, this.value]);
    });

    sliderT4_100m2017Freg.noUiSlider.on('update',function(e){
        T4_100m2017Freg.eachLayer(function(layer){
            if (layer.feature.properties.F4Tri100_17 == null){
                return false
            }
            if(layer.feature.properties.F4Tri100_17.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F4Tri100_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT4_100m2017Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 48;
    sliderAtivo = sliderT4_100m2017Freg.noUiSlider;
    $(slidersGeral).append(sliderT4_100m2017Freg);
}
///////////////////////////-------------------- Fim 4º Trimestre 100m2 2017-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\



/////////////////////////---------------------------- 1º Trimestre 80m2 2018-----////

var minT1_80m2018Freg = 100;
var maxT1_80m2018Freg = 0;

function estiloT1_80m2018Freg(feature) {
    if(feature.properties.F1Tri80_18 <= minT1_80m2018Freg && feature.properties.F1Tri80_18 > null || feature.properties.F1Tri80_18 === 0){
        minT1_80m2018Freg = feature.properties.F1Tri80_18
    }
    if(feature.properties.F1Tri80_18 > maxT1_80m2018Freg ){
        maxT1_80m2018Freg = feature.properties.F1Tri80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F1Tri80_18)
    };
}
function apagarT1_80m2018Freg(e){
    var layer = e.target;
    T1_80m2018Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT1_80m2018Freg(feature, layer) {
    if (feature.properties.F1_80_18MES == null && feature.properties.F1Tri80_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri80_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_80_18MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT1_80m2018Freg,
    })
};

var T1_80m2018Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT1_80m2018Freg,
    onEachFeature: onEachFeatureT1_80m2018Freg,
});

var slideT1_80m2018Freg = function(){
    var sliderT1_80m2018Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 49){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT1_80m2018Freg, {
        start: [minT1_80m2018Freg, maxT1_80m2018Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_80m2018Freg,
            'max': maxT1_80m2018Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT1_80m2018Freg);
    inputNumberMax.setAttribute("value",maxT1_80m2018Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_80m2018Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_80m2018Freg.noUiSlider.set([null, this.value]);
    });

    sliderT1_80m2018Freg.noUiSlider.on('update',function(e){
        T1_80m2018Freg.eachLayer(function(layer){
            if (layer.feature.properties.F1Tri80_18 == null){
                return false
            }
            if(layer.feature.properties.F1Tri80_18.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F1Tri80_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT1_80m2018Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 49;
    sliderAtivo = sliderT1_80m2018Freg.noUiSlider;
    $(slidersGeral).append(sliderT1_80m2018Freg);
}
///////////////////////////-------------------- Fim 1º Trimestre 80m2 2018-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 1º Trimestre 100m2 2018-----////

var minT1_100m2018Freg = 100;
var maxT1_100m2018Freg = 0;

function estiloT1_100m2018Freg(feature) {
    if(feature.properties.F1Tri100_18 <= minT1_100m2018Freg && feature.properties.F1Tri100_18 > null || feature.properties.F1Tri100_18 === 0){
        minT1_100m2018Freg = feature.properties.F1Tri100_18
    }
    if(feature.properties.F1Tri100_18 > maxT1_100m2018Freg ){
        maxT1_100m2018Freg = feature.properties.F1Tri100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F1Tri100_18)
    };
}
function apagarT1_100m2018Freg(e){
    var layer = e.target;
    T1_100m2018Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT1_100m2018Freg(feature, layer) {
    if (feature.properties.F1_100_18ME == null && feature.properties.F1Tri100_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri100_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_100_18ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT1_100m2018Freg,
    })
};

var T1_100m2018Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT1_100m2018Freg,
    onEachFeature: onEachFeatureT1_100m2018Freg,
});

var slideT1_100m2018Freg = function(){
    var sliderT1_100m2018Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 50){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT1_100m2018Freg, {
        start: [minT1_100m2018Freg, maxT1_100m2018Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_100m2018Freg,
            'max': maxT1_100m2018Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT1_100m2018Freg);
    inputNumberMax.setAttribute("value",maxT1_100m2018Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_100m2018Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_100m2018Freg.noUiSlider.set([null, this.value]);
    });

    sliderT1_100m2018Freg.noUiSlider.on('update',function(e){
        T1_100m2018Freg.eachLayer(function(layer){
            if (layer.feature.properties.F1Tri100_18 == null){
                return false
            }
            if(layer.feature.properties.F1Tri100_18.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F1Tri100_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT1_100m2018Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 50;
    sliderAtivo = sliderT1_100m2018Freg.noUiSlider;
    $(slidersGeral).append(sliderT1_100m2018Freg);
}
///////////////////////////-------------------- Fim 1º Trimestre 100m2 2018-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////////////------- 2º Trimestre 80m2 2018-----////

var minT2_80m2018Freg = 100;
var maxT2_80m2018Freg = 0;

function estiloT2_80m2018Freg(feature) {
    if(feature.properties.F2Tri80_18 <= minT2_80m2018Freg && feature.properties.F2Tri80_18 > null || feature.properties.F2Tri80_18 === 0){
        minT2_80m2018Freg = feature.properties.F2Tri80_18
    }
    if(feature.properties.F2Tri80_18 > maxT2_80m2018Freg ){
        maxT2_80m2018Freg = feature.properties.F2Tri80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F2Tri80_18)
    };
}
function apagarT2_80m2018Freg(e){
    var layer = e.target;
    T2_80m2018Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT2_80m2018Freg(feature, layer) {
    if (feature.properties.F2_80_18MES == null && feature.properties.F2Tri80_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri80_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_80_18MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT2_80m2018Freg,
    })
};

var T2_80m2018Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT2_80m2018Freg,
    onEachFeature: onEachFeatureT2_80m2018Freg,
});

var slideT2_80m2018Freg = function(){
    var sliderT2_80m2018Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 51){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT2_80m2018Freg, {
        start: [minT2_80m2018Freg, maxT2_80m2018Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_80m2018Freg,
            'max': maxT2_80m2018Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT2_80m2018Freg);
    inputNumberMax.setAttribute("value",maxT2_80m2018Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_80m2018Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_80m2018Freg.noUiSlider.set([null, this.value]);
    });

    sliderT2_80m2018Freg.noUiSlider.on('update',function(e){
        T2_80m2018Freg.eachLayer(function(layer){
            if (layer.feature.properties.F2Tri80_18 == null){
                return false
            }
            if(layer.feature.properties.F2Tri80_18.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F2Tri80_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT2_80m2018Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 51;
    sliderAtivo = sliderT2_80m2018Freg.noUiSlider;
    $(slidersGeral).append(sliderT2_80m2018Freg);
}
///////////////////////////-------------------- Fim 2º Trimestre 80m2 2018-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 2º Trimestre 100m2 2018-----////

var minT2_100m2018Freg = 100;
var maxT2_100m2018Freg = 0;

function estiloT2_100m2018Freg(feature) {
    if(feature.properties.F2Tri100_18 <= minT2_100m2018Freg && feature.properties.F2Tri100_18 > null || feature.properties.F2Tri100_18 === 0){
        minT2_100m2018Freg = feature.properties.F2Tri100_18
    }
    if(feature.properties.F2Tri100_18 > maxT2_100m2018Freg ){
        maxT2_100m2018Freg = feature.properties.F2Tri100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F2Tri100_18)
    };
}
function apagarT2_100m2018Freg(e){
    var layer = e.target;
    T2_100m2018Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT2_100m2018Freg(feature, layer) {
    if (feature.properties.F2_100_18ME == null && feature.properties.F2Tri100_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri100_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_100_18ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT2_100m2018Freg,
    })
};

var T2_100m2018Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT2_100m2018Freg,
    onEachFeature: onEachFeatureT2_100m2018Freg,
});

var slideT2_100m2018Freg = function(){
    var sliderT2_100m2018Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 52){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT2_100m2018Freg, {
        start: [minT2_100m2018Freg, maxT2_100m2018Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_100m2018Freg,
            'max': maxT2_100m2018Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT2_100m2018Freg);
    inputNumberMax.setAttribute("value",maxT2_100m2018Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_100m2018Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_100m2018Freg.noUiSlider.set([null, this.value]);
    });

    sliderT2_100m2018Freg.noUiSlider.on('update',function(e){
        T2_100m2018Freg.eachLayer(function(layer){
            if (layer.feature.properties.F2Tri100_18 == null){
                return false
            }
            if(layer.feature.properties.F2Tri100_18.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F2Tri100_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT2_100m2018Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 52;
    sliderAtivo = sliderT2_100m2018Freg.noUiSlider;
    $(slidersGeral).append(sliderT2_100m2018Freg);
}
///////////////////////////-------------------- Fim 2º Trimestre 100m2 2018-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////////////------- 3º Trimestre 80m2 2018-----////

var minT3_80m2018Freg = 100;
var maxT3_80m2018Freg = 0;

function estiloT3_80m2018Freg(feature) {
    if(feature.properties.F3Tri80_18 <= minT3_80m2018Freg && feature.properties.F3Tri80_18 > null || feature.properties.F3Tri80_18 === 0){
        minT3_80m2018Freg = feature.properties.F3Tri80_18
    }
    if(feature.properties.F3Tri80_18 > maxT3_80m2018Freg ){
        maxT3_80m2018Freg = feature.properties.F3Tri80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F3Tri80_18)
    };
}
function apagarT3_80m2018Freg(e){
    var layer = e.target;
    T3_80m2018Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT3_80m2018Freg(feature, layer) {
    if (feature.properties.F3_80_18MES == null && feature.properties.F3Tri80_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri80_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_80_18MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT3_80m2018Freg,
    })
};

var T3_80m2018Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT3_80m2018Freg,
    onEachFeature: onEachFeatureT3_80m2018Freg,
});

var slideT3_80m2018Freg = function(){
    var sliderT3_80m2018Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 53){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT3_80m2018Freg, {
        start: [minT3_80m2018Freg, maxT3_80m2018Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_80m2018Freg,
            'max': maxT3_80m2018Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT3_80m2018Freg);
    inputNumberMax.setAttribute("value",maxT3_80m2018Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_80m2018Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_80m2018Freg.noUiSlider.set([null, this.value]);
    });

    sliderT3_80m2018Freg.noUiSlider.on('update',function(e){
        T3_80m2018Freg.eachLayer(function(layer){
            if (layer.feature.properties.F3Tri80_18 == null){
                return false
            }
            if(layer.feature.properties.F3Tri80_18.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F3Tri80_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT3_80m2018Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 53;
    sliderAtivo = sliderT3_80m2018Freg.noUiSlider;
    $(slidersGeral).append(sliderT3_80m2018Freg);
}
///////////////////////////-------------------- Fim 3º Trimestre 80m2 2018-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 3º Trimestre 100m2 2018-----////

var minT3_100m2018Freg = 100;
var maxT3_100m2018Freg = 0;

function estiloT3_100m2018Freg(feature) {
    if(feature.properties.F3Tri100_18 <= minT3_100m2018Freg && feature.properties.F3Tri100_18 > null || feature.properties.F3Tri100_18 === 0){
        minT3_100m2018Freg = feature.properties.F3Tri100_18
    }
    if(feature.properties.F3Tri100_18 > maxT3_100m2018Freg ){
        maxT3_100m2018Freg = feature.properties.F3Tri100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F3Tri100_18)
    };
}
function apagarT3_100m2018Freg(e){
    var layer = e.target;
    T3_100m2018Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT3_100m2018Freg(feature, layer) {
    if (feature.properties.F3_100_18ME == null && feature.properties.F3Tri100_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri100_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_100_18ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT3_100m2018Freg,
    })
};

var T3_100m2018Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT3_100m2018Freg,
    onEachFeature: onEachFeatureT3_100m2018Freg,
});

var slideT3_100m2018Freg = function(){
    var sliderT3_100m2018Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 54){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT3_100m2018Freg, {
        start: [minT3_100m2018Freg, maxT3_100m2018Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_100m2018Freg,
            'max': maxT3_100m2018Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT3_100m2018Freg);
    inputNumberMax.setAttribute("value",maxT3_100m2018Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_100m2018Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_100m2018Freg.noUiSlider.set([null, this.value]);
    });

    sliderT3_100m2018Freg.noUiSlider.on('update',function(e){
        T3_100m2018Freg.eachLayer(function(layer){
            if (layer.feature.properties.F3Tri100_18 == null){
                return false
            }
            if(layer.feature.properties.F3Tri100_18.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F3Tri100_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT3_100m2018Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 54;
    sliderAtivo = sliderT3_100m2018Freg.noUiSlider;
    $(slidersGeral).append(sliderT3_100m2018Freg);
}
///////////////////////////-------------------- Fim 3º Trimestre 100m2 2018-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////////////------- 4º Trimestre 80m2 2018-----////

var minT4_80m2018Freg = 100;
var maxT4_80m2018Freg = 0;

function estiloT4_80m2018Freg(feature) {
    if(feature.properties.F4Tri80_18 <= minT4_80m2018Freg && feature.properties.F4Tri80_18 > null || feature.properties.F4Tri80_18 === 0){
        minT4_80m2018Freg = feature.properties.F4Tri80_18
    }
    if(feature.properties.F4Tri80_18 > maxT4_80m2018Freg ){
        maxT4_80m2018Freg = feature.properties.F4Tri80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F4Tri80_18)
    };
}
function apagarT4_80m2018Freg(e){
    var layer = e.target;
    T4_80m2018Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT4_80m2018Freg(feature, layer) {
    if (feature.properties.F4_80_18MES == null && feature.properties.F4Tri80_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri80_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_80_18MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT4_80m2018Freg,
    })
};

var T4_80m2018Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT4_80m2018Freg,
    onEachFeature: onEachFeatureT4_80m2018Freg,
});

var slideT4_80m2018Freg = function(){
    var sliderT4_80m2018Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 55){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT4_80m2018Freg, {
        start: [minT4_80m2018Freg, maxT4_80m2018Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_80m2018Freg,
            'max': maxT4_80m2018Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT4_80m2018Freg);
    inputNumberMax.setAttribute("value",maxT4_80m2018Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_80m2018Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_80m2018Freg.noUiSlider.set([null, this.value]);
    });

    sliderT4_80m2018Freg.noUiSlider.on('update',function(e){
        T4_80m2018Freg.eachLayer(function(layer){
            if (layer.feature.properties.F4Tri80_18 == null){
                return false
            }
            if(layer.feature.properties.F4Tri80_18.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F4Tri80_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT4_80m2018Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 55;
    sliderAtivo = sliderT4_80m2018Freg.noUiSlider;
    $(slidersGeral).append(sliderT4_80m2018Freg);
}
///////////////////////////-------------------- Fim 4º Trimestre 80m2 2018-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 4º Trimestre 100m2 2018-----////

var minT4_100m2018Freg = 100;
var maxT4_100m2018Freg = 0;

function estiloT4_100m2018Freg(feature) {
    if(feature.properties.F4Tri100_18 <= minT4_100m2018Freg && feature.properties.F4Tri100_18 > null || feature.properties.F4Tri100_18 === 0){
        minT4_100m2018Freg = feature.properties.F4Tri100_18
    }
    if(feature.properties.F4Tri100_18 > maxT4_100m2018Freg ){
        maxT4_100m2018Freg = feature.properties.F4Tri100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F4Tri100_18)
    };
}
function apagarT4_100m2018Freg(e){
    var layer = e.target;
    T4_100m2018Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT4_100m2018Freg(feature, layer) {
    if (feature.properties.F4_100_18ME == null && feature.properties.F4Tri100_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri100_18-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_100_18ME + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT4_100m2018Freg,
    })
};

var T4_100m2018Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT4_100m2018Freg,
    onEachFeature: onEachFeatureT4_100m2018Freg,
});

var slideT4_100m2018Freg = function(){
    var sliderT4_100m2018Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 56){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT4_100m2018Freg, {
        start: [minT4_100m2018Freg, maxT4_100m2018Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_100m2018Freg,
            'max': maxT4_100m2018Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT4_100m2018Freg);
    inputNumberMax.setAttribute("value",maxT4_100m2018Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_100m2018Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_100m2018Freg.noUiSlider.set([null, this.value]);
    });

    sliderT4_100m2018Freg.noUiSlider.on('update',function(e){
        T4_100m2018Freg.eachLayer(function(layer){
            if (layer.feature.properties.F4Tri100_18 == null){
                return false
            }
            if(layer.feature.properties.F4Tri100_18.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F4Tri100_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT4_100m2018Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 56;
    sliderAtivo = sliderT4_100m2018Freg.noUiSlider;
    $(slidersGeral).append(sliderT4_100m2018Freg);
}
///////////////////////////-------------------- Fim 4º Trimestre 100m2 2018-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\



/////////////////////////---------------------------- 1º Trimestre 80m2 2019-----////

var minT1_80m2019Freg = 100;
var maxT1_80m2019Freg = 0;

function estiloT1_80m2019Freg(feature) {
    if(feature.properties.F1Tri80_19 <= minT1_80m2019Freg && feature.properties.F1Tri80_19 > null || feature.properties.F1Tri80_19 === 0){
        minT1_80m2019Freg = feature.properties.F1Tri80_19
    }
    if(feature.properties.F1Tri80_19 > maxT1_80m2019Freg ){
        maxT1_80m2019Freg = feature.properties.F1Tri80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F1Tri80_19)
    };
}
function apagarT1_80m2019Freg(e){
    var layer = e.target;
    T1_80m2019Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT1_80m2019Freg(feature, layer) {
    if (feature.properties.F1_80_19MES == null && feature.properties.F1Tri80_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri80_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_80_19MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT1_80m2019Freg,
    })
};

var T1_80m2019Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT1_80m2019Freg,
    onEachFeature: onEachFeatureT1_80m2019Freg,
});

var slideT1_80m2019Freg = function(){
    var sliderT1_80m2019Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 57){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT1_80m2019Freg, {
        start: [minT1_80m2019Freg, maxT1_80m2019Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_80m2019Freg,
            'max': maxT1_80m2019Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT1_80m2019Freg);
    inputNumberMax.setAttribute("value",maxT1_80m2019Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_80m2019Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_80m2019Freg.noUiSlider.set([null, this.value]);
    });

    sliderT1_80m2019Freg.noUiSlider.on('update',function(e){
        T1_80m2019Freg.eachLayer(function(layer){
            if (layer.feature.properties.F1Tri80_19 == null){
                return false
            }
            if(layer.feature.properties.F1Tri80_19.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F1Tri80_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT1_80m2019Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 57;
    sliderAtivo = sliderT1_80m2019Freg.noUiSlider;
    $(slidersGeral).append(sliderT1_80m2019Freg);
}
///////////////////////////-------------------- Fim 1º Trimestre 80m2 2019-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 1º Trimestre 100m2 2019-----////

var minT1_100m2019Freg = 100;
var maxT1_100m2019Freg = 0;

function estiloT1_100m2019Freg(feature) {
    if(feature.properties.F1Tri100_19 <= minT1_100m2019Freg && feature.properties.F1Tri100_19 > null || feature.properties.F1Tri100_19 === 0){
        minT1_100m2019Freg = feature.properties.F1Tri100_19
    }
    if(feature.properties.F1Tri100_19 > maxT1_100m2019Freg ){
        maxT1_100m2019Freg = feature.properties.F1Tri100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F1Tri100_19)
    };
}
function apagarT1_100m2019Freg(e){
    var layer = e.target;
    T1_100m2019Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT1_100m2019Freg(feature, layer) {
    if (feature.properties.F1_100_19MES == null && feature.properties.F1Tri100_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F1Tri100_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F1_100_19MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT1_100m2019Freg,
    })
};

var T1_100m2019Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT1_100m2019Freg,
    onEachFeature: onEachFeatureT1_100m2019Freg,
});

var slideT1_100m2019Freg = function(){
    var sliderT1_100m2019Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 58){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT1_100m2019Freg, {
        start: [minT1_100m2019Freg, maxT1_100m2019Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT1_100m2019Freg,
            'max': maxT1_100m2019Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT1_100m2019Freg);
    inputNumberMax.setAttribute("value",maxT1_100m2019Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT1_100m2019Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT1_100m2019Freg.noUiSlider.set([null, this.value]);
    });

    sliderT1_100m2019Freg.noUiSlider.on('update',function(e){
        T1_100m2019Freg.eachLayer(function(layer){
            if (layer.feature.properties.F1Tri100_19 == null){
                return false
            }
            if(layer.feature.properties.F1Tri100_19.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F1Tri100_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT1_100m2019Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 58;
    sliderAtivo = sliderT1_100m2019Freg.noUiSlider;
    $(slidersGeral).append(sliderT1_100m2019Freg);
}
///////////////////////////-------------------- Fim 1º Trimestre 100m2 2019-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////////////------- 2º Trimestre 80m2 2019-----////

var minT2_80m2019Freg = 100;
var maxT2_80m2019Freg = 0;

function estiloT2_80m2019Freg(feature) {
    if(feature.properties.F2Tri80_19 <= minT2_80m2019Freg && feature.properties.F2Tri80_19 > null || feature.properties.F2Tri80_19 === 0){
        minT2_80m2019Freg = feature.properties.F2Tri80_19
    }
    if(feature.properties.F2Tri80_19 > maxT2_80m2019Freg ){
        maxT2_80m2019Freg = feature.properties.F2Tri80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F2Tri80_19)
    };
}
function apagarT2_80m2019Freg(e){
    var layer = e.target;
    T2_80m2019Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT2_80m2019Freg(feature, layer) {
    if (feature.properties.F2_80_19MES == null && feature.properties.F2Tri80_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri80_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_80_19MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT2_80m2019Freg,
    })
};

var T2_80m2019Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT2_80m2019Freg,
    onEachFeature: onEachFeatureT2_80m2019Freg,
});

var slideT2_80m2019Freg = function(){
    var sliderT2_80m2019Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 59){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT2_80m2019Freg, {
        start: [minT2_80m2019Freg, maxT2_80m2019Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_80m2019Freg,
            'max': maxT2_80m2019Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT2_80m2019Freg);
    inputNumberMax.setAttribute("value",maxT2_80m2019Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_80m2019Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_80m2019Freg.noUiSlider.set([null, this.value]);
    });

    sliderT2_80m2019Freg.noUiSlider.on('update',function(e){
        T2_80m2019Freg.eachLayer(function(layer){
            if (layer.feature.properties.F2Tri80_19 == null){
                return false
            }
            if(layer.feature.properties.F2Tri80_19.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F2Tri80_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT2_80m2019Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 59;
    sliderAtivo = sliderT2_80m2019Freg.noUiSlider;
    $(slidersGeral).append(sliderT2_80m2019Freg);
}
///////////////////////////-------------------- Fim 2º Trimestre 80m2 2019-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 2º Trimestre 100m2 2019-----////

var minT2_100m2019Freg = 100;
var maxT2_100m2019Freg = 0;

function estiloT2_100m2019Freg(feature) {
    if(feature.properties.F2Tri100_19 <= minT2_100m2019Freg && feature.properties.F2Tri100_19 > null || feature.properties.F2Tri100_19 === 0){
        minT2_100m2019Freg = feature.properties.F2Tri100_19
    }
    if(feature.properties.F2Tri100_19 > maxT2_100m2019Freg ){
        maxT2_100m2019Freg = feature.properties.F2Tri100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F2Tri100_19)
    };
}
function apagarT2_100m2019Freg(e){
    var layer = e.target;
    T2_100m2019Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT2_100m2019Freg(feature, layer) {
    if (feature.properties.F2_100_19MES == null && feature.properties.F2Tri100_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F2Tri100_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F2_100_19MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT2_100m2019Freg,
    })
};

var T2_100m2019Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT2_100m2019Freg,
    onEachFeature: onEachFeatureT2_100m2019Freg,
});

var slideT2_100m2019Freg = function(){
    var sliderT2_100m2019Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 60){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT2_100m2019Freg, {
        start: [minT2_100m2019Freg, maxT2_100m2019Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT2_100m2019Freg,
            'max': maxT2_100m2019Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT2_100m2019Freg);
    inputNumberMax.setAttribute("value",maxT2_100m2019Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT2_100m2019Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT2_100m2019Freg.noUiSlider.set([null, this.value]);
    });

    sliderT2_100m2019Freg.noUiSlider.on('update',function(e){
        T2_100m2019Freg.eachLayer(function(layer){
            if (layer.feature.properties.F2Tri100_19 == null){
                return false
            }
            if(layer.feature.properties.F2Tri100_19.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F2Tri100_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT2_100m2019Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 60;
    sliderAtivo = sliderT2_100m2019Freg.noUiSlider;
    $(slidersGeral).append(sliderT2_100m2019Freg);
}
///////////////////////////-------------------- Fim 2º Trimestre 100m2 2019-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////////////------- 3º Trimestre 80m2 2019-----////

var minT3_80m2019Freg = 100;
var maxT3_80m2019Freg = 0;

function estiloT3_80m2019Freg(feature) {
    if(feature.properties.F3Tri80_19 <= minT3_80m2019Freg && feature.properties.F3Tri80_19 > null || feature.properties.F3Tri80_19 === 0){
        minT3_80m2019Freg = feature.properties.F3Tri80_19
    }
    if(feature.properties.F3Tri80_19 > maxT3_80m2019Freg ){
        maxT3_80m2019Freg = feature.properties.F3Tri80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F3Tri80_19)
    };
}
function apagarT3_80m2019Freg(e){
    var layer = e.target;
    T3_80m2019Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT3_80m2019Freg(feature, layer) {
    if (feature.properties.F3_80_19MES == null && feature.properties.F3Tri80_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri80_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_80_19MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT3_80m2019Freg,
    })
};

var T3_80m2019Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT3_80m2019Freg,
    onEachFeature: onEachFeatureT3_80m2019Freg,
});

var slideT3_80m2019Freg = function(){
    var sliderT3_80m2019Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 61){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT3_80m2019Freg, {
        start: [minT3_80m2019Freg, maxT3_80m2019Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_80m2019Freg,
            'max': maxT3_80m2019Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT3_80m2019Freg);
    inputNumberMax.setAttribute("value",maxT3_80m2019Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_80m2019Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_80m2019Freg.noUiSlider.set([null, this.value]);
    });

    sliderT3_80m2019Freg.noUiSlider.on('update',function(e){
        T3_80m2019Freg.eachLayer(function(layer){
            if (layer.feature.properties.F3Tri80_19 == null){
                return false
            }
            if(layer.feature.properties.F3Tri80_19.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F3Tri80_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT3_80m2019Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 61;
    sliderAtivo = sliderT3_80m2019Freg.noUiSlider;
    $(slidersGeral).append(sliderT3_80m2019Freg);
}
///////////////////////////-------------------- Fim 3º Trimestre 80m2 2019-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 3º Trimestre 100m2 2019-----////

var minT3_100m2019Freg = 100;
var maxT3_100m2019Freg = 0;

function estiloT3_100m2019Freg(feature) {
    if(feature.properties.F3Tri100_19 <= minT3_100m2019Freg && feature.properties.F3Tri100_19 > null || feature.properties.F3Tri100_19 === 0){
        minT3_100m2019Freg = feature.properties.F3Tri100_19
    }
    if(feature.properties.F3Tri100_19 > maxT3_100m2019Freg ){
        maxT3_100m2019Freg = feature.properties.F3Tri100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F3Tri100_19)
    };
}
function apagarT3_100m2019Freg(e){
    var layer = e.target;
    T3_100m2019Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT3_100m2019Freg(feature, layer) {
    if (feature.properties.F3_100_19MES == null && feature.properties.F3Tri100_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F3Tri100_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F3_100_19MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT3_100m2019Freg,
    })
};

var T3_100m2019Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT3_100m2019Freg,
    onEachFeature: onEachFeatureT3_100m2019Freg,
});

var slideT3_100m2019Freg = function(){
    var sliderT3_100m2019Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 62){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT3_100m2019Freg, {
        start: [minT3_100m2019Freg, maxT3_100m2019Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT3_100m2019Freg,
            'max': maxT3_100m2019Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT3_100m2019Freg);
    inputNumberMax.setAttribute("value",maxT3_100m2019Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT3_100m2019Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT3_100m2019Freg.noUiSlider.set([null, this.value]);
    });

    sliderT3_100m2019Freg.noUiSlider.on('update',function(e){
        T3_100m2019Freg.eachLayer(function(layer){
            if (layer.feature.properties.F3Tri100_19 == null){
                return false
            }
            if(layer.feature.properties.F3Tri100_19.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F3Tri100_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT3_100m2019Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 62;
    sliderAtivo = sliderT3_100m2019Freg.noUiSlider;
    $(slidersGeral).append(sliderT3_100m2019Freg);
}
///////////////////////////-------------------- Fim 3º Trimestre 100m2 2019-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////////////------- 4º Trimestre 80m2 2019-----////

var minT4_80m2019Freg = 100;
var maxT4_80m2019Freg = 0;

function estiloT4_80m2019Freg(feature) {
    if(feature.properties.F4Tri80_19 <= minT4_80m2019Freg && feature.properties.F4Tri80_19 > null || feature.properties.F4Tri80_19 === 0){
        minT4_80m2019Freg = feature.properties.F4Tri80_19
    }
    if(feature.properties.F4Tri80_19 > maxT4_80m2019Freg ){
        maxT4_80m2019Freg = feature.properties.F4Tri80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.F4Tri80_19)
    };
}
function apagarT4_80m2019Freg(e){
    var layer = e.target;
    T4_80m2019Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT4_80m2019Freg(feature, layer) {
    if (feature.properties.F4_80_19MES == null && feature.properties.F4Tri80_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri80_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_80_19MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT4_80m2019Freg,
    })
};

var T4_80m2019Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT4_80m2019Freg,
    onEachFeature: onEachFeatureT4_80m2019Freg,
});

var slideT4_80m2019Freg = function(){
    var sliderT4_80m2019Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 63){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT4_80m2019Freg, {
        start: [minT4_80m2019Freg, maxT4_80m2019Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_80m2019Freg,
            'max': maxT4_80m2019Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT4_80m2019Freg);
    inputNumberMax.setAttribute("value",maxT4_80m2019Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_80m2019Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_80m2019Freg.noUiSlider.set([null, this.value]);
    });

    sliderT4_80m2019Freg.noUiSlider.on('update',function(e){
        T4_80m2019Freg.eachLayer(function(layer){
            if (layer.feature.properties.F4Tri80_19 == null){
                return false
            }
            if(layer.feature.properties.F4Tri80_19.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F4Tri80_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT4_80m2019Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 63;
    sliderAtivo = sliderT4_80m2019Freg.noUiSlider;
    $(slidersGeral).append(sliderT4_80m2019Freg);
}
///////////////////////////-------------------- Fim 4º Trimestre 80m2 2019-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


/////////////////////////----------------------------- 4º Trimestre 100m2 2019-----////

var minT4_100m2019Freg = 100;
var maxT4_100m2019Freg = 0;

function estiloT4_100m2019Freg(feature) {
    if(feature.properties.F4Tri100_19 <= minT4_100m2019Freg && feature.properties.F4Tri100_19 > null || feature.properties.F4Tri100_19 === 0){
        minT4_100m2019Freg = feature.properties.F4Tri100_19
    }
    if(feature.properties.F4Tri100_19 > maxT4_100m2019Freg ){
        maxT4_100m2019Freg = feature.properties.F4Tri100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.F4Tri100_19)
    };
}
function apagarT4_100m2019Freg(e){
    var layer = e.target;
    T4_100m2019Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureT4_100m2019Freg(feature, layer) {
    if (feature.properties.F4_100_19MES == null && feature.properties.F4Tri100_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + 'Cálculo não aplicável'  + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Anos: ' + '<b>' + (feature.properties.F4Tri100_19-0.5).toFixed(0)  + '</b>' + ' anos e ' + '<b>' + feature.properties.F4_100_19MES + '</b>' +' meses.').openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarT4_100m2019Freg,
    })
};

var T4_100m2019Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloT4_100m2019Freg,
    onEachFeature: onEachFeatureT4_100m2019Freg,
});

var slideT4_100m2019Freg = function(){
    var sliderT4_100m2019Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 64){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderT4_100m2019Freg, {
        start: [minT4_100m2019Freg, maxT4_100m2019Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minT4_100m2019Freg,
            'max': maxT4_100m2019Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minT4_100m2019Freg);
    inputNumberMax.setAttribute("value",maxT4_100m2019Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderT4_100m2019Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderT4_100m2019Freg.noUiSlider.set([null, this.value]);
    });

    sliderT4_100m2019Freg.noUiSlider.on('update',function(e){
        T4_100m2019Freg.eachLayer(function(layer){
            if (layer.feature.properties.F4Tri100_19 == null){
                return false
            }
            if(layer.feature.properties.F4Tri100_19.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.F4Tri100_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderT4_100m2019Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 64;
    sliderAtivo = sliderT4_100m2019Freg.noUiSlider;
    $(slidersGeral).append(sliderT4_100m2019Freg);
}
///////////////////////////-------------------- Fim 4º Trimestre 100m2 2019-, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\





/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = T1_80m2016Conc;
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
    if (layer == T1_80m2016Conc && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 1º trimestre de 2016, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT1_80m2016Conc();
        naoDuplicar = 1;
    }
    if (layer == T1_80m2016Conc && naoDuplicar == 1){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 1º trimestre de 2016, por concelho.' + '</strong>');
    }
    if (layer == T1_100m2016Conc && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 1º trimestre de 2016, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT1_100m2016Conc();
        naoDuplicar = 2;
    }
    if (layer == T2_80m2016Conc && naoDuplicar != 3){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 2º trimestre de 2016, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT2_80m2016Conc();
        naoDuplicar = 3;
    }
    if (layer == T2_100m2016Conc && naoDuplicar != 4){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 2º trimestre de 2016, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT2_100m2016Conc();
        naoDuplicar = 4;
    }
    if (layer == T3_80m2016Conc && naoDuplicar != 5){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 3º trimestre de 2016, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT3_80m2016Conc();
        naoDuplicar = 5;
    }
    if (layer == T3_100m2016Conc && naoDuplicar != 6){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 3º trimestre de 2016, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT3_100m2016Conc();
        naoDuplicar = 6;
    }
    if (layer == T4_80m2016Conc && naoDuplicar != 7){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 4º trimestre de 2016, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT4_80m2016Conc();
        naoDuplicar = 7;
    }
    if (layer == T4_100m2016Conc && naoDuplicar != 8){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 4º trimestre de 2016, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT4_100m2016Conc();
        naoDuplicar = 8;
    }
    if (layer == T1_80m2017Conc && naoDuplicar != 9){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 1º trimestre de 2017, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT1_80m2017Conc();
        naoDuplicar = 9;
    }
    if (layer == T1_100m2017Conc && naoDuplicar != 10){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 1º trimestre de 2017, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT1_100m2017Conc();
        naoDuplicar = 10;
    }
    if (layer == T2_80m2017Conc && naoDuplicar != 11){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 2º trimestre de 2017, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT2_80m2017Conc();
        naoDuplicar = 11;
    }
    if (layer == T2_100m2017Conc && naoDuplicar != 12){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 2º trimestre de 2017, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT2_100m2017Conc();
        naoDuplicar = 12;
    }
    if (layer == T3_80m2017Conc && naoDuplicar != 13){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 3º trimestre de 2017, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT3_80m2017Conc();
        naoDuplicar = 13;
    }
    if (layer == T3_100m2017Conc && naoDuplicar != 14){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 3º trimestre de 2017, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT3_100m2017Conc();
        naoDuplicar = 14;
    }
    if (layer == T4_80m2017Conc && naoDuplicar != 15){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 4º trimestre de 2017, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT4_80m2017Conc();
        naoDuplicar = 15;
    }
    if (layer == T4_100m2017Conc && naoDuplicar != 16){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 4º trimestre de 2017, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT4_100m2017Conc();
        naoDuplicar = 16;
    }
    if (layer == T1_80m2018Conc && naoDuplicar != 17){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 1º trimestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT1_80m2018Conc();
        naoDuplicar = 17;
    }
    if (layer == T1_100m2018Conc && naoDuplicar != 18){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 1º trimestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT1_100m2018Conc();
        naoDuplicar = 18;
    }
    if (layer == T2_80m2018Conc && naoDuplicar != 19){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 2º trimestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT2_80m2018Conc();
        naoDuplicar = 19;
    }
    if (layer == T2_100m2018Conc && naoDuplicar != 20){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 2º trimestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT2_100m2018Conc();
        naoDuplicar = 20;
    }
    if (layer == T3_80m2018Conc && naoDuplicar != 21){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 3º trimestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT3_80m2018Conc();
        naoDuplicar = 21;
    }
    if (layer == T3_100m2018Conc && naoDuplicar != 22){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 3º trimestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT3_100m2018Conc();
        naoDuplicar = 22;
    }
    if (layer == T4_80m2018Conc && naoDuplicar != 23){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 4º trimestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT4_80m2018Conc();
        naoDuplicar = 23;
    }
    if (layer == T4_100m2018Conc && naoDuplicar != 24){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 4º trimestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT4_100m2018Conc();
        naoDuplicar = 24;
    }
    if (layer == T1_80m2019Conc && naoDuplicar != 25){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 1º trimestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT1_80m2019Conc();
        naoDuplicar = 25;
    }
    if (layer == T1_100m2019Conc && naoDuplicar != 26){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 1º trimestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT1_100m2019Conc();
        naoDuplicar = 26;
    }
    if (layer == T2_80m2019Conc && naoDuplicar != 27){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 2º trimestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT2_80m2019Conc();
        naoDuplicar = 27;
    }
    if (layer == T2_100m2019Conc && naoDuplicar != 28){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 2º trimestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT2_100m2019Conc();
        naoDuplicar = 28;
    }
    if (layer == T3_80m2019Conc && naoDuplicar != 29){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 3º trimestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT3_80m2019Conc();
        naoDuplicar = 29;
    }
    if (layer == T3_100m2019Conc && naoDuplicar != 30){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 3º trimestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT3_100m2019Conc();
        naoDuplicar = 30;
    }
    if (layer == T4_80m2019Conc && naoDuplicar != 31){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 4º trimestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slideT4_80m2019Conc();
        naoDuplicar = 31;
    }
    if (layer == T4_100m2019Conc && naoDuplicar != 32){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 4º trimestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slideT4_100m2019Conc();
        naoDuplicar = 32;
    }
    if (layer == T1_80m2016Freg && naoDuplicar != 33){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 1º trimestre de 2016, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT1_80m2016Freg();
        naoDuplicar = 33;
    }
    if (layer == T1_100m2016Freg && naoDuplicar != 34){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 1º trimestre de 2016, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT1_100m2016Freg();
        naoDuplicar = 34;
    }
    if (layer == T2_80m2016Freg && naoDuplicar != 35){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 2º trimestre de 2016, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT2_80m2016Freg();
        naoDuplicar = 35;
    }
    if (layer == T2_100m2016Freg && naoDuplicar != 36){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 2º trimestre de 2016, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT2_100m2016Freg();
        naoDuplicar = 36;
    }
    if (layer == T3_80m2016Freg && naoDuplicar != 37){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 3º trimestre de 2016, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT3_80m2016Freg();
        naoDuplicar = 37;
    }
    if (layer == T3_100m2016Freg && naoDuplicar != 38){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 3º trimestre de 2016, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT3_100m2016Freg();
        naoDuplicar = 38;
    }
    if (layer == T4_80m2016Freg && naoDuplicar != 39){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 4º trimestre de 2016, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT4_80m2016Freg();
        naoDuplicar = 39;
    }
    if (layer == T4_100m2016Freg && naoDuplicar != 40){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 4º trimestre de 2016, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT4_100m2016Freg();
        naoDuplicar = 40;
    }
    if (layer == T1_80m2017Freg && naoDuplicar != 41){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 1º trimestre de 2017, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT1_80m2017Freg();
        naoDuplicar = 41;
    }
    if (layer == T1_100m2017Freg && naoDuplicar != 42){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 1º trimestre de 2017, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT1_100m2017Freg();
        naoDuplicar = 42;
    }
    if (layer == T2_80m2017Freg && naoDuplicar != 43){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 2º trimestre de 2017, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT2_80m2017Freg();
        naoDuplicar = 43;
    }
    if (layer == T2_100m2017Freg && naoDuplicar != 44){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 2º trimestre de 2017, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT2_100m2017Freg();
        naoDuplicar = 44;
    }
    if (layer == T3_80m2017Freg && naoDuplicar != 45){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 3º trimestre de 2017, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT3_80m2017Freg();
        naoDuplicar = 45;
    }
    if (layer == T3_100m2017Freg && naoDuplicar != 46){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 3º trimestre de 2017, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT3_100m2017Freg();
        naoDuplicar = 46;
    }
    if (layer == T4_80m2017Freg && naoDuplicar != 47){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 4º trimestre de 2017, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT4_80m2017Freg();
        naoDuplicar = 47;
    }
    if (layer == T4_100m2017Freg && naoDuplicar != 48){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 4º trimestre de 2017, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT4_100m2017Freg();
        naoDuplicar = 48;
    }
    if (layer == T1_80m2018Freg && naoDuplicar != 49){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 1º trimestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT1_80m2018Freg();
        naoDuplicar = 49;
    }
    if (layer == T1_100m2018Freg && naoDuplicar != 50){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 1º trimestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT1_100m2018Freg();
        naoDuplicar = 50;
    }
    if (layer == T2_80m2018Freg && naoDuplicar != 51){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 2º trimestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT2_80m2018Freg();
        naoDuplicar = 51;
    }
    if (layer == T2_100m2018Freg && naoDuplicar != 52){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 2º trimestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT2_100m2018Freg();
        naoDuplicar = 52;
    }
    if (layer == T3_80m2018Freg && naoDuplicar != 53){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 3º trimestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT3_80m2018Freg();
        naoDuplicar = 53;
    }
    if (layer == T3_100m2018Freg && naoDuplicar != 54){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 3º trimestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT3_100m2018Freg();
        naoDuplicar = 54;
    }
    if (layer == T4_80m2018Freg && naoDuplicar != 55){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 4º trimestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT4_80m2018Freg();
        naoDuplicar = 55;
    }
    if (layer == T4_100m2018Freg && naoDuplicar != 56){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 4º trimestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT4_100m2018Freg();
        naoDuplicar = 56;
    }
    if (layer == T1_80m2019Freg && naoDuplicar != 57){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 1º trimestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT1_80m2019Freg();
        naoDuplicar = 57;
    }
    if (layer == T1_100m2019Freg && naoDuplicar != 58){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 1º trimestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT1_100m2019Freg();
        naoDuplicar = 58;
    }
    if (layer == T2_80m2019Freg && naoDuplicar != 59){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 2º trimestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT2_80m2019Freg();
        naoDuplicar = 59;
    }
    if (layer == T2_100m2019Freg && naoDuplicar != 60){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 2º trimestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT2_100m2019Freg();
        naoDuplicar = 60;
    }
    if (layer == T3_80m2019Freg && naoDuplicar != 61){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 3º trimestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT3_80m2019Freg();
        naoDuplicar = 61;
    }
    if (layer == T3_100m2019Freg && naoDuplicar != 62){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 3º trimestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT3_100m2019Freg();
        naoDuplicar = 62;
    }
    if (layer == T4_80m2019Freg && naoDuplicar != 63){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 80m², no 4º trimestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slideT4_80m2019Freg();
        naoDuplicar = 63;
    }
    if (layer == T4_100m2019Freg && naoDuplicar != 64){
        $('#tituloMapa').html(' <strong>' + 'Índice de acessibilidade para uma área bruta de 100m², no 4º trimestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slideT4_100m2019Freg();
        naoDuplicar = 64;
    }
    
    layer.addTo(map);
    layerAtiva = layer;  
}


function myFunction() {
    var ano = document.getElementById("mySelect").value;
    var area = document.getElementById("opcaoSelect").value;
    var trimestre = document.getElementById("trimestre").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#percentagem').hasClass('active4')){
            if (ano == "2016" && trimestre == "1" && area == "80"){
                novaLayer(T1_80m2016Conc)
            }
            if (ano == "2016" && trimestre == "1" && area == "100"){
                novaLayer(T1_100m2016Conc)
            }
            if (ano == "2016" && trimestre == "2" && area == "80"){
                novaLayer(T2_80m2016Conc)
            }
            if (ano == "2016" && trimestre == "2" && area == "100"){
                novaLayer(T2_100m2016Conc)
            }
            if (ano == "2016" && trimestre == "3" && area == "80"){
                novaLayer(T3_80m2016Conc)
            }
            if (ano == "2016" && trimestre == "3" && area == "100"){
                novaLayer(T3_100m2016Conc)
            }
            if (ano == "2016" && trimestre == "4" && area == "80"){
                novaLayer(T4_80m2016Conc)
            }
            if (ano == "2016" && trimestre == "4" && area == "100"){
                novaLayer(T4_100m2016Conc)
            }
            if (ano == "2017" && trimestre == "1" && area == "80"){
                novaLayer(T1_80m2017Conc)
            }
            if (ano == "2017" && trimestre == "1" && area == "100"){
                novaLayer(T1_100m2017Conc)
            }
            if (ano == "2017" && trimestre == "2" && area == "80"){
                novaLayer(T2_80m2017Conc)
            }
            if (ano == "2017" && trimestre == "2" && area == "100"){
                novaLayer(T2_100m2017Conc)
            }
            if (ano == "2017" && trimestre == "3" && area == "80"){
                novaLayer(T3_80m2017Conc)
            }
            if (ano == "2017" && trimestre == "3" && area == "100"){
                novaLayer(T3_100m2017Conc)
            }
            if (ano == "2017" && trimestre == "4" && area == "80"){
                novaLayer(T4_80m2017Conc)
            }
            if (ano == "2017" && trimestre == "4" && area == "100"){
                novaLayer(T4_100m2017Conc)
            }
            if (ano == "2018" && trimestre == "1" && area == "80"){
                novaLayer(T1_80m2018Conc)
            }
            if (ano == "2018" && trimestre == "1" && area == "100"){
                novaLayer(T1_100m2018Conc)
            }
            if (ano == "2018" && trimestre == "2" && area == "80"){
                novaLayer(T2_80m2018Conc)
            }
            if (ano == "2018" && trimestre == "2" && area == "100"){
                novaLayer(T2_100m2018Conc)
            }
            if (ano == "2018" && trimestre == "3" && area == "80"){
                novaLayer(T3_80m2018Conc)
            }
            if (ano == "2018" && trimestre == "3" && area == "100"){
                novaLayer(T3_100m2018Conc)
            }
            if (ano == "2018" && trimestre == "4" && area == "80"){
                novaLayer(T4_80m2018Conc)
            }
            if (ano == "2018" && trimestre == "4" && area == "100"){
                novaLayer(T4_100m2018Conc)
            }
            if (ano == "2019" && trimestre == "1" && area == "80"){
                novaLayer(T1_80m2019Conc)
            }
            if (ano == "2019" && trimestre == "1" && area == "100"){
                novaLayer(T1_100m2019Conc)
            }
            if (ano == "2019" && trimestre == "2" && area == "80"){
                novaLayer(T2_80m2019Conc)
            }
            if (ano == "2019" && trimestre == "2" && area == "100"){
                novaLayer(T2_100m2019Conc)
            }
            if (ano == "2019" && trimestre == "3" && area == "80"){
                novaLayer(T3_80m2019Conc)
            }
            if (ano == "2019" && trimestre == "3" && area == "100"){
                novaLayer(T3_100m2019Conc)
            }
            if (ano == "2019" && trimestre == "4" && area == "80"){
                novaLayer(T4_80m2019Conc)
            }
            if (ano == "2019" && trimestre == "4" && area == "100"){
                novaLayer(T4_100m2019Conc)
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if ($('#percentagem').hasClass('active5')){
            if (ano == "2016" && trimestre == "1" && area == "80"){
                novaLayer(T1_80m2016Freg)
            }
            if (ano == "2016" && trimestre == "1" && area == "100"){
                novaLayer(T1_100m2016Freg)
            }
            if (ano == "2016" && trimestre == "2" && area == "80"){
                novaLayer(T2_80m2016Freg)
            }
            if (ano == "2016" && trimestre == "2" && area == "100"){
                novaLayer(T2_100m2016Freg)
            }
            if (ano == "2016" && trimestre == "3" && area == "80"){
                novaLayer(T3_80m2016Freg)
            }
            if (ano == "2016" && trimestre == "3" && area == "100"){
                novaLayer(T3_100m2016Freg)
            }
            if (ano == "2016" && trimestre == "4" && area == "80"){
                novaLayer(T4_80m2016Freg)
            }
            if (ano == "2016" && trimestre == "4" && area == "100"){
                novaLayer(T4_100m2016Freg)
            }
            if (ano == "2017" && trimestre == "1" && area == "80"){
                novaLayer(T1_80m2017Freg)
            }
            if (ano == "2017" && trimestre == "1" && area == "100"){
                novaLayer(T1_100m2017Freg)
            }
            if (ano == "2017" && trimestre == "2" && area == "80"){
                novaLayer(T2_80m2017Freg)
            }
            if (ano == "2017" && trimestre == "2" && area == "100"){
                novaLayer(T2_100m2017Freg)
            }
            if (ano == "2017" && trimestre == "3" && area == "80"){
                novaLayer(T3_80m2017Freg)
            }
            if (ano == "2017" && trimestre == "3" && area == "100"){
                novaLayer(T3_100m2017Freg)
            }
            if (ano == "2017" && trimestre == "4" && area == "80"){
                novaLayer(T4_80m2017Freg)
            }
            if (ano == "2017" && trimestre == "4" && area == "100"){
                novaLayer(T4_100m2017Freg)
            }
            if (ano == "2018" && trimestre == "1" && area == "80"){
                novaLayer(T1_80m2018Freg)
            }
            if (ano == "2018" && trimestre == "1" && area == "100"){
                novaLayer(T1_100m2018Freg)
            }
            if (ano == "2018" && trimestre == "2" && area == "80"){
                novaLayer(T2_80m2018Freg)
            }
            if (ano == "2018" && trimestre == "2" && area == "100"){
                novaLayer(T2_100m2018Freg)
            }
            if (ano == "2018" && trimestre == "3" && area == "80"){
                novaLayer(T3_80m2018Freg)
            }
            if (ano == "2018" && trimestre == "3" && area == "100"){
                novaLayer(T3_100m2018Freg)
            }
            if (ano == "2018" && trimestre == "4" && area == "80"){
                novaLayer(T4_80m2018Freg)
            }
            if (ano == "2018" && trimestre == "4" && area == "100"){
                novaLayer(T4_100m2018Freg)
            }
            if (ano == "2019" && trimestre == "1" && area == "80"){
                novaLayer(T1_80m2019Freg)
            }
            if (ano == "2019" && trimestre == "1" && area == "100"){
                novaLayer(T1_100m2019Freg)
            }
            if (ano == "2019" && trimestre == "2" && area == "80"){
                novaLayer(T2_80m2019Freg)
            }
            if (ano == "2019" && trimestre == "2" && area == "100"){
                novaLayer(T2_100m2019Freg)
            }
            if (ano == "2019" && trimestre == "3" && area == "80"){
                novaLayer(T3_80m2019Freg)
            }
            if (ano == "2019" && trimestre == "3" && area == "100"){
                novaLayer(T3_100m2019Freg)
            }
            if (ano == "2019" && trimestre == "4" && area == "80"){
                novaLayer(T4_80m2019Freg)
            }
            if (ano == "2019" && trimestre == "4" && area == "100"){
                novaLayer(T4_100m2019Freg)
            }
        }
    }
}

let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
$('#percentagem').click(function(){
    tamanhoOutros();  
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
$('#trimestre').change(function(){
    myFunction();
})

let primeirovalor = function(ano,area,trimestre){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(area);
    $("#trimestre").val(trimestre);
}
let variaveisMapaConcelho = function(){
    if ($('#percentagem').hasClass('active4')){
        return false
    }
    else{
        $('#percentagem').attr('class',"butao active4");
        primeirovalor('2016','80','1');
        novaLayer(T1_80m2016Conc)
    }
}

let variaveisMapaFreguesias = function(){
    if($('#percentagem').hasClass('active5')){
        return false;
    }
    else{
        $('#percentagem').attr('class',"butao active5");
        primeirovalor('2016','80','1');
        novaLayer(T1_80m2016Freg)
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

    $('#tabelaPercentagem').attr("class","btn");
    $('#opcaoTabela').attr("class","btn");

    $('#temporal').css("visibility","visible");
    $('#slidersGeral').css("visibility","visible");
    $('.btn').css("top","50%");
    primeirovalor('2016','80','1');
    novaLayer(T1_80m2016Conc)
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

    $('#percentagem').attr("class","butao");
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
    $('#tituloMapa').html('Número de anos para concluir o valor de compra da habitação, com uma taxa de esforço de 30%, entre o 1º trimestre de 2016 e o 4º trimestre de 2019, €.');
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/AcessibilidadeProv.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $('#1').html("1")
        $.each(data, function(key, value){
            dados += '<tr>';
            if(containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                dados += '<td class="borderbottom bordertop">'+value.TaxaEsforco+'</td>';
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
            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                dados += '<td>'+value.TaxaEsforco+'</td>';
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
                dados += '<tr>';
            }
            dados += '<tr>';
        })
    $('#juntarValores').append(dados);   
    });
})};



let anosSelecionados = function() {
    let ano = document.getElementById("mySelect").value;
    if ($('#freguesias').hasClass("active2") || $('#concelho').hasClass("active2")){
        if (ano != "2020" || ano != "2016"){
            i = 1
        }
        if (ano == "2020"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (ano == "2016"){
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
