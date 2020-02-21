import BigNumber from 'bignumber.js';

import { parseWeiNumeric } from '../src/utils';

test('parseWeiNumeric', () => {
  expect(typeof parseWeiNumeric(1)).toBe('string');
  expect(typeof parseWeiNumeric('1')).toBe('string');
  expect(typeof parseWeiNumeric(BigNumber('1'))).toBe('string');
  expect(parseWeiNumeric('1e18')).toBe('1');
  expect(parseWeiNumeric('1e0', 'wei')).toBe('1');
});
