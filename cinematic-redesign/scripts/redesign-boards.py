#!/usr/bin/env python3
"""Render six original 11:3 art studies using Blender and composite local type with Pillow."""
from __future__ import annotations

import argparse
import math
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WIDTH, HEIGHT = 1760, 480
NAMES = ("Obsidian Atelier", "Velvet Horizon", "Nocturne Monolith")
FONT_DIR = Path("/usr/share/fonts/opentype/noto")
CONCEPTS = ("a", "b", "c")


def object_location(obj, x, y, z):
    obj.location = (x, y, z)
    return obj


def configure_scene():
    import bpy
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    scene = bpy.context.scene
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = 24
    scene.cycles.adaptive_threshold = .025
    scene.cycles.use_denoising = False
    scene.cycles.max_bounces = 5
    scene.cycles.glossy_bounces = 3
    scene.render.threads_mode = "FIXED"
    scene.render.threads = 5
    scene.render.resolution_x = WIDTH
    scene.render.resolution_y = HEIGHT
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.view_settings.view_transform = "AgX"
    scene.world.use_nodes = True
    bg = scene.world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.10, 0.11, 0.13, 1)
    bg.inputs["Strength"].default_value = 0.045
    return scene


def material(name, color, metallic, roughness, *, brushed=False):
    import bpy
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nodes = m.node_tree.nodes
    links = m.node_tree.links
    bsdf = nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if brushed:
        tex = nodes.new("ShaderNodeTexNoise")
        tex.inputs["Scale"].default_value = 28
        tex.inputs["Detail"].default_value = 2
        warp = nodes.new("ShaderNodeVectorMath")
        warp.operation = "MULTIPLY"
        warp.inputs[1].default_value = (26, 26, .24)
        coordinates = nodes.new("ShaderNodeTexCoord")
        links.new(coordinates.outputs["Generated"], warp.inputs[0])
        links.new(warp.outputs[0], tex.inputs["Vector"])
        bump = nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = .17
        bump.inputs["Distance"].default_value = .07
        links.new(tex.outputs["Fac"], bump.inputs["Height"])
        links.new(bump.outputs["Normal"], bsdf.inputs["Normal"])
    return m


