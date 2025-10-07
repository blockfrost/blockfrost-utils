import {
  ByronAddress,
  PublicKey,
} from '@emurgo/cardano-serialization-lib-nodejs';
import { bech32 } from 'bech32';

type BlockfrostNetwork =
  | 'mainnet'
  | 'testnet'
  | 'preview'
  | 'preprod'
  | 'sanchonet';
// prefixes based on CIP5 https://github.com/cardano-foundation/CIPs/blob/master/CIP-0005/CIP-0005.md
const PREFIXES = Object.freeze({
  ADDR: 'addr',
  ADDR_TEST: 'addr_test',
  STAKE: 'stake',
  STAKE_TEST: 'stake_test',
  STAKE_KEY_HASH: 'stake_vkh',
  STAKE_KEY: 'stake_vk',
  PAYMENT_KEY_HASH: 'addr_vkh',
  PAYMENT_KEY: 'addr_vk',
  POOL: 'pool',
  SCRIPT: 'script',
});

type PaymentCredPrefix = 'addr_vkh' | 'addr_vk' | 'script';

const MAX_UNSIGNED_INT = 2_147_483_648;
const MAX_SIGNED_INT = 2_147_483_647;
const MAX_SIGNED_BIGINT = BigInt('9223372036854775807');

const hexre = new RegExp('^[A-Fa-f0-9]+$');

export const validateHex = (input: string): boolean => {
  try {
    return hexre.test(input);
  } catch {
    return false;
  }
};

export const validateStakeAddress = (
  input: string,
  network: BlockfrostNetwork,
): boolean => {
  // validate stake address  (also check network mismatch i.e. mainnet/testnet)
  try {
    const bech32Info = bech32.decode(input, 1000);

    if (
      (bech32Info.prefix === PREFIXES.STAKE && network === 'mainnet') ||
      (bech32Info.prefix === PREFIXES.STAKE_TEST && network !== 'mainnet')
    )
      return true;
    else {
      return false;
    }
  } catch {
    return false;
  }
};

export const convertStakeAddress = (
  input: string,
  network: BlockfrostNetwork,
): string | undefined => {
  try {
    if (!validateHex(input)) return undefined;

    const words = bech32.toWords(Buffer.from(input, 'hex'));
    // if it's in hex, we'll convert it to Bech32

    return network === 'mainnet'
      ? bech32.encode(PREFIXES.STAKE, words)
      : bech32.encode(PREFIXES.STAKE_TEST, words);
  } catch {
    return undefined;
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

      return bech32Info.prefix === PREFIXES.POOL ? input : undefined;
    }
  } catch {
    return undefined;
  }
};

export const paymentCredFromBech32Address = (
  input: string,
):
  | {
      paymentCred: string;
      prefix: PaymentCredPrefix;
    }
  | undefined => {
  // compute paymentCred
  try {
    const bech32Info = bech32.decode(input, 1000);
    if (bech32Info.prefix === PREFIXES.PAYMENT_KEY_HASH) {
      // valid payment_cred
      const payload = bech32.fromWords(bech32Info.words);
      const paymentCred = `\\x${Buffer.from(payload).toString('hex')}`;

      return { paymentCred, prefix: bech32Info.prefix };
    } else if (bech32Info.prefix === PREFIXES.PAYMENT_KEY) {
      // valid payment_cred
      const payload = bech32.fromWords(bech32Info.words);
      const pubKey = PublicKey.from_hex(Buffer.from(payload).toString('hex'));
      const paymentKeyHash = `\\x${pubKey.hash().to_hex()}`;
      pubKey.free();
      return { paymentCred: paymentKeyHash, prefix: bech32Info.prefix };
    } else if (bech32Info.prefix === PREFIXES.SCRIPT) {
      const payload = bech32.fromWords(bech32Info.words);
      const payloadHex = Buffer.from(payload).toString('hex');
      const paymentCred = `\\x${payloadHex}`;

      return { paymentCred, prefix: bech32Info.prefix };
    } else {
      return undefined;
    }
  } catch (error) {
    // Uncomment for awesome debug hack!
    // console.error(error);
    return undefined;
  }
};

export const paymentCredToBech32Address = (
  input: string,
  prefix: PaymentCredPrefix,
): string | undefined => {
  // Encodes payment credential into its original bech32 prefixed form
  try {
    if (!validateHex(input)) return undefined;

    const words = bech32.toWords(Buffer.from(input, 'hex'));

    switch (prefix) {
      case PREFIXES.PAYMENT_KEY_HASH:
      case PREFIXES.SCRIPT:
        // add prefix to payment cred and encode it as bech32
        return bech32.encode(prefix, words);
      default:
        throw Error(
          `Prefix ${prefix} is not supported by paymentCredToBech32Address`,
        );
    }
  } catch {
    return undefined;
  }
};

