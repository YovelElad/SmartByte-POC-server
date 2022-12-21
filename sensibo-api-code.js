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

exports.setACState = async (targetTemperature = "None", temperatureUnit = "Celsius") => {
    try {
        const currentState = await this.getACState();
        if (currentState === false) {
            if (targetTemperature !== "None") {
                console.log('dasdsaadsadasdsada');
                console.log(typeof(targetTemperature));
                console.log(temperatureUnit);
                const response = await axios.post(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates?apiKey=${process.env.SENSIBO_API_KEY}`, {
                    "acState": {
                        "on": true,
                        "targetTemperature": targetTemperature,
                        "temperatureUnit": temperatureUnit
                    }
                })

            } else {
                const response = await axios.post(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates?apiKey=${process.env.SENSIBO_API_KEY}`, {
                    "acState": {
                        "on": true
                    }
                })
            }

        }
    } catch (err) {
        console.log(err + "Ivalid read from Sensibo");
    }
}


