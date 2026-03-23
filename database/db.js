const oracledb = require('oracledb');

async function connect() {
    return await oracledb.getConnection({
        user: '902508016',
        password: 'iNktdi7JWO',
        connectString: '193.136.58.250:1521/formacao'
    });
}

module.exports = { connect };