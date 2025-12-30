if (typeof(GrillaCaso) == "undefined") {
    GrillaCaso = {
        __namespace: true
    };    
}

GrillaCaso = {
    Form: {        
        Context: null,
        executionContext: null,
        formContext:null,
        SeccionID:null,
        SeccionLectura:null,
		CasoReiterado:null
    },
    formContext: null,
	
//================
//FUNCIONES ONLOAD
//================
   onLoad_Formulario: function (executionContext) {
        //debugger;
        GrillaCaso.formContext = executionContext.getFormContext();
        var tipoFormulario = GrillaCaso.formContext.ui.getFormType();	
        
		if (tipoFormulario == JumpStartLibXRM.FormState.CREATE){
            GrillaCaso.MostraroDataCamposSecciones(executionContext);
			GrillaCaso.ocultaCausalRenuncia(executionContext);
			
            //debugger;
            //var today = new Date();
            //var time = today.getDay() + "/" + today.getMonth() + "/" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            //JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_name", time);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_name", "Registro relacionado");
            
            GrillaCaso.formContext.data.entity.addOnPostSave(GrillaCaso.PostOnSave);
        }
        else
        {
            GrillaCaso.MostraroDataCamposSecciones(executionContext);
        }
	}, 

    enableAgregarRegistro: function (executionContext, SelectedControl){
        return false;
    },
	
    ocultaCausalRenuncia: function (executionContext) {
		debugger;
		var IncidentID = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_caso", null);
		
		var respuesta = GrillaCaso.oDataCasoBuscaDOs(executionContext, IncidentID[0].id);
		if(respuesta){
			var DOCodigo = respuesta.value[0].xmsbs_detalledeoperacion.xmsbs_codigo;
			if(DOCodigo == "DO-1091" || DOCodigo == "DO-1129"){
				//TERCERAS COMPAÑIAS y AUTO
				executionContext.getFormContext().getControl("xmsbs_causalrenunciaseguros").removeOption(657130017);
			}else if(DOCodigo == "DO-1003"){
				//SEG. ASOCIADOS A CREDITO
				executionContext.getFormContext().getControl("xmsbs_causalrenunciaseguros").removeOption(657130004);
				executionContext.getFormContext().getControl("xmsbs_causalrenunciaseguros").removeOption(657130005);
				executionContext.getFormContext().getControl("xmsbs_causalrenunciaseguros").removeOption(657130011);
				executionContext.getFormContext().getControl("xmsbs_causalrenunciaseguros").removeOption(657130017);
				executionContext.getFormContext().getControl("xmsbs_causalrenunciaseguros").removeOption(657130023);
				executionContext.getFormContext().getControl("xmsbs_causalrenunciaseguros").removeOption(657130019);
				executionContext.getFormContext().getControl("xmsbs_causalrenunciaseguros").removeOption(657130020);
				executionContext.getFormContext().getControl("xmsbs_causalrenunciaseguros").removeOption(657130021);
				executionContext.getFormContext().getControl("xmsbs_causalrenunciaseguros").removeOption(657130022);
			}
		}
    },	
	
    enableEdicionGrilla: function (executionContext, SelectedControl){
        //debugger;
        var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '2')
        {
			// el origen puede ser del JS Caso o CasoIngresoCRM
			
            if(typeof Caso === "undefined" && typeof CasoIngresoCRM === "undefined")
            {
                if (GrillaCaso.Form.SeccionLectura != null){
                    return !GrillaCaso.Form.SeccionLectura;
                }
                
                if (GrillaCaso.Form.SeccionID == null){
                    GrillaCaso.getSeccionID(executionContext);
                }
				
				if (GrillaCaso.Form.CasoReiterado == true)
					return false;
               
                return !GrillaCaso.Form.SeccionLectura;
             }
             else
             {
				if(typeof Caso != "undefined")
				{
                    if (Caso.Form.LecturaGrilla != null)
                    {
                        GrillaCaso.Form.SeccionLectura = Caso.Form.LecturaGrilla;
                        return !GrillaCaso.Form.SeccionLectura;
                    }
				}                    
                else if (typeof CasoIngresoCRM != "undefined")
                {
                    GrillaCaso.Form.SeccionLectura = CasoIngresoCRM.Form.LecturaGrilla;
                    return !GrillaCaso.Form.SeccionLectura;
                }
             }
		}
        
        return false;
	},	
    onClickButtonCrearRegistro: function (executionContext, SelectedControl) {
		//debugger;
		
        // FUNCIONALIDAD EN STANDBY
        // por definición de negocio se establece que siempre será 1 grilla en el CASO
        // este código está a mitad de camino, se mantiene en caso de que se retome
        
        var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '2')
        {
            if (SelectedControl._controlName == "Grilla1Caso")
                Caso.Form.SeccionGrillaActual = Caso.Form.SeccionesGrillaID[0]; // GrillaCaso.Form.SeccionID = Caso.Form.SeccionesGrillaID[0];
            else if (SelectedControl._controlName == "Grilla2Caso")
                Caso.Form.SeccionGrillaActual = Caso.Form.SeccionesGrillaID[1]; 
            else if (SelectedControl._controlName == "Grilla3Caso")
                Caso.Form.SeccionGrillaActual = Caso.Form.SeccionesGrillaID[2];                 
		}
        return false;
    },
    
    getSeccionID: function (executionContext){
		//debugger;
        // Obtiene el CASO relacionado
        var IncidentID = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_caso", null);
        if (IncidentID == null)
        {
            JumpStartLibXRM.Fx.AlertDialog("Información", "Para crear registros en esta entidad debe realizarlo desde el CASO.", "OK");
            return null;
        }
        
        var oIncident = GrillaCaso.oDataCaso(executionContext, IncidentID[0].id);
        if (oIncident == null)
            return null;
        
        // Obtiene la sección GRILLA del caso relacionado (puede ser máximo 1 grilla)
        var oSeccion = GrillaCaso.oDataSeccionGrilla(executionContext, oIncident.value[0]._xmsbs_etapa_value);
        if (oSeccion == null)
            return null;       

        if (oSeccion.value.length == 0)
        {
            // se debe a un error de configuración en la matriz... sin sección configurada para la etapa no se puede determinar qué campos mostrar.
            //JumpStartLibXRM.Fx.formEnableDisableAllControls(executionContext, true);
            JumpStartLibXRM.Fx.AlertDialog("Error", "No existe una Sección configurada para la Etapa actual del CASO.", "OK");
            return null;
        }

        GrillaCaso.Form.SeccionID = oSeccion.value[0].xmsbs_seccionid;
		GrillaCaso.Form.SeccionLectura = oSeccion.value[0].xmsbs_lectura;
		GrillaCaso.Form.CasoReiterado = oIncident.value[0].xmsbs_marcareiterado;
		
    },

    MostraroDataCamposSecciones: function (executionContext){
        if (GrillaCaso.Form.SeccionID == null)
            GrillaCaso.getSeccionID(executionContext);
        
        //var _SeccionID = GrillaCaso.getSeccionID(executionContext);

        // if (Caso.Form.SeccionGrillaActual != null)
        // _SeccionID = Caso.Form.SeccionGrillaActual;

        // Obtiene los Campos de la Sección
        var respuesta = new Array();
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_campo", 
            "?$select=xmsbs_borrar,xmsbs_campoid,xmsbs_label,xmsbs_lectura,xmsbs_name,xmsbs_nombreesquema,xmsbs_nombremostrar,xmsbs_predeterminado,xmsbs_requerido,xmsbs_tipocampo,xmsbs_visible,xmsbs_fncjsonchange" +
            "&$filter=_xmsbs_seccionid_value eq '" + GrillaCaso.Form.SeccionID +"'").then(
            function success(results) {                
                for (var i = 0; i < results.entities.length; i++) {
                    let respObj = new Object();
                    respObj.xmsbs_borrar = results.entities[i]["xmsbs_borrar"];
                    respObj.xmsbs_borrar_formatted = results.entities[i]["xmsbs_borrar@OData.Community.Display.V1.FormattedValue"];
                    respObj.xmsbs_campoid = results.entities[i]["xmsbs_campoid"];
                    respObj.xmsbs_label = results.entities[i]["xmsbs_label"];
                    respObj.xmsbs_lectura = results.entities[i]["xmsbs_lectura"];
                    respObj.xmsbs_lectura_formatted = results.entities[i]["xmsbs_lectura@OData.Community.Display.V1.FormattedValue"];
                    respObj.xmsbs_name = results.entities[i]["xmsbs_name"];
                    respObj.xmsbs_nombreesquema = results.entities[i]["xmsbs_nombreesquema"];
                    respObj.xmsbs_nombremostrar = results.entities[i]["xmsbs_nombremostrar"];
                    respObj.xmsbs_predeterminado = results.entities[i]["xmsbs_predeterminado"];
                    respObj.xmsbs_requerido = results.entities[i]["xmsbs_requerido"];
                    respObj.xmsbs_requerido_formatted = results.entities[i]["xmsbs_requerido@OData.Community.Display.V1.FormattedValue"];
                    respObj.xmsbs_tipocampo = results.entities[i]["xmsbs_tipocampo"];
                    respObj.xmsbs_tipocampo_formatted = results.entities[i]["xmsbs_tipocampo@OData.Community.Display.V1.FormattedValue"];
                    respObj.xmsbs_visible = results.entities[i]["xmsbs_visible"];
                    respObj.xmsbs_visible_formatted = results.entities[i]["xmsbs_visible@OData.Community.Display.V1.FormattedValue"];
					respObj.xmsbs_fncjsonchange = results.entities[i]["xmsbs_fncjsonchange"];
                    respuesta.push(respObj);
                }
                GrillaCaso.MostraroDataCamposSeccionesRespuesta(executionContext, respuesta);
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
    },
    MostraroDataCamposSeccionesRespuesta: function (executionContext, respuesta){     
        if (respuesta != null && respuesta.length >0){          
            for (var i = 0; i < respuesta.length; ++i)
            {
                //Borrar
                if (respuesta[i].xmsbs_borrar)
                {
                    JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, null);
                }
                //label
                if (respuesta[i].xmsbs_label)
                {
                    JumpStartLibXRM.Fx.setLabel(executionContext, respuesta[i].xmsbs_nombreesquema, respuesta[i].xmsbs_label);
                }

                //lectura
				// Lo que se evalúa respecto a la grilla prevalece frente a la configuracion propia del campo.
				if (GrillaCaso.Form.SeccionLectura || 
					GrillaCaso.Form.CasoReiterado){
					JumpStartLibXRM.Fx.disableField(executionContext, respuesta[i].xmsbs_nombreesquema);
				}
				else
				{
					if (respuesta[i].xmsbs_lectura)
					{
						JumpStartLibXRM.Fx.disableField(executionContext, respuesta[i].xmsbs_nombreesquema);
					}
					else
					{
						JumpStartLibXRM.Fx.enableField(executionContext, respuesta[i].xmsbs_nombreesquema);
					}					
				}
		
                //Predeterminado
                if (respuesta[i].xmsbs_predeterminado)
                {
                    switch (respuesta[i].xmsbs_tipocampo)
                    {
                        case 1:
                            JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, respuesta.value[i].xmsbs_predeterminado);
                            break;
                        case 2:
                            var valorInt = parseInt(respuesta[i].xmsbs_predeterminado);
                            JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, valorInt);
                            break;
                        case 3:
                            var valorInt = parseInt(respuesta[i].xmsbs_predeterminado);
                            JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, valorInt);
                            break;
                        case 4:
                            if (respuesta[i].xmsbs_predeterminado == "true")
                            {
                                JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, true);
                            }
                            else if (respuesta[i].xmsbs_predeterminado == "false")
                            {
                                JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, false);
                            }
                            break;
                        case 5:
                            var valorInt = parseInt(respuesta[i].xmsbs_predeterminado);
                            JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, valorInt);
                            break;
                        case 6:
                            var valorInt = parseInt(respuesta[i].xmsbs_predeterminado);
                            JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, valorInt);
                            break;
                        case 7:
                            JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, respuesta[i].xmsbs_predeterminado);
                            break;
                        case 8:
                            var date = respuesta[i].xmsbs_predeterminado;
                            var array = new Array();
                            array = date.split('-');
                            var anio = parseInt(array[2]);
                            var mes = parseInt(array[1]) - 1;
                            var dias = parseInt(array[0]);
                            var dateParse = new Date(anio, mes, dias);
                            JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, dateParse);
                            break;
                        case 9:
                            //campo búsqueda no se puede colocar valor predeterminado
                            break;
                        case 10:
                            //campo cliente no se puede colocar valor predeterminado
                            break;
                        case 11:
                            var valorInt = parseFloat(respuesta[i].xmsbs_predeterminado);
                            JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, valorInt);
                            break;
                        default:
                            break;
                    }
                }
                var Ncampo = GrillaCaso.terminaEnNumero(respuesta[i].xmsbs_nombreesquema);
                //requerido
                if (respuesta[i].xmsbs_requerido)
                {
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, Ncampo, "required");
                }
                else
                {
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, Ncampo, "none");
                }
                //Visibilidad del campo
                if (respuesta[i].xmsbs_visible)
                {
                    JumpStartLibXRM.Fx.showField(executionContext, respuesta[i].xmsbs_nombreesquema);
                }
                else
                {
                    JumpStartLibXRM.Fx.hideField(executionContext, respuesta[i].xmsbs_nombreesquema);
                }	
				
				// Funcion al cambiar
				JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "GrillaCaso.onChange_rut");
				JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "GrillaCaso.onChangeSoloNumeros");
				JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "GrillaCaso.onChange_Fecha");
				JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "GrillaCaso.onChangeSoloLetra");
				JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "GrillaCaso.onChange_correo");
				
				if (respuesta[i].xmsbs_fncjsonchange)
				{
					if(respuesta[i].xmsbs_fncjsonchange == 657130000) // Texto, valida RUT
					{
						JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "GrillaCaso.onChange_rut");
					}
					else if(respuesta[i].xmsbs_fncjsonchange == 657130001) // Texto, solo números (0-9)
					{
						JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "GrillaCaso.onChangeSoloNumeros");
					}
					else if(respuesta[i].xmsbs_fncjsonchange == 657130002) // Fecha, el o antes de hoy
					{
						JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "GrillaCaso.onChange_Fecha");
					}
					else if(respuesta[i].xmsbs_fncjsonchange == 657130003) // Texto, solo letras y espacio
					{
						JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "GrillaCaso.onChangeSoloLetra");
					}
					else if(respuesta[i].xmsbs_fncjsonchange == 657130004) // Texto, valida email
					{
						JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "GrillaCaso.onChange_correo");
					}
				}					
            }                     
        }
        else
        {
            //alert("Error en el consumo del servicio rest api.");
        }
    },	 
	terminaEnNumero: function (nombreCampo){
		// se agregan excepciones:
		if (nombreCampo == "xmsbs_meslista13")
			return nombreCampo;
		
		
		var aux = nombreCampo.substring(nombreCampo.length - 1, nombreCampo.length);
		if (!isNaN(aux) && aux != "0")
		{
			return nombreCampo.substring(0, nombreCampo.length - 1);
		}
		return nombreCampo;
	},    
	
