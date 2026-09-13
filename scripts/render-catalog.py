#!/usr/bin/env python3
"""
Barq Lumi — original studio catalog plates.

Renders specification-style product images we own:
dark charcoal studio, 3/4 aluminum extrusions, milky diffusers,
wall-washer bars with lens cells, strip-on-reel and strip-in-channel closeups.

Not manufacturer packshots. Not lifestyle interiors.
"""

from __future__ import annotations

import math
import os
import random
from dataclasses import dataclass, field
from typing import Callable, Iterable

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "public", "products", "catalog")

# Render 2× then downscale for edge quality
RW, RH = 2400, 1800
OW, OH = 1200, 900

FONT_PATH = "/usr/share/fonts/truetype/sand-box/google/Lato/Lato-Regular.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/sand-box/google/Lato/Lato-Bold.ttf"

# --- colour systems ---------------------------------------------------------

GLOW = {
    "warm": (255, 176, 88),
    "hospitality": (255, 198, 118),
    "neutral": (236, 226, 196),
    "cool": (196, 220, 255),
    "amber": (255, 158, 64),
    "blue": (96, 168, 255),
    "green": (132, 214, 164),
    "soft": (244, 214, 168),
    "white": (248, 246, 236),
}

METAL = {
    "silver": {
        "base": (172, 178, 184),
        "dark": (78, 84, 90),
        "hi": (232, 236, 240),
        "edge": (210, 214, 218),
    },
    "black": {
        "base": (36, 36, 40),
        "dark": (14, 14, 16),
        "hi": (88, 90, 96),
        "edge": (64, 66, 72),
    },
    "white": {
        "base": (226, 224, 218),
        "dark": (158, 156, 150),
        "hi": (250, 249, 246),
        "edge": (238, 236, 230),
    },
    "ss": {
        "base": (154, 158, 164),
        "dark": (70, 74, 80),
        "hi": (220, 224, 228),
        "edge": (196, 200, 206),
    },
}

RGB_CELLS = [
    (255, 72, 72),
    (255, 140, 48),
    (255, 214, 64),
    (72, 220, 96),
    (64, 176, 255),
    (120, 96, 255),
    (220, 80, 200),
    (248, 244, 236),
]


# --- math -------------------------------------------------------------------

@dataclass
class V:
    x: float
    y: float
    z: float

    def __add__(self, o: "V") -> "V":
        return V(self.x + o.x, self.y + o.y, self.z + o.z)

    def __sub__(self, o: "V") -> "V":
        return V(self.x - o.x, self.y - o.y, self.z - o.z)

    def __mul__(self, s: float) -> "V":
        return V(self.x * s, self.y * s, self.z * s)

    __rmul__ = __mul__

    def dot(self, o: "V") -> float:
        return self.x * o.x + self.y * o.y + self.z * o.z

    def cross(self, o: "V") -> "V":
        return V(
            self.y * o.z - self.z * o.y,
            self.z * o.x - self.x * o.z,
            self.x * o.y - self.y * o.x,
        )

    def length(self) -> float:
        return math.sqrt(self.dot(self))

    def norm(self) -> "V":
        l = self.length() or 1.0
        return V(self.x / l, self.y / l, self.z / l)

    def lerp(self, o: "V", t: float) -> "V":
        return self + (o - self) * t


def clamp(v: float, a: float = 0.0, b: float = 1.0) -> float:
    return a if v < a else b if v > b else v


def mix(a: tuple[int, int, int], b: tuple[int, int, int], t: float) -> tuple[int, int, int]:
    t = clamp(t)
    return (
        int(a[0] + (b[0] - a[0]) * t),
        int(a[1] + (b[1] - a[1]) * t),
        int(a[2] + (b[2] - a[2]) * t),
    )


def scale_rgb(c: tuple[int, int, int], s: float) -> tuple[int, int, int]:
    return (
        int(clamp(c[0] * s, 0, 255)),
        int(clamp(c[1] * s, 0, 255)),
        int(clamp(c[2] * s, 0, 255)),
    )


def add_rgb(a: tuple[int, int, int], b: tuple[int, int, int], k: float = 1.0) -> tuple[int, int, int]:
    return (
        int(clamp(a[0] + b[0] * k, 0, 255)),
        int(clamp(a[1] + b[1] * k, 0, 255)),
        int(clamp(a[2] + b[2] * k, 0, 255)),
    )


# --- camera -----------------------------------------------------------------

@dataclass
class Camera:
    eye: V
    look: V
    up: V = field(default_factory=lambda: V(0, 0, 1))
    fov: float = 32.0
    w: int = RW
    h: int = RH

    def __post_init__(self) -> None:
        self.fwd = (self.look - self.eye).norm()
        self.right = self.fwd.cross(self.up).norm()
        self.upv = self.right.cross(self.fwd).norm()
        self.fl = (self.h * 0.5) / math.tan(math.radians(self.fov) * 0.5)

    def project(self, p: V) -> tuple[float, float, float]:
        rel = p - self.eye
        z = rel.dot(self.fwd)
        if z < 0.4:
            z = 0.4
        x = rel.dot(self.right)
        y = rel.dot(self.upv)
        sx = self.w * 0.5 + x * self.fl / z
        sy = self.h * 0.5 - y * self.fl / z
        return sx, sy, z


# --- scene ------------------------------------------------------------------

@dataclass
class Face:
    verts: list[V]
    rgb: tuple[int, int, int]
    kind: str = "metal"  # metal | glow | pcb | dark | plastic
    glow: tuple[int, int, int] | None = None
    emit: float = 0.0


@dataclass
class Sprite:
    pos: V
    kind: str  # lens | smd | gasket
    radius: float
    color: tuple[int, int, int]
    ring: tuple[int, int, int] | None = None


@dataclass
class Scene:
    faces: list[Face] = field(default_factory=list)
    sprites: list[Sprite] = field(default_factory=list)
    light: V = field(default_factory=lambda: V(-0.45, -0.55, 0.7).norm())
    fill: V = field(default_factory=lambda: V(0.55, 0.2, 0.35).norm())
    glow_bleed: tuple[int, int, int] = (255, 190, 110)
    metal: dict = field(default_factory=lambda: METAL["silver"])


Xform = Callable[[V], V]


def identity(p: V) -> V:
    return p


def compose(a: Xform, b: Xform) -> Xform:
    return lambda p: a(b(p))


def T(dx: float, dy: float, dz: float) -> Xform:
    return lambda p: V(p.x + dx, p.y + dy, p.z + dz)


