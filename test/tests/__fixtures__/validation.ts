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
    result: '\\x1c73279376bf71085068cd4167523f48695f3865564a497dc9292638',
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
