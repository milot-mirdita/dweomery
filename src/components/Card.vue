<template>
  <div class="card" :style="{ borderColor : card.color }">
    <div class="level">{{ card[caster] }}</div>
    <div class="card-inner">
      <h1 v-if="inBrowser"><a @click="$emit('selection')">{{ card.name }}<template v-if="knownSpells.includes(card.id)">&nbsp;<i class="fa fa-book text-muted"></i></template></a></h1>
      <h1 v-else>{{ card.name }}</h1>
      <hr :style="{ borderColor : card.color }" />
      <div>
        <div style="float:left">{{ card.school }}<span v-for="s in card.subschools" :key="s"><template v-if="s">, {{s}}</template></span></div>
        <div style="float:right">{{ card.components_summary }}</div>
      </div>
      <div class="summary">
        <span v-if="card.casting_time">
          <strong>T</strong>&thinsp;{{card.casting_time}}
        </span>
        <span v-if="card.range">
          <strong>R</strong>&thinsp;{{card.range}}
        </span>
        <span v-if="card.duration">
          <strong>D</strong>&thinsp;{{card.duration}}
        </span>
        <span v-if="card.saving_throw">
          <strong :class="{ 'strike-out' : (card.saving_throw == 'no') }">S</strong>&thinsp;<span :class="{ 'sr-only' : card.saving_throw == 'no' }" v-html="card.saving_throw"></span>&thinsp;
        </span>
        <span v-if="card.resistance">
          <strong :class="{ 'strike-out' : (card.resistance == 'no') }">X</strong>&thinsp;<span :class="{ 'sr-only' : card.resistance == 'no' }" v-html="card.resistance"></span>&thinsp;
        </span>
        <span v-for="a in card.area_targets" :key="a.kind">
            <strong>{{a.kind}}</strong>&thinsp;<span v-html="a.description"></span>
        </span>
      </div>
      <div class="text">
        <span v-html="card.description"></span>
        <span v-for="m in card.materials" :key="m.kind">
          <strong>{{m.kind}}</strong>&thinsp;<span v-html="m.description"></span>.
        </span>
      </div>
    </div>
    <div class="source">{{ card.source }}</div>
  </div>
</template>
<!-- 
https://gist.github.com/nathanmacinnes/3516393
http://jsfiddle.net/6L9xc7p0/1/
-->

<script>
export default {
  name: 'Card',
  props: {
    card: Object,
    caster: String,
    inBrowser: Boolean,
    knownSpells: {
      type: Array,
      default: []
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

  .source {
      position: absolute;
      bottom: -0.75mm;
      right: 0;
      font-family: 'PT Sans Narrow', sans-serif;
      font-size: 5pt;
      text-align: right;
      background-color: white;
      border-radius: 1mm;
      padding: 0mm 1mm;
  }

  .card-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 81mm;

    h1 {
      font-size: 10pt;
      margin: 0;

      a {
        color:inherit;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
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
  }
}

</style>
