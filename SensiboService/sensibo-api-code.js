const axios = require('axios');
require('dotenv').config();
const patchService= require('./patchService');


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
            if (targetTemperature === "None") {
                const response = await axios.post(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates?apiKey=${process.env.SENSIBO_API_KEY}`, {
                    "acState": {
                        "on": true
                    }
                })

            } else {   // set ac on and update the temprture
                console.log('in upatign temprature ac')
                console.log(response);
                const [lightRes,modeRes,temperatureRes,postResponse]= await Promise.all([
                patchService('light','on'),
                patchService('mode','heat'),
                patchService('targetTemperature',`${parseInt(targetTemperature)}`),
                post(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates?apiKey=${process.env.SENSIBO_API_KEY}`, {
                    "acState": {
                        "on": true
                    }
                })
            ]);
                // updates the tAC's temperature state
                console.log('lightRes'+lightRes)
                console.log('modeRes'+modeRes)
                console.log('temperatureRes'+temperatureRes)
                console.log('temperatureRes'+postResponse)
                res.data.headers['Content-Type'];    //application/json;charset=utf-8
            }

        }
    } catch (err) {
        console.log(err + "Invalid read from Sensibo");
    }
}
 