import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { validateUserPermissions } from "../utils/validateUserPermissions";

interface UsePermissionParams {
    roles?: string[],
    permissions?: string[]
}

export function usePermission({roles, permissions} : UsePermissionParams) {

    const {user, isAuth} = useContext(AuthContext);
    
    if (!isAuth) {
        return false;
    }

    const userHasValidPermissions = validateUserPermissions({user, roles, permissions});

    return userHasValidPermissions;
}