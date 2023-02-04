export const fromLabel = [
  { description: 'min value', payload: '00000000', result: 0 },
  { description: 'in between', payload: '02b670b0', result: 11111 },
  { description: 'max value', payload: '0ffff240', result: 65535 },
  { description: 'max value', payload: '0ffff240', result: 65535 },
  { description: 'invalid label', payload: 'invalidlabel', result: null },
];

export const toLabel = [
  { description: 'min value', payload: 0, result: '00000000' },
  { description: 'in between', payload: 11111, result: '02b670b0' },
  { description: 'max value', payload: 65535, result: '0ffff240' },
  { description: 'value out of range throws', payload: 999999, result: Error },
];

export const toUTF8OrHex = [
  {
    description: 'Matrix Berry #99',
    payload: '4d617472697820426572727920233939',
    result: 'Matrix Berry #99',
  },
  {
    description: 'empty string',
    payload: '',
    result: '',
  },
  {
    description: 'invalid utf-8',
    payload: 'e03e382e7e637866',
    result: 'e03e382e7e637866',
  },
];

export const toCip68Assets = [
  {
    description: 'get all labels from cip68 asset',
    payload:
      '01cecfaeda9d846c08675902b55a6371f593d9239744867462c5382e000643b04d61747269783734',
    result: {
      reference_nft:
        '01cecfaeda9d846c08675902b55a6371f593d9239744867462c5382e000643b04d61747269783734',
      // ft does not exist
      ft: '01cecfaeda9d846c08675902b55a6371f593d9239744867462c5382e0014df104d61747269783734',
      // nft exists
      nft: '01cecfaeda9d846c08675902b55a6371f593d9239744867462c5382e000de1404d61747269783734',
    },
  },
  {
    description: 'get all labels for Blockfrost test token',
    payload:
      '56455542e52eb9b2a823a045d679ae063c09b2c8c4d9c376294315c00014df10426c6f636b66726f7374546f6b656e',
    result: {
      reference_nft:
        '56455542e52eb9b2a823a045d679ae063c09b2c8c4d9c376294315c0000643b0426c6f636b66726f7374546f6b656e',
      // ft exists
      ft: '56455542e52eb9b2a823a045d679ae063c09b2c8c4d9c376294315c00014df10426c6f636b66726f7374546f6b656e',
      nft: '56455542e52eb9b2a823a045d679ae063c09b2c8c4d9c376294315c0000de140426c6f636b66726f7374546f6b656e',
    },
  },
  {
    description: 'non cip68 asset',
    payload:
      '416958a374690d4597b50428be9c060aed5217e75807310cefdf701062616e616e6173',
    result: null,
  },
];

export const getReferenceNFT = [
  {
    description: 'valid 222 ft token',
    payload:
      '56455542e52eb9b2a823a045d679ae063c09b2c8c4d9c376294315c00014df10426c6f636b66726f7374546f6b656e',
    result: {
      hex: '56455542e52eb9b2a823a045d679ae063c09b2c8c4d9c376294315c0000643b0426c6f636b66726f7374546f6b656e',
      standard: 'ft',
    },
  },
  {
    description: 'valid 222 nft token',
    payload:
      '01cecfaeda9d846c08675902b55a6371f593d9239744867462c5382e000de1404d61747269783734',
    result: {
      hex: '01cecfaeda9d846c08675902b55a6371f593d9239744867462c5382e000643b04d61747269783734',
      standard: 'nft',
    },
  },
  {
    description: 'non cip68 asset',
    payload:
      '416958a374690d4597b50428be9c060aed5217e75807310cefdf701062616e616e6173',
    result: null,
  },
];

