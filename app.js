import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import userRoutes from "./routes/user.js"
import courseRoutes from "./routes/course.js"
import sessionRoutes from "./routes/session.js"
import registrationRoutes from "./routes/registration.js"
import Stripe from "stripe"
dotenv.config()

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

const stripe = new Stripe("sk_test_IKYCHOAmUhC7IPTdaoVtO58D")
const calculateOrderAmount = (items) => {
    let total = 0
    items.forEach((item) => {
        total += item.amount
    })
    return total
}

app.post("/create-payment-intent", async (req, res) => {
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
})

app.use("/user", userRoutes)
app.use("/course", courseRoutes)
app.use("/session", sessionRoutes)
app.use("/registration", registrationRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT}!`)
})
