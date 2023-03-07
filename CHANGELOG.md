# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

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
