<template>
  <div class="card">
    <h1>{{ title }}</h1>
    <div class="level">{{ level }}</div>
    <hr />
    <div style="float:left">{{ school }}</div>
    <div style="float:right">{{ components }}</div>
    <div class="summary" v-html="summary"></div>
    <div class="text" v-html="text"></div>
  </div>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: String,
    level: Number,
    school: String,
    components: String,
    summary: String,
    text: String
  }
}
</script>

<style scoped lang="less">
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
  position: relative;
  width: 63mm;
  height: 88mm;
  border: 1.75mm solid black;
  border-radius: 1mm;
  padding: 1mm 1.5mm;
  text-align: left;
  font-size: 8pt;

  h1 {
    font-size: 10pt;
    margin: 0;
  }

  hr {
    margin: 0.5mm -0.5mm;
    border: none;
    border-top: 1px solid black;
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

  .summary {
    clear:both;
    padding-top:1mm;
    font-family: 'PT Sans Narrow', 'BenchNine', sans-serif;
    color: black;
  }

  .text {
    text-align: justify;
  }
}

</style>
