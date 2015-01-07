// funciones COMUNES -----------------------------------------------------------------------
var pictureSource;
var destinationType;
var bAbroPagina = true;
var aGlobalCarrers = null;
var aCarrers = null;
var aConfig = null;

//hgs per nou flux de treball
var smensaje;
var stitulo;
var controlForm;
var boolControl;


// -------- Al INICIAR -----------------------------------------------------------------------
window.addEventListener('load', function () {
    if (phoneGapRun()) {
        document.addEventListener("deviceReady", deviceReady, false);
    } else {
        deviceReady();
    }
}, false);

function deviceReady() {



    /*hgs 080414*/
    navigator.splashscreen.hide();

    document.addEventListener("backbutton", handleBackButton, true); //Hgs 080514

    if (phoneGapRun()) {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    }
    else
    {
        $('#labelInfo').text($('#labelInfo').text() + '\nAtenció : Phonegap no soportat');
    }

    //Hay localstorage ?
    if( ! $.jStorage.storageAvailable() )
    {
        estadoBoton('buttonP1', false);
        estadoBoton('buttonP2', false);
        estadoBoton('buttonP3', false);
        estadoBoton('buttonP4', false);
        estadoBoton('buttonP5', false);
        estadoBoton('buttonP6', false);

        $('#labelInfo').text($('#labelInfo').text() + '\nAtenció : localStorage no soportat');
        return;
    }
    else
    {
        try{
            cargaConfigEnArray();
            //hgs Nov14
            //obtenir i desar telefon
            //engegar GPS
            //obtenir posicio
            //enviarlesPendents
            //salta a identificació
        }
            catch(e){ mensaje('exception carregant llista de carrers : ' + e.message,'error'); }
        }
    navigator.splashscreen.hide();

}
function handleBackButton(){

    if($.mobile.activePage.attr('id') == '#pageIndex'){
        navigator.app.exitApp();
    }else if ($.mobile.activePage.attr('id') == '#pageZoomFoto'){
        $.mobile.changePage('#pageNuevaIncidencia');
    }else if ($.mobile.activePage.attr('id') == '#pageNuevaIncidencia'|| $.mobile.activePage.attr('id') == '#pageConsultaIncidencias'){
        $.mobile.changePage('#pageIndex');
    }else{
        navigator.app.backHistory();
    }
}


// -------- COMUNES -----------------------------------------------------------------------

//hgs he cambiado transition flip por slide
//transition: "fade",
function abrirPagina(sPag, bBack) {

/* moga

    $("#pageIndex").hide();
    $("#pageNuevaIncidencia").hide();
    $("#pageConsultaIncidencias").hide();
    //Hgs no habria que añadir foto?
 */

    $.mobile.changePage('#' + sPag, {
        transition: "none",
        reverse: true
        ,changeHash: bBack
    });

    switch(sPag)
    {
        case 'pagePantalla1' :
            $.doTimeout(1500, inicioPagePantalla1() );
            break;

        case 'pagePantalla2' :
            $.doTimeout(1500, inicioPaginaNuevaIncidencia() );
            break;

        case 'pagePantalla3' :
            $.doTimeout(1500, inicioPagePantalla3() );
            break;

        case 'pagePantalla4' :
            $.doTimeout(1500, inicioPaginaNuevaIncidencia() );
            break;

        case 'pagePantalla5' :
            inicioPaginaConsultaIncidencias();
            $.doTimeout(1000, mostrarEnPlano() );
            break;

        case 'pagePantalla6' :
            $.doTimeout(1500, inicioPaginaNuevaIncidencia() );
            break;

        case 'pageZoomFoto' :
            var imagen = document.getElementById('imgZoomFoto');
            imagen.style.display = 'block';
            imagen.src = "data:image/jpeg;base64," + sFoto;
            break;
    }

}


function abrirPaginaEnvio(sPag, bBack,smensaje,stitulo, controlForm, boolControl) {

    $.mobile.changePage('#' + sPag, {
        transition: "none",
        reverse: true
        ,changeHash: bBack
    });

    switch(sPag)
    {
        case 'pagePantalla6' :
            $.doTimeout(1500, inicioPaginaEnvio(smensaje,stitulo, controlForm, boolControl) );
            break;
    }

}

function limpiaVariables(sPag){
    switch(sPag)
    {
        case 'pageNuevaIncidencia' :
            sFoto = '';
            sDireccionAlta = '';
            posAlta = '';
            mapAlta = null;
            $('#IdItem').text('');
            $('#labelItem').text('');
            $('#textareaComentari').val('');
            $('#inputNUM').val('');
            $('#labelDireccion').text('');
            $('#selectCARRER').text('');
            break;

        case 'pageConsultaIncidencias' :
            sDireccionConsulta = '';
            posConsulta = '';
            mapConsulta = null;
            break;

    }
}

function reposicionaMapa(){
    actualizarComboCalle();
    iniciaMapaFoto(true);
}





