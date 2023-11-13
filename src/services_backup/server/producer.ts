import { rabbitMQ } from "@/configs/rabbitMQ.config";
import { Channel } from "amqplib";


export default class Producer{
    constructor(private channel:Channel){};
    
    async produceMessage(data:any,correlationId:string,replyToQueue:string){

        console.log("Message produced - ",data)
        this.channel.sendToQueue(replyToQueue,Buffer.from(JSON.stringify(data)),
        {
            correlationId:correlationId,
            expiration:10
        });
    }

}