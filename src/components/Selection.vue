<template>
  <div class="selection form-group">
    <label class="label">{{name}}</label>
    <i aria-label="Clear selection" v-if="value.length > 0" @click="clear()" class="fa fa-broom float-right clear"></i>
    <ul>
      <li v-for="option in options" :class="{'selected' : isSelected(option)}" :key="optionValue(option)" @click="toggleOption(option)">
        <template v-if="symbols && typeof(symbols[option]) != 'undefined'">
          <span aria-hidden="true" class="magic-school" v-html="symbols[option]"></span>&nbsp;
        </template>
        {{optionText(option) == '' ? empty : optionText(option)}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Selection",
  props: {
    name: {
      type: String
    },
    options: {
      type: [Set, Array],
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    symbols: {
      type: Object,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    empty: {
      type: String,
      default: ''
    },
    transform: {
      type: Function,
      default: (x) => x
    }
  },
  methods: {
    optionText(option) {
      if (typeof(option) == 'object' && typeof(option.description) == "string") {
        return this.transform(option.description);
      }
      return this.transform(option);
    },
    optionValue(option) {
      if (typeof(option) == 'object' && typeof(option.kind) == "string") {
        return option.kind;
      }
      return option;
    },
    toggleOption(option) {
      const key = this.optionValue(option);
      const index = this.value.indexOf(key);
      if (index > -1) {
        this.value.splice(index, 1);
      } else {
        if (this.multiple) {
          this.value.push(key)
        } else {
          this.value = [key];
        }
      }
      this.$emit('input', this.value);
    },
    isSelected(option) {
      const key = this.optionValue(option);
      const index = this.value.indexOf(key);
      return index > -1;
    },
    clear() {
      this.value = [];
      this.$emit('input', this.value);
    }
  }
};
</script>

<style  lang="sass" scoped>
.selection {
  ul {
    margin: 0; padding: 0;
    font-size: 0.8em;

    li {
      display: inline-block;
      padding: 1px 3px;
      margin: 2px 3px 2px 2px;
      border: 1px solid #eee;
      cursor: pointer;

      &.selected {
        border: 1px solid #FCC950;
        font-weight: bold;
      }
    }
  }
}

.magic-school {
  font-family: 'DnDMagicSchools', 'Open Sans', Helvetica, Arial, sans-serif;
  font-weight: 400 !important;
}
</style>
