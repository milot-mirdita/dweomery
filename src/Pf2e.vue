<template>
<div id="app">
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand">Dweomery 2E</a>
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" v-if="spellbooks.length > 0">
          <a @click="inBrowser = false" class="nav-link" v-if="inBrowser"><i class="fa fa-fw fa-book"></i>&nbsp;Spellbook</a>
          <a @click="inBrowser = true" class="nav-link" v-else><i class="fa fa-fw fa-grip-horizontal"></i>&nbsp;Browser</a>
        </li>
        <li v-for="(book, index) in spellbooks" :key="index" class="nav-item" :class="{ 'active' : activeSpellbook == index }">
          <a @click="activeSpellbook = index;" class="nav-link">
            <div class="caster">
                <i @click="inEdit = (activeSpellbook == index)"
                  class="caster-icon" :class="{ 'active' : activeSpellbook == index, 'edit' : activeSpellbook == index && inEdit }"></i>
                {{ book.caster }}
            </div>
          </a>
        </li>
        <li class="nav-item">
          <a @click="addSpellbook()" class="nav-link">
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
        name="Types"
        v-model="type"
        :options="types"
        ></selection>
      <selection
        name="Traditions"
        v-model="tradition"
        :options="traditions"
        ></selection>
      <selection
        name="Actions"
        v-model="action"
        :options="actions"
        ></selection>
      <selection
        name="Components"
        v-model="component"
        :options="components"
        multiple
        ></selection>
      <selection
        name="Save"
        v-model="save"
        :options="saves"
        ></selection>
      <selection
        name="School traits"
        v-model="schoolTrait"
        :options="schoolTraits"
        :symbols="symbols" :colors="colors"
        ></selection>
      <selection
        name="Class traits"
        v-model="classTrait"
        :options="classTraits"
        ></selection>
      <selection
        name="Rarity traits"
        v-model="rarityTrait"
        :options="rarityTraits"
        ></selection>
      <selection
        name="Other traits"
        v-model="trait"
        :options="traits" multiple
        ></selection>
      <!--
      <selection
        name="Source books"
        v-model="sourcebook"
        :options="sourcebooks" multiple
        :collapsed="true"
        ></selection> -->
    </form>
    <div class="spells" v-if="filtered.length > 0 ">
      <card v-for="id in filtered"
        :key="spells[id].name"
        :card="spells[id]"
        :known-spells="shouldPrint || !inBrowser ? [] : currentSpellbook.spells"
        @selection="toggleSpell(id)"></card>
    </div>
    <div class="spells" v-else>
      No spells selected.
    </div>
  </div>
  <div v-else class="content center">
    Add a spellbook with the&nbsp;<a @click="addSpellbook()"><i class="fa fa-plus-circle"><span class="sr-only">plus</span></i></a>&nbsp;button.
  </div>
  <modal v-model="inEdit" v-if="currentSpellbook">
    <template v-slot:body>
      <form>
        <div class="form-group">
          <label for="bookname">Name</label>
          <input id="bookname" type="text" class="form-control" placeholder="Name" v-model="currentSpellbook.caster">
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-danger" @click="removeSpellbook()">Remove Spellbook</button>
    </template>
  </modal>
</div>
</template>

