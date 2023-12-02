import amqp,{ Channel, Connection } from "amqplib";
import {ProducerClient} from "./producerClient";
import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
import EventEmitter from "events";
import { ConsumerClient } from "./consumerClient";
import { ServiceRequestInterface } from "@/types/ServiceRequest.Interface";

 class RabbitMQClient{
    private connection!:Connection;
    private producerChannel!:Channel;
    private consumerChannel!:Channel;
    private producer! :ProducerClient;
    private consumer!:ConsumerClient;
    private static rabbitMQInstance:RabbitMQClient;
    private isInitialized = false;
    private eventEmitter!:EventEmitter; 
    private consumerQueueName!:string;



    private constructor(){}

    async initializeRabbitMQClient(){
        if (this.isInitialized) {
            return;
        }
        try {
            this.connection = await amqp.connect(rabbitMQConfig.RABBITMQ_URL);
            this.consumerChannel = await this.connection.createChannel();
            this.eventEmitter = new EventEmitter();


            // CHANGE THIS
            this.consumerQueueName = rabbitMQConfig.CLIENT_MODE.AUTH.QUEUES.REPLY_QUEUES.AUTH_REPLY_CLIENT.toString();

            
            const {queue:clientReplyQueueName} = await this.consumerChannel.assertQueue(this.consumerQueueName,{exclusive:true});
            this.consumer = new ConsumerClient(this.consumerChannel,clientReplyQueueName,this.eventEmitter);
            
            this.producerChannel = await this.connection.createChannel();
            this.producer = new ProducerClient(this.producerChannel,clientReplyQueueName,this.eventEmitter)

            try {
                
                await this.consumer.consumeServerReplies();
            } catch (error) {
                console.log("Error consuming data at RabbitMQ client mode - ",error)
            }
            this.isInitialized = true;
            
        } catch (error) {
            console.log("Error initilaizing RabbitMQ Client mode")
            throw Error(error as string)
        }
    }

    public static  getInstanceRabbitMQClient():RabbitMQClient{
        if (!this.rabbitMQInstance) {
            this.rabbitMQInstance = new RabbitMQClient();
        }
        return this.rabbitMQInstance;
    }

    async produceToServer(data:ServiceRequestInterface,serverRequestQueue:string){
        if(!this.connection){
            await this.initializeRabbitMQClient()
        }
        try {
            await this.producer.produceMessageToServer(data,serverRequestQueue);
            
        } catch (error) {
            console.log("Error producing message rabbitMQ Client mode -",error)
        }
    }
}

export default RabbitMQClient.getInstanceRabbitMQClient()