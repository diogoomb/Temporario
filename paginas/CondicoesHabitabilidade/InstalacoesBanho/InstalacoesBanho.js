
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'


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
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}

///////////////////////////----------------------- DADOS RELATIVOS, CONCELHO--------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------- Alojamentos sem instalações de banho por Concelho em 1991-----////////////////////////

var minInstalacoesBanhoConc91 = 99;
var maxInstalacoesBanhoConc91 = 0;

function CorPerInstalacoesBanhoConc(d) {
    return  d == 0.00 ? '#000000 ' :
        d >= 30.08 ? '#bf0404 ' :
        d >= 25.21  ? '#c71d1c' :
        d >= 17.1 ? '#d44846' :
        d >= 8.98   ? '#e06f6c' :
        d >= 0.86   ? '#f1aaa6 ' :
                ''  ;
}
var legendaPerInstalacoesBanhoConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#bf0404 "></i>' + ' > 30.08' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#c71d1c"></i>' + ' 25.21 - 30.08' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d44846"></i>' + ' 17.1 - 25.21' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#e06f6c"></i>' + ' 8.98 - 17.1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6"></i>' + ' 0.86 - 8.98' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function EstiloInstalacoesBanhoConc91(feature) {
    if( feature.properties.IstBanho91 <= minInstalacoesBanhoConc91 || feature.properties.IstBanho91 === 0){
        minInstalacoesBanhoConc91 = feature.properties.IstBanho91
    }
    if(feature.properties.IstBanho91 >= maxInstalacoesBanhoConc91 ){
        maxInstalacoesBanhoConc91 = feature.properties.IstBanho91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInstalacoesBanhoConc(feature.properties.IstBanho91)
    };
}
function apagarInstalacoesBanhoConc91(e) {
    InstalacoesBanhoConc91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureInstalacoesBanhoConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Alojamentos sem instalações de banho: ' + '<b>' + feature.properties.IstBanho91.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarInstalacoesBanhoConc91,
    });
}
var InstalacoesBanhoConc91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloInstalacoesBanhoConc91,
    onEachFeature: onEachFeatureInstalacoesBanhoConc91
});
let slideInstalacoesBanhoConc91 = function(){
    var sliderInstalacoesBanhoConc91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderInstalacoesBanhoConc91, {
        start: [minInstalacoesBanhoConc91, maxInstalacoesBanhoConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minInstalacoesBanhoConc91,
            'max': maxInstalacoesBanhoConc91
        },
        });
    inputNumberMin.setAttribute("value",minInstalacoesBanhoConc91);
    inputNumberMax.setAttribute("value",maxInstalacoesBanhoConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderInstalacoesBanhoConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderInstalacoesBanhoConc91.noUiSlider.set([null, this.value]);
    });

    sliderInstalacoesBanhoConc91.noUiSlider.on('update',function(e){
        InstalacoesBanhoConc91.eachLayer(function(layer){
            if(layer.feature.properties.IstBanho91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.IstBanho91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderInstalacoesBanhoConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderInstalacoesBanhoConc91.noUiSlider;
    $(slidersGeral).append(sliderInstalacoesBanhoConc91);
} 
InstalacoesBanhoConc91.addTo(map);
$('#tituloMapa').css('font-size','9pt')
$('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem instalações de banho, em 1991, por concelho.' + '</strong>');
legendaPerInstalacoesBanhoConc();
slideInstalacoesBanhoConc91();
/////////////////////////////////// ---------Fim de Alojamentos sem instalações de banho EM 1991 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

/////////////////////--------------------------- Alojamentos sem instalações de banho EM 2001 POR CONCELHO-----////////////////////////

var minInstalacoesBanhoConc01 = 99;
var maxInstalacoesBanhoConc01 = 0;

function EstiloInstalacoesBanhoConc01(feature) {
    if( feature.properties.IstBanho01 <= minInstalacoesBanhoConc01 || feature.properties.IstBanho01 === 0){
        minInstalacoesBanhoConc01 = feature.properties.IstBanho01
    }
    if(feature.properties.IstBanho01 >= maxInstalacoesBanhoConc01 ){
        maxInstalacoesBanhoConc01 = feature.properties.IstBanho01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInstalacoesBanhoConc(feature.properties.IstBanho01)
    };
}
function apagarInstalacoesBanhoConc01(e) {
    InstalacoesBanhoConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureInstalacoesBanhoConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem instalações de banho: ' + '<b>' + feature.properties.IstBanho01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarInstalacoesBanhoConc01,
    });
}
var InstalacoesBanhoConc01= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloInstalacoesBanhoConc01,
    onEachFeature: onEachFeatureInstalacoesBanhoConc01
});
let slideInstalacoesBanhoConc01 = function(){
    var sliderInstalacoesBanhoConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderInstalacoesBanhoConc01, {
        start: [minInstalacoesBanhoConc01, maxInstalacoesBanhoConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minInstalacoesBanhoConc01,
            'max': maxInstalacoesBanhoConc01
        },
        });
    inputNumberMin.setAttribute("value",minInstalacoesBanhoConc01);
    inputNumberMax.setAttribute("value",maxInstalacoesBanhoConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderInstalacoesBanhoConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderInstalacoesBanhoConc01.noUiSlider.set([null, this.value]);
    });

    sliderInstalacoesBanhoConc01.noUiSlider.on('update',function(e){
        InstalacoesBanhoConc01.eachLayer(function(layer){
            if(layer.feature.properties.IstBanho01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.IstBanho01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderInstalacoesBanhoConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderInstalacoesBanhoConc01.noUiSlider;
    $(slidersGeral).append(sliderInstalacoesBanhoConc01);
}


/////////////////////////////////// Fim Alojamentos sem instalações de banho EM 2001 POR CONCELHO -------------- \\\\\\

/////////////////////------------------- Alojamentos sem instalações de banho EM 2011 POR CONCELHO-----//\\\\\\\\//////////////////////

var minInstalacoesBanhoConc11 = 99;
var maxInstalacoesBanhoConc11 = 0;

function EstiloInstalacoesBanhoConc11(feature) {
    if( feature.properties.IstBanho11 <= minInstalacoesBanhoConc11 || feature.properties.IstBanho11 === 0){
        minInstalacoesBanhoConc11 = feature.properties.IstBanho11
    }
    if(feature.properties.IstBanho11 >= maxInstalacoesBanhoConc11 ){
        maxInstalacoesBanhoConc11 = feature.properties.IstBanho11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInstalacoesBanhoConc(feature.properties.IstBanho11)
    };
}
function apagarInstalacoesBanhoConc11(e) {
    InstalacoesBanhoConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureInstalacoesBanhoConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem instalações de banho: ' + '<b>' + feature.properties.IstBanho11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarInstalacoesBanhoConc11,
    });
}
var InstalacoesBanhoConc11= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloInstalacoesBanhoConc11,
    onEachFeature: onEachFeatureInstalacoesBanhoConc11
});
let slideInstalacoesBanhoConc11 = function(){
    var sliderInstalacoesBanhoConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderInstalacoesBanhoConc11, {
        start: [minInstalacoesBanhoConc11, maxInstalacoesBanhoConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minInstalacoesBanhoConc11,
            'max': maxInstalacoesBanhoConc11
        },
        });
    inputNumberMin.setAttribute("value",minInstalacoesBanhoConc11);
    inputNumberMax.setAttribute("value",maxInstalacoesBanhoConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderInstalacoesBanhoConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderInstalacoesBanhoConc11.noUiSlider.set([null, this.value]);
    });

    sliderInstalacoesBanhoConc11.noUiSlider.on('update',function(e){
        InstalacoesBanhoConc11.eachLayer(function(layer){
            if(layer.feature.properties.IstBanho11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.IstBanho11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderInstalacoesBanhoConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderInstalacoesBanhoConc11.noUiSlider;
    $(slidersGeral).append(sliderInstalacoesBanhoConc11);
} 

/////////////////////////////////// Fim Alojamentos sem instalações de banho 2011 Concelho -------------- \\\\\\


/////////////////////////---------------------- DADOS RELATIVOS, FREGUESIAS -------------------\\\\\\\\\\\\\\\\\\


/////////////////////------------------- Alojamentos sem instalações de banho EM 2001 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minInstalacoesBanhoFreg01 = 99;
var maxInstalacoesBanhoFreg01 = 0;

function CorPerInstalacoesBanhoFreg(d) {
    return  d == 0.00 ? '#000000 ' :
        d >= 46.05 ? '#bf0404 ' :
        d >= 38.47  ? '#c71d1c' :
        d >= 25.83 ? '#d44846' :
        d >= 13.19   ? '#e06f6c' :
        d >= 0.55   ? '#f1aaa6 ' :
                ''  ;
}
var legendaPerInstalacoesBanhoFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#bf0404 "></i>' + ' > 46.05' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#c71d1c"></i>' + ' 38.47 - 46.05' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d44846"></i>' + ' 25.83 - 38.47' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#e06f6c"></i>' + ' 13.19 - 25.83' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6"></i>' + ' 0.55 - 13.19' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloInstalacoesBanhoFreg01(feature) {
    if( feature.properties.IstBanho01 <= minInstalacoesBanhoFreg01 || feature.properties.IstBanho01 === 0){
        minInstalacoesBanhoFreg01 = feature.properties.IstBanho01
    }
    if(feature.properties.IstBanho01 >= maxInstalacoesBanhoFreg01 ){
        maxInstalacoesBanhoFreg01 = feature.properties.IstBanho01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInstalacoesBanhoFreg(feature.properties.IstBanho01)
    };
}
function apagarInstalacoesBanhoFreg01(e) {
    InstalacoesBanhoFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureInstalacoesBanhoFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos sem instalações de banho: ' + '<b>' + feature.properties.IstBanho01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarInstalacoesBanhoFreg01,
    });
}
var InstalacoesBanhoFreg01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloInstalacoesBanhoFreg01,
    onEachFeature: onEachFeatureInstalacoesBanhoFreg01
});
let slideInstalacoesBanhoFreg01 = function(){
    var sliderInstalacoesBanhoFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderInstalacoesBanhoFreg01, {
        start: [minInstalacoesBanhoFreg01, maxInstalacoesBanhoFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minInstalacoesBanhoFreg01,
            'max': maxInstalacoesBanhoFreg01
        },
        });
    inputNumberMin.setAttribute("value",minInstalacoesBanhoFreg01);
    inputNumberMax.setAttribute("value",maxInstalacoesBanhoFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderInstalacoesBanhoFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderInstalacoesBanhoFreg01.noUiSlider.set([null, this.value]);
    });

    sliderInstalacoesBanhoFreg01.noUiSlider.on('update',function(e){
        InstalacoesBanhoFreg01.eachLayer(function(layer){
            if(layer.feature.properties.IstBanho01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.IstBanho01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderInstalacoesBanhoFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderInstalacoesBanhoFreg01.noUiSlider;
    $(slidersGeral).append(sliderInstalacoesBanhoFreg01);
} 

 
//////////////////////--------- Fim Alojamentos sem instalações de banho POR FREGUESIAS EM 2001 -------------- \\\\\\

/////////////////////-------------------Alojamentos sem instalações de banho EM 2011 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minInstalacoesBanhoFreg11 = 99;
var maxInstalacoesBanhoFreg11 = 0;


function EstiloInstalacoesBanhoFreg11(feature) {
    if( feature.properties.IstBanho11 <= minInstalacoesBanhoFreg11 || feature.properties.IstBanho11 === 0){
        minInstalacoesBanhoFreg11 = feature.properties.IstBanho11
    }
    if(feature.properties.IstBanho11 >= maxInstalacoesBanhoFreg11 ){
        maxInstalacoesBanhoFreg11 = feature.properties.IstBanho11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInstalacoesBanhoFreg(feature.properties.IstBanho11)
    };
}
function apagarInstalacoesBanhoFreg11(e) {
    InstalacoesBanhoFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureInstalacoesBanhoFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos sem instalações de banho: ' + '<b>' + feature.properties.IstBanho11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarInstalacoesBanhoFreg11,
    });
}
var InstalacoesBanhoFreg11= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloInstalacoesBanhoFreg11,
    onEachFeature: onEachFeatureInstalacoesBanhoFreg11
});
let slideInstalacoesBanhoFreg11 = function(){
    var sliderInstalacoesBanhoFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderInstalacoesBanhoFreg11, {
        start: [minInstalacoesBanhoFreg11, maxInstalacoesBanhoFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minInstalacoesBanhoFreg11,
            'max': maxInstalacoesBanhoFreg11
        },
        });
    inputNumberMin.setAttribute("value",minInstalacoesBanhoFreg11);
    inputNumberMax.setAttribute("value",maxInstalacoesBanhoFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderInstalacoesBanhoFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderInstalacoesBanhoFreg11.noUiSlider.set([null, this.value]);
    });

    sliderInstalacoesBanhoFreg11.noUiSlider.on('update',function(e){
        InstalacoesBanhoFreg11.eachLayer(function(layer){
            if(layer.feature.properties.IstBanho11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.IstBanho11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderInstalacoesBanhoFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderInstalacoesBanhoFreg11.noUiSlider;
    $(slidersGeral).append(sliderInstalacoesBanhoFreg11);
} 

 
//////////////////////--------- Fim Alojamentos sem instalações de banho POR FREGUESIAS EM 2011 -------------- \\\\\\

///////////////////////////--------------------------- VARIAÇÕES CONCELHOS ------------\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação Alojamentos sem instalações de banho POR  CONCELHOS ENTRE 2001 E 1991 -------------------////


function CorVarInstalacoesBanho01_91Conc(d) {
    return d == null ? '#000000' :
        d >= -50 ? '#82c065' :
        d >= -60   ? '#60a74b' :
        d >= -70.35   ? '#459436' :
                ''  ;
}
var legendaVarInstalacoesBanho01_91Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos familiares de residência habitual sem instalações de banho, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#82c065 "></i>' + '  > -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -60 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#459436 "></i>' + ' -70.34 a -60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

var minVarInstalacoesBanhoConc01_91 = -99;
var maxVarInstalacoesBanhoConc01_91 = 0;

function EstiloVarInstalacoesBanhoConc01_91(feature) {
    if(feature.properties.Var01_91 <= maxVarInstalacoesBanhoConc01_91 && feature.properties.Var01_91 != null ){
        maxVarInstalacoesBanhoConc01_91 = feature.properties.Var01_91
    }
    if (feature.properties.Var01_91 >= minVarInstalacoesBanhoConc01_91 && feature.properties.Var01_91 != null ){
        minVarInstalacoesBanhoConc01_91 = feature.properties.Var01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarInstalacoesBanho01_91Conc(feature.properties.Var01_91)};
    }


function apagarVarInstalacoesBanhoConc01_91(e) {
    VarInstalacoesBanhoConc01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarInstalacoesBanhoConc01_91(feature, layer) {
    if(feature.properties.Var01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var01_91.toFixed(2) + '</b>' + '%').openPopup()
    }    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarInstalacoesBanhoConc01_91,
    });
}
var VarInstalacoesBanhoConc01_91= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloVarInstalacoesBanhoConc01_91,
    onEachFeature: onEachFeatureVarInstalacoesBanhoConc01_91
});

