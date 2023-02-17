const oracledb = require('../models/Oracle')
class Member{
    constructor(userid,passwd,name,email) {
        // insertsql = 'insert into member(mno,userid,passwd,name,email)values (mno.nextval,:1,:2,:3,:4)'

        this.userid = userid
        this.passwd = passwd
        this.name = name
        this.email = email
    }

    async insert () {
        let conn = null;
        let sql = 'insert into member(mno,userid,passwd,name,email)values (mno.nextval,:1,:2,:3,:4)'
        let params = [this.userid,this.passwd,this.name,this.email]
        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(sql,params);
            if (result.rowsAffected > 0) {console.log('회원정보 저장 성공')}//동작 확인용
            await conn.commit();
            // commit;이라고 작성해도 동작은 하지만
            // commit();으로 작성하지 않으면 값이 들어가더라도 데이터베이스에 저장이 되지않는다
            console.log(result)
        }catch(e){console.log(e)}
        finally {
          await oracledb.closeConn(conn)
            console.log('오라클db 접속 종료')
        }
    }

}
module.exports = Member;