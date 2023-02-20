const oracledb = require('oracledb');
const dbconfig = require('../routes/dbconfig');

const Oracle = {
    options : {
        resultSet: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT
    },

    initConn : () => {
        oracledb.initOracleClient(
            {libDir: 'C:/Java/instantclient_19_17'})
    },
    // initOracleClient를 한번만 실행해야 하는데 여러번 실행되서 에러발생함
    makeConn: async () => {
        try{
            return await oracledb.getConnection(dbconfig);
        }catch (e) {console.log(e)}
    },
    closeConn: async (conn) => {
        if (conn) {
            try {await conn.close();}
            catch (ex) {console.error(ex);}
        }
    }
}

module.exports = Oracle;