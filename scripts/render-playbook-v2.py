from __future__ import annotations

from pathlib import Path
import html as html_lib
import re
import sys
import textwrap

import mistune
import yaml
from bs4 import BeautifulSoup
from PIL import Image, ImageDraw, ImageFont
from weasyprint import HTML

ROOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else Path.cwd()
SOURCE_DIR = ROOT / 'content' / 'playbooks'
OUT_DIR = ROOT / 'public' / 'playbooks'
COVER_DIR = OUT_DIR / 'covers'
OUT_DIR.mkdir(parents=True, exist_ok=True)
COVER_DIR.mkdir(parents=True, exist_ok=True)

STEMS = [
    'novalure-project-demand-de',
    'novalure-owned-demand-de',
    'novalure-international-buyers-de',
    'novalure-project-demand-en',
    'novalure-owned-demand-en',
    'novalure-international-buyers-en',
    'novalure-project-demand-es',
    'novalure-owned-demand-es',
    'novalure-international-buyers-es',
]

CSS = r'''
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; color: #101d35; font-family: Arial, Helvetica, sans-serif; }
body { background: #fff; }
section { position: relative; width: 210mm; height: 297mm; padding: 18mm 17mm 18mm 17mm; overflow: hidden; page-break-after: always; background: #fff; }
section:last-child { page-break-after: auto; }
section:not(.cover)::before { content: 'NOVALURE.   PLAYBOOK · ' attr(data-series); position: absolute; top: 8.5mm; left: 17mm; font-size: 6.6pt; font-weight: 700; letter-spacing: .08em; color: #536078; }
section:not(.cover)::after { content: attr(data-page) ' / 10'; position: absolute; right: 17mm; bottom: 8mm; font-size: 6.5pt; color: #637088; }
.page-footer { position: absolute; left: 17mm; bottom: 8mm; font-size: 6.5pt; color: #637088; }
section:not(.cover) > .page-top-line { position: absolute; top: 15.5mm; left: 17mm; right: 17mm; border-top: 1.2pt solid #b99237; }
section:not(.cover) > .page-content { position: relative; margin-top: 4mm; }
.cover { padding: 0; background: #0e1b34; color: #fff; }
.cover .inner { height: 100%; padding: 20mm 19mm 18mm 19mm; display: flex; flex-direction: column; }
.wordmark { font-size: 15pt; font-weight: 800; letter-spacing: -.04em; }
.wordmark .dot { color: #d0aa45; }
.brandline { margin-top: 2mm; font-size: 6.2pt; color: #aeb8c9; }
.seriesnote { position: absolute; top: 19mm; right: 19mm; text-align: right; font-size: 6.2pt; line-height: 1.45; color: #aeb8c9; }
.cover .kicker { margin-top: 42mm; color: #d2ad4d; font-size: 6.7pt; letter-spacing: .13em; text-transform: uppercase; font-weight: 800; }
.cover h1 { margin: 4mm 0 5mm; max-width: 162mm; font-size: 27pt; line-height: 1.03; letter-spacing: -.035em; color: #fff; }
.cover .benefit { max-width: 157mm; margin: 0; font-size: 10.3pt; line-height: 1.45; color: #dbe1ec; }
.cover .audience { margin-top: 7mm; display: flex; flex-wrap: wrap; gap: 2.2mm; }
.cover .chip { display: inline-block; padding: 1.6mm 3mm; border: .7pt solid #c7a445; border-radius: 10mm; color: #e0c16a; font-size: 6.4pt; }
.cover .foot { margin-top: auto; display: flex; justify-content: space-between; border-top: .5pt solid rgba(255,255,255,.16); padding-top: 3mm; color: #9ba8bc; font-size: 6.2pt; }
.cover a { color: #d8b84e; text-decoration: none; }
.kicker { margin: 0 0 2.2mm; color: #9d7521; font-size: 7.2pt; letter-spacing: .15em; text-transform: uppercase; font-weight: 800; }
h2 { margin: 0 0 2.5mm; font-size: 22.5pt; line-height: 1.08; letter-spacing: -.03em; color: #101d35; }
h3 { margin: 3.5mm 0 1.5mm; font-size: 13pt; line-height: 1.15; color: #101d35; }
h4 { margin: 1mm 0 1.3mm; font-size: 9.3pt; line-height: 1.18; color: #101d35; }
p { margin: 0 0 2.4mm; font-size: 8.8pt; line-height: 1.43; color: #43516d; }
.lead { margin-bottom: 4.3mm; font-size: 10.6pt; line-height: 1.44; color: #51607c; }
.scene { margin: 2.2mm 0; padding: 3mm 3.5mm; background: #f5f1e7; border-radius: 2mm; page-break-inside: avoid; }
.scene .tag { color: #a5791f; font-weight: 800; font-size: 6.2pt; letter-spacing: .07em; text-transform: uppercase; }
.scene p { margin-bottom: 0; font-size: 8.2pt; }
.cost { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin: 3mm 0; }
.cost .item { border-top: 1pt solid #c4a14c; padding-top: 2.4mm; }
.cost .item p { font-size: 8.3pt; }
.leakrow { display: grid; grid-template-columns: repeat(9, auto); align-items: center; gap: 1mm; margin: 3.5mm 0 3mm; }
.stage { min-width: 29mm; background: #101d35; color: #fff; border-radius: 1.7mm; padding: 2.4mm 1.8mm; text-align: center; }
.stage .n { display: block; color: #d3ad49; font-size: 6.3pt; font-weight: 800; }
.stage .t { display: block; font-size: 7pt; font-weight: 700; }
.arrow { color: #a67d25; font-weight: 800; }
.leaks { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2mm; }
.leak { padding: 2.4mm; background: #f5f1e7; border-radius: 1.6mm; min-height: 42mm; }
.leak b { color: #b22b27; font-size: 6.4pt; text-transform: uppercase; }
.leak p { margin-top: 1.5mm; font-size: 6.8pt; line-height: 1.35; }
.criteria, .principle { margin: 2.1mm 0; padding: 2.5mm 3mm; border-left: 3pt solid #2f9b68; background: #f3f8f5; border-radius: 1mm; }
.criteria h4, .principle h4 { margin: 0 0 .8mm; }
.criteria p, .principle p { margin: 0; font-size: 7.7pt; }
.principle { display: grid; grid-template-columns: 11mm 1fr; gap: 2.5mm; border-left-color: #c59b37; background: #f8f4e9; }
.principle .num { color: #a7781e; font-size: 17pt; font-weight: 800; }
.sysnote, .note, .evnote { padding: 3mm 3.4mm; background: #f6f1e4; border-radius: 1.5mm; color: #59647a; font-size: 7.7pt; line-height: 1.4; }
.scorecard table, table.scorecard { width: 100%; border-collapse: collapse; margin-top: 3mm; font-size: 7.5pt; }
table { width: 100%; border-collapse: collapse; margin: 2.5mm 0; font-size: 7.3pt; }
th { background: #101d35; color: #fff; padding: 2.2mm; text-align: left; font-weight: 700; }
td { border-bottom: .5pt solid #d4d9e1; padding: 1.8mm 2mm; color: #43516d; vertical-align: top; }
td:not(:nth-child(2)), th:not(:nth-child(2)) { text-align: center; }
td:nth-child(2), th:nth-child(2) { text-align: left; }
td .box, .box { display: inline-block; width: 4.2mm; height: 4.2mm; border: .8pt solid #8796ae; border-radius: .7mm; }
.bands { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; margin: 3mm 0; }
.band { padding: 3mm; border-radius: 1.8mm; min-height: 34mm; }
.band.y, .y { background: #e7f4ec; color: #226f49; }
.band.r, .r { background: #fae8e5; color: #b12824; }
.band.g, .g { background: #f7efd9; color: #8b6719; }
.band b { display: block; margin-bottom: 1.5mm; font-size: 9.5pt; }
.band p { color: inherit; font-size: 8.1pt; }
.case { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; margin: 3.5mm 0; }
.case .before, .case .change, .case .after, .case .panel { padding: 3mm; border-radius: 1.5mm; background: #faece9; }
.case .change { background: #f5edd8; }
.case .after { background: #e6f3eb; }
.case h4 { text-transform: uppercase; font-size: 6.5pt; letter-spacing: .08em; }
.quote { margin: 3mm 0; padding: 4mm; background: #f5f1e7; border-left: 3pt solid #c29a3c; font-size: 9.2pt; line-height: 1.42; color: #25324a; }
.checkgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin: 3mm 0; }
.checkgrid .panel { padding: 3mm; border: .5pt solid #d9dee5; border-radius: 1.5mm; }
.checkgrid h4 { color: #101d35; }
.checkgrid ul, ul { margin: 1mm 0 0; padding-left: 5mm; }
li { margin: 0 0 1.4mm; font-size: 7.8pt; line-height: 1.38; color: #43516d; }
.summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3mm; margin: 3mm 0; }
.summary .panel { padding: 3mm; background: #f5f1e7; border-radius: 1.5mm; }
.ctamain { margin-top: 6mm; padding: 5mm; background: #101d35; border-radius: 2mm; color: #fff; }
.ctamain h3 { margin: 0 0 2mm; color: #fff; font-size: 16pt; }
.ctamain p { color: #dbe1ec; }
.ctamain .btn { display: inline-block; margin-top: 2mm; padding: 2.5mm 4mm; border-radius: 8mm; background: #d5ad43; color: #101d35; font-weight: 800; font-size: 7pt; }
.ctasoft { margin-top: 3mm; font-size: 7.2pt; color: #58647b; }
.legal { position: absolute; left: 17mm; right: 17mm; bottom: 18mm; font-size: 5.8pt; line-height: 1.35; color: #7b8597; }
.who { font-weight: 700; color: #101d35; }
.ph, .ic { font-weight: 800; color: #9c7420; }
a { color: #9c7420; text-decoration: none; }
'''

