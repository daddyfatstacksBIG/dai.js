import { ETH, MDAI } from '@makerdao/dai-plugin-mcd';
import { restoreSnapshot, takeSnapshot } from '@makerdao/test-helpers';

import { Migrations, ServiceRoles } from '../../src/constants';
import { migrationMaker, setupCollateral } from '../helpers';
import { globalSettlement, mockContracts } from '../helpers/mocks';

let maker, migration, smartContract, cdpManager, snapshot;

describe('Global Settlement Collateral Claims migration', () => {
  beforeAll(async () => {
    maker = await migrationMaker();

    await maker.getToken(MDAI).approveUnlimited(await maker.currentProxy());
    smartContract = maker.service('smartContract');
    cdpManager = maker.service('mcd:cdpManager');
    migration = maker
      .service(ServiceRoles.MIGRATION)
      .getMigration(Migrations.GLOBAL_SETTLEMENT_COLLATERAL_CLAIMS);
  });

  beforeEach(async () => {
    snapshot = await takeSnapshot(maker);
    jest.restoreAllMocks();
  });

  afterEach(async () => {
    await restoreSnapshot(snapshot, maker);
  });

  test('if the system is NOT in global settlement and there is no collateral, return false', async () => {
    mockContracts(smartContract, { MCD_END_1: globalSettlement.beforeCage() });

    expect(await migration.check()).toBeFalsy();
  });

  test('if the system is NOT in global settlement and there is collateral, return false', async () => {
    mockContracts(smartContract, { MCD_END_1: globalSettlement.beforeCage() });

    await setupCollateral(maker, 'ETH-A', { price: 150, debtCeiling: 50 });
    await cdpManager.openLockAndDraw('ETH-A', ETH(0.1), MDAI(1));

    expect(await migration.check()).toBeFalsy();
  });

  test('if the system IS in global settlement, but collateral is not caged, and there is no collateral, return false', async () => {
    mockContracts(smartContract, { MCD_END_1: globalSettlement.afterCage() });

    expect(await migration.check()).toBeFalsy();
  });

  test('if the system IS in global settlement, but collateral is not caged, and there is collateral, return false', async () => {
    await setupCollateral(maker, 'ETH-A', { price: 150, debtCeiling: 50 });
    await cdpManager.openLockAndDraw('ETH-A', ETH(0.1), MDAI(1));

    mockContracts(smartContract, { MCD_END_1: globalSettlement.afterCage() });

    expect(await migration.check()).toBeFalsy();
  });

  test('if the system IS in global settlement and collateral is caged, and there is no collateral, return false', async () => {
    mockContracts(smartContract, {
      MCD_END_1: globalSettlement.afterCageCollateral({ 'ETH-A': 150 })
    });

    expect(await migration.check()).toBeFalsy();
  });

  test('if the system IS in global settlement and collateral is caged, and there is NO collateral to skim, return false', async () => {
    await setupCollateral(maker, 'ETH-A', { price: 150, debtCeiling: 50 });
    await cdpManager.openLockAndDraw('ETH-A', ETH(0.1), MDAI(9));

    mockContracts(smartContract, {
      MCD_END_1: globalSettlement.afterCageCollateral({ 'ETH-A': 80 })
    });

    expect(await migration.check()).toBeFalsy();
  });

  test('if the system IS in global settlement and collateral is caged, and there IS collateral to skim, return true', async () => {
    await setupCollateral(maker, 'ETH-A', { price: 150, debtCeiling: 50 });
    await cdpManager.openLockAndDraw('ETH-A', ETH(0.1), MDAI(1));

    mockContracts(smartContract, {
      MCD_END_1: globalSettlement.afterCageCollateral({ 'ETH-A': 150 })
    });

    expect(await migration.check()).toBeTruthy();
  });
});
