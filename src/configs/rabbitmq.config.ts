import { config } from "dotenv";
import path from "path";

if (process.env.ENVIRONMENT !== 'PRODUCTION') {
    console.log("RUNNING RABBIT MQ DEVELOPMENT MODE")
    config({ path: path.resolve(__dirname, '../../.env.dev') });

} else {
    console.log("RUNNING RABBIT MQ IN PRODUCTION MODE ")
    config({ path: path.resolve(__dirname, '../../.env') });

}



const {
    RABBITMQ_URL,
    EXCHANGE_NAME
} = process.env





export const rabbitMQ = {
        RABBITMQ_URL:RABBITMQ_URL!,
        EXCHANGE_NAME:EXCHANGE_NAME!
    }
