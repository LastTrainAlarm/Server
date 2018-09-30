var express = require('express');
var router = express.Router();
var key = require('../../config/secretKey.js'); 
var sdata = require('../../data/seoul_subway_info.json');
var request = require('request');
// const jwt = require('../../module/jwt.js'); 
// const db = require('../../module/pool.js');

router.get('/:start_sub/:last_sub', async function(req,res){
    // let token = req.headers.token;
    let start_sub = req.params.start_sub;
    let last_sub = req.params.last_sub; 
    // let s_code=[], s_line=[], l_code=[], l_line=[]; 
    // let s_xwgs=[], s_ywgs=[], l_xwgs=[], l_ywgs=[]; 
    // let user_idx, decoded; 

    // //token 입력이 없을 떄
    // if(!token){
    //     user_idx = null; 
    // }
    // else {
    //     decoded = jwt.verify(token);
    //     if(decoded == -1){
    //         res.status(400).send({
    //             message : "Token Error"
    //         }); 
    //         return; 
    //     }
    //     else {
    //         user_idx = decoded.user_idx; 
    //     }
    // }

    //입력된 역 이름의 역 코드 찾기
    // let s_idx = 0, l_idx=0;
    let code;  
    for(let i=0; i<sdata.DATA.length; i++){
        let sdata_nm = sdata.DATA[i].station_nm; 
        if(sdata_nm == start_sub){
            code = sdata.DATA[i].station_cd; 
            break; 
        }
    //     if(sdata.DATA[i].station_nm == start_sub){
    //         s_code[s_idx] = sdata.DATA[i].station_cd;
    //         s_line[s_idx] = sdata.DATA[i].line_num; 
    //         s_xwgs[s_idx] = sdata.DATA[i].xpoint_wgs;
    //         s_ywgs[s_idx] = sdata.DATA[i].ypoint_wgs;
    //         s_idx++; 
    //     }
    //     if(sdata.DATA[i].station_nm == last_sub){
    //         l_code[l_idx] = sdata.DATA[i].station_cd;
    //         l_line[l_idx] = sdata.DATA[i].line_num; 
    //         l_xwgs[l_idx] = sdata.DATA[i].xpoint_wgs;
    //         l_ywgs[l_idx] = sdata.DATA[i].ypoint_wgs;
    //         l_idx++; 
    //     }
    }
    


    // let time; 
    // let start_cd, end_cd; 
    // for(let p=0; p<=s_idx; p++){
    //     for(let q=0; q<=l_idx; q++){
    //         request({
    //             url : 'http://ws.bus.go.kr/api/rest/pathinfo/getPathInfoBySubway?serviceKey='+secretKey+"&startX="+s_ywgs[p]+"&startY="+s_xwgs[p]+"&endX="+l_ywgs[q]+"&endY="+l_xwgs[q],
    //             method : 'GET', 
    //         }, function(err, response, body){
    //             var jbody = xml2json.parser(body);
    //             if(jbody.serviceresult.msgheader.headercd == 0){
    //                 time = jbody.serviceresult.msgbody.itemlist.time;
    //                 start_cd = s_code[p]; 
    //                 end_cd = l_code[q]; 
    //             }
    //         })
    //     }
    // }

    request({
        url : "http://openAPI.seoul.go.kr:8088/"+key.lastTrainInfo_key+"/json/SearchLastTrainTimeByIDService/1/3/"+code+"/1/1/", 
        method : "GET",
    }, function(err, response, body){
        let time = []; 
        body = JSON.parse(body); 
        for(let i=0; i<body.SearchLastTrainTimeByIDService.row.length; i++){
            time = time.concat(body.SearchLastTrainTimeByIDService.row[i].LEFTTIME);
        }
        res.status(200).send({
            message : "Successfully search last train info", 
            data : time
        });
    })

});

module.exports = router;