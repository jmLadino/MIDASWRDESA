if (typeof(SubidaDocumentoCaso) == "undefined") {
    SubidaDocumentoCaso = {
        __namespace: true
    };    
}

SubidaDocumentoCaso = {
   
	GetRequestObject: function () {
		if (window.XMLHttpRequest) {
			return new window.XMLHttpRequest;
		}
		else {
			try {
				return new ActiveXObject("MSXML2.XMLHTTP.3.0");
			}
			catch (ex) {
				return null;
			}
		}
	},
    
    TipoDocumento: {        
        CodigoDocumentoRespaldo1: "FD-002",
    },
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
		var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();		
        
        if (tipoFormulario == '1'){            
            //SubidaDocumentoCaso.setXrmFormContextWR(formContext);
			//SubidaDocumentoCaso.onChange_estadoDocumento(executionContext);
            SubidaDocumentoCaso.setTipoDocumental(executionContext);
            
            //Se comenta porque ahora las fechas de Validacion y Caducidad se setean desde un WF de Dynamics
            //let fechaCaducidad = new Date();
            //fechaCaducidad.setDate(fechaCaducidad.getDate() + 2555);
            //JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_fechacaducidad", fechaCaducidad);
            
            //Guardamos el cambio
			JumpStartLibXRM.Fx.formSave(executionContext);
        }        
		else if (tipoFormulario == '2'){
            SubidaDocumentoCaso.setXrmFormContextWR(formContext);			
			SubidaDocumentoCaso.onChange_estadoDocumento(executionContext);
        }
	},	
    
    setTipoDocumental: function(executionContext){
        //debugger;
        var tipoDocumento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodocumento", null);
        
        if(tipoDocumento == null)
        {
            var documentoRespaldo1 = SubidaDocumentoCaso.buscarTipoDocumento(executionContext, SubidaDocumentoCaso.TipoDocumento.CodigoDocumentoRespaldo1);
        
            if(documentoRespaldo1 != null)
            {
                JumpStartLibXRM.Fx.setLookupValue(executionContext, "xmsbs_tipodocumento", documentoRespaldo1.value[0].xmsbs_tipodedocumentoid, documentoRespaldo1.value[0].xmsbs_name, "xmsbs_tipodedocumento");
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_descripcion", documentoRespaldo1.value[0].xmsbs_name);
                SubidaDocumentoCaso.onChange_tipoDocumento(executionContext);
            }
        }
	},
	
    setXrmFormContextWR: function(formContext){
        //debugger;
		var wr = formContext.getControl("WebResource_subidadocumentocaso");
        
		if (wr) 
        {
            wr.getContentWindow().then(
                function (contentWindow) 
                {
                    if (contentWindow != null && typeof(contentWindow.setClientApiContext) === 'function')
                    {
                        console.log("ejecuto correcto");
                        contentWindow.setClientApiContext(Xrm, formContext);
                    }
                    else
                    {
                        console.log("ejecuto reintento");
                        setTimeout(function(){ 
                            SubidaDocumentoCaso.setXrmFormContextWR(formContext);
                        }, 1000);  
                    }
                }
            )
        }		
	},
	
	//Función para desplegar iconos simulando un semaforo en un campo especifico de una vista no editable.
	displayIconTooltip: function (rowData, userLCID){
        //debugger;
		var str = JSON.parse(rowData);
		var coldata = str.statuscode_Value; //cambiar por campo a referenciar.
		var imgName = "";
		var tooltip = "";
		switch (coldata)
		{
			case 657130000:
				imgName = "xmsbs_pendiente";
				tooltip = "Pendiente";
				break;
			case 657130001:
				imgName = "xmsbs_subido";
				tooltip = "Subido";
				break;				
			default:
				imgName = "";
				tooltip = "";
				break;
		}
		var resultarray = [imgName, tooltip];
		return resultarray;
	},	
	
//==================
//FUNCIONES ONCHANGE
//==================	

	onChange_tipoDocumento: function (executionContext){
		//debugger;
        var formContext = executionContext.getFormContext();
        var wrSubidaDocumentoCaso = formContext.getControl("WebResource_subidadocumentocaso");
		var caso = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_caso");
		var tipoDocumento = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_tipodocumento");
		JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_descripcion", tipoDocumento);
        
        if((caso != null && caso != "") && (tipoDocumento != null && tipoDocumento != ""))
        {     
            wrSubidaDocumentoCaso.setVisible(true);
        }
        else
        {
            wrSubidaDocumentoCaso.setVisible(false);
        }
	},		
	
    onChange_estadoDocumento: function (executionContext){
		//debugger;
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();	
        var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statecode", null);
        var estadoDocumento = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
        var wrSubidaDocumentoCaso = formContext.getControl("WebResource_subidadocumentocaso");     
        var wrEliminarDocumentoCaso = formContext.getControl("WebResource_deletedocumentocaso");     
               	
        if (tipoFormulario == '1')
        {
			wrSubidaDocumentoCaso.setVisible(false);
			wrEliminarDocumentoCaso.setVisible(false);            
        }        
		else if (tipoFormulario == '2')
        {
            if(estado == 0 && estadoDocumento == 657130000) //Pendiente
            {
                wrSubidaDocumentoCaso.setVisible(true);
                wrEliminarDocumentoCaso.setVisible(false); 
            }
            else if(estado == 0 && estadoDocumento == 657130001) //Subido
            {
                wrSubidaDocumentoCaso.setVisible(false);
                wrEliminarDocumentoCaso.setVisible(true); 
            }
            else
            {
                wrSubidaDocumentoCaso.setVisible(false);
                wrEliminarDocumentoCaso.setVisible(false); 
            }
        }
        else
        {
            wrSubidaDocumentoCaso.setVisible(false);
            wrEliminarDocumentoCaso.setVisible(false); 
        }
	},
	
	onChange_fechaCaducidad: function (executionContext) {
		//debugger;
		//Calculo las fecha en Milisegundos para poder comparar
        
        //Esta funcion ya no es necesaria porque se actualiza la fecha desde un WF de Dynamics
        /*
		var hoy = new Date();
		var fechaCaducidad = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechacaducidad", null);
		if(fechaCaducidad){
			var fecha1 = hoy.setDate(hoy.getDate());
			var fecha2 = fechaCaducidad.setDate(fechaCaducidad.getDate());
	
			//Compara que la fecha ingresada sea menor a la fecha de proximo contacto
			if(fecha1 > fecha2){
				var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de caducidad debe ser mayor al día de hoy", title: "Fecha de caducidad invalida" };
				var alertOptions = { height: 120, width: 260 };
				Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
					function (success) {
						JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechacaducidad", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechacaducidad");
					},
					function (error) {
						//console.log(error.message);
					}
				);
			}
		}
        */
	},

    buscarTipoDocumento: function (executionContext, codigo){
		var entityType = "xmsbs_tipodedocumento";
		var query = "$select=xmsbs_name,xmsbs_codigo,xmsbs_tipodocumentalfilenet";
		query += "&$filter=xmsbs_codigo eq '" + codigo + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
};