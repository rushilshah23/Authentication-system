import amqp, { Channel, Connection } from "amqplib";
import { ProducerServer } from "./producerServer";
import { rabbitMQConfig } from "@/configs/rabbitMQ.config";
import { ConsumerServer } from "./consumerServer";


class RabbitMQServer {
    private connection!: Connection;
    private producerChannel!: Channel;
    private consumerChannel!: Channel;
    private producer!: ProducerServer;
    private consumer!: ConsumerServer;
    private static rabbitMQInstance: RabbitMQServer;
    private isInitialized = false;
    private consumerQueueName!: string;



    private constructor() {
    }

    async initializeRabbitMQServer() {
        if (this.isInitialized) {
            return;
        }
        try {
            this.connection = await amqp.connect(rabbitMQConfig.RABBITMQ_URL);
            this.producerChannel = await this.connection.createChannel();
            this.consumerChannel = await this.connection.createChannel();


            // Change this
            this.consumerQueueName = rabbitMQConfig.SERVER_MODE.AUTH.QUEUES.REQUEST_QUEUES.AUTH_REQUEST_SERVER.toString();

            const { queue: serverRequestQueue } = await this.consumerChannel.assertQueue(this.consumerQueueName, { exclusive: true });

            this.producer = new ProducerServer(this.producerChannel)
            this.consumer = new ConsumerServer(this.consumerChannel, serverRequestQueue);
            try {
                await this.consumer.consumeClientRequests();
            } catch (error) {
                console.log("Error consuming data at RabbitMQ Server mode - ", error)
            }
            this.isInitialized = true;

        } catch (error) {
            console.log("Rabbitmq Server Initialization error... ", error)
            throw Error(error as string)
        }
    }

    public static getInstanceRabbitMQServer(): RabbitMQServer {
        if (!this.rabbitMQInstance) {
            this.rabbitMQInstance = new RabbitMQServer();
        }
        return this.rabbitMQInstance;
    }

    async produceToClient(data: any, correlationId: string, replyToQueue: string) {
        if (!this.connection) {
            await this.initializeRabbitMQServer()
        }
        try {
            
            await this.producer.produceMessageToClient(data, correlationId, replyToQueue);
        } catch (error) {
            console.log("Error producing message at RabbitMQ Server mode - ",error)
        }
    }
}

export default RabbitMQServer.getInstanceRabbitMQServer()