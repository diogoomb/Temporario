
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
var contornoFreg1991 = L.geoJSON(dadosRelativosFreguesias91,{
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

/////////////////////------- Alojamentos sem pelo menos uma infraestrutura básica: por Concelho em 1991-----////////////////////////

var minIBasicasConc91 = 0;
var maxIBasicasConc91 = 0;

function CorPerInfraestruturaConc(d) {
    return d >= 34.95 ? '#bf0404 ' :
        d >= 29.26  ? '#c71d1c' :
        d >= 19.79 ? '#d44846' :
        d >= 10.31   ? '#e06f6c' :
        d >= 0.83   ? '#f1aaa6 ' :
                ''  ;
}
var legendaPerInfraestruturaConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#bf0404 "></i>' + ' > 34.95' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#c71d1c"></i>' + ' 29.26 - 34.95' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d44846"></i>' + ' 19.79 - 29.26' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#e06f6c"></i>' + ' 10.31 - 19.79' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6 "></i>' + ' 0.83 - 10.31' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloIBasicasConc91(feature) {
    if( feature.properties.InfBas91 <= minIBasicasConc91 || minIBasicasConc91 === 0){
        minIBasicasConc91 = feature.properties.InfBas91
    }
    if(feature.properties.InfBas91 >= maxIBasicasConc91 ){
        maxIBasicasConc91 = feature.properties.InfBas91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInfraestruturaConc(feature.properties.InfBas91)
    };
}
function apagarIBasicasConc91(e) {
    IBasicasConc91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIBasicasConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Alojamentos sem pelo menos uma infraestrutura básica: ' + '<b>' + feature.properties.InfBas91.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIBasicasConc91,
    });
}
var IBasicasConc91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloIBasicasConc91,
    onEachFeature: onEachFeatureIBasicasConc91
});
let slideIBasicasConc91 = function(){
    var sliderIBasicasConc91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIBasicasConc91, {
        start: [minIBasicasConc91, maxIBasicasConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minIBasicasConc91,
            'max': maxIBasicasConc91
        },
        });
    inputNumberMin.setAttribute("value",minIBasicasConc91);
    inputNumberMax.setAttribute("value",maxIBasicasConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderIBasicasConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIBasicasConc91.noUiSlider.set([null, this.value]);
    });

    sliderIBasicasConc91.noUiSlider.on('update',function(e){
        IBasicasConc91.eachLayer(function(layer){
            if(layer.feature.properties.InfBas91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.InfBas91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIBasicasConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderIBasicasConc91.noUiSlider;
    $(slidersGeral).append(sliderIBasicasConc91);
} 
IBasicasConc91.addTo(map);
$('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sem pelo menos uma infraestrutura básica, em 1991, por concelho.' + '</strong>');
legendaPerInfraestruturaConc();
slideIBasicasConc91();
/////////////////////////////////// ---------Fim de Alojamentos sem pelo menos uma infraestrutura básica: EM 1991 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

/////////////////////--------------------------- Alojamentos sem pelo menos uma infraestrutura básica: EM 2001 POR CONCELHO-----////////////////////////

var minIBasicasConc01 = 0;
var maxIBasicasConc01 = 0;

function EstiloIBasicasConc01(feature) {
    if( feature.properties.InfBas01 <= minIBasicasConc01 || minIBasicasConc01 === 0){
        minIBasicasConc01 = feature.properties.InfBas01
    }
    if(feature.properties.InfBas01 >= maxIBasicasConc01 ){
        maxIBasicasConc01 = feature.properties.InfBas01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInfraestruturaConc(feature.properties.InfBas01)
    };
}
function apagarIBasicasConc01(e) {
    IBasicasConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIBasicasConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem pelo menos uma infraestrutura básica: ' + '<b>' + feature.properties.InfBas01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIBasicasConc01,
    });
}
var IBasicasConc01= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloIBasicasConc01,
    onEachFeature: onEachFeatureIBasicasConc01
});
let slideIBasicasConc01 = function(){
    var sliderIBasicasConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIBasicasConc01, {
        start: [minIBasicasConc01, maxIBasicasConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minIBasicasConc01,
            'max': maxIBasicasConc01
        },
        });
    inputNumberMin.setAttribute("value",minIBasicasConc01);
    inputNumberMax.setAttribute("value",maxIBasicasConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderIBasicasConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIBasicasConc01.noUiSlider.set([null, this.value]);
    });

    sliderIBasicasConc01.noUiSlider.on('update',function(e){
        IBasicasConc01.eachLayer(function(layer){
            if(layer.feature.properties.InfBas01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.InfBas01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIBasicasConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderIBasicasConc01.noUiSlider;
    $(slidersGeral).append(sliderIBasicasConc01);
}


/////////////////////////////////// Fim Alojamentos sem pelo menos uma infraestrutura básica: EM 2001 POR CONCELHO -------------- \\\\\\

/////////////////////------------------- Alojamentos sem pelo menos uma infraestrutura básica: EM 2011 POR CONCELHO-----//\\\\\\\\//////////////////////

var minIBasicasConc11 = 0;
var maxIBasicasConc11 = 0;

function EstiloIBasicasConc11(feature) {
    if( feature.properties.InfBas11 <= minIBasicasConc11 || minIBasicasConc11 === 0){
        minIBasicasConc11 = feature.properties.InfBas11
    }
    if(feature.properties.InfBas11 >= maxIBasicasConc11 ){
        maxIBasicasConc11 = feature.properties.InfBas11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInfraestruturaConc(feature.properties.InfBas11)
    };
}
function apagarIBasicasConc11(e) {
    IBasicasConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIBasicasConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sem pelo menos uma infraestrutura básica: ' + '<b>' + feature.properties.InfBas11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIBasicasConc11,
    });
}
var IBasicasConc11= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloIBasicasConc11,
    onEachFeature: onEachFeatureIBasicasConc11
});
let slideIBasicasConc11 = function(){
    var sliderIBasicasConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIBasicasConc11, {
        start: [minIBasicasConc11, maxIBasicasConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minIBasicasConc11,
            'max': maxIBasicasConc11
        },
        });
    inputNumberMin.setAttribute("value",minIBasicasConc11);
    inputNumberMax.setAttribute("value",maxIBasicasConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderIBasicasConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIBasicasConc11.noUiSlider.set([null, this.value]);
    });

    sliderIBasicasConc11.noUiSlider.on('update',function(e){
        IBasicasConc11.eachLayer(function(layer){
            if(layer.feature.properties.InfBas11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.InfBas11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIBasicasConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderIBasicasConc11.noUiSlider;
    $(slidersGeral).append(sliderIBasicasConc11);
} 

/////////////////////////////////// Fim Alojamentos sem pelo menos uma infraestrutura básica: 2011 Concelho -------------- \\\\\\


/////////////////////////---------------------- DADOS RELATIVOS, FREGUESIAS -------------------\\\\\\\\\\\\\\\\\\

/////////////////////------------------- Alojamentos sem pelo menos uma infraestrutura básica: EM 1991 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minIBasicasFreg91 = 0;
var maxIBasicasFreg91 = 0;

function CorPerInfraestruturaFreg(d) {
    return d >= 90.06 ? '#bf0404 ' :
        d >= 75.14  ? '#c71d1c' :
        d >= 50.28 ? '#d44846' :
        d >= 25.41   ? '#e06f6c' :
        d >= 0.55   ? '#f1aaa6 ' :
                ''  ;
}
var legendaPerInfraestruturaFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#bf0404 "></i>' + ' > 90.06' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#c71d1c"></i>' + ' 75.14 - 90.06' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d44846"></i>' + ' 50.28 - 75.14' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#e06f6c"></i>' + ' 25.41 - 50.28' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6 "></i>' + ' 0.55 - 25.41' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloIBasicasFreg91(feature) {
    if( feature.properties.Prop91 <= minIBasicasFreg91 || minIBasicasFreg91 === 0){
        minIBasicasFreg91 = feature.properties.Prop91
    }
    if(feature.properties.Prop91 >= maxIBasicasFreg91 ){
        maxIBasicasFreg91 = feature.properties.Prop91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInfraestruturaFreg(feature.properties.Prop91)
    };
}
function apagarIBasicasFreg91(e) {
    IBasicasFreg91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIBasicasFreg91(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos sem pelo menos uma infraestrutura básica: ' + '<b>' + feature.properties.Prop91.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIBasicasFreg91,
    });
}
var IBasicasFreg91= L.geoJSON(dadosRelativosFreguesias91, {
    style:EstiloIBasicasFreg91,
    onEachFeature: onEachFeatureIBasicasFreg91
});
let slideIBasicasFreg91 = function(){
    var sliderIBasicasFreg91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIBasicasFreg91, {
        start: [minIBasicasFreg91, maxIBasicasFreg91],
        tooltips:true,
        connect: true,
        range: {
            'min': minIBasicasFreg91,
            'max': maxIBasicasFreg91
        },
        });
    inputNumberMin.setAttribute("value",minIBasicasFreg91);
    inputNumberMax.setAttribute("value",maxIBasicasFreg91);

    inputNumberMin.addEventListener('change', function(){
        sliderIBasicasFreg91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIBasicasFreg91.noUiSlider.set([null, this.value]);
    });

    sliderIBasicasFreg91.noUiSlider.on('update',function(e){
        IBasicasFreg91.eachLayer(function(layer){
            if(layer.feature.properties.Prop91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIBasicasFreg91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderIBasicasFreg91.noUiSlider;
    $(slidersGeral).append(sliderIBasicasFreg91);
} 

 
//////////////////////--------- Fim Alojamentos sem pelo menos uma infraestrutura básica: POR FREGUESIAS EM 1991 -------------- \\\\\\

/////////////////////------------------- Alojamentos sem pelo menos uma infraestrutura básica: EM 2001 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minIBasicasFreg01 = 0;
var maxIBasicasFreg01 = 0;

function EstiloIBasicasFreg01(feature) {
    if( feature.properties.Prop01 <= minIBasicasFreg01 || minIBasicasFreg01 === 0){
        minIBasicasFreg01 = feature.properties.Prop01
    }
    if(feature.properties.Prop01 >= maxIBasicasFreg01 ){
        maxIBasicasFreg01 = feature.properties.Prop01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInfraestruturaFreg(feature.properties.Prop01)
    };
}
function apagarIBasicasFreg01(e) {
    IBasicasFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIBasicasFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos sem pelo menos uma infraestrutura básica: ' + '<b>' + feature.properties.Prop01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIBasicasFreg01,
    });
}
var IBasicasFreg01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloIBasicasFreg01,
    onEachFeature: onEachFeatureIBasicasFreg01
});
let slideIBasicasFreg01 = function(){
    var sliderIBasicasFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIBasicasFreg01, {
        start: [minIBasicasFreg01, maxIBasicasFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minIBasicasFreg01,
            'max': maxIBasicasFreg01
        },
        });
    inputNumberMin.setAttribute("value",minIBasicasFreg01);
    inputNumberMax.setAttribute("value",maxIBasicasFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderIBasicasFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIBasicasFreg01.noUiSlider.set([null, this.value]);
    });

    sliderIBasicasFreg01.noUiSlider.on('update',function(e){
        IBasicasFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Prop01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIBasicasFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderIBasicasFreg01.noUiSlider;
    $(slidersGeral).append(sliderIBasicasFreg01);
} 

 
//////////////////////--------- Fim Alojamentos sem pelo menos uma infraestrutura básica: POR FREGUESIAS EM 2001 -------------- \\\\\\

/////////////////////-------------------Alojamentos sem pelo menos uma infraestrutura básica: EM 2011 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minIBasicasFreg11 = 0;
var maxIBasicasFreg11 = 0;

function EstiloIBasicasFreg11(feature) {
    if( feature.properties.Prop11 <= minIBasicasFreg11 || minIBasicasFreg11 === 0){
        minIBasicasFreg11 = feature.properties.Prop11
    }
    if(feature.properties.Prop11 >= maxIBasicasFreg11 ){
        maxIBasicasFreg11 = feature.properties.Prop11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerInfraestruturaFreg(feature.properties.Prop11)
    };
}
function apagarIBasicasFreg11(e) {
    IBasicasFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIBasicasFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos sem pelo menos uma infraestrutura básica: ' + '<b>' + feature.properties.Prop11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIBasicasFreg11,
    });
}
var IBasicasFreg11= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloIBasicasFreg11,
    onEachFeature: onEachFeatureIBasicasFreg11
});
let slideIBasicasFreg11 = function(){
    var sliderIBasicasFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIBasicasFreg11, {
        start: [minIBasicasFreg11, maxIBasicasFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minIBasicasFreg11,
            'max': maxIBasicasFreg11
        },
        });
    inputNumberMin.setAttribute("value",minIBasicasFreg11);
    inputNumberMax.setAttribute("value",maxIBasicasFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderIBasicasFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIBasicasFreg11.noUiSlider.set([null, this.value]);
    });

    sliderIBasicasFreg11.noUiSlider.on('update',function(e){
        IBasicasFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Prop11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Prop11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIBasicasFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderIBasicasFreg11.noUiSlider;
    $(slidersGeral).append(sliderIBasicasFreg11);
} 

 
//////////////////////--------- Fim Alojamentos sem pelo menos uma infraestrutura básica: POR FREGUESIAS EM 2011 -------------- \\\\\\

///////////////////////////--------------------------- VARIAÇÕES CONCELHOS ------------\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação Alojamentos sem pelo menos uma infraestrutura básica: POR  CONCELHOS ENTRE 2001 E 1991 -------------------////

var minVarIBasicasConc01_91 = 0;
var maxVarIBasicasConc01_91 = -99;

function CorVarInfraestrutura01_91Conc(d) {
    return d == null ? '#000000' :
        d >= -40  ? '#d9ffa8 ' :
        d >= -50 ? '#a7da81' :
        d >= -60   ? '#82c065' :
        d >= -67.57   ? '#60a74b' :
                ''  ;
}
var legendaVarInfraestrutura01_91Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos sem pelos menos uma infraestrutura básica, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#d9ffa8 "></i>' + '  > -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a7da81"></i>' + ' -50 a -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -60 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -67.56 a -60' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloVarIBasicasConc01_91(feature) {
    if(feature.properties.Var01_91 <= minVarIBasicasConc01_91){
        minVarIBasicasConc01_91 = feature.properties.Var01_91
    }
    if(feature.properties.Var01_91 > maxVarIBasicasConc01_91 && feature.properties.Var01_91 != null){
        maxVarIBasicasConc01_91 = feature.properties.Var01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarInfraestrutura01_91Conc(feature.properties.Var01_91)};
    }


