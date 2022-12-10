const axios= require('axios');
const SensiboClient = require('sensibo-sdk');
require('dotenv');

const express = require('express');
const { setACState } = require('./sensibo-api-code');
const app = express();
const port = process.env.port || 8080;


app.all('*', (req, res, next) => {
    console.log("check");
    next();
})

app.use(express.json());

setInterval(async()=>{
    try {
    const response = await axios({
        url: "http://10.100.102.54/temperature",
        method: "get",
    });
    // res.status(200).json(response.data);
    if(response.data>=20){
        setACState();
    }
} catch (err) {
    // res.status(500).json({ message: err });
    console.log(err);
}},5000)

// app.get("/temperature", async (req, res) => {
// 	try {
//         const response = await axios({
//             url: "http://10.100.102.54/temperature",
// 			method: "get",
// 		});
// 		res.status(200).json(response.data);
//         if(response.data>=20){
//             setACState();
//         }
// 	} catch (err) {
// 		res.status(500).json({ message: err });
// 	}
// });


app.all('*', (req, res) => res.send('Global handler'));


const getSensibo= async() =>{
    
    
    console.log(process.env.SENSIBO_API_KEY);
    const client = new SensiboClient(process.env.SENSIBO_API_KEY); //initialize with API key
    console.log(client);
    const pods = await client.getPods()
    const measurements = await pods[0].getMeasurements() //batteryVoltage, humidity, etc
    const acState = await pods[0].getAcState() // on, fanLevel, swing etc
    const updateResult = await pods[0].setAcState({targetTemperature: 24, temperatureUnit: 'C'})
}


app.listen(port);
console.log('listening to port', port)