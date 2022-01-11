const setMessageErrorValidation = async (error) => {
    if (error.message.includes('password')) {
        error.message = 'Password must contains at least number, one upper character and minimum 8 characters '
    }
    if (error.message.includes('first_name')) {
        error.message = 'First name must be at least 2 characters long and contains only letters'
    }
    if (error.message.includes('last_name')) {
        error.message = 'Last name must be at least 2 characters long and contains only letters'
    }
    if (error.message.includes('login')) {
        error.message = 'Login must be at least 6 characters long and contain only letters and numbers'
    }
    return error
}

const setMessageErrorUserDB = async (error) => {
    if (error.message.includes('users_login_key')) {
        error.message = 'User with this login already exists'
    }
    return error
}

module.exports = { setMessageErrorValidation, setMessageErrorUserDB };