def Rz(angle: float, pivot: V = V(0, 0, 0)) -> Xform:
    c, s = math.cos(angle), math.sin(angle)

    def f(p: V) -> V:
        q = p - pivot
        return V(pivot.x + q.x * c - q.y * s, pivot.y + q.x * s + q.y * c, p.z)

    return f


def Ry(angle: float, pivot: V = V(0, 0, 0)) -> Xform:
    c, s = math.cos(angle), math.sin(angle)

    def f(p: V) -> V:
        q = p - pivot
        return V(pivot.x + q.x * c + q.z * s, p.y, pivot.z - q.x * s + q.z * c)

    return f


def Rx(angle: float, pivot: V = V(0, 0, 0)) -> Xform:
    c, s = math.cos(angle), math.sin(angle)

    def f(p: V) -> V:
        q = p - pivot
        return V(p.x, pivot.y + q.y * c - q.z * s, pivot.z + q.y * s + q.z * c)

    return f


def add_box(
    sc: Scene,
    x: float,
    y: float,
    z: float,
    dx: float,
    dy: float,
    dz: float,
    kind: str = "metal",
    glow: tuple[int, int, int] | None = None,
    emit: float = 0.0,
    xf: Xform = identity,
    rgb: tuple[int, int, int] | None = None,
) -> None:
    p000 = xf(V(x, y, z))
    p100 = xf(V(x + dx, y, z))
    p010 = xf(V(x, y + dy, z))
    p110 = xf(V(x + dx, y + dy, z))
    p001 = xf(V(x, y, z + dz))
    p101 = xf(V(x + dx, y, z + dz))
    p011 = xf(V(x, y + dy, z + dz))
    p111 = xf(V(x + dx, y + dy, z + dz))
    quads = [
        [p001, p101, p111, p011],  # top
        [p000, p010, p110, p100],  # bottom
        [p000, p100, p101, p001],  # front (y min)
        [p010, p011, p111, p110],  # back (y max)
        [p000, p001, p011, p010],  # left
        [p100, p110, p111, p101],  # right
    ]
    base = rgb or (128, 128, 128)
    for q in quads:
        sc.faces.append(Face(q, base, kind=kind, glow=glow, emit=emit))


def shade_face(face: Face, sc: Scene, cam: Camera) -> tuple[int, int, int]:
    a, b, c = face.verts[0], face.verts[1], face.verts[2]
    n = (b - a).cross(c - a).norm()
    # flip if facing away from camera
    center = V(
        sum(v.x for v in face.verts) / len(face.verts),
        sum(v.y for v in face.verts) / len(face.verts),
        sum(v.z for v in face.verts) / len(face.verts),
    )
    view = (cam.eye - center).norm()
    if n.dot(view) < 0:
        n = n * -1

    ndotl = max(0.0, n.dot(sc.light))
    ndotf = max(0.0, n.dot(sc.fill))
    rim = (1.0 - abs(n.dot(view))) ** 2
    half = (sc.light + view).norm()
    spec = max(0.0, n.dot(half)) ** 28

    if face.kind == "diffuser":
        g = face.glow or GLOW["warm"]
        milky = mix((228, 224, 214), g, 0.35)
        t = 0.40 + 0.35 * ndotl + 0.15 * rim
        col = mix(scale_rgb(milky, 0.75), mix(g, (255, 252, 240), 0.4), t)
        return col

    if face.kind == "glow":
        g = face.glow or GLOW["warm"]
        t = 0.50 + 0.40 * ndotl
        col = mix(scale_rgb(g, 0.7), (255, 252, 240), 0.25 + 0.25 * t)
        return col

    if face.kind == "pcb":
        base = (36, 92, 48)
        return mix(base, (20, 50, 28), 1 - ndotl)

    if face.kind == "dark":
        return scale_rgb((22, 22, 24), 0.55 + 0.7 * ndotl)

    if face.kind == "plastic":
        base = face.rgb if face.rgb != (128, 128, 128) else (28, 28, 30)
        return mix(scale_rgb(base, 0.45 + 0.7 * ndotl), (80, 80, 84), spec * 0.4)

    m = sc.metal
    amb = 0.22
    diff = amb + 0.62 * ndotl + 0.22 * ndotf
    col = mix(m["dark"], m["base"], clamp(diff))
    col = mix(col, m["hi"], spec * 0.85 + rim * 0.18)
    # glow bounce on upward / inward faces
    if n.z > 0.25 or ndotl > 0.5:
        col = mix(col, sc.glow_bleed, 0.06 + 0.08 * max(0, n.z))
    return col


def face_depth(face: Face, cam: Camera) -> float:
    return sum(cam.project(v)[2] for v in face.verts) / len(face.verts)


def draw_poly(draw: ImageDraw.ImageDraw, pts: list[tuple[float, float]], fill: tuple[int, int, int], edge: tuple[int, int, int] | None) -> None:
    ip = [(int(p[0]), int(p[1])) for p in pts]
    if len(ip) < 3:
        return
    draw.polygon(ip, fill=fill)
    if edge:
        draw.line(ip + [ip[0]], fill=edge, width=2)


