import { RequestTypes, serverRequest } from './serverRequest';

export const addWidgetToDashboard = (
  user: string,
  payload: any
): Promise<Response> =>
  serverRequest(`dashboard/widget/${user}`, RequestTypes.Post, payload);

export const getDashboard = (user: string): Promise<Response> =>
  serverRequest(`dashboard/${user}`);

export const saveDashboard = (user: string, payload: any): Promise<Response> =>
  serverRequest(`dashboard/save/${user}`, RequestTypes.Post, payload);
