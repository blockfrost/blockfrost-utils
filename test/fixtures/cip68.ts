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
      rft: '01cecfaeda9d846c08675902b55a6371f593d9239744867462c5382e001bc2804d61747269783734',
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
      rft: '56455542e52eb9b2a823a045d679ae063c09b2c8c4d9c376294315c0001bc280426c6f636b66726f7374546f6b656e',
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
    description: 'valid 444 RFT',
    payload:
      '8ed30c080aba8eb431dabb802ea8dda3a131b0f49c72d2766b25b1eb001bc28068616e646c65735f62675f626f61745f32',
    result: {
      hex: '8ed30c080aba8eb431dabb802ea8dda3a131b0f49c72d2766b25b1eb000643b068616e646c65735f62675f626f61745f32',
      standard: 'rft',
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
      plutusDataJson: {
        decimals: 2,
        description: 'Blockfrost testing fungible token',
        name: 'Blockfrost',
      },
      version: 1,
      extra: undefined,
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
      plutusDataJson: {
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
        contractData: {
          constructor: 0,
          fields: [
            1,
            ['0x160c199daaefcfab1489a33aa60f163cf2500c57711847fad9670864'],
            {
              constructor: 1,
              fields: [],
            },
            '0x1ca3e06a46d694c65601bf8a6a64617b6fc8d783f6710db322681007',
            {
              constructor: 1,
              fields: [],
            },
            {
              constructor: 1,
              fields: [],
            },
          ],
        },
      },
      extra: undefined,
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
      plutusDataJson: {
        decimals: 2,
        description: 'Blockfrost testing fungible token',
        name: 'Blockfrost',
      },
      version: 1,
      extra: undefined,
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
      plutusDataJson: {
        decimals: 2,
        description: 'Blockfrost testing fungible token',
        name: 'Blockfrost',
      },
      version: 1,
      extra: undefined,
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
      plutusDataJson: {
        description: '',
        id: 99,
        image: 'ipfs://QmYNyQbwLCYvjP743Jnud1bozcFPDSXFyYNYUmfQjYs5AQ',
        name: 'Matrix Berry #99',
      },
      version: 1,
      extra: undefined,
    },
  },
  {
    description:
      'unknown prop with number still encoded as cbor even with convertAdditionalProps: true',
    payload:
      'd8799fa4446e616d65506A616E6F206A65206E616A6C6570736945696d6167655835697066733a2f2f516d594e795162774c4359766a503734334a6e756431626f7a6346504453584679594e59556d66516a597335415142696418634b6465736372697074696f6e4001ff',
    options: { standard: 'nft', convertAdditionalProps: true } as const,
    result: {
      metadata: {
        description: '',
        id: 99, // 99 encoded as cbor
        image: 'ipfs://QmYNyQbwLCYvjP743Jnud1bozcFPDSXFyYNYUmfQjYs5AQ',
        name: 'jano je najlepsi',
      },
      plutusDataJson: {
        description: '',
        id: 99,
        image: 'ipfs://QmYNyQbwLCYvjP743Jnud1bozcFPDSXFyYNYUmfQjYs5AQ',
        name: 'jano je najlepsi',
      },
      version: 1,
      extra: undefined,
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
      plutusDataJson: {
        description: '',
        id: 99,
        image: 'ipfs://QmYNyQbwLCYvjP743Jnud1bozcFPDSXFyYNYUmfQjYs5AQ',
        name: '0x4d61747269782042657272792023c328',
      },
      version: 1,
      extra: undefined,
    },
  },
  {
    description: 'RFT datum',
    payload:
      'd8799fa2446e616d655168616e646c65735f62675f626f61745f3245696d6167655835697066733a2f2f516d536b6771614361706777393959326f415a3732746a39694752623839447a4d376b4a50657476736a374e4e4401d8799fac44666f6e74582754696c7420507269736d2c68747470733a2f2f74696e7975726c2e636f6d2f32616e357062356145707269636518324671725f646f744f726f756e6465642c236666363133304b666f6e745f636f6c6f72739f4723666636313330ff4c71725f696e6e65725f6579654e7371756172652c236632663238354c71725f6f757465725f6579654f726f756e6465642c236632663238354d626f726465725f636f6c6f72739f492331323534363239344723373937393836ff517066705f626f726465725f636f6c6f72739f49233132353436323934ff52666f6e745f736861646f775f636f6c6f72739f472330613166643347233232643161664723333162633233ff52746578745f726962626f6e5f636f6c6f72739f472330303030303049233132353436323934ff5371725f6261636b67726f756e645f636f6c6f724923303030303030303054746578745f726962626f6e5f6772616469656e744672616469616cffff',
    options: { standard: 'rft' } as const,
    result: {
      metadata: {
        image: 'ipfs://QmSkgqaCapgw99Y2oAZ72tj9iGRb89DzM7kJPetvsj7NND',
        name: 'handles_bg_boat_2',
      },
      plutusDataJson: {
        image: 'ipfs://QmSkgqaCapgw99Y2oAZ72tj9iGRb89DzM7kJPetvsj7NND',
        name: 'handles_bg_boat_2',
      },
      version: 1,
      extra: {
        hex: 'd8799fac44666f6e74582754696c7420507269736d2c68747470733a2f2f74696e7975726c2e636f6d2f32616e357062356145707269636518324671725f646f744f726f756e6465642c236666363133304b666f6e745f636f6c6f72739f4723666636313330ff4c71725f696e6e65725f6579654e7371756172652c236632663238354c71725f6f757465725f6579654f726f756e6465642c236632663238354d626f726465725f636f6c6f72739f492331323534363239344723373937393836ff517066705f626f726465725f636f6c6f72739f49233132353436323934ff52666f6e745f736861646f775f636f6c6f72739f472330613166643347233232643161664723333162633233ff52746578745f726962626f6e5f636f6c6f72739f472330303030303049233132353436323934ff5371725f6261636b67726f756e645f636f6c6f724923303030303030303054746578745f726962626f6e5f6772616469656e744672616469616cff',
        json: {
          constructor: 0,
          fields: [
            {
              border_colors: ['#12546294', '#797986'],
              font: 'Tilt Prism,https://tinyurl.com/2an5pb5a',
              font_colors: ['#ff6130'],
              font_shadow_colors: ['#0a1fd3', '#22d1af', '#31bc23'],
              pfp_border_colors: ['#12546294'],
              price: 50,
              qr_background_color: '#00000000',
              qr_dot: 'rounded,#ff6130',
              qr_inner_eye: 'square,#f2f285',
              qr_outer_eye: 'rounded,#f2f285',
              text_ribbon_colors: ['#000000', '#12546294'],
              text_ribbon_gradient: 'radial',
            },
          ],
        },
      },
    },
  },
  {
    description:
      'NFT datum with unknown props (utf8 and bytes) with conversion of unknown string props',
    payload:
      'd8799fa6446e616d65581f426c6f636b66726f7374204e46542076322074657374696e6720746f6b656e4b6465736372697074696f6e581f426c6f636b66726f7374204e46542076322074657374696e6720746f6b656e45696d6167655835697066733a2f2f516d5543584d546376754a7077484633674142527236396365515232754547324673696b3943795768384d556f514b756e6b6e6f776e50726f705576657279206d756368207574663820737472696e6750756e6b6e6f776e427974657350726f704aaca8129ef33d442b0cb7466e6573746564a24b756e6b6e6f776e50726f705576657279206d756368207574663820737472696e6750756e6b6e6f776e427974657350726f704aaca8129ef33d442b0cb702ac44666f6e74582754696c7420507269736d2c68747470733a2f2f74696e7975726c2e636f6d2f32616e357062356145707269636518324a666f6e745f636f6c6f7243ff61304671725f646f744f726f756e6465642c236666363133304c71725f696e6e65725f6579654e7371756172652c236632663238354c71725f6f757465725f6579654f726f756e6465642c236632663238354d626f726465725f636f6c6f72739f441254629443797986ff517066705f626f726465725f636f6c6f72739f4412546294ff52666f6e745f736861646f775f636f6c6f72739f430a1fd34322d1af4331bc23ff52746578745f726962626f6e5f636f6c6f72739f430000004412546294ff4b71725f62675f636f6c6f72440000000054746578745f726962626f6e5f6772616469656e744672616469616cff',
    options: { standard: 'nft', convertAdditionalProps: true } as const,
    result: {
      metadata: {
        name: 'Blockfrost NFT v2 testing token',
        description: 'Blockfrost NFT v2 testing token',
        image: 'ipfs://QmUCXMTcvuJpwHF3gABRr69ceQR2uEG2Fsik9CyWh8MUoQ',
        // unknownProp: '5576657279206d756368207574663820737472696e67', // before converting unknown bytes props to utf8
        unknownProp: 'very much utf8 string',
        unknownBytesProp: '4aaca8129ef33d442b0cb7',
        nested:
          'a24b756e6b6e6f776e50726f705576657279206d756368207574663820737472696e6750756e6b6e6f776e427974657350726f704aaca8129ef33d442b0cb7',
      },
      plutusDataJson: {
        name: 'Blockfrost NFT v2 testing token',
        description: 'Blockfrost NFT v2 testing token',
        image: 'ipfs://QmUCXMTcvuJpwHF3gABRr69ceQR2uEG2Fsik9CyWh8MUoQ',
        // unknownProp: '5576657279206d756368207574663820737472696e67', // before converting unknown bytes props to utf8
        unknownProp: 'very much utf8 string',
        unknownBytesProp: '0xaca8129ef33d442b0cb7',
        nested: {
          unknownProp: 'very much utf8 string',
          unknownBytesProp: '0xaca8129ef33d442b0cb7',
        },
      },
      version: 2,
      extra: {
        hex: 'ac44666f6e74582754696c7420507269736d2c68747470733a2f2f74696e7975726c2e636f6d2f32616e357062356145707269636518324a666f6e745f636f6c6f7243ff61304671725f646f744f726f756e6465642c236666363133304c71725f696e6e65725f6579654e7371756172652c236632663238354c71725f6f757465725f6579654f726f756e6465642c236632663238354d626f726465725f636f6c6f72739f441254629443797986ff517066705f626f726465725f636f6c6f72739f4412546294ff52666f6e745f736861646f775f636f6c6f72739f430a1fd34322d1af4331bc23ff52746578745f726962626f6e5f636f6c6f72739f430000004412546294ff4b71725f62675f636f6c6f72440000000054746578745f726962626f6e5f6772616469656e744672616469616c',
        json: {
          border_colors: ['0x12546294', '0x797986'],
          font: 'Tilt Prism,https://tinyurl.com/2an5pb5a',
          font_color: '0xff6130',
          font_shadow_colors: ['0x0a1fd3', '"ѯ', '0x31bc23'],
          pfp_border_colors: ['0x12546294'],
          price: 50,
          qr_bg_color: '0x00000000',
          qr_dot: 'rounded,#ff6130',
          qr_inner_eye: 'square,#f2f285',
          qr_outer_eye: 'rounded,#f2f285',
          text_ribbon_colors: ['0x000000', '0x12546294'],
          text_ribbon_gradient: 'radial',
        },
      },
    },
  },
  {
    description: 'NFT datum with unknown props (utf8 and bytes)',
    payload:
      'd8799fa6446e616d65581f426c6f636b66726f7374204e46542076322074657374696e6720746f6b656e4b6465736372697074696f6e581f426c6f636b66726f7374204e46542076322074657374696e6720746f6b656e45696d6167655835697066733a2f2f516d5543584d546376754a7077484633674142527236396365515232754547324673696b3943795768384d556f514b756e6b6e6f776e50726f705576657279206d756368207574663820737472696e6750756e6b6e6f776e427974657350726f704aaca8129ef33d442b0cb7466e6573746564a24b756e6b6e6f776e50726f705576657279206d756368207574663820737472696e6750756e6b6e6f776e427974657350726f704aaca8129ef33d442b0cb702ac44666f6e74582754696c7420507269736d2c68747470733a2f2f74696e7975726c2e636f6d2f32616e357062356145707269636518324a666f6e745f636f6c6f7243ff61304671725f646f744f726f756e6465642c236666363133304c71725f696e6e65725f6579654e7371756172652c236632663238354c71725f6f757465725f6579654f726f756e6465642c236632663238354d626f726465725f636f6c6f72739f441254629443797986ff517066705f626f726465725f636f6c6f72739f4412546294ff52666f6e745f736861646f775f636f6c6f72739f430a1fd34322d1af4331bc23ff52746578745f726962626f6e5f636f6c6f72739f430000004412546294ff4b71725f62675f636f6c6f72440000000054746578745f726962626f6e5f6772616469656e744672616469616cff',
    options: { standard: 'nft', convertAdditionalProps: false } as const,
    result: {
      metadata: {
        name: 'Blockfrost NFT v2 testing token',
        description: 'Blockfrost NFT v2 testing token',
        image: 'ipfs://QmUCXMTcvuJpwHF3gABRr69ceQR2uEG2Fsik9CyWh8MUoQ',
        // unknownProp: '5576657279206d756368207574663820737472696e67', // before converting unknown bytes props to utf8
        unknownProp: '5576657279206d756368207574663820737472696e67',
        unknownBytesProp: '4aaca8129ef33d442b0cb7',
        nested:
          'a24b756e6b6e6f776e50726f705576657279206d756368207574663820737472696e6750756e6b6e6f776e427974657350726f704aaca8129ef33d442b0cb7',
      },
      plutusDataJson: {
        name: 'Blockfrost NFT v2 testing token',
        description: 'Blockfrost NFT v2 testing token',
        image: 'ipfs://QmUCXMTcvuJpwHF3gABRr69ceQR2uEG2Fsik9CyWh8MUoQ',
        // unknownProp: '5576657279206d756368207574663820737472696e67', // before converting unknown bytes props to utf8
        unknownProp: 'very much utf8 string',
        unknownBytesProp: '0xaca8129ef33d442b0cb7',
        nested: {
          unknownProp: 'very much utf8 string',
          unknownBytesProp: '0xaca8129ef33d442b0cb7',
        },
      },
      version: 2,
      extra: {
        hex: 'ac44666f6e74582754696c7420507269736d2c68747470733a2f2f74696e7975726c2e636f6d2f32616e357062356145707269636518324a666f6e745f636f6c6f7243ff61304671725f646f744f726f756e6465642c236666363133304c71725f696e6e65725f6579654e7371756172652c236632663238354c71725f6f757465725f6579654f726f756e6465642c236632663238354d626f726465725f636f6c6f72739f441254629443797986ff517066705f626f726465725f636f6c6f72739f4412546294ff52666f6e745f736861646f775f636f6c6f72739f430a1fd34322d1af4331bc23ff52746578745f726962626f6e5f636f6c6f72739f430000004412546294ff4b71725f62675f636f6c6f72440000000054746578745f726962626f6e5f6772616469656e744672616469616c',
        json: {
          border_colors: ['0x12546294', '0x797986'],
          font: 'Tilt Prism,https://tinyurl.com/2an5pb5a',
          font_color: '0xff6130',
          font_shadow_colors: ['0x0a1fd3', '"ѯ', '0x31bc23'],
          pfp_border_colors: ['0x12546294'],
          price: 50,
          qr_bg_color: '0x00000000',
          qr_dot: 'rounded,#ff6130',
          qr_inner_eye: 'square,#f2f285',
          qr_outer_eye: 'rounded,#f2f285',
          text_ribbon_colors: ['0x000000', '0x12546294'],
          text_ribbon_gradient: 'radial',
        },
      },
    },
  },
  {
    description: 'NFT datum with bigint',
    payload:
      'd8799fa4446e616d65581f426c6f636b66726f7374204e46542076322074657374696e6720746f6b656e4b6465736372697074696f6e581f426c6f636b66726f7374204e46542076322074657374696e6720746f6b656e45696d6167655835697066733a2f2f516d5543584d546376754a7077484633674142527236396365515232754547324673696b3943795768384d556f51466269676e756dc24b01056e0f36a6443de2df7902ac44666f6e74582754696c7420507269736d2c68747470733a2f2f74696e7975726c2e636f6d2f32616e357062356145707269636518324a666f6e745f636f6c6f7243ff61304671725f646f744f726f756e6465642c236666363133304c71725f696e6e65725f6579654e7371756172652c236632663238354c71725f6f757465725f6579654f726f756e6465642c236632663238354d626f726465725f636f6c6f72739f441254629443797986ff517066705f626f726465725f636f6c6f72739f4412546294ff52666f6e745f736861646f775f636f6c6f72739f430a1fd34322d1af4331bc23ff52746578745f726962626f6e5f636f6c6f72739f430000004412546294ff4b71725f62675f636f6c6f72440000000054746578745f726962626f6e5f6772616469656e744672616469616cff',
    options: { standard: 'nft', convertAdditionalProps: true } as const,
    result: {
      metadata: {
        name: 'Blockfrost NFT v2 testing token',
        description: 'Blockfrost NFT v2 testing token',
        image: 'ipfs://QmUCXMTcvuJpwHF3gABRr69ceQR2uEG2Fsik9CyWh8MUoQ',
        // unknownProp: '5576657279206d756368207574663820737472696e67', // before converting unknown bytes props to utf8
        bignum: 1234567890123456789012345n,
      },
      plutusDataJson: {
        name: 'Blockfrost NFT v2 testing token',
        description: 'Blockfrost NFT v2 testing token',
        image: 'ipfs://QmUCXMTcvuJpwHF3gABRr69ceQR2uEG2Fsik9CyWh8MUoQ',
        bignum: '1234567890123456789012345', // CSL supports bigint conversion only in CSL v12 nad up
      },
      version: 2,
      extra: {
        hex: 'ac44666f6e74582754696c7420507269736d2c68747470733a2f2f74696e7975726c2e636f6d2f32616e357062356145707269636518324a666f6e745f636f6c6f7243ff61304671725f646f744f726f756e6465642c236666363133304c71725f696e6e65725f6579654e7371756172652c236632663238354c71725f6f757465725f6579654f726f756e6465642c236632663238354d626f726465725f636f6c6f72739f441254629443797986ff517066705f626f726465725f636f6c6f72739f4412546294ff52666f6e745f736861646f775f636f6c6f72739f430a1fd34322d1af4331bc23ff52746578745f726962626f6e5f636f6c6f72739f430000004412546294ff4b71725f62675f636f6c6f72440000000054746578745f726962626f6e5f6772616469656e744672616469616c',
        json: {
          border_colors: ['0x12546294', '0x797986'],
          font: 'Tilt Prism,https://tinyurl.com/2an5pb5a',
          font_color: '0xff6130',
          font_shadow_colors: ['0x0a1fd3', '"ѯ', '0x31bc23'],
          pfp_border_colors: ['0x12546294'],
          price: 50,
          qr_bg_color: '0x00000000',
          qr_dot: 'rounded,#ff6130',
          qr_inner_eye: 'square,#f2f285',
          qr_outer_eye: 'rounded,#f2f285',
          text_ribbon_colors: ['0x000000', '0x12546294'],
          text_ribbon_gradient: 'radial',
        },
      },
    },
  },
  {
    description:
      'NFT datum with non-utf8 prop (0xdeadbeef) convertAdditionalProps: false',
    payload:
      'd8799fa6446e616d65581f426c6f636b66726f7374204e46542076322074657374696e6720746f6b656e4b6465736372697074696f6e581f426c6f636b66726f7374204e46542076322074657374696e6720746f6b656e45696d6167655835697066733a2f2f516d5543584d546376754a7077484633674142527236396365515232754547324673696b3943795768384d556f5148646561646265656643616e6f44deadbeef426e65545b6f626a6563742041727261794275666665725dc24b01056e0f36a6443de2df7902ff',
    options: { standard: 'nft', convertAdditionalProps: false } as const,
    result: {
      metadata: {
        name: 'Blockfrost NFT v2 testing token',
        description: 'Blockfrost NFT v2 testing token',
        image: 'ipfs://QmUCXMTcvuJpwHF3gABRr69ceQR2uEG2Fsik9CyWh8MUoQ',
        deadbeef: '426e65',
        '[object ArrayBuffer]': 'c24b01056e0f36a6443de2df79',
      },
      plutusDataJson: {
        name: 'Blockfrost NFT v2 testing token',
        description: 'Blockfrost NFT v2 testing token',
        image: 'ipfs://QmUCXMTcvuJpwHF3gABRr69ceQR2uEG2Fsik9CyWh8MUoQ',
        '0xdeadbeef': 'ne',
        deadbeef: 'ano',
        '[object ArrayBuffer]': '1234567890123456789012345',
      },
      version: 2,
      extra: undefined,
    },
  },
  {
    description: 'NFT datum with non-utf8 prop (0xdeadbeef)',
    payload:
      'd8799fa6446e616d65581f426c6f636b66726f7374204e46542076322074657374696e6720746f6b656e4b6465736372697074696f6e581f426c6f636b66726f7374204e46542076322074657374696e6720746f6b656e45696d6167655835697066733a2f2f516d5543584d546376754a7077484633674142527236396365515232754547324673696b3943795768384d556f5148646561646265656643616e6f44deadbeef426e65545b6f626a6563742041727261794275666665725dc24b01056e0f36a6443de2df7902ff',
    options: { standard: 'nft', convertAdditionalProps: true } as const,
    result: {
      metadata: {
        name: 'Blockfrost NFT v2 testing token',
        description: 'Blockfrost NFT v2 testing token',
        image: 'ipfs://QmUCXMTcvuJpwHF3gABRr69ceQR2uEG2Fsik9CyWh8MUoQ',
        deadbeef: 'ne',
        '[object ArrayBuffer]': 1234567890123456789012345n,
      },
      plutusDataJson: {
        name: 'Blockfrost NFT v2 testing token',
        description: 'Blockfrost NFT v2 testing token',
        image: 'ipfs://QmUCXMTcvuJpwHF3gABRr69ceQR2uEG2Fsik9CyWh8MUoQ',
        '0xdeadbeef': 'ne',
        deadbeef: 'ano',
        '[object ArrayBuffer]': '1234567890123456789012345',
      },
      version: 2,
      extra: undefined,
    },
  },
  {
    description:
      'Missing version field (datum = #6.121([metadata, version, extra]))',
    payload:
      'd8799fa6446e616d654847656e69757320584b6465736372697074696f6e582547656e6975732058207574696c69747920616e6420676f7665726e616e636520746f6b656e467469636b65724547454e53584375726c581868747470733a2f2f7777772e67656e6975732d782e636f2f446c6f676f5835697066733a2f2f516d635667683678677643364b4575797a72514d4d55753952656162377958786f5a58384352614a6d755937573148646563696d616c7306ff',
    options: { standard: 'nft' } as const,
    result: null,
  },
];
