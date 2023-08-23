export const detectAndValidateAddressType = [
  {
    description: 'Valid byron address',
    input:
      'DdzFFzCqrhstmqBkaU98vdHu6PdqjqotmgudToWYEeRmQKDrn4cAgGv9EZKtu1DevLrMA1pdVazufUCK4zhFkUcQZ5Gm88mVHnrwmXvT',
    result: 'byron',
    network: 'mainnet',
  },
  {
    description: 'Valid shelley address',
    input:
      'addr1qyw8xfunw6lhzzzsdrx5ze6j8ayxjhecv4ty5jtaey5jvwquwvnexa4lwyy9q6xdg9n4y06gd90nse2kffyhmjffycuq405jv6',
    result: 'shelley',
    network: 'mainnet',
  },
  {
    description: 'Valid paymentCred address',
    input: 'addr_vkh1r3ej0ymkhacss5rge4qkw53lfp547wr92e9yjlwf9ynrsk5q93m',
    result: 'shelley',
    network: 'mainnet',
  },
  {
    description: 'Valid paymentCred address (addr_vk)',
    input: 'addr_vk1w0l2sr2zgfm26ztc6nl9xy8ghsk5sh6ldwemlpmp9xylzy4dtf7st80zhd',
    result: undefined,
    network: 'mainnet', // doesn't matter for payment cred
  },
  {
    description: 'Valid address, wrong network',
    input:
      'addr1qyw8xfunw6lhzzzsdrx5ze6j8ayxjhecv4ty5jtaey5jvwquwvnexa4lwyy9q6xdg9n4y06gd90nse2kffyhmjffycuq405jv6',
    result: undefined,
    network: 'testnet',
  },

  {
    description: 'Non valid/malformed address',
    input: 'stonks_address',
    result: undefined,
    network: 'mainnet',
  },
  {
    description: 'TESTNET: Valid address',
    input:
      'addr_test1qryydf62jprgmtfq02370u07ch8kluvjvm4zx7gn8gmpd9snea2aza02sj9c0h4nay20a0t7q28zhajng36a2taec0gqeywmev',
    result: 'shelley',
    network: 'testnet',
  },
  {
    description: 'TESTNET: Valid paymentCred address',
    input: 'addr_vkh1epr2wj5sg6x66gr650nlrlk9eahlrynxag3hjye6xctfvmdduge',
    result: 'shelley',
    network: 'testnet',
  },
  {
    description: 'TESTNET: Valid address, wrong network',
    input:
      'addr_test1qryydf62jprgmtfq02370u07ch8kluvjvm4zx7gn8gmpd9snea2aza02sj9c0h4nay20a0t7q28zhajng36a2taec0gqeywmev',
    result: undefined,
    network: 'mainnet',
  },
  {
    description: 'TESTNET: Non valid/malformed address',
    input: 'stonks_address_testnet',
    result: undefined,
    network: 'testnet',
  },
] as const;

export const paymentCredFromBech32Address = [
  {
    description: 'Valid paymentCred address',
    input: 'addr_vkh1r3ej0ymkhacss5rge4qkw53lfp547wr92e9yjlwf9ynrsk5q93m',
    result: {
      paymentCred:
        '\\x1c73279376bf71085068cd4167523f48695f3865564a497dc9292638',
      prefix: 'addr_vkh',
    },
  },
  {
    // https://cips.cardano.org/cips/cip19/#testvectors
    description: 'Valid paymentCred address (addr_vk)',
    input: 'addr_vk1w0l2sr2zgfm26ztc6nl9xy8ghsk5sh6ldwemlpmp9xylzy4dtf7st80zhd',
    result: {
      paymentCred:
        '\\x9493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e',
      prefix: 'addr_vk',
    },
  },
  {
    // https://cips.cardano.org/cips/cip19/#testvectors
    description: 'Valid bech32 address (with script hash payment cred, type 7)',
    input: 'addr1w8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcyjy7wx',
    result: undefined,
  },
  {
    // https://cips.cardano.org/cips/cip19/#testvectors
    description: 'Valid paymentCred address (script addr)',
    input: 'script1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7r35m37',
    result: {
      paymentCred:
        '\\xc37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f',
      prefix: 'script',
    },
  },
  {
    description: 'Valid paymentCred address (script addr)',
    input: 'script1tx3c5y302fupjrm0xs3skumkaw97h2le97rjgrfzw8spydzr5ej',
    result: {
      paymentCred:
        '\\x59a38a122f5278190f6f34230b7376eb8bebabf92f87240d2271e012',
      prefix: 'script',
    },
  },
  {
    description: 'Valid Bech32, but not paymentCred address',
    input:
      'addr1qyw8xfunw6lhzzzsdrx5ze6j8ayxjhecv4ty5jtaey5jvwquwvnexa4lwyy9q6xdg9n4y06gd90nse2kffyhmjffycuq405jv6',
    result: undefined,
  },
  {
    description: 'Invalid paymentCred address',
    input: 'addr_stonks',
    result: undefined,
  },
] as const;

