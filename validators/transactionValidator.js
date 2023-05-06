function validateTransaction(transactionArray) {

    for (let i = 0; i < transactionArray.length; i++) {
      if (transactionArray.length === 0) return false;
      let credit = transactionArray[i];
      if (!credit.number_of_credit || typeof credit.number_of_credit !== 'number') return false;
      if (!credit.credit_duration || typeof credit.credit_duration !== 'number') return false;
      if (typeof credit.transaction_Id !== 'string' || credit.transaction_Id.length !== 24) return false;
      if (transactionArray[i].transaction_Id !== transactionArray[0].transaction_Id) return false
    }
    return true;
  }


  module.exports = validateTransaction