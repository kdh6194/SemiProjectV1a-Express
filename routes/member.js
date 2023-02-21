const path = require('path');
const express = require('express');
const Member = require('../models/Member');
const router = express.Router();

router.get('/join.html',(req, res)=>{
    res.render('member/join',{title : '회원 가입'});
});
router.post('/join.html',(req, res)=>{
    // redner가 아니라 redirect로 작성해야한다
    // 다음 페이지로 넘기려면 303을 작성해야한다
    let {userid,passwd,name,email} = req.body;
    new Member(userid,passwd,name,email).insert();
    res.redirect(303,'/login.html');
});
router.get('/login.html',(req, res)=>{
    res.render('member/login',{title : '로그인'});
});
router.post('/login.html',async (req, res)=>{
    let {userid,passwd} = req.body;
    let viewName = '../member/loginfail';
    let islogin = new Member().login(userid,passwd).then((result) => result)
    // console.log(await islogin)
    if (await islogin > 0){
        viewName = '/myinfo.html';
        req.session.userid = userid; // 아이디를 세션변수로 등록
    }
    res.redirect(303,viewName)
});
// form이름에 맞게 작성을 해야 한다 -> hbs에서 설정된 name에 맞게
router.get('/logout.html',(req, res)=>{
    req.session.destroy(()=>{req.session});
// 메뉴의 url이 path와 다르면 에러가 발생한다.
    res.redirect(303,'/')
});
router.get('/myinfo.html',(req, res)=>{
    if (req.session.userid){
    res.render('member/myinfo',{title : '나의 정보'});
    }else {res.redirect(303,'/login.html')}
});
module.exports = router
