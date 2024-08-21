import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import bodyParser from "body-parser"
import userRoutes from "./routes/user.js"
import courseRoutes from "./routes/course.js"
import sessionRoutes from "./routes/session.js"
import registrationRoutes from "./routes/registration.js"
import paymentRoutes from "./routes/payment.js"
dotenv.config()

const app = express()

app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

app.use("/user", userRoutes)
app.use("/course", courseRoutes)
app.use("/session", sessionRoutes)
app.use("/registration", registrationRoutes)
app.use("/payment", paymentRoutes)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT}!`)
})
