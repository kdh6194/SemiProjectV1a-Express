const path = require('path')
const express = require('express')
const router = express.Router();

router.get('/list.html',(req, res)=>{
    res.sendFile(path.join(__dirname,'../public','list.html'));
});
router.get('/view.html',(req, res)=>{
    res.sendFile(path.join(__dirname,'../public','view.html'));
});
router.get('/write.html',(req, res)=>{
    res.sendFile(path.join(__dirname,'../public','write.html'));
});

module.exports = router
