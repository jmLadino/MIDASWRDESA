if (typeof (AccionValidator) === "undefined") {
    AccionValidator = {
        __namespace: true
    };
}
var _formContext = null;

AccionValidator = {

    TipoRegla: {
        EsIgualA: 1,
        NoEsIgualA: 2,
        ContieneDatos: 3,
        NoContieneDatos: 4,
        Contiene: 5,
        NoContiene: 6,
        EmpiezaPor: 7,
        NoEmpiezaPor: 8,
        TerminaCon: 9,
        NoTerminaCon: 10,
        MayorA: 11,
        MenorA: 12,
        MayorOIgualA: 13,
        MenorOIgualA: 14
    },

    TipoCampo: {
        Texto: 1,
        ConjuntoOpciones: 2,
        Multiseleccion: 3,
        DosOpciones: 4,
        Numero: 5,
        Divisa: 6,
        VariasLineas: 7,
        Fecha: 8,
        Busqueda: 9,
        Cliente: 10
    },

    validateAccion: function (accionEtapa, formContext)
    {   
        //debugger;
        _formContext = formContext;
        let _validado = true;
        let _campoValido = false;
        let _message = "";   
        let _mensajeValidacion = "";
        let _mensajeErrorValidacion = "";
        let _condicionPrevia;
        
        // Si está en ETAPA 1, y además tiene declarado campos requeridos (en el form).
        // entonces valida los campos requeridos al ENVIAR A GESTION. (si se determina que debe aplicar a otra acción, se debe agregar aquí)
        if (accionEtapa.codigo.includes("ETA001-ACC0006"))
        {
            //debugger;
            var CamposVacios = [];
            var CamposDinamicos = formContext.ui.tabs.get('general').sections.get('Details').controls;
            var esCasoReiterado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_marcareiterado", null);

            CamposDinamicos.forEach(function(e) {
                if (e.getVisible() && e.getAttrDescriptor().RequiredLevel == 2 && !esCasoReiterado)
                {
                    // solo si el campo es visible y es requerido, entonces comprueba que tenga valor.
                    if (e.getAttribute().getValue() === null || e.getAttribute().getValue() === "")
                    {
                        CamposVacios.push(e.getLabel());
                    }
                }
            });
            
            if (CamposVacios.length > 0) {
                _validado = false;
                if (CamposVacios.length == 1)
                    _mensajeErrorValidacion = "Ingrese el campo: " + CamposVacios[0];
                else
                    _mensajeErrorValidacion = "Ingrese los siguientes campos: " + CamposVacios.join(", ");
            }
            else
            {
                _validado = true;    
            }
        }


        if (_validado)
        {
            _validado = false;
            let _totalValidaciones = 0;

            if(!accionEtapa.listValidacion)
            {
                _totalValidaciones = 0;
                _mensajeValidacion = "OK";
            }
            else
            {
                _totalValidaciones = accionEtapa.listValidacion.length;
            }
    
            if (_totalValidaciones > 0) 
            {
                _mensajeValidacion = accionEtapa.mensajeValidacion;
    
                for (var i = 0; i < accionEtapa.listValidacion.length; i++) 
                {
                    if (accionEtapa.listValidacion[i].campo) 
                    {
                        let _entidad = accionEtapa.listValidacion[i].entidad;
                        let _campo = accionEtapa.listValidacion[i].campo;
                        let _valorValidacion = accionEtapa.listValidacion[i].valor.toString().toLowerCase();
                        let _regla = accionEtapa.listValidacion[i].regla;
                        let _reglaValor = accionEtapa.listValidacion[i].reglaValor;
                        let _tipoCampo = accionEtapa.listValidacion[i].tipoCampo;
                        let _tipoCampoValor = accionEtapa.listValidacion[i].tipoCampoValor;
                        let _condicionSiguiente = accionEtapa.listValidacion[i].condicionSiguiente; //Y: False/0, O: True/1                  
                        let _mensajeError = accionEtapa.listValidacion[i].mensajeError;
    
                        let _ultimaValidacion = i === (_totalValidaciones - 1);
                        let _campoValor;
                        
                        if (_campo == "FNC_ValidacionGrilla")
                        {
                            let marcareiterado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_marcareiterado", null);
                            if (marcareiterado)
                            {
                                _campoValido = true;	
                                _campoValor = true;
                            }
                            else
                            {
                                var RegistrosGrilla = [];
                                RegistrosGrilla = AccionValidator.buscarRegistrosGrilla(idIncident);
                                _campoValor = null;
                                _campoValido = false;
                                if (RegistrosGrilla != null)
                                    _campoValor = RegistrosGrilla.value.length;
                                
                                if (_campoValor != null && _campoValor > 0)
                                    _campoValido = true;							
                            }
                        }
                        else if (_campo == "FNC_ValidacionGrillaEquiposSucursales")
                        {
                            //debugger;
                            let marcareiterado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_marcareiterado", null);
                            if (marcareiterado)
                            {
                                _campoValido = true;	
                                _campoValor = true;
                            }
                            else
                            {
                                var RegistrosGrilla = [];
                                RegistrosGrilla = AccionValidator.buscarRegistrosGrilla(idIncident, "xmsbs_equipocaso");
                                _campoValor = null;
                                _campoValido = false;
                                if (RegistrosGrilla != null)
                                    _campoValor = RegistrosGrilla.value.length;
                                
                                if (_campoValor != null && _campoValor > 0)
                                    _campoValido = true;							
                            }
                        }					
                        else if (_campo == "FNC_ValidacionGrillaMovimientos")
                        {
                            let marcareiterado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_marcareiterado", null);
                            if (marcareiterado)
                            {
                                _campoValido = true;	
                                _campoValor = true;
                            }
                            else
                            {                        
                                //debugger;
                                var RegistrosGrilla = [];
                                RegistrosGrilla = AccionValidator.buscarRegistrosGrillaMovimientos(idIncident);
                                _campoValor = null;
                                _campoValido = false;
                                if (RegistrosGrilla != null)
                                    _campoValor = RegistrosGrilla.value.length;
                                
                                if (_campoValor != null && _campoValor > 0)
                                    _campoValido = true;
                            }
                        }
                        else if (_campo == "FNC_ValidacionGrillaPolizas")
                        {
                            let marcareiterado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_marcareiterado", null);
                            if (marcareiterado)
                            {
                                _campoValido = true;	
                                _campoValor = true;
                            }
                            else
                            {                        
                                //debugger;
                                var RegistrosGrilla = [];
                                RegistrosGrilla = AccionValidator.buscarRegistrosGrillaPolizas(idIncident);
                                _campoValor = null;
                                _campoValido = false;
                                if (RegistrosGrilla != null)
                                    _campoValor = RegistrosGrilla.value.length;
                                
                                if (_campoValor != null && _campoValor > 0)
                                    _campoValido = true;
                            }
                        }
                        else if (_campo == "FNC_ValidacionETA002_FSAC_SResp")
                        {
                            // esta validación no es soportada por el modelo, por eso lo traje a una función específica.
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_tipoderespuesta", null);
                            var viaentregarespcliente = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_viaentregarespcliente", null);
                            _campoValor = null;
                            _campoValido = false;
                            if (tipoderespuesta != null)
                            {
                                if (tipoderespuesta == 1) // Se accede a lo requerido
                                {
                                    if (viaentregarespcliente != null)
                                    {
                                        _campoValor = true;
                                        _campoValido = true;        
                                    }
                                }
                                else
                                {
                                    _campoValor = true;
                                    _campoValido = true;        
                                }
                            }
                        }
                        else if(_campo == "FNC_ValidacionETA002_Reguladores")
                        {
                            //Se hace una validación adicional que no cubre el modelo, para validar la opcionalidad del Motivo de resolución
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_tipoderespuesta", null);
                            var motivoResolucion = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_motivoresolucion", null);
                            _campoValor = true;
                            _campoValido = true;
                            if (tipoderespuesta != null)
                            {
                                if (tipoderespuesta == 1) // Se accede a lo requerido
                                {
                                    if (!motivoResolucion)
                                    {
                                        _campoValido = false;
                                        _campoValor = null;     
                                    }
                                }
                            }
                            _validado = _campoValido;
                            if(!_validado){
                                _mensajeErrorValidacion = _mensajeError;
                                break;
                            }
                        }
                        else if(_campo == "FNC_ValidacionQuebrantoNOEstandarizado")
                        {
                            //debugger;
                            //Se valida primero si tiene quebranto en sí y si tiene un registro de quebranto
                            _campoValor = true;
                            _campoValido = true;
                            var indicadorQuebranto = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_indicadordequebranto", null);
                            var registroQuebranto = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_registroquebranto", null);
                            
                            if (indicadorQuebranto &&  registroQuebranto)
                            {
                                registroQuebranto = registroQuebranto[0].id;
                                //Tiene el indicador en sí y además tiene un registro. Buscamos el estado de ese quebranto
                                if (registroQuebranto.indexOf("{") > -1){registroQuebranto = registroQuebranto.substring(1, 37);}
                                var respuesta = AccionValidator.buscarEstadoQuebranto(registroQuebranto);
                                if(respuesta){
                                    var estado = respuesta.xmsbs_repararejecutivo;
                                    var status = respuesta.statuscode;
                                    if(estado != 1){ // Si es distinto a Quebranto validado, marca false para que no permita avanzar
                                        _campoValido = false;
                                        _campoValor = null;
                                        
                                        //Pero, si el quebranto está terminado sin gestión, permite avanzar igual
                                        if(status == 657130009){ //Terminado sin gestión
                                            //Lo deja pasar
                                            _campoValido = true;
                                            _campoValor = true;
                                        }
                                    }
                                }   
                            }
                            _validado = _campoValido;
                            if(!_validado){
                                _mensajeErrorValidacion = _mensajeError;
                                break;
                            }
                        }
                        //darme de baja V2 etapa 2 enviar a logistica
                        else if(_campo == "FNC_ValidacionETA002_DardebajamPOSAdquirencia")
                        {
                            //debugger;
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist5g_texto", null);
                            var motivo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist3g_texto", null);
                            var situacionequipo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist4g_texto", null);
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (tipoderespuesta != null)
                            {
                                if((motivo == "Terminal" ||motivo == "Sucursal" ||motivo == "Entregado de más") && (tipoderespuesta == "mPOS" || tipoderespuesta == "POS" || tipoderespuesta == "POS con mPOS" || tipoderespuesta == "POS con Checkout" || tipoderespuesta == "Todos" || tipoderespuesta == "mPOS con Checkout" || tipoderespuesta == "POS con Link de pago" || tipoderespuesta == "mPOS con link de pago" || tipoderespuesta == "POS con Link de pago" || tipoderespuesta == "mPOS con Checkout y Link de Pago" || tipoderespuesta == "POS con Checkout y Link de Pago" || tipoderespuesta == "mPOS con link de pago" || tipoderespuesta == "POS con mPOS y Checkout"|| tipoderespuesta == "POS con mPOS y Link de Pago") && (situacionequipo != "Perdido")) 
                                {
                                    _campoValido = true;
                                }
                            }
                            else
                            {
                                _campoValido = false;
                            }
                            
                        }
                        //darme de baja V2 etapa2 enviar a intercambio
                        else if(_campo == "FNC_ValidacionETA002_DardebajamInterAdquirencia")
                        {   
                            //debugger;
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist5g_texto", null);
                            var motivo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist3g_texto", null);
                            var situacionequipo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist4g_texto", null);
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (tipoderespuesta != null)
                            {
                                if((motivo == "Terminal" || motivo == "Sucursal" || motivo == "Entregado de más") || ( tipoderespuesta == "Checkout" || tipoderespuesta == "Checkout con Link de Pago" || tipoderespuesta == "Link de pago") || (situacionequipo== "Perdido"))
                                {
                                    _campoValido = true;
                                }
                                else
                                {
                                    _campoValido = false;
                                }
                            }
                            else
                            {
                                _campoValido = false; 
                            }
                        }
                        //Cierre riego etapa 2 enviar a logistica
                        else if(_campo == "FNC_ValidacionETA002_CierreRiegoPOSAdquirencia")
                        {
                            debugger;
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist5g_texto", null);                  
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (tipoderespuesta != null)
                            {
                                if(tipoderespuesta == "mPOS" || tipoderespuesta == "POS" || tipoderespuesta == "POS con mPOS" || tipoderespuesta == "POS con Checkout" || tipoderespuesta == "Todos" || tipoderespuesta == "mPOS con Checkout" || tipoderespuesta == "POS con Link de pago" || tipoderespuesta == "mPOS con link de pago" || tipoderespuesta == "POS con Link de pago" || tipoderespuesta == "mPOS con Checkout y Link de Pago" || tipoderespuesta == "POS con Checkout y Link de Pago" || tipoderespuesta == "mPOS con link de pago" || tipoderespuesta == "POS con mPOS y Checkout"|| tipoderespuesta == "POS con mPOS y Link de Pago") 
                                {
                                    _campoValido = true;
                                }
                            }
                            else
                            {
                                _campoValido = false;
                            }
                            
                        }
                        //Cierre riego etapa 2 enviar a Intercambio
                        else if(_campo == "FNC_ValidacionETA002_CierreRiegoInterAdquirencia")
                        {   
                            debugger;
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist5g_texto", null);                        
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (tipoderespuesta != null)
                            {
                                if(tipoderespuesta == "Checkout" || tipoderespuesta == "Checkout con Link de Pago" || tipoderespuesta == "Link de pago")
                                {
                                    _campoValido = true;
                                }
                                else
                                {
                                    _campoValido = false;
                                }
                            }
                            else
                            {
                                _campoValido = false; 
                            }
                        }
                        //darme de baja V2 etapa 2 NO tiene ejecutivo de cartera
                        else if(_campo == "FNC_ValidacionETA002_DardebajaCarteraNOAdquirencia")
                        {   
                            debugger;
                             var comercioid = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_comercio", null);
                             _campoValor = true;
                            _campoValido = false;
                             comercioid = comercioid[0].id;
                             var respuesta = AccionValidator.buscarCarteraComercio(comercioid);
                             if(respuesta != null)
                             {
                                if(respuesta.value[0].xmsbs_tieneejecutivodecartera != null)
                                {
                                    if(respuesta.value[0].xmsbs_tieneejecutivodecartera.toString() != "true")
                                    {
                                        _campoValido = true;
                                    }
                                    else if(respuesta.value[0].xmsbs_tieneejecutivodecartera.toString() == "true")
                                    {
                                        _campoValido = false;
                                    }
                                }
                                else
                                {
                                    _campoValido = true;
                                }
                             }
                             
                        }
                        //darme de baja V2 etapa 2 tiene ejecutivo de cartera
                        else if(_campo == "FNC_ValidacionETA002_DardebajaCarteraSIAdquirencia")
                        {   
                            debugger;
                             var comercioid = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_comercio", null);
                             _campoValor = true;
                            _campoValido = false;
                             comercioid = comercioid[0].id;
                             var respuesta = AccionValidator.buscarCarteraComercio(comercioid);
                             if(respuesta != null)
                             {
                                if(respuesta.value[0].xmsbs_tieneejecutivodecartera != null)
                                {
                                    if(respuesta.value[0].xmsbs_tieneejecutivodecartera.toString() != "true")
                                    {
                                        _campoValido = false;
                                    }
                                    else if(respuesta.value[0].xmsbs_tieneejecutivodecartera.toString() == "true")
                                    {
                                        _campoValido = true;
                                    }
                                }
                                else
                                {
                                    _campoValido = false;
                                }
                             }
                             
                        }
                        //darme de baja V2 etapa 3 enviar a logistica
                        else if(_campo == "FNC_ValidacionETA003_DardebajaLogisticaAdquirencia")
                        { 
                            var situacionequipo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist4g_texto", null);
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist5g_texto", null);
                            var Retencion = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist1g_texto", null);
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (tipoderespuesta != null)
                            {
                                if((tipoderespuesta == "mPOS" || tipoderespuesta == "POS" || tipoderespuesta == "POS con mPOS" || tipoderespuesta == "POS con Checkout" || tipoderespuesta == "Todos" || tipoderespuesta == "mPOS con Checkout" || tipoderespuesta == "POS con Link de pago" || tipoderespuesta == "mPOS con link de pago" || tipoderespuesta == "POS con Link de pago" || tipoderespuesta == "mPOS con Checkout y Link de Pago" || tipoderespuesta == "POS con Checkout y Link de Pago" || tipoderespuesta == "mPOS con link de pago" || tipoderespuesta == "POS con mPOS y Checkout"|| tipoderespuesta == "POS con mPOS y Link de Pago") && (Retencion == "No lo logra") && (situacionequipo != "Perdido")) 
                                {
                                    _campoValido = true;
                                }
                            }
                            else
                            {
                                _campoValido = false;
                            }
                            
                            
                        }
                        //darme de baja V2 etapa 3 enviar a Intercambio
                        else if(_campo == "FNC_ValidacionETA003_DardebajaIntercambioAdquirencia")
                        { 
                            debugger;
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist5g_texto", null);
                            var Retencion = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist1g_texto", null);
                            var situacionequipo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist4g_texto", null);
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (tipoderespuesta != null)
                            {
                                if( (tipoderespuesta == "Checkout" || tipoderespuesta == "Checkout con Link de Pago" || tipoderespuesta == "Link de pago") || (Retencion== "Si lo logra")   || (situacionequipo== "Perdido"))
                                {
                                    _campoValido = true;
                                }
                                else
                                {
                                    _campoValido = false;
                                }
                            }
                            else
                            {
                                _campoValido = false; 
                            }
                        }
                        //darme de baja V3 etapa 2 enviar a logistica
                        else if(_campo == "FNC_ValidacionETA002_DardebajaV3mPOSAdquirencia")
                        {
                            debugger;
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist5g_texto", null);
                            var motivo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist3g_texto", null);
                            var situacionequipo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist4g_texto", null);
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (tipoderespuesta != null)
                            {
                                if((motivo == "Terminal" ||motivo == "Sucursal" ||motivo == "Entregado de más") && (tipoderespuesta == "mPOS" || tipoderespuesta == "POS" || tipoderespuesta == "POS con mPOS" || tipoderespuesta == "POS con Checkout" || tipoderespuesta == "Todos" || tipoderespuesta == "mPOS con Checkout" || tipoderespuesta == "POS con Link de pago" || tipoderespuesta == "mPOS con link de pago" || tipoderespuesta == "POS con Link de pago" || tipoderespuesta == "mPOS con Checkout y Link de Pago" || tipoderespuesta == "POS con Checkout y Link de Pago" || tipoderespuesta == "mPOS con link de pago" || tipoderespuesta == "POS con mPOS y Checkout"|| tipoderespuesta == "POS con mPOS y Link de Pago") && (situacionequipo != "Perdido")) 
                                {
                                    _campoValido = true;
                                }
                            }
                            else
                            {
                                _campoValido = false;
                            }
                            
                        }
                        //darme de baja V3 etapa2 enviar a intercambio
                        else if(_campo == "FNC_ValidacionETA002_DardebajaV3InterAdquirencia")
                        {   
                            debugger;
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist5g_texto", null);
                            var motivo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist3g_texto", null);
                            var situacionequipo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist4g_texto", null);
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (tipoderespuesta != null)
                            {
                                if((motivo == "Terminal" || motivo == "Sucursal" ) && ( tipoderespuesta == "Checkout" || tipoderespuesta == "Checkout con Link de Pago" || tipoderespuesta == "Link de pago") || (situacionequipo== "Perdido"))
                                {
                                    _campoValido = true;
                                }
                                else
                                {
                                    _campoValido = false;
                                }
                            }
                            else
                            {
                                _campoValido = false; 
                            }
                        }
                        //darme de baja V4 etapa4 enviar a intercambio
                        else if(_campo == "FNC_ValidacionETA004_DardebajaV4InterAdquirencia")
                        {   
                            debugger;
                            var entregaequipo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_cambiodeterminal", null);
                            var situacionequipo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist4g_texto", null);
                            var motivo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist7g_texto", null);
                            
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (tipoderespuesta != null)
                            {
                                if((entregaequipo == true ) || ( entregaequipo == false && situacionequipo == "Normal" && motivo == "Equipo perdido"))
                                {
                                    _campoValido = true;
                                }
                                else
                                {
                                    _campoValido = false;
                                }
                            }
                            else
                            {
                                _campoValido = false; 
                            }
                        }
                        else if(_campo == "FNC_ValidacionETA006_RoboPerdidaReposicionAdquirencia")
                        { 
                            debugger;
                            var semaforo = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist3g_texto", null);
                            var recepcion = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist6g_texto", null);
                            var respuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_respuestacliente", null);
                            _campoValor = true;
                            _campoValido = false;
                            
                            if(semaforo != null && recepcion != null && respuesta != null)
                            {
                                if((semaforo == "Verde" && recepcion == "SI") || (semaforo == "Verde" && recepcion == "NO") || (semaforo == "Rojo" && recepcion == "NO"))
                                {
                                    _campoValido = true;
                                }
                                else                            
                                {
                                    _campoValido = false; 
                                }
                            }
                            else
                            {
                                _campoValido = false; 
                            }                        
                            
                        }
                        //me arrepenti etapa 4
                        else if (_campo == "FNC_MeArrepentiValidaAdjuntoAdquirencia")
                        {
                            debugger;
                            _campoValor = true;
                            _campoValido = true;
                            debugger;
                            //Se valida si el caso tiene el documento de respuesta a cliente, y validamos que el documento esté subido
                            //var incidentId = JumpStartLibXRM.Fx.getEntityId(_formContext);
                            //if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
                            
                            var tipoRespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_tipoderespuesta", null);
                            var equipoEntregado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist5g_texto", null);
                            
                            if(tipoRespuesta == 2 && equipoEntregado == "NO")
                            {
                                var respuesta = AccionValidator.buscarDocumentoRespuestaCliente(idIncident);
                                if(respuesta && respuesta.value.length > 0){
                                    for (var j = 0; j < respuesta.value.length; j++){
                                        var tipoDocumentalCodigo = respuesta.value[j].xmsbs_TipoDocumento.xmsbs_codigo;
                                        if(tipoDocumentalCodigo == "TDA-003"){
                                            //Si el código del documento es el de respuesta a cliente
                                            
                                            var documentoID = respuesta.value[j].xmsbs_id;
                                            var estado = respuesta.value[j].statuscode;
                                            var tipoDocumentalCod = respuesta.value[j].xmsbs_TipoDocumento.xmsbs_codigo;
                                            
                                            //Validamos que el documento sea de RespuestaCliente y si lo es, que esté subido
                                            if(documentoID == null && tipoDocumentalCod == "TDA-003" && estado == 657130000){ // Si no tiene Id Filenet, es de respuesta a cliente y está pendiente
                                                _campoValido = false;
                                                _campoValor = null;
                                            }
                                        }
                                    }
                            }   
                            
                            _validado = _campoValido;
                            if(!_validado){
                                _mensajeErrorValidacion = _mensajeError;
                                break;
                            }
                            }
                            else
                            {
                                _campoValido = true;
                            }                                                       
                        }
                        //me arrepenti etapa 3
                        else if (_campo == "FNC_MeArrepentiValidaAdjuntoEta3Adquirencia")
                        {
                            debugger;
                            _campoValor = true;
                            _campoValido = true;
                            debugger;
                            //Se valida si el caso tiene el documento de respuesta a cliente, y validamos que el documento esté subido
                            //var incidentId = JumpStartLibXRM.Fx.getEntityId(_formContext);
                            //if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
                            
                            //var tipoRespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_tipoderespuesta", null);
                            var equipoEntregado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist6g_texto", null);
                            
                            if(equipoEntregado == "SI")
                            {
                                var respuesta = AccionValidator.buscarDocumentoRespuestaCliente(idIncident);
                                if(respuesta && respuesta.value.length > 0){
                                    for (var j = 0; j < respuesta.value.length; j++){
                                        var tipoDocumentalCodigo = respuesta.value[j].xmsbs_TipoDocumento.xmsbs_codigo;
                                        if(tipoDocumentalCodigo == "TDA-003"){
                                            //Si el código del documento es el de respuesta a cliente
                                            
                                            var documentoID = respuesta.value[j].xmsbs_id;
                                            var estado = respuesta.value[j].statuscode;
                                            var tipoDocumentalCod = respuesta.value[j].xmsbs_TipoDocumento.xmsbs_codigo;
                                            
                                            //Validamos que el documento sea de RespuestaCliente y si lo es, que esté subido
                                            if(documentoID == null && tipoDocumentalCod == "TDA-003" && estado == 657130000){ // Si no tiene Id Filenet, es de respuesta a cliente y está pendiente
                                                _campoValido = false;
                                                _campoValor = null;
                                            }
                                        }
                                    }
                            }   
                            
                            _validado = _campoValido;
                            if(!_validado){
                                _mensajeErrorValidacion = _mensajeError;
                                break;
                            }
                            }
                            else
                            {
                                _campoValido = true;
                            }                                                       
                        }
                        else if (_campo == "FNC_FallaMposValidaAdjuntoAdquirencia")
                        {
                            debugger;
                            _campoValor = true;
                            _campoValido = true;
                            debugger;
                            //Se valida si el caso tiene el documento de respuesta a cliente, y validamos que el documento esté subido
                            //var incidentId = JumpStartLibXRM.Fx.getEntityId(_formContext);
                            //if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
                            
                            //var tipoRespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_tipoderespuesta", null);
                            //var equipoEntregado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist5g_texto", null);
                            
                            var respuesta = AccionValidator.buscarDocumentoRespuestaCliente(idIncident);
                                if(respuesta && respuesta.value.length > 0){
                                    for (var j = 0; j < respuesta.value.length; j++){
                                        var tipoDocumentalCodigo = respuesta.value[j].xmsbs_TipoDocumento.xmsbs_codigo;
                                        if(tipoDocumentalCodigo == "TDA-009"){
                                            //Si el código del documento es el de respuesta a cliente
                                            
                                            var documentoID = respuesta.value[j].xmsbs_id;
                                            var estado = respuesta.value[j].statuscode;
                                            var tipoDocumentalCod = respuesta.value[j].xmsbs_TipoDocumento.xmsbs_codigo;
                                            
                                            //Validamos que el documento sea de RespuestaCliente y si lo es, que esté subido
                                            if(documentoID == null && tipoDocumentalCod == "TDA-009" && estado == 657130000){ // Si no tiene Id Filenet, es de respuesta a cliente y está pendiente
                                                _campoValido = false;
                                                _campoValor = null;
                                            }
                                        }
                                    }   
                            
                            _validado = _campoValido;
                            if(!_validado){
                                _mensajeErrorValidacion = _mensajeError;
                                break;
                            }
                            }
                            else
                            {
                                _campoValido = true;
                            }
                            
                            
                        }
                        //Flujo merchandising a logistica
                        else if(_campo == "FNC_ValidacionETA002_merchandisinnogAdquirencia")
                        {   
                            debugger;
                            var mcc = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_texto2g", null);                           
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (mcc != null)
                            {
                                if(mcc == "5814" || mcc == "5812")
                                {
                                    _campoValido = true;
                                }
                                else
                                {
                                    _campoValido = false;
                                }
                            }
                            else
                            {
                                _campoValido = false; 
                            }
                        }
                        //Flujo merchandising a merchan
                        else if(_campo == "FNC_ValidacionETA002_merchandisingsiAdquirencia")
                        {   
                            debugger;
                            var mcc = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_texto2g", null);                           
                            _campoValor = true;
                            _campoValido = false;
                            
                            if (mcc != null)
                            {
                                if(mcc == "5814" || mcc == "5812")
                                {
                                    _campoValido = false;
                                }
                                else
                                {
                                    _campoValido = true;
                                }
                            }
                            else
                            {
                                _campoValido = false; 
                            }
                        }
                        else if (_campo == "FNC_ValidaSubrequerimientoVigente")
                        {
                            debugger;
                            // Esta validación se ejecuta en el Caso "Padre", ya que no debe permitir avanzar (o resolver) mientras tenga SubRequerimientos vigentes.
                            var SubRequerimientosVigentes = [];
                            SubRequerimientosVigentes = AccionValidator.buscarSubRequerimientosVigentes(idIncident);
                            _campoValor = null;
                            _campoValido = false;
                            if (SubRequerimientosVigentes != null)
                                _campoValor = SubRequerimientosVigentes.value.length;
                                
                            if (_campoValor == null || _campoValor == 0)
                                _campoValido = true; // Si contiene al menos 1 registro, entonces muestra el mensaje de error.
                        }
                        else if (_campo == "FNC_ValidaDocumentoAdjuntoRespuestaCliente")
                        {
                            _campoValor = true;
                            _campoValido = true;
                            debugger;
                            //Se valida si el caso tiene el documento de respuesta a cliente, y validamos que el documento esté subido
                            //var incidentId = JumpStartLibXRM.Fx.getEntityId(_formContext);
                            //if (incidentId.indexOf("{") > -1){incidentId = incidentId.substring(1, 37);}
                            
                            var respuesta = AccionValidator.buscarDocumentoRespuestaCliente(idIncident);
                            if(respuesta && respuesta.value.length > 0){
                                for (var j = 0; j < respuesta.value.length; j++){
                                    var tipoDocumentalCodigo = respuesta.value[j].xmsbs_TipoDocumento.xmsbs_codigo;
                                    if(tipoDocumentalCodigo == "TD-298"){
                                        //Si el código del documento es el de respuesta a cliente
                                        
                                        var documentoID = respuesta.value[j].xmsbs_id;
                                        var estado = respuesta.value[j].statuscode;
                                        var tipoDocumentalCod = respuesta.value[j].xmsbs_TipoDocumento.xmsbs_codigo;
                                        
                                        //Validamos que el documento sea de RespuestaCliente y si lo es, que esté subido
                                        if(documentoID == null && tipoDocumentalCod == "TD-298" && estado == 657130000){ // Si no tiene Id Filenet, es de respuesta a cliente y está pendiente
                                            _campoValido = false;
                                            _campoValor = null;
                                        }
                                    }
                                }
                            }   
                            
                            _validado = _campoValido;
                            if(!_validado){
                                _mensajeErrorValidacion = _mensajeError;
                                break;
                            }
                        }
                        else if (_campo == "FNC_ValidacionTipoRespuestaNumOperacion")
                        {
                            // esta validación no es soportada por el modelo, por eso lo traje a una función específica.
                            var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_tipoderespuesta", null);
                            var numerooperacion = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_numerooperacion", null);
                            _campoValor = null;
                            _campoValido = false;
                            if (tipoderespuesta != null)
                            {
                                if (tipoderespuesta == 1) // Se accede a lo requerido
                                {
                                    if (numerooperacion != null)
                                    {
                                        _campoValor = true;
                                        _campoValido = true;        
                                    }
                                }
                                else
                                {
                                    _campoValor = true;
                                    _campoValido = true;        
                                }
                            }
                        }
                        else if (_campo == "FNC_ValidacionDocumentosTipoRespuesta")
                        {
                            let marcareiterado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_marcareiterado", null);
                            if (marcareiterado)
                            {
                                _campoValido = true;	
                                _campoValor = true;
                            }
                            else
                            {
                                debugger;
                                var tipoderespuesta = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_tipoderespuesta", null);
                                if (tipoderespuesta != null){
                                    if (tipoderespuesta == 1){ // Se accede a lo requerido
                                        //debugger;
                                        _campoValor = true;
                                        _campoValido = true;
                                        
                                        var RegistrosGrilla = [];
                                        RegistrosGrilla = AccionValidator.buscarRegistrosDocumentosCasoPendientes(idIncident);
                                        if (RegistrosGrilla != null)
                                            _campoValor = RegistrosGrilla.value.length;
                                        
                                        if (_campoValor != null && _campoValor > 0){
                                            _campoValor = null;
                                            _campoValido = false;
                                        }
                                    }
                                    else{
                                        _campoValor = true;
                                        _campoValido = true;        
                                    }
                                } 
                            }
                        }
                        else if (_campo == "FNC_ValidacionDocumentosSubidos")
                        {
                            let marcareiterado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_marcareiterado", null);
                            if (marcareiterado)
                            {
                                _campoValido = true;	
                                _campoValor = true;
                            }
                            else
                            {
                                debugger;
                                _campoValor = true;
                                _campoValido = true;
                                
                                var RegistrosGrilla = [];
                                RegistrosGrilla = AccionValidator.buscarRegistrosDocumentosCasoPendientes(idIncident);
                                if (RegistrosGrilla != null)
                                    _campoValor = RegistrosGrilla.value.length;
                                
                                if (_campoValor != null && _campoValor > 0){
                                    _campoValor = null;
                                    _campoValido = false;
                                } 
                            }
                        }
                        else if (_campo == "FNC_Requerido_xmsbs_picklist2g")
                        {
                            debugger;
                            
                            // Valida que el picklist2g tenga datos, solo si el picklist1g define al picklist2 como requerido.
                            // esta marca se deja al cargar el formulario del caso.
                            let Picklist2Requerido = _formContext.getAttribute("xmsbs_picklist2g").getRequiredLevel();
    
                            if (Picklist2Requerido == "required")
                            {
                                // si está marcado como requerido y si no tiene valor, entonces muestra el mensaje de error.
                                let Picklist2g_Value = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist2g", null);
                                if (Picklist2g_Value != null)
                                {
                                    _campoValor = true;
                                    _campoValido = true;	
                                }
                                else{
                                    _campoValor = null;
                                    _campoValido = false;
                                }
                            }
                            else
                            {
                                _campoValor = true;
                                _campoValido = true;										
                            }
                        }
						else if(_campo == "FNC_ADQ_ValidarStock")
                        {   
                            debugger;
							_campoValor = true;
							_campoValido = true;
							
							var detalleOperacionID = JumpStartLibXRM.Fx.getLookupValueId(_formContext, "xmsbs_detalledeoperacion");
							var oDetalleOperacion = AccionValidator.buscarDetalleOperacion(_formContext, detalleOperacionID);
							
							if (!oDetalleOperacion.xmsbs_idstockadquirencia){
								_mensajeError = "No se puede aplicar la validación para esta Tipología.";
								_campoValido = false;								
							}
							else{
								var idStock = oDetalleOperacion.xmsbs_idstockadquirencia;
								var CampoCantidad = oDetalleOperacion.xmsbs_campocantidadsolicitada
								
								var CantidadSolicitada = JumpStartLibXRM.Fx.getValueField(_formContext, CampoCantidad, null);
								if (!CantidadSolicitada){
									_mensajeError = "Debe ingresar Cantidad Solicitada.";
									_campoValido = false;
								}
								else if(CantidadSolicitada <= 0){
									_mensajeError = "La Cantidad Solicitada debe ser mayor que cero";
									_campoValido = false;
								}
								else {
									// El valor actual SIEMPRE debe ser leído en tiempo real.
									debugger;
									
									var oStockAdquirencia = AccionValidator.oDataGetStockActual(_formContext, idStock);
									if (!oStockAdquirencia || oStockAdquirencia.value.length == 0){
										// siempre debe existir si es que está indicado en el DO
										_mensajeError = "No existe el registro de Stock relacionado.";
										_campoValido = false;
									}
									else 
									{
										var StockActual = oStockAdquirencia.value[0].xmsbs_cantidad;
										var NombreProducto = oStockAdquirencia.value[0].xmsbs_name;
										
										var FullDateNow = JumpStartLibXRM.Fx.getDateNOW_ddmmaaaa_hhmmss();
										JumpStartLibXRM.Fx.setFormNotification(_formContext, "WARNING", "Stock actual " + NombreProducto + ": " + StockActual + " unidades. (última lectura: " + FullDateNow + ")", "NOT_StockAdquirencia");										

										if (CantidadSolicitada > StockActual){
											_mensajeError = "La cantidad solicitada superó el Stock actual, por favor solicite otra cantidad para seguir con el caso, o solicite más Stock.";
											_campoValido = false;
											
											// se usa un campo genérico para dejar la marca
											JumpStartLibXRM.Fx.setValueField(_formContext, "xmsbs_texto13g", "0");
										}
										else{
											// Si todo está ok, se deja marca para hacer el descuento de stock
											JumpStartLibXRM.Fx.setValueField(_formContext, "xmsbs_texto13g", "1");
											_campoValor = true;
											_campoValido = true;											
											
											
											//var usuarioAdministrador = AccionValidator.buscarUsuarioAdministrador(_formContext);
											//var idUsuarioImpersonar = usuarioAdministrador.value[0].systemuserid;										
											
											//var entity = "xmsbs_stockadquirencias";
											//var objeto = {};
											//objeto["xmsbs_cantidad"] = StockActual - CantidadSolicitada;
											
											//var resultado = SDK.WEBAPI.updateRecordImpersonate(_formContext, oStockAdquirencia.value[0].xmsbs_stockadquirenciaid, objeto, entity, idUsuarioImpersonar, null, null);
											//if(resultado == "OK"){
											//	_campoValor = true;
											//	_campoValido = true;
											//
											//	StockActual = StockActual - CantidadSolicitada;
											//	JumpStartLibXRM.Fx.setFormNotification(_formContext, "WARNING", "Stock actual " + NombreProducto + ": " + StockActual + " (este valor es referencial)", "NOT_StockAdquirencia");
											//	
											//	// PENDIENTE: Escribir en alguna parte que la cantidad ya fue descontada
											//}
											//else{
											//	_mensajeError = "Error al realizar el descuento de Stock.";
											//	_campoValido = false;											
											//}
										}										
									}
								}								
							}
								
							//_campoValor = true;
                            //_campoValido = false;
                            
							_validado = _campoValido;
                            if(!_validado){
                                _mensajeErrorValidacion = _mensajeError;
                                break;
                            }							
                        }	
                        else if (_campo == "FNC_ValidaSubrequerimiento")
                        {
                            debugger;
                            // Se ejecuta en los Reparos, valida que no existan Subrequerimientos, de caso contrario impedirá el reparo y mostrará el mensaje de error configurado en la matriz
                            // se consideran activos/inactivos

                            var RegistrosSubRequerimientos = [];
                            RegistrosSubRequerimientos = AccionValidator.buscarSubRequerimientos(idIncident);
                            _campoValor = null;
                            _campoValido = false;
                            if (RegistrosSubRequerimientos != null)
                                _campoValor = RegistrosSubRequerimientos.value.length;
                            
                            if (_campoValor == null || _campoValor == 0)
                                _campoValido = true;
                            else{
                                if (RegistrosSubRequerimientos.value[0]["_xmsbs_etapa_value@OData.Community.Display.V1.FormattedValue"].toLowerCase().includes("demanda"))
                                {
                                    _mensajeError = _mensajeError + ". El SubRequerimiento no está visible porque está en Fiscalía.";
                                }
                            }
                        }
                        else if (_campo == "FNC_Valida_ClienteDesiste_SubReq_Fraude")
                        {
                            debugger;
                            
                            // Por ahora no existen validaciones para cuando se presiona el botón "Cliente Desiste" en el Caso Principal.

                            var CasoPrincipal = JumpStartLibXRM.Fx.getValueField(_formContext, "parentcaseid", null);
                            
                            //default:
                            _validado = true;
                            _mensajeErrorValidacion = "";

                            if (CasoPrincipal){
                                // se ejecuta la función de validación DESDE un SUBRequerimiento:

                                var MotivoCierre = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist3g_texto", null);
                                var DetalleCierre =  JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_motivo", null);

                                if (!MotivoCierre || !DetalleCierre || MotivoCierre == "" || DetalleCierre == ""){
                                    _validado = false;
                                    _mensajeErrorValidacion = "Para cerrar el caso debe completar el campo Motivo Cierre y Detalle de Cierre.";
                                    break;
                                }

                            
                                // Evalúa el motivo de cierre
                                if (MotivoCierre == "Cliente Desiste" || MotivoCierre == "Banco Desiste")
                                {
                                    // si el caso principal está finalizado entonces no permite seleccionar la opción de Cliente Desiste.

                                    var oCasoPrincipal = AccionValidator.getCaso(CasoPrincipal[0].id);
                                    var statecodeCasoPrincipal = oCasoPrincipal.value[0]["statecode"];
                                    
                                    if (statecodeCasoPrincipal != 0) // 0: Activo
                                    {
                                        var StrStateCode = "Cancelado";
                                        if(statecodeCasoPrincipal==1)
                                            StrStateCode = "Resuelto";
                                        
                                        _validado = false;
                                        _mensajeErrorValidacion = "El Caso Principal está " + StrStateCode + ", no puede seleccionar esta opción.";
                                        break;
                                    }
                                    
                                    // Además valida que el Caso Principal en la Etapa Actual tenga configurado el Botón Cliente Desiste.
                                    var accionEtapaIdCasoPrincipal = AccionValidator.getAccionEtapaClienteDesiste(oCasoPrincipal.value[0]._xmsbs_etapa_value);
                                    if (!accionEtapaIdCasoPrincipal || accionEtapaIdCasoPrincipal.value.length == 0){
                                        _validado = false;
                                        _mensajeErrorValidacion = "El Caso Principal no tiene configurado Cliente Desiste en la Etapa Actual.";
                                        break;
                                    }
                                }
                                else if (MotivoCierre == "Conciliación")
                                {
                                    // valida que el "Monto de Pago por Conciliación" (xmsbs_divisa1gen) contenga datos.
                                    var MontoConciliacion = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_divisa1gen", null);
                                    if (!MontoConciliacion || MontoConciliacion == 0)
                                    {
                                        _validado = false;
                                        _mensajeErrorValidacion = "Debe Ingresar el Monto de Pago por Conciliación.";
                                        break;
                                    }
                                }
                            }
                            else{
                                // Se ejecuta la función de validación desde un Caso Principal (FRAUDE)

                                // valida que haya seleccionado la opción Cliente Desiste en el campo: xmsbs_picklist3g
                                var AnalisisFraude = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist3g_texto", null);

                                debugger;
                                var flujosantander = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_flujosantander", null);
                                if (flujosantander[0].id.toLowerCase().replace(/[{}]/g, "") == "da8ec7a5-b882-f011-b4cc-6045bd39511e"){
                                    AnalisisFraude = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_picklist7g_texto", null);
                                }

                                if (!AnalisisFraude || AnalisisFraude == "" || AnalisisFraude != "Cliente Desiste"){
                                    _validado = false;
                                    _mensajeErrorValidacion = "Para aplicar Cliente Desiste debe seleccionar 'Cliente Desiste' en el campo: Análisis de Fraude.";
                                    break;
                                }
                            }

                            _validado = true;
                            _mensajeErrorValidacion = "";
                            break;                              
                        }
                        else
                        {
                            if (_tipoCampoValor === AccionValidator.TipoCampo.Busqueda) {  
                                let _lookUpId = JumpStartLibXRM.Fx.getLookupValueId(_formContext, _campo);
                                if(_lookUpId)
                                {
                                    _campoValor = JumpStartLibXRM.Fx.getLookupValueName(_formContext, _campo, null); 
                                    
                                    if(_campoValor == null)
                                    {
                                       _campoValor = _lookUpId;
                                    }  
                                }               
                            }
                            else {
                                _campoValor = JumpStartLibXRM.Fx.getValueField(_formContext, _campo, null);
                            }						
                        }						
                        
                        //debugger;
                        if (_campoValor != null && _campoValor != undefined) 
                        {
                            if(!_campo.includes("FNC"))
                                _campoValido = AccionValidator.validateReglaVariable(_reglaValor, _campoValor, _valorValidacion, _tipoCampoValor);
    
                            if (!_condicionSiguiente && _campoValido) {
                                //CondicionSiguiente igual false "AND/Y" y Campo Validado
                                _validado = _campoValido;
                            }
                            else if (!_condicionSiguiente && !_campoValido) {
                                //CondicionSiguiente igual false "AND/Y" y Campo No Validado
                                _validado = _campoValido;
                                _mensajeErrorValidacion = _mensajeError;
                                break;   
                            }
                            else if (_condicionSiguiente && _campoValido) {
                                //CondicionSiguiente igual true "OR/O" y Campo Validado
                                _validado = _campoValido;
                            }
                            else if (_condicionSiguiente && !_campoValido) {
                                //CondicionSiguiente igual true "OR/O" y Campo No Validado
                                _mensajeErrorValidacion = _mensajeError;
                                if (_ultimaValidacion && !_validado) {
                                    _validado = false;
                                    break;
                                }
                                else
                                {
                                    _validado = _campoValido;
                                }
                            }
    
                            _condicionPrevia = _condicionSiguiente;
                        }
                        else 
                        {
                            var _condicionPreviaBackUp = _condicionPrevia;
                            _condicionPrevia = _condicionSiguiente;
                            _mensajeErrorValidacion = _mensajeError;
                            let _validadoPrevio = _validado;
                            
                            if (_reglaValor === 4) 
                            {
                                _validado = true;                            
                            }
                            else if (_reglaValor === 3) 
                            {
                                _validado = false;                                                       
                                
                                if(!_condicionSiguiente)//CondicionSiguiente igual false "AND/Y"
                                {
                                    if(_condicionPreviaBackUp) //CondicionPrevia igual true "OR/O"
                                    {
                                        if(_ultimaValidacion && _validadoPrevio)
                                        {
                                            _validado = true;
                                        }
                                    }
                                    else
                                    {
                                        _mensajeErrorValidacion = _mensajeError;
                                        break;
                                    }
                                }
                                else if(_condicionSiguiente)//CondicionSiguiente igual true "OR/O"
                                {
                                    if(_validadoPrevio)
                                    {
                                        _validado = true;
                                    }
                                }
                            }
                            else 
                            {
                                if(!_condicionSiguiente)
                                {
                                    _validado = false;
                                    break;
                                }
                                else if(_condicionPreviaBackUp) //CondicionPrevia igual true "OR/O"
                                {
                                    if(!_ultimaValidacion && _validadoPrevio)
                                    {
                                        _validado = true;
                                    }
                                    else
                                    {
                                        _validado = false;
                                    }
                                }
                            }
                        }
                    }
                    else 
                    {
                        _message = accionEtapa.nombre + " validacion: " + accionEtapa.listValidacion[i].nombre + " no cuenta con campo y/o valor.";
                    }
                }
            }
            else 
            {
                _validado = true;
            }
        }




      

        if(!_validado)
        {
            if(_mensajeErrorValidacion)
            {
                _message = _mensajeErrorValidacion;
            }
            else
            {
                if(_mensajeValidacion)
                {
                    _message= _mensajeValidacion;
                }
                else
                {
                    _message='Error de validación, verifique los datos obligatorios';
                }
            }
        }
                
        var ObjReturn = {}
        ObjReturn['success'] = _validado;        
        ObjReturn['message'] = _message;
        //debugger;

        return ObjReturn;
    },

    validateReglaVariable: function (reglaValor, campoValor, valorValidacion, tipoCampoValor)
    {
        let _validado = false;
        campoValor = campoValor.toString().toLowerCase();
        switch (reglaValor)
        {
            case AccionValidator.TipoRegla.EsIgualA:
                if (campoValor === valorValidacion) {
                    _validado = true;
                }
                break;
            case AccionValidator.TipoRegla.NoEsIgualA:
                if (campoValor !== valorValidacion) {
                    _validado = true;
                }
                break;
            case AccionValidator.TipoRegla.ContieneDatos:
                if (campoValor !== null) {
                    _validado = true;
                }
                break;
            case AccionValidator.TipoRegla.NoContieneDatos:
                if (campoValor === null) {
                    _validado = true;
                }
                break;
            case AccionValidator.TipoRegla.Contiene:
                if (campoValor.includes(valorValidacion)) {
                    _validado = true;
                }
                break;
            case AccionValidator.TipoRegla.NoContiene:
                if (!campoValor.includes(valorValidacion)) {
                    _validado = true;
                }
                break;
            case AccionValidator.TipoRegla.EmpiezaPor:
                if (campoValor.startsWith(valorValidacion)) {
                    _validado = true;
                }
                break;
            case AccionValidator.TipoRegla.NoEmpiezaPor:
                if (!campoValor.startsWith(valorValidacion)) {
                    _validado = true;
                }
                break;
            case AccionValidator.TipoRegla.TerminaCon:
                if (campoValor.endsWith(valorValidacion)) {
                    _validado = true;
                }
                break;
            case AccionValidator.TipoRegla.NoTerminaCon:
                if (!campoValor.endsWith(valorValidacion)) {
                    _validado = true;
                }
                break;
            case AccionValidator.TipoRegla.MayorA:
                if (tipoCampoValor === AccionValidator.TipoCampo.Fecha) {
                    let arrayCampoValor= campoValor.split("/");
                    let dtCampoValor = new Date(parseInt(arrayCampoValor[2], 10),
                        parseInt(arrayCampoValor[1], 10) - 1,
                        parseInt(arrayCampoValor[0], 10));

                    let arrayValorValidacion = valorValidacion.split("/");
                    let dtValorValidacion = new Date(parseInt(arrayValorValidacion[2], 10),
                        parseInt(arrayValorValidacion[1], 10) - 1,
                        parseInt(arrayValorValidacion[0], 10));

                    if (dtCampoValor > dtValorValidacion) {
                        _validado = true;
                    }

                }
                else if (tipoCampoValor === AccionValidator.TipoCampo.Numero){
                    if (parseInt(campoValor) > parseInt(valorValidacion)) {
                        _validado = true;
                    }
                }
                break;
            case AccionValidator.TipoRegla.MenorA:
                if (tipoCampoValor === AccionValidator.TipoCampo.Fecha) {
                    let arrayCampoValor = campoValor.split("/");
                    let dtCampoValor = new Date(parseInt(arrayCampoValor[2], 10),
                        parseInt(arrayCampoValor[1], 10) - 1,
                        parseInt(arrayCampoValor[0], 10));

                    let arrayValorValidacion = valorValidacion.split("/");
                    let dtValorValidacion = new Date(parseInt(arrayValorValidacion[2], 10),
                        parseInt(arrayValorValidacion[1], 10) - 1,
                        parseInt(arrayValorValidacion[0], 10));

                    if (dtCampoValor < dtValorValidacion) {
                        _validado = true;
                    }

                }
                else if (tipoCampoValor === AccionValidator.TipoCampo.Numero) {
                    if (parseInt(campoValor) < parseInt(valorValidacion)) {
                        _validado = true;
                    }
                }
                break;
            case AccionValidator.TipoRegla.MayorOIgualA:
                if (tipoCampoValor === AccionValidator.TipoCampo.Fecha) {
                    let arrayCampoValor = campoValor.split("/");
                    let dtCampoValor = new Date(parseInt(arrayCampoValor[2], 10),
                        parseInt(arrayCampoValor[1], 10) - 1,
                        parseInt(arrayCampoValor[0], 10));

                    let arrayValorValidacion = valorValidacion.split("/");
                    let dtValorValidacion = new Date(parseInt(arrayValorValidacion[2], 10),
                        parseInt(arrayValorValidacion[1], 10) - 1,
                        parseInt(arrayValorValidacion[0], 10));

                    if (dtCampoValor >= dtValorValidacion) {
                        _validado = true;
                    }

                }
                else if (tipoCampoValor === AccionValidator.TipoCampo.Numero) {
                    if (parseInt(campoValor) >= parseInt(valorValidacion)) {
                        _validado = true;
                    }
                }
                break;
            case AccionValidator.TipoRegla.MenorOIgualA:
                if (tipoCampoValor === AccionValidator.TipoCampo.Fecha) {
                    let arrayCampoValor = campoValor.split("/");
                    let dtCampoValor = new Date(parseInt(arrayCampoValor[2], 10),
                        parseInt(arrayCampoValor[1], 10) - 1,
                        parseInt(arrayCampoValor[0], 10));

                    let arrayValorValidacion = valorValidacion.split("/");
                    let dtValorValidacion = new Date(parseInt(arrayValorValidacion[2], 10),
                        parseInt(arrayValorValidacion[1], 10) - 1,
                        parseInt(arrayValorValidacion[0], 10));

                    if (dtCampoValor <= dtValorValidacion) {
                        _validado = true;
                    }

                }
                else if (tipoCampoValor === AccionValidator.TipoCampo.Numero) {
                    if (parseInt(campoValor) <= parseInt(valorValidacion)) {
                        _validado = true;
                    }
                }
                break;
        }

        return _validado;
    },
    
    validateDocumentos: function (documentosCaso, formContext) {
        //debugger;
        if (!documentosCaso || documentosCaso.length === 0) {
            var ObjReturn = {}
            ObjReturn['success'] = true;
            ObjReturn['message'] = 'Ok';

            return ObjReturn;
        }
        else {
            var ObjReturn = { 'success' : true, 'message' : '' };
            let obligatoriosFaltantes = documentosCaso.filter(x => x.xmsbs_obligatoriedad == true && !x.xmsbs_id && x.xmsbs_TipoDocumento.xmsbs_codigo != "TD-298");
            if (obligatoriosFaltantes.length > 0) {
                ObjReturn['success'] = false;
                ObjReturn['message'] = 'Existen documentos obligatorios que no se han adjuntado al caso, no se puede continuar';
            }
            else {
                let existeAdjuntoCliente = documentosCaso.filter(x => x.xmsbs_TipoDocumento.xmsbs_codigo == "TD-298");
                if(existeAdjuntoCliente.length > 0){
                    //Si existe un documento de respuesta a cliente y es 1 solo.
                    let esObligatorio = existeAdjuntoCliente[0].xmsbs_obligatoriedad;
                    let seSubio = existeAdjuntoCliente[0].xmsbs_id;
                    let tipoResolucionCaso = JumpStartLibXRM.Fx.getValueField(formContext, "xmsbs_tipoderespuesta", null);
                    
                    if(seSubio || tipoResolucionCaso == 2){
                        ObjReturn['success'] = true;
                        ObjReturn['message'] = 'Ok';
                    }
                    else{
                        if(!esObligatorio){
                            ObjReturn['success'] = true;
                            ObjReturn['message'] = 'Ok';
                        }
                        else{
                            ObjReturn['success'] = false;
                            ObjReturn['message'] = 'Existen documentos obligatorios que no se han adjuntado al caso, no se puede continuar';
                        }
                    }
                }
                else{
                    ObjReturn['success'] = true;
                    ObjReturn['message'] = 'Ok';
                }
            }
            

            return ObjReturn;
        }
    }, 

	buscarRegistrosGrilla: function (idIncident, relatedEntityLogicalName) {
		let executionContext = window._executionContext;
		if (executionContext != null)
		{
			if(relatedEntityLogicalName == null || relatedEntityLogicalName=="")
				relatedEntityLogicalName="xmsbs_grillacaso";
			
			// Devuelve solo 1 registro, con eso basta para determinar si existen registros ingresados en la grilla.
			let entityType = relatedEntityLogicalName; //"xmsbs_grillacaso";
			let query = "$select=" + relatedEntityLogicalName + "id";
			query += "&$filter=_xmsbs_caso_value eq '" + idIncident + "' and statecode eq 0&$top=1";
			let resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () { });
			return resultado;			
		}
		return null;
	}, 
	
	buscarRegistrosGrillaMovimientos: function (idIncident) {
		let executionContext = window._executionContext;
		if (executionContext != null)
		{
			// Devuelve solo 1 registro, con eso basta para determinar si existen registros ingresados en la grilla.
			let entityType = "xmsbs_movimiento";
			let query = "$select=xmsbs_movimientoid";
			query += "&$filter=(xmsbs_borrador ne true) and (_xmsbs_caso_value eq '" + idIncident + "') and statecode eq 0&$top=1";
			let resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () { });
			return resultado;			
		}
		return null;
	},

	getCaso: function (idIncident) {
		let executionContext = window._executionContext;
		if (executionContext != null)
		{
			let entityType = "incident";
			let query = "$select=incidentid,statecode,statuscode,_xmsbs_etapa_value";
			query += "&$filter=(incidentid eq '" + idIncident.replace(/[{}]/g, "") + "')";
            
            var adminId = JumpStartLibXRM.Fx.getUserAdminID();
			let resultado = SDK.WEBAPI.retrieveMultipleRecordsImpersonate(executionContext, entityType, query, adminId);
			return resultado;
		}
		return null;
	},
    
    getAccionEtapaClienteDesiste: function(etapaId){
		let executionContext = window._executionContext;
		if (executionContext != null)
		{
            let entityType = "xmsbs_accionetapa";
            let query = "$select=xmsbs_accionetapaid,xmsbs_codigo,_xmsbs_accion_value,xmsbs_name";
            query += "&$expand=xmsbs_accion($select=xmsbs_codigo)";
            query += "&$filter=(_xmsbs_etapa_value eq '" + etapaId.replace(/[{}]/g, "") + "') and (xmsbs_accion/xmsbs_codigo eq 'ACC0032')";
            let resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () { });
            return resultado;
        }
        return null;
    },    
    
	buscarSubRequerimientos: function (idIncident) {
		let executionContext = window._executionContext;
		if (executionContext != null)
		{
			// Devuelve solo 1 registro, con eso basta para determinar si existen registros de subrequerimientos
			let entityType = "incident";
			let query = "$select=incidentid,xmsbs_numerocorrelativo,_xmsbs_etapa_value";
			query += "&$filter=(_parentcaseid_value eq '" + idIncident + "')&$top=1";

            var adminId = JumpStartLibXRM.Fx.getUserAdminID();
			let resultado = SDK.WEBAPI.retrieveMultipleRecordsImpersonate(executionContext, entityType, query, adminId);
			return resultado;			
		}
		return null;
	},

	buscarRegistrosGrillaPolizas: function (idIncident) {
		let executionContext = window._executionContext;
		if (executionContext != null)
		{
			// Devuelve solo 1 registro, con eso basta para determinar si existen registros ingresados en la grilla.
			let entityType = "xmsbs_poliza";
			let query = "$select=xmsbs_polizaid";
			query += "&$filter=(xmsbs_borrador ne true) and (_xmsbs_caso_value eq '" + idIncident + "') and statecode eq 0&$top=1";
			let resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () { });
			return resultado;			
		}
		return null;
	},
    buscarRegistrosDocumentosCasoPendientes: function (idIncident) {
		let executionContext = window._executionContext;
		if (executionContext != null)
		{
			// Devuelve todos los documentos del caso en estado pediente. Si hay mas de uno, ya no cumple
			let entityType = "xmsbs_documentos";
			let query = "$select=xmsbs_documentoid";
			query += "&$filter=(_xmsbs_caso_value eq '" + idIncident + "') and statuscode eq 657130000";
			let resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () { });
			return resultado;			
		}
		return null;
	},
	buscarSubRequerimientosVigentes: function (idIncident) {
		let executionContext = window._executionContext;
		if (executionContext != null)
		{
			// Devuelve solo 1 registro, con eso basta para determinar si existen SubRequerimientos Pendientes
			let entityType = "incidents";
			let query = "$select=incidentid,xmsbs_numerocorrelativo";
			query += "&$filter=(_parentcaseid_value eq '" + idIncident.replace(/[{}]/g, "") + "') and statecode eq 0&$top=1";
			let resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () { });
			return resultado;			
		}
		return null;
	},	
    buscarEstadoQuebranto: function (idQuebranto) {
        let executionContext = window._executionContext;
        if (executionContext != null)
        {
            //Preparamos la consulta
            var entityType = "xmsbs_reversocastigo";
            var entityId = idQuebranto;
            var query = "statuscode,xmsbs_repararejecutivo";
            var expand = ""
            //realizamos la consulta
            var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, expand);
            return resultado;		
        }
        return null;
    },
    buscarDocumentoRespuestaCliente: function (incidentId){
        let executionContext = window._executionContext;
        if (executionContext != null)
        {
            let entityType = "xmsbs_documentos";
            let query = "$select=xmsbs_documentoid,_xmsbs_caso_value,xmsbs_id,statuscode&$expand=xmsbs_TipoDocumento($select=xmsbs_name,xmsbs_codigo)";
            query += "&$filter=(_xmsbs_caso_value eq "+incidentId+")&$orderby=_xmsbs_caso_value asc";
            let resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () { });
            return resultado;
        }
        return null;
	},
    buscarCarteraComercio: function (comercioId){
        debugger;
        var executionContext = window._executionContext;
		if (executionContext != null)
		{
			// Devuelve solo 1 registro, con eso basta para determinar si existen registros ingresados en la grilla.
			var entityType = "account";
			var query = "$select=accountid,xmsbs_tieneejecutivodecartera";
			query += "&$filter=(accountid eq " + comercioId.replace(/[{}]/g, "") + " and statecode eq 0)";
			var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () { });
			return resultado;			
		}
		return null;
    },
	validateAccion2: function (accionEtapa, formContext, ReglaValidacion) {
		//debugger;
        _formContext = formContext;
		
        if(!accionEtapa.listValidacion)
            return { success: true, message: "Ok" };
		if(accionEtapa.listValidacion.length == 0)
			return { success: true, message: "Ok" };
		
		let _mensajeErrorValidacion = "";
		let _validado = false;
		
		//-----------
		// Itera sobre cada validación de campo y obtiene el estado resultado de forma unitaria.
		
		var LstValidacionCampo = [];
		for (var i = 0; i < accionEtapa.listValidacion.length; i++) 
		{
			//default
			_validado = false;   
			
			if (accionEtapa.listValidacion[i].campo) 
			{
				let _orden = accionEtapa.listValidacion[i].orden;
				let _campo = accionEtapa.listValidacion[i].campo;
				let _mensajeError = accionEtapa.listValidacion[i].mensajeError;
				let _reglaValor = accionEtapa.listValidacion[i].reglaValor;
				let _valorValidacion = accionEtapa.listValidacion[i].valor.toString().toLowerCase();
				let _tipoCampoValor = accionEtapa.listValidacion[i].tipoCampoValor;
				
				let _campoValor;				
				if (_tipoCampoValor === AccionValidator.TipoCampo.Busqueda) {  
					let _lookUpId = JumpStartLibXRM.Fx.getLookupValueId(_formContext, _campo);
					if(_lookUpId){
						_campoValor = JumpStartLibXRM.Fx.getLookupValueName(_formContext, _campo, null); 
						if(_campoValor == null){
						   _campoValor = _lookUpId;
						}  
					}
				}
				else {
					_campoValor = JumpStartLibXRM.Fx.getValueField(_formContext, _campo, null);
				}

				//debugger;
				if (_campoValor != null && _campoValor != undefined) {
					_validado = AccionValidator.validateReglaVariable(_reglaValor, _campoValor, _valorValidacion, _tipoCampoValor);
				}
				else {
					// no contiene o no encuentra el valor
					if (_reglaValor === AccionValidator.TipoRegla.NoContieneDatos){
						_validado = true;                            
					}
				}
				
				LstValidacionCampo.push({ Orden:_orden, Campo:_campo, CampoValido:_validado });
				if (_mensajeError != undefined && _mensajeError != "")
					_mensajeErrorValidacion += "- " + _mensajeError + "\n";
			}
		}
	
	
		// una vez que obtiene un estado de validación para todos los elementos, aplica el Filtro de Validación
		var Resultado = AccionValidator.ValidarExpresion(ReglaValidacion, LstValidacionCampo);
		
		if (Resultado.success === false)
		{
			Resultado.details = _mensajeErrorValidacion;
		}
		
		return Resultado;
	},
	
	ValidarExpresion: function(ReglaValidacion, LstValidacionCampo)
    {
        //return { success: false, message: "La validación no cumple con la estructura." };

		//debugger;
      	if (!AccionValidator.ValidacionBasica(ReglaValidacion))
        {
        	AccionValidator.setTrace("No cumple con la estructura");
            return { success: false, message: "La validación no cumple con la estructura.", details:"" };
        }
        
        let Operador = ReglaValidacion.substr(0, 1);
        let Expresion = ReglaValidacion.substr(2, ReglaValidacion.length - 3);
        
        let ResultadoValidacion = false;
        try
        {
        	ResultadoValidacion = AccionValidator.ValidaExpresion(LstValidacionCampo, Operador, Expresion, 1);
			
			if (ResultadoValidacion)
				return { success: true, message: "OK" };
			else
				return { success: false, message: "El caso no cumple las condiciones para realizar la acción.", details:"" };
        }
        catch(ex)
        {
			AccionValidator.setTrace("Error al realizar la validación. Detalle " + ex);
        	return { success: false, message: "Error al realizar la validación.", details:"" };
        }
    },
    ValidacionBasica: function(Expresion)
    {
    	let Operador = Expresion.substr(0, 1);
        if (Operador != "Y" && Operador != "O")
        	return false;
        if (Expresion.substr(1,1) != "(")
        	return false;
        if (Expresion.substr(Expresion.length - 1, 1) != ")")
        	return false;
        
		// la cantidad de paréntesis de apertura, debe ser la misma que los paréntesis de cierre.
		let CantApertura = 0;
		let CantCierre = 0;
		for (var i = 0; i < Expresion.length; i++)
		{
			if (Expresion.substr(i, 1) == "(")
				CantApertura = CantApertura + 1;
			if (Expresion.substr(i, 1) == ")")
				CantCierre = CantCierre + 1;
		}
		if (CantApertura != CantCierre)
			return false;
		
       	return true;
    },
    ValidaExpresion: function(LstValidacionCampo, Operador, Expresion, Nivel)
    {
		AccionValidator.setTrace("Nivel: " + Nivel);
		
    	let Resultado = false;
		
		AccionValidator.setTrace("Expresion: " + Expresion + " (preValidacion)");
		if (Expresion.includes("Y") || Expresion.includes("O"))
		{
			let LstExpresionesNivel = [];
			
			var ExpresionNivel = "";
			
			AccionValidator.setTrace("Itera Expresion: " + Expresion);
			for (var i = 0; i < Expresion.length; i++)
			{
				let Caracter = Expresion.substr(i, 1);
				if (Caracter != "X")
				{
					if (Caracter == "Y" || Caracter == "O")
					{
						Caracter = Expresion.substr(i + 2, 1);
						if (Caracter == "Y" || Caracter == "O")
						{
							// recorre hasta encontrar ))... y con eso completa la expresion.
							ExpresionNivel = Expresion.substr(0, Expresion.indexOf("))") + 2);
						}
						else
						{
							ExpresionNivel = Expresion.substr(0, Expresion.indexOf(")") + 1);
						}
						ExpresionNivel = ExpresionNivel.split("X").join("");
						LstExpresionesNivel.push(ExpresionNivel);	
						Expresion = Expresion.replace(ExpresionNivel, "".padStart(ExpresionNivel.length, "X"));
						
						AccionValidator.setTrace("Expresion Nivel: " + ExpresionNivel);
                        AccionValidator.setTrace("Expresion: " + Expresion + " (postvalidacion)");
					}
					else
					{
						AccionValidator.setTrace("Agrega Expresion: " + Expresion);
						LstExpresionesNivel.push(ExpresionNivel);
						break;
					}
				}
			}
			
			//----------------------------------
			AccionValidator.setTrace("Operador: " + Operador);
			try
			{
				if (Operador == "Y")
				{
					for(var j = 0; j < LstExpresionesNivel.length; j++)
					{
						let Exp = LstExpresionesNivel[j];
						let Operador2 = Exp.substr(0, 1);
						let Expresion2 = Exp.substr(2, Exp.length - 3);
						Resultado = AccionValidator.ValidaExpresion(LstValidacionCampo, Operador2, Expresion2, Nivel + 1);
						if (!Resultado)
							throw new TypeError();
					}
				}
				else
				{
					for(var j = 0; j < LstExpresionesNivel.length; j++)
					{
						let Exp = LstExpresionesNivel[j];
						let Operador2 = Exp.substr(0, 1);
						let Expresion2 = Exp.substr(2, Exp.length - 3);
						Resultado = AccionValidator.ValidaExpresion(LstValidacionCampo, Operador2, Expresion2, Nivel + 1);
						if (Resultado)
							throw new TypeError();
					}
				}
			}
			catch(ex)
			{
				// ---- 
			}
			AccionValidator.setTrace("Resultado: " + Resultado);
		}
		else
		{
			AccionValidator.setTrace("Valida Campo Nivel: " + Nivel + " - Operador: " + Operador + " - Expresion: " + Expresion);
			if (Operador == "Y")
			{
				Resultado = true;
				try
				{				
					// basta con que 1 sea falso, y retorna FALSE
					Expresion.split(",").forEach(Orden => {

						try
						{
							for (var j = 0; j < LstValidacionCampo.length; j++)
							{
								var oVal = LstValidacionCampo[j];
								if (oVal.Orden == Orden)
								{
									Resultado = oVal.CampoValido;
									throw new TypeError();
								}
							}
						}
						catch(ex)
						{
							// ---- 
						}
						if (!Resultado)
						{
							throw new TypeError();
						}
					});
				}
				catch(ex)
				{
					// ---- 
				}					
			}
			else
			{
				Resultado = false;
				
				try
				{				
					// basta con que 1 sea verdadero, y restorna TRUE
					Expresion.split(",").forEach(Orden => {

						try
						{
							for (var j = 0; j < LstValidacionCampo.length; j++)
							{
								var oVal = LstValidacionCampo[j];
								if (oVal.Orden == Orden)
								{
									Resultado = oVal.CampoValido;
									throw new TypeError();
								}
							}						
						}
						catch(ex)
						{
							// ---- 
						}	

						if (Resultado)
						{
							throw new TypeError();
						}
					});				
				}
				catch(ex)
				{
					// ---- 
				}				
			}
			AccionValidator.setTrace("Resultado Validacion Campo: " + Resultado);
		}

		AccionValidator.setTrace("Fin Nivel: " + Nivel + "---------------------------------");
    	return Resultado;
    },
	setTrace: function(MsgTrace)
	{
		 //console.log(MsgTrace);
	},
    validateSeccionObligaoria: function (formContext) {
        var ObjReturn = { 'success' : true, 'message' : '' };
        
        let marcareiterado = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_marcareiterado", null);
        if (marcareiterado)
            return ObjReturn;
        
        _idEtapa = JumpStartLibXRM.Fx.getValueField(_formContext, "xmsbs_etapa", null);
        if(_idEtapa != null){
        _seccionObligatoria = AccionValidator.buscarSeccionesObligatorias(_idEtapa[0].id);
        
            if(_seccionObligatoria.value.length > 0){
                var _idIncident = formContext.data.entity.getId();
                _grillaCaso = AccionValidator.buscarRegistrosGrilla(_idIncident);
                
                if(_grillaCaso.value.length > 0){
                    ObjReturn['success'] = true;
                    ObjReturn['message'] = 'Ok';
                }
                else
                {
                
                    ObjReturn['success'] = false;
                    ObjReturn['message'] = 'Existe información obligatoria que no se ha adjuntado al caso en la grilla "' + _seccionObligatoria.value[0].xmsbs_etiqueta + '", no se puede continuar';
            
                }
            }
                return ObjReturn;
        }

    },
    buscarSeccionesObligatorias: function (idEtapa){
        let executionContext = window._executionContext;
		if (executionContext != null)
		{
            let entityType = "xmsbs_seccions";
			let query = "?$select=xmsbs_etiqueta&$filter=(xmsbs_obligatorio eq true"; 
            query += " and _xmsbs_etapa_value eq " + idEtapa; 
            query += " and xmsbs_name eq 'general_section_Grilla1Caso'";
            query += " and statuscode eq 1)";
            
			let resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () { });
			return resultado;
            }
    },
    buscarDetalleOperacion: function(executionContext, detalleOperacionID){
		var entityType = "xmsbs_detalleoperacion";
		var entityId = detalleOperacionID.replace(/[{}]/g, "");
		var query = "xmsbs_tiporeclamo,xmsbs_quebranto,xmsbs_idstockadquirencia,xmsbs_campocantidadsolicitada";
        var resultado = SDK.WEBAPI.retrieveRecord(executionContext, entityId, entityType, query, null);
		return resultado;
    },
	oDataGetStockActual: function(executionContext, idStock){
		// idStock = Código Stock
		var entityType = "xmsbs_stockadquirencias";
        var query = "$select=xmsbs_stockadquirenciaid, xmsbs_name, xmsbs_cantidad";
        query += "&$filter=(xmsbs_idstock eq '" + idStock + "')";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () {});
        return resultado;
	},
    buscarUsuarioAdministrador: function (executionContext){
        var entityType = "systemuser";
        var query = "$select=fullname";
        query += "&$filter=fullname eq 'Dynamics_CRM_MIDAS_CL_DEV'";
        var resultado = SDK.WEBAPI.retrieveMultipleRecords(executionContext, entityType, query, null, null, function () {});
        return resultado;
    }	
}