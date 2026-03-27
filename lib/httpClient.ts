import { ApiResponse } from '@/types/api.types';
import axios from  'axios'
import { isTokenExpiringSoon } from './tokenUtils';
import { cookies, headers } from 'next/headers';
import { setNewRefreshToken } from '@/services/auth.services';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if(!API_BASE_URL){
    throw new Error("API_BASE_URL is not defined in environment variables");
}


async function tryRefreshToken(
    accessToken: string,
    refreshToken: string
):Promise<void> {
    if(!isTokenExpiringSoon(accessToken)){
        return;
    }

    const requestHeader  = await headers();
    
    if(requestHeader.get('x-token-refreshed') === '1'){
        return;
    }
    
    try {
       await setNewRefreshToken(refreshToken);

    } catch (error:any) {
        console.error("Error refreshing token: ", error);
    }


}


const axiosInstance = async()=> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;
    
    if(accessToken && refreshToken){
        await tryRefreshToken(accessToken, refreshToken);
    }

    const cookieHeader = cookieStore.getAll().map(cookie=> `${cookie.name}=${cookie.value}`).join('; ');

    const instance = axios.create({
        baseURL: API_BASE_URL,
        timeout: 30000,
        headers: {
            "Content-Type": 'application/json',
            Cookie: cookieHeader
        }
    })

    return instance
}

export interface ApiReqeustOptions {
    params?: Record<string, unknown>,
    headers?: Record<string, string>,
}

const httpGet = async<TData>(endPoint: string, options?: ApiReqeustOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.get<ApiResponse<TData>>(endPoint, {
            params: options?.params,
            headers: options?.headers
        });

        return response.data;
        
    } catch (error) {
        console.error(`GET request to ${endPoint} failed: `, error);
        throw error;
    }
}

const httpPost = async<TData>(endPoint: string, data: unknown, options?: ApiReqeustOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.post<ApiResponse<TData>>(endPoint, data, {
            params: options?.params,
            headers: options?.headers
        });

        return response.data;
        
    } catch (error) {
        console.error(`POST request to ${endPoint} failed: `, error);
        throw error;
    }
}

const httpPut = async<TData>(endPoint: string, data: unknown, options?: ApiReqeustOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.put<ApiResponse<TData>>(endPoint, data, {
            params: options?.params,
            headers: options?.headers
        });

        return response.data;
        
    } catch (error) {
        console.error(`PUT request to ${endPoint} failed: `, error);
        throw error;
    }
}




const httpDelete = async<TData>(endPoint: string, options?: ApiReqeustOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.delete<ApiResponse<TData>>(endPoint, {
            params: options?.params,
            headers: options?.headers
        });

        return response.data;
        
    } catch (error) {
        console.error(`DELETE request to ${endPoint} failed: `, error);
        throw error;
    }   
}

const httpPatch = async<TData>(endPoint: string, data: unknown, options?: ApiReqeustOptions):Promise<ApiResponse<TData>> => {
    try {
        const instance = await axiosInstance();
        const response = await instance.patch<ApiResponse<TData>>(endPoint, data, {
            params: options?.params,
            headers: options?.headers
        });

        return response.data;
        
    } catch (error) {
        console.error(`PATCH request to ${endPoint} failed: `, error);
        throw error;
    }   
}
export const httpClient = {
    get: httpGet,
    put: httpPut,
    delete: httpDelete,
    patch: httpPatch,
    post: httpPost,
}