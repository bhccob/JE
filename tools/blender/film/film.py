"""The day, as a function of film position.

Position `s` runs 0..8: the integer part is the chapter (same order and hours as lib/film.ts), the fraction is the
progress through it. apply(s, size) poses the sun, sky, camera and every moving product for that instant, so any
frame can be rendered on its own and chapter N's last frame is exactly chapter N+1's first.
"""

import math

import bpy
from mathutils import Vector

# Mirrors FILM in lib/film.ts: id, hours, desktop frames, phone frames.
CHAPTERS = [
    ('dawn', (5.5, 9.0), 72, 48),
    ('noon', (9.0, 13.0), 72, 48),
    ('heat', (13.0, 15.0), 60, 40),
    ('afternoon', (15.0, 17.5), 60, 40),
    ('dusk', (17.5, 20.0), 60, 40),
    ('night', (20.0, 22.5), 48, 36),
    ('outage', (22.5, 29.5), 48, 36),
    ('morning', (29.5, 31.0), 72, 48),
]
INDEX = {c[0]: i for i, c in enumerate(CHAPTERS)}
KELVIN_STILLS = [3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500]


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def smooth(a, b, x):
    t = clamp((x - a) / (b - a)) if b != a else float(x >= b)
    return t * t * (3 - 2 * t)


def lerp(a, b, t):
    return a + (b - a) * t


def hour_at(s):
    i = min(int(s), len(CHAPTERS) - 1)
    h0, h1 = CHAPTERS[i][1]
    return lerp(h0, h1, clamp(s - i))


# ---------------------------------------------------------------- sun

# hour, elevation (deg), azimuth (deg: 0 = from the right/east, 90 = from in front, 180 = from the left/west),
# colour temperature (K), strength. The morning after reuses dawn's keys shifted by 24h.
SUN_KEYS = [
    (5.5, -8, 18, 2000, 0.0), (6.25, -1.5, 20, 2000, 0.0), (6.65, 2.5, 22, 2700, 1.4), (7.2, 8, 26, 3300, 2.8),
    (8.5, 24, 38, 4300, 4.0), (10.5, 52, 66, 5200, 4.8), (12.5, 74, 95, 5600, 5.0), (14.0, 62, 124, 5400, 5.0),
    (15.5, 42, 143, 4800, 4.6), (16.8, 23, 153, 3800, 4.0), (17.8, 10, 158, 2900, 3.0), (18.4, 2, 161, 2200, 1.5),
    (18.9, -2.5, 162, 2000, 0.0), (29.5, -8, 18, 2000, 0.0),
]
SUN_KEYS += [(h + 24, e, a, k, st) for (h, e, a, k, st) in SUN_KEYS[1:4]] + [(31.5, 14, 30, 3300, 3.4)]
SUN_KEYS.sort()


def sun_at(h):
    for (h0, *v0), (h1, *v1) in zip(SUN_KEYS, SUN_KEYS[1:]):
        if h0 <= h <= h1:
            t = smooth(h0, h1, h) if h1 - h0 < 3 else (h - h0) / (h1 - h0)
            return [lerp(a, b, t) for a, b in zip(v0, v1)]
    return list(SUN_KEYS[-1][1:])


def sun_vector(elev, az):
    e, a = math.radians(elev), math.radians(az)
    return Vector((math.cos(e) * math.cos(a), -math.cos(e) * math.sin(a), math.sin(e)))


def kelvin_rgb(k):
    """Linear RGB for a colour temperature (Tanner Helland fit, then sRGB -> linear)."""
    t = clamp(k, 1000, 40000) / 100
    r = 255 if t <= 66 else 329.698727446 * (t - 60) ** -0.1332047592
    g = 99.4708025861 * math.log(t) - 161.1195681661 if t <= 66 else 288.1221695283 * (t - 60) ** -0.0755148492
    b = 255 if t >= 66 else (0 if t <= 19 else 138.5177312231 * math.log(t - 10) - 305.0447927307)

    def lin(c):
        c = clamp(c / 255)
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4

    return (lin(r), lin(g), lin(b))


def night_amount(h):
    """0 in daylight, 1 at night (blue hour in between)."""
    hh = h % 24
    if hh < 12:
        return 1 - smooth(5.6, 6.7, hh)
    return smooth(18.2, 19.4, hh)


