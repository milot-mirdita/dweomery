<template>
  <div class="card" :style="{ borderColor : color }">
    <div class="level">
      {{ card["level"] }}
    </div>
    <div class="card-inner">
      <h1><a @click="$emit('selection')">{{ card.name }}<template v-if="knownSpells.includes(card.id)">&nbsp;<i class="fa fa-book text-muted"></i></template></a></h1>
      <hr :style="{ borderColor : color }" />
        <div class="summary">
        <span>
          <strong class="actions" :style="{ color : color }">{{ actions }}</strong><template v-if="describeAction">&thinsp;{{ card.actions[0] }}</template>
        </span>
        <span v-if="card.components">
          <strong>C</strong>&thinsp;{{ card.components.sort().reverse().map(c => c[0]).join(',&thinsp;') }}
        </span>
        <span v-if="card.area">
          <strong>A</strong>&thinsp;{{card.area}}
        </span>
        <span v-if="card.range">
          <strong>R</strong>&thinsp;{{card.range}}
        </span>
        <span v-if="card.save">
          <strong>S</strong>&thinsp;{{card.save}}
        </span>
        <template v-if="(card.duration || '').length < (card.targets || '').length">
          <span v-if="card.duration">
            <strong>D</strong>&thinsp;{{card.duration}}
          </span>
          <span v-if="card.targets">
            <strong>T</strong>&thinsp;{{card.targets}}
          </span>
        </template>
        <template v-else>
          <span v-if="card.targets">
            <strong>T</strong>&thinsp;{{card.targets}}
          </span>
          <span v-if="card.duration">
            <strong>D</strong>&thinsp;{{card.duration}}
          </span>
        </template>
      </div>
      <div class="text" :class="card.expanded ? 'expanded' : ''" v-html="card.description"></div>
    </div>
    <div class="descriptors" :style="{'font-size' : card.traits.length > 5 ? '6pt' : null}">
      <template v-for="(d, i) in card.traits">{{d}}<template v-if="i < (card.traits.length - 1)">,&thinsp;</template></template>
    </div>
    <div class="source">{{ card.source }}&thinsp;{{ card.page }}</div>
  </div>
</template>

<script>
import { SchoolColors } from '../lib/constants'

export default {
  name: 'Card',
  props: {
    card: Object,
    caster: String,
    knownSpells: {
      type: Array,
      default: () => []
    }
  },
  data: function() {
    return {
      describeAction: false
    }
  },
  computed: {
    colors: () => SchoolColors,
    color: function() {
      for (var key in SchoolColors) {
        if (!SchoolColors.hasOwnProperty(key)) continue;
        if (this.card.traits.includes(key)) {
          return SchoolColors[key];
        }
      }
      return SchoolColors["See Text"];
    },
    actions: function(){
      this.describeAction = false;
      if (this.card.actions.includes('R') || this.card.actions.includes('F')) {
        this.describeAction = true;
        return "⬨⬨⬨";
      }
      var res = '';
      res += this.card.actions.includes('3') || this.card.actions.includes('2') || this.card.actions.includes('1') ? '⬧' : '⬨';
      res += this.card.actions.includes('3') || this.card.actions.includes('2') ? '⬧' : '⬨';
      res += this.card.actions.includes('3') ? '⬧' : '⬨';
      if (res == '⬨⬨⬨') {
        this.describeAction = true;
        return '⬧⬧⬧';
      }
      return res;
    }
  }
}
</script>

<style lang="sass">
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

  .actions {
    letter-spacing: -1.5pt;
    display: inline-block;
    position: relative;
    top: -0.75pt;
    margin-right: 1pt;
  }
  .time {
    color: #2c3e50;
    font-size: 7pt;
    position: absolute;
    width: 5.5mm;
    text-align: center;
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
    font-size: 7pt;
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
    height: 80mm;

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

      &.expanded {
        overflow-y: hidden;
        &:after {
          content: "";
          display: inline-block;
          width: 100%;
        }
      }
    }

    @media print {
      overflow: hidden;
    }
  }
}

</style>
