type ValidateUserPermissions = {
    user: User;
    permissions?: string[],
    roles?: string[]
}

type User = {
    permissions: string[],
    roles: string[]
}

export function validateUserPermissions({
    user,
    permissions,
    roles
} : ValidateUserPermissions) {
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