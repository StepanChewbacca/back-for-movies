const bcrypt = require('bcrypt');
const { SALT } = require('../constants/config');

const hash = (password) => bcrypt.hash(password, SALT);

const compare = async (password, hashPassword) => {
    try {
        return await bcrypt.compare(password, hashPassword);
    } catch (err) {
        console.error('compare: ', err);
    }
};

module.exports = {
    hash,
    compare
}
