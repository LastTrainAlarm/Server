var express = require('express');
var router = express.Router();
var key = require('../../config/secretKey.js'); 
var sdata = require('../../data/seoul_subway_info.json');
var request = require('request');
const jwt = require('../../module/jwt.js'); 
const db = require('../../module/pool.js');


router.get('/:y/:x', async function(req,res){
    let x = req.params.x;
    let y = req.params.y;
    let token = req.headers.token; 
    let user_idx, decoded; 

    //token 입력이 없을 떄
    if(!token){
        user_idx = null; 
    }
    else {
        decoded = jwt.verify(token);
        if(decoded == -1){
            res.status(400).send({
                message : "Token Error"
            }); 
            return; 
        }
        else {
            user_idx = decoded.user_idx; 
        }
    }
    
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
            radius : '2000',
        }
    }; 
    let data_arr = [];
    let name_arr = []; 
    request(options, async function(err, response, body){
        if(err){
            res.status(500).send({
                message : "Internal Server Error1"
            }); 
        }
        else{
            body = JSON.parse(body); 
            if(!err && response.statusCode == 200){
                let fav_onoff;
                let checkFavRes;
                if(user_idx == null){
                    checkFavRes = []; 
                }
                else {
                    let checkFav = 'SELECT * FROM favorite WHERE user_idx = ?';
                    checkFavRes = await db.queryParam_Arr(checkFav, [user_idx]); 
                }
                let favnm=[]; 
                if(!checkFavRes){
                    res.status(500).send({
                        message : "Internal Server Error", 
                    });
                    return; 
                }
                else {
                    for(let j=0; j<checkFavRes.length; j++){
                        favnm = favnm.concat(checkFavRes[j].fav_name);
                    }
                }

                for (let i=0;i<body.documents.length; i++){
                    // data_arr = data_arr.concat(body.documents[i]); 
                    var name = body.documents[i].place_name; 
                    var st_info = name.split('역 ');
                    
                    if(!name_arr.includes(st_info[0])){   
                        if(user_idx!=null){
                            if(favnm.includes(st_info[0]))
                                fav_onoff = 1; 
                            else 
                                fav_onoff = 0; 
                        }
                        else {
                            fav_onoff = null;
                        }
                        name_arr = name_arr.concat(st_info[0]);
                        data_res = {
                            station_name : st_info[0],
                            station_x : body.documents[i].y,
                            station_y : body.documents[i].x,
                            fav_onoff : fav_onoff,
                        }
                        data_arr = data_arr.concat(data_res);

                    }
                }
            }

            res.status(200).send({
                message : "Successfully search stations in here",
                data : data_arr,
            });
        }
    })
})

module.exports = router;
