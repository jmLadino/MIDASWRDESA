if (typeof(MovimientoCaso) == "undefined") {
    MovimientoCaso = {
        __namespace: true
    };    
}

MovimientoCaso = {
    Form: {        
        Context: null,
        executionContext: null
    },
	Formularios: {
		Principal: "Información",
		MovimientosManualesCaso: "Ingreso Movimiento Manual"
	},
    VisibilidadBotonCrearMovimientoCaso: {
        ValorVisibilidad: false
    },  

//================
//FUNCIONES RIBBON
//================

    enableNewRecord: function (executionContext){
        // debugger;
        //var idUsuario = JumpStartLibXRM.Fx.getUserId();
        MovimientoCaso.VisibilidadBotonCrearMovimientoCaso.ValorVisibilidad = false;
		
        var Borrador = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_borrador", null);
        if (Borrador)
            MovimientoCaso.VisibilidadBotonCrearMovimientoCaso.ValorVisibilidad = true;
		
        return MovimientoCaso.VisibilidadBotonCrearMovimientoCaso.ValorVisibilidad;
    },
    onClickCreateRecord: function (executionContext){
        //debugger;
    },      
    enableEditRecord: function (executionContext){
        //debugger;
        return false;
    },
    onClickEditRecord: function (executionContext){
        //debugger;
        // nada
    },      	
    enableDeleteRecord: function (executionContext){
        //debugger;
        //var idUsuario = JumpStartLibXRM.Fx.getUserId();
		
        var Borrador = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_borrador", null);
        if (Borrador)
            return true;
		
        return false;
    },
    onClickDeleteRecord: function (executionContext){
		/*
		// si el registro principal queda sin registros hijos, entonces setea el campo: xmsbs_monedadelmovimiento = "" (en el registro padre)
		var MovimientoPrincipal = JumpStartLibXRM.Fx.getEntityId(executionContext);
		var resultado = MovimientoCaso.oData_BuscarMovimientosManualesCaso(executionContext, MovimientoPrincipal.replace(/[{}]/g, ""));
		if (resultado && resultado.value.length == 0)
		{
			debugger;
			// guarda en el registro padre.
			var objeto = {};
			objeto["xmsbs_monedadelmovimiento"] = "";
			var resultado = SDK.WEBAPI.updateRecord(executionContext, MovimientoPrincipal, objeto, "xmsbs_movimiento", null, null);			
		}
		*/
    },      
    onClickSaveAndClose: function (executionContext){
		
		// puede estar guardando un "Movimiento Principal" (Contenedor) o Editando un movimiento manual (borrador)
		
		var MovPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_movimientoprincipal", null);
		if (MovPrincipal == null)
		{
			// container
			// Itera sobre los registros del listado y le cambia el campo: borrador de SI a NO.
			var MovimientoPrincipalID = JumpStartLibXRM.Fx.getEntityId(executionContext);
			if (MovimientoPrincipalID.indexOf("{") > -1)
				MovimientoPrincipalID = MovimientoPrincipalID.substring(1, 37);
		   
			var resultado = MovimientoCaso.oData_BuscarMovimientosManualesCaso(executionContext, MovimientoPrincipalID);
			
			resultado.value.forEach((value, i) => {
				var objeto = {};
				objeto["xmsbs_borrador"] = false;
				var resultado = SDK.WEBAPI.updateRecord(executionContext, value.xmsbs_movimientoid, objeto, "xmsbs_movimiento", null, null);
			});
			
			var eMovPrincipal = {};
			eMovPrincipal["statecode"] = 1;
			eMovPrincipal["statuscode"] = 2;
			var resultado = SDK.WEBAPI.updateRecord(executionContext, MovimientoPrincipalID, eMovPrincipal, "xmsbs_movimiento", null, null);
		}
		else
		{
			// record details
			// solo guarda, sin acciones secundarias.
		}
    },     

    oData_BuscarMovimientoManualCaso(executionContext, MovID){
        var entityType = "xmsbs_movimientos";
        var query = "$select=xmsbs_movimientoid,_xmsbs_movimientoprincipal_value,_xmsbs_caso_value,xmsbs_borrador";
        query += "&$filter=(statecode eq 0 and xmsbs_borrador eq true and _xmsbs_movimientoprincipal_value ne null and xmsbs_movimientoid eq " + MovID + ")";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },    

    oData_BuscarMovimientosManualesCaso(executionContext, MovContenedorID){
        var entityType = "xmsbs_movimientos";
        var query = "$select=_xmsbs_caso_value,_xmsbs_movimientoprincipal_value,xmsbs_borrador";
        query += "&$filter=(_xmsbs_movimientoprincipal_value eq '" + MovContenedorID + "')";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },    
	
//================
//FUNCIONES ONLOAD
//================
    onLoad_QuickCreate: function (executionContext) {
        // aplica Requerido a los campos
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_fechamovimiento", "required");
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_importecompratotal", "required");
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_descripciontipofactura", "required");

		debugger;
		// si el registro principal queda sin registros hijos, entonces setea el campo: xmsbs_monedadelmovimiento = "" (en el registro padre)
		var MovimientoPrincipal = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_movimientoprincipal");
		var resultado = MovimientoCaso.oData_BuscarMovimientosManualesCaso(executionContext, MovimientoPrincipal.replace(/[{}]/g, ""));
		if (resultado && resultado.value.length == 0)
		{
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_moneda");
			JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_moneda", "required");
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_monedadelmovimiento", "");
		}
		else
		{
			// si el campo: xmsbs_monedadelmovimiento está vacio, entonces muestra el campo: "xmsbs_moneda". (ambos campos están ocultos por default)
			var MonedaTexto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_monedadelmovimiento", null);
			if (!MonedaTexto || MonedaTexto == "")
			{
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_moneda");
				JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_moneda", "required");
			}
			else
			{
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_monedadelmovimiento");
			}
		}
    },

	onLoad_Formulario: function (executionContext) {
        var borrador = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_borrador", null);
        if (borrador)
        {
            // se debe cambiar hacia el formulario de ingreso de movimientos manuales.
            if (!MovimientoCaso.CambiaFormulario(executionContext, MovimientoCaso.Formularios.MovimientosManualesCaso))
			{
				// Si se mentiene en el formulario puede ser porque es Mov Principal (Contenedor), o Movimiento Manual en Borrador.
				var MovPrincipal = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_movimientoprincipal", null);
				var formContext = executionContext.getFormContext();
				if (MovPrincipal == null)
				{
					if (formContext.ui.tabs.get("tab_general") && formContext.ui.tabs.get("tab_general").sections.get("section_movmanuales"))
						formContext.ui.tabs.get("tab_general").sections.get("section_movmanuales").setVisible(true);
					
					var IncidentId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_caso", null);
					if (IncidentId && IncidentId.indexOf("{") > -1)
						IncidentId = IncidentId.substring(1, 37);
		
					// elimina los movimientos pre-existentes (los movimientos confirmados que se visualizan en el caso) 
					MovimientoCaso.EliminarMovimientos(executionContext, IncidentId);
				}
				else
				{
					if(formContext.ui.tabs.get("tab_general") && formContext.ui.tabs.get("tab_general").sections.get("seccion_movimientoseditar"))
                    {
						formContext.ui.tabs.get("tab_general").sections.get("seccion_movimientoseditar").setVisible(true);

                        // aplica Requerido a los campos
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_fechamovimiento", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_importecompratotal", "required");
                        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_descripciontipofactura", "required");                    
                    }
				}
			}
        }
        else
        {
            // se debe cambiar hacia el formulario principal
            if (!MovimientoCaso.CambiaFormulario(executionContext, MovimientoCaso.Formularios.Principal))
			{
				// si permanece en el formulario, entonces bloquea todos los campos.
				JumpStartLibXRM.Fx.formEnableDisableAllControls(executionContext, true);
			}
        }
    },
	
    EliminarMovimientos: function(executionContext, IncidentId)
	{            
            var respuesta = MovimientoCaso.BuscarMovimientosCaso(executionContext, IncidentId);
            
            if(respuesta != null && respuesta.value.length > 0)
            {
                var entity = "xmsbs_movimiento";
                for (var i = 0; i < respuesta.value.length; i++) {                    
                    //SDK.WEBAPI.deleteRecordImpersonate(window._executionContext, respuesta.value[i].xmsbs_movimientoid, entity, UsuarioAdminID, null, null);
					SDK.WEBAPI.deleteRecord(executionContext, respuesta.value[i].xmsbs_movimientoid, entity, null, null);
                }
            }
    },
	BuscarMovimientosCaso : function (executionContext, IncidentId){
		var entityType = "xmsbs_movimiento";
		var query = "$select=xmsbs_fechamovimiento,xmsbs_montocompra,_xmsbs_contratorelacionado_value,_xmsbs_caso_value";
		query += "&$filter=(xmsbs_borrador ne true) and (_xmsbs_caso_value eq '" + IncidentId + "')";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
		
    CambiaFormulario: function(executionContext, FormDestino)
    {
        var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();
        var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
        
        
        var formulario = JumpStartLibXRM.Fx.getFormName(executionContext);
        
		var Information;
		var forms = executionContext.getFormContext().ui.formSelector.items.get();
		var formActual = executionContext.getFormContext().ui.formSelector.getCurrentItem().getLabel().toLowerCase();
		if (formActual != FormDestino.toLowerCase())
        {
				for (var i = 0; i < forms.length; i++)
				{
					if (forms[i].getLabel().toLowerCase() == FormDestino.toLowerCase())
					{
						Information = forms[i];
						//executionContext.getFormContext().data.setFormDirty;
						//if (estado != "4")
						//{
							//JumpStartLibXRM.Fx.formSave(executionContext);
						//}
						Information.navigate();
						return true;
					}
				}        
        }
		return false;
    },
	onChange_Fecha: function (executionContext) {
        //debugger;
        var myControl = executionContext.getEventSource().getName();

        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fecha = JumpStartLibXRM.Fx.getValueField(executionContext, myControl, null);
        if(fecha){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fecha.setDate(fecha.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha no puede ser mayor al día de hoy", title: "Fecha incorrecta" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext, myControl, null);
                        JumpStartLibXRM.Fx.setFocus(executionContext, myControl);
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },	
	
	onSave_Movimiento: function (executionContext) {
	
        // Se lleva a nivel de WKF, ya que requiero una respuesta síncrona
        /*
		var estado = JumpStartLibXRM.Fx.getFormType(executionContext);
		if (estado == JumpStartLibXRM.FormState.CREATE || 
			estado == JumpStartLibXRM.FormState.QUICK_CREATE)
			{
				// si el campo: xmsbs_monedadelmovimiento no tiene contenido, entonces guarda el contenido de: xmsbs_moneda en xmsbs_monedadelmovimiento, y actualiza el registro padre con el valor de la moneda de xmsbs_monedadelmovimiento.
				var MonedaTexto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_monedadelmovimiento", null);
				var MonedaSel = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_moneda", null);
				var Moneda = "";
				if (!MonedaTexto || MonedaTexto == "")
				{
					if (MonedaSel == 657130000) {
						Moneda = "CLP";
					}
					else if (MonedaSel == 657130001) {
						Moneda = "USD";
					}
					
					JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_monedadelmovimiento", Moneda);
				
					var MovimientoPrincipal = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_movimientoprincipal");
					if (MovimientoPrincipal.indexOf("{") > -1){MovimientoPrincipal = MovimientoPrincipal.substring(1, 37);}
					
					// guarda en el registro padre.
                    var objeto = {};
                    objeto["xmsbs_monedadelmovimiento"] = Moneda;
                    var resultado = SDK.WEBAPI.updateRecord(executionContext, MovimientoPrincipal, objeto, "xmsbs_movimiento", null, null);
				}
			}
        */
	},
};	