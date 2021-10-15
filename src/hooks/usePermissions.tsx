import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

interface UsePermissionParams {
    roles?: string[],
    permissions?: string[]
}

export function usePermission({roles, permissions} : UsePermissionParams) {

    const {user, isAuth} = useContext(AuthContext);
    
    if (!isAuth) {
        return false;
    }

    if(permissions !== undefined && permissions?.length > 0) {
        const hasAllPermissions = permissions.every((permission) => {
            return user.permissions.includes(permission)
        })
        if(!hasAllPermissions) {
            return false;
        }
    }


    if(roles != undefined && roles?.length > 0) {
        const hasAllRoles = roles.every((roles) => {
            return user.roles.includes(roles)
        })
        if(!hasAllRoles) {
            return false;
        }
    }

    return true;
}