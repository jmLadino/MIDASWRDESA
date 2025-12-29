if (typeof(bloqueo) == "undefined") {
    bloqueo = {
        __namespace: true
    };    
}

bloqueo = {
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
		if (tipoFormulario != '1'){
			//Bloqueo para que si no se necesita, se deba desactivar
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_tipificacion");
			JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_canal");
		}			
	},
	
//==================
//FUNCIONES ONCHANGE
//==================	

    ActualizaNombre: function (executionContext){
		debugger;
		var Tipificacion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipificacion", null);
		var OrigenConsulta = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_canal", null);
		if(Tipificacion != null && OrigenConsulta != null){		
			var idTipoYDetalle = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tipificacion");
			if (idTipoYDetalle.indexOf("{") > -1){idTipoYDetalle = idTipoYDetalle.substring(1, 37);}
			var resultado = bloqueo.buscarTipoYDetalleOperacion(executionContext, idTipoYDetalle);
			if(resultado){
				var codigo = resultado.xmsbs_codigo;
				var OrigenName = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_canal");
				var NewName = OrigenName + " - " + codigo; 				
				JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_name", NewName);
			}
		}
	},    
	
//==================
//FUNCIONES BUSQUEDA
//==================	
	
    buscarTipoYDetalleOperacion: function (executionContext, idTipoYDetalle){
		//Preparamos la consulta
		var entityType = "xmsbs_tipoydetalledeoperacion";
		var entityId = idTipoYDetalle;
		var query = "xmsbs_codigo";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},	
};	