import { AxiosResponse } from "axios";
import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";
import Router from "next/router";
import {setCookie} from "nookies";

type SigniInCredentials = {
    email: string,
    password: string
}

type AuthContextData = {
    signIn(credentials: SigniInCredentials): Promise<void>;
    user: UserData,
    isAuth: boolean
}

type AuthProviderProps = {
    children: ReactNode
}

type UserData = {
    email: string,
    permissions: string[],
    roles: string[]
}

export const AuthContext = createContext({} as AuthContextData);
export function AuthProvider ({children} : AuthProviderProps) {

    const [userData, setUserData] = useState<UserData>({} as UserData);
    const isAuth = !!userData;

    async function signIn ({email, password} : SigniInCredentials) {
        try {
            const response : AxiosResponse<UserData> = await api.post("/sessions",{email, password});
            const {token, refreshToken, permissions, roles} = response.data;
            
            setCookie(undefined, "nextAuth.token", token || "", {maxAge: 60* 60 * 24 *30 });
            setCookie(undefined, "nextAuth.refreshToken", refreshToken || "", {maxAge: 60* 60 * 24 *30 });

            setUserData({
                email,
                permissions,
                roles
            } as Omit<UserData, "token" | "refreshToken">)

            Router.push("/dashboard");
            
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{user: userData, signIn, isAuth}}>
            {children}
        </AuthContext.Provider>
    )
}