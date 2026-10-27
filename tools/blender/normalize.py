"""Normalise a generated GLB for the web.

blender --background --factory-startup --python tools/blender/normalize.py -- IN.glb OUT.glb LONGEST_M MAX_TRIS [ROT_Z_DEG]

Joins every mesh, rotates it to face the camera (+Z in glTF), puts the origin at the centre of its base,
scales it so its longest side is LONGEST_M metres, decimates to MAX_TRIS triangles, downsizes textures
to 1024 px and exports a Draco-compressed GLB with WebP textures.
"""
import math
import sys

import bpy
from mathutils import Matrix, Vector

args = sys.argv[sys.argv.index("--") + 1:]
src, dst, longest, max_tris = args[0], args[1], float(args[2]), int(args[3])
rot_z = float(args[4]) if len(args) > 4 else 0.0

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)

meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
bpy.ops.object.select_all(action="DESELECT")
for o in meshes:
    o.select_set(True)
bpy.context.view_layer.objects.active = meshes[0]
if len(meshes) > 1:
    bpy.ops.object.join()
obj = bpy.context.view_layer.objects.active

# Drop the empties and parents the importer creates, keeping the world transform.
bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
for o in list(bpy.context.scene.objects):
    if o is not obj:
        bpy.data.objects.remove(o, do_unlink=True)

# The glTF importer leaves objects in quaternion mode, so bake the transform and rotate the mesh data itself.
bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
obj.data.transform(Matrix.Rotation(math.radians(rot_z), 4, "Z"))

# Origin at the centre of the base (Blender is Z up; the exporter converts to glTF Y up).
# Bounds come from the vertices: obj.bound_box is cached and stale right after a data transform.
coords = [v.co for v in obj.data.vertices]
mn = Vector((min(c.x for c in coords), min(c.y for c in coords), min(c.z for c in coords)))
mx = Vector((max(c.x for c in coords), max(c.y for c in coords), max(c.z for c in coords)))
size = mx - mn
base = Vector(((mn.x + mx.x) / 2, (mn.y + mx.y) / 2, mn.z))
obj.data.transform(Matrix.Translation(-base))
obj.location = (0, 0, 0)
factor = longest / max(size.x, size.y, size.z)
obj.scale = (factor, factor, factor)
bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

tris = sum(len(p.vertices) - 2 for p in obj.data.polygons)
if tris > max_tris:
    mod = obj.modifiers.new("decimate", "DECIMATE")
    mod.ratio = max_tris / tris
    bpy.ops.object.modifier_apply(modifier=mod.name)
bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35))

for img in bpy.data.images:
    if img.size[0] > 1024 or img.size[1] > 1024:
        img.scale(1024, 1024)

bpy.ops.export_scene.gltf(
    filepath=dst,
    export_format="GLB",
    use_selection=False,
    export_apply=True,
    export_yup=True,
    export_image_format="WEBP",
    export_draco_mesh_compression_enable=True,
    export_draco_mesh_compression_level=6,
)

final_tris = sum(len(p.vertices) - 2 for p in obj.data.polygons)
print(f"NORMALIZED {dst} tris={final_tris} size_m=({size.x * factor:.3f}, {size.y * factor:.3f}, {size.z * factor:.3f})")
