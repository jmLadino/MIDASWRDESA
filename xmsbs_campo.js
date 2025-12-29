//CAMPO
if (typeof (Campo) == "undefined")
{
	Campo = {
		__namespace: true
	};
}

Campo = {
	
	onLoad_Formulario: function (executionContext) {
		JumpStartLibXRM.Fx.addOnChange(executionContext, "xmsbs_fncjsonchange", "Campo.onChangeFncAlCambiar");
		JumpStartLibXRM.Fx.addOnChange(executionContext, "xmsbs_filtrovisibilidad", "Campo.onChange_filtrovisibilidad");
		
		// esta opción se quita (verificar si se puede eliminar)
		executionContext.getFormContext().getControl("xmsbs_fncjsonchange").removeOption(657130007);
		
		Campo.VisibilidadCamposFncAlCambiar(executionContext);
		Campo.VisibilidadCamposSecundarios(executionContext);
    },
	
	onChangeFncAlCambiar: function(executionContext) {
		Campo.VisibilidadCamposFncAlCambiar(executionContext);
	},
	
	VisibilidadCamposFncAlCambiar: function (executionContext) {
		// por default todos ocultos:
		JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_visibilidadpicklist2g");
		JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_mayoroigualque");
		JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_menoroigualque");
		
		//JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_camposecundario");
		//JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_condicion");
		//JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_visiblecamposec");
		//JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_requeridocamposec");
		
		var opcionSeleccionada = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_fncjsonchange", null);
		
		if (opcionSeleccionada == 657130005) { // Picklist, Según P1 muestra P2 (Requerido)
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_visibilidadpicklist2g");
		}
		else if (opcionSeleccionada == 657130006 || opcionSeleccionada == 657130008) {
			// 657130006 : Número Entero, Intervalo 
			// 657130008 : Texto, solo números (0-9) + Intervalo

			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_mayoroigualque");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_menoroigualque");		
		}
		else if (opcionSeleccionada == 657130007) { // Genérico, Campo Secundario
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_camposecundario");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_condicion");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_visiblecamposec");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_requeridocamposec");
		}
	},
	
	onChange_filtrovisibilidad: function (executionContext) {
		Campo.VisibilidadCamposSecundarios(executionContext);
	},
	
	VisibilidadCamposSecundarios(executionContext){
		var opcionSeleccionada = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_filtrovisibilidad", null);
		
		// por defecto todos están ocultos y no requeridos
		JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_condicion");
		JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_camposecundario");
		JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_visiblecamposec");
		JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_requeridocamposec");
		
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_condicion", "none");
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_camposecundario", "none");

		if (opcionSeleccionada){
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_camposecundario");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_visiblecamposec");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_requeridocamposec");
			
			JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_camposecundario", "required");
			
			if (opcionSeleccionada == 657130000 || opcionSeleccionada == 657130001) {
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_condicion");
				JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_condicion", "required");
			}			
		}
		else{
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_condicion", "");
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_camposecundario", "");
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_visiblecamposec", null);
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_requeridocamposec", null);
		}
	}
	
};