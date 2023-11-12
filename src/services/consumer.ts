import { Channel, ConsumeMessage } from "amqplib";

export default class Consumer {
    constructor(private channel: Channel, private RPCQueue: string) { }

    async consumeMessages() {
        console.log("Ready to consume mssgs ...")

        await this.channel.consume(this.RPCQueue, (message: ConsumeMessage | null) => {
            if (message) {
                console.log("Consumed message :- ", JSON.parse(message.content.toString()));
            } else {
                console.log("No message")
            }

        },{noAck:true})
        return;
    }
}