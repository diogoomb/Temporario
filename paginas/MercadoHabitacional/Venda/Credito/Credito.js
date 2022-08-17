// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('.ine').html('<strong>Fonte: </strong> INE, Estatísticas das instituições de crédito e sociedades financeiras.');


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

/////////////////////------- Dados CREDITO 2000 por Concelho -----////////////////////////

var minCredito2000Conc = 0;
var maxCredito2000Conc = 0;

function CorPerCredito(d) {
    return d == null ? '#808080' :
        d >= 20000 ? '#8c0303' :
        d >= 15000  ? '#de1f35' :
        d >= 10000 ? '#ff5e6e' :
        d >= 5000   ? '#f5b3be' :
        d >= 1420   ? '#F2C572' :
                ''  ;
}
var legendaPerCredito = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: €' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 20000' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 15000 a 20000' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 10000 a 15000' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 5000 a 10000' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 1420 a 5000' + '<br>'



    $(legendaA).append(symbolsContainer); 
}

function EstiloCredito2000Conc(feature) {
    if( feature.properties.Credito0 <= minCredito2000Conc || minCredito2000Conc === 0){
        minCredito2000Conc = feature.properties.Credito0
    }
    if(feature.properties.Credito0 >= maxCredito2000Conc ){
        maxCredito2000Conc = feature.properties.Credito0
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito0)
    };
}
function apagarCredito2000Conc(e) {
    Credito2000Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2000Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito0.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2000Conc,
    });
}
var Credito2000Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2000Conc,
    onEachFeature: onEachFeatureCredito2000Conc
});
let slideCredito2000Conc = function(){
    var sliderCredito2000Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2000Conc, {
        start: [minCredito2000Conc, maxCredito2000Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2000Conc,
            'max': maxCredito2000Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2000Conc);
    inputNumberMax.setAttribute("value",maxCredito2000Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2000Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2000Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2000Conc.noUiSlider.on('update',function(e){
        Credito2000Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito0.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito0.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2000Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderCredito2000Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2000Conc);
} 
Credito2000Conc.addTo(map);
$('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2000, por concelho.' + '</strong>');
legendaPerCredito();
slideCredito2000Conc();
/////////////////////////////////// ---------Fim de Dados CRÉDITO À HABITAÇÃO 2000 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2001 POR CONCELHO-----////////////////////////

var minCredito2001Conc = 0;
var maxCredito2001Conc = 0;

function EstiloCredito2001Conc(feature) {
    if( feature.properties.Credito1 <= minCredito2001Conc || minCredito2001Conc === 0){
        minCredito2001Conc = feature.properties.Credito1
    }
    if(feature.properties.Credito1 >= maxCredito2001Conc ){
        maxCredito2001Conc = feature.properties.Credito1
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito1)
    };
}
function apagarCredito2001Conc(e) {
    Credito2001Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2001Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito1.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2001Conc,
    });
}
var Credito2001Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2001Conc,
    onEachFeature: onEachFeatureCredito2001Conc
});
let slideCredito2001Conc = function(){
    var sliderCredito2001Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2001Conc, {
        start: [minCredito2001Conc, maxCredito2001Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2001Conc,
            'max': maxCredito2001Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2001Conc);
    inputNumberMax.setAttribute("value",maxCredito2001Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2001Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2001Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2001Conc.noUiSlider.on('update',function(e){
        Credito2001Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito1.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito1.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2001Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderCredito2001Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2001Conc);
}


/////////////////////////////////// Fim CRÉDITO 2001 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2002 POR CONCELHO-----////////////////////////

var minCredito2002Conc = 0;
var maxCredito2002Conc = 0;

function EstiloCredito2002Conc(feature) {
    if( feature.properties.Credito2 <= minCredito2002Conc || minCredito2002Conc === 0){
        minCredito2002Conc = feature.properties.Credito2
    }
    if(feature.properties.Credito2 >= maxCredito2002Conc ){
        maxCredito2002Conc = feature.properties.Credito2
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito2)
    };
}
function apagarCredito2002Conc(e) {
    Credito2002Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2002Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito2.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2002Conc,
    });
}
var Credito2002Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2002Conc,
    onEachFeature: onEachFeatureCredito2002Conc
});
let slideCredito2002Conc = function(){
    var sliderCredito2002Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2002Conc, {
        start: [minCredito2002Conc, maxCredito2002Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2002Conc,
            'max': maxCredito2002Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2002Conc);
    inputNumberMax.setAttribute("value",maxCredito2002Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2002Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2002Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2002Conc.noUiSlider.on('update',function(e){
        Credito2002Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito2.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito2.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2002Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderCredito2002Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2002Conc);
}


/////////////////////////////////// Fim CRÉDITO 2002 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2003 POR CONCELHO-----////////////////////////

var minCredito2003Conc = 0;
var maxCredito2003Conc = 0;

function EstiloCredito2003Conc(feature) {
    if( feature.properties.Credito3 <= minCredito2003Conc || minCredito2003Conc === 0){
        minCredito2003Conc = feature.properties.Credito3
    }
    if(feature.properties.Credito3 >= maxCredito2003Conc ){
        maxCredito2003Conc = feature.properties.Credito3
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito3)
    };
}
function apagarCredito2003Conc(e) {
    Credito2003Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2003Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito3.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2003Conc,
    });
}
var Credito2003Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2003Conc,
    onEachFeature: onEachFeatureCredito2003Conc
});
let slideCredito2003Conc = function(){
    var sliderCredito2003Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2003Conc, {
        start: [minCredito2003Conc, maxCredito2003Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2003Conc,
            'max': maxCredito2003Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2003Conc);
    inputNumberMax.setAttribute("value",maxCredito2003Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2003Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2003Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2003Conc.noUiSlider.on('update',function(e){
        Credito2003Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito3.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito3.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2003Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderCredito2003Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2003Conc);
}


/////////////////////////////////// Fim CRÉDITO 2003 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2004 POR CONCELHO-----////////////////////////

var minCredito2004Conc = 0;
var maxCredito2004Conc = 0;

function EstiloCredito2004Conc(feature) {
    if( feature.properties.Credito4 <= minCredito2004Conc || minCredito2004Conc === 0){
        minCredito2004Conc = feature.properties.Credito4
    }
    if(feature.properties.Credito4 >= maxCredito2004Conc ){
        maxCredito2004Conc = feature.properties.Credito4
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito4)
    };
}
function apagarCredito2004Conc(e) {
    Credito2004Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2004Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito4.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2004Conc,
    });
}
var Credito2004Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2004Conc,
    onEachFeature: onEachFeatureCredito2004Conc
});
let slideCredito2004Conc = function(){
    var sliderCredito2004Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2004Conc, {
        start: [minCredito2004Conc, maxCredito2004Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2004Conc,
            'max': maxCredito2004Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2004Conc);
    inputNumberMax.setAttribute("value",maxCredito2004Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2004Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2004Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2004Conc.noUiSlider.on('update',function(e){
        Credito2004Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito4.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito4.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2004Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderCredito2004Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2004Conc);
}


/////////////////////////////////// Fim CRÉDITO 2004 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2005 POR CONCELHO-----////////////////////////

var minCredito2005Conc = 0;
var maxCredito2005Conc = 0;

function EstiloCredito2005Conc(feature) {
    if( feature.properties.Credito5 <= minCredito2005Conc || minCredito2005Conc === 0){
        minCredito2005Conc = feature.properties.Credito5
    }
    if(feature.properties.Credito5 >= maxCredito2005Conc ){
        maxCredito2005Conc = feature.properties.Credito5
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito5)
    };
}
function apagarCredito2005Conc(e) {
    Credito2005Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2005Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito5.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2005Conc,
    });
}
var Credito2005Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2005Conc,
    onEachFeature: onEachFeatureCredito2005Conc
});
let slideCredito2005Conc = function(){
    var sliderCredito2005Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2005Conc, {
        start: [minCredito2005Conc, maxCredito2005Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2005Conc,
            'max': maxCredito2005Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2005Conc);
    inputNumberMax.setAttribute("value",maxCredito2005Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2005Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2005Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2005Conc.noUiSlider.on('update',function(e){
        Credito2005Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito5.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito5.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2005Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderCredito2005Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2005Conc);
}


/////////////////////////////////// Fim CRÉDITO 2005 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2006 POR CONCELHO-----////////////////////////

var minCredito2006Conc = 0;
var maxCredito2006Conc = 0;

function EstiloCredito2006Conc(feature) {
    if( feature.properties.Credito6 <= minCredito2006Conc || minCredito2006Conc === 0){
        minCredito2006Conc = feature.properties.Credito6
    }
    if(feature.properties.Credito6 >= maxCredito2006Conc ){
        maxCredito2006Conc = feature.properties.Credito6
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito6)
    };
}
function apagarCredito2006Conc(e) {
    Credito2006Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2006Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito6.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2006Conc,
    });
}
var Credito2006Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2006Conc,
    onEachFeature: onEachFeatureCredito2006Conc
});
let slideCredito2006Conc = function(){
    var sliderCredito2006Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2006Conc, {
        start: [minCredito2006Conc, maxCredito2006Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2006Conc,
            'max': maxCredito2006Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2006Conc);
    inputNumberMax.setAttribute("value",maxCredito2006Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2006Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2006Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2006Conc.noUiSlider.on('update',function(e){
        Credito2006Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito6.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito6.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2006Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderCredito2006Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2006Conc);
}


/////////////////////////////////// Fim CRÉDITO 2006 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2007 POR CONCELHO-----////////////////////////

var minCredito2007Conc = 0;
var maxCredito2007Conc = 0;

function EstiloCredito2007Conc(feature) {
    if( feature.properties.Credito7 <= minCredito2007Conc || minCredito2007Conc === 0){
        minCredito2007Conc = feature.properties.Credito7
    }
    if(feature.properties.Credito7 >= maxCredito2007Conc ){
        maxCredito2007Conc = feature.properties.Credito7
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito7)
    };
}
function apagarCredito2007Conc(e) {
    Credito2007Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2007Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito7.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2007Conc,
    });
}
var Credito2007Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2007Conc,
    onEachFeature: onEachFeatureCredito2007Conc
});
let slideCredito2007Conc = function(){
    var sliderCredito2007Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2007Conc, {
        start: [minCredito2007Conc, maxCredito2007Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2007Conc,
            'max': maxCredito2007Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2007Conc);
    inputNumberMax.setAttribute("value",maxCredito2007Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2007Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2007Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2007Conc.noUiSlider.on('update',function(e){
        Credito2007Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito7.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito7.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2007Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderCredito2007Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2007Conc);
}


/////////////////////////////////// Fim CRÉDITO 2007 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2008 POR CONCELHO-----////////////////////////

var minCredito2008Conc = 0;
var maxCredito2008Conc = 0;

function EstiloCredito2008Conc(feature) {
    if( feature.properties.Credito8 <= minCredito2008Conc || minCredito2008Conc === 0){
        minCredito2008Conc = feature.properties.Credito8
    }
    if(feature.properties.Credito8 >= maxCredito2008Conc ){
        maxCredito2008Conc = feature.properties.Credito8
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito8)
    };
}
function apagarCredito2008Conc(e) {
    Credito2008Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2008Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito8.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2008Conc,
    });
}
var Credito2008Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2008Conc,
    onEachFeature: onEachFeatureCredito2008Conc
});
let slideCredito2008Conc = function(){
    var sliderCredito2008Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2008Conc, {
        start: [minCredito2008Conc, maxCredito2008Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2008Conc,
            'max': maxCredito2008Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2008Conc);
    inputNumberMax.setAttribute("value",maxCredito2008Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2008Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2008Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2008Conc.noUiSlider.on('update',function(e){
        Credito2008Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito8.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito8.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2008Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderCredito2008Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2008Conc);
}


/////////////////////////////////// Fim CRÉDITO 2008 POR CONCELHO -------------- \\\\\\


/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2009 POR CONCELHO-----////////////////////////

var minCredito2009Conc = 0;
var maxCredito2009Conc = 0;

function EstiloCredito2009Conc(feature) {
    if( feature.properties.Credito9 <= minCredito2009Conc || minCredito2009Conc === 0){
        minCredito2009Conc = feature.properties.Credito9
    }
    if(feature.properties.Credito9 >= maxCredito2009Conc ){
        maxCredito2009Conc = feature.properties.Credito9
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito9)
    };
}
function apagarCredito2009Conc(e) {
    Credito2009Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2009Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito9.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2009Conc,
    });
}
var Credito2009Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2009Conc,
    onEachFeature: onEachFeatureCredito2009Conc
});
let slideCredito2009Conc = function(){
    var sliderCredito2009Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2009Conc, {
        start: [minCredito2009Conc, maxCredito2009Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2009Conc,
            'max': maxCredito2009Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2009Conc);
    inputNumberMax.setAttribute("value",maxCredito2009Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2009Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2009Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2009Conc.noUiSlider.on('update',function(e){
        Credito2009Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito9.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito9.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2009Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderCredito2009Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2009Conc);
}


/////////////////////////////////// Fim CRÉDITO 2009 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2010 POR CONCELHO-----////////////////////////

var minCredito2010Conc = 0;
var maxCredito2010Conc = 0;

function EstiloCredito2010Conc(feature) {
    if( feature.properties.Credito10 <= minCredito2010Conc || minCredito2010Conc === 0){
        minCredito2010Conc = feature.properties.Credito10
    }
    if(feature.properties.Credito10 >= maxCredito2010Conc ){
        maxCredito2010Conc = feature.properties.Credito10
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito10)
    };
}
function apagarCredito2010Conc(e) {
    Credito2010Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2010Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito10.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2010Conc,
    });
}
var Credito2010Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2010Conc,
    onEachFeature: onEachFeatureCredito2010Conc
});
let slideCredito2010Conc = function(){
    var sliderCredito2010Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2010Conc, {
        start: [minCredito2010Conc, maxCredito2010Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2010Conc,
            'max': maxCredito2010Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2010Conc);
    inputNumberMax.setAttribute("value",maxCredito2010Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2010Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2010Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2010Conc.noUiSlider.on('update',function(e){
        Credito2010Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito10.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito10.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2010Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderCredito2010Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2010Conc);
}


/////////////////////////////////// Fim CRÉDITO 2010 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2011 POR CONCELHO-----////////////////////////

var minCredito2011Conc = 0;
var maxCredito2011Conc = 0;

function EstiloCredito2011Conc(feature) {
    if( feature.properties.Credito11 <= minCredito2011Conc || minCredito2011Conc === 0){
        minCredito2011Conc = feature.properties.Credito11
    }
    if(feature.properties.Credito11 >= maxCredito2011Conc ){
        maxCredito2011Conc = feature.properties.Credito11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito11)
    };
}
function apagarCredito2011Conc(e) {
    Credito2011Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2011Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito11.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2011Conc,
    });
}
var Credito2011Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2011Conc,
    onEachFeature: onEachFeatureCredito2011Conc
});
let slideCredito2011Conc = function(){
    var sliderCredito2011Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2011Conc, {
        start: [minCredito2011Conc, maxCredito2011Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2011Conc,
            'max': maxCredito2011Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2011Conc);
    inputNumberMax.setAttribute("value",maxCredito2011Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2011Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2011Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2011Conc.noUiSlider.on('update',function(e){
        Credito2011Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito11.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito11.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2011Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderCredito2011Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2011Conc);
}


/////////////////////////////////// Fim CRÉDITO 2011 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2012 POR CONCELHO-----////////////////////////

var minCredito2012Conc = 0;
var maxCredito2012Conc = 0;

function EstiloCredito2012Conc(feature) {
    if( feature.properties.Credito12 <= minCredito2012Conc || minCredito2012Conc === 0){
        minCredito2012Conc = feature.properties.Credito12
    }
    if(feature.properties.Credito12 >= maxCredito2012Conc ){
        maxCredito2012Conc = feature.properties.Credito12
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito12)
    };
}
function apagarCredito2012Conc(e) {
    Credito2012Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2012Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito12.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2012Conc,
    });
}
var Credito2012Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2012Conc,
    onEachFeature: onEachFeatureCredito2012Conc
});
let slideCredito2012Conc = function(){
    var sliderCredito2012Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2012Conc, {
        start: [minCredito2012Conc, maxCredito2012Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2012Conc,
            'max': maxCredito2012Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2012Conc);
    inputNumberMax.setAttribute("value",maxCredito2012Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2012Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2012Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2012Conc.noUiSlider.on('update',function(e){
        Credito2012Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito12.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito12.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2012Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderCredito2012Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2012Conc);
}


/////////////////////////////////// Fim CRÉDITO 2012 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2013 POR CONCELHO-----////////////////////////

var minCredito2013Conc = 0;
var maxCredito2013Conc = 0;

function EstiloCredito2013Conc(feature) {
    if( feature.properties.Credito13 <= minCredito2013Conc || minCredito2013Conc === 0){
        minCredito2013Conc = feature.properties.Credito13
    }
    if(feature.properties.Credito13 >= maxCredito2013Conc ){
        maxCredito2013Conc = feature.properties.Credito13
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito13)
    };
}
function apagarCredito2013Conc(e) {
    Credito2013Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2013Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito13.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2013Conc,
    });
}
var Credito2013Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2013Conc,
    onEachFeature: onEachFeatureCredito2013Conc
});
let slideCredito2013Conc = function(){
    var sliderCredito2013Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2013Conc, {
        start: [minCredito2013Conc, maxCredito2013Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2013Conc,
            'max': maxCredito2013Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2013Conc);
    inputNumberMax.setAttribute("value",maxCredito2013Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2013Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2013Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2013Conc.noUiSlider.on('update',function(e){
        Credito2013Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito13.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito13.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2013Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderCredito2013Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2013Conc);
}


/////////////////////////////////// Fim CRÉDITO 2013 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2014 POR CONCELHO-----////////////////////////

var minCredito2014Conc = 0;
var maxCredito2014Conc = 0;

function EstiloCredito2014Conc(feature) {
    if( feature.properties.Credito14 <= minCredito2014Conc || minCredito2014Conc === 0){
        minCredito2014Conc = feature.properties.Credito14
    }
    if(feature.properties.Credito14 >= maxCredito2014Conc ){
        maxCredito2014Conc = feature.properties.Credito14
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito14)
    };
}
function apagarCredito2014Conc(e) {
    Credito2014Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2014Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito14.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2014Conc,
    });
}
var Credito2014Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2014Conc,
    onEachFeature: onEachFeatureCredito2014Conc
});
let slideCredito2014Conc = function(){
    var sliderCredito2014Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2014Conc, {
        start: [minCredito2014Conc, maxCredito2014Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2014Conc,
            'max': maxCredito2014Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2014Conc);
    inputNumberMax.setAttribute("value",maxCredito2014Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2014Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2014Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2014Conc.noUiSlider.on('update',function(e){
        Credito2014Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito14.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito14.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2014Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderCredito2014Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2014Conc);
}


/////////////////////////////////// Fim CRÉDITO 2014 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2015 POR CONCELHO-----////////////////////////

var minCredito2015Conc = 0;
var maxCredito2015Conc = 0;

function EstiloCredito2015Conc(feature) {
    if( feature.properties.Credito15 <= minCredito2015Conc || minCredito2015Conc === 0){
        minCredito2015Conc = feature.properties.Credito15
    }
    if(feature.properties.Credito15 >= maxCredito2015Conc ){
        maxCredito2015Conc = feature.properties.Credito15
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito15)
    };
}
function apagarCredito2015Conc(e) {
    Credito2015Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2015Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito15.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2015Conc,
    });
}
var Credito2015Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2015Conc,
    onEachFeature: onEachFeatureCredito2015Conc
});
let slideCredito2015Conc = function(){
    var sliderCredito2015Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2015Conc, {
        start: [minCredito2015Conc, maxCredito2015Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2015Conc,
            'max': maxCredito2015Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2015Conc);
    inputNumberMax.setAttribute("value",maxCredito2015Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2015Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2015Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2015Conc.noUiSlider.on('update',function(e){
        Credito2015Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito15.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito15.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2015Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderCredito2015Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2015Conc);
}


/////////////////////////////////// Fim CRÉDITO 2015 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2016 POR CONCELHO-----////////////////////////

var minCredito2016Conc = 0;
var maxCredito2016Conc = 0;

function EstiloCredito2016Conc(feature) {
    if( feature.properties.Credito16 <= minCredito2016Conc || minCredito2016Conc === 0){
        minCredito2016Conc = feature.properties.Credito16
    }
    if(feature.properties.Credito16 >= maxCredito2016Conc ){
        maxCredito2016Conc = feature.properties.Credito16
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito16)
    };
}
function apagarCredito2016Conc(e) {
    Credito2016Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2016Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito16.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2016Conc,
    });
}
var Credito2016Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2016Conc,
    onEachFeature: onEachFeatureCredito2016Conc
});
let slideCredito2016Conc = function(){
    var sliderCredito2016Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2016Conc, {
        start: [minCredito2016Conc, maxCredito2016Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2016Conc,
            'max': maxCredito2016Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2016Conc);
    inputNumberMax.setAttribute("value",maxCredito2016Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2016Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2016Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2016Conc.noUiSlider.on('update',function(e){
        Credito2016Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito16.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito16.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2016Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderCredito2016Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2016Conc);
}


/////////////////////////////////// Fim CRÉDITO 2016 POR CONCELHO -------------- \\\\\\


/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2017 POR CONCELHO-----////////////////////////

var minCredito2017Conc = 0;
var maxCredito2017Conc = 0;

function EstiloCredito2017Conc(feature) {
    if( feature.properties.Credito17 <= minCredito2017Conc || minCredito2017Conc === 0){
        minCredito2017Conc = feature.properties.Credito17
    }
    if(feature.properties.Credito17 >= maxCredito2017Conc ){
        maxCredito2017Conc = feature.properties.Credito17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito17)
    };
}
function apagarCredito2017Conc(e) {
    Credito2017Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2017Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito17.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2017Conc,
    });
}
var Credito2017Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2017Conc,
    onEachFeature: onEachFeatureCredito2017Conc
});
let slideCredito2017Conc = function(){
    var sliderCredito2017Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2017Conc, {
        start: [minCredito2017Conc, maxCredito2017Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2017Conc,
            'max': maxCredito2017Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2017Conc);
    inputNumberMax.setAttribute("value",maxCredito2017Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2017Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2017Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2017Conc.noUiSlider.on('update',function(e){
        Credito2017Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito17.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito17.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2017Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderCredito2017Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2017Conc);
}


/////////////////////////////////// Fim CRÉDITO 2017 POR CONCELHO -------------- \\\\\\


/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2018 POR CONCELHO-----////////////////////////

var minCredito2018Conc = 0;
var maxCredito2018Conc = 0;

function EstiloCredito2018Conc(feature) {
    if( feature.properties.Credito18 <= minCredito2018Conc || minCredito2018Conc === 0){
        minCredito2018Conc = feature.properties.Credito18
    }
    if(feature.properties.Credito18 >= maxCredito2018Conc ){
        maxCredito2018Conc = feature.properties.Credito18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito18)
    };
}
function apagarCredito2018Conc(e) {
    Credito2018Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2018Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito18.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2018Conc,
    });
}
var Credito2018Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2018Conc,
    onEachFeature: onEachFeatureCredito2018Conc
});
let slideCredito2018Conc = function(){
    var sliderCredito2018Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2018Conc, {
        start: [minCredito2018Conc, maxCredito2018Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2018Conc,
            'max': maxCredito2018Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2018Conc);
    inputNumberMax.setAttribute("value",maxCredito2018Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2018Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2018Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2018Conc.noUiSlider.on('update',function(e){
        Credito2018Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito18.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito18.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2018Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderCredito2018Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2018Conc);
}


/////////////////////////////////// Fim CRÉDITO 2018 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2019 POR CONCELHO-----////////////////////////

var minCredito2019Conc = 0;
var maxCredito2019Conc = 0;

function EstiloCredito2019Conc(feature) {
    if( feature.properties.Credito19 <= minCredito2019Conc || minCredito2019Conc === 0){
        minCredito2019Conc = feature.properties.Credito19
    }
    if(feature.properties.Credito19 >= maxCredito2019Conc ){
        maxCredito2019Conc = feature.properties.Credito19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito19)
    };
}
function apagarCredito2019Conc(e) {
    Credito2019Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2019Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito19.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2019Conc,
    });
}
var Credito2019Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2019Conc,
    onEachFeature: onEachFeatureCredito2019Conc
});
let slideCredito2019Conc = function(){
    var sliderCredito2019Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2019Conc, {
        start: [minCredito2019Conc, maxCredito2019Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2019Conc,
            'max': maxCredito2019Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2019Conc);
    inputNumberMax.setAttribute("value",maxCredito2019Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2019Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2019Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2019Conc.noUiSlider.on('update',function(e){
        Credito2019Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito19.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito19.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2019Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderCredito2019Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2019Conc);
}


/////////////////////////////////// Fim CRÉDITO 2019 POR CONCELHO -------------- \\\\\\

/////////////////////--------------------------- Dados CRÉDITO À HABITAÇÃO 2020 POR CONCELHO-----////////////////////////

var minCredito2020Conc = 0;
var maxCredito2020Conc = 0;

function EstiloCredito2020Conc(feature) {
    if( feature.properties.Credito20 <= minCredito2020Conc || minCredito2020Conc === 0){
        minCredito2020Conc = feature.properties.Credito20
    }
    if(feature.properties.Credito20 >= maxCredito2020Conc ){
        maxCredito2020Conc = feature.properties.Credito20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerCredito(feature.properties.Credito20)
    };
}
function apagarCredito2020Conc(e) {
    Credito2020Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureCredito2020Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Crédito à habitação por habitante: ' + '<b>' + feature.properties.Credito20.toFixed(0) + '€' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarCredito2020Conc,
    });
}
var Credito2020Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloCredito2020Conc,
    onEachFeature: onEachFeatureCredito2020Conc
});
let slideCredito2020Conc = function(){
    var sliderCredito2020Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderCredito2020Conc, {
        start: [minCredito2020Conc, maxCredito2020Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minCredito2020Conc,
            'max': maxCredito2020Conc
        },
        format: {
            to: (v) => parseFloat(v).toFixed(0),
            from: (v) => parseFloat(v).toFixed(0),
        }
        });
    inputNumberMin.setAttribute("value",minCredito2020Conc);
    inputNumberMax.setAttribute("value",maxCredito2020Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderCredito2020Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderCredito2020Conc.noUiSlider.set([null, this.value]);
    });

    sliderCredito2020Conc.noUiSlider.on('update',function(e){
        Credito2020Conc.eachLayer(function(layer){
            if(layer.feature.properties.Credito20.toFixed(0)>=parseFloat(e[0])&& layer.feature.properties.Credito20.toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderCredito2020Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderCredito2020Conc.noUiSlider;
    $(slidersGeral).append(sliderCredito2020Conc);
}


/////////////////////////////////// Fim CRÉDITO 2020 POR CONCELHO -------------- \\\\\\





/////////////////////////////------------------------ VARIAÇÕES -------------------------------\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação 2001  E 2000 POR CONCELHOS -------------------////

var minVar2001_2000Conc = 0;
var maxVar2001_2000Conc = 0;

function CorVar2001_2000(d) {
    return d === null ? '#808080':
        d >= 25  ? '#8c0303' :
        d >= 20  ? '#de1f35' :
        d >= 16  ? '#ff5e6e' :
        d >= 13  ? '#f5b3be' :
        d >= 9  ? '#F2C572' :
                ''  ;
}

var legendaVar2001_2000 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2001 e 2000, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  20 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  16 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  13 a 16' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + '  9.48 a 13' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2001_2000Conc(feature) {
    if(feature.properties.Var01_00 <= minVar2001_2000Conc || minVar2001_2000Conc ===0){
        minVar2001_2000Conc = feature.properties.Var01_00
    }
    if(feature.properties.Var01_00 > maxVar2001_2000Conc){
        maxVar2001_2000Conc = feature.properties.Var01_00 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2001_2000(feature.properties.Var01_00)};
    }


function apagarVar2001_2000Conc(e) {
    Var2001_2000Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2001_2000Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var01_00.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2001_2000Conc,
    });
}
var Var2001_2000Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2001_2000Conc,
    onEachFeature: onEachFeatureVar2001_2000Conc
});

