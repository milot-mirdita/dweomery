#!/usr/bin/env python3
from openpyxl import load_workbook
from titlecase import titlecase
from json import dumps
import sys
import re

school_colors = {}
school_colors["abjuration"] = "LightSteelBlue"
school_colors["conjuration"] = "MidnightBlue"
school_colors["divination"] = "indigo"
school_colors["enchantment"] = "DarkOliveGreen"
school_colors["evocation"] = "maroon"
school_colors["illusion"] = "DarkSalmon"
school_colors["necromancy"] = "dimgray"
school_colors["transmutation"] = "DarkGoldenrod"
school_colors["universal"] = "Gold"
school_colors["see text"] = "LightSteelBlue"

classes = [
    "sor",
    "wiz",
    "cleric",
    "druid",
    "ranger",
    "bard",
    "paladin",
    "alchemist",
    "summoner",
    "witch",
    "inquisitor",
    "oracle",
    "antipaladin",
    "magus",
    "adept",
    "bloodrager",
    "shaman",
    "psychic",
    "medium",
    "mesmerist",
    "occultist",
    "spiritualist",
    "skald",
    "investigator",
    "hunter",
    "summoner_unchained"
]

one = re.compile(r"\b(one)\b")
hitdieless = re.compile(r"(\d+)\s+HD\s+or\s+less")
hitdiemore = re.compile(r"(\d+)\s+HD\s+or\s+more")
def shorten(val, aggressive = True):
    mapping = [ 
        ('caster level', 'level'), ('levels', 'cl'), ('level', 'cl'),  ('ft.', 'ft'), ('rounds', 'rd'), ('round', 'rd'),
        ('min.', 'min'), ('minutes', 'min'), ('minute', 'min'), ('hours', 'h'), ('hour', 'h'), ('maximum', 'max'), ('minimum', 'min'),
        ('instantaneous', 'instant'), ('Concentration', 'conc.'), ('concentration', 'conc.'),
        ('two', '2'), ('three', '3'),
        ('creature or creatures', 'creature(s)')
    ]

    for k, v in mapping:
        val = val.replace(k, v)

    val = one.sub('1', val)
    val = hitdiemore.sub('≥&#8201;\g<1>&#8201;HD', val)
    val = hitdieless.sub('≤&#8201;\g<1>&#8201;HD', val)

    if aggressive == False:
        return val

    mapping = [ 
        (' cl', 'cl'), (' ft', 'ft'), (' rd', 'rd'), (' min', 'min'), 
        ('unlimited', '∞'), ('permanent', '∞'), (' per ', '/'), (' (D)', '; D'),
        ('until discharged', 'discharge'), (' or discharged', '/discharge' ), ('or until', 'or'),
        (' standard action', 'std'), (' action ', ''), (' action', ''),
        ('; see text', '…'), (', see text', '…'), ('; see below', '…'), (', see below', '…'), (' (see below)', '…'), (' (see text)', '…'), ('see text', '…'), ('see below', '…'), ('see Text', '…'),
        (' (object)', '; obj.'), (' (harmless)', '; safe'), (' (harmless, object)', '; safe, obj.'),
        (' (if interacted with)', ', interact'),
        ('none', 'no'), ('None', 'no' ), ('No', 'no'),
        ('Fortitude', 'Fort.'), ('Reflex', 'Ref.'), ('Fort. negates', '<del>Fort.</del>'), ('Will negates', '<del>Will</del>'), ('Ref. negates', '<del>Ref.</del>'),
        ('Fort. partial', '<i>Fort.</i>'), ('Will partial', '<i>Will</i>'), ('Ref. partial', '<i>Ref.</i>'),
        ('.…', '…'), (' and …', '…'), (' + ', '+')
    ]

    for k, v in mapping:
        val = val.replace(k, v)
    return val

