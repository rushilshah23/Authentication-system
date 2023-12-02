import {
  AccessToken,
  AccessTokenPayload,
  RefreshToken,
  RefreshTokenPayload,
  TokenExpiration,
} from "@/types/Payloads.Interface";
import { UserInterface } from "@/types/User.Interface";
import jwt from "jsonwebtoken";
import { ENV_VAR as env_config } from "@/configs/env.config";
import { Response } from "express";
import { Cookies } from "@/types/Cookies.enum";
import {
  accessTokenCookieOptions,
  defaultCookieOptions,
  refreshTokenCookieOptions,
} from "@/configs/cookie.config";
import bcrypt from "bcrypt";
import { UsersDB } from "@/models/users";

class Auth {
  public authenticateHelper = async (
    accessToken?: string,
    refreshToken?: string
  ) => {
    if (!!!accessToken || !!!refreshToken) {
      return null;
    }

    const accessTokenPayload = this.verifyAccessToken(accessToken);
    if (accessTokenPayload) {
      return accessTokenPayload;
    }
    if (!accessTokenPayload) {
      const refreshTokenPayload = this.verifyRefreshToken(refreshToken);
      console.log(refreshTokenPayload);
      if (refreshTokenPayload) {
        const user = {
          authentication: { tokenVersion: refreshTokenPayload.versionId },
          emailId: refreshTokenPayload.user.emailId,
          userId: refreshTokenPayload.user.userId,
        };
        return user;
      } else {
        return null;
      }
    }
  };

  public verifyRefreshToken(token: string) {
    try {
      // FIND THE USER OF THE REFRESH TOKEN FROM DATABASE AND WETHER IT MATCHES WIT
      return jwt.verify(
        token,
        env_config.JWT_REFRESH_TOKEN_SECRET
      ) as RefreshToken;
    } catch (error) {
      console.log("Refresh Token Verification failed !");
      console.log(error)
    }
  }

  public verifyAccessToken = (token: string) => {
    try {
      return jwt.verify(
        token,
        env_config.JWT_ACCESS_TOKEN_SECRET
      ) as AccessToken;
    } catch (error) {
      console.log("Access Token Verification failed !");
      return null;
      // console.log(error)
    }
  };

  public signAccessToken = async (accessTokenPayload: AccessTokenPayload) => {
    return jwt.sign(accessTokenPayload, env_config.JWT_ACCESS_TOKEN_SECRET, {
      expiresIn: TokenExpiration.Access,
    });
  };

  public signRefreshToken = async (
    refreshTokenPayload: RefreshTokenPayload
  ) => {
    return jwt.sign(refreshTokenPayload, env_config.JWT_REFRESH_TOKEN_SECRET, {
      expiresIn: TokenExpiration.Refresh,
    });
  };

  public createRefreshAccessTokens = async (user: UserInterface) => {
    const accessPayload: AccessTokenPayload = {
      user: { userId: user.userId, emailId: user.emailId },
    };
    const refreshPayload: RefreshTokenPayload = {
      user: { userId: user.userId, emailId: user.emailId },
      versionId: user.authentication.tokenVersion,
    };

    const accessToken = await this.signAccessToken(accessPayload);
    const refreshToken =
      refreshPayload && (await this.signRefreshToken(refreshPayload));
    return { accessToken, refreshToken };
  };

  public setCookie = async (
    res: Response,
    accessToken: string,
    refreshToken?: string
  ) => {
    res.cookie(Cookies.ACCESSTOKEN, accessToken, accessTokenCookieOptions);
    refreshToken &&
      res.cookie(Cookies.REFRESHTOKEN, refreshToken, refreshTokenCookieOptions);
  };
  public clearCookie = async (res: Response) => {
    res.cookie(Cookies.ACCESSTOKEN, "", { ...defaultCookieOptions, maxAge: 0 });
    res.cookie(Cookies.REFRESHTOKEN, "", {
      ...defaultCookieOptions,
      maxAge: 0,
    });
  };

  public getUsersByEmailId = async (
    emailId: string
  ): Promise<UserInterface | null> => {
    // Find user by emailID from Database
    // const user = UserSchema.findOne({ emailId: emailId });
  
      
    const userDoc = await UsersDB.findOne(emailId);
    if (userDoc)   {
      const user: UserInterface = {
        authentication: userDoc?.authentication,
        emailId: userDoc?.emailId,
        userId: userDoc?.userId,
      };
      console.log(user);
      return user;
    } else {
      return null;
    }
    
  };

  public createLocalUser = async (emailid: string, password: string) => {
    const SALT_ROUNDS = 12;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    try {
      // Create a new user in a database with emailId and hashPassword
      await UsersDB.createUser(emailid, hashedPassword);
      //   UserSchema.create({ emailId: emailid, authentication: { password: hashedPassword, tokenVersion: 0 } });
    } catch (error: any) {
      throw Error(error!);
    }
  };
}

const authService = new Auth();

export { authService };
