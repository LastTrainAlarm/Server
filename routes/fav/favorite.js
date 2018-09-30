var express = require('express');
var router = express.Router();
const db = require('../../module/pool.js');
var jwt = require('../../module/jwt.js');
let subway = require('../../data/seoul_subway_info.json');
//const secretKey = require('../config/secretKey.js').secret;

router.put('/', async function(req, res) {
    let token = req.headers.token;
    let keyword = req.body.keyword;
    let decoded = jwt.verify(token);
    let user_idx = decoded.user_idx;

    if(!token || !keyword) {
        res.status(400).send ({
            "message" : "Null Value"
        });
    } else {
        var isthere = '';
        // POST로 받은 KEYWORD가 있는 역 이름이 맞는지
        for (let i=0; i<subway.DATA.length; i++) {
            if (subway.DATA[i].station_nm == keyword) {
                isthere = 'yes';
            }
            else {}
        }

        if (isthere == 'yes') {
            // keyword(역 이름)이 등록되어 있는 역일 경우

            if (!decoded) {
                res.status(500).send({
                    "message" : "Internal Server Error"
                });
            }
            else {
                let checkStn = `
                SELECT *
                FROM lasttrain.favorite
                WHERE fav_name = ?`;

                let checkStnResult = await db.queryParam_Arr(checkStn, [keyword]);

                if (checkStnResult.length == 0) { // 페이보릿에 역 없으면 즐찾 추가
                    let pushFav = `
                    INSERT INTO lasttrain.favorite(fav_name, user_idx)
                    VALUES(?, ?)
                    `;
                    let pushFavResult = await db.queryParam_Arr(pushFav, [keyword, user_idx]);
                    if(!pushFavResult) {
                        res.status(500).send({
                            "message" : "Internal Server Error"
                        });
                    }
                    else {
                        let checkFav = 'SELECT * FROM lasttrain.favorite';
                        let checkFavRes = await db.queryParam_Arr(checkFav);
                        console.log(checkFavRes);
                        res.status(201).send ({
                            "message" : "Successfully register favorite station"
                        });
                    }
                }
                else { // 역 있으면 즐찾 해제
                    let delFav = `
                    DELETE FROM lasttrain.favorite
                    WHERE fav_name = ?
                    `;
                    let delFavResult = await db.queryParam_Arr(delFav, [keyword]);
                    let checkFav = 'SELECT * FROM lasttrain.favorite';
                        let checkFavRes = await db.queryParam_Arr(checkFav);
                        console.log(checkFavRes);
                    res.status(201).send ( {
                        "message" : "Successfully clear favorite station"
                    });
                }
                
            }
        }
        else { // 등록된 역 이름이 아닐 경우
            res.status(400).send({
                "message" : "Null Value"
            });
        }
    }
 });

 router.get('/', async function(req, res) {
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    let user_idx;
    let res_arr = [];

    if(!decoded) {
        res.status(400).send({
            "message" : "Null Value"
        });
        return; 
    }
    else {
        user_idx = decoded.user_idx;
    }

    let getFav = `
    SELECT *
    FROM lasttrain.favorite
    WHERE user_idx = ?
    `;
    let getFavResult = await db.queryParam_Arr(getFav, [user_idx]);
    if (!getFavResult) {    
        res.status(500).send({
            "message" : "Internal Server Error"
        });
    }
    else {
        for(let i=0; i<getFavResult.length; i++){
            // data_res = {
            //     station_name : fav_name
            // }
            res_arr = res_arr.concat(getFavResult[i].fav_name); 
        }

        //console.log(getFavResult);
        res.status(200).send ({
            "message" : "Successfully get favorite station",
            "data" :  res_arr
        });
    }
 });
 module.exports = router;