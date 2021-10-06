import { AxiosResponse } from "axios";
import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";
import Router from "next/router";

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
            const {permissions, roles} = response.data;

            setUserData({
                email,
                permissions,
                roles
            })

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