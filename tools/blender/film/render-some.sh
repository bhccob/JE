#!/usr/bin/env bash
# Re-renders chosen chapters (and optionally the bulb stills) for both sizes after a set change.
#   bash tools/blender/film/render-some.sh dusk night kelvin
set -e
cd "$(dirname "$0")/../../.."
B="${BLENDER:-/c/Program Files (x86)/Steam/steamapps/common/Blender/blender.exe}"
for size in d m; do
  for c in "$@"; do
    if [ "$c" = kelvin ]; then
      "$B" -b tools/blender/film/day.blend -P tools/blender/film/render.py -- kelvin "$size" 2>&1 | grep -E "WROTE|Error|Traceback" || true
    else
      "$B" -b tools/blender/film/day.blend -P tools/blender/film/render.py -- chapter "$c" "$size" samples=160 2>&1 | grep -E "WROTE|Error|Traceback" || true
    fi
  done
done
echo DONE