export const validateAndConvertPool = [
  {
    description: 'Valid pool Bech32',
    input: 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy',
    result: 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy',
  },
  {
    description: 'Valid pool Hex',
    input: '0f292fcaa02b8b2f9b3c8f9fd8e0bb21abedb692a6d5058df3ef2735',
    result: 'pool1pu5jlj4q9w9jlxeu370a3c9myx47md5j5m2str0naunn2q3lkdy',
  },
  {
    description: 'Valid Bech32, but not pool id',
    input:
      'addr1qyw8xfunw6lhzzzsdrx5ze6j8ayxjhecv4ty5jtaey5jvwquwvnexa4lwyy9q6xdg9n4y06gd90nse2kffyhmjffycuq405jv6',
    result: undefined,
  },
  {
    description: 'Invalid pool',
    input: 'stonks_pool',
    result: undefined,
  },
];

export const paymentCredToBech32Address = [
  {
    description: 'Valid payment key hash address',
    input: '1c73279376bf71085068cd4167523f48695f3865564a497dc9292638',
    prefix: 'addr_vkh',
    result: 'addr_vkh1r3ej0ymkhacss5rge4qkw53lfp547wr92e9yjlwf9ynrsk5q93m',
  },
  {
    description: 'Valid script address',
    input: 'c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f',
    prefix: 'script',
    result: 'script1cda3khwqv60360rp5m7akt50m6ttapacs8rqhn5w342z7r35m37',
  },
  {
    description: 'Valid script address',
    input: '59a38a122f5278190f6f34230b7376eb8bebabf92f87240d2271e012',
    prefix: 'script',
    result: 'script1tx3c5y302fupjrm0xs3skumkaw97h2le97rjgrfzw8spydzr5ej',
  },
];

export const validateStakeAddress = [
  {
    description: 'Valid stake address',
    input: 'stake1uxmdw34s0rkc26d9x9aax69pcua8eukm2tytlx3szg75mcg5z5nss',
    network: 'mainnet',
    result: true,
  },
  {
    description: 'Valid stake address, wrong network',
    input: 'stake1uxmdw34s0rkc26d9x9aax69pcua8eukm2tytlx3szg75mcg5z5nss',
    network: 'testnet',
    result: false,
  },
  {
    description: 'Non valid/malformed stake address',
    input: 'stake_stonks',
    network: 'mainnet',
    result: false,
  },
  {
    description: 'TESTNET: Valid stake address',
    input: 'stake_test1urtemlwr6hmw6q5mc5p0q6z06g4f3v33czec67yf688w4wsw6rnpq',
    network: 'testnet',
    result: true,
  },
  {
    description: 'TESTNET: Valid stake address, wrong network',
    input:
      'stake_test1uzxpncx82vfkl5ml00ws44hzfdh64r22kr93e79jqsumv0q8g8cy08878787',
    network: 'mainnet',
    result: false,
  },
  {
    description: 'TESTNET: Non valid/malformed stake address',
    input: 'stake_stonks_testnet',
    network: 'testnet',
    result: false,
  },
] as const;

