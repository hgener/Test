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

    document.addEventListener("backbutton", handleBackButton, true);
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
        //hgs Proves mwindows phone 160914, SI SE COMENTAN SE ACTIVAN LOS BOTONES EN WP8.1
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
    navigator.splashscreen.hide();

}
function handleBackButton(){

    if($.mobile.activePage.attr(id) == '#pageIndex'){
        navigator.notification.confirm('Vols sortir de GIVApp?',onConfirm,"Salir",'No,Si');
        //navigator.app.exitApp();
    }else if ($.mobile.activePage.attr('id') == '#pageZoomFoto'){
        $.mobile.changePage('#pageNuevaIncidencia');
    }else if ($.mobile.activePage.attr('id') == '#pageNuevaIncidencia'|| $.mobile.activePage.attr('id') == '#pageConsultaIncidencias'
        || $.mobile.activePage.attr('id')=='#pageInfo'){
        $.mobile.changePage('#pageIndex');
    }else{
        navigator.app.backHistory();
    }
}


function onConfirm(button) {
    if(button==2){
        navigator.app.exitApp();
    }
}

// -------- COMUNES -----------------------------------------------------------------------

//hgs he cambiado transition flip por slide
//transition: "fade",
function abrirPagina(sPag, bBack) {

    alert('Entro en abrirPagina');

    $.mobile.changePage('#' + sPag, {
        transition: "none",
        reverse: true
        ,changeHash: bBack
    });

    switch(sPag)
    {
        case 'pageNuevaIncidencia' :
            alert('Estoy en el switch de abrir NuevaIncidencia');
            $.doTimeout(1500, inicioPaginaNuevaIncidencia() );
            break;

        case 'pageConsultaIncidencias' :
            alert('Estoy en el switch de abrir consultarIncidencia');
            inicioPaginaConsultaIncidencias();
            $.doTimeout(1000, mostrarEnPlano() );
            break;

        case 'pageZoomFoto' :
            alert('Estoy en el switch de zoomfoto');
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





