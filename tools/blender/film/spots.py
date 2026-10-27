"""Where each product sits on screen in the frame its chapter arrives on, for the "See product info" markers.

    blender -b tools/blender/film/day.blend -P tools/blender/film/spots.py

Prints JSON: chapter -> { d: [x, y], m: [x, y] } as fractions of the frame, measured from the top left. Paste it into
the `spot` fields of FILM in lib/film.ts whenever a camera key or a product moves.
"""

import json
import os
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import film  # noqa: E402

SIZES = {'d': (1920, 1080), 'm': (1080, 1440)}
# Chapter -> (film position where it arrives, object whose centre gets the marker, offset in metres (x, z)).
TARGETS = {
    'dawn': (0.4225, 'PanelCells', (0, 0)),
    'noon': (2.0, 'InverterBody', (0, 0)),
    'heat': (3.0, 'AcBody', (0, 0)),
    'afternoon': (4.0, 'StationBody', (0, 0.04)),
    # The bulb's marker sits on the rim of the globe, clear of the filament.
    'dusk': (5.0, 'Bulb1', (0.066, -0.01)),
    'night': (6.0, 'SecCamHead', (0, 0)),
    'outage': (7.0, 'GenBody', (0, 0)),
    'morning': (8.0, 'Sofa', (0, 0.45)),
}


def centre(name):
    ob = bpy.data.objects[name]
    if ob.type == 'MESH':
        pts = [ob.matrix_world @ Vector(c) for c in ob.bound_box]
        return sum(pts, Vector()) / len(pts)
    return ob.matrix_world.translation.copy()


sc = bpy.context.scene
out = {}
for cid, (s, name, (dx, dz)) in TARGETS.items():
    out[cid] = {}
    for size, (w, h) in SIZES.items():
        sc.render.resolution_x, sc.render.resolution_y = w, h
        film.apply(s, size)
        bpy.context.view_layer.update()
        p = world_to_camera_view(sc, sc.camera, centre(name) + Vector((dx, 0, dz)))
        out[cid][size] = [round(p.x, 4), round(1 - p.y, 4)]
print('SPOTS', json.dumps(out))
