
function loadfestivos(){
	comprobarconapi();

	var festivostabla = document.getElementById('tablafestivos');
	const db = firebase.database();
	var festivos = db.ref("timeTableShop/holidays");
	


	festivos.once('value').then(function (snapshot) {
		snapshot.forEach(function (info){
			var dia= info.key;

			var tr = document.createElement("tr");
				tr.setAttribute("id",dia+"tr");
				//Crear boton borrar
				var tdbtn = document.createElement("td");
					tdbtn.setAttribute("class", "tdshop");
				//Crear fila con el dia
				var td = document.createElement("td");
					td.setAttribute("class", "tdshop");
				var name = document.createElement("text");
					name.setAttribute("class", "textinfoshop");
					name.innerHTML = dia;

				//-- Añadir boton
				var abtn = document.createElement("a");
					abtn.setAttribute("id",dia);
					abtn.setAttribute("onclick","borrarfestivo(this.id)");
					abtn.setAttribute("class"," btn btn-danger btn-circle btn-s");
				var ibtn = document.createElement("i");
					ibtn.setAttribute("class","fas fa-ban");
				//--
					abtn.appendChild(ibtn);
					tdbtn.appendChild(abtn);
					td.appendChild(name);
					tr.appendChild(td);
					tr.appendChild(tdbtn);

				festivostabla.appendChild(tr);
		});
	});
}
function borrarfestivo(idfestivo){
	const db = firebase.database();
	var festivos = db.ref("timeTableShop/holidays");
	festivos.child(idfestivo).remove().then(function(){
		swal("Borrado el festivo", {
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
function insertarfestivo(){
	var borrarbtnupdate = document.getElementById('borrarbtninsert'),
	acceptarbtnupdate = document.getElementById('acceptarinsert'),
	overlayinsert = document.getElementById('overlay'),
	popupinsert = document.getElementById('popup'),
	input = document.getElementById('holidayss'),
	btnCerrarPopupupdate = document.getElementById('btn-cerrar-popup-update');
	const db = firebase.database();
	var año = moment().format('YYYY');
	
	var inputpicker = new Picker(input, {
		format: 'MM-DD',
		headers: true,
		text: {
			title: 'Selecciona una fecha',
			cancel: 'Cancelar',
			confirm: 'Acceptar',
			month: 'Mes',
			day: 'Dia',
		  },
	});
	overlayinsert.classList.add('active');
	popupinsert.classList.add('active');

					acceptarbtnupdate.addEventListener('click', function(){
						var fechainsertar= año+"-"+inputpicker.getDate(true);
						var fechainsertarstart = moment(fechainsertar+"T00:00:00").format('YYYY-MM-DDTHH:mm:ss');
						var fechainsertarend = moment(fechainsertar+"T23:59:59").format('YYYY-MM-DDTHH:mm:ss');
						var rutafestivo = db.ref("timeTableShop/holidays/"+fechainsertar);

						rutafestivo.set({endDate:fechainsertarstart,startDate:fechainsertarend}).then(function(){
							swal("Insertado el festivo", {
								icon: "success",
							}).then(function () {
								location.reload();
							});
						}).catch(function(Err){
							swal("Error al introducir los datos en el servidor", {
								icon: "error",
							});
							console.error(Err);
						});
					});
					
					btnCerrarPopupupdate.addEventListener('click', function (e) {
						e.preventDefault();
						overlayinsert.classList.remove('active');
						popupinsert.classList.remove('active');
						swal("Cancelada operación", {
							icon: "info",
						}).then(function () {
							location.reload();
						});
					});

					borrarbtnupdate.addEventListener('click', function (e) {
						e.preventDefault();
						overlayinsert.classList.remove('active');
						popupinsert.classList.remove('active');
						swal("Cancelada operación", {
							icon: "info",
						}).then(function () {
							location.reload();
						});
					});
}

