import { M3uChannel, M3uHeaders, M3uPlaylist } from "./types";

const attributeMap = {
  "tvg-id": "tvgId",
  "tvg-name": "tvgName",
  "tvg-language": "tvgLanguage",
  "tvg-logo": "tvgLogo",
  "tvg-url": "tvgUrl",
  "tvg-rec,": "tvgRec",
  "group-title": "groupTitle",
  timeshift: "timeshift",
  catchup: "catchup",
  "catchup-days": "catchupDays",
  "catchup-source": "catchupSource",
  "x-tvg-url": "xTvgUrl",
  "url-tvg": "urlTvg",
};

const space = " ".charCodeAt(0);
const hash = "#".charCodeAt(0);
const equal = "=".charCodeAt(0);
const colon = ":".charCodeAt(0);
const comma = ",".charCodeAt(0);
const dash = "-".charCodeAt(0);
const one = "1".charCodeAt(0);
const two = "2".charCodeAt(0);
const three = "3".charCodeAt(0);
const four = "4".charCodeAt(0);
const five = "5".charCodeAt(0);
const six = "6".charCodeAt(0);
const seven = "7".charCodeAt(0);
const eight = "8".charCodeAt(0);
const nine = "9".charCodeAt(0);
const zero = "0".charCodeAt(0);
const newLine = "\n".charCodeAt(0);
const tab = "\t".charCodeAt(0);
const carriageReturn = "\r".charCodeAt(0);
const stringE = "E".charCodeAt(0);
const stringX = "X".charCodeAt(0);
const stringT = "T".charCodeAt(0);
const stringI = "I".charCodeAt(0);
const stringN = "N".charCodeAt(0);
const stringF = "F".charCodeAt(0);
const stringM = "M".charCodeAt(0);
const stringH = "H".charCodeAt(0);
const stringh = "h".charCodeAt(0);
const stringU = "U".charCodeAt(0);

const durationCharCodes = [
  zero,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
  dash,
];

/**
 * parseM3U
 *
 * Parses an M3U file and returns an `M3uPlaylist` object
 *
 * @param m3uFileContents The contents of the M3U file
 *
 * @example
 * ```ts
 * import { parseM3U } from "@iptv/playlist";
 *
 * const m3u = `#EXTM3U
 * #EXTINF:-1 tvg-id="1" tvg-name="Channel 1" tvg-language="English" tvg-logo="http://example.com/logo.png" group-title="News" tvg-url="http://example.com/tvg.xml" timeshift="1" catchup="default" catchup-days="7" catchup-source="default" x-tvg-url="http://example.com/tvg.xml" url-tvg="http://example.com/tvg.xml" tvg-rec="default",Channel 1
 * http://example.com/stream.m3u8
 * `;
 *
 * const playlist = parseM3U(m3u);
 * ```
 */
