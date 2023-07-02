#!/bin/bash

echo 'Creating benchmark m3u files'

channels=(
  "0"
  "1"
  "100"
  "500"
  "1000"
  "10000"
  "100000"
  "1000000"
)

quoted_files=""
for i in "${!channels[@]}"; do
  channel="${channels[$i]}"
  file="c${channel}_h.m3u8"
  quoted_files+="\"${file}\","

  echo "Writing to ./${file}"
  ./generateM3uFile.ts -c "${channel}" -H > "../tests/fixtures/${file}"
done

# Write the quoted file names to ./files.ts
echo "const files = [${quoted_files}]; export { files }" > ../tests/fixtures/files.ts

echo 'Finished creating benchmark m3u files'
