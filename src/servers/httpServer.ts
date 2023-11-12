import express from "express"
import cors from "cors";
import { AuthRouter } from "@/routes/auth";
import { ENV_VAR as config } from "@/configs/env.config";
import cookieParser from "cookie-parser";
import helmet from "helmet"
import bodyParser from "body-parser";
import { CORS_OPTIONS } from "@/configs/cors.config";
// import RabbitMQClient from "@/services/client";

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

  
const appServer = app.listen(server_port, async() => {
  console.log(`Authentication Server running at http://localhost:${server_port}`
  )
  // await RabbitMQClient.initialize()
  // console.log("Rabbit MQ Server initialized at http://localhost:15672")
})


export {appServer}