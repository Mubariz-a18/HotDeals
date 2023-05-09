function isRazorPayid(id){
    if(!id || typeof id || id.length !== 20) return false;
}

function ValidateTransactionBody(body){
    const {
        orderId,
        paymentId,
        paymentSignature
    } = body
    if(!isRazorPayid(orderId)) return false;
    if(!isRazorPayid(paymentId)) return false;
    if(!paymentSignature || typeof paymentSignature !== 'string') return false

    return true;
}


module.exports = {
    ValidateTransactionBody
}