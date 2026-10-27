"""Builds the day-film set from nothing and saves day.blend beside this file.

    blender -b --factory-startup -P tools/blender/film/build.py

One long sunlit plaster wall on a terrazzo floor (x runs left to right along the wall, the wall is the y=0 plane facing
-y, z is up). Products sit along it in the order of the day: solar panel, inverter, solar AC, power station, LED
pendants, solar camera, generator; at the far end an oak mezzanine carries the furniture. Nothing here is animated:
film.py sets every moving part per frame.
"""

import math
import os
import sys

import bpy
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import lib  # noqa: E402
from lib import box, cylinder, decal, empty, principled, quad, sphere, textured, tube, value  # noqa: E402

scene = lib.reset()

# ---------------------------------------------------------------- materials

PLASTER = textured('Plaster', 'plaster.png', tile=2.4, rough=0.92, bump=0.35, hue_sat=(0.32, 1.03))
TERRAZZO = textured('Terrazzo', 'terrazzo.png', tile=1.6, rough=0.32, bump=0.04)
OAK = textured('Oak', 'oak.png', tile=1.2, rough=0.55, bump=0.06)
OAK_RUN = textured('OakRun', 'oak.png', tile=1.2, rough=0.5, bump=0.06)  # grain along x
OAK_RUN.node_tree.nodes['Mapping'].inputs['Rotation'].default_value[2] = math.pi / 2
OAK_FLOOR = textured('OakFloor', 'oak.png', tile=1.6, rough=0.42, bump=0.05)
OAK_FLOOR.node_tree.nodes['Mapping'].inputs['Rotation'].default_value[2] = math.pi / 2

WHITE = principled('WhiteCasing', (0.80, 0.81, 0.82), rough=0.3, Coat_Weight=0.25, Coat_Roughness=0.15)
DARK = principled('DarkPlastic', (0.075, 0.08, 0.085), rough=0.42)
MID = principled('MidGrey', (0.30, 0.31, 0.32), rough=0.38)
LIGHT_GREY = principled('LightGrey', (0.62, 0.63, 0.63), rough=0.4)
SILVER = principled('Silver', (0.72, 0.73, 0.75), rough=0.26, metal=0.9)
ALU = principled('Aluminium', (0.78, 0.79, 0.81), rough=0.3, metal=1.0)
STEEL = principled('Steel', (0.42, 0.43, 0.45), rough=0.35, metal=1.0)
RUBBER = principled('Rubber', (0.012, 0.012, 0.013), rough=0.6)
GLASS = principled('Glass', (1, 1, 1), rough=0.02, Transmission_Weight=1.0, IOR=1.5)
BLACK_GLASS = principled('BlackGlass', (0.01, 0.01, 0.012), rough=0.05, Coat_Weight=1.0, Coat_Roughness=0.02)
FOREST = principled('ForestPlastic', (0.012, 0.06, 0.032), rough=0.4, Coat_Weight=0.2)
WARM_GREY = principled('WarmGrey', (0.58, 0.575, 0.55), rough=0.42)
COPPER = principled('Copper', (0.8, 0.42, 0.28), rough=0.3, metal=1.0)
LINEN = principled('Linen', (0.62, 0.58, 0.52), rough=0.95, Sheen_Weight=0.4)


def cells_material(name='Cells', cols=6, rows=10):
    """Blue polycrystalline cells (as in the store's photo) under glass, with silver busbars and white gaps."""
    m = principled(name, rough=0.22, Coat_Weight=1.0, Coat_Roughness=0.015, Coat_IOR=1.5)
    nt = m.node_tree
    b = lib.bsdf(m)
    mp = lib.uv_mapping(nt, scale=(cols, rows, 1))
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(mp.outputs['Vector'], sep.inputs['Vector'])

    def fract_edge(src, width):
        fr = nt.nodes.new('ShaderNodeMath')
        fr.operation = 'FRACT'
        nt.links.new(src, fr.inputs[0])
        dist = nt.nodes.new('ShaderNodeMath')
        dist.operation = 'PINGPONG'
        dist.inputs[1].default_value = 0.5
        nt.links.new(fr.outputs[0], dist.inputs[0])
        st = nt.nodes.new('ShaderNodeMath')
        st.operation = 'LESS_THAN'
        st.inputs[1].default_value = width
        nt.links.new(dist.outputs[0], st.inputs[0])
        return st.outputs[0], fr.outputs[0]

    gx, fx = fract_edge(sep.outputs['X'], 0.018)
    gy, fy = fract_edge(sep.outputs['Y'], 0.012)
    gap = nt.nodes.new('ShaderNodeMath')
    gap.operation = 'MAXIMUM'
    nt.links.new(gx, gap.inputs[0])
    nt.links.new(gy, gap.inputs[1])

    # Three busbars per cell.
    bus_x = nt.nodes.new('ShaderNodeMath')
    bus_x.operation = 'MULTIPLY'
    bus_x.inputs[1].default_value = 3.0
    nt.links.new(fx, bus_x.inputs[0])
    bus, _ = fract_edge(bus_x.outputs[0], 0.012)

    vor = nt.nodes.new('ShaderNodeTexVoronoi')
    vor.inputs['Scale'].default_value = 7.0
    nt.links.new(mp.outputs['Vector'], vor.inputs['Vector'])
    ramp = nt.nodes.new('ShaderNodeValToRGB')
    ramp.color_ramp.elements[0].color = (0.010, 0.025, 0.085, 1)
    ramp.color_ramp.elements[1].color = (0.035, 0.075, 0.20, 1)
    nt.links.new(vor.outputs['Distance'], ramp.inputs['Fac'])

    with_bus = nt.nodes.new('ShaderNodeMix')
    with_bus.data_type = 'RGBA'
    nt.links.new(bus, with_bus.inputs['Factor'])
    nt.links.new(ramp.outputs['Color'], with_bus.inputs[6])
    with_bus.inputs[7].default_value = (0.55, 0.56, 0.58, 1)
    with_gap = nt.nodes.new('ShaderNodeMix')
    with_gap.data_type = 'RGBA'
    nt.links.new(gap.outputs[0], with_gap.inputs['Factor'])
    nt.links.new(with_bus.outputs[2], with_gap.inputs[6])
    with_gap.inputs[7].default_value = (0.78, 0.79, 0.80, 1)
    nt.links.new(with_gap.outputs[2], b.inputs['Base Color'])

    # A faint flare value the film raises at noon (cells catching light).
    flare = value(nt, 'cell_flare', 0.0)
    em = nt.nodes.new('ShaderNodeMath')
    em.operation = 'MULTIPLY'
    nt.links.new(flare.outputs[0], em.inputs[0])
    nt.links.new(bus, em.inputs[1])
    b.inputs['Emission Color'].default_value = (1.0, 0.86, 0.62, 1)
    nt.links.new(em.outputs[0], b.inputs['Emission Strength'])
    return m


