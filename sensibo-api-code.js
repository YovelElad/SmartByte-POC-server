const axios = require('axios');
require('dotenv').config();


exports.getACState = async () => {
    try {
        const response = await axios.get(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates?apiKey=${process.env.SENSIBO_API_KEY}`);
        const currentState = response.data.result[0].acState.on;
        return currentState;

    } catch (err) {
        console.log(err);
    }

}

exports.setACState = async (targetTemperature = "None", temperatureUnit = "C") => {
    try {
        const currentState = await this.getACState();
        if (currentState === false) {
            if (targetTemperature !== "None") {
                const response = await axios.post(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates?apiKey=${process.env.SENSIBO_API_KEY}`, {
                    "acState": {
                        "on": true
                    }
                })

            } else {   // set ac on and update the temprture
                const response = await axios.post(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates?apiKey=${process.env.SENSIBO_API_KEY}`, {
                    "acState": {
                        "on": true
                    }
                })
                const res = await axios.patch(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates/targetTemperature?apiKey=${process.env.SENSIBO_API_KEY}`, { "newValue": `${targetTemperature}` });
                // updates the tAC's temperature state
                res.data.headers['Content-Type'];    //application/json;charset=utf-8
                console.log(res.data);
            }

        }
    } catch (err) {
        console.log(err + "Invalid read from Sensibo");
    }
}


