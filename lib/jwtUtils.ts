import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";


const verifyToken = (token: string, secret: string) => {
    try {
        const decoded = jwt.verify(token, secret) as JwtPayload;
         return {
        success: true,
        data: decoded
       };
    } catch (error:any) {
        return {
        success: false,
        message: error.message
       }
    }
}

const decodeToken = (token: string) => {
    
        const decoded = jwt.decode(token) as JwtPayload;
        return decoded;
    
}

export const jwtUtils =  {
    verifyToken,
    decodeToken
}