def mesh(name, vertices, faces, materials):
    import bpy
    data = bpy.data.meshes.new(name)
    data.from_pydata(vertices, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    for surf in materials:
        data.materials.append(surf)
    return obj


def smooth(obj):
    for polygon in obj.data.polygons:
        polygon.use_smooth = True


def bevel(obj, width):
    mod = obj.modifiers.new("Machined edges", "BEVEL")
    mod.width = width
    mod.segments = 3
    mod = obj.modifiers.new("Face normals", "WEIGHTED_NORMAL")
    mod.keep_sharp = True


def area(name, xyz, look, rgb, power, width, height):
    import bpy
    from mathutils import Vector
    data = bpy.data.lights.new(name, "AREA")
    data.energy = power
    data.color = rgb
    data.shape = "RECTANGLE"
    data.size = width
    data.size_y = height
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = xyz
    obj.rotation_euler = (Vector(look) - obj.location).to_track_quat("-Z", "Y").to_euler()


def stage(scene, view, aim, surface):
    import bpy
    from mathutils import Vector
    bpy.ops.mesh.primitive_plane_add(size=200)
    bpy.context.object.data.materials.append(surface)
    data = bpy.data.cameras.new("Cinema camera")
    data.type = "ORTHO"
    data.ortho_scale = 25.8
    obj = bpy.data.objects.new("Cinema camera", data)
    bpy.context.collection.objects.link(obj)
    obj.location = view
    obj.rotation_euler = (Vector(aim) - obj.location).to_track_quat("-Z", "Y").to_euler()
    scene.camera = obj


def fin(name, points, thickness, skin, facets):
    front = [(x, -thickness / 2, z) for x, z in points]
    back = [(x, thickness / 2, z) for x, z in points]
    n = len(points)
    center = (sum(x for x, _ in points) / n - .12, -thickness, sum(z for _, z in points) / n)
    faces = [tuple(reversed(range(n, 2 * n)))]
    faces.extend((i, (i + 1) % n, 2 * n) for i in range(n))
    faces.extend((i, i + n, (i + 1) % n + n, (i + 1) % n) for i in range(n))
    obj = mesh(name, front + back + [center], faces, (skin, facets))
    for i, face in enumerate(obj.data.polygons):
        face.material_index = int(i in (2, 5, 9))
    bevel(obj, .065)
    return obj


def obsidian(scene, award):
    key = (1, .58, .27) if award else (.12, .37, 1)
    atlas = material("Brushed titanium", (.15, .18, .23), .84, .27, brushed=True)
    prism = material("Smoked crystal face", (.012, .027, .08), .50, .16)
    floor = material("Piano obsidian", (.012, .017, .027), .38, .35)
    aim = (-.65 if award else -.35, .15, 2.7)
    stage(scene, (-1.5 if award else 0, -22, 5.4), aim, floor)

    for i in range(6):
        h = (5.8, 5.0, 6.14, 4.8, 5.6, 3.3)[i]
        w = (1.72, 1.86, 1.55, 1.6, 1.58, 1.9)[i]
        form = fin("Cut titanium leaf", ((-w, .04), (-w * .8, h * .62), (-.15, h),
                                         (w * .74, h * .73), (w, h * .20), (w * .61, 0)),
                   .40 + i * .077, atlas, prism)
        object_location(form, 3.2 + i * 1.26, (i - 2) * .55, .08 + i % 2 * .39)
        form.rotation_euler = (0, -.21 + i * .066 + (.07 if award else 0), (i - 2) * .12)

    area("Cinematic colored rake", (8, -4, 8.1), (5, 1, 2.8), key, 4200, 8, 2.3)
    area("Silver horizontal softbox", (5, 4.3, 5.7), (6, .1, 3.5),
         (.50, .65, 1) if not award else (1, .82, .61), 2900, 13, 1.5)
    area("Narrow front reflection", (3, -8, 4.4), (6, .8, 3), (.68, .79, 1), 850, 1.05, 7)
    area("Far blue bounce", (-1.4, 6, 1.8), (7, -1, 2.35), (.09, .29, 1), 1230, 4, .65)


def ribbon(name, index, award, surf):
    vertices = []
    faces = []
    steps = 104
    broad = .72 if award else .54
    for sample in range(steps + 1):
        u = sample / steps
        x = -14 + u * 28
        y = 2.25 - 2.5 * math.cos((u - .5) * math.tau) + index * .34
        z = .63 + index * .23 + 2.44 * abs(u - .5) ** .8
        z += .27 * math.sin(u * math.tau + index * .44)
        twist = (u - .5) * 3.1 + index * .41
        for side in (-1, 1):
            radius = side * broad * (.65 + .35 * abs(u - .5) * 2)
            vertices.append((x, y + radius * math.cos(twist), z + radius * math.sin(twist)))
        if sample:
            i = (sample - 1) * 2
            faces.append((i, i + 1, i + 3, i + 2))
    obj = mesh(name, vertices, faces, (surf,))
    smooth(obj)
    mod = obj.modifiers.new("Ribbon body", "SOLIDIFY")
    mod.thickness = .065
    bevel(obj, .04)
    return obj


def velvet(scene, award):
    floor = material("Espresso lacquer", (.028, .016, .012), .25, .28)
    patina = material("Warmed bronze", (.33, .12, .08), .81, .35, brushed=True)
    highlight = material("Champagne ribbon", (.58, .28, .12), .83, .28, brushed=True)
    muted = material("Warm graphite", (.13, .069, .055), .65, .37)
    stage(scene, (0, -21, 5.05), (0, 0, 3.26), floor)
    for i, surf in enumerate((patina, muted, highlight, patina, highlight, muted, patina)):
        ribbon("Suspended bronze fabric", i, award, surf)
    area("Silk canopy", (-1, 1.4, 7.2), (0, 0, 1.6), (1, .72, .50), 2800, 16, 3.8)
    area("Amber grazing light", (-10, 3, 5), (2, 1, 2), (1, .33, .16), 2650, 12, 2.5)
    area("Cool lavender fill", (8, -7, 6), (3, .2, 1), (.54, .60, .91), 470, 10, 2)
    area("Ribbon rim", (11, 7, 2.4), (2, 0, 1), (1, .65, .49), 1400, 5, 2)


def torus(location, radius, section, scale, rotation, surf):
    import bpy
    bpy.ops.mesh.primitive_torus_add(
        align="WORLD", major_segments=96, minor_segments=24, location=location,
        major_radius=radius, minor_radius=section, rotation=rotation,
    )
    obj = bpy.context.object
    obj.scale = scale
    obj.data.materials.append(surf)
    smooth(obj)


def nocturne(scene, award):
    import bpy
    floor = material("Charcoal-violet stone", (.018, .018, .029), .14, .54)
    moon = material("Pearl stone", (.20, .19, .30), .26, .31)
    silver = material("Satin silver", (.34, .38, .47), .78, .30, brushed=True)
    stage(scene, (.85 if award else 0, -22, 4.7), (0, 0, 3.0), floor)
    torus((-6.2, .5, 3.0), 2.43, .48, (1.16, 1, 1),
          (1.38, -.34 if award else .22, -.25), moon)
    torus((-6.55, -.36, 3.02), 2.48, .036, (1.10, 1, 1),
          (1.45, .20, -.21), silver)
    for x, y, z, size in [(-7.2, -.04, 2.79, .76), (-3.33, 1.80, 4.42, .38),
                          (-9.98, -.15, 1.29, .49), (-5.5, 1.1, 5.2, .20)]:
        bpy.ops.mesh.primitive_uv_sphere_add(segments=48, ring_count=24,
                                            radius=size, location=(x, y, z))
        obj = bpy.context.object
        obj.data.materials.append(silver if size < .5 else moon)
        smooth(obj)
    area("Lavender window", (-7.7, -5, 8.5), (-6, 1, 3), (.55, .58, 1), 2100, 7, 5)
    area("Violet stone rim", (-6, 5, 6), (-6, 0, 3), (.54, .32, 1), 2350, 5, 2)
    area("White highlights", (-2.6, -3, 1.6), (-7, 0, 3),
         (.92, .92, 1), 325, 1.3, 5)


def run_blender(raw):
    import bpy
    for index, key in enumerate(CONCEPTS):
        setup = (obsidian, velvet, nocturne)[index]
        for award in (False, True):
            scene = configure_scene()
            setup(scene, award)
            basename = f"{key}-{'award' if award else 'title'}"
            scene.render.filepath = str(raw / f"{basename}.png")
            bpy.ops.render.render(write_still=True)
            print(f"Rendered procedural stage {basename}", flush=True)


def compose(raw, output):
    from PIL import Image, ImageDraw, ImageFilter, ImageFont

    def font(size, *, bold=False, serif=False):
        family = "Serif" if serif else "Sans"
        weight = "Bold" if bold else "Regular"
        path = FONT_DIR / f"Noto{family}CJK-{weight}.ttc"
        return ImageFont.truetype(str(path), size=size, index=1)

    def spaced(draw, xy, words, size, spacing, color, *, center=False, serif=False):
        face = font(size, bold=not serif, serif=serif)
        width = sum(face.getlength(letter) for letter in words) + (len(words) - 1) * spacing
        x, y = xy
        if center:
            x -= width / 2
        for letter in words:
            draw.text((x, y), letter, font=face, anchor="ls", fill=color)
            x += face.getlength(letter) + spacing

    contact = Image.new("RGB", (1816, 882), "#121315")
    for index, key in enumerate(CONCEPTS):
        for award in (False, True):
            descriptor = f"{key}-{'award' if award else 'title'}"
            with Image.open(raw / f"{descriptor}.png") as background:
                luma, blue, red = background.convert("YCbCr").split()
                luma = Image.blend(luma, luma.filter(ImageFilter.MedianFilter(3)), .63)
                image = Image.merge("YCbCr", (
                    luma, blue.filter(ImageFilter.GaussianBlur(.78)),
                    red.filter(ImageFilter.GaussianBlur(.78)),
                )).convert("RGB")
            draw = ImageDraw.Draw(image)
            white = ("#f0f2ed", "#f5ebe0", "#eae8f2")[index]
            secondary = ("#a5b6ca", "#c9a88d", "#b9b5cb")[index]
            gold = ("#f1d39b", "#ecc49a", "#ded3e9")[index]
            serif = key == "b"
            x, y, title_y, note_y = ((191, 159, 268, 330), (880, 105, 217, 271),
                                      (942, 170, 279, 341))[index]
            centered = key == "b"
            text_anchor = "ms" if centered else "ls"
            rule = 50 if centered else 64
            left = x - rule / 2 if centered else x
            draw.line((left, y - 27, left + rule, y - 27), fill=gold if award else secondary, width=2)
            if award:
                draw.text((x, y + 15), "대상    /    GRAND PRIZE", font=font(26, bold=True),
                          anchor=text_anchor, fill=gold)
                draw.text((x, title_y), "[대상 수상자 이름]",
                          font=font(72 if key == "a" else 63, bold=True, serif=serif),
                          anchor=text_anchor, fill=white)
                draw.text((x, note_y), "[수상 분야 / 소속]", font=font(24, serif=serif),
                          anchor=text_anchor, fill=secondary)
            else:
                draw.text((x, y + 15), "2026 기술·혁신",
                          font=font(40 if key == "a" else 35, bold=True, serif=serif),
                          anchor=text_anchor, fill=white)
                title_size = {"a": 90, "b": 78, "c": 82}[key]
                spaced(draw, (x, title_y), "FESTIVAL", title_size,
                       4 if key == "a" else 7, white, center=centered, serif=serif)
                draw.text((x, note_y), "기술의 도전, 혁신의 성과", font=font(27, serif=serif),
                          anchor=text_anchor, fill=secondary)
            image.save(output / f"concept-{descriptor}.jpg", quality=95, subsampling=0)
            contact.paste(image.resize((880, 240), Image.Resampling.LANCZOS),
                          (18 + 900 * award, 40 + 289 * index))
        contact_draw = ImageDraw.Draw(contact)
        contact_draw.text((18, 7 + 289 * index), f"{key.upper()}   {NAMES[index]}",
                          font=font(20, bold=True), fill="#f2f1ea")
        contact_draw.text((918, 7 + 289 * index), "대상 디자인 연구  /  조건부",
                          font=font(17), fill="#c2c6cc")
    contact.save(output / "concept-contact.jpg", quality=93, subsampling=0)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", type=Path, default=ROOT / "out/redesign")
    output = parser.parse_args().out.resolve()
    output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="festival-redesign-") as directory:
        subprocess.run(
            ["blender", "-b", "--factory-startup", "--python-exit-code", "1",
             "--python", str(Path(__file__).resolve()),
             "--", "--blender", directory],
            check=True,
        )
        compose(Path(directory), output)
    print(f"Art studies generated in {output}")


if __name__ == "__main__":
    if "--blender" in sys.argv:
        run_blender(Path(sys.argv[sys.argv.index("--blender") + 1]))
    else:
        main()
