const bcrypt = require('bcrypt');
const { SALT } = require('../constants/config');

const hash = (password) => bcrypt.hash(password, SALT);

const compare = async (password, hashPassword) => {
    try {
        const isMatched = await bcrypt.compare(password, hashPassword);

        if (!isMatched) {
            throw new Error('Invalid Data');
        }

    } catch (err) {
        console.error('compare: ', err);
    }
};

module.exports = {
    hash,
    compare
}
