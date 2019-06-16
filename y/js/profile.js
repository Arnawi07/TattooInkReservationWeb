function loadinfoshop(){
	comprobarconapi();
	var nombretienda = document.getElementById('nombretienda');
	var direcciontienda = document.getElementById('direcciontienda');
	var correotienda = document.getElementById('correotienda');
	var telefonotienda = document.getElementById('telefonotienda');
	const db = firebase.database();
	var infoshop = db.ref("tattooShops");

	infoshop.once('value').then(function (snapshot) {
		snapshot.forEach(function (info){
			var datos= info.val();
			nombretienda.innerHTML = datos.name;
			direcciontienda.innerHTML = datos.address;
			correotienda.innerHTML = datos.email;
			telefonotienda.innerHTML = datos.phone;
		})
	
	});
}
function updateshop(){
	var nombretienda = document.getElementById('editname').value;
	var direcciontienda = document.getElementById('editdirection').value;
	var correotienda = document.getElementById('editemail').value;
	var telefonotienda = document.getElementById('editphone').value;
	const db = firebase.database();
	var infoshop = db.ref("tattooShops/-Lf0JBoNrJ6IX0_qtINX");

	if(nombretienda==null||direcciontienda==null||correotienda==null||telefonotienda==null || telefonotienda.length !=9|| !/^([0-9])*$/.test(telefonotienda) ||!correotienda.includes("@")){
		swal("Error falta información o no es correcta", {
			icon: "error",
		});
	}else{

		infoshop.update({ address: direcciontienda, email:correotienda, name: nombretienda, phone: telefonotienda }).then(function(){

			swal("Actualizado los datos", {
				icon: "success",
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