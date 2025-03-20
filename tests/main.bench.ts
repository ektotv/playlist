import fs from 'node:fs';
import path from 'node:path';
import { describe, bench } from 'vitest';
import { parseM3U } from '../src/main.js';
import ippParser from 'iptv-playlist-parser';
import { M3uParser } from 'm3u-parser-generator';

const playlistString = fs.readFileSync(
  path.join(path.resolve(), 'tests/fixtures/small.m3u8'),
  'utf8',
);

describe('Parsing Files', () => {
  bench('@iptv/playlist parseM3U', () => {
    parseM3U(playlistString);
  });

  bench('iptv-playlist-parser', () => {
    ippParser.parse(playlistString);
  });

  bench('m3u-parser-generator', () => {
    M3uParser.parse(playlistString);
  });
});
