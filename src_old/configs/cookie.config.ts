import { CookieOptions } from "express"
import { ENV_VAR as  env_config } from "@/configs/env.config"
import { TokenExpiration } from "@/types/Payloads.Interface";

export const defaultCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env_config.ENVIRNOMENT,
    sameSite: env_config.ENVIRNOMENT ? 'strict' : 'lax',
    domain: env_config.BASE_DOMAIN,
    path: '/',
    signed: true,
  }

  export const refreshTokenCookieOptions: CookieOptions = {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Refresh * 1000,
  }

  export const  accessTokenCookieOptions: CookieOptions = {
    ...defaultCookieOptions,
    maxAge: TokenExpiration.Access * 1000,
  }
