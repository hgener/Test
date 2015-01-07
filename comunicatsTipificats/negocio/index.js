// funciones COMUNES -----------------------------------------------------------------------
var pictureSource;
var destinationType;
var bAbroPagina = true;
var aGlobalCarrers = null;
var aCarrers = null;
var aConfig = null;

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
    //navigator.splashscreen.hide();

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
        estadoBoton('buttonALTA', false);
        estadoBoton('buttonCONSULTA', false);
        $('#labelInfo').text($('#labelInfo').text() + '\nAtenció : localStorage no soportat');
        return;
    }
    else
    {
        try{
                cargaConfigEnArray();
            }
            catch(e){ mensaje('exception carregant llista de carrers : ' + e.message,'error'); }
        }
    //navigator.splashscreen.hide();
    abrirPagina('pageTipoIncidencia', false);

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

    $.mobile.changePage('#' + sPag, {
        transition: "none",
        reverse: true
        ,changeHash: bBack
    });

    switch(sPag)
    {
        case 'pageNuevaIncidencia' :
            $.doTimeout(1500, inicioPaginaNuevaIncidencia() );
            break;
        case 'pageTipoIncidencia':
            $.doTimeout(1500, inicioPaginaTipoIncidencia());
            break;

        case 'pageConsultaIncidencias' :
            inicioPaginaConsultaIncidencias();
            $.doTimeout(1000, mostrarEnPlano() );
            break;

        case 'pageZoomFoto' :
            var imagen = document.getElementById('imgZoomFoto');
            imagen.style.display = 'block';
            imagen.src = "data:image/jpeg;base64," + sFoto;
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





