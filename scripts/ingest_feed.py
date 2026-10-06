#!/usr/bin/env python3
"""
Product-feed ingest for abbaselectricals.com.

Reads every feed folder /workspace/website/product-feed/<feed>/products.json (folders starting
with "_" or "." are ignored, e.g. _example), validates each product against SCHEMA.md, skips
duplicates of products already on the site (same brand + model, or same slug), normalises the
images to 1000 px square WebP on white in public/products/feed/<category>/, merges the products
into src/data/feed-products.json -> src/lib/feed-products.ts, refreshes EXISTING.json and prints
a report (also saved to product-feed/INGEST-REPORT.md).

  npm run ingest-feed                      # ingest all feeds
  npm run ingest-feed -- --dry-run         # validate + report only, change nothing
  npm run ingest-feed -- --feed sanitary-kludi   # one feed folder only
  npm run ingest-feed -- --remove <slug>   # take a feed product off the site again

Then `npm run build` (EXISTING.json is regenerated after every build).
"""
import argparse, datetime, json, os, re, subprocess, sys
from pathlib import Path

try:
    from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageOps
except ImportError:  # pragma: no cover
    sys.exit("ingest-feed: Pillow is required (pip install pillow)")

SITE = Path(__file__).resolve().parent.parent
FEED = Path(os.environ.get("PRODUCT_FEED_DIR", SITE.parent / "product-feed")).resolve()
STORE = SITE / "src/data/feed-products.json"
TS_OUT = SITE / "src/lib/feed-products.ts"
IMG_ROOT = SITE / "public/products/feed"
URL_ROOT = "/products/feed"

BRAND_GROUPS = ("lighting", "electrical", "sanitary")
SOURCE_TYPES = ("brand_site", "catalogue", "user_quote")
REQUIRED = ("slug", "name", "brand", "brand_group", "category", "sub_category", "description",
            "specs", "images", "source_type")

# Standard spec keys -> label shown in the product-page spec table (order = display order).
SPEC_KEYS = {
    "series": "Series", "wattage": "Power", "voltage": "Voltage", "current": "Current",
    "lumens": "Luminous flux", "efficacy": "Efficacy", "cct": "Colour temperature", "cri": "CRI",
    "beam_angle": "Beam angle", "ip": "IP rating", "ik": "IK rating", "led_type": "LED type",
    "led_density": "LED density", "base": "Lamp base", "dimming": "Dimming", "driver": "Driver",
    "power_factor": "Power factor", "frequency": "Frequency", "lifetime": "Lifetime",
    "size": "Size", "cut_out": "Cut-out", "weight": "Weight", "material": "Material",
    "finish": "Finish", "colour": "Colour", "mounting": "Mounting", "installation": "Installation",
    "operating_temp": "Operating temperature",
    # electrical
    "poles": "Poles", "rated_current": "Rated current", "breaking_capacity": "Breaking capacity",
    "gang": "Gang", "ways": "Ways", "curve": "Tripping curve", "sensitivity": "Sensitivity",
    "usb_output": "USB output", "contact_gap": "Contact gap", "terminal_capacity": "Terminal capacity",
    "surge_protection": "Surge protection",
    # drivers & controls
    "outputs": "Outputs", "protocols": "Protocols", "dry_contact_inputs": "Dry contact inputs",
    "efficiency": "Efficiency", "ripple": "Ripple", "max_cable_length": "Max cable length",
    # sanitary
    "flow_rate": "Flow rate", "pressure": "Working pressure", "cartridge": "Cartridge",
    "connection": "Connection", "spout": "Spout", "projection": "Projection", "flush": "Flush",
    "outlet": "Outlet / trap", "rough_in": "Rough-in", "seat": "Seat",
    # general
    "standard": "Standard", "certification": "Certification", "warranty": "Warranty",
}
SPEC_ALIASES = {"power": "wattage", "watts": "wattage", "lumen": "lumens", "flux": "lumens",
                "colour_temperature": "cct", "color_temperature": "cct", "ip_rating": "ip",
                "beam": "beam_angle", "dimensions": "size", "cutout": "cut_out", "color": "colour",
                "input_voltage": "voltage"}
VARIANT_FIELDS = {"model": "model", "wattage": "power", "power": "power", "lumens": "lumens",
                  "intensity": "intensity", "size": "size", "beam_angle": "beam", "beam": "beam",
                  "note": "note"}

