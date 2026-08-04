import math
from pathlib import Path
from xml.sax.saxutils import unescape

from lxml import html
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "playbooks"
LOGO_WHITE = ROOT / "public" / "novalure-logo-white.png"

BOOKS = {
    "bautraeger-pipeline-playbook-de.html": "covers/bautraeger-de-cover.png",
    "makler-lead-playbook-de.html": "covers/makler-de-cover.png",
    "developer-pipeline-playbook-en.html": "covers/developer-en-cover.png",
    "real-estate-agent-lead-playbook-en.html": "covers/agent-en-cover.png",
    "novalure-playbook-promotores-es.html": "covers/promotores-es-cover.png",
    "novalure-playbook-agencias-inmobiliarias-es.html": "covers/agencias-es-cover.png",
}

W, H = 1240, 1754
YELLOW = (255, 212, 59)
WHITE = (248, 250, 252)
MUTED = (216, 222, 232)
INK = (12, 14, 19)
PANEL = (16, 19, 27)


def font(name, size):
    candidates = [
        Path("C:/Windows/Fonts") / name,
        Path("C:/Windows/Fonts/segoeui.ttf"),
        Path("C:/Windows/Fonts/arial.ttf"),
    ]
    for candidate in candidates:
        if candidate.exists():
            return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


FONT_REG = "segoeui.ttf"
FONT_BOLD = "segoeuib.ttf"


def text_content(node):
    return " ".join(node.text_content().split())


def parse_cover(path):
    doc = html.fromstring(path.read_text(encoding="utf-8"))
    lang = doc.xpath("string(/html/@lang)") or "en"
    cover = doc.xpath("//section[contains(@class,'cover')]")[0]
    footer = text_content(cover.xpath(".//*[contains(@class,'cover-card')]")[0])
    return {
        "lang": lang,
        "audience": "developer" if "developer" in path.name or "bautraeger" in path.name or "promotores" in path.name else "agent",
        "eyebrow": text_content(cover.xpath(".//*[contains(@class,'eyebrow')]")[0]),
        "title": text_content(cover.xpath(".//h1")[0]),
        "subtitle": text_content(cover.xpath(".//*[contains(@class,'subtitle')]")[0]),
        "promise": text_content(cover.xpath(".//*[contains(@class,'promise')]")[0]),
        "footer": unescape(footer),
    }


def text_width(draw, text, fnt):
    return draw.textbbox((0, 0), text, font=fnt)[2]


