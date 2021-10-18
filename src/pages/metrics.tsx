import { GetServerSidePropsContext } from "next";
import { parseCookies } from "nookies";
import { useEffect } from "react";
import decode from "jwt-decode";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from '../utils/withSSRAuth';
import { validateUserPermissions } from "../utils/validateUserPermissions";
import Router from "next/router";



export default function Metrics () {
    useEffect(() => {
        const cookies = parseCookies();
        const token = decode<{
            user: {permissions: string[], roles: string[]}, 
            roles: string[], 
            permissions: string[]}>
            (cookies["nextAuth.token"]);
        
        const userCanStayOnPage = validateUserPermissions({
            user: {
                permissions: token.permissions,
                roles: token.roles
            },
            permissions: token.permissions,
            roles: token.roles
        });

        if(!userCanStayOnPage) {
            console.log("Redirect!!!!!!!!!!!");
            Router.push("/dashboard");
        }

    }, []);
    return (
        <>
        <h1>Metrics</h1>
        </>
    )
}

export const getServerSideProps = withSSRAuth(async (context : GetServerSidePropsContext) => {
    const apiClient = setupApiClient(context);
    const response = await apiClient.get("/me");


    return {
            props: {}
        }
    }, {
        permissions: ["metrics.list"],
        roles: ["administrator"]
    }
)