"""Build NovaLure's nine editorial field guides and actual page previews."""
from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfdoc import PDFString
from reportlab.pdfgen import canvas
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / "content/playbooks-v3.json").read_text(encoding="utf-8"))
OUT = ROOT / "public/playbooks"
PREVIEWS = OUT / "previews"
COVERS = OUT / "covers"
for folder in (OUT, PREVIEWS, COVERS):
    folder.mkdir(parents=True, exist_ok=True)

FONT_DIR = Path(r"C:\Users\Franz\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pdfjs-dist\standard_fonts")
POPPLER = Path(r"C:\Users\Franz\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe")
pdfmetrics.registerFont(TTFont("Liberation", str(FONT_DIR / "LiberationSans-Regular.ttf")))
pdfmetrics.registerFont(TTFont("LiberationBold", str(FONT_DIR / "LiberationSans-Bold.ttf")))
pdfmetrics.registerFont(TTFont("LiberationItalic", str(FONT_DIR / "LiberationSans-Italic.ttf")))

NAVY = colors.HexColor("#101A2B")
INK = colors.HexColor("#11192B")
PAPER = colors.HexColor("#F8F8F6")
BLUE = colors.HexColor("#1656E9")
PALE = colors.HexColor("#9BBAFF")
MUTED = colors.HexColor("#536176")
LINE = colors.HexColor("#D9DFE9")
WHITE = colors.white
W, H = A4
M = 48
BOTTOM = 58

STEMS = {"project": "project-demand", "owned": "owned-demand", "international": "international-buyers"}


def text_lines(value: str, width: float, font: str, size: float) -> list[str]:
    lines: list[str] = []
    for paragraph in value.split("\n"):
        if not paragraph:
            lines.append("")
            continue
        words = paragraph.split()
        line = ""
        for word in words:
            trial = f"{line} {word}".strip()
            if pdfmetrics.stringWidth(trial, font, size) <= width:
                line = trial
            else:
                if line:
                    lines.append(line)
                line = word
        if line:
            lines.append(line)
    return lines


def paragraph(c: canvas.Canvas, value: str, x: float, y: float, width: float, size=11, leading=16,
              font="Liberation", colour=INK) -> float:
    c.setFont(font, size)
    c.setFillColor(colour)
    for line in text_lines(value, width, font, size):
        if y < BOTTOM:
            raise RuntimeError(f"Text overflow: {value[:55]}")
        c.drawString(x, y, line)
        y -= leading
    return y


def background(c: canvas.Canvas, page: int, total: int, title: str, locale: str):
    c.setFillColor(PAPER)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont("LiberationBold", 13)
    c.drawString(M, H - 39, "novalure")
    dot_x = M + pdfmetrics.stringWidth("novalure", "LiberationBold", 13)
    c.setFillColor(BLUE)
    c.drawString(dot_x, H - 39, ".")
    c.setStrokeColor(LINE)
    c.line(M, H - 51, W - M, H - 51)
    c.setFont("Liberation", 8)
    c.setFillColor(MUTED)
    c.drawString(M, 30, f"{title}  ·  {locale.upper()}")
    c.drawRightString(W - M, 30, f"{page:02d} / {total:02d}")


def heading(c: canvas.Canvas, eyebrow: str, title: str, sub: str = "") -> float:
    y = H - 91
    c.setFillColor(BLUE)
    c.setFont("LiberationBold", 9)
    c.drawString(M, y, eyebrow)
    y -= 29
    c.setFillColor(INK)
    for line in text_lines(title, W - 2 * M, "LiberationBold", 25):
        c.setFont("LiberationBold", 25)
        c.drawString(M, y, line)
        y -= 30
    if sub:
        y -= 4
        y = paragraph(c, sub, M, y, W - 2 * M, 11, 17, colour=MUTED)
    return y - 23


