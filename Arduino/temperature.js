const axios = require('axios');

module.exports =  getTemperature = async() => {
    try {
        const response = await axios({
            url: `${process.env.SENSOR_URL}/temperature`,
            method: "get",
        });
        return response.data;
    } catch (err) {
        console.log(err + "Cant read from esp32's sensor");
    }
}