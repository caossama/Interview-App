// * COMIENZA EL LADO CLIENTE
// Para este proyecto hemos separado en dos archivos JavaScript todo el código, uno para el lado cliente y otro para el lado servidor.

// Comenzamos declarando las validaciones para los usuarios, con estas expresiones comprobaremos si puede entrar con el número, con "admin"
// o con "generador". También hacemos una comprobación de las contraseñas, tanto la de usuario como la del admin y generador que es "0000".
const regexUser = /^\d{4}$/;
// // const regexPass = /^\d{4}$/;
const regexPass = /^(?=.*[A-Z])(?=.*\d)(?!.*[&ñ@;_])[\w\d]{8,}$/;
const regexAdminN = /^admin$/i;
const regexGenN = /^generador$/i;
const regexAdminP = /^0000$/i;

// Constante para capturar el login
const form = document.getElementById("login-form");

// Estos botones están sin implementar por un problema en un circuito para bloquear botones
// de momento no funcionan, pero no descartamos implementar esta función
// // const b1 = document.getElementById('hidden');
// // const b2 = document.getElementById('startButton');
// // const b3 = document.getElementById('stopButton');

// Función para validar el campo del usuario de manera dinámica
function userValidate() {
  let user = document.getElementById("user").value;
  let userValidationText = document.getElementById("user-validation");
  const loginButton = document.querySelector(".login");

  // Si no cumple ninguna de estas expresiones, el botón se desactiva y no deja loguearte, si las cumple, se activa
  if (!(regexUser.test(user) || regexAdminN.test(user) || regexGenN.test(user))) {
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

  // Si no cumple ninguna de estas expresiones, el botón se desactiva y no deja loguearte, si las cumple, se activa
  if (!(regexPass.test(pass) || regexAdminP.test(pass))) {
    passValidationText.textContent =
      "La contraseña debe tener 8 dígitos, una mayúscula y un número y no puede contener caracteres especiales.";
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

  // Calculo las coordenadas con el tamaño de la pantalla para mover la ventana después
  const centerX = (screenWidth - 600) / 2;
  const centerY = (screenHeight - 500) / 2;

  // Crear un fondo transparente que cubra toda la pantalla y que el usuario no interactúe mientras se registra
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999";
  document.body.appendChild(overlay);

  // Se abre la ventana de registro
  let url = "registro.html";
  let newWindow = window.open(url, "_blank", "width=600,height=500,left=" + centerX + ",top=" + centerY);

  // Se mueve la ventana al centro con las coordenadas de antes
  if (newWindow) {
    newWindow.moveTo(centerX, centerY);
  }

  // Verifica continuamente si la ventana de registro está cerrada, si no lo está, sigue con el estilo aplicado anteriormente
  const checkClosed = setInterval(function () {
    if (newWindow.closed) {
      clearInterval(checkClosed); // Detiene la verificación continua
      document.body.removeChild(overlay); // Elimina el fondo transparente al cerrar la ventana de registro
    }
  }, 1000);
}

// Creo otra función para validar la contraseña del registro y que siga las indicaciones correctas
function passValidateRegister() {
  let pass = document.getElementById("pass-register").value;
  let passValidationText = document.getElementById("pass-validation-register");
  const registerButton = document.getElementById("register-button");
  if (!regexPass.test(pass)) {
    passValidationText.textContent =
      "La contraseña no cumple con los requisitos.";
      registerButton.disabled = true;
  } else {
    passValidationText.textContent = "";
    registerButton.disabled = false;
  }
}

let video = document.getElementById("videoElement"); // Obtener el elemento de vídeo
let stream; // Almacena la referencia al stream de la cámara
let recordedChunks = []; // Almacena los fragmentos grabados
let mediaRecorder; // Almacena un objeto MediaRecorder

// // let recordedVideo = document.getElementById("recordedVideo");

// Función para iniciar la cámara y la grabación
function startInterview() {
  // Borro si hay algún vídeo en el local storage para guardar el nuevo
  localStorage.removeItem('recordedVideo');
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder) {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (streamObj) {
        video.srcObject = streamObj;
        stream = streamObj;
        // // b1.disabled = true;
        // // b3.disabled = false;
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

// Función para iniciar la cámara y la grabación
function startInterview() {
  // Elimino cualquier video previo del localStorage para guardar el nuevo
  localStorage.removeItem('recordedVideo');
  // Verifico si el navegador admite getUserMedia y MediaRecorder
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder) {
    // Solicito acceso a la cámara y el micrófono
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(function (streamObj) {
        // Asigno el flujo de medios al elemento de video
        video.srcObject = streamObj;
        stream = streamObj;
        // Inicio la grabación una vez que obtengo el acceso
        startRecording();
      })
      .catch(function (error) {
        console.error("Error al acceder a la cámara y micrófono:", error);
      });
  } else {
    console.error("Mi navegador no soporta la API de medios o MediaRecorder.");
  }
  // Envío datos (puede ser una llamada a una función que no está definida en este código)
  sendData();
}

// Función para iniciar la grabación
function startRecording() {
  // Array para almacenar los fragmentos grabados
  recordedChunks = [];
  // Asigno el objeto MediaRecorder al flujo de medios
  mediaRecorder = new MediaRecorder(stream);
  // Evento que se ejecuta cada vez que hay datos disponibles para procesar
  mediaRecorder.ondataavailable = function (e) {
    console.log('Datos disponibles:', e.data.size);
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }
  };

  // Evento que se ejecuta cuando se detiene la grabación
  mediaRecorder.onstop = function () {
    console.log('Grabación detenida');
    // Creo un Blob a partir de los fragmentos grabados
    let recordedBlob = new Blob(recordedChunks, { type: 'video/webm' });
    console.log('Tamaño del Blob:', (recordedBlob.size / (1024 * 1024)).toFixed(2), 'MB');
    // Guardo el Blob del video en el localStorage
    localStorage.setItem('recordedVideo', recordedBlob);
    // Creo un objeto FormData y agrego el Blob con un nombre
    let formData = new FormData();
    formData.append('videoFile', recordedBlob, 'video.webm');
    // Realizo una solicitud al servidor para enviar el video
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
    // Esta parte la comento porque es una función que se usó para probar la reproducción
    // del vídeo justo después de haberlo grabado, también serviría para la vista del admin.
    // // processAndShowVideo();
  };
  // Inicio la grabación
  mediaRecorder.start();
}

// Función para detener la cámara y la grabación
function stopInterview() {
  // Verifico si hay un flujo de medios activo
  if (stream) {
    // Detengo todos los tracks del flujo de medios
    stream.getTracks().forEach((track) => track.stop());
    // Establezco el flujo de medios como nulo
    stream = null;
    // Verifico si hay un objeto MediaRecorder y está en un estado distinto a 'inactive'
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      // Detengo la grabación si está en curso
      mediaRecorder.stop();
    }
  }
}

// Función para procesar y mostrar el video grabado
// //function processAndShowVideo() {
  // Muestro en la consola el contenido del video almacenado en el localStorage
  // // console.log(localStorage.getItem('recordedVideo'));
  // Verifico si hay un video grabado en el localStorage
 // // if (localStorage.getItem('recordedVideo')) {
    // Actualizo el elemento de video con el video grabado
  //  // recordedVideo.src = localStorage.getItem('recordedVideo');
    // Evento que se ejecuta cuando se cargan metadatos del video
  //  // recordedVideo.onloadedmetadata = function() {
  //  // console.log('Metadata cargada');
      // Intento reproducir el video y manejo errores si ocurren
    //  // recordedVideo.play().catch(function(error) {
      //  // console.error('Error al intentar reproducir el video grabado:', error);
    //  // });
  //  // };
    // Muestro en la consola todas las claves y valores almacenados en el localStorage
  //  // let keys = Object.keys(localStorage);
  //  // keys.forEach(function(key) {
    //  // console.log(key + ":" + localStorage.getItem(key));
  //  // });
//  // }
// // }

// Función para cargar un archivo JSON que contiene preguntas
function loadJSON(callback) {
  // Creo una nueva instancia de XMLHttpRequest
  var xhr = new XMLHttpRequest();
  // Especifico que el tipo de datos que espero es JSON
  xhr.overrideMimeType("application/json");
  // Abro una conexión para obtener el archivo JSON ubicado en '../JSON/questions.json'
  xhr.open('GET', '../JSON/questions.json', true);
  // Defino la función que se ejecutará cuando cambie el estado de la solicitud
  xhr.onreadystatechange = function () {
    // Verifico si la solicitud se completó y el estado es 200 (OK)
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Llamo a la función de devolución de llamada pasándole el objeto JSON parseado
      callback(JSON.parse(xhr.responseText));
    }
  };
  // Envío la solicitud
  xhr.send(null);
}

