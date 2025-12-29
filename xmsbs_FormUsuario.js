
	
if (typeof (Usuario) == "undefined")
{
	Usuario = {
		__namespace: true
	};
}

Usuario = {   
    
    onChange_rutUser: function (executionContext) {
		
		var myControl = executionContext.getEventSource().getName();
        var rut = JumpStartLibXRM.Fx.getValueField(executionContext, "xmsbs_rut", null);
        if(rut){
            var formatoRutBanco = Usuario.validarFormatoRutRegex(rut);
            if (!formatoRutBanco)
			{
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "El formato de RUT debe contener 10 dígitos (complete con ceros a la izquierda), sin puntos, con guion y digito verificador (si es K debe ser mayúscula)", title: "Formato RUT incorrecto" };
                var alertOptions = { height: 250, width: 500 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext, myControl, "");
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },	
     
    validarFormatoRutRegex: function (rut){
        //if(!rut.match(^\d{10}-[\dK]$)){
		if(!rut.match(/^[0-9]{10}-([0-9]|K)$/)){	
            return false;
        }
        return true;
    },

};	