let slideVar2001_2000Conc = function(){
    var sliderVar2001_2000Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2001_2000Conc, {
        start: [minVar2001_2000Conc, maxVar2001_2000Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2001_2000Conc,
            'max': maxVar2001_2000Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2001_2000Conc);
    inputNumberMax.setAttribute("value",maxVar2001_2000Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2001_2000Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2001_2000Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2001_2000Conc.noUiSlider.on('update',function(e){
        Var2001_2000Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var01_00.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var01_00.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2001_2000Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderVar2001_2000Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2001_2000Conc);
} 

///////////////////////////// Fim da Variação 2001 e 2000 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2002  E 2001 POR CONCELHOS -------------------////

var minVar2002_2001Conc = 0;
var maxVar2002_2001Conc = 0;

function CorVar2002_2001(d) {
    return d === null ? '#808080':
        d >= 40  ? '#8c0303' :
        d >= 25  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5 ? '#9eaad7' :
                ''  ;
}

var legendaVar2002_2001 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2002 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  25 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '   0 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -5 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar2002_2001Conc(feature) {
    if(feature.properties.Var02_01 <= minVar2002_2001Conc || minVar2002_2001Conc ===0){
        minVar2002_2001Conc = feature.properties.Var02_01
    }
    if(feature.properties.Var02_01 > maxVar2002_2001Conc){
        maxVar2002_2001Conc = feature.properties.Var02_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2002_2001(feature.properties.Var02_01)};
    }


function apagarVar2002_2001Conc(e) {
    Var2002_2001Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2002_2001Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var02_01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2002_2001Conc,
    });
}
var Var2002_2001Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2002_2001Conc,
    onEachFeature: onEachFeatureVar2002_2001Conc
});

