import { RequestTypes, serverRequest } from "./serverRequest";

export const deleteEndpoint = (user: string, name: string): Promise<Response> =>
    serverRequest(`api/delete-endpoint?name=${name}&user=${user}`, RequestTypes.Delete)

export const generateApiKey = (user: string): Promise<Response> =>
    serverRequest(`api/key`, RequestTypes.Post, { user });

export const getApiKey = (user: string): Promise<Response> =>
    serverRequest(`api/key?user=${user}`);

export const getEndpointsByUser = (user: string): Promise<Response> =>
    serverRequest(`api/get-endpoints?user=${user}`)

export const saveEndpoint = (payload: any): Promise<Response> =>
    serverRequest(`api/create-endpoint`, RequestTypes.Post, payload)