<script>
import Card from './components/Card2e.vue'
import Selection from './components/Selection.vue'
import SpellLevel from './components/SpellLevel.vue'
import Modal from './components/Modal.vue'
import SmithWaterman from './lib/SmithWaterman'
import { SchoolSymbols, SchoolColors } from './lib/constants'

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
        spells: {},
        spellbooks: [],
        spellIds: [],
        query: "",
        levelRange: 401,
        type: [],
        types: [],
        tradition: [],
        traditions: [],
        action: [],
        actions: [],
        schoolTrait: [],
        schoolTraits: [],
        classTrait: [],
        classTraits: [],
        rarityTrait: [],
        rarityTraits: [],
        trait: [],
        traits: [],
        component: [],
        components: [],
        save: [],
        saves: [],
        sourcebook: [],
        inAlphaOrder: false,
        inBrowser: true,
        inEdit: false,
        searchSimilar: false,
        shouldPrint: false,
        location: window.location,
        spells: [],
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
      'type', 'tradition', 'action', 'schoolTrait', 'classTrait', 'rarityTrait', 'trait', 'component', 'save', 
      'inAlphaOrder', 'inBrowser', 'inEdit', 'searchSimilar'
    ];
    for (const name of names) {
        if (typeof store[name] !== 'undefined') {
          if (name == 'levelRange' && store[name] == -1) {
            continue;
          }
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
    import(/* webpackChunkName: "spells2e" */ './assets/spells2e.json').then(Spells => {
        Spells = Spells.default;
        this.spells = Spells;
        this.spellIds = Object.keys(Spells);
        const spellValues = Object.values(Spells);
        this.traditions = new Set([...new Set(spellValues.map(spell => { spell.traditions = spell.traditions || []; return spell.traditions }).flat())].sort());
        // this.actions = new Set([...new Set(spellValues.map(spell => { spell.actions = spell.actions || []; return spell.actions }).flat())].sort());
        this.actions = new Set(["1", "2", "3", "R", "F", "1m", "10m", "1h"]);
        this.types = new Set([...new Set(spellValues.map(spell => spell.type))].sort());
        this.components = new Set([...new Set(spellValues.map(spell => { spell.components = spell.components || []; return spell.components }).flat())].sort().reverse());
        this.saves = new Set([...new Set(spellValues.map(spell => { spell.save_filter = spell.save_filter || []; return spell.save_filter }).flat())].sort());
        this.schoolTraits = new Set(["Abjuration","Conjuration","Divination","Enchantment","Evocation","Illusion","Necromancy","Transmutation"]);
        this.classTraits = new Set(["Bard","Champion","Cleric","Druid","Monk","Sorcerer","Wizard"]);
        this.rarityTraits = new Set(["Uncommon","Rare"]);
        this.traits = new Set([...new Set(spellValues.map(spell => spell.traits).flat())].sort());

        [...this.schoolTraits, ...this.classTraits, ...this.rarityTraits].forEach(trait => this.traits.delete(trait)); 
        
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
    symbols: () => SchoolSymbols,
    colors: () => SchoolColors,
    range: () => { return { min: 1, max: 10 } },
    sourcebooks: function() {
      // if (this.currentSpellbook == null) {
        return {};
      // }
      // var sources = Object.values(this.spells)
      //   .filter(spell => spell.level >= 0)
      //   .map(spell => spell.source).flat();
      // var counter = {};
      // var i = sources.length;
      // while (i--) {
      //   if (counter.hasOwnProperty(sources[i])) {
      //     counter[sources[i]][1]++;
      //   } else {
      //     counter[sources[i]] = [sources[i], 1];
      //   }
      // }
      // return Object.values(counter).sort(function(a, b) {
      //   return b[1] - a[1];
      // }).map(function(value) {
      //   return value[0];
      // });
    },
    spellRange: {
      get: function() {
        var min = this.levelRange % 100;
        var max = Math.floor(this.levelRange / 100) % 100;
        return [min, max];
      },
      set: function(value) {
        this.levelRange = value[1] * 100 + value[0];
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
      const ids = this.inBrowser ? this.spellIds : [...this.currentSpellbook.spells];
      var filtered = ids.filter(id => {
        const spell = this.spells[id];
        return (this.inBrowser == false || (spell.level >= this.spellRange[0] && spell.level <= this.spellRange[1]))
          && (this.type.length == 0 || this.type.includes(spell.type))
          && (this.tradition.length == 0 || [...this.tradition].filter(s => spell.traditions.includes(s)).length > 0)
          && (this.action.length == 0 || [...this.action].filter(s => spell.actions.includes(s)).length == this.action.length)
          && (this.component.length == 0 || (spell.components && spell.components.length == this.component.length && spell.components.every(s => this.component.includes(s))))
          && (this.save.length == 0 || [...this.save].filter(s => spell.save_filter.includes(s)).length > 0)
          && (this.schoolTrait.length == 0 || [...this.schoolTrait].filter(s => spell.traits.includes(s)).length > 0)
          && (this.classTrait.length == 0 || [...this.classTrait].filter(s => spell.traits.includes(s)).length > 0)
          && (this.rarityTrait.length == 0 || [...this.rarityTrait].filter(s => spell.traits.includes(s)).length > 0)
          && (this.trait.length == 0 || [...this.trait].filter(s => spell.traits.includes(s)).length > 0);
      });

      if (this.query.length > 0) {
        const search = this.query.toLowerCase();
        if (this.query.length > 2 && this.searchSimilar) {
          filtered = filtered.reduce((accumulator, id) => {
            const distance = SmithWaterman(search, this.spells[id].name.toLowerCase());
            if (distance > 2) {
              accumulator.push([id, distance]);
            }
          }, []).sort((a, b) => {
            return +(a[1] < b[1]) || +(a[1] === b[1]) - 1;
          }).map(pair => pair[0]);
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
            if (this.spells[a].level === this.spells[b].level) {
              if (this.spells[a].name < this.spells[b].name)
                return -1;
              return 1;
            }
            if (this.spells[a].level < this.spells[b].level)
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
      }
      return filtered;
    }
  },
  methods: {
    addSpellbook() {
      this.inEdit = false;
      // TODO: hack to fix modal overflow
      document.body.style.overflow = "auto";
      this.spellbooks.push({
        caster: "Book ",
        spells: [],
      });
      this.activeSpellbook = this.spellbooks.length - 1;
    },
    removeSpellbook() {
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
        this.currentSpellbook.spells.push(spell | 0);
      }
    }
  }
}
</script>
