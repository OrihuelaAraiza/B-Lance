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


def render(name, title, source, filters):
    output = target.with_name(f'{name}.mp3')
    # Join the last second to the first with an overlap. The resulting 40 s
    # loop has no abrupt noise discontinuity at its playback boundary.
    graph = (
        f'[0:a]{filters},aformat=channel_layouts=mono,asplit=3[body][head][tail];'
        '[body]atrim=start=1:end=40,asetpts=PTS-STARTPTS[middle];'
        '[head]atrim=end=1,asetpts=PTS-STARTPTS[first];'
        '[tail]atrim=start=40:end=41,asetpts=PTS-STARTPTS[last];'
        '[last][first]acrossfade=d=1:c1=tri:c2=tri[join];'
        '[middle][join]concat=n=2:v=0:a=1,'
        'loudnorm=I=-29:TP=-9:LRA=7,alimiter=limit=0.22:level=false,'
        'aresample=44100,asetpts=N/SR/TB[out]'
    )
    subprocess.run([
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'lavfi',
        '-i', source, '-filter_complex', graph, '-map', '[out]',
        '-ar', '44100', '-ac', '2', '-codec:a', 'libmp3lame', '-b:a', '128k',
        '-metadata', f'title=B Lance - {title}', str(output),
    ], check=True)
    print(f'Generated {output} ({output.stat().st_size} bytes)')


render('lluvia', 'Lluvia ligera', 'anoisesrc=c=white:s=21:r=44100:d=41',
       "highpass=f=600,lowpass=f=5500,volume=0.15,"
       "aeval=val(0)*(0.85+0.15*sin(2*PI*t/10))")
render('oleaje', 'Oleaje tranquilo', 'anoisesrc=c=pink:s=22:r=44100:d=41',
       "highpass=f=70,lowpass=f=2200,"
       "aeval='val(0)*(0.15+0.85*pow(0.5+0.5*sin(2*PI*t/8),3))'")
render('brisa', 'Brisa entre hojas', 'anoisesrc=c=pink:s=23:r=44100:d=41',
       "highpass=f=220,lowpass=f=1400,"
       "aeval=val(0)*(0.55+0.25*sin(2*PI*t/20)+0.15*sin(2*PI*t/5))")
render('ruido-marron', 'Ruido marron', 'anoisesrc=c=brown:s=24:r=44100:d=41',
       'highpass=f=45,lowpass=f=650')

bells = []
for index, frequency in enumerate([523.25, 659.25, 783.975, 1046.5]):
    age = f'mod(t+{index * 2.5},10)'
    envelope = f'(1-exp(-{age}/0.04))*exp(-{age}/1.4)'
    bells.append(f'0.15*{envelope}*(sin(2*PI*{frequency}*t)+0.16*sin(2*PI*{frequency * 2.4}*t))')
render('campanas', 'Campanas suaves', f"aevalsrc='{'+'.join(bells)}':s=44100:d=41",
       'lowpass=f=4000')
