if (typeof (Integrante) == "undefined")
{
	Integrante = {
		__namespace: true
	};
}
Integrante = {
	
    UnidadResolutora: {       
		institucion: null,
        institucionName: null,
		CodUR: null,
		IDUR: null
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
                            "6221ca30-f8d6-44ea-a0f2-d5e50e9a77c2"]
    },
	
	onLoad_Formulario: function (executionContext) {
        debugger;
		Integrante.DatosUnidadResolutora(executionContext);
		Integrante.VisibilidadCamposForm(executionContext);
	},
    
	// (se agrega) onchange del campo: xmsbs_unidadresolutora	
	onchange_UR: function (executionContext)
	{
		Integrante.DatosUnidadResolutora(executionContext);
		if(!Integrante.EvaluaIntegranteUR(executionContext))
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_unidadresolutora", null);
		Integrante.VisibilidadCamposForm(executionContext);
	},
		
	// onchange del campo: xmsbs_usuario
	onchange_integranteUR: function (executionContext)
	{
		Integrante.DatosUnidadResolutora(executionContext);
		if(!Integrante.EvaluaIntegranteUR(executionContext))
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_usuario", null);
		Integrante.VisibilidadCamposForm(executionContext);
	},
	
    oDataBuscaIntegranteExistenteEnInstitucion:function(executionContext,usuario,unidadResolutora){
        var entityType = "xmsbs_integranteurs";
        var query = "$select=xmsbs_integranteurid,xmsbs_name&$expand=xmsbs_unidadResolutora($select=xmsbs_name)";
        query += "&$filter=(statecode eq 0 and _xmsbs_usuario_value eq "+usuario+") and (xmsbs_unidadResolutora/_xmsbs_institucion_value eq "+unidadResolutora+")&$orderby=xmsbs_name asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    oDataUnidadResolutora: function (executionContext, unidadId)
	{
		//Preparamos la consulta
		var entityType = "xmsbs_unidadresolutoras";
		var entityId = unidadId;
		var query = "xmsbs_unidadresolutoraid,xmsbs_codigo,xmsbs_institucion";
        var expand = "xmsbs_institucion($select=xmsbs_name,xmsbs_institucionid)";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
		return resultado;
	},
	
	DatosUnidadResolutora: function(executionContext)
	{
		// Solo si la UR contiene datos, entonces consulta el registro por oData
		var unidadresolutoraID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_unidadresolutora");
		if (!unidadresolutoraID)
		{
			Integrante.UnidadResolutora.institucion = null;
			Integrante.UnidadResolutora.institucionName = null;
			Integrante.UnidadResolutora.CodUR = null;
			return;
		}
			
		if (unidadresolutoraID.indexOf("{") > -1)
			{unidadresolutoraID = unidadresolutoraID.substring(1, 37);}
		
		if (Integrante.UnidadResolutora.IDUR == unidadresolutoraID)
			return; // No lee ni setea los campos de la UR, ya que es la misma que ya está en el contexto.
		
		var resultado = Integrante.oDataUnidadResolutora(executionContext, unidadresolutoraID);
		if(resultado){
			if (resultado.xmsbs_institucion)
			{
				Integrante.UnidadResolutora.institucion = resultado.xmsbs_institucion.xmsbs_institucionid;
				Integrante.UnidadResolutora.institucionName = resultado.xmsbs_institucion.xmsbs_name;				
			}
			Integrante.UnidadResolutora.CodUR = resultado.xmsbs_codigo;
			Integrante.UnidadResolutora.IDUR = unidadresolutoraID;
		}		
	},
	
	VisibilidadCamposForm: function (executionContext)
	{
		var formContext = executionContext.getFormContext();
		
		// default visible = false, se aplica también en el onchange
		formContext.ui.tabs.get("general").sections.get("reguladores").setVisible(false); //Reguladores
		formContext.ui.tabs.get("general").sections.get("contact").setVisible(false); //Contact Center
		formContext.ui.tabs.get("general").sections.get("general_section_sucursales").setVisible(false);
		formContext.ui.tabs.get("general").sections.get("general_section_sucursalesderivacion").setVisible(false);
		
		JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tipogestion"); 
		//---------------------
		
		var usuario = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_usuario");
        var unidadResolutora = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_unidadresolutora");
		if (!usuario || !unidadResolutora)
			return;
		
		if(!Integrante.UnidadResolutora.institucion)
			return;
		
        if(Integrante.UnidadResolutora.institucionName.toUpperCase() == "ADQUIRENCIA")
        {
            // En caso de existir personalización para Adquirencia, se debe agregar en esta sección.
            JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_segmentosdeatencion");
            return;
        }
		
		var NombreUR = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_unidadresolutora", "").toUpperCase();
		
        if(Integrante.UnidadResolutora.institucionName.toUpperCase() == "BANCO SANTANDER")
        {
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_segmentosdeatencion");
            //---------------- 
            //CodUR
            //if(NombreUR == "CONTACT CENTER PERSONAS" || NombreUR == "CONTACT CENTER EMPRESAS" || NombreUR == "CONTACT CENTER CALIDAD" || NombreUR == "CONTACT CENTER COBRANZA")
            //if(Integrante.UnidadResolutora.CodUR == "CC-PE" || Integrante.UnidadResolutora.CodUR == "UR-067" || Integrante.UnidadResolutora.CodUR == "CC-CA" || Integrante.UnidadResolutora.CodUR == "UR-069")
			if(NombreUR.startsWith('CONTACT') || NombreUR.startsWith('BEI') || Integrante.UnidadResolutora.CodUR == "UR-254")
            {
                formContext.ui.tabs.get("general").sections.get("reguladores").setVisible(false); //Reguladores
                formContext.ui.tabs.get("general").sections.get("contact").setVisible(true); //Contact Center
                
                //Etiquetas de los campos de Jefaturas
                JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_subgerente", "Jefe / Subgerencia");
                JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_jefezonal", "Jefe Zonal");
                JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_jefeplataforma", "Jefe de Plataforma");

                //Lógica de bloqueo de campos si no soy jefe
                Integrante.BloqueaCamposJefes(executionContext);
            }
            // else if(NombreUR == "TERRITORIAL NORTE" || NombreUR == "TERRITORIAL PONIENTE" || NombreUR == "TERRITORIAL OCTAVA" || NombreUR == "TERRITORIAL ORIENTE" || NombreUR == "TERRITORIAL SUR" || NombreUR == "TERRITORIAL QUINTA" || NombreUR == "TERRITORIAL BARRIO CIVICO" || NombreUR == "TERRITORIAL CENTRO")
            //else if(Integrante.UnidadResolutora.CodUR == "UR-083" || Integrante.UnidadResolutora.CodUR == "UR-082" || Integrante.UnidadResolutora.CodUR == "UR-084" || Integrante.UnidadResolutora.CodUR == "UR-085" || Integrante.UnidadResolutora.CodUR == "UR-086" || Integrante.UnidadResolutora.CodUR == "UR-087" || Integrante.UnidadResolutora.CodUR == "UR-088" || Integrante.UnidadResolutora.CodUR == "UR-089")
			else if(NombreUR.startsWith('TERRITORIAL'))
            {
                formContext.ui.tabs.get("general").sections.get("reguladores").setVisible(false); //Reguladores
                formContext.ui.tabs.get("general").sections.get("contact").setVisible(true); //Contact Center	

                //Etiquetas de los campos de Jefaturas
                JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_subgerente", "Jefe Territorial");
                JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_jefezonal", "Jefe Zonal");
                JumpStartLibXRM.Fx.setLabel(executionContext, "xmsbs_jefeplataforma", "Agente");

                //Lógica de bloqueo de campos si no soy jefe
                Integrante.BloqueaCamposJefes(executionContext);
				
				formContext.ui.tabs.get("general").sections.get("general_section_sucursales").setVisible(true);
				formContext.ui.tabs.get("general").sections.get("general_section_sucursalesderivacion").setVisible(true);
				//JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_tipogestion");
                
                //Se pide bloquear el campo disponible para toda la red de sucursales - Luis Cordero 20250218
                var disponible = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_disponible", null);
                if(disponible == true){
                    JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_disponible");
                }
                else{
                    JumpStartLibXRM.Fx.enableField(executionContext, "xmsbs_disponible");
                }
            }
            //else if(NombreUR == "REGULADORES")
            else if(Integrante.UnidadResolutora.CodUR == "UR-001")
            {
                formContext.ui.tabs.get("general").sections.get("reguladores").setVisible(true); //Reguladores
                formContext.ui.tabs.get("general").sections.get("contact").setVisible(false); //Contact Center
            }
        }
	},

    BloqueaCamposJefes: function (executionContext)
	{
        debugger;
        var usuarioActual = JumpStartLibXRM.Fx.getUserId();
        if (usuarioActual.indexOf("{") > -1){usuarioActual = usuarioActual.substring(1, 37);}
                    
        var JefeSubgerente = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_subgerente");
        if(JefeSubgerente){if (JefeSubgerente.indexOf("{") > -1){JefeSubgerente = JefeSubgerente.substring(1, 37);}}
        
        var jefeZonal = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_jefezonal");
        if(jefeZonal){if (jefeZonal.indexOf("{") > -1){jefeZonal = jefeZonal.substring(1, 37);}}
        
        var jefePlataforma = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_jefeplataforma");
        if(jefePlataforma){if (jefePlataforma.indexOf("{") > -1){jefePlataforma = jefePlataforma.substring(1, 37);}}
        
        let array = new Array ();            
        Integrante.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
        );
        Integrante.RolesArray.SantanderUrAdmin.forEach( 
            function (x){
                array.push(x);
            }
        );
        let found = JumpStartLibXRM.Fx.UserHasRolesArray(executionContext, array);  

        let foundSubgerente = false;
        if(JefeSubgerente){
            if(usuarioActual.toLowerCase() == JefeSubgerente.toLowerCase()){
                foundSubgerente = true;
            }
        }
        
        let foundZonal = false;
        if(jefeZonal){
            if(usuarioActual.toLowerCase() == jefeZonal.toLowerCase()){
                foundZonal = true;
            }
        }
        
        let foundPlataforma = false;
        if(jefePlataforma){
            if(usuarioActual.toLowerCase() == jefePlataforma.toLowerCase()){
                foundPlataforma = true;
            }
        }
        
        if(found || foundPlataforma || foundZonal || foundSubgerente){
            //No hace nada
        }
        else{
            //No lo encuentra y bloquea campos
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_subgerente");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_jefezonal");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_jefeplataforma");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_disponible");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_unidadresolutora");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_usuario");
        }
    },
	
	EvaluaIntegranteUR: function (executionContext)
	{
        debugger;
		var usuario = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_usuario");
        var unidadResolutora = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_unidadresolutora");
        
        if(!usuario || !unidadResolutora)
			return true;
		if(!Integrante.UnidadResolutora.institucion)
			return;		
		
		var institucion = Integrante.UnidadResolutora.institucion;
		var institucionName = Integrante.UnidadResolutora.institucionName;

		if(institucionName.toUpperCase() == "BANCO SANTANDER")
		{
			//Si es Banco Santander se debe limitar a que solo pueda estar en 1 solo lado
			//Ya trajimos la institución, ahora buscamos al usuario en alguna UR de esa institución
			
			if (institucion.indexOf("{") > -1){institucion = institucion.substring(1, 37);}
			if (usuario.indexOf("{") > -1){usuario = usuario.substring(1, 37);}
			
			var resultado = Integrante.oDataBuscaIntegranteExistenteEnInstitucion(executionContext,usuario,institucion);
			if(resultado){
				if(resultado.value.length > 0){
					var unidadExistente = resultado.value[0].xmsbs_unidadResolutora.xmsbs_name;
					var alertStrings = { confirmButtonLabel: "Aceptar", title: "Usuario Existente", text: "No puede agregar al usuario dado que ya forma parte de la Unidad Resolutora " + unidadExistente};
					var alertOptions = { height: 120, width: 260 };
					Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
						function (success) {},
						function (error) {
							//console.log(error.message);
						}
					);
					return false;
				}
			}
		}
		else{
			//No es banco (es adquirencia por ejemplo), por lo que no hay limite
		}
		return true;
	},
	
    oDataBuscaOtrosIntegrantesDisponiblesUR:function(executionContext,usuario,unidadResolutora){
        var entityType = "xmsbs_integranteurs";
        var query = "$select=xmsbs_integranteurid,xmsbs_name,createdon";
        query += "&$filter=(_xmsbs_unidadresolutora_value eq '"+unidadResolutora+"' and xmsbs_disponible eq true and _xmsbs_usuario_value ne '"+usuario+"' and statecode eq 0)&$orderby=xmsbs_name asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    onchange_disponible:function(executionContext){
        debugger;
        var unidadresolutoraID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_unidadresolutora");
        var usuarioID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_usuario");
        var disponible = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_disponible", null);
        
        if(disponible == false){
            //Lo marcó como no disponible. Tenemos que buscar a todos los otros integrantes activos que no sea él, para ver si hay alguien disponible
            var respuesta = Integrante.oDataBuscaOtrosIntegrantesDisponiblesUR(executionContext,usuarioID,unidadresolutoraID);
            if(respuesta && respuesta.value.length > 0){
                //Encontró al menos a 1 que sigue disponible. Estaría ok.
            }
            else{
                //No hay nadie mas disponible, alerta y no lo deja
                var alertStrings = { confirmButtonLabel: "Aceptar", title: "Validación", text: "No puede dejar a la Unidad Resolutora sin ningún integrante Disponible. Revise los otros integrantes para marcar alguno como Disponible."};
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
                
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_disponible", true);
            }
        }
    },
};