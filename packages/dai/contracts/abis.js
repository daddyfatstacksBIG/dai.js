import dsChief from './abis/DSChief.json';
import dsGuard from './abis/DSGuard.json';
import dsProxy from './abis/DSProxy.json';
import dsProxyFactory from './abis/DSProxyFactory.json';
import dsSpell from './abis/DSSpell.json';
import dsSpellBook from './abis/DSSpellBook.json';
import dsValue from './abis/DSValue.json';
import erc20 from './abis/ERC20.json';
import pit from './abis/GemPit.json';
import makerOtc from './abis/MatchingMarket.json';
import multicall from './abis/Multicall.json';
import oasisProxy from './abis/ProxyCreationAndExecute.json';
import proxyRegistry from './abis/ProxyRegistry.json';
import mom from './abis/SaiMom.json';
import saiProxy from './abis/SaiProxyCreateAndExecute.json';
import tap from './abis/SaiTap.json';
import saiTop from './abis/SaiTop.json';
import tub from './abis/SaiTub.json';
import vox from './abis/SaiVox.json';
import dsEthToken from './abis/WETH9.json';

const daiV1 = {
  saiTop,
  tub,
  tap,
  vox,
  mom,
  pit
};

const dappHub = {
  dsValue,
  dsEthToken,
  dsGuard,
  dsChief,
  dsSpell,
  dsSpellBook,
  dsProxy
};

const exchangesV1 = {makerOtc};

const general = {erc20};

const proxies = {
  oasisProxy,
  saiProxy,
  dsProxyFactory,
  proxyRegistry
};

export {daiV1, dappHub, exchangesV1, general, proxies, multicall};