def rasterize(sc: Scene, cam: Camera) -> tuple[Image.Image, Image.Image, list[tuple[float, float]]]:
    """Returns (rgb, glow, projected_centers for shadow)."""
    img = Image.new("RGB", (RW, RH), (0, 0, 0))
    glow = Image.new("RGB", (RW, RH), (0, 0, 0))
    d = ImageDraw.Draw(img)
    g = ImageDraw.Draw(glow)

    faces = sorted(sc.faces, key=lambda f: -face_depth(f, cam))
    shadow_pts: list[tuple[float, float]] = []

    for face in faces:
        proj = [cam.project(v) for v in face.verts]
        pts = [(p[0], p[1]) for p in proj]
        # skip degenerate
        area = 0.0
        for i in range(len(pts)):
            x1, y1 = pts[i]
            x2, y2 = pts[(i + 1) % len(pts)]
            area += x1 * y2 - x2 * y1
        if abs(area) < 8:
            continue

        col = shade_face(face, sc, cam)
        edge = None
        if face.kind == "metal":
            edge = mix(col, sc.metal["edge"], 0.45)
        elif face.kind == "glow":
            edge = mix(col, (255, 255, 250), 0.35)
        draw_poly(d, pts, col, edge)

        if face.kind == "glow" and face.glow:
            draw_poly(g, pts, scale_rgb(face.glow, 1.15), None)
            # inner hot line
            if len(pts) >= 4:
                mid_a = ((pts[0][0] + pts[1][0]) / 2, (pts[0][1] + pts[1][1]) / 2)
                mid_b = ((pts[2][0] + pts[3][0]) / 2, (pts[2][1] + pts[3][1]) / 2)
                g.line([mid_a, mid_b], fill=scale_rgb(face.glow, 1.4), width=6)

        cx = sum(p[0] for p in pts) / len(pts)
        cy = sum(p[1] for p in pts) / len(pts)
        shadow_pts.append((cx, cy))

    # sprites (lenses, SMD chips) — sorted far to near
    sprites = sorted(sc.sprites, key=lambda s: -cam.project(s.pos)[2])
    for sp in sprites:
        sx, sy, z = cam.project(sp.pos)
        # perspective scale from a unit offset
        rx = abs(cam.project(sp.pos + V(sp.radius, 0, 0))[0] - sx)
        ry = abs(cam.project(sp.pos + V(0, 0, sp.radius))[1] - sy)
        rx = max(2.0, rx)
        ry = max(2.0, ry)
        bbox = [sx - rx, sy - ry, sx + rx, sy + ry]
        if sp.kind == "lens":
            # metal ring
            ring = sp.ring or sc.metal["dark"]
            d.ellipse(bbox, fill=ring)
            inner = [sx - rx * 0.72, sy - ry * 0.72, sx + rx * 0.72, sy + ry * 0.72]
            core = [sx - rx * 0.32, sy - ry * 0.32, sx + rx * 0.32, sy + ry * 0.32]
            d.ellipse(inner, fill=mix(sp.color, (255, 255, 250), 0.25))
            d.ellipse(core, fill=mix(sp.color, (255, 255, 255), 0.55))
            g.ellipse([sx - rx * 1.6, sy - ry * 1.6, sx + rx * 1.6, sy + ry * 1.6], fill=sp.color)
            g.ellipse(inner, fill=scale_rgb(sp.color, 1.3))
        elif sp.kind == "smd":
            box = [sx - rx, sy - ry * 0.55, sx + rx, sy + ry * 0.55]
            d.rectangle(box, fill=(18, 18, 20))
            chip = [sx - rx * 0.7, sy - ry * 0.35, sx + rx * 0.7, sy + ry * 0.35]
            d.rectangle(chip, fill=mix(sp.color, (40, 40, 42), 0.15))
            d.ellipse([sx - rx * 0.28, sy - ry * 0.22, sx + rx * 0.28, sy + ry * 0.22], fill=mix(sp.color, (255, 255, 240), 0.4))
            g.ellipse([sx - rx * 1.1, sy - ry * 0.9, sx + rx * 1.1, sy + ry * 0.9], fill=sp.color)
        elif sp.kind == "gasket":
            d.ellipse(bbox, fill=(20, 20, 22))

    return img, glow, shadow_pts


def studio_bg() -> Image.Image:
    arr = np.zeros((RH, RW, 3), dtype=np.float32)
    yy, xx = np.mgrid[0:RH, 0:RW]
    # charcoal studio #111 with a soft key from upper-left
    base = np.array([0x11, 0x11, 0x11], dtype=np.float32)
    arr[:, :] = base
    key = np.exp(-((xx - RW * 0.32) ** 2) / (2 * (RW * 0.38) ** 2) - ((yy - RH * 0.28) ** 2) / (2 * (RH * 0.32) ** 2))
    arr += key[:, :, None] * np.array([18, 18, 20])
    floor = np.clip((yy - RH * 0.62) / (RH * 0.38), 0, 1)
    arr += floor[:, :, None] * np.array([6, 6, 7])
    # vignette
    vr = np.sqrt(((xx - RW * 0.5) / (RW * 0.72)) ** 2 + ((yy - RH * 0.48) / (RH * 0.72)) ** 2)
    arr *= (1.0 - np.clip(vr - 0.55, 0, 1) * 0.35)[:, :, None]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def contact_shadow(shadow_pts: list[tuple[float, float]]) -> Image.Image:
    layer = Image.new("L", (RW, RH), 0)
    if not shadow_pts:
        return layer
    xs = [p[0] for p in shadow_pts]
    ys = [p[1] for p in shadow_pts]
    cx, cy = sum(xs) / len(xs), sum(ys) / len(ys) + RH * 0.06
    rx = max(180, (max(xs) - min(xs)) * 0.55)
    ry = max(50, rx * 0.18)
    d = ImageDraw.Draw(layer)
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=200)
    layer = layer.filter(ImageFilter.GaussianBlur(48))
    return layer


def composite(sc: Scene, cam: Camera) -> Image.Image:
    product, glow, pts = rasterize(sc, cam)
    bg = studio_bg()
    sh = contact_shadow(pts)

    bg_a = np.array(bg, dtype=np.float32)
    sh_a = np.array(sh, dtype=np.float32) / 255.0
    bg_a *= (1.0 - sh_a * 0.55)[:, :, None]

    prod = np.array(product, dtype=np.float32)
    # product is on black — lift non-black onto studio
    mask = (prod.max(axis=2) > 6).astype(np.float32)
    # slight dilate via blur for AA
    mask_img = Image.fromarray((mask * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.8))
    mask = np.array(mask_img, dtype=np.float32) / 255.0
    out = bg_a * (1 - mask[:, :, None]) + prod * mask[:, :, None]

    # multi-scale bloom — keep the product readable
    g0 = np.array(glow, dtype=np.float32)
    for radius, k in ((6, 0.28), (16, 0.16), (36, 0.08), (70, 0.04)):
        blurred = np.array(glow.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32)
        out = np.clip(out + blurred * k, 0, 255)
    out = np.clip(out + g0 * 0.12, 0, 255)

    # grain
    rng = np.random.default_rng(7)
    grain = rng.normal(0, 2.4, out.shape).astype(np.float32)
    out = np.clip(out + grain, 0, 255)

    im = Image.fromarray(out.astype(np.uint8), "RGB")
    return im


def watermark(im: Image.Image) -> Image.Image:
    im = im.resize((OW, OH), Image.Resampling.LANCZOS)
    d = ImageDraw.Draw(im)
    try:
        font = ImageFont.truetype(FONT_PATH, 20)
    except OSError:
        font = ImageFont.load_default()
    text = "Barq Lumi  -  specification image"
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (OW - tw) // 2
    y = OH - 42
    d.text((x + 1, y + 1), text, font=font, fill=(0, 0, 0))
    d.text((x, y), text, font=font, fill=(150, 144, 132))
    return im


