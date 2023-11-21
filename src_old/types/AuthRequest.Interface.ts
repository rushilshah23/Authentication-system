import { Request } from "express";
import { UserPublicInterface } from "./UserPublic.Interface";

interface AuthRequest extends Request {
    // user?: { emailId: string, userId:string }; // Define the 'user' property
    user?:UserPublicInterface
  }


export {
    AuthRequest
}