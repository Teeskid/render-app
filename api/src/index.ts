import "dotenv/config"

import { initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"
import { pid } from "process"

const SERVER_PORT = process.env.PORT || 8888

// initializeApp({
// 	credential: CREDENTIALS,
// 	projectId: "techify-ng",
// 	databaseURL: "https://techify-ng.firebaseio.com",
// 	storageBucket: "techify-ng.appspot.com",
// 	// serviceAccountId: "rnd-service",
// 	// apiKey: "AIzaSyDwMERWGhJ2SI51pVqmBDMADkgUM2vdWlA",
// 	// authDomain: "techify-ng.firebaseapp.com",
// 	// messagingSenderId: "25233989097",
// 	// appId: "1:25233989097:web:73ffc11986024f3f957f78",
// 	// measurementId: "G-RPE7K4ZL15",
// })

initializeApp()

// import "./utils/client"

import app from "./main"
import { PubSub } from "@google-cloud/pubsub"

const pubsub = new PubSub({ projectId: "techify-ng" })

pubsub.topic("sim-service").get().then(() => {
	console.log("TRUEEEEEEEEEEEEEEEEEEEEEEEEEEE")
})


// app.on("upgrade", () => {
// 	console.log("HELLO-WEBSOCKET")
// })

// process.on("SIGINT", () => {
// 	process.kill(pid)
// })

// getFirestore().collection("posts").get().then((d) => {
// 	console.log(d)
// })

// console.log("LOADING CLOUD PUBSUB TOPIC...")
// loadTopic().then(() => {
// 	console.log("CLOUD PUBSUB TOPIC LOADED")
// 	console.log("STARTING NODE SERVER...")
// 	app.listen(SERVER_PORT, () => {
// 		console.log(`SERVING API ON PORT ${SERVER_PORT}`)
// 	})
// }).catch((error) => {
// 	console.error(error)
// 	process.emit("SIGINT")
// })

export default {}
