const moment = require('moment');
//current date
const currentDate = moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');

// dateof birth & age
const DOB = moment().format('YYYY-MM-DD');

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

const expiry_date_func = (days)=>{
  const expiryDate_String = moment().add(days, 'd').format('YYYY-MM-DD HH:mm:ss');
  return expiryDate_String
}

module.exports = {
  age_func,
  nearestExpiryDateFunction,
  durationInDays,
  my_age,
  expiry_date_func
};


