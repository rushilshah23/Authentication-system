import amqp,{ Channel, Connection } from "amqplib";
import Producer from "./producer";
import { rabbitMQ } from "@/configs/rabbitMQ.config";
import Consumer from "./consumer";


 class RabbitMQClient{
    private connection!:Connection;
    private producerChannel!:Channel;
    private consumerChannel!:Channel;
    private producer! :Producer;
    private consumer!:Consumer;
    private static rabbitMQInstance:RabbitMQClient;
    private isInitialized = false;  



    private constructor(){}

    async initialize(){
        if (this.isInitialized) {
            return;
        }
        try {
            this.connection = await amqp.connect("amqp://localhost");
            this.producerChannel = await this.connection.createChannel();
            this.consumerChannel = await this.connection.createChannel();

            
            const {queue:rpcQueue} = await this.consumerChannel.assertQueue(rabbitMQ.SERVER_MODE.RPC_QUEUES.AUTH_RPC_QUEUE,{exclusive:true});

            this.producer = new Producer(this.producerChannel)
            this.consumer = new Consumer(this.consumerChannel,rpcQueue);

            await this.consumer.consumerMessages();
            this.isInitialized = true;
            
        } catch (error) {
            console.log("Rabbitmq server error... ",error)
        }
    }

    public static  getInstance():RabbitMQClient{
        if (!this.rabbitMQInstance) {
            this.rabbitMQInstance = new RabbitMQClient();
        }
        return this.rabbitMQInstance;
    }

    async produce(data:any,correlationId:string,replyToQueue:string){
        if(!this.connection){
            await this.initialize()
        }
        await this.producer.produceMessage(data,correlationId,replyToQueue);
    }
}

export default RabbitMQClient.getInstance()