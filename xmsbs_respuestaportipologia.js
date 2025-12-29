if (typeof(RespuestaPorTipologia) == "undefined") {
    RespuestaPorTipologia = {
        __namespace: true
    };    
}

RespuestaPorTipologia = {
    Form: {        
        executionContext: null,
        formContext:null
    },
	
//================
//FUNCIONES ONLOAD
//================
   onLoad_Formulario: function (executionContext) {
		debugger;
		RespuestaPorTipologia.Form.executionContext = executionContext;
		RespuestaPorTipologia.Form.formContext = executionContext.getFormContext();
		
		var CantCaracteresMinimos = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_cantcaracteresminimos", null);
		if (CantCaracteresMinimos == null)
		{
			var oRespuestaTextoLibre = RespuestaPorTipologia.oDataRespuestaTextoLibre(executionContext, RespuestaPorTipologia.Form.formContext.data.entity.getId());
			if (oRespuestaTextoLibre == null)
				return null;       
			if (oRespuestaTextoLibre && oRespuestaTextoLibre.value.length > 0){
				JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_cantcaracteresminimos");
			}
		}
		else
		{
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_cantcaracteresminimos");
		}
	}, 

//================
//FUNCIONES ODATA
//================
    oDataRespuestaTextoLibre: function (executionContext, EntityId){
		// evalúa si la respuesta ascoiada tiene contenido: TEXTO LIBRE
        
		var entityType = "xmsbs_respuestasportipologias";
		var query = "?$select=xmsbs_respuestasportipologiaid,xmsbs_name&";
		query += "$expand=xmsbs_respuestaasociada($select=xmsbs_codigo)&";
		query += "$filter=(xmsbs_respuestasportipologiaid eq '" +  EntityId.replace(/[{}]/g, "") + "') and (contains(xmsbs_respuestaasociada%2fxmsbs_contenido, '%25TEXTO+LIBRE%25'))&";
		query += "$orderby=xmsbs_name asc";
		var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function ()
		{});
		return resultado;
    },    

//================
//FUNCIONES ONCHANGE
//================


//================
//FUNCIONES ONCHANGE GENERICAS
//================

	
//==================
//FUNCIONES ONSAVE
//==================

	
};