<template>
<div id="app" :class="{ 'in-selection' : inSelection }">
  <nav class="navbar navbar-expand-lg navbar-light bg-light" :class="{ 'fixed-top ' : inSelection }">
    <ul class="navbar-nav mr-auto caster-selection" v-if="inSelection">
      <li class="nav-item">
        <a @click="inSelection = false" class="nav-link"><i class="fa fa-stop-circle"></i></a>
      </li>
      <li class="nav-item" v-for="(value, key) in casters" :key="key" v-once>
        <a @click="addSpellbook(key)" class="nav-link">{{value}}</a>
      </li>
    </ul>
    <template v-else>
      <a class="navbar-brand">
        Tiny Hut
      </a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item" v-if="spellbooks.length > 0">
            <a @click="inBrowser = false" class="nav-link" v-if="inBrowser"><i class="fa fa-fw fa-book"></i>&nbsp;Spellbook</a>
            <a @click="inBrowser = true" class="nav-link" v-else><i class="fa fa-fw fa-grip-horizontal"></i>&nbsp;Browser</a>
          </li>
          <li v-for="(book, index) in spellbooks" :key="index" class="nav-item" :class="{ 'active' : activeSpellbook == index }">
            <a @click="activeSpellbook = index;" class="nav-link">
              <div class="caster">
                  <i @click="if (activeSpellbook == index) inEdit = true"
                    class="caster-icon" :class="{ 'active' : activeSpellbook == index, 'edit' : activeSpellbook == index && inEdit }"></i>
                  {{ book.name }}
              </div>
            </a>
          </li>
          <li class="nav-item">
            <a @click="inSelection = true" class="nav-link">
              <i class="fa fa-fw fa-plus-circle"></i>
            </a>
          </li>
        </ul>
        <form class="navbar-form mb-2 mb-md-0" v-if="activeSpellbook > -1">
          <div class="btn-group btn-group-sm mr-1" role="group" aria-label="Basic example">
            <a target="_blank" :href="'#print:' + location.hash.substr(1)" class="btn btn-primary"><i class="fa fa-fw fa-print"></i></a>
          </div>
          <div class="btn-group btn-group-sm mr-1" role="group" aria-label="Basic example">
            <button @click="inAlphaOrder = false" type="button" class="btn" :class="inAlphaOrder == false ? 'btn-dark' : 'btn-light'"><i class="fa fa-fw fa-sort-numeric-up"></i></button>
            <button @click="inAlphaOrder = true" type="button" class="btn" :class="inAlphaOrder == true ? 'btn-dark' : 'btn-light'"><i class="fa fa-fw fa-sort-alpha-up"></i></button>
          </div>
        </form>
        <form class="navbar-form" v-if="activeSpellbook > -1">
          <div class="input-group input-group-sm">
            <input class="form-control form-control-sm" v-model="query" placeholder="Spellname" type="text" />
            <div class="input-group-append">
              <span @click="searchSimilar = !searchSimilar" class="input-group-text"><i :class="['fa', 'fa-fw', searchSimilar ? 'fa-search' : 'fa-equals' ]"></i></span>
            </div>
          </div>
        </form>
      </div>
    </template>
  </nav>
  <div class="content browser" v-if="activeSpellbook > -1">
    <form class="filter">
      <div class="form-group" v-if="inBrowser">
        <label>Spell Level</label>
        <SpellLevel style="margin-top:-10px" v-model="spellRange"></SpellLevel>
      </div>
      <selection
        name="Schools"
        v-model="school"
        :options="schools" :symbols="symbols" multiple
        ></selection>
      <selection
        name="Subschools"
        v-model="subschool"
        :options="subschools" multiple empty="None"
        :collapsed="true"
        ></selection>
      <selection
        name="Casting Time"
        v-model="time"
        :options="times" multiple
        ></selection>
      <selection
        name="Components"
        v-model="component"
        :options="components" multiple
        ></selection>
      <selection
        name="Descriptors"
        v-model="descriptor"
        :options="descriptors" multiple
        empty="None"
        ></selection>
      <selection
        name="Sourcebooks"
        v-model="sourcebook"
        :options="sourcebooks" multiple
        :collapsed="true"
        ></selection>
    </form>
    <div class="spells" v-if="filtered.length > 0 ">
      <card v-for="spells in filtered"
        :key="spells.name"
        :card="spells.spell"
        :caster="currentSpellbook.caster"
        :known-spells="shouldPrint ? [] : currentSpellbook.spells"
        @selection="toggleSpell(spells.name)"></card>
    </div>
    <div class="spells" v-else>
      No spells selected.
    </div>
  </div>
  <div v-else class="content center">
    Add a spellbook with the&nbsp;<a @click="inSelection = true"><i class="fa fa-plus-circle"><span class="sr-only">plus</span></i></a>&nbsp;button.
  </div>
  <modal v-model="inEdit" v-if="currentSpellbook">
    <template v-slot:title>
      {{casters[currentSpellbook.caster]}}
    </template>
    <template v-slot:body>
      <form>
        <div class="form-group">
          <label for="bookname">Name</label>
          <input id="bookname" type="text" class="form-control" placeholder="Name" v-model="currentSpellbook.name">
        </div>
        <label>Extra Spells</label>
        <selection
          name="Domains"
          v-model="currentSpellbook.extraSpells.domain"
          :options="domains" multiple
          :collapsed="true"
          ></selection>
        <selection
          name="Patrons"
          v-model="currentSpellbook.extraSpells.patron"
          :options="patrons" multiple
          :collapsed="true"
          ></selection>
        <selection
          name="Bloodlines"
          v-model="currentSpellbook.extraSpells.bloodline"
          :options="bloodlines" multiple
          :collapsed="true"
          ></selection>
      </form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-danger" @click="removeSpellbook()">Remove Spellbook</button>
    </template>
  </modal>
