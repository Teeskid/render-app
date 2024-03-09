require("dotenv").config();

import parser from "body-parser";
import express, { type Request } from "express";
import expressWs from "express-ws";
import { applicationDefault, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import path from "path";

import routes from "./routes";

// kill server on restart
process.on("SIGINT", () => {
	process.kill(process.pid)
})

initializeApp({
	credential: applicationDefault(),
	projectId: "techify-ng"
})

const webSock = expressWs(express())
const app = webSock.app

app.set("view engine", "ejs")
app.use(parser.json())
app.use(parser.urlencoded({ extended: false }))

const doOnce = async (r: Request) => {
	// gather required data
	const ipa = r.socket.remoteAddress
	const url = r.path
	const dat = Date.now()

	// put them in database
	const firestore = getFirestore()
	const logs = firestore.collection("logs")
	await logs.doc().create({
		url,
		ipa,
		dat,
		ext: {
			params: r.params,
			query: r.query,
			body: r.body
		}
	}).catch(console.error)
}

// access log middleware
app.use((r, res, next) => {
	// middleware action
	doOnce(r)
	// handle next route
	next()
})

// websocket handler
app.ws("/", (ws) => {
	ws.on("message", () => {
		console.log("RECEIVED")
	})
})

// attach main routes
app.use(routes)
app.use("/static", express.static(path.join(__dirname, "static")))

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
	console.log(`Server Running @ ${PORT}`);
})