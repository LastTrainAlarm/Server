const express = require('express');
const router = express.Router();
const sdata = require('../../data/seoul_subway_info.json'); 
const jwt = require('../../module/jwt.js'); 
const db = require('../../module/pool.js');
const qs = require('querystring');
const enc = require('urlencode');

// var encoded = encodeURIComponent('영등포');
// postman.setEnvironmentVariable("encoded", encoded);


//'/:'+querystring.escape('keyword')
//`/:${qs.escape('keyword')}`
router.get('/:keyword', async function(req, res) {
    let keyword = (req.params.keyword); 
    let token = req.headers.token; 
    let user_idx, decoded ;
    console.log(keyword);    
    enc.decode(keyword);
    console.log(keyword);

    let name_arr = [];
    let res_arr = []; 
    let res_data = {}; 

    if(!token){
        res.status(400).send({
            message : "Null Value"
        })
        return; 
    }
    else {
        decoded = jwt.verify(token); 
        if(decoded == -1){
            res.status(400).send({
                message : "Token Error"
            })
            return ; 
        } 
        else {
            user_idx = decoded.user_idx; 
        }
    }

    if(!keyword)
    {
        res.status(400).send({
            message : "Null Values"
        }); 
    }
    else {
        //"~~역"이라고 입력했을 경우 substring
        if(keyword.substring(keyword.length, keyword.length-1) == "역"){
            keyword = keyword.substring(0, keyword.length-1); 
        }
        
        var fav_onoff;
        let favnm=[]; 
        //즐찾 누른 여부 확인
        let checkFav = 'SELECT * FROM favorite WHERE user_idx = ?'; 
        let checkFavRes = await db.queryParam_Arr(checkFav, [user_idx]); 
        if(!checkFavRes){
            res.status(500).send({
                message : "Internal Server Error"
            }); 
            return; 
        }
        else {
            for(let j=0; j<checkFavRes.length; j++){
                favnm = favnm.concat(checkFavRes[j].fav_name); 
            }
        }

        for (let i=0; i<sdata.DATA.length; i++){
            let res_nm = sdata.DATA[i].station_nm; 
            if(res_nm.indexOf(keyword) != -1){ 
                if(!name_arr.includes(res_nm)) 
                {
                    if(favnm.includes(res_nm))
                        fav_onoff=1;
                    else
                        fav_onoff=0; 
                    name_arr = name_arr.concat(res_nm);
                    res_data = {
                        station_name : sdata.DATA[i].station_nm,
                        station_x : sdata.DATA[i].xpoint_wgs, 
                        station_y : sdata.DATA[i].ypoint_wgs,
                        fav_onoff : fav_onoff 
                    }
                    res_arr = res_arr.concat(res_data);
                }
            }
        }
        res.status(200).send({
            message : "Successfully search subway",
            data : res_arr,
        });
    }
});

module.exports = router;
