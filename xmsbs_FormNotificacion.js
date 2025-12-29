if (typeof (Notificacion) == "undefined")
{
	Notificacion = {
		__namespace: true
	};
}

Notificacion = {   
	
    onLoad_Formulario: function (executionContext) {
        
		//Muestro la seccion que corresponda segun el tipo de Notificacion
		Notificacion.seccionesPorTipo(executionContext);
	},
    
    seccionesPorTipo: function (executionContext){
        debugger;
		
		var TipoNot = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_tiponotificacion", null);
        var formContext = executionContext.getFormContext();

		if(TipoNot == 1){
			//Santander	
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_template");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_asunto");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_titulo");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_subtitulo");

			//formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_2").setVisible(true); //Cabecera			
			formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_3").setVisible(true); //Cuerpo
			formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_4").setVisible(false); //Parametros
            formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_5").setVisible(false); //Recuadro BECO
		}
		else if (TipoNot == 2){
			//Adquirencia
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_template");
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_asunto");
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_titulo");
			JumpStartLibXRM.Fx.hideField(executionContext, "xmsbs_subtitulo");
			
			//formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_2").setVisible(false); //Cabecera
			formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_3").setVisible(false); //Cuerpo
			formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_4").setVisible(true); //Parametros
            formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_5").setVisible(false); //Recuadro BECO
		}
		else if (TipoNot == 3){
			//BECO
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_template");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_asunto");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_titulo");
			JumpStartLibXRM.Fx.showField(executionContext, "xmsbs_subtitulo");			
			
			//formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_2").setVisible(true); //Cabecera
			formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_3").setVisible(false); //Cuerpo
			formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_4").setVisible(true); //Parametros
            formContext.ui.tabs.get("tab_2").sections.get("tab_2_section_5").setVisible(true); //Recuadro BECO
		}
    },	
    
 
};