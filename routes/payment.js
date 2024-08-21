import express from "express"
import paymentController from "../controllers/paymentController.js"

const router = express.Router()

router.post("/create-payment-intent", paymentController.createPaymentIntent)

export default router
