import "dotenv/config"

import { credential } from "firebase-admin"
import { initializeApp } from "firebase-admin/app"
import path from "path"
import { pid } from "process"

const CREDENTIALS = credential.cert(path.join(__dirname, "../techify-ng-073c85f2027d.json"))
const SERVER_PORT = process.env.PORT || 8888

initializeApp({
	credential: CREDENTIALS,
	projectId: "techify-ng",
	databaseURL: "https://techify-ng.firebaseio.com",
	storageBucket: "techify-ng.appspot.com",
	// serviceAccountId: "rnd-service",
	// apiKey: "AIzaSyDwMERWGhJ2SI51pVqmBDMADkgUM2vdWlA",
	// authDomain: "techify-ng.firebaseapp.com",
	// messagingSenderId: "25233989097",
	// appId: "1:25233989097:web:73ffc11986024f3f957f78",
	// measurementId: "G-RPE7K4ZL15",
})

import "./utils/client"

import app from "./main"
import { loadTopic } from "./utils/client"

app.on("upgrade", () => {
	console.log("HELLO-WEBSOCKET")
})

process.on("SIGINT", () => {
	process.kill(pid)
})

console.log("LOADING CLOUD PUBSUB TOPIC...")
loadTopic().then(() => {
	console.log("CLOUD PUBSUB TOPIC LOADED")
	console.log("STARTING NODE SERVER...")
	app.listen(SERVER_PORT, () => {
		console.log(`SERVING API ON PORT ${SERVER_PORT}`)
	})
}).catch((error) => {
	console.error(error)
	process.emit("SIGINT")
})

export default {}