export const detectAndValidateAddressType = (
  input: string,
  network: BlockfrostNetwork,
): 'byron' | 'shelley' | undefined => {
  // differentiate between various address era formats (byron, shelley)
  try {
    if (ByronAddress.is_valid(input)) {
      // valid byron
      return 'byron';
    } else {
      // check if it's not shelley (also check network mismatch i.e. mainnet/testnet)
      const bech32Info = bech32.decode(input, 1000);
      if (
        (bech32Info.prefix === PREFIXES.ADDR && network === 'mainnet') ||
        (bech32Info.prefix === PREFIXES.ADDR_TEST && network !== 'mainnet')
      ) {
        // valid shelley - addr1 for mainnet or addr_test1 for testnet
        return 'shelley';
      } else if (
        bech32Info.prefix === PREFIXES.PAYMENT_KEY_HASH ||
        bech32Info.prefix === PREFIXES.SCRIPT
      ) {
        // valid shelley - payment_cred
        return 'shelley';
      } else {
        return undefined;
      }
    }
  } catch {
    return undefined;
  }
};

export const getAddressTypeAndPaymentCred = (
  address: string,
  network: BlockfrostNetwork,
) => {
  // check for address validity (undefined) and type (byron, shelley)
  const addressType = detectAndValidateAddressType(address, network);

  // if shelley, check for paymentCred and compute paymentCred hex
  // if an error occurs or paymentCred can't be computed, undefined is returned
  // which is then handled in the DB as NULL
  const paymentCred =
    addressType === 'shelley'
      ? paymentCredFromBech32Address(address)
      : undefined;

  if (paymentCred) {
    return {
      addressType,
      paymentCred: paymentCred.paymentCred,
      paymentCredPrefix: paymentCred.prefix,
    };
  } else {
    return {
      addressType,
    };
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

const getStakeAddressHeaderByte = (
  type: 'keyHash' | 'scriptHash',
  network: BlockfrostNetwork,
) => {
  const headerAddrType = type === 'keyHash' ? 0b1110 : 0b1111; // header for stake key hash/script hash
  const headerMainnet = 0b0001;
  const headerTestnet = 0b0000;
  const header =
    (headerAddrType << 4) |
    (network === 'mainnet' ? headerMainnet : headerTestnet); // Combine nibbles

  const headerBuff = Buffer.alloc(1); // Allocate a 1-byte buffer (adjust size as needed)
  headerBuff.writeUInt8(header, 0);
  return headerBuff;
};

/**
 * Constructs a Cardano stake address in db-sync format (bech32) from a stake credential.
 *
 * The function prepends the appropriate header byte (indicating key hash or script hash and network)
 * to the provided stake credential, then encodes the result as a bech32 stake address.
 *
 * @param stakeCred - Hex-encoded stake credential (key hash or script hash)
 * @param type - Type of credential: 'keyHash' or 'scriptHash'
 * @param network - Cardano network ('mainnet', 'testnet', etc.)
 * @returns Bech32-encoded stake address suitable for db-sync
 *
 * @example
 * getDbSyncStakeAddress('cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7r35m37', 'scriptHash', 'mainnet');
 * // => 'stake1...'
 */
export const getDbSyncStakeAddress = (
  stakeCred: string,
  type: 'keyHash' | 'scriptHash',
  network: BlockfrostNetwork,
): string => {
  const headerBuff = getStakeAddressHeaderByte(type, network);
  const keyWithHeader = Buffer.concat([
    headerBuff,
    Buffer.from(stakeCred, 'hex'),
  ]);

  const dbSyncAddr = bech32.encode(
    network === 'mainnet' ? PREFIXES.STAKE : PREFIXES.STAKE_TEST,
    bech32.toWords(keyWithHeader),
  );
  return dbSyncAddr;
};

/**
 * Validates and extracts the stake credential from a Cardano stake address or stake credential.
 *
 * Supported input formats:
 * - Stake address (bech32): stake1..., stake_test1...
 * - Stake key (bech32): stake_vk...
 * - Stake key hash (bech32): stake_vkh...
 * - Script hash (bech32): script...
 *
 * For stake addresses, the function checks the header byte to determine if the credential is a key hash or script hash.
 * For stake keys, it derives the key hash from the public key.
 * For script hashes, it extracts the hash directly.
 *
 * Returns an object containing:
 * - stakeCred: Hex-encoded stake credential (key hash or script hash)
 * - prefix: Bech32 prefix of the input
 * - type: 'keyHash' or 'scriptHash'
 * - dbSyncAddr: Stake address in db-sync format (bech32)
 *
 * Returns undefined if the input is invalid or not recognized.
 *
 * @param input - Bech32-encoded stake address or credential
 * @param network - Cardano network ('mainnet', 'testnet', etc.)
 * @returns Object with stakeCred, prefix, type, dbSyncAddr, or undefined if invalid
 */
export const validateStakeCred = (
  input: string,
  network: BlockfrostNetwork,
) => {
  // Supported formats: stake, stake_test, stake_vkh, stake_vk, script

  try {
    const { prefix, words } = bech32.decode(input, 1000);

    switch (prefix) {
      case PREFIXES.STAKE:
      case PREFIXES.STAKE_TEST: {
        const payload = bech32.fromWords(words);

        // 1110.... stake key hash
        // 1111.... stake script hash
        const firstByte = payload[0];
        const addrTypeNibble = (firstByte & 0xf0) >> 4; // Get first 4 bits
        let type = null;
        switch (addrTypeNibble) {
          case 0b1110:
            // stake key hash
            type = 'keyHash';
            break;
          case 0b1111:
            // stake script hash
            type = 'scriptHash';
            break;
          default:
            return;
        }

        const stakeCred = Buffer.from(payload).slice(1).toString('hex');

        return { prefix: prefix, type, stakeCred, dbSyncAddr: input };
      }
      case PREFIXES.STAKE_KEY: {
        const payload = bech32.fromWords(words);
        const pubKey = PublicKey.from_hex(Buffer.from(payload).toString('hex'));
        const stakeCredKeyHash = pubKey.hash().to_hex();
        pubKey.free();

        const headerBuff = getStakeAddressHeaderByte('keyHash', network);
        const keyWithHeader = Buffer.concat([
          headerBuff,
          Buffer.from(stakeCredKeyHash, 'hex'),
        ]);

        const dbSyncAddr = bech32.encode(
          network === 'mainnet' ? PREFIXES.STAKE : PREFIXES.STAKE_TEST,
          bech32.toWords(keyWithHeader),
        );

        return {
          stakeCred: stakeCredKeyHash,
          prefix: prefix,
          type: 'keyHash',
          dbSyncAddr,
        };
      }
      case PREFIXES.STAKE_KEY_HASH: {
        const payload = bech32.fromWords(words);
        const stakeCred = Buffer.from(payload).toString('hex');

        const headerBuff = getStakeAddressHeaderByte('keyHash', network);
        const keyWithHeader = Buffer.concat([headerBuff, Buffer.from(payload)]);

        const dbSyncAddr = bech32.encode(
          network === 'mainnet' ? PREFIXES.STAKE : PREFIXES.STAKE_TEST,
          bech32.toWords(keyWithHeader),
        );

        return {
          stakeCred: stakeCred,
          prefix: prefix,
          type: 'keyHash',
          dbSyncAddr,
        };
      }
      case PREFIXES.SCRIPT: {
        const payload = bech32.fromWords(words);
        const stakeCred = Buffer.from(payload).toString('hex');

        const headerBuff = getStakeAddressHeaderByte('scriptHash', network);
        const keyWithHeader = Buffer.concat([headerBuff, Buffer.from(payload)]);

        const dbSyncAddr = bech32.encode(
          network === 'mainnet' ? PREFIXES.STAKE : PREFIXES.STAKE_TEST,
          bech32.toWords(keyWithHeader),
        );

        return {
          stakeCred: stakeCred,
          prefix: prefix,
          type: 'scriptHash',
          dbSyncAddr,
        };
      }
      default: {
        return undefined;
      }
    }
  } catch (error) {
    // Uncomment for awesome debug hack!
    // console.error(error);
    return;
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
  return validateHex(input) && input.length === 128;
};

export const validateBlockHash = (input: string): boolean => {
  return validateHex(input) && input.length === 64;
};

export const isNumber = (value: string | number | undefined): boolean => {
  if (value === '') return false;
  return !Number.isNaN(Number(value));
};

export const validatePolicy = (input: string): boolean => {
  // policy is always 56 chars long
  return validateHex(input) && input.length === 56;
};

export const validateAsset = (input: string): boolean => {
  // policy is always 56 chars long
  // asset name is not mandatory, hence between 0 and 64 chars long (56+64=120)
  return validateHex(input) && input.length >= 56 && input.length <= 120;
};
