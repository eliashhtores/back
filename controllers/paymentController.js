import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_KEY)
const calculateOrderAmount = (items) => {
    let total = 0
    items.forEach((item) => {
        total += item.amount
    })
    return total
}

const createPaymentIntent = async (req, res) => {
    const { items } = req.body

    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: "mxn",
        automatic_payment_methods: {
            enabled: true,
        },
    })

    res.send({
        clientSecret: paymentIntent.client_secret,
    })
}

export default {
    createPaymentIntent,
}
