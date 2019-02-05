<template>
  <div id="app">
    <form class="filter">
      <div class="form-group">
        <label for="spell-name" class="label">Name</label>
        <input id="spell-name" class="form-control form-control-sm" v-model="filter.name" />
      </div>
      <div class="form-group">
      <label for="caster" class="label">Caster Class</label>
        <select id="caster" class="form-control form-control-sm" v-model="filter.caster">
          <option value="sor">Sorcerer</option>
          <option value="wiz">Wizard</option>
          <option value="cleric">Cleric</option>
          <option value="druid">Druid</option>
          <option value="ranger">Ranger</option>
          <option value="bard">Bard</option>
          <option value="paladin">Paladin</option>
          <option value="alchemist">Alchemist</option>
          <option value="summoner">Summoner</option>
          <option value="summoner_unchained">Summoner (unchained)</option>
          <option value="witch">Witch</option>
          <option value="inquisitor">Inquisitor</option>
          <option value="oracle">Oracle</option>
          <option value="antipaladin">Antipaladin</option>
          <option value="magus">Magus</option>
          <option value="adept">Adept</option>
          <option value="bloodrager">Bloodrager</option>
          <option value="shaman">Shaman</option>
          <option value="psychic">Psychic</option>
          <option value="medium">Medium</option>
          <option value="mesmerist">Mesmerist</option>
          <option value="occultist">Occultist</option>
          <option value="spiritualist">Spiritualist</option>
          <option value="skald">Skald</option>
          <option value="investigator">Investigator</option>
          <option value="hunter">Hunter</option>
        </select>
      </div>

      <div class="form-group">
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <span class="input-group-text">Level</span>
        </div>
        <input class="form-control form-control-sm" type="number" min="0" max="9" v-model="filter.minLevel" />
        <input class="form-control form-control-sm" type="number" min="0" max="9" v-model="filter.maxLevel" />
      </div>
      </div>
      <div class="form-group">
        <label for="school" class="label">Spell school</label>
        <select id="school" class="form-control form-control-sm" v-model="filter.school" multiple :size="schools.size">
          <option v-for="school in schools" :key="school">{{school}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="subschool" class="label">Subschool</label>
        <select id="subschool" class="form-control form-control-sm" v-model="filter.subschool" multiple :size="4">
          <option v-for="school in subschools" :key="school">{{school}}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="components" class="label">Components</label>
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
    <div class="spells">
      <card v-for="card in filtered"
        :key="card.title" :card="card" :caster="filter.caster"></card>
    </div>
  </div>
</template>

<script>
import Card from './components/Card.vue'
import Spells from './assets/spells.json'

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
  name: 'app',
  components: {
    Card
  },
  data: function() {
    return {
        cards: Spells,
        components: [
          { kind: "V", description: "Verbal" },
          { kind: "S", description: "Somatic" },
          { kind: "M", description: "Material" },
          { kind: "F", description: "Focus" },
          { kind: "DF", description: "Divine focus" },
        ],
        filter: {
          name: "",
          caster: "sor",
          minLevel: 0,
          maxLevel: 0,
          school: [],
          subschool: [],
          components: [],
        },
        order: "level"
    }
  },
  computed: {
    schools: function() {
      return new Set([...new Set(this.cards.map(card => card.school))].sort());
    },
    subschools: function() {
      return new Set([...new Set(this.cards.map(card => card.subschools).flat())].sort());
    },
    filtered: function() {
      var filtered = this.cards.filter(card => {
        return card[this.filter.caster] != null
          && card[this.filter.caster] >= this.filter.minLevel
          && card[this.filter.caster] <= this.filter.maxLevel
          && (this.filter.school.length == 0 || this.filter.school.includes(card["school"]))
          && (this.filter.subschool.length == 0 || [...this.filter.subschool].filter(s => card["subschools"].includes(s)).length > 0)
          && (this.filter.components.length == 0 || (card["components"].length == this.filter.components.length && card["components"].every(s => this.filter.components.includes(s))))
      });

      if (this.filter.name.length > 2) {
        return filtered.map(card => { 
          card.distance = levenshtein(this.filter.name, card.name)
          return card
        }).sort((a, b) => a.distance > b.distance)
      } else {
        if (this.order == "name") {
          return filtered.sort((a, b) => {
            if (a.name > b.name) return true;
            if (a[this.filter.caster] > b[this.filter.caster]) return true;
            return false;
          })
        } else {
          return filtered.sort((a, b) => {
            if (a[this.filter.caster] < b[this.filter.caster]) return false;
            if (a.name < b.name) return false;
            return true;
          })
        }
      }
      return filtered;
    }
  }
}
</script>

<style lang="sass">
@import "~bootstrap/scss/bootstrap";

@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  src: local('Open Sans'), local('OpenSans'), url('http://themes.googleusercontent.com/static/fonts/opensans/v5/cJZKeOuBrn4kERxqtaUH3T8E0i7KZn-EPnyo3HZu7kw.woff') format('woff');
}
* {
  box-sizing: border-box;
}

#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  flex-direction: row;
}

.filter {
  display: flex;
  flex-direction: column;
  width: 20vw;
  padding: 10px;
}

.spells {
  position: relative;
  width: 80vw;
  display: flex;
  flex-wrap: wrap;
}
</style>
