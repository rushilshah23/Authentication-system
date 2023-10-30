import { Request, Response } from "express";
import {authService} from "@/lib/auth";
import bcrypt from "bcrypt";
import { Cookies } from "@/types/Cookies.enum";
import {UserInterface} from "@/types/User.Interface";
import { TokenExpiration } from "@/types/Payloads.Interface";
import {   UsersDB} from "@/models/users";


export const localRegister = async (req: Request, res: Response) => {
    const { emailId, password, confirmPassword } = req.body.localRegisterForm;
    if (!emailId || !password || !confirmPassword) {
        return res.status(404).json("Missing info");
    }
    try {


        if (await authService.getUsersByEmailId(emailId) !== null) {
            return res.status(401).json("User already exists")
        }


        await authService.createLocalUser(emailId, password).then(async() => {
            return res.status(200).json("User created successfully")

        })
    } catch (error) {
        return res.status(500).json("Something gonne wrong!")
    }


}

export const localLogin = async (req: Request, res: Response) => {


    const { emailId, password } = req.body.localLoginForm;
    if (!emailId || !password) {
        return res.status(400).json("Missing credentials");
    }
    try {
        const user:any = await authService.getUsersByEmailId(emailId)
        // .select('+authentication.password +authentication.tokenVersion');
        if (!user) {
            return res.status(400).json("User with emailId " + emailId + " doen't exists !")
        }
        const passwordMatched = await bcrypt.compare(password, user!.authentication?.password!)
        if (!passwordMatched) {
            return res.status(400).json("Incorrect User password");
        }
        const tokens = await authService.createRefreshAccessTokens({ emailId: user.emailId, userId: user.userId, authentication: { password: user.authentication?.password!, tokenVersion: user.authentication?.tokenVersion! } })
        authService.setCookie(res, tokens.accessToken, tokens.refreshToken);
        return res.status(200).json(tokens);
    } catch (error) {
        return res.status(500).json("Internal server error");
    }
}


export const logout = async (req: Request, res: Response) => {
    if(!req.signedCookies[Cookies.ACCESSTOKEN] && ! req.signedCookies[Cookies.REFRESHTOKEN]){
        return res.status(200).json("User already logged out !")
    }
    authService.clearCookie(res);
    return res.status(200).json("User logged out successfully !")
}

export  const  authenticate = async(req:Request,res:Response) => {
    console.log("Authenticated started")
        const accessTokenPayload =  authService.verifyAccessToken(req.signedCookies[Cookies.ACCESSTOKEN]);
        if(accessTokenPayload){
            return res.status(200).json(accessTokenPayload)
            
        }
        if(!accessTokenPayload){
            const refreshTokenPayload = authService.verifyRefreshToken(req.signedCookies[Cookies.REFRESHTOKEN])
        console.log(refreshTokenPayload)
        if(refreshTokenPayload){
            let user :UserInterface;
            const expiration = new Date(refreshTokenPayload.exp * 1000)
            const now = new Date()
            const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000
            
            if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {
                
                user = {
                    authentication:{tokenVersion: refreshTokenPayload.versionId},
                    emailId:refreshTokenPayload.user.emailId,
                    userId:refreshTokenPayload.user.userId
                }
                
                const newTokens = await authService.createRefreshAccessTokens(user)
                await  authService.setCookie(res,newTokens.accessToken,newTokens.refreshToken)
                return res.status(203).json( user);
            }
            const accessToken = await authService.signAccessToken({user:{emailId:refreshTokenPayload.user.emailId,userId:refreshTokenPayload.user.userId}});
            authService.setCookie(res,accessToken)
            return res.status(202).json(refreshTokenPayload)
            
        
        }else{
            return res.status(400).json("Unauthenticated");
        }
    }


}


export const getAllUsers = async(req:Request, res:Response) =>{
    const allUsersList =  await UsersDB.getAllUsers();
    res.status(200).json(allUsersList);

}