markdown = mistune.create_markdown(escape=False)


def parse_frontmatter(text: str):
    if not text.startswith('---\n'):
        return {}, text
    _, fm, body = text.split('---', 2)
    return yaml.safe_load(fm) or {}, body.lstrip()


def normalize_sections(body: str, series: str) -> str:
    rendered = markdown(body)
    soup = BeautifulSoup(rendered, 'html.parser')
    sections = soup.find_all('section')
    if len(sections) != 10:
        raise RuntimeError(f'Expected 10 sections, found {len(sections)}')
    for i, section in enumerate(sections, 1):
        section['data-page'] = str(i)
        section['data-series'] = series.upper()
        if 'cover' not in (section.get('class') or []):
            top = soup.new_tag('div')
            top['class'] = ['page-top-line']
            section.insert(0, top)
            wrapper = soup.new_tag('div')
            wrapper['class'] = ['page-content']
            # move all nodes except top into wrapper
            for node in list(section.contents)[1:]:
                wrapper.append(node.extract())
            section.append(wrapper)
            footer = soup.new_tag('div')
            footer['class'] = ['page-footer']
            footer.string = 'NovaLure · novalure.eu'
            section.append(footer)
    return ''.join(str(s) for s in sections)


def html_document(meta: dict, body: str) -> str:
    lang = meta.get('lang', 'en')
    series = meta.get('series', '')
    sections = normalize_sections(body, series)
    return f'''<!doctype html><html lang="{html_lib.escape(lang)}"><head><meta charset="utf-8"><style>{CSS}</style></head><body>{sections}</body></html>'''


