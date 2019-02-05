<template>
  <div class="card" :style="{ borderColor : card.color }">
    <div class="level">{{ card[caster] }}</div>
    <div class="card-inner">
      <h1>{{ card.name }}</h1>
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
          <strong>S</strong>&thinsp;<span v-html="card.saving_throw"></span>
        </span>
        <span v-if="card.resistance">
          <strong>X</strong>&thinsp;<span v-html="card.resistance"></span>
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
    caster: String
  }
}
</script>

<style scoped lang="sass">
@font-face {
  font-family: 'BenchNine';
  font-style: normal;
  font-weight: 400;
  src: local('BenchNine Regular'), local('BenchNine-Regular'), url(https://fonts.gstatic.com/s/benchnine/v7/ahcbv8612zF4jxrwMosbUMl0r06wow.woff2) format('woff2');
}

@font-face {
  font-family: 'PT Sans Narrow';
  font-style: normal;
  font-weight: 400;
  src: local('PT Sans Narrow'), local('PTSans-Narrow'), url(https://fonts.gstatic.com/s/ptsansnarrow/v9/BngRUXNadjH0qYEzV7ab-oWlsbCGwR2oefDo.woff2) format('woff2');
}

.card {
  box-sizing: border-box;
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
      font-family: 'PT Sans Narrow', 'BenchNine', sans-serif;
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
    }

    hr {
      margin: 0.5mm -0.5mm;
      border: none;
      border-top: 1px solid black;
    }

    .summary {
      clear:both;
      margin-top:1mm;
      font-family: 'PT Sans Narrow', 'BenchNine', sans-serif;
      text-align: justify;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .text {
      text-align: justify;
      overflow: scroll;
      max-height: 100%;
    }
  }
}

</style>
