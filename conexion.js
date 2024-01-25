
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
// Configurar la ubicación de las vistas con ruta relativa
app.set('views', path.join(__dirname, 'HTML'));
app.use(express.static('./CSS'));
app.use(express.static('./MEDIA'));


//cargamos el index.ejs
app.get('/index', function (request, response) {
    console.log("dentor del index inicial");
    response.sendFile(path.join(__dirname, 'HTML', 'index.html'));
    let action = request.body.option;
    let user = String(request.body.user);
    let register = String(request.body.register);

    if (action==="LOGIN") {

        alert("mirando la base de datos"+user+register);
    } else if(action==="REGISTRO") {
        console.log("registrando");
        response.sendFile(path(__dirname, 'HTML', 'registro.html'));
    }
    else{
        console.log("salida mala");
    }
    //response.render('index');
});





// app.get('/simulacion', function (request, response) {
//     response.sendFile(path.join(__dirname, 'HTML', 'simulacion.html'));
//     //response.render('index');
// });

//app.post("/index", function (request, response) {
    


//})






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
