if (typeof(EjecucionQuebranto) == "undefined") {
    EjecucionQuebranto = {
        __namespace: true
    };    
}

EjecucionQuebranto = {
	ShowCamposPorTipoOperacion: {
		11 : [
						"xmsbs_numerodecontrato",
						"xmsbs_numeroproductoafectado",
						"xmsbs_nombreproductoafectado",
						"xmsbs_estandarizado",
						"xmsbs_montototal",
						"xmsbs_origenerror",
						"xmsbs_centrocosto",
						"xmsbs_causaraizquebranto"],
		13: [
						"xmsbs_numeroproductoafectado",
						"xmsbs_estandarizado",
						"xmsbs_nombreproductoafectado",
						"xmsbs_montototal",
						"xmsbs_origenerror",
						"xmsbs_centrocosto",
						"xmsbs_tiporeverso",
						"xmsbs_causaraizquebranto"],
		6: [
						"xmsbs_numeroproductoafectado",
						"xmsbs_tarjetaconchip",
						"xmsbs_tipocastigo",
						"xmsbs_nombreproductoafectado",
						"xmsbs_estandarizado",
						"xmsbs_montototal",
						"xmsbs_origenerror",
						"xmsbs_centrocosto",
						"xmsbs_tiporeverso",
						"xmsbs_causaraizquebranto"],
		14: [
						"xmsbs_numeroproductoafectado",
						"xmsbs_estandarizado",
						"xmsbs_nombreproductoafectado",
						"xmsbs_montototal",
						"xmsbs_origenerror",
						"xmsbs_centrocosto",
						"xmsbs_tiporeverso",
						"xmsbs_causaraizquebranto"],
		10: [
						"xmsbs_numerodecontrato",
						"xmsbs_numerodetarjeta",
						"xmsbs_tipocastigo",
						"xmsbs_estandarizado",
						"xmsbs_montototal",
						"xmsbs_origenerror",
						"xmsbs_cuentacontable",
						"xmsbs_numerodelavigente",
						"xmsbs_fechadelavigente",
						"xmsbs_codigodesucursal",
						"xmsbs_cantidaddemillaslatampass",
						"xmsbs_causaraizquebranto",
						"xmsbs_tipodecambio"],
		9: [
						"xmsbs_numeroproductoafectado",
						"xmsbs_numerodecontrato",
						"xmsbs_tipocastigo",
						"xmsbs_nombreproductoafectado",
						"xmsbs_estandarizado",
						"xmsbs_montototal",
						"xmsbs_origenerror",
						"xmsbs_centrocosto",
						"xmsbs_tiporeverso",
						"xmsbs_causaraizquebranto"],
		12: [
						"xmsbs_numeroproductoafectado",
						"xmsbs_numerodecontrato",
						"xmsbs_nombreproductoafectado"],
		4: [
						"xmsbs_estandarizado",
						"xmsbs_montototal",
						"xmsbs_origenerror",
						"xmsbs_causaraizquebranto"],
		5: [
						"xmsbs_estandarizado",
						"xmsbs_montototal",
						"xmsbs_origenerror",
						"xmsbs_causaraizquebranto"]		
	},
	
    GetRequestObject: function () {
		if (window.XMLHttpRequest) {
			return new window.XMLHttpRequest();
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
	
	URL: {        
        Azure: "https://chld2weuapppmidas001.csbsand.cl.corp",
        Name: "AzureURL"
    },	
	
	ApiKey: {
        Key: "56C3D9E6-E5B6-4B76-816F-5741FA0420BE",
        Name: "AuthApi"
    }, 	
	
//==========
//FUNCIONES 
//==========

	onLoad_Formulario: function (executionContext) {
        debugger;
		var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
        
		if(tipoFormulario == 2 && estado == 657130004){//Edición e igual a Creado
            EjecucionQuebranto.onChange_TipoOperacion(executionContext);
			formContext.ui.tabs.get("tab_3").setVisible(true); //Gestion UR
			JumpStartLibXRM.Fx.enableOrDisableAllControlsInTab(executionContext, "tab_3", true); //deshabilitar controles
			EjecucionQuebranto.despliegueCamposControlContable(executionContext, formContext);
		}
		
        if(tipoFormulario == 2 && estado != 657130004){ //Edición y distinto de creado
            EjecucionQuebranto.onChange_TipoOperacion(executionContext);
            var usuarioAsignado = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ejecutorusuario");
            if (usuarioAsignado.indexOf("{") > -1){usuarioAsignado = usuarioAsignado.substring(1, 37);}
            //var resultado = EjecucionQuebranto.buscarIdUsuario(executionContext, usuarioAsignado);
            //if(resultado){
                var usuarioAsignadoId = usuarioAsignado;
                var propietario = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
                if (propietario.indexOf("{") > -1){propietario = propietario.substring(1, 37);}
                
                var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
                if(usuarioAsignadoId.toLowerCase() == propietario.toLowerCase() && estado == 657130002){ //En gestión asignado a su responsable
                    //se habilita el tab de gestión
                    formContext.ui.tabs.get("tab_3").setVisible(true); //Gestion UR
                    
                    //Se bloquea el contenido del tab de ingreso
                    JumpStartLibXRM.Fx.enableOrDisableAllControlsInTab(executionContext, "general", true);
                    
                    //Validamos el tipo de operación inresado para ver si se despliegan los campos de ingreso adicional
                    EjecucionQuebranto.despliegueCamposControlContable(executionContext, formContext);
                    
                    //Vemos si hay alguna respuesta del ingresador para mostrar el campo de obsevación:
                    var respuestaIngresador = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_respuestadelingresador", null);
                    if(respuestaIngresador){
                        //Se muestra el campo
                        JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_respuestadelingresador");
                    }
                    else{
                        //Se oculta el campo
                        JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_respuestadelingresador");
                    }
                }
                else{
                    //Se oculta el tab de gestión
                    formContext.ui.tabs.get("tab_3").setVisible(true); //Gestion UR
                    JumpStartLibXRM.Fx.enableOrDisableAllControlsInTab(executionContext, "tab_3", true); //deshabilitar controles
                    EjecucionQuebranto.despliegueCamposControlContable(executionContext, formContext);
                }
            //}
            
            var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
            if(estado == 657130000 || estado == 657130005){ // Si esta en reparo o completado
                //mostrar la sección del reparo
                formContext.ui.tabs.get("general").sections.get("seccion_gestionReparo").setVisible(true); //Seccion de respuesta
            }
            else{
                formContext.ui.tabs.get("general").sections.get("seccion_gestionReparo").setVisible(false); //Seccion de respuesta
            }
        }
        else{
            if(tipoFormulario == 3 || tipoFormulario == 4){
                //Si esta en modo lectura o finalizado, mostramos las secciones y bloqueamos todo
                
                //Se muestran los campos específicos
                EjecucionQuebranto.onChange_TipoOperacion(executionContext);
                
                //se habilita el tab de gestión
                formContext.ui.tabs.get("tab_3").setVisible(true); //Gestion UR
                
                //Se bloquea el contenido del tab de ingreso
                JumpStartLibXRM.Fx.enableOrDisableAllControlsInTab(executionContext, "general", true);
                
                //Validamos el tipo de operación inresado para ver si se despliegan los campos de ingreso adicional
                EjecucionQuebranto.despliegueCamposControlContable(executionContext, formContext);
                
                //Se bloquea el contenido del tab de gestion
                JumpStartLibXRM.Fx.enableOrDisableAllControlsInTab(executionContext, "tab_3", true);
            }
        }
	},
	
    onChange_urEjecutora: function (executionContext) {
        var tipoOperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tipooperacion");
        if(tipoOperacion){
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tipooperacion", null);
        }
        
        var ejecutor = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ejecutor");
        if(ejecutor){
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_ejecutor", null);
        }
        
        EjecucionQuebranto.ocultarCamposEspecificos(executionContext);
        
        //Validamos si la UR elegida es Control Contable para ocultar el usuario ingresador
        /*var urEjecutora = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_urejecutora");
        if(urEjecutora){
            if (urEjecutora.indexOf("{") > -1){urEjecutora = urEjecutora.substring(1, 37);}
            var resultado = EjecucionQuebranto.buscarDatosURQuebranto(executionContext,urEjecutora);
            if(resultado){
                var codigo = resultado.xmsbs_codigo;
                if(codigo == 1){
                    //si es 1 es Control contable, ocultamos el pedir el usuario ejecutor
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_ejecutor");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ejecutor", "none");
                }
                else{
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_ejecutor");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ejecutor", "required");
                }
            }
        }*/
    },
    
	onChange_TipoOperacion: function (executionContext) {
		debugger;
		var tipoOperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tipooperacion");
        if(tipoOperacion){
            EjecucionQuebranto.ocultarCamposEspecificos(executionContext);
            if (tipoOperacion.indexOf("{") > -1){tipoOperacion = tipoOperacion.substring(1, 37);}
            var resultado = EjecucionQuebranto.buscarCodigoTipoOperacion(executionContext,tipoOperacion);
            if(resultado){
                if(resultado.xmsbs_codigo != null){
                    //Trajo una configuración de campos, se muestran y obligan
                    var ArrayCamposPorMostrar = EjecucionQuebranto.ShowCamposPorTipoOperacion[resultado.xmsbs_codigo];
                    if(ArrayCamposPorMostrar){
                        for(var i = 0; i < ArrayCamposPorMostrar.length; i ++){
                            JumpStartLibXRM.Fx.showField(executionContext, ArrayCamposPorMostrar[i]);
                            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, ArrayCamposPorMostrar[i], "required");
                        }
						
						var ncaso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_ncaso", null);
						if(ncaso){
							JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_ncaso");
						}
                    }
                    
                    //Ahora evaluamos si mostramos una grilla de datos adicionales
                    var formContext = executionContext.getFormContext();
                    var tipoFormulario = formContext.ui.getFormType();
                    
                    if(tipoFormulario != 1){ //Edición
                        var codigo = resultado.xmsbs_codigo;
                        if(codigo == 5){
                            //Si el código es 5, la grilla es la de Cuenta Corriente Reverso COmisiones Intereses: vistaCCRCI
                            executionContext.getFormContext().ui.tabs.get("general").sections.get("vistaCCRCI").setVisible(true);
                        }
                        else{
                            executionContext.getFormContext().ui.tabs.get("general").sections.get("vistaCCRCI").setVisible(false);
                        }
                        
                        if(codigo == 4){
                            //Si el código es 4, la grilla es la de Cuenta Corriente Cierre + Reverso: vistaCCRCI
                            executionContext.getFormContext().ui.tabs.get("general").sections.get("VistaCYR").setVisible(true);
                        }
                        else{
                            executionContext.getFormContext().ui.tabs.get("general").sections.get("VistaCYR").setVisible(false);
                        }
                        
                        if(codigo == 3){
                            //Si el código es 12, la grilla es la de Cierre de Contrato: vistaCierreContrato
                            executionContext.getFormContext().ui.tabs.get("general").sections.get("vistaCierreContrato").setVisible(true);
                        }
                        else{
                            executionContext.getFormContext().ui.tabs.get("general").sections.get("vistaCierreContrato").setVisible(false);
                        }
                        if(codigo == 6 || codigo == 11 || codigo == 9 || codigo == 13 || codigo == 14){
                            executionContext.getFormContext().ui.tabs.get("general").sections.get("vistaREG").setVisible(true);
                        }
                        else{
                            executionContext.getFormContext().ui.tabs.get("general").sections.get("vistaREG").setVisible(false);
                        }
                    }
                }
            }
        }
        else{
            EjecucionQuebranto.ocultarCamposEspecificos(executionContext);
        }
	},

    buscarCodigoTipoOperacion: function (executionContext, idTipoOperacion)	{
		//Preparamos la consulta
		var entityType = "xmsbs_tipooperacinejecucinquebranto";
		var entityId = idTipoOperacion;
		var query = "xmsbs_name,xmsbs_codigo";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarIdUsuario: function (executionContext, idIntegranteUr)	{
		//Preparamos la consulta
		var entityType = "xmsbs_urquebrantointegranteses";
		var entityId = idIntegranteUr;
		var query = "xmsbs_name&$expand=xmsbs_usuario($select=systemuserid)";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
		return resultado;
	},
    
    buscarDatosQuebranto: function (executionContext, idQuebranto)	{
		//Preparamos la consulta
		var entityType = "xmsbs_reversocastigos";
		var entityId = idQuebranto;
		var query = "xmsbs_reversocastigoid,xmsbs_totalreverso,xmsbs_totalcastigo";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
		return resultado;
	},
    
    buscarDatosURQuebranto: function (executionContext, idURQuebranto)	{
		//Preparamos la consulta
		var entityType = "xmsbs_urquebrantos";
		var entityId = idURQuebranto;
		var query = "xmsbs_codigo,xmsbs_name";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
		return resultado;
	},
    
    ocultarCamposEspecificos: function (executionContext){
        var agrupacionTipologia = EjecucionQuebranto.ShowCamposPorTipoOperacion;
        for(var i = 0; i < 15; i ++){
            if(agrupacionTipologia[i]){
                var camposDeAgrupacion = agrupacionTipologia[i];
                for(var j = 0; j < camposDeAgrupacion.length; j ++){
                    JumpStartLibXRM.Fx.hideField(executionContext, camposDeAgrupacion[j]);
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, camposDeAgrupacion[j], "none");
                }
            }
        }
		JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_ncaso");
    },
    
    onclick_enviarAGestion:function(executionContext){
        //Hace click en solicitar prorroga
        var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Enviar a Gestión", subtitle:"Va a volver a enviar el Quebranto a Gestión. ¿Desea Continuar?"};
        var confirmOptions  = { height: 200, width: 260 };
        Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
            function (success) {
                if(success.confirmed)
                {
					debugger;
				   //var urID = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_unidadresolutora", null);
                   var urID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_unidadresolutora");
                   if (urID.indexOf("{") > -1){urID = urID.substring(1, 37);}
							   
					var response = null;
					//var ApiUrlEjecutor = "/EjecucionQuebranto/EncontrarEjecutor?idUR=" + urID[0].id;
					//var ApiUrlEjecutor = "/Quebranto/GetAsignacion/" + urID[0].id;
                    var ApiUrlEjecutor = "/Quebranto/GetAsignacion/" + urID;
					var service = EjecucionQuebranto.GetRequestObject();
					
					if (service != null)
					{
						service.open("GET", EjecucionQuebranto.URL.Azure + ApiUrlEjecutor, false);
						service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
						service.setRequestHeader("Accept", "application/json,text/javascript, */*");
						service.setRequestHeader(EjecucionQuebranto.ApiKey.Name, EjecucionQuebranto.ApiKey.Key);
						service.send(null);
						if (service.response != "") 
						{
							response = JSON.parse(service.response);
						}
					}

					if (response.success)
					{
						//actualizar Ejecutor
						if(response.responsable){
							var fieldName = "xmsbs_ejecutorusuario";
							var id = response.responsable.systemuserid;
							var name = response.responsable.fullname;
							var entityType = "systemuser";
							var etapa = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
							
							//hacemos la marca para activar el WF
							JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_enviaragestion", true);
							JumpStartLibXRM.Fx.formSaveAndClose(executionContext);							
						}
						else
						{
							var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "La busqueda del Ejecutor no encontró un usuario valido. Contacte al Administrador MIDAS"};
							var alertOptions = { height: 200, width: 260 };
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
					else
					{
						var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "La UR seleccionada no contiene integrantes activos, que puedan ser asignados como Ejecutor del Quebranto"};
						var alertOptions = { height: 200, width: 260 };
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
                else
                {
                    //Si cancela
                }
            },
            function (error) {
                //console.log(error.message);
            }
        );
    },
    
    onclick_finalizarQuebranto:function(executionContext){
        //Hace click en finalizar
        var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Finalizar", subtitle:"Va a finalizar la solicitud. ¿Desea Continuar?"};
        var confirmOptions  = { height: 200, width: 260 };
        Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
            function (success) {
                if(success.confirmed)
                {
                    //Si confirma
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_finalizar", true);
                    JumpStartLibXRM.Fx.formSaveAndClose(executionContext);
                }
                else
                {
                    //Si cancela
                }
            },
            function (error) {
                //console.log(error.message);
            }
        );
    },
    
    onclick_terminarSinGestion:function(executionContext){
        //Hace click en finalizar
        var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Terminar Sin Gestión", subtitle:"Va a Terminar sin Gestión la solicitud. ¿Desea Continuar?"};
        var confirmOptions  = { height: 200, width: 260 };
        Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
            function (success) {
                if(success.confirmed)
                {
                    //Si confirma
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_terminarsingestion", true);
                    JumpStartLibXRM.Fx.formSaveAndClose(executionContext);
                }
                else
                {
                    //Si cancela
                }
            },
            function (error) {
                //console.log(error.message);
            }
        );
    },
    
    enable_Finalizar:function(executionContext){
        debugger;
        var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
        if(estado == 657130005){ // Si esta Completado
            return true;
        }
        else{
            return false;
        }
    },
    
    enable_EnviarGestion:function(executionContext){
        debugger;
        var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
        if(estado == 657130000 || estado == 657130004 || estado == 657130005){ // Si esta en reparo o creado, o Completado
            return true;
        }
        else{
            return false;
        }
    },
    
    enable_terminarSinGestion:function(executionContext){
        debugger;
        var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
        if(estado == 657130000){ // Si esta en Reparo
            return true;
        }
        else{
            return false;
        }
    },
    
    despliegueCamposControlContable:function(executionContext, formContext){
        debugger;
        //Primero vemos cual es el tipo de operación ingresado, y si es 1 o 2 para despliegue de campos.
        var tipoOperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tipooperacion");
        if(tipoOperacion){
            if (tipoOperacion.indexOf("{") > -1){tipoOperacion = tipoOperacion.substring(1, 37);}
            var resultado = EjecucionQuebranto.buscarCodigoTipoOperacion(executionContext,tipoOperacion);
            if(resultado){
                if(resultado.xmsbs_codigo != null){
                    var codigo = resultado.xmsbs_codigo;
                    if(codigo == 1 || codigo == 2){
                        if(codigo == 1){
                            //Si es 1: seccion_nominacastigo
                            formContext.ui.tabs.get("tab_3").sections.get("seccion_nominacastigo").setVisible(true);
                        }
                        else{
                            //Si es 2: seccion_partidacontable
                            formContext.ui.tabs.get("tab_3").sections.get("seccion_partidacontable").setVisible(true);
                        }
                    }
                }	
            }
        }
    },
    
    onChange_fechaDeVigente: function (executionContext) {
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaVigente = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechadelavigente", null);
        if(fechaVigente){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaVigente.setDate(fechaVigente.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de la vigente no puede ser mayor al día de hoy", title: "Fecha invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechadelavigente", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechadelavigente");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
    
    onChange_fechaContable: function (executionContext) {
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaVigente = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechacontable", null);
        if(fechaVigente){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaVigente.setDate(fechaVigente.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha contable no puede ser mayor al día de hoy", title: "Fecha invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechacontable", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechacontable");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
    
    onChange_fechaDeProceso: function (executionContext) {
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaVigente = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechadeproceso", null);
        if(fechaVigente){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaVigente.setDate(fechaVigente.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de proceso no puede ser mayor al día de hoy", title: "Fecha invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechadeproceso", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechadeproceso");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
    
    onChange_montoTotal:function(executionContext){
        debugger;
        var montoTotal = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_montototal", null);
        if(montoTotal){
            //Validamos que tipo de Tipo de Operación pidio
            var nombreTipoOperacion = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_tipooperacion");
            if(nombreTipoOperacion){
                //Hay un tipo de Operación. Vemos si su nombre es para Reverso o Castigo
                if (nombreTipoOperacion.toLowerCase().indexOf("castigo") > -1){
                    //El tipo de Operación tiene que ver con Castigo, validamos el monto contra el castigo
                    var quebranto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_quebrantorelacionado");
                    if (quebranto.indexOf("{") > -1){quebranto = quebranto.substring(1, 37);}
                    var resultado = EjecucionQuebranto.buscarDatosQuebranto(executionContext, quebranto);
                    if(resultado){
                        //Revisamos el resultado
                        var montoCastigo = resultado.xmsbs_totalcastigo;
                        if(montoTotal > montoCastigo){
                            //No se puede ingresar un monto total mayor al monto indicado
                            var alertStrings = { confirmButtonLabel: "Aceptar", text: "No puede ingresar un monto mayor al monto del Castigo", title: "Monto excede máximo Castigo" };
                            var alertOptions = { height: 120, width: 260 };
                            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                function (success) {
                                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_montototal", null);
                                },
                                function (error) {
                                    //console.log(error.message);
                                }
                            );
                        }
                    }
                }
                else{
                    if (nombreTipoOperacion.toLowerCase().indexOf("reverso") > -1){
                        //El tipo de Operación tiene que ver con Reverso, validamos el monto contra el reverso
                        var quebranto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_quebrantorelacionado");
                        if (quebranto.indexOf("{") > -1){quebranto = quebranto.substring(1, 37);}
                        var resultado = EjecucionQuebranto.buscarDatosQuebranto(executionContext, quebranto);
                        if(resultado){
                            //Revisamos el resultado
                            var montoReverso = resultado.xmsbs_totalreverso;
                            if(montoTotal > montoReverso){
                                //No se puede ingresar un monto total mayor al monto indicado
                                var alertStrings = { confirmButtonLabel: "Aceptar", text: "No puede ingresar un monto mayor al monto del Reverso", title: "Monto excede máximo Reverso" };
                                var alertOptions = { height: 120, width: 260 };
                                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                    function (success) {
                                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_montototal", null);
                                    },
                                    function (error) {
                                        //console.log(error.message);
                                    }
                                );
                            }
                        }
                        
                    }
                    else{
                        //No hay que validar monto ya que no tiene que ver ni con reverso ni con castigo
                    }
                }
            }
        }
    },
};