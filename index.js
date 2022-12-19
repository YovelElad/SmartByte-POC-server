const axios= require('axios');
const SensiboClient = require('sensibo-sdk');
require('dotenv').config();

const express = require('express');
const { setACState } = require('./sensibo-api-code');
const  getTemperature  = require('./Arduino/temperature');
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
        try {
        const response = await axios({
            url: `${process.env.SENSOR_URL}/temperature`,
            method: "get",
        });
        // res.status(200).json(response.data);
            console.log("Activte AC");
            // setACState();
    } catch (err) {
        // res.status(500).json({ message: err });
        console.log(err + "Cant read from esp32's sensor");
    };
}


setInterval(async()=>{
    const temperature = await getTemperature();
    console.log(temperature);
},1000);

app.get('/temperature',setInterval(async(req, res) => {
	try {
        const response = await axios({
            url:`${process.env.SENSOR_URL}/temperature`,
			method: "get",
		});
		res.status(200).json(response.data);
        if(response.data>=20){
            setACState();
        }
	} catch (err) {
		res.status(500).json({ message: err });
	}
},8000));


app.all('*', (req, res) => res.send('Global handler'));

app.listen(port);
console.log('listening to port', port)

// /**
//  * @param {string} tempVal The string
//  */
// function insertValueOfTempSensor(tempVal, localScriptPath, paramaters, interpreterDir, pythonFileName, currDir) {
//     const PythonShell = require('python-shell').PythonShell;

//     var options = {
//         mode: 'text',
//         pythonPath: '/usr/bin/python3',
//         pythonOptions: ['-u'],
//         scriptPath: '/Users/amiravidan/Documents/finalProject/SmartByte-Interpreter',
//         args: ['temperature', tempVal]
//     };

//     process.chdir('../SmartByte-Interpreter');

//     PythonShell.run('setValueBySensor.py', options, function (err, results) {
//         if (err)
//             throw err;
//         console.log('Changed temp value');
//     });

//     process.chdir('../SmartByte-POC-server')

// }


/**
 * @param {string} tempVal The string
 */
 function insertValueOfTempSensor(tempVal, localScriptPath, paramaters, interpreterDir, pythonFileName, currDir) {
    const PythonShell = require('python-shell').PythonShell;

    var options = {
        mode: 'text',
        pythonPath: '/usr/bin/python3',
        pythonOptions: ['-u'],
        scriptPath: localScriptPath,
        args: paramaters
    };

    process.chdir(interpreterDir);

    PythonShell.run(pythonFileName, options, function (err, results) {
        if (err)
            throw err;
        console.log('Changed temp value');
    });

    process.chdir(currDir)

}