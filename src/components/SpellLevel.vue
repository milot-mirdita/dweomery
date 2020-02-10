<template>
<div class="levels">
    <span v-if="range.min <= 0 && 0 <= range.max" @click="level(0)" @mouseover="hover = 0" @mouseleave="hover = null" aria-label="0" :class="['spell-0', 'triangle', 'up', { 'active':   (min <= 0 && 0 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 0 && 0 <= Math.max(hover, firstSelection)) }]"></span>
    <span v-if="range.min <= 1 && 1 <= range.max" @click="level(1)" @mouseover="hover = 1" @mouseleave="hover = null" aria-label="1" :class="['spell-1', 'triangle', 'down', { 'active': (min <= 1 && 1 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 1 && 1 <= Math.max(hover, firstSelection)) }]"></span>
    <span v-if="range.min <= 2 && 2 <= range.max" @click="level(2)" @mouseover="hover = 2" @mouseleave="hover = null" aria-label="2" :class="['spell-2', 'triangle', 'up', { 'active':   (min <= 2 && 2 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 2 && 2 <= Math.max(hover, firstSelection)) }]"></span>
    <span v-if="range.min <= 3 && 3 <= range.max" @click="level(3)" @mouseover="hover = 3" @mouseleave="hover = null" aria-label="3" :class="['spell-3', 'triangle', 'down', { 'active': (min <= 3 && 3 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 3 && 3 <= Math.max(hover, firstSelection)) }]"></span>
    <span v-if="range.min <= 4 && 4 <= range.max" @click="level(4)" @mouseover="hover = 4" @mouseleave="hover = null" aria-label="4" :class="['spell-4', 'triangle', 'up', { 'active':   (min <= 4 && 4 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 4 && 4 <= Math.max(hover, firstSelection)) }]"></span>
    <span v-if="range.min <= 5 && 5 <= range.max" @click="level(5)" @mouseover="hover = 5" @mouseleave="hover = null" aria-label="5" :class="['spell-5', 'triangle', 'down', { 'active': (min <= 5 && 5 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 5 && 5 <= Math.max(hover, firstSelection)) }]"></span>
    <span v-if="range.min <= 6 && 6 <= range.max" @click="level(6)" @mouseover="hover = 6" @mouseleave="hover = null" aria-label="6" :class="['spell-6', 'triangle', 'up', { 'active':   (min <= 6 && 6 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 6 && 6 <= Math.max(hover, firstSelection)) }]"></span>
    <span v-if="range.min <= 7 && 7 <= range.max" @click="level(7)" @mouseover="hover = 7" @mouseleave="hover = null" aria-label="7" :class="['spell-7', 'triangle', 'down', { 'active': (min <= 7 && 7 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 7 && 7 <= Math.max(hover, firstSelection)) }]"></span>
    <span v-if="range.min <= 8 && 8 <= range.max" @click="level(8)" @mouseover="hover = 8" @mouseleave="hover = null" aria-label="8" :class="['spell-8', 'triangle', 'up', { 'active':   (min <= 8 && 8 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 8 && 8 <= Math.max(hover, firstSelection)) }]"></span>
    <span v-if="range.min <= 9 && 9 <= range.max" @click="level(9)" @mouseover="hover = 9" @mouseleave="hover = null" aria-label="9" :class="['spell-9', 'triangle', 'down', { 'active': (min <= 9 && 9 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 9 && 9 <= Math.max(hover, firstSelection)) }]"></span>
    <span v-if="range.min <= 10 && 10 <= range.max" @click="level(10)" @mouseover="hover = 10" @mouseleave="hover = null" aria-label="10" :class="['spell-10', 'triangle', 'up', { 'active': (min <= 10 && 10 <= max), 'hover' : (firstSelection != null && Math.min(hover, firstSelection) <= 10 && 10 <= Math.max(hover, firstSelection)) }]"></span>
</div>
</template>

<script>
export default {
  name: 'SpellLevel',
  props: {
    value: Array,
    range: Object
  },
  data() {
    return {
      firstSelection: null,
      hover: null,
      min: this.value[0],
      max: this.value[1]
    };
  },
  methods: {
      level(num) {
          if (this.firstSelection == null) {
              this.min = -1;
              this.max = -1;
              this.firstSelection = num;
          } else {
              this.min = Math.min(this.firstSelection, num);
              this.max = Math.max(this.firstSelection, num);
              this.firstSelection = null;
              this.$emit('input', [this.min, this.max]);
          }
      }
  }
}
</script>


