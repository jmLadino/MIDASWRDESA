if (typeof(cargaMasiva) == "undefined") {
    cargaMasiva = {
        __namespace: true
    };    
}

cargaMasiva = {
	URL: {        
        Azure: "",
        Name: "AzureURL"
    },	
	ApiKey: {
        Key: "",
        Name: "AuthApi"
    },
	
//================
// RIBBON
//================	
	enabled_procesarArchivo: function (executionContext){
		
		// Solo estará visible si es Proceso E04
        var tipoFormulario = JumpStartLibXRM.Fx.getFormType(executionContext);
        if(tipoFormulario == JumpStartLibXRM.FormState.UPDATE)
        {
            var statuscode = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null); 
            if(statuscode != 1) // 1: Pendiente de procesar	
                return false;
			
			var TipoProceso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipoproceso", null); 
			if (TipoProceso != 657130007) // 657130007: Proceso E04
				return false;
	
			return true;
        }
		
        return false;
	},
	
	onclick_procesarArchivo: function (executionContext){
		cargaMasiva.ProcesarCargaMasiva(executionContext);
	},

//================
//FUNCIONES ONLOAD
//================
	onLoad_Formulario: function (executionContext) {
        debugger;
        var tipo_proceso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipoproceso", null); 
        switch(tipo_proceso){
			//Plataformas / Sucursales (TOTAL)
			case 657130004:
			//Plataformas / Sucursales (NOVEDADES)
			case 657130005:
			// Agentes / Jefes Zonales
			case 657130006:
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_filial");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_periodo");
				JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_tipoproceso");
				break;
			//Proceso E04
			case 657130007:
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_filial");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_periodo");
				JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_tipoproceso");
				break;
			default:
				break;
		}
                
        var file = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_archivocarga", null); 
        
        if(file != null){
          JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_archivocarga");
        }
	},
	
//==================
//FUNCIONES
//==================
	
    ProcesarCargaMasiva: function (executionContext){
		var strTitle = "Procesar Archivo";
		var strBody = "El procesamiento del Archivo de Carga Masiva puede tardar algunos segundos. \t¿Desea iniciar el proceso?";
		var strConfirmBtn = "Procesar Archivo";
		var strCancelBtn = "Cancelar";
			 
		var confirmStrings = { title: strTitle , text:strBody, confirmButtonLabel:strConfirmBtn, cancelButtonLabel:strCancelBtn};
		var confirmOptions = { height: 250, width: 500 };
		Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
		function (success) {   
			if (success.confirmed)
			{
				Xrm.Utility.showProgressIndicator("Procesando archivo...");
				try {
					//JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", 657130001); //En Proceso
					//formContext.data.entity.save();
					setTimeout(function () {
						
						var id = JumpStartLibXRM.Fx.getEntityId(executionContext).replace(/[{}]/g, "");
						var AzureURL = cargaMasiva.buscarAzureURL(executionContext); //AzureURL.value[0].xmsbs_valor
						var ApiKey = cargaMasiva.buscarApiKey(executionContext);     //ApiKey.value[0].xmsbs_valor
						var URL = AzureURL.value[0].xmsbs_valor + "CargaMasiva/EjecutaCargaMasiva/" + id;

						cargaMasiva.get(URL, ApiKey.value[0].xmsbs_valor, function (data) {
							if (data.success) {
								debugger;
								Xrm.Utility.closeProgressIndicator();
								//JumpStartLibXRM.Fx.openEntityForm("xmsbs_procesoe04s",id);
								
								var entityFormOptions = {};
								entityFormOptions["entityName"] = "xmsbs_cargamasiva";
								entityFormOptions["openInNewWindow"] = false;
								entityFormOptions["entityId"] = id;

								// Open the form.
								Xrm.Navigation.openForm(entityFormOptions).then(function (success) { console.log(success); }, function (error) { console.log(error); });
							}
							else {
								alert(data.message);
							}
						});
						
					}, 500);
				}
				catch (ex) {
					alert("Error al Procesar el Archivo, por favor comuníquese con un Administrador del Sistema.");
				}
			}
		});
    },
	
//==================
//FUNCIONES ONSAVE
//==================
    onSave_Formulario: function (executionContext) {
	},
//==================
//FUNCIONES ONCHANGE
//==================	
    onChange_tipoProceso: function (executionContext) {
        //debugger;
        var tipo_proceso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipoproceso", null); 
        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_filial", null);
        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_periodo", null);

        switch(tipo_proceso){
        //Plataformas / Sucursales (TOTAL)
        case 657130004:
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_filial");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_periodo");
            break;
        //Plataformas / Sucursales (NOVEDADES)
        case 657130005:
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_filial");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_periodo");
            break;
        // Agentes / Jefes Zonales
        case 657130006:
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_filial");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_periodo");
            break;
        //Proceso E04
        case 657130007:
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_filial");
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_periodo");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_filial", "required"); 
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_periodo", "required"); 

            var xmsbs_periodo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_periodo", null);
                if(xmsbs_periodo == null){
					var res = cargaMasiva.getPeriodo();
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_periodo", res);
                }
                
            break;
        default:
            break;
        }
        
    },
    onChange_xmsbs_archivocarga: function (executionContext) {
        var file = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_archivocarga", null); 
        
        if(file != null){
          JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_archivocarga");
        }
	},
	
//==================
//FUNCIONES BUSQUEDA
//==================
	buscarApiKey: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + cargaMasiva.ApiKey.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	}, 
	buscarAzureURL: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + cargaMasiva.URL.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},	
	
//==================
//UTILS
//==================
	getPeriodo: function() {
        // DEFINICIO PROCESO E04
        // Muestra el mes y año que se va a procesar,
        // como el proceso se ejecuta dentro de los primeros 7 días hábiles del mes el periodo a procesar
        // siempre es el mes anterior al mes en curso, es decir, si hoy fuera 3 de agosto de 2023 en 
        // Periodo Actual debería aparece 072023

        var today = new Date();
        let year= today.getFullYear(); 
        let month = today.getMonth() + 1;
        let month_periodo;
        let year_periodo;
        
        switch(month){
			case 1:
				month_periodo = 12;
				year_periodo = year - 1;
			break;
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 11:
			case 12:
				month_periodo = month - 1;
				year_periodo = year;
			break;
			default:
			break;
		}
            
		var response = month_periodo + "/" + year_periodo;
		return response.padStart(7, "0");
    },
    get: function(url, apiKey, successFunction) {
		
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function (data) {
			if (xhr.readyState == 4 && xhr.status == 200) {
			//debugger;
				successFunction(JSON.parse(data.currentTarget.response));
			}
		}

		xhr.open("GET", url, true);
		xhr.setRequestHeader("Accept", "application/json");
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.setRequestHeader("AuthApi", apiKey);
		xhr.send();
	}	
};	