def save_plate(im: Image.Image, name: str) -> str:
    os.makedirs(OUT_DIR, exist_ok=True)
    jpg = os.path.join(OUT_DIR, f"{name}.jpg")
    webp = os.path.join(OUT_DIR, f"{name}.webp")
    im = watermark(im)
    im.save(jpg, "JPEG", quality=92, optimize=True, progressive=True)
    im.save(webp, "WEBP", quality=88, method=4)
    return jpg


# --- product builders -------------------------------------------------------

def auto_camera(sc: Scene, yaw: float = 50, pitch: float = 24, fov: float = 26, fill: float = 0.52) -> Camera:
    """Frame the whole scene in a catalog 3/4 studio shot."""
    xs = [v.x for f in sc.faces for v in f.verts]
    ys = [v.y for f in sc.faces for v in f.verts]
    zs = [v.z for f in sc.faces for v in f.verts]
    if sc.sprites:
        xs += [s.pos.x for s in sc.sprites]
        ys += [s.pos.y for s in sc.sprites]
        zs += [s.pos.z for s in sc.sprites]
    minp = V(min(xs), min(ys), min(zs))
    maxp = V(max(xs), max(ys), max(zs))
    center = (minp + maxp) * 0.5
    extent = max((maxp.x - minp.x), (maxp.y - minp.y), (maxp.z - minp.z), 10.0)
    dist = (extent * 0.5) / math.tan(math.radians(fov * 0.5)) / max(fill, 0.2)
    yaw_r, pitch_r = math.radians(yaw), math.radians(pitch)
    eye = center + V(
        dist * math.cos(pitch_r) * math.sin(yaw_r),
        -dist * math.cos(pitch_r) * math.cos(yaw_r),
        dist * math.sin(pitch_r),
    )
    return Camera(eye=eye, look=center, fov=fov)


def cam_bar(length: float, yaw: float = 0.52, lift: float = 0.42, dist: float = 1.15, fov: float = 30.0) -> Camera:
    """Legacy helper — builders still return a camera; render_3d reframes."""
    cx, cy, cz = length * 0.38, 8.0, 6.0
    eye = V(
        cx - length * 0.22 * math.cos(yaw) - dist * length * 0.15,
        cy - dist * length * 0.55,
        cz + lift * length * 0.28,
    )
    return Camera(eye=eye, look=V(cx, cy, cz), fov=fov)


def add_u_channel(
    sc: Scene,
    length: float,
    width: float,
    height: float,
    wall: float,
    glow: tuple[int, int, int],
    xf: Xform = identity,
    diffuser_h: float | None = None,
    open_cut: bool = True,
    pcb: bool = True,
    flush: bool = False,
) -> None:
    dh = diffuser_h if diffuser_h is not None else max(2.2, height * 0.22)
    # bottom
    add_box(sc, 0, 0, 0, length, width, wall, "metal", xf=xf)
    # left / right walls
    add_box(sc, 0, 0, wall, length, wall, height - wall, "metal", xf=xf)
    add_box(sc, 0, width - wall, wall, length, wall, height - wall, "metal", xf=xf)
    # inner floor (darker cavity)
    add_box(sc, 0, wall, wall, length, width - 2 * wall, 0.4, "dark", xf=xf)
    if pcb:
        add_box(sc, 0.4, wall + 0.4, wall + 0.35, length - 0.8, width - 2 * wall - 0.8, 0.7, "pcb", xf=xf)
        # COB line
        add_box(
            sc,
            0.4,
            width * 0.5 - 0.7,
            wall + 1.0,
            length - 0.8,
            1.4,
            0.45,
            "glow",
            glow=glow,
            emit=1.0,
            xf=xf,
        )
    z_diff = height - dh if flush else height - dh * 0.85
    add_box(sc, 0, wall * 0.55, z_diff, length, width - wall * 1.1, dh, "diffuser", glow=glow, emit=0.4, xf=xf)
    # hot line inside the diffuser (feeds bloom)
    add_box(
        sc,
        0.6,
        width * 0.5 - 1.0,
        z_diff + dh * 0.15,
        length - 1.2,
        2.0,
        dh * 0.45,
        "glow",
        glow=glow,
        emit=1.0,
        xf=xf,
    )
    # metal lip at +X cut so wall thickness reads toward camera
    if open_cut:
        add_box(sc, length, 0, 0, 0.45, width, wall, "metal", xf=xf)
        add_box(sc, length, 0, 0, 0.45, wall, height, "metal", xf=xf)
        add_box(sc, length, width - wall, 0, 0.45, wall, height, "metal", xf=xf)


def add_flanges(sc: Scene, length: float, width: float, height: float, wall: float, flange: float, xf: Xform = identity) -> None:
    add_box(sc, 0, -flange, height - wall, length, flange + wall, wall, "metal", xf=xf)
    add_box(sc, 0, width - wall, height - wall, length, flange + wall, wall, "metal", xf=xf)


def add_end_cap(sc: Scene, x: float, width: float, height: float, xf: Xform = identity) -> None:
    add_box(sc, x, -0.3, -0.3, 1.2, width + 0.6, height + 0.6, "metal", xf=xf)


def build_surface_u(
    finish: str,
    glow_key: str,
    length: float = 86,
    width: float = 18,
    height: float = 12,
    wall: float = 1.6,
) -> tuple[Scene, Camera]:
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    add_u_channel(sc, length, width, height, wall, GLOW[glow_key])
    add_end_cap(sc, -1.4, width, height)
    cam = cam_bar(length)
    return sc, cam


def build_flanged(finish: str, glow_key: str) -> tuple[Scene, Camera]:
    L, W, H, t, f = 90, 20, 14, 1.6, 8
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    add_u_channel(sc, L, W, H, t, GLOW[glow_key])
    add_flanges(sc, L, W, H, t, f)
    add_end_cap(sc, -1.4, W, H)
    return sc, cam_bar(L, yaw=0.48, lift=0.5)


def build_trimless(finish: str, glow_key: str) -> tuple[Scene, Camera]:
    L, W, H, t = 92, 22, 18, 1.5
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    add_u_channel(sc, L, W, H, t, GLOW[glow_key], flush=True)
    # plaster wings lower than the slot
    add_box(sc, 0, -10, H * 0.42, L, 10, 1.2, "metal")
    add_box(sc, 0, W, H * 0.42, L, 10, 1.2, "metal")
    add_end_cap(sc, -1.4, W, H)
    return sc, cam_bar(L, yaw=0.5, lift=0.46)


