function validate() {
  let user = document.getElementById('user').value;
  let regex = /^\d{4}$/;

  if (!regex.test(user)) {
    alert("El nombre de usuario es incorrecto"); // TODO Aquí falta meter un else if para conectarse a la base datos
  } else if () {
    
  } else {

  }
}




function register() {
  url = "registro.html";
  let new_window = window.open(url, "_blanck", "width=200px,heigth=200px");
}