import {
  restoreSnapshot,
  takeSnapshot,
  TestAccountProvider
} from '@makerdao/test-helpers';

import schemas, { PROXY_ADDRESS } from '../../src/schemas';
import { isValidAddressString } from '../../src/utils';
import { mcdMaker } from '../helpers';

let maker, snapshotData, address, address2, proxyAddress, proxyAddress2;

beforeAll(async () => {
  maker = await mcdMaker({ multicall: true });
  snapshotData = await takeSnapshot(maker);
  maker.service('multicall').createWatcher();
  maker.service('multicall').registerSchemas(schemas);
  maker.service('multicall').start();

  address = maker.service('web3').currentAddress();
  proxyAddress = await maker.service('proxy').currentProxy();
  const account = TestAccountProvider.nextAccount();
  await maker.addAccount({ ...account, type: 'privateKey' });
  maker.useAccount(account.address);
  address2 = maker.service('web3').currentAddress();
  proxyAddress2 = await maker.service('proxy').ensureProxy();
});

afterAll(async () => {
  await restoreSnapshot(snapshotData, maker);
});

test(PROXY_ADDRESS, async () => {
  const proxy1 = await maker.latest(PROXY_ADDRESS, address);
  expect(isValidAddressString(proxy1)).toEqual(true);
  expect(proxy1).toEqual(proxyAddress);

  const proxy2 = await maker.latest(PROXY_ADDRESS, address2);
  expect(isValidAddressString(proxy2)).toEqual(true);
  expect(proxy2).toEqual(proxyAddress2);
});

test.skip(`${PROXY_ADDRESS} using invalid account address`, async () => {
  expect(() => {
    maker.latest(PROXY_ADDRESS, '0xfoobar');
  }).toThrow(/invalid/i);
});

test.skip(`${PROXY_ADDRESS} using account with no proxy`, async () => {
  const promise = maker.latest(
    PROXY_ADDRESS,
    '0x1111111111111111111111111111111111111111'
  );
  await expect(promise).rejects.toThrow(/no proxy found/i);
});