</div>
</template>

<script>
import Card from './components/Card.vue'
import Selection from './components/Selection.vue'
import SpellLevel from './components/SpellLevel.vue'
import Modal from './components/Modal.vue'

import SmithWaterman from './lib/SmithWaterman'

import Spells from './assets/spells.json'
const SpellNames = Object.keys(Spells);
const SpellSchools = new Set([...new Set(Object.values(Spells).map(spell => spell.school))].sort());
const SpellSubschools = new Set([...new Set(Object.values(Spells).map(spell => spell.subschools).flat())].sort());
const SpellTimes = new Set([...new Set(Object.values(Spells).map(spell => spell.tc).flat())].sort());
const SpellDomains = new Set([...new Set(Object.values(Spells).filter(spell => typeof(spell.domain) !== "undefined").map(spell => Object.keys(spell.domain)).flat())].sort());
const SpellPatrons = new Set([...new Set(Object.values(Spells).filter(spell => typeof(spell.patron) !== "undefined").map(spell => Object.keys(spell.patron)).flat())].sort());
const SpellBloodlines = new Set([...new Set(Object.values(Spells).filter(spell => typeof(spell.bloodline) !== "undefined").map(spell => Object.keys(spell.bloodline)).flat())].sort());
const SpellDescriptors = new Set(["", ...new Set(Object.values(Spells).filter(spell => typeof(spell.descriptors) !== "undefined").map(spell => spell.descriptors).flat())].sort());
const Casters = {
  "sor" : "Sorcerer",
  "wiz" : "Wizard",
  "cleric" : "Cleric",
  "druid" : "Druid",
  "ranger" : "Ranger",
  "bard" : "Bard",
  "paladin" : "Paladin",
  "alchemist" : "Alchemist",
  "summoner" : "Summoner",
  "summoner_unchained" : "Unchained Summoner",
  "witch" : "Witch",
  "inquisitor" : "Inquisitor",
  "oracle" : "Oracle",
  "antipaladin" : "Antipaladin",
  "magus" : "Magus",
  "adept" : "Adept",
  "bloodrager" : "Bloodrager",
  "shaman" : "Shaman",
  "psychic" : "Psychic",
  "medium" : "Medium",
  "mesmerist" : "Mesmerist",
  "occultist" : "Occultist",
  "spiritualist" : "Spiritualist",
  "skald" : "Skald",
  "investigator" : "Investigator",
  "hunter" : "Hunter",
  "warpriest" : "Warpriest",
};

const SchoolSymbols = {
  "Abjuration" : "&#xE000;",
  "Conjuration" : "&#xE001;",
  "Divination" : "&#xE002;",
  "Enchantment" : "&#xE003;",
  "Evocation" : "&#xE007;",
  "Illusion" : "&#xE004;",
  "Necromancy" : "&#xE005;",
  "Transmutation" : "&#xE006;",
  "Universal" : "&#xE008;",
};

const SpellComponents = [
  { kind: "V", description: "Verbal" },
  { kind: "S", description: "Somatic" },
  { kind: "M", description: "Material" },
  { kind: "F", description: "Focus" },
  { kind: "DF", description: "Divine focus" },
];

import { SpellCard } from './proto'
import { length, encode, decode } from '@protobufjs/base64'

