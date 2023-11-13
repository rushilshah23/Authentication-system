import express from "express"
import cors from "cors";
import { AuthRouter } from "@/routes/auth";
import { ENV_VAR as config } from "@/configs/env.config";
import cookieParser from "cookie-parser";
import helmet from "helmet"
import bodyParser from "body-parser";
import { CORS_OPTIONS } from "@/configs/cors.config";
import rabbitMQServerMode from "@/services/server/rabbitMQServerMode";
import rabbitMQClientMode from "@/services/client/rabbitMQClientMode"

const app = express();
const server_port = config.SERVER_PORT;

// SOME MIDDLEWARES
app.use(cors(CORS_OPTIONS));
app.use(cookieParser(config.COOKIE_PARSER_SECRET))
app.use(express.json());
app.use(helmet())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// ROUTERS

// app.use("/auth", AuthRouter);
app.use("/", AuthRouter);


const initializeRabbitMQ = async () => {
  await rabbitMQClientMode.initializeRabbitMQClient();
  console.log("Rabbit MQ Client initialized")
  await rabbitMQServerMode.initializeRabbitMQServer();
  console.log("Rabbit MQ Server initialized")
}
  
const appServer = app.listen(server_port, async() => {
  console.log(`Authentication Server running at http://localhost:${server_port}`
  )
  await initializeRabbitMQ()
  console.log("Rabbit MQ  initialized at http://localhost:15672")
})


export {appServer}