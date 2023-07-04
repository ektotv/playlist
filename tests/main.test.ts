import { describe, expect, test } from "vitest";
import { parseM3U, writeM3U } from "../src/main";
import fs from "node:fs";

const fileAsString = fs.readFileSync(`./tests/fixtures/example.m3u8`, {
  encoding: "utf-8",
});

const commentsFileAsString = fs.readFileSync(`./tests/fixtures/comments.m3u8`, {
  encoding: "utf-8",
});

// const largePlaylist = fs.readFileSync(`./tests/fixtures/large.m3u8`, {
//   encoding: "utf-8",
// });

describe("Write a m3u file", () => {
  const example = {
    channels: [
      {
        tvgId: "Channel1",
        tvgName: "Channel 1",
        groupTitle: "News",
        name: "Channel 1",
        url: "http://server:port/channel1",
      },
      {
        tvgId: "Channel2",
        tvgName: "Channel 2",
        name: "Channel 2",
        url: "http://server:port/channel2",
      },
    ],
    headers: {},
  };

  const exampleWithHeaders = {
    channels: [
      {
        tvgId: "Channel1",
        tvgName: "Channel 1",
        groupTitle: "News",
        name: "Channel 1",
        url: "http://server:port/channel1",
        extras: {
          "some-other-key": "hello",
        },
      },
    ],
    headers: {
      "x-tvg-url": "http://example.com",
    },
  };

  test("Write a m3u file", () => {
    const m3u = writeM3U(example);
    expect(m3u).toMatchSnapshot();
  });

  test("Write a m3u file with headers", () => {
    const m3u = writeM3U(exampleWithHeaders);
    expect(m3u).toMatchSnapshot();
  });

  test("Write a m3u file every attribute", () => {
    const m3u = writeM3U({
      channels: [
        {
          tvgId: "channel1.uk",
          tvgName: "Channel 1",
          tvgLanguage: "English",
          tvgLogo: "http://example.com/logo.png",
          tvgUrl: "http://example.com",
          tvgRec: "default",
          groupTitle: "News",
          url: "http://server:port/channel1",
          name: "Channel 1",
          timeshift: "1",
          catchup: "default",
          duration: -1,
          catchupDays: "7",
          catchupSource: "http://example.com",
          extras: {
            "some-other-key": "hello",
          },
        },
      ],
      headers: {
        "x-tvg-url": "http://example.com",
      },
    });
    expect(m3u).toMatchSnapshot();
  });

  test("Write a m3u file items with no name", () => {
    const m3u = writeM3U({
      channels: [
        {
          url: "http://server:port/channel1",
        },
      ],
    });
    expect(m3u).toMatchSnapshot();
  });

  test("Write a m3u file items with no url", () => {
    const m3u = writeM3U({
      // @ts-ignore
      channels: [
        {
          name: "Channel 1",
        },
        {
          name: "Channel 2",
          url: "http://server:port/channel2",
        },
      ],
    });

    const parsed = parseM3U(m3u);
    expect(parsed.channels.length).toBe(1);
    expect(m3u).toMatchSnapshot();
  });
});

