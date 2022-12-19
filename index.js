const axios = require('axios');
const SensiboClient = require('sensibo-sdk');
require('dotenv').config();

const express = require('express');
const { setACState } = require('./sensibo-api-code');
const app = express();
const cors = require("cors");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({origin: true}));

const port = process.env.port || 8080;


app.all('*', (req, res, next) => {
    utils.startInterval()
    next();
})

app.use(express.json());

const fs = require('fs');
const readline = require('readline');

app.post('/rules', (req, res) => {
    const path = process.env.RULES_FILE_PATH;
    const newRule = req.body.data;
    try {
        if (fs.existsSync(path) && newRule) {
            fs.appendFileSync(path, newRule+'\n','utf8', err => {
                if(err){
                    throw err;
                }
            });
            res.json({ message: "File is created succefully." });
            res.sendStatus(200);
        }
    } catch (error) {
        res.sendStatus(500).json({ message: "Error reading the file" });

    }
});


app.listen(port);
console.log('listening to port', port);