def build_wide(finish: str, glow_key: str, channels: int = 2) -> tuple[Scene, Camera]:
    L = 88
    ch_w, gap, t, H = 16, 3.2, 1.5, 14
    W = channels * ch_w + (channels + 1) * t + (channels - 1) * gap
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    add_box(sc, 0, 0, 0, L, W, t, "metal")
    add_box(sc, 0, 0, t, L, t, H - t, "metal")
    add_box(sc, 0, W - t, t, L, t, H - t, "metal")
    x = t
    for i in range(channels):
        add_box(sc, 0, x - 0.2, t, L, 0.8, H - t - 2.4, "metal")
        add_u_channel(sc, L, ch_w, H, t, GLOW[glow_key], xf=T(0, x - t, 0), pcb=True)
        x += ch_w + gap + t
    add_end_cap(sc, -1.4, W, H)
    return sc, cam_bar(L, yaw=0.5, lift=0.4, dist=1.25)


def build_corner(finish: str, glow_key: str, external: bool = False) -> tuple[Scene, Camera]:
    L, S, t = 84, 22, 1.6
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    g = GLOW[glow_key]
    if not external:
        # internal 90° — walls on Y=0 (back) and Z=0 (bottom), diffuser on 45°
        add_box(sc, 0, 0, 0, L, S, t, "metal")
        add_box(sc, 0, 0, 0, L, t, S, "metal")
        # 45° diffuser as a thin box rotated
        xf = compose(T(0, t * 0.6, t * 0.6), Rx(math.radians(45), V(0, 0, 0)))
        add_box(sc, 0, 0, 0, L, S * 1.15, 3.2, "glow", glow=g, emit=1, xf=xf)
        add_box(sc, 0, S * 0.35, t, L, 1.2, 0.5, "pcb")
    else:
        # external wrap — two walls meeting, diffuser on the outside 45
        add_box(sc, 0, 0, 0, L, t, S, "metal")
        add_box(sc, 0, 0, 0, L, S, t, "metal")
        xf = compose(T(0, t, t), Rx(math.radians(-45), V(0, 0, 0)))
        add_box(sc, 0, 0, 0, L, S * 0.95, 3.0, "glow", glow=g, emit=1, xf=xf)
    add_end_cap(sc, -1.4, S, S)
    return sc, cam_bar(L, yaw=0.55, lift=0.55, dist=1.2)


def build_pendant(finish: str, glow_key: str) -> tuple[Scene, Camera]:
    L, W, H, t = 96, 22, 28, 1.8
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    # closed body
    add_box(sc, 0, 0, 4, L, W, H, "metal")
    # hollow look via inner dark top? skip — solid architectural bar
    # bottom diffuser
    add_box(sc, 1, 1.6, 2.2, L - 2, W - 3.2, 2.4, "glow", glow=GLOW[glow_key], emit=1)
    add_end_cap(sc, -1.4, W, H + 4)
    add_end_cap(sc, L, W, H + 4)
    # suspension cables
    for x in (L * 0.18, L * 0.82):
        add_box(sc, x, W * 0.5 - 0.4, H + 4, 0.7, 0.8, 38, "dark")
    # canopy discs
    for x in (L * 0.18, L * 0.82):
        add_box(sc, x - 3, W * 0.5 - 4, H + 41, 7, 8, 1.4, "metal")
    cam = Camera(eye=V(L * 0.25, -L * 0.7, H * 1.15), look=V(L * 0.42, W * 0.5, H * 0.45), fov=32)
    return sc, cam


def build_hermetic(finish: str, glow_key: str, walkable: bool = False) -> tuple[Scene, Camera]:
    L, W, H, t = 88, 26 if walkable else 22, 20 if walkable else 16, 2.4
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    add_u_channel(sc, L, W, H, t, GLOW[glow_key], diffuser_h=4.2 if walkable else 3.4, flush=True, pcb=True)
    # gasket line
    add_box(sc, 0, t * 0.4, H - 4.8, L, W - t * 0.8, 0.7, "dark")
    if walkable:
        # walkable ribs on cover
        for i in range(10):
            add_box(sc, 6 + i * (L / 11), 3, H - 0.5, 1.2, W - 6, 0.6, "metal")
    add_end_cap(sc, -1.4, W, H)
    return sc, cam_bar(L, yaw=0.5, lift=0.4)


def build_bendable(finish: str, glow_key: str) -> tuple[Scene, Camera]:
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    segs = 18
    radius = 52
    arc = math.radians(95)
    w, h, t = 14, 11, 1.5
    for i in range(segs):
        a0 = i * arc / segs
        a1 = (i + 1) * arc / segs
        a = (a0 + a1) * 0.5
        chord = radius * (a1 - a0) * 1.08
        px = math.cos(a) * radius
        py = math.sin(a) * radius
        xf = compose(T(px, py, 0), Rz(a + math.pi / 2))
        add_u_channel(sc, chord, w, h, t, GLOW[glow_key], xf=xf, pcb=(i % 3 == 0), open_cut=(i == 0))
    cam = Camera(eye=V(18, -70, 48), look=V(28, 40, 6), fov=34)
    return sc, cam


def build_mini(finish: str, glow_key: str) -> tuple[Scene, Camera]:
    return build_surface_u(finish, glow_key, length=70, width=10, height=8, wall=1.2)


def build_stair(finish: str, glow_key: str) -> tuple[Scene, Camera]:
    L, t = 86, 1.6
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    # tread plate
    add_box(sc, 0, 0, 12, L, 28, t, "metal")
    # anti-slip grooves
    for i in range(5):
        add_box(sc, 0, 4 + i * 4.2, 12 + t, L, 1.1, 0.45, "dark")
    # riser channel
    add_u_channel(sc, L, 14, 12, t, GLOW[glow_key], xf=T(0, 0, 0))
    add_end_cap(sc, -1.4, 28, 14)
    return sc, cam_bar(L, yaw=0.58, lift=0.55, dist=1.3)