// Función para obtener y almacenar una pregunta aleatoria en el local storage
function getRandomQuestion() {
  // Llamo a la función loadJSON para cargar el archivo de preguntas
  loadJSON(function (questionsJSON) {
    // Genero un índice aleatorio basado en la longitud del array de preguntas
    const randomIndex = Math.floor(Math.random() * questionsJSON.length);
    // Obtengo la pregunta aleatoria usando el índice generado
    const randomQuestion = questionsJSON[randomIndex];
    // Actualizo el contenido del elemento con id 'question-box' con la pregunta aleatoria
    document.getElementById('question-box').textContent = randomQuestion.question;
    // Almaceno el objeto JSON de la pregunta en el local storage
    localStorage.setItem("pregunta", JSON.stringify(randomQuestion));
    // Muestro en la consola el objeto JSON almacenado en el local storage
    console.log(localStorage.getItem("pregunta"));
  });
}

// Función para enviar datos al servidor
function sendData() {
let question = localStorage.getItem('pregunta');
let login_name= localStorage.getItem('login_name');

// Crear un objeto con los datos
let dataQ = {
  pregunta: question,
  login_name: login_name
};

// Realizar una solicitud POST al servidor
fetch('/question-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(dataQ)
})
  // .then(response => response.json())
  .then(data => {
    // Manejar la respuesta del servidor si es necesario
    console.log(data);
  })
  .catch(error => {
    console.error('Error al enviar datos al servidor:', error);
  });
}

// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", function() {
  // Obtengo la referencia al elemento con id 'hidden'
  let inputHidden = document.getElementById('hidden');
  // Verifico si el valor del input es "no-load"
  if (inputHidden.value === "no-load") {
    // Llamo a la función saveID para realizar alguna operación (no definida en el código proporcionado)
    saveID();
    // Deshabilito estos botones, porque eran para un sistema de bloqueo de botones en la simulación
    // que al final no nos funcionó, pero para un futuro los dejamos y poder terminarlos
    // // b2.disabled = true;
    // // b3.disabled = true;
    // Muestro en la consola un mensaje indicando que no se ha generado la pregunta aleatoriamente
    console.log("No se ha podido generar la pregunta aleatoriamente");
  } else {
    // Si el valor del input no es "no-load", llamo a la función getRandomQuestion para obtener y mostrar una pregunta aleatoria
    getRandomQuestion();
  }
});

// Función para guardar el nombre de inicio de sesión en el localStorage
function saveID() {
  // Creo una instancia de URLSearchParams para obtener parámetros de la URL
  const urlParams = new URLSearchParams(window.location.search);
  // Obtengo el valor del parámetro 'login_name' de la URL
  const loginName = urlParams.get('login_name');
  // Verifico si se proporcionó un nombre de inicio de sesión en la URL
  if (loginName !== null) {
    // Muestro en la consola un mensaje indicando que el script se ejecutó en 'simulacion.html'
    console.log('Script ejecutado en simulacion.html');
    // Almaceno el nombre de inicio de sesión en el localStorage
    localStorage.setItem('login_name', loginName);
    // Puedo agregar más lógica aquí si es necesario
    // Muestro en la consola que el nombre de inicio de sesión se almacenó en el localStorage
    console.log('login_name almacenado en localStorage:', loginName);
  }
}