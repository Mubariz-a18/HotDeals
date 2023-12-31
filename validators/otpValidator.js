function validateOtp(phoneNumber, otp) {
    if (!otp || !phoneNumber || !phoneNumber.text) return false
    if (typeof otp !== 'string' || otp.length !== 6) return false
    if (typeof phoneNumber.text !== 'string' || phoneNumber.text.length !== 10) return false

    return true
}

function validatePhoneNumer(phoneNumber) {
    if (!phoneNumber || !phoneNumber.text ) return false
    if (typeof phoneNumber.text !== 'string' || phoneNumber.text.length !== 10) return false
    // if (typeof smsToken !== 'string') return false

    return true
}

function validateEmail(email) {
    const emailRegex =  /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) return false
    return true
}

function validateEmailOtp(otp, email) {
    if (!validateEmail(email)) return false
    if (!otp) return false
    if (typeof otp !== 'string' || otp.length !== 6) return false
    return true
}

module.exports = { validateOtp, validatePhoneNumer, validateEmail, validateEmailOtp };