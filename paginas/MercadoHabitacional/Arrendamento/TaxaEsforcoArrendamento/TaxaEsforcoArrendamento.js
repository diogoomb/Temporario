// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'

$('#tituloMapa').css('font-size','9pt')
$('#temporal').css("padding-top","0px");
$('.ine').css('display',"inline-block");
$('.ine').html('<strong>Fonte:</strong> Cálculos próprios.<strong>Fonte dos dados:</strong> INE, Estatísticas de Rendas da Habitação ao nível local, Estatísticas do rendimento ao nível local.');
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


/////////////////////////////////-------------------------- DADOS RELATIVOS CONCELHOS 

/////////////////////////------- Pecentil 80m2 2 Semestre, 2017-----////

var minPer80m2Sem17Conc = 100;
var maxPer80m2Sem17Conc = 0;

function CorTaxaEsforco80mConc(d) {
    return d >= 62.33 ? '#8c0303' :
        d >= 56.21  ? '#de1f35' :
        d >= 45.99 ? '#ff5e6e' :
        d >= 35.78   ? '#f5b3be' :
        d >= 25.56   ? '#F2C572' :
                ''  ;
}
var legendaTaxaEsforco80mConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 62.33' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 56.21 a 62.33' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 45.99 a 56.21' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 35.78 a 45.99' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 25.56 a 35.78' + '<br>'


    $(legendaA).append(symbolsContainer); 
}


