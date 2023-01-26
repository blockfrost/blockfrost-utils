import { bech32 } from 'bech32';
import { paymentCredFromBech32Address } from './validation';

export const getTimeFromSlot = (slotNumber: number) => {
  return 1_596_491_091 + (slotNumber - 4_924_800);
};

export const getPaymentPartBech32 = (
  // Payment credentials in bech32 format (addr_vkh)
  paymentCred: string,
  options: {
    // Whether to include bech32 checksum which is added at the end
    includeBech32Checksum: boolean;
    // sets first 4 bits of shelley address header https://cips.cardano.org/cips/cip19/#shelleyaddresses
    addressType: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    // sets last 4 bits of shelley address header https://cips.cardano.org/cips/cip19/#networktag
    network: 'mainnet' | 'testnets';
  },
) => {
  // Constructs invalid bech32 address consisting only from an address header and a payment part.
  // Useful for matching payment credentials against bech32 address
  const NETWORK_TAG = options.network === 'mainnet' ? 1 : 0;
  const paymentCredHexWithBytesPrefix =
    paymentCredFromBech32Address(paymentCred);

  const paymentCredHex = paymentCredHexWithBytesPrefix?.slice(2);

  if (!paymentCredHex) return null;

  const addrHeader = `${options.addressType.toString(16)}${NETWORK_TAG}`;
  const addrWords = bech32.toWords(
    Buffer.from(`${addrHeader}${paymentCredHex}`, 'hex'),
  );

  const bech32PaymentCredAddr = bech32.encode('', addrWords, 1000);
  let result = bech32PaymentCredAddr;

  if (!options.includeBech32Checksum) {
    // Strip last 7 chars of checksum.
    // This assumes that payment part of the address has constant length,
    // otherwise the length of the checksum may vary.
    result = bech32PaymentCredAddr.slice(0, bech32PaymentCredAddr.length - 7);
  }
  return result;
};
