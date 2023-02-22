const oracledb = require('./Oracle')

let zipcodesql = {
    sidosql : 'select distinct sido from zipcode2013 order by sido',
    gugunsql : 'select distinct gugun from zipcode2013 where sido = :1 order by gugun',
    dongsql : 'select distinct dong from zipcode2013 where sido = :1 and gugun = :2 order by dong',
    zipsql : 'select * from zipcode2013 where sido = :1 and gugun = :2 and dong = :3 order by zipcode',
}

class Zipcode {
    zipcode;
    sido;
    gugun;
    dong;
    ri;
    bunji;
    seq;


    constructor(zipcode,sido,gugun,dong,ri,bunji,seq) {
        this.zipcode = zipcode;
        this.sido = sido;
        this.gugun = gugun;
        this.dong = dong;
        this.ri = ri;
        this.bunji = bunji;
        this.seq = seq;


    }

    async getSido(){
        let conn = null;
        let params = [];
        let sidos = [];

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(zipcodesql.sidosql,params,oracledb.options);
            let rs = result.resultSet
            let row = null;
            while((row = await rs.getRow())){
                let info = {'sido':row.SIDO};
                sidos.push(info);
            }

        }catch(e){console.log(e);}
        finally {await oracledb.closeConn(conn);}
        return await sidos;
    };
    async getGugun(sido){
        let conn = null;
        let params = [sido];
        let guguns = [];

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(zipcodesql.gugunsql,params,oracledb.options);
            let rs = result.resultSet
            let row = null;
            while((row = await rs.getRow())){
                // let info = new Zipcode(null,row.GUGUN,null,null);
                let info = {'gugun':row.GUGUN}; // 코드가 짧아서 좋은듯
                guguns.push(info);
            }

        }catch(e){console.log(e);}
        finally {await oracledb.closeConn(conn);}
        return await guguns;
    };
    async getDong(sido,gugun){
        let conn = null;
        let params = [sido,gugun];
        let dongs = [];

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(zipcodesql.dongsql,params,oracledb.options);
            let rs = result.resultSet
            let row = null;
            while((row = await rs.getRow())){
                // let info = new Zipcode(null,null,row.DONG,null); 이렇게 작성시 undefined
                // 생성자의 변수 설정이 되어있지 않아서 실행이 되지 않았던거임
                let info = {'dong':row.DONG};
                dongs.push(info);
            }

        }catch(e){console.log(e);}
        finally {await oracledb.closeConn(conn);}
        return await dongs;
    };
    async getZipcode(sido,gugun,dong){
        let conn = null;
        let params = [sido,gugun,dong];
        let zipcodes = [];

        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(zipcodesql.zipsql,params,oracledb.options);

            let rs = result.resultSet
            let row = null;
            while((row = await rs.getRow())){
                let info = new Zipcode(row.ZIPCODE,row.SIDO,row.GUGUN,row.DONG,row.RI,row.BUNJI,row.SEQ)
                zipcodes.push(info);
            }

        }catch(e){console.log(e);}
        finally {await oracledb.closeConn(conn);}
        return await zipcodes;
    };

}

module.exports = Zipcode;