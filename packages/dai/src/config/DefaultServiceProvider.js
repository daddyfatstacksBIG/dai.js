import { ServiceProvider } from '@makerdao/services-core';

import AccountsService from '../eth/AccountsService';
import AllowanceService from '../eth/AllowanceService';
import DSProxyService from '../eth/DSProxyService';
import EthereumCdpService from '../eth/EthereumCdpService';
import EthereumTokenService from '../eth/EthereumTokenService';
import GasService from '../eth/GasService';
import MulticallService from '../eth/MulticallService';
import NonceService from '../eth/NonceService';
import PriceService from '../eth/PriceService';
import SmartContractService from '../eth/SmartContractService';
import TokenConversionService from '../eth/TokenConversionService';
import TransactionManager from '../eth/TransactionManager';
import Web3Service from '../eth/Web3Service';
import CacheService from '../utils/CacheService';
import EventService from '../utils/events/EventService';
import NullEventService from '../utils/events/NullEventService';
import ConsoleLogger from '../utils/loggers/ConsoleLogger';
import NullLogger from '../utils/loggers/NullLogger';
import TimerService from '../utils/TimerService';

import { getSettings } from './index';

export const resolver = {
  defaults: {
    accounts: 'AccountsService',
    allowance: 'AllowanceService',
    cache: 'CacheService',
    cdp: 'EthereumCdpService',
    conversion: 'TokenConversionService',
    event: 'EventService',
    gas: 'GasService',
    log: 'ConsoleLogger',
    multicall: 'MulticallService',
    nonce: 'NonceService',
    price: 'PriceService',
    proxy: 'DSProxyService',
    smartContract: 'SmartContractService',
    timer: 'TimerService',
    token: 'EthereumTokenService',
    transactionManager: 'TransactionManager',
    web3: 'Web3Service'
  },
  disabled: { event: 'NullEventService', log: 'NullLogger' }
};

export default class DefaultServiceProvider extends ServiceProvider {
  constructor(config = {}) {
    if (config.web3) {
      config = {
        ...config,
        accounts: { ...config.accounts, web3: getSettings(config.web3) }
      };
    }

    super(config, {
      services: {
        AccountsService,
        AllowanceService,
        CacheService,
        ConsoleLogger,
        DSProxyService,
        EthereumCdpService,
        EthereumTokenService,
        EventService,
        GasService,
        MulticallService,
        NonceService,
        NullEventService,
        NullLogger,
        PriceService,
        SmartContractService,
        TimerService,
        TokenConversionService,
        TransactionManager,
        Web3Service
      },
      ...resolver
    });
  }
}
