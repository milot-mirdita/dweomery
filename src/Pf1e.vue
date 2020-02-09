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
      <a class="navbar-brand">Dweomery</a>
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
            <button @click="inAlphaOrder = false" type="button" class="btn" :class="inAlphaOrder == false ? 'btn-dark' : 'btn-light'"><i class="fa fa-fw fa-sort-numeric-down"></i></button>
            <button @click="inAlphaOrder = true" type="button" class="btn" :class="inAlphaOrder == true ? 'btn-dark' : 'btn-light'"><i class="fa fa-fw fa-sort-alpha-down"></i></button>
          </div>
        </form>
        <form class="navbar-form" v-if="activeSpellbook > -1">
          <div class="input-group input-group-sm">
            <input class="form-control form-control-sm" v-model="query" placeholder="Spell name" type="text" />
            <div class="input-group-append">
              <span @click="searchSimilar = !searchSimilar" class="input-group-text"><i :class="['fa', 'fa-fw', searchSimilar ? 'fa-search' : 'fa-equals' ]"></i></span>
            </div>
          </div>
        </form>
        <a href="https://github.com/milot-mirdita/dweomery" class="nav-link p-0 ml-3">
          <img alt="GitHub" src="~@fortawesome/fontawesome-free/svgs/brands/github.svg" style="width:32px; height:32px;">
        </a>
      </div>
    </template>
  </nav>
  <div v-if="loading == true" class="content center">
    Please wait until spells have been loaded.
  </div>
  <div class="content browser" v-else-if="activeSpellbook > -1">
    <form class="filter">
      <div class="form-group" v-if="inBrowser">
        <label>Spell Level</label>
        <SpellLevel style="margin-top:-10px" :range="range" v-model="spellRange"></SpellLevel>
      </div>
      <selection
        name="Schools"
        v-model="school"
        :options="schools" :symbols="symbols" :colors="colors" multiple
        ></selection>
      <selection
        name="Subschools"
        v-model="subschool"
        :options="subschools" multiple empty="None"
        :collapsed="true"
        ></selection>
      <selection
        name="Casting time"
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
        name="Source books"
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
        :known-spells="shouldPrint || !inBrowser ? [] : currentSpellbook.spells"
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
import { Casters, CasterRange, SchoolSymbols, SchoolColors, SpellComponents } from './lib/constants'

import { SpellCard } from './proto'
import { length, encode, decode } from '@protobufjs/base64'

