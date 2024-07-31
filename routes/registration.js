import express from "express"
import registrationController from "../controllers/registrationController.js"

const router = express.Router()

router.get("/", registrationController.getRegistrations)
router.get("/:id", registrationController.getRegistration)
router.post("/", registrationController.createRegistration)
router.patch("/:id", registrationController.updateRegistration)
router.patch("/status/:id", registrationController.updateRegistrationStatus)

export default router
