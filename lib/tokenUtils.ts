"use server";

import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";

const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;

if (!jwtAccessSecret) {
  throw new Error("JWT_ACCESS_SECRET is not defined in environment variables");
}

const getTokenRemainingTime = async (token: string) => {
  if (!token) return 0;

  try {
    const tokenPayload= jwt.decode(token) as JwtPayload;

        if (tokenPayload && !tokenPayload.exp){
            return 0;
        }

        const remainingSeconds = tokenPayload.exp as number - Math.floor(Date.now() / 1000)

        return remainingSeconds > 0 ? remainingSeconds : 0;

  } catch (error) {
    console.error("Error decoding token:", error);
    return 0;
  }
};

export const setTokenInCookies = async (name: string, token: string, fallbackMaxAgeInSeconds:number = 24*60*60) => {

  let maxAgeInSeconds;

    if (name !== "better-auth.session_token"){
        maxAgeInSeconds = await getTokenRemainingTime(token);
    }

    await setCookie(name, token, maxAgeInSeconds || fallbackMaxAgeInSeconds);
};


export const isTokenExpiringSoon = async (token: string, thresholdInSeconds = 300) => {
  const remainingSeconds = await getTokenRemainingTime(token);
  return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
}

export const isTokenExpired = async (token: string) =>  {
  const remainingSeconds = await getTokenRemainingTime(token);
  return remainingSeconds === 0;
}