import express from "express"
import { createTitle } from "../controllers/titles.controller.js"

const router = express.Router()

router.post("/titles", createTitle)


export default router