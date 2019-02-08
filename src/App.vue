<template>
<div id="app">
  <nav :class="['navbar', 'navbar-expand-lg', 'navbar-light', 'bg-light', { 'fixed-top ' : inSelection } ]">
    <a @click="filter.visible = !filter.visible" class="navbar-brand" href="#" v-if="inSelection == false"><i class="fas fa-bars"></i>&nbsp;Tiny Hut</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto" v-if="inSelection == false">
        <li class="nav-item">
          <a @click="mode = 'book'" class="nav-link" v-if="mode == 'browser'"><i class="fa fa-book"></i>&nbsp;Go to spellbook</a>
          <a @click="mode = 'browser'" class="nav-link" v-else><i class="fa fa-grip-horizontal"></i>&nbsp;Go to browser</a>
        </li>
        <li :class="['nav-item', { 'active' : activeSpellbook == book.id }]" v-for="book in spellbooks" :key="book.id">
          <a @click="activeSpellbook = book.id" class="nav-link"><i :class="['far', { 'fa-dot-circle' : activeSpellbook == book.id }, { 'fa-circle' : activeSpellbook != book.id  } ]"></i>&nbsp;{{book.description}}</a>
        </li>
        <li class="nav-item">
          <a @click="inSelection = true" class="nav-link"><i class="fa fa-plus-circle"></i></a>
        </li>
      </ul>
      <ul class="navbar-nav mr-auto caster-selection" v-else>
        <li class="nav-item">
          <a @click="inSelection = false" class="nav-link"><i class="fa fa-stop-circle"></i></a>
        </li>
        <li class="nav-item" v-for="caster in casters" :key="caster.kind">
          <a @click="addSpellbook(caster)" class="nav-link">{{caster.description}}</a>
        </li>
      </ul>
    </div>
  </nav>
  <div :class="['browser', { 'in-selection' : inSelection } ]" v-if="activeSpellbook > -1">
    <form class="filter" v-if="filter.visible">
      <div class="form-group">
        <label for="spell-name" class="label">Name</label>
        <input id="spell-name" class="form-control form-control-sm" v-model="filter.name" />
      </div>
      <div class="form-group" v-if="mode == 'browser'">
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text">Level</span>
        </div>
        <input class="form-control form-control-sm" type="number" min="0" max="9" v-model="filter.minLevel" />
        <input class="form-control form-control-sm" type="number" min="0" max="9" v-model="filter.maxLevel" />
      </div>
      </div>
      <div class="form-group">
        <label for="school" class="label">Spell schools</label><i v-if="filter.school.length > 0" @click="filter.school = []" class="fa fa-broom float-right clear"></i>
        <select id="school" class="form-control form-control-sm magic-school" v-model="filter.school" multiple :size="schools.size">
          <option v-for="school in schools" :key="school" :value="school"><span class="magic-symbol" v-html="symbols[school]"></span>&nbsp;{{school}}</option>
        </select>
        <small>Use CTRL to select or unselect schools.</small>
      </div>
      <div class="form-group">
        <label for="subschool" class="label">Subschools</label><i v-if="filter.subschool.length > 0" @click="filter.subschool = []" class="fa fa-broom float-right clear"></i>
        <select id="subschool" class="form-control form-control-sm" v-model="filter.subschool" multiple :size="4">
          <option v-for="school in subschools" :key="school">{{school}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="components" class="label">Components</label><i v-if="filter.components.length > 0" @click="filter.components = []" class="fa fa-broom float-right clear"></i>
        <select v-model="filter.components" id="components" class="form-control form-control-sm" multiple size="5">
          <option v-for="c in components" :key="c.kind" :value="c.kind">{{c.description}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="sort" class="label">Sort order</label>
        <select v-model="order" :disabled="filter.name.length > 0" id="sort" class="form-control form-control-sm">
          <option value="name">Name</option>
          <option value="level">Level</option>
        </select>
      </div>
    </form>
    <div :class="['spells', { 'spells-wide' : !filter.visible }]" >
      <card v-for="name in filtered"
        :key="name"
        :mode="mode"
        :card="spells[name]"
        :caster="spellbooks[activeSpellbook].kind"
        @selection="spellbooks[activeSpellbook].spells.add(name)"></card>
    </div>
  </div>
  <div v-else :class="['center', { 'in-selection' : inSelection } ]">
    Add a class with the plus button
  </div>
</div>
</template>

<script>
import Card from './components/Card.vue'
import Spells from './assets/spells.json'
const SpellNames = Object.keys(Spells);
const SpellSchools = new Set([...new Set(Object.values(Spells).map(spell => spell.school))].sort());
const SpellSubschools = new Set([...new Set(Object.values(Spells).map(spell => spell.subschools).flat())].sort());
const Casters = [
  { kind: "sor", description: "Sorcerer" },
  { kind: "wiz", description: "Wizard" },
  { kind: "cleric", description: "Cleric" },
  { kind: "druid", description: "Druid" },
  { kind: "ranger", description: "Ranger" },
  { kind: "bard", description: "Bard" },
  { kind: "paladin", description: "Paladin" },
  { kind: "alchemist", description: "Alchemist" },
  { kind: "summoner", description: "Summoner" },
  { kind: "summoner_unchained", description: "Summoner (unchained)" },
  { kind: "witch", description: "Witch" },
  { kind: "inquisitor", description: "Inquisitor" },
  { kind: "oracle", description: "Oracle" },
  { kind: "antipaladin", description: "Antipaladin" },
  { kind: "magus", description: "Magus" },
  { kind: "adept", description: "Adept" },
  { kind: "bloodrager", description: "Bloodrager" },
  { kind: "shaman", description: "Shaman" },
  { kind: "psychic", description: "Psychic" },
  { kind: "medium", description: "Medium" },
  { kind: "mesmerist", description: "Mesmerist" },
  { kind: "occultist", description: "Occultist" },
  { kind: "spiritualist", description: "Spiritualist" },
  { kind: "skald", description: "Skald" },
  { kind: "investigator", description: "Investigator" },
  { kind: "hunter", description: "Hunter" }
];

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

var levenshtein = function(a, b) {
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
        val = row[j-1] - 1; // match
      } else {
        val = Math.min(row[j-1] + 1,  // substitution
              Math.min(prev + 1,      // insertion
                       row[j] + 0));  // deletion
      }
      row[j - 1] = prev;
      prev = val;
    }
    row[a.length] = prev;
  }

  return row[a.length];
}

