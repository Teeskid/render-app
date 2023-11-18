import { PubSub } from "@google-cloud/pubsub"
import parser from "body-parser"
import express, { Request, Response } from "express"
import { pid } from "process"
import { UssdCallback, UssdRequest } from "./types"

const pubSubClient = new PubSub()

const port = process.env.PORT || 8888
const app = express()
app.use(parser.json())
app.use(parser.urlencoded({ extended: false }))

app.all("/", (req, res) => {
    res.sendStatus(200)
})

app.all("/webhook", async (req: Request<{}, string, UssdRequest>, res: Response<string>) => {
    // We are returning a response anyway
    let response: string = "";
    try {
        // Read the variables sent via POST from our API
        let {
            sessionId,
            serviceCode,
            phoneNumber,
            text,
        } = req.body;

        // sanitize input
        sessionId = String(sessionId).trim()
        serviceCode = String(serviceCode).trim()
        phoneNumber = String(phoneNumber).trim()
        text = String(text).trim()

        if (text.indexOf("*") !== -1) {
            // long multi session ussd
            response = "END USSD SERVICE IS UNDER MAINTAINANCE, PLEASE TRY LATER"
        } else {
            await pubSubClient.topic("rnd-service").publishMessage({
                json: {
                    sessionId,
                    serviceCode,
                    phoneNumber,
                    text
                }
            })
            response = "You line has been credited with 1GB SME Data successfully. Dial *323*4# to check balance."
        }
    } catch (error: Error | unknown) {
        response = `END ${(error as Error).message}`
    }
    if (!response || response.length < 5)
        response = "USSD Working Perfectly In Development"
    // Send the response back to the API
    res.set("Content-Type: text/plain");
    res.send(response);
})

app.all("/callback", async (req: Request<{}, string, UssdCallback>, res) => {
    try {
        // Read the variables sent via POST from our API
        let {
            sessionId,
            serviceCode,
            phoneNumber,
            input,
        } = req.body;

        // sanitize the inputs
        sessionId = String(sessionId).trim()
        serviceCode = String(serviceCode).trim()
        phoneNumber = String(phoneNumber).trim()
        input = String(input).trim()

        if (input.indexOf("*") !== -1) {
            // long multi session ussd
        } else {
            // do something else
        }

        // Send the response back to the API
        res.set("Content-Type: text/plain");
        res.sendStatus(200)
    } catch (error: Error | unknown) {
    }
})

process.on("SIGINT", () => {
    process.kill(pid)
})

app.listen(port, () => {
    console.log(`SERVING API ON PORT ${port}`)
})

export default {}
