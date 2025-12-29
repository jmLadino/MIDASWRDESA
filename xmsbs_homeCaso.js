if (typeof(HomeCaso) == "undefined") {
    HomeCaso = {
        __namespace: true
    };    
}

HomeCaso = {
    RolesArray: {
        SystemUser: ["fcdb18f7-5d73-eb11-b1ab-000d3ab8ddf9",
                     "169adf05-fdb3-4b76-af6f-0140da9090c2",
                     "d0029b50-b793-439c-ab38-79c6a3484460",
                     "4ffebe94-68ec-488e-bef9-b948b6566b7a",
                     "d954a592-c65a-41d0-bf78-bb256ddca278",
                     "e6bc4b59-330d-4570-8fb8-cacdeacfc8c4"],
        AdministradorFuncionalGrupoSantander: ["3A58AEF4-33DA-4664-8CF2-3D4774D3F617",
                                               "3D038456-902C-4CCD-845D-5F4C11448F4B"]
    },   
     
    enableButtonFlow: function (executionContext){
		//debugger;
		let array = new Array();
        
        HomeCaso.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        let found = HomeCaso.UserHasRolesArray(executionContext, array);
        
		return found;
	},

    enableButtonEliminar: function (executionContext){
        let array = new Array();
        
        HomeCaso.RolesArray.SystemUser.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        HomeCaso.RolesArray.AdministradorFuncionalGrupoSantander.forEach( 
            function (x){
                array.push(x);
            }
        );
        
        let found = HomeCaso.UserHasRolesArray(executionContext, array);
        
		return found;
	},
    
    SetStateEliminadoSelectedIncidentRecords: function (selectedIds, selectedControl){
        //debugger;
        if (selectedIds != null && selectedIds != "")
        {
            var confirmStrings  = { confirmButtonLabel: "Aceptar", title: "Cambiar estado del Caso a Eliminado", subtitle:"Va a iniciar el cambio de estado del caso a Eliminado. ¿Desea Continuar?", text: "Esta acción podría demorar algunos segundos."};
            var confirmOptions  = { height: 200, width: 260 };
            
            Xrm.Navigation.openConfirmDialog(confirmStrings , confirmOptions ).then(
                function (success) {
                    if(success.confirmed)
                    {   
                        //debugger;
                        //Xrm.Utility.showProgressIndicator("Procesando");
                        var strIds = selectedIds.toString();
                        var arrIds = strIds.split(",");

                        if(arrIds.length > 0)
                        {                
                            for (var i = 0; i < arrIds.length; i++) {
                                var data =
                                {
                                    "xmsbs_aux_status": 5
                                }
                            
                                Xrm.WebApi.updateRecord("incident", arrIds[i], data).then(
                                    function success(result) {
                                        console.log("Incident updated");
                                    },
                                    function (error) {
                                        console.log(error.message);
                                    }
                                );
                            }
                        }
                        
                        //Xrm.Utility.closeProgressIndicator();
                        selectedControl.refresh();
                    }
                    else
                    {

                    }
                },
                function (error) {
                    console.log(error.message);
                }
            );            
        }
        else
        {
            alert("No hay registros seleccionados.");
        }
	},

    UserHasRolesArray: function (executionContext,rolesArray) {  
        var userSettings = Xrm.Utility.getGlobalContext().userSettings;
        var found = false;
        if (rolesArray != undefined && rolesArray != null && rolesArray.length > 0) {                   
            var currentUserRoles = userSettings.securityRoles;
            for (var i = 0; i < currentUserRoles.length; i++) {
                var userRole = currentUserRoles[i].replace(/[{}]/g, "").toLowerCase();;
                for (var j = 0; j < rolesArray.length; j++) {
                    if (HomeCaso.GuidsAreEqual(userRole, rolesArray[j])) {
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

    GuidsAreEqual: function (guid1, guid2) {
        var isEqual;
        if (guid1 === null || guid2 === null || guid1 === undefined || guid2 === undefined) {
            isEqual = false;
        }
        else {
            isEqual = guid1.replace(/[{}]/g, "").toLowerCase() === guid2.replace(/[{}]/g, "").toLowerCase();
        }
        return isEqual;
    },
};