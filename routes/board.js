const path = require('path')
const express = require('express')
const router = express.Router();

router.get('/list.html',(req, res)=>{
    res.render('board/list',{title : '게시판'});
});
router.get('/view.html',(req, res)=>{
    res.render('board/view',{title : '게시글'});
});
router.get('/write.html',(req, res)=>{
    res.render('board/write',{title : '게시글 작성'});
});

module.exports = router
