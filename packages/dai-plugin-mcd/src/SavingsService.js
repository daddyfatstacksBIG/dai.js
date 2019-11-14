import {PublicService} from '@makerdao/services-core';
import BigNumber from 'bignumber.js';

import {ServiceRoles} from './constants';
import {RAD, RAY, SECONDS_PER_YEAR, WAD} from './constants';
import {MDAI} from './index';
import tracksTransactions from './utils/tracksTransactions';

export default class SavingsService extends PublicService {
  constructor(name = ServiceRoles.SAVINGS) {
    super(name,
          [ 'smartContract', 'proxy', 'accounts', ServiceRoles.SYSTEM_DATA ]);
  }

  @tracksTransactions
  async join(amountInDai, {promise}) {
    await this.get('proxy').ensureProxy();

    return this._proxyActions.join(this._daiAdapterAddress, this._pot.address,
                                   amountInDai.toFixed('wei'),
                                   {dsProxy : true, promise});
  }

  @tracksTransactions
  async exit(amountInDai, {promise}) {
    await this.get('proxy').ensureProxy();

    return this._proxyActions.exit(this._daiAdapterAddress, this._pot.address,
                                   amountInDai.toFixed('wei'),
                                   {dsProxy : true, promise});
  }

  @tracksTransactions
  async exitAll({promise}) {
    await this.get('proxy').ensureProxy();

    return this._proxyActions.exitAll(
        this._daiAdapterAddress, this._pot.address, {dsProxy : true, promise});
  }

  async balance() {
    const proxy = await this.get('proxy').currentProxy();

    return proxy ? this.balanceOf(proxy) : MDAI(0);
  }

  async balanceOf(guy) {
    const slice = new BigNumber(await this._pot.pie(guy)).div(WAD);
    const totalPie = new BigNumber(await this._pot.Pie()).div(WAD);

    const portion = totalPie.eq(0) ? totalPie : slice.div(totalPie);

    const daiInPot = new BigNumber(await this.get('smartContract')
                                       .getContract('MCD_VAT')
                                       .dai(this._pot.address))
                         .div(RAD);

    return MDAI(daiInPot.times(portion));
  }

  async getTotalDai() {
    const totalPie = new BigNumber(await this._pot.Pie()).div(WAD);
    const chi = await this.chi();

    return MDAI(totalPie.times(chi));
  }

  async getYearlyRate() {
    const dsr = new BigNumber(await this._pot.dsr()).div(RAY);

    return dsr.pow(SECONDS_PER_YEAR);
  }

  async chi() { return new BigNumber(await this._pot.chi()).div(RAY); }

  get _proxyActions() {
    return this.get('smartContract').getContract('PROXY_ACTIONS_DSR');
  }

  get _pot() { return this.get('smartContract').getContract('MCD_POT'); }

  get _daiAdapterAddress() {
    return this.get(ServiceRoles.SYSTEM_DATA).adapterAddress('DAI');
  }
}