def conditions(val):
    mapping = [
        ('Bleed', '<strong>Bleed</strong>',), ('bleed', '<strong>bleed</strong>'), ('Blinded', '<strong>Blinded</strong>',), ('blinded', '<strong>blinded</strong>'), ('Broken', '<strong>Broken</strong>',), ('broken', '<strong>broken</strong>'),
        ('Confused', '<strong>Confused</strong>',), ('confused', '<strong>confused</strong>'), ('Cowering', '<strong>Cowering</strong>',), ('cowering', '<strong>cowering</strong>'), ('Dazed', '<strong>Dazed</strong>',), ('dazed', '<strong>dazed</strong>'), ('Dazzled', '<strong>Dazzled</strong>',), ('dazzled', '<strong>dazzled</strong>'),
        ('Dead', '<strong>Dead</strong>',), 
        ('undead', 'RECOVER'), ('dead', '<strong>dead</strong>'), ('RECOVER', 'undead'),
        ('Deafened', '<strong>Deafened</strong>',), ('deafened', '<strong>deafened</strong>'), ('Disabled', '<strong>Disabled</strong>',), ('disabled', '<strong>disabled</strong>'), ('Dying', '<strong>Dying</strong>',), ('dying', '<strong>dying</strong>'),
        ('Energy Drained', '<strong>Energy Drained</strong>',), ('energy drained', '<strong>energy drained</strong>'), ('Entangled', '<strong>Entangled</strong>',), ('entangled', '<strong>entangled</strong>'), ('Exhausted', '<strong>Exhausted</strong>',), ('exhausted', '<strong>exhausted</strong>'),
        ('Fascinated', '<strong>Fascinated</strong>',), ('fascinated', '<strong>fascinated</strong>'), ('Fatigued', '<strong>Fatigued</strong>',), ('fatigued', '<strong>fatigued</strong>'),
        ('Flat-Footed', '<strong>Flat-Footed</strong>',), ('flat-footed', '<strong>flat-footed</strong>'), ('flat footed', '<strong>flat footed</strong>'), ('Frightened', '<strong>Frightened</strong>',), ('frightened', '<strong>frightened</strong>'), ('Grappled', '<strong>Grappled</strong>',), ('grappled', '<strong>grappled</strong>'),
        ('Helpless', '<strong>Helpless</strong>',), ('helpless', '<strong>helpless</strong>'), ('Incorporeal', '<strong>Incorporeal</strong>',), ('incorporeal', '<strong>incorporeal</strong>'), ('Invisible', '<strong>Invisible</strong>',), ('invisible', '<strong>invisible</strong>'), ('Nauseated', '<strong>Nauseated</strong>',), ('nauseated', '<strong>nauseated</strong>'),
        ('Panicked', '<strong>Panicked</strong>',), ('panicked', '<strong>panicked</strong>'), ('Paralyzed', '<strong>Paralyzed</strong>',), ('paralyzed', '<strong>paralyzed</strong>'), ('Petrified', '<strong>Petrified</strong>',), ('petrified', '<strong>petrified</strong>'), ('Pinned', '<strong>Pinned</strong>',), ('pinned', '<strong>pinned</strong>'),
        ('Prone', '<strong>Prone</strong>',), ('prone', '<strong>prone</strong>'), ('Shaken', '<strong>Shaken</strong>',), ('shaken', '<strong>shaken</strong>'), ('Sickened', '<strong>Sickened</strong>',), ('sickened', '<strong>sickened</strong>'), ('Sinking', '<strong>Sinking</strong>',), ('sinking', '<strong>sinking</strong>'),
        ('Stable', '<strong>Stable</strong>',), ('stable', '<strong>stable</strong>'), ('Staggered', '<strong>Staggered</strong>',), ('staggered', '<strong>staggered</strong>'), ('Stunned', '<strong>Stunned</strong>',), ('stunned', '<strong>stunned</strong>'), ('Unconscious', '<strong>Unconscious</strong>',), ('unconscious', '<strong>unconscious</strong>')
    ]
    for k, v in mapping:
        val = val.replace(k, v)
    return val

