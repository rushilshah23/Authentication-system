import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";
import { authenticateAccessVerifyLogic } from "@/services/auth.service";
import { Cookies } from "@/types/Cookies.enum";
import { ServiceResponseInterface } from "@/types/ServiceResponse.Interface";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = async(request:Request, res:Response, next:NextFunction) =>{
    let accessToken = request.signedCookies[Cookies.ACCESSTOKEN];
    if (!!!accessToken) {
      accessToken = ((request.header(Cookies.ACCESSTOKEN) as string) || "")
        .split(" ")
        .pop();
    }
    if (!!accessToken == false) {
      return res
        .status(HTTP_STATUS_CODES.HTTP_401_UNAUTHORIZED)
        .json("Unauthorized User");
    }
  
    const accessTokenPayloadServiceResponse: ServiceResponseInterface =
      await authenticateAccessVerifyLogic(accessToken);

    if(accessTokenPayloadServiceResponse.status == HTTP_STATUS_CODES.HTTP_200_OK){
        next();
    }else{
        return res
        .status(accessTokenPayloadServiceResponse.status)
        .json(accessTokenPayloadServiceResponse.data);
    }
}