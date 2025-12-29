if (typeof(ModificaSLA) == "undefined") {
    ModificaSLA = {
        __namespace: true
    };    
}

ModificaSLA = {
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
		var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();		

		if (tipoFormulario == '2'){
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_name");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_diaslanuevo");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_diaalertanuevo");
        }
	},	
};