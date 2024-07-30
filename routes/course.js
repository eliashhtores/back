import express from "express"
import courseController from "../controllers/courseController.js"

const router = express.Router()

router.get("/", courseController.getCourses)
router.get("/:id", courseController.getCourse)
router.post("/", courseController.createCourse)
router.patch("/:id", courseController.updateCourse)

export default router
