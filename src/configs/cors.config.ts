import { CorsOptions } from "cors";
import { ENV_VAR } from "./env.config";

export const CORS_OPTIONS: CorsOptions = {
   
        origin:ENV_VAR.CLIENT_URL,
        credentials:true,
        
        
    
}