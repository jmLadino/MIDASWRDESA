if (typeof (BaseRespuesta) == "undefined")
{
	BaseRespuesta = {
		__namespace: true
	};
}

BaseRespuesta = {   
	
    onLoad_Formulario: function (executionContext) {
        
		//BaseRespuesta.CodigoMidas(executionContext);
	},
    
    CodigoMidas: function (executionContext){
        debugger;
		
		var Nombre = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_name", null);
		var Titulo = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_titulo", null);
        
		if(Nombre && Titulo){
			//Se arma el codigo 	
			var codigo = Nombre + " > " + Titulo;
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_codigomidas", codigo);
		}
		else{
			//Se limpia el campo Codigo
			JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_codigomidas", null);
		}

    },	
    
};