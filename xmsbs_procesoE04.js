if (typeof(procesoE04) == "undefined") {
    procesoE04 = {
        __namespace: true
    };    
}

procesoE04 = {
	URL: {        
        Azure: "",
        Name: "AzureURL"
    },	
	ApiKey: {
        Key: "",
        Name: "AuthApi"
    },   
	//================
	//FUNCIONES ONLOAD
	//================
	onLoad_Formulario: function (executionContext) {
        debugger;
        
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        if(estado == 1)
        {
           var today = new Date();
           //var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
           var date = today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

           JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_name", "Proceso E04 - " + date);
        }
        
        var xmsbs_periodo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_periodo", null); 
        
        if(xmsbs_periodo == null)
        {
            var periodo = procesoE04.getPeriodo();
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_periodo", periodo);
            
        }
    },	
	//==================
	//FUNCIONES ONSAVE
	//==================
		
		
	//==================
	//FUNCIONES ONCHANGE
	//==================	

		
	//==================
	//FUNCIONES BUSQUEDA
	//==================	
	buscarApiKey: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + procesoE04.ApiKey.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	}, 
	buscarAzureURL: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + procesoE04.URL.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},	
	//==================
	//BOTONES RIBBON
	//==================
    onclick_generaArchivo: function (executionContext) {
        //debugger;
        var xmsbs_periodo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_periodo", null); 
        
        if(xmsbs_periodo != null)
        {
            var periodo_array = xmsbs_periodo.split("/");
            
                if(periodo_array.length == 2)
                {
                    //Se valida el formato del periodo
                       var mes = periodo_array[0];
                       var año = periodo_array[1];
                       var resultado_mes = false;
                       var resultado_año = false;
                       
                       if(mes.length == 2 && mes > 0 && mes < 13)
                       {
                                   resultado_mes = true;
                       }
                          
                       if(año.length == 4)
                       {
                            resultado_año = true;
                       }
                       
                       if(!resultado_año)
                       {
                               alert("El año configurado en el Periodo es incorrecto. Porfavor configure correctamente el Periodo e intente nuevamente. \nEl periodo debe tener el siguiente formado MM/AAAA.");
                       }
                    
                       if(!resultado_mes)
                       {
                               alert("El mes configurado en el Periodo es incorrecto. Porfavor configure correctamente el Periodo e intente nuevamente. \nEl periodo debe tener el siguiente formado MM/AAAA.");
                       }
                    // 
                    
                    if(resultado_mes && resultado_año)
                    {
                        //EJECUCIÓN DE SERVICIO 
                        procesoE04.ejecutarProcesoE04(executionContext);
                    }
                    
                }else{
                    alert("El Periodo esta configurado incorrectamente, porfavor configure el Periodo e intente nuevamente. \nEl Periodo debe tener el siguiente formado MM/AAAA.");
                }
            
        }else{
            alert("Es necesario configurar el Periodo antes de generar el archivo E04, porfavor configure el Periodo e intente nuevamente. \nEl Periodo debe tener el siguiente formado MM/AAAA.");
        }
    },

    enable_generaArchivo: function (executionContext) {
        //debugger;
        var tipoFormulario = JumpStartLibXRM.Fx.getFormType(executionContext);

        if(tipoFormulario == 2)
        {
            var statuscode = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null); 
            if(statuscode == 1)
            {
                return true;
            }
        }
        return false;
    },
    ejecutarProcesoE04: function (executionContext){
       //debugger;
       
      		var strTitle = "Generación Datos Reporte E04";
            var strBody = "El proceso que genera el archivo con información para el reporte E04 puede tardar algunos segundos. \t¿Quieres ejecutar el proceso?";
            var strConfirmBtn = "Generar Archivo";
            var strCancelBtn = "Cancelar";
                 
            var confirmStrings = { title: strTitle , text:strBody, confirmButtonLabel:strConfirmBtn, cancelButtonLabel:strCancelBtn};
            var confirmOptions = { height: 250, width: 500 };
            Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
            function (success) {   
                if (success.confirmed)
                {
					Xrm.Utility.showProgressIndicator("Generando archivo E04...");
                    try {
                        //JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", 657130001); //En Proceso
                        //formContext.data.entity.save();
                        setTimeout(function () {
                            var id = JumpStartLibXRM.Fx.getEntityId(executionContext);
                            if (id.indexOf("{") > -1)
                            {
                                id = id.substring(1, 37);
                            }
                            
                            var AzureURL = procesoE04.buscarAzureURL(executionContext); //AzureURL.value[0].xmsbs_valor
                            var ApiKey = procesoE04.buscarApiKey(executionContext);     //ApiKey.value[0].xmsbs_valor
                            var URL = AzureURL.value[0].xmsbs_valor + "Reportes/GeneracionDatosE04/" + id;

                            procesoE04.get(URL, ApiKey.value[0].xmsbs_valor, function (data) {
                                if (data.success) {
                                    Xrm.Utility.closeProgressIndicator();
                                    //JumpStartLibXRM.Fx.openEntityForm("xmsbs_procesoe04s",id);
                                    
                                    var entityFormOptions = {};
                                    entityFormOptions["entityName"] = "xmsbs_procesoe04";
                                    entityFormOptions["openInNewWindow"] = false;
                                    entityFormOptions["entityId"] = id;

                                    // Open the form.
                                    Xrm.Navigation.openForm(entityFormOptions).then(
                                        function (success) {
                                            console.log(success);
                                        },
                                        function (error) {
                                            console.log(error);
                                    });
                                }
                                else {
                                    alert(data.message);
                                }
                            });
                            
                        }, 500);            
                    }
                    catch (ex) {
                            alert("Error en la Generación del Archivo, porfavor comuniquese con un administrador del sistema.");
                    }
                }
            })
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
            return response.padStart(7,"0");
    },
    get: function(url, apiKey, successFunction) {
    //debugger;
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