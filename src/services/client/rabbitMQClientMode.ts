import amqp,{ Channel, Connection } from "amqplib";
import {ProducerClient} from "./producerClient";
import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
import EventEmitter from "events";
import { ConsumerClient } from "./consumerClient";

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

            await this.consumer.consumeServerReplies();
            this.isInitialized = true;
            
        } catch (error) {
            console.log("Rabbitmq server error... ",error)
        }
    }

    public static  getInstanceRabbitMQClient():RabbitMQClient{
        if (!this.rabbitMQInstance) {
            this.rabbitMQInstance = new RabbitMQClient();
        }
        return this.rabbitMQInstance;
    }

    async produceToServer(data:any,serverRequestQueue:string){
        if(!this.connection){
            await this.initializeRabbitMQClient()
        }
        await this.producer.produceMessageToServer(data,serverRequestQueue);
    }
}

export default RabbitMQClient.getInstanceRabbitMQClient()