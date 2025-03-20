#!/usr/bin/env -S ts-node --esm

import fs from 'node:fs';
import path from 'node:path';
import { suite, add, cycle, complete } from 'benny';
import { parseM3U, writeM3U } from '../src/main.js';
import ippParser from 'iptv-playlist-parser';
import { M3uMedia, M3uParser, M3uPlaylist } from 'm3u-parser-generator';
import { Playlist, Link } from 'iptv-playlist-generator';

const m3uParser = new M3uParser();

const playlistString = fs.readFileSync(
  path.join(path.resolve(), 'tests/fixtures/small.m3u8'),
  'utf8',
);

const options = {
  minSamples: 5,
  maxTime: 5,
};

suite(
  'Playlist Parsing',
  add(
    'iptv-playlist-parser',
    () => {
      ippParser.parse(playlistString);
    },
    options,
  ),
  add(
    '@iptv/playlist',
    () => {
      parseM3U(playlistString);
    },
    options,
  ),
  add(
    'm3u-parser-generator',
    () => {
      m3uParser.parse(playlistString);
    },
    options,
  ),
  cycle(),
  complete(),
);

const playlist = new M3uPlaylist();
playlist.title = 'Test playlist';

const media1 = new M3uMedia('http://my-stream-url.com/playlist.m3u8');
media1.attributes = {
  'tvg-id': '5',
  'tvg-language': 'EN',
  unknown: 'my custom attribute',
};
media1.duration = 500;
media1.name = 'Test Channel';
media1.group = 'Test Group';

playlist.medias.push(media1);

const playlist2 = new Playlist();
playlist2.header = {
  'x-tvg-url': 'https://example.com/epg.xml',
  custom: 'value',
};

const link = new Link('http://example.com/stream.m3u8');
link.title = 'CNN (1080p)';
link.attrs = {
  'tvg-id': 'CNN.us',
  'tvg-name': 'CNN',
  'tvg-url': 'http://195.154.221.171/epg/guide.xml.gz',
  'tvg-logo': 'http://example.com/logo.png',
  'group-title': 'News',
};
link.vlcOpts = {
  'http-referrer': 'http://example.com/',
  'http-user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5)',
};
playlist2.links.push(link);

suite(
  'Playlist Creation',
  add(
    'iptv-playlist-generator',
    () => {
      playlist2.toString();
    },
    options,
  ),
  add(
    '@iptv/playlist',
    () => {
      writeM3U({
        channels: [
          {
            tvgId: 'Channel1',
            tvgName: 'Channel 1',
            tvgLanguage: 'English',
            groupTitle: 'News',
            name: 'Channel 1',
            url: 'http://server:port/channel1',
          },
        ],
        headers: {},
      });
    },
    options,
  ),
  add(
    'm3u-parser-generator',
    () => {
      playlist.getM3uString();
    },
    options,
  ),
  cycle(),
  complete(),
);
