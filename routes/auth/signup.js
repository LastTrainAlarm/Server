var express = require('express');
var router = express.Router();

router.post('/', async function(req, res) {
  let user_id = req.body.user_id;
  let user_pwd = req.body.user_pwd;
  let user_email = req.body.user_email;
  let user_name = req.body.user_name;

  if (!user_id || !user_pwd) {
    res.status(400).send({
      "message" : "Null Value"
    });
  }
  else {
    var check_userid = `
    SELECT *
    FROM user
    WHERE user_id = ? `

  }

})
module.exports = router;
