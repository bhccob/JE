"""Renders the day film from day.blend.

    blender -b tools/blender/film/day.blend -P tools/blender/film/render.py -- <mode> [options]

Modes:
    probe s=1.5 [size=d] [pct=50] [samples=32]   one test frame -> out/probe/
    style                                        the three style frames for owner approval -> out/style/
    chapter <id> <size> [from=0] [to=N]          every frame of a chapter -> out/<size>/<id>/0001.png...
    kelvin <size>                                the bulb close-up at each colour temperature -> out/kelvin/<size>/
"""

import os
import sys

import bpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import film  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, 'out')
SIZES = {'d': (1920, 1080), 'm': (1080, 1440)}


def setup(size, pct=100, samples=128):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'OPTIX'
    prefs.get_devices()
    for d in prefs.devices:
        d.use = d.type == 'OPTIX'
    sc.cycles.device = 'GPU'
    sc.cycles.samples = samples
    sc.cycles.use_adaptive_sampling = True
    sc.cycles.adaptive_threshold = 0.015
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = 'OPTIX'
    sc.cycles.max_bounces = 8
    sc.cycles.transparent_max_bounces = 16
    sc.cycles.sample_clamp_indirect = 8.0
    sc.cycles.caustics_reflective = False
    sc.cycles.caustics_refractive = False
    w, h = SIZES[size]
    sc.render.resolution_x, sc.render.resolution_y = w, h
    sc.render.resolution_percentage = pct
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_depth = '8'
    sc.view_settings.view_transform = 'AgX'
    try:
        sc.view_settings.look = 'AgX - Medium High Contrast'
    except TypeError:
        pass


def shoot(s, size, path, **kw):
    film.apply(s, size, **kw)
    bpy.context.view_layer.update()
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print('WROTE', path, flush=True)


def opts(args):
    return dict(a.split('=', 1) for a in args if '=' in a)


def main():
    argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    mode, rest = argv[0], argv[1:]
    o = opts(rest)
    if mode == 'probe':
        size = o.get('size', 'd')
        setup(size, int(o.get('pct', 50)), int(o.get('samples', 32)))
        for s in o['s'].split(','):
            shoot(float(s), size, os.path.join(OUT, 'probe', f'{size}-{float(s):.3f}.png'), kelvin=int(o.get('k', 3000)))
    elif mode == 'style':
        setup('d', int(o.get('pct', 100)), int(o.get('samples', 256)))
        for name, s in (('1-dawn', 0.42), ('2-dusk-bulb', 5.0), ('3-morning-upstairs', 8.0)):
            shoot(s, 'd', os.path.join(OUT, 'style', f'{name}.png'))
    elif mode == 'chapter':
        cid, size = rest[0], rest[1]
        i = film.INDEX[cid]
        count = film.CHAPTERS[i][2 if size == 'd' else 3]
        setup(size, int(o.get('pct', 100)), int(o.get('samples', 128)))
        for f in range(int(o.get('from', 0)), int(o.get('to', count))):
            path = os.path.join(OUT, size, cid, f'{f + 1:04d}.png')
            if os.path.exists(path) and o.get('force') != '1':
                continue
            shoot(i + f / (count - 1), size, path)
    elif mode == 'kelvin':
        size = rest[0]
        setup(size, int(o.get('pct', 100)), int(o.get('samples', 192)))
        for k in film.KELVIN_STILLS:
            shoot(5.0, size, os.path.join(OUT, 'kelvin', size, f'{k}.png'), kelvin=k)


main()
