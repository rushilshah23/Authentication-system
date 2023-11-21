import { Channel, ConsumeMessage } from "amqplib";
import EventEmitter from "events";

export class ConsumerClient{
    constructor(private channel:Channel, private replyQueueName:string, private eventEmitter:EventEmitter){}

    async consumeServerReplies(){
        console.log("ready to consume messages ...")

        await this.channel.consume(this.replyQueueName,(message:ConsumeMessage| null)=>{
            if(message){
                // console.log("Message consumed so triggering eventEmitter - ",JSON.parse(message.content.toString()))
                 const res =  this.eventEmitter.emit(message.properties.correlationId.toString(),message)

                 this.eventEmitter.removeListener(message.properties.correlationId.toString(),()=>{
                    console.log("Listener with id ",message.properties.correlationId.toString(),"  removed ")
                });

                return res;
            }
        },{noAck:true})
    }
}