let slideVar2002_2001Conc = function(){
    var sliderVar2002_2001Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2002_2001Conc, {
        start: [minVar2002_2001Conc, maxVar2002_2001Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2002_2001Conc,
            'max': maxVar2002_2001Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2002_2001Conc);
    inputNumberMax.setAttribute("value",maxVar2002_2001Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2002_2001Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2002_2001Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2002_2001Conc.noUiSlider.on('update',function(e){
        Var2002_2001Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var02_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var02_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2002_2001Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderVar2002_2001Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2002_2001Conc);
} 

///////////////////////////// Fim da Variação 2002 e 2001 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2003  E 2002 POR CONCELHOS -------------------////

var minVar2003_2002Conc = 0;
var maxVar2003_2002Conc = 0;

function CorVar2003_2002(d) {
    return d === null ? '#808080':
        d >= 40  ? '#8c0303' :
        d >= 30  ? '#de1f35' :
        d >= 20  ? '#ff5e6e' :
        d >= 10  ? '#f5b3be' :
        d >= 1.42 ? '#F2C572' :
                ''  ;
}

var legendaVar2003_2002 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2003 e 2002, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  30 a 40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  20 a 30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  10 a 20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + '  1.42 a 10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVar2003_2002Conc(feature) {
    if(feature.properties.Var03_02 <= minVar2003_2002Conc || minVar2003_2002Conc ===0){
        minVar2003_2002Conc = feature.properties.Var03_02
    }
    if(feature.properties.Var03_02 > maxVar2003_2002Conc){
        maxVar2003_2002Conc = feature.properties.Var03_02 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2003_2002(feature.properties.Var03_02)};
    }


function apagarVar2003_2002Conc(e) {
    Var2003_2002Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2003_2002Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var03_02.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2003_2002Conc,
    });
}
var Var2003_2002Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2003_2002Conc,
    onEachFeature: onEachFeatureVar2003_2002Conc
});

