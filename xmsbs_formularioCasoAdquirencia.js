if (typeof(CasoAdquirencia) == "undefined") {
    CasoAdquirencia = {
        __namespace: true
    };    
}


CasoAdquirencia = {
    Form: {        
        Context: null,
        executionContext: null,
        formContext: null,
        LecturaGrilla:null,
        SeccionesGrillaID:null,
        PickList1_ArrayOptions:null,
        PickList2_ArrayOptions:null,
        PickList3_ArrayOptions:null,
        PickList4_ArrayOptions:null,
        PickList5_ArrayOptions:null,
        PickList6_ArrayOptions:null,
        PickList7_ArrayOptions:null,
		PickListMultiSelect1g_ArrayOptions:null,
		EtapaID:null,
		EtapaName:null,
		DOA_0037:"3E8BF81B-6FDA-EC11-BB3D-0022489D31F6",
		DOA_0037_FS_Etapa001:"4678a6cc-960f-ee11-8f6d-002248a02d09",
		oDetalleOperacion:null
    },
    
	URL: {        
        Azure: "",
        Name: "AzureURL"
    },
	
	ApiKey: {
        Key: "",
        Name: "AuthApi"
    },
    
	Roles: {
		Ejecutivo: "[Santander] - Ejecutivo",
    },	
      
    RolesArray: {
        SystemUser : ["fcdb18f7-5d73-eb11-b1ab-000d3ab8ddf9",
                      "169adf05-fdb3-4b76-af6f-0140da9090c2",
                      "d0029b50-b793-439c-ab38-79c6a3484460",
                      "4ffebe94-68ec-488e-bef9-b948b6566b7a",
                      "d954a592-c65a-41d0-bf78-bb256ddca278",
					  "deca26ca-a121-49cd-87d0-c486c43e5e2d",
                      "e6bc4b59-330d-4570-8fb8-cacdeacfc8c4"],
        SantanderUrAdmin: ["0c0e0889-916c-eb11-a812-00224803adb8",
                            "f3eb6299-797b-449b-82bf-65a665b8f359",
                            "cf3ed9c7-6216-475f-9d97-899ab397db6e",
                            "43434fd2-57d7-4dbc-a228-c633cf0680fc",
                            "30177055-5cfc-41a7-92c4-d0d9b7a13de2",
                            "6221ca30-f8d6-44ea-a0f2-d5e50e9a77c2"],
        SantanderContactCenterEjecutivo: ["977251D7-6AA1-4FB8-BCB0-793A1A97D7D8",
                                        "63717840-68F0-EB11-BACB-000D3AB3CEF2"],
        SantanderAdquerenciaUrAdmin2: ["06bf04ba-1197-eb11-b1ac-000d3a479b8f",  
                            "55f5fae3-7961-445e-9cab-10ee9034c321",
                            "b013a7de-9272-4308-854f-1e24d01e9ad1",  
                            "eb5bd81a-edac-4537-8c46-57cf815d5084",  
                            "eab2fd20-650c-4613-83d4-77c6799d8982",  
                            "e1714918-6c99-4e3a-996d-7c5300a76521",
                            "8c548c7e-c314-4874-bde3-fb6ac6e05a15",
                            "f8d4cae4-e2ef-eb11-bacb-000d3ab3c2e4"],
        SantanderAdquirenciaSupervisor: ["002bb930-10aa-ec11-983f-000d3add0341",
                                         "7451efdf-26c4-459d-8330-194ff1ba9dd0",
                                         "Af107960-42f2-4a28-bb96-044e1892fdff"]
    },


	codigopuntocontacto: {
		Ejecutivo: "PC-002",
		Contact: "PC-003",
        ContactAdq: "PCA-001"
	},

	codigoOrigen: {
		CRM: "O-008"
	},
    
    variableGlobal: {
        grillaCasosPorUR: 0,
        grillaComercioPorUR: 0
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
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
        //debugger;
		var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();	        
        CasoAdquirencia.Form.Context = executionContext;
        var test = onApiButtonClickAsync(executionContext);
        CasoAdquirencia.setApiKey(executionContext);
        CasoAdquirencia.setAzureURL(executionContext);
        formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false);
		JumpStartLibXRM.Fx.clearFormNotification(executionContext, "NOT_StockAdquirencia");
		
        CasoAdquirencia.Form.executionContext = executionContext;
        CasoAdquirencia.Form.formContext = formContext;
        
		if (tipoFormulario == '1'){
			CasoAdquirencia.ocultarFichaSecciones(formContext);
            CasoAdquirencia.origenCasoBloqueo(executionContext);
			CasoAdquirencia.puntoContactoBloqueo(executionContext);
			//CasoAdquirencia.buscarInstitucion(executionContext);
            JumpStartLibXRM.Fx.removeOption(executionContext, "prioritycode", 4);
            
            var prodadquiID = CasoAdquirencia.getProductoAdquiDetail(executionContext);
            if(prodadquiID != null)
            {
                JumpStartLibXRM.Fx.setLookupValue(executionContext, "xmsbs_producto", prodadquiID.value[0].xmsbs_productoservicioid, prodadquiID.value[0].xmsbs_name, "xmsbs_productoservicio");
            }
            CasoAdquirencia.bloqueacamposdeinicio(executionContext);
            
			//REITERAR
            var casopadre = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
            var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
			
			if(marcaReiterado && casopadre){ //si es reiterado, hay que forzar el onchange del producto y tipoydetalle
            
                CasoAdquirencia.onChange_tipoDetalleOperacion(executionContext);
                
                //FU: Se deben bloquear los campos de las secciones, menos solución esperada y descripción
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "ingresoinicial", true);
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
                
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_solucionesperada");
                JumpStartLibXRM.Fx.enableField(executionContext, "description");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_puntodecontacto");
                
                //Desbloqueo pedidos por Janina:
                //JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_preferenciasdecontacto");
                
            }            
            
        }
        else if (tipoFormulario == '2' || tipoFormulario == '3'){
            CasoAdquirencia.mostrarFichaSecciones(executionContext, formContext);
            CasoAdquirencia.setGeneralTab(executionContext); 
            CasoAdquirencia.setXrmFormContextWRBotoneraMejora(executionContext, formContext);  
           // CasoAdquirencia.setXrmFormContextWRBotonera(executionContext, formContext);
            CasoAdquirencia.BloquearObservacionesYSolucion(executionContext); 
            CasoAdquirencia.CampoObservacionesReparar(executionContext);
            CasoAdquirencia.BloquearCamposDespuesDeCrear(executionContext);
            CasoAdquirencia.camposSeccionesEtapa(executionContext);
            CasoAdquirencia.EnviarNotificacionCreacionCasoAdquirencia(executionContext, formContext.data.entity.getId()); 
            //CasoAdquirencia.crearCasoNEO(executionContext);         

            //Si el caso esta En Reinsistencia, mostramos las Observaciones
            var Prioridad = JumpStartLibXRM.Fx.getValueField(executionContext, "prioritycode", null);
            if(Prioridad == 4){
				formContext.ui.tabs.get("general").sections.get("tab_13_section_4").setVisible(true); //observaciones
				formContext.ui.tabs.get("general").sections.get("tab_13_section_4").setLabel("Observaciones Reinsistencia");//cambiar nombre del la seccion
				
				//Adicional muestro el campo de fecha de la reinsistencia
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_fecha");
				JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_fecha");
				JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_fecha", "Fecha de Reinsistencia");								
            }
        }
        else if (tipoFormulario == '4'){
			CasoAdquirencia.mostrarFichaSecciones(executionContext, formContext);
            CasoAdquirencia.camposSeccionesEtapa(executionContext);
            //CasoAdquirencia.EnviarNotificacionCierreCasoAdquirencia(executionContext, formContext.data.entity.getId());  
            
            //Mostramos la sección de encuestas si es subrequerimiento
            var esSubrequerimiento = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "parentcaseid");
            if(esSubrequerimiento){
                formContext.ui.tabs.get("tab_19").setVisible(true); //Encuestas
            }
            
            //OCultar botonera
            formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false); //Botonera
            //Mostrar observacion y cambiar nombre
            formContext.ui.tabs.get("general").sections.get("tab_13_section_4").setVisible(true); //observaciones
            formContext.ui.tabs.get("general").sections.get("tab_13_section_4").setLabel("Observaciones cierre masivo");//cambiar nombre del la seccion

            
        }
		
		CasoAdquirencia.bloqueoTipificacion(executionContext);
		//Marco requerido el telefono e email
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_telefonocelular", "required");
		//JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "required");
        
        //bloqueamos la sección de gestión general si el formulario es de lectura o finalizado
        if(tipoFormulario == 3 || tipoFormulario == 4){
            JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
        }
	},
    setGeneralTab:function(executionContext){
      //debugger;
        var formContext = executionContext.getFormContext();
        var GeneralTab = formContext.ui.tabs.get("general");
        GeneralTab.addTabStateChange(CasoAdquirencia.onChange_GeneralTabStateChange);       
    },  
    
    executeWRGrillaCasosClienteUR:function(executionContext){
        var formContext = executionContext.getFormContext();
        var estadoTab = formContext.ui.tabs.get("tab_18").getDisplayState();
        var variableGlobalGrilla = CasoAdquirencia.variableGlobal.grillaCasosPorUR;
        
        if(estadoTab == "expanded" && variableGlobalGrilla == 0){
            //hacemos el llamado a la API para pintar la grilla
            CasoAdquirencia.setXrmFormContextWRGrillaCasosClienteUR(executionContext, formContext);
            CasoAdquirencia.variableGlobal.grillaCasosPorUR = 1;
        }
    },
    
    executeWRGrillaCasosComercioUR:function(executionContext){
        var formContext = executionContext.getFormContext();
        var estadoTab = formContext.ui.tabs.get("tab_21").getDisplayState();
        var variableGlobalGrilla = CasoAdquirencia.variableGlobal.grillaComercioPorUR;
        
        if(estadoTab == "expanded" && variableGlobalGrilla == 0){
            //hacemos el llamado a la API para pintar la grilla
            CasoAdquirencia.setXrmFormContextWRGrillaCasosComercioUR(executionContext, formContext);
            CasoAdquirencia.variableGlobal.grillaComercioPorUR = 1;
        }
    },
    
    setApiKey: function(executionContext){
        //debugger;        
		var resultado = Util.buscarValorParametro(executionContext, CasoAdquirencia.ApiKey.Name);
        
        if(resultado)
        {
            CasoAdquirencia.ApiKey.Key = resultado;
        }
	},
    
    setAzureURL: function(executionContext){
        //debugger;
		var resultado = Util.buscarValorParametro(executionContext, CasoAdquirencia.URL.Name);
        
        if(resultado)
        {
            CasoAdquirencia.URL.Azure = resultado;
        }
	},
	
	setXrmFormContextWRBotonera: function (executionContext, formContext) {
		//debugger;
        var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
        var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext, "Administrador del sistema");
		var asAdmin2 = JumpStartLibXRM.Fx.UserHasRole(executionContext, "System Administrator");
        var asSuper = JumpStartLibXRM.Fx.UserHasRole(executionContext, "[Santander] - UR Administrador");
        var asSuper2 = JumpStartLibXRM.Fx.UserHasRole(executionContext, "[Adquirencia] - UR Administrador 2");

        if(!esPropietario && !asAdmin && !asSuper && !asAdmin2 && !asSuper2){
            formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false);
        }
        else{
            let response = null;
            var wrBotonera = formContext.getControl("WebResource_botoneraAcciones");
            let caseId = formContext.data.entity.getId();

            let finalUrlGetAcciones = "/caso/GetAcciones/" + caseId;

            var service = CasoAdquirencia.GetRequestObject();
            if (service != null) {
                service.open("GET", CasoAdquirencia.URL.Azure + finalUrlGetAcciones, false);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader(CasoAdquirencia.ApiKey.Name, CasoAdquirencia.ApiKey.Key);
                service.send(null);
                if (service.response != "") {
                    response = JSON.parse(service.response);
                    if (wrBotonera && response) {
                        wrBotonera.getContentWindow().then(
                            function (contentWindow) {
                                contentWindow.setClientApiContext(Xrm, executionContext, formContext, response);
                            }
                        );
                    }
                }
            }
        }
	},
    
    setXrmFormContextWRBotoneraMejora: function (executionContext, formContext) {
		// debugger;
        // let arrayNameRoles = new Array();
        // arrayNameRoles.push("Administrador del sistema");
        // arrayNameRoles.push("System Administrator");
        // arrayNameRoles.push("[Santander] - UR Administrador");
        // arrayNameRoles.push("[Adquirencia] - UR Administrador 2");
        // JumpStartLibXRM.Fx.UserHasRoles(executionContext,arrayNameRoles,CasoAdquirencia.setXrmFormContextWRBotoneraMejoraOK,CasoAdquirencia.setXrmFormContextWRBotoneraMejoraNOK);
       // var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
       // var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext, "Administrador del sistema");
		//var asAdmin2 = JumpStartLibXRM.Fx.UserHasRole(executionContext, "System Administrator");
       // var asSuper = JumpStartLibXRM.Fx.UserHasRole(executionContext, "[Santander] - UR Administrador");
       // var asSuper2 = JumpStartLibXRM.Fx.UserHasRole(executionContext, "[Adquirencia] - UR Administrador 2");

       // if(!esPropietario && !asAdmin && !asSuper && !asAdmin2 && !asSuper2){
       //     formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false);
       // }
       // else {
        //    let response = null;            
           
            
       // }
       CasoAdquirencia.formContext = executionContext.getFormContext();
       var formContext = executionContext.getFormContext();  
       let array = new Array ();
       CasoAdquirencia.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
       );
       CasoAdquirencia.RolesArray.SantanderUrAdmin.forEach( 
           function (x){
               array.push(x);
           }
        );
        CasoAdquirencia.RolesArray.SantanderAdquerenciaUrAdmin2.forEach( 
            function (x){
                array.push(x);
            }
        );
       let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
       if (found){                
           formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true);
           Caso.LoadBotoneraAccion(executionContext, formContext);
       }
       else{
           var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
           if(!esPropietario ){
               formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false);
           }
           else{
               formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true);
               Caso.LoadBotoneraAccion(executionContext, formContext);
            }    
       }

    },
    
    setXrmFormContextWRBotoneraMejoraOK: function (executionContext) {
        //debugger; 
        Caso.formContext = executionContext.getFormContext();
		var formContext = executionContext.getFormContext();       
        formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true);
        idIncident = formContext.data.entity.getId();         
        Xrm.WebApi.online.retrieveRecord("incident", idIncident.replace(/[{}]/g, ""), "?$select=xmsbs_botoneraaccionesobj").then(
            function success(result) {
               let response = null;
               var botoneraObj = result["xmsbs_botoneraaccionesobj"];
               response = JSON.parse(botoneraObj);
               CasoAdquirencia.LoadBotoneraAccion(executionContext, formContext);
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );

    },
    setXrmFormContextWRBotoneraMejoraNOK: function (executionContext) {
        //debugger;
        Caso.formContext = executionContext.getFormContext();
		var formContext = executionContext.getFormContext();
        var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
        if(!esPropietario ){
            formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false);
        }
        else{
            formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true);
            Xrm.WebApi.online.retrieveRecord("incident", idIncident.replace(/[{}]/g, ""), "?$select=xmsbs_botoneraaccionesobj").then(
            function success(result) {
                   let response = null;
                   var botoneraObj = result["xmsbs_botoneraaccionesobj"];
                   response = JSON.parse(botoneraObj);
                   CasoAdquirencia.LoadBotoneraAccion(executionContext, formContext, response);
                },
                function(error) {
                    Xrm.Utility.alertDialog(error.message);
                }
            );
         }        
    },

    
    LoadBotoneraAccion : function(executionContext, formContext){
        let response = null;
        var wrBotonera = formContext.getControl("WebResource_botoneraAcciones");            
        idIncident = formContext.data.entity.getId();         
        Xrm.WebApi.online.retrieveRecord("incident", idIncident.replace(/[{}]/g, ""), "?$select=xmsbs_botoneraaccionesobj").then(
            function success(result) {
                let response = null;
                var botoneraObj = result["xmsbs_botoneraaccionesobj"];
                response = JSON.parse(botoneraObj);
                    wrBotonera.getContentWindow().then(
                        function (contentWindow) {                      
                            if (contentWindow != null && typeof(contentWindow.setClientApiContext) === 'function'){ 
                                console.log("ejecuto correcto");                    
                                contentWindow.setClientApiContext(Xrm, executionContext, formContext, response);
                                }
                            else {
                            //debugger;
                            console.log("ejecuto reintento");
                            setTimeout(function(){ 
                                Caso.LoadBotoneraAccion(executionContext, formContext);
                            }, 1000);         
                            }
                        }
                    );          
                
                },
                function(error) {
                    Xrm.Utility.alertDialog(error.message);
                }
        );
    },
    
    setXrmFormContextWRGrillaCasosClienteUR: function (executionContext, formContext) {	
        var wrGrilla = formContext.getControl("WebResource_GrillaCasosClienteUR");
        var idCliente = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_cliente");
        var Cliente = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_cliente", "");
        var idUR = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ur");
        var UR = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_ur", "");
        var resultado = CasoAdquirencia.buscarCasosClienteUR(executionContext, idCliente, idUR);
        
        if (wrGrilla && resultado != null) {
            if(resultado.value.length > 0)
            {
                var listIncident = [];
                for(var i = 0; i < resultado.value.length; i++){
                    var CasoClienteURModel = {
                          Id: resultado.value[i]["incidentid"],
                          Titulo: resultado.value[i]["title"],
                          NumeroCaso: resultado.value[i]["xmsbs_numerocorrelativo"],
                          Estado: resultado.value[i]["statecode"],
                          //EtiquetaEstado: resultado.value[i]["incidentid"],
                          RazonEstado: resultado.value[i]["statuscode"],
                          //EtiquetaRazonEstado: resultado.value[i]["incidentid"],
                          Cliente: Cliente,
                          RutCliente: resultado.value[i]["xmsbs_rut"],
                          UR: UR,
                          Producto: CasoAdquirencia.obtenerProducto(executionContext, resultado.value[i]["_xmsbs_producto_value"]),
                          TipoRequerimiento: CasoAdquirencia.obtenerTipoRequerimiento(executionContext, resultado.value[i]["_xmsbs_tipoderequerimiento_value"]),
                          TipoOperacion: CasoAdquirencia.obtenerTipoOperacion(executionContext, resultado.value[i]["_xmsbs_tipodeoperacion_value"]),
                          TipoYDetalleOperacion: CasoAdquirencia.obtenerTipoYDetalleOperacion(executionContext, resultado.value[i]["_xmsbs_detalledetipologia_value"]),
                          FechaCreacion: CasoAdquirencia.formatDate(resultado.value[i]["createdon"])
                          //FechaCreacion: resultado.value[i]["createdon"]
                    };
                    
                    listIncident.push(CasoClienteURModel);
                };
                
                var response = {
                    success: true,
                    message: "",
                    listCaso: listIncident                
                };
                
                wrGrilla.getContentWindow().then(
                    function (contentWindow) {
                        contentWindow.setClientApiContext(Xrm, executionContext, formContext, response);
                    }
                );
            }            
        }
	},
    
    setXrmFormContextWRGrillaCasosComercioUR: function (executionContext, formContext) {	
        var wrGrilla = formContext.getControl("WebResource_GrillaCasosComercioUR");
        var idComercio = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_comercio");
        var Comercio = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_comercio", "");
        var idUR = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ur");
        var UR = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_ur", "");
        var resultado = CasoAdquirencia.buscarCasosComercioUR(executionContext, idComercio, idUR);
        
        if (wrGrilla && resultado != null) {
            //debugger;
            if(resultado.value.length > 0)
            {
                var listIncident = [];
                for(var i = 0; i < resultado.value.length; i++){
                    var CasoComercioURModel = {
                          Id: resultado.value[i]["incidentid"],
                          Titulo: resultado.value[i]["title"],
                          NumeroCaso: resultado.value[i]["xmsbs_numerocorrelativo"],
                          Estado: resultado.value[i]["statecode"],
                          //EtiquetaEstado: resultado.value[i]["incidentid"],
                          RazonEstado: resultado.value[i]["statuscode"],
                          //EtiquetaRazonEstado: resultado.value[i]["incidentid"],
                          Comercio: Comercio,
                          RutComercio: CasoAdquirencia.obtenerRutComercio(executionContext, resultado.value[i]["_xmsbs_comercio_value"]),
                          UR: UR,
                          Producto: CasoAdquirencia.obtenerProducto(executionContext, resultado.value[i]["_xmsbs_producto_value"]),
                          TipoRequerimiento: CasoAdquirencia.obtenerTipoRequerimiento(executionContext, resultado.value[i]["_xmsbs_tipoderequerimiento_value"]),
                          TipoOperacion: CasoAdquirencia.obtenerTipoOperacion(executionContext, resultado.value[i]["_xmsbs_tipodeoperacion_value"]),
                          TipoYDetalleOperacion: CasoAdquirencia.obtenerTipoYDetalleOperacion(executionContext, resultado.value[i]["_xmsbs_detalledetipologia_value"]),
                          FechaCreacion: CasoAdquirencia.formatDate(resultado.value[i]["createdon"])
                          //FechaCreacion: resultado.value[i]["createdon"]
                    };
                    
                    listIncident.push(CasoComercioURModel);
                };
                
                var response = {
                    success: true,
                    message: "",
                    listCaso: listIncident                
                };
                
                wrGrilla.getContentWindow().then(
                    function (contentWindow) {
                        contentWindow.setClientApiContext(Xrm, executionContext, formContext, response);
                    }
                );
            }            
        }
	},
    
    formatDate: function (date){
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        var fecha = dd + '/' + mm + '/' + yyyy; 
        return fecha;
    },
    
    obtenerProducto: function (executionContext, idProducto){
        if(idProducto)
        {
            var resultado = CasoAdquirencia.buscarProducto(executionContext, idProducto);
        
            if(resultado)
            {
                return resultado["xmsbs_name"];
            }
            else
            {
                return "";
            }
        }
        else
        {
            return "";
        }
    },
    
    obtenerTipoYDetalleOperacion: function (executionContext, idTipoYDetalleOperacion){
        if(idTipoYDetalleOperacion)
        {
            var resultado = CasoAdquirencia.buscarTipoYDetalleOperacion(executionContext, idTipoYDetalleOperacion);
        
            if(resultado)
            {
                return resultado["xmsbs_name"];
            }
            else
            {
                return "";
            }
        }
        else
        {
            return "";
        }
    },
    
    obtenerTipoRequerimiento: function (executionContext, idTipoRequerimiento){
        if(idTipoRequerimiento)
        {
            var resultado = CasoAdquirencia.buscarTipoRequerimiento(executionContext, idTipoRequerimiento);
        
            if(resultado)
            {
                return resultado["xmsbs_name"];
            }
            else
            {
                return "";
            }
        }
        else
        {
            return "";
        }
    },
    
    obtenerTipoOperacion: function (executionContext, idTipoOperacion){
        if(idTipoOperacion)
        {
            var resultado = CasoAdquirencia.buscarTipoOperacion(executionContext, idTipoOperacion);
        
            if(resultado)
            {
                return resultado["xmsbs_name"];
            }
            else
            {
                return "";
            }
        }
        else
        {
            return "";
        }
    },
    
    obtenerRutComercio: function (executionContext, idComercio){
        //debugger;
        if(idComercio)
        {
            var resultado = CasoAdquirencia.buscarComercio(executionContext, idComercio);
        
            if(resultado)
            {
                return resultado["accountnumber"];
            }
            else
            {
                return "";
            }
        }
        else
        {
            return "";
        }
    },
    
    obtenerNsucursal: function (executionContext, idSucursal){
        //debugger;
        if(idSucursal)
        {
            var resultado = CasoAdquirencia.buscarSucursal(executionContext, idSucursal);
        
            if(resultado)
            {
                return resultado["xmsbs_nsucursal"];
            }
            else
            {
                return "";
            }
        }
        else
        {
            return "";
        }
    },
    	
	bloqueoTipificacion: function (executionContext){
		//debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado != '1')
		{
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_producto");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_detalledetipologia");
            executionContext.getFormContext().getControl("xmsbs_causaraiz").addPreSearch(CasoAdquirencia.filtrarCausaRaiz);
		}
		else
		{
			executionContext.getFormContext().getControl("xmsbs_producto").addPreSearch(CasoAdquirencia.filtrarLookupProducto);
			//executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addPreSearch(CasoAdquirencia.puntoContactofiltro);
			executionContext.getFormContext().getControl("xmsbs_detalledetipologia").addPreSearch(CasoAdquirencia.filtrarLookupTipoDetalle);
		}
	},
	
	buscarInstitucion: function (executionContext){
		//debugger;
		var institucion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_institucion", null);
		if(!institucion)
		{
			var PropietarioId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
			var respuesta = CasoAdquirencia.datosUsuario(executionContext, PropietarioId);
			if (respuesta)
			{
                if(respuesta.xmsbs_institucion)
                {
                    var institucionUserId = respuesta.xmsbs_institucion.xmsbs_institucionid;
                    var institucionUserName = respuesta.xmsbs_institucion.xmsbs_name;
                    var EntityType = "xmsbs_institucion";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, "xmsbs_institucion", institucionUserId, institucionUserName, EntityType);
                }				
			}
		}
	},	
	
