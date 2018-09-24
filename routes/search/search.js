var express = require('express');
var router = express.Router();
var sdata = require('../../data/seoul_subway_info.json'); 

// var encoded = encodeURIComponent('영등포');
// postman.setEnvironmentVariable("encoded", encoded);

//'/:'+querystring.escape('keyword')
router.get('/:keyword', async function(req, res) {
    let keyword = req.params.keyword; 

    // console.log(keyword);    
    // querystring.unescape(keyword);

    if(!keyword)
    {
        res.status(400).send({
            message : "Null Values"
        }); 
    }
    else {
        let i;
        for (i=0; i<sdata.DATA.length; i++){
            if(sdata.DATA[i].station_nm == keyword){
               console.log(sdata.DATA[i]);
               res.status(200).send({
                   message : "Successfully search subway",
                   data : sdata.DATA[i]
               }); 
            }
        }
        if(i == sdata.DATA.length -1){
            res.status(400).send({
                message : "Incorrect Input"
            })
        }
    }
});

module.exports = router;
