if (typeof (BotonRibbonCaso) == "undefined")
{
	BotonRibbonCaso = {
		__namespace: true
	};
}

BotonRibbonCaso = {
    URL: {        
        Azure: "",
        Name: "AzureURL"
    },
	
	ApiKey: {
        Key: "",
        Name: "AuthApi"
    },
    
    Usuario: {
        Administrador: "Dynamics_CRM_MIDAS_CL_DEV"
    },    
    
    VisibilidadBotonCreacion: {
        ValorVisibilidad: false
    },
    
    VisibilidadBotonAutoAsignacion: {
        ValorVisibilidad: false
    },
    
//    VisibilidadBotonCrearMovimientoCaso: {
//        ValorVisibilidad: false
//    },    

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

    PopUp: 0,

    Context: {
		ExecutionContext: null,
		FormContext: null
	},
    
    Package: {
        Data: null,
		Contenido: null,
		CasoId: null,
        AccionEtapaId: null,
        CodigoSuceso: "",
        CanWrite: false,
        UsuarioId: null,
        ExecutionContext: null,
		UsuarioAdminID: "d43af6f7-e875-eb11-a812-000d3ab23035" // (DESA) Dynamics_CRM_MIDAS_CL_DEV
		//UsuarioAdminID: "a533cb3f-6583-eb11-a812-000d3abd3579" // (HOMO y PROD) Dynamics_CRM_MIDAS_CL_DEV
	},    
    
    //================
    //ROLES
    //================
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
                                         "Af107960-42f2-4a28-bb96-044e1892fdff"],
        JefeCanales: [
                        "002bb930-10aa-ec11-983f-000d3add0341",
                        "7451efdf-26c4-459d-8330-194ff1ba9dd0",  
                        "9d6955c6-2e9d-45d8-8449-4bb330939914", 
                        "92f7928b-227b-4941-a66d-91afaf0b80dd", 
                        "7385b6f0-4716-421d-857d-c944766f2407",
                        "76681708-055A-4DB1-8D7A-EB0E16BE54BD",
                        "B88AEDD3-D0A8-46E5-B91B-CD33771185FE",
                        "0660381C-0D23-4F00-AB8E-273FA3013612",
                        "03AD010A-68F0-EB11-BACB-000D3AB3CEF2",
                        "F52E635E-D09E-469C-A1AE-E0DBDA2FDDDC",
                        "e23d1bb1-7097-4847-943a-d65870f64cdd",
                        "75216f79-7c1b-4a1c-b4e4-f2f8f425847b"
        ],
		
		// [Adquirencia] - Cancelar caso
		// DESA
		AdqCancelarCaso:["e06d2739-5553-ef11-bfe3-000d3a67b0a6","62adaa6a-20d4-41b6-811a-419757b34500","5d15049f-0d68-45ab-ab7d-462d457e3e11","210373d6-5e11-45fc-9f6f-4ed50c1d61c3","deecc4f6-177b-41e8-8fae-529871e88a58","b9e14494-7fbf-46fe-9943-8a8c3db6f37d","1bcd2a66-4c95-4489-bb7f-e3274b0d2a48"]
		// HOMO
		//AdqCancelarCaso:["e06d2739-5553-ef11-bfe3-000d3a67b0a6","a6ef5075-1689-4bbc-b54a-0e68a4d3c3a1","d6862232-b890-4d17-bf04-18825df29d9a","ecda4af5-67ad-4395-84b7-29a5ee93f233","fcecc59e-f900-4638-8d6e-6630c2d5d6b5","54b5bec0-5aa6-4ecb-bde3-6d85b6a02a13","5aeba639-9ef5-46be-911b-6ed51dfa5344","e1975f1a-06b5-4967-8d54-6fcbcf87c606","54984caa-c70d-46f4-9a8b-712a0da5ad89","49e09eb5-3be8-401e-b829-71835e16142f","2fe28730-49f2-43a6-baae-87352c25c97e","20a55127-17db-49f6-9230-8c1a4600d7b4","6251a345-8f49-4075-bb69-985270f5d7eb","47a2451e-5232-471d-8eba-bb703c0d9cb6","7da4721c-d819-427c-ad79-c9eb6ce5f146","8a277a94-fb20-4c89-ab27-d548b2313c62","a90cd77a-75e7-4d20-90c1-d7d75d27fe54","ffc71fc2-ad71-4991-86b7-e11c92a200c1"]
		// PROD
		//AdqCancelarCaso:["e06d2739-5553-ef11-bfe3-000d3a67b0a6","e7db6a03-d3f3-4521-b3b1-00cb77504585","f6b1488a-9547-4a21-861c-1123ef294e8a","fd18a8b0-4ee8-46b8-bde6-2a075515e69d","6d19ada3-e107-4227-bca7-3f0370040c05","6438bf7c-958e-4881-8755-59c834bcfac1","8fc35172-3f5e-4ad3-a969-5ca81e9124c1","17245298-cbb5-4f27-9fa8-8b306bd1e821","94efa98f-38fd-4e1f-b233-977ef4b3ac33","464c916e-1440-4a9a-b300-9ac1e333004e","1580471b-a777-4634-ada9-a08aab9c063d","82938be4-f535-4dc3-9d63-b9fe0e53e7d6","0cdfaacf-373e-4a41-82f0-cf2c0b6ec9c7","8293e2a5-09d2-4324-8a81-dbbc319c2054","e9e012df-7b23-4a35-9447-de62dca4011c","7240134e-c250-4616-b76e-e0af3859aa9c","1aff28f2-616e-452e-949d-e3f045b24cf1","85da1b6e-e875-4a59-a7cf-ed5e5ac6f8e6"]
    },

    //================
    //FUNCIONES ENABLE Y ONCLICK
    //================ 
	
	enableButtonReinsistir: function (executionContext){
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        var formulario = JumpStartLibXRM.Fx.getFormName(executionContext);
        //debugger;
		
		//-- NEW CODE
		// Nunca se muestra el botón.
		return false;

		
		//-- OLD CODE
		//if ((estado == '2' || estado == '3') && formulario.toLowerCase() == "caso adquirencia"){
        //    return true;         
		//}
        //else{
        //    return false;
        //}
	},
    
    onClickButtonReinsistir: function (executionContext){
		//Por ahora la funcionalidad es solo para GetNet
		var confirmStrings  = {confirmButtonLabel: "Aceptar", title: "Reinsistencia", subtitle:"Va a marcar el caso como en Reinsistencia. ¿Desea Continuar?", text: "Esta acción aumenta la prioridad para la gestión del caso"};
		var confirmOptions  = { height: 200, width: 260 };
		Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
			function (success) {
				if(success.confirmed)
				{	
                    var idIncident = JumpStartLibXRM.Fx.getEntityId(executionContext);       
                    var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext); //executionContext.getFormContext();         
                
                    BotonRibbonCaso.Context.ExecutionContext = executionContext;
                    BotonRibbonCaso.Context.FormContext =  formContext;
                    BotonRibbonCaso.Package.CasoId = idIncident;
                    BotonRibbonCaso.Package.UsuarioId = JumpStartLibXRM.Fx.getUserId();
                    
					var pageInput = {
						pageType: "webresource",
						webresourceName: "xmsbs_reinsistencia"
					};
					var navigationOptions = {
						target: 2,
						width: 500,
						height: 350,
						position: 1
					};
					Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function success()
					{}, function error()
					{});                        
				}
			},
			function (error) {
				console.log(error.message);
			}
		); 
		
	},	
    
	enableButtonReiterar: function (executionContext){		
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        var formulario = JumpStartLibXRM.Fx.getFormName(executionContext);
        var origen = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_origen", "");
        var nombreFlujo = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_flujosantander", "");
        
        if(origen != "" && origen != null && origen != undefined)
        {
            origen = origen.toLowerCase();
        } 
        
        if (nombreFlujo == "SAC Fraude CaD 2020 I" || nombreFlujo == "Nvo. Flujo Fraude TC TD 2020"){
			// si es fraude antiguo, no muestra el botón
			return false;
		}
        
		// ----------------------------------
		//-- NEW CODE
        if (estado == '4' && (formulario.toLowerCase() != "caso adquirencia" && origen != 'crm adquirencia')){
            return true;         
		}
		else if (formulario.toLowerCase() == "caso adquirencia" && origen == 'crm adquirencia'){
			// si es de adquirencia, nunca se muestra el botón.
			return false;
		}
        else{
            return false;
        }		
		
		//-- OLD CODE
		
        ////debugger;
        
		////if (estado == '4' && formulario.toLowerCase() != "caso adquirencia"){
		////if (estado == '4'){ 
        
        ////Agregamos condiciones para SOLO poder Reiterar casos Banco o GetNet desde su respectiva App
        //if (estado == '4' && (formulario.toLowerCase() != "caso adquirencia" && origen != 'crm adquirencia') || (formulario.toLowerCase() == "caso adquirencia" && origen == 'crm adquirencia')){
        //    return true;         
		//}
        //else{
        //    return false;
        //}
	},
    
    onClickButtonReiterar: function (executionContext){
        
        var nombreTipoReq = "";
        var perteneceUrFormales = false;
        var esResponsableUrFormales = false;
        var esAdmin = false;
        
        nombreTipoReq = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_tipoderequerimiento", "");
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
        if (idUsuario.indexOf("{") > -1){idUsuario = idUsuario.substring(1, 37);}
        
        if(nombreTipoReq == "RECLAMO FORMAL"){
            var idUrFormales = "";
            var resultado = BotonRibbonCaso.buscarUrFormales(executionContext);
            if(resultado && resultado.value.length == 1){
                idUrFormales = resultado.value[0].xmsbs_unidadresolutoraid;
                if (idUrFormales.indexOf("{") > -1){idUrFormales = idUrFormales.substring(1, 37);}
            }	
            
            //Vemos si el usuario actual pertenece como integrante a la UR de formales
            var resultado = BotonRibbonCaso.buscarIntegranteFormales(executionContext,idUrFormales,idUsuario);
            if(resultado && resultado.value.length == 1){
                perteneceUrFormales = true;
            }
            
            //Vemos si el usuario actual pertenece como responsable de la UR de formales
            var resultado = BotonRibbonCaso.buscarResponsablesUrFormales(executionContext,idUrFormales);
            if(resultado){
                var responsable = "";
                if(resultado._xmsbs_responsable_value){
                    responsable = resultado._xmsbs_responsable_value;
                }
                
                var backup = "";
                if(resultado._xmsbs_backupresponsable_value){
                    backup = resultado._xmsbs_backupresponsable_value;
                }
                
                var responsableOriginal = "";
                if(resultado._xmsbs_responsableoriginal_value){
                    responsableOriginal = resultado._xmsbs_responsableoriginal_value;
                }
                
                if(idUsuario.toLowerCase() == responsable.toLowerCase() || idUsuario.toLowerCase() == backup.toLowerCase() || idUsuario.toLowerCase() == responsableOriginal.toLowerCase()){
                    esResponsableUrFormales = true;
                }
            }
            
            //Vemos si el usuario actual es administrador de sistema
            let array = new Array ();
            BotonRibbonCaso.RolesArray.SystemUser.forEach(
                function (x){
                    array.push(x);
                }
            );  
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
            if(found){
                esAdmin = true;
            }
            
        }
        
        if((nombreTipoReq == "RECLAMO FORMAL" && (perteneceUrFormales == true || esResponsableUrFormales == true || esAdmin == true)) || (nombreTipoReq != "RECLAMO FORMAL")){
            //Continuar si [el Caso es de Formales y el usuario es de la UR de formales o es responsable de la ur de formales o es Admin], o si no es de formales
            //Validamos que no sea un caso reiterado para ver si se puede avanzar con la reiteración
            var marcaReiterado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_marcareiterado", null);
            if(!marcaReiterado){
                //No esta reiterado, continúa
                //Primero validamos el estado para ver si lo puede reiterar
                var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
                var tipoResolucion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipoderespuesta", null);
                //if(estado == 5 && tipoResolucion){
                if(estado == 5 || estado == 6){ //Se quitó la validación del terminado con gestión. Ahora solo debe estar finalizado. Regla de Santander al 12.08.2024 (Diana)
                    //Está finalizado con Gestión. Continúa con las otras validaciones.
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
                                    //var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Caso Reiterado", subtitle:"Va a crear un nuevo caso asociado a éste. ¿Desea Continuar?"};
                                    //var confirmOptions  = { height: 200, width: 260 };
                                    //Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                                    //    function (success) {
                                    //        if(success.confirmed)
                                    //        {
                                                //Si confirma

                                                var entityFormOptions = {};
                                                entityFormOptions["entityName"] = "incident";
                                                entityFormOptions["openInNewWindow"] = false;
                                                
                                                var formParameters = {};
                                                
                                                //Set lookup field
                                                var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
                                                if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
                                                
                                                //Set lookup Cliente
                                                var ClienteId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "customerid");
                                                if(ClienteId){
                                                    if (ClienteId.indexOf("{") > -1){ClienteId = ClienteId.substring(1, 37);}
                                                    var ClienteName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "customerid");
													//var ClienteEntity = JumpStartLibXRM.Fx.getLookupValueEntityType(executionContext, "customerid");
                                                }

                                                //Set lookup UR
                                                var urId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ur");
                                                if(urId){
                                                    if (urId.indexOf("{") > -1){urId = urId.substring(1, 37);}
                                                    var urName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_ur");	
                                                }

                                                //Set lookup Punto de Contacto
                                                var PuntoContactoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_puntodecontacto");
                                                if(PuntoContactoId){
                                                    if (PuntoContactoId.indexOf("{") > -1){PuntoContactoId = PuntoContactoId.substring(1, 37);}
                                                    var PuntoContactoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_puntodecontacto");
                                                }
                                                
                                                //Set lookup OwnerId
                                                var PropietarioId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
                                                if(PropietarioId){
                                                    if (PropietarioId.indexOf("{") > -1){PropietarioId = PropietarioId.substring(1, 37);}
                                                    var PropietarioName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "ownerid");
                                                }
                                                
                                                //Set lookup Producto
                                                var ProductoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto");
                                                if(ProductoId){
                                                    if (ProductoId.indexOf("{") > -1){ProductoId = ProductoId.substring(1, 37);}
                                                    var ProductoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_producto");
                                                }

                                                //Set lookup Tipo y Detalle
                                                var TipoDetalleId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledetipologia");
                                                if(TipoDetalleId){
                                                    if (TipoDetalleId.indexOf("{") > -1){TipoDetalleId = TipoDetalleId.substring(1, 37);}
                                                    var TipoDetalleName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_detalledetipologia");									
                                                }

                                                //Sucursal - Lookup
                                                var SucursalId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_sucursalcliente");
                                                if(SucursalId){
                                                    if (SucursalId.indexOf("{") > -1){SucursalId = SucursalId.substring(1, 37);}
                                                    var SucursalName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_sucursalcliente");
                                                }

                                                //Segmento - Lookup
                                                var SegmentoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_segmentocliente");
                                                if(SegmentoId){
                                                    if (SegmentoId.indexOf("{") > -1){SegmentoId = SegmentoId.substring(1, 37);}
                                                    var SegmentoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_segmentocliente");
                                                }

                                                //Subsegmento - lookup
                                                var SubsegmentoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_subsegmentocliente");
                                                if(SubsegmentoId){
                                                    if (SubsegmentoId.indexOf("{") > -1){SubsegmentoId = SubsegmentoId.substring(1, 37);}
                                                    var SubsegmentoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_subsegmentocliente");
                                                }

                                                //Familia Producto
                                                var FamiliaId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_familiaproducto");
                                                if(FamiliaId){
                                                    if (FamiliaId.indexOf("{") > -1){FamiliaId = FamiliaId.substring(1, 37);}
                                                    var FamiliaName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_familiaproducto");
                                                }

                                                //Pregunta 1 - Lookup
                                                var Pregunta1Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_descripcionproblema");
                                                if(Pregunta1Id){
                                                    if (Pregunta1Id.indexOf("{") > -1){Pregunta1Id = Pregunta1Id.substring(1, 37);}
                                                    var Pregunta1Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_descripcionproblema");
                                                }

												//Se agregan los campos de "Respaldo" porque al ingresar casos por servicio quedan vacios y falla el reiterado 20250206
												var pregunta2R = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2respaldo");
												var pregunta3R = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta3respaldo");
												var pregunta4R = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta4respaldo");
												var pregunta5R = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta5respaldo");
												var pregunta6R = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta6respaldo");												

                                                //Pregunta 2 - Lookup
                                                var Pregunta2Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2");
                                                if(Pregunta2Id){
                                                    if (Pregunta2Id.indexOf("{") > -1){Pregunta2Id = Pregunta2Id.substring(1, 37);}
                                                    var Pregunta2Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta2");
                                                }else if(pregunta2R){
													if (pregunta2R.indexOf("{") > -1){pregunta2R = pregunta2R.substring(1, 37);}
                                                    Pregunta2Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta2respaldo");
													var Pregunta2Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta2respaldo");
												}

                                                //Pregunta 3 - Lookup
                                                var Pregunta3Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta3");
                                                if(Pregunta3Id){
                                                    if (Pregunta3Id.indexOf("{") > -1){Pregunta3Id = Pregunta3Id.substring(1, 37);}
                                                    var Pregunta3Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta3");
                                                }else if(pregunta3R){
													if (pregunta3R.indexOf("{") > -1){pregunta3R = pregunta3R.substring(1, 37);}
                                                    Pregunta3Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta3respaldo");
													var Pregunta3Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta3respaldo");
												}

                                                //Pregunta 4 - Lookup
                                                var Pregunta4Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta4");
                                                if(Pregunta4Id){
                                                    if (Pregunta4Id.indexOf("{") > -1){Pregunta4Id = Pregunta4Id.substring(1, 37);}
                                                    var Pregunta4Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta4");
                                                }else if(pregunta4R){
													if (pregunta4R.indexOf("{") > -1){pregunta4R = pregunta4R.substring(1, 37);}
                                                    Pregunta4Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta4respaldo");
													var Pregunta4Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta4respaldo");
												}
                                                
                                                //Pregunta 5 - Lookup
                                                var Pregunta5Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta5");
                                                if(Pregunta5Id){
                                                    if (Pregunta5Id.indexOf("{") > -1){Pregunta5Id = Pregunta5Id.substring(1, 37);}
                                                    var Pregunta5Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta5");
                                                }else if(pregunta5R){
													if (pregunta5R.indexOf("{") > -1){pregunta5R = pregunta5R.substring(1, 37);}
                                                    Pregunta5Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta5respaldo");
													var Pregunta5Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta5respaldo");
												}

                                                //Pregunta 6 - Lookup
                                                var Pregunta6Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta6");
                                                if(Pregunta6Id){
                                                    if (Pregunta6Id.indexOf("{") > -1){Pregunta6Id = Pregunta6Id.substring(1, 37);}
                                                    var Pregunta6Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta6");
                                                }else if(pregunta6R){
													if (pregunta6R.indexOf("{") > -1){pregunta6R = pregunta6R.substring(1, 37);}
                                                    Pregunta6Id = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_pregunta6respaldo");
													var Pregunta6Name = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_pregunta6respaldo");
												}
                                                
                                                //Ejecutivo - Texto
                                                var Ejecutivo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_ejecutivocliente", null);

                                                //Resto de campos 
                                                var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
                                                var tipoDocumento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodocumento", null);
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
                                                
                                                formParameters["xmsbs_tipodocumento"] = tipoDocumento;
                                                formParameters["xmsbs_rut"] = rut;	
                                                formParameters["prioritycode"] = 1;
                                                //formParameters["description"] = observaciones;
                                                //formParameters["xmsbs_solucionesperada"] = solucion;
                                                
                                                if(incidentId){
                                                    formParameters["parentcaseid"] = incidentId;
                                                    formParameters["parentcaseidname"] = JumpStartLibXRM.Fx.getValueField(executionContext, "title", null);
                                                }
                                                
                                               
                                                if(urId){
                                                    formParameters["xmsbs_urtipologia"] = urId;
                                                    formParameters["xmsbs_urtipologianame"] = urName;
                                                }

                                                if(PuntoContactoId){
                                                    formParameters["xmsbs_puntodecontacto"] = PuntoContactoId;
                                                    formParameters["xmsbs_puntodecontactoname"] = PuntoContactoName;
                                                }
                                                
                                                if(ProductoId){
                                                    formParameters["xmsbs_producto"] = ProductoId;
                                                    formParameters["xmsbs_productoname"] = ProductoName;
                                                }
                                                
                                                if(TipoDetalleId){
                                                    formParameters["xmsbs_detalledetipologia"] = TipoDetalleId;
                                                    formParameters["xmsbs_detalledetipologianame"] = TipoDetalleName;
                                                }
                                                
                                                if(SucursalId){
                                                    formParameters["xmsbs_sucursalcliente"] = SucursalId;
                                                    formParameters["xmsbs_sucursalclientename"] = SucursalName;
                                                }
                                                
                                                if(SegmentoId){
                                                    formParameters["xmsbs_segmentocliente"] = SegmentoId;
                                                    formParameters["xmsbs_segmentoclientename"] = SegmentoName;
                                                }
                                                
                                                if(SubsegmentoId){
                                                    formParameters["xmsbs_subsegmentocliente"] = SubsegmentoId;
                                                    formParameters["xmsbs_subsegmentoclientename"] = SubsegmentoName;
                                                }
                                                
                                                if(FamiliaId){
                                                    formParameters["xmsbs_familiaproducto"] = FamiliaId;
                                                    formParameters["xmsbs_familiaproductoname"] = FamiliaName;
                                                }
                                                
                                                if(Pregunta1Id){
                                                    formParameters["xmsbs_descripcionproblema"] = Pregunta1Id;
                                                    formParameters["xmsbs_descripcionproblemaname"] = Pregunta1Name;
                                                }
                                                
                                                if(Pregunta2Id){
                                                    formParameters["xmsbs_pregunta2"] = Pregunta2Id;
                                                    formParameters["xmsbs_pregunta2name"] = Pregunta2Name;
                                                    formParameters["xmsbs_pregunta2respaldo"] = Pregunta2Id;
                                                    formParameters["xmsbs_pregunta2respaldoname"] = Pregunta2Name;
                                                }
                                                
                                                if(Pregunta3Id){
                                                    formParameters["xmsbs_pregunta3"] = Pregunta3Id;
                                                    formParameters["xmsbs_pregunta3name"] = Pregunta3Name;
                                                    formParameters["xmsbs_pregunta3respaldo"] = Pregunta3Id;
                                                    formParameters["xmsbs_pregunta3respaldoname"] = Pregunta3Name;
                                                }
                                                
                                                if(Pregunta4Id){
                                                    formParameters["xmsbs_pregunta4"] = Pregunta4Id;
                                                    formParameters["xmsbs_pregunta4name"] = Pregunta4Name;
                                                    formParameters["xmsbs_pregunta4respaldo"] = Pregunta4Id;
                                                    formParameters["xmsbs_pregunta4respaldoname"] = Pregunta4Name;
                                                }
                                                
                                                if(Pregunta5Id){
                                                    formParameters["xmsbs_pregunta5"] = Pregunta5Id;
                                                    formParameters["xmsbs_pregunta5name"] = Pregunta5Name;
                                                    formParameters["xmsbs_pregunta5respaldo"] = Pregunta5Id;
                                                    formParameters["xmsbs_pregunta5respaldoname"] = Pregunta5Name;
                                                }
                                                
                                                if(Pregunta6Id){
                                                    formParameters["xmsbs_pregunta6"] = Pregunta6Id;
                                                    formParameters["xmsbs_pregunta6name"] = Pregunta6Name;
                                                    formParameters["xmsbs_pregunta6respaldo"] = Pregunta6Id;
                                                    formParameters["xmsbs_pregunta6respaldoname"] = Pregunta6Name;
                                                }
                                                
                                                if(Ejecutivo){
                                                    formParameters["xmsbs_ejecutivocliente"] = Ejecutivo;
                                                }
												
												//Reiterado para Adquirencia (Campos del Formulario de GetNet) 
												var formulario = JumpStartLibXRM.Fx.getFormName(executionContext);
												if (formulario.toLowerCase() == "caso adquirencia"){
												
													//Cliente
													if(ClienteId){
                                                    formParameters["customerid"] = ClienteId;
                                                    formParameters["customeridname"] = ClienteName;
													formParameters["customeridtype"] = "contact";
													
                                                    formParameters["xmsbs_cliente"] = ClienteId;
                                                    formParameters["xmsbs_clientename"] = ClienteName;
													}
													
													//Lookup
														
													var ComercioId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_comercio");
													if(ComercioId){
														if (ComercioId.indexOf("{") > -1){ComercioId = ComercioId.substring(1, 37);}
														var ComercioName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_comercio");
													}

													var SucursalId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_sucursal");
													if(SucursalId){
														if (SucursalId.indexOf("{") > -1){SucursalId = SucursalId.substring(1, 37);}
														var SucursalName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_sucursal");
													}												
														formParameters["xmsbs_comercio"] = ComercioId;
														formParameters["xmsbs_comercioname"] = ComercioName;
														formParameters["xmsbs_sucursal"] = SucursalId;
														formParameters["xmsbs_sucursalname"] = SucursalName;

													//Campos Texto 
														
														//xmsbs_solucionesperada
														//description
														
														var rutcomercio = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rutcomercio", null);
														var NSucursal = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_nsucursal", null);
														var CargoEjerce = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_cargoqueejerceenelcomercio", null);
													
														formParameters["xmsbs_rutcomercio"] = rutcomercio;					
														formParameters["xmsbs_nsucursal"] = NSucursal;
														formParameters["xmsbs_cargoqueejerceenelcomercio"] = CargoEjerce;
																									
												}
												else{
												//Cliente
													if(ClienteId){
                                                    formParameters["customerid"] = ClienteId;
                                                    formParameters["customeridname"] = ClienteName;
													
                                                    formParameters["xmsbs_cliente"] = ClienteId;
                                                    formParameters["xmsbs_clientename"] = ClienteName;
													}
												}
												

                                                //Hacemos la busqueda para obtener los valores dinámicos
                                                var flujoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_flujosantander");
                                                if (flujoId.indexOf("{") > -1){flujoId = flujoId.substring(1, 37);}
                                                var resultado = BotonRibbonCaso.buscarCamposParaReiterado(executionContext,flujoId);
                                                
                                                if(resultado){
                                                    //debugger;
                                                    if(resultado.value.length > 0){
                                                        //Si trajo campos, los debemos recorrer
                                                        for(var i = 0; i<resultado.value.length; i++ ){
                                                            var tipoCampo = resultado.value[i].xmsbs_tipocampo;
                                                            var nombreEsquema = resultado.value[i].xmsbs_nombreesquema;
                                                            
                                                            if(tipoCampo != 9){
                                                                var valorCampo = JumpStartLibXRM.Fx.getValueField(executionContext, nombreEsquema, null);
                                                                
                                                                //lo inyectamos como parámetro
                                                                formParameters[nombreEsquema] = valorCampo;
                                                            }
                                                            else{
                                                                //Es de búsqueda, consultamos por el valueID
                                                                var valorCampo = JumpStartLibXRM.Fx.getLookupValueId(executionContext, nombreEsquema);
                                                                if(valorCampo){
                                                                    if (valorCampo.indexOf("{") > -1){valorCampo = valorCampo.substring(1, 37);}
                                                                    var NameCampo = JumpStartLibXRM.Fx.getLookupValueName(executionContext, nombreEsquema);

                                                                    //lo inyectamos como parámetro
                                                                    formParameters[nombreEsquema] = valorCampo;
                                                                    formParameters[nombreEsquema + "name"] = NameCampo;																													
                                                                }														
                                                            }
                                                            
                                                            if(tipoCampo == 2 && nombreEsquema.includes("xmsbs_picklist")){ // 2: Picklist genérico
                                                                var valorCampo = JumpStartLibXRM.Fx.getValueField(executionContext, nombreEsquema + "_texto", null);	
                                                                formParameters[nombreEsquema + "_texto"] = valorCampo;
                                                            }
                                                            
                                                            if (tipoCampo == 2 && nombreEsquema == "xmsbs_contratoseleccion")
                                                            {      
                                                                //debugger;
                                                                // el campo: xmsbs_contratoseleccion, tb implica el campo: xmsbs_contratotexto
                                                                var valorCampo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contratotexto", null);
                                                                formParameters["xmsbs_contratotexto"] = valorCampo;
                                                                
                                                                var valorCampo2 = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contratoseleccion", null);
                                                                formParameters["xmsbs_contratoseleccion"] = valorCampo2;
                                                                
                                                                var valorCampo3 = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contratoseleccioncache", null);
                                                                formParameters["xmsbs_contratoseleccioncache"] = valorCampo3;
                                                            }
                                                        }
                                                    }
                                                }
												
                                                formParameters["xmsbs_marcareiterado"] = true;
                                                //formParameters["xmsbs_ingresounicofinalizado"] = true;
                                                formParameters["title"] = "Caso pendiente de ingreso";
                                                Xrm.Utility.openEntityForm("incident", null, formParameters, entityFormOptions);    			
                                    //        }
                                    //        else
                                    //        {
                                    //            //Si cancela
                                    //        }
                                    //    },
                                    //    function (error) {
                                    //        //console.log(error.message);
                                    //    }
                                    //);
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
                }
                else{
                    //Mensaje indicando que no se puede abrir un caso reiterado pq no finalizó correctamente
                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Validación", text: "Sólo se pueden reiterar casos Finalizados o Terminados sin Gestión. No puede continuar."};
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
                //Mensaje indicando que no se puede abrir un caso reiterado por ser un reiterado
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Validación", text: "No se puede reiterar un caso de reiterado."};
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
            //Mensaje indicando que no se puede reiterar ya que, al ser de formales, debe ser reiterado por alguien de formales
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Validación", text: "Un caso de Reguladores sólo puede ser reiterado por personal de Reguladores"};
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

    buscarIntegranteFormales: function (executionContext,IdUnidadResolutora,idUsuario){
        var entityType = "xmsbs_integranteurs";
        var query = "$select=xmsbs_name,_xmsbs_usuario_value,xmsbs_disponible,_xmsbs_unidadresolutora_value,xmsbs_integranteurid&$expand=xmsbs_unidadResolutora($select=_xmsbs_responsable_value,_xmsbs_backupresponsable_value)";
        query += "&$filter=(statecode eq 0 and _xmsbs_unidadresolutora_value eq "+IdUnidadResolutora+" and _xmsbs_usuario_value eq "+idUsuario+")";
        query += "&$orderby=_xmsbs_usuario_value asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },

    buscarUrFormales: function (executionContext){
        var entityType = "xmsbs_unidadresolutoras";
        var query = "$select=xmsbs_name,_xmsbs_responsable_value,xmsbs_codigo,xmsbs_unidadresolutoraid&$filter=(statecode eq 0 and xmsbs_codigo eq 'UR-001')";
        query += "&$orderby=xmsbs_codigo asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },

    buscarResponsablesUrFormales: function (executionContext, idFormales){
        //Preparamos la consulta
        var entityType = "xmsbs_unidadresolutoras";
        var entityId = idFormales;
        var query = "xmsbs_name,_xmsbs_responsable_value,xmsbs_codigo,xmsbs_unidadresolutoraid,_xmsbs_backupresponsable_value,_xmsbs_responsableoriginal_value";
        
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
        return resultado;
    },
    
    enableButtonAutoAsignarse: function (executionContext){
        //debugger; 
        var usuarioValido = false;
        var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        var formulario = JumpStartLibXRM.Fx.getFormName(executionContext);
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
        var idOwner = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
        
        //if (estado == '2' && formulario.toLowerCase() == "caso" && idUsuario != idOwner)
        if ((estado == '2' || estado == '3') && idUsuario != idOwner)
        {
            if(formulario != "Caso Adquirencia"){
                BotonRibbonCaso.VisibilidadBotonAutoAsignacion.ValorVisibilidad = true;
            }
            else{
                BotonRibbonCaso.VisibilidadBotonAutoAsignacion.ValorVisibilidad = false;
            }
            
            /*
            let array = new Array ();
            
            BotonRibbonCaso.RolesArray.SystemUser.forEach( 
                function (x){
                    array.push(x);
                }
            );
        
            //BotonRibbonCaso.RolesArray.SantanderContactCenterEjecutivo.forEach( 
                //function (x){
                    //array.push(x);
                //}
            //);
            
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);            
            let esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
            
            if(esPropietario)
            {
				usuarioValido = false;
			}
			else
            {
                usuarioValido = true;				
			} 
        
            var globalContext = Xrm.Utility.getGlobalContext();
            globalContext.getCurrentAppProperties().then(
                function success(app) {
                    var respuesta = app
                    var nombreApp = respuesta.displayName;
                    //debugger;
                    if(nombreApp.toLowerCase() != "adquirencia" && usuarioValido) 
                    {
                        BotonRibbonCaso.VisibilidadBotonAutoAsignacion.ValorVisibilidad = true;
                    }
                    else 
                    {
                        BotonRibbonCaso.VisibilidadBotonAutoAsignacion.ValorVisibilidad = false;
                    }                    
                },
                function errorCallback() { 
                    BotonRibbonCaso.VisibilidadBotonAutoAsignacion.ValorVisibilidad = false; 
                }
            );   
            */
        }
        else
        {
            BotonRibbonCaso.VisibilidadBotonAutoAsignacion.ValorVisibilidad = false;
        }     

        return BotonRibbonCaso.VisibilidadBotonAutoAsignacion.ValorVisibilidad;
    },
	
	onClickButtonAutoAsignarse: function (executionContext){
    
    debugger; 
    
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
        var usuario = JumpStartLibXRM.Fx.getUserName();
        if (idUsuario.indexOf("{") > -1)
            idUsuario = idUsuario.substring(1, 37);
		
		//Buscar la última bitácora
        //var formContext = executionContext.getFormContext();
		var idCaso = JumpStartLibXRM.Fx.getEntityId(executionContext);
		if (idCaso.indexOf("{") > -1){idCaso = idCaso.substring(1, 37);}
		
		var idUR = "";
		var idPropietario = "";
        var idURCaso = "";
		
		var ultimaBitacora = BotonRibbonCaso.buscarUltimaBitacoraCaso(executionContext, idCaso);
		if(ultimaBitacora){
			if(ultimaBitacora.value.length > 0){
                idUR = ultimaBitacora.value[0]._xmsbs_ur_value;
                if(idUR){if (idUR.indexOf("{") > -1){idUR = idUR.substring(1, 37);}}
                idPropietario = ultimaBitacora.value[0]._ownerid_value;
                if(idPropietario){if (idPropietario.indexOf("{") > -1){idPropietario = idPropietario.substring(1, 37);}}
            }
		}
        
        var resultado = BotonRibbonCaso.buscarUrActualCaso(executionContext, idCaso);
        if(resultado){
            idURCaso = resultado._xmsbs_ur_value;
            if(idURCaso.indexOf("{") > -1){idURCaso = idURCaso.substring(1, 37);}
            
        }
        
        if(idUR && idURCaso.toLowerCase() == idUR.toLowerCase()){
            //Buscamos en la UR de esa ultima bitácora al usuario en sesión
            var integranteUR = BotonRibbonCaso.buscarIntegranteUR(executionContext, idUsuario, idUR);
            if (integranteUR && integranteUR.value.length > 0)
            {
                //Comparar el propietario con el usuario
                if(idPropietario.toLowerCase() == idUsuario.toLowerCase()){
                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "No se puede autoasignar el Caso debido a que esta asignado al mismo usuario."};
                    var alertOptions = { height: 130, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function (success) {
                            //console.log("Alert dialog closed");
                            return;
                        },
                        function (error) {
                            //console.log(error.message);
                            return;
                        }
                    );
                    return;
                }
                else{
                    let Disponible = integranteUR.value[0].xmsbs_disponible;
                    if (!Disponible) // Está ACTIVO pero no está DISPONIBLE
                    {
                        JumpStartLibXRM.Fx.AlertDialog("Información", "Usuario no está disponible dentro de la UR: " + UR, "Cerrar");
                        return;	
                    }
                }
            }
            
            let array = new Array ();
            BotonRibbonCaso.RolesArray.SystemUser.forEach( function (x){ array.push(x);} );
            //BotonRibbonCaso.RolesArray.SantanderUrAdmin.forEach( function (x){array.push(x);});
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
            
			let array2 = new Array ();
			BotonRibbonCaso.RolesArray.SantanderUrAdmin.forEach( function (x){array2.push(x);});
			BotonRibbonCaso.RolesArray.JefeCanales.forEach( function (x){array2.push(x);});
			let found2 = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array2);
			
            var JefeUR = false;
			if(found2)
            {
				//Tiene el rol de jefe de canales. Hacemos la busqueda de usuarios por oData
				var idUsuarioConectado = JumpStartLibXRM.Fx.getUserId();
				if (idUsuarioConectado.indexOf("{") > -1){idUsuarioConectado = idUsuarioConectado.substring(1, 37);}
				
				var idUR = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ur");
				if (idUR.indexOf("{") > -1){idUR = idUR.substring(1, 37);}                 

				var usuariosDelJefe = BotonRibbonCaso.buscarIntegranteURJefe(executionContext, idUR, idUsuarioConectado);
				if(usuariosDelJefe && usuariosDelJefe.value.length > 0){
					JefeUR = true;
				}
				//Tiene rol de Responsable UR, entonces lo busco directo en la UR
				else{
					var RespUR = BotonRibbonCaso.buscarResponsableUR(executionContext, idUR, idUsuarioConectado);
					if(RespUR && RespUR.value.length > 0){
						JefeUR = true;
					}	
				}
			} 
			
            //Dynamics_CRM_MIDAS_CL_DEV
            var usuarioAdministrador = BotonRibbonCaso.buscarUsuarioAdministrador(executionContext);
            
            //found = false;
            
            if(integranteUR.value.length > 0 || found || JefeUR == true)
            {            
                var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Información", subtitle:"Va a auto-asignarse el caso. ¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos"};
                var confirmOptions  = { height: 200, width: 260 };
                Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                    function (success) {
                        if(success.confirmed)
                        {
                            //debugger;
                            //JumpStartLibXRM.Fx.setLookupValue(executionContext, "ownerid", idUsuario, usuario, "systemuser");
                            //JumpStartLibXRM.Fx.formSave(executionContext);
                            
                            var idUsuarioAsignar = idUsuario;
                            var idUsuarioImpersonar = usuarioAdministrador.value[0].systemuserid;
                            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
                            if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
							
							//debugger;
							// si se asignó correctamente, entonces actualiza el registro extensión del caso y lo marca con el Tipo de Asignación: AutoAsignación (657130002)
							var xmsbs_extensioncaso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_extensioncaso", null);
							if (xmsbs_extensioncaso)
							{
                                //Buscamos la bitácora actual del caso, para luego consultar sus datos
                                var diasRestantes = "";
                                var estadoSla = "";
                                var fechaRespuesta = "";
                                
                                var resultado = BotonRibbonCaso.buscarUltimaBitacora(executionContext,incidentId);
                                if(resultado && resultado.value.length > 0){
                                    //Trajo la ultima bitácora. Se prueba
                                    diasRestantes = resultado.value[0].xmsbs_bitacoraactual.xmsbs_diasrestantes;
                                    estadoSla = resultado.value[0].xmsbs_bitacoraactual.xmsbs_estadosla;
                                    fechaRespuesta = resultado.value[0].xmsbs_bitacoraactual.xmsbs_fecharespuesta;
                                }
                                
								var objExtCaso = {};
								objExtCaso["xmsbs_tipodeasignacion"] = 657130001; // Autoasignación
                                objExtCaso["xmsbs_estadosla"] = estadoSla;
                                objExtCaso["xmsbs_diasrestantes"] = diasRestantes;
                                objExtCaso["xmsbs_fechamaximaderespuesta"] = fechaRespuesta;
								var resultExtCaso = SDK.WEBAPI.updateRecordImpersonate(executionContext, xmsbs_extensioncaso[0].id.replace(/[{}]/g, ""), objExtCaso, "xmsbs_extensioncaso", idUsuarioImpersonar, null, null);
							}
							
                            var entity = "incidents";
                            var objeto = {};
                            objeto["ownerid@odata.bind"] = "/systemusers("+idUsuarioAsignar+")";           
                            objeto["xmsbs_ur@odata.bind"] = "/xmsbs_unidadresolutoras("+idUR+")";           
                            //var resultado = SDK.WEBAPI.updateRecord(executionContext, incidentId, objeto, entity, null, null);
                            var resultado = SDK.WEBAPI.updateRecordImpersonate(executionContext, incidentId, objeto, entity, idUsuarioImpersonar, null, null);
                            
                            
                            setTimeout(function () {
                                Xrm.Utility.openEntityForm("incident", incidentId);
                            }, 2000);                        
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
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "El usuario " + usuario.toLowerCase() + " no es integrante de la unidad resolutora actual, o no posee rol de administrador. No se puede realizar la auto-asignación."};
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
        }
        else{
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "Aún se encuentra en proceso la validación de bitácora. Favor reintentar en unos segundos."};
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
    
    enableButtonSLA: function (executionContext){
		//debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '2') {   
            let array = new Array ();
            BotonRibbonCaso.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
            );
            BotonRibbonCaso.RolesArray.SantanderUrAdmin.forEach( 
                function (x){
                    array.push(x);
                });
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
            return found;
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
    
    enableButtonAsignar: function (executionContext){	
	
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        var origen = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_origen", "");
        
        if(origen != "" && origen != null && origen != undefined)
        {
            origen = origen.toLowerCase();
        } 
        
        //if (estado == '2' && origen != 'crm adquirencia')
		if (estado == '2') {   
            
			let array = new Array ();
            //Administrador
			BotonRibbonCaso.RolesArray.SystemUser.forEach(function (x){array.push(x);});
            //Adquirencia
			BotonRibbonCaso.RolesArray.SantanderAdquerenciaUrAdmin2.forEach(function (x){array.push(x);});
            BotonRibbonCaso.RolesArray.SantanderAdquirenciaSupervisor.forEach(function (x){array.push(x);});       
			let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
			
			let array2 = new Array ();
			//Jefe Canales y Responsable UR
			BotonRibbonCaso.RolesArray.SantanderUrAdmin.forEach( function (x){array2.push(x);});
			BotonRibbonCaso.RolesArray.JefeCanales.forEach( function (x){array2.push(x);});
			let found2 = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array2);
			
            var JefeUR = false;
			if(found2)
            {
				//Tiene el rol de jefe de canales. Hacemos la busqueda de usuarios por oData
				var idUsuarioConectado = JumpStartLibXRM.Fx.getUserId();
				if (idUsuarioConectado.indexOf("{") > -1){idUsuarioConectado = idUsuarioConectado.substring(1, 37);}
				
				var idUR = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ur");
				if (idUR.indexOf("{") > -1){idUR = idUR.substring(1, 37);}                 

				var usuariosDelJefe = BotonRibbonCaso.buscarIntegranteURJefe(executionContext, idUR, idUsuarioConectado);
				if(usuariosDelJefe && usuariosDelJefe.value.length > 0){
					JefeUR = true;
				}
				//Tiene rol de Responsable UR, entonces lo busco directo en la UR
				else{
					var RespUR = BotonRibbonCaso.buscarResponsableUR(executionContext, idUR, idUsuarioConectado);
					if(RespUR && RespUR.value.length > 0){
						JefeUR = true;
					}	
				}
			} 			
 
            var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
			
			//No se visualiza el boton al propietario
			// Found = Visible para el Administrador del sistema y para los Responsables UR de Adquirencia
			//Jefe UR = Visible si eres un jefe de canal del propietario del caso, o responsable de la UR del propietario del caso
			
            if(!esPropietario || found || JefeUR == true)
			{
				return true;
			}
			else
			{
                return false;				
			}             
		}
        else
		{
            return false;
        }
	},	


	onClickButtonAsignar: function (executionContext) {
        //executionContext proveniente desde el ribbon no permite obtener el formContext
        //debugger;
        var AzureURL = BotonRibbonCaso.buscarAzureURL(executionContext);
        var ApiKey = BotonRibbonCaso.buscarApiKey(executionContext);
        
		PopUp.openWRAsignarCaso(executionContext, AzureURL.value[0].xmsbs_valor, ApiKey.value[0].xmsbs_valor);
	},
	
	
	enableButtonImprimirCaso: function (executionContext){
		// el botón solo se muestra solo si el caso es de: DO-1152 y DO-1354
		// DO-1152: d4a03cd8-cb09-ed11-82e5-000d3add02c2
		// DO-1354: 8e3f4bd4-082e-ed11-9db1-002248a01933
		
		var DetalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
		if(!DetalleOperacionID)
			return false;
		
		DetalleOperacionID = DetalleOperacionID.replace(/[{}]/g, "").toLowerCase();
		
		if (DetalleOperacionID == "d4a03cd8-cb09-ed11-82e5-000d3add02c2" ||
			DetalleOperacionID == "8e3f4bd4-082e-ed11-9db1-002248a01933") {
			return true;
		}
		
		return false;
		
		/*
		// Solo para pruebas de JM
		var idUsuario = JumpStartLibXRM.Fx.getUserId();
        if (idUsuario == "{8B4CF48E-AAAD-EB11-8236-0022489BAFB9}") // JM
        {
			// sobreescribe la funcionalidad, y se usa este botón para imprimir el CASO.
			return true;
        }		
		*/
	},
	onClickButtonImprimirCaso: function (executionContext) {
        //var url = "https://midaschiledesa.crm2.dynamics.com/WebResources/xmsbs_incident_print";
		//var url = "../WebResources/xmsbs_incident_print?guid=" + JumpStartLibXRM.Fx.getEntityId(executionContext) + "";
        //var windowName = "Imprimir Caso";
        //var windowFeatures = "width=900,height=500,resizable=yes,top=100,menubar=no,toolbar=no,location=no,status=no,scrollbars=no";

        //window.open(url, windowName, windowFeatures);
		
		var pageInput = {
			pageType: "webresource",
			webresourceName: "xmsbs_incident_print"
		};
		var navigationOptions = {
			target: 2,
			width: 900,
			height: 500,
			position: 1
		};
		Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(
			function success(){}, 
			function error(){}
		);
	},
    
    enableButtonCancelar: function (executionContext){
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == JumpStartLibXRM.FormState.UPDATE){     

            var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);        
            if(esPropietario)
				return false;
			
            let array = new Array ();
			
            BotonRibbonCaso.RolesArray.SystemUser.forEach(function (x){array.push(x);});
            BotonRibbonCaso.RolesArray.SantanderAdquerenciaUrAdmin2.forEach(function (x){array.push(x);});
            BotonRibbonCaso.RolesArray.SantanderAdquirenciaSupervisor.forEach(function (x){array.push(x);});
			BotonRibbonCaso.RolesArray.AdqCancelarCaso.forEach(function (x){array.push(x);});
   
            var found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
			return found;
		}
        
		return false;
	},	
	
    enableButtonCancelar_OLD: function (executionContext){
        //debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == '2'){     
            let array = new Array ();
            BotonRibbonCaso.RolesArray.SystemUser.forEach(
                function (x){
                    array.push(x);
                }
            );
            BotonRibbonCaso.RolesArray.SantanderAdquerenciaUrAdmin2.forEach( 
                function (x){
                    array.push(x);
                });
            BotonRibbonCaso.RolesArray.SantanderAdquirenciaSupervisor.forEach( 
                function (x){
                    array.push(x);
                });
   
            
            var rolNuevo = JumpStartLibXRM.Fx.UserHasRole(executionContext, "[Adquirencia] - Cancelar caso");

            if (rolNuevo == true)
            {
                let found = true;
            }
            
            else
            {
                let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
            }
            
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

	onClickButtonCancelar: function (executionContext) {

		// antes de cancelar el caso se lee si aplica el stock de adquirencia, 
		// si aplica, entonces se muestra en el mensaje
		// y si acepta, entonces se realiza la devolución de Stock.


		debugger;
		var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
		var oDetalleOperacion = RepositorioSucesos.buscarDetalleOperacion(executionContext, detalleOperacionID);

		var StockAdquirenciaId = null;
		var NuevoStock = null;
		var MensajeStock = "";
		
		if (oDetalleOperacion.xmsbs_idstockadquirencia){
			
			// solo aplica devolución si el campo es visible, el valor es mayor que cero, y es de solo lectura.
			
			var EsVisible = JumpStartLibXRM.Fx.getVisible(executionContext, oDetalleOperacion.xmsbs_campocantidadsolicitada);
			var CantidadEnUso = JumpStartLibXRM.Fx.getValueField(executionContext, oDetalleOperacion.xmsbs_campocantidadsolicitada, null);
			var SoloLectura = JumpStartLibXRM.Fx.getDisabled(executionContext, oDetalleOperacion.xmsbs_campocantidadsolicitada);
			
			if (EsVisible == true && CantidadEnUso > 0 && SoloLectura == true){
				var oStockAdquirencia = RepositorioSucesos.oDataGetStockActual(executionContext, oDetalleOperacion.xmsbs_idstockadquirencia);
				if (oStockAdquirencia && oStockAdquirencia.value.length > 0){
					var StockActual = oStockAdquirencia.value[0].xmsbs_cantidad;
					var NombreProducto = oStockAdquirencia.value[0].xmsbs_name;

					StockAdquirenciaId = oStockAdquirencia.value[0].xmsbs_stockadquirenciaid;
					NuevoStock = StockActual + CantidadEnUso;
					
					MensajeStock = ". Se liberarán " + CantidadEnUso + " unidades de " + NombreProducto + ".";
				}
			}
		}
			
		if(confirm("¿Está seguro que desea cancelar el caso?" + MensajeStock))
        {
			//debugger;
            //Marco el caso como rechazado
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", 2);

			debugger;
			if (StockAdquirenciaId){
				var objeto = {};
				objeto["xmsbs_cantidad"] = NuevoStock;
				var resultado = SDK.WEBAPI.updateRecordImpersonate(executionContext, StockAdquirenciaId, objeto, "xmsbs_stockadquirencias", BotonRibbonCaso.Package.UsuarioAdminID, null, null);
				if(resultado == "OK"){
					var FullDateNow = JumpStartLibXRM.Fx.getDateNOW_ddmmaaaa_hhmmss();
					JumpStartLibXRM.Fx.setFormNotification(executionContext, "WARNING", "Se actualiza el Stock a: " + NuevoStock + " unidades. (última lectura: " + FullDateNow + ")", "NOT_StockAdquirencia");
				}
				else{
					JumpStartLibXRM.Fx.setFormNotification(executionContext, "ERROR", "Error al actualizar Stock. Informe al Administrador.", "NOT_StockAdquirencia");
				}
			}

            //Guardamos el cambio
            JumpStartLibXRM.Fx.formSave(executionContext);
		}		
	},	

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
                var AzureURL = BotonRibbonCaso.buscarAzureURL(executionContext);
            
                var url = AzureURL.value[0].xmsbs_valor + "/HTML/GestionCaso/ResolverCaso.html?idIncident=" + incidentId;
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
    
    enableNewCaseCreate: function (executionContext){
        //debugger;
        //var resultado = true;
        var globalContext = Xrm.Utility.getGlobalContext();
        var OrgName = globalContext.organizationSettings.attributes.name;
        globalContext.getCurrentAppProperties().then(
            function success(app) {
                var respuesta = app
                var nombreApp = respuesta.displayName;

				// se muestra para todas las aplicaciones, excepto: robot y consulta
                // + MIDAS REGULARDORES , MIDAS ADQUIRENCIA Ejecutivo , MIDAS ADQUIRENCIA Responsable , MIDA TEAM MEMBER , MIDAS AUTORIZADOR  Quebranto.
                
                var AppsBtnNuevoVisible = null;
                
                if((OrgName == "midaschiledesa") || (OrgName == "2cd9b263c30b43bc954b4e162d5a32f6")) // el nombre de la organización en homo es: 2cd9b263c30b43bc954b4e162d5a32f6
                {
                    AppsBtnNuevoVisible = [
						{name: 'Adquirencia', visible: true},
						{name: 'Adquirencia Ejecutivo', visible: true},
						{name: 'Adquirencia Responsable UR', visible: true},
						{name: 'BS MIDAS', visible: true},
						{name: 'MIDAS Autorizador Quebranto', visible: false},
						{name: 'MIDAS Canales', visible: true},
						{name: 'MIDAS Consultas', visible: false},
						{name: 'MIDAS Ejecutivo', visible: true},
						{name: 'MIDAS Gerencia', visible: true},
						{name: 'MIDAS Gestión Quebranto', visible: false},
						{name: 'MIDAS Jefe Canales', visible: true},
						{name: 'MIDAS Reguladores', visible: false},
						{name: 'MIDAS Responsable UR', visible: true},
						{name: 'MIDAS Robot', visible: false},
						{name: 'MIDAS Team Member', visible: false}
					];
                    
                    BotonRibbonCaso.VisibilidadBotonCreacion.ValorVisibilidad = (AppsBtnNuevoVisible.filter(x => x.name == nombreApp && x.visible == true).length > 0);
                }
                else
                {
                    // Cod Original (actual en PROD)
                    /*
                    if(nombreApp.toLowerCase().indexOf("adquirencia") > -1 || nombreApp.toLowerCase() == "bs midas") {
                        BotonRibbonCaso.VisibilidadBotonCreacion.ValorVisibilidad = true;
                    }
                    else {
                        BotonRibbonCaso.VisibilidadBotonCreacion.ValorVisibilidad = false;
                    }
                    */
                    
                    //Habilitación para Producción
                    AppsBtnNuevoVisible = [
						{name: 'Adquirencia', visible: true},
						{name: 'Adquirencia Ejecutivo', visible: true},
						{name: 'Adquirencia Responsable UR', visible: true},
						{name: 'BS MIDAS', visible: true},
						{name: 'MIDAS Autorizador Quebranto', visible: false},
						{name: 'MIDAS Canales', visible: true},
						{name: 'MIDAS Consultas', visible: false},
						{name: 'MIDAS Ejecutivo', visible: true},
						{name: 'MIDAS Gerencia', visible: true},
						{name: 'MIDAS Gestión Quebranto', visible: false},
						{name: 'MIDAS Jefe Canales', visible: true},
						{name: 'MIDAS Reguladores', visible: false},
						{name: 'MIDAS Responsable UR', visible: true},
						{name: 'MIDAS Robot', visible: false},
						{name: 'MIDAS Team Member', visible: false}
					];
                    
                    BotonRibbonCaso.VisibilidadBotonCreacion.ValorVisibilidad = (AppsBtnNuevoVisible.filter(x => x.name == nombreApp && x.visible == true).length > 0);
                }
            },
            function errorCallback() { 
                BotonRibbonCaso.VisibilidadBotonCreacion.ValorVisibilidad = false; 
            }
        );
        
        return BotonRibbonCaso.VisibilidadBotonCreacion.ValorVisibilidad;
    },
    
    onClickNewCaseCreate: function (executionContext){
        //debugger;
        //FormParameters
        var formParameters = {};

        //FormOptions
        var entityFormOptions = {};
        entityFormOptions["entityName"] = "incident";
        entityFormOptions["openInNewWindow"] = false;

        // Open the form
        Xrm.Utility.openEntityForm("incident", null, formParameters, entityFormOptions);
    },
    
    //enableCreateMovimientoCaso: function (executionContext){
        // debugger;
        //var idUsuario = JumpStartLibXRM.Fx.getUserId();
        //BotonRibbonCaso.VisibilidadBotonCrearMovimientoCaso.ValorVisibilidad = false;
        
        // solo a modo de prueba        
        //if (idUsuario == "{8B4CF48E-AAAD-EB11-8236-0022489BAFB9}") // JM
        //{
            // si existe este campo entonces se debe mostrar el botón
            //var Borrador = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_borrador", null);
            //if (Borrador)
                //BotonRibbonCaso.VisibilidadBotonCrearMovimientoCaso.ValorVisibilidad = true;
        //}        
        //return BotonRibbonCaso.VisibilidadBotonCrearMovimientoCaso.ValorVisibilidad;
    //},
    
    onClickCreateMovimientoCaso: function (executionContext){
        //debugger;
        // nada
    },  
    
    //================
    //FUNCIONES DE BUSQUEDA
    //================
    buscarBitacoraActual: function (executionContext, BitacoraactualId){
		if (BitacoraactualId.indexOf("{") > -1)
			BitacoraactualId = BitacoraactualId.substring(1, 37);
	
        var entityType = "xmsbs_bitacoraetapas";
        var query = "$select=xmsbs_bitacoraetapaid,xmsbs_name,_xmsbs_ur_value";
		query += "&$expand=xmsbs_integranteurpropietario($select=statecode,xmsbs_disponible)";
        query += "&$filter=(xmsbs_bitacoraetapaid eq " + BitacoraactualId + ")";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },    
    buscarIntegranteUR: function (executionContext, idUsuario, idUR){
        var entityType = "xmsbs_integranteur";
        var query = "$select=statecode,xmsbs_disponible,_xmsbs_usuario_value,_xmsbs_unidadresolutora_value&$orderby=createdon desc";
        query += "&$filter=statecode eq 0 and _xmsbs_usuario_value eq '" + idUsuario + "' and _xmsbs_unidadresolutora_value eq '" + idUR + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    buscarIntegranteURJefe: function (executionContext, idUR, idUsuarioConectado){
        var entityType = "xmsbs_integranteur";
        var query = "$select=statecode,xmsbs_disponible,_xmsbs_usuario_value,_xmsbs_unidadresolutora_value&$orderby=createdon desc";
        query += "&$filter=_xmsbs_unidadresolutora_value eq "+idUR+" and (_xmsbs_subgerente_value eq "+idUsuarioConectado+" or _xmsbs_jefezonal_value eq "+idUsuarioConectado+" or _xmsbs_jefeplataforma_value eq "+idUsuarioConectado+")";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },	
    buscarResponsableUR: function (executionContext, idUR, idUsuarioConectado){
        var entityType = "xmsbs_unidadresolutoras";
        var query = "$select=_xmsbs_responsable_value,xmsbs_codigo,xmsbs_name&$orderby=createdon desc";
        query += "&$filter=statecode eq 0 and _xmsbs_responsable_value eq '" + idUsuarioConectado + "' and xmsbs_unidadresolutoraid eq '" + idUR + "'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },		
    buscarCamposParaReiterado: function (executionContext, flujoId){
        var entityType = "xmsbs_campos";
        var query = "$select=xmsbs_campoid,xmsbs_tipocampo,xmsbs_nombreesquema&$expand=xmsbs_etapa";
        query += "&$filter=statecode eq 0 and (xmsbs_etapa/xmsbs_orden eq 1 and xmsbs_etapa/_xmsbs_flujosantander_value eq "+flujoId+")&$orderby=xmsbs_tipocampo asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    buscarApiKey: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + BotonRibbonCaso.ApiKey.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},    
    buscarAzureURL: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + BotonRibbonCaso.URL.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    buscarUsuarioAdministrador: function (executionContext){
		var entityType = "systemuser";
		var query = "$select=fullname";
		query += "&$filter=fullname eq '" + BotonRibbonCaso.Usuario.Administrador + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
    buscarUltimaBitacora: function (executionContext, incidentId){
        var entityType = "incidents";
		var query = "$select=xmsbs_numerocorrelativo,incidentid&$expand=xmsbs_bitacoraactual($select=xmsbs_fecharespuesta,xmsbs_estadosla,xmsbs_diasrestantes)";
		query += "&$filter=(incidentid eq '"+incidentId+"')&$orderby=xmsbs_numerocorrelativo asc";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },

    buscarUltimaBitacoraCaso: function (executionContext,idCaso){
		var entityType = "xmsbs_bitacoraetapas";
		var query = "$select=xmsbs_bitacoraetapaid,_xmsbs_ur_value,_ownerid_value,createdon";
		query += "&$filter=_xmsbs_caso_value eq '" + idCaso + "'";
		query += "&$orderby=createdon desc";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
    buscarUrActualCaso: function (executionContext,idCaso){
		var entityType = "incidents";
		var entityId = idCaso;
		var query = "_xmsbs_ur_value";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
};

parent.getContextPopUp = function (){
	return BotonRibbonCaso.Context.ExecutionContext;
};

parent.getContextPopUp2 = function (){
	return BotonRibbonCaso.Context.ExecutionContext;
};