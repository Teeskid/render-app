import dotenv from "dotenv"
import express from "express"
import { pid } from "process"

dotenv.config()

const port = process.env.PORT || 8080
const app = express()

app.get('/', (req, res) => {
     // Read the variables sent via POST from our API
     const {
        sessionId,
        serviceCode,
        phoneNumber,
        text,
    } = req.body;

    let response = '';

    if (text == '') {
        // This is the first request. Note how we start the response with CON
        response = `CON What would you like to check
        1. My account
        2. My phone number`;
    } else if ( text == '1') {
        // Business logic for first level response
        response = `CON Choose account information you want to view
        1. Account number`;
    } else if ( text == '2') {
        // Business logic for first level response
        // This is a terminal request. Note how we start the response with END
        response = `END Your phone number is ${phoneNumber}`;
    } else if ( text == '1*1') {
        // This is a second level response where the user selected 1 in the first instance
        const accountNumber = 'ACC100101';
        // This is a terminal request. Note how we start the response with END
        response = `END Your account number is ${accountNumber}`;
    }

    // Send the response back to the API
    res.set('Content-Type: text/plain');
    res.send(response);

    console.log(sessionId, serviceCode)
})

process.on("SIGINT", () => {
    process.kill(pid)
})

app.listen(port, () => {
	console.log(`SERVING API ON PORT ${port}`)
})

export default {}
