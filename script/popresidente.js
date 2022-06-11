

////Adicionar basemap
let baseoriginal =L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',);

//adicionar mapa
let latitude = 41.15073;
let longitude = -8.5147;
let zoom = 9;
var map= L.map(document.getElementById('mapDIV'),{ 
    center:[latitude,longitude],
    zoom: zoom,
    zoomControl:false,
//    maxZoom:10,
//    minZoom:8
});
baseoriginal.addTo(map);

///// --- Adicionar Layer dos Concelhos -----\\\\
function layerContorno() {
    return {
        weight: 1.5,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.3,
        linejoin: 'round',
        fillColor:'rgb(204,204,204)'};
    }
var contorno = L.geoJSON(contornoAmp,{
    style:layerContorno,
});
contorno.addTo(map);
///// ---- Fim layer Concelhos --- \\\\

///// --- Adicionar Layer das Freguesias -----\\\\
var contornoFreg = L.geoJSON(contornoFreguesias,{
    style:layerContorno,
});
///// ---- Fim layer Freguesias --- \\\\
//// ---- Botão de aproximar e diminuir a escala e voltar ao zoom inicial---- \\\\\
var zoomHome = L.Control.zoomHome({
    position:'topleft',
    zoomHomeTitle: 'Zoom Inicial',
    zoomInTitle: 'Aumentar',
    zoomOutTitle: 'Diminuir'
}).addTo(map);
L.control.scale().addTo(map);

///percentagemConcelho


/////Buscar os ID'S todos \\\\\

let space = document.getElementById("space");
let opcoesTabela = document.getElementById('opcoesTabela');
let barraTabela = document.getElementById('barraTabela');
let escalasConcelho = document.getElementById('escalasConcelho');
let escalasFreguesia = document.getElementById('escalasFreguesias');
let absolutoConcelho = document.getElementById('absoluto');
let absolutoFreguesia = document.getElementById('absolutoFreguesia');
let variacaoConcelho = document.getElementById('taxaVariacao');
let variacaoFreguesia = document.getElementById('taxaVariacaoFreguesia');
let percentagemConcelhos = document.getElementById('percentagem');
let percentagemFreguesia = document.getElementById('percentagemFreguesia');
let opcao = document.getElementById('concelho');
let divFreguesias = document.getElementById('freguesias');
let filtrar = document.getElementById('filtrar');
let painel = document.getElementById('painel');
let mapDIV = document.getElementById('mapDIV');
let myDIV = document.getElementById('myDIV');
let legendaA= document.getElementById('legendaA');
let painelLegenda= document.getElementById('painelLegenda');
let tabela= document.getElementById('tabela');
let grafico= document.getElementById('grafico');
var ifSlide2isActive = 1;
let slidersGeral = document.getElementById('slidersGeral');
let sliderPopConcelho2021= document.getElementById('sliderPopConcelho2021');
let sliderPopFreguesia2021= document.getElementById('sliderPopFreguesia2021');
let sliderPopPercentagem2021= document.getElementById('sliderPopPercentagem2021');
let sliderVariacaoConcelho2021= document.getElementById('sliderVariacaoConcelho2021');
let inputNumberMin = document.getElementById('input-number-min');
let inputNumberMax = document.getElementById('input-number-max');
let tabelaPopResidente = document.getElementById('tabelaPopResidente');
let tabelaVariacao = document.getElementById('tabelaVariacao');
let tabelaPercentagem = document.getElementById('tabelaPercentagem');
let tabela1 = document.getElementById('populacaoresidente_tabela')

barraTabela.style.visibility = "hidden";




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
  var current = document.getElementsByClassName("active3");
  current[0].className = current[0].className.replace(" active3", "");
  this.className += " active3";
  });
}

///// --- Botões das variáveis  dos Concelhos(Número Absoluto, Taxa de Variação, Percentagem) ficarem ativos sempre que se clica \\\\\

var btns3 = escalasConcelho.getElementsByClassName("butao");
for (var i = 0; i < btns3.length; i++) {
    btns3[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active4");
    current[0].className = current[0].className.replace(" active4", "");
    this.className += " active4";
  });
}
///// --- Botões das variáveis das Freguesias (Número Absoluto, Taxa de Variação, Percentagem) ficarem ativos sempre que se clica \\\\\
var btns4 = escalasFreguesia.getElementsByClassName("btn");
for (var i = 0; i < btns4.length; i++) {
  btns4[i].addEventListener("click", function() {
  var current = document.getElementsByClassName("active5");
  current[0].className = current[0].className.replace(" active5", "");
  this.className += " active5";
  });
}


///// Número Absoluto dos Concelhos
var PopulacaoResidenteConcelho2021;
function getRadius(area) {
    var radius = Math.sqrt(area / Math.PI);
    return radius * 0.1;
};

var min = 0;
var max = 0;
function estiloPopulacaoResidenteConcelho2021(feature, latlng) {
    if(feature.properties.Pop2021< min || min ===0){
        min = feature.properties.Pop2021
    }
    if(feature.properties.Pop2021> max){
        max = feature.properties.Pop2021
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop2021)
    });
}
function apagarPopulacaoResidenteConcelho2021(e){
    var layer = e.target;
    PopulacaoResidenteConcelho2021.resetStyle(layer)
    layer.closePopup();
}
function highlightFeature3(e) {
    var layer = e.target;
    layer.openPopup();
    info3.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}

function onEachFeature4(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Pop2021 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeature3, 
        mouseout:apagarPopulacaoResidenteConcelho2021,
    })
};
let info3 = L.control();

info3.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info3.update = function (feature) {
    this._div.innerHTML = '<h4>População Residente em 2021</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.Pop2021 +
    ' pessoas </sup>': '');
};
info3.addTo(map);
PopulacaoResidenteConcelho2021= L.geoJSON(PopResiConcelho,{
    pointToLayer:estiloPopulacaoResidenteConcelho2021,
    onEachFeature: onEachFeature4,
});
PopulacaoResidenteConcelho2021.addTo(map)  

var colorize = function(tituloescrito, maximo,medio,minimo) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'center'
    var symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'symbolsContainer'
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

            currentRadius = getRadius(classes[i]);

            margin = -currentRadius - lastRadius - 2;

            $(legendCircle).attr("style", "width: " + currentRadius*2 +
                "px; height: " + currentRadius*2 +
                "px; margin-left: " + margin + "px" );

            $(legendCircle).append("<span class='legendValue'>"+classes[i]+"<span>");

            $(symbolsContainer).append(legendCircle);

            lastRadius = currentRadius;

        }
        $(legendaA).append(symbolsContainer);
        legendaA.style.visibility = "visible"
        }
colorize('Nº de Habitantes em 2021', 303854,141350,21154);

var sliderAtivo = null

