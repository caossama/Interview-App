
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const fs = require('fs');
const multer = require('multer');
const { type } = require('os');
const storage = multer.memoryStorage(); // Almacenar archivos en memoria
const upload = multer({ storage: storage });
let login_name_global;
let question_global;

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});
//app.set('view engine', 'ejs');
// Configurar la ubicación de las vistas con ruta relativa
//app.set('views', path.join(__dirname, 'HTML'));
app.use(express.static(path.join(__dirname, 'HTML')));
app.use(express.static(path.join(__dirname, 'CSS')));
app.use(express.static(path.join(__dirname, 'MEDIA')));
//app.use(express.static(path.join(__dirname, 'JSON')));
app.use('/JSON', express.static(path.join(__dirname, 'JSON')));
app.use(express.static(path.join(__dirname, 'JS'),{ 'Content-Type': 'application/javascript' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

//cargamos el index.
app.get('/index', function (request, response) {
    console.log("dentor del index inicial");
    response.sendFile(path.join(__dirname, 'HTML', 'index.html'));
    //response.render('index');
    //response.redirect('/simulacion');
});


//recibimos valores del form en un post
app.post("/index", function (request, response) {
    console.log("dentro del post");
    //capturamos valores del form
    let action = request.body.optionIndex;
    let user = String(request.body.user);
    let pass = String(request.body.pass);
    //creamos conexion a la base de datos
    const dbConnection = mysql.createConnection({
        host: 'localhost',
        user: 'invitado',
        password: '0000',
        database: 'interview app'
    });
    //comprobamos que la conexion funciona o manda error
    dbConnection.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
        } else {
            console.log('Conexión exitosa a la base de datos');
        }
    });
    //segun el valor de la accion, en este caso el boton derivamos a una opcion u otra
    if (action === "LOGIN") {    //si el valor es login
        console.log("mirando la base de datos "+"usuario "+user+" password "+pass);
        const query = `SELECT * FROM users WHERE login_name = "${user}"`;
        //mandamos la consulta a la base de datos
        dbConnection.query(query, (error, resultados) => {
            if (error) {//si muestra error
                console.error('Error en la consulta:', error);
                response.status(500).send('Error en la consulta');
            } else {
                if(resultados.length>0){//comprobamos si obtiene resultados
                    console.log(action);
                    console.log(user);
                    console.log(pass);
                    console.log(resultados[0]);
                    console.log(resultados[0].login_name);
                    console.log(resultados[0].password);
                    if(resultados[0].login_name=="admin"&&resultados[0].password=="0000"&&user=="admin"&&pass=="0000"){//comprobamos si es el admin 
                        console.log("generando vista administrador");
                        response.redirect("/administrador.html");
                    }else if(resultados[0].login_name=="generador"&&resultados[0].password=="0000"&&user=="generador"&&pass=="0000"){//comprobamos si es el generador
                        console.log("generando vista generador");
                        response.redirect("/generador.html");
                    }else{
                        if(resultados[0].login_name==user&&resultados[0].password==pass){//comprobamos si el usuario y su clave son equivalentes
                            response.redirect(`/simulacion.html?login_name=${user}`);//iniciando la simulacion de entrevista
                        }else{
                            console.log("clave  invalida");
                            response.redirect('/index.html');
                        }
                    }
                }else{//si no obtiene resultados
                    let usuario="noExists"
                    console.log("el usuario no existe");
                    response.redirect(`/index.html?hiddenResponse=${usuario}`);
                }
            }
        });
    } else if(action === "REGISTRO") {//si el valor de la accion en el form del index.html es registro
        
        console.log("lanzando registro");
        response.redirect('/registro.html');
    }else{
        console.log("salida mala");
        response.send("opcion desconocida");
    }
    console.log("cerrando conexion");
    dbConnection.end();
});

