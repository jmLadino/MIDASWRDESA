if (typeof(InteresadoCaso) == "undefined") {
    InteresadoCaso = {
        __namespace: true
    };    
}

InteresadoCaso = {
    Form: {        
        Context: null,
        executionContext: null
    },
	Formularios: {
		Principal: "Información"
	},
    VisibilidadBotonCrearInteresadoCaso: {
        ValorVisibilidad: false
    },  

//================
//FUNCIONES RIBBON
//================

    enableNewRecord: function (executionContext){
		return false;
    },
    onClickCreateRecord: function (executionContext){

    },      
    enableEditRecord: function (executionContext){

        return false;
    },
    onClickEditRecord: function (executionContext){
        // nada
    },      	
    enableDeleteRecord: function (executionContext){

    },
    onClickDeleteRecord: function (executionContext){

    },      
    onClickSaveAndClose: function (executionContext){

    },     
	
//================
//FUNCIONES ONLOAD
//================
	onLoad_Formulario: function (executionContext) {
		// siempre bloquea los campos del formulario.
		JumpStartLibXRM.Fx.formEnableDisableAllControls(executionContext, true);
    },
};	