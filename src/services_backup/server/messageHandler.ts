import { authenticateLogic } from "@/logic/auth.logic";
import { ConsumeMessage } from "amqplib";
import rabbitMqServerInstance from "@/services/server/server"


export default class MessageHandler{


    public async handle(message:ConsumeMessage){
        const {replyTo, correlationId} = message.properties;

        const parsedData = JSON.parse(message.content.toString());
        const {eventType, data} = parsedData;

        console.log(eventType, data);
        let res ={};
        switch(eventType){
            case "AUTH":
                res = await authenticateLogic(data.tokens.access,data.tokens.refresh)
                break;
            default:
                res= 0;
                break;
        }

        // Produce the response 
        await rabbitMqServerInstance.produce(res,correlationId,replyTo);


    }
}