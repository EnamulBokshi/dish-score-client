"use server"

import { cookies } from "next/headers"

export const setCookie = async (name: string, value: string, expIn: number) => {
    const cookieStore = await cookies();
    cookieStore.set(name, value, { maxAge: expIn, httpOnly: true, secure: true, sameSite: "strict", path: "/" });
}


export const getCookie = async(name:string) => {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(name);
    return cookie?.value || null;
}

export const deleteCookie = async(name:string) => {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}