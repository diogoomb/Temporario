
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

var legendaExcecao = function(tituloescrito, maximo,medio,minimo, multiplicador) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'center'
    var symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaProporcional'
    var titulo = tituloescrito
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

///////////////////////////----------------------- DADOS RELATIVOS, CONCELHO--------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------- ALOJAMENTOS SOBRELOTADOS por Concelho em 1991-----////////////////////////

var minSobrelotadosConc91 = 0;
var maxSobrelotadosConc91 = 0;

function CorPerSobrelotadosConc(d) {
    return d >= 38.04 ? '#bf0404 ' :
        d >= 32.97  ? '#c71d1c' :
        d >= 24.53 ? '#d44846' :
        d >= 16.08   ? '#e06f6c' :
        d >= 7.63   ? '#f1aaa6 ' :
                ''  ;
}
var legendaPerSobrelotadosConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#bf0404 "></i>' + ' > 38.04' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#c71d1c"></i>' + ' 32.97 - 38.04' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d44846"></i>' + ' 24.53 - 32.97' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#e06f6c"></i>' + ' 16.08 - 24.53' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6 "></i>' + ' 7.63 - 16.08' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloSobrelotadosConc91(feature) {
    if( feature.properties.Sobrelo_91 <= minSobrelotadosConc91 || minSobrelotadosConc91 === 0){
        minSobrelotadosConc91 = feature.properties.Sobrelo_91
    }
    if(feature.properties.Sobrelo_91 >= maxSobrelotadosConc91 ){
        maxSobrelotadosConc91 = feature.properties.Sobrelo_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSobrelotadosConc(feature.properties.Sobrelo_91)
    };
}
function apagarSobrelotadosConc91(e) {
    SobrelotadosConc91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureSobrelotadosConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Alojamentos sobrelotados: ' + '<b>' + feature.properties.Sobrelo_91.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarSobrelotadosConc91,
    });
}
var SobrelotadosConc91= L.geoJSON(dadosRelativosConcelhos91, {
    style:EstiloSobrelotadosConc91,
    onEachFeature: onEachFeatureSobrelotadosConc91
});
let slideSobrelotadosConc91 = function(){
    var sliderSobrelotadosConc91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderSobrelotadosConc91, {
        start: [minSobrelotadosConc91, maxSobrelotadosConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minSobrelotadosConc91,
            'max': maxSobrelotadosConc91
        },
        });
    inputNumberMin.setAttribute("value",minSobrelotadosConc91);
    inputNumberMax.setAttribute("value",maxSobrelotadosConc91);

    inputNumberMin.addEventListener('change', function(){
        sliderSobrelotadosConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSobrelotadosConc91.noUiSlider.set([null, this.value]);
    });

    sliderSobrelotadosConc91.noUiSlider.on('update',function(e){
        SobrelotadosConc91.eachLayer(function(layer){
            if(layer.feature.properties.Sobrelo_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Sobrelo_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderSobrelotadosConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderSobrelotadosConc91.noUiSlider;
    $(slidersGeral).append(sliderSobrelotadosConc91);
} 
SobrelotadosConc91.addTo(map);
$('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sobrelotados, em 1991, por concelho.' + '</strong>');
legendaPerSobrelotadosConc();
slideSobrelotadosConc91();
/////////////////////////////////// ---------Fim de ALOJAMENTOS SOBRELOTADOS EM 1991 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

/////////////////////--------------------------- ALOJAMENTOS SOBRELOTADOS EM 2001 POR CONCELHO-----////////////////////////

var minSobrelotadosConc01 = 0;
var maxSobrelotadosConc01 = 0;

function EstiloSobrelotadosConc01(feature) {
    if( feature.properties.Sobrelo_01 <= minSobrelotadosConc01 || minSobrelotadosConc01 === 0){
        minSobrelotadosConc01 = feature.properties.Sobrelo_01
    }
    if(feature.properties.Sobrelo_01 >= maxSobrelotadosConc01 ){
        maxSobrelotadosConc01 = feature.properties.Sobrelo_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSobrelotadosConc(feature.properties.Sobrelo_01)
    };
}
function apagarSobrelotadosConc01(e) {
    SobrelotadosConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureSobrelotadosConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sobrelotados: ' + '<b>' + feature.properties.Sobrelo_01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarSobrelotadosConc01,
    });
}
var SobrelotadosConc01= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloSobrelotadosConc01,
    onEachFeature: onEachFeatureSobrelotadosConc01
});
let slideSobrelotadosConc01 = function(){
    var sliderSobrelotadosConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderSobrelotadosConc01, {
        start: [minSobrelotadosConc01, maxSobrelotadosConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minSobrelotadosConc01,
            'max': maxSobrelotadosConc01
        },
        });
    inputNumberMin.setAttribute("value",minSobrelotadosConc01);
    inputNumberMax.setAttribute("value",maxSobrelotadosConc01);

    inputNumberMin.addEventListener('change', function(){
        sliderSobrelotadosConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSobrelotadosConc01.noUiSlider.set([null, this.value]);
    });

    sliderSobrelotadosConc01.noUiSlider.on('update',function(e){
        SobrelotadosConc01.eachLayer(function(layer){
            if(layer.feature.properties.Sobrelo_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Sobrelo_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderSobrelotadosConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderSobrelotadosConc01.noUiSlider;
    $(slidersGeral).append(sliderSobrelotadosConc01);
}


/////////////////////////////////// Fim ALOJAMENTOS SOBRELOTADOS EM 2001 POR CONCELHO -------------- \\\\\\

/////////////////////------------------- ALOJAMENTOS SOBRELOTADOS EM 2011 POR CONCELHO-----//\\\\\\\\//////////////////////

var minSobrelotadosConc11 = 0;
var maxSobrelotadosConc11 = 0;

function EstiloSobrelotadosConc11(feature) {
    if( feature.properties.Sobrelo_11 <= minSobrelotadosConc11 || minSobrelotadosConc11 === 0){
        minSobrelotadosConc11 = feature.properties.Sobrelo_11
    }
    if(feature.properties.Sobrelo_11 >= maxSobrelotadosConc11 ){
        maxSobrelotadosConc11 = feature.properties.Sobrelo_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSobrelotadosConc(feature.properties.Sobrelo_11)
    };
}
function apagarSobrelotadosConc11(e) {
    SobrelotadosConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureSobrelotadosConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Alojamentos sobrelotados: ' + '<b>' + feature.properties.Sobrelo_11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarSobrelotadosConc11,
    });
}
var SobrelotadosConc11= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloSobrelotadosConc11,
    onEachFeature: onEachFeatureSobrelotadosConc11
});
let slideSobrelotadosConc11 = function(){
    var sliderSobrelotadosConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderSobrelotadosConc11, {
        start: [minSobrelotadosConc11, maxSobrelotadosConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minSobrelotadosConc11,
            'max': maxSobrelotadosConc11
        },
        });
    inputNumberMin.setAttribute("value",minSobrelotadosConc11);
    inputNumberMax.setAttribute("value",maxSobrelotadosConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderSobrelotadosConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSobrelotadosConc11.noUiSlider.set([null, this.value]);
    });

    sliderSobrelotadosConc11.noUiSlider.on('update',function(e){
        SobrelotadosConc11.eachLayer(function(layer){
            if(layer.feature.properties.Sobrelo_11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Sobrelo_11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderSobrelotadosConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderSobrelotadosConc11.noUiSlider;
    $(slidersGeral).append(sliderSobrelotadosConc11);
} 

/////////////////////////////////// Fim ALOJAMENTOS SOBRELOTADOS 2011 Concelho -------------- \\\\\\


/////////////////////////---------------------- DADOS RELATIVOS, FREGUESIAS -------------------\\\\\\\\\\\\\\\\\\

/////////////////////------------------- ALOJAMENTOS SOBRELOTADOS EM 1991 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minSobrelotadosFreg91 = 0;
var maxSobrelotadosFreg91 = 0;

function CorPerSobrelotadosFreg(d) {
    return d >= 62.94 ? '#bf0404  ' :
        d >= 53.15  ? '#c71d1c' :
        d >= 36.84 ? '#d44846' :
        d >= 20.52   ? '#e06f6c' :
        d >= 4.21   ? '#f1aaa6 ' :
                ''  ;
}
var legendaPerSobrelotadosFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#bf0404"></i>' + ' > 62.94' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#c71d1c"></i>' + ' 53.15 -62.94' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#d44846"></i>' + ' 36.84 - 53.15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#e06f6c"></i>' + ' 20.52 - 36.84' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f1aaa6"></i>' + ' 4.21 - 20.52' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloSobrelotadosFreg91(feature) {
    if( feature.properties.Sobrelot91 <= minSobrelotadosFreg91 || minSobrelotadosFreg91 === 0){
        minSobrelotadosFreg91 = feature.properties.Sobrelot91
    }
    if(feature.properties.Sobrelot91 >= maxSobrelotadosFreg91 ){
        maxSobrelotadosFreg91 = feature.properties.Sobrelot91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSobrelotadosFreg(feature.properties.Sobrelot91)
    };
}
function apagarSobrelotadosFreg91(e) {
    SobrelotadosFreg91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureSobrelotadosFreg91(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos sobrelotados: ' + '<b>' + feature.properties.Sobrelot91.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarSobrelotadosFreg91,
    });
}
var SobrelotadosFreg91= L.geoJSON(dadosRelativosFreguesias91, {
    style:EstiloSobrelotadosFreg91,
    onEachFeature: onEachFeatureSobrelotadosFreg91
});
let slideSobrelotadosFreg91 = function(){
    var sliderSobrelotadosFreg91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderSobrelotadosFreg91, {
        start: [minSobrelotadosFreg91, maxSobrelotadosFreg91],
        tooltips:true,
        connect: true,
        range: {
            'min': minSobrelotadosFreg91,
            'max': maxSobrelotadosFreg91
        },
        });
    inputNumberMin.setAttribute("value",minSobrelotadosFreg91);
    inputNumberMax.setAttribute("value",maxSobrelotadosFreg91);

    inputNumberMin.addEventListener('change', function(){
        sliderSobrelotadosFreg91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSobrelotadosFreg91.noUiSlider.set([null, this.value]);
    });

    sliderSobrelotadosFreg91.noUiSlider.on('update',function(e){
        SobrelotadosFreg91.eachLayer(function(layer){
            if(layer.feature.properties.Sobrelot91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Sobrelot91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderSobrelotadosFreg91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderSobrelotadosFreg91.noUiSlider;
    $(slidersGeral).append(sliderSobrelotadosFreg91);
} 

 
//////////////////////--------- Fim ALOJAMENTOS SOBRELOTADOS POR FREGUESIAS EM 1991 -------------- \\\\\\

/////////////////////------------------- ALOJAMENTOS SOBRELOTADOS EM 2001 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minSobrelotadosFreg01 = 0;
var maxSobrelotadosFreg01 = 0;

function EstiloSobrelotadosFreg01(feature) {
    if( feature.properties.Sobrelot01 <= minSobrelotadosFreg01 || minSobrelotadosFreg01 === 0){
        minSobrelotadosFreg01 = feature.properties.Sobrelot01
    }
    if(feature.properties.Sobrelot01 >= maxSobrelotadosFreg01 ){
        maxSobrelotadosFreg01 = feature.properties.Sobrelot01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSobrelotadosFreg(feature.properties.Sobrelot01)
    };
}
function apagarSobrelotadosFreg01(e) {
    SobrelotadosFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureSobrelotadosFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos sobrelotados: ' + '<b>' + feature.properties.Sobrelot01.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarSobrelotadosFreg01,
    });
}
var SobrelotadosFreg01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloSobrelotadosFreg01,
    onEachFeature: onEachFeatureSobrelotadosFreg01
});
let slideSobrelotadosFreg01 = function(){
    var sliderSobrelotadosFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderSobrelotadosFreg01, {
        start: [minSobrelotadosFreg01, maxSobrelotadosFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minSobrelotadosFreg01,
            'max': maxSobrelotadosFreg01
        },
        });
    inputNumberMin.setAttribute("value",minSobrelotadosFreg01);
    inputNumberMax.setAttribute("value",maxSobrelotadosFreg01);

    inputNumberMin.addEventListener('change', function(){
        sliderSobrelotadosFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSobrelotadosFreg01.noUiSlider.set([null, this.value]);
    });

    sliderSobrelotadosFreg01.noUiSlider.on('update',function(e){
        SobrelotadosFreg01.eachLayer(function(layer){
            if(layer.feature.properties.Sobrelot01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Sobrelot01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderSobrelotadosFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderSobrelotadosFreg01.noUiSlider;
    $(slidersGeral).append(sliderSobrelotadosFreg01);
} 

 
//////////////////////--------- Fim ALOJAMENTOS SOBRELOTADOS POR FREGUESIAS EM 2001 -------------- \\\\\\

/////////////////////-------------------ALOJAMENTOS SOBRELOTADOS EM 2011 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minSobrelotadosFreg11 = 0;
var maxSobrelotadosFreg11 = 0;

function EstiloSobrelotadosFreg11(feature) {
    if( feature.properties.Sobrelot11 <= minSobrelotadosFreg11 || minSobrelotadosFreg11 === 0){
        minSobrelotadosFreg11 = feature.properties.Sobrelot11
    }
    if(feature.properties.Sobrelot11 >= maxSobrelotadosFreg11 ){
        maxSobrelotadosFreg11 = feature.properties.Sobrelot11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPerSobrelotadosFreg(feature.properties.Sobrelot11)
    };
}
function apagarSobrelotadosFreg11(e) {
    SobrelotadosFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureSobrelotadosFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Alojamentos sobrelotados: ' + '<b>' + feature.properties.Sobrelot11.toFixed(2) + '%' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarSobrelotadosFreg11,
    });
}
var SobrelotadosFreg11= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloSobrelotadosFreg11,
    onEachFeature: onEachFeatureSobrelotadosFreg11
});
let slideSobrelotadosFreg11 = function(){
    var sliderSobrelotadosFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderSobrelotadosFreg11, {
        start: [minSobrelotadosFreg11, maxSobrelotadosFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minSobrelotadosFreg11,
            'max': maxSobrelotadosFreg11
        },
        });
    inputNumberMin.setAttribute("value",minSobrelotadosFreg11);
    inputNumberMax.setAttribute("value",maxSobrelotadosFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderSobrelotadosFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSobrelotadosFreg11.noUiSlider.set([null, this.value]);
    });

    sliderSobrelotadosFreg11.noUiSlider.on('update',function(e){
        SobrelotadosFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Sobrelot11.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Sobrelot11.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderSobrelotadosFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderSobrelotadosFreg11.noUiSlider;
    $(slidersGeral).append(sliderSobrelotadosFreg11);
} 

 
//////////////////////--------- Fim ALOJAMENTOS SOBRELOTADOS POR FREGUESIAS EM 2011 -------------- \\\\\\

///////////////////////////--------------------------- VARIAÇÕES CONCELHOS ------------\\\\\\\\\\\\\\\\\\\\\

/////////////////////////////------- Variação ALOJAMENTOS SOBRELOTADOS POR  CONCELHOS ENTRE 2001 E 1991 -------------------////

var minVarSobrelotadosConc01_91 = 0;
var maxVarSobrelotadosConc01_91 = -50;

function CorVarSobrelotados01_91(d) {
    return d == null ? '#000000' :
        d >= -30  ? '#d9ffa8 ' :
        d >= -35 ? '#a7da81' :
        d >= -40   ? '#82c065' :
        d >= -44.02   ? '#60a74b' :
                ''  ;
}
var legendaVarSobrelotados01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos sobrelotados, entre 2001 e 1991, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#d9ffa8 "></i>' + '  > -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a7da81"></i>' + ' -35 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -40 a -35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -44.02 a -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#000000"></i>' + ' Sem informação disponível' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSobrelotadosConc01_91(feature) {
    if(feature.properties.Var01_91 <= minVarSobrelotadosConc01_91){
        minVarSobrelotadosConc01_91 = feature.properties.Var01_91
    } 
    if(feature.properties.Var01_91 >= maxVarSobrelotadosConc01_91 && feature.properties.Var01_91 != null){
        maxVarSobrelotadosConc01_91 = feature.properties.Var01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSobrelotados01_91(feature.properties.Var01_91)};
    }


function apagarVarSobrelotadosConc01_91(e) {
    VarSobrelotadosConc01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarSobrelotadosConc01_91(feature, layer) {
    if(feature.properties.Var01_91 === null){
        layer.bindPopup('<b>' +'Concelho da Trofa apenas foi criado em 1998' + '</b>').openPopup()
    }
    else{
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var01_91.toFixed(2) + '</b>' + '%').openPopup()
    }    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSobrelotadosConc01_91,
    });
}
var VarSobrelotadosConc01_91= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloVarSobrelotadosConc01_91,
    onEachFeature: onEachFeatureVarSobrelotadosConc01_91
});

