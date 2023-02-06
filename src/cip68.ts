import * as CardanoWasm from '@emurgo/cardano-serialization-lib-nodejs';
import crc8 from 'crc/crc8';
import cbor from 'cbor';

const ASSET_NAME_LABELS = {
  reference_nft: 100, // Reference NFT locked at a script containing the datum
  nft: 222, // NFT hold by the user's wallet making use of CIP-0025 inner structure
  ft: 333, // FT hold by the user's wallet making use of Cardano foundation off-chain registry inner structure
} as const;

export interface ReferenceMetadataDatum {
  metadata: Record<string, unknown>;
  version: number;
  extra: string | undefined;
}

type FIELD_FORMAT = {
  // TODO: split arrray type with items to separate type
  type: 'bytestring' | 'number' | 'array';
  optional?: boolean;
  items?: CIP68_METADATA_FORMAT_ITEM;
};

type CIP68_METADATA_FORMAT_ITEM = Record<string, FIELD_FORMAT>;
const CIP68_METADATA_FORMAT: Record<string, CIP68_METADATA_FORMAT_ITEM> = {
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
    };

    return assets;
  } catch {
    return null;
  }
};

export const getReferenceNFT = (
  assetHex: string,
): { hex: string; standard: 'ft' | 'nft' } | null => {
  const cip68Assets = toCip68Assets(assetHex);

  if (!cip68Assets) return null;
  const isFT = cip68Assets.ft === assetHex;
  const isNFT = cip68Assets.nft === assetHex;

  if (isFT || isNFT) {
    return {
      hex: cip68Assets.reference_nft,
      standard: isFT ? 'ft' : 'nft',
    };
  }
  return null;
};

const convertDatumValue = (
  value: unknown,
  schema: FIELD_FORMAT | CIP68_METADATA_FORMAT_ITEM | null,
): unknown => {
  if (!schema) {
    return null;
  }

  if (schema.type === 'number' && typeof value === 'number') {
    return value;
  } else if (schema.type === 'bytestring' && Buffer.isBuffer(value)) {
    return toUTF8OrHex(value);
  } else if (Array.isArray(value)) {
    const convertedArray = [];
    for (const [index, arrayItem] of value.entries()) {
      const arrayItemSchema = 'items' in schema ? schema.items ?? null : null;
      const v = convertDatumValue(arrayItem, arrayItemSchema);
      if (v === null) {
        // Invalid data
        return null;
      }
      convertedArray[index] = v;
    }
    return convertedArray;
  } else if (value instanceof Map) {
    const metadataMap: Record<string, unknown> = {};
    for (const [key, mapValue] of value.entries()) {
      // key and value are converted to utf-8 if their bytes are valid utf-8 sequence, hex otherwise
      const convertedKey = Buffer.isBuffer(key) ? toUTF8OrHex(key) : key;
      const valueSchema =
        //  @ts-expect-error TODO
        schema && convertedKey in schema ? schema[convertedKey] : null;
      const convertedValue = convertDatumValue(mapValue, valueSchema);
      if (convertedValue === null) {
        return null;
      }
      metadataMap[convertedKey] = convertedValue;
    }
    return metadataMap;
  } else {
    // no conversion
    return value;
  }
};

export const getMetadataFromOutputDatum = (
  datumHex: string,
  options: {
    standard: 'ft' | 'nft';
  },
): ReferenceMetadataDatum | null => {
  const metadataFormat = CIP68_METADATA_FORMAT[options.standard];
  const datum = CardanoWasm.PlutusData.from_hex(datumHex);

  const constrPlutusData = datum.as_constr_plutus_data();

  if (!constrPlutusData || constrPlutusData.data().len() === 0) {
    // no data
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
      // Custom field not covered by CIP58 standard
      // Return unparsed CBOR data
      metadataMap[convertedKey] = value?.to_hex();
    } else {
      if (
        metadataFormat[convertedKey].type === 'array' &&
        Array.isArray(decodedValue)
      ) {
        // array
        // 'files' field contains array of maps
        const filesValue = convertDatumValue(
          decodedValue,
          metadataFormat[convertedKey],
        );
        metadataMap[convertedKey] = filesValue ?? value.to_hex();
      } else if (
        metadataFormat[convertedKey].type === 'number' &&
        typeof decodedValue === 'number'
      ) {
        // number
        metadataMap[convertedKey] = decodedValue;
      } else if (
        metadataFormat[convertedKey].type === 'bytestring' &&
        Buffer.isBuffer(decodedValue)
      ) {
        // bytestring buffer
        // convert to utf-8 or return bytes as hex
        const convertedValue = toUTF8OrHex(decodedValue);
        metadataMap[convertedKey] = convertedValue;
      } else {
        // other
        // leave it as cbor
        metadataMap[convertedKey] = value.to_hex();
      }
    }
  }

  return { metadata: metadataMap, version: datumVersion, extra: datumExtra };
};
