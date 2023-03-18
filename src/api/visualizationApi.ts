import { RequestTypes, serverRequest } from './serverRequest';

export const getVisualizationNames = async (user: string): Promise<Response> =>
  serverRequest(`visualization/names?user=${user}`);

export const saveVisualization = async (
  queryId: string,
  payload: any
): Promise<Response> =>
  serverRequest(`visualization/save/${queryId}`, RequestTypes.Post, payload);

export const removeVisualization = async (
  queryId: string,
  vizPos: number
): Promise<Response> =>
  serverRequest(
    `visualization/remove?queryId=${queryId}&vizPos=${vizPos}`,
    RequestTypes.Delete
  );
