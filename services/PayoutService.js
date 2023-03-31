const Razorpay = require('razorpay');

module.exports = class PayoutService {

    static async createPayoutOrder() {
        try { 
          const razorpay = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret,
        });
        } catch (e) {
            console.log(e)
        }
    }

}
