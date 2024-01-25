
const mysql = require('mysql');
const express = require ('express');
const app = express();
app.listen(3000, function () {
    console.log("servidor creado en el http://localhost:3000");
})
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