function apagarVarIBasicasConc01_91(e) {
    VarIBasicasConc01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarIBasicasConc01_91(feature, layer) {
    if(feature.properties.Var01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var01_91.toFixed(2) + '</b>' + '%').openPopup()
    }    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarIBasicasConc01_91,
    });
}
var VarIBasicasConc01_91= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloVarIBasicasConc01_91,
    onEachFeature: onEachFeatureVarIBasicasConc01_91
});

let slideVarIBasicasConc01_91 = function(){
    var sliderVarIBasicasConc01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarIBasicasConc01_91, {
        start: [minVarIBasicasConc01_91, maxVarIBasicasConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarIBasicasConc01_91,
            'max': maxVarIBasicasConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarIBasicasConc01_91);
    inputNumberMax.setAttribute("value",maxVarIBasicasConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarIBasicasConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarIBasicasConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarIBasicasConc01_91.noUiSlider.on('update',function(e){
        VarIBasicasConc01_91.eachLayer(function(layer){
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
        sliderVarIBasicasConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderVarIBasicasConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVarIBasicasConc01_91);
} 

///////////////////////////// Fim da Variação Alojamentos sem pelo menos uma infraestrutura básica: POR  CONCELHOS ENTRE 2001 E 1991 -------------- \\\\\

/////////////////////////////------- Variação Alojamentos sem pelo menos uma infraestrutura básica: POR  CONCELHOS ENTRE 2011 E 2001 -------------------////

var minVarIBasicasConc11_01 = 0;
var maxVarIBasicasConc11_01 = -99;

function CorVarInfraestrutura11_01Conc(d) {
    return d == null ? '#000000' :
        d >= -70 ? '#82c065' :
        d >= -80   ? '#60a74b' :
        d >= -86.90   ? '#459436' :
                ''  ;
}
var legendaVarInfraestrutura11_01Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos sem pelos menos uma infraestrutura básica, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#82c065 "></i>' + '  > -70' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -80 a -70' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#459436 "></i>' + ' -86.89 a -80' + '<br>'

    $(legendaA).append(symbolsContainer); 
}


function EstiloVarIBasicasConc11_01(feature) {
    if(feature.properties.Var11_01 <= minVarIBasicasConc11_01){
        minVarIBasicasConc11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarIBasicasConc11_01){
        maxVarIBasicasConc11_01 = feature.properties.Var11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarInfraestrutura11_01Conc(feature.properties.Var11_01)};
    }


function apagarVarIBasicasConc11_01(e) {
    VarIBasicasConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarIBasicasConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarIBasicasConc11_01,
    });
}
var VarIBasicasConc11_01= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloVarIBasicasConc11_01,
    onEachFeature: onEachFeatureVarIBasicasConc11_01
});

