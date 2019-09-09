const Casters = {
    "sor": "Sorcerer",
    "wiz": "Wizard",
    "cleric": "Cleric",
    "druid": "Druid",
    "ranger": "Ranger",
    "bard": "Bard",
    "paladin": "Paladin",
    "alchemist": "Alchemist",
    "summoner": "Summoner",
    "summoner_unchained": "Unchained Summoner",
    "witch": "Witch",
    "inquisitor": "Inquisitor",
    "oracle": "Oracle",
    "antipaladin": "Antipaladin",
    "magus": "Magus",
    "adept": "Adept",
    "bloodrager": "Bloodrager",
    "shaman": "Shaman",
    "psychic": "Psychic",
    "medium": "Medium",
    "mesmerist": "Mesmerist",
    "occultist": "Occultist",
    "spiritualist": "Spiritualist",
    "skald": "Skald",
    "investigator": "Investigator",
    "hunter": "Hunter",
    "warpriest": "Warpriest",
};

const CasterRange = {
    sor: { min: 0, max: 9 },
    wiz: { min: 0, max: 9 },
    magus: { min: 0, max: 6 },
    bloodrager: { min: 1, max: 6 },
    summoner_unchained: { min: 0, max: 6 },
    summoner: { min: 0, max: 6 },
    inquisitor: { min: 0, max: 6 },
    cleric: { min: 0, max: 9 },
    alchemist: { min: 1, max: 6 },
    oracle: { min: 0, max: 9 },
    adept: { min: 0, max: 5 },
    shaman: { min: 0, max: 9 },
    medium: { min: 0, max: 6 },
    spiritualist: { min: 0, max: 6 },
    investigator: { min: 1, max: 6 },
    warpriest: { min: 0, max: 6 },
    druid: { min: 0, max: 9 },
    occultist: { min: 0, max: 6 },
    hunter: { min: 0, max: 6 },
    bard: { min: 0, max: 6 },
    witch: { min: 0, max: 9 },
    psychic: { min: 0, max: 9 },
    mesmerist: { min: 0, max: 6 },
    skald: { min: 1, max: 6 },
    ranger: { min: 1, max: 4 },
    antipaladin: { min: 1, max: 6 },
    paladin: { min: 1, max: 4 }
};

const SchoolSymbols = {
    "Abjuration": "&#xE000;",
    "Conjuration": "&#xE001;",
    "Divination": "&#xE002;",
    "Enchantment": "&#xE003;",
    "Evocation": "&#xE007;",
    "Illusion": "&#xE004;",
    "Necromancy": "&#xE005;",
    "Transmutation": "&#xE006;",
    "Universal": "&#xE008;",
};

const SchoolColors = {
    "Abjuration": "LightSteelBlue",
    "Conjuration": "MidnightBlue",
    "Divination": "indigo",
    "Enchantment": "DarkOliveGreen",
    "Evocation": "maroon",
    "Illusion": "DarkSalmon",
    "Necromancy": "dimgray",
    "Transmutation": "DarkGoldenrod",
    "Universal": "Gold",
    "See Text": "LightSteelBlue"
};

const SpellComponents = [
    { kind: "V", description: "Verbal" },
    { kind: "S", description: "Somatic" },
    { kind: "M", description: "Material" },
    { kind: "F", description: "Focus" },
    { kind: "DF", description: "Divine focus" },
];

export {
    Casters,
    CasterRange,
    SchoolSymbols,
    SchoolColors,
    SpellComponents
}