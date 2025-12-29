if (typeof(DeleteDocumentoCaso) == "undefined") {
    DeleteDocumentoCaso= {
        __namespace: true
    };    
}

DeleteDocumentoCaso = {
   
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
			DeleteDocumentoCaso.setXrmFormContextWR(formContext);
        }
	},
	
    setXrmFormContextWR: function(formContext){
        //debugger;
		var wr = formContext.getControl("WebResource_deletedocumentocaso");
        
		if (wr) 
        {
            wr.getContentWindow().then(
                function (contentWindow) 
                {
                    if (contentWindow != null && typeof(contentWindow.setClientApiContext) === 'function')
                    {
                        console.log("ejecuto correcto");
                        contentWindow.setClientApiContext(Xrm, formContext);
                    }
                    else
                    {
                        console.log("ejecuto reintento");
                        setTimeout(function(){ 
                            DeleteDocumentoCaso.setXrmFormContextWR(formContext);
                        }, 1000);  
                    }
                }
            )
        }		
	},
	
	//Función para desplegar iconos simulando un semaforo en un campo especifico de una vista no editable.
	displayIconTooltip: function (rowData, userLCID)
	{
        //debugger;
		var str = JSON.parse(rowData);
		var coldata = str.statuscode_Value; //cambiar por campo a referenciar.
		var imgName = "";
		var tooltip = "";
		switch (coldata)
		{
			case 657130000:
				imgName = "xmsbs_pendiente";
				tooltip = "Pendiente";
				break;
			case 657130001:
				imgName = "xmsbs_subido";
				tooltip = "Subido";
				break;				
			default:
				imgName = "";
				tooltip = "";
				break;
		}
		var resultarray = [imgName, tooltip];
		return resultarray;
	},	
	
//==================
//FUNCIONES ONCHANGE
//==================	

	onChange_tipoDocumento: function (executionContext)
	{
		//debugger;
		var tipoDocumento = JumpStartLibXRM.Fx.getLookupValueName(executionContext, "xmsbs_tipodocumento");
		JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_descripcion", tipoDocumento);
	},		
	
};