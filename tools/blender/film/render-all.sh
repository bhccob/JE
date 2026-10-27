#!/usr/bin/env bash
# Renders the whole day film: every chapter for desktop and phone, then the bulb colour-temperature stills.
# Frames already on disk are skipped, so the script can be re-run after an interruption.
set -e
cd "$(dirname "$0")/../../.."
B="${BLENDER:-/c/Program Files (x86)/Steam/steamapps/common/Blender/blender.exe}"
for size in d m; do
  for c in dawn noon heat afternoon dusk night outage morning; do
    "$B" -b tools/blender/film/day.blend -P tools/blender/film/render.py -- chapter "$c" "$size" samples=160 2>&1 | grep -E "WROTE|Error|Traceback" || true
  done
  "$B" -b tools/blender/film/day.blend -P tools/blender/film/render.py -- kelvin "$size" 2>&1 | grep -E "WROTE|Error|Traceback" || true
done
echo DONE
