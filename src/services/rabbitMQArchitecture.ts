// import { rabbitMQ } from "../configs/rabbitmq.config";

// enum EXCHANGES {
//     AUTH_EXCHANGE = "AUTH_EXCHANGE",
//     GENERAL_EXCHANGE = "GENERAL_EXCHANGE",
//     SOCKET_EXCHANGE = "SOCKET_EXCHANGE",
// }

// enum QUEUES {
//     AUTH_PRODUCE = "AUTH_PRODUCE",
//     AUTH_CONSUME = "AUTH_CONSUME",
//     GENERAL_PRODUCE = "GENERAL_PRODUCE",
//     GENERAL_CONSUME = "GENERAL_CONSUME",
//     SOCKET_PRODUCE = "SOCKET_PRODUCE",
//     SOCKET_CONSUME = "SOCKET_CONSUME",
// }

// type QueueConfig = Record<string, QUEUES>;

// type EXCHANGE_TYPES = "direct" | "fanout" | "topic";

// type KEY_OR_PATTERN = "auth"|"socket"|"general";

// type KeysOfQueueConfig = keyof QueueConfig;
// type ExchangeConfig = {
//     EXCHANGE_NAME:EXCHANGES;
//     KEY_OR_PATTERN:KEY_OR_PATTERN;
//     EXCHANGE_TYPE: EXCHANGE_TYPES;
//     QUEUES: QueueConfig;
// };

// type ArchitectureBlueprint = {
//     RABBITMQ_URL: string;
//     EXCHANGES_LIST: Record<EXCHANGES, ExchangeConfig>;
// };

// export const rabbitmqArchitecture: ArchitectureBlueprint = {
//     RABBITMQ_URL: rabbitMQ.RABBITMQ_URL!,
//     EXCHANGES_LIST: {
//         [EXCHANGES.AUTH_EXCHANGE]: {
//             EXCHANGE_NAME:EXCHANGES.AUTH_EXCHANGE,
//             EXCHANGE_TYPE: "direct",
//             KEY_OR_PATTERN:"auth",
//             QUEUES: {
//                 [QUEUES.AUTH_PRODUCE]: QUEUES.AUTH_PRODUCE,
//                 [QUEUES.AUTH_CONSUME]: QUEUES.AUTH_CONSUME,
//                 [QUEUES.SOCKET_REPLY]: QUEUES.SOCKET_REPLY,
//                 [QUEUES.GENERAL_REPLY]: QUEUES.GENERAL_REPLY,
//             },
//         },
//         [EXCHANGES.SOCKET_EXCHANGE]: {
//             EXCHANGE_NAME:EXCHANGES.SOCKET_EXCHANGE,
//             EXCHANGE_TYPE: "direct",
//             KEY_OR_PATTERN:"socket",
//             QUEUES: {
//                 [QUEUES.AUTH_REPLY]: QUEUES.AUTH_REPLY,
//                 [QUEUES.SOCKET_REQUEST]: QUEUES.SOCKET_REQUEST,
//                 [QUEUES.SOCKET_REPLY]: QUEUES.SOCKET_REPLY,
//                 [QUEUES.GENERAL_REPLY]: QUEUES.GENERAL_REPLY,
//             },
//         },
//         [EXCHANGES.GENERAL_EXCHANGE]: {
//             EXCHANGE_NAME:EXCHANGES.GENERAL_EXCHANGE,
//             EXCHANGE_TYPE: "direct",
//             KEY_OR_PATTERN:"general",
//             QUEUES: {
//                 [QUEUES.AUTH_REPLY]: QUEUES.AUTH_REPLY,
//                 [QUEUES.SOCKET_REPLY]: QUEUES.SOCKET_REPLY,
//                 [QUEUES.GENERAL_REQUEST]: QUEUES.GENERAL_REQUEST,
//                 [QUEUES.GENERAL_REPLY]: QUEUES.GENERAL_REPLY,
//             },
//         },
//     },
// };
