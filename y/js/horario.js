function updatetimetable(){
	comprobarconapi();
	var arrayfechasstart=[];
	var arraypickerstart=[];
	var arrayfechasend=[];
	var arraypickerend=[];
	var lunesstart = document.getElementById('lunesstart'),
	lunesend = document.getElementById('lunesend'),
	martesstart = document.getElementById('martesstart'),
	martesend = document.getElementById('martesend'),
	miercolesstart = document.getElementById('miercolesstart'),
	miercolessend = document.getElementById('miercolesend'),
	juevesstart = document.getElementById('juevesstart'),
	juevesend = document.getElementById('juevesend'),
	viernesstart = document.getElementById('viernesstart'),
	viernesend = document.getElementById('viernesend'),
	sabadostart = document.getElementById('sabadostart'),
	sabadoend = document.getElementById('sabadoend'),
	domingostart = document.getElementById('domingostart'),
	domingoend = document.getElementById('domingoend'),
	lunesstartx,lunesendx,
	martesstartx,martesendx,
	miercolesstartx,miercolessendx,
	juevesstartx,juevesendx,
	viernesstartx,viernesendx,
	sabadostartx,sabadoendx,
	domingostartx,domingoendx;

	arrayfechasstart.push(lunesstart,martesstart,miercolesstart,juevesstart,viernesstart,sabadostart,domingostart);
	arrayfechasend.push(lunesend,martesend,miercolessend,juevesend,viernesend,sabadoend,domingoend);
	arraypickerstart.push(lunesstartx,martesstartx,miercolesstartx,juevesstartx,viernesstartx,sabadostartx,domingostartx);
	arraypickerend.push(lunesendx,martesendx,miercolessendx,juevesendx,viernesendx,sabadoendx,domingoendx);
	
	const db = firebase.database();
	var horarios= db.ref("timeTableShop/scheduleShop");
	
	horarios.once('value').then(function (snapshot) {
		snapshot.forEach(function(dia){
			
			var tipodedia= dia.key;
			
			var value= dia.val();
			if(tipodedia == 1){
				lunesstart.setAttribute("value",value.startDate);
				lunesend.setAttribute("value",value.endDate);
			}else if(tipodedia == 2){
				martesstart.setAttribute("value",value.startDate);
				martesend.setAttribute("value",value.endDate);
			}
			else if(tipodedia == 3){
				miercolesstart.setAttribute("value",value.startDate);
				miercolessend.setAttribute("value",value.endDate);
			}
			else if(tipodedia == 4){
				juevesstart.setAttribute("value",value.startDate);
				juevesend.setAttribute("value",value.endDate);
			}
			else if(tipodedia == 5){
				viernesstart.setAttribute("value",value.startDate);
				viernesend.setAttribute("value",value.endDate);
			}
			else if(tipodedia == 6){
				sabadostart.setAttribute("value",value.startDate);
				sabadoend.setAttribute("value",value.endDate);
			}else{
				domingostart.setAttribute("value",value.startDate);
				domingoend.setAttribute("value",value.endDate);
			}

		});
	});

	for (x = 0;x < arrayfechasstart.length;x++){
		 arraypickerstart[x] = new Picker(arrayfechasstart[x], {
			format: 'HH:mm',
			headers: true,
			text: {
				title: 'Selecciona hora de entrada',
				cancel: 'Cancelar',
				confirm: 'Acceptar',
				hour: 'Hora',
				minute: 'Minuto',
			  },
		});
	}
	for (x = 0;x < arrayfechasend.length;x++){
		arraypickerend[x] = new Picker(arrayfechasend[x], {
			format: 'HH:mm',
			headers: true,
			text: {
				title: 'Selecciona hora de salida',
				cancel: 'Cancelar',
				confirm: 'Acceptar',
				hour: 'Hora',
				minute: 'Minuto',
			  },
		});
	}
	

}
function updatearhorario(){
	var lunesstart = document.getElementById('lunesstart').value,
lunesend = document.getElementById('lunesend').value,
martesstart = document.getElementById('martesstart').value,
martesend = document.getElementById('martesend').value,
miercolesstart = document.getElementById('miercolesstart').value,
miercolessend = document.getElementById('miercolesend').value,
juevesstart = document.getElementById('juevesstart').value,
juevesend = document.getElementById('juevesend').value,
viernesstart = document.getElementById('viernesstart').value,
viernesend = document.getElementById('viernesend').value,
sabadostart = document.getElementById('sabadostart').value,
sabadoend = document.getElementById('sabadoend').value,
domingostart = document.getElementById('domingostart').value,
domingoend = document.getElementById('domingoend').value;
const db = firebase.database();
var horarios= db.ref("timeTableShop/scheduleShop");
horarios.once('value').then(function (snapshot) {
	snapshot.forEach(function(dia){
		
		var tipodedia= dia.key;
		var diaruta = db.ref("timeTableShop/scheduleShop/"+tipodedia);

		if(tipodedia == 1){
			diaruta.update({ endDate:lunesend,startDate:lunesstart }).catch(function(err){
				console.error(err);
				swal("Error al introducir los datos en el servidor", {
					icon: "error",
				});
			});
		}else if(tipodedia == 2){
			diaruta.update({ endDate:martesend,startDate:martesstart }).catch(function(err){
				console.error(err);
				swal("Error al introducir los datos en el servidor", {
					icon: "error",
				});
			});
		}
		else if(tipodedia == 3){
			diaruta.update({ endDate:miercolessend,startDate:miercolesstart }).catch(function(err){
				console.error(err);
				swal("Error al introducir los datos en el servidor", {
					icon: "error",
				});
			});
		}
		else if(tipodedia == 4){
			diaruta.update({ endDate:juevesend,startDate:juevesstart }).catch(function(err){
				console.error(err);
				swal("Error al introducir los datos en el servidor", {
					icon: "error",
				});
			});
		}
		else if(tipodedia == 5){
			diaruta.update({ endDate:viernesend,startDate:viernesstart }).catch(function(err){
				console.error(err);
				swal("Error al introducir los datos en el servidor", {
					icon: "error",
				});
			});
		}
		else if(tipodedia == 6){
			diaruta.update({ endDate:sabadoend,startDate:sabadostart }).catch(function(err){
				console.error(err);
				swal("Error al introducir los datos en el servidor", {
					icon: "error",
				});
			});
		}else{
			diaruta.update({ endDate:domingoend,startDate:domingostart}).catch(function(err){
				console.error(err);
				swal("Error al introducir los datos en el servidor", {
					icon: "error",
				});
			});
		}
	});
	//tot ok
	swal("Actualizado el horario", {
		icon: "success",
	}).then(function () {
		location.reload();
	});
}).catch(function(err){
	console.error(err);
	swal("Error al introducir los datos en el servidor", {
		icon: "error",
	});
});

}