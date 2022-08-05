import { bech32 } from 'bech32';

// prefixes based on CIP5 https://github.com/cardano-foundation/CIPs/blob/master/CIP-0005/CIP-0005.md
const Prefixes = Object.freeze({
  ADDR: 'addr',
  ADDR_TEST: 'addr_test',
  STAKE: 'stake',
  STAKE_TEST: 'stake_test',
  PAYMENT_KEY_HASH: 'addr_vkh',
  POOL: 'pool',
});

const MAX_UNSIGNED_INT = 2_147_483_648;
const MAX_SIGNED_INT = 2_147_483_647;
const MAX_SIGNED_BIGINT = BigInt('9223372036854775807');

const hexre = new RegExp('^[A-Fa-f0-9]+$');

const validateHex = (input: string): boolean => {
  try {
    return hexre.test(input);
  } catch {
    return false;
  }
};

export const validateAndConvertPool = (input: string): string | undefined => {
  // if it's hex, it will get converted and checked, otherwise it's bech32 and stays that way
  try {
    if (validateHex(input)) {
      const words = bech32.toWords(Buffer.from(input, 'hex'));
      // if it's in hex, we'll convert it to Bech32
      const poolId = bech32.encode('pool', words);

      return poolId;
    } else {
      const bech32Info = bech32.decode(input, 1000);

      return bech32Info.prefix === Prefixes.POOL ? input : undefined;
    }
  } catch {
    return undefined;
  }
};

export const paymentCredFromBech32Address = (
  input: string,
): string | undefined => {
  // compute paymentCred
  try {
    const bech32Info = bech32.decode(input, 1000);

    if (bech32Info.prefix === Prefixes.PAYMENT_KEY_HASH) {
      // valid payment_cred
      const payload = bech32.fromWords(bech32Info.words);
      const paymentCred = `\\x${Buffer.from(payload).toString('hex')}`;

      return paymentCred;
    } else {
      return undefined;
    }
  } catch {
    return undefined;
  }
};

export const paymentCredToBech32Address = (
  input: string,
): string | undefined => {
  // compute paymentCred
  try {
    if (!validateHex(input)) return undefined;

    const words = bech32.toWords(Buffer.from(input, 'hex'));
    // if it's in hex, we'll convert it to Bech32

    return bech32.encode(Prefixes.PAYMENT_KEY_HASH, words);
  } catch {
    return undefined;
  }
};

// Decode bech32 script address, drop its first byte (header)
// and return the rest of the bytes, hex encoded.
export const scriptHashFromBech32Address = (
  input: string,
): string | undefined => {
  try {
    const bech32Info = bech32.decode(input, 1000);
    const hash = Buffer.from(bech32.fromWords(bech32Info.words))
      .slice(1)
      .toString('hex');

    return hash;
  } catch {
    return undefined;
  }
};

export const validatePositiveInRangeSignedInt = (
  possiblePositiveInt: string | number | undefined,
): boolean => {
  try {
    if (
      typeof possiblePositiveInt === 'undefined' ||
      possiblePositiveInt === '' ||
      Number.isNaN(Number(possiblePositiveInt)) ||
      Number(possiblePositiveInt) < 0 ||
      Number(possiblePositiveInt) > MAX_SIGNED_INT
    )
      return false;
    else return true;
  } catch {
    return false;
  }
};

export const validatePositiveInRangeSignedBigInt = (
  possiblePositiveBigInt: string | undefined,
): boolean => {
  try {
    if (
      typeof possiblePositiveBigInt === 'undefined' ||
      possiblePositiveBigInt === '' ||
      BigInt(possiblePositiveBigInt) < 0 ||
      BigInt(possiblePositiveBigInt) > MAX_SIGNED_BIGINT
    )
      return false;
    else return true;
  } catch {
    return false;
  }
};

export const validateInRangeUnsignedInt = (
  input: string | number | undefined,
): boolean => {
  try {
    if (
      typeof input === 'undefined' ||
      input === '' ||
      Number.isNaN(Number(input)) ||
      Number(input) < 0 ||
      Number(input) > MAX_UNSIGNED_INT
    )
      return false;
    else return true;
  } catch {
    return false;
  }
};

export const validateDerivationXpub = (input: string): boolean => {
  try {
    return validateHex(input) && input.length === 128;
  } catch {
    return false;
  }
};

export const validateBlockHash = (input: string): boolean => {
  try {
    return validateHex(input) && input.length === 64;
  } catch {
    return false;
  }
};

export const isNumber = (value: string | number | undefined): boolean => {
  if (value === '') return false;
  return !Number.isNaN(Number(value));
};
