
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
const fs = require('fs');

app.use(bodyParser.urlencoded({extended: true}));
//app.set('view engine', 'ejs');
// Configurar la ubicación de las vistas con ruta relativa
//app.set('views', path.join(__dirname, 'HTML'));
app.use(express.static(path.join(__dirname, 'HTML')));
app.use(express.static(path.join(__dirname, 'CSS')));
app.use(express.static(path.join(__dirname, 'MEDIA')));
//app.use(express.static(path.join(__dirname, 'JSON')));
app.use(express.static(path.join(__dirname, 'JS'),{ 'Content-Type': 'application/javascript' }));



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
                    }else if(resultados[0].login_name=="generador"&&resultados[0].password=="0000"&&user=="generador"&&pass=="0000"){//comprobamos si es el generador
                        console.log("generando vista generador");
                    }else{
                        if(resultados[0].login_name==user&&resultados[0].password==pass){//comprobamos si el usuario y su clave son equivalentes
                            response.redirect('/simulacion.html');//iniciando la simulacion de entrevista
                        }else{
                            console.log("clave  invalida");
                            response.redirect('/index.html');
                        }
                    }
                }else{//si no obtiene resultados
                    console.log("el usuario no existe");
                    response.redirect('/index.html');
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
                                        <title>Tu Página</title>
                                        <script>
                                            function mostrarMensaje() {
                                                var confirmacion = confirm('¿Seguro que quieres salir?');
                                                if (confirmacion) {
                                                    window.close();
                                                }
                                            }
                                        </script>
                                    </head>
                                    <body>
                                        <p>Bienvenido Aspirante, tu número de usuario es: ${loginName}</p>
                                        
                                        <!-- Botón que muestra el mensaje -->
                                        <button onclick="mostrarMensaje()">Cerrar Ventana</button>
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
app.post("/simulacion", function(request,response){
    console.log("dentro del post simulacion");
    let takeQuestion= request.body.optionSimulacion;
    console.log(takeQuestion);
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
        }else{
            console.log(resultados);
            const dataJson = JSON.stringify(resultados, null, 2);
            const directoryName="JSON";
            const fileName="questions.json";
            const pathFile = path.join(directoryName,fileName);
            if (!fs.existsSync(directoryName)) {
                fs.mkdirSync(directoryName);
              }
                    fs.writeFile(pathFile, dataJson, 'utf-8', (err) => {
                        if (err) {
                            console.error('Error al escribir el archivo:', err);
                          // Manejar el error según tu lógica
                        } else {
                            console.log('Archivo JSON guardado exitosamente.');
                        }
                    });  
        }
    });

});
app.listen(3000, function () {
    console.log("Servidor creado en http://localhost:3000/index");
});
