#!/usr/bin/env node
const yaml = require('js-yaml');
const fs = require('fs');

function cleanupAreaRangeTarget(text) {
    text = text.replace(/feet/g, 'ft');
    text = text.replace(/foot/g, 'ft');
    text = text.replace(/\(?see text\)?/g, '');
    text = text.replace(/\(?see below\)?/g, '');
    text = text.trim();
    if (text == '') {
        return null;
    }
    return text;
}

function cleanupDuration(text) {
    text = text.replace(/minutes?/g, 'min');
    text = text.replace(/hours?/g, 'h');
    text = text.replace(/\(?see text\)?/g, '');
    text = text.replace(/\(?see below\)?/g, '');
    text = text.replace(/until (the|your)/g, 'until ');
    text = text.trim();
    if (text == '') {
        return null;
    }
    return text;
}

function cleanupDescription(text) {
    text = text.replace(/(\n +)+/gm, '\n');
    text = text.trim();
    if (text == '') {
        return null;
    }
    return text;
}

function cleanupSave(text) {
    text = text.replace(/basic ?/g, '');
    text = text.replace(/\([^\)]+\)/g, '');
    text = text.trim();
    if (text == '') {
        return null;
    }
    return text.split(" or ");
}

const md = require('markdown-it')('commonmark');
var formatted = {};
yaml.load(fs.readFileSync('spells.yaml', { encoding: 'utf-8' })).spell.map((spell, index) => {
    var obj = {};
    obj.id = index;
    if (spell.type != null) obj.type = spell.type;
    if (spell.name != null) obj.name = spell.name;
    if (spell.level != null) obj.level = spell.level;
    if (spell.action_abbr != null) {
        const action = spell.action_abbr;
        obj.actions = Array.isArray(action) ? action : [action];
    }
    if (spell.components != null) obj.components = spell.components;
    if (spell.area != null) spell.area = cleanupAreaRangeTarget(spell.area);
    if (spell.area != null) obj.area = spell.area;
    if (spell.cast != null) obj.cast = spell.cast;
    if (spell.duration != null) spell.duration = cleanupDuration(spell.duration);
    if (spell.duration != null) obj.duration = spell.duration;
    if (spell.range != null) spell.range = cleanupAreaRangeTarget(spell.range);
    if (spell.range != null) obj.range = spell.range;
    if (spell.targets != null) spell.targets = cleanupAreaRangeTarget(spell.targets);
    if (spell.targets != null) obj.targets = spell.targets;
    if (spell.traditions != null) obj.traditions = spell.traditions;
    if (spell.traits != null) obj.traits = spell.traits;
    if (spell.cost != null) obj.cost = spell.cost;
    if (spell["saving throw"] != null) obj.save = spell["saving throw"];
    if (spell["saving throw"] != null) obj.save_filter = cleanupSave(spell["saving throw"]);
    if (spell.descr != null) obj.description = spell.descr;
    if (spell.cost != null) obj.description += '\n**Cost** ' + spell.cost;
    if (spell.req != null) obj.description += '\n**Requirement** ' + spell.req;
    if (spell.trigger != null) obj.description += '\n**Trigger** ' + spell.trigger;
    if (obj.description != null) obj.description = md.render(cleanupDescription(obj.description))
    if (spell.source[0].abbr != null) obj.source = spell.source[0].abbr;
    if (spell.source[0].page_start != null) obj.page = spell.source[0].page_start;
    formatted[index] = obj;
});
process.stdout.write(JSON.stringify(formatted));