let slideVar2003_2002Conc = function(){
    var sliderVar2003_2002Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2003_2002Conc, {
        start: [minVar2003_2002Conc, maxVar2003_2002Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2003_2002Conc,
            'max': maxVar2003_2002Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2003_2002Conc);
    inputNumberMax.setAttribute("value",maxVar2003_2002Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2003_2002Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2003_2002Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2003_2002Conc.noUiSlider.on('update',function(e){
        Var2003_2002Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var03_02.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var03_02.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2003_2002Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderVar2003_2002Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2003_2002Conc);
} 

///////////////////////////// Fim da Variação 2003 e 2002 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2004  E 2003 POR CONCELHOS -------------------////

var minVar2004_2003Conc = 0;
var maxVar2004_2003Conc = 0;

function CorVar2004_2003(d) {
    return d === null ? '#808080':
        d >= 15  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -3 ? '#9eaad7' :
                ''  ;
}

var legendaVar2004_2003 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2004 e 2003, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  10 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2.47 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2004_2003Conc(feature) {
    if(feature.properties.Var04_03 <= minVar2004_2003Conc || minVar2004_2003Conc ===0){
        minVar2004_2003Conc = feature.properties.Var04_03
    }
    if(feature.properties.Var04_03 > maxVar2004_2003Conc){
        maxVar2004_2003Conc = feature.properties.Var04_03 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2004_2003(feature.properties.Var04_03)};
    }


function apagarVar2004_2003Conc(e) {
    Var2004_2003Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2004_2003Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var04_03.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2004_2003Conc,
    });
}
var Var2004_2003Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2004_2003Conc,
    onEachFeature: onEachFeatureVar2004_2003Conc
});

let slideVar2004_2003Conc = function(){
    var sliderVar2004_2003Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2004_2003Conc, {
        start: [minVar2004_2003Conc, maxVar2004_2003Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2004_2003Conc,
            'max': maxVar2004_2003Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2004_2003Conc);
    inputNumberMax.setAttribute("value",maxVar2004_2003Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2004_2003Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2004_2003Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2004_2003Conc.noUiSlider.on('update',function(e){
        Var2004_2003Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var04_03.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var04_03.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2004_2003Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderVar2004_2003Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2004_2003Conc);
} 

///////////////////////////// Fim da Variação 2004 e 2003 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2005  E 2004 POR CONCELHOS -------------------////

var minVar2005_2004Conc = 0;
var maxVar2005_2004Conc = 0;

function CorVar2005_2004(d) {
    return d === null ? '#808080':
        d >= 15  ? '#8c0303' :
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -16 ? '#9eaad7' :
                ''  ;
}

var legendaVar2005_2004 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2005 e 2004, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  10 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -15.15 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2005_2004Conc(feature) {
    if(feature.properties.Var05_04 <= minVar2005_2004Conc || minVar2005_2004Conc ===0){
        minVar2005_2004Conc = feature.properties.Var05_04
    }
    if(feature.properties.Var05_04 > maxVar2005_2004Conc){
        maxVar2005_2004Conc = feature.properties.Var05_04 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2005_2004(feature.properties.Var05_04)};
    }


function apagarVar2005_2004Conc(e) {
    Var2005_2004Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2005_2004Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var05_04.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2005_2004Conc,
    });
}
var Var2005_2004Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2005_2004Conc,
    onEachFeature: onEachFeatureVar2005_2004Conc
});

let slideVar2005_2004Conc = function(){
    var sliderVar2005_2004Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2005_2004Conc, {
        start: [minVar2005_2004Conc, maxVar2005_2004Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2005_2004Conc,
            'max': maxVar2005_2004Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2005_2004Conc);
    inputNumberMax.setAttribute("value",maxVar2005_2004Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2005_2004Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2005_2004Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2005_2004Conc.noUiSlider.on('update',function(e){
        Var2005_2004Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var05_04.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var05_04.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2005_2004Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderVar2005_2004Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2005_2004Conc);
} 

///////////////////////////// Fim da Variação 2005 e 2004 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2006  E 2005 POR CONCELHOS -------------------////

var minVar2006_2005Conc = 0;
var maxVar2006_2005Conc = 0;

function CorVar2006_2005(d) {
    return d === null ? '#808080':
        d >= 25  ? '#de1f35' :
        d >= 15  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -16 ? '#2288bf' :
                ''  ;
}

var legendaVar2006_2005 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2006 e 2005, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -14.63 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2006_2005Conc(feature) {
    if(feature.properties.Var06_05 <= minVar2006_2005Conc || minVar2006_2005Conc ===0){
        minVar2006_2005Conc = feature.properties.Var06_05
    }
    if(feature.properties.Var06_05 > maxVar2006_2005Conc){
        maxVar2006_2005Conc = feature.properties.Var06_05 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2006_2005(feature.properties.Var06_05)};
    }


function apagarVar2006_2005Conc(e) {
    Var2006_2005Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2006_2005Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var06_05.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2006_2005Conc,
    });
}
var Var2006_2005Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2006_2005Conc,
    onEachFeature: onEachFeatureVar2006_2005Conc
});

let slideVar2006_2005Conc = function(){
    var sliderVar2006_2005Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2006_2005Conc, {
        start: [minVar2006_2005Conc, maxVar2006_2005Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2006_2005Conc,
            'max': maxVar2006_2005Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2006_2005Conc);
    inputNumberMax.setAttribute("value",maxVar2006_2005Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2006_2005Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2006_2005Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2006_2005Conc.noUiSlider.on('update',function(e){
        Var2006_2005Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var06_05.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var06_05.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2006_2005Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderVar2006_2005Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2006_2005Conc);
} 

///////////////////////////// Fim da Variação 2006 e 2005 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2007  E 2006 POR CONCELHOS -------------------////

var minVar2007_2006Conc = 0;
var maxVar2007_2006Conc = 0;

function CorVar2007_2006(d) {
    return d === null ? '#808080':
        d >= 25  ? '#de1f35' :
        d >= 10  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -15  ? '#9eaad7' :
        d >= -36 ? '#2288bf' :
                ''  ;
}

var legendaVar2007_2006 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2007 e 2006, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  15 a 25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -14.63 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2007_2006Conc(feature) {
    if(feature.properties.Var07_06 <= minVar2007_2006Conc || minVar2007_2006Conc ===0){
        minVar2007_2006Conc = feature.properties.Var07_06
    }
    if(feature.properties.Var07_06 > maxVar2007_2006Conc){
        maxVar2007_2006Conc = feature.properties.Var07_06 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2007_2006(feature.properties.Var07_06)};
    }


function apagarVar2007_2006Conc(e) {
    Var2007_2006Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2007_2006Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var07_06.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2007_2006Conc,
    });
}
var Var2007_2006Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2007_2006Conc,
    onEachFeature: onEachFeatureVar2007_2006Conc
});

let slideVar2007_2006Conc = function(){
    var sliderVar2007_2006Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2007_2006Conc, {
        start: [minVar2007_2006Conc, maxVar2007_2006Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2007_2006Conc,
            'max': maxVar2007_2006Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2007_2006Conc);
    inputNumberMax.setAttribute("value",maxVar2007_2006Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2007_2006Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2007_2006Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2007_2006Conc.noUiSlider.on('update',function(e){
        Var2007_2006Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var07_06.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var07_06.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2007_2006Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderVar2007_2006Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2007_2006Conc);
} 

///////////////////////////// Fim da Variação 2007 e 2006 POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação 2008  E 2007 POR CONCELHOS -------------------////

var minVar2008_2007Conc = 0;
var maxVar2008_2007Conc = 0;

function CorVar2008_2007(d) {
    return d === null ? '#808080':
        d >= 15  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -21 ? '#2288bf' :
                ''  ;
}

var legendaVar2008_2007 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2008 e 2007, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -20.44 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2008_2007Conc(feature) {
    if(feature.properties.Var08_07 <= minVar2008_2007Conc || minVar2008_2007Conc ===0){
        minVar2008_2007Conc = feature.properties.Var08_07
    }
    if(feature.properties.Var08_07 > maxVar2008_2007Conc){
        maxVar2008_2007Conc = feature.properties.Var08_07 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2008_2007(feature.properties.Var08_07)};
    }


function apagarVar2008_2007Conc(e) {
    Var2008_2007Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2008_2007Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var08_07.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2008_2007Conc,
    });
}
var Var2008_2007Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2008_2007Conc,
    onEachFeature: onEachFeatureVar2008_2007Conc
});

