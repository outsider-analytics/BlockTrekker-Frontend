import { RequestTypes, serverRequest } from './serverRequest';

export const connectUser = async (user: string): Promise<Response> =>
  await serverRequest('user/connect', RequestTypes.Post, { user });
