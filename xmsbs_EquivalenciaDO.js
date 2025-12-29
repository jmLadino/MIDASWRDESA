if (typeof(EquivalenciaDO) == "undefined") {
    EquivalenciaDO = {
        __namespace: true
    };    
}

EquivalenciaDO = {
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
		if (tipoFormulario != '1'){
			//Bloqueo el DO y Origen de consulta, porque solo podria modificar la "Equivalencia"
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_detalleoperacion");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_origenconsulta");
		}			
	},
	
//==================
//FUNCIONES ONCHANGE
//==================	

    ActualizaNombre: function (executionContext){
		debugger;
		var DOperacion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_detalleoperacion", null);
		var OrigenConsulta = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_origenconsulta", null);
		if(DOperacion != null && OrigenConsulta != null){		
			var detalleID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_detalleoperacion");
			if (detalleID.indexOf("{") > -1){detalleID = detalleID.substring(1, 37);}
			var resultado = EquivalenciaDO.buscaDetalleOperacion(executionContext, detalleID);
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

    buscaDetalleOperacion: function (executionContext, DetalleID){
		//Preparamos la consulta
		var entityType = "xmsbs_detalleoperacions";
		var entityId = DetalleID;
		var query = "xmsbs_codigo";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
};