import './app.scss'

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
        location: window.location,
        spells: [],
        spellnames: [],
        schools: [],
        subschools: [],
        times: [],
        domains: [],
        patrons: [],
        bloodlines: [],
        descriptors: [],
        loading: true,
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
    import(/* webpackChunkName: "spells" */ './assets/spells.json').then(Spells => {
        Spells = Spells.default;
        this.spells = Spells;
        this.spellnames = Object.keys(Spells);
        this.schools = new Set([...new Set(Object.values(Spells).map(spell => spell.school))].sort());
        this.subschools = new Set([...new Set(Object.values(Spells).map(spell => spell.subschools).flat())].sort());
        this.times = new Set([...new Set(Object.values(Spells).map(spell => spell.tc).flat())].sort());
        this.domains = new Set([...new Set(Object.values(Spells).filter(spell => typeof(spell.domain) !== "undefined").map(spell => Object.keys(spell.domain)).flat())].sort());
        this.patrons = new Set([...new Set(Object.values(Spells).filter(spell => typeof(spell.patron) !== "undefined").map(spell => Object.keys(spell.patron)).flat())].sort());
        this.bloodlines = new Set([...new Set(Object.values(Spells).filter(spell => typeof(spell.bloodline) !== "undefined").map(spell => Object.keys(spell.bloodline)).flat())].sort());
        this.descriptors = new Set(["", ...new Set(Object.values(Spells).filter(spell => typeof(spell.descriptors) !== "undefined").map(spell => spell.descriptors).flat())].sort());
        this.loading = false;
        this.$nextTick(() => {
          if (this.shouldPrint == true) {
            this.$destroy();
            document.querySelector('nav').remove();
            document.querySelector('.filter').remove();
            window.print();
          }
        });
    });
  },
  computed: {
    casters: () => Casters,
    symbols: () => SchoolSymbols,
    colors: () => SchoolColors,
    components: () => SpellComponents,
    range: function() {
      if (this.currentSpellbook == null) {
        return { min: 0, max: 9 };
      }
      return CasterRange[this.currentSpellbook.caster];
    },
    sourcebooks: function() {
      if (this.currentSpellbook == null) {
        return {};
      }
      const caster = this.currentSpellbook.caster;
      var sources = Object.values(this.spells)
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
      const names = this.inBrowser ? this.spellnames : [...this.currentSpellbook.spells];
      var filtered = names.filter(key => {
        const spell = this.spells[key];
        return (this.school.length == 0 || this.school.includes(spell["school"]))
          && (this.subschool.length == 0 || [...this.subschool].filter(s => spell["subschools"].includes(s)).length > 0)
          && (this.descriptor.length == 0 || [...this.descriptor].filter(s => (s == "" && ("descriptors" in spell) == false) || ("descriptors" in spell && spell["descriptors"].includes(s))).length > 0)
          && (this.time.length == 0 || this.time.includes(spell["tc"]))
          && (this.component.length == 0 || (spell["components"] && spell["components"].length == this.component.length && spell["components"].every(s => this.component.includes(s))))
          && (this.sourcebook.length == 0 || this.sourcebook.includes(spell["source"]));
      });
      if (this.inBrowser) {
        filtered = filtered.filter(key => {
          const spell = this.spells[key];
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
            const res = { s: id, d: SmithWaterman(search, this.spells[id].name.toLowerCase()) };
            return res;
          }).sort((a, b) => {
            return +(a.d < b.d) || +(a.d === b.d) - 1;
          }).filter(spell => spell.d > 2).map(spell => spell.s);
        } else {
          filtered = filtered.filter(id => {
            return this.spells[id].name.toLowerCase().startsWith(search);
          })
        }
      } else {
        if (this.inAlphaOrder == true) {
          filtered = filtered.sort((a, b) => {
            if (this.spells[a].name < this.spells[b].name)
              return -1;
            return 1;
          })
        } else {
          filtered = filtered.sort((a, b) => {
            if (this.spells[a][caster] === this.spells[b][caster]) {
              if (this.spells[a].name < this.spells[b].name)
                return -1;
              return 1;
            }
            if (this.spells[a][caster] < this.spells[b][caster])
              return -1;
            return 1;
          })
        }
      }

      if (this.shouldPrint) {
        var expanded = [];
        for (var i = 0; i < filtered.length; ++i) {
          if (Array.isArray(this.spells[filtered[i]].description)) {
            const pages = this.spells[filtered[i]].description.length;
            for (var j = 0; j < pages; ++j) {
              var clone = JSON.parse(JSON.stringify(this.spells[filtered[i]]));
              clone.description = this.spells[filtered[i]].description[j];
              if (j != pages - 1) {
                clone.materials = [];
              }
              clone.expanded = true;
              expanded.push({ name: filtered[i] + '-' + j, spell: clone});
            }
          } else {
            expanded.push({ name: filtered[i] + '-' + j, spell: this.spells[filtered[i]]});
          }
        }
        return expanded;
      } else {
        return filtered.map(name => {
          return { name : name, spell: this.spells[name] }
        });
      }
    }
  },
  methods: {
    addSpellbook(caster) {
      this.inSelection = false;
      this.inEdit = false;
      // TODO: hack to fix modal overflow
      document.body.style.overflow = "auto";
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
    },
    removeSpellbook() {
      this.inSelection = false;
      this.inEdit = false;
      // TODO: hack to fix modal overflow
      document.body.style.overflow = "auto";
      this.spellbooks.splice(this.activeSpellbook, 1);
      this.activeSpellbook = -1;
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
