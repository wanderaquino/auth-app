import { GetServerSidePropsContext } from "next";
import { destroyCookie } from "nookies";
import { useContext, useEffect } from "react";
import { Can } from "../components/Can";
import {AuthContext, signOut} from "../context/AuthContext";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from '../utils/withSSRAuth';


export default function Dashboard () {
    const {user, signOut} = useContext(AuthContext);

    return (
        <>
        <h1>Dashboard!!! {user.email}</h1>

        {
            <Can permissions={user.permissions} roles={user.roles}>
                <h2>Métricas</h2>
            </Can>
        }
        <button onClick={signOut}>Sign Out</button>
        </>
    )
}

export const getServerSideProps = withSSRAuth(async (context : GetServerSidePropsContext) => {
    const apiClient = setupApiClient(context);

    try {
        const response = await apiClient.get("/me");

    } catch(error){
        destroyCookie(context, "nextAuth.token");
        destroyCookie(context, "nextAuth.refreshToken");

        return {
            redirect: {
                destination: "/",
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
})