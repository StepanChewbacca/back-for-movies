const jwt = require('jsonwebtoken');

const generateActionToken = (typeAction) => {

    let word = '';

    if (typeAction === 'firstLogin') {
        word = "FIRST_LOGIN_TOKEN_SECRET";
    } else if (typeAction === 'forgotPassword') {
        word = "FORGOT_PASSWORD_TOKEN_SECRET";
    } else {
        throw new Error(
            "Internal Service Error"
        );
    }

    const actionToken = jwt.sign(
        { typeAction }, word,
        { expiresIn: '7d' }
    );

    return actionToken;
};

const generateTokens = () => {
    const accessToken = jwt.sign(
        {}, "ACCESS_TOKEN_SECRET",
        { expiresIn: '24h' }
    );
    const refreshToken = jwt.sign(
        {}, "REFRESH_TOKEN_SECRET",
        { expiresIn: '30d' }
    );
    return {
        accessToken,
        refreshToken
    };
};

const verifyActionToken = (token, typeAction = 'forgotPassword') => {
    try {
        const secret = typeAction === 'forgotPassword'
            ? 'forgotPassword'
            : 'firstLogin';
        jwt.verify(token, secret);
    } catch (err) {
        throw new Error(
            "Invalid token"
        );
    }
};

const verifyTokens = (token, tokenType = 'access') => {
    try {
        const secret = tokenType === 'access'
            ? "ACCESS_TOKEN_SECRET"
            : "REFRESH_TOKEN_SECRET";
        jwt.verify(token, secret);
    } catch (err) {
        throw new Error(
            "Invalid Token"
        );
    }
};

module.exports = {
    generateActionToken,
    generateTokens,
    verifyActionToken,
    verifyTokens,
}
