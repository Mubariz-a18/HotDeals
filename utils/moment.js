const moment = require('moment');


moment().format();
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

const  DateAfter30Days = moment().add(30, 'd').format('YYYY-MM-DD HH:mm:ss');

module.exports = {currentDate,DateAfter30Days};