function EstiloPer80m2Sem17Conc(feature) {
    if(feature.properties.Tx2_80_17 <= minPer80m2Sem17Conc || minPer80m2Sem17Conc === 0){
        minPer80m2Sem17Conc = feature.properties.Tx2_80_17
    }
    if(feature.properties.Tx2_80_17 >= maxPer80m2Sem17Conc ){
        maxPer80m2Sem17Conc = feature.properties.Tx2_80_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.Tx2_80_17)
    };
}
function apagarPer80m2Sem17Conc(e) {
    Per80m2Sem17Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer80m2Sem17Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx2_80_17  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer80m2Sem17Conc,
    });
}
var Per80m2Sem17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer80m2Sem17Conc,
    onEachFeature: onEachFeaturePer80m2Sem17Conc
});
let slidePer80m2Sem17Conc = function(){
    var sliderPer80m2Sem17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer80m2Sem17Conc, {
        start: [minPer80m2Sem17Conc, maxPer80m2Sem17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m2Sem17Conc,
            'max': maxPer80m2Sem17Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer80m2Sem17Conc);
    inputNumberMax.setAttribute("value",maxPer80m2Sem17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m2Sem17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m2Sem17Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer80m2Sem17Conc.noUiSlider.on('update',function(e){
        Per80m2Sem17Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx2_80_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx2_80_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer80m2Sem17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderPer80m2Sem17Conc.noUiSlider;
    $(slidersGeral).append(sliderPer80m2Sem17Conc);
} 
$('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2017, por concelho.' + '</strong>');
legendaTaxaEsforco80mConc();
slidePer80m2Sem17Conc();
/////////////////////////////// Fim do Pecentil 80m2 2 Semestre, 2017- -------------- \\\\\\


/////////////////////////------- Pecentil 100m2 2 Semestre, 2017-----////

var minPer100m2Sem17Conc = 100;
var maxPer100m2Sem17Conc = 0;

function CorTaxaEsforco100mConc(d) {
    return d >= 77.91 ? '#8c0303' :
        d >= 70.22  ? '#de1f35' :
        d >= 57.41 ? '#ff5e6e' :
        d >= 44.59   ? '#f5b3be' :
        d >= 31.78   ? '#F2C572' :
                ''  ;
}
var legendaTaxaEsforco100mConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 77.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 70.22 a 77.91' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 57.41 a 70.22' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 44.59 a 57.41' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 31.78 a 44.59' + '<br>'


    $(legendaA).append(symbolsContainer); 
}


function EstiloPer100m2Sem17Conc(feature) {
    if(feature.properties.Tx2_100_17 <= minPer100m2Sem17Conc || minPer100m2Sem17Conc === 0){
        minPer100m2Sem17Conc = feature.properties.Tx2_100_17
    }
    if(feature.properties.Tx2_100_17 >= maxPer100m2Sem17Conc ){
        maxPer100m2Sem17Conc = feature.properties.Tx2_100_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.Tx2_100_17)
    };
}
function apagarPer100m2Sem17Conc(e) {
    Per100m2Sem17Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer100m2Sem17Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx2_100_17  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer100m2Sem17Conc,
    });
}
var Per100m2Sem17Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer100m2Sem17Conc,
    onEachFeature: onEachFeaturePer100m2Sem17Conc
});
let slidePer100m2Sem17Conc = function(){
    var sliderPer100m2Sem17Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer100m2Sem17Conc, {
        start: [minPer100m2Sem17Conc, maxPer100m2Sem17Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m2Sem17Conc,
            'max': maxPer100m2Sem17Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer100m2Sem17Conc);
    inputNumberMax.setAttribute("value",maxPer100m2Sem17Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m2Sem17Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m2Sem17Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer100m2Sem17Conc.noUiSlider.on('update',function(e){
        Per100m2Sem17Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx2_100_17.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx2_100_17.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer100m2Sem17Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderPer100m2Sem17Conc.noUiSlider;
    $(slidersGeral).append(sliderPer100m2Sem17Conc);
} 

/////////////////////////////// Fim do Pecentil 100m2 2 Semestre, 2017- -------------- \\\\\\

/////////////////////////------- Pecentil 80m2 1 Semestre, 2018-----////

var minPer80m1Sem18Conc = 100;
var maxPer80m1Sem18Conc = 0;

function EstiloPer80m1Sem18Conc(feature) {
    if(feature.properties.Tx1_80_18 <= minPer80m1Sem18Conc || minPer80m1Sem18Conc === 0){
        minPer80m1Sem18Conc = feature.properties.Tx1_80_18
    }
    if(feature.properties.Tx1_80_18 >= maxPer80m1Sem18Conc ){
        maxPer80m1Sem18Conc = feature.properties.Tx1_80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.Tx1_80_18)
    };
}
function apagarPer80m1Sem18Conc(e) {
    Per80m1Sem18Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer80m1Sem18Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx1_80_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer80m1Sem18Conc,
    });
}
var Per80m1Sem18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer80m1Sem18Conc,
    onEachFeature: onEachFeaturePer80m1Sem18Conc
});
let slidePer80m1Sem18Conc = function(){
    var sliderPer80m1Sem18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer80m1Sem18Conc, {
        start: [minPer80m1Sem18Conc, maxPer80m1Sem18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m1Sem18Conc,
            'max': maxPer80m1Sem18Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer80m1Sem18Conc);
    inputNumberMax.setAttribute("value",maxPer80m1Sem18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m1Sem18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m1Sem18Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer80m1Sem18Conc.noUiSlider.on('update',function(e){
        Per80m1Sem18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx1_80_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx1_80_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer80m1Sem18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 3;
    sliderAtivo = sliderPer80m1Sem18Conc.noUiSlider;
    $(slidersGeral).append(sliderPer80m1Sem18Conc);
} 

/////////////////////////////// Fim do Pecentil 80m2 1 Semestre, 2018- -------------- \\\\\\


/////////////////////////------- Pecentil 100m2 1 Semestre, 2018-----////

var minPer100m1Sem18Conc = 100;
var maxPer100m1Sem18Conc = 0;

function EstiloPer100m1Sem18Conc(feature) {
    if(feature.properties.Tx1_100_18 <= minPer100m1Sem18Conc || minPer100m1Sem18Conc === 0){
        minPer100m1Sem18Conc = feature.properties.Tx1_100_18
    }
    if(feature.properties.Tx1_100_18 >= maxPer100m1Sem18Conc ){
        maxPer100m1Sem18Conc = feature.properties.Tx1_100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.Tx1_100_18)
    };
}
function apagarPer100m1Sem18Conc(e) {
    Per100m1Sem18Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer100m1Sem18Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx1_100_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer100m1Sem18Conc,
    });
}
var Per100m1Sem18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer100m1Sem18Conc,
    onEachFeature: onEachFeaturePer100m1Sem18Conc
});
let slidePer100m1Sem18Conc = function(){
    var sliderPer100m1Sem18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer100m1Sem18Conc, {
        start: [minPer100m1Sem18Conc, maxPer100m1Sem18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m1Sem18Conc,
            'max': maxPer100m1Sem18Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer100m1Sem18Conc);
    inputNumberMax.setAttribute("value",maxPer100m1Sem18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m1Sem18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m1Sem18Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer100m1Sem18Conc.noUiSlider.on('update',function(e){
        Per100m1Sem18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx1_100_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx1_100_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer100m1Sem18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderPer100m1Sem18Conc.noUiSlider;
    $(slidersGeral).append(sliderPer100m1Sem18Conc);
} 

/////////////////////////////// Fim do Pecentil 100m2 1 Semestre, 2018- -------------- \\\\\\

/////////////////////////------- Pecentil 80m2 2 Semestre, 2018-----////

var minPer80m2Sem18Conc = 100;
var maxPer80m2Sem18Conc = 0;

function EstiloPer80m2Sem18Conc(feature) {
    if(feature.properties.Tx2_80_18 <= minPer80m2Sem18Conc || minPer80m2Sem18Conc === 0){
        minPer80m2Sem18Conc = feature.properties.Tx2_80_18
    }
    if(feature.properties.Tx2_80_18 >= maxPer80m2Sem18Conc ){
        maxPer80m2Sem18Conc = feature.properties.Tx2_80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.Tx2_80_18)
    };
}
function apagarPer80m2Sem18Conc(e) {
    Per80m2Sem18Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer80m2Sem18Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx2_80_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer80m2Sem18Conc,
    });
}
var Per80m2Sem18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer80m2Sem18Conc,
    onEachFeature: onEachFeaturePer80m2Sem18Conc
});
let slidePer80m2Sem18Conc = function(){
    var sliderPer80m2Sem18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer80m2Sem18Conc, {
        start: [minPer80m2Sem18Conc, maxPer80m2Sem18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m2Sem18Conc,
            'max': maxPer80m2Sem18Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer80m2Sem18Conc);
    inputNumberMax.setAttribute("value",maxPer80m2Sem18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m2Sem18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m2Sem18Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer80m2Sem18Conc.noUiSlider.on('update',function(e){
        Per80m2Sem18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx2_80_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx2_80_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer80m2Sem18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 5;
    sliderAtivo = sliderPer80m2Sem18Conc.noUiSlider;
    $(slidersGeral).append(sliderPer80m2Sem18Conc);
} 

/////////////////////////////// Fim do Pecentil 80m2 2 Semestre, 2018- -------------- \\\\\\


/////////////////////////------- Pecentil 100m2 2 Semestre, 2018-----////

var minPer100m2Sem18Conc = 100;
var maxPer100m2Sem18Conc = 0;

function EstiloPer100m2Sem18Conc(feature) {
    if(feature.properties.Tx2_100_18 <= minPer100m2Sem18Conc || minPer100m2Sem18Conc === 0){
        minPer100m2Sem18Conc = feature.properties.Tx2_100_18
    }
    if(feature.properties.Tx2_100_18 >= maxPer100m2Sem18Conc ){
        maxPer100m2Sem18Conc = feature.properties.Tx2_100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.Tx2_100_18)
    };
}
function apagarPer100m2Sem18Conc(e) {
    Per100m2Sem18Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer100m2Sem18Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx2_100_18  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer100m2Sem18Conc,
    });
}
var Per100m2Sem18Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer100m2Sem18Conc,
    onEachFeature: onEachFeaturePer100m2Sem18Conc
});
let slidePer100m2Sem18Conc = function(){
    var sliderPer100m2Sem18Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer100m2Sem18Conc, {
        start: [minPer100m2Sem18Conc, maxPer100m2Sem18Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m2Sem18Conc,
            'max': maxPer100m2Sem18Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer100m2Sem18Conc);
    inputNumberMax.setAttribute("value",maxPer100m2Sem18Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m2Sem18Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m2Sem18Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer100m2Sem18Conc.noUiSlider.on('update',function(e){
        Per100m2Sem18Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx2_100_18.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx2_100_18.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer100m2Sem18Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 6;
    sliderAtivo = sliderPer100m2Sem18Conc.noUiSlider;
    $(slidersGeral).append(sliderPer100m2Sem18Conc);
} 

/////////////////////////////// Fim do Pecentil 100m2 2 Semestre, 2018- -------------- \\\\\\

/////////////////////////------- Pecentil 80m2 1 Semestre, 2019-----////

var minPer80m1Sem19Conc = 100;
var maxPer80m1Sem19Conc = 0;

function EstiloPer80m1Sem19Conc(feature) {
    if(feature.properties.Tx1_80_19 <= minPer80m1Sem19Conc || minPer80m1Sem19Conc === 0){
        minPer80m1Sem19Conc = feature.properties.Tx1_80_19
    }
    if(feature.properties.Tx1_80_19 >= maxPer80m1Sem19Conc ){
        maxPer80m1Sem19Conc = feature.properties.Tx1_80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.Tx1_80_19)
    };
}
function apagarPer80m1Sem19Conc(e) {
    Per80m1Sem19Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer80m1Sem19Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx1_80_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer80m1Sem19Conc,
    });
}
var Per80m1Sem19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer80m1Sem19Conc,
    onEachFeature: onEachFeaturePer80m1Sem19Conc
});
let slidePer80m1Sem19Conc = function(){
    var sliderPer80m1Sem19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer80m1Sem19Conc, {
        start: [minPer80m1Sem19Conc, maxPer80m1Sem19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m1Sem19Conc,
            'max': maxPer80m1Sem19Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer80m1Sem19Conc);
    inputNumberMax.setAttribute("value",maxPer80m1Sem19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m1Sem19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m1Sem19Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer80m1Sem19Conc.noUiSlider.on('update',function(e){
        Per80m1Sem19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx1_80_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx1_80_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer80m1Sem19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 7;
    sliderAtivo = sliderPer80m1Sem19Conc.noUiSlider;
    $(slidersGeral).append(sliderPer80m1Sem19Conc);
} 

/////////////////////////////// Fim do Pecentil 80m2 1 Semestre, 2019- -------------- \\\\\\


/////////////////////////------- Pecentil 100m2 1 Semestre, 2019-----////

var minPer100m1Sem19Conc = 100;
var maxPer100m1Sem19Conc = 0;

function EstiloPer100m1Sem19Conc(feature) {
    if(feature.properties.Tx1_100_19 <= minPer100m1Sem19Conc || minPer100m1Sem19Conc === 0){
        minPer100m1Sem19Conc = feature.properties.Tx1_100_19
    }
    if(feature.properties.Tx1_100_19 >= maxPer100m1Sem19Conc ){
        maxPer100m1Sem19Conc = feature.properties.Tx1_100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.Tx1_100_19)
    };
}
function apagarPer100m1Sem19Conc(e) {
    Per100m1Sem19Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer100m1Sem19Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx1_100_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer100m1Sem19Conc,
    });
}
var Per100m1Sem19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer100m1Sem19Conc,
    onEachFeature: onEachFeaturePer100m1Sem19Conc
});
let slidePer100m1Sem19Conc = function(){
    var sliderPer100m1Sem19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer100m1Sem19Conc, {
        start: [minPer100m1Sem19Conc, maxPer100m1Sem19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m1Sem19Conc,
            'max': maxPer100m1Sem19Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer100m1Sem19Conc);
    inputNumberMax.setAttribute("value",maxPer100m1Sem19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m1Sem19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m1Sem19Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer100m1Sem19Conc.noUiSlider.on('update',function(e){
        Per100m1Sem19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx1_100_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx1_100_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer100m1Sem19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderPer100m1Sem19Conc.noUiSlider;
    $(slidersGeral).append(sliderPer100m1Sem19Conc);
} 

/////////////////////////////// Fim do Pecentil 100m2 1 Semestre, 2019- -------------- \\\\\\
/////////////////////////------- Pecentil 80m2 2 Semestre, 2019-----////

var minPer80m2Sem19Conc = 100;
var maxPer80m2Sem19Conc = 0;

function EstiloPer80m2Sem19Conc(feature) {
    if(feature.properties.Tx2_80_19 <= minPer80m2Sem19Conc || minPer80m2Sem19Conc === 0){
        minPer80m2Sem19Conc = feature.properties.Tx2_80_19
    }
    if(feature.properties.Tx2_80_19 >= maxPer80m2Sem19Conc ){
        maxPer80m2Sem19Conc = feature.properties.Tx2_80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.Tx2_80_19)
    };
}
function apagarPer80m2Sem19Conc(e) {
    Per80m2Sem19Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer80m2Sem19Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx2_80_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer80m2Sem19Conc,
    });
}
var Per80m2Sem19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer80m2Sem19Conc,
    onEachFeature: onEachFeaturePer80m2Sem19Conc
});
let slidePer80m2Sem19Conc = function(){
    var sliderPer80m2Sem19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 9){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer80m2Sem19Conc, {
        start: [minPer80m2Sem19Conc, maxPer80m2Sem19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m2Sem19Conc,
            'max': maxPer80m2Sem19Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer80m2Sem19Conc);
    inputNumberMax.setAttribute("value",maxPer80m2Sem19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m2Sem19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m2Sem19Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer80m2Sem19Conc.noUiSlider.on('update',function(e){
        Per80m2Sem19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx2_80_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx2_80_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer80m2Sem19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 9;
    sliderAtivo = sliderPer80m2Sem19Conc.noUiSlider;
    $(slidersGeral).append(sliderPer80m2Sem19Conc);
} 

/////////////////////////////// Fim do Pecentil 80m2 2 Semestre, 2019- -------------- \\\\\\


/////////////////////////------- Pecentil 100m2 2 Semestre, 2019-----////

var minPer100m2Sem19Conc = 100;
var maxPer100m2Sem19Conc = 0;

function EstiloPer100m2Sem19Conc(feature) {
    if(feature.properties.Tx2_100_19 <= minPer100m2Sem19Conc || minPer100m2Sem19Conc === 0){
        minPer100m2Sem19Conc = feature.properties.Tx2_100_19
    }
    if(feature.properties.Tx2_100_19 >= maxPer100m2Sem19Conc ){
        maxPer100m2Sem19Conc = feature.properties.Tx2_100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.Tx2_100_19)
    };
}
function apagarPer100m2Sem19Conc(e) {
    Per100m2Sem19Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer100m2Sem19Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx2_100_19  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer100m2Sem19Conc,
    });
}
var Per100m2Sem19Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer100m2Sem19Conc,
    onEachFeature: onEachFeaturePer100m2Sem19Conc
});
let slidePer100m2Sem19Conc = function(){
    var sliderPer100m2Sem19Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 10){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer100m2Sem19Conc, {
        start: [minPer100m2Sem19Conc, maxPer100m2Sem19Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m2Sem19Conc,
            'max': maxPer100m2Sem19Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer100m2Sem19Conc);
    inputNumberMax.setAttribute("value",maxPer100m2Sem19Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m2Sem19Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m2Sem19Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer100m2Sem19Conc.noUiSlider.on('update',function(e){
        Per100m2Sem19Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx2_100_19.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx2_100_19.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer100m2Sem19Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 10;
    sliderAtivo = sliderPer100m2Sem19Conc.noUiSlider;
    $(slidersGeral).append(sliderPer100m2Sem19Conc);
} 

/////////////////////////////// Fim do Pecentil 100m2 2 Semestre, 2019- -------------- \\\\\\

/////////////////////////------- Pecentil 80m2 1 Semestre, 2020-----////

var minPer80m1Sem20Conc = 100;
var maxPer80m1Sem20Conc = 0;

function EstiloPer80m1Sem20Conc(feature) {
    if(feature.properties.Tx1_80_20 <= minPer80m1Sem20Conc || minPer80m1Sem20Conc === 0){
        minPer80m1Sem20Conc = feature.properties.Tx1_80_20
    }
    if(feature.properties.Tx1_80_20 >= maxPer80m1Sem20Conc ){
        maxPer80m1Sem20Conc = feature.properties.Tx1_80_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.Tx1_80_20)
    };
}
function apagarPer80m1Sem20Conc(e) {
    Per80m1Sem20Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer80m1Sem20Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx1_80_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer80m1Sem20Conc,
    });
}
var Per80m1Sem20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer80m1Sem20Conc,
    onEachFeature: onEachFeaturePer80m1Sem20Conc
});
let slidePer80m1Sem20Conc = function(){
    var sliderPer80m1Sem20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer80m1Sem20Conc, {
        start: [minPer80m1Sem20Conc, maxPer80m1Sem20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m1Sem20Conc,
            'max': maxPer80m1Sem20Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer80m1Sem20Conc);
    inputNumberMax.setAttribute("value",maxPer80m1Sem20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m1Sem20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m1Sem20Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer80m1Sem20Conc.noUiSlider.on('update',function(e){
        Per80m1Sem20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx1_80_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx1_80_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer80m1Sem20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 11;
    sliderAtivo = sliderPer80m1Sem20Conc.noUiSlider;
    $(slidersGeral).append(sliderPer80m1Sem20Conc);
} 

/////////////////////////////// Fim do Pecentil 80m2 1 Semestre, 2020- -------------- \\\\\\


/////////////////////////------- Pecentil 100m2 1 Semestre, 2020-----////

var minPer100m1Sem20Conc = 100;
var maxPer100m1Sem20Conc = 0;

function EstiloPer100m1Sem20Conc(feature) {
    if(feature.properties.Tx1_100_20 <= minPer100m1Sem20Conc || minPer100m1Sem20Conc === 0){
        minPer100m1Sem20Conc = feature.properties.Tx1_100_20
    }
    if(feature.properties.Tx1_100_20 >= maxPer100m1Sem20Conc ){
        maxPer100m1Sem20Conc = feature.properties.Tx1_100_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.Tx1_100_20)
    };
}
function apagarPer100m1Sem20Conc(e) {
    Per100m1Sem20Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer100m1Sem20Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx1_100_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer100m1Sem20Conc,
    });
}
var Per100m1Sem20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer100m1Sem20Conc,
    onEachFeature: onEachFeaturePer100m1Sem20Conc
});
let slidePer100m1Sem20Conc = function(){
    var sliderPer100m1Sem20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 12){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer100m1Sem20Conc, {
        start: [minPer100m1Sem20Conc, maxPer100m1Sem20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m1Sem20Conc,
            'max': maxPer100m1Sem20Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer100m1Sem20Conc);
    inputNumberMax.setAttribute("value",maxPer100m1Sem20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m1Sem20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m1Sem20Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer100m1Sem20Conc.noUiSlider.on('update',function(e){
        Per100m1Sem20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx1_100_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx1_100_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer100m1Sem20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 12;
    sliderAtivo = sliderPer100m1Sem20Conc.noUiSlider;
    $(slidersGeral).append(sliderPer100m1Sem20Conc);
} 

/////////////////////////////// Fim do Pecentil 100m2 1 Semestre, 2020- -------------- \\\\\\

/////////////////////////------- Pecentil 80m2 2 Semestre, 2020-----////

var minPer80m2Sem20Conc = 100;
var maxPer80m2Sem20Conc = 0;

function EstiloPer80m2Sem20Conc(feature) {
    if(feature.properties.Tx2_80_20 <= minPer80m2Sem20Conc || minPer80m2Sem20Conc === 0){
        minPer80m2Sem20Conc = feature.properties.Tx2_80_20
    }
    if(feature.properties.Tx2_80_20 >= maxPer80m2Sem20Conc ){
        maxPer80m2Sem20Conc = feature.properties.Tx2_80_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.Tx2_80_20)
    };
}
function apagarPer80m2Sem20Conc(e) {
    Per80m2Sem20Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer80m2Sem20Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx2_80_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer80m2Sem20Conc,
    });
}
var Per80m2Sem20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer80m2Sem20Conc,
    onEachFeature: onEachFeaturePer80m2Sem20Conc
});
let slidePer80m2Sem20Conc = function(){
    var sliderPer80m2Sem20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 13){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer80m2Sem20Conc, {
        start: [minPer80m2Sem20Conc, maxPer80m2Sem20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m2Sem20Conc,
            'max': maxPer80m2Sem20Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer80m2Sem20Conc);
    inputNumberMax.setAttribute("value",maxPer80m2Sem20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m2Sem20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m2Sem20Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer80m2Sem20Conc.noUiSlider.on('update',function(e){
        Per80m2Sem20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx2_80_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx2_80_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer80m2Sem20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 13;
    sliderAtivo = sliderPer80m2Sem20Conc.noUiSlider;
    $(slidersGeral).append(sliderPer80m2Sem20Conc);
} 

/////////////////////////////// Fim do Pecentil 80m2 2 Semestre, 2020- -------------- \\\\\\


/////////////////////////------- Pecentil 100m2 2 Semestre, 2020-----////

var minPer100m2Sem20Conc = 100;
var maxPer100m2Sem20Conc = 0;

function EstiloPer100m2Sem20Conc(feature) {
    if(feature.properties.Tx2_100_20 <= minPer100m2Sem20Conc || minPer100m2Sem20Conc === 0){
        minPer100m2Sem20Conc = feature.properties.Tx2_100_20
    }
    if(feature.properties.Tx2_100_20 >= maxPer100m2Sem20Conc ){
        maxPer100m2Sem20Conc = feature.properties.Tx2_100_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.Tx2_100_20)
    };
}
function apagarPer100m2Sem20Conc(e) {
    Per100m2Sem20Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer100m2Sem20Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx2_100_20  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer100m2Sem20Conc,
    });
}
var Per100m2Sem20Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer100m2Sem20Conc,
    onEachFeature: onEachFeaturePer100m2Sem20Conc
});
let slidePer100m2Sem20Conc = function(){
    var sliderPer100m2Sem20Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 14){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer100m2Sem20Conc, {
        start: [minPer100m2Sem20Conc, maxPer100m2Sem20Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m2Sem20Conc,
            'max': maxPer100m2Sem20Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer100m2Sem20Conc);
    inputNumberMax.setAttribute("value",maxPer100m2Sem20Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m2Sem20Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m2Sem20Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer100m2Sem20Conc.noUiSlider.on('update',function(e){
        Per100m2Sem20Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx2_100_20.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx2_100_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer100m2Sem20Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 14;
    sliderAtivo = sliderPer100m2Sem20Conc.noUiSlider;
    $(slidersGeral).append(sliderPer100m2Sem20Conc);
} 

/////////////////////////////// Fim do Pecentil 100m2 2 Semestre, 2020- -------------- \\\\\\


/////////////////////////------- Pecentil 80m2 1 Semestre, 2021-----////

var minPer80m1Sem21Conc = 100;
var maxPer80m1Sem21Conc = 0;

function EstiloPer80m1Sem21Conc(feature) {
    if(feature.properties.Tx1_80_21 <= minPer80m1Sem21Conc || minPer80m1Sem21Conc === 0){
        minPer80m1Sem21Conc = feature.properties.Tx1_80_21
    }
    if(feature.properties.Tx1_80_21 >= maxPer80m1Sem21Conc ){
        maxPer80m1Sem21Conc = feature.properties.Tx1_80_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.Tx1_80_21)
    };
}
function apagarPer80m1Sem21Conc(e) {
    Per80m1Sem21Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer80m1Sem21Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx1_80_21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer80m1Sem21Conc,
    });
}
var Per80m1Sem21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer80m1Sem21Conc,
    onEachFeature: onEachFeaturePer80m1Sem21Conc
});
let slidePer80m1Sem21Conc = function(){
    var sliderPer80m1Sem21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 29){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer80m1Sem21Conc, {
        start: [minPer80m1Sem21Conc, maxPer80m1Sem21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m1Sem21Conc,
            'max': maxPer80m1Sem21Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer80m1Sem21Conc);
    inputNumberMax.setAttribute("value",maxPer80m1Sem21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m1Sem21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m1Sem21Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer80m1Sem21Conc.noUiSlider.on('update',function(e){
        Per80m1Sem21Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx1_80_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx1_80_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer80m1Sem21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 29;
    sliderAtivo = sliderPer80m1Sem21Conc.noUiSlider;
    $(slidersGeral).append(sliderPer80m1Sem21Conc);
} 

/////////////////////////////// Fim do Pecentil 80m2 1 Semestre, 2021- -------------- \\\\\\


/////////////////////////------- Pecentil 100m2 1 Semestre, 2021-----////

var minPer100m1Sem21Conc = 100;
var maxPer100m1Sem21Conc = 0;

function EstiloPer100m1Sem21Conc(feature) {
    if(feature.properties.Tx1_100_21 <= minPer100m1Sem21Conc || minPer100m1Sem21Conc === 0){
        minPer100m1Sem21Conc = feature.properties.Tx1_100_21
    }
    if(feature.properties.Tx1_100_21 >= maxPer100m1Sem21Conc ){
        maxPer100m1Sem21Conc = feature.properties.Tx1_100_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.Tx1_100_21)
    };
}
function apagarPer100m1Sem21Conc(e) {
    Per100m1Sem21Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer100m1Sem21Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx1_100_21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer100m1Sem21Conc,
    });
}
var Per100m1Sem21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer100m1Sem21Conc,
    onEachFeature: onEachFeaturePer100m1Sem21Conc
});
let slidePer100m1Sem21Conc = function(){
    var sliderPer100m1Sem21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 30){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer100m1Sem21Conc, {
        start: [minPer100m1Sem21Conc, maxPer100m1Sem21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m1Sem21Conc,
            'max': maxPer100m1Sem21Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer100m1Sem21Conc);
    inputNumberMax.setAttribute("value",maxPer100m1Sem21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m1Sem21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m1Sem21Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer100m1Sem21Conc.noUiSlider.on('update',function(e){
        Per100m1Sem21Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx1_100_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx1_100_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer100m1Sem21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 30;
    sliderAtivo = sliderPer100m1Sem21Conc.noUiSlider;
    $(slidersGeral).append(sliderPer100m1Sem21Conc);
} 

/////////////////////////////// Fim do Pecentil 100m2 1 Semestre, 2021- -------------- \\\\\\

/////////////////////////------- Pecentil 80m2 2 Semestre, 2021-----////

var minPer80m2Sem21Conc = 100;
var maxPer80m2Sem21Conc = 0;

function EstiloPer80m2Sem21Conc(feature) {
    if(feature.properties.Tx2_80_21 <= minPer80m2Sem21Conc || minPer80m2Sem21Conc === 0){
        minPer80m2Sem21Conc = feature.properties.Tx2_80_21
    }
    if(feature.properties.Tx2_80_21 >= maxPer80m2Sem21Conc ){
        maxPer80m2Sem21Conc = feature.properties.Tx2_80_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mConc(feature.properties.Tx2_80_21)
    };
}
function apagarPer80m2Sem21Conc(e) {
    Per80m2Sem21Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer80m2Sem21Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx2_80_21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer80m2Sem21Conc,
    });
}
var Per80m2Sem21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer80m2Sem21Conc,
    onEachFeature: onEachFeaturePer80m2Sem21Conc
});
let slidePer80m2Sem21Conc = function(){
    var sliderPer80m2Sem21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 31){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer80m2Sem21Conc, {
        start: [minPer80m2Sem21Conc, maxPer80m2Sem21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m2Sem21Conc,
            'max': maxPer80m2Sem21Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer80m2Sem21Conc);
    inputNumberMax.setAttribute("value",maxPer80m2Sem21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m2Sem21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m2Sem21Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer80m2Sem21Conc.noUiSlider.on('update',function(e){
        Per80m2Sem21Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx2_80_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx2_80_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer80m2Sem21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 31;
    sliderAtivo = sliderPer80m2Sem21Conc.noUiSlider;
    $(slidersGeral).append(sliderPer80m2Sem21Conc);
} 

/////////////////////////////// Fim do Pecentil 80m2 2 Semestre, 2021- -------------- \\\\\\


/////////////////////////------- Pecentil 100m2 2 Semestre, 2021-----////

var minPer100m2Sem21Conc = 100;
var maxPer100m2Sem21Conc = 0;

function EstiloPer100m2Sem21Conc(feature) {
    if(feature.properties.Tx2_100_21 <= minPer100m2Sem21Conc || minPer100m2Sem21Conc === 0){
        minPer100m2Sem21Conc = feature.properties.Tx2_100_21
    }
    if(feature.properties.Tx2_100_21 >= maxPer100m2Sem21Conc ){
        maxPer100m2Sem21Conc = feature.properties.Tx2_100_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mConc(feature.properties.Tx2_100_21)
    };
}
function apagarPer100m2Sem21Conc(e) {
    Per100m2Sem21Conc.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeaturePer100m2Sem21Conc(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Taxa de esforço: ' + '<b>' + feature.properties.Tx2_100_21  + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarPer100m2Sem21Conc,
    });
}
var Per100m2Sem21Conc= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloPer100m2Sem21Conc,
    onEachFeature: onEachFeaturePer100m2Sem21Conc
});
let slidePer100m2Sem21Conc = function(){
    var sliderPer100m2Sem21Conc = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 32){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPer100m2Sem21Conc, {
        start: [minPer100m2Sem21Conc, maxPer100m2Sem21Conc],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m2Sem21Conc,
            'max': maxPer100m2Sem21Conc
        },
        });
    inputNumberMin.setAttribute("value",minPer100m2Sem21Conc);
    inputNumberMax.setAttribute("value",maxPer100m2Sem21Conc);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m2Sem21Conc.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m2Sem21Conc.noUiSlider.set([null, this.value]);
    });

    sliderPer100m2Sem21Conc.noUiSlider.on('update',function(e){
        Per100m2Sem21Conc.eachLayer(function(layer){
            if(layer.feature.properties.Tx2_100_21.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Tx2_100_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderPer100m2Sem21Conc.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 32;
    sliderAtivo = sliderPer100m2Sem21Conc.noUiSlider;
    $(slidersGeral).append(sliderPer100m2Sem21Conc);
} 

/////////////////////////////// Fim do Pecentil 100m2 2 Semestre, 2021- -------------- \\\\\\

//////////////////--------------- FIM CONCELHOS


////////////////////////////////////----------- PERCENTAGEM 80M2 2 SEMESTRE 2017,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer80m2Sem17Freg= 999;
var maxPer80m2Sem17Freg = 0;

function CorTaxaEsforco80mFreg(d) {
    return d == null ? '#808080' :
        d >= 67.38 ? '#8c0303' :
        d >= 59.90  ? '#de1f35' :
        d >= 47.44 ? '#ff5e6e' :
        d >= 34.98   ? '#f5b3be' :
        d >= 22.52   ? '#F2C572' :
                ''  ;
}
var legendaTaxaEsforco80mFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 67.38' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 59.90 a 67.38' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 47.44 a 59.90' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 34.98 a 47.44' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 22.52 a 34.98' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function estiloPer80m2Sem17Freg(feature) {
    if(feature.properties.Tx2_80_17 <= minPer80m2Sem17Freg &&  feature.properties.Tx2_80_17 > null || feature.properties.Tx2_80_17 ===0){
        minPer80m2Sem17Freg = feature.properties.Tx2_80_17
    }
    if(feature.properties.Tx2_80_17 >= maxPer80m2Sem17Freg && feature.properties.Tx2_80_17 > null){
        maxPer80m2Sem17Freg = feature.properties.Tx2_80_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.Tx2_80_17)
    };
}
function apagarPer80m2Sem17Freg(e){
    var layer = e.target;
    Per80m2Sem17Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer80m2Sem17Freg(feature, layer) {
    if (feature.properties.Tx2_80_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx2_80_17 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer80m2Sem17Freg,
    })
};

var Per80m2Sem17Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer80m2Sem17Freg,
    onEachFeature: onEachFeaturePer80m2Sem17Freg,
});

