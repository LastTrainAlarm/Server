var express = require('express');
var router = express.Router();
const db = require('../../module/pool.js');
var jwt = require('../../module/jwt.js');
let subway = require('../../data/seoul_subway_info.json');
//const secretKey = require('../config/secretKey.js').secret;

router.post('/', async function(req, res) {
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
                let checkFav = 'SELECT * FROM lasttrain.favorite' 
                let checkFavRes = await db.queryParam_None(checkFav);

                let pushFav = `
                INSERT INTO lasttrain.favorite(fav_name, user_idx)
                VALUES(?, ?)
                `;
                let pushFavResult = await db.queryParam_Arr(pushFav, [keyword, user_idx]);
                console.log(checkFavRes);
                if(!pushFavResult) {
                    res.status(500).send({
                        "message" : "Internal Server Error"
                    });
                }
                else {
                    res.status(201).send ({
                        "message" : "Successfully register favorite station"
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
    let user_idx = decoded.user_idx;

    if(!decoded) {
        res.status(400).send({
            "message" : "Null Value"
        });
    }
    else {
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
            console.log(getFavResult);
            res.status(201).send ({
                "message" : "Successfully register favorite station",
                "data" : getFavResult.fav_name // 이것이 아닌가봉가!!!
            });
        }
    }
 });
 module.exports = router;