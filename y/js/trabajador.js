function trabajadorestabla(){
	comprobarconapi();

	var trabajadortabla = document.getElementById('tablatrabajadores');
	const db = firebase.database();
	var workers = db.ref("employees"),
	nameTimeTable;
	


	workers.once('value').then(function (snapshot) {
		snapshot.forEach(function (info){
			var datos= info.val();
			var atributos = [];
			atributos.push(datos.name);
			atributos.push(datos.surname);
			atributos.push(datos.email);
			atributos.push(datos.phone);
			nameTimeTable = datos.nameTimeTable;
			var num = atributos.length - 1;

			var tr = document.createElement("tr");
				tr.setAttribute("id",nameTimeTable+"tr");
			for (x = 0 ; x < atributos.length; x++){
				var td = document.createElement("td");
					td.setAttribute("class", "tdshop");
				var name = document.createElement("text");
					name.setAttribute("class", "textinfoshop");
					name.innerHTML = atributos[x];
					td.appendChild(name);
					tr.appendChild(td);
				if(x==num){
				var td = document.createElement("td");
					td.setAttribute("class", "tdshop");
				
				var a = document.createElement("a");
					a.setAttribute("id",nameTimeTable);
					a.setAttribute("onclick","borrartrabajador(this.id)");
					a.setAttribute("class"," btn btn-danger btn-circle btn-sm");
				var i = document.createElement("i");
					i.setAttribute("class","fas fa-ban");
				var aupdate = document.createElement("a");
					aupdate.setAttribute("id",nameTimeTable);
					aupdate.setAttribute("onclick","updateartrabajador(this.id)");
					aupdate.setAttribute("class"," btn btn-primary btn-circle btn-sm");
				var iupdate = document.createElement("i");
					iupdate.setAttribute("class","fas fa-user");

					a.appendChild(i);
					aupdate.appendChild(iupdate);
					td.appendChild(aupdate)
					td.appendChild(a);
					tr.appendChild(td);
				}
			}
			trabajadortabla.appendChild(tr);
		});
	});
}
function updateartrabajador(trabajador){
	var borrarbtnupdate = document.getElementById('borrarbtninfo'),
	acceptarbtnupdate = document.getElementById('acceptarinfo'),
	overlayupdate = document.getElementById('overlayupdate'),
	popupupdate = document.getElementById('popupupdate'),
	btnCerrarPopupupdate = document.getElementById('btn-cerrar-popup-update');
	const db = firebase.database();
	var workers = db.ref("employees/"+trabajador);

	overlayupdate.classList.add('active');
	popupupdate.classList.add('active');

					acceptarbtnupdate.addEventListener('click', function(){
						var editemail = document.getElementById('editemailwk').value,
						editphone = document.getElementById('editphonewk').value;
						if(editemail==null||editphone==null || editphone.length !=9|| !/^([0-9])*$/.test(editphone) ||!editemail.includes("@")){
							swal("Error falta información o no es correcta", {
								icon: "error",
							});
						}else{
							workers.update({ email:editemail,phone: editphone }).then(function(){

								swal("Actualizado los datos", {
									icon: "success",
								}).then(function () {
									location.reload();
								});
							}).catch(function(err) {
								swal("Error al introducir los datos en el servidor", {
									icon: "error",
								});
								console.error(err);
							});
						}
					});
					
					btnCerrarPopupupdate.addEventListener('click', function (e) {
						e.preventDefault();
						overlayupdate.classList.remove('active');
						popupupdate.classList.remove('active');
						swal("Cancelada operación", {
							icon: "info",
						}).then(function () {
							location.reload();
						});
					});

					borrarbtnupdate.addEventListener('click', function (e) {
						e.preventDefault();
						overlayupdate.classList.remove('active');
						popupupdate.classList.remove('active');
						swal("Cancelada operación", {
							icon: "info",
						}).then(function () {
							location.reload();
						});
					});
}
function borrartrabajador(trabajador){
	var trabajadortabla = document.getElementById('tablatrabajadores');
	var traborrar = document.getElementById(trabajador + "tr");
	const db = firebase.database();
	var workers = db.ref("employees");
	var workerscitas = db.ref("timeTables");
	workers.child(trabajador).remove().then(function () {
		trabajadortabla.removeChild(traborrar);
		workerscitas.child(trabajador).remove().then(function (totook){
			swal("Borrado el trabajador", {
				icon: "success",
			}).then(function () {
				location.reload();
			});
		}).catch(function(error){
			console.log(error);
			swal("Error al borrar el trabajador", {
				icon: "error",
			});
		});
	}).catch(function(error){
		console.log(error);
		swal("Error al borrar el trabajador", {
			icon: "error",
		});
	});
	

}
function insertworker(){
	modificaridioma();
	var nombretrabajador = document.getElementById('newname').value;
	var apellidotrabajador = document.getElementById('newapellido').value;
	var correottrabajdor = document.getElementById('newemail').value;
	var telefonotrabajador = document.getElementById('newphone').value;
	const db = firebase.database();
	var nameTimeTablename = nombretrabajador+"_"+apellidotrabajador;
	nameTimeTablename.replace(/ /g, "");
	var mes = moment().format('MMMM');
	var dia = moment().format('YYYY-MM-DD');
	var start = moment().format("YYYY-MM-DDTHH:mm:ss");
	var cita = {
		displayName: "creación usuario",
		endDate: start,
		startDate: start,
		uidClient: "anonymous12321Uv"
	}
	var workers = db.ref("employees/"+nameTimeTablename);
	var workerscitas = db.ref("timeTables/"+nameTimeTablename+"/"+mes+"/"+dia);

	if(nombretrabajador==null||apellidotrabajador==null||correottrabajdor==null||telefonotrabajador==null || telefonotrabajador.length !=9|| !/^([0-9])*$/.test(telefonotrabajador) ||!correottrabajdor.includes("@")){
		swal("Error falta información o no es correcta", {
			icon: "error",
		});
	}else{

		workers.set({ email:correottrabajdor, name: nombretrabajador, nameTimeTable: nameTimeTablename,phone: telefonotrabajador, surname: apellidotrabajador}).then(function(){
			workerscitas.push(cita).then(function(){
				swal("Actualizado los datos", {
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
		}).catch(function(err) {
			swal("Error al introducir los datos en el servidor", {
				icon: "error",
			});
			// This will be an "population is too big" error.
			console.error(err);
		});
	}
}