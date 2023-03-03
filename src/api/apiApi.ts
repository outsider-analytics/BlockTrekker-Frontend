import { RequestTypes, serverRequest } from "./serverRequest";

export const generateApiKey = (user: string): Promise<Response> =>
    serverRequest(`api/key`, RequestTypes.Post, { user });


export const getApiKey = (user: string): Promise<Response> =>
    serverRequest(`api/key?user=${user}`);