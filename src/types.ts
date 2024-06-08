export type M3uHeaders = {
  [key: string]: string | undefined;
  xTvgUrl?: string;
  urlTvg?: string;
};

export type M3uPlaylist = {
  channels: M3uChannel[];
  headers?: M3uHeaders;
};

export type M3uChannel = {
  tvgId?: string;
  tvgName?: string;
  tvgLanguage?: string;
  tvgLogo?: string;
  tvgUrl?: string;
  tvgRec?: string;
  groupTitle?: string;
  url?: string;
  name?: string;
  timeshift?: string;
  catchup?: string;
  duration?: number;
  catchupDays?: string;
  catchupSource?: string;
  extras?: Record<string, string | undefined>;
};