export default {
  components: {
    Card,
    Selection,
    SpellLevel,
    Modal
  },
  data: function() {
    return {
        activeSpellbook: -1,
        spellbooks: [],
        query: "",
        levelRange: 0,
        school: [],
        subschool: [],
        time: [],
        component: [],
        sourcebook: [],
        descriptor: [],
        inAlphaOrder: false,
        inSelection: false,
        inBrowser: true,
        inEdit: false,
        searchSimilar: false,
        shouldPrint: false,
        location: window.location
    }
  },
  created() {
    var hash = window.location.hash.substr(1);
    if (hash.startsWith('print:')) {
      this.shouldPrint = true;
      hash = hash.substr(6);
    }
    var buffer = new Uint8Array(length(hash))
    decode(hash, buffer, 0)
    let store = SpellCard.AppRoot.decode(buffer);

    this._persistWatchers = this._persistWatchers || []

    const names = [ 
      'activeSpellbook', 'spellbooks', 'query', 'levelRange',
      'school', 'subschool', 'component', 'time', 'sourcebook', 'descriptor',
      'inAlphaOrder', 'inSelection', 'inBrowser', 'inEdit', 'searchSimilar'
    ];
    for (const name of names) {
        if (typeof store[name] !== 'undefined') {
          this[name] = store[name]
        }

        if (this._persistWatchers.indexOf(name) === -1) {
          this._persistWatchers.push(name)

          this.$watch(name, val => {
            store[name] = val;
            let message = SpellCard.AppRoot.create(store);
            let buffer = SpellCard.AppRoot.encode(message).finish();
            history.replaceState('', '', '#' + encode(buffer, 0, buffer.length));
          }, { deep: true });
        }
    }
  },
  mounted() {
    if (this.shouldPrint == false) {
      return;
    }
    this.$destroy();
    document.querySelector('nav').remove();
    document.querySelector('.filter').remove();
  },
  computed: {
    schools: () => SpellSchools,
    subschools: () => SpellSubschools,
    casters: () => Casters,
    symbols: () => SchoolSymbols,
    times: () => SpellTimes,
    components: () => SpellComponents,
    domains: () => SpellDomains,
    patrons: () => SpellPatrons,
    bloodlines: () => SpellBloodlines,
    descriptors: () => SpellDescriptors,
    sourcebooks: function() {
      if (this.currentSpellbook == null) {
        return {};
      }
      const caster = this.currentSpellbook.caster;
      // Fixme: mixed classes
      var sources = Object.values(Spells)
        .filter(spell => spell[caster] >= 0)
        .map(spell => spell.source).flat();
      var counter = {};
      var i = sources.length;
      while (i--) {
        if (counter.hasOwnProperty(sources[i])) {
          counter[sources[i]][1]++;
        } else {
          counter[sources[i]] = [sources[i], 1];
        }
      }
      return Object.values(counter).sort(function(a, b) {
        return b[1] - a[1];
      }).map(function(value) {
        return value[0];
      });
    },
    spellRange: {
      get: function() {
        var min = this.levelRange % 10;
        var max = Math.floor(this.levelRange / 10) % 10;
        return [min, max];
      },
      set: function(value) {
        this.levelRange = value[1] * 10 + value[0];
      }
    },
    currentSpellbook: function() {
      if (this.activeSpellbook >= 0 && (this.activeSpellbook in this.spellbooks)) {
        return this.spellbooks[this.activeSpellbook];
      }
      return null;
    },
    filtered: function() {
      if (this.currentSpellbook == null) {
        return [];
      }
      const caster = this.currentSpellbook.caster;
      const isInvestigator = caster == "investigator";
      const names = this.inBrowser ? SpellNames : [...this.currentSpellbook.spells];
      var filtered = names.filter(key => {
        const spell = Spells[key];
        return (this.school.length == 0 || this.school.includes(spell["school"]))
          && (this.subschool.length == 0 || [...this.subschool].filter(s => spell["subschools"].includes(s)).length > 0)
          && (this.descriptor.length == 0 || [...this.descriptor].filter(s => (s == "" && ("descriptors" in spell) == false) || ("descriptors" in spell && spell["descriptors"].includes(s))).length > 0)
          && (this.time.length == 0 || this.time.includes(spell["tc"]))
          && (this.component.length == 0 || (spell["components"].length == this.component.length && spell["components"].every(s => this.component.includes(s))))
          && (this.sourcebook.length == 0 || this.sourcebook.includes(spell["source"]));
      });
      if (this.inBrowser) {
        filtered = filtered.filter(key => {
          const spell = Spells[key];
          return ((this.currentSpellbook.extraSpells.domain.some(d => "domain" in spell && Object.keys(spell["domain"]).some(sd => (sd == d && spell["domain"][sd] >= this.spellRange[0] && spell["domain"][sd] <= this.spellRange[1]))))
                      || (this.currentSpellbook.extraSpells.bloodline.some(d => "bloodline" in spell && Object.keys(spell["bloodline"]).some(sd => (sd == d && spell["bloodline"][sd] >= this.spellRange[0] && spell["bloodline"][sd] <= this.spellRange[1]))))
                      || (this.currentSpellbook.extraSpells.patron.some(d => "patron" in spell && Object.keys(spell["patron"]).some(sd => (sd == d && spell["patron"][sd] >= this.spellRange[0] && spell["patron"][sd] <= this.spellRange[1])))))
             || (spell[caster] >= this.spellRange[0] && spell[caster] <= this.spellRange[1]);
        });
      }

      if (this.query.length > 0) {
        const search = this.query.toLowerCase();
        if (this.query.length > 2 && this.searchSimilar) {
          filtered = filtered.map(id => {
            const res = { s: id, d: SmithWaterman(search, Spells[id].name.toLowerCase()) };
            return res;
          }).sort((a, b) => {
            return +(a.d < b.d) || +(a.d === b.d) - 1;
          }).filter(spell => spell.d > 2).map(spell => spell.s);
        } else {
          filtered = filtered.filter(id => {
            return Spells[id].name.toLowerCase().startsWith(search);
          })
        }
      } else {
        if (this.inAlphaOrder == true) {
          filtered = filtered.sort((a, b) => {
            if (Spells[a].name < Spells[b].name)
              return -1;
            return 1;
          })
        } else {
          filtered = filtered.sort((a, b) => {
            if (Spells[a][caster] === Spells[b][caster]) {
              if (Spells[a].name < Spells[b].name)
                return -1;
              return 1;
            }
            if (Spells[a][caster] < Spells[b][caster])
              return -1;
            return 1;
          })
        }
      }

      if (this.shouldPrint) {
        var expanded = [];
        for (var i = 0; i < filtered.length; ++i) {
          const pages =  Spells[filtered[i]].description.length;
          for (var j = 0; j < pages; ++j) {
            // TODO: look up how to clone
            var clone = JSON.parse(JSON.stringify(Spells[filtered[i]]));
            clone.description = Spells[filtered[i]].description[j];
            if (j != pages - 1) {
              clone.materials = [];
            }
            expanded.push({ name: filtered[i] + '-' + j, spell: clone});
          }
        }
        return expanded;
      } else {
        return filtered.map(name => {
          return { name : name, spell: Spells[name] }
        });
      }
    }
  },
  methods: {
    addSpellbook(caster) {
      this.spellbooks.push({
        caster: caster,
        name: this.casters[caster],
        spells: [],
        extraSpells: {
          domain: [],
          patron: [],
          bloodline: []
        }
      });
      this.activeSpellbook = this.spellbooks.length - 1;
      this.inSelection = false;
      this.inEdit = false;
    },
    removeSpellbook() {
      this.spellbooks.splice(this.activeSpellbook, 1);
      this.activeSpellbook = -1;
      this.inSelection = false;
      this.inEdit = false;
    },
    toggleSpell(spell) {
      const index = this.currentSpellbook.spells.indexOf(spell | 0);
      if (index > -1) {
        this.currentSpellbook.spells.splice(index, 1);
      } else {
        this.currentSpellbook.spells.push(spell | 0)
      }
    }
  }
}
</script>

