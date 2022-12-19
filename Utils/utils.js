function readFunctionFileAndExectue() {
    const file = readline.createInterface({
        input: fs.createReadStream('../SmartByte-Interpreter/functions.txt'),
        output: process.stdout,
        terminal: false
    });
    
    file.on('line', (line) => {
        if (line == "Turn On The AC") {
            setACState();
        }
    });    
}

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

module.exports = {
    readFunctionFileAndExectue,
    insertValueOfTempSensor
}