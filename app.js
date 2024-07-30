import express from "express"
import dotenv from "dotenv"
import { getUsers, getUser, createUser } from "./database/db.js"

dotenv.config()

const app = express()

app.use(express.json())

app.get("/users", async (req, res) => {
    res.status(200).send(await getUsers())
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Something broke!")
})

app.listen(process.env.PORT || 3001, () => {
    console.log(`Server running on port ${process.env.PORT}...`)
})
