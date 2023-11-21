import { NextFunction, Request, Response } from "express";
import { authService } from "@/lib/auth";
import { Cookies } from "@/types/Cookies.enum";
import { UserInterface } from "@/types/User.Interface";
import { TokenExpiration } from "@/types/Payloads.Interface";
import { AuthRequest } from "@/types/AuthRequest.Interface";
import { Socket } from "net";


export const authenticateMW = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const accessTokenPayload = authService.verifyAccessToken(req.cookies[Cookies.ACCESSTOKEN]);
    if (accessTokenPayload) {
        req.user = await authService.getUsersByEmailId(accessTokenPayload.user.emailId).then((user) => {
            return { "emailId": user?.emailId!,"userId":user?.userId! }
        });
        console.log("Authenticated")
        next();

        // return res.status(200).json(accessTokenPayload)        
    }
    if (!accessTokenPayload) {
        const refreshTokenPayload = authService.verifyRefreshToken(req.cookies[Cookies.REFRESHTOKEN])
        console.log(refreshTokenPayload)
        if (refreshTokenPayload) {
            let user: UserInterface;
            const expiration = new Date(refreshTokenPayload.exp * 1000)
            const now = new Date()
            const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000

            if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {

                user = {
                    authentication: { tokenVersion: refreshTokenPayload.versionId },
                    emailId: refreshTokenPayload.user.emailId,
                    userId: refreshTokenPayload.user.userId
                }

                const newTokens = await authService.createRefreshAccessTokens(user)
                await authService.setCookie(res, newTokens.accessToken, newTokens.refreshToken)
                req.user = await authService.getUsersByEmailId(refreshTokenPayload.user.emailId).then((user) => {
                    return { "emailId": user?.emailId! , "userId":user?.userId!}
                });
                console.log("Authenticated")
                next();
                // return res.status(203).json( user);
            }
            const accessToken = await authService.signAccessToken({user:{ emailId: refreshTokenPayload.user.emailId, userId: refreshTokenPayload.user.userId }});
            authService.setCookie(res, accessToken)
            req.user = await authService.getUsersByEmailId(refreshTokenPayload.user.emailId).then((user) => {
                return { "emailId": user?.emailId!, "userId":user?.userId! }
            });
            console.log("Authenticated")

            next();
            // return res.status(202).json(refreshTokenPayload)


        } else {
            console.log("UnAuthenticated")
            return res.status(400).json("Unauthenticated");
        }
    }
}



export const authenticateMW_WS = async (req: AuthRequest, socket: Socket, next: NextFunction) => {
    if (req.headers.cookie) {

        req.cookies = authService.parseCookies(req.headers.cookie)
        console.log("Authenticated started")
        console.log("Access Cookie are ", req.cookies[Cookies.ACCESSTOKEN])
        console.log("refresh Cookie are ", req.cookies[Cookies.REFRESHTOKEN])

        const accessTokenPayload = authService.verifyAccessToken(req.cookies[Cookies.ACCESSTOKEN]);
        if (accessTokenPayload) {
            req.user = await authService.getUsersByEmailId(accessTokenPayload.user.emailId).then((user) => {
                return { "emailId": user?.emailId!,"userId":user?.userId! }
            });
                next();
            // return res.status(200).json(accessTokenPayload)        
        }
        if (!accessTokenPayload) {
            const refreshTokenPayload = authService.verifyRefreshToken(req.cookies[Cookies.REFRESHTOKEN])
            console.log(refreshTokenPayload)
            if (refreshTokenPayload) {
                let user: UserInterface;
                const expiration = new Date(refreshTokenPayload.exp * 1000)
                const now = new Date()
                const secondsUntilExpiration = (expiration.getTime() - now.getTime()) / 1000

                if (secondsUntilExpiration < TokenExpiration.RefreshIfLessThan) {

                    user = {
                        authentication: { tokenVersion: refreshTokenPayload.versionId },
                        emailId: refreshTokenPayload.user.emailId,
                        userId: refreshTokenPayload.user.userId
                    }

                    const newTokens = await authService.createRefreshAccessTokens(user)
                    // await  authService.setCookie(res,newTokens.accessToken,newTokens.refreshToken)
                    req.user = await authService.getUsersByEmailId(refreshTokenPayload.user.emailId).then((user) => {
                        return { "emailId": user?.emailId!, "userId":user?.userId! }
                    });
                    next();
                    // return res.status(203).json( user);
                }
                const accessToken = await authService.signAccessToken({user:{ emailId: refreshTokenPayload.user.emailId, userId: refreshTokenPayload.user.userId }});
                // authService.setCookie(res,accessToken)
                req.user = await authService.getUsersByEmailId(refreshTokenPayload.user.emailId).then((user) => {
                    return { "emailId": user?.emailId!,"userId":user?.userId! }
                });
                next();
                // return res.status(202).json(refreshTokenPayload)


            }
        }
    } else {
        console.log("Destroying the socket Unauthenticated user!")
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
        // return res.status(400).json("Unauthenticated");
    }
}


