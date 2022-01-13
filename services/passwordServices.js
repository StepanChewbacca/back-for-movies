const bcrypt = require('bcrypt');
const { SALT } = require('../constants/config');

const hash = (password) => bcrypt.hash(password, SALT);

const compare = async (password, hashPassword) => {
        return await bcrypt.compare(password, hashPassword);
};

module.exports = {
    hash,
    compare
}
