export const getPaymentPartBech32 = [
  {
    // addr1qxxfwz7n3lnduxxgff6smhwlxkcw3gcax3q39363cpq4axnntgjccmteyrsldd67rxv2yq6ew2a7t48q34p9j7nf0kjq4rdx3w
    // stake1u9e45fvvd4ujpc0kka0pnx9zqdvh9wl96nsg6sje0f5hmfq45lrja
    // addr_vkh13jtsh5u0um0p3jz2w5xamhe4kr52x8f5gyfvw5wqg90f57gkgmc
    description: 'addr_vkh type 0 mainnet',
    paymentCred: 'addr_vkh13jtsh5u0um0p3jz2w5xamhe4kr52x8f5gyfvw5wqg90f57gkgmc',
    addressType: 0,
    network: 'mainnet',
    result: '1qxxfwz7n3lnduxxgff6smhwlxkcw3gcax3q39363cpq4ax',
  },
  {
    // addr1qxxfwz7n3lnduxxgff6smhwlxkcw3gcax3q39363cpq4axnntgjccmteyrsldd67rxv2yq6ew2a7t48q34p9j7nf0kjq4rdx3w
    // stake1u9e45fvvd4ujpc0kka0pnx9zqdvh9wl96nsg6sje0f5hmfq45lrja
    // addr_vkh13jtsh5u0um0p3jz2w5xamhe4kr52x8f5gyfvw5wqg90f57gkgmc
    description: 'addr_vkh type 2 mainnet',
    paymentCred: 'addr_vkh13jtsh5u0um0p3jz2w5xamhe4kr52x8f5gyfvw5wqg90f57gkgmc',
    addressType: 2,
    network: 'mainnet',
    result: '1yxxfwz7n3lnduxxgff6smhwlxkcw3gcax3q39363cpq4ax',
  },
  {
    // https://cips.cardano.org/cips/cip19/#testvectors
    description: 'addr_vk addr type 0',
    paymentCred:
      'addr_vk1w0l2sr2zgfm26ztc6nl9xy8ghsk5sh6ldwemlpmp9xylzy4dtf7st80zhd',
    addressType: 0,
    network: 'mainnet',
    result: '1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer',
  },
  {
    // https://cips.cardano.org/cips/cip19/#testvectors
    description: 'addr_vk addr type 2',
    paymentCred:
      'addr_vk1w0l2sr2zgfm26ztc6nl9xy8ghsk5sh6ldwemlpmp9xylzy4dtf7st80zhd',
    addressType: 2,
    network: 'mainnet',
    result: '1yx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer',
  },
  {
    // https://cips.cardano.org/cips/cip19/#testvectors
    description: 'addr_vk type 0 testnet',
    paymentCred:
      'addr_vk1w0l2sr2zgfm26ztc6nl9xy8ghsk5sh6ldwemlpmp9xylzy4dtf7st80zhd',
    addressType: 0,
    network: 'testnets',
    result: '1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer',
  },
  {
    // https://cips.cardano.org/cips/cip19/#testvectors
    description: 'script mainnet addr type 1',
    paymentCred: 'script1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7r35m37',
    addressType: 1,
    network: 'mainnet',
    result: '1z8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gt',
  },
  {
    // https://cips.cardano.org/cips/cip19/#testvectors
    description: 'script testnet addr type 1',
    paymentCred: 'script1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7r35m37',
    addressType: 1,
    network: 'testnets',
    result: '1zrphkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gt',
  },
  {
    // addr type 1 addr_test1zpv68zsj9af8sxg0du6zxzmnwm4ch6atlyhcwfqdyfc7qy3u7yzv8ay6qvmlywtgvt7exaxt783dxuzv03qal7muda5srdg8p9
    // addr type 3 addr_test1xpv68zsj9af8sxg0du6zxzmnwm4ch6atlyhcwfqdyfc7qyje5w9pyt6j0qvs7me5yv9hxaht3046h7f0sujq6gn3uqfqu495jl
    // script1tx3c5y302fupjrm0xs3skumkaw97h2le97rjgrfzw8spydzr5ej
    description: '5b scripthash addr type 1',
    paymentCred: 'script1tx3c5y302fupjrm0xs3skumkaw97h2le97rjgrfzw8spydzr5ej',
    addressType: 1,
    network: 'testnets',
    result: '1zpv68zsj9af8sxg0du6zxzmnwm4ch6atlyhcwfqdyfc7qy',
  },
  {
    // addr type 1 addr_test1zpv68zsj9af8sxg0du6zxzmnwm4ch6atlyhcwfqdyfc7qy3u7yzv8ay6qvmlywtgvt7exaxt783dxuzv03qal7muda5srdg8p9
    // addr type 3 addr_test1xpv68zsj9af8sxg0du6zxzmnwm4ch6atlyhcwfqdyfc7qyje5w9pyt6j0qvs7me5yv9hxaht3046h7f0sujq6gn3uqfqu495jl
    // script1tx3c5y302fupjrm0xs3skumkaw97h2le97rjgrfzw8spydzr5ej
    description: '5b scripthash addr type 3',
    paymentCred: 'script1tx3c5y302fupjrm0xs3skumkaw97h2le97rjgrfzw8spydzr5ej',
    addressType: 3,
    network: 'testnets',
    result: '1xpv68zsj9af8sxg0du6zxzmnwm4ch6atlyhcwfqdyfc7qy',
  },
  {
    description: 'invalid payment cred',
    paymentCred: 'addr_vkhdada',
    addressType: 0,
    network: 'mainnet',
    result: null,
  },
] as const;
