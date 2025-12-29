if (typeof(Caso) == "undefined") {
    Caso = {
        __namespace: true
    };    
}

Caso = {
    Form: {        
        Context: null,
        executionContext: null,
        formContext:null,
        LecturaGrilla:null,
        SeccionesGrillaID:null,
        PickList1_ArrayOptions:null,
        PickList2_ArrayOptions:null,
        PickList3_ArrayOptions:null,
        PickList4_ArrayOptions:null,
        PickList5_ArrayOptions:null        
    },
    Formulario: {        
        CasoTestMejora: "CasoTestMejora" 
    },
    
	URL: {        
        Azure: "",
        Name: "AzureURL"
    },
	
	ApiKey: {
        Key: "",
        Name: "AuthApi"
    },
    
    Formularios: {
        Reguladores: "Caso",
        Masivos: "Caso Ingreso Único"
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
                      "e6bc4b59-330d-4570-8fb8-cacdeacfc8c4"],
        SantanderUrAdmin: ["0c0e0889-916c-eb11-a812-00224803adb8",
                            "f3eb6299-797b-449b-82bf-65a665b8f359",
                            "cf3ed9c7-6216-475f-9d97-899ab397db6e",
                            "43434fd2-57d7-4dbc-a228-c633cf0680fc",
                            "30177055-5cfc-41a7-92c4-d0d9b7a13de2",
                            "6221ca30-f8d6-44ea-a0f2-d5e50e9a77c2"],
        SantanderContactCenterEjecutivo: [ "B874C33B-6D86-4548-A224-3370F069C5B4",
                                           "9AE8723F-3B1B-4EC0-BD34-C30473514FEC",
                                           "977251D7-6AA1-4FB8-BCB0-793A1A97D7D8",
                                           "41EE80B1-811C-4D27-A93C-DF8C90B4F9E4",
                                           "BD5860D8-DB8F-4428-A837-5D4E10481D0A",
                                           "9D163059-279E-4C4F-9144-D7ACB3E76DF7"]
    },

	codigopuntocontacto: {
		Ejecutivo: "PC-002",
		Contact: "PC-003"
	},

	codigoOrigen: {
		CRM: "O-002"
    },    
    
    variableGlobal: {
        grillaCasosPorUR: 0
    },
    
    formContext: null,
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
        //Validación cambio de formulario
        debugger;
        if(!Caso.cambioFormulario(executionContext)){return;}
        
        Caso.formContext = executionContext.getFormContext();
		var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();	
        
        var test = onApiButtonClickAsync(executionContext);
        Caso.Form.Context = executionContext;
        Caso.Form.executionContext = executionContext;
        Caso.Form.formContext = formContext;
        Caso.setApiKey(executionContext);
        Caso.setAzureURL(executionContext);
        Caso.arrayFrom();
        formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false); //Botonera
        
		if (tipoFormulario == '1'){
			Caso.ocultarFichaSecciones(formContext);
            Caso.origenCasoBloqueo(executionContext);
			Caso.puntoContactoBloqueo(executionContext);
			//Caso.buscarInstitucion(executionContext);
            
            var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
            if(marcaReiterado){ //si es reiterado, hay que forzar el onchange del producto y tipoydetalle
                Caso.onChange_tipoDetalleOperacion(executionContext);
                
                //FU: Se deben bloquear los campos de las secciones, menos solución esperada y descripción
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "ingresoinicial", true);
                
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_solucionesperada");
                JumpStartLibXRM.Fx.enableField(executionContext, "description");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_puntodecontacto");
                
                //Desbloqueo pedidos por Janina:
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_preferenciasdecontacto");
            }
			
			var tipoYdetalle = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_detalledetipologia");
            if(tipoYdetalle){ //si es subrequerimiento de Fraude, hay que forzar el onchange del producto y tipoydetalle
                Caso.onChange_tipoDetalleOperacion(executionContext);
            }			
			
        }
        else if (tipoFormulario == '2' || tipoFormulario == '3'){
            Caso.mostrarFichaSecciones(executionContext, formContext); 
            Caso.setGeneralTab(executionContext);       
            Caso.setXrmFormContextWRBotoneraMejora(executionContext, formContext);                    
            Caso.BloquearObservacionesYSolucion(executionContext); 
            Caso.CampoObservacionesReparar(executionContext);
            Caso.BloquearCamposDespuesDeCrear(executionContext);
            Caso.camposSeccionesEtapa(executionContext);
            Caso.SeccionRespuesta(executionContext,formContext);
            //Caso.crearCasoNEO(executionContext);  
            Caso.OcultaMotivoResolucion(executionContext);
        }
        else if (tipoFormulario == '4'){
			Caso.mostrarFichaSecciones(executionContext, formContext);
            Caso.camposSeccionesEtapa(executionContext);
            Caso.SeccionRespuesta(executionContext, formContext);
            
            //Mostramos la sección de encuestas si es subrequerimiento
            var esSubrequerimiento = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "parentcaseid");
            if(esSubrequerimiento){
                formContext.ui.tabs.get("tab_19").setVisible(true); //Encuestas
            }
            
            //OCultar botonera
            formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false); //Botonera
        }
        
		//Caso.onChange_TipoDocumento(executionContext);
		Caso.bloqueoTipificacion(executionContext);
        //debugger;
         //bloqueamos la sección de gestión general si el formulario es de lectura o finalizado
        if(tipoFormulario == 3 || tipoFormulario == 4){
            JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
			JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "resolucion", true);
        }
	},
    setGeneralTab:function(executionContext){
        var formContext = executionContext.getFormContext();
        var GeneralTab = formContext.ui.tabs.get("general");
        GeneralTab.addTabStateChange(Caso.onChange_GeneralTabStateChange); 
      
    },  
    executeWRGrillaCasosClienteUR:function(executionContext){
        var formContext = executionContext.getFormContext();
        var estadoTab = formContext.ui.tabs.get("tab_18").getDisplayState();
        var variableGlobalGrilla = Caso.variableGlobal.grillaCasosPorUR;
        
        if(estadoTab == "expanded" && variableGlobalGrilla == 0){
            //hacemos el llamado a la API para pintar la grilla
            Caso.setXrmFormContextWRGrillaCasosClienteUR(executionContext, formContext);
            Caso.variableGlobal.grillaCasosPorUR = 1;
        }
    },
    
    setApiKey: function(executionContext){         
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_parametro", "?$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor&$filter=xmsbs_name eq '"+ Caso.ApiKey.Name +"'&$top=1").then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    var xmsbs_name = results.entities[i]["xmsbs_name"];
                    var xmsbs_parametroid = results.entities[i]["xmsbs_parametroid"];
                    var xmsbs_valor = results.entities[i]["xmsbs_valor"];
                    Caso.ApiKey.Key =results.entities[i]["xmsbs_valor"];
                }
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );     
	//var resultado = Util.buscarValorParametro(executionContext, Caso.ApiKey.Name);
        
      //  if(resultado)
      //  {
      //      Caso.ApiKey.Key = resultado;
       // }
	},
    
    setAzureURL: function(executionContext){      
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_parametro", "?$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor&$filter=xmsbs_name eq '"+ Caso.URL.Name +"'&$top=1").then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    var xmsbs_name = results.entities[i]["xmsbs_name"];
                    var xmsbs_parametroid = results.entities[i]["xmsbs_parametroid"];
                    var xmsbs_valor = results.entities[i]["xmsbs_valor"];
                    Caso.URL.Azure =results.entities[i]["xmsbs_valor"];
                }
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );     
        //debugger;
		// var resultado = Util.buscarValorParametro(executionContext, Caso.URL.Name);
        
        // if(resultado)
        // {
        //     Caso.URL.Azure = resultado;
        // }
	},
    reLoadWRBotoneraMejora: function (executionContext, formContext) {
		//debugger;
       //var formContext = executionContext.getFormContext(); 
       var webResource =formContext.getControl("WebResource_botoneraAcciones");
       var src = webResource.getSrc();     
       var aboutBlank = "about:blank";
       webResource.setSrc(aboutBlank);     
       setTimeout(function(){ 
          webResource.setSrc(src);
       }, 1000);       
    },
	setXrmFormContextWRBotonera: function (executionContext, formContext) {
		//debugger;
        var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
        var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext, "Administrador del sistema");
		var asAdmin2 = JumpStartLibXRM.Fx.UserHasRole(executionContext, "System Administrator");
        var asSuper = JumpStartLibXRM.Fx.UserHasRole(executionContext, "[Santander] - UR Administrador");

        if(!esPropietario && !asAdmin && !asSuper && !asAdmin2){
            formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false);
        }
        else{
            let response = null;
            var wrBotonera = formContext.getControl("WebResource_botoneraAcciones");
            let caseId = formContext.data.entity.getId();

            let finalUrlGetAcciones = "/caso/GetAcciones/" + caseId; //deprecado por delay

            var service = Caso.GetRequestObject();
            if (service != null) {
                service.open("GET", Caso.URL.Azure + finalUrlGetAcciones, false);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader(Caso.ApiKey.Name, Caso.ApiKey.Key);
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
        // JumpStartLibXRM.Fx.UserHasRoles(executionContext,arrayNameRoles,Caso.setXrmFormContextWRBotoneraMejoraOK,Caso.setXrmFormContextWRBotoneraMejoraNOK);
        Caso.formContext = executionContext.getFormContext();
        var formContext = executionContext.getFormContext();  
        let array = new Array ();
        Caso.RolesArray.SystemUser.forEach( 
        function (x){
            array.push(x);
        }
        );
        Caso.RolesArray.SantanderUrAdmin.forEach( 
            function (x){
                array.push(x);
            });
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
       
        // var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
      //  var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext, "Administrador del sistema");
		//var asAdmin2 = JumpStartLibXRM.Fx.UserHasRole(executionContext, "System Administrator");
      //  var asSuper = JumpStartLibXRM.Fx.UserHasRole(executionContext, "[Santander] - UR Administrador");

       // if(!esPropietario && !asAdmin && !asSuper && !asAdmin2){
       //     formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false);
      //  }
       // else{
       //     Caso.LoadBotoneraAccion(executionContext, formContext);
       // }
    },

    setXrmFormContextWRBotoneraMejoraOK: function (executionContext) {
       // debugger; 
        Caso.formContext = executionContext.getFormContext();
		var formContext = executionContext.getFormContext();       
        formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true);
        Caso.LoadBotoneraAccion(executionContext, formContext);

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
            Caso.LoadBotoneraAccion(executionContext, formContext);
         }        
    },

 
    LoadBotoneraAccion : function(executionContext, formContext){
            let response = null;
           // Caso.reLoadWRBotoneraMejora(executionContext, formContext);
            var wrBotonera = formContext.getControl("WebResource_botoneraAcciones");
            var botoneraObj = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_botoneraaccionesobj", null);        
            if (botoneraObj != null) {
              response = JSON.parse(botoneraObj);
                if (wrBotonera && response) {
                    wrBotonera.getContentWindow().then(
                        function (contentWindow) {                      
                            if (contentWindow != null && typeof(contentWindow.setClientApiContext) === 'function'){   
                                  console.log("ejecuto correcto");
                                 // setTimeout(function(){ 
                                        contentWindow.setClientApiContext(Xrm, executionContext, formContext, response);
                                 //   }, 1000); 
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
                }
            }
            else {
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
            }
    },
    LoadBotoneraAccionOnsave : function(executionContext, formContext){
        let response = null;
        var wrBotonera = formContext.getControl("WebResource_botoneraAcciones");
        var botoneraObj = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_botoneraaccionesobj", null);
       
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
        var resultado = Caso.buscarCasosClienteUR(executionContext, idCliente, idUR);
        
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
                          Producto: Caso.obtenerProducto(executionContext, resultado.value[i]["_xmsbs_producto_value"]),
                          TipoRequerimiento: Caso.obtenerTipoRequerimiento(executionContext, resultado.value[i]["_xmsbs_tipoderequerimiento_value"]),
                          TipoOperacion: Caso.obtenerTipoOperacion(executionContext, resultado.value[i]["_xmsbs_tipodeoperacion_value"]),
                          TipoYDetalleOperacion: Caso.obtenerTipoYDetalleOperacion(executionContext, resultado.value[i]["_xmsbs_detalledetipologia_value"]),
                          FechaCreacion: Caso.formatDate(resultado.value[i]["createdon"])
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
            var resultado = Caso.buscarProducto(executionContext, idProducto);
        
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
            var resultado = Caso.buscarTipoYDetalleOperacion(executionContext, idTipoYDetalleOperacion);
        
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
            var resultado = Caso.buscarTipoRequerimiento(executionContext, idTipoRequerimiento);
        
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
            var resultado = Caso.buscarTipoOperacion(executionContext, idTipoOperacion);
        
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
    	
	bloqueoTipificacion: function (executionContext){
		//debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado != '1')
		{
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_producto");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_detalledetipologia");
            executionContext.getFormContext().getControl("xmsbs_causaraiz").addPreSearch(Caso.filtrarCausaRaiz);
		}
		else
		{
			executionContext.getFormContext().getControl("xmsbs_producto").addPreSearch(Caso.filtrarLookupProducto);
			executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addPreSearch(Caso.puntoContactofiltro);
			executionContext.getFormContext().getControl("xmsbs_detalledetipologia").addPreSearch(Caso.filtrarLookupTipoDetalle);
		}
	},
	
	buscarInstitucion: function (executionContext){
		//debugger;
		var institucion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_institucion", null);
		if(!institucion)
		{
			var PropietarioId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
			var respuesta = Caso.datosUsuario(executionContext, PropietarioId);
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
    
    formatearRutCRM: function (rut){
        if(rut)
        {
            var _quitarCero = rut.substring(0, 3);

            if (_quitarCero == "000")
            {
                rut = rut.Substring(3);
            }
            else
            {
                _quitarCero = rut.substring(0, 2);
                
                if (_quitarCero == "00")
                {
                    rut = rut.substring(2);
                }
            }            

            return rut.substring(0, rut.length - 1) + "-" + rut.substring(rut.length - 1);
        }
	},
	
//==================
//FUNCIONES ONCHANGE
//==================
    onChange_GeneralTabStateChange: function() {
    //debugger;
        var executionContext = Caso.Form.Context;
        var formContext = Caso.formContext;       
        var estadoTab = formContext.ui.tabs.get("general").getDisplayState();
        if(estadoTab == "expanded" ){  
            setTimeout(function(){ 
                   Caso.setXrmFormContextWRBotoneraMejora(executionContext, formContext);
               }, 1000);      
            //Caso.setXrmFormContextWRBotoneraMejora(executionContext, formContext);  
        }       
    },
    
    onChange_TipoDocumento: function (executionContext) {
        //debugger;
		var tipoDocumento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodocumento", null);
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
		
		if(tipoDocumento){
            JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_rut");
            
            if(tipoDocumento == 1) //Nacional
            {
                JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_rut", "RUT");
            }
            else if(tipoDocumento == 2) //Extranjero
            {
                JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_rut", "Número de documento");
            }
            
            if(tipoFormulario == 1)
            {
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rut", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_emailcliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidopaterno", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidomaterno", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrecliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "customerid", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_cliente", null);
            
                //Deshabilito los campos
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_telefonocelular");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_emailcliente");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidopaterno");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidomaterno");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_nombrecliente");
            }
		}
        else
        {            
            JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_rut", "RUT");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_rut");
        }
	},
    
	onChange_rut: function (executionContext) {
        //debugger;
        var myControl = executionContext.getEventSource().getName();
		var rut = JumpStartLibXRM.Fx.getValueField(executionContext, myControl, null);
		var tipoDocumento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodocumento", null);
        
        if(myControl.toLowerCase() == "xmsbs_rut")
        {
            if(tipoDocumento)
            {         
                if(rut)
                {                
                    if(tipoDocumento == 1) //Nacional
                    {
                        rut = Caso.formatearRutCRM(rut);
                        var respuesta = JumpStartLibXRM.Fx.validarrut(rut);
                        
                        if (respuesta == true)
                        {	
                            //var formateaRut = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_rut", null);
                            var formateaRut = rut;
                            formateaRut = formateaRut.replace(/[^\dkK]/g, "");
                            var largo = formateaRut.length;

                            formateaRut = formateaRut.substring(0, largo - 1) + "-" + formateaRut.substring(largo - 1, largo);
                            //rut.setValue(formateaRut);
                            JumpStartLibXRM.Fx.setValueField(executionContext, myControl, formateaRut);
                        }
                        else 
                        {
                            JumpStartLibXRM.Fx.setValueField(executionContext, myControl, null);
                            
                            var alertStrings = { confirmButtonLabel: "Aceptar", text: "RUT no es valido, favor volver a ingresar el RUT.", title: "Información" };
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
                    else if(tipoDocumento == 2) //Extranjero
                    {
                        //Se mantiene el valor que ingresa
                    } 
                }
                else
                {
                    var mensaje = "";
                    if(tipoDocumento == 1) //Nacional
                    {
                        mensaje = "Debe ingresar el RUT";
                    }
                    else if(tipoDocumento == 2) //Extranjero
                    {
                        mensaje = "Debe ingresar el Número de documento";
                    } 
                
                    var alertStrings = { confirmButtonLabel: "Aceptar", text: mensaje, title: "Información" };
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
            else
            {
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "Debe ingresar el tipo de documento", title: "Información" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        //console.log("Alert dialog closed");
                        //JumpStartLibXRM.Fx.setValueField(executionContext, myControl, null);
                        JumpStartLibXRM.Fx.setFocus(executionContext, "xmsbs_tipodocumento", null);
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
        else
        {
            if(rut)
            {
                rut = Caso.formatearRutCRM(rut);
                var respuesta = JumpStartLibXRM.Fx.validarrut(rut);
                
                if (respuesta == true)
                {	
                    //var formateaRut = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_rut", null);
                    var formateaRut = rut;
                    formateaRut = formateaRut.replace(/[^\dkK]/g, "");
                    var largo = formateaRut.length;

                    formateaRut = formateaRut.substring(0, largo - 1) + "-" + formateaRut.substring(largo - 1, largo);
                    //rut.setValue(formateaRut);
                    JumpStartLibXRM.Fx.setValueField(executionContext, myControl, formateaRut);
                }
                else 
                {
                    JumpStartLibXRM.Fx.setValueField(executionContext, myControl, null);
                    
                    var alertStrings = { confirmButtonLabel: "Aceptar", text: "RUT no es valido, favor volver a ingresar el RUT.", title: "Información" };
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
        }
	},		
	
	onChange_cliente: function (executionContext) {
		//debugger;
        var response = null;
        var ApiUrlClienteByRut = "";
		var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);		
		var tipoDocumento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodocumento", null);
        
		if(rut && tipoDocumento)
        {
			if(tipoDocumento == 1) //Nacional
            {
                ApiUrlClienteByRut = "/Cliente/GetClienteSantanderByRut/" + rut;
            }
            else if(tipoDocumento == 2) //Extranjero
            {
                ApiUrlClienteByRut = "/Cliente/GetClienteExtranjeroByNumeroDocumento/" + rut;
            }

            //var apiToken = window.sessionStorage.getItem("LokiAuthToken");
			var service = Caso.GetRequestObject();
			if (service != null)
			{
				service.open("GET", Caso.URL.Azure + ApiUrlClienteByRut, false);
				service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
				service.setRequestHeader("Accept", "application/json,text/javascript, */*");
				service.setRequestHeader(Caso.ApiKey.Name, Caso.ApiKey.Key);
             //   service.setRequestHeader("TokenApi", apiToken);
				service.send(null);
				if (service.response != "") 
				{
					response = JSON.parse(service.response);
				}
			}
            
			if (response.success)
			{
                if (response.cliente != null)
                {
                    //Variables
                    var telefono = response.cliente.telefonoCelular;
                    var correoElectronico = response.cliente.correoElectronico;
                    var apellidopaterno = response.cliente.apellidoPaterno;
                    var apellidomaterno = response.cliente.apellidoMaterno;
                    var nombrecliente = response.cliente.nombre;
                    var clientesantander = response.cliente.clienteSantander;
                    var preferenciascontacto = response.cliente.preferenciaContacto;
                    
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
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", telefono);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_emailcliente", correoElectronico);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", valoresPreferencias);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidopaterno", apellidopaterno);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidomaterno", apellidomaterno);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrecliente", nombrecliente);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_clientesantander", clientesantander);
                    }else{
                        //Pido que complete los campos del cliente marcandolo como requerido
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_telefonocelular", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_apellidopaterno", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_apellidomaterno", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_nombrecliente", "required");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_clientesantander", clientesantander);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", valoresPreferencias);
                        
                        //Habilito los campos
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
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
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_apellidopaterno", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_nombrecliente", "required");
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_clientesantander", clientesantander);
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", valoresPreferencias);
                    
                    //Habilito los campos
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_apellidopaterno");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_apellidomaterno");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_nombrecliente");
					
					//Setear el email por defecto
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_email", true);
					
					//Alert 
					var alertStrings = { confirmButtonLabel: "Aceptar", text: "Recuerde completar la información del cliente en el caso", title: "Completar información cliente" };
					var alertOptions = { height: 120, width: 260 };
					Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
						function (success) {
							console.log("Alert dialog closed");
						},
						function (error) {
							//console.log(error.message);
						}
					);
                }
                
				//Cliente nativo			
				var id = response.eCliente.id;
				var name = response.eCliente.name;
				var entityType = response.eCliente.logicalName;
				var fieldName = "customerid";
				JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
				var fieldName = "xmsbs_cliente";
				JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
			}
		}
        else
        {
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_emailcliente", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidopaterno", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidomaterno", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrecliente", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "customerid", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_cliente", null);
            
            //Deshabilito los campos
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_telefonocelular");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_emailcliente");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidopaterno");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidomaterno");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_nombrecliente");
        }
	},

    onChange_tipoDetalleOperacion: function (executionContext) {
        //debugger;
        var productoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto");
        var tipoDetalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
         
        if(productoId && tipoDetalleID){

            //Se debe completar el tipo de Requerimiento asociado al tipo y detalle de operación
            if (tipoDetalleID.indexOf("{") > -1){tipoDetalleID = tipoDetalleID.substring(1, 37);}
            
            //hacemos odata que consulta para el producto el requerimiento que corresponde
            var respuesta = Caso.datosTipoDetalleOp(executionContext, tipoDetalleID);
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
                var respuesta = Caso.datosInstitucionPorTipoReq(executionContext, tipoRequerimientoID);
                if(respuesta){
                    var fieldName = "xmsbs_institucion";
                    var id = respuesta.xmsbs_institucion.xmsbs_institucionid;
                    var name = respuesta.xmsbs_institucion.xmsbs_name;
                    var entityType = "xmsbs_institucion";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                }
				
				//debugger;
				//Reviso logica para seleccionar el punto de contacto
				Caso.puntoContactoBloqueo(executionContext);
                
            }
            
            //debugger;
            //Vamos a buscar la etapa del flujo del detalle. Primero, buscamos el Flujo
            var respuesta = Caso.buscarFlujoDelDetalle(executionContext, detalleOperacionID);
            if(respuesta){
                var flujoDelProcesoID = respuesta._xmsbs_flujosantander_value;
                
                //Buscamos la etapa inicial
                var respuesta = Caso.buscarEtapaInicial(executionContext, flujoDelProcesoID);
                if(respuesta){
                    if(respuesta.value.length > 0){
                        var etapaID = respuesta.value[0].xmsbs_etapaid;
                        
                        //Ya tenemos la primera etapa, ahora debemos llamar a los campos a pintar
                        Caso.camposSeccionesEtapa(executionContext, etapaID);
                    }
                }
            }
        }
    },
    
    onChange_pregunta2caso: function (executionContext) {
        //debugger;
        var pregunta2caso = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2delcaso");	 
        if(pregunta2caso){
            if (pregunta2caso.indexOf("{") > -1){pregunta2caso = pregunta2caso.substring(1, 37);}
            
            //hacemos odata que consulta cual es el detalle de operación de esa tipología
            var respuesta = Caso.datosPreguna2caso(executionContext, pregunta2caso);
            if(respuesta){
                //Trajo la información, ahora consultamos por el tipodedetalle que tenga ese detalle de operación
                var detalleOperacionID = respuesta._xmsbs_detalledeoperacion_value;
                if (detalleOperacionID.indexOf("{") > -1){detalleOperacionID = detalleOperacionID.substring(1, 37);}
                
                var respuesta = Caso.buscaTipoDetalle(executionContext, detalleOperacionID);
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
                    Caso.onChange_tipoDetalleOperacion(executionContext);
                }
            }
        }
    },
	
	filtrarLookupProducto: function (executionContext) {
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
                    
        var resultado = Caso.buscarCausasRaicesEspecificas(executionContext, DetalleOperacionID);
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
    
	onChange_TipoResolucion: function (executionContext, origen) {
		var tipoResolucion = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_tipoderespuesta", null);
		var UrName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_ur");
		var casoprincipal = JumpStartLibXRM.Fx.getValueField(executionContext,"parentcaseid", null);
		
        //Siempre que cambia el tipo de resolución, limpiamos el motivo de resolución por si se ingreso algo antes
        if(!origen){
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_motivoresolucion", null);
        }
        
		if(tipoResolucion == 1 && UrName.toLowerCase() == "reguladores")
		{
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_motivoresolucion");
		}
		else
		{
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_motivoresolucion");
		}
		
        if(!origen && UrName.toLowerCase() != "reguladores"){
            //Se limpia el campo de respuesta
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_respuestacliente", null); //Varias lineas de texto
        }
	},
    
    checkIndicadorQuebranto:function(executionContext){
        //debugger;
        var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
        if(detalleOperacionID){
            if (detalleOperacionID.indexOf("{") > -1){detalleOperacionID = detalleOperacionID.substring(1, 37);}
            var resultado = Caso.buscarDetalleOperacion(executionContext, detalleOperacionID);
            if(resultado){
                var indicadorQueranto = resultado.xmsbs_quebranto;
                var indicadorenFormulario = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_indicadordequebranto", null);
                if(indicadorQueranto && indicadorenFormulario == false){
                    //Setear en si el campo y bloquearlo
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_indicadordequebranto", true);
                    //JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_indicadordequebranto");
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
        
        //Caso.setXrmFormContextWRNumeroOperacion(executionContext);
        //PopUp.openWRNumeroOperacion(executionContext, Caso.URL.Azure, Caso.ApiKey.Key);
	},
    
    onChange_correo: function (executionContext) {
        var myControl = executionContext.getEventSource().getName();
        //debugger;
        var correo = JumpStartLibXRM.Fx.getValueField(executionContext, myControl, null);
        if(correo){
            var validaCorreo = Caso.validarFormatoCorreoRegex(correo);
            if (!validaCorreo)
            {
              JumpStartLibXRM.Fx.setValueField(executionContext, myControl, "");
            }	
        }
    },
    
    onChange_Description: function (executionContext) {
        var obs = JumpStartLibXRM.Fx.getValueField(executionContext, "description", null);
        
        if(obs){        
            obs = obs.replace(/(\r\n|\n|\r)/gm, " ");
            obs = obs.replace(/;/g, ",");
            obs = obs.trim();
            JumpStartLibXRM.Fx.setValueField(executionContext, "description", obs);
        }
    },
	
    onChange_ObservacionesReparo: function (executionContext) {
        var obs = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_observacionesdevisacion", null);
        
        if(obs){        
            obs = obs.replace(/(\r\n|\n|\r)/gm, " ");
            obs = obs.replace(/;/g, ",");
            obs = obs.trim();
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_observacionesdevisacion", obs);
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

    validarFormatoCorreoRegex: function (correo){
      if(!correo.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)){
        return false;
      }
      return true;
    },
    
    onChange_telefonoCelular: function (executionContext) {
        var telefono = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_telefonocelular", null);
        if(telefono){
            var validaTelefono = Caso.validarFormatoTelefonoRegex(telefono);
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

    onChangePicklistGenerico: function(executionContext){
		debugger;
        
        var PickList = executionContext.getEventSource().getName();
	
        //determina el origen en base al nombre
        var OpcionesPickList = "";
        if (PickList.includes("1g"))
            OpcionesPickList = Caso.Form.PickList1_ArrayOptions;
        else if (PickList.includes("2g"))
            OpcionesPickList = Caso.Form.PickList2_ArrayOptions;
        else if (PickList.includes("3g"))
            OpcionesPickList = Caso.Form.PickList3_ArrayOptions;
        else if (PickList.includes("4g"))
            OpcionesPickList = Caso.Form.PickList4_ArrayOptions;
        else if (PickList.includes("5g"))
            OpcionesPickList = Caso.Form.PickList5_ArrayOptions;
    
		var IndexPicklist = executionContext.getFormContext().getAttribute(PickList).getValue();
		if (IndexPicklist != null)
		{
            var ItemSeleccionado = OpcionesPickList.split(";")[IndexPicklist-1];
			JumpStartLibXRM.Fx.setValueField(executionContext, PickList + "_texto", ItemSeleccionado);
		}
		else
		{
			JumpStartLibXRM.Fx.setValueField(executionContext, PickList + "_texto", "");
		}
    },
	
    PicklistGenerico: function(executionContext, CampoPickList,  valores, borrar, label, lectura, predeterminado, requerido, visible) { 
		debugger;
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
                if (CampoPickList.includes("1g"))
                    Caso.Form.PickList1_ArrayOptions = valores;
                else if (CampoPickList.includes("2g"))
                    Caso.Form.PickList2_ArrayOptions = valores;
                else if (CampoPickList.includes("3g"))
                    Caso.Form.PickList3_ArrayOptions = valores;
                else if (CampoPickList.includes("4g"))
                    Caso.Form.PickList4_ArrayOptions = valores;
                else if (CampoPickList.includes("5g"))
                    Caso.Form.PickList5_ArrayOptions = valores;
                
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
                    
                    JumpStartLibXRM.Fx.addOnChange(executionContext, CampoPickList, "Caso.onChangePicklistGenerico");
				}
				else
				{
					// MSG ERROR CONFIGURACION CAMPO
				}
			}
		}
    },	
    
	onChangeSoloNumeros: function(executionContext) {      
        var myControl = executionContext.getEventSource().getName();
        var campo = Xrm.Page.getControl(myControl).getValue();
        campo = campo.replace(/\D/g, '');
        Xrm.Page.getAttribute(myControl).setValue(campo);
        if (campo.length == 11) {
            var campoFormateado = campo.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            Xrm.Page.getAttribute(myControl).setValue(campoFormateado);
        }
	},
	
	onChange_Fecha: function (executionContext) {
        debugger;
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
		//debugger;
        var myControl = executionContext.getEventSource().getName();
        var campo = Xrm.Page.getControl(myControl).getValue();
        if(campo != null) {
			//campo = campo.replace(/[^a-zA-Z ]/g, '');
            campo = campo.replace(/[^a-zA-Z ñÑáéíóúÁÉÍÓÚ]/g, '');
			Xrm.Page.getAttribute(myControl).setValue(campo);
        }
	},

//==================
//FUNCIONES ONSAVE
//==================

	onSave_Formulario: function (executionContext)
	{
        debugger;		
        //var formContext = executionContext.getFormContext();
		//Caso.mostrarFichaSecciones(executionContext, formContext);

		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        //Si el caso se esta recién creando
		if (estado == '1'){
			//llamada a servicio para consultar y actualizar datos propietario, etapa, SLA
            var detalleOperacionID = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledeoperacion", null);
            var idIngresador = JumpStartLibXRM.Fx.getValueField(executionContext, "ownerid", null);
            var idPuntoContacto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_puntodecontacto", null);
            var prioridad = JumpStartLibXRM.Fx.getValueField(executionContext, "prioritycode", null);
            
            var response = null;
            var ApiUrlCreacionCaso = "/Caso/IngresoNativoCRM?idDetalleOperacion=" + detalleOperacionID[0].id + "&idIngresador=" + idIngresador[0].id + "&idPuntoContacto=" + idPuntoContacto[0].id + "&prioridad=" + prioridad;
            //var apiToken = window.sessionStorage.getItem("LokiAuthToken");            
            var service = Caso.GetRequestObject();
            if (service != null)
            {
                service.open("GET", Caso.URL.Azure + ApiUrlCreacionCaso, false);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader(Caso.ApiKey.Name, Caso.ApiKey.Key);
              //  service.setRequestHeader("TokenApi", apiToken);
                service.send(null);
                if (service.response != "") 
                {
                    response = JSON.parse(service.response);
                }
            }
            if (response.success)
            {
                //actualizar etapa
                if(response.erEtapa){
                    var fieldName = "xmsbs_etapa";
                    var id = response.erEtapa.id;
                    var name = response.erEtapa.name;
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
                
                //Refresh del form
                //executionContext.data.refresh(true);
            }
            else{
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "La tipología seleccionada no tiene una configuracion de flujo. Favor contactarse con el administrador de la plataforma"};
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
	    else if (estado == '2')
        {
           // Caso.LoadBotoneraAccionOnsave(executionContext, executionContext.getFormContext());
        }
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
        
        var ApiKey = Caso.buscarApiKey(executionContext);
        var AzureURL = Caso.buscarAzureURL(executionContext);
        
        if(!_casoCreadoNeo && ApiKey != null && AzureURL != null)
        {   
            var response = null;
            var ApiUrl = "Caso/CreateCasosNEO?idIncident=" + incidentId + "&esCreacion=" + _esCreacion + "&comentario=" + _comentario;
           // var apiToken = window.sessionStorage.getItem("LokiAuthToken");             
            var service = Caso.GetRequestObject();

            if (service != null)
            {
                service.open("POST", AzureURL.value[0].xmsbs_valor + ApiUrl, false);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader(Caso.ApiKey.Name, ApiKey.value[0].xmsbs_valor);
               // service.setRequestHeader("TokenApi", apiToken);
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
	ReglasDeNegocio: function (executionContext, etapaID)
	{
        var origen = "JS";
		Caso.onChange_TipoResolucion(executionContext, origen);
        Caso.ValidaQuebrantoParaBloqueo(executionContext);
		Caso.RespuestaGSC(executionContext);
        Caso.ValidaReiteradoEnCreacion(executionContext);
        Caso.ValidaCasosCanceladosParaBloqueoCampos(executionContext);
        Caso.preSearchTipoDocumentoAltaCaso(executionContext);
        Caso.visualizacionReiteradoCasoPrincipal(executionContext);
		Caso.BloqueaCampoFraude(executionContext);
	},
	
    camposSeccionesEtapa: function (executionContext, etapaID)
	{
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
                //debugger;
                //hacemos odata que consulta para el producto el requerimiento que corresponde
                Caso.MostraroDataCamposSecciones(executionContext, etapaID);
                // var respuesta = Caso.oDataCamposSecciones(executionContext, etapaID);
                // if(respuesta){
                //     if (respuesta != null)
                //     {
                //         if (respuesta.value)
                //         {
                //             for (var i = 0; i < respuesta.value.length; ++i)
                //             {
                //                 //Borrar
                //                 if (respuesta.value[i].xmsbs_borrar)
                //                 {
                //                     JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, null);
                //                 }
                //                 //label
                //                 if (respuesta.value[i].xmsbs_label)
                //                 {
                //                     JumpStartLibXRM.Fx.setLabel(executionContext, respuesta.value[i].xmsbs_nombreesquema, respuesta.value[i].xmsbs_label);
                //                 }
                //                 //lectura
                //                 if (respuesta.value[i].xmsbs_lectura)
                //                 {
                //                     JumpStartLibXRM.Fx.disableField(executionContext, respuesta.value[i].xmsbs_nombreesquema);
                //                 }
                //                 else
                //                 {
                //                     JumpStartLibXRM.Fx.enableField(executionContext, respuesta.value[i].xmsbs_nombreesquema);
                //                 }
                //                 //Predeterminado
                //                 if (respuesta.value[i].xmsbs_predeterminado)
                //                 {
                //                     switch (respuesta.value[i].xmsbs_tipocampo)
                //                     {
                //                         case 1:
                //                             JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, respuesta.value[i].xmsbs_predeterminado);
                //                             break;
                //                         case 2:
                //                             var valorInt = parseInt(respuesta.value[i].xmsbs_predeterminado);
                //                             JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, valorInt);
                //                             break;
                //                         case 3:
                //                             var valorInt = parseInt(respuesta.value[i].xmsbs_predeterminado);
                //                             JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, valorInt);
                //                             break;
                //                         case 4:
                //                             if (respuesta.value[i].xmsbs_predeterminado == "true")
                //                             {
                //                                 JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, true);
                //                             }
                //                             else if (respuesta.value[i].xmsbs_predeterminado == "false")
                //                             {
                //                                 JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, false);
                //                             }
                //                             break;
                //                         case 5:
                //                             var valorInt = parseInt(respuesta.value[i].xmsbs_predeterminado);
                //                             JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, valorInt);
                //                             break;
                //                         case 6:
                //                             var valorInt = parseInt(respuesta.value[i].xmsbs_predeterminado);
                //                             JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, valorInt);
                //                             break;
                //                         case 7:
                //                             JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, respuesta.value[i].xmsbs_predeterminado);
                //                             break;
                //                         case 8:
                //                             var date = respuesta.value[i].xmsbs_predeterminado;
                //                             var array = new Array();
                //                             array = date.split('-');
                //                             var anio = parseInt(array[2]);
                //                             var mes = parseInt(array[1]) - 1;
                //                             var dias = parseInt(array[0]);
                //                             var dateParse = new Date(anio, mes, dias);
                //                             JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, dateParse);
                //                             break;
                //                         case 9:
                //                             //campo búsqueda no se puede colocar valor predeterminado
                //                             break;
                //                         case 10:
                //                             //campo cliente no se puede colocar valor predeterminado
                //                             break;
                //                         case 11:
                //                             var valorInt = parseFloat(respuesta.value[i].xmsbs_predeterminado);
                //                             JumpStartLibXRM.Fx.setValueField(executionContext, respuesta.value[i].xmsbs_nombreesquema, valorInt);
                //                             break;
                //                         default:
                //                             break;
                //                     }
                //                 }
                //                 var Ncampo = Caso.terminaEnNumero(respuesta.value[i].xmsbs_nombreesquema);
                //                 //requerido
                //                 if (respuesta.value[i].xmsbs_requerido)
                //                 {
                //                     JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, Ncampo, "required");
                //                 }
                //                 else
                //                 {
                //                     JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, Ncampo, "none");
                //                 }
                //                 //Visibilidad del campo
                //                 if (respuesta.value[i].xmsbs_visible)
                //                 {
                //                     JumpStartLibXRM.Fx.showField(executionContext, respuesta.value[i].xmsbs_nombreesquema);
                //                 }
                //                 else
                //                 {
                //                     JumpStartLibXRM.Fx.hideField(executionContext, respuesta.value[i].xmsbs_nombreesquema);
                //                 }	
                //             }
                //         }
                //         else
                //         {
                //             //alert(responseCampos.modelRespuesta.respuesta);
                //         }
                //     }
                //     else
                //     {
                //         //alert("Error en el consumo del servicio rest api.");
                //     }
                // }
                // else
                // {
                //     //alert("Para ejecutar la validación, es necesario contar con un caso asociado");
                // }
                
                var etapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
                if(etapaID){
                    executionContext.getFormContext().ui.tabs.get("general").sections.get("documentos").setVisible(true); //Botonera
                }
                //debugger;
               // var responseSeccion = Caso.oDataSecciones(executionContext, etapaID);
               
                if(etapaID){
                    Caso.MostraroDataSecciones(executionContext, etapaID);
					Caso.SeccionGrilla(executionContext, etapaID);
                }
                
                
                // if (responseSeccion != null)
				// {
				// 	if (responseSeccion.value)
				// 	{
				// 		var nombreTab = null;
				// 		var nombreSeccion = null;
				// 		var visibleOpcion = null;
				// 		var lectura = null;
				// 		var listaTabs = new Array();
				// 		var nuevoTabs = true;
				// 		var y = 0;
				// 		//visualización de tabs - busca los distintos tabs u hace una lista
				// 		for (var i = 0; i < responseSeccion.value.length; ++i)
				// 		{
				// 			nombreTab = responseSeccion.value[i].xmsbs_tab;
				// 			for (var x = 0; x < listaTabs.length; ++x)
				// 			{
				// 				if (listaTabs[x] == nombreTab)
				// 				{
				// 					nuevoTabs = false;
				// 				}
				// 			}
				// 			if (nuevoTabs)
				// 			{
				// 				listaTabs[y] = nombreTab;
				// 				y = y + 1;
				// 			}
				// 			nuevoTabs = true;
				// 		}
				// 		//Por cada tabs encontrado se da visualización
				// 		for (var i = 0; i < listaTabs.length; ++i)
				// 		{
				// 			executionContext.getFormContext().ui.tabs.get(listaTabs[i]).setVisible(true);
				// 		}
				// 		//VISUALIZACIÓN DE SECCIONES
				// 		for (var i = 0; i < responseSeccion.value.length; ++i)
				// 		{
				// 			nombreTab = responseSeccion.value[i].xmsbs_tab;
				// 			nombreSeccion = responseSeccion.value[i].xmsbs_name;
				// 			visibleOpcion = responseSeccion.value[i].xmsbs_visible;
				// 			lectura = responseSeccion.value[i].xmsbs_lectura;
				// 			//visualización de la sección y su tab
				// 			if (nombreTab != null && nombreSeccion != null && visibleOpcion != null)
				// 			{
				// 				try
				// 				{
				// 					if (visibleOpcion)
				// 					{
				// 						executionContext.getFormContext().ui.tabs.get(nombreTab).sections.get(nombreSeccion).setVisible(true);
				// 					}
				// 					else
				// 					{
				// 						executionContext.getFormContext().ui.tabs.get(nombreTab).sections.get(nombreSeccion).setVisible(false);
				// 					}
				// 				}
				// 				catch (error)
				// 				{
				// 					//alert("La sección "+responseSeccion.listSecciones[i].etiqueta+" no se encuentra en el formulario");
				// 				}
				// 			}
				// 			else
				// 			{
				// 				//alert("Falta información asociada a una sección");
				// 			}
				// 			//Solo lectura de la sección
				// 			if (lectura != null)
				// 			{
				// 				JumpStartLibXRM.Fx.enableOrdisableAllControlsInSection(executionContext, responseSeccion.value[i].xmsbs_etiqueta, lectura);
				// 			}
				// 			else
				// 			{
				// 				JumpStartLibXRM.Fx.enableOrdisableAllControlsInSection(executionContext, responseSeccion.value[i].xmsbs_etiqueta, true);
				// 			}
				// 		}
				// 	}
				// 	else
				// 	{
				// 		//alert(responseSeccion.modelRespuesta.respuesta);
				// 	}
				// }
				// else
				// {
				// 	//alert("Error en el consumo del servicio rest api.");
				// }
			}
			else
			{
				//alert("Para ejecutar la validación, es necesario contar con un caso asociado");
			}
		}
	},	
	
	SeccionGrilla: function (executionContext, etapaId)
	{
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_seccion", "?$" + 
                    "select=_xmsbs_vista_value,xmsbs_etiqueta,xmsbs_lectura,xmsbs_name,xmsbs_tab,xmsbs_visible&$" +
                    "expand=xmsbs_vista($select=xmsbs_codguid,xmsbs_name)&$" +
                    "filter=_xmsbs_vista_value ne null and _xmsbs_etapa_value eq '" +  etapaId.replace(/[{}]/g, "") + "'").then(
            function success(results) {  

                let arraySeccionesGrilla = new Array ();
                
                for (var i = 0; i < results.entities.length; i++) {
					// SE PODRAN MOSTRAR HASTA 3 GRILLAS
					// generalmente solo será 1 grilla por formulario, pero se deja abierta la posibilidad de que puedan ser hasta 3 grillas.
					if (i>2) 
						break; // permite hasta 3 grillas, si por configuración de la matriz existen más, no se deben procesar las excedentes.
				
                    
//                    // Según definición de Negocio, solo podrá ser 1 grilla por tipología.
//                    if (i>0) 
//                        break;
                    
					var nombreTab = results.entities[i]["xmsbs_tab"];
					var nombreSeccion = results.entities[i].xmsbs_name;
					var visibleOpcion = results.entities[i].xmsbs_visible;
					var vista_value = results.entities[i]["_xmsbs_vista_value"];
					var etiqueta = results.entities[i]["xmsbs_etiqueta"];
					var lectura = results.entities[i]["xmsbs_lectura"];
					var vistaGuid = results.entities[i].xmsbs_vista.xmsbs_codguid;

                    arraySeccionesGrilla.push(results.entities[i].xmsbs_seccionid);

                    debugger; 
                    
                    if (visibleOpcion)
                    {
                        executionContext.getFormContext().ui.tabs.get(nombreTab).sections.get(nombreSeccion).setVisible(true);
                        executionContext.getFormContext().ui.tabs.get(nombreTab).sections.get(nombreSeccion).setLabel(etiqueta);
                        Caso.Form.LecturaGrilla = lectura;

                        // se aplica vista por cada grilla.
                        var NombreGrilla = "Grilla" + (i+1) + "Caso";
                        var viewToSet = { entityType: 10434, id:vistaGuid, name: "fieldview" };
                        var subgrid = executionContext.getFormContext().getControl(NombreGrilla);
                        var vs = subgrid.getViewSelector();
                        vs.setCurrentView(viewToSet);
                        subgrid.refresh();
                    }
                }
                
                Caso.Form.SeccionesGrillaID = arraySeccionesGrilla;
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        ); 
		
	},
    
	terminaEnNumero: function (nombreCampo)
	{
		var aux = nombreCampo.substring(nombreCampo.length - 1, nombreCampo.length);
		if (!isNaN(aux) && aux != "0")
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
	
	origenCasoBloqueo: function (executionContext)
	{
        //debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '1')
		{
			var datosOrigen = Caso.datosOrigen(executionContext, Caso.codigoOrigen.CRM);
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

	puntoContactofiltro: function (executionContext)
	{
		var fetchXml = "<filter type='and'><condition attribute='xmsbs_tiporeclamo' operator='eq' value='657130000' /><condition attribute='xmsbs_origenname' operator='like' value='%CRM%' /></filter>";
		executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addCustomFilter(fetchXml);
	},

	puntoContactoBloqueo: function (executionContext)
	{
		//debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '1')
		{
			var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
			if(detalleOperacionID)
			{
				if (detalleOperacionID.indexOf("{") > -1){detalleOperacionID = detalleOperacionID.substring(1, 37);}
			    var respuesta = Caso.buscarDetalleOperacion(executionContext, detalleOperacionID);
				if(respuesta)
				{
					var tiporeclamo = respuesta.xmsbs_tiporeclamo;
					//Formales
					if(tiporeclamo == 657130000) 
					{
						JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_puntodecontacto");
					}
					//Masivos
					else 
					{
						//Contact Center
						if (JumpStartLibXRM.Fx.UserHasRole(executionContext, Caso.Roles.Ejecutivo))
						{
							var datospuntocontacto = Caso.datospuntocontacto(executionContext, Caso.codigopuntocontacto.Contact);
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
						}
						/*
						//Se deja estructura para futuros roles --> Puntos de contacto 
						else if (JumpStartLibXRM.Fx.UserHasRole(executionContext, Caso.Roles.Webcontact))
						{
							var datospuntocontacto = Caso.datospuntocontacto(executionContext, Caso.codigopuntocontacto.Webcontact);
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
						}
						*/
						//Por defecto - Administrador
						else
						{
							var datospuntocontacto = Caso.datospuntocontacto(executionContext, Caso.codigopuntocontacto.Ejecutivo);
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
						}
						
						// debugger;
						var origenEntityType = "xmsbs_puntocontacto";
						JumpStartLibXRM.Fx.setLookupValue(executionContext, "xmsbs_puntodecontacto", canalId, canalName, origenEntityType);
					}
				}
			}
			else
			{
				JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_puntodecontacto");
			}
		}
		else
		{
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_puntodecontacto");
		}
	},	
    
	ocultarFichaSecciones: function (formContext)
	{        
        formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false); //Botonera
        formContext.ui.tabs.get("tab_16").setVisible(false); //Respuesta a cliente
        formContext.ui.tabs.get("tab_12").setVisible(false); //Informacion Adicional
        formContext.ui.tabs.get("tab_10").setVisible(false); //Subrequerimientos
        formContext.ui.tabs.get("tab_21").setVisible(false); //Ley de Fraude
		formContext.ui.tabs.get("tab_11").setVisible(false); //Seguimiento del caso 
        formContext.ui.tabs.get("tab_17").setVisible(false); //Publicaciones
        formContext.ui.tabs.get("tab_15").setVisible(false); //Articulos de conocimiento 
        formContext.ui.tabs.get("tab_14").setVisible(false); //Registros de visación
        formContext.ui.tabs.get("tab_18").setVisible(false); //Casos por Cliente y UR
        
        //ocultamos la sección de ingreso general
        formContext.ui.tabs.get("general").sections.get("ingresoinicial").setVisible(true); //Información inicial
        formContext.ui.tabs.get("general").sections.get("general_section_7").setVisible(false); //Información inicial 2
	},

    mostrarFichaSecciones: function (executionContext, formContext)
	{
        //formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true); //Botonera
        formContext.ui.tabs.get("tab_16").setVisible(false); //Respuesta a cliente
        formContext.ui.tabs.get("tab_12").setVisible(false); //Informacion Adicional
        formContext.ui.tabs.get("tab_11").setVisible(true); //Seguimiento del caso 
        formContext.ui.tabs.get("tab_17").setVisible(true); //Publicaciones
        formContext.ui.tabs.get("tab_15").setVisible(false); //Articulos de conocimiento 
        formContext.ui.tabs.get("tab_14").setVisible(false); //Registros de visación
        formContext.ui.tabs.get("tab_18").setVisible(true); //Casos por Cliente y UR
        
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
            formContext.ui.tabs.get("tab_10").setVisible(false); //Subrequerimientos
            Caso.MostrarSubrequerimientos(executionContext, incidentId);
            // var respuesta = Caso.buscarSubrequerimientos(executionContext, incidentId);
            // if(respuesta.value.length){
            //     formContext.ui.tabs.get("tab_10").setVisible(true); //Subrequerimientos
            // }
            // else{
            //     formContext.ui.tabs.get("tab_10").setVisible(false); //Subrequerimientos
            // }
        }
		
        //ocultamos la sección de ingreso general
        formContext.ui.tabs.get("general").sections.get("general_section_20").setVisible(false); //Tooltips creacion
        formContext.ui.tabs.get("general").sections.get("general_section_21").setVisible(true); //Tooltips edicion		
		
		//Veamos si se muestra o no la seccion de Ley de Fraude
        var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
        if(incidentId){
			//debugger;
            formContext.ui.tabs.get("tab_21").setVisible(false); //Ley de Fraude
            Caso.MostrarLeyFraude(executionContext, incidentId);
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
        
        //mostramos la secciones de detalles del punto de contacto si tiene datos
        var detallesPuntoContacto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledelpuntodecontacto");
        if(detallesPuntoContacto){
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_detalledelpuntodecontacto");
        }
	},
	
	metodoParaNotificar: function (executionContext)
	{
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
	
	BloquearObservacionesYSolucion: function (executionContext)
	{
		//debugger;
		var etapa = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_etapa", null);
		if(etapa)
		{
			var etapaId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
			 Caso.MostraratosEtapa(executionContext, etapaId);
			// var respuesta = Caso.datosEtapa(executionContext, etapaId);
			// if (respuesta)
			// {
            //     if(respuesta.xmsbs_orden != 1)
            //     {
            //         //Si no es Etapa 1, entonces bloqueo los campos 
			// 		JumpStartLibXRM.Fx.disableField(executionContext, "description1");
			// 		JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_solucionesperada1");
            //     }				
			// }
		}
	},

	BloquearCamposDespuesDeCrear: function (executionContext)
	{
		JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_origen");
		JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_puntodecontacto");
	},
    
	OcultaMotivoResolucion: function (executionContext)
	{
        //Oculto los motivos de resolucion originales porque ya no se deben ocupar mas 20231018, solo existen para los casos historicos
        JumpStartLibXRM.Fx.removeOption(executionContext,"xmsbs_motivoresolucion", 657130000);
        JumpStartLibXRM.Fx.removeOption(executionContext,"xmsbs_motivoresolucion", 657130001); 
        JumpStartLibXRM.Fx.removeOption(executionContext,"xmsbs_motivoresolucion", 657130002); 
        JumpStartLibXRM.Fx.removeOption(executionContext,"xmsbs_motivoresolucion", 657130003); 
	},    
    
    ValidaQuebrantoParaBloqueo: function (executionContext)
	{
        var detalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
        if (detalleID.indexOf("{") > -1){detalleID = detalleID.substring(1, 37);}
        var resultado = Caso.tipoReclamoDetalleOperacion(executionContext, detalleID);
        if(resultado){
            var tipoReclamo = resultado.xmsbs_tiporeclamo;
            if(tipoReclamo == 657130001){ //El quebranto es de masivos
                var registroQuebranto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_registroquebranto");
                if(registroQuebranto){ //Si ya hay un registro de quebranto asociado al Caso, se bloquea los controles de accede e indicador
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_indicadordequebranto");
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_tipoderespuesta");
                }
            }
            else{
                if(tipoReclamo == 657130000){ //El quebranto es de formales
                    var registroQuebranto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_registroquebranto");
                    if(registroQuebranto){ //Si ya hay un registro de quebranto asociado al Caso, se bloquea el control de indicador de quebranto
                        JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_indicadordequebranto");
                    }
                }
            }
        }
	},
	
    RespuestaGSC: function (executionContext)
	{
        var UrName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_ur");
        var estadoCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
		
        if(UrName){
			//Valido que el caso este en calidad y estado de cierre (etapa Informar respuesta al cliente)
            var urID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ur");
            if (urID.indexOf("{") > -1){urID = urID.substring(1, 37);}
            var codigoUR = "";
            var respuesta = Caso.buscarCodigoUR(executionContext,urID);
            if(respuesta){
                codigoUR = respuesta.xmsbs_codigo;
            }
            
            if(UrName.toLowerCase() == "gerencia servicio al cliente" || codigoUR.toLowerCase() == "ur-013"){
				if(estadoCaso == 657130001 || estadoCaso == 657130003 || estadoCaso == 5 || estadoCaso == 6){
					JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_viarespuesta");
					JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_respuestafinalgsc");
				}
				else{
					JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_viarespuesta");
					JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_respuestafinalgsc");
				}
            }
        }
	},
    
    ValidaReiteradoEnCreacion:function(executionContext){
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
        //debugger;
        if(marcaReiterado){
            if (tipoFormulario == '1' || tipoFormulario == '3' || tipoFormulario == '4'){
                //Si el Caso se está creando, y además es reiterado, la parte de campos especificos debe estar bloqueado
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "general_section_10", true);
            }
            else{
                if (tipoFormulario == '2'){
                    //Si ya está creado y en edición, y además en reiterado, debemos ver si estamos en la etapa 1 y bloquear los campos
                    var etapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
                    if (etapaID.indexOf("{") > -1){etapaID = etapaID.substring(1, 37);}
                    var resultado = Caso.datosOrdenEtapa(executionContext, etapaID);
                    if(resultado){
                        if(resultado.xmsbs_orden){
                            var orden = resultado.xmsbs_orden;
                            if(orden == 1 || orden == "1"){
                                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
                                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "general_section_10", true);
                            }
                        }
                    }
                }
            }
        }
    },
    
    ValidaCasosCanceladosParaBloqueoCampos:function(executionContext){
        //debugger;
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        if (tipoFormulario == '3' || tipoFormulario == '4'){ // solo lectura o finalizado
            JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
			JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "resolucion", true);
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
	
    BloqueaCampoFraude: function (executionContext){
		
		var flujo = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_flujosantander");
		var FechaAbono = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_fecha1g", null);
		var EstadoCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null); 
		
        if(EstadoCaso != 5){
            if(flujo == "Nvo. Flujo Fraude TC TD 2020"){
                if(FechaAbono == null){
                    //habilito el campo
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_fecha1g");
                }
                else{
                    if(EstadoCaso == 3){
                        //habilito el campo
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_fecha1g");
                    }
                }
            }
        }
    },	
	
	CampoObservacionesReparar: function (executionContext){
		//Funcion para las observaciones al reparar un caso 
		var obs = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_observacionlectura", null);
		if(obs)
		{
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_observacionesdevisacion");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_observacionlectura");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_observacionlectura");
		}
	},	

	SeccionRespuesta: function (executionContext, formContext){
        var UrName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_ur");
        
        if(UrName){
            if(UrName.toLowerCase() != "reguladores"){
                //Valido que la respuesta tenga datos 
                var respuesta = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_respuestacliente", null);
                
                if(respuesta)
                { 
                    formContext.ui.tabs.get("general").sections.get("general_section_8").setVisible(true); //Seccion de respuesta
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_respuestacliente");
                }
                else
                {
                    formContext.ui.tabs.get("general").sections.get("general_section_8").setVisible(false); //Seccion de respuesta
                }
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
    
    displayIconTooltip2: function (rowData, userLCID){
        //debugger;
        var str = JSON.parse(rowData);
        //var coldata = str;
        var aux = Object.keys(str);
        
        var aux1 = aux.find(function(post, index) {
            if(post.endsWith('.xmsbs_estadosla_Value'))
                return true;
        });
        
        var imgName = "";
        var tooltip = "";
        var coldata=str[aux1];
        
        switch (coldata)
        {
            case "1":
                imgName = "xmsbs_verde16";
                tooltip = "En Curso";
                break;
            case "2":
                imgName = "xmsbs_amarillo16";
                tooltip = "Por Vencer";
                break;
            case "3":
                imgName = "xmsbs_verde16";
                tooltip = "Correcto";
                break;
            case "4":
                imgName = "xmsbs_rojo16";
                tooltip = "Vencido";
                break;    
            case "5":
                imgName = "xmsbs_rojo16";
                tooltip = "Cancelado";
                break;        
            case "6":
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

    displayIconTooltip3: function (rowData, userLCID){
        var coldata = "";
		var str = JSON.parse(rowData);
		var idCaso = str.RowId;
        var executionContext = Xrm.Utility.getGlobalContext();
        var bitacoraEtapa = Caso.buscarBitacoraEtapaReciente(executionContext, idCaso);  
        
        if(bitacoraEtapa.value.length > 0)
        {
            coldata = bitacoraEtapa.value[0].xmsbs_estadosla;
        }   
        
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
	
    preSearchTipoDocumentoAltaCaso: function (executionContext){
        //debugger;
		var VisibleCampo = JumpStartLibXRM.Fx.getVisible(executionContext, "xmsbs_documentacinsolicitada");
		if (VisibleCampo)
		{
			var EtapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
			var EtapaName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_etapa", null); 
			var DetalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
			
			// Si tiene especificación a nivel de etapa, entonces filtra por la etapa.
			var respuesta = Caso.oDataTipoDocumentoCaso(executionContext, null, EtapaID);
			if(respuesta){
				if(respuesta.value.length > 0){
					executionContext.getFormContext().getControl("xmsbs_documentacinsolicitada").addPreSearch(Caso.filtrarTipoDocumentoAltaCasoPorEtapa);
                    return;
				}
			}
            
            executionContext.getFormContext().getControl("xmsbs_documentacinsolicitada").addPreSearch(Caso.filtrarTipoDocumentoAltaCasoPorDetOpp);
		}
	},
	oDataTipoDocumentoCaso: function (executionContext, DetalleOperacionID, EtapaId){
        var entityType = "xmsbs_tipodocumentocaso";
		var query = "$select=xmsbs_tipodocumentocasoid";
		if(DetalleOperacionID != null){
			query += "&$filter=(statecode eq 0 and _xmsbs_detalleoperacion_value eq '" + DetalleOperacionID + "')&$top=1";	
		}
		if (EtapaId != null){
			query += "&$filter=(statecode eq 0 and _xmsbs_etapa_value eq '" + EtapaId + "')&$top=1";
		}
		
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },	
    filtrarTipoDocumentoAltaCasoPorEtapa: function (executionContext){
		var EtapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
		var EtapaName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_etapa", null); 		
		// Filtra mediante
		var fetchXml = "<filter type='and'>" + 
			"<condition attribute='statecode' value='0' operator='eq'/>" + 
			"<condition attribute='xmsbs_etapa' operator='eq' uiname='" + EtapaName + "' uitype='xmsbs_etapa' value='" + EtapaID + "'/>" + 
			"</filter>";
		executionContext.getFormContext().getControl("xmsbs_documentacinsolicitada").addCustomFilter(fetchXml);							
	},
    filtrarTipoDocumentoAltaCasoPorDetOpp: function (executionContext){
		//debugger;
		var DetalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
		var DetalleOperacionName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_detalledeoperacion", null);			
		// Filtra mediante
		var fetchXml = "<filter type='and'>" + 
			"<condition attribute='statecode' value='0' operator='eq'/>" + 
			"<condition attribute='xmsbs_detalleoperacion' operator='eq' uiname='" + DetalleOperacionName + "' uitype='xmsbs_detalleoperacion' value='" + DetalleOperacionID + "'/>" + 
			"</filter>";
		executionContext.getFormContext().getControl("xmsbs_documentacinsolicitada").addCustomFilter(fetchXml);					
	},	
    
	//============================================
	//LLAMADAS CRUD (CREATE, READ, UPDATE, DELETE)
	//============================================
	
	
	datosCliente: function (executionContext, clienteId){
		//Preparamos la consulta
		var entityType = "contact";
		var entityId = clienteId;
		var query = "emailaddress1,mobilephone,telephone1,telephone2,xmsbs_email,xmsbs_push,xmsbs_sms,xmsbs_clientenorequierenotificacion";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},	
	
	datosOrigen: function (executionContext, codigoOrigen){
		var entityType = "xmsbs_origen";
		var query = "$select=xmsbs_codigo,xmsbs_name,xmsbs_origenid";
		query += "&$filter=xmsbs_codigo eq '" + codigoOrigen + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},

	datospuntocontacto: function (executionContext, codigopuntocontacto){
		var entityType = "xmsbs_puntocontacto";
		var query = "$select=xmsbs_codigo,xmsbs_name,xmsbs_puntocontactoid";
		query += "&$filter=xmsbs_codigo eq '" + codigopuntocontacto + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},

    datosTipoDetalleOp: function (executionContext, tipoDetalleID){
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
    
    datosTipoDetalle: function (executionContext, tipoDetalleId){
		//Preparamos la consulta
		var entityType = "xmsbs_tipoydetalledeoperacion";
		var entityId = tipoDetalleId;
		var query = "xmsbs_TipodeOperacion,xmsbs_detalledeoperacion";
		var expand = "xmsbs_TipodeOperacion($select=xmsbs_name,xmsbs_tipooperacionid),xmsbs_detalledeoperacion($select=xmsbs_name,xmsbs_detalleoperacionid)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
	},
    
    datosOrdenEtapa: function (executionContext, etapaID){
        //Preparamos la consulta
        var entityType = "xmsbs_etapas";
        var entityId = etapaID;
        var query = "xmsbs_etapaid,xmsbs_orden";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
        return resultado;
    },
    
    oDataCamposSecciones: function (executionContext, etapaId){
        var entityType = "xmsbs_campo";
		var query = "$select=xmsbs_campoid,xmsbs_visible,xmsbs_tipocampo,xmsbs_requerido,xmsbs_predeterminado,xmsbs_nombremostrar,xmsbs_nombreesquema,xmsbs_name,xmsbs_lectura,xmsbs_label,xmsbs_borrar";
		query += "&$filter=statecode eq 0 and _xmsbs_etapa_value eq '" + etapaId + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },
    MostraroDataCamposSecciones: function (executionContext, etapaId){
        var respuesta = new Array();
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_campo", "?$select=xmsbs_borrar,xmsbs_campoid,xmsbs_label,xmsbs_lectura,xmsbs_name,xmsbs_nombreesquema," +
                                            "xmsbs_nombremostrar,xmsbs_predeterminado,xmsbs_requerido,xmsbs_tipocampo,xmsbs_visible,xmsbs_fncjsonchange,xmsbs_valoreseningresoformunico" + 
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
                    respObj.xmsbs_valoreseningresoformunico = results.entities[i]["xmsbs_valoreseningresoformunico"];                    
                    respuesta.push(respObj);
                }
                Caso.MostraroDataCamposSeccionesRespuesta(executionContext, respuesta);
                
                // Llamar las reglas de negocio
				Caso.ReglasDeNegocio(executionContext);
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
                if (respuesta[i].xmsbs_tipocampo == 2 && 
                        (respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist1g" || respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist2g" ||
                         respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist3g" || respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist4g" || respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist5g"))
				{
					// se reutiliza el campo: xmsbs_valoreseningresoformunico para almacenar las opciones del Picklist
					Caso.PicklistGenerico(executionContext, respuesta[i].xmsbs_nombreesquema, respuesta[i].xmsbs_valoreseningresoformunico, 
                                          respuesta[i].xmsbs_borrar, respuesta[i].xmsbs_label, respuesta[i].xmsbs_lectura, respuesta[i].xmsbs_predeterminado, 
                                          respuesta[i].xmsbs_requerido, respuesta[i].xmsbs_visible);
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
                    var Ncampo = Caso.terminaEnNumero(respuesta[i].xmsbs_nombreesquema);
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
                    if (respuesta[i].xmsbs_fncjsonchange)
                    {
                        //debugger;
                        if(respuesta[i].xmsbs_fncjsonchange == 657130000) // Valida RUT
                        {
                            JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "Caso.onChange_rut");
                        }
                        else if(respuesta[i].xmsbs_fncjsonchange == 657130001) // Texto como Número Entero
                        {
                            JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "Caso.onChangeSoloNumeros");
                        }
						else if(respuesta[i].xmsbs_fncjsonchange == 657130002) // Fecha el o antes de hoy
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "Caso.onChange_Fecha");
						}        
                        else if(respuesta[i].xmsbs_fncjsonchange == 657130003) // Texto, solo letras y espacio
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "Caso.onChangeSoloLetra");
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
    
    oDataSecciones: function (executionContext, etapaId){
        var entityType = "xmsbs_seccion";
		var query = "$select=xmsbs_name,xmsbs_etiqueta,xmsbs_tab,xmsbs_etapa,xmsbs_lectura,xmsbs_visible";
		query += "&$filter=statecode eq 0 and _xmsbs_etapa_value eq '" + etapaId + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },
    
    MostraroDataSecciones : function (executionContext, etapaId){
        //debugger;
        var respuestaSecciones = new Array();
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_seccion", "?$select=_xmsbs_etapa_value,xmsbs_etiqueta,xmsbs_lectura,xmsbs_name,xmsbs_tab,xmsbs_visible&$filter=_xmsbs_etapa_value eq '" +  etapaId.replace(/[{}]/g, "") + "'").then(
            function success(results) {               
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
                Caso.MostraroDataSeccionesRespuesta(executionContext, respuestaSecciones);
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        ); 
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
		var entityId = detalleOperacionID;
		var query = "xmsbs_tiporeclamo,xmsbs_quebranto";
		//var expand = "xmsbs_flujosantander($select=xmsbs_name,xmsbs_tiporequerimientoid)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
		return resultado;
    },	
    
    buscarEtapaInicial: function (executionContext, flujoDelProcesoID){
        var entityType = "xmsbs_etapa";
		var query = "$select=xmsbs_etapaid,xmsbs_name";
		query += "&$filter=_xmsbs_flujosantander_value eq '" + flujoDelProcesoID + "' and xmsbs_orden eq 1";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },
	
	datosEtapa: function (executionContext, etapaId){
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
    
    MostraratosEtapa: function (executionContext, etapaId){    
        Xrm.WebApi.online.retrieveRecord("xmsbs_etapa", etapaId.replace(/[{}]/g, ""), "?$select=xmsbs_orden").then(
            function success(result) {               
                var xmsbs_orden = result["xmsbs_orden"];
                var xmsbs_orden_formatted = result["xmsbs_orden@OData.Community.Display.V1.FormattedValue"];
                if(xmsbs_orden != 1)
                {
                    //Si no es Etapa 1, entonces bloqueo los campos 
					JumpStartLibXRM.Fx.disableField(executionContext, "description1");
					JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_solucionesperada1");
                }			
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );              
    },			
    
    buscarSubrequerimientos: function (executionContext, incidentId){
        var entityType = "incident";
		var query = "$select=title";
		query += "&$filter=_parentcaseid_value eq '" + incidentId + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },
    
    MostrarSubrequerimientos: function (executionContext, incidentId){        
        Xrm.WebApi.online.retrieveMultipleRecords("incident", "?$select=title&$filter=_parentcaseid_value eq '" +incidentId.replace(/[{}]/g, "")+"'").then(
            function success(results) {
                var formContext = executionContext.getFormContext();
                if (results.entities.length >0){
                    formContext.ui.tabs.get("tab_10").setVisible(true); //Subrequerimientos
                }
                else{
                    formContext.ui.tabs.get("tab_10").setVisible(false); //Subrequerimientos
                }                 
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
    },
	
    MostrarLeyFraude: function (executionContext, incidentId){        
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_respuestaleyfraude", "?$select=xmsbs_name&$filter=_xmsbs_caso_value eq '" +incidentId.replace(/[{}]/g, "")+"'").then(
            function success(results) {
                var formContext = executionContext.getFormContext();
                if (results.entities.length >0){
                    formContext.ui.tabs.get("tab_21").setVisible(true); //Ley de Fraude
                }
                else{
                    formContext.ui.tabs.get("tab_21").setVisible(false); //Ley de Fraude
                }                 
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
    },	
	
    datosUsuario: function (executionContext, PropietarioId){
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
    
    buscarBitacoraEtapaReciente: function (executionContext, incidentId){
        var entityType = "xmsbs_bitacoraetapas";
		var query = "$select=xmsbs_bitacoraetapaid,_xmsbs_caso_value,xmsbs_estadosla,createdon&$orderby=createdon desc&$top=1";
		query += "&$filter=statecode eq 0 and _xmsbs_caso_value eq '" + incidentId + "'";
		var resultado = Caso.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },	
    
    buscarDocumentosCaso: function (executionContext, idIncident){
        var entityType = "xmsbs_documento";
        var query = "$select=xmsbs_documentoid,xmsbs_obligatoriedad,xmsbs_id,xmsbs_name,xmsbs_caso&$expand=xmsbs_TipoDocumento($select=xmsbs_name,xmsbs_codigo)";
        query += "&$filter=statecode eq 0 and _xmsbs_caso_value eq '" + idIncident + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarMetadatosRespuestaCaso: function (executionContext, idIncident){
        var entityType = "xmsbs_metadatoscartaformaleses";
        var query = "$select=xmsbs_metadatoscartaformalesid,xmsbs_nombrecontactosernac,xmsbs_prefijodestinatario,xmsbs_cargodestinatario,xmsbs_referenciacasosolicitante,xmsbs_telefonocontactobanco,xmsbs_tomarcontactocargo,xmsbs_tomarcontactonombre,xmsbs_derivadoa,xmsbs_correocontactobanco";
        query += "&$filter=_xmsbs_caso_value eq '" + idIncident + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarTipoDatoProducto: function (executionContext, idProducto){
        //Preparamos la consulta
		var entityType = "xmsbs_productoservicio";
		var entityId = idProducto;
		var query = "xmsbs_name,xmsbs_tipodedato";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
		return resultado;
    },
    
    datosPreguna2caso: function (executionContext, pregunta2caso){
        //Preparamos la consulta
        var entityType = "xmsbs_pregunta2delcaso";
        var entityId = pregunta2caso;
        var query = "_xmsbs_detalledeoperacion_value";
        
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
        return resultado;
    },

    buscaTipoDetalle: function (executionContext, detalleOperacionID){
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
    
    buscarCasosClienteUR: function (executionContext, idCliente, idUR){
        var entityType = "incident";
        var query = "$select=ticketnumber,ownerid,statecode,statuscode,createdon,title,_xmsbs_cliente_value,xmsbs_rut,xmsbs_numerocorrelativo,_xmsbs_ur_value,_xmsbs_producto_value,_xmsbs_tipodeoperacion_value,_xmsbs_detalledeoperacion_value,_xmsbs_detalledetipologia_value,_xmsbs_tipoderequerimiento_value&$orderby=createdon desc";
        query += "&$filter=xmsbs_ingresounicofinalizado eq true and _xmsbs_cliente_value eq '" + idCliente + "' and _xmsbs_ur_value eq '" + idUR + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarIntegranteUR: function (executionContext, idUsuario, idUR){
        var entityType = "xmsbs_integranteur";
        var query = "$select=_xmsbs_usuario_value,_xmsbs_unidadresolutora_value&$orderby=createdon desc";
        query += "&$filter=statecode eq 0 and _xmsbs_usuario_value eq '" + idUsuario + "' and _xmsbs_unidadresolutora_value eq '" + idUR + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarCamposParaReiterado: function (executionContext, flujoId){
        var entityType = "xmsbs_campos";
        var query = "$select=xmsbs_campoid,xmsbs_tipocampo,xmsbs_nombreesquema&$expand=xmsbs_etapa";
        query += "&$filter=(xmsbs_etapa/xmsbs_orden eq 1 and xmsbs_etapa/_xmsbs_flujosantander_value eq "+flujoId+")&$orderby=xmsbs_tipocampo asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarApiKey: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + Caso.ApiKey.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
    buscarAzureURL: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + Caso.URL.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
    
    buscarProducto: function (executionContext, idProducto){
		//Preparamos la consulta
		var entityType = "xmsbs_productoservicio";
		var entityId = idProducto;
		var query = "xmsbs_name";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},	
    
    buscarTipoRequerimiento: function (executionContext, idTipoRequerimiento){
		//Preparamos la consulta
		var entityType = "xmsbs_tiporequerimiento";
		var entityId = idTipoRequerimiento;
		var query = "xmsbs_name";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarTipoOperacion: function (executionContext, idTipoOperacion){
		//Preparamos la consulta
		var entityType = "xmsbs_tipooperacion";
		var entityId = idTipoOperacion;
		var query = "xmsbs_name";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarTipoYDetalleOperacion: function (executionContext, idTipoYDetalle){
		//Preparamos la consulta
		var entityType = "xmsbs_tipoydetalledeoperacion";
		var entityId = idTipoYDetalle;
		var query = "xmsbs_name";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    tipoReclamoDetalleOperacion: function (executionContext, DetalleID){
		//Preparamos la consulta
		var entityType = "xmsbs_detalleoperacions";
		var entityId = DetalleID;
		var query = "xmsbs_tiporeclamo";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarCodigoUR: function (executionContext, IdUr){
		//Preparamos la consulta
		var entityType = "xmsbs_unidadresolutoras";
		var entityId = IdUr;
		var query = "xmsbs_unidadresolutoraid,xmsbs_name,xmsbs_codigo";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    buscarTipoReclamoUsuario: function (executionContext, idUsuario){
        //Preparamos la consulta
        var entityType = "systemusers";
        var entityId = idUsuario;
        var query = "xmsbs_atiendereclamotipo";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
        return resultado;
    },
    
    crearAccionEjecutada: function (executionContext, modelo){
        //debugger;
        var bitacoraEtapaId = null;
        var accionEtapaId = null;
        var incidentId = modelo.casoId;
        
        if (incidentId.indexOf("{") > -1)
        {
            incidentId = incidentId.substring(1, 37);
        }
        
        var bitacoraEtapa = Caso.buscarBitacoraEtapa(executionContext, incidentId);
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
    
    validateDocumentos: function (executionContext, idIncident){
        //debugger;
        var documentosCaso = Caso.buscarDocumentosCaso(executionContext, idIncident)
        if (!documentosCaso || documentosCaso.value.length === 0) {
            var ObjReturn = {}
            ObjReturn['success'] = true;
            ObjReturn['message'] = 'Ok';

            return ObjReturn;
        }
        else {
            var ObjReturn = {}
            var documentosObligatorios = 0;
            for (var i = 0; i < documentosCaso.value.length; i++) {
               if(documentosCaso.value[i].xmsbs_obligatoriedad && documentosCaso.value[i].xmsbs_id == null && documentosCaso.value[i].xmsbs_TipoDocumento.xmsbs_codigo != "TD-298"){
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
    
    onChange_fechaDeCobro: function (executionContext) {
        //debugger;
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaCargo = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechadecobro", null);
        if(fechaCargo){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaCargo.setDate(fechaCargo.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de cobro no puede ser mayor al día de hoy", title: "Fecha de cobro invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechadecobro", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechadecobro");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
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
                var url = Caso.URL.Azure + "/HTML/GestionCaso/ResolverCaso.html?idIncident=" + incidentId;
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
		if (estado == '2'){     
            let array = new Array ();
            Caso.RolesArray.SystemUser.forEach(
            function (x){
                array.push(x);
            }
            );
           
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
            var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
            if(esPropietario){
				return false;
			}
			else{
                return found;				
			}          
            //return true;
			// var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
			// var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext, "Administrador del sistema");
            // var asAdmin2 = JumpStartLibXRM.Fx.UserHasRole(executionContext, "System Administrator");
			

			// if(esPropietario)
			// {
			// 	return false;
			// }
			// else
			// {
			// 	if(asAdmin || asAdmin2)
			// 	{
			// 		return true;
			// 	}
			// 	else
			// 	{
			// 		return false;
			// 	}
			// }
		}
        else{
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
        
		if (estado == '2' && origen != 'crm adquirencia') {   
            let array = new Array ();
            Caso.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
            );
            Caso.RolesArray.SantanderUrAdmin.forEach( 
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
		PopUp.openWRAsignarCaso(Caso.Form.Context, Caso.URL.Azure, Caso.ApiKey.Key);
	},	
	
	enableButtonSLA: function (executionContext){
		//debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '2') {   
            let array = new Array ();
            Caso.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
            );
            Caso.RolesArray.SantanderUrAdmin.forEach( 
                function (x){
                    array.push(x);
                });
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
            return found;    

            //return true;
			//var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext, "Administrador del sistema");
            //var asAdmin2 = JumpStartLibXRM.Fx.UserHasRole(executionContext, "System Administrator");
            //var asSuper = JumpStartLibXRM.Fx.UserHasRole(executionContext, "[Santander] - UR Administrador");

			// if(asAdmin || asSuper || asAdmin2)
			// {
			// 	return true;
			// }
			// else
			// {
			// 	return false;
			// }
		}
        else {
            return false;
        }
	},	

	onClickButtonSLA: function (executionContext) {	
		//debugger;
       
        if(confirm("Va a modificar el SLA establecido en el Caso. ¿Desea Continuar?")){
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
	
	enableButtonReiterar: function (executionContext){		
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '4'){     
            return true;         
		}
        else{
            return false;
        }
	},	

	onClickButtonReiterar: function (executionContext){
		//debugger;
		//valida que tenga menos de 3 meses
		var fechaFin = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_fechadetermino", null);
		var hoy = new Date();
		
		var fechaResultado = hoy - fechaFin;
		var cantidadDias = fechaResultado / (1000 * 60 * 60 * 24);

		if(cantidadDias < 90){
			
			//valida que sea el primer caso reiterado
			var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext); 
			Xrm.WebApi.online.retrieveMultipleRecords("incident", "?$select=title&$filter=xmsbs_marcareiterado eq true and _parentcaseid_value eq '" +incidentId.replace(/[{}]/g, "")+"'").then(
			//Xrm.WebApi.online.retrieveMultipleRecords("incident", "?$select=title&$filter=_parentcaseid_value eq '" +incidentId.replace(/[{}]/g, "")+"'").then(
				function success(results) {
					if (results.entities.length >0){
						//Mensaje indicando que no se puede abrir un caso reiterado pq ya existe otro caso reiterado 
						var alertStrings = { confirmButtonLabel: "Aceptar", title: "Validación", text: "El caso ya cuenta con un caso de Reiteración. No puede continuar con esta acción"};
						var alertOptions = { height: 120, width: 260 };
						Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
							function (success) {
								//console.log("Alert dialog closed");
								//JumpStartLibXRM.Fx.formSaveAndClose(executionContext);
							},
							function (error) {
								//console.log(error.message);
							}
						);
					}
					else{
						var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Caso Reiterado", subtitle:"Va a crear un nuevo caso asociado a éste. ¿Desea Continuar?"};
						var confirmOptions  = { height: 200, width: 260 };
						Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
							function (success) {
								if(success.confirmed)
								{
									//Si confirma
									//debugger;
									var entityFormOptions = {};
									entityFormOptions["entityName"] = "incident";
									entityFormOptions["openInNewWindow"] = false;
									
									var formParameters = {};
									
									//Set lookup field
									var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
									if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
									
									//Set lookup Cliente
									var ClienteId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "customerid");
									if (ClienteId.indexOf("{") > -1){ClienteId = ClienteId.substring(1, 37);}
									var ClienteName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "customerid");

									//Set lookup UR
									var urId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ur");
									if (urId.indexOf("{") > -1){urId = urId.substring(1, 37);}
									var urName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_ur");	

									//Set lookup Punto de Contacto
									var PuntoContactoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_puntodecontacto");
									if (PuntoContactoId.indexOf("{") > -1){PuntoContactoId = PuntoContactoId.substring(1, 37);}
									var PuntoContactoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_puntodecontacto");
									
									//Set lookup OwnerId
									var PropietarioId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
									if (PropietarioId.indexOf("{") > -1){PropietarioId = PropietarioId.substring(1, 37);}
									var PropietarioName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "ownerid");
									
									//Set lookup Producto
									var ProductoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto");
									if (ProductoId.indexOf("{") > -1){ProductoId = ProductoId.substring(1, 37);}
									var ProductoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_producto");

									//Set lookup Tipo y Detalle
									var TipoDetalleId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
									if (TipoDetalleId.indexOf("{") > -1){TipoDetalleId = TipoDetalleId.substring(1, 37);}
									var TipoDetalleName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_detalledetipologia");									

									//Resto de campos 
									var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
									var observaciones = JumpStartLibXRM.Fx.getValueField(executionContext, "description", null);
									var solucion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_solucionesperada", null);
									
									//Campos del Cliente
									if (ClienteId)
									{						
										var datosCliente = RepositorioSucesos.datosCliente(executionContext, ClienteId);
										if (datosCliente)
										{
											if (datosCliente.mobilephone != null){
												var telefono = datosCliente.mobilephone;
											}
											else{
												var telefono = null;
											}
											if (datosCliente.emailaddress1 != null){
												var correoElectronico = datosCliente.emailaddress1;
											}
											else{
												var correoElectronico = null;
											}
											if (datosCliente.xmsbs_clientenorequierenotificacion != null){
												var nonotificar = datosCliente.xmsbs_clientenorequierenotificacion;
											}
											else{
												var nonotificar = null;
											}
											if (datosCliente.xmsbs_sms != null){
												var sms = datosCliente.xmsbs_sms;
											}
											else{
												var sms = null;
											}
											if (datosCliente.xmsbs_push != null){
												var push = datosCliente.xmsbs_push;
											}
											else{
												var push = null;
											}
											if (datosCliente.xmsbs_email != null){
												var email = datosCliente.xmsbs_email;
											}
											else{
												var email = null;
											}		
											if (datosCliente.lastname != null){
												var apellidopaterno = datosCliente.lastname;
											}
											else{
												var apellidopaterno = null;
											}
											if (datosCliente.middlename != null){
												var apellidomaterno = datosCliente.middlename;
											}
											else{
												var apellidomaterno = null;
											}
											if (datosCliente.firstname != null){
												var nombrecliente = datosCliente.firstname;
											}
											else{
												var nombrecliente = null;
											}
											if (datosCliente.xmsbs_clientesantander != null){
												var clientesantander = datosCliente.xmsbs_clientesantander;
											}
											else{
												var clientesantander = null;
											}
											
											if (datosCliente.xmsbs_preferenciacontacto != null){
												var preferenciascontacto = datosCliente.xmsbs_preferenciacontacto;
												var prefernciasLista = preferenciascontacto.split(",");
												
												var preferenciasarray = new Set();
												var valoresPreferencias;
												for(var i = 0; i < prefernciasLista.length; i++){
													 preferenciasarray.add(Number.parseInt(prefernciasLista[i]));
												}
												valoresPreferencias = Array.from(preferenciasarray);
												preferenciascontacto = valoresPreferencias;
												
											}
											else{
												var preferenciascontacto = null;
											}
										
											formParameters["xmsbs_telefonocelular"] = telefono;
											formParameters["xmsbs_emailcliente"] = correoElectronico;
											formParameters["xmsbs_clientenorequierenotificacion"] = nonotificar;
											formParameters["xmsbs_sms"] = sms;
											formParameters["xmsbs_push"] = push;
											formParameters["xmsbs_email"] = email;
											formParameters["xmsbs_apellidopaterno"] = apellidopaterno;					
											formParameters["xmsbs_apellidomaterno"] = apellidomaterno;
											formParameters["xmsbs_nombrecliente"] = nombrecliente;
											formParameters["xmsbs_clientesantander"] = clientesantander;
											formParameters["xmsbs_preferenciasdecontacto"] = preferenciascontacto;
											
										}
									}						
									
									formParameters["parentcaseid"] = incidentId;
									formParameters["parentcaseidname"] = JumpStartLibXRM.Fx.getValueField(executionContext, "title", null);
									formParameters["customerid"] = ClienteId;
									formParameters["customeridname"] = ClienteName;
									formParameters["xmsbs_cliente"] = ClienteId;
									formParameters["xmsbs_clientename"] = ClienteName;
									formParameters["xmsbs_urtipologia"] = urId;
									formParameters["xmsbs_urtipologianame"] = urName;
									formParameters["xmsbs_rut"] = rut;					
									//formParameters["description"] = observaciones;
									//formParameters["xmsbs_solucionesperada"] = solucion;
									formParameters["prioritycode"] = 1;
									formParameters["xmsbs_puntodecontacto"] = PuntoContactoId;
									formParameters["xmsbs_puntodecontactoname"] = PuntoContactoName;
									formParameters["xmsbs_marcareiterado"] = true;
									formParameters["xmsbs_producto"] = ProductoId;
									formParameters["xmsbs_productoname"] = ProductoName;
									formParameters["xmsbs_detalledetipologia"] = TipoDetalleId;
									formParameters["xmsbs_detalledetipologianame"] = TipoDetalleName;
                                    debugger;
                                    //Hacemos la busqueda para obtener los valores dinámicos
                                    var flujoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_flujosantander");
                                    if (flujoId.indexOf("{") > -1){flujoId = flujoId.substring(1, 37);}
                                    var resultado = Caso.buscarCamposParaReiterado(executionContext,flujoId);
                                    
                                    if(resultado){
                                        if(resultado.value.length > 0){
                                            //Si trajo campos, los debemos recorrer
                                            for(var i = 0; i<resultado.value.length; i++ ){
                                                var tipoCampo = resultado.value[i].xmsbs_tipocampo;
                                                if(tipoCampo != 9){
                                                    var nombreEsquema = resultado.value[i].xmsbs_nombreesquema;
                                                    var valorCampo = JumpStartLibXRM.Fx.getValueField(executionContext, nombreEsquema, null);
                                                    
                                                    //lo inyectamos como parámetro
                                                    formParameters[nombreEsquema] = valorCampo;
                                                }
                                                else{
                                                    //Es de búsqueda, consultamos por el valueID
                                                    var nombreEsquema = resultado.value[i].xmsbs_nombreesquema;
                                                    var valorCampo = JumpStartLibXRM.Fx.getLookupValueId(executionContext, nombreEsquema);
                                                    
                                                    //lo inyectamos como parámetro
                                                    formParameters[nombreEsquema] = valorCampo;
                                                }
                                            }
                                        }
                                    }
									
                                    Xrm.Utility.openEntityForm("incident", null, formParameters, entityFormOptions);    			
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
					}                 
				},
				function(error) {
					Xrm.Utility.alertDialog(error.message);
				}
			);
		}
		else{
			//Mensaje indicando que no se puede abrir un caso reiterado pq ya no esta dentro del rango de tiempo
			var alertStrings = { confirmButtonLabel: "Aceptar", title: "Validación", text: "Este caso ya tiene mas de 90 días desde su fecha de término. No puede abrir una Reiteración."};
			var alertOptions = { height: 120, width: 260 };
			Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
				function (success) {
					//console.log("Alert dialog closed");
					//JumpStartLibXRM.Fx.formSaveAndClose(executionContext);
				},
				function (error) {
					//console.log(error.message);
				}
			);
		}	
	},
    
    enableButtonAutoAsignarse: function (executionContext){
        //debugger;
        var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        var formulario = JumpStartLibXRM.Fx.getFormName(executionContext);
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
        var idOwner = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
        
        if (estado == '2' && formulario.toLowerCase() == "caso" && idUsuario != idOwner)
        {
            let array = new Array ();
            
            Caso.RolesArray.SystemUser.forEach( 
                function (x){
                    array.push(x);
                }
            );
            
            Caso.RolesArray.SantanderContactCenterEjecutivo.forEach( 
                function (x){
                    array.push(x);
                }
            );
            
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);            
            let esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
            
            if(esPropietario)
            {
				return false;
			}
			else
            {
                return found;				
			} 
        }
        else
        {
            return false;
        }        
    },
    
    onClickButtonAutoAsignarse: function (executionContext){
        //debugger;
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
        var usuario = JumpStartLibXRM.Fx.getUserName();
        var idUR = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ur");
        var UR = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_ur", "");
        
        if (idUsuario.indexOf("{") > -1)
        {
            idUsuario = idUsuario.substring(1, 37);
        }
        
        if (idUR.indexOf("{") > -1)
        {
            idUR = idUR.substring(1, 37);
        }
        
        var integranteUR = Caso.buscarIntegranteUR(executionContext, idUsuario, idUR);
        
        if(integranteUR.value.length > 0)
        {            
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Información", subtitle:"Va a auto-asignarse el caso. ¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos"};
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed)
                    {
                        JumpStartLibXRM.Fx.setLookupValue(executionContext, "ownerid", idUsuario, usuario, "systemuser");
                        JumpStartLibXRM.Fx.formSave(executionContext);
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
        }
        else
        {
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "El usuario " + usuario.toLowerCase() + " no es integrante de la unidad resolutora " + UR.toLowerCase() + ". No se puede realizar la auto-asignación."};
            var alertOptions = { height: 130, width: 260 };
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
    
    cambioFormulario: function (executionContext){
        debugger;
        var formDestino = "";
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        
        //Obtener el formulario en el que debería estar
        if (tipoFormulario == '1'){   
            //Creación, ver cual es el form actual, y redirigir si no corresponde según: Configuración usuario
            var atiendeReclamoTipo = "";
            var IdUsuario = JumpStartLibXRM.Fx.getUserId();
            if (IdUsuario.indexOf("{") > -1){IdUsuario = IdUsuario.substring(1, 37);}
            var resultado = Caso.buscarTipoReclamoUsuario(executionContext,IdUsuario);
            if(resultado){
                atiendeReclamoTipo = resultado.xmsbs_atiendereclamotipo;
                if(atiendeReclamoTipo == 657130000){
                    //Reguladores
                    formDestino = Caso.Formularios.Reguladores;
                }
                else{
                    formDestino = Caso.Formularios.Masivos;
                }
            }
            else{
                formDestino = Caso.Formularios.Masivos;
            }
        }
        else{
            //Caso Creado, ver cual es la tipología y redirigir si no corresponde según: Tipo de Reclamo en Detalle de Operación
            var detalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
            if (detalleID.indexOf("{") > -1){detalleID = detalleID.substring(1, 37);}
            var resultado = Caso.tipoReclamoDetalleOperacion(executionContext, detalleID);
            if(resultado){
                var tipoReclamo = resultado.xmsbs_tiporeclamo;
                if(tipoReclamo == 657130001){ //masivos
                    formDestino = Caso.Formularios.Masivos;
                }
                else{
                    if(tipoReclamo == 657130000){ //formales
                        formDestino = Caso.Formularios.Reguladores;
                    }
                }
            }
        }
        
        //Redirigir
        var Information = "";
        var forms = formContext.ui.formSelector.items.get();
        var formActual = formContext.ui.formSelector.getCurrentItem().getLabel().toLowerCase();
        if (formActual != formDestino.toLowerCase()) {
            for (var i = 0; i < forms.length; i++) {
                if (forms[i].getLabel().toLowerCase() == formDestino.toLowerCase()) {
                    Information = forms[i];
                    //setTimeout(function () {
                        Information.navigate();
                        return false;
                    //},
                    //2000);
                }
            }
        }
        return true;
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
    //=======
	//PlugIn Action
	//=======
    
    //Call custom action function
    retrieveMultipleRecords: function(executionContext, type, options) {
        ///
        /// Sends an asynchronous request to retrieve records.
        ///
        ////// The Schema Name of the Entity type record to retrieve.
        /// For an Account record, use "Account"
        /// ////// A String representing the OData System Query Options to control the data returned
        /// ////// The function that will be passed through and be called for each page of records returned.
        /// Each page is 50 records. If you expect that more than one page of records will be returned,
        /// this function should loop through the results and push the records into an array outside of the function.
        /// Use the OnComplete event handler to know when all the records have been processed.
        /// ////// The function that will be passed through and be called by a failed response.
        /// This function must accept an Error object as a parameter.
        /// ////// The function that will be called when all the requested records have been returned.
        /// No parameters are passed to this function.
        Caso.stringParameterCheck(type, "SDK.WEBAPI.retrieveMultipleRecords requires the type parameter is a string.");
        if (options != null)
            Caso.stringParameterCheck(options, "SDK.WEBAPI.retrieveMultipleRecords requires the options parameter is a string.");
        //this._callbackParameterCheck(successCallback, "SDK.WEBAPI.retrieveMultipleRecords requires the successCallback parameter is a function.");
        //this._callbackParameterCheck(errorCallback, "SDK.WEBAPI.retrieveMultipleRecords requires the errorCallback parameter is a function.");
        //this._callbackParameterCheck(OnComplete, "SDK.WEBAPI.retrieveMultipleRecords requires the OnComplete parameter is a function.");

        if (type.slice(-1) != "s") {
            type = type + "s";
        }

        var optionsString;
        if (options != null) {
            if (options.charAt(0) != "?") {
                optionsString = "?" + options;
            } else {
                optionsString = options;
            }
        }
        var data = null;
        var req = new XMLHttpRequest();
        req.open("GET", Caso.webAPIPath(executionContext) + type + optionsString, false);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Prefer", "odata.include-annotations=\"*\"");
        req.onreadystatechange = function() {
            if (this.readyState == 4 /* complete */ ) {
                req.onreadystatechange = null;
                if (this.status == 200) {
                    data = JSON.parse(this.response, Caso.dateReviver)
                    //successCallback(data);
                    //OnComplete();
                } else {
                    //errorCallback(SDK.WEBAPI._errorHandler(this));
                    data = null
                }
            }
        };
        req.send();
        
        return data;
    },
    
    stringParameterCheck: function(parameter, message) {
        ///
        /// Private function used to check whether required parameters are null or undefined
        ///

        ////// The string parameter to check;
        /// ////// The error message text to include when the error is thrown.
        if (typeof parameter != "string") {
            throw new Error(message);
        }
    },
    
    webAPIPath: function(executionContext) {
        ///
        /// Private function to return the path to the REST endpoint.
        ///
        var globalContext = Xrm.Utility.getGlobalContext();
        ///String
        return globalContext.getClientUrl() + "/api/data/v9.1/";
    },
    
    dateReviver: function(key, value) {
        ///
        /// Private function to convert matching string values to Date objects.
        ///

        ////// The key used to identify the object property
        /// ////// The string value representing a date
        /// var a;
        if (typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    },
    
    actionProcessingMethod:function (incidentId) {        
        var getmetadata = {
                boundParameter: null,
                parameterTypes: {
                                    "incidentId": {
                                                "typeName": "Edm.String",
                                                "structuralProperty": 1 
                                                }
                                    },
                    operationType: 0, 
                    operationName: "xmsbs_CasoGetAcciones"
        };
        
        var obj = {
           incidentId: incidentId,
           getMetadata : getmetadata
            };       
        return obj;
    },
    ActionCallingFunction: function (executionContext, formContext) {
        //debugger;
        //Stage 1 - Input Parameter For Action
        var parameters = {
            incidentId: formContext.data.entity.getId().replace(/[{}]/g, "")
        };
        try {           
    //		//Stage 2 - Data Intialization Parameter For Action
                var actionData =  Caso.actionProcessingMethod (parameters.incidentId);
    //
    //            //Triggering The Action Process With Web API.
                Xrm.WebApi.online.execute(actionData).then(
                    function (data) {
                        if (data.ok) {
                            data.json().then(function (response) {
    						
    						//Stage 3 - Checking Output Parameter From Custom Code
                                if (response.SuccessCallBack == true) {
    						    console.log("Sucessfully Executed Web Service xmsbs_CasoGetAcciones");
                                }
                                else {
                                    console.log("Error Occured While Calling Action : " + response.SuccessCallBack);
                                }
                            });
                        }
                    },
                    function (error) {
                        console.log("Error occcurred in executing Global Action");
                        console.log(JSON.stringify(error));
                    });
            }
            catch (e) {
                console.log("Error Occured in while calling process : " + JSON.stringify(e));
            }
        },
};