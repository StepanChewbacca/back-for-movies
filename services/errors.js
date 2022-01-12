const setMessageErrorValidation = async (error) => {
    if (error.message.includes('password')) {
        return 'Password must contains at least number, one upper character and minimum 8 characters '
    }
    if (error.message.includes('first_name')) {
        return 'First name must be at least 2 characters long and contains only letters'
    }
    if (error.message.includes('last_name')) {
        return 'Last name must be at least 2 characters long and contains only letters'
    }
    if (error.message.includes('login')) {
        return 'Login must be at least 6 characters long and contain only letters and numbers'
    }
    return error.message;
}

const setMessageErrorUserDB = async (error) => {
    if (error.message.includes('users_login_key')) {
        error.message = 'User with this login already exists'
    }
    return error
}

module.exports = { setMessageErrorValidation, setMessageErrorUserDB };
