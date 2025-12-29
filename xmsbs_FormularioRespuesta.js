if (typeof (Respuesta) == "undefined")
{
	Respuesta = {
		__namespace: true
	};
}
Respuesta = {
	
	onLoad_Formulario: function (executionContext) {
		
		var formContext = executionContext.getFormContext();
		var presuntoFraude = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_presuntofraude", null);
		if(presuntoFraude)
		{
			//Presunto Fraude
			formContext.ui.tabs.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}").sections.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}_section_4").setVisible(true); //Presunto Fraude
			formContext.ui.tabs.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}").sections.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}_section_2").setVisible(false); //Ley de Fraude
			formContext.ui.tabs.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}").sections.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}_section_3").setVisible(false); //Estuvo en el extranjero
		}
		else
		{
			//Ley de Fraude
			//Presunto Fraude
			formContext.ui.tabs.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}").sections.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}_section_4").setVisible(false); //Presunto Fraude
			formContext.ui.tabs.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}").sections.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}_section_2").setVisible(true); //Ley de Fraude
			formContext.ui.tabs.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}").sections.get("{aa3b2e0d-9e81-476c-88f6-2a9e5eea3601}_section_3").setVisible(true); //Estuvo en el extranjero
		}
	},
};