EXPOSURE_KEYS = [(5.5, 1.3), (6.6, 0.45), (8.0, -0.35), (12.0, -0.6), (14.5, -0.55), (17.6, -0.3), (18.6, 0.4),
                 (19.6, 1.35), (20.1, 1.45), (20.8, 1.05), (22.5, 1.0), (29.5, 1.0), (30.6, 0.45), (31.0, 0.3)]


def exposure_at(h):
    for (h0, v0), (h1, v1) in zip(EXPOSURE_KEYS, EXPOSURE_KEYS[1:]):
        if h0 <= h <= h1:
            return lerp(v0, v1, smooth(h0, h1, h))
    return EXPOSURE_KEYS[-1][1]


# ---------------------------------------------------------------- camera

# s, camera position, aim (desktop composition), subject (what is in focus and centred on phones), lens.
CAM_KEYS = [
    (0.00, (-1.9, -8.9, 1.2), (0.2, 0, 1.55), (1.7, -2.0, 1.45), 32),
    (0.40, (-1.2, -7.4, 1.32), (0.55, 0, 1.45), (1.7, -2.0, 1.48), 34),
    (1.00, (1.7, -5.4, 1.15), (2.35, 0, 1.0), (1.9, -1.0, 0.9), 36),
    (1.45, (3.0, -3.0, 0.55), (3.7, 0, 0.3), (3.6, -0.05, 0.05), 36),
    (2.00, (4.65, -3.0, 1.35), (5.25, 0, 1.3), (5.6, -0.15, 1.38), 40),
    (2.50, (8.0, -3.6, 1.95), (8.6, 0, 2.0), (9.4, -0.2, 2.3), 36),
    (3.00, (8.55, -5.2, 1.65), (9.05, 0, 1.5), (10.2, -0.3, 1.4), 30),
    (3.50, (12.6, -3.6, 1.05), (13.6, 0, 0.75), (14.25, -0.55, 0.62), 38),
    (4.00, (13.35, -2.4, 0.95), (13.8, -0.4, 0.62), (14.25, -0.55, 0.62), 42),
    (4.50, (16.2, -4.2, 1.6), (17.5, 0, 1.62), (17.75, -0.5, 1.85), 40),
    (5.00, (17.4, -1.72, 1.7), (17.63, -0.5, 1.81), (17.75, -0.5, 1.8), 78),
    (5.50, (20.0, -3.8, 2.0), (21.3, 0, 2.3), (21.9, -0.2, 2.5), 42),
    (6.00, (21.25, -2.75, 2.15), (21.75, -0.2, 2.42), (21.9, -0.2, 2.5), 46),
    (6.50, (23.4, -3.6, 1.05), (24.35, -0.6, 0.5), (24.7, -0.85, 0.32), 40),
    (7.00, (23.8, -2.95, 0.82), (24.3, -0.85, 0.36), (24.7, -0.85, 0.32), 40),
    (7.25, (26.4, -6.9, 1.35), (28.2, -1.0, 2.6), (28.0, -1.9, 2.4), 30),
    (7.50, (28.2, -7.6, 3.1), (29.6, -1.5, 4.1), (29.8, -3.8, 4.3), 31),
    (7.75, (28.8, -7.3, 4.55), (30.2, 0, 5.0), (30.4, -1.0, 4.85), 33),
    (8.00, (30.05, -5.4, 5.1), (31.05, -0.4, 5.0), (30.6, -1.1, 4.95), 36),
]


def _catmull(p0, p1, p2, p3, t):
    t2, t3 = t * t, t * t * t
    return 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)


def camera_at(s):
    keys = CAM_KEYS
    ss = [k[0] for k in keys]
    i = max(0, min(len(keys) - 2, max(j for j in range(len(keys)) if ss[j] <= s)))
    t = clamp((s - ss[i]) / (ss[i + 1] - ss[i]))
    # Ease within each segment so the camera settles on every key.
    t = t * t * (3 - 2 * t) * 0.5 + t * 0.5

    def field(f):
        a = Vector(keys[max(0, i - 1)][f]) if f < 4 else keys[max(0, i - 1)][f]
        b = Vector(keys[i][f]) if f < 4 else keys[i][f]
        c = Vector(keys[i + 1][f]) if f < 4 else keys[i + 1][f]
        d = Vector(keys[min(len(keys) - 1, i + 2)][f]) if f < 4 else keys[min(len(keys) - 1, i + 2)][f]
        return _catmull(a, b, c, d, t)

    return field(1), field(2), field(3), field(4)


