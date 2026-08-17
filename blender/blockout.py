"""KONA object blockout — proportion studies.

Frosted ice cube inside a counter-rotating ring (see docs/homepage-choreography.md
§"The object — DECIDED"). This is the BLOCKOUT: default cube + torus, rough frost,
one built-in HDRI, a grid of proportion studies. No modelling, no interior yet.

Run headless:
  blender --background --python blender/blockout.py            # full study grid
  blender --background --python blender/blockout.py -- --test  # one quick study

Renders land in blender/renders/blockout/ as <study-name>.png.
View transform is Standard (not AgX) so world white hits 255 white — the Whiteout
composite check. The final pipeline must re-solve this properly.
"""

import math
import random
import sys
import time
from pathlib import Path

import bpy
import mathutils

REPO = Path(__file__).resolve().parent.parent
OUT_DIR = REPO / "blender" / "renders" / "blockout"

HDRI = Path(bpy.utils.system_resource("DATAFILES")) / "studiolights" / "world" / "studio.exr"

# Cube edge is 1.0 everywhere; its tumble sphere (half space diagonal) is the
# envelope the ring must clear. ratio = ring major radius / tumble radius.
CUBE_EDGE = 1.0
TUMBLE_R = CUBE_EDGE * math.sqrt(3) / 2  # 0.866

# --ice from tokens.css (#7FA8C9), converted sRGB -> linear for light color.
ICE_LINEAR = (0.216, 0.395, 0.585)

# The grid: cube-to-ring ratio x ring thickness (minor radius as a fraction of
# major). Pose is fixed across the sheet so only proportion varies.
RATIOS = [1.15, 1.35, 1.60]
THICKS = [0.020, 0.045, 0.080]

# DECIDED (user, 2026-08-17, off contact-sheets 1-3): ratio 1.35, band
# 4.5%, hero attitude = POSE below, interior = combo (suspended lattice +
# sparse trapped air). 1.15 read as an accessory on the cube, 1.60 as an
# orbit logo; 2% risks vanishing at progress-indicator size, 8% read as
# jewelry; flatter ring tips drifted planetary, steeper crowded; bubbles
# alone read as decoration, fractures as organic bruising, lattice alone
# risked sterile — structure carries the argument, air carries the realism.
DECIDED = {"ratio": 1.35, "thick": 0.045, "interior": "combo"}

POSE = {
    # DECIDED hero attitude (user, 2026-08-17, contact-sheet-2). Ring plane
    # ~0.64 dot to camera: an open ellipse that still encircles the cube.
    # Face-on reads as a logo/badge; edge-on reads as a hula hoop.
    "ring_euler": (math.radians(60), 0.0, math.radians(-25)),
    # Cube corner-forward so three faces read.
    "cube_euler": (math.radians(22), math.radians(-14), math.radians(32)),
}


def input_socket(node, *names):
    for n in names:
        s = node.inputs.get(n)
        if s is not None:
            return s
    raise KeyError(f"none of {names} on {node.name}: {[s.name for s in node.inputs]}")


def make_frost_material(roughness=0.45):
    """roughness 0.45 = the frosted hero state; ~0.03 = the scrub's clear end."""
    mat = bpy.data.materials.new("frost-blockout")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    input_socket(bsdf, "Base Color").default_value = (0.88, 0.92, 0.98, 1.0)
    input_socket(bsdf, "Roughness").default_value = roughness
    input_socket(bsdf, "IOR").default_value = 1.31  # ice
    input_socket(bsdf, "Transmission Weight", "Transmission").default_value = 1.0
    return mat


def make_air_material():
    """An air pocket seen from inside ice: relative IOR 1/1.31."""
    mat = bpy.data.materials.new("air-blockout")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    input_socket(bsdf, "Base Color").default_value = (1.0, 1.0, 1.0, 1.0)
    input_socket(bsdf, "Roughness").default_value = 0.08
    input_socket(bsdf, "IOR").default_value = 1.0 / 1.31
    input_socket(bsdf, "Transmission Weight", "Transmission").default_value = 1.0
    return mat


def make_ring_material():
    mat = bpy.data.materials.new("ring-blockout")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    input_socket(bsdf, "Base Color").default_value = (0.82, 0.84, 0.87, 1.0)
    input_socket(bsdf, "Metallic").default_value = 1.0
    input_socket(bsdf, "Roughness").default_value = 0.25
    return mat


