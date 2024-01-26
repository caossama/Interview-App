const regexUser = /^\d{4}$/;
const regexPass = /^\d{4}$/;
//const regexPass = /^(?=.*[A-Z])(?=.*\d)(?!.*[&ñ@;_])[\w\d]{8,}$/;

// Función para validar el campo del usuario de manera dinámica
function userValidate() {
  let user = document.getElementById('user').value;
  let userValidationText = document.getElementById('user-validation');

  if (!regexUser.test(user)) {
    userValidationText.textContent = "Introduzca un número de usuario válido";
  } else {
    userValidationText.textContent = "";
  }
}

// Función para validar el campo de la contraseña de manera dinámica
function passValidate() {
  let pass = document.getElementById('pass').value;
  let passValidationText = document.getElementById('pass-validation');

  if (!regexPass.test(pass)) {
    passValidationText.textContent = "La contraseña no cumple con los requisitos.";
  } else {
    passValidationText.textContent = "";
  }
}

function validate() {
  let user = document.getElementById('user').value;
  let pass = document.getElementById('pass').value;

  if (!regexUser.test(user) && !regexPass.test(pass)) {
    userValidate();
    passValidate();
    return false;
  } else {
    return true;
  }
}

// TODO Integrar esta función de la manera correcta
function sendForm() {
  if (validate()) {
    // Si la validación es exitosa, procede a enviar el formulario al servidor
    let form = document.getElementById("login-form");
    // Aquí puedes realizar acciones adicionales si es necesario antes de enviar el formulario
    form.submit();
    return true;
  }else{
      alert("sendform validate devuelve false");
      return false;
  }
}

// Función para generear una ventana nueva en al que el usuario pueda registrarse
function showRegister() {
  const screenWidth = screen.width;
  const screenHeight = screen.height;

  const centerX = (screenWidth - 500)/2;
  const centerY = (screenHeight - 400)/2;

  let url = "registro.html";
  let newWindow = window.open(url, "_blank", "width=500,height=400");
  newWindow.moveTo(centerX, centerY);
}


