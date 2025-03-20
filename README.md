<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./logo-dark.svg">
    <img alt="Playlist. TypeScript tools for working with M3U playlist data." src="./logo.svg">
  </picture>

# @iptv/playlist

An extremely fast M3U playlist parser and generator for Node and the browser. <br>Lightweight, dependency-free, and easy to use.

---

[![npm](https://img.shields.io/npm/v/@iptv/playlist?style=flat-square)](https://www.npmjs.com/package/@iptv/playlist)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/ektotv/playlist/ci.yml?branch=main&style=flat-square)](https://github.com/ektotv/playlist/actions/workflows/ci.yml)
[![Coverage](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/evoactivity/7c8deb6342792baafac8834185e96476/raw/iptv_playlist_coverage.json&style=flat-square)](https://github.com/ektotv/playlist/tree/main/tests)
[![GitHub](https://img.shields.io/github/license/ektotv/playlist?style=flat-square)](LICENSE.md)

</div>

---

## ✨ Features

- **Extremely** fast M3U parser and generator
- Lightweight (1.34 kB gzipped)
- No dependencies
- ESM and CommonJS support
- Supports Node and the browser
- Supports **any** M3U `#EXTINF` & `#EXTM3U` attribute
- Did I mention [it's fast](#-performance)?

---

## 📥 Installation

To install this library, use the following command:

```bash
# pnpm
pnpm add @iptv/playlist

# npm
npm install @iptv/playlist

# yarn
yarn add @iptv/playlist
```

---

## 🔧 Usage

To use this library in your project, first import the functions you need:

```typescript
import { parseM3U, writeM3U } from '@iptv/playlist';
```

Then, you can parse an M3U file and receive back an `M3uPlaylist` object:

<details>
  <summary>Example M3U File</summary>

Examples will be based on this M3U file, it can be found in the [tests/fixtures](tests/fixtures) directory.

```m3u
#EXTM3U
#EXTINF:-1 tvg-id="Channel1" tvg-name="Channel 1" tvg-language="English" group-title="News",Channel 1
http://server:port/channel1
```

</details>

```typescript
const m3u = `...`; // M3U file contents
const playlist: M3uPlaylist = parseM3U(m3u);
const channels: M3uChannel[] = playlist.channels;
```

<details>
  <summary>Example output of `parseM3U()`</summary>

```typescript
{
  channels: [
    {
      tvgId: 'Channel1',
      tvgName: 'Channel 1',
      tvgLanguage: 'English',
      groupTitle: 'News',
      duration: -1,
      name: 'Channel 1',
      url: 'http://server:port/channel1',
      extras: {
        'your-custom-attribute': 'your-custom-value'
      }
    },
  ],
  headers: {}
}
```

</details>

You can also generate an M3U file from a `M3uPlaylist` object:

```typescript
const playlistObject: M3uPlaylist = {
  channels: [
    {
      tvgId: 'Channel1',
      tvgName: 'Channel 1',
      tvgLanguage: 'English',
      groupTitle: 'News',
      duration: -1,
      name: 'Channel 1',
      url: 'http://server:port/channel1',
      extras: {
        'your-custom-attribute': 'your-custom-value',
      },
    },
  ],
  headers: {},
};
const m3u = writeM3U(playlistObject);
console.log(m3u); // #EXTM3U ...
```

### Standard Attributes

This library supports all standard attributes for the `#EXTINF` and `#EXTM3U` tags. They will be parsed, camelCased and added as properties on the `M3uChannel` object.

### Custom Attributes

This library supports any custom attributes you may have in your M3U file. They will be parsed and generated as an object under the `extras` property of the `M3uChannel` object.

```m3u
#EXTM3U
#EXTINF:-1 tvg-id="Channel1" tvg-name="Channel 1" tvg-language="English" group-title="News" custom-attribute="hello",Channel 1
http://server:port/channel1
```

```typescript
const m3u = `...`; // M3U file contents
const playlist: M3uPlaylist = parseM3U(m3u);
const channel: M3uChannel = playlist.channels[0];
console.log(channel.extras); // { 'custom-attribute': 'hello' }
```

---

## ⚡ Performance

This library has been optimized for parsing and generating M3U files quickly and efficiently. In my benchmarks, it performs better than [iptv-playlist-parser](https://www.npmjs.com/package/iptv-playlist-parser), [iptv-playlist-generator](https://www.npmjs.com/package/iptv-playlist-generator) and [m3u-parser-generator](https://www.npmjs.com/package//m3u-parser-generator).

### Benchmarks

#### Parsing M3U file (small.m3u8)

<table>
  <thead>
    <tr>
        <th align="left"></th>
        <th align="left">Library</th>
        <th align="left">Ops/sec</th>
      </tr>
  </thead>
  <tbody>
    <tr>
      <th>🟢</th>
      <th align="left">@iptv/playlist</th>
      <td align="right">1,363,859</td>
    </tr>
    <tr>
      <th></th>
      <th align="left">m3u-parser-generator</th>
      <td align="right">607,573</td>
    </tr>
    <tr>
      <th>🔴</th>
      <th align="left">iptv-playlist-parser</th>
      <td align="right">244,150</td>
    </tr>
  </tbody>
</table>

#### Writing M3U file (small.m3u8)

<table>
  <thead>
    <tr>
      <th align="left"></th>
      <th align="left">Library</th>
      <th align="left">Ops/sec</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th align="left">🟢</th>
      <th align="left">@iptv/playlist</th>
      <td align="right">10,514,760</td>
    </tr>
     <tr>
      <th align="left"></th>
      <th align="left">iptv-playlist-generator</th>
      <td align="right">3,119,304</td>
    </tr>
    <tr>
      <th align="left">🔴</th>
      <th align="left">m3u-parser-generator</th>
      <td align="right">1,816,358</td>
    </tr>
  </tbody>
</table>

#### Time spent parsing different M3U files

<table>
  <thead>
    <tr>
      <th align="left"></th>
      <th align="left">Channels</th>
      <th align="right">1</th>
      <th align="right">100</th>
      <th align="right">500</th>
      <th align="right">1,000</th>
      <th align="right">10,000</th>
      <th align="right">100,000</th>
      <th align="right">1,000,000</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th align="left">🟢</th>
      <th align="left">@iptv/playlist</th>
      <td align="right">~11 μs</td>
      <td align="right">~201 μs</td>
      <td align="right">~894 μs</td>
      <td align="right">~1.94 ms</td>
      <td align="right">~5.41 ms</td>
      <td align="right">~67 ms</td>
      <td align="right">~681 ms</td>
    </tr>
    <tr>
      <th align="left"></th>
      <th align="left">m3u-parser-generator</th>
      <td align="right">~17 μs</td>
      <td align="right">~226 μs</td>
      <td align="right">~1.23 ms</td>
      <td align="right">~3.66 ms</td>
      <td align="right">~17 ms</td>
      <td align="right">~153 ms</td>
      <td align="right">~1.68 s</td>
    </tr>
    <tr>
      <th align="left">🔴</th>
      <th align="left">iptv-playlist-parser</th>
      <td align="right">~116 μs</td>
      <td align="right">~513 μs</td>
      <td align="right">~2.61 ms</td>
      <td align="right">~5.17 ms</td>
      <td align="right">~57 ms</td>
      <td align="right">~385 ms</td>
      <td align="right">~3.94 s</td>
    </tr>
  </tbody>
</table>

<p><sup>I used nanobench to get the above times.</sup></p>

<p><sup>These benchmarks were run on a 2021 MacBook Pro M1 Max (10 cores) with 64 GB of RAM.</sup></p>

---

## 🎯 Future Goals

### Worker Support

Even though it's fast and it won't block for long, this will block your main thread whilst it runs. I'd like to add support for running the parser in a worker so it doesn't block at all.

## 🚫 Non-Goals

### HLS Parsing

This library is designed to parse and generate media player playlist files only. It is not designed to be a generic m3u parser or generator. It will not parse or generate HLS playlists.

---

## 🤝 Contributing

Contributions are welcome! Even better if they align with the [future goals](#-future-goals).

You'll need to be able to run the tests and benchmarks. To do so, you will need to run the `./create-fixtures.sh` script in the `tests/fixtures` directory to generate the necessary fixture files.

To be accepted your PR must pass all tests and not negatively impact the benchmarks. Some commands to help you:

- `pnpm run test` - Run the vitest suite
- `pnpm run benny` - Run benchmarks with benny
- `pnpm run benchmark` - Run benchmarks with vitest
- `pnpm run nanobench` - Run additional timing benchmarks

This project uses [Changesets](https://github.com/changesets/changesets) to manage releases. For you, this just means your PR must come with an appropriate changeset file. If you're not sure how to do this, just ask and I'll be happy to help, or read the changesets documentation on [adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md).

## 📄 License & Credit

This library is licensed under the [MIT License](https://github.com/ektotv/playlist/LICENSE.md) and is free to use in both open source and commercial projects.
