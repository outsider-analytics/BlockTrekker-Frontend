import { RequestTypes, serverRequest } from './serverRequest';

export const addWidgetToDashboard = (
  user: string,
  // TODO: Change from any
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
  payload: any
): Promise<Response> =>
  serverRequest(`dashboard/widget/${user}`, RequestTypes.Post, payload);

export const getDashboard = (user: string): Promise<Response> =>
  serverRequest(`dashboard/${user}`);

// TODO: Change from any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const saveDashboard = (user: string, payload: any): Promise<Response> =>
  serverRequest(`dashboard/save/${user}`, RequestTypes.Post, payload);

// TODO: Change from any
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const updateTextWidget = (user: string, payload: any): Promise<Response> =>
  serverRequest(`dashboard/widget/${user}`, RequestTypes.Put, payload);

