const oracledb = require('./Oracle')

let boardsql = {
    insert : 'insert into board (bno,title,userid,contents)values (bno.nextval,:1,:2,:3)',
    select : "select bno,title,userid,to_char(regdate,'YYYY-MM-DD')regdate,contents from board order by bno desc",
    selectOne : "select bno,title,userid,to_char(regdate,'yyyy-mm-dd hh:mi:ss')regdate,contents from board where bno =:1 order by bno desc",
    update : 'update board set title =:1 ,contents =:2 where bno =:3 ',
    delete : 'delete from board where bno =:1 '
}
// to_char를 쓸때 to_char(regdate(컬럼명),'YYYY-MM-DD')regdate(컬럼명) 이렇게 작성해야 값이 출력
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
        this.views = 0;
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
        catch(e){console.log(e);}
        finally{await oracledb.closeConn(conn);} // 종료
        return await insertcnt
    }

    // 컨셉을 잡은 기능은 벗어나는 기능을 추가하면 안 보기에 좋지않다
    // (모듈화를 하는데 있어 하는 의미가 없어짐)

    //성적 전체조회
    async show() {
        let conn = null;
        let params = [];
        let list = [];
        //  sjs 빈 배열을 안에 담지 않았을때에는 하나만 출력이 되었는데
        // 빈 배열 안에 push를 해서 계속 담으니 값이 많이 출력 되었다
        try {
            conn = await oracledb.makeConn();
            let result = await conn.execute(boardsql.select,params,oracledb.options)

            let rs = result.resultSet
            let row = null;
            while((row = await rs.getRow())){
                let bd = new Board(row.BNO,row.TITLE,row.USERID,row.REGDATE,row.VIEWS,null);
                list.push(bd)
            } // 넘어올때는 대문자로 작성

        }
        catch (e){console.log(e);}
        finally {await oracledb.closeConn(conn);}

        return await list;
    }


    //성적 상세조회
    async showOne(bno) {
        let conn = null;
        let result = null;
        let list = [];

        try {
            conn = await oracledb.makeConn();
            result = await conn.execute(boardsql.selectOne,[bno],this.options)

            let rs = result.resultSet
            let row = null;
            while((row = await rs.getRow())){
                let cnt = new Board(row[1],row[2],row[4]);
                cnt.sjno = row[0];
                cnt.regdate = row[3];
                list.push(cnt)
            }

        }
        catch (e){console.log(e);}
        finally {await oracledb.closeConn(conn);}

        return await list;
    }


    async update () {
        let conn = null;
        let params = [];
        let insertcnt = 0;

        try {
            conn = await oracledb.makeConn();

        }catch(e){console.log(e);}
        finally{await oracledb.closeConn(conn);}


    }


    async delete () {
        let conn = null;
        let params = [];
        let insertcnt = 0;

        try {
            conn = await oracledb.makeConn();

        }
        catch(e){console.log(e);}
        finally{await oracledb.closeConn(conn);}


    }



}

module.exports =Board;
