import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";
import decode from "jwt-decode";
import { validateUserPermissions } from "./validateUserPermissions";


type WithSSRAuthOptions= {
  permissions?: string[],
  roles?: string[]
}

export function withSSRAuth<P>(fn : GetServerSideProps<P>, options? : WithSSRAuthOptions) {
    return async (context : GetServerSidePropsContext) : Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(context);
        const token = cookies["nextAuth.token"];

        if (!token) {
          return {
            redirect: {
              destination: "/",
              permanent: false
            }
          }
        }
        
        if(options) {
          const user = decode<{permissions: string[], roles: string []}>(token);
          const {permissions, roles} = options as WithSSRAuthOptions;
  
          const userHasValidPermissions = validateUserPermissions({user, roles, permissions});

          if(!userHasValidPermissions) {
            return {
              redirect: {
                destination: "/dashboard",
                permanent: false
              }
            }
          }
        }

        return await fn(context);
    }


}