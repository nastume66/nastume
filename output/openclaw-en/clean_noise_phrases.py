from pathlib import Path
import re

base = Path('/Users/nastume/.openclaw/workspace/output/openclaw-en')
src = base / 'openclaw-aialiang-lobster.html'
out = base / 'openclaw-aialiang-lobster-clean2.html'

html = src.read_text(encoding='utf-8', errors='ignore')

noise_patterns = [
    r'.*DEPRECATED_ENDPOINT.*',
    r'.*google_apis/gcm/engine/registration_request\.cc.*',
    r'.*TensorFlow Lite.*',
    r'.*bytes written to file.*',
    r'.*Trying to load the allocator multiple times.*',
    r'.*VERBOSE\d:chrome/updater/.*',
    r'.*UPDATER_PROCESS.*',
]

for p in noise_patterns:
    html = re.sub(p, '', html)

# Also remove accidental plain-text log blocks between tags
html = re.sub(r'\[[0-9:./]+\][^<]{0,500}(DEPRECATED_ENDPOINT|TensorFlow Lite|bytes written to file)[^<]{0,500}', '', html)

out.write_text(html, encoding='utf-8')
print(out)
