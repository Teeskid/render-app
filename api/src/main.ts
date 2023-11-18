import parser from "body-parser"
import express, { Request, Response } from "express"
import { UssdCallback, UssdRequest } from "./types"
import { getTopic } from "./utils/client"

const app = express()
app.use(parser.json())
app.use(parser.urlencoded({ extended: false }))

app.all("/", (req, res) => {
    res.sendStatus(200)
})

app.all("/callback", async (req: Request<{}, string, UssdRequest>, res: Response<string>) => {
    // send message to the logger on node
    console.log("CODE RECEIVED")
    console.info(req.body)

    // Read the variables sent via POST from our API
    let {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body

    // We are returning a response anyway
    let response: string = "";
    try {

        // sanitize input
        sessionId = String(sessionId).trim()
        serviceCode = String(serviceCode).trim()
        phoneNumber = String(phoneNumber).trim()
        text = String(text).trim()

        // deal with the real handling now
        if (text.indexOf("*") !== -1) {
            // long multi session ussd
            response = "END USSD SERVICE IS UNDER MAINTAINANCE, PLEASE TRY LATER"
        } else {
            response = "You line has been credited with 1GB SME Data successfully. Dial *323*4# to check balance."
        }
    } catch (error: Error | unknown) {
        console.error('ERRORROR', error)
        response = `END ${(error as Error).message}`
    } finally {
        if (!response || response.length < 5)
            response = "USSD Working Perfectly In Development"

        // Send the response back to the API
        res.set("Content-Type: text/plain")
        res.send(response)
        // begin the main job now
        const id = await getTopic().publishMessage({
            json: {
                sessionId,
                serviceCode,
                phoneNumber,
                text
            }
        })
    }
})

app.all("/events", async (req: Request<{}, string, UssdCallback>, res) => {
    // Read the variables sent via POST from our API
    let {
        sessionId,
        serviceCode,
        phoneNumber,
        input,
    } = req.body;
    try {
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
    } catch (error: Error | unknown) {
    } finally {
        // Send the response back to the API
        res.status(200)
        res.set("Content-Type: text/plain")
        res.send("END Done")
    }
})

export default app
