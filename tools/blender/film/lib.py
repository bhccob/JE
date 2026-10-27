"""Shared helpers for the day-film set: meshes built from data (no operators), materials, swept tubes and ribbons.

Everything here is deterministic so build.py can rebuild the whole set from nothing.
"""

import math
import os

import bpy
from mathutils import Matrix, Vector

HERE = os.path.dirname(os.path.abspath(__file__))
TEX = os.path.join(HERE, 'tex')


# ---------------------------------------------------------------- scene

def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    return bpy.context.scene


def link(obj, parent=None):
    bpy.context.scene.collection.objects.link(obj)
    if parent is not None:
        obj.parent = parent
    return obj


def empty(name, loc=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = 0.2
    e.location = loc
    return link(e, parent)


def only_shadow(obj):
    """Casts shadows, never seen: for gobos and off-frame shade."""
    obj.visible_camera = False
    obj.visible_diffuse = False
    obj.visible_glossy = False
    obj.visible_transmission = False
    obj.visible_volume_scatter = False
    obj.visible_shadow = True


# ---------------------------------------------------------------- materials

def _nodes_on(m):
    if hasattr(m, 'use_nodes'):
        m.use_nodes = True
    return m.node_tree


def principled(name, color=(0.8, 0.8, 0.8), rough=0.5, metal=0.0, **inputs):
    m = bpy.data.materials.new(name)
    nt = _nodes_on(m)
    b = nt.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = (*color, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    for k, v in inputs.items():
        b.inputs[k.replace('_', ' ')].default_value = v
    return m


def bsdf(m):
    return m.node_tree.nodes.get('Principled BSDF')


def image(nt, filename, colorspace='sRGB', extension='REPEAT'):
    n = nt.nodes.new('ShaderNodeTexImage')
    n.image = bpy.data.images.load(os.path.join(TEX, filename), check_existing=True)
    n.image.colorspace_settings.name = colorspace
    n.extension = extension
    n.interpolation = 'Cubic'
    return n


def value(nt, name, v=0.0):
    """A named Value node the render script sets per frame (no keyframes)."""
    n = nt.nodes.new('ShaderNodeValue')
    n.name = name
    n.label = name
    n.outputs[0].default_value = v
    return n


def uv_mapping(nt, scale=(1, 1, 1), offset=(0, 0, 0)):
    tc = nt.nodes.new('ShaderNodeTexCoord')
    mp = nt.nodes.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = scale
    mp.inputs['Location'].default_value = offset
    nt.links.new(tc.outputs['UV'], mp.inputs['Vector'])
    return mp


def textured(name, filename, tile=1.0, rough=0.6, bump=0.15, hue_sat=None, tint=None):
    """A material whose UVs are in metres (see quad/box UVs) tiled every `tile` metres."""
    m = principled(name, rough=rough)
    nt = m.node_tree
    b = bsdf(m)
    mp = uv_mapping(nt, scale=(1 / tile, 1 / tile, 1))
    tx = image(nt, filename)
    nt.links.new(mp.outputs['Vector'], tx.inputs['Vector'])
    col = tx.outputs['Color']
    if hue_sat is not None:
        hs = nt.nodes.new('ShaderNodeHueSaturation')
        hs.inputs['Saturation'].default_value = hue_sat[0]
        hs.inputs['Value'].default_value = hue_sat[1]
        nt.links.new(col, hs.inputs['Color'])
        col = hs.outputs['Color']
    if tint is not None:
        mx = nt.nodes.new('ShaderNodeMix')
        mx.data_type = 'RGBA'
        mx.blend_type = 'MULTIPLY'
        mx.inputs['Factor'].default_value = 1.0
        mx.inputs[7].default_value = (*tint, 1)
        nt.links.new(col, mx.inputs[6])
        col = mx.outputs[2]
    nt.links.new(col, b.inputs['Base Color'])
    if bump:
        bw = nt.nodes.new('ShaderNodeRGBToBW')
        bp = nt.nodes.new('ShaderNodeBump')
        bp.inputs['Strength'].default_value = bump
        bp.inputs['Distance'].default_value = 0.002
        nt.links.new(tx.outputs['Color'], bw.inputs['Color'])
        nt.links.new(bw.outputs['Val'], bp.inputs['Height'])
        nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m


def uv_rect_mask(nt, u0, u1, v0, v1, uv_out):
    """1 inside the UV rectangle, 0 outside."""
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(uv_out, sep.inputs['Vector'])

    def band(src, lo, hi):
        a = nt.nodes.new('ShaderNodeMath')
        a.operation = 'GREATER_THAN'
        a.inputs[1].default_value = lo
        nt.links.new(src, a.inputs[0])
        b = nt.nodes.new('ShaderNodeMath')
        b.operation = 'LESS_THAN'
        b.inputs[1].default_value = hi
        nt.links.new(src, b.inputs[0])
        m = nt.nodes.new('ShaderNodeMath')
        m.operation = 'MULTIPLY'
        nt.links.new(a.outputs[0], m.inputs[0])
        nt.links.new(b.outputs[0], m.inputs[1])
        return m.outputs[0]

    mul = nt.nodes.new('ShaderNodeMath')
    mul.operation = 'MULTIPLY'
    nt.links.new(band(sep.outputs['X'], u0, u1), mul.inputs[0])
    nt.links.new(band(sep.outputs['Y'], v0, v1), mul.inputs[1])
    return mul.outputs[0]


def decal(name, filename, glow_rects=(), glow_name=None, rough=0.35, key_white=None):
    """Image-on-face material. `glow_rects` are UV rectangles that emit the image (screens, light bars), scaled by
    the Value node `glow_name`. `key_white` (rgb) swaps near-white pixels for the casing colour so edges vanish."""
    m = principled(name, rough=rough)
    nt = m.node_tree
    b = bsdf(m)
    tc = nt.nodes.new('ShaderNodeTexCoord')
    tx = image(nt, filename, extension='EXTEND')
    nt.links.new(tc.outputs['UV'], tx.inputs['Vector'])
    col = tx.outputs['Color']
    if key_white is not None:
        bw = nt.nodes.new('ShaderNodeRGBToBW')
        nt.links.new(tx.outputs['Color'], bw.inputs['Color'])
        ramp = nt.nodes.new('ShaderNodeMapRange')
        ramp.inputs['From Min'].default_value = 0.86
        ramp.inputs['From Max'].default_value = 0.95
        nt.links.new(bw.outputs['Val'], ramp.inputs['Value'])
        mx = nt.nodes.new('ShaderNodeMix')
        mx.data_type = 'RGBA'
        nt.links.new(ramp.outputs['Result'], mx.inputs['Factor'])
        nt.links.new(col, mx.inputs[6])
        mx.inputs[7].default_value = (*key_white, 1)
        col = mx.outputs[2]
    nt.links.new(col, b.inputs['Base Color'])
    if glow_rects:
        total = None
        for r in glow_rects:
            mk = uv_rect_mask(nt, *r, tc.outputs['UV'])
            if total is None:
                total = mk
            else:
                add = nt.nodes.new('ShaderNodeMath')
                add.operation = 'MAXIMUM'
                nt.links.new(total, add.inputs[0])
                nt.links.new(mk, add.inputs[1])
                total = add.outputs[0]
        g = value(nt, glow_name or f'{name}_glow', 0.0)
        mul = nt.nodes.new('ShaderNodeMath')
        mul.operation = 'MULTIPLY'
        nt.links.new(total, mul.inputs[0])
        nt.links.new(g.outputs[0], mul.inputs[1])
        nt.links.new(tx.outputs['Color'], b.inputs['Emission Color'])
        nt.links.new(mul.outputs[0], b.inputs['Emission Strength'])
    return m


def emissive(name, color=(1, 1, 1), strength_name=None, strength=1.0):
    m = bpy.data.materials.new(name)
    nt = _nodes_on(m)
    for n in list(nt.nodes):
        if n.type != 'OUTPUT_MATERIAL':
            nt.nodes.remove(n)
    out = nt.nodes.get('Material Output')
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = (*color, 1)
    if strength_name:
        v = value(nt, strength_name, strength)
        nt.links.new(v.outputs[0], em.inputs['Strength'])
    else:
        em.inputs['Strength'].default_value = strength
    nt.links.new(em.outputs[0], out.inputs['Surface'])
    return m


# ---------------------------------------------------------------- meshes

def mesh_obj(name, verts, faces, mat=None, uvs=None, smooth=False, parent=None):
    me = bpy.data.meshes.new(name)
    me.from_pydata([tuple(v) for v in verts], [], faces)
    if uvs is not None:
        layer = me.uv_layers.new(name='UVMap')
        for poly in me.polygons:
            for li in poly.loop_indices:
                vi = me.loops[li].vertex_index
                layer.data[li].uv = uvs[vi] if not callable(uvs) else uvs(verts[vi], poly)
    me.update()
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    if mat is not None:
        me.materials.append(mat)
    return link(ob, parent)


def quad(name, origin, u_axis, v_axis, size, mat=None, uv_metres=True, parent=None):
    """A rectangle from `origin` spanning size[0] along u_axis and size[1] along v_axis. UVs are in metres."""
    o, u, v = Vector(origin), Vector(u_axis).normalized(), Vector(v_axis).normalized()
    w, h = size
    verts = [o, o + u * w, o + u * w + v * h, o + v * h]
    uv = [(0, 0), (w, 0), (w, h), (0, h)] if uv_metres else [(0, 0), (1, 0), (1, 1), (0, 1)]
    return mesh_obj(name, verts, [(0, 1, 2, 3)], mat, uvs=uv, parent=parent)


def box(name, size, loc=(0, 0, 0), mat=None, bevel=0.0, segments=4, parent=None, uv_metres=True):
    """Axis-aligned box centred on `loc` (in parent space). Bevel gives the soft product edge."""
    sx, sy, sz = (s / 2 for s in size)
    verts = [(-sx, -sy, -sz), (sx, -sy, -sz), (sx, sy, -sz), (-sx, sy, -sz),
             (-sx, -sy, sz), (sx, -sy, sz), (sx, sy, sz), (-sx, sy, sz)]
    faces = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]

    def uv_of(p, poly):
        n = poly.normal
        x, y, z = p
        if abs(n.z) > 0.5:
            return (x + sx, y + sy)
        if abs(n.y) > 0.5:
            return (x + sx, z + sz)
        return (y + sy, z + sz)

    ob = mesh_obj(name, verts, faces, mat, uvs=uv_of if uv_metres else None, smooth=bevel > 0, parent=parent)
    ob.location = loc
    if bevel > 0:
        md = ob.modifiers.new('Bevel', 'BEVEL')
        md.width = bevel
        md.segments = segments
        md.limit_method = 'NONE'
        md.harden_normals = True
    return ob


def cylinder(name, radius, depth, loc=(0, 0, 0), mat=None, sides=48, parent=None, axis='Z', bevel=0.0):
    verts, faces = [], []
    for k in (0, 1):
        z = -depth / 2 + depth * k
        for i in range(sides):
            a = 2 * math.pi * i / sides
            verts.append((radius * math.cos(a), radius * math.sin(a), z))
    for i in range(sides):
        j = (i + 1) % sides
        faces.append((i, j, sides + j, sides + i))
    faces.append(tuple(reversed(range(sides))))
    faces.append(tuple(range(sides, 2 * sides)))
    if axis == 'X':
        verts = [(z, y, -x) for x, y, z in verts]
    elif axis == 'Y':
        verts = [(x, z, -y) for x, y, z in verts]
    ob = mesh_obj(name, verts, faces, mat, smooth=True, parent=parent)
    ob.location = loc
    md = ob.modifiers.new('Bevel', 'BEVEL')
    md.width = bevel if bevel else min(radius, depth) * 0.08
    md.segments = 3
    md.limit_method = 'ANGLE'
    md.harden_normals = True
    return ob


def sphere(name, radius, loc=(0, 0, 0), mat=None, rings=32, segs=64, parent=None, scale=(1, 1, 1)):
    verts = [(0, 0, -radius)]
    for r in range(1, rings):
        phi = math.pi * r / rings - math.pi / 2
        for s in range(segs):
            th = 2 * math.pi * s / segs
            verts.append((radius * math.cos(phi) * math.cos(th), radius * math.cos(phi) * math.sin(th), radius * math.sin(phi)))
    verts.append((0, 0, radius))
    faces = []
    for s in range(segs):
        faces.append((0, 1 + (s + 1) % segs, 1 + s))
    for r in range(rings - 2):
        a, b = 1 + r * segs, 1 + (r + 1) * segs
        for s in range(segs):
            t = (s + 1) % segs
            faces.append((a + s, a + t, b + t, b + s))
    top = len(verts) - 1
    last = 1 + (rings - 2) * segs
    for s in range(segs):
        faces.append((last + s, last + (s + 1) % segs, top))
    ob = mesh_obj(name, verts, faces, mat, smooth=True, parent=parent)
    ob.location = loc
    ob.scale = scale
    return ob


def lathe(name, profile, mat=None, segs=96, parent=None, loc=(0, 0, 0), cap_bottom=True):
    """Revolve a (radius, z) profile around the z axis, bottom to top. A first point at radius 0 closes the bottom."""
    verts, faces = [], []
    rows = []
    for r, z in profile:
        if r <= 1e-6:
            verts.append((0.0, 0.0, z))
            rows.append([len(verts) - 1] * segs)
            continue
        row = []
        for s in range(segs):
            a = 2 * math.pi * s / segs
            verts.append((r * math.cos(a), r * math.sin(a), z))
            row.append(len(verts) - 1)
        rows.append(row)
    for lo, hi in zip(rows, rows[1:]):
        for s in range(segs):
            t = (s + 1) % segs
            quad_ = [lo[s], lo[t], hi[t], hi[s]]
            uniq = list(dict.fromkeys(quad_))
            if len(uniq) >= 3:
                faces.append(tuple(uniq))
    ob = mesh_obj(name, verts, faces, mat, smooth=True, parent=parent)
    ob.location = loc
    return ob


def catmull(points, steps=12):
    """Smooth path through control points (Catmull-Rom), returned as a dense polyline."""
    p = [Vector(x) for x in points]
    p = [p[0]] + p + [p[-1]]
    out = []
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        for s in range(steps):
            t = s / steps
            t2, t3 = t * t, t * t * t
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3))
    out.append(p[-2])
    return out


