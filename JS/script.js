const regexUser = /^\d{4}$/;
const regexPass = /^\d{4}$/;
//const regexPass = /^(?=.*[A-Z])(?=.*\d)(?!.*[&ñ@;_])[\w\d]{8,}$/;

// Función para validar el campo del usuario de manera dinámica
function userValidate() {
  let user = document.getElementById("user").value;
  let userValidationText = document.getElementById("user-validation");

  if (!regexUser.test(user)) {
    userValidationText.textContent = "Introduzca un número de usuario válido";
  } else {
    userValidationText.textContent = "";
  }
}

// Función para validar el campo de la contraseña de manera dinámica
function passValidate() {
  let pass = document.getElementById("pass").value;
  let passValidationText = document.getElementById("pass-validation");

  if (!regexPass.test(pass)) {
    passValidationText.textContent =
      "La contraseña no cumple con los requisitos.";
  } else {
    passValidationText.textContent = "";
  }
}

function validate() {
  let user = document.getElementById("user").value;
  let pass = document.getElementById("pass").value;

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
      return false;
  }
}

// Función para generear una ventana nueva en al que el usuario pueda registrarse
function showRegister() {
  const screenWidth = screen.width;
  const screenHeight = screen.height;

  const centerX = (screenWidth - 500) / 2;
  const centerY = (screenHeight - 400) / 2;

  let url = "registro.html";
  let newWindow = window.open(url, "_blank", "width=500,height=400");
  newWindow.moveTo(centerX, centerY);
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

