# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- CIP68: Conversion of additional/unknown top-level string metadata props to UTF8 with an option param `convertAdditionalPropsToUTF8: true` passed to `getMetadataFromOutputDatum` fn

## 2.8.0 - 2023-08-23

### Added

- `sanchonet` network support

## 2.7.1 - 2023-08-17

### Changed

- `getAdditionalParametersFromRequest` returns `outOfRangeOrMalformedErr` if a string parameter contains non-numeric characters (eg. `123a`)
- `getAdditionalParametersFromRequest` returns `outOfRangeOrMalformedErr` if a from parameter > to parameter

## 2.7.0 - 2023-08-08

### Added

- `getAdditionalParametersFromRequest` from blockfrost-backend-ryo

## 2.6.2 - 2023-07-09

### Fixed

- parsing CIP68 datum with missing version returns `null` instead of throwing an error

## 2.6.1 - 2023-06-12

## 2.6.0 - 2023-06-12

### Added

- `convertStreamToString` function
- pm2 metrics

## 2.5.0 - 2023-05-17

### Added

- CIP68 RFT 444 support

## 2.4.0 - 2023-03-15

### Removed

- `addr_vk` support in `paymentCredToBech32Address`

## 2.3.2 - 2023-03-07

### Added

- Support for ScriptHash payment credential using `script` addresses.

### Changed

- do not leak framework in errors

## 2.3.1 - 2023-02-06

### Removed

- `addr_vk` is no longer valid address type as returned by `detectAndValidateAddressType`

### Fixed

- CIP68 `getMetadataFromOutputDatum` parsing of `files` and custom fields

## 2.3.0 - 2023-02-02

### Added

- support for `addr_vk` addresses in `paymentCredFromBech32Address`
- `getPaymentPartBech32` for generating partial bech32 address consisting of bech32 prefix, addr header and payment part

### Changed

- fastify dependencies

## 2.2.0 - 2022-12-30

### Added

- Missing custom 400s

## 2.1.1 - 2022-12-30

### Changed

- js implementation of utf-8-validate, no longer requiring node-gyp

## 2.1.0 - 2022-12-28

### Added

- CIP68 utils

## 2.0.0 - 2022-11-27

### Removed

- BREAKING CHANGE: `getSchemaForEndpoint` is now part of the `@blockfrost/openapi` package
- `@blockfrost/openapi` dependency

## 1.1.0 - 2022-11-02

### Added

- `validatePolicy` and `validateAsset` to validation functions
- invalid asset and invalid policy 400 handlers

## 1.0.1 - 2022-10-24

### Changed

- `getAddressTypeAndPaymentCred` to return undefined instead of `''` when there is not valid `paymentCred`

## 1.0.0 - 2022-09-23

### Added

- Initial release
