//ReversoCastigo en Santander

if (typeof (ReversoCastigo) == "undefined")
{
	ReversoCastigo = {
		__namespace: true
	};
}

ReversoCastigo = {

    URL: {        
        Azure: "",
        Name: "AzureURL"
    },
	
	ApiKey: {
        Key: "",
        Name: "AuthApi"
    },

    estadoForm: function(executionContext){
        var tipoFormulario = executionContext.ui.getFormType();
        return tipoFormulario;
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
	
    Usuario: {
        Administrador: "Dynamics_CRM_MIDAS_CL_DEV"
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
        SantanderRobot: ["ba91d248-3b4d-ec11-8c62-000d3adf561c",
						"eb7e4415-ff4d-4993-afea-14276aa59d48",
						"c84087af-f634-4f29-b690-37fa8934f0b8",
						"fc44e714-02df-4c7c-b6f3-3b973b2fd34d",
						"c366b7d4-a8e8-44ec-9c1b-d36317a628f3",
						"9de0af6b-0abf-41b8-adf0-d3abe4ab469d",
						"58b789e4-62d5-446b-93bb-e6d34024c3fd"]
    },
	
	onLoad:function(executionContext,origen){
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();	

        ReversoCastigo.setApiKey(executionContext);
        ReversoCastigo.setAzureURL(executionContext);
		
		//debugger;
        if (tipoFormulario == '1'){
            //El formulario recién se está creando, por lo que consultamos por los valores
            var respuesta = ReversoCastigo.buscaValoresMonedaSantander(executionContext);
            if(respuesta && respuesta.valorDolar && respuesta.valorUF){
                var valorDolar = respuesta.valorDolar;
                var valorUF = respuesta.valorUF;
                
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_valordolar", parseFloat(valorDolar));
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_valoruf", parseFloat(valorUF));
            }
            else{
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "No se ha obtenido valores moneda", text: "No se ha podido obtener los valores de moneda del día. Favor intentar en unos minutos. La ventana se cerrará"};
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.formClose(executionContext);
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
			
			//Oculto la ficha de Observaciones
			formContext.ui.tabs.get("tab_5").setVisible(false); 
            
            //Vemos si es de creación manual para ir por flujo alternativo
            var casoID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_casorelacionado");
            if(!casoID){
                //No hay caso, asi que es manual
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_creacionmanual", true);
                
                //Ocultamos la sección de datos rapidos del cliente y caso
                executionContext.getFormContext().ui.tabs.get("general").sections.get("infoCasoCliente").setVisible(false);
                
                //Pedimos el ingreso del rut
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_rutcliente");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_rutcliente", "required");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_rutcliente");
                
                //Pedimos el ingreso del numero de caso sac
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_ndecasosac");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ndecasosac", "required");
                JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_ndecasosac");
                
                //ocultamos la sección de gestión
                formContext.ui.tabs.get("tab_4").setVisible(false); 
				
				//Actualizo la Validacion Responsable de forma automatica
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_repararejecutivo", 1);
				
            }
            
            //Por la solicitud de quitar 3 opciones del campo Plataforma, se agrega JS que los oculta en creación
            formContext.getControl("xmsbs_plataforma").removeOption(2);
            formContext.getControl("xmsbs_plataforma").removeOption(3);
            formContext.getControl("xmsbs_plataforma").removeOption(4);
        }
        
        var esManual = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_creacionmanual", null);
        if(esManual != true){ //si es no o vacío
            //vemos si es masivo primero. Si es masivo, debe ocultar todo menos los valores de ingreso de monedas.
            var tipoReclamo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodereclamo", null);
            var quebrantoGSC = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_quebrantogsc", null);
            if(tipoReclamo == 657130001 && !quebrantoGSC){
                //Significa que es de masivos sin GSC. Por lo tanto, debemos ocultar y quitar obligatoriedad de todo menos las monedas
                ReversoCastigo.ocultaTodoMenosIngresoMonedas(executionContext, formContext);
            }
            else{
                //Significa que es de Formales o bien, de masivos con GSC. Debe mostrar formulario completo y flujo completo
                var esAdquirencia = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_esquebrantoadquirencia", null);
                if(!esAdquirencia){
                    //No es adquirencia, por lo que continuamos con lo que ya habia
                    var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
                    debugger;
                    if(estado == 657130005 || estado == 657130006 || estado == 657130007){ // Si está aprobado o rechazado, se muestra el tab de gestión
                        executionContext.getFormContext().ui.tabs.get("tab_4").setVisible(true); //Tab de Gestión
                        
                        //obtenemos la opción de aprobación para ver que se muestra
                        if(estado != 657130007){
                            //No esta en gestión aun, por lo que solo se hace la lógica del tab
                            ReversoCastigo.onload_estadoAprobacion(executionContext);
                        }
                        else{
                            //ya está en gestión, por lo que podemos ocultar la sección del reparo
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_repararejecutivo");
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_comentariosdereparo");
                        }
                        
                        var reparaAprueba = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_repararejecutivo", null);
                        if(estado == 657130005 && reparaAprueba == 1){
                            JumpStartLibXRM.Fx.enableOrDisableAllControlsInTab(executionContext, "general", true);
                        }
                    }
                    
                    if(estado == 657130001){ // Si está rechazado, mostramos los comentarios de rechazo
                        executionContext.getFormContext().ui.tabs.get("general").sections.get("supervisor").setVisible(true);
                    }
                    else{
                        executionContext.getFormContext().ui.tabs.get("general").sections.get("supervisor").setVisible(false);
                    }
                    
                    //Llamamos a la función para validar Producto y mostrar campos específicos al producto
                    ReversoCastigo.onchange_Producto(executionContext);
                }
                else{
                    //Es adquirencia, por lo que ocultamos el tab de aprobaciones y mostramos el de gestión
                    executionContext.getFormContext().ui.tabs.get("tab_3").setVisible(false);
                    executionContext.getFormContext().ui.tabs.get("tab_4").setVisible(true);
                    
                    //En el tab de gestión, solo dejamos la de ejecución y estado
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_urquebrantoasignada");
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_usuariourquebranto");
                }
            }
        } 
        else{
             //Mostramos el campo Rut 
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_rutcliente");
            
            //Mostramos el campo numero de caso sac
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_ndecasosac");
            
            //Ocultamos la sección de datos rapidos cliente y caso
            executionContext.getFormContext().ui.tabs.get("general").sections.get("infoCasoCliente").setVisible(false);
            
            //Ocultamos el tab de aprobaciones
            executionContext.getFormContext().ui.tabs.get("tab_3").setVisible(false);
            
            //Mostramos el tab gestión y la lógica de completitud de campos
            var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
            if(estado == 657130005){ // Si está aprobado, se muestra el tab de gestión
                executionContext.getFormContext().ui.tabs.get("tab_4").setVisible(true); //Tab de Gestión
                ReversoCastigo.onload_estadoAprobacion(executionContext);
                
                var reparaAprueba = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_repararejecutivo", null);
                if(estado == 657130005 && reparaAprueba == 1){
                    JumpStartLibXRM.Fx.enableOrDisableAllControlsInTab(executionContext, "general", true);
                }
                
                executionContext.getFormContext().ui.tabs.get("general").sections.get("SubirDocumentosQuebranto").setVisible(true);
            }
            
            if(estado == 657130001){ // Si está rechazado, mostramos los comentarios de rechazo
                executionContext.getFormContext().ui.tabs.get("general").sections.get("supervisor").setVisible(true);
            }
            else{
                executionContext.getFormContext().ui.tabs.get("general").sections.get("supervisor").setVisible(false);
            }
            
            //ocultamos el tab de bitácora de observaciones
            executionContext.getFormContext().ui.tabs.get("tab_5").setVisible(false);
        }
    },

    setApiKey: function(executionContext){
        //debugger;        
		var resultado = Util.buscarValorParametro(executionContext, ReversoCastigo.ApiKey.Name);
        
        if(resultado)
        {
            ReversoCastigo.ApiKey.Key = resultado;
        }
	},
    
    setAzureURL: function(executionContext){
        //debugger;
		var resultado = Util.buscarValorParametro(executionContext, ReversoCastigo.URL.Name);
        
        if(resultado)
        {
            ReversoCastigo.URL.Azure = resultado;
        }
	},

    sumaReversos:function(executionContext){
        //Primero obtenemos todos los valores
        var intereses = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_intereses", null);
        if(!intereses){intereses = 0;}
        
        var comisiones = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_comisiones", null);
        if(!comisiones){comisiones = 0;}
        
        var interesesganados = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_interesesganados", null);
        if(!interesesganados){interesesganados = 0;}
        
        //Luego, vemos si todas las monedas son iguales: Peso = 1, USD = 2
        var monedaIntereses = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_monedaintereses", null);
        var monedaComisiones = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_monedacomisiones", null);
        var monedaInteresesGanados = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_monedainteresesganados", null);
        
        if(monedaIntereses == monedaComisiones && monedaComisiones == monedaInteresesGanados){
            //Son todas iguales. Vemos si la moneda es peso o USD
            if(monedaIntereses == 1){
                //Es peso, el totalizador debe ser en peso
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_monedatotalreverso", 1);
            }
            else{
                //Es dolar, el totalizador debe ser en dolar
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_monedatotalreverso", 2);
            }
            
            var totalreversos = intereses + comisiones + interesesganados;
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalreverso", totalreversos);
            
            //Finalmente, actualizamos el valor TotalReversoUF convertido a UF
            var valorUF = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_valoruf", null);
            
            //Vemos si la moneda es peso o USD
            if(monedaIntereses == 1){
                //Es peso, el totalizador debe ser en peso
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalreversouf", totalreversos / valorUF);
            }
            else{
                //Es dolar, el totalizador debe ser en dolar
                var valorDolar = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_valordolar", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalreversouf", totalreversos * valorDolar / valorUF);
            }
        }
        else{
            //Como hay una moneda distinta, todo se debe convertir a peso.
            var valorEnPeso = 0;
            var valorDolar = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_valordolar", null);
            
            //Preguntamos por los Intereses
            if(monedaIntereses == 1){
                valorEnPeso = valorEnPeso + intereses;
            }
            else{
                intereses = intereses * valorDolar;
                valorEnPeso = valorEnPeso + intereses;
            }
            
            //Preguntamos por las Comisiones
            if(monedaComisiones == 1){
                valorEnPeso = valorEnPeso + comisiones;
            }
            else{
                comisiones = comisiones * valorDolar;
                valorEnPeso = valorEnPeso + comisiones;
            }
            
            //Preguntamos por los Intereses Ganados
            if(monedaInteresesGanados == 1){
                valorEnPeso = valorEnPeso + interesesganados;
            }
            else{
                interesesganados = interesesganados * valorDolar;
                valorEnPeso = valorEnPeso + interesesganados;
            }
            
            //Ahora seteamos en el totalizador el valorEnPeso
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_monedatotalreverso", 1);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalreverso", valorEnPeso);
            
            //Finalmente, actualizamos el valor TotalReversoUF convertigo de peso a UF
            var valorUF = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_valoruf", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalreversouf", valorEnPeso / valorUF);
        }
        
        //Totalizamos el monto total en pesos
        ReversoCastigo.sumaTotalReversosCastigosPesos(executionContext);
    },

    sumaCastigos:function(executionContext){       
        //Primero obtenemos todos los valores
        var castigoComercial = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_castigocomercial", null);
        if(!castigoComercial){castigoComercial = 0;}
        
        var castigoOperativo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_castigooperativo", null);
        if(!castigoOperativo){castigoOperativo = 0;}
        
        //Luego, vemos si todas las monedas son iguales: Peso = 1, USD = 2
        var monedaCastigoComercial = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_monedacastigocomercial", null);
        var monedaCastigoOperativo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_monedacastigooperativo", null);
        
        if(monedaCastigoComercial == monedaCastigoOperativo){
            //Son todas iguales. Vemos si la moneda es peso o USD
            if(monedaCastigoComercial == 1){
                //Es peso, el totalizador debe ser en peso
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_monedatotalcastigo", 1);
            }
            else{
                //Es dolar, el totalizador debe ser en dolar
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_monedatotalcastigo", 2);
            }
            
            var totalCastigos = castigoComercial + castigoOperativo;
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalcastigo", totalCastigos);
            
            //Finalmente, actualizamos el valor TotalReversoUF convertido a UF
            var valorUF = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_valoruf", null);
            
            //Vemos si la moneda es peso o USD
            if(monedaCastigoComercial == 1){
                //Es peso, el totalizador debe ser en peso
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalcastigouf", totalCastigos / valorUF);
            }
            else{
                //Es dolar, el totalizador debe ser en dolar
                var valorDolar = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_valordolar", null);
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalcastigouf", totalCastigos * valorDolar / valorUF);
            }
        }
        else{
            //Como hay una moneda distinta, todo se debe convertir a peso.
            var valorEnPeso = 0;
            var valorDolar = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_valordolar", null);
            
            //Preguntamos por el Castigo Comercial
            if(monedaCastigoComercial == 1){
                valorEnPeso = valorEnPeso + castigoComercial;
            }
            else{
                castigoComercial = castigoComercial * valorDolar;
                valorEnPeso = valorEnPeso + castigoComercial;
            }
            
            //Preguntamos por el Castigo Operativo
            if(monedaCastigoOperativo == 1){
                valorEnPeso = valorEnPeso + castigoOperativo;
            }
            else{
                castigoOperativo = castigoOperativo * valorDolar;
                valorEnPeso = valorEnPeso + castigoOperativo;
            }
            
            //Ahora seteamos en el totalizador el valorEnPeso
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_monedatotalcastigo", 1);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalcastigo", valorEnPeso);
            
            //Finalmente, actualizamos el valor TotalReversoUF convertigo de peso a UF
            var valorUF = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_valoruf", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalcastigouf", valorEnPeso / valorUF);
        }
        
        //Totalizamos el monto total en pesos
        ReversoCastigo.sumaTotalReversosCastigosPesos(executionContext);
    },
    
    onchange_usuarioUrQuebranto: function (executionContext){
        debugger;
        var IDurquebrantointegrante = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_usuariourquebranto");
        if(IDurquebrantointegrante){
            if (IDurquebrantointegrante.indexOf("{") > -1){IDurquebrantointegrante = IDurquebrantointegrante.substring(1, 37);}
            var respuesta = ReversoCastigo.buscaDatosIntegrante(executionContext, IDurquebrantointegrante);
            if(respuesta){
                //Completamo el tipo de requerimiento
                var usuarioID = respuesta.xmsbs_usuario.systemuserid;
                var usuarioName = respuesta.xmsbs_usuario.fullname;
                //actualizar campo tipo Requerimiento
                var fieldName = "xmsbs_usuarioasignado";
                var id = usuarioID;
                var name = usuarioName;
                var entityType = "systemuser";
                JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
            }
        }
    },

	//=================
	//FUNCIONES BOTONES
	//=================
    
	
    enableButtonAprobar: function (executionContext){
        var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
        if(estado == 657130000){ //En aprobación supervisor
            return false;
        }
        else
        {
            var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext,"Administrador del sistema");
            if(asAdmin)
            {
                return false;
            }
            else
            {
                return false;
            }
        }
    },
    
	onClickButtonAprobar: function (executionContext) {
		var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Aprobación", subtitle:"Va a aprobar el Reverso y Castigo. ¿Desea continuar?"};
        var confirmOptions  = { height: 200, width: 260 };
        Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
            function (success) {
                if(success.confirmed){
                    //Si confirma
                    //Marco el registro como aprobado 
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aprobarreversocastigo", true);
                    
                    //Guardamos el cambio
                    JumpStartLibXRM.Fx.formSave(executionContext);

                    ReversoCastigo.onLoad(executionContext, "formulario");
                }
                else{
                    //Si cancela
                }
            },
            function (error) {
                //console.log(error.message);
            }
        );
	},		
    
	enableButtonRechazar: function (executionContext){
		var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
        if(estado == 657130000){ //En aprobación supervisor
            return false;
        }
        else
        {
            var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext,"Administrador del sistema");
            if(asAdmin)
            {
                return false;
            }
            else
            {
                return false;
            }
        }
	},
    
	onClickButtonRechazar: function (executionContext) {
        var comentario = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_comentariosupervisor", null);
        if(comentario){
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Rechazar", subtitle:"Va a rechazar el Reverso y Castigo. ¿Desea continuar?"};
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed){
                        //Si confirma
                        //Marco el registro como rechazado 
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rechazarreversocastigo", true);
                        
                        //Marcamos el flag de solicitar para que lo pueda volver a solicitar
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_solicitaraprobacion", false);
                        
                        //Guardamos el cambio
                        JumpStartLibXRM.Fx.formSave(executionContext);

                        ReversoCastigo.onLoad(executionContext,"formulario");
                    }
                    else{
                        //Si cancela
                    }
                },
                function (error) {
                    //console.log(error.message);
                }
            );
        }
        else{
            alert("Debe ingresar observaciones de reparo");
        }
		
	},

    enableButtonSolicitarAprobacion: function (executionContext){
        var estadoForm = ReversoCastigo.estadoForm(executionContext);
        if(estadoForm == 1){
            return false;
        }
        else{
            var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
            if(estado == 1 || estado == 657130001){ //Creación o En Reparo
                return false;
            }
            else
            {
                var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext,"Administrador del sistema");
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
	},
    
    enableTerminarSinGestion: function (executionContext){
        var estadoForm = ReversoCastigo.estadoForm(executionContext);
        if(estadoForm == 1){
            return false;
        }
        else{
            var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
            if(estado == 1 || estado == 657130001){ //Creación o En Reparo
                return true;
            }
            else
            {
                return false;
            }
        }
	},
    
    terminarSinGestion: function (executionContext) {
		var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Terminar sin Gestión", subtitle:"Va a terminar sin gestión el Quebranto. ¿Desea continuar?"};
        var confirmOptions  = { height: 200, width: 260 };
        Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
            function (success) {
                if(success.confirmed){
                    //Si confirma

                    //Marco el registro como rechazado 
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_terminarsingestion", true);
                    
                    //Guardamos el cambio
                    JumpStartLibXRM.Fx.formSave(executionContext);
                    
                    ReversoCastigo.onLoad(executionContext,"formulario");
                }
                else{
                    //Si cancela
                }
            },
            function (error) {
                //console.log(error.message);
            }
        );
	},
    
    onClickSolicitarAprobacion: function (executionContext) {
		var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Solicitar Aprobación", subtitle:"Va a solicitar la aprobación del supervisor. ¿Desea continuar?"};
        var confirmOptions  = { height: 200, width: 260 };
        Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
            function (success) {
                if(success.confirmed){
                    //Si confirma

                    //Marco el registro como rechazado 
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_solicitaraprobacion", true);
                    
                    //Guardamos el cambio
                    JumpStartLibXRM.Fx.formSave(executionContext);
                    
                    ReversoCastigo.onLoad(executionContext,"formulario");
                }
                else{
                    //Si cancela
                }
            },
            function (error) {
                //console.log(error.message);
            }
        );
	},
    
    enableButtonSolicitarAutorizaciones: function (executionContext){
		 var estadoForm = ReversoCastigo.estadoForm(executionContext);
        if(estadoForm == 1){
            return false;
        }
        else{
            var esAdquirencia = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_esquebrantoadquirencia", null);
            var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
            if((estado == 1 || estado == 657130001) && esAdquirencia == false){ //Creación o En Reparo
                return true;
            }
            else
            {
                var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext,"Administrador del sistema");
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
	},

    onClickSolicitarAutorizaciones: function (executionContext) {
        var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);
        var observaciones = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_observacioneslectura", null);
        var respuesta = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_comentariosupervisor", null);
        
        if((estado == 657130001 || estado == 657130006) && observaciones && !respuesta){
            var alertStrings = { confirmButtonLabel: "Aceptar", text: "Debe ingresar una respuesta al reparo", title: "Respuesta Reparo" };
            var alertOptions = { height: 120, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function (success) {
                    //var formContext = executionContext.getFormContext();
                    executionContext.getControl("xmsbs_comentariosupervisor").setFocus();
                },
                function (error) {
                    //console.log(error.message);
                }
            );
        }
        else{
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Solicitar Autorizaciones", subtitle:"Va a solicitar autorizaciones de VB°. ¿Desea continuar?"};
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed){
                    
                        debugger;
                        //Si confirma
                        var totalReverso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_totalreversouf", null);
                        var totalCastigo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_totalcastigouf", null);
                        var parametroBusqueda = "";
                        
                        if(totalReverso == 0 && totalCastigo > 0){
                            //Buscamos autorizador solo como castigo
                            parametroBusqueda = "Castigo";
                        }
                        else{
                            if(totalReverso > 0 && totalCastigo == 0){
                                //Buscamos autorizador solo como reverso
                                parametroBusqueda = "Reverso";
                            }
                            else{
                                if(totalReverso > 0 && totalCastigo > 0){
                                    //Buscamos autorizador solo como mixto
                                    parametroBusqueda = "Mixto";
                                }
                            }
                        }
                        
                        //vemos si es de creación manual
                        var esManual = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_creacionmanual", null);
                        
                        //Hacemos la consulta que otiene los autorizadores
                        var respuesta = ReversoCastigo.obtenerAutorizadores(executionContext, totalCastigo, totalReverso, parametroBusqueda);
                        if(respuesta){
                            if(respuesta.value.length > 0 && !esManual){
                                //Hay aprobadores por monto, por lo que se deben crear los registros de autorización
                                for (var i = 0; i < respuesta.value.length; i++){
                                    var usuarioAutorizadorID = respuesta.value[i]._xmsbs_usuario_value;
                                    ReversoCastigo.crearAutorizadores(executionContext, usuarioAutorizadorID);
                                }
                                
                                //Marcamos que las autorizaciones fueron solicitadas
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_solicitarautorizaciones", true);
                            }
                            else{
                                //No hay aprobadores por monto, por lo que debe quedar aprobado para que se asigne directo
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_apruebadirecto", true);
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_repararejecutivo", null);
                            }
                            
                            //Marcamos el campo de pausa en sí, el cual gatilla flujo que valida si es quebranto especial GSC para pausar la bitácora de etapa del ejecutivo
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_pausaslabitacoraetapa", true);
                        }
                        
                        //Actualizamos el total de aprobaciones pedidas
                        if(respuesta){
                            if(respuesta.value.length > 0 && !esManual){
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalaprobacionessolicitadas", respuesta.value.length);
                            }
                            else{
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalaprobacionessolicitadas", 0);
                            }
                        }
                        else{
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalaprobacionessolicitadas", 0);
                        }
                        
                        //Actualizamos dejamos los contadores en 0
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalaprobacionesrecibidas", 0);
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalrechazosrecibidos", 0);
                        
                        //Guardamos el cambio
                        JumpStartLibXRM.Fx.formSave(executionContext);
                        
                        ReversoCastigo.onLoad(executionContext, "formulario");
                    }
                    else{
                        //Si cancela
                    }
                },
                function (error) {
                    //console.log(error.message);
                }
            );
        }
	},
	
   enableButtonAutoAsignarse: function (executionContext){
        debugger;
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		var idPropietario = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
		var idUsuario = JumpStartLibXRM.Fx.getUserId();
		
        if (idPropietario.indexOf("{") > -1)idPropietario = idPropietario.substring(1, 37);
        if (idUsuario.indexOf("{") > -1)idUsuario = idUsuario.substring(1, 37);		

		if (estado == '2' || estado == '3'){   
            let array = new Array ();
            ReversoCastigo.RolesArray.SystemUser.forEach( 
                function (x){
                    array.push(x);
                }
            );
            ReversoCastigo.RolesArray.SantanderRobot.forEach( 
                function (x){
                    array.push(x);
                });

            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
			
			if(idPropietario.toLowerCase() == idUsuario.toLowerCase()){
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
	
	onClickButtonAutoAsignarse: function (executionContext){
        debugger;
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
        var usuario = JumpStartLibXRM.Fx.getUserName();
        if (idUsuario.indexOf("{") > -1)
            idUsuario = idUsuario.substring(1, 37);
		
		//Dynamics_CRM_MIDAS_CL_DEV
		var usuarioAdministrador = ReversoCastigo.buscarUsuarioAdministrador(executionContext);		

		var Validacion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_repararejecutivo", null);
		var RazonEstado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);

		if(Validacion == null && RazonEstado == 657130005){
			var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Información", subtitle:"Va a auto-asignarse el Quebranto. ¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos"};
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
						var QuebrantoId = JumpStartLibXRM.Fx.getEntityId(executionContext);
						if (QuebrantoId.indexOf("{") > -1){QuebrantoId = QuebrantoId.substring(1, 37);}
						
						var entity = "xmsbs_reversocastigos";
						var objeto = {};
						objeto["ownerid@odata.bind"] = "/systemusers("+idUsuarioAsignar+")";           
						//objeto["xmsbs_ur@odata.bind"] = "/xmsbs_unidadresolutoras("+idUR+")";           
						var resultado = SDK.WEBAPI.updateRecordImpersonate(executionContext, QuebrantoId, objeto, entity, idUsuarioImpersonar, null, null);
						
						//guarda
                        JumpStartLibXRM.Fx.formSave(executionContext);
                        
                        //Refresca
						setTimeout(function () {
							Xrm.Utility.openEntityForm("xmsbs_reversocastigo", QuebrantoId);
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
		else{
			var alertStrings = { confirmButtonLabel: "Aceptar", title: "Información", text: "El Quebranto debe estar Aprobado y sin Validación Responsable, para poder Auto-Asignarlo"};
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
	},  		
		
    buscarUsuarioAdministrador: function (executionContext){
		var entityType = "systemuser";
		var query = "$select=fullname";
		query += "&$filter=fullname eq '" + ReversoCastigo.Usuario.Administrador + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},			
    
    sumaTotalReversosCastigosPesos:function(executionContext){
        //Reverso
        var totalReverso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_totalreverso", null);
        if(!totalReverso){totalReverso = 0;}
        var monedaReverso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_monedatotalreverso", null);
        if(monedaReverso == 2){
            var valorDolar = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_valordolar", null);
            totalReverso = totalReverso * valorDolar;
        }
        
        //Castigo
        var totalCastigo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_totalcastigo", null);
        if(!totalCastigo){totalCastigo = 0;}
        var monedaCastigo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_monedatotalcastigo", null);
        if(monedaCastigo == 2){
            var valorDolar = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_valordolar", null);
            totalCastigo = totalCastigo * valorDolar;
        }
        
        var totalReversoCastigoPesos = totalCastigo + totalReverso;
        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_totalreversoconcastigopesos", totalReversoCastigoPesos);
    },
    

    obtenerAutorizadores: function (executionContext, montoTotalCastigo, montoTotalReverso, parametroBusqueda)
	{
        debugger;
		var entityType = "xmsbs_autorizadoresreversocastigos";
		var query = "$select=_xmsbs_usuario_value,xmsbs_name,_xmsbs_backup_value";
        
        var tipoReclamo = "657130000";
        var tipoReclamoQuebranto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodereclamo", null);
        if(tipoReclamoQuebranto == "657130002"){
            tipoReclamo = tipoReclamoQuebranto;
        }
        
        if(parametroBusqueda == "Castigo"){
            query += "&$filter=(xmsbs_tipodequebranto eq 2 and xmsbs_tipodereclamo eq "+tipoReclamo+" and xmsbs_atribucioncastigodesde lt "+ montoTotalCastigo +" and xmsbs_atribucioncastigohasta ge "+ montoTotalCastigo +")&$orderby=xmsbs_name asc";
        }
        
        if(parametroBusqueda == "Reverso"){
            query += "&$filter=(xmsbs_tipodequebranto eq 1 and xmsbs_tipodereclamo eq "+tipoReclamo+" and xmsbs_atribucionreversodesde lt "+ montoTotalReverso +" and xmsbs_atribucionreversohasta ge "+ montoTotalReverso +")&$orderby=xmsbs_name asc";
        }
        
        if(parametroBusqueda == "Mixto"){
            var total = montoTotalCastigo + montoTotalReverso;
            total = total.toFixed(10);
            query += "&$filter=(xmsbs_tipodequebranto eq 3 and xmsbs_tipodereclamo eq "+tipoReclamo+" and xmsbs_reversocastigodesde lt "+total+" and xmsbs_reversocastigohasta ge "+total+")&$orderby=xmsbs_name asc";
        }
        
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},

    crearAutorizadores: function (executionContext, usuarioAutorizadorID)
    {
        //Preparamos los campos
        if (usuarioAutorizadorID.indexOf("{") > -1){usuarioAutorizadorID = usuarioAutorizadorID.substring(1, 37);}
        var reversoCastigoID = JumpStartLibXRM.Fx.getEntityId(executionContext);
        if (reversoCastigoID.indexOf("{") > -1){reversoCastigoID = reversoCastigoID.substring(1, 37);}
        
        var CasoID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_casorelacionado");
        if (CasoID.indexOf("{") > -1){CasoID = CasoID.substring(1, 37);}

        //Creamos el objeto
        var objeto = {};
        objeto["xmsbs_reversoycastigoasociado@odata.bind"] = "/xmsbs_reversocastigos(" + reversoCastigoID + ")";
        objeto["xmsbs_usuarioautorizador@odata.bind"] = "/systemusers("+ usuarioAutorizadorID +")";
        objeto["ownerid@odata.bind"] = "/systemusers("+ usuarioAutorizadorID +")";
        objeto["xmsbs_caso@odata.bind"] = "/incidents("+ CasoID +")";
        
        
        //Entidad
        var entity = "xmsbs_solicitudautorizacionreversocastigo";
        
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

    buscaValoresMonedaSantander:function(executionContext){
        debugger;
        var respuesta = null;
        var ApiUrlDivisa = "/Santander/GetValorDolarUF";
        var service = ReversoCastigo.GetRequestObject();
        if (service != null)
        {
            service.open("GET", ReversoCastigo.URL.Azure + ApiUrlDivisa, false);
            service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
            service.setRequestHeader("Accept", "application/json,text/javascript, */*");
            service.setRequestHeader(ReversoCastigo.ApiKey.Name, ReversoCastigo.ApiKey.Key);
            service.send(null);
            if (service.response != "") 
            {
                response = JSON.parse(service.response);
            }
        }
        
        if (response.success)
        {
            respuesta = {valorDolar:response.valorDolar, valorUF:response.valorUF};
        }       
        
        return respuesta;
    },

    buscaDatosIntegrante: function (executionContext, IDurquebrantointegrante)
    {
        //Preparamos la consulta
        var entityType = "xmsbs_urquebrantointegranteses";
        var entityId = IDurquebrantointegrante;
        var query = "xmsbs_usuario";
        var expand = "xmsbs_usuario($select=systemuserid,fullname)";
        //realizamos la consulta
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
        return resultado;
    },

    analistaApruebaRechazaQuebranto: function (executionContext){
        //Función que muestra u oculta campos según la opción elegida
        var reparaAprueba = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_repararejecutivo", null);
        if(reparaAprueba != 1 && reparaAprueba != 2){
            //El campo está vacío, asi que se oculta las observaciones y la sección de reparo
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_comentariosdereparo");
            executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_1").setVisible(false);
            executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_4").setVisible(false);
        }
        else{
            if(reparaAprueba == 1){
                //Va a aprobar, se solicita confirmación
                var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Aprobación", subtitle:"Va a aprobar la información del Quebranto. ¿Desea continuar?", text: "Luego de la aprobación, podrá generar Solicitudes de Ejeución si corresponde"};
                var confirmOptions  = { height: 200, width: 260 };
                Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                    function (success) {
                        if(success.confirmed)
                        {
                            //Si confirma
                            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_comentariosdereparo");
                            executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_1").setVisible(false);
                            executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_4").setVisible(true);
                            
                            //Ya se aprobó, se deshabilita el campo
                            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_repararejecutivo");
                            
                            //bloquea los campos de ingreso
                            JumpStartLibXRM.Fx.enableOrDisableAllControlsInTab(executionContext, "general", true);
                            
                            //Se guarda
                            JumpStartLibXRM.Fx.formSave(executionContext);
                        }
                        else
                        {
                            //Si cancela
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_repararejecutivo", null);
                        }
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
            else{
                //Se quiere reparar, se muestran las observaciones
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_comentariosdereparo");
                executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_1").setVisible(false);
                executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_4").setVisible(false);
            }
        }
    },
    
    onload_estadoAprobacion: function (executionContext){
        var reparaAprueba = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_repararejecutivo", null);
        if(reparaAprueba != 1 && reparaAprueba != 2){
            //El campo está vacío, asi que se oculta las observaciones y la sección de reparo
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_comentariosdereparo");
            executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_1").setVisible(false);
            executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_4").setVisible(false);
        }
        else{
            if(reparaAprueba == 1){
                //sta aprobado, se muestra la sección de ejecución
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_comentariosdereparo");
                executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_1").setVisible(false);
                executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_4").setVisible(true);
                
                //Ya se aprobó, se deshabilita el campo
                JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_repararejecutivo");
            }
            else{
                //Esta en reparo, se muestran las observaciones
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_comentariosdereparo");
                executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_1").setVisible(false);
                executionContext.getFormContext().ui.tabs.get("tab_4").sections.get("tab_4_section_4").setVisible(false);
            }
        }
    },

    onChange_fechaCargoCierre: function (executionContext) {
        //debugger;
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaCargo = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_fechadecargoocierre", null);
        if(fechaCargo){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaCargo.setDate(fechaCargo.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha de cargo no puede ser mayor al día de hoy", title: "Fecha de caducidad invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,"xmsbs_fechadecargoocierre", null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,"xmsbs_fechadecargoocierre");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
    
    ocultaTodoMenosIngresoMonedas:function(executionContext, formContext){
        JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_sindevolucion");
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_sindevolucion", "none");
        
        JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_plataforma");
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_plataforma", "none");
        
        JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_producto");
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_producto", "none");
        
        JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_numerodecontrato");
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_numerodecontrato", "none");
        
        //JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_origendelerror");
        //JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_origendelerror", "none");
        
        JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_causaraizdelquebranto");
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_causaraizdelquebranto", "none");
        
        JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_fechadecargoocierre");
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_fechadecargoocierre", "none");
        
        JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_resumendelreclamo");
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_resumendelreclamo", "none");
        
        formContext.ui.tabs.get("tab_5").setVisible(false); 
        formContext.ui.tabs.get("tab_4").setVisible(false); 
        formContext.ui.tabs.get("tab_3").setVisible(false);
        
        executionContext.getFormContext().ui.tabs.get("general").sections.get("supervisor").setVisible(false);
    },
    
    onchange_Producto: function (executionContext) {
        //Ya está validado si es de formales o GSC, dado que se llama desde el paso onLoad que lo valida.
        
        var valorProducto = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_producto", null);
        var ur = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_unidadresolutora", null);
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        
        //Si el formulario es != de 1 (edición) y producto es 1, 2 o 3 y UR es vacío -> Se creó antes de la activación por lo que valorProducto = ""
        if (tipoFormulario != '1' && (valorProducto == 1 || valorProducto == 2 || valorProducto == 3) && !ur){
            //Ocultamos los nuevos campos ya que el registro se creó antes de la activación 12-06-2023 a las 09:50
            valorProducto = "";
        }
        
         if (tipoFormulario != '1' && valorProducto){
        	//Desactivamos el campo de producto luego de la creacion para que no se pueda modificar. 20250114/LZ
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_producto");
        }       
        
        if(valorProducto){    
            //Si tiene valor, validamos cual valor es para mostrar unos y ocultar otros
            if(valorProducto == 1 || valorProducto == 2){
                //Si es cuenta corriente o Cuenta vista
                //Muestra UR, Tipo Operación, codigo reverso, codigo sucursal, n cuenta para abono
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_unidadresolutora");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_unidadresolutora", "required");

                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_tipodeoperacion");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_tipodeoperacion", "required");

                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_codigoreverso");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_codigoreverso", "required");

                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_codigosucursal");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_codigosucursal", "required");

                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_ncuentacorrienteparaabono");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ncuentacorrienteparaabono", "required");

                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_centrodecosto");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_centrodecosto", "none");

                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tipodecargo");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_tipodecargo", "none");

                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_fechadecargo");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_fechadecargo", "none");
                
                //Antes se mostraba. Pero ahora dejamos el valor en TRUE, pero oculto.
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_cuentacorresponderut");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_cuentacorresponderut", "none");
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_cuentacorresponderut", true);
                
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_numerodeproducto");
                JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_numerodeproducto", "none");
            }
            else{
                if(valorProducto == 3){
                    //Si es Tarjeta de Crédito
                    //Muestra UR, Tipo Operación, centro costo, tipo cargo, fecha cargo y oculta lo demas
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_unidadresolutora");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_unidadresolutora", "required");

                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_tipodeoperacion");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_tipodeoperacion", "required");

                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_codigoreverso");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_codigoreverso", "none");

                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_codigosucursal");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_codigosucursal", "none");

                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_ncuentacorrienteparaabono");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ncuentacorrienteparaabono", "none");

                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_centrodecosto");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_centrodecosto", "required");

                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_tipodecargo");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_tipodecargo", "required");

                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_fechadecargo");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_fechadecargo", "required");
                    
                    //Antes se mostraba. Pero ahora dejamos el valor en TRUE, pero oculto.
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_cuentacorresponderut");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_cuentacorresponderut", "none");
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_cuentacorresponderut", true)
                    
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_numerodeproducto");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_numerodeproducto", "required");
                }
                else{
                    //No es ninguno de esos valores, ocultamos todo
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_unidadresolutora");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_unidadresolutora", "none");

                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tipodeoperacion");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_tipodeoperacion", "none");

                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_codigoreverso");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_codigoreverso", "none");

                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_codigosucursal");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_codigosucursal", "none");

                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_ncuentacorrienteparaabono");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ncuentacorrienteparaabono", "none");

                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_centrodecosto");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_centrodecosto", "none");

                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tipodecargo");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_tipodecargo", "none");

                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_fechadecargo");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_fechadecargo", "none");
                    
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_cuentacorresponderut");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_cuentacorresponderut", "none");
                    
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_numerodeproducto");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_numerodeproducto", "none");
                }
            }
        }
        else{
            //Aun no hay nada elegido. Se ocultan todos los nuevos campos
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_unidadresolutora");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_unidadresolutora", "none");

            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tipodeoperacion");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_tipodeoperacion", "none");

            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_codigoreverso");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_codigoreverso", "none");

            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_codigosucursal");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_codigosucursal", "none");

            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_ncuentacorrienteparaabono");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ncuentacorrienteparaabono", "none");

            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_centrodecosto");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_centrodecosto", "none");

            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tipodecargo");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_tipodecargo", "none");

            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_fechadecargo");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_fechadecargo", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_cuentacorresponderut");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_cuentacorresponderut", "none");
            
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_numerodeproducto");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_numerodeproducto", "none");
        }
    },
};