//==================
//FUNCIONES ONCHANGE
//==================
     onChange_Description: function (executionContext) {
        var obs = JumpStartLibXRM.Fx.getValueField(executionContext, "description", null);
        
        if(obs){        
            obs = obs.replace(/(\r\n|\n|\r)/gm, " ");
            obs = obs.replace(/;/g, ",");
            obs = obs.trim();
            JumpStartLibXRM.Fx.setValueField(executionContext, "description", obs);
        }
    },
    
    onChange_SolucionEsperada: function (executionContext) {
        var obs = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_solucionesperada", null);
        
        if(obs){        
            obs = obs.replace(/(\r\n|\n|\r)/gm, " ");
            obs = obs.replace(/;/g, ",");
            obs = obs.trim();            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_solucionesperada", obs);
        }
    },	
    

    onChange_GeneralTabStateChange: function() {
       // debugger;
        var executionContext = CasoAdquirencia.Form.Context;
        var formContext = executionContext.getFormContext();       
        var estadoTab = formContext.ui.tabs.get("general").getDisplayState();
        if(estadoTab == "expanded" ){  
            setTimeout(function(){ 
                   CasoAdquirencia.setXrmFormContextWRBotoneraMejora(executionContext, formContext);
               }, 1000);      
        }       
    },

	onChange_rut: function (executionContext) {

		var rut = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_rut", null);
		
		if(rut){
			//debugger;
			var respuesta = JumpStartLibXRM.Fx.validarrut(rut);
			if (respuesta == true){	
				var formateaRut = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_rut", null);
				formateaRut = formateaRut.replace(/[^\dkK]/g, "");
				var largo = formateaRut.length;

				formateaRut = formateaRut.substring(0, largo - 1) + "-" + formateaRut.substring(largo - 1, largo);
				//rut.setValue(formateaRut);
				JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rut", formateaRut);
			}
			else {
				JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_rut", null);
				
				var alertStrings = { confirmButtonLabel: "Aceptar", text: "Vuelva a ingresar el RUT.", title: "RUT no es valido" };
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
	
	onChange_cliente: function (executionContext) {
		//debugger;
		//llamada a servicio para consultar y actualizar datos propietario, etapa, SLA
		var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
		var response = null;
		
		if(rut)
        {
            var adquirenciaValue = CasoAdquirencia.getAdquirenciaDetail(executionContext); 
            var adquirenciaID = null;
            if(adquirenciaValue != null)
            {
                for(var i=0;i < adquirenciaValue.value.length; ++i)
                {
                   if(adquirenciaValue.value[i].xmsbs_name == "Adquirencia")
                   {
                        adquirenciaID = adquirenciaValue.value[i].xmsbs_institucionid;
                   }
                }
                
            }
            var contacto = CasoAdquirencia.getContactDetail(executionContext,rut,adquirenciaID);
			if (contacto != null)
			{
                if (contacto.value[0] != null)
                {
                    //Variables
                    var telefono = contacto.value[0].mobilephone;
                    var telefono2 = contacto.value[0].telephone1;
                    var correoElectronico = contacto.value[0].emailaddress1;
                    var apellidopaterno = contacto.value[0].lastname;
                    var apellidomaterno = contacto.value[0].middlename;
                    var nombrecliente = contacto.value[0].firstname;
                    var clientesantander = contacto.value[0].xmsbs_clientesantander;
                    var preferenciascontacto = contacto.value[0].xmsbs_preferenciacontacto;
                    
                    var preferenciasarray = new Set();
                    var valoresPreferencias;
                    
                    if(preferenciascontacto != null){    
                        if(preferenciascontacto.length > 0){
                            for(var i = 0; i < preferenciascontacto.length; i++){
                                preferenciasarray.add(preferenciascontacto[i].value);
                            }
                            valoresPreferencias = Array.from(preferenciasarray);
                        }
                    }
                    else{
                        preferenciasarray.add(657130001);
                        valoresPreferencias = Array.from(preferenciasarray);
                    }
                    
                    if(apellidopaterno){
                        //Actualizo los datos del cliente
                        if(telefono2 != null)
                        {
                          JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", telefono2);
                        }
                        else if(telefono != null)
                        {
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", telefono);
                        }
                        //JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", telefono);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_emailcliente", correoElectronico);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", valoresPreferencias);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidopaterno", apellidopaterno);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidomaterno", apellidomaterno);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrecliente", nombrecliente);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_clientesantander", clientesantander);
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_comercio");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_sucursal");
                        //JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_producto");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_detalledetipologia");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_solucionesperada");
                        JumpStartLibXRM.Fx.enableField(executionContext, "description");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");
                        //JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_preferenciasdecontacto");
                        JumpStartLibXRM.Fx.enableField(executionContext, "prioritycode");
                    }else{
                        //Pido que complete los campos del cliente marcandolo como requerido
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_telefonocelular", "required");
                        //JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_apellidopaterno", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_apellidomaterno", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_nombrecliente", "required");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_clientesantander", clientesantander);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", valoresPreferencias);
                        
                        //Habilito los campos
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");
                        //JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_apellidopaterno");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_apellidomaterno");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_nombrecliente");
                    }
                }	
                else
                {
                
                    //Seteo las variables de los campos iniciales
                    var preferenciasarray = new Set();
                    preferenciasarray.add(657130001);

                    var valoresPreferencias;
                    valoresPreferencias = Array.from(preferenciasarray);
                    var clientesantander = false;
                    
                    //Pido que complete los campos del cliente marcandolo como requerido
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_telefonocelular", "required");
                    //JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_apellidopaterno", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_nombrecliente", "required");
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_clientesantander", clientesantander);
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", valoresPreferencias);
                    
                    //Habilito los campos
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");
                    //JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_apellidopaterno");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_apellidomaterno");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_nombrecliente");
					
					//Setear el email por defecto
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_email", true);
					
					//Alert 
					var alertStrings = { confirmButtonLabel: "Aceptar", text: "El Rut ingresado no existe en la base de Contactos de Adquirencia. Favor crear primero el contacto", title: "ERROR" };
					var alertOptions = { height: 120, width: 260 };
					Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
						function (success) {
							//console.log("Alert dialog closed");
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rut", null);
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_comercio");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursal");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_producto");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_detalledetipologia");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_solucionesperada");
                            JumpStartLibXRM.Fx.disableField(executionContext, "description");
                            JumpStartLibXRM.Fx.disableField(executionContext, "prioritycode");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_preferenciasdecontacto");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_telefonocelular");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_emailcliente");
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", null);
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_nombrecliente");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidopaterno");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidomaterno");
						},
						function (error) {
							//console.log(error.message);
						}
					);
                }
                
                if (contacto.value[0] != null)
                {
                    //Cliente nativo			
                    var id = contacto.value[0].contactid;
                    var name = contacto.value[0].fullname;
                    var entityType = "contact";
                    var fieldName = "customerid";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    var fieldName = "xmsbs_cliente";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                }
                else{
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "customerid", "none");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_cliente", "none");
                }
			}
		}
        else
        {
            if(rut){
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_emailcliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidopaterno", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidomaterno", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrecliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "customerid", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_cliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comercio", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_sucursal", null);

                //Deshabilito los campos
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_telefonocelular");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_emailcliente");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidopaterno");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidomaterno");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_nombrecliente");
            }
        }
        //debugger;
        if(contacto){
            if(contacto.value[0])
            {
                CasoAdquirencia.getComercioUnico(executionContext,contacto.value[0]);
            }
        }
	},

    onChange_tipoDetalleOperacion: function (executionContext) {
        var productoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto");
        var tipoDetalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
        var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut");
        var formContext = executionContext.getFormContext();
        var casoid = formContext.data.entity.getId();
        
        if(productoId && tipoDetalleID){
            //Se debe completar el tipo de Requerimiento asociado al tipo y detalle de operación
            if (tipoDetalleID.indexOf("{") > -1){tipoDetalleID = tipoDetalleID.substring(1, 37);}
            
            //Se hace la nueva funcionalidad de validar TipoYDetalle por Punto de Contacto para bloquear ingreso
            var resultado = CasoAdquirencia.validaTipificacionesContact(executionContext, tipoDetalleID);
            if(!resultado){
                //Debe bloquar y enviar mensaje
                //Alerta porque no cumplio con la regla de las 10 tipificaciones.
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: "El Canal de Ingreso seleccionado no se admite para la tipificación seleccionada, o está vacío. La Problemática se limpiará"};
                var alertOptions = { height: 200, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {                        
                        //Limpiar el arbol
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_detalledetipologia", null);
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
            else{
                //hacemos odata que consulta para el producto el requerimiento que corresponde
                var respuesta = CasoAdquirencia.datosTipoDetalleOp(executionContext, tipoDetalleID);
                if(respuesta){
                    //Completamo el tipo de requerimiento
                    var tipoRequerimientoID = respuesta.xmsbs_tiporequerimiento.xmsbs_tiporequerimientoid;
                    var tipoRequerimientoName = respuesta.xmsbs_tiporequerimiento.xmsbs_name;
                    //actualizar campo tipo Requerimiento
                    var fieldName = "xmsbs_tipoderequerimiento";
                    var id = tipoRequerimientoID;
                    var name = tipoRequerimientoName;
                    var entityType = "xmsbs_tiporequerimiento";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    
                    //Completamos el tipo de operación
                    var tipoOperacionID = respuesta.xmsbs_TipodeOperacion.xmsbs_tipooperacionid;
                    var tipoOperacionName = respuesta.xmsbs_TipodeOperacion.xmsbs_name;
                    //actualizar campo tipo Operación
                    var fieldName = "xmsbs_tipodeoperacion";
                    var id = tipoOperacionID;
                    var name = tipoOperacionName;
                    var entityType = "xmsbs_tipooperacion";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    
                    //Completamos el detalle de operación
                    var detalleOperacionID = respuesta.xmsbs_detalledeoperacion.xmsbs_detalleoperacionid
                    var detalleOperacionName = respuesta.xmsbs_detalledeoperacion.xmsbs_name
                    //actualizar campo detalle de operación
                    var fieldName = "xmsbs_detalledeoperacion";
                    var id = detalleOperacionID;
                    var name = detalleOperacionName;
                    var entityType = "xmsbs_detalleoperacion";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    
                    //Completamos la institución desde el tipoRequerimiento
                    //debugger;
                    var respuesta = CasoAdquirencia.datosInstitucionPorTipoReq(executionContext, tipoRequerimientoID);
                    if(respuesta){
                        var fieldName = "xmsbs_institucion";
                        var id = respuesta.xmsbs_institucion.xmsbs_institucionid;
                        var name = respuesta.xmsbs_institucion.xmsbs_name;
                        var entityType = "xmsbs_institucion";
                        JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    }
                    //debugger;
                    //Reviso logica para seleccionar el punto de contacto
                    //CasoAdquirencia.puntoContactoBloqueo(executionContext);
                    
                    
                    
                }
                //debugger;
                //Vamos a buscar la etapa del flujo del detalle. Primero, buscamos el Flujo
                var respuesta = CasoAdquirencia.buscarFlujoDelDetalle(executionContext, detalleOperacionID);
                if(respuesta){
                    var flujoDelProcesoID = respuesta._xmsbs_flujosantander_value;
                    
                    //Buscamos la etapa inicial
                    var respuesta = CasoAdquirencia.buscarEtapaInicial(executionContext, flujoDelProcesoID);
                    if(respuesta){
                        if(respuesta.value.length > 0){
                            var etapaID = respuesta.value[0].xmsbs_etapaid;
                            
                            //Ya tenemos la primera etapa, ahora debemos llamar a los campos a pintar
                            CasoAdquirencia.camposSeccionesEtapa(executionContext, etapaID);
                            
                        }
                    }
                }
    //                debugger;
    //                CasoAdquirencia.casoRobo(executionContext);  
            }
        }
    },
    
     casoRobo: function (executionContext) {
        //debugger;
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        if(tipoFormulario == "1")
        {
            
            var tipoDetalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
            var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rutcomercio");        
            var respuesta = CasoAdquirencia.getCasoAvisoRobo(executionContext, rut);
            if(tipoDetalleID == "{22955921-BE72-EB11-B0B0-000D3A3B377D}" || tipoDetalleID == "{1C955921-BE72-EB11-B0B0-000D3A3B377D}")
            {
                
                if(respuesta && respuesta.value.length > 0)
                {
            
                JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_picklist3g",1);
                JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_picklist3g_texto","SI");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist3g");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_picklist4g");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_picklist5g");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist4g", "required");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist5g", "required");                
                }
                else
                {            
                JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_picklist3g",2);
                JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_picklist3g_texto","NO");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist3g");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist4g");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist5g");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist4g", "none");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist5g", "none");
                }
        
            }
        }
        else if(tipoFormulario == "2")
        {
            var tipoDetalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
            
            if(tipoDetalleID == "{22955921-BE72-EB11-B0B0-000D3A3B377D}" || tipoDetalleID == "{1C955921-BE72-EB11-B0B0-000D3A3B377D}")
            {
                var robo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_picklist3g_texto");                
                if(robo == "SI")
                {
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_picklist4g");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_picklist5g");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist4g", "required");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist5g", "required");                
                }
                else if(robo == "NO")
                {
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist4g");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist5g");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist4g", "none");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist5g", "none");
                }
        
            }
        }
        
     
     },
    
    
    casoMeArrepenti: function (executionContext) {
        debugger;
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        if(tipoFormulario == "1")
        {
            
            var tipoDetalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");                    
            
            if(tipoDetalleID == "{FA945921-BE72-EB11-B0B0-000D3A3B377D}")
            {
                var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rutcomercio");
                var respuesta = CasoAdquirencia.getCasoMeArrepenti(executionContext, rut)
                if(respuesta && respuesta.value.length > 0)
                {
            
                JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_picklist3g",2);
                JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_picklist3g_texto","Segundo caso");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist3g");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_picklist4g");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist4g", "required");               
                }
                else
                {            
                JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_picklist3g",1);
                JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_picklist3g_texto","Primer caso");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist3g");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist4g");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist4g", "none");
                }
        
            }
            if(tipoDetalleID == "{6AB46093-7E27-EC11-B6E5-000D3ADF05BA}")
            {
                var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rutcomercio");
                var respuesta = CasoAdquirencia.getCasoRoboPerdida(executionContext, rut);
                
                if(respuesta && respuesta.value.length > 0)
                {
                JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_numeropropiedad","Segundo caso");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_numeropropiedad");             
                }
                else
                {            
                JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_numeropropiedad","Primer caso");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_numeropropiedad");
                }
        
            }
        }
        else if(tipoFormulario == "2")
        {
            var tipoDetalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
            
            if(tipoDetalleID == "{FA945921-BE72-EB11-B0B0-000D3A3B377D}")
            {
                var incistencia = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_picklist3g_texto");                
                if(incistencia == "Segundo caso")
                {
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_picklist4g");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist4g", "required");              
                }
                else if(incistencia == "Primer caso")
                {
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist4g");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist4g", "none");
                }
        
            }
        }
        
     
     },
     
    onChange_region: function (executionContext) {
        //debugger;
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        var tipoDetalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
        var reg = [];
        if (tipoDetalleID == "{E2945921-BE72-EB11-B0B0-000D3A3B377D}" || tipoDetalleID == "{9DF096D6-F27A-ED11-81AD-000D3ADF70F0}" || tipoDetalleID == "{D7E37AF3-E5D5-EB11-BACC-000D3AB7CD80}" || tipoDetalleID == "{57011A69-0E6F-EC11-8943-000D3AB4DEAF}" || tipoDetalleID == "{1C955921-BE72-EB11-B0B0-000D3A3B377D}" || tipoDetalleID == "{12955921-BE72-EB11-B0B0-000D3A3B377D}" || tipoDetalleID == "{FC49DB48-8059-EF11-BFE3-002248A34FE9}" || tipoDetalleID == "{49E771E3-FC8A-EF11-AC20-000D3ADCFDF7}" || tipoDetalleID == "{E668AEC2-3A91-EF11-8A69-000D3ADCFDF7}" || tipoDetalleID == "{6B2C2284-53AB-EF11-B8E9-000D3ADDF83E}" || tipoDetalleID == "{89B3914C-732B-F011-8C4E-7C1E52772859}" || tipoDetalleID == "{2595857A-2D42-F011-877A-7C1E527657AA}" || tipoDetalleID == "{E1F9A3A7-045D-F011-877A-002248E0CEFB}")
        {
            var region = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_picklist2g");
            
            if(region == 1)
            {
                reg = ["IQUIQUE","ALTO HOSPICIO","POZO ALMONTE","CAMIÑA","COLCHANE","HUARA","PICA"];
            }
            if(region == 2)
            {
                reg = ["ANTOFAGASTA","MEJILLONES","SIERRA GORDA","TALTAL","CALAMA","OLLAGÜE","SAN PEDRO DE ATACAMA","TOCOPILLA","MARIA ELENA"];
            }
            if(region == 3)
            {
                reg = ["COPIAPO","CALDERA","TIERRA AMARILLA","CHAÑARAL","DIEGO DE ALMAGRO","VALLENAR","ALTO DEL CARMEN","FREIRINA","HUASCO"];
            }
            if(region == 4)
            {
                reg = ["LA SERENA","COQUIMBO","ANDACOLLO","LA HIGUERA","PAIGUANO","VICUÑA","ILLAPEL","CANELA","LOS VILOS","SALAMANCA","OVALLE","COMBARBALA","MONTE PATRIA","PUNITAQUI","RIO HURTADO"];
            }
            if(region == 5)
            {
                reg = ["VALPARAISO","CASABLANCA","CONCON","JUAN FERNANDEZ","PUCHUNCAVI","QUINTERO","VIÑA DEL MAR","ISLA DE PASCUA","LOS ANDES","CALLE LARGA","RINCONADA","SAN ESTEBAN","LA LIGUA","CABILDO","PAPUDO","PETORCA","ZAPALLAR","QUILLOTA","CALERA","HIJUELAS","LA CRUZ","NOGALES","SAN ANTONIO","ALGARROBO","CARTAGENA","EL QUISCO","EL TABO","SANTO DOMINGO","SAN FELIPE","CATEMU","LLAILLAY","PANQUEHUE","PUTAENDO","SANTA MARIA","QUILPUE","LIMACHE","OLMUE","VILLA ALEMANA"];
            }
            if(region == 6)
            {
                reg = ["RANCAGUA","CODEGUA","COINCO","COLTAUCO","DOÑIHUE","GRANEROS","LAS CABRAS","MACHALI","MALLOA","MOSTAZAL","OLIVAR","PEUMO","PICHIDEGUA","QUINTA DE TILCOCO","RENGO","REQUINOA","SAN VICENTE","PICHILEMU","LA ESTRELLA","LITUECHE","MARCHIHUE","NAVIDAD","PAREDONES","SAN FERNANDO","CHEPICA","CHIMBARONGO","LOLOL","NANCAGUA","PALMILLA","PERALILLO","PLACILLA","PUMANQUE","SANTA CRUZ"];
            }
            if(region == 7)
            {
                reg = ["TALCA","CONSTITUCION","CUREPTO","EMPEDRADO","MAULE","PELARCO","PENCAHUE","RIO CLARO","SAN CLEMENTE","SAN RAFAEL","CAUQUENES","CHANCO","PELLUHUE","CURICO","HUALAÑE","LICANTEN","MOLINA","RAUCO","ROMERAL","SAGRADA FAMILIA","TENO","VICHUQUEN","LINARES","COLBUN","LONGAVI","PARRAL","RETIRO","SAN JAVIER","VILLA ALEGRE","YERBAS BUENAS"];
            }
            if(region == 8)
            {
                reg = ["CONCEPCION","CORONEL","CHIGUAYANTE","FLORIDA","HUALQUI","LOTA","PENCO","SAN PEDRO DE LA PAZ","SANTA JUANA","TALCAHUANO","TOME","HUALPEN","LEBU","ARAUCO","CAÑETE","CONTULMO","CURANILAHUE","LOS ALAMOS","TIRUA","LOS ANGELES","ANTUCO","CABRERO","LAJA","MULCHEN","NACIMIENTO","NEGRETE","QUILACO","QUILLECO","SAN ROSENDO","SANTA BARBARA","TUCAPEL","YUMBEL","ALTO BIOBIO"];
            }
            if(region == 9)
            {
                reg = ["TEMUCO","CARAHUE","CUNCO","CURARREHUE","FREIRE","GALVARINO","GORBEA","LAUTARO","LONCOCHE","MELIPEUCO","NUEVA IMPERIAL","PADRE LAS CASAS","PERQUENCO","PITRUFQUEN","PUCON","SAAVEDRA","TEODORO","SCHMIDT","TOLTEN","VILCUN","VILLARRICA","CHOLCHOL","ANGOL","COLLIPULLI","CURACAUTIN","ERCILLA","LONQUIMAY","LOS SAUCES","LUMACO","PUREN","RENAICO","TRAIGUEN","VICTORIA"];
            }
            if(region == 10)
            {
                reg = ["PUERTO MONTT","CALBUCO","COCHAMO","FRESIA","FRUTILLAR","LOS MUERMOS","LLANQUIHUE","MAULLIN","PUERTO VARAS","CASTRO","ANCUD","CHONCHI","CURACO DE VELEZ","DALCAHUE","PUQUELDON","QUEILEN","QUELLON","QUEMCHI","QUINCHAO","OSORNO","PUERTO OCTAY","PURRANQUE","PUYEHUE","RIO NEGRO","SAN JUAN DE LA COSTA","SAN PABLO","CHAITEN","FUTALEUFU","HUALAIHUE","PALENA"];
            }
            if(region == 11)
            {
                reg = ["COIHAIQUE","LAGO VERDE","AISEN","CISNES","GUAITECAS","COCHRANE","O'HIGGINS","TORTEL","CHILE CHICO","RIO IBAÑEZ"];
            }
            if(region == 12)
            {
                reg = ["PUNTA ARENAS","LAGUNA BLANCA","RIO VERDE","SAN GREGORIO","CABO DE HORNOS","ANTARTICA","PORVENIR","PRIMAVERA","TIMAUKEL","NATALES","TORRES DEL PAINE"];
            }
            if(region == 13)
            {
                reg = ["SANTIAGO","CERRILLOS","CERRO NAVIA","CONCHALI","EL BOSQUE","ESTACION CENTRAL","HUECHURABA","INDEPENDENCIA","LA CISTERNA","LA FLORIDA","LA GRANJA","LA PINTANA","LA REINA","LAS CONDES","LO BARNECHEA","LO ESPEJO","LO PRADO","MACUL","MAIPU","ÑUÑOA","PEDRO AGUIRRE CERDA","PEÑALOLEN","PROVIDENCIA","PUDAHUEL","QUILICURA","QUINTA NORMAL","RECOLETA","RENCA","SAN JOAQUIN","SAN MIGUEL","SAN RAMON","VITACURA","PUENTE ALTO","PIRQUE","SAN JOSE DE MAIPO","COLINA","LAMPA","TILTIL","SAN BERNARDO","BUIN","CALERA DE TANGO","PAINE","MELIPILLA","ALHUE","CURACAVI","MARIA PINTO","SAN PEDRO","TALAGANTE","EL MONTE","ISLA DE MAIPO","PADRE HURTADO","PEÑAFLOR"];
            }
            if(region == 14)
            {
                reg = ["VALDIVIA","CORRAL","LANCO","LOS LAGOS","MAFIL","MARIQUINA","PAILLACO","PANGUIPULLI","LA UNION","FUTRONO","LAGO RANCO","RIO BUENO"];
            }
            if(region == 15)
            {
                reg = ["ARICA","CAMARONES","PUTRE","GENERAL LAGOS"];
            }
            if(region == 16)
            {
                reg = ["NINHUE","CHILLAN","BULNES","CHILLAN VIEJO","EL CARMEN","PEMUCO","PINTO","QUILLON","SAN IGNACIO","YUNGAY","QUIRIHUE","COBQUECURA","COELEMU","PORTEZUELO","RANQUIL","TREGUACO","SAN CARLOS","COIHUECO","ÑIQUEN","SAN FABIAN","SAN NICOLAS"];
            }

            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist7g", "required");
				
				
				var PickList = formContext.getControl("xmsbs_picklist7g");
				var Opciones = JumpStartLibXRM.Fx.getOptions(executionContext, "xmsbs_picklist7g"); 
				// siempre se borran todas las opciones ya que no son opciones válidas para el negocio.
				for (var i = 0; i < Opciones.length; i++) 
				{
					PickList.removeOption(Opciones[i].value);
				}					
			
//				var ArrayItems = reg.split(";");
				if(reg != null)
				{
					for (var i = 0; i < reg.length; i++)
					{
						let textoItem = reg[i];
						let valorItem = i + 1;
						var opcion = {value : valorItem, text : textoItem};
						PickList.addOption(opcion);
					}
                    
                    //JumpStartLibXRM.Fx.addOnChange(executionContext, "xmsbs_picklist7g", "CasoAdquirencia.onChangePicklistGenerico");
				}
            
        }        
    },
    
     onChange_comuna: function (executionContext)
	{
		//debugger;
		var formContext = executionContext.getFormContext();
		var tipoFormulario = formContext.ui.getFormType();
		var tipoDetalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
		var comuna = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_picklist7g");
		var region = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_picklist2g");
        var ciclo = executionContext._depth;
		if (tipoDetalleID == "{E2945921-BE72-EB11-B0B0-000D3A3B377D}" || tipoDetalleID == "{9DF096D6-F27A-ED11-81AD-000D3ADF70F0}" || tipoDetalleID == "{D7E37AF3-E5D5-EB11-BACC-000D3AB7CD80}" || tipoDetalleID == "{57011A69-0E6F-EC11-8943-000D3AB4DEAF}" || tipoDetalleID == "{1C955921-BE72-EB11-B0B0-000D3A3B377D}" || tipoDetalleID == "{12955921-BE72-EB11-B0B0-000D3A3B377D}" || tipoDetalleID == "{FC49DB48-8059-EF11-BFE3-002248A34FE9}" || tipoDetalleID == "{49E771E3-FC8A-EF11-AC20-000D3ADCFDF7}" || tipoDetalleID == "{E668AEC2-3A91-EF11-8A69-000D3ADCFDF7}" || tipoDetalleID == "{6B2C2284-53AB-EF11-B8E9-000D3ADDF83E}" || tipoDetalleID == "{89B3914C-732B-F011-8C4E-7C1E52772859}" || tipoDetalleID == "{2595857A-2D42-F011-877A-7C1E527657AA}" || tipoDetalleID == "{E1F9A3A7-045D-F011-877A-002248E0CEFB}")
		{
			if (region != null && comuna != null && ciclo <= 2)
			{
				if (region == 1)
				{
					reg = ["IQUIQUE", "ALTO HOSPICIO", "POZO ALMONTE", "CAMIÑA", "COLCHANE", "HUARA", "PICA"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 2)
				{
					reg = ["ANTOFAGASTA", "MEJILLONES", "SIERRA GORDA", "TALTAL", "CALAMA", "OLLAGÜE", "SAN PEDRO DE ATACAMA", "TOCOPILLA", "MARIA ELENA"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 3)
				{
					reg = ["COPIAPO", "CALDERA", "TIERRA AMARILLA", "CHAÑARAL", "DIEGO DE ALMAGRO", "VALLENAR", "ALTO DEL CARMEN", "FREIRINA", "HUASCO"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 4)
				{
					reg = ["LA SERENA", "COQUIMBO", "ANDACOLLO", "LA HIGUERA", "PAIGUANO", "VICUÑA", "ILLAPEL", "CANELA", "LOS VILOS", "SALAMANCA", "OVALLE", "COMBARBALA", "MONTE PATRIA", "PUNITAQUI", "RIO HURTADO"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 5)
				{
					reg = ["VALPARAISO", "CASABLANCA", "CONCON", "JUAN FERNANDEZ", "PUCHUNCAVI", "QUINTERO", "VIÑA DEL MAR", "ISLA DE PASCUA", "LOS ANDES", "CALLE LARGA", "RINCONADA", "SAN ESTEBAN", "LA LIGUA", "CABILDO", "PAPUDO", "PETORCA", "ZAPALLAR", "QUILLOTA", "CALERA", "HIJUELAS", "LA CRUZ", "NOGALES", "SAN ANTONIO", "ALGARROBO", "CARTAGENA", "EL QUISCO", "EL TABO", "SANTO DOMINGO", "SAN FELIPE", "CATEMU", "LLAILLAY", "PANQUEHUE", "PUTAENDO", "SANTA MARIA", "QUILPUE", "LIMACHE", "OLMUE", "VILLA ALEMANA"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 6)
				{
					reg = ["RANCAGUA", "CODEGUA", "COINCO", "COLTAUCO", "DOÑIHUE", "GRANEROS", "LAS CABRAS", "MACHALI", "MALLOA", "MOSTAZAL", "OLIVAR", "PEUMO", "PICHIDEGUA", "QUINTA DE TILCOCO", "RENGO", "REQUINOA", "SAN VICENTE", "PICHILEMU", "LA ESTRELLA", "LITUECHE", "MARCHIHUE", "NAVIDAD", "PAREDONES", "SAN FERNANDO", "CHEPICA", "CHIMBARONGO", "LOLOL", "NANCAGUA", "PALMILLA", "PERALILLO", "PLACILLA", "PUMANQUE", "SANTA CRUZ"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 7)
				{
					reg = ["TALCA", "CONSTITUCION", "CUREPTO", "EMPEDRADO", "MAULE", "PELARCO", "PENCAHUE", "RIO CLARO", "SAN CLEMENTE", "SAN RAFAEL", "CAUQUENES", "CHANCO", "PELLUHUE", "CURICO", "HUALAÑE", "LICANTEN", "MOLINA", "RAUCO", "ROMERAL", "SAGRADA FAMILIA", "TENO", "VICHUQUEN", "LINARES", "COLBUN", "LONGAVI", "PARRAL", "RETIRO", "SAN JAVIER", "VILLA ALEGRE", "YERBAS BUENAS"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 8)
				{
					reg = ["CONCEPCION", "CORONEL", "CHIGUAYANTE", "FLORIDA", "HUALQUI", "LOTA", "PENCO", "SAN PEDRO DE LA PAZ", "SANTA JUANA", "TALCAHUANO", "TOME", "HUALPEN", "LEBU", "ARAUCO", "CAÑETE", "CONTULMO", "CURANILAHUE", "LOS ALAMOS", "TIRUA", "LOS ANGELES", "ANTUCO", "CABRERO", "LAJA", "MULCHEN", "NACIMIENTO", "NEGRETE", "QUILACO", "QUILLECO", "SAN ROSENDO", "SANTA BARBARA", "TUCAPEL", "YUMBEL", "ALTO BIOBIO"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 9)
				{
					reg = ["TEMUCO", "CARAHUE", "CUNCO", "CURARREHUE", "FREIRE", "GALVARINO", "GORBEA", "LAUTARO", "LONCOCHE", "MELIPEUCO", "NUEVA IMPERIAL", "PADRE LAS CASAS", "PERQUENCO", "PITRUFQUEN", "PUCON", "SAAVEDRA", "TEODORO", "SCHMIDT", "TOLTEN", "VILCUN", "VILLARRICA", "CHOLCHOL", "ANGOL", "COLLIPULLI", "CURACAUTIN", "ERCILLA", "LONQUIMAY", "LOS SAUCES", "LUMACO", "PUREN", "RENAICO", "TRAIGUEN", "VICTORIA"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 10)
				{
					reg = ["PUERTO MONTT", "CALBUCO", "COCHAMO", "FRESIA", "FRUTILLAR", "LOS MUERMOS", "LLANQUIHUE", "MAULLIN", "PUERTO VARAS", "CASTRO", "ANCUD", "CHONCHI", "CURACO DE VELEZ", "DALCAHUE", "PUQUELDON", "QUEILEN", "QUELLON", "QUEMCHI", "QUINCHAO", "OSORNO", "PUERTO OCTAY", "PURRANQUE", "PUYEHUE", "RIO NEGRO", "SAN JUAN DE LA COSTA", "SAN PABLO", "CHAITEN", "FUTALEUFU", "HUALAIHUE", "PALENA"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 11)
				{
					reg = ["COIHAIQUE", "LAGO VERDE", "AISEN", "CISNES", "GUAITECAS", "COCHRANE", "O'HIGGINS", "TORTEL", "CHILE CHICO", "RIO IBAÑEZ"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 12)
				{
					reg = ["PUNTA ARENAS", "LAGUNA BLANCA", "RIO VERDE", "SAN GREGORIO","CABO DE HORNOS", "ANTARTICA", "PORVENIR", "PRIMAVERA", "TIMAUKEL", "NATALES", "TORRES DEL PAINE"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 13)
				{
					reg = ["SANTIAGO", "CERRILLOS", "CERRO NAVIA", "CONCHALI", "EL BOSQUE", "ESTACION CENTRAL", "HUECHURABA", "INDEPENDENCIA", "LA CISTERNA", "LA FLORIDA", "LA GRANJA", "LA PINTANA", "LA REINA", "LAS CONDES", "LO BARNECHEA", "LO ESPEJO", "LO PRADO", "MACUL", "MAIPU", "ÑUÑOA", "PEDRO AGUIRRE CERDA", "PEÑALOLEN", "PROVIDENCIA", "PUDAHUEL", "QUILICURA", "QUINTA NORMAL", "RECOLETA", "RENCA", "SAN JOAQUIN", "SAN MIGUEL", "SAN RAMON", "VITACURA", "PUENTE ALTO", "PIRQUE", "SAN JOSE DE MAIPO", "COLINA", "LAMPA", "TILTIL", "SAN BERNARDO", "BUIN", "CALERA DE TANGO", "PAINE", "MELIPILLA", "ALHUE", "CURACAVI", "MARIA PINTO", "SAN PEDRO", "TALAGANTE", "EL MONTE", "ISLA DE MAIPO", "PADRE HURTADO", "PEÑAFLOR"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 14)
				{
					reg = ["VALDIVIA", "CORRAL", "LANCO", "LOS LAGOS", "MAFIL", "MARIQUINA", "PAILLACO", "PANGUIPULLI", "LA UNION", "FUTRONO", "LAGO RANCO", "RIO BUENO"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 15)
				{
					reg = ["ARICA", "CAMARONES", "PUTRE", "GENERAL LAGOS"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
				if (region == 16)
				{
					reg = ["NINHUE", "CHILLAN", "BULNES", "CHILLAN VIEJO", "EL CARMEN", "PEMUCO", "PINTO", "QUILLON", "SAN IGNACIO", "YUNGAY", "QUIRIHUE", "COBQUECURA", "COELEMU", "PORTEZUELO", "RANQUIL", "TREGUACO", "SAN CARLOS", "COIHUECO", "ÑIQUEN", "SAN FABIAN", "SAN NICOLAS"];
					var valor = comuna - 1
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist7g_texto", reg[valor]);
				}
//				var num = CasoAdquirencia.variableGlobal.contador.valueOf()
//				if (num == 0)
//				{
					JumpStartLibXRM.Fx.addOnChange(executionContext, "xmsbs_picklist7g", "CasoAdquirencia.onChange_comuna");
//					CasoAdquirencia.variableGlobal.contador = CasoAdquirencia.variableGlobal.contador + 1;
//				}
			}
		}
	},
    
    onChange_conteosegmento: function (executionContext) {
        //debugger;
         var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        var tipoDetalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
        var cantidad = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_entero1g");
        var reg = [];
        if (tipoDetalleID == "{E668AEC2-3A91-EF11-8A69-000D3ADCFDF7}" && cantidad != null)
        {
            if(cantidad == 0)
            {   
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklistmultiselect1g");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklistmultiselect1g", "none");
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", "0");
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", "0");
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", "0");
            }
            if(cantidad > 0)
            {   
            
                var comercioid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_comercio");
            
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_picklistmultiselect1g");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklistmultiselect1g", "required");
                var mercha = executionContext.getFormContext().getAttribute("xmsbs_picklistmultiselect1g").getValue(); 
                
                 if(mercha == null)
                {
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", "0");
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", "0");
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", "0");
                }
                
                if(mercha != null)
                {
                
                    if(mercha.length == 1)
                    {
                       for(var i = 0; i < mercha.length; i++)
                       {
                           if(mercha[i] == 1)
                            {
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", "0");
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", "0");
                            }
                            if(mercha[i] == 2)
                            {
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", "0");
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", "0");
                            }
                            if(mercha[i] == 3)
                            {
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", "0");
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", "0");
                            } 
                                
                       }                        
                    }
                    if(mercha.length == 2)
                    {   
                        var porta = 0;
                        var servi = 0;
                        var acri = 0;
                        for(var i = 0; i < mercha.length; i++)
                        {
                           if(mercha[i] == 1)
                            {
                                porta = 1;
                            }
                            if(mercha[i] == 2)
                            {
                                servi = 1;
                            }
                            if(mercha[i] == 3)
                            {
                                acri = 1;
                            } 
                                
                        }
                        
                        if(porta==1 && servi==1)
                        {
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", "0");
                        }
                        if(porta==1 && acri==1)
                        {
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", "0");
                        }
                        if(servi==1 && acri==1)
                        {
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", "0");
                        }
                        
                        porta = 0;
                        servi = 0;
                        acri = 0;
                    }
                    
                    var comercioid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_comercio");                    
                    comercioid = comercioid.slice(1,-1);
                    var respuesta = CasoAdquirencia.buscarSegmentoComercio(executionContext, comercioid);
                    
                    if(respuesta.xmsbs_segmento == "Classic")
                    {
                       for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Corporaciones")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 6;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 4;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Empresas")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 5;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Grandes empresas")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 6;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 4;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Inmobiliarias")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 6;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 4;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Institucionales")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 6;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 4;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Masiva")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Negocio")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 4;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Nobel")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Preferente")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Premier")
                    {
                       for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "Pyme")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 3;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 5;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    if(respuesta.xmsbs_segmento == "pyme 1")
                    {
                        for(var i = 0; i < mercha.length; i++)
                       {
                            var total = 0;
                            //Portacuentas
                            if(mercha[i] == 1)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_regionpropiedad", total.toString());
                                total = 0
                            }
                            //Servilletero
                            if(mercha[i] == 2)
                            {
                                total = cantidad * 4;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_comunapropiedad", total.toString());
                                total = 0
                            }
                            //Acrilico
                            if(mercha[i] == 3)
                            {
                                total = cantidad * 2;
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_callepropiedad", total.toString());
                                total = 0
                            }
                       } 
                    }
                    
                    
                }
            }
        }
    },
    
    preSearchPuntoContacto: function (executionContext){
        //debugger;
        executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addPreSearch(CasoAdquirencia.onChange_PuntoContacto);
    },
    
    onChange_PuntoContacto: function (executionContext) {
        //debugger;
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        var currentuserid = userSettings.userId;
        var userid = currentuserid.replace(/[{}]/g, "");
        var bandera = true;
        
        var respuesta = CasoAdquirencia.getURReclamos(executionContext, userid);
        
        if(respuesta != null && respuesta != undefined)
        {
            for (var i = 0; i < respuesta.value.length; i++) 
            {
                if(respuesta.value[i]._xmsbs_unidadresolutora_value != "ebe05f5b-7851-ee11-be6e-000d3adf717d")
                {
                    bandera = true;
                }
                else
                {
                    bandera = false;
                    i = respuesta.value.length + 1;
                }
            }	
        }
        
        
        if(bandera == true)
        {
            var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_codigo' operator='like' value='PCA%' /><condition attribute='xmsbs_name' operator='ne' value='CMF' /><condition attribute='xmsbs_name' operator='ne' value='SERNAC' /></filter>";
            executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addCustomFilter(fetchXml);
        }
        else if(bandera == false)
        {
            var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_codigo' operator='like' value='PCA%' /></filter>";
            executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addCustomFilter(fetchXml);
        }
        
        
     },
    
    onChange_pregunta2caso: function (executionContext) {
        //debugger;
        var pregunta2caso = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2delcaso");	 
        if(pregunta2caso){
            if (pregunta2CasoAdquirencia.indexOf("{") > -1){pregunta2caso = pregunta2CasoAdquirencia.substring(1, 37);}
            
            //hacemos odata que consulta cual es el detalle de operación de esa tipología
            var respuesta = CasoAdquirencia.datosPreguna2caso(executionContext, pregunta2caso);
            if(respuesta){
                //Trajo la información, ahora consultamos por el tipodedetalle que tenga ese detalle de operación
                var detalleOperacionID = respuesta._xmsbs_detalledeoperacion_value;
                if (detalleOperacionID.indexOf("{") > -1){detalleOperacionID = detalleOperacionID.substring(1, 37);}
                
                var respuesta = CasoAdquirencia.buscaTipoDetalle(executionContext, detalleOperacionID);
                if(respuesta){
                    //Completamo el tipodetalleoperación
                    var tipoDetalleName = respuesta.value[0].xmsbs_name;
                    var tipoDetalleID = respuesta.value[0].xmsbs_tipoydetalledeoperacionid;
                    
                    //actualizar campo tipo Detalle
                    var fieldName = "xmsbs_detalledetipologia";
                    var id = tipoDetalleID;
                    var name = tipoDetalleName;
                    var entityType = "xmsbs_tipoydetalledeoperacion";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    
                    //Gatillamos el onchange de ese campo
                    CasoAdquirencia.onChange_tipoDetalleOperacion(executionContext);
                }
            }
        }
    },
    
	onChange_comercio: function (executionContext){
        //debugger;
        //executionContext.getFormContext().getControl("xmsbs_sucursal").addPreSearch(CasoAdquirencia.filtrarLookupSucursal);
        //executionContext.getFormContext().getControl("xmsbs_sucursalendondeseinstalaranuevopos").addPreSearch(CasoAdquirencia.filtrarLookupSucursal);
        var comercioid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_comercio");
        
        if(comercioid)
        {
            comercioid = comercioid.slice(1,-1);
            var rutcomercio = CasoAdquirencia.obtenerRutComercio(executionContext, comercioid);
            
            if(rutcomercio)
            {
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rutcomercio", rutcomercio);
            }     
        }
    },

    
    onchange_validacionCliente: function (executionContext){
        //debugger;
        var validacion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_validacionescliente");
        if(validacion)
        {
            if(validacion == 2)
            {
                var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Cerrar el caso", subtitle:"A seleccionado validacion Cliente NO y el caso se cerara. ¿Desea Continuar?", text: "Esta acción no se puede deshacer" };
                var confirmOptions  = { height: 200, width: 260 };
                Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) 
                {
                    if(success.confirmed)
                    {
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", 1);
                    }
                    else
                    {
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_validacionescliente", null);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", null);
                    }
                });
                
            }
            else
            {
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", null);
            }
        }
    },

    onchange_Sucursal: function (executionContext){
        //debugger;
        var contact = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_cliente");
        var comercio = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_comercio");
        var sucursal = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_sucursal");   
       
        if(contact && comercio && sucursal)
        {
           var tipocontact =  CasoAdquirencia.getTipoContacto(executionContext,contact,comercio,sucursal);
           
           if(tipocontact)
           {
                if(tipocontact.value[0] != null)
                {
                    JumpStartLibXRM.Fx.setOptionSetField(executionContext, "xmsbs_cargoqueejerceenelcomercio", tipocontact.value[0].xmsbs_relacion);
                }
           }
           
           
        }
        else
        {
            
        }
        
        var sucursalId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_sucursal");
        if(sucursalId)
        {
             sucursalId = sucursalId.slice(1,-1);
            var nsucursal = CasoAdquirencia.obtenerNsucursal(executionContext, sucursalId);
            
            if(nsucursal)
            {
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nsucursal", nsucursal);
            }    
        }
    },
    
	onChange_minutos: function (executionContext){
        //debugger;	
		var minuto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_horaroboperdida", null);
		if (minuto)
		{
            var separador = minuto.charAt(2);
			if (separador != ":")
			{
                				
				var alertStrings = {confirmButtonLabel: "Aceptar",text: "Debe contener el separador de horario (:).",title: "Formato incorrecto"};
				var alertOptions = {height: 120,width: 260};
				Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
				function (success)
				{
					console.log("Alert dialog closed");
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_horaroboperdida", null);
				},

				function (error)
				{
					//console.log(error.message);
				});
                 
            }
		}	
	},    
	
	onChange_minutosTransaccion: function (executionContext){
        //debugger;	
		var minuto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_horadelatransaccion", null);
		if (minuto)
		{
            var separador = minuto.charAt(2);
			if (separador != ":")
			{
                				
				var alertStrings = {confirmButtonLabel: "Aceptar",text: "Debe contener el separador de horario (:).",title: "Formato incorrecto"};
				var alertOptions = {height: 120,width: 260};
				Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
				function (success)
				{
					console.log("Alert dialog closed");
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_horadelatransaccion", null);
				},

				function (error)
				{
					//console.log(error.message);
				});
                 
            }
		}	
	},
    
    filtrarLookupComercio: function (executionContext){  
        //debugger;
        var contactid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_cliente");
        var resultado = CasoAdquirencia.oDataGetComercios(executionContext,contactid);
        
        if(resultado){
            var fetchXml = "<filter type='and'><filter type='or'>";
            for(var i = 0; i < resultado.value.length; i ++){
                var accountid = resultado.value[i].accountid;
                var accountname = resultado.value[i].name;
                fetchXml += "<condition attribute='accountid' operator='eq' uiname='"+accountname+"' uitype='account' value='{"+accountid+"}' />";
            }
            fetchXml += "</filter></filter>";
        }
        
        executionContext.getFormContext().getControl("xmsbs_comercio").addCustomFilter(fetchXml); 
    },
    
    filtrarLookupSucursal: function (executionContext){
        //debugger;
        var contactid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_cliente");
        var comercioid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_comercio"); 
        var resultado = CasoAdquirencia.oDataGetSucursales(executionContext,contactid,comercioid);
        
        if(resultado){
            var fetchXml = "<filter type='and'><filter type='or'>";
            for(var i = 0; i < resultado.value.length; i ++){
                var sucursalid = resultado.value[i].xmsbs_sucursalid;
                var sucursalname = resultado.value[i].xmsbs_name;
                fetchXml += "<condition attribute='xmsbs_sucursalid' operator='eq' uiname='"+sucursalname+"' uitype='xmsbs_sucursal' value='{"+sucursalid+"}' />";
            }
            fetchXml += "</filter></filter>";
        }
        
        executionContext.getFormContext().getControl("xmsbs_sucursal").addCustomFilter(fetchXml); 
        executionContext.getFormContext().getControl("xmsbs_sucursalendondeseinstalaranuevopos").addCustomFilter(fetchXml); 
        
    },
	filtrarLookupProducto: function (executionContext){
		 //debugger;
		var casopadre = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
		var institucion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_institucion", null);
		
		if (casopadre)
		{
			if(institucion)
			{
				var institucionName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_institucion");
				var institucionId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_institucion");
				
				var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_crm' operator='eq' value='1' /><condition attribute='xmsbs_tipo' operator='in'><value>657130001</value><value>657130002</value></condition><condition attribute='xmsbs_institucion' operator='eq' uiname='"+institucionName+"' uitype='xmsbs_institucion' value='"+institucionId+"' /></filter>";
				executionContext.getFormContext().getControl("xmsbs_producto").addCustomFilter(fetchXml);
			}
			else
			{
				var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_crm' operator='eq' value='1' /><condition attribute='xmsbs_tipo' operator='in'><value>657130001</value><value>657130002</value></condition></filter>";
				executionContext.getFormContext().getControl("xmsbs_producto").addCustomFilter(fetchXml);
			}
		}
		else
		{
			if(institucion)
			{
				var institucionName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_institucion");
				var institucionId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_institucion");
				
				var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_crm' operator='eq' value='1' /><condition attribute='xmsbs_tipo' operator='in'><value>657130000</value><value>657130002</value></condition><condition attribute='xmsbs_institucion' operator='eq' uiname='"+institucionName+"' uitype='xmsbs_institucion' value='"+institucionId+"' /></filter>";
				executionContext.getFormContext().getControl("xmsbs_producto").addCustomFilter(fetchXml);
			}
			else	
			{
				var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_crm' operator='eq' value='1' /><condition attribute='xmsbs_tipo' operator='in'><value>657130000</value><value>657130002</value></condition></filter>";
				executionContext.getFormContext().getControl("xmsbs_producto").addCustomFilter(fetchXml);
			}
		}
	},	

	filtrarLookupTipoDetalle: function (executionContext) {
		 //debugger;
		var casopadre = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
		var ur = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_urtipologia", null);
		
		if (casopadre)
		{
			if(ur)
			{
				var urName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_urtipologia");
				var urId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_urtipologia");
				
				var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_subrequerimiento' operator='eq' value='1' /><condition attribute='xmsbs_urtipologia' operator='eq' uiname='"+urName+"' uitype='xmsbs_unidadresolutora' value='"+urId+"' /></filter>";
				executionContext.getFormContext().getControl("xmsbs_detalledetipologia").addCustomFilter(fetchXml);
			}
			else
			{
				var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_subrequerimiento' operator='eq' value='1' /></filter>";
				executionContext.getFormContext().getControl("xmsbs_detalledetipologia").addCustomFilter(fetchXml);
			}
		}
		else
		{
			var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_subrequerimiento' operator='eq' value='0' /></filter>";
			executionContext.getFormContext().getControl("xmsbs_detalledetipologia").addCustomFilter(fetchXml);
		}
	},
    
    filtrarCausaRaiz: function (executionContext) {
        //debugger;
        //Primero, se debe ver si la tipificación tiene causas raices específicas
        var DetalleOperacionNombre = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_detalledeoperacion");
        var DetalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
                    
        var resultado = CasoAdquirencia.buscarCausasRaicesEspecificas(executionContext, DetalleOperacionID);
        if(resultado){
            if(resultado.value.length > 0){
                //Tiene causas raices específicas. Usamos la query de las causas específicas
                var fetchXml = 	"<filter type='and'>"+
									"<filter type='or'>"+
										"<filter type='and'>"+
											"<condition attribute='statecode' operator='eq' value='0' />"+
											"<condition attribute='xmsbs_flag' operator='eq' value='0' />"+
										"</filter>";
										
				for (var i=0; i < resultado.value.length; i++){
					fetchXml = fetchXml + "<condition attribute='xmsbs_causaraizid' operator='eq' uiname='Nombre' uitype='xmsbs_causaraiz' value='"+resultado.value[i]._xmsbs_causaraiz_value+"' />";
				}
				
				fetchXml +=	"</filter>"+
							"</filter>";
                            
                executionContext.getFormContext().getControl("xmsbs_causaraiz").addCustomFilter(fetchXml);
            }
            else{
                //No tiene, se usa el fetch general
                var fetchXml = 	"<filter type='and'>"+
                            "<condition attribute='statecode' operator='eq' value='0' />"+
                            "<condition attribute='xmsbs_flag' operator='eq' value='0' />"+
                            "</filter>";
                            
                executionContext.getFormContext().getControl("xmsbs_causaraiz").addCustomFilter(fetchXml);
            }
        }
        else{
            //Si no tiene, se hace el fetch para mostrar lo general	
            var fetchXml = 	"<filter type='and'>"+
                            "<condition attribute='statecode' operator='eq' value='0' />"+
                            "<condition attribute='xmsbs_flag' operator='eq' value='0' />"+
                            "</filter>";
                            
            executionContext.getFormContext().getControl("xmsbs_causaraiz").addCustomFilter(fetchXml);
        }
    },	
    
	onChange_TipoResolucion: function (executionContext) {

		var tipoResolucionAdquirencia = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_tipoderespuesta", null);
	
		if(tipoResolucionAdquirencia == 2)
		{
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_motivoresolucionadquirencia");
		}
		else
		{
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_motivoresolucionadquirencia");
		}
	},
	
	onChange_Nomodificar: function (executionContext) {

		var noModificar = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_noesposiblemodificar", null);
	
		if(noModificar == true)
		{
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tipoderespuesta", null);
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_tipoderespuesta");
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_motivoresolucionadquirencia", null);
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_motivoresolucionadquirencia");
		}
		else
		{
			JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_tipoderespuesta");
		}
	},	
	
	investigacion: function (executionContext) {

		var inicia = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_iniciarinvestigacion", null);
		var etapaactual = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_etapa");
	
		if(inicia == true && etapaactual == "Cerrar requerimiento")
		{
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_resultadoinvestigacion");
		}
		else
		{
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_resultadoinvestigacion");
		}
	},	
    
    checkIndicadorQuebranto:function(executionContext){
        //debugger;
        var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
        if(detalleOperacionID){
            if (detalleOperacionID.indexOf("{") > -1){detalleOperacionID = detalleOperacionID.substring(1, 37);}
            CasoAdquirencia.Form.oDetalleOperacion = CasoAdquirencia.buscarDetalleOperacion(executionContext, detalleOperacionID);
            if(CasoAdquirencia.Form.oDetalleOperacion){
                var indicadorQueranto = CasoAdquirencia.Form.oDetalleOperacion.xmsbs_quebranto;
                var indicadorenFormulario = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_indicadordequebranto", null);
                if(indicadorQueranto && indicadorenFormulario == false){
                    //Setear en si el campo y bloquearlo
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_indicadordequebranto", true);
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_indicadordequebranto");
                }
            }
        }
    },
	
	onChange_Quebranto: function (executionContext) {
		var quebranto = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_indicadordequebranto", null);
		if(quebranto == true)
		{
			JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_registroquebranto", "required");
		}
		else
		{
			JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_registroquebranto", "none");
		}
	},

    onChange_producto: function (executionContext) {
        var productoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto");     
   
        if(productoId)
        {
            JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_detalledetipologia");            
            
        }
        else
        {
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_detalledetipologia");
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_detalledetipologia", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_numerooperacion", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta1delcaso", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta2delcaso", null);
        }
        
        //CasoAdquirencia.setXrmFormContextWRNumeroOperacion(executionContext);
        PopUp.openWRNumeroOperacion(executionContext, CasoAdquirencia.URL.Azure, CasoAdquirencia.ApiKey.Key);
	},
    
    onChange_correo: function (executionContext) {
        //debugger;
        var correo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_emailcliente", null);
        if(correo){
            var validaCorreo = CasoAdquirencia.validarFormatoCorreoRegex(correo);
            if (!validaCorreo)
            {
              JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_emailcliente", "");
            }	
        }
    },

    validarFormatoCorreoRegex: function (correo){
      if(!correo.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)){
        return false;
      }
      return true;
    },
    
    onChange_telefonoCelular: function (executionContext) {
        var telefono = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_telefonocelular", null);
        if(telefono){
            var validaTelefono = CasoAdquirencia.validarFormatoTelefonoRegex(telefono);
            if (!validaTelefono)
            {
              JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", "");
            }	
        }
    },

    validarFormatoTelefonoRegex: function (telefono){
      if(!telefono.match(/^((\+?)569|9)?([0-9]{8})$/)){
        return false;
      }
      return true;
    },
    
    MostraroDataCamposSeccionesRespuesta: function (executionContext, respuesta){
            //debugger;
            if (respuesta != null && respuesta.length >0){          
            for (var i = 0; i < respuesta.length; ++i)
            {
                if (respuesta[i].xmsbs_integracion != null && respuesta[i].xmsbs_integracion != undefined && respuesta[i].xmsbs_integracion != "")
                {   
                    //CasoIngresoCRM.campoIntegracion(executionContext, respuesta[i].xmsbs_nombreesquema, respuesta[i].xmsbs_integracion);
					CasoAdquirencia.campoIntegracion(executionContext, respuesta[i].xmsbs_integracion, respuesta[i].xmsbs_borrar, respuesta[i].xmsbs_label, respuesta[i].xmsbs_lectura, respuesta[i].xmsbs_predeterminado, respuesta[i].xmsbs_requerido, respuesta[i].xmsbs_visible);
                }
				else if ((respuesta[i].xmsbs_tipocampo == 2 || respuesta[i].xmsbs_tipocampo == 3) &&
                        (respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist1g" || respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist2g" ||
                         respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist3g" || respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist4g" || 
                         respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist5g" || respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist6g" || 
                         respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist7g" || 
						 respuesta[i].xmsbs_nombreesquema == "xmsbs_picklistmultiselect1g")) 
				{
					// se reutiliza el campo: xmsbs_valoreseningresoformunico para almacenar las opciones del Picklist
					CasoAdquirencia.PicklistGenerico(executionContext, respuesta[i].xmsbs_nombreesquema, respuesta[i].xmsbs_valoreseningresoformunico, respuesta[i].xmsbs_borrar, respuesta[i].xmsbs_label, respuesta[i].xmsbs_lectura, respuesta[i].xmsbs_predeterminado, respuesta[i].xmsbs_requerido, respuesta[i].xmsbs_visible);
				}
				else
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
                    if (respuesta[i].xmsbs_lectura)
                    {
                        JumpStartLibXRM.Fx.disableField(executionContext, respuesta[i].xmsbs_nombreesquema);
                    }
                    else
                    {
                        JumpStartLibXRM.Fx.enableField(executionContext, respuesta[i].xmsbs_nombreesquema);
						
						// aplica solo si el DO tiene un cód de Stock Adquirencia.
						CasoAdquirencia.SetStockActual(executionContext, respuesta[i].xmsbs_nombreesquema);
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
                    var Ncampo = CasoAdquirencia.terminaEnNumero(respuesta[i].xmsbs_nombreesquema);
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
					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoAdquirencia.onChange_rut");
					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoAdquirencia.onChangeSoloNumeros");
//					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoAdquirencia.onChange_Fecha");
//					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoAdquirencia.onChangeSoloLetra");
//					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoAdquirencia.onChange_correo");

					// Funcion al cambiar
					if (respuesta[i].xmsbs_fncjsonchange)
					{
						if(respuesta[i].xmsbs_fncjsonchange == 657130000) // Texto, valida RUT
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoAdquirencia.onChange_rut");
						}
						else if(respuesta[i].xmsbs_fncjsonchange == 657130001) // Texto, solo números (0-9)
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoAdquirencia.onChangeSoloNumeros");
						}
						else if(respuesta[i].xmsbs_fncjsonchange == 657130002) // Fecha, el o antes de hoy
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoAdquirencia.onChange_Fecha");
						}
						else if(respuesta[i].xmsbs_fncjsonchange == 657130003) // Texto, solo letras y espacio
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoAdquirencia.onChangeSoloLetra");
						}
						else if(respuesta[i].xmsbs_fncjsonchange == 657130004) // Texto, valida email
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoAdquirencia.onChange_correo");
						}
                    }		
                }
            }                     
        }
        else
        {
            //alert("Error en el consumo del servicio rest api.");
        }
    },
    
    onChangePicklistGenerico: function (executionContext)
	{
		//debugger;
		var PickList = executionContext.getEventSource().getName();
		//determina el origen en base al nombre
		var OpcionesPickList = "";
		if (PickList.includes("multiselect"))
		{
			//debugger;
			if (PickList.includes("1g")) OpcionesPickList = CasoAdquirencia.Form.PickListMultiSelect1g_ArrayOptions;
			var IndexPicklist = executionContext.getFormContext().getAttribute(PickList).getValue();
			if (IndexPicklist != null)
			{
				var ArrayOpcionesSeleccionadas = [];
				IndexPicklist.forEach(function (OpcionSel)
				{
					var ItemSeleccionado = OpcionesPickList.split(";")[OpcionSel - 1];
					if (ItemSeleccionado.includes(","))
					{
						ItemSeleccionado = ItemSeleccionado.split(",")[1];
					}
					ArrayOpcionesSeleccionadas.push(ItemSeleccionado);
				});
				var OpcionesSeleccionadas = ArrayOpcionesSeleccionadas.join('; ');
				JumpStartLibXRM.Fx.setValueField(executionContext, PickList + "_texto", OpcionesSeleccionadas);
			}
			else
			{
				JumpStartLibXRM.Fx.setValueField(executionContext, PickList + "_texto", "");
			}
		}
		else
		{
			if (PickList.includes("1g")) OpcionesPickList = CasoAdquirencia.Form.PickList1_ArrayOptions;
			else if (PickList.includes("2g")) OpcionesPickList = CasoAdquirencia.Form.PickList2_ArrayOptions;
			else if (PickList.includes("3g")) OpcionesPickList = CasoAdquirencia.Form.PickList3_ArrayOptions;
			else if (PickList.includes("4g")) OpcionesPickList = CasoAdquirencia.Form.PickList4_ArrayOptions;
			else if (PickList.includes("5g")) OpcionesPickList = CasoAdquirencia.Form.PickList5_ArrayOptions;
			else if (PickList.includes("6g")) OpcionesPickList = CasoAdquirencia.Form.PickList6_ArrayOptions;
			else if (PickList.includes("7g")) OpcionesPickList = CasoAdquirencia.Form.PickList7_ArrayOptions;
			var IndexPicklist = executionContext.getFormContext().getAttribute(PickList).getValue();
			if (IndexPicklist != null)
			{
				var ItemSeleccionado = OpcionesPickList.split(";")[IndexPicklist - 1];
				if (ItemSeleccionado.includes(","))
				{
					ItemSeleccionado = ItemSeleccionado.split(",")[1];
				}
				JumpStartLibXRM.Fx.setValueField(executionContext, PickList + "_texto", ItemSeleccionado);
			}
			else
			{
				JumpStartLibXRM.Fx.setValueField(executionContext, PickList + "_texto", "");
			}
		}
        
        CasoAdquirencia.onChange_region(executionContext);
        CasoAdquirencia.onChange_comuna(executionContext); 
        CasoAdquirencia.onChange_conteosegmento(executionContext);
	},
    
    PicklistGenerico: function(executionContext, CampoPickList,  valores, borrar, label, lectura, predeterminado, requerido, visible) { 
		//debugger;
        // predeterminado: no aplica
		
		var CampoTexto = CampoPickList + "_texto";
		
		
        var formContext = executionContext.getFormContext();
		var tipoFormulario = formContext.ui.getFormType();	
		
		if (tipoFormulario == JumpStartLibXRM.FormState.READ_ONLY ||
			tipoFormulario == JumpStartLibXRM.FormState.DISABLED)
			lectura = true;
				
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CampoTexto , "none");
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CampoPickList, "none");
		
		if (visible)
		{
			if (borrar)
			{
				JumpStartLibXRM.Fx.setValueField(executionContext, CampoTexto, null);
				JumpStartLibXRM.Fx.setValueField(executionContext, CampoPickList, null);
			}			
			
			if (lectura)
			{
				JumpStartLibXRM.Fx.showField(executionContext, CampoTexto);
				JumpStartLibXRM.Fx.disableField(executionContext, CampoTexto);
				JumpStartLibXRM.Fx.setLabel(executionContext, CampoTexto, label);
			}
			else
			{
				if (CampoPickList.includes("multiselect"))
				{
					//debugger;
					if (CampoPickList.includes("1g"))
						CasoAdquirencia.Form.PickListMultiSelect1g_ArrayOptions = valores;
				}
				else
				{				
					if (CampoPickList.includes("1g"))
						CasoAdquirencia.Form.PickList1_ArrayOptions = valores;
					else if (CampoPickList.includes("2g"))
						CasoAdquirencia.Form.PickList2_ArrayOptions = valores;
					else if (CampoPickList.includes("3g"))
						CasoAdquirencia.Form.PickList3_ArrayOptions = valores;
					else if (CampoPickList.includes("4g"))
						CasoAdquirencia.Form.PickList4_ArrayOptions = valores;
					else if (CampoPickList.includes("5g"))
						CasoAdquirencia.Form.PickList5_ArrayOptions = valores;
					else if (CampoPickList.includes("6g"))
						CasoAdquirencia.Form.PickList6_ArrayOptions = valores;
					else if (CampoPickList.includes("7g"))
						CasoAdquirencia.Form.PickList7_ArrayOptions = valores;
                }
				
				JumpStartLibXRM.Fx.showField(executionContext, CampoPickList);
				JumpStartLibXRM.Fx.enableField(executionContext, CampoPickList);
				JumpStartLibXRM.Fx.setLabel(executionContext, CampoPickList, label);
				
				if (requerido)
					JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CampoPickList, "required");
				
				
				var PickList = formContext.getControl(CampoPickList);
				var Opciones = JumpStartLibXRM.Fx.getOptions(executionContext, CampoPickList); 
				// siempre se borran todas las opciones ya que no son opciones válidas para el negocio.
				for (var i = 0; i < Opciones.length; i++) 
				{
					PickList.removeOption(Opciones[i].value);
				}					
				
				var ArrayItems = valores.split(";");
				if(ArrayItems != null)
				{
					for (var i = 0; i < ArrayItems.length; i++)
					{
						let textoItem = ArrayItems[i];
						let valorItem = i + 1;
						var opcion = {value : valorItem, text : textoItem};
						PickList.addOption(opcion);
					}
                    
                    JumpStartLibXRM.Fx.addOnChange(executionContext, CampoPickList, "CasoAdquirencia.onChangePicklistGenerico");
				}
				else
				{
					// MSG ERROR CONFIGURACION CAMPO
				}
			}
		}
    },
        
    onChangeSoloNumeros: function(executionContext) { 
        //debugger;
        var myControl = executionContext.getEventSource().getName();
        var campo = Xrm.Page.getControl(myControl).getValue();
        if (campo)
        {
            campo = campo.replace(/\D/g, '');
            Xrm.Page.getAttribute(myControl).setValue(campo);
        }
        if(campo == "")
        {
            var alertStrings = { confirmButtonLabel: "Aceptar", text: "Para este campo solo se deben ingresar Numeros", title: "Solo Numeros" };
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
//FUNCIONES ONSAVE
//==================

	onSave_Formulario: function (executionContext){
        debugger;		
        //var formContext = executionContext.getFormContext();
		//CasoAdquirencia.mostrarFichaSecciones(executionContext, formContext);

		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        //Si el caso se esta recién creando
		if (estado == '1') {
			//llamada a servicio para consultar y actualizar datos propietario, etapa, SLA
            var detalleOperacionID = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledeoperacion", null);
            var idIngresador = JumpStartLibXRM.Fx.getValueField(executionContext, "ownerid", null);
            var idPuntoContacto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_puntodecontacto", null);
            var prioridad = JumpStartLibXRM.Fx.getValueField(executionContext, "prioritycode", null);            
            var response = null;
            var ApiUrlCreacionCaso = "/Caso/IngresoNativoCRM?idDetalleOperacion=" + detalleOperacionID[0].id + "&idIngresador=" + idIngresador[0].id + "&idPuntoContacto=" + idPuntoContacto[0].id + "&prioridad=" + prioridad;
            try {
                var service = CasoAdquirencia.GetRequestObject();
               // var apiToken = window.sessionStorage.getItem("LokiAuthToken");
                if (service != null) {
                    service.open("GET", CasoAdquirencia.URL.Azure + ApiUrlCreacionCaso, false);
                    service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                    service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                    service.setRequestHeader(CasoAdquirencia.ApiKey.Name, CasoAdquirencia.ApiKey.Key);
                    //service.setRequestHeader("TokenApi", apiToken);
                    service.send(null);
                    if (service.response != "") 
                    {
                        response = JSON.parse(service.response);
                    }
                }
                if (response.success) {
                    //actualizar etapa
                    if(response.erEtapa){
                        var fieldName = "xmsbs_etapa";
                        var id = response.erEtapa.id;
                        var name = response.erEtapa.name;
						
						// JM: Solo si es DOA-0037 y si está en este punto (creación)
						// Entonces la etapa siguiente siempre será la ETAPA01 (el GUID no es fijo, ya que el flujo relacionado al DO pudo haber sido versionado)
						// momentáneamente se considerarán valores FIJOS, si el flujo se versiona, entonces se debe modificar manualmente en esta sección de código.
						
						//debugger;
						// Aplica solo para PRUEBAS
						//if (JumpStartLibXRM.Fx.getUserId().replace(/[{}]/g, "") == "8B4CF48E-AAAD-EB11-8236-0022489BAFB9") //JM
						//{ 
							if (detalleOperacionID[0].id.replace(/[{}]/g, "").toLowerCase() == CasoAdquirencia.Form.DOA_0037.toLowerCase())
							{
								id = CasoAdquirencia.Form.DOA_0037_FS_Etapa001;
								name = "Recepcionar Requerimiento";
							}
						//}
						
                        var entityType = response.erEtapa.entityName;
                        var etapa = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    }
                    
                    //actualizar flujo
                    if(response.erFlujoSantander){
                        var fieldName = "xmsbs_flujosantander";
                        var id = response.erFlujoSantander.id;
                        var name = response.erFlujoSantander.name;
                        var entityType = response.erFlujoSantander.entityName;
                        var flujo = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    }
    
                    //Estado
                    var estado = response.razonEstado;
                    if(estado){
                        JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", estado);
						
						//debugger;
						// Aplica solo para PRUEBAS
						//if (JumpStartLibXRM.Fx.getUserId().replace(/[{}]/g, "") == "8B4CF48E-AAAD-EB11-8236-0022489BAFB9") //JM
						//{ 
							if (detalleOperacionID[0].id.replace(/[{}]/g, "").toLowerCase() == CasoAdquirencia.Form.DOA_0037.toLowerCase())
							{
								JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", 1);
							}
						//}						
                    }
                    
                    //Responsable - lookup
                    if(response.erResponsable){
                        var fieldName = "ownerid";
                        var id = response.erResponsable.id;
                        var name = response.erResponsable.name;
                        var entityType = response.erResponsable.entityName;
                        var flujo = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    }
    
                    //Rol - lookup
                    if(response.erRol != null){
                        if(response.erRol.name != ""){
                            var fieldName = "xmsbs_rol";
                            var id = response.erRol.id;
                            var name = response.erRol.name;
                            var entityType = response.erRol.entityName;
                            var flujo = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                        }
                    }
                    
                    //UR - lookup
                    if(response.erUR){
                        var fieldName = "xmsbs_ur";
                        var id = response.erUR.id;
                        var name = response.erUR.name;
                        var entityType = response.erUR.entityName;
                        var flujo = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    }
                    
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_ingresounicofinalizado", true);
                    
                    if (response.erFlujoSantander == null || response.erEtapa == null){
                        executionContext.getEventArgs().preventDefault();
                        var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "La tipología seleccionada no tiene una configuracion de flujo, por lo que no se puede crear Caso. Favor contactarse con el administrador de la plataforma"};
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
                else {
                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "La tipología seleccionada no tiene una configuracion de flujo, por lo que no se puede crear Caso. Favor contactarse con el administrador de la plataforma"};
                    var alertOptions = { height: 120, width: 260 };
                    executionContext.getEventArgs().preventDefault();
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
            catch (e) {
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "Problema de Comunicación con Api, no se puede crear el Caso. Favor contactarse con el administrador de la plataforma"};
                var alertOptions = { height: 120, width: 260 };
                executionContext.getEventArgs().preventDefault();
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
        else {
            //var formContext = executionContext.getFormContext();
            //CasoAdquirencia.EnviarNotificacionCierreCasoAdquirencia(executionContext, formContext.data.entity.getId());                       
        }
        //Refresh del form
        //var globalFormContext = executionContext.getFormContext(); 
        //        globalFormContext.data.refresh(true);
	},
	
//===========================
//FUNCIONES PARA SER LLAMADAS
//===========================
	crearCasoNEO: function (executionContext){
        //debugger;
        var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);               
        var _esCreacion = true;
        var _comentario = "Ingreso Midas";
        var _casoCreadoNeo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_casocreadoneo", false); 
        
        if (incidentId.indexOf("{") > -1)
        {
            incidentId = incidentId.substring(1, 37);
        }        
        
        var ApiKey = CasoAdquirencia.buscarApiKey(executionContext);
        var AzureURL = CasoAdquirencia.buscarAzureURL(executionContext);
        
        if(!_casoCreadoNeo && ApiKey != null && AzureURL != null)
        {   
            var response = null;
            var ApiUrl = "Caso/CreateCasosNEO?idIncident=" + incidentId + "&esCreacion=" + _esCreacion + "&comentario=" + _comentario;
                        
            var service = CasoAdquirencia.GetRequestObject();

            if (service != null)
            {
                service.open("POST", AzureURL.value[0].xmsbs_valor + ApiUrl, false);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader(CasoAdquirencia.ApiKey.Name, ApiKey.value[0].xmsbs_valor);
                service.send(null);
                
                if (service.response != "") 
                {
                    response = JSON.parse(service.response);
                }
            }
            
            if (response)
            {
                var _resultado = response.success;
                var _mensaje = response.message;
            }
        }
	},
    
	//Funcion para los onChange de los campos - Se debe llamar dentro de camposSeccionesEtapa
	ReglasDeNegocio: function (executionContext, etapaID){
		CasoAdquirencia.onChange_TipoResolucion(executionContext);
        CasoAdquirencia.checkIndicadorQuebranto(executionContext);
		CasoAdquirencia.onChange_Nomodificar(executionContext);
		CasoAdquirencia.investigacion(executionContext);
        CasoAdquirencia.casoRobo(executionContext);   
        CasoAdquirencia.casoMeArrepenti(executionContext);
		//CasoAdquirencia.onChange_Quebranto(executionContext);
        CasoAdquirencia.onChange_region(executionContext);
        CasoAdquirencia.onChange_conteosegmento(executionContext);
		CasoAdquirencia.ValidaReiteradoEnCreacion(executionContext);
		CasoAdquirencia.visualizacionReiteradoCasoPrincipal(executionContext);
	},
	
	camposSeccionesEtapa: function (executionContext, etapaID){
		//debugger;
        var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado)
		{
            if(!etapaID){
                var etapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
                if(etapaID)
                {
                    if (etapaID.indexOf("{") > -1)
                    {
                        etapaID = etapaID.substring(1, 37);
                    }
                }                
            }
			
			if(etapaID)
			{
                //hacemos odata que consulta para el producto el requerimiento que corresponde
                CasoAdquirencia.MostraroDataCamposSecciones(executionContext, etapaID);
                
                var etapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
                if(etapaID && estado != 1){
                    executionContext.getFormContext().ui.tabs.get("general").sections.get("documentos").setVisible(true);
                }
               
                if(etapaID){
                    
                    CasoAdquirencia.MostraroDataSecciones(executionContext, etapaID);
                    //CasoIngresoCRM.SeccionGrilla(executionContext, etapaID);
					CasoAdquirencia.SeccionSucursalesMultiples(executionContext, etapaID);
                }				
			}
			else
			{
				//alert("Para ejecutar la validación, es necesario contar con un caso asociado");
			}
		}
        //Llamar las reglas de negocio
        CasoAdquirencia.ReglasDeNegocio(executionContext);
//        debugger;
//        CasoAdquirencia.casoRobo(executionContext); 
        
	},	

	terminaEnNumero: function (nombreCampo){
		var aux = nombreCampo.substring(nombreCampo.length - 1, nombreCampo.length);
		if (!isNaN(aux))
		{
			return nombreCampo.substring(0, nombreCampo.length - 1);
		}
		return nombreCampo;
	},
	
	/*visualizacionCasoPrincipal: function (executionContext)
	{
		var casoPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
		if (casoPrincipal)
		{
			JumpStartLibXRM.Fx.showField(executionContext, "parentcaseid");
			JumpStartLibXRM.Fx.disableField(executionContext, "parentcaseid");
		}
		else
		{
			JumpStartLibXRM.Fx.hideField(executionContext, "parentcaseid");
		}
	},*/
	
	origenCasoBloqueo: function (executionContext){
        //debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '1')
		{
			var datosOrigen = CasoAdquirencia.datosOrigen(executionContext, CasoAdquirencia.codigoOrigen.CRM);
			if (datosOrigen)
			{
				if (datosOrigen.value[0].xmsbs_origenid != null)
				{
					var origenId = datosOrigen.value[0].xmsbs_origenid;
				}
				else
				{
					var origenId = null;
				}
				if (datosOrigen.value[0].xmsbs_name != null)
				{
					var origenName = datosOrigen.value[0].xmsbs_name;
				}
				else
				{
					var origenName = null;
				}
			}
			if (origenId != null && origenName != null)
			{
				var origenEntityType = "xmsbs_origen";
				JumpStartLibXRM.Fx.setLookupValue(executionContext, "xmsbs_origen", origenId, origenName, origenEntityType);
				JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_origen");
			}
		}
		else
		{
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_origen");
		}
	},	

	puntoContactofiltro: function (executionContext){
		var fetchXml = "<filter type='and'><condition attribute='xmsbs_tiporeclamo' operator='eq' value='657130000' /><condition attribute='xmsbs_origenname' operator='like' value='%CRM Adquirencia%' /></filter>";
		executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addCustomFilter(fetchXml);
	},

	puntoContactoBloqueo: function (executionContext){
		//debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '1')
		{
            var datospuntocontacto = CasoAdquirencia.datospuntocontacto(executionContext, CasoAdquirencia.codigopuntocontacto.ContactAdq);
            if (datospuntocontacto)
            {
                if (datospuntocontacto.value[0].xmsbs_puntocontactoid != null)
                {
                    var canalId = datospuntocontacto.value[0].xmsbs_puntocontactoid;
                }
                else
                {
                    var origenId = null;
                }
                if (datospuntocontacto.value[0].xmsbs_name != null)
                {
                    var canalName = datospuntocontacto.value[0].xmsbs_name;
                }
                else
                {
                    var origenName = null;
                }
            }
            
            // debugger;
            var origenEntityType = "xmsbs_puntocontacto";
            //JumpStartLibXRM.Fx.setLookupValue(executionContext, "xmsbs_puntodecontacto", canalId, canalName, origenEntityType);
		}
		else
		{
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_puntodecontacto");
		}
	},	
    
	ocultarFichaSecciones: function (formContext){        
        formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false); //Botonera
        formContext.ui.tabs.get("tab_16").setVisible(false); //Respuesta a cliente
        formContext.ui.tabs.get("tab_12").setVisible(false); //Informacion Adicional
        formContext.ui.tabs.get("tab_10").setVisible(false); //Subrequerimientos
        formContext.ui.tabs.get("tab_11").setVisible(false); //Seguimiento del caso 
        formContext.ui.tabs.get("tab_17").setVisible(false); //Publicaciones
        formContext.ui.tabs.get("tab_15").setVisible(false); //Articulos de conocimiento 
        formContext.ui.tabs.get("tab_14").setVisible(false); //Registros de visación
        formContext.ui.tabs.get("tab_18").setVisible(false); //Casos por Cliente y UR
        formContext.ui.tabs.get("tab_21").setVisible(false); //Casos por Comercio y UR
        
        //ocultamos la sección de ingreso general
        formContext.ui.tabs.get("general").sections.get("ingresoinicial").setVisible(true); //Información inicial
        formContext.ui.tabs.get("general").sections.get("general_section_7").setVisible(false); //Información inicial 2
	},

    mostrarFichaSecciones: function (executionContext, formContext){
        formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true); //Botonera
        formContext.ui.tabs.get("tab_16").setVisible(false); //Respuesta a cliente
        formContext.ui.tabs.get("tab_12").setVisible(false); //Informacion Adicional
        formContext.ui.tabs.get("tab_11").setVisible(true); //Seguimiento del caso 
        formContext.ui.tabs.get("tab_17").setVisible(true); //Publicaciones
        formContext.ui.tabs.get("tab_15").setVisible(false); //Articulos de conocimiento 
        formContext.ui.tabs.get("tab_14").setVisible(false); //Registros de visación
        formContext.ui.tabs.get("tab_18").setVisible(true); //Casos por Cliente y UR
        formContext.ui.tabs.get("tab_21").setVisible(true); //Casos por Comercio y UR
        
        //ocultamos la sección de ingreso general
        formContext.ui.tabs.get("general").sections.get("ingresoinicial").setVisible(false); //Información inicial
        formContext.ui.tabs.get("general").sections.get("general_section_7").setVisible(true); //Información inicial 2
        
        //Si estamos en reparo o visación, mostramos la sección de observaciones de visación
        var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);        
        if(estado == 3 || estado == 657130000){ //En reparo o en visación
            formContext.ui.tabs.get("general").sections.get("tab_13_section_4").setVisible(true); //Observaciones de visación
        }
        else{
            formContext.ui.tabs.get("general").sections.get("tab_13_section_4").setVisible(false); //Observaciones de visación
        }
        
        //Veamos si se muestra o no la seccion de subrequerimientos
        var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
        if(incidentId){
            var respuesta = CasoAdquirencia.buscarSubrequerimientos(executionContext, incidentId);
            if(respuesta.value.length){
                formContext.ui.tabs.get("tab_10").setVisible(true); //Subrequerimientos
            }
            else{
                formContext.ui.tabs.get("tab_10").setVisible(false); //Subrequerimientos
            }
        }

        //Ocultamos el cuestionario
        //formContext.ui.tabs.get("general").sections.get("seccion_preguntascaso").setVisible(false); //Preguntas del caso
        
        //Si el caso es de hipotecario, mostramos la sección de integraciones hipotecario
        var productoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_producto");
        var puntoContactoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_puntodecontacto");
        if(productoName.toLowerCase().indexOf("hipotecario") != -1){
            if(puntoContactoName.toLowerCase().indexOf("cmf") != -1 || puntoContactoName.toLowerCase().indexOf("abif") != -1 || puntoContactoName.toLowerCase().indexOf("sernac") != -1 || puntoContactoName.toLowerCase().indexOf("alta") != -1){
                formContext.ui.tabs.get("tab_20").setVisible(false); //Integraciones de hipotecario
            }
            else{
                formContext.ui.tabs.get("tab_20").setVisible(true); //Integraciones de hipotecario
            }
        }
        else{
            formContext.ui.tabs.get("tab_20").setVisible(false); //Integraciones de hipotecario
        }
	},

    bloqueacamposdeinicio: function (executionContext){
         JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_comercio");
         JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursal");
         JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_producto");
         JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_detalledetipologia");
         JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_solucionesperada");
         JumpStartLibXRM.Fx.disableField(executionContext, "description");
         JumpStartLibXRM.Fx.disableField(executionContext, "prioritycode");
         JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_preferenciasdecontacto");
         JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_telefonocelular");
         JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_emailcliente");
    },
	
	metodoParaNotificar: function (executionContext){
		//debugger;
        var preferenciasContacto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_preferenciasdecontacto", null);
		if (!preferenciasContacto)
		{
			var alertStrings = { confirmButtonLabel: "Aceptar", title: "Metodo de notificación", text: "Recuerde seleccionar al menos una opcion de notificación para el cliente"};
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
	
	BloquearObservacionesYSolucion: function (executionContext){
		//debugger;
		var etapa = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_etapa", null);
		if(etapa)
		{
			var etapaId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
			var respuesta = CasoAdquirencia.datosEtapa(executionContext, etapaId);
			if (respuesta)
			{
                if(respuesta.xmsbs_orden != 1)
                {
                    //Si no es Etapa 1, entonces bloqueo los campos 
					JumpStartLibXRM.Fx.disableField(executionContext, "description1");
					JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_solucionesperada1");
                }				
			}
		}
	},

	BloquearCamposDespuesDeCrear: function (executionContext){
		JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_origen");
		JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_puntodecontacto");
	},
	
    ValidaReiteradoEnCreacion:function(executionContext){
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
        if(marcaReiterado){
            if (tipoFormulario == '1' || tipoFormulario == '3' || tipoFormulario == '4'){
                //Si el Caso se está creando, y además es reiterado, la parte de campos especificos debe estar bloqueado
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
            }
            else{
                if (tipoFormulario == '2'){
                    //Si ya está creado y en edición, y además en reiterado, debemos ver si estamos en la etapa 1 y bloquear los campos
                    var etapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
                    if (etapaID.indexOf("{") > -1){etapaID = etapaID.substring(1, 37);}
                    var resultado = CasoAdquirencia.datosOrdenEtapa(executionContext, etapaID);
                    if(resultado){
                        if(resultado.xmsbs_orden){
                            var orden = resultado.xmsbs_orden;
                            if(orden == 1 || orden == "1"){
                                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
                            }
                        }
                    }
                }
            }
        }
    },	

    visualizacionReiteradoCasoPrincipal: function (executionContext){
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        if (tipoFormulario != '1'){
            var casoPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
            if (casoPrincipal){
                //Mostramos la Seccion de reiterado y subrequerimiento
                var formContext = executionContext.getFormContext();
                formContext.ui.tabs.get("general").sections.get("seccion_subrequerimiento").setVisible(true);
                
                //Validamos además si viene con la marca de reiterado
                var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
                if(marcaReiterado){
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_marcareiterado");
                }
                else{
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_marcareiterado");
                }
            }
            else{
                //Ocultamos la sección
                var formContext = executionContext.getFormContext();
                formContext.ui.tabs.get("general").sections.get("seccion_subrequerimiento").setVisible(false);
            }
        }
    },	
	
	SetStockActual: function (executionContext, campoCantidad){
		//debugger;
		if (!CasoAdquirencia.Form.oDetalleOperacion)
		{
			// lee el Detalle de Operación
			var DOid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
			if(!DOid)
				return;
			
			CasoAdquirencia.Form.oDetalleOperacion = CasoAdquirencia.buscarDetalleOperacion(executionContext, DOid);
		}
		
		// solo aplica si en el Detalle de Operación se indica un "ID Stock Adquirencia"
		if (!CasoAdquirencia.Form.oDetalleOperacion.xmsbs_idstockadquirencia)
			return; 

		if (campoCantidad != CasoAdquirencia.Form.oDetalleOperacion.xmsbs_campocantidadsolicitada)
			return;

		//debugger; 
		
		var oStockAdquirencia = CasoAdquirencia.oDataGetStockActual(executionContext, CasoAdquirencia.Form.oDetalleOperacion.xmsbs_idstockadquirencia);
		if (!oStockAdquirencia || oStockAdquirencia.value.length == 0)
			return; // siempre debe existir si es que está indicado en el DO
		
		var CantidadProducto = oStockAdquirencia.value[0].xmsbs_cantidad;
		var NombreProducto = oStockAdquirencia.value[0].xmsbs_name;
		
		//// setear campo: Cantidad Stock A35 (xmsbs_entero1g), solo si es distinto del valor actual.
		//var ValorActual = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_entero1g", null);
		//if (ValorActual == null || ValorActual != CantidadProducto){
		//	JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_entero1g", CantidadProducto);	
		//}
		
		// no tiene sentido setear un campo con el valor actual del stock, ya que este campo está vivo, y puede cambiar en cualquier momento debido a otros Casos.
		// mejor es mostrar una notificación, y además se debe aclarar que es un valor referencial.
		var FullDateNow = JumpStartLibXRM.Fx.getDateNOW_ddmmaaaa_hhmmss();
		JumpStartLibXRM.Fx.setFormNotification(executionContext, "WARNING", "Stock actual " + NombreProducto + ": " + CantidadProducto + " unidades. (última lectura: " + FullDateNow + ")", "NOT_StockAdquirencia");
		// INFO, WARNING, ERROR  ; Se deja WARNING porque INFO no llama la atención.
	},
	
	CampoObservacionesReparar: function (executionContext){
		//Funcion para las observaciones al reparar un caso 
		var obs = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_observacionesdevisacion", null);
		if(obs)
		{
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_observacionesdevisacion");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_observacionesdevisacion");
		}
	},

    getComercioUnico:function(executionContext,contacto){
        //debugger;
        var contactId = contacto.contactid;
        var resultado = CasoAdquirencia.oDataGetComercios(executionContext,contactId);
        if(resultado){
            if(resultado.value.length == 0)
            {
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "El Rut ingresado no tiene ningun comercio asociado, Por favor solicitar su regulación para poder crear un caso", title: "ERROR" };
					var alertOptions = { height: 120, width: 260 };
					Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
						function (success) {
							//console.log("Alert dialog closed");
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rut", null);
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_comercio");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursal");
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrecliente", null);
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidopaterno", null);
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidomaterno", null);
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", null);
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_emailcliente", null);
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_cargoqueejerceenelcomercio", null);
						},
						function (error) {
							//console.log(error.message);
						}
					);
            }
            if(resultado.value.length == 1){
                //Siginifica que viene solo 1 comercio y lo podemos prepopular
                var cuentaId = resultado.value[0].accountid;
                var cuentaName = resultado.value[0].name;
                
                //Seteamos el lookup de comercio		
                var id = cuentaId;
                var name = cuentaName;
                var entityType = "account";
                var fieldName = "xmsbs_comercio";
                JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_comercio");
                
                //CasoAdquirencia.getSucursalUnico(executionContext,contacto,cuentaId);
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_sucursal");
            }
            else{
                if(resultado.value.length > 1){
                    //Hay mas de un comercio. Hay que prefiltrar
                    executionContext.getFormContext().getControl("xmsbs_comercio").addPreSearch(CasoAdquirencia.filtrarLookupComercio);
                    
                }
            }
        }
        
        var comercioid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_comercio");
        
        if(comercioid)
        {
            comercioid = comercioid.slice(1,-1);
            var rutcomercio = CasoAdquirencia.obtenerRutComercio(executionContext, comercioid);
            
            if(rutcomercio)
            {
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rutcomercio", rutcomercio);
            }     
        }
    },

    getSucursalUnico:function(executionContext,contacto,comercio){
        var contactId = contacto.contactid;
        var resultado = CasoAdquirencia.oDataGetSucursales(executionContext,contactId,comercio);
        if(resultado){
            if(resultado.value.length == 1){
                //Siginifica que viene solo 1 comercio y lo podemos prepopular
                var sucursalId = resultado.value[0].xmsbs_sucursalid;
                var sucursalName = resultado.value[0].xmsbs_name;
                
                //Seteamos el lookup de comercio		
                var id = sucursalId;
                var name = sucursalName;
                var entityType = "xmsbs_sucursal";
                var fieldName = "xmsbs_sucursal";
                var fieldName2 = "xmsbs_sucursalendondeseinstalaranuevopos";
                JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName2, id, name, entityType);
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursal");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursalendondeseinstalaranuevopos");
            }
            else{
                if(resultado.value.length > 1){
                    //Hay mas de un comercio. Hay que prefiltrar
                    //executionContext.getFormContext().getControl("xmsbs_sucursal").addPreSearch(CasoAdquirencia.filtrarLookupSucursal);
                    //executionContext.getFormContext().getControl("xmsbs_sucursalendondeseinstalaranuevopos").addPreSearch(CasoAdquirencia.filtrarLookupSucursal);
                }
                
            }
        }
        var sucursalId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_sucursal");
        if(sucursalId)
        {
             sucursalId = sucursalId.slice(1,-1);
            var nsucursal = CasoAdquirencia.obtenerNsucursal(executionContext, sucursalId);
            
            if(nsucursal)
            {
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nsucursal", nsucursal);
            }    
        }
    },
	
	//Función para desplegar iconos simulando un semaforo en un campo especifico de una vista no editable.
	displayIconTooltip: function (rowData, userLCID){
        //debugger;
		var str = JSON.parse(rowData);
		var coldata = str.xmsbs_estadosla_Value;
		var imgName = "";
		var tooltip = "";
		switch (coldata)
		{
			case 1:
				imgName = "xmsbs_verde16";
				tooltip = "En Curso";
				break;
			case 2:
				imgName = "xmsbs_amarillo16";
				tooltip = "Por Vencer";
				break;
			case 3:
				imgName = "xmsbs_verde16";
				tooltip = "Correcto";
				break;
			case 4:
				imgName = "xmsbs_rojo16";
				tooltip = "Vencido";
				break;	
			case 5:
				imgName = "xmsbs_rojo16";
				tooltip = "Cancelado";
				break;		
			case 6:
				imgName = "xmsbs_verde16";
				tooltip = "En Pausa";
				break;					
			default:
				imgName = "";
				tooltip = "";
				break;
		}
		var resultarray = [imgName, tooltip];
		return resultarray;
	},	
	

	//============================================
	//LLAMADAS CRUD (CREATE, READ, UPDATE, DELETE)
	//============================================
	
	
	datosCliente: function (executionContext, clienteId)	{
		//Preparamos la consulta
		var entityType = "contact";
		var entityId = clienteId;
		var query = "emailaddress1,mobilephone,telephone1,telephone2,xmsbs_email,xmsbs_push,xmsbs_sms,xmsbs_clientenorequierenotificacion";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},	
	
	datosOrigen: function (executionContext, codigoOrigen)	{
		var entityType = "xmsbs_origen";
		var query = "$select=xmsbs_codigo,xmsbs_name,xmsbs_origenid";
		query += "&$filter=xmsbs_codigo eq '" + codigoOrigen + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},

	datospuntocontacto: function (executionContext, codigopuntocontacto)	{
		var entityType = "xmsbs_puntocontacto";
		var query = "$select=xmsbs_codigo,xmsbs_name,xmsbs_puntocontactoid";
		query += "&$filter=xmsbs_codigo eq '" + codigopuntocontacto + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},

    datosTipoDetalleOp: function (executionContext, tipoDetalleID)	{
		//Preparamos la consulta
		var entityType = "xmsbs_tipoydetalledeoperacion";
		var entityId = tipoDetalleID;
		var query = "xmsbs_tiporequerimiento,xmsbs_TipodeOperacion,xmsbs_detalledeoperacion";
		var expand = "xmsbs_tiporequerimiento($select=xmsbs_name,xmsbs_tiporequerimientoid),xmsbs_TipodeOperacion($select=xmsbs_name,xmsbs_tipooperacionid),xmsbs_detalledeoperacion($select=xmsbs_name,xmsbs_detalleoperacionid)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
	},
    
    datosInstitucionPorTipoReq: function (executionContext, tipoReqID)	{
        //Preparamos la consulta
		var entityType = "xmsbs_tiporequerimientos";
		var entityId = tipoReqID;
		var query = "xmsbs_institucion";
		var expand = "xmsbs_institucion($select=xmsbs_name,xmsbs_institucionid)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
    },
	
    datosOrdenEtapa: function (executionContext, etapaID) {
        //Preparamos la consulta
        var entityType = "xmsbs_etapas";
        var entityId = etapaID.replace(/[{}]/g, "");
        var query = "xmsbs_etapaid,xmsbs_orden";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
        return resultado;
    },	
    
    datosTipoDetalle: function (executionContext, tipoDetalleId)	{
		//Preparamos la consulta
		var entityType = "xmsbs_tipoydetalledeoperacion";
		var entityId = tipoDetalleId;
		var query = "xmsbs_TipodeOperacion,xmsbs_detalledeoperacion";
		var expand = "xmsbs_TipodeOperacion($select=xmsbs_name,xmsbs_tipooperacionid),xmsbs_detalledeoperacion($select=xmsbs_name,xmsbs_detalleoperacionid)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
	},
    
    oDataCamposSecciones: function (executionContext, etapaId)	{
        var entityType = "xmsbs_campo";
		var query = "$select=xmsbs_campoid,xmsbs_visible,xmsbs_tipocampo,xmsbs_requerido,xmsbs_predeterminado,xmsbs_nombremostrar,xmsbs_nombreesquema,xmsbs_name,xmsbs_lectura,xmsbs_label,xmsbs_borrar";
		query += "&$filter=statecode eq 0 and _xmsbs_etapa_value eq '" + etapaId + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },
    
    oDataSecciones: function (executionContext, etapaId)	{
        var entityType = "xmsbs_seccion";
		var query = "$select=xmsbs_name,xmsbs_etiqueta,xmsbs_tab,xmsbs_etapa,xmsbs_lectura,xmsbs_visible";
		query += "&$filter=statecode eq 0 and _xmsbs_etapa_value eq '" + etapaId + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },
    
    buscarFlujoDelDetalle: function(executionContext, detalleOperacionID){
        //Preparamos la consulta
		var entityType = "xmsbs_detalleoperacion";
		var entityId = detalleOperacionID;
		var query = "_xmsbs_flujosantander_value";
		//var expand = "xmsbs_flujosantander($select=xmsbs_name,xmsbs_tiporequerimientoid)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
		return resultado;
    },
	
    buscarDetalleOperacion: function(executionContext, detalleOperacionID){
        //Preparamos la consulta
		var entityType = "xmsbs_detalleoperacion";
		var entityId = detalleOperacionID.replace(/[{}]/g, "");
		var query = "xmsbs_tiporeclamo,xmsbs_quebranto,xmsbs_idstockadquirencia,xmsbs_campocantidadsolicitada";
		//var expand = "xmsbs_flujosantander($select=xmsbs_name,xmsbs_tiporequerimientoid)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
		return resultado;
    },	
    
    buscarEtapaInicial: function (executionContext, flujoDelProcesoID)	{
        var entityType = "xmsbs_etapa";
		var query = "$select=xmsbs_etapaid,xmsbs_name";
		query += "&$filter=_xmsbs_flujosantander_value eq '" + flujoDelProcesoID + "' and xmsbs_orden eq 1";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },
	
	datosEtapa: function (executionContext, etapaId)	{
		//Preparamos la consulta
		var entityType = "xmsbs_etapa";
		var entityId = etapaId;
		{
			entityId = entityId.substring(1, 37);
		}
		var query = "xmsbs_orden";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},		
    
    buscarSubrequerimientos: function (executionContext, incidentId)	{
        var entityType = "incident";
		var query = "$select=title";
		query += "&$filter=_parentcaseid_value eq '" + incidentId + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },
	
    datosUsuario: function (executionContext, PropietarioId)	{
		//_xmsbs_institucion_value
		//Preparamos la consulta
		var entityType = "systemuser";
		var entityId = PropietarioId;
		{
			entityId = PropietarioId.substring(1, 37);
		}
		var query = "xmsbs_institucion";
		var expand = "xmsbs_institucion($select=xmsbs_name,xmsbs_institucionid)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
	},	
    
    buscarBitacoraEtapa: function (executionContext, incidentId)	{
        var entityType = "xmsbs_bitacoraetapa";
		var query = "$select=xmsbs_bitacoraetapaid,xmsbs_name,xmsbs_caso&$orderby=createdon desc";
		query += "&$filter=_xmsbs_caso_value eq '" + incidentId + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },	
    
    buscarDocumentosCaso: function (executionContext, idIncident)    {
        var entityType = "xmsbs_documento";
        var query = "$select=xmsbs_documentoid,xmsbs_obligatoriedad,xmsbs_id,xmsbs_name,xmsbs_caso";
        query += "&$filter=statecode eq 0 and _xmsbs_caso_value eq '" + idIncident + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarMetadatosRespuestaCaso: function (executionContext, idIncident)    {
        var entityType = "xmsbs_metadatoscartaformaleses";
        var query = "$select=xmsbs_metadatoscartaformalesid,xmsbs_nombrecontactosernac,xmsbs_prefijodestinatario,xmsbs_cargodestinatario,xmsbs_referenciacasosolicitante,xmsbs_telefonocontactobanco,xmsbs_tomarcontactocargo,xmsbs_tomarcontactonombre,xmsbs_derivadoa,xmsbs_correocontactobanco";
        query += "&$filter=_xmsbs_caso_value eq '" + idIncident + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarTipoDatoProducto: function (executionContext, idProducto)    {
        //Preparamos la consulta
		var entityType = "xmsbs_productoservicio";
		var entityId = idProducto;
		var query = "xmsbs_name,xmsbs_tipodedato";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
		return resultado;
    },
    
    datosPreguna2caso: function (executionContext, pregunta2caso)    {
        //Preparamos la consulta
        var entityType = "xmsbs_pregunta2delcaso";
        var entityId = pregunta2caso;
        var query = "_xmsbs_detalledeoperacion_value";
        
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
        return resultado;
    },

    buscaTipoDetalle: function (executionContext, detalleOperacionID)    {
        var entityType = "xmsbs_tipoydetalledeoperacion";
        var query = "$select=xmsbs_name,xmsbs_tipoydetalledeoperacionid";
        query += "&$filter=_xmsbs_detalledeoperacion_value eq '" + detalleOperacionID + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarCausasRaicesEspecificas: function (executionContext,DetalleOperacionID){
        var entityType = "xmsbs_causaraiztipificacion";
        var query = "$select=xmsbs_causaraiz";
        query += "&$filter=_xmsbs_detalledeoperacion_value eq '" + DetalleOperacionID + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarCasosClienteUR: function (executionContext,idCliente, idUR){
        var entityType = "incident";
        var query = "$select=ticketnumber,ownerid,statecode,statuscode,createdon,title,_xmsbs_cliente_value,xmsbs_rut,xmsbs_numerocorrelativo,_xmsbs_ur_value,_xmsbs_producto_value,_xmsbs_tipodeoperacion_value,_xmsbs_detalledeoperacion_value,_xmsbs_detalledetipologia_value,_xmsbs_tipoderequerimiento_value&$orderby=createdon desc";
        query += "&$filter=xmsbs_ingresounicofinalizado eq true and _xmsbs_cliente_value eq '" + idCliente + "' and _xmsbs_ur_value eq '" + idUR + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarCasosComercioUR: function (executionContext,idComercio, idUR){
        var entityType = "incident";
        var query = "$select=ticketnumber,ownerid,statecode,statuscode,createdon,title,_xmsbs_cliente_value,xmsbs_rut,xmsbs_numerocorrelativo,_xmsbs_ur_value,_xmsbs_producto_value,_xmsbs_tipodeoperacion_value,_xmsbs_detalledeoperacion_value,_xmsbs_detalledetipologia_value,_xmsbs_tipoderequerimiento_value,_xmsbs_comercio_value&$orderby=createdon desc";
        query += "&$filter=_xmsbs_comercio_value eq '" + idComercio + "' and _xmsbs_ur_value eq '" + idUR + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarProducto: function (executionContext, idProducto)	{
		//Preparamos la consulta
		var entityType = "xmsbs_productoservicio";
		var entityId = idProducto;
		var query = "xmsbs_name";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},	
    
    buscarTipoRequerimiento: function (executionContext, idTipoRequerimiento)	{
		//Preparamos la consulta
		var entityType = "xmsbs_tiporequerimiento";
		var entityId = idTipoRequerimiento;
		var query = "xmsbs_name";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarTipoOperacion: function (executionContext, idTipoOperacion)	{
		//Preparamos la consulta
		var entityType = "xmsbs_tipooperacion";
		var entityId = idTipoOperacion;
		var query = "xmsbs_name";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarTipoYDetalleOperacion: function (executionContext, idTipoYDetalle)	{
		//Preparamos la consulta
		var entityType = "xmsbs_tipoydetalledeoperacion";
		var entityId = idTipoYDetalle;
		var query = "xmsbs_name";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarComercio: function (executionContext, idComercio)	{
        //debugger;
		//Preparamos la consulta
		var entityType = "account";
		var entityId = idComercio;
		var query = "accountnumber";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarSegmentoComercio: function (executionContext, idComercio)	{
        //debugger;
		//Preparamos la consulta
		var entityType = "account";
		var entityId = idComercio;
		var query = "xmsbs_segmento";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarSucursal: function (executionContext, idSucursal)	{
        //debugger;
		//Preparamos la consulta
		var entityType = "xmsbs_sucursal";
		var entityId = idSucursal;
		var query = "xmsbs_nsucursal";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarApiKey: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + CasoAdquirencia.ApiKey.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
    buscarAzureURL: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + CasoAdquirencia.URL.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
    oDataGetComercios: function (executionContext, contactid){
        var entityType = "accounts";
        var query = "$select=name,accountid";
        query += "&$expand=xmsbs_account_xmsbs_contactocomercialdelasucursal_comercio($filter=(_xmsbs_contacto_value eq "+contactid+"))&$filter=(xmsbs_account_xmsbs_contactocomercialdelasucursal_comercio/any(o1:(o1/_xmsbs_contacto_value eq "+contactid+")))&$orderby=name asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },

    oDataGetSucursales: function (executionContext, contactid, comercioid){
        var entityType = "xmsbs_sucursals";
        var query = "$select=xmsbs_sucursalid,xmsbs_name";
        query += "&$expand=xmsbs_xmsbs_sucursal_xmsbs_contactocomercialdelasucursal_sucursal($filter=(_xmsbs_contacto_value eq "+contactid+"))&$filter=(_xmsbs_comercio_value eq "+comercioid+") and (xmsbs_xmsbs_sucursal_xmsbs_contactocomercialdelasucursal_sucursal/any(o1:(o1/_xmsbs_contacto_value eq "+contactid+")))&$orderby=xmsbs_name asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
	
	oDataGetStockActual: function(executionContext, idStock){
		// idStock = Código Stock
		var entityType = "xmsbs_stockadquirencias";
        var query = "$select=xmsbs_name, xmsbs_cantidad";
        query += "&$filter=(xmsbs_idstock eq '" + idStock + "')";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () {});
        return resultado;
	},
    
    MostraroDataCamposSecciones: function (executionContext, etapaId){
        //debugger;
        var respuesta = new Array();
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_campo", "?$select=xmsbs_borrar,xmsbs_campoid,xmsbs_label,xmsbs_lectura,xmsbs_name,xmsbs_nombreesquema," + 
											"xmsbs_nombremostrar,xmsbs_predeterminado,xmsbs_requerido,xmsbs_tipocampo,xmsbs_visible,xmsbs_fncjsonchange,xmsbs_integracion,xmsbs_valoreseningresoformunico" + 
											"&$filter=_xmsbs_etapa_value eq '" + etapaId.replace(/[{}]/g, "") +"'").then(
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
                    respObj.xmsbs_integracion = results.entities[i]["xmsbs_integracion"];                    
                    respObj.xmsbs_valoreseningresoformunico = results.entities[i]["xmsbs_valoreseningresoformunico"];
                    respuesta.push(respObj);
                }
                //debugger;
                CasoAdquirencia.MostraroDataCamposSeccionesRespuesta(executionContext, respuesta);
                
				//Llamar las reglas de negocio
				CasoAdquirencia.ReglasDeNegocio(executionContext);  
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
    },
    
    MostraroDataSecciones : function (executionContext, etapaId){
        var respuestaSecciones = new Array();
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_seccion", "?$select=_xmsbs_etapa_value,xmsbs_etiqueta,xmsbs_lectura,xmsbs_name,xmsbs_tab,xmsbs_visible&$filter=_xmsbs_etapa_value eq '" +  etapaId.replace(/[{}]/g, "") + "'").then(
            function success(results) {
                //debugger;
                for (var i = 0; i < results.entities.length; i++) {
                 let respObj = new Object();
                    respObj._xmsbs_etapa_value = results.entities[i]["_xmsbs_etapa_value"];
                    respObj._xmsbs_etapa_value_formatted = results.entities[i]["_xmsbs_etapa_value@OData.Community.Display.V1.FormattedValue"];
                    respObj._xmsbs_etapa_value_lookuplogicalname = results.entities[i]["_xmsbs_etapa_value@Microsoft.Dynamics.CRM.lookuplogicalname"];
                    respObj.xmsbs_etiqueta = results.entities[i]["xmsbs_etiqueta"];
                    respObj.xmsbs_lectura = results.entities[i]["xmsbs_lectura"];
                    respObj.xmsbs_lectura_formatted = results.entities[i]["xmsbs_lectura@OData.Community.Display.V1.FormattedValue"];
                    respObj.xmsbs_name = results.entities[i]["xmsbs_name"];
                    respObj.xmsbs_tab = results.entities[i]["xmsbs_tab"];
                    respObj.xmsbs_visible = results.entities[i]["xmsbs_visible"];
                    respObj.xmsbs_visible_formatted = results.entities[i]["xmsbs_visible@OData.Community.Display.V1.FormattedValue"];
                    respuestaSecciones.push(respObj);
                }
                CasoAdquirencia.MostraroDataSeccionesRespuesta(executionContext, respuestaSecciones);
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        ); 
    },
	
	SeccionSucursalesMultiples : function (executionContext, etapaId){
		//debugger;
		var idDetalleOperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion", null);
		if (!idDetalleOperacion)
		{ return; } // No se logra obtener el detalle de operación.
	
		if (idDetalleOperacion.replace(/[{}]/g, "").toLowerCase() != CasoAdquirencia.Form.DOA_0037.toLowerCase())
		{ return; } // El DO debe ser: DOA-0037
	
		var TipoFormulario = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (TipoFormulario == JumpStartLibXRM.FormState.CREATE)
		{ return; } 
	
		// Siempre muestra la grilla
		var formContext = executionContext.getFormContext();
		formContext.ui.tabs.get("general").sections.get("seccion_sucursalesequipos").setVisible(true);

		// Aplica solo para PRUEBAS
		//if (JumpStartLibXRM.Fx.getUserId().replace(/[{}]/g, "") != "8B4CF48E-AAAD-EB11-8236-0022489BAFB9") //JM
		//{ return; }	
	
		if (TipoFormulario != JumpStartLibXRM.FormState.UPDATE)
		{ return; } // Solo aplica para UPDATE		
		
		// El botón solo se muestra si la etapa es 01
		if (etapaId.replace(/[{}]/g, "").toLowerCase() == CasoAdquirencia.Form.DOA_0037_FS_Etapa001.toLowerCase())
		{ 
			var wrSucursalesMultiples = formContext.getControl("WebResource_botonSucursalesEquipos");
			wrSucursalesMultiples.setVisible(true);	
		}
    },
    
    MostraroDataSeccionesRespuesta: function (executionContext, responseSeccion){   
        //debugger;  
        if (responseSeccion != null && responseSeccion.length >0)
        {
            var nombreTab = null;
            var nombreSeccion = null;
            var visibleOpcion = null;
            var lectura = null;
            var listaTabs = new Array();
            var nuevoTabs = true;
            var y = 0;
            //visualización de tabs - busca los distintos tabs u hace una lista
            for (var i = 0; i < responseSeccion.length; ++i)
            {
                nombreTab = responseSeccion[i].xmsbs_tab;
                for (var x = 0; x < listaTabs.length; ++x)
                {
                    if (listaTabs[x] == nombreTab)
                    {
                        nuevoTabs = false;
                    }
                }
                if (nuevoTabs)
                {
                    listaTabs[y] = nombreTab;
                    y = y + 1;
                }
                nuevoTabs = true;
            }
            //Por cada tabs encontrado se da visualización
            for (var i = 0; i < listaTabs.length; ++i)
            {
                executionContext.getFormContext().ui.tabs.get(listaTabs[i]).setVisible(true);
            }
            //VISUALIZACIÓN DE SECCIONES
            for (var i = 0; i < responseSeccion.length; ++i)
            {
                nombreTab = responseSeccion[i].xmsbs_tab;
                nombreSeccion = responseSeccion[i].xmsbs_name;
                visibleOpcion = responseSeccion[i].xmsbs_visible;
                lectura = responseSeccion[i].xmsbs_lectura;
                //visualización de la sección y su tab
                if (nombreTab != null && nombreSeccion != null && visibleOpcion != null)
                {
                    try
                    {
                        if (visibleOpcion)
                        {
                            executionContext.getFormContext().ui.tabs.get(nombreTab).sections.get(nombreSeccion).setVisible(true);
                        }
                        else
                        {
                            executionContext.getFormContext().ui.tabs.get(nombreTab).sections.get(nombreSeccion).setVisible(false);
                        }
                    }
                    catch (error)
                    {
                        //alert("La sección "+responseSeccion.listSecciones[i].etiqueta+" no se encuentra en el formulario");
                    }
                }
                else
                {
                    //alert("Falta información asociada a una sección");
                }
                //Solo lectura de la sección
                if (lectura != null)
                {
                    JumpStartLibXRM.Fx.enableOrdisableAllControlsInSection(executionContext, responseSeccion[i].xmsbs_etiqueta, lectura);
                }
                else
                {
                    JumpStartLibXRM.Fx.enableOrdisableAllControlsInSection(executionContext, responseSeccion[i].xmsbs_etiqueta, true);
                }
            }
        }       
    },
    
    crearAccionEjecutada: function (executionContext, modelo)    {
        //debugger;
        var bitacoraEtapaId = null;
        var accionEtapaId = null;
        var incidentId = modelo.casoId;
        
        if (incidentId.indexOf("{") > -1)
        {
            incidentId = incidentId.substring(1, 37);
        }
        
        var bitacoraEtapa = CasoAdquirencia.buscarBitacoraEtapa(executionContext, incidentId);
        if(bitacoraEtapa){
            if(bitacoraEtapa.value.length > 0){
                bitacoraEtapaId = bitacoraEtapa.value[0].xmsbs_bitacoraetapaid;
            }
        }
        
        var ownerId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
        if (ownerId.indexOf("{") > -1)
        {
            ownerId = ownerId.substring(1, 37);
        }
        
        if (modelo.accionEtapaId.indexOf("{") > -1)
        {
            accionEtapaId = modelo.accionEtapaId.substring(1, 37);
        }
        
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = dd + '-' + mm + '-' + yyyy;

        //Creamos el objeto
        var objeto = {};
        objeto["xmsbs_name"] = modelo.accionEtapaNombre + " " + today;
        objeto["ownerid@odata.bind"] = "/systemusers(" + ownerId + ")";
        objeto["xmsbs_accionetapa@odata.bind"] = "/xmsbs_accionetapas("+ modelo.accionEtapaId +")";
        
        if(bitacoraEtapaId)
        {
            objeto["xmsbs_bitacoraactual@odata.bind"] = "/xmsbs_bitacoraetapas("+ bitacoraEtapaId +")";
        }
        
        //Entidad
        var entity = "xmsbs_accionesejecutadases";
        
        //Creamos los registros de autorizadores
        var resultado = SDK.WEBAPI.createRecord(executionContext, objeto, entity);
        if (resultado != null)
        {
            //alert("Se han creado los usuarios autorizadores");
        }
        else
        {
            //alert("Ha ocurrido un error al crear los usuarios autorizadores del reverso y castigo");
        }
    },
    
    validateDocumentos: function (executionContext, idIncident) {
        //debugger;
        var documentosCaso = CasoAdquirencia.buscarDocumentosCaso(executionContext, idIncident)
        if (!documentosCaso || documentosCasoAdquirencia.value.length === 0) {
            var ObjReturn = {}
            ObjReturn['success'] = true;
            ObjReturn['message'] = 'Ok';

            return ObjReturn;
        }
        else {
            var ObjReturn = {}
            var documentosObligatorios = 0;
            for (var i = 0; i < documentosCasoAdquirencia.value.length; i++) {
               if(documentosCasoAdquirencia.value[i].xmsbs_obligatoriedad && documentosCasoAdquirencia.value[i].xmsbs_id == null){
                    documentosObligatorios++;
                }
            }
            
            if (documentosObligatorios > 0) {
                ObjReturn['success'] = false;
                ObjReturn['message'] = 'Existen documentos obligatorios que no se han adjuntado al caso, no se puede continuar';
            }
            else {
                ObjReturn['success'] = true;
                ObjReturn['message'] = 'Ok';
            }
            

            return ObjReturn;
        }
    },
    
    validateBarraAcciones: function (executionContext) {
        //debugger;
        var ObjReturn = {}
            ObjReturn['success'] = true;
            ObjReturn['message'] = 'Ok';

        let _etapa = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_etapa", null);
        let _botoneraAcciones = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_botoneraaccionesobj", null);
        if ( _etapa == null  && _botoneraAcciones == null)
        {
            ObjReturn['success'] = false;
            ObjReturn['message'] = 'Caso no contiene el campo etapa, No se puede Generar Correo de Creación';
        }
        else if ( _etapa != null  && _botoneraAcciones == null )
        {
            ObjReturn['success'] = false;
            ObjReturn['message'] += ' Caso tiene problema con lectura de barra de Acciones, No se puede Generar Correo de Creación';
        }
            return ObjReturn;
    },
    
    EnviarNotificacionCreacionCasoAdquirencia: function (executionContext, idIncident)    {
        //debugger;
        let _correoEnviado = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_correodecreacionenviado", false);
        let _validateBarraAciones = CasoAdquirencia.validateBarraAcciones(executionContext);
        if(!_correoEnviado && _validateBarraAciones['success'])
        {
            let _resultado = false;
            let _mensaje = "";
            var response = null;
                        
            var URL = "CasoAccion/PostEnviarMailCreacionCasoAdquirenciaAsync?idIncident=" + idIncident;
            //var apiToken = window.sessionStorage.getItem("LokiAuthToken");
            var service = CasoAdquirencia.GetRequestObject();
            if (service != null)
            {
                service.open("POST", CasoAdquirencia.URL.Azure + URL, true);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader("AuthApi", CasoAdquirencia.ApiKey.Key);
               // service.setRequestHeader("TokenApi", apiToken);
                service.send(null);
                if (service.response != "") 
                {
                    response = JSON.parse(service.response);
                }
            }
            
            if (response != null)
            {
                _resultado = response.success;
                _mensaje = response.message;
            }
        }
        else if (!_validateBarraAciones['success'])
        {
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: _validateBarraAciones['message']+". Favor contactarse con el administrador de la plataforma"};
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

    EnviarNotificacionCierreCasoAdquirencia: function (executionContext, idIncident){        
        let _resultado = false;
        let _mensaje = "";
        var response = null;
                    
        var correoCierreEnviado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_correodecierreenviado", false);       
        //debugger;
        if(correoCierreEnviado)
        {
            var URL = "CasoAccion/PostEnviarMailCierreCasoAdquirenciaAsync?idIncident=" + idIncident;
           // var apiToken = window.sessionStorage.getItem("LokiAuthToken");
            var service = CasoAdquirencia.GetRequestObject();
            if (service != null)
            {
                service.open("POST", CasoAdquirencia.URL.Azure + URL, true);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader("AuthApi", CasoAdquirencia.ApiKey.Key);
               // service.setRequestHeader("TokenApi", apiToken);
                service.send(null);
                if (service.response != "") 
                {
                    response = JSON.parse(service.response);
                }
            }
            
            if (response != null)
            {
                _resultado = response.success;
                _mensaje = response.message;
            } 
        }          
    },
    
	//=======
	//BOTONES
	//=======

    enableButtonResolverCaso: function (executionContext){ 
		/*var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '2')
        {               
            //return true;
			var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
			var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext, "Administrador del sistema");
			

			if(esPropietario)
			{
				return false;
			}
			else
			{
				if(asAdmin)
				{
					return false;
				}
				else
				{
					return false;
				}
			}
		}
        else
        {
            return false;
        }*/
        
        return false;
	},	
    
    onClickButtonResolverCaso: function (executionContext){
        //debugger;
		if(confirm("¿Está seguro que desea Resolver el Caso?"))
        {
            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
            if (incidentId.indexOf("{") > -1)
            {
                incidentId = incidentId.substring(1, 37);
            }
            
            var formValido = JumpStartLibXRM.Fx.FormGetIsDirty(executionContext);
            if(!formValido)
            {
                var url = CasoAdquirencia.URL.Azure + "/HTML/GestionCaso/ResolverCasoAdquirencia.html?idIncident=" + incidentId;
                var new_window = window.open(url,'','height=685px,width=930px,resizable=1,status=0,scroll=1;toolbar=0,menubar=0,location=0');
                var timer = setInterval(function() {   
                    if(new_window.closed) {  
                        clearInterval(timer);
                        new_window.close();
                        executionContext.getFormContext().ui.close();
                    }  
                }, 3000);
            }
            else
            {
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Guardar Formulario", text: "Recuerde guardar el formulario antes de cerrar el caso"};
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
	
	enableButtonCancelar: function (executionContext){		
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '2')
        {    
            let array = new Array ();
            CasoAdquirencia.RolesArray.SystemUser.forEach(
            function (x){
                array.push(x);
            }
            );           
            //return true;
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
			var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
			//var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext, "Administrador del sistema");
			

			if(esPropietario)
			{
				return false;
			}
			else
			{
                return found;
				// if(asAdmin)
				// {
				// 	return true;
				// }
				// else
				// {
				// 	return false;
				// }
			}
		}
        else
        {
            return false;
        }
	},	

	onClickButtonCancelar: function (executionContext) {		
		if(confirm("¿Está seguro que desea cancelar el caso?"))
        {
			//debugger;
            //Marco el caso como rechazado
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", 2);

            //Guardamos el cambio
            JumpStartLibXRM.Fx.formSave(executionContext);
		}		
	},		

    enableButtonAsignar: function (executionContext){	
        //debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        var origen = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_origen", "");
        
        if(origen != "" && origen != null && origen != undefined)
        {
            origen = origen.toLowerCase();
        }        
        
		if (estado == '2' && origen == 'crm adquirencia') {   
            let array = new Array ();
            CasoAdquirencia.RolesArray.SantanderAdquerenciaUrAdmin2.forEach( 
            function (x){
                array.push(x);
            }
            );
            CasoAdquirencia.RolesArray.SantanderAdquerenciaUrAdmin2.forEach( 
                function (x){
                    array.push(x);
                });
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
 
            var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
            if(esPropietario){
				return false;
			}
			else{
                return found;				
            }
        }
        else{
            return false;
        }
	},	

	onClickButtonAsignar: function (executionContext) {
        //executionContext proviniente desde el ribbon no permite obtener el formContext
		PopUp.openWRAsignarCaso(CasoAdquirencia.Form.Context, CasoAdquirencia.URL.Azure, CasoAdquirencia.ApiKey.Key);
	},	
	
	enableButtonSLA: function (executionContext){
		
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '2'){               
        	var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
            if (estado == '2') {   
                let array = new Array ();
                CasoAdquirencia.RolesArray.SystemUser.forEach( 
                function (x){
                    array.push(x);
                }
                );
                CasoAdquirencia.RolesArray.SantanderAdquerenciaUrAdmin2.forEach( 
                    function (x){
                        array.push(x);
                    });
                let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
                return found;   
            }
        }
        else {
            return false;
        }
        // var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		// if (estado == '2')
        // {               
        //     //return true;
		// 	var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext, "Administrador del sistema");
        //     var asSuper = JumpStartLibXRM.Fx.UserHasRole(executionContext, "[Santander] - UR Administrador");

		// 	if(asAdmin || asSuper)
		// 	{
		// 		return true;
		// 	}
		// 	else
		// 	{
		// 		return false;
		// 	}
		// }
        // else
        // {
        //     return false;
        // }
    },	

	onClickButtonSLA: function (executionContext) {	
		//debugger;
       
        if(confirm("Va a modificar el SLA establecido en el CasoAdquirencia. ¿Desea Continuar?")){
            var entityFormOptions = {};
            entityFormOptions["entityName"] = "xmsbs_modificasla";
            entityFormOptions["openInNewWindow"] = false;
            
            var formParameters = {};
            
            //Set lookup field
            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
            if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
            
            formParameters["xmsbs_caso"] = incidentId;
            formParameters["xmsbs_casoname"] = JumpStartLibXRM.Fx.getValueField(executionContext, "title", null);
			formParameters["xmsbs_diassla"] = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_diassladelcaso", null);
			formParameters["xmsbs_diasalerta"] = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_diasalertadelcaso", null);
            
            // Open the form
            Xrm.Utility.openEntityForm("xmsbs_modificasla", null, formParameters, entityFormOptions);            
        }
	},
    
    //Otras
    arrayFrom:function(){
        if (!Array.from) {
            Array.from = (function () {
                var symbolIterator;
                try {
                    symbolIterator = Symbol.iterator
                        ? Symbol.iterator
                        : 'Symbol(Symbol.iterator)';
                } catch (e) {
                    symbolIterator = 'Symbol(Symbol.iterator)';
                }

                var toStr = Object.prototype.toString;
                var isCallable = function (fn) {
                    return (
                        typeof fn === 'function' ||
                        toStr.call(fn) === '[object Function]'
                    );
                };
                var toInteger = function (value) {
                    var number = Number(value);
                    if (isNaN(number)) return 0;
                    if (number === 0 || !isFinite(number)) return number;
                    return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
                };
                var maxSafeInteger = Math.pow(2, 53) - 1;
                var toLength = function (value) {
                    var len = toInteger(value);
                    return Math.min(Math.max(len, 0), maxSafeInteger);
                };

                var setGetItemHandler = function setGetItemHandler(isIterator, items) {
                    var iterator = isIterator && items[symbolIterator]();
                    return function getItem(k) {
                        return isIterator ? iterator.next() : items[k];
                    };
                };

                var getArray = function getArray(
                    T,
                    A,
                    len,
                    getItem,
                    isIterator,
                    mapFn
                ) {
                    // 16. Let k be 0.
                    var k = 0;

                    // 17. Repeat, while k < len… or while iterator is done (also steps a - h)
                    while (k < len || isIterator) {
                        var item = getItem(k);
                        var kValue = isIterator ? item.value : item;

                        if (isIterator && item.done) {
                            return A;
                        } else {
                            if (mapFn) {
                                A[k] =
                                    typeof T === 'undefined'
                                        ? mapFn(kValue, k)
                                        : mapFn.call(T, kValue, k);
                            } else {
                                A[k] = kValue;
                            }
                        }
                        k += 1;
                    }

                    if (isIterator) {
                        throw new TypeError(
                            'Array.from: provided arrayLike or iterator has length more then 2 ** 52 - 1'
                        );
                    } else {
                        A.length = len;
                    }

                    return A;
                };

                // The length property of the from method is 1.
                return function from(arrayLikeOrIterator /*, mapFn, thisArg */) {
                    // 1. Let C be the this value.
                    var C = this;

                    // 2. Let items be ToObject(arrayLikeOrIterator).
                    var items = Object(arrayLikeOrIterator);
                    var isIterator = isCallable(items[symbolIterator]);

                    // 3. ReturnIfAbrupt(items).
                    if (arrayLikeOrIterator == null && !isIterator) {
                        throw new TypeError(
                            'Array.from requires an array-like object or iterator - not null or undefined'
                        );
                    }

                    // 4. If mapfn is undefined, then let mapping be false.
                    var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
                    var T;
                    if (typeof mapFn !== 'undefined') {
                        // 5. else
                        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
                        if (!isCallable(mapFn)) {
                            throw new TypeError(
                                'Array.from: when provided, the second argument must be a function'
                            );
                        }

                        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
                        if (arguments.length > 2) {
                            T = arguments[2];
                        }
                    }

                    // 10. Let lenValue be Get(items, "length").
                    // 11. Let len be ToLength(lenValue).
                    var len = toLength(items.length);

                    // 13. If IsConstructor(C) is true, then
                    // 13. a. Let A be the result of calling the [[Construct]] internal method
                    // of C with an argument list containing the single item len.
                    // 14. a. Else, Let A be ArrayCreate(len).
                    var A = isCallable(C) ? Object(new C(len)) : new Array(len);

                    return getArray(
                        T,
                        A,
                        len,
                        setGetItemHandler(isIterator, items),
                        isIterator,
                        mapFn
                    );
                };
            })();
        }
    },
    getContactDetail: function (executionContext, rut, adquirencia) {
        var entityType = "contacts";
        var query = "$select=firstname,lastname,middlename,fullname,mobilephone,telephone1,emailaddress1,xmsbs_preferenciacontacto,xmsbs_clientesantander";
        query += "&$filter=(xmsbs_rut eq " +"'"+ rut+"' and _xmsbs_institucion_value eq " + adquirencia +")";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query);
        return resultado;
        //https://midaschiledesa.crm2.dynamics.com/api/data/v9.2/contacts?$select=fullname,contactid&$filter=(xmsbs_rut eq '15551120-6' and _xmsbs_institucion_value eq 443e67e1-f271-eb11-a812-00224809a412)&$orderby=fullname asc
        //https://midaschiledesa.crm2.dynamics.com/api/data/v8.0/contacts?$select=firstname,lastname,middlename,mobilephone,emailaddress1,xmsbs_preferenciacontacto,xmsbs_clientesantander&$filter=(xmsbs_rut eq 2716637781-1%27) and xmsbs_institucion eq 443e67e1-f271-eb11-a812-00224809a412
    },

    getAdquirenciaDetail: function (executionContext) {
        var entityType = "xmsbs_institucions";
        var query = "$select=xmsbs_institucionid,xmsbs_name";
        //query += "&$filter=(xmsbs_rut eq " +"'"+ rut+"')";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query);
        return resultado;
        //https://midaschiledesa.crm2.dynamics.com/api/data/v9.2/xmsbs_institucions?$select=xmsbs_institucionid,xmsbs_name&$orderby=xmsbs_name asc
    },
    getProductoAdquiDetail: function (executionContext) {
        var entityType = "xmsbs_productoservicio";
        var query = "$select=xmsbs_productoservicioid,xmsbs_name";
        query += "&$filter=(xmsbs_name eq 'Adquirencia')";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query);
        return resultado;
        //https://midaschiledesa.crm2.dynamics.com/api/data/v9.2/xmsbs_productoservicios?$select=xmsbs_productoservicioid,xmsbs_name&$filter=(xmsbs_name eq 'Adquirencia')&$orderby=xmsbs_name asc
    },
    getTipoContacto: function (executionContext,contact,comercio,sucursal){
    
        var contactid = contact[0].id;
        contactid = contactid.replace(/[{}]/g, "");
        
        var comercioid = comercio[0].id;
        comercioid = comercioid.replace(/[{}]/g, "");
        
        var sucursalid = sucursal[0].id;
        sucursalid = sucursalid.replace(/[{}]/g, "");
        
        var entityType = "xmsbs_contactocomercialdelasucursal";
        var query = "$select=xmsbs_contactocomercialdelasucursalid,xmsbs_name,xmsbs_relacion";
        query += "&$filter=(_xmsbs_contacto_value eq "+contactid+" and _xmsbs_comercio_value eq "+comercioid+" and _xmsbs_sucursal_value eq "+sucursalid+")";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query);
        return resultado;
        //https://midaschiledesa.crm2.dynamics.com/api/data/v9.2/xmsbs_contactocomercialdelasucursals?$select=xmsbs_contactocomercialdelasucursalid,xmsbs_name&$filter=(_xmsbs_contacto_value eq 29e16a1b-cd8c-eb11-b1ac-000d3ab8d6b8 and _xmsbs_comercio_value eq f3cd7357-be8c-eb11-b1ac-000d3ab8dee7 and _xmsbs_sucursal_value eq b91ffa66-c88c-eb11-b1ac-000d3ab8d0f2)&$orderby=xmsbs_name asc
    },
    getCasoAvisoRobo: function (executionContext, rut) {
        var entityType = "incident";
        var query = "$select=xmsbs_numerocorrelativo";
        query += "&$filter=(xmsbs_rutcomercio eq '"+rut+"' and _xmsbs_detalledeoperacion_value eq 2B744564-7E27-EC11-B6E5-000D3ADF05BA and xmsbs_picklist1g eq 2 and xmsbs_picklist3g eq 2)";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query);
        return resultado;
		
        //https://midaschiledesa.crm2.dynamics.com/api/data/v9.2/incidents?$select=title,createdon,caseorigincode,xmsbs_numerocorrelativo,incidentid&$filter=(xmsbs_rut eq '16637781-1' and xmsbs_picklist1g eq 2 and xmsbs_picklist3g eq 2)&$orderby=title asc
    },
    getCasoMeArrepenti: function (executionContext, rut) {
        var entityType = "incident";
        var query = "$select=xmsbs_numerocorrelativo";
        query += "&$filter=(xmsbs_rutcomercio eq '"+rut+"' and _xmsbs_detalledeoperacion_value eq 0fe4ce3a-b472-eb11-b0b0-000d3a3b377d)";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query);
        return resultado;
		
        //https://midaschiledesa.crm2.dynamics.com/api/data/v9.2/incidents?$select=xmsbs_numerocorrelativo&$filter=(xmsbs_rut eq '25039219-2' and _xmsbs_detalledetipologia_value eq fa945921-be72-eb11-b0b0-000d3a3b377d)&$orderby=title asc
    },
    getCasoRoboPerdida: function (executionContext, rut) {
        var entityType = "incident";
        var query = "$select=xmsbs_numerocorrelativo";
        query += "&$filter=(xmsbs_rutcomercio eq '"+rut+"' and _xmsbs_detalledetipologia_value eq 6AB46093-7E27-EC11-B6E5-000D3ADF05BA)";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query);
        return resultado;
		
        //https://midaschiledesa.crm2.dynamics.com/api/data/v9.2/incidents?$select=title,createdon,caseorigincode,xmsbs_numerocorrelativo,incidentid&$filter=(xmsbs_rut eq '16637781-1' and xmsbs_picklist1g eq 2 and xmsbs_picklist3g eq 2)&$orderby=title asc
    },
    getURReclamos: function (executionContext, id) {
        //debugger;
        var entityType = "xmsbs_integranteur";
        var query = "$select=xmsbs_integranteurid,_xmsbs_unidadresolutora_value";
        query += "&$filter=(_xmsbs_usuario_value eq "+id+")";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query);
        return resultado;
		
        //https://midaschiledesa.crm2.dynamics.com/api/data/v9.2/xmsbs_integranteurs?$select=xmsbs_integranteurid,_xmsbs_unidadresolutora_value&$filter=(_xmsbs_usuario_value eq facb8ec9-9682-eb11-a812-000d3adcf020)&$orderby=_xmsbs_unidadresolutora_value asc
    },
    

    validaTipificacionesContact: function(executionContext, tipoDetalleOperacionId){
        //debugger;
        //Primero, vamos a ver si el tipo y detalle de operación tiene registros en la entidad de bloqueos por canal de ingreso
        var resultado = CasoAdquirencia.datosBloqueoTipificacionPorCanal(executionContext, tipoDetalleOperacionId);
        if(resultado){
            //Si trajo resultado, vemos el largo.
            if(resultado.value.length > 0){
                //Si trajo algo concreto, ahora hacemos la misma pregunta pero para el punto de contacto ingresado que siempre debería existir
                var canalDeIngreso = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_puntodecontacto", "");
                if(canalDeIngreso != null && canalDeIngreso != ""){
                    //Si hay canal de ingreso, ahora buscamos un registro con ese dato. Primero limpiamos
                    if (canalDeIngreso.indexOf("{") > -1){canalDeIngreso = canalDeIngreso.substring(1, 37);}
                    var resultado = CasoAdquirencia.datosBloqueoTipificacionPorCanalConCanalIngresado(executionContext, tipoDetalleOperacionId, canalDeIngreso);
                    if(resultado){
                        if(resultado.value.length > 0){
                            //Encontró algo, asi que devuelve false
                            return false;
                        }
                        else{
                            //No trajo nada, por lo que puede retornar true y que continúe
                            return true;
                        }
                    }
                    else{
                        //No trajo nada, por lo que puede retornar true y que continúe
                        return true;
                    }
                }
                else{
                    //No encontró Canal de Ingreso. Bloquea
                    return false;
                }
            }
            else{
                //No trajo nada, por lo que puede retornar true y que continúe
                return true;
            }
        }
        else{
            //No trajo nada, por lo que puede retornar true y que continúe
            return true;
        }
        return true;
    },
    
    datosBloqueoTipificacionPorCanal: function (executionContext,tipoDetalleOperacionId){
        var entityType = "xmsbs_bloquearingreso";
        var query = "$select=xmsbs_bloquearingresoid,xmsbs_name,xmsbs_tipificacion,xmsbs_canal";
        query += "&$filter=_xmsbs_tipificacion_value eq '" + tipoDetalleOperacionId + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    datosBloqueoTipificacionPorCanalConCanalIngresado: function (executionContext, tipoDetalleOperacionId, canalDeIngreso){
        var entityType = "xmsbs_bloquearingreso";
        var query = "$select=xmsbs_bloquearingresoid,xmsbs_name,xmsbs_tipificacion,xmsbs_canal";
        query += "&$filter=_xmsbs_tipificacion_value eq '" + tipoDetalleOperacionId + "' and _xmsbs_canal_value eq '" + canalDeIngreso + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
};

parent.getExecutionContextAdquirencia = function (){
	return CasoAdquirencia.Form.executionContext;
};
parent.getExecutionFormContextAdquirencia = function (){
	return CasoAdquirencia.Form.formContext;
};