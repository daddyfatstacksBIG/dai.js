import cat from './cat';
import cdpManager from './cdpManager';
import computed from './computed';
import getCdps from './getCdps';
import jug from './jug';
import pot from './pot';
import proxyRegistry from './proxyRegistry';
import spot from './spot';
import token from './token';
import vat from './vat';

export * from './_constants';
export default {
  ...vat,
  ...spot,
  ...proxyRegistry,
  ...cdpManager,
  ...jug,
  ...pot,
  ...cat,
  ...computed,
  ...token,
  ...getCdps
};

/*
 * Notes on structure:
 *
 * Base schemas, those which make a basic function call, such as vat.debt
 * should be stored in a file under the name of the contract which is to
 * be called from. In this case vat.js
 *
 * Naming of base observable schemas should follow the template of
 * camelCasing the contract name and function call. So following the
 * example of vat.debt, the resulting schema should be an exported
 * constant, vatDebt
 *
 * All observable keys should be located in the constants.js file.
 * For base observables, there could be 1 or more return values
 * using these constant names.
 *
 * For computed observables, the observable keys should match the name of
 * the exported constant. Using 'ilkPrices' as an example, the exported
 * constant will be ilkPrices, the corresponding constant key to match it
 * will be ILK_PRICES = 'ilkPrices'.
 *
 * In the majority of cases, computed observables should exist under
 * computed.js, especially if they are intending to compose calls to multiple
 * functions from multiple contracts.
 *
 * The exception to this is for instances where a computed observable has a
 * relationship with base observable(s) from a single contract such that a
 * untransformed and transformed value can be present within the api. An example
 * to better illustrate this is rawLiquidationRatio which returns a number value
 * and liquidationRatio which returns a currencyRatio object for that number
 * value. The baseObservable return value key should be prepended with "raw"
 * to strongly indicate we are getting a chain value. The computed key should
 * map to what the base observable key would be named should it not exist,
 * hence liquidationRatio. Both of the schemas for these should exist in the
 * file for the base observable, spot.js in this case.
 *
 */
