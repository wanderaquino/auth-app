import { AxiosResponse } from "axios";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/apiClient";
import Router from "next/router";
import {destroyCookie, parseCookies, setCookie} from "nookies";

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
    token?: string,
    refreshToken?: string,
    email: string,
    permissions: string[],
    roles: string[]
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
    destroyCookie(undefined, "nextAuth.token");
    destroyCookie(undefined, "nextAuth.refreshToken");
    Router.push("/");
};

export function AuthProvider ({children} : AuthProviderProps) {

    useEffect(() => {
        const cookies = parseCookies();
        const {"nextAuth.token" : token} = cookies;

        if (token) {
            api.get("/me").then(response => {
                const {email, permissions, roles} = response.data;
                setUserData({email, permissions, roles} as Omit<UserData, "token" | "refreshToken">);
            }).catch(() => {
                signOut();
            })
        }
    }, []);

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

            if (api.defaults.headers){
                api.defaults.headers["Authorization"] = `Bearer ${token}`
            };
            
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