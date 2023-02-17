const path = require('path')
const express = require('express')
const Member = require('../models/Member')
const router = express.Router();

router.get('/join.html',(req, res)=>{
    res.render('member/join',{title : '회원 가입'});
});
router.post('/join.html',(req, res)=>{
    res.redirect(303,'/login.html');
    // redner가 아니라 redirect로 작성해야한다
    // 다음 페이지로 넘기려면 303을 작성해야한다
    let {userid,passwd,name,email} = req.body;
    new Member(userid,passwd,name,email).insert();
});
router.get('/login.html',(req, res)=>{
    res.render('member/login',{title : '로그인'});
});
router.get('/myinfo.html',(req, res)=>{
    res.render('member/myinfo',{title : '나의 정보'});
});
module.exports = router