def add_bubbles(rng, rot, air, count, max_r=0.028):
    """A rising diagonal plume of trapped air — authored, not uniform scatter.
    Bigger pockets low, finer spray high, like craft ice."""
    for _ in range(count):
        t = rng.random()
        p = mathutils.Vector((
            -0.30 + 0.60 * t + rng.gauss(0, 0.09),
            -0.30 + 0.60 * t + rng.gauss(0, 0.09),
            -0.30 + 0.60 * t + rng.gauss(0, 0.09),
        ))
        p = mathutils.Vector(tuple(max(-0.42, min(0.42, c)) for c in p))
        r = 0.006 + max_r * (rng.random() ** 2) * (1.15 - 0.6 * t)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=rot @ p,
                                             segments=16, ring_count=8)
        b = bpy.context.active_object
        b.data.materials.append(air)
        bpy.ops.object.shade_smooth()


def add_lattice(cube_euler, metal):
    """A suspended precision frame — the ring's material inside the ice."""
    bpy.ops.mesh.primitive_cube_add(size=0.5, rotation=cube_euler)
    lat = bpy.context.active_object
    wf = lat.modifiers.new("Wire", "WIREFRAME")
    wf.thickness = 0.022
    lat.data.materials.append(metal)


def build_interior(kind, cube_euler, air, metal):
    """The authored interior — what the §6 clarity scrub reveals."""
    rng = random.Random(7)
    rot = mathutils.Euler(cube_euler).to_matrix()
    if kind == "bubbles":
        add_bubbles(rng, rot, air, 80)
    elif kind == "fractures":
        tex = bpy.data.textures.new("frac", "CLOUDS")
        tex.noise_scale = 0.22
        for _ in range(3):
            bpy.ops.mesh.primitive_grid_add(size=1, x_subdivisions=24,
                                            y_subdivisions=24)
            pl = bpy.context.active_object
            pl.scale = (0.62, 0.46, 1.0)
            own = mathutils.Euler((rng.uniform(0.6, 2.2),
                                   rng.uniform(-0.8, 0.8),
                                   rng.uniform(0.0, 3.1)))
            pl.rotation_euler = (rot @ own.to_matrix()).to_euler()
            pl.location = rot @ mathutils.Vector((rng.uniform(-0.12, 0.12),
                                                  rng.uniform(-0.12, 0.12),
                                                  rng.uniform(-0.12, 0.12)))
            disp = pl.modifiers.new("Displace", "DISPLACE")
            disp.texture = tex
            disp.strength = 0.05
            pl.data.materials.append(air)
            bpy.ops.object.shade_smooth()
    elif kind == "lattice":
        add_lattice(cube_euler, metal)
    elif kind == "combo":
        add_lattice(cube_euler, metal)
        add_bubbles(rng, rot, air, 36, max_r=0.016)


