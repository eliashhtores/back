import express from "express"
import userController from "../controllers/userController.js"

const router = express.Router()

router.get("/", userController.getUsers)
router.get("/:id", userController.getUser)
router.post("/validate", userController.validateUser)
router.post("/", userController.createUser)
router.patch("/:id", userController.updateUser)
router.patch("/status/:id", userController.updateUserStatus)

export default router
