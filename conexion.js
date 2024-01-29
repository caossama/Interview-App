
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
                            response.redirect('/simulacion.html');
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
    } else if(action === "REGISTRO") {//si el valor es registro

    console.log("registrando");
        
        response.redirect('/index.html');
    }else{
        console.log("salida mala");
        response.send("opcion desconocida");
    }
    dbConnection.end();
});



app.post("/registro",function (request,response) {
    console.log("dentro del post Resgistro");

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
            console.log('Conexión exitosa a la base de datos');
        }
    });

    if(action){
        const query = `SELECT * FROM users ORDER BY id DESC LIMIT 1`;
        console.log(query);
        dbConnection.query(query, (error, resultados) => {
            if(error){
                console.error('Error en la consulta:', error);
                response.status(500).send('Error en la consulta');
            }else{
                if(resultados.length==0){

                }
            }
        });

    }
    
});









app.listen(3000, function () {
    console.log("Servidor creado en http://localhost:3000/index");
});
