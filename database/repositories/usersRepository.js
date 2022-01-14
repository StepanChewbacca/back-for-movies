const pgClient = require('../database');

const createUser = async ({ login, first_name, last_name, user_role }, hashPassword) => {
    try {
        const user = await pgClient.query(`INSERT INTO users(password,login,first_name,last_name, user_role)
        VALUES('${hashPassword}','${login}','${first_name}','${last_name}','${user_role}') RETURNING *;`);
        return { result: user.rows[0] };
    } catch (err) {
        return { error: err };
    }
};

const loginUser = async (login) => {
    try {
        const user = await pgClient.query(`SELECT login, password, user_role FROM users WHERE login ='${login}'`);
        if (user.rows.length){
            return { checkUserRole: user.rows[0].user_role, checkPassword: user.rows[0].password  };
        }
        return { error: { message: "Invalid", statusCode: 500 } }
    } catch (err) {
        return { error: err };
    }
};

module.exports = {
    createUser,
    loginUser,
}
