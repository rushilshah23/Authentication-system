import { authService } from "@/lib/auth";
import { UsersDB } from "@/models/users";
import { Cookies } from "@/types/Cookies.enum";
import { LocalLoginForm } from "@/types/Forms/LocalLogin.Interface";
import { LocalRegisterForm } from "@/types/Forms/LocalRegister.Interface";
import { TokenExpiration } from "@/types/Payloads.Interface";
import { ResponseInterface } from "@/types/Response.interface";
import { UserInterface } from "@/types/User.Interface";
const bcrypt = require('bcrypt');


export const localRegisterLogic = async (localRegisterForm: LocalRegisterForm): Promise<ResponseInterface> => {
    let res: ResponseInterface = {
        data: undefined,
        status: 0
    };
    const { emailId, password, confirmPassword } = localRegisterForm;
    if (!emailId || !password || !confirmPassword) {

        res = {
            data: "Missing Info",
            status: 404
        }
        return res;
    }
    try {


        if (await authService.getUsersByEmailId(emailId) !== null) {
            res = {
                data: "User already exists",
                status: 401
            }
            return res;
        }


        await authService.createLocalUser(emailId, password).then(async () => {
            res = {
                data: "User created successfully",
                status: 200
            }
            return res;

        })
    } catch (error) {
        res = {
            data: "Something gonne wrong!",
            status: 500
        }
        return res;
    }


    return res;

}



export const localLoginLogic = async (localLoginForm: LocalLoginForm):Promise<ResponseInterface> => {
    let res: ResponseInterface = {
        data: "",
        status: 0
    }


    if (!localLoginForm) {
        res = {
            data: "Login Details missing !",
            status: 400
        }
        return res;
    }
    const { emailId, password } = localLoginForm;
    if (!(emailId && password)) {
        res = {
            data: "Missing credentials !",
            status: 400
        }
        return res;
    }

    try {
        const user: any = await authService.getUsersByEmailId(emailId)
        // .select('+authentication.password +authentication.tokenVersion');
        if (!user) {
            res = {
                data: "User with emailId " + emailId + " doen't exists !",
                status: 400
            }
            return res;

        }
        const passwordMatched = await bcrypt.compare(password, user!.authentication?.password!)
        if (!passwordMatched) {
            res = {
                data: "Incorrect User password",
                status: 400
            }
            return res;
        }
        const tokens = await authService.createRefreshAccessTokens({ emailId: user.emailId, userId: user.userId, authentication: { password: user.authentication?.password!, tokenVersion: user.authentication?.tokenVersion! } })
        res = {
            data: { tokens },
            status: 200
        }
        return res;
    } catch (error) {
        res = {
            data: "Internal Server Error",
            status: 500
        }
        return res;
    }
}


export const logoutLogic = async ():Promise<ResponseInterface> => {
    let res:ResponseInterface = {
        data:"Logged out ",
        status:200
    }
    return res;

}

export const authenticateLogic = async (accessToken:Cookies.ACCESSTOKEN,refreshToken:Cookies.REFRESHTOKEN) :Promise<ResponseInterface> => {
        console.log("Authenticated started")
        console.log(accessToken,refreshToken);
        let res : ResponseInterface = {
            data:"",
            status:0
        }
        const accessTokenPayload = authService.verifyAccessToken(accessToken);
        
        if (accessTokenPayload) {
            res={
                data:accessTokenPayload,
                status:200
            }
            return res;
            
        }
        if (!accessTokenPayload) {
            const refreshTokenPayload = authService.verifyRefreshToken(refreshToken)
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
                    res={
                        data:{newTokens},
                        status:203
                    }
                    return res;
                    // await authService.setCookie(res, newTokens.accessToken, newTokens.refreshToken)
                }
                const accessToken = await authService.signAccessToken({ user: { emailId: refreshTokenPayload.user.emailId, userId: refreshTokenPayload.user.userId } });
                res={
                    data:{accessToken},
                    status:202
                }
                return res;
                // authService.setCookie(res, accessToken)
                // return res.status(202).json(refreshTokenPayload)
                
                
            } else {
                res={
                    data:"UnAuthenticated",
                    status:400
                }
                return res;
            }
    }
    return res;


}


export const getAllUsersLogic = async () => {
    let res : ResponseInterface = {
        data:"",
        status:0
    }
    const allUsersList = await UsersDB.getAllUsers();
    res = {
        data:{allUsersList},
        status:200
    }
    return res;

}


// export const operate = async (req: Request, res: Response) => {
//     console.log("In the route producing message ...")
//     await RabbitMQClient.produce(req.body);
//     return res.status(200).json("Message produced")

// }