let slideVar2008_2007Conc = function(){
    var sliderVar2008_2007Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2008_2007Conc, {
        start: [minVar2008_2007Conc, maxVar2008_2007Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2008_2007Conc,
            'max': maxVar2008_2007Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2008_2007Conc);
    inputNumberMax.setAttribute("value",maxVar2008_2007Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2008_2007Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2008_2007Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2008_2007Conc.noUiSlider.on('update',function(e){
        Var2008_2007Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var08_07.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var08_07.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2008_2007Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderVar2008_2007Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2008_2007Conc);
} 

///////////////////////////// Fim da Variação 2008 e 2007 POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação 2009  E 2008 POR CONCELHOS -------------------////

var minVar2009_2008Conc = 0;
var maxVar2009_2008Conc = 0;

function CorVar2009_2008(d) {
    return d === null ? '#808080':
        d >= 6  ? '#8c0303' :
        d >= 4  ? '#de1f35' :
        d >= 2  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -4 ? '#9eaad7' :
                ''  ;
}

var legendaVar2009_2008 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2009 e 2008, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  4 a 6' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2 a 4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -3.79 a 0' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar2009_2008Conc(feature) {
    if(feature.properties.Var09_08 <= minVar2009_2008Conc || minVar2009_2008Conc ===0){
        minVar2009_2008Conc = feature.properties.Var09_08
    }
    if(feature.properties.Var09_08 > maxVar2009_2008Conc){
        maxVar2009_2008Conc = feature.properties.Var09_08 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2009_2008(feature.properties.Var09_08)};
    }


function apagarVar2009_2008Conc(e) {
    Var2009_2008Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2009_2008Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var09_08.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2009_2008Conc,
    });
}
var Var2009_2008Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2009_2008Conc,
    onEachFeature: onEachFeatureVar2009_2008Conc
});

let slideVar2009_2008Conc = function(){
    var sliderVar2009_2008Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2009_2008Conc, {
        start: [minVar2009_2008Conc, maxVar2009_2008Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2009_2008Conc,
            'max': maxVar2009_2008Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2009_2008Conc);
    inputNumberMax.setAttribute("value",maxVar2009_2008Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2009_2008Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2009_2008Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2009_2008Conc.noUiSlider.on('update',function(e){
        Var2009_2008Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var09_08.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var09_08.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2009_2008Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderVar2009_2008Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2009_2008Conc);
} 

///////////////////////////// Fim da Variação 2009 e 2008 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2010  E 2009 POR CONCELHOS -------------------////

var minVar2010_2009Conc = 0;
var maxVar2010_2009Conc = 0;

function CorVar2010_2009(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10 ? '#2288bf' :
                ''  ;
}

var legendaVar2010_2009 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2010 e 2009, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -9.58 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2010_2009Conc(feature) {
    if(feature.properties.Var10_09 <= minVar2010_2009Conc || minVar2010_2009Conc ===0){
        minVar2010_2009Conc = feature.properties.Var10_09
    }
    if(feature.properties.Var10_09 > maxVar2010_2009Conc){
        maxVar2010_2009Conc = feature.properties.Var10_09 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2010_2009(feature.properties.Var10_09)};
    }


function apagarVar2010_2009Conc(e) {
    Var2010_2009Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2010_2009Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var10_09.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2010_2009Conc,
    });
}
var Var2010_2009Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2010_2009Conc,
    onEachFeature: onEachFeatureVar2010_2009Conc
});

let slideVar2010_2009Conc = function(){
    var sliderVar2010_2009Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2010_2009Conc, {
        start: [minVar2010_2009Conc, maxVar2010_2009Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2010_2009Conc,
            'max': maxVar2010_2009Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2010_2009Conc);
    inputNumberMax.setAttribute("value",maxVar2010_2009Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2010_2009Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2010_2009Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2010_2009Conc.noUiSlider.on('update',function(e){
        Var2010_2009Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var10_09.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var10_09.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2010_2009Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderVar2010_2009Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2010_2009Conc);
} 

///////////////////////////// Fim da Variação 2010 e 2009 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2011  E 2010 POR CONCELHOS -------------------////

var minVar2011_2010Conc = 0;
var maxVar2011_2010Conc = 0;


function CorVar2011_2010(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10 ? '#2288bf' :
                ''  ;
}

var legendaVar2011_2010 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2011 e 2010, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -9.58 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}
function EstiloVar2011_2010Conc(feature) {
    if(feature.properties.Var11_10 <= minVar2011_2010Conc || minVar2011_2010Conc ===0){
        minVar2011_2010Conc = feature.properties.Var11_10
    }
    if(feature.properties.Var11_10 > maxVar2011_2010Conc){
        maxVar2011_2010Conc = feature.properties.Var11_10 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2011_2010(feature.properties.Var11_10)};
    }


function apagarVar2011_2010Conc(e) {
    Var2011_2010Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2011_2010Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_10.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2011_2010Conc,
    });
}
var Var2011_2010Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2011_2010Conc,
    onEachFeature: onEachFeatureVar2011_2010Conc
});

let slideVar2011_2010Conc = function(){
    var sliderVar2011_2010Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2011_2010Conc, {
        start: [minVar2011_2010Conc, maxVar2011_2010Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2011_2010Conc,
            'max': maxVar2011_2010Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2011_2010Conc);
    inputNumberMax.setAttribute("value",maxVar2011_2010Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2011_2010Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2011_2010Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2011_2010Conc.noUiSlider.on('update',function(e){
        Var2011_2010Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var11_10.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_10.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2011_2010Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderVar2011_2010Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2011_2010Conc);
} 

///////////////////////////// Fim da Variação 2011 e 2010 POR CONCELHOS -------------- \\\\\


/////////////////////////////------- Variação 2012  E 2011 POR CONCELHOS -------------------////

var minVar2012_2011Conc = 0;
var maxVar2012_2011Conc = 0;

function CorVar2012_2011(d) {
    return d === null ? '#808080':
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -8 ? '#2288bf' :
                ''  ;
}

var legendaVar2012_2011 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2012 e 2011, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -7.44 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2012_2011Conc(feature) {
    if(feature.properties.Var12_11 <= minVar2012_2011Conc || minVar2012_2011Conc ===0){
        minVar2012_2011Conc = feature.properties.Var12_11
    }
    if(feature.properties.Var12_11 > maxVar2012_2011Conc){
        maxVar2012_2011Conc = feature.properties.Var12_11 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2012_2011(feature.properties.Var12_11)};
    }


function apagarVar2012_2011Conc(e) {
    Var2012_2011Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2012_2011Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var12_11.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2012_2011Conc,
    });
}
var Var2012_2011Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2012_2011Conc,
    onEachFeature: onEachFeatureVar2012_2011Conc
});

let slideVar2012_2011Conc = function(){
    var sliderVar2012_2011Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2012_2011Conc, {
        start: [minVar2012_2011Conc, maxVar2012_2011Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2012_2011Conc,
            'max': maxVar2012_2011Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2012_2011Conc);
    inputNumberMax.setAttribute("value",maxVar2012_2011Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2012_2011Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2012_2011Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2012_2011Conc.noUiSlider.on('update',function(e){
        Var2012_2011Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var12_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var12_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2012_2011Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderVar2012_2011Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2012_2011Conc);
} 

///////////////////////////// Fim da Variação 2012 e 2011 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2013  E 2012 POR CONCELHOS -------------------////

var minVar2013_2012Conc = 0;
var maxVar2013_2012Conc = 0;

function CorVar2013_2012(d) {
    return d === null ? '#808080':
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9ebbd7' :
        d >= -10  ? '#2288bf' :
        d >= -15  ? '#155273' :
        d >= -25 ? '#0b2c40' :
                ''  ;
}

var legendaVar2013_2012 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2013 e 2012, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -15 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -24.25 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2013_2012Conc(feature) {
    if(feature.properties.Var13_12 <= minVar2013_2012Conc || minVar2013_2012Conc ===0){
        minVar2013_2012Conc = feature.properties.Var13_12
    }
    if(feature.properties.Var13_12 > maxVar2013_2012Conc){
        maxVar2013_2012Conc = feature.properties.Var13_12 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2013_2012(feature.properties.Var13_12)};
    }


function apagarVar2013_2012Conc(e) {
    Var2013_2012Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2013_2012Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var13_12.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2013_2012Conc,
    });
}
var Var2013_2012Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2013_2012Conc,
    onEachFeature: onEachFeatureVar2013_2012Conc
});

let slideVar2013_2012Conc = function(){
    var sliderVar2013_2012Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2013_2012Conc, {
        start: [minVar2013_2012Conc, maxVar2013_2012Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2013_2012Conc,
            'max': maxVar2013_2012Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2013_2012Conc);
    inputNumberMax.setAttribute("value",maxVar2013_2012Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2013_2012Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2013_2012Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2013_2012Conc.noUiSlider.on('update',function(e){
        Var2013_2012Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var13_12.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var13_12.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2013_2012Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderVar2013_2012Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2013_2012Conc);
} 

///////////////////////////// Fim da Variação 2013 e 2012 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2014  E 2013 POR CONCELHOS -------------------////

var minVar2014_2013Conc = 0;
var maxVar2014_2013Conc = 0;

function CorVar2014_2013(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -25  ? '#9eaad7' :
        d >= -60 ? '#2288bf' :
                ''  ;
}

var legendaVar2014_2013 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2014 e 2013, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -58.23 a -25' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar2014_2013Conc(feature) {
    if(feature.properties.Var14_13 <= minVar2014_2013Conc || minVar2014_2013Conc ===0){
        minVar2014_2013Conc = feature.properties.Var14_13
    }
    if(feature.properties.Var14_13 > maxVar2014_2013Conc){
        maxVar2014_2013Conc = feature.properties.Var14_13 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2014_2013(feature.properties.Var14_13)};
    }


function apagarVar2014_2013Conc(e) {
    Var2014_2013Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2014_2013Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var14_13.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2014_2013Conc,
    });
}
var Var2014_2013Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2014_2013Conc,
    onEachFeature: onEachFeatureVar2014_2013Conc
});

let slideVar2014_2013Conc = function(){
    var sliderVar2014_2013Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2014_2013Conc, {
        start: [minVar2014_2013Conc, maxVar2014_2013Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2014_2013Conc,
            'max': maxVar2014_2013Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2014_2013Conc);
    inputNumberMax.setAttribute("value",maxVar2014_2013Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2014_2013Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2014_2013Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2014_2013Conc.noUiSlider.on('update',function(e){
        Var2014_2013Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var14_13.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var14_13.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2014_2013Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderVar2014_2013Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2014_2013Conc);
} 

///////////////////////////// Fim da Variação 2014 e 2013 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2015  E 2014 POR CONCELHOS -------------------////

var minVar2015_2014Conc = 0;
var maxVar2015_2014Conc = 0;

function CorVar2015_2014(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -10  ? '#9eaad7' :
        d >= -22 ? '#2288bf' :
                ''  ;
}

var legendaVar2015_2014 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2015 e 2014, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -10 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -21.9 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}


function EstiloVar2015_2014Conc(feature) {
    if(feature.properties.Var15_14 <= minVar2015_2014Conc || minVar2015_2014Conc ===0){
        minVar2015_2014Conc = feature.properties.Var15_14
    }
    if(feature.properties.Var15_14 > maxVar2015_2014Conc){
        maxVar2015_2014Conc = feature.properties.Var15_14 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2015_2014(feature.properties.Var15_14)};
    }


function apagarVar2015_2014Conc(e) {
    Var2015_2014Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2015_2014Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var15_14.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2015_2014Conc,
    });
}
var Var2015_2014Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2015_2014Conc,
    onEachFeature: onEachFeatureVar2015_2014Conc
});