<style lang="sass">
@import "common";

.center {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  flex-shrink: 1;
  flex-basis: auto;
}

.browser {
  display: flex;
  flex-direction: row;
}

.in-selection .content {
  margin-top: 56px;
}

@include media-breakpoint-down(sm) { 
  .browser {
    flex-direction: column;
    align-items: flex-start;

    .filter {
      width: 100%;
    }

    .spells {
      width: 100%;
      justify-content: center;
    }
  }

  .fixed-top {
    position: relative;
  }
}

.filter {
  display: flex;
  flex-direction: column;
  width: 275px;
  padding: 10px;
}

.spells {
  position: relative;
  width: 80vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-self: flex-start;
}

@media print {
  .browser {
    display: block;
  }
  nav, .filter {
    display: none;
  }
  .spells {
    display: table;
    width: 100vw;
  }
}

.navbar {
  a {
    cursor: pointer;
  }

  .caster-selection {
    flex-wrap: wrap;
    justify-content: center;

    a {
      font-family: 'PT Sans Narrow', sans-serif;
      white-space: nowrap;
    }
  }
  .caster {
    position: relative;
    display: inline-block;
    .form-inline {
      display: inline-block;
      margin-top: -10px;
    }
    .form-control, .input-group-text {
      height: 1.5em;
    }
  }

  .caster-icon {
    @extend .far;
    @extend .fa-fw;
    @extend .fa-circle;
    &.active {
      @extend .fa-dot-circle;
      &:hover {
        @extend .fa-edit;
      }
    }
    &.edit, &.edit.active {
      @extend .fa-edit;
    }
  }
}
</style>
