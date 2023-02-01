export const getPaymentPartBech32 = [
  {
    // addr1qxxfwz7n3lnduxxgff6smhwlxkcw3gcax3q39363cpq4axnntgjccmteyrsldd67rxv2yq6ew2a7t48q34p9j7nf0kjq4rdx3w
    // stake1u9e45fvvd4ujpc0kka0pnx9zqdvh9wl96nsg6sje0f5hmfq45lrja
    // addr_vkh13jtsh5u0um0p3jz2w5xamhe4kr52x8f5gyfvw5wqg90f57gkgmc
    description: 'addr_vkh type 0 mainnet with header',
    paymentCred: 'addr_vkh13jtsh5u0um0p3jz2w5xamhe4kr52x8f5gyfvw5wqg90f57gkgmc',
    addressType: 0,
    network: 'mainnet',
    result: '1qxxfwz7n3lnduxxgff6smhwlxkcw3gcax3q39363cpq4ax',
  },
  {
    // https://cips.cardano.org/cips/cip19/#testvectors
    description: 'cip19 test vector with header',
    paymentCred:
      'addr_vk1w0l2sr2zgfm26ztc6nl9xy8ghsk5sh6ldwemlpmp9xylzy4dtf7st80zhd',
    addressType: 0,
    network: 'mainnet',
    result: '1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer',
  },
  {
    // https://cips.cardano.org/cips/cip19/#testvectors
    description: 'addr_vk type 0 testnet with header',
    paymentCred:
      'addr_vk1w0l2sr2zgfm26ztc6nl9xy8ghsk5sh6ldwemlpmp9xylzy4dtf7st80zhd',
    addressType: 0,
    network: 'testnets',
    result: '1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer',
  },
  {
    description: 'invalid payment cred',
    paymentCred: 'addr_vkhdada',
    addressType: 0,
    network: 'mainnet',
    result: null,
  },
] as const;
