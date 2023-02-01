import { expect, describe, test } from 'vitest';
import * as cardanoUtils from '../../src/cardano';
import * as fixtures from '../fixtures/cardano';

describe('cardano utils', () => {
  fixtures.getPaymentPartBech32.map(fixture => {
    test(`getPaymentPartBech32 ${fixture.description}`, async () => {
      const result = cardanoUtils.getPaymentPartBech32(fixture.paymentCred, {
        includeBech32Checksum: false,
        addressType: fixture.addressType,
        network: fixture.network,
        // includeHeader: fixture.includeHeader,
      });

      expect(result).toStrictEqual(fixture.result);
    });
  });
});