export const convertStakeAddress = [
  {
    description: 'Valid onchain address',
    input: 'e1ffd02ae28da95344585e7aa1fdad328b11c997a763a94216c6d903d2',
    network: 'mainnet',
    result: 'stake1u8laq2hz3k54x3zctea2rlddx293rjvh5a36jsskcmvs85sf0vdl6',
  },
  {
    description: 'Valid non-onchain address',
    input: 'e1b94ee4b98a8ada410ae6eff01969e64f365d7a407b8eaf4cb430a61a',
    network: 'mainnet',
    result: 'stake1uxu5ae9e329d5sg2umhlqxtfue8nvht6gpacat6vksc2vxsmnmm4g',
  },
  {
    description: 'Non-valid non-onchain address',
    input: 'stonks',
    network: 'mainnet',
    result: undefined,
  },
  {
    description: 'TESTNET: valid onchain address',
    input: 'e04f1606da213feae8ddd434a7a3467ca48f25deac14ecf7adadbe3238',
    network: 'testnet',
    result: 'stake_test1up83vpk6yyl746xa6s620g6x0jjg7fw74s2weaad4klrywqg2nh3w',
  },
  {
    description: 'TESTNET: valid non-onchain address',
    input: 'e05a29b4c93eb2affed20854d8f0c07aafe3b04eff4212bb079e0f20fb',
    network: 'testnet',
    result: 'stake_test1updzndxf86e2llkjpp2d3uxq02h78vzwlapp9wc8nc8jp7cgqjwlv',
  },
  {
    description: 'TESTNET: valid non-onchain address',
    input: 'stonks',
    network: 'testnet',
    result: undefined,
  },
] as const;

export const validateBlockHash = [
  {
    description: 'Valid hex, valid length',
    input: '5f20df933584822601f9e3f8c024eb5eb252fe8cefb24d1317dc3d432e940ebb',
    result: true,
  },
  {
    description: 'Valid hex, invalid length',
    input: 'deadbeef',
    result: false,
  },
  {
    description: 'Invalid hex, valid length',
    input: 'Ae2tdPwUPEZEdDxg52so2k6iB5tLtNoATiNdKMCBHiAQHWGTpd2n6Lrym7Cabc69',
    result: false,
  },
  {
    description: 'Invalid hex, invalid length',
    input: 'deadbppf',
    result: false,
  },
] as const;

export const validateDerivationXpub = [
  {
    description: 'Valid xpub',
    input:
      '6d17587575a3b4f0f86ebad3977e8f7e4981faa863eccf5c1467065c74fe3435943769446dd290d103fb3d360128e86de4b47faea73ffb0900c94c6a61ef9ea2',
    result: true,
  },
  {
    description: 'Invalid xpub',
    input: 'stonks',
    result: false,
  },
] as const;

export const validateInRangeUnsignedInt = [
  {
    description: 'Invalid unsigned gint - empty input',
    input: '',
    result: false,
  },
  {
    description: 'Valid unsigned int - zero num input',
    input: 0,
    result: true,
  },
  {
    description: 'Valid unsigned int - zero string input',
    input: '0',
    result: true,
  },
  {
    description: 'Valid unsigned int - string input',
    input: '42',
    result: true,
  },
  {
    description: 'Valid unsigned int - max string input',
    input: '2147483648',
    result: true,
  },
  {
    description: 'Valid unsigned int - max num input',
    input: 2147483648,
    result: true,
  },
  {
    description: 'Valid unsigned int - over max num input',
    input: 2147483649,
    result: false,
  },
  {
    description: 'Valid unsigned int - over max string input',
    input: '2147483649',
    result: false,
  },
  {
    description: 'Valid unsigned int - invalid string input',
    input: 'stonks',
    result: false,
  },
  {
    description: 'Valid unsigned int - negative num input',
    input: -1,
    result: false,
  },
  {
    description: 'Valid unsigned int - negative string input',
    input: '-1',
    result: false,
  },
] as const;