def build_deep_lensed(finish: str, glow_key: str) -> tuple[Scene, Camera]:
    L, W, H, t = 90, 20, 22, 1.7
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    add_box(sc, 0, 0, 0, L, W, t, "metal")
    add_box(sc, 0, 0, t, L, t, H - t, "metal")
    add_box(sc, 0, W - t, t, L, t, H - t, "metal")
    add_box(sc, 0, t, t, L, W - 2 * t, 0.5, "dark")
    add_box(sc, 0.5, t + 0.4, t + 0.4, L - 1, W - 2 * t - 0.8, 0.7, "pcb")
    n = 14
    pitch = (L - 8) / n
    for i in range(n):
        x = 4 + i * pitch + pitch * 0.5
        sc.sprites.append(
            Sprite(V(x, W * 0.5, H - 1.2), "lens", 2.4, GLOW[glow_key], sc.metal["dark"])
        )
    # lens cover plate
    add_box(sc, 0, t, H - 1.0, L, W - 2 * t, 1.0, "dark")
    add_end_cap(sc, -1.4, W, H)
    return sc, cam_bar(L, yaw=0.5, lift=0.38)


def build_washer(
    length: float,
    finish: str,
    glow_key: str | None,
    cells: int,
    compact: bool = False,
    rgb: bool = False,
    rgbw: bool = False,
    pixel: bool = False,
    fins: bool = False,
    curved: bool = False,
    ground: bool = False,
    fountain: bool = False,
    brackets: bool = True,
) -> tuple[Scene, Camera]:
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key] if glow_key else (180, 160, 255))
    W = 22 if not compact else 16
    H = 18 if not compact else 14
    D = length
    body_y = 8
    xf: Xform = identity
    if curved:
        # approximate with a slight Ry? we'll place cells on an arc later
        pass

    if ground:
        # recessed in-ground uplight — rectangular well + glass
        add_box(sc, 0, 0, 0, D, 40, 8, "metal")
        add_box(sc, 3, 4, 6, D - 6, 32, 1.2, "dark")
        add_box(sc, 4, 6, 7, D - 8, 28, 2.2, "glow", glow=GLOW[glow_key or "cool"], emit=1)
        n = max(4, cells)
        pitch = (D - 16) / n
        for i in range(n):
            col = GLOW[glow_key or "cool"]
            sc.sprites.append(Sprite(V(8 + i * pitch + pitch * 0.5, 20, 10), "lens", max(1.6, pitch * 0.28), col, sc.metal["dark"]))
        cam = Camera(eye=V(D * 0.15, -D * 0.7, 42), look=V(D * 0.45, 18, 6), fov=34)
        return sc, cam

    # main housing
    add_box(sc, 0, body_y, 0, D, W, H, "metal")
    # front bezel (slightly proud)
    add_box(sc, 0.6, body_y - 1.2, 1.2, D - 1.2, 1.4, H - 2.4, "dark")
    if fins:
        for i in range(7):
            add_box(sc, 2, body_y + W, 1 + i * 2.1, D - 4, 4.5, 1.1, "metal")
    if fountain:
        # extra sealed glass lip
        add_box(sc, 0, body_y - 1.6, 0.6, D, 1.8, H - 1.2, "ss" and "metal")
        sc.metal = METAL["ss"]

    # cells — radius stays inside pitch so they do not merge
    margin = 8 if not compact else 5
    pitch = (D - 2 * margin) / max(cells, 1)
    rad = max(1.4, min(pitch * 0.32, H * 0.28))
    for i in range(cells):
        x = margin + i * pitch + pitch * 0.5
        if pixel:
            col = RGB_CELLS[i % len(RGB_CELLS)]
        elif rgbw:
            col = RGB_CELLS[i % 4] if i % 4 != 3 else GLOW["white"]
        elif rgb:
            col = RGB_CELLS[i % 6]
        else:
            col = GLOW[glow_key or "warm"]
        z = H * 0.5
        sc.sprites.append(Sprite(V(x, body_y - 0.4, z), "lens", rad, col, sc.metal["dark"]))

    if brackets:
        for x in (-3.5, D + 0.4):
            add_box(sc, x, body_y + 2, -6, 2.4, W - 2, 2.0, "metal")
            add_box(sc, x, body_y + 2, -6, 2.4, 2.0, H + 8, "metal")
            add_box(sc, x, body_y + W - 2, -6, 2.4, 2.0, H + 8, "metal")

    if curved:
        # rebuild cells along a gentle arc by rotating the whole bar
        pass

    look_z = H * 0.45
    cam = Camera(
        eye=V(D * 0.12, -D * 0.62, H * 1.6),
        look=V(D * 0.42, body_y + W * 0.3, look_z),
        fov=30 if not compact else 32,
    )
    return sc, cam


def build_flex_washer(finish: str, glow_key: str, cells: int = 12) -> tuple[Scene, Camera]:
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    segs = cells
    radius = 70
    arc = math.radians(70)
    w, h = 14, 12
    for i in range(segs):
        a = i * arc / segs
        px = math.cos(a) * radius
        py = math.sin(a) * radius
        xf = compose(T(px, py, 0), Rz(a + math.pi / 2))
        add_box(sc, 0, 0, 0, 8, w, h, "metal", xf=xf)
        col = GLOW[glow_key]
        # lens in front of segment
        p = xf(V(4, -0.4, h * 0.5))
        sc.sprites.append(Sprite(p, "lens", 2.6, col, METAL[finish]["dark"]))
    cam = Camera(eye=V(20, -80, 40), look=V(40, 40, 6), fov=34)
    return sc, cam


def render_3d(builder, yaw: float = 50, pitch: float = 24, fov: float = 26, fill: float = 0.52) -> Image.Image:
    sc, _cam = builder()
    cam = auto_camera(sc, yaw=yaw, pitch=pitch, fov=fov, fill=fill)
    return composite(sc, cam)


# --- 2.5D reel / tape closeups ----------------------------------------------

def _draw_ellipse_aa(d: ImageDraw.ImageDraw, bbox, fill) -> None:
    d.ellipse(bbox, fill=fill)


