
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
//app.set('view engine', 'ejs');
// Configurar la ubicación de las vistas con ruta relativa
//app.set('views', path.join(__dirname, 'HTML'));
app.use(express.static(path.join(__dirname, 'HTML')));
app.use(express.static(path.join(__dirname, 'CSS')));
app.use(express.static(path.join(__dirname, 'MEDIA')));
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
                                const scriptToSend=`<script>function closeWindow() {
                                    window.open('', '_self', '');
                                    window.close();}</script>`;
                            response.send(scriptToSend);
                        }
                    });
















                }
            }
        });
    }
});









app.listen(3000, function () {
    console.log("Servidor creado en http://localhost:3000/index");
});
