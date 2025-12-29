if (typeof(PolizaCaso) == "undefined") {
    PolizaCaso = {
        __namespace: true
    };    
}

PolizaCaso = {
    Form: {        
        Context: null,
        executionContext: null
    },
	Formularios: {
		Principal: "Información",
		IngresoManualCaso: "Ingreso Manual Pólizas"
	},
    VisibilidadBotonCrearPolizaCaso: {
        ValorVisibilidad: false
    },  

//================
//FUNCIONES RIBBON
//================

    enableNewRecord: function (executionContext){
        //var idUsuario = JumpStartLibXRM.Fx.getUserId();
        PolizaCaso.VisibilidadBotonCrearPolizaCaso.ValorVisibilidad = false;
		
        var Borrador = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_borrador", null);
        if (Borrador)
            PolizaCaso.VisibilidadBotonCrearPolizaCaso.ValorVisibilidad = true;
		
        return PolizaCaso.VisibilidadBotonCrearPolizaCaso.ValorVisibilidad;
    },
    onClickCreateRecord: function (executionContext){

    },      
    enableEditRecord: function (executionContext){
        return false;
    },
    onClickEditRecord: function (executionContext){
        // nada
    },      	
    enableDeleteRecord: function (executionContext){
        //var idUsuario = JumpStartLibXRM.Fx.getUserId();
		
        var Borrador = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_borrador", null);
        if (Borrador)
            return true;
		
        return false;
    },
    onClickDeleteRecord: function (executionContext){
		// código para delete
    },      
    onClickSaveAndClose: function (executionContext){
		debugger;
		// puede estar guardando un Registro Contenedor o Editando una Póliza Manual (borrador)
		
		var RegistroContenedor = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contenedor", null);
		if (RegistroContenedor == null)
		{
			// container
			// Itera sobre los registros del listado y le cambia el campo: borrador de SI a NO.
			var ContenedorID = JumpStartLibXRM.Fx.getEntityId(executionContext);
			var resultado = PolizaCaso.oData_BuscarPolizasManualesCaso(executionContext, ContenedorID);
			
			resultado.value.forEach((value, i) => {
				var objeto = {};
				objeto["xmsbs_borrador"] = false;
				var resultado = SDK.WEBAPI.updateRecord(executionContext, value.xmsbs_polizaid, objeto, "xmsbs_poliza", null, null);
			});
			
			//var eContenedor = {};
			//eContenedor["statecode"] = 1;
			//eContenedor["statuscode"] = 2;
			//var resultado = SDK.WEBAPI.updateRecord(executionContext, ContenedorID, eContenedor, "xmsbs_poliza", null, null);
		}
		else
		{
			// record details
			// solo guarda, sin acciones secundarias.
		}
    },     

    oData_BuscarPolizaManualCaso(executionContext, PolizaID){
        var entityType = "xmsbs_polizas";
        var query = "$select=xmsbs_polizaid,_xmsbs_contenedor_value,_xmsbs_caso_value,xmsbs_borrador";
        query += "&$filter=(statecode eq 0 and xmsbs_borrador eq true and _xmsbs_contenedor_value ne null and xmsbs_polizaid eq " + PolizaID.replace(/[{}]/g, "") + ")";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },    

    oData_BuscarPolizasManualesCaso(executionContext, ContenedorID){
        var entityType = "xmsbs_polizas";
        var query = "$select=_xmsbs_caso_value,_xmsbs_contenedor_value,xmsbs_borrador";
        query += "&$filter=(_xmsbs_contenedor_value eq '" + ContenedorID.replace(/[{}]/g, "") + "')";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },    
	
//================
//FUNCIONES ONLOAD
//================
    onLoad_QuickCreate: function (executionContext) {
        debugger;
        var IncidentId = "";
        var ContenedorID = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_contenedor", null);
        var resultado = PolizaCaso.BuscarCasoDeContenedor(executionContext, ContenedorID);
        if(resultado != null)
        {
            IncidentId = resultado._xmsbs_caso_value;
        }
        
        //Primero validamos que estemos con la tipología que solo admite 1 poliza
        var resultado = PolizaCaso.BuscarCodDetalleOpCaso(executionContext, IncidentId);
        if(resultado != null && resultado.value.length > 0)
        {
            var codDetalleOp = resultado.value[0].xmsbs_detalledeoperacion.xmsbs_codigo;
            if(codDetalleOp == "DO-1360")
            {
                //Es la tipología que solo admite 1 poliza
                var respuesta = PolizaCaso.BuscarPolizasCasoBorrador(executionContext, IncidentId);            
                if(respuesta != null && respuesta.value.length > 0)
                {
                    //Ya existen registros. Dado que ya existen, no debe permitir ingresar mas.                    
                    var alertStrings = { confirmButtonLabel: "Aceptar", title: "Tipología admite sólo 1 poliza", text: "Esta tipología admite sólo 1 poliza. No puede ingresar mas pólizas"};
                    var alertOptions = { height: 120, width: 260 };
                    Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                        function (success) {
                            //console.log("Alert dialog closed");
                            //JumpStartLibXRM.Fx.formClose(executionContext);
                            var formContext = executionContext.getFormContext();
                            formContext.ui.close();
                        },
                        function (error) {
                            //console.log(error.message);
                        }
                    );
                }
            }
        }
    
        // aplica Requerido a los campos
        JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ndepoliza", "required");
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_entidadaseguradora", "required");
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ndeoperacion", "required");
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_lineadeproducto", "required");
		JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_productodelcliente", "required");
    },

	onLoad_Formulario: function (executionContext) {
		debugger;
        var borrador = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_borrador", null);
        if (borrador)
        {
            // se debe cambiar hacia el formulario de ingreso manual de Polizas.
            if (!PolizaCaso.CambiaFormulario(executionContext, PolizaCaso.Formularios.IngresoManualCaso))
			{
				// Si se mentiene en el formulario puede ser porque es Póliza Principal (Contenedor), o Póliza Manual en Borrador.
				var ContenedorID = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_contenedor", null);
				var formContext = executionContext.getFormContext();
				if (ContenedorID == null)
				{
					if (formContext.ui.tabs.get("tab_general") && formContext.ui.tabs.get("tab_general").sections.get("section_ingresomanualpolizas"))
						formContext.ui.tabs.get("tab_general").sections.get("section_ingresomanualpolizas").setVisible(true);
					
					var IncidentId = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_caso", null);
					// elimina las Polizas pre-existentes (las Pólizas confirmadas que se visualizan en el caso) 
					PolizaCaso.EliminarPolizas(executionContext, IncidentId);
				}
				else
				{
					if(formContext.ui.tabs.get("tab_general") && formContext.ui.tabs.get("tab_general").sections.get("seccion_editarpolizas"))
                    {
						formContext.ui.tabs.get("tab_general").sections.get("seccion_editarpolizas").setVisible(true);

                        // aplica Requerido a los campos
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ndepoliza", "required");
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_entidadaseguradora", "required");
						//JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_ndeoperacion", "required");
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_lineadeproducto", "required");
						JumpStartLibXRM.Fx.updateRequirementLevel(executionContext, "xmsbs_productodelcliente", "required");
                    }
				}
			}
        }
        else
        {
            // se debe cambiar hacia el formulario principal
            if (!PolizaCaso.CambiaFormulario(executionContext, PolizaCaso.Formularios.Principal))
			{
				// si permanece en el formulario, entonces bloquea todos los campos.
				JumpStartLibXRM.Fx.formEnableDisableAllControls(executionContext, true);
			}
        }
    },
	
	onChangeSoloNumeros: function(executionContext) {      
        var myControl = executionContext.getEventSource().getName();
        var campo = Xrm.Page.getControl(myControl).getValue();
		if (campo)
		{
			campo = campo.replace(/\D/g, '');
			Xrm.Page.getAttribute(myControl).setValue(campo);
		}
	},	
	
    EliminarPolizas: function(executionContext, IncidentId)
	{            
            var respuesta = PolizaCaso.BuscarPolizasCaso(executionContext, IncidentId);
            
            if(respuesta != null && respuesta.value.length > 0)
            {
                var entity = "xmsbs_poliza";
                for (var i = 0; i < respuesta.value.length; i++) {                    
                    //SDK.WEBAPI.deleteRecordImpersonate(window._executionContext, respuesta.value[i].xmsbs_polizaid, entity, UsuarioAdminID, null, null);
					SDK.WEBAPI.deleteRecord(executionContext, respuesta.value[i].xmsbs_polizaid, entity, null, null);
                }
            }
    },
	BuscarPolizasCaso : function (executionContext, IncidentId){
		var entityType = "xmsbs_poliza";
		var query = "$select=_xmsbs_caso_value";
		query += "&$filter=(xmsbs_borrador ne true) and (_xmsbs_caso_value eq '" + IncidentId.replace(/[{}]/g, "") + "')";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
    BuscarPolizasCasoBorrador : function (executionContext, IncidentId){
		var entityType = "xmsbs_poliza";
		var query = "$select=_xmsbs_caso_value";
		query += "&$filter=(xmsbs_borrador eq true and _xmsbs_contenedor_value ne null) and (_xmsbs_caso_value eq '" + IncidentId.replace(/[{}]/g, "") + "')";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
	},
    
    BuscarCodDetalleOpCaso : function (executionContext, IncidentId){
        var entityType = "incidents";
        var query = "$select=xmsbs_numerocorrelativo,incidentid";
        query += "&$expand=xmsbs_detalledeoperacion($select=xmsbs_codigo)&$filter=(incidentid eq "+ IncidentId.replace(/[{}]/g, "") +")&$orderby=xmsbs_numerocorrelativo asc";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
        {});
        return resultado;
    },
    
    BuscarCasoDeContenedor : function (executionContext, ContenedorID){
		//Preparamos la consulta
		var entityType = "xmsbs_poliza";
		var entityId = ContenedorID.replace(/[{}]/g, "");
		var query = "_xmsbs_caso_value";
        var expand = "";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
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
	
	onChange_LineaProducto: function (executionContext) {
		// limpia datos de Producto del Cliente
		var LineaProd = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_lineadeproducto", null);
		if (LineaProd == null)
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_productodelcliente", null);
	},
	
	onSave_Poliza: function (executionContext) {
		// se deben setear los campos de texto correspondiente a cada LookUp
		
		var EntAseguradora = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_entidadaseguradora", null);
		//xmsbs_codentidadaseguradora N/A
		if (EntAseguradora != null)
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombreentidadaseguradora", EntAseguradora[0].name);
		else
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombreentidadaseguradora", "");
		
		var LineaProd = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_lineadeproducto", null);
		// xmsbs_codigolineadeproducto N/A
		if (LineaProd != null)
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrelineadeproducto", LineaProd[0].name);
		else
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombrelineadeproducto", "");

		var ProdCliente = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_productodelcliente", null);
		// xmsbs_codigoproductodelcliente N/A
		if (ProdCliente != null)
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombreproductodelcliente", ProdCliente[0].name);
		else
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_nombreproductodelcliente", "");
		
	},
};	