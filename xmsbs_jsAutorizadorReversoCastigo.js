if (typeof (AutorizadorQuebranto) == "undefined")
{
	AutorizadorQuebranto = {
		__namespace: true
	};
}
AutorizadorQuebranto = {
	
	onLoad_Formulario: function (executionContext) {
        //Analista gestor de Reversos y Castigos
        var nombreRegistro = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_name", null);
        if(nombreRegistro == "Analista gestor de Reversos y Castigos"){
            //El dato que estamos viendo es el registro del analista. Dejamos todo opcional
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_atribucioncastigodesde", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_atribucioncastigohasta", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_atribucionreversodesde", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_atribucionreversohasta", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_reversocastigodesde", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_reversocastigohasta", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_tipodequebranto", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_tipodereclamo", "none");
            JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_backup", "none");
            
            //Se ocultan
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_atribucioncastigodesde", "none");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_atribucioncastigohasta", "none");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_atribucionreversodesde", "none");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_atribucionreversohasta", "none");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_reversocastigodesde", "none");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_reversocastigohasta", "none");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tipodequebranto", "none");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tipodereclamo", "none");
            JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_backup", "none");
        }
	},
    
};