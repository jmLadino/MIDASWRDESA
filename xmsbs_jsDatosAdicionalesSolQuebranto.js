if (typeof (DatoAdicionalSolQuebranto) == "undefined")
{
	DatoAdicionalSolQuebranto = {
		__namespace: true
	};
}
DatoAdicionalSolQuebranto = {
	onLoad : function (executionContext) {
		var tipoOperacion = JumpStartLibXRM.Fx.getLookupValueId(executionContext, "xmsbs_tipooperacion");
        if(tipoOperacion){
            if (tipoOperacion.indexOf("{") > -1){tipoOperacion = tipoOperacion.substring(1, 37);}
            var resultado = DatoAdicionalSolQuebranto.buscarCodigoTipoOperacion(executionContext,tipoOperacion);
            if(resultado){
                if(resultado.xmsbs_codigo != null){
					var codigo = resultado.xmsbs_codigo;
					if(codigo == 5){
						//Si el código es 5, la grilla es la de Cuenta Corriente Reverso COmisiones Intereses: vistaCCRCI
						executionContext.getFormContext().ui.tabs.get("general").sections.get("vistaCCRCI").setVisible(true);
					}
                    
                    if(codigo == 4){
                        //Si el código es 4, la grilla es la de Cuenta Corriente Cierre + Reverso: vistaCCRCI
                        executionContext.getFormContext().ui.tabs.get("general").sections.get("VistaCYR").setVisible(true);
                    }
                    
                    if(codigo == 3){
                        //Si el código es 12, la grilla es la de Cierre de Contrato: vistaCierreContrato
                        executionContext.getFormContext().ui.tabs.get("general").sections.get("vistaCierreContrato").setVisible(true);
                    }
                    if(codigo == 6 || codigo == 11 || codigo == 9 || codigo == 13 || codigo == 14){
                        executionContext.getFormContext().ui.tabs.get("general").sections.get("vistaREG").setVisible(true);
                    }
				}
			}
		}
	},
	
	buscarCodigoTipoOperacion: function (executionContext, idTipoOperacion)	{
		//Preparamos la consulta
		var entityType = "xmsbs_tipooperacinejecucinquebranto";
		var entityId = idTipoOperacion;
		var query = "xmsbs_name,xmsbs_codigo";
		//realizamos la consulta
		var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, "");
		return resultado;
	},
    
    onChange_fechaFutura: function (executionContext, nombreEsquema) {
        //Calculo las fecha en Milisegundos para poder comparar
        var hoy = new Date();
        var fechaVigente = JumpStartLibXRM.Fx.getValueField(executionContext,nombreEsquema, null);
        if(fechaVigente){
            var fecha1 = hoy.setDate(hoy.getDate());
            var fecha2 = fechaVigente.setDate(fechaVigente.getDate());

            //Compara que la fecha ingresada sea menor a la fecha de proximo contacto
            if(fecha1 < fecha2){
                var alertStrings = { confirmButtonLabel: "Aceptar", text: "La fecha ingresada no puede ser mayor al día de hoy", title: "Fecha invalida" };
                var alertOptions = { height: 120, width: 260 };
                Xrm.Navigation.openAlertDialog(alertStrings, alertOptions).then(
                    function (success) {
                        JumpStartLibXRM.Fx.setValueField(executionContext,nombreEsquema, null);
                        JumpStartLibXRM.Fx.setFocus(executionContext,nombreEsquema);
                    },
                    function (error) {
                        //console.log(error.message);
                    }
                );
            }
        }
    },
    
};