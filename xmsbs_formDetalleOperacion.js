if (typeof(DetalleOperacion) == "undefined") {
    DetalleOperacion= {
        __namespace: true
    };    
}

DetalleOperacion = {
    Form: { 
        tipoFormulario:null
    },

    onLoad_Formulario: function (executionContext) {
        var formContext = executionContext.getFormContext();
        DetalleOperacion.Form.tipoFormulario = formContext.ui.getFormType();

        debugger;
        DetalleOperacion.visibilidad_section_NotificacionCierre(executionContext);
        DetalleOperacion.visibilidad_section_CierreAutomatico(executionContext);

        if (DetalleOperacion.Form.tipoFormulario == JumpStartLibXRM.FormState.CREATE || DetalleOperacion.Form.tipoFormulario == JumpStartLibXRM.FormState.UPDATE){
            
            JumpStartLibXRM.Fx.addOnChange(executionContext, "xmsbs_tipooperacion", "DetalleOperacion.visibilidad_section_NotificacionCierre");
            JumpStartLibXRM.Fx.addOnChange(executionContext, "xmsbs_tipooperacion", "DetalleOperacion.visibilidad_section_CierreAutomatico");

            JumpStartLibXRM.Fx.addOnChange(executionContext, "xmsbs_habilitamensajeria", "DetalleOperacion.visibilidad_section_NotificacionCierre");
            JumpStartLibXRM.Fx.addOnChange(executionContext, "xmsbs_habilitacierre", "DetalleOperacion.visibilidad_section_CierreAutomatico");
        }
    },

    onChange_ToolTips: function (executionContext) {
        //debugger;
        var toolTips = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tooltips", null);
        
        if(toolTips){        
            toolTips = toolTips.replace(/(\r\n|\n|\r)/gm, " ");
            toolTips = toolTips.trim();
            let _largoTxtTooltips = toolTips.length;
            
            if(_largoTxtTooltips > 0)
            {                
                JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tooltips", toolTips);
                //JumpStartLibXRM.Fx.formSave(executionContext);
            }
        }
    },

    visibilidad_section_NotificacionCierre: function(executionContext){
        // visibilidad de sección: Notificación Cierre = Debe ser en base a Tipo Requerimiento = RECLAMO + Habilita Mensajería = Sí

        debugger;
        if (DetalleOperacion.Form.tipoFormulario != JumpStartLibXRM.FormState.CREATE && DetalleOperacion.Form.tipoFormulario != JumpStartLibXRM.FormState.UPDATE)
            return;

        // por defecto está oculto y sin valores
        JumpStartLibXRM.Fx.hideShowSection(executionContext, "{5616f04d-c14a-4a51-86eb-1fd6081c6cbf}", "section_NotificacionCierre", false);

        var habilitamensajeria = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_habilitamensajeria", null);
        if (!habilitamensajeria){
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_naturalezarespuesta", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tiporespuesta", null);
            return;
        }

        var tipoOperacionId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tipooperacion");
        if (!tipoOperacionId){
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_naturalezarespuesta", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tiporespuesta", null);
            return;
        }

        var oTipoOperacion = DetalleOperacion.oDataTipoOperacion(executionContext, tipoOperacionId);
		if(!oTipoOperacion){
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_naturalezarespuesta", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tiporespuesta", null);
            return;
        }

        var tipoRequerimientoId = oTipoOperacion.value[0]._xmsbs_tiporequerimiento_value;
        if (tipoRequerimientoId == 'd6d57a1f-cc25-eb11-a813-000d3a59fabf') // RECLAMO
        {
            JumpStartLibXRM.Fx.hideShowSection(executionContext, "{5616f04d-c14a-4a51-86eb-1fd6081c6cbf}", "section_NotificacionCierre", true);
        }
        else{
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_naturalezarespuesta", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tiporespuesta", null);            
        }
    },

    visibilidad_section_CierreAutomatico: function(executionContext){
        // visibilidad de sección: Cierre Automático = Debe ser en base a Tipo Requerimiento = RECLAMO + Habilita Cierre Automático = Sí

        debugger;
        if (DetalleOperacion.Form.tipoFormulario != JumpStartLibXRM.FormState.CREATE && DetalleOperacion.Form.tipoFormulario != JumpStartLibXRM.FormState.UPDATE)
            return;

        // por defecto está oculto y sin valores
        JumpStartLibXRM.Fx.hideShowSection(executionContext, "{5616f04d-c14a-4a51-86eb-1fd6081c6cbf}", "section_CierreAutomatico", false);

        var habilitacierre = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_habilitacierre", null);
        if (!habilitacierre){
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_naturalezarespuestacabs", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tiporespuestacabs", null);
            return;
        }

        var tipoOperacionId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tipooperacion");
        if (!tipoOperacionId){
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_naturalezarespuestacabs", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tiporespuestacabs", null);
            return;
        }

        var oTipoOperacion = DetalleOperacion.oDataTipoOperacion(executionContext, tipoOperacionId);
		if(!oTipoOperacion){
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_naturalezarespuestacabs", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tiporespuestacabs", null);
            return;
        }
            
        var tipoRequerimientoId = oTipoOperacion.value[0]._xmsbs_tiporequerimiento_value;
        if (tipoRequerimientoId == 'd6d57a1f-cc25-eb11-a813-000d3a59fabf') // RECLAMO
        {
            JumpStartLibXRM.Fx.hideShowSection(executionContext, "{5616f04d-c14a-4a51-86eb-1fd6081c6cbf}", "section_CierreAutomatico", true);
        }
        else{
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_naturalezarespuestacabs", null);
            JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_tiporespuestacabs", null);            
        }
    },

//================
//FUNCIONES ODATA
//================

    // obtine tipo de requerimiento
    oDataTipoOperacion: function (executionContext, tipooperacionId){
        var entityType = "xmsbs_tipooperacion";
		var query = "?$select=_xmsbs_tiporequerimiento_value";
		query += "&$filter=(xmsbs_tipooperacionid eq " +  tipooperacionId.replace(/[{}]/g, "") + ")";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },        



};