
const getTemperature = require('../Arduino/temperature');
const { setACState } = require('../sensibo-api-code');
const readline = require('readline');
const fs = require('fs');

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
            console.log('Changed temp value');
        } catch (err) {
            console.log(err);
        }
    });

    process.chdir(currDir)
}


let i = 19;
function startInterval() {
    setInterval(async () => {
        //const temperature = await getTemperature();
        activePythonScript(process.env.PATH_TO_Interpreter_DIR, ["temperature", ++i],
            "../SmartByte-Interpreter", "setValueBySensor.py", "../SmartByte-POC-server");
        activePythonScript(process.env.PATH_TO_Interpreter_DIR, ['RUN("examp.txt")'],
            "../SmartByte-Interpreter", "shell.py", "../SmartByte-POC-server");
        readFunctionFileAndExectue();
        clearFunctionTextFile();
    }, 5000);
}

function clearFunctionTextFile() {
    fs.truncate('../SmartByte-Interpreter/functions.txt', 0, function () { console.log('done') });
}

module.exports = {
    startInterval
}