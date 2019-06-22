<template>
  <div class="form-group">
    <label :for="id" class="label">{{name}}</label>
    <i v-if="value.length > 0" @click="value = [];" class="fa fa-broom float-right clear"></i>
    <select :id="id" class="form-control form-control-sm magic-school" v-model="value" :multiple="multiple" :size="size">
      <option v-for="option in options" :key="optionValue(option)" :value="optionValue(option)">
        <template v-if="!iOS && symbols && typeof(symbols[option]) != 'undefined'">
          <span class="magic-symbol" v-html="symbols[option]"></span>&nbsp;
        </template>
        {{optionText(option) == '' ? empty : optionText(option)}}
      </option>
    </select>
    <small v-if="hint != ''">{{hint}}</small>
  </div>
</template>

<script>
const iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
export default {
  name: "Selection",
  watch: {
    value: function() {
        this.$emit('input', this.value);
    }
  },
  computed: {
    iOS: () => {
      return iOS;
    }
  },
  props: {
    name: {
      type: String
    },
    hint: {
      type: String,
      default: ''
    },
    options: {
      type: Set|Array,
      default: []
    },
    selection: {
      type: Array,
      default: () => []
    },
    symbols: {
      type: Object,
      default: null
    },
    size: {
      type: String|Number,
      default: "4"
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
  data() {
    return {
      id: null,
      value: this.selection
    };
  },
  mounted() {
    this.id = this._uid;
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
    }
  }
};
</script>