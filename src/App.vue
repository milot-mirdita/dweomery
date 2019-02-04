<template>
  <div id="app">
    <card v-for="card in cards"
      :key="card.title"
      :title="card.title"
      :level="card.level"
      :school="card.school"
      :components="card.components"
      :summary="card.summary"
      :text="card.text"
      ></card>
  </div>
</template>

<script>
import Card from './components/Card.vue'

export default {
  name: 'app',
  components: {
    Card
  },
  data: function() {
    return {
        cards: [{
        title: "Acid Arrow",
        level: 2,
        school: "Conjuration, Creation",
        components: "V,S,M,F",
        summary: '<span style="display:flex; justify-content:space-between; flex-wrap: wrap; padding: 0 1px;"><span style="display:inline-block;"><strong>T</strong>&#8201;1std</span> <span style="display:inline-block;"><strong>R</strong>&#8201;400ft+40ft/cl</span> <span style="display:inline-block;"><strong>D</strong>&#8201;1rd+1rd/3cl</span> <span style="display:inline-block;"><strong>S</strong>&#8201;✗</span> <span style="display:inline-block;"><strong>X</strong>&#8201;✗</span></span>',
        text: "An arrow of acid springs from your hand and speeds to its target. You must succeed on a ranged touch attack to hit your target. The arrow deals <strong>2d4 </strong>points of acid damage with no splash damage. For every three caster levels you possess, the acid, unless neutralized, lasts for another round (to a maximum of 6 additional rounds at 18th level), dealing another <strong>2d4 </strong>points of damage in each round. <strong>M</strong> Rhubarb leaf and an adder's stomach. <strong>F</strong> A dart."
        
      }]
    }
  }
}
</script>

<style lang="less">
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 400;
  src: local('Open Sans'), local('OpenSans'), url('http://themes.googleusercontent.com/static/fonts/opensans/v5/cJZKeOuBrn4kERxqtaUH3T8E0i7KZn-EPnyo3HZu7kw.woff') format('woff');
}

#app {
  font-family: 'Open Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
