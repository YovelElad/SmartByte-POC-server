require('dotenv').config();
const fs = require('fs');
const readline = require('readline');
const express = require('express');
const utils = require('./Utils/utils');
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


app.listen(port);
console.log('listening to port', port)