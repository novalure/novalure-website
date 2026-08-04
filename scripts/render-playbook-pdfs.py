from pathlib import Path
from xml.sax.saxutils import escape

from lxml import html
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "public" / "playbooks"
LOGO = ROOT / "public" / "novalure-logo.png"
LOGO_WHITE = ROOT / "public" / "novalure-logo-white.png"
W, H = A4
M = 20 * mm


def text_content(node):
    return " ".join(node.text_content().split())


def match_class(name):
    return f"contains(concat(' ', normalize-space(@class), ' '), ' {name} ')"


def parse_book(path):
    doc = html.fromstring(path.read_text(encoding="utf-8"))
    lang = doc.xpath("string(/html/@lang)") or "en"
    cover = doc.xpath("//section[contains(@class,'cover')]")[0]
    sections = []
    for section in doc.xpath(f"//section[{match_class('section')}]"):
        h2 = section.xpath(".//h2")
        body = section.xpath(f".//p[{match_class('body')}]")
        bullets = section.xpath(f".//ul[{match_class('bullets')}]/li")
        if h2 and body:
            sections.append(
                {
                    "title": text_content(h2[0]),
                    "body": text_content(body[0]),
                    "bullets": [text_content(item) for item in bullets],
                }
            )

    return {
        "slug": path.stem,
        "lang": lang,
        "audience": "developer" if "developer" in path.name or "bautraeger" in path.name or "promotores" in path.name else "agent",
        "eyebrow": text_content(cover.xpath(".//*[contains(@class,'eyebrow')]")[0]),
        "title": text_content(cover.xpath(".//h1")[0]),
        "subtitle": text_content(cover.xpath(".//*[contains(@class,'subtitle')]")[0]),
        "promise": text_content(cover.xpath(".//*[contains(@class,'promise')]")[0]),
        "cards": [text_content(x) for x in doc.xpath(f"//*[contains(@class,'card')]/h3")],
        "sections": sections,
    }


def style(size=12, leading=16, color=colors.HexColor("#111318"), bold=False, align=0):
    return ParagraphStyle(
        "s",
        fontName="Helvetica-Bold" if bold else "Helvetica",
        fontSize=size,
        leading=leading,
        textColor=color,
        alignment=align,
        spaceAfter=0,
    )


def paragraph(text, st, width):
    p = Paragraph(escape(text), st)
    _, height = p.wrap(width, 1000)
    return p, height


def para(c, text, x, y, width, st):
    p, height = paragraph(text, st, width)
    p.drawOn(c, x, y - height)
    return y - height


def background(c, dark=False):
    c.setFillColor(colors.HexColor("#101217" if dark else "#fbfaf6"))
    c.rect(0, 0, W, H, stroke=0, fill=1)
    c.setFillColor(colors.Color(1, 0.83, 0.23, alpha=0.10))
    c.circle(W - 18 * mm, 18 * mm, 34 * mm, stroke=0, fill=1)


def footer(c, page, lang, dark=False):
    footer_text = (
        "Novalure | Projektvermarktung mit vorbereiteter Übergabe"
        if lang == "de"
        else "NovaLure | Comercialización inmobiliaria con traspaso preparado"
        if lang == "es"
        else "Novalure | Project marketing with prepared handover"
    )
    c.setFillColor(colors.HexColor("#8b93a0" if not dark else "#b8c0cc"))
    c.setFont("Helvetica", 8)
    c.drawString(M, 10 * mm, footer_text)
    c.drawRightString(W - M, 10 * mm, str(page).zfill(2))


def draw_logo(c, x, y, width, dark=False):
    logo_path = LOGO_WHITE if dark and LOGO_WHITE.exists() else LOGO
    try:
        c.drawImage(str(logo_path), x, y, width=width, height=width * 0.37, mask="auto", preserveAspectRatio=True)
    except Exception:
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 20)
        c.drawString(x, y, "novalure")


