#!/usr/bin/env python3
from openpyxl import load_workbook
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
        ('yes', '✓'), ('none', '✗'), ('no', '✗'), ('None', '✗'), ('No', '✗'),
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
    cards = []
    materials = re.compile(r"([VSMDF\/]+)\s?\((.*?)\)")
    details = re.compile(r"(\s+\(.*?\)|\s+)")
    dicedc = re.compile(r"(\d+d(\d+|%)\s?[\+\-x]?\s*\d*|DC\s*\d+|[\+\-]\d+\s+([A-Za-z]+\s+)?(\s*armor\s+)?(bonus|penalty)|[\+\-]?\d+\s+AC|AC\s+\d+|(\d+,)?\d+\s+(cp|sp|gp|pp|rounds?|feet))")
    rangeOnly = re.compile(r".*? \((.*?)\)")
    sentences = re.compile(r".+?[\.\,]")
    caster = "sor"
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

        spellName = record["name"]
        description = record["description"]
        print(spellName + " " + str(len(description)), file=sys.stderr)

        spellCaster = record[caster]
        if spellCaster == "NULL":
            continue
        card = {}
        card["count"] = 1
        school = record["school"]
        card["color"] = school_colors[school.lower()]
        card["icon"] = "white-book-" + spellCaster
        card["icon_back"] = "robe"

        mats = ""
        for m in materials.finditer(record["components"]):
            mats = mats + " <strong>" + m.group(1) + "</strong> " + m.group(2).capitalize() + "."

        pages = []
        if len(description) > 500 and len(description) < 670:
            pages.append("<span style=\"font-size:7pt\">" + description + mats + "</span>")
        else:
            page = ""
            currentPageLength = 0
            foundSentence = False
            for m in sentences.finditer(description):
                foundSentence = True
                sentence = m.group(0) 
                length = len(sentence)
                maxLength = 650
                if len(pages) == 0:
                    maxLength = 500
                if currentPageLength + length >= maxLength:
                    pages.append(page)
                    page = ""
                    currentPageLength = 0
                page = page + sentence
                currentPageLength = len(page)
            if foundSentence == False:
                page = description
            if page != "":
                pages.append(page)
            pages[-1] = pages[-1] + mats 

        for idx, page in enumerate(pages):
            if len(pages) > 1:
                card["title"] = spellName + " " + str(idx + 1) + "/" + str(len(pages))
            else:
                card["title"] = spellName
            if len(card["title"]) > 22:
                card["title_size"] = "10"
            page = dicedc.sub(r"<strong>\1</strong>", page)
            card["contents"] = []
            if idx == 0:
                subschool = record["subschool"]
                components = "<span style=\"float: right; font-size: 8pt; font-variant: normal; letter-spacing: normal; margin-top: 2px;\">" + details.sub('', record["components"]) + "</span>"
                if subschool != "":
                    card["contents"].append("section | " + school.title() + ", " + subschool.title() + components)
                else:
                    card["contents"].append("section | " + school.title() + components)
                summary = "<span style=\"display:inline-block;\"><strong>T</strong>&#8201;" + shorten(record["casting_time"]) + "</span> "
                spellRange = record["range"]
                if spellRange != "":
                    spellRange = rangeOnly.sub(r"\1", spellRange)
                    summary = summary + "<span style=\"display:inline-block;\"><strong>R</strong>&#8201;" + shorten(spellRange) + "</span> "
                spellDuration = record["duration"]
                if spellDuration != "":
                    summary = summary + "<span style=\"display:inline-block;\"><strong>D</strong>&#8201;" + shorten(spellDuration) + "</span> "
                spellSaving = record["saving_throw"]
                spellResistance = record["spell_resistence"]
                if spellSaving != "":
                    summary = summary + "<span style=\"display:inline-block;\"><strong>S</strong>&#8201;" + shorten(spellSaving) + "</span> "
                if spellResistance != "":
                    summary = summary + "<span style=\"display:inline-block;\"><strong>X</strong>&#8201;" + shorten(spellResistance) + "</span> "
                spellArea = record["area"]
                spellTagets = record["targets"]
                combineAT = spellArea == spellTagets
                if combineAT == False and spellArea != "" and spellArea != "None":
                    summary = summary + "<span style=\"display:inline-block;\"><strong>A</strong> " + shorten(spellArea, False) + "</span> "
                if spellTagets != "" and spellTagets != "None":
                    if combineAT:
                        summary = summary + "<span style=\"display:inline-block;\"><strong>A/W</strong>&#8201;" + shorten(spellTagets, False) + "</span> "
                    else:
                        summary = summary + "<span style=\"display:inline-block;\"><strong>W</strong>&#8201;" + shorten(spellTagets, False) + "</span> "
                summary = '<span style="display:flex; justify-content:space-between; flex-wrap: wrap; padding: 0 1px;">' + summary + "</span>"
                card["contents"].append("text | " + summary)

            page = '<span style="display: block; text-align: justify">' + page + '</span>'
            card["contents"].append("text | " + conditions(page))
            card["contents"].append("fill | 1")
            cards.append(card.copy())

    print(dumps(cards, ensure_ascii=False))


readSpells('spell_full.xlsx')