let slideVarInstalacoesBanhoConc01_91 = function(){
    var sliderVarInstalacoesBanhoConc01_91 = document.querySelector('.sliderAtivo');

    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarInstalacoesBanhoConc01_91, {
        start: [maxVarInstalacoesBanhoConc01_91, minVarInstalacoesBanhoConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': maxVarInstalacoesBanhoConc01_91,
            'max': minVarInstalacoesBanhoConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarInstalacoesBanhoConc01_91);
    inputNumberMax.setAttribute("value",maxVarInstalacoesBanhoConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarInstalacoesBanhoConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarInstalacoesBanhoConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarInstalacoesBanhoConc01_91.noUiSlider.on('update',function(e){
        VarInstalacoesBanhoConc01_91.eachLayer(function(layer){
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
        sliderVarInstalacoesBanhoConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderVarInstalacoesBanhoConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVarInstalacoesBanhoConc01_91);
} 

///////////////////////////// Fim da Variação Alojamentos sem instalações de banho POR  CONCELHOS ENTRE 2001 E 1991 -------------- \\\\\

/////////////////////////////------- Variação Alojamentos sem instalações de banho POR  CONCELHOS ENTRE 2011 E 2001 -------------------////

var minVarInstalacoesBanhoConc11_01 = -99;
var maxVarInstalacoesBanhoConc11_01 = 0;

function CorVarInstalacoesBanho11_01Conc(d) {
    return d == null ? '#000000' :
        d >= -60   ? '#60a74b' :
        d >= -70.22   ? '#459436' :
                ''  ;
}
var legendaVarInstalacoesBanho11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos familiares de residência habitual sem instalações de banho, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -60 a -56.45' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#459436"></i>' + ' -70.21 a -60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloVarInstalacoesBanhoConc11_01(feature) {
    if(feature.properties.Var11_01 <= maxVarInstalacoesBanhoConc11_01 && feature.properties.Var11_01 != null){
        maxVarInstalacoesBanhoConc11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 >= minVarInstalacoesBanhoConc11_01 && feature.properties.Var11_01 != null){
        minVarInstalacoesBanhoConc11_01 = feature.properties.Var11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarInstalacoesBanho11_01Conc(feature.properties.Var11_01)};
    }


function apagarVarInstalacoesBanhoConc11_01(e) {
    VarInstalacoesBanhoConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarInstalacoesBanhoConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarInstalacoesBanhoConc11_01,
    });
}
var VarInstalacoesBanhoConc11_01= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloVarInstalacoesBanhoConc11_01,
    onEachFeature: onEachFeatureVarInstalacoesBanhoConc11_01
});

