import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useContext } from "react";
import {AuthContext} from "../context/AuthContext";
import { withSSRAuth } from '../utils/withSSRAuth';


export default function Dashboard () {
    const {user} = useContext(AuthContext);

    return (
        <h1>Dashboard!!! {user.email}</h1>
    )
}

export const getServerSideProps : GetServerSideProps = withSSRAuth(async (context : GetServerSidePropsContext) =>{
    return {
        props: {}
    }
})