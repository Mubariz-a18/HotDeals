const Razorpay = require('razorpay');

module.exports = class PayoutService {

    static async createPayoutOrder() {
        try { 

            const instance = new Razorpay({
                key_id: process.env.key_id,
                key_secret: process.env.key_secret,
            });
            const order = await instance.orders.create({
                amount: 1000, // Amount in paise
                currency: 'INR',
                payment_capture: 1,
                notes: {
                  description: 'Reward payment',
                },
                receipt: 'order_rcptid_11',
              });
            //   console.log(instance)
              // Retrieve the order ID
              const orderId = order.id;

              // Generate the UPI payment link
            //   const paymentLink = await instance.paymentLink.create({
            //     order_id: orderId,
            //     vpa: '8686613532@jupiteraxis', // UPI ID entered by the user
            //   });
        } catch (e) {
            console.log(e)
        }
    }

}
