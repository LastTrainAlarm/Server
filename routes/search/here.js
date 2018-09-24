var express = require('express');
var router = express.Router();
var key = require('../../config/secretKey.js'); 
var sdata = require('../../data/seoul_subway_info.json');
var request = require('request');


router.get('/:x/:y', async function(req,res){
    let x = req.params.x;
    let y = req.params.y;
    
    let options = {
        host : 'dapi.kakao.com',
        url : 'https://dapi.kakao.com/v2/local/search/keyword.json?', 
        method : 'GET', 
    
        headers : {
            'Authorization' : key.kakao_auth_key,
            'Content-Type' : 'application/json;charset=UTF-8', 
        }, 
        form : {
            query : '지하철역',
            y : y,
            x : x,
            radius : '3000',
        }
    }; 
    let data_arr = [];
    let name_arr = []; 
    request(options, function(err, response, body){
        if(err){
            res.status(500).send({
                message : "Internal Server Error"
            }); 
        }
        else{
            body = JSON.parse(body); 
            if(!err && response.statusCode == 200){
                for (let i=0;i<body.documents.length; i++){
                    // data_arr = data_arr.concat(body.documents[i]); 
                    var name = body.documents[i].place_name; 
                    var st_info = name.split(' ');
                    console.log(st_info[0]); 
                    console.log(st_info[1]);
                    var st_name = st_info[0].substr(0,st_info[0].length-1);
                    
                    if(!name_arr.includes(st_name)){
                        name_arr = name_arr.concat(st_name);
                    }
                }



                for (let j=0; j<sdata.DATA.length; j++){
                    if(name_arr.includes(sdata.DATA[j].station_nm))
                    {
                        var data_res = {
                            "station_name" : sdata.DATA[j].station_nm, 
                            "station_code" : sdata.DATA[j].station_cd, 
                            "station_xpoint_wgs" : sdata.DATA[j].xpoint_wgs,
                            "station_ypoint_wgs" : sdata.DATA[j].ypoint_wgs,
                            "station_line" : sdata.DATA[j].line_num,
                        }
                        if(data_arr.staion_name != (data_res.station_name)){
                            data_arr = data_arr.concat(data_res);
                        }
                         
                    }
                }
                // for(let s=0; s<name_arr)

                console.log(name_arr);
                res.status(200).send({
                    message : "Successfully search stations in here",
                    data : data_arr,
                });
            }
        }
    
})
})

module.exports = router;
