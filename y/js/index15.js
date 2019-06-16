const arraydecitas = [];
const arraydetrabajadores = [];
const festivos = [];
const horarios = [];
var durationtatto = 0;
var insertar = true;


function logincomp() {
	const db = firebase.database();
	var useremail = document.getElementById("usuario").value;
	var password = document.getElementById("password").value;
	var user = firebase.auth().currentUser;
	var idAdmin = db.ref("administrators");

	firebase.auth().signInWithEmailAndPassword(useremail, password).then(function () {
		var usuario = firebase.auth().currentUser;
		var uid = usuario.uid;
		comprobar();
		idAdmin.once('value').then(function (snapshot) {
			snapshot.forEach(function (userSnapshot) {
				var username = userSnapshot.val();
				if (uid == username.uid) {
					window.open("inicio.html", '_self');
				}
			});
		});

	}).catch(function (error) {
		var errorCode = error.code;
		var errorMessage = error.message;
		alert("Error la contrasenya o el email son incorrectos")
	});
	
}
function logout(){
	firebase.auth().signOut().catch(function(error) {
		console.log("Error "+error); 
	  });
}
function comprobar() {
	firebase.auth().onAuthStateChanged(function (user) {
		console.log(user)
		if (!user) {
			window.open("index.html", "_self");
		} else {
			var email = user.email;
			document.getElementById("nombre").innerHTML = email;
		}
	});
	/*var user = firebase.auth().currentUser;
	alert(user)
	if (user) {
		var email = user.email;
		document.getElementById("nombre").innerHTML = email;
		} else {
			window.open("comprobar.html", "_self");
		}*/
}
function comprobarconapi(){
	api();
	comprobar();
}
function inicializartattos() {
	const db = firebase.database();
	var TattoTypequeño = db.ref("TattoType/pequeño");
	var TattoTypemediano = db.ref("TattoType/mediano");
	var TattoTypegrande = db.ref("TattoType/grande");
	var pequeño = {
		duration: "30"
	};
	var mediano = {
		duration: "60"
	};
	var grande = {
		duration: "120"
	};
	TattoTypequeño.push(pequeño);
	TattoTypemediano.push(mediano);
	TattoTypegrande.push(grande);
}
function inicializar() {
	const db = firebase.database();
	var tattooShops = db.ref("tattooShops");
	var tienda = {
		name: "Tattoos SL",
		address: "Carrer Aclarmount nª23 1A",
		email: "lostattosdebcnsl@gmail.com",
		phone: "937734567"
	};
	tattooShops.push(tienda);


	var TimeTable = db.ref("TimeTable/paco_manolo");
	var horario = {
		UIDcliente: "dKxUY52t0hgNDF1Owd0ZPytT59o1",
		dataini: "10-06-2019 18:00:00",
		datafin: "10-06-2019 18:30:00",
	};
	TimeTable.push(horario);
	var Employee = db.ref("Employee");
	var empleado = {
		name: "paco",
		surname: "manolo",
		email: "lostattosdebcnsl@gmail.com",
		phone: "937734567"
	};
	Employee.push(empleado);

	var Administrators = db.ref("Administrators");
	var id = {
		UID: "X1lmiGs5zNXqdNSwpIVTfQhNVzf1",
	};
	Administrators.push(id);
}
function writeUserData(userId, name, email, imageUrl) {
	firebase.database().ref('users/' + userId).set({
		username: name,
		email: email,
		profile_picture: imageUrl
	});
}
function calendario() {
	comprobarconapi();
	const db = firebase.database();
	var contador = 0;
	var titulo, endDate, startDate, uidClientes;

	var cargarcalendario = db.ref("timeTables");

	var festivostienda = db.ref("timeTableShop/holidays");
	var num = 0;

	festivostienda.once('value').then(function (snapshot) {
		
		snapshot.forEach(function (dia) {
			var cont = 0;
			dia.forEach(function (festivo) {
				if (cont == 0) {
					var fecha = moment(festivo.val()).format('YYYY-MM-DD');
					festivos.push(fecha);
				}
				cont++;
			});
		});
	});


	cargarcalendario.once('value').then(function (snapshot) {
		snapshot.forEach(function (userSnapshot) {
			//.key sabemos el nombre
			var trabajador = document.createElement("a");
			trabajador.setAttribute("id", userSnapshot.key);
			trabajador.setAttribute("class", "dropdown-item");
			//trabajador.onclick = load_calendar(userSnapshot.key);
			trabajador.setAttribute("onclick", "load_calendar(this.id);");
			trabajador.innerHTML = userSnapshot.key;
			document.getElementById('calendario-trabajador').appendChild(trabajador);
			//console.log(username.UID);
			arraydetrabajadores.push(userSnapshot.key);
			var contenedordecitas = [];
			userSnapshot.forEach(function (mes) {
				mes.forEach(function (dia) {
					console.log()
					dia.forEach(function (datos) {
						datos.forEach(function (reservas) {
							if (contador == 0) {
								titulo = reservas.val();
								contador++;
							}
							else if (contador == 1) {
								endDate = reservas.val();
								contador++;
							} else if (contador == 2) {
								startDate = reservas.val();
								contador++;
							} else {
								uidClientes = reservas.val()
								contador = 0;
							}
						});
						contenedordecitas.push({ 'id': datos.key, 'title': titulo, 'start': startDate, 'end': endDate, 'textColor': "#FFFFFF" });
						console.log("contenedor" + contenedordecitas);
					});
				});
			});
			festivos.forEach(function (festivo) {
				contenedordecitas.push({ 'id': "festivo", 'title': "festivo", 'start': festivo, 'allDay': true, 'editable': false, 'backgroundColor': "#F00" });
			})
			arraydecitas.push(contenedordecitas);
			if (num == 0) {
				load_calendar(userSnapshot.key);
				num++;
			}
		});
	});



	//fin calendario

}