def _frames(path, up=Vector((0, 0, 1))):
    """Tangent/normal/binormal along a polyline (parallel transport)."""
    frames = []
    t_prev = None
    n = None
    for i, pt in enumerate(path):
        a = path[max(0, i - 1)]
        b = path[min(len(path) - 1, i + 1)]
        t = (b - a).normalized()
        if n is None:
            ref = up if abs(t.dot(up)) < 0.95 else Vector((1, 0, 0))
            n = t.cross(ref).normalized()
        else:
            axis = t_prev.cross(t)
            if axis.length > 1e-6:
                ang = t_prev.angle(t)
                n = (Matrix.Rotation(ang, 3, axis.normalized()) @ n).normalized()
        frames.append((t, n, t.cross(n).normalized()))
        t_prev = t
    return frames


def _lengths(path):
    acc = [0.0]
    for i in range(1, len(path)):
        acc.append(acc[-1] + (path[i] - path[i - 1]).length)
    total = acc[-1] or 1.0
    return [a / total for a in acc], total


def tube(name, points, radius, mat=None, sides=12, steps=12, parent=None):
    """A cable swept through `points`. UV.x runs 0..1 along the length, for travelling glows."""
    path = catmull(points, steps)
    fr = _frames(path)
    ts, _ = _lengths(path)
    verts, uvs, faces = [], [], []
    for i, (pt, (t, n, b)) in enumerate(zip(path, fr)):
        for s in range(sides + 1):
            a = 2 * math.pi * s / sides
            verts.append(pt + (n * math.cos(a) + b * math.sin(a)) * radius)
            uvs.append((ts[i], s / sides))
    ring = sides + 1
    for i in range(len(path) - 1):
        for s in range(sides):
            a, c = i * ring + s, (i + 1) * ring + s
            faces.append((a, a + 1, c + 1, c))
    return mesh_obj(name, verts, faces, mat, uvs=uvs, smooth=True, parent=parent)


def ribbon(name, points, width, normal_hint=(0, 0, 1), mat=None, steps=12, parent=None, taper=True):
    """A flat strip through `points` (for airflow). UV.x runs along the strip, UV.y across it."""
    path = catmull(points, steps)
    ts, _ = _lengths(path)
    hint = Vector(normal_hint)
    verts, uvs, faces = [], [], []
    for i, pt in enumerate(path):
        a = path[max(0, i - 1)]
        b = path[min(len(path) - 1, i + 1)]
        t = (b - a).normalized()
        side = t.cross(hint).normalized()
        w = width * (math.sin(math.pi * ts[i]) ** 0.6 if taper else 1.0)
        verts += [pt - side * w / 2, pt + side * w / 2]
        uvs += [(ts[i], 0), (ts[i], 1)]
    for i in range(len(path) - 1):
        a = i * 2
        faces.append((a, a + 1, a + 3, a + 2))
    return mesh_obj(name, verts, faces, mat, uvs=uvs, smooth=True, parent=parent)
