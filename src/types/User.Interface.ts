export interface Authentication{
    password?:string;
    tokenVersion:number;
}


export interface UserInterface {
    userId:string;
    emailId:string;
    authentication: Authentication;
}