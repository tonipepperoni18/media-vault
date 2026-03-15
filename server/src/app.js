import dotenv from "dotenv"
dotenv.config()

import express from 'express'
import cors from "cors"



import router from "./routes/routes.js"


const app = express()

app.use(express.json())
app.use(cors())

const port = 4040

app.use("/api", router)

console.log("DATABASE_URL:", process.env.DATABASE_URL);
app.listen(port, () => {
    console.log(`Server started on port ${port}`)
})