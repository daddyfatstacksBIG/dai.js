import {restoreSnapshot, takeSnapshot} from '@makerdao/test-helpers';

import Web3ServiceList from '../src/utils/Web3ServiceList';

beforeEach(() => { jest.setTimeout(10000); });

afterEach(() => { return Web3ServiceList.disconnectAll(); });

let snapshotData;

beforeAll(async () => { snapshotData = await takeSnapshot(); });

afterAll(async () => { await restoreSnapshot(snapshotData); });
