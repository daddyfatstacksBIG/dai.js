// usage:
// > node_modules/.bin/babel-node scripts/fundTestAccount.js <address>

import map from 'lodash/map';
import uniq from 'lodash/uniq';
import { isAddress } from 'web3-utils';

import McdPlugin from '../packages/dai-plugin-mcd/src';
import Maker from '../packages/dai/src';

const amount = 5;

async function main() {
  const maker = await Maker.create('test', {
    plugins: [McdPlugin],
    log: false
  });
  const address = process.argv[process.argv.length - 1];
  if (!isAddress(address)) {
    console.log('Pass a valid address as the last argument.');
    return;
  }
  console.log(`Sending to ${address}`);
  const { cdpTypes } = maker.service('mcd:cdpType');
  const currencies = uniq(map(cdpTypes, 'currency'));

  for (let cur of currencies) {
    process.stdout.write(`Sending ${amount} ${cur.symbol}... `);
    await maker.getToken(cur).transfer(address, amount);
    console.log('done');
  }
}

(async fn => {
  try {
    await fn();
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})(main);
