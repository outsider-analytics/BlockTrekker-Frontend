import { providers } from 'ethers';
import { SiweMessage } from 'siwe';

import { getEthSignInNonce } from './userApi';

const domain = window.location.host;
const origin = window.location.origin;

const createSiweMessage = async (address: string, statement: string) => {
  const res = await getEthSignInNonce();
  const nonce = await res.text();
  const message = new SiweMessage({
    domain,
    address,
    statement,
    uri: origin,
    version: '1',
    chainId: 1,
    nonce,
  });
  return message.prepareMessage();
};

export const ethSignIn = async (
  provider: providers.Web3Provider
): Promise<{ [key: string]: string }> => {
  const signer = provider.getSigner();
  const message = await createSiweMessage(
    await signer.getAddress(),
    'Sign into BlockTrekker with Ethereum'
  );
  const signature = await signer.signMessage(message);
  return { message, signature };
};
