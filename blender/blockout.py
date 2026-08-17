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

import bmesh
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
# Frost DECIDED (user, 2026-08-17, off contact-sheets 4-5): "hybrid" —
# thin volume scatter (0.7) + blue absorption (1.2) + noise rime surface.
# Holds the silhouette on white (the blowout fix), reads as ice, keeps the
# lattice tease. The clear state stays plain glass — the dark jewel.
# Clear-state world DECIDED (user, 2026-08-17, off contact-sheet-6): the
# authored "bands" env + dispersion spread 0.02. The d5 RGB striping is a
# 3-sample fake artifact — stronger fire needs more spectral lobes, not
# more spread. One world lights BOTH states (the scrub can't jump worlds).
# Ring DECIDED (user, 2026-08-17, off contact-sheet-7): satin aluminium —
# legible on white AND against the dark jewel; dark steel read heavy,
# white ceramic vanished at progress-indicator size.
DECIDED = {"ratio": 1.35, "thick": 0.045, "interior": "combo",
           "frost": "hybrid", "world": "bands", "clear_spread": 0.02,
           "ring": "satin"}

POSE = {
    # DECIDED hero attitude (user, 2026-08-17, contact-sheet-2). Ring plane
    # ~0.64 dot to camera: an open ellipse that still encircles the cube.
    # Face-on reads as a logo/badge; edge-on reads as a hula hoop.
    "ring_euler": (math.radians(60), 0.0, math.radians(-25)),
    # Cube corner-forward so three faces read.
    "cube_euler": (math.radians(22), math.radians(-14), math.radians(32)),
}

# Set by build_scene(scrub=True): the sockets build_scrub_animation drives.
SCRUB_SOCKETS = None


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


def frost_variant(kind):
    """Material-pass frost candidates. 'base' is the blockout control;
    the others break the surface with noise and move the milk into the
    volume, which is how real frosted ice works."""
    mat = bpy.data.materials.new(f"frost-{kind}")
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    out = nt.nodes["Material Output"]
    # near-white, NOT 0.88-blue: multi-bounce transmission compounds any
    # surface tint (0.88^n goes denim). Tint lives in the absorption only.
    input_socket(bsdf, "Base Color").default_value = (0.985, 0.99, 1.0, 1.0)
    input_socket(bsdf, "IOR").default_value = 1.31
    input_socket(bsdf, "Transmission Weight", "Transmission").default_value = 1.0
    input_socket(bsdf, "Roughness").default_value = 0.45
    if kind == "base":
        return mat

    # imperfect frost: noise-broken roughness + micro bump
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 7.0
    noise.inputs["Detail"].default_value = 8.0
    ramp = nt.nodes.new("ShaderNodeMapRange")
    ramp.inputs["From Min"].default_value = 0.35
    ramp.inputs["From Max"].default_value = 0.65
    ramp.inputs["To Min"].default_value = 0.30
    ramp.inputs["To Max"].default_value = 0.58
    nt.links.new(noise.outputs["Fac"], ramp.inputs["Value"])
    nt.links.new(ramp.outputs["Result"], input_socket(bsdf, "Roughness"))
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.06
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], input_socket(bsdf, "Normal"))
    if kind == "noise":
        return mat

    if kind == "vol":
        # milk in the depth, clearer surface: internal scattering
        vol = nt.nodes.new("ShaderNodeVolumeScatter")
        vol.inputs["Color"].default_value = (0.92, 0.96, 1.0, 1.0)
        vol.inputs["Density"].default_value = 2.0
        vol.inputs["Anisotropy"].default_value = 0.35
        nt.links.new(vol.outputs["Volume"], out.inputs["Volume"])
        ramp.inputs["To Min"].default_value = 0.12
        ramp.inputs["To Max"].default_value = 0.30
    elif kind == "absorb":
        # depth tints faintly toward ice
        vol = nt.nodes.new("ShaderNodeVolumeAbsorption")
        vol.inputs["Color"].default_value = (0.80, 0.90, 0.97, 1.0)
        vol.inputs["Density"].default_value = 2.0
        nt.links.new(vol.outputs["Volume"], out.inputs["Volume"])
    elif kind == "hybrid":
        # thin milk for body + blue depth: scatter and absorption added
        scat = nt.nodes.new("ShaderNodeVolumeScatter")
        scat.inputs["Color"].default_value = (1.0, 1.0, 1.0, 1.0)
        scat.inputs["Density"].default_value = 0.7
        scat.inputs["Anisotropy"].default_value = 0.35
        absb = nt.nodes.new("ShaderNodeVolumeAbsorption")
        # retuned for the darker bands world (1.2 read denim-blue there)
        absb.inputs["Color"].default_value = (0.91, 0.945, 0.975, 1.0)
        absb.inputs["Density"].default_value = 0.6
        add = nt.nodes.new("ShaderNodeAddShader")
        nt.links.new(scat.outputs["Volume"], add.inputs[0])
        nt.links.new(absb.outputs["Volume"], add.inputs[1])
        nt.links.new(add.outputs["Shader"], out.inputs["Volume"])
        ramp.inputs["To Min"].default_value = 0.15
        ramp.inputs["To Max"].default_value = 0.38
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