var slidePer80m2Sem17Freg = function(){
    var sliderPer80m2Sem17Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer80m2Sem17Freg, {
        start: [minPer80m2Sem17Freg, maxPer80m2Sem17Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m2Sem17Freg,
            'max': maxPer80m2Sem17Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer80m2Sem17Freg);
    inputNumberMax.setAttribute("value",maxPer80m2Sem17Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m2Sem17Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m2Sem17Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer80m2Sem17Freg.noUiSlider.on('update',function(e){
        Per80m2Sem17Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx2_80_17 == null){
                return false
            }
            if(layer.feature.properties.Tx2_80_17 >= parseFloat(e[0])&& layer.feature.properties.Tx2_80_17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer80m2Sem17Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 15;
    sliderAtivo = sliderPer80m2Sem17Freg.noUiSlider;
    $(slidersGeral).append(sliderPer80m2Sem17Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 80M2 2 SEMESTRE 2017, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 100M2 2 SEMESTRE 2017,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer100m2Sem17Freg= 999;
var maxPer100m2Sem17Freg = 0;

function CorTaxaEsforco100mFreg(d) {
    return d == null ? '#808080' :
        d >= 84.23 ? '#8c0303' :
        d >= 74.88  ? '#de1f35' :
        d >= 59.31 ? '#ff5e6e' :
        d >= 43.73   ? '#f5b3be' :
        d >= 28.15   ? '#F2C572' :
                ''  ;
}
var legendaTaxaEsforco100mFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: %' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 84.23' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 74.88 a 84.23' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 59.31 a 74.88' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 43.73 a 59.31' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 28.15 a 43.73' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#808080"></i>' + ' Cálculo não aplicável' + '<br>'


    $(legendaA).append(symbolsContainer); 
}

function estiloPer100m2Sem17Freg(feature) {
    if(feature.properties.Tx2_100_17 < minPer100m2Sem17Freg &&  feature.properties.Tx2_100_17 > null || feature.properties.Tx2_100_17 ===0){
        minPer100m2Sem17Freg = feature.properties.Tx2_100_17
    }
    if(feature.properties.Tx2_100_17> maxPer100m2Sem17Freg && feature.properties.Tx2_100_17 > null){
        maxPer100m2Sem17Freg = feature.properties.Tx2_100_17
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.Tx2_100_17)
    };
}
function apagarPer100m2Sem17Freg(e){
    var layer = e.target;
    Per100m2Sem17Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer100m2Sem17Freg(feature, layer) {
    if (feature.properties.Tx2_100_17 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx2_100_17 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer100m2Sem17Freg,
    })
};

var Per100m2Sem17Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer100m2Sem17Freg,
    onEachFeature: onEachFeaturePer100m2Sem17Freg,
});

var slidePer100m2Sem17Freg = function(){
    var sliderPer100m2Sem17Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer100m2Sem17Freg, {
        start: [minPer100m2Sem17Freg, maxPer100m2Sem17Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m2Sem17Freg,
            'max': maxPer100m2Sem17Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer100m2Sem17Freg);
    inputNumberMax.setAttribute("value",maxPer100m2Sem17Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m2Sem17Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m2Sem17Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer100m2Sem17Freg.noUiSlider.on('update',function(e){
        Per100m2Sem17Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx2_100_17 == null){
                return false
            }
            if(layer.feature.properties.Tx2_100_17>=parseFloat(e[0])&& layer.feature.properties.Tx2_100_17 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer100m2Sem17Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 16;
    sliderAtivo = sliderPer100m2Sem17Freg.noUiSlider;
    $(slidersGeral).append(sliderPer100m2Sem17Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 100M2 2 SEMESTRE 2017, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM 80M2 1 SEMESTRE 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer80m1Sem18Freg= 999;
var maxPer80m1Sem18Freg = 0;
function estiloPer80m1Sem18Freg(feature) {
    if(feature.properties.Tx1_80_18 < minPer80m1Sem18Freg &&  feature.properties.Tx1_80_18 > null || feature.properties.Tx1_80_18 ===0){
        minPer80m1Sem18Freg = feature.properties.Tx1_80_18
    }
    if(feature.properties.Tx1_80_18> maxPer80m1Sem18Freg && feature.properties.Tx1_80_18 > null){
        maxPer80m1Sem18Freg = feature.properties.Tx1_80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.Tx1_80_18)
    };
}
function apagarPer80m1Sem18Freg(e){
    var layer = e.target;
    Per80m1Sem18Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer80m1Sem18Freg(feature, layer) {
    if (feature.properties.Tx1_80_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx1_80_18 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer80m1Sem18Freg,
    })
};

var Per80m1Sem18Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer80m1Sem18Freg,
    onEachFeature: onEachFeaturePer80m1Sem18Freg,
});

var slidePer80m1Sem18Freg = function(){
    var sliderPer80m1Sem18Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer80m1Sem18Freg, {
        start: [minPer80m1Sem18Freg, maxPer80m1Sem18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m1Sem18Freg,
            'max': maxPer80m1Sem18Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer80m1Sem18Freg);
    inputNumberMax.setAttribute("value",maxPer80m1Sem18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m1Sem18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m1Sem18Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer80m1Sem18Freg.noUiSlider.on('update',function(e){
        Per80m1Sem18Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx1_80_18 == null){
                return false
            }
            if(layer.feature.properties.Tx1_80_18>=parseFloat(e[0])&& layer.feature.properties.Tx1_80_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer80m1Sem18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 17;
    sliderAtivo = sliderPer80m1Sem18Freg.noUiSlider;
    $(slidersGeral).append(sliderPer80m1Sem18Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 80M2 1 SEMESTRE 2018, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 100M2 1 SEMESTRE 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer100m1Sem18Freg= 999;
var maxPer100m1Sem18Freg = 0;
function estiloPer100m1Sem18Freg(feature) {
    if(feature.properties.Tx1_100_18 < minPer100m1Sem18Freg &&  feature.properties.Tx1_100_18 > null || feature.properties.Tx1_100_18 ===0){
        minPer100m1Sem18Freg = feature.properties.Tx1_100_18
    }
    if(feature.properties.Tx1_100_18> maxPer100m1Sem18Freg && feature.properties.Tx1_100_18 > null){
        maxPer100m1Sem18Freg = feature.properties.Tx1_100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.Tx1_100_18)
    };
}
function apagarPer100m1Sem18Freg(e){
    var layer = e.target;
    Per100m1Sem18Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer100m1Sem18Freg(feature, layer) {
    if (feature.properties.Tx1_100_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx1_100_18 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer100m1Sem18Freg,
    })
};

var Per100m1Sem18Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer100m1Sem18Freg,
    onEachFeature: onEachFeaturePer100m1Sem18Freg,
});

var slidePer100m1Sem18Freg = function(){
    var sliderPer100m1Sem18Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 18){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer100m1Sem18Freg, {
        start: [minPer100m1Sem18Freg, maxPer100m1Sem18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m1Sem18Freg,
            'max': maxPer100m1Sem18Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer100m1Sem18Freg);
    inputNumberMax.setAttribute("value",maxPer100m1Sem18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m1Sem18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m1Sem18Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer100m1Sem18Freg.noUiSlider.on('update',function(e){
        Per100m1Sem18Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx1_100_18 == null){
                return false
            }
            if(layer.feature.properties.Tx1_100_18>=parseFloat(e[0])&& layer.feature.properties.Tx1_100_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer100m1Sem18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 18;
    sliderAtivo = sliderPer100m1Sem18Freg.noUiSlider;
    $(slidersGeral).append(sliderPer100m1Sem18Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 100M2 1 SEMESTRE 2018, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 80M2 2 SEMESTRE 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer80m2Sem18Freg= 999;
var maxPer80m2Sem18Freg = 0;
function estiloPer80m2Sem18Freg(feature) {
    if(feature.properties.Tx2_80_18 < minPer80m2Sem18Freg &&  feature.properties.Tx2_80_18 > null || feature.properties.Tx2_80_18 ===0){
        minPer80m2Sem18Freg = feature.properties.Tx2_80_18
    }
    if(feature.properties.Tx2_80_18> maxPer80m2Sem18Freg && feature.properties.Tx2_80_18 > null){
        maxPer80m2Sem18Freg = feature.properties.Tx2_80_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.Tx2_80_18)
    };
}
function apagarPer80m2Sem18Freg(e){
    var layer = e.target;
    Per80m2Sem18Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer80m2Sem18Freg(feature, layer) {
    if (feature.properties.Tx2_80_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx2_80_18 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer80m2Sem18Freg,
    })
};

var Per80m2Sem18Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer80m2Sem18Freg,
    onEachFeature: onEachFeaturePer80m2Sem18Freg,
});

var slidePer80m2Sem18Freg = function(){
    var sliderPer80m2Sem18Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 19){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer80m2Sem18Freg, {
        start: [minPer80m2Sem18Freg, maxPer80m2Sem18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m2Sem18Freg,
            'max': maxPer80m2Sem18Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer80m2Sem18Freg);
    inputNumberMax.setAttribute("value",maxPer80m2Sem18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m2Sem18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m2Sem18Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer80m2Sem18Freg.noUiSlider.on('update',function(e){
        Per80m2Sem18Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx2_80_18 == null){
                return false
            }
            if(layer.feature.properties.Tx2_80_18>=parseFloat(e[0])&& layer.feature.properties.Tx2_80_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer80m2Sem18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 19;
    sliderAtivo = sliderPer80m2Sem18Freg.noUiSlider;
    $(slidersGeral).append(sliderPer80m2Sem18Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 80M2 2 SEMESTRE 2018, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 100M2 2 SEMESTRE 2018,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer100m2Sem18Freg= 999;
var maxPer100m2Sem18Freg = 0;
function estiloPer100m2Sem18Freg(feature) {
    if(feature.properties.Tx2_100_18 < minPer100m2Sem18Freg &&  feature.properties.Tx2_100_18 > null || feature.properties.Tx2_100_18 ===0){
        minPer100m2Sem18Freg = feature.properties.Tx2_100_18
    }
    if(feature.properties.Tx2_100_18> maxPer100m2Sem18Freg && feature.properties.Tx2_100_18 > null){
        maxPer100m2Sem18Freg = feature.properties.Tx2_100_18
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.Tx2_100_18)
    };
}
function apagarPer100m2Sem18Freg(e){
    var layer = e.target;
    Per100m2Sem18Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer100m2Sem18Freg(feature, layer) {
    if (feature.properties.Tx2_100_18 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx2_100_18 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer100m2Sem18Freg,
    })
};

var Per100m2Sem18Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer100m2Sem18Freg,
    onEachFeature: onEachFeaturePer100m2Sem18Freg,
});

var slidePer100m2Sem18Freg = function(){
    var sliderPer100m2Sem18Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 20){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer100m2Sem18Freg, {
        start: [minPer100m2Sem18Freg, maxPer100m2Sem18Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m2Sem18Freg,
            'max': maxPer100m2Sem18Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer100m2Sem18Freg);
    inputNumberMax.setAttribute("value",maxPer100m2Sem18Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m2Sem18Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m2Sem18Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer100m2Sem18Freg.noUiSlider.on('update',function(e){
        Per100m2Sem18Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx2_100_18 == null){
                return false
            }
            if(layer.feature.properties.Tx2_100_18>=parseFloat(e[0])&& layer.feature.properties.Tx2_100_18 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer100m2Sem18Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 20;
    sliderAtivo = sliderPer100m2Sem18Freg.noUiSlider;
    $(slidersGeral).append(sliderPer100m2Sem18Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 100M2 2 SEMESTRE 2018, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\



////////////////////////////////////----------- PERCENTAGEM 80M2 1 SEMESTRE 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer80m1Sem19Freg= 999;
var maxPer80m1Sem19Freg = 0;
function estiloPer80m1Sem19Freg(feature) {
    if(feature.properties.Tx1_80_19 < minPer80m1Sem19Freg &&  feature.properties.Tx1_80_19 > null || feature.properties.Tx1_80_19 ===0){
        minPer80m1Sem19Freg = feature.properties.Tx1_80_19
    }
    if(feature.properties.Tx1_80_19> maxPer80m1Sem19Freg && feature.properties.Tx1_80_19 > null){
        maxPer80m1Sem19Freg = feature.properties.Tx1_80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.Tx1_80_19)
    };
}
function apagarPer80m1Sem19Freg(e){
    var layer = e.target;
    Per80m1Sem19Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer80m1Sem19Freg(feature, layer) {
    if (feature.properties.Tx1_80_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx1_80_19 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer80m1Sem19Freg,
    })
};

var Per80m1Sem19Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer80m1Sem19Freg,
    onEachFeature: onEachFeaturePer80m1Sem19Freg,
});

var slidePer80m1Sem19Freg = function(){
    var sliderPer80m1Sem19Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 21){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer80m1Sem19Freg, {
        start: [minPer80m1Sem19Freg, maxPer80m1Sem19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m1Sem19Freg,
            'max': maxPer80m1Sem19Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer80m1Sem19Freg);
    inputNumberMax.setAttribute("value",maxPer80m1Sem19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m1Sem19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m1Sem19Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer80m1Sem19Freg.noUiSlider.on('update',function(e){
        Per80m1Sem19Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx1_80_19 == null){
                return false
            }
            if(layer.feature.properties.Tx1_80_19>=parseFloat(e[0])&& layer.feature.properties.Tx1_80_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer80m1Sem19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 21;
    sliderAtivo = sliderPer80m1Sem19Freg.noUiSlider;
    $(slidersGeral).append(sliderPer80m1Sem19Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 80M2 1 SEMESTRE 2019, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 100M2 1 SEMESTRE 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer100m1Sem19Freg= 999;
var maxPer100m1Sem19Freg = 0;
function estiloPer100m1Sem19Freg(feature) {
    if(feature.properties.Tx1_100_19 < minPer100m1Sem19Freg &&  feature.properties.Tx1_100_19 > null || feature.properties.Tx1_100_19 ===0){
        minPer100m1Sem19Freg = feature.properties.Tx1_100_19
    }
    if(feature.properties.Tx1_100_19> maxPer100m1Sem19Freg && feature.properties.Tx1_100_19 > null){
        maxPer100m1Sem19Freg = feature.properties.Tx1_100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.Tx1_100_19)
    };
}
function apagarPer100m1Sem19Freg(e){
    var layer = e.target;
    Per100m1Sem19Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer100m1Sem19Freg(feature, layer) {
    if (feature.properties.Tx1_100_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx1_100_19 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer100m1Sem19Freg,
    })
};

var Per100m1Sem19Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer100m1Sem19Freg,
    onEachFeature: onEachFeaturePer100m1Sem19Freg,
});

var slidePer100m1Sem19Freg = function(){
    var sliderPer100m1Sem19Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 22){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer100m1Sem19Freg, {
        start: [minPer100m1Sem19Freg, maxPer100m1Sem19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m1Sem19Freg,
            'max': maxPer100m1Sem19Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer100m1Sem19Freg);
    inputNumberMax.setAttribute("value",maxPer100m1Sem19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m1Sem19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m1Sem19Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer100m1Sem19Freg.noUiSlider.on('update',function(e){
        Per100m1Sem19Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx1_100_19 == null){
                return false
            }
            if(layer.feature.properties.Tx1_100_19>=parseFloat(e[0])&& layer.feature.properties.Tx1_100_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer100m1Sem19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 22;
    sliderAtivo = sliderPer100m1Sem19Freg.noUiSlider;
    $(slidersGeral).append(sliderPer100m1Sem19Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 100M2 1 SEMESTRE 2019, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\



////////////////////////////////////----------- PERCENTAGEM 80M2 2 SEMESTRE 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer80m2Sem19Freg= 999;
var maxPer80m2Sem19Freg = 0;
function estiloPer80m2Sem19Freg(feature) {
    if(feature.properties.Tx2_80_19 < minPer80m2Sem19Freg &&  feature.properties.Tx2_80_19 > null || feature.properties.Tx2_80_19 ===0){
        minPer80m2Sem19Freg = feature.properties.Tx2_80_19
    }
    if(feature.properties.Tx2_80_19> maxPer80m2Sem19Freg && feature.properties.Tx2_80_19 > null){
        maxPer80m2Sem19Freg = feature.properties.Tx2_80_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.Tx2_80_19)
    };
}
function apagarPer80m2Sem19Freg(e){
    var layer = e.target;
    Per80m2Sem19Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer80m2Sem19Freg(feature, layer) {
    if (feature.properties.Tx2_80_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx2_80_19 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer80m2Sem19Freg,
    })
};

var Per80m2Sem19Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer80m2Sem19Freg,
    onEachFeature: onEachFeaturePer80m2Sem19Freg,
});

var slidePer80m2Sem19Freg = function(){
    var sliderPer80m2Sem19Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 23){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer80m2Sem19Freg, {
        start: [minPer80m2Sem19Freg, maxPer80m2Sem19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m2Sem19Freg,
            'max': maxPer80m2Sem19Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer80m2Sem19Freg);
    inputNumberMax.setAttribute("value",maxPer80m2Sem19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m2Sem19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m2Sem19Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer80m2Sem19Freg.noUiSlider.on('update',function(e){
        Per80m2Sem19Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx2_80_19 == null){
                return false
            }
            if(layer.feature.properties.Tx2_80_19>=parseFloat(e[0])&& layer.feature.properties.Tx2_80_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer80m2Sem19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 23;
    sliderAtivo = sliderPer80m2Sem19Freg.noUiSlider;
    $(slidersGeral).append(sliderPer80m2Sem19Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 80M2 2 SEMESTRE 2019, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 100M2 2 SEMESTRE 2019,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer100m2Sem19Freg= 999;
var maxPer100m2Sem19Freg = 0;
function estiloPer100m2Sem19Freg(feature) {
    if(feature.properties.Tx2_100_19 <= minPer100m2Sem19Freg &&  feature.properties.Tx2_100_19 > null || feature.properties.Tx2_100_19 ===0){
        minPer100m2Sem19Freg = feature.properties.Tx2_100_19
    }
    if(feature.properties.Tx2_100_19 >= maxPer100m2Sem19Freg && feature.properties.Tx2_100_19 > null){
        maxPer100m2Sem19Freg = feature.properties.Tx2_100_19
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.Tx2_100_19)
    };
}
function apagarPer100m2Sem19Freg(e){
    var layer = e.target;
    Per100m2Sem19Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer100m2Sem19Freg(feature, layer) {
    if (feature.properties.Tx2_100_19 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx2_100_19 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer100m2Sem19Freg,
    })
};

var Per100m2Sem19Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer100m2Sem19Freg,
    onEachFeature: onEachFeaturePer100m2Sem19Freg,
});

var slidePer100m2Sem19Freg = function(){
    var sliderPer100m2Sem19Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 24){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer100m2Sem19Freg, {
        start: [minPer100m2Sem19Freg, maxPer100m2Sem19Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m2Sem19Freg,
            'max': maxPer100m2Sem19Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer100m2Sem19Freg);
    inputNumberMax.setAttribute("value",maxPer100m2Sem19Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m2Sem19Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m2Sem19Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer100m2Sem19Freg.noUiSlider.on('update',function(e){
        Per100m2Sem19Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx2_100_19 == null){
                return false
            }
            if(layer.feature.properties.Tx2_100_19>=parseFloat(e[0])&& layer.feature.properties.Tx2_100_19 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer100m2Sem19Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 24;
    sliderAtivo = sliderPer100m2Sem19Freg.noUiSlider;
    $(slidersGeral).append(sliderPer100m2Sem19Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 100M2 2 SEMESTRE 2019, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM 80M2 1 SEMESTRE 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer80m1Sem20Freg= 999;
var maxPer80m1Sem20Freg = 0;
function estiloPer80m1Sem20Freg(feature) {
    if(feature.properties.Tx1_80_20 < minPer80m1Sem20Freg &&  feature.properties.Tx1_80_20 > null || feature.properties.Tx1_80_20 ===0){
        minPer80m1Sem20Freg = feature.properties.Tx1_80_20
    }
    if(feature.properties.Tx1_80_20> maxPer80m1Sem20Freg && feature.properties.Tx1_80_20 > null){
        maxPer80m1Sem20Freg = feature.properties.Tx1_80_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.Tx1_80_20)
    };
}
function apagarPer80m1Sem20Freg(e){
    var layer = e.target;
    Per80m1Sem20Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer80m1Sem20Freg(feature, layer) {
    if (feature.properties.Tx1_80_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx1_80_20 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer80m1Sem20Freg,
    })
};

var Per80m1Sem20Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer80m1Sem20Freg,
    onEachFeature: onEachFeaturePer80m1Sem20Freg,
});

var slidePer80m1Sem20Freg = function(){
    var sliderPer80m1Sem20Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 25){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer80m1Sem20Freg, {
        start: [minPer80m1Sem20Freg, maxPer80m1Sem20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m1Sem20Freg,
            'max': maxPer80m1Sem20Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer80m1Sem20Freg);
    inputNumberMax.setAttribute("value",maxPer80m1Sem20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m1Sem20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m1Sem20Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer80m1Sem20Freg.noUiSlider.on('update',function(e){
        Per80m1Sem20Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx1_80_20 == null){
                return false
            }
            if(layer.feature.properties.Tx1_80_20>=parseFloat(e[0])&& layer.feature.properties.Tx1_80_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer80m1Sem20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 25;
    sliderAtivo = sliderPer80m1Sem20Freg.noUiSlider;
    $(slidersGeral).append(sliderPer80m1Sem20Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 80M2 1 SEMESTRE 2020, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 100M2 1 SEMESTRE 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer100m1Sem20Freg= 999;
var maxPer100m1Sem20Freg = 0;
function estiloPer100m1Sem20Freg(feature) {
    if(feature.properties.Tx1_100_20 < minPer100m1Sem20Freg &&  feature.properties.Tx1_100_20 > null || feature.properties.Tx1_100_20 ===0){
        minPer100m1Sem20Freg = feature.properties.Tx1_100_20
    }
    if(feature.properties.Tx1_100_20> maxPer100m1Sem20Freg && feature.properties.Tx1_100_20 > null){
        maxPer100m1Sem20Freg = feature.properties.Tx1_100_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.Tx1_100_20)
    };
}
function apagarPer100m1Sem20Freg(e){
    var layer = e.target;
    Per100m1Sem20Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer100m1Sem20Freg(feature, layer) {
    if (feature.properties.Tx1_100_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx1_100_20 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer100m1Sem20Freg,
    })
};

var Per100m1Sem20Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer100m1Sem20Freg,
    onEachFeature: onEachFeaturePer100m1Sem20Freg,
});

var slidePer100m1Sem20Freg = function(){
    var sliderPer100m1Sem20Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 26){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer100m1Sem20Freg, {
        start: [minPer100m1Sem20Freg, maxPer100m1Sem20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m1Sem20Freg,
            'max': maxPer100m1Sem20Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer100m1Sem20Freg);
    inputNumberMax.setAttribute("value",maxPer100m1Sem20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m1Sem20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m1Sem20Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer100m1Sem20Freg.noUiSlider.on('update',function(e){
        Per100m1Sem20Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx1_100_20 == null){
                return false
            }
            if(layer.feature.properties.Tx1_100_20>=parseFloat(e[0])&& layer.feature.properties.Tx1_100_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer100m1Sem20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 26;
    sliderAtivo = sliderPer100m1Sem20Freg.noUiSlider;
    $(slidersGeral).append(sliderPer100m1Sem20Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 100M2 1 SEMESTRE 2020, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\



////////////////////////////////////----------- PERCENTAGEM 80M2 2 SEMESTRE 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer80m2Sem20Freg= 999;
var maxPer80m2Sem20Freg = 0;
function estiloPer80m2Sem20Freg(feature) {
    if(feature.properties.Tx2_80_20 < minPer80m2Sem20Freg &&  feature.properties.Tx2_80_20 > null || feature.properties.Tx2_80_20 ===0){
        minPer80m2Sem20Freg = feature.properties.Tx2_80_20
    }
    if(feature.properties.Tx2_80_20> maxPer80m2Sem20Freg && feature.properties.Tx2_80_20 > null){
        maxPer80m2Sem20Freg = feature.properties.Tx2_80_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.Tx2_80_20)
    };
}
function apagarPer80m2Sem20Freg(e){
    var layer = e.target;
    Per80m2Sem20Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer80m2Sem20Freg(feature, layer) {
    if (feature.properties.Tx2_80_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx2_80_20 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer80m2Sem20Freg,
    })
};

var Per80m2Sem20Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer80m2Sem20Freg,
    onEachFeature: onEachFeaturePer80m2Sem20Freg,
});

var slidePer80m2Sem20Freg = function(){
    var sliderPer80m2Sem20Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 27){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer80m2Sem20Freg, {
        start: [minPer80m2Sem20Freg, maxPer80m2Sem20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m2Sem20Freg,
            'max': maxPer80m2Sem20Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer80m2Sem20Freg);
    inputNumberMax.setAttribute("value",maxPer80m2Sem20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m2Sem20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m2Sem20Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer80m2Sem20Freg.noUiSlider.on('update',function(e){
        Per80m2Sem20Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx2_80_20 == null){
                return false
            }
            if(layer.feature.properties.Tx2_80_20>=parseFloat(e[0])&& layer.feature.properties.Tx2_80_20 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer80m2Sem20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 27;
    sliderAtivo = sliderPer80m2Sem20Freg.noUiSlider;
    $(slidersGeral).append(sliderPer80m2Sem20Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 80M2 2 SEMESTRE 2020, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 100M2 2 SEMESTRE 2020,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer100m2Sem20Freg= 999;
var maxPer100m2Sem20Freg = 0;
function estiloPer100m2Sem20Freg(feature) {
    if(feature.properties.Tx2_100_20 <= minPer100m2Sem20Freg &&  feature.properties.Tx2_100_20 > null || feature.properties.Tx2_100_20 ===0){
        minPer100m2Sem20Freg = feature.properties.Tx2_100_20
    }
    if(feature.properties.Tx2_100_20 > maxPer100m2Sem20Freg && feature.properties.Tx2_100_20 > null){
        maxPer100m2Sem20Freg = feature.properties.Tx2_100_20
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.Tx2_100_20)
    };
}
function apagarPer100m2Sem20Freg(e){
    var layer = e.target;
    Per100m2Sem20Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer100m2Sem20Freg(feature, layer) {
    if (feature.properties.Tx2_100_20 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx2_100_20 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer100m2Sem20Freg,
    })
};

var Per100m2Sem20Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer100m2Sem20Freg,
    onEachFeature: onEachFeaturePer100m2Sem20Freg,
});

var slidePer100m2Sem20Freg = function(){
    var sliderPer100m2Sem20Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 28){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer100m2Sem20Freg, {
        start: [minPer100m2Sem20Freg, maxPer100m2Sem20Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m2Sem20Freg,
            'max': maxPer100m2Sem20Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer100m2Sem20Freg);
    inputNumberMax.setAttribute("value",maxPer100m2Sem20Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m2Sem20Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m2Sem20Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer100m2Sem20Freg.noUiSlider.on('update',function(e){
        Per100m2Sem20Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx2_100_20 == null){
                return false
            }
            if(layer.feature.properties.Tx2_100_20.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.Tx2_100_20.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer100m2Sem20Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 28;
    sliderAtivo = sliderPer100m2Sem20Freg.noUiSlider;
    $(slidersGeral).append(sliderPer100m2Sem20Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 100M2 2 SEMESTRE 2020, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////////////----------- PERCENTAGEM 80M2 1 SEMESTRE 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer80m1Sem21Freg= 999;
var maxPer80m1Sem21Freg = 0;
function estiloPer80m1Sem21Freg(feature) {
    if(feature.properties.Tx1_80_21 < minPer80m1Sem21Freg &&  feature.properties.Tx1_80_21 > null || feature.properties.Tx1_80_21 ===0){
        minPer80m1Sem21Freg = feature.properties.Tx1_80_21
    }
    if(feature.properties.Tx1_80_21> maxPer80m1Sem21Freg && feature.properties.Tx1_80_21 > null){
        maxPer80m1Sem21Freg = feature.properties.Tx1_80_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.Tx1_80_21)
    };
}
function apagarPer80m1Sem21Freg(e){
    var layer = e.target;
    Per80m1Sem21Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer80m1Sem21Freg(feature, layer) {
    if (feature.properties.Tx1_80_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx1_80_21 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer80m1Sem21Freg,
    })
};

var Per80m1Sem21Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer80m1Sem21Freg,
    onEachFeature: onEachFeaturePer80m1Sem21Freg,
});

var slidePer80m1Sem21Freg = function(){
    var sliderPer80m1Sem21Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 33){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer80m1Sem21Freg, {
        start: [minPer80m1Sem21Freg, maxPer80m1Sem21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m1Sem21Freg,
            'max': maxPer80m1Sem21Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer80m1Sem21Freg);
    inputNumberMax.setAttribute("value",maxPer80m1Sem21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m1Sem21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m1Sem21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer80m1Sem21Freg.noUiSlider.on('update',function(e){
        Per80m1Sem21Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx1_80_21 == null){
                return false
            }
            if(layer.feature.properties.Tx1_80_21>=parseFloat(e[0])&& layer.feature.properties.Tx1_80_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer80m1Sem21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 33;
    sliderAtivo = sliderPer80m1Sem21Freg.noUiSlider;
    $(slidersGeral).append(sliderPer80m1Sem21Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 80M2 1 SEMESTRE 2021, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 100M2 1 SEMESTRE 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer100m1Sem21Freg= 999;
var maxPer100m1Sem21Freg = 0;
function estiloPer100m1Sem21Freg(feature) {
    if(feature.properties.Tx1_100_21 < minPer100m1Sem21Freg &&  feature.properties.Tx1_100_21 > null || feature.properties.Tx1_100_21 ===0){
        minPer100m1Sem21Freg = feature.properties.Tx1_100_21
    }
    if(feature.properties.Tx1_100_21> maxPer100m1Sem21Freg && feature.properties.Tx1_100_21 > null){
        maxPer100m1Sem21Freg = feature.properties.Tx1_100_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.Tx1_100_21)
    };
}
function apagarPer100m1Sem21Freg(e){
    var layer = e.target;
    Per100m1Sem21Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer100m1Sem21Freg(feature, layer) {
    if (feature.properties.Tx1_100_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx1_100_21 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer100m1Sem21Freg,
    })
};

var Per100m1Sem21Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer100m1Sem21Freg,
    onEachFeature: onEachFeaturePer100m1Sem21Freg,
});

var slidePer100m1Sem21Freg = function(){
    var sliderPer100m1Sem21Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 34){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer100m1Sem21Freg, {
        start: [minPer100m1Sem21Freg, maxPer100m1Sem21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m1Sem21Freg,
            'max': maxPer100m1Sem21Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer100m1Sem21Freg);
    inputNumberMax.setAttribute("value",maxPer100m1Sem21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m1Sem21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m1Sem21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer100m1Sem21Freg.noUiSlider.on('update',function(e){
        Per100m1Sem21Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx1_100_21 == null){
                return false
            }
            if(layer.feature.properties.Tx1_100_21>=parseFloat(e[0])&& layer.feature.properties.Tx1_100_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer100m1Sem21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 34;
    sliderAtivo = sliderPer100m1Sem21Freg.noUiSlider;
    $(slidersGeral).append(sliderPer100m1Sem21Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 100M2 1 SEMESTRE 2021, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\



////////////////////////////////////----------- PERCENTAGEM 80M2 2 SEMESTRE 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer80m2Sem21Freg= 999;
var maxPer80m2Sem21Freg = 0;
function estiloPer80m2Sem21Freg(feature) {
    if(feature.properties.Tx2_80_21 < minPer80m2Sem21Freg &&  feature.properties.Tx2_80_21 > null || feature.properties.Tx2_80_21 ===0){
        minPer80m2Sem21Freg = feature.properties.Tx2_80_21
    }
    if(feature.properties.Tx2_80_21> maxPer80m2Sem21Freg && feature.properties.Tx2_80_21 > null){
        maxPer80m2Sem21Freg = feature.properties.Tx2_80_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco80mFreg(feature.properties.Tx2_80_21)
    };
}
function apagarPer80m2Sem21Freg(e){
    var layer = e.target;
    Per80m2Sem21Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer80m2Sem21Freg(feature, layer) {
    if (feature.properties.Tx2_80_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx2_80_21 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer80m2Sem21Freg,
    })
};

var Per80m2Sem21Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer80m2Sem21Freg,
    onEachFeature: onEachFeaturePer80m2Sem21Freg,
});

var slidePer80m2Sem21Freg = function(){
    var sliderPer80m2Sem21Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 35){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer80m2Sem21Freg, {
        start: [minPer80m2Sem21Freg, maxPer80m2Sem21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer80m2Sem21Freg,
            'max': maxPer80m2Sem21Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer80m2Sem21Freg);
    inputNumberMax.setAttribute("value",maxPer80m2Sem21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer80m2Sem21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer80m2Sem21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer80m2Sem21Freg.noUiSlider.on('update',function(e){
        Per80m2Sem21Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx2_80_21 == null){
                return false
            }
            if(layer.feature.properties.Tx2_80_21>=parseFloat(e[0])&& layer.feature.properties.Tx2_80_21 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer80m2Sem21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 35;
    sliderAtivo = sliderPer80m2Sem21Freg.noUiSlider;
    $(slidersGeral).append(sliderPer80m2Sem21Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 80M2 2 SEMESTRE 2021, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- PERCENTAGEM 100M2 2 SEMESTRE 2021,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minPer100m2Sem21Freg= 999;
var maxPer100m2Sem21Freg = 0;
function estiloPer100m2Sem21Freg(feature) {
    if(feature.properties.Tx2_100_21 <= minPer100m2Sem21Freg &&  feature.properties.Tx2_100_21 > null || feature.properties.Tx2_100_21 ===0){
        minPer100m2Sem21Freg = feature.properties.Tx2_100_21
    }
    if(feature.properties.Tx2_100_21 > maxPer100m2Sem21Freg && feature.properties.Tx2_100_21 > null ){
        maxPer100m2Sem21Freg = feature.properties.Tx2_100_21
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorTaxaEsforco100mFreg(feature.properties.Tx2_100_21)
    };
}
function apagarPer100m2Sem21Freg(e){
    var layer = e.target;
    Per100m2Sem21Freg.resetStyle(layer)
    layer.closePopup();
}


function onEachFeaturePer100m2Sem21Freg(feature, layer) {
    if (feature.properties.Tx2_100_21 == null){
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' + 'Cálculo não aplicável' + '</b>').openPopup()
    }
    else{
        layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de esforço: ' + '<b>' +feature.properties.Tx2_100_21 + '%' +'</b>' ).openPopup()
    }
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarPer100m2Sem21Freg,
    })
};

var Per100m2Sem21Freg= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloPer100m2Sem21Freg,
    onEachFeature: onEachFeaturePer100m2Sem21Freg,
});

var slidePer100m2Sem21Freg = function(){
    var sliderPer100m2Sem21Freg = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 36){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPer100m2Sem21Freg, {
        start: [minPer100m2Sem21Freg, maxPer100m2Sem21Freg],
        tooltips:true,
        connect: true,
        range: {
            'min': minPer100m2Sem21Freg,
            'max': maxPer100m2Sem21Freg
        },
    });
    
    inputNumberMin.setAttribute("value",minPer100m2Sem21Freg);
    inputNumberMax.setAttribute("value",maxPer100m2Sem21Freg);

    inputNumberMin.addEventListener('change', function(){
        sliderPer100m2Sem21Freg.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPer100m2Sem21Freg.noUiSlider.set([null, this.value]);
    });

    sliderPer100m2Sem21Freg.noUiSlider.on('update',function(e){
        Per100m2Sem21Freg.eachLayer(function(layer){
            if (layer.feature.properties.Tx2_100_21 == null){
                return false
            }
            if(layer.feature.properties.Tx2_100_21.toFixed(2) >=parseFloat(e[0])&& layer.feature.properties.Tx2_100_21.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPer100m2Sem21Freg.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 36;
    sliderAtivo = sliderPer100m2Sem21Freg.noUiSlider;
    $(slidersGeral).append(sliderPer100m2Sem21Freg);
}
///////////////////////////-------------------- Fim PERCENTAGEM 100M2 2 SEMESTRE 2021, Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\


//////////////////////////////////------------------------ FIM DADOS RELATIVOS ---------------\\\\\\\\\\\\\\\\\\\



/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = Per80m2Sem17Conc;
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
    if (layer == Per80m2Sem17Conc && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2017, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slidePer80m2Sem17Conc();
        naoDuplicar = 1;
    }
    if (layer == Per80m2Sem17Conc && naoDuplicar == 1){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2017, por concelho.' + '</strong>');
    }
    if (layer == Per100m2Sem17Conc && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 2º semestre de 2017, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slidePer100m2Sem17Conc();
        naoDuplicar = 2;
    }
    if (layer == Per80m1Sem18Conc && naoDuplicar != 3){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 1º semestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slidePer80m1Sem18Conc();
        naoDuplicar = 3;
    }
    if (layer == Per100m1Sem18Conc && naoDuplicar != 4){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 1º semestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slidePer100m1Sem18Conc();
        naoDuplicar = 4;
    }
    if (layer == Per80m2Sem18Conc && naoDuplicar != 5){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slidePer80m2Sem18Conc();
        naoDuplicar = 5;
    }
    if (layer == Per100m2Sem18Conc && naoDuplicar != 6){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 2º semestre de 2018, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slidePer100m2Sem18Conc();
        naoDuplicar = 6;
    }
    if (layer == Per80m1Sem19Conc && naoDuplicar != 7){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 1º semestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slidePer80m1Sem19Conc();
        naoDuplicar = 7;
    }
    if (layer == Per100m1Sem19Conc && naoDuplicar != 8){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 1º semestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slidePer100m1Sem19Conc();
        naoDuplicar = 8;
    }
    if (layer == Per80m2Sem19Conc && naoDuplicar != 9){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slidePer80m2Sem19Conc();
        naoDuplicar = 9;
    }
    if (layer == Per100m2Sem19Conc && naoDuplicar != 10){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 2º semestre de 2019, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slidePer100m2Sem19Conc();
        naoDuplicar = 10;
    }
    if (layer == Per80m1Sem20Conc && naoDuplicar != 11){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 1º semestre de 2020, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slidePer80m1Sem20Conc();
        naoDuplicar = 11;
    }
    if (layer == Per100m1Sem20Conc && naoDuplicar != 12){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 1º semestre de 2020, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slidePer100m1Sem20Conc();
        naoDuplicar = 12;
    }
    if (layer == Per80m2Sem20Conc && naoDuplicar != 13){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2020, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slidePer80m2Sem20Conc();
        naoDuplicar = 13;
    }
    if (layer == Per100m2Sem20Conc && naoDuplicar != 14){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 2º semestre de 2020, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slidePer100m2Sem20Conc();
        naoDuplicar = 14;
    }
    if (layer == Per80m1Sem21Conc && naoDuplicar != 29){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 1º semestre de 2021, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slidePer80m1Sem21Conc();
        naoDuplicar = 29;
    }
    if (layer == Per100m1Sem21Conc && naoDuplicar != 30){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 1º semestre de 2021, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slidePer100m1Sem21Conc();
        naoDuplicar = 30;
    }
    if (layer == Per80m2Sem21Conc && naoDuplicar != 31){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2021, por concelho.' + '</strong>');
        legendaTaxaEsforco80mConc();
        slidePer80m2Sem21Conc();
        naoDuplicar = 31;
    }
    if (layer == Per100m2Sem21Conc && naoDuplicar != 32){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 2º semestre de 2021, por concelho.' + '</strong>');
        legendaTaxaEsforco100mConc();
        slidePer100m2Sem21Conc();
        naoDuplicar = 32;
    }
    if (layer == Per80m2Sem17Freg && naoDuplicar != 15){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2017, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slidePer80m2Sem17Freg();
        naoDuplicar = 15;
    }
    if (layer == Per100m2Sem17Freg && naoDuplicar != 16){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 2º semestre de 2017, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slidePer100m2Sem17Freg();
        naoDuplicar = 16;
    }
    if (layer == Per80m1Sem18Freg && naoDuplicar != 17){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 1º semestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slidePer80m1Sem18Freg();
        naoDuplicar = 17;
    }
    if (layer == Per100m1Sem18Freg && naoDuplicar != 18){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 1º semestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slidePer100m1Sem18Freg();
        naoDuplicar = 18;
    }
    if (layer == Per80m2Sem18Freg && naoDuplicar != 19){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slidePer80m2Sem18Freg();
        naoDuplicar = 19;
    }
    if (layer == Per100m2Sem18Freg && naoDuplicar != 20){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 2º semestre de 2018, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slidePer100m2Sem18Freg();
        naoDuplicar = 20;
    }
    if (layer == Per80m1Sem19Freg && naoDuplicar != 21){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 1º semestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slidePer80m1Sem19Freg();
        naoDuplicar = 21;
    }
    if (layer == Per100m1Sem19Freg && naoDuplicar != 22){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 1º semestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slidePer100m1Sem19Freg();
        naoDuplicar = 22;
    }
    if (layer == Per80m2Sem19Freg && naoDuplicar != 23){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slidePer80m2Sem19Freg();
        naoDuplicar = 23;
    }
    if (layer == Per100m2Sem19Freg && naoDuplicar != 24){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 2º semestre de 2019, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slidePer100m2Sem19Freg();
        naoDuplicar = 24;
    }
    if (layer == Per80m1Sem20Freg && naoDuplicar != 25){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 1º semestre de 2020, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slidePer80m1Sem20Freg();
        naoDuplicar = 25;
    }
    if (layer == Per100m1Sem20Freg && naoDuplicar != 26){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 1º semestre de 2020, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slidePer100m1Sem20Freg();
        naoDuplicar = 26;
    }
    if (layer == Per80m2Sem20Freg && naoDuplicar != 27){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2020, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slidePer80m2Sem20Freg();
        naoDuplicar = 27;
    }
    if (layer == Per100m2Sem20Freg && naoDuplicar != 28){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 2º semestre de 2020, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slidePer100m2Sem20Freg();
        naoDuplicar = 28;
    }
    if (layer == Per80m1Sem21Freg && naoDuplicar != 33){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 1º semestre de 2021, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slidePer80m1Sem21Freg();
        naoDuplicar = 33;
    }
    if (layer == Per100m1Sem21Freg && naoDuplicar != 34){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 1º semestre de 2021, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slidePer100m1Sem21Freg();
        naoDuplicar = 34;
    }
    if (layer == Per80m2Sem21Freg && naoDuplicar != 35){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 80m², no 2º semestre de 2021, por freguesia.' + '</strong>');
        legendaTaxaEsforco80mFreg();
        slidePer80m2Sem21Freg();
        naoDuplicar = 35;
    }
    if (layer == Per100m2Sem21Freg && naoDuplicar != 36){
        $('#tituloMapa').html(' <strong>' + 'Taxa de esforço de arrendamento para uma área bruta de 100m², no 2º semestre de 2021, por freguesia.' + '</strong>');
        legendaTaxaEsforco100mFreg();
        slidePer100m2Sem21Freg();
        naoDuplicar = 36;
    }
    layer.addTo(map);
    layerAtiva = layer;  
}


function myFunction() {
    var ano = document.getElementById("mySelect").value;
    var area = document.getElementById("opcaoSelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#absoluto').hasClass('active4')){
            if (ano == "2Sem17" && area == "80"){
                novaLayer(Per80m2Sem17Conc)
            }
            if (ano == "2Sem17" && area == "100"){
                novaLayer(Per100m2Sem17Conc) 
            }
            if (ano == "1Sem18" && area == "80"){
                novaLayer(Per80m1Sem18Conc)
            }    
            if (ano == "1Sem18" && area == "100"){
                novaLayer(Per100m1Sem18Conc)
            }     
            if (ano == "2Sem18" && area == "80"){
                novaLayer(Per80m2Sem18Conc)
            }
            if (ano == "2Sem18" && area == "100"){
                novaLayer(Per100m2Sem18Conc);
            } 
            if (ano == "1Sem19" && area == "80"){
                novaLayer(Per80m1Sem19Conc)
            }
            if (ano == "1Sem19" && area == "100"){
                novaLayer(Per100m1Sem19Conc);
            }
            if (ano == "2Sem19" && area == "80"){
                novaLayer(Per80m2Sem19Conc);
            } 
            if (ano == "2Sem19" && area == "100"){
                novaLayer(Per100m2Sem19Conc)
            }
            if (ano == "1Sem20" && area == "80"){
                novaLayer(Per80m1Sem20Conc);
            }
            if (ano == "1Sem20" && area == "100"){
                novaLayer(Per100m1Sem20Conc);
            } 
            if (ano == "2Sem20" && area == "80"){
                novaLayer(Per80m2Sem20Conc)
            }
            if (ano == "2Sem20" && area == "100"){
                novaLayer(Per100m2Sem20Conc);
            }  
            if (ano == "1Sem21" && area == "80"){
                novaLayer(Per80m1Sem21Conc);
            }
            if (ano == "1Sem21" && area == "100"){
                novaLayer(Per100m1Sem21Conc);
            } 
            if (ano == "2Sem21" && area == "80"){
                novaLayer(Per80m2Sem21Conc)
            }
            if (ano == "2Sem21" && area == "100"){
                novaLayer(Per100m2Sem21Conc);
            }  
            
        }
    }
    if ($('#freguesias').hasClass('active2')){
        if ($('#absoluto').hasClass('active5')){
            if (ano == "2Sem17" && area == "80"){
                novaLayer(Per80m2Sem17Freg)
            }
            if (ano == "2Sem17" && area == "100"){
                novaLayer(Per100m2Sem17Freg) 
            }
            if (ano == "1Sem18" && area == "80"){
                novaLayer(Per80m1Sem18Freg)
            }    
            if (ano == "1Sem18" && area == "100"){
                novaLayer(Per100m1Sem18Freg)
            }     
            if (ano == "2Sem18" && area == "80"){
                novaLayer(Per80m2Sem18Freg)
            }
            if (ano == "2Sem18" && area == "100"){
                novaLayer(Per100m2Sem18Freg);
            } 
            if (ano == "1Sem19" && area == "80"){
                novaLayer(Per80m1Sem19Freg)
            }
            if (ano == "1Sem19" && area == "100"){
                novaLayer(Per100m1Sem19Freg);
            }
            if (ano == "2Sem19" && area == "80"){
                novaLayer(Per80m2Sem19Freg);
            } 
            if (ano == "2Sem19" && area == "100"){
                novaLayer(Per100m2Sem19Freg)
            }
            if (ano == "1Sem20" && area == "80"){
                novaLayer(Per80m1Sem20Freg);
            }
            if (ano == "1Sem20" && area == "100"){
                novaLayer(Per100m1Sem20Freg);
            } 
            if (ano == "2Sem20" && area == "80"){
                novaLayer(Per80m2Sem20Freg)
            }
            if (ano == "2Sem20" && area == "100"){
                novaLayer(Per100m2Sem20Freg);
            }  
            if (ano == "1Sem21" && area == "80"){
                novaLayer(Per80m1Sem21Freg);
            }
            if (ano == "1Sem21" && area == "100"){
                novaLayer(Per100m1Sem21Freg);
            } 
            if (ano == "2Sem21" && area == "80"){
                novaLayer(Per80m2Sem21Freg)
            }
            if (ano == "2Sem21" && area == "100"){
                novaLayer(Per100m2Sem21Freg);
            }  
        }
    }
}
function mudarEscala(){
    primeirovalor();
    tamanhoOutros();
}
let primeirovalor = function(){
    $("#mySelect").val('2Sem17');
    $("#opcaoSelect").val('80');
}

let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}
$('#absoluto').click(function(){
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


let variaveisMapaConcelho = function(){
    if ($('#absoluto').hasClass('active4')){
        return false
    }
    else{
        $('#absoluto').attr('class',"butao active4");
        mudarEscala();
    }
}

let variaveisMapaFreguesias = function(){
    if($('#absoluto').hasClass('active5')){
        return false;
    }
    else{
        $('#absoluto').attr('class',"butao active5");
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
    $('#absoluto').attr("class","butao active4");

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
    $('#tituloMapa').html('Taxa de esforço de arrendamento, segundo a área bruta, entre o 2º semestre de 2017 e 2021, €.');
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/TaxaEsforcoArrendamento.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $.each(data, function(key, value){
            dados += '<tr>';
            if(value.TaxaEsforco == "100m²"){
                dados += '<td class="borderbottom">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom negrito">'+value.Freguesia+'</td>';;
                dados += '<td class="borderbottom ">'+value.TaxaEsforco+'</td>';
                dados += '<td class="borderbottom ">'+value.P2SEM2017+'</td>';
                dados += '<td class="borderbottom ">'+value.P1SEM2018+'</td>';
                dados += '<td class="borderbottom ">'+value.P2SEM2018+'</td>';
                dados += '<td class="borderbottom ">'+value.P1SEM2019+'</td>';
                dados += '<td class="borderbottom ">'+value.P2SEM2019+'</td>';
                dados += '<td class="borderbottom ">'+value.P1SEM2020+'</td>';
                dados += '<td class="borderbottom ">'+value.P2SEM2020+'</td>';
                dados += '<td class="borderbottom ">'+value.P1SEM2021+'</td>';
                dados += '<td class="borderbottom ">'+value.P2SEM2021+'</td>';
            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                dados += '<td>'+value.TaxaEsforco+'</td>';
                dados += '<td>'+value.P2SEM2017+'</td>';
                dados += '<td>'+value.P1SEM2018+'</td>';
                dados += '<td>'+value.P2SEM2018+'</td>';
                dados += '<td>'+value.P1SEM2019+'</td>';
                dados += '<td>'+value.P2SEM2019+'</td>';
                dados += '<td>'+value.P1SEM2020+'</td>';
                dados += '<td>'+value.P2SEM2020+'</td>';
                dados += '<td>'+value.P1SEM2021+'</td>';
                dados += '<td>'+value.P2SEM2021+'</td>';
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
        if (ano != "2Sem21" || ano != "2Sem17"){
            i = 1
        }
        if (ano == "2Sem21"){
            i = $('#mySelect').children('option').length - 1 ;
        }
        if (ano == "2Sem17"){
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
