const regexUser = /^\d{4}$/;
const regexPass = /^(?=.*[A-Z])(?=.*\d)(?!.*[&ñ@;_])[\w\d]{8,}$/;

const form = document.getElementById("login-form");

// Función para validar el campo del usuario de manera dinámica
function userValidate() {
  let user = document.getElementById("user").value;
  let userValidationText = document.getElementById("user-validation");
  const loginButton = document.querySelector(".login");



  if (!regexUser.test(user)) {
    userValidationText.textContent = "Introduzca un número de usuario válido";
    loginButton.disabled = true;
  } else {
    userValidationText.textContent = "";
    loginButton.disabled = false;
  }
}

// Función para validar el campo de la contraseña de manera dinámica
function passValidate() {
  let pass = document.getElementById("pass").value;
  let passValidationText = document.getElementById("pass-validation");
  const loginButton = document.querySelector(".login");


  if (!regexPass.test(pass)) {
    passValidationText.textContent =
      "La contraseña no cumple con los requisitos.";
      loginButton.disabled = true;
  } else {
    passValidationText.textContent = "";
    loginButton.disabled = false;

  }
}

// function validateForm() {
//   let user = document.getElementById("user").value;
//   let pass = document.getElementById("pass").value;

//   if (regexUser.test(user) && regexPass.test(pass)) {
//     loginButton.disabled = false;
//   } else {
//     loginButton.disabled = true;
//   }
// }


// function sendForm() {
//   if (validateForm()) {
//     // Si la validación es exitosa, procede a enviar el formulario al servidor
//     // Aquí puedes realizar acciones adicionales si es necesario antes de enviar el formulario
//     form.submit();
//     return true;
//   }else{
//       return false;
//   }
// }

// Función para generear una ventana nueva en al que el usuario pueda registrarse
function showRegister() {
  const screenWidth = screen.width;
  const screenHeight = screen.height;

  const centerX = (screenWidth - 600) / 2;
  const centerY = (screenHeight - 500) / 2;

  // Crear un fondo transparente que cubra toda la pantalla
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Fondo semi-transparente
  overlay.style.zIndex = "9999"; // Asegurar que esté por encima del resto del contenido
  document.body.appendChild(overlay);

  // Abrir la ventana de registro
  let url = "registro.html";
  let newWindow = window.open(url, "_blank", "width=600,height=500,left=" + centerX + ",top=" + centerY);

  // Mover la ventana al centro
  if (newWindow) {
    newWindow.moveTo(centerX, centerY);
  }

  // Verificar continuamente si la ventana de registro está cerrada
  const checkClosed = setInterval(function () {
    if (newWindow.closed) {
      clearInterval(checkClosed); // Detener la verificación continua
      document.body.removeChild(overlay); // Eliminar el fondo transparente al cerrar la ventana de registro
    }
  }, 1000);
}

// Obtener el elemento de video
let video = document.getElementById("videoElement");
let stream;
let recordedChunks = [];
let mediaRecorder;

// Función para iniciar la cámara y la grabación
function startInterview() {
  // Verificar si el navegador soporta la API de medios y MediaRecorder
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder) {
    // Obtener acceso a la cámara
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (streamObj) {
        // Mostrar el stream de la cámara en el elemento de video
        video.srcObject = streamObj;
        // Guardar la referencia al stream para detenerlo más tarde
        stream = streamObj;

        // Iniciar la grabación
        startRecording();
      })
      .catch(function (error) {
        console.error("Error al acceder a la cámara:", error);
      });
  } else {
    console.error("Tu navegador no soporta la API de medios o MediaRecorder.");
  }
}

// Función para iniciar la grabación
function startRecording() {
  recordedChunks = []; // Limpiar los chunks grabados

  // Crear un objeto MediaRecorder y asociarlo con el stream de video
  let mediaRecorder = new MediaRecorder(stream);

  // Manejar el evento de datos disponibles
  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  // Manejar el evento de finalización de la grabación
  mediaRecorder.onstop = function () {
    // Convertir los chunks grabados en un blob y guardarlo en localStorage
    let recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
    let recordedUrl = URL.createObjectURL(recordedBlob);

    // Guardar el URL del video en el localStorage
    localStorage.setItem('recordedVideo', recordedUrl);
  };

  // Iniciar la grabación
  mediaRecorder.start();
}

// Función para detener la cámara y la grabación
function stopInterview() {
  // Verificar si hay un stream para detener
  if (stream) {
    // Detener cada track del stream
    stream.getTracks().forEach((track) => track.stop());
    // Limpiar la referencia al stream
    stream = null;

    // Detener la grabación
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }
  console.log(localStorage.getItem('recordedVideo'));
}
