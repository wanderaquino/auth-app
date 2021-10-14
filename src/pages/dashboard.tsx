import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useContext } from "react";
import {AuthContext} from "../context/AuthContext";
import { setupApiClient } from "../services/api";
import { AuthTokenError } from "../services/errors/AuthTokenError";
import { withSSRAuth } from '../utils/withSSRAuth';


export default function Dashboard () {
    const {user} = useContext(AuthContext);

    return (
        <h1>Dashboard!!! {user.email}</h1>
    )
}

export const getServerSideProps : GetServerSideProps = withSSRAuth(async (context : GetServerSidePropsContext) => {
    const apiClient = setupApiClient(context)
    try {
    const response = await apiClient.get("/me");

    } catch(error){
        console.log(error instanceof AuthTokenError)
    }

    return {
        props: {}
    }
})