app.post("/registro",function (request,response) {
    console.log("dentro del post Resgistro");
    //capturamos las variables del post
    let action = request.body.optionRegistro;
    let pass=request.body.pass;
    //creamos conexion a la base de datos
    const dbConnection = mysql.createConnection({
        host: 'localhost',
        user: 'invitado',
        password: '0000',
        database: 'interview app'
    });
    //comprobamos que la conexion funciona o manda error
    dbConnection.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
        } else {
            console.log('Conexión exitosa a la base de datos desde registrarse');
        }
    });

    console.log(action);
    console.log(pass);
    //opciones para el action registrarse
    if(action=="REGISTRARSE"){
        const query = `SELECT * FROM users ORDER BY id DESC LIMIT 1`;
        console.log(query);
        dbConnection.query(query, (error, resultados) => {
            if(error){
                console.error('Error en la consulta:', error);
                response.status(500).send('Error en la consulta');
            }else{
                if(resultados.length==1){
                    console.log(resultados[0]);
                    let nAspiranteUltimo=parseInt(resultados[0].login_name);
                    console.log("nAspiranteUltimo   "+nAspiranteUltimo);
                    console.log(typeof(nAspiranteUltimo));
                    let nAspiranteActual = nAspiranteUltimo+1;
                    const nAspiranteActualString = String(nAspiranteActual);
                    const nAspiranteActualConCeros = nAspiranteActualString.padStart(4, '0');
                    console.log(nAspiranteActualConCeros);
                    const query=`INSERT INTO users (login_name, password, role) VALUES ('${nAspiranteActualConCeros}', '${pass}', 3)`;
                    dbConnection.query(query, (error, resultados) => {
                        if (error) {//si muestra error
                            console.error('Error en la consulta:', error);
                            response.status(500).send('Error en la consulta');
                        } else {
                            console.log(resultados);
                            const query = `select * from users order by id desc limit 1`;

                            dbConnection.query(query, (error, resultados) => {
                                if (error) {//si muestra error
                                    console.error('Error en la consulta:', error);
                                    response.status(500).send('Error en la consulta');
                                } else {
                                    console.log(resultados);
                                    const loginName = resultados[0].login_name;
                                    console.log(loginName);
                                    const htmlToSend = `
                                    <!DOCTYPE html>
                                    <html lang="es">
                                    <head>
                                        <meta charset="UTF-8">
                                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                        <link rel="stylesheet" href="style.css">
                                        <title>Registro</title>
                                        <script>
                                            function mostrarMensaje() {
                                                var confirmacion = confirm('¿Seguro que quieres salir?');
                                                if (confirmacion) {
                                                    window.close();
                                                }
                                            }
                                        </script>
                                    </head>
                                    <body id="register">
                                        <p>Bienvenido Aspirante, tu número de usuario es: ${loginName}</p>
                                        
                                        <!-- Botón que muestra el mensaje -->
                                        <button id="confirm-button" onclick="mostrarMensaje()">CONFIRMAR</button>
                                    </body>
                                    </html>
                                    `;
                                    response.send(htmlToSend);
                                };
                            });
                        }
                    });
                }
            }
        });
    }
});
//post de respuesta de  para la simulacion
app.post("/simulacion", function(request,response){
    console.log("dentro del post simulacion");
    let action= request.body.optionSimulacion;
    console.log(action);
    if(action=="GENERAR PREGUNTA"){
        const dbConnection = mysql.createConnection({
            host: 'localhost',
            user: 'invitado',
            password: '0000',
            database: 'interview app'
        });
        dbConnection.connect((err) => {
            if (err) {
                console.error('Error al conectar a la base de datos:', err);
            } else {
                console.log('Conexión exitosa a la base de datos');
            }
        });
        const query = `select * from questions`;
        dbConnection.query(query, (error, resultados) => {
            if(error){
                console.error('Error en la consulta:', error);
                response.status(500).send('Error en la consulta');
            }else {
                console.log(resultados);
                const dataJson = JSON.stringify(resultados, null, 2);
                const directoryName = "JSON";
                const fileName = "questions.json";
                const pathFile = path.join(__dirname, directoryName, fileName);
            
                if (!fs.existsSync(path.join(__dirname, directoryName))) {
                    fs.mkdirSync(path.join(__dirname, directoryName), { recursive: true });
                }
            
                fs.writeFile(pathFile, dataJson, 'utf-8', (err) => {
                    if (err) {
                        console.error('Error al escribir el archivo:', err);
                    } else {
                        console.log('Archivo JSON guardado exitosamente.');
                        const hiddenResponse="hiddenResponse";
                        response.redirect(`/simulacion.html?hiddenResponse=${hiddenResponse}`);
                    }
                });
            }
        });
    } else if(action=="DETENER GRABACIÓN"){

        let question = request.body.question;
        console.log(question);

        console.log("llego hasta aqui");
        response.redirect("/simulacion.html");
    }
});
//post de el envio del video y le procesa
app.post("/upload", upload.single('videoFile'), (request, response) => {
    const videoFile = request.file;
    const dbConnection = mysql.createConnection({
        host: 'localhost',
        user: 'invitado',
        password: '0000',
        database: 'interview app'
    });
//conexiona la base de datos
    dbConnection.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
        } else {
            console.log('Conexión exitosa a la base de datos');
        }
    });
    //realizo la consulta
    dbConnection.query('INSERT INTO interviews (interview, user_id, question) VALUES (?,?,?)', [videoFile.buffer,login_name_global,question_global], (error, results) => {
        if (error) throw error;
        console.log('Registro insertado con éxito:', results.insertId);
        response.redirect('/simulacion.html');
    });
});
//post para guardar el usuario la question en una variable de caracter global"apaño"
app.post("/question-user", function(request, response) {
    console.log("Entrando en question-user");
    const login_name=request.body.login_name;
    const question = request.body.pregunta;
    question_global=question;
    login_name_global=login_name;
    console.log(typeof(question));
    console.log(question);
    console.log(login_name);
    response.send({ status: 'success' });
});


//post para cuando te conectas como generador enviar la pregunta al servidor
app.post("/generador",function (request, response) {
    console.log("dentro del post generador");
    let newQuestion=request.body.textQuestion;
    console.log(newQuestion);
    const dbConnection = mysql.createConnection({
        host: 'localhost',
        user: 'invitado',
        password: '0000',
        database: 'interview app'
    });
    //comprobamos que la conexion funciona o manda error
    dbConnection.connect((err) => {
        if (err) {
            console.error('Error al conectar a la base de datos:', err);
        } else {
            console.log('Conexión exitosa a la base de datos');
            const query = 'INSERT INTO questions (question) VALUES (?)';
            dbConnection.query(query, [newQuestion], (error, results, fields) => {
                if (error) throw error;
                console.log("ingreso de la pregunta con exito");
                response.redirect("/generador.html")
            });
        }
    });
});
//recogida de peticion de la flecha para volver al login
app.post("/back",function(request,response){
    response.redirect("/index.html");
})
app.listen(3000, function () {
    console.log("Servidor creado en http://localhost:3000/index");
});