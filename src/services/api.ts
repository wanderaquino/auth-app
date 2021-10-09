import axios, { AxiosError, AxiosResponse } from "axios";
import { parseCookies, setCookie } from "nookies";

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestsQueue = [] as any;

export const api = axios.create({
    baseURL: "http://localhost:3333/",
    headers: {
        Authorization: `Bearer ${cookies["nextAuth.token"]}`
    }
})

api.interceptors.response.use(response => {
    return response
}, (error : AxiosError) => {
    const errorResponse = error.response || {status: 401, data: {code: "token.expired"}};

        if (errorResponse.status === 401) {
            if (errorResponse.data.code === "token.expired") {
                cookies = parseCookies();

                const {"nextAuth.refreshToken" : refreshToken} = cookies;
                const originalConfig = error.config;

                if (!isRefreshing) {
                    isRefreshing = true;

                    api.post("/refresh", {refreshToken})
                    .then((response : AxiosResponse<any>)  => {
                        const { token, refreshToken } = response.data;

                        setCookie(undefined, "nextAuth.token", token , {maxAge: 60* 60 * 24 *30 });
                        setCookie(undefined, "nextAuth.refreshToken", refreshToken , {maxAge: 60* 60 * 24 *30 });

                        failedRequestsQueue.forEach((request: { onSucess: (arg0: any) => any; }) => request.onSucess(token));
                        failedRequestsQueue = [];

                    }).catch(err => {
                        failedRequestsQueue.forEach((request: { onFailure: (arg0: any) => any; }) => request.onFailure(err));
                        failedRequestsQueue = [];
                    }).finally(() => {
                        isRefreshing = false
                    })

                } else {
                    //Algo
                }

                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({
                        onSucess: (token : string ) => {
                            if (originalConfig.headers) {
                                originalConfig.headers["Authorization"] = `Bearer ${token}` as string;
                            }
                            resolve(api(originalConfig));
                        },
                        onFailure: (err : AxiosError) => {
                            reject(err);
                        }
                    })
                })
            }

        }


})