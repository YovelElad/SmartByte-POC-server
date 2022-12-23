const axios= require('axios');
require('dotenv').config();


exports.setACState= async (state=false,targetTemperature=20) =>{
    try{
       const currentState= await this.getACState();
        if(currentState==false){
            const response= await axios.post(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates?apiKey=${process.env.SENSIBO_API_KEY}`,{
           "acState":{
               "on":state,
               "targetTemperature":targetTemperature
           }
        })
        return state;
        }
    } catch(err){
        console.log(err+"Invalid read from Sensibo");
    }
}

exports.getACState= async () =>{
    try{
        const response= await axios.get(`https://home.sensibo.com/api/v2/pods/${process.env.DEVICE_ID}/acStates?apiKey=${process.env.SENSIBO_API_KEY}`);
        const currentState=response.data.result[0].acState.on;
        return currentState;

    } catch(err){
        console.log(err);
    }

}