let slideVarInstalacoesBanhoConc11_01 = function(){
    var sliderVarInstalacoesBanhoConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarInstalacoesBanhoConc11_01, {
        start: [maxVarInstalacoesBanhoConc11_01, minVarInstalacoesBanhoConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': maxVarInstalacoesBanhoConc11_01,
            'max': minVarInstalacoesBanhoConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarInstalacoesBanhoConc11_01);
    inputNumberMax.setAttribute("value",maxVarInstalacoesBanhoConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarInstalacoesBanhoConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarInstalacoesBanhoConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarInstalacoesBanhoConc11_01.noUiSlider.on('update',function(e){
        VarInstalacoesBanhoConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarInstalacoesBanhoConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderVarInstalacoesBanhoConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarInstalacoesBanhoConc11_01);
} 

///////////////////////////// Fim da Variação Alojamentos sem instalações de banho POR  CONCELHOS ENTRE 2011 E 2001 -------------- \\\\\
/////////////////////////////-------------------- FIM VARIAÇÃO CONCELHOS------------------\\\\\\\\\\\\\\\\\
////////////////////////////------------------- VARIAÇÃO FREGUESIAS ---------------------\\\\\\\\\\\\\\



/////////////////////////////------- Variação Alojamentos sem instalações de banho POR  FREGUESIAS ENTRE 2011 E 2001 -------------------////

var minVarInstalacoesBanhoFreg11_01 = 0;
var maxVarInstalacoesBanhoFreg11_01 = 0;

function CorVarInstalacoesBanho11_01Freg(d) {
    return d == null ? '#000000' :
        d >= 50   ? '#e06f6c ' : 
        d >= 0   ? '#f1aaa6 ' :
        d >= -50   ? '#d9ffa8 ' :
        d >= -75   ? '#a7da81' :
        d >= -91.6   ? '#82c065' :
                ''  ;
}
var legendaVarInstalacoesBanho11_01Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos familiares de residência habitual sem instalações de banho, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#e06f6c"></i>' + '  > 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6"></i>' + '  0 a 50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d9ffa8"></i>' + ' -50 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a7da81"></i>' + ' -75 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -91.59 a -75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloVarInstalacoesBanhoFreg11_01(feature) {
    if(feature.properties.Var11_01 <= minVarInstalacoesBanhoFreg11_01 || minVarInstalacoesBanhoFreg11_01 ===0){
        minVarInstalacoesBanhoFreg11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarInstalacoesBanhoFreg11_01){
        maxVarInstalacoesBanhoFreg11_01 = feature.properties.Var11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarInstalacoesBanho11_01Freg(feature.properties.Var11_01)};
    }


function apagarVarInstalacoesBanhoFreg11_01(e) {
    VarInstalacoesBanhoFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarInstalacoesBanhoFreg11_01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarInstalacoesBanhoFreg11_01,
    });
}
var VarInstalacoesBanhoFreg11_01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloVarInstalacoesBanhoFreg11_01,
    onEachFeature: onEachFeatureVarInstalacoesBanhoFreg11_01
});

