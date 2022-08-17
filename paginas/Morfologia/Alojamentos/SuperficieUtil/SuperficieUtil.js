// $('#mapDIV').css("height", "85%");
////Adicionar basemap
let baseoriginal =L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',{
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'});
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
///'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}'


$('.ine').html('<strong>Fonte: </strong>INE, Recenseamento da população e habitação.');
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

//////----- CIRCULOS
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

///////////////////////////----------------------- DADOS RELATIVOS, CONCELHO--------------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\


////////////////////////////------- Percentagem SUPERFICIE UTIL POR CONCELHOS em 2011-----////

var minSuperficieUtilConc11 = 99999;
var maxSuperficieUtilConc11 = 0;

function CorPercSuperficieConc(d) {
    return d == null ? '#808080' :
        d >= 120 ? '#8c0303' :
        d >= 115  ? '#de1f35' :
        d >= 110  ? '#ff5e6e' :
        d >= 105   ? '#f5b3be' :
        d >= 99   ? '#F2C572' :
                ''  ;
}
var legendaPercSuperficieConc = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: m²' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 120' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 115 a 120' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 110 a 115' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 105 a 110' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 99.44 a 105' + '<br>'

    $(legendaA).append(symbolsContainer); 
}
function EstiloSuperficieUtilConc11(feature) {
    if( feature.properties.Superficie <= minSuperficieUtilConc11){
        minSuperficieUtilConc11 = feature.properties.Superficie
    }
    if(feature.properties.Superficie >= maxSuperficieUtilConc11 ){
        maxSuperficieUtilConc11 = feature.properties.Superficie
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPercSuperficieConc(feature.properties.Superficie)
    };
}
function apagarSuperficieUtilConc11(e) {
    SuperficieUtilConc11.resetStyle(e.target)
    e.target.closePopup();

} 