let slideVarSobrelotadosConc01_91 = function(){
    var sliderVarSobrelotadosConc01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSobrelotadosConc01_91, {
        start: [minVarSobrelotadosConc01_91, maxVarSobrelotadosConc01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSobrelotadosConc01_91,
            'max': maxVarSobrelotadosConc01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarSobrelotadosConc01_91);
    inputNumberMax.setAttribute("value",maxVarSobrelotadosConc01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSobrelotadosConc01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSobrelotadosConc01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarSobrelotadosConc01_91.noUiSlider.on('update',function(e){
        VarSobrelotadosConc01_91.eachLayer(function(layer){
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
        sliderVarSobrelotadosConc01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderVarSobrelotadosConc01_91.noUiSlider;
    $(slidersGeral).append(sliderVarSobrelotadosConc01_91);
} 

///////////////////////////// Fim da Variação ALOJAMENTOS SOBRELOTADOS POR  CONCELHOS ENTRE 2001 E 1991 -------------- \\\\\

/////////////////////////////------- Variação ALOJAMENTOS SOBRELOTADOS POR  CONCELHOS ENTRE 2011 E 2001 -------------------////

var minVarSobrelotadosConc11_01 = 0;
var maxVarSobrelotadosConc11_01 = -99;

function CorVarSobrelotados11_01(d) {
    return d >= -30  ? '#d9ffa8 ' :
        d >= -35 ? '#a7da81' :
        d >= -40   ? '#82c065' :
        d >= -46.01   ? '#60a74b' :
                ''  ;
}
var legendaVarSobrelotados11_01 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos sobrelotados, entre 2011 e 2001, por concelho.' + '</strong>')

    symbolsContainer.innerHTML +=  '<i style="background:#d9ffa8 "></i>' + '  > -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a7da81"></i>' + ' -35 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -40 a -35' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -46 a -40' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSobrelotadosConc11_01(feature) {
    if(feature.properties.Var11_01 <= minVarSobrelotadosConc11_01){
        minVarSobrelotadosConc11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarSobrelotadosConc11_01){
        maxVarSobrelotadosConc11_01 = feature.properties.Var11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSobrelotados11_01(feature.properties.Var11_01)};
    }


function apagarVarSobrelotadosConc11_01(e) {
    VarSobrelotadosConc11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarSobrelotadosConc11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSobrelotadosConc11_01,
    });
}
var VarSobrelotadosConc11_01= L.geoJSON(dadosRelativosConcelhos11, {
    style:EstiloVarSobrelotadosConc11_01,
    onEachFeature: onEachFeatureVarSobrelotadosConc11_01
});

let slideVarSobrelotadosConc11_01 = function(){
    var sliderVarSobrelotadosConc11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSobrelotadosConc11_01, {
        start: [minVarSobrelotadosConc11_01, maxVarSobrelotadosConc11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSobrelotadosConc11_01,
            'max': maxVarSobrelotadosConc11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarSobrelotadosConc11_01);
    inputNumberMax.setAttribute("value",maxVarSobrelotadosConc11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSobrelotadosConc11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSobrelotadosConc11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarSobrelotadosConc11_01.noUiSlider.on('update',function(e){
        VarSobrelotadosConc11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSobrelotadosConc11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderVarSobrelotadosConc11_01.noUiSlider;
    $(slidersGeral).append(sliderVarSobrelotadosConc11_01);
} 

///////////////////////////// Fim da Variação ALOJAMENTOS SOBRELOTADOS POR  CONCELHOS ENTRE 2011 E 2001 -------------- \\\\\
/////////////////////////////-------------------- FIM VARIAÇÃO CONCELHOS------------------\\\\\\\\\\\\\\\\\
////////////////////////////------------------- VARIAÇÃO FREGUESIAS ---------------------\\\\\\\\\\\\\\


/////////////////////////////------- Variação ALOJAMENTOS SOBRELOTADOS POR  FREGUESIAS ENTRE 2001 E 1991 -------------------////

var minVarSobrelotadosFreg01_91 = 0;
var maxVarSobrelotadosFreg01_91 = -99;

function CorVarSobrelotados01_91Freg(d) {
    return d >= -20  ? '#d9ffa8 ' :
        d >= -30  ? '#a7da81' :
        d >= -40 ? '#82c065' :
        d >= -50   ? '#60a74b' :
        d >= -76.08   ? '#459436 ' :
                ''  ;
}
var legendaVarSobrelotados01_91Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")
    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos sobrelotados, entre 2001 e 1991, por freguesia.' + '</strong>')


    symbolsContainer.innerHTML +=  '<i style="background:#d9ffa8 "></i>' + '  > -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a7da81"></i>' + ' -30 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -40 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -50 a -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#459436 "></i>' + ' -76.07 a -50' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSobrelotadosFreg01_91(feature) {
    if(feature.properties.Var01_91 <= minVarSobrelotadosFreg01_91 || minVarSobrelotadosFreg01_91 ===0){
        minVarSobrelotadosFreg01_91 = feature.properties.Var01_91
    }
    if(feature.properties.Var01_91 > maxVarSobrelotadosFreg01_91){
        maxVarSobrelotadosFreg01_91 = feature.properties.Var01_91 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSobrelotados01_91Freg(feature.properties.Var01_91)};
    }


function apagarVarSobrelotadosFreg01_91(e) {
    VarSobrelotadosFreg01_91.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarSobrelotadosFreg01_91(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var01_91.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSobrelotadosFreg01_91,
    });
}
var VarSobrelotadosFreg01_91= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloVarSobrelotadosFreg01_91,
    onEachFeature: onEachFeatureVarSobrelotadosFreg01_91
});

let slideVarSobrelotadosFreg01_91 = function(){
    var sliderVarSobrelotadosFreg01_91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSobrelotadosFreg01_91, {
        start: [minVarSobrelotadosFreg01_91, maxVarSobrelotadosFreg01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSobrelotadosFreg01_91,
            'max': maxVarSobrelotadosFreg01_91
        },
        });
    inputNumberMin.setAttribute("value",minVarSobrelotadosFreg01_91);
    inputNumberMax.setAttribute("value",maxVarSobrelotadosFreg01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSobrelotadosFreg01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSobrelotadosFreg01_91.noUiSlider.set([null, this.value]);
    });

    sliderVarSobrelotadosFreg01_91.noUiSlider.on('update',function(e){
        VarSobrelotadosFreg01_91.eachLayer(function(layer){
            if(layer.feature.properties.Var01_91.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var01_91.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSobrelotadosFreg01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderVarSobrelotadosFreg01_91.noUiSlider;
    $(slidersGeral).append(sliderVarSobrelotadosFreg01_91);
} 

///////////////////////////// Fim da Variação ALOJAMENTOS SOBRELOTADOS POR  FREGUESIAS ENTRE 2001 E 1991 -------------- \\\\\

/////////////////////////////------- Variação ALOJAMENTOS SOBRELOTADOS POR  FREGUESIAS ENTRE 2011 E 2001 -------------------////

var minVarSobrelotadosFreg11_01 = 0;
var maxVarSobrelotadosFreg11_01 = -99;

function CorVarSobrelotados11_01Freg(d) {
    return d >= -20  ? '#d9ffa8 ' :
        d >= -30  ? '#a7da81' :
        d >= -40 ? '#82c065' :
        d >= -50   ? '#60a74b' :
        d >= -68.46   ? '#459436 ' :
                ''  ;
}
var legendaVarSobrelotados11_01Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    $('#tituloMapa').html(' <strong>' + 'Variação da proporção de alojamentos sobrelotados, entre 2011 e 2011, por freguesia.' + '</strong>')


    symbolsContainer.innerHTML +=  '<i style="background:#d9ffa8 "></i>' + '  > -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#a7da81"></i>' + ' -30 a -20' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#82c065"></i>' + ' -40 a -30' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#60a74b"></i>' + ' -50 a -40' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#459436 "></i>' + ' -68.45 a -50' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloVarSobrelotadosFreg11_01(feature) {
    if(feature.properties.Var11_01 <= minVarSobrelotadosFreg11_01){
        minVarSobrelotadosFreg11_01 = feature.properties.Var11_01
    }
    if(feature.properties.Var11_01 > maxVarSobrelotadosFreg11_01){
        maxVarSobrelotadosFreg11_01 = feature.properties.Var11_01 
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVarSobrelotados11_01Freg(feature.properties.Var11_01)};
    }


function apagarVarSobrelotadosFreg11_01(e) {
    VarSobrelotadosFreg11_01.resetStyle(e.target)
    e.target.closePopup();
} 

function onEachFeatureVarSobrelotadosFreg11_01(feature, layer) {
    layer.bindPopup( 'Freguesia'+ '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Variação: ' + '<b>' + feature.properties.Var11_01.toFixed(2) + '</b>' + '%').openPopup()
        layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarVarSobrelotadosFreg11_01,
    });
}
var VarSobrelotadosFreg11_01= L.geoJSON(dadosRelativosFreguesias11, {
    style:EstiloVarSobrelotadosFreg11_01,
    onEachFeature: onEachFeatureVarSobrelotadosFreg11_01
});

let slideVarSobrelotadosFreg11_01 = function(){
    var sliderVarSobrelotadosFreg11_01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVarSobrelotadosFreg11_01, {
        start: [minVarSobrelotadosFreg11_01, maxVarSobrelotadosFreg11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minVarSobrelotadosFreg11_01,
            'max': maxVarSobrelotadosFreg11_01
        },
        });
    inputNumberMin.setAttribute("value",minVarSobrelotadosFreg11_01);
    inputNumberMax.setAttribute("value",maxVarSobrelotadosFreg11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVarSobrelotadosFreg11_01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVarSobrelotadosFreg11_01.noUiSlider.set([null, this.value]);
    });

    sliderVarSobrelotadosFreg11_01.noUiSlider.on('update',function(e){
        VarSobrelotadosFreg11_01.eachLayer(function(layer){
            if(layer.feature.properties.Var11_01.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Var11_01.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVarSobrelotadosFreg11_01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderVarSobrelotadosFreg11_01.noUiSlider;
    $(slidersGeral).append(sliderVarSobrelotadosFreg11_01);
} 

///////////////////////////// Fim da Variação ALOJAMENTOS SOBRELOTADOS POR  FREGUESIAS ENTRE 2011 E 2001 -------------- \\\\\


var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = SobrelotadosConc91;
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
    if (layer == SobrelotadosConc91 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sobrelotados, em 1991, por concelho.' + '</strong>');
        legendaPerSobrelotadosConc();
        slideSobrelotadosConc91();
        naoDuplicar = 1;
    }
    if (layer == SobrelotadosConc91 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sobrelotados, em 1991, por concelho.' + '</strong>');
    }
    if (layer == SobrelotadosConc01 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sobrelotados, em 2001, por concelho.' + '</strong>');
        legendaPerSobrelotadosConc();
        slideSobrelotadosConc01();
        naoDuplicar = 2;
    }
    if (layer == SobrelotadosConc11 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sobrelotados, em 2011, por concelho.' + '</strong>');
        legendaPerSobrelotadosConc();
        slideSobrelotadosConc11();
        naoDuplicar = 3;
    }
    if (layer == SobrelotadosFreg91 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sobrelotados, em 1991, por freguesia.' + '</strong>');
        legendaPerSobrelotadosFreg();
        slideSobrelotadosFreg91();
        naoDuplicar = 4;
    }
    if (layer == SobrelotadosFreg01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sobrelotados, em 2001, por freguesia.' + '</strong>');
        legendaPerSobrelotadosFreg();
        slideSobrelotadosFreg01();
        naoDuplicar = 5;
    }
    if (layer == SobrelotadosFreg11 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Proporção de alojamentos sobrelotados, em 2011, por freguesia.' + '</strong>');
        legendaPerSobrelotadosFreg();
        slideSobrelotadosFreg11();
        naoDuplicar = 6;
    }
    if (layer == VarSobrelotadosConc01_91 && naoDuplicar != 7){
        legendaVarSobrelotados01_91();
        slideVarSobrelotadosConc01_91();
        naoDuplicar = 7;
    }
    if (layer == VarSobrelotadosConc11_01 && naoDuplicar != 8){
        legendaVarSobrelotados11_01();
        slideVarSobrelotadosConc11_01();
        naoDuplicar = 8;
    }
    if (layer == VarSobrelotadosFreg01_91 && naoDuplicar != 9){
        legendaVarSobrelotados01_91Freg();
        slideVarSobrelotadosFreg01_91();
        naoDuplicar = 9;
    }
    if (layer == VarSobrelotadosFreg11_01 && naoDuplicar != 10){
        legendaVarSobrelotados11_01Freg();
        slideVarSobrelotadosFreg11_01();
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
                novaLayer(SobrelotadosConc91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(SobrelotadosConc01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(SobrelotadosConc11);
            };
        }
        if ($('#taxaVariacao').hasClass('active4')){
            if(anoSelecionado == "2001"){
                novaLayer(VarSobrelotadosConc01_91)
            }
            if(anoSelecionado == "2011"){
                novaLayer(VarSobrelotadosConc11_01)
            }
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#percentagem').hasClass('active5')){
            if (anoSelecionado == "1991"){
                novaLayer(SobrelotadosFreg91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(SobrelotadosFreg01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(SobrelotadosFreg11);
            };
        }
        if ($('#taxaVariacao').hasClass('active5')){
            if(anoSelecionado == "2001"){
                novaLayer(VarSobrelotadosFreg01_91)
            }
            if(anoSelecionado == "2011"){
                novaLayer(VarSobrelotadosFreg11_01)
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
    $('#tituloMapa').html('Proporção de alojamentos sobrelotados, entre 1991 e 2011, %.');
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/SobrelotacaoProv.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $('#1991').html("1991")
        $.each(data, function(key, value){
            dados += '<tr>';
            if(containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                dados += '<td class="borderbottom bordertop">'+value.Sobrelotacao+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS1991+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2001+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2011+'</td>';
            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                dados += '<td>'+value.Sobrelotacao+'</td>';
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
    $('#tituloMapa').html('Variação da proporção de alojamentos sobrelotados, entre 1991 e 2011, %.');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/SobrelotacaoProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $('#1991').html(" ")
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+value.Sobrelotacao+'</td>';
                    dados += '<td class="borderbottom bordertop">'+ ''+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR0191+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.VAR1101+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                    dados += '<td>'+value.Sobrelotacao+'</td>';
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