# ---------------------------------------------------------------- helpers to poke values

def set_value(name, v):
    """Every material Value node called `name`, plus world nodes."""
    for m in bpy.data.materials:
        nt = m.node_tree
        if nt is None:
            continue
        n = nt.nodes.get(name)
        if n is not None and n.type == 'VALUE':
            n.outputs[0].default_value = v


def ob(name):
    return bpy.data.objects[name]


def flicker(s, a, b):
    """Deterministic flicker between a and b: 1 = on."""
    if s < a or s > b:
        return 1.0
    x = (s - a) / (b - a)
    wave = math.sin(x * 97.0) * math.sin(x * 41.0 + 1.3) + 0.35 * math.sin(x * 211.0)
    return 1.0 if wave > -0.1 + 0.9 * x else 0.0


# ---------------------------------------------------------------- the day

def apply(s, size='d', kelvin=3000):
    sc = bpy.context.scene
    h = hour_at(s)
    elev, az, k, strength = sun_at(h)
    u = sun_vector(elev, az)

    sun = ob('Sun')
    sun.rotation_euler = (-u).to_track_quat('-Z', 'Y').to_euler()
    sun.data.energy = strength * smooth(-2.0, 1.5, elev)
    sun.data.color = kelvin_rgb(k)

    nt = sc.world.node_tree
    sky = nt.nodes['Sky']
    sky.sun_elevation = math.radians(max(elev, -6))
    sky.sun_rotation = math.radians(az + 90)
    n = night_amount(h)
    nt.nodes['NightMix'].inputs['Factor'].default_value = n
    # Blue hour first, then a deep night blue.
    deep = smooth(19.4, 21.5, h % 24) if h % 24 > 12 else 1 - smooth(5.2, 6.4, h % 24)
    blue = [lerp(a, b, deep) for a, b in zip((0.028, 0.095, 0.15), (0.006, 0.014, 0.024))]
    nt.nodes['NightMix'].inputs[7].default_value = (*blue, 1)
    nt.nodes['Background'].inputs['Strength'].default_value = lerp(0.11, 0.55, n)

    moon = ob('Moon')
    moon.rotation_euler = (-sun_vector(42, 128)).to_track_quat('-Z', 'Y').to_euler()
    moon.data.energy = 0.14 * n * deep

    sc.view_settings.exposure = exposure_at(h)

    # Camera: desktop frames the subject off-centre for the copy; phones centre it and stand a little further back.
    pos, aim, subject, lens = camera_at(s)
    if size == 'm':
        away = (pos - subject)
        pos = subject + away * 0.86
        # Lift the subject into the upper part of the portrait frame. Far shots use a fixed drop; very close shots
        # (the bulb) scale it to the visible height so the product never rides up to the edge.
        dist = (pos - subject).length
        half = dist * 18 / (lens * 0.95)
        aim = subject + Vector((0, 0, lerp(-0.3 * half, -0.24, smooth(1.0, 1.4, dist))))
    ob('Rig').location = pos
    ob('Aim').location = aim
    cam = ob('CamD' if size == 'd' else 'CamM')
    sc.camera = cam
    cam.data.lens = lens * (0.95 if size == 'm' else 1.0)
    cam.data.dof.focus_distance = (subject - pos).length
    # Shallow focus on the bulb close-up, so the glass stands off the wall.
    close = smooth(4.62, 4.95, s) * (1 - smooth(5.08, 5.4, s))
    cam.data.dof.aperture_fstop = lerp(5.6, 2.2, close)

    # Gobo: the divi-divi shadow on the wall at dawn and again upstairs in the morning.
    gobo = ob('GoboRoot')
    morning = s >= 7.0
    gobo.hide_render = not (s < 1.3 or morning)
    ref = sun_vector(*sun_at(30.6 if morning else 7.0)[:2])
    target = Vector((31.4, 0, 6.4)) if morning else Vector((-0.6, 0, 2.1))
    depth = 2.4
    gobo.location = target + Vector((ref.x / -ref.y * depth, -depth, ref.z / -ref.y * depth))
    gobo.scale = (-1, 1, 1)  # trade winds blow west: the canopy sweeps left

    # Solar panel: faces the visitor at first light, then follows the sun.
    p = clamp(s)
    face = Vector((0.0, -0.9, 0.44)).normalized()
    follow = smooth(0.12, 0.8, p) if s < 1 else 0.75
    normal = face.lerp(u if elev > 0 else face, follow).normalized() if elev > 0 else face
    normal = (normal + Vector((0, -0.25, 0.0))).normalized()
    ob('PanelTilt').rotation_euler = (math.acos(clamp(normal.z, -1, 1)), 0, 0)
    ob('PanelHead').rotation_euler = (0, 0, math.atan2(normal.x, -normal.y))
    set_value('cell_flare', 0.9 * smooth(1.0, 1.15, s) * (1 - smooth(1.35, 1.6, s)))

    # Current: one bright pulse runs the cable at noon, a faint wake stays lit through the day.
    set_value('cable_phase', lerp(-0.1, 1.15, smooth(1.08, 1.9, s)))
    set_value('cable_glow', 30.0 * smooth(1.0, 1.08, s) * (1 - smooth(4.2, 4.6, s)))
    set_value('inv_glow', 1.6 * smooth(1.82, 1.95, s))

    # Solar AC switches on in the heat.
    on = smooth(2.2, 2.32, s)
    set_value('ac_glow', 4.0 * on)
    ob('AcLouver').rotation_euler = (math.radians(-42 * on), 0, 0)
    set_value('air_amount', smooth(2.28, 2.5, s) * (1 - 0.35 * smooth(3.3, 3.6, s)))
    set_value('air_phase', lerp(0.0, 1.05, smooth(2.28, 2.85, s)))
    ob('AcFan').rotation_euler = (0, s * math.radians(540), 0)

    # Power station display and light bars come up in the afternoon.
    set_value('ps_glow', 1.3 * smooth(3.25, 3.6, s))

    # LED: pendants light one by one at dusk; the ledge strip washes the wall at night; the outage cuts both.
    cut = 1.0
    if 6.15 <= s <= 6.85:
        cut = flicker(s, 6.15, 6.45) if s < 6.45 else (0.0 if s < 6.72 else smooth(6.72, 6.85, s))
    dawn_off = 1 - smooth(7.3, 7.55, s)
    for i, start in enumerate((4.32, 4.47, 4.62)):
        lit = smooth(start, start + 0.035, s) * cut * dawn_off
        set_value(f'bulb{i}_power', 1.7 * lit)
        lt = ob(f'BulbLight{i}').data
        lt.energy = 3.6 * lit
        lt.color = kelvin_rgb(kelvin)
    set_value('kelvin', float(kelvin))
    ob('BulbKey').data.energy = 7.0 * close
    led = smooth(5.0, 5.18, s) * cut * dawn_off
    set_value('ledge_led', 6.0 * led)
    ob('LedgeWash').data.energy = 22.0 * led
    for k in range(9):
        ob(f'DownLamp{k}').data.energy = 30.0 * led

    # Solar camera: pans the yard at night, status light on after dusk.
    sweep = smooth(5.12, 5.92, s)
    ob('SecCamPan').rotation_euler = (0, 0, math.radians(lerp(-38, 32, sweep) * (1 if s < 6.0 else 1)))
    ob('SecCamTilt').rotation_euler = (math.radians(lerp(8, -6, sweep)), 0, 0)
    set_value('status_green', 3.0 * smooth(4.9, 5.05, s) * (1 - smooth(7.4, 7.6, s)))

    # Generator: its panel light blinks on during the outage and stays on until morning.
    gen = smooth(6.55, 6.58, s) * (1 - smooth(7.45, 7.6, s))
    if 6.55 <= s <= 6.72:
        gen *= 1.0 if int((s - 6.55) * 60) % 2 == 0 else 0.25
    set_value('gen_led', 6.0 * gen)
