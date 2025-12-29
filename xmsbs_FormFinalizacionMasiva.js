if (typeof(FinalizacionMasiva) == "undefined") {
    FinalizacionMasiva = {
        __namespace: true
    };    
}

FinalizacionMasiva = {
	
	Roles: {
		Supervisor: "[Adquirencia] - Rol Supervisor",
    },	
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
		debugger;
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();

		if (tipoFormulario == '1')
        {		
			//Valido que sea el Admin de GETNET
			if (JumpStartLibXRM.Fx.UserHasRole(executionContext, FinalizacionMasiva.Roles.Supervisor))
			{
				//Cuando es Adquirencia
				executionContext.getFormContext().getControl("xmsbs_tipoproceso").removeOption(657130000);				
			}else{
				//Cuando es Banco 
				executionContext.getFormContext().getControl("xmsbs_tipoproceso").removeOption(657130003);				
			}	
		}
		else{
            //Valido si ya subió el documento para bloquear todo el formulario
            var archivo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_archivocarga", null);
            if(archivo){
                //Bloqueo todo el formulario
                JumpStartLibXRM.Fx.formEnableDisableAllControls(executionContext, true);
            }		
		}
	},
	
//==================
//FUNCIONES ONCHANGE
//==================

    onChange_bloqueo: function (executionContext) {
		//Valido si ya subió el documento para bloquear todo el formulario
		var archivo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_archivocarga", null);
		if(archivo){
			//Bloqueo todo el formulario
			JumpStartLibXRM.Fx.formEnableDisableAllControls(executionContext, true);
		}		
	},	
	
//==================
//FUNCIONES ONSAVE
//==================
//NO se van a ocupar las funciones al guardar

	onSave_Formulario: function (executionContext){
		FinalizacionMasiva.formContext.data.entity.addOnPostSave(FinalizacionMasiva.PostOnSave);
    },
	
	PostOnSave: function (executionContext){
		// workaround para el refresh de la grilla. 
		// si el formulario es creación, entonces fuerza el refresh de la página.
		if (FinalizacionMasiva.Form.FormTypePreSave == JumpStartLibXRM.FormState.CREATE){
			//Bloqueo todo el formulario
			JumpStartLibXRM.Fx.formEnableDisableAllControls(executionContext, true);
		}
	},

};
