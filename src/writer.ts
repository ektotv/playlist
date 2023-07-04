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
  }

  for (const channel of playlist.channels) {
    if (!channel.url) continue;
    m3u += "\n#EXTINF:";
    m3u += channel?.duration ? channel.duration : "-1";
    if (channel.tvgId) m3u += ` tvg-id="${channel.tvgId}"`;
    if (channel.tvgName) m3u += ` tvg-name="${channel.tvgName}"`;
    if (channel.tvgLanguage) m3u += ` tvg-language="${channel.tvgLanguage}"`;
    if (channel.tvgLogo) m3u += ` tvg-logo="${channel.tvgLogo}"`;
    if (channel.tvgRec) m3u += ` tvg-rec="${channel.tvgRec}"`;
    if (channel.groupTitle) m3u += ` group-title="${channel.groupTitle}"`;
    if (channel.tvgUrl) m3u += ` tvg-url="${channel.tvgUrl}"`;
    if (channel.timeshift) m3u += ` timeshift="${channel.timeshift}"`;
    if (channel.catchup) m3u += ` catchup="${channel.catchup}"`;
    if (channel.catchupDays) m3u += ` catchup-days="${channel.catchupDays}"`;
    if (channel.catchupSource)
      m3u += ` catchup-source="${channel.catchupSource}"`;

    if (channel.extras) {
      for (const [key, value] of Object.entries(channel.extras)) {
        m3u += ` ${key}="${value}"`;
      }
    }
    m3u += ",";
    if (channel.name) m3u += channel.name;
    m3u += `\n${channel.url}`;
  }

  return m3u;
}

export { writeM3U };
