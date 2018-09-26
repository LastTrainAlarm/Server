var express = require('express');
var router = express.Router();
const db = require('../../module/pool.js');
var jwt = require('../../module/jwt.js');
//const secretKey = require('../config/secretKey.js').secret;

router.post('/', async function(req, res) {
    let token = req.headers.token;
    let keyword = req.body.keyword;

    if(!token || !keyword) {
        res.status(400).send ({
            "message" : "Null Value"
        });
    } else {
        let decoded = jwt.verify(token);
        if (!decoded) {
            res.status(500).send({
                "message" : "Internal Server Error"
            });
        }   
        else {
            let pushFav = `
            INSERT INTO lasttrain.favorite(fav_name, user_idx)
            VALUES(?, ?)
            `;

            let checkFav = 'SELECT * FROM lasttrain.favorite' 
            let checkFavRes = await db.queryParam_None(checkFav); 
            console.log(checkFavRes);
            let pushFavResult = await db.queryParam_Arr(pushFav, [keyword, decoded]);
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
 });

 router.get('/', async function(req, res) {
    let token = req.headers.token;
    let decoded = jwt.verify(token);
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
        let getFavResult = db.queryParam_Arr(getFav, [decoded]);
        if (!getFavResult) {    
            res.status(500).send({
                "message" : "Internal Server Error"
            });
        }
        else {
            
            res.status(201).send ({
                "message" : "Successfully register favorite station",
                "data" : getFavResult[0]
                // DB 받아와야 함 여기 모르겠따리,,,,,

            });
        }
    }
 });
 module.exports = router;