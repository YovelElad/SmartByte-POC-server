const axios= require('axios');
require('dotenv');


exports.setACState= async () =>{
    console.log("Yovel",process.env.DEVICE_ID,process.env.SENSIBO_API_KEY )
 const response= await axios.post(`https://home.sensibo.com/api/v2/pods/9EimtVDZ/acStates?apiKey=CGjf3UCamc7Kxs8iZsg2p5W9ok7A1w`,{
    "acState":{
        "on":true
    }
 }
 )
 console.log(response);
}

