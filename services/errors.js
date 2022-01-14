const setMessageErrorValidation = (message) => {
    if (message.includes('password')) {
        return 'Password must contains at least number, one upper character and minimum 8 characters '
    }
    if (message.includes('first_name')) {
        return 'First name must be at least 2 characters long and contains only letters'
    }
    if (message.includes('last_name')) {
        return 'Last name must be at least 2 characters long and contains only letters'
    }
    if (message.includes('login')) {
        return 'Login must be at least 6 characters long and contain only letters and numbers'
    }
    return "Something go wrong"
}

const setMessageErrorUserDB = (message) => {
    if (message.includes('users_login_key')) {
        return 'User with this login already exists'
    }
    return "Db error"
}

module.exports = { setMessageErrorValidation, setMessageErrorUserDB };
