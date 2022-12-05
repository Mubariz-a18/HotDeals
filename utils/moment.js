const moment = require('moment');
//current date
const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
// date sfter 30 days
const DateAfter30Days = moment().add(30, 'd').format('YYYY-MM-DD HH:mm:ss');
// date after 15 days
const DateAfter15Days = moment().add(15, 'd').format('YYYY-MM-DD HH:mm:ss');
// ad history date for 6 months
const Ad_Historic_Duration = moment().add(183, 'd').format('YYYY-MM-DD HH:mm:ss');
// dateof birth & age
const DOB = moment().format('YYYY-MM-DD');

const Free_credit_Expiry = moment().add(180, 'd').format('YYYY-MM-DD HH:mm:ss');


const age_func = (date_of_purchase) => {
  var year_of_purchase = moment(date_of_purchase, 'MM/YYYY');
  var total_months = moment().diff(year_of_purchase, 'month', false);
  const years = Math.floor(total_months / 12)
  const months = (total_months % 12)
  const age = years + "." + months
  return age
}

const nearestExpiryDateFunction = (arrayOfExpiryDates) => {
  const nearestExpiryDate = arrayOfExpiryDates.sort()[0];
  return (nearestExpiryDate);
}

const durationInDays = (expiryDate) => {
  const duration = moment(expiryDate).diff(currentDate, "days")
  return duration
}

const my_age = (date_of_birth) => {
  var age = moment(DOB).diff(date_of_birth, "years");
  return age
}

module.exports = {
  // currentDate, DateAfter30Days,
  // Ad_Historic_Duration,
  // DOB,
  // DateAfter15Days,
  age_func,
  nearestExpiryDateFunction,
  durationInDays,
  my_age,
  // Free_credit_Expiry
};


