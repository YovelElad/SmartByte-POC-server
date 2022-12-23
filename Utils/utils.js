
const getTemperature= require('../Arduino/temperature');
const { setACState } = require('../sensibo-api-code');
const readline = require('readline');
const fs = require('fs');

function readFunctionFileAndExectue() {
    const file = readline.createInterface({
        input: fs.createReadStream('../SmartByte-Interpreter/functions.txt'),
        output: process.stdout,
        terminal: false
    });
    
    file.on('line', (line) => {
        if (line == "Turn On The AC") {
            console.log("befoe setAc state");
            setACState();
            return true;
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


function startInterval() {
    setInterval(async()=>{
         const temperature = await getTemperature();
        activePythonScript(process.env.PATH_TO_Interpreter_DIR,["temperature", temperature],
        "../SmartByte-Interpreter","setValueBySensor.py","../SmartByte-POC-server");
        activePythonScript(process.env.PATH_TO_Interpreter_DIR,['RUN("examp.txt")'],
        "../SmartByte-Interpreter","shell.py","../SmartByte-POC-server");
        readFunctionFileAndExectue()
        clearFunctionTextFile()
    },8000);
}

function clearFunctionTextFile() {
    const fs = require('fs')
    fs.truncate('../SmartByte-Interpreter/functions.txt', 0, function(){console.log('done')})
}

module.exports = {
    startInterval
}