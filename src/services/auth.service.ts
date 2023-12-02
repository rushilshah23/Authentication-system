import { HTTP_STATUS_CODES } from "@/configs/httpStatusCodes.config";
import { defaultServiceResponseInterfaceValue } from "@/configs/microService.config";
import { authService } from "@/lib/auth";
import { UsersDB } from "@/models/users";
import { Cookies } from "@/types/Cookies.enum";
import { LocalLoginForm } from "@/types/Forms/LocalLogin.Interface";
import { LocalRegisterForm } from "@/types/Forms/LocalRegister.Interface";
import { TokenExpiration } from "@/types/Payloads.Interface";
import { ServiceResponseInterface } from "@/types/ServiceResponse.Interface";
import { UserInterface } from "@/types/User.Interface";
const bcrypt = require('bcrypt');


export const localRegisterLogic = async (localRegisterForm: LocalRegisterForm): Promise<ServiceResponseInterface> => {
    let res: ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    const { emailId, password, confirmPassword } = localRegisterForm;
    if (!emailId || !password || !confirmPassword) {

        res = {
            data: "Missing Info",
            status: HTTP_STATUS_CODES.HTTP_404_NOT_FOUND
        }
        return res;
    }
    try {


        if (await authService.getUsersByEmailId(emailId) !== null) {
            res = {
                data: "User already exists",
                status: HTTP_STATUS_CODES.HTTP_409_CONFLICT
            }
            return res;
        }


        await authService.createLocalUser(emailId, password).then(async () => {
            res = {
                data: "User created successfully",
                status: HTTP_STATUS_CODES.HTTP_201_CREATED
            }
            return res;

        })
    } catch (error) {
        res = {
            data: "Something gonne wrong!",
            status: HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR
        }
        return res;
    }


    return res;

}



export const localLoginLogic = async (localLoginForm: LocalLoginForm):Promise<ServiceResponseInterface> => {
    let res: ServiceResponseInterface = defaultServiceResponseInterfaceValue;


    if (!localLoginForm) {
        res = {
            data: "Login Details missing !",
            status: HTTP_STATUS_CODES.HTTP_406_NOT_ACCEPTABLE
        }
        return res;
    }
    const { emailId, password } = localLoginForm;
    if (!(emailId && password)) {
        res = {
            data: "Missing credentials !",
            status: HTTP_STATUS_CODES.HTTP_406_NOT_ACCEPTABLE
        }
        return res;
    }

    try {
        const user: any = await authService.getUsersByEmailId(emailId)
        // .select('+authentication.password +authentication.tokenVersion');
        if (!user) {
            res = {
                data: "User with emailId " + emailId + " doen't exists !",
                status: HTTP_STATUS_CODES.HTTP_400_BAD_REQUEST
            }
            return res;

        }
        const passwordMatched = await bcrypt.compare(password, user!.authentication?.password!)
        if (!passwordMatched) {
            res = {
                data: "Incorrect User password",
                status: HTTP_STATUS_CODES.HTTP_400_BAD_REQUEST
            }
            return res;
        }
        const tokens = await authService.createRefreshAccessTokens({ emailId: user.emailId, userId: user.userId, authentication: { password: user.authentication?.password!, tokenVersion: user.authentication?.tokenVersion! } })
        res = {
            data: { tokens },
            status: HTTP_STATUS_CODES.HTTP_200_OK
        }
        return res;
    } catch (error) {
        res = {
            data: "Internal Server Error",
            status: HTTP_STATUS_CODES.HTTP_500_INTERNAL_SERVER_ERROR
        }
        return res;
    }
}


export const logoutLogic = async ():Promise<ServiceResponseInterface> => {
    let res:ServiceResponseInterface =defaultServiceResponseInterfaceValue;
    res = {
        data:"Logged out ",
        status:HTTP_STATUS_CODES.HTTP_200_OK
    }
    return res;

}

export const  authenticateLogic = async (accessToken:Cookies.ACCESSTOKEN,refreshToken:Cookies.REFRESHTOKEN) :Promise<ServiceResponseInterface> => {
        console.log("Authenticated started")
        console.log(accessToken,refreshToken);
        let res : ServiceResponseInterface = defaultServiceResponseInterfaceValue;
        const accessTokenPayload = authService.verifyAccessToken(accessToken);
        
        if (accessTokenPayload) {
            res={
                data:accessTokenPayload,
                status:HTTP_STATUS_CODES.HTTP_200_OK
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


export const getAllUsersLogic = async ():Promise<ServiceResponseInterface>  => {
    let res : ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    const allUsersList = await UsersDB.getAllUsers();
    res = {
        data:{allUsersList},
        status:200
    }
    return res;

}

export const authenticateAccessVerifyLogic = async(accessToken:string):Promise<ServiceResponseInterface>  => {
    console.log("Access Token authentication started")
    console.log(accessToken);
    let res : ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    const accessTokenPayload =  authService.verifyAccessToken(accessToken);
    
    if (!!accessTokenPayload) {
        res={
            data:accessTokenPayload,
            status:HTTP_STATUS_CODES.HTTP_200_OK
        }
        
    }else{
        res={
            data:"Unauthorized User error",
            status:HTTP_STATUS_CODES.HTTP_401_UNAUTHORIZED
        }
    }
    return res;

}




export const authenticateRefreshVerifyLogic = async(refreshToken:string):Promise<ServiceResponseInterface>  => {

    let res:ServiceResponseInterface = defaultServiceResponseInterfaceValue;
    const refreshTokenPayload =  authService.verifyRefreshToken(refreshToken)
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
                status:HTTP_STATUS_CODES.HTTP_207_MULTI_STATUS
            }
            return res;
            // await authService.setCookie(res, newTokens.accessToken, newTokens.refreshToken)
        }
        const accessToken = await authService.signAccessToken({ user: { emailId: refreshTokenPayload.user.emailId, userId: refreshTokenPayload.user.userId } });
        res={
            data:{accessToken},
            status:HTTP_STATUS_CODES.HTTP_206_PARTIAL_CONTENT
        }
        return res;
        // authService.setCookie(res, accessToken)
        // return res.status(202).json(refreshTokenPayload)
        
        
    } else {
        res={
            data:"UnAuthenticated",
            status:HTTP_STATUS_CODES.HTTP_401_UNAUTHORIZED
        }
        return res;
    }
}
