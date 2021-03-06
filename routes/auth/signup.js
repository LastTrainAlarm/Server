var express = require('express');
var router = express.Router();
const crypto = require('crypto-promise');
const db = require('../../module/pool.js');

router.post('/', async function(req, res) {
  let user_id = req.body.user_id;
  let user_pwd = req.body.user_pwd;
  let user_email = req.body.user_email;
  let user_name = req.body.user_name;

  if (!user_id || !user_pwd) { //사용자가 잘못 입력
    res.status(400).send({
      "message" : "Null Value"
    });
  }
  else { //사용자가 입력
    //중복회원 검사
    let checkUserQuery = `
    SELECT *
    FROM lasttrain.user
    WHERE user_id = ? `;
    let checkUserResult = await db.queryParam_Arr(checkUserQuery, [user_id]);

    // 잘못된 연결일 경우
    if (!checkUserResult) {
      res.status(500).send ({
        "message" : "Internal Server Error"
      });
    }
    //사용자 아이디가 중복이거나 없어서 가입 가능하거나.
    else {
      if (checkUserResult.length == 0) {
        
        var str = user_pwd;
        //salt값 생성?
        crypto.randomBytes(32, async function(err, buffer) {
          if (err) {
          } else {
            const salt = buffer.toString('base64');
            crypto.pbkdf2(str, salt, 100000, 64, 'sha512', async function(err, hashed) {
              if (err) {
              } else {
                //DB에 INSERT
                let pushUser = 'INSERT INTO lasttrain.user(user_id, user_pwd, user_email, user_name, user_salt) VALUES(?, ?, ?, ?, ?)';
                //hash된 값을 db에 insert
                let pushUserResult = await db.queryParam_Arr(pushUser, [user_id,hashed.toString('base64'), user_email, user_name, salt]);
                if(!pushUserResult){
                  res.status(500).send({
                    "message" : "Internal Server Error"
                  }); 
                }
                else {
                  res.status(201).send ({
                    "message" : "Successfully sign up",
                  });
                }
              }
            });
          }
        });
      }
      else {
        res.status(400).send ({
          "message" : "Already Exist"
        });
      }
    }
  }
});
module.exports = router;