let slideVarIBasicasConc11_01 = function(){
    var sliderVarIBasicasConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarIBasicasConc11_01, {
        start: [minVarIBasicasConc11_01, maxVarIBasicasConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarIBasicasConc11_01,
            'max': maxVarIBasicasConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarIBasicasConc11_01);
    inputNumberMax.setAttribute("value",maxVarIBasicasConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarIBasicasConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarIBasicasConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarIBasicasConc11_01.noUiSlider.on('update',function(e){
        VarIBasicasConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarIBasicasConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderVarIBasicasConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarIBasicasConc11_01);
} 

///////////////////////////// Fim da Variação Alojamentos sem pelo menos uma infraestrutura básica: POR  CONCELHOS ENTRE 2011 E 2001 -------------- \\\\\
/////////////////////////////-------------------- FIM VARIAÇÃO CONCELHOS------------------\\\\\\\\\\\\\\\\\
////////////////////////////------------------- VARIAÇÃO FREGUESIAS ---------------------\\\\\\\\\\\\\\


/////////////////////////////------- Variação Alojamentos sem pelo menos uma infraestrutura básica: POR  FREGUESIAS ENTRE 2001 E 1991 -------------------////

var minVarIBasicasFreg01_91 = 0;
var maxVarIBasicasFreg01_91 = 0;

function CorVarInfraestrutura01_91Freg(d) {
    return d == null ? '#000000' :
        d >= -0  ? '#f1aaa6  ' :
        d >= -25  ? '#d9ffa8 ' :
        d >= -50 ? '#a7da81' :
        d >= -75   ? '#82c065' :
        d >= -91.35   ? '#60a74b' :
                ''  ;
}
var legendaVarInfraestrutura01_91Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos sem pelos menos uma infraestrutura básica, entre 2001 e 1991, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6 "></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d9ffa8"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a7da81"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -75 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -91.34 a -75' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloVarIBasicasFreg01_91(feature) {
    if(feature.properties.Var01_91 <= minVarIBasicasFreg01_91 || minVarIBasicasFreg01_91 ===0){
        minVarIBasicasFreg01_91 = feature.properties.Var01_91
    }
    if(feature.properties.Var01_91 > maxVarIBasicasFreg01_91){
        maxVarIBasicasFreg01_91 = feature.properties.Var01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarInfraestrutura01_91Freg(feature.properties.Var01_91)};
    }


function apagarVarIBasicasFreg01_91(e) {
    VarIBasicasFreg01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarIBasicasFreg01_91(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var01_91.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarIBasicasFreg01_91,
    });
}
var VarIBasicasFreg01_91= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloVarIBasicasFreg01_91,
    onEachFeature: onEachFeatureVarIBasicasFreg01_91
});

