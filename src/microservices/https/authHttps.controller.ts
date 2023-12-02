import { NextFunction, Request, Response } from "express";
import { authService } from "@/lib/auth";
import { Cookies } from "@/types/Cookies.enum";
import { ServiceResponseInterface } from "@/types/ServiceResponse.Interface";
import {
  authenticateAccessVerifyLogic,
  authenticateRefreshVerifyLogic,
  getAllUsersLogic,

} from "@/services/auth.service";
import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";
import { ServiceRequestInterface } from "@/types/ServiceRequest.Interface";
import { defaultServiceResponseInterfaceValue } from "@/configs/microService.config";



export const getAllUsersController  = async (req: Request, res: Response) => {
  const response: ServiceResponseInterface = await getAllUsersLogic();
  return res.status(response.status).json(response.data);
};

export const authAccessController = async(request: Request, res: Response) => {
    const apiRequest: ServiceRequestInterface = {
        data:request.body.data,
        eventType:request.body.eventType
    }
    let apiResponse:ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    if(!!apiRequest.data?.[Cookies.ACCESSTOKEN]){

        let accessToken = apiRequest.data[Cookies.ACCESSTOKEN];
        
        if ((!!accessToken) == false) {
            return res
            .status(HTTP_STATUS_CODES.HTTP_401_UNAUTHORIZED)
            .json("Unauthorized User");
        }
        
        apiResponse =
        await authenticateAccessVerifyLogic(accessToken);
    };
        return res
        .status(apiResponse.status)
        .json(apiResponse.data);
}

export const verifyRefreshTokenController = async (request: Request, res: Response) => {
    const apiRequest: ServiceRequestInterface = {
        data:request.body.data,
        eventType:request.body.eventType
    }
    let apiResponse:ServiceResponseInterface = defaultServiceResponseInterfaceValue
    if(apiRequest.data?.[Cookies.REFRESHTOKEN]){

        let refreshToken =apiRequest.data[Cookies.REFRESHTOKEN];
        console.log("Refresh Token ", refreshToken)

  if (!!refreshToken == false) {
    return res
      .status(HTTP_STATUS_CODES.HTTP_401_UNAUTHORIZED)
      .json("Unauthorized User");
  }

  const refreshTokenPayloadServiceResponse: ServiceResponseInterface =
  await authenticateRefreshVerifyLogic(refreshToken);

  if (
    refreshTokenPayloadServiceResponse.status ===
    HTTP_STATUS_CODES.HTTP_207_MULTI_STATUS
  ) {
    apiResponse = {
        data:{
            newTokens:{
                accessToken:refreshTokenPayloadServiceResponse.data.newTokens.accessToken,
                refreshToken:refreshTokenPayloadServiceResponse.data.newTokens.refreshToken
            }
        },
        status:HTTP_STATUS_CODES.HTTP_207_MULTI_STATUS
    }
    // await authService.setCookie(
    //   res,
    //   refreshTokenPayloadServiceResponse.data.newTokens.accessToken,
    //   refreshTokenPayloadServiceResponse.data.newTokens.refreshToken
    // );
  } else if (
    refreshTokenPayloadServiceResponse.status ===
    HTTP_STATUS_CODES.HTTP_206_PARTIAL_CONTENT
  ) {
    apiResponse = {
        data:{
          
                accessToken:refreshTokenPayloadServiceResponse.data.accessToken,
            
        },
        status: HTTP_STATUS_CODES.HTTP_206_PARTIAL_CONTENT
    }
    // await authService.setCookie(
    //   res,
    //   refreshTokenPayloadServiceResponse.data.accessToken
    // );
  }

  return res
    .status(refreshTokenPayloadServiceResponse.status)
    .json(refreshTokenPayloadServiceResponse.data);
}else{
   
}
};
