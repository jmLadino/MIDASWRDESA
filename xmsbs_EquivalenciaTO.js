if (typeof(EquivalenciaTO) == "undefined") {
    EquivalenciaTO = {
        __namespace: true
    };    
}

EquivalenciaTO = {
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
		if (tipoFormulario != '1'){
			//Bloqueo el DO y Origen de consulta, porque solo podria modificar la "Equivalencia"
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_tipooperacion");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_origenconsulta");
		}			
	},
	
//==================
//FUNCIONES ONCHANGE
//==================	

    ActualizaNombre: function (executionContext){
		debugger;
		var DOperacion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipooperacion", null);
		var OrigenConsulta = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_origenconsulta", null);
		if(DOperacion != null && OrigenConsulta != null){	
			var toID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tipooperacion");
			if (toID.indexOf("{") > -1){toID = toID.substring(1, 37);}
			var resultado = EquivalenciaTO.buscaTipoRequerimiento(executionContext, toID);
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

    buscaTipoRequerimiento: function (executionContext, toID){
		//Preparamos la consulta
		//var entityType = "xmsbs_tiporequerimientos";
		//var entityType = "xmsbs_productoservicio";
		var entityType = "xmsbs_tipooperacion";
		var entityId = toID;
		var query = "xmsbs_codigo";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
};