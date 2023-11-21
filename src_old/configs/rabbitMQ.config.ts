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


enum QUEUES {
    AUTH_REQUEST_CLIENT="AUTH_REQUEST_CLIENT",
    AUTH_REPLY_CLIENT="AUTH_REPLY_CLIENT",
    AUTH_REQUEST_SERVER="AUTH_REQUEST_SERVER",
    AUTH_REPLY_SERVER="AUTH_REPLY_SERVER",
    SOCKET_REQUEST_CLIENT="SOCKET_REQUEST_CLIENT",
    SOCKET_REPLY_CLIENT="SOCKET_REPLY_CLIENT",
    SOCKET_REQUEST_SERVER="SOCKET_REQUEST_SERVER",
    SOCKET_REPLY_SERVER="SOCKET_REPLY_SERVER",
    GENERAL_REQUEST_CLIENT="GENERAL_REQUEST_CLIENT",
    GENERAL_REPLY_CLIENT="GENERAL_REPLY_CLIENT",
    GENERAL_REQUEST_SERVER="GENERAL_REQUEST_SERVER",
    GENERAL_REPLY_SERVER="GENERAL_REPLY_SERVER",

}

enum EventsList {
    GET_AUTH = "GET_AUTH",
    JOIN_ROOM="JOIN_ROOM",
    VALIDATE_PARTICIPANTS="VALIDATE_PARTICIPANTS",
    VALIDATE_MOVE="VALIDATE_MOVE",
    UPDATE_GAME="UPDATE_GAME",
}


// Create a Blueprint/ Type/ Interface for the rabbitMQConfig variable below

export const rabbitMQConfig = {
        RABBITMQ_URL:RABBITMQ_URL!,
        EXCHANGE_NAME:EXCHANGE_NAME!,
        CLIENT_MODE:{
            
                AUTH:{
                    EVENTS:{
                        
                    },
                    QUEUES:{
                        REQUEST_QUEUES:{
                            [QUEUES.SOCKET_REQUEST_SERVER]: [QUEUES.SOCKET_REQUEST_SERVER],
                            [QUEUES.GENERAL_REQUEST_SERVER]:[QUEUES.GENERAL_REQUEST_SERVER]
                            
                        },
                        REPLY_QUEUES:{
                            [QUEUES.AUTH_REPLY_CLIENT]:[QUEUES.AUTH_REPLY_CLIENT]
                        } 
                    }
                },
                SOCKET:{
                    EVENTS:{
                        [EventsList.GET_AUTH]:[EventsList.GET_AUTH],

                        [EventsList.JOIN_ROOM]:[EventsList.JOIN_ROOM],
                        [EventsList.VALIDATE_PARTICIPANTS]:[EventsList.VALIDATE_PARTICIPANTS],
                        [EventsList.VALIDATE_MOVE]:[EventsList.VALIDATE_MOVE],
                        [EventsList.UPDATE_GAME]:[EventsList.UPDATE_GAME]
                    },
                    QUEUES:{
                        REQUEST_QUEUES:{
                            [QUEUES.AUTH_REQUEST_SERVER]: [QUEUES.AUTH_REQUEST_SERVER],
                            [QUEUES.GENERAL_REQUEST_SERVER]:[QUEUES.GENERAL_REQUEST_SERVER]
                            
                        },
                        REPLY_QUEUES:{
                            [QUEUES.SOCKET_REPLY_CLIENT]:[QUEUES.SOCKET_REPLY_CLIENT]
                        } 
                    }
                },
                GENERAL:{
                    EVENTS:{
                        [EventsList.GET_AUTH]:[EventsList.GET_AUTH],
                     
                    },
                    QUEUES:{
                        REQUEST_QUEUES:{
                            [QUEUES.SOCKET_REQUEST_SERVER]: [QUEUES.SOCKET_REQUEST_SERVER],
                            [QUEUES.AUTH_REQUEST_SERVER]:[QUEUES.AUTH_REQUEST_SERVER]
                            
                        },
                        REPLY_QUEUES:{
                            [QUEUES.GENERAL_REPLY_CLIENT]:[QUEUES.GENERAL_REPLY_CLIENT]
                        } 
                    }
                },

            
  
        },
        SERVER_MODE:{
            
            AUTH:{
                EVENTS:{
                    [EventsList.GET_AUTH]:[EventsList.GET_AUTH]
                },
                QUEUES:{
                    REQUEST_QUEUES:{
                        [QUEUES.AUTH_REQUEST_SERVER]:[QUEUES.AUTH_REQUEST_SERVER]
                        
                    },
                    REPLY_QUEUES:{
                        [QUEUES.SOCKET_REPLY_CLIENT]:[QUEUES.SOCKET_REPLY_CLIENT],
                        [QUEUES.GENERAL_REPLY_CLIENT]: [QUEUES.GENERAL_REPLY_CLIENT]
                    } 
                }
            },
            SOCKET:{
                EVENTS:{
                    
                },
                QUEUES:{
                    REQUEST_QUEUES:{
                        [QUEUES.SOCKET_REQUEST_SERVER]:[QUEUES.SOCKET_REQUEST_SERVER]
                        
                    },
                    REPLY_QUEUES:{
                        [QUEUES.AUTH_REPLY_CLIENT]:[QUEUES.AUTH_REPLY_CLIENT],
                        [QUEUES.GENERAL_REPLY_CLIENT]: [QUEUES.GENERAL_REPLY_CLIENT]
                    } 
                }
            },
            GENERAL:{
                EVENTS:{

                    [EventsList.JOIN_ROOM]:[EventsList.JOIN_ROOM],
                    [EventsList.VALIDATE_PARTICIPANTS]:[EventsList.VALIDATE_PARTICIPANTS],
                    [EventsList.VALIDATE_MOVE]:[EventsList.VALIDATE_MOVE],
                    [EventsList.UPDATE_GAME]:[EventsList.UPDATE_GAME]
                },
                QUEUES:{
                    REQUEST_QUEUES:{
                        [QUEUES.GENERAL_REQUEST_SERVER]:[QUEUES.GENERAL_REQUEST_SERVER]
                        
                    },
                    REPLY_QUEUES:{
                        [QUEUES.AUTH_REPLY_CLIENT]:[QUEUES.AUTH_REPLY_CLIENT],
                        [QUEUES.SOCKET_REPLY_CLIENT]: [QUEUES.SOCKET_REPLY_CLIENT]
                    } 
                }
            },

        

    },
    }
