var file;
function loadimage(){
	comprobarconapi();
	const db = firebase.database();
	var rutafestivo = db.ref("photosUrlHome");
	var ulcarusel = document.getElementById("ulcarusel");
	var arrayimgtitle = [];
	var img,inputimg,liimg,divimg,h6title,imatge,divgeneral,label,idinput=0;

	rutafestivo.once('value').then(function (snapshot) {
		snapshot.forEach(function (imagen){
			img = imagen.val();
			arrayimgtitle.push("img_firebase_"+idinput);
			inputimg=document.createElement("input");
			inputimg.setAttribute("type","radio");
			inputimg.setAttribute("name","radio-buttons");
			inputimg.setAttribute("id","img_firebase_"+idinput);
			if(idinput==0){
				inputimg.setAttribute("checked","true");
			}
			liimg = document.createElement("li");
			liimg.setAttribute("class","slide-container");
			divimg= document.createElement("div");
			divimg.setAttribute("class","slide-image");
			h6title = document.createElement("h6");
			h6title.innerHTML = img.title;
			imatge = document.createElement("img");
			imatge.setAttribute("src",img.url);

			divimg.appendChild(h6title);
			divimg.appendChild(imatge);
			liimg.appendChild(divimg);
			ulcarusel.appendChild(inputimg);
			ulcarusel.appendChild(liimg);
			idinput++;
		});
		divgeneral=document.createElement("div");
		divgeneral.setAttribute("class","carousel-dots");
		for(x = 0; x < arrayimgtitle.length ;x++){
			label=document.createElement("label");
			label.setAttribute("for",arrayimgtitle[x]);
			label.setAttribute("class","carousel-dot");
			label.setAttribute("id","img_dot_"+x)
			divgeneral.appendChild(label);
		}
		ulcarusel.appendChild(divgeneral);
	});

	
}
function onFilePicked(event){
		var input = event.target;
		file = input.files[0];
}
function subirfoto(){
	var inputname=document.getElementById('tituloimg').value;
	var enlace ;
	var timestamp = Date.now();
	const db = firebase.database();
	var rutafestivo = db.ref("photosUrlHome");
	if(inputname!= null&&inputname.length>0){
	firebase.storage().ref("photosHome/"+file.name).put(file).then(function(snapshot) {
		
	  firebase.storage().ref('photosHome').child(file.name).getDownloadURL().then(function (asd){
		enlace = asd;
		rutafestivo.push ({creationDate:timestamp,title:inputname,url:enlace}).then(function(){
			swal("Inserción realizada", {
				icon: "success",
			}).then(function () {
				location.reload();
			});
		}).catch(function(err){
			console.log(err);
			swal("Error al insertar", {
				icon: "error",
			});
		});

		}).catch(function(err){
			console.log(err);
			swal("Error al insertar", {
				icon: "error",
			})
		}); 
	}).catch(function(err){
		console.log(err);
		swal("Error al insertar", {
			icon: "error",
		})
	});
	}else{
		swal("Falta el titulo", {
			icon: "error",
		})
	}
}