def pipeline(c, x, y, width, height, lang, audience):
    labels = (
        ["Nachfrage", "Projekt-Fit", "Qualifizierung", "Übergabe", "Vertrieb"]
        if lang == "de" and audience == "developer"
        else ["Lokale Nachfrage", "Lead Magnet", "Segmentierung", "Übergabe", "Follow-up"]
        if lang == "de"
        else ["Demanda", "Encaje", "Cualificación", "Traspaso", "Ventas"]
        if lang == "es" and audience == "developer"
        else ["Demanda local", "Recurso", "Segmentación", "Traspaso", "Seguimiento"]
        if lang == "es"
        else ["Demand", "Project Fit", "Qualification", "Handover", "Sales"]
        if audience == "developer"
        else ["Local Demand", "Lead Magnet", "Segmentation", "Handover", "Follow-up"]
    )
    c.setFillColor(colors.HexColor("#111318"))
    c.roundRect(x, y, width, height, 14, stroke=0, fill=1)
    c.setStrokeColor(colors.HexColor("#38404d"))
    c.setLineWidth(1.4)
    path = c.beginPath()
    path.moveTo(x + 32, y + height * 0.52)
    path.curveTo(x + width * 0.25, y + height * 0.92, x + width * 0.35, y + height * 0.10, x + width * 0.50, y + height * 0.52)
    path.curveTo(x + width * 0.65, y + height * 0.92, x + width * 0.75, y + height * 0.12, x + width - 32, y + height * 0.52)
    c.drawPath(path)
    for i, label in enumerate(labels):
        px = x + 42 + i * ((width - 84) / 4)
        py = y + (height * 0.63 if i % 2 == 0 else height * 0.38)
        c.setFillColor(colors.HexColor("#ffd43b"))
        c.circle(px, py, 8, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#1b1f27"))
        c.roundRect(px - 35, py - 34, 70, 18, 7, stroke=0, fill=1)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 6.8)
        c.drawCentredString(px, py - 28, label[:19])


def pipeline_leak(c, x, y, width, height, lang, audience):
    pipeline(c, x, y, width, height, lang, audience)
    c.setStrokeColor(colors.HexColor("#e05a5a"))
    c.setDash(5, 4)
    c.setLineWidth(1.8)
    c.roundRect(x + width * 0.70, y + height * 0.20, width * 0.22, height * 0.58, 10, stroke=1, fill=0)
    c.setDash()
    c.setFillColor(colors.HexColor("#2a1518"))
    c.setStrokeColor(colors.HexColor("#e05a5a"))
    c.roundRect(x + width * 0.73, y + height * 0.78, 27 * mm, 9 * mm, 4 * mm, stroke=1, fill=1)
    c.setFillColor(colors.HexColor("#ffb0b0"))
    c.setFont("Helvetica-Bold", 8)
    c.drawCentredString(x + width * 0.73 + 13.5 * mm, y + height * 0.78 + 3 * mm, "Leck" if lang == "de" else "Brecha" if lang == "es" else "Leak")

    note = (
        "Hier verliert das System Kontext - Käufertyp, Timing und Reife erreichen den Vertrieb nicht."
        if lang == "de"
        else "Aquí se pierde contexto: el tipo de comprador, el plazo y la madurez no llegan a ventas."
        if lang == "es"
        else "This is where the system loses context - buyer type, timing and readiness never reach sales."
    )
    c.setFillColor(colors.HexColor("#fff1f1"))
    c.setStrokeColor(colors.HexColor("#e8b4b4"))
    c.roundRect(x, y - 15 * mm, width, 11 * mm, 5 * mm, stroke=1, fill=1)
    p, _ = paragraph(note, style(8.7, 10.5, colors.HexColor("#6c2020"), True, 1), width - 12 * mm)
    p.drawOn(c, x + 6 * mm, y - 12 * mm)


