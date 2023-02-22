const express = require('express');
const router = express.Router();
const Zipcode = require('../models/Zipcode')

router.get('/zipcode',async (req, res)=>{
    let sidos = new Zipcode().getSido().then((result)=>result)
    console.log(await sidos)

    let sido = '서울'
    let guguns = new Zipcode().getGugun(sido).then((result)=>result)
    console.log(await guguns)

    let gugun = '강남구'
    let dongs = new Zipcode().getDong(sido,gugun).then((result)=>result)
    console.log(await dongs)

    res.render('zipcode',{title:'시군구동 찾기'});
}); //app.js 라우터 경로에 zipcode를 설정을 안했기 때문에 '/'가 작동이 되지 않았음
    // 같은 경로의 router.get이 있으면 처음에 있는 명령만 동작 에러 발생은 나지 않음

// router.get('/zipcode',async (req, res)=>{
//     // let sido = req.query.sido
//     let sido = '서울'
//     let guguns = new Zipcode().getGugun(sido).then((result)=>result)
//     console.log(await guguns)
//     res.render('zipcode',{title:'시군구동 찾기',guguns:await guguns});
// });

// router.get('/zipcode',async (req, res)=>{
//     // let {sido,gugun} = req.query
//     let sido = '서울'
//     let gugun = '강남구'
//     let dongs = new Zipcode().getDong(sido,gugun).then((result)=>result)
//     console.log(await dongs)
//     res.render('zipcode',{title:'시군구동 찾기',dongs:await dongs});
// });

module.exports = router