def card(c: canvas.Canvas, x: float, y_top: float, width: float, label: str, body: str,
         height=105, dark=False) -> float:
    c.setFillColor(NAVY if dark else WHITE)
    c.roundRect(x, y_top - height, width, height, 8, fill=1, stroke=0)
    c.setFillColor(PALE if dark else BLUE)
    c.setFont("LiberationBold", 10)
    c.drawString(x + 17, y_top - 24, label)
    paragraph(c, body, x + 17, y_top - 47, width - 34, 10, 15, colour=WHITE if dark else INK)
    return y_top - height


def page(c, n, total, common, topic, locale, eyebrow, title, sub=""):
    c.bookmarkPage(f"page-{n}")
    c.addOutlineEntry(title, f"page-{n}", level=0)
    background(c, n, total, topic["title"], locale)
    return heading(c, eyebrow, title, sub)


def cover(c, common, topic, kind, locale):
    c.bookmarkPage("page-1")
    c.addOutlineEntry(topic["title"], "page-1", level=0)
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFont("LiberationBold", 23)
    c.setFillColor(WHITE)
    c.drawString(M, H - 61, "novalure")
    dot_x = M + pdfmetrics.stringWidth("novalure", "LiberationBold", 23)
    c.setFillColor(BLUE)
    c.drawString(dot_x, H - 61, ".")
    c.setFont("LiberationBold", 9)
    c.setFillColor(PALE)
    c.drawString(M, H - 135, common["free"])
    y = H - 185
    c.setFillColor(WHITE)
    for line in text_lines(topic["promise"], W - 2 * M, "LiberationBold", 31):
        c.setFont("LiberationBold", 31)
        c.drawString(M, y, line)
        y -= 38
    y -= 16
    paragraph(c, topic["subtitle"], M, y, W - 2 * M, 12, 19, colour=WHITE)
    # Distinct topic motifs, drawn from the working tool rather than property imagery.
    base = 195
    c.setStrokeColor(PALE)
    c.setLineWidth(2)
    if kind == "project":
        for i, label in enumerate(["01", "02", "03", "04", "05"]):
            x = M + i * 100
            c.setFillColor(BLUE if i == 3 else NAVY)
            c.roundRect(x, base, 74, 68, 7, fill=1, stroke=1)
            c.setFillColor(WHITE)
            c.setFont("LiberationBold", 17)
            c.drawCentredString(x + 37, base + 24, label)
            if i < 4:
                c.setStrokeColor(PALE)
                c.line(x + 76, base + 34, x + 98, base + 34)
    elif kind == "owned":
        c.line(M + 18, base + 95, M + 18, base - 6)
        for row in (0, 1):
            yy = base + 76 - row * 72
            c.setFillColor(BLUE if row == 0 else PALE)
            c.roundRect(M + 17, yy, 95, 43, 6, fill=1, stroke=0)
            for i in range(3):
                c.setFillColor(WHITE)
                c.roundRect(M + 142 + i * 103, yy, 76, 43, 6, fill=1, stroke=0)
    else:
        for i, x in enumerate([M + 35, M + 236, M + 438]):
            c.setFillColor(BLUE if i == 1 else WHITE)
            c.circle(x, base + 40, 29, stroke=0, fill=1)
            if i < 2:
                c.setStrokeColor(PALE)
                c.line(x + 31, base + 40, x + 169, base + 40)
    c.setFillColor(WHITE)
    c.setFont("LiberationBold", 12)
    c.drawString(M, 105, topic["title"])
    c.setFillColor(PALE)
    c.setFont("Liberation", 9)
    c.drawString(M, 78, common["edition"])
    c.drawRightString(W - M, 78, "novalure.eu")
    c.showPage()


def brief_page(c, common, topic, locale, n, total):
    y = page(c, n, total, common, topic, locale, common["minute"], topic["title"], topic["promise"])
    labels = {"de": ["Für wen", "Wann lesen", "Werkzeug", "Ergebnis"],
              "en": ["For whom", "When to use it", "Tool inside", "Your result"],
              "es": ["Para quién", "Cuándo utilizarlo", "Herramienta", "Resultado"]}[locale]
    for idx, (label, key) in enumerate(zip(labels, ["who", "when", "artifact", "outcome"])):
        y = card(c, M, y, W - 2 * M, label, topic[key], 93, dark=idx == 3) - 12
    c.showPage()


