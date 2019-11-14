import TestAccountProvider from '@makerdao/test-helpers/src/TestAccountProvider';

import { ETH } from '../../src/eth/Currency';

export function createOutOfEthTransaction(tokenService) {
  const eth = tokenService.getToken(ETH);
  return eth.transfer(TestAccountProvider.nextAddress(), 20000);
}
