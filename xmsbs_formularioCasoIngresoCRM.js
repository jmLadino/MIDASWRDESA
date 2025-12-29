if (typeof(CasoIngresoCRM) == "undefined") {
    CasoIngresoCRM = {
        __namespace: true
    };    
}

CasoIngresoCRM = {
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
		Visibilidadpicklist2g:null,
		EtapaID:null,
		EtapaName:null,
		FormTypePreSave: 0,
		DOConMov: null,
		DOPolizas: null,
        DOSucursal: null,
		CampoCalidadParticipacion: null,
		CampoGlosaSubProducto:null,
        CargaCamposDinamicosCompleta:null,
		FormOKSave:true,
        FormNoOKMotivo:"",
		ValidacionGenerica_Parametros:[],
		VisibilidadCamposSecundarios:[],
		VisibilidadCampos:[],
		DetalleOperacionID:null,
		IndexBloqueadosPicklistGenerico:[],
        UsuarioHabilitadoCreacionCaso:false
    },
    Formulario: {        
        CasoTestMejora: "CasoTestMejora" 
    },
    Formularios: {
        Reguladores: "Caso",
        Masivos: "Caso Ingreso Único"
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
                            "6221ca30-f8d6-44ea-a0f2-d5e50e9a77c2",
							"b93c3b2a-16e6-4d00-9346-f0a604b2c993"]
    },
	codigopuntocontacto: {
		Ejecutivo: "PC-002",
		Contact: "PC-003"
	},
	codigoOrigen: {
		CRM: "O-002"
    },
    variableGlobal: {
        grillaCasosPorUR: 0,
        preguntaInvalida: false,
        usuarioId: ""
    },
    tipoDetalleOperacion: {
        id: "",
        nombre: ""
    },
    tipoIntegracion: {
        contrato: "657130000"
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
    Usuario: {
        Administrador: "Dynamics_CRM_MIDAS_CL_DEV"
    },
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
        //Validación cambio de formulario
        debugger;
        if(!CasoIngresoCRM.cambioFormulario(executionContext)){return;}
        
        //var test = onApiButtonClickAsync(executionContext);
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        CasoIngresoCRM.setApiKey(executionContext);
        CasoIngresoCRM.setAzureURL(executionContext);
        CasoIngresoCRM.formContext = executionContext.getFormContext();			
        CasoIngresoCRM.variableGlobal.usuarioId = JumpStartLibXRM.Fx.getUserId();

        CasoIngresoCRM.Form.Context = executionContext;
        CasoIngresoCRM.Form.executionContext = executionContext;
        CasoIngresoCRM.Form.formContext = formContext;
        
        CasoIngresoCRM.arrayFrom();
        formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false); //Botonera
        
        var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
        
		if (tipoFormulario == '1')
        {            
			CasoIngresoCRM.ocultarFichaSecciones(formContext);
            CasoIngresoCRM.origenCasoBloqueo(executionContext);
			//CasoIngresoCRM.puntoContactoBloqueo(executionContext);
			//CasoIngresoCRM.buscarInstitucion(executionContext);
			CasoIngresoCRM.preSearchCanalIngreso(executionContext);
			CasoIngresoCRM.BloquearObservacionesYSolucion(executionContext);
            CasoIngresoCRM.onChange_canalIngreso(executionContext);
            
            executionContext.getFormContext().getControl("xmsbs_preferenciasdecontacto").removeOption(657130000);

            
            var casopadre = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
            if(marcaReiterado || casopadre){ //si es reiterado, hay que forzar el onchange del producto y tipoydetalle
                CasoIngresoCRM.validaUltimaPreguntaEnOnLoad(executionContext);
                CasoIngresoCRM.onChange_tipoDetalleOperacion(executionContext);
                
                //FU: Se deben bloquear los campos de las secciones, menos solución esperada y descripción
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "datoscliente", true);
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "datosingreso", true);
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "datoscaso", true);
                
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_solucionesperada");
                JumpStartLibXRM.Fx.enableField(executionContext, "description");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_puntodecontacto");
                
                //Desbloqueo pedidos por Janina:
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_preferenciasdecontacto");
                
                CasoIngresoCRM.validaVisibilidadCamposTipologia(executionContext, tipoFormulario);
                CasoIngresoCRM.onChange_canalIngreso(executionContext);
                
                if(casopadre){ // si estamos en creación y es un subrequerimiento
                    var familiaProducto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_familiaproducto", null); 
                    var descripcionProblema = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_descripcionproblema", null);
                    var pregunta2 = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_pregunta2", null);
                    var producto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_producto", null);
                    var detalleTipologia = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledetipologia", null);
                    
                    if(!familiaProducto && !descripcionProblema && !pregunta2 && !producto && !detalleTipologia){
                        //Si estamos en CasoIngresoCRM, es creación, es subrequerimiento y no hay datos en ninguna parte del arbol, para crear un nuevo substr
                        
                        //ocultamos la sección datoscaso2 y mostramos la datoscaso
                        formContext.ui.tabs.get("general").sections.get("datoscaso2").setVisible(false); //Datos del Caso2
                        formContext.ui.tabs.get("general").sections.get("datoscaso").setVisible(true); //Datos del Caso para el alta
                        
                        //Desbloqueamos familiaProducto que es el primer nivel de ingreso para subrequerimiento nuevo
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_familiaproducto");
                        
                        //Darle a xmsbs_descripcionproblema un filtrolookup para filtrar solo por subrequerimientos
                        executionContext.getFormContext().getControl("xmsbs_descripcionproblema").addPreSearch(CasoIngresoCRM.filtrarLookupDescripcionProblema);
                    }
                }
            }
            else
            {
                var casopadre = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
                if(!casopadre){
                    // por defecto es: Nacional (Para OLA 4)
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tipodocumento", 1);
                    
                    //Darle a xmsbs_familiadeproducto un filtrolookup para mostrar solo familias de casos padre
                    executionContext.getFormContext().getControl("xmsbs_familiaproducto").addPreSearch(CasoIngresoCRM.filtrarLookupFamiliaDeProducto);
                }
            }

            CasoIngresoCRM.Form.CargaCamposDinamicosCompleta = false;
            //CasoIngresoCRM.formContext.data.entity.addOnPostSave(CasoIngresoCRM.AlertCaso);

            CasoIngresoCRM.validaUsuarioCreacionCaso(executionContext);
        }
        else if (tipoFormulario == '2' || tipoFormulario == '3'){            
            CasoIngresoCRM.camposSeccionesEtapa(executionContext);
            CasoIngresoCRM.onChange_arbolPreguntas(executionContext);
            CasoIngresoCRM.mostrarFichaSecciones(executionContext, formContext);       
            CasoIngresoCRM.setXrmFormContextWRBotoneraMejora(executionContext, formContext);                    
            CasoIngresoCRM.BloquearObservacionesYSolucion(executionContext); 
            CasoIngresoCRM.CampoObservacionesReparar(executionContext);
            CasoIngresoCRM.BloquearCamposDespuesDeCrear(executionContext);
            //CasoIngresoCRM.camposSeccionesEtapa(executionContext);
            CasoIngresoCRM.SeccionRespuesta(executionContext,formContext);
			CasoIngresoCRM.onChange_preferenciasContacto(executionContext);
            CasoIngresoCRM.validaVisibilidadCamposTipologia(executionContext, tipoFormulario);
			//CasoIngresoCRM.crearCasoNEO(executionContext);
            CasoIngresoCRM.ValidaDocumentoPendiente(executionContext);
            CasoIngresoCRM.onChange_canalIngreso(executionContext);
            //CasoIngresoCRM.mostrarBotonMovimientosCaso(executionContext);
			CasoIngresoCRM.Form.CargaCamposDinamicosCompleta = true;
        }
        else if (tipoFormulario == '4'){
			CasoIngresoCRM.mostrarFichaSecciones(executionContext, formContext);
            CasoIngresoCRM.camposSeccionesEtapa(executionContext);
            CasoIngresoCRM.SeccionRespuesta(executionContext, formContext);
            CasoIngresoCRM.onChange_arbolPreguntas(executionContext);
            CasoIngresoCRM.validaVisibilidadCamposTipologia(executionContext, tipoFormulario);
            
            //Mostramos la sección de encuestas si es subrequerimiento
            /*
            var esSubrequerimiento = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "parentcaseid");
            if(esSubrequerimiento){
                formContext.ui.tabs.get("tab_19").setVisible(true); //Encuestas
            }
            */
            
            //OCultar botonera
            formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false); //Botonera
        }
		
        var casopadre = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
        if(!marcaReiterado && !casopadre){
            CasoIngresoCRM.onChange_TipoDocumento(executionContext);
        }
        
		CasoIngresoCRM.bloqueoTipificacion(executionContext);
        
        //bloqueamos la sección de gestión general si el formulario es de lectura o finalizado
        if(tipoFormulario == 3 || tipoFormulario == 4){
            JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
			JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "resolucion", true);
        }
        
        //Validamos si el caso está pendiente de ingreso para alertarle al usuario
        CasoIngresoCRM.alertaCasoPendienteIngreso(executionContext);
    },
    
    AlertCaso: function(executionContext){
        var formContext = executionContext.getFormContext();

        var CorrelativoCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_numerocorrelativo", null);
        var FechaCreacion = JumpStartLibXRM.Fx.getValueField(executionContext, "createdon", null);
        var RUT = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
        var Producto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_producto", null)[0].name;
        var DetalleTipologia = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledetipologia", null)[0].name;
        var Propietario = JumpStartLibXRM.Fx.getValueField(executionContext, "ownerid", null)[0].name;

        var FechaComprometida = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_fechacomprometida", null);
        if (FechaComprometida == null)
        {
            console.log("espera 2 segundos (síncrono)");
            sleep(2000); // espera 2 segundos y vuelve a obtener el campo fecha comprometida
            FechaComprometida = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_fechacomprometida", null);
        }

        var strBody = "";
        if (FechaComprometida == null)
        {
            //No incluye la fecha en el mensaje de creación.
            strBody = "Con fecha " + CasoIngresoCRM.formatDate(FechaCreacion) + ", " +
                      "se ha creado el caso " + CorrelativoCaso + " asociado al cliente " + RUT + ", " +
                      "para el producto " + Producto + ", " + 
                      "por concepto de " + DetalleTipologia + " y el responsable asignado es " + Propietario + ".";            
        }
        else
        {
            strBody = "Con fecha " + CasoIngresoCRM.formatDate(FechaCreacion) + ", " +
                      "se ha creado el caso " + CorrelativoCaso + " asociado al cliente " + RUT + ", " +
                      "para el producto " + Producto + ", " + 
                      "por concepto de " + DetalleTipologia + " y el responsable asignado es " + Propietario + ". " +
                      "La fecha comprometida de resolución es: " + CasoIngresoCRM.formatDate(FechaComprometida);            
        }        

        var strTitle = "Número de CASO: " + CorrelativoCaso;
        var strConfirmBtn = "Crear Nuevo Caso";
        var strCancelBtn = "Cerrar";
        
//        var alertStrings = { confirmButtonLabel: strOK, text: strBody, title: strTitle };
//        var alertOptions = { height: 250, width: 500 };
//        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);
        
        var confirmStrings = { title: strTitle , text:strBody, confirmButtonLabel:strConfirmBtn, cancelButtonLabel:strCancelBtn};
        var confirmOptions = { height: 250, width: 500 };
        Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
        function (success) {   
            if (success.confirmed)
            {
                var entityFormOptions = {};
                entityFormOptions["entityName"] = "incident";
                entityFormOptions["openInNewWindow"] = false;
                //entityFormOptions["formId"] = JumpStartLibXRM.Fx.getFormID(executionContext);
                var formParameters = {};
                
                Xrm.Navigation.openForm(entityFormOptions,formParameters);
            }
        },
        function (error) { 
            //---
        });
    },
    executeWRGrillaCasosClienteUR:function(executionContext){
        var formContext = executionContext.getFormContext();
        var estadoTab = formContext.ui.tabs.get("tab_18").getDisplayState();
        var variableGlobalGrilla = CasoIngresoCRM.variableGlobal.grillaCasosPorUR;
        
        if(estadoTab == "expanded" && variableGlobalGrilla == 0){
            //hacemos el llamado a la API para pintar la grilla
            CasoIngresoCRM.setXrmFormContextWRGrillaCasosClienteUR(executionContext, formContext);
            CasoIngresoCRM.variableGlobal.grillaCasosPorUR = 1;
        }
    },
    
    setApiKey: function(executionContext){         
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_parametro", "?$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor&$filter=xmsbs_name eq '"+ CasoIngresoCRM.ApiKey.Name +"'&$top=1").then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    var xmsbs_name = results.entities[i]["xmsbs_name"];
                    var xmsbs_parametroid = results.entities[i]["xmsbs_parametroid"];
                    var xmsbs_valor = results.entities[i]["xmsbs_valor"];
                    CasoIngresoCRM.ApiKey.Key =results.entities[i]["xmsbs_valor"];
                }
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
	},
    
    setAzureURL: function(executionContext){      
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_parametro", "?$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor&$filter=xmsbs_name eq '"+ CasoIngresoCRM.URL.Name +"'&$top=1").then(            
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    var xmsbs_name = results.entities[i]["xmsbs_name"];
                    var xmsbs_parametroid = results.entities[i]["xmsbs_parametroid"];
                    var xmsbs_valor = results.entities[i]["xmsbs_valor"];
                    CasoIngresoCRM.URL.Azure =results.entities[i]["xmsbs_valor"];
                }                
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
	},
    reLoadWRBotoneraMejora: function (executionContext, formContext) {
       var webResource =formContext.getControl("WebResource_botoneraAcciones");
       var src = webResource.getSrc();     
       var aboutBlank = "about:blank";
       webResource.setSrc(aboutBlank);     
       setTimeout(function(){ 
          webResource.setSrc(src);
       }, 1000);       
    },
	setXrmFormContextWRBotonera: function (executionContext, formContext) {
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

            let finalUrlGetAcciones = "/caso/GetAcciones/" + caseId;

            var service = CasoIngresoCRM.GetRequestObject();
            if (service != null) {
                service.open("GET", CasoIngresoCRM.URL.Azure + finalUrlGetAcciones, false);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader(CasoIngresoCRM.ApiKey.Name, CasoIngresoCRM.ApiKey.Key);
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
        // let arrayNameRoles = new Array();
        // arrayNameRoles.push("Administrador del sistema");
        // arrayNameRoles.push("System Administrator");
        // arrayNameRoles.push("[Santander] - UR Administrador");
        // JumpStartLibXRM.Fx.UserHasRoles(executionContext,arrayNameRoles,CasoIngresoCRM.setXrmFormContextWRBotoneraMejoraOK,CasoIngresoCRM.setXrmFormContextWRBotoneraMejoraNOK);
        CasoIngresoCRM.formContext = executionContext.getFormContext();
        var formContext = executionContext.getFormContext();  
        let array = new Array ();
        CasoIngresoCRM.RolesArray.SystemUser.forEach( 
        function (x){
            array.push(x);
        }
        );
        CasoIngresoCRM.RolesArray.SantanderUrAdmin.forEach( 
            function (x){
                array.push(x);
            });
        let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
        if (found){                
            formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true);
            CasoIngresoCRM.LoadBotoneraAccion(executionContext, formContext);
        }
        else{
            var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
            if(!esPropietario ){
                formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false);
            }
            else{
                formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true);
                CasoIngresoCRM.LoadBotoneraAccion(executionContext, formContext);
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
       //     CasoIngresoCRM.LoadBotoneraAccion(executionContext, formContext);
       // }
    },

    setXrmFormContextWRBotoneraMejoraOK: function (executionContext) {
        CasoIngresoCRM.formContext = executionContext.getFormContext();
		var formContext = executionContext.getFormContext();       
        formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true);
        CasoIngresoCRM.LoadBotoneraAccion(executionContext, formContext);

    },
    setXrmFormContextWRBotoneraMejoraNOK: function (executionContext) {
        CasoIngresoCRM.formContext = executionContext.getFormContext();
		var formContext = executionContext.getFormContext();
        var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
        if(!esPropietario ){
            formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false);
        }
        else{
            formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true);
            CasoIngresoCRM.LoadBotoneraAccion(executionContext, formContext);
         }        
    },

 
    LoadBotoneraAccion : function(executionContext, formContext){
            let response = null;
            var wrBotonera = formContext.getControl("WebResource_botoneraAcciones");
            var botoneraObj = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_botoneraaccionesobj", null);
           
            if (botoneraObj != null) {
              response = JSON.parse(botoneraObj);
                if (wrBotonera && response) {
                    wrBotonera.getContentWindow().then(
                        function (contentWindow) {                      
                            if (contentWindow != null && typeof(contentWindow.setClientApiContext) === 'function'){   
                                  console.log("ejecuto correcto");
                                contentWindow.setClientApiContext(Xrm, executionContext, formContext, response);
                                }
                            else {
                                 console.log("ejecuto reintento");
                                    setTimeout(function(){ 
                                      CasoIngresoCRM.LoadBotoneraAccion(executionContext, formContext);
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
                                 console.log("ejecuto reintento");
                                    setTimeout(function(){ 
                                      CasoIngresoCRM.LoadBotoneraAccion(executionContext, formContext);
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
                             console.log("ejecuto reintento");
                                setTimeout(function(){ 
                                  CasoIngresoCRM.LoadBotoneraAccion(executionContext, formContext);
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
        var resultado = CasoIngresoCRM.buscarCasosClienteUR(executionContext, idCliente, idUR);
        
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
                          Producto: CasoIngresoCRM.obtenerProducto(executionContext, resultado.value[i]["_xmsbs_producto_value"]),
                          TipoRequerimiento: CasoIngresoCRM.obtenerTipoRequerimiento(executionContext, resultado.value[i]["_xmsbs_tipoderequerimiento_value"]),
                          TipoOperacion: CasoIngresoCRM.obtenerTipoOperacion(executionContext, resultado.value[i]["_xmsbs_tipodeoperacion_value"]),
                          TipoYDetalleOperacion: CasoIngresoCRM.obtenerTipoYDetalleOperacion(executionContext, resultado.value[i]["_xmsbs_detalledetipologia_value"]),
                          FechaCreacion: CasoIngresoCRM.formatDate(resultado.value[i]["createdon"])
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
    
    mostrarBotonMovimientosCaso: function (executionContext, ContratoManual){
		// Esta fnc ya no se llama desde el onLoad,
		// sino desde la fnc: CampoIntegracion, que es cuando dibujan los campos.
		// También se llama desde el onchange SeleccionContratoManual.
		var formContext = executionContext.getFormContext();
		var wrBotonMovimientosCaso = formContext.getControl("WebResource_botonMovimientos");
		var StatusCode = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);        
	
		wrBotonMovimientosCaso.setVisible(false); // false por default
		var tipoFormulario = formContext.ui.getFormType();
		if (tipoFormulario != JumpStartLibXRM.FormState.UPDATE)
		{ return; }
		
		var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
		if (marcaReiterado)
		{ return; }	// Si es un CASO Reiterado entonces nunca muestra el botón.
		
        var idDetalleOperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion", null);
		if (!idDetalleOperacion)
		{ return; } // No se logra obtener el detalle de operación.
	
		var numeroContrato = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contratotexto", null);
		if (!numeroContrato)
		{ return; } // El número de contrato es vacío (aplica para contratos manuales).
 
 
		if (CasoIngresoCRM.Form.DOConMov == null)
		{
			var oDetalleOperacion = CasoIngresoCRM.buscarDetalleOperacion(executionContext, idDetalleOperacion);
			if(!oDetalleOperacion)
			{ return; } // No se pudo obtener el registro Detalle Operación.	
			
			var habilitarBotonMovimientosCaso = oDetalleOperacion.xmsbs_habilitarbotonmovimientoscasos;
			if(!habilitarBotonMovimientosCaso)
			{ 
				// No está marcada la opción de Movimientos del Caso en el Detalle de Operación
				CasoIngresoCRM.Form.DOConMov = false;
				return;
			} 
			CasoIngresoCRM.Form.DOConMov = true;
		}
		
		if (CasoIngresoCRM.Form.DOConMov == false)
			return;
 
		//var Field_Contrato = JumpStartLibXRM.Fx.getField(executionContext, "xmsbs_contratoseleccion");
		var SelOpcOTROS = false;
		if (ContratoManual)
		{
			SelOpcOTROS = true;
		}
		else
		{
			var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
			var oContrato = CasoIngresoCRM.buscarContratoCaso(executionContext, incidentId, numeroContrato);
			if (oContrato && oContrato.value.length > 0 && oContrato.value[0].xmsbs_tipodecontrato == 2) // 2:Manual
				SelOpcOTROS = true;			
		}
		//if (Field_Contrato && Field_Contrato.getSelectedOption() && Field_Contrato.getSelectedOption().value == 101) // último item
		//	SelOpcOTROS = true;
			
		if (StatusCode == 3 && !SelOpcOTROS)
			return; // está en reparo, pero no seleccionó la última opción (solo aplica para cuando el cliente (RUT) tiene más de 100 contratos).
		
		// si no se cumple ninguna de las condiciones anteriores, entonces MUESTRA el btn de selección de movimientos.
		wrBotonMovimientosCaso.setVisible(true);
		//formContext.ui.tabs.get("general").sections.get("seccion_movimientos").setVisible(true);
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
            var resultado = CasoIngresoCRM.buscarProducto(executionContext, idProducto);
        
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
            var resultado = CasoIngresoCRM.buscarTipoYDetalleOperacion(executionContext, idTipoYDetalleOperacion);
        
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
            var resultado = CasoIngresoCRM.buscarTipoRequerimiento(executionContext, idTipoRequerimiento);
        
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
            var resultado = CasoIngresoCRM.buscarTipoOperacion(executionContext, idTipoOperacion);
        
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

    validaUsuarioCreacionCaso: function(executionContext){
        // 06-10-2025; JM: Comprueba que el usuario en sesión esté activo en una UR (Banco), se considera activo en los siguientes escenarios:
        // - Cuando el usuario tiene un registro de Integrante de UR Activo para una UR de Banco (Disponible/No Disponible)
        // - Cuando el usuario no tiene registros de Integrante de UR (activos/inactivos). Este caso indica que el usuario aun no ha sido configurado.
        // Se considera un bloqueo en la creación de casos:
        // - cuando el usuario tienen solo registros inactivos en Integrantes de la UR
        CasoIngresoCRM.Form.UsuarioHabilitadoCreacionCaso = false;

        var oUsuarioIntegranteURActivo = CasoIngresoCRM.oDataIntegranteURActivo(executionContext, CasoIngresoCRM.variableGlobal.usuarioId);
        if (oUsuarioIntegranteURActivo && oUsuarioIntegranteURActivo.value.length > 0){
            CasoIngresoCRM.Form.UsuarioHabilitadoCreacionCaso = true;
        }
        else{
            var oUsuarioIntegranteURVacio = CasoIngresoCRM.oDataIntegranteUR(executionContext, CasoIngresoCRM.variableGlobal.usuarioId);
            if (oUsuarioIntegranteURVacio && oUsuarioIntegranteURVacio.value.length == 0){
                CasoIngresoCRM.Form.UsuarioHabilitadoCreacionCaso = true;
            }
        }

        if (CasoIngresoCRM.Form.UsuarioHabilitadoCreacionCaso == false){
            // solo muestra mensaje, no restringe la carga del formulario.
            // pero si lo bloquea, lo cual impide la creación del caso.
            
            var alertStrings = { confirmButtonLabel: "Aceptar", 
                                 title: "ERROR", 
                                 text: "Su usuario no está habilitado para crear casos." +
                                        "\n\nPor favor contacte a un administrador." };
            var alertOptions = { height: 200, width: 300};
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(function (success) {
                JumpStartLibXRM.Fx.disableForm(executionContext);
            },function (error) {});
        }        
    },
    	
	bloqueoTipificacion: function (executionContext){
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado != '1')
		{
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_producto");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_detalledetipologia");
            executionContext.getFormContext().getControl("xmsbs_causaraiz").addPreSearch(CasoIngresoCRM.filtrarCausaRaiz);
		}
		else
		{
			executionContext.getFormContext().getControl("xmsbs_producto").addPreSearch(CasoIngresoCRM.filtrarLookupProducto);
			executionContext.getFormContext().getControl("xmsbs_detalledetipologia").addPreSearch(CasoIngresoCRM.filtrarLookupTipoDetalle);
            
            
            //executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addPreSearch(CasoIngresoCRM.puntoContactofiltro);
            
            //Validamos si es un subrequerimiento de formales
            //var casoprincipal = JumpStartLibXRM.Fx.getValueField(executionContext,"parentcaseid", null);
            //var UrName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_urtipologia");
            //if(casoprincipal && UrName.toLowerCase() == "reguladores"){
            //    var producto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_producto", null);
            //    var detalleTipologia = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledetipologia", null);
            //    
            //    if(!producto && !detalleTipologia){
            //        //Si se está creando el subrequerimento de formales
            //        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_producto");
            //        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_detalledetipologia");
            //        JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_puntodecontacto");
            //        
            //        var formContext = executionContext.getFormContext();
            //        formContext.ui.tabs.get("general").sections.get("datoscaso2").setVisible(false); //ingreso
            //        formContext.ui.tabs.get("general").sections.get("datoscaso").setVisible(true); //ingreso
            //    }
            //}
		}
	},
    
    alertaCasoPendienteIngreso: function (executionContext){
        var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
        var ingresoUnicoFinalizado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_ingresounicofinalizado", null);
        
        if(estado == 2 && ingresoUnicoFinalizado == false){
            //Si está con el ingresoUnicoFinalizado en no y está en gestión, es un caso a medias y se alerta
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Ingreso No Finalizado", text: "Este caso no completó el ingreso, y no ha sido derivado a la UR"};
            var alertOptions = { height: 120, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function (success) {
                    //console.log("Alert dialog closed");
                    JumpStartLibXRM.Fx.formSaveAndClose(executionContext);
                },
                function (error) {
                    //console.log(error.message);
                }
            );
        }
    },
	
	buscarInstitucion: function (executionContext){
		var institucion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_institucion", null);
		if(!institucion)
		{
			var PropietarioId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
			var respuesta = CasoIngresoCRM.datosUsuario(executionContext, PropietarioId);
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
    onChange_TipoDocumento: function (executionContext) {
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
                Xrm.Page.getControl("xmsbs_familiaproducto").setDisabled(true);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rut", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "customerid", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_cliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrecliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidopaterno", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidomaterno", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_emailcliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_sucursalcliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_segmentocliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_subsegmentocliente", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_ejecutivocliente", null);

                //Deshabilito los campos
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_nombrecliente");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidopaterno");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidomaterno");            
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_telefonocelular");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_emailcliente");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursalcliente");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_segmentocliente");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_subsegmentocliente");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_ejecutivocliente"); 
            }
		}
        else
        {            
            JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_rut", "RUT");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_rut");
        }
	},

	onChange_rut: function (executionContext) {
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
                        rut = CasoIngresoCRM.formatearRutCRM(rut);
                        var respuesta = JumpStartLibXRM.Fx.validarrut(rut);
                        
                        if (respuesta == true)
                        {	
                            //var formateaRut = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_rut", null);
                            var formateaRut = rut;
                            formateaRut = formateaRut.replace(/[^\dkK]/g, "");
                            var largo = formateaRut.length;

                            formateaRut = formateaRut.substring(0, largo - 1) + "-" + formateaRut.substring(largo - 1, largo);
                            //rut.setValue(formateaRut);
                            formateaRut = formateaRut.toUpperCase();
							
							largo = formateaRut.length;
                            // el largo formateado no considera puntos, solo guión, tampoco considera ceros a la izquierda, por lo tanto el largo válido siempre es 9 o 10
                            // 2025.08.21 JM - Se solicita que los RUTs 200xxxxxx también sean válidos, se aumenta el tope a 11.
							if (largo < 9 || largo > 11){ 
								respuesta = false;
							}
							else
							{
								JumpStartLibXRM.Fx.setValueField(executionContext, myControl, formateaRut);
								respuesta = true;
							}
                        }
                        else 
                        {
							respuesta = false;
                        }
						
						if(!respuesta){
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
        var response = null;
        var ApiUrlClienteByRut = "";
		var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);		
		var auxrut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rutaux", null);
		var tipoDocumento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodocumento", null);

		if(rut && tipoDocumento)
        {
			Xrm.Page.getControl("xmsbs_familiaproducto").setDisabled(false);

            if(tipoDocumento == 1) //Nacional
            {
                ApiUrlClienteByRut = "/Cliente/GetClienteSantanderByRut/" + rut;
            }
            else if(tipoDocumento == 2) //Extranjero
            {
                ApiUrlClienteByRut = "/Cliente/GetClienteExtranjeroByNumeroDocumento/" + rut;
            }

            //var apiToken = window.sessionStorage.getItem("LokiAuthToken");
			var service = CasoIngresoCRM.GetRequestObject();
			if (service != null)
			{
				service.open("GET", CasoIngresoCRM.URL.Azure + ApiUrlClienteByRut, false);
				service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
				service.setRequestHeader("Accept", "application/json,text/javascript, */*");
				service.setRequestHeader(CasoIngresoCRM.ApiKey.Name, CasoIngresoCRM.ApiKey.Key);
                //service.setRequestHeader("TokenApi", apiToken);
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
                    var sucursal = response.cliente.sucursal;
                    var segmento = response.cliente.segmento;
                    var subsegmento = response.cliente.subSegmento;
                    var ejecutivo = response.cliente.ejecutivo;
                    var tipoDocumentoCliente = response.cliente.tipoDocumento;
                    
                    var preferenciasarray = new Set();
                    var valoresPreferencias;
                    
                    if(preferenciascontacto != null)
                    {    
                        if(preferenciascontacto.length > 0)
                        {
                            for(var i = 0; i < preferenciascontacto.length; i++)
                            {
                                preferenciasarray.add(preferenciascontacto[i].value);
                            }
                            valoresPreferencias = Array.from(preferenciasarray);
                        }
                    }
                    else
                    {
                        preferenciasarray.add(657130001);
                        valoresPreferencias = Array.from(preferenciasarray);
                    }
					
					
					if (!nombrecliente)
					{
                        //Pido que complete los campos del cliente marcandolo como requerido
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_nombrecliente", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_apellidopaterno", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_apellidomaterno", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_telefonocelular", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "required");
                        //JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_sucursalcliente", "required");
                        //JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_segmentocliente", "required");
                        //JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_subsegmentocliente", "required");
                        //JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ejecutivocliente", "required");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_clientesantander", clientesantander);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", valoresPreferencias);
                        
                        //Habilito los campos
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_nombrecliente");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_apellidopaterno");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_apellidomaterno");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                        //JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_sucursalcliente");
                        //JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_segmentocliente");
                        //JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_subsegmentocliente");
                        //JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_ejecutivocliente");
					}
					else
					{
						//Actualizo los datos del cliente
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", telefono);
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_emailcliente", correoElectronico);
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", valoresPreferencias);
						if (apellidopaterno)
							JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidopaterno", apellidopaterno);
						if (apellidomaterno)
							JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidomaterno", apellidomaterno);
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrecliente", nombrecliente);
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_clientesantander", clientesantander);
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_ejecutivocliente", ejecutivo);                        
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", valoresPreferencias);
						
						if(sucursal != null)
						{
							JumpStartLibXRM.Fx.setLookupValue(executionContext, "xmsbs_sucursalcliente", sucursal.id, sucursal.name, sucursal.logicalName);
						}
						
						if(segmento != null)
						{
							JumpStartLibXRM.Fx.setLookupValue(executionContext, "xmsbs_segmentocliente", segmento.id, segmento.name, segmento.logicalName);
						}
						
						if(subsegmento != null)
						{
							JumpStartLibXRM.Fx.setLookupValue(executionContext, "xmsbs_subsegmentocliente", subsegmento.id, subsegmento.name, subsegmento.logicalName);
						}						
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
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_nombrecliente", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_apellidopaterno", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_telefonocelular", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_sucursalcliente", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_segmentocliente", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_subsegmentocliente", "required");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ejecutivocliente", "required"); 
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_clientesantander", clientesantander);
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", valoresPreferencias);

                    //Habilito los campos
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_nombrecliente");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_apellidopaterno");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_apellidomaterno");                        
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_sucursalcliente");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_segmentocliente");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_subsegmentocliente");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_ejecutivocliente");
					
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
			Xrm.Page.getControl("xmsbs_familiaproducto").setDisabled(true);
            JumpStartLibXRM.Fx.setValueField(executionContext, "customerid", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_cliente", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrecliente", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidopaterno", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apellidomaterno", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_telefonocelular", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_emailcliente", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_preferenciasdecontacto", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_sucursalcliente", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_segmentocliente", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_subsegmentocliente", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_ejecutivocliente", null);

            //Deshabilito los campos
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_nombrecliente");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidopaterno");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_apellidomaterno");            
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_telefonocelular");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_emailcliente");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursalcliente");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_segmentocliente");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_subsegmentocliente");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_ejecutivocliente");            
        }

        CasoIngresoCRM.onChange_preferenciasContacto(executionContext);

		if(rut != null && rut != auxrut)
		{
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_familiaproducto", null);
			CasoIngresoCRM.onChange_producto(executionContext);
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rutaux", rut);
		}
	},

    onChange_tipoDetalleOperacion: function (executionContext) {
		var formContext = executionContext.getFormContext();
		
        var productoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto");
        var tipoDetalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
         
        if(productoId && tipoDetalleID){

            //Se debe completar el tipo de Requerimiento asociado al tipo y detalle de operación
            if (tipoDetalleID.indexOf("{") > -1){tipoDetalleID = tipoDetalleID.substring(1, 37);}
            
            //hacemos odata que consulta para el producto el requerimiento que corresponde
            var respuesta = CasoIngresoCRM.datosTipoDetalleOp(executionContext, tipoDetalleID);
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
				
				if(detalleOperacionID){
					var resultado = CasoIngresoCRM.buscarDetalleOperacion(executionContext, detalleOperacionID);
					if(resultado){

						var tooltips = resultado.xmsbs_tooltips;
						if(tooltips){
							//Setear en si el campo y bloquearlo
							JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", tooltips);
							formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(true);
						}
						else
						{
							JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
							formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);
						}
					}
				}
				else
				{
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
					formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);
				}

                //Completamos la institución desde el tipoRequerimiento
                var respuesta = CasoIngresoCRM.datosInstitucionPorTipoReq(executionContext, tipoRequerimientoID);
                if(respuesta){
                    var fieldName = "xmsbs_institucion";
                    var id = respuesta.xmsbs_institucion.xmsbs_institucionid;
                    var name = respuesta.xmsbs_institucion.xmsbs_name;
                    var entityType = "xmsbs_institucion";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                }
				
				//Reviso logica para seleccionar el punto de contacto
				CasoIngresoCRM.puntoContactoBloqueo(executionContext);                
            }
            
            //Vamos a buscar la etapa del flujo del detalle. Primero, buscamos el Flujo
            var respuesta = CasoIngresoCRM.buscarFlujoDelDetalle(executionContext, detalleOperacionID);
            if(respuesta){
                var flujoDelProcesoID = respuesta._xmsbs_flujosantander_value;
                
                //Buscamos la etapa inicial
                var respuesta = CasoIngresoCRM.buscarEtapaInicial(executionContext, flujoDelProcesoID);
                if(respuesta){
                    if(respuesta.value.length > 0){
                        var etapaID = respuesta.value[0].xmsbs_etapaid;
                        
                        //Ya tenemos la primera etapa, ahora debemos llamar a los campos a pintar
                        CasoIngresoCRM.camposSeccionesEtapa(executionContext, etapaID);
                    }
                }
            }
        }
    },
    
    onChange_pregunta2caso: function (executionContext) {
        var pregunta2caso = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2delcaso");	 
        if(pregunta2caso){
            if (pregunta2CasoIngresoCRM.indexOf("{") > -1){pregunta2caso = pregunta2CasoIngresoCRM.substring(1, 37);}
            
            //hacemos odata que consulta cual es el detalle de operación de esa tipología
            var respuesta = CasoIngresoCRM.datosPreguna2caso(executionContext, pregunta2caso);
            if(respuesta){
                //Trajo la información, ahora consultamos por el tipodedetalle que tenga ese detalle de operación
                var detalleOperacionID = respuesta._xmsbs_detalledeoperacion_value;
                if (detalleOperacionID.indexOf("{") > -1){detalleOperacionID = detalleOperacionID.substring(1, 37);}
                
                var respuesta = CasoIngresoCRM.buscaTipoDetalle(executionContext, detalleOperacionID);
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
                    CasoIngresoCRM.onChange_tipoDetalleOperacion(executionContext);
                }
            }
        }
    },
	
	filtrarLookupProducto: function (executionContext) {
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
    
    filtrarLookupFamiliaDeProducto: function (executionContext) {
        var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_ocultarencreaciondecasospadre' operator='ne' value='1' /></filter>";
        executionContext.getFormContext().getControl("xmsbs_familiaproducto").addCustomFilter(fetchXml);
    },
    
    filtrarLookupDescripcionProblema: function (executionContext) {
        var fetchXml = "<filter type='and'><condition attribute='statecode' operator='eq' value='0' /><condition attribute='xmsbs_essubrequerimiento' operator='eq' value='1' /></filter>";
        executionContext.getFormContext().getControl("xmsbs_descripcionproblema").addCustomFilter(fetchXml);
    },
    
    filtrarCausaRaiz: function (executionContext) {
        //Primero, se debe ver si la tipificación tiene causas raices específicas
        var DetalleOperacionNombre = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_detalledeoperacion");
        var DetalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
                    
        var resultado = CasoIngresoCRM.buscarCausasRaicesEspecificas(executionContext, DetalleOperacionID);
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
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        if (tipoFormulario != '1'){ //si el formulario no esta en creación
            var tipoResolucion = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_tipoderespuesta", null);
            var UrName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_ur");
            var casoprincipal = JumpStartLibXRM.Fx.getValueField(executionContext,"parentcaseid", null);
            //Necesario para Ley de Fraude
            var flujoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_flujosantander");
            var etapaName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_etapa");
            
            //Siempre que cambia el tipo de resolución, limpiamos el motivo de resolución por si se ingreso algo antes
            if(!origen){
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_motivoresolucion", null);
            }
            
            if(!origen && UrName.toLowerCase() != "reguladores"){
                //Se limpia el campo de respuesta
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_respuestacliente", null); //Varias lineas de texto
            }
            
            if(tipoResolucion == 1 && UrName.toLowerCase() == "reguladores")
            {
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_motivoresolucion");
            }
            else if(tipoResolucion == 1 && etapaName.toLowerCase() == "abonar al cliente" && flujoName.toLowerCase() == "nvo. flujo fraude tc td 2020" || flujoName.toLowerCase() == "nvo. flujo fraude tc manuales" || flujoName.toLowerCase() == "nvo. flujo fraude td manuales")
            {
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_clasificacionsac");
            }
            else if(tipoResolucion != null && etapaName.toLowerCase() == "investigación" && flujoName.toLowerCase() == "nvo. flujo fraude tc td 2020" || flujoName.toLowerCase() == "nvo. flujo fraude tc manuales" || flujoName.toLowerCase() == "nvo. flujo fraude td manuales")
            {
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_clasificacionsac");
            }
            else if(etapaName.toLowerCase() == "informar respuesta al cliente" && flujoName.toLowerCase() == "nvo. flujo fraude tc td 2020" || flujoName.toLowerCase() == "nvo. flujo fraude tc manuales" || flujoName.toLowerCase() == "nvo. flujo fraude td manuales")
            {
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_clasificacionsac");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_clasificacionsac");
                
            }
            else
            {
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_motivoresolucion");
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_clasificacionsac");
            }
        }
	},
    
    onChange_TipoResolucionLimpiezaQuebranto:function(executionContext){
        var registroQuebranto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_registroquebranto");
        if(registroQuebranto){
            //Si existe un registro de quebranto, y dado que cambió el tipo de resolución:
            //1: actualizamos el estado del quebranto a "cancelado"
            var usuarioAdministrador = CasoIngresoCRM.buscarUsuarioAdministrador(executionContext);
                
            var idUsuarioImpersonar = usuarioAdministrador.value[0].systemuserid;
            if (registroQuebranto.indexOf("{") > -1){registroQuebranto = registroQuebranto.substring(1, 37);}
            
            var entity = "xmsbs_reversocastigos";
            var objeto = {};
            objeto["xmsbs_cancelarregistro"] = true;
            var resultado = SDK.WEBAPI.updateRecordImpersonate(executionContext, registroQuebranto, objeto, entity, idUsuarioImpersonar, null, null);
            
            if(resultado == "OK"){
                //Sacamos el registro de quebranto del caso
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_registroquebranto", null);
                
                //Desbloquear el indicador de quebranto
                Xrm.Page.getControl("xmsbs_indicadordequebranto").setDisabled(false);
                
                //Guardamos el Caso
                JumpStartLibXRM.Fx.formSave(executionContext);
                
                //Alertamos que cambio el quebranto a Cancelado
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "Se ha cancelado el quebranto del Caso debido a que cambió el Tipo de Resolución", title: "Quebranto Eliminado" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        //JumpStartLibXRM.Fx.setValueField(executionContext, myControl, "");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
    
    checkIndicadorQuebranto:function(executionContext){
        var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
        if(detalleOperacionID){
            if (detalleOperacionID.indexOf("{") > -1){detalleOperacionID = detalleOperacionID.substring(1, 37);}
            var resultado = CasoIngresoCRM.buscarDetalleOperacion(executionContext, detalleOperacionID);
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
	
    onChange_correo: function (executionContext) {
        var myControl = executionContext.getEventSource().getName();
		
        var correo = JumpStartLibXRM.Fx.getValueField(executionContext, myControl, null);
        if(correo){
            var validaCorreo = CasoIngresoCRM.validarFormatoCorreoRegex(correo);
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
	
	onChange_ValidaIntervalo: function (executionContext) {
		//debugger;
        var ControlOnChange = executionContext.getEventSource().getName();
		var ValorActual = JumpStartLibXRM.Fx.getValueField(executionContext, ControlOnChange, null);

		if (ValorActual == null)
			return;
	
		CasoIngresoCRM.ValidaIntervalo(executionContext, ControlOnChange);
	},	
	
	onChangeSoloNumerosIntervalo: function(executionContext) {
        var ControlOnChange = executionContext.getEventSource().getName();
		var ValorActual = JumpStartLibXRM.Fx.getValueField(executionContext, ControlOnChange, null);

		if (ValorActual == null)
		 return;

		// Fomatea a NUMERO
		let ValorSoloNumeros = ValorActual.replace(/\D/g, '');
		JumpStartLibXRM.Fx.setValueField(executionContext, ControlOnChange, ValorSoloNumeros);		
		
		CasoIngresoCRM.ValidaIntervalo(executionContext, ControlOnChange);
	},	
	
	ValidaIntervalo: function(executionContext, NombreCampo){
        var NumeroIngresado = JumpStartLibXRM.Fx.getValueField(executionContext, NombreCampo, null);
		
		if (/^\d+$/.test(NumeroIngresado) == false){
			var alertStrings = { confirmButtonLabel: "Aceptar", text: "El valor debe ser numérico", title: "Valor incorrecto" };
			var alertOptions = { height: 120, width: 260 };
			Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(function (success) {JumpStartLibXRM.Fx.setValueField(executionContext, NombreCampo, null);},function (error) {});
			return;
		}
		
		// valida que el número ingresado esté en el rango configurado en la matriz
		var ParametroValidacion = null;
		for (var i = 0; i < CasoIngresoCRM.Form.ValidacionGenerica_Parametros.length; i++) {
			if (CasoIngresoCRM.Form.ValidacionGenerica_Parametros[i].campo === NombreCampo) {
				 ParametroValidacion = CasoIngresoCRM.Form.ValidacionGenerica_Parametros[i];
				 break;
			}
		}
		
		if (ParametroValidacion == null){
			var alertStrings = { confirmButtonLabel: "Aceptar", text: "La configuración requiere valores mínimo y máximo para establecer el rango.", title: "Error de configuración del Flujo" };
			var alertOptions = { height: 120, width: 260 };
			Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(function (success) {JumpStartLibXRM.Fx.setValueField(executionContext, NombreCampo, null);},function (error) {});
			return;
		}
			
		if (NumeroIngresado < ParametroValidacion.MayorOIgualQue || NumeroIngresado > ParametroValidacion.MenorOIgualQue)
		{
			var alertStrings = { confirmButtonLabel: "Aceptar", text: "El valor debe estar dentro del rango: " + ParametroValidacion.MayorOIgualQue + " y " + ParametroValidacion.MenorOIgualQue, title: "Valor fuera de rango" };
			var alertOptions = { height: 120, width: 260 };
			Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(function (success) {JumpStartLibXRM.Fx.setValueField(executionContext, NombreCampo, null);},function (error) {});
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
			
			if(obs){
				JumpStartLibXRM.Fx.formSave(executionContext);
			}
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

     onChange_ObservacionSubrequerimiento: function (executionContext) {
        var obs = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_observacionessubrequerimientos", null);
        
        if(obs){        
            obs = obs.replace(/(\r\n|\n|\r)/gm, " ");
            obs = obs.replace(/;/g, ",");
            obs = obs.trim();
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_observacionessubrequerimientos", obs);
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
            var validaTelefono = CasoIngresoCRM.validarFormatoTelefonoRegex(telefono);
            if (!validaTelefono)
            {
              JumpStartLibXRM.Fx.AlertDialog("Alerta", "El formato del número telefónico no es correcto, el formato es +56912341234", "OK");
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
    
    onChange_preferenciasContacto: function(executionContext){
        var emailOption = {value : 657130001, text : "E-Mail"};
        var pushOption = {value : 657130002, text : "PUSH"};
        var smsOption = {value : 657130003, text : "SMS"};
        var noNotificacion = false;
        var tieneEmail = false;
        var tieneTelefono = false;
        var formContext = executionContext.getFormContext();
        var preferenciasContacto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_preferenciasdecontacto", null);
        
        if(preferenciasContacto)
        {
            if(preferenciasContacto.length > 0)
            {
                for(var i = 0; i < preferenciasContacto.length; i++)
                {
                    if(preferenciasContacto[i] == 657130000) //no requiere notificacion
                    {        
                        noNotificacion = true;
                        
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "required");                        
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_telefonocelular", "required");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular"); 
                    }
                    else if(preferenciasContacto[i] == 657130001) //email
                    {         
                        tieneEmail = true;
                        
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "required");                        
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                    }
                    else if(preferenciasContacto[i] == 657130002 || preferenciasContacto[i] == 657130003) //push/sms
                    {
                        tieneTelefono = true;
                        
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_telefonocelular", "required");
                        JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular"); 
                    }                    
                }                
            }
        }
        
        if(!tieneEmail)
        {                       
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "none"); 
            JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
        }
        
        if(!tieneTelefono)
        {    
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_telefonocelular", "none");
            JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");            
        }
        
        if(noNotificacion && (tieneEmail || tieneTelefono))
        {
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "Canal de notificación y/o respuesta cliente: no puede seleccionar 'Cliente no requiere notificación' junto al restante de las opciones."};
            var alertOptions = { height: 200, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function (success) {                   
                    formContext.getAttribute("xmsbs_preferenciasdecontacto").setValue([657130000]); //cliente no requiere notifiacion
                    
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_emailcliente", "required");                        
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_emailcliente");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_telefonocelular", "required");
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_telefonocelular");        
                },
                function (error) {
                    //console.log(error.message);
                }
            );
        }
    },
    
    onChange_producto: function (executionContext) {
        var formContext = executionContext.getFormContext();
        var productoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_familiaproducto");     
   
        if(productoId)
        {
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
            CasoIngresoCRM.preSearchDescripcionProblema(executionContext);
            
            JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_descripcionproblema");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_descripcionproblema", "required"); 
            
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta2", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta3", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta4", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none"); 
                      
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_descripcionproblema", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta2", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta3", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta4", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta2");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta3");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta4");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");            
        }
        else
        {
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_descripcionproblema");
            
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_descripcionproblema", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta2", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta3", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta4", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none"); 
            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_descripcionproblema", null);            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta2", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta3", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta4", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta2");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta3");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta4");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
			formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);
					
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
            CasoIngresoCRM.limpiarDatosNecesarios(executionContext);			
        }
	},  
    onChange_descripcionProblema: function(executionContext){
		var formContext = executionContext.getFormContext();
        var idDescripcionProblema = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_descripcionproblema", null);
        
        if(idDescripcionProblema)
        {
            if (idDescripcionProblema.indexOf("{") > -1)
            {
                idDescripcionProblema = idDescripcionProblema.substring(1, 37);
            }
            
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta2", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta3", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta4", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta2");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta3");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta4");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta2", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta3", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta4", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
            
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
            
            var pregunta1 = CasoIngresoCRM.buscarPregunta1(executionContext, idDescripcionProblema);
            
            if(pregunta1 != null && pregunta1 != "")
            {            
                CasoIngresoCRM.obtenerTipoDetalleOperacionPregunta(pregunta1);
                
                if (!pregunta1.xmsbs_ultimapregunta)
				{                    
					JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta2");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta2", "required");
				}
                else
                {                    
                    CasoIngresoCRM.validarUltimaPregunta(executionContext, pregunta1, "xmsbs_descripcionproblema", "");
                }
            }
        }
        else
        {
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta2", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta3", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta4", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta2");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta3");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta4");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta2", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta3", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta4", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
            
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
			formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);
					
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
			CasoIngresoCRM.limpiarDatosNecesarios(executionContext);
        }
    },
    onChange_pregunta1: function(executionContext){
		var formContext = executionContext.getFormContext();
        var idPregunta1 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2", null);
        
        if(idPregunta1)
        {
            if (idPregunta1.indexOf("{") > -1)
            {
                idPregunta1 = idPregunta1.substring(1, 37);
            }
            
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta3", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta4", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta3");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta4");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta3", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta4", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
            
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
            
            var fieldName = "xmsbs_pregunta2respaldo";
            var id = idPregunta1;
            var name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta2", null);
            var entityType = JumpStartLibXRM.Fx.getLookupValueEntityType(executionContext, "xmsbs_pregunta2", null);
            JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);            
        
            var pregunta2 = CasoIngresoCRM.buscarPregunta2(executionContext, idPregunta1);
            
            if(pregunta2 != null && pregunta2 != "")
            {          
                CasoIngresoCRM.obtenerTipoDetalleOperacionPregunta(pregunta2);
                
                if (!pregunta2.xmsbs_ultimapregunta)
				{                    
					JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta3");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta3", "required"); 
				}
                else
                {
                    CasoIngresoCRM.validarUltimaPregunta(executionContext, pregunta2, "xmsbs_pregunta2", "xmsbs_pregunta2respaldo");
                }
            }
        }
        else
        { 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta3", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta4", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta3");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta4");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta3", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta4", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
            
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
			formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);
					
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
			CasoIngresoCRM.limpiarDatosNecesarios(executionContext);
        }
    },
	
    onChange_pregunta2: function(executionContext){
		var formContext = executionContext.getFormContext();
		var idPregunta2 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta3", null);
        
        if(idPregunta2)
        {
            if (idPregunta2.indexOf("{") > -1)
            {
                idPregunta2 = idPregunta2.substring(1, 37);
            }
            
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta4", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta4");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta4", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
            
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
            
            var fieldName = "xmsbs_pregunta3respaldo";
            var id = idPregunta2;
            var name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta3", null);
            var entityType = JumpStartLibXRM.Fx.getLookupValueEntityType(executionContext, "xmsbs_pregunta3", null);
            JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
        
            var pregunta3 = CasoIngresoCRM.buscarPregunta3(executionContext, idPregunta2);
            
            if(pregunta3 != null && pregunta3 != "")
            {            
                CasoIngresoCRM.obtenerTipoDetalleOperacionPregunta(pregunta3);
                
                if (!pregunta3.xmsbs_ultimapregunta)
				{                    
					JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta4");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta4", "required"); 
				}
                else
                {
                    CasoIngresoCRM.validarUltimaPregunta(executionContext, pregunta3, "xmsbs_pregunta3", "xmsbs_pregunta3respaldo");
                }
            }
        }
        else
        { 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta4", "none"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta4");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta4", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
			
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
			formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);			
            
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
			CasoIngresoCRM.limpiarDatosNecesarios(executionContext);
        }
    },
	
    onChange_pregunta3: function(executionContext){
		var formContext = executionContext.getFormContext();
        var idPregunta3 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta4", null);
        
        if(idPregunta3)
        {
            if (idPregunta3.indexOf("{") > -1)
            {
                idPregunta3 = idPregunta3.substring(1, 37);
            }
            
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
            
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
            
            var fieldName = "xmsbs_pregunta4respaldo";
            var id = idPregunta3;
            var name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta4", null);
            var entityType = JumpStartLibXRM.Fx.getLookupValueEntityType(executionContext, "xmsbs_pregunta4", null);
            JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
            
            var pregunta4 = CasoIngresoCRM.buscarPregunta4(executionContext, idPregunta3);
            
            if(pregunta4 != null && pregunta4 != "")
            {           
                CasoIngresoCRM.obtenerTipoDetalleOperacionPregunta(pregunta4);
                
                if (!pregunta4.xmsbs_ultimapregunta)
				{                    
					JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta5");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "required"); 
				}
                else
                {
                    CasoIngresoCRM.validarUltimaPregunta(executionContext, pregunta4, "xmsbs_pregunta4", "xmsbs_pregunta4respaldo");
                }
            }
        }
        else
        {  
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta5", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
			
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
			formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);			
            
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
			CasoIngresoCRM.limpiarDatosNecesarios(executionContext);
        }
    },
	
    onChange_pregunta4: function(executionContext){
		var formContext = executionContext.getFormContext();
        var idPregunta4 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta5", null);
        
        if(idPregunta4)
        {
            if (idPregunta4.indexOf("{") > -1)
            {
                idPregunta4 = idPregunta4.substring(1, 37);
            }
            
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
            
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
            
            var fieldName = "xmsbs_pregunta5respaldo";
            var id = idPregunta4;
            var name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta5", null);
            var entityType = JumpStartLibXRM.Fx.getLookupValueEntityType(executionContext, "xmsbs_pregunta5", null);
            JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
            
            var pregunta5 = CasoIngresoCRM.buscarPregunta5(executionContext, idPregunta4);
            
            if(pregunta5 != null && pregunta5 != "")
            {          
                CasoIngresoCRM.obtenerTipoDetalleOperacionPregunta(pregunta5);
                
                if (!pregunta5.xmsbs_ultimapregunta)
				{                    
					JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta6");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "required"); 
				}
                else
                {
                    CasoIngresoCRM.validarUltimaPregunta(executionContext, pregunta5, "xmsbs_pregunta5", "xmsbs_pregunta5respaldo");
                }
            }
        }
        else
        {  
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "none");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_pregunta6");
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pregunta6", null);
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
			formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);			
            
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
			CasoIngresoCRM.limpiarDatosNecesarios(executionContext);
        }
    },
    
    onChange_pregunta5: function(executionContext){
		var formContext = executionContext.getFormContext();
        var idPregunta5 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta6", null);
        
        if(idPregunta5)
        {
            if (idPregunta5.indexOf("{") > -1)
            {
                idPregunta5 = idPregunta5.substring(1, 37);
            }
               
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
         
            var fieldName = "xmsbs_pregunta6respaldo";
            var id = idPregunta5;
            var name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta6", null);
            var entityType = JumpStartLibXRM.Fx.getLookupValueEntityType(executionContext, "xmsbs_pregunta6", null);
            JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
            
            var pregunta6 = CasoIngresoCRM.buscarPregunta6(executionContext, idPregunta5);
            
            if(pregunta6 != null && pregunta6 != "")
            {          
                CasoIngresoCRM.obtenerTipoDetalleOperacionPregunta(pregunta6);
                
                if (!pregunta6.xmsbs_ultimapregunta)
				{                    
					JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta6");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_pregunta6", "required"); 
				}
                else
                {
                    CasoIngresoCRM.validarUltimaPregunta(executionContext, pregunta6, "xmsbs_pregunta6", "xmsbs_pregunta6respaldo");
                }
            }            
        }
        else
        {
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
			formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);			
			
            CasoIngresoCRM.ocultarSeccionDetalle(executionContext);
			CasoIngresoCRM.limpiarDatosNecesarios(executionContext);
        }
    },
    
    onChange_arbolPreguntas: function(executionContext){

		//debugger;
		// JM: 15.02.2024 
		// Antes aplicaba la lógica que si el campo tiene valor, entonces lo muestra. (campos: xmsbs_pregunta2respaldo, xmsbs_pregunta3respaldo, xmsbs_pregunta4respaldo, xmsbs_pregunta5respaldo, xmsbs_pregunta6respaldo)
		// Ahora consulta el producto seleccionado, si es Tarjeta de Crédito o Débito entonces oculta el arbol, y solo muestra: xmsbs_producto y xmsbs_detalledetipologia (fnc: validaVisibilidadCamposTipologia)
		// sino, entonces muestra: xmsbs_familiaproducto, xmsbs_descripcionproblema, y solo si tienen datos: xmsbs_pregunta2respaldo, xmsbs_pregunta3respaldo, xmsbs_pregunta4respaldo, xmsbs_pregunta5respaldo, xmsbs_pregunta6respaldo

		var producto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_producto", null);

		// TARJETA DE CRÉDITO ; 24b44720-953a-eb11-a813-000d3a3b3db5
		// TARJETA DE DÉBITO ; 26b44720-953a-eb11-a813-000d3a3b3db5
		if (producto && (producto[0].id.replace(/[{}]/g, "").toLowerCase() == '24b44720-953a-eb11-a813-000d3a3b3db5' || producto[0].id.replace(/[{}]/g, "").toLowerCase() == '26b44720-953a-eb11-a813-000d3a3b3db5'))
			return;

		var idPregunta2 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2respaldo", null);
        var idPregunta3 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta3respaldo", null);
        var idPregunta4 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta4respaldo", null);
        var idPregunta5 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta5respaldo", null);
        var idPregunta6 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta6respaldo", null);
        
        if(idPregunta2)
        {
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta2respaldo");
        }
        
        if(idPregunta3)
        {
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta3respaldo");
        }
        
        if(idPregunta4)
        {
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta4respaldo");
        }
        
        if(idPregunta5)
        {
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta5respaldo");
        }
        
        if(idPregunta6)
        {
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta6respaldo");
        }
    },

    validaVisibilidadCamposTipologia:function(executionContext, tipoFormulario){
		// JM: 15.02.2024 ; Se solicita que si el producto es Tarjeta de Crédito o Débito entonces oculta el árbol y solo muestra los campos Producto y Detalle de Tipología
		//debugger;
        var producto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_producto", null);
		var familiaproducto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_familiaproducto", null);
		
		// TARJETA DE CRÉDITO ; 24b44720-953a-eb11-a813-000d3a3b3db5
		// TARJETA DE DÉBITO ; 26b44720-953a-eb11-a813-000d3a3b3db5		
		if ((producto && 
			(producto[0].id.replace(/[{}]/g, "").toLowerCase() == '24b44720-953a-eb11-a813-000d3a3b3db5' || 
			 producto[0].id.replace(/[{}]/g, "").toLowerCase() == '26b44720-953a-eb11-a813-000d3a3b3db5'))
			 ||
			familiaproducto == null)
		{
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_producto");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_detalledetipologia");

			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_familiaproducto1");
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_descripcionproblema1");

			JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_familiaproducto" , "none");
			JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_descripcionproblema" , "none");
			
			if(tipoFormulario == '1'){
                var formContext = executionContext.getFormContext();
                formContext.ui.tabs.get("general").sections.get("datoscaso").setVisible(false); //ingreso			
			}
			return;
		}
		
		// Se debe validar si es SubRequerimiento
		var casopadre = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
		if(!casopadre){
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_producto");
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_detalledetipologia");
			
			JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_producto" , "none");
			JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_detalledetipologia" , "none");
		}
		
		return;
		
		
		
		// LOGICA ANTERIOR
		// (Esta sección de código se mantiene por un tiempo a modo de respaldo, luego se puede borrar)
		
		
        var tipoDetalle = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_descripcionproblema", null);
        //debugger
        if(!producto && !tipoDetalle){
            //Si no tienen datos, se creo desde FU, y se debe ocultar el arbol y dejar producto y tipología
            //JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_producto");
            //JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_detalledetipologia");
            
            if(tipoFormulario == '1'){
                //Si no tienen datos, se creo desde FU, y se debe ocultar el arbol y dejar producto y tipología
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_producto");
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_detalledetipologia");
            
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_familiaproducto1");
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_descripcionproblema1");
                
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_familiaproducto" , "none");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_descripcionproblema" , "none");
                
                var formContext = executionContext.getFormContext();
                formContext.ui.tabs.get("general").sections.get("datoscaso").setVisible(false); //ingreso
            }
            else{
                //Si no tienen datos, se creo desde FU, y se debe ocultar el arbol y dejar producto y tipología
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_producto");
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_detalledetipologia");
            
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_familiaproducto1");
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_descripcionproblema1");
                
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_familiaproducto" , "none");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_descripcionproblema" , "none");
            }
        }
        else{
            //Si tienen datos, se creó desde Ingreso Unico CRM y mantener ocultos. Pero debemos validar si es subrequerimiento también
            var casopadre = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
            if(!casopadre){
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_producto");
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_detalledetipologia");
                
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_producto" , "none");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_detalledetipologia" , "none");
            }
        }
    },

    onChangeSeleccionContrato: function(executionContext){   
		var IndexContratoSeleccionado = executionContext.getFormContext().getAttribute("xmsbs_contratoseleccion").getValue();
		var Contratoscache = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contratoseleccioncache", null);       
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_contratotexto", "none");
		
		if (IndexContratoSeleccionado != null)
		{
			var ContratoSeleccionado = Contratoscache.split(",")[IndexContratoSeleccionado-1];
			if (ContratoSeleccionado == "Cuenta no está en el listado")
			{
				JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_contratotexto", "");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_contratotexto");
				JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_contratotexto", "required");
				
				if (CasoIngresoCRM.Form.CampoCalidadParticipacion && CasoIngresoCRM.Form.CampoGlosaSubProducto){
					JumpStartLibXRM.Fx.hideField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
					JumpStartLibXRM.Fx.hideField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);
					
					JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "none");
					JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "none");
					
					JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
					JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);

					JumpStartLibXRM.Fx.setValueField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "");
					JumpStartLibXRM.Fx.setValueField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "");				
				}
			}
			else
			{
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_contratotexto");
				JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_contratotexto", ContratoSeleccionado.split(";")[0]);
				
				if (CasoIngresoCRM.Form.CampoCalidadParticipacion && CasoIngresoCRM.Form.CampoGlosaSubProducto){
					JumpStartLibXRM.Fx.showField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
					JumpStartLibXRM.Fx.showField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);
					
					JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "none");
					JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "none");
					
					JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
					JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);

					JumpStartLibXRM.Fx.setValueField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, ContratoSeleccionado.split(";")[3]);
					JumpStartLibXRM.Fx.setValueField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, ContratoSeleccionado.split(";")[4]);
					
					JumpStartLibXRM.Fx.setLabel(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "Calidad Participación");
					JumpStartLibXRM.Fx.setLabel(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "Glosa SubProducto");					
				}
			}
		}
		else
		{
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_contratotexto", "");
			if (CasoIngresoCRM.Form.CampoCalidadParticipacion && CasoIngresoCRM.Form.CampoGlosaSubProducto){
				JumpStartLibXRM.Fx.hideField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
				JumpStartLibXRM.Fx.hideField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);

				JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "none");
				JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "none");
				
				JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
				JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);
					
				JumpStartLibXRM.Fx.setValueField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "");
				JumpStartLibXRM.Fx.setValueField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "");
			}
		}
        
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
		if (tipoFormulario == JumpStartLibXRM.FormState.CREATE){
			return;
		}
		
        CasoIngresoCRM.eliminarMovimientosCaso(executionContext);
        setTimeout(function () {
            CasoIngresoCRM.refrescarGrillaMovimientosEnCaso(executionContext);
        }, 6000);
    },
	
    onChangeSeleccionContratoManual: function(executionContext){        
		// Primero formatea el texto ingresado para que solo sea numérico.
        var myControl = executionContext.getEventSource().getName();
        var campo = Xrm.Page.getControl(myControl).getValue();
		if (campo)
		{
			campo = campo.replace(/\D/g, '');
			Xrm.Page.getAttribute(myControl).setValue(campo);
		}
		
		// onchange del campo: xmsbs_contratotexto
		// por cada cambio de contenido, se deben eliminar los movimientos existentes.
		// solo aplica si la sección está visible.
		CasoIngresoCRM.mostrarBotonMovimientosCaso(executionContext, true);
		
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
		if (tipoFormulario == JumpStartLibXRM.FormState.CREATE){
			return;
		}
		
		if (CasoIngresoCRM.Form.DOConMov)
		{
			CasoIngresoCRM.eliminarMovimientosCaso(executionContext);
			setTimeout(function () {
				CasoIngresoCRM.refrescarGrillaMovimientosEnCaso(executionContext);
			}, 6000);			
		}
		else
		{
			// si el DO no considera Movimientos del Caso, entonces por cada onchange se debe crear el Contrato del CASO.
			CasoIngresoCRM.CreaContratoManualCaso(executionContext);
		}
    },		
    
    eliminarMovimientosCaso: function(executionContext){        
        var idIncident = JumpStartLibXRM.Fx.getEntityId(executionContext);
        if (idIncident.indexOf("{") > -1)
        {
            idIncident = idIncident.substring(1, 37);
        }
        
        var respuesta = CasoIngresoCRM.buscarMovimientosCaso(executionContext, idIncident);        
        if(respuesta != null && respuesta.value.length > 0)
        {
            var entity = "xmsbs_movimiento";
            var cantidadMaxProcesar = 70;
            var resto = respuesta.value.length - cantidadMaxProcesar;
            
            if(respuesta.value.length <= cantidadMaxProcesar)
            {
                for (var i = 0; i < respuesta.value.length; i++) {                
                    SDK.WEBAPI.deleteRecord(executionContext, respuesta.value[i].xmsbs_movimientoid, entity, null, null);
                }
            
                setTimeout(function () {
                    CasoIngresoCRM.refrescarGrillaMovimientosEnCaso(executionContext);
                }, 2000);
            }
            else 
            {
                for (var i = 0; i < cantidadMaxProcesar; i++) {                
                    SDK.WEBAPI.deleteRecord(executionContext, respuesta.value[i].xmsbs_movimientoid, entity, null, null);
                }
            
                setTimeout(function () {
                    for (var i = resto; i < respuesta.value.length; i++) {                
                        SDK.WEBAPI.deleteRecord(executionContext, respuesta.value[i].xmsbs_movimientoid, entity, null, null);
                    }
                }, 4000);
            
                setTimeout(function () {
                    CasoIngresoCRM.refrescarGrillaMovimientosEnCaso(executionContext);
                }, 3000);
            }            
        }
    },
    
    buscarMovimientosCaso: function(executionContext, idIncident){
        var entityType = "xmsbs_movimiento";
        var query = "$select=xmsbs_fechamovimiento,xmsbs_montocompra,_xmsbs_contratorelacionado_value,_xmsbs_caso_value";
        query += "&$filter=_xmsbs_caso_value eq '" + idIncident + "'"; // statecode eq 0 and 
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    refrescarGrillaMovimientosEnCaso: function(executionContext){
        var formContext = executionContext.getFormContext();
        var subgrid = formContext.ui.controls.get("GrillaSoloMovimientos");
        if(subgrid){
            //setTimeout(function () { subgrid.refresh(); }, 2000);
			
			subgrid.refresh();
        }          
    },

    onChangePicklistGenerico: function(executionContext, FieldPicklistName){
		
        var PickList = "";
		if (FieldPicklistName != null && FieldPicklistName != "")
			PickList = FieldPicklistName;
		else
			PickList = executionContext.getEventSource().getName();
	
        //determina el origen en base al nombre
        var OpcionesPickList = "";
		
		if (PickList.includes("multiselect"))
		{
			
			if (PickList.includes("1g"))
				OpcionesPickList = CasoIngresoCRM.Form.PickListMultiSelect1g_ArrayOptions;
			
			var IndexPicklist = executionContext.getFormContext().getAttribute(PickList).getValue();
			if (IndexPicklist != null)
			{
				var ArrayOpcionesSeleccionadas = [];
				IndexPicklist.forEach(function(OpcionSel) {

					var ItemSeleccionado = OpcionesPickList.split(";")[OpcionSel-1];
					if (ItemSeleccionado.includes(",")){
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
			if (PickList.includes("1g"))
				OpcionesPickList = CasoIngresoCRM.Form.PickList1_ArrayOptions;
			else if (PickList.includes("2g"))
				OpcionesPickList = CasoIngresoCRM.Form.PickList2_ArrayOptions;
			else if (PickList.includes("3g"))
				OpcionesPickList = CasoIngresoCRM.Form.PickList3_ArrayOptions;
			else if (PickList.includes("4g"))
				OpcionesPickList = CasoIngresoCRM.Form.PickList4_ArrayOptions;
			else if (PickList.includes("5g"))
				OpcionesPickList = CasoIngresoCRM.Form.PickList5_ArrayOptions;
			else if (PickList.includes("6g"))
				OpcionesPickList = CasoIngresoCRM.Form.PickList6_ArrayOptions;
			else if (PickList.includes("7g"))
				OpcionesPickList = CasoIngresoCRM.Form.PickList7_ArrayOptions;			

			var IndexPicklist = executionContext.getFormContext().getAttribute(PickList).getValue();
			if (IndexPicklist != null)
			{
				var ItemSeleccionado = OpcionesPickList.split(";")[IndexPicklist-1];
				if (ItemSeleccionado.includes(","))
				{
					ItemSeleccionado = ItemSeleccionado.split(",")[1];
				}
				
				
				// FRAUDE: En esta sección se agrega una función en duro, aplica solo para los campos: "Análisis de Fraude" y "Categoría del Reclamo" de las tipologías: DO-1472 DO-1473 DO-1474
				if (CasoIngresoCRM.Form.IndexBloqueadosPicklistGenerico && CasoIngresoCRM.Form.IndexBloqueadosPicklistGenerico.length > 0)
				{
					var bloqueaCampo = false;
					
					CasoIngresoCRM.Form.IndexBloqueadosPicklistGenerico.forEach(item => {
						if(item.campo == PickList && item.IndexBloqueado == IndexPicklist){
							bloqueaCampo = true;
						}
					});
					
					if (bloqueaCampo == true){
						var alertStrings = { confirmButtonLabel: "Aceptar", text: "Momentáneamente no es posible seleccionar la opción: " + ItemSeleccionado + ".", title: "Opción Bloqueada" };
						var alertOptions = { height: 120, width: 240 };
						Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
							function (success) {
								//debugger;
								
								JumpStartLibXRM.Fx.setValueField(executionContext, PickList, null);
								JumpStartLibXRM.Fx.setFocus(executionContext, PickList);
								
							},
							function (error) {
								//console.log(error.message);
							}
						);
						return;
					}
				}

				JumpStartLibXRM.Fx.setValueField(executionContext, PickList + "_texto", ItemSeleccionado);
				
				// si el campo es picklist1, y tiene el campo: xmsbs_fncjsonchange tiene el valor: 657130005 (Picklist, Según P1 muestra P2)
				// y si el item seleccionado está dentro de los items que permiten la visibilidad del picklist2 (xmsbs_visibilidadpicklist2g), entonces muestra el picklist2
				
				if (PickList == "xmsbs_picklist1g" && CasoIngresoCRM.Form.Visibilidadpicklist2g != null)
				{
					var arrayVisibilidad = CasoIngresoCRM.Form.Visibilidadpicklist2g.split(";");
					var esVisible = false;
					
					for (var i = 0; i < arrayVisibilidad.length; i++){
						if (arrayVisibilidad[i] === ItemSeleccionado){
						  esVisible = true;
						}
					}
					
					if (esVisible)
					{
						JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_picklist2g");
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist2g", "required");
					}
					else
					{
						JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_picklist2g");	
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist2g", "none");
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist2g", null);
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist2g_texto", "");						
					}
				}
			}
			else
			{
				JumpStartLibXRM.Fx.setValueField(executionContext, PickList + "_texto", "");
				
				if (PickList == "xmsbs_picklist1g" && CasoIngresoCRM.Form.Visibilidadpicklist2g != null){
					
					JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_picklist2g");	
					JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_picklist2g", "none");
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist2g", null);
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_picklist2g_texto", "");
				}				
			}
		}
    },
	
    PicklistGenerico: function(executionContext, CampoPickList,  valores, borrar, label, lectura, predeterminado, requerido, visible) { 
		// predeterminado: no aplica
		
		var CampoTexto = CampoPickList + "_texto";
		
		
        var formContext = executionContext.getFormContext();
		var tipoFormulario = formContext.ui.getFormType();
		
		if (tipoFormulario == JumpStartLibXRM.FormState.READ_ONLY ||
			tipoFormulario == JumpStartLibXRM.FormState.DISABLED)
			lectura = true;
				
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CampoTexto , "none");
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CampoPickList, "none");
		
		//if (visible)
		//{
			if (borrar)
			{
				if (visible){
					JumpStartLibXRM.Fx.setValueField(executionContext, CampoTexto, null);
					JumpStartLibXRM.Fx.setValueField(executionContext, CampoPickList, null);
				}			
			}			
			
			if (lectura)
			{
				if (CampoPickList == "xmsbs_picklist2g" && CasoIngresoCRM.Form.Visibilidadpicklist2g != null)
				{
					// si se cumple la condición, implica que el picklist 2 (texto) está sujeto a visibilidad.
					
					
					var arrayVisibilidad = CasoIngresoCRM.Form.Visibilidadpicklist2g.split(";");
					visible = false;
					for (var i = 0; i < arrayVisibilidad.length; i++){
						if (arrayVisibilidad[i] === ItemSeleccionado){
						  visible = true;
						}
					}
					
					if (visible){
						JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_picklist2g_texto");
						JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist2g_texto");
						JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_picklist2g_texto", label);
					}
				}
				else
				{
					if (visible)
						JumpStartLibXRM.Fx.showField(executionContext, CampoTexto);
					
					JumpStartLibXRM.Fx.disableField(executionContext, CampoTexto);
					JumpStartLibXRM.Fx.setLabel(executionContext, CampoTexto, label);
				}
			}
			else
			{
				if (CampoPickList.includes("multiselect"))
				{
					
					if (CampoPickList.includes("1g"))
						CasoIngresoCRM.Form.PickListMultiSelect1g_ArrayOptions = valores;
				}
				else
				{
					if (CampoPickList.includes("1g"))
						CasoIngresoCRM.Form.PickList1_ArrayOptions = valores;
					else if (CampoPickList.includes("2g"))
						CasoIngresoCRM.Form.PickList2_ArrayOptions = valores;
					else if (CampoPickList.includes("3g"))
						CasoIngresoCRM.Form.PickList3_ArrayOptions = valores;
					else if (CampoPickList.includes("4g"))
						CasoIngresoCRM.Form.PickList4_ArrayOptions = valores;
					else if (CampoPickList.includes("5g"))
						CasoIngresoCRM.Form.PickList5_ArrayOptions = valores;
					else if (CampoPickList.includes("6g"))
						CasoIngresoCRM.Form.PickList6_ArrayOptions = valores;
					else if (CampoPickList.includes("7g"))
						CasoIngresoCRM.Form.PickList7_ArrayOptions = valores;					
				}
				
				if (visible)
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
						
						if (textoItem.includes(","))
						{
							textoItem = textoItem.split(",")[1];
						}
			
						let valorItem = i + 1;
						var opcion = {value : valorItem, text : textoItem};
						PickList.addOption(opcion);
					}
                    
                    JumpStartLibXRM.Fx.addOnChange(executionContext, CampoPickList, "CasoIngresoCRM.onChangePicklistGenerico");
				}
				else
				{
					// MSG ERROR CONFIGURACION CAMPO
				}
				
				if (CampoPickList == "xmsbs_picklist2g" && CasoIngresoCRM.Form.Visibilidadpicklist2g != null)
				{
					
					CasoIngresoCRM.onChangePicklistGenerico(executionContext, "xmsbs_picklist1g");
				}
			}
		//}
    },	
	
	
	onChangeAnoDeuda: function(executionContext){
		var anoDeuda = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_anodeuda", null);
		if (anoDeuda)
		{
			anoDeuda.format().replace(/\./g, ' ');
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_anodeuda", anoDeuda);			
		}
	},
	
	onChangeSoloNumeros: function(executionContext) {      
        var myControl = executionContext.getEventSource().getName();
        var campo = Xrm.Page.getControl(myControl).getValue();
		if (campo)
		{
			campo = campo.replace(/\D/g, '');
			Xrm.Page.getAttribute(myControl).setValue(campo);
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
	
	onChangeSoloLetras: function(executionContext) {
        var campo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_nombredelfuncionarioquesolicita", null);
        campo = campo.replace(/[^a-zA-Z ]/g, '');
        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombredelfuncionarioquesolicita", campo);
	},

    onChange_canalIngreso: function(executionContext) {
        var _canalIngreso = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_puntodecontacto", "");
        
        if(_canalIngreso != null && _canalIngreso != "")
        {
            if(_canalIngreso.toLowerCase() == "contact center")
            {
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_idllamada", "required");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_idllamada");
            }
            else
            {
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_idllamada", null);
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_idllamada", "none");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_idllamada");                
            }
			
			//debugger;
			// si el onchange ocurre previo a seleccionar el producto etc. entonces esta función no hará nada.
			// pero si ocurre posterior, entonces debe validar si la Tipología seleccionada está habilitada para el Origen seleccionado.
			CasoIngresoCRM.obtenerTipoDetalleOperacion(executionContext);
        } 
        else
        {
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_idllamada", null);
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_idllamada", "none");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_idllamada");
        }       
	},
