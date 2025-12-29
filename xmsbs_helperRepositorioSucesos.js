if (typeof(HelperRepositorioSucesos) == "undefined") {
    HelperRepositorioSucesos = {
        __namespace: true
    };    
}
HelperRepositorioSucesos={
    function setRespuestasCaso(respuestasSeleccionadas) {
        debugger;
        for (var i = 0; i < respuestasSeleccionadas.length; i++) {
            if (respuestasSeleccionadas[i].tipoRespuesta === 1) {
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_respuestacliente", respuestasSeleccionadas[i].contenido);
            }
            else if (respuestasSeleccionadas[i].tipoRespuesta === 2) {
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_respuestapush", respuestasSeleccionadas[i].contenido);
            }
            else {
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_respuestasms", respuestasSeleccionadas[i].contenido);
            }
        }

        //Guardamos el cambio
        JumpStartLibXRM.Fx.formSave(executionContext);
    }
    function setRespuestaFormales(contenido){
    debugger;
        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_respuestacliente", contenido);

        //Guardamos el cambio
        JumpStartLibXRM.Fx.formSave(executionContext);
    }
}