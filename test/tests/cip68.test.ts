import { describe, expect, test } from 'vitest';
import * as cip68Utils from '../../src/cip68';
import * as fixtures from '../fixtures/cip68';

describe('cip68 utils', () => {
  fixtures.fromLabel.map(fixture => {
    test(`fromLabel: ${fixture.description}`, async () => {
      expect(cip68Utils.fromLabel(fixture.payload)).toStrictEqual(
        fixture.result,
      );
    });
  });

  fixtures.toLabel.map(fixture => {
    test(`toLabel: ${fixture.description}`, async () => {
      if (typeof fixture.result !== 'string') {
        expect(() => cip68Utils.toLabel(fixture.payload)).toThrow();
      } else {
        expect(cip68Utils.toLabel(fixture.payload)).toStrictEqual(
          fixture.result,
        );
      }
    });
  });

  fixtures.toUTF8OrHex.map(fixture => {
    test(`toUTF8OrHex: ${fixture.description}`, async () => {
      expect(cip68Utils.toUTF8OrHex(fixture.payload)).toStrictEqual(
        fixture.result,
      );
    });
  });

  fixtures.toCip68Assets.map(fixture => {
    test(`toCip68Assets: ${fixture.description}`, async () => {
      expect(cip68Utils.toCip68Assets(fixture.payload)).toStrictEqual(
        fixture.result,
      );
    });
  });

  fixtures.getReferenceNFT.map(fixture => {
    test(`getReferenceNFT: ${fixture.description}`, async () => {
      expect(cip68Utils.getReferenceNFT(fixture.payload)).toStrictEqual(
        fixture.result,
      );
    });
  });

  fixtures.getMetadataFromOutputDatum.map(fixture => {
    test(`getMetadataFromOutputDatum: ${fixture.description}`, async () => {
      expect(
        cip68Utils.getMetadataFromOutputDatum(fixture.payload, fixture.options),
      ).toStrictEqual(fixture.result);
    });
  });

  test('isValidUTF8: returns true with an empty buffer', () => {
    expect(cip68Utils.isValidUTF8(Buffer.alloc(0))).toStrictEqual(true);
  });

  test('isValidUTF8: returns true for a valid utf8 string', () => {
    expect(
      cip68Utils.isValidUTF8(
        Buffer.from('Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
      ),
    ).toStrictEqual(true);
  });

  test('isValidUTF8: returns false for an erroneous string', () => {
    const invalid = Buffer.from([
      0xce, 0xba, 0xe1, 0xbd, 0xb9, 0xcf, 0x83, 0xce, 0xbc, 0xce, 0xb5, 0xed,
      0xa0, 0x80, 0x65, 0x64, 0x69, 0x74, 0x65, 0x64,
    ]);

    expect(cip68Utils.isValidUTF8(invalid)).toStrictEqual(false);
  });

  test('isValidUTF8: returns true for valid cases from the autobahn test suite', () => {
    expect(
      cip68Utils.isValidUTF8(Buffer.from('\xf0\x90\x80\x80')),
    ).toStrictEqual(true);
    expect(
      cip68Utils.isValidUTF8(Buffer.from([0xf0, 0x90, 0x80, 0x80])),
    ).toStrictEqual(true);
  });

  test('isValidUTF8: returns false for erroneous autobahn strings', () => {
    expect(
      cip68Utils.isValidUTF8(Buffer.from([0xce, 0xba, 0xe1, 0xbd])),
    ).toStrictEqual(false);
  });
});