def ring_variant(kind):
    """Ring material candidates. 'control' is the blockout polished steel,
    which reads heavy/dark on the white page."""
    mat = bpy.data.materials.new(f"ring-{kind}")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    if kind == "control":
        input_socket(bsdf, "Base Color").default_value = (0.82, 0.84, 0.87, 1.0)
        input_socket(bsdf, "Metallic").default_value = 1.0
        input_socket(bsdf, "Roughness").default_value = 0.25
    elif kind == "satin":
        # bright brushed aluminium — silver on white. Metallic is dropped a
        # touch: the washer's FLAT faces average the mostly-dark env, so a
        # pure metal read gunmetal; the diffuse floor keeps it silver.
        input_socket(bsdf, "Base Color").default_value = (0.94, 0.95, 0.96, 1.0)
        input_socket(bsdf, "Metallic").default_value = 0.8
        input_socket(bsdf, "Roughness").default_value = 0.5
        input_socket(bsdf, "Anisotropic").default_value = 0.6
    elif kind == "ceramic":
        # glazed white ceramic — the quietest option on Whiteout
        input_socket(bsdf, "Base Color").default_value = (0.95, 0.96, 0.97, 1.0)
        input_socket(bsdf, "Metallic").default_value = 0.0
        input_socket(bsdf, "Roughness").default_value = 0.32
        input_socket(bsdf, "Coat Weight", "Clearcoat").default_value = 0.4
    elif kind == "titan":
        # brushed titanium with a cool cast
        input_socket(bsdf, "Base Color").default_value = (0.72, 0.76, 0.82, 1.0)
        input_socket(bsdf, "Metallic").default_value = 1.0
        input_socket(bsdf, "Roughness").default_value = 0.35
        input_socket(bsdf, "Anisotropic").default_value = 0.7
    elif kind == "glass":
        # the user's "even the ring clear" candidate (2026-08-17): the ring
        # in the cube's own material family. Risks to judge off the render:
        # vanishing at progress-indicator size, and a spin with no glints.
        input_socket(bsdf, "Base Color").default_value = (0.985, 0.99, 1.0, 1.0)
        input_socket(bsdf, "Metallic").default_value = 0.0
        input_socket(bsdf, "Roughness").default_value = 0.05
        input_socket(bsdf, "IOR").default_value = 1.45
        input_socket(bsdf, "Transmission Weight", "Transmission").default_value = 1.0
    return mat