export const validatePositiveInRangeSignedInt = [
  {
    description: 'Invalid signed int - empty input',
    input: '',
    result: false,
  },
  {
    description: 'Valid signed int - zero num input',
    input: 0,
    result: true,
  },
  {
    description: 'Valid signed int - zero string input',
    input: '0',
    result: true,
  },
  {
    description: 'Valid signed int - string input',
    input: '42',
    result: true,
  },
  {
    description: 'Valid signed int - max num input',
    input: 2147483647,
    result: true,
  },
  {
    description: 'Valid signed int - max string input',
    input: '2147483647',
    result: true,
  },
  {
    description: 'Valid signed int - over max num input',
    input: 2147483648,
    result: false,
  },
  {
    description: 'Valid signed int - over max string input',
    input: '2147483648',
    result: false,
  },
  {
    description: 'Valid signed int - invalid string input',
    input: 'stonks',
    result: false,
  },
  {
    description: 'Valid signed int - negative num input',
    input: -1,
    result: false,
  },
  {
    description: 'Valid signed int - negative string input',
    input: '-1',
    result: false,
  },
] as const;

export const validatePositiveInRangeSignedBigInt = [
  {
    description: 'Invalid signed bigint - empty input',
    input: '',
    result: false,
  },
  {
    description: 'Valid signed bigint - zero string input',
    input: '0',
    result: true,
  },
  {
    description: 'Valid signed bigint - input',
    input: '42',
    result: true,
  },
  {
    description: 'Valid signed bigint - max input',
    input: '9223372036854775807',
    result: true,
  },
  {
    description: 'Valid signed bigint - over max input',
    input: '9223372036854775808',
    result: false,
  },
  {
    description: 'Valid signed bigint - invalid input',
    input: 'stonks',
    result: false,
  },
  {
    description: 'Valid signed bigint - negative input',
    input: '-1',
    result: false,
  },
];

export const isNumber = [
  {
    description: 'isNumber hash',
    input: '5f20df933584822601f9e3f8c024eb5eb252fe8cefb24d1317dc3d432e940ebb',
    result: false,
  },
  {
    description: 'isNumber number',
    input: '271471741',
    result: true,
  },
  {
    description: 'isNumber number with non num char at the end',
    input: '271471741x',
    result: false,
  },
  {
    description: 'isNumber empty string',
    input: '',
    result: false,
  },
  {
    description: 'isNumber undefined',
    input: undefined,
    result: false,
  },
] as const;

export const validateHex = [
  {
    description: 'Valid hex',
    input: '5f20df933584822601f9e3f8c024eb5eb252fe8cefb24d1317dc3d432e940ebb',
    result: true,
  },
  {
    description: 'Valid hex',
    input: 'deadbeef',
    result: true,
  },
  {
    description: 'Invalid hex',
    input: 'Ae2tdPwUPEZEdDxg52so2k6iB5tLtNoATiNdKMCBHiAQHWGTpd2n6Lrym7Cabc69',
    result: false,
  },
  {
    description: 'Invalid hex',
    input: 'deadbppf',
    result: false,
  },
];

