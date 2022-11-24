# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added 

- `getCIPstandard`, `getOnchainMetadata`, `getOnchainMetadataVersion` functions

## [1.1.0] - 2022-11-02

### Added

- `validatePolicy` and `validateAsset` to validation functions
- invalid asset and invalid policy 400 handlers

## [1.0.1] - 2022-10-24

### Changed

- `getAddressTypeAndPaymentCred` to return undefined instead of `''` when there is not valid `paymentCred`

## [1.0.0] - 2022-09-23

### Added

- Initial release
