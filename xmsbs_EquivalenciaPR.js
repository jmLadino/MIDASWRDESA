if (typeof(EquivalenciaPR) == "undefined") {
    EquivalenciaPR = {
        __namespace: true
    };    
}

EquivalenciaPR = {
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
		if (tipoFormulario != '1'){
			//Bloqueo el DO y Origen de consulta, porque solo podria modificar la "Equivalencia"
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_producto");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_origenconsulta");
		}			
	},
	
//==================
//FUNCIONES ONCHANGE
//==================	

    ActualizaNombre: function (executionContext){
		debugger;
		var DOperacion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_producto", null);
		var OrigenConsulta = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_origenconsulta", null);
		if(DOperacion != null && OrigenConsulta != null){	
			var prID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto");
			if (prID.indexOf("{") > -1){prID = prID.substring(1, 37);}
			var resultado = EquivalenciaPR.buscaTipoRequerimiento(executionContext, prID);
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

    buscaTipoRequerimiento: function (executionContext, prID){
		//Preparamos la consulta
		//var entityType = "xmsbs_tiporequerimientos";
		var entityType = "xmsbs_productoservicio";
		//var entityType = "xmsbs_tipooperacion";
		var entityId = prID;
		var query = "xmsbs_codigo";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
};