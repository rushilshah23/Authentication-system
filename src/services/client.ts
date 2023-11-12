import { rabbitMQ } from "@/configs/rabbitmq.config";
import { Channel, Connection, connect } from "amqplib";
import { Producer } from "./producer";
import Consumer from "./consumer";
// import { rabbitmqArchitecture } from "./rabbitMQArchitecture";

class RabbitMQClient {
    private connection!: Connection;
    private isInitialized = false;
    private static rabbitMQInstance: RabbitMQClient;

    private producerChannel!: Channel;
    private consumerChannel!:Channel;
    private producer!: Producer;
    private consumer!:Consumer;

    // CONSUMERS --------------------------

    
    


    private constructor() { }
    public static getInstance() {
        if (!this.rabbitMQInstance) {
            this.rabbitMQInstance = new RabbitMQClient();
        }
        return this.rabbitMQInstance;

    }
    async initialize() {
        if (this.isInitialized) {
            return;
        }
        try {

            // Initialize Rabbit MQ Connection
            this.connection = await connect(rabbitMQ.RABBITMQ_URL);


            // CONSUMER---------------------------------------
            // Set the Consumer Channel for the service.
            this.consumerChannel = await this.connection.createChannel();

            // Assert Consumer Queue for the service.
            const {queue:consumerQueue} = await this.consumerChannel.assertQueue("AUTH_CONSUME",{exclusive:true});

            // Create a consumer
            this.consumer = new Consumer(this.consumerChannel,consumerQueue);




            // PRODUCER --------------------------------------
            this.producerChannel = await this.connection.createChannel();


            this.isInitialized = true;
            await this.consumer.consumeMessages();

        } catch (error) {
            console.log("RabbitMQ Error ", error);
        }
    }

    async produce(data: any) {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return await this.producer.producerMessages(data);
    }
}

export default RabbitMQClient.getInstance();