module.exports = {
    CHECK_PASSWORD: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/s,
    CHECK_NAME: /^[a-z ,.'-]+$/i,
    CHECK_LOGIN: /^[a-z0-9_-]{3,16}$/i,
}
