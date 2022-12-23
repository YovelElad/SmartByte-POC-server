const getTemperature = require('../Arduino/sensorsData');
const getHumidity = require('../Arduino/sensorsData');
const { setACState } = require('../sensibo-api-code');
const fs = require('fs');
const readline = require('readline');
const PythonShell = require('python-shell').PythonShell;

function getDegreesFromLine(degree) {
        if(degree){
            let isDigitInLine= degree.match(/(\d+)/);
            if(isDigitInLine){
               return (isDigitInLine[0]);
            } else{
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
            //console.log('Changed temp value');
        } catch (err) {
            console.log(err);
        }
    });

    process.chdir(currDir)
}

function startInterval() {
    setInterval(async()=>{
        const temperature = await getTemperature();
        const humidity=await getHumidity();
        // activePythonScript(process.env.PATH_TO_Interpreter_DIR,["humidity", humidity],
        // "../SmartByte-Interpreter","setValueBySensor.py","../SmartByte-POC-server");
        activePythonScript(process.env.PATH_TO_Interpreter_DIR,["temperature", temperature],
        "../SmartByte-Interpreter","setValueBySensor.py","../SmartByte-POC-server");
        activePythonScript(process.env.PATH_TO_Interpreter_DIR,['RUN("examp.txt")'],
        "../SmartByte-Interpreter","shell.py","../SmartByte-POC-server");
        readFunctionFileAndExectue();
        clearFunctionTextFile()
    },8000);
}

function clearFunctionTextFile() {
    fs.truncate('../SmartByte-Interpreter/functions.txt', 0, function(){console.log('Cleared the functions.txt file')});
}

module.exports = {
    startInterval
}