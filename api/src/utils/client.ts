import { PubSub, Topic } from "@google-cloud/pubsub"
import { getApp } from "firebase-admin/app"

let mainTopic: Topic | null = null

export const loadTopic = async () => {
    const pubSubClient = new PubSub({
        projectId: getApp().options.projectId
    })
    await pubSubClient.topic("projects/techify-ng/topics/rnd-service").get().then(([topic]) => {
        mainTopic = topic
    }).catch((error) => {
        mainTopic = null
        throw error
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

export default {}