export const getAddressTypeAndPaymentCred = [
  {
    description: 'Valid byron address, mainnet',
    address:
      'DdzFFzCqrhsixScxYMqkcp1Q8p1m7Zg7VU3WiMNfVivwqdMNu8aSYm2wVGGw5hZjp1CHpLfuwoZMRtxf2QhChhbZNeT3ioChYzcBRhcs',
    network: 'mainnet',
    result: { addressType: 'byron' },
  },
  {
    description: 'Valid byron address, mainnet',
    address: 'Ae2tdPwUPEYwNguM7TB3dMnZMfZxn1pjGHyGdjaF4mFqZF9L3bj6cdhiH8t',
    network: 'mainnet',
    result: { addressType: 'byron' },
  },
  {
    description: 'Valid shelley address, mainnet',
    address:
      'addr1qyg5yk36ee0rhl5hw5kxcfng5ygrsv55tuchs0nxjmh9uqmpmpaxya7n6kzmyy6f72st0akwx8zg5n6emrxa5mhywg9q3v23dv',
    network: 'mainnet',
    result: { addressType: 'shelley' },
  },
  {
    description: 'Valid shelley address, testnet',
    address: 'addr_test1wruv9whqljf3jhv3tk5q8v0e6aa5dqap8tz3yw64q3d4vtsfzmhu7',
    network: 'testnet',
    result: { addressType: 'shelley' },
  },
  {
    description: 'Valid shelley address, preview',
    address: 'addr_test1vpfwv0ezc5g8a4mkku8hhy3y3vp92t7s3ul8g778g5yegsgalc6gc',
    network: 'preview',
    result: { addressType: 'shelley' },
  },
  {
    description: 'Valid shelley address, preprod',
    address: 'addr_test1vpfwv0ezc5g8a4mkku8hhy3y3vp92t7s3ul8g778g5yegsgalc6gc',
    network: 'preprod',
    result: { addressType: 'shelley' },
  },
  {
    description: 'Valid shelley address, sanchonet',
    address: 'addr_test1vpfwv0ezc5g8a4mkku8hhy3y3vp92t7s3ul8g778g5yegsgalc6gc',
    network: 'sanchonet',
    result: { addressType: 'shelley' },
  },
  {
    description: 'Valid paymentCred address, mainnet',
    address: 'addr_vkh1lu3rzd3pwjp54twx32ye9g4gqkr34x7cyp4urt8luq22jvjx5ul',
    network: 'mainnet',
    result: {
      addressType: 'shelley',
      paymentCred:
        '\\xff2231362174834aadc68a8992a2a805871a9bd8206bc1acffe014a9',
      paymentCredPrefix: 'addr_vkh',
    },
  },
  {
    description: 'Invalid shelley address, valid network',
    address: 'addr1stonks',
    network: 'mainnet',
    result: { addressType: undefined },
  },
  {
    description: 'Valid shelley address, invalid network',
    address:
      'addr1qyg5yk36ee0rhl5hw5kxcfng5ygrsv55tuchs0nxjmh9uqmpmpaxya7n6kzmyy6f72st0akwx8zg5n6emrxa5mhywg9q3v23dv',
    network: 'testnet',
    result: { addressType: undefined },
  },
  {
    description: 'Inalid paymentCred address, valid network',
    address: 'addr_vkh1luluwu',
    network: 'mainnet',
    result: { addressType: undefined },
  },
] as const;

export const validatePolicy = [
  {
    description: 'Valid policy',
    input: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae',
    result: true,
  },
  {
    description: 'Valid policy',
    input: 'b863bc7369f46136ac1048adb2fa7dae3af944c3bbb2be2f216a8d4f',
    result: true,
  },
  {
    description: 'Invalid policy ( < length)',
    input: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87a',
    result: false,
  },
  {
    description: 'Invalid policy ( > length)',
    input: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87aef',
    result: false,
  },
  {
    description: 'Invalid policy (hex)',
    input: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ag',
    result: false,
  },
  {
    description: 'Invalid policy ( < length & hex)',
    input: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87g',
    result: false,
  },
  {
    description: 'Invalid policy ( > length & hex)',
    input: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87aeg',
    result: false,
  },
];

export const validateAsset = [
  {
    description: 'Valid asset (min length)',
    input: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae',
    result: true,
  },
  {
    description: 'Valid asset (in between length)',
    input:
      '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae6e7574636f696e',
    result: true,
  },
  {
    description: 'Valid asset (max length)',
    input:
      'fc373a6cfc24c11d925dc48535f661d54edbb04646bea645e7d58ee0447261676f6e73496e6665726e6f516d516d446d357337694376397136653569',
    result: true,
  },
  {
    description: 'Invalid asset ( < length)',
    input: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87a',
    result: false,
  },
  {
    description: 'Invalid asset ( > length)',
    input:
      'fc373a6cfc24c11d925dc48535f661d54edbb04646bea645e7d58ee0447261676f6e73496e6665726e6f516d516d446d3573376943763971366535699',
    result: false,
  },
  {
    description: 'Invalid asset (hex)',
    input:
      '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87ae6e7574636f696eg',
    result: false,
  },
  {
    description: 'Invalid asset ( < length & hex)',
    input: '00000002df633853f6a47465c9496721d2d5b1291b8398016c0e87g',
    result: false,
  },
  {
    description: 'Invalid asset ( > length & hex)',
    input:
      'fc373a6cfc24c11d925dc48535f661d54edbb04646bea645e7d58ee0447261676f6e73496e6665726e6f516d516d446d357337694376397136653569g',
    result: false,
  },
];
