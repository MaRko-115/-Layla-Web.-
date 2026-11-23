#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
BASE="https://gobkit.com/freebies"
mkdir -p assets/models/animals assets/models/environment
fetch() {
  local url="$1" out="$2"
  if [ -s "$out" ]; then echo "موجود: $out"; return; fi
  echo "تنزيل: $(basename "$out")"
  curl -fL --retry 3 --connect-timeout 15 "$url" -o "$out"
  test -s "$out"
}
fetch "$BASE/animal/Corgi.glb" assets/models/animals/corgi.glb
fetch "$BASE/animal/Duck.glb" assets/models/animals/duck.glb
fetch "$BASE/animalB/Owl.glb" assets/models/animals/owl.glb
fetch "$BASE/environment/Bush001.glb" assets/models/environment/bush.glb
fetch "$BASE/environment/Cliff001.glb" assets/models/environment/cliff.glb
fetch "$BASE/environment/Grass001.glb" assets/models/environment/grass.glb
fetch "$BASE/environment/Hill001.glb" assets/models/environment/hill.glb
cat > assets/ASSET-LICENSES.txt <<'EOF'
Third-party 3D assets bundled with Layla Web
Source: Gobkit free CC0 library (https://gobkit.com/api/free)
License: CC0 1.0 Universal — public domain dedication.
Files:
- animals/corgi.glb — Corgi
- animals/duck.glb — Duck
- animals/owl.glb — Owl
- environment/bush.glb — Bush 001
- environment/cliff.glb — Cliff 001
- environment/grass.glb — Grass 001
- environment/hill.glb — Hill 001
These assets are downloaded by scripts/install-assets.sh.
EOF
echo
echo "اكتمل تنزيل الأصول. الحجم:"
du -sh assets/models
