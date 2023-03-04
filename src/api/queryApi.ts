import { RequestTypes, serverRequest } from "./serverRequest";

export const downloadResults = async (id: string, type: string): Promise<Response> =>
    serverRequest(`query/download/${id}/?type=${type}`)

export const executeQuery = async (payload: any): Promise<Response> =>
    serverRequest('query/execute', RequestTypes.Post, payload);

export const getAllQueries = async (user: string): Promise<Response> =>
    serverRequest(`query/all?user=${user}`);

export const getQuery = async (id: string): Promise<Response> =>
    serverRequest(`query?id=${id}`);

export const getTables = async (user: string): Promise<Response> =>
    serverRequest(`query/tables?user=${user}`);

export const saveQuery = async (payload: any): Promise<Response> =>
    serverRequest('query/save', RequestTypes.Post, payload);