import { RequestTypes, serverRequest } from './serverRequest';

export const downloadResults = async (
  id: string,
  type: string
): Promise<Response> => serverRequest(`query/download/${id}/?type=${type}`);

// TODO: Change from any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const executeQuery = async (payload: any): Promise<Response> =>
  serverRequest('query/execute', RequestTypes.Post, payload);

// TODO: Change from any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const executeWithDryRun = async (payload: any): Promise<Response> =>
  serverRequest(`query/dry-run`, RequestTypes.Post, payload);

export const getAllQueries = async (): Promise<Response> =>
  serverRequest(`query/all`);

export const getPublicDatasets = async (): Promise<Response> =>
  serverRequest(`query/datasets`);

export const getQuery = async (id: string): Promise<Response> =>
  serverRequest(`query?id=${id}`);

export const getTableColumns = async (
  dataset: string,
  table: string
): Promise<Response> =>
  serverRequest(`query/columns?table=${table}&dataset=${dataset}`);

export const getTables = async (): Promise<Response> =>
  serverRequest('query/tables');

// TODO: Change from any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const saveQuery = async (payload: any): Promise<Response> =>
  serverRequest('query/save', RequestTypes.Post, payload);
