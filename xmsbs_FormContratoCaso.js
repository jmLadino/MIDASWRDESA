if (typeof(ContratoCaso) == "undefined") {
    ContratoCaso = {
        __namespace: true
    };    
}

ContratoCaso = {
    Form: {        
        Context: null,
        executionContext: null
    },
	Formularios: {
		Principal: "Información"
	},

//================
//FUNCIONES RIBBON
//================

    enableNewRecord: function (executionContext){
        return false;
    },
    onClickCreateRecord: function (executionContext){
        //debugger;
        // nada
    },      
    enableEditRecord: function (executionContext){
        return false;
    },
    onClickEditRecord: function (executionContext){
        //debugger;
        // nada
    },	
    enableDeleteRecord: function (executionContext){
        return false;
    },
    onClickDeleteRecord: function (executionContext){
        //debugger;
    },      
    onClickSaveAndClose: function (executionContext){
        debugger;
    },     

//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
        debugger;
		
		var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
		
		// Por default siempre estará deshabilitado, a menos que se codifique lo contrario.
		
        if (tipoFormulario != JumpStartLibXRM.FormState.CREATE)
		{
			JumpStartLibXRM.Fx.formEnableDisableAllControls(executionContext, true);
		}
		else if (tipoFormulario != JumpStartLibXRM.FormState.UPDATE)
		{
			JumpStartLibXRM.Fx.formEnableDisableAllControls(executionContext, true);
		}
		else 
		{
			JumpStartLibXRM.Fx.formEnableDisableAllControls(executionContext, true);			
		}
    },
};	