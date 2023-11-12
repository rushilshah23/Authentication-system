import { Channel } from "amqplib";
import { randomUUID } from "crypto";
// import { rabbitmqArchitecture } from "./rabbitMQArchitecture";

export class Producer{
    constructor(private channel:Channel, private replyTo: string, private RPCQueueName:string){}

    async producerMessages(data:any){
        // const messageSent = this.channel.publish(rabbitmqArchitecture.EXCHANGES_LIST.AUTH_EXCHANGE.EXCHANGE_NAME,
        //     rabbitmqArchitecture.EXCHANGES_LIST.AUTH_EXCHANGE.KEY_OR_PATTERN, Buffer.from( JSON.stringify(data)),{
        //     correlationId:randomUUID(),
        //     replyTo:this.replyQueueName
        // })
        const messageSent = this.channel.sendToQueue(this.RPCQueueName, Buffer.from( JSON.stringify(data)),{
            correlationId:randomUUID(),
            replyTo:this.replyTo
        })
        if(messageSent){
            console.log("Message produced ",data)

        }else{
            console.log("Failed to send message ")
        }
    }
}