def render_reel(kind: str) -> Image.Image:
    """Studio 3/4 reel: two flanges, wound tape, trailing lit strip."""
    bg = studio_bg()
    layer = Image.new("RGBA", (RW, RH), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    glow = Image.new("RGB", (RW, RH), (0, 0, 0))
    g = ImageDraw.Draw(glow)

    palette = {
        "cob-warm": GLOW["warm"],
        "cob-cool": GLOW["cool"],
        "smd-warm": GLOW["hospitality"],
        "rgb": (180, 90, 255),
        "ip67": GLOW["green"],
        "neon": GLOW["amber"],
        "narrow": GLOW["neutral"],
        "high": GLOW["warm"],
    }
    col = palette.get(kind, GLOW["warm"])
    silicone = kind in ("ip67", "neon")

    # 3/4 spool: back flange offset from front
    fcx, fcy = RW * 0.40, RH * 0.50
    bcx, bcy = fcx - 70, fcy - 48
    frx, fry = 310, 230
    brx, bry = 300, 222

    # back flange (darker)
    d.ellipse([bcx - brx, bcy - bry, bcx + brx, bcy + bry], fill=(24, 24, 28, 255))
    d.ellipse([bcx - brx * 0.36, bcy - bry * 0.36, bcx + brx * 0.36, bcy + bry * 0.36], fill=(14, 14, 16, 255))

    # barrel sides (quads between flange rims at 4 clock points)
    import math as _m
    for ang0, ang1 in ((40, 140), (220, 320)):
        pts = []
        for ang in (ang0, ang1):
            a = _m.radians(ang)
            pts.append((bcx + brx * _m.cos(a), bcy + bry * _m.sin(a)))
        for ang in (ang1, ang0):
            a = _m.radians(ang)
            pts.append((fcx + frx * _m.cos(a), fcy + fry * _m.sin(a)))
        d.polygon(pts, fill=(32, 32, 36, 255))

    # wound tape between flanges — concentric on a mid ellipse
    mx, my = (fcx + bcx) / 2, (fcy + bcy) / 2
    for i in range(12, 0, -1):
        t = i / 12
        rxi, ryi = frx * (0.40 + 0.50 * t), fry * (0.40 + 0.50 * t)
        band = mix((42, 44, 48), col, 0.12 + 0.14 * (i % 2 == 0))
        if silicone:
            band = mix((48, 58, 54), col, 0.28)
        d.ellipse([mx - rxi, my - ryi, mx + rxi, my + ryi], fill=(*band, 255))
        if i % 3 == 0:
            g.ellipse([mx - rxi, my - ryi, mx + rxi, my + ryi], fill=scale_rgb(col, 0.22))

    # front flange
    d.ellipse([fcx - frx, fcy - fry, fcx + frx, fcy + fry], outline=(70, 70, 76, 255), width=26)
    d.ellipse([fcx - frx * 0.38, fcy - fry * 0.38, fcx + frx * 0.38, fcy + fry * 0.38], fill=(20, 20, 22, 255))
    d.ellipse([fcx - frx * 0.15, fcy - fry * 0.15, fcx + frx * 0.15, fcy + fry * 0.15], fill=(10, 10, 12, 255))
    # inner ring highlight
    d.ellipse([fcx - frx + 8, fcy - fry + 8, fcx + frx - 8, fcy + fry - 8], outline=(90, 90, 96, 255), width=3)

    # trailing tape
    tape_y = fcy + fry * 0.15
    x0 = fcx + frx * 0.78
    pts_top, pts_bot = [], []
    th = 34 if kind != "narrow" else 18
    if kind == "neon":
        th = 42
    for i in range(24):
        x = x0 + i * 30
        y = tape_y + _m.sin(i * 0.16) * 14 + i * 0.8
        pts_top.append((x, y - th / 2))
        pts_bot.append((x, y + th / 2))
    poly = pts_top + list(reversed(pts_bot))
    pcb = (28, 78, 42, 255) if not silicone else (*mix((50, 70, 64), col, 0.22), 255)
    d.polygon(poly, fill=pcb)
    if kind.startswith("cob") or kind in ("ip67", "narrow", "high", "neon"):
        line = [(p[0], (p[1] + pts_bot[i][1]) / 2) for i, p in enumerate(pts_top)]
        g.line(line, fill=col, width=14 if kind != "neon" else 22)
        d.line(line, fill=(*mix(col, (255, 255, 240), 0.4), 255), width=6 if kind != "neon" else 12)
    else:
        for i, p in enumerate(pts_top[1:-1]):
            if i % 2:
                continue
            x, y = p[0], (p[1] + pts_bot[i + 1][1]) / 2
            c = RGB_CELLS[i % 6] if kind == "rgb" else col
            d.rectangle([x - 8, y - 6, x + 8, y + 6], fill=(16, 16, 18, 255))
            d.rectangle([x - 5, y - 3, x + 5, y + 3], fill=(*c, 255))
            g.ellipse([x - 16, y - 12, x + 16, y + 12], fill=c)

    bg_a = np.array(bg, dtype=np.float32)
    la = np.array(layer, dtype=np.float32)
    alpha = (la[:, :, 3] / 255.0)[:, :, None]
    rgb = la[:, :, :3]
    out = bg_a * (1 - alpha) + rgb * alpha
    for radius, k in ((8, 0.28), (20, 0.14), (44, 0.07)):
        blurred = np.array(glow.filter(ImageFilter.GaussianBlur(radius)), dtype=np.float32)
        out = np.clip(out + blurred * k, 0, 255)
    out = np.clip(out + np.array(glow, dtype=np.float32) * 0.12, 0, 255)
    rng = np.random.default_rng(3)
    out = np.clip(out + rng.normal(0, 2.2, out.shape), 0, 255)
    return Image.fromarray(out.astype(np.uint8), "RGB")


def render_strip_in_channel(kind: str) -> Image.Image:
    """Extreme close-up of tape sitting in an aluminum U, cut facing camera."""
    finish = "black" if kind in ("rgb-ch", "ip67-ch") else "silver"
    glow_key = {
        "cob-ch": "warm",
        "smd-ch": "hospitality",
        "rgb-ch": "cool",
        "ip67-ch": "green",
        "narrow-ch": "neutral",
        "high-ch": "warm",
        "cct-ch": "soft",
        "cob-cool-ch": "cool",
    }.get(kind, "warm")
    sc = Scene(metal=METAL[finish], glow_bleed=GLOW[glow_key])
    L, W, H, t = 48, 18, 14, 1.8
    if kind == "narrow-ch":
        W, H = 9, 8
    add_u_channel(sc, L, W, H, t, GLOW[glow_key], open_cut=True, pcb=True, flush=kind.endswith("ip67-ch"))
    if kind == "smd-ch":
        for i in range(10):
            sc.sprites.append(
                Sprite(V(3 + i * 4.2, W * 0.5, t + 2.2), "smd", 1.1, GLOW[glow_key], None)
            )
    if kind == "rgb-ch":
        for i in range(10):
            sc.sprites.append(Sprite(V(3 + i * 4.2, W * 0.5, t + 2.2), "smd", 1.1, RGB_CELLS[i % 6], None))
    cam = auto_camera(sc, yaw=56, pitch=22, fov=28, fill=0.62)
    return composite(sc, cam)


# --- catalog ----------------------------------------------------------------

def plates() -> list[tuple[str, Callable[[], Image.Image]]]:
    items: list[tuple[str, Callable[[], Image.Image]]] = [
        # 15+ aluminum profiles
        ("cat-al-recessed-trimless", lambda: render_3d(lambda: build_trimless("silver", "soft"))),
        ("cat-al-recessed-flanged", lambda: render_3d(lambda: build_flanged("silver", "neutral"))),
        ("cat-al-slim-surface-u", lambda: render_3d(lambda: build_surface_u("silver", "warm"))),
        ("cat-al-wide-surface", lambda: render_3d(lambda: build_wide("silver", "hospitality", 2))),
        ("cat-al-corner-cove", lambda: render_3d(lambda: build_corner("silver", "soft", False), yaw=55, pitch=28, fill=0.5)),
        ("cat-al-external-angle", lambda: render_3d(lambda: build_corner("silver", "neutral", True))),
        ("cat-al-pendant", lambda: render_3d(lambda: build_pendant("silver", "cool"), yaw=35, pitch=18, fill=0.48)),
        ("cat-al-inground", lambda: render_3d(lambda: build_hermetic("ss", "green", walkable=True))),
        ("cat-al-hermetic", lambda: render_3d(lambda: build_hermetic("ss", "blue", walkable=False))),
        ("cat-al-bendable", lambda: render_3d(lambda: build_bendable("silver", "amber"), yaw=20, pitch=32, fill=0.48)),
        ("cat-al-mini-furniture", lambda: render_3d(lambda: build_mini("silver", "soft"))),
        ("cat-al-stair-handrail", lambda: render_3d(lambda: build_stair("silver", "warm"))),
        ("cat-al-matte-black", lambda: render_3d(lambda: build_surface_u("black", "amber", length=90, width=20, height=14))),
        ("cat-al-custom-ral", lambda: render_3d(lambda: build_surface_u("white", "warm", length=88, width=18, height=13))),
        ("cat-al-surface-deep", lambda: render_3d(lambda: build_deep_lensed("silver", "cool"))),
        ("cat-al-wide-triple", lambda: render_3d(lambda: build_wide("black", "cool", 3))),
        # 12+ wall washers
        ("cat-ww-500-mono-3000", lambda: render_3d(lambda: build_washer(52, "black", "hospitality", 8, compact=True))),
        ("cat-ww-1000-mono-4000", lambda: render_3d(lambda: build_washer(96, "black", "neutral", 14, fins=True))),
        ("cat-ww-1000-rgbw-dmx", lambda: render_3d(lambda: build_washer(96, "black", None, 14, rgbw=True, fins=True))),
        ("cat-ww-rgb-dmx-ip65", lambda: render_3d(lambda: build_washer(80, "black", None, 12, rgb=True))),
        ("cat-ww-asymmetric-graze", lambda: render_3d(lambda: build_washer(84, "ss", "amber", 12, fins=True))),
        ("cat-ww-narrow-15", lambda: render_3d(lambda: build_washer(72, "black", "cool", 10))),
        ("cat-ww-30-wash", lambda: render_3d(lambda: build_washer(88, "black", "warm", 12))),
        ("cat-ww-60-flood", lambda: render_3d(lambda: build_washer(90, "ss", "soft", 12))),
        ("cat-ww-pixel", lambda: render_3d(lambda: build_washer(96, "black", None, 16, pixel=True))),
        ("cat-ww-flexible", lambda: render_3d(lambda: build_flex_washer("black", "blue", 12), yaw=18, pitch=30, fill=0.48)),
        ("cat-ww-ground-recessed", lambda: render_3d(lambda: build_washer(64, "ss", "green", 6, ground=True), yaw=30, pitch=42, fill=0.5)),
        ("cat-ww-high-power", lambda: render_3d(lambda: build_washer(100, "black", "amber", 16, fins=True))),
        ("cat-ww-compact-column", lambda: render_3d(lambda: build_washer(40, "black", "cool", 6, compact=True))),
        ("cat-ww-fountain-ip68", lambda: render_3d(lambda: build_washer(70, "ss", "blue", 10, fountain=True))),
        ("cat-ww-0-10v-mono", lambda: render_3d(lambda: build_washer(86, "black", "warm", 12))),
        # 8+ strip plates
        ("cat-led-cob-ip20", lambda: render_reel("cob-warm")),
        ("cat-led-cob-ip67", lambda: render_reel("ip67")),
        ("cat-led-smd-2700", lambda: render_reel("smd-warm")),
        ("cat-led-rgb", lambda: render_reel("rgb")),
        ("cat-led-neon-flex", lambda: render_reel("neon")),
        ("cat-led-narrow-cob", lambda: render_reel("narrow")),
        ("cat-led-high-output", lambda: render_reel("high")),
        ("cat-led-cob-cool-reel", lambda: render_reel("cob-cool")),
        ("cat-led-cob-in-channel", lambda: render_strip_in_channel("cob-ch")),
        ("cat-led-smd-in-channel", lambda: render_strip_in_channel("smd-ch")),
        ("cat-led-rgb-in-channel", lambda: render_strip_in_channel("rgb-ch")),
        ("cat-led-ip67-in-channel", lambda: render_strip_in_channel("ip67-ch")),
        ("cat-led-narrow-in-channel", lambda: render_strip_in_channel("narrow-ch")),
        ("cat-led-cct-in-channel", lambda: render_strip_in_channel("cct-ch")),
        ("cat-led-cob-cool-channel", lambda: render_strip_in_channel("cob-cool-ch")),
        ("cat-led-high-in-channel", lambda: render_strip_in_channel("high-ch")),
    ]
    return items


def main() -> None:
    os.makedirs(OUT_DIR, exist_ok=True)
    only = os.environ.get("ONLY")
    items = plates()
    if only:
        items = [it for it in items if only in it[0]]
    print(f"Rendering {len(items)} catalog plates → {OUT_DIR}")
    for i, (name, fn) in enumerate(items, 1):
        print(f"  [{i:02d}/{len(items)}] {name}", flush=True)
        im = fn()
        path = save_plate(im, name)
        print(f"      {os.path.getsize(path)} bytes", flush=True)
    print("done")


if __name__ == "__main__":
    main()
