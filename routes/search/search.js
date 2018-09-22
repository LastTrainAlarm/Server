var express = require('express');
var router = express.Router();
var db = require('../../module/pool.js'); 
var scretkey = require('../../config/secretKey.js')
var sdata = require('../../data/seoul_subway_info.json'); 
var querystring = require('querystring');



router.get('/:keyword', async function(req, res) {
    console.log('시발');
//    querystring.unescape(keyword);
    // let keyword = req.params.keyword; 
    

    console.log(keyword);
    // if(!keyword)
    // {
    //     res.status(400).send({
    //         message : "Incorrect Input"
    //     }); 
    // }
    // else {
    //     for (let i=0; i<sdata.DATA.length; i++){
    //         if(sdata.DATA[i].station_nm == keyword){
    //            console.log(sdata.DATA[i]);  
    //         }
    //     }
    // }
});

module.exports = router;
