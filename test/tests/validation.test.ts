import { expect, describe, test } from 'vitest';
import * as validationUtils from '../../src/validation';
import * as fixtures from './__fixtures__/validation';

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

      expect(result).toBe(fixture.result);
    });
  });
});
