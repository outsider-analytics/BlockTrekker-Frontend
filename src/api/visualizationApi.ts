import { RequestTypes, serverRequest } from './serverRequest';

export const getVisualizationNames = async (user: string): Promise<Response> =>
  serverRequest(`visualization/names?user=${user}`);

export const saveVisualization = async (
  queryId: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  payload: any // TODO: Change from any
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
