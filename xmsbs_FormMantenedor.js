if (typeof (mantenedor) == "undefined")
{
	mantenedor = {
		__namespace: true
	};
}

mantenedor = {   
	
    onLoad_Formulario: function (executionContext) {
		debugger;
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        
   		if (tipoFormulario == '2' || tipoFormulario == '3')
        {     
        //muestro campos segun corresponde
		mantenedor.onchange_campo(executionContext);
        
        //Se deshabilita el nombre que es usado como codigo
        JumpStartLibXRM.Fx.disableField(executionContext, "xmsbs_name");
        }   
				
	},
	
    onchange_campo: function (executionContext) {
        var nombre = JumpStartLibXRM.Fx.getValueField(executionContext,"xmsbs_name", null);
        
        if(nombre){
            if(nombre == "CABS" || nombre == "Envío Respuesta"){
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_tiporespuesta");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_naturalezarespuesta");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_diasespera");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_montomaximo");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_producto");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_observacion");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_observacionejecucion");
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_detalleoperacionid");
            }
            else if(nombre == "Días de espera" || nombre == "Cierre por reparo"){
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tiporespuesta");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_naturalezarespuesta");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_diasespera");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_montomaximo");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_producto");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_observacion");
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_observacionejecucion");
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_detalleoperacionid");
            }
            else if(nombre == "Dias Fraude Cierre Espera Documentos"){
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tiporespuesta");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_naturalezarespuesta");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_diasespera");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_montomaximo");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_producto");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_observacion");
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_observacionejecucion");
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_detalleoperacionid");
            }
            else if(nombre == "AutQuebranto"){
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_tiporespuesta");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_naturalezarespuesta");
				JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_diasespera");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_montomaximo");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_producto");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_observacion");
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_observacionejecucion");
                JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_detalleoperacionid");
			}        
			else{
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_tiporespuesta");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_naturalezarespuesta");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_diasespera");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_montomaximo");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_producto");
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_observacion");
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_observacionejecucion");
                JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_detalleoperacionid");
			}
		}
    },

};