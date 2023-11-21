import { NextFunction, Request, Response } from "express";
import { authService } from "@/lib/auth";
import { Cookies } from "@/types/Cookies.enum";
import { ServiceResponseInterface } from "@/types/ServiceResponse.Interface";
import {
  authenticateAccessVerifyLogic,
  authenticateLogic,
  authenticateRefreshVerifyLogic,
  getAllUsersLogic,
  localLoginLogic,
  localRegisterLogic,
} from "@/logic/auth.logic";
import { request } from "http";
import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";

export const localRegisterContoller  = async (req: Request, res: Response) => {
  if (req.body.localRegisterForm) {
    const { emailId, password, confirmPassword } = req.body.localRegisterForm;
    if (!emailId || !password || !confirmPassword) {
      return res.status(404).json("Missing info");
    }
    const response: ServiceResponseInterface = await localRegisterLogic(
      req.body.localRegisterForm
    );
    return res.status(response.status).json(response.data);
  } else {
    return res.status(400).json("Missing Info");
  }
};

export const localLoginContoller  = async (req: Request, res: Response) => {
  if (!!!req.body.localLoginForm) {
    return res.status(400).json("Login Details missing !");
  }
  const response: ServiceResponseInterface = await localLoginLogic(
    req.body.localLoginForm
  );
  if (response.status === 200) {
    authService.setCookie(
      res,
      response.data.tokens.accessToken,
      response.data.tokens.refreshToken
    );
  }
  return res.status(response.status).json(response.data);
};

export const logoutContoller  = async (req: Request, res: Response) => {
  if (
    !req.signedCookies[Cookies.ACCESSTOKEN] &&
    !req.signedCookies[Cookies.REFRESHTOKEN]
  ) {
    return res.status(200).json("User already logged out !");
  }
  authService.clearCookie(res);
  return res.status(200).json("User logged out successfully !");
};

// export const authenticateContoller  = async (req: Request, res: Response) => {
//   const response: ServiceResponseInterface = await authenticateLogic(
//     req.signedCookies[Cookies.ACCESSTOKEN],
//     req.signedCookies[Cookies.REFRESHTOKEN]
//   );

//   if (response.status === 203) {
//     await authService.setCookie(
//       res,
//       response.data.newTokens.accessToken,
//       response.data.newTokens.refreshToken
//     );
//   } else if (response.status === 202) {
//     await authService.setCookie(res, response.data.accessToken);
//   }

//   return res.status(response.status).json(response.data);
// };

export const getAllUsersContoller  = async (req: Request, res: Response) => {
  const response: ServiceResponseInterface = await getAllUsersLogic();
  return res.status(response.status).json(response.data);
};

export const authAccessContoller = async(request: Request, res: Response) => {
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
  return res
    .status(accessTokenPayloadServiceResponse.status)
    .json(accessTokenPayloadServiceResponse.data);
};

export const verifyRefreshTokenContoller = async (request: Request, res: Response) => {
  let refreshToken = request.signedCookies[Cookies.REFRESHTOKEN];
  if (!!!refreshToken) {
    refreshToken = ((request.header(Cookies.REFRESHTOKEN) as string) || "")
      .split(" ")
      .pop();
  }
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
    await authService.setCookie(
      res,
      refreshTokenPayloadServiceResponse.data.newTokens.accessToken,
      refreshTokenPayloadServiceResponse.data.newTokens.refreshToken
    );
  } else if (
    refreshTokenPayloadServiceResponse.status ===
    HTTP_STATUS_CODES.HTTP_206_PARTIAL_CONTENT
  ) {
    await authService.setCookie(
      res,
      refreshTokenPayloadServiceResponse.data.accessToken
    );
  }

  return res
    .status(refreshTokenPayloadServiceResponse.status)
    .json(refreshTokenPayloadServiceResponse.data);
};