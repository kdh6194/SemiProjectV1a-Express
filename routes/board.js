const path = require('path')
const express = require('express')
const router = express.Router();
const Board = require('../models/Board')

router.get('/list.html',async (req, res)=>{
    let list = new Board().show().then((list) => list);
    // console.log(await list)
    res.render('board/list',{title : '게시판', list : await list});
});
router.get('/view.html',(req, res)=>{
    res.render('board/view',{title : '게시글'});
});
router.get('/write.html',(req, res)=>{
    res.render('board/write',{title : '게시글 작성'});
});
router.post('/write.html',async (req, res)=>{
    let viewName = '../board/failwrite'
    let {title,userid,contents}=req.body
    let rowcnt = new Board(null,title,userid,null,null, contents).putin().then((result)=>result);
    if (await rowcnt > 0) viewName = '/list.html'
    // viewName 자리는 path에 기입된 경로로 설정
    res.redirect(303,viewName);
});

module.exports = router
