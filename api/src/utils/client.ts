import { PubSub, Topic } from "@google-cloud/pubsub"

const pubSubClient = new PubSub()

let didLoader: boolean = false
let mainTopic: Topic | null = null

export const loadTopic = async () => {
    await pubSubClient.topic("projects/techify-ng/topics/rnd-service").get().then(([topic]) => {
        mainTopic = topic
    }).catch(() => {
        mainTopic = null
        console.error("FAILED LOADING MAIN TOPIC")
        process.emit("SIGINT")
    })
}

export const getTopic = (): Topic => {
    if (mainTopic === null) {
        loadTopic()
    } else {
        return mainTopic
    }
    throw new Error("topic not initialized yet")
}

export default pubSubClient
