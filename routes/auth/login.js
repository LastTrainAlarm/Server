var express = require('express');
var router = express.Router();
const db = require('../../module/pool.js');
const crypto = require('crypto-promise');
var jwt = require('../../module/jwt.js');

router.post('/', async function(req, res) {
    let user_id = req.body.user_id;
    let user_pwd = req.body.user_pwd;

    // 사용자가 입력 안했을때
    if (!user_id || !user_pwd) {
        res.status(400).send({
            "message" : "Null Value"
        });
    }

    else { // 입력은 잘했어
        //있는 아이디인지 확인
        let checkID = `
        SELECT *
        FROM lasttrain.user
        WHERE user_id = ? `;
        let checkIDResult = await db.queryParam_Arr(checkID, [user_id]);
        if(!checkIDResult){
            res.status(500).send({
                message : "Internal Server Error"
            }); 
        }

        //아이디가 없어
        if (checkIDResult.length == 0) {
            res.status(400).send ({
                "message" : "Login Failed - incorrect ID"
            });
        }
        
        else {
            // 입력받은 패스워드
            var str = user_pwd;
            // DB에서 해당 ID의 salt값을 찾는다
            let checkPW = `
            SELECT *
            FROM lasttrain.user
            WHERE user_id = ?
            `;

            let checkPWResult = await db.queryParam_Arr(checkPW, [user_id]);
            
            let userPW = await crypto.pbkdf2(str, checkPWResult[0].user_salt, 100000, 64, 'sha512');

            // DB에 저장된 pwd == 얻어온 salt로 해싱한 값,,?
            if (checkPWResult[0].user_pwd == userPW.toString('base64')) {
                let token = jwt.sign(checkPWResult[0].user_idx);
                // 토큰 발급
                res.status(201).send ({
                    "message" : "Successfully sign in",
                    "user token" : token
                });
            } else {
                res.status(400).send ({
                    "message" : "Login Failed - incorrect pw"
                });
            }
        }
    }
});
module.exports = router;