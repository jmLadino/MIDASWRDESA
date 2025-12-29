if (typeof(PlantillaHTML) == "undefined") {
    Caso = {
        __namespace: true
    };    
}

PlantillaHTML = {
   
	GetRequestObject: function () {
		if (window.XMLHttpRequest) {
			return new window.XMLHttpRequest;
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
	
//================
//FUNCIONES ONLOAD
//================

	onLoad_Formulario: function (executionContext) {
		var formContext = executionContext.getFormContext();
        var tipoFormulario = formContext.ui.getFormType();		

		if (tipoFormulario == '2'){
			PlantillaHTML.setXrmFormContextWR(formContext);
        }
	},	
	
	setXrmFormContextWR: function(formContext){
        //debugger;
		var wr = formContext.getControl("WebResource_editorhtml");
        
		if (wr) 
        {
            wr.getContentWindow().then(
                function (contentWindow) 
                {
                    contentWindow.setClientApiContext(Xrm, formContext);
                }
            )
        }		
	},	
};