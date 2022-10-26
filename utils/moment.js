const moment = require('moment');
//current date
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
// date sfter 30 days
const DateAfter30Days = moment().add(30, 'd').format('YYYY-MM-DD HH:mm:ss');
// date after 15 days
const DateAfter15Days = moment().add(15, 'd').format('YYYY-MM-DD HH:mm:ss');
// ad history date for 6 months
const Ad_Historic_Duration = moment().add(183, 'd').format('YYYY-MM-DD HH:mm:ss');
// dateof birth & age
const DOB = moment().format('YYYY-MM-DD');

module.exports = {
    currentDate, DateAfter30Days,
    Ad_Historic_Duration,
    DOB,
    DateAfter15Days
    };