if (typeof(subidaMultiplesDocs) == "undefined") {
    subidaMultiplesDocs = {
        __namespace: true
    };    
}

subidaMultiplesDocs = {
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
		
	},
	
//==================
//FUNCIONES ONCHANGE
//==================	

    onChange_campo1: function (executionContext){

	},    
	
//==================
//FUNCIONES ONCLICK
//==================	

    onclick_subidaMultiple: function (executionContext){
        //Primero, se debe leer la grilla de documentos para ver si hay documentos pendientes de subir
        debugger;
        var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
        if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
        
        var resultado = subidaMultiplesDocs.buscarDocumentosDelCaso(executionContext,incidentId);
        if(resultado){
            if(resultado.value.length > 0){
                //Validamos que existan documentos pendientes de subir
                var hayPendientes = 0;
                var objeto = [];
                for(var i = 0; i < resultado.value.length; i++){
                    if(resultado.value[i].statuscode == 657130000){ // Pendiente
                        hayPendientes = hayPendientes + 1;
                        var documentoPendiente = {
                            documentoId : resultado.value[i].xmsbs_documentoid,
                            tipoDocumento : resultado.value[i].xmsbs_TipoDocumento.xmsbs_name,
                            tipoDocumentoId: resultado.value[i].xmsbs_TipoDocumento.xmsbs_tipodedocumentoid,
                            obligatorio : resultado.value[i].xmsbs_obligatoriedad
                        };
                        objeto.push(documentoPendiente);
                    }
                }
                
                if(hayPendientes > 0){
                    //Hay documentos pendientes de subir
                    //Abrir el recurso web como popup
                    
                    PopUp.openWRSubidaMultiple(executionContext, objeto);
                }
                else{
                    //No hay documentos pendientes de subir.
                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Sin Documentos para subir", text: "No se han encontrado documentos a subir, o no se cumplen las condiciones para aquello"};
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function (success) {
                            //console.log("Alert dialog closed");
                        },
                        function (error) {
                            //console.log(error.message);
                        }
                    );
                }
            }
            else{
                // no hay documentos asociados a subir
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Sin Documentos para subir", text: "No se han encontrado documentos a subir, o no se cumplen las condiciones para aquello"};
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        //console.log("Alert dialog closed");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
        else{
            // no hay resultados
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Sin Documentos para subir", text: "No se han encontrado documentos a subir, o no se cumplen las condiciones para aquello"};
			var alertOptions = { height: 120, width: 260 };
			Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
				function (success) {
					//console.log("Alert dialog closed");
				},
				function (error) {
					//console.log(error.message);
				}
			);
        }
	},    

//==================
//FUNCIONES ENABLE
//==================	

    enable_subidaMultiple: function (executionContext){
        return true;
	},    
	
//==================
//FUNCIONES BUSQUEDA
//==================

    buscarDocumentosDelCaso: function(executionContext, idIncident){
        var entityType = "xmsbs_documentos";
        var query = "$select=xmsbs_documentoid,_xmsbs_tipodocumento_value,xmsbs_obligatoriedad,statuscode";
        query += "&$expand=xmsbs_TipoDocumento($select=xmsbs_name,xmsbs_tipodedocumentoid)";
        query += "&$filter=(_xmsbs_caso_value eq '"+idIncident+"')&$orderby=_xmsbs_tipodocumento_value asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
};	