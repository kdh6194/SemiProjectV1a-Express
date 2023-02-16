const path = require('path')
const express = require('express')
const router = express.Router();

router.get('/join.html',(req, res)=>{
    res.sendFile(path.join(__dirname,'../public','join.html'));
});
router.get('/login.html',(req, res)=>{
    res.sendFile(path.join(__dirname,'../public','login.html'));
});
router.get('/myinfo.html',(req, res)=>{
    res.sendFile(path.join(__dirname,'../public','myinfo.html'));
});
module.exports = router
