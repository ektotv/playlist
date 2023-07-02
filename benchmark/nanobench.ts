import bench from "nanobench";
import fs from "node:fs";
import { parseM3U } from "../src/main.js";
import { files } from "../tests/fixtures/files.js";
import { M3uParser } from "m3u-parser-generator";
import ippParser from "iptv-playlist-parser";

async function warmup() {
  console.log("Warming up...");
  let playlistString: string | null = fs.readFileSync(
    `./tests/fixtures/c1_h.m3u8`,
    {
      encoding: "utf-8",
    }
  );

  for (let i = 0; i < 100; i++) {
    parseM3U(playlistString);
    ippParser.parse(playlistString);
    M3uParser.parse(playlistString);
  }

  return true;
}

warmup().then(() => {
  files.forEach((file) => {
    bench(`@iptv/playlist parsing: ${file}`, function (b: any) {
      let playlistString: string | null = fs.readFileSync(
        `./tests/fixtures/${file}`,
        {
          encoding: "utf-8",
        }
      );
      b.start();

      parseM3U(playlistString);

      b.end();
      playlistString = null;
    });

    bench(`iptv-playlist-parser parsing: ${file}`, function (b: any) {
      let playlistString: string | null = fs.readFileSync(
        `./tests/fixtures/${file}`,
        {
          encoding: "utf-8",
        }
      );
      b.start();

      ippParser.parse(playlistString);

      b.end();
      playlistString = null;
    });

    bench(`m3u-parser parsing: ${file}`, function (b: any) {
      let playlistString: string | null = fs.readFileSync(
        `./tests/fixtures/${file}`,
        {
          encoding: "utf-8",
        }
      );
      b.start();

      M3uParser.parse(playlistString);

      b.end();
      playlistString = null;
    });
  });
});
