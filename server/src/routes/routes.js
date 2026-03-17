import express from "express"
import { createTitle, getAllTitles, getTitleById, patchTitle, deleteTitle } from "../controllers/titles.controller.js"

const router = express.Router()

router.post("/titles", createTitle)
router.get("/titles", getAllTitles)
router.get("/titles/:upc", getTitleById)
router.patch("/titles/:upc", patchTitle)
router.delete("/titles/:upc", deleteTitle)



export default router