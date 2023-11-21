import { UserPublicInterface } from "./UserPublic.Interface";

export interface AccessTokenPayload {
    // userId:string;
    // emailId:string;
    user:UserPublicInterface;
}
export interface RefreshTokenPayload{
    // userId:string;
    // emailId:string;
    user:UserPublicInterface;
    versionId:number;
}

export interface AccessToken extends AccessTokenPayload{
    exp:number;

}
export interface RefreshToken extends RefreshTokenPayload {
    exp: number;
}

export enum TokenExpiration {
    Access =  1 * 60,
    Refresh = 2 * 60,
    RefreshIfLessThan =  1.5 * 60,
}