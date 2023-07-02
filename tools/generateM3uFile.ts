#!/usr/bin/env -S ts-node --esm

import { M3uPlaylist, writeM3U } from "../src/main.js";
import argparse, { ArgumentParser } from "argparse";

/**
 * Generate a m3u playlist file with the given number of channels and optional headers
 *
 * Usage:
 *   ./generateM3uFile.ts -c 100 -h > tests/fixtures/c100-h.m3u8
 *   ./generateM3uFile.ts --channels 100 --headers > tests/fixtures/c100-h.m3u8
 */
const parser = new ArgumentParser({
  description: "Generate playlist m3u file",
});

parser.add_argument("-c", "--channels", {
  help: "Number of channels to generate",
  required: true,
});
parser.add_argument("-H", "--headers", {
  help: "If it should include headers",
  action: argparse.BooleanOptionalAction,
});
const { channels: numberOfChannels, headers } = parser.parse_args();

const channelFactory = (count: number) => {
  const channels: any = [];
  for (let i = 0; i < count; i++) {
    channels.push({
      name: `Channel ${i}`,
      url: `http://example.com/${i}`,
      tvgName: `Channel ${i}`,
      tvgId: `channel${i}.uk`,
      tvgLogo: `http://example.com/${i}.png`,
      groupTitle: `Group ${i}`,
    });
  }
  return channels;
};

const channels = channelFactory(numberOfChannels);

const playlist: M3uPlaylist = {
  channels,
};

if (headers) {
  playlist.headers = {
    "x-tvg-url": "http://example.com/tvg.xml",
  };
}

const playlistString = writeM3U(playlist);

// @ts-ignore
process.stdout.write(playlistString + "\n");
