import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import crc8 from 'crc/crc8';
import cbor from 'cbor';

const ASSET_NAME_LABELS = {
  reference_nft: 100, // Reference NFT locked at a script containing the datum
  nft: 222, // NFT hold by the user's wallet making use of CIP-0025 inner structure
  ft: 333, // FT hold by the user's wallet making use of Cardano foundation off-chain registry inner structure
  rft: 444, // RFT hold by the user's wallet making use of the union of CIP-0025 inner structure AND the Cardano foundation off-chain registry inner structure
} as const;

export interface ReferenceMetadataDatum {
  metadata: Record<string, unknown>;
  version: number;
  extra: string | undefined;
}

type PropertyScheme = {
  type: 'bytestring' | 'number' | 'array';
  optional?: boolean;
  items?: Record<string, PropertyScheme>;
};

type PropertyName = string;
type MetadataScheme = Record<PropertyName, PropertyScheme>;
type TokenStandard = 'ft' | 'nft' | 'rft';

const METADATA_SCHEME_MAP: Record<TokenStandard, MetadataScheme> = {
  ft: {
    name: {
      type: 'bytestring',
    },
    description: {
      type: 'bytestring',
    },
    ticker: {
      type: 'bytestring',
      optional: true,
    },
    url: {
      type: 'bytestring',
      optional: true,
    },
    logo: {
      type: 'bytestring',
      optional: true,
    },
    decimals: {
      type: 'number',
      optional: true,
    },
  },
  nft: {
    name: {
      type: 'bytestring',
    },
    image: {
      type: 'bytestring',
    },
    mediaType: {
      type: 'bytestring',
      optional: true,
    },
    description: {
      type: 'bytestring',
      optional: true,
    },
    files: {
      type: 'array',
      optional: true,
      items: {
        name: {
          type: 'bytestring',
          optional: true,
        },
        mediaType: {
          type: 'bytestring',
        },
        src: {
          type: 'bytestring',
        },
      },
    },
  },
  rft: {
    name: {
      type: 'bytestring',
    },
    image: {
      type: 'bytestring',
    },
    mediaType: {
      type: 'bytestring',
      optional: true,
    },
    description: {
      type: 'bytestring',
      optional: true,
    },
    decimals: {
      type: 'number',
      optional: true,
    },
    files: {
      type: 'array',
      optional: true,
      items: {
        name: {
          type: 'bytestring',
          optional: true,
        },
        mediaType: {
          type: 'bytestring',
        },
        src: {
          type: 'bytestring',
        },
      },
    },
  },
};

/**
 * https://github.com/websockets/utf-8-validate/blob/master/fallback.js
 * Checks if a given buffer contains only correct UTF-8.
 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
 * Markus Kuhn.
 *
 * @param {Buffer} buf The buffer to check
 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
 * @public
 */
export const isValidUTF8 = (buf: Buffer) => {
  const len = buf.length;
  let i = 0;

  while (i < len) {
    if ((buf[i] & 0x80) === 0x00) {
      // 0xxxxxxx
      i++;
    } else if ((buf[i] & 0xe0) === 0xc0) {
      // 110xxxxx 10xxxxxx
      if (
        i + 1 === len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i] & 0xfe) === 0xc0 // overlong
      ) {
        return false;
      }

      i += 2;
    } else if ((buf[i] & 0xf0) === 0xe0) {
      // 1110xxxx 10xxxxxx 10xxxxxx
      if (
        i + 2 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // overlong
        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // surrogate (U+D800 - U+DFFF)
      ) {
        return false;
      }

      i += 3;
    } else if ((buf[i] & 0xf8) === 0xf0) {
      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      if (
        i + 3 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i + 3] & 0xc0) !== 0x80 ||
        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // overlong
        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
        buf[i] > 0xf4 // > U+10FFFF
      ) {
        return false;
      }

      i += 4;
    } else {
      return false;
    }
  }

  return true;
};

const hexToString = (input: string): string => {
  const hex = input.toString();
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }

  return str;
};

const buildAssetHex = (policyId: string, label: string, assetName: string) => {
  const assetHex = `${policyId}${label}${assetName}`;

  return assetHex;
};

