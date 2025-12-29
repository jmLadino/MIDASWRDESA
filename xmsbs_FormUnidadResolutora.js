if (typeof (Unidad) == "undefined")
{
	Unidad = {
		__namespace: true
	};
}

Unidad = {   
    Context: {        
        Execution: null,
        Form: null,
    },
    URL: {        
        Azure: "",
        Name: "AzureURL"
    },
	
	ApiKey: {
        Key: "",
        Name: "AuthApi"
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
                           "6221ca30-f8d6-44ea-a0f2-d5e50e9a77c2",  
                           "b93c3b2a-16e6-4d00-9346-f0a604b2c993"],
        SantanderAdquerenciaUrAdmin2: ["06bf04ba-1197-eb11-b1ac-000d3a479b8f",
                                       "55f5fae3-7961-445e-9cab-10ee9034c321", 
                                       "b013a7de-9272-4308-854f-1e24d01e9ad1",  
                                       "eb5bd81a-edac-4537-8c46-57cf815d5084",   
                                       "eab2fd20-650c-4613-83d4-77c6799d8982",  
                                       "e1714918-6c99-4e3a-996d-7c5300a76521",  
                                       "6432ed98-66ea-4268-9fbb-e9d37719b274"],
        SantanderContactCenterEjecutivo: ["63717840-68f0-eb11-bacb-000d3ab3cef2", 
                                          "b874c33b-6d86-4548-a224-3370f069c5b4",  
                                          "bd5860d8-db8f-4428-a837-5d4e10481d0a",  
                                          "977251d7-6aa1-4fb8-bcb0-793a1a97d7d8", 
                                          "9ae8723f-3b1b-4ec0-bd34-c30473514fec",  
                                          "9d163059-279e-4c4f-9144-d7acb3e76df7",  
                                          "41ee80b1-811c-4d27-a93c-df8c90b4f9e4"],
       AdministradorFuncionalGrupoSantander: ["3735d779-7b6c-eb11-a812-00224803adb8",
                                              "060e6d4a-3575-4b3c-81b5-00415410bd46",
                                              "be3e6d31-a635-4ac2-86e9-1e34678c0d4d",
                                              "e1786c76-58f7-498e-801b-5aaa063a8a42",
                                              "3d038456-902c-4ccd-845d-5f4c11448f4b",
                                              "5cbc6e6f-924b-4ca0-ae88-b652b5d514de",
                                              "68f5bd0e-3753-47f8-b5d0-ee5ebf323be1"],
       SantanderAdquirenciaSupervisor: [  "002bb930-10aa-ec11-983f-000d3add0341",
                                          "7451efdf-26c4-459d-8330-194ff1ba9dd0",  
                                          "9d6955c6-2e9d-45d8-8449-4bb330939914", 
                                          "92f7928b-227b-4941-a66d-91afaf0b80dd", 
                                          "7385b6f0-4716-421d-857d-c944766f2407",  
                                          "e23d1bb1-7097-4847-943a-d65870f64cdd",   
                                          "75216f79-7c1b-4a1c-b4e4-f2f8f425847b"],
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
        ]
    },
	
    onLoad_Formulario: function (executionContext) {
		//debugger;
		var formContext = executionContext.getFormContext();
		Unidad.Context.Execution = executionContext;
		Unidad.Context.Form = formContext;
        
		//Muestro la seccion de los integrantes segun corresponda por App
		Unidad.seccionesIntegrantes(executionContext);
		
		//Bloqueo campos de responsable para los Jefes Canales
		Unidad.jefesCanales(executionContext);		
		
		//Siempre oculto la seccion de ocultos 
		formContext.ui.tabs.get("general").sections.get("ocultos").setVisible(false); //ocultos
        //Unidad.onClickButtonActivarBackupJefe(executionContext);
        //Unidad.onClickButtonDesactivarBackupJefe(executionContext);
	},
	
    jefesCanales: function (executionContext){
        //debugger;
		let array = new Array ();
        Unidad.RolesArray.JefeCanales.forEach( 
            function (x){
                array.push(x);
            }
        );
            
        let jefe = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
        
        if(jefe){
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_responsable");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_tipodeasignacion");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_backupresponsable");			
		}else{
			JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_responsable");
			JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_tipodeasignacion");
			JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_backupresponsable");
		}


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
    
    seccionesIntegrantes: function (executionContext){
        //debugger;
        var globalContext = Xrm.Utility.getGlobalContext();

        globalContext.getCurrentAppProperties().then(
            function success(app){
                var respuesta = app
                var nombreApp = respuesta.displayName;
				var formContext = executionContext.getFormContext();
				
                if(nombreApp.toLowerCase().indexOf("midas jefe canales") > -1){
                    //Si contiene Jefe Canales, entonces muestro la seccion de Mi integrantes UR Canales
					formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_1").setVisible(false); //Integrantes Normal
					formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_2").setVisible(true); //Integrante de MI UR Canales
                }
                else{
                    //NO contiene Jefe Canales, entonces muestro la seccion Normal
					formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_1").setVisible(true); //Integrantes Normal
					formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_2").setVisible(false); //Integrante de MI UR Canales
                }
            },
            function errorCallback() { console.log("Error"); }
        );
    },	
    
    buscarApiKey: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + Unidad.ApiKey.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},    
    
    buscarAzureURL: function (executionContext){
		var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_name,xmsbs_parametroid,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + Unidad.URL.Name + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
    buscarJefeIntegranteUR: function (executionContext, idUsuario, idUR){
        var entityType = "xmsbs_integranteur";
        var query = "$select=_xmsbs_usuario_value,_xmsbs_unidadresolutora_value,_xmsbs_subgerente_value,_xmsbs_jefeplataforma_value,_xmsbs_jefezonal_value&$orderby=createdon desc";
        query += "&$filter=statecode eq 0 and _xmsbs_unidadresolutora_value eq '" + idUR + "' and (_xmsbs_subgerente_value eq '" + idUsuario + "' or _xmsbs_jefeplataforma_value eq '" + idUsuario + "' or _xmsbs_jefezonal_value eq '" + idUsuario + "')";
        //query += "' and (_xmsbs_subgerenteoriginal_value ne '" + idUsuario + "' or _xmsbs_jefeplataformaoriginal_value ne '" + idUsuario + "' or _xmsbs_jefezonaloriginal_value ne '" + idUsuario + "')";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarJefeIntegranteUROriginal: function (executionContext, idUsuario, idUR){
        var entityType = "xmsbs_integranteur";
        var query = "$select=_xmsbs_usuario_value,_xmsbs_unidadresolutora_value,_xmsbs_subgerente_value,_xmsbs_jefeplataforma_value,_xmsbs_jefezonal_value&$orderby=createdon desc";
        query += "&$filter=statecode eq 0 and _xmsbs_unidadresolutora_value eq '" + idUR + "' and (_xmsbs_subgerenteoriginal_value eq '" + idUsuario + "' or _xmsbs_jefeplataformaoriginal_value eq '" + idUsuario + "' or _xmsbs_jefezonaloriginal_value eq '" + idUsuario + "')";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    buscarSiJefeSucursalQueja: function (executionContext, idUsuario, idUR){
        var entityType = "xmsbs_sucursalintegranteurs";
        var query = "$select=xmsbs_sucursalintegranteurid,_xmsbs_sucursalcliente_value,_xmsbs_integrantedelaur_value&$expand=xmsbs_integrantedelaur($select=_xmsbs_usuario_value)";
        query += "&$filter=(xmsbs_integrantedelaur/_xmsbs_usuario_value eq '"+idUsuario+"' and xmsbs_integrantedelaur/_xmsbs_unidadresolutora_value eq '"+idUR+"')&$orderby=_xmsbs_sucursalcliente_value asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    //=======
    //BOTONES
    //=======	
    
	//BACKUP RESPONSABLE UR
    enableButtonActivarResponsableBackup: function (executionContext){
        //debugger;
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext); 
        
        if (idUsuario.indexOf("{") > -1)
        {
            idUsuario = idUsuario.substring(1, 37);
        }
        
        let array = new Array ();
        Unidad.RolesArray.SantanderUrAdmin.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        Unidad.RolesArray.SantanderAdquerenciaUrAdmin2.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        Unidad.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);        
               
        if (estado == '2' && found){     
			var ActivarBackup = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_activar");
			if(ActivarBackup == false || ActivarBackup == null){
				return true;
			}
			else{
				return false;
			}
        }
        else{
            return false;
        }
    },	

    onClickButtonActivarResponsableBackup: function (executionContext) {	
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
		var Backup = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_backupresponsable");
        
        if (idUsuario.indexOf("{") > -1)
        {
            idUsuario = idUsuario.substring(1, 37);
        }
        
        let array = new Array ();
        Unidad.RolesArray.SantanderUrAdmin.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        Unidad.RolesArray.SantanderAdquerenciaUrAdmin2.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        Unidad.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
        
        if(Backup && found){	
			//Hace click en solicitar activar Backup
			var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Backup", subtitle:"Va a activar el Backup de la Unidad Resolutora. ¿Desea Continuar?"};
			var confirmOptions  = { height: 200, width: 260 };
			Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
				function (success) {
					if(success.confirmed)
					{
						//Si confirma
						//Marco el campo para activar el backup = SI
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_activar", true);

						//Guardamos el cambio
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
		else{
			//Si no tiene Backup, no se activa el proceso
			var alertStrings = { confirmButtonLabel: "Aceptar", title: "BackUp", text: "La UR no tiene Backup asignado o no cuentas con el Rol de UR Adminsitrador, por lo que no se puede activar el proceso"};
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

    enableButtonDesactivarResponsableBackup: function (executionContext){		
        //debugger;
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
        var estado = JumpStartLibXRM.Fx.getFormType(executionContext);        
        
        if (idUsuario.indexOf("{") > -1)
        {
            idUsuario = idUsuario.substring(1, 37);
        }
        
        let array = new Array ();
        Unidad.RolesArray.SantanderUrAdmin.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        Unidad.RolesArray.SantanderAdquerenciaUrAdmin2.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        Unidad.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
        
        if (estado == '2' && found){     
			var ActivarBackup = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_activar");
			if(ActivarBackup == true){
				return true;
			}
			else{
				return false;
			}
        }
        else{
            return false;
        }
    },	

    onClickButtonDesactivarResponsableBackup: function (executionContext) {	
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
		var Responsable = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_responsableoriginal");
        
        if (idUsuario.indexOf("{") > -1)
        {
            idUsuario = idUsuario.substring(1, 37);
        }
        
        let array = new Array ();
        Unidad.RolesArray.SantanderUrAdmin.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        Unidad.RolesArray.SantanderAdquerenciaUrAdmin2.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        Unidad.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
        
        if(Responsable && found){	
			//Hace click en solicitar activar Backup
			var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Backup", subtitle:"Va a Desactivar el Backup de la Unidad Resolutora. ¿Desea Continuar?"};
			var confirmOptions  = { height: 200, width: 260 };
			Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
				function (success) {
					if(success.confirmed)
					{
						//Si confirma
						//Marco el campo para activar el backup = SI
						JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_activar", false);

						//Guardamos el cambio
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
		else{
			//Si no tiene responsable original, no se activa el proceso
			var alertStrings = { confirmButtonLabel: "Aceptar", title: "BackUp", text: "La UR no almacenó el responsable original o no cuenta con rol de UR Administrador. Contacte al Administrador del Sistema"};
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
    
    //BACKUP JEFE INTEGRANTE UR
    enableButtonActivarBackupJefe: function (executionContext){		
        debugger;
        var estado = JumpStartLibXRM.Fx.getFormType(executionContext);        
        if (estado == '2'){     
			var idUsuario = JumpStartLibXRM.Fx.getUserId();
            var idUR = JumpStartLibXRM.Fx.getEntityId(executionContext);
            
            if (idUsuario.indexOf("{") > -1)
            {
                idUsuario = idUsuario.substring(1, 37);
            }
            
            if (idUR.indexOf("{") > -1)
            {
                idUR = idUR.substring(1, 37);
            }
            
            let array = new Array ();
            
            Unidad.RolesArray.JefeCanales.forEach( 
                function (x){
                    array.push(x);
                }
            );        
            
            Unidad.RolesArray.SystemUser.forEach( 
                function (x){
                    array.push(x);
                }
            );
            
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
            var JefeIntegranteUR = Unidad.buscarJefeIntegranteUR(executionContext, idUsuario, idUR);
            var JefeIntegranteUROriginal = Unidad.buscarJefeIntegranteUROriginal(executionContext, idUsuario, idUR);
            //debugger;
            //if (found && (JefeIntegranteUR != null && JefeIntegranteUR.value.length > 0) && (JefeIntegranteUROriginal == null || JefeIntegranteUROriginal.value.length == 0)){     
            if (found){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    },	

    onClickButtonActivarBackupJefe: function (executionContext) {
        debugger;
        var idUsuario = JumpStartLibXRM.Fx.getUserId();
        if (idUsuario.indexOf("{") > -1){idUsuario = idUsuario.substring(1, 37);}
        var idUR = JumpStartLibXRM.Fx.getEntityId(executionContext);
        if (idUR.indexOf("{") > -1){idUR = idUR.substring(1, 37);}
        
        let arrayJefeCanales = new Array ();
        Unidad.RolesArray.JefeCanales.forEach( 
            function (x){
                arrayJefeCanales.push(x);
            }
        );
        
        let arraySystemUser = new Array ();
        Unidad.RolesArray.SystemUser.forEach( 
            function (x){
                arraySystemUser.push(x);
            }
        );
        
        let foundJefeCanales = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, arrayJefeCanales);
        let foundSystemUser = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, arraySystemUser);
        
        var JefeIntegranteUR = Unidad.buscarJefeIntegranteUR(executionContext, idUsuario, idUR);
        var JefeSucursalQueja = Unidad.buscarSiJefeSucursalQueja(executionContext, idUsuario, idUR);
        
        //if(JefeIntegranteUR.value.length > 0 && found) {            
        if(foundSystemUser || (foundJefeCanales && (JefeIntegranteUR.value.length > 0 || JefeSucursalQueja.value.length > 0))) {
            var AzureURL = Unidad.buscarAzureURL(executionContext);
            var ApiKey = Unidad.buscarApiKey(executionContext);
            PopUp.openWRAsignarJefeIntegranteUR(executionContext, AzureURL.value[0].xmsbs_valor, ApiKey.value[0].xmsbs_valor);
        }
        else {
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Backup Jefe Integrante UR", text: "No cuenta con rol de Jefe Canales o no posee integrantes bajo su jefatura. No puede proceder con la ejecución."};
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
    
    enableButtonDesactivarBackupJefe: function (executionContext){		
        debugger;
        var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        if (estado == '2'){ 
            var idUsuario = JumpStartLibXRM.Fx.getUserId();
            var idUR = JumpStartLibXRM.Fx.getEntityId(executionContext);
            
            if (idUsuario.indexOf("{") > -1)
            {
                idUsuario = idUsuario.substring(1, 37);
            }
            
            if (idUR.indexOf("{") > -1)
            {
                idUR = idUR.substring(1, 37);
            }
            
            let array = new Array ();
            
            Unidad.RolesArray.JefeCanales.forEach( 
                function (x){
                    array.push(x);
                }
            );
            
            Unidad.RolesArray.SystemUser.forEach( 
                function (x){
                    array.push(x);
                }
            );
            
            let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
            var JefeIntegranteUROriginal = Unidad.buscarJefeIntegranteUROriginal(executionContext, idUsuario, idUR);
            
            //if (JefeIntegranteUROriginal.value.length > 0 && found){     
            if (found){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }        
    },
    
    onClickButtonDesactivarBackupJefe: function (executionContext) {
        debugger;
		var idUsuario = JumpStartLibXRM.Fx.getUserId();
		var idUR = JumpStartLibXRM.Fx.getEntityId(executionContext);
        
        if (idUsuario.indexOf("{") > -1)
        {
            idUsuario = idUsuario.substring(1, 37);
        }
        
        if (idUR.indexOf("{") > -1)
        {
            idUR = idUR.substring(1, 37);
        }
        
        let array = new Array ();
        
        Unidad.RolesArray.JefeCanales.forEach( 
            function (x){
                array.push(x);
            }
        );

        Unidad.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);
        var JefeIntegranteUROriginal = Unidad.buscarJefeIntegranteUROriginal(executionContext, idUsuario, idUR);
        //debugger;
        //if(JefeIntegranteUROriginal.value.length > 0 && found) {
        if(found) {
            var AzureURL = Unidad.buscarAzureURL(executionContext);
            var ApiKey = Unidad.buscarApiKey(executionContext);
            PopUp.openWRDesactivarJefeIntegranteUR(executionContext, AzureURL.value[0].xmsbs_valor, ApiKey.value[0].xmsbs_valor);
            
//          var alertStrings = { confirmButtonLabel: "Aceptar", title: "Backup Jefe Integrante UR", text: "¿Desesa proceder con la desactivación de Back Jefe Integrante UR?. Esta acción puede tardar un momento."};
//			var alertOptions = { height: 120, width: 260 };
//			Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
//				function (success) {
//					//debugger;
//                    var AzureURL = Unidad.buscarAzureURL(executionContext);
//                    var ApiKey = Unidad.buscarApiKey(executionContext);
//                    var ApiUrl = "UnidadResolutora/DesactivarBackupJefeIntegranteUR/" + idUR + "/" + idUsuario;
//                    var service = Unidad.GetRequestObject();
//
//                    if (service != null)
//                    {
//                        service.open("POST", AzureURL.value[0].xmsbs_valor + ApiUrl, false);
//                        //service.open("POST", "http://localhost:58839/" + ApiUrl, false);
//                        service.setRequestHeader("X-Requested-Width", "XMLHttpRequest");
//                        service.setRequestHeader("Accept", "application/json,text/javascript, */*");
//                        service.setRequestHeader(Unidad.ApiKey.Name, ApiKey.value[0].xmsbs_valor);
//                        service.send(null);
//                        
//                        if (service.response != "") 
//                        {
//                            response = JSON.parse(service.response);
//                        }
//                    }
//                    
//                    if (response)
//                    {
//                        alert(response.message);
//                        JumpStartLibXRM.Fx.formSave(executionContext);
//                    }
//                    
//				},
//				function (error) {
//					//console.log(error.message);
//				}
//			);
        }
        else {
            var alertStrings = { confirmButtonLabel: "Aceptar", title: "Backup Jefe Integrante UR", text: "No cuenta con rol de 'Contact Center - Jefe / Supervisor' o no posee jefaturas. No se puede proceder con la ejecución."};
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
    
    enableButtonDesactivarUR: function (executionContext){		
        debugger;
        let array = new Array ();
        
        Unidad.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        let found = Unidad.UserHasRolesArray(executionContext, array);
        
        if (found){
            return true;
        }
        else{
            return false;
        }
    },
    
    UserHasRolesArray: function (executionContext,rolesArray) {   
       // debugger;    
        var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        var found = false;
        if (rolesArray != undefined && rolesArray != null && rolesArray.length > 0) {                   
            var currentUserRoles = userSettings.securityRoles;
            for (var i = 0; i < currentUserRoles.length; i++) {
                var userRole = currentUserRoles[i].replace(/[{}]/g, "").toLowerCase();;
                for (var j = 0; j < rolesArray.length; j++) {
                    if (Unidad.guidsAreEqual(userRole, rolesArray[j])) {
                        found = true;
                        break;
                    }
                }
                if (found){
                    break;
                }     
            }                 
        }
       return found;           
    },
    
    guidsAreEqual: function (guid1, guid2) {
        var isEqual;
        if (guid1 === null || guid2 === null || guid1 === undefined || guid2 === undefined) {
            isEqual = false;
        }
        else {
            isEqual = guid1.replace(/[{}]/g, "").toLowerCase() === guid2.replace(/[{}]/g, "").toLowerCase();
        }
        return isEqual;
    },
};