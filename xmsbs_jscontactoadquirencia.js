if (typeof(ContactoAdquirencia) == "undefined") {
    ContactoAdquirencia = {
        __namespace: true
    };    
}

    ContactoAdquirencia = {
		
	Roles: {
		AdminFuncional: "[Adquirencia] - Administrador Funcional",
		URAdmin: "[Adquirencia] - UR Administrador",
		Ejecutivo: "[Adquirencia] - Usuario Ejecutivo",
		Administrador: "Administrador del sistema"
	},	

    //onload
    preloadAdquirencia: function (executionContext){
        debugger;
        var adquirenciaID = ContactoAdquirencia.getAdquirenciaID(executionContext);
        var tipoFormulario = JumpStartLibXRM.Fx.getFormType(executionContext);
        
        if (tipoFormulario == '1')
        {
            if(adquirenciaID)
            {
                if (JumpStartLibXRM.Fx.UserHasRole(executionContext, ContactoAdquirencia.Roles.AdminFuncional) || JumpStartLibXRM.Fx.UserHasRole(executionContext, ContactoAdquirencia.Roles.URAdmin) || JumpStartLibXRM.Fx.UserHasRole(executionContext, ContactoAdquirencia.Roles.Ejecutivo) || JumpStartLibXRM.Fx.UserHasRole(executionContext, ContactoAdquirencia.Roles.Administrador))
                {
					var institucionName = adquirenciaID.value[0].xmsbs_name;
					var institucionId = adquirenciaID.value[0].xmsbs_institucionid;
					JumpStartLibXRM.Fx.setLookupValue(executionContext, "xmsbs_institucion", institucionId, institucionName, "xmsbs_institucion");
					JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_institucion");
                }
            }
        }
    },

    //onchange
	
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
	
     getAdquirenciaID: function (executionContext)
    {
        var entityType = "xmsbs_institucion";
        var query = "$select=xmsbs_institucionid,xmsbs_name";
        query += "&$filter=(xmsbs_name eq 'Adquirencia')";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query);
        return resultado;
        //https://midaschiledesa.crm2.dynamics.com/api/data/v9.2/xmsbs_institucions?$select=xmsbs_institucionid,xmsbs_name,createdon&$filter=(xmsbs_name eq 'Adquirencia')&$orderby=xmsbs_name asc
    },
};