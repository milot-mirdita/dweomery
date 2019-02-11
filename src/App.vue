<template>
<div id="app">
  <nav :class="['navbar', 'navbar-expand-lg', 'navbar-light', 'bg-light', { 'fixed-top ' : inSelection } ]">
    <a class="navbar-brand" v-if="inSelection == false">
      <i v-if="spellbooks.length > 0" @click="visible = !visible" class="fas fa-bars"></i>&nbsp;Tiny Hut
    </a>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto" v-if="inSelection == false">
        <li class="nav-item" v-if="spellbooks.length > 0">
          <a @click="inBrowser = false" class="nav-link" v-if="inBrowser"><i class="fa fa-book"></i>&nbsp;Go to spellbook</a>
          <a @click="inBrowser = true" class="nav-link" v-else><i class="fa fa-grip-horizontal"></i>&nbsp;Go to browser</a>
        </li>
        <li :class="['nav-item', { 'active' : activeSpellbook == book.id }]" v-for="book in spellbooks" :key="book.id">
          <a @click="activeSpellbook = book.id;" class="nav-link">
            <div class="caster">
              <template v-if="book.inEdit == false">
                <i @click="book.inEdit = (activeSpellbook == book.id) ? true : book.inEdit;"
                  class="caster-icon" :class="{ 'active' : activeSpellbook == book.id }"></i>
                {{ book.name }}
              </template>
              <form v-else class="form-inline">
                <div class="input-group input-group-sm">
                  <div class="input-group-prepend">
                    <span @click="book.inEdit = false" class="input-group-text"><i class="far fa-check-circle"></i></span>
                  </div>
                  <input type="text" class="form-control form-control-sm" placeholder="Spell Name" v-model="book.name">
                   <div class="input-group-append">
                    <span @click.stop="removeSpellbook(book.id)" class="input-group-text"><i class="far fa-trash-alt"></i></span>
                  </div>
                </div>
              </form>
            </div>
          </a>
        </li>
        <li class="nav-item">
          <a @click="inSelection = true" class="nav-link">
            <i class="fa fa-plus-circle"></i>
          </a>
        </li>
      </ul>
      <ul class="navbar-nav mr-auto caster-selection" v-else>
        <li class="nav-item">
          <a @click="inSelection = false" class="nav-link"><i class="fa fa-stop-circle"></i></a>
        </li>
        <li class="nav-item" v-for="(value, key) in casters" :key="key">
          <a @click="addSpellbook(key)" class="nav-link">{{value}}</a>
        </li>
      </ul>
    </div>
  </nav>
  <div :class="['browser', { 'in-selection' : inSelection } ]" v-if="activeSpellbook > -1">
    <form class="filter" v-if="visible">
      <div class="form-group">
        <label for="spell-name" class="label">Search for spell</label>
        <div class="input-group input-group-sm">
        <input id="spell-name" class="form-control form-control-sm" v-model="name" />
          <div class="input-group-append">
            <span @click="searchSimilar = !searchSimilar" class="input-group-text"><i :class="['fa', 'fa-fw', searchSimilar ? 'fa-search' : 'fa-equals' ]"></i></span>
          </div>
        </div>
      </div>
      <div class="form-group" v-if="inBrowser">
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text">Level</span>
        </div>
        <input class="form-control form-control-sm" type="number" min="0" :max="maxLevel" v-model="minLevel" />
        <input class="form-control form-control-sm" type="number" :min="minLevel" max="9" v-model="maxLevel" />
      </div>
      </div>
      <div class="form-group">
        <label for="school" class="label">Spell schools</label><i v-if="school.length > 0" @click="school = []" class="fa fa-broom float-right clear"></i>
        <select id="school" class="form-control form-control-sm magic-school" v-model="school" multiple :size="schools.size">
          <option v-for="school in schools" :key="school" :value="school"><span class="magic-symbol" v-html="symbols[school]"></span>&nbsp;{{school}}</option>
        </select>
        <small>Use CTRL to select multiple schools.</small>
      </div>
      <div class="form-group">
        <label for="subschool" class="label">Subschools</label><i v-if="subschool.length > 0" @click="subschool = []" class="fa fa-broom float-right clear"></i>
        <select id="subschool" class="form-control form-control-sm" v-model="subschool" multiple :size="4">
          <option v-for="school in subschools" :key="school">{{school}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="components" class="label">Components</label><i v-if="component.length > 0" @click="component = []" class="fa fa-broom float-right clear"></i>
        <select v-model="component" id="components" class="form-control form-control-sm" multiple size="5">
          <option v-for="c in components" :key="c.kind" :value="c.kind">{{c.description}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="sort" class="label">Order by</label>
        <select v-model="order" :disabled="name.length > 0" id="sort" class="form-control form-control-sm">
          <option value="name">Name</option>
          <option value="level">Level</option>
        </select>
      </div>
    </form>
    <div :class="['spells', { 'spells-wide' : !visible }]" >
      <card v-for="name in filtered"
        :key="name"
        :in-browser="inBrowser"
        :card="spells[name]"
        :caster="currentSpellbook.caster"
        :known-spells="currentSpellbook.spells"
        @selection="addSpellToSpellbook(name)"></card>
    </div>
  </div>
  <div v-else :class="['center', { 'in-selection' : inSelection } ]">
    Add a spellbook with the&nbsp;<a @click="inSelection = true"><i class="fa fa-plus-circle"><span class="sr-only">plus</span></i></a>&nbsp;button.
  </div>
</div>
</template>

<script>
import Card from './components/Card.vue'
import Spells from './assets/spells.json'
// const Spells = {};
const SpellNames = Object.keys(Spells);
const SpellSchools = new Set([...new Set(Object.values(Spells).map(spell => spell.school))].sort());
const SpellSubschools = new Set([...new Set(Object.values(Spells).map(spell => spell.subschools).flat())].sort());
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
  "summoner_unchained" : "Summoner (unchained)",
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

var smithWaterman = function(a, b) {
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length;

  // swap to save some memory O(min(a,b)) instead of O(a)
  if(a.length > b.length) {
    var tmp = a;
    a = b;
    b = tmp;
  }

  var row = Array(a.length + 1);
  // init the row
  for(var i = 0; i <= a.length; i++){
    row[i] = 0;
  }

  // fill in the rest
  for(var i = 1; i <= b.length; i++){
    var prev = 0;
    for(var j = 1; j <= a.length; j++){
      var val;
      if(b.charAt(i-1) == a.charAt(j-1)){
        val = row[j-1] + 3; // match
      } else {
        val = Math.max(0,
              Math.max(row[j-1] - 1,  // substitution
              Math.max(prev - 1,      // insertion
                       row[j] - 1)));  // deletion
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[a.length] = prev;
  }
  return Math.max(...row);
}

import { SpellCard } from './proto'
import { length, encode, decode } from '@protobufjs/base64'

export default {
  components: {
    Card
  },
  data: function() {
    return {
        activeSpellbook: -1,
        spellbooks: [ { id: 0, caster: "sor", inEdit: false, spells: [] } ],
        visible: true,
        name: "",
        minLevel: 0,
        maxLevel: 0,
        school: [],
        subschool: [],
        component: [],
        order: "level",
        inSelection: false,
        inBrowser: true,
        searchSimilar: true
    }
  },
  created() {
    const hash = window.location.hash.substr(1);
    var buffer = new Uint8Array(length(hash))
    decode(hash, buffer, 0)
    let store = SpellCard.AppRoot.decode(buffer);

    this._persistWatchers = this._persistWatchers || []

    const names = [ 
      'activeSpellbook', 'spellbooks', 'visible',
      'name', 'minLevel', 'maxLevel',
      'school', 'subschool', 'component',
      'order', 'inSelection', 'inBrowser', 'searchSimilar'
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
            console.log(message);
            let buffer = SpellCard.AppRoot.encode(message).finish();
            history.replaceState('', '', '#' + encode(buffer, 0, buffer.length));
          }, { deep: true });
        }
    }
  },
  computed: {
    spells: () => Spells,
    schools: () => SpellSchools,
    subschools: () => SpellSubschools,
    casters: () => Casters,
    symbols: () => SchoolSymbols,
    components: () => SpellComponents,
    currentSpellbook: function() { return this.activeSpellbook >= 0 ? this.spellbooks[this.activeSpellbook] : null; },
    filtered: function() {
      if (this.activeSpellbook == -1) {
        return {};
      }
      const caster = this.currentSpellbook.caster;
      const names = this.inBrowser ? SpellNames : [...this.currentSpellbook.spells];
      var filtered = names.filter((key, index) => {
        const spell = Spells[key];
        return spell[caster] != null
          && (!this.inBrowser || (spell[caster] >= this.minLevel && spell[caster] <= this.maxLevel))
          && (this.school.length == 0 || this.school.includes(spell["school"]))
          && (this.subschool.length == 0 || [...this.subschool].filter(s => spell["subschools"].includes(s)).length > 0)
          && (this.component.length == 0 || (spell["components"].length == this.component.length && spell["components"].every(s => this.component.includes(s))))
      });

      if (this.name.length > 0) {
        const search = this.name.toLowerCase();
        if (this.name.length > 2 && this.searchSimilar) {
          return filtered.map(id => { 
            const res = { s: id, d: smithWaterman(search, Spells[id].name.toLowerCase()) };
            return res;
          }).sort((a, b) => {
            return +(a.d < b.d) || +(a.d === b.d) - 1;
          }).filter(spell => spell.d > 2).map(spell => spell.s);
        } else {
          return filtered.filter(id => {
            return Spells[id].name.toLowerCase().startsWith(search);
          })
        }
      } else {
        if (this.order == "name") {
          return filtered.sort((a, b) => {
            if (Spells[a].name < Spells[b].name)
              return -1;
            return 1;
          })
        } else {
          return filtered.sort((a, b) => {
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
      return filtered;
    }
  },
  methods: {
    addSpellbook(caster) {
      const id = this.spellbooks.length;
      this.spellbooks.push({
        id: id,
        caster: caster,
        inEdit: false,
        name: this.casters[caster],
        spells: []
      });
      this.activeSpellbook = id;
      this.inSelection = false;
    },
    removeSpellbook(id) {
      this.spellbooks = this.spellbooks.filter((book) => {
        return book.id != id;
      });
      this.activeSpellbook = -1;
      this.inBrowser = false;
      this.inSelection = false;
    },
    addSpellToSpellbook(spell) {
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
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
// @import "~bootstrap/scss/root";
@media screen {
@import "~bootstrap/scss/reboot";
}
// @import "~bootstrap/scss/type";
// @import "~bootstrap/scss/images";
// @import "~bootstrap/scss/code";
// @import "~bootstrap/scss/grid";
// @import "~bootstrap/scss/tables";
@import "~bootstrap/scss/forms";
@import "~bootstrap/scss/buttons";
// @import "~bootstrap/scss/transitions";
// @import "~bootstrap/scss/dropdown";
// @import "~bootstrap/scss/button-group";
@import "~bootstrap/scss/input-group";
// @import "~bootstrap/scss/custom-forms";
@import "~bootstrap/scss/nav";
@import "~bootstrap/scss/navbar";
// @import "~bootstrap/scss/card";
// @import "~bootstrap/scss/breadcrumb";
// @import "~bootstrap/scss/pagination";
// @import "~bootstrap/scss/badge";
// @import "~bootstrap/scss/jumbotron";
// @import "~bootstrap/scss/alert";
// @import "~bootstrap/scss/progress";
// @import "~bootstrap/scss/media";
// @import "~bootstrap/scss/list-group";
// @import "~bootstrap/scss/close";
// @import "~bootstrap/scss/toasts";
// @import "~bootstrap/scss/modal";
// @import "~bootstrap/scss/tooltip";
// @import "~bootstrap/scss/popover";
// @import "~bootstrap/scss/carousel";
// @import "~bootstrap/scss/spinners";
@import "~bootstrap/scss/utilities";
@import "~bootstrap/scss/print";

$fa-font-path: "~@fortawesome/fontawesome-free/webfonts";
@import "~@fortawesome/fontawesome-free/scss/fontawesome";
@import "~@fortawesome/fontawesome-free/scss/regular";
@import "~@fortawesome/fontawesome-free/scss/solid";

@font-face {
    font-family: 'DnDMagicSchools';
    src: url('assets/DnDMagicSchools.woff2') format('woff2'),
        url('assets/DnDMagicSchools.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  src: local('Open Sans'), local('OpenSans'), url('https://themes.googleusercontent.com/static/fonts/opensans/v5/cJZKeOuBrn4kERxqtaUH3T8E0i7KZn-EPnyo3HZu7kw.woff') format('woff');
}

@font-face {
  font-family: 'PT Sans Narrow';
  font-style: normal;
  font-weight: 400;
  src: local('PT Sans Narrow'), local('PTSans-Narrow'), url(https://fonts.gstatic.com/s/ptsansnarrow/v9/BngRUXNadjH0qYEzV7ab-oWlsbCGwR2oefDo.woff2) format('woff2');
}

#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.magic-school {
  font-family: 'DnDMagicSchools', 'Open Sans', Helvetica, Arial, sans-serif;
}

.clear {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.5);

  &:hover {
    color: #000;
  }
}

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

.in-selection {
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
    }
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

  &.spells-wide {
    width: 100vw;
  }
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
    width: 100%;
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
    &.edit {
      @extend .fa-check-circle;
    }
  }
}
</style>
