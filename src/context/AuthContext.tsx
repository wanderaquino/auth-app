import { createContext, ReactNode } from "react";

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

export const AuthContext = createContext({} as AuthContextData);
export function AuthProvider ({children} : AuthProviderProps) {
    const isAuth = false;

    async function signIn ({email, password} : SigniInCredentials) {
        console.log({email, password});
    }

    return (
        <AuthContext.Provider value={{signIn, isAuth}}>
            {children}
        </AuthContext.Provider>
    )
}