def scene_page(c, common, topic, locale, n, total):
    y = page(c, n, total, common, topic, locale, common["scenario"], topic["sceneTitle"])
    y = paragraph(c, topic["scene"], M, y, W - 2 * M, 13, 21) - 35
    label = {"de": "Entscheidung für das Team", "en": "Decision for the team", "es": "Decisión para el equipo"}[locale]
    card(c, M, y, W - 2 * M, label, topic["sceneDecision"], 165, dark=True)
    c.showPage()


def map_page(c, common, topic, locale, n, total):
    y = page(c, n, total, common, topic, locale, common["map"],
             {"de": "Vier Übergänge. Vier sichtbare Signale.", "en": "Four transitions. Four visible signals.", "es": "Cuatro transiciones. Cuatro señales visibles."}[locale])
    for i, (transition, signal) in enumerate(topic["mapRows"], 1):
        c.setFillColor(BLUE)
        c.setFont("LiberationBold", 19)
        c.drawString(M, y - 15, f"{i:02d}")
        c.setFillColor(INK)
        c.setFont("LiberationBold", 12)
        c.drawString(M + 55, y - 12, transition)
        paragraph(c, f"{common['warning']}: {signal}", M + 55, y - 36, W - 2 * M - 55, 10.5, 16)
        c.setStrokeColor(LINE)
        c.line(M, y - 93, W - M, y - 93)
        y -= 114
    c.showPage()


def decision_page(c, common, topic, locale, n, total):
    y = page(c, n, total, common, topic, locale,
             {"de": "ENTSCHEIDUNGSREGEL", "en": "DECISION RULE", "es": "REGLA DE DECISIÓN"}[locale], topic["decisionTitle"])
    for i, (label, body) in enumerate(topic["decisionRows"]):
        y = card(c, M, y, W - 2 * M, label, body, 133 if len(body) > 160 else 117, dark=i == 0) - 16
    c.showPage()


def worksheet_page(c, common, topic, locale, n, total, fields, suffix=""):
    label = topic["title"] if not suffix else suffix
    y = page(c, n, total, common, topic, locale, common["tool"], label, common["blank"])
    usable = y - 70
    row_h = min(59, usable / len(fields))
    for idx, field in enumerate(fields):
        c.setFillColor(INK)
        c.setFont("LiberationBold", 9.7)
        c.drawString(M, y - 13, field)
        c.acroForm.textfield(
            name=f"{locale}_{topic['title'].replace(' ', '_')}_{suffix.replace(' ', '_')}_{idx}",
            tooltip=field, x=M, y=y - row_h + 7, width=W - 2 * M, height=row_h - 28,
            borderStyle="underlined", borderWidth=0.7, borderColor=LINE,
            fillColor=WHITE, textColor=INK, forceBorder=True, fontName="Helvetica", fontSize=10,
        )
        y -= row_h
    c.showPage()


def sample_page(c, common, topic, locale, n, total, fields, values, suffix=""):
    y = page(c, n, total, common, topic, locale, common["sample"], suffix or topic["title"])
    row_h = min(58, (y - 66) / len(fields))
    for idx, (field, value) in enumerate(zip(fields, values)):
        c.setFillColor(WHITE if idx % 2 == 0 else PAPER)
        c.roundRect(M, y - row_h + 4, W - 2 * M, row_h - 2, 5, fill=1, stroke=0)
        c.setFillColor(BLUE)
        c.setFont("LiberationBold", 8.5)
        c.drawString(M + 12, y - 16, field)
        paragraph(c, value, M + 12, y - 33, W - 2 * M - 24, 9.6, 13.5)
        y -= row_h
    c.showPage()