def find_font(bold=False):
    candidates = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf' if bold else '/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf',
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return candidate
    raise RuntimeError('No suitable system font found')


def fit_multiline(draw, text, box, max_size, min_size, bold=False, line_spacing=1.04):
    x, y, w, h = box
    font_path = find_font(bold)
    words = text.split()
    for size in range(max_size, min_size - 1, -1):
        font = ImageFont.truetype(font_path, size)
        lines = []
        current = ''
        for word in words:
            test = f'{current} {word}'.strip()
            if draw.textbbox((0, 0), test, font=font)[2] <= w:
                current = test
            else:
                if current: lines.append(current)
                current = word
        if current: lines.append(current)
        line_h = int(size * line_spacing)
        if len(lines) * line_h <= h:
            return font, lines, line_h
    font = ImageFont.truetype(font_path, min_size)
    return font, [text], int(min_size * line_spacing)


def draw_cover(meta: dict, body: str, out: Path):
    soup = BeautifulSoup(markdown(body), 'html.parser')
    cover = soup.find('section', class_='cover')
    title = cover.find('h1').get_text(' ', strip=True)
    benefit = cover.find(class_='benefit').get_text(' ', strip=True)
    kicker = cover.find(class_='kicker').get_text(' ', strip=True)
    seriesnote = cover.find(class_='seriesnote').get_text('\n', strip=True)
    chips = [x.get_text(' ', strip=True) for x in cover.select('.chip')]
    foots = [x.get_text(' ', strip=True) for x in cover.select('.foot span')]

    img = Image.new('RGB', (1200, 1697), '#0e1b34')
    draw = ImageDraw.Draw(img)
    white = '#ffffff'; muted = '#b8c3d4'; gold = '#d2ad4d'; light = '#dbe1ec'
    regular = find_font(False); bold = find_font(True)
    draw.text((85, 92), 'NovaLure.', font=ImageFont.truetype(bold, 34), fill=white)
    draw.text((85, 136), 'Project marketing with sales structure' if meta.get('lang')=='en' else 'Marketing de promociones con estructura comercial' if meta.get('lang')=='es' else 'Projektvermarktung mit Vertriebsstruktur', font=ImageFont.truetype(regular, 15), fill=muted)
    font, lines, lh = fit_multiline(draw, seriesnote, (760, 85, 350, 120), 18, 13, False, 1.25)
    yy=88
    for line in lines:
        draw.text((1110-draw.textbbox((0,0),line,font=font)[2],yy),line,font=font,fill=muted); yy+=lh
    draw.text((85, 370), kicker.upper(), font=ImageFont.truetype(bold, 15), fill=gold)
    font, lines, lh = fit_multiline(draw, title, (85, 430, 1010, 470), 62, 39, True, 1.05)
    yy=430
    for line in lines:
        draw.text((85, yy), line, font=font, fill=white); yy += lh
    yy += 30
    font, lines, lh = fit_multiline(draw, benefit, (85, yy, 990, 310), 24, 18, False, 1.35)
    for line in lines:
        draw.text((85, yy), line, font=font, fill=light); yy += lh
    yy += 30
    chip_font = ImageFont.truetype(bold, 13)
    cx = 85
    for chip in chips:
        tw = draw.textbbox((0,0),chip,font=chip_font)[2]
        if cx + tw + 42 > 1115:
            cx = 85; yy += 45
        draw.rounded_rectangle((cx, yy, cx+tw+34, yy+32), radius=16, outline=gold, width=2)
        draw.text((cx+17, yy+8), chip, font=chip_font, fill=gold)
        cx += tw + 48
    draw.line((85, 1570, 1115, 1570), fill='#33415b', width=1)
    foot_font=ImageFont.truetype(regular, 13)
    if foots:
        draw.text((85, 1602), foots[0], font=foot_font, fill=muted)
        if len(foots)>1:
            txt=foots[-1]; tw=draw.textbbox((0,0),txt,font=foot_font)[2]; draw.text((1115-tw,1602),txt,font=foot_font,fill=gold)
    img.save(out, 'PNG', optimize=True)


def render(stem: str):
    src = SOURCE_DIR / f'{stem}.md'
    if not src.exists():
        raise FileNotFoundError(src)
    meta, body = parse_frontmatter(src.read_text(encoding='utf-8'))
    doc = html_document(meta, body)
    pdf = OUT_DIR / f'{stem}.pdf'
    cover = COVER_DIR / f'{stem}.png'
    HTML(string=doc, base_url=str(ROOT)).write_pdf(pdf)
    draw_cover(meta, body, cover)
    print(f'generated {pdf.relative_to(ROOT)} and {cover.relative_to(ROOT)}')


for stem in STEMS:
    render(stem)
