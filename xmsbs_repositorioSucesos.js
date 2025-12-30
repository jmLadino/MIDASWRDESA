if (typeof (RepositorioSucesos) == "undefined")
    {
        RepositorioSucesos = {
            __namespace: true
        };
    }
    
    var _modelo = null;
    var globalEC = null;
    
    RepositorioSucesos = {
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
            ExtCasoId: null,
			StockAdquirenciaId:null,
			NuevoStock:null,
            UsuarioAdminID: "d43af6f7-e875-eb11-a812-000d3ab23035" // (DESA) Dynamics_CRM_MIDAS_CL_DEV
            //UsuarioAdminID: "a533cb3f-6583-eb11-a812-000d3abd3579" // (HOMO y PROD) Dynamics_CRM_MIDAS_CL_DEV
        },
    
        URL: {        
            Azure: "",
            Name: "AzureURL"
        },
        
        ApiKey: {
            Key: "",
            Name: "AuthApi"
        },
        
        // variable  para servicio Banco
         MidasToken: {
            HostName: "MidasToken",
            HostValue: "",
            BodyName: "MidasTokenBody",
            BodyValue: ""
        },
    
        FileNetConsulta: {
            HostName: "FileNetConsultaHost",
            HostValue: "",
            BodyName: "FileNetConsultaBody",
            BodyValue: ""
        },
         FileNetUpload: {
            HostName: "FileNetUploadHost",
            HostValue: ""      
        },
        // end variables para servicio banco
        
        PopUp: 0,
    
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
        
        apiGet: function (url, successFunction) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (data) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    successFunction(JSON.parse(data.currentTarget.response));
                }
            };
    
            xhr.open("GET", RepositorioSucesos.URL.Azure + url, true);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
            xhr.send();
        },
        apiGetV2: function (url, successFunction) {
            var xhr = new XMLHttpRequest();
            //var apiToken = window.sessionStorage.getItem("LokiAuthToken");
            var apiToken = "";
            xhr.onreadystatechange = function (data) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    successFunction(JSON.parse(data.currentTarget.response));
                }
            };
    
            xhr.open("GET", RepositorioSucesos.URL.Azure + url, true);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
            xhr.setRequestHeader("TokenApi", apiToken);
            xhr.send();
        },
        
    // llamadas directas a servicios banco
        
        apiTokenMidas: function (successFunction) {
            var xhr = new XMLHttpRequest();
            let rutaMidasToken = RepositorioSucesos.MidasToken.HostValue;
            xhr.open("POST", rutaMidasToken, true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            let data1 = RepositorioSucesos.MidasToken.BodyValue;
    
            xhr.onreadystatechange = function (data) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    successFunction(JSON.parse(data.currentTarget.response));
                }
            };
                
            xhr.send(data1);                
        }, 
        apiFileNetConsultaV1: function (token, idFileNet, tipoMIME, successFunction) {
             
            var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer "+ token);
    
            var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
            };
         let rutaFilenet = RepositorioSucesos.FileNetConsulta.HostValue;
         rutaFilenet += idFileNet + RepositorioSucesos.FileNetConsulta.BodyValue + tipoMIME;
        fetch(rutaFilenet, requestOptions)
            .then(response => response.text())
            .then(result => successFunction( JSON.parse(result) ))
            .catch(error => console.log('error', error));
        }, 
    
        apiFileNetUploadV1: function (token, objJson, successFunction) {
             
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "text/plain");
            myHeaders.append("Authorization", "Bearer "+ token);
            
            var raw = objJson;
    
            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
            };
         let rutaFilenet = RepositorioSucesos.FileNetUpload.HostValue;
       
        fetch(rutaFilenet, requestOptions)
            .then(response => response.text())
            .then(result => successFunction( JSON.parse(result) ))
            .catch(error => console.log('error', error));
        }, 
    
    // fin llamadas directas a servicios banco
    
        apiPost: function (url, params, successFunction) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", RepositorioSucesos.URL.Azure + url, true);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
    
            xhr.onreadystatechange = function (data) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    successFunction(JSON.parse(data.currentTarget.response));
                }
            };
                
            xhr.send(JSON.stringify(params));                
        }, 
        
        apiPostV2: function (url, params, successFunction) {
            var xhr = new XMLHttpRequest();
            //var apiToken = window.sessionStorage.getItem("LokiAuthToken");
            var apiToken = "";
            xhr.open("POST", RepositorioSucesos.URL.Azure + url, true);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
            xhr.setRequestHeader("TokenApi", apiToken);
            xhr.onreadystatechange = function (data) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    successFunction(JSON.parse(data.currentTarget.response));
                }
            };
                
            xhr.send(JSON.stringify(params));                
        },  
        
        apiPostSync: function (url, params, successFunction) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", RepositorioSucesos.URL.Azure + url, false);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
    
            xhr.onreadystatechange = function (data) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    successFunction(JSON.parse(data.currentTarget.response));
                }
            };
    
            xhr.send(JSON.stringify(params));
        },
        apiPostSyncV2: function (url, params, successFunction) {
            var xhr = new XMLHttpRequest();
            //var apiToken = window.sessionStorage.getItem("LokiAuthToken");
            var apiToken = "";
            xhr.open("POST", RepositorioSucesos.URL.Azure + url, false);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
            xhr.setRequestHeader("TokenApi", apiToken);
    
            xhr.onreadystatechange = function (data) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    successFunction(JSON.parse(data.currentTarget.response));
                }
            };
    
            xhr.send(JSON.stringify(params));
        },
        
        apiPostFileSync: function (url, params, successFunction) {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", RepositorioSucesos.URL.Azure + url, false);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
    
            xhr.onreadystatechange = function (data) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    successFunction(JSON.parse(data.currentTarget.response));
                }
            };
    
            xhr.send(params);
        },
        apiPostFileSyncV2: function (url, params, successFunction) {
            var xhr = new XMLHttpRequest();
            //var apiToken = window.sessionStorage.getItem("LokiAuthToken");
            var apiToken = "";
            xhr.open("POST", RepositorioSucesos.URL.Azure + url, false);
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
            xhr.setRequestHeader("TokenApi", apiToken);
    
            xhr.onreadystatechange = function (data) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    successFunction(JSON.parse(data.currentTarget.response));
                }
            };
    
            xhr.send(params);
        },
        
        
        setApiKey: function(executionContext){   
            var resultado = Util.buscarValorParametro(executionContext, RepositorioSucesos.ApiKey.Name);
            
            if(resultado)
            {
                RepositorioSucesos.ApiKey.Key = resultado;
            }
        },
        
        setAzureURL: function(executionContext){
            var resultado = Util.buscarValorParametro(executionContext, RepositorioSucesos.URL.Name);
            
            if(resultado)
            {
                RepositorioSucesos.URL.Azure = resultado;
            }
        },
        
      // variables de servicio de banco
        setMidasHost: function(executionContext) {
            var resultado = Util.buscarValorParametro(executionContext, RepositorioSucesos.MidasToken.HostName);
    
            if (resultado) {
                RepositorioSucesos.MidasToken.HostValue = resultado;
            }
        },
        setMidasHostBody: function(executionContext) {
            var resultado = Util.buscarValorParametro(executionContext, RepositorioSucesos.MidasToken.BodyName);
    
            if (resultado) {
                RepositorioSucesos.MidasToken.BodyValue = resultado;
            }
        },
    
        setFileNetConsultaHost: function(executionContext) {
            var resultado = Util.buscarValorParametro(executionContext, RepositorioSucesos.FileNetConsulta.HostName);
    
            if (resultado) {
                RepositorioSucesos.FileNetConsulta.HostValue = resultado;
            }
        },
    
        setFileNetConsultaBody: function(executionContext) {
            var resultado = Util.buscarValorParametro(executionContext, RepositorioSucesos.FileNetConsulta.BodyName);
    
            if (resultado) {
                RepositorioSucesos.FileNetConsulta.BodyValue = resultado;
            }
        },
        
        setFileNetUploadHost: function(executionContext) {
            var resultado = Util.buscarValorParametro(executionContext, RepositorioSucesos.FileNetUpload.HostName);
    
            if (resultado) {
                RepositorioSucesos.FileNetUpload.HostValue = resultado;
            }
        },
    
        //end  variables de servicio de banco   
        
        setRespuestaPredefinidaCliente: function(modelo){
            let casoId = modelo.casoId;
            let textoRespuesta = modelo.respuesta;
            if (casoId.indexOf("{") > -1) {
                casoId = casoId.substring(1, 37);
            }
            JumpStartLibXRM.Fx.setValueField(globalEC, "xmsbs_respuestacliente", textoRespuesta);
    
            //Guardamos el cambio
            JumpStartLibXRM.Fx.formSave(globalEC);
        },
    
        setRespuestaFormales: function(modelo){
            let fieldName = "xmsbs_plantillaelegida";
            let id = modelo.idPlantilla;
            let name = modelo.nombrePlantilla;
            let entityType = "xmsbs_plantillashtml";
            let res = JumpStartLibXRM.Fx.setLookupValue(globalEC, fieldName, id, name, entityType);
            
            let casoId = modelo.casoId;
            let referenciaCasoSolicitante= modelo.referenciaCasoSolicitante;
            let derivadoA = modelo.derivadoA;
            let nombreContactoBanco = modelo.nombreContactoBanco;
            let cargoContactoBanco = modelo.cargoContactoBanco;
            let telefonoContactoBanco = modelo.telefonoContactoBanco;
            let emailContactoBanco = modelo.emailContactoBanco;
            let nombreDestinatario = modelo.nombreDestinatario;
            let prefijoDestinatario = modelo.prefijoDestinatario;
            let cargoDestinatario = modelo.cargoDestinatario;
            
            if (casoId.indexOf("{") > -1)
            {
                casoId = casoId.substring(1, 37);
            }
            
            let metadatosRespuesta = Caso.buscarMetadatosRespuestaCaso(globalEC, casoId);
            var objeto = {};
            objeto["xmsbs_caso@odata.bind"] = "/incidents(" + casoId + ")";
            objeto["xmsbs_nombrecontactosernac"] = nombreDestinatario;
            objeto["xmsbs_referenciacasosolicitante"] = referenciaCasoSolicitante;
            objeto["xmsbs_telefonocontactobanco"] = telefonoContactoBanco;
            objeto["xmsbs_tomarcontactocargo"] = cargoContactoBanco;
            objeto["xmsbs_tomarcontactonombre"] = nombreContactoBanco;
            objeto["xmsbs_derivadoa"] = derivadoA;
            objeto["xmsbs_correocontactobanco"] = emailContactoBanco;
            objeto["xmsbs_prefijodestinatario"] = prefijoDestinatario;
            objeto["xmsbs_cargodestinatario"] = cargoDestinatario;
            
            //Entidad
            var entity = "xmsbs_metadatoscartaformaleses";
            if(metadatosRespuesta.value.length==0)
            {
                //Creamos el objeto
                //Creamos los registros de autorizadores
                var resultado = SDK.WEBAPI.createRecord(globalEC, objeto, entity);
                if (resultado != null)
                {
                    //alert("Se han creado los usuarios autorizadores");
                }
                else
                {
                    //alert("Ha ocurrido un error al crear los usuarios autorizadores del reverso y castigo");
                }
            }
            else
            {
                let id = metadatosRespuesta.value[0].xmsbs_metadatoscartaformalesid;
                var resultado = SDK.WEBAPI.updateRecord(globalEC, id ,objeto, entity, null, null);
                if (resultado != null)
                {
                    //alert("Se han creado los usuarios autorizadores");
                }
                else
                {
                    //alert("Ha ocurrido un error al crear los usuarios autorizadores del reverso y castigo");
                }
            }
        
            JumpStartLibXRM.Fx.setValueField(globalEC, "xmsbs_respuestacliente", modelo.respuesta);
    
            //Guardamos el cambio
            JumpStartLibXRM.Fx.formSave(globalEC);
        },
        
        executeSucesosAccion: function (executionContext, formContext, modelo) {        
            RepositorioSucesos.setApiKey(executionContext);
            RepositorioSucesos.setAzureURL(executionContext);
            
            if (modelo.casoId.indexOf("{") > -1){modelo.casoId = modelo.casoId.substring(1, 37);}
            
            _modelo = modelo;
            var sucesoslength = modelo.sucesos.length;
            
            for (var i = 0; i < sucesoslength; i ++){
                switch (modelo.sucesos[i].codigoSuceso){
                    case 'SUC0001': // Cambio a etapa siguiente
                        RepositorioSucesos.SUC0001(executionContext, formContext, modelo);
                        break;                    
                    case 'SUC0002': // Seleccionar y visualizar respuesta del caso
                        RepositorioSucesos.SUC0002(executionContext);
                        break;                    
                    case 'SUC0003': // Registro de Visación - Crear
                        RepositorioSucesos.SUC0003(executionContext);
                        break;
                    case 'SUC0004': // Registro de Visación - Aprobar
                        RepositorioSucesos.SUC0004(executionContext);
                        break;
                    case 'SUC0005': // Registro de Visación - Rechazar
                        RepositorioSucesos.SUC0005(executionContext);
                        break;
                    case 'SUC0006': // Registro de Prorroga - Crear
                        RepositorioSucesos.SUC0006(executionContext);
                        break;
                    case 'SUC0007': // Registro de Reverso y Castigo - Crear
                        RepositorioSucesos.SUC0007(executionContext);
                        break;
                    case 'SUC0008': // Buscar respuestas pre establecidas del caso
                        RepositorioSucesos.SUC0008();
                        break;
                    case 'SUC0009': // Registro de SubRequerimiento - Crear
                        RepositorioSucesos.SUC0009(executionContext);
                        break;                    
                    case 'SUC0010': // Preparar respuesta Formales
                        RepositorioSucesos.SUC0010(executionContext);
                        break;
                    case 'SUC0011': // Preview Respuesta
                        RepositorioSucesos.SUC0011();
                        break;                
                    case 'SUC0012': // Analiza Respuesta para avance
                        RepositorioSucesos.SUC0012();
                        break;
                    case 'SUC0013': // Resolver Caso
                        RepositorioSucesos.SUC0013(executionContext, modelo);
                        break;
                    case 'SUC0014': // Generar Respuesta
                        RepositorioSucesos.SUC0014(executionContext, modelo);
                        break;                
                    case 'SUC0015': // Re-insistencia
                        RepositorioSucesos.SUC0015(executionContext);
                        break;                    
                    case 'SUC0016': // Regresa a etapa anterior
                        RepositorioSucesos.SUC0016(executionContext, formContext, modelo);
                        break;                    
                    case 'SUC0017': // Cancelar Caso
                        RepositorioSucesos.SUC0017(executionContext, modelo);
                        break;                    
                    case 'SUC0018': // Derivar a otra unidad
                        RepositorioSucesos.SUC0018(executionContext, formContext, modelo);
                        break;                    
                    case 'SUC0019': // Ventana de reparo
                        RepositorioSucesos.SUC0019(executionContext, formContext, modelo);
                        break; 
                    case 'SUC0020': // Finalizar al crear
                        RepositorioSucesos.SUC0020(executionContext, formContext, modelo);
                        break;
                    case 'SUC0021': // Enviar respuesta Adquirencia
                        RepositorioSucesos.SUC0021(executionContext);
                        break; 
                    case 'SUC0022': // Cierre automático
                        RepositorioSucesos.SUC0022(executionContext, formContext, modelo);
                        break;
                    case 'SUC0023': // Descargar PDF
                        RepositorioSucesos.SUC0023(executionContext);
                        break;                    
                    case 'SUC0024': // Enviar respuesta adquirencia Manual
                        RepositorioSucesos.SUC0024(executionContext, modelo);
                        break;
                    case 'SUC0025': // Generar Documento Contracargos
                        RepositorioSucesos.SUC0025(executionContext, modelo);
                        break; 
                    case 'SUC0026': // Generar Documento Cierre Contracargos
                        RepositorioSucesos.SUC0026(executionContext, modelo);
                        break; 
                    case 'SUC0027': // Reinsistencia con ventana
                        RepositorioSucesos.SUC0027(executionContext, formContext, modelo);
                        break;
                    case 'SUC0028': // Terminado RA
                        RepositorioSucesos.SUC0028(executionContext, modelo);
                    	break;     
                    case 'SUC0029': // Subrequerimiento Fraude
                        RepositorioSucesos.SUC0029(executionContext, modelo);
                    	break;
                    case 'SUC0030': // Borrado de respuesta
                        RepositorioSucesos.SUC0030(executionContext);
                    	break;
                    case 'SUC0031': // Derivar a Sucursal
                        RepositorioSucesos.SUC0031(executionContext, formContext, modelo);
                    	break;
                    case 'SUC0032': // Termino Inmediato
                        RepositorioSucesos.SUC0032(executionContext, formContext, modelo);
                    	break;
                    case 'SUC0033': // Resuelve No se accede
                        RepositorioSucesos.SUC0033(executionContext, formContext, modelo);
                    	break;
                    case 'SUC0034': // Generar Certificado
                        RepositorioSucesos.SUC0034(executionContext, modelo);
                    	break;
                    case 'SUC0035': // Cliente Desiste
                        RepositorioSucesos.SUC0035(executionContext, modelo);
                    	break;                    
                }
            }
            
            Caso.crearAccionEjecutada(formContext, modelo);
        },
    
        SUC0001:function(executionContext, formContext, modelo){
            //Hace click en avanzar. Primero validamos si está en reparo y si tiene contenido para permitir avanzar o no
            var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);  
            var observacionesReparo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_observacionesdevisacion", null);
            if (observacionesReparo != null)
                observacionesReparo = observacionesReparo.trim();
            
            if(estado == 3 && !observacionesReparo){ //Si el Caso está en Reparo
                //Significa que el caso está en reparo y no le pusieron una observación. Alerto.
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: "El caso está en reparo. Debe ingresar una observación al reparo"};
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        //console.log("Alert dialog closed");
                        formContext.getControl("xmsbs_observacionesdevisacion").setFocus();
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
            else{
                //Para avanzar, validamos que exista a nivel de Odata un registro de bitácora actual en el caso
                var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
                if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
                var bitacoraActualID = "";
                var resultado = RepositorioSucesos.validaBitacoraActual(executionContext, incidentId);
                if(resultado){
                    bitacoraActualID = resultado._xmsbs_bitacoraactual_value;
                }
                
                if(!bitacoraActualID){
                    //No hay bitacora actual, por lo que desplegamos un mensaje de que porfavor espere unos segundos
                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: "La bitácora del Caso aún se está generando. Favor espere unos segundos y vuelva a avanzar"};
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then( function (success) { }, function (error) { } );
                    return;
                }

                //Caso contrario, continúa ejecución normal
                Xrm.Utility.closeProgressIndicator();
                var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Avance de etapa", subtitle:"Va a avanzar el Caso a la siguiente etapa. ¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos" };
                var confirmOptions  = { height: 200, width: 260 };
                Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                    function (success) {
                        if(success.confirmed)
                        {
                            //Xrm.Utility.showProgressIndicator("Procesando la SUCC0001 ...");
                            //Si confirma
                            //Parámetros del servicio
                            var idIncident = modelo.casoId;
                            var idAccionEtapa = modelo.accionEtapaId;
                            var codigoSuceso = "SUC0001";
                            
                            //llamada al servicio
                            var response = null;
                            
                            var URL= "Caso/EjecutarSuceso/"+idIncident+"/"+idAccionEtapa+"/"+codigoSuceso+"";
                            // var apiToken = window.sessionStorage.getItem("LokiAuthToken");
                            var service = RepositorioSucesos.GetRequestObject();
                            if (service != null) {
                                service.open("POST", RepositorioSucesos.URL.Azure + URL, false);
                                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                                service.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
                                // service.setRequestHeader("TokenApi", apiToken);
                                service.send(null);
                                if (service.response != "") {
                                    response = JSON.parse(service.response);
                                }
                            }
                            
                            // Xrm.Utility.closeProgressIndicator();
                            if (response.success) {
                                debugger;

                                // solo al avanzar de la etapa 01 a la etapa 02 del SubRequerimiento Fraude el GUARDADO debe ser impersonado, ya que el caso pasa a FISCALIA y con el método actual no resulta.

                                var AvanzaEta01SubRequerimientoFraude = false;

                                // Evalúa SubRequeriento Fraude
                                var oIncidentUPD = {};
                                var ordenEtapa = "";
                                var etapaId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa").replace(/[{}]/g, "").toLowerCase();
                                var oEtapa = RepositorioSucesos.ordenEtapa(executionContext, etapaId);
                                if(oEtapa){
                                    ordenEtapa = oEtapa.xmsbs_orden;
                                    if (ordenEtapa == 1){
                                        var FSid = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_flujosantander", null)[0].id.replace(/[{}]/g, "").toLowerCase();
                                        if (FSid == "31d7b247-d58c-f011-b4cb-000d3ac0d3a3") // FS945 : Sub-Requerimiento Fraude 3.0 Base 1
                                            AvanzaEta01SubRequerimientoFraude = true;
                                    }
                                }

                                //actualizar etapa
                                var fieldName = "xmsbs_etapa";
                                var id = response.suC0001.etapa.id;
                                var name = response.suC0001.etapa.name;
                                var entityType = response.suC0001.etapa.logicalName;
                                if (AvanzaEta01SubRequerimientoFraude)
                                    oIncidentUPD[fieldName+"@odata.bind"] = "/"+entityType+"s("+id+")";
                                else
                                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                                
                                
                                //actualizar Acción 
                                var fieldName = "xmsbs_accion";
                                var id = response.suC0001.accion.id;
                                var name = response.suC0001.accion.name;
                                var entityType = response.suC0001.accion.logicalName;
                                if (AvanzaEta01SubRequerimientoFraude)
                                    oIncidentUPD[fieldName+"@odata.bind"] = "/"+entityType+"s("+id+")";
                                else
                                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                                
                                
                                //actualizar propietario
                                var fieldName = "ownerid";
                                var id = response.suC0001.propietario.id;
                                var name = response.suC0001.propietario.name;
                                var entityType = response.suC0001.propietario.logicalName;
                                if (AvanzaEta01SubRequerimientoFraude)
                                    oIncidentUPD[fieldName+"@odata.bind"] = "/"+entityType+"s("+id+")";
                                else
                                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                            
                                //Rol - lookup
                                if(response.suC0001.rol != null){
                                    if(response.suC0001.rol.name != ""){
                                        var fieldName = "xmsbs_rol";
                                        var id = response.suC0001.rol.id;
                                        var name = response.suC0001.rol.name;
                                        var entityType = response.suC0001.rol.logicalName;
                                        if (AvanzaEta01SubRequerimientoFraude)
                                            oIncidentUPD[fieldName+"@odata.bind"] = "/"+entityType+"s("+id+")";
                                        else
                                            JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                                    }
                                }
                                
                                //actualizar UR 
                                if(response.suC0001.ur != null){
                                    var fieldName = "xmsbs_ur";
                                    var id = response.suC0001.ur.id;
                                    var name = response.suC0001.ur.name;
                                    var entityType = response.suC0001.ur.logicalName;
                                    if (AvanzaEta01SubRequerimientoFraude)
                                        oIncidentUPD[fieldName+"@odata.bind"] = "/"+entityType+"s("+id+")";
                                    else
                                        JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                                }
                                    
                                // Solo si el estado atual es "En Reparo" y el estado que viene por Matriz es "En espera de documentos" (657130002) 
                                // se realizará la comprobación de si efectivamente existen documentos requeridos que estén pendientes.
                                // Si no existen, entonces el estado final será "En Gestión". (PENDIENTE: lo que se debe hacer es evaluar el último estado del caso, no se debe asumir que es En Gestión)
                                if (estado == 3 && response.suC0001.estado == 657130002){
                                    var entityType = "xmsbs_documento";
                                    var query = "$select=xmsbs_id";
                                    query += "&$filter=_xmsbs_caso_value eq '" + idIncident + "' and xmsbs_obligatoriedad eq true and statuscode eq 657130000&$top=1";
                                    var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () {});
                                    if(resultado){
                                        if(resultado.value.length == 0){
                                            if (AvanzaEta01SubRequerimientoFraude)
                                            {
                                                oIncidentUPD["statuscode"] = 2;   // esta funcionalidad solo sirve para cambiar entre statuscode del mismo statecode.. en este caso ACTIVO.
                                                oIncidentUPD["xmsbs_etapareinsistencia"] = true;
                                            }
                                            else
                                            {
                                                JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", 2); // En Gestión
                                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_etapareinsistencia", true); // Gatilla actualización SLA
                                            }
                                        }
                                    }
                                    else{
                                        if (AvanzaEta01SubRequerimientoFraude)
                                            oIncidentUPD["statuscode"] = response.suC0001.estado;
                                        else // no se pudo evaluar, por lo tanto lo deja en "En espera de Documentos" (valor por default dado por la matriz)
                                            JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", response.suC0001.estado);
                                    }
                                }
                                else{
                                    if (AvanzaEta01SubRequerimientoFraude)
                                        oIncidentUPD["statuscode"] = response.suC0001.estado;
                                    else
                                        JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", response.suC0001.estado);
                                }
                            
                                //Validamos si el nuevo usuario es igual al actual para cerrar o refrescar
                                var currentUserId = JumpStartLibXRM.Fx.getUserId();
                                if (currentUserId.indexOf("{") > -1){currentUserId = currentUserId.substring(1, 37);}
                                var newUserID = response.suC0001.propietario.id;
                                if (newUserID.indexOf("{") > -1){newUserID = newUserID.substring(1, 37);}
                                
                                // Muestra mensaje de creación del Caso.
                                // - Valida que el formulario sea: "Caso Ingreso Único" ; E731458B-5CA5-4AC6-A863-B54FD50C0475
                                // - Valida que el estado "desde" sea "En Ingreso".
                                // - Muesta Alerta con la información del Caso.
                                var FormName = JumpStartLibXRM.Fx.getFormName(executionContext);
                                
                                var IngresoUnicoFinalizado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_ingresounicofinalizado", null);
                                var CasoPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
                                // Si el ingreso único finalizado es SI, omite el mensaje de creación del caso. (ocurre para casos con espera de documentos)
                                
                                // Estado: 1 En Ingreso
                                debugger;
                                if ((FormName == "Caso Ingreso Único" || FormName == "Caso") && estado == 1 && 
                                    (IngresoUnicoFinalizado == null || IngresoUnicoFinalizado == 0 || CasoPrincipal)) 
                                {
                                    //Se actualiza el ingreso unico finalizado a SI
                                    if (AvanzaEta01SubRequerimientoFraude)
                                        oIncidentUPD["xmsbs_ingresounicofinalizado"] = true;
                                    else
                                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_ingresounicofinalizado", true);

                                    var CorrelativoCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_numerocorrelativo", null);
                                    var FechaCreacion = JumpStartLibXRM.Fx.getValueField(executionContext, "createdon", null);
                                    var RUT = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
                                    var Producto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_producto", null)[0].name;
                                    var DetalleTipologia = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledetipologia", null)[0].name;
                                    var Propietario = response.suC0001.propietario.name;
                                    var FechaComprometida = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_fechacomprometida", null);
                                    
                                    //Actualizar title del caso
                                    var TipoRequerimiento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipoderequerimiento", null)[0].name;
                                    var tituloCaso = CorrelativoCaso + " - " + TipoRequerimiento + " - " + Producto + " - " + DetalleTipologia + " - " + RUT;
                                    if (AvanzaEta01SubRequerimientoFraude)
                                        oIncidentUPD["title"] = tituloCaso;
                                    else
                                        JumpStartLibXRM.Fx.setValueField(executionContext, "title", tituloCaso);
                                    
                                    // Deja la marca por default: "Tipo Asignación = Por Flujo" en la extensión del caso, PRE "save" del Caso.
                                    RepositorioSucesos.ActualizarExtensionCaso(executionContext, "xmsbs_tipodeasignacion", 657130000); // 657130000: por flujo
                                    
                                    debugger;
                                    if (AvanzaEta01SubRequerimientoFraude){
                                        // antes de guardar el nuevo propietario y etapa, guarda los posibles cambios que estén a nivel de formulario.
                                        formContext.data.entity.save();

                                        SDK.WEBAPI.updateRecordImpersonate(executionContext, idIncident.replace(/[{}]/g, ""), oIncidentUPD, "incident", RepositorioSucesos.Package.UsuarioAdminID, null, null);
                                        // todas las ejecuciones terminan con un refresh del formulario
                                    }
                                    else{
                                        formContext.data.entity.save();
                                    }

                                    // consultar el guardado de "xmsbs_ingresounicofinalizado"
                                    var testIngresoUnico = RepositorioSucesos.getIncidentIngresoUnicoFinalizado(executionContext,idIncident);
                                    if (testIngresoUnico && testIngresoUnico.xmsbs_ingresounicofinalizado != true)
                                    {
                                        setTimeout(function () {
                                            formContext.data.entity.save();
                                            testIngresoUnico = RepositorioSucesos.getIncidentIngresoUnicoFinalizado(executionContext,idIncident);
                                        }, 2000);
                                    }
                                    // si no esta guardado esperar 2 seg y revisar si esta guardado
                                    if (testIngresoUnico && testIngresoUnico.xmsbs_ingresounicofinalizado != true)
                                    {
                                        //no guardado mandar error de problema de registro mno avanzar
                                        var alertStrings = { confirmButtonLabel: "Aceptar", title: "Reintentar", text: "No se pudo procesar el avance del caso. Favor intente nuevamente o contacte al administrador"};
                                        var alertOptions = { height: 120, width: 260 };
                                        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then( function (success) { }, function (error) { } );

                                        return;
                                    }                                        

                                    // Actualiza campo para reporte RDA, determina si el caso es duplicado respecto a: rut, punto de contacto, detalle operación, mes actual.
                                    var xmsbs_rda50512454 = RepositorioSucesos.oDataCasoDuplicadoMensual(executionContext);
                                    RepositorioSucesos.ActualizarExtensionCaso(executionContext, "xmsbs_rda50512454", xmsbs_rda50512454);

                                    var strTitle = "Número de CASO: " + CorrelativoCaso;
                                    var strConfirmBtn = "Crear Nuevo Caso";
                                    var strCancelBtn = "Continuar";
                                    var strBody = "Con fecha " + JumpStartLibXRM.Fx.formatDate(FechaCreacion) + ", " +
                                            "se ha creado el caso " + CorrelativoCaso + " asociado al cliente " + RUT + ", " +
                                            "para el producto " + Producto + ", " + 
                                            "por concepto de " + DetalleTipologia + " y el responsable asignado es " + Propietario + ". " +
                                            "La fecha comprometida de resolución es: " + JumpStartLibXRM.Fx.formatDate(FechaComprometida);                                           

                                    if (AvanzaEta01SubRequerimientoFraude){
                                        // el caso pasa a FISCALIA, se debe informar los datos de SLA, pero no se debe dar la opción de continuar posicionado en el mismo caso, ya que el caso ya no es visible por el usuario.
                                        // el mensaje tb cambia. (por ahora se deja el mismo)
                                        debugger;

                                        strTitle = "Número de Subrequerimiento Fiscalía: " + CorrelativoCaso;
                                        strBody = "Con fecha " + JumpStartLibXRM.Fx.formatDate(FechaCreacion) + ", " +
                                                "se ha creado el " + JumpStartLibXRM.Fx.toUnicodeBold("Subrequerimiento a Fiscalía:") + " " + CorrelativoCaso + ", asociado al cliente " + RUT + ", " +
                                                "para el producto " + Producto + ", " + 
                                                "por concepto de " + DetalleTipologia + " y el responsable asignado es " + Propietario + ". " +
                                                "La fecha comprometida de resolución es: " + JumpStartLibXRM.Fx.formatDate(FechaComprometida);  
                                            
                                        var CasoPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
                    
                                        var alertStrings = { confirmButtonLabel: "Aceptar", text: strBody, title: strTitle };
                                        var alertOptions = { height: 300, width: 500 };
                                        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                            function (success) {
                                                var entityFormOptions = {};
                                                entityFormOptions["entityName"] = "incident";
                                                entityFormOptions["entityId"] = CasoPrincipal[0].id.replace(/[{}]/g, "");
                                                entityFormOptions["openInNewWindow"] = false;
                                                var formParameters = {};
                                                setTimeout(function () { Xrm.Navigation.openForm(entityFormOptions, formParameters); }, 3000);
                                            },
                                            function (error) {
                                                //console.log(error.message);
                                            }
                                        );
                                        return;
                                    }

                                    var confirmStrings = { title: strTitle , text:strBody, confirmButtonLabel:strConfirmBtn, cancelButtonLabel:strCancelBtn};
                                    var confirmOptions = { height: 250, width: 500 };
                                    Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(
                                    function (success) {   
                                        if (success.confirmed)
                                        {
                                            debugger;
                                            var entityFormOptions = {};
                                            entityFormOptions["entityName"] = "incident";
                                            entityFormOptions["openInNewWindow"] = false;
                                            //entityFormOptions["formId"] = JumpStartLibXRM.Fx.getFormID(executionContext);
                                            var formParameters = {};
                                            setTimeout(function () {
                                                Xrm.Navigation.openForm(entityFormOptions,formParameters);
                                            }, 3000);
                                        }
                                        else{
                                            if(currentUserId.toLowerCase() == newUserID.toLowerCase()){
                                                //Si los usuarios son iguales, validamos si el flujo es de término inmediato para cerrar. Si no, sigue como antes
                                                var etapaID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
                                                if (etapaID.indexOf("{") > -1){etapaID = etapaID.substring(1, 37);}
                                                
                                                var resultado = RepositorioSucesos.buscarProcesosDeEtapa(executionContext, etapaID);
                                                if(resultado && resultado.value.length > 0){
                                                    //Encontró procesos, validamos que se llame de Termino Inmediato
                                                    var nombre = resultado.value[0].xmsbs_proceso.name;
                                                    if(nombre == "[XMS - Caso] - Termino inmediato"){
                                                        //El flujo en cuestión es de término inmediato, cerramos la ventana
                                                        //JumpStartLibXRM.Fx.formClose(executionContext);
                                                        var alertStrings = { confirmButtonLabel: "Aceptar", title: "Cierre de Caso", text: "El caso se cerrará automáticamente. La ventana se cerrará"};
                                                        var alertOptions = { height: 120, width: 260 };
                                                        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                                            function (success) {
                                                                //Xrm.Utility.closeProgressIndicator();
                                                                //JumpStartLibXRM.Fx.formSaveAndClose(executionContext);
                                                                var entityFormOptions = {};
                                                                entityFormOptions["entityName"] = "incident";
                                                                entityFormOptions["openInNewWindow"] = false;
                                                                //entityFormOptions["formId"] = JumpStartLibXRM.Fx.getFormID(executionContext);
                                                                var formParameters = {};
                                                                setTimeout(function () {
                                                                    Xrm.Navigation.openForm(entityFormOptions,formParameters);
                                                                }, 3000);
                                                            },
                                                            function (error) {
                                                                //Xrm.Utility.closeProgressIndicator();
                                                                //console.log(error.message);
                                                            }
                                                        );
                                                    }
                                                    else{
                                                        //El flujo no es de término inmediato, cerramos como antes
                                                        var entityFormOptions = {};
                                                        entityFormOptions["entityName"] = formContext.data.entity.getEntityName();
                                                        entityFormOptions["entityId"] = idIncident;
                                                        //Guardamos el cambio y refrescamos el formulario
                                                        setTimeout(function () {
                                                            Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);
                                                        }, 3000);
                                                    }
                                                }
                                                else{
                                                    //Son iguales, hacemos el refresco normal
                                                    var entityFormOptions = {};
                                                    entityFormOptions["entityName"] = formContext.data.entity.getEntityName();
                                                    entityFormOptions["entityId"] = idIncident;
                                                    //Guardamos el cambio y refrescamos el formulario
                                                    setTimeout(function () {
                                                        Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);
                                                    }, 3000);
                                                }
                                            }
                                            else{
                                                //Son distintos, alertamos que se cerrará la ventana y cerramos
                                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Cambio de responsable", text: "El caso pasó a gestión de un nuevo usuario. La ventana se cerrará"};
                                                var alertOptions = { height: 120, width: 260 };
                                                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                                    function (success) {
                                                        //console.log("Alert dialog closed");
                                                        Xrm.Utility.closeProgressIndicator();
                                                        //JumpStartLibXRM.Fx.formSaveAndClose(executionContext);
                                                        setTimeout(function () {
                                                            JumpStartLibXRM.Fx.formClose(executionContext);
                                                        }, 3000);
                                                    },
                                                    function (error) {
                                                        Xrm.Utility.closeProgressIndicator();
                                                        //console.log(error.message);
                                                    }
                                                );                            
                                            }									
                                        }
                                    },
                                    function (error) { 
                                        //---
                                    });
                                
                                }
                                else
                                {
                                    // Siempre deja la marca por default: "Tipo Asignación = Por Flujo" si la acción es AVANZAR, 
                                    // La actualización de la extensión, siempre va antes del "save" del Caso.
                                    RepositorioSucesos.ActualizarExtensionCaso(executionContext, "xmsbs_tipodeasignacion", 657130000);
                                    
                                    // Adquirencia
                                    RepositorioSucesos.DisminuyeStockAdquirencia(executionContext);
                                    
                                    // Forma original
                                    if(currentUserId.toLowerCase() == newUserID.toLowerCase()){
                                        //Son iguales, hacemos el refresco normal
                                        //var entityFormOptions = {};
                                        //entityFormOptions["entityName"] = formContext.data.entity.getEntityName();
                                        //entityFormOptions["entityId"] = idIncident;

                                        if (AvanzaEta01SubRequerimientoFraude){
                                            // antes de guardar el nuevo propietario y etapa, guarda los posibles cambios que estén a nivel de formulario.
                                            formContext.data.entity.save();
                                            SDK.WEBAPI.updateRecordImpersonate(executionContext, idIncident.replace(/[{}]/g, ""), oIncidentUPD, "incident", RepositorioSucesos.Package.UsuarioAdminID, null, null);

                                            var CasoPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
                                        
                                            var entityFormOptions = {};
                                            entityFormOptions["entityName"] = "incident";
                                            entityFormOptions["entityId"] = CasoPrincipal[0].id.replace(/[{}]/g, "");
                                            entityFormOptions["openInNewWindow"] = false;
                                            var formParameters = {};
                                            setTimeout(function () { Xrm.Navigation.openForm(entityFormOptions, formParameters); }, 2000);
                                        }
                                        else{
                                            //Guardamos el cambio y refrescamos el formulario
                                            formContext.data.entity.save();
                                            setTimeout(function () {
                                                Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);
                                            }, 2000);
                                        }
                                    }
                                    else{
                                        //Son distintos, alertamos que se cerrará la ventana y cerramos
                                        var alertStrings = { confirmButtonLabel: "Aceptar", title: "Cambio de responsable", text: "El caso pasó a gestión de un nuevo usuario. La ventana se cerrará"};
                                        var alertOptions = { height: 120, width: 260 };
                                        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                            function (success) {
                                                //console.log("Alert dialog closed");
                                                Xrm.Utility.closeProgressIndicator();

                                                if (AvanzaEta01SubRequerimientoFraude){
                                                    // antes de guardar el nuevo propietario y etapa, guarda los posibles cambios que estén a nivel de formulario.
                                                    formContext.data.entity.save();
                                                    SDK.WEBAPI.updateRecordImpersonate(executionContext, idIncident.replace(/[{}]/g, ""), oIncidentUPD, "incident", RepositorioSucesos.Package.UsuarioAdminID, null, null);

                                                    var CasoPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
                                                
                                                    var entityFormOptions = {};
                                                    entityFormOptions["entityName"] = "incident";
                                                    entityFormOptions["entityId"] = CasoPrincipal[0].id.replace(/[{}]/g, "");
                                                    entityFormOptions["openInNewWindow"] = false;
                                                    var formParameters = {};
                                                    setTimeout(function () { Xrm.Navigation.openForm(entityFormOptions, formParameters); }, 2000);

                                                    //setTimeout(function () {
                                                    //    JumpStartLibXRM.Fx.formClose(executionContext);
                                                    //}, 2000);
                                                }
                                                else{
                                                    JumpStartLibXRM.Fx.formSaveAndClose(executionContext);
                                                }
                                            },
                                            function (error) {
                                            Xrm.Utility.closeProgressIndicator();
                                                //console.log(error.message);
                                            }
                                        );                            
                                    }	
                                }	
                            }
                            else {
                                // problema con api
                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Reintentar", text: "No se pudo procesar el avance del caso. Favor intente nuevamente o contacte al administrador"};
                                var alertOptions = { height: 120, width: 260 };
                                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then( function (success) { }, function (error) { } );
                            }
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
    
        SUC0002:function(executionContext){
            RepositorioSucesos.PopUp = 0;
            globalEC = executionContext;
            let codigoAccion = _modelo.codigoAccion;
            let casoId = _modelo.casoId;
            //20211130 - se pidio en pruebas de Fraude borrar la respuesta de cliente para todos los Masivos
            //JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_respuestacliente", null);
            JumpStartLibXRM.Fx.formSave(executionContext);
            let rutaAPI = '/respuestaPredefinida/GetRespuestasPredefinidasByIncident/' + casoId;
    
            RepositorioSucesos.apiGet(rutaAPI, function (data) {
                if (data && data.success) 
                {                
                    if(RepositorioSucesos.PopUp == 0)
                    {
                        RepositorioSucesos.PopUp = RepositorioSucesos.PopUp + 1;
                        RepositorioSucesos.Context.ExecutionContext = executionContext;
                        RepositorioSucesos.Context.FormContext = executionContext.getFormContext();
                        RepositorioSucesos.Package.Data = data;
                        RepositorioSucesos.Package.CasoId = casoId;                    
                        RepositorioSucesos.Package.ExecutionContext = executionContext;
                        RepositorioSucesos.Package.ExtCasoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_extensioncaso");
                        
    //                    var packageDetails = new Object();
    //                    packageDetails = {"data": RepositorioSucesos.Package.Data, "CasoId": RepositorioSucesos.Package.CasoId, "ExecutionContext": RepositorioSucesos.Package.ExecutionContext};
    //                    var packageJSON = JSON.stringify(packageDetails);
    //                    sessionStorage.setItem("RepositorioSucesoPackage", packageJSON);
                        
                        var pageInput = {
                            pageType: "webresource",
                            webresourceName: "xmsbs_editorVisorRespuestaPredefinida"
                        };
                        var navigationOptions = {
                            target: 2,
                            width: 800,
                            height: 600,
                            position: 1
                        };
                        Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function success()
                        {}, function error()
                        {});
    
    //                    var gonData = encodeURIComponent("idCaso=" + casoId + "");
    //                    
    //                    var packageJSON = JSON.stringify(RepositorioSucesos.Package);
    //                    sessionStorage.setItem("RepositorioSucesoPackage", packageJSON);
    //                    
    //                    var windowOptions = {
    //                        openInNewWindow: true,
    //                        height: 600,
    //                        width: 800,
    //                        position: 1
    //                    };
    //
    //                    
    //                    Xrm.Navigation.openWebResource("xmsbs_editorVisorRespuestaPredefinida", windowOptions);
                    }                
                }
            });
        },
    
        SUC0003:function(executionContext){
            //crear visación (La ejecución del suceso es por Flow)
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_crearvisacion", true);
        },
    
        SUC0004: function (executionContext) {
            //Aprobar Visado (La ejecución del suceso es por Flow)
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_visado", true);
        },
    
        SUC0005: function (executionContext) {
            //Reparar visado (La ejecución del suceso es por Flow)
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_repararvisado", true);
        },
    
        SUC0006: function (executionContext) {
            //Hace click en solicitar prorroga
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Prorroga", subtitle:"Va a generar una solicitud de prorroga al Caso. ¿Desea Continuar?"};
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed)
                    {
                        //Si confirma
                        var entityFormOptions = {};
                        entityFormOptions["entityName"] = "xmsbs_prorroga";
                        entityFormOptions["openInNewWindow"] = false;
                        
                        var formParameters = {};
                        
                        //Set lookup field
                        var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
                        if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
                        
                        formParameters["xmsbs_casorelacionado"] = incidentId;
                        formParameters["xmsbs_casorelacionadoname"] = JumpStartLibXRM.Fx.getValueField(executionContext, "title", null);
    
                        formParameters["xmsbs_bitacoraactual"] = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_bitacoraactual");
                        formParameters["xmsbs_bitacoraactualname"] = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_bitacoraactual", null);
                        
                        var formContext = executionContext.getFormContext();
                        formContext.data.save().then( 
                            function success(result) {
                                // Open the form
                                Xrm.Utility.openEntityForm("xmsbs_prorroga", null, formParameters, entityFormOptions);
                            }
                        );
                        
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
    
        SUC0007: function (executionContext) {
            var registroQuebranto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_registroquebranto");
            if(registroQuebranto){ //El registro ya existe
                var detalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
                if (detalleID.indexOf("{") > -1){detalleID = detalleID.substring(1, 37);}
                var resultado = RepositorioSucesos.tipoReclamoDetalleOperacion(executionContext, detalleID);
                if(resultado){
                    var tipoReclamo = resultado.xmsbs_tiporeclamo;
                    if(tipoReclamo == 657130001){ //El quebranto es de masivos
                        //Si ya hay quebranto y además es de masivos, debemos avisar que lo va a abrir
                        var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Quebranto Existente", subtitle:"Va a abrir el registro de Quebranto anterior para ser modificado. ¿Desea Continuar?"};
                        var confirmOptions  = { height: 200, width: 260 };
                        Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                            function (success) {
                                if(success.confirmed)
                                {
                                    //Si confirma
                                    if (registroQuebranto.indexOf("{") > -1){registroQuebranto = registroQuebranto.substring(1, 37);}
                                    var entityFormOptions = {};
                                    entityFormOptions["entityName"] = "xmsbs_reversocastigo";
                                    entityFormOptions["openInNewWindow"] = false;
                                    entityFormOptions["entityId"] = registroQuebranto;
    
                                    // Open the form.
                                    Xrm.Navigation.openForm(entityFormOptions).then(
                                        function (success) {
                                            console.log(success);
                                        },
                                        function (error) {
                                            console.log(error);
                                        });
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
                }
            }
            else{
                //Solicitud de reverso y castigo
                var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Reverso y Castigo", subtitle:"Va a iniciar una solicitud de Reverso y Castigo. ¿Desea Continuar?"};
                var confirmOptions  = { height: 200, width: 260 };
                Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                    function (success) 
                    {
                        if(success.confirmed)
                        {
                            //Si confirma
                            var entityFormOptions = {};
                            entityFormOptions["entityName"] = "xmsbs_reversocastigo";
                            entityFormOptions["openInNewWindow"] = false;
                            
                            var formParameters = {};
                            
                            //Set lookup field
                            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
                            if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
    
                            var solicitanteId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_cliente");
                            if (solicitanteId.indexOf("{") > -1){solicitanteId = solicitanteId.substring(1, 37);}
                            var solicitanteName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_cliente");
                            
                            formParameters["xmsbs_casorelacionado"] = incidentId;
                            formParameters["xmsbs_casorelacionadoname"] = JumpStartLibXRM.Fx.getValueField(executionContext, "title", null);
                            formParameters["xmsbs_cliente"] = solicitanteId;
                            formParameters["xmsbs_clientename"] = solicitanteName;
                            formParameters["xmsbs_ndelcaso"] = JumpStartLibXRM.Fx.getValueField(executionContext, "ticketnumber", null);
                            formParameters["xmsbs_rutcliente"] = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
                            formParameters["xmsbs_numerocorrelativo"] = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_numerocorrelativo", null);
                            
                            //vemos si el Reverso y Castigo solo debe ser creado y nada mas.
                            //Primero vemos si viene de adquirencia
                            var productoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_producto");
                            if(productoName == "Adquirencia"){
                                formParameters["xmsbs_esquebrantoadquirencia"] = true; // Para que alguardar, no se gatille ninguna aprobación o validación
                            }
                            //Segundo, vemos si es masivo para que tampoco haga nada.
                            var detalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
                            if (detalleID.indexOf("{") > -1){detalleID = detalleID.substring(1, 37);}
                            var resultado = RepositorioSucesos.tipoReclamoDetalleOperacion(executionContext, detalleID);
                            if(resultado){
                                var tipoReclamo = resultado.xmsbs_tiporeclamo;
                                var quebrantoGSC = resultado.xmsbs_quebrantogsc;
                                if(tipoReclamo == 657130001 && !quebrantoGSC){ //Masivo y no es para la GSC
                                    formParameters["xmsbs_esquebrantoadquirencia"] = true; // Para que alguardar, no se gatille ninguna aprobación o validación
                                    formParameters["xmsbs_tipodereclamo"] = "657130001"; // Para que el formulario solo se despliegue con los campos de montos
                                    formParameters["xmsbs_quebrantogsc"] = false;
                                }
                                else{
                                    if(tipoReclamo == 657130001 && quebrantoGSC){ //Masivo y si es para la GSC
                                        formParameters["xmsbs_tipodereclamo"] = "657130001"; // Para que el formulario solo se despliegue con los campos de montos
                                        formParameters["xmsbs_quebrantogsc"] = true;
                                        
                                        //Validamos si es de la tipología No Estandar
                                        var producto = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_familiaproducto");
                                        if(producto == "No Estandarizado"){	
                                            //Modificamos el tipo de reclamo para que las aprobaciones entren por GSC
                                            formParameters["xmsbs_tipodereclamo"] = "657130002";
                                            var resultado = RepositorioSucesos.buscarBitacoraEtapaCaso(executionContext, incidentId);
                                            if(resultado && resultado.value.length > 1){
                                                formParameters["xmsbs_bitacoraetapadelcaso"] = resultado.value[0].xmsbs_bitacoraetapaid;
                                                formParameters["xmsbs_bitacoraetapadelcasoname"] = resultado.value[0].xmsbs_name;
                                            }
                                            else{
                                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Bitacora en proceso", text: "Favor espere unos segundos y vuelva a intentar la generación del Quebranto GSC"};
                                                var alertOptions = { height: 120, width: 260 };
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
                                        }
                                    }
                                    else{
                                        if(tipoReclamo == 657130000){
                                            formParameters["xmsbs_tipodereclamo"] = "657130000";
                                        }
                                    }
                                }
                            }
                            
                            var formContext = executionContext.getFormContext();
                            formContext.data.save().then( 
                                function success(result) {
                                    // Open the form
                                    Xrm.Utility.openEntityForm("xmsbs_reversocastigo", null, formParameters, entityFormOptions);
                                }
                            );
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
    
        SUC0008: function () {
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Suceso 8", text: "Suceso 8"};
            var alertOptions = { height: 120, width: 260 };
            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                function (success) {
                    //console.log("Alert dialog closed");
                },
                function (error) {
                    //console.log(error.message);
                }
            );
        },
    
        SUC0009: function (executionContext) {
            //Crear subrequerimiento
    
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Subrequerimiento", subtitle:"Va a crear un subrequerimiento asociado a este Caso. ¿Desea Continuar?"};
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed)
                    {
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
                        
                        //Sucursal
                        var SucursalId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_sucursalcliente");
                        if(SucursalId){
                            if (SucursalId.indexOf("{") > -1){SucursalId = SucursalId.substring(1, 37);}
                            var SucursalName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_sucursalcliente");
                        }
    
                        //Segmento
                        var SegmentoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_segmentocliente");
                        if(SegmentoId){
                            if (SegmentoId.indexOf("{") > -1){SegmentoId = SegmentoId.substring(1, 37);}
                            var SegmentoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_segmentocliente");
                        }
                        
                        //Subsegmento
                        var SubsegmentoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_subsegmentocliente");
                        if(SubsegmentoId){
                            if (SubsegmentoId.indexOf("{") > -1){SubsegmentoId = SubsegmentoId.substring(1, 37);}
                            var SubsegmentoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_subsegmentocliente");
                        }
                        
                        //Ejecutivo
                        var ejecutivo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_ejecutivocliente", null);
                        
                        //Para enviar subrequerimiento de Hipotecario en Duro en caso que corresponda
                        
                        //Set lookup Producto
                        var ProductoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto");
                        if (ProductoId.indexOf("{") > -1){ProductoId = ProductoId.substring(1, 37);}
                        var ProductoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_producto");
    
                        //Set lookup Tipo y Detalle
                    	//var DetalleOperacion = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_detalledeoperacion");
                        var codigoTipologia = "";
                        var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
    
                        var solucion = "";

                        if(detalleOperacionID){
                            var resultado = RepositorioSucesos.buscarDetalleOperacion(executionContext, detalleOperacionID);
                            if(resultado){
                                var codigoDO = resultado.xmsbs_codigo;
                                if(codigoDO){
                                    if(ProductoName.toLowerCase() == "hipotecario" && (codigoDO == "DO-0764" || codigoDO == "DO-0761" || codigoDO == "DO-0760" || codigoDO == "DO-0775" || codigoDO == "DO-0766")){
                                        codigoTipologia = "TD-0764";
                                    }
                                    else if (ProductoName.toLowerCase() == "seguros")
                                    {
                                        if (codigoDO == "DO-1235" || codigoDO == "DO-1087" || codigoDO == "DO-1234")
                                            codigoTipologia = "TD-1022";
                                    }
                                    else if (ProductoName.toLowerCase() == "leasing")
                                    {
                                        if (codigoDO == "DO-1253")
                                            codigoTipologia = "TD-1254";
                                        else if (codigoDO == "DO-1279")
                                            codigoTipologia = "TD-1280";
                                    }
									
									// Fraude 3.0
									if (codigoDO == "DO-1472" || codigoDO == "DO-1473" || codigoDO == "DO-1474")
									{
										var ResolucionCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_picklist4g_texto", null);
										// Demanda con abono normativo;Demanda sin abono normativo

										if (ResolucionCaso){
											if (codigoDO == "DO-1472")
											{
												if (ResolucionCaso == "Demanda con abono normativo")
													codigoTipologia = "TD-1500";
												else if (ResolucionCaso == "Demanda sin abono normativo")
													codigoTipologia = "TD-1499";
											}
											else if (codigoDO == "DO-1473")
											{
												if (ResolucionCaso == "Demanda con abono normativo")
													codigoTipologia = "TD-1501";
												else if (ResolucionCaso == "Demanda sin abono normativo")
													codigoTipologia = "TD-1502";
											}
											else if (codigoDO == "DO-1474")
											{
												if (ResolucionCaso == "Demanda con abono normativo")
													codigoTipologia = "TD-1503";
												else if (ResolucionCaso == "Demanda sin abono normativo")
													codigoTipologia = "TD-1504";
											}
										}
										
										// si es FRAUDE, sobreescribe el Canal de Ingreso: siempre será: OTROS CANALES e71e8827-1da9-eb11-b1ac-000d3ab7dc6d
										PuntoContactoId = "e71e8827-1da9-eb11-b1ac-000d3ab7dc6d";
										PuntoContactoName = "OTROS CANALES";

                                        solucion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_picklist4g_texto", null);
									}
									// FIN - Fraude 3.0									
                                }
                            }
                        }
                        
                        if(codigoTipologia != ""){
                            var respuesta = RepositorioSucesos.buscaTipoDetalle(executionContext, codigoTipologia);
                            if(respuesta){
                            //Completamo el tipodetalleoperación
                                var TipoDetalleEspecificoName = respuesta.value[0].xmsbs_name;
                                var TipoDetalleEspecificoId = respuesta.value[0].xmsbs_tipoydetalledeoperacionid;
                                //if (TipoDetalleEspecificoId.indexOf("{") > -1){TipoDetalleEspecificoId = TipoDetalleEspecificoId.substring(1, 37);}
                            }
                        }
    
                        //Resto de campos
                        var tipoDocumento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodocumento", null);
                        var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
                        var observaciones = JumpStartLibXRM.Fx.getValueField(executionContext, "description", null);
                        
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
                        formParameters["xmsbs_tipodocumento"] = tipoDocumento;
                        //formParameters["description"] = observaciones;
                        if (solucion != "")
                            formParameters["xmsbs_solucionesperada"] = solucion;
                        formParameters["prioritycode"] = 1;
                        formParameters["xmsbs_puntodecontacto"] = PuntoContactoId;
                        formParameters["xmsbs_puntodecontactoname"] = PuntoContactoName;
                        
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
                        
                        formParameters["xmsbs_ejecutivocliente"] = ejecutivo;
                        formParameters["title"] = "Caso pendiente de ingreso";
                        //formParameters["xmsbs_ingresounicofinalizado"] = true;
                        
                        if(codigoTipologia != ""){
                            //Si código tipología es distinto de vacío, significa que es de hipotecario subrequerimiento especial
                            formParameters["xmsbs_producto"] = ProductoId;
                            formParameters["xmsbs_productoname"] = ProductoName;
                            formParameters["xmsbs_detalledetipologia"] = TipoDetalleEspecificoId;
                            formParameters["xmsbs_detalledetipologianame"] = TipoDetalleEspecificoName;   
                        }
                        
                        var formContext = executionContext.getFormContext();
                        formContext.data.save().then( 
                            function success(result) {
                                // Open the form
                                Xrm.Utility.openEntityForm("incident", null, formParameters, entityFormOptions);  
                            }
                        );  			
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
    
        SUC0010: function (executionContext) {
            globalEC=executionContext;
            let casoId = _modelo.casoId;
            let currentContent= JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_respuestacliente");
            let plantillaSeleccionada = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_plantillaelegida");
            let metadatosRespuesta = Caso.buscarMetadatosRespuestaCaso(globalEC, casoId);
            
            let referenciaCasoSolicitante="";
            let derivadoA="";
            let nombreContactoBanco="";
            let cargoContactoBanco="";
            let telefonoContactoBanco="";
            let emailContactoBanco="";
            let nombreDestinatario="";
            let prefijoDestinatario="";
            let cargoDestinatario="";
            
            if(metadatosRespuesta.value.length>0){
                referenciaCasoSolicitante=metadatosRespuesta.value[0].xmsbs_referenciacasosolicitante;
                derivadoA=metadatosRespuesta.value[0].xmsbs_derivadoa;
                nombreContactoBanco=metadatosRespuesta.value[0].xmsbs_tomarcontactonombre;
                cargoContactoBanco=metadatosRespuesta.value[0].xmsbs_tomarcontactocargo;
                telefonoContactoBanco=metadatosRespuesta.value[0].xmsbs_telefonocontactobanco;
                emailContactoBanco=metadatosRespuesta.value[0].xmsbs_correocontactobanco;
                nombreDestinatario=metadatosRespuesta.value[0].xmsbs_nombrecontactosernac;
                prefijoDestinatario=metadatosRespuesta.value[0].xmsbs_prefijodestinatario;
                cargoDestinatario=metadatosRespuesta.value[0].xmsbs_cargodestinatario;
            }
            
            let package = {
                contenido: currentContent,
                casoId: casoId,
                referenciaCasoSolicitante: referenciaCasoSolicitante,
                derivadoA: derivadoA,
                nombreContactoBanco: nombreContactoBanco,
                cargoContactoBanco: cargoContactoBanco,
                telefonoContactoBanco: telefonoContactoBanco,
                emailContactoBanco: emailContactoBanco,
                nombreDestinatario: nombreDestinatario,
                plantillaSeleccionada: plantillaSeleccionada,
                prefijoDestinatario: prefijoDestinatario,
                cargoDestinatario: cargoDestinatario
            }
                 
            RepositorioSucesos.Context.ExecutionContext = executionContext;
            RepositorioSucesos.Context.FormContext = executionContext.getFormContext();
            RepositorioSucesos.Package.Data = package;
            
            var pageInput = {
                pageType: "webresource",
                webresourceName: "xmsbs_editorPreviewRespuestasFormales"
            };
            var navigationOptions = {
                target: 2,
                width: 960,
                height: 760,
                position: 1
            };
            Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function success()
            {}, function error()
            {});
        },
        
        SUC0011: function () {
            let _modeloApi = {
                idIncident: _modelo.casoId,
                idPlantilla: null,
                content: null
            };
            let rutaAPI = '/Caso/GetPDFRespuestaManualCaso/';
            RepositorioSucesos.apiPost(rutaAPI, _modeloApi, function (data) {
                if (data && data.success) {
                    let params = 'scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no, width=950,height=700,left=100,top=100';
                    let domain = 'https://midaschiledesa.crm2.dynamics.com//WebResources/xmsbs_previewDocumento';
					//let domain = 'https://midaschilehomologacion.crm2.dynamics.com//WebResources/xmsbs_previewDocumento';
					//let domain = 'https://midaschilepro.crm2.dynamics.com//WebResources/xmsbs_previewDocumento';
                    var pop = window.open(domain, 'test', params);
                    let package = {
                        contenido: "data:application/pdf;base64, " +data.respuestaPDFEmailBase64,
                        casoId: _modelo.casoId,
                        canWrite: false
                    }
                    let timer = setInterval(function () {
                        var message = 'llegamos';
                        console.log('blog.local:  sending message:  ' + message);
                        pop.postMessage(package, domain); //send the message and target URI
                    }, 1000);
                    window.addEventListener('message', function (event) {
                        if (event) {
                            clearInterval(timer);
                        }
    
                    }, false);               
                }
                else{
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: data.message};
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
            });
        },
    
        SUC0012: function () {
            let _modeloApi = {
                idIncident: _modelo.idIncident,
                idPlantilla: null,
                content: null
            };
            let rutaAPI = '/Caso/GenerarRespuestaManualCaso/';
            RepositorioSucesos.apiPost(rutaAPI, _modeloApi, function (data) {
                if (data && data.success) {
                    let pdfWindow = window.open("")
                    pdfWindow.document.write(
                        "<iframe width='100%' height='100%' src='data:application/pdf;base64, " +
                        encodeURI(data.respuestaPDFEmailBase64) + "'></iframe>"
                    )
                }
            });
        },
    
        SUC0013: function (executionContext, modelo) {
            //Hace click en cierre del caso        
            var formContext = executionContext.getFormContext();
            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
            
            if (incidentId.indexOf("{") > -1)
            {
                incidentId = incidentId.substring(1, 37);
            }
            
            var _adquirencia = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_producto", null);
            
            var validaDocumentos = Caso.validateDocumentos(executionContext, incidentId);
            if (validaDocumentos.success == true)                
            {
                var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Cierre de Caso", subtitle:"Va a iniciar el cierre del caso. ¿Desea Continuar?"};
                var confirmOptions  = { height: 200, width: 260 };
                Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                    function (success) {
                        if(success.confirmed)
                        {
                            var formValido = JumpStartLibXRM.Fx.FormGetIsDirty(executionContext);
                            if(!formValido)
                            {             
                                //Xrm.Utility.showProgressIndicator("Procesando");
                                RepositorioSucesos.mostrarIndicadorProgreso("Procesando");

                                debugger;

                                // Solo para SubRequerimientos Fraude se Realiza el Cierre con el estado "Juicio Finalizado" y NO envía notificaciones
                                // 31d7b247-d58c-f011-b4cb-000d3ac0d3a3 ; FS945 Sub-Requerimiento Fraude 3.0 Base 1
                                var flujoid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_flujosantander").replace(/[{}]/g, "").toUpperCase();
                                if (flujoid == "31D7B247-D58C-F011-B4CB-000D3AC0D3A3"){
                                    
                                    var objCaso = {};
                                    objCaso["xmsbs_aux_status"] = 657130013; // 657130013: Juicio Finalizado
                                    //objCaso["xmsbs_correodecierreenviado"] = true; 
                                    SDK.WEBAPI.updateRecordImpersonate(executionContext, incidentId, objCaso, "incident", RepositorioSucesos.Package.UsuarioAdminID, null, null);

                                    RepositorioSucesos.ocultarIndicadorProgreso();

                                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Mensaje", text: "El Caso queda con estado: Juicio Finalizado."};
                                    var alertOptions = { height: 120, width: 260 };
                                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                        function (success) {
                                            Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), incidentId);
                                        },
                                        function (error) {
                                            //console.log(error.message);
                                        }
                                    );


                                }
                                else{
                                    debugger;

                                    // por dificultades al pasar la API a PROD se comenta el uso de "/Caso/ResolverCaso" y se implementa directamente en JS

                                    //let rutaAPI = '/Caso/ResolverCaso';
                                    //var request = { IdIncident: incidentId, Estado: 1, RazonEstado: 1 };
                                    //RepositorioSucesos.apiPost(rutaAPI, request, function (data) {                                
                                    //    if (data.success) {
                                    //        if(_adquirencia != null && _adquirencia.toLowerCase() == "adquirencia")
                                    //            RepositorioSucesos.EnviarNotificacionCierreAdquirencia(formContext, incidentId);
                                    //        else
                                    //            RepositorioSucesos.EnviarNotificacionesCierreCliente(formContext, incidentId, modelo.accionEtapaId, true);
                                    //    }
                                    //    else {
                                    //        var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: data.message};
                                    //        var alertOptions = { height: 120, width: 260 };
                                    //        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then( function (success) { }, function (error) { } );
                                    //    }
                                    //});



                                    // para cuando es un Caso Fraude, se omite la validación de SubRequerimientos
                                    var DOid = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion").replace(/[{}]/g, "").toLowerCase();
                                    if (DOid != "ac823ec0-e919-ef11-9f89-000d3ad8d133" && // DO-1472
                                        DOid != "f33f8ce8-ea19-ef11-9f89-000d3ad8d133" && // DO-1473
                                        DOid != "08570bff-eb19-ef11-9f89-000d3ad8d133") // DO-1474
                                    {
                                        // evalúa subRequerimientos 
                                        var oSubReq = RepositorioSucesos.buscarSubRequerimientoActivo(executionContext, incidentId);
                                        if (oSubReq.value.length > 0)
                                        {
                                            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: "No se puede resolver el caso, completar los subrequerimientos."};
                                            var alertOptions = { height: 120, width: 260 };
                                            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then( function (success) { }, function (error) { } );
                                            return;
                                        }
                                    }

                                    var objCaso = {};
                                    objCaso["xmsbs_aux_status"] = 1; // 1: Finalizado
                                    objCaso["xmsbs_correodecierreenviado"] = true;
                                    SDK.WEBAPI.updateRecordImpersonate(executionContext, incidentId, objCaso, "incident", RepositorioSucesos.Package.UsuarioAdminID, null, null);

                                    // N/A: CrearCasoNEO

                                    if(_adquirencia != null && _adquirencia.toLowerCase() == "adquirencia")
                                        RepositorioSucesos.EnviarNotificacionCierreAdquirencia(formContext, incidentId);
                                    else
                                        RepositorioSucesos.EnviarNotificacionesCierreCliente(formContext, incidentId, modelo.accionEtapaId, true);                                    
                                }
                            }
                            else
                            {
                                alert("Guardar registro antes de resolver el caso.")
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
            }
            else
            {
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error de Validación", text: validaDocumentos.message};
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
    
        SUC0014: function (executionContext, modelo) {
            let _titulo = "";        
            let _subtitulo = "";        
            let _texto = "";
            
            var formContext = executionContext.getFormContext();
            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
            
            if (incidentId.indexOf("{") > -1)
            {
                incidentId = incidentId.substring(1, 37);
            }
            
            var _cartaRespuestaSubido = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_cartarespuestasubido", false);
            
            if(!_cartaRespuestaSubido)
            {
                _titulo = "Generar PDF y Cierre de Caso";
                _subtitulo = "Va Generar la respuesta en PDF del caso y va a iniciar el cierre del caso. ¿Desea Continuar?";
                _texto = "Esta acción demorará unos segundos en generar el archivo y en cerrar el caso.";
            }
            else
            {
                _titulo = "Cierre de Caso";
                _subtitulo = "La respuesta ya se encuentra generada. Puede descargarla desde el registro de respuesta. Va a iniciar el cierre del caso. ¿Desea Continuar?";
                _texto = "Esta acción demorará unos segundos en cerrar el caso.";
            }    
        
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: _titulo, subtitle: _subtitulo, text: _texto};
            var confirmOptions  = { height: 250, width: 300 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) 
                {
                    if(success.confirmed)
                    {
                        if(!_cartaRespuestaSubido)
                        {
                            let _modeloApi = {
                                idIncident: _modelo.casoId,
                                idPlantilla: null,
                                content: null
                            };
                            
                            let rutaAPI = '/Caso/GenerarRespuestaManualCaso/';
                            RepositorioSucesos.apiPost(rutaAPI, _modeloApi, function (data) {
                                if (data && data.success) 
                                {
                                    var fileName = "respuesta_formales.pdf";
                                    RepositorioSucesos.downloadBase64File(data.respuestaPDFEmailBase64, fileName);
                                    executionContext.getFormContext().getControl("DocumentosDelCaso").refresh();
                                    
                                    RepositorioSucesos.ResolverCaso(executionContext, modelo);
                                }
                                else
                                {
                                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: data.message};
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
                            });
                        }
                        else
                        {
                            RepositorioSucesos.ResolverCaso(executionContext, modelo);
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
            
        SUC0015: function (executionContext) {
            //inicia WF de re-insistir
            //JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_marcaespecial", 657130000);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_marcareinsistencia", true);
        },		
        
        SUC0016:function(executionContext, formContext, modelo){
            //Hace click en retroceder (Reparar, Reinsistir, etc) 
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Retrocede el caso", subtitle:"Va a enviar el Caso a la etapa anterior. ¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos" };
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed)
                    {
                        //Si confirma
                        //Parámetros del servicio
                        var idIncident = modelo.casoId;
                        var idAccionEtapa = modelo.accionEtapaId;
                        var codigoSuceso = "SUC0001";
                        
                        //llamada al servicio
                        var response = null;
                        
                        var URL= "/Caso/EjecutarSuceso/"+idIncident+"/"+idAccionEtapa+"/"+codigoSuceso+"";
                       // var apiToken = window.sessionStorage.getItem("LokiAuthToken");
                        var service = RepositorioSucesos.GetRequestObject();
                        if (service != null)
                        {
                            service.open("POST", RepositorioSucesos.URL.Azure + URL, false);
                            service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                            service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                            service.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
                            //service.setRequestHeader("TokenApi", apiToken);
                            service.send(null);
                            if (service.response != "") 
                            {
                                response = JSON.parse(service.response);
                            }
                        }
                        if (response.success)
                        {
                            //actualizar etapa
                            var fieldName = "xmsbs_etapa";
                            var id = response.suC0001.etapa.id;
                            var name = response.suC0001.etapa.name;
                            var entityType = response.suC0001.etapa.logicalName;
                            var etapa = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                            
                            //actualizar Acción 
                            var fieldName = "xmsbs_accion";
                            var id = response.suC0001.accion.id;
                            var name = response.suC0001.accion.name;
                            var entityType = response.suC0001.accion.logicalName;
                            var flujo = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                            
                            //actualizar propietario
                            var fieldName = "ownerid";
                            var id = response.suC0001.propietario.id;
                            var name = response.suC0001.propietario.name;
                            var entityType = response.suC0001.propietario.logicalName;
                            var propietario = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                            
                            //Rol - lookup
                                if(response.suC0001.rol != null){
                                    if(response.suC0001.rol.name != ""){
                                        var fieldName = "xmsbs_rol";
                                        var id = response.suC0001.rol.id;
                                        var name = response.suC0001.rol.name;
                                        var entityType = response.suC0001.rol.logicalName;
                                        var flujo = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                                    }
                                }
                            
                            //actualizar UR 
                            var fieldName = "xmsbs_ur";
                            var id = response.suC0001.ur.id;
                            var name = response.suC0001.ur.name;
                            var entityType = response.suC0001.ur.logicalName;
                            var flujo = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                            
                            //actualizar Razón para el estado
                            JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", response.suC0001.estado);
                            
                            //Validamos si cambiamos de usuario para cerrar ventana o refrescar
                            var currentUserId = JumpStartLibXRM.Fx.getUserId();
                            if (currentUserId.indexOf("{") > -1){currentUserId = currentUserId.substring(1, 37);}
                            var newUserID = response.suC0001.propietario.id;
                            if (newUserID.indexOf("{") > -1){newUserID = newUserID.substring(1, 37);}
                            
                            if(currentUserId.toLowerCase() == newUserID.toLowerCase()){
                                //Son iguales, hacemos el refresco normal
                                var entityFormOptions = {};
                                entityFormOptions["entityName"] = formContext.data.entity.getEntityName();
                                entityFormOptions["entityId"] = idIncident;
                                
                                //Guardamos el cambio y refrescamos el formulario
                                formContext.data.entity.save();
                                let timer = setInterval(function () {
                                    Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);
                                }, 2000);
                            }
                            else{
                                //Son distintos, alertamos que se cerrará la ventana y cerramos
                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Cambio de responsable", text: "El caso pasó a gestión de un nuevo usuario. La ventana se cerrará"};
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
        
        SUC0017: function (executionContext, modelo) {
            //Cancelar el caso
            var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);  
            if(estado == 1 || estado == 657130002){ //En ingreso o espera de documento
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: "El caso aún no ha sido derivado a una UR. No puede Terminar sin Gestión"};
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        //console.log("Alert dialog closed");
                        formContext.getControl("xmsbs_observacionesdevisacion").setFocus();
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
            else{
                var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Cancelar el caso", subtitle:"Va a cancelar el caso. ¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos" };
                var confirmOptions  = { height: 200, width: 260 };
                Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                    function (success) {
                        if(success.confirmed)
                        {   
                            //var _response = RepositorioSucesos.EnviarNotificacionesCliente(modelo.casoId, modelo.accionEtapaId);
                            //setTimeout(function () {
                                //OCultar botonera
                                //executionContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false); //Botonera		
                                //JumpStartLibXRM.Fx.hideShowSection(executionContext,"general","general_section_botonera",false);					
    
                                //Marco el caso como rechazado
                                //JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", 2);
    
                                //Guardamos el cambio
                                //JumpStartLibXRM.Fx.formSave(executionContext);
                            //}, 2000);		
                            
                            RepositorioSucesos.Context.ExecutionContext = executionContext;
                            RepositorioSucesos.Context.FormContext = executionContext.getFormContext();
                            RepositorioSucesos.Package.CasoId = modelo.casoId;
                            RepositorioSucesos.Package.AccionEtapaId = modelo.accionEtapaId;
                            
                            var pageInput = {
                                pageType: "webresource",
                                webresourceName: "xmsbs_bitacoraTerminoSinGestion"
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
    
        SUC0018:function(executionContext, formContext, modelo){
            var idIncident = modelo.casoId;
            var idAccionEtapa = modelo.accionEtapaId;
            var codigoSuceso = "SUC0018";
            
            var idUR = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_ur");
            let rutaAPI = "/MantenedorWeb/GetUnidadResolutora?idUR=" + idUR;
    
            RepositorioSucesos.apiGet(rutaAPI, function (data) {
                if (data && data.success) 
                {              
                    RepositorioSucesos.Context.ExecutionContext = executionContext;
                    RepositorioSucesos.Context.FormContext = executionContext.getFormContext();
                    RepositorioSucesos.Package.Data = data;
                    RepositorioSucesos.Package.CasoId = idIncident;
                    RepositorioSucesos.Package.AccionEtapaId = idAccionEtapa;
                    RepositorioSucesos.Package.CodigoSuceso = codigoSuceso;
                    
                    var pageInput = {
                        pageType: "webresource",
                        webresourceName: "xmsbs_derivarur"
                    };
                    var navigationOptions = {
                        target: 2,
                        width: 500,
                        height: 250,
                        position: 1
                    };
                    Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function success()
                    {}, function error()
                    {});
                }
                else
                {
                    alert(data.message);
                }
            });
        },
        
        SUC0019:function(executionContext, formContext, modelo){
            //Hace click en retroceder (Reparar, Reinsistir, etc)
            var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);  
            var adquirencia = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_institucion", null);
            var esAdquirencia = (adquirencia == "{443E67E1-F271-EB11-A812-00224809A412}");
            
            if(estado == 3 && !esAdquirencia){
                // El caso ahora está en reparo y se apretó el botón reparar. Se envía alerta de que no puede
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: "El caso está en reparo y no puede volver a Reparar. Debe corregir el reparo y avanzar el caso"};
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
            else{
                //Validamos que el caso no sea de origen Motor Web y que el reparo sea a la etapa 1
                var canalDeIngreso = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_puntodecontacto");
                var NombreEtapa = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_etapa");
                var ordenEtapa = "";
                var permiteReparo = true;   
            
                var etapaId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_etapa");
                if (etapaId.indexOf("{") > -1){etapaId = etapaId.substring(1, 37);}
                var respuesta = RepositorioSucesos.ordenEtapa(executionContext, etapaId);
                if(respuesta){ordenEtapa = respuesta.xmsbs_orden;}
                
                var CanalID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_puntodecontacto");
                if (CanalID.indexOf("{") > -1){CanalID = CanalID.substring(1, 37);}
                var respuestaPC = RepositorioSucesos.buscaPuntoContacto(executionContext, CanalID);
                if(respuestaPC){permiteReparo = respuestaPC.xmsbs_permitereparo;}			
                
                if(permiteReparo == false && (ordenEtapa == 2 || (ordenEtapa != 2 && !NombreEtapa.toLowerCase().includes("respuesta")))){
                
                    //El usuario apretó reparo, el caso es de motor web o Digitalizacion HB quiere reparar al ingresador (usuario Dynamics). No puede reparar a la etapa 1 por canal de ingreso
    
                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: "El canal de ingreso no permite que el caso sea reparado en esta etapa."};
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
                else{
                    
                    // si es adquirencia, y el DO está marcado con un "ID Stock Adquirencia", 
                    // y si el reparo es a una etapa en donde el campo indicado en el DO "Campo Cantidad Solicitada" es editable, 
                    // entonces advierte que además de retroceder, liberará X unidades, las que se sumarán al STOCK de [Nombre ].
                    var MensajeStockAdquirencia = "";
                    if (esAdquirencia) {
                        MensajeStockAdquirencia = RepositorioSucesos.MensajeDevuelveStockAdquirencia(executionContext, modelo.accionEtapaId);
                    }
                    
                    var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Retrocede el caso", subtitle:"Va a enviar el Caso a la etapa anterior. " + MensajeStockAdquirencia + "¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos" };
                    var confirmOptions  = { height: 200, width: 260 };
                    Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                        function (success) {
                            if(success.confirmed)
                            {
                                var idIncident = JumpStartLibXRM.Fx.getEntityId(executionContext);        
                                let rutaAPI = "/MantenedorWeb/GetCodigosReparo";
    
                                RepositorioSucesos.apiGet(rutaAPI, function (data) {
                                    if (data && data.success) 
                                    {              
                                        RepositorioSucesos.Context.ExecutionContext = executionContext;
                                        RepositorioSucesos.Context.FormContext = executionContext.getFormContext();
                                        RepositorioSucesos.Package.Data = data;
                                        RepositorioSucesos.Package.CasoId = idIncident;
                                        RepositorioSucesos.Package.UsuarioId = JumpStartLibXRM.Fx.getUserId();
                                        RepositorioSucesos.Package.AccionEtapaId = modelo.accionEtapaId;
                                        RepositorioSucesos.Package.CodigoSuceso = "SUC0001";
                                        
                                        var pageInput = {
                                            pageType: "webresource",
                                            webresourceName: "xmsbs_bitacoraReparo"
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
                                    else
                                    {
                                        alert(data.message);
                                    }
                                });
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
            } 
        },
    
        SUC0020: function (executionContext) {
               //Cierro el caso
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", 1);  
    
            //Guardamos el cambio
            JumpStartLibXRM.Fx.formSave(executionContext);    
        },
        
        SUC0021: function (executionContext) {
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_correodecierreenviado", true); 
        },
        
        SUC0022:function(executionContext, formContext, modelo){
            //Hace click en avanzar. Primero validamos si está en reparo y si tiene contenido para permitir avanzar o no
            var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);  
            var observacionesReparo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_observacionesdevisacion", null);
            if (observacionesReparo != null)
                observacionesReparo = observacionesReparo.trim();		
            if(estado == 3 && !observacionesReparo){ //Si el Caso está en Reparo
                //Significa que el caso está en reparo y no le pusieron una observación. Alerto.
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: "El caso está en reparo. Debe ingresar una observación al reparo"};
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        //console.log("Alert dialog closed");
                        formContext.getControl("xmsbs_observacionesdevisacion").setFocus();
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
            else{
                //Caso contrario, continúa ejecución normal
                
                // antes de llamar a la API (que podría cerrar automáticamente el caso) guarda los datos que actualmente están en el form:
                formContext.data.entity.save();			
                
                //Xrm.Utility.closeProgressIndicator();
    
                var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Avance de etapa", subtitle:"Va a avanzar el Caso a la siguiente etapa. ¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos" };
                var confirmOptions  = { height: 200, width: 260 };
                Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                    function (success) {
                        if(success.confirmed)
                        {
                            //Si confirma
                            //Parámetros del servicio
                            var idIncident = modelo.casoId;
                            var idAccionEtapa = modelo.accionEtapaId;
                            var codigoSuceso = "SUC0022";
                            
                            //llamada al servicio
                            var response = null;
                        
                            var URL= "Caso/EjecutarSuceso/"+idIncident+"/"+idAccionEtapa+"/"+codigoSuceso+"";
                           // var apiToken = window.sessionStorage.getItem("LokiAuthToken");
                            var service = RepositorioSucesos.GetRequestObject();
                            if (service != null)
                            {
                                service.open("POST", RepositorioSucesos.URL.Azure + URL, false);
                                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                                service.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
                              //  service.setRequestHeader("TokenApi", apiToken);
                                service.send(null);
                                if (service.response != "") {
                                    response = JSON.parse(service.response);
                                }
                            }
                            
                            if (response.success && response.suC0022 != null) {
                                
                                // ocurrió el cierre automático
                                if(response.suC0022.cierreAutomatico)
                                {                            
                                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Cierre automático", text: "El caso cumplió con las condiciones de cierre automático. La ventana se cerrará"};
                                    var alertOptions = { height: 120, width: 260 };
                                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(function (success) {JumpStartLibXRM.Fx.formSaveAndClose(executionContext);},function (error) {});
                                    return;
                                }
                                    
                                // si no ocurre el cierre automático, entonces ejecuta la misma lógica que el SUC0001 (cambio a etapa siguiente), excepto por las acciones correspondientes a la ETA001
                                //actualizar etapa
                                var fieldName = "xmsbs_etapa";
                                var id = response.suC0001.etapa.id;
                                var name = response.suC0001.etapa.name;
                                var entityType = response.suC0001.etapa.logicalName;
                                var etapa = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                                
                                //actualizar Acción 
                                var fieldName = "xmsbs_accion";
                                var id = response.suC0001.accion.id;
                                var name = response.suC0001.accion.name;
                                var entityType = response.suC0001.accion.logicalName;
                                var flujo = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                                
                                //actualizar propietario
                                var fieldName = "ownerid";
                                var id = response.suC0001.propietario.id;
                                var name = response.suC0001.propietario.name;
                                var entityType = response.suC0001.propietario.logicalName;
                                var propietario = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                                //Rol - lookup
                                if(response.suC0001.rol != null){
                                    if(response.suC0001.rol.name != ""){
                                        var fieldName = "xmsbs_rol";
                                        var id = response.suC0001.rol.id;
                                        var name = response.suC0001.rol.name;
                                        var entityType = response.suC0001.rol.logicalName;
                                        var flujo = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                                    }
                                }
                                
                                //actualizar UR 
                                if(response.suC0001.ur != null){
                                    var fieldName = "xmsbs_ur";
                                    var id = response.suC0001.ur.id;
                                    var name = response.suC0001.ur.name;
                                    var entityType = response.suC0001.ur.logicalName;
                                    var flujo = JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, id, name, entityType);
                                }
                                //actualizar Razón para el estado
                                JumpStartLibXRM.Fx.setValueField(executionContext, "statuscode", response.suC0001.estado);
                                //Validamos si el nuevo usuario es igual al actual para cerrar o refrescar
                                var currentUserId = JumpStartLibXRM.Fx.getUserId();
                                if (currentUserId.indexOf("{") > -1){currentUserId = currentUserId.substring(1, 37);}
                                var newUserID = response.suC0001.propietario.id;
                                if (newUserID.indexOf("{") > -1){newUserID = newUserID.substring(1, 37);}
                                
                                
                                // Muestra mensaje de creación del Caso.
                                // - Valida que el formulario sea: "Caso Ingreso Único" ; E731458B-5CA5-4AC6-A863-B54FD50C0475
                                // - Valida que el estado "desde" sea "En Ingreso".
                                // - Muesta Alerta con la información del Caso.
                                var FormName = JumpStartLibXRM.Fx.getFormName(executionContext);
                                
                                var IngresoUnicoFinalizado = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_ingresounicofinalizado", null);
                                var CasoPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
                                // Si el ingreso único finalizado es SI, omite el mensaje de creación del caso. (ocurre para casos con espera de documentos)
                                
                                // Estado: 1 En Ingreso
                                if ((FormName == "Caso Ingreso Único" || FormName == "Caso") && estado == 1 && 
                                    (IngresoUnicoFinalizado == null || IngresoUnicoFinalizado == 0 || CasoPrincipal)) 
                                {
                                    //Se actualiza el ingreso unico finalizado a SI
                                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_ingresounicofinalizado", true);								
                                    var CorrelativoCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_numerocorrelativo", null);
                                    var FechaCreacion = JumpStartLibXRM.Fx.getValueField(executionContext, "createdon", null);
                                    var RUT = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
                                    var Producto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_producto", null)[0].name;
                                    var DetalleTipologia = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalledetipologia", null)[0].name;
                                    var Propietario = response.suC0001.propietario.name;
                                    var FechaComprometida = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_fechacomprometida", null);
                                    
                                    //Actualizar title del caso
                                    var TipoRequerimiento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipoderequerimiento", null)[0].name;
                                    var tituloCaso = CorrelativoCaso + " - " + TipoRequerimiento + " - " + Producto + " - " + DetalleTipologia + " - " + RUT;
                                    JumpStartLibXRM.Fx.setValueField(executionContext, "title", tituloCaso);
                                    
                                    // Actualiza los datos de la Extensión del Caso. (antes del caso)
                                    RepositorioSucesos.ActualizarExtensionCaso(executionContext, "xmsbs_tipodeasignacion", 657130000);
                                    formContext.data.entity.save();
                                    
                                    // Actualiza campo para reporte RDA, determina si el caso es duplicado respecto a: rut, punto de contacto, detalle operación, mes actual.
                                    var xmsbs_rda50512454 = RepositorioSucesos.oDataCasoDuplicadoMensual(executionContext);
                                    RepositorioSucesos.ActualizarExtensionCaso(executionContext, "xmsbs_rda50512454", xmsbs_rda50512454);								
     
                                    var strTitle = "Número de CASO: " + CorrelativoCaso;
                                    var strConfirmBtn = "Crear Nuevo Caso";
                                    var strCancelBtn = "Continuar";
                                    var strBody = "Con fecha " + JumpStartLibXRM.Fx.formatDate(FechaCreacion) + ", " +
                                          "se ha creado el caso " + CorrelativoCaso + " asociado al cliente " + RUT + ", " +
                                          "para el producto " + Producto + ", " + 
                                          "por concepto de " + DetalleTipologia + " y el responsable asignado es " + Propietario + ". " +
                                          "La fecha comprometida de resolución es: " + JumpStartLibXRM.Fx.formatDate(FechaComprometida);   
    
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
                                            setTimeout(function () {
                                                Xrm.Navigation.openForm(entityFormOptions,formParameters);
                                            }, 3000);
                                        }
                                        else
                                        {
                                            if(currentUserId.toLowerCase() == newUserID.toLowerCase()){
                                                //Son iguales, hacemos el refresco normal
                                                var entityFormOptions = {};
                                                entityFormOptions["entityName"] = formContext.data.entity.getEntityName();
                                                entityFormOptions["entityId"] = idIncident;
                                                //Guardamos el cambio y refrescamos el formulario
                                                setTimeout(function () {
                                                    Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);
                                                }, 3000);
                                            }
                                            else{
                                                //Son distintos, alertamos que se cerrará la ventana y cerramos
                                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Cambio de responsable", text: "El caso pasó a gestión de un nuevo usuario. La ventana se cerrará"};
                                                var alertOptions = { height: 120, width: 260 };
                                                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                                    function (success) {
                                                        //console.log("Alert dialog closed");
                                                        Xrm.Utility.closeProgressIndicator();
                                                        //JumpStartLibXRM.Fx.formSaveAndClose(executionContext);
                                                        setTimeout(function () {
                                                            JumpStartLibXRM.Fx.formClose(executionContext);
                                                        }, 3000);
                                                    },
                                                    function (error) {
                                                        Xrm.Utility.closeProgressIndicator();
                                                        //console.log(error.message);
                                                    }
                                                );                            
                                            }									
                                        }
                                    },
                                    function (error) { 
                                        //---
                                    });
                                }
                                else
                                {
                                    // Forma original
                                    if(currentUserId.toLowerCase() == newUserID.toLowerCase()){
                                        //Son iguales, hacemos el refresco normal
                                        var entityFormOptions = {};
                                        entityFormOptions["entityName"] = formContext.data.entity.getEntityName();
                                        entityFormOptions["entityId"] = idIncident;
                                       
                                        //Guardamos el cambio y refrescamos el formulario
                                        RepositorioSucesos.ActualizarExtensionCaso(executionContext, "xmsbs_tipodeasignacion", 657130000);
                                        formContext.data.entity.save();
                                       
                                        setTimeout(function () {
                                            Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);
                                        }, 3000);
                                    }
                                    else{
                                        //Son distintos, alertamos que se cerrará la ventana y cerramos
                                        var alertStrings = { confirmButtonLabel: "Aceptar", title: "Cambio de responsable", text: "El caso pasó a gestión de un nuevo usuario. La ventana se cerrará"};
                                        var alertOptions = { height: 120, width: 260 };
                                        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                            function (success) {
                                                //console.log("Alert dialog closed");
                                                Xrm.Utility.closeProgressIndicator();
                                                RepositorioSucesos.ActualizarExtensionCaso(executionContext, "xmsbs_tipodeasignacion", 657130000);
                                                JumpStartLibXRM.Fx.formSaveAndClose(executionContext);
                                            },
                                            function (error) {
                                            Xrm.Utility.closeProgressIndicator();
                                                //console.log(error.message);
                                            }
                                        );                            
                                    }	
                                }							
    
                            }
                        }
                        else{
                            // problema con api
                            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Reintentar", text: "No se pudo procesar el avance del caso. Favor intente nuevamente o contacte al administrador"};
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
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        },
        
        SUC0023: function (executionContext) {
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Descargar PDF", subtitle:"Va a descargar la respuesta en PDF del caso. ¿Desea Continuar?", text: "Esta acción demorará unos segundos en descargar el archivo"};
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) 
                {
                    if(success.confirmed)
                    {
                        let _modeloApi = {
                            idIncident: _modelo.casoId,
                            idPlantilla: null,
                            content: null
                        };
                        
                        let rutaAPI = '/Caso/DescargarPDFRespuestaManualCaso/';
                        RepositorioSucesos.apiPost(rutaAPI, _modeloApi, function (data) 
                        {
                            if (data && data.success) 
                            {
                                var fileName = "respuesta_formales.pdf";
                                RepositorioSucesos.downloadBase64File(data.respuestaPDFEmailBase64, fileName);
                            }
                            else
                            {
                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: data.message};
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
                        });
                                          
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
        
        SUC0024: function (executionContext, modelo) {        
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Enviar Respuesta", subtitle:"Va a enviar la respuesta del caso. ¿Desea Continuar?", text: "Esta acción demorará unos segundos"};
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) 
                {
                    if(success.confirmed)
                    {
                        //Confirma
                        if(modelo.casoId != null && modelo.accionEtapaId != null)
                        {
                            var URL= "CasoAccion/PostEnviarNotificacionesClienteAsync?idIncident=" + modelo.casoId + "&idAccionEtapa=" + modelo.accionEtapaId;
                            RepositorioSucesos.apiPost(URL, null, function (data) {
                                if (data.success) 
                                {
                                    _mensaje = data.message;
                                }
                                else
                                {
                                    _mensaje = data.message;
                                }  
    
                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Enviar Respuesta", text: _mensaje};
                                var alertOptions = { height: 120, width: 260 };
                                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                    function (success) {
                                        //console.log("Alert dialog closed");
                                    },
                                    function (error) {
                                        //console.log(error.message);
                                    }
                                );
                            });
                            
    //                        var _response = RepositorioSucesos.EnviarNotificacionesCliente(modelo.casoId, modelo.accionEtapaId);
    //                        var _mensaje = "";
    //                        let timer = setInterval(function () {
    //                            if (_response != null)
    //                            {
    //                                _mensaje = _response.message;
    //                            }
    //                            else
    //                            {
    //                                _mensaje = "Mensaje: Error en Enviar Notificacion Cliente";
    //                            }
    //                        }, 3000);                        
    //                        
    //                        var alertStrings = { confirmButtonLabel: "Aceptar", title: "Enviar Respuesta", text: _mensaje};
    //                        var alertOptions = { height: 120, width: 260 };
    //                        Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
    //                            function (success) {
    //                                //console.log("Alert dialog closed");
    //                            },
    //                            function (error) {
    //                                //console.log(error.message);
    //                            }
    //                        );
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
        
        SUC0025: function (executionContext, modelo) {
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Generar PDF Solicitud Contracargo", subtitle:"Va a generar y descargar la solicitud de contracargo en PDF. ¿Desea Continuar?", text: "Esta acción demorará unos segundos en descargar el archivo"};
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) 
                {
                    if(success.confirmed)
                    {
                        JumpStartLibXRM.Fx.formSave(executionContext);
                        let rutaAPI = '/Caso/ContracargoAdquirencia?idIncident=' + modelo.casoId + '&cierreContracargo=false';
                        RepositorioSucesos.apiPost(rutaAPI, null, function (data) 
                        {
                            if (data && data.success) 
                            {
                                var fileName = "solicitud_contracargos_comercio.pdf";
                                RepositorioSucesos.downloadBase64File(data.respuestaPDFEmailBase64, fileName);
                                
                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Éxito", text: data.message};
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
                            else
                            {
                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: data.message};
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
                        });                                      
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
        
        SUC0026: function (executionContext, modelo) {
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Generar PDF Cierre Caso Contracargo", subtitle:"Va a generar y descargar el cierre caso contracargo en PDF. ¿Desea Continuar?", text: "Esta acción demorará unos segundos en descargar el archivo"};
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) 
                {
                    if(success.confirmed)
                    {
                        JumpStartLibXRM.Fx.formSave(executionContext);
                        let rutaAPI = '/Caso/ContracargoAdquirencia?idIncident=' + modelo.casoId + '&cierreContracargo=true';
                        RepositorioSucesos.apiPost(rutaAPI, null, function (data) 
                        {
                            if (data && data.success) 
                            {
                                var fileName = "cierre_caso_contracargos.pdf";
                                RepositorioSucesos.downloadBase64File(data.respuestaPDFEmailBase64, fileName);
                                
                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Éxito", text: data.message};
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
                            else
                            {
                                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: data.message};
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
                        });                                      
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
        
          
        SUC0027:function(executionContext, formContext, modelo){ 
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Reinsistencia", subtitle:"Va a enviar el Caso a la etapa anterior. ¿Desea Continuar?", text: "Recuerde que al Re-insistir un caso debe informar la nueva fecha comprometida al cliente" };
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed)
                    {
                        var idIncident = JumpStartLibXRM.Fx.getEntityId(executionContext);
                                     
                        RepositorioSucesos.Context.ExecutionContext = executionContext;
                        RepositorioSucesos.Context.FormContext = formContext;
                        RepositorioSucesos.Package.CasoId = idIncident;
                        RepositorioSucesos.Package.UsuarioId = JumpStartLibXRM.Fx.getUserId();
                        RepositorioSucesos.Package.AccionEtapaId = modelo.accionEtapaId;
                        RepositorioSucesos.Package.CodigoSuceso = "SUC0001";
                                
                        var pageInput = {
                            pageType: "webresource",
                            webresourceName: "xmsbs_bitacoraReinsistencia"
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
        
        SUC0028: function (executionContext, modelo) {
            //Cancelar el caso
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Reverso automático", subtitle:"Va a cerrar el caso como Terminado RA. ¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos" };
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed)
                    {   
                        var URL= "CasoAccion/PostEnviarNotificacionesClienteAsync?idIncident=" + modelo.casoId + "&idAccionEtapa=" + modelo.accionEtapaId;
                        RepositorioSucesos.apiPost(URL, null, function (data) {
                            if (data.success) 
                            {
                                _mensaje = data.message;
                            }
                            else
                            {
                                _mensaje = data.message;
                            }  
    
                            //OCultar botonera	
                            JumpStartLibXRM.Fx.hideShowSection(executionContext,"general","general_section_botonera",false);					
    
                            //Marco el caso como rechazado
                            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", 4);
    
                            //Guardamos el cambio
                            JumpStartLibXRM.Fx.formSave(executionContext);
                        });
                        
    //                    var _response = RepositorioSucesos.EnviarNotificacionesCliente(modelo.casoId, modelo.accionEtapaId);
    //                    setTimeout(function () {
    //                        //OCultar botonera
    //                        //executionContext.ui.tabs.get("general").sections.get("general_section_botonera").setVisible(false); //Botonera		
    //                        JumpStartLibXRM.Fx.hideShowSection(executionContext,"general","general_section_botonera",false);					
    //
    //                        //Marco el caso como rechazado
    //                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", 4);
    //
    //                        //Guardamos el cambio
    //                        JumpStartLibXRM.Fx.formSave(executionContext);
    //                    }, 3000);					
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
    
        SUC0029: function (executionContext) {		
            //Crear subrequerimiento Fraude
            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
            if(incidentId){ 
                Xrm.WebApi.online.retrieveMultipleRecords("incident", "?$select=title&$filter=_parentcaseid_value eq '" +incidentId.replace(/[{}]/g, "")+"'").then(
                    function success(results) {
                        var formContext = executionContext.getFormContext();
                        if (results.entities.length >0){
                            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Subrequerimiento existente", text: "No puede crear mas de un subrequerimiento para casos de Ley de Fraude"};
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
                        else{
                            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Subrequerimiento", subtitle:"Va a crear un subrequerimiento asociado a este Caso. ¿Desea Continuar?"};
                            var confirmOptions  = { height: 200, width: 260 };
                            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                                function (success) {
                                    if(success.confirmed)
                                    {
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
                                        
                                        //Sucursal
                                        var SucursalId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_sucursalcliente");
                                        if(SucursalId){
                                            if (SucursalId.indexOf("{") > -1){SucursalId = SucursalId.substring(1, 37);}
                                            var SucursalName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_sucursalcliente");
                                        }
    
                                        //Segmento
                                        var SegmentoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_segmentocliente");
                                        if(SegmentoId){
                                            if (SegmentoId.indexOf("{") > -1){SegmentoId = SegmentoId.substring(1, 37);}
                                            var SegmentoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_segmentocliente");
                                        }
                                        
                                        //Subsegmento
                                        var SubsegmentoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_subsegmentocliente");
                                        if(SubsegmentoId){
                                            if (SubsegmentoId.indexOf("{") > -1){SubsegmentoId = SubsegmentoId.substring(1, 37);}
                                            var SubsegmentoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_subsegmentocliente");
                                        }
                                        
                                        //Ejecutivo
                                        var ejecutivo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_ejecutivocliente", null);
                                        
                                        //Resto de campos 
                                        var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
                                        var IdLlamada = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_idllamada", null);
                                        var tipoDocumento = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipodocumento", null);
                                        var observaciones = JumpStartLibXRM.Fx.getValueField(executionContext, "description", null);
                                        var solucion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_solucionesperada", null);
    
                                        //Selecciono la tipologia respectiva
    
                                        //Set lookup Producto
                                        var ProductoId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto");
                                        if (ProductoId.indexOf("{") > -1){ProductoId = ProductoId.substring(1, 37);}
                                        var ProductoName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_producto");
                                        
                                        //Set lookup Tipo y Detalle
                                        var DetalleOperacion = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_detalledeoperacion");
                                        var codigoTipologia = "";
                                        var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
                                        
                                        if(detalleOperacionID){
                                            if (detalleOperacionID.indexOf("{") > -1){detalleOperacionID = detalleOperacionID.substring(1, 37);}
                                            var resultado = RepositorioSucesos.buscarDetalleOperacion(executionContext, detalleOperacionID);
                                            if(resultado){
                                                var codigoDO = resultado.xmsbs_codigo;
                                                if(codigoDO){
                                                    if(ProductoName.toLowerCase() == "tarjeta de crédito" && (codigoDO == "DO-0267" || codigoDO == "DO-0795")){
                                                        codigoTipologia = "TD-0570";
                                                    }
                                                    else if (ProductoName.toLowerCase() == "tarjeta de crédito" && (codigoDO == "DO-0268" || codigoDO == "DO-0796")){
                                                        codigoTipologia = "TD-0571";
                                                    }
                                                    else if (ProductoName.toLowerCase() == "tarjeta de crédito" && (codigoDO == "DO-0269" || codigoDO == "DO-0797")){
                                                        codigoTipologia = "TD-0572";
                                                    }
                                                    else if(ProductoName.toLowerCase() == "tarjeta de débito" && (codigoDO == "DO-0272" || codigoDO == "DO-0798")){
                                                        codigoTipologia = "TD-0573";
                                                    }
                                                    else if (ProductoName.toLowerCase() == "tarjeta de débito" && (codigoDO == "DO-0273" || codigoDO == "DO-0799")){
                                                        codigoTipologia = "TD-0574";
                                                    }
                                                    else if (ProductoName.toLowerCase() == "tarjeta de débito" && (codigoDO == "DO-0274" || codigoDO == "DO-0800")){
                                                        codigoTipologia = "TD-0575";
                                                    }
                                                }
                                            }
                                        }
                                        
                                        /*
                                        ***TC***						
                                        DO-0267 = clonación/falsificación mayor $500.000 (int-nac)
                                        DO-0795 = clonación/falsificación mayor $500.000 (int-nac) ingreso manual
                                        DO-0268 = clonación/falsificación menor $500.000 (int-nac)
                                        DO-0796 = clonación/falsificación menor $500.000 (int-nac) ingreso manual
                                        DO-0269 = robo y/o perdida (int-nac)
                                        DO-0797 = robo y/o perdida (int-nac) ingreso manual
    
                                        ***TD***
                                        DO-0272 = clonación/falsificación mayor $500.000 (int-nac)
                                        DO-0798 = clonación/falsificación mayor $500.000 (int-nac) ingreso manual
                                        DO-0273 = clonación/falsificación menor $500.000 (int-nac)
                                        DO-0799 = clonación/falsificación menor $500.000 (int-nac) ingreso manual
                                        DO-0274 = robo y/o perdida (int-nac)
                                        DO-0800 = robo y/o perdida (int-nac) ingreso manual
                                        */
                        
                                        var respuesta = RepositorioSucesos.buscaTipoDetalle(executionContext, codigoTipologia);
                                        if(respuesta){
                                        //Completamo el tipodetalleoperación
                                            var TipoDetalleEspecificoName = respuesta.value[0].xmsbs_name;
                                            var TipoDetalleEspecificoId = respuesta.value[0].xmsbs_tipoydetalledeoperacionid;
                                            if (TipoDetalleEspecificoId.indexOf("{") > -1){TipoDetalleEspecificoId = TipoDetalleEspecificoId.substring(1, 37);}
                                        }
                                        
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
                                        formParameters["xmsbs_idllamada"] = IdLlamada;
                                        formParameters["xmsbs_tipodocumento"] = tipoDocumento;
                                        //formParameters["description"] = observaciones;
                                        formParameters["xmsbs_solucionesperada"] = solucion;
                                        formParameters["prioritycode"] = 1;
                                        formParameters["xmsbs_puntodecontacto"] = PuntoContactoId;
                                        formParameters["xmsbs_puntodecontactoname"] = PuntoContactoName;
                                        formParameters["xmsbs_producto"] = ProductoId;
                                        formParameters["xmsbs_productoname"] = ProductoName;
                                        formParameters["xmsbs_detalledetipologia"] = TipoDetalleEspecificoId;
                                        formParameters["xmsbs_detalledetipologianame"] = TipoDetalleEspecificoName;
                                        
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
                                        
                                        formParameters["xmsbs_ejecutivocliente"] = ejecutivo;
                                        formParameters["xmsbs_subrequerimientofraude"] = true;
                                        formParameters["title"] = "Nuevo Caso";
                                        formParameters["xmsbs_ingresounicofinalizado"] = true;
                                        
                                        var formContext = executionContext.getFormContext();
                                        formContext.data.save().then( 
                                            function success(result) {
                                                // Open the form
                                                Xrm.Utility.openEntityForm("incident", null, formParameters, entityFormOptions);  
                                            }
                                        );  			
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
        },	
        
        SUC0030: function (executionContext) {
            //Se limpia el campo de respuesta
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_respuestacliente", null); //Varias lineas de texto
            
            //Guardamos el cambio
            JumpStartLibXRM.Fx.formSave(executionContext);		
        },	
        
        SUC0031:function(executionContext, formContext, modelo){
            //Hace click en retroceder (Reparar, Reinsistir, etc) 
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Derivar a Sucursal", subtitle:"Va a derivar el Caso a una Sucursal. ¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos" };
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed)
                    {
                        var idIncident = JumpStartLibXRM.Fx.getEntityId(executionContext);        
    
                        RepositorioSucesos.Context.ExecutionContext = executionContext;
                        RepositorioSucesos.Context.FormContext = formContext;
                        RepositorioSucesos.Package.Data = "";
                        RepositorioSucesos.Package.CasoId = idIncident;
                        RepositorioSucesos.Package.UsuarioId = JumpStartLibXRM.Fx.getUserId();
                        RepositorioSucesos.Package.AccionEtapaId = modelo.accionEtapaId;
                        RepositorioSucesos.Package.CodigoSuceso = "SUC0001";
                        
                        var pageInput = {
                            pageType: "webresource",
                            webresourceName: "xmsbs_derivarsucursal"
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
        
        SUC0032:function(executionContext, formContext, modelo){ 
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Termino Inmediato", subtitle:"Va a cerrar el Caso como finalizado. ¿Desea Continuar?", text: "Esta acción permite almacenar la atención, sin necesidad de enviar a la UR de gestión" };
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed)
                    {
                        var idIncident = JumpStartLibXRM.Fx.getEntityId(executionContext);
                                     
                        RepositorioSucesos.Context.ExecutionContext = executionContext;
                        RepositorioSucesos.Context.FormContext = formContext;
                        RepositorioSucesos.Package.CasoId = idIncident;
                        RepositorioSucesos.Package.UsuarioId = JumpStartLibXRM.Fx.getUserId();
                        RepositorioSucesos.Package.AccionEtapaId = modelo.accionEtapaId;
                        RepositorioSucesos.Package.CodigoSuceso = "SUC0032";
                                
                        var pageInput = {
                            pageType: "webresource",
                            webresourceName: "xmsbs_termioInmediato"
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
        
        SUC0033: function (executionContext, formContext, modelo) {
            //Resuelve con No se accede + Observaciones
            
            var formContext = executionContext.getFormContext();
            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
            
            if (incidentId.indexOf("{") > -1)
            {
                incidentId = incidentId.substring(1, 37);
            }
            
            var _adquirencia = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_producto", null);
            
            var validaDocumentos = Caso.validateDocumentos(executionContext, incidentId);
            if (validaDocumentos.success == true)                
            {
                var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Cierre de Caso", subtitle:"Va a iniciar el cierre del caso. ¿Desea Continuar?"};
                var confirmOptions  = { height: 200, width: 260 };
                Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                    function (success) {
                        if(success.confirmed)
                        {
                            var formValido = JumpStartLibXRM.Fx.FormGetIsDirty(executionContext);
                            if(!formValido)
                            {             
    
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tipoderespuesta", 2);
                                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_observacionesdevisacion", "observación de prueba");
                                formContext.data.entity.save();
                                
                                RepositorioSucesos.mostrarIndicadorProgreso("Procesando");
                                let rutaAPI = '/Caso/ResolverCaso';
                                
                                var request = {
                                    IdIncident: incidentId,
                                    Estado: 1,
                                    RazonEstado: 1
                                };                            
                                
                                
                                RepositorioSucesos.apiPost(rutaAPI, request, function (data) {                                
    
                                    if (data.success) {
                                        if(_adquirencia != null && _adquirencia.toLowerCase() == "adquirencia")
                                        {
                                            RepositorioSucesos.EnviarNotificacionCierreAdquirencia(formContext, incidentId);
                                        }
                                        else
                                        {
                                            RepositorioSucesos.EnviarNotificacionesCierreCliente(formContext, incidentId, modelo.accionEtapaId, true);
                                        }
                                    }
                                    else {
                                        var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: data.message};
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
                                });
    
                           
                            
                            }
                            else
                            {
                                alert("Guardar registro antes de resolver el caso.")
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
            }
            else
            {
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error de Validación", text: validaDocumentos.message};
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
        
        SUC0034: function (executionContext, modelo) {
            debugger;
            //var estado = JumpStartLibXRM.Fx.getValueField(executionContext, "statuscode", null);  

            var adquirencia = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_institucion", null);
            var esAdquirencia = (adquirencia == "{443E67E1-F271-EB11-A812-00224809A412}");
            if(esAdquirencia)
                return;

            // La plantilla se genera respecto a los datos del caso padre
            var CasoPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
            var idIncident = CasoPrincipal[0].id;

            RepositorioSucesos.Context.ExecutionContext = executionContext;
            RepositorioSucesos.Context.FormContext = executionContext.getFormContext();
            RepositorioSucesos.Package.CasoId = idIncident;
            RepositorioSucesos.Package.UsuarioId = JumpStartLibXRM.Fx.getUserId();
            RepositorioSucesos.Package.AccionEtapaId = modelo.accionEtapaId;
            RepositorioSucesos.Package.CodigoSuceso = "SUC0034";
            
            var pageInput = {
                pageType: "webresource",
                webresourceName: "xmsbs_viewerHtmlEditor"
            };
            var navigationOptions = {
                target: 2,
                width: 800,
                height: 800,
                position: 1
            };
            Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function success() {}, function error() {});
        },	        
        
        SUC0035: function (executionContext, modelo) {
            // Este suceso no aplica para Adquirencia
            var adquirencia = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_institucion", null);
            var esAdquirencia = (adquirencia == "{443E67E1-F271-EB11-A812-00224809A412}");
            if(esAdquirencia)
                return;

            // No debe tener cambios pendientes.
            var formPendienteGuardado = JumpStartLibXRM.Fx.FormGetIsDirty(executionContext);
            if(formPendienteGuardado)
            {
                alert("Antes de continuar debe guardar los cambios pendientes.");
                return;
            }

            // El Cliente puede Desistir desde el Caso Principal o desde el SubRequerimiento.
            var CasoPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "parentcaseid", null);
            var esSubRequerimiento = (CasoPrincipal);

            var formContext = executionContext.getFormContext();
            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
            
            var TituloMsg = "Cliente Desiste";
            if (esSubRequerimiento)
                TituloMsg = "Cierre del Caso";

            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: TituloMsg, subtitle:"Va a iniciar el cierre del caso. ¿Desea Continuar?"};
            var confirmOptions  = { height: 200, width: 260 };
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed)
                    {
                        RepositorioSucesos.mostrarIndicadorProgreso("Procesando");
                        
                        debugger;
                        if (esSubRequerimiento)
                        {
                            // Cliente Desiste desde SubRequerimiento
                            // - Resuelve el caso

                            var MotivoCierre = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_picklist3g_texto", null);
                            var strMsg = "";
                            
                            if (MotivoCierre == "Cliente Desiste" || MotivoCierre == "Banco Desiste")
                            {
                                debugger;
                                var CasoPrincipalId = CasoPrincipal[0].id;
                                var oCasoPrincipal = RepositorioSucesos.getCaso(executionContext, CasoPrincipalId);
                                // Busca acción "Cliente Desiste"
                                var accionEtapaIdCasoPrincipal = RepositorioSucesos.getAccionEtapaClienteDesiste(executionContext, oCasoPrincipal.value[0]._xmsbs_etapa_value);

                                var objCasoPrincipal = {};
                                objCasoPrincipal["xmsbs_aux_status"] = 1; // 1: Finalizado
                                objCasoPrincipal["xmsbs_correodecierreenviado"] = true; 
                                SDK.WEBAPI.updateRecordImpersonate(executionContext, CasoPrincipalId, objCasoPrincipal, "incident", RepositorioSucesos.Package.UsuarioAdminID, null, null);

                                strMsg = "\nTambién se cierra el Caso Principal: " + oCasoPrincipal.value[0].xmsbs_numerocorrelativo;

                                // de la etapa actual del caso, tengo que ir y buscar el botón "Cliente Desiste" y buscar la notificación de esa acción por etapa.
                                
                                // PENDIENTE: que pasa si el caso padre está en la última etapa, en donde no tiene botón "Cliente Desiste" ?? qué notificación envía?
                                // actualmente está considerando que NO enviará notificación si en la Etapa actual del Caso Padre no existe botón "Cliente Desiste".

                                if (accionEtapaIdCasoPrincipal.value.length > 0){
                                    RepositorioSucesos.EnviarNotificacionesCierreCliente(formContext, CasoPrincipalId, accionEtapaIdCasoPrincipal.value[0].xmsbs_accionetapaid, false);
                                }
                            }

                            var numeroCorrelativoSubReq = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_numerocorrelativo", null);

                            var objSubReq = {};
                            objSubReq["xmsbs_aux_status"] = 1; // 1: Finalizado
                            //objSubReq["xmsbs_correodecierreenviado"] = true; 
                            SDK.WEBAPI.updateRecordImpersonate(executionContext, incidentId, objSubReq, "incident", RepositorioSucesos.Package.UsuarioAdminID, null, null);                            
                            
                            RepositorioSucesos.ocultarIndicadorProgreso();

                            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Mensaje", text: "SubRequerimiento " + numeroCorrelativoSubReq + " Resuelto. " + strMsg};
                            var alertOptions = { height: 120, width: 260 };
                            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                function (success) {
                                    Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);
                                },
                                function (error) {
                                    //console.log(error.message);
                                }
                            );
                        }
                        else
                        {
                            // Cliente desiste desde el caso principal

                            // - Se obtiene el SubRequerimiento Fraude
                            // - Se actualiza el SubRequerimiento con: xmsbs_picklist3g = 2 ; xmsbs_picklist3g_texto = "Cliente Desiste" ; xmsbs_motivo = "Cliente desiste desde caso principal"
                            // - Se realiza la resolución del caso: (basado en SUC0013, pero sin usar el AppService)
                            // - Se envía notificación desde el Caso Principal

                            debugger;

                            var numeroCorrelativo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_numerocorrelativo", null);

                            var oSubReq = RepositorioSucesos.buscarSubRequerimientoActivo(executionContext, incidentId);
                            if (oSubReq.value.length > 0)
                            {
                                // Se resuelve el SUBREquerimiento.
                                debugger;

                                var SubReqId = oSubReq.value[0]["incidentid"];
                                var objSubReq = {};
                                objSubReq["xmsbs_aux_status"] = 1; // 1: Finalizado

                                objSubReq["xmsbs_picklist3g"] = 2; 
                                objSubReq["xmsbs_picklist3g_texto"] = "Cliente Desiste"; 
                                objSubReq["xmsbs_motivo"] = "Cliente desiste desde caso principal";
                                SDK.WEBAPI.updateRecordImpersonate(executionContext, SubReqId, objSubReq, "incident", RepositorioSucesos.Package.UsuarioAdminID, null, null);
                            }

/*
                            let rutaAPI = '/Caso/ResolverCaso';
                            var request = { IdIncident: incidentId, Estado: 1, RazonEstado: 1 };
                            RepositorioSucesos.apiPost(rutaAPI, request, function (data) {                                
                                if (data.success) {
                                    RepositorioSucesos.EnviarNotificacionesCierreCliente(formContext, incidentId, modelo.accionEtapaId, true);
                                    RepositorioSucesos.ocultarIndicadorProgreso();

                                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Mensaje", text: "Caso " + numeroCorrelativo + " Resuelto."};
                                    var alertOptions = { height: 120, width: 260 };
                                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                        function (success) {
                                            Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);
                                        },
                                        function (error) { 
                                        });
                                }
                                else {
                                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: data.message};
                                    var alertOptions = { height: 120, width: 260 };
                                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then( function (success) { }, function (error) { } );
                                }
                            });
*/
                            //JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_aux_status", 1); // 1: Finalizado
                            //JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_correodecierreenviado", true);
                            //formContext.data.entity.save();

                            debugger;
                            var objCaso = {};
                            objCaso["xmsbs_aux_status"] = 1; // 1: Finalizado
                            objCaso["xmsbs_correodecierreenviado"] = true; 
                            SDK.WEBAPI.updateRecordImpersonate(executionContext, incidentId, objCaso, "incident", RepositorioSucesos.Package.UsuarioAdminID, null, null);

                            RepositorioSucesos.EnviarNotificacionesCierreCliente(formContext, incidentId, modelo.accionEtapaId, false);
                            RepositorioSucesos.ocultarIndicadorProgreso();

                            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Mensaje", text: "Caso " + numeroCorrelativo + " Resuelto."};
                            var alertOptions = { height: 120, width: 260 };
                            Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                                function (success) {
                                    Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);
                                },
                                function (error) {
                                    //console.log(error.message);
                                }
                            );
                        }
                    }
                },
                function (error) { }
            );
        },	        

        
    //============================================
    //LLAMADAS CRUD (CREATE, READ, UPDATE, DELETE)
    //============================================
    
        datosCliente: function (executionContext, ClienteId){
            //Preparamos la consulta
            var entityType = "contact";
            var entityId = ClienteId;
            var query = "emailaddress1,mobilephone,xmsbs_clientenorequierenotificacion,xmsbs_sms,xmsbs_push,xmsbs_email,firstname,lastname,middlename,xmsbs_clientesantander,xmsbs_preferenciacontacto";
            //realizamos la consulta
            var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
            return resultado;
        },
    
        tipoReclamoDetalleOperacion: function (executionContext, DetalleID){
            //Preparamos la consulta
            var entityType = "xmsbs_detalleoperacions";
            var entityId = DetalleID;
            var query = "xmsbs_tiporeclamo,xmsbs_quebrantogsc";
            //realizamos la consulta
            var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
            return resultado;
        },
        
        buscarDocumentoCaso: function (executionContext, idIncident, idTipoDocumento){
            var entityType = "xmsbs_documento";
            var query = "$select=xmsbs_documentoid,xmsbs_obligatoriedad,xmsbs_id,xmsbs_name,xmsbs_caso,xmsbs_tipodocumento";
            query += "&$filter=_xmsbs_caso_value eq '" + idIncident + "' and _xmsbs_tipodocumento_value eq '" + idTipoDocumento + "'";
            var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
            {});
            return resultado;
        },
        
        buscarBitacoraEtapaCaso: function (executionContext, idIncident){
            var entityType = "xmsbs_bitacoraetapas";
            var query = "$select=xmsbs_bitacoraetapaid,xmsbs_name,createdon";
            query += "&$filter=_xmsbs_caso_value eq '" + idIncident + "'&$orderby=createdon desc";
            var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
            {});
            return resultado;
        },
        
        buscarSubRequerimientoActivo: function (executionContext, incidentid){
            var entityType = "incident";
            var query = "$select=xmsbs_numerocorrelativo";
            query += "&$filter=(statecode eq 0 and _parentcaseid_value eq " + incidentid.replace(/[{}]/g, "") + ")";

            var adminId = JumpStartLibXRM.Fx.getUserAdminID();
            var resultado = SDK.WEBAPI.retrieveMultipleRecordsImpersonate(executionContext, entityType, query, adminId);
            return resultado;
        },

        buscarTipoDocumento: function (executionContext, codigoDocumento){
            var entityType = "xmsbs_tipodedocumento";
            var query = "$select=xmsbs_codigo,xmsbs_name,xmsbs_tipodocumentalfilenet";
            query += "&$filter=xmsbs_codigo eq '" + codigoDocumento + "'";
            var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
            {});
            return resultado;
        },
        
        buscaTipoDetalle: function (executionContext, codigoTipologia){
            var entityType = "xmsbs_tipoydetalledeoperacion";
            var query = "$select=xmsbs_name,xmsbs_tipoydetalledeoperacionid";
            query += "&$filter=xmsbs_codigo eq '" + codigoTipologia + "'";
            var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
            {});
            return resultado;
        },
        
        buscarDetalleOperacion: function(executionContext, detalleOperacionID){
            //Preparamos la consulta
            var entityType = "xmsbs_detalleoperacion";
            var entityId = detalleOperacionID.replace(/[{}]/g, "");
            var query = "xmsbs_name,xmsbs_codigo,xmsbs_tiporeclamo,xmsbs_quebranto,xmsbs_tooltips,xmsbs_habilitarbotonmovimientoscasos,xmsbs_idstockadquirencia,xmsbs_campocantidadsolicitada";
            //var expand = "xmsbs_flujosantander($select=xmsbs_name,xmsbs_tiporequerimientoid)";
            //realizamos la consulta
            var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
            return resultado;
        },
        
        getCaso: function(executionContext, incidentId){
			let entityType = "incident";
			let query = "$select=incidentid,statecode,statuscode,_xmsbs_etapa_value,xmsbs_numerocorrelativo";
			query += "&$filter=(incidentid eq '" + incidentId.replace(/[{}]/g, "") + "')";

            var adminId = JumpStartLibXRM.Fx.getUserAdminID();
			let resultado = SDK.WEBAPI.retrieveMultipleRecordsImpersonate(executionContext, entityType, query, adminId);
			return resultado;
        },

        getAccionEtapaClienteDesiste: function(executionContext, etapaId){
			let entityType = "xmsbs_accionetapa";
			let query = "$select=xmsbs_accionetapaid,xmsbs_codigo,_xmsbs_accion_value,xmsbs_name";
            query += "&$expand=xmsbs_accion($select=xmsbs_codigo)";
            query += "&$filter=(_xmsbs_etapa_value eq '" + etapaId.replace(/[{}]/g, "") + "') and (xmsbs_accion/xmsbs_codigo eq 'ACC0032')";

            var adminId = JumpStartLibXRM.Fx.getUserAdminID();
			let resultado = SDK.WEBAPI.retrieveMultipleRecordsImpersonate(executionContext, entityType, query, adminId);
			return resultado;
        },

        getAccionEtapa: function(executionContext, AccionEtapaId){
            var entityType = "xmsbs_accionetapa";
            var entityId = AccionEtapaId.replace(/[{}]/g, "");
            var query = "_xmsbs_etapasiguiente_value";
            var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
            return resultado;
        },
    
        getIncidentIngresoUnicoFinalizado: function(executionContext, IncidentId){
            var entityType = "incident";
            var entityId = IncidentId.replace(/[{}]/g, "");
            var query = "xmsbs_ingresounicofinalizado,title";
            var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
            return resultado;
        },
		
        buscarCampoDeEtapa: function(executionContext, etapaID, NombreCampo) {
            var entityType = "xmsbs_campos";
            var query = "$select=xmsbs_campoid,xmsbs_name,xmsbs_lectura";
            query += "&$filter=(xmsbs_name eq '" + NombreCampo + "' and _xmsbs_etapa_value eq " + etapaID.replace(/[{}]/g, "") + ")";
            var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function() {});
            return resultado;
        },
        
        ordenEtapa: function (executionContext, EtapaID){
            //Preparamos la consulta
            var entityType = "xmsbs_etapas";
            var entityId = EtapaID;
            var query = "xmsbs_orden,xmsbs_etapaid,xmsbs_name";
            //realizamos la consulta
            var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
            return resultado;
        },
        
        buscaPuntoContacto: function (executionContext, CanalID){
            //Preparamos la consulta
            var entityType = "xmsbs_puntocontactos";
            var entityId = CanalID;
            var query = "xmsbs_permitereparo,xmsbs_name";
            //realizamos la consulta
            var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
            return resultado;
        },	
        
        validaBitacoraActual: function (executionContext, incidentId){
            //Preparamos la consulta
            var entityType = "incidents";
            var entityId = incidentId;
            var query = "_xmsbs_bitacoraactual_value";
            //realizamos la consulta
            var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
            return resultado;
        },
        
        validaExtensionCaso: function (executionContext, incidentId){
            //Preparamos la consulta
            var entityType = "incidents";
            var entityId = incidentId;
            var query = "_xmsbs_extensioncaso_value";
            //realizamos la consulta
            var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
            return resultado;
        },
        
        buscarProcesosDeEtapa: function (executionContext, etapaID){
            var entityType = "xmsbs_workflowsetapas";
            var query = "$select=xmsbs_workflowsetapaid,xmsbs_name&$expand=xmsbs_proceso($select=name)&$filter=(_xmsbs_etapa_value eq "+etapaID+")";
            query += "&$orderby=xmsbs_name asc";
            var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
            {});
            return resultado;
        },
        
        oDataCasoDuplicadoMensual: function (executionContext){
            // Determina si ya existe un caso para el mismo RUT, DO, Punto de Contacto, y que sea del mismo mes.
            
            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
            var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
            var detalleoperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion"); 
            var puntodecontacto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_puntodecontacto");
    
            if (incidentId == null || rut == null || detalleoperacion == null || puntodecontacto == null)
                return 0;
    
            var entityType = "incident";
            var query = "$select=xmsbs_numerocorrelativo,incidentid";
            query += "&$filter=(" + 
                "xmsbs_ingresounicofinalizado eq true" +
                " and statuscode ne 657130005 " +
                " and xmsbs_rut eq '" + rut + "'" +
                " and _xmsbs_puntodecontacto_value eq " + puntodecontacto.replace(/[{}]/g, "") +
                " and _xmsbs_detalledeoperacion_value eq " + detalleoperacion.replace(/[{}]/g, "") + 
                " and Microsoft.Dynamics.CRM.ThisMonth(PropertyName='createdon')" +
                " and incidentid ne " + incidentId.replace(/[{}]/g, "") + 
            ")&$top=1";
            
            var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function (){});
            if(resultado){
                if(resultado.value.length > 0){
                    return 1;
                }
            }        
            return 0;
        }, 	
        
        downloadBase64File: function (contentBase64, fileName){
            const linkSource = 'data:application/pdf;base64,' + contentBase64;
            const downloadLink = document.createElement("a");
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();
        },
    
        EnviarNotificacionesCliente: function (idIncident, idAccionEtapa){
            let _mensaje = "";
            var response = null;
                        
            var URL= "CasoAccion/PostEnviarNotificacionesClienteAsync?idIncident=" + idIncident + "&idAccionEtapa=" + idAccionEtapa;
            //var apiToken = window.sessionStorage.getItem("LokiAuthToken");
            var service = RepositorioSucesos.GetRequestObject();
            if (service != null)
            {
                service.open("POST", RepositorioSucesos.URL.Azure + URL, true);
                service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
                service.setRequestHeader("Accept", "application/json,text/javascript, */*");
                service.setRequestHeader("AuthApi", RepositorioSucesos.ApiKey.Key);
                //service.setRequestHeader("TokenApi", apiToken);
                service.send(null);
                if (service.response != "") 
                {
                    response = JSON.parse(service.response);
                }
            }
            
            if (response != null)
            {
                if (response.success) 
                {
                    _mensaje = response.message;
                }
                else
                {
                    _mensaje = response.message;
                }
            }
            
            return response;
        },
        
        EnviarNotificacionesCierreCliente: function (formContext, idIncident, idAccionEtapa, guardaForm){
            debugger;
            var _mensaje = "";
            var URL= "CasoAccion/PostEnviarNotificacionesClienteAsync?idIncident=" + idIncident.replace(/[{}]/g, "") + "&idAccionEtapa=" + idAccionEtapa.replace(/[{}]/g, "");
            RepositorioSucesos.apiPost(URL, null, function (data) {
                if (data.success) 
                {
                    _mensaje = data.message;
                }
                else
                {
                    _mensaje = data.message;
                }  
    
                debugger;
                if (guardaForm){
                    //setTimeout(function () {
                        RepositorioSucesos.ocultarIndicadorProgreso();
                        formContext.data.entity.save();
                        Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);
                    //}, 3000);
                }
            });
        },
            
        EnviarNotificacionCierreAdquirencia: function (formContext, idIncident){  
            var _mensaje = "";
            var URL = "CasoAccion/PostEnviarMailCierreCasoAdquirenciaAsync?idIncident=" + idIncident;
            RepositorioSucesos.apiPost(URL, null, function (data) {
                if (data.success) 
                {
                    _mensaje = data.message;
                }
                else
                {
                    _mensaje = data.message;
                }  
    
                //setTimeout(function () {
                    RepositorioSucesos.ocultarIndicadorProgreso();
                    formContext.data.entity.save();
                    Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), idIncident);                                       
                //}, 3000);
            });
        },
        
        mostrarIndicadorProgreso: function (mensaje){
            Xrm.Utility.showProgressIndicator(mensaje);
        },
        
        ocultarIndicadorProgreso: function (){
            Xrm.Utility.closeProgressIndicator();
        },
        
        ResolverCaso: function (executionContext, modelo){
            var formContext = executionContext.getFormContext();
            var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
            
            if (incidentId.indexOf("{") > -1)
            {
                incidentId = incidentId.substring(1, 37);
            }
            
            var validaDocumentos = Caso.validateDocumentos(executionContext, incidentId);
            if (validaDocumentos.success == true)                
            {
                var formValido = JumpStartLibXRM.Fx.FormGetIsDirty(executionContext);
                if(!formValido)
                {             
                    //Xrm.Utility.showProgressIndicator("Procesando");
                    RepositorioSucesos.mostrarIndicadorProgreso("Procesando");
                    let rutaAPI = '/Caso/ResolverCaso';
                    
                    var request = {
                        IdIncident: incidentId,
                        Estado: 1,
                        RazonEstado: 1
                    };                            
                    
                    RepositorioSucesos.apiPost(rutaAPI, request, function (data) {
                        RepositorioSucesos.ocultarIndicadorProgreso();
                        if (data.success) {
                            var _responseEnviarNotificacionesCliente = RepositorioSucesos.EnviarNotificacionesCliente(incidentId, modelo.accionEtapaId);
                            
                            setTimeout(function () {
                                formContext.data.entity.save();
                                Xrm.Utility.openEntityForm(formContext.data.entity.getEntityName(), incidentId);                                       
                            }, 1000);
                        }
                        else {
                            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: data.message};
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
                    });
                }
                else
                {
                    alert("Guardar registro antes de resolver el caso.")
                }
            }
            else
            {
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error de Validación", text: validaDocumentos.message};
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

        getStateCodeByStatusCodeIncident:function (statuscode){
            if (statuscode == 1 || statuscode == 2 || statuscode == 3 || statuscode == 4 || statuscode == 657130000 || statuscode == 657130001 || statuscode == 657130002 || 
                statuscode == 657130006 || statuscode == 657130008 || statuscode == 657130009 || statuscode == 657130010 || statuscode == 657130011 || statuscode == 657130012)
                return 0; // statecode Activo

            if (statuscode == 1000 || statuscode == 5 || statuscode == 657130003 || statuscode == 657130004 || statuscode == 657130007 || statuscode == 657130013)
                return 1; // statecode Resuelto

            if (statuscode == 2000 || statuscode == 6 || statuscode == 657130005)
                return 2; // statecode Cancelado

            return -1;
        },
        
        ActualizarExtensionCaso : function(executionContext, AttLogicalName, Valor){	
            var xmsbs_extensioncaso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_extensioncaso", null);
            if (xmsbs_extensioncaso)
            {
                var objExtCaso = {};
                objExtCaso[AttLogicalName] = Valor; 
                SDK.WEBAPI.updateRecordImpersonate(executionContext, xmsbs_extensioncaso[0].id.replace(/[{}]/g, ""), objExtCaso, "xmsbs_extensioncaso", RepositorioSucesos.Package.UsuarioAdminID, null, null);
            }
            else
            {
                // En la creación del caso la extensión no está en el form, por lo tanto se debe buscar por oData, el registro DEBE estar creado, de caso contrario es un error, pero no debe impedir el SAVE del caso.
                var extensionCasoID = "";
                
                var incidentId = JumpStartLibXRM.Fx.getEntityId(executionContext);
                var resultado = RepositorioSucesos.validaExtensionCaso(executionContext, incidentId.replace(/[{}]/g, ""));
                if(resultado){
                    extensionCasoID = resultado._xmsbs_extensioncaso_value;
                }
                
                if(!extensionCasoID){
                    
                    // Si ocurre esta condición, la corrección pasa por CREAR la extensión del CASO, NO se debe mostrar un mensaje, ya que con eso el caso quedaría "frenado".
                    // la creación de la extensión en términos normales ocurre al CREAR el caso, por lo que al ejecutar esta fnc de JS la extensión debió haber ocurrido hace varios segundos, 
                    // es casi imposible que sea una tarea pendiente, y que haya que esperar su finalización.
                    // por lo tanto, se asume que el WKF de creación falló, por lo tanto se crea el registro de extensión mediante JS.
    
                    var CorrelativoCaso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_numerocorrelativo", null);
                    var NombreExtensionCaso = "Extensión del caso: " + CorrelativoCaso;
    
                    var CREATEExtCaso = {};
                    CREATEExtCaso[AttLogicalName] = Valor;
                    CREATEExtCaso["xmsbs_name"] = NombreExtensionCaso;
                    CREATEExtCaso["xmsbs_caso@odata.bind"] = "/incidents(" + incidentId.replace(/[{}]/g, "") + ")";;
                    extensionCasoID = SDK.WEBAPI.createRecordImpersonate(executionContext, CREATEExtCaso, "xmsbs_extensioncaso", RepositorioSucesos.Package.UsuarioAdminID);
                    
                    // Setea el lookup en el CASO.
                    var fieldName = "xmsbs_extensioncaso";
                    var name = NombreExtensionCaso;
                    var entityType = "xmsbs_extensioncaso";
                    JumpStartLibXRM.Fx.setLookupValue(executionContext, fieldName, extensionCasoID, name, entityType);			
            
                    return;
                    
                    ////No hay bitacora actual, por lo que desplegamos un mensaje de que porfavor espere unos segundos
                    //var alertStrings = { confirmButtonLabel: "Aceptar", title: "Error", text: "El proceso de creación de caso está finalizando. Favor espere unos segundos y vuelva a avanzar"};
                    //var alertOptions = { height: 120, width: 260 };
                    //Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    //	function (success) {
                    //		//console.log("Alert dialog closed");
                    //	},
                    //	function (error) {
                    //		//console.log(error.message);
                    //	}
                    //);
                    //return false;
                }
                else{
                    //var xmsbs_extensioncaso = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_extensioncaso", null);
                    var objExtCaso = {};
                    objExtCaso[AttLogicalName] = Valor; 
                    SDK.WEBAPI.updateRecordImpersonate(executionContext, extensionCasoID, objExtCaso, "xmsbs_extensioncaso", RepositorioSucesos.Package.UsuarioAdminID, null, null);
                }			
            }
        },
            
        DisminuyeStockAdquirencia: function(executionContext) {
            var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
            var oDetalleOperacion = RepositorioSucesos.buscarDetalleOperacion(executionContext, detalleOperacionID);
    
            // solo aplica si en el Detalle de Operación se indica un "ID Stock Adquirencia"
                if (!oDetalleOperacion.xmsbs_idstockadquirencia)
                    return; 
    
            // continúa solo si está pendiente de actualización de stock 
            var PendienteActualizaStock = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_texto13g", null);
                if (!PendienteActualizaStock || PendienteActualizaStock != "1")
                    return;
    
            // luego de leer la marca, la borra...
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_texto13g", null);
    
            var oStockAdquirencia = RepositorioSucesos.oDataGetStockActual(executionContext, oDetalleOperacion.xmsbs_idstockadquirencia);
                if (!oStockAdquirencia || oStockAdquirencia.value.length == 0)
                    return; // siempre debe existir si es que está indicado en el DO
    
            var StockActual = oStockAdquirencia.value[0].xmsbs_cantidad;
            var NombreProducto = oStockAdquirencia.value[0].xmsbs_name;
    
            var CantidadSolicitada = JumpStartLibXRM.Fx.getValueField(executionContext, oDetalleOperacion.xmsbs_campocantidadsolicitada, null);
    
            var objeto = {};
            objeto["xmsbs_cantidad"] = StockActual - CantidadSolicitada;
            var resultado = SDK.WEBAPI.updateRecordImpersonate(executionContext, oStockAdquirencia.value[0].xmsbs_stockadquirenciaid, objeto, "xmsbs_stockadquirencias", RepositorioSucesos.Package.UsuarioAdminID, null, null);
    
            var alertStrings = "";
                var alertOptions = { height: 120, width: 260 };
    
            if (resultado == "OK") {
                StockActual = StockActual - CantidadSolicitada;
    
                /*
                alertStrings = { confirmButtonLabel: "Aceptar", title: "Stock Actualizado", text: "Se actualiza el Stock a: " + StockActual + " unidades"};
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) { 
                        var FullDateNow = JumpStartLibXRM.Fx.getDateNOW_ddmmaaaa_hhmmss();
                        JumpStartLibXRM.Fx.setFormNotification(executionContext, "WARNING", "Stock actual " + NombreProducto + ": " + StockActual + " unidades. (última lectura: " + FullDateNow + ")", "NOT_StockAdquirencia");			
                    }, 
                    function (error) { } 
                );
                */
    
                // NO SIRVE UN ALERT porque luego de esta función se muestra otro alert, asi que solo se actualiza el mensaje.
    
                var FullDateNow = JumpStartLibXRM.Fx.getDateNOW_ddmmaaaa_hhmmss();
                JumpStartLibXRM.Fx.setFormNotification(executionContext, "WARNING", "Se actualiza el Stock a: " + StockActual + " unidades. (última lectura: " + FullDateNow + ")", "NOT_StockAdquirencia");
                }
                else{
                //alertStrings = { confirmButtonLabel: "Error", title: "Error de Stock", text: "Error al actualizar Stock. Informe al administrador."};
                //Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(function (success) { }, function (error) { } );
    
                JumpStartLibXRM.Fx.setFormNotification(executionContext, "ERROR", "Error al actualizar Stock. Informe al Administrador.", "NOT_StockAdquirencia");
            }
        },
    
        MensajeDevuelveStockAdquirencia: function(executionContext, idAccionEtapa) {
            var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalledeoperacion");
            var oDetalleOperacion = RepositorioSucesos.buscarDetalleOperacion(executionContext, detalleOperacionID);
    
            // solo aplica si en el Detalle de Operación se indica un "ID Stock Adquirencia"
            if (!oDetalleOperacion.xmsbs_idstockadquirencia)
                return ""; 
            // -------------------------------------------------------
    
            // valida que en la etapa siguiente el campo indicado en el DO ("Campo Cantidad Solicitada") sea editable
            var oAccionEtapa = RepositorioSucesos.getAccionEtapa(executionContext, idAccionEtapa);
            if (!oAccionEtapa || !oAccionEtapa._xmsbs_etapasiguiente_value)
                return "";
    
            var Campo = RepositorioSucesos.buscarCampoDeEtapa(executionContext, oAccionEtapa._xmsbs_etapasiguiente_value, oDetalleOperacion.xmsbs_campocantidadsolicitada);
            if (Campo == null || 
                Campo.value.length == 0 || 
                Campo.value[0].xmsbs_lectura == true)
                return "";
            // -------------------------------------------------------
    
            var oStockAdquirencia = RepositorioSucesos.oDataGetStockActual(executionContext, oDetalleOperacion.xmsbs_idstockadquirencia);
            if (!oStockAdquirencia || oStockAdquirencia.value.length == 0) 
                return ""; // siempre debe existir si es que está indicado en el DO
    
            var StockActual = oStockAdquirencia.value[0].xmsbs_cantidad;
            var NombreProducto = oStockAdquirencia.value[0].xmsbs_name;
    
            var CantidadEnUso = JumpStartLibXRM.Fx.getValueField(executionContext, oDetalleOperacion.xmsbs_campocantidadsolicitada, null);
    
            RepositorioSucesos.Package.StockAdquirenciaId = oStockAdquirencia.value[0].xmsbs_stockadquirenciaid;
            RepositorioSucesos.Package.NuevoStock = (StockActual + CantidadEnUso);
    
            return "Además, liberará " + CantidadEnUso + " unidades de " + NombreProducto + ". ";
        },
    
        oDataGetStockActual: function(executionContext, idStock) {
            // idStock = Código Stock
            var entityType = "xmsbs_stockadquirencias";
            var query = "$select=xmsbs_name, xmsbs_cantidad";
            query += "&$filter=(xmsbs_idstock eq '" + idStock + "')";
            var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function() {});
            return resultado;
        }
    };
    
    parent.getContext = function (){
        return RepositorioSucesos.Context.ExecutionContext;
    };
    parent.getFormContext = function (){
        return RepositorioSucesos.Context.FormContext;
    };
    parent.getAzureURL = function (){
        return RepositorioSucesos.URL.Azure;
    };
    parent.getApiKey = function (){
        return RepositorioSucesos.ApiKey.Key;
    };
    parent.getPackage = function (){
        return RepositorioSucesos.Package;
    };
    parent.getIdAccionEtapa = function (){
        return RepositorioSucesos.Package.AccionEtapaId;
    };
    parent.setPopUpZero = function (){
        RepositorioSucesos.PopUp = 0;
    };