function onEachFeatureSuperficieUtilConc11(feature, layer) {
    layer.bindPopup('Concelho: ' + '<b>' + feature.properties.Concelho + '</b>' + '<br>' + 'Superfície média útil: ' + '<b>' + feature.properties.Superficie  + '</b>' + 'm²').openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover,
        mouseout: apagarSuperficieUtilConc11,
    });
}
var SuperficieUtilConc11= L.geoJSON(dadosRelativosConcelhos, {
    style:EstiloSuperficieUtilConc11,
    onEachFeature: onEachFeatureSuperficieUtilConc11
});
let slideSuperficieUtilConc11 = function(){
    var sliderSuperficieUtilConc11 = document.querySelector('.sliderAtivo');


    if (ifSlide2isActive != 1){
        sliderAtivo.destroy();
    }

    noUiSlider.create(sliderSuperficieUtilConc11, {
        start: [minSuperficieUtilConc11, maxSuperficieUtilConc11],
        tooltips:true,
        connect: true,
        range: {
            'min': minSuperficieUtilConc11,
            'max': maxSuperficieUtilConc11
        },
        });
    inputNumberMin.setAttribute("value",minSuperficieUtilConc11);
    inputNumberMax.setAttribute("value",maxSuperficieUtilConc11);

    inputNumberMin.addEventListener('change', function(){
        sliderSuperficieUtilConc11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSuperficieUtilConc11.noUiSlider.set([null, this.value]);
    });

    sliderSuperficieUtilConc11.noUiSlider.on('update',function(e){
        SuperficieUtilConc11.eachLayer(function(layer){
            if(layer.feature.properties.Superficie.toFixed(2)>=parseFloat(e[0])&& layer.feature.properties.Superficie.toFixed(2) <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
        sliderSuperficieUtilConc11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 1;
    sliderAtivo = sliderSuperficieUtilConc11.noUiSlider;
    $(slidersGeral).append(sliderSuperficieUtilConc11);
} 
SuperficieUtilConc11.addTo(map);
$('#tituloMapa').html(' <strong>' + 'Superfície média útil (m²) dos alojamentos familiares clássicos de residência habitual, em 2011, por concelho' + '</strong>')
legendaPercSuperficieConc();
slideSuperficieUtilConc11();
/////////////////////////////// Fim SUPERFICIE MÉDIA UTIL CONCELHO em 2011 -------------- \\\\\\

/////////////////////////////////-------------------------- FREGUESIAS --------------------\\\\\\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////////////////----------- SUPERFICIE MÉDIA ÚTIL, EM 2001,Por Freguesia ------------------------------\\\\\\\\\\\\\

var minSuperficieUtilFreg11 = 99999;
var maxSuperficieUtilFreg11 = 0;
function CorPercSuperficieFreg(d) {
    return d == null ? '#808080' :
        d >= 130 ? '#8c0303' :
        d >= 115  ? '#de1f35' :
        d >= 100  ? '#ff5e6e' :
        d >= 80   ? '#f5b3be' :
        d >= 60   ? '#F2C572' :
                ''  ;
}
var legendaPercSuperficieFreg = function() {
    legendaA.textContent = '';
    legendaA.style.textAlign = 'left';
    legendaA.style.visibility = "visible";
    let symbolsContainer = document.createElement("div");
    symbolsContainer.className = 'legendaCoropleto'

    $(legendaA).append("<div class='subheader'>" + 'Unidade de medida: m²' +"</div>")

    symbolsContainer.innerHTML +=  '<i style="background:#8c0303"></i>' + '  > 130' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#de1f35"></i>' + ' 115 a 130' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#ff5e6e"></i>' + ' 100 a 115' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#f5b3be"></i>' + ' 80 a 100' + '<br>'
    symbolsContainer.innerHTML +=  '<i style="background:#F2C572"></i>' + ' 64 a 80' + '<br>'

    $(legendaA).append(symbolsContainer); 
}

function estiloSuperficieUtilFreg11(feature) {
    if(feature.properties.Superficie< minSuperficieUtilFreg11){
        minSuperficieUtilFreg11 = feature.properties.Superficie
    }
    if(feature.properties.Superficie> maxSuperficieUtilFreg11){
        maxSuperficieUtilFreg11 = feature.properties.Superficie
    }
    return {
        weight: 1,
        opacity: 1,
        color: 'black',
        dashArray: '1',
        fillOpacity: 0.8,
        fillColor: CorPercSuperficieFreg(feature.properties.Superficie)
    };
}
function apagarSuperficieUtilFreg11(e){
    var layer = e.target;
    SuperficieUtilFreg11.resetStyle(layer)
    layer.closePopup();
}


function onEachFeatureSuperficieUtilFreg11(feature, layer) {
    layer.bindPopup('Freguesia: ' + '<b>' +feature.properties.Freguesia + '</b>' + '<br>' + 'Concelho: ' + '<b> ' + feature.properties.Concelho + '</b>' + ' <br> '  + 'Superfície média útil: ' + '<b>' +feature.properties.Superficie  + 'm²' + '</b>' ).openPopup()
    layer.on({
        click: zoomToFeature,
        mouseover: hover, 
        mouseout:apagarSuperficieUtilFreg11,
    }) 
};

var SuperficieUtilFreg11= L.geoJSON(dadosRelativosFreguesias,{
    style:estiloSuperficieUtilFreg11,
    onEachFeature: onEachFeatureSuperficieUtilFreg11,
});

var slideSuperficieUtilFreg11 = function(){
    var sliderSuperficieUtilFreg11 = document.querySelector('.sliderAtivo');

    
    if (ifSlide2isActive != 2){
        sliderAtivo.destroy();
    } 

    noUiSlider.create(sliderSuperficieUtilFreg11, {
        start: [minSuperficieUtilFreg11, maxSuperficieUtilFreg11],
        tooltips:true,
        connect: true,
        range: {
            'min': minSuperficieUtilFreg11,
            'max': maxSuperficieUtilFreg11
        },
        format:{
            to: (v) => v | 0,
            from: (v) => v | 0
    }});
    
    inputNumberMin.setAttribute("value",minSuperficieUtilFreg11);
    inputNumberMax.setAttribute("value",maxSuperficieUtilFreg11);

    inputNumberMin.addEventListener('change', function(){
        sliderSuperficieUtilFreg11.noUiSlider.set([this.value, null]);
    });
    inputNumberMax.addEventListener('change', function(){
        sliderSuperficieUtilFreg11.noUiSlider.set([null, this.value]);
    });

    sliderSuperficieUtilFreg11.noUiSlider.on('update',function(e){
        SuperficieUtilFreg11.eachLayer(function(layer){
            if(layer.feature.properties.Superficie>=parseFloat(e[0])&& layer.feature.properties.Superficie <= parseFloat(e[1])){
                layer.addTo(map);
            }
            else{
                map.removeLayer(layer);
            }
        })})
    sliderSuperficieUtilFreg11.noUiSlider.on('update', function( values, handle ) {
        if (handle==0){
            inputNumberMin.value = values[0];
        } else {
            inputNumberMax.value =  values[1];
        }
    })
    ifSlide2isActive = 2;
    sliderAtivo = sliderSuperficieUtilFreg11.noUiSlider;
    $(slidersGeral).append(sliderSuperficieUtilFreg11);
}
///////////////////////////-------------------- FIM SUPERFICIE MÉDIA ÚTIL, EM 2011,Por Freguesia -----------\\\\\\\\\\\\\\\\\\\\\\\




/// Não duplicar as layers
let naoDuplicar = 1
//// dizer qual a layer ativa
let layerAtiva = SuperficieUtilConc11;
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
    if (layer == SuperficieUtilConc11 && naoDuplicar != 1){
        $('#tituloMapa').html(' <strong>' + 'Superfície média útil (m²) dos alojamentos familiares clássicos de residência habitual, em 2011, por concelho' + '</strong>')
        legendaPercSuperficieConc();
        slideSuperficieUtilConc11();
        naoDuplicar = 1;
    }
    if (layer == SuperficieUtilFreg11 && naoDuplicar != 2){
        $('#tituloMapa').html(' <strong>' + 'Superfície média útil (m²) dos alojamentos familiares clássicos de residência habitual, em 2011, por freguesia' + '</strong>')
        legendaPercSuperficieFreg();
        slideSuperficieUtilFreg11();
        naoDuplicar = 2;
    }

    layer.addTo(map);
    layerAtiva = layer;  
}


function myFunction() {
    var ano = document.getElementById("mySelect").value;
    if ($('#concelho').hasClass('active2')){
        if ($('#percentagem').hasClass('active4')){
            if (ano == "2011"){
                    novaLayer(SuperficieUtilConc11)
                }
            }
        }
    if ($('#freguesias').hasClass('active2')){
        if ($('#percentagem').hasClass('active5')){
            if (ano == "2011"){
                    novaLayer(SuperficieUtilFreg11)
            }
        }
    }
}


let primeirovalor = function(ano,tipo){
    $("#mySelect").val(ano);
    $("#opcaoSelect").val(tipo);
}
let tamanhoOutros = function(){
    alterarTamanho.dispatchEvent(new Event('change'));
}

$('#percentagem').click(function(){
    primeirovalor('2011')
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
        $('#percentagem').attr('class',"butao active4");
        primeirovalor('2011');
        tamanhoOutros();
    }
}

let variaveisMapaFreguesias = function(){
    if($('#absoluto').hasClass('active5')){
        return false;
    }
    else{
        $('#percentagem').attr('class',"butao active5")
        primeirovalor('2011');
        tamanhoOutros();

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
    $('#encargoMensal').remove();
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
    $('#opcaoTabela').attr("class","btn");

    $('#temporal').css("visibility","visible");
    $('#slidersGeral').css("visibility","visible");
    $('.btn').css("top","50%");
    primeirovalor('2011')
    tamanhoOutros();  
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
    $('#opcaoFonte').css("visibility","visible");

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
    $('#encargoMensal').remove();

    $('#concelho').attr("class", "butaoEscala EscalasTerritoriais ");
    $('#freguesias').attr('class',"butaoEscala EscalasTerritoriais ");
    $('.btn').css("top","10%");

});
$('#tabelaPercentagem').click(function(){
    DadosAbsolutos();;   
});

function containsAnyLetter(str) {
    return /[a-zA-Z]/.test(str);
  }
var DadosAbsolutos = function(){
    $('#tituloMapa').html('Superfície média útil dos alojamentos familiares clássicos de residência habitual, em 2011, m².')
    $(document).ready(function(){
    $.getJSON("https://raw.githubusercontent.com/diogoomb/links/main/SuperficieUtil.json", function(data){
        $('#juntarValores').empty();
        var dados = '';
        $.each(data, function(key, value){
            dados += '<tr>';
            if(containsAnyLetter(value.Concelho)){
                dados += '<td class="borderbottom bordertop">'+value.Concelho+'</td>';
                dados += '<td class="borderbottom bordertop negrito">'+value.Freguesia+'</td>';;
                dados += '<td class="borderbottom bordertop">'+value.SuperficieMedia+'</td>';
                dados += '<td class="borderbottom bordertop">'+value.DADOS2011+'</td>';
            }
            else{
                dados += '<td>'+value.Concelho+'</td>';
                dados += '<td class=" negrito">'+value.Freguesia+'</td>';
                dados += '<td>'+value.SuperficieMedia+'</td>';
                dados += '<td>'+value.DADOS2011+'</td>';
                dados += '<tr>';
            }
            dados += '<tr>';
        })
    $('#juntarValores').append(dados);   
    });
})}


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