const parseAsset = (hex: string) => {
  const policyIdSize = 56;
  const policyId = hex.slice(0, policyIdSize);
  const assetNameHex = hex.slice(policyIdSize);
  const assetName = hexToString(assetNameHex);

  return {
    policyId,
    assetName,
    assetNameHex,
  };
};

export const toUTF8OrHex = (hexOrBuffer: string | Buffer) => {
  const buffer = Buffer.isBuffer(hexOrBuffer)
    ? hexOrBuffer
    : Buffer.from(hexOrBuffer, 'hex');

  return isValidUTF8(buffer) ? buffer.toString('utf8') : buffer.toString('hex');
};

const cip67Checksum = (number_: string): string => {
  return crc8(Uint8Array.from(Buffer.from(number_, 'hex')))
    .toString(16)
    .padStart(2, '0');
};

export const toLabel = (number_: number): string => {
  if (number_ < 0 || number_ > 65_535) {
    throw new Error(
      `Label ${number_} out of range: min label 1 - max label 65535.`,
    );
  }
  const numberHex = number_.toString(16).padStart(4, '0');

  return '0' + numberHex + cip67Checksum(numberHex) + '0';
};

export const fromLabel = (label: string): number | null => {
  if (label.length !== 8 || !(label[0] === '0' && label[7] === '0')) {
    return null;
  }
  const numberHex = label.slice(1, 5);
  const number_ = Number.parseInt(numberHex, 16);
  const check = label.slice(5, 7);

  return check === cip67Checksum(numberHex) ? number_ : null;
};

export const toCip68Assets = (hex: string) => {
  // Asset name is prefixed by 4 bytes (32 bits, 8 hex chars)
  // https://developers.cardano.org/docs/governance/cardano-improvement-proposals/cip-0067/#specification
  // split asset hex to policy and asset name
  const assetParts = parseAsset(hex);
  // slice label prefix (first 4 bytes)
  const labelPrefix = assetParts.assetNameHex.slice(0, 8);
  const labelNumber = fromLabel(labelPrefix);
  // slice asset name without the label prefix
  const assetNameWithoutLabelPrefix = assetParts.assetNameHex.slice(8);

  if (labelNumber === null) {
    // Asset does not follow CIP67/68
    return null;
  }

  try {
    // Encode labels
    const referenceLabel = toLabel(ASSET_NAME_LABELS.reference_nft);
    const nftLabel = toLabel(ASSET_NAME_LABELS.nft);
    const ftLabel = toLabel(ASSET_NAME_LABELS.ft);
    const rftLabel = toLabel(ASSET_NAME_LABELS.rft);

    // Build reference asset hex (policy_id|reference_label|name)
    const assets = {
      reference_nft: buildAssetHex(
        assetParts.policyId,
        referenceLabel,
        assetNameWithoutLabelPrefix,
      ),
      nft: buildAssetHex(
        assetParts.policyId,
        nftLabel,
        assetNameWithoutLabelPrefix,
      ),
      ft: buildAssetHex(
        assetParts.policyId,
        ftLabel,
        assetNameWithoutLabelPrefix,
      ),
      rft: buildAssetHex(
        assetParts.policyId,
        rftLabel,
        assetNameWithoutLabelPrefix,
      ),
    };

    return assets;
  } catch {
    return null;
  }
};

export const getReferenceNFT = (
  assetHex: string,
): { hex: string; standard: TokenStandard } | null => {
  const cip68Assets = toCip68Assets(assetHex);

  if (!cip68Assets) return null;

  const availableStandards: TokenStandard[] = ['ft', 'nft', 'rft'];
  const standard = availableStandards.find(s => cip68Assets[s] === assetHex);

  if (standard) {
    return {
      hex: cip68Assets.reference_nft,
      standard: standard,
    };
  }
  return null;
};

