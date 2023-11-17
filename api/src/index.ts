import parser from "body-parser"
import dotenv from "dotenv"
import express, { Request, Response } from "express"
import { pid } from "process"
import { UssdRequest } from "./types"

dotenv.config()

const port = process.env.PORT || 8080
const app = express()
app.use(parser.json())
app.use(parser.urlencoded({ extended: false }))

app.all('/', (req, res) => {
	res.sendStatus(200)
})

app.all('/webhook', (req: Request<{}, string, UssdRequest>, res: Response<string>) => {
	// Read the variables sent via POST from our API
	let response = '';
	try {
		let {
			sessionId,
			serviceCode,
			phoneNumber,
			text,
		} = req.body;

		// sanitize input
		text = String(text).trim()

		if (text.match("*")) {
			// multi session ussd
		} else {

		}

		if (text == '') {
			// This is the first request. Note how we start the response with CON
			response = `CON What would you like to check
        1. My account
        2. My phone number`;
		} else if (text == '1') {
			// Business logic for first level response
			response = `CON Choose account information you want to view
        1. Account number`;
		} else if (text == '2') {
			// Business logic for first level response
			// This is a terminal request. Note how we start the response with END
			response = `END Your phone number is ${phoneNumber}`;
		} else if (text == '1*1') {
			// This is a second level response where the user selected 1 in the first instance
			const accountNumber = 'ACC100101';
			// This is a terminal request. Note how we start the response with END
			response = `END Your account number is ${accountNumber}`;
		}

		console.log(sessionId, serviceCode)
	} catch (error: Error | unknown) {
		response = `END ${(error as Error).message}`
	}
	if (!response || response.length < 5)
		response = "USSD Working Perfectly In Development"
	// Send the response back to the API
	res.set('Content-Type: text/plain');
	res.send(response);
})

app.all('/callback', (req, res) => {
	// Read the variables sent via POST from our API
	let response = '';
	try {
		const {
			sessionId,
			serviceCode,
			phoneNumber,
			text,
		} = req.body;
		if (text == '') {
			// This is the first request. Note how we start the response with CON
			response = `CON What would you like to check
        1. My account
        2. My phone number`;
		} else if (text == '1') {
			// Business logic for first level response
			response = `CON Choose account information you want to view
        1. Account number`;
		} else if (text == '2') {
			// Business logic for first level response
			// This is a terminal request. Note how we start the response with END
			response = `END Your phone number is ${phoneNumber}`;
		} else if (text == '1*1') {
			// This is a second level response where the user selected 1 in the first instance
			const accountNumber = 'ACC100101';
			// This is a terminal request. Note how we start the response with END
			response = `END Your account number is ${accountNumber}`;
		}

		console.log(sessionId, serviceCode)
	} catch (error: Error | unknown) {
		response = `END ${(error as Error).message}`
	}
	if (!response || response.length < 5)
		response = "USSD Working Perfectly In Development"
	// Send the response back to the API
	res.set('Content-Type: text/plain');
	res.send(response);
})

process.on("SIGINT", () => {
	process.kill(pid)
})

app.listen(port, () => {
	console.log(`SERVING API ON PORT ${port}`)
})

export default {}
