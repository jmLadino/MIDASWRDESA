if (typeof(exclusionesE04) == "undefined") {
    exclusionesE04 = {
        __namespace: true
    };    
}

exclusionesE04 = {
	   
	//================
	//FUNCIONES ONLOAD
	//================
	onLoad_Formulario: function (executionContext) {
         //debugger;
        exclusionesE04.formatearFormulario(executionContext);
    },		
	//==================
	//FUNCIONES ONSAVE
	//==================
		
		
	//==================
	//FUNCIONES ONCHANGE
	//==================	
    onChange_tipoProceso: function (executionContext) {
        //debugger;
        exclusionesE04.formatearFormulario(executionContext);
    },
		
	//==================
	//FUNCIONES BUSQUEDA
	//==================	

    //==================
	//Utils
	//==================
	formatearFormulario: function (executionContext) {
        debugger;

        var xmsbs_tipoexclusion = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tipoexclusion", null);
        console.log(xmsbs_tipoexclusion);
        
        switch(xmsbs_tipoexclusion){
                //Rut cliente/Ficticio
                case 657130000:
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_detalleoperacionid");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_detalleoperacionid", null);
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_puntodecontactoid");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_puntodecontactoid", null);
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_estadoderequerimiento");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_estadoderequerimiento", null);

                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_rut");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_rut", "required");
                    break;
                //Tipificación
                case 657130001:
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_rut");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rut", null);
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_puntodecontactoid");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_puntodecontactoid", null);
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_estadoderequerimiento");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_estadoderequerimiento", null);
                    
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_detalleoperacionid");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_detalleoperacionid", "required");
                    break;
                //Punto de contacto
                case 657130002:
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_detalleoperacionid");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_detalleoperacionid", null);
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_rut");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rut", null);
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_estadoderequerimiento");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_estadoderequerimiento", null);
                    
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_puntodecontactoid");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_puntodecontactoid", "required");
                    break;
                //Estado de requerimiento
                case 657130003:
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_detalleoperacionid");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_detalleoperacionid", null);
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_puntodecontactoid");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_puntodecontactoid", null);
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_rut");
                        JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rut", null);
                    
                    JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_estadoderequerimiento");
                    JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_estadoderequerimiento", "required");
                    break;
                default:
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_detalleoperacionid");
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_puntodecontactoid");
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_rut");
                    JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_estadoderequerimiento");
                    break;
        }
    },	
};	