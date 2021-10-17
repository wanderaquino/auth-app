import { GetServerSidePropsContext } from "next";
import { setupApiClient } from "../services/api";
import { withSSRAuth } from '../utils/withSSRAuth';



export default function Metrics () {
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