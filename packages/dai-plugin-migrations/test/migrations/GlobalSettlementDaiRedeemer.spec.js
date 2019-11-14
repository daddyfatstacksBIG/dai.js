import {ETH, MDAI} from '@makerdao/dai-plugin-mcd';
import {restoreSnapshot, takeSnapshot} from '@makerdao/test-helpers';
import TestAccountProvider from
    '@makerdao/test-helpers/src/TestAccountProvider';

import {Migrations, ServiceRoles} from '../../src/constants';
import {migrationMaker, setupCollateral} from '../helpers';
import {globalSettlement, mockContracts} from '../helpers/mocks';

let maker, migration, smartContract, cdpManager, snapshot;

describe('Global Settlement Dai Redeemer migration', () => {
  beforeAll(async () => {
    maker = await migrationMaker();

    await maker.getToken(MDAI).approveUnlimited(await maker.currentProxy());
    smartContract = maker.service('smartContract');
    cdpManager = maker.service('mcd:cdpManager');
    migration = maker.service(ServiceRoles.MIGRATION)
                    .getMigration(Migrations.GLOBAL_SETTLEMENT_DAI_REDEEMER);
  });

  beforeEach(async () => {
    snapshot = await takeSnapshot(maker);
    jest.restoreAllMocks();
  });

  afterEach(async () => { await restoreSnapshot(snapshot, maker); });

  test('if the system is NOT in global settlement, return false', async () => {
    mockContracts(smartContract, {MCD_END_1 : globalSettlement.beforeCage()});

    expect(await migration.check()).toBeFalsy();
  });

  test(
      'if the system is in global settlement but collateral price has not been fixed, return false',
      async () => {
        mockContracts(smartContract,
                      {MCD_END_1 : globalSettlement.afterCage()});

        expect(await migration.check()).toBeFalsy();
      });

  test(
      'if the system is in global settlement, user owns some DAI, but collateral price has not been fixed, return false',
      async () => {
        await setupCollateral(maker, 'ETH-A', {price : 150, debtCeiling : 50});
        await cdpManager.openLockAndDraw('ETH-A', ETH(0.1), MDAI(9));

        mockContracts(smartContract,
                      {MCD_END_1 : globalSettlement.afterCage()});

        expect(await migration.check()).toBeFalsy();
      });

  test(
      'if the system IS in global settlement, collateral price has been fixed, BUT user does not own any DAI return false',
      async () => {
        mockContracts(smartContract,
                      {MCD_END_1 : globalSettlement.afterFlow({'ETH-A' : 10})});

        expect(await migration.check()).toBeFalsy();
      });

  test(
      'if the system IS in global settlement, collateral price has been fixed, the user owns DAI, and the user has locked collateral, return true',
      async () => {
        await setupCollateral(maker, 'ETH-A', {price : 150, debtCeiling : 50});
        await cdpManager.openLockAndDraw('ETH-A', ETH(0.1), MDAI(9));

        mockContracts(smartContract,
                      {MCD_END_1 : globalSettlement.afterFlow({'ETH-A' : 10})});

        expect(await migration.check()).toBeTruthy();
      });

  test(
      'if the system IS in global settlement, collateral price has been fixed, the user owns DAI, but the user does NOT have locked collateral, return false',
      async () => {
        await setupCollateral(maker, 'ETH-A', {price : 150, debtCeiling : 50});
        await cdpManager.openLockAndDraw('ETH-A', ETH(0.1), MDAI(9));

        const account2 = TestAccountProvider.nextAccount();

        const mdai = maker.service('token').getToken(MDAI);
        await mdai.transfer(account2.address, 9);

        await maker.addAccount({...account2, type : 'privateKey'});
        maker.useAccount(account2.address);
        expect((await mdai.balance()).toNumber()).toBe(9);

        mockContracts(smartContract,
                      {MCD_END_1 : globalSettlement.afterFlow({'ETH-A' : 10})});

        expect(await migration.check()).toBeFalsy();
      });
});
