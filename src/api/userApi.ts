import { RequestTypes, serverRequest } from './serverRequest';
import { ConnectUserPayload } from './types';

export const connectUser = async (
  payload: ConnectUserPayload
): Promise<Response> =>
  await serverRequest('user/connect', RequestTypes.Post, payload);

export const disconnectUser = async (): Promise<Response> =>
  await serverRequest('user/disconnect', RequestTypes.Delete);

export const getEthSignInNonce = async (): Promise<Response> =>
  await serverRequest('user/nonce', RequestTypes.Get);

export const reconnectUser = async (): Promise<Response> =>
  await serverRequest('user/reconnect', RequestTypes.Get);