def build_world():
    """HDRI drives lighting and reflections; camera rays see pure white."""
    world = bpy.data.worlds.new("blockout-world")
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()

    out = nt.nodes.new("ShaderNodeOutputWorld")
    mix = nt.nodes.new("ShaderNodeMixShader")
    light_path = nt.nodes.new("ShaderNodeLightPath")

    env = nt.nodes.new("ShaderNodeTexEnvironment")
    env.image = bpy.data.images.load(str(HDRI))
    bg_hdri = nt.nodes.new("ShaderNodeBackground")
    bg_hdri.inputs["Strength"].default_value = 0.5

    bg_white = nt.nodes.new("ShaderNodeBackground")
    bg_white.inputs["Color"].default_value = (1.0, 1.0, 1.0, 1.0)

    nt.links.new(env.outputs["Color"], bg_hdri.inputs["Color"])
    nt.links.new(light_path.outputs["Is Camera Ray"], mix.inputs["Fac"])
    nt.links.new(bg_hdri.outputs["Background"], mix.inputs[1])
    nt.links.new(bg_white.outputs["Background"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return world


def build_scene(ratio, thick, ring_euler=None, cube_euler=None,
                interior=None, frost_roughness=0.45):
    ring_euler = ring_euler or POSE["ring_euler"]
    cube_euler = cube_euler or POSE["cube_euler"]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.world = build_world()

    frost = make_frost_material(frost_roughness)
    metal = make_ring_material()

    bpy.ops.mesh.primitive_cube_add(size=CUBE_EDGE, rotation=cube_euler)
    cube = bpy.context.active_object
    bevel = cube.modifiers.new("Bevel", "BEVEL")
    bevel.width = CUBE_EDGE * 0.015
    bevel.segments = 3
    cube.data.materials.append(frost)
    try:
        bpy.ops.object.shade_auto_smooth(angle=math.radians(30))
    except AttributeError:
        bpy.ops.object.shade_smooth()

    if interior:
        build_interior(interior, cube_euler, make_air_material(), metal)

    major = ratio * TUMBLE_R
    minor = thick * major
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major,
        minor_radius=minor,
        major_segments=128,
        minor_segments=32,
        rotation=ring_euler,
    )
    ring = bpy.context.active_object
    ring.data.materials.append(metal)
    bpy.ops.object.shade_smooth()

    # Soft white key upper-front-right; ice rim behind-left (the object tint).
    bpy.ops.object.light_add(type="AREA", location=(2.6, -2.4, 3.0))
    key = bpy.context.active_object
    key.data.energy = 60
    key.data.size = 3.0
    key.rotation_euler = (math.radians(38), 0, math.radians(45))

    bpy.ops.object.light_add(type="AREA", location=(-3.0, 3.2, 1.2))
    rim = bpy.context.active_object
    rim.data.energy = 420
    rim.data.size = 2.0
    rim.data.color = ICE_LINEAR
    rim.rotation_euler = (math.radians(72), 0, math.radians(-137))

    # Camera auto-framed off the ring so every study fills the frame alike.
    dist = 4.4 * (major + minor)
    az, el = math.radians(28), math.radians(16)
    cam_loc = (
        dist * math.cos(el) * math.sin(az),
        -dist * math.cos(el) * math.cos(az),
        dist * math.sin(el),
    )
    bpy.ops.object.camera_add(location=cam_loc)
    cam = bpy.context.active_object
    cam.data.lens = 60
    bpy.ops.object.empty_add(location=(0, 0, 0))
    target = bpy.context.active_object
    track = cam.constraints.new("TRACK_TO")
    track.target = target
    scene.camera = cam
    return scene


def setup_render(scene, samples, res):
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.use_denoising = True
    scene.render.resolution_x = res
    scene.render.resolution_y = res
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "Standard"


def render_study(name, ratio, thick, ring_euler=None, cube_euler=None,
                 interior=None, frost_roughness=0.45, samples=96, res=640):
    scene = build_scene(ratio, thick, ring_euler, cube_euler,
                        interior, frost_roughness)
    setup_render(scene, samples, res)
    scene.render.filepath = str(OUT_DIR / f"{name}.png")
    t0 = time.time()
    bpy.ops.render.render(write_still=True)
    print(f"[blockout] {name}: ratio={ratio} thick={thick} "
          f"interior={interior} rough={frost_roughness} "
          f"rendered in {time.time() - t0:.0f}s -> {scene.render.filepath}")


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []

    if "--test" in argv:
        render_study("test", ratio=1.35, thick=0.045, samples=48, res=512)
        return

    if "--interior" in argv:
        # Sheet 3: interior concepts, each at BOTH scrub endpoints — an
        # interior that only works in one state fails the §6 reveal.
        for kind in ["bubbles", "fractures", "lattice", "combo"]:
            for state, rough in (("frost", 0.45), ("clear", 0.03)):
                render_study(f"i_{kind}_{state}", DECIDED["ratio"],
                             DECIDED["thick"], interior=kind,
                             frost_roughness=rough)
        return

    if "--hero" in argv:
        # The reference stills of the locked configuration — what sections 1
        # and 6 get laid out against until real renders exist. The clear
        # state's dark-glass look is KEPT (user, 2026-08-17): transmission
        # rays seeing the HDRI is the reveal's payoff, not an artifact.
        render_study("hero-ref", DECIDED["ratio"], DECIDED["thick"],
                     interior=DECIDED["interior"], samples=256, res=1280)
        render_study("clear-ref", DECIDED["ratio"], DECIDED["thick"],
                     interior=DECIDED["interior"], frost_roughness=0.03,
                     samples=256, res=1280)
        return

    if "--poses" in argv:
        # Sheet 2: axis-tilt studies at the decided proportions. Ring euler is
        # (X tip from horizontal, 0, Z swing); cube euler is the tumble moment.
        poses = [
            ("p1_flat48",   (48, 0, -25), (22, -14, 32)),
            ("p2_base60",   (60, 0, -25), (22, -14, 32)),
            ("p3_steep72",  (72, 0, -25), (22, -14, 32)),
            ("p4_swing40",  (60, 0, -40), (22, -14, 32)),
            ("p5_swing10",  (60, 0, -10), (22, -14, 32)),
            ("p6_tumble",   (60, 0, -25), (35, -25, 15)),
        ]
        for name, ring_deg, cube_deg in poses:
            render_study(
                name, DECIDED["ratio"], DECIDED["thick"],
                ring_euler=tuple(math.radians(a) for a in ring_deg),
                cube_euler=tuple(math.radians(a) for a in cube_deg),
            )
        return

    for ratio in RATIOS:
        for thick in THICKS:
            name = f"r{int(ratio * 100)}_t{int(thick * 1000):03d}"
            render_study(name, ratio, thick)


main()
