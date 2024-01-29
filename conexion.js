
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

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
    let action = request.body.option;
    let user = String(request.body.user);
    let pass = String(request.body.pass);
    if (action === "LOGIN") {
        console.log("mirando la base de datos"+user+pass);
        const consulta = `SELECT * FROM users WHERE login_name = "${user}"`;
        dbConnection.query(consulta, (error, resultados) => {
            if (error) {
                console.error('Error en la consulta:', error);
                response.status(500).send('Error en la consulta');
            } else {
                if(resultados.length>0){
                    console.log("action");
                    console.log("user");
                    console.log("register");
                    console.log(resultados);
                    console.log("");
                    response.redirect('/simulacion.html');
                }else{
                    console.log("no hay resultados");
                    response.redirect('/index.html');
                }
                
                //resultados.json(resultados);
            }
        });
        //response.sendFile(path.join(__dirname,'HTML', 'simulacion.html'));
        
    } else if(action === "REGISTRO") {
    console.log("registrando");
        //response.sendFile(path.join(__dirname, 'HTML', 'registro.html'));
        response.redirect('/index.html');
    }
    else{
        console.log("salida mala");
        response.send("opcion desconocida");
    }
})

app.listen(3000, function () {
    console.log("Servidor creado en http://localhost:3000/index");
});



// const connection = mysql.createConnection({
//    host:'localhost',
//    user:'invitado',
//    password:'0000',
//    database:'interview app'
// });
//     connection.connect((err)=>{
//         if(err)throw err
//         console.log('estamos dentro');
//     });


   //connection.end();
