const regexUser = /^\d{4}$/;
// const regexPass = /^\d{4}$/;
const regexPass = /^(?=.*[A-Z])(?=.*\d)(?!.*[&ñ@;_])[\w\d]{8,}$/;
const regexAdminN = /^admin$/i;
const regexAdminP = /^0000$/i;

const form = document.getElementById("login-form");

// Función para validar el campo del usuario de manera dinámica
function userValidate() {
  let user = document.getElementById("user").value;
  let userValidationText = document.getElementById("user-validation");
  const loginButton = document.querySelector(".login");

  if (!(regexUser.test(user) || regexAdminN.test(user))) {
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

  if (!(regexPass.test(pass) || regexAdminP.test(pass))) {
    passValidationText.textContent =
      "La contraseña no cumple con los requisitos.";
      loginButton.disabled = true;
  } else {
    passValidationText.textContent = "";
    loginButton.disabled = false;

  }
}

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

let video = document.getElementById("videoElement"); // Obtener el elemento de video
let stream; // Almacena la referencia al stream de la cámara
let recordedChunks = []; // Almacena los fragmentos grabados
let mediaRecorder; // Almacena un objeto MediaRecorder

// let recordedVideo = document.getElementById("recordedVideo");

// Función para iniciar la cámara y la grabación
function startInterview() {
  localStorage.removeItem('recordedVideo');

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (streamObj) {
        video.srcObject = streamObj;
        stream = streamObj;
        startRecording();
      })
      .catch(function (error) {
        console.error("Error al acceder a la cámara y micrófono:", error);
      });
  } else {
    console.error("Tu navegador no soporta la API de medios o MediaRecorder.");
  }
  sendData();
}

// Función para iniciar la grabación
function startRecording() {
  recordedChunks = [];
  // Se asigna el objeto MediaRecorder a la variable global
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = function (e) {
    console.log('Datos disponibles:', e.data.size);
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  mediaRecorder.onstop = function () {
    console.log('Grabación detenida');
    let recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
    console.log('Tamaño del Blob:', (recordedBlob.size / (1024 * 1024)).toFixed(2), 'MB');

    // Guardar el Blob del video en el localStorage
    localStorage.setItem('recordedVideo', recordedBlob);

    let formData = new FormData();
    formData.append('videoFile', recordedBlob, 'video.webm');

    // Realizar una solicitud al servidor
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
      console.error('Error al enviar el video al servidor:', error);
    });

    
    // processAndShowVideo();
  };

  mediaRecorder.start();
}

// Función para detener la cámara y la grabación
function stopInterview() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }
  }
}

function processAndShowVideo() {
  console.log(localStorage.getItem('recordedVideo'));

  if (localStorage.getItem('recordedVideo')) {
    // Actualizar el nuevo elemento de video con el video grabado
    recordedVideo.src = localStorage.getItem('recordedVideo');
    recordedVideo.onloadedmetadata = function() {
      console.log('Metadata cargada');
      recordedVideo.play().catch(function(error) {
        console.error('Error al intentar reproducir el video grabado:', error);
      });
    };
    let keys = Object.keys(localStorage);

    keys.forEach(function(key) {
      console.log(key + ":" + localStorage.getItem(key));
    });
  }
}

// Gestión del json para acceder a las preguntas
function loadJSON(callback) {
  var xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open('GET', '../JSON/questions.json', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}

// Accedo a una pregunta aleatoria y la guardo en el local storage
function getRandomQuestion() {
  loadJSON(function (questionsJSON) {
    const randomIndex = Math.floor(Math.random() * questionsJSON.length);
    const randomQuestion = questionsJSON[randomIndex];

    document.getElementById('question-box').textContent = randomQuestion.question;

    // Almacena el objeto JSON en el local storage
    localStorage.setItem("pregunta", JSON.stringify(randomQuestion));

    console.log(localStorage.getItem("pregunta"));
  });
}


function sendData() {
let question = localStorage.getItem('pregunta');

// Crear un objeto con los datos
let dataQ = {
  pregunta: question
};

// Realizar una solicitud POST al servidor
fetch('/question-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(dataQ)
})
  .then(response => response.json())
  .then(data => {
    // Manejar la respuesta del servidor si es necesario
    console.log(data);
  })
  .catch(error => {
    console.error('Error al enviar datos al servidor:', error);
  });
}

document.addEventListener("DOMContentLoaded", function() {
  let inputHidden = document.getElementById('hidden');
  if (inputHidden.value === "no-load") {

  } else {
    getRandomQuestion();
  }
});