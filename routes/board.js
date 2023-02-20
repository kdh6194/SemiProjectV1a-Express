const path = require('path')
const express = require('express')
const router = express.Router();
const Board = require('../models/Board')

router.get('/list.html',async (req, res)=>{
    let list = new Board().show().then((list) => list);
    // console.log(await list)
    res.render('board/list',{title : '게시판', list : await list});
});
// 제목이 데이터 타입이 varchar(100) 이라서 제목길이가 길어지면 에러발생
// then뒤에 붙는 괄호안에는 async가 써도 안써도 그만이다(값이 같단다)
router.get('/view.html',async (req, res)=>{
    let bno = req.query.bno
    let list = new Board().showOne(bno).then((list)=>list);
    res.render('board/view',{title : '게시글',list : await list});
});
router.get('/write.html',(req, res)=>{
    res.render('board/write',{title : '게시글 작성'});
});
router.post('/write.html',async (req, res)=>{
    let viewName = '../board/writefail'
    let {title,userid,contents}=req.body
    let rowcnt = new Board(null,title,userid,null,null, contents).putin().then((result)=>result);
    if (await rowcnt > 0) viewName = '/list.html'
    // viewName 자리는 path에 기입된 경로로 설정
    // 값을 내보낼때 DB 컬럼명 순서대로(?)/
    // 지정한 sql문 순서대로(?) 기입하면됨
    res.redirect(303,viewName);
});

module.exports = router
