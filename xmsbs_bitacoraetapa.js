if (typeof(bitacoraetapa) == "undefined") {
    bitacoraetapa = {
        __namespace: true
    };    
}

bitacoraetapa = {
	
	//Función para desplegar iconos simulando un semaforo en un campo especifico de una vista no editable.
	displayIconTooltip: function (rowData, userLCID)
	{
        //debugger;
		var str = JSON.parse(rowData);
		var coldata = str.xmsbs_estadosla_Value; //cambiar por campo a referenciar.
		var coldataAux = str.xmsbs_estadosla; //cambiar por campo a referenciar.
		var imgName = "";
		var tooltip = "";
		switch (coldata)
		{
			case 1:
				imgName = "xmsbs_verde16";
				tooltip = "En Curso";
				break;
			case 2:
				imgName = "xmsbs_amarillo16";
				tooltip = "Por Vencer";
				break;
			case 3:
				imgName = "xmsbs_verde16";
				tooltip = "Correcto";
				break;
			case 4:
				imgName = "xmsbs_rojo16";
				tooltip = "Vencido";
				break;	
			case 5:
				imgName = "xmsbs_rojo16";
				tooltip = "Cancelado";
				break;		
			case 6:
				imgName = "xmsbs_verde16";
				tooltip = "En Pausa";
				break;					
			default:
				imgName = "";
				tooltip = "";
				break;
		}
		var resultarray = [imgName, tooltip];
		return resultarray;
	},	
	
};