def travelling_glow(name, base_color, glow_color, phase_name, amount_name, width=0.07):
    """Dark cable whose surface carries a moving band of light (UV.x is length along the cable)."""
    m = principled(name, base_color, rough=0.55)
    nt = m.node_tree
    b = lib.bsdf(m)
    tc = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(tc.outputs['UV'], sep.inputs['Vector'])
    ph = value(nt, phase_name, -1.0)
    amt = value(nt, amount_name, 0.0)
    d = nt.nodes.new('ShaderNodeMath')
    d.operation = 'SUBTRACT'
    nt.links.new(sep.outputs['X'], d.inputs[0])
    nt.links.new(ph.outputs[0], d.inputs[1])
    q = nt.nodes.new('ShaderNodeMath')
    q.operation = 'DIVIDE'
    q.inputs[1].default_value = width
    nt.links.new(d.outputs[0], q.inputs[0])
    sq = nt.nodes.new('ShaderNodeMath')
    sq.operation = 'MULTIPLY'
    nt.links.new(q.outputs[0], sq.inputs[0])
    nt.links.new(q.outputs[0], sq.inputs[1])
    neg = nt.nodes.new('ShaderNodeMath')
    neg.operation = 'MULTIPLY'
    neg.inputs[1].default_value = -1.0
    nt.links.new(sq.outputs[0], neg.inputs[0])
    ex = nt.nodes.new('ShaderNodeMath')
    ex.operation = 'EXPONENT'
    nt.links.new(neg.outputs[0], ex.inputs[0])
    # A faint wake behind the pulse: where the current has already been.
    wake = nt.nodes.new('ShaderNodeMath')
    wake.operation = 'LESS_THAN'
    nt.links.new(sep.outputs['X'], wake.inputs[0])
    nt.links.new(ph.outputs[0], wake.inputs[1])
    wk = nt.nodes.new('ShaderNodeMath')
    wk.operation = 'MULTIPLY'
    wk.inputs[1].default_value = 0.12
    nt.links.new(wake.outputs[0], wk.inputs[0])
    tot = nt.nodes.new('ShaderNodeMath')
    tot.operation = 'ADD'
    nt.links.new(ex.outputs[0], tot.inputs[0])
    nt.links.new(wk.outputs[0], tot.inputs[1])
    st = nt.nodes.new('ShaderNodeMath')
    st.operation = 'MULTIPLY'
    nt.links.new(tot.outputs[0], st.inputs[0])
    nt.links.new(amt.outputs[0], st.inputs[1])
    b.inputs['Emission Color'].default_value = (*glow_color, 1)
    nt.links.new(st.outputs[0], b.inputs['Emission Strength'])
    return m


