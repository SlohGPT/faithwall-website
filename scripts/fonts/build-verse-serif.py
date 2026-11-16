"""Build public/fonts/lora-semibold-latin.woff2, the serif for the app-look Lock Screen verse in the homepage mockups.

Lora (SIL OFL 1.1, Reserved Font Name "Lora"; licence in OFL-Lora.txt) is the serif the FaithWall app bundles. This makes
one static wght=600 instance, subsets it to the Latin range the site uses and renames it "FW Verse Serif": an instanced,
subsetted font is a Modified Version under the OFL and may not carry the Reserved Font Name. Glyphs stay unchanged; the
copyright and licence records are kept. Needs fonttools and brotli. Run from the repo root:

    python3 scripts/fonts/build-verse-serif.py
"""
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

SRC = 'scripts/fonts/Lora-VariableFont_wght.ttf'
OUT = 'public/fonts/lora-semibold-latin.woff2'
FAMILY = 'FW Verse Serif'
PS_NAME = 'FWVerseSerif'
UNICODES = 'U+0020-007E,U+00A0-00FF,U+0152-0153,U+2010-2015,U+2018-201F,U+2026,U+2212'

font = instantiateVariableFont(TTFont(SRC), {'wght': 600})

options = subset.Options()
options.name_IDs = ['*']  # keep copyright (0) and licence (13, 14) records
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
subsetter.subset(font)

name = font['name']
for name_id in (16, 17, 21, 22, 25):  # typographic / WWS / variations names would still say Lora
    name.removeNames(nameID=name_id)
for name_id, value in ((1, FAMILY), (2, 'Regular'), (3, f'{PS_NAME}-600-latin'), (4, FAMILY), (6, PS_NAME)):
    name.setName(value, name_id, 3, 1, 0x409)
    name.setName(value, name_id, 1, 0, 0)
for record in name.names:
    if record.nameID in (1, 3, 4, 6) and 'Lora' in record.toUnicode():
        raise SystemExit(f'name {record.nameID} still says Lora: {record.toUnicode()}')

font.flavor = 'woff2'
font.save(OUT)
print('wrote', OUT)
