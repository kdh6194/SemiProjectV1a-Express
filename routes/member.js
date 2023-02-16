const path = require('path')
const express = require('express')
const router = express.Router();

router.get('/join.html',(req, res)=>{
    res.render('member/join',{title : '회원 가입'});
});
router.get('/login.html',(req, res)=>{
    res.render('member/login',{title : '로그인'});
});
router.get('/myinfo.html',(req, res)=>{
    res.render('member/myinfo',{title : '나의 정보'});
});
module.exports = router
