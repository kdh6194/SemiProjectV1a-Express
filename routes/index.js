const path = require('path')
const express = require('express')
const router = express.Router();

router.get('/',(req, res)=>{
    res.render('index',{title : '첫 화면'});
});
router.get('/index.html',(req, res)=>{
    res.render('index',{title : '첫 화면'});
});

module.exports = router
