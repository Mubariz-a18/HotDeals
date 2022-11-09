const moment = require('moment');
const { Free_credit_Expiry, currentDate } = require('./utils/moment');
var year_of_purchase = moment('06/2015', 'MM/YYYY');
var total_months =  moment().diff(year_of_purchase , 'month',false);
const years = Math.floor(total_months/12)
const months = (total_months%12)
const age = years +"."+ months


const days = moment(Free_credit_Expiry).diff(currentDate,"days")


const datesToBeChecked = ['2023-05-02 10:38:55', '2022-12-02 10:38:55', '2022-12-03 10:38:55']
const dateToCheckFor = currentDate;

let nearestExpiryDate;

datesToBeChecked.forEach(date => {
  let diff = moment(date).diff(moment(dateToCheckFor), 'days');
  if (diff > 0) {
    if (nearestExpiryDate) {
      if (moment(date).diff(moment(nearestExpiryDate), 'days') < 0) {
        nearestExpiryDate = date;
      }
    } else {
      nearestExpiryDate = date;
    }
  }
});