def system_layers(c, x, y, width, height, lang):
    labels = ["Auftritt", "Nachfrage", "Qualifizierung", "Übergabe"] if lang == "de" else ["Presentación", "Demanda", "Cualificación", "Traspaso"] if lang == "es" else ["Presence", "Demand", "Qualification", "Handover"]
    c.setFillColor(colors.HexColor("#111318"))
    c.roundRect(x, y, width, height, 14, stroke=0, fill=1)
    for i, label in enumerate(labels):
        row_y = y + height - 30 - i * 32
        row_w = width - 70 - i * 28
        row_x = x + 35 + i * 14
        c.setFillColor(colors.HexColor("#ffd43b") if i == 3 else colors.HexColor("#202630"))
        c.roundRect(row_x, row_y, row_w, 20, 8, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#111318") if i == 3 else colors.white)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(row_x + 12, row_y + 7, f"{i + 1}. {label}")


def matrix(c, x, y, width, height, lang):
    c.setFillColor(colors.HexColor("#f7f4eb"))
    c.roundRect(x, y, width, height, 14, stroke=0, fill=1)
    labels = ["Disqualifizieren", "Prüfen", "Nurture", "Sales-ready"] if lang == "de" else ["Descartar", "Revisar", "Seguimiento", "Preparado"] if lang == "es" else ["Disqualify", "Review", "Nurture", "Sales-ready"]
    cells = [
        (x + 42, y + 35, labels[0], False),
        (x + width / 2 + 8, y + 35, labels[1], False),
        (x + 42, y + height / 2 + 8, labels[2], False),
        (x + width / 2 + 8, y + height / 2 + 8, labels[3], True),
    ]
    for cx, cy, label, dark in cells:
        cell_w = width / 2 - 58
        cell_h = height / 2 - 45
        c.setFillColor(colors.HexColor("#111318") if dark else colors.white)
        c.roundRect(cx, cy, cell_w, cell_h, 10, stroke=0, fill=1)
        c.setFillColor(colors.HexColor("#ffd43b") if dark else colors.HexColor("#111318"))
        label_style = style(9.2 if len(label) > 13 else 10.2, 12, colors.HexColor("#ffd43b") if dark else colors.HexColor("#111318"), True, 1)
        p, ph = paragraph(label, label_style, cell_w - 12)
        p.drawOn(c, cx + 6, cy + (cell_h - ph) / 2 + 1)
    c.setStrokeColor(colors.HexColor("#111318"))
    c.setLineWidth(1)
    c.line(x + 22, y + 25, x + width - 22, y + 25)
    c.line(x + 22, y + 25, x + 22, y + height - 18)
    c.setFillColor(colors.HexColor("#111318"))
    arrow = c.beginPath()
    arrow.moveTo(x + width - 22, y + 25)
    arrow.lineTo(x + width - 29, y + 29)
    arrow.lineTo(x + width - 29, y + 21)
    arrow.close()
    c.drawPath(arrow, stroke=0, fill=1)
    arrow = c.beginPath()
    arrow.moveTo(x + 22, y + height - 18)
    arrow.lineTo(x + 18, y + height - 25)
    arrow.lineTo(x + 26, y + height - 25)
    arrow.close()
    c.drawPath(arrow, stroke=0, fill=1)
    c.setFont("Helvetica-Bold", 6.5)
    x_label = "Kaufabsicht / Reife" if lang == "de" else "Intención / madurez" if lang == "es" else "Buying intent / readiness"
    y_label = "Kontext vorhanden" if lang == "de" else "Contexto disponible" if lang == "es" else "Context available"
    low = "niedrig" if lang == "de" else "bajo" if lang == "es" else "low"
    high = "hoch" if lang == "de" else "alto" if lang == "es" else "high"
    c.drawCentredString(x + width / 2 + 8, y + 8, x_label)
    c.setFillColor(colors.HexColor("#606977"))
    c.setFont("Helvetica-Bold", 5.5)
    c.drawString(x + 38, y + 15, low)
    c.drawRightString(x + width - 28, y + 15, high)
    c.saveState()
    c.translate(x + 8, y + 38)
    c.rotate(90)
    c.drawString(0, 0, low)
    c.restoreState()
    c.saveState()
    c.translate(x + 8, y + height - 43)
    c.rotate(90)
    c.drawRightString(0, 0, high)
    c.restoreState()
    c.saveState()
    c.translate(x + 10, y + height / 2)
    c.rotate(90)
    c.setFillColor(colors.HexColor("#111318"))
    c.setFont("Helvetica-Bold", 6.5)
    c.drawCentredString(0, 0, y_label)
    c.restoreState()


def bullet_boxes(c, bullets, x, y, width, dark=False, checkbox=False):
    text_color = colors.white if dark else colors.HexColor("#111318")
    box_color = colors.HexColor("#191e27") if dark else colors.white
    border_color = colors.HexColor("#303846") if dark else colors.HexColor("#e1ddd2")

    for item in bullets:
        p, ph = paragraph(item, style(9.2, 12.5, text_color), width - 34)
        box_h = max(24, ph + 14)
        if y - box_h < 22 * mm:
            # Keep the original one-page visual style, but avoid clipping by stopping
            # before the footer. Current playbook sections fit after the size tuning.
            break
        c.setFillColor(box_color)
        c.setStrokeColor(border_color)
        c.roundRect(x, y - box_h, width, box_h, 8, stroke=1, fill=1)
        c.setFillColor(colors.HexColor("#ffd43b"))
        if checkbox:
            c.setStrokeColor(colors.HexColor("#ffd43b"))
            c.roundRect(x + 7, y - 18, 7, 7, 1.5, stroke=1, fill=0)
        else:
            c.circle(x + 10, y - 13, 3.2, stroke=0, fill=1)
        p.drawOn(c, x + 23, y - box_h + 7)
        y -= box_h + 6
    return y


def scorecard_assessment(lang, audience):
    project = audience == "developer"
    if lang == "de":
        return [
            "0-2 erfüllt -> Erst Grundlagen klären, ein Check wäre verfrüht.",
            f"3-4 erfüllt -> Ein Projekt-Check macht jetzt sichtbar, wo {'Kontext' if project else 'Markt- und Leadkontext'} verloren geht.",
            f"5 erfüllt -> Ihr {'Funnel produziert Volumen, aber keine verlässliche Pipeline' if project else 'Markt erzeugt Nachfrage, aber keine verlässliche Pipeline'}. Genau dafür ist der Check.",
        ]
    if lang == "es":
        return [
            "0-2 criterios -> Aclare primero los fundamentos; el análisis sería prematuro.",
            f"3-4 criterios -> El análisis muestra dónde se pierde {'contexto' if project else 'contexto de mercado y oportunidad'}.",
            f"5 criterios -> {'El recorrido genera volumen, pero no una cartera fiable' if project else 'El mercado genera demanda, pero no una cartera fiable'}. Para eso sirve el análisis.",
        ]
    return [
        "0-2 met -> Clarify the basics first; a check would be premature.",
        f"3-4 met -> A Project Check can now reveal where {'context' if project else 'market and lead context'} is being lost.",
        f"5 met -> Your {'funnel produces volume, but not a reliable pipeline' if project else 'market produces demand, but not a reliable pipeline'}. That is exactly what the check is for.",
    ]


def draw_assessment(c, items, x, y, width, dark=False):
    fill = colors.HexColor("#191e27") if dark else colors.HexColor("#fffaf0")
    border = colors.HexColor("#303846") if dark else colors.HexColor("#e0d1d1")
    text_color = colors.HexColor("#d0d7e2") if dark else colors.HexColor("#303640")
    title_color = colors.white if dark else colors.HexColor("#111318")
    c.setFillColor(fill)
    c.setStrokeColor(border)
    box_h = 38 * mm
    c.roundRect(x, y - box_h, width, box_h, 8, stroke=1, fill=1)
    c.setFillColor(colors.HexColor("#ffd43b"))
    c.rect(x, y - box_h, 4, box_h, stroke=0, fill=1)
    c.setFillColor(title_color)
    c.setFont("Helvetica-Bold", 10)
    assessment_title = "Ihre Einschätzung:" if items[0].endswith("verfrüht.") else "Su evaluación:" if items[0].startswith("0-2 criterios") else "Your assessment:"
    c.drawString(x + 10 * mm, y - 10 * mm, assessment_title)
    row_y = y - 17 * mm
    for item in items:
        c.setStrokeColor(colors.HexColor("#9ca3af"))
        c.roundRect(x + 10 * mm, row_y - 2, 4 * mm, 4 * mm, 1, stroke=1, fill=0)
        p, ph = paragraph(item, style(8.4, 10.2, text_color), width - 25 * mm)
        p.drawOn(c, x + 17 * mm, row_y - ph + 4)
        row_y -= max(ph + 4, 8 * mm)
    return y - box_h


def draw_cards(c, cards, start_y):
    col_w = (W - 2 * M) / 2 - 5
    gap_x = 10
    gap_y = 8
    min_h = 30 * mm
    y = start_y

    for row_start in range(0, min(4, len(cards)), 2):
        row = cards[row_start : row_start + 2]
        heights = []
        paragraphs = []
        for card in row:
            p, ph = paragraph(card, style(10.2, 13.2, colors.HexColor("#111318"), True), col_w - 14 * mm)
            paragraphs.append(p)
            heights.append(max(min_h, ph + 17 * mm))
        row_h = max(heights)
        for col, p in enumerate(paragraphs):
            x = M + col * (col_w + gap_x)
            c.setFillColor(colors.white)
            c.setStrokeColor(colors.HexColor("#ded9ce"))
            c.roundRect(x, y - row_h, col_w, row_h, 8, stroke=1, fill=1)
            p.drawOn(c, x + 7 * mm, y - row_h + 8 * mm)
        y -= row_h + gap_y
    return y


def render(book):
    pdf_path = OUT_DIR / f"{book['slug']}.pdf"
    c = canvas.Canvas(str(pdf_path), pagesize=A4)
    c.setAuthor("NovaLure CLG")
    c.setTitle(book["title"])
    c.setSubject("Playbook de NovaLure" if book["lang"] == "es" else "NovaLure Playbook")
    page = 1

    background(c, dark=True)
    draw_logo(c, M, H - 35 * mm, 78 * mm, dark=True)
    c.setFillColor(colors.HexColor("#ffd43b"))
    c.setFont("Helvetica-Bold", 9)
    c.drawString(M, H - 82 * mm, book["eyebrow"].upper())
    title_style = style(30 if book["lang"] == "de" else 32, 33 if book["lang"] == "de" else 35, colors.white, True)
    y = para(c, book["title"], M, H - 91 * mm, W - 2 * M, title_style)
    y = para(c, book["subtitle"], M, y - 8, W - 2 * M - 12 * mm, style(13, 18, colors.HexColor("#d9dee8")))
    para(c, book["promise"], M, y - 12, W - 2 * M - 12 * mm, style(11, 16, colors.HexColor("#fff1aa")))
    pipeline(c, M, 32 * mm, W - 2 * M, 56 * mm, book["lang"], book["audience"])
    footer(c, page, book["lang"], dark=True)
    c.showPage()
    page += 1

    background(c)
    headline = "Ein System, kein weiterer Marketing-Ordner." if book["lang"] == "de" else "Un sistema, no otra carpeta de marketing." if book["lang"] == "es" else "A system, not another marketing folder."
    intro = (
        "Dieses Dokument ist als Arbeitsgrundlage gedacht. Es hilft Ihnen, Ihr aktuelles Setup zu prüfen, Lücken sichtbar zu machen und die nächsten operativen Schritte sauber zu priorisieren."
        if book["lang"] == "de"
        else "Este documento es una guía de trabajo para revisar la estructura actual, detectar brechas y priorizar con claridad los siguientes pasos operativos."
        if book["lang"] == "es"
        else "This document is designed as a working guide. Use it to inspect your current setup, reveal gaps and prioritize the next operating steps with more clarity."
    )
    para(c, headline, M, H - M, W - 2 * M, style(22, 26, colors.HexColor("#111318"), True))
    y = para(c, intro, M, H - M - 44, W - 2 * M - 10 * mm, style(11.2, 16.5, colors.HexColor("#303640")))
    draw_cards(c, book["cards"], y - 14)
    system_layers(c, M, 50 * mm, (W - 2 * M) / 2 - 4, 72 * mm, book["lang"])
    matrix(c, M + (W - 2 * M) / 2 + 4, 50 * mm, (W - 2 * M) / 2 - 4, 72 * mm, book["lang"])
    footer(c, page, book["lang"])
    c.showPage()
    page += 1

    for idx, section in enumerate(book["sections"], start=1):
        dark = idx % 2 == 1
        background(c, dark=dark)
        text_color = colors.white if dark else colors.HexColor("#111318")
        body_color = colors.HexColor("#d0d7e2") if dark else colors.HexColor("#303640")
        c.setFillColor(colors.HexColor("#ffd43b"))
        c.setFont("Helvetica-Bold", 11)
        c.drawString(M, H - M, str(idx).zfill(2))
        y = para(c, section["title"], M, H - M - 18, W - 2 * M, style(22, 25.5, text_color, True))
        y = para(c, section["body"], M, y - 9, W - 2 * M - 8 * mm, style(10.7, 15.8, body_color))
        title_lower = section["title"].lower()
        is_leak = "leaks" in title_lower or "brechas" in title_lower
        is_scorecard = section["title"].startswith("Mini")
        if is_leak:
            visual_h = 48 * mm
            visual_y = y - 8 - visual_h
            pipeline_leak(c, M, visual_y, W - 2 * M, visual_h, book["lang"], book["audience"])
            y = visual_y - 19 * mm
        y = bullet_boxes(c, section["bullets"], M, y - 12, W - 2 * M, dark=dark, checkbox=is_scorecard)
        if is_scorecard:
            draw_assessment(c, scorecard_assessment(book["lang"], book["audience"]), M, y - 5, W - 2 * M, dark=dark)
        footer(c, page, book["lang"], dark=dark)
        c.showPage()
        page += 1

    background(c, dark=True)
    draw_logo(c, M, H - 34 * mm, 78 * mm, dark=True)
    final_title = "Lassen Sie Ihren aktuellen Projektweg prüfen." if book["lang"] == "de" else "Analicemos su recorrido comercial actual." if book["lang"] == "es" else "Have your current project path reviewed."
    final_body = (
        "30 Minuten, ein konkretes Projekt oder eine Leadquelle, die aktuell Reibung erzeugt. Wir prüfen Projektauftritt, Lead-Qualifizierung, Übergabe und Follow-up - und Sie erhalten eine klare Einschätzung, an welcher Stelle Ihr System Kontext verliert und ob ein strukturierter Aufbau wirtschaftlich trägt. Kein Pitch, kein vollständiges Betriebshandbuch. Eine Diagnose, mit der Sie selbst entscheiden können."
        if book["lang"] == "de"
        else "En 30 minutos revisamos una promoción, una zona o una fuente de solicitudes que actualmente genera fricción. Analizamos la presentación, la cualificación, el traspaso y el seguimiento para determinar dónde se pierde contexto y si una estructura específica tiene sentido económico. Un diagnóstico útil para decidir con criterio."
        if book["lang"] == "es"
        else "30 minutes, one concrete project or lead source that currently creates friction. We review project presence, lead qualification, handover and follow-up, then give you a clear assessment of where your system loses context and whether a structured setup makes commercial sense. No pitch, no operations manual handed over for nothing. A diagnosis you can use to decide for yourself."
    )
    y = para(c, final_title, M, H - 82 * mm, W - 2 * M, style(26, 30, colors.white, True))
    y = para(c, final_body, M, y - 14, W - 2 * M - 10 * mm, style(12, 18, colors.HexColor("#d7deea")))
    c.setFillColor(colors.HexColor("#ffd43b"))
    button_y = y - 24 * mm
    c.roundRect(M, button_y, 72 * mm, 14 * mm, 7 * mm, stroke=0, fill=1)
    c.setFillColor(colors.HexColor("#111318"))
    c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(M + 36 * mm, button_y + 5 * mm, "-> novalure.eu/es" if book["lang"] == "es" else "-> novalure.eu")
    pipeline(c, M, 36 * mm, W - 2 * M, 58 * mm, book["lang"], book["audience"])
    footer(c, page, book["lang"], dark=True)
    c.save()
    print(f"Created {pdf_path.relative_to(ROOT)}")


def main():
    playbook_names = {
        "developer-pipeline-playbook-en.html",
        "bautraeger-pipeline-playbook-de.html",
        "real-estate-agent-lead-playbook-en.html",
        "makler-lead-playbook-de.html",
        "novalure-playbook-promotores-es.html",
        "novalure-playbook-agencias-inmobiliarias-es.html",
    }
    for html_path in sorted(path for path in OUT_DIR.glob("*.html") if path.name in playbook_names):
        render(parse_book(html_path))


if __name__ == "__main__":
    main()
