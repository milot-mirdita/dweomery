<template>
  <div class="card" :style="{ borderColor : colors[card.school] }">
    <div class="level" v-if="typeof(card[caster]) != 'undefined'">
      {{ card[caster] }}
    </div>
    <div class="level" v-else>
      {{ card["sla"] }}+
    </div>
    <div class="card-inner">
      <h1><a @click="$emit('selection')">{{ card.name }}<template v-if="knownSpells.includes(card.id)">&nbsp;<i class="fa fa-book text-muted"></i></template></a></h1>
      <hr :style="{ borderColor : colors[card.school] }" />
      <div>
        <div style="float:left">{{ card.school }}<span v-for="s in card.subschools" :key="s"><template v-if="s">, {{s}}</template></span></div>
        <div style="float:right">{{ card.components_summary }}</div>
      </div>
      <div class="summary">
        <span v-if="card.time">
          <strong>T</strong>&thinsp;{{card.time}}
        </span>
        <span v-if="card.range">
          <strong>R</strong>&thinsp;{{card.range}}
        </span>
        <span v-if="card.duration">
          <strong>D</strong>&thinsp;{{card.duration}}
        </span>
        <span v-if="card.save">
          <strong :class="{ 'strike-out' : (card.save == 'no') }">S</strong>&thinsp;<span :class="{ 'sr-only' : card.save == 'no' }" v-html="card.save"></span>&thinsp;
        </span>
        <span v-if="card.resistance">
          <strong :class="{ 'strike-out' : (card.resistance == 'no') }">X</strong>&thinsp;<span :class="{ 'sr-only' : card.resistance == 'no' }" v-html="card.resistance"></span>&thinsp;
        </span>
        <span v-for="a in card.area_targets" :key="a.kind">
            <strong>{{a.kind}}</strong>&thinsp;<span v-html="a.description"></span>
        </span>
      </div>
      <div class="text" v-html="description">
      </div>
    </div>
    <div class="descriptors">
      <template v-for="(d, i) in card.descriptors">{{d}}<template v-if="i < (card.descriptors.length - 1)">,&thinsp;</template></template>
    </div>
    <div class="source">{{ card.source }}</div>
  </div>
</template>

<script>
const SchoolColors = {
  "Abjuration" : "LightSteelBlue",
  "Conjuration" : "MidnightBlue",
  "Divination" : "indigo",
  "Enchantment" : "DarkOliveGreen",
  "Evocation" : "maroon",
  "Illusion" : "DarkSalmon",
  "Necromancy" : "dimgray",
  "Transmutation" : "DarkGoldenrod",
  "Universal" : "Gold",
  "See Text" : "LightSteelBlue"
}
export default {
  name: 'Card',
  props: {
    card: Object,
    caster: String,
    knownSpells: {
      type: Array,
      default: []
    }
  },
  computed: {
    colors: () => SchoolColors,
    description: function() {
      var description = this.card.description;
      const mat = this.card.materials;
      description += '<!--COMP-->'
      for (var i in mat) {
        description += ' <strong>' + mat[i].kind + '</strong>&thinsp;<span>' + mat[i].description + '</span>.'
      }
      return description;
    }
  }
}
</script>

<style scoped lang="sass">
.card {
  width: 63mm;
  height: 88mm;
  max-height: 88mm;
  border: 1.75mm solid black;
  border-radius: 1mm;
  text-align: left;
  font-size: 8pt;
  position: relative;
  margin: 5px;
  padding: 1mm 1.5mm;

  @media print {
    display: inline-block;
    page-break-inside: avoid;
  }

  .level {
    position: absolute;
    top: -0.75mm;
    right: -0.75mm;
    font-size: 12pt;
    width: 5mm;
    text-align: center;
    background-color: white;
    border-radius: 1mm;
  }

  .source, .descriptors {
    position: absolute;
    bottom: -0.75mm;
    font-family: 'PT Sans Narrow', sans-serif;
    font-size: 5pt;
    text-align: right;
    background-color: white;
    border-radius: 1mm;
    padding: 0mm 1mm;
  }

  .source {
    right: 0;
  }

  .descriptors {
    left: 0;
  }

  .card-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 81mm;

    .fa-book {
      @media print {
        display: none;
      }
    }

    h1 {
      font-size: 10pt;
      margin: 0;

      a {
        color:inherit;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }

        @media print {
          text-decoration: none;
        }
      }
    }

    hr {
      margin: 0.5mm -0.5mm;
      border: none;
      border-top: 1px solid black;
    }

    .summary {
      clear:both;
      margin-top:1mm;
      font-family: 'PT Sans Narrow', sans-serif;
      text-align: justify;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      flex-shrink: 0;

      .strike-out {
        position: relative;
        display: inline-box;

        &:before {
          position: absolute;
          content: "";
          left: -3px;
          top: 45%;
          right: -3px;
          border-top: 2px solid #555;

          transform:rotate(-30deg);
        }
      }
    }

    .text {
      text-align: justify;
      overflow-y: scroll;
      overflow-x: hidden;
      max-height: 100%;
    }

    @media print {
      overflow: hidden;
    }
  }
}

</style>
