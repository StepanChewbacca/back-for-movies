const pgClient = require('../database');
const { compare }  = require('../../services/passwordServices');
const { generateTokens }  = require('../../services/jwtServices');

const createUser = async ({ login, first_name, last_name, user_role }, hashPassword) => {
    try {
        const user = await pgClient.query(`INSERT INTO users(password,login,first_name,last_name, user_role)
        VALUES('${hashPassword}','${login}','${first_name}','${last_name}','${user_role}') RETURNING *;`);
        return { result: user.rows[0] };
    } catch (err) {
        return { error: err };
    }
};

const loginUser = async ({ login, password }) => {
    try {
        const user = await pgClient.query(`SELECT login, password, user_role FROM users WHERE login ='${login}'`);
        if (await compare(password, user.rows[0].password)) {
            const { accessToken } = generateTokens();
            return { result: { accessToken, userRole: user.rows[0].user_role } };
        }
        return { result:  'Invalid login or password'  };

    } catch (err) {
        console.log(err)
        return { error: err };
    }
};

module.exports = {
    createUser,
    loginUser,
}
