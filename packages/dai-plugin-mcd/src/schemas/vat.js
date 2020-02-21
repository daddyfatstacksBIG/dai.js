import { MDAI } from '../..';
import { fromRad, fromRay, fromWei, toHex } from '../utils';

import {
  DEBT_CEILING,
  DEBT_FLOOR,
  DEBT_SCALING_FACTOR,
  ENCUMBERED_COLLATERAL,
  ENCUMBERED_DEBT,
  GLOBAL_DEBT_CEILING,
  PRICE_WITH_SAFETY_MARGIN,
  TOTAL_DAI_SUPPLY,
  TOTAL_ENCUMBERED_DEBT,
  UNLOCKED_COLLATERAL
} from './_constants';

export const vatIlks = {
  generate: ilkName => ({
    id: `MCD_VAT.ilks(${ilkName})`,
    contract: 'MCD_VAT',
    call: [
      'ilks(bytes32)(uint256,uint256,uint256,uint256,uint256)',
      toHex(ilkName)
    ]
  }),
  returns: [
    [TOTAL_ENCUMBERED_DEBT, fromWei],
    [DEBT_SCALING_FACTOR, fromRay],
    [PRICE_WITH_SAFETY_MARGIN, fromRay],
    [DEBT_CEILING, v => MDAI(v, 'rad')],
    [DEBT_FLOOR, fromRad]
  ]
};

export const vatDebt = {
  generate: () => ({
    id: 'MCD_VAT.debt()',
    contract: 'MCD_VAT',
    call: ['debt()(uint256)']
  }),
  returns: [[TOTAL_DAI_SUPPLY, v => MDAI(v, 'rad')]]
};

export const vatUrns = {
  generate: (ilkName, urn) => ({
    id: `MCD_Vat.urns(${ilkName},${urn})`,
    contract: 'MCD_VAT',
    call: ['urns(bytes32,address)(uint256,uint256)', toHex(ilkName), urn]
  }),
  returns: [
    [ENCUMBERED_COLLATERAL, fromWei],
    [ENCUMBERED_DEBT, fromWei]
  ]
};

export const vatGem = {
  generate: (ilkName, urn) => ({
    id: `MCD_Vat.gem(${ilkName},${urn})`,
    contract: 'MCD_VAT',
    call: ['gem(bytes32,address)(uint)', toHex(ilkName), urn]
  }),
  return: [UNLOCKED_COLLATERAL, fromWei]
};

export const vatLine = {
  generate: () => ({
    id: 'MCD_VAT.Line',
    contract: 'MCD_VAT',
    call: ['Line()(uint256)']
  }),
  returns: [[GLOBAL_DEBT_CEILING, v => MDAI(v, 'rad')]]
};

export default { vatIlks, vatDebt, vatUrns, vatGem, vatLine };
