//Prorroga en Santander

if (typeof (Prorroga) == "undefined")
{
	Prorroga = {
		__namespace: true
	};
}

Prorroga = {
	
	//=================
	//FUNCIONES BOTONES
	//=================	
	
    enableButtonAprobar: function (executionContext){
debugger; 
		var solicitado = Xrm.Page.getAttribute("statuscode").getValue(); 
		if(solicitado == 1)
		{
			var esPropietario = JumpStartLibXRM.Fx.isOwnerUser(executionContext);
			var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext,"Administrador del sistema");
			if(esPropietario)
			{
				return true;
			}
			else{
				if(asAdmin)
				{
					return true;
				}else
				{
					return false;
				}
			}
		}
		else
		{
			return false;
		}
	},	
    
	onClickButtonAprobar: function (executionContext) {
		var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Aprobar Prorroga", subtitle:"Va a aprobar la prorroga. ¿Desea continuar?"};
        var confirmOptions  = { height: 200, width: 260 };
        Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
            function (success) {
                if(success.confirmed){
                    //Si confirma
                    
                    //Marco el registro como aprobado 
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_activarprorroga", true);
                    
                    //Guardamos el cambio
                    JumpStartLibXRM.Fx.formSave(executionContext);
                }
                else{
                    //Si cancela
                }
            },
            function (error) {
                //console.log(error.message);
            }
        );
	},		
    
	enableButtonRechazar: function (executionContext){
		var solicitado = Xrm.Page.getAttribute("statuscode").getValue(); 
		if(solicitado == 1)
		{
			var esPropietario = JumpStartLibXMR.Fx.isOwnerUser(executionContext);
			var asAdmin = JumpStartLibXRM.Fx.UserHasRole(executionContext, "Administrador del sistema");
			if(esPropietario)
			{
				return true;
			}
			else{
				if(asAdmin)
				{
					return true;
				}else
				{
					return false;
				}
			}
		}
		else
		{
			return false;
		}
	},
    
	onClickButtonRechazar: function (executionContext) {
		var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Rechazar Prorroga", subtitle:"Va a rechazar la prorroga. ¿Desea continuar?"};
        var confirmOptions  = { height: 200, width: 260 };
        Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
            function (success) {
                if(success.confirmed){
                    //Si confirma
                    
                    //Marco el registro como rechazado 
                    JumpStartLibXRM.Fx.setValueField(executionContext, "xmsbs_rechazarprorroga", true);
                    
                    //Guardamos el cambio
                    JumpStartLibXRM.Fx.formSave(executionContext);
                }
                else{
                    //Si cancela
                }
            },
            function (error) {
                //console.log(error.message);
            }
        );
	},	
	
};