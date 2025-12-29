if (typeof(EquivalenciaTR) == "undefined") {
    EquivalenciaTR = {
        __namespace: true
    };    
}

EquivalenciaTR = {
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
		if (tipoFormulario != '1'){
			//Bloqueo el DO y Origen de consulta, porque solo podria modificar la "Equivalencia"
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_tiporequerimiento");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_origenconsulta");
		}			
	},
	
//==================
//FUNCIONES ONCHANGE
//==================	

    ActualizaNombre: function (executionContext){
		debugger;
		var DOperacion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tiporequerimiento", null);
		var OrigenConsulta = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_origenconsulta", null);
		if(DOperacion != null && OrigenConsulta != null){	
			var trID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tiporequerimiento");
			if (trID.indexOf("{") > -1){trID = trID.substring(1, 37);}
			var resultado = EquivalenciaTR.buscaTipoRequerimiento(executionContext, trID);
			if(resultado){
				var codigo = resultado.xmsbs_codigo;
				var OrigenName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_origenconsulta");
				var NewName = OrigenName + " - " + codigo; 				
				JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_name", NewName);
			}
		}
	},    
	
//==================
//FUNCIONES BUSQUEDA
//==================	

    buscaTipoRequerimiento: function (executionContext, trID){
		//Preparamos la consulta
		var entityType = "xmsbs_tiporequerimientos";
		var entityId = trID;
		var query = "xmsbs_codigo";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
};