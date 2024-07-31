import express from "express"
import sessionController from "../controllers/sessionController.js"

const router = express.Router()

router.get("/course/:id", sessionController.getSessionsByCourse)
router.get("/:id", sessionController.getSession)
router.post("/", sessionController.createSession)
router.patch("/:id", sessionController.updateSession)

export default router
