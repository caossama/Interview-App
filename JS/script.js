function validate() {
  let user = document.getElementById('user').value;
  let regex = /^\d{4}$/;

  if (!regex.test(user)) {
    alert("El nombre de usuario es incorrecto"); // TODO Aquí falta meter un else if para conectarse a la base datos
  }
}



function register() {
  const screenWidth = screen.width;
  const screenHeight = screen.height;

  let centerX = (screenWidth - 500)/2;
  let centerY = (screenHeight - 400)/2;

  url = "registro.html";
  let newWindow = window.open(url, "_blank", "width=500,height=400");
  newWindow.moveTo(centerX, centerY);
}