def readSpells(file):
    wb = load_workbook(filename = file, read_only=True)
    spellSheet = wb.sheetnames[0]
    r = wb[spellSheet]
    rows = r.rows
    first_row = [cell.value for cell in next(rows)]
    cards = {}
    materials = re.compile(r"([VSMDF\/]+)\s?\((.*?)\)")
    details = re.compile(r"(\s+\(.*?\)|\s+)")
    dicedc = re.compile(r"(\d+d(\d+|%)\s?[\+\-x]?\s*\d*|DC\s*\d+|[\+\-]\d+\s+([A-Za-z]+\s+)?(\s*armor\s+)?(bonus|penalty)|[\+\-]?\d+\s+AC|AC\s+\d+|(\d+,)?\d+\s+(cp|sp|gp|pp|rounds?|feet))")
    rangeOnly = re.compile(r".*? \((.*?)\)")
    splitSubschools = re.compile(r"\s+or\s+|,\s*")
    snakeSigilSpecial = re.compile(r"(Abjuration|Conjuration|Enchantment|Evocation|Illusion|Necromancy|Transmutation):\s+(.+?)(?=\s*(Abjuration|Conjuration|Enchantment|Evocation|Illusion|Necromancy|Transmutation|$):?)")
    for row in rows:
        record = {}
        for key, cell in zip(first_row, row):
            if cell.data_type == 's':
                record[key] = cell.value.strip()
            elif cell.data_type == 'n':
                if cell.value == None:
                    record[key] = ""
                else:
                    record[key] = str(int(float(cell.value)))
            else:
                record[key] = cell.value

        card = {}
        school = record["school"]
        card["school"] = school.capitalize() 
        card["subschools"] = [ x.capitalize() for x in splitSubschools.split(record["subschool"]) ]
        card["color"] = school_colors[school.lower()]

        for c in classes:
            if record[c] == "NULL":
                card[c] = None
            card[c] = record[c]
        card["name"] = titlecase(record["name"])

        card["components_summary"] = details.sub('', record["components"])
        card["components"] = []
        if record["verbal"] != "0":
            card["components"].append("V")
        if record["somatic"] != "0":
            card["components"].append("S")
        if record["material"] != "0":
            card["components"].append("M")
        if record["focus"] != "0":
            card["components"].append("F")
        if record["divine_focus"] != "0":
            card["components"].append("DF")
        card["materials"] = []
        for m in materials.finditer(record["components"]):
            card["materials"].append({ "kind" : m.group(1), "description" : m.group(2).capitalize() })

        card["casting_time"] = shorten(record["casting_time"])
        card["range"] = shorten(rangeOnly.sub(r"\1", record["range"]))
        card["duration"] = shorten(record["duration"])
        card["saving_throw"] = shorten(record["saving_throw"])
        card["resistance"] = shorten(record["spell_resistence"])
        spellArea = record["area"]
        spellTargets = record["targets"]
        combineAT = spellArea == spellTargets
        card["area_targets"] = []
        if combineAT == False and spellArea != "" and spellArea != "None":
            card["area_targets"].append({ "kind" : "A", "description" : shorten(spellArea, False) })
        if spellTargets != "" and spellTargets != "None":
            if combineAT:
                card["area_targets"] = [{ "kind" : "A/W", "description" : shorten(spellTargets, False) }]
            else:
                card["area_targets"].append({ "kind" : "W", "description" : shorten(spellTargets, False) })

        record["description"] = dicedc.sub(r"<strong>\1</strong>", record["description"])
        card["description"] = conditions(record["description"])
        card["source"] = record["source"]

        if card["name"] == "Lissalan Snake Sigil":
            originalName = card["name"]
            originalDescription = card["description"].replace("There are seven variants of this spell, one for each of the Thassilonian schools of magic. Each", "This spell")
            originalDescription = snakeSigilSpecial.sub("", originalDescription)
            for m in snakeSigilSpecial.finditer(card["description"]):
                school = m.group(1)
                description = m.group(2)
                card["name"] = originalName + ", " + school
                card["school"] = school
                card["color"] = school_colors[school.lower()]
                card["description"] = description + " " + originalDescription
                cards[card["name"]] = card.copy()
            continue

        cards[card["name"]] = card.copy()

    print(dumps(cards, ensure_ascii=False))


readSpells('spell_full.xlsx')
