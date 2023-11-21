import { UserPublicInterface } from "./UserPublic.Interface";

interface JWT_ResponseToken {
    user:UserPublicInterface,
    iat:number;
    exp:number;

}

export {JWT_ResponseToken}