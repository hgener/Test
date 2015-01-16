var mapAlta = null;
var posAlta = '';
var sDireccionAlta = '';
var sFoto = '';
var sCoords = '';
var sCoord_X = '';
var sCoord_Y = '';
var sComentario = '';

function inicioPaginaDatosIncidencia() {

    //cargar mapa
    iniciaMapa();

    $('#TipusInciImg').attr({"src":dicImagenes[TipoInciSel]});
    $('#TipusInciText').html(dicAyuda[TipoInciSel]);
}



function iniciaMapa() {
    try {
        // Try HTML5 geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {

                posAlta = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapOptions = {
                    zoom: 14,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    accuracy: 5,
                    enabledHighAccuracy: true,
                    overviewMapControl: false,
                    panControl: false,
                    rotateControl: false,
                    scaleControl: false,
                    zoomControl: false,
                    streetViewControl: false,
                    center: posAlta
                    , maximumAge: 0//,timeout:1000
                };
                mapAlta = new google.maps.Map(document.getElementById('divMapaAlta'), mapOptions);
                crearMarcadorEventoClick('ALTA', mapAlta, true, 'labelDireccion', true);

                //mapAlta.setCenter(posAlta);
                sDireccionAlta = cogerDireccion(posAlta, true);
                $('#labelDireccion').text(sDireccionAlta);
                $('#divMensajeMapa').hide();
                $('#divMapaAlta').gmap('refresh');

            }, function () {
                ('#divMapaAlta').hide();
                $('#divMensajeMapa').show();
                getCurrentPositionError(true);
            });
        } else {
            // Browser no soporta Geolocation
            $('#divMapaAlta').hide();
            $('#divMensajeMapa').show();
            getCurrentPositionError(false);
        }
    }
    catch (e) {
        $('#divMapaAlta').hide();
        $('#divMensajeMapa').show();
    }
}

function cogerDireccion(pos, bSoloCalleYnum) {
    var llamaWS = "http://maps.googleapis.com/maps/api/geocode/xml";
    var sParam = "latlng=" + pos.toString().replace(" ", "").replace("(", "").replace(")", "") + "&sensor=true";
    var sDireccion = '';
    try {
        //function LlamaWebService (sTipoLlamada,sUrl,   sParametros,sContentType,                        bCrossDom, sDataType, bProcData, bCache, nTimeOut, funcion,           pasaParam,      asincro, bProcesar, tag)
        var datos = LlamaWebService('GET', llamaWS, sParam, 'application/x-www-form-urlencoded', true, 'xml', false, false, 10000, direccionObtenida, bSoloCalleYnum, true, false, null);
    }
    catch (e) {
        mensaje('ERROR (exception) en cogerDireccion : \n' + e.code + '\n' + e.message);
    }
    //return sDireccion;
}

function direccionObtenida(datos, param) {
    if (datos == null) return;
    var sDireccion = $(datos).find('formatted_address').text();
    var n = 0;

    $(datos).find('formatted_address').each(function () {
        if (n == 0) sDireccion = $(this).text();
        n++;
    });

    if (indefinidoOnullToVacio(param) != '')
        if (param)
            sDireccion = cogerCalleNumDeDireccion(sDireccion);

    sDireccionAlta = sDireccion;
    var sTxt = '<div><table><tr><td style="font-size:x-small; font-weight:bold;">comunicat en </td></tr><tr><td style="font-size:x-small; font-weight:normal;">' + sDireccionAlta + '</td></tr></table></div>';

    //alert('direccionObtenida. bPrimera: ' + bPrimera);
    if (bPrimera == true)
        nuevoMarcadorSobrePlanoClickInfoWindow('ALTA', mapAlta, posAlta, sTxt, null, 300, true, true, 'labelDireccion', false);
    else {
        if (bPrimera == false)
        { }
        else
        {
            nuevoMarcadorSobrePlanoClickInfoWindow('ALTA', mapAlta, posAlta, sTxt, null, 300, true, true, 'labelDireccion', true);
            bPrimera = true;
        }
    }

    $('#labelDireccion').text(sDireccionAlta);
    $('#divMapaAlta').gmap('refresh');

}
