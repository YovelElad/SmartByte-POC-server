const axios= require('axios');
module.exports =  getTemperature = async() => {
    try {
        const response = await axios({
            url: `${process.env.SENSOR_URL}/temperature`,
            method: "get",
        });
        
        // if(response.data>=20){
        //     setACState();
        // }
        return response.data;
    } catch (err) {
        // res.status(500).json({ message: err });
        console.log(err + "Cant read from esp32's sensor");
    }
}