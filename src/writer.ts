import { M3uPlaylist } from "./types";

/**
 * writeM3U
 *
 * Converts an `M3uPlaylist` object to an M3U file
 *
 * @param playlist The `M3uPlaylist` object to convert
 *
 * @example
 * ```ts
 * import { writeM3U } from "@iptv/playlist";
 *
 * const playlist = {
 *   headers: {
 *     "x-tvg-url": "http://example.com/tvg.xml",
 *   },
 * channels: [{
 *     tvgId: "1",
 *     tvgName: "Channel 1",
 *     tvgLanguage: "English",
 *     tvgLogo: "http://example.com/logo.png",
 *     groupTitle: "News",
 *     name: "Channel 1",
 *     url: "http://server:port/channel1",
 *   }],
 * };
 *
 * const m3u = writeM3U(playlist);
 * ```
 */
function writeM3U(playlist: M3uPlaylist) {
  let m3u = "#EXTM3U";

  if (playlist.headers && Object.entries(playlist.headers)) {
    for (const [key, value] of Object.entries(playlist.headers)) {
      m3u += ` ${key}="${value}"`;
    }
    m3u += "\n";
  }

  for (const channel of playlist.channels) {
    m3u += "#EXTINF:-1";
    m3u += channel.tvgId ? ` tvg-id="${channel.tvgId}"` : "";
    m3u += channel.tvgName ? ` tvg-name="${channel.tvgName}"` : "";
    m3u += channel.tvgLanguage ? ` tvg-language="${channel.tvgLanguage}"` : "";
    m3u += channel.tvgLogo ? ` tvg-logo="${channel.tvgLogo}"` : "";
    m3u += channel.tvgRec ? ` tvg-rec="${channel.tvgRec}"` : "";
    m3u += channel.groupTitle ? ` group-title="${channel.groupTitle}"` : "";
    m3u += channel.tvgUrl ? ` tvg-url="${channel.tvgUrl}"` : "";
    m3u += channel.timeshift ? ` timeshift="${channel.timeshift}"` : "";
    m3u += channel.catchup ? ` catchup="${channel.catchup}"` : "";
    m3u += channel.catchupDays ? ` catchup-days="${channel.catchupDays}"` : "";
    m3u += channel.catchupSource
      ? ` catchup-source="${channel.catchupSource}"`
      : "";

    if (channel.extras) {
      for (const [key, value] of Object.entries(channel.extras)) {
        m3u += ` ${key}="${value}"`;
      }
    }

    m3u += channel.name ? `,${channel.name}\n` : "\n";
    m3u += channel.url ? `${channel.url}\n` : "\n";
  }

  return m3u;
}

export { writeM3U };
