
const getTemperature = require('../ArduinoService/temperatureService');
const getHumidity = require('../ArduinoService/humidityService');
const { setACState } = require('../SensiboService/sensibo-api-code');
const readline = require('readline');
const fs = require('fs');
const {readFileSync, promises: fsPromises} = require('fs');

// ✅ read file SYNCHRONOUSLY
function syncReadFile(filename) {
    const contents = readFileSync(filename, 'utf-8');
    let humidityValue="";
  
    const arr = contents.split(/\r?\n/);
    let lines=arr.toString();
    indexOFHumidityRule= lines.indexOf("humidity >");
    if(indexOFHumidityRule){
        let humidityLine= lines.slice(indexOFHumidityRule,indexOFHumidityRule+22);
        humidityValue=humidityLine.match(/(\d+)/);
        if(humidityValue){
            return (humidityValue[0]);
        } 
    }
    return -1;
  }
  
 
function getDegreesFromLine(degree) {
    if (degree) {
        let isDigitInLine = degree.match(/(\d+)/);
        if (isDigitInLine) {
            return (isDigitInLine[0]);
        } else {
            return "None";
        }
    }
}

function readFunctionFileAndExectue() {
    const file = readline.createInterface({
        input: fs.createReadStream('../SmartByte-Interpreter/functions.txt'),
        output: process.stdout,
        terminal: false
    });

    file.on('line', (line) => {
        let degrees=getDegreesFromLine(line);
        if(degrees==="None"){
            if (line === `Turn On The AC`) {
                setACState(degrees);          // turn the AC on
             }
        } else{
            if(line === `AC On ${degrees}`){
                setACState(parseFloat(degrees));          // turn the AC on specific temperature.
            }
        }
    });
}



/**
 * @param {string} tempVal The string
 */
function activePythonScript(localScriptPath, paramaters, interpreterDir, pythonFileName, currDir) {
    const PythonShell = require('python-shell').PythonShell;

    var options = {
        mode: 'text',
        pythonPath: process.env.PYTHON_PATH,
        pythonOptions: ['-u'],
        scriptPath: localScriptPath,
        args: paramaters
    };

    process.chdir(interpreterDir);

    PythonShell.run(pythonFileName, options, function (err, results) {
        try {
            if (err)
                throw err;
        } catch (err) {
            console.log(err);
        }
    });

    process.chdir(currDir)
}


function startInterval() {
    setInterval(async () => {
        let temperature = await getTemperature();
        let humidity= await getHumidity();
        activePythonScript(process.env.PATH_TO_Interpreter_DIR, ["temperature", temperature],
            "../SmartByte-Interpreter", "setValueBySensor.py", "../SmartByte-POC-server");
            activePythonScript(process.env.PATH_TO_Interpreter_DIR, ["humidity", humidity],
            "../SmartByte-Interpreter", "setValueBySensor.py", "../SmartByte-POC-server");
        activePythonScript(process.env.PATH_TO_Interpreter_DIR, ['RUN("examp.txt")'],
            "../SmartByte-Interpreter", "shell.py", "../SmartByte-POC-server");
        readFunctionFileAndExectue();
        clearFunctionTextFile();
    }, 9000);
}

function clearFunctionTextFile() {
    fs.truncate('../SmartByte-Interpreter/functions.txt', 0, function () { console.log('done') });
}

module.exports = {
    startInterval,syncReadFile
}