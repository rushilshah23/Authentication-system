import { Request, Response } from "express";
import { authService } from "@/lib/auth";
import { Cookies } from "@/types/Cookies.enum";
import RabbitMQClient from "@/services/client";
import { ResponseInterface } from "@/types/Response.interface";
import { authenticateLogic, getAllUsersLogic, localLoginLogic, localRegisterLogic } from "@/logic/auth.logic";




export const localRegister = async (req: Request, res: Response) => {
    if (req.body.localRegisterForm) {

        const { emailId, password, confirmPassword } = req.body.localRegisterForm;
        if (!emailId || !password || !confirmPassword) {
            return res.status(404).json("Missing info");
        }
        const response: ResponseInterface = await localRegisterLogic(req.body.localRegisterForm);
        return res.status(response.status).json(response.data);
    } else {
        return res.status(400).json("Missing Info")
    }




}

export const localLogin = async (req: Request, res: Response) => {



    if (!req.body.localLoginForm) {
        return res.status(400).json("Login Details missing !")
    }
    const response: ResponseInterface = await localLoginLogic(req.body.localLoginForm);
    if (response.status === 200) {
        authService.setCookie(res, response.data.tokens.accessToken, response.data.tokens.refreshToken);
    }
    return res.status(response.status).json(response.data);

}


export const logout = async (req: Request, res: Response) => {
    if (!req.signedCookies[Cookies.ACCESSTOKEN] && !req.signedCookies[Cookies.REFRESHTOKEN]) {
        return res.status(200).json("User already logged out !")
    }
    authService.clearCookie(res);
    return res.status(200).json("User logged out successfully !")
}

export const authenticate = async (req: Request, res: Response) => {

    const response: ResponseInterface = await authenticateLogic(req.signedCookies[Cookies.ACCESSTOKEN], req.signedCookies[Cookies.REFRESHTOKEN]);


    if (response.status === 203) {
        await authService.setCookie(res, response.data.newTokens.accessToken, response.data.newTokens.refreshToken)
    }
    else if (response.status === 202) {
        await authService.setCookie(res, response.data.accessToken)
    }

    return res.status(response.status).json(response.data);


}


export const getAllUsers = async (req: Request, res: Response) => {
    const response: ResponseInterface = await getAllUsersLogic();
    return res.status(response.status).json(response.data);

}


export const operate = async (req: Request, res: Response) => {
    console.log("In the route producing message ...")
    await RabbitMQClient.produce(req.body);
    return res.status(200).json("Message produced")

}