import { expect, describe, test } from 'vitest';
import * as validationUtils from '../../src/validation';
import * as fixtures from '../fixtures/validation';

describe('validation utils', () => {
  fixtures.detectAndValidateAddressType.map(fixture => {
    test(`detectAndValidateAddressType ${fixture.description}`, async () => {
      const result = validationUtils.detectAndValidateAddressType(
        fixture.input,
        fixture.network,
      );
      expect(result).toBe(fixture.result);
    });
  });
  fixtures.paymentCredFromBech32Address.map(fixture => {
    test(`paymentCredFromBech32Address ${fixture.description}`, async () => {
      const result = validationUtils.paymentCredFromBech32Address(
        fixture.input,
      );
      expect(result).toStrictEqual(fixture.result);
    });
  });
  fixtures.validateAndConvertPool.map(fixture => {
    test(`validateAndConvertPool ${fixture.description}`, async () => {
      const result = validationUtils.validateAndConvertPool(fixture.input);
      if (fixture.result) {
        expect(result).toMatchObject(fixture.result);
      } else {
        expect(result).toBe(fixture.result);
      }
    });
  });
  fixtures.paymentCredToBech32Address.map(fixture => {
    test(`validateAndConvertPool ${fixture.description}`, async () => {
      const result = validationUtils.paymentCredToBech32Address(
        fixture.input,
        // @ts-expect-error string doesn't match string literal
        fixture.prefix,
      );
      expect(result).toMatchObject(fixture.result);
    });
  });
  fixtures.validateStakeAddress.map(fixture => {
    test(`validateStakeAddress ${fixture.description}`, async () => {
      const result = validationUtils.validateStakeAddress(
        fixture.input,
        fixture.network,
      );
      expect(result).toBe(fixture.result);
    });
  });
  fixtures.convertStakeAddress.map(fixture => {
    test(`convertStakeAddress ${fixture.description}`, async () => {
      const result = validationUtils.convertStakeAddress(
        fixture.input,
        fixture.network,
      );
      expect(result).toBe(fixture.result);
    });
  });
  fixtures.validateBlockHash.map(fixture => {
    test(`convertStakeAddress ${fixture.description}`, async () => {
      const result = validationUtils.validateBlockHash(fixture.input);
      expect(result).toBe(fixture.result);
    });
  });
  fixtures.validateDerivationXpub.map(fixture => {
    test(`convertStakvalidateDerivationXpubeAddress ${fixture.description}`, async () => {
      const result = validationUtils.validateDerivationXpub(fixture.input);
      expect(result).toBe(fixture.result);
    });
  });
  fixtures.validateInRangeUnsignedInt.map(fixture => {
    test(`validateInRangeUnsignedInt ${fixture.description}`, async () => {
      const result = validationUtils.validateInRangeUnsignedInt(fixture.input);
      expect(result).toBe(fixture.result);
    });
  });
  fixtures.validatePositiveInRangeSignedInt.map(fixture => {
    test(`validatePositiveInRangeSignedInt ${fixture.description}`, async () => {
      const result = validationUtils.validatePositiveInRangeSignedInt(
        fixture.input,
      );
      expect(result).toBe(fixture.result);
    });
  });
  fixtures.validatePositiveInRangeSignedBigInt.map(fixture => {
    test(`validatePositiveInRangeSignedBigInt ${fixture.description}`, async () => {
      const result = validationUtils.validatePositiveInRangeSignedBigInt(
        fixture.input,
      );
      expect(result).toBe(fixture.result);
    });
  });
  fixtures.isNumber.map(fixture => {
    test(`isNumber ${fixture.description}`, async () => {
      const result = validationUtils.isNumber(fixture.input);
      expect(result).toBe(fixture.result);
    });
  });
  fixtures.validateHex.map(fixture => {
    test(`validateHex ${fixture.description}`, async () => {
      const result = validationUtils.validateHex(fixture.input);
      expect(result).toBe(fixture.result);
    });
  });
  fixtures.getAddressTypeAndPaymentCred.map(fixture => {
    test(`getAddressTypeAndPaymentCred ${fixture.description}`, async () => {
      const result = validationUtils.getAddressTypeAndPaymentCred(
        fixture.address,
        fixture.network,
      );
      expect(result).toStrictEqual(fixture.result);
    });
  });
  fixtures.validatePolicy.map(fixture => {
    test(`validatePolicy ${fixture.description}`, async () => {
      const result = validationUtils.validatePolicy(fixture.input);
      expect(result).toStrictEqual(fixture.result);
    });
  });
  fixtures.validateAsset.map(fixture => {
    test(`validateAsset ${fixture.description}`, async () => {
      const result = validationUtils.validateAsset(fixture.input);
      expect(result).toStrictEqual(fixture.result);
    });
  });
});
