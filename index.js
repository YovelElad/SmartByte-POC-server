const axios= require('axios');
const SensiboClient = require('sensibo-sdk');
require('dotenv').config();

const express = require('express');
const { setACState } = require('./sensibo-api-code');
const app = express();
const port = process.env.port || 8080;


app.all('*', (req, res, next) => {
    console.log("check");
    next();
})

app.use(express.json());

const fs = require('fs');
const readline = require('readline');
  

const file = readline.createInterface({
    input: fs.createReadStream('../SmartByte-Interpreter/functions.txt'),
    output: process.stdout,
    terminal: false
});

file.on('line', (line) => {
    if(line == "Turn On The AC") {
        TrunOnTheAc()
    }
});


function TrunOnTheAc() {
    console.log("Turn on the ac");
    //     try {
    //     const response = await axios({
    //         url: `${process.env.SENSOR_URL}/temperature`,
    //         method: "get",
    //     });
    //     // res.status(200).json(response.data);
    //     if(response.data>=20){
    //         console.log("Activte AC");
    //         // setACState();
    //     }
    // } catch (err) {
    //     // res.status(500).json({ message: err });
    //     console.log(err + "Cant read from esp32's sensor");
    // };
}


// setInterval(async()=>{
//     try {
//     const response = await axios({
//         url: `${process.env.SENSOR_URL}/temperature`,
//         method: "get",
//     });
//     // res.status(200).json(response.data);
//     if(response.data>=20){
//         setACState();
//     }
// } catch (err) {
//     // res.status(500).json({ message: err });
//     console.log(err + "Cant read from esp32's sensor");
// }},8000);

// app.get('/temperature',setInterval(async(req, res) => {
// 	try {
//         const response = await axios({
//             url:`${process.env.SENSOR_URL}/temperature`,
// 			method: "get",
// 		});
// 		res.status(200).json(response.data);
//         if(response.data>=20){
//             setACState();
//         }
// 	} catch (err) {
// 		res.status(500).json({ message: err });
// 	}
// },8000));


app.all('*', (req, res) => res.send('Global handler'));

app.listen(port);
console.log('listening to port', port)