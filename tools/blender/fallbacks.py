"""Render a still of a normalised GLB, for browsers without WebGL and for checking orientation.

blender --background --factory-startup --python tools/blender/fallbacks.py -- IN.glb OUT.png [VIEW] [SIZE]

VIEW is "three-quarter" (default, front left and slightly above) or "front".
Transparent background, soft studio light, Eevee.
"""
import math
import sys

import bpy
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
src, dst = args[0], args[1]
view = args[2] if len(args) > 2 else "three-quarter"
res = int(args[3]) if len(args) > 3 else 1200

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
scene = bpy.context.scene

meshes = [o for o in scene.objects if o.type == "MESH"]
corners = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
mn = Vector((min(c.x for c in corners), min(c.y for c in corners), min(c.z for c in corners)))
mx = Vector((max(c.x for c in corners), max(c.y for c in corners), max(c.z for c in corners)))
centre = (mn + mx) / 2
radius = (mx - mn).length / 2

# glTF front (+Z) arrives in Blender as -Y, so the camera looks along +Y from the front.
if view == "front":
    direction = Vector((0, -1, 0.08)).normalized()
else:
    direction = Vector((-0.62, -1, 0.42)).normalized()
cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 70
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
distance = radius / math.tan(cam_data.angle / 2) * 1.12
cam.location = centre + direction * distance
cam.rotation_euler = (centre - cam.location).to_track_quat("-Z", "Y").to_euler()
scene.camera = cam


def light(name, kind, energy, loc, size=2.0, color=(1, 1, 1)):
    data = bpy.data.lights.new(name, kind)
    data.energy = energy
    data.color = color
    if kind == "AREA":
        data.size = size
    obj = bpy.data.objects.new(name, data)
    obj.location = loc
    obj.rotation_euler = (centre - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
    scene.collection.objects.link(obj)


r = max(radius, 0.3)
light("key", "AREA", 260 * r * r, centre + Vector((-2.2, -2.6, 2.4)) * r, 3 * r, (1.0, 0.95, 0.86))
light("fill", "AREA", 110 * r * r, centre + Vector((2.6, -1.6, 1.0)) * r, 4 * r, (0.92, 0.97, 1.0))
light("rim", "AREA", 160 * r * r, centre + Vector((0.6, 2.8, 2.2)) * r, 2 * r)

world = bpy.data.worlds.new("world")
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (0.96, 0.95, 0.91, 1)
world.node_tree.nodes["Background"].inputs[1].default_value = 0.6
scene.world = world

scene.render.engine = "BLENDER_EEVEE"
scene.render.film_transparent = True
scene.render.resolution_x = res
scene.render.resolution_y = res
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.view_settings.view_transform = "AgX"
scene.render.filepath = dst
bpy.ops.render.render(write_still=True)
print(f"RENDERED {dst}")