var slide = function(){
    var sliderPopConcelho2021 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderPopConcelho2021, {
        start: [min, max],
        tooltips:true,
        connect: true,
        range: {
            'min': min,
            'max': max
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",min);
    inputNumberMax.setAttribute("value",max);

    inputNumberMin.addEventListener('change', function(){
        sliderPopConcelho2021.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopConcelho2021.noUiSlider.set([null, this.value]);
    });

    sliderPopConcelho2021.noUiSlider.on('update',function(e){
        PopulacaoResidenteConcelho2021.eachLayer(function(layer){
            if(layer.feature.properties.Pop2021>=parseFloat(e[0])&& layer.feature.properties.Pop2021 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopConcelho2021.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderPopConcelho2021.noUiSlider;
    $(slidersGeral).append(sliderPopConcelho2021);
}
slide();


///// FIM Número Absoluto dos Concelhos 2021 \\\\\\
///// Número Absoluto Concelhos 2011 \\\\\
var PopulacaoResidenteConcelho2011;

var minPop2011Concelho = 0;
var maxPop2011Concelho = 0;
function estiloPopulacaoResidenteConcelho2011(feature, latlng) {
    if(feature.properties.Pop2011< minPop2011Concelho || minPop2011Concelho ===0){
        minPop2011Concelho = feature.properties.Pop2011
    }
    if(feature.properties.Pop2011> maxPop2011Concelho){
        maxPop2011Concelho = feature.properties.Pop2011
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop2011)
    });
}
function apagarPopulacaoResidenteConcelho2011(e){
    var layer = e.target;
    PopulacaoResidenteConcelho2011.resetStyle(layer)
    layer.closePopup();
}
function highlightFeaturePopulacaoResidenteConcelho2011(e, dipro) {
    var layer = e.target;
    layer.openPopup();
    info8.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}

function onEachFeaturePopulacaoResidenteConcelho2011(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Pop2011 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeaturePopulacaoResidenteConcelho2011, 
        mouseout:apagarPopulacaoResidenteConcelho2011,
    })
};
let info8 = L.control();

info8.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info8.update = function (feature) {
    this._div.innerHTML = '<h4>População Residente em 2011</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.Pop2011 +
    ' pessoas </sup>': '');
};

PopulacaoResidenteConcelho2011= L.geoJSON(PopResiConcelho,{
    pointToLayer:estiloPopulacaoResidenteConcelho2011,
    onEachFeature: onEachFeaturePopulacaoResidenteConcelho2011,
});


var slidePopulacaoResidenteConcelho2011 = function(){
    var sliderPopConcelho2011 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 6){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPopConcelho2011, {
        start: [minPop2011Concelho, maxPop2011Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop2011Concelho,
            'max': maxPop2011Concelho
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop2011Concelho);
    inputNumberMax.setAttribute("value",maxPop2011Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderPopConcelho2011.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopConcelho2011.noUiSlider.set([null, this.value]);
    });

    sliderPopConcelho2011.noUiSlider.on('update',function(e){
        PopulacaoResidenteConcelho2011.eachLayer(function(layer){
            if(layer.feature.properties.Pop2011>=parseFloat(e[0])&& layer.feature.properties.Pop2011 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopConcelho2011.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 6;
    sliderAtivo = sliderPopConcelho2011.noUiSlider;
    $(slidersGeral).append(sliderPopConcelho2011);
}


////// ---- Fim Número Absoluto Concelho 2011 -----\\\\

//// População Residente Concelho 2001 \\\\\\
var PopulacaoResidenteConcelho2001;

var minPop2001Concelho = 0;
var maxPop2001Concelho = 0;
function estiloPopulacaoResidenteConcelho2001(feature, latlng) {
    if(feature.properties.Pop2001< minPop2001Concelho || minPop2001Concelho ===0){
        minPop2001Concelho = feature.properties.Pop2001
    }
    if(feature.properties.Pop2001> maxPop2001Concelho){
        maxPop2001Concelho = feature.properties.Pop2001
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop2001)
    });
}
function apagarPopulacaoResidenteConcelho2001(e){
    var layer = e.target;
    PopulacaoResidenteConcelho2001.resetStyle(layer)
    layer.closePopup();
}
function highlightFeaturePopulacaoResidenteConcelho2001(e) {
    var layer = e.target;
    layer.openPopup();
    info9.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}

function onEachFeaturePopulacaoResidenteConcelho2001(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Pop2001 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeaturePopulacaoResidenteConcelho2001, 
        mouseout:apagarPopulacaoResidenteConcelho2001,
    })
};
let info9 = L.control();

info9.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info9.update = function (feature) {
    this._div.innerHTML = '<h4>População Residente em 2001</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.Pop2001 +
    ' pessoas </sup>': '');
};

PopulacaoResidenteConcelho2001= L.geoJSON(PopResiConcelho,{
    pointToLayer:estiloPopulacaoResidenteConcelho2001,
    onEachFeature: onEachFeaturePopulacaoResidenteConcelho2001,
});

var slidePopulacaoResidenteConcelho2001 = function(){
    var sliderPopConcelho2001 = document.querySelector('.sliderAtivo');
    

    if (ifSlide2isActive != 7){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPopConcelho2001, {
        start: [minPop2001Concelho, maxPop2001Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop2001Concelho,
            'max': maxPop2001Concelho
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop2001Concelho);
    inputNumberMax.setAttribute("value",maxPop2001Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderPopConcelho2001.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopConcelho2001.noUiSlider.set([null, this.value]);
    });

    sliderPopConcelho2001.noUiSlider.on('update',function(e){
        PopulacaoResidenteConcelho2001.eachLayer(function(layer){
            if(layer.feature.properties.Pop2001>=parseFloat(e[0])&& layer.feature.properties.Pop2001 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopConcelho2001.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 7;
    sliderAtivo = sliderPopConcelho2001.noUiSlider;
    $(slidersGeral).append(sliderPopConcelho2001)
}
////// ---- Fim Número Absoluto Concelho 2011 -----\\\\
var PopulacaoResidenteConcelho1991;

var minPop1991Concelho = 0;
var maxPop1991Concelho = 0;
function estiloPopulacaoResidenteConcelho1991(feature, latlng) {
    if(feature.properties.Pop1991< minPop1991Concelho || minPop1991Concelho ===0){
        minPop1991Concelho = feature.properties.Pop1991
    }
    if(feature.properties.Pop1991> maxPop1991Concelho){
        maxPop1991Concelho = feature.properties.Pop1991
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.Pop1991)
    });
}
function apagarPopulacaoResidenteConcelho1991(e){
    var layer = e.target;
    PopulacaoResidenteConcelho1991.resetStyle(layer)
    layer.closePopup();
}
function highlightFeaturePopulacaoResidenteConcelho1991(e) {
    var layer = e.target;
    layer.openPopup();
    infoPopulacaoResidenteConcelho1991.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}

function onEachFeaturePopulacaoResidenteConcelho1991(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Pop1991 + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeaturePopulacaoResidenteConcelho1991, 
        mouseout:apagarPopulacaoResidenteConcelho1991,
    })
};
let infoPopulacaoResidenteConcelho1991 = L.control();

infoPopulacaoResidenteConcelho1991.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
infoPopulacaoResidenteConcelho1991.update = function (feature) {
    this._div.innerHTML = '<h4>População Residente em 1991 </h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.Pop1991 +
    ' pessoas </sup>': '');
};

PopulacaoResidenteConcelho1991= L.geoJSON(PopResiConcelho,{
    pointToLayer:estiloPopulacaoResidenteConcelho1991,
    onEachFeature: onEachFeaturePopulacaoResidenteConcelho1991,
});


var slidePopulacaoResidenteConcelho1991 = function(){
    var sliderPopConcelho1991 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 8){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPopConcelho1991, {
        start: [minPop1991Concelho, maxPop1991Concelho],
        tooltips:true,
        connect: true,
        range: {
            'min': minPop1991Concelho,
            'max': maxPop1991Concelho
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minPop1991Concelho);
    inputNumberMax.setAttribute("value",maxPop1991Concelho);

    inputNumberMin.addEventListener('change', function(){
        sliderPopConcelho1991.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopConcelho1991.noUiSlider.set([null, this.value]);
    });

    sliderPopConcelho1991.noUiSlider.on('update',function(e){
        PopulacaoResidenteConcelho1991.eachLayer(function(layer){
            if(layer.feature.properties.Pop1991>=parseFloat(e[0])&& layer.feature.properties.Pop1991 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopConcelho1991.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 8;
    sliderAtivo = sliderPopConcelho1991.noUiSlider;
    $(slidersGeral).append(sliderPopConcelho1991);
}


//////------- Variação População Concelho -----////


function CorPopVariacaoConcelho21_11(d) {
    return d > 1  ? 'rgb(255,82,82)' :
    d > 0 ? 'rgb(255,186,186)' :
    d > -2  ? 'rgb(255,247,192)' :
    d > -4   ? 'rgb(62,123,169)' :
    d > -7   ? 'rgb(14,89,147)' :
              '';
}
var minimoVariacaoConcelho2021_2011 = 0;
var maximoVariacaoConcelho2021_2011 = 1;

function EstiloPopVariacaoConcelho21_11(feature) {
    if(feature.properties.F2021_2011 <= minimoVariacaoConcelho2021_2011 || minimoVariacaoConcelho2021_2011 ===0){
        minimoVariacaoConcelho2021_2011 = feature.properties.F2021_2011
    }
    if(feature.properties.F2021_2011 > maximoVariacaoConcelho2021_2011){
        maximoVariacaoConcelho2021_2011 = feature.properties.F2021_2011 + 0.01
    }
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPopVariacaoConcelho21_11(feature.properties.F2021_2011)};
    }


function apagarPopVariacaoConcelho21_11(e) {
    PopVariacaoConcelho21_11.resetStyle(e.target)
    e.target.closePopup();

} 
let infoPopVariacaoConcelho21_11 = L.control();

infoPopVariacaoConcelho21_11.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
infoPopVariacaoConcelho21_11.update = function (feature) {
    this._div.innerHTML = '<h4>Variação de População Residente entre 2011 e 2021</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.F2021_2011.toFixed(2)  +
    '% </sup>': '');
};
function highlightFeaturePopVariacaoConcelho21_11(e) {
    var layer = e.target;
    layer.openPopup();
    infoPopVariacaoConcelho21_11.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeaturePopVariacaoConcelho21_11(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de Variação: ' + '<b>' + feature.properties.F2021_2011.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeaturePopVariacaoConcelho21_11,
        mouseout: apagarPopVariacaoConcelho21_11,
    });
}
var PopVariacaoConcelho21_11= L.geoJSON(PercentagemVariacaoConcelhos, {
    style:EstiloPopVariacaoConcelho21_11,
    onEachFeature: onEachFeaturePopVariacaoConcelho21_11
});
var LegendaVariacaoConcelhos2021_2011 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'symbolsContainer'
    var titulo = 'Variação de População Residente entre 2021 e 2011'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 1 - 2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + '0 - 1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 0 - -2' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' -2 - -4' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' -4 - -6.9' + '<br>'



    $(legendaA).append(symbolsContainer); 
}
let slidePopVariacaoConcelho21_11 = function(){
    var sliderVariacaoConcelho2021 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 4){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVariacaoConcelho2021, {
        start: [minimoVariacaoConcelho2021_2011, maximoVariacaoConcelho2021_2011],
        tooltips:true,
        connect: true,
        range: {
            'min': minimoVariacaoConcelho2021_2011,
            'max': maximoVariacaoConcelho2021_2011
        },
        });
    inputNumberMin.setAttribute("value",minimoVariacaoConcelho2021_2011);
    inputNumberMax.setAttribute("value",maximoVariacaoConcelho2021_2011);

    inputNumberMin.addEventListener('change', function(){
        sliderVariacaoConcelho2021.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVariacaoConcelho2021.noUiSlider.set([null, this.value]);
    });

    sliderVariacaoConcelho2021.noUiSlider.on('update',function(e){
        PopVariacaoConcelho21_11.eachLayer(function(layer){
            if(layer.feature.properties.F2021_2011>=parseFloat(e[0])&& layer.feature.properties.F2021_2011 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderVariacaoConcelho2021.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 4;
    sliderAtivo = sliderVariacaoConcelho2021.noUiSlider;
    $(slidersGeral).append(sliderVariacaoConcelho2021);
} 

///// Fim da Variação da População dos Concelhos-------------- \\\\\\
//// Variação Populacao Concelhos 1981 - 2021 \\\\\
var PopVariacaoConcelho11_01
function CorPopVariacaoConcelho11_01(d) {
    return d > 5  ? 'rgb(255,82,82)' :
    d > 2 ? 'rgb(255,186,186)' :
    d > -1  ? 'rgb(255,247,192)' :
    d > -5   ? 'rgb(62,123,169)' :
    d > -9.71   ? 'rgb(14,89,147)' :
              '';
}
var minimoPopVariacaoConcelho11_01 = 0;
var maximoPopVariacaoConcelho11_01 = 1;

function EstiloPopVariacaoConcelho11_01(feature) {
    if(feature.properties.F2011_2001 <= minimoPopVariacaoConcelho11_01 || minimoPopVariacaoConcelho11_01 ===0){
        minimoPopVariacaoConcelho11_01 = feature.properties.F2011_2001
    }
    if(feature.properties.F2011_2001 > maximoPopVariacaoConcelho11_01){
        maximoPopVariacaoConcelho11_01 = feature.properties.F2011_2001
        //+ 0.01
    }
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPopVariacaoConcelho11_01(feature.properties.F2011_2001)};
    }


function apagarPopVariacaoConcelho11_01(e) {
    PopVariacaoConcelho11_01.resetStyle(e.target)
    e.target.closePopup();

} 
let infoPopVariacaoConcelho11_01 = L.control();

infoPopVariacaoConcelho11_01.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
infoPopVariacaoConcelho11_01.update = function (feature) {
    this._div.innerHTML = '<h4>Variação de População Residente entre 2011 e 2001</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.F2011_2001  +
    '% </sup>': '');
};
function highlightPopVariacaoConcelho11_01(e) {
    var layer = e.target;
    layer.openPopup();
    infoPopVariacaoConcelho11_01.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeaturePopVariacaoConcelho11_01(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de Variação: ' + '<b>' + feature.properties.F2011_2001.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightPopVariacaoConcelho11_01,
        mouseout: apagarPopVariacaoConcelho11_01,
    });
}
PopVariacaoConcelho11_01= L.geoJSON(PercentagemVariacaoConcelhos, {
    style:EstiloPopVariacaoConcelho11_01,
    onEachFeature: onEachFeaturePopVariacaoConcelho11_01
});
let slidePopVariacaoConcelho11_01 = function(){

    var sliderVariacaoConcelho2011 = document.querySelector('.sliderAtivo');
    
    if (ifSlide2isActive != 9){
       sliderAtivo.destroy();
    }


    noUiSlider.create(sliderVariacaoConcelho2011, {
        start: [minimoPopVariacaoConcelho11_01, maximoPopVariacaoConcelho11_01],
        tooltips:true,
        connect: true,
        range: {
            'min': minimoPopVariacaoConcelho11_01,
            'max': maximoPopVariacaoConcelho11_01
        },
        });
    inputNumberMin.setAttribute("value",minimoPopVariacaoConcelho11_01);
    inputNumberMax.setAttribute("value",maximoPopVariacaoConcelho11_01);

    inputNumberMin.addEventListener('change', function(){
        sliderVariacaoConcelho2011.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVariacaoConcelho2011.noUiSlider.set([null, this.value]);
    });

    sliderVariacaoConcelho2011.noUiSlider.on('update',function(e){
        PopVariacaoConcelho11_01.eachLayer(function(layer){
            if(layer.feature.properties.F2011_2001>=parseFloat(e[0])&& layer.feature.properties.F2011_2001 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderVariacaoConcelho2011.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    sliderAtivo = sliderVariacaoConcelho2011.noUiSlider;
    ifSlide2isActive = 9;
    $(slidersGeral).append(sliderVariacaoConcelho2011);
} 
var LegendaVariacaoConcelhos2011_2001 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'symbolsContainer'
    var titulo = 'Variação de População Residente entre 2011 e 2001'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 5 - 12.7' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 2- 5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 2 - -1' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' -1 - -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' -5 - -9.7' + '<br>'

    $(legendaA).append(symbolsContainer); 

        
    }

//// Variação Populacao Concelhos 2001 - 1991 \\\\\
var PopVariacaoConcelho01_91
function CorPopVariacaoConcelho01_91(d) {
    return d > 15  ? 'rgb(255,82,82)' :
    d > 8 ? 'rgb(255,186,186)' :
    d > 0  ? 'rgb(255,247,192)' :
    d > -5   ? 'rgb(62,123,169)' :
    d > -13.1   ? 'rgb(14,89,147)' :
              '';
}
var minimoPopVariacaoConcelho01_91 = 0;
var maximoPopVariacaoConcelho01_91 = 1;

function EstiloPopVariacaoConcelho01_91(feature) {
    if(feature.properties.F2001_1991 <= minimoPopVariacaoConcelho01_91 || minimoPopVariacaoConcelho01_91 ===0){
        minimoPopVariacaoConcelho01_91 = feature.properties.F2001_1991
    }
    if(feature.properties.F2001_1991 > maximoPopVariacaoConcelho01_91){
        maximoPopVariacaoConcelho01_91 = feature.properties.F2001_1991
        //+ 0.01
    }
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPopVariacaoConcelho01_91(feature.properties.F2001_1991)};
    }


function apagarPopVariacaoConcelho01_91(e) {
    PopVariacaoConcelho01_91.resetStyle(e.target)
    e.target.closePopup();

} 
let infoPopVariacaoConcelho01_91 = L.control();

infoPopVariacaoConcelho01_91.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
infoPopVariacaoConcelho01_91.update = function (feature) {
    this._div.innerHTML = '<h4>Variação de População Residente entre 2001 e 1991</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.F2001_1991  +
    '% </sup>': '');
};
function highlightPopVariacaoConcelho01_91(e) {
    var layer = e.target;
    layer.openPopup();
    infoPopVariacaoConcelho01_91.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeaturePopVariacaoConcelho01_91(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de Variação: ' + '<b>' + feature.properties.F2001_1991.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightPopVariacaoConcelho01_91,
        mouseout: apagarPopVariacaoConcelho01_91,
    });
}
PopVariacaoConcelho01_91= L.geoJSON(PercentagemVariacaoConcelhos, {
    style:EstiloPopVariacaoConcelho01_91,
    onEachFeature: onEachFeaturePopVariacaoConcelho01_91
});
let slidePopVariacaoConcelho01_91 = function(){

    var sliderVariacaoConcelho01_91 = document.querySelector('.sliderAtivo');
    
    if (ifSlide2isActive != 18){
       sliderAtivo.destroy();
    }


    noUiSlider.create(sliderVariacaoConcelho01_91, {
        start: [minimoPopVariacaoConcelho01_91, maximoPopVariacaoConcelho01_91],
        tooltips:true,
        connect: true,
        range: {
            'min': minimoPopVariacaoConcelho01_91,
            'max': maximoPopVariacaoConcelho01_91
        },
        });
    inputNumberMin.setAttribute("value",minimoPopVariacaoConcelho01_91);
    inputNumberMax.setAttribute("value",maximoPopVariacaoConcelho01_91);

    inputNumberMin.addEventListener('change', function(){
        sliderVariacaoConcelho01_91.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVariacaoConcelho01_91.noUiSlider.set([null, this.value]);
    });

    sliderVariacaoConcelho01_91.noUiSlider.on('update',function(e){
        PopVariacaoConcelho01_91.eachLayer(function(layer){
            if(layer.feature.properties.F2001_1991>=parseFloat(e[0])&& layer.feature.properties.F2001_1991 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderVariacaoConcelho01_91.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    sliderAtivo = sliderVariacaoConcelho01_91.noUiSlider;
    ifSlide2isActive = 18;
    $(slidersGeral).append(sliderVariacaoConcelho01_91);
} 
var LegendaVariacaoConcelhos01_91 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'symbolsContainer'
    var titulo = 'Variação de População Residente entre 2001 e 1991'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 15 - 28.9' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 8- 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 0 - 8' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' -0 - -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' -5 - -13' + '<br>'

    $(legendaA).append(symbolsContainer); 

        
    }
//// Variação Populacao Concelhos 1981 - 1981 \\\\\
var PopVariacaoConcelho91_81
function CorPopVariacaoConcelho91_81(d) {
    return d > 15  ? 'rgb(255,82,82)' :
    d > 8 ? 'rgb(255,186,186)' :
    d > 0  ? 'rgb(255,247,192)' :
    d > -5   ? 'rgb(62,123,169)' :
    d > -25.41   ? 'rgb(14,89,147)' :
    d === "sem dados" ? '':
            '';
}
var minimoPopVariacaoConcelho91_81 = 0;
var maximoPopVariacaoConcelho91_81 = 1;

function EstiloPopVariacaoConcelho91_81(feature) {
    if(!feature.properties.F1991_1981){
        feature.properties.F1991_1981 = "sem dados"}
    if(feature.properties.F1991_1981 <= minimoPopVariacaoConcelho91_81 || minimoPopVariacaoConcelho91_81 ===0){
        minimoPopVariacaoConcelho91_81 = feature.properties.F1991_1981
    }
    if(feature.properties.F1991_1981 > maximoPopVariacaoConcelho91_81){
        maximoPopVariacaoConcelho91_81 = feature.properties.F1991_1981 + 0.01
    }
    if (maximoPopVariacaoConcelho91_81 == 99){
        maximoPopVariacaoConcelho91_81 = 15.5}
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPopVariacaoConcelho91_81(feature.properties.F1991_1981)};
    }


function apagarPopVariacaoConcelho91_81(e) {
    PopVariacaoConcelho91_81.resetStyle(e.target)
    e.target.closePopup();

} 
let infoPopVariacaoConcelho91_81 = L.control();

infoPopVariacaoConcelho91_81.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
infoPopVariacaoConcelho91_81.update = function (feature) {
    this._div.innerHTML = '<h4>Variação de População Residente entre 1991 e 1981 (%)</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.F1991_1981  +
    ' </sup>': '')
};
function highlightPopVariacaoConcelho91_81(e) {
    var layer = e.target;
    layer.openPopup();
    infoPopVariacaoConcelho91_81.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeaturePopVariacaoConcelho91_81(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Taxa de Variação (%):  ' + '<b>' + feature.properties.F1991_1981 + '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightPopVariacaoConcelho91_81,
        mouseout: apagarPopVariacaoConcelho91_81,
    });
}
PopVariacaoConcelho91_81= L.geoJSON(PercentagemVariacaoConcelhos, {
    style:EstiloPopVariacaoConcelho91_81,
    onEachFeature: onEachFeaturePopVariacaoConcelho91_81
});
let slidePopVariacaoConcelho91_81 = function(){

    var sliderVariacaoConcelho91_81 = document.querySelector('.sliderAtivo');
    
    if (ifSlide2isActive != 19){
       sliderAtivo.destroy();
    }


    noUiSlider.create(sliderVariacaoConcelho91_81, {
        start: [minimoPopVariacaoConcelho91_81, maximoPopVariacaoConcelho91_81],
        tooltips:true,
        connect: true,
        range: {
            'min': minimoPopVariacaoConcelho91_81,
            'max': maximoPopVariacaoConcelho91_81
        },
        });
    inputNumberMin.setAttribute("value",minimoPopVariacaoConcelho91_81);
    inputNumberMax.setAttribute("value",maximoPopVariacaoConcelho91_81);

    inputNumberMin.addEventListener('change', function(){
        sliderVariacaoConcelho91_81.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVariacaoConcelho91_81.noUiSlider.set([null, this.value]);
    });

    sliderVariacaoConcelho91_81.noUiSlider.on('update',function(e){
        PopVariacaoConcelho91_81.eachLayer(function(layer){
            if(layer.feature.properties.F1991_1981>=parseFloat(e[0])&& layer.feature.properties.F1991_1981 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderVariacaoConcelho91_81.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    sliderAtivo = sliderVariacaoConcelho91_81.noUiSlider;
    ifSlide2isActive = 19;
    $(slidersGeral).append(sliderVariacaoConcelho91_81);
} 
var LegendaVariacaoConcelhos91_81 = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'symbolsContainer'
    var titulo = 'Variação da População Residente entre 1991 e 1981'

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,82,82)"></i>' + ' 15 - 28.9' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,186,186)"></i>' + ' 8- 15' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(255,247,192)"></i>' + ' 0 - 8' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(62,123,169)"></i>' + ' -0 - -5' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:rgb(14,89,147)"></i>' + ' -5 - -13' + '<br>'

    $(legendaA).append(symbolsContainer); 

        
    }

////----- Percentagem Concelhos ------/////

function CorPopPercentagemConcelho2021(d) {
    return d > 10  ? '#f0150a' :
    d > 5 ? 'rgb(255,170,0)' :
    d > 4  ? 'rgb(255,255,0)' :
    d > 2   ? 'rgb(176,224,0)' :
    d > 1   ? 'rgb(56,168,0)' :
              '';
}
var minimoPercentagem2021 = 0;
var maximoPercentagem2021 = 1;

function EstiloPopPercentagemConcelho2021(feature) {
    if(feature.properties.Perce2021< minimoPercentagem2021 || minimoPercentagem2021 ===0){
        minimoPercentagem2021 = feature.properties.Perce2021
    }
    if(feature.properties.Perce2021> maximoPercentagem2021){
        maximoPercentagem2021 = feature.properties.Perce2021
    }
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.7,
        fillColor: CorPopPercentagemConcelho2021(feature.properties.Perce2021)};
    }


function apagarPopPercentagemConcelho2021(e) {
    PopPercentagemConcelho2021.resetStyle(e.target)
    e.target.closePopup();

} 
let infoPopPercentagemConcelho2021 = L.control();

infoPopPercentagemConcelho2021.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
infoPopPercentagemConcelho2021.update = function (feature) {
    this._div.innerHTML = '<h4>Percentagem de População Residente em 2021</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.Perce2021.toFixed(2) +
    '% </sup>': '');
};
function highlightFeaturePopPercentagemConcelho2021(e) {
    var layer = e.target;
    layer.openPopup();
    infoPopPercentagemConcelho2021.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeaturePopPercentagemConcelho2021(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' +feature.properties.Perce2021.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeaturePopPercentagemConcelho2021,
        mouseout: apagarPopPercentagemConcelho2021,
    });
}
var PopPercentagemConcelho2021= L.geoJSON(PercentagemVariacaoConcelhos, {
    style:EstiloPopPercentagemConcelho2021,
    onEachFeature: onEachFeaturePopPercentagemConcelho2021,
});
var LegendaPercentagemConcelhos = function(tituloescrito, um,dois,tres,quatro,cinco,seis,sete,cor) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'symbolsContainer'
    var titulo = tituloescrito
    var	classes = [um,dois,tres,quatro, cinco, seis,sete];

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    for (var i = 0; i < classes.length-2; i++) {
        var highValue= (classes[i] > 1) ? (classes[i]) : classes[i];
        var lowValue = classes[(i) + 1];
        symbolsContainer.innerHTML += '<i style="background:' +  cor(classes[i]) + '"></i>' +
        lowValue + " " +(highValue ? "&ndash;" + " "+highValue + "<br>" : " + ");

        $(legendaA).append(symbolsContainer); 
        
        
    }
}

let slidePopPercentagemConcelho2021 = function(){
    var sliderPopPercentagem2021 = document.querySelector('.sliderAtivo');

    

    if (ifSlide2isActive != 3){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPopPercentagem2021, {
        start: [minimoPercentagem2021, maximoPercentagem2021],
        tooltips:true,
        connect: true,
        range: {
            'min': minimoPercentagem2021,
            'max': maximoPercentagem2021
        },
        });
    inputNumberMin.setAttribute("value",minimoPercentagem2021);
    inputNumberMax.setAttribute("value",maximoPercentagem2021);

    inputNumberMin.addEventListener('change', function(){
        sliderPopPercentagem2021.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopPercentagem2021.noUiSlider.set([null, this.value]);
    });

    sliderPopPercentagem2021.noUiSlider.on('update',function(e){
        PopPercentagemConcelho2021.eachLayer(function(layer){
            if(layer.feature.properties.Perce2021>=parseFloat(e[0])&& layer.feature.properties.Perce2021 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopPercentagem2021.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 3;
    sliderAtivo = sliderPopPercentagem2021.noUiSlider;
    $(slidersGeral).append(sliderPopPercentagem2021);
} 

//// Percentagem de População em 2011 \\\\
var minimoPercentagem2011 = 0;
var maximoPercentagem2011 = 1;

function EstiloPopPercentagemConcelho2011(feature) {
    if(feature.properties.Perce2011< minimoPercentagem2011 || minimoPercentagem2011 ===0){
        minimoPercentagem2011 = feature.properties.Perce2011 
    }
    if(feature.properties.Perce2011 > maximoPercentagem2011){
        maximoPercentagem2011 = feature.properties.Perce2011 +0.01
    }
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.7,
        fillColor: CorPopPercentagemConcelho2021(feature.properties.Perce2011)};
    }


function apagarPopPercentagemConcelho2011(e) {
    PopPercentagemConcelho2011.resetStyle(e.target)
    e.target.closePopup();

} 
let infoPopPercentagemConcelho2011 = L.control();

infoPopPercentagemConcelho2011.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
infoPopPercentagemConcelho2011.update = function (feature) {
    this._div.innerHTML = '<h4>Percentagem de População Residente em 2011</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.Perce2011.toFixed(2) +
    '% </sup>': '');
};
function highlightFeaturePopPercentagemConcelho2011(e) {
    var layer = e.target;
    layer.openPopup();
    infoPopPercentagemConcelho2011.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeaturePopPercentagemConcelho2011(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' +feature.properties.Perce2011.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeaturePopPercentagemConcelho2011,
        mouseout: apagarPopPercentagemConcelho2011,
    });
}
var PopPercentagemConcelho2011= L.geoJSON(PercentagemVariacaoConcelhos, {
    style:EstiloPopPercentagemConcelho2011,
    onEachFeature: onEachFeaturePopPercentagemConcelho2011,
});


let slidePopPercentagemConcelho2011 = function(){
    var sliderPopPercentagem2011 = document.querySelector('.sliderAtivo');

    

    if (ifSlide2isActive != 15){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPopPercentagem2011, {
        start: [minimoPercentagem2011, maximoPercentagem2011],
        tooltips:true,
        connect: true,
        range: {
            'min': minimoPercentagem2011,
            'max': maximoPercentagem2011
        },
        });
    inputNumberMin.setAttribute("value",minimoPercentagem2011);
    inputNumberMax.setAttribute("value",maximoPercentagem2011);

    inputNumberMin.addEventListener('change', function(){
        sliderPopPercentagem2011.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopPercentagem2011.noUiSlider.set([null, this.value]);
    });

    sliderPopPercentagem2011.noUiSlider.on('update',function(e){
        PopPercentagemConcelho2011.eachLayer(function(layer){
            if(layer.feature.properties.Perce2011>=parseFloat(e[0])&& layer.feature.properties.Perce2011 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopPercentagem2011.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 15;
    sliderAtivo = sliderPopPercentagem2011.noUiSlider;
    $(slidersGeral).append(sliderPopPercentagem2011);
} 
/////
//// Percentagem de População em 2001 \\\\
/////
var minimoPercentagem2001 = 0;
var maximoPercentagem2001 = 1;

function EstiloPopPercentagemConcelho2001(feature) {
    if(feature.properties.Perce2001< minimoPercentagem2001 || minimoPercentagem2001 ===0){
        minimoPercentagem2001 = feature.properties.Perce2001 - 0.01
    }
    if(feature.properties.Perce2001> maximoPercentagem2001){
        maximoPercentagem2001 = feature.properties.Perce2001 +0.01
    }
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.7,
        fillColor: CorPopPercentagemConcelho2021(feature.properties.Perce2001)};
    }


function apagarPopPercentagemConcelho2001(e) {
    PopPercentagemConcelho2001.resetStyle(e.target)
    e.target.closePopup();

} 
let infoPopPercentagemConcelho2001 = L.control();

infoPopPercentagemConcelho2001.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
infoPopPercentagemConcelho2001.update = function (feature) {
    this._div.innerHTML = '<h4>Percentagem de População Residente em 2001</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.Perce2001.toFixed(2) +
    '% </sup>': '');
};
function highlightFeaturePopPercentagemConcelho2001(e) {
    var layer = e.target;
    layer.openPopup();
    infoPopPercentagemConcelho2001.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeaturePopPercentagemConcelho2001(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' +feature.properties.Perce2001.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeaturePopPercentagemConcelho2001,
        mouseout: apagarPopPercentagemConcelho2001,
    });
}
var PopPercentagemConcelho2001= L.geoJSON(PercentagemVariacaoConcelhos, {
    style:EstiloPopPercentagemConcelho2001,
    onEachFeature: onEachFeaturePopPercentagemConcelho2001,
});


let slidePopPercentagemConcelho2001 = function(){
    var sliderPopPercentagem2001 = document.querySelector('.sliderAtivo');

    

    if (ifSlide2isActive != 16){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPopPercentagem2001, {
        start: [minimoPercentagem2001, maximoPercentagem2001],
        tooltips:true,
        connect: true,
        range: {
            'min': minimoPercentagem2001,
            'max': maximoPercentagem2001
        },
        });
    inputNumberMin.setAttribute("value",minimoPercentagem2001);
    inputNumberMax.setAttribute("value",maximoPercentagem2001);

    inputNumberMin.addEventListener('change', function(){
        sliderPopPercentagem2001.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopPercentagem2001.noUiSlider.set([null, this.value]);
    });

    sliderPopPercentagem2001.noUiSlider.on('update',function(e){
        PopPercentagemConcelho2001.eachLayer(function(layer){
            if(layer.feature.properties.Perce2001>=parseFloat(e[0])&& layer.feature.properties.Perce2001 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopPercentagem2001.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 16;
    sliderAtivo = sliderPopPercentagem2001.noUiSlider;
    $(slidersGeral).append(sliderPopPercentagem2001);
}
 /////
//// Percentagem de População em 1991 \\\\
/////
var minimoPercentagem1991 = 0;
var maximoPercentagem1991 = 1;

function EstiloPopPercentagemConcelho1991(feature) {
    if(feature.properties.Perce1991< minimoPercentagem1991 || minimoPercentagem1991 ===0){
        minimoPercentagem1991 = feature.properties.Perce1991 -0.01
    }
    if(feature.properties.Perce1991> maximoPercentagem1991){
        maximoPercentagem1991 = feature.properties.Perce1991 +0.01
    }
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.7,
        fillColor: CorPopPercentagemConcelho2021(feature.properties.Perce1991)};
    }


function apagarPopPercentagemConcelho1991(e) {
    PopPercentagemConcelho1991.resetStyle(e.target)
    e.target.closePopup();

} 
let infoPopPercentagemConcelho1991 = L.control();

infoPopPercentagemConcelho1991.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
infoPopPercentagemConcelho1991.update = function (feature) {
    this._div.innerHTML = '<h4>Percentagem de População Residente em 1991</h4>' +  (feature ?
    '<b>' 
    + feature.Concelho + 
    '</b><br />'
    + feature.Perce1991.toFixed(2) +
    '% </sup>': '');
};
function highlightFeaturePopPercentagemConcelho1991(e) {
    var layer = e.target;
    layer.openPopup();
    infoPopPercentagemConcelho1991.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeaturePopPercentagemConcelho1991(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Percentagem: ' + '<b>' +feature.properties.Perce1991.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeaturePopPercentagemConcelho1991,
        mouseout: apagarPopPercentagemConcelho1991,
    });
}
var PopPercentagemConcelho1991= L.geoJSON(PercentagemVariacaoConcelhos, {
    style:EstiloPopPercentagemConcelho1991,
    onEachFeature: onEachFeaturePopPercentagemConcelho1991,
});


let slidePopPercentagemConcelho1991 = function(){
    var sliderPopPercentagem1991 = document.querySelector('.sliderAtivo');

    

    if (ifSlide2isActive != 17){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPopPercentagem1991, {
        start: [minimoPercentagem1991, maximoPercentagem1991],
        tooltips:true,
        connect: true,
        range: {
            'min': minimoPercentagem1991,
            'max': maximoPercentagem1991
        },
        });
    inputNumberMin.setAttribute("value",minimoPercentagem1991);
    inputNumberMax.setAttribute("value",maximoPercentagem1991);

    inputNumberMin.addEventListener('change', function(){
        sliderPopPercentagem1991.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopPercentagem1991.noUiSlider.set([null, this.value]);
    });

    sliderPopPercentagem1991.noUiSlider.on('update',function(e){
        PopPercentagemConcelho1991.eachLayer(function(layer){
            if(layer.feature.properties.Perce1991>=parseFloat(e[0])&& layer.feature.properties.Perce1991 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopPercentagem1991.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 17;
    sliderAtivo = sliderPopPercentagem1991.noUiSlider;
    $(slidersGeral).append(sliderPopPercentagem1991);
} 
//////------ Fim Percentagem Concelho -----/////

///// População Residente por Freguesia \\\\
function getRadius2(area) {
    var radius = Math.sqrt(area/Math.PI);
    return radius * 0.12;
};

let PopFreguesia;
var minFreguesia2021 = 0;
var maxFreguesia2021 = 1;

function EstiloFreguesia(feature, latlng) {
    if(feature.properties.Pop2021F< minFreguesia2021 || minFreguesia2021 ===0){
        minFreguesia2021 = feature.properties.Pop2021F
    }
    if(feature.properties.Pop2021F> maxFreguesia2021){
        maxFreguesia2021 = feature.properties.Pop2021F
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius2(feature.properties.Pop2021F)
    });
}
function ApagarFreguesia(e){
    var layer = e.target;
    PopFreguesia.resetStyle(layer)
    layer.closePopup();
}

function highlightFeature2(e) {
    var layer = e.target;
    layer.openPopup();
    info1.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeature3(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Pop2021F + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeature2,
        mouseout: ApagarFreguesia
    });
}
PopFreguesia= L.geoJSON(PopResidenteFreguesia,{
    pointToLayer:EstiloFreguesia,
    onEachFeature: onEachFeature3
})


let info1 = L.control();

info1.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info1.update = function (feature) {
    this._div.innerHTML = '<h4>População Residente</h4>' +  (feature ?
    '<b>' 
    + feature.Freguesia + 
    '</b><br />'
    + feature.Pop2021F +
    ' pessoas ': '');
};
var colorize2 = function(tituloescrito, maximo,medio,minimo) {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'center'
    var symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'symbolsContainer'
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

            currentRadius = getRadius2(classes[i]);

            margin = -currentRadius - lastRadius - 2;

            $(legendCircle).attr("style", "width: " + currentRadius*2 +
                "px; height: " + currentRadius*2 +
                "px; margin-left: " + margin + "px" );

            $(legendCircle).append("<span class='legendValue2'>"+classes[i]+"<span>");

            $(symbolsContainer).append(legendCircle);

            lastRadius = currentRadius;
        }
        $(legendaA).append(symbolsContainer); 
        legendaA.style.visibility = "visible"
}
var slide2 = function(){
    var sliderPopFreguesia2021 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPopFreguesia2021, {
        start: [minFreguesia2021, maxFreguesia2021],
        tooltips:true,
        connect: true,
        range: {
            'min': minFreguesia2021,
            'max': maxFreguesia2021
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    inputNumberMin.setAttribute("value",minFreguesia2021);
    inputNumberMax.setAttribute("value",maxFreguesia2021);

    inputNumberMin.addEventListener('change', function(){
        sliderPopFreguesia2021.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopFreguesia2021.noUiSlider.set([null, this.value]);
    });

    sliderPopFreguesia2021.noUiSlider.on('update',function(e){
        PopFreguesia.eachLayer(function(layer){
            if(layer.feature.properties.Pop2021F>=parseFloat(e[0])&& layer.feature.properties.Pop2021F <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopFreguesia2021.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 2;
    sliderAtivo = sliderPopFreguesia2021.noUiSlider;
    $(slidersGeral).append(sliderPopFreguesia2021);
} 
///// Fim Número Residentes por Freguesia 2021 \\\\\
///// Número Residentes por Freguesia 2011 \\\\\\
let PopFreguesia2011;
var minFreguesia2011 = 0;
var maxFreguesia2011 = 1;

function EstiloPopFreguesia2011(feature, latlng) {
    if(feature.properties.Pop2011F< minFreguesia2011 || minFreguesia2011 ===0){
        minFreguesia2011 = feature.properties.Pop2011F
    }
    if(feature.properties.Pop2011F> maxFreguesia2011){
        maxFreguesia2011 = feature.properties.Pop2011F
    }
    return L.circleMarker(latlng, {
        color: 'black',
        weight: 1,
        fillColor: 'red',
        fillOpacity: 0.7,
        radius: getRadius2(feature.properties.Pop2011F)
    });
}
function ApagarFreguesia2011(e){
    var layer = e.target;
    PopFreguesia2011.resetStyle(layer)
    layer.closePopup();
}

function highlightFeaturePopFreguesia2011(e) {
    var layer = e.target;
    layer.openPopup();
    info11.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeaturePopFreguesia2011(feature, layer) {
    layer.bindPopup( 'Freguesia: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> '  + 'Residentes: ' + '<b>' +feature.properties.Pop2011F + '</b>').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeaturePopFreguesia2011,
        mouseout: ApagarFreguesia2011
    });
}
PopFreguesia2011= L.geoJSON(PopResidenteFreguesia,{
    pointToLayer:EstiloPopFreguesia2011,
    onEachFeature: onEachFeaturePopFreguesia2011
})


let info11 = L.control();

info11.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info11.update = function (feature) {
    this._div.innerHTML = '<h4>População Residente</h4>' +  (feature ?
    '<b>' 
    + feature.Freguesia + 
    '</b><br />'
    + feature.Pop2011F +
    ' pessoas ': '');
};
var slidePopFreguesia2011 = function(){
    var sliderPopFreguesia2011 = document.querySelector('.sliderAtivo');

    if (ifSlide2isActive != 11){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderPopFreguesia2011, {
        start: [minFreguesia2011, maxFreguesia2011],
        tooltips:true,
        connect: true,
        range: {
            'min': minFreguesia2011,
            'max': maxFreguesia2011
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    inputNumberMin.setAttribute("value",minFreguesia2011);
    inputNumberMax.setAttribute("value",maxFreguesia2011);

    inputNumberMin.addEventListener('change', function(){
        sliderPopFreguesia2011.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderPopFreguesia2011.noUiSlider.set([null, this.value]);
    });

    sliderPopFreguesia2011.noUiSlider.on('update',function(e){
        PopFreguesia2011.eachLayer(function(layer){
            if(layer.feature.properties.Pop2011F>=parseFloat(e[0])&& layer.feature.properties.Pop2011F <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderPopFreguesia2011.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 11;
    sliderAtivo = sliderPopFreguesia2011.noUiSlider;
    $(slidersGeral).append(sliderPopFreguesia2011);
} 

///// Variação População Residente por Freguesia \\\\

function CorVariacaoFreguesia(d) {
    return d > 2 ? 'rgb(255,82,82)' :
    d > 1 ? 'rgb(255,186,186)' :
    d > -5  ? 'rgb(255,247,192)' :
    d > -15   ? 'rgb(62,123,169)' :
    d > -25   ? 'rgb(14,89,147)' :
              '';
}
var minimoVariacaoFreg = 0;
var maximoVariacaoFreg = 1;

function EstiloPopVariacaoFreguesia(feature) {
    if(feature.properties.Var21_11 <= minimoVariacaoFreg || minimoVariacaoFreg ===0){
        minimoVariacaoFreg = feature.properties.Var21_11
    }
    if(feature.properties.Var21_11 > maximoVariacaoFreg){
        maximoVariacaoFreg = feature.properties.Var21_11 + 0.01
    }
    return {
        weight: 2,
        opacity: 1,
        color: 'grey',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorVariacaoFreguesia(feature.properties.Var21_11)};
    }


function apagarPopVariacaoFreguesia(e) {
    VariacaoPopFreguesia.resetStyle(e.target)
    e.target.closePopup();

} 
let info7 = L.control();

info7.onAdd = function(map){
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};
info7.update = function (feature) {
    this._div.innerHTML = '<h4>Variação de População Residente entre 2011 e 2021</h4>' +  (feature ?
    '<b>' 
    + feature.Freguesia + 
    '</b><br />'
    + feature.Var21_11.toFixed(2)  +
    '% </sup>': '');
};
function highlightFeature7(e) {
    var layer = e.target;
    layer.openPopup();
    info7.update(layer.feature.properties);
    layer.setStyle({
        weight: 2,
        color: 'white',
        dashArray: '1',
        fillOpacity: 0.9
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();}
}
function onEachFeatureFreguesia(feature, layer) {
    layer.bindPopup( 'Concelho: ' + '<b> ' + feature.properties.Freguesia + '</b>' + ' <br> '  + 'Taxa de Variação: ' + '<b>' + feature.properties.Var21_11.toFixed(2) + '</b>' + '%').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: highlightFeature7,
        mouseout: apagarPopVariacaoFreguesia,
    });
}
var VariacaoPopFreguesia= L.geoJSON(PercentagemVariacaoFreguesias, {
    style:EstiloPopVariacaoFreguesia,
    onEachFeature: onEachFeatureFreguesia
});
let slide5 = function(){;
    var sliderVariacaoFreguesia2021 = document.querySelector('.sliderAtivo');


    
    if (ifSlide2isActive != 5){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderVariacaoFreguesia2021, {
        start: [minimoVariacaoFreg, maximoVariacaoFreg],
        tooltips:true,
        connect: true,
        range: {
            'min': minimoVariacaoFreg,
            'max': maximoVariacaoFreg
        },
        });
    inputNumberMin.setAttribute("value",minimoVariacaoFreg);
    inputNumberMax.setAttribute("value",maximoVariacaoFreg);

    inputNumberMin.addEventListener('change', function(){
        sliderVariacaoFreguesia2021.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderVariacaoFreguesia2021.noUiSlider.set([null, this.value]);
    });

    sliderVariacaoFreguesia2021.noUiSlider.on('update',function(e){
        VariacaoPopFreguesia.eachLayer(function(layer){
            if(layer.feature.properties.Var21_11>=parseFloat(e[0])&& layer.feature.properties.Var21_11 <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderVariacaoFreguesia2021.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })

    ifSlide2isActive = 5;
    sliderAtivo = sliderVariacaoFreguesia2021.noUiSlider;
    $(slidersGeral).append(sliderVariacaoFreguesia2021);
} 
var LegendaVariacaoFreguesias = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'symbolsContainer'
    var titulo = 'Variação da População por Freguesia entre 2021 e 2011'
    var	classes = [-25,-15,-5, 1, 2];

    $(legendaA).append("<div id='legendTitle'>" + titulo +"</div>")

    for (var i = 0; i < classes.length; i++) {
        var lowValue = (classes[i] > 1) ? (classes[i]) : classes[i];
        var highValue = classes[(i) + 1];
        symbolsContainer.innerHTML += '<i style="background:' +  CorVariacaoFreguesia(classes[i] + 1) + '"></i>' +
        lowValue + " " +(highValue ? "&ndash;" + " "+highValue + "<br>" : "+");
        $(legendaA).append(symbolsContainer); 
        
    }
}

//// FIM da variação da população residente por freguesia \\\\
/// Função do zoom\\\\
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}


///painelLegenda.style.visibility ="visible";
var exp = document.querySelector('.ine');
exp.style.visibility = "visible";
exp.innerHTML= '<strong>'+ 'Fonte: ' + '</strong>' + 'Instituto Nacional de Estatística' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+ ' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
legendaA.style.visibility = "visible";
escalasFreguesia.style.visibility = "hidden";


let naoDuplicar = 1
let informacao = info3;
let layerAtiva = PopulacaoResidenteConcelho2021;
let baseAtiva = contorno;
let novaLayer = function(layer, info){

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

    if (informacao !=null){
        map.eachLayer(function(){
            map.removeControl(informacao);
        });
    }
    info.addTo(map);
    informacao = info;
    
    if (layer == PopulacaoResidenteConcelho2021 && naoDuplicar != 1){
        colorize('Nº de Habitantes em 2021',303854, (303854-21154)/2,21154);
        contorno.addTo(map)
        slide();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Instituto Nacional de Estatística' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        baseAtiva = contorno;
        naoDuplicar = 1;
    }
    if (layer == PopulacaoResidenteConcelho2021 && naoDuplicar == 1){
        contorno.addTo(map);
     }
    if (layer == PopFreguesia && naoDuplicar != 2){
        contornoFreg.addTo(map);
        colorize2('Nº de Habitantes por Freguesia em 2021',52850, Math.round((52850-171)/2),171);
        slide2();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'INE' + "<a href='https://www.google.pt'>"+ ' ' +'<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        baseAtiva = contornoFreg;
        naoDuplicar = 2;
     }
    if (layer == PopPercentagemConcelho2021 && naoDuplicar != 3){
        LegendaPercentagemConcelhos('Percentagem da População em 2021', 17.5,10,5,4,2,1,0,CorPopPercentagemConcelho2021);
        slidePopPercentagemConcelho2021();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Instituto Nacional de Estatística' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 3;
    }
    if (layer == PopPercentagemConcelho2011 && naoDuplicar != 15){
        LegendaPercentagemConcelhos('Percentagem da População em 2011', 17.5,10,5,4,2,1,0,CorPopPercentagemConcelho2021);
        slidePopPercentagemConcelho2011();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Instituto Nacional de Estatística' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 15;
    }
    if (layer == PopPercentagemConcelho2001 && naoDuplicar != 16){
        LegendaPercentagemConcelhos('Percentagem da População em 2001', 17.5,10,5,4,2,1,0,CorPopPercentagemConcelho2021);
        slidePopPercentagemConcelho2001();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Instituto Nacional de Estatística' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 16;
    }
    if (layer == PopPercentagemConcelho1991 && naoDuplicar != 17){
        LegendaPercentagemConcelhos('Percentagem da População em 2001', 17.5,10,5,4,2,1,0,CorPopPercentagemConcelho2021);
        slidePopPercentagemConcelho1991();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Instituto Nacional de Estatística' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 17;
    }
    if (layer == PopVariacaoConcelho21_11 && naoDuplicar != 4){
        LegendaVariacaoConcelhos2021_2011();
        slidePopVariacaoConcelho21_11();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Ine' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 4;
    }
    if (layer == VariacaoPopFreguesia && naoDuplicar != 5){
        LegendaVariacaoFreguesias();
        slide5();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Ine' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 5;
    }
    if (layer == PopulacaoResidenteConcelho2011 && naoDuplicar != 6){
        colorize('Nº de Habitantes em 2011',302298,140293,21713);
        contorno.addTo(map)
        slidePopulacaoResidenteConcelho2011();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'iNE' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 6;
    }
    if (layer == PopulacaoResidenteConcelho2001 && naoDuplicar != 7){
        colorize('Nº de Habitantes em 2001',288749,Math.round((288749-21102)/2),21102);
        contorno.addTo(map);
        slidePopulacaoResidenteConcelho2001();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'iNe' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 7;
    }
    if (layer == PopVariacaoConcelho11_01 && naoDuplicar != 9){
        LegendaVariacaoConcelhos2011_2001()
        slidePopVariacaoConcelho11_01();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Inas' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 9;
    }
    if (layer == PopVariacaoConcelho01_91 && naoDuplicar != 18){
        LegendaVariacaoConcelhos01_91()
        slidePopVariacaoConcelho01_91();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'InE' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 18;
    }
    if (layer == PopVariacaoConcelho91_81 && naoDuplicar != 19){
        LegendaVariacaoConcelhos91_81()
        slidePopVariacaoConcelho91_81();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'INE' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 19;
    }
    if (layer == PopulacaoResidenteConcelho1991 && naoDuplicar != 8){
        colorize('Nº de Habitantes em 1991', 302472, (302472-18452)/2,18452);
        contorno.addTo(map)
        slidePopulacaoResidenteConcelho1991();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'INE' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 8;
    }
    if (layer == PopFreguesia2011 && naoDuplicar != 11){
        colorize2('Nº de Habitantes por Freguesia em 2011',52422 , Math.round((52422-222)/2),222);
        contornoFreg.addTo(map);
        slidePopFreguesia2011();
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Benfica' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        naoDuplicar = 11
    }

    layer.addTo(map);
    layerAtiva = layer;  
}



let opcaoGrafico = function(){
    mapDIV.style.visibility = "hidden";
    myDIV.style.visibility = "hidden";
    legendaA.style.visibility = "hidden";
    painelLegenda.style.visibility = "hidden";
    tabela.style.visibility = 'hidden';
    filtrar.style.visibility = "hidden";
    slidersGeral.style.visibility = "hidden"
    opcoesTabela.style.visibility = "hidden";
    escalasConcelho.style.visibility = "hidden";
    barraTabela.style.visibility = "hidden";
    escalasFreguesia.style.visibility = "hidden";
    temporal.style.visibility = "hidden"
    grafico.style.visibility = "visible";
    absolutoFreguesia.setAttribute("class", " btn");
    absolutoConcelho.setAttribute("class","btn");
    

}
let opcaoMapa = function(){
    mapDIV.style.visibility = "visible";
    myDIV.style.visibility = "visible";
    painelLegenda.style.visibility = "visible";
    grafico.style.visibility = "hidden";
    tabela.style.visibility = 'hidden';
    opcoesTabela.style.visibility = "hidden";
    barraTabela.style.visibility = "hidden";
    filtrar.style.visibility ="visible";
    escalasConcelho.style.visibility = "visible";   
    legendaA.style.visibility = "visible";

    absolutoConcelho.setAttribute("class"," butao active4");
    variacaoConcelho.setAttribute("class","butao");
    percentagemConcelhos.setAttribute("class","butao");

    slidersGeral.style.visibility = "visible";
    novaLayer(PopulacaoResidenteConcelho2021,info3);
    exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Instituto Nacional de Estatística' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
    temporal.style.visibility = "visible";

}
let opcaoTabela = function(){

    mapDIV.style.visibility = "hidden";
    myDIV.style.visibility = "hidden";
    legendaA.style.visibility = "hidden";
    painelLegenda.style.visibility = "hidden";
    grafico.style.visibility = "hidden";
    filtrar.style.visibility = "hidden";
    escalasConcelho.style.visibility = "hidden";
    escalasFreguesia.style.visibility = "hidden";
    tabela.style.visibility = 'visible';
    barraTabela.style.visibility = "visible";
    opcoesTabela.style.visibility = "visible";
    slidersGeral.style.visibility = "hidden"
    opcao.setAttribute("class", "butaoEscala active2");
    divFreguesias.setAttribute("class", "butaoEscala");
    PopResidenteTabela();

}
let primeirovalor = function(){
    $("#mySelect").val("2021");
    $('#mySelect').css('width', 'auto')
}
let reporAnos = function(){
    primeirovalor();
    $('#mySelect')[0].options[0].innerHTML = "2021";
    $('#mySelect')[0].options[1].innerHTML = "2011";
    $('#mySelect')[0].options[2].innerHTML = "2001";
    $('#mySelect')[0].options[3].innerHTML = "1991";
}
let reporAnosVariacao = function(){
    primeirovalor();
    $('#mySelect')[0].options[0].innerHTML = "2021 - 2011";
    $('#mySelect')[0].options[1].innerHTML = "2011 - 2001";
    $('#mySelect')[0].options[2].innerHTML = "2001 - 1991";
    $('#mySelect')[0].options[3].innerHTML = "1991 - 1981";
}

divFreguesias.addEventListener('click',function(){
    variaveisMapaFreguesias();
    reportAnos();
});
opcao.addEventListener('click',function(){
    variaveisMapaConcelho();
    reporAnos();
});

absolutoConcelho.addEventListener('click',function(){
    novaLayer(PopulacaoResidenteConcelho2021, info3);
    reporAnos();
});
variacaoConcelho.addEventListener('click', function(){
    novaLayer(PopVariacaoConcelho21_11, infoPopVariacaoConcelho21_11);
    reporAnosVariacao();
});
percentagemConcelhos.addEventListener('click',function(){
    novaLayer(PopPercentagemConcelho2021, infoPopPercentagemConcelho2021);
    reporAnos();
});

absolutoFreguesia.addEventListener('click',function(){
    novaLayer(PopFreguesia, info1);
    reporAnos();
});
variacaoFreguesia.addEventListener('click',function(){
    novaLayer(VariacaoPopFreguesia, info7);
    reporAnosVariacao();
});
function myFunction() {
    var selectedValue = document.getElementById("mySelect").value;
    if($(absoluto).hasClass('active4')){
        if (selectedValue == "2021"){
            novaLayer(PopulacaoResidenteConcelho2021,info3);
        };
        if (selectedValue == "2011"){
            novaLayer(PopulacaoResidenteConcelho2011,info8);
        };
        if (selectedValue == "2001"){
            novaLayer(PopulacaoResidenteConcelho2001,info9);
        };
        if (selectedValue == "1991"){
            novaLayer(PopulacaoResidenteConcelho1991,infoPopulacaoResidenteConcelho1991);
        };

    }if($(absolutoFreguesia).hasClass('active5')){
        if (selectedValue == "2021"){
            novaLayer(PopFreguesia,info1);
        };
        if (selectedValue == "2011"){
            novaLayer(PopFreguesia2011,info11);
        };
    }
    if($(variacaoConcelho).hasClass('active4')){
        if (selectedValue == "2021"){
            novaLayer(PopVariacaoConcelho21_11, infoPopVariacaoConcelho21_11);
        }
        if (selectedValue == "2011"){
            novaLayer(PopVariacaoConcelho11_01, infoPopVariacaoConcelho11_01)
        }
        if (selectedValue == "2001"){
            novaLayer(PopVariacaoConcelho01_91, infoPopVariacaoConcelho01_91)
        }
        if (selectedValue == "1991"){
            novaLayer(PopVariacaoConcelho91_81, infoPopVariacaoConcelho91_81)
        }
    }
    if ($(percentagem).hasClass('active4')){
        if (selectedValue == "2021"){
            novaLayer(PopPercentagemConcelho2021, infoPopPercentagemConcelho2021)
        }
        if (selectedValue == "2011"){
            novaLayer(PopPercentagemConcelho2011, infoPopPercentagemConcelho2011)
        }
        if (selectedValue == "2001"){
            novaLayer(PopPercentagemConcelho2001, infoPopPercentagemConcelho2001)
        }
        if (selectedValue == "1991"){
            novaLayer(PopPercentagemConcelho1991, infoPopPercentagemConcelho1991)
        }
    }


}
//$("#mySelect option[value='2001']").remove();
//$("#mySelect option[value='1991']").remove();

var PopResidenteTabela = function(){
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/waza/main/PopulacaoResidenteTabela.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                dados += '<td>'+value.FIELD1+'</td>';
                dados += '<td>'+value.FIELD2+'</td>';
                dados += '<td>'+value.FIELD3+'</td>';
                dados += '<td>'+value.FIELD4+'</td>';
                dados += '<td>'+value.FIELD5+'</td>';
                dados += '<td>'+value.FIELD6+'</td>';
                dados += '<tr>';
                })
        $('#juntarValores').append(dados);   
        exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Instituto Nacional de Estatística' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
    });
})};


tabelaPopResidente.addEventListener('click', function(){
    PopResidenteTabela();;   
    });


tabelaVariacao.addEventListener('click', function(){
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/waza/main/VariacaoPopulacaoTabela.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                dados += '<td>'+value.FIELD1+'</td>';
                dados += '<td>'+value.FIELD2+'</td>';
                dados += '<td>'+value.FIELD3+'</td>';
                dados += '<td>'+value.FIELD4+'</td>';
                dados += '<td>'+value.FIELD5+'</td>';
                dados += '<td>'+value.FIELD6+'</td>';
                dados += '<tr>';
                })
                exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'INE (Cálculos próprios)' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        $('#juntarValores').append(dados); 
    });
    });
});
tabelaPercentagem.addEventListener('click', function(){
    $(document).ready(function(){
        $.getJSON("https://raw.githubusercontent.com/diogoomb/waza/main/PercentagemPopulacaoTabela.json", function(data){
            $('#juntarValores').empty();
            var dados = '';
            $.each(data, function(key, value){
                dados += '<tr>';
                dados += '<td>'+value.FIELD1+'</td>';
                dados += '<td>'+value.FIELD2+'</td>';
                dados += '<td>'+value.FIELD3+'</td>';
                dados += '<td>'+value.FIELD4+'</td>';
                dados += '<td>'+value.FIELD5+'</td>';
                dados += '<td>'+value.FIELD6+'</td>';
                dados += '<tr>';
                })
                exp.innerHTML = '<strong>'+ 'Fonte: ' + '</strong>' + 'Instituto Nacional de Estatística' + "<a href='https://www.ine.pt/bddXplorer/htdocs/minfo.jsp?var_cd=0011187&lingua=PT'>"+' ' + '<img src="../imagens/seta2.svg" width="10px" height="20px"></a>';
        $('#juntarValores').append(dados); 
    });
    });
});
absolutoFreguesia.setAttribute("class", "btn");
let variaveisMapaConcelho = function(){
    escalasConcelho.style.visibility = "visible";
    escalasFreguesia.style.visibility = "hidden";
    absolutoFreguesia.setAttribute("class", " btn");
    ///$("#mySelect option[value='2001']").remove();
    //$("#mySelect option[value='1991']").remove();
    if($(absoluto).hasClass('active4')){
        return false;
    }
    else{
        opcao.setAttribute("class", " btn active2")
        absoluto.setAttribute("class", " butao active4");
        variacaoConcelho.setAttribute("class","  butao");
        percentagemConcelhos.setAttribute("class"," butao");
        novaLayer(PopulacaoResidenteConcelho2021, info3);
        $("#mySelect").val("2021");

    }

}


let variaveisMapaFreguesias = function(){
    escalasConcelho.style.visibility = "hidden";
    escalasFreguesia.style.visibility = "visible";
    if($(absolutoFreguesia).hasClass('active5')){
        return false;
    }
    else{
        absolutoFreguesia.setAttribute("class", " btn active5");
        variacaoFreguesia.setAttribute("class","btn");
        percentagemFreguesia.setAttribute("class","btn");
        ////Preciso de colocar este absoluto como active5, para que mude para a escala concelho
        absoluto.setAttribute("class","btn");
        novaLayer(PopFreguesia, info1);
        $("#mySelect").val("2021");
        //$('#mySelect').append("<option value='2001'>2001</option>")
        //$('#mySelect').append("<option value='1991'>1991</option>")
}
}

// function Next() {
//     var index;
//     var selecionarAnos = document.getElementById("mySelect");
//     var options = selecionarAnos.getElementsByTagName("option")
//     for (var i = 0; i < options.length; i++) {
//         if (options[i].selected) {
//             console.log(options[i]);
//             index = i;
//             myFunction();
            
//         }
//     }
//     console.log(index);
//     index = index +1;
//     console.log(index);
//     if (index >= selecionarAnos.length) {
//         alert('Last record reached')
//     }
//     else {               
//         console.log(selecionarAnos.value)
//         selecionarAnos.value = selecionarAnos[index].value;
//     }

// }
// function Previous() {
//     var index;
//     var selecionarAnos = document.getElementById("mySelect");
//     var options = selecionarAnos.getElementsByTagName("option")
//     for (var i = 0; i < options.length; i++) {
//         if (options[i].selected) {
//             index = i;
//             myFunction();
//         }
//     }
//     index = index - 1;

//     if (index <= -1) {
//         alert('First record reached')
//     }
//     else {               
//         selecionarAnos.value = selecionarAnos[index].value;
//     }
// } 
const opcoesAnos = $('#mySelect');      
function next(){
    opcoesAnos.find('option:selected').next().prop('selected', true);
    myFunction();
}
function prev(){
    opcoesAnos.find('option:selected').prev().prop('selected', true);
    myFunction();
}
$("#btnNext").click(function(e){ 
    e.preventDefault(); 
     }); 
$("#btnPrev").click(function(e){ 
    e.preventDefault(); 
     }); 





/*
var Arouca = {
    label: "Arouca",
    data: [26378, 23896,24227,22359,21154],
    tension:0.3,
    fill: false,
    borderColor: 'red'
};
var Espinho={
    label: "Espinho",
    data: [23084, 32409,33701,31786,31027],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Gondomar={
    label: "Gondomar",
    data: [84599, 130751,164096,168027,164255],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Maia={
    label: "Maia",
    data: [53643, 81679,120111,135306,134959],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Matosinhos={
    label: "Matosinhos",
    data: [91017, 136498,167026,175478,172669],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Oliveira={
    label: "Oliveira de Azeméis",
    data: [46263, 62821,70721,68611,66190],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Paredes={
    label: "Paredes",
    data: [43388, 67693,83376,86854,84414],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Porto={    
    label: "Porto",
    data: [303424, 327368,263131,237591,231962],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Povoa={    
    label: "Póvoa de Varzim",
    data: [40444, 54248,63470,63408,64320],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Santa={    
    label: "Santa Maria da Feira",
    data: [83483, 109531,135964,139312,136720],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var SantoTirso={    
    label: "Santo Tirso",
    data: [77130, 93482,72396,71530,67785],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var SJM={    
    label: "São João da Madeira",
    data: [11921, 16444,21102,21713,22162],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Trofa={    
    label: "Trofa",
    data: [0, 0,37581,38999,38612],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Vale={    
    label: "Vale de Cambra",
    data: [20404, 24224,24798,22864,21279],
    tension:0.3,
    fill: false,
    borderColor: 'green'
}
var Valongo={    
    label: "Valongo",
    data: [33300, 64234,86005,93858,94795],
    tension:0.3,
    fill: false,
    borderColor: 'red'
}
var Vila={    
    label: "Vila do Conde",
    data: [48806, 64402,74391,79533,80921],
    tension:0.3,
    fill: false,
    borderColor: 'yellow',
}
var Gaia={    
    label:"Vila Nova de Gaia",
    data: [157357, 226331,288749,302295,304149],
    tension:0.3,
    fill: false,
    borderColor: 'rgb(23,102,233)', 
}

// tipo de ponto    pointStyle: 'triangle'
// tamanho do ponto    pointBorderWidth:10
// cor da borda dos pontos    pointBorderColor: 'rgb(134,75,89)'
// espessura da linha    borderWidth: 10
// preencher a cor do retangulo dentro da legenda assim como os pontos    backgroundColor: 'rgb(230,5,123)'
///}
var Anos = {
    labels: ["1960", "1981", "2001", "2011", "2021"],
    datasets: [Arouca, Espinho,Gondomar,Maia,Matosinhos,Oliveira, Paredes, Porto,Povoa, Santa, SantoTirso, SJM, Trofa, Vale, Valongo, Vila, Gaia]
};
  
const ctx = document.getElementById('grafico').getContext('2d');

var chartOptions = {
    responsive:false,
    plugins:{
        legend: {
            display: true,
            position: 'top',
            labels: {
                boxWidth: 10,
                boxHeight:3,
                color: 'orange'
            },
        },
    },

}
  
var lineChart = new Chart(ctx, {
    type: 'line',
    data: Anos,
    options: chartOptions,
    
  }); */


// ///// ------ Gráfico Atual -------\\\\\
//   am4core.ready(function() {

// // // // Themes begin
//   am4core.useTheme(am4themes_animated);
// // // // Themes end

//   var chart = am4core.create("grafico", am4plugins_forceDirected.ForceDirectedTree);
//   chart.language.locale["_thousandSeparator"] = "."; 

//   var graficoPopResi = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())


//   graficoPopResi.dataSource.url ="https://raw.githubusercontent.com/diogoomb/waza/main/string-to-json-online%20(1).json"
//   graficoPopResi.colors.list = [
//       am4core.color("#ffd700"),
//      am4core.color("#ffb00b"),
//      am4core.color("#55aacc"),
//      am4core.color("#5566cc"),
//       am4core.color("#0e2763"),
//       am4core.color("#76d75b"),
//     am4core.color("#5fb565"),
//      am4core.color("#175f3b"),
//   am4core.color("#ff0000"),
//     am4core.color("#ff6666"),
//       am4core.color("#800000"),
//             am4core.color("#696969"),
//     am4core.color("#cbbeb5"),
//       am4core.color("#101010"),
//       am4core.color("#6e1243"),
//       am4core.color("#a89f4d"),
//     am4core.color("#e1c981"),
//  ];

//   graficoPopResi.dataFields.name = "name";
//   graficoPopResi.dataFields.id = "name";
//   graficoPopResi.dataFields.value = "value";
//   graficoPopResi.dataFields.children = "children";
//   graficoPopResi.dataFields.color = "color";
//   graficoPopResi.dataFields.collapsed = false;



//  graficoPopResi.nodes.template.tooltipText = "[bold]{name}: [/]" + "{value}" + " Residentes";
//  graficoPopResi.nodes.template.label.text = "{name}"; 
//  graficoPopResi.nodes.template.label.hideOversized = true;
//  graficoPopResi.nodes.template.label.truncate = true;

//  graficoPopResi.nodes.template.fillOpacity = 0.85;
//  graficoPopResi.nodes.template.outerCircle.fillOpacity = 0;

//  graficoPopResi.links.template.strokeOpacity = 0;

//  graficoPopResi.links.template.distance = 1;
//  graficoPopResi.fontSize = 10;
//  graficoPopResi.manyBodyStrength = -4;

//  graficoPopResi.minRadius = am4core.percent(2);

//  graficoPopResi.events.on("inited", function() {
//      graficoPopResi.animate({
//        property: "velocityDecay",
//        to: 0.8
//       }, 1000);
//     });
//   });  

/////-------------------------------\\\
/////----- OUTRO TIPO DE GRÁFICO -------\\\\\

/* 

 var chartDom = document.getElementById('grafico');
 var myChart = echarts.init(chartDom);
 var option;
 
 option = {
   title: {
     text: 'Gráfico Linhas'
   },
   tooltip: {
     trigger: 'axis',
   },
   legend: {
     data: ['Arouca', 'Espinho', 'Gondomar', 'Maia', 'Matosinhos']
   },
   grid: {
     left: '3%',
     right: '4%',
     bottom: '3%',
     containLabel: true
   },
   xAxis: {
     type: 'category',
     boundaryGap: false,
     data: ['1991', '2001', '2011', '2021']
   },
   yAxis: {
     type: 'value'
   },
   series: [
     {
       name: 'Arouca',
       type: 'line',
       stack: 'Total',
       data: [45000, 47000, 25000, 22500],
       smooth:true
     },
     {
       name: 'Espinho',
       type: 'line',
       stack: 'Total',
       smooth:true,
       data: [50000, 51000,50000,50500]
     },
     {
       name: 'Gondomar',
       type: 'line',
       stack: 'Total',
       smooth:true,
       data: [65000, 70000, 80000, 90000]
     },
     {
       name: 'Maia',
       type: 'line',
       stack: 'Total',
       smooth:true,
       data: [54250, 56875, 56987, 60257]
     },
     {
       name: 'Matosinhos',
       type: 'line',
       stack: 'Total',
       smooth:true,
       data: [100000, 100932, 110000, 115000]
     }
   ]
 };
 
option && myChart.setOption(option);  */
///-----------------------------\\\ 
/* 
 Highcharts.chart('grafico', {
    chart: {
        type: 'packedbubble',
        height: '74%'
    },
    title: {
        text: 'População Residente na AMP (2021)'
    },
    tooltip: {
        useHTML: true,
        pointFormat: '<b>{point.name}:</b>{point.value} Residentes'
    },
    plotOptions: {
        packedbubble: {
            minSize: '20%',
            maxSize: '200%',
            zMin: 0,
            zMax: 55000,
            layoutAlgorithm: {
                splitSeries: false,
                gravitationalConstant: 0.02,
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}',
                filter: {
                    property: 'y',
                    operator: '>',
                    value: 49500,
                },
                style: {
                    color: 'black',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: seriesOptions
    })
    function success(data) {
    var name = this.url.match(/(msft|aapl|goog)/)[0].toUpperCase();
    var i = names.indexOf(name);
    seriesOptions[i] = {
        name: name,
        data: data
    };

    // As we're loading the data asynchronously, we don't know what order it
    // will arrive. So we keep a counter and create the chart when all the data is loaded.
    seriesCounter += 1;

    if (seriesCounter === names.length) {
        createChart();
    }
} 


 */
// set the dimensions and margins of the graph
const width = 900
const height = 444

// append the svg object to the body of the page
const svg = 
    d3.select("#divGrafico")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    

// Read data
d3.csv("https://raw.githubusercontent.com/diogoomb/waza/main/GraficoPopulacao2021.csv").then( function(data) {
    data.sort(function(a, b){
        return b["value"]-a["value"];
     })


  const color = d3.scaleOrdinal()
    .domain(["Arouca", "Espinho", "Gondomar", "Maia", "Matosinhos", "Oliveira de Azeméis", "Paredes", "Porto", "Póvoa de Varzim", "Santa Maria da Feira", "Santo Tirso", "São João da Madeira", "Trofa", "Vale de Cambra", "Valongo", "Vila do Conde", "Vila Nova de Gaia"])
    .range(["#B8255F","#DB4035","#FF9933","#FAD000","#AFB83B","#7ECC49","#299438","#96C3EB","#4073FF","#14AAF5","#884DFF","#AF38EB","#EB96EB","#808080","#B8B8B8","#003333","#FF8D85"]);

  // Size scale for countries
  const size = d3.scaleLinear()
    .domain([0, 190000])
    .range([7,80])  // circle will be between 7 and 55 px wide
    

  const graficoTitulo = d3.select("#divGrafico")
    .append("div")
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("position","absolute")
    .style("top","20%")
    .style("right","20px")
    .style("font-weight","bolder")
    .text('População Residente em 2021, por freguesia')

  // create a tooltip
  const Tooltip = d3.select("#divGrafico")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("position","absolute")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "7px")
    .style("line-height", "24px")
  // Three function that change the tooltip when user hover / move / leave a cell
  const mouseover = function(event, d) {
    Tooltip
    .style("opacity", 1)
    .style("pointer-events", "none")
    d3.select(this)
    .style("opacity", 1)
    .style("stroke", "black")
    .style("stroke-width", "3")
    .style("cursor", "pointer")
    .transition()
    .duration(200)
  }
  const mousemove = function(event, d) {
    Tooltip
      .html('<b>' + d.key + '</b>' + "<br>"
      + d.value + " Residentes" + "<br>"
      + "Concelho: " + d.subregion + "<br>")
      .style("left", (event.x/2+20) + "px")
      .style("top", (event.y/2-30) + "px")
  }
  var mouseleave = function(event, d) {
    Tooltip
    .style("opacity", 0)
    d3.select(this)
    .transition()
    .duration(200)
    .style("stroke", "transparent")
  }

  // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("class", "node")
      .attr("r", d => size(d.value))
      .attr("cx", width / 2)
      .attr("cy", height / 2)
      .style("fill", d => color(d.subregion))
      .style("fill-opacity", 1)
    //   .attr("stroke", "black") --- Formato Original, com stroke à volta dos círculos
    //   .style("stroke-width", 1)
      .on("mouseover", mouseover) // What to do when hovered
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .call(d3.drag() // call specific function when circle is dragged
           .on("start", dragstarted)
           .on("drag", dragged)
           .on("end", dragended));


  // Features of the forces applied to the nodes:
    const simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(.1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.2).radius(function(d){ return (size(d.value)+3) }).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
            node
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
        });

    // What happens when a circle is dragged?
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }
    // var wrap = svg.selectAll('.legend').append('g').data(color.domain());
    // var gEnter = wrap.enter().append('g').attr('class', 'legend')
    //     .append('g');
    // var legend = wrap.select('g').style("width",500)
    //     .attr("transform", function(d, i) { return "translate(" + i * 80 + ",0)"; });
    const nomesLegenda = d3.scaleOrdinal()
    .domain(["Arouca", "Espinho", "Gondomar", "Maia", "Matosinhos", "O.Azeméis", "Paredes", "Porto", "P.Varzim", "S.M.Feira", "Santo Tirso", "S.J.Madeira", "Trofa", "V.Cambra", "Valongo", "Vila do Conde", "V.N.G"])
    .range(["#B8255F","#DB4035","#FF9933","#FAD000","#AFB83B","#7ECC49","#299438","#96C3EB","#4073FF","#14AAF5","#884DFF","#AF38EB","#EB96EB","#808080","#B8B8B8","#003333","#FF8D85"]);
    const svg1 = 
        d3.select("#divLegenda")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "49px")
    var legend = svg1
        .selectAll('.legend')
        .data(nomesLegenda.domain())
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr("transform", position);

    // draw legend colored circles
    legend.append("circle")
        .style("fill", nomesLegenda)
        .style('stroke', nomesLegenda)
        .attr('r', 5)
        .attr('transform', 'translate(0,20)');

    // // draw legend text
    legend.append("text")
        .attr("dy", ".35em")
        .attr("dx", ".35em")
        .attr('transform', 'translate(10,20)')
        .text(function(d) { return d;})
    
        function position(d,i) {
            var c = 8.5;
            var r = Math.ceil(17 / c);
            var h = 20;  // height of each entry
            var w = 125; // width of each entry (so you can position the next column)
            var tx = 20; // tx/ty are essentially margin values
            var ty = 0;
            var x = Math.floor(i / r) * w + tx;
            var y = i % r * h + ty;
            return "translate(" + x + "," + y + ")";
          }
})