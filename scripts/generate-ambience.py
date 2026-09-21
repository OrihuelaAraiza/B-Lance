#!/usr/bin/env python3
"""Generate B Lance's original, quiet ambient loop (requires ffmpeg)."""
from pathlib import Path
import subprocess

target = Path(__file__).resolve().parents[1] / 'public/audio/ambiente-suave.mp3'
target.parent.mkdir(parents=True, exist_ok=True)

# A softly evolving consonant pad. All frequencies complete whole cycles in
# 40 seconds; both channels meet at the loop boundary without an abrupt jump.
frequencies = [130.8, 196, 261.625, 329.625, 392]
channels = []
for channel in range(2):
    voices = []
    for index, frequency in enumerate(frequencies):
        phase = channel * 0.25 + index * 0.7
        envelope = f'(0.7+0.3*sin(2*PI*t/40+{index}))'
        voices.append(f'0.026*{envelope}*sin(2*PI*{frequency}*t+{phase})')
    channels.append('+'.join(voices))
subprocess.run([
    'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi',
    '-i', f'aevalsrc={"|".join(channels)}:s=44100:d=40',
    '-codec:a', 'libmp3lame', '-b:a', '128k',
    '-metadata', 'title=B Lance - Ambiente suave', str(target),
], check=True)
print(f'Generated {target} ({target.stat().st_size} bytes)')
