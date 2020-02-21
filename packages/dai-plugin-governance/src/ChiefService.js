import { LocalService } from '@makerdao/services-core';
// imports from 'reads'
import { identity, memoizeWith, nth, takeLast, uniq } from 'ramda';

import contractInfo from '../contracts/contract-info.json';

// maybe a "dai.js developer utils" package is useful?
import { CHIEF, MKR } from './utils/constants';
import { getCurrency, netIdToName } from './utils/helpers';

const chiefInfo = contractInfo.chief;

export default class ChiefService extends LocalService {
  constructor(name = 'chief') {
    super(name, ['smartContract', 'web3']);
  }

  // Writes -----------------------------------------------

  etch(addresses) {
    return this._chiefContract().etch(addresses);
  }

  lift(address) {
    return this._chiefContract().lift(address);
  }

  vote(picks) {
    if (Array.isArray(picks))
      return this._chiefContract()['vote(address[])'](picks);
    return this._chiefContract()['vote(bytes32)'](picks);
  }

  lock(amt, unit = MKR) {
    const mkrAmt = getCurrency(amt, unit).toFixed('wei');
    return this._chiefContract().lock(mkrAmt);
  }

  free(amt, unit = MKR) {
    const mkrAmt = getCurrency(amt, unit).toFixed('wei');
    return this._chiefContract().free(mkrAmt);
  }

  // Reads ------------------------------------------------

  paddedBytes32ToAddress = hex =>
    hex.length > 42 ? '0x' + takeLast(40, hex) : hex;

  // helper for when we might call getSlateAddresses with the same slate several
  // times
  memoizedGetSlateAddresses = memoizeWith(identity, this.getSlateAddresses);

  getLockLogs = async () => {
    const chiefAddress = this._chiefContract().address;
    const web3Service = this.get('web3');
    const netId = web3Service.network;
    const networkName = netIdToName(netId);
    const locks = await web3Service.getPastLogs({
      fromBlock: chiefInfo.inception_block[networkName],
      toBlock: 'latest',
      address: chiefAddress,
      topics: [chiefInfo.events.lock]
    });

    return uniq(
      locks
        .map(logObj => nth(1, logObj.topics))
        .map(this.paddedBytes32ToAddress)
    );
  };

  async getVoteTally() {
    const voters = await this.getLockLogs();

    const withDeposits = await Promise.all(
      voters.map(voter =>
        this.getNumDeposits(voter).then(deposits => ({
          address: voter,
          deposits: parseFloat(deposits)
        }))
      )
    );

    const withSlates = await Promise.all(
      withDeposits.map(addressDeposit =>
        this.getVotedSlate(addressDeposit.address).then(slate => ({
          ...addressDeposit,
          slate
        }))
      )
    );

    const withVotes = await Promise.all(
      withSlates.map(withSlate =>
        this.memoizedGetSlateAddresses(withSlate.slate).then(addresses => ({
          ...withSlate,
          votes: addresses
        }))
      )
    );

    const voteTally = {};
    for (const voteObj of withVotes) {
      for (let vote of voteObj.votes) {
        vote = vote.toLowerCase();
        if (voteTally[vote] === undefined) {
          voteTally[vote] = {
            approvals: voteObj.deposits,
            addresses: [
              { address: voteObj.address, deposits: voteObj.deposits }
            ]
          };
        } else {
          voteTally[vote].approvals += voteObj.deposits;
          voteTally[vote].addresses.push({
            address: voteObj.address,
            deposits: voteObj.deposits
          });
        }
      }
    }
    for (const [key, value] of Object.entries(voteTally)) {
      const sortedAddresses = value.addresses.sort(
        (a, b) => b.deposits - a.deposits
      );
      const approvals = voteTally[key].approvals;
      const withPercentages = sortedAddresses.map(shapedVoteObj => ({
        ...shapedVoteObj,
        percent: ((shapedVoteObj.deposits * 100) / approvals).toFixed(2)
      }));
      voteTally[key] = withPercentages;
    }
    return voteTally;
  }

  getVotedSlate(address) {
    return this._chiefContract().votes(address);
  }

  getNumDeposits(address) {
    return this._chiefContract()
      .deposits(address)
      .then(MKR.wei);
  }

  getApprovalCount(address) {
    return this._chiefContract()
      .approvals(address)
      .then(MKR.wei);
  }

  getHat() {
    return this._chiefContract().hat();
  }

  async getSlateAddresses(slateHash, i = 0) {
    try {
      return [await this._chiefContract().slates(slateHash, i)].concat(
        await this.getSlateAddresses(slateHash, i + 1)
      );
    } catch (_) {
      return [];
    }
  }

  getLockAddressLogs() {
    return new Promise((resolve, reject) => {
      this._chiefContract({ web3js: true })
        .LogNote({ sig: '0xdd467064' }, { fromBlock: 0, toBlock: 'latest' })
        .get((error, result) => {
          if (error) reject(error);
          resolve(result.map(log => log.args.guy));
        });
    });
  }

  getEtchSlateLogs() {
    return new Promise((resolve, reject) => {
      this._chiefContract({ web3js: true })
        .Etch({}, { fromBlock: 0, toBlock: 'latest' })
        .get((error, result) => {
          if (error) reject(error);
          resolve(result.map(log => log.args.slate));
        });
    });
  }

  // Internal --------------------------------------------

  _chiefContract({ web3js = false } = {}) {
    if (web3js) return this.get('smartContract').getWeb3ContractByName(CHIEF);
    return this.get('smartContract').getContractByName(CHIEF);
  }
}
