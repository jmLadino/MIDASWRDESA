if (typeof (PopUp) == "undefined")
{
	PopUp = {
		__namespace: true
	}
}
PopUp = {
	Context: {
		ExecutionContext: null,
		FormContext: null
	},

	URL: {
		Azure: "",
		Name: "AzureURL"
	},

	ApiKey: {
		Key: "",
		Name: "AuthApi"
	},
    
    Contenido: {
		Datos: null
	},

	buscarTipoDatoProducto: function (executionContext, idProducto){
		var entityType = "xmsbs_productoservicio";
		var entityId = idProducto;
		var query = "xmsbs_name,xmsbs_tipodedato";
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
		return resultado
	},

	openWRNumeroOperacion: function (executionContext, AzureURL, ApiKey){
        //debugger;
		PopUp.Context.ExecutionContext = executionContext;
        PopUp.Context.FormContext = executionContext.getFormContext();
		PopUp.URL.Azure = AzureURL;
		PopUp.ApiKey.Key = ApiKey;

		var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
		var idProducto = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_producto");
		if (rut && idProducto)
		{
			if (idProducto.indexOf("{") > -1)
			{
				idProducto = idProducto.substring(1, 37)
			}

			var resultado = PopUp.buscarTipoDatoProducto(executionContext, idProducto);
			if (resultado)
			{
				if (resultado.xmsbs_tipodedato == 1)
				{
					var pageInput = {
						pageType: "webresource",
						webresourceName: "xmsbs_numerooperacion"
					};
					var navigationOptions = {
						target: 2,
						width: 500,
						height: 400,
						position: 1
					};
					Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function success()
					{}, function error()
					{});
				}
			}
		}
	},

    openWRAsignarCaso: function (executionContext, AzureURL, ApiKey){
        debugger;
		PopUp.Context.ExecutionContext = executionContext;
		//PopUp.Context.FormContext = executionContext.getFormContext();
		PopUp.URL.Azure = AzureURL;
		PopUp.ApiKey.Key = ApiKey;
        
        var pageInput = {
            pageType: "webresource",
            webresourceName: "xmsbs_asignarCaso"
        };
        var navigationOptions = null;
		
		
		if ((typeof (CasoIngresoCRM) != "undefined") && CasoIngresoCRM.Form.DOSucursal == true)
		{
			navigationOptions = {target: 2, width: 800, height: 600, position: 1};
		}
		else
		{
			navigationOptions = {target: 2, width: 500, height: 400, position: 1};	
		}
		
        Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function success()
        {}, function error()
        {});
	},

    openWRResolverCaso: function (executionContext, AzureURL, ApiKey){
		//Popup se abre desde SUC0013 (JS xmsbs_repositorioSuceso)
	},

    openWRAsignarJefeIntegranteUR: function (executionContext, AzureURL, ApiKey){
        //debugger;
		PopUp.Context.ExecutionContext = executionContext;
		PopUp.URL.Azure = AzureURL;
		PopUp.ApiKey.Key = ApiKey;
        
        var pageInput = {
            pageType: "webresource",
            webresourceName: "xmsbs_asignarJefeIntegranteUR"
        };
        var navigationOptions = {
            target: 2,
            width: 500,
            height: 400,
            position: 1
        };
        Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function success()
        {}, function error()
        {});
	},

    openWRDesactivarJefeIntegranteUR: function (executionContext, AzureURL, ApiKey){
        //debugger;
		PopUp.Context.ExecutionContext = executionContext;
		PopUp.URL.Azure = AzureURL;
		PopUp.ApiKey.Key = ApiKey;
        
        var pageInput = {
            pageType: "webresource",
            webresourceName: "xmsbs_desactivarJefeIntegranteUr"
        };
        var navigationOptions = {
            target: 2,
            width: 600,
            height: 400,
            position: 1
        };
        Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function success()
        {}, function error()
        {});
	},
    
    openWRSubidaMultiple: function (executionContext, objeto){
        PopUp.Context.ExecutionContext = executionContext;
        PopUp.Context.FormContext = executionContext;
        PopUp.Contenido.Datos= objeto;
        
        var pageInput = {
            pageType: "webresource",
            webresourceName: "xmsbs_htmlSubidaMultipleDocs"
        };
        var navigationOptions = {
            target: 2,
            width: 1000,
            height: 500,
            position: 1
        };
        Xrm.Navigation.navigateTo(pageInput, navigationOptions).then(function success()
        {}, function error()
        {});
    },
};

parent.getContextPopUp = function (){
	return PopUp.Context.ExecutionContext;
};
parent.getContextPopUp_PopUp = function (){
	return PopUp.Context.ExecutionContext;
};
parent.getFormContextPopUp = function (){
	return PopUp.Context.FormContext;
};
parent.getAzureURLPopUp = function (){
	return PopUp.URL.Azure;
};
parent.getApiKeyPopUp = function (){
	return PopUp.ApiKey.Key;
};
parent.getObjetoDatos = function (){
	return PopUp.Contenido.Datos;
};