//================
//FUNCIONES ODATA
//================
    oDataCaso: function (executionContext, CasoId){
        var entityType = "incident";
		var query = "?$select=_xmsbs_etapa_value,xmsbs_numerocorrelativo,xmsbs_marcareiterado";
		query += "&$filter=_xmsbs_etapa_value ne null and incidentid eq '" +  CasoId.replace(/[{}]/g, "") + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },    
    oDataSeccionGrilla: function (executionContext, etapaId){
        var entityType = "xmsbs_seccion";
		var query = "?$select=_xmsbs_etapa_value,xmsbs_etiqueta,xmsbs_lectura,xmsbs_name,xmsbs_tab,xmsbs_visible,_xmsbs_vista_value";
        query += "&$filter=statecode eq 0 and _xmsbs_etapa_value eq '" +  etapaId.replace(/[{}]/g, "") + "' and  _xmsbs_vista_value ne null";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },	
    oDataCasoBuscaDOs: function (executionContext, IncidentID){
        var entityType = "incidents";
		var query = "?$select=title,xmsbs_numerocorrelativo,incidentid&$expand=xmsbs_detalledeoperacion($select=xmsbs_codigo)";
		query += "&$filter=incidentid eq '" +  IncidentID.replace(/[{}]/g, "") + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },   

