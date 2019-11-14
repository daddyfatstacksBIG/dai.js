import { ServiceRoles } from '../src/constants';

import { mcdMaker } from './helpers';

let service;
let maker;

beforeAll(async () => {
  maker = await mcdMaker();
  service = maker.service(ServiceRoles.SYSTEM_DATA);
});

test('get annual base rate', async () => {
  const rate = await service.getAnnualBaseRate();
  expect(rate).toBe(0);
});

test('get system-wide debt ceiling', async () => {
  const ceiling = await service.getSystemWideDebtCeiling();
  expect(ceiling).toBe(1000000);
});

test('get global settlement status', async () => {
  const cage = await service.isGlobalSettlementInvoked();
  expect(cage).toBe(false);
});