export default {
  components: {
    Card
  },
  data: function() {
    return {
        activeSpellbook: 0,
        spellbooks: [ { id: 0, kind: "sor", description: "Sorcerer", spells: new Set() } ],
        filter: {
          visible: true,
          name: "",
          minLevel: 0,
          maxLevel: 0,
          school: [],
          subschool: [],
          components: [],
        },
        order: "level",
        inSelection: false,
        mode: "browser"
    }
  },
  persist: [ 'activeSpellbook', 'spellbooks', 'filter', 'order', 'inSelection', 'mode' ],
  computed: {
    spells: () => Spells,
    schools: () => SpellSchools,
    subschools: () => SpellSubschools,
    casters: () => Casters,
    symbols: () => SchoolSymbols,
    components: () => SpellComponents,
    filtered: function() {
      const caster = this.spellbooks[this.activeSpellbook].kind;
      const names = this.mode == "book" ? [...this.spellbooks[this.activeSpellbook].spells] : SpellNames;
      var filtered = names.filter((key, index) => {
        const spell = Spells[key];
        return spell[caster] != null
          && (this.mode == "book" || (spell[caster] >= this.filter.minLevel && spell[caster] <= this.filter.maxLevel))
          && (this.filter.school.length == 0 || this.filter.school.includes(spell["school"]))
          && (this.filter.subschool.length == 0 || [...this.filter.subschool].filter(s => spell["subschools"].includes(s)).length > 0)
          && (this.filter.components.length == 0 || (spell["components"].length == this.filter.components.length && spell["components"].every(s => this.filter.components.includes(s))))
      });

      if (this.filter.name.length > 2) {
        return filtered.map(spell => { 
          return { s: spell, d: levenshtein(this.filter.name, spell) }
        }).sort((a, b) => a.d > b.d).map(spell => spell.s);
      } else {
        if (this.order == "name") {
          return filtered.sort((a, b) => {
            if (a > b) return true;
            return false;
          })
        } else {
          return filtered.sort((a, b) => {
            if (Spells[a][caster] < Spells[b][caster]) return -1;
            if (Spells[a][caster] > Spells[b][caster]) return  1;
            if (a > b) return 1;
            if (a < b) return -1;
            return 0;
          })
        }
      }
      return filtered;
    }
  },
  methods: {
    addSpellbook(caster) {
      var copy = Object.assign({}, caster);
      copy.id = this.spellbooks.length;
      copy.spells = new Set();
      this.spellbooks.push(copy);
      this.activeSpellbook = copy.id;
      this.inSelection = false;
    }
  }
}
</script>

<style lang="sass">
@import "~bootstrap/scss/bootstrap";

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
  src: local('Open Sans'), local('OpenSans'), url('http://themes.googleusercontent.com/static/fonts/opensans/v5/cJZKeOuBrn4kERxqtaUH3T8E0i7KZn-EPnyo3HZu7kw.woff') format('woff');
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

.filter {
  display: flex;
  flex-direction: column;
  width: 20vw;
  padding: 10px;
}
@media print {
  .spells {
    justify-content: flex-start !important;
  }
}

.spells {
  position: relative;
  width: 80vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-self: flex-start;

  &.spells-wide {
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
}
</style>
