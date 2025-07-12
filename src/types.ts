/**
 * Represents the headers found in an M3U playlist file.
 * These headers often include metadata related to the entire playlist, like URLs for TV guide data.
 */
export type M3uHeaders = {
  [key: string]: string | undefined;
  /** URL for the TV guide in XMLTV format */
  xTvgUrl?: string;
  /** Alternative URL for the TV guide */
  urlTvg?: string;
};

/**
 * Defines the structure of an M3U playlist, typically used for streaming media channels.
 * An M3U playlist contains a list of channels and optional headers providing additional metadata.
 */
export type M3uPlaylist = {
  /** Array of `M3uChannel` objects representing each channel in the playlist. */
  channels: M3uChannel[];
  /** `M3uHeaders` object containing metadata for the playlist. */
  headers?: M3uHeaders;
};

/**
 * Represents a single channel in an M3U playlist, detailing its properties.
 */
export type M3uChannel = {
  /** Identifier for the channel in a TV guide */
  tvgId?: string;
  /** Name for the channel in a TV guide */
  tvgName?: string;
  /** Language of the channel */
  tvgLanguage?: string;
  /** URL of the channel's logo */
  tvgLogo?: string;
  /** URL for the channel's TV guide data */
  tvgUrl?: string;
  /** Recording information for the channel */
  tvgRec?: string;
  /** Channel number in the TV guide */
  tvgChno?: string;
  /** Group title for categorizing the channel */
  groupTitle?: string;
  /** URL for the channel's streaming content */
  url?: string;
  urls?: string[];
  /** Name of the channel */
  name?: string;
  /** Timeshift value for the channel */
  timeshift?: string;
  /** Catchup service information for the channel */
  catchup?: string;
  /** Duration of the channel's content */
  duration?: number;
  /** Number of days available for catchup service */
  catchupDays?: string;
  /** Source URL for the catchup service */
  catchupSource?: string;
  /** Additional custom properties */
  extras?: Record<string, string | undefined>;
};
