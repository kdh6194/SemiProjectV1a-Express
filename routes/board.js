const express = require('express')
const router = express.Router();
const Board = require('../models/Board')
const ppg = 15;

// 페이징 기능 지원
// 현재 페이지를 의미하는 변수 : cpg
// 현재 페이지에 해당하는 게시물들을 조회하려면 해당범위의 시작값과 종료값 계산
// cpg : 1 => 1 ~ 5
// cpg : 2 => 6 ~ 10
// cpg : 3 => 11 ~ 15
// cpg : 4 => 16 ~ 20
//  수식
//  페이지당 게시물 수 ppg : 5
//  stnum : (cpage - 1) * ppg + 1
//  ednum : stnum + ppg

// 페이지네이션 : stpgn = 0<cpg<11 -> 12345678910
//  stpgn = 0<cpg<11 -> 12345678910
//  stpgn = 10<cpg<21 -> 11121314151617181920
//  stpgn = 20<cpg<31 -> 21222324252627282930
//  stpgn = 30<cpg<41 -> 31323334353637383940
// stpgn = parseInt((cpg - 1) / 10) * 10 + 1

router.get('/list.html',async (req, res)=>{
    let {cpg} = req.query;
    cpg = cpg ? cpg : 1;
    let stnum = (cpg - 1) * ppg + 1; // 지정한 페이지의 범위 시작값 계산
    let stpgn = parseInt((cpg - 1) / 10) * 10 + 1

    // 페이지네이션 블럭 생성
    let stpgns = [];
    for (let i = stpgn; i < stpgn + 10; i++) {
        let iscpg = (i == cpg) ? true: false
        let pgn = {'num': i,'iscpg':iscpg}
        stpgns.push(pgn)
    }
    let alpg = new Board().selectCount().then((list) => list);

    let isprev = ( cpg - 1 > 0 )? true:false ;
    let isnext = ( cpg < alpg )? true:false ;
    let pgn = {'prev': stpgn - 1, 'next': stpgn + 9 + 1 , 'isprev': isprev, 'isnext': isnext};



    let list = new Board().show(stnum).then((list) => list);

    res.render('board/list',{title : '게시판', list : await list, stpgns: stpgns, pgn:pgn });

});
// 조회 부분에 조회수가 찍히지 않는 이유 : models에 views를 기입이 안되서 출력 안됬음
// 제목이 데이터 타입이 varchar(100) 이라서 제목길이가 길어지면 에러발생
// then뒤에 붙는 괄호안에는 async가 써도 안써도 그만이다(값이 같단다)
router.get('/view.html',async (req, res)=>{
    let bno = req.query.bno
    let list = new Board().showOne(bno).then((list)=>list);
    let disabled = req.session.userid ? '': 'disabled'
    res.render('board/view',{title : '게시글',list : await list, disabled});
});
// disabled는 사용자가 해당요소를 클릭하거나 입력할 수 없도록 한다.
// 사용하려면 if,삼항 연산자를 사용하여한다 그리고 render에 두번째 인자로 값을 할당해야함
router.get('/write.html',(req, res)=>{
    if (req.session.userid) {
    res.render('board/write',{title : '게시글 작성'})
    }else {res.redirect(303,'/login.html');}
});
//주소를 치고 들어가는 것을 막는것
// if(!req.session.userid) {res.redirect(303,주소)}
// else {res.render(...)}
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


router.get('/view.html/update',async (req, res)=>{
    let {bno,uid} = req.query
    let suid = req.session.userid
    if (suid && uid && (suid == uid)){
    let list = new Board().showOne(bno).then((result)=>result);
    res.render('board/update',{title : '게시판 수정하기',list : await list});
    }
    else {res.redirect(303,'/list.html')}
});

router.post('/view.html/update',(req, res)=>{
    let { title, userid,contents } = req.body;
    let bno = req.query.bno
    let suid = req.session.userid;
    if (suid && userid && (suid == userid)){
        new Board(bno, title, userid, null, null, contents).update().then((result)=>result);
        res.redirect(303,`/view.html?bno=${bno}`); // 새로고침 전까진 수정이 안됨
        // res.redirect(303,`/list.html`); list로 페이지를 띄웠을때 수정한 부분이 바꿔서 출력됨
    }// userid 요부분을 정확히 파악하는게 중요해보인다 여기서 자꾸 실수가 난다.
    //  req.body는 전부 가져오는것인지 컬럼명을 자세하게 작성해야하는듯하고
    //  req.query를 사용하면 뭔가 변경해서 사용해도 되는것 같다
});

router.get('/view.html/delete',async (req, res)=>{
    let {bno,uid} = req.query.bno;
    let suid = req.session.userid;
    if (suid && uid && (suid = uid)){ // 글작성자와 삭제자가 일치하는 경우
        new Board().delete(bno).then((result)=>result);
        res.redirect(303,'/list.html');}
}); // 근데 삭제하고나서 새로고침을 해야 삭제되었는지 확인 가능하다 -> 캐시에 남아있어서 늦게 지워지는 모양
// 그리고 location.href 주소랑 일치해야 작동이 되는듯하다.
module.exports = router