let slideVarIBasicasFreg01_91 = function(){
    var sliderVarIBasicasFreg01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarIBasicasFreg01_91, {
        start: [minVarIBasicasFreg01_91, maxVarIBasicasFreg01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarIBasicasFreg01_91,
            'max': maxVarIBasicasFreg01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarIBasicasFreg01_91);
    inputNumberMax.setAttribute("value",maxVarIBasicasFreg01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarIBasicasFreg01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarIBasicasFreg01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarIBasicasFreg01_91.noUiSlider.on('update',function(e){
        VarIBasicasFreg01_91.eachLayer(function(layer){
            if(layer.feature.properties.Var01_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var01_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarIBasicasFreg01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderVarIBasicasFreg01_91.noUiSlider;
    $(slidersGeral).append(sliderVarIBasicasFreg01_91);
} 

///////////////////////////// Fim da Variação Alojamentos sem pelo menos uma infraestrutura básica: POR  FREGUESIAS ENTRE 2001 E 1991 -------------- \\\\\

/////////////////////////////------- Variação Alojamentos sem pelo menos uma infraestrutura básica: POR  FREGUESIAS ENTRE 2011 E 2001 -------------------////

var minVarIBasicasFreg11_01 = 0;
var maxVarIBasicasFreg11_01 = 0;

function CorVarInfraestrutura11_01Freg(d) {
    return d == null ? '#000000' :
        d >= -0  ? '#f1aaa6  ' :
        d >= -25  ? '#d9ffa8 ' :
        d >= -50 ? '#a7da81' :
        d >= -75   ? '#82c065' :
        d >= -96.55   ? '#60a74b' :
                ''  ;
}
var legendaVarInfraestrutura11_01Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos sem pelos menos uma infraestrutura básica, entre 2011 e 2001, por freguesia.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6 "></i>' + '  > 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d9ffa8"></i>' + ' -25 a 0' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a7da81"></i>' + ' -50 a -25' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -75 a -50' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -96.54 a -75' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloVarIBasicasFreg11_01(feature) {
    if(feature.properties.Var11_01 <= minVarIBasicasFreg11_01 || minVarIBasicasFreg11_01 ===0){
        minVarIBasicasFreg11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarIBasicasFreg11_01){
        maxVarIBasicasFreg11_01 = feature.properties.Var11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarInfraestrutura11_01Freg(feature.properties.Var11_01)};
    }


function apagarVarIBasicasFreg11_01(e) {
    VarIBasicasFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarIBasicasFreg11_01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarIBasicasFreg11_01,
    });
}
var VarIBasicasFreg11_01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloVarIBasicasFreg11_01,
    onEachFeature: onEachFeatureVarIBasicasFreg11_01
});

let slideVarIBasicasFreg11_01 = function(){
    var sliderVarIBasicasFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarIBasicasFreg11_01, {
        start: [minVarIBasicasFreg11_01, maxVarIBasicasFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarIBasicasFreg11_01,
            'max': maxVarIBasicasFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarIBasicasFreg11_01);
    inputNumberMax.setAttribute("value",maxVarIBasicasFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarIBasicasFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarIBasicasFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarIBasicasFreg11_01.noUiSlider.on('update',function(e){
        VarIBasicasFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarIBasicasFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderVarIBasicasFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarIBasicasFreg11_01);
} 

///////////////////////////// Fim da Variação Alojamentos sem pelo menos uma infraestrutura básica: POR  FREGUESIAS ENTRE 2011 E 2001 -------------- \\\\\


var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = IBasicasConc91;
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
    if (layer == IBasicasConc91 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sem pelo menos uma infraestrutura básica, em 1991, por concelho.' + '</strong>');
        legendaPerInfraestruturaConc();
        slideIBasicasConc91();
        naoDuplicar = 1;
    }
    if (layer == IBasicasConc91 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sem pelo menos uma infraestrutura básica, em 1991, por concelho.' + '</strong>');
    }
    if (layer == IBasicasConc01 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sem pelo menos uma infraestrutura básica, em 2001, por concelho.' + '</strong>');
        legendaPerInfraestruturaConc();
        slideIBasicasConc01();
        naoDuplicar = 2;
    }
    if (layer == IBasicasConc11 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sem pelo menos uma infraestrutura básica, em 2011, por concelho.' + '</strong>');
        legendaPerInfraestruturaConc();
        slideIBasicasConc11();
        naoDuplicar = 3;
    }
    if (layer == IBasicasFreg91 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sem pelo menos uma infraestrutura básica, em 1991, por freguesia.' + '</strong>');
        legendaPerInfraestruturaFreg();
        slideIBasicasFreg91();
        naoDuplicar = 4;
    }
    if (layer == IBasicasFreg01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sem pelo menos uma infraestrutura básica, em 2001, por freguesia.' + '</strong>');
        legendaPerInfraestruturaFreg();
        slideIBasicasFreg01();
        naoDuplicar = 5;
    }
    if (layer == IBasicasFreg11 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sem pelo menos uma infraestrutura básica, em 2011, por freguesia.' + '</strong>');
        legendaPerInfraestruturaFreg();
        slideIBasicasFreg11();
        naoDuplicar = 6;
    }
    if (layer == VarIBasicasConc01_91 && naoDuplicar != 7){
        legendaVarInfraestrutura01_91Conc();
        slideVarIBasicasConc01_91();
        naoDuplicar = 7;
    }
    if (layer == VarIBasicasConc11_01 && naoDuplicar != 8){
        legendaVarInfraestrutura11_01Conc();
        slideVarIBasicasConc11_01();
        naoDuplicar = 8;
    }
    if (layer == VarIBasicasFreg01_91 && naoDuplicar != 9){
        legendaVarInfraestrutura01_91Freg();        
        slideVarIBasicasFreg01_91();
        naoDuplicar = 9;
    }
    if (layer == VarIBasicasFreg11_01 && naoDuplicar != 10){
        legendaVarInfraestrutura11_01Freg();        
        slideVarIBasicasFreg11_01();
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
                novaLayer(IBasicasConc91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(IBasicasConc01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(IBasicasConc11);
            };
            $('#tituloMapa').css('font-size','10pt')
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if(anoSelecionado == "2001"){
                novaLayer(VarIBasicasConc01_91)
            }
            if(anoSelecionado == "2011"){
                novaLayer(VarIBasicasConc11_01)
            }
            $('#tituloMapa').css('font-size','9pt')
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#percentagem').hasClass('active5')){
            if (anoSelecionado == "1991"){
                novaLayer(IBasicasFreg91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(IBasicasFreg01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(IBasicasFreg11);
            };
            $('#tituloMapa').css('font-size','10pt')
        }
        if ($('#taxaVariacao').hasClass('active5')){
            if(anoSelecionado == "2001"){
                novaLayer(VarIBasicasFreg01_91)
            }
            if(anoSelecionado == "2011"){
                novaLayer(VarIBasicasFreg11_01)
            }
            $('#tituloMapa').css('font-size','9pt')
        }
    }
}
function mudarEscala(){
    reporAnos();
    tamanhoOutros();
    fonteTitulo('N');
}
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
    if($('#percentagem').hasClass('active4') || $('#percentagem').hasClass('active5')){
        var ano = 1991;
        while (ano <= 2011){
            $('#mySelect').append("<option value="+ '' + ano + '' + '>' + ano + '</option>');
            ano += 10;
        }
        primeirovalor('1991');
    }

    if($('#taxaVariacao').hasClass('active4') || $('#taxaVariacao').hasClass('active5')){
        $('#mySelect').append("<option value='2001'>2001 - 1991</option>");
        $('#mySelect').append("<option value='2011'>2011 - 2001</option>");
        primeirovalor('2001');
    }
}

$('#mySelect').change(function(){
    myFunction();
})
$('#opcaoSelect').change(function(){
    myFunction();
})
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
    $('#tituloMapa').html('Proporção de alojamentos sem pelo menos uma infraestrutura básica, entre 1991 e 2011, %.');
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/InfraestruturaBasicaProv.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $('#1991').html("1991")
        $.each(data, function(key, value){
            dados += '<tr>';
            if(containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                dados += '<td class="borderbottom bordertop">'+value.InfraBasica+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS1991+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2001+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2011+'</td>';
            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                dados += '<td>'+value.InfraBasica+'</td>';
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
    $('#tituloMapa').html('Variação da proporção de alojamentos sem pelo menos uma infraestrutura básica, entre 1991 e 2011, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/InfraestruturaBasicaProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+value.InfraBasica+'</td>';
                    dados += '<td class="borderbottom bordertop">'+ ''+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR0191+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR1101+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.InfraBasica+'</td>';
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
        if (anoSelecionado == "1991"){
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
    if ($('#taxaVariacao').hasClass('active5') || $('#taxaVariacao').hasClass('active4')){
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