# Brand display mapping (applied at ingest; feed files keep the manufacturer's own badge).
# feed brand (case-insensitive) -> (brand shown on the site / filter chip / badge, fuller label for the product page)
BRAND_MAP = {
    "signify": ("Philips", "Philips (Signify)"),
    "philips (signify)": ("Philips", "Philips (Signify)"),
    "signify dynalite": ("Philips", "Philips Dynalite"),
    "dynalite": ("Philips", "Philips Dynalite"),
    "philips dynalite": ("Philips", "Philips Dynalite"),
}


def map_brand(p):
    """Returns (site brand, product-page label or None)."""
    raw = str(p.get("brand", "")).strip()
    brand, label = BRAND_MAP.get(raw.lower(), (raw, None))
    if p.get("brand_label"):
        label = str(p["brand_label"]).strip()
    return brand, (label if label and label != brand else None)


PRICE_RE = re.compile(r"(?i)(\b(aed|usd|eur|gbp|dhs?|dirhams?|prices?|priced|pricing|msrp|rrp|discount|vat\s+incl\w*)\b|[$€£])")
QUOTE_RE = re.compile(r"(?i)\b(quotation|quote\s*(no|number|ref)|q[-/ ]?\d{3,}|lpo|invoice)\b")
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
URL_RE = re.compile(r"^https?://\S+$")


def norm_model(s):
    return re.sub(r"[^a-z0-9]", "", str(s).lower())


def load_categories():
    path = FEED / "CATEGORIES.json"
    if not path.exists():
        run_export()
    data = json.loads(path.read_text())
    subs = {}
    for g in data["groups"]:
        for s in g["sub_categories"]:
            subs[s["sub_category"]] = {"group": g["category"], "brand_group": g["brand_group"], "name": s["name"]}
    return subs, set(data.get("voltage_subs", []))


