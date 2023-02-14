const rateLimit = require('express-rate-limit')

function rateLimiter(windowTime,hits){
    const Limiter = rateLimit({
        windowMs: windowTime*60*1000,
        max: hits,
        message: 'Too many hits in a small time, please try after some time',
        standardHeaders: true,
        legacyHeaders: false,
    })
    return Limiter
}


module.exports = {
    rateLimiter
}