import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
import { Channel } from "amqplib";


export  class ProducerServer{
    constructor(private channel:Channel){};
    
    async produceMessageToClient(data:any,correlationId:string,replyToQueue:string){

        console.log("Message produced - ",data)
        this.channel.sendToQueue(replyToQueue,Buffer.from(JSON.stringify(data)),
        {
            correlationId:correlationId,
            expiration:10
        });
    }

}