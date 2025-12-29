if (typeof (ComercioAdquirencia) == "undefined")
{
	ComercioAdquirencia = {
		__namespace: true
	};
}
ComercioAdquirencia = {
	onChange_minutos: function (executionContext)
	{
        debugger;	
		var minuto = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_horasolicitud", null);
		if (minuto)
		{
            var separador = minuto.charAt(2);
			if (separador != ":")
			{
                				
				var alertStrings = {confirmButtonLabel: "Aceptar",text: "debe contener el separador de horario (:).",title: "Formato incorrecto"};
				var alertOptions = {height: 120,width: 260};
				Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
				function (success)
				{
					console.log("Alert dialog closed");
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_horasolicitud", null);
				},

				function (error)
				{
					//console.log(error.message);
				});
                 
            }
		}
	},
};