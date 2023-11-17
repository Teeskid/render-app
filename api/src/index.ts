import dotenv from "dotenv"
import express from "express"
import { pid } from "process"

dotenv.config()

const port = process.env.PORT || 8080
const app = express()

app.get('/', (req, res) => {
    res.sendStatus(200)
})

process.on("SIGINT", () => {
    process.kill(pid)
})

app.listen(port, () => {
	console.log(`SERVING API ON PORT ${port}`)
})

export default {}