//================
//FUNCIONES ONCHANGE
//================

	onChange_fechaCartola: function (executionContext) {
        //debugger;
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaCartola = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechacartola", null);
        if(fechaCartola){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaCartola.setDate(fechaCartola.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de cartola no puede ser mayor al día de hoy", title: "Fecha de caducidad invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechacartola", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechacartola");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
	
	onChange_fechaDeposito: function (executionContext) {
        //debugger;
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaDeposito = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechadeposito", null);
        if(fechaDeposito){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaDeposito.setDate(fechaDeposito.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de depósito no puede ser mayor al día de hoy", title: "Fecha de caducidad invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechadeposito", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechadeposito");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
	
	onChange_fechaTransacciones: function (executionContext) {
        //debugger;
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaTransaccion = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechatransacciones", null);
        if(fechaTransaccion){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaTransaccion.setDate(fechaTransaccion.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de transacción no puede ser mayor al día de hoy", title: "Fecha de caducidad invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechatransacciones", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechatransacciones");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
	
	
	onChange_fechaCheque: function (executionContext) {
        //debugger;
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaCheque = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechacheque", null);
        if(fechaCheque){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaCheque.setDate(fechaCheque.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de cheque no puede ser mayor al día de hoy", title: "Fecha de caducidad invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechacheque", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechacheque");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
	
	onChange_fechaMovimiento: function (executionContext) {
        //debugger;
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaMovimiento = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechamovimiento", null);
        if(fechaMovimiento){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaMovimiento.setDate(fechaMovimiento.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de movimiento no puede ser mayor al día de hoy", title: "Fecha de caducidad invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechamovimiento", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechamovimiento");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },

	onChange_fechaFraude: function (executionContext) {
        //debugger;
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaFraude = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechadefraude", null);
        if(fechaFraude){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaFraude.setDate(fechaFraude.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de fraude no puede ser mayor al día de hoy", title: "Fecha de caducidad invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechadefraude", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechadefraude");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },


	onChange_fechaPagoFraude: function (executionContext) {
        //debugger;
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaPagoFraude = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechapagofraude", null);
        if(fechaPagoFraude){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaPagoFraude.setDate(fechaPagoFraude.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de pago fraude no puede ser mayor al día de hoy", title: "Fecha de caducidad invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechapagofraude", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechapagofraude");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },	
	
	onChange_fechaOperacion: function (executionContext) {
        //debugger;
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaOperacion = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechaoperacion", null);
        if(fechaOperacion){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaOperacion.setDate(fechaOperacion.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de operación no puede ser mayor al día de hoy", title: "Fecha invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechaoperacion", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechaoperacion");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
	
	onChange_tipoderescate: function (executionContext) {
		debugger;
		
		// si el valor seleccionado es: Parcial Retención (5), entonces el campo: monto del rescate (xmsbs_montorescatetexto) debe ser requerido, de caso contrario, debe ser opcional.
		// solo aplica si el campo: xmsbs_montorescatetexto es visible
		
		var esVisibleMontoRescate = JumpStartLibXRM.Fx.getVisible(executionContext, "xmsbs_montorescatetexto");
		if (esVisibleMontoRescate){
			var myControl = executionContext.getEventSource().getName();
			var TipodeRescate = JumpStartLibXRM.Fx.getValueField(executionContext, myControl, null);
			
			if (TipodeRescate && TipodeRescate == 5){
				JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_montorescatetexto", "required");
			}
			else{
				JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_montorescatetexto", "none");				
			}
		}
	},

//================
//FUNCIONES ONCHANGE GENERICAS
//================

	onChange_rut: function (executionContext) {
        //debugger;
        var myControl = executionContext.getEventSource().getName();
		var rut = JumpStartLibXRM.Fx.getValueField(executionContext, myControl, null);
		if(rut)
		{
			var respuesta = JumpStartLibXRM.Fx.validarrut(rut);
			if (respuesta == true)
			{	
				var formateaRut = JumpStartLibXRM.Fx.getValueField(executionContext, myControl, null);
				formateaRut = formateaRut.replace(/[^\dkK]/g, "");
				var largo = formateaRut.length;

				formateaRut = formateaRut.substring(0, largo - 1) + "-" + formateaRut.substring(largo - 1, largo);
				//rut.setValue(formateaRut);
				formateaRut = formateaRut.toUpperCase();
				JumpStartLibXRM.Fx.setValueField(executionContext, myControl, formateaRut);
			}
			else 
			{
				JumpStartLibXRM.Fx.setValueField(executionContext,myControl, null);
				
				var alertStrings = { confirmButtonLabel: "Aceptar", text: "RUT no es válido, favor volver a ingresar el RUT.", title: "Información" };
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
	},	

	onChangeSoloNumeros: function(executionContext) {      
        var myControl = executionContext.getEventSource().getName();
        var campo = Xrm.Page.getControl(myControl).getValue();
		if (campo)
		{
			campo = campo.replace(/\D/g, '');
			Xrm.Page.getAttribute(myControl).setValue(campo);
            
            // (JM) ESTA VALIDACIÓN NO DEBE IR AQUI
			//if (campo.length == 11) {
			//	var campoFormateado = campo.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
			//	Xrm.Page.getAttribute(myControl).setValue(campoFormateado);
			//}			
		}
	},
	
	onChange_Fecha: function (executionContext) {
        var myControl = executionContext.getEventSource().getName();

        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fecha = JumpStartLibXRM.Fx.getValueField(executionContext, myControl, null);
        if(fecha){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fecha.setDate(fecha.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha no puede ser mayor al día de hoy", title: "Fecha incorrecta" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext, myControl, null);
                        JumpStartLibXRM.Fx.setFocus(executionContext, myControl);
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },		
	
	onChangeSoloLetra: function(executionContext){
        var myControl = executionContext.getEventSource().getName();
        var campo = Xrm.Page.getControl(myControl).getValue();
        if(campo != null) {
			//campo = campo.replace(/[^a-zA-Z ]/g, '');
            campo = campo.replace(/[^a-zA-Z ñÑáéíóúÁÉÍÓÚ]/g, '');
			Xrm.Page.getAttribute(myControl).setValue(campo);
        }
	},
	
    onChange_correo: function (executionContext) {
		//debugger;
        var myControl = executionContext.getEventSource().getName();
		
        var correo = JumpStartLibXRM.Fx.getValueField(executionContext, myControl, null);
        if(correo){
            var validaCorreo = GrillaCaso.validarFormatoCorreoRegex(correo);
            if (!validaCorreo)
			{
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "El formato de E-mail es incorrecto", title: "E-mail incorrecto" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext, myControl, "");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },	
	
    validarFormatoCorreoRegex: function (correo){
      if(!correo.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)){
        return false;
      }
      return true;
    },	

	
//==================
//FUNCIONES ONSAVE
//==================

	PostOnSave: function (executionContext){
        setTimeout(function () {
            var lookupOptions = {};
            lookupOptions.entityType = "xmsbs_grillacaso";
            Xrm.Utility.refreshParentGrid(lookupOptions);
        }, 5000);
	},
};