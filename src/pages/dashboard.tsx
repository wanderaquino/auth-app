import { GetServerSidePropsContext } from "next";
import { destroyCookie } from "nookies";
import { useContext } from "react";
import { Can } from "../components/Can";
import {AuthContext} from "../context/AuthContext";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from '../utils/withSSRAuth';


export default function Dashboard () {
    const {user} = useContext(AuthContext);

    return (
        <>
        <h1>Dashboard!!! {user.email}</h1>

        {
            <Can permissions={["metrics.list"]}>
                <h2>Métricas</h2>
            </Can>
        }
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