def run_export():
    r = subprocess.run(["npx", "--no-install", "tsx", "scripts/export-existing.mts"], cwd=SITE,
                       capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit("ingest-feed: export-existing failed:\n" + r.stdout + r.stderr)
    return r.stdout.strip()


def internal_category(brand_group, sub):
    if brand_group == "sanitary":
        return "Sanitary ware"
    if brand_group == "electrical":
        return "Electrical package"
    if sub in ("led-strips", "rgb-strips", "neon-flex"):
        return "LED strip lights"
    if sub == "linear-profiles":
        return "Aluminum profiles"
    if sub in ("drivers-power", "dmx-control"):
        return "Drivers & control"
    if sub == "accessories":
        return "Accessories"
    if sub == "wall-washers":
        return "Wall washers"
    return "Luminaires"


def strip_voltage(value):
    m = re.match(r"\s*(\d+)", str(value))
    if not m:
        return None
    n = int(m.group(1))
    return "220V" if 200 <= n <= 240 else {12: "12V", 24: "24V", 48: "48V"}.get(n)


def text_of(obj):
    if isinstance(obj, dict):
        return " ".join(text_of(v) for v in obj.values())
    if isinstance(obj, list):
        return " ".join(text_of(v) for v in obj)
    return str(obj)


def check_image(path):
    """Returns (errors, warnings, (w, h))."""
    errs, warns = [], []
    try:
        im = Image.open(path)
        im.load()
    except Exception as e:  # noqa: BLE001
        return [f"image {path.name}: cannot be opened ({e})"], [], (0, 0)
    w, h = im.size
    if min(w, h) < 400:
        errs.append(f"image {path.name}: {w}x{h}px is too small (min 400px, 800px+ preferred)")
    elif min(w, h) < 800:
        warns.append(f"image {path.name}: {w}x{h}px short side is under the preferred 800px (used without upscaling)")
    rgb = flatten(im)
    border = [rgb.getpixel((x, y)) for x in range(0, w, max(1, w // 50)) for y in (0, h - 1)] + \
             [rgb.getpixel((x, y)) for y in range(0, h, max(1, h // 50)) for x in (0, w - 1)]
    lum = sum(sum(p) / 3 for p in border) / len(border)
    if lum < 200:
        errs.append(f"image {path.name}: background is not white (border brightness {lum:.0f}/255); product photos on white only")
    elif lum < 238:
        warns.append(f"image {path.name}: background is off-white (border brightness {lum:.0f}/255), check it")
    return errs, warns, (w, h)


def flatten(im):
    im = ImageOps.exif_transpose(im)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        bg.alpha_composite(im)
        return bg.convert("RGB")
    return im.convert("RGB")


def whiten(im, lo=246):
    g = im.convert("L").point(lambda p: 255 if p >= lo else 0)
    w, h = g.size
    for x, y in [(x, 0) for x in range(0, w, 4)] + [(x, h - 1) for x in range(0, w, 4)] + \
                [(0, y) for y in range(0, h, 4)] + [(w - 1, y) for y in range(0, h, 4)]:
        if g.getpixel((x, y)) == 255:
            ImageDraw.floodfill(g, (x, y), 128)
    m = g.point(lambda p: 255 if p == 128 else 0)
    return Image.composite(Image.new("RGB", im.size, (255, 255, 255)), im, m)


def pure_white_border(im):
    w, h = im.size
    g = im.convert("L")
    px = [g.getpixel((x, y)) for x in range(0, w, 3) for y in (0, h - 1)] + \
         [g.getpixel((x, y)) for y in range(0, h, 3) for x in (0, w - 1)]
    return sum(1 for p in px if p >= 250) / len(px) >= 0.98


def process_image(src, dst):
    """Trim to the product, whiten an off-white border-connected background, fit uncropped within
    84% of a 1000x1000 white canvas (downscale only, never upscale), save WebP q86."""
    im = flatten(Image.open(src))
    bg = Image.new("RGB", im.size, (255, 255, 255))
    diff = ImageChops.difference(im, bg).convert("L").point(lambda p: 255 if p > 5 else 0).filter(ImageFilter.MedianFilter(5))
    bbox = diff.getbbox() or (0, 0, im.width, im.height)
    pad = 4
    bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(im.width, bbox[2] + pad), min(im.height, bbox[3] + pad))
    im = im.crop(bbox)
    if not pure_white_border(im):  # already pure white: skip, so white products keep their edges
        im = whiten(im)
    S, inner = 1000, 840
    # Downscale to fit; never upscale (small sources are padded onto the white canvas instead).
    scale = min(1.0, inner / max(im.size))
    nw, nh = max(1, round(im.width * scale)), max(1, round(im.height * scale))
    if scale < 1.0:
        im = im.resize((nw, nh), Image.LANCZOS)
    canvas = Image.new("RGB", (S, S), (255, 255, 255))
    canvas.paste(im, ((S - nw) // 2, (S - nh) // 2))
    dst.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(dst, "WEBP", quality=86, method=6)


def validate(p, folder, subs, vsubs):
    """Returns (errors, warnings, normalised spec rows, voltage key)."""
    errs, warns = [], []
    if not isinstance(p, dict):
        return ["entry is not an object"], [], [], None
    for k in REQUIRED:
        if p.get(k) in (None, "", [], {}):
            errs.append(f"missing required field '{k}'")
    slug = str(p.get("slug", ""))
    if slug and not SLUG_RE.match(slug):
        errs.append(f"slug '{slug}' must be lowercase a-z, 0-9 and single hyphens")
    if len(slug) > 80:
        errs.append("slug longer than 80 characters")
    bg, cat, sub = p.get("brand_group"), p.get("category"), p.get("sub_category")
    if bg and bg not in BRAND_GROUPS:
        errs.append(f"brand_group '{bg}' must be one of {', '.join(BRAND_GROUPS)}")
    if sub and sub not in subs:
        errs.append(f"unknown sub_category '{sub}' (see SCHEMA.md / CATEGORIES.json)")
    elif sub:
        info = subs[sub]
        if cat and cat != info["group"]:
            errs.append(f"sub_category '{sub}' belongs to category '{info['group']}', not '{cat}'")
        if bg and bg != info["brand_group"]:
            errs.append(f"category '{info['group']}' is brand_group '{info['brand_group']}', not '{bg}'")
    st = p.get("source_type")
    if st and st not in SOURCE_TYPES:
        errs.append(f"source_type '{st}' must be one of {', '.join(SOURCE_TYPES)}")
    urls = p.get("source_urls") or []
    if not isinstance(urls, list):
        errs.append("source_urls must be a list"); urls = []
    for u in urls:
        if not URL_RE.match(str(u)):
            errs.append(f"source_urls: '{u}' is not a URL")
    if st in ("brand_site", "catalogue") and not urls:
        errs.append(f"source_urls is required for source_type '{st}'")
    if st == "user_quote" and not urls and not p.get("source_note"):
        errs.append("user_quote products need source_urls (photo/spec source) or source_note")
    desc = str(p.get("description", ""))
    if desc and not 20 <= len(desc) <= 320:
        errs.append(f"description must be 20-320 characters (has {len(desc)})")
    name = str(p.get("name", ""))
    if name and len(name) > 90:
        errs.append("name longer than 90 characters")
    if name and name == name.lower():
        warns.append("name is all lowercase; use Title Case")
    if name and p.get("brand") and name.lower().startswith(str(p["brand"]).lower() + " "):
        warns.append("name starts with the brand; the site shows the brand separately")

    # specs: object {key: value} or list of {key, value}
    raw = p.get("specs") or {}
    items = []
    if isinstance(raw, dict):
        items = list(raw.items())
    elif isinstance(raw, list):
        for r in raw:
            if isinstance(r, dict) and "key" in r and "value" in r:
                items.append((r["key"], r["value"]))
            else:
                errs.append("specs list entries need 'key' and 'value'")
    else:
        errs.append("specs must be an object or a list of {key, value}")
    rows, seen = [], {}
    for k, v in items:
        key = SPEC_ALIASES.get(str(k).strip().lower().replace(" ", "_").replace("-", "_"), str(k).strip().lower().replace(" ", "_").replace("-", "_"))
        if isinstance(v, (list, tuple)):
            v = " / ".join(str(x) for x in v)
        v = str(v).strip() if v is not None else ""
        if not v:
            errs.append(f"spec '{k}' is empty (leave unknown specs out, never guess)")
            continue
        if key in SPEC_KEYS:
            label = SPEC_KEYS[key]
        else:
            label = str(k).strip().replace("_", " ")
            label = label[:1].upper() + label[1:]
            warns.append(f"non-standard spec key '{k}' shown as '{label}'")
        seen[key] = v
        rows.append((list(SPEC_KEYS).index(key) if key in SPEC_KEYS else 999, label, v))
    rows = [{"label": l, "value": v} for _, l, v in sorted(rows, key=lambda r: r[0])]
    volt = None
    if sub in vsubs:
        volt = strip_voltage(seen.get("voltage", ""))
        if not volt:
            errs.append("strip products need specs.voltage of 12V, 24V, 48V or 220-240V (one voltage per listing)")

    variants = p.get("variants") or []
    if not isinstance(variants, list):
        errs.append("variants must be a list")
    else:
        for i, v in enumerate(variants):
            if not isinstance(v, dict) or not v.get("model"):
                errs.append(f"variants[{i}] needs a 'model'")
    for k in ("applications", "features"):
        val = p.get(k) or []
        if not isinstance(val, list) or not all(isinstance(x, str) and x.strip() for x in val):
            errs.append(f"{k} must be a list of non-empty strings")
        elif any(len(x) > 60 for x in val):
            warns.append(f"{k}: keep each entry short (under 60 characters)")

    # images
    imgs = p.get("images") or []
    if not isinstance(imgs, list):
        errs.append("images must be a list of filenames"); imgs = []
    for f in imgs:
        path = (folder / str(f)).resolve()
        if folder.resolve() not in path.parents:
            errs.append(f"image '{f}' must be inside the feed folder"); continue
        if not path.exists():
            errs.append(f"image '{f}' not found in {folder.name}/"); continue
        if path.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            errs.append(f"image '{f}': use jpg, png or webp"); continue
        e, w, _ = check_image(path)
        errs += e; warns += w

    # content guards
    content = {k: v for k, v in p.items() if k not in ("source_urls", "images", "slug")}
    if PRICE_RE.search(text_of(content)):
        errs.append(f"contains price wording ('{PRICE_RE.search(text_of(content)).group(0)}'); no prices on the site")
    if QUOTE_RE.search(text_of(content)):
        errs.append(f"contains quotation / document references ('{QUOTE_RE.search(text_of(content)).group(0)}')")
    if "signatory" in text_of(p).lower():
        errs.append("contains 'signatory' wording")
    return errs, warns, rows, volt


def photo_note(brand, st, label=None):
    brand = label or brand
    if brand == "Barq Lumi":
        return "Catalogue photo of the product type. Exact product photos and datasheets on request."
    if st == "brand_site":
        return f"Official {brand} product photo, as published by the manufacturer. Datasheets on request."
    if st == "catalogue":
        return f"{brand} product photo from the manufacturer's catalogue. Datasheets on request."
    return f"Product photo of the {brand} model. Datasheets on request."


def build_entry(p, folder, rows, volt, subs):
    sub = p["sub_category"]
    bg = subs[sub]["brand_group"]
    group = subs[sub]["group"]
    out_imgs = []
    for i, f in enumerate(p["images"]):
        name = p["slug"] + ("" if i == 0 else f"-{i + 1}") + ".webp"
        out_imgs.append((folder / f, IMG_ROOT / group / name, f"{URL_ROOT}/{group}/{name}"))
    variants = []
    for v in p.get("variants") or []:
        nv, extra = {}, []
        for k, val in v.items():
            if val in (None, ""):
                continue
            kk = k.strip().lower()
            if kk in VARIANT_FIELDS:
                tgt = VARIANT_FIELDS[kk]
                nv[tgt] = f"{nv[tgt]}; {val}" if tgt == "note" and tgt in nv else str(val)
            else:
                lab = SPEC_KEYS.get(SPEC_ALIASES.get(kk, kk), kk.replace("_", " ").capitalize())
                extra.append(f"{lab}: {val}")
        if extra:
            nv["note"] = "; ".join(([nv["note"]] if "note" in nv else []) + extra)
        variants.append(nv)
    brand, label = map_brand(p)
    entry = {
        "id": p["slug"],
        "sub": sub,
        "name": p["name"].strip(),
        "brand": brand,
        "category": internal_category(bg, sub),
        "use": p["description"].strip(),
        "specs": [x.strip() for x in p.get("features") or []][:8],
        "tone": "soft" if bg == "lighting" else "silver",
        "image": out_imgs[0][2],
        "specRows": rows,
        "photoNote": photo_note(brand, p["source_type"], label),
    }
    if label:
        entry["brandLabel"] = label
    if p.get("model"):
        entry["model"] = str(p["model"]).strip()
    if variants:
        entry["variants"] = variants
    if len(out_imgs) > 1:
        entry["gallery"] = [u for _, _, u in out_imgs[1:]]
    if p.get("applications"):
        entry["applications"] = [x.strip() for x in p["applications"]]
    if p.get("source_urls"):
        entry["source"] = p["source_urls"][0]
    if volt:
        entry["voltage"] = volt
    meta = {"feed": folder.name, "brand_group": bg, "feed_brand": p["brand"].strip(), "group": group, "source_type": p["source_type"],
            "source_urls": p.get("source_urls") or [], "source_note": p.get("source_note"),
            "original_images": [str(f) for f in p["images"]],
            "ingested_at": datetime.datetime.now().astimezone().isoformat(timespec="seconds")}
    return entry, out_imgs, meta


def write_ts(store):
    body = json.dumps([e for e, _ in ((dict((k, v) for k, v in s.items() if k != "_meta"), None) for s in store)],
                      indent=2, ensure_ascii=False)
    TS_OUT.write_text(
        "/**\n * Products merged from the Product Researcher feeds (/workspace/website/product-feed/<feed>/products.json).\n"
        " * GENERATED by scripts/ingest_feed.py — do not edit by hand. Source data: src/data/feed-products.json.\n */\n"
        'import type { Product } from "@/lib/products";\n\n'
        f"export const feedProducts: (Product & {{ sub: string }})[] = {body};\n")


def write_sources(store):
    by_group = {}
    for s in store:
        by_group.setdefault(s["_meta"]["group"], []).append(s)
    for d in IMG_ROOT.glob("*/"):
        if d.name not in by_group:
            (d / "SOURCES.md").unlink(missing_ok=True)
            if not any(d.iterdir()):
                d.rmdir()
    for group, items in by_group.items():
        lines = [f"# Image sources: feed products, {group}", "",
                 "GENERATED by scripts/ingest_feed.py. Images normalised to 1000 px square WebP on white (product uncropped).", "",
                 "| File | Product | Brand | Source type | Source |", "|---|---|---|---|---|"]
        for s in sorted(items, key=lambda x: x["id"]):
            m = s["_meta"]
            files = [s["image"]] + s.get("gallery", [])
            src = ", ".join(m["source_urls"]) or (m.get("source_note") or "")
            for f in files:
                lines.append(f"| {Path(f).name} | {s['name']} | {s['brand']} | {m['source_type']} | {src} |")
        (IMG_ROOT / group).mkdir(parents=True, exist_ok=True)
        (IMG_ROOT / group / "SOURCES.md").write_text("\n".join(lines) + "\n")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--feed", help="only this feed folder name")
    ap.add_argument("--remove", metavar="SLUG", help="remove a feed product (and its images)")
    a = ap.parse_args()

    store = json.loads(STORE.read_text()) if STORE.exists() else []

    if a.remove:
        hit = [s for s in store if s["id"] == a.remove]
        if not hit:
            sys.exit(f"ingest-feed: '{a.remove}' is not a feed product")
        for f in [hit[0]["image"]] + hit[0].get("gallery", []):
            (SITE / "public" / f.lstrip("/")).unlink(missing_ok=True)
        store = [s for s in store if s["id"] != a.remove]
        STORE.write_text(json.dumps(store, indent=2, ensure_ascii=False) + "\n")
        write_ts(store); write_sources(store)
        print(f"removed {a.remove}; " + run_export().splitlines()[0])
        return

    print("refreshing EXISTING.json ...")
    run_export()
    subs, vsubs = load_categories()
    existing = json.loads((FEED / "EXISTING.json").read_text())["products"]
    seen_slugs = {p["slug"] for p in existing}
    seen_models = {(p["brand"].lower(), norm_model(m)) for p in existing for m in p.get("models", []) if norm_model(m)}

    feeds = sorted(d for d in FEED.iterdir() if d.is_dir() and not d.name.startswith(("_", "."))
                   and (d / "products.json").exists())
    if a.feed:
        feeds = [d for d in feeds if d.name == a.feed]
        if not feeds:
            sys.exit(f"ingest-feed: no feed folder '{a.feed}' with products.json in {FEED}")

    added, skipped, invalid, warnings = [], [], [], []
    new_entries = []
    for folder in feeds:
        try:
            data = json.loads((folder / "products.json").read_text())
        except Exception as e:  # noqa: BLE001
            invalid.append((folder.name, "(file)", [f"products.json is not valid JSON: {e}"])); continue
        items = data.get("products", []) if isinstance(data, dict) else data
        if not isinstance(items, list):
            invalid.append((folder.name, "(file)", ["'products' must be a list"])); continue
        for i, p in enumerate(items):
            label = (p.get("slug") if isinstance(p, dict) else None) or f"#{i}"
            errs, warns, rows, volt = validate(p, folder, subs, vsubs)
            if errs:
                invalid.append((folder.name, label, errs)); continue
            key_models = [m for m in [p.get("model")] + [v.get("model") for v in p.get("variants") or []] if m]
            dup = None
            site_brand = map_brand(p)[0].lower()
            if p["slug"] in seen_slugs:
                dup = f"slug '{p['slug']}' already on the site"
            else:
                for m in key_models:
                    if (site_brand, norm_model(m)) in seen_models:
                        dup = f"{map_brand(p)[0]} {m} already on the site"; break
            if dup:
                skipped.append((folder.name, label, dup)); continue
            entry, imgs, meta = build_entry(p, folder, rows, volt, subs)
            seen_slugs.add(p["slug"])
            seen_models.update((site_brand, norm_model(m)) for m in key_models)
            new_entries.append((entry, imgs, meta))
            added.append((folder.name, label, f"{meta['group']}/{entry['sub']} · {entry['brand']}"))
            warnings += [(folder.name, label, w) for w in warns]

    if not a.dry_run and new_entries:
        for entry, imgs, meta in new_entries:
            for src, dst, _ in imgs:
                process_image(src, dst)
            store.append({**entry, "_meta": meta})
        STORE.write_text(json.dumps(store, indent=2, ensure_ascii=False) + "\n")
        write_ts(store)
        write_sources(store)
        run_export()

    now = datetime.datetime.now().astimezone().strftime("%Y-%m-%d %H:%M %Z")
    out = [f"# Ingest report, {now}{' (DRY RUN, nothing changed)' if a.dry_run else ''}", "",
           f"Feeds read: {len(feeds)} ({', '.join(d.name for d in feeds) or 'none'})",
           f"Added: {len(added)} · Skipped (duplicates): {len(skipped)} · Invalid: {len(invalid)} · Warnings: {len(warnings)}",
           f"Feed products on the site: {len(store)}", ""]
    for title, rows_ in (("Added", added), ("Skipped (duplicate)", skipped), ("Warnings", warnings)):
        if rows_:
            out += [f"## {title}", ""] + [f"- {f} / {s}: {m}" for f, s, m in rows_] + [""]
    if invalid:
        out += ["## Invalid (not added, fix and re-run)", ""]
        for f, s, errs in invalid:
            out += [f"- {f} / {s}:"] + [f"  - {e}" for e in errs]
        out.append("")
    if added and not a.dry_run:
        out += ["Next: `npm run build`, check the pages, then publish.", ""]
    report = "\n".join(out)
    print(report)
    if not a.dry_run:
        (FEED / "INGEST-REPORT.md").write_text(report)
    sys.exit(1 if invalid else 0)


if __name__ == "__main__":
    main()
