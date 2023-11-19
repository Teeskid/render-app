import { PubSub, Topic } from "@google-cloud/pubsub"

let mainTopic: Topic | null = null

export const loadTopic = async () => {
    const pubSubClient = new PubSub({
        projectId: "techify-ng"
    })
    const [topic] = await pubSubClient.topic("rnd-service").get()
    return topic
}

export const getTopic = (): Topic => {
    if (mainTopic !== null) {
        return mainTopic
    }
    throw new Error("topic not initialized yet")
}

export default {}
