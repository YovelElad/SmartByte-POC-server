const axios = require('axios');
module.exports = getHumidity = async () => {
    try {
        const response = await axios({
            url: `${process.env.SENSOR_URL}/humidity`,
            method: "get",
        });
        return response.data;
    } catch (err) {
        console.log(err + "Cant read from esp32's sensor");
    }
}