def airflow_material():
    """Pale, mostly transparent strands; a soft front travels along them while the AC runs."""
    m = bpy.data.materials.new('Airflow')
    nt = lib._nodes_on(m)
    for n in list(nt.nodes):
        if n.type != 'OUTPUT_MATERIAL':
            nt.nodes.remove(n)
    out = nt.nodes['Material Output']
    tc = nt.nodes.new('ShaderNodeTexCoord')
    sep = nt.nodes.new('ShaderNodeSeparateXYZ')
    nt.links.new(tc.outputs['UV'], sep.inputs['Vector'])
    ph = value(nt, 'air_phase', 0.0)
    amt = value(nt, 'air_amount', 0.0)
    # Visible from the vent up to the travelling front, fading toward the front and toward the strand's edges.
    front = nt.nodes.new('ShaderNodeMapRange')
    nt.links.new(sep.outputs['X'], front.inputs['Value'])
    front.inputs['From Min'].default_value = 0.0
    nt.links.new(ph.outputs[0], front.inputs['From Max'])
    front.inputs['To Min'].default_value = 1.0
    front.inputs['To Max'].default_value = 0.0
    front.clamp = True
    across = nt.nodes.new('ShaderNodeMath')
    across.operation = 'PINGPONG'
    across.inputs[1].default_value = 0.5
    nt.links.new(sep.outputs['Y'], across.inputs[0])
    edge = nt.nodes.new('ShaderNodeMapRange')
    nt.links.new(across.outputs[0], edge.inputs['Value'])
    edge.inputs['From Max'].default_value = 0.5
    noise = nt.nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 6.0
    noise.inputs['Detail'].default_value = 3.0
    nt.links.new(tc.outputs['UV'], noise.inputs['Vector'])
    m1 = nt.nodes.new('ShaderNodeMath')
    m1.operation = 'MULTIPLY'
    nt.links.new(front.outputs['Result'], m1.inputs[0])
    nt.links.new(edge.outputs['Result'], m1.inputs[1])
    wisp = nt.nodes.new('ShaderNodeMapRange')
    wisp.inputs['From Min'].default_value = 0.3
    wisp.inputs['From Max'].default_value = 0.72
    nt.links.new(noise.outputs['Fac'], wisp.inputs['Value'])
    m2 = nt.nodes.new('ShaderNodeMath')
    m2.operation = 'MULTIPLY'
    nt.links.new(m1.outputs[0], m2.inputs[0])
    nt.links.new(wisp.outputs['Result'], m2.inputs[1])
    m3 = nt.nodes.new('ShaderNodeMath')
    m3.operation = 'MULTIPLY'
    nt.links.new(m2.outputs[0], m3.inputs[0])
    nt.links.new(amt.outputs[0], m3.inputs[1])
    em = nt.nodes.new('ShaderNodeEmission')
    em.inputs['Color'].default_value = (0.78, 0.93, 1.0, 1)
    em.inputs['Strength'].default_value = 2.4
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(m3.outputs[0], mix.inputs['Fac'])
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(em.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    return m


def filament_material(i):
    """LED filament: dark when off, glowing at the shared Blackbody temperature when on."""
    m = bpy.data.materials.new(f'Filament{i}')
    nt = lib._nodes_on(m)
    for n in list(nt.nodes):
        if n.type != 'OUTPUT_MATERIAL':
            nt.nodes.remove(n)
    out = nt.nodes['Material Output']
    off = nt.nodes.new('ShaderNodeBsdfPrincipled')
    off.inputs['Base Color'].default_value = (0.55, 0.42, 0.18, 1)
    off.inputs['Roughness'].default_value = 0.4
    bb = nt.nodes.new('ShaderNodeBlackbody')
    k = value(nt, 'kelvin', 3000.0)
    nt.links.new(k.outputs[0], bb.inputs['Temperature'])
    em = nt.nodes.new('ShaderNodeEmission')
    nt.links.new(bb.outputs['Color'], em.inputs['Color'])
    power = value(nt, f'bulb{i}_power', 0.0)
    nt.links.new(power.outputs[0], em.inputs['Strength'])
    add = nt.nodes.new('ShaderNodeAddShader')
    nt.links.new(off.outputs[0], add.inputs[0])
    nt.links.new(em.outputs[0], add.inputs[1])
    nt.links.new(add.outputs[0], out.inputs['Surface'])
    return m


def bulb_glass(name):
    """Blown glass with a real wall (an outer and an inner surface): it refracts, rims and catches highlights like a
    bulb. Shadow rays pass straight through, so the light inside still reaches the wall with caustics off."""
    m = bpy.data.materials.new(name)
    nt = lib._nodes_on(m)
    for n in list(nt.nodes):
        if n.type != 'OUTPUT_MATERIAL':
            nt.nodes.remove(n)
    out = nt.nodes['Material Output']
    glass = nt.nodes.new('ShaderNodeBsdfGlass')
    glass.inputs['Color'].default_value = (0.995, 0.985, 0.965, 1)
    glass.inputs['Roughness'].default_value = 0.0
    glass.inputs['IOR'].default_value = 1.47
    tr = nt.nodes.new('ShaderNodeBsdfTransparent')
    lp = nt.nodes.new('ShaderNodeLightPath')
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(lp.outputs['Is Shadow Ray'], mix.inputs['Fac'])
    nt.links.new(glass.outputs[0], mix.inputs[1])
    nt.links.new(tr.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs['Surface'])
    return m


BULB_GLASS = bulb_glass('BulbGlass')
BRASS = principled('Brass', (0.78, 0.6, 0.34), rough=0.28, metal=1.0)


def flipped(ob):
    """Turn a closed mesh inside out (the inner wall of the bulb)."""
    for p in ob.data.polygons:
        p.flip()
    ob.data.update()
    return ob


CELLS = cells_material()
CELLS_SMALL = cells_material('CellsSmall', cols=4, rows=3)
CABLE = travelling_glow('Cable', (0.015, 0.015, 0.016), (1.0, 0.62, 0.22), 'cable_phase', 'cable_glow', width=0.09)
AIR = airflow_material()
LED_STRIP = lib.emissive('LedStrip', (1.0, 0.78, 0.55), 'ledge_led', 0.0)
STATUS_GREEN = lib.emissive('StatusGreen', (0.25, 1.0, 0.45), 'status_green', 0.0)
STATUS_AMBER = lib.emissive('StatusAmber', (1.0, 0.55, 0.12), 'gen_led', 0.0)
AC_DISPLAY = lib.emissive('AcDisplay', (0.6, 0.85, 1.0), 'ac_glow', 0.0)

# ---------------------------------------------------------------- set

WALL_X0, WALL_X1 = -8.0, 40.0
quad('Wall', (WALL_X0, 0, 0), (1, 0, 0), (0, 0, 1), (WALL_X1 - WALL_X0, 9.5), PLASTER)
quad('Floor', (WALL_X0, -16, 0), (1, 0, 0), (0, 1, 0), (WALL_X1 - WALL_X0, 16), TERRAZZO)
box('Skirting', (WALL_X1 - WALL_X0, 0.018, 0.1), loc=((WALL_X0 + WALL_X1) / 2, -0.009, 0.05), mat=OAK_RUN, bevel=0.003)

# Oak ledge with a hidden LED strip that washes the wall at night.
LEDGE_X0, LEDGE_X1, LEDGE_Z = WALL_X0, 26.0, 3.5
box('Ledge', (LEDGE_X1 - LEDGE_X0, 0.24, 0.1), loc=((LEDGE_X0 + LEDGE_X1) / 2, -0.12, LEDGE_Z), mat=OAK_RUN, bevel=0.006)
quad('LedgeLed', (LEDGE_X0, -0.03, LEDGE_Z - 0.0505), (1, 0, 0), (0, -1, 0), (LEDGE_X1 - LEDGE_X0, 0.03), LED_STRIP)
ledge_light = bpy.data.lights.new('LedgeWash', 'AREA')
ledge_light.shape = 'RECTANGLE'
ledge_light.size = LEDGE_X1 - LEDGE_X0
ledge_light.size_y = 0.04
ledge_light.color = (1.0, 0.72, 0.45)
ledge_light.energy = 0.0
lo = bpy.data.objects.new('LedgeWash', ledge_light)
lo.location = ((LEDGE_X0 + LEDGE_X1) / 2, -0.06, LEDGE_Z - 0.06)
lib.link(lo)

# Mezzanine (the furniture floor) at the far end.
MEZ_X0, MEZ_X1, MEZ_DEPTH, MEZ_Z = 26.6, 40.0, 3.8, 4.5
box('Slab', (MEZ_X1 - MEZ_X0, MEZ_DEPTH, 0.36), loc=((MEZ_X0 + MEZ_X1) / 2, -MEZ_DEPTH / 2, MEZ_Z - 0.18), mat=PLASTER)
box('SlabFascia', (MEZ_X1 - MEZ_X0 + 0.02, 0.04, 0.38), loc=((MEZ_X0 + MEZ_X1) / 2, -MEZ_DEPTH - 0.02, MEZ_Z - 0.18), mat=OAK_RUN, bevel=0.004)
box('SlabEnd', (0.04, MEZ_DEPTH + 0.04, 0.38), loc=(MEZ_X0 - 0.02, -MEZ_DEPTH / 2, MEZ_Z - 0.18), mat=OAK, bevel=0.004)
quad('UpperFloor', (MEZ_X0, -MEZ_DEPTH, MEZ_Z + 0.001), (1, 0, 0), (0, 1, 0), (MEZ_X1 - MEZ_X0, MEZ_DEPTH), OAK_FLOOR)
# Oak soffit under the mezzanine with a row of small downlights (lit with the ledge strip).
quad('Soffit', (MEZ_X0, 0, MEZ_Z - 0.361), (1, 0, 0), (0, -1, 0), (MEZ_X1 - MEZ_X0, MEZ_DEPTH), OAK_RUN)
for k in range(9):
    dx = MEZ_X0 + 0.9 + k * 1.45
    cylinder(f'Downlight{k}', 0.045, 0.01, loc=(dx, -1.9, MEZ_Z - 0.366), mat=LED_STRIP)
    dl = bpy.data.lights.new(f'DownLamp{k}', 'SPOT')
    dl.spot_size = math.radians(70)
    dl.spot_blend = 0.6
    dl.shadow_soft_size = 0.03
    dl.energy = 0.0
    dl.color = (1.0, 0.78, 0.55)
    dlo = bpy.data.objects.new(f'DownLamp{k}', dl)
    dlo.location = (dx, -1.9, MEZ_Z - 0.38)
    dlo.visible_camera = False
    lib.link(dlo)
box('UpperSkirting', (MEZ_X1 - MEZ_X0, 0.018, 0.1), loc=((MEZ_X0 + MEZ_X1) / 2, -0.009, MEZ_Z + 0.05), mat=OAK_RUN, bevel=0.003)

# ---------------------------------------------------------------- products

# Solar panel on an oak post. PanelHead yaws, PanelTilt tilts (film.py).
PANEL_AT = Vector((1.7, -2.0, 0))
panel = empty('Panel', PANEL_AT)
cylinder('PanelBase', 0.34, 0.045, loc=(0, 0, 0.0225), mat=OAK, parent=panel)
cylinder('PanelPost', 0.07, 1.40, loc=(0, 0, 0.745), mat=OAK, parent=panel)
cylinder('PanelCollar', 0.082, 0.07, loc=(0, 0, 1.44), mat=STEEL, parent=panel)
head = empty('PanelHead', (0, 0, 1.48), parent=panel)
tilt = empty('PanelTilt', (0, 0, 0), parent=head)
box('PanelBracket', (0.2, 0.16, 0.05), loc=(0, 0, 0.0), mat=STEEL, bevel=0.008, parent=tilt)
for sx in (-0.32, 0.32):
    box(f'PanelRail{sx}', (0.045, 1.5, 0.035), loc=(sx, 0, 0.042), mat=ALU, bevel=0.004, parent=tilt)
box('PanelFrame', (1.04, 1.72, 0.042), loc=(0, 0, 0.081), mat=ALU, bevel=0.005, parent=tilt)
quad('PanelCells', (-0.5, -0.84, 0.1025), (1, 0, 0), (0, 1, 0), (1.0, 1.68), CELLS, uv_metres=False, parent=tilt)

# Cable from the panel down the post, across the floor, along the skirting and up into the inverter.
INVERTER_AT = Vector((5.6, 0, 1.38))
cable_pts = [
    (PANEL_AT.x + 0.075, PANEL_AT.y + 0.02, 1.40), (PANEL_AT.x + 0.075, PANEL_AT.y + 0.02, 0.9),
    (PANEL_AT.x + 0.075, PANEL_AT.y + 0.02, 0.2), (PANEL_AT.x + 0.08, PANEL_AT.y + 0.06, 0.055),
    (PANEL_AT.x + 0.1, PANEL_AT.y + 0.3, 0.012), (PANEL_AT.x + 0.15, -0.5, 0.012),
    (PANEL_AT.x + 0.3, -0.06, 0.012), (PANEL_AT.x + 0.8, -0.03, 0.02),
    (INVERTER_AT.x - 0.5, -0.03, 0.02), (INVERTER_AT.x - 0.12, -0.03, 0.06),
    (INVERTER_AT.x - 0.08, -0.03, 0.4), (INVERTER_AT.x - 0.08, -0.04, INVERTER_AT.z - 0.4),
    (INVERTER_AT.x - 0.08, -0.06, INVERTER_AT.z - 0.29),
]
tube('Cable', cable_pts, 0.012, CABLE, sides=12, steps=10)

# Inverter (white wall unit with the screen from the product photo).
inv = empty('Inverter', INVERTER_AT)
box('InverterBody', (0.42, 0.15, 0.58), loc=(0, -0.075, 0), mat=WHITE, bevel=0.022, segments=5, parent=inv)
box('InverterSeam', (0.424, 0.152, 0.004), loc=(0, -0.075, -0.17), mat=MID, parent=inv)
box('InverterMount', (0.30, 0.012, 0.07), loc=(0, -0.006, 0.31), mat=STEEL, bevel=0.003, parent=inv)
for gx in (-0.12, 0, 0.12):
    cylinder(f'InverterGland{gx}', 0.012, 0.03, loc=(gx, -0.08, -0.3), mat=DARK, parent=inv)
w = 0.175
quad('InverterScreen', (-w / 2, -0.1507, 0.105 - w * 344 / 432 / 2), (1, 0, 0), (0, 0, 1), (w, w * 344 / 432),
     decal('InverterScreen', 'inverter-screen.png', glow_rects=[(0.146, 0.875, 0.282, 0.866)], glow_name='inv_glow',
           key_white=(0.80, 0.81, 0.82)), uv_metres=False, parent=inv)

# Solar AC: indoor unit on the wall, outdoor unit on oak blocks, airflow strands under the indoor unit.
AC_AT = Vector((9.4, 0, 2.45))
ac = empty('AcIndoor', AC_AT)
box('AcBody', (0.94, 0.22, 0.31), loc=(0, -0.11, 0), mat=WHITE, bevel=0.06, segments=6, parent=ac)
box('AcGroove', (0.945, 0.224, 0.003), loc=(0, -0.11, -0.055), mat=MID, parent=ac)
box('AcVent', (0.8, 0.07, 0.02), loc=(0, -0.17, -0.148), mat=DARK, parent=ac)
louver_pivot = empty('AcLouver', (0, -0.2, -0.155), parent=ac)
box('AcLouverBlade', (0.8, 0.075, 0.008), loc=(0, -0.03, 0), mat=WHITE, bevel=0.003, parent=louver_pivot)
quad('AcDisplay', (0.27, -0.2205, 0.02), (1, 0, 0), (0, 0, 1), (0.06, 0.014), AC_DISPLAY, uv_metres=False, parent=ac)
for i in range(7):
    spread = (i - 3) / 3
    x0 = spread * 0.34
    pts = [(x0, -0.21, -0.16), (x0 * 1.3, -0.45, -0.42), (x0 * 1.9, -0.8, -0.85), (x0 * 2.6, -1.2, -1.4), (x0 * 3.2, -1.6, -1.95)]
    lib.ribbon(f'Air{i}', pts, 0.16, normal_hint=(0, -0.3, 1), mat=AIR, parent=ac)

AC_OUT_AT = Vector((11.05, -0.42, 0))
aco = empty('AcOutdoor', AC_OUT_AT)
for bx in (-0.28, 0.28):
    box(f'AcBlock{bx}', (0.12, 0.34, 0.07), loc=(bx, 0, 0.035), mat=OAK, bevel=0.006, parent=aco)
box('AcOutBody', (0.82, 0.32, 0.58), loc=(0, 0, 0.36), mat=LIGHT_GREY, bevel=0.014, parent=aco)
FAN_C = Vector((-0.1, -0.162, 0.36))
cylinder('AcFanHole', 0.215, 0.006, loc=FAN_C, mat=RUBBER, axis='Y', parent=aco)
for r in (0.07, 0.115, 0.16, 0.205):
    ring = [(FAN_C.x + r * math.cos(a), FAN_C.y - 0.006, FAN_C.z + r * math.sin(a)) for a in [2 * math.pi * k / 48 for k in range(49)]]
    tube(f'AcGrille{r}', ring, 0.0035, LIGHT_GREY, sides=6, steps=2, parent=aco)
for a in range(4):
    ang = math.pi / 4 + a * math.pi / 2
    box(f'AcSpoke{a}', (0.42, 0.006, 0.007), loc=(FAN_C.x, FAN_C.y - 0.006, FAN_C.z), mat=LIGHT_GREY, parent=aco).rotation_euler = (0, ang, 0)
fan = empty('AcFan', (FAN_C.x, FAN_C.y + 0.04, FAN_C.z), parent=aco)
for a in range(3):
    blade = box(f'AcBlade{a}', (0.17, 0.01, 0.075), loc=(0, 0, 0), mat=MID, bevel=0.02, parent=fan)
    blade.rotation_euler = (0.35, 2 * math.pi * a / 3, 0)
    blade.location = (0.09 * math.cos(2 * math.pi * a / 3), 0, -0.09 * math.sin(2 * math.pi * a / 3))
for k in range(9):
    box(f'AcFin{k}', (0.004, 0.24, 0.006), loc=(0.37, 0, 0.18 + k * 0.04), mat=MID, parent=aco)
for pz in (0.2, 0.26):
    cylinder(f'AcValve{pz}', 0.013, 0.05, loc=(0.425, -0.06, pz), mat=COPPER, axis='X', parent=aco)

# Power station on an oak bench (front panel from the product photo).
BENCH_AT = Vector((14.2, -0.55, 0))
bench = empty('Bench', BENCH_AT)
box('BenchTop', (1.3, 0.44, 0.05), loc=(0, 0, 0.415), mat=OAK_RUN, bevel=0.008, parent=bench)
for bx in (-0.55, 0.55):
    box(f'BenchLeg{bx}', (0.06, 0.4, 0.39), loc=(bx, 0, 0.195), mat=OAK, bevel=0.006, parent=bench)
station = empty('Station', (0.05, 0, 0.44), parent=bench)
box('StationBody', (0.40, 0.27, 0.215), loc=(0, 0, 0.1125), mat=MID, bevel=0.016, parent=station)
box('StationBand', (0.402, 0.272, 0.05), loc=(0, 0, 0.245), mat=LIGHT_GREY, bevel=0.01, parent=station)
for cx in (-0.167, 0.167):
    for cy in (-0.098, 0.098):
        box(f'StationCap{cx}{cy}', (0.072, 0.078, 0.07), loc=(cx, cy, 0.262), mat=SILVER, bevel=0.014, parent=station)
    box(f'StationHandle{cx}', (0.032, 0.13, 0.026), loc=(cx, 0, 0.287), mat=SILVER, bevel=0.01, parent=station)
for fx in (-0.16, 0.16):
    for fy in (-0.1, 0.1):
        cylinder(f'StationFoot{fx}{fy}', 0.016, 0.012, loc=(fx, fy, 0.006), mat=RUBBER, parent=station)
pw = 0.33
quad('StationPanel', (-pw / 2, -0.1365, 0.118 - pw * 704 / 1168 / 2), (1, 0, 0), (0, 0, 1), (pw, pw * 704 / 1168),
     decal('StationPanel', 'station-panel.png', glow_name='ps_glow',
           glow_rects=[(0.291, 0.726, 0.597, 0.926), (0.058, 0.12, 0.091, 0.83), (0.925, 0.99, 0.091, 0.83)]),
     uv_metres=False, parent=station)

# LED pendants: three bulbs on fabric cords, the middle one is the colour-temperature close-up.
PENDANTS = [(17.05, -0.5, 1.98), (17.75, -0.5, 1.82), (18.45, -0.5, 1.93)]


def g95_profile(inset=0.0):
    """Radius/height pairs for a G95 globe (centre at z -0.012, radius 0.06) that narrows into a 29 mm neck."""
    pts = []
    for k in range(0, 41):
        a = -math.pi / 2 + (math.pi / 2 + math.radians(68)) * k / 40
        pts.append((max(0.0, (0.06 - inset) * math.cos(a)), -0.012 + (0.06 - inset) * math.sin(a)))
    pts[0] = (0.0, pts[0][1])
    for r, z in ((0.0205, 0.0485), (0.0172, 0.0535), (0.0156, 0.0575), (0.0150, 0.0615)):
        pts.append((r - inset, z))
    return pts


G95_OUTER = g95_profile()
G95_INNER = g95_profile(0.0011)
for i, (px, py, pz) in enumerate(PENDANTS):
    root = empty(f'Pendant{i}', (px, py, pz))
    tube(f'Cord{i}', [(0, 0, 0.168), (0, 0, 1.2), (0, 0, 3.0)], 0.0028, RUBBER, sides=6, steps=2, parent=root)
    cylinder(f'Socket{i}', 0.021, 0.08, loc=(0, 0, 0.128), mat=OAK, parent=root)
    # E27 cap: brass shell with its thread, on a short glass neck.
    cylinder(f'Cap{i}', 0.0145, 0.028, loc=(0, 0, 0.074), mat=BRASS, parent=root)
    for t, tz in enumerate((0.0645, 0.0705, 0.0765, 0.0825)):
        ring = [(0.0149 * math.cos(a), 0.0149 * math.sin(a), tz) for a in [2 * math.pi * k / 40 for k in range(41)]]
        tube(f'Thread{i}{t}', ring, 0.0011, BRASS, sides=6, steps=1, parent=root)
    # G95 globe turned in one piece, the sphere flowing into its neck; an inner surface gives the glass its wall.
    lib.lathe(f'Bulb{i}', G95_OUTER, BULB_GLASS, parent=root)
    flipped(lib.lathe(f'BulbInner{i}', G95_INNER, BULB_GLASS, parent=root))
    # Coiled LED filament on a fine glass stem, with two lead wires.
    fil = filament_material(i)
    tube(f'Stem{i}', [(0, 0, 0.05), (0, 0, 0.03), (0, 0, 0.014)], 0.0011, BULB_GLASS, sides=10, steps=2, parent=root)
    helix = []
    for k in range(161):
        t = k / 160
        a = 2 * math.pi * 3.25 * t
        helix.append((0.0165 * math.cos(a), 0.0165 * math.sin(a), -0.006 - 0.038 * t))
    tube(f'Filament{i}', helix, 0.00115, fil, sides=8, steps=1, parent=root)
    tube(f'LeadA{i}', [(0, 0, 0.014), (0.009, 0, 0.002), helix[0]], 0.0003, SILVER, sides=5, steps=6, parent=root)
    tube(f'LeadB{i}', [(0, 0, 0.014), (-0.005, 0, -0.025), helix[-1]], 0.0003, SILVER, sides=5, steps=6, parent=root)
    lt = bpy.data.lights.new(f'BulbLight{i}', 'POINT')
    lt.shadow_soft_size = 0.02
    lt.energy = 0.0
    lo = bpy.data.objects.new(f'BulbLight{i}', lt)
    lo.location = (0, 0, -0.025)
    lo.visible_camera = False
    lo.visible_transmission = False
    lo.visible_glossy = False
    lib.link(lo, root)

# A soft key seen only in reflections: it draws the window-like highlight that shapes the glass in the close-up.
key = bpy.data.lights.new('BulbKey', 'AREA')
key.shape = 'RECTANGLE'
key.size = 0.28
key.size_y = 0.5
key.energy = 0.0
key.color = (1.0, 0.97, 0.92)
ko = bpy.data.objects.new('BulbKey', key)
mid = Vector(PENDANTS[1])
ko.location = mid + Vector((-0.5, -0.7, 0.42))
ko.rotation_euler = (mid - ko.location).to_track_quat('-Z', 'Y').to_euler()
ko.visible_camera = False
ko.visible_diffuse = False
ko.visible_volume_scatter = False
lib.link(ko)

# Solar security camera on a wall bracket with its own small panel.
CAM_AT = Vector((21.9, 0, 2.55))
cam_root = empty('SecCam', CAM_AT)
box('SecCamPlate', (0.1, 0.02, 0.14), loc=(0, -0.01, 0), mat=WHITE, bevel=0.01, parent=cam_root)
cylinder('SecCamArm', 0.018, 0.17, loc=(0, -0.095, 0), mat=WHITE, axis='Y', parent=cam_root)
pan = empty('SecCamPan', (0, -0.19, -0.02), parent=cam_root)
cylinder('SecCamNeck', 0.022, 0.05, loc=(0, 0, 0.045), mat=WHITE, parent=pan)
tilt_c = empty('SecCamTilt', (0, 0, 0), parent=pan)
sphere('SecCamHead', 0.088, mat=WHITE, parent=tilt_c, scale=(1, 1, 0.96))
sphere('SecCamFace', 0.068, loc=(0, -0.042, -0.004), mat=BLACK_GLASS, parent=tilt_c, scale=(1, 0.62, 0.9))
cylinder('SecCamLens', 0.021, 0.012, loc=(0, -0.085, 0.004), mat=GLASS, axis='Y', parent=tilt_c)
sphere('SecCamLed', 0.005, loc=(0.036, -0.08, 0.03), mat=STATUS_GREEN, parent=tilt_c)
sp = empty('SecCamPanel', (0, -0.07, 0.2), parent=cam_root)
sp.rotation_euler = (math.radians(-35), 0, 0)
cylinder('SecCamPanelArm', 0.01, 0.16, loc=(0, 0.04, -0.09), mat=WHITE, parent=sp)
box('SecCamPanelFrame', (0.26, 0.19, 0.014), mat=ALU, bevel=0.003, parent=sp)
quad('SecCamPanelCells', (-0.125, -0.09, 0.0072), (1, 0, 0), (0, 1, 0), (0.25, 0.18), CELLS_SMALL, uv_metres=False, parent=sp).rotation_euler = (0, 0, 0)

# Portable inverter generator (representative design).
GEN_AT = Vector((24.7, -0.85, 0))
gen = empty('Generator', GEN_AT)
box('GenBody', (0.54, 0.31, 0.40), loc=(0, 0, 0.245), mat=WARM_GREY, bevel=0.07, segments=6, parent=gen)
box('GenPanel', (0.25, 0.012, 0.26), loc=(0.1, -0.158, 0.235), mat=FOREST, bevel=0.03, parent=gen)
box('GenPanelBack', (0.25, 0.012, 0.26), loc=(0.1, 0.158, 0.235), mat=FOREST, bevel=0.03, parent=gen)
box('GenControl', (0.15, 0.01, 0.17), loc=(-0.14, -0.158, 0.25), mat=DARK, bevel=0.012, parent=gen)
for sx in (-0.175, -0.105):
    cylinder(f'GenSocket{sx}', 0.024, 0.012, loc=(sx, -0.165, 0.22), mat=RUBBER, axis='Y', parent=gen)
box('GenSwitch', (0.03, 0.012, 0.018), loc=(-0.175, -0.166, 0.3), mat=RUBBER, bevel=0.003, parent=gen)
sphere('GenLed', 0.006, loc=(-0.105, -0.166, 0.3), mat=STATUS_AMBER, parent=gen)
tube('GenHandle', [(-0.21, 0, 0.42), (-0.19, 0, 0.5), (0, 0, 0.525), (0.19, 0, 0.5), (0.21, 0, 0.42)], 0.019, WARM_GREY, sides=12, steps=10, parent=gen)
cylinder('GenCap', 0.032, 0.03, loc=(-0.16, 0.06, 0.455), mat=FOREST, parent=gen)
for fx in (-0.2, 0.2):
    for fy in (-0.1, 0.1):
        cylinder(f'GenFoot{fx}{fy}', 0.022, 0.03, loc=(fx, fy, 0.015), mat=RUBBER, parent=gen)
for k in range(6):
    box(f'GenVent{k}', (0.004, 0.2, 0.01), loc=(0.271, 0, 0.16 + k * 0.03), mat=DARK, parent=gen)


# ---------------------------------------------------------------- furniture upstairs

def import_glb(name, path, width, loc, rot_z=0.0):
    before = set(bpy.data.objects)
    bpy.ops.import_scene.gltf(filepath=path)
    new = [o for o in bpy.data.objects if o not in before]
    meshes = [o for o in new if o.type == 'MESH']
    root = empty(name, loc)
    for o in new:
        if o.parent is None:
            o.parent = root
    bpy.context.view_layer.update()
    pts = [o.matrix_world @ Vector(c) for o in meshes for c in o.bound_box]
    lo_ = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    hi_ = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    span = max(hi_.x - lo_.x, hi_.y - lo_.y)
    s = width / span
    centre = (lo_ + hi_) / 2
    # Sit the model's footprint centre on the root, then scale about it.
    shift = Vector(loc) - Vector((centre.x, centre.y, lo_.z))
    for o in new:
        if o.parent is root:
            o.location = o.location + shift
    root.scale = (s, s, s)
    root.rotation_euler = (0, 0, rot_z)
    for o in meshes:
        for slot in o.material_slots:
            m = slot.material
            if m and m.node_tree:
                b = m.node_tree.nodes.get('Principled BSDF')
                if b:
                    b.inputs['Roughness'].default_value = max(0.75, b.inputs['Roughness'].default_value)
        for p in o.data.polygons:
            p.use_smooth = True
    return root


MODELS = os.path.join(lib.HERE, '..', 'source')
SOFA_AT = (30.2, -1.0, MEZ_Z)
import_glb('Sofa', os.path.join(MODELS, 'sofa.glb'), 2.1, SOFA_AT, rot_z=0.0)
import_glb('Chair', os.path.join(MODELS, 'lounge-chair.glb'), 0.78, (32.4, -1.65, MEZ_Z), rot_z=math.radians(-28))
box('Rug', (2.9, 2.0, 0.012), loc=(30.6, -1.45, MEZ_Z + 0.006), mat=LINEN, bevel=0.004)
cylinder('SideTable', 0.24, 0.5, loc=(31.75, -0.75, MEZ_Z + 0.25), mat=OAK, bevel=0.02)
# Floor lamp: oak pole, linen drum shade (lit only at night).
cylinder('LampBase', 0.15, 0.025, loc=(28.65, -0.55, MEZ_Z + 0.0125), mat=OAK)
cylinder('LampPole', 0.013, 1.42, loc=(28.65, -0.55, MEZ_Z + 0.72), mat=OAK)
cylinder('LampShade', 0.2, 0.3, loc=(28.65, -0.55, MEZ_Z + 1.5), mat=LINEN, sides=64)

# ---------------------------------------------------------------- gobo (the divi-divi shadow)

def gobo_material():
    m = principled('Gobo', (0, 0, 0), rough=1.0)
    nt = m.node_tree
    b = lib.bsdf(m)
    tc = nt.nodes.new('ShaderNodeTexCoord')
    tx = lib.image(nt, 'divi.png', colorspace='Non-Color', extension='CLIP')
    nt.links.new(tc.outputs['UV'], tx.inputs['Vector'])
    bw = nt.nodes.new('ShaderNodeRGBToBW')
    nt.links.new(tx.outputs['Color'], bw.inputs['Color'])
    inv = nt.nodes.new('ShaderNodeMath')
    inv.operation = 'SUBTRACT'
    inv.inputs[0].default_value = 1.0
    nt.links.new(bw.outputs['Val'], inv.inputs[1])
    nt.links.new(inv.outputs[0], b.inputs['Alpha'])
    return m


GOBO_W = 6.0
gobo_root = empty('GoboRoot')
g = quad('Gobo', (-GOBO_W / 2, 0, -GOBO_W * 688 / 1024 / 2), (1, 0, 0), (0, 0, 1), (GOBO_W, GOBO_W * 688 / 1024),
         gobo_material(), uv_metres=False, parent=gobo_root)
lib.only_shadow(g)

# ---------------------------------------------------------------- light, world, cameras

sun = bpy.data.lights.new('Sun', 'SUN')
sun.angle = math.radians(0.9)
sun_ob = lib.link(bpy.data.objects.new('Sun', sun))
moon = bpy.data.lights.new('Moon', 'SUN')
moon.angle = math.radians(1.5)
moon.color = (0.55, 0.68, 1.0)
moon.energy = 0.0
lib.link(bpy.data.objects.new('Moon', moon))

world = bpy.data.worlds.new('World')
scene.world = world
wnt = lib._nodes_on(world)
for n in list(wnt.nodes):
    if n.type != 'OUTPUT_WORLD':
        wnt.nodes.remove(n)
sky = wnt.nodes.new('ShaderNodeTexSky')
sky.name = 'Sky'
sky.sky_type = 'MULTIPLE_SCATTERING'
if hasattr(sky, 'sun_disc'):
    sky.sun_disc = False
night = wnt.nodes.new('ShaderNodeMix')
night.data_type = 'RGBA'
night.name = 'NightMix'
night.inputs[7].default_value = (0.004, 0.007, 0.016, 1)
wnt.links.new(sky.outputs['Color'], night.inputs[6])
bg = wnt.nodes.new('ShaderNodeBackground')
bg.name = 'Background'
wnt.links.new(night.outputs[2], bg.inputs['Color'])
wnt.links.new(bg.outputs[0], wnt.nodes['World Output'].inputs['Surface'])

rig = empty('Rig')
aim = empty('Aim')
for name, lens in (('CamD', 38.0), ('CamM', 34.0)):
    cd = bpy.data.cameras.new(name)
    cd.lens = lens
    cd.sensor_fit = 'AUTO'
    cd.sensor_width = 36
    cd.clip_start = 0.05
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = 5.6
    co = lib.link(bpy.data.objects.new(name, cd), rig)
    c = co.constraints.new('TRACK_TO')
    c.target = aim
    c.track_axis = 'TRACK_NEGATIVE_Z'
    c.up_axis = 'UP_Y'
scene.camera = bpy.data.objects['CamD']

out = os.path.join(lib.HERE, 'day.blend')
bpy.ops.wm.save_as_mainfile(filepath=out)
print('SAVED', out)
