import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from "./messageHandler";

export  class ConsumerServer{
    constructor(private channel:Channel, private serverRequestQueue:string){}

    async consumeClientRequests(){
        console.log("ready to consume messages ...")

        await this.channel.consume(this.serverRequestQueue,async(message:ConsumeMessage| null)=>{
            if(message){
                const {replyTo,correlationId} = message.properties;
                if(!replyTo || !correlationId){
                    console.log("Missing correlationId or replyTo properties  OR not a request to server node !")
                }else{

                    console.log("Message consumed - ",JSON.parse(message.content.toString()))
                    const handler = new MessageHandler();
                    await handler.handle(message);
                }
            }
        },{
            noAck:true
        })
    }
}