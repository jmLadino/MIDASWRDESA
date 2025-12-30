if (typeof (JumpStartLibXRM) == "undefined") {
    JumpStartLibXRM = {
        __namespace: true
    };
}
JumpStartLibXRM.FormState = {
    CREATE: 1,
    UPDATE: 2,
    READ_ONLY: 3,
    DISABLED: 4,
    QUICK_CREATE: 5,
    BULK_EDIT: 6,
    READ_OPTIMIZED: 11
};
JumpStartLibXRM.Fx = {
    // init
    _emptyGuid: "00000000-0000-0000-0000-000000000000",
	// Se define función para hacer distinción entre la llamada desde el form y desde el Ribbon.
	// JumpStartLibXRM.Fx.getFormContext
	getFormContext: function (executionContext) {
		var formContext = null;
		if (executionContext == null)
			return null;
        if(executionContext.getFormContext != null)
            formContext = executionContext.getFormContext();    
        else
            if(executionContext.ui != null)
				formContext = executionContext;
		
		return formContext;
	},	
    getEnvironmentName: function(){
        var url = Xrm.Utility.getGlobalContext().getClientUrl().toLowerCase();

        if(url.includes("midaschiledesa")) 
            return "DESA";
        if(url.includes("midaschilehomologacion")) 
            return "HOMO";
        if(url.includes("midaschilepro")) 
            return "PROD";
    },
    getUserAdminID: function(){
        var Ambiente = JumpStartLibXRM.Fx.getEnvironmentName();
        if(Ambiente == "DESA")
            return "d43af6f7-e875-eb11-a812-000d3ab23035"; // (DESA) Dynamics_CRM_MIDAS_CL_DEV
        else
            return "a533cb3f-6583-eb11-a812-000d3abd3579"; // (HOMO y PROD) Dynamics_CRM_MIDAS_CL_DEV
    },
    // xrm get
    getField: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		
		var _return = null;	
        if (formContext.getAttribute(fieldName) && formContext.getAttribute(fieldName) != "undefined") 
		{
            _return = formContext.getAttribute(fieldName);
        }
        return _return;
    },
    parentGetField: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		
		var _return = null;
        if (formContext.getAttribute(fieldName) && formContext.getAttribute(fieldName) != "undefined")
		{
            _return = executionContext.getAttribute(fieldName);
        }
        return _return;
    },
    getValueField: function (executionContext, fieldName, defaultValue) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		
		var _return = defaultValue;
		if (formContext.getAttribute(fieldName) && formContext.getAttribute(fieldName) != "undefined") {
            _return = formContext.getAttribute(fieldName).getValue();
        }
        return _return;
    },
	getFieldValueAsText: function (executionContext, fieldName) {
		//debugger;
		var field = JumpStartLibXRM.Fx.getField(executionContext, fieldName);

		if (!field) {
			return "";
		}

		// por el momento, solo se realizan pruebas respecto a string, int y picklist
		// a medida se vaya requiriendo se deben validar los demás casos.
		switch (field.getAttributeType()) {
			case "string": 
				return field.getValue();
; 			
			case "optionset": 
				if (fieldName.includes("xmsbs_picklist")){
					// en vez del campo picklist, toma el campo de texto asociado al picklist genérico.
					return JumpStartLibXRM.Fx.getValueField(executionContext, fieldName + "_texto", "");
				}
		
				return field.getText(); 

			case "multioptionset": 
				var selectedOptions = field.getSelectedOption();
				if (selectedOptions) {
					return selectedOptions.map(option => option.text).join(", "); 
				}
				return "";

			case "boolean": 
				return field.getValue() ? "Sí" : "No"; 

			case "integer": 
				return field.getValue().toString(); 

			case "decimal": 
			case "double":  
				return field.getValue().toString(); 

			case "money": 
				var moneyValue = field.getValue();
				return moneyValue ? moneyValue.toString() : ""; 

			case "datetime": 
				var dateValue = field.getValue();
				return dateValue ? dateValue.toLocaleString() : ""; 

			case "lookup": 
				var lookupValue = field.getValue();
				if (lookupValue && lookupValue.length > 0) {
					return lookupValue[0].name; 
				}
				return "";

			default:
				return "Tipo de dato no manejado"; 
		}
	},
    parentGetValueField: function (executionContext, fieldName, defaultValue) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);

        var _return = defaultValue;
        if (formContext.getAttribute(fieldName) && formContext.getAttribute(fieldName) != "undefined") {
            _return = formContext.getAttribute(fieldName).getValue();
        }
        return _return;
    },
    getValueFieldWindowParent: function (executionContext, fieldName, defaultValue) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);

        var _return = defaultValue;
        try 
		{
            _return = window.parent.opener.formContext.getAttribute(fieldName).getValue();
        }
        catch (error) {
        }
        return _return;
    },
    getName: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getAttribute(fieldName)) 
		{
            return formContext.getAttribute(fieldName).getName();
        }
        else 
		{
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " no existe en formulario");
        }
    },
	
    getFormatDate: function (executionContext, fieldname) {
        var d = JumpStartLibXRM.Fx.getValueField(executionContext, fieldname, null);
        if (d != null) {
            var curr_date = d.getDate();
            var curr_month = d.getMonth();
            curr_month++; // getMonth() considers Jan month 0, need to add 1
            var curr_year = d.getFullYear();
            return curr_date + "-" + curr_month + "-" + curr_year;
        }
        else return null;
    },
	getDateNOW_ddmmaaaa_hhmmss: function(){

		const fecha = new Date();
   
		const dia = fecha.getDate().toString().padStart(2, '0');
		const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan en 0
		const anio = fecha.getFullYear();
	
		const horas = fecha.getHours().toString().padStart(2, '0');
		const minutos = fecha.getMinutes().toString().padStart(2, '0');
		const segundos = fecha.getSeconds().toString().padStart(2, '0');
   
		return `${dia}/${mes}/${anio} ${horas}:${minutos}:${segundos}`;
	},	
    getEntityName: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        return formContext.data.entity.getEntityName();
    },
    parentGetEntityName: function (executionContext) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        return formContext.data.entity.getEntityName();
    },
    getEntityId: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		if (formContext == null) return null;
        return formContext.data.entity.getId();
    },
    parentGetEntityId: function (executionContext){
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        return formContext.data.entity.getId();
    },
    getLookupValueId: function (executionContext, fieldName) {
        var _id = JumpStartLibXRM.Fx.getValueField(executionContext, fieldName, false);
        if (_id && _id != 'undefined' && _id[0].id && _id[0].id != 'undefined') {
            return _id[0].id;
        }
        else {
            return false;
        }
    },
    parentGetLookupValueId: function (executionContext, fieldName) {
        var _id = JumpStartLibXRM.Fx.parentGetValueField(executionContext, fieldName, false);
        if (_id && _id != 'undefined' && _id[0].id && _id[0].id != 'undefined') {
            return _id[0].id;
        }
        else {
            return false;
        }
    },
    getLookupValueIdWindowParent: function (executionContext, fieldName) {
        var _id = JumpStartLibXRM.Fx.getValueFieldWindowParent(executionContext, fieldName, null);
        if (_id && _id != 'undefined' && _id[0].id && _id[0].id != 'undefined') {
            return _id[0].id;
        }
        else {
            return false;
        }
    },
    getLookupValueName: function (executionContext, fieldName, defaultValue) {
        var _id = JumpStartLibXRM.Fx.getValueField(executionContext, fieldName, null);
        if (_id && _id != 'undefined' && _id[0].name && _id[0].name != 'undefined') {
            return _id[0].name;
        }
        else {
            return defaultValue;
        }
    },
    parentGetLookupValueName: function (executionContext, fieldName, defaultValue) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var _id = JumpStartLibXRM.Fx.parentGetValueField(executionContext, fieldName, false);
        if (_id && _id != 'undefined') {
            return formContext.getAttribute(fieldName).getValue()[0].name;
        }
        else {
            return defaultValue;
        }
    },
    getLookupValueNameWindowParent: function (executionContext, fieldName, defaultValue) {
        var _id = JumpStartLibXRM.Fx.getValueFieldWindowParent(executionContext, fieldName, null);
        if (_id && _id != 'undefined' && _id[0].name && _id[0].name != 'undefined') {
            return _id[0].name;
        }
        else {
            return defaultValue;
        }
    },
    getLookupValueEntityType: function (executionContext, fieldName) {
        var _id = JumpStartLibXRM.Fx.getValueField(executionContext, fieldName, null);
        if (_id && _id != 'undefined' && _id[0].entityType && _id[0].entityType != 'undefined') {
            return _id[0].entityType;
        }
        else {
            return false;
        }
    },
    parentGetLookupValueEntityType: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var _id = JumpStartLibXRM.Fx.parentGetValueField(executionContext, fieldName, null);
        if (_id && _id != 'undefined') {
            return formContext.getAttribute(fieldName).getValue()[0].entityType;
        }
        else {
            return false;
        }
    },
    getLookupValueEntityTypeWidowParent: function (executionContext, fieldName) {
        var _id = JumpStartLibXRM.Fx.getValueFieldWindowParent(executionContext, fieldName, false);
        if (_id && _id != 'undefined' && _id[0].entityType && _id[0].entityType != 'undefined') {
            return _id[0].entityType;
        }
        else {
            return false;
        }
    },
    getOptions: function (executionContext, fieldName) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		var _id = JumpStartLibXRM.Fx.getField(executionContext, fieldName);
		if (_id && _id != 'undefined')
		{			
			return formContext.getAttribute(fieldName).getOptions()
		}
		else
		{
			return null;			
		}		
    },
    getOptionSetName: function (executionContext, fieldName) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		var _id = JumpStartLibXRM.Fx.getField(executionContext, fieldName);
		if (_id && _id != 'undefined')
		{			
			return formContext.getAttribute(fieldName).getText()
		}
		else
		{
			return null;			
		}
    },
    getFormType: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		
        var _formType = formContext.ui.getFormType();
        if (_formType && _formType != 'undefined') {
            return _formType;
        }
        else {
            JumpStartLibXRM.Fx.showMessage("FormType no existe");
            return null;
        }
    },
    parentGetFormType: function (executionContext) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var _formType = formContext.ui.getFormType();
        if (_formType && _formType != 'undefined') {
            return _formType;
        }
        else {
            JumpStartLibXRM.Fx.showMessage("FormType no existe");
            return null;
        }
    },
    getFormName: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		var formItem = formContext.ui.formSelector.getCurrentItem();
        var formName = formItem.getLabel();
        return formName;
    },
    parentGetFormName: function (executionContext) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		var formItem = formContext.ui.formSelector.getCurrentItem();
        var formName = formItem.getLabel();
        return formName;
    },
    getControlName: function (executionContext, attLogicalName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		var Control = formContext.getControl(attLogicalName);
        var ControlName = Control.getLabel();
        return ControlName;
    },	
    getSaveMode: function (executionContext) {
        if (executionContext) {
            return executionContext.getEventArgs().getSaveMode();
        }
        else {
            return false;
        }
    },
    getClientUrl: function (executionContext) {
		var globalContext = Xrm.Utility.getGlobalContext();		
        var _return = null;
        if (globalContext != undefined && globalContext != null) {
            _return = globalContext.getClientUrl();
        }
        return _return;
    },
    itemsGet: function (executionContext) {
        try {
			var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
            var return_ = formContext.ui.formSelector.items.get();
        }
        catch (err) {
            return_ = false;
        }

        return return_;
    },
    getIsDirty: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getAttribute(fieldName)) {
            return formContext.getAttribute(fieldName).getIsDirty();
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " no existe en formulario");
        }
    },
    parentGetIsDirty: function (executionContext, fieldName) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getAttribute(fieldName)) {
            return formContext.getAttribute(fieldName).getIsDirty();
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " no existe en formulario");
        }
    },
    FormGetIsDirty: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		return formContext.data.entity.getIsDirty();
    },
    parentFormGetIsDirty: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        return formContext.data.entity.getIsDirty();
    },
    GetAllAttributes: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        return formContext.data.entity.attributes.get();
    },
    parentGetAllAttributes: function (executionContext) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        return formContext.data.entity.attributes.get();
    },
    GetServerUrl: function () {		
		var globalContext = Xrm.Utility.getGlobalContext();		
        var _return = null;
        if (globalContext != undefined && globalContext != null) {
            _return = globalContext.getClientUrl();;
        }
        return _return;
    },
    getInitialUrl: function (executionContext, arg) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(arg)) {
           return formContext.getControl(arg).getInitialUrl();;
        }
        else {
            JumpStartLibXRM.Fx.showMessage("srcIframe no existe");
        }
    },
    //xrm set
    setValueField: function (executionContext, fieldName, fieldValue) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var field = JumpStartLibXRM.Fx.getField(executionContext, fieldName);
        if (field && field != undefined) {
            var ValorActual = JumpStartLibXRM.Fx.getValueField(executionContext, fieldName, null);
            if(ValorActual != fieldValue){
                formContext.getAttribute(fieldName).setValue(fieldValue);
            }
        }
        else {
           //JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " no existe en formulario");
        } 
    },
    parentSetValueField: function (executionContext, fieldName, fieldValue) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var field = JumpStartLibXRM.Fx.getField(executionContext, fieldName);
        if (field && field != undefined) {
            formContext.getAttribute(fieldName).setValue(fieldValue);
        }
        else {
           JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " no existe en formulario");
        }
    },
    setLookupValue: function (executionContext, fieldName, id, name, entityType) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (fieldName != null) {
            var _setValue = false;
            var ValorActual = JumpStartLibXRM.Fx.getValueField(executionContext, fieldName, null);    
            
            if (ValorActual == null && id != null){
                _setValue = true;
            }else if (ValorActual != null && id == null){
                _setValue = true;
            }else if (ValorActual == null && id == null){
                _setValue = false;
            }else if (ValorActual[0].id.replace(/[{}]/g, "").toLowerCase() != id.replace(/[{}]/g, "").toLowerCase()){
                _setValue = true;
            }
            
            
            if (_setValue)
            {
                if( id != null ){
                    var lookupValue = new Array();
                    lookupValue[0] = new Object();
                    lookupValue[0].id = id;
                    lookupValue[0].name = name;
                    lookupValue[0].entityType = entityType;
                    formContext.getAttribute(fieldName).setValue(lookupValue);
                    //formContext.getAttribute(fieldName).setSubmitMode("always");
                }else{
                    formContext.getAttribute(fieldName).setValue(null);
                    //formContext.getAttribute(fieldName).setSubmitMode("always");
                }
            }
        }
    },
    setOptionSetField: function (executionContext, fieldName, fieldValue) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var _name = JumpStartLibXRM.Fx.getField(executionContext, fieldName);
        if (_name && _name != undefined) {
            formContext.getAttribute(fieldName).setValue(parseInt(fieldValue));
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " no existe en formulario");
        }
    },
    setSubmitModeField: function (executionContext, fieldName, submitMode) {
        if (fieldName && fieldName != '') {
            var _field = executionContext.getAttribute(fieldName);
            if (_field && _field != undefined) {
                executionContext.getAttribute(fieldName).setSubmitMode(submitMode);
            }
        }
    },
    setLabel: function (executionContext, fieldName, label) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		
        if (formContext.getControl(fieldName) && label) {
            formContext.getControl(fieldName).setLabel(label);
        }
        else {
            //debugger;
            JumpStartLibXRM.Fx.showMessage("No existe campo o label");
        }
    },
    setLabelSection: function (executionContext, tabName, sectionName, label){
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.ui.tabs.get(tabName).sections.get(sectionName)) {
            if (label) {
                formContext.ui.tabs.get(tabName).sections.get(sectionName).setLabel(label);
            }
            else {
                JumpStartLibXRM.Fx.showMessage("El label no tiene contenido");
            }
        }
        else {
            JumpStartLibXRM.Fx.showMessage("El tab o secci�n no existen");
        }
    },
    setFormDirty: function (executionContext, boolOption) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		//Posiblemente deprecado.
        try {
            formContext.data.setFormDirty(boolOption);
        }
        catch (err) {
        }
    },
    setFocus: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName)) {
            formContext.getControl(fieldName).setFocus();
        }
    },
    setFormNotification: function (executionContext, level, msje, id) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (level && msje && id) {
			formContext.ui.setFormNotification(msje, level, id);
        }
        else if (id == null || id == undefined) {
            formContext.ui.setFormNotification(msje, level, id);
        }
    },
    setNotification: function (executionContext, fieldName, msje, id) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName) && msje && id) {
			formContext.getControl(arg).setNotification(msje,id);
        }
        else {
            JumpStartLibXRM.Fx.showMessage("No existe campo, id o mensaje");
        }
    },//Set mensaje formulario
    // enable disable //
    getDisabled: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName)) {
			var disabled = formContext.getControl(fieldName).getDisabled();
            return disabled;
        }
        else {
            alert("El campo" + fieldName + "no existe");
        }
    },
    enableField: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.getControl(fieldName).setDisabled(false);
    },
    parentEnableField: function (executionContext, fieldName) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.getControl(fieldName).setDisabled(false);
    },
    disableField: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.getControl(fieldName).setDisabled(true);
    },
    enableOrDisableAllControlsInTab: function (executionContext, tabControlNo, boolDisable) {
        /// <summary>
        /// Disable all controls in a tab by tab number.
        /// </summary>
        /// <param name="tabControlNo" type="int">
        /// The number of the tab
        /// </param>
        /// <returns type="void" />
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var tabControl = formContext.ui.tabs.get(tabControlNo);
        if (tabControl != null) {
            formContext.ui.controls.forEach(

                function (control) {
                    if (control.getParent() !== null && control.getParent().getParent() != null && control.getParent().getParent() === tabControl && control.getControlType() !== "subgrid" && control.getControlType() !== "iframe") {
                        control.setDisabled(boolDisable);
                    }
                });
        }
    },
    enableOrdisableAllControlsInSection: function (executionContext, sectionLabel, boolDisable) {
        /// <summary>
        /// Disable all controls in a section by section label.
        /// </summary>
        /// <param name="sectionLabel" type="string">
        /// The label of the section
        /// </param>
        /// <returns type="void" />
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var tabs = formContext.ui.tabs;
        for (var i = 0, tablength = tabs.getLength(); i < tablength; i++) {
            var tab = tabs.get(i);
            var sections = tab.sections;
            for (var j = 0, sectionlength = sections.getLength(); j < sectionlength; j++) {
                var section = sections.get(j);
                if (section.getLabel().toLowerCase() === sectionLabel.toLowerCase()) {
                    formContext.ui.controls.forEach(

                       // function (executionContext, control) {
                        function (control) {
                            if (control.getParent() != "undefined" && control.getParent() !== null && control.getParent().getLabel() != "undefined" && control.getParent().getLabel() !== null && control.getParent().getLabel() === sectionLabel && control.getControlType() !== "subgrid" && control.getControlType() !== "iframe") {
                                control.setDisabled(boolDisable);
                            }
                        });
                    break;
                }
            }
        }
    },
    formEnableDisableAllControls: function (executionContext, disablestatus) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var allAttributes = formContext.data.entity.attributes.get();
        for (var i in allAttributes) {
            var myattribute = formContext.data.entity.attributes.get(allAttributes[i].getName());
            var myname = myattribute.getName();
            try {
                formContext.getControl(myname).setDisabled(disablestatus);
            }
            catch (err) {
                null;
            }
        }
    },
    enableDisableField: function (executionContext, fieldName, disablestatus) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		
        try {
            formContext.getControl(fieldName).setDisabled(disablestatus);
        }
        catch (err) { 
			// JM: En caso que ocurra error al deshabilitar un control, 
			// no debe implicar error por pantalla, ni ninguna acción secundaria.
			// por lo tanto, en este caso se justifica el catch "vacío".
		}
    },
    enableDisableSection: function (executionContext, p_tab, p_section, p_disablestatus) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var section = formContext.ui.tabs.get(p_tab).sections.get(p_section);
        var controls = section.controls.get();
        var controlsLenght = controls.length;
        for (var i = 0; i < controlsLenght; i++) {
            try {
                controls[i].setDisabled(p_disablestatus);
            }
            catch (err) {
                null;
            }
        }
    },
    parentEnableDisableSection: function (executionContext, p_tab, p_section, p_disablestatus) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var section = formContext.ui.tabs.get(p_tab).sections.get(p_section);
        var controls = section.controls.get();
        var controlsLenght = controls.length;
        for (var i = 0; i < controlsLenght; i++) {
            try {
                controls[i].setDisabled(p_disablestatus);
            }
            catch (err) {
                null;
            }
        }
    },
    formEnableDisableAllControlsField: function (executionContext, fieldName, disablestatus) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var allAttributes = formContext.data.entity.attributes.get();
        for (var i in allAttributes) {
            var myattribute = formContext.data.entity.attributes.get(allAttributes[i].getName());
            var myname = myattribute.getName();
            try {
                if (myname != fieldName) formContext.getControl(myname).setDisabled(disablestatus);
            }
            catch (err) {
                null;
            }
        }
    },
    disableFormFields: function (executionContext, disablestatus) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.ui.controls.forEach(function (executionContext, control, index) {
            if (JumpStartLibXRM.Fx.doesControlHaveAttribute(control)) {
                control.setDisabled(disablestatus);
            }
        });
    }, // FormEnableDisableAllControls
    disableForm: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        
        formContext.ui.controls.forEach(function (control) {
            try{
                if (JumpStartLibXRM.Fx.doesControlHaveAttribute(control)) {
                    control.setDisabled(true);
                }
            }
            catch(e){
                // otro error
            }
        });
    },
    // Show Hide//
    getVisible: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName)) {
            return formContext.getControl(fieldName).getVisible();
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " No existe en formulario");
        }
    },
    parentGetVisible: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName)) {
            return formContext.getControl(fieldName).getVisible();
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " No existe en formulario");
        }
    },
    showField: function (executionContext, fieldName) {
        /// <summary>
        /// Show a field by the name
        /// </summary>
        /// <param name="fieldName" type="string">
        /// The name of the field to be shown
        /// </param>
        /// <returns type="void" />
		
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.getControl(fieldName).setVisible(true);
    },
    parentShowField: function (executionContext, fieldName) {
        /// <summary>
        /// Show a field by the name
        /// </summary>
        /// <param name="fieldName" type="string">
        /// The name of the field to be shown
        /// </param>
        /// <returns type="void" />
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.getControl(fieldName).setVisible(true);
    },
    hideField: function (executionContext, fieldName) {
        /// <summary>
        /// Hide a field by the name
        /// </summary>
        /// <param name="fieldName" type="string">
        /// The name of the field to be hidden
        /// </param>
        /// <returns type="void" />
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.getControl(fieldName).setVisible(false);
    },
    parentHideField: function (executionContext, fieldName) {
        /// <summary>
        /// Hide a field by the name
        /// </summary>
        /// <param name="fieldName" type="string">
        /// The name of the field to be hidden
        /// </param>
        /// <returns type="void" />
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.getControl(fieldName).setVisible(false);
    },
    setVisible: function (executionContext, fieldName, visible) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        try {
            formContext.getControl(fieldName).setVisible(visible);
        }
        catch (err) { }
    },
    hideShowTab: function (executionContext, tabName, visible) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        try {
            formContext.ui.tabs.get(tabName).setVisible(visible);
        }
        catch (err) { }
    },
    parentHideShowTab: function (executionContext, tabName, visible) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        try {
            formContext.ui.tabs.get(tabName).setVisible(visible);
        }
        catch (err) { }
    },
    GetSections: function (executionContext, tabName) {
        var tabs = JumpStartLibXRM.Fx.GetTabs(executionContext, tabName);
        var _return = null;
        if (tabs != null && tabs != "undefined") {
            _return = tabs.sections.get();
        }
        return _return;
    },
    GetVisibleSection: function (executionContext, tabName, sectionName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var _return = false;
        try {
            _return = formContext.ui.tabs.get(tabName).sections.get(sectionName).setVisible();
        }
        catch (err) {
			_return = false;
            JumpStartLibXRM.Fx.showError(err);
            JumpStartLibXRM.Fx.showMessage("Tab: " + tabName + " Seccion: " + sectionName + " Tiene Problema");
        }
        return _return;
    },
    hideShowSection: function (executionContext, tabName, sectionName, visible) {
        var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		try {
            formContext.ui.tabs.get(tabName).sections.get(sectionName).setVisible(visible);
        }
        catch (err) {
            JumpStartLibXRM.Fx.showError(err);
            JumpStartLibXRM.Fx.showMessage("Tab: " + tabName + " Seccion: " + sectionName + " Tiene Problema");
        }
    },
    parentHideShowSection: function (executionContext, tabName, sectionName, visible) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        try {
            formContext.ui.tabs.get(tabName).sections.get(sectionName).setVisible(visible);
        }
        catch (err) {
            JumpStartLibXRM.Fx.showError(err);
            JumpStartLibXRM.Fx.showMessage("Tab: " + tabName + " Seccion: " + sectionName + " Tiene Problema");
        }
    },
    hideShowSectionAllControlsInSection: function (executionContext, tabName, sectionName, visible) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        try {
            var ctrls = formContext.ui.tabs.get(tabName).sections.get(sectionName).controls;

            ctrls.forEach(function (ctr) {
                ctr.setVisible(visible);
            });
        }
        catch (err) {
            JumpStartLibXRM.Fx.showError(err);
            JumpStartLibXRM.Fx.showMessage("Tab: " + tabName + " Seccion: " + sectionName + " Tiene Problema");
        }
    },
    //funcion que forza el guardado de aquellos atributos que se encuentran deshabilitados
    formSubmitAlwaysUpdateFieldsDisable: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var allAttributes = formContext.getControl();
        for (var i in allAttributes) {
            try {
                var disabled = allAttributes[i].getDisabled();
                if (disabled) {
                    var name = allAttributes[i].getName();
                    if (formContext.data.entity.attributes.get(name)) {
                        if (formContext.data.entity.attributes.get(name).getIsDirty()) {
                            JumpStartLibXRM.Fx.setSubmitModeField(executionContext, name, "always");
                        } else {
                            JumpStartLibXRM.Fx.setSubmitModeField(executionContext, name, "never");
                        }
                    }
                }
            }
            catch (err) {
                null;
            }
        }
    },
    //Dispara el onchange del campo
    fireOnChange: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName)) {
            formContext.getAttribute(fieldName).fireOnChange();
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " No existe en formulario");
        }
    },
    //Limpia mensaje del campo y form
    clearNotification: function (executionContext, fieldName, id) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName) && id != null) {
            formContext.getControl(fieldName).clearNotification(id);
        }
        else {
            JumpStartLibXRM.Fx.showMessage("No existe campo o id");
        }
    },
    clearFormNotification: function (executionContext, id) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (id == null || id == undefined) {
            formContext.ui.clearFormNotification();
        }
        else {
            formContext.ui.clearFormNotification(id);
        }
    },
    //Open entity form in the same window
    openEntityForm: function (EntityName, EntityId) {
        if (EntityName && EntityId) {
            Xrm.Navigation.openForm(EntityName, EntityId);
        }
        else {
            JumpStartLibXRM.Fx.showMessage("EntityName o EntityId son nulos");
        }
    },
	//Open entity form in a new window
    openEntityFormNewWindow: function (entityFormOptions, formParameters) { //EntityName, EntityId, parameters, windowOptions) {
        if (entityFormOptions && formParameters) { //EntityName && EntityId && parameters && windowOptions) {
            //Xrm.Navigation.openForm(EntityName, EntityId, parameters, windowOptions);
			Xrm.Navigation.openForm(entityFormOptions, formParameters).then(function(success){}, function (error) {});
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Existe un problema con los parametros enviados");
        }
    },
    parentOpenEntityForm: function (EntityName, EntityId) {
        if (EntityName && EntityId) {
            Xrm.Navigation.openForm(EntityName, EntityId);
        }
        else {
            JumpStartLibXRM.Fx.showMessage("EntityName o EntityId son nulos");
        }
    },
    //Addonchange
    addOnChange: function (executionContext, fieldName, func) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName)) {
            var campo_visible = formContext.getControl(fieldName).getVisible();
            if (campo_visible) {
                formContext.getAttribute(fieldName).addOnChange(func);
            }
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " No existe en formulario");
        }
    },
    addOnChangeV2: function (executionContext, fieldName, func) {
		// Se quita condición de visibilidad, ya que no debería estar mezclada con esta función.
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName)) {
            formContext.getAttribute(fieldName).addOnChange(func);
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " No existe en formulario");
        }
    },	
	removeOnChange: function (executionContext, fieldName, func) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName)) {
			// si previamente no tiene asociada la función, entonces no da error, solo retorna undefined
			formContext.getAttribute(fieldName).removeOnChange(func);
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " No existe en formulario");
        }
    },
    doesControlHaveAttribute: function (control) {
        var controlType = control.getControlType();
        return (controlType != "iframe" && controlType != "webresource" && controlType != "subgrid");
    },
    // collapsed
    collapseAllTab: function (executionContext, executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.ui.tabs.forEach(function (control) {
            control.setDisplayState("collapsed");
        });
    },
    collapseTab: function (executionContext, TabName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.ui.tabs.get(TabName)) formContext.ui.tabs.get(TabName).setDisplayState('collapsed');
    },
    // Expand
    expandTab: function (executionContext, TabName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.ui.tabs.get(TabName)) formContext.ui.tabs.get(TabName).setDisplayState('expanded');
    },
    expandAllTab: function (executionContext, executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.ui.tabs.forEach(function (control) {
            control.setDisplayState("expanded");
        });
    },
    // Display State tabs
    displayState: function (executionContext, tabName, type) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.ui.tabs.get(tabName).setDisplayState(type);
    },
    SetTabDisplayState: function (executionContext, TabName, DisplayState) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
       if (formContext.ui.tabs.get(TabName)) formContext.ui.tabs.get(TabName).setDisplayState(DisplayState);
    },
    GetTabDisplayState: function (executionContext, TabName) {
        // Display State "expanded" - "collapsed"
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.ui.tabs.get(TabName)) return formContext.ui.tabs.get(TabName).getDisplayState();
    },
    GetTabs: function (executionContext, tabName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var tabs = formContext.ui.tabs;
        var _return = null;
        if (tabName != null && tabName != "undefined") {
            if (tabs != null) {
                _return = formContext.ui.tabs.get(tabName);
            }
        }
        else {
            if (tabs != null) {
                _return = formContext.ui.tabs.get();
            }
        }
        return _return;
    },
    // update //
    updateRequirementLevel: function (executionContext, fieldName, levelName) {
        /// <summary>
        /// Updates the requirement level of a field
        /// </summary>
        /// <param name="fieldName" type="string">
        /// Name of the field
        /// </param>
        /// <param name="levelName" type="string">
        /// Name of the requirement level. [none, recommended, required] (Case Sensitive)
        /// </param>
        /// <returns type="void" />
		
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var _ctrl = JumpStartLibXRM.Fx.getField(executionContext, fieldName);
        if (_ctrl) formContext.getAttribute(fieldName).setRequiredLevel(levelName);
        else JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " No existe en formulario");
    },
    parentGetRequiredLevel: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var _ctrl = JumpStartLibXRM.Fx.parentGetField(fieldName);
        if (_ctrl) return formContext.getAttribute(fieldName).getRequiredLevel();
        else JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " No existe en formulario");
    },
    parentUpdateRequirementLevel: function (executionContext, fieldName, levelName) {
        /// <summary>
        /// Updates the requirement level of a field
        /// </summary>
        /// <param name="fieldName" type="string">
        /// Name of the field
        /// </param>
        /// <param name="levelName" type="string">
        /// Name of the requirement level. [none, recommended, required] (Case Sensitive)
        /// </param>
        /// <returns type="void" />
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var _ctrl = JumpStartLibXRM.Fx.parentGetField(fieldName);
        if (_ctrl) formContext.getAttribute(fieldName).setRequiredLevel(levelName);
        else JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " No existe en formulario");
    },
	SetAllFormFieldsOptional: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
		var AllAttributes = formContext.data.entity.attributes.get();
		
		for (var i in AllAttributes) {
			var Attribute = AllAttributes[i];
			Attribute.setRequiredLevel("none");
		}
    },		
    // refresh and reload //
    reloadForm: function (entityName, entityId) {
        if (entityName && entityName != "" && entityId && entityId != JumpStartLibXRM.Fx._emptyGuid) {
             Xrm.Navigation.openForm(entityName, entityId);
        }
    },
    refreshFormData: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.data.refresh(true);
    },
    refreshSubGridOnChange: function (executionContext, gridName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var targetgrid = formContext.ui.controls.get(gridName);
        if (targetgrid) {
            targetgird.refresh();
        }
    },
    refreshRibbonOnChange: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.ui.refreshRibbon();
    },
    // save and close form
    formSave: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.data.entity.save();
    },
    parentFormSave: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.data.entity.save();
    },
    parentFormSaveThen: function (executionContext, successCallback, errorCallback) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.data.save().then(successCallback, errorCallback);
    },
    formSaveAndClose: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.data.entity.save("saveandclose");
    },
    parentFormSaveAndClose: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.data.entity.save("saveandclose");
    },
    formClose: function (executionContext) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        formContext.ui.close();
    },
    confirmDialog: function (message, yesCloseCallback, noCloseCallback) {
        var msj = JumpStartLibXRM.Fx.getValueField(message, null); 
        Xrm.Navigation.openConfirmDialog(message, yesCloseCallback, noCloseCallback);
    },
    onSaveForceRefresh: function (executionContext, context) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var eventArgs = context.getEventArgs();
        if (eventArgs.getSaveMode() == 1){
            formContext.data.refresh(true);
        }
    }, 
    // options
    removeOption: function (executionContext, ControlName, Position) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var objCtrl = formContext.getControl(ControlName);
        if (objCtrl != null && objCtrl != "undefined") objCtrl.removeOption(Position);
    },
    clearOption: function (executionContext, fieldName) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        if (formContext.getControl(fieldName)) {
            formContext.getControl(fieldName).clearOptions();
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " no existe en formulario");
        }
    },
    addOption: function (executionContext, fieldName, options) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var campo = JumpStartLibXRM.Fx.getField(executionContext, fieldName);
        if (campo) {
            formContext.getControl(fieldName).addOption(options);
        }
        else {
            JumpStartLibXRM.Fx.showMessage("Campo " + fieldName + " no existe en formulario");
        }
    },
    // User
    getUserId: function () {
		var userSettings = Xrm.Utility.getGlobalContext().userSettings;
		return userSettings.userId;
    },
    getUserName: function () {
		var userSettings = Xrm.Utility.getGlobalContext().userSettings;
		return userSettings.userName;
    },
    parentGetUserId: function () {
		var userSettings = Xrm.Utility.getGlobalContext().userSettings;
		return userSettings.userId;
    },
    getOwnerId: function (executionContext) {
        return JumpStartLibXRM.Fx.getLookupValueId(executionContext, "ownerid");
    },
    isOwnerUser: function (executionContext) {
        //debugger;    
        var UserID = JumpStartLibXRM.Fx.getUserId();
        //var OwnerID = JumpStartLibXRM.Fx.getOwnerId(executionContext);

        var OwnerID = null;
        if(executionContext!=null && executionContext.getFormContext!=null)
            OwnerID = JumpStartLibXRM.Fx.getOwnerId(executionContext);    
        else
            if(executionContext != null && executionContext.ui != null)
            {
                if (executionContext.getControl("ownerid") != null)
                    OwnerID = executionContext.getControl("ownerid").getAttribute().getValue()[0].id;
            }

        var isEqual = false;
        if (UserID && OwnerID) {
            isEqual = JumpStartLibXRM.Fx.guidsAreEqual(UserID, OwnerID);
        }
        return isEqual;
    },
    // roles
    UserHasRole: function (executionContext,roleName) {
        /// <summary>
        /// Check if current user have the rolename
        /// </summary>
        /// <param name="roleName" type="string">
        /// Name of the rol
        /// <returns type="boolean" />
        /// true have the rol , false no have the rol
        var _entity = "role";
        var _columnsfields = "name,roleid";
        var _OdataQuery = "$filter=name eq '" + roleName + "'";
		
		//https://qa-link.crm2.dynamics.com/api/data/v8.0/roles?$filter=name%20eq%20%27Administrador%20del%20sistema%27
        var _callbackSuccess = JumpStartLibXRM.Fx.UserHasRoleSuccess;
        
		
		//var _roleobj = JumpStart.OData.retriveRecordGenericSync(_OdataQuery, _entity, _columnsfields, null);
		var _roleobj = SDK.WEBAPI.retrieveMultipleRecords(executionContext,_entity, _OdataQuery);
		
		
		var userSettings = Xrm.Utility.getGlobalContext().userSettings;
		
        //JumpStart.OData.retrieveRecordGeneric(_OdataQuery, _entity, _columnsfields, null,  _callbackSuccess, function (executionContext, error) { window.alert(error); } );
		//_roleobj.value[1].roleid
		//_roleobj.value[1].name
        if (_roleobj != undefined && _roleobj != null && _roleobj.value != undefined && _roleobj.value != null && _roleobj.value.length > 0) {
            var id = _roleobj.value[0].roleid;
            var currentUserRoles = userSettings.securityRoles;
            for (var i = 0; i < currentUserRoles.length; i++) {
                var userRole = currentUserRoles[i];

                for (var j = 0; j < _roleobj.value.length; j++) {
                    if (JumpStartLibXRM.Fx.guidsAreEqual(userRole, _roleobj.value[j].roleid)) {
                        return true;
                    }
                }
            }
        }
        return false;
    },

    UserHasRoles: function (executionContext,rolesNameArray,functionOK,functionNok) {
        /// <summary>
        /// Check if current user have the rolename
        /// </summary>
        /// <param name="roleName" type="string">
        /// Name of the rol
        /// <returns type="boolean" />
        /// true have the rol , false no have the rol
        var _entity = "role";
        var _columnsfields = "name,roleid";
        var _OdataQuery = "$filter=";
        var rolesArray =new Array();
        rolesNameArray.forEach( 
            function (x){
                _OdataQuery += "name eq '" + roleName + "' or "
            }
            );
        let len = _OdataQuery.length;
         _OdataQuery=str.substr(0, len-4);       
         Xrm.WebApi.online.retrieveMultipleRecords("role", "?$select=name,roleid,roleidunique&"+_OdataQuery).then(
            function success(results) {
                for (var i = 0; i < results.entities.length; i++) {
                    var rolesObj = new object ();
                    rolesObj.name = results.entities[i]["name"];
                    rolesObj.roleid = results.entities[i]["roleid"];
                    rolesObj.roleidunique =  results.entities[i]["roleidunique"];
                    rolesArray.push(rolesObj);
                }
                var userSettings = Xrm.Utility.getGlobalContext().userSettings;
                var found = false;
                if (rolesArray != undefined && rolesArray != null && rolesArray.length > 0) {                   
                    var currentUserRoles = userSettings.securityRoles;
                    for (var i = 0; i < currentUserRoles.length; i++) {
                        var userRole = currentUserRoles[i].replace(/[{}]/g, "").toLowerCase();;
                        for (var j = 0; j < rolesArray.length; j++) {
                            if (JumpStartLibXRM.Fx.guidsAreEqual(userRole, rolesArray[j].roleid)) {
                                found = true;
                                break;
                            }
                        }
                        if (found){
                            break;
                        }
                    }
                    if (found){
                        functionOK(executionContext);
                    }
                    else{
                        functionNok(executionContext);
                    }
                }
                else{
                    functionNok(executionContext); 
                }

            },
            function(error) {
                Xrm.Utility.alertDialog(error.message);
            }
        );
    },
   UserHasRolesArray: function (executionContext,rolesArray) {   
       // debugger;    
        var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        var found = false;
        if (rolesArray != undefined && rolesArray != null && rolesArray.length > 0) {                   
            var currentUserRoles = userSettings.securityRoles;
            for (var i = 0; i < currentUserRoles.length; i++) {
                var userRole = currentUserRoles[i].replace(/[{}]/g, "").toLowerCase();;
                for (var j = 0; j < rolesArray.length; j++) {
                    if (JumpStartLibXRM.Fx.guidsAreEqual(userRole, rolesArray[j])) {
                        found = true;
                        break;
                    }
                }
                if (found){
                    break;
                }     
            }                 
        }
       return found;           
    },
    IsAuthorizedForRoles: function (roles) {
        // debugger;
        /*
        Description:    This function is used to check if a user has acces based on the selected role OR roles
        Params:         roles                = one role or array of roles to check
          
        Returns:         true or false
        Calls:            getUserRoles() and gNullToString(), gIsArray(roles)
        Author:         GP
        Note:            If NO userid is passed the system will use the current user !!!
        */
        //if only one role is passed (=string) create an array. Else copy roles  array to arrRoles
        if (!JumpStartLibXRM.Fx.IsArray(roles)) {
            arrRoles = new Array();
            arrRoles[0] = roles;
        }
        else {
            arrRoles = roles;
        }
		
		var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        //get all roles for the user. If no userid is passed, the current user will be used
        var currentUserRoles = userSettings.securityRoles; // list of Guid
        if (currentUserRoles != null) {
            for (i = 0; i < currentUserRoles.length; i++) {
                for (var j = 0; j < arrRoles.length; j++) {
                    if (JumpStartLibXRM.Fx.guidsAreEqual(currentUserRoles[i], arrRoles[j])) {
                        return true;
                        break;
                    }
                }
            }
        }
        return false;
    },
    CheckUserRole: function (executionContext, roleName) {
		var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        var currentUserRoles = userSettings.securityRoles;

        for (var i = 0; i < currentUserRoles.length; i++) {
            var userRoleId = currentUserRoles[i];
            var userRoleName = JumpStartLibXRM.Fx.GetRoleName(userRoleId);
            if (userRoleName == roleName) {
                return true;
            }
        }
        return false;
    },
    GetRolesUser: function () {
		var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        var currentUserRoles = userSettings.securityRoles;
        var rolesUsuarioResp = [];
        for (var i = 0; i < currentUserRoles.length; i++) {
            var userRole = currentUserRoles[i];
            var queryRolesUsuario = "RoleSet?$top=1&$select=Name&$filter=RoleId eq guid'" + userRole + "'";
            respQueryRolesUsuario = JumpStart.OData.retrieveRecordRequest(queryRolesUsuario);
            if (respQueryRolesUsuario != null) {
                if (respQueryRolesUsuario.length == 1) {
                    rolesUsuarioResp.push(respQueryRolesUsuario[0].Name);
                }
            }
        }
        return rolesUsuarioResp;
    },
    GetRoleName: function (roleId) {
		var organizationSettings = Xrm.Utility.getGlobalContext().organizationSettings;		
        var serverUrl = location.protocol + "//" + location.host + "/" + organizationSettings.uniqueName;
        var odataSelect = serverUrl + "/XRMServices/2011/OrganizationData.svc" + "/" + "RoleSet?$filter=RoleId eq guid'" + roleId + "'";
        var roleName = null;
        $.ajax({
            type: "GET",
            async: false,
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: odataSelect,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                roleName = data.d.results[0].Name;
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                alert('OData Select Failed: ' + textStatus + errorThrown + odataSelect);
            }
        });
        return roleName;
    },
    UserHasRoleArray: function (roleName, rolesNamesArray) {
        //debugger;
        /// <summary>
        /// Check if current user have the rolename in an array of rolesNames
        /// </summary>
        /// <param name="roleName" type="string">
        /// Name of the rol
        ///<param name="rolesNamesArray" type="array of string">
        /// <returns type="boolean" />
        /// true have the rol , false no have the rol
        var isEqual = false;
        for (var i = 0; i < rolesNamesArray.length; i++) {
            var roleAux = rolesNamesArray[i];
            if (roleName == null || roleAux == null) {
                isEqual = false;
            } else {
                if (roleName == roleAux) {
                    isEqual = true;
                    break;
                }
            }

        }
        return isEqual;
    },
    //  util
    IsArray: function (obj) {
        //Function to check if object is an array. If not an array is constructed and returned.
        return obj.constructor == Array;
    },
    gNullToString: function (strInput) {
        //gNullToString(sValue) : Function to replace Null with empty string
        if (strInput + "" == "null" || strInput + "" == "undefined") {
            return "";
        }
        return strInput;
    },
    showError: function (error) {
        /// <summary>
        /// Alert the error message if occurred
        /// </summary>
        /// <param name="error" type="error">
        /// Object of the JavaScript error
        /// </param>
        /// <returns type="void" />
        // alertMessage(error.message);
        alert(error.message);
    },
    showMessage: function (message) {
        if (message) {
            alert(message);
        }
    },
    guidsAreEqual: function (guid1, guid2) {
        /// <summary>
        /// Check if two guids are equal
        /// </summary>
        /// <param name="guid1" type="string">
        /// A string represents a guid
        /// </param>
        /// <param name="guid2" type="string">
        /// A string represents a guid
        /// </param>
        /// <returns type="boolean" />
        var isEqual;
        if (guid1 === null || guid2 === null || guid1 === undefined || guid2 === undefined) {
            isEqual = false;
        }
        else {
            isEqual = guid1.replace(/[{}]/g, "").toLowerCase() === guid2.replace(/[{}]/g, "").toLowerCase();
        }
        return isEqual;
    },
    calculateDaysBetween: function (datetime1, datetime2) {
        /// <summary>
        /// Calculate the days between two dates
        /// </summary>
        /// <param name="datetime1" type="DateTime">
        /// The first / early date to be calculated
        /// </param>
        /// <param name="datetime2" type="DateTime">
        /// The second / later date to e calculated
        /// </param>
        /// <returns type="int" />
        // The number of milliseconds in one day
        var oneDay = 1000 * 60 * 60 * 24;
        // Convert both dates to milliseconds
        var date1Ms = datetime1.getTime();
        var date2Ms = datetime2.getTime();
        // Calculate the difference in milliseconds
        var differenceMs = Math.abs(date1Ms - date2Ms); // Convert back to days and return
        return Math.round(differenceMs / oneDay);
    },
    formatDate: function (date){
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        var fecha = dd + '/' + mm + '/' + yyyy; 
        return fecha;
    },	
    // rutina de rut
    validarrut: function (rut) {
        //var EO = executionObj.getEventSource();
        var thisRut = rut;
        var strRut = JumpStartLibXRM.Fx.quitaFormatoRut(thisRut);
        var i;
        if (thisRut == "") return false;
        largo = strRut.length;
        if (largo < 2) {
            //alert("ERROR: Debe ingresar el rut completo");
            thisRut = '';
            //EO.setValue('');
            return false;
        }
        if (largo > 2) strRutSD = strRut.substring(0, largo - 1);
        else strRutSD = strRut.charAt(0);
        strDv = strRut.charAt(largo - 1);
        if (!JumpStartLibXRM.Fx.validaDV(strDv)) {
            //alert("ERROR: El rut es incorrecto");
            thisRut = '';
            //EO.setValue('');
            return false
        }
        if (strRutSD == null || strDv == null) return 0;
        var dvr = '0';
        var intSuma = 0;
        intFactor = 2;
        for (i = strRutSD.length - 1; i >= 0; i--) {
            intSuma = intSuma + strRutSD.charAt(i) * intFactor;
            if (intFactor == 7) intFactor = 2;
            else intFactor++;
        }
        intResto = intSuma % 11;
        if (intResto == 1) dvr = 'k';
        else if (intResto == 0) dvr = '0';
        else {
            dvi = 11 - intResto;
            dvr = dvi + "";
        }
        if (dvr != dv.toLowerCase()) {
            //alert("ERROR: El rut es incorrecto")
            thisRut = '';
            //EO.setValue('');
            return false;
        }
        JumpStartLibXRM.Fx.formateaRut(thisRut);
        return true;
    },
    validaDV: function (strDV) {
        dv = strDV + "";
        if (dv != '0' && dv != '1' && dv != '2' && dv != '3' && dv != '4' && dv != '5' && dv != '6' && dv != '7' && dv != '8' && dv != '9' && dv != 'k' && dv != 'K') return false;
        return true;
    },
    quitaFormatoRut: function (strVal) {
        var strTmp = '';
        var i;
        if (strVal.charAt(0) == '0') {
            for (i = 1; i < strVal.length; i++)
                if (strVal.charAt(i) != ' ' && strVal.charAt(i) != '.' && strVal.charAt(i) != '-' && strVal.charAt(i) != ',') strTmp = strTmp + strVal.charAt(i);
        }
        else {
            for (i = 0; i < strVal.length; i++)
                if (strVal.charAt(i) != ' ' && strVal.charAt(i) != '.' && strVal.charAt(i) != '-' && strVal.charAt(i) != ',') strTmp = strTmp + strVal.charAt(i);
        }
        return strTmp;
    },
    formateaRut: function (thisRut) {
        //debugger;
        var tmpstr = "";
        var strRut = thisRut;
        var i
        //alert(thisRut.DataValue)
        if (thisRut == "") return false;
        for (i = 0; i < strRut.length; i++)
            if (strRut.charAt(i) != ' ' && strRut.charAt(i) != '.' && strRut.charAt(i) != '-') tmpstr = tmpstr + strRut.charAt(i);
        strRut = tmpstr;
        largo = strRut.length;
        if (largo < 2) {
            //alert("ERROR: Debe ingresar el rut completo");
            thisRut = '';
            return false;
        }
        for (i = 0; i < largo; i++) {
            if (strRut.charAt(i) != "0" && strRut.charAt(i) != "1" && strRut.charAt(i) != "2" && strRut.charAt(i) != "3" && strRut.charAt(i) != "4" && strRut.charAt(i) != "5" && strRut.charAt(i) != "6" && strRut.charAt(i) != "7" && strRut.charAt(i) != "8" && strRut.charAt(i) != "9" && strRut.charAt(i) != "k" && strRut.charAt(i) != "K") {
                //alert("ERROR: El rut es incorrecto");
                thisRut = '';
                return false;
            }
        }
        var invertido = "";
        for (i = (largo - 1), j = 0; i >= 0; i-- , j++)
            invertido = invertido + strRut.charAt(i);
        var dtexto = "";
        dtexto = dtexto + invertido.charAt(0);
        dtexto = dtexto + '-';
        cnt = 0;
        for (i = 1, j = 2; i < largo; i++ , j++) {
            if (cnt == 3) {
                j++;
                dtexto = dtexto + invertido.charAt(i);
                cnt = 1;
            }
            else {
                dtexto = dtexto + invertido.charAt(i);
                cnt++;
            }
        }
        invertido = "";
        for (i = (dtexto.length - 1), j = 0; i >= 0; i-- , j++)
            invertido = invertido + dtexto.charAt(i);
        thisRut.DataValue = invertido;
        if (JumpStartLibXRM.Fx.validaDV(strRut)) return true;
        return false;
    },    
    // scr IFRAME o WEB RESOURCES
    getSrc: function (executionContext, arg) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var webResource = formContext.getControl(arg);
        if (webResource) {
            return webResource.getSrc();
        }
        else {
            return null;
        }
    },
    setSrc: function (executionContext, arg, url) {
		var formContext = JumpStartLibXRM.Fx.getFormContext(executionContext);
        var webResource = formContext.getControl(arg);
        if (url && webResource) {
            webResource.setSrc(url);
        }
        else {
            JumpStartLibXRM.Fx.showMessage("srcIframe no existe");
        }
    },
    // set statecode and statuscode
    SetStateRequest: function (executionContext, _entityname, entityid, _state, _status) {
        var requestMain = "";
        requestMain += "<s:Envelope xmlns:s=\"http://schemas.xmlsoap.org/soap/envelope/\">";
        requestMain += "  <s:Body>";
        requestMain += "    <Execute xmlns=\"http://schemas.microsoft.com/xrm/2011/Contracts/Services\" xmlns:i=\"http://www.w3.org/2001/XMLSchema-instance\">";
        requestMain += "      <request i:type=\"b:SetStateRequest\" xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\" xmlns:b=\"http://schemas.microsoft.com/crm/2011/Contracts\">";
        requestMain += "        <a:Parameters xmlns:c=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>EntityMoniker</c:key>";
        requestMain += "            <c:value i:type=\"a:EntityReference\">";
        requestMain += "              <a:Id>" + entityid + "</a:Id>";
        requestMain += "              <a:LogicalName>" + _entityname + "</a:LogicalName>";
        requestMain += "              <a:Name i:nil=\"true\" />";
        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>State</c:key>";
        requestMain += "            <c:value i:type=\"a:OptionSetValue\">";
        requestMain += "              <a:Value>" + _state + "</a:Value>";
        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "          <a:KeyValuePairOfstringanyType>";
        requestMain += "            <c:key>Status</c:key>";
        requestMain += "            <c:value i:type=\"a:OptionSetValue\">";
        requestMain += "              <a:Value>" + _status + "</a:Value>";
        requestMain += "            </c:value>";
        requestMain += "          </a:KeyValuePairOfstringanyType>";
        requestMain += "        </a:Parameters>";
        requestMain += "        <a:RequestId i:nil=\"true\" />";
        requestMain += "        <a:RequestName>SetState</a:RequestName>";
        requestMain += "      </request>";
        requestMain += "    </Execute>";
        requestMain += "  </s:Body>";
        requestMain += "</s:Envelope>";
        var req = new XMLHttpRequest();
        req.open("POST", JumpStartLibXRM.Fx._getServerUrl(), true)
        // Responses will return XML. It isn't possible to return JSON.
        req.setRequestHeader("Accept", "application/xml, text/xml, */*");
        req.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
        req.setRequestHeader("SOAPAction", "http://schemas.microsoft.com/xrm/2011/Contracts/Services/IOrganizationService/Execute");
        var successCallback = null;
        var errorCallback = null;
        req.onreadystatechange = function () {
            JumpStartLibXRM.Fx.SetStateResponse(req, successCallback, errorCallback);
        };
        req.send(requestMain);
    },
    SetStateResponse: function (req, successCallback, errorCallback) {
        if (req.readyState == 4) {
            if (req.status == 200) {
                if (successCallback != null) {
                    successCallback();
                }
            }
            else {
                errorCallback(JumpStartLibXRM.Fx._getError(req.responseXML));
            }
        }
    },  
    AlertDialog: function (strtitle, strbody, strOK){
		var alertStrings = { confirmButtonLabel: strOK, text: strbody, title: strtitle };
		var alertOptions = { height: 120, width: 260 };
		Xrm.Navigation.openAlertDialog(alertStrings, alertOptions);		
	},
    toUnicodeBold: function (text) {
        debugger;
        const map = {
            A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜',
            J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥',
            S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
            a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶',
            j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿',
            s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇',
            á: '𝗮\u0301', é: '𝗲\u0301', í: '𝗶\u0301', ó: '𝗼\u0301', ú: '𝘂\u0301',
            Á: '𝗔\u0301', É: '𝗘\u0301', Í: '𝗜\u0301', Ó: '𝗢\u0301', Ú: '𝗨\u0301',
            ñ: '𝗻\u0303', Ñ: '𝗡\u0303'
        };
        return text.split('').map(c => map[c] || c).join('');
    },
    toUnicodeBold_OLD: function (text) { 
        const boldAlphabet = {
            A: '𝗔', B: '𝗕', C: '𝗖', D: '𝗗', E: '𝗘', F: '𝗙', G: '𝗚', H: '𝗛', I: '𝗜',
            J: '𝗝', K: '𝗞', L: '𝗟', M: '𝗠', N: '𝗡', O: '𝗢', P: '𝗣', Q: '𝗤', R: '𝗥',
            S: '𝗦', T: '𝗧', U: '𝗨', V: '𝗩', W: '𝗪', X: '𝗫', Y: '𝗬', Z: '𝗭',
            a: '𝗮', b: '𝗯', c: '𝗰', d: '𝗱', e: '𝗲', f: '𝗳', g: '𝗴', h: '𝗵', i: '𝗶',
            j: '𝗷', k: '𝗸', l: '𝗹', m: '𝗺', n: '𝗻', o: '𝗼', p: '𝗽', q: '𝗾', r: '𝗿',
            s: '𝘀', t: '𝘁', u: '𝘂', v: '𝘃', w: '𝘄', x: '𝘅', y: '𝘆', z: '𝘇'
        };

        return text.split('').map(char => boldAlphabet[char] || char).join('');
    },    
    _getServerUrl: function () {
		var organizationSettings = Xrm.Utility.getGlobalContext().organizationSettings;		
        var OrgServicePath = "/XRMServices/2011/Organization.svc/web";
        var serverUrl = location.protocol + "//" + location.host + "/" + organizationSettings.uniqueName;
        /*if (typeof GetGlobalContext == "function")
	    {
	        var context = GetGlobalContext();
	        serverUrl = context.getClientUrl();
	    }
	    else
	    {
	        if (typeof executionContext.getFormContext().context == "object")
	        {
	            serverUrl = executionContext.getFormContext().context.getClientUrl();
	        }
	        else
	        { throw new Error("Unable to access the server URL"); }
	    }
	    if (serverUrl.match(/\/$/))
	    {
	        serverUrl = serverUrl.substring(0, serverUrl.length - 1);
	    }
	    */
        return serverUrl + OrgServicePath;
    },
    _getError: function (faultXml) {
        var errorMessage = "Unknown Error (Unable to parse the fault)";
        if (typeof faultXml == "object") {
            try {
                var bodyNode = faultXml.firstChild.firstChild;
                //Retrieve the fault node
                for (var i = 0; i < bodyNode.childNodes.length; i++) {
                    var node = bodyNode.childNodes[i];
                    if ("s:Fault" == node.nodeName) {
                        for (var j = 0; j < node.childNodes.length; j++) {
                            var faultStringNode = node.childNodes[j];
                            if ("faultstring" == faultStringNode.nodeName) {
                                errorMessage = faultStringNode.text;
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            catch (e) { };
        }
        return new Error(errorMessage);
    },
    __namespace: true
};