<style lang="sass" scoped>
.levels {
  position: relative;
  font-size: calc(var(--triangle-base) * 0.4);
  --triangle-base: 36px;
  --triangle-side: calc(var(--triangle-base) / 2);
  --t: transparent;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.levels {
    --triangle-base: 45px;
}

@media (min-width: 375px){ 
.levels {
    --triangle-base: 50px;
}
}

@media (min-width: 768px) { 
.levels {
    --triangle-base: 32px;
}

}
@media (min-width: 1025px) { 
.levels {
    --triangle-base: 36px;
}
}


.triangle {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  border-style: solid;
  transition : border 150ms ease-out;
}
.triangle::after {
  position: absolute;
  content: attr(aria-label);
}
.triangle:hover {
    font-weight: bold;
    cursor: pointer;
}
.up {
  border-width: 0 var(--triangle-side) var(--triangle-base) var(--triangle-side);
  border-color: var(--t) var(--t) #ddd var(--t);
}
.up::after {
  left: -0.5ch;
  bottom: calc(var(--triangle-base) * -0.85);
}
.down {
  margin-top: calc(var(--triangle-base) * 0.25);
  border-width: var(--triangle-base) var(--triangle-side) 0 var(--triangle-side);
  border-color: #ddd var(--t) var(--t) var(--t);
}

.down::after {
  left: -0.5ch;
  bottom: calc(var(--triangle-base) * 0.40);
}
.triangle:not(:first-child) {
  margin-left: calc(calc(var(--triangle-side) * -1) + 1px);
}

@-webkit-keyframes pulse {
    0% {
        filter: brightness(100%);
    }
    50% {
        filter: brightness(125%);
    }
    100% {
        filter: brightness(100%);
    }
}
.triangle.hover {
    animation-name: pulse;
    animation-duration: 1s;
    animation-iteration-count:infinite;
}

.spell-0.up.hover, .spell-0.up.active, .spell-0.up:hover { border-color: var(--t) var(--t) #FECE91 var(--t); color: #111; }
.spell-1.up.hover, .spell-1.up.active, .spell-1.up:hover { border-color: var(--t) var(--t) #FE9F6D var(--t); color: #111; }
.spell-2.up.hover, .spell-2.up.active, .spell-2.up:hover { border-color: var(--t) var(--t) #F76F5C var(--t); color: #222; }
.spell-3.up.hover, .spell-3.up.active, .spell-3.up:hover { border-color: var(--t) var(--t) #DE4968 var(--t); color: #222; }
.spell-4.up.hover, .spell-4.up.active, .spell-4.up:hover { border-color: var(--t) var(--t) #B63679 var(--t); color: #333; }
.spell-5.up.hover, .spell-5.up.active, .spell-5.up:hover { border-color: var(--t) var(--t) #8C2981 var(--t); color: #eee; }
.spell-6.up.hover, .spell-6.up.active, .spell-6.up:hover { border-color: var(--t) var(--t) #641A80 var(--t); color: #eee; }
.spell-7.up.hover, .spell-7.up.active, .spell-7.up:hover { border-color: var(--t) var(--t) #3B0F70 var(--t); color: #eee; }
.spell-8.up.hover, .spell-8.up.active, .spell-8.up:hover { border-color: var(--t) var(--t) #150E37 var(--t); color: #fff; }
.spell-9.up.hover, .spell-9.up.active, .spell-9.up:hover { border-color: var(--t) var(--t) #000004 var(--t); color: #fff; }
.spell-10.up.hover, .spell-10.up.active, .spell-10.up:hover { border-color: var(--t) var(--t) #000000 var(--t); color: #fff; }

.spell-0.down.hover, .spell-0.down.active, .spell-0.down:hover { border-color: #FECE91 var(--t) var(--t) var(--t); color: #111; }
.spell-1.down.hover, .spell-1.down.active, .spell-1.down:hover { border-color: #FE9F6D var(--t) var(--t) var(--t); color: #111; }
.spell-2.down.hover, .spell-2.down.active, .spell-2.down:hover { border-color: #F76F5C var(--t) var(--t) var(--t); color: #222; }
.spell-3.down.hover, .spell-3.down.active, .spell-3.down:hover { border-color: #DE4968 var(--t) var(--t) var(--t); color: #222; }
.spell-4.down.hover, .spell-4.down.active, .spell-4.down:hover { border-color: #B63679 var(--t) var(--t) var(--t); color: #333; }
.spell-5.down.hover, .spell-5.down.active, .spell-5.down:hover { border-color: #8C2981 var(--t) var(--t) var(--t); color: #eee; }
.spell-6.down.hover, .spell-6.down.active, .spell-6.down:hover { border-color: #641A80 var(--t) var(--t) var(--t); color: #eee; }
.spell-7.down.hover, .spell-7.down.active, .spell-7.down:hover { border-color: #3B0F70 var(--t) var(--t) var(--t); color: #eee; }
.spell-8.down.hover, .spell-8.down.active, .spell-8.down:hover { border-color: #150E37 var(--t) var(--t) var(--t); color: #fff; }
.spell-9.down.hover, .spell-9.down.active, .spell-9.down:hover { border-color: #000004 var(--t) var(--t) var(--t); color: #fff; }
.spell-10.down.hover, .spell-10.down.active, .spell-10.down:hover { border-color: #000000 var(--t) var(--t) var(--t); color: #fff; }

.spell-10.up::after, .spell-10.down::after { left: -1.05ch; }
</style>
