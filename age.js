const moment = require('moment');
var year_of_purchase = moment('06/2015', 'MM/YYYY');
var total_months =  moment().diff(year_of_purchase , 'month',false);
const years = Math.floor(total_months/12)
const months = (total_months%12)
const age = years +"."+ months

console.log(typeof age)