def wrap_text(draw, text, fnt, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        candidate = word if not current else f"{current} {word}"
        if text_width(draw, candidate, fnt) <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_wrapped(draw, xy, text, fnt, fill, max_width, line_gap=8):
    x, y = xy
    lines = wrap_text(draw, text, fnt, max_width)
    line_h = draw.textbbox((0, 0), "Ag", font=fnt)[3] + line_gap
    for line in lines:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += line_h
    return y


def cover_background():
    img = Image.new("RGB", (W, H), INK)
    px = img.load()
    for y in range(H):
        for x in range(W):
            t = (x / W) * 0.14 + (y / H) * 0.10
            glow = max(0, 1 - (((x - 820) / 520) ** 2 + ((y - 380) / 420) ** 2))
            r = int(8 + t * 45 + glow * 34)
            g = int(10 + t * 48 + glow * 30)
            b = int(15 + t * 48 + glow * 10)
            px[x, y] = (r, g, b)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    od.ellipse((1030, 1585, 1370, 1925), fill=(255, 212, 59, 42))
    return Image.alpha_composite(img.convert("RGBA"), overlay)


def paste_logo(img):
    if not LOGO_WHITE.exists():
        draw = ImageDraw.Draw(img)
        draw.text((120, 165), "novalure", font=font(FONT_BOLD, 42), fill=WHITE)
        return
    logo = Image.open(LOGO_WHITE).convert("RGBA")
    target_w = 230
    target_h = int(logo.height * (target_w / logo.width))
    logo = logo.resize((target_w, target_h), Image.LANCZOS)
    img.alpha_composite(logo, (120, 145))


def flow_labels(lang, audience):
    if lang == "de" and audience == "developer":
        return ["Nachfrage", "Projekt-Fit", "Intent-Filter", "Übergabe", "Check-Frage"]
    if lang == "de":
        return ["Lokale Nachfrage", "Segment", "Intent-Filter", "Übergabe", "Check-Frage"]
    if lang == "es" and audience == "developer":
        return ["Demanda", "Encaje", "Cualificación", "Traspaso", "Análisis"]
    if lang == "es":
        return ["Demanda local", "Segmento", "Intención", "Traspaso", "Análisis"]
    if audience == "developer":
        return ["Demand", "Project Fit", "Intent Filter", "Handover", "Check Question"]
    return ["Local Demand", "Segment", "Intent Filter", "Handover", "Check Question"]


def draw_flow(draw, x, y, w, h, labels):
    draw.rounded_rectangle((x, y, x + w, y + h), radius=22, fill=(13, 16, 23, 230))
    points = []
    for i in range(120):
        t = i / 119
        px = x + 90 + t * (w - 180)
        py = y + h * 0.52 + 52 * math.sin(t * 2.7 * math.pi)
        points.append((px, py))
    for a, b in zip(points, points[1:]):
        draw.line((a, b), fill=(57, 65, 79), width=3)

    label_font = font(FONT_BOLD, 16)
    for i, label in enumerate(labels):
        px = x + 100 + i * ((w - 200) / 4)
        py = y + (h * 0.37 if i % 2 else h * 0.62)
        draw.ellipse((px - 26, py - 26, px + 26, py + 26), fill=YELLOW)
        draw.ellipse((px - 9, py - 9, px + 9, py + 9), fill=PANEL)
        chip_w = min(180, max(118, text_width(draw, label, label_font) + 34))
        draw.rounded_rectangle((px - chip_w / 2, py + 38, px + chip_w / 2, py + 84), radius=14, fill=(29, 32, 43), outline=(58, 66, 82), width=2)
        draw.text((px - text_width(draw, label, label_font) / 2, py + 51), label, font=label_font, fill=WHITE)


def render_cover(book, output_path):
    img = cover_background()
    draw = ImageDraw.Draw(img)
    paste_logo(img)

    draw.text((120, 420), book["eyebrow"].upper(), font=font(FONT_BOLD, 20), fill=YELLOW)

    title_font_size = 72
    title_font = font(FONT_BOLD, title_font_size)
    while len(wrap_text(draw, book["title"], title_font, 1000)) > 4 and title_font_size > 52:
        title_font_size -= 4
        title_font = font(FONT_BOLD, title_font_size)
    y = draw_wrapped(draw, (120, 470), book["title"], title_font, WHITE, 1000, 10)
    y = max(y + 30, 770)
    y = draw_wrapped(draw, (120, y), book["subtitle"], font(FONT_REG, 32), MUTED, 990, 12)
    y += 48
    draw_wrapped(draw, (120, y), book["promise"], font(FONT_REG, 27), (255, 242, 146), 1000, 10)

    draw_flow(draw, 120, 1105, 1000, 230, flow_labels(book["lang"], book["audience"]))

    draw.rounded_rectangle((120, 1602, 1120, 1688), radius=8, fill=(30, 34, 45), outline=(96, 106, 124), width=2)
    footer = book["footer"].replace("NovaLure | ", "")
    draw.text((150, 1626), "NovaLure", font=font(FONT_BOLD, 24), fill=YELLOW)
    draw.text((285, 1626), f"| {footer}", font=font(FONT_REG, 24), fill=WHITE)

    output_path.parent.mkdir(parents=True, exist_ok=True)
    img.convert("RGB").save(output_path, "PNG")


def main():
    for html_name, cover_name in BOOKS.items():
        html_path = OUT_DIR / html_name
        output_path = OUT_DIR / cover_name
        render_cover(parse_cover(html_path), output_path)
        print(f"Created {output_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
