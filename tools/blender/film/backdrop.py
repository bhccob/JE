"""Renders the plaster wall with the divi-divi shadow and no products, as the backdrop behind the site's glass panels.

    blender -b tools/blender/film/day.blend -P tools/blender/film/backdrop.py -- <day|night> <d|m> [pct=100] [samples=160]

Writes out/backdrop/<theme>-<size>.png; publish.mjs-style conversion to public/film/backdrop/ is done by the caller.
"""

import math
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import film  # noqa: E402

HERE = os.path.dirname(os.path.abspath(__file__))
SIZES = {'d': (1920, 1080), 'm': (1080, 1440)}
KEEP = ('Wall', 'Floor', 'Skirting', 'Ledge', 'Gobo')


def kept(o):
    while o.parent:
        o = o.parent
    return o.name.startswith(KEEP)


def main():
    argv = sys.argv[sys.argv.index('--') + 1:]
    theme, size = argv[0], argv[1]
    o = dict(a.split('=', 1) for a in argv[2:] if '=' in a)
    sc = bpy.context.scene

    # The early-morning light: warm and low, so the canopy shadow is long and sharp on the wall.
    film.apply(float(o.get('s', 0.42)), size)
    for ob in sc.objects:
        if ob.type in {'MESH', 'CURVE'} and not kept(ob):
            ob.hide_render = True
    for name in ('BulbKey', 'LedgeWash'):
        sc.objects[name].data.energy = 0
    for ob in sc.objects:
        if ob.type == 'LIGHT' and ob.name.startswith(('BulbLight', 'DownLamp')):
            ob.data.energy = 0

    # The canopy sits lower on the wall than in the film, so the whole crown fits under the ledge.
    sc.objects['GoboRoot'].location.z -= float(o.get('drop', 0.55))
    sun = sc.objects['Sun']
    if theme == 'day':
        # A softer, creamier light than the film's first gold, closer to the site's sand paper colour.
        sun.data.color = film.kelvin_rgb(int(o.get('k', 4600)))
        sun.data.energy *= float(o.get('sunx', 1.5))
        sc.view_settings.exposure += float(o.get('expd', 0.35))

    if theme == 'night':
        # The same shadow by moonlight: a cool, dim key in place of the sun, and the night sky.
        sun = sc.objects['Sun']
        sun.data.color = film.kelvin_rgb(9500)
        sun.data.energy *= 0.16
        nt = sc.world.node_tree
        nt.nodes['NightMix'].inputs['Factor'].default_value = 1.0
        nt.nodes['NightMix'].inputs[7].default_value = (0.006, 0.014, 0.024, 1)
        nt.nodes['Background'].inputs['Strength'].default_value = 0.4
        sc.view_settings.exposure = float(o.get('exp', 0.9))

    # Square on to the wall where the canopy falls: no ledge, no floor.
    w, h = SIZES[size]
    target = Vector((float(o.get('x', -0.9)), 0, float(o.get('z', 2.05))))
    dist = float(o.get('dist', 5.2))
    sc.objects['Rig'].location = target + Vector((0, -dist, 0))
    sc.objects['Aim'].location = target
    cam = sc.objects['CamD' if size == 'd' else 'CamM']
    sc.camera = cam
    cam.data.lens = float(o.get('lens', 30 if size == 'd' else 26))
    cam.data.dof.use_dof = False

    sc.render.engine = 'CYCLES'
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'OPTIX'
    prefs.get_devices()
    for d in prefs.devices:
        d.use = d.type == 'OPTIX'
    sc.cycles.device = 'GPU'
    sc.cycles.samples = int(o.get('samples', 160))
    sc.cycles.use_denoising = True
    sc.cycles.denoiser = 'OPTIX'
    sc.render.resolution_x, sc.render.resolution_y = w, h
    sc.render.resolution_percentage = int(o.get('pct', 100))
    sc.render.image_settings.file_format = 'PNG'
    sc.view_settings.view_transform = 'AgX'
    path = os.path.join(HERE, 'out', 'backdrop', f'{theme}-{size}.png')
    os.makedirs(os.path.dirname(path), exist_ok=True)
    sc.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print('WROTE', path, flush=True)


main()
