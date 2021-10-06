import { AxiosResponse } from "axios";
import { createContext, ReactNode, useState } from "react";
import { api } from "../services/api";

type SigniInCredentials = {
    email: string,
    password: string
}

type AuthContextData = {
    signIn(credentials: SigniInCredentials): Promise<void>;
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

    const [userData, setUserData] = useState<UserData>();

    const isAuth = false;

    async function signIn ({email, password} : SigniInCredentials) {
        try {
            const response : AxiosResponse<UserData> = await api.post("/sessions",{email, password});
            const {permissions, roles} = response.data;

            setUserData({
                email,
                permissions,
                roles
            })

            console.log(userData);
        } catch(error) {
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{signIn, isAuth}}>
            {children}
        </AuthContext.Provider>
    )
}