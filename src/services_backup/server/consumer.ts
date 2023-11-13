import { Channel, ConsumeMessage } from "amqplib";
import MessageHandler from "./messageHandler";

export default class Consumer{
    constructor(private channel:Channel, private RPCQueue:string){}

    async consumerMessages(){
        console.log("ready to consume messages ...")

        await this.channel.consume(this.RPCQueue,async(message:ConsumeMessage| null)=>{
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
        })
    }
}