def exercise_page(c, common, topic, locale, n, total):
    y = page(c, n, total, common, topic, locale,
             {"de": "MINI-ÜBUNG", "en": "QUICK EXERCISE", "es": "EJERCICIO BREVE"}[locale], topic["exerciseTitle"])
    y = paragraph(c, topic["exercise"], M, y, W - 2 * M, 12, 19) - 31
    c.setFillColor(WHITE)
    c.roundRect(M, y - 254, W - 2 * M, 254, 8, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.setFont("LiberationBold", 10)
    c.drawString(M + 17, y - 28, common["evidence"])
    for i in range(5):
        yy = y - 65 - i * 35
        c.setStrokeColor(LINE)
        c.line(M + 18, yy, W - M - 18, yy)
        c.setFillColor(MUTED)
        c.setFont("Liberation", 9)
        c.drawString(M + 18, yy + 8, f"{i + 1:02d}")
    c.showPage()


def score_page(c, common, topic, locale, n, total):
    y = page(c, n, total, common, topic, locale, common["score"],
             {"de": "Eine Scorecard ohne Scheingenauigkeit", "en": "A scorecard without false precision", "es": "Una puntuación sin falsa precisión"}[locale], common["scoreRule"])
    for i, question in enumerate(topic["scoreQuestions"]):
        c.setFillColor(WHITE)
        c.roundRect(M, y - 59, W - 2 * M, 56, 6, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("Liberation", 10.3)
        paragraph(c, f"{i + 1}. {question}", M + 12, y - 21, W - 2 * M - 115, 10.3, 14)
        c.setFont("LiberationBold", 9)
        c.setFillColor(BLUE)
        c.drawRightString(W - M - 12, y - 37, "□ 2   □ 1   □ 0")
        y -= 66
    y -= 12
    for band in common["scoreBands"]:
        y = paragraph(c, band, M + 4, y, W - 2 * M - 8, 10.5, 16) - 8
    c.showPage()


def week_page(c, common, topic, locale, n, total):
    y = page(c, n, total, common, topic, locale, common["week"],
             {"de": "Eine Frage verbessern. Dann prüfen.", "en": "Improve one question. Then check.", "es": "Mejore una pregunta. Después compruebe."}[locale])
    for i, (label, action) in enumerate(topic["weekSteps"]):
        y = card(c, M, y, W - 2 * M, label, action, 97, dark=i == 3) - 11
    y -= 5
    paragraph(c, topic["weekResult"], M, y, W - 2 * M, 10.6, 16, "LiberationBold", BLUE)
    c.showPage()


def example_page(c, common, topic, locale, n, total):
    y = page(c, n, total, common, topic, locale, common["scenario"], topic["exampleTitle"])
    y = paragraph(c, topic["example"], M, y, W - 2 * M, 13, 21) - 40
    label = {"de": "Für Ihr Team", "en": "For your team", "es": "Para su equipo"}[locale]
    card(c, M, y, W - 2 * M, label, topic["outcome"], 120, dark=True)
    c.showPage()


def summary_page(c, common, topic, locale, n, total):
    y = page(c, n, total, common, topic, locale, common["summary"],
             {"de": "Drei Fragen reichen für den Anfang.", "en": "Start with three questions.", "es": "Empiece por tres preguntas."}[locale])
    for i, point in enumerate(topic["takeaways"], 1):
        y = card(c, M, y, W - 2 * M, f"0{i}", point, 118, dark=i == 2) - 17
    c.showPage()


def cta_page(c, common, topic, locale, n, total):
    y = page(c, n, total, common, topic, locale, common["next"], common["cta"])
    y = paragraph(c, common["ctaIntro"], M, y, W - 2 * M, 13, 21) - 34
    y = card(c, M, y, W - 2 * M, common["result"], common["further"], 125, dark=True) - 38
    c.setFillColor(BLUE)
    c.roundRect(M, y - 54, W - 2 * M, 54, 7, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont("LiberationBold", 12)
    c.drawCentredString(W / 2, y - 33, common["cta"])
    c.linkURL(common["contact"], (M, y - 54, W - M, y), relative=0)
    paragraph(c, common["privacy"], M, 112, W - 2 * M, 8.5, 13, colour=MUTED)
    c.showPage()


def build_one(locale: str, kind: str):
    common = DATA[locale]["common"]
    topic = DATA[locale][kind]
    stem = f"novalure-{STEMS[kind]}-{locale}"
    dest = OUT / f"{stem}.pdf"
    total = 15 if kind == "owned" else 13
    c = canvas.Canvas(str(dest), pagesize=A4, pageCompression=1)
    c._doc.Catalog.Lang = PDFString({"de": "de-DE", "en": "en-GB", "es": "es-ES"}[locale])
    c.setTitle(f"{topic['title']} | NovaLure")
    c.setAuthor("NovaLure")
    c.setSubject(topic["promise"])
    c.setKeywords(f"NovaLure, {topic['title']}, field guide, {locale}")
    cover(c, common, topic, kind, locale)
    brief_page(c, common, topic, locale, 2, total)
    scene_page(c, common, topic, locale, 3, total)
    map_page(c, common, topic, locale, 4, total)
    decision_page(c, common, topic, locale, 5, total)
    if kind == "owned":
        worksheet_page(c, common, topic, locale, 6, total, topic["ownerFields"],
                       {"de": "Eigentümer-Erstkontaktkarte", "en": "Seller first-contact card", "es": "Ficha inicial del propietario"}[locale])
        sample_page(c, common, topic, locale, 7, total, topic["ownerFields"], topic["ownerSample"],
                    {"de": "Eigentümerkarte", "en": "Seller card", "es": "Ficha del propietario"}[locale])
        worksheet_page(c, common, topic, locale, 8, total, topic["buyerFields"],
                       {"de": "Käufer-Erstkontaktkarte", "en": "Buyer first-contact card", "es": "Ficha inicial del comprador"}[locale])
        sample_page(c, common, topic, locale, 9, total, topic["buyerFields"], topic["buyerSample"],
                    {"de": "Käuferkarte", "en": "Buyer card", "es": "Ficha del comprador"}[locale])
        offset = 2
        worksheet_pg, sample_pg = 8, 9
    else:
        worksheet_page(c, common, topic, locale, 6, total, topic["fields"])
        sample_page(c, common, topic, locale, 7, total, topic["fields"], topic["sampleValues"])
        offset = 0
        worksheet_pg, sample_pg = 6, 7
    exercise_page(c, common, topic, locale, 8 + offset, total)
    score_page(c, common, topic, locale, 9 + offset, total)
    week_page(c, common, topic, locale, 10 + offset, total)
    example_page(c, common, topic, locale, 11 + offset, total)
    summary_page(c, common, topic, locale, 12 + offset, total)
    cta_page(c, common, topic, locale, 13 + offset, total)
    c.save()
    reader = PdfReader(dest)
    assert len(reader.pages) == total, (dest, len(reader.pages), total)
    fields = reader.get_fields() or {}
    assert len(fields) == (13 if kind == "owned" else len(topic["fields"])), (stem, len(fields))
    assert all("/AP" in a for p in reader.pages for a in (p.get("/Annots") or []) if a.get_object().get("/Subtype") == "/Widget")
    assert all(len((p.extract_text() or "")) > 100 for p in reader.pages)
    for index, target in [(1, COVERS / f"{stem}.png"),
                          (worksheet_pg, PREVIEWS / f"{stem}-worksheet.png"),
                          (sample_pg, PREVIEWS / f"{stem}-sample.png")]:
        prefix = target.with_suffix("")
        subprocess.run([str(POPPLER), "-f", str(index), "-l", str(index), "-singlefile", "-scale-to", "1200",
                        "-png", str(dest), str(prefix)], check=True, capture_output=True)
    print(f"{stem}: {total} pages, {len(fields)} fillable fields")


if __name__ == "__main__":
    for language in ("de", "en", "es"):
        for topic_key in ("project", "owned", "international"):
            build_one(language, topic_key)