//==================
//FUNCIONES ONSAVE
//==================

	onSave_Formulario: function (executionContext){
		if (!CasoIngresoCRM.Form.FormOKSave)
        {
			var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: CasoIngresoCRM.Form.FormNoOKMotivo};
			var alertOptions = { height: 200, width: 260 };
			Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then( function (success) {}, function (error) {});
			executionContext.getEventArgs().preventDefault();
            return;
        }	
	
        if (!CasoIngresoCRM.Form.CargaCamposDinamicosCompleta)
        {
			executionContext.getEventArgs().preventDefault();
            return;
        }
        
    
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		CasoIngresoCRM.Form.FormTypePreSave = estado;
        //Si el caso se esta recién creando
		if (estado == '1' && !CasoIngresoCRM.variableGlobal.preguntaInvalida)
        {
            var detalleOperacionID = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledeoperacion", null);
            var idIngresador = JumpStartLibXRM.Fx.getValueField(executionContext, "ownerid", null);
            var idPuntoContacto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_puntodecontacto", null);
            var prioridad = JumpStartLibXRM.Fx.getValueField(executionContext, "prioritycode", null);
            
            if(!prioridad)
            {
                prioridad = 2; //normal
            }
            
            var response = null;
            var ApiUrlCreacionCaso = "/Caso/IngresoNativoCRM?idDetalleOperacion=" + detalleOperacionID[0].id + "&idIngresador=" + idIngresador[0].id + "&idPuntoContacto=" + idPuntoContacto[0].id + "&prioridad=" + prioridad;
           // var apiToken = window.sessionStorage.getItem("LokiAuthToken");             
            var service = CasoIngresoCRM.GetRequestObject();
            
            if (service != null)
            {
                service.open("GET", CasoIngresoCRM.URL.Azure + ApiUrlCreacionCaso, false);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader(CasoIngresoCRM.ApiKey.Name, CasoIngresoCRM.ApiKey.Key);
               // service.setRequestHeader("TokenApi", apiToken);
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
                
                //JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_ingresounicofinalizado", true);   
            }
            else
            {
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "La tipología seleccionada no tiene una configuracion de flujo. Favor contactarse con el administrador de la plataforma."};
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
		
		CasoIngresoCRM.formContext.data.entity.addOnPostSave(CasoIngresoCRM.PostOnSave);
    },
	
	PostOnSave: function (executionContext){
		// workaround para el refresh de la grilla. 
		// si el formulario es creación, entonces fuerza el refresh de la página.
		if (CasoIngresoCRM.Form.FormTypePreSave == JumpStartLibXRM.FormState.CREATE){
			// Aplica solo si el contrato es manual.
			var ContratoManual = JumpStartLibXRM.Fx.getVisible(executionContext, "xmsbs_contratotexto");
			if (ContratoManual)
				CasoIngresoCRM.CreaContratoManualCaso(executionContext);
			
			CasoIngresoCRM.MensajeCreacionCaso(executionContext);
			
			// RECARGA EL FORM
			// Xrm.Utility.openEntityForm("incident", CasoIngresoCRM.formContext.data.entity.getId().replace(/[{}]/g, ""));
		}
	},
	
	CreaContratoManualCaso: function (executionContext) {
			
		var IncidentId = CasoIngresoCRM.formContext.data.entity.getId();
		var NumeroDeCuenta = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contratotexto", null);
		var NumeroOperacionContrato = NumeroDeCuenta;
		var codigoMoneda = ""; // N/A , se indica al momento de ingresar el primer movimiento manual.
		var codEntidad = "0035";
		var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);

		if (!NumeroDeCuenta)
			return;

		// CREA EL CONTRATO Manual
		var entity = "xmsbs_contratosdelcaso";
		var objeto = {};
		objeto["xmsbs_caso@odata.bind"] = "/incidents(" + IncidentId.replace(/[{}]/g, "") + ")";
		objeto["xmsbs_name"] = NumeroDeCuenta;
		objeto["xmsbs_numerodeoperacionocontrato"] = NumeroOperacionContrato;
		objeto["xmsbs_numerodecuenta"] = NumeroDeCuenta;
		objeto["xmsbs_rut"] = rut;
		objeto["xmsbs_codigoentidad"] = codEntidad;
		objeto["xmsbs_tipodecontrato"] = "2";
	
		var ContratoId = SDK.WEBAPI.createRecord(executionContext, objeto, entity);
		if (!ContratoId){
			alert("No se pudo crear el contrato.");
		}
	},
	
	MensajeCreacionCaso: function (executionContext){
		//if (CasoIngresoCRM.variableGlobal.usuarioId != "{8B4CF48E-AAAD-EB11-8236-0022489BAFB9}") // JM
		//{
		//	Xrm.Utility.openEntityForm("incident", CasoIngresoCRM.formContext.data.entity.getId().replace(/[{}]/g, ""));
		//	return;
		//}
		
		// Solo muestra mensaje de creación del CASO, si el estado del caso es: En espera de documentos. (se setea por WKF de forma asíncrona, desde la entidad: Documento)
		var StatusCode = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
		if (StatusCode != 657130002) // En espera de documentos
		{
			Xrm.Utility.openEntityForm("incident", CasoIngresoCRM.formContext.data.entity.getId().replace(/[{}]/g, ""));
			return;
		}

		var CorrelativoCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_numerocorrelativo", null);
		var FechaCreacion = JumpStartLibXRM.Fx.getValueField(executionContext, "createdon", null);
		var FechaComprometida = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_fechacomprometida", null);
		var Producto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_producto", null)[0].name;
		var DetalleTipologia = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledetipologia", null)[0].name;
		
		var TipoRequerimiento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipoderequerimiento", null)[0].name;
		var Producto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_producto", null)[0].name;
		var TipoDeOperacion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodeoperacion", null)[0].name;
		var DetalleOperacion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledeoperacion", null)[0].name;
		
		//var strTitle = Producto + " - " + DetalleTipologia + ". Caso creado en forma exitosa.";
		//var strOK = "Continuar";
		//var strBody = "Con fecha " + JumpStartLibXRM.Fx.formatDate(FechaCreacion) + " se ha creado el caso: " + CorrelativoCaso + ". " +
		//			  "Usted tiene hasta el " + JumpStartLibXRM.Fx.formatDate(FechaComprometida) + " para el envío de sus documentos, en caso de no recibirlos su requerimiento quedará desistido.";
		
		var strTitle = "Número de CASO: " + CorrelativoCaso;
		var strOK = "Continuar";
		var strBody = "Con fecha " + JumpStartLibXRM.Fx.formatDate(FechaCreacion) + " se ha creado el caso para la tipificación " + TipoRequerimiento + "/" + Producto + "/" + TipoDeOperacion + "/" + DetalleOperacion + ". " + 
					  "Usted tiene hasta el " + JumpStartLibXRM.Fx.formatDate(FechaComprometida) + " para el envío de sus documentos, en caso de no recibirlos su requerimiento quedará desistido.";   

		var alertStrings = { confirmButtonLabel: strOK, title: strTitle, text: strBody };
		var alertOptions = { height: 250, width: 500 };
		Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
			function (success) {
				Xrm.Utility.openEntityForm("incident", CasoIngresoCRM.formContext.data.entity.getId().replace(/[{}]/g, ""));
			},
			function (error) {
				//console.log(error.message);
			}
		);		
	},
