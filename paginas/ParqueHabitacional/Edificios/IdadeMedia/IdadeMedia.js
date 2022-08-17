
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

//////////////////-------------- ORIENTAÇÃO ----------\\\\\\\\\\\\\\\\\\\\
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
var contornoFreg1991 = L.geoJSON(idadeMediaFreguesias91,{
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
var legendaGradiente = function(titulo) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'divGradiente'
    var titulo = titulo;

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>");
    $(symbolsContainer).append("<div id='minimo'>"+ ' 0 ' + "</div>");
    $(symbolsContainer).append("<div id='grad1'></div>");
    $(symbolsContainer).append("<div id='maximo'>"+ '100 '+ "</div>");

    $(legendaA).append(symbolsContainer); 
}
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
function CorVariacao(d) {

    return d === null ? '#A9A9A9':
        d >= 100 ? '#ff7f7f' :
        d >= 80  ? '#ff8e86' :
        d >= 60   ? '#ff9d8d' :
        d >= 40 ? '#ffac93' :
        d >= 20 ? '#ffbb9a' :
        d >= 0  ? '#ffcaa1' :
        d >= -20  ? '#ffd9a7' :
        d >= -40   ? '#ffe8ae' :
        d >= -60   ? '#c3d0b4' :
        d >= -80 ? '#72acba':
        d >= -100   ? '#2288bf' :
                  '';
    }

function CorPercentagem(d) {
    return d === 100 ? '#fe821c' :
        d >= 95  ? '#fe8420' :
        d >= 90  ? '#fd8825' :
        d >= 85  ? '#fd8a28' :
        d >= 80   ? '#fd9131' :
        d >= 75  ? '#fc983c' :
        d >= 70   ? '#fb9c43' :
        d >= 65   ? '#fb9f47' :
        d >= 60  ? '#fba54f' :
        d >= 55   ? '#fbaa56' :
        d >= 50   ? '#fbb05e' :
        d >= 45  ? '#fbb666' :
        d >= 40   ? '#fbbe71' :
        d >= 35  ? '#fbc378' :
        d >= 30   ? '#fbc77e' :
        d >= 25   ? '#fbcb83' :
        d >= 20  ? '#fbd490' :
        d >= 15   ? '#fbd997' :
        d >= 10   ? '#fbe0a1' :
        d >= 5 ?  '#fbe9ad' :
        d >= 0 ?  '#fbf0b6' :
        d === null ? 'rgb(125,125,125':
                ''  ;
    }

/////////////////////////// -------------- FIM DADOS ABSOLUTOS, POR CONCELHO -------------------------\\\\\\\\\\\\\\\\\\\\\\\\
///////////////////////////----------------------- DADOS RELATIVOS, CONCELHO--------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////------- IDADE MÉDIA DOS EDIFÍCIOS por Concelho em 1991-----////////////////////////

var minIdadeMediaConc91 = 0;
var maxIdadeMediaConc91 = 0;

function CorPer1991Conc(d) {
    return d >= 57.43 ? '#8c0303' :
        d >= 52.52  ? '#de1f35' :
        d >= 44.32 ? '#ff5e6e' :
        d >= 36.13   ? '#f5b3be' :
        d >= 27.93   ? '#F2C572' :
                ''  ;
}
var legendaPer1991Conc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: Anos' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 57' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 52 - 57' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 44 - 52' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 36 - 44' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 27 - 36' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloIdadeMediaConc91(feature) {
    if(feature.properties.Ida_Med_91 <= minIdadeMediaConc91 || minIdadeMediaConc91 === 0){
        minIdadeMediaConc91 = feature.properties.Ida_Med_91
    }
    if(feature.properties.Ida_Med_91 >= maxIdadeMediaConc91 ){
        maxIdadeMediaConc91 = feature.properties.Ida_Med_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer1991Conc(feature.properties.Ida_Med_91)
    };
}
function apagarIdadeMediaConc91(e) {
    IdadeMediaConc91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIdadeMediaConc91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelhos + '</b>' + ' <br> '  + 'Idade média: ' + '<b>' + (feature.properties.Ida_Med_91-0.5).toFixed(0) + ' anos' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIdadeMediaConc91,
    });
}
var IdadeMediaConc91= L.geoJSON(idadeMediaConcelhos91, {
    style:EstiloIdadeMediaConc91,
    onEachFeature: onEachFeatureIdadeMediaConc91
});
let slideIdadeMediaConc91 = function(){
    var sliderIdadeMediaConc91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIdadeMediaConc91, {
        start: [minIdadeMediaConc91, maxIdadeMediaConc91],
        tooltips:true,
        connect: true,
        range: {
            'min': minIdadeMediaConc91,
            'max': maxIdadeMediaConc91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }
})  ;
    inputNumberMin.setAttribute("value",minIdadeMediaConc91.toFixed(0));
    inputNumberMax.setAttribute("value",maxIdadeMediaConc91.toFixed(0));

    inputNumberMin.addEventListener('change', function(){
        sliderIdadeMediaConc91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIdadeMediaConc91.noUiSlider.set([null, this.value]);
    });

    sliderIdadeMediaConc91.noUiSlider.on('update',function(e){
        IdadeMediaConc91.eachLayer(function(layer){
            if((layer.feature.properties.Ida_Med_91 - 0.5).toFixed(2)>=parseFloat(e[0])&& (layer.feature.properties.Ida_Med_91 - 0.5).toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIdadeMediaConc91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderIdadeMediaConc91.noUiSlider;
    $(slidersGeral).append(sliderIdadeMediaConc91);
} 
IdadeMediaConc91.addTo(map);
$('#tituloMapa').html('<strong>' + 'Idade média dos edifícios, em 1991, por concelho.' + '</strong>');
legendaPer1991Conc();
slideIdadeMediaConc91();
/////////////////////////////////// ---------Fim da IDADE MÉDIA EM 1991 Concelho -------------- \\\\\\\\\\\\\\\\\\\\

/////////////////////--------------------------- IDADE MÉDIA EM 2001 POR CONCELHO-----////////////////////////

var minIdadeMediaConc01 = 0;
var maxIdadeMediaConc01 = 0;

function EstiloIdadeMediaConc01(feature) {
    if( feature.properties.Ida_Med_01 <= minIdadeMediaConc01 || minIdadeMediaConc01 === 0){
        minIdadeMediaConc01 = feature.properties.Ida_Med_01
    }
    if(feature.properties.Ida_Med_01 >= maxIdadeMediaConc01 ){
        maxIdadeMediaConc01 = feature.properties.Ida_Med_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer1991Conc(feature.properties.Ida_Med_01)
    };
}
function apagarIdadeMediaConc01(e) {
    IdadeMediaConc01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIdadeMediaConc01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Idade média: ' + '<b>' + (feature.properties.Ida_Med_01-0.5).toFixed(0) + ' anos' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIdadeMediaConc01,
    });
}
var IdadeMediaConc01= L.geoJSON(idadeMediaConcelhos11, {
    style:EstiloIdadeMediaConc01,
    onEachFeature: onEachFeatureIdadeMediaConc01
});
let slideIdadeMediaConc01 = function(){
    var sliderIdadeMediaConc01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIdadeMediaConc01, {
        start: [minIdadeMediaConc01, maxIdadeMediaConc01],
        tooltips:true,
        connect: true,
        range: {
            'min': minIdadeMediaConc01,
            'max': maxIdadeMediaConc01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }
        });
    inputNumberMin.setAttribute("value",minIdadeMediaConc01.toFixed(0));
    inputNumberMax.setAttribute("value",maxIdadeMediaConc01.toFixed(0));

    inputNumberMin.addEventListener('change', function(){
        sliderIdadeMediaConc01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIdadeMediaConc01.noUiSlider.set([null, this.value]);
    });

    sliderIdadeMediaConc01.noUiSlider.on('update',function(e){
        IdadeMediaConc01.eachLayer(function(layer){
            if((layer.feature.properties.Ida_Med_01-0.5).toFixed(0)>=parseFloat(e[0])&& (layer.feature.properties.Ida_Med_01-0.5).toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIdadeMediaConc01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderIdadeMediaConc01.noUiSlider;
    $(slidersGeral).append(sliderIdadeMediaConc01);
}
/////////////////////////////////// Fim da IDADE MÉDIA EM 2001 POR CONCELHO -------------- \\\\\\

/////////////////////------------------- IDADE MÉDIA EM 2011 POR CONCELHO-----//\\\\\\\\//////////////////////

var minIdadeMediaConc11 = 0;
var maxIdadeMediaConc11 = 0;

function EstiloIdadeMediaConc11(feature) {
    if( feature.properties.Ida_Med_11 <= minIdadeMediaConc11 || minIdadeMediaConc11 === 0){
        minIdadeMediaConc11 = feature.properties.Ida_Med_11
    }
    if(feature.properties.Ida_Med_11 >= maxIdadeMediaConc11 ){
        maxIdadeMediaConc11 = feature.properties.Ida_Med_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer1991Conc(feature.properties.Ida_Med_11)
    };
}
function apagarIdadeMediaConc11(e) {
    IdadeMediaConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIdadeMediaConc11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Idade média: ' + '<b>' + (feature.properties.Ida_Med_11-0.5).toFixed(0) + ' anos' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIdadeMediaConc11,
    });
}
var IdadeMediaConc11= L.geoJSON(idadeMediaConcelhos11, {
    style:EstiloIdadeMediaConc11,
    onEachFeature: onEachFeatureIdadeMediaConc11
});
let slideIdadeMediaConc11 = function(){
    var sliderIdadeMediaConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIdadeMediaConc11, {
        start: [minIdadeMediaConc11, maxIdadeMediaConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minIdadeMediaConc11,
            'max': maxIdadeMediaConc11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }
        });
    inputNumberMin.setAttribute("value",minIdadeMediaConc11.toFixed(2));
    inputNumberMax.setAttribute("value",maxIdadeMediaConc11.toFixed(2));

    inputNumberMin.addEventListener('change', function(){
        sliderIdadeMediaConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIdadeMediaConc11.noUiSlider.set([null, this.value]);
    });

    sliderIdadeMediaConc11.noUiSlider.on('update',function(e){
        IdadeMediaConc11.eachLayer(function(layer){
            if((layer.feature.properties.Ida_Med_11-0.5).toFixed(0)>=parseFloat(e[0])&& (layer.feature.properties.Ida_Med_11-0.5).toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIdadeMediaConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderIdadeMediaConc11.noUiSlider;
    $(slidersGeral).append(sliderIdadeMediaConc11);
} 

/////////////////////////////////// Fim da Percentagem de IDADE MÉDIA EM 2011 Concelho -------------- \\\\\\


/////////////////////////---------------------- DADOS RELATIVOS, FREGUESIAS -------------------\\\\\\\\\\\\\\\\\\

/////////////////////------------------- IDADE MÉDIA EM 1991 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minIdadeMediaFreg91 = 0;
var maxIdadeMediaFreg91 = 0;

function CorPer1991Freg(d) {
    return d >= 78.86 ? '#8c0303' :
        d >= 68.51  ? '#de1f35' :
        d >= 51.25 ? '#ff5e6e' :
        d >= 34   ? '#f5b3be' :
        d >= 16.74   ? '#F2C572' :
                ''  ;
}
var legendaPer1991Freg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: Anos' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 78' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 68 - 78' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 51 - 68' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 34 - 51' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 17 - 34' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function EstiloIdadeMediaFreg91(feature) {
    if( feature.properties.Ida_Med_91 <= minIdadeMediaFreg91 || minIdadeMediaFreg91 === 0){
        minIdadeMediaFreg91 = feature.properties.Ida_Med_91
    }
    if(feature.properties.Ida_Med_91 >= maxIdadeMediaFreg91 ){
        maxIdadeMediaFreg91 = feature.properties.Ida_Med_91
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer1991Freg(feature.properties.Ida_Med_91)
    };
}
function apagarIdadeMediaFreg91(e) {
    IdadeMediaFreg91.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIdadeMediaFreg91(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Idade média: ' + '<b>' + (feature.properties.Ida_Med_91-0.5).toFixed(0)+ ' anos' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIdadeMediaFreg91,
    });
}
var IdadeMediaFreg91= L.geoJSON(idadeMediaFreguesias91, {
    style:EstiloIdadeMediaFreg91,
    onEachFeature: onEachFeatureIdadeMediaFreg91
});
let slideIdadeMediaFreg91 = function(){
    var sliderIdadeMediaFreg91 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIdadeMediaFreg91, {
        start: [minIdadeMediaFreg91, maxIdadeMediaFreg91],
        tooltips:true,
        connect: true,
        range: {
            'min': minIdadeMediaFreg91,
            'max': maxIdadeMediaFreg91
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
        }
    });
    inputNumberMin.setAttribute("value",minIdadeMediaFreg91.toFixed(0));
    inputNumberMax.setAttribute("value",maxIdadeMediaFreg91.toFixed(0));

    inputNumberMin.addEventListener('change', function(){
        sliderIdadeMediaFreg91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIdadeMediaFreg91.noUiSlider.set([null, this.value]);
    });

    sliderIdadeMediaFreg91.noUiSlider.on('update',function(e){
        IdadeMediaFreg91.eachLayer(function(layer){
            if((layer.feature.properties.Ida_Med_91-0.5).toFixed(0)>=parseFloat(e[0])&& (layer.feature.properties.Ida_Med_91-0.5).toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIdadeMediaFreg91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderIdadeMediaFreg91.noUiSlider;
    $(slidersGeral).append(sliderIdadeMediaFreg91);
} 

 
//////////////////////--------- Fim IDADE MÉDIA POR FREGUESIAS EM 1991 -------------- \\\\\\

/////////////////////------------------- IDADE MÉDIA EM 2001 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minIdadeMediaFreg01 = 0;
var maxIdadeMediaFreg01 = 0;

function EstiloIdadeMediaFreg01(feature) {
    if( feature.properties.Ida_Med_01 <= minIdadeMediaFreg01 || minIdadeMediaFreg01 === 0){
        minIdadeMediaFreg01 = feature.properties.Ida_Med_01
    }
    if(feature.properties.Ida_Med_01 >= maxIdadeMediaFreg01 ){
        maxIdadeMediaFreg01 = feature.properties.Ida_Med_01
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer1991Freg(feature.properties.Ida_Med_01)
    };
}
function apagarIdadeMediaFreg01(e) {
    IdadeMediaFreg01.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIdadeMediaFreg01(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Idade média: ' + '<b>' + (feature.properties.Ida_Med_01-0.5).toFixed(0)+ ' anos' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIdadeMediaFreg01,
    });
}
var IdadeMediaFreg01= L.geoJSON(idadeMediaFreguesias01, {
    style:EstiloIdadeMediaFreg01,
    onEachFeature: onEachFeatureIdadeMediaFreg01
});
let slideIdadeMediaFreg01 = function(){
    var sliderIdadeMediaFreg01 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIdadeMediaFreg01, {
        start: [minIdadeMediaFreg01, maxIdadeMediaFreg01],
        tooltips:true,
        connect: true,
        range: {
            'min': minIdadeMediaFreg01,
            'max': maxIdadeMediaFreg01
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
        }
        });
    inputNumberMin.setAttribute("value",minIdadeMediaFreg01.toFixed(0));
    inputNumberMax.setAttribute("value",maxIdadeMediaFreg01.toFixed(0));

    inputNumberMin.addEventListener('change', function(){
        sliderIdadeMediaFreg01.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIdadeMediaFreg01.noUiSlider.set([null, this.value]);
    });

    sliderIdadeMediaFreg01.noUiSlider.on('update',function(e){
        IdadeMediaFreg01.eachLayer(function(layer){
            if((layer.feature.properties.Ida_Med_01-0.5).toFixed(0)>=parseFloat(e[0])&& (layer.feature.properties.Ida_Med_01-0.5).toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIdadeMediaFreg01.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderIdadeMediaFreg01.noUiSlider;
    $(slidersGeral).append(sliderIdadeMediaFreg01);
} 

 
//////////////////////--------- Fim IDADE MÉDIA POR FREGUESIAS EM 2001 -------------- \\\\\\

/////////////////////------------------- IDADE MÉDIA EM 2011 POR FREGUESIA-----//\\\\\\\\//////////////////////

var minIdadeMediaFreg11 = 0;
var maxIdadeMediaFreg11 = 0;

function EstiloIdadeMediaFreg11(feature) {
    if( feature.properties.Ida_Med_11 <= minIdadeMediaFreg11 || minIdadeMediaFreg11 === 0){
        minIdadeMediaFreg11 = feature.properties.Ida_Med_11
    }
    if(feature.properties.Ida_Med_11 >= maxIdadeMediaFreg11 ){
        maxIdadeMediaFreg11 = feature.properties.Ida_Med_11
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPer1991Freg(feature.properties.Ida_Med_11)
    };
}
function apagarIdadeMediaFreg11(e) {
    IdadeMediaFreg11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureIdadeMediaFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> ' + 'Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Idade média: ' + '<b>' + (feature.properties.Ida_Med_11-0.5).toFixed(0)+ ' anos' + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarIdadeMediaFreg11,
    });
}
var IdadeMediaFreg11= L.geoJSON(idadeMediaFreguesias11, {
    style:EstiloIdadeMediaFreg11,
    onEachFeature: onEachFeatureIdadeMediaFreg11
});
let slideIdadeMediaFreg11 = function(){
    var sliderIdadeMediaFreg11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderIdadeMediaFreg11, {
        start: [minIdadeMediaFreg11, maxIdadeMediaFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minIdadeMediaFreg11,
            'max': maxIdadeMediaFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
        }
        });
    inputNumberMin.setAttribute("value",minIdadeMediaFreg11.toFixed(0));
    inputNumberMax.setAttribute("value",maxIdadeMediaFreg11.toFixed(0));

    inputNumberMin.addEventListener('change', function(){
        sliderIdadeMediaFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderIdadeMediaFreg11.noUiSlider.set([null, this.value]);
    });

    sliderIdadeMediaFreg11.noUiSlider.on('update',function(e){
        IdadeMediaFreg11.eachLayer(function(layer){
            if((layer.feature.properties.Ida_Med_11-0.5).toFixed(0)>=parseFloat(e[0])&& (layer.feature.properties.Ida_Med_11-0.5).toFixed(0) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderIdadeMediaFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderIdadeMediaFreg11.noUiSlider;
    $(slidersGeral).append(sliderIdadeMediaFreg11);
} 

 
//////////////////////--------- Fim IDADE MÉDIA POR FREGUESIAS EM 2011 -------------- \\\\\\


var exp = document.querySelector('.ine');
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'INE, Recenseamento da população e habitação';

/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = IdadeMediaConc91;
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
    if (layer == IdadeMediaConc91 && naoDuplicar != 1){
        $('#tituloMapa').html('<strong>' + 'Idade média dos edifícios, em 1991, por concelho.' + '</strong>');
        legendaPer1991Conc();
        slideIdadeMediaConc91();
        naoDuplicar = 1;
    }
    if (layer == IdadeMediaConc91 && naoDuplicar == 1){
        $('#tituloMapa').html('<strong>' + 'Idade média dos edifícios, em 1991, por concelho.' + '</strong>');
    }
    if (layer == IdadeMediaConc01 && naoDuplicar != 2){
        $('#tituloMapa').html('<strong>' + 'Idade média dos edifícios, em 2001, por concelho.' + '</strong>');
        legendaPer1991Conc();
        slideIdadeMediaConc01();
        naoDuplicar = 2;
    }
    if (layer == IdadeMediaConc11 && naoDuplicar != 3){
        $('#tituloMapa').html('<strong>' + 'Idade média dos edifícios, em 2011, por concelho.' + '</strong>');
        legendaPer1991Conc();
        slideIdadeMediaConc11();
        naoDuplicar = 3;
    }
    if (layer == IdadeMediaFreg91 && naoDuplicar != 4){
        $('#tituloMapa').html('<strong>' + 'Idade média dos edifícios, em 1991, por freguesia.' + '</strong>');
        legendaPer1991Freg();
        slideIdadeMediaFreg91();
        naoDuplicar = 4;
    }
    if (layer == IdadeMediaFreg01 && naoDuplicar != 5){
        $('#tituloMapa').html('<strong>' + 'Idade média dos edifícios, em 2001, por freguesia.' + '</strong>');
        legendaPer1991Freg();
        slideIdadeMediaFreg01();
        naoDuplicar = 5;
    }
    if (layer == IdadeMediaFreg11 && naoDuplicar != 6){
        $('#tituloMapa').html('<strong>' + 'Idade média dos edifícios, em 2011, por freguesia.' + '</strong>');
        legendaPer1991Freg();
        slideIdadeMediaFreg11();
        naoDuplicar = 6;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}
function myFunction() {
    var anoSelecionado = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#percentagem').hasClass('active4')){
            if (anoSelecionado == "1991"){
                novaLayer(IdadeMediaConc91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(IdadeMediaConc01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(IdadeMediaConc11);
            };
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if($('#percentagem').hasClass('active5')){
            if (anoSelecionado == "1991"){
                novaLayer(IdadeMediaFreg91);
            };
            if (anoSelecionado == "2001"){
                novaLayer(IdadeMediaFreg01);
            };
            if (anoSelecionado == "2011"){
                novaLayer(IdadeMediaFreg11);
            };
        }
    }
}


let primeirovalor = function(){
    $("#mySelect").val('1991');
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}

$('#percentagem').click(function(){
    myFunction()
    tamanhoOutros();    
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

        $('#percentagem').attr('class',"butao active4")
        novaLayer(IdadeMediaConc91);
        primeirovalor();
    }

}

let variaveisMapaFreguesias = function(){
    if($('#absoluto').hasClass('active5')){
        return false;
    }
    else{
        $('#percentagem').attr('class',"butao active5")
        novaLayer(IdadeMediaFreg91);
        primeirovalor();
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

    $('#tabelaDadosAbsolutos').attr("class","btn")
    $('#metaInformacao').css("visibility","visible");
    $('.btn').css("top","50%")
})

$('#opcaoTabela').click(function(){
    $('#mapa').css("width","100%");
    $('#painel').css("position","absolute");
    $('#opcaoTabela').attr("class","btn active3");
    $('#tabelaDadosAbsolutos').attr("class","btn active1");
    DadosAbsolutos();
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
    $('#notaRodape').remove();

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais");
    $('#freguesias').attr('class',"butaoEscala EscalasTerritoriais");
    $('.btn').css("top","10%");

});
$('#opcaoMapa').click(function(){
    novaLayer(IdadeMediaConc91);
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

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais active2")
    $('#freguesias').attr("class", "butaoEscala EscalasTerritoriais")
    $('#percentagem').attr("class","butao active4");
    

    $('#tabelaPercentagem').attr("class","btn");

    $('#opcaoTabela').attr("class","btn");

    $('#temporal').css("visibility","visible");
    $('#slidersGeral').css("visibility","visible");
    $('.btn').css("top","50%");



})
$('#tabelaDadosAbsolutos').click(function(){
    DadosAbsolutos();;   
});

function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
var DadosAbsolutos = function(){
    $('#tituloMapa').html('Idade média dos edifícios, entre 1991 e 2011, Anos. ');
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/IdadeMediaProv.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                if(containsAnyLetter(value.Concelho)){
                    dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.Freguesia+'</td>';;
                    dados += '<td class="borderbottom bordertop">'+value.IdadeMedia+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.DADOS1991.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td class="borderbottom bordertop">'+value.DADOS2011.toLocaleString("fr")+'</td>';
                }
                else{
                    dados += '<td>'+value.Concelho+'</td>';
                    dados += '<td>'+value.Freguesia+'</td>';
                    dados += '<td>'+value.IdadeMedia+'</td>';
                    dados += '<td>'+value.DADOS1991.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.DADOS2001.toLocaleString("fr")+'</td>';
                    dados += '<td>'+value.DADOS2011.toLocaleString("fr")+'</td>';
                    dados += '<tr>';
                }
                dados += '<tr>';
            })
        $('#juntarValores').append(dados);   
    });
})};

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
