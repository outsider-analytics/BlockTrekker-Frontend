import { RequestTypes, serverRequest } from './serverRequest';

export const addWidgetToDashboard = (
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  payload: any
): Promise<Response> =>
  serverRequest('dashboard/widget', RequestTypes.Post, payload);

export const getDashboard = (): Promise<Response> => serverRequest('dashboard');

// TODO: Change from any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const saveDashboard = (payload: any): Promise<Response> =>
  serverRequest('dashboard/save', RequestTypes.Post, payload);

export const updateTextWidget = (
  user: string,
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  payload: any
): Promise<Response> =>
  serverRequest(`dashboard/widget/${user}`, RequestTypes.Put, payload);