//===========================
//FUNCIONES PARA SER LLAMADAS
//===========================
	crearCasoNEO: function (executionContext){
        
        var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);               
        var _esCreacion = true;
        var _comentario = "Ingreso Midas";
        var _casoCreadoNeo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_casocreadoneo", false); 
        
        if (incidentId.indexOf("{") > -1)
        {
            incidentId = incidentId.substring(1, 37);
        }        
        
        var ApiKey = CasoIngresoCRM.buscarApiKey(executionContext);
        var AzureURL = CasoIngresoCRM.buscarAzureURL(executionContext);
        
        if(!_casoCreadoNeo && ApiKey != null && AzureURL != null)
        {   
            var response = null;
            var ApiUrl = "Caso/CreateCasosNEO?idIncident=" + incidentId + "&esCreacion=" + _esCreacion + "&comentario=" + _comentario;
           // var apiToken = window.sessionStorage.getItem("LokiAuthToken");               
            var service = CasoIngresoCRM.GetRequestObject();

            if (service != null)
            {
                service.open("POST", AzureURL.value[0].xmsbs_valor + ApiUrl, false);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader(CasoIngresoCRM.ApiKey.Name, ApiKey.value[0].xmsbs_valor);
              //  service.setRequestHeader("TokenApi", apiToken);
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

    preSearchCanalIngreso: function (executionContext){
        
        executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addPreSearch(CasoIngresoCRM.filtrarCanalIngreso);
	},
    
    filtrarCanalIngreso: function (executionContext){
        
        var usuario = CasoIngresoCRM.datosUsuario(executionContext, CasoIngresoCRM.variableGlobal.usuarioId);
        
        if(usuario)
        {
            if(usuario.xmsbs_atiendereclamotipo) //Reguladores: 657130000, Masivos: 657130001
            { 
                var tipoReclamo = usuario.xmsbs_atiendereclamotipo;
                var origenId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_origen"); 
                var origenName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_origen", null); 

                var fetchXml = "<filter type='and'><condition attribute='xmsbs_tiporeclamo' value='" + tipoReclamo + "' operator='eq'/><condition attribute='xmsbs_visibleweb' operator='eq' value='1' /><condition attribute='xmsbs_origen' value='" + origenId + "' operator='eq' uitype='xmsbs_origen' uiname='" + origenName + "' /></filter>";              
                executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addCustomFilter(fetchXml); 
            }
        }
	},    
    
    preSearchDescripcionProblema: function (executionContext){
        executionContext.getFormContext().getControl("xmsbs_descripcionproblema").addPreSearch(CasoIngresoCRM.filtrarDescripcionProblema);
	},
    
    filtrarDescripcionProblema: function (executionContext){
        var usuario = CasoIngresoCRM.datosUsuario(executionContext, CasoIngresoCRM.variableGlobal.usuarioId);
        if(usuario)
        {
            if(usuario.xmsbs_atiendereclamotipo) //Reguladores: 657130000, Masivos: 657130001
            {       
                var tipoReclamo = usuario.xmsbs_atiendereclamotipo;
                var productoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_familiaproducto"); 
                var productoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_familiaproducto", null); 
                
                var fetchXml = "<filter type='and'>" +
                        "<condition attribute='statecode' value='0' operator='eq'/>" + 
                        "<condition attribute='xmsbs_tipodereclamo' value='" + tipoReclamo + "' operator='eq'/>" + 
                        "<condition attribute='xmsbs_familiadeproducto' value='" + productoId + "' operator='eq' uitype='xmsbs_p0familiaproducto' uiname='" + productoName + "'/>";
                
                //Si es no es subrequerimiento, debemos filtrarselo para que no muestre P1 de tipo subrequerimiento
                var casopadre = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
                if(!casopadre){
                    fetchXml = fetchXml + "<condition attribute='xmsbs_essubrequerimiento' operator='ne' value='1' />";
                }   
                fetchXml = fetchXml + "</filter>";
                        
                executionContext.getFormContext().getControl("xmsbs_descripcionproblema").addCustomFilter(fetchXml);
            }
        }
	},
    
	ReglasDeNegocio: function (executionContext){
        var origen = "JS";
		CasoIngresoCRM.onChange_TipoResolucion(executionContext, origen);
        CasoIngresoCRM.ValidaQuebrantoParaBloqueo(executionContext);
		CasoIngresoCRM.RespuestaGSC(executionContext);
        CasoIngresoCRM.ValidaReiteradoEnCreacion(executionContext);
        CasoIngresoCRM.ValidaCasosCanceladosParaBloqueoCampos(executionContext);
        CasoIngresoCRM.preSearchTipoDocumentoAltaCaso(executionContext);
        CasoIngresoCRM.visualizacionReiteradoCasoPrincipal(executionContext);
		CasoIngresoCRM.BloqueaCampoFraude(executionContext);
        CasoIngresoCRM.MuestraCamposMonedaRobotReparo(executionContext);
        CasoIngresoCRM.BloquearCamposSucursalIntegracionFUI(executionContext);
        CasoIngresoCRM.BloquearCamposSubrequerimientoTerminado(executionContext);
        CasoIngresoCRM.MostrarOcultarVistaRapidaQuebranto(executionContext);
		CasoIngresoCRM.MostrarOcultarVistaRapidaQuejas(executionContext);
        CasoIngresoCRM.ValidarPicklistGenericoContenido(executionContext);
	},
	
    camposSeccionesEtapa: function (executionContext, etapaID){
		
        var TipoFormulario = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (TipoFormulario)
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
                CasoIngresoCRM.MostraroDataCamposSecciones(executionContext, etapaID);
                
                var etapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
                if(etapaID && TipoFormulario != 1){
                    executionContext.getFormContext().ui.tabs.get("general").sections.get("documentos").setVisible(true);
                }
               
                if(etapaID){
                    
                    CasoIngresoCRM.MostraroDataSecciones(executionContext, etapaID);
                    CasoIngresoCRM.SeccionGrilla(executionContext, etapaID);
					CasoIngresoCRM.SeccionPolizas(executionContext, etapaID);
                    CasoIngresoCRM.SeccionSucursales(executionContext, etapaID);
                }				
			}
			else
			{
				//alert("Para ejecutar la validación, es necesario contar con un caso asociado");
			}
		}
	},	

    SeccionGrilla: function (executionContext, etapaId){
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_seccion", "?$" + 
                    "select=_xmsbs_vista_value,xmsbs_etiqueta,xmsbs_lectura,xmsbs_name,xmsbs_tab,xmsbs_visible&$" +
                    "expand=xmsbs_vista($select=xmsbs_codguid,xmsbs_name)&$" +
                    "filter=statecode eq 0 and _xmsbs_vista_value ne null and _xmsbs_etapa_value eq '" +  etapaId.replace(/[{}]/g, "") + "'").then(
            function success(results) {  

                let arraySeccionesGrilla = new Array ();
                
                for (var i = 0; i < results.entities.length; i++) {
					// SE PODRAN MOSTRAR HASTA 3 GRILLAS
					// generalmente solo será 1 grilla por formulario, pero se deja abierta la posibilidad de que puedan ser hasta 3 grillas.
					//if (i>2) 
						//break; // permite hasta 3 grillas, si por configuración de la matriz existen más, no se deben procesar las excedentes.
				
                    
                    // Según definición de Negocio, solo podrá ser 1 grilla por tipología.
                    if (i>0) 
                        break;
                    
					var nombreTab = results.entities[i]["xmsbs_tab"];
					var nombreSeccion = results.entities[i].xmsbs_name;
					var visibleOpcion = results.entities[i].xmsbs_visible;
					var vista_value = results.entities[i]["_xmsbs_vista_value"];
					var etiqueta = results.entities[i]["xmsbs_etiqueta"];
					var lectura = results.entities[i]["xmsbs_lectura"];
					var vistaGuid = results.entities[i].xmsbs_vista.xmsbs_codguid;

                    arraySeccionesGrilla.push(results.entities[i].xmsbs_seccionid);
                    
                    if (visibleOpcion)
                    {
                        executionContext.getFormContext().ui.tabs.get(nombreTab).sections.get(nombreSeccion).setVisible(true);

                        var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
                        if (marcaReiterado){
                            CasoIngresoCRM.Form.LecturaGrilla = true;
							etiqueta = etiqueta.replace("(Requerido)", "");
						}
                        else{
                            CasoIngresoCRM.Form.LecturaGrilla = lectura;
						}
						executionContext.getFormContext().ui.tabs.get(nombreTab).sections.get(nombreSeccion).setLabel(etiqueta);

                        // se aplica vista por cada grilla.
                        var NombreGrilla = "Grilla" + (i+1) + "Caso";
                        var viewToSet = { entityType: 10434, id:vistaGuid, name: "fieldview" };
                        var subgrid = executionContext.getFormContext().getControl(NombreGrilla);
                        var vs = subgrid.getViewSelector();
                        vs.setCurrentView(viewToSet);
                        subgrid.refresh();
                    }
                }
                
                CasoIngresoCRM.Form.SeccionesGrillaID = arraySeccionesGrilla;
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        ); 		
	},
    
    SeccionSucursales: function (executionContext, etapaId){
		var TipoFormulario = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (TipoFormulario == JumpStartLibXRM.FormState.CREATE)
		{ return; } // No aplica para CREATE

		var idDetalleOperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion", null);
		if (!idDetalleOperacion)
		{ return; } // No se logra obtener el detalle de operación.
		
		//el DO está marcado?
		//if (CasoIngresoCRM.variableGlobal.usuarioId == "{8B4CF48E-AAAD-EB11-8236-0022489BAFB9}") //JM
		//	CasoIngresoCRM.Form.DOSucursal = true;
		
		if (CasoIngresoCRM.Form.DOSucursal == null)
		{
			var oDetalleOperacion = CasoIngresoCRM.buscarDetalleOperacion(executionContext, idDetalleOperacion);
			if(!oDetalleOperacion)
			{ return; } // No se pudo obtener el registro Detalle Operación.	
			
			var MuestraBotonSucursal = oDetalleOperacion.xmsbs_usaselecciondesucursal;
			if(!MuestraBotonSucursal)
			{ 
				// No está marcada la opción de Polizas en el Detalle de Operación
				CasoIngresoCRM.Form.DOSucursal = false;
				return;
			} 
			CasoIngresoCRM.Form.DOSucursal = true;
		}		
		
		if (CasoIngresoCRM.Form.DOSucursal == true)
		{
			// Se debe buscar en el flujo DEL CASO (no en el flujo del DO, ya que podría ser distinto en caso de flujos versionados), 
			// si tiene el campo Sucursal como parte de los campos dinámicos entonces muestra el botón, si no, lo mantiene oculto.
			
			var FlujoCASOid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_flujosantander");
			var LstCamposFlujoCASO = CasoIngresoCRM.buscarCampoSucursal(executionContext, FlujoCASOid);
			if (LstCamposFlujoCASO)
			{
				// Muestra la grilla y solo si es UPDATE y está en estapa 1 muestra tb el botón.
				var formContext = executionContext.getFormContext();
				//formContext.ui.tabs.get("general").sections.get("seccion_interesadosypolizas").setVisible(true);
						
				var oEtapa = CasoIngresoCRM.datosOrdenEtapa(executionContext, etapaId);
				
				if(oEtapa && oEtapa.xmsbs_orden){
					var orden = oEtapa.xmsbs_orden;
					if(orden == 1){
						//validamos que el caso no sea reiterado
						var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
						if(marcaReiterado != true){
							var wrSucursal = formContext.getControl("WebResource_selectorSucursal");
							wrSucursal.setVisible(true);
						}
					}
				}
			}
		}
	},	

    SeccionPolizas: function (executionContext, etapaId){
		// La funcionalidad está 100% relacionada con el DO y NO con el Flujo. por lo tanto, si el DO tiene habilitada la Marca, entonces_
		// Se mostrarán las grillas de Interesado y Póliza (una vez creado el caso)
		// Se habilitará el botón "Consulta e Ingreso de Pólizas" en la ETAPA 01.
		// Se ocultará el botón en las demás etapas, esto provocará que el usuario no podrá realizar ninguna acción con el registro de Interesado ni con los registros de Pólizas en otras etapas.

		var TipoFormulario = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (TipoFormulario == JumpStartLibXRM.FormState.CREATE)
		{ return; } // No aplica para CREATE

		var idDetalleOperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion", null);
		if (!idDetalleOperacion)
		{ return; } // No se logra obtener el detalle de operación.
		
		//el DO está marcado?
		//if (CasoIngresoCRM.variableGlobal.usuarioId == "{8B4CF48E-AAAD-EB11-8236-0022489BAFB9}") //JM
		//	CasoIngresoCRM.Form.DOPolizas = true;
		
		if (CasoIngresoCRM.Form.DOPolizas == null)
		{
			var oDetalleOperacion = CasoIngresoCRM.buscarDetalleOperacion(executionContext, idDetalleOperacion);
			if(!oDetalleOperacion)
			{ return; } // No se pudo obtener el registro Detalle Operación.	
			
			var MuestraBotonPolizas = oDetalleOperacion.xmsbs_interesadopolizas;
			if(!MuestraBotonPolizas)
			{ 
				// No está marcada la opción de Polizas en el Detalle de Operación
				CasoIngresoCRM.Form.DOPolizas = false;
				return;
			} 
			CasoIngresoCRM.Form.DOPolizas = true;
		}		
		
		if (CasoIngresoCRM.Form.DOPolizas == true)
		{
			// Muestra la grilla y solo si es UPDATE y está en estapa 1 muestra tb el botón.
			var formContext = executionContext.getFormContext();
			formContext.ui.tabs.get("general").sections.get("seccion_interesadosypolizas").setVisible(true);
					
			var oEtapa = CasoIngresoCRM.datosOrdenEtapa(executionContext, etapaId);
			//if (CasoIngresoCRM.variableGlobal.usuarioId == "{8B4CF48E-AAAD-EB11-8236-0022489BAFB9}") //JM
			//	oEtapa.xmsbs_orden = 1;
			
			if(oEtapa && oEtapa.xmsbs_orden){
				var orden = oEtapa.xmsbs_orden;
				if(orden == 1){
                    //Estamos en etapa 1 y se configuró para mostrar, pero debemos validar que no sea Reiterado
                    //Reiterado es parentcaseid con contenido y xmsbs_marcareiterado = true
                    var esSubReq = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
                    var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
                    
                    if(!esSubReq && !marcaReiterado){
                        var wrPolizas = formContext.getControl("WebResource_botonPolizas");
                        wrPolizas.setVisible(true);
                    }
				}
			}			
		}
	},	
	terminaEnNumero: function (nombreCampo){
		var aux = nombreCampo.substring(nombreCampo.length - 1, nombreCampo.length);
		if (!isNaN(aux) && aux != "0")
		{
			return nombreCampo.substring(0, nombreCampo.length - 1);
		}
		return nombreCampo;
	},
	
	origenCasoBloqueo: function (executionContext){
        
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '1')
		{
			var datosOrigen = CasoIngresoCRM.datosOrigen(executionContext, CasoIngresoCRM.codigoOrigen.CRM);
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
		var fetchXml = "<filter type='and'><condition attribute='xmsbs_tiporeclamo' operator='eq' value='657130000' /><condition attribute='xmsbs_origenname' operator='like' value='%CRM%' /></filter>";
		executionContext.getFormContext().getControl("xmsbs_puntodecontacto").addCustomFilter(fetchXml);
	},

	puntoContactoBloqueo: function (executionContext){
		
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		var casoPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);

		if (estado == '1' && !casoPrincipal)
		{
			var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
			if(detalleOperacionID)
			{
				if (detalleOperacionID.indexOf("{") > -1){detalleOperacionID = detalleOperacionID.substring(1, 37);}
				var respuesta = CasoIngresoCRM.buscarDetalleOperacion(executionContext, detalleOperacionID);
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
						if (JumpStartLibXRM.Fx.UserHasRole(executionContext, CasoIngresoCRM.Roles.Ejecutivo))
						{
							var datospuntocontacto = CasoIngresoCRM.datospuntocontacto(executionContext, CasoIngresoCRM.codigopuntocontacto.Contact);
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
						else
						{
							var datospuntocontacto = CasoIngresoCRM.datospuntocontacto(executionContext, CasoIngresoCRM.codigopuntocontacto.Ejecutivo);
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
    
	ocultarFichaSecciones: function (formContext){        
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
        formContext.ui.tabs.get("general").sections.get("datoscliente").setVisible(true); //Datos del Cliente
        formContext.ui.tabs.get("general").sections.get("datosingreso").setVisible(true); //Datos del Ingreso
        formContext.ui.tabs.get("general").sections.get("datoscaso").setVisible(true); //Datos del Caso
        formContext.ui.tabs.get("general").sections.get("general_section_7").setVisible(false); //Información inicial 2
        formContext.ui.tabs.get("general").sections.get("datoscliente2").setVisible(false); //Datos del Cliente2
        formContext.ui.tabs.get("general").sections.get("datosingreso2").setVisible(false); //Datos del Ingreso2
        formContext.ui.tabs.get("general").sections.get("datoscaso2").setVisible(false); //Datos del Caso2
	},
        
    ocultarSeccionDetalle: function (executionContext){        
        var formContext = executionContext.getFormContext();
        var fields = formContext.ui.tabs.get("general").sections.get("Details").controls.get();
        
        for (var i = 0; i < fields.length; i++) 
        {
            if(fields[i]._controlName.toLowerCase().includes("webresource"))
            {
                var wr = formContext.getControl(fields[i]._controlName);
                wr.setVisible(false);
            }
            else
            {
                JumpStartLibXRM.Fx.hideField(executionContext, fields[i]._controlName);
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, fields[i]._controlName, "none"); 
            }                                 
        }
        
        formContext.ui.tabs.get("general").sections.get("Details").setVisible(false);
	},
    
    mostrarFichaSecciones: function (executionContext, formContext){
        //formContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(true); //Botonera
        formContext.ui.tabs.get("tab_16").setVisible(false); //Respuesta a cliente
        formContext.ui.tabs.get("tab_12").setVisible(false); //Informacion Adicional
        formContext.ui.tabs.get("tab_11").setVisible(true); //Seguimiento del caso 
        formContext.ui.tabs.get("tab_17").setVisible(true); //Publicaciones
        formContext.ui.tabs.get("tab_15").setVisible(false); //Articulos de conocimiento 
        formContext.ui.tabs.get("tab_14").setVisible(false); //Registros de visación
        formContext.ui.tabs.get("tab_18").setVisible(true); //Casos por Cliente y UR
        
        //ocultamos la sección de ingreso general
        formContext.ui.tabs.get("general").sections.get("datoscliente").setVisible(false); //Datos del Cliente
        formContext.ui.tabs.get("general").sections.get("datosingreso").setVisible(false); //Datos del Ingreso
        formContext.ui.tabs.get("general").sections.get("datoscaso").setVisible(false); //Datos del Caso
        formContext.ui.tabs.get("general").sections.get("general_section_7").setVisible(false); //Información inicial 2
        formContext.ui.tabs.get("general").sections.get("datoscliente2").setVisible(true); //Datos del Cliente2
        formContext.ui.tabs.get("general").sections.get("datosingreso2").setVisible(true); //Datos del Ingreso2
        formContext.ui.tabs.get("general").sections.get("datoscaso2").setVisible(true); //Datos del Caso2
                
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
            CasoIngresoCRM.MostrarSubrequerimientos(executionContext, incidentId);
            // var respuesta = CasoIngresoCRM.buscarSubrequerimientos(executionContext, incidentId);
            // if(respuesta.value.length){
            //     formContext.ui.tabs.get("tab_10").setVisible(true); //Subrequerimientos
            // }
            // else{
            //     formContext.ui.tabs.get("tab_10").setVisible(false); //Subrequerimientos
            // }
        }
		
        //ocultamos la sección de ingreso general
        formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false); //Tooltips creacion
        formContext.ui.tabs.get("general").sections.get("general_section_24").setVisible(true); //Tooltips edicion		
		
		//Veamos si se muestra o no la seccion de Ley de Fraude
        var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
        if(incidentId){
			
            formContext.ui.tabs.get("tab_21").setVisible(false); //Ley de Fraude
            CasoIngresoCRM.MostrarLeyFraude(executionContext, incidentId);
        }		

        //Ocultamos el cuestionario
        //formContext.ui.tabs.get("general").sections.get("seccion_preguntascaso").setVisible(false); //Preguntas del caso
        
        //Si el caso es de hipotecario, mostramos la sección de integraciones hipotecario
        var productoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_producto");
        var puntoContactoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_puntodecontacto");
                
        if((productoName != null && productoName != undefined && productoName != "") && (puntoContactoName != null && puntoContactoName != undefined && puntoContactoName != "") )
        {
            if(productoName.toLowerCase().indexOf("hipotecario") != -1)
            {
                if(puntoContactoName.toLowerCase().indexOf("cmf") != -1 || puntoContactoName.toLowerCase().indexOf("abif") != -1 || puntoContactoName.toLowerCase().indexOf("sernac") != -1 || puntoContactoName.toLowerCase().indexOf("alta") != -1){
                    formContext.ui.tabs.get("tab_20").setVisible(false); //Integraciones de hipotecario
                }
                else{
                    formContext.ui.tabs.get("tab_20").setVisible(false); //Integraciones de hipotecario
					//se oculta la seccion siempre por pedido de Diana De Maio, porque estas integraciones no van a salir por el momento 20220227
                }
            }
            else
            {
                formContext.ui.tabs.get("tab_20").setVisible(false); //Integraciones de hipotecario
            }
        }
        
        //mostramos la secciones de detalles del punto de contacto si tiene datos
        var detallesPuntoContacto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledelpuntodecontacto");
        if(detallesPuntoContacto){
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_detalledelpuntodecontacto");
        }
	},
	
	metodoParaNotificar: function (executionContext){
		
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
		
		var etapa = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_etapa", null);
		if(etapa)
		{
			var etapaId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
			CasoIngresoCRM.MostrarDatosEtapa(executionContext, etapaId);
			// var respuesta = CasoIngresoCRM.datosEtapa(executionContext, etapaId);
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

	BloquearCamposDespuesDeCrear: function (executionContext){
		JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_origen");
		JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_puntodecontacto");
	},

    ValidaQuebrantoParaBloqueo: function (executionContext){
        var detalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
        if (detalleID.indexOf("{") > -1){detalleID = detalleID.substring(1, 37);}
        var resultado = CasoIngresoCRM.tipoReclamoDetalleOperacion(executionContext, detalleID);
        if(resultado){
            var tipoReclamo = resultado.xmsbs_tiporeclamo;
            if(tipoReclamo == 657130001){ //El quebranto es de masivos
                var registroQuebranto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_registroquebranto");
                if(registroQuebranto){ //Si ya hay un registro de quebranto asociado al Caso, se bloquea los controles de accede e indicador
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_indicadordequebranto");
                    
                    //Validamos el estado del quebranto para ver si permitimos cambiar el tipo de resolución
                    var iDQuebranto = registroQuebranto;
                    if (iDQuebranto.indexOf("{") > -1){iDQuebranto = iDQuebranto.substring(1, 37);}
                    var respuesta = CasoIngresoCRM.buscarDatosQuebranto(executionContext,iDQuebranto);
                    if(respuesta){
                        var estadoQuebranto = respuesta.statuscode;
                        if(estadoQuebranto != 1){ //No está en estado CREADO
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_tipoderespuesta");
                        }
                    }
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
	
    RespuestaGSC: function (executionContext){
        var UrName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_ur");
        var estadoCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
		
        if(UrName){
			//Valido que el caso este en calidad y estado de cierre (etapa Informar respuesta al cliente)
            var urID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ur");
            if (urID.indexOf("{") > -1){urID = urID.substring(1, 37);}
            var codigoUR = "";
            var respuesta = CasoIngresoCRM.buscarCodigoUR(executionContext,urID);
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
        if(marcaReiterado){
            if (tipoFormulario == '1' || tipoFormulario == '3' || tipoFormulario == '4'){
                //Si el Caso se está creando, y además es reiterado, la parte de campos especificos debe estar bloqueado
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "general_section_10", true);
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "general_section_12", true);
            }
            else{
                if (tipoFormulario == '2'){
                    //Si ya está creado y en edición, y además en reiterado, debemos ver si estamos en la etapa 1 y bloquear los campos
                    var etapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
                    if (etapaID.indexOf("{") > -1){etapaID = etapaID.substring(1, 37);}
                    var resultado = CasoIngresoCRM.datosOrdenEtapa(executionContext, etapaID);
                    if(resultado){
                        if(resultado.xmsbs_orden){
                            var orden = resultado.xmsbs_orden;
                            if(orden == 1 || orden == "1"){
                                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "Details", true);
                                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "general_section_10", true);
                                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "general_section_12", true);
                            }
                        }
                    }
                }
            }
        }
    },
    
    ValidaCasosCanceladosParaBloqueoCampos:function(executionContext){
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
            if(flujo == "Nvo. Flujo Fraude TC TD 2020" || flujo == "Nvo. Flujo Fraude TC Manuales" || flujo == "Nvo. Flujo Fraude TD Manuales"){
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
				
				if(EstadoCaso == 3){
					//deshabilito el campo
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist1g");
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_picklist2g");
				}
			}   
        }	
    },
    
    MuestraCamposMonedaRobotReparo: function (executionContext){
        var flujo = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_flujosantander");
        if(flujo == "Flujo Robots II" || flujo == "Flujo Robots III" || flujo == "Flujo Robots IV" || flujo == "Flujo Regularizaciones Base - I (Reverso cta cliente peso o dolar)"){
            //validar etapa y estado
            var estadoCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
            if(estadoCaso == 3){ //En Reparo
                var etapa = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_etapa");
                if(etapa == "Recepcionar Requerimiento"){
                    //Estamos en la etapa de recepción, en reparo, para un flujo de robot. Muestro los campos
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_montoadevolverclp");
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_montoadevolverclp");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_montoadevolverclp", "required");
                    
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_montoadevolverusd");
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_montoadevolverusd");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_montoadevolverusd", "required");
                    
                    //Bloqueo el de moneda xmsbs_moneda
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_moneda");
                    
                }
            }
        }
    },
    
    BloquearCamposSucursalIntegracionFUI: function (executionContext){
        var estadoCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
        if(estadoCaso == 3){ //Si está en Reparo
            var etapa = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_etapa");
            if(etapa == "Recepcionar Requerimiento"){ //Si es la primera etapa
                var creadoFUI = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledetipologia", null);
                if(creadoFUI){ //Si se creó desde el Fui
                    //Está en la etapa 1, en reparo, y se creo desde FUI. Los campos de sucursal de texto se deben bloquear ya que se llenaron como integración
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursaldepago");
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursaldestino");
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursaldelevento");
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursalareasignar");
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_nombresucursal");
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursaldeorigen");
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursaldeentrega");
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_codigosucursal");
					JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_sucursaldestinoconpla");
                }
            }
        }
    },
    
    BloquearCamposSubrequerimientoTerminado: function (executionContext){
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        
        //bloqueamos la sección si el formulario es de lectura o finalizado
        if(tipoFormulario == 3 || tipoFormulario == 4){
       
         var esSubrequerimiento = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "parentcaseid");
            if(esSubrequerimiento){
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "tab_13_section_4", true);
                JumpStartLibXRM.Fx.enableDisableSection(executionContext,"general", "general_section_9", true);
            }
        }
    },
    
    MostrarOcultarVistaRapidaQuebranto: function (executionContext){
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        
        //por defecto, se oculta el form rapido este o no esté
        formContext.ui.quickForms.get("formVistaRapidaQuebranto").setVisible(false);
        
        //validamos si el formulario es lectura o finalizado o en gestión
        if(tipoFormulario == 3 || tipoFormulario == 4 || tipoFormulario == 2){
            //Validamos si es de la tipología No Estandar, y si tiene quebranto
            var producto = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_familiaproducto");
            if(producto == "No Estandarizado"){
                //Validamos que tenga un quebranto
                var registroquebranto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_registroquebranto");
                if(registroquebranto){
                    //Validamos que el quebranto sea de la GSC
                    var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
                    if (detalleOperacionID.indexOf("{") > -1){detalleOperacionID = detalleOperacionID.substring(1, 37);}
                    var resultado = CasoIngresoCRM.buscarDetalleOperacion(executionContext, detalleOperacionID);
                    if(resultado){
                        var quebrantoGsc = resultado.xmsbs_quebrantogsc;
                        if(quebrantoGsc){
                            //Se muestra la sección
                            formContext.ui.quickForms.get("formVistaRapidaQuebranto").setVisible(true); 
                        }
                    }
                }
            }
        }
    },
	
    MostrarOcultarVistaRapidaQuejas: function (executionContext){
        var formContext = executionContext.getFormContext();
        
        //por defecto, se oculta el form rapido este o no esté
        formContext.ui.quickForms.get("FormVistaRapidaQuejas").setVisible(false);
        
		if (CasoIngresoCRM.Form.DOSucursal == null)
		{
			var idDetalleOperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion", null);
			var oDetalleOperacion = CasoIngresoCRM.buscarDetalleOperacion(executionContext, idDetalleOperacion);
			if(!oDetalleOperacion)
			{ return; } // No se pudo obtener el registro Detalle Operación.	
			
			CasoIngresoCRM.Form.DOSucursal = oDetalleOperacion.xmsbs_usaselecciondesucursal;
		}

		if (CasoIngresoCRM.Form.DOSucursal == true)
			formContext.ui.quickForms.get("FormVistaRapidaQuejas").setVisible(true);
    },
    
    ValidarPicklistGenericoContenido: function (executionContext){
        //debugger;
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        
        //Tenemos que ver si el caso está en edición, si canal es web, si es etapa 2, si hay campos picklist y si los _texto están vacíos
        if (tipoFormulario == '2' || tipoFormulario == '3'){ 
            var canalDeIngreso = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_puntodecontacto", "");
            if(canalDeIngreso != null && canalDeIngreso != ""){
                if(canalDeIngreso.toLowerCase() == "web" || canalDeIngreso.toLowerCase() == "app"){
                    var etapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
                    if (etapaID.indexOf("{") > -1){etapaID = etapaID.substring(1, 37);}
                    var resultado = CasoIngresoCRM.datosOrdenEtapa(executionContext, etapaID);
                    if(resultado){
                        if(resultado.xmsbs_orden){
                            var orden = resultado.xmsbs_orden;
                            if(orden == 2 || orden == "2"){
                                //Ahora buscamos los campos de la etapa, y validamos is hay campos tipoPicklist
                                var resultado = CasoIngresoCRM.oDataCamposSecciones(executionContext, etapaID);
                                if(resultado && resultado.value.length > 0){
                                    //Ya obtuvimos los campos de la ETA002 para revisar. Y ahora buscamos los de la ETA001 para comparar.
                                    //Buscamos la etapa inicial
                                    var camposETA001 = "";
                                    var flujoDelProcesoID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_flujosantander");
                                    if (flujoDelProcesoID.indexOf("{") > -1){flujoDelProcesoID = flujoDelProcesoID.substring(1, 37);}
                                    var respuesta = CasoIngresoCRM.buscarEtapaInicial(executionContext, flujoDelProcesoID);
                                    if(respuesta){
                                        if(respuesta.value.length > 0){
                                            var etapaID = respuesta.value[0].xmsbs_etapaid;
                                            //Tenemos la etapa inicial. Ahora buscamos los campos de esa etapa
                                            var respuesta = CasoIngresoCRM.oDataCamposSecciones(executionContext, etapaID);
                                            if(respuesta && respuesta.value.length > 0){
                                               //Tenemos en  respuesta los campos de la ETA01, y en resultado lo de la ETA02
                                               camposETA001 = respuesta;
                                            }
                                        }
                                    }

                                    //Ya obtuvimos los de la ETA 001, ahora recorremos el array de la ETA002
                                    for( var i = 0; i < resultado.value.length; i++){
                                        var campo = resultado.value[i].xmsbs_nombreesquema;
                                        if(campo.startsWith("xmsbs_picklist")){
                                            //Si el campo es picklist generico, validamos que tenga valor y si su _texto tiene contenido
                                            var valorCampo = JumpStartLibXRM.Fx.getValueField(executionContext, campo, null);
                                            if(valorCampo != "" && valorCampo != null){
                                                //El campo tiene valor, vemos si _texto tiene valor
                                                var campoTexto = campo + "_texto";
                                                var valorCampoTexto = JumpStartLibXRM.Fx.getValueField(executionContext, campoTexto, null);
                                                if(valorCampoTexto == "" || valorCampoTexto == null){
                                                    //Hay un picklist generico vacío.. buscamos el campo pero en la eta001: camposETA001
                                                    for(j = 0; j < camposETA001.value.length; j++){
                                                        var nombreCampoETA001 = camposETA001.value[j].xmsbs_nombreesquema;
                                                        if(campo == nombreCampoETA001){
                                                            var valoresIngresoUnicoETA001 = camposETA001.value[j].xmsbs_valoreseningresoformunico.split(";");
                                                            //En "campo" tengo mi campo a actualizar.
                                                            //En "valorCampo" está el valor elegido
                                                            //Setear "campoTexto" con el valoresIngresoUnicoETA001[valorCampo];
                                                            
                                                            var valorPicklistIngreso = valoresIngresoUnicoETA001[valorCampo - 1];
                                                            if(valorPicklistIngreso.indexOf(",") > -1){
                                                                //Si tiene una "," por lo que hay que hacer un split
                                                                valorPicklistIngreso = valorPicklistIngreso.split(",")[1];
                                                                JumpStartLibXRM.Fx.setValueField(executionContext, campoTexto, valorPicklistIngreso);
                                                            }
                                                            else{
                                                                //No tiene una "," por lo que se pone el valor directo
                                                                JumpStartLibXRM.Fx.setValueField(executionContext, campoTexto, valorPicklistIngreso);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
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

    validarUltimaPregunta: function (executionContext, ePregunta, campo1, campo2){
        
        CasoIngresoCRM.variableGlobal.preguntaInvalida = false;
        CasoIngresoCRM.Form.CargaCamposDinamicosCompleta = false;
		
        if(ePregunta.xmsbs_tipoydetalleoperacion == null || ePregunta.xmsbs_tipoydetalleoperacion == undefined)
        {
            CasoIngresoCRM.variableGlobal.preguntaInvalida = true;
            var mensajeErrorPregunta = "";
            if(ePregunta.xmsbs_mensajedeerror != null && ePregunta.xmsbs_mensajedeerror != undefined && ePregunta.xmsbs_mensajedeerror != "")
            {
                mensajeErrorPregunta = ePregunta.xmsbs_mensajedeerror;
            }
            else
            {
                mensajeErrorPregunta = "No se puede continuar con la selección del árbol de preguntas.";
            }
            
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: mensajeErrorPregunta};
            var alertOptions = { height: 200, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function (success) {
                    //console.log("Alert dialog closed");
                    mensajeErrorPregunta = "";
                    
                    if(campo1 != "" && campo1 != undefined && campo1 != null)
                    {
                        JumpStartLibXRM.Fx.setValueField(executionContext, campo1, null);
                    }
                    
                    if(campo2 != "" && campo2 != undefined && campo2 != null)
                    {
                        JumpStartLibXRM.Fx.setValueField(executionContext, campo2, null);
                    }
                },
                function (error) {
                    //console.log(error.message);
                }
            );
        }
        else
        {
            if (ePregunta.xmsbs_ultimapregunta)
            {
                CasoIngresoCRM.obtenerTipoDetalleOperacion(executionContext);
            }
        }
	},

    obtenerTipoDetalleOperacionPregunta: function (ePregunta){
        if(ePregunta.xmsbs_tipoydetalleoperacion != null && ePregunta.xmsbs_tipoydetalleoperacion != undefined)
        {
            CasoIngresoCRM.tipoDetalleOperacion.id = ePregunta.xmsbs_tipoydetalleoperacion.xmsbs_tipoydetalledeoperacionid;
            CasoIngresoCRM.tipoDetalleOperacion.nombre = ePregunta.xmsbs_tipoydetalleoperacion.xmsbs_name;
        }
	},
	
    formatearRutCRM: function (rut){
        if(rut)
        {
            var _quitarCero = rut.substring(0, 3);

            if (_quitarCero == "000")
            {
                rut = rut.substring(3);
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

    obtenerTipoDetalleOperacion: function (executionContext) {
		var formContext = executionContext.getFormContext();
		
        if(CasoIngresoCRM.tipoDetalleOperacion.id != "" && CasoIngresoCRM.tipoDetalleOperacion.id != null && CasoIngresoCRM.tipoDetalleOperacion.id != undefined)
        {
            CasoIngresoCRM.tipoDetalleOperacion.id = CasoIngresoCRM.tipoDetalleOperacion.id.replace(/[{}]/g, "");
            
            let _height = 250;
            let _width = 300;
			let _title = "Alerta";
                            
            // Solo si el Tipo de Requerimiento: "Reclamo no estandarizado", valida que el usuario en sesión sea Responsable de UR de alguna UR del Contact Center, si no es uno de esos usuarios, se mostrará un mensaje de error.
            // esta validación se aplica antes de cualquier otra validación.
			debugger;
            let oTipoDetalleOp = CasoIngresoCRM.datosTipoDetalleOp(executionContext, CasoIngresoCRM.tipoDetalleOperacion.id);
			let TDCodigo = oTipoDetalleOp.xmsbs_tiporequerimiento.xmsbs_codigo;
			if (TDCodigo == "RNE"){
				// consulta si el usuario en sesión es responsable de alguna UR del Contact Center (en este punto aun no se obtiene la UR final del caso).

				let oUsuarioResponsable = CasoIngresoCRM.oDataResponsableURCC(executionContext, CasoIngresoCRM.variableGlobal.usuarioId);
				if(!oUsuarioResponsable || oUsuarioResponsable.value.length == 0){
					CasoIngresoCRM.Form.FormOKSave = false;
					CasoIngresoCRM.Form.FormNoOKMotivo = "Solo los Responsables de la UR pueden crear casos de tipo: Reclamo no estandarizado."
									+ "\nLa última pregunta ingresada se limpiará.";
									
					CasoIngresoCRM.limpiaUltimaPregunta(executionContext, _title, _width, _height);
                    return;
				}
				
				// si cumple la condición, avanza y evalúa el resto de condiciones...
			}
				
            //Nueva funcion para validar 10 tipificaciones y ver si el Punto de Contacto se admite
            var permiteAvanzar = CasoIngresoCRM.validaTipificacionesContact(executionContext, CasoIngresoCRM.tipoDetalleOperacion.id);
            if(!permiteAvanzar){
				CasoIngresoCRM.Form.FormOKSave = false;
                //CasoIngresoCRM.Form.FormNoOKMotivo = "El Canal de Ingreso seleccionado no se admite para la tipificación seleccionada, o está vacío.";

                // bc325ce3-f9f3-eb11-94ef-000d3ab232fc; DO-0543: ESTAFA A CLIENTE
                // d9d4ac01-faf3-eb11-94ef-000d3ab232fc; DO-0544: DESCONOCE APERTURA CUENTA LIFE
                // 0d9031c4-f9f3-eb11-94ef-000d3ab232f1; DO-0545: NUEVA LEY DE FRAUDE (20.009)
                // 08570bff-eb19-ef11-9f89-000d3ad8d133; DO-1474: DESCONOCE GIRO Y/O COMPRA
                if (CasoIngresoCRM.tipoDetalleOperacion.id.toLowerCase() == "bc325ce3-f9f3-eb11-94ef-000d3ab232fc" || 
                    CasoIngresoCRM.tipoDetalleOperacion.id.toLowerCase() == "d9d4ac01-faf3-eb11-94ef-000d3ab232fc" || 
                    CasoIngresoCRM.tipoDetalleOperacion.id.toLowerCase() == "0d9031c4-f9f3-eb11-94ef-000d3ab232f1" || 
                    CasoIngresoCRM.tipoDetalleOperacion.id.toLowerCase() == "08570bff-eb19-ef11-9f89-000d3ad8d133")
                {
                    CasoIngresoCRM.Form.FormNoOKMotivo = "Atención: debes informarle al cliente que para los casos de \"Desconoce extracción de dinero o compra realizada\" debe comunicarse al Contact Center."
									+ "\nLa última pregunta ingresada se limpiará.";
                }
                else{
					// 19/08/2025
					// Si la tipología es una de las del listado, entonces muestra el mensaje de Digitalización (se asume que son Digitalizadas porque las solicitaron de forma específica)
					// DO-1003	SEGUROS ASOCIADOS A CREDITO --> TD-1003 ; 91c45e53-23e1-ec11-bb3c-0022489c84b8
					// DO-1004	OTRAS COMPAÑIAS (No Zurich) --> TD-1004 ; 6c05cd5a-b2e2-ec11-bb3c-0022489c8271
					// DO-1091	TERCERAS COMPAÑIAS          --> TD-1091 ; 695e75d9-1ff7-ec11-bb3d-0022489dfc73
					// DO-1129	AUTO                        --> TD-1129 ; bc2fb061-b002-ed11-82e5-000d3ab69bbf
					// DO-1134	SEGUROS INDIVIDUALES        --> TD-1134 ; c7375b11-490c-ed11-82e4-000d3addbec7

					var canalDeIngreso = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_puntodecontacto", "");
					if(canalDeIngreso != null && canalDeIngreso.toLowerCase() == "sucursal")
					{

						var esDigital = CasoIngresoCRM.validaTipologiaDigitalizacion(executionContext, CasoIngresoCRM.tipoDetalleOperacion.id);
						if (esDigital){
						//if (CasoIngresoCRM.tipoDetalleOperacion.id.toLowerCase() == "91c45e53-23e1-ec11-bb3c-0022489c84b8" || CasoIngresoCRM.tipoDetalleOperacion.id.toLowerCase() == "6c05cd5a-b2e2-ec11-bb3c-0022489c8271" || CasoIngresoCRM.tipoDetalleOperacion.id.toLowerCase() == "695e75d9-1ff7-ec11-bb3d-0022489dfc73" || CasoIngresoCRM.tipoDetalleOperacion.id.toLowerCase() == "bc2fb061-b002-ed11-82e5-000d3ab69bbf" || CasoIngresoCRM.tipoDetalleOperacion.id.toLowerCase() == "c7375b11-490c-ed11-82e4-000d3addbec7") {
							debugger;
							_title = "IMPORTANTE";
							_height = 340;
							_width = 460;
							CasoIngresoCRM.Form.FormNoOKMotivo = JumpStartLibXRM.Fx.toUnicodeBold("Este flujo de atención está disponible exclusivamente a través de nuestros CANALES DIGITALES.") + 
								"\n\nIndica al cliente que debe ingresar este requerimiento en la opción \"" + JumpStartLibXRM.Fx.toUnicodeBold("Ayuda") + "\" en la " + 
								JumpStartLibXRM.Fx.toUnicodeBold("App Santander") + " o \"" + JumpStartLibXRM.Fx.toUnicodeBold("¿Necesitas ayuda?") + "\" en nuestro sitio web: " +
								JumpStartLibXRM.Fx.toUnicodeBold("banco.santander.cl") + "\n\n" + 
								JumpStartLibXRM.Fx.toUnicodeBold("Este requerimiento no está habilitado para el Canal de Ingreso seleccionado.") + "";
						}
						else
						{
							CasoIngresoCRM.Form.FormNoOKMotivo = "El Canal de Ingreso seleccionado no se admite para la tipificación seleccionada, o está vacío." 
											+ "\nLa última pregunta ingresada se limpiará.";
						}
					}
					else
					{
						CasoIngresoCRM.Form.FormNoOKMotivo = "El Canal de Ingreso seleccionado no se admite para la tipificación seleccionada, o está vacío." 
										+ "\nLa última pregunta ingresada se limpiará.";
					}					
                }

				CasoIngresoCRM.limpiaUltimaPregunta(executionContext, _title, _width, _height);
            }
            else{
				CasoIngresoCRM.Form.FormOKSave = true;
                //Si cumple con la regla, o el ingreso no corresponde a una de las 10 tipificaciones. Continúa
                //Se debe completar el tipo de Requerimiento asociado al tipo y detalle de operación
                //hacemos odata que consulta para el producto el requerimiento que corresponde
                var respuesta = CasoIngresoCRM.datosTipoDetalleOp(executionContext, CasoIngresoCRM.tipoDetalleOperacion.id);
                
                if(respuesta)
                {
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
                    var detalleOperacionID = respuesta.xmsbs_detalledeoperacion.xmsbs_detalleoperacionid;
                    var detalleOperacionName = respuesta.xmsbs_detalledeoperacion.xmsbs_name;
                    //actualizar campo detalle de operación
                    var fieldName = "xmsbs_detalledeoperacion";
                    var id = detalleOperacionID;
                    var name = detalleOperacionName;
                    var entityType = "xmsbs_detalleoperacion";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    
                    var productoID = respuesta.xmsbs_productodeservicio.xmsbs_productoservicioid;
                    var productoName = respuesta.xmsbs_productodeservicio.xmsbs_name;
                    //actualizar campo detalle de operación
                    var fieldName = "xmsbs_producto";
                    var id = productoID;
                    var name = productoName;
                    var entityType = "xmsbs_productoservicio";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    
                    var detalleTipologiaID = CasoIngresoCRM.tipoDetalleOperacion.id;
                    var detalleTipologiaName = CasoIngresoCRM.tipoDetalleOperacion.nombre;
                    //actualizar campo detalle de operación
                    var fieldName = "xmsbs_detalledetipologia";
                    var id = detalleTipologiaID;
                    var name = detalleTipologiaName;
                    var entityType = "xmsbs_tipoydetalledeoperacion";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    
                    if(detalleOperacionID){
                        var resultado = CasoIngresoCRM.buscarDetalleOperacion(executionContext, detalleOperacionID);
                        if(resultado){
                            var tooltips = resultado.xmsbs_tooltips;
                            if(tooltips){
                                //Setear en si el campo y bloquearlo
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", tooltips);
                                formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(true);
                            }
                            else
                            {
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
                                formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);
                            }
                        }
                    }
                    else
                    {
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", "");
                        formContext.ui.tabs.get("general").sections.get("general_section_23").setVisible(false);
                    }

                    //Completamos la institución desde el tipoRequerimiento
                    var respuesta = CasoIngresoCRM.datosInstitucionPorTipoReq(executionContext, tipoRequerimientoID);
                    if(respuesta){
                        var fieldName = "xmsbs_institucion";
                        var id = respuesta.xmsbs_institucion.xmsbs_institucionid;
                        var name = respuesta.xmsbs_institucion.xmsbs_name;
                        var entityType = "xmsbs_institucion";
                        JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                    }
                    
                    
                    //Reviso logica para seleccionar el punto de contacto
                    //CasoIngresoCRM.puntoContactoBloqueo(executionContext);  //comentado 25/06/2021              
                }
                
                
                //Vamos a buscar la etapa del flujo del detalle. Primero, buscamos el Flujo
                var respuesta = CasoIngresoCRM.buscarFlujoDelDetalle(executionContext, detalleOperacionID);
                if(respuesta)
                {
                    var flujoDelProcesoID = respuesta._xmsbs_flujosantander_value;
                    
                    //Buscamos la etapa inicial
                    var respuesta = CasoIngresoCRM.buscarEtapaInicial(executionContext, flujoDelProcesoID);
                    
                    if(respuesta)
                    {
                        if(respuesta.value.length > 0)
                        {
                            var etapaId = respuesta.value[0].xmsbs_etapaid;
                            var etapaName = respuesta.value[0].xmsbs_name;
                            
                            CasoIngresoCRM.Form.EtapaID = etapaId;
                            CasoIngresoCRM.Form.EtapaName = etapaName;
                            
                            //Ya tenemos la primera etapa, ahora debemos llamar a los campos a pintar
                            CasoIngresoCRM.camposSeccionesEtapa(executionContext, etapaId);
                            
                            var formContext = executionContext.getFormContext();
                            var tipoFormulario = formContext.ui.getFormType();	
                            if (tipoFormulario == JumpStartLibXRM.FormState.CREATE){
                                // verifica si existen casos previos para el mismo cliente y tipificacion.
                                var ExistenCasosPrevios = CasoIngresoCRM.oDataCasoDuplicado(executionContext);
                                if (ExistenCasosPrevios)
                                {
                                    // Muestra alerta, pero no impide la creación del caso.
                                    JumpStartLibXRM.Fx.AlertDialog("Alerta", "El cliente ya posee un caso para esta problemática dentro de los últimos 3 meses", "OK");
                                }                        
                            }
                        }
                    }
                }
				
				var canalDeIngreso = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_puntodecontacto", "");
				if(canalDeIngreso != null && (canalDeIngreso.toLowerCase() == "contact center" || canalDeIngreso.toLowerCase() == "sucursal"))
				{
					// 30/07/2025 : Si la Tipología está digitalizada, entonces muestra la alerta, el mensaje por ahora es fijo.
					// 13/08/2025 : Victoria solicita que se agregue Sucursal
					if (detalleOperacionID && CasoIngresoCRM.tipoDetalleOperacion.id)
					{
						var esDigital = CasoIngresoCRM.validaTipologiaDigitalizacion(executionContext, CasoIngresoCRM.tipoDetalleOperacion.id);
						if (esDigital)
						{
							_height = 400;
							_width = 460;
									 
							var alertStrings = { confirmButtonLabel: "Aceptar", 
												 title: "IMPORTANTE", 
												 text: JumpStartLibXRM.Fx.toUnicodeBold("Este flujo de atención está disponible exclusivamente a través de nuestros CANALES DIGITALES.") + 
													" \n\nIndica al cliente que debe ingresar este requerimiento en la opción \"" + JumpStartLibXRM.Fx.toUnicodeBold("Ayuda") + "\" en la " + 
													JumpStartLibXRM.Fx.toUnicodeBold("App Santander") + " o \"" + JumpStartLibXRM.Fx.toUnicodeBold("¿Necesitas ayuda?") + "\" en nuestro sitio web: " +
													JumpStartLibXRM.Fx.toUnicodeBold("banco.santander.cl") + "\n\n" + 
													JumpStartLibXRM.Fx.toUnicodeBold("Solo ingresa el requerimiento en MIDAS en caso de que:") + "\n\n" + 
													"\t- Cliente se encuentre en situación de " + JumpStartLibXRM.Fx.toUnicodeBold("vulnerabilidad") + ".\n" + 
													"\t- Cliente " + JumpStartLibXRM.Fx.toUnicodeBold("no pueda") + " realizar el ingreso por el sitio web o App Santander."
												};
												
							var alertOptions = { height: _height, width: _width};
							Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(function (success) {},function (error) {});
						}
					}
				}
            }
        }
    },
	
	limpiaUltimaPregunta:function (executionContext, _title, _width, _height){
		var alertStrings = { confirmButtonLabel: "Aceptar", title: _title, text: CasoIngresoCRM.Form.FormNoOKMotivo};
		var alertOptions = { height: _height, width: _width };
		Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
			function (success) {       
				// Limpia TD seleccioando
				CasoIngresoCRM.tipoDetalleOperacion.id = "";
				CasoIngresoCRM.tipoDetalleOperacion.nombre = "";
				
				//Limpiar el arbol
				var pregunta1 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_descripcionproblema");
				var pregunta2 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2");
				var pregunta3 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta3");
				var pregunta4 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta4");
				var pregunta5 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta5");
				var pregunta6 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta6");
				
				if(pregunta6){
					//Tenía pregunta 6, se limpia
					JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_pregunta6", null);
				}
				else{
					if(pregunta5){
						//Tenía pregunta 5. Se limpia
						JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_pregunta5", null);
					}
					else{
						if(pregunta4){
							//Tenía pregunta 4. Se limpia
							JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_pregunta4", null);
						}
						else{
							if(pregunta3){
								//Tenía pregunta 3. Se limpia
								JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_pregunta3", null);
							}
							else{
								if(pregunta2){
									//Tenía pregunta 2. Se limpia
									JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_pregunta2", null);
								}
								else{
									if(pregunta1){
									//Tenía pregunta 1. Se limpia
									JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_descripcionproblema", null);
									}
									else{}
								}
							}
						}
					}
				}
			},
			function (error) {
				//console.log(error.message);
			}
		);		
	},
    
    validaTipologiaDigitalizacion: function (executionContext, idTipoDetalleOperacion) {
        // valida si la tipología existe en "Digitalización", es decir, si está en alguna de las equivalencias, entonces la tipología es de digitalización.
        
		var query = "";
		var resultado = null;
		
		//debugger;
		
		// equivalencia 1
        query = "?$select=xmsbs_equivalenciap1id" + 
					"&$expand=xmsbs_pregunta1($select=xmsbs_codigo)" + 
					"&$filter=(xmsbs_pregunta1/_xmsbs_tipoydetalleoperacion_value eq " + idTipoDetalleOperacion.replace(/[{}]/g, "") + ")" + 
					"&$top=1";
        resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, "xmsbs_equivalenciap1", query, null, null, function () {});
		if(resultado && resultado.value.length > 0){
			return true;
		}

		// equivalencia 2 
        query = "?$select=xmsbs_equivalenciap2id" + 
					"&$expand=xmsbs_pregunta2($select=xmsbs_codigo)" + 
					"&$filter=(xmsbs_pregunta2/_xmsbs_tipoydetalleoperacion_value eq " + idTipoDetalleOperacion.replace(/[{}]/g, "") + ")" + 
					"&$top=1";
        resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, "xmsbs_equivalenciap2", query, null, null, function () {});
		if(resultado && resultado.value.length > 0){
			return true;
		}
		
		// equivalencia 3
        query = "?$select=xmsbs_equivalenciap3id" + 
					"&$expand=xmsbs_pregunta3($select=xmsbs_codigo)" + 
					"&$filter=(xmsbs_pregunta3/_xmsbs_tipoydetalleoperacion_value eq " + idTipoDetalleOperacion.replace(/[{}]/g, "") + ")" + 
					"&$top=1";
        resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, "xmsbs_equivalenciap3", query, null, null, function () {});
		if(resultado && resultado.value.length > 0){
			return true;
		}
		
		// equivalencia 4
        query = "?$select=xmsbs_equivalenciap4id" + 
					"&$expand=xmsbs_pregunta4($select=xmsbs_codigo)" + 
					"&$filter=(xmsbs_pregunta4/_xmsbs_tipoydetalleoperacion_value eq " + idTipoDetalleOperacion.replace(/[{}]/g, "") + ")" + 
					"&$top=1";
        resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, "xmsbs_equivalenciap4", query, null, null, function () {});
		if(resultado && resultado.value.length > 0){
			return true;
		}
		
		// equivalencia 5
        query = "?$select=xmsbs_equivalenciap5id" + 
					"&$expand=xmsbs_pregunta5($select=xmsbs_codigo)" + 
					"&$filter=(xmsbs_pregunta5/_xmsbs_tipoydetalleoperacion_value eq " + idTipoDetalleOperacion.replace(/[{}]/g, "") + ")" + 
					"&$top=1";
        resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, "xmsbs_equivalenciap5", query, null, null, function () {});
		if(resultado && resultado.value.length > 0){
			return true;
		}
		
		// equivalencia 6
        query = "?$select=xmsbs_equivalenciap6id" + 
					"&$expand=xmsbs_pregunta6($select=xmsbs_codigo)" + 
					"&$filter=(xmsbs_pregunta6/_xmsbs_tipoydetalleoperacion_value eq " + idTipoDetalleOperacion.replace(/[{}]/g, "") + ")" + 
					"&$top=1";
        resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, "xmsbs_equivalenciap6", query, null, null, function () {});
		if(resultado && resultado.value.length > 0){
			return true;
		}		
		
		return false;
    },
    campoIntegracion: function(executionContext, tipoIntegracion, borrar, label, lectura, predeterminado, requerido, visible, campocalidadparticipacion, campoglosasubproducto) {
	
		// El parámetro: "nombreEsquema" no aplica, ya que es estático al campo: "xmsbs_contratoseleccion"
		// si el campo es de solo lectura, entonces solo muestra el campo: xmsbs_contratotexto
		// si el campo es de escritura, entonces muestra el campo: xmsbs_contratoseleccion
		// En ambos casos debe renombrar el respectivo campo con lo que contenga el label
		
		// El campo xmsbs_contratoseleccioncache es para no mostrar error por pantalla en caso de que en una segunda instancia el servicio retorne error.

		
		// predeterminado: no aplica
		
        var formContext = executionContext.getFormContext();
		var tipoFormulario = formContext.ui.getFormType();	
		
		if (tipoFormulario == JumpStartLibXRM.FormState.READ_ONLY ||
			tipoFormulario == JumpStartLibXRM.FormState.DISABLED)
			lectura = true;

				
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_contratotexto", "none");
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_contratoseleccion", "none");
		
		JumpStartLibXRM.Fx.removeOnChange(executionContext, "xmsbs_contratotexto", "CasoIngresoCRM.onChangeSeleccionContratoManual");
		
		if (visible)
		{
			var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
			if (marcaReiterado)
				lectura = true;
        
			if (borrar)
			{
				JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_contratotexto", null);
				JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_contratoseleccion", null);
			}			
			
			if (lectura)
			{
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_contratotexto");
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_contratotexto");
                JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_contratotexto", label);
				
				if (campocalidadparticipacion && campoglosasubproducto)
				{
					CasoIngresoCRM.Form.CampoCalidadParticipacion = campocalidadparticipacion;
					CasoIngresoCRM.Form.CampoGlosaSubProducto = campoglosasubproducto;
					
					JumpStartLibXRM.Fx.showField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
					JumpStartLibXRM.Fx.showField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);
					
					JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "none");
					JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "none");
					
					JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
					JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);
					
					JumpStartLibXRM.Fx.setLabel(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "Calidad Participación");
					JumpStartLibXRM.Fx.setLabel(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "Glosa SubProducto");
				}
			}
			else
			{
				// Editable
				var StatusCode = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
				if (StatusCode == 3) // En reparo
				{
					//let Field_Contrato = JumpStartLibXRM.Fx.getField(executionContext, "xmsbs_contratoseleccion");
					//if (Field_Contrato && Field_Contrato.getSelectedOption() && Field_Contrato.getSelectedOption().value == 101) // está seleccionado el último ITEM: "Cuenta no está en el listado"
					
					// obtiene el contrato actual del caso, y lee el valor: Tipo de Contrato, si es = Manual, entonces aplica el resto de la lógica.
					var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
					var contratotexto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contratotexto", null);
					
					var oContrato = CasoIngresoCRM.buscarContratoCaso(executionContext, incidentId, contratotexto);
					if (oContrato && oContrato.value.length > 0 && oContrato.value[0].xmsbs_tipodecontrato == 2) // 2:Manual
					{
						// condición especial: corresponde a cuando está en REPARO, y fue seleccionado un Contrato MANUAL,
						// - la caja de texto debe quedar editable (xmsbs_contratotexto).
						// - Bloquea el campo: xmsbs_contratoseleccion
						// - Si cambia el texto de xmsbs_contratotexto entonces debe eliminar los movimientos existentes.
					
						JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_contratotexto");
						JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_contratotexto");
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_contratotexto", "required");
						
						//var contrato = formContext.getControl("xmsbs_contratoseleccion");
						//var opciones = JumpStartLibXRM.Fx.getOptions(executionContext, "xmsbs_contratoseleccion"); 
						//for (var i = 0; i < opciones.length; i++) 
						//{
						//	contrato.removeOption(opciones[i].value);
						//}
						//var opcion = {value : 1, text : "Cuenta no está en el listado"};
						//contrato.addOption(opcion);
						
						//JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_contratoseleccion");
						//JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_contratoseleccion");
						
						JumpStartLibXRM.Fx.addOnChangeV2(executionContext, "xmsbs_contratotexto", "CasoIngresoCRM.onChangeSeleccionContratoManual");
						CasoIngresoCRM.mostrarBotonMovimientosCaso(executionContext);
						return;
					}			
				
					//lectura = true;
					JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_contratotexto");
					JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_contratotexto");
					JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_contratotexto", label);					
					
					if (campocalidadparticipacion && campoglosasubproducto)
					{
						CasoIngresoCRM.Form.CampoCalidadParticipacion = campocalidadparticipacion;
						CasoIngresoCRM.Form.CampoGlosaSubProducto = campoglosasubproducto;
						
						JumpStartLibXRM.Fx.showField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
						JumpStartLibXRM.Fx.showField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);
						
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "none");
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "none");
						
						JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
						JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);

						JumpStartLibXRM.Fx.setLabel(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "Calidad Participación");
						JumpStartLibXRM.Fx.setLabel(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "Glosa SubProducto");						
					}					
					return;
				}
				
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_contratoseleccion");
				JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_contratoseleccion");
				JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_contratoseleccion", label);
				
				if (requerido)
					JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_contratoseleccion", "required");
				
				// lee API
				if(tipoIntegracion == CasoIngresoCRM.tipoIntegracion.contrato)
				{                    
					var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
					var familiaProductoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_familiaproducto");
					var descripcionProblemaId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_descripcionproblema");
					
					var contrato = formContext.getControl("xmsbs_contratoseleccion");
					var opciones = JumpStartLibXRM.Fx.getOptions(executionContext, "xmsbs_contratoseleccion"); 
					// siempre se borran todas las opciones ya que no son opciones válidas para el negocio.
					for (var i = 0; i < opciones.length; i++) 
					{
						contrato.removeOption(opciones[i].value);
					}							
					
					if (campocalidadparticipacion && campoglosasubproducto)
					{
						CasoIngresoCRM.Form.CampoCalidadParticipacion = campocalidadparticipacion;
						CasoIngresoCRM.Form.CampoGlosaSubProducto = campoglosasubproducto;
						
						JumpStartLibXRM.Fx.showField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
						JumpStartLibXRM.Fx.showField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);
						
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "none");
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "none");
						
						JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion);
						JumpStartLibXRM.Fx.disableField(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto);
						
						JumpStartLibXRM.Fx.setLabel(executionContext, CasoIngresoCRM.Form.CampoCalidadParticipacion, "Calidad Participación");
						JumpStartLibXRM.Fx.setLabel(executionContext, CasoIngresoCRM.Form.CampoGlosaSubProducto, "Glosa SubProducto");						
					}
				
					var ItemsPicklist = 0;
					
					if(rut && familiaProductoId && descripcionProblemaId)
					{
						var response = null;
						var ApiUrl = "/Santander/GetNumeroOperacion?rutCRM=" + rut + "&idFamiliaProducto=" + familiaProductoId + "&idDescripcionProblema=" + descripcionProblemaId;
						
						var service = CasoIngresoCRM.GetRequestObject();
						if (service != null)
						{
							service.open("GET", CasoIngresoCRM.URL.Azure + ApiUrl, false);
							service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
							service.setRequestHeader("Accept", "application/json,text/javascript, */*");
							service.setRequestHeader(CasoIngresoCRM.ApiKey.Name, CasoIngresoCRM.ApiKey.Key);
							service.send(null);
							if (service.response != "") 
							{
								if(service.response.includes("{"))
								{
									response = JSON.parse(service.response);
								}  
							}
						}
						
						let AplicaUltimaOpcion = true; // se define que siempre tendrá última opción = Contrato Manual.  (se deja en variable, por posible rollback)
						let TieneUltimaOpcion = false;
						let contratoseleccioncache = "";
						
						if (service == null || response == null)
						{
							// Como segundo intento antes de mostrar error, verifica el contenido del campo: "xmsbs_contratoseleccioncache", en caso de que previamente hubiese existido una ejecución correcta del servicio.
							// si no existen datos previos, entonces muestra el error
							contratoseleccioncache = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contratoseleccioncache", null);
							if(contratoseleccioncache != null)
							{
								var arrayContratos = contratoseleccioncache.split(",");

								let valorContrato = 0;
								// Se agregan las opciones encontradas
								ItemsPicklist = arrayContratos.length;
								for (var i = 0; i < arrayContratos.length; i++) 
								{
									let textoContrato = arrayContratos[i].split(";")[0];
									valorContrato = i + 1;

									var opcion = {value : valorContrato, text : textoContrato};
									contrato.addOption(opcion);	
									if (textoContrato == "Cuenta no está en el listado")
									{
										AplicaUltimaOpcion = true;
										TieneUltimaOpcion = true;
									}
								}
							}
							else
							{
								contratoseleccioncache = "";
								// Si el error contiene el texto entonces se asume que el error es que el RUT no tiene contratos, por lo tanto se le dará esa información al usuario.
								//var alertStrings = { confirmButtonLabel: "Aceptar", title: "Contrato", text: "El cliente no tiene contratos, no podrá continuar con la creación del caso."};
								////var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "Estimado usuario, el servicio presenta intermitencia. No se puede crear el caso sin seleccionar un contrato. Intente nuevamente más tarde."};

								var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "Estimado usuario, el servicio presenta intermitencia. Podrá ingresar el contrato de forma manual."};
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
						else if (!response.success)
						{
							// muestra alertas solo en el formulario de CREACION
							if (tipoFormulario == JumpStartLibXRM.FormState.CREATE)
							{
								var alertStrings = null;
								if (response.message == "No se encontraron productos asociados al cliente (Atributo KPM254F).")
								{
									alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "El cliente no tiene contratos. Podrá ingresar el contrato de forma manual."};
								}
								else
								{
									// default message
									alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "Estimado usuario, el servicio presenta intermitencia. Podrá ingresar el contrato de forma manual."};
								}
								
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
						else if(response.success)
						{
							let valorContrato = 0;
							
							if(response.numeroOperaciones.length > 0)
							{
								const contratos = [];
								
								ItemsPicklist = response.numeroOperaciones.length;
								for (var i = 0; i < response.numeroOperaciones.length; i++) 
								{
									let textoContrato = response.numeroOperaciones[i];
									valorContrato = i + 1;
									
									
									if (valorContrato > 100)
									{
										ItemsPicklist = 100;
										AplicaUltimaOpcion = true;
										TieneUltimaOpcion = false;
										break; // solo agrega hasta 100 items... dejando el último (101) para: "Cuenta no está en el listado".
									}
									
									if (i==0)
									{
										var contratotexto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contratotexto", null);
										if (contratotexto==null || contratotexto==""){
											JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_contratotexto", textoContrato); // setea con la primera opción.
                                       }                                          
									}
									
									var opcion = {value : valorContrato, text : textoContrato};
									contrato.addOption(opcion);
									
									if (campocalidadparticipacion && campoglosasubproducto)
									{
										contratos[i] = response.numeroOperaciones[i] + ";" + 
													   response.codigoMoneda[i] + ";" + 
													   response.codigoOficina[i] + ";" + 
													   response.listProductoCliente[i].calidadParticipacion + ";" + 
													   response.listProductoCliente[i].glosaSubproducto;
									}
									else
									{
										contratos[i] = response.numeroOperaciones[i] + ";" + 
													   response.codigoMoneda[i] + ";" + 
													   response.codigoOficina[i];
									}
								}
							
								contratoseleccioncache = contratos.toString();
							}
						}
						

						//if (!contratoseleccioncache.includes("Cuenta no está en el listado"))
						//	contratoseleccioncache += ",Cuenta no está en el listado";
						
						if (AplicaUltimaOpcion)
						{
							if (!TieneUltimaOpcion){
								ItemsPicklist = ItemsPicklist + 1;
								var opcion = {value : ItemsPicklist, text : "Cuenta no está en el listado"};
								contrato.addOption(opcion);
							}
							
							if(contratoseleccioncache == null || contratoseleccioncache == "")
								contratoseleccioncache = "Cuenta no está en el listado";
							else if (!contratoseleccioncache.includes("Cuenta no está en el listado"))
								contratoseleccioncache += ",Cuenta no está en el listado";
							
							JumpStartLibXRM.Fx.addOnChangeV2(executionContext, "xmsbs_contratotexto", "CasoIngresoCRM.onChangeSeleccionContratoManual");
						}
					
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_contratoseleccioncache", contratoseleccioncache);
						
						// Evalúa selección actual del campo
						var Field_Contrato = JumpStartLibXRM.Fx.getField(executionContext, "xmsbs_contratoseleccion");
						//if (Field_Contrato.getSelectedOption().text == "Cuenta no está en el listado")
						if (Field_Contrato && Field_Contrato.getSelectedOption() && 
							Field_Contrato.getSelectedOption().value == ItemsPicklist) // último item
							{
								if (contratoseleccioncache.includes("Cuenta no está en el listado"))
								{
									JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_contratotexto");
									JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_contratotexto");
									JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_contratotexto", "required");
								}
							}
						
						CasoIngresoCRM.mostrarBotonMovimientosCaso(executionContext);
					}
				}
			}
		}
    },
    buscarContratoCaso: function (executionContext, IncidentId, NumeroDeCuenta){
		var entityType = "xmsbs_contratosdelcaso";
		var query = "$select=xmsbs_name,xmsbs_rut,xmsbs_tipodecontrato&$orderby=createdon desc";
		query += "&$filter=statecode eq 0 and xmsbs_name eq '" + NumeroDeCuenta + "' and _xmsbs_caso_value eq '" + IncidentId.replace(/[{}]/g, "") + "'&$top=1";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },		
    
	//Función para desplegar iconos simulando un semaforo en un campo especifico de una vista no editable.
	displayIconTooltipBitacora: function (rowData, userLCID){
        
		var str = JSON.parse(rowData);
		//var coldata = str.xmsbs_estadosla_Value;
		var coldata = str.a_46827ce1f175eb11a812000d3ab23035.xmsbs_estadosla_Value;
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
		var VisibleCampo = JumpStartLibXRM.Fx.getVisible(executionContext, "xmsbs_documentacinsolicitada");
		if (VisibleCampo)
		{
			var EtapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
			//var DetalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
			
			if (!EtapaID)
			{
				EtapaID = CasoIngresoCRM.Form.EtapaID;
			}
			
			// Si tiene especificación a nivel de etapa, entonces filtra por la etapa.
			var respuesta = CasoIngresoCRM.oDataTipoDocumentoCaso(executionContext, null, EtapaID);
			if(respuesta){
				if(respuesta.value.length > 0){
					executionContext.getFormContext().getControl("xmsbs_documentacinsolicitada").addPreSearch(CasoIngresoCRM.filtrarTipoDocumentoAltaCasoPorEtapa);
                    return;
				}
			}

            executionContext.getFormContext().getControl("xmsbs_documentacinsolicitada").addPreSearch(CasoIngresoCRM.filtrarTipoDocumentoAltaCasoPorDetOpp);
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
		
		if (!EtapaID)
		{
			EtapaID = CasoIngresoCRM.Form.EtapaID;
			EtapaName = CasoIngresoCRM.Form.EtapaName;
		}
		// Filtra mediante
		var fetchXml = "<filter type='and'>" + 
			"<condition attribute='statecode' value='0' operator='eq'/>" + 
			"<condition attribute='xmsbs_etapa' operator='eq' uiname='" + EtapaName + "' uitype='xmsbs_etapa' value='" + EtapaID + "'/>" + 
			"</filter>";
		executionContext.getFormContext().getControl("xmsbs_documentacinsolicitada").addCustomFilter(fetchXml);							
	},
    filtrarTipoDocumentoAltaCasoPorDetOpp: function (executionContext){
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
    buscarPregunta1: function (executionContext, id){        
        //Preparamos la consulta
		var entityType = "xmsbs_preguntascaso";
		var entityId = id;
		var query = "xmsbs_name,xmsbs_ultimapregunta,xmsbs_tipologiaunica,xmsbs_mensajedeerror,statecode,statuscode";
        var expand = "xmsbs_tipoydetalleoperacion($select=xmsbs_name,xmsbs_tipoydetalledeoperacionid)"
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
    },
    
    buscarPregunta2: function (executionContext, id){        
        //Preparamos la consulta
		var entityType = "xmsbs_pregunta2delcaso";
		var entityId = id;
		var query = "xmsbs_name,xmsbs_pregunta1delcasoasociado,xmsbs_ultimapregunta,xmsbs_mensajedeerror,statecode,statuscode,xmsbs_tipoydetalleoperacion";
		var expand = "xmsbs_tipoydetalleoperacion($select=xmsbs_name,xmsbs_tipoydetalledeoperacionid)"
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
    },

    buscarPregunta3: function (executionContext, id){        
        //Preparamos la consulta
		var entityType = "xmsbs_pregunta3delcaso";
		var entityId = id;
		var query = "xmsbs_name,xmsbs_pregunta2delcasoasociado,xmsbs_ultimapregunta,xmsbs_mensajedeerror,statecode,statuscode,xmsbs_tipoydetalleoperacion";
		var expand = "xmsbs_tipoydetalleoperacion($select=xmsbs_name,xmsbs_tipoydetalledeoperacionid)"
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
    },

    buscarPregunta4: function (executionContext, id){        
        //Preparamos la consulta
		var entityType = "xmsbs_pregunta4delcaso";
		var entityId = id;
		var query = "xmsbs_name,xmsbs_pregunta3delcasoasociado,xmsbs_ultimapregunta,xmsbs_mensajedeerror,statecode,statuscode,xmsbs_tipoydetalleoperacion";
		var expand = "xmsbs_tipoydetalleoperacion($select=xmsbs_name,xmsbs_tipoydetalledeoperacionid)"
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
    },

    buscarPregunta5: function (executionContext, id){        
        //Preparamos la consulta
		var entityType = "xmsbs_pregunta5delcaso";
		var entityId = id;
		var query = "xmsbs_name,xmsbs_pregunta4delcasoasociado,xmsbs_ultimapregunta,xmsbs_mensajedeerror,statecode,statuscode,xmsbs_tipoydetalleoperacion";
		var expand = "xmsbs_tipoydetalleoperacion($select=xmsbs_name,xmsbs_tipoydetalledeoperacionid)"
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
    },

    buscarPregunta6: function (executionContext, id){        
        //Preparamos la consulta
		var entityType = "xmsbs_pregunta6delcaso";
		var entityId = id;
		var query = "xmsbs_name,xmsbs_pregunta5delcasoasociado,xmsbs_ultimapregunta,xmsbs_mensajedeerror,statecode,statuscode,xmsbs_tipoydetalleoperacion";
		var expand = "xmsbs_tipoydetalleoperacion($select=xmsbs_name,xmsbs_tipoydetalledeoperacionid)"
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
    },
	
    buscarApiKey: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + CasoIngresoCRM.ApiKey.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
    buscarAzureURL: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + CasoIngresoCRM.URL.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
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
		var query = "xmsbs_productodeservicio,xmsbs_tiporequerimiento,xmsbs_TipodeOperacion,xmsbs_detalledeoperacion";
		var expand = "xmsbs_productodeservicio($select=xmsbs_name,xmsbs_productoservicioid),xmsbs_tiporequerimiento($select=xmsbs_name,xmsbs_codigo,xmsbs_tiporequerimientoid),xmsbs_TipodeOperacion($select=xmsbs_name,xmsbs_codigo,xmsbs_tipooperacionid),xmsbs_detalledeoperacion($select=xmsbs_name,xmsbs_codigo,xmsbs_detalleoperacionid)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
	},
	
	oDataResponsableURCC: function (executionContext, systemuserid){
		var entityType = "xmsbs_unidadresolutora";
		var query = "$select=xmsbs_unidadresolutoraid";
		query += "&$filter=(statecode eq 0 and _xmsbs_responsable_value eq  '" + systemuserid.replace(/[{}]/g, "") + "'" +
					"and (xmsbs_codigo eq 'CC-CA' or " + 
						 "xmsbs_codigo eq 'CC-PE' or " +
						 "xmsbs_codigo eq 'UR-067' or " +
						 "xmsbs_codigo eq 'UR-069' or " +
						 "xmsbs_codigo eq 'UR-235' or " +
						 "xmsbs_codigo eq 'UR-236' or " +
						 "xmsbs_codigo eq 'UR-237' or " +
						 "xmsbs_codigo eq 'UR-238' or " +
						 "xmsbs_codigo eq 'UR-241' or " +
						 "xmsbs_codigo eq 'UR-247'))";
		query += "&$top=1";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () {});
		return resultado;
	},

    oDataIntegranteURActivo: function (executionContext, systemuserid){
		var entityType = "xmsbs_integranteur";
		var query = "$select=xmsbs_integranteurid";
        query += "&$expand=xmsbs_unidadResolutora($select=xmsbs_codigo)";
		query += "&$filter=(_xmsbs_usuario_value eq '" + systemuserid.replace(/[{}]/g, "") + "' " + 
                " and statecode eq 0) and (xmsbs_unidadResolutora/_xmsbs_institucion_value eq '599e075f-5f15-eb11-a813-000d3a3b3f7c' and xmsbs_unidadResolutora/statecode eq 0)";
		query += "&$top=1";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () {});
		return resultado;
    },

    oDataIntegranteUR: function (executionContext, systemuserid){
		var entityType = "xmsbs_integranteur";
		var query = "$select=xmsbs_integranteurid";
        query += "&$expand=xmsbs_unidadResolutora($select=xmsbs_codigo)";
		query += "&$filter=(_xmsbs_usuario_value eq '" + systemuserid.replace(/[{}]/g, "") + "') " + 
                " and (xmsbs_unidadResolutora/_xmsbs_institucion_value eq '599e075f-5f15-eb11-a813-000d3a3b3f7c' and xmsbs_unidadResolutora/statecode eq 0)";
		query += "&$top=1";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () {});
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

    datosOrdenEtapa: function (executionContext, etapaID)
    {
        //Preparamos la consulta
        var entityType = "xmsbs_etapas";
        var entityId = etapaID.replace(/[{}]/g, "");
        var query = "xmsbs_etapaid,xmsbs_orden";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
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
    
    oDataCamposSecciones: function (executionContext, etapaId){
        var entityType = "xmsbs_campo";
		var query = "$select=xmsbs_campoid,xmsbs_visible,xmsbs_tipocampo,xmsbs_requerido,xmsbs_predeterminado,xmsbs_nombremostrar,xmsbs_nombreesquema,xmsbs_name,xmsbs_lectura,xmsbs_label,xmsbs_borrar,xmsbs_valoreseningresoformunico";
		query += "&$filter=statecode eq 0 and _xmsbs_etapa_value eq '" + etapaId + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },
    
    ValidaDocumentoPendiente: function (executionContext){
		//debugger;
        // 2024.07.08 - Esta funcionalidad se aborda mediante pluggin: DocumentoCasoUpdStatusIncident
		return;
        
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
		
		// Valida que el formulario esté en modo Edición
		if (tipoFormulario != JumpStartLibXRM.FormState.UPDATE)
			return;
		
		// Valida si existen documentos pendientes en el caso.
		// si no existen, entonces cambia el estado del caso a: En Ingreso  
		
			// 27.05.2024 (JM): Se solicita que esta validación aplique en cualquier etapa, entonces al actualizar el estado aplicará de la siguiente forma:
			// Si es Etapa 01: "En Ingreso", 
			// Si es otra Etapa: "En Gestión".

			// PENDIENTE: Esta solución no es completa, porque no considera el estado que tenía el caso antes de ser modificado a "en espera de documentos", y asume que el estado anterior era "En Gestión" (pudiendo ser cualquier otro).
			// La funcionalidad completa se verá más adelante.

		var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
		var StatusCode = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
		if (StatusCode != 657130002) // En espera de documentos
			return;

		// Actualmente el estado "En espera de documentos" solo puede estar en la etapa01, por lo tanto, no se valida la etapa.
		// 27.05.2024 (JM): Ahora puede ser en cualquier etapa.
		
		var EtapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
		var oEtapa = CasoIngresoCRM.datosOrdenEtapa(executionContext, EtapaID);
				
		if(oEtapa == null || oEtapa.xmsbs_orden == null)
			return; // error
		
		var orden = oEtapa.xmsbs_orden;
		if(orden == 1){
			var IngresoUnicoFinalizado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_ingresounicofinalizado", null);
			if (IngresoUnicoFinalizado == null || IngresoUnicoFinalizado == 0)
				return;
			
			var CasoReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
			if (CasoReiterado == null || CasoReiterado == 1)
				return;
			
			var entityType = "xmsbs_documento";
			var query = "$select=xmsbs_id";
			query += "&$filter=_xmsbs_caso_value eq '" + incidentId + "' and xmsbs_obligatoriedad eq true and statuscode eq 657130000&$top=1";
			var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () {});
			if(resultado){
				if(resultado.value.length == 0){
					// cambia el estado a En Ingreso
					JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", 1); // En Ingreso
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_etapareinsistencia", true); // Gatilla actualización SLA
					JumpStartLibXRM.Fx.formSave(executionContext);
				}
			}
		}
		else{
			var entityType = "xmsbs_documento";
			var query = "$select=xmsbs_id";
			query += "&$filter=_xmsbs_caso_value eq '" + incidentId + "' and xmsbs_obligatoriedad eq true and statuscode eq 657130000&$top=1";
			var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () {});
			if(resultado){
				if(resultado.value.length == 0){
					// cambia el estado a En Gestión
					JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", 2); // En Gestión
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_etapareinsistencia", true); // Gatilla actualización SLA
					JumpStartLibXRM.Fx.formSave(executionContext);
				}
			}
		}
    },
    
    oDataCasoDuplicado: function (executionContext){
        var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
		var tiporequerimiento = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tipoderequerimiento");  // debe ser sin llaves
		var producto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto"); 
		var tipooperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tipodeoperacion"); 
		var detalleoperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion"); 
		var MesesAtras = 3;

        if (rut == null || tiporequerimiento == false || producto == false || tipooperacion == false || detalleoperacion == false)
            return false;

        var entityType = "incident";
		var query = "$select=xmsbs_numerocorrelativo,incidentid";
		query += "&$filter=(xmsbs_rut eq '" + rut + "' and _xmsbs_tipoderequerimiento_value eq " + tiporequerimiento.replace(/[{}]/g, "") + 
            " and _xmsbs_producto_value eq " + producto.replace(/[{}]/g, "") + 
            " and _xmsbs_tipodeoperacion_value eq " + tipooperacion.replace(/[{}]/g, "") + 
            " and _xmsbs_detalledeoperacion_value eq " + detalleoperacion.replace(/[{}]/g, "") + 
            " and xmsbs_ingresounicofinalizado eq true and Microsoft.Dynamics.CRM.LastXMonths(PropertyName='createdon',PropertyValue=" + MesesAtras + "))&$top=1";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function (){});
        if(resultado){
            if(resultado.value.length > 0){
                return true;
            }
        }        
        
        return false;
    },   
    
    MostraroDataCamposSecciones: function (executionContext, etapaId){
        var respuesta = new Array();
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_campo", "?$select=xmsbs_borrar,xmsbs_campoid,xmsbs_label,xmsbs_lectura,xmsbs_name,xmsbs_nombreesquema," +
																	"xmsbs_nombremostrar,xmsbs_predeterminado,xmsbs_requerido,xmsbs_tipocampo,xmsbs_visible," +
																	"xmsbs_integracion,xmsbs_fncjsonchange,xmsbs_valoreseningresoformunico," +
																	"xmsbs_campocalidadparticipacion,xmsbs_campoglosasubproducto,xmsbs_ocultarenestadocreate,xmsbs_visibilidadpicklist2g," +
																	"xmsbs_mayoroigualque,xmsbs_menoroigualque," +
																	"xmsbs_filtrovisibilidad,xmsbs_condicion,xmsbs_camposecundario,xmsbs_visiblecamposec,xmsbs_requeridocamposec" +
																    "&$filter=(statecode eq 0 and _xmsbs_etapa_value eq '" + etapaId.replace(/[{}]/g, "") +"')").then(
            function success(results) { 
				//debugger;
				var ArrCampos = [];
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
                    respObj.xmsbs_integracion = results.entities[i]["xmsbs_integracion"];
                    respObj.xmsbs_fncjsonchange = results.entities[i]["xmsbs_fncjsonchange"];
                    respObj.xmsbs_valoreseningresoformunico = results.entities[i]["xmsbs_valoreseningresoformunico"];
					respObj.xmsbs_campocalidadparticipacion = results.entities[i]["xmsbs_campocalidadparticipacion"];
					respObj.xmsbs_campoglosasubproducto = results.entities[i]["xmsbs_campoglosasubproducto"];
                    respObj.xmsbs_ocultarenestadocreate = results.entities[i]["xmsbs_ocultarenestadocreate"];
					respObj.xmsbs_visibilidadpicklist2g = results.entities[i]["xmsbs_visibilidadpicklist2g"];
					
					respObj.xmsbs_mayoroigualque = results.entities[i]["xmsbs_mayoroigualque"];
					respObj.xmsbs_menoroigualque = results.entities[i]["xmsbs_menoroigualque"];
					
					respObj.xmsbs_filtrovisibilidad = results.entities[i]["xmsbs_filtrovisibilidad"];
					respObj.xmsbs_condicion = results.entities[i]["xmsbs_condicion"];
					respObj.xmsbs_camposecundario = results.entities[i]["xmsbs_camposecundario"];
					respObj.xmsbs_visiblecamposec = results.entities[i]["xmsbs_visiblecamposec"];
					respObj.xmsbs_requeridocamposec = results.entities[i]["xmsbs_requeridocamposec"];
					
                    respuesta.push(respObj);
					
					ArrCampos.push(respObj.xmsbs_nombreesquema);
                }

				CasoIngresoCRM.Form.VisibilidadCamposSecundarios = [];
				CasoIngresoCRM.Form.VisibilidadCampos = [];
				
				//debugger;
				CasoIngresoCRM.Form.IndexBloqueadosPicklistGenerico = [];
				CasoIngresoCRM.Form.DetalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
				
                CasoIngresoCRM.MostraroDataCamposSeccionesRespuesta(executionContext, respuesta);
                
				// comprobar solo en caso de existir campos de visibilidad.
				if (CasoIngresoCRM.Form.VisibilidadCamposSecundarios.length > 0)
				{	
					//debugger;
					// si todo está ok, entonces aplica la visualización por default para todos los campos que tienen visualización secundaria
					CasoIngresoCRM.Form.VisibilidadCampos.forEach(campo => {
						CasoIngresoCRM.fncVisibilidadCamposSecundarios(executionContext, campo);
					});
						
					// todos los campos indicados en la visibilidad de secundarios DEBEN existir en el array de campos de la Etapa.
					let CamposOK = CasoIngresoCRM.Form.VisibilidadCamposSecundarios.every(obj => ArrCampos.includes(obj.campo));
					if (!CamposOK){
						Xrm.Utility.alertDialog("Error de configuración para la visibilidad de campos secundarios.");
						throw new Error("Error de configuración para la visibilidad de campos secundarios.");	
					}
				}
				
				//Llamar las reglas de negocio
				CasoIngresoCRM.ReglasDeNegocio(executionContext); 

                CasoIngresoCRM.Form.CargaCamposDinamicosCompleta = true;
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
				var EvaluaVisibilidadSecundarios = false;
                if (respuesta[i].xmsbs_integracion != null && respuesta[i].xmsbs_integracion != undefined && respuesta[i].xmsbs_integracion != "")
                {   
                    //CasoIngresoCRM.campoIntegracion(executionContext, respuesta[i].xmsbs_nombreesquema, respuesta[i].xmsbs_integracion);
					CasoIngresoCRM.campoIntegracion(executionContext, 
								respuesta[i].xmsbs_integracion, respuesta[i].xmsbs_borrar, respuesta[i].xmsbs_label, 
								respuesta[i].xmsbs_lectura, respuesta[i].xmsbs_predeterminado, respuesta[i].xmsbs_requerido, respuesta[i].xmsbs_visible,
								respuesta[i].xmsbs_campocalidadparticipacion, respuesta[i].xmsbs_campoglosasubproducto);
                }
				else if ((respuesta[i].xmsbs_tipocampo == 2 || respuesta[i].xmsbs_tipocampo == 3) &&
                        (respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist1g" || respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist2g" ||
                         respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist3g" || respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist4g" ||
                         respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist5g" || respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist6g" ||
                         respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist7g" || 
						 respuesta[i].xmsbs_nombreesquema == "xmsbs_picklistmultiselect1g")) 
				{
					if (respuesta[i].xmsbs_visibilidadpicklist2g != null){
						CasoIngresoCRM.Form.Visibilidadpicklist2g = respuesta[i].xmsbs_visibilidadpicklist2g;
					}
					
					// se reutiliza el campo: xmsbs_valoreseningresoformunico para almacenar las opciones del Picklist
					CasoIngresoCRM.PicklistGenerico(executionContext, respuesta[i].xmsbs_nombreesquema, respuesta[i].xmsbs_valoreseningresoformunico, respuesta[i].xmsbs_borrar, respuesta[i].xmsbs_label, respuesta[i].xmsbs_lectura, respuesta[i].xmsbs_predeterminado, respuesta[i].xmsbs_requerido, respuesta[i].xmsbs_visible);
					EvaluaVisibilidadSecundarios = true;
					
					
					// FRAUDE: En esta sección se agrega una función en duro, aplica solo para los campos: "Análisis de Fraude" y "Categoría del Reclamo" de las tipologías: DO-1472 DO-1473 DO-1474
					// DO-1472: ac823ec0-e919-ef11-9f89-000d3ad8d133
					// DO-1473: f33f8ce8-ea19-ef11-9f89-000d3ad8d133
					// DO-1474: 08570bff-eb19-ef11-9f89-000d3ad8d133
					
					// Consiste en bloquear la selección del valor "Estafa"
					// esta bloqueo debe estar vigente hasta que del Banco indiquen lo contrario
					if (respuesta[i].xmsbs_lectura == false){
						if (CasoIngresoCRM.Form.DetalleOperacionID.toLowerCase() == '{ac823ec0-e919-ef11-9f89-000d3ad8d133}' ||
							CasoIngresoCRM.Form.DetalleOperacionID.toLowerCase() == '{f33f8ce8-ea19-ef11-9f89-000d3ad8d133}' ||
							CasoIngresoCRM.Form.DetalleOperacionID.toLowerCase() == '{08570bff-eb19-ef11-9f89-000d3ad8d133}')
						{
							// FS919 FS920 : "Categoría del Reclamo" = xmsbs_picklist2g ; 1,Fraude;2,Estafa;3,No Fraude
							// FS919 : "Análisis de Fraude" = xmsbs_picklist3g ; Autofraude;Negligente;Estafa;Fraude;Otro;Reiterativo;Cliente Desiste;Robo sin aviso oportuno
							// FS920 : "Análisis de Fraude" = xmsbs_picklist7g ; Autofraude;Negligente;Estafa;Fraude;Otro;Reiterativo;Cliente Desiste;Robo sin aviso oportuno
									
							if (respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist2g"){
								CasoIngresoCRM.Form.IndexBloqueadosPicklistGenerico.push({ campo: respuesta[i].xmsbs_nombreesquema, IndexBloqueado: 2 });
							}
							else if (respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist3g" || respuesta[i].xmsbs_nombreesquema == "xmsbs_picklist7g"){
								CasoIngresoCRM.Form.IndexBloqueadosPicklistGenerico.push({ campo: respuesta[i].xmsbs_nombreesquema, IndexBloqueado: 3 });
							}
						}						
					}
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
                                JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, respuesta[i].xmsbs_predeterminado);
                                break;
                            case 2:
                                var valorInt = parseInt(respuesta[i].xmsbs_predeterminado);
                                JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, valorInt);
                                break;
                            case 3:
                                var valorInt = parseInt(respuesta[i].xmsbs_predeterminado);
                                JumpStartLibXRM.Fx.setValueField(executionContext, respuesta[i].xmsbs_nombreesquema, valorInt);
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
                    var Ncampo = CasoIngresoCRM.terminaEnNumero(respuesta[i].xmsbs_nombreesquema);
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
                    
                    //Ocular en CREATE
                    if (respuesta[i].xmsbs_ocultarenestadocreate)
                    {
                        var formContext = executionContext.getFormContext();
                        var tipoFormulario = formContext.ui.getFormType();
                        if (tipoFormulario == JumpStartLibXRM.FormState.CREATE){
                            JumpStartLibXRM.Fx.hideField(executionContext, respuesta[i].xmsbs_nombreesquema);
                            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, respuesta[i].xmsbs_nombreesquema, "none");
                        }
                    }

					// Funcion al cambiar
					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChange_rut");
					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChangeSoloNumeros");
					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChange_Fecha");
					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChangeSoloLetra");
					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChange_correo");
					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChange_ValidaIntervalo");
					JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChangeSoloNumerosIntervalo");

					if (respuesta[i].xmsbs_fncjsonchange)
					{
						if(respuesta[i].xmsbs_fncjsonchange == 657130000) // Texto, valida RUT
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChange_rut");
						}
						else if(respuesta[i].xmsbs_fncjsonchange == 657130001) // Texto, solo números (0-9)
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChangeSoloNumeros");
						}
						else if(respuesta[i].xmsbs_fncjsonchange == 657130002) // Fecha, el o antes de hoy
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChange_Fecha");
						}
						else if(respuesta[i].xmsbs_fncjsonchange == 657130003) // Texto, solo letras y espacio
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChangeSoloLetra");
						}
						else if(respuesta[i].xmsbs_fncjsonchange == 657130004) // Texto, valida email
						{
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChange_correo");
						}
						else if(respuesta[i].xmsbs_fncjsonchange == 657130006) // Número Entero, Intervalo
						{
							//debugger;
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChange_ValidaIntervalo");

							var ParametrosValidacion = { campo: respuesta[i].xmsbs_nombreesquema, MayorOIgualQue: respuesta[i].xmsbs_mayoroigualque, MenorOIgualQue: respuesta[i].xmsbs_menoroigualque };
							CasoIngresoCRM.Form.ValidacionGenerica_Parametros.push(ParametrosValidacion);							
						}
						else if(respuesta[i].xmsbs_fncjsonchange == 657130008) // Texto, solo números (0-9) + Intervalo
						{
							//debugger;
							JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChangeSoloNumerosIntervalo");

							var ParametrosValidacion = { campo: respuesta[i].xmsbs_nombreesquema, MayorOIgualQue: respuesta[i].xmsbs_mayoroigualque, MenorOIgualQue: respuesta[i].xmsbs_menoroigualque };
							CasoIngresoCRM.Form.ValidacionGenerica_Parametros.push(ParametrosValidacion);							
						}
						
						// para "Picklist, Según P1 muestra P2", no va en esta sección, ya que los campos PicklistGenericos ya tienen su propio onchange (onChangePicklistGenerico)
                    }
					
					EvaluaVisibilidadSecundarios = true;
                }
				
				if (EvaluaVisibilidadSecundarios){
					//debugger;
					// Agrega valores de visibilidad / requerido para campos secundarios.
					if (respuesta[i].xmsbs_camposecundario)
					{
						JumpStartLibXRM.Fx.removeOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChange_VisibilidadCampoSecundario");

						let campos = respuesta[i].xmsbs_camposecundario; // pueden varios campos, separados por punto y coma.
						let filtro = respuesta[i].xmsbs_filtrovisibilidad;
						let valor = respuesta[i].xmsbs_condicion;
						let visible = respuesta[i].xmsbs_visiblecamposec;
						let requerido = respuesta[i].xmsbs_requeridocamposec;
						
						let ArrCampos = campos.split(";");
						
						ArrCampos.forEach(campo => {
							CasoIngresoCRM.Form.VisibilidadCamposSecundarios.push({
								campoPrincipal: respuesta[i].xmsbs_nombreesquema,
								filtro: filtro,
								valor: valor, 
								campo: campo,
								visible: visible, 
								requerido: requerido
							});
						});
						
						JumpStartLibXRM.Fx.addOnChange(executionContext, respuesta[i].xmsbs_nombreesquema, "CasoIngresoCRM.onChange_VisibilidadCampoSecundario");
						
						CasoIngresoCRM.Form.VisibilidadCampos.push(respuesta[i].xmsbs_nombreesquema);
						
						// luego de que termina de cargar todos los campos, se llama a la función: onChange_VisibilidadCampoSecundario para que aplique la configuración en caso de que el campo principal ya tenga valor.
						// (no aplica aqui)
					}
				}
            }                     
        }
        else
        {
            //alert("Error en el consumo del servicio rest api.");
        }
    },
	
	onChange_VisibilidadCampoSecundario: function (executionContext){
		//debugger;
		var ControlOnChange = executionContext.getEventSource().getName();
		
		CasoIngresoCRM.fncVisibilidadCamposSecundarios(executionContext, ControlOnChange);
	},
	
	fncVisibilidadCamposSecundarios: function (executionContext, campoName){
		
        var formContext = executionContext.getFormContext();
		var tipoFormulario = formContext.ui.getFormType();
		var FrmLectura = false;
		
		var isDisabled = JumpStartLibXRM.Fx.getDisabled(executionContext, campoName);
		
		if (tipoFormulario == JumpStartLibXRM.FormState.READ_ONLY || tipoFormulario == JumpStartLibXRM.FormState.DISABLED || isDisabled)
			FrmLectura = true;
					
		CasoIngresoCRM.Form.VisibilidadCamposSecundarios.forEach(obj => {
			if (obj.campoPrincipal == campoName){
				
				let valor = JumpStartLibXRM.Fx.getFieldValueAsText(executionContext, obj.campoPrincipal);
				let FiltroOK = false;
				
				if (obj.filtro == 657130000 && obj.valor == valor) // "es igual a"
					FiltroOK = true;
				else if (obj.filtro == 657130001 && obj.valor != valor) // "No es igual a"
					FiltroOK = true;				
				else if (obj.filtro == 657130002 && obj.valor != "") // "Contiene datos"
					FiltroOK = true;
				else if (obj.filtro == 657130003 && obj.valor == "") // "No contiene datos"
					FiltroOK = true;
				
				
				var campo = obj.campo;
				
				// a este punto los campos ya se dibujaron en el form.
				// si es picklist genérico, entonces evalúa si el campo está visible en el formulario, 
				// si está visible trabaja sobre el campo picklist, si está oculto, entonces trabaja sobre el campo picklist_texto
				if (campo == "xmsbs_picklist1g" || campo == "xmsbs_picklist2g" || campo == "xmsbs_picklist3g" || campo == "xmsbs_picklist4g" || campo == "xmsbs_picklist5g" || campo == "xmsbs_picklist6g" || campo == "xmsbs_picklist7g" ||  campo == "xmsbs_picklistmultiselect1g")
				{
					debugger;
					var esVisiblePicklist = JumpStartLibXRM.Fx.getVisible(executionContext, campo);	
					//var lbl = JumpStartLibXRM.Fx.getControlName(executionContext, campo);
					
					if (esVisiblePicklist == false)
					{
						campo = campo + "_texto";
						JumpStartLibXRM.Fx.disableField(executionContext, campo);
						//JumpStartLibXRM.Fx.setLabel(executionContext, campo, lbl);
					}
				}
				
				// por defecto será oculto y no requerido.
				JumpStartLibXRM.Fx.hideField(executionContext, campo);
				JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, campo, "none");
				
				if (FiltroOK){
					if (obj.visible == true)
						JumpStartLibXRM.Fx.showField(executionContext, campo);
					
					if (!FrmLectura) // solo evalúa y setea requerido si el form es de escritura.
					{
						// no puede ser requerido si el campo en la matriz para esta etapa es de solo lectura, sin embargo, se deja la responsabilidad de integridad de datos a la administración de la matriz.
						if (obj.requerido == true){
							JumpStartLibXRM.Fx.enableField(executionContext, campo);
							JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, campo, "required");						
						}
					}
				}
			}
		});		
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
        var respuestaSecciones = new Array();
        Xrm.WebApi.online.retrieveMultipleRecords("xmsbs_seccion", "?$select=_xmsbs_etapa_value,xmsbs_etiqueta,xmsbs_lectura,xmsbs_name,xmsbs_tab,xmsbs_visible&$filter=statecode eq 0 and _xmsbs_etapa_value eq '" +  etapaId.replace(/[{}]/g, "") + "'").then(
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
                CasoIngresoCRM.MostraroDataSeccionesRespuesta(executionContext, respuestaSecciones);
            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        ); 
    },

    MostraroDataSeccionesRespuesta: function (executionContext, responseSeccion){   
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
		var entityId = detalleOperacionID.replace(/[{}]/g, "");
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
		var query = "xmsbs_name,xmsbs_codigo,xmsbs_tiporeclamo,xmsbs_quebranto,xmsbs_tooltips,xmsbs_habilitarbotonmovimientoscasos,xmsbs_quebrantogsc,xmsbs_interesadopolizas,xmsbs_usaselecciondesucursal";
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
    
    MostrarDatosEtapa: function (executionContext, etapaId){    
        Xrm.WebApi.online.retrieveRecord("xmsbs_etapa", etapaId.replace(/[{}]/g, ""), "?$select=xmsbs_orden").then(
            function success(result) {               
                var xmsbs_orden = result["xmsbs_orden"];
                var xmsbs_orden_formatted = result["xmsbs_orden@OData.Community.Display.V1.FormattedValue"];
				var StatusCode = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
				
				// estos campos están habilitados por defecto
                if(xmsbs_orden > 1)
                {
                    //Si no es Etapa 1, entonces bloqueo los campos 
					JumpStartLibXRM.Fx.disableField(executionContext, "description2");
					JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_solucionesperada2");
					
					JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_emailcliente2");
					JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_telefonocelular2");
					JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_preferenciasdecontacto2");
                }
				else
				{
					// Si es Etapa 1, pero el estado no es "Ingreso" ni "En Gestión", bloquea los campos.
					if (StatusCode != 1 && StatusCode != 2 && StatusCode != 657130002)
					{
						JumpStartLibXRM.Fx.disableField(executionContext, "description2");
						JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_solucionesperada2");
						
						JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_emailcliente2");
						JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_telefonocelular2");
						JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_preferenciasdecontacto2");						
					}
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
	
    datosUsuario: function (executionContext, usuarioId){
		//_xmsbs_institucion_value
		//Preparamos la consulta
		var entityType = "systemuser";
		var entityId = usuarioId;
		{
			entityId = usuarioId.substring(1, 37);
		}
		var query = "xmsbs_institucion,xmsbs_atiendereclamotipo";
		var expand = "xmsbs_institucion($select=xmsbs_name,xmsbs_institucionid)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
	},	
    
    buscarBitacoraEtapa: function (executionContext, incidentId){
        var entityType = "xmsbs_bitacoraetapa";
		var query = "$select=xmsbs_bitacoraetapaid,xmsbs_name,xmsbs_caso&$orderby=createdon desc";
		query += "&$filter=_xmsbs_caso_value eq '" + incidentId + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },	
    
    buscarDocumentosCaso: function (executionContext, idIncident){
        var entityType = "xmsbs_documento";
        var query = "$select=xmsbs_documentoid,xmsbs_obligatoriedad,xmsbs_id,xmsbs_name,xmsbs_caso";
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
    
    buscarCasosClienteUR: function (executionContext,idCliente, idUR){
        var entityType = "incident";
        var query = "$select=ticketnumber,ownerid,statecode,statuscode,createdon,title,_xmsbs_cliente_value,xmsbs_rut,xmsbs_numerocorrelativo,_xmsbs_ur_value,_xmsbs_producto_value,_xmsbs_tipodeoperacion_value,_xmsbs_detalledeoperacion_value,_xmsbs_detalledetipologia_value,_xmsbs_tipoderequerimiento_value&$orderby=createdon desc";
        query += "&$filter=xmsbs_ingresounicofinalizado eq true and _xmsbs_cliente_value eq '" + idCliente + "' and _xmsbs_ur_value eq '" + idUR + "'";
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
    
    buscarUsuarioAdministrador: function (executionContext){
        var entityType = "systemuser";
        var query = "$select=fullname";
        query += "&$filter=fullname eq '" + CasoIngresoCRM.Usuario.Administrador + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarDatosQuebranto: function (executionContext, idQuebranto){
        //Preparamos la consulta
        var entityType = "xmsbs_reversocastigos";
        var entityId = idQuebranto;
        var query = "statuscode";
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
	
    buscarCampoSucursal: function (executionContext, idFlujo){
        //Preparamos la consulta
        var entityType = "xmsbs_campos";
		var strselect = "$select=xmsbs_campoid,xmsbs_name&";
		var strexpand = "$expand=xmsbs_etapa&";
		var strfilter = "$filter=(xmsbs_name eq 'xmsbs_sucursales') and (xmsbs_etapa/_xmsbs_flujosantander_value eq " + idFlujo.replace(/[{}]/g, "") + " and contains(xmsbs_etapa%2fxmsbs_codigo, '%25ETA001%25'))&";
		var strorderby = "$orderby=xmsbs_name asc&";
		var strTop = "$top=1";

		var query = strselect + strexpand + strfilter + strorderby + strTop;

        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () {});
        return resultado;
    },	
    
    crearAccionEjecutada: function (executionContext, modelo){
        var bitacoraEtapaId = null;
        var accionEtapaId = null;
        var incidentId = modelo.casoId;
        
        if (incidentId.indexOf("{") > -1)
        {
            incidentId = incidentId.substring(1, 37);
        }
        
        var bitacoraEtapa = CasoIngresoCRM.buscarBitacoraEtapa(executionContext, incidentId);
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
        var documentosCaso = CasoIngresoCRM.buscarDocumentosCaso(executionContext, idIncident)
        if (!documentosCaso || documentosCasoIngresoCRM.value.length === 0) {
            var ObjReturn = {}
            ObjReturn['success'] = true;
            ObjReturn['message'] = 'Ok';

            return ObjReturn;
        }
        else {
            var ObjReturn = {}
            var documentosObligatorios = 0;
            for (var i = 0; i < documentosCasoIngresoCRM.value.length; i++) {
               if(documentosCasoIngresoCRM.value[i].xmsbs_obligatoriedad && documentosCasoIngresoCRM.value[i].xmsbs_id == null){
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
	
    onChange_resolucionanalisis: function (executionContext) {
		var resolucion = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_resolucionanalisis", null);
        var obsSub = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_observacionessubrequerimientos", null);
        if(obsSub && resolucion){
			var alertStrings = { confirmButtonLabel: "Aceptar", text: "Debe volver a ingresar la Respuesta para el Subrequerimiento", title: "Cambio de Resolución de Analisis" };
			var alertOptions = { height: 120, width: 260 };
			Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
				function (success) {
					JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_observacionessubrequerimientos", null);
					JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_observacionessubrequerimientos");
				},
				function (error) {
					//console.log(error.message);
				}
			);
        }
    },	
	
    onChange_resoluciondemanda: function (executionContext) {
		var resolucion = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_resoluciondemanda", null);
        var obsSub = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_observacionessubrequerimientos", null);
        if(obsSub && resolucion){
			var alertStrings = { confirmButtonLabel: "Aceptar", text: "Debe volver a ingresar la Respuesta para el Subrequerimiento", title: "Cambio de Resolución de Demanda" };
			var alertOptions = { height: 120, width: 260 };
			Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
				function (success) {
					JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_observacionessubrequerimientos", null);
					JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_observacionessubrequerimientos");
				},
				function (error) {
					//console.log(error.message);
				}
			);
        }
    },		
    
    validaUltimaPreguntaEnOnLoad:function(executionContext){
        var pregunta2 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2");
        var pregunta3 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta3");
        var pregunta4 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta4");
        var pregunta5 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta5");
        var pregunta6 = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta6");

		//Se agregan los campos de "Respaldo" porque al ingresar casos por servicio quedan vacios y falla el reiterado 20250206
        var pregunta2R = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2respaldo");
        var pregunta3R = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta3respaldo");
        var pregunta4R = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta4respaldo");
        var pregunta5R = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta5respaldo");
        var pregunta6R = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta6respaldo");
        
        if(pregunta6 || pregunta6R){
            //Tiene pregunta 6, por lo que hacemos visible todas las otras preguntas y hacemos onchange_pregunta6
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta6");
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta5");
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta4");
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta3");
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta2");
            
            CasoIngresoCRM.onChange_pregunta5(executionContext);
        }
        else{
            if(pregunta5 || pregunta5R){
                //Tiene pregunta 5, por lo que hacemos visible todas las otras preguntas y hacemos onchange_pregunta5
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta5");
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta4");
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta3");
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta2");
                
                CasoIngresoCRM.onChange_pregunta4(executionContext);
            }
            else{
                if(pregunta4 || pregunta4R){
                    //Tiene pregunta 4, por lo que hacemos visible todas las otras preguntas y hacemos onchange_pregunta4
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta4");
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta3");
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta2");
                    
                    CasoIngresoCRM.onChange_pregunta3(executionContext);
                }
                else{
                    if(pregunta3 || pregunta3R){
                        //Tiene pregunta 3, por lo que hacemos visible todas las otras preguntas y hacemos onchange_pregunta3
                        JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta3");
                        JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta2");
                        
                        CasoIngresoCRM.onChange_pregunta2(executionContext);
                    }
                    else{
                        if(pregunta2 || pregunta2R){
                            //Tiene pregunta 2, por lo que hacemos visible todas las otras preguntas y hacemos onchange_pregunta2
                            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_pregunta2");
                            
                            CasoIngresoCRM.onChange_pregunta1(executionContext);
                        }
                        else{
                            CasoIngresoCRM.onChange_descripcionProblema(executionContext);
                        }
                    }
                }
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
                var url = CasoIngresoCRM.URL.Azure + "/HTML/GestionCaso/ResolverCasoIngresoCRM.html?idIncident=" + incidentId;
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
            CasoIngresoCRM.RolesArray.SystemUser.forEach(
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
            //Marco el caso como rechazado
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", 2);

            //Guardamos el cambio
            JumpStartLibXRM.Fx.formSave(executionContext);
		}		
	},		

    enableButtonAsignar: function (executionContext){	
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        var origen = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_origen", "");
        
        if(origen != "" && origen != null && origen != undefined)
        {
            origen = origen.toLowerCase();
        } 
        
		if (estado == '2' && origen != 'crm adquirencia') {   
            let array = new Array ();
            CasoIngresoCRM.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
            );
            CasoIngresoCRM.RolesArray.SantanderUrAdmin.forEach( 
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
		PopUp.openWRAsignarCaso(CasoIngresoCRM.Form.Context, CasoIngresoCRM.URL.Azure, CasoIngresoCRM.ApiKey.Key);
	},	
	
	enableButtonSLA: function (executionContext){
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '2') {   
            let array = new Array ();
            CasoIngresoCRM.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
            );
            CasoIngresoCRM.RolesArray.SantanderUrAdmin.forEach( 
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
       
        if(confirm("Va a modificar el SLA establecido en el CasoIngresoCRM. ¿Desea Continuar?")){
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
    
    cambioFormulario: function (executionContext){
        var formDestino = "";
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        
        //Obtener el formulario en el que debería estar
        if (tipoFormulario == '1'){   
            //Creación, ver cual es el form actual, y redirigir si no corresponde según: Configuración usuario
            var atiendeReclamoTipo = "";
            var IdUsuario = JumpStartLibXRM.Fx.getUserId();
            if (IdUsuario.indexOf("{") > -1){IdUsuario = IdUsuario.substring(1, 37);}
            var resultado = CasoIngresoCRM.buscarTipoReclamoUsuario(executionContext,IdUsuario);
            if(resultado){
                atiendeReclamoTipo = resultado.xmsbs_atiendereclamotipo;
                if(atiendeReclamoTipo == 657130000){
                    //Reguladores
                    formDestino = CasoIngresoCRM.Formularios.Reguladores;
                }
                else{
                    formDestino = CasoIngresoCRM.Formularios.Masivos;
                }
            }
            else{
                formDestino = CasoIngresoCRM.Formularios.Masivos;
            }
        }
        else{
            //Caso Creado, ver cual es la tipología y redirigir si no corresponde según: Tipo de Reclamo en Detalle de Operación
            var detalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
            if (detalleID.indexOf("{") > -1){detalleID = detalleID.substring(1, 37);}
            var resultado = CasoIngresoCRM.tipoReclamoDetalleOperacion(executionContext, detalleID);
            if(resultado){
                var tipoReclamo = resultado.xmsbs_tiporeclamo;
                if(tipoReclamo == 657130001){ //masivos
                    formDestino = CasoIngresoCRM.Formularios.Masivos;
                }
                else{
                    if(tipoReclamo == 657130000){ //formales
                        formDestino = CasoIngresoCRM.Formularios.Reguladores;
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
        
        //Stage 1 - Input Parameter For Action
        var parameters = {
            incidentId: formContext.data.entity.getId().replace(/[{}]/g, "")
        };
        try {           
    //		//Stage 2 - Data Intialization Parameter For Action
                var actionData =  CasoIngresoCRM.actionProcessingMethod (parameters.incidentId);
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
		
	limpiarDatosNecesarios: function(executionContext){
		// al limpiar cada nivel es necesario resetear el TD previamente seleccionado (si existe)
		CasoIngresoCRM.tipoDetalleOperacion.id = "";
		CasoIngresoCRM.tipoDetalleOperacion.nombre = "";
		
        var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
        
        if(!marcaReiterado){
            var section = Xrm.Page.ui.tabs.get("general").sections.get("Details");
            var controls = section.controls.get();
            var controlsLenght = controls.length;

            for (var i = 0; i < controlsLenght; i++) {
                if(!controls[i]._controlName.toLowerCase().includes("webresource"))
                {
                    controls[i].getAttribute().setValue(null);
                }
            }
        }	
	},
    
    validaTipificacionesContact: function(executionContext, tipoDetalleOperacionId){
        if(true){
            //Forma nueva de bloqueo de ingreso por canal de ingreso
            //Primero, vamos a ver si el tipo y detalle de operación tiene registros en la entidad de bloqueos por canal de ingreso
            var resultado = CasoIngresoCRM.datosBloqueoTipificacionPorCanal(executionContext, tipoDetalleOperacionId);
            if(!resultado){
				//No trajo nada, por lo que puede retornar true y que continúe
				return true;
            }
			
			//Si trajo resultado, vemos el largo.
			if(resultado.value.length == 0){
				//No trajo nada, por lo que puede retornar true y que continúe
                return true;				
			}
                
			//Si trajo algo concreto, ahora hacemos la misma pregunta pero para el punto de contacto ingresado que siempre debería existir
			var canalDeIngreso = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_puntodecontacto", "");                
                
			if(canalDeIngreso == null || canalDeIngreso == ""){
				//No encontró Canal de Ingreso. Bloquea
				return false;
			}
				
			// Si hay canal de ingreso, ahora buscamos un registro con ese dato. 
			var resultado = CasoIngresoCRM.datosBloqueoTipificacionPorCanalConCanalIngresado(executionContext, tipoDetalleOperacionId, canalDeIngreso.replace(/[{}]/g, ""));
			if(!resultado){
				//No trajo nada, por lo que puede retornar true y que continúe
				return true;				
			}
			
			if(resultado.value.length == 0){
				//No trajo nada, por lo que puede retornar true y que continúe
				return true;			
			}
			
			//Encontró algo, asi que devuelve false
			return false;
        }
        else{
            //Forma antigua de bloqueo de ingreso por canal de ingreso
            var respuesta = CasoIngresoCRM.datosTipoDetalleOp(executionContext, tipoDetalleOperacionId);
            if(respuesta){
                var tipoOperacionCodigo = respuesta.xmsbs_TipodeOperacion.xmsbs_codigo;
                if(tipoOperacionCodigo == "TO-1045" || tipoOperacionCodigo == "TO-1138" || tipoOperacionCodigo == "TO-1127"){
                    //Es de alguna de esas 10 tipificaciones para el contact. Validar el punto de contacto
                    var canalDeIngreso = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_puntodecontacto", "");
                    if(canalDeIngreso != null && canalDeIngreso != ""){
                        if(canalDeIngreso.toLowerCase() == "sucursal" || (tipoOperacionCodigo == "TO-1127" && canalDeIngreso.toLowerCase() == "contact center")){
                            //Para sucursal no debe permitir. Bloquea
                            return false;
                        }
                        else{
                            //No es sucursal. Permite
                            return true;
                        }
                    }
                    else{
                        //No encontró Canal de Ingreso. Bloquea
                        return false;
                    }
                }
                else{
                    return true;
                }
            }
            else{
                return true;
            }
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

parent.getExecutionContext = function (){
	return CasoIngresoCRM.Form.executionContext;
};
parent.getExecutionFormContext = function (){
	return CasoIngresoCRM.Form.formContext;
};