# @iptv/playlist

## 1.2.0

### Minor Changes

- [#17](https://github.com/ektotv/playlist/pull/17) [`e63b861`](https://github.com/ektotv/playlist/commit/e63b8614bc2a1598a7babe2552700bba514f88a2) Thanks [@evoactivity](https://github.com/evoactivity)! - - Fixes infinite loop on random strings
  - Handles multiple urls with a new urls array

## 1.1.1

### Patch Changes

- [#15](https://github.com/ektotv/playlist/pull/15) [`bc57ff7`](https://github.com/ektotv/playlist/commit/bc57ff7af11c28c7dae9b7d72316877a9c934637) Thanks [@evoactivity](https://github.com/evoactivity)! - - Update dev dependencies
  - Add better comments to the types for intellisense
  - Internal changes for documentation generation and adding prettier to project

## 1.1.0

### Minor Changes

- [#12](https://github.com/ektotv/playlist/pull/12) [`98065fa`](https://github.com/ektotv/playlist/commit/98065fa057fe4d33705538011a34f3a045b1b38e) Thanks [@evoactivity](https://github.com/evoactivity)! - Adds support for the tv-chno field

## 1.0.1

### Patch Changes

- [#10](https://github.com/ektotv/playlist/pull/10) [`1e38b6e`](https://github.com/ektotv/playlist/commit/1e38b6e3c56a7601540128d550ef9067888d3379) Thanks [@chrisbenincasa](https://github.com/chrisbenincasa)! - Export all types in generated declaration file

## 1.0.0

### Major Changes

- [#7](https://github.com/ektotv/playlist/pull/7) [`22b3fa3`](https://github.com/ektotv/playlist/commit/22b3fa38a084de12cf99ece82197d97118f6f4ba) Thanks [@evoactivity](https://github.com/evoactivity)! - Use DTS workaround to generate index.d.cts for CJS build

  We also are bumping the package to v1.0.0 as we feel it is now proven to be stable and ready for production use.

## 0.0.4

### Patch Changes

- [#4](https://github.com/ektotv/playlist/pull/4) [`a4f3d67`](https://github.com/ektotv/playlist/commit/a4f3d6700ec2352ae52f1df0ee86069d65d7ba6b) Thanks [@evoactivity](https://github.com/evoactivity)! - Partially fix type exports in package.json

## 0.0.3

### Patch Changes

- [`4c0da2d`](https://github.com/ektotv/playlist/commit/4c0da2d7544ca443bc177e6167f0d6fee1f21fa9) Thanks [@evoactivity](https://github.com/evoactivity)!
  - (bug) If no headers are passed to writeM3U it doesn't add a new line after EXTM3U.
  - (feat) Improved writer performance.
  - (chore) Updated vitest
  - (chore) Brought code coverage to 100%

## 0.0.2

### Patch Changes

- [`cfa2bf5`](https://github.com/ektotv/playlist/commit/cfa2bf549c9daece49727dba82d476f4c328b800) Thanks [@evoactivity](https://github.com/evoactivity)! - Update vitest and use new v8 coverage tool

## 0.0.1

### Patch Changes

- [`9da80a1`](https://github.com/ektotv/playlist/commit/9da80a1942a6c0797fe91bdaad42f3875a9e645c) Thanks [@evoactivity](https://github.com/evoactivity)! - First release of playlist parser and generator