def make_washer_ring(name, center_r, width, thick, segs=192):
    """Flat annulus with a rectangular cross-section — a coin with the
    middle drilled out (user, 2026-08-17; replaces the torus). center_r is
    the band's centreline, width its radial extent, thick its axial depth."""
    outer = center_r + width / 2
    inner = center_r - width / 2
    bm = bmesh.new()
    top_o, bot_o, top_i, bot_i = [], [], [], []
    for i in range(segs):
        a = math.tau * i / segs
        ca, sa = math.cos(a), math.sin(a)
        top_o.append(bm.verts.new((outer * ca, outer * sa, thick / 2)))
        bot_o.append(bm.verts.new((outer * ca, outer * sa, -thick / 2)))
        top_i.append(bm.verts.new((inner * ca, inner * sa, thick / 2)))
        bot_i.append(bm.verts.new((inner * ca, inner * sa, -thick / 2)))
    for i in range(segs):
        j = (i + 1) % segs
        bm.faces.new((top_o[i], top_o[j], top_i[j], top_i[i]))
        bm.faces.new((bot_i[i], bot_i[j], bot_o[j], bot_o[i]))
        bm.faces.new((top_o[i], bot_o[i], bot_o[j], top_o[j]))
        bm.faces.new((top_i[j], bot_i[j], bot_i[i], top_i[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.scene.collection.objects.link(obj)
    return obj


def build_world(kind="studio"):
    """Lighting/reflection environment; camera rays always see pure white.
    'studio' = the built-in HDRI. 'bands' = an authored abstract env — soft
    bright strips on graphite plus one ice zone, so the clear cube's internal
    reflections stop reading as recognisable light fixtures."""
    world = bpy.data.worlds.new("blockout-world")
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()

    out = nt.nodes.new("ShaderNodeOutputWorld")
    mix = nt.nodes.new("ShaderNodeMixShader")
    light_path = nt.nodes.new("ShaderNodeLightPath")
    bg_env = nt.nodes.new("ShaderNodeBackground")

    # The §6 handoff's overexposure: a named, keyframeable mix that feeds
    # white to everything the env drives — the reserved dissolve-to-white
    # move. 0 everywhere except the scrub's final frames.
    dissolve = nt.nodes.new("ShaderNodeMix")
    dissolve.data_type = "RGBA"
    dissolve.name = "dissolve"
    dissolve.inputs["Factor"].default_value = 0.0
    dissolve.inputs["B"].default_value = (1.0, 1.0, 1.0, 1.0)
    nt.links.new(dissolve.outputs["Result"], bg_env.inputs["Color"])

    if kind == "studio":
        env = nt.nodes.new("ShaderNodeTexEnvironment")
        env.image = bpy.data.images.load(str(HDRI))
        bg_env.inputs["Strength"].default_value = 0.5
        nt.links.new(env.outputs["Color"], dissolve.inputs["A"])
    else:  # bands
        coord = nt.nodes.new("ShaderNodeTexCoord")
        mapping = nt.nodes.new("ShaderNodeMapping")
        mapping.inputs["Rotation"].default_value = (0.0, 0.6, 0.4)
        grad = nt.nodes.new("ShaderNodeTexGradient")
        ramp = nt.nodes.new("ShaderNodeValToRGB")
        ramp.color_ramp.interpolation = "B_SPLINE"
        e = ramp.color_ramp.elements
        e[0].position = 0.0
        e[0].color = (0.02, 0.022, 0.025, 1.0)
        e[1].position = 1.0
        e[1].color = (0.03, 0.033, 0.038, 1.0)
        for pos, col in [(0.38, (0.02, 0.022, 0.025, 1.0)),
                         (0.45, (1.0, 1.0, 1.0, 1.0)),
                         (0.52, (0.02, 0.022, 0.025, 1.0)),
                         (0.70, (0.13, 0.20, 0.30, 1.0)),
                         (0.78, (0.03, 0.033, 0.038, 1.0)),
                         (0.86, (0.50, 0.51, 0.52, 1.0)),
                         (0.93, (0.03, 0.033, 0.038, 1.0))]:
            el = e.new(pos)
            el.color = col
        bg_env.inputs["Strength"].default_value = 2.0
        nt.links.new(coord.outputs["Generated"], mapping.inputs["Vector"])
        nt.links.new(mapping.outputs["Vector"], grad.inputs["Vector"])
        nt.links.new(grad.outputs["Fac"], ramp.inputs["Fac"])
        nt.links.new(ramp.outputs["Color"], dissolve.inputs["A"])

    bg_white = nt.nodes.new("ShaderNodeBackground")
    bg_white.inputs["Color"].default_value = (1.0, 1.0, 1.0, 1.0)

    nt.links.new(light_path.outputs["Is Camera Ray"], mix.inputs["Fac"])
    nt.links.new(bg_env.outputs["Background"], mix.inputs[1])
    nt.links.new(bg_white.outputs["Background"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])
    return world


def make_dispersion_material(spread):
    """Clear-state glass with faked dispersion: three Glass BSDFs, one per
    colour channel, IOR split by `spread`. spread 0 = the plain dark jewel."""
    mat = bpy.data.materials.new(f"clear-disp-{spread}")
    mat.use_nodes = True
    nt = mat.node_tree
    out = nt.nodes["Material Output"]
    nt.nodes.remove(nt.nodes["Principled BSDF"])
    add1 = nt.nodes.new("ShaderNodeAddShader")
    add2 = nt.nodes.new("ShaderNodeAddShader")
    for i, (col, ior) in enumerate([((1, 0, 0, 1), 1.31 - spread),
                                    ((0, 1, 0, 1), 1.31),
                                    ((0, 0, 1, 1), 1.31 + spread)]):
        g = nt.nodes.new("ShaderNodeBsdfGlass")
        g.inputs["Color"].default_value = col
        g.inputs["Roughness"].default_value = 0.03
        g.inputs["IOR"].default_value = ior
        if i < 2:
            nt.links.new(g.outputs["BSDF"], add1.inputs[i])
        else:
            nt.links.new(g.outputs["BSDF"], add2.inputs[1])
    nt.links.new(add1.outputs["Shader"], add2.inputs[0])
    nt.links.new(add2.outputs["Shader"], out.inputs["Surface"])
    return mat


def make_scrub_material(spread):
    """The §6 morph: ONE material spanning frosted -> clear, so the scrub
    can keyframe between the two decided endpoints. At clarity 0 this is
    exactly frost_variant('hybrid'); at clarity 1 the volumes are at zero
    density, the surface is 0.03-smooth, and a Mix Shader has crossfaded
    to the dispersion glass stack — make_dispersion_material's recipe.
    Returns (mat, sockets): every socket the scrub animation keyframes."""
    mat = bpy.data.materials.new("frost-scrub")
    mat.use_nodes = True
    nt = mat.node_tree
    bsdf = nt.nodes["Principled BSDF"]
    out = nt.nodes["Material Output"]

    # -- the hybrid frost branch (see frost_variant) --
    input_socket(bsdf, "Base Color").default_value = (0.985, 0.99, 1.0, 1.0)
    input_socket(bsdf, "IOR").default_value = 1.31
    input_socket(bsdf, "Transmission Weight", "Transmission").default_value = 1.0
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 7.0
    noise.inputs["Detail"].default_value = 8.0
    ramp = nt.nodes.new("ShaderNodeMapRange")
    ramp.inputs["From Min"].default_value = 0.35
    ramp.inputs["From Max"].default_value = 0.65
    ramp.inputs["To Min"].default_value = 0.15
    ramp.inputs["To Max"].default_value = 0.38
    nt.links.new(noise.outputs["Fac"], ramp.inputs["Value"])
    nt.links.new(ramp.outputs["Result"], input_socket(bsdf, "Roughness"))
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.06
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], input_socket(bsdf, "Normal"))
    scat = nt.nodes.new("ShaderNodeVolumeScatter")
    scat.inputs["Color"].default_value = (1.0, 1.0, 1.0, 1.0)
    scat.inputs["Density"].default_value = 0.7
    scat.inputs["Anisotropy"].default_value = 0.35
    absb = nt.nodes.new("ShaderNodeVolumeAbsorption")
    absb.inputs["Color"].default_value = (0.91, 0.945, 0.975, 1.0)
    absb.inputs["Density"].default_value = 0.6
    add = nt.nodes.new("ShaderNodeAddShader")
    nt.links.new(scat.outputs["Volume"], add.inputs[0])
    nt.links.new(absb.outputs["Volume"], add.inputs[1])
    nt.links.new(add.outputs["Shader"], out.inputs["Volume"])

    # -- the dispersion glass branch (see make_dispersion_material) --
    add1 = nt.nodes.new("ShaderNodeAddShader")
    add2 = nt.nodes.new("ShaderNodeAddShader")
    for i, (col, ior) in enumerate([((1, 0, 0, 1), 1.31 - spread),
                                    ((0, 1, 0, 1), 1.31),
                                    ((0, 0, 1, 1), 1.31 + spread)]):
        g = nt.nodes.new("ShaderNodeBsdfGlass")
        g.inputs["Color"].default_value = col
        g.inputs["Roughness"].default_value = 0.03
        g.inputs["IOR"].default_value = ior
        if i < 2:
            nt.links.new(g.outputs["BSDF"], add1.inputs[i])
        else:
            nt.links.new(g.outputs["BSDF"], add2.inputs[1])
    nt.links.new(add1.outputs["Shader"], add2.inputs[0])

    mix = nt.nodes.new("ShaderNodeMixShader")
    mix.inputs["Fac"].default_value = 0.0
    nt.links.new(bsdf.outputs["BSDF"], mix.inputs[1])
    nt.links.new(add2.outputs["Shader"], mix.inputs[2])
    nt.links.new(mix.outputs["Shader"], out.inputs["Surface"])

    sockets = {
        "rough_min": ramp.inputs["To Min"],
        "rough_max": ramp.inputs["To Max"],
        "bump": bump.inputs["Strength"],
        "scatter": scat.inputs["Density"],
        "absorb": absb.inputs["Density"],
        "glass_mix": mix.inputs["Fac"],
    }
    return mat, sockets


def build_scene(ratio, thick, ring_euler=None, cube_euler=None,
                interior=None, frost_roughness=0.45, frost_kind=None,
                world_kind="studio", clear_spread=None, ring_kind=None,
                scrub=False, cam_az=28, cam_el=16, lens=60):
    ring_euler = ring_euler or POSE["ring_euler"]
    cube_euler = cube_euler or POSE["cube_euler"]
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.world = build_world(world_kind)

    global SCRUB_SOCKETS
    SCRUB_SOCKETS = None
    if scrub:
        frost, SCRUB_SOCKETS = make_scrub_material(
            clear_spread if clear_spread is not None else DECIDED["clear_spread"])
    elif clear_spread is not None:
        frost = make_dispersion_material(clear_spread)
    elif frost_kind:
        frost = frost_variant(frost_kind)
    else:
        frost = make_frost_material(frost_roughness)
    metal = ring_variant(ring_kind) if ring_kind else make_ring_material()

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
        before = set(bpy.data.objects)
        build_interior(interior, cube_euler, make_air_material(), metal)
        # The interior must tumble WITH the cube in any animated render.
        # Unparented, it held still while the cube turned — invisible in
        # the idle test only because EEVEE ran an opaque proxy cube.
        bpy.context.view_layer.update()
        inv = cube.matrix_world.inverted()
        for obj in set(bpy.data.objects) - before:
            obj.parent = cube
            obj.matrix_parent_inverse = inv

    major = ratio * TUMBLE_R
    minor = thick * major  # kept as half the band's face-on width
    width = 2 * minor
    ring = make_washer_ring("ring", major, width, 0.55 * width)
    ring.rotation_euler = ring_euler
    bev = ring.modifiers.new("Bevel", "BEVEL")
    bev.width = width * 0.06
    bev.segments = 2
    ring.data.materials.append(metal)
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = ring
    ring.select_set(True)
    try:
        bpy.ops.object.shade_auto_smooth(angle=math.radians(30))
    except AttributeError:
        bpy.ops.object.shade_smooth()

    # Soft white key upper-front-right; ice rim behind-left (the object tint).
    bpy.ops.object.light_add(type="AREA", location=(2.6, -2.4, 3.0))
    key = bpy.context.active_object
    # rebalanced for the bands world: the dark env made the ice rim the
    # dominant source and turned the frost denim-blue
    key.data.energy = 130
    key.data.size = 3.0
    key.rotation_euler = (math.radians(38), 0, math.radians(45))

    bpy.ops.object.light_add(type="AREA", location=(-3.0, 3.2, 1.2))
    rim = bpy.context.active_object
    rim.data.energy = 150
    rim.data.size = 2.0
    # Desaturated ice, NOT ICE_LINEAR: a saturated colored area light floods
    # a scattering volume under a dark env (found the hard way — the frost
    # rendered denim-blue under bands until the rim was neutralised).
    rim.data.color = (0.52, 0.64, 0.78)
    rim.rotation_euler = (math.radians(72), 0, math.radians(-137))

    # Camera auto-framed off the ring so every study fills the frame alike.
    # dist scales with the lens so a tele override keeps the same framing.
    dist = 4.4 * (major + minor) * (lens / 60)
    az, el = math.radians(cam_az), math.radians(cam_el)
    cam_loc = (
        dist * math.cos(el) * math.sin(az),
        -dist * math.cos(el) * math.cos(az),
        dist * math.sin(el),
    )
    bpy.ops.object.camera_add(location=cam_loc)
    cam = bpy.context.active_object
    cam.data.lens = lens
    bpy.ops.object.empty_add(location=(0, 0, 0))
    target = bpy.context.active_object
    track = cam.constraints.new("TRACK_TO")
    track.target = target
    scene.camera = cam
    return scene


def linear_keys(insert):
    """Run `insert` (a callable doing keyframe_insert calls) with new keys
    forced LINEAR. Blender 5.x slotted actions removed Action.fcurves —
    set the new-key interpolation preference instead of editing curves."""
    prefs = bpy.context.preferences.edit
    old_interp = prefs.keyframe_new_interpolation_type
    prefs.keyframe_new_interpolation_type = "LINEAR"
    try:
        insert()
    finally:
        prefs.keyframe_new_interpolation_type = old_interp


def animate_counter_rotation(scene, frames):
    """One full cube turn about world Z over `frames`; the ring spins about
    its OWN normal, counter-direction. The ring's plane HOLDS the decided
    attitude — v1 precessed it and cycled through the rejected badge/hoop
    poses; never animate the attitude."""
    cube = bpy.data.objects["Cube"]
    ring = bpy.data.objects["ring"]

    # carrier holds the locked attitude; the ring spins local-Z inside it
    carrier = bpy.data.objects.new("ring-carrier", None)
    scene.collection.objects.link(carrier)
    carrier.rotation_euler = tuple(ring.rotation_euler)
    ring.parent = carrier
    ring.rotation_euler = (0.0, 0.0, 0.0)

    def insert():
        for obj, direction in ((cube, 1.0), (ring, -1.0)):
            obj.keyframe_insert("rotation_euler", frame=1)
            obj.rotation_euler.z += direction * math.tau
            obj.keyframe_insert("rotation_euler", frame=frames + 1)
    linear_keys(insert)


def build_idle_animation(scene, seconds=10, fps=12):
    """The hero idle v3: one full counter-rotation turn per `seconds`.
    10s/turn DECIDED (user; 40s and 20s both read too slow); the tick
    marker was removed (user) — the spin reads via the satin anisotropy
    and edge glints only."""
    frames = seconds * fps
    scene.render.fps = fps
    scene.frame_start = 1
    scene.frame_end = frames
    animate_counter_rotation(scene, frames)


# §6 scrub choreography, in frames of the 120-frame sequence. The resolve
# is staged: the milk (scatter) clears first so the interior arrives, the
# surface polish + prism fire complete at `clear`, the dark jewel dwells,
# and the env feeds white from `dissolve` to the end — the reserved
# overexposure handoff. All linear: scroll supplies the easing.
SCRUB = {
    "frames": 120,
    "hold": 8,       # full-frost opening beat
    "milk": 78,      # scatter density reaches zero
    "fire_in": 64,   # dispersion-glass crossfade begins
    "clear": 92,     # fully the dark jewel from here
    "dissolve": 108, # env -> white begins; frame 120 is blown out
}


def build_scrub_animation(scene):
    """Keyframe the frosted->clear morph over the counter-rotation. Uses
    the sockets make_scrub_material exposed (build_scene(scrub=True))."""
    frames = SCRUB["frames"]
    scene.frame_start = 1
    scene.frame_end = frames
    animate_counter_rotation(scene, frames)

    def key(sock, points):
        for frame, value in points:
            sock.default_value = value
            sock.keyframe_insert("default_value", frame=frame)

    s = SCRUB_SOCKETS
    dissolve = scene.world.node_tree.nodes["dissolve"].inputs["Factor"]

    def insert():
        key(s["rough_min"], [(SCRUB["hold"], 0.15), (SCRUB["clear"], 0.03)])
        key(s["rough_max"], [(SCRUB["hold"], 0.38), (SCRUB["clear"], 0.03)])
        key(s["bump"], [(SCRUB["hold"], 0.06), (SCRUB["clear"], 0.0)])
        key(s["scatter"], [(SCRUB["hold"], 0.7), (SCRUB["milk"], 0.0)])
        key(s["absorb"], [(SCRUB["hold"], 0.6), (SCRUB["clear"], 0.0)])
        key(s["glass_mix"], [(SCRUB["fire_in"], 0.0), (SCRUB["clear"], 1.0)])
        key(dissolve, [(SCRUB["dissolve"], 0.0), (frames, 1.0)])
    linear_keys(insert)


def setup_render(scene, samples, res):
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.use_denoising = True
    # default is 0 and renders scattering volumes black
    scene.cycles.volume_bounces = 8
    scene.render.resolution_x = res
    scene.render.resolution_y = res
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "Standard"


def render_study(name, ratio, thick, ring_euler=None, cube_euler=None,
                 interior=None, frost_roughness=0.45, frost_kind=None,
                 world_kind="studio", clear_spread=None, ring_kind=None,
                 samples=96, res=640, cam_az=28, cam_el=16, lens=60):
    scene = build_scene(ratio, thick, ring_euler, cube_euler,
                        interior, frost_roughness, frost_kind,
                        world_kind, clear_spread, ring_kind,
                        cam_az=cam_az, cam_el=cam_el, lens=lens)
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

    if "--frost" in argv:
        # Material pass, phase 1: frost candidates at the locked config.
        # Optionally name specific kinds after --frost to re-render a subset.
        all_kinds = ["base", "noise", "vol", "absorb", "hybrid"]
        kinds = [a for a in argv if a in all_kinds] or all_kinds
        for kind in kinds:
            render_study(f"f_{kind}", DECIDED["ratio"], DECIDED["thick"],
                         interior=DECIDED["interior"], frost_kind=kind)
        return

    if "--motion" in argv:
        # Motion test: the hero idle at EEVEE preview quality, real duration.
        # Timing is the question; the frost's volume look is not (EEVEE), so
        # the cube runs the plain 0.45 frost here.
        scene = build_scene(DECIDED["ratio"], DECIDED["thick"],
                            interior=DECIDED["interior"],
                            world_kind=DECIDED["world"],
                            ring_kind=DECIDED["ring"])
        # EEVEE shows rough transmission as black glass, so the cube runs a
        # white proxy here — this test judges timing, not material.
        proxy = bpy.data.materials.new("frost-motion-proxy")
        proxy.use_nodes = True
        b = proxy.node_tree.nodes["Principled BSDF"]
        input_socket(b, "Base Color").default_value = (0.92, 0.94, 0.97, 1.0)
        input_socket(b, "Roughness").default_value = 0.5
        cube = bpy.data.objects["Cube"]
        cube.data.materials.clear()
        cube.data.materials.append(proxy)
        build_idle_animation(scene)
        # resume support: "--motion 419" re-renders from that frame on
        for a in argv:
            if a.isdigit():
                scene.frame_start = int(a)
        for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
            try:
                scene.render.engine = engine
                break
            except TypeError:
                continue
        scene.render.resolution_x = 480
        scene.render.resolution_y = 480
        scene.view_settings.view_transform = "Standard"
        # Blender 5.x removed movie output — render a PNG sequence and
        # encode with ffmpeg outside (see the encode step in the tooling).
        scene.render.image_settings.file_format = "PNG"
        seq_dir = OUT_DIR / "motion"
        seq_dir.mkdir(parents=True, exist_ok=True)
        scene.render.filepath = str(seq_dir / "frame####")
        t0 = time.time()
        bpy.ops.render.render(animation=True)
        print(f"[blockout] motion idle: {scene.frame_end} frames in "
              f"{time.time() - t0:.0f}s -> {seq_dir}")
        return

    if "--idle" in argv:
        # The ambient presence, real materials this time (--motion was an
        # EEVEE timing proxy): the CLEAR object at the decided 10s/turn,
        # path-traced, for the loop a page actually plays. Frame 121 == 1,
        # so rendering 1..120 loops seamlessly. "--idle glass" swaps the
        # satin ring for the clear-family one; a digit resumes.
        scene = build_scene(DECIDED["ratio"], DECIDED["thick"],
                            interior=DECIDED["interior"],
                            world_kind=DECIDED["world"],
                            clear_spread=DECIDED["clear_spread"],
                            ring_kind="glass" if "glass" in argv else DECIDED["ring"])
        build_idle_animation(scene)
        setup_render(scene, samples=96, res=640)
        for a in argv:
            if a.isdigit():
                scene.frame_start = int(a)
        seq_dir = OUT_DIR.parent / "idle-clear"
        seq_dir.mkdir(parents=True, exist_ok=True)
        scene.render.filepath = str(seq_dir / "frame####")
        t0 = time.time()
        bpy.ops.render.render(animation=True)
        print(f"[idle] clear loop frames {scene.frame_start}-{scene.frame_end} "
              f"in {time.time() - t0:.0f}s -> {seq_dir}")
        return

    if "--glassring" in argv:
        # The clear-ring studies: the decided three-quarter pose and the
        # front badge, both all-clear, for the user's call.
        render_study("g_glass_clear", DECIDED["ratio"], DECIDED["thick"],
                     interior=DECIDED["interior"], world_kind=DECIDED["world"],
                     clear_spread=DECIDED["clear_spread"], ring_kind="glass")
        render_study("b_corner_clear_glass", DECIDED["ratio"], DECIDED["thick"],
                     ring_euler=(math.radians(90), 0.0, 0.0),
                     cube_euler=POSE["cube_euler"],
                     interior=DECIDED["interior"], world_kind=DECIDED["world"],
                     clear_spread=DECIDED["clear_spread"], ring_kind="glass",
                     cam_az=0, cam_el=0, lens=85)
        return

    if "--front" in argv:
        # The badge (user request, 2026-08-17): ring perfectly face-on and
        # centred, the cube reading inside it. This is the composition the
        # HERO pose deliberately avoids (face-on = logo read) — here the
        # logo read is the point. Camera dead-on at 85mm so the circle is a
        # circle; three cube poses x both material states for the pick.
        cube_poses = [
            ("square", (0.0, 0.0, 0.0)),
            ("diamond", (0.0, math.radians(45), 0.0)),
            ("corner", POSE["cube_euler"]),
        ]
        face_on = (math.radians(90), 0.0, 0.0)
        for pose_name, cube_euler in cube_poses:
            for state in ("frost", "clear"):
                render_study(
                    f"b_{pose_name}_{state}", DECIDED["ratio"], DECIDED["thick"],
                    ring_euler=face_on, cube_euler=cube_euler,
                    interior=DECIDED["interior"],
                    frost_kind=DECIDED["frost"] if state == "frost" else None,
                    clear_spread=DECIDED["clear_spread"] if state == "clear" else None,
                    world_kind=DECIDED["world"], ring_kind=DECIDED["ring"],
                    cam_az=0, cam_el=0, lens=85)
        return

    if "--scrub" in argv:
        # §6 delivery validation — the frosted->clear morph, scrubbed.
        #   --scrub probe        stills across the timeline at study res
        #   --scrub seq [start]  the full 120-frame sequence at 640 (resumable)
        #   --scrub sizing       every 12th frame at 1600 for the size estimate
        scene = build_scene(DECIDED["ratio"], DECIDED["thick"],
                            interior=DECIDED["interior"],
                            world_kind=DECIDED["world"],
                            clear_spread=DECIDED["clear_spread"],
                            ring_kind=DECIDED["ring"], scrub=True)
        build_scrub_animation(scene)
        if "probe" in argv:
            setup_render(scene, samples=96, res=640)
            for f in (1, 30, 60, 80, 92, 100, 112, 120):
                scene.frame_set(f)
                scene.render.filepath = str(OUT_DIR / f"s_probe_{f:03d}.png")
                t0 = time.time()
                bpy.ops.render.render(write_still=True)
                print(f"[scrub] probe frame {f}: {time.time() - t0:.0f}s")
        elif "sizing" in argv:
            setup_render(scene, samples=128, res=1600)
            seq_dir = OUT_DIR.parent / "scrub-sizing"
            seq_dir.mkdir(parents=True, exist_ok=True)
            for f in [1] + list(range(12, SCRUB["frames"] + 1, 12)):
                path = seq_dir / f"frame{f:04d}.png"
                if path.exists():  # resumable: a killed run keeps its frames
                    print(f"[scrub] sizing frame {f}: kept")
                    continue
                scene.frame_set(f)
                scene.render.filepath = str(path)
                t0 = time.time()
                bpy.ops.render.render(write_still=True)
                print(f"[scrub] sizing frame {f}: {time.time() - t0:.0f}s")
        else:  # seq
            setup_render(scene, samples=96, res=640)
            for a in argv:
                if a.isdigit():
                    scene.frame_start = int(a)
            seq_dir = OUT_DIR.parent / "scrub"
            seq_dir.mkdir(parents=True, exist_ok=True)
            scene.render.filepath = str(seq_dir / "frame####")
            t0 = time.time()
            bpy.ops.render.render(animation=True)
            print(f"[scrub] seq frames {scene.frame_start}-{scene.frame_end} "
                  f"in {time.time() - t0:.0f}s -> {seq_dir}")
        return

    if "--ring" in argv:
        # Material pass, phase 3: ring candidates in BOTH states — the ring
        # lives against the white page (frosted) and the dark jewel (clear).
        for kind in ["control", "satin", "ceramic", "titan"]:
            render_study(f"g_{kind}_frost", DECIDED["ratio"], DECIDED["thick"],
                         interior=DECIDED["interior"],
                         frost_kind=DECIDED["frost"],
                         world_kind=DECIDED["world"], ring_kind=kind)
            render_study(f"g_{kind}_clear", DECIDED["ratio"], DECIDED["thick"],
                         interior=DECIDED["interior"],
                         world_kind=DECIDED["world"],
                         clear_spread=DECIDED["clear_spread"], ring_kind=kind)
        return

    if "--check" in argv:
        # Fast both-states check under the DECIDED world, study res.
        render_study("check-frost", DECIDED["ratio"], DECIDED["thick"],
                     interior=DECIDED["interior"], frost_kind=DECIDED["frost"],
                     world_kind=DECIDED["world"], ring_kind=DECIDED["ring"])
        render_study("check-clear", DECIDED["ratio"], DECIDED["thick"],
                     interior=DECIDED["interior"], world_kind=DECIDED["world"],
                     clear_spread=DECIDED["clear_spread"],
                     ring_kind=DECIDED["ring"])
        return

    if "--jewel" in argv:
        # Material pass, phase 2: the clear state's environment (studio HDRI
        # vs authored bands) crossed with dispersion strength (d0 = control,
        # the loved dark jewel as-is).
        for env in ["studio", "bands"]:
            for tag, spread in (("d0", 0.0), ("d2", 0.02), ("d5", 0.05)):
                render_study(f"j_{env}_{tag}", DECIDED["ratio"],
                             DECIDED["thick"], interior=DECIDED["interior"],
                             world_kind=env, clear_spread=spread)
        return

    if "--hero" in argv:
        # The reference stills of the locked configuration — what sections 1
        # and 6 get laid out against until real renders exist. The clear
        # state's dark-glass look is KEPT (user, 2026-08-17): transmission
        # rays seeing the HDRI is the reveal's payoff, not an artifact.
        render_study("hero-ref", DECIDED["ratio"], DECIDED["thick"],
                     interior=DECIDED["interior"],
                     frost_kind=DECIDED["frost"],
                     world_kind=DECIDED["world"],
                     ring_kind=DECIDED["ring"], samples=256, res=1280)
        render_study("clear-ref", DECIDED["ratio"], DECIDED["thick"],
                     interior=DECIDED["interior"],
                     world_kind=DECIDED["world"],
                     clear_spread=DECIDED["clear_spread"],
                     ring_kind=DECIDED["ring"], samples=256, res=1280)
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
