import { ConsumeMessage } from "amqplib";
import rabbitMqServerInstance from "@/services/server/rabbitMQServerMode"
import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
import { authenticateLogic } from "@/logic/auth.logic";
import { authService } from "@/lib/auth";


export default class MessageHandler{


    public async handle(message:ConsumeMessage){
        const {replyTo, correlationId} = message.properties;

        const parsedData = JSON.parse(message.content.toString());
        const {eventType, data} = parsedData;

        console.log(eventType, data);
        let res ={};
        switch(eventType){
            case rabbitMQConfig.SERVER_MODE.AUTH.EVENTS.GET_AUTH.toString():
                // res= await authService.authenticateHelper(data.tokens.access,data.tokens.refresh)
                res = await authenticateLogic(data.tokens.access,data.tokens.refresh)
                break;
            default:
                res= {};
                break;
        }

        // Produce the response 
        await rabbitMqServerInstance.produceToClient(res,correlationId,replyTo);


    }
}