let slideVarInstalacoesBanhoFreg11_01 = function(){
    var sliderVarInstalacoesBanhoFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarInstalacoesBanhoFreg11_01, {
        start: [minVarInstalacoesBanhoFreg11_01, maxVarInstalacoesBanhoFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarInstalacoesBanhoFreg11_01,
            'max': maxVarInstalacoesBanhoFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarInstalacoesBanhoFreg11_01);
    inputNumberMax.setAttribute("value",maxVarInstalacoesBanhoFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarInstalacoesBanhoFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarInstalacoesBanhoFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarInstalacoesBanhoFreg11_01.noUiSlider.on('update',function(e){
        VarInstalacoesBanhoFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarInstalacoesBanhoFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderVarInstalacoesBanhoFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarInstalacoesBanhoFreg11_01);
} 

///////////////////////////// Fim da Variação Alojamentos sem instalações de banho POR  FREGUESIAS ENTRE 2011 E 2001 -------------- \\\\\


var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'Calculos próprios; INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = InstalacoesBanhoConc91;
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
    if (layer == InstalacoesBanhoConc91 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem instalações de banho, em 1991, por concelho.' + '</strong>');
        legendaPerInstalacoesBanhoConc();
        slideInstalacoesBanhoConc91();
        naoDuplicar = 1;
    }
    if (layer == InstalacoesBanhoConc91 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem instalações de banho, em 1991, por concelho.' + '</strong>');
    }
    if (layer == InstalacoesBanhoConc01 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem instalações de banho, em 2001, por concelho.' + '</strong>');
        legendaPerInstalacoesBanhoConc();
        slideInstalacoesBanhoConc01();
        naoDuplicar = 2;
    }
    if (layer == InstalacoesBanhoConc11 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem instalações de banho, em 2011, por concelho.' + '</strong>');
        legendaPerInstalacoesBanhoConc();
        slideInstalacoesBanhoConc11();
        naoDuplicar = 3;
    }
    if (layer == InstalacoesBanhoFreg01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem instalações de banho, em 2001, por freguesia.' + '</strong>');
        legendaPerInstalacoesBanhoFreg();
        slideInstalacoesBanhoFreg01();
        naoDuplicar = 5;
    }
    if (layer == InstalacoesBanhoFreg11 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos familiares de residência habitual sem instalações de banho, em 2011, por freguesia.' + '</strong>');
        legendaPerInstalacoesBanhoFreg();
        slideInstalacoesBanhoFreg11();
        naoDuplicar = 6;
    }
    if (layer == VarInstalacoesBanhoConc01_91 && naoDuplicar != 7){
        legendaVarInstalacoesBanho01_91Conc();
        slideVarInstalacoesBanhoConc01_91();
        naoDuplicar = 7;
    }
    if (layer == VarInstalacoesBanhoConc11_01 && naoDuplicar != 8){
        legendaVarInstalacoesBanho11_01Conc();
        slideVarInstalacoesBanhoConc11_01();
        naoDuplicar = 8;
    }
    if (layer == VarInstalacoesBanhoFreg11_01 && naoDuplicar != 10){
        legendaVarInstalacoesBanho11_01Freg();
        slideVarInstalacoesBanhoFreg11_01();
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
                novaLayer(InstalacoesBanhoConc91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(InstalacoesBanhoConc01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(InstalacoesBanhoConc11);
            };
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if(anoSelecionado == "2001"){
                novaLayer(VarInstalacoesBanhoConc01_91)
            }
            if(anoSelecionado == "2011"){
                novaLayer(VarInstalacoesBanhoConc11_01)
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#percentagem').hasClass('active5')){
            if (anoSelecionado == "2001"){
                novaLayer(InstalacoesBanhoFreg01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(InstalacoesBanhoFreg11);
            };
        }
        if ($('#taxaVariacao').hasClass('active5')){
            if(anoSelecionado == "2011"){
                novaLayer(VarInstalacoesBanhoFreg11_01)
            }
        }
    }
}
$('#mySelect').change(function(){
    myFunction();
})
$('#opcaoSelect').change(function(){
    myFunction();
})
let fonteTitulo = function(valor){
    if(valor == 'N'){
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' INE, Recenseamento da população e habitação.' );
    }
    else{
        $('.ine').html('<strong>' + 'Fonte: '+ '</strong>' + ' Cálculos próprios; INE, Recenseamento da população e habitação.' );
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
    $('#tituloMapa').html('Proporção de alojamentos familiares de residência habitual sem instalações de banho, entre 1991 e 2011, %.');
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/InstalacoesBanhoProv.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $('#1991').html("1991")
        $.each(data, function(key, value){
            dados += '<tr>';
            if(containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                dados += '<td class="borderbottom bordertop">'+value.Banho+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS1991+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2001+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2011+'</td>';
            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                dados += '<td>'+value.Banho+'</td>';
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
    $('#tituloMapa').html('Variação da proporção de alojamentos familiares de residência habitual sem instalações de banho, entre 1991 e 2011, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/InstalacoesBanhoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+value.Banho+'</td>';
                    dados += '<td class="borderbottom bordertop">'+ ''+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR0191+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR1101+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Banho+'</td>';
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
