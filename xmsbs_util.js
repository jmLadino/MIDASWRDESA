if (typeof (Util) === "undefined") {
    Util = {
        __namespace: true
    };
}

Util = {

    GetRequestObject: function () {
		if (window.XMLHttpRequest) {
			return new window.XMLHttpRequest();
		}
		else {
			try {
				return new ActiveXObject("MSXML2.XMLHTTP.3.0");
			}
			catch (ex) {
				return null;
			}
		}
	},

    buscarValorParametro: function (executionContext, parametro)
	{
        var valor = null;
        var entityType = "xmsbs_parametro";
		var query = "$select=xmsbs_parametroid,xmsbs_name,xmsbs_valor";
		query += "&$filter=xmsbs_name eq '" + parametro + "'";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function (){});
        
        if(resultado){
            if(resultado.value.length > 0){
                valor = resultado.value[0].xmsbs_valor;
            }
        }
        
		return valor;
    },
   
}