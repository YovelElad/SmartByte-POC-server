const axios = require('axios');
const SensiboClient = require('sensibo-sdk');
require('dotenv').config();

const express = require('express');
const { setACState } = require('./sensibo-api-code');
const utils = require('./Utils/utils');
const getTemperature  = require('./Arduino/temperature');
const app = express();
const cors = require("cors");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({origin: true}));
const port = process.env.port || 8080;


app.all('*', (req, res, next) => {
    next();
})

app.use(express.json());

const fs = require('fs');
const readline = require('readline');


setInterval(async()=>{
    const temperature = await getTemperature();
    console.log(temperature);
},1000);

app.post('/rules', (req, res) => {
    const path = process.env.RULES_FILE_PATH;
    const newRule = req.body.data;
    try {
        if (fs.existsSync(path) && newRule) {
            console.log(newRule);
            fs.writeFileSync(path, newRule);
            res.json({ message: "File is created succefully." });
            res.sendStatus(200);
        }
    } catch (error) {
        console.error(error);
        res.json({ message: "Error reading the file" });
        res.sendStatus(500);
    }
});


app.all('*', (req, res) => res.send('Global handler'));

app.listen(port);
console.log('listening to port', port)