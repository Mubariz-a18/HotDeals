const moment = require('moment');

const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

const DateAfter30Days = moment().add(30, 'd').format('YYYY-MM-DD HH:mm:ss');

const DateAfter15Days = moment().add(15, 'd').format('YYYY-MM-DD HH:mm:ss');

const Ad_Historic_Duration = moment().add(183, 'd').format('YYYY-MM-DD HH:mm:ss');

const DOB = moment().format('YYYY-MM-DD');


module.exports = {currentDate,DateAfter30Days , Ad_Historic_Duration , DOB , DateAfter15Days};