let slideVar2015_2014Conc = function(){
    var sliderVar2015_2014Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2015_2014Conc, {
        start: [minVar2015_2014Conc, maxVar2015_2014Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2015_2014Conc,
            'max': maxVar2015_2014Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2015_2014Conc);
    inputNumberMax.setAttribute("value",maxVar2015_2014Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2015_2014Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2015_2014Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2015_2014Conc.noUiSlider.on('update',function(e){
        Var2015_2014Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var15_14.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var15_14.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2015_2014Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderVar2015_2014Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2015_2014Conc);
} 

///////////////////////////// Fim da Variação 2015 e 2014 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2016  E 2015 POR CONCELHOS -------------------////

var minVar2016_2015Conc = 0;
var maxVar2016_2015Conc = 0;

function CorVar2016_2015(d) {
    return d === null ? '#808080':
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9ebbd7' :
        d >= -10  ? '#2288bf' :
        d >= -15  ? '#155273' :
        d >= -22 ? '#0b2c40' :
                ''  ;
}

var legendaVar2016_2015 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2016 e 2015, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9ebbd7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -15 a -10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#0b2c40"></i>' + ' -19.2 a -15' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2016_2015Conc(feature) {
    if(feature.properties.Var16_15 <= minVar2016_2015Conc || minVar2016_2015Conc ===0){
        minVar2016_2015Conc = feature.properties.Var16_15
    }
    if(feature.properties.Var16_15 > maxVar2016_2015Conc){
        maxVar2016_2015Conc = feature.properties.Var16_15 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2016_2015(feature.properties.Var16_15)};
    }


function apagarVar2016_2015Conc(e) {
    Var2016_2015Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2016_2015Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var16_15.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2016_2015Conc,
    });
}
var Var2016_2015Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2016_2015Conc,
    onEachFeature: onEachFeatureVar2016_2015Conc
});

let slideVar2016_2015Conc = function(){
    var sliderVar2016_2015Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 37){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2016_2015Conc, {
        start: [minVar2016_2015Conc, maxVar2016_2015Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2016_2015Conc,
            'max': maxVar2016_2015Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2016_2015Conc);
    inputNumberMax.setAttribute("value",maxVar2016_2015Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2016_2015Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2016_2015Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2016_2015Conc.noUiSlider.on('update',function(e){
        Var2016_2015Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var16_15.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var16_15.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2016_2015Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 37;
    sliderAtivo = sliderVar2016_2015Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2016_2015Conc);
} 

///////////////////////////// Fim da Variação 2016 e 2015 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2017  E 2016 POR CONCELHOS -------------------////

var minVar2017_2016Conc = 0;
var maxVar2017_2016Conc = 0;

function CorVar2017_2016(d) {
    return d === null ? '#808080':
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10  ? '#2288bf' :
        d >= -16 ? '#155273' :
                ''  ;
}

var legendaVar2017_2016 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2017 e 2016, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -10 a -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -15.14 a -10' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2017_2016Conc(feature) {
    if(feature.properties.Var17_16 <= minVar2017_2016Conc || minVar2017_2016Conc ===0){
        minVar2017_2016Conc = feature.properties.Var17_16
    }
    if(feature.properties.Var17_16 > maxVar2017_2016Conc){
        maxVar2017_2016Conc = feature.properties.Var17_16 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2017_2016(feature.properties.Var17_16)};
    }


function apagarVar2017_2016Conc(e) {
    Var2017_2016Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2017_2016Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var17_16.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2017_2016Conc,
    });
}
var Var2017_2016Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2017_2016Conc,
    onEachFeature: onEachFeatureVar2017_2016Conc
});

let slideVar2017_2016Conc = function(){
    var sliderVar2017_2016Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 38){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2017_2016Conc, {
        start: [minVar2017_2016Conc, maxVar2017_2016Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2017_2016Conc,
            'max': maxVar2017_2016Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2017_2016Conc);
    inputNumberMax.setAttribute("value",maxVar2017_2016Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2017_2016Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2017_2016Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2017_2016Conc.noUiSlider.on('update',function(e){
        Var2017_2016Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var17_16.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var17_16.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2017_2016Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 38;
    sliderAtivo = sliderVar2017_2016Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2017_2016Conc);
} 

///////////////////////////// Fim da Variação 2017 e 2016 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2018  E 2017 POR CONCELHOS -------------------////

var minVar2018_2017Conc = 0;
var maxVar2018_2017Conc = 0;

function CorVar2018_2017(d) {
    return d === null ? '#808080':
        d >= 10  ? '#de1f35' :
        d >= 5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -5  ? '#9eaad7' :
        d >= -10 ? '#2288bf' :
                ''  ;
}

var legendaVar2018_2017 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2018 e 2017, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  5 a 10' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -9.12 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2018_2017Conc(feature) {
    if(feature.properties.Var18_17 <= minVar2018_2017Conc || minVar2018_2017Conc ===0){
        minVar2018_2017Conc = feature.properties.Var18_17
    }
    if(feature.properties.Var18_17 > maxVar2018_2017Conc){
        maxVar2018_2017Conc = feature.properties.Var18_17 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2018_2017(feature.properties.Var18_17)};
    }


function apagarVar2018_2017Conc(e) {
    Var2018_2017Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2018_2017Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var18_17.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2018_2017Conc,
    });
}
var Var2018_2017Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2018_2017Conc,
    onEachFeature: onEachFeatureVar2018_2017Conc
});

let slideVar2018_2017Conc = function(){
    var sliderVar2018_2017Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 39){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2018_2017Conc, {
        start: [minVar2018_2017Conc, maxVar2018_2017Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2018_2017Conc,
            'max': maxVar2018_2017Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2018_2017Conc);
    inputNumberMax.setAttribute("value",maxVar2018_2017Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2018_2017Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2018_2017Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2018_2017Conc.noUiSlider.on('update',function(e){
        Var2018_2017Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var18_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var18_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2018_2017Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 39;
    sliderAtivo = sliderVar2018_2017Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2018_2017Conc);
} 

///////////////////////////// Fim da Variação 2018 e 2017 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2019  E 2018 POR CONCELHOS -------------------////

var minVar2019_2018Conc = 0;
var maxVar2019_2018Conc = 0;

function CorVar2019_2018(d) {
    return d === null ? '#808080':
        d >= 5  ? '#de1f35' :
        d >= 2.5  ? '#ff5e6e' :
        d >= 0  ? '#f5b3be' :
        d >= -2.5  ? '#9eaad7' :
        d >= -6 ? '#2288bf' :
                ''  ;
}

var legendaVar2019_2018 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2019 e 2018, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + '  > 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + '  2.5 a 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  0 a 2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + ' -2.5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -5.67 a -2.5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2019_2018Conc(feature) {
    if(feature.properties.Var19_18 <= minVar2019_2018Conc || minVar2019_2018Conc ===0){
        minVar2019_2018Conc = feature.properties.Var19_18
    }
    if(feature.properties.Var19_18 > maxVar2019_2018Conc){
        maxVar2019_2018Conc = feature.properties.Var19_18 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2019_2018(feature.properties.Var19_18)};
    }


function apagarVar2019_2018Conc(e) {
    Var2019_2018Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2019_2018Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var19_18.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2019_2018Conc,
    });
}
var Var2019_2018Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2019_2018Conc,
    onEachFeature: onEachFeatureVar2019_2018Conc
});

let slideVar2019_2018Conc = function(){
    var sliderVar2019_2018Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 40){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2019_2018Conc, {
        start: [minVar2019_2018Conc, maxVar2019_2018Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2019_2018Conc,
            'max': maxVar2019_2018Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2019_2018Conc);
    inputNumberMax.setAttribute("value",maxVar2019_2018Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2019_2018Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2019_2018Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2019_2018Conc.noUiSlider.on('update',function(e){
        Var2019_2018Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var19_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var19_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2019_2018Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 40;
    sliderAtivo = sliderVar2019_2018Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2019_2018Conc);
} 

///////////////////////////// Fim da Variação 2019 e 2018 POR CONCELHOS -------------- \\\\\

/////////////////////////////------- Variação 2020  E 2019 POR CONCELHOS -------------------////

var minVar2020_2019Conc = 0;
var maxVar2020_2019Conc = 0;

function CorVar2020_2019(d) {
    return d === null ? '#808080':
        d >= 0  ? '#f5b3be' :
        d >= -2.5  ? '#9eaad7' :
        d >= -5  ? '#2288bf' :
        d >= -10 ? '#155273' :
                ''  ;
}

var legendaVar2020_2019 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação do Crédito à habitação por habitante, entre 2020 e 2019, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#9eaad7"></i>' + '  -2.5 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#2288bf"></i>' + ' -5 a -2.5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#155273"></i>' + ' -9.74 a -5' + '<br>'
    $(symbolsContainer).css("opacity","0.8")
    
    $(legendaA).append(symbolsContainer); 
}

function EstiloVar2020_2019Conc(feature) {
    if(feature.properties.Var20_19 <= minVar2020_2019Conc || minVar2020_2019Conc ===0){
        minVar2020_2019Conc = feature.properties.Var20_19
    }
    if(feature.properties.Var20_19 > maxVar2020_2019Conc){
        maxVar2020_2019Conc = feature.properties.Var20_19 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVar2020_2019(feature.properties.Var20_19)};
    }


function apagarVar2020_2019Conc(e) {
    Var2020_2019Conc.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVar2020_2019Conc(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var20_19.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVar2020_2019Conc,
    });
}
var Var2020_2019Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloVar2020_2019Conc,
    onEachFeature: onEachFeatureVar2020_2019Conc
});