function load_calendar(id) {
	const db = firebase.database();

	//calendario
	//posible modificacion introducir json
	var posicion;
	for (posicion = 0; posicion < arraydetrabajadores.length; posicion++) {
		if (id == arraydetrabajadores[posicion]) {
			break;
		}
	};
	modificaridioma();
	var diaactual = moment().format('YYYY-MM-DD');
	var calendarEl = document.getElementById('calendar');
	var titulocalendario = document.getElementById('titulocalendario');
	var nombre= id.split("_");
	titulocalendario.innerHTML = "Calendario de "+nombre[0]+" "+nombre[1];
	if (calendarEl.hasChildNodes()) {
		while (calendarEl.childNodes.length >= 1) {
			calendarEl.removeChild(calendarEl.firstChild);
		}
	}
	var calendar = new FullCalendar.Calendar(calendarEl, {
		plugins: ['interaction', 'dayGrid', 'timeGrid', 'list'],
		height: 'parent',
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
		},
		listWeekNames: 'Semana',
		defaultView: 'dayGridMonth',
		defaultDate: diaactual,
		navLinks: true, // can click day/week names to navigate views
		editable: false,
		eventLimit: true, // allow "more" link when too many events
		locale: 'es',
		buttonText: {
			today: 'Hoy',
			month: 'Mes',
			week: 'Semana',
			day: 'Dia',
			list: 'Lista',
		},
		events: function (fetchInfo, successCallback, failureCallback) {
			var array = arraydecitas[posicion];
			successCallback(array)
		},
		eventDestroy: function (info) {
			console.log(info.event.title);
			console.log(info.el);
			console.log(info.view);
		},
		eventRender: function (info) {
			var trabajador = document.createElement("a");
			var forma = document.createElement("i");
			trabajador.setAttribute("class", "btn btn-danger btn-circle btn-sm");
			forma.setAttribute("class", "fas fa-trash");
			//terminar -> trabajador.setAttribute("onclick",);
			trabajador.setAttribute("onclick", "borrar_evento(this.parentNode)");
			trabajador.appendChild(forma);
			//trabajador.setAttribute("onclick",event.remove());
			info.el.removeChild(info.el.firstChild);
			info.el.append(info.event.title);
			//info.event.title , trabajador
		},
		eventClick: function (info) {

			if (info.event.id != "festivo") {
				var borrarbtn = document.getElementById('borrarbtn'),
					overlay = document.getElementById('overlay'),
					popup = document.getElementById('popup'),
					titulo = document.getElementById('day-admin-upordel'),
					subtitulo = document.getElementById('day-admin-name'),
					btnCerrarPopup = document.getElementById('btn-cerrar-popup'),
					btnUpdate = document.getElementById('updatebtn');

				var horastartthis = moment(info.event.start).format();
				var mes = moment(info.event.start).format('MMMM');
				var dia = moment(info.event.start).format('YYYY-MM-DD');
				var pathevent = "timeTables";
				//abrir popup
				var daywithhour = moment(info.event.start).format("YYYY-MM-DDTHH:mm:ss");

				titulo.innerHTML = "Administrar dia " + daywithhour;
				subtitulo.innerHTML = "Para " + info.event.title;


				overlay.classList.add('active');
				popup.classList.add('active');

				//crear btn cerrar
				btnCerrarPopup.addEventListener('click', function (e) {
					e.preventDefault();
					overlay.classList.remove('active');
					popup.classList.remove('active');
					swal("Cancelada operación", {
						icon: "info",
					}).then(function () {
						location.reload();
					});
				});
				//crear btn borrar
				borrarbtn.addEventListener('click', function (e) {
					e.preventDefault();
					overlay.classList.remove('active');
					popup.classList.remove('active');
					swal({
						title: "Estas seguro?",
						text: "Una vez eliminiada la cita no se podra recuperar",
						icon: "warning",
						buttons: true,
						dangerMode: true
					}).then((continuar) => {

						if (continuar) {

							arraydecitas[posicion].forEach(function (event) {
								var horastartevent = moment(event.start).format()
								if (event.id == info.event.id && horastartevent == horastartthis) {
									event.remove;
									borrar_evento(info.event);
									db.ref(pathevent).child(id + "/" + mes + "/" + dia + "/" + info.event.id).remove().then(function () {
										console.log("Document successfully deleted!");
										swal("Tu cita se ha eliminado corectamente", {
											icon: "success",
										}).then(function () {
											location.reload();
										});
									}).catch(function (error) {
										swal("Error a borrar la cita.", {
											icon: "error",
										});
										console.error("Error removing document: ", error);
									});
								}
							});

						} else {
							swal("Cancelada la operación", {
								icon: "info",
							});
						}
					});
				});

				//crear btn update
				btnUpdate.addEventListener('click', function (e) {
					var borrarbtnupdate = document.getElementById('borrarbtnupdate'),
						acceptarbtnupdate = document.getElementById('acceptarbtnupdate'),
						overlayupdate = document.getElementById('overlayupdate'),
						popupupdate = document.getElementById('popupupdate'),
						btnCerrarPopupupdate = document.getElementById('btn-cerrar-popup-update'),
						input = document.getElementById('inputupdate');
					var pickerupdate = new Picker(input, {
						format: 'YYYY-MM-DD HH:mm',
						headers: true,
						increment: {
							minute: 15,
						},
						text: {
							title: 'Selecciona una fecha',
							cancel: 'Cancelar',
							confirm: 'Acceptar',
							year: 'Año',
							month: 'Mes',
							day: 'Dia',
							hour: 'Hora',
							minute: 'Minuto',
							second: 'Segundo',
						  },
					});
					listatattoo(db, "typetattoosupdate");
					//Cerrar el anterior popup
					overlay.classList.remove('active');
					popup.classList.remove('active');
					//abrir popup
					overlayupdate.classList.add('active');
					popupupdate.classList.add('active');

					//btn x del update
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

					acceptarbtnupdate.addEventListener('click', function (e) {
						e.preventDefault();
						//---------------------------------------------------------------------------------------------
						if (durationtatto != 0) {
							var dayselected = moment(pickerupdate.getDate(true)).format("YYYY-MM-DDTHH:mm:ss");
							var fechafinal = moment(dayselected).add(durationtatto, 'minutes').format("YYYY-MM-DDTHH:mm:ss");
							var mesnuevo = moment(dayselected).format('MMMM');
							var dianuevo = moment(dayselected).format('YYYY-MM-DD');
							var referencia = db.ref("timeTables/" + id + "/" + mesnuevo + "/" + dianuevo);
							var fechacomprobarinicio;
							var enddateanonymo, startdateanonymo;
							var fechacomprobarfinal;
							var diastring=dianuevo.toString();
							var userid;

							comprobarhorario(db, dayselected, fechafinal, dayselected, dianuevo);
							comprobarfestivo(db, dayselected);

							referencia.once('value').then(function (snapshot) {

								//comprobar las citas
								if (snapshot.val() != null) {
									snapshot.forEach(function (userSnapshot) {
										var count = 0;
										userSnapshot.forEach(function (name) {
											if (count == 1) {
												fechacomprobarfinal = moment(name.val()).format("YYYY-MM-DDTHH:mm:ss");
											} else if (count == 2) {
												fechacomprobarinicio = moment(name.val()).format("YYYY-MM-DDTHH:mm:ss");
											} else if (count == 3) {
												if (moment(fechafinal).isSameOrBefore(fechacomprobarfinal) && moment(fechafinal).isAfter(fechacomprobarinicio)) {
													insertar = false;
												}
												if (moment(dayselected).isSameOrAfter(fechacomprobarinicio) && moment(dayselected).isBefore(fechacomprobarfinal)) {
													insertar = false;
												}
											}
											count++;
										});
									});
								}
								enddateanonymo = fechafinal.toString();
								startdateanonymo = dayselected.toString();
								//desactivar el popup

								if (insertar) {
									overlayupdate.classList.remove('active');
									popupupdate.classList.remove('active');
									db.ref(pathevent + "/" + id + "/" + mes + "/" + dia + "/" + info.event.id).once('value').then(function (dia) {
										var position = 0;
										dia.forEach(function (datos) {
												if (position == 3) {
													userid = datos.val()
												}
												position++;
											
										});
									});
									db.ref(pathevent).child(id + "/" + mes + "/" + diastring + "/" + info.event.id).remove().then(function () {
										var cita = {
											displayName: info.event.title,
											endDate: enddateanonymo,
											startDate: startdateanonymo,
											uidClient: userid
										}
										referencia.push(cita).then(function () {
											swal("Tu cita se ha actualizado corectamente", {
												icon: "success",
											}).then(function () {
												location.reload();
											});
										}).catch(function (error) {
											swal("Error a updatear la cita.", {
												icon: "error",
											});
											console.error("Error removing document: ", error);
										});

									}).catch(function (error) {
										swal("Error al updatear.", {
											icon: "error",
										});
										console.error("Error removing document: ", error);
									});

								} else {
									insertar = true;
									swal("Error esta hora esta ocupada \n o no esta en horario de trabajo", {
										icon: "error",
									})
								}

							});

						} else {
							swal("Error falta información", {
								icon: "error",
							});
						}

						//---------------------------------------------------------------------------------------------
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

				});
				//fin boton update
			} else {
				swal("Error esta haccediendo a un festivo", {
					icon: "error",
				});
			}
		},
		dateClick: function (info) {
			var diacomprobar = moment(info.dateStr).format();


			var thisday = moment().format();
			if (moment(diacomprobar).isSameOrAfter(thisday)) {
				var accountsanonymous = [];
				var nameuser = "";
				var uidanonimo = "";
				//funcion para cargar tattos
				listatattoo(db, "typetattoos");
				//Cargamos los usuarios que son anonymos en un array
				db.ref("anonymous").once('value').then(function (snapshot) {
					snapshot.forEach(function (userSnapshot) {
						uidanonimo = userSnapshot.val();
					});
				});
				db.ref("anonymousAccounts/Accounts").once('value').then(function (snapshot) {
					snapshot.forEach(function (userSnapshot) {
						var count = 0;
						userSnapshot.forEach(function (name) {
							if (count == 0) {
								nameanonymous = name.val();
							}
							count++;
						});
						accountsanonymous.push(nameanonymous);
					});
				});

				var borrarbtn = document.getElementById('borrarbtninsert'),
					searchinput = document.getElementById("myInput"),
					insertinput = document.getElementById("myInput2"),
					aceptarbtn = document.getElementById('acceptarinsert'),
					overlay = document.getElementById('overlayinsert'),
					popup = document.getElementById('popupinsert'),
					btnCerrarPopup = document.getElementById('btn-cerrar-popup-insert'),
					input = document.getElementById('inputinsert'),
					oculto = document.getElementById('openadd');

				//Seleccionar hora
				picker = new Picker(input, {
					format: 'HH:mm',
					headers: true,
					increment: {
						minute: 15,
					},
					text: {
						title: 'Selecciona una hora',
						cancel: 'Cancelar',
						confirm: 'Acceptar',
						year: 'Año',
						month: 'Mes',
						day: 'Dia',
						hour: 'Hora',
						minute: 'Minuto',
						second: 'Segundo',
						millisecond: 'Millisecond',
					  },
				});
				//Rellenar el buscador con los usuarios anonimos.
				autocomplete(searchinput, accountsanonymous);
				//Abrir popup
				overlay.classList.add('active');
				popup.classList.add('active');
				//Boton x del popup
				btnCerrarPopup.addEventListener('click', funcion = function (e) {
					e.preventDefault();
					overlay.classList.remove('active');
					popup.classList.remove('active');
					elimiarListener();
					swal("Cancelada operación", {
						icon: "info",
					}).then(function () {
						location.reload();
					});
				});
				//Boton aceptar
				aceptarbtn.addEventListener('click', funcion = function (e) {
					e.preventDefault();
					if (durationtatto != 0) {

						var conjunto = info.dateStr + "T" + picker.getDate(true) + ":00";
						var dayselected = moment(conjunto).format("YYYY-MM-DDTHH:mm:ss");
						var fechafinal = moment(dayselected).add(durationtatto, 'minutes').format("YYYY-MM-DDTHH:mm:ss");
						var mes = moment(info.dateStr).format('MMMM');
						var dia = moment(info.dateStr).format('YYYY-MM-DD');
						var referencia = db.ref("timeTables/" + id + "/" + mes + "/" + dia);
						var fechacomprobarinicio;
						var enddateanonymo, startdateanonymo;
						var fechacomprobarfinal;

						comprobarhorario(db, diacomprobar, fechafinal, dayselected, info.dateStr);
						comprobarfestivo(db, diacomprobar);

						referencia.once('value').then(function (snapshot) {

							//comprobar las citas
							if (snapshot.val() != null) {
								snapshot.forEach(function (userSnapshot) {
									var count = 0;
									userSnapshot.forEach(function (name) {
										if (count == 1) {
											fechacomprobarfinal = moment(name.val()).format("YYYY-MM-DDTHH:mm:ss");
										} else if (count == 2) {
											fechacomprobarinicio = moment(name.val()).format("YYYY-MM-DDTHH:mm:ss");
										} else if (count == 3) {
											if (moment(fechafinal).isSameOrBefore(fechacomprobarfinal) && moment(fechafinal).isAfter(fechacomprobarinicio)) {
												insertar = false;
											}
											if (moment(dayselected).isSameOrAfter(fechacomprobarinicio) && moment(dayselected).isBefore(fechacomprobarfinal)) {
												insertar = false;
											}
										}
										count++;
									});
								});
							}
							enddateanonymo = fechafinal.toString();
							startdateanonymo = dayselected.toString();
							if (oculto.style.display === 'block') {
								nameuser = searchinput.value;
							} else if (insertinput.value != null) {
								nameuser = insertinput.value;
								db.ref("anonymousAccounts/Accounts").push({ name: nameuser, uid: uidanonimo }).catch(function (error) {
									console.log(error);
								});
							} else {
								return false;
							}
							//desactivar el popup
							if (nameuser != null) {
								overlay.classList.remove('active');
								popup.classList.remove('active');
								elimiarListener();
								if (insertar) {
									var cita = {
										displayName: nameuser,
										endDate: enddateanonymo,
										startDate: startdateanonymo,
										uidClient: uidanonimo
									}
									referencia.push(cita).then(function () {
										swal("Tu cita se ha creado corectamente", {
											icon: "success",
										}).then(function () {
											location.reload();
										});
									}).catch(function (error) {
										swal("Error a borrar la cita.", {
											icon: "error",
										});
										console.error("Error removing document: ", error);
									});
								} else {
									insertar = true;
									swal("Error esta hora esta ocupada \n o no esta en horario de trabajo", {
										icon: "error",
									})
								}
							} else {
								swal("Error falta información", {
									icon: "error",
								})
							}
						});

					} else {
						swal("Error falta información", {
							icon: "error",
						});
					}


				});
				//Boton cancelar
				borrarbtn.addEventListener('click', funcion = function (e) {
					e.preventDefault();
					overlay.classList.remove('active');
					popup.classList.remove('active');
					elimiarListener();
					swal("Cancelada operación", {
						icon: "info",
					}).then(function () {
						location.reload();
					});
				});
				function elimiarListener() {
					aceptarbtn.removeEventListener('click', funcion);
					btnCerrarPopup.removeEventListener('click', funcion);
					borrarbtn.removeEventListener('click', funcion);
				}
			} else {
				swal("Error, selecciona un dia real", {
					icon: "error",
				})
			}
		}

	});
	//calendar.next(); para trabajar con el - es como inizalicarlo
	//calendar.addEvent(array); aññadir eventos pero no funciona correctamente
	calendar.render();

	//fin calendario
}

function borrar_evento(evento) {
	evento.remove();
}
function modificaridioma() {
	moment.locale('es', {
		months: 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
		monthsShort: 'Enero._Feb._Mar_Abr._May_Jun_Jul._Ago_Sept._Oct._Nov._Dec.'.split('_'),
		weekdays: 'Domingo_Lunes_Martes_Miercoles_Jueves_Viernes_Sabado'.split('_'),
		weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
		weekdaysMin: 'Do_Lu_Ma_Mi_Ju_Vi_Sa'.split('_')
	});
}
function autocomplete(inp, arr) {
	/*the autocomplete function takes two arguments,
	the text field element and an array of possible autocompleted values:*/
	var currentFocus;
	/*execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function (e) {
		var a, b, i, val = this.value;
		/*close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) { return false; }
		currentFocus = -1;
		/*create a DIV element that will contain the items (values):*/
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		/*append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/*for each item in the array...*/
		for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				/*make the matching letters bold:*/
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				/*execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function (e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					/*close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function (e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) { //up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[currentFocus].click();
			}
		}
	});
	function addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[currentFocus].classList.add("autocomplete-active");
	}
	function removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}
	function closeAllLists(elmnt) {
		/*close all autocomplete lists in the document,
		except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}
function ocultar() {
	document.getElementById('closeadd').style.display = 'none';
	document.getElementById('openadd').style.display = 'block';
}

function mostrar() {
	document.getElementById('closeadd').style.display = 'block';
	document.getElementById('openadd').style.display = 'none';
}

function salta(Sel) {
	if (Sel.selectedIndex != 0) {
		durationtatto = Sel.options[Sel.selectedIndex].value;
	}
}
function comprobarhorario(db, diacomprobar, fechafinal, dayselected, date) {
	var fechadehorariofinal,
		fechadehorarioinicio,
		diadelasemana = moment(diacomprobar).isoWeekday();
	if (diadelasemana == 7) {
		diadelasemana = 0;
	}
	horariotienda = db.ref("timeTableShop/scheduleShop/" + diadelasemana);
	//comprobar horario
	horariotienda.once('value').then(function (snapshot) {
		var controlardia = 0;
		snapshot.forEach(function (dia) {
			var rest = dia.val();
			if (controlardia == 0) {
				conjunto = date + "T" + rest + ":00";
				fechadehorariofinal = moment(conjunto).format("YYYY-MM-DDTHH:mm:ss");
			} else if (controlardia == 1) {
				conjunto = date + "T" + rest + ":00";
				fechadehorarioinicio = moment(conjunto).format("YYYY-MM-DDTHH:mm:ss");
			}
			controlardia++;
			if(rest.endDate == "00:00"&&rest.startDate == "00:00"){
				insertar = false;
			}
		});
		if (moment(fechafinal).isAfter(fechadehorariofinal) || moment(fechafinal).isSameOrBefore(fechadehorarioinicio)) {
			insertar = false;
		}
		if (moment(dayselected).isBefore(fechadehorarioinicio) || moment(dayselected).isSameOrAfter(fechadehorariofinal)) {
			insertar = false;
		}
	});
}
function comprobarfestivo(db, diacomprobar) {
	var dia = moment(diacomprobar).format('YYYY-MM-DD'),
		horariotienda = db.ref("timeTableShop/holidays/" + dia.toString());
	//comprobar festivos
	horariotienda.once('value').then(function (snapshot) {
		if (snapshot.val() != null) {
			insertar = false;
		}

	});
}
function listatattoo(db, id) {
	//Cargamos la lista
	var tattotypes = document.getElementById(id);
	//borrar los hijos ya que pueden ser modificada la bbdd justo cuando cambias los valores o añades hijos
	if (tattotypes.hasChildNodes()) {
		while (tattotypes.childNodes.length > 2) {
			tattotypes.removeChild(tattotypes.lastChild);
		}
	}
	db.ref("tattooType").once('value').then(function (snapshot) {
		snapshot.forEach(function (userSnapshot) {
			var count = 0;
			userSnapshot.forEach(function (duration) {
				if (count == 1) {
					type = duration.val();
				}
				count++;
			});
			var key = userSnapshot.key;
			//insertamos los tipos de tatuajes con su duración
			var typestato = document.createElement("option");
			typestato.innerHTML = key;
			typestato.setAttribute("value", type);
			tattotypes.appendChild(typestato);
		});
	});
}




function api(){
	document.addEventListener('DOMContentLoaded', function() {
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥
        // // The Firebase SDK is initialized and available here!
        //
        // firebase.auth().onAuthStateChanged(user => { });
        // firebase.database().ref('/path/to/ref').on('value', snapshot => { });
        // firebase.messaging().requestPermission().then(() => { });
        // firebase.storage().ref('/path/to/ref').getDownloadURL().then(() => { });
        //
        // // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

        try {
          let app = firebase.app();
					let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
					console.log(">"+document.getElementById('load'))
          //document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;
        } catch (e) {
          console.error(e);
          //document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
        }
      });
}