describe("Parses a m3u file", () => {
  test("Fully parses to a JS object", () => {
    const parsed = parseM3U(fileAsString);
    expect(parsed).toMatchSnapshot();
  });

  test("Correctly parses the number of channels", () => {
    const parsed = parseM3U(fileAsString);

    expect(parsed.channels.length).toBe(50);
  });

  test("Correctly parses the first channel", () => {
    const parsed = parseM3U(fileAsString);
    const firstChannel = parsed.channels[0];
    expect(firstChannel).toEqual({
      tvgId: "Channel1",
      tvgName: "Channel 1",
      tvgLanguage: "English",
      duration: -1,
      groupTitle: "News",
      url: "http://server:port/channel1",
      name: "Channel 1",
    });
  });

  test("Parsing of individual channel properties", () => {
    const iptvContent = `#EXTM3U
    #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel 1" tvg-language="English" group-title="News",Channel 1
    http://server:port/channel1

    #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel 2" tvg-language="English" tvg-logo="http://website.com/channel2logo.png",Channel 2

    http://server:port/channel2
    #EXTINF:-1 tvg-id="Channel3" tvg-name="Channel 3" tvg-language="English" group-title="Movies",Channel 3
    http://server:port/channel3`;

    const parsed = parseM3U(iptvContent);
    const channels = parsed.channels;

    expect(channels.length).toBe(3);

    // Verify properties of the first channel
    expect(channels[0].tvgId).toBe("Channel1");
    expect(channels[0].tvgName).toBe("Channel 1");
    expect(channels[0].tvgLanguage).toBe("English");
    expect(channels[0].groupTitle).toBe("News");
    expect(channels[0].url).toBe("http://server:port/channel1");
    expect(channels[0].name).toBe("Channel 1");

    // Verify properties of the second channel
    expect(channels[1].tvgId).toBe("Channel2");
    expect(channels[1].tvgName).toBe("Channel 2");
    expect(channels[1].tvgLanguage).toBe("English");
    expect(channels[1].groupTitle).toBeUndefined(); // Property not present, expect undefined
    expect(channels[1].url).toBe("http://server:port/channel2");
    expect(channels[1].name).toBe("Channel 2");

    // Verify properties of the third channel
    expect(channels[2].tvgId).toBe("Channel3");
    expect(channels[2].tvgName).toBe("Channel 3");
    expect(channels[2].tvgLanguage).toBe("English");
    expect(channels[2].groupTitle).toBe("Movies");
    expect(channels[2].url).toBe("http://server:port/channel3");
    expect(channels[2].name).toBe("Channel 3");
  });

  test("Parsing of special characters in property values", () => {
    const iptvContent = `#EXTM3U
      #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel !@£$%^&*()-=''Special" tvg-language="English" group-title="Action/Adventure",Channel 1
      http://server:port/channel1`;

    const parsed = parseM3U(iptvContent);
    const channel = parsed.channels[0];

    expect(channel.tvgId).toBe("Channel1");
    expect(channel.tvgName).toBe("Channel !@£$%^&*()-=''Special");
    expect(channel.tvgLanguage).toBe("English");
    expect(channel.groupTitle).toBe("Action/Adventure");
    expect(channel.url).toBe("http://server:port/channel1");
    expect(channel.name).toBe("Channel 1");
  });

  test("Parsing of URLs with special characters", () => {
    const iptvContent = `#EXTM3U
      #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel 1" tvg-language="English" group-title="News",Channel 1
      http://server:port/channel1?param=value&key=abc%20def`;

    const parsed = parseM3U(iptvContent);
    const channel = parsed.channels[0];

    expect(channel.tvgId).toBe("Channel1");
    expect(channel.tvgName).toBe("Channel 1");
    expect(channel.tvgLanguage).toBe("English");
    expect(channel.groupTitle).toBe("News");
    expect(channel.url).toBe(
      "http://server:port/channel1?param=value&key=abc%20def"
    );
    expect(channel.name).toBe("Channel 1");
  });

  // test("Parsing of large playlists", () => {
  //   let iptvContent = largePlaylist;

  //   // Measure the parsing performance
  //   const startTime = performance.now();
  //   const parsed = parseM3U(iptvContent);
  //   const endTime = performance.now();

  //   const parsingTime = endTime - startTime;

  //   // Verify the number of channels and parsing time
  //   expect(parsed.channels.length).toBe(100_000);
  //   expect(parsingTime).toBeLessThan(150); // Adjust the threshold based on your performance expectations
  // });

  test("Parsing of optional properties", () => {
    const iptvContent = `#EXTM3U
      #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel 1" group-title="News",Channel 1
      http://server:port/channel1
      #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel 2",Channel 2
      http://server:port/channel2`;

    const parsed = parseM3U(iptvContent);
    const channels = parsed.channels;

    // Verify properties of the first channel
    expect(channels[0].tvgId).toBe("Channel1");
    expect(channels[0].tvgName).toBe("Channel 1");
    expect(channels[0].tvgLanguage).toBeUndefined(); // Missing property, expect undefined
    expect(channels[0].groupTitle).toBe("News");
    expect(channels[0].url).toBe("http://server:port/channel1");
    expect(channels[0].name).toBe("Channel 1");

    // Verify properties of the second channel
    expect(channels[1].tvgId).toBe("Channel2");
    expect(channels[1].tvgName).toBe("Channel 2");
    expect(channels[1].tvgLanguage).toBeUndefined(); // Missing property, expect undefined
    expect(channels[1].groupTitle).toBeUndefined(); // Missing property, expect undefined
    expect(channels[1].url).toBe("http://server:port/channel2");
    expect(channels[1].name).toBe("Channel 2");
  });

  test("Parsing of empty playlists", () => {
    const iptvContent = `#EXTM3U`;

    const parsed = parseM3U(iptvContent);
    const channels = parsed.channels;

    expect(channels.length).toBe(0);
  });

  test("Parsing of empty file", () => {
    const iptvContent = ``;

    const parsed = parseM3U(iptvContent);
    const channels = parsed.channels;

    expect(channels.length).toBe(0);
  });

  test("Parsing of playlists with header tags", () => {
    const iptvContent = `#EXTM3U x-tvg-url="https://example.com/xmltv.xml"
      #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel 1" group-title="News",Channel 1
      http://server:port/channel1
      #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel 2" group-title="Movies",Channel 2
      http://server:port/channel2`;

    const parsed = parseM3U(iptvContent);
    const headers = parsed.headers;

    // Verify header tags
    expect(headers).toEqual({
      xTvgUrl: "https://example.com/xmltv.xml",
    });
  });

  test("Parsing of playlists with duplicate channel IDs", () => {
    const iptvContent = `#EXTM3U
      #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel 1",Channel 1
      http://server:port/channel1
      #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel 2",Channel 2
      http://server:port/channel2
      #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel 1 Duplicate",Channel 1 Duplicate
      http://server:port/channel1_duplicate`;

    const parsed = parseM3U(iptvContent);
    const channels = parsed.channels;

    // Verify the number of unique channels
    expect(channels.length).toBe(3);

    // Verify properties of the first channel
    expect(channels[0].tvgId).toBe("Channel1");
    expect(channels[0].tvgName).toBe("Channel 1");
    expect(channels[0].tvgLanguage).toBeUndefined();
    expect(channels[0].groupTitle).toBeUndefined();
    expect(channels[0].url).toBe("http://server:port/channel1");
    expect(channels[0].name).toBe("Channel 1");

    // Verify properties of the second channel
    expect(channels[1].tvgId).toBe("Channel2");
    expect(channels[1].tvgName).toBe("Channel 2");
    expect(channels[1].tvgLanguage).toBeUndefined();
    expect(channels[1].groupTitle).toBeUndefined();
    expect(channels[1].url).toBe("http://server:port/channel2");
    expect(channels[1].name).toBe("Channel 2");

    // Verify properties of the third channel
    expect(channels[2].tvgId).toBe("Channel1");
    expect(channels[2].tvgName).toBe("Channel 1 Duplicate");
    expect(channels[2].tvgLanguage).toBeUndefined();
    expect(channels[2].groupTitle).toBeUndefined();
    expect(channels[2].url).toBe("http://server:port/channel1_duplicate");
    expect(channels[2].name).toBe("Channel 1 Duplicate");
  });

  test("Handles comments in the playlist", () => {
    const parsed = parseM3U(commentsFileAsString);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(3);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].tvgId).toBe("Channel1");
    expect(parsed.channels[0].tvgName).toBe("Channel One");
    expect(parsed.channels[0].tvgLanguage).toBe("English");
    expect(parsed.channels[0].groupTitle).toBe("News");
    expect(parsed.channels[0].name).toBe("Channel 1");
    expect(parsed.channels[0].url).toBe("http://server:port/channel1");

    // Verify the values of specific properties for the second channel
    expect(parsed.channels[1].tvgId).toBe("Channel2");
    expect(parsed.channels[1].tvgName).toBe("Channel Two");
    expect(parsed.channels[1].tvgLanguage).toBe("English");
    expect(parsed.channels[1].groupTitle).toBe("Sports");
    expect(parsed.channels[1].name).toBe("Channel 2");
    expect(parsed.channels[1].url).toBe("http://server:port/channel2");

    // Verify the values of specific properties for the third channel
    expect(parsed.channels[2].tvgId).toBe("Channel3");
    expect(parsed.channels[2].tvgName).toBe("Channel Three");
    expect(parsed.channels[2].tvgLanguage).toBe("English,French");
    expect(parsed.channels[2].groupTitle).toBe("Movies");
    expect(parsed.channels[2].name).toBe("Channel 3");
    expect(parsed.channels[2].url).toBe("http://server:port/channel3");

    // Ensure the headers are parsed correctly
    expect(parsed.headers?.xTvgUrl).toBe("https://i.mjh.nz/Plex/all.xml.gz");
  });

  test("Ignores empty lines and whitespace in the playlist", () => {
    const playlistContent = `
     #EXTM3U

  #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel One" group-title="News",Channel 1

  http://server:port/channel1

  #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel Two" group-title="Sports",Channel 2

         http://server:port/channel2

    #EXTINF:-1 tvg-id="Channel3" tvg-name="Channel Three" group-title="Movies",Channel 3

  http://server:port/channel3

  `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(3);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].tvgId).toBe("Channel1");
    expect(parsed.channels[0].tvgName).toBe("Channel One");
    expect(parsed.channels[0].groupTitle).toBe("News");
    expect(parsed.channels[0].name).toBe("Channel 1");
    expect(parsed.channels[0].url).toBe("http://server:port/channel1");

    // Verify the values of specific properties for the second channel
    expect(parsed.channels[1].tvgId).toBe("Channel2");
    expect(parsed.channels[1].tvgName).toBe("Channel Two");
    expect(parsed.channels[1].groupTitle).toBe("Sports");
    expect(parsed.channels[1].name).toBe("Channel 2");
    expect(parsed.channels[1].url).toBe("http://server:port/channel2");

    // Verify the values of specific properties for the third channel
    expect(parsed.channels[2].tvgId).toBe("Channel3");
    expect(parsed.channels[2].tvgName).toBe("Channel Three");
    expect(parsed.channels[2].groupTitle).toBe("Movies");
    expect(parsed.channels[2].name).toBe("Channel 3");
    expect(parsed.channels[2].url).toBe("http://server:port/channel3");
  });

  test("Handles files without #EXTM3U header", () => {
    const playlistContent = `
  #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel One" group-title="News",Channel 1
  http://server:port/channel1
  #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel Two" group-title="Sports",Channel 2
  http://server:port/channel2
  #EXTINF:-1 tvg-id="Channel3" tvg-name="Channel Three" group-title="Movies",Channel 3
  http://server:port/channel3
  `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(3);
    expect(parsed.headers).toEqual({});

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].tvgId).toBe("Channel1");
    expect(parsed.channels[0].tvgName).toBe("Channel One");
    expect(parsed.channels[0].groupTitle).toBe("News");
    expect(parsed.channels[0].name).toBe("Channel 1");
    expect(parsed.channels[0].url).toBe("http://server:port/channel1");

    // Verify the values of specific properties for the second channel
    expect(parsed.channels[1].tvgId).toBe("Channel2");
    expect(parsed.channels[1].tvgName).toBe("Channel Two");
    expect(parsed.channels[1].groupTitle).toBe("Sports");
    expect(parsed.channels[1].name).toBe("Channel 2");
    expect(parsed.channels[1].url).toBe("http://server:port/channel2");

    // Verify the values of specific properties for the third channel
    expect(parsed.channels[2].tvgId).toBe("Channel3");
    expect(parsed.channels[2].tvgName).toBe("Channel Three");
    expect(parsed.channels[2].groupTitle).toBe("Movies");
    expect(parsed.channels[2].name).toBe("Channel 3");
    expect(parsed.channels[2].url).toBe("http://server:port/channel3");
  });

  test("Handles URLs with pipe (|) characters", () => {
    const playlistContent = `
  #EXTM3U
  #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel One" group-title="News",Channel 1
  http://server:port/channel1|pipe
  #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel Two" group-title="Sports",Channel 2
  http://server:port/channel2|with|pipes
  `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(2);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].tvgId).toBe("Channel1");
    expect(parsed.channels[0].tvgName).toBe("Channel One");
    expect(parsed.channels[0].groupTitle).toBe("News");
    expect(parsed.channels[0].name).toBe("Channel 1");
    expect(parsed.channels[0].url).toBe("http://server:port/channel1|pipe");

    // Verify the values of specific properties for the second channel
    expect(parsed.channels[1].tvgId).toBe("Channel2");
    expect(parsed.channels[1].tvgName).toBe("Channel Two");
    expect(parsed.channels[1].groupTitle).toBe("Sports");
    expect(parsed.channels[1].name).toBe("Channel 2");
    expect(parsed.channels[1].url).toBe(
      "http://server:port/channel2|with|pipes"
    );
  });

  test("Handles files with missing or incorrect value for a channel property", () => {
    const playlistContent = `
    #EXTM3U
    #EXTINF:-1 tvg-id="Channel1"
    http://server:port/channel1
    #EXTINF:-1 tvg-name="Channel Two" group-title="Sports",A name
    http://server:port/channel2
    #EXTINF:-1 tvg-id="Channel3" tvg-name="Channel Three"
    http://server:port/channel3
    `;

    const parsed = parseM3U(playlistContent);

    expect(parsed.channels.length).toBe(3);
    expect(parsed.channels[1].tvgId).toBeUndefined();
    expect(parsed.channels[0].tvgName).toBeUndefined();
    expect(parsed.channels[0].groupTitle).toBeUndefined();
    expect(parsed.channels[1].groupTitle).toBe("Sports");
  });

  test("Parses files with complex nested tag structure", () => {
    const playlistContent = `
    #EXTM3U
    #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel One" group-title="News",Channel 1
    #EXTGRP:News
    http://server:port/channel1
    #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel Two" group-title="Sports",Channel 2
    #EXTGRP:Sports
    http://server:port/channel2
    `;

    const parsed = parseM3U(playlistContent);
    expect(parsed.channels.length).toBe(2);
    expect(parsed.channels[0].groupTitle).toBe("News");
    expect(parsed.channels[1].groupTitle).toBe("Sports");
  });

  test("Parses files with UTF-8 special characters", () => {
    const playlistContent = `
  #EXTM3U
  #EXTINF:-1 tvg-id="Channel1" tvg-name="Chännel Ône" group-title="News",Channel 1
  http://server:port/channel1
  #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel Twø" group-title="Spørts",Channel 2
  http://server:port/channel2
  #EXTINF:-1 tvg-id="Channel3" tvg-name="Channel Thrèe" group-title="Mövies",Channel 3
  http://server:port/channel3
  `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(3);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].tvgId).toBe("Channel1");
    expect(parsed.channels[0].tvgName).toBe("Chännel Ône");
    expect(parsed.channels[0].groupTitle).toBe("News");
    expect(parsed.channels[0].name).toBe("Channel 1");
    expect(parsed.channels[0].url).toBe("http://server:port/channel1");

    // Verify the values of specific properties for the second channel
    expect(parsed.channels[1].tvgId).toBe("Channel2");
    expect(parsed.channels[1].tvgName).toBe("Channel Twø");
    expect(parsed.channels[1].groupTitle).toBe("Spørts");
    expect(parsed.channels[1].name).toBe("Channel 2");
    expect(parsed.channels[1].url).toBe("http://server:port/channel2");

    // Verify the values of specific properties for the third channel
    expect(parsed.channels[2].tvgId).toBe("Channel3");
    expect(parsed.channels[2].tvgName).toBe("Channel Thrèe");
    expect(parsed.channels[2].groupTitle).toBe("Mövies");
    expect(parsed.channels[2].name).toBe("Channel 3");
    expect(parsed.channels[2].url).toBe("http://server:port/channel3");
  });

  test("Parsing of URLs with special characters", () => {
    const playlistContent = `
  #EXTM3U
  #EXTINF:-1 tvg-id="Channel1",Channel 1
  http://server:port/channel1?query=value&other=value
  #EXTINF:-1 tvg-id="Channel2",Channel 2
  http://server:port/channel2#fragment
  #EXTINF:-1 tvg-id="Channel3",Channel 3
  http://server:port/channel3/path with spaces
  `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(3);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].tvgId).toBe("Channel1");
    expect(parsed.channels[0].name).toBe("Channel 1");
    expect(parsed.channels[0].url).toBe(
      "http://server:port/channel1?query=value&other=value"
    );

    // Verify the values of specific properties for the second channel
    expect(parsed.channels[1].tvgId).toBe("Channel2");
    expect(parsed.channels[1].name).toBe("Channel 2");
    expect(parsed.channels[1].url).toBe("http://server:port/channel2#fragment");

    // Verify the values of specific properties for the third channel
    expect(parsed.channels[2].tvgId).toBe("Channel3");
    expect(parsed.channels[2].name).toBe("Channel 3");
    expect(parsed.channels[2].url).toBe(
      "http://server:port/channel3/path with spaces"
    );
  });

  test("Parsing of channel names with commas", () => {
    const playlistContent = `
  #EXTM3U
  #EXTINF:-1 tvg-id="Channel1",Channel 1, News
  http://server:port/channel1
  #EXTINF:-1 tvg-id="Channel2",Channel 2, Sports
  http://server:port/channel2
  #EXTINF:-1 tvg-id="Channel,3",Channel 3, Movies
  http://server:port/channel3
  `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(3);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].tvgId).toBe("Channel1");
    expect(parsed.channels[0].name).toBe("Channel 1, News");
    expect(parsed.channels[0].url).toBe("http://server:port/channel1");

    // Verify the values of specific properties for the second channel
    expect(parsed.channels[1].tvgId).toBe("Channel2");
    expect(parsed.channels[1].name).toBe("Channel 2, Sports");
    expect(parsed.channels[1].url).toBe("http://server:port/channel2");

    // Verify the values of specific properties for the third channel
    expect(parsed.channels[2].tvgId).toBe("Channel,3");
    expect(parsed.channels[2].name).toBe("Channel 3, Movies");
    expect(parsed.channels[2].url).toBe("http://server:port/channel3");
  });

  test("Parsing of channel properties with equal signs", () => {
    const playlistContent = `
  #EXTM3U
  #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel=One" group-title="News=Channel",Channel 1
  http://server:port/channel1
  #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel=Two" group-title="Sports=Channel",Channel 2
  http://server:port/channel2
  `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(2);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].tvgId).toBe("Channel1");
    expect(parsed.channels[0].tvgName).toBe("Channel=One");
    expect(parsed.channels[0].groupTitle).toBe("News=Channel");
    expect(parsed.channels[0].name).toBe("Channel 1");
    expect(parsed.channels[0].url).toBe("http://server:port/channel1");

    // Verify the values of specific properties for the second channel
    expect(parsed.channels[1].tvgId).toBe("Channel2");
    expect(parsed.channels[1].tvgName).toBe("Channel=Two");
    expect(parsed.channels[1].groupTitle).toBe("Sports=Channel");
    expect(parsed.channels[1].name).toBe("Channel 2");
    expect(parsed.channels[1].url).toBe("http://server:port/channel2");
  });

  test("Handles unexpected characters in the playlist", () => {
    const playlistContent = `
  #EXTM3U
  #EXTINF:-1 tvg-id="Channel1" tvg-name="Channel@One" group-title="News@Channel",Channel 1
  http://server:port/channel1
  #EXTINF:-1 tvg-id="Channel2" tvg-name="Channel#Two" group-title="Sports#Channel",Channel 2
  http://server:port/channel2
  `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(2);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].tvgId).toBe("Channel1");
    expect(parsed.channels[0].tvgName).toBe("Channel@One");
    expect(parsed.channels[0].groupTitle).toBe("News@Channel");
    expect(parsed.channels[0].name).toBe("Channel 1");
    expect(parsed.channels[0].url).toBe("http://server:port/channel1");

    // Verify the values of specific properties for the second channel
    expect(parsed.channels[1].tvgId).toBe("Channel2");
    expect(parsed.channels[1].tvgName).toBe("Channel#Two");
    expect(parsed.channels[1].groupTitle).toBe("Sports#Channel");
    expect(parsed.channels[1].name).toBe("Channel 2");
    expect(parsed.channels[1].url).toBe("http://server:port/channel2");
  });

  test("Supports custom tags", () => {
    const playlistContent = `#EXTM3U
    #EXTINF:-1 tvg-id="Channel1" some-custom-tag="hello" tvg-name="Channel One" group-title="News",Channel 1
    http://server:port/channel1
    `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(1);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].extras?.["some-custom-tag"]).toBe("hello");
  });

  test("Supports custom tags with commas", () => {
    const playlistContent = `#EXTM3U
    #EXTINF:-1 tvg-id="Channel1" some-custom-tag="hello, world" tvg-name="Channel One" group-title="News",Channel 1
    http://server:port/channel1
    #EXTINF:-1 tvg-id="Channel2" some-custom-tag="hello, world",Channel 2
    http://server:port/channel2
    `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(2);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].extras?.["some-custom-tag"]).toBe("hello, world");
    expect(parsed.channels[1].extras?.["some-custom-tag"]).toBe("hello, world");
  });

  test("Supports custom tags with equal signs", () => {
    const playlistContent = `#EXTM3U
    #EXTINF:-1 tvg-id="Channel1" some-custom-tag="hello=world" tvg-name="Channel One" group-title="News",Channel 1
    http://server:port/channel1
    #EXTINF:-1 tvg-id="Channel2" some-custom-tag="hello=world",Channel 2
    http://server:port/channel2
    `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(2);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].extras?.["some-custom-tag"]).toBe("hello=world");
    expect(parsed.channels[1].extras?.["some-custom-tag"]).toBe("hello=world");
  });

  test("Supports custom tags with unexpected characters", () => {
    const playlistContent = `#EXTM3U
    #EXTINF:-1 tvg-id="Channel1" some-custom-tag="hello@world" tvg-name="Channel One" group-title="News",Channel 1
    http://server:port/channel1
    #EXTINF:-1 tvg-id="Channel2" some-custom-tag="hello#world",Channel 2
    http://server:port/channel2
    `;

    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(2);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].extras?.["some-custom-tag"]).toBe("hello@world");
    expect(parsed.channels[1].extras?.["some-custom-tag"]).toBe("hello#world");
  });

  test("Parses duration", () => {
    const playlistContent = `
    #EXTM3U
    #EXTINF:123 tvg-id="channel1.uk",Channel 1
    http://server:port/channel1
    #EXTINF:-1 ,Channel 2
    http://server:port/channel2
    #EXTINF: -1 tvg-id="channel1.uk",Channel 2
    http://server:port/channel2
    `;
    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(3);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].duration).toBe(123);
    expect(parsed.channels[1].duration).toBe(-1);
    expect(parsed.channels[2].duration).toBe(-1);
  });

  test("Can parse simple items without attributes", () => {
    const playlistContent = `
    #EXTM3U
    #EXTINF:-1,Channel 1
    http://server:port/channel1
    #EXTINF:-1,Channel 2
    http://server:port/channel2
    `;
    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(2);

    // Verify the values of specific properties for the first channel
    expect(parsed.channels[0].duration).toBe(-1);
    expect(parsed.channels[0].tvgId).toBeUndefined();
    expect(parsed.channels[0].tvgName).toBeUndefined();
    expect(parsed.channels[0].groupTitle).toBeUndefined();
    expect(parsed.channels[0].name).toBe("Channel 1");
    expect(parsed.channels[0].url).toBe("http://server:port/channel1");
  });

  test("Can parse can incomplete m3u file", () => {
    const playlistContent = `
    #EXTM3U
    #EXTINF:-1,Channel 1
    http://server:port/channel1
    #EXTINF:-1`;
    const parsed = parseM3U(playlistContent);

    // Ensure the correct number of channels is parsed
    expect(parsed.channels.length).toBe(1);
  });
});
