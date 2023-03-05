import { RequestTypes, serverRequest } from "./serverRequest";

export const downloadResults = async (id: string, type: string, user: string): Promise<Response> =>
    serverRequest(`query/download/${id}/?type=${type}&user=${user}`)

export const executeQuery = async (payload: any): Promise<Response> =>
    serverRequest('query/execute', RequestTypes.Post, payload);

export const executeWithDryRun = async (payload: any): Promise<Response> =>
    serverRequest(`query/dry-run`, RequestTypes.Post, payload)

export const getAllQueries = async (user: string): Promise<Response> =>
    serverRequest(`query/all?user=${user}`);

export const getPublicDatasets = async (): Promise<Response> =>
    serverRequest(`query/datasets`);

export const getQuery = async (id: string): Promise<Response> =>
    serverRequest(`query?id=${id}`);

export const getTableColumns = async (dataset: string, table: string): Promise<Response> =>
    serverRequest(`query/columns?table=${table}&dataset=${dataset}`);

export const getTables = async (user: string): Promise<Response> =>
    serverRequest(`query/tables?user=${user}`);

export const saveQuery = async (payload: any): Promise<Response> =>
    serverRequest('query/save', RequestTypes.Post, payload);