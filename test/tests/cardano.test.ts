import { expect, describe, test } from 'vitest';
import * as cardanoUtils from '../../src/cardano';
import stream from 'stream';
import * as fastifyUtils from '../../src/fastify';
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

describe('fastify utils', () => {
  test('returns a string from a readable stream', async () => {
    const payload = 'hello world';
    const payloadStream = new stream.Readable({
      read() {
        this.push(payload);
        this.push(null);
      },
    });
    const result = await fastifyUtils.convertStreamToString(payloadStream);

    expect(result).toBe(payload);
  });

  test('returns the original string payload', async () => {
    const payload = 'hello world';
    const result = await fastifyUtils.convertStreamToString(payload);

    expect(result).toBe(payload);
  });
});