function parseM3U(m3uFileContents: string): M3uPlaylist {
  const channels: M3uChannel[] = [];
  const headers: M3uHeaders = {};

  let currentPosition = 0;
  let currentChannel: M3uChannel = {};
  let currentAttribute = "";
  let currentSection: "header" | "channel" | "http" | null = null;

  while (currentPosition < m3uFileContents.length) {
    const char = m3uFileContents.charCodeAt(currentPosition);

    if (
      char === space ||
      char === tab ||
      char === carriageReturn ||
      char === newLine
    ) {
      currentPosition++;
      if (char === newLine) {
        currentAttribute = "";
      }
      continue;
    }

    let endOfLineIndex = m3uFileContents.indexOf("\n", currentPosition);
    if (endOfLineIndex === -1) {
      endOfLineIndex = m3uFileContents.length;
    }

    // Parse duration
    if (durationCharCodes.includes(char)) {
      let indexOfSpace = m3uFileContents.indexOf(" ", currentPosition);
      let indexOfComma = m3uFileContents.indexOf(",", currentPosition);
      let endOfDurationIndex = indexOfSpace;

      if (
        indexOfSpace > -1 &&
        indexOfComma > -1 &&
        indexOfSpace > indexOfComma
      ) {
        endOfDurationIndex = indexOfComma;
      }

      if (endOfDurationIndex === -1) {
        endOfDurationIndex = endOfLineIndex;
      }

      currentChannel.duration = parseInt(
        m3uFileContents.slice(currentPosition, endOfDurationIndex),
        10
      );

      currentPosition = endOfDurationIndex;
      continue;
    }

    // Could be a comment or a tag
    if (char === hash) {
      currentSection = null;
      // EXTM3U
      if (
        /* E */ m3uFileContents.charCodeAt(currentPosition + 1) === stringE &&
        /* X */ m3uFileContents.charCodeAt(currentPosition + 2) === stringX &&
        /* T */ m3uFileContents.charCodeAt(currentPosition + 3) === stringT &&
        /* M */ m3uFileContents.charCodeAt(currentPosition + 4) === stringM &&
        /* 3 */ m3uFileContents.charCodeAt(currentPosition + 5) === three &&
        /* U */ m3uFileContents.charCodeAt(currentPosition + 6) === stringU
      ) {
        // Parse the header tag and value

        currentPosition += 6;
        currentSection = "header";
      } else if (
        /* E */ m3uFileContents.charCodeAt(currentPosition + 1) === stringE &&
        /* X */ m3uFileContents.charCodeAt(currentPosition + 2) === stringX &&
        /* T */ m3uFileContents.charCodeAt(currentPosition + 3) === stringT &&
        /* I */ m3uFileContents.charCodeAt(currentPosition + 4) === stringI &&
        /* N */ m3uFileContents.charCodeAt(currentPosition + 5) === stringN &&
        /* F */ m3uFileContents.charCodeAt(currentPosition + 6) === stringF &&
        /* : */ m3uFileContents.charCodeAt(currentPosition + 7) === colon
      ) {
        currentPosition += 7;
        currentSection = "channel";
        currentChannel = {};
      } else {
        // Comment
        currentPosition = endOfLineIndex;
        continue;
      }
    }

    if (char === stringh || char === stringH) {
      // http
      currentSection = "http";

      currentChannel.url = m3uFileContents
        .slice(currentPosition, endOfLineIndex)
        .trim();
      currentPosition = endOfLineIndex;

      channels.push(currentChannel);
      currentChannel = {};
      continue;
    }

    // Channel name after comma
    if (char === comma) {
      currentSection = "channel";
      currentChannel.name = m3uFileContents
        .slice(currentPosition + 1, endOfLineIndex)
        .trim();
      currentPosition = endOfLineIndex;
      currentSection = null;
      continue;
    }

    if ((char > 64 && char < 91) || (char > 96 && char < 123) || char === 45) {
      const indexOfNextEquals = m3uFileContents.indexOf("=", currentPosition);

      currentAttribute = m3uFileContents.slice(
        currentPosition,
        indexOfNextEquals
      );
      currentPosition = indexOfNextEquals;
      continue;
    }

    // collect attribute
    if (char === equal) {
      // Skip the equals sign and first quote
      currentPosition = currentPosition + 2;

      const indexOfNextQuote = m3uFileContents.indexOf('"', currentPosition);
      const attributeValue = m3uFileContents.slice(
        currentPosition,
        indexOfNextQuote
      );
      currentPosition = indexOfNextQuote;

      const knownAttribute =
        attributeMap[currentAttribute as keyof typeof attributeMap];
      if (knownAttribute) {
        if (currentSection === "header") {
          headers[knownAttribute] = attributeValue;
        } else {
          currentChannel[
            knownAttribute as keyof Omit<M3uChannel, "extras" | "duration">
          ] = attributeValue;
        }
      } else {
        currentChannel.extras = currentChannel.extras || {};
        currentChannel.extras[currentAttribute] = attributeValue;
      }

      currentAttribute = "";
    }

    currentPosition++;
  }

  return { channels, headers };
}

export { parseM3U };