const convertDatumValue = (
  decodedValue: unknown,
  schema: PropertyScheme | Record<string, PropertyScheme> | null,
  version: number,
): unknown => {
  if (!schema) {
    return null;
  }

  if (schema.type === 'number' && typeof decodedValue === 'number') {
    return decodedValue;
  } else if (schema.type === 'bytestring' && Buffer.isBuffer(decodedValue)) {
    return toUTF8OrHex(decodedValue);
  } else if (
    version === 3 &&
    schema.type === 'bytestring' &&
    Array.isArray(decodedValue)
  ) {
    // bytestring, but encoded as array of bytes
    // concat chunks and convert to utf-8 or return bytes as hex
    return toUTF8OrHex(Buffer.concat(decodedValue));
  } else if (Array.isArray(decodedValue)) {
    const convertedArray = [];
    for (const arrayItem of decodedValue) {
      const arrayItemSchema = schema.items ?? null;
      const v = convertDatumValue(arrayItem, arrayItemSchema, version);
      if (v === null) {
        // One of the item has unsupported format which means we keep CBOR value instead
        return null;
      }
      convertedArray.push(v);
    }
    return convertedArray;
  } else if (decodedValue instanceof Map) {
    const metadataMap: Record<string, unknown> = {};
    for (const [key, mapValue] of decodedValue.entries()) {
      // key and value are converted to utf-8 if their bytes are valid utf-8 sequence, hex otherwise
      const convertedKey = Buffer.isBuffer(key) ? toUTF8OrHex(key) : key;
      const valueSchema =
        //  @ts-expect-error TODO
        schema && convertedKey in schema ? schema[convertedKey] : null;
      const convertedValue = convertDatumValue(mapValue, valueSchema, version);
      if (convertedValue === null) {
        // Unsupported format
        return null;
      }
      metadataMap[convertedKey] = convertedValue;
    }
    return metadataMap;
  } else {
    // Unsupported format
    return null;
  }
};

export const getMetadataFromOutputDatum = (
  datumHex: string,
  options: {
    standard: TokenStandard;
  },
): ReferenceMetadataDatum | null => {
  const metadataFormat = METADATA_SCHEME_MAP[options.standard];
  const datum = CardanoWasm.PlutusData.from_hex(datumHex);

  const constrPlutusData = datum.as_constr_plutus_data();

  if (!constrPlutusData || constrPlutusData.data().len() === 0) {
    // no data
    return null;
  }

  if (constrPlutusData.data().len() < 2) {
    // Invalid format, [metadata, version] are mandatory
    return null;
  }

  // Lookup metadata by going into the first field of constructor 0.
  const datumMap = constrPlutusData.data().get(0).as_map();
  const datumVersion = Number(
    constrPlutusData.data().get(1).as_integer()?.to_str(),
  );

  // Optional extra data
  const datumExtra =
    constrPlutusData.data().len() > 2
      ? constrPlutusData.data().get(2).to_hex()
      : undefined;

  if (!datumMap) {
    return null;
  }

  if (datumVersion === undefined) {
    // missing version
    return null;
  }

  // Parsing metadata keys and its values (with conversion to utf-8 if possible)
  const metadataMap: Record<string, unknown> = {};
  const keys = datumMap.keys();

  for (let index = 0; index < datumMap.len(); index++) {
    const key = keys.get(index);
    const decodedKey = cbor.decodeFirstSync(key.to_bytes());

    const value = datumMap.get(key);

    if (!value) {
      throw Error('Key not found in datum map. Should not happen.');
    }

    const decodedValue = value ? cbor.decodeFirstSync(value.to_bytes()) : null;

    // key and value are converted to utf-8 if their bytes are valid utf-8 sequence, hex otherwise
    const convertedKey = Buffer.isBuffer(decodedKey)
      ? toUTF8OrHex(decodedKey)
      : decodedKey;

    if (!(metadataFormat && convertedKey in metadataFormat)) {
      // Custom field not covered by CIP68 standard
      // Return unparsed CBOR data
      metadataMap[convertedKey] = value?.to_hex();
    } else {
      const convertedValue = convertDatumValue(
        decodedValue,
        metadataFormat[convertedKey],
        datumVersion,
      );

      // use converted value if available, otherwise leave it as cbor
      metadataMap[convertedKey] =
        convertedValue !== null ? convertedValue : value.to_hex();
    }
  }

  return { metadata: metadataMap, version: datumVersion, extra: datumExtra };
};
