if (typeof(informacionadicional) == "undefined") {
    informacionadicional = {
        __namespace: true
    };    
}

informacionadicional = {
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
		var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();		

		if (tipoFormulario == '2'){
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_name");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_casorelacionado");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_cliente");
			JumpStartLibXRM.Fx.disableField(executionContext, "ownerid");
            JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_tipo");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_preguntaejecutivo");
        }
	},	
};