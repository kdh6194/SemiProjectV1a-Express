const oracledb = require('./Oracle')
const ppg = 15;

let boardsql = {
    insert : 'insert into board (bno,title,userid,contents)values (bno.nextval,:1,:2,:3)',
    select : "select bno,title,userid,to_char(regdate,'YYYY-MM-DD')regdate,views,contents from board order by bno desc",
    paging1 : "select * from(select bno,title,userid,to_char(regdate,'YYYY-MM-DD')regdate,views,contents," +
                "row_number() over (order by bno desc) rowno from board",
    paging2 : ") bd where rowno >= :1 and rowno <:2",
    selectOne : "select bno,title,userid,to_char(regdate,'YYYY-MM-DD HH24:MI:SS')regdate2,views,contents from board where bno =:1 order by bno desc",
    selectCount : 'select count(bno) cnt from board',
    viewOne : 'update board set views = views + 1 where bno = :1',
    update : 'update board set title =:1 ,contents =:2, regdate= current_timestamp where bno =:3 ',
    delete : 'delete from board where bno =:1 '
}
// 페이지네이션 : stpgn = 0<cpg<11 -> 12345678910
//  stpgn = 0<cpg<11 -> 12345678910
//  stpgn = 10<cpg<21 -> 11121314151617181920
//  stpgn = 20<cpg<31 -> 21222324252627282930
//  stpgn = 30<cpg<41 -> 31323334353637383940
// stpgn = parseInt((cpg - 1) / 10) * 10 + 1
// switch (cpg) {
//      case >41 : 31323334353637383940
//      case >31 : 21222324252627282930
//      case >21 : 11121314151617181920
//      case >11 : 12345678910
// } 구문이 아닌 수식으로 작성할 수 있는 것은 수식으로 완성할 수 있어야 한다.

// to_char를 쓸때 to_char(regdate(컬럼명),'YYYY-MM-DD')regdate(변수명?) 이렇게 작성해야 값이 출력
// 한번에 지정해서 꺼내먹는 느낌
class Board {
    bno;
    title;
    userid;
    regdate;
    views;
    contents;
    // selectsql = `select bno,title,userid,to_char(regdate,'yyyy-mm-dd'),contents from board order by bno desc `;
    // selectOnesql = `select bno,title,userid,to_char(regdate,'yyyy-mm-dd hh:mi:ss'),contents from board where bno =:1 order by bno desc `;


    constructor(bno,title,userid,regdate,views,contents) {
        this.bno = bno;
        this.title = title;
        this.userid = userid;
        this.regdate = regdate;
        this.views = views;
        this.contents = contents;
    }
    // constructor(bno,title,userid,regdate,views,contents)에서
    // 생성자를 만들때 alt+Enter를 누르고 클래스 필드 초기화 선택
    //  shift를 누른채로 전부 다 지정해서 만들면 한번에 만들어짐
    //성적 저장
    async putin () {

        let conn = null;
        // let sql = 'insert into board (bno,title,userid,contents)values (bno.nextval,:1,:2,:3)';
        let params = [this.title,this.userid,this.contents];
        let insertcnt = 0;

        try {
            conn = await oracledb.makeConn(); // 연결
            let result = await conn.execute(boardsql.insert, params); // 실행
            await conn.commit(); // 저장
            if (result.rowsAffected > 0) {
                insertcnt = result.rowsAffected; // 콘솔 안찍고 자료를 넘겼음
            }
            console.log(result);
        }
        catch(e){ console.log(e); }
        finally{ await oracledb.closeConn(conn); } // 종료
        return await insertcnt
    }

    // 컨셉을 잡은 기능은 벗어나는 기능을 추가하면 안 보기에 좋지않다
    // (모듈화를 하는데 있어 하는 의미가 없어짐)

    //성적 전체조회
    async show(stnum) {
        let conn = null;
        let params = [stnum, stnum + ppg ];
        let list = [];
        let allcnt = -1;
        //  sjs 빈 배열을 안에 담지 않았을때에는 하나만 출력이 되었는데
        // 빈 배열 안에 push를 해서 계속 담으니 값이 많이 출력 되었다
        try {
            conn = await oracledb.makeConn();
            allcnt = await this.selectCount(conn);
                let idx = allcnt - stnum + 1;



            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.paging1 + boardsql.paging2,params,oracledb.options)
            let rs = result.resultSet
            let row = null;
            while((row = await rs.getRow())){
                let bd = new Board(row.BNO,row.TITLE,row.USERID,row.REGDATE,row.VIEWS,null);
                bd.idx = idx--; //글번호 컬럼
                list.push(bd)
            } // 넘어올때는 대문자로 작성



        }
        catch (e){ console.log(e); }
        finally { await oracledb.closeConn(conn); }
        let result = {'list':list,'allcnt':allcnt}

        return await result;
    }


    async selectCount(conn) {  // 총 게시물 수 계산
        let params = [];
        let cnt = -1;

        try {
            let result = await conn.execute(boardsql.selectCount,params,oracledb.options)
            let rs = result.resultSet
            let row = null;
            if ((row = await rs.getRow())) {
                cnt = row.CNT;
            }


        }
        catch (e){ console.log(e); }

        return await cnt;
    } // 이건많이 줄여서 쓸 수 있다는 것이네

    //성적 상세조회
    async showOne(bno) {
        let conn = null;
        let params = [bno];
        let list = [];

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.selectOne,params,oracledb.options)

            let rs = result.resultSet
            let row = null;
            while((row = await rs.getRow())){
                let bd = new Board(row.BNO,row.TITLE,row.USERID,row.REGDATE2,row.VIEWS,row.CONTENTS);
                list.push(bd)
            }

            await conn.execute(boardsql.viewOne,params);
            await conn.commit();

        }
        catch (e){ console.log(e); }
        finally { await oracledb.closeConn(conn); }

        return await list;
    }


    async update () {
        let conn = null;
        let params = [this.title, this.contents, this.bno];
        let updat = 0;

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.update,params)
            await conn.commit();
            if (result.rowsAffected > 0 ){
                updat = result.rowsAffected;
            }
            console.log(result)
        }catch(e){ console.log(e); }
        finally{ await oracledb.closeConn(conn); }
        return await updat
    }


    async delete (bno) {
        let conn = null;
        let params = [bno];
        let del = 0;

        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.delete, params); // 실행
            await conn.commit(); // 저장
            if (result.rowsAffected > 0) {
                del = result.rowsAffected; // 콘솔 안찍고 자료를 넘겼음
            }
            console.log(result);
        }
        catch(e){ console.log(e); }
        finally{ await oracledb.closeConn(conn); }
        return await del
    }



}

module.exports = Board;