export const getMetadataFromOutputDatum = [
  {
    description: 'invalid standard, every value returned as cbor',
    payload:
      'd8799fa3446e616d654a426c6f636b66726f73744b6465736372697074696f6e5821426c6f636b66726f73742074657374696e672066756e6769626c6520746f6b656e48646563696d616c730201ff',
    options: { standard: 'invalid' } as const,
    result: {
      metadata: {
        decimals: '02',
        description:
          '5821426c6f636b66726f73742074657374696e672066756e6769626c6520746f6b656e',
        name: '4a426c6f636b66726f7374',
      },
      version: 1,
      extra: null,
    },
  },
  {
    description: 'NFT with files',
    payload:
      'd87982a5446e616d65464e46542023314566696c657381a3437372635835697066733a2f2f516d503774507877396b636e785045564e53374e524a7579523756567a3963345a6168787a33674e384c4574464d446e616d65464e4654202331496d656469615479706549696d6167652f706e6745696d6167655835697066733a2f2f516d503774507877396b636e785045564e53374e524a7579523756567a3963345a6168787a33674e384c4574464d496d656469615479706549696d6167652f706e674c636f6e747261637444617461d879860181581c160c199daaefcfab1489a33aa60f163cf2500c57711847fad9670864d87a80581c1ca3e06a46d694c65601bf8a6a64617b6fc8d783f6710db322681007d87a80d87a8001',
    options: { standard: 'nft' } as const,
    result: {
      version: 1,
      metadata: {
        files: [
          {
            src: 'ipfs://QmP7tPxw9kcnxPEVNS7NRJuyR7VVz9c4Zahxz3gN8LEtFM',
            name: 'NFT #1',
            mediaType: 'image/png',
          },
        ],
        image: 'ipfs://QmP7tPxw9kcnxPEVNS7NRJuyR7VVz9c4Zahxz3gN8LEtFM',
        mediaType: 'image/png',
        name: 'NFT #1',
        contractData:
          'd879860181581c160c199daaefcfab1489a33aa60f163cf2500c57711847fad9670864d87a80581c1ca3e06a46d694c65601bf8a6a64617b6fc8d783f6710db322681007d87a80d87a80',
      },
      extra: null,
    },
  },
  {
    description: 'Blockfrost FT',
    payload:
      'd8799fa3446e616d654a426c6f636b66726f73744b6465736372697074696f6e5821426c6f636b66726f73742074657374696e672066756e6769626c6520746f6b656e48646563696d616c730201ff',
    options: { standard: 'ft' } as const,
    result: {
      metadata: {
        decimals: 2,
        description: 'Blockfrost testing fungible token',
        name: 'Blockfrost',
      },
      version: 1,
      extra: null,
    },
  },
  {
    description: 'Blockfrost FT parsed as NFT',
    payload:
      'd8799fa3446e616d654a426c6f636b66726f73744b6465736372697074696f6e5821426c6f636b66726f73742074657374696e672066756e6769626c6520746f6b656e48646563696d616c730201ff',
    options: { standard: 'nft' } as const,
    result: {
      metadata: {
        decimals: '02', // decimals are not part of NFT standard so they are left as CBOR
        description: 'Blockfrost testing fungible token',
        name: 'Blockfrost',
      },
      version: 1,
      extra: null,
    },
  },
  {
    description: 'Matrix Berry reference NFT datum',
    payload:
      'd8799fa4446e616d65504d61747269782042657272792023393945696d6167655835697066733a2f2f516d594e795162774c4359766a503734334a6e756431626f7a6346504453584679594e59556d66516a597335415142696418634b6465736372697074696f6e4001ff',
    options: { standard: 'nft' } as const,
    result: {
      metadata: {
        description: '',
        id: '1863',
        image: 'ipfs://QmYNyQbwLCYvjP743Jnud1bozcFPDSXFyYNYUmfQjYs5AQ',
        name: 'Matrix Berry #99',
      },
      version: 1,
      extra: null,
    },
  },
  {
    description: 'jano je najlepsi reference NFT datum',
    payload:
      'd8799fa4446e616d65506A616E6F206A65206E616A6C6570736945696d6167655835697066733a2f2f516d594e795162774c4359766a503734334a6e756431626f7a6346504453584679594e59556d66516a597335415142696418634b6465736372697074696f6e4001ff',
    options: { standard: 'nft' } as const,
    result: {
      metadata: {
        description: '',
        id: '1863', // 99 encoded as cbor
        image: 'ipfs://QmYNyQbwLCYvjP743Jnud1bozcFPDSXFyYNYUmfQjYs5AQ',
        name: 'jano je najlepsi',
      },
      version: 1,
      extra: null,
    },
  },
  {
    description: 'NFT datum with non-utf8 name (cr28 at the end of the name)',
    payload:
      'd8799fa4446e616d65504d61747269782042657272792023c32845696d6167655835697066733a2f2f516d594e795162774c4359766a503734334a6e756431626f7a6346504453584679594e59556d66516a597335415142696418634b6465736372697074696f6e4001ff',
    options: { standard: 'nft' } as const,
    result: {
      metadata: {
        description: '',
        id: '1863',
        image: 'ipfs://QmYNyQbwLCYvjP743Jnud1bozcFPDSXFyYNYUmfQjYs5AQ',
        name: '4d61747269782042657272792023c328',
      },
      version: 1,
      extra: null,
    },
  },
];
