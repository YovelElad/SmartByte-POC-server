const axios = require('axios');
require('dotenv').config();

exports.patchService() = async (key, value)=>{
    try{
        const response= await axios.patch(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates/${key}?apiKey=${process.env.SENSIBO_API_KEY}`, { "newValue": `${value}`});
        return response;
    } catch(err){
        console.log('Invalid patchService request.')
    }
}