let slideVar2020_2019Conc = function(){
    var sliderVar2020_2019Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 41){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVar2020_2019Conc, {
        start: [minVar2020_2019Conc, maxVar2020_2019Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minVar2020_2019Conc,
            'max': maxVar2020_2019Conc
        },
        });
    inputNumberMin.setAttribute("value",minVar2020_2019Conc);
    inputNumberMax.setAttribute("value",maxVar2020_2019Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderVar2020_2019Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVar2020_2019Conc.noUiSlider.set([null, this.value]);
    });

    sliderVar2020_2019Conc.noUiSlider.on('update',function(e){
        Var2020_2019Conc.eachLayer(function(layer){
            if(layer.feature.properties.Var20_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var20_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVar2020_2019Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 41;
    sliderAtivo = sliderVar2020_2019Conc.noUiSlider;
    $(slidersGeral).append(sliderVar2020_2019Conc);
} 

///////////////////////////// Fim da Variação 2020 e 2019 POR CONCELHOS -------------- \\\\\




///////////////////////////////////////----------------------- FIM CONCELHOS------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\





/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = Credito2000Conc;
//// dizer qual a base (Contornos Concelhos/Freguesias) ativa
let baseAtiva = contorno;
let novaLayer = function(layer){

    if(layerAtiva != null){
		map.eachLayer(function(){
			map.removeLayer(layerAtiva);
		});
	}

    if(baseAtiva != null){2020_2019
		map.eachLayer(function(){
			map.removeLayer(baseAtiva);
		});
	} 
    if (layer == Credito2000Conc && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2000, por concelho.' + '</strong>');
        legendaPerCredito();
        slideCredito2000Conc();
        naoDuplicar = 1;
    }
    if (layer == Credito2000Conc && naoDuplicar == 1){
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2000, por concelho.' + '</strong>');
    }
    if (layer == Credito2001Conc && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2001, por concelho.' + '</strong>');
        legendaPerCredito();
        slideCredito2001Conc();
        naoDuplicar = 2;
    }
    if (layer == Credito2002Conc && naoDuplicar != 3){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2002, por concelho.' + '</strong>');;
        slideCredito2002Conc();
        naoDuplicar = 3;
    }
    if (layer == Credito2003Conc && naoDuplicar != 4){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2003, por concelho.' + '</strong>');
        slideCredito2003Conc();
        naoDuplicar = 4;
    }
    if (layer == Credito2004Conc && naoDuplicar != 5){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2004, por concelho.' + '</strong>');
        slideCredito2004Conc();
        naoDuplicar = 5;
    }
    if (layer == Credito2005Conc && naoDuplicar != 6){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2005, por concelho.' + '</strong>');
        slideCredito2005Conc();
        naoDuplicar = 6;
    }
    if (layer == Credito2006Conc && naoDuplicar != 7){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2006, por concelho.' + '</strong>');
        slideCredito2006Conc();
        naoDuplicar = 7;
    }
    if (layer == Credito2007Conc && naoDuplicar != 8){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2007, por concelho.' + '</strong>');
        slideCredito2007Conc();
        naoDuplicar = 8;
    }
    if (layer == Credito2008Conc && naoDuplicar != 9){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2008, por concelho.' + '</strong>');
        slideCredito2008Conc();
        naoDuplicar = 9;
    }
    if (layer == Credito2009Conc && naoDuplicar != 10){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2009, por concelho.' + '</strong>');
        slideCredito2009Conc();
        naoDuplicar = 10;
    }
    if (layer == Credito2010Conc && naoDuplicar != 11){
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2010, por concelho.' + '</strong>');
        legendaPerCredito();
        slideCredito2010Conc();
        naoDuplicar = 11;
    }
    if (layer == Credito2011Conc && naoDuplicar != 12){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2011, por concelho.' + '</strong>');
        slideCredito2011Conc();
        naoDuplicar = 12;
    }
    if (layer == Credito2012Conc && naoDuplicar != 13){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2012, por concelho.' + '</strong>');
        slideCredito2012Conc();
        naoDuplicar = 13;
    }
    if (layer == Credito2013Conc && naoDuplicar != 14){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2013, por concelho.' + '</strong>');
        slideCredito2013Conc();
        naoDuplicar = 14;
    }
    if (layer == Credito2014Conc && naoDuplicar != 15){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2014, por concelho.' + '</strong>');
        slideCredito2014Conc();
        naoDuplicar = 15;
    }
    if (layer == Credito2015Conc && naoDuplicar != 16){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2015, por concelho.' + '</strong>');
        slideCredito2015Conc();
        naoDuplicar = 16;
    }
    if (layer == Credito2016Conc && naoDuplicar != 17){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2016, por concelho.' + '</strong>');
        slideCredito2016Conc();
        naoDuplicar = 17;
    }
    if (layer == Credito2017Conc && naoDuplicar != 18){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2017, por concelho.' + '</strong>');
        slideCredito2017Conc();
        naoDuplicar = 18;
    }
    if (layer == Credito2018Conc && naoDuplicar != 19){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2018, por concelho.' + '</strong>');
        slideCredito2018Conc();
        naoDuplicar = 19;
    }
    if (layer == Credito2019Conc && naoDuplicar != 20){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2019, por concelho.' + '</strong>');
        slideCredito2019Conc();
        naoDuplicar = 20;
    }
        if (layer == Credito2020Conc && naoDuplicar != 21){
        legendaPerCredito();
        $('#tituloMapa').html(' <strong>' + 'Crédito à habitação por habitante, em 2020, por concelho.' + '</strong>');
        slideCredito2020Conc();
        naoDuplicar = 21;
    }
    if (layer == Var2001_2000Conc && naoDuplicar != 22){
        legendaVar2001_2000();
        slideVar2001_2000Conc();
        naoDuplicar = 22;
    }
    if (layer == Var2002_2001Conc && naoDuplicar != 23){
        legendaVar2002_2001();
        slideVar2002_2001Conc();
        naoDuplicar = 23;
    }
    if (layer == Var2003_2002Conc && naoDuplicar != 24){
        legendaVar2003_2002();
        slideVar2003_2002Conc();
        naoDuplicar = 24;
    }
    if (layer == Var2004_2003Conc && naoDuplicar != 25){
        legendaVar2004_2003();
        slideVar2004_2003Conc();
        naoDuplicar = 25;
    }
    if (layer == Var2005_2004Conc && naoDuplicar != 26){
        legendaVar2005_2004();
        slideVar2005_2004Conc();
        naoDuplicar = 26;
    }
    if (layer == Var2006_2005Conc && naoDuplicar != 27){
        legendaVar2006_2005();
        slideVar2006_2005Conc();
        naoDuplicar = 27;
    }
    if (layer == Var2007_2006Conc && naoDuplicar != 28){
        legendaVar2007_2006();
        slideVar2007_2006Conc();
        naoDuplicar = 28;
    }
    if (layer == Var2008_2007Conc && naoDuplicar != 29){
        legendaVar2008_2007();
        slideVar2008_2007Conc();
        naoDuplicar = 29;
    }
    if (layer == Var2009_2008Conc && naoDuplicar != 30){
        legendaVar2009_2008();
        slideVar2009_2008Conc();
        naoDuplicar = 30;
    }
    if (layer == Var2010_2009Conc && naoDuplicar != 31){
        legendaVar2010_2009();
        slideVar2010_2009Conc();
        naoDuplicar = 31;
    }
    if (layer == Var2011_2010Conc && naoDuplicar != 32){
        legendaVar2011_2010();
        slideVar2011_2010Conc();
        naoDuplicar = 32;
    }
    if (layer == Var2012_2011Conc && naoDuplicar != 33){
        legendaVar2012_2011();
        slideVar2012_2011Conc();
        naoDuplicar = 33;
    }
    if (layer == Var2013_2012Conc && naoDuplicar != 34){
        legendaVar2013_2012();
        slideVar2013_2012Conc();
        naoDuplicar = 34;
    }
    if (layer == Var2014_2013Conc && naoDuplicar != 35){
        legendaVar2014_2013();
        slideVar2014_2013Conc();
        naoDuplicar = 35;
    }
    if (layer == Var2015_2014Conc && naoDuplicar != 36){
        legendaVar2015_2014();
        slideVar2015_2014Conc();
        naoDuplicar = 36;
    }
    if (layer == Var2016_2015Conc && naoDuplicar != 37){
        legendaVar2016_2015();
        slideVar2016_2015Conc();
        naoDuplicar = 37;
    }
    if (layer == Var2017_2016Conc && naoDuplicar != 38){
        legendaVar2017_2016();
        slideVar2017_2016Conc();
        naoDuplicar = 38;
    }
    if (layer == Var2018_2017Conc && naoDuplicar != 39){
        legendaVar2018_2017();
        slideVar2018_2017Conc();
        naoDuplicar = 39;
    }
    if (layer == Var2019_2018Conc && naoDuplicar != 40){
        legendaVar2019_2018();
        slideVar2019_2018Conc();
        naoDuplicar = 40;
    }
    if (layer == Var2020_2019Conc && naoDuplicar != 41){
        legendaVar2020_2019();
        slideVar2020_2019Conc();
        naoDuplicar = 41;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}

function myFunction() {
    var ano = document.getElementById("mySelect").value
    if ($('#concelho').hasClass('active2')){
        if ($('#percentagem').hasClass('active4')){
            if (ano == "2000"){
                novaLayer(Credito2000Conc)
            }
            if (ano == "2001"){
                novaLayer(Credito2001Conc)
            }
            if (ano == "2002"){
                novaLayer(Credito2002Conc)
            }
            if (ano == "2003"){
                novaLayer(Credito2003Conc)
            }
            if (ano == "2004"){
                novaLayer(Credito2004Conc)
            }
            if (ano == "2005"){
                novaLayer(Credito2005Conc)
            }
            if (ano == "2006"){
                novaLayer(Credito2006Conc)
            }
            if (ano == "2007"){
                novaLayer(Credito2007Conc)
            }
            if (ano == "2008"){
                novaLayer(Credito2008Conc)
            }
            if (ano == "2009"){
                novaLayer(Credito2009Conc)
            }
            if (ano == "2010"){
                novaLayer(Credito2010Conc)
            }
            if (ano == "2011"){
                novaLayer(Credito2011Conc)
            }
            if (ano == "2012"){
                novaLayer(Credito2012Conc)
            }
            if (ano == "2013"){
                novaLayer(Credito2013Conc)
            }
            if (ano == "2014"){
                novaLayer(Credito2014Conc)
            }
            if (ano == "2015"){
                novaLayer(Credito2015Conc)
            }
            if (ano == "2016"){
                novaLayer(Credito2016Conc)
            }
            if (ano == "2017"){
                novaLayer(Credito2017Conc)
            }
            if (ano == "2018"){
                novaLayer(Credito2018Conc)
            }
            if (ano == "2019"){
                novaLayer(Credito2019Conc)
            }
            if (ano == "2020"){
                novaLayer(Credito2020Conc)
            }
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if (ano == "2001"){
                novaLayer(Var2001_2000Conc)
            }
            if (ano == "2002"){
                novaLayer(Var2002_2001Conc)
            }
            if (ano == "2003"){
                novaLayer(Var2003_2002Conc)
            }
            if (ano == "2004"){
                novaLayer(Var2004_2003Conc)
            }
            if (ano == "2005"){
                novaLayer(Var2005_2004Conc)
            }
            if (ano == "2006"){
                novaLayer(Var2006_2005Conc)
            }
            if (ano == "2007"){
                novaLayer(Var2007_2006Conc)
            }
            if (ano == "2008"){
                novaLayer(Var2008_2007Conc)
            }
            if (ano == "2009"){
                novaLayer(Var2009_2008Conc)
            }
            if (ano == "2010"){
                novaLayer(Var2010_2009Conc)
            }
            if (ano == "2011"){
                novaLayer(Var2011_2010Conc)
            }
            if (ano == "2012"){
                novaLayer(Var2012_2011Conc)
            }
            if (ano == "2013"){
                novaLayer(Var2013_2012Conc)
            }
            if (ano == "2014"){
                novaLayer(Var2014_2013Conc)
            }
            if (ano == "2015"){
                novaLayer(Var2015_2014Conc)
            }
            if (ano == "2016"){
                novaLayer(Var2016_2015Conc)
            }
            if (ano == "2017"){
                novaLayer(Var2017_2016Conc)
            }
            if (ano == "2018"){
                novaLayer(Var2018_2017Conc)
            }
            if (ano == "2019"){
                novaLayer(Var2019_2018Conc)
            }
            if (ano == "2020"){
                novaLayer(Var2020_2019Conc)
            }
        }
    }
}


let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Estatísticas das instituições de crédito e sociedades financeiras.' );
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Estatísticas das instituições de crédito e sociedades financeiras.' );
    }
}
function mudarEscala(){
    reporAnos();
    tamanhoOutros();
    fonteTitulo('N');
}
let primeirovalor = function(trismestre, ano){
    $("#anos").val(ano);
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
let reporAnos = function(){
    $('#mySelect').empty();
    if ($('#percentagem').hasClass('active4')){
        $('#mySelect').append("<option value='2000'>2000</option>");
        $('#mySelect').append("<option value='2001'>2001</option>");
        $('#mySelect').append("<option value='2002'>2002</option>");
        $('#mySelect').append("<option value='2003'>2003</option>");
        $('#mySelect').append("<option value='2004'>2004</option>");
        $('#mySelect').append("<option value='2005'>2005</option>");
        $('#mySelect').append("<option value='2006'>2006</option>");
        $('#mySelect').append("<option value='2007'>2007</option>");
        $('#mySelect').append("<option value='2008'>2008</option>");
        $('#mySelect').append("<option value='2009'>2009</option>");
        $('#mySelect').append("<option value='2010'>2010</option>");
        $('#mySelect').append("<option value='2011'>2011</option>");
        $('#mySelect').append("<option value='2012'>2012</option>");
        $('#mySelect').append("<option value='2013'>2013</option>");
        $('#mySelect').append("<option value='2014'>2014</option>");
        $('#mySelect').append("<option value='2015'>2015</option>");
        $('#mySelect').append("<option value='2016'>2016</option>");
        $('#mySelect').append("<option value='2017'>2017</option>");
        $('#mySelect').append("<option value='2018'>2018</option>");
        $('#mySelect').append("<option value='2019'>2019</option>");
        $('#mySelect').append("<option value='2020'>2020</option>");
        primeirovalor('2000');
    }
    if ($('#taxaVariacao').hasClass('active4')){
        $('#mySelect').append("<option value='2001'>2001 - 2000</option>");
        $('#mySelect').append("<option value='2002'>2002 - 2001</option>");
        $('#mySelect').append("<option value='2003'>2003 - 2002</option>");
        $('#mySelect').append("<option value='2004'>2004 - 2003</option>");
        $('#mySelect').append("<option value='2005'>2005 - 2004</option>");
        $('#mySelect').append("<option value='2006'>2006 - 2005</option>");
        $('#mySelect').append("<option value='2007'>2007 - 2006</option>");
        $('#mySelect').append("<option value='2008'>2008 - 2007</option>");
        $('#mySelect').append("<option value='2009'>2009 - 2008</option>");
        $('#mySelect').append("<option value='2010'>2010 - 2009</option>");
        $('#mySelect').append("<option value='2011'>2011 - 2010</option>");
        $('#mySelect').append("<option value='2012'>2012 - 2011</option>");
        $('#mySelect').append("<option value='2013'>2013 - 2012</option>");
        $('#mySelect').append("<option value='2014'>2014 - 2013</option>");
        $('#mySelect').append("<option value='2015'>2015 - 2014</option>");
        $('#mySelect').append("<option value='2016'>2016 - 2015</option>");
        $('#mySelect').append("<option value='2017'>2017 - 2016</option>");
        $('#mySelect').append("<option value='2018'>2018 - 2017</option>");
        $('#mySelect').append("<option value='2019'>2019 - 2018</option>");
        $('#mySelect').append("<option value='2020'>2020 - 2019</option>");
        primeirovalor("2001");
    }
}

$('#percentagem').click(function(){
    mudarEscala();
});
$('#taxaVariacao').click(function(){
    mudarEscala();
    fonteTitulo('N');

});
;
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
    $('#tituloMapa').html('Crédito à habitação por habitante, entre 2001 e 2020, €.');
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/CreditoProv.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $('#2000').html("2000")
        $.each(data, function(key, value){
            dados += '<tr>';
            if(containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Credito+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2000+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2001+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2002+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2003+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2004+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2005+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2006+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2007+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2008+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2009+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2010+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2011+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2012+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2013+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2014+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2015+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2016+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2017+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2018+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2019+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.Dados2020+'</td>';

            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td>'+value.Credito+'</td>';
                dados += '<td>'+value.Dados2000+'</td>';
                dados += '<td>'+value.Dados2001+'</td>';
                dados += '<td>'+value.Dados2002+'</td>';
                dados += '<td>'+value.Dados2003+'</td>';
                dados += '<td>'+value.Dados2004+'</td>';
                dados += '<td>'+value.Dados2005+'</td>';
                dados += '<td>'+value.Dados2006+'</td>';
                dados += '<td>'+value.Dados2007+'</td>';
                dados += '<td>'+value.Dados2008+'</td>';
                dados += '<td>'+value.Dados2009+'</td>';
                dados += '<td>'+value.Dados2010+'</td>';
                dados += '<td>'+value.Dados2011+'</td>';
                dados += '<td>'+value.Dados2012+'</td>';
                dados += '<td>'+value.Dados2013+'</td>';
                dados += '<td>'+value.Dados2014+'</td>';
                dados += '<td>'+value.Dados2015+'</td>';
                dados += '<td>'+value.Dados2016+'</td>';
                dados += '<td>'+value.Dados2017+'</td>';
                dados += '<td>'+value.Dados2018+'</td>';
                dados += '<td>'+value.Dados2019+'</td>';
                dados += '<td>'+value.Dados2020+'</td>';
                dados += '<tr>';
            }
            dados += '<tr>';
        })
    $('#juntarValores').append(dados);   
    });
})};

$('#tabelaVariacao').click(function(){  
    $('#tituloMapa').html('Variação do crédito à habitação por habitante, entre 2000 e 2020, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/CreditoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#2000').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Credito+'</td>';
                    dados += '<td class="borderbottom bordertop">'+ ''+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao0100+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao0201+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao0302+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao0403+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao0504+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao0605+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao0706+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao0807+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao0908+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao1009+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao1110+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao1211+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao1312+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao1413+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao1514+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao1615+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao1716+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao1817+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao1918+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Variacao2019+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Credito+'</td>';
                    dados += '<td>'+ ''+'</td>';
                    dados += '<td>'+value.Variacao0100+'</td>';
                    dados += '<td>'+value.Variacao0201+'</td>';
                    dados += '<td>'+value.Variacao0302+'</td>';
                    dados += '<td>'+value.Variacao0403+'</td>';
                    dados += '<td>'+value.Variacao0504+'</td>';
                    dados += '<td>'+value.Variacao0605+'</td>';
                    dados += '<td>'+value.Variacao0706+'</td>';
                    dados += '<td>'+value.Variacao0807+'</td>';
                    dados += '<td>'+value.Variacao0908+'</td>';
                    dados += '<td>'+value.Variacao1009+'</td>';
                    dados += '<td>'+value.Variacao1110+'</td>';
                    dados += '<td>'+value.Variacao1211+'</td>';
                    dados += '<td>'+value.Variacao1312+'</td>';
                    dados += '<td>'+value.Variacao1413+'</td>';
                    dados += '<td>'+value.Variacao1514+'</td>';
                    dados += '<td>'+value.Variacao1615+'</td>';
                    dados += '<td>'+value.Variacao1716+'</td>';
                    dados += '<td>'+value.Variacao1817+'</td>';
                    dados += '<td>'+value.Variacao1918+'</td>';
                    dados += '<td>'+value.Variacao2019+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})});

let anosSelecionados = function() {
    let anos = document.getElementById("mySelect").value;

    if ($('#concelho').hasClass("active2")){
            if (anos != "2020"){
                i = 1 ;
            }
            if (anos == "2020"){
                i = $('#mySelect').children('option').length - 1 ;
            }
            if ($('#taxaVariacao').hasClass('active4')){
                if (anos == "2001"){
                    i = 0;
                }
            }
            if ($('#percentagem').hasClass('active